// socket-instance.js (or whatever your singleton file is named)
let io = null;
let connectedUsersMap = null;

console.log("socket-instance loaded from:", __filename);

function setIO(instance) {
  io = instance;
  console.log("setIO called, io is now:", !!io);
}

function getIO() {
  console.log("getIO called, io is:", !!io);
  if (!io) throw new Error("Socket.io not initialized yet");
  return io;
}

// --- New getters & setters for connectedUsers ---
function setConnectedUsers(map) {
  connectedUsersMap = map;
  console.log(
    "setConnectedUsers called, map initialized:",
    !!connectedUsersMap,
  );
}

function getConnectedUsers() {
  if (!connectedUsersMap) {
    throw new Error("ConnectedUsers Map not initialized yet");
  }
  return connectedUsersMap;
}

module.exports = {
  setIO,
  getIO,
  setConnectedUsers,
  getConnectedUsers,
};
