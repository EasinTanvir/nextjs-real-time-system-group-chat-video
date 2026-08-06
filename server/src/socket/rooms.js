const userRoom = (userId) => `user:${userId}`;
const conversationRoom = (conversationId) => `conversation:${conversationId}`;
const isConversationRoom = (room) => room.startsWith("conversation:");

module.exports = { userRoom, conversationRoom, isConversationRoom };
