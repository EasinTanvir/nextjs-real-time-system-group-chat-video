const cors = require("cors");
const express = require("express");
const passport = require("passport");
const { corsOrigin } = require("./config/env");
const { sessionMiddleware } = require("./config/session");
require("./config/passport");
const { requireAuth } = require("./middleware/auth");
const { errorHandler, notFound } = require("./middleware/errors");
const authRoutes = require("./routes/auth-routes");
const userRoutes = require("./routes/user-routes");
const friendRoutes = require("./routes/friend-routes");
const conversationRoutes = require("./routes/conversation-routes");
const notificationRoutes = require("./routes/notification-routes");

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  }),
);
app.use(express.json({ limit: "100kb" }));

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1", authRoutes);
app.use("/api/v1", requireAuth, userRoutes);
app.use("/api/v1", requireAuth, friendRoutes);
app.use("/api/v1", requireAuth, conversationRoutes);
app.use("/api/v1", requireAuth, notificationRoutes);
app.use(notFound);
app.use(errorHandler);

module.exports = { app };
