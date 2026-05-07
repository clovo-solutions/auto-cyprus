import { cn } from '@/lib/cn';

interface LiveDotProps {
  className?: string;
  /** Color tone. Default 'success' = green. */
  tone?: 'success' | 'accent' | 'warning';
  size?: number;
}

/**
 * A pulsing dot. Used next to "live" or "in stock" labels to give the
 * page a sense of being a real, current thing rather than static marketing.
 */
export function LiveDot({ className, tone = 'success', size = 8 }: LiveDotProps) {
  const color =
    tone === 'success'
      ? 'bg-success'
      : tone === 'accent'
        ? 'bg-accent'
        : 'bg-warning';

  return (
    <span
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <span
        className={cn('absolute inset-0 rounded-full opacity-60 animate-ping-slow', color)}
      />
      <span className={cn('relative rounded-full', color)} style={{ width: size, height: size }} />
    </span>
  );
}
