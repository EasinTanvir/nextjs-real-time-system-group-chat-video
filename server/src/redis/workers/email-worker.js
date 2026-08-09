const { Worker } = require("bullmq");
const { bullmqConnection } = require("../bullmq-connection");
const { emailSendHandler } = require("../../services/mailService");

const emailWorker = new Worker(
  "email",
  async (job) => {
    console.log(`Processing email job: ${job.id}`);

    const { type, email } = job.data;

    switch (type) {
      case "verify-email":
        await emailSendHandler(email);
        break;

      default:
        throw new Error(`Unknown email job type: ${type}`);
    }

    console.log(`Email job completed: ${job.id}`);
  },
  {
    connection: bullmqConnection,
  },
);

emailWorker.on("completed", (job) => {
  console.log(`Email job completed: ${job.id}`);
});

emailWorker.on("failed", (job, error) => {
  console.error(`Email job failed: ${job?.id}`, error.message);
});

module.exports = { emailWorker };
