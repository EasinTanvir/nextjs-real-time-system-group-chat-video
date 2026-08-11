let io = null;
console.log("socket-instance loaded from:", __filename);

function setIO(instance) {
  io = instance;
  console.log("setIO called, io is now:", !!io); // should print true, once, on startup
}

function getIO() {
  console.log("getIO called, io is:", !!io); // check this when sendMessage runs
  if (!io) throw new Error("Socket.io not initialized yet");
  return io;
}

module.exports = { setIO, getIO };
