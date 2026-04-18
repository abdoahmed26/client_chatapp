/** STUN/TURN servers for WebRTC ICE negotiation. */
export const ICE_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
];

/** How long to wait for the callee to answer before timing out (ms). */
export const CALL_TIMEOUT_MS = 30_000;

/** Auto-dismiss duration for the CallEndedSummary (ms). */
export const CALL_ENDED_DISMISS_MS = 4_000;

/** RTCPeerConnection configuration. */
export const RTC_CONFIG: RTCConfiguration = {
  iceServers: ICE_SERVERS,
  iceCandidatePoolSize: 10,
};
