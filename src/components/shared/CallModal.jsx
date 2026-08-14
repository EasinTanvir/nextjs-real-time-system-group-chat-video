"use client";
import { useCallback, useEffect, useRef } from "react";
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff } from "lucide-react";
import { useCall } from "@/providers/CallProvider";

function formatDuration(totalSeconds) {
  const m = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const s = String(totalSeconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

export default function CallModal() {
  const {
    call,
    localStream,
    remoteStream,
    micEnabled,
    cameraEnabled,
    duration,
    acceptCall,
    rejectCall,
    cancelCall,
    endCall,
    toggleMic,
    toggleCamera,
  } = useCall();

  const localVideoRef = useRef(null);

  // Safe Remote Video Ref
  const remoteVideoRef = useCallback(
    (node) => {
      if (node && remoteStream) {
        node.srcObject = remoteStream;
        node
          .play()
          .catch((err) => console.error("Remote video play() failed:", err));
      }
    },
    [remoteStream],
  );

  // Safe Remote Audio Ref
  const remoteAudioRef = useCallback(
    (node) => {
      if (node && remoteStream) {
        node.srcObject = remoteStream;
        node
          .play()
          .catch((err) => console.error("Remote audio play() failed:", err));
      }
    },
    [remoteStream],
  );

  // Local Video Attachment
  useEffect(() => {
    const videoNode = localVideoRef.current;
    if (videoNode && localStream) {
      videoNode.srcObject = localStream;
      videoNode
        .play()
        .catch((err) => console.error("Local video play() failed:", err));
    }
  }, [localStream, call?.status]);

  if (!call) return null;

  const isVideo = call.type === "video";
  const initial = call.peerName?.[0]?.toUpperCase() || "?";

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950/95 text-white">
      {/* Incoming Call View */}
      {call.status === "ringing-incoming" && (
        <div className="flex flex-col items-center gap-6">
          <div className="grid h-24 w-24 place-items-center rounded-full bg-blue-600 text-3xl font-bold">
            {initial}
          </div>
          <div className="text-center">
            <p className="text-xl font-semibold">
              {call.peerName || "Incoming call"}
            </p>
            <p className="text-sm text-slate-400">
              {isVideo ? "Video call" : "Audio call"}…
            </p>
          </div>
          <div className="mt-4 flex gap-6">
            <button
              onClick={rejectCall}
              className="grid h-16 w-16 place-items-center rounded-full bg-rose-600 hover:bg-rose-700"
            >
              <PhoneOff className="h-6 w-6" />
            </button>
            <button
              onClick={acceptCall}
              className="grid h-16 w-16 place-items-center rounded-full bg-emerald-600 hover:bg-emerald-700"
            >
              <Phone className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}

      {/* Outgoing Call View */}
      {call.status === "ringing-outgoing" && (
        <div className="flex flex-col items-center gap-6">
          <div className="grid h-24 w-24 animate-pulse place-items-center rounded-full bg-blue-600 text-3xl font-bold">
            {initial}
          </div>
          <p className="text-xl font-semibold">
            Calling {call.peerName || "…"}
          </p>
          <p className="text-sm text-slate-400">Ringing…</p>
          <button
            onClick={cancelCall}
            className="mt-4 grid h-16 w-16 place-items-center rounded-full bg-rose-600 hover:bg-rose-700"
          >
            <PhoneOff className="h-6 w-6" />
          </button>
        </div>
      )}

      {/* Connecting View */}
      {call.status === "connecting" && (
        <div className="flex flex-col items-center gap-6">
          <div className="grid h-24 w-24 animate-pulse place-items-center rounded-full bg-blue-600 text-3xl font-bold">
            {initial}
          </div>
          <p className="text-xl font-semibold">
            {call.peerName || "Connecting"}
          </p>
          <p className="text-sm text-slate-400">Connecting…</p>
          <button
            onClick={endCall}
            className="mt-4 grid h-16 w-16 place-items-center rounded-full bg-rose-600 hover:bg-rose-700"
          >
            <PhoneOff className="h-6 w-6" />
          </button>
        </div>
      )}

      {/* Active Call View */}
      {call.status === "active" && (
        <>
          {isVideo ? (
            <div className="relative h-full w-full">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="h-full w-full bg-slate-900 object-cover"
              />
              <span className="absolute left-4 top-4 rounded-full bg-black/40 px-3 py-1 text-sm font-medium">
                {formatDuration(duration)}
              </span>
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="absolute bottom-24 right-4 h-40 w-28 rounded-xl border-2 border-white/20 object-cover shadow-lg"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="grid h-24 w-24 place-items-center rounded-full bg-blue-600 text-3xl font-bold">
                {initial}
              </div>
              <p className="text-xl font-semibold">
                {call.peerName || "In call"}
              </p>
              <p className="text-sm text-emerald-400">
                {formatDuration(duration)}
              </p>
              <audio ref={remoteAudioRef} autoPlay />
            </div>
          )}

          {/* Action Bar */}
          <div className="absolute bottom-8 flex gap-4">
            <button
              onClick={toggleMic}
              className={`grid h-14 w-14 place-items-center rounded-full ${
                micEnabled
                  ? "bg-white/10 hover:bg-white/20"
                  : "bg-rose-600 hover:bg-rose-700"
              }`}
            >
              {micEnabled ? (
                <Mic className="h-5 w-5" />
              ) : (
                <MicOff className="h-5 w-5" />
              )}
            </button>
            {isVideo && (
              <button
                onClick={toggleCamera}
                className={`grid h-14 w-14 place-items-center rounded-full ${
                  cameraEnabled
                    ? "bg-white/10 hover:bg-white/20"
                    : "bg-rose-600 hover:bg-rose-700"
                }`}
              >
                {cameraEnabled ? (
                  <Video className="h-5 w-5" />
                ) : (
                  <VideoOff className="h-5 w-5" />
                )}
              </button>
            )}
            <button
              onClick={endCall}
              className="grid h-14 w-14 place-items-center rounded-full bg-rose-600 hover:bg-rose-700"
            >
              <PhoneOff className="h-5 w-5" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
