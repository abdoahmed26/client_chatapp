import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import CallControls from "./CallControls";
import type { ICallPeer, CallType } from "@/types/call.types";
import ScreenShareView from "./ScreenShareView";

interface ActiveCallViewProps {
  peer: ICallPeer;
  callType: CallType;
  duration: number;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isMuted: boolean;
  isCameraOff: boolean;
  isScreenSharing: boolean;
  isRecording: boolean;
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
 * Full-screen active call view with video streams, avatar fallback for audio,
 * call timer, and controls bar.
 */
export default function ActiveCallView({
  peer,
  callType,
  duration,
  localStream,
  remoteStream,
  isMuted,
  isCameraOff,
  isScreenSharing,
  isRecording,
  onToggleMute,
  onToggleCamera,
  onToggleScreenShare,
  onToggleRecording,
  onEndCall,
}: ActiveCallViewProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Attach streams to video elements
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

  const isVideoCall = callType === "video";

  // Screen share mode
  if (isScreenSharing) {
    return (
      <ScreenShareView
        localStream={localStream}
        remoteStream={remoteStream}
        peer={peer}
        duration={duration}
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
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-100 flex flex-col bg-gray-950"
    >
      {/* Header: peer name + duration */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          {peer.profileImage ? (
            <img
              src={peer.profileImage}
              alt={peer.name}
              className="h-10 w-10 rounded-full object-cover border-2 border-white/20"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white">
              {peer.name.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-lg font-semibold text-white">{peer.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-green-400" />
          <span className="font-mono text-sm text-gray-400">
            {formatDuration(duration)}
          </span>
        </div>
      </div>

      {/* Main content area */}
      <div className="relative flex flex-1 items-center justify-center">
        {isVideoCall ? (
          <>
            {/* Remote video (full area) */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="h-full w-full object-cover"
            />

            {/* Local video (PiP corner) */}
            <motion.div
              drag
              dragMomentum={false}
              whileHover={{ scale: 1.05 }}
              className="absolute bottom-24 right-6 h-36 w-48 cursor-grab overflow-hidden rounded-2xl border-2 border-white/20 shadow-2xl active:cursor-grabbing sm:h-44 sm:w-56"
            >
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="h-full w-full object-cover"
              />
              {isCameraOff && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                  <span className="text-xs text-gray-400">Camera off</span>
                </div>
              )}
            </motion.div>
          </>
        ) : (
          // Audio-only mode: show avatars with audio visualization
          <div className="flex flex-col items-center gap-6">
            {/* Remote user avatar */}
            <div className="relative">
              <motion.div
                animate={{ boxShadow: ["0 0 0 0px rgba(59,130,246,0.3)", "0 0 0 20px rgba(59,130,246,0)", "0 0 0 0px rgba(59,130,246,0.3)"] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="rounded-full"
              >
                {peer.profileImage ? (
                  <img
                    src={peer.profileImage}
                    alt={peer.name}
                    className="h-32 w-32 rounded-full border-4 border-blue-400/30 object-cover sm:h-40 sm:w-40"
                  />
                ) : (
                  <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-blue-400/30 bg-linear-to-br from-blue-500 to-indigo-600 text-5xl font-bold text-white sm:h-40 sm:w-40">
                    {peer.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Audio wave bars */}
            <div className="flex items-end gap-1">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ height: [8, 20 + Math.random() * 16, 8] }}
                  transition={{
                    duration: 0.6 + Math.random() * 0.4,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                  className="w-1 rounded-full bg-blue-400/60"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Controls bar at bottom */}
      <div className="flex justify-center pb-8">
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
