const { Server } = require("socket.io");
const { corsOrigin } = require("../config/env");
const { sessionMiddleware } = require("../config/session");
const passport = require("passport");
const { createRateLimiter } = require("./socket-rate-limiter");
const { assertMember } = require("../services/message-service");
const { updateLastSeen } = require("../services/user-service");
const { getFriendIds } = require("../services/friend-service");
const { setConnectedUsers } = require("../lib/socket-instance");
const { registerCallHandlers } = require("../lib/videoCall/call-signaling");

const joinLimiter = createRateLimiter({ max: 20, windowMs: 10_000 }); // 20 joins / 10s

const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);

function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: corsOrigin,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const connectedUsers = new Map();
  const disconnectTimers = new Map();

  setConnectedUsers(connectedUsers);

  io.use(wrap(sessionMiddleware));
  io.use(wrap(passport.initialize()));
  io.use(wrap(passport.session()));

  io.use((socket, next) => {
    try {
      if (
        !socket.request.isAuthenticated ||
        !socket.request.isAuthenticated()
      ) {
        console.error("Socket connection attempt without valid session");
        return next(new Error("UNAUTHORIZED"));
      }

      socket.userId = String(socket.request.user.id);
      console.log(`Socket authenticated for user: ${socket.userId}`);
      next();
    } catch (err) {
      console.error("Socket authentication failed:", err.message);
      return next(new Error("UNAUTHORIZED"));
    }
  });

  io.engine.on("connection_error", (err) => {
    console.error("Socket.IO engine connection error:", {
      code: err.code,
      message: err.message,
      context: err.context,
    });
  });

  io.on("connection", async (socket) => {
    const userId = socket.userId;
    registerCallHandlers(io, socket);

    // Personal room for this user
    socket.join(String(userId));

    // Cancel pending disconnect timer if user reconnects quickly
    if (disconnectTimers.has(userId)) {
      clearTimeout(disconnectTimers.get(userId));
      disconnectTimers.delete(userId);
    }

    // Check whether this is the user's first active socket
    const wasOffline = !connectedUsers.has(userId);

    // Increment socket connection count
    connectedUsers.set(userId, (connectedUsers.get(userId) || 0) + 1);

    // Get this user's friends
    const friendIds = await getFriendIds(userId).catch(() => []);

    // Cache friends on socket so disconnect can use them
    socket.friendIds = friendIds;

    // Only announce ONLINE to this user's friends
    if (wasOffline) {
      for (const friendId of friendIds) {
        io.to(String(friendId)).emit("presence:update", {
          userId,
          status: "online",
        });
      }
    }

    // Only send currently online FRIENDS to this user
    const onlineUsers = friendIds.filter((friendId) =>
      connectedUsers.has(friendId),
    );

    socket.emit("authenticated", {
      userId,
      socketId: socket.id,
      timestamp: Date.now(),
      onlineUsers,
    });

    socket.on("conversation:join", async (conversationId) => {
      console.log("conversation:join====", conversationId);
      if (!joinLimiter(socket.id)) {
        return socket.emit("error", {
          message: "Too many requests, slow down",
        });
      }

      try {
        await assertMember(conversationId, userId);

        socket.join(`conversation:${conversationId}`);
      } catch (err) {
        socket.emit("error", {
          message: "Forbidden",
        });
      }
    });

    socket.on("conversation:leave", (conversationId) => {
      socket.leave(`conversation:${conversationId}`);
    });

    socket.on("friendship:added", (newFriendId) => {
      if (!socket.friendIds.includes(newFriendId)) {
        socket.friendIds.push(newFriendId);
      }
    });

    socket.on("disconnect", (reason) => {
      console.log(
        `Socket ${socket.id} (user: ${userId}) disconnected. Reason: ${reason}`,
      );

      const count = (connectedUsers.get(userId) || 1) - 1;

      // User has no active sockets anymore
      if (count <= 0) {
        connectedUsers.delete(userId);

        // Grace period before marking user offline
        const timer = setTimeout(async () => {
          disconnectTimers.delete(userId);

          const lastSeenAt = new Date().toISOString();

          // Only notify this user's friends
          for (const friendId of socket.friendIds || []) {
            io.to(String(friendId)).emit("presence:update", {
              userId,
              status: "offline",
              lastSeenAt,
            });
          }

          try {
            await updateLastSeen(userId);
          } catch (err) {
            console.error(
              `Failed to update lastSeen for ${userId}:`,
              err.message,
            );
          }
        }, 10000);

        disconnectTimers.set(userId, timer);
      } else {
        // User still has other active sockets
        connectedUsers.set(userId, count);
      }
    });

    socket.on("error", (error) => {
      console.error(`Socket error for ${socket.id}:`, error);
    });
  });

  return io;
}

module.exports = { initSocket };
