import { useCallback, useRef, useState } from "react";
import { RTC_CONFIG } from "../utils/callConstants";
import type { Socket } from "socket.io-client";

interface UseWebRTCOptions {
  socket: Socket | null;
  callId: string | null;
}

interface UseWebRTCReturn {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  connectionState: RTCPeerConnectionState | null;
  createOffer: (stream: MediaStream) => Promise<RTCSessionDescriptionInit>;
  createAnswer: (
    sdp: RTCSessionDescriptionInit,
    stream: MediaStream
  ) => Promise<RTCSessionDescriptionInit>;
  handleAnswer: (sdp: RTCSessionDescriptionInit) => Promise<void>;
  addIceCandidate: (candidate: RTCIceCandidateInit) => Promise<void>;
  replaceTrack: (newTrack: MediaStreamTrack) => void;
  closeConnection: () => void;
}

/**
 * Manages the RTCPeerConnection lifecycle for 1-on-1 calls.
 * Emits signaling events through the provided socket.
 */
export function useWebRTC({ socket, callId }: UseWebRTCOptions): UseWebRTCReturn {
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [connectionState, setConnectionState] =
    useState<RTCPeerConnectionState | null>(null);

  /** Pending ICE candidates received before remote description was set. */
  const pendingCandidates = useRef<RTCIceCandidateInit[]>([]);

  const createPeerConnection = useCallback(
    (stream: MediaStream) => {
      const pc = new RTCPeerConnection(RTC_CONFIG);

      // Add local tracks to the connection
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });
      setLocalStream(stream);

      // Handle remote tracks
      const remote = new MediaStream();
      setRemoteStream(remote);

      pc.ontrack = (event) => {
        event.streams[0]?.getTracks().forEach((track) => {
          remote.addTrack(track);
        });
        setRemoteStream(new MediaStream(remote.getTracks()));
      };

      // Emit ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate && socket && callId) {
          socket.emit("signal:ice", {
            callId,
            candidate: event.candidate.toJSON(),
          });
        }
      };

      // Track connection state
      pc.onconnectionstatechange = () => {
        setConnectionState(pc.connectionState);

        if (pc.connectionState === "failed") {
          // Attempt ICE restart
          pc.restartIce();
        }
      };

      pc.oniceconnectionstatechange = () => {
        if (pc.iceConnectionState === "disconnected") {
          // Attempt ICE restart on disconnection
          pc.restartIce();
        }
      };

      pcRef.current = pc;
      return pc;
    },
    [socket, callId]
  );

  const flushPendingCandidates = useCallback(async () => {
    const pc = pcRef.current;
    if (!pc) return;

    for (const candidate of pendingCandidates.current) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (e) {
        console.warn("[WebRTC] Failed to add buffered ICE candidate:", e);
      }
    }
    pendingCandidates.current = [];
  }, []);

  const createOffer = useCallback(
    async (stream: MediaStream): Promise<RTCSessionDescriptionInit> => {
      const pc = createPeerConnection(stream);
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      return offer;
    },
    [createPeerConnection]
  );

  const createAnswer = useCallback(
    async (
      sdp: RTCSessionDescriptionInit,
      stream: MediaStream
    ): Promise<RTCSessionDescriptionInit> => {
      const pc = createPeerConnection(stream);
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      await flushPendingCandidates();
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      return answer;
    },
    [createPeerConnection, flushPendingCandidates]
  );

  const handleAnswer = useCallback(
    async (sdp: RTCSessionDescriptionInit) => {
      const pc = pcRef.current;
      if (!pc) return;
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      await flushPendingCandidates();
    },
    [flushPendingCandidates]
  );

  const addIceCandidate = useCallback(
    async (candidate: RTCIceCandidateInit) => {
      const pc = pcRef.current;
      if (!pc || !pc.remoteDescription) {
        // Buffer if remote description not yet set
        pendingCandidates.current.push(candidate);
        return;
      }
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (e) {
        console.warn("[WebRTC] Failed to add ICE candidate:", e);
      }
    },
    []
  );

  const replaceTrack = useCallback((newTrack: MediaStreamTrack) => {
    const pc = pcRef.current;
    if (!pc) return;

    const sender = pc
      .getSenders()
      .find((s) => s.track?.kind === newTrack.kind);

    if (sender) {
      void sender.replaceTrack(newTrack);
    }
  }, []);

  const closeConnection = useCallback(() => {
    const pc = pcRef.current;
    if (pc) {
      pc.close();
      pcRef.current = null;
    }

    localStream?.getTracks().forEach((t) => t.stop());
    setLocalStream(null);
    setRemoteStream(null);
    setConnectionState(null);
    pendingCandidates.current = [];
  }, [localStream]);

  return {
    localStream,
    remoteStream,
    connectionState,
    createOffer,
    createAnswer,
    handleAnswer,
    addIceCandidate,
    replaceTrack,
    closeConnection,
  };
}
