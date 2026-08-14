const { db } = require("../db/client");
const { messages, conversations } = require("../db/schema");
const { eq } = require("drizzle-orm");
const { getIO } = require("../lib/socket-instance");

function formatDuration(totalSeconds) {
  const m = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const s = String(totalSeconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

async function logCallMessage({
  conversationId,
  callerId,
  type,
  durationSeconds,
  wasAnswered,
}) {
  const content = wasAnswered
    ? `${type === "video" ? "Video" : "Voice"} call · ${formatDuration(durationSeconds)}`
    : `${type === "video" ? "Video" : "Voice"} call · Missed`;

  const inserted = await db.transaction(async (tx) => {
    const [m] = await tx
      .insert(messages)
      .values({ conversationId, senderId: callerId, content })
      .returning();
    await tx
      .update(conversations)
      .set({ lastMessageId: m.id, lastMessageAt: m.createdAt })
      .where(eq(conversations.id, conversationId));
    return m;
  });

  const message = await db.query.messages.findFirst({
    where: eq(messages.id, inserted.id),
    with: {
      sender: { columns: { id: true, username: true, avatarUrl: true } },
    },
  });

  try {
    getIO()
      .to(`conversation:${conversationId}`)
      .emit("message:new", { message: { ...message, isSystemMessage: true } });
    // reuse your existing sidebar fanout pattern
  } catch (err) {
    console.error("Socket emit failed:", err.message);
  }

  return message;
}

module.exports = { logCallMessage };
