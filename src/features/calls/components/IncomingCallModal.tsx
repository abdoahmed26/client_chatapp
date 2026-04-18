import { motion, AnimatePresence } from "framer-motion";
import { Phone, PhoneOff, Video } from "lucide-react";
import type { ICallPeer, CallType } from "@/types/call.types";

interface IncomingCallModalProps {
  peer: ICallPeer;
  callType: CallType;
  onAccept: () => void;
  onReject: () => void;
}

/**
 * Full-screen modal shown when receiving an incoming call.
 * Features a pulsing ring animation, caller info, and accept/reject buttons.
 */
export default function IncomingCallModal({
  peer,
  callType,
  onAccept,
  onReject,
}: IncomingCallModalProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="flex flex-col items-center gap-8 rounded-3xl bg-gray-900/90 px-12 py-10 shadow-2xl backdrop-blur-xl border border-white/10"
        >
          {/* Pulsing avatar ring */}
          <div className="relative">
            {/* Outer pulsing rings */}
            <span className="absolute inset-0 animate-ping rounded-full bg-green-400/30" />
            <span
              className="absolute inset-[-8px] rounded-full bg-green-400/20"
              style={{ animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite 0.3s" }}
            />

            {peer.profileImage ? (
              <img
                src={peer.profileImage}
                alt={peer.name}
                className="relative z-10 h-24 w-24 rounded-full border-4 border-green-400 object-cover shadow-lg shadow-green-400/30"
              />
            ) : (
              <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full border-4 border-green-400 bg-linear-to-br from-green-500 to-emerald-600 text-3xl font-bold text-white shadow-lg shadow-green-400/30">
                {peer.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Caller info */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">{peer.name}</h2>
            <p className="mt-1 flex items-center justify-center gap-2 text-sm text-gray-400">
              {callType === "video" ? (
                <Video size={16} className="text-blue-400" />
              ) : (
                <Phone size={16} className="text-green-400" />
              )}
              Incoming {callType} call…
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-8">
            {/* Reject */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onReject}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500 text-white shadow-lg shadow-red-500/40 transition-colors hover:bg-red-600"
              aria-label="Reject call"
            >
              <PhoneOff size={24} />
            </motion.button>

            {/* Accept */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAccept}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-500/40 transition-colors hover:bg-green-600"
              aria-label="Accept call"
            >
              {callType === "video" ? (
                <Video size={24} />
              ) : (
                <Phone size={24} />
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
