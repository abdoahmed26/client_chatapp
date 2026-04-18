import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MonitorOff } from "lucide-react";
import CallControls from "./CallControls";
import type { ICallPeer, CallType } from "@/types/call.types";

interface ScreenShareViewProps {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  peer: ICallPeer;
  duration: number;
  isMuted: boolean;
  isCameraOff: boolean;
  isScreenSharing: boolean;
  isRecording: boolean;
  callType: CallType;
  onToggleMute: () => void;
  onToggleCamera: () => void;
  onToggleScreenShare: () => void;
  onToggleRecording: () => void;
  onEndCall: () => void;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

/**
 * Screen sharing layout: shared screen fills main area,
 * camera feeds are shown as small thumbnails.
 */
export default function ScreenShareView({
  localStream,
  remoteStream,
  peer,
  duration,
  isMuted,
  isCameraOff,
  isScreenSharing,
  isRecording,
  callType,
  onToggleMute,
  onToggleCamera,
  onToggleScreenShare,
  onToggleRecording,
  onEndCall,
}: ScreenShareViewProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-100 flex flex-col bg-gray-950"
    >
      {/* "Sharing your screen" banner */}
      <div className="flex items-center justify-between bg-blue-600 px-4 py-2">
        <div className="flex items-center gap-2 text-sm font-medium text-white">
          <MonitorOff size={16} />
          You are sharing your screen
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs text-blue-200">
            {formatDuration(duration)}
          </span>
          <button
            onClick={onToggleScreenShare}
            className="rounded-lg bg-white/20 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-white/30"
          >
            Stop Sharing
          </button>
        </div>
      </div>

      {/* Main screen share area */}
      <div className="relative flex flex-1 items-center justify-center bg-gray-900 p-4">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
        />

        {/* Thumbnail camera feeds */}
        <div className="absolute bottom-6 right-6 flex flex-col gap-3">
          {/* Local camera */}
          <div className="h-24 w-32 overflow-hidden rounded-xl border-2 border-white/20 shadow-xl sm:h-28 sm:w-36">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
            />
          </div>

          {/* Peer name label */}
          <div className="flex items-center gap-2 rounded-lg bg-gray-800/80 px-3 py-1.5 backdrop-blur-sm">
            {peer.profileImage ? (
              <img
                src={peer.profileImage}
                alt={peer.name}
                className="h-6 w-6 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white">
                {peer.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-xs font-medium text-white">{peer.name}</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center pb-6">
        <CallControls
          isMuted={isMuted}
          isCameraOff={isCameraOff}
          isScreenSharing={isScreenSharing}
          isRecording={isRecording}
          callType={callType}
          onToggleMute={onToggleMute}
          onToggleCamera={onToggleCamera}
          onToggleScreenShare={onToggleScreenShare}
          onToggleRecording={onToggleRecording}
          onEndCall={onEndCall}
        />
      </div>
    </motion.div>
  );
}
