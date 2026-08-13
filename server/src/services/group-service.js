const { db } = require("../db/client");
const { AppError } = require("../utils/app-error");
const { createGroupConversationTx } = require("./conversation-service");
const { getFriendIds } = require("./friend-service");
const { getIO } = require("../lib/socket-instance");

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

module.exports = { createGroup };
