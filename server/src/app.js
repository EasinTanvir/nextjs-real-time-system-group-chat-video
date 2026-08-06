const cors = require("cors");
const express = require("express");
const { corsOrigin } = require("./config/env");
const { requireAuth } = require("./middleware/auth");
const { errorHandler, notFound } = require("./middleware/errors");
const userRoutes = require("./routes/user-routes");
const friendRoutes = require("./routes/friend-routes");
const conversationRoutes = require("./routes/conversation-routes");

const app = express();
app.disable("x-powered-by");
app.use(
  cors({
    origin: corsOrigin.split(",").map((value) => value.trim()),
    credentials: true,
  }),
);
app.use(express.json({ limit: "100kb" }));
app.get("/health", (_req, res) =>
  res.status(200).json({ success: true, data: { status: "ok" } }),
);
app.use("/api/v1", requireAuth, userRoutes);
app.use("/api/v1", requireAuth, friendRoutes);
app.use("/api/v1", requireAuth, conversationRoutes);
app.use(notFound);
app.use(errorHandler);

module.exports = { app };
