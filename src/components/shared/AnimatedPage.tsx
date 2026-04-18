import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import useReducedMotion from '@/hooks/useReducedMotion';
import {
  fadeVariants,
  slideUpVariants,
  slideRightVariants,
} from '@/lib/animations';
import type { AnimationVariant } from '@/types/ui.types';
import type { Variants } from 'framer-motion';

const variantMap: Record<AnimationVariant, Variants> = {
  fade: fadeVariants,
  slideUp: slideUpVariants,
  slideRight: slideRightVariants,
};

interface AnimatedPageProps {
  /** Child content to animate. */
  children: ReactNode;
  /** Animation variant to use. Defaults to 'fade'. */
  variant?: AnimationVariant;
}

/** Wraps page content with a Framer Motion entrance/exit animation. Respects prefers-reduced-motion. */
export default function AnimatedPage({
  children,
  variant = 'fade',
}: AnimatedPageProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div>{children}</div>;
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variantMap[variant]}
    >
      {children}
    </motion.div>
  );
}
