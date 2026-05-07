import { cn } from '@/lib/cn';

interface CircleEmblemProps {
  text: string;
  className?: string;
  /** Diameter in pixels */
  size?: number;
  /** Animation: spin slow on hover, or always */
  spin?: 'always' | 'hover' | 'never';
}

/**
 * A circular rotating wordmark — text follows a circle path, slowly spinning.
 * The center holds a small italic-serif slash, matching the brand mark.
 *
 * Uses an SVG <textPath> on a circle. Pure SVG, no JS needed for the rotation
 * (the CSS @keyframes spin-slow handles it).
 */
export function CircleEmblem({
  text,
  className,
  size = 140,
  spin = 'always',
}: CircleEmblemProps) {
  // Repeat text with a separator so it fills the circumference cleanly.
  const sep = '  •  ';
  const fullText = (text + sep).repeat(2);
  const radius = size / 2 - 12;

  const spinClass =
    spin === 'always'
      ? 'animate-spin-slow'
      : spin === 'hover'
        ? 'group-hover:animate-spin-slow'
        : '';

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        className={cn('absolute inset-0', spinClass)}
      >
        <defs>
          <path
            id={`emblem-path-${size}`}
            d={`M ${size / 2}, ${size / 2} m -${radius}, 0 a ${radius},${radius} 0 1,1 ${
              radius * 2
            },0 a ${radius},${radius} 0 1,1 -${radius * 2},0`}
            fill="none"
          />
        </defs>
        <text
          fontFamily="var(--font-sans)"
          fontSize="9"
          fontWeight="500"
          letterSpacing="2.5"
          fill="currentColor"
          style={{ textTransform: 'uppercase' }}
        >
          <textPath xlinkHref={`#emblem-path-${size}`}>{fullText}</textPath>
        </text>
      </svg>
      {/* Center mark — italic serif slash */}
      <span
        className="display-italic text-current text-2xl leading-none select-none"
        style={{ fontFamily: 'var(--font-serif)' }}
      >
        /
      </span>
    </div>
  );
}
