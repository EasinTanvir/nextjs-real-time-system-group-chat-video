const { eq, and, lt, desc, isNull, gt, ne, sql } = require("drizzle-orm");
const { db } = require("../db/client");
const {
  messages,
  conversations,
  conversationMembers,
  users,
} = require("../db/schema");
const { AppError } = require("../utils/app-error");
const { getIO } = require("../lib/socket-instance");

async function assertMember(conversationId, userId) {
  const member = await db.query.conversationMembers.findFirst({
    where: and(
      eq(conversationMembers.conversationId, conversationId),
      eq(conversationMembers.userId, userId),
      isNull(conversationMembers.leftAt),
    ),
  });
  if (!member) throw new AppError("Not a member of this conversation", 403);
  return member;
}

async function sendMessage(conversationId, senderId, content) {
  if (!content || !content.trim())
    throw new AppError("Message content required", 400);
  await assertMember(conversationId, senderId);

  const inserted = await db.transaction(async (tx) => {
    const [m] = await tx
      .insert(messages)
      .values({ conversationId, senderId, content: content.trim() })
      .returning();

    await tx
      .update(conversations)
      .set({ lastMessageId: m.id, lastMessageAt: m.createdAt })
      .where(eq(conversations.id, conversationId));

    return m;
  });

  // re-fetch with sender relation so shape matches getMessages()
  const message = await db.query.messages.findFirst({
    where: eq(messages.id, inserted.id),
    with: {
      sender: { columns: { id: true, username: true, avatarUrl: true } },
    },
  });

  const members = await db.query.conversationMembers.findMany({
    where: and(
      eq(conversationMembers.conversationId, conversationId),
      isNull(conversationMembers.leftAt),
    ),
  });

  try {
    const io = getIO();
    for (const member of members) {
      io.to(String(member.userId)).emit("message:new", { message });
    }
  } catch (err) {
    console.error("Socket emit failed in message:", err.message);
  }

  return message;
}

async function getMessages(
  conversationId,
  userId,
  { cursor, limit = 30 } = {},
) {
  await assertMember(conversationId, userId);
  const where = cursor
    ? and(
        eq(messages.conversationId, conversationId),
        lt(messages.createdAt, new Date(cursor)),
      )
    : eq(messages.conversationId, conversationId);

  const rows = await db.query.messages.findMany({
    where,
    orderBy: desc(messages.createdAt),
    limit,
    with: {
      sender: { columns: { id: true, username: true, avatarUrl: true } },
    },
  });
  return rows.reverse();
}

async function markConversationRead(conversationId, userId) {
  const member = await assertMember(conversationId, userId);

  const conversation = await db.query.conversations.findFirst({
    where: eq(conversations.id, conversationId),
  });

  await db
    .update(conversationMembers)
    .set({
      lastReadMessageId: conversation?.lastMessageId ?? null,
      lastReadAt: new Date(),
    })
    .where(
      and(
        eq(conversationMembers.conversationId, conversationId),
        eq(conversationMembers.userId, userId),
      ),
    );

  return { success: true };
}

async function listConversations(userId) {
  const memberships = await db.query.conversationMembers.findMany({
    where: and(
      eq(conversationMembers.userId, userId),
      isNull(conversationMembers.leftAt),
    ),
  });
  if (memberships.length === 0) return [];

  const results = [];
  for (const m of memberships) {
    const convo = await db.query.conversations.findFirst({
      where: eq(conversations.id, m.conversationId),
    });
    if (!convo) continue;

    const otherUserId =
      convo.directUserOneId === userId
        ? convo.directUserTwoId
        : convo.directUserOneId;
    const otherUser = await db.query.users.findFirst({
      where: eq(users.id, otherUserId),
      columns: { id: true, username: true, avatarUrl: true, lastSeenAt: true },
    });

    const lastMessage = convo.lastMessageId
      ? await db.query.messages.findFirst({
          where: eq(messages.id, convo.lastMessageId),
        })
      : null;

    const unreadWhere = m.lastReadAt
      ? and(
          eq(messages.conversationId, convo.id),
          gt(messages.createdAt, m.lastReadAt),
          ne(messages.senderId, userId),
        )
      : and(
          eq(messages.conversationId, convo.id),
          ne(messages.senderId, userId),
        );

    const unreadRows = await db
      .select({ count: sql`count(*)` })
      .from(messages)
      .where(unreadWhere);
    const unreadCount = Number(unreadRows[0]?.count ?? 0);

    results.push({
      conversationId: convo.id,
      otherUser,
      lastMessage,
      lastMessageAt: convo.lastMessageAt,
      unreadCount,
    });
  }

  results.sort(
    (a, b) => new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0),
  );
  return results;
}

async function getConversationById(conversationId, userId) {
  await assertMember(conversationId, userId);
  const convo = await db.query.conversations.findFirst({
    where: eq(conversations.id, conversationId),
  });
  if (!convo) throw new AppError("Conversation not found", 404);

  const otherUserId =
    convo.directUserOneId === userId
      ? convo.directUserTwoId
      : convo.directUserOneId;
  const otherUser = await db.query.users.findFirst({
    where: eq(users.id, otherUserId),
    columns: { id: true, username: true, avatarUrl: true, lastSeenAt: true },
  });

  return { ...convo, otherUser };
}

module.exports = {
  sendMessage,
  getMessages,
  markConversationRead,
  listConversations,
  getConversationById,
};
