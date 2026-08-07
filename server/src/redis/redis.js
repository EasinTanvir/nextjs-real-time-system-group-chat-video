const { createClient } = require("redis");
const { redisUrl } = require("../config/env");

const redisClient = createClient({ url: redisUrl });

redisClient.on("connect", () => console.log("Redis connected"));
redisClient.on("error", (err) => console.error("Redis error:", err));

// node-redis v4 requires an explicit connect
redisClient
  .connect()
  .catch((err) => console.error("Redis connect failed:", err));

module.exports = { redisClient };
