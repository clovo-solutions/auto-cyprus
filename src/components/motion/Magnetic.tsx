'use client';

import { useRef, type ReactNode, type MouseEvent } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/cn';

interface MagneticProps {
  children: ReactNode;
  className?: string;
  /** Strength of the magnetic pull, 0-1. Default 0.25 = subtle. */
  strength?: number;
}

/**
 * Wraps children in a container that subtly translates toward the cursor
 * when hovered. Used very sparingly — currently only on the primary
 * hero CTA to give it a touch of life. Disabled with prefers-reduced-motion.
 */
export function Magnetic({ children, className, strength = 0.25 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 200, damping: 20, mass: 0.4 });

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduced || !ref.current) {
      return;
    }
    const rect = ref.current.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    x.set(dx * strength);
    y.set(dy * strength);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={cn('inline-block', className)}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: springX, y: springY }}
    >
      {children}
    </motion.div>
  );
}
