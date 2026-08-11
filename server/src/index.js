require("dotenv").config();
const { createServer } = require("http");
const { app } = require("./app");
const { port } = require("./config/env");
const { pool } = require("./db/client");
const { initSocket } = require("./utils/socket");
const { setIO } = require("./lib/socket-instance");

const server = createServer(app);

const io = initSocket(server);
app.set("io", io);
setIO(io);

server.listen(port, () =>
  console.log(`Chat API and real-time server listening on port ${port}`),
);

const shutdown = (signal) => {
  console.log(`${signal} received; shutting down.`);
  io.close(() => server.close(() => pool.end().finally(() => process.exit(0))));
};

process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));
