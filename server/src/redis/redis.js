const Redis = require("ioredis");
const { redisUrl } = require("../config/env");

const redisClient = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
});

redisClient.on("connect", () => console.log("Redis connected"));
redisClient.on("error", (err) => console.error("Redis error:", err));

module.exports = { redisClient };
