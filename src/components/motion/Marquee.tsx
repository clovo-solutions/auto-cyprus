'use client';

import { type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface MarqueeProps {
  children: ReactNode;
  className?: string;
  /** Animation duration in seconds. Higher = slower. */
  duration?: number;
  /** Direction of scroll */
  direction?: 'left' | 'right';
  /** Pause on hover */
  pauseOnHover?: boolean;
}

export function Marquee({
  children,
  className,
  duration = 40,
  direction = 'left',
  pauseOnHover = true,
}: MarqueeProps) {
  return (
    <div
      className={cn(
        'group relative flex overflow-hidden whitespace-nowrap',
        '[mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]',
        className,
      )}
      aria-hidden="true"
    >
      <div
        className={cn(
          'flex shrink-0 animate-marquee items-center',
          direction === 'right' && '[animation-direction:reverse]',
          pauseOnHover && 'group-hover:[animation-play-state:paused]',
        )}
        style={{ animationDuration: `${duration}s` }}
      >
        {children}
      </div>
      <div
        className={cn(
          'flex shrink-0 animate-marquee items-center',
          direction === 'right' && '[animation-direction:reverse]',
          pauseOnHover && 'group-hover:[animation-play-state:paused]',
        )}
        style={{ animationDuration: `${duration}s` }}
      >
        {children}
      </div>
    </div>
  );
}
