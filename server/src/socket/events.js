const EVENTS = Object.freeze({
  CONNECTION: 'connection',
  CONNECTION_ERROR: 'connect_error',
  CONVERSATION_JOIN: 'conversation:join',
  CONVERSATION_LEAVE: 'conversation:leave',
  MESSAGE_SEND: 'message:send',
  MESSAGE_NEW: 'message:new',
  TYPING_START: 'typing:start',
  TYPING_STOP: 'typing:stop',
  TYPING_UPDATED: 'typing:updated',
  MESSAGE_READ: 'message:read',
  MESSAGE_READ_UPDATED: 'message:read:updated',
  USER_ONLINE: 'user:online',
  USER_OFFLINE: 'user:offline',
});

module.exports = { EVENTS };
