import { useCallback, useRef, useState } from "react";

interface UseScreenShareReturn {
  isSharing: boolean;
  screenStream: MediaStream | null;
  startScreenShare: () => Promise<MediaStream>;
  stopScreenShare: () => void;
}

/**
 * Manages screen sharing via getDisplayMedia.
 * Handles the browser's native "Stop sharing" button.
 */
export function useScreenShare(
  onTrackReplace?: (track: MediaStreamTrack) => void,
  cameraTrack?: MediaStreamTrack | null
): UseScreenShareReturn {
  const screenStreamRef = useRef<MediaStream | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);

  const startScreenShare = useCallback(async (): Promise<MediaStream> => {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false,
    });

    screenStreamRef.current = stream;
    setScreenStream(stream);
    setIsSharing(true);

    const videoTrack = stream.getVideoTracks()[0];

    // Replace the camera track with the screen track in the peer connection
    if (onTrackReplace && videoTrack) {
      onTrackReplace(videoTrack);
    }

    // Handle the browser's native "Stop sharing" button
    videoTrack.addEventListener("ended", () => {
      stopScreenShare();
    });

    return stream;
  }, [onTrackReplace]);

  const stopScreenShare = useCallback(() => {
    const s = screenStreamRef.current;
    if (s) {
      s.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;
      setScreenStream(null);
    }

    setIsSharing(false);

    // Restore the camera track in the peer connection
    if (onTrackReplace && cameraTrack) {
      onTrackReplace(cameraTrack);
    }
  }, [onTrackReplace, cameraTrack]);

  return {
    isSharing,
    screenStream,
    startScreenShare,
    stopScreenShare,
  };
}
