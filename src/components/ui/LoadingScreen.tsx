import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import useReducedMotion from '@/hooks/useReducedMotion';

/** Full-screen branded loading screen shown during app initialization. */
export default function LoadingScreen() {
  const reducedMotion = useReducedMotion();

  const content = (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold text-primary">Chat</h1>
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm font-medium text-gray-400">
        Loading your conversations...
      </p>
    </div>
  );

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      {reducedMotion ? (
        content
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {content}
        </motion.div>
      )}
    </div>
  );
}
