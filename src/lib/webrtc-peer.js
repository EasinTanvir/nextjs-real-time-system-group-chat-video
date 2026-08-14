const ICE_SERVERS = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
];
export class WebRTCPeer {
  constructor({ onRemoteStream, onIceCandidate, onConnectionStateChange }) {
    this.pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    this.localStream = null;

    // Single ontrack handler
    this.pc.ontrack = (event) => {
      console.log(
        "[webrtc] ontrack fired, kind:",
        event.track.kind,
        "streams:",
        event.streams.length,
      );

      if (event.streams && event.streams[0]) {
        onRemoteStream(event.streams[0]);
      } else {
        // Fallback for browsers that do not automatically attach the stream
        const inboundStream = new MediaStream();
        inboundStream.addTrack(event.track);
        onRemoteStream(inboundStream);
      }
    };

    this.pc.onicecandidate = (event) => {
      if (event.candidate) onIceCandidate(event.candidate);
    };

    this.pc.onconnectionstatechange = () => {
      onConnectionStateChange(this.pc.connectionState);
    };
  }

  attachLocalStream(stream) {
    this.localStream = stream;
    console.log(
      "[webrtc] attaching local tracks:",
      stream.getTracks().map((t) => t.kind),
    );
    stream.getTracks().forEach((track) => this.pc.addTrack(track, stream));
  }

  async createOffer() {
    const offer = await this.pc.createOffer();
    await this.pc.setLocalDescription(offer);
    return offer;
  }

  async createAnswer(remoteOfferSdp) {
    await this.pc.setRemoteDescription(
      new RTCSessionDescription(remoteOfferSdp),
    );
    const answer = await this.pc.createAnswer();
    await this.pc.setLocalDescription(answer);
    return answer;
  }

  async setRemoteAnswer(remoteAnswerSdp) {
    await this.pc.setRemoteDescription(
      new RTCSessionDescription(remoteAnswerSdp),
    );
  }

  hasRemoteDescription() {
    return !!this.pc.remoteDescription;
  }

  async addIceCandidate(candidate) {
    try {
      await this.pc.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (err) {
      console.error("Failed to add ICE candidate:", err);
    }
  }

  toggleAudio(enabled) {
    this.localStream?.getAudioTracks().forEach((t) => (t.enabled = enabled));
  }

  toggleVideo(enabled) {
    this.localStream?.getVideoTracks().forEach((t) => (t.enabled = enabled));
  }

  close() {
    this.localStream?.getTracks().forEach((t) => t.stop());
    this.pc
      .getSenders()
      .forEach((sender) => sender.track && sender.track.stop());
    this.pc.close();
  }
}

export async function getLocalStream(type) {
  return navigator.mediaDevices.getUserMedia({
    audio: true,
    video: type === "video" ? { width: 640, height: 480 } : false,
  });
}
