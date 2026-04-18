import { AnimatePresence, motion } from 'framer-motion';
import { WifiOff } from 'lucide-react';
import useOnlineStatus from '@/hooks/useOnlineStatus';

/** Fixed-position banner shown when the browser loses network connectivity. Auto-dismisses on reconnection. */
export default function OfflineBanner() {
  const { isOnline } = useOnlineStatus();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.3 }}
          className="fixed left-0 right-0 top-0 z-50 bg-amber-500 text-white"
        >
          <div className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium">
            <WifiOff size={16} />
            You are offline. Checking connection...
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
