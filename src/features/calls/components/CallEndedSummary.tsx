import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Clock } from "lucide-react";
import type { ICallPeer, CallType } from "@/types/call.types";
import { CALL_ENDED_DISMISS_MS } from "../utils/callConstants";

interface CallEndedSummaryProps {
  peer: ICallPeer;
  callType: CallType;
  duration: number;
  onCallAgain: () => void;
  onDismiss: () => void;
}

function formatDuration(seconds: number): string {
  if (seconds === 0) return "No answer";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${s}s`;
}

/**
 * Brief summary shown after a call ends.
 * Auto-dismisses after a few seconds.
 */
export default function CallEndedSummary({
  peer,
  callType,
  duration,
  onCallAgain,
  onDismiss,
}: CallEndedSummaryProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onDismiss();
    }, CALL_ENDED_DISMISS_MS);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-6 left-1/2 z-100 -translate-x-1/2"
        >
          <div className="flex items-center gap-4 rounded-2xl bg-gray-800/95 px-6 py-4 shadow-2xl backdrop-blur-md border border-white/10">
            {/* Avatar */}
            {peer.profileImage ? (
              <img
                src={peer.profileImage}
                alt={peer.name}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white">
                {peer.name.charAt(0).toUpperCase()}
              </div>
            )}

            {/* Info */}
            <div>
              <p className="text-sm font-semibold text-white">
                Call with {peer.name}
              </p>
              <p className="flex items-center gap-1 text-xs text-gray-400">
                <Clock size={12} />
                {formatDuration(duration)} · {callType}
              </p>
            </div>

            {/* Call again */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCallAgain}
              className="ml-2 flex items-center gap-1.5 rounded-xl bg-green-500 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-green-600"
            >
              <Phone size={14} />
              Call again
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
