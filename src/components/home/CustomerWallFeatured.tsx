'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export interface Customer {
  name: string;
  location: string;
  car: string;
  purchasedAt: string;
  quote: string;
}

interface CustomerWallFeaturedProps {
  customers: Customer[];
  intervalMs?: number;
  labels: {
    verified: string;
    purchased: string;
    pause: string;
    play: string;
  };
}

const SWAP_DURATION = 0.5;

export function CustomerWallFeatured({
  customers,
  intervalMs = 7000,
  labels,
}: CustomerWallFeaturedProps) {
  const reduced = useReducedMotion();
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const advance = useCallback(() => {
    setActiveIdx((prev) => (prev + 1) % customers.length);
  }, [customers.length]);

  const goTo = useCallback((idx: number) => {
    setActiveIdx(idx);
  }, []);

  // Auto-advance loop
  useEffect(() => {
    if (reduced || isPaused || isHovered || intervalMs === 0) {
      return;
    }
    const id = setInterval(advance, intervalMs);
    return () => clearInterval(id);
  }, [reduced, isPaused, isHovered, advance, intervalMs]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!containerRef.current?.contains(document.activeElement)) {
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setActiveIdx((prev) => (prev + 1) % customers.length);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setActiveIdx((prev) => (prev - 1 + customers.length) % customers.length);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [customers.length]);

  if (customers.length === 0) {
    return null;
  }

  const active = customers[activeIdx]!;

  // Reduced motion: clean static stack, no rotation
  if (reduced) {
    return (
      <ul className="flex flex-col">
        {customers.map((customer, i) => (
          <li
            key={i}
            className="py-7 md:py-8 border-t last:border-b"
            style={{ borderColor: 'var(--color-rule-light)' }}
          >
            <StaticEntry customer={customer} index={i} labels={labels} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top progress bar */}
      <div
        className="relative h-px overflow-hidden mb-7 md:mb-9"
        style={{ backgroundColor: 'var(--color-rule-light)' }}
        aria-hidden="true"
      >
        <span
          key={`bar-${activeIdx}`}
          className="absolute inset-y-0 left-0 origin-left"
          style={{
            backgroundColor: 'var(--color-accent)',
            width: '100%',
            transformOrigin: 'left',
            animation:
              isHovered || isPaused
                ? 'none'
                : `progress-bar ${intervalMs}ms linear forwards`,
            transform: isHovered || isPaused ? 'scaleX(0)' : undefined,
          }}
        />
      </div>

      {/* Featured testimonial — typography only, no portrait */}
      <div className="relative min-h-[280px] md:min-h-[260px]">
        <AnimatePresence mode="wait">
          <motion.figure
            key={`q-${activeIdx}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{
              duration: SWAP_DURATION,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex flex-col gap-5 md:gap-6 max-w-[68ch]"
          >
            {/* Counter row */}
            <div
              className="flex items-baseline gap-3 text-2xs uppercase"
              style={{
                letterSpacing: '0.22em',
                color: 'var(--color-graphite)',
              }}
            >
              <span className="tabular-nums" style={{ color: 'var(--color-ink)' }}>
                {String(activeIdx + 1).padStart(2, '0')}
              </span>
              <span style={{ color: 'var(--color-mist)' }}>/</span>
              <span className="tabular-nums">
                {String(customers.length).padStart(2, '0')}
              </span>
              <span style={{ color: 'var(--color-mist)' }} aria-hidden="true">
                ·
              </span>
              <span>{active.location}</span>
              <span style={{ color: 'var(--color-mist)' }} aria-hidden="true">
                ·
              </span>
              <span>{active.car}</span>
            </div>

            {/* The quote */}
            <blockquote
              className="display text-balance leading-[1.18] tracking-tight"
              style={{
                color: 'var(--color-ink)',
                fontSize: 'clamp(1.5rem, 2.6vw, 2.25rem)',
              }}
            >
              <span
                aria-hidden="true"
                className="inline-block leading-none mr-2"
                style={{
                  color: 'var(--color-accent)',
                  fontSize: '1.4em',
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  verticalAlign: '-0.15em',
                }}
              >
                &ldquo;
              </span>
              {active.quote}
            </blockquote>

            {/* Caption row — name + verified + purchased date */}
            <figcaption className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-1">
              <span
                className="text-base font-medium"
                style={{ color: 'var(--color-ink)' }}
              >
                {active.name}
              </span>
              <span style={{ color: 'var(--color-mist)' }} aria-hidden="true">
                ·
              </span>
              <span
                className="inline-flex items-center gap-1.5 text-2xs uppercase tracking-[0.18em]"
                style={{ color: 'var(--color-success)' }}
              >
                <CheckCircleIcon size={12} />
                <span>{labels.verified}</span>
              </span>
              <span style={{ color: 'var(--color-mist)' }} aria-hidden="true">
                ·
              </span>
              <span
                className="text-2xs uppercase tracking-[0.18em]"
                style={{ color: 'var(--color-graphite)' }}
              >
                {labels.purchased} {active.purchasedAt}
              </span>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>

      {/* Pager + pause control */}
      <div
        className="mt-8 md:mt-10 pt-5 border-t flex flex-wrap items-center justify-between gap-3"
        style={{ borderColor: 'var(--color-rule-light)' }}
      >
        <div
          className="flex items-center gap-1"
          role="tablist"
          aria-label="Customer testimonials"
        >
          {customers.map((customer, i) => (
            <button
              key={`tab-${i}`}
              type="button"
              role="tab"
              aria-selected={i === activeIdx}
              aria-label={`Read ${customer.name}'s testimonial`}
              onClick={() => goTo(i)}
              className="group relative inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-3 py-2 transition-colors duration-200"
              style={{
                color:
                  i === activeIdx
                    ? 'var(--color-ink)'
                    : 'var(--color-graphite)',
              }}
            >
              <span
                className="text-sm tabular-nums"
                style={{ fontWeight: i === activeIdx ? 500 : 400 }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-3 right-3 h-px origin-left transition-transform duration-300"
                style={{
                  backgroundColor:
                    i === activeIdx
                      ? 'var(--color-ink)'
                      : 'var(--color-rule-light)',
                  transform: i === activeIdx ? 'scaleX(1)' : 'scaleX(0)',
                }}
              />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setIsPaused((p) => !p)}
          aria-label={isPaused ? labels.play : labels.pause}
          aria-pressed={isPaused}
          className="inline-flex items-center justify-center min-h-[44px] gap-2 px-2 text-2xs uppercase tracking-[0.22em]"
          style={{ color: 'var(--color-graphite)' }}
        >
          {isPaused ? <PlayIcon size={11} /> : <PauseIcon size={11} />}
          <span>{isPaused ? labels.play : labels.pause}</span>
        </button>
      </div>

      <style>{`
        @keyframes progress-bar {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
}

// ============================================================
// Reduced-motion static entry — no portrait, just typography
// ============================================================

function StaticEntry({
  customer,
  index,
  labels,
}: {
  customer: Customer;
  index: number;
  labels: { verified: string; purchased: string };
}) {
  return (
    <figure className="flex flex-col gap-3">
      <div
        className="flex items-baseline gap-3 text-2xs uppercase tracking-[0.22em]"
        style={{ color: 'var(--color-graphite)' }}
      >
        <span className="tabular-nums" style={{ color: 'var(--color-ink)' }}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <span style={{ color: 'var(--color-mist)' }}>·</span>
        <span>{customer.location}</span>
        <span style={{ color: 'var(--color-mist)' }}>·</span>
        <span>{customer.car}</span>
      </div>
      <blockquote
        className="display text-balance leading-[1.2] tracking-tight"
        style={{
          color: 'var(--color-ink)',
          fontSize: 'clamp(1.25rem, 2vw, 1.65rem)',
        }}
      >
        <span
          className="display-italic mr-1 leading-none inline-block"
          aria-hidden="true"
          style={{
            color: 'var(--color-accent)',
            fontSize: '1.4em',
            verticalAlign: '-0.15em',
          }}
        >
          &ldquo;
        </span>
        {customer.quote}
      </blockquote>
      <figcaption className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1">
        <span
          className="text-sm font-medium"
          style={{ color: 'var(--color-ink)' }}
        >
          {customer.name}
        </span>
        <span style={{ color: 'var(--color-mist)' }} aria-hidden="true">
          ·
        </span>
        <span
          className="inline-flex items-center gap-1 text-2xs uppercase tracking-[0.18em]"
          style={{ color: 'var(--color-success)' }}
        >
          <CheckCircleIcon size={10} />
          {labels.verified}
        </span>
        <span style={{ color: 'var(--color-mist)' }} aria-hidden="true">
          ·
        </span>
        <span
          className="text-2xs uppercase tracking-[0.18em]"
          style={{ color: 'var(--color-graphite)' }}
        >
          {labels.purchased} {customer.purchasedAt}
        </span>
      </figcaption>
    </figure>
  );
}

// ============================================================
// Inline icons
// ============================================================

function CheckCircleIcon({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="9 12 12 15 16 10" />
    </svg>
  );
}

function PauseIcon({ size = 11 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <rect x="6" y="5" width="4" height="14" />
      <rect x="14" y="5" width="4" height="14" />
    </svg>
  );
}

function PlayIcon({ size = 11 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <polygon points="6 4 20 12 6 20 6 4" />
    </svg>
  );
}