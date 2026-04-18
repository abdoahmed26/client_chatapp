import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  ICallState,
  CallType,
  ICallPeer,
} from "@/types/call.types";

const initialState: ICallState = {
  status: "idle",
  direction: null,
  callId: null,
  callType: null,
  peer: null,
  isMuted: false,
  isCameraOff: false,
  isScreenSharing: false,
  isRecording: false,
  duration: 0,
  startedAt: null,
};

const callSlice = createSlice({
  name: "call",
  initialState,
  reducers: {
    /** Caller initiates a call. */
    initiateCall(
      state,
      action: PayloadAction<{
        callId: string;
        peer: ICallPeer;
        callType: CallType;
      }>
    ) {
      state.status = "ringing";
      state.direction = "outgoing";
      state.callId = action.payload.callId;
      state.peer = action.payload.peer;
      state.callType = action.payload.callType;
    },

    /** Callee receives an incoming call. */
    incomingCall(
      state,
      action: PayloadAction<{
        callId: string;
        peer: ICallPeer;
        callType: CallType;
      }>
    ) {
      // Don't overwrite an active call
      if (state.status !== "idle") return;

      state.status = "ringing";
      state.direction = "incoming";
      state.callId = action.payload.callId;
      state.peer = action.payload.peer;
      state.callType = action.payload.callType;
    },

    /** Callee accepts → transition to connecting. */
    acceptCall(state) {
      state.status = "connecting";
    },

    /** Callee rejects the call. */
    rejectCall() {
      return initialState;
    },

    /** Caller receives acceptance → transition to connecting. */
    callAccepted(state) {
      state.status = "connecting";
    },

    /** Caller receives rejection. */
    callRejected() {
      return { ...initialState, status: "ended" as const };
    },

    /** WebRTC connected → transition to ongoing. */
    callConnected(state) {
      state.status = "ongoing";
      state.startedAt = Date.now();
    },

    /** Either party ends the call. */
    endCall(state) {
      state.status = "ended";
    },

    /** Server notifies call ended (with duration). */
    callEnded(state, action: PayloadAction<{ duration: number }>) {
      state.status = "ended";
      state.duration = action.payload.duration;
    },

    /** Callee is busy. */
    callBusy() {
      return { ...initialState, status: "ended" as const };
    },

    /** Call timed out (no answer). */
    callTimeout() {
      return { ...initialState, status: "ended" as const };
    },

    toggleMute(state) {
      state.isMuted = !state.isMuted;
    },

    toggleCamera(state) {
      state.isCameraOff = !state.isCameraOff;
    },

    toggleScreenShare(state) {
      state.isScreenSharing = !state.isScreenSharing;
    },

    toggleRecording(state) {
      state.isRecording = !state.isRecording;
    },

    /** Increment call duration by 1 second. */
    tickDuration(state) {
      state.duration += 1;
    },

    /** Reset to idle state. */
    resetCall() {
      return initialState;
    },
  },
});

export const {
  initiateCall,
  incomingCall,
  acceptCall,
  rejectCall,
  callAccepted,
  callRejected,
  callConnected,
  endCall,
  callEnded,
  callBusy,
  callTimeout,
  toggleMute,
  toggleCamera,
  toggleScreenShare,
  toggleRecording,
  tickDuration,
  resetCall,
} = callSlice.actions;

export default callSlice.reducer;
