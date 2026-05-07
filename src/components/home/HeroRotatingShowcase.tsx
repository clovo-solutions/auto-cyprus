'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/cn';

export interface ShowcaseEntry {
  id: string;
  imageUrl: string;
  title: string;
  /** e.g. "2021 · 42,000 km · Automatic" */
  meta: string;
  /** e.g. "€38,500" or "On request" */
  price: string;
}

interface Props {
  entries: ShowcaseEntry[];
  intervalMs?: number;
  className?: string;
}

export function HeroRotatingShowcase({
  entries,
  intervalMs = 3800,
  className,
}: Props) {
  const reduced = useReducedMotion();
  const [activeIdx, setActiveIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (reduced || entries.length <= 1) {
      return;
    }
    if (isHovered) {
      return;
    }
    timerRef.current = setInterval(() => {
      setActiveIdx((i) => (i + 1) % entries.length);
    }, intervalMs);
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [reduced, entries.length, intervalMs, isHovered]);

  if (entries.length === 0) {
    return null;
  }

  const active = entries[activeIdx]!;

  return (
    <div
      className={cn('relative h-full', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Stacked images, only the active one visible */}
      <div className="absolute inset-0">
        {entries.map((entry, i) => (
          <div
            key={entry.id}
            aria-hidden={i !== activeIdx}
            className={cn(
              'absolute inset-0 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
              i === activeIdx ? 'opacity-100 z-10' : 'opacity-0 z-0',
            )}
          >
            <div
              className={cn(
                'relative w-full h-full transition-transform duration-[7000ms] ease-linear',
                i === activeIdx && !reduced ? 'scale-[1.04]' : 'scale-100',
              )}
            >
              <Image
                src={entry.imageUrl}
                alt={entry.title}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority={i === 0}
                className="object-cover"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Top gradient — keeps the corner badge readable */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-ink/40 via-ink/10 to-transparent z-20"
      />

      {/* Bottom gradient — keeps the meta strip readable */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent z-20"
      />

      {/* Top-left "Now showing" badge */}
      <div className="absolute top-4 left-4 md:top-5 md:left-5 z-30 inline-flex items-center gap-2 bg-bone/95 backdrop-blur-sm px-3 py-1.5 text-2xs uppercase tracking-[0.18em] text-ink">
        <span className="relative flex w-1.5 h-1.5">
          <span className="absolute inset-0 rounded-full bg-success animate-ping-slow" />
          <span className="relative rounded-full bg-success w-1.5 h-1.5" />
        </span>
        <span>Now in stock</span>
      </div>

      {/* Top-right counter — "01 / 06" */}
      <div className="absolute top-4 right-4 md:top-5 md:right-5 z-30 text-bone text-2xs uppercase tracking-[0.18em] tabular-nums">
        <span>{String(activeIdx + 1).padStart(2, '0')}</span>
        <span className="text-mist mx-1">/</span>
        <span>{String(entries.length).padStart(2, '0')}</span>
      </div>

      {/* Bottom meta block — title, spec line, price */}
      <div className="absolute inset-x-0 bottom-0 z-30 p-5 md:p-7 lg:p-8">
        <div key={active.id} className="flex flex-col gap-2 anim-fade-up">
          <span className="text-2xs uppercase tracking-[0.22em] text-bone/70">
            {active.meta}
          </span>
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="display text-bone text-2xl md:text-3xl tracking-tight text-balance leading-tight">
              {active.title}
            </h3>
            <p className="display-italic text-bone text-xl md:text-2xl whitespace-nowrap tabular-nums">
              {active.price}
            </p>
          </div>
        </div>

        {/* Progress bar — fills over interval, resets per slide */}
        <div className="mt-5 flex gap-2">
          {entries.map((entry, i) => (
            <span
              key={entry.id}
              aria-hidden="true"
              className="flex-1 h-px bg-bone/25 overflow-hidden"
            >
              <span
                className={cn(
                  'block h-full bg-bone origin-left',
                  i < activeIdx && 'scale-x-100',
                  i > activeIdx && 'scale-x-0',
                )}
                style={
                  i === activeIdx
                    ? {
                        animation: reduced
                          ? undefined
                          : `progress-fill ${intervalMs}ms linear forwards`,
                      }
                    : undefined
                }
              />
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes progress-fill {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
}