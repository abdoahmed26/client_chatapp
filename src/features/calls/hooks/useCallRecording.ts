import { useCallback, useRef, useState } from "react";

interface UseCallRecordingReturn {
  isRecording: boolean;
  startRecording: (streams: MediaStream[]) => void;
  stopRecording: () => void;
  downloadRecording: () => void;
}

/**
 * Records call audio/video using the MediaRecorder API.
 * Combines multiple MediaStreams (local + remote) into one recording.
 */
export function useCallRecording(): UseCallRecordingReturn {
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = useCallback((streams: MediaStream[]) => {
    try {
      // Combine all streams into one
      const audioContext = new AudioContext();
      const destination = audioContext.createMediaStreamDestination();

      streams.forEach((stream) => {
        stream.getAudioTracks().forEach((track) => {
          const source = audioContext.createMediaStreamSource(
            new MediaStream([track])
          );
          source.connect(destination);
        });
      });

      // Add video from the first stream that has video
      const videoTrack = streams
        .flatMap((s) => s.getVideoTracks())
        .find(Boolean);

      const combinedStream = new MediaStream([
        ...destination.stream.getTracks(),
        ...(videoTrack ? [videoTrack] : []),
      ]);

      const recorder = new MediaRecorder(combinedStream, {
        mimeType: MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
          ? "video/webm;codecs=vp9"
          : "video/webm",
      });

      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.start(1000); // Collect data every second
      recorderRef.current = recorder;
      setIsRecording(true);
    } catch (err) {
      console.error("[CallRecording] Failed to start recording:", err);
    }
  }, []);

  const stopRecording = useCallback(() => {
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    }
    recorderRef.current = null;
    setIsRecording(false);
  }, []);

  const downloadRecording = useCallback(() => {
    if (chunksRef.current.length === 0) return;

    const blob = new Blob(chunksRef.current, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `call-recording-${Date.now()}.webm`;
    a.click();
    URL.revokeObjectURL(url);

    chunksRef.current = [];
  }, []);

  return {
    isRecording,
    startRecording,
    stopRecording,
    downloadRecording,
  };
}
