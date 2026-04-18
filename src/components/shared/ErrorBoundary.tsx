import type { ReactNode } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './ErrorFallback';

interface ErrorBoundaryProps {
  /** Child components to protect. */
  children: ReactNode;
  /** Optional callback invoked when the user resets the boundary. */
  onReset?: () => void;
}

/** Application error boundary that catches rendering errors and shows a fallback UI. */
export default function ErrorBoundary({
  children,
  onReset,
}: ErrorBoundaryProps) {
  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback} onReset={onReset}>
      {children}
    </ReactErrorBoundary>
  );
}
