// In-memory call registry. One call = one active session between two users.
const activeCalls = new Map(); // callId -> call object
const userCallMap = new Map(); // userId -> callId

function createCall({ callId, callerId, calleeId, conversationId, type }) {
  const call = {
    callId,
    callerId,
    calleeId,
    conversationId,
    type,
    status: "ringing",
  };
  activeCalls.set(callId, call);
  userCallMap.set(callerId, callId);
  userCallMap.set(calleeId, callId);
  return call;
}

function getCall(callId) {
  return activeCalls.get(callId) || null;
}

function getActiveCallForUser(userId) {
  const callId = userCallMap.get(userId);
  return callId ? activeCalls.get(callId) || null : null;
}

function updateCallStatus(callId, status) {
  const call = activeCalls.get(callId);
  if (call) call.status = status;
  return call || null;
}

function endCall(callId) {
  const call = activeCalls.get(callId);
  if (!call) return null;
  userCallMap.delete(call.callerId);
  userCallMap.delete(call.calleeId);
  activeCalls.delete(callId);
  return call;
}

function otherParty(call, userId) {
  return call.callerId === userId ? call.calleeId : call.callerId;
}

module.exports = {
  createCall,
  getCall,
  getActiveCallForUser,
  updateCallStatus,
  endCall,
  otherParty,
};
