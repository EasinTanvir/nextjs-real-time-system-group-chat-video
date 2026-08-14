const { randomUUID } = require("crypto");
const {
  createCall,
  getCall,
  getActiveCallForUser,
  updateCallStatus,
  endCall,
  otherParty,
} = require("./call-store");
const { assertMember } = require("../../services/message-service");
const { logCallMessage } = require("../../services/call-service");

const RING_TIMEOUT_MS = 30_000;
const ringTimers = new Map(); // callId -> timeout handle

function clearRingTimer(callId) {
  const t = ringTimers.get(callId);
  if (t) {
    clearTimeout(t);
    ringTimers.delete(callId);
  }
}

function registerCallHandlers(io, socket) {
  const userId = socket.userId;

  // --- Call lifecycle ---

  socket.on("call:initiate", async ({ conversationId, calleeId, type }) => {
    try {
      if (!["audio", "video"].includes(type)) {
        return socket.emit("call:error", { message: "Invalid call type" });
      }
      if (!conversationId || !calleeId) {
        return socket.emit("call:error", {
          message: "Missing call parameters",
        });
      }

      await assertMember(conversationId, userId); // 403 if caller isn't in this conversation

      if (getActiveCallForUser(userId)) {
        return socket.emit("call:error", {
          message: "You are already in a call",
        });
      }
      if (getActiveCallForUser(calleeId)) {
        return socket.emit("call:busy", { calleeId });
      }

      const callId = randomUUID();
      createCall({ callId, callerId: userId, calleeId, conversationId, type });

      io.to(String(calleeId)).emit("call:incoming", {
        callId,
        conversationId,
        callerId: userId,
        type,
      });

      socket.emit("call:ringing", { callId });

      const timer = setTimeout(() => {
        const current = getCall(callId);
        if (current && current.status === "ringing") {
          endCall(callId);
          io.to(String(current.callerId)).emit("call:timeout", { callId });
          io.to(String(current.calleeId)).emit("call:timeout", { callId });
        }
        ringTimers.delete(callId);
      }, RING_TIMEOUT_MS);
      ringTimers.set(callId, timer);
    } catch (err) {
      socket.emit("call:error", {
        message: err.message || "Failed to start call",
      });
    }
  });

  socket.on("call:accept", ({ callId }) => {
    const call = getCall(callId);
    if (!call || call.calleeId !== userId) return;
    clearRingTimer(callId);
    updateCallStatus(callId, "connecting");
    // Only the CALLER needs to know — they build the offer next.
    io.to(String(call.callerId)).emit("call:accepted", { callId });
  });

  socket.on("call:reject", ({ callId }) => {
    const call = getCall(callId);
    if (!call || call.calleeId !== userId) return;
    clearRingTimer(callId);
    endCall(callId);
    io.to(String(call.callerId)).emit("call:rejected", { callId });
  });

  socket.on("call:cancel", ({ callId }) => {
    const call = getCall(callId);
    if (!call || call.callerId !== userId) return;
    clearRingTimer(callId);
    endCall(callId);
    io.to(String(call.calleeId)).emit("call:cancelled", { callId });
  });

  // in call:end handler
  socket.on("call:end", async ({ callId }) => {
    const call = getCall(callId);
    if (!call || (call.callerId !== userId && call.calleeId !== userId)) return;
    clearRingTimer(callId);
    endCall(callId);
    io.to(String(otherParty(call, userId))).emit("call:ended", { callId });

    if (call.startedAt) {
      const durationSeconds = Math.round((Date.now() - call.startedAt) / 1000);
      await logCallMessage({
        conversationId: call.conversationId,
        callerId: call.callerId,
        type: call.type,
        durationSeconds,
        wasAnswered: true,
      }).catch((err) =>
        console.error("Failed to log call message:", err.message),
      );
    }
  });

  // --- Pure WebRTC signaling relay — server never parses SDP/ICE, just forwards ---

  socket.on("webrtc:offer", ({ callId, sdp }) => {
    const call = getCall(callId);
    if (!call) return;
    io.to(String(otherParty(call, userId))).emit("webrtc:offer", {
      callId,
      sdp,
    });
  });

  socket.on("webrtc:answer", ({ callId, sdp }) => {
    const call = getCall(callId);
    if (!call) return;
    io.to(String(otherParty(call, userId))).emit("webrtc:answer", {
      callId,
      sdp,
    });
  });

  socket.on("webrtc:ice-candidate", ({ callId, candidate }) => {
    const call = getCall(callId);
    if (!call) return;
    io.to(String(otherParty(call, userId))).emit("webrtc:ice-candidate", {
      callId,
      candidate,
    });
  });

  // --- Mic/camera toggle broadcast (informational only, for peer's UI) ---

  socket.on("call:media-toggle", ({ callId, kind, enabled }) => {
    const call = getCall(callId);
    if (!call) return;
    io.to(String(otherParty(call, userId))).emit("call:media-toggle", {
      callId,
      kind,
      enabled,
    });
  });

  // --- Cleanup on disconnect ---

  socket.on("disconnect", async () => {
    const call = getActiveCallForUser(userId);
    if (!call) return;
    clearRingTimer(call.callId);
    endCall(call.callId);
    io.to(String(otherParty(call, userId))).emit("call:ended", {
      callId: call.callId,
      reason: "peer_disconnected",
    });

    if (call.startedAt) {
      const durationSeconds = Math.round((Date.now() - call.startedAt) / 1000);
      await logCallMessage({
        conversationId: call.conversationId,
        callerId: call.callerId,
        type: call.type,
        durationSeconds,
        wasAnswered: true,
      }).catch((err) =>
        console.error("Failed to log call message:", err.message),
      );
    }
  });
}

module.exports = { registerCallHandlers };
