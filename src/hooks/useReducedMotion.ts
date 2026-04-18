import { useState, useEffect } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/** Returns true if the user prefers reduced motion (OS accessibility setting). */
export default function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(QUERY).matches;
  });

  useEffect(() => {
    const mql = window.matchMedia(QUERY);

    const handleChange = (event: MediaQueryListEvent): void => {
      setPrefersReduced(event.matches);
    };

    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  return prefersReduced;
}
