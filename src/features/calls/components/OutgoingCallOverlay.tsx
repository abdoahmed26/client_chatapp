import { motion } from "framer-motion";
import { PhoneOff } from "lucide-react";
import type { ICallPeer, CallType } from "@/types/call.types";

interface OutgoingCallOverlayProps {
  peer: ICallPeer;
  callType: CallType;
  onCancel: () => void;
}

/**
 * Overlay shown when the current user is calling someone.
 * Displays callee info with a "Ringing…" indicator and cancel button.
 */
export default function OutgoingCallOverlay({
  peer,
  callType,
  onCancel,
}: OutgoingCallOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-100 flex items-center justify-center bg-linear-to-b from-gray-900 via-gray-900/95 to-gray-950"
    >
      <div className="flex flex-col items-center gap-8">
        {/* Avatar with pulsing rings */}
        <div className="relative">
          <motion.span
            animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 rounded-full border-2 border-blue-400"
          />
          <motion.span
            animate={{ scale: [1, 2.2], opacity: [0.3, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.3,
            }}
            className="absolute inset-0 rounded-full border-2 border-blue-400"
          />

          {peer.profileImage ? (
            <img
              src={peer.profileImage}
              alt={peer.name}
              className="relative z-10 h-28 w-28 rounded-full border-4 border-blue-400/50 object-cover shadow-xl"
            />
          ) : (
            <div className="relative z-10 flex h-28 w-28 items-center justify-center rounded-full border-4 border-blue-400/50 bg-linear-to-br from-blue-500 to-indigo-600 text-4xl font-bold text-white shadow-xl">
              {peer.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Status text */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">{peer.name}</h2>
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-2 text-sm text-gray-400"
          >
            {callType === "video" ? "Video" : "Audio"} calling…
          </motion.p>
        </div>

        {/* Cancel button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCancel}
          className="mt-8 flex h-16 w-16 items-center justify-center rounded-full bg-red-500 text-white shadow-lg shadow-red-500/40 transition-colors hover:bg-red-600"
          aria-label="Cancel call"
        >
          <PhoneOff size={24} />
        </motion.button>
        <span className="text-xs text-gray-500">Cancel</span>
      </div>
    </motion.div>
  );
}
