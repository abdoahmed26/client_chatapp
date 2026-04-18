/** Standardized loading state for data-fetching views. */
export type LoadingState = 'idle' | 'loading' | 'error' | 'success';

/** Animation variant names for page transitions. */
export type AnimationVariant = 'fade' | 'slideUp' | 'slideRight';

/** Error information passed to error boundary fallback components. */
export interface ErrorInfo {
  /** User-friendly error description. */
  message: string;
  /** Whether a retry action is available. */
  canRetry: boolean;
  /** Optional retry callback. */
  onRetry?: () => void;
}
