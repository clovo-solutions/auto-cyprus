'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion, useInView } from 'framer-motion';
import { cn } from '@/lib/cn';

interface AnnotationPoint {
  /** Position of the dot on the car image, as percentages (0–100) */
  x: number;
  y: number;
  /** Where the label sits relative to the dot — "tl" | "tr" | "bl" | "br" */
  side: 'tl' | 'tr' | 'bl' | 'br';
  /** Eyebrow label (small uppercase) */
  label: string;
  /** Big serif value */
  value: string;
  /** Optional unit suffix in mist-tone */
  unit?: string;
}

interface HeroAnatomyProps {
  imageUrl: string;
  imageAlt: string;
  carTitle: string;
  carSubtitle: string;
  annotations: AnnotationPoint[];
  className?: string;
}

/**
 * A single car treated like a still-life specimen.
 *
 * The image holds an SVG overlay with thin lines from each annotation
 * dot to a label sitting in the surrounding gutter. Lines and dots
 * draw in sequentially. Hovering a dot pulses both ends of its line.
 *
 * No carousel, no parallax, no slogan. Just one car, examined.
 */
export function HeroAnatomy({
  imageUrl,
  imageAlt,
  carTitle,
  carSubtitle,
  annotations,
  className,
}: HeroAnatomyProps) {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, amount: 0.3 });
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full', className)}
      onMouseLeave={() => setActiveIdx(null)}
    >
      {/* Aspect-ratio frame around the car */}
<div className="relative aspect-[5/4] md:aspect-[16/10] min-h-[400px] md:min-h-[560px] image-frame film-grain bg-ink/5 overflow-hidden">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          priority
          sizes="(min-width: 1280px) 80vw, 100vw"
          className="object-cover"
        />

        {/* Subtle vignette so dot+line graphics stay legible */}
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-radial-gradient pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 40%, rgba(14,17,22,0.18) 100%)',
          }}
        />

        {/* SVG annotation overlay covers the image area precisely */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full pointer-events-none"
          aria-hidden="true"
        >
          {annotations.map((point, i) => {
            // Endpoint of the line — depends on which corner the label is in.
            // The line ends about 6% of the way toward the gutter, where
            // the label HTML element starts. We intentionally don't draw
            // the line all the way to the label text — leaves a quiet gap.
            const endX =
              point.side === 'tl' || point.side === 'bl'
                ? Math.max(point.x - 14, 2)
                : Math.min(point.x + 14, 98);
            const endY =
              point.side === 'tl' || point.side === 'tr'
                ? Math.max(point.y - 10, 2)
                : Math.min(point.y + 10, 98);

            const isActive = activeIdx === i;
            return (
              <g key={i}>
                <motion.line
                  x1={point.x}
                  y1={point.y}
                  x2={endX}
                  y2={endY}
                  stroke="currentColor"
                  strokeWidth={0.18}
                  vectorEffect="non-scaling-stroke"
                  className={cn(
                    'text-bone transition-opacity duration-300',
                    isActive ? 'opacity-100' : 'opacity-70',
                  )}
                  initial={reduced ? false : { pathLength: 0 }}
                  animate={inView || reduced ? { pathLength: 1 } : { pathLength: 0 }}
                  transition={{
                    duration: 0.7,
                    delay: 0.6 + i * 0.18,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
                <motion.circle
                  cx={point.x}
                  cy={point.y}
                  r={isActive ? 1.0 : 0.7}
                  fill="currentColor"
                  className="text-accent"
                  initial={reduced ? false : { scale: 0, opacity: 0 }}
                  animate={
                    inView || reduced
                      ? { scale: 1, opacity: 1 }
                      : { scale: 0, opacity: 0 }
                  }
                  transition={{
                    duration: 0.4,
                    delay: 0.4 + i * 0.18,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{ transformOrigin: `${point.x}px ${point.y}px` }}
                />
                {/* Outer ring — only on the active dot */}
                {isActive ? (
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={2}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={0.15}
                    vectorEffect="non-scaling-stroke"
                    className="text-accent opacity-60"
                  />
                ) : null}
              </g>
            );
          })}
        </svg>

        {/* HTML annotation labels positioned over the image. We use HTML
            instead of SVG <text> so they get crisp typography from the
            design system fonts. Each label is positioned via inline style
            using the percentages from the annotation data. */}
        {annotations.map((point, i) => {
          const isActive = activeIdx === i;
          const isOpposite =
            point.side === 'tr' || point.side === 'br';
          const isBottom = point.side === 'bl' || point.side === 'br';

          // Label anchor — sits in the gutter beyond the line endpoint.
          // Translate-X pulls left or right depending on side.
          const horizontal = isOpposite ? 'left' : 'right';
          const horizPct = isOpposite ? Math.min(point.x + 16, 98) : Math.max(point.x - 16, 2);
          const vertical = isBottom ? 'top' : 'bottom';
          const vertPct = isBottom
            ? Math.min(point.y + 10, 95)
            : Math.max(point.y - 10, 5);

          return (
            <motion.button
              key={i}
              type="button"
              onMouseEnter={() => setActiveIdx(i)}
              onFocus={() => setActiveIdx(i)}
              onBlur={() => setActiveIdx(null)}
              className={cn(
                'absolute pointer-events-auto group cursor-default flex flex-col gap-0.5',
                isOpposite ? 'items-start text-left' : 'items-end text-right',
              )}
              style={{
                [horizontal === 'left' ? 'left' : 'right']: `${
                  horizontal === 'left' ? horizPct : 100 - horizPct
                }%`,
                [vertical === 'top' ? 'top' : 'bottom']: `${
                  vertical === 'top' ? vertPct : 100 - vertPct
                }%`,
              }}
              initial={reduced ? false : { opacity: 0, y: isBottom ? -6 : 6 }}
              animate={
                inView || reduced
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: isBottom ? -6 : 6 }
              }
              transition={{
                duration: 0.5,
                delay: 1.0 + i * 0.18,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <span
                className={cn(
                  'text-2xs uppercase tracking-[0.18em] transition-colors duration-300',
                  isActive ? 'text-accent' : 'text-bone/70',
                )}
              >
                {point.label}
              </span>
              <span className="display-italic text-bone text-lg md:text-xl lg:text-2xl leading-none whitespace-nowrap tabular-nums">
                {point.value}
                {point.unit ? (
                  <span className="text-bone/50 text-sm md:text-base ml-1">
                    {point.unit}
                  </span>
                ) : null}
              </span>
            </motion.button>
          );
        })}

        {/* Bottom-left identifier card — the car name */}
        <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 z-10 flex flex-col gap-1.5 max-w-[60%]">
          <span className="inline-flex items-center gap-2 text-2xs uppercase tracking-[0.18em] text-bone/80">
            <span className="block w-1.5 h-1.5 rounded-full bg-success" aria-hidden="true" />
            <span>On the floor today</span>
          </span>
          <h3 className="display text-bone text-2xl md:text-3xl lg:text-4xl tracking-tight text-balance leading-[1.05]">
            {carTitle}
          </h3>
          <p className="text-bone/60 text-xs md:text-sm">{carSubtitle}</p>
        </div>

        {/* Top-right identifier — "specimen 01 / 40" */}
        <div className="absolute top-4 md:top-6 right-4 md:right-6 z-10 flex items-baseline gap-2 text-bone/80">
          <span className="text-2xs uppercase tracking-[0.22em]">Specimen</span>
          <span className="display-italic text-base tabular-nums">N° 01</span>
        </div>
      </div>
    </div>
  );
}