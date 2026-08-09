const IORedis = require("ioredis");
const { redisUrl } = require("../config/env");

const bullmqConnection = new IORedis(redisUrl, {
  maxRetriesPerRequest: null,
});

bullmqConnection.on("connect", () => {
  console.log("BullMQ Redis connected");
});

bullmqConnection.on("error", (err) => {
  console.error("BullMQ Redis error:", err);
});

module.exports = { bullmqConnection };
