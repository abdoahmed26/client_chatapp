import type { Variants } from 'framer-motion';

// ─── Duration Constants (ms) ─────────────────────────────────────────────────

/** Fast transitions — hover effects, opacity changes. */
export const DURATION_FAST = 150;

/** Standard transitions — page entrances, dialog open/close. */
export const DURATION_NORMAL = 250;

/** Deliberate transitions — complex layout changes. */
export const DURATION_SLOW = 350;

// ─── Easing Constants ────────────────────────────────────────────────────────

/** Default easing curve (CSS ease-out as cubic-bezier array for Framer Motion). */
export const EASING_DEFAULT: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

// ─── Spring Configuration ────────────────────────────────────────────────────

/** Spring physics config for bouncy micro-interactions. */
export const SPRING_CONFIG = { stiffness: 300, damping: 24, mass: 0.8 } as const;

// ─── Framer Motion Variants ──────────────────────────────────────────────────

/** Fade in/out page transition. */
export const fadeVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

/** Slide up entrance with fade. */
export const slideUpVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: EASING_DEFAULT } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
};

/** Slide in from right with fade. */
export const slideRightVariants: Variants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.25, ease: EASING_DEFAULT } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.15 } },
};

/** Scale-in with spring physics for modals and cards. */
export const scaleInVariants: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1, transition: { type: 'spring', ...SPRING_CONFIG } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
};

/** Stagger container — orchestrates staggered children entrance. */
export const staggerContainerVariants: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.05 } },
};

/** Stagger item — individual item entrance within a staggered container. */
export const staggerItemVariants: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};
