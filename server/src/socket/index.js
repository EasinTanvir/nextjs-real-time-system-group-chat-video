const { Server } = require('socket.io');
const { corsOrigin } = require('../config/env');
const { EVENTS } = require('./events');
const { requireSocketAuth } = require('./middleware/auth');
const { registerConversationHandlers } = require('./handlers/conversation-handler');
const { registerMessageHandlers } = require('./handlers/message-handler');
const { registerPresenceHandlers } = require('./handlers/presence-handler');
const { userRoom } = require('./rooms');

let socketServer;
const emitToUser = (userId, event, payload) => socketServer?.to(userRoom(userId)).emit(event, payload);

const createSocketServer = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: corsOrigin.split(',').map((value) => value.trim()),
      credentials: true,
    },
  });

  io.use(requireSocketAuth);
  socketServer = io;
  io.on(EVENTS.CONNECTION, (socket) => {
    console.info(`[socket] connected userId=${socket.data.userId} socketId=${socket.id}`);
    registerPresenceHandlers(io, socket);
    registerConversationHandlers(io, socket);
    registerMessageHandlers(io, socket);
    socket.on('disconnect', (reason) => console.info(`[socket] disconnected userId=${socket.data.userId} reason=${reason}`));
    socket.on('error', () => console.error(`[socket] transport error userId=${socket.data.userId}`));
  });

  return io;
};

module.exports = { createSocketServer, emitToUser };
