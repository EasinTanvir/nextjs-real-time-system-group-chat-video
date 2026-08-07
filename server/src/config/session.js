const session = require("express-session");
const { RedisStore } = require("connect-redis");
const { redisClient } = require("../redis/redis");
const { sessionSecret, isProduction } = require("./env");

const sessionMiddleware = session({
  store: new RedisStore({ client: redisClient, prefix: "sess:" }),
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  name: "sid",
  cookie: {
    httpOnly: true,
    secure: isProduction, // true in prod (requires HTTPS)
    sameSite: isProduction ? "none" : "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  },
});

module.exports = { sessionMiddleware };
