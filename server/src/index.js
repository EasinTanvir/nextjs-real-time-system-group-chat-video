require("dotenv").config({
  path: require("node:path").resolve(__dirname, "../.env"),
});
const { createServer } = require("node:http");
const { app } = require("./app");
const { port } = require("./config/env");
const { pool } = require("./db/client");

const server = createServer(app);

server.listen(port, () =>
  console.log(`Chat API and real-time server listening on port ${port}`),
);
const shutdown = (signal) => {
  console.log(`${signal} received; shutting down.`);
  io.close(() => server.close(() => pool.end().finally(() => process.exit(0))));
};
process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));
