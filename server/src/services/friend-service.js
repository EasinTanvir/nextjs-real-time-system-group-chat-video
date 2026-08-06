const { and, desc, eq, or } = require("drizzle-orm");
const { db } = require("../db/client");
const { friendRequests, friendships, users, conversations, conversationMembers } = require("../db/schema");
const { AppError } = require("../utils/app-error");
const { getUser, publicUser } = require("./user-service");
const { create: createNotification } = require("./notification-service");
const pair = (a, b) => a < b ? [a, b] : [b, a];
const isFriends = async (client, a, b) => { const [one, two] = pair(a, b); return (await client.select({ id: friendships.id }).from(friendships).where(and(eq(friendships.userOneId, one), eq(friendships.userTwoId, two))).limit(1))[0]; };

const createRequest = async (senderId, receiverId) => db.transaction(async (tx) => {
  if (senderId === receiverId) throw new AppError(422, "You cannot send a friend request to yourself.");
  if (!(await getUser(receiverId))) throw new AppError(404, "User not found.");
  if (await isFriends(tx, senderId, receiverId)) throw new AppError(409, "You are already friends.");
  const reverse = (await tx.select().from(friendRequests).where(and(eq(friendRequests.senderId, receiverId), eq(friendRequests.receiverId, senderId), eq(friendRequests.status, "pending"))).limit(1))[0];
  if (reverse) throw new AppError(409, "That user has already sent you a friend request. Accept or reject it instead.");
  const [request] = await tx.insert(friendRequests).values({ senderId, receiverId }).returning();
  const sender = await getUser(senderId);
  const notification = await createNotification(tx, { recipientId: receiverId, actorId: senderId, type: "friend_request", title: "New friend request", description: `${sender.displayName} wants to connect.` });
  return { request, notification };
});
const listRequests = async (userId, kind) => {
  const where = kind === "sent" ? eq(friendRequests.senderId, userId) : eq(friendRequests.receiverId, userId);
  const rows = await db.select({ request: friendRequests, user: users }).from(friendRequests).innerJoin(users, eq(users.id, kind === "sent" ? friendRequests.receiverId : friendRequests.senderId)).where(where).orderBy(desc(friendRequests.createdAt));
  return rows.map(({ request, user }) => ({ ...request, [kind === "sent" ? "receiver" : "sender"]: publicUser(user) }));
};
const respond = async (actorId, requestId, status) => db.transaction(async (tx) => {
  const request = (await tx.select().from(friendRequests).where(eq(friendRequests.id, requestId)).limit(1))[0];
  if (!request) throw new AppError(404, "Friend request not found.");
  if (request.receiverId !== actorId) throw new AppError(403, "Only the recipient can respond to this request.");
  if (request.status !== "pending") throw new AppError(409, "This friend request has already been handled.");
  const [updated] = await tx.update(friendRequests).set({ status, respondedAt: new Date(), updatedAt: new Date() }).where(eq(friendRequests.id, requestId)).returning();
  let conversation;
  let notification;
  if (status === "accepted") {
    const [one, two] = pair(request.senderId, request.receiverId);
    await tx.insert(friendships).values({ userOneId: one, userTwoId: two }).onConflictDoNothing();
    conversation = (await tx.select().from(conversations).where(and(eq(conversations.directUserOneId, one), eq(conversations.directUserTwoId, two))).limit(1))[0];
    if (!conversation) {
      [conversation] = await tx.insert(conversations).values({ type: "direct", directUserOneId: one, directUserTwoId: two, createdById: actorId }).returning();
      await tx.insert(conversationMembers).values([{ conversationId: conversation.id, userId: one, role: "member" }, { conversationId: conversation.id, userId: two, role: "member" }]);
    }
    const actor = await getUser(actorId);
    notification = await createNotification(tx, { recipientId: request.senderId, actorId, conversationId: conversation.id, type: "friend_accepted", title: "Friend request accepted", description: `${actor.displayName} is now your friend.` });
  } else {
    const actor = await getUser(actorId);
    notification = await createNotification(tx, { recipientId: request.senderId, actorId, type: "friend_rejected", title: "Friend request declined", description: `${actor.displayName} declined your friend request.` });
  }
  return { request: updated, conversation, notification };
});
const cancel = async (actorId, requestId) => {
  const request = (await db.select().from(friendRequests).where(eq(friendRequests.id, requestId)).limit(1))[0];
  if (!request) throw new AppError(404, "Friend request not found.");
  if (request.senderId !== actorId) throw new AppError(403, "Only the sender can cancel this request.");
  if (request.status !== "pending") throw new AppError(409, "Only pending requests can be cancelled.");
  const [updated] = await db.update(friendRequests).set({ status: "cancelled", updatedAt: new Date() }).where(eq(friendRequests.id, requestId)).returning();
  return updated;
};
const listFriends = async (userId) => {
  const rows = await db.select({ friendship: friendships, user: users }).from(friendships).innerJoin(users, or(and(eq(friendships.userOneId, userId), eq(users.id, friendships.userTwoId)), and(eq(friendships.userTwoId, userId), eq(users.id, friendships.userOneId)))).where(or(eq(friendships.userOneId, userId), eq(friendships.userTwoId, userId))).orderBy(desc(friendships.createdAt));
  return rows.map(({ friendship, user }) => ({ ...publicUser(user), friendsSince: friendship.createdAt }));
};
const removeFriend = async (userId, friendId) => { const [one, two] = pair(userId, friendId); const removed = await db.delete(friendships).where(and(eq(friendships.userOneId, one), eq(friendships.userTwoId, two))).returning(); if (!removed.length) throw new AppError(404, "Friendship not found."); };

module.exports = { isFriends, createRequest, listRequests, respond, cancel, listFriends, removeFriend };
