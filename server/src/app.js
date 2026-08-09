const cors = require("cors");
const express = require("express");
const passport = require("passport");
const { corsOrigin } = require("./config/env");
const { sessionMiddleware } = require("./config/session");
require("./config/passport");
require("./redis/workers/email-worker");
const { errorHandler, notFound } = require("./middleware/errors");
const authRoutes = require("./routes/auth-routes");
const coloredMorgan = require("./utils/morgan");

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
app.use(coloredMorgan);

app.use("/api/v1", authRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = { app };
