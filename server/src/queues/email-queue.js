const { Queue } = require("bullmq");
const { bullmqConnection } = require("../redis/bullmq-connection");

const emailQueue = new Queue("email", {
  connection: bullmqConnection,
});

module.exports = { emailQueue };
