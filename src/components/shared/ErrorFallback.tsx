import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { scaleInVariants } from '@/lib/animations';

interface ErrorFallbackProps {
  /** The error that was caught by the boundary. */
  error: unknown;
  /** Resets the error boundary, re-rendering the child tree. */
  resetErrorBoundary: () => void;
}

/** Fallback UI displayed when an ErrorBoundary catches a rendering error. */
export default function ErrorFallback({
  error,
  resetErrorBoundary,
}: ErrorFallbackProps) {
  const errorMessage =
    error instanceof Error ? error.message : 'An unexpected error occurred';
  return (
    <div className="flex min-h-[400px] flex-1 items-center justify-center p-6">
      <motion.div
        variants={scaleInVariants}
        initial="initial"
        animate="animate"
        className="flex w-full max-w-sm flex-col items-center gap-5 rounded-2xl border border-gray-100 bg-white p-8 shadow-lg"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <AlertTriangle size={32} className="text-red-500" />
        </div>

        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800">
            Something went wrong
          </h2>
          <p className="mt-2 line-clamp-2 text-sm text-gray-500">
            {errorMessage}
          </p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <button
            onClick={resetErrorBoundary}
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:opacity-90"
          >
            Try Again
          </button>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-gray-600"
          >
            <Home size={14} />
            Go Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
