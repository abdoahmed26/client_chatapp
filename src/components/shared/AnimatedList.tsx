import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import useReducedMotion from '@/hooks/useReducedMotion';
import {
  staggerContainerVariants,
  staggerItemVariants,
} from '@/lib/animations';

interface AnimatedListProps<T> {
  /** Items to render. */
  items: T[];
  /** Unique key extractor for each item. */
  keyExtractor: (item: T) => string;
  /** Render function for each item. */
  renderItem: (item: T, index: number) => ReactNode;
  /** Optional className for the container. */
  className?: string;
}

/** Renders a list of items with staggered entrance animations. Respects prefers-reduced-motion. */
export default function AnimatedList<T>({
  items,
  keyExtractor,
  renderItem,
  className,
}: AnimatedListProps<T>) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <div className={className}>
        {items.map((item, index) => (
          <div key={keyExtractor(item)}>{renderItem(item, index)}</div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="initial"
      animate="animate"
      className={className}
    >
      {items.map((item, index) => (
        <motion.div key={keyExtractor(item)} variants={staggerItemVariants}>
          {renderItem(item, index)}
        </motion.div>
      ))}
    </motion.div>
  );
}
