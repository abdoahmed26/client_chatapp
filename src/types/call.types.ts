export type CallType = "audio" | "video";

export type CallStatus = "idle" | "ringing" | "connecting" | "ongoing" | "ended";

export type CallDirection = "outgoing" | "incoming";

/** Redux call state. */
export interface ICallState {
  status: CallStatus;
  direction: CallDirection | null;
  callId: string | null;
  callType: CallType | null;
  peer: ICallPeer | null;
  isMuted: boolean;
  isCameraOff: boolean;
  isScreenSharing: boolean;
  isRecording: boolean;
  duration: number; // seconds elapsed
  startedAt: number | null; // Date.now() timestamp
}

/** Peer information shown during calls. */
export interface ICallPeer {
  id: string;
  name: string;
  profileImage: string | null;
}

/** Payload for an incoming call event from the server. */
export interface IIncomingCallPayload {
  callId: string;
  caller: ICallPeer;
  type: CallType;
}

/** Payload for initiating a call. */
export interface IInitiateCallPayload {
  calleeId: string;
  calleeName: string;
  calleeProfileImage: string | null;
  type: CallType;
  conversationId?: string;
}

/** Call record from the database (call history). */
export interface ICallRecord {
  id: string;
  type: CallType;
  status: "ringing" | "ongoing" | "ended" | "missed" | "rejected";
  startedAt: string | null;
  endedAt: string | null;
  duration: number | null;
  createdAt: string;
  caller: {
    id: string;
    name: string;
    profileImage: string | null;
  };
  callee: {
    id: string;
    name: string;
    profileImage: string | null;
  };
}
