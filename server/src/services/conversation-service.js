const { and, desc, eq, gt, inArray, isNull } = require("drizzle-orm");
const { db } = require("../db/client");
const { conversations, conversationMembers, messages, users } = require("../db/schema");
const { AppError } = require("../utils/app-error");
const { isFriends } = require("./friend-service");
const { publicUser, getUser } = require("./user-service");
const active = (conversationId, userId) => and(eq(conversationMembers.conversationId, conversationId), eq(conversationMembers.userId, userId), isNull(conversationMembers.leftAt));
const membership = async (client, conversationId, userId) => (await client.select().from(conversationMembers).where(active(conversationId, userId)).limit(1))[0];
const requireMember = async (client, conversationId, userId) => { const item = await membership(client, conversationId, userId); if (!item) throw new AppError(403, "You are not an active member of this conversation."); return item; };
const getConversation = async (client, id) => (await client.select().from(conversations).where(eq(conversations.id, id)).limit(1))[0];
const requireConversation = async (client, id) => { const item = await getConversation(client, id); if (!item) throw new AppError(404, "Conversation not found."); return item; };
const groupRole = async (client, conversationId, userId) => { const member = await requireMember(client, conversationId, userId); if (!['owner', 'admin'].includes(member.role)) throw new AppError(403, "Group owner or admin permission is required."); return member; };
const details = async (actorId, conversationId) => {
  const conversation = await requireConversation(db, conversationId); await requireMember(db, conversationId, actorId);
  const rows = await db.select({ member: conversationMembers, user: users }).from(conversationMembers).innerJoin(users, eq(users.id, conversationMembers.userId)).where(and(eq(conversationMembers.conversationId, conversationId), isNull(conversationMembers.leftAt)));
  return { ...conversation, members: rows.map(({ member, user }) => ({ user: publicUser(user), role: member.role, joinedAt: member.joinedAt })) };
};
const list = async (userId, { limit, cursor }) => {
  const filters = [eq(conversationMembers.userId, userId), isNull(conversationMembers.leftAt)];
  if (cursor) filters.push(gt(conversations.id, cursor));
  const rows = await db.select({ conversation: conversations, membership: conversationMembers, lastMessage: messages }).from(conversationMembers).innerJoin(conversations, eq(conversations.id, conversationMembers.conversationId)).leftJoin(messages, eq(messages.id, conversations.lastMessageId)).where(and(...filters)).orderBy(desc(conversations.lastMessageAt), desc(conversations.createdAt)).limit(limit + 1);
  const hasMore = rows.length > limit;
  return { items: rows.slice(0, limit).map(({ conversation, membership: m, lastMessage }) => ({ ...conversation, lastMessage, lastReadAt: m.lastReadAt })), nextCursor: hasMore ? rows[limit - 1]?.conversation.id : null };
};
const createDirect = async (actorId, otherId) => db.transaction(async (tx) => {
  if (actorId === otherId) throw new AppError(422, "You cannot create a direct conversation with yourself.");
  if (!(await getUser(otherId))) throw new AppError(404, "User not found.");
  if (!(await isFriends(tx, actorId, otherId))) throw new AppError(403, "Only accepted friends can start a direct conversation.");
  const [one, two] = actorId < otherId ? [actorId, otherId] : [otherId, actorId];
  const existing = (await tx.select().from(conversations).where(and(eq(conversations.directUserOneId, one), eq(conversations.directUserTwoId, two))).limit(1))[0];
  if (existing) return { conversation: existing, created: false };
  const [conversation] = await tx.insert(conversations).values({ type: 'direct', directUserOneId: one, directUserTwoId: two, createdById: actorId }).returning();
  await tx.insert(conversationMembers).values([{ conversationId: conversation.id, userId: actorId, role: 'member' }, { conversationId: conversation.id, userId: otherId, role: 'member' }]);
  return { conversation, created: true };
});
const createGroup = async (actorId, values) => db.transaction(async (tx) => {
  const ids = [...new Set((values.memberIds || []).filter((id) => id !== actorId))];
  for (const id of ids) { if (!(await getUser(id))) throw new AppError(404, "One or more members were not found."); if (!(await isFriends(tx, actorId, id))) throw new AppError(403, "Groups can only include your accepted friends."); }
  const [conversation] = await tx.insert(conversations).values({ type: 'group', name: values.name, description: values.description, avatarUrl: values.avatarUrl, createdById: actorId }).returning();
  await tx.insert(conversationMembers).values([{ conversationId: conversation.id, userId: actorId, role: 'owner' }, ...ids.map((userId) => ({ conversationId: conversation.id, userId, role: 'member' }))]);
  return conversation;
});
const update = async (actorId, conversationId, values) => { const conversation = await requireConversation(db, conversationId); if (conversation.type !== 'group') throw new AppError(422, "Only group conversations can be updated."); await groupRole(db, conversationId, actorId); const [updated] = await db.update(conversations).set({ ...values, updatedAt: new Date() }).where(eq(conversations.id, conversationId)).returning(); return updated; };
const remove = async (actorId, conversationId) => { const conversation = await requireConversation(db, conversationId); if (conversation.type !== 'group') throw new AppError(422, "Direct conversations cannot be deleted."); const member = await requireMember(db, conversationId, actorId); if (member.role !== 'owner') throw new AppError(403, "Only the group owner can delete the group."); await db.delete(conversations).where(eq(conversations.id, conversationId)); };
const listMembers = async (actorId, conversationId) => (await details(actorId, conversationId)).members;
const addMember = async (actorId, conversationId, userId) => db.transaction(async (tx) => { const conversation = await requireConversation(tx, conversationId); if (conversation.type !== 'group') throw new AppError(422, "Members can only be managed in group conversations."); await groupRole(tx, conversationId, actorId); if (!(await getUser(userId))) throw new AppError(404, "User not found."); if (!(await isFriends(tx, actorId, userId))) throw new AppError(403, "You can only add your accepted friends."); const current = await membership(tx, conversationId, userId); if (current) throw new AppError(409, "User is already a group member."); await tx.insert(conversationMembers).values({ conversationId, userId, role: 'member', leftAt: null }).onConflictDoUpdate({ target: [conversationMembers.conversationId, conversationMembers.userId], set: { leftAt: null, joinedAt: new Date(), role: 'member' } }); return membership(tx, conversationId, userId); });
const updateMember = async (actorId, conversationId, userId, role) => { const conversation = await requireConversation(db, conversationId); if (conversation.type !== 'group') throw new AppError(422, "Members can only be managed in group conversations."); const actor = await groupRole(db, conversationId, actorId); const target = await requireMember(db, conversationId, userId); if (target.role === 'owner' || role === 'owner') throw new AppError(403, "The owner role cannot be changed."); if (actor.role !== 'owner' && role === 'admin') throw new AppError(403, "Only the owner can grant admin access."); const [updated] = await db.update(conversationMembers).set({ role }).where(and(eq(conversationMembers.conversationId, conversationId), eq(conversationMembers.userId, userId))).returning(); return updated; };
const removeMember = async (actorId, conversationId, userId) => { const conversation = await requireConversation(db, conversationId); if (conversation.type !== 'group') throw new AppError(422, "Members can only be managed in group conversations."); const actor = await groupRole(db, conversationId, actorId); const target = await requireMember(db, conversationId, userId); if (target.role === 'owner') throw new AppError(403, "The group owner cannot be removed."); if (actor.role !== 'owner' && target.role === 'admin') throw new AppError(403, "Only the owner can remove an admin."); await db.update(conversationMembers).set({ leftAt: new Date() }).where(and(eq(conversationMembers.conversationId, conversationId), eq(conversationMembers.userId, userId))); };

module.exports = { requireMember, requireConversation, list, details, createDirect, createGroup, update, remove, listMembers, addMember, updateMember, removeMember };
