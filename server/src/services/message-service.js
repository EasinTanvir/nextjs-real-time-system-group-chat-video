const { and, desc, eq, lt, or } = require("drizzle-orm");
const { db } = require("../db/client");
const { conversations, conversationMembers, messageReads, messages, users } = require("../db/schema");
const { AppError } = require("../utils/app-error");
const { requireConversation, requireMember } = require("./conversation-service");
const messageRow = (message, sender) => ({ ...message, sender: sender && { id: sender.id, username: sender.username, displayName: sender.displayName, avatarUrl: sender.avatarUrl } });
const refreshLastMessage = async (tx, conversationId) => {
  const latest = (await tx.select().from(messages).where(eq(messages.conversationId, conversationId)).orderBy(desc(messages.createdAt), desc(messages.id)).limit(1))[0];
  await tx.update(conversations).set({ lastMessageId: latest?.id || null, lastMessageAt: latest?.createdAt || null, updatedAt: new Date() }).where(eq(conversations.id, conversationId));
};
const list = async (actorId, conversationId, { limit, cursor }) => {
  await requireConversation(db, conversationId); await requireMember(db, conversationId, actorId);
  const filters = [eq(messages.conversationId, conversationId)];
  if (cursor) { const item = (await db.select().from(messages).where(and(eq(messages.id, cursor), eq(messages.conversationId, conversationId))).limit(1))[0]; if (!item) throw new AppError(400, "Invalid message cursor."); filters.push(or(lt(messages.createdAt, item.createdAt), and(eq(messages.createdAt, item.createdAt), lt(messages.id, item.id)))); }
  const rows = await db.select({ message: messages, sender: users }).from(messages).innerJoin(users, eq(users.id, messages.senderId)).where(and(...filters)).orderBy(desc(messages.createdAt), desc(messages.id)).limit(limit + 1);
  const hasMore = rows.length > limit;
  return { items: rows.slice(0, limit).map(({ message, sender }) => messageRow(message, sender)), nextCursor: hasMore ? rows[limit - 1]?.message.id : null };
};
const create = async (actorId, conversationId, content) => db.transaction(async (tx) => { await requireConversation(tx, conversationId); await requireMember(tx, conversationId, actorId); const [message] = await tx.insert(messages).values({ conversationId, senderId: actorId, content }).returning(); await tx.update(conversations).set({ lastMessageId: message.id, lastMessageAt: message.createdAt, updatedAt: new Date() }).where(eq(conversations.id, conversationId)); return message; });
const edit = async (actorId, conversationId, messageId, content) => { await requireMember(db, conversationId, actorId); const message = (await db.select().from(messages).where(and(eq(messages.id, messageId), eq(messages.conversationId, conversationId))).limit(1))[0]; if (!message) throw new AppError(404, "Message not found."); if (message.senderId !== actorId) throw new AppError(403, "Only the message author can edit it."); const [updated] = await db.update(messages).set({ content, updatedAt: new Date() }).where(eq(messages.id, messageId)).returning(); return updated; };
const remove = async (actorId, conversationId, messageId) => db.transaction(async (tx) => { await requireMember(tx, conversationId, actorId); const message = (await tx.select().from(messages).where(and(eq(messages.id, messageId), eq(messages.conversationId, conversationId))).limit(1))[0]; if (!message) throw new AppError(404, "Message not found."); if (message.senderId !== actorId) throw new AppError(403, "Only the message author can delete it."); await tx.delete(messages).where(eq(messages.id, messageId)); await refreshLastMessage(tx, conversationId); });
const markRead = async (actorId, conversationId, messageId) => db.transaction(async (tx) => { await requireMember(tx, conversationId, actorId); const message = (await tx.select().from(messages).where(and(eq(messages.id, messageId), eq(messages.conversationId, conversationId))).limit(1))[0]; if (!message) throw new AppError(404, "Message not found."); await tx.insert(messageReads).values({ messageId, userId: actorId, readAt: new Date() }).onConflictDoUpdate({ target: [messageReads.messageId, messageReads.userId], set: { readAt: new Date() } }); const [member] = await tx.update(conversationMembers).set({ lastReadMessageId: messageId, lastReadAt: new Date() }).where(and(eq(conversationMembers.conversationId, conversationId), eq(conversationMembers.userId, actorId))).returning(); return member; });

module.exports = { list, create, edit, remove, markRead };
