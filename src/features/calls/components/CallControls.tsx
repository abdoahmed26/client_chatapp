import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  MonitorOff,
  CircleDot,
  PhoneOff,
} from "lucide-react";
import { motion } from "framer-motion";

interface CallControlsProps {
  isMuted: boolean;
  isCameraOff: boolean;
  isScreenSharing: boolean;
  isRecording: boolean;
  callType: "audio" | "video";
  onToggleMute: () => void;
  onToggleCamera: () => void;
  onToggleScreenShare: () => void;
  onToggleRecording: () => void;
  onEndCall: () => void;
}

/**
 * Horizontal control bar displayed at the bottom of the active call view.
 */
export default function CallControls({
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
}: CallControlsProps) {
  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 25 }}
      className="flex items-center justify-center gap-3 rounded-2xl bg-gray-800/80 px-6 py-4 backdrop-blur-md border border-white/5 shadow-2xl"
    >
      {/* Mute */}
      <ControlButton
        active={isMuted}
        activeColor="bg-red-500/20 text-red-400 hover:bg-red-500/30"
        onClick={onToggleMute}
        label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
      </ControlButton>

      {/* Camera (only for video calls) */}
      {callType === "video" && (
        <ControlButton
          active={isCameraOff}
          activeColor="bg-red-500/20 text-red-400 hover:bg-red-500/30"
          onClick={onToggleCamera}
          label={isCameraOff ? "Turn camera on" : "Turn camera off"}
        >
          {isCameraOff ? <VideoOff size={20} /> : <Video size={20} />}
        </ControlButton>
      )}

      {/* Screen Share */}
      <ControlButton
        active={isScreenSharing}
        activeColor="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
        onClick={onToggleScreenShare}
        label={isScreenSharing ? "Stop sharing" : "Share screen"}
      >
        {isScreenSharing ? <MonitorOff size={20} /> : <MonitorUp size={20} />}
      </ControlButton>

      {/* Record */}
      <ControlButton
        active={isRecording}
        activeColor="bg-red-500/20 text-red-400 hover:bg-red-500/30"
        onClick={onToggleRecording}
        label={isRecording ? "Stop recording" : "Record"}
      >
        <CircleDot size={20} className={isRecording ? "animate-pulse" : ""} />
      </ControlButton>

      {/* End Call */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onEndCall}
        className="ml-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white shadow-lg shadow-red-500/40 transition-colors hover:bg-red-600"
        aria-label="End call"
        title="End call"
      >
        <PhoneOff size={20} />
      </motion.button>
    </motion.div>
  );
}

// ─── Internal helper ─────────────────────────────────────────────

function ControlButton({
  active,
  activeColor,
  onClick,
  label,
  children,
}: {
  active: boolean;
  activeColor: string;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
        active
          ? activeColor
          : "bg-white/10 text-white hover:bg-white/20"
      }`}
      aria-label={label}
      title={label}
    >
      {children}
    </motion.button>
  );
}
