let io = null;
console.log("socket-instance loaded from:", __filename);
function setIO(instance) {
  io = instance;
}

function getIO() {
  if (!io) throw new Error("Socket.io not initialized yet");
  return io;
}

module.exports = { setIO, getIO };
