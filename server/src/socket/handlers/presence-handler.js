const { EVENTS } = require("../events");
const { isConversationRoom, userRoom } = require("../rooms");

const registerPresenceHandlers = (io, socket) => {
  socket.join(userRoom(socket.data.userId));

  socket.on("disconnecting", async () => {
    try {
      const activeSockets = await io
        .in(userRoom(socket.data.userId))
        .allSockets();
      if (activeSockets.size > 1) return;
      for (const room of socket.rooms) {
        if (isConversationRoom(room))
          socket
            .to(room)
            .emit(EVENTS.USER_OFFLINE, {
              conversationId: room.slice("conversation:".length),
              userId: socket.data.userId,
            });
      }
    } catch (error) {
      console.error(
        `[socket] presence cleanup failed userId=${socket.data.userId} message=Unexpected socket handler failure.`,
      );
    }
  });
};

module.exports = { registerPresenceHandlers };
