const { eq, and } = require("drizzle-orm");
const { conversations, conversationMembers } = require("../db/schema");

// Must be called inside a transaction (tx), not the raw db instance.
async function createDirectConversationTx(tx, userAId, userBId) {
  const [userOneId, userTwoId] = [userAId, userBId].sort();

  const existing = await tx.query.conversations.findFirst({
    where: and(
      eq(conversations.type, "direct"),
      eq(conversations.directUserOneId, userOneId),
      eq(conversations.directUserTwoId, userTwoId),
    ),
  });
  if (existing) return existing;

  const [conversation] = await tx
    .insert(conversations)
    .values({
      type: "direct",
      directUserOneId: userOneId,
      directUserTwoId: userTwoId,
      createdById: userAId,
    })
    .returning();

  await tx.insert(conversationMembers).values([
    { conversationId: conversation.id, userId: userOneId, role: "member" },
    { conversationId: conversation.id, userId: userTwoId, role: "member" },
  ]);

  return conversation;
}
async function createGroupConversationTx(tx, creatorId, name, memberIds) {
  const allMemberIds = Array.from(new Set([creatorId, ...memberIds]));

  const [conversation] = await tx
    .insert(conversations)
    .values({ type: "group", name, createdById: creatorId })
    .returning();

  await tx.insert(conversationMembers).values(
    allMemberIds.map((userId) => ({
      conversationId: conversation.id,
      userId,
      role: userId === creatorId ? "owner" : "member",
    })),
  );

  return conversation;
}

module.exports = { createDirectConversationTx, createGroupConversationTx };
