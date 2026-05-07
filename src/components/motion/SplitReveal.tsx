'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/cn';

interface SplitRevealProps {
  text: string;
  className?: string;
  delay?: number;
  staggerChildren?: number;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

export function SplitReveal({
  text,
  className,
  delay = 0,
  staggerChildren = 0.06,
  as = 'span',
}: SplitRevealProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    const Static = as;
    return <Static className={className}>{text}</Static>;
  }

  // Split on whitespace but keep the spaces so layout/wrapping is preserved
  const words = text.split(/(\s+)/);

  // We render each word as an inline-block with overflow:hidden, so the inner
  // span can translate up from below without affecting baseline alignment.
  const Component = motion[as] as typeof motion.span;

  return (
    <Component
      className={cn(className)}
      initial="hidden"
      animate="visible"
      aria-label={text}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: delay,
            staggerChildren,
          },
        },
      }}
    >
      {words.map((word, i) => {
        if (/^\s+$/.test(word)) {
          return (
            <span key={i} aria-hidden="true">
              {word}
            </span>
          );
        }
        return (
          <span
            key={i}
            className="inline-block overflow-hidden align-baseline"
            aria-hidden="true"
          >
            <motion.span
              className="inline-block will-change-transform"
              variants={{
                hidden: { y: '105%' },
                visible: {
                  y: '0%',
                  transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
                },
              }}
            >
              {word}
            </motion.span>
          </span>
        );
      })}
    </Component>
  );
}
