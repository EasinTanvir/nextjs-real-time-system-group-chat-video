const { eq, and, or, inArray, notInArray, desc } = require("drizzle-orm");
const { db } = require("../db/client");
const {
  users,
  friendRequests,
  friendships,
  conversations,
} = require("../db/schema");
const { AppError } = require("../utils/app-error");
const { createDirectConversationTx } = require("./conversation-service");
const { createNotification } = require("./notification-service");
const { getConnectedUsers, getIO } = require("../lib/socket-instance");

async function sendFriendRequest(senderId, receiverId) {
  if (senderId === receiverId) {
    throw new AppError("You cannot send a friend request to yourself", 400);
  }

  const receiver = await db.query.users.findFirst({
    where: eq(users.id, receiverId),
  });
  if (!receiver) throw new AppError("User not found", 404);

  const sender = await db.query.users.findFirst({
    where: eq(users.id, senderId),
    columns: {
      username: true,
    },
  });

  const [userOneId, userTwoId] = [senderId, receiverId].sort();
  const existingFriendship = await db.query.friendships.findFirst({
    where: and(
      eq(friendships.userOneId, userOneId),
      eq(friendships.userTwoId, userTwoId),
    ),
  });
  if (existingFriendship)
    throw new AppError("You are already friends with this user", 409);

  // block both directions — this is the "can't both send at once" rule you mentioned
  const existingRequest = await db.query.friendRequests.findFirst({
    where: and(
      or(
        and(
          eq(friendRequests.senderId, senderId),
          eq(friendRequests.receiverId, receiverId),
        ),
        and(
          eq(friendRequests.senderId, receiverId),
          eq(friendRequests.receiverId, senderId),
        ),
      ),
      eq(friendRequests.status, "pending"),
    ),
  });

  if (existingRequest) {
    if (existingRequest.senderId === receiverId) {
      throw new AppError(
        "This user already sent you a request — respond to it instead",
        409,
      );
    }
    throw new AppError("Friend request already sent", 409);
  }

  try {
    const [request] = await db
      .insert(friendRequests)
      .values({ senderId, receiverId })
      .returning();
    await createNotification({
      recipientId: receiverId,
      actorId: senderId,
      type: "friend_request",
      title: `${sender.username} sent you a friend request`,
      description: "You have a new friend request",
    });
    return request;
  } catch (err) {
    if (err.code === "23505")
      throw new AppError("Friend request already exists", 409); // race-condition fallback
    throw err;
  }
}

async function respondToFriendRequest(requestId, userId, action) {
  const request = await db.query.friendRequests.findFirst({
    where: eq(friendRequests.id, requestId),
  });
  if (!request) throw new AppError("Friend request not found", 404);
  if (request.receiverId !== userId)
    throw new AppError("Not authorized to respond to this request", 403);
  if (request.status !== "pending")
    throw new AppError("This request has already been responded to", 409);

  const responder = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: {
      username: true,
    },
  });

  if (!responder) {
    throw new AppError("User not found", 404);
  }

  if (action === "reject") {
    const [updated] = await db
      .update(friendRequests)
      .set({ status: "rejected", respondedAt: new Date() })
      .where(eq(friendRequests.id, requestId))
      .returning();

    await createNotification({
      recipientId: request.senderId,
      actorId: userId,
      type: "friend_rejected",
      title: `${responder.username} rejected your friend request`,
      description: "Your friend request was rejected",
    });
    return { request: updated };
  }

  // action === "accept" — do everything in one transaction
  return await db.transaction(async (tx) => {
    const [updated] = await tx
      .update(friendRequests)
      .set({ status: "accepted", respondedAt: new Date() })
      .where(eq(friendRequests.id, requestId))
      .returning();

    const [userOneId, userTwoId] = [
      request.senderId,
      request.receiverId,
    ].sort();

    const [friendship] = await tx
      .insert(friendships)
      .values({ userOneId, userTwoId })
      .returning();

    const conversation = await createDirectConversationTx(
      tx,
      request.senderId,
      request.receiverId,
    );

    try {
      const io = getIO();
      const connectedUsers = getConnectedUsers();

      const isSenderOnline = connectedUsers.has(String(request.senderId));
      const isReceiverOnline = connectedUsers.has(String(request.receiverId));

      // Notify Receiver about Sender
      io.to(String(request.receiverId)).emit("friendship:created", {
        newFriendId: String(request.senderId),
        isOnline: isSenderOnline,
      });

      // Notify Sender about Receiver
      io.to(String(request.senderId)).emit("friendship:created", {
        newFriendId: String(request.receiverId),
        isOnline: isReceiverOnline,
      });
    } catch (err) {
      console.error("Failed to emit friendship:created:", err.message);
    }

    await createNotification(
      {
        recipientId: request.senderId,
        actorId: userId,
        conversationId: conversation.id,
        type: "friend_accepted",
        title: `${responder.username} accepted your friend request`,
        description: "Your friend request was accepted",
      },
      tx,
    );

    return { request: updated, friendship, conversation };
  });
}

async function cancelFriendRequest(requestId, userId) {
  const request = await db.query.friendRequests.findFirst({
    where: eq(friendRequests.id, requestId),
  });
  if (!request) throw new AppError("Friend request not found", 404);
  if (request.senderId !== userId)
    throw new AppError("Not authorized to cancel this request", 403);
  if (request.status !== "pending")
    throw new AppError("Only pending requests can be cancelled", 409);

  const [updated] = await db
    .update(friendRequests)
    .set({ status: "cancelled", respondedAt: new Date() })
    .where(eq(friendRequests.id, requestId))
    .returning();
  return updated;
}

async function listIncomingRequests(userId) {
  return db
    .select({
      id: friendRequests.id,
      status: friendRequests.status,
      createdAt: friendRequests.createdAt,
      sender: {
        id: users.id,
        username: users.username,
        avatarUrl: users.avatarUrl,
      },
    })
    .from(friendRequests)
    .innerJoin(users, eq(friendRequests.senderId, users.id))
    .where(
      and(
        eq(friendRequests.receiverId, userId),
        eq(friendRequests.status, "pending"),
      ),
    )
    .orderBy(desc(friendRequests.createdAt));
}

async function listOutgoingRequests(userId) {
  return db
    .select({
      id: friendRequests.id,
      status: friendRequests.status,
      createdAt: friendRequests.createdAt,
      receiver: {
        id: users.id,
        username: users.username,
        avatarUrl: users.avatarUrl,
      },
    })
    .from(friendRequests)
    .innerJoin(users, eq(friendRequests.receiverId, users.id))
    .where(
      and(
        eq(friendRequests.senderId, userId),
        eq(friendRequests.status, "pending"),
      ),
    )
    .orderBy(desc(friendRequests.createdAt));
}

async function listFriends(userId) {
  const pairs = await db
    .select({
      userOneId: friendships.userOneId,
      userTwoId: friendships.userTwoId,
    })
    .from(friendships)
    .where(
      or(eq(friendships.userOneId, userId), eq(friendships.userTwoId, userId)),
    );

  if (pairs.length === 0) return [];

  const friendIds = pairs.map((p) =>
    p.userOneId === userId ? p.userTwoId : p.userOneId,
  );

  const [friendUsers, convos] = await Promise.all([
    db
      .select({
        id: users.id,
        username: users.username,
        avatarUrl: users.avatarUrl,
        lastSeenAt: users.lastSeenAt,
      })
      .from(users)
      .where(inArray(users.id, friendIds)),
    db
      .select({
        id: conversations.id,
        directUserOneId: conversations.directUserOneId,
        directUserTwoId: conversations.directUserTwoId,
        lastMessageAt: conversations.lastMessageAt,
      })
      .from(conversations)
      .where(
        and(
          eq(conversations.type, "direct"),
          or(
            eq(conversations.directUserOneId, userId),
            eq(conversations.directUserTwoId, userId),
          ),
        ),
      ),
  ]);

  const convoByOtherUserId = new Map();
  for (const c of convos) {
    const otherId =
      c.directUserOneId === userId ? c.directUserTwoId : c.directUserOneId;
    convoByOtherUserId.set(otherId, c);
  }

  return friendUsers.map((u) => ({
    ...u,
    conversationId: convoByOtherUserId.get(u.id)?.id ?? null,
    lastMessageAt: convoByOtherUserId.get(u.id)?.lastMessageAt ?? null,
  }));
}

// users who are NOT friends yet — annotated with pending-request state so the UI
// can show "Add" / "Pending" / "Respond"
async function discoverUsers(userId) {
  const [friendPairs, pendingRequests] = await Promise.all([
    db
      .select({
        userOneId: friendships.userOneId,
        userTwoId: friendships.userTwoId,
      })
      .from(friendships)
      .where(
        or(
          eq(friendships.userOneId, userId),
          eq(friendships.userTwoId, userId),
        ),
      ),
    db
      .select({
        id: friendRequests.id,
        senderId: friendRequests.senderId,
        receiverId: friendRequests.receiverId,
      })
      .from(friendRequests)
      .where(
        and(
          or(
            eq(friendRequests.senderId, userId),
            eq(friendRequests.receiverId, userId),
          ),
          eq(friendRequests.status, "pending"),
        ),
      ),
  ]);

  const friendIds = friendPairs.map((p) =>
    p.userOneId === userId ? p.userTwoId : p.userOneId,
  );

  const pendingByOtherUserId = new Map();
  for (const r of pendingRequests) {
    const otherId = r.senderId === userId ? r.receiverId : r.senderId;
    pendingByOtherUserId.set(otherId, {
      requestId: r.id,
      direction: r.senderId === userId ? "sent" : "received",
    });
  }

  const excludeIds = [userId, ...friendIds];

  const candidates = await db
    .select({
      id: users.id,
      username: users.username,
      avatarUrl: users.avatarUrl,
    })
    .from(users)
    .where(notInArray(users.id, excludeIds));

  return candidates.map((u) => {
    const pending = pendingByOtherUserId.get(u.id);
    return {
      ...u,
      friendStatus: pending
        ? pending.direction === "sent"
          ? "pending_sent"
          : "pending_received"
        : "none",
      requestId: pending?.requestId ?? null,
    };
  });
}

async function getFriendIds(userId) {
  const pairs = await db
    .select({
      userOneId: friendships.userOneId,
      userTwoId: friendships.userTwoId,
    })
    .from(friendships)
    .where(
      or(eq(friendships.userOneId, userId), eq(friendships.userTwoId, userId)),
    );
  return pairs.map((p) => (p.userOneId === userId ? p.userTwoId : p.userOneId));
}

module.exports = {
  sendFriendRequest,
  respondToFriendRequest,
  cancelFriendRequest,
  listIncomingRequests,
  listOutgoingRequests,
  listFriends,
  discoverUsers,
  getFriendIds,
};
