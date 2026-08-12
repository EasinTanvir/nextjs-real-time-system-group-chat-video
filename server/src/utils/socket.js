const { Server } = require("socket.io");
const { corsOrigin } = require("../config/env");
const { sessionMiddleware } = require("../config/session");
const passport = require("passport");
const { createRateLimiter } = require("./socket-rate-limiter");

const joinLimiter = createRateLimiter({ max: 20, windowMs: 10_000 }); // 20 joins / 10s

// Wrapper to adapt Express middleware for Socket.IO
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

  // Run Express session and Passport authentication middleware
  io.use(wrap(sessionMiddleware));
  io.use(wrap(passport.initialize()));
  io.use(wrap(passport.session()));

  // Authentication Middleware
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

  // Engine-level connection errors
  io.engine.on("connection_error", (err) => {
    console.error("Socket.IO engine connection error:", {
      code: err.code,
      message: err.message,
      context: err.context,
    });
  });

  io.on("connection", (socket) => {
    const userId = socket.userId;

    // Join room named after userId (handles multi-device connections natively)
    socket.join(userId);

    socket.on("conversation:join", async (conversationId) => {
      try {
        await assertMember(conversationId, userId); // throws AppError if not a member
        socket.join(`conversation:${conversationId}`);
      } catch (err) {
        socket.emit("error", { message: "Forbidden" });
      }
    });

    socket.on("conversation:leave", (conversationId) => {
      socket.leave(`conversation:${conversationId}`);
    });

    console.log(`🔌 Socket connected: ${socket.id} (user: ${userId})`);

    // Send confirmation to client
    socket.emit("authenticated", {
      userId,
      socketId: socket.id,
      timestamp: Date.now(),
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      joinLimiter.cleanup?.(socket.id); // optional — see note below
      console.log(`Socket ${socket.id} (user: ${userId}) disconnected`);
    });

    socket.on("error", (error) => {
      console.error(`Socket error for ${socket.id}:`, error);
    });
  });

  return io;
}

module.exports = { initSocket };
