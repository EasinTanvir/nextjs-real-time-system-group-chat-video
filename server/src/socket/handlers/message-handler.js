const { EVENTS } = require('../events');
const { conversationRoom } = require('../rooms');
const { create, markRead } = require('../../services/message-service');
const { string, uuid } = require('../../utils/validation');
const { authorizeMember } = require('./conversation-handler');
const { registerEvent } = require('./utils');

const conversationIdFrom = (payload) => uuid(payload?.conversationId, 'conversationId');

const registerMessageHandlers = (io, socket) => {
  registerEvent(socket, EVENTS.MESSAGE_SEND, async (payload) => {
    const conversationId = conversationIdFrom(payload);
    const content = string(payload?.content, 'content', { required: true, max: 5000 });
    const message = await create(socket.data.userId, conversationId, content);
    io.to(conversationRoom(conversationId)).emit(EVENTS.MESSAGE_NEW, { message });
    return { message };
  });

  registerEvent(socket, EVENTS.TYPING_START, async (payload) => {
    const conversationId = conversationIdFrom(payload);
    await authorizeMember(socket.data.userId, conversationId);
    socket.to(conversationRoom(conversationId)).emit(EVENTS.TYPING_UPDATED, { conversationId, userId: socket.data.userId, isTyping: true });
    return { conversationId, isTyping: true };
  });

  registerEvent(socket, EVENTS.TYPING_STOP, async (payload) => {
    const conversationId = conversationIdFrom(payload);
    await authorizeMember(socket.data.userId, conversationId);
    socket.to(conversationRoom(conversationId)).emit(EVENTS.TYPING_UPDATED, { conversationId, userId: socket.data.userId, isTyping: false });
    return { conversationId, isTyping: false };
  });

  registerEvent(socket, EVENTS.MESSAGE_READ, async (payload) => {
    const conversationId = conversationIdFrom(payload);
    const messageId = uuid(payload?.messageId, 'messageId');
    const membership = await markRead(socket.data.userId, conversationId, messageId);
    socket.to(conversationRoom(conversationId)).emit(EVENTS.MESSAGE_READ_UPDATED, {
      conversationId,
      messageId,
      userId: socket.data.userId,
      readAt: membership.lastReadAt,
    });
    return { conversationId, messageId, readAt: membership.lastReadAt };
  });
};

module.exports = { registerMessageHandlers };
