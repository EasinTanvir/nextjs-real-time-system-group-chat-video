const { db } = require("../db/client");
const { AppError } = require("../utils/app-error");
const { createGroupConversationTx } = require("./conversation-service");
const { getFriendIds } = require("./friend-service");
const { getIO } = require("../lib/socket-instance");
const { eq, and, isNull, inArray } = require("drizzle-orm");
const { conversations, conversationMembers, users } = require("../db/schema");

async function createGroup(creatorId, name, memberIds) {
  if (!name || !name.trim()) throw new AppError("Group name is required", 400);
  if (!Array.isArray(memberIds) || memberIds.length < 1) {
    throw new AppError("Select at least 1 friend to create a group", 400);
  }

  const friendIds = await getFriendIds(creatorId);
  const friendIdSet = new Set(friendIds);
  const invalid = memberIds.filter((id) => !friendIdSet.has(id));
  if (invalid.length > 0)
    throw new AppError("You can only add friends to a group", 400);

  const conversation = await db.transaction((tx) =>
    createGroupConversationTx(tx, creatorId, name.trim(), memberIds),
  );

  const allMemberIds = Array.from(new Set([creatorId, ...memberIds]));

  const payload = {
    conversationId: conversation.id,
    type: "group",
    name: conversation.name,
    avatarUrl: conversation.avatarUrl,
    memberCount: allMemberIds.length,
    otherUser: null,
    lastMessage: null,
    lastMessageAt: null,
    unreadCount: 0,
  };

  try {
    const io = getIO();
    for (const uid of allMemberIds) {
      io.to(String(uid)).emit("conversation:new", { conversation: payload });
    }
  } catch (err) {
    console.error("Socket emit failed:", err.message);
  }

  return conversation;
}

async function assertGroupAdmin(conversationId, userId) {
  const conversation = await db.query.conversations.findFirst({
    where: eq(conversations.id, conversationId),
  });
  if (!conversation) throw new AppError("Group not found", 404);
  if (conversation.type !== "group")
    throw new AppError("Not a group conversation", 400);

  const member = await db.query.conversationMembers.findFirst({
    where: and(
      eq(conversationMembers.conversationId, conversationId),
      eq(conversationMembers.userId, userId),
      isNull(conversationMembers.leftAt),
    ),
  });
  if (!member) throw new AppError("Not a member of this group", 403);
  if (!["owner", "admin"].includes(member.role)) {
    throw new AppError("Only group owner or admin can add members", 403);
  }

  return conversation;
}

async function addGroupMembers(conversationId, requesterId, newMemberIds) {
  if (!Array.isArray(newMemberIds) || newMemberIds.length === 0) {
    throw new AppError("Select at least 1 friend to add", 400);
  }

  const conversation = await assertGroupAdmin(conversationId, requesterId);

  // only your own friends can be added — same rule as group creation
  const friendIds = await getFriendIds(requesterId);
  const friendIdSet = new Set(friendIds);
  const invalid = newMemberIds.filter((id) => !friendIdSet.has(id));
  if (invalid.length > 0)
    throw new AppError("You can only add your friends to a group", 400);

  // filter out anyone already an active member
  const existingMembers = await db.query.conversationMembers.findMany({
    where: and(
      eq(conversationMembers.conversationId, conversationId),
      isNull(conversationMembers.leftAt),
    ),
    columns: { userId: true },
  });
  const existingIds = new Set(existingMembers.map((m) => m.userId));
  const toAdd = newMemberIds.filter((id) => !existingIds.has(id));

  if (toAdd.length === 0) {
    throw new AppError("All selected users are already members", 409);
  }

  await db
    .insert(conversationMembers)
    .values(
      toAdd.map((userId) => ({ conversationId, userId, role: "member" })),
    );

  const addedUsers = await db
    .select({
      id: users.id,
      username: users.username,
      avatarUrl: users.avatarUrl,
    })
    .from(users)
    .where(inArray(users.id, toAdd));

  const allMembers = await db.query.conversationMembers.findMany({
    where: and(
      eq(conversationMembers.conversationId, conversationId),
      isNull(conversationMembers.leftAt),
    ),
    columns: { userId: true },
  });
  const memberCount = allMembers.length;

  try {
    const io = getIO();

    // notify existing members: roster + count changed
    for (const m of allMembers) {
      io.to(String(m.userId)).emit("group:members-added", {
        conversationId,
        addedUsers,
        memberCount,
      });
    }

    // give newly added users the conversation itself, so it appears in their sidebar
    for (const newUser of addedUsers) {
      io.to(String(newUser.id)).emit("conversation:new", {
        conversation: {
          conversationId: conversation.id,
          type: "group",
          name: conversation.name,
          avatarUrl: conversation.avatarUrl,
          memberCount,
          otherUser: null,
          lastMessage: null,
          lastMessageAt: conversation.lastMessageAt,
          unreadCount: 0,
        },
      });
    }
  } catch (err) {
    console.error("Socket emit failed:", err.message);
  }

  return { addedUsers, memberCount };
}

module.exports = { createGroup, addGroupMembers };
