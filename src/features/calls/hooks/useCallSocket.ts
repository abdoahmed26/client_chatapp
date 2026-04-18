import { useEffect, useRef, useCallback } from "react";
import { useSocket } from "@/lib/socketContext";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  incomingCall,
  callAccepted,
  callRejected,
  callEnded,
  callBusy,
  callTimeout,
  callConnected,
  tickDuration,
  initiateCall,
  resetCall,
} from "@/store/slices/callSlice";
import { useWebRTC } from "./useWebRTC";
import { useMediaDevices } from "./useMediaDevices";
import type { IIncomingCallPayload, IInitiateCallPayload } from "@/types/call.types";

/**
 * Orchestration hook that wires Socket.IO call events to Redux state and WebRTC.
 * Mount this once at the app root level (inside SocketProvider).
 */
export function useCallSocket() {
  const { socket } = useSocket();
  const dispatch = useAppDispatch();
  const callState = useAppSelector((state) => state.call);
  const durationInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const { getMediaStream, stopAllTracks } = useMediaDevices();

  const {
    localStream,
    remoteStream,
    connectionState,
    createOffer,
    createAnswer,
    handleAnswer,
    addIceCandidate,
    replaceTrack,
    closeConnection,
  } = useWebRTC({ socket, callId: callState.callId });

  // ─── Duration timer ──────────────────────────────────────————────

  useEffect(() => {
    if (callState.status === "ongoing" && !durationInterval.current) {
      durationInterval.current = setInterval(() => {
        dispatch(tickDuration());
      }, 1000);
    }

    if (callState.status !== "ongoing" && durationInterval.current) {
      clearInterval(durationInterval.current);
      durationInterval.current = null;
    }

    return () => {
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
        durationInterval.current = null;
      }
    };
  }, [callState.status, dispatch]);

  // ─── Socket event listeners ──────────────────────────────────────

  useEffect(() => {
    if (!socket) return;

    const handleIncoming = (data: IIncomingCallPayload) => {
      dispatch(
        incomingCall({
          callId: data.callId,
          peer: data.caller,
          callType: data.type,
        })
      );
    };

    const handleAccepted = async (data: { callId: string }) => {
      dispatch(callAccepted());

      // Caller: create WebRTC offer
      try {
        const constraints: MediaStreamConstraints = {
          audio: true,
          video: callState.callType === "video",
        };
        const stream = await getMediaStream(constraints);
        const offer = await createOffer(stream);

        socket.emit("signal:offer", { callId: data.callId, sdp: offer });
      } catch (err) {
        console.error("[Call] Failed to create offer:", err);
      }
    };

    const handleRejected = () => {
      dispatch(callRejected());
      closeConnection();
      stopAllTracks();
    };

    const handleEnded = (data: { callId: string; duration: number }) => {
      dispatch(callEnded({ duration: data.duration }));
      closeConnection();
      stopAllTracks();
    };

    const handleBusy = () => {
      dispatch(callBusy());
      closeConnection();
      stopAllTracks();
    };

    const handleTimeout = () => {
      dispatch(callTimeout());
      closeConnection();
      stopAllTracks();
    };

    // ─── WebRTC signaling ───────────────────────────────

    const handleOffer = async (data: { callId: string; sdp: RTCSessionDescriptionInit }) => {
      try {
        const constraints: MediaStreamConstraints = {
          audio: true,
          video: callState.callType === "video",
        };
        const stream = await getMediaStream(constraints);
        const answer = await createAnswer(data.sdp, stream);

        socket.emit("signal:answer", { callId: data.callId, sdp: answer });
        dispatch(callConnected());
      } catch (err) {
        console.error("[Call] Failed to create answer:", err);
      }
    };

    const handleSignalAnswer = async (data: { callId: string; sdp: RTCSessionDescriptionInit }) => {
      await handleAnswer(data.sdp);
      dispatch(callConnected());
    };

    const handleIce = async (data: { callId: string; candidate: RTCIceCandidateInit }) => {
      await addIceCandidate(data.candidate);
    };

    socket.on("call:incoming", handleIncoming);
    socket.on("call:accepted", handleAccepted);
    socket.on("call:rejected", handleRejected);
    socket.on("call:ended", handleEnded);
    socket.on("call:busy", handleBusy);
    socket.on("call:timeout", handleTimeout);
    socket.on("signal:offer", handleOffer);
    socket.on("signal:answer", handleSignalAnswer);
    socket.on("signal:ice", handleIce);

    return () => {
      socket.off("call:incoming", handleIncoming);
      socket.off("call:accepted", handleAccepted);
      socket.off("call:rejected", handleRejected);
      socket.off("call:ended", handleEnded);
      socket.off("call:busy", handleBusy);
      socket.off("call:timeout", handleTimeout);
      socket.off("signal:offer", handleOffer);
      socket.off("signal:answer", handleSignalAnswer);
      socket.off("signal:ice", handleIce);
    };
  }, [
    socket,
    callState.callType,
    dispatch,
    getMediaStream,
    createOffer,
    createAnswer,
    handleAnswer,
    addIceCandidate,
    closeConnection,
    stopAllTracks,
  ]);

  // ─── Actions ─────────────────────────────────────────────────────

  const startCall = useCallback(
    (payload: IInitiateCallPayload) => {
      if (!socket) return;

      socket.emit("call:initiate", {
        calleeId: payload.calleeId,
        type: payload.type,
        conversationId: payload.conversationId,
      });

      dispatch(
        initiateCall({
          callId: "", // Will be set by server response
          peer: {
            id: payload.calleeId,
            name: payload.calleeName,
            profileImage: payload.calleeProfileImage,
          },
          callType: payload.type,
        })
      );
    },
    [socket, dispatch]
  );

  const acceptCurrentCall = useCallback(() => {
    if (!socket || !callState.callId) return;
    socket.emit("call:accept", { callId: callState.callId });
  }, [socket, callState.callId]);

  const rejectCurrentCall = useCallback(() => {
    if (!socket || !callState.callId) return;
    socket.emit("call:reject", { callId: callState.callId });
    dispatch(resetCall());
  }, [socket, callState.callId, dispatch]);

  const endCurrentCall = useCallback(() => {
    if (!socket || !callState.callId) return;
    socket.emit("call:end", { callId: callState.callId });
    closeConnection();
    stopAllTracks();
  }, [socket, callState.callId, closeConnection, stopAllTracks]);

  return {
    // State
    callState,
    localStream,
    remoteStream,
    connectionState,

    // Actions
    startCall,
    acceptCurrentCall,
    rejectCurrentCall,
    endCurrentCall,
    replaceTrack,
  };
}
