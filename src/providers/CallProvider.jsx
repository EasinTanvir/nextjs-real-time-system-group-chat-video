"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import { useSocket } from "./SocketContext";
import { WebRTCPeer, getLocalStream } from "@/lib/webrtc-peer";

const CallContext = createContext(null);

export function CallProvider({ children }) {
  const { socket } = useSocket();

  const [call, setCall] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [duration, setDuration] = useState(0);

  // Refs mirror state for safe reads inside socket callbacks (avoids stale closures)
  const callRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerRef = useRef(null);
  const pendingCandidatesRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    callRef.current = call;
  }, [call]);

  useEffect(() => {
    localStreamRef.current = localStream;
  }, [localStream]);

  const startTimer = useCallback(() => {
    if (timerRef.current) return;
    setDuration(0);
    timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setDuration(0);
  }, []);

  const resetCall = useCallback(() => {
    peerRef.current?.close();
    peerRef.current = null;
    pendingCandidatesRef.current = [];
    stopTimer();
    setCall(null);
    setLocalStream(null);
    setRemoteStream(null);
    setMicEnabled(true);
    setCameraEnabled(true);
  }, [stopTimer]);

  const flushPendingCandidates = useCallback((peer) => {
    if (!peer || !peer.hasRemoteDescription()) return;
    pendingCandidatesRef.current.forEach((c) => peer.addIceCandidate(c));
    pendingCandidatesRef.current = [];
  }, []);

  // 🛠️ UPDATED: setupPeer with stream track listener and stable connection state handling
  const setupPeer = useCallback(
    (callId) => {
      const peer = new WebRTCPeer({
        onRemoteStream: (stream) => {
          setRemoteStream(stream);

          // Force state update if a track (e.g. video) arrives later on the stream
          stream.onaddtrack = () => {
            setRemoteStream(new MediaStream(stream.getTracks()));
          };
        },
        onIceCandidate: (candidate) =>
          socket.emit("webrtc:ice-candidate", { callId, candidate }),
        onConnectionStateChange: (state) => {
          console.log("[call] connectionState:", state);
          if (state === "connected") {
            setCall((prev) => (prev ? { ...prev, status: "active" } : prev));
            startTimer();
          } else if (state === "failed" || state === "closed") {
            // 👈 Only tear down on absolute failures, ignoring temporary 'disconnected' flips
            if (callRef.current) {
              toast.error("Call connection lost");
              resetCall();
            }
          }
        },
      });
      peerRef.current = peer;
      return peer;
    },
    [socket, startTimer, resetCall],
  );

  // ---------- Outgoing call ----------
  const startCall = useCallback(
    async ({ conversationId, calleeId, calleeName, type }) => {
      if (!socket) return;
      if (callRef.current) {
        toast.error("You are already in a call");
        return;
      }
      try {
        const stream = await getLocalStream(type);
        setLocalStream(stream);
        localStreamRef.current = stream;

        setCall({
          callId: null,
          conversationId,
          peerId: calleeId,
          peerName: calleeName,
          type,
          status: "ringing-outgoing",
        });

        socket.emit("call:initiate", { conversationId, calleeId, type });
      } catch (err) {
        console.error(err);
        toast.error("Camera/microphone access denied");
      }
    },
    [socket],
  );

  // ---------- Incoming call: accept ----------
  const acceptCall = useCallback(async () => {
    const current = callRef.current;
    if (!current || !socket) return;

    let stream;
    try {
      stream = await getLocalStream(current.type);
    } catch (err) {
      console.error("getUserMedia failed:", err.name, err.message);
      toast.error(`Camera/microphone access denied: ${err.name}`);
      socket.emit("call:reject", { callId: current.callId });
      resetCall();
      return;
    }

    try {
      setLocalStream(stream);
      localStreamRef.current = stream;

      const peer = setupPeer(current.callId);
      peer.attachLocalStream(stream);

      setCall((prev) => (prev ? { ...prev, status: "connecting" } : prev));
      socket.emit("call:accept", { callId: current.callId });
    } catch (err) {
      console.error("Failed to set up peer after accepting:", err);
      toast.error("Failed to start call");
      stream.getTracks().forEach((t) => t.stop());
      socket.emit("call:reject", { callId: current.callId });
      resetCall();
    }
  }, [socket, setupPeer, resetCall]);

  const rejectCall = useCallback(() => {
    const current = callRef.current;
    if (!current || !socket) return;
    socket.emit("call:reject", { callId: current.callId });
    resetCall();
  }, [socket, resetCall]);

  const cancelCall = useCallback(() => {
    const current = callRef.current;
    if (!current || !socket) return;
    socket.emit("call:cancel", { callId: current.callId });
    resetCall();
  }, [socket, resetCall]);

  const endCall = useCallback(() => {
    const current = callRef.current;
    if (!current || !socket) return;
    socket.emit("call:end", { callId: current.callId });
    resetCall();
  }, [socket, resetCall]);

  const toggleMic = useCallback(() => {
    setMicEnabled((prev) => {
      const next = !prev;
      peerRef.current?.toggleAudio(next);
      const current = callRef.current;
      if (current)
        socket?.emit("call:media-toggle", {
          callId: current.callId,
          kind: "audio",
          enabled: next,
        });
      return next;
    });
  }, [socket]);

  const toggleCamera = useCallback(() => {
    setCameraEnabled((prev) => {
      const next = !prev;
      peerRef.current?.toggleVideo(next);
      const current = callRef.current;
      if (current)
        socket?.emit("call:media-toggle", {
          callId: current.callId,
          kind: "video",
          enabled: next,
        });
      return next;
    });
  }, [socket]);

  // ---------- Socket listeners — registered once per socket instance ----------
  useEffect(() => {
    if (!socket) return;

    const onRinging = ({ callId }) => {
      setCall((prev) => (prev ? { ...prev, callId } : prev));
    };

    const onIncoming = ({ callId, conversationId, callerId, type }) => {
      if (callRef.current) {
        // already in a call — auto-reject
        socket.emit("call:reject", { callId });
        return;
      }
      setCall({
        callId,
        conversationId,
        peerId: callerId,
        peerName: null,
        type,
        status: "ringing-incoming",
      });
    };

    // Caller side only: callee accepted -> build peer, attach stream, send offer
    const onAccepted = async ({ callId }) => {
      const current = callRef.current;
      if (!current || current.callId !== callId) return;

      setCall((prev) => (prev ? { ...prev, status: "connecting" } : prev));

      const peer = setupPeer(callId);
      peer.attachLocalStream(localStreamRef.current);

      const offer = await peer.createOffer();
      socket.emit("webrtc:offer", { callId, sdp: offer });
    };

    // Callee side only: receives offer -> peer already exists (created in acceptCall) -> answer
    const onOffer = async ({ callId, sdp }) => {
      const current = callRef.current;
      if (!current || current.callId !== callId) return;

      let peer = peerRef.current;
      if (!peer) {
        // safety net — shouldn't normally happen since acceptCall creates it first
        peer = setupPeer(callId);
        if (localStreamRef.current)
          peer.attachLocalStream(localStreamRef.current);
      }

      const answer = await peer.createAnswer(sdp);
      socket.emit("webrtc:answer", { callId, sdp: answer });
      flushPendingCandidates(peer);
    };

    // Caller side only: receives answer
    const onAnswer = async ({ callId, sdp }) => {
      const current = callRef.current;
      if (!current || current.callId !== callId) return;
      await peerRef.current?.setRemoteAnswer(sdp);
      flushPendingCandidates(peerRef.current);
    };

    const onIceCandidate = ({ candidate }) => {
      const peer = peerRef.current;
      if (peer && peer.hasRemoteDescription()) {
        peer.addIceCandidate(candidate);
      } else {
        pendingCandidatesRef.current.push(candidate);
      }
    };

    const onRejected = () => {
      toast("Call declined");
      resetCall();
    };
    const onCancelled = () => {
      toast("Call cancelled");
      resetCall();
    };
    const onEnded = () => {
      toast("Call ended");
      resetCall();
    };
    const onTimeout = () => {
      toast("No answer");
      resetCall();
    };
    const onBusy = () => {
      toast.error("User is on another call");
      resetCall();
    };
    const onCallError = ({ message }) => {
      toast.error(message);
      resetCall();
    };
    const onMediaToggle = ({ kind, enabled }) => {
      setCall((prev) =>
        prev
          ? {
              ...prev,
              [kind === "audio" ? "peerMicEnabled" : "peerCameraEnabled"]:
                enabled,
            }
          : prev,
      );
    };

    socket.on("call:ringing", onRinging);
    socket.on("call:incoming", onIncoming);
    socket.on("call:accepted", onAccepted);
    socket.on("webrtc:offer", onOffer);
    socket.on("webrtc:answer", onAnswer);
    socket.on("webrtc:ice-candidate", onIceCandidate);
    socket.on("call:rejected", onRejected);
    socket.on("call:cancelled", onCancelled);
    socket.on("call:ended", onEnded);
    socket.on("call:timeout", onTimeout);
    socket.on("call:busy", onBusy);
    socket.on("call:error", onCallError);
    socket.on("call:media-toggle", onMediaToggle);

    return () => {
      socket.off("call:ringing", onRinging);
      socket.off("call:incoming", onIncoming);
      socket.off("call:accepted", onAccepted);
      socket.off("webrtc:offer", onOffer);
      socket.off("webrtc:answer", onAnswer);
      socket.off("webrtc:ice-candidate", onIceCandidate);
      socket.off("call:rejected", onRejected);
      socket.off("call:cancelled", onCancelled);
      socket.off("call:ended", onEnded);
      socket.off("call:timeout", onTimeout);
      socket.off("call:busy", onBusy);
      socket.off("call:error", onCallError);
      socket.off("call:media-toggle", onMediaToggle);
    };
  }, [socket, setupPeer, resetCall, flushPendingCandidates]);

  // Cleanup if provider unmounts mid-call (e.g. logout)
  useEffect(() => {
    return () => {
      peerRef.current?.close();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <CallContext.Provider
      value={{
        call,
        localStream,
        remoteStream,
        micEnabled,
        cameraEnabled,
        duration,
        startCall,
        acceptCall,
        rejectCall,
        cancelCall,
        endCall,
        toggleMic,
        toggleCamera,
      }}
    >
      {children}
    </CallContext.Provider>
  );
}

export const useCall = () => {
  const ctx = useContext(CallContext);
  if (!ctx) throw new Error("useCall must be used within CallProvider");
  return ctx;
};
