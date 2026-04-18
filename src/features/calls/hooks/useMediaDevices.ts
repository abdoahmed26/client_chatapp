import { useCallback, useRef, useState } from "react";

interface UseMediaDevicesReturn {
  stream: MediaStream | null;
  isMuted: boolean;
  isCameraOff: boolean;
  error: string | null;
  getMediaStream: (constraints: MediaStreamConstraints) => Promise<MediaStream>;
  toggleMic: () => void;
  toggleCamera: () => void;
  stopAllTracks: () => void;
}

/**
 * Manages camera and microphone access with toggle controls.
 */
export function useMediaDevices(): UseMediaDevicesReturn {
  const streamRef = useRef<MediaStream | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getMediaStream = useCallback(
    async (constraints: MediaStreamConstraints): Promise<MediaStream> => {
      try {
        setError(null);
        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = mediaStream;
        setStream(mediaStream);
        return mediaStream;
      } catch (err: any) {
        const message =
          err.name === "NotAllowedError"
            ? "Camera/microphone permission denied. Please allow access in your browser settings."
            : err.name === "NotFoundError"
              ? "No camera or microphone found."
              : `Failed to access media devices: ${err.message}`;
        setError(message);
        throw new Error(message);
      }
    },
    []
  );

  const toggleMic = useCallback(() => {
    const s = streamRef.current;
    if (!s) return;

    s.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });

    setIsMuted((prev) => !prev);
  }, []);

  const toggleCamera = useCallback(() => {
    const s = streamRef.current;
    if (!s) return;

    s.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });

    setIsCameraOff((prev) => !prev);
  }, []);

  const stopAllTracks = useCallback(() => {
    const s = streamRef.current;
    if (s) {
      s.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setStream(null);
    }
  }, []);

  return {
    stream,
    isMuted,
    isCameraOff,
    error,
    getMediaStream,
    toggleMic,
    toggleCamera,
    stopAllTracks,
  };
}
