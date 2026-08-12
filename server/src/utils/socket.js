const { Server } = require("socket.io");
const { corsOrigin } = require("../config/env");
const { sessionMiddleware } = require("../config/session");
const passport = require("passport");
const { createRateLimiter } = require("./socket-rate-limiter");
const { assertMember } = require("../services/message-service");
const { updateLastSeen } = require("../services/user-service");

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

  // Map<userId, socketCount>
  const connectedUsers = new Map();
  // Map<userId, TimeoutID> for disconnect grace periods
  const disconnectTimers = new Map();

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

  io.on("connection", (socket) => {
    const userId = socket.userId;
    socket.join(userId); // personal room

    // --- FIX 2: CANCEL PENDING DISCONNECT TIMER IF USER RECONNECTED FAST ---
    if (disconnectTimers.has(userId)) {
      clearTimeout(disconnectTimers.get(userId));
      disconnectTimers.delete(userId);
    }

    // Incremental Connection Counter
    const wasOffline = !connectedUsers.has(userId);
    connectedUsers.set(userId, (connectedUsers.get(userId) || 0) + 1);

    // Only announce 'online' if this was their very first socket connection
    if (wasOffline) {
      io.emit("presence:update", { userId, status: "online" });
    }

    // --- FIX 3: SEND CURRENT ONLINE USERS TO NEWLY CONNECTED CLIENT ---
    socket.emit("authenticated", {
      userId,
      socketId: socket.id,
      timestamp: Date.now(),
      onlineUsers: Array.from(connectedUsers.keys()), // Send current list!
    });

    socket.on("conversation:join", async (conversationId) => {
      if (!joinLimiter(socket.id)) {
        return socket.emit("error", {
          message: "Too many requests, slow down",
        });
      }

      try {
        await assertMember(conversationId, userId);
        socket.join(`conversation:${conversationId}`);
      } catch (err) {
        socket.emit("error", { message: "Forbidden" });
      }
    });

    socket.on("conversation:leave", (conversationId) => {
      socket.leave(`conversation:${conversationId}`);
    });

    socket.on("disconnect", (reason) => {
      console.log(
        `Socket ${socket.id} (user: ${userId}) disconnected. Reason: ${reason}`,
      );

      const count = (connectedUsers.get(userId) || 1) - 1;

      if (count <= 0) {
        connectedUsers.delete(userId);

        // --- FIX 2: 5-SECOND GRACE PERIOD BEFORE GOING OFFLINE ---
        // Handles page refreshes & short connectivity drops without flickering UI
        const timer = setTimeout(async () => {
          disconnectTimers.delete(userId);

          const lastSeenAt = new Date().toISOString();
          io.emit("presence:update", {
            userId,
            status: "offline",
            lastSeenAt,
          });

          try {
            await updateLastSeen(userId); // Persist to DB
          } catch (err) {
            console.error(
              `Failed to update lastSeen for ${userId}:`,
              err.message,
            );
          }
        }, 10000); // 5 seconds grace period

        disconnectTimers.set(userId, timer);
      } else {
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
