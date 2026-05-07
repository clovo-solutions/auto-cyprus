import { cn } from '@/lib/cn';

interface CertificateSealProps {
  className?: string;
  size?: number;
  /** The text that runs around the circle */
  label?: string;
  /** The center mark — defaults to the brand slash */
  centerMark?: string;
}

/**
 * A circular certification seal — text follows the circumference, with a
 * centered glyph. Reads as "embossed stamp" — passport-style, signing-off-the-deal style.
 *
 * Composed entirely in SVG so it's crisp at any size and theme-able via currentColor.
 */
export function CertificateSeal({
  className,
  size = 130,
  label = 'AUTO CYPRUS · VERIFIED · EST. 2013 · LIMASSOL ·',
  centerMark = '/',
}: CertificateSealProps) {
  const radius = size / 2 - 14;
  const center = size / 2;
  const pathId = `seal-path-${size}`;

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label="Auto Cyprus verified seal"
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        className="absolute inset-0"
      >
        {/* Outer hairline ring */}
        <circle
          cx={center}
          cy={center}
          r={size / 2 - 2}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.6"
          opacity="0.4"
        />
        {/* Inner ring with text */}
        <circle
          cx={center}
          cy={center}
          r={radius + 6}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.4"
          opacity="0.25"
        />
        {/* Path the text follows — invisible itself */}
        <defs>
          <path
            id={pathId}
            d={`M ${center}, ${center} m -${radius}, 0 a ${radius},${radius} 0 1,1 ${
              radius * 2
            },0 a ${radius},${radius} 0 1,1 -${radius * 2},0`}
            fill="none"
          />
        </defs>
        <text
          fontFamily="var(--font-sans)"
          fontSize="8.5"
          fontWeight="500"
          letterSpacing="2.6"
          fill="currentColor"
          style={{ textTransform: 'uppercase' }}
        >
          <textPath xlinkHref={`#${pathId}`} startOffset="0%">
            {label}
          </textPath>
        </text>
      </svg>
      {/* Centered serif glyph */}
      <span
        aria-hidden="true"
        className="display-italic text-current text-3xl leading-none select-none"
        style={{ fontFamily: 'var(--font-serif)' }}
      >
        {centerMark}
      </span>
    </div>
  );
}