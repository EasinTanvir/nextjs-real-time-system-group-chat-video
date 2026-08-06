const { EVENTS } = require("../events");
const { conversationRoom } = require("../rooms");
const {
  requireConversation,
  requireMember,
} = require("../../services/conversation-service");
const { db } = require("../../db/client");
const { uuid } = require("../../utils/validation");
const { registerEvent } = require("./utils");

const conversationIdFrom = (payload) =>
  uuid(payload?.conversationId, "conversationId");
const authorizeMember = async (userId, conversationId) => {
  await requireConversation(db, conversationId);
  await requireMember(db, conversationId, userId);
};

const registerConversationHandlers = (io, socket) => {
  registerEvent(socket, EVENTS.CONVERSATION_JOIN, async (payload) => {
    const conversationId = conversationIdFrom(payload);
    await authorizeMember(socket.data.userId, conversationId);
    const room = conversationRoom(conversationId);
    await socket.join(room);
    socket
      .to(room)
      .emit(EVENTS.USER_ONLINE, { conversationId, userId: socket.data.userId });
    return { conversationId };
  });

  registerEvent(socket, EVENTS.CONVERSATION_LEAVE, async (payload) => {
    const conversationId = conversationIdFrom(payload);
    await authorizeMember(socket.data.userId, conversationId);
    await socket.leave(conversationRoom(conversationId));
    return { conversationId };
  });
};

module.exports = { registerConversationHandlers, authorizeMember };
