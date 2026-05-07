'use client';

import { Fragment } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TestimonialItem {
  name: string;
  location: string;
  car: string;
  purchasedAt: string;
  quote: string;
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function Card({ item }: { item: TestimonialItem }) {
  return (
    <article
      className="p-6 md:p-7 bg-cream border border-rule-light"
      style={{ boxShadow: '0 2px 20px -8px rgba(14,17,22,0.07)' }}
    >
      {/* Opening quote mark — brass serif, matches accent system */}
      <span
        aria-hidden="true"
        className="display-italic block leading-none mb-3"
        style={{ color: 'var(--color-accent)', fontSize: '2.25rem' }}
      >
        &ldquo;
      </span>

      <blockquote className="m-0 p-0">
        <p
          className="text-sm leading-[1.75] text-pretty"
          style={{ color: 'var(--color-ink-soft)' }}
        >
          {item.quote}
        </p>

        <footer className="mt-5 pt-4 border-t border-rule-light">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <cite
                className="display-italic not-italic block leading-none truncate"
                style={{
                  fontSize: '1.1rem',
                  color: 'var(--color-ink)',
                  letterSpacing: '-0.01em',
                }}
              >
                {item.name}
              </cite>
              <span
                className="eyebrow block mt-1.5 truncate"
                style={{ color: 'var(--color-graphite)' }}
              >
                {item.location} · {item.car}
              </span>
            </div>
            <span
              className="eyebrow tabular-nums flex-shrink-0"
              style={{ color: 'var(--color-mist)' }}
            >
              {item.purchasedAt}
            </span>
          </div>
        </footer>
      </blockquote>
    </article>
  );
}

// ─── Scrolling column ─────────────────────────────────────────────────────────

interface ScrollColumnProps {
  items: TestimonialItem[];
  duration?: number;
  className?: string;
}

function ScrollColumn({ items, duration = 20, className }: ScrollColumnProps) {
  const reduced = useReducedMotion();

  if (reduced || items.length === 0) {
    return (
      <div className={`space-y-4 flex-1 min-w-0 ${className ?? ''}`}>
        {items.map((item, i) => (
          <Card key={i} item={item} />
        ))}
      </div>
    );
  }

  return (
    <div className={`relative flex-1 min-w-0 ${className ?? ''}`}>
      <motion.ul
        animate={{ y: '-50%' }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'linear',
          repeatType: 'loop',
        }}
        className="flex flex-col gap-4 pb-4 list-none m-0 p-0"
        style={{ willChange: 'transform' }}
      >
        {[0, 1].map((copy) => (
          <Fragment key={copy}>
            {items.map((item, i) => (
              <li
                key={`${copy}-${i}`}
                aria-hidden={copy === 1 ? true : undefined}
              >
                <Card item={item} />
              </li>
            ))}
          </Fragment>
        ))}
      </motion.ul>
    </div>
  );
}

// ─── Public component ─────────────────────────────────────────────────────────

interface TestimonialScrollProps {
  items: TestimonialItem[];
}

export function TestimonialScroll({ items }: TestimonialScrollProps) {
  const col1 = items.slice(0, 3);
  const col2 = items.slice(3, 6);
  const col3 = items.slice(6, 9);

  return (
    <div
      className="flex gap-4 lg:gap-5 overflow-hidden"
      role="region"
      aria-label="Customer testimonials"
      style={{
        maxHeight: '640px',
        maskImage:
          'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
      }}
    >
      <ScrollColumn items={col1} duration={22} />
      <ScrollColumn items={col2} duration={28} className="hidden md:block" />
      <ScrollColumn items={col3} duration={25} className="hidden lg:block" />
    </div>
  );
}
