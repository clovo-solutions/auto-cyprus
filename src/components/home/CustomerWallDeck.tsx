'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion, useMotionValue, useTransform, type PanInfo } from 'framer-motion';
import { cn } from '@/lib/cn';

export interface DeckCustomer {
  name: string;
  location: string;
  car: string;
  purchasedAt: string;
  quote: string;
}

interface CustomerWallDeckProps {
  customers: DeckCustomer[];
  labels: {
    cardLabel: string;
    of: string;
    next: string;
    previous: string;
    purchased: string;
    verified: string;
    instructions: string;
  };
}

const CARDS_VISIBLE_BEHIND = 3;
const CARDS_VISIBLE_AHEAD = 3;

export function CustomerWallDeck({ customers, labels }: CustomerWallDeckProps) {
  const reduced = useReducedMotion();
  const [activeIdx, setActiveIdx] = useState(0);
  /** Direction of the most recent advance: 1 = forward, -1 = backward.
   *  Used to direct the exit animation correctly. */
  const [direction, setDirection] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const goNext = useCallback(() => {
    setDirection(1);
    setActiveIdx((i) => (i + 1) % customers.length);
  }, [customers.length]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setActiveIdx((i) => (i - 1 + customers.length) % customers.length);
  }, [customers.length]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!containerRef.current?.contains(document.activeElement)) {
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        goNext();
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev]);

  if (customers.length === 0) {
    return null;
  }

  // Reduced motion: render as a clean stack of static cards
  if (reduced) {
    return (
      <ul className="flex flex-col gap-6">
        {customers.map((customer, i) => (
          <li key={i}>
            <StaticCard customer={customer} index={i} total={customers.length} labels={labels} />
          </li>
        ))}
      </ul>
    );
  }

  // Build the visible stack — cards on either side of active, with their offsets pre-computed.
  const visibleCards: Array<{
    customer: DeckCustomer;
    index: number;
    /** Position relative to active: 0 = active, +1 = next behind, -1 = previous read-pile, etc. */
    offset: number;
  }> = [];

  for (let offset = -CARDS_VISIBLE_AHEAD; offset <= CARDS_VISIBLE_BEHIND; offset++) {
    const realIdx = (activeIdx + offset + customers.length) % customers.length;
    if (
      offset === 0 ||
      (offset > 0 && offset <= CARDS_VISIBLE_BEHIND) ||
      (offset < 0 && Math.abs(offset) <= CARDS_VISIBLE_AHEAD)
    ) {
      visibleCards.push({
        customer: customers[realIdx]!,
        index: realIdx,
        offset,
      });
    }
  }

return (
  <div
    ref={containerRef}
    className="relative flex flex-col gap-8 md:gap-10 select-none overflow-hidden"
  >
      {/* The deck stage */}
<div
  className="relative w-full mx-auto"
  style={{
    aspectRatio: '5 / 3',
    maxWidth: '720px',
    minHeight: '380px',
    perspective: '1400px',
    paddingTop: '20px',
    paddingBottom: '20px',
  }}
>
        {/* Render cards back-to-front so the active card sits on top */}
        {visibleCards
          .slice()
          .sort((a, b) => Math.abs(b.offset) - Math.abs(a.offset))
          .map(({ customer, index, offset }) => (
            <DeckCard
              key={`${index}-${offset}`}
              customer={customer}
              cardNumber={index + 1}
              total={customers.length}
              offset={offset}
              direction={direction}
              isActive={offset === 0}
              labels={labels}
              onSwipe={(swipeDir) => {
                if (swipeDir > 0) {
                  goNext();
                } else {
                  goPrev();
                }
              }}
            />
          ))}
      </div>

      {/* Controls + counter */}
      <div className="flex items-center justify-between gap-4 max-w-[720px] mx-auto w-full px-1">
        {/* Counter — large editorial numerals */}
        <div className="flex items-baseline gap-3">
          <span
            className="text-2xs uppercase tracking-[0.22em]"
            style={{ color: 'var(--color-graphite)' }}
          >
            {labels.cardLabel}
          </span>
          <span
            className="display-italic tabular-nums leading-none"
            style={{
              color: 'var(--color-ink)',
              fontSize: '1.5rem',
            }}
          >
            {String(activeIdx + 1).padStart(2, '0')}
          </span>
          <span
            className="text-xs"
            style={{ color: 'var(--color-mist)' }}
          >
            {labels.of}
          </span>
          <span
            className="display-italic tabular-nums leading-none"
            style={{
              color: 'var(--color-graphite)',
              fontSize: '1.5rem',
            }}
          >
            {String(customers.length).padStart(2, '0')}
          </span>
        </div>

        {/* Prev / next buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goPrev}
            aria-label={labels.previous}
            className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] border transition-colors duration-200"
            style={{
              borderColor: 'var(--color-rule-light)',
              color: 'var(--color-ink)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-ink)';
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-bone)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-ink)';
            }}
          >
            <ArrowIcon size={14} direction="left" />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label={labels.next}
            className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] border transition-colors duration-200"
            style={{
              borderColor: 'var(--color-ink)',
              backgroundColor: 'var(--color-ink)',
              color: 'var(--color-bone)',
            }}
          >
            <ArrowIcon size={14} direction="right" />
          </button>
        </div>
      </div>

      {/* Hint text — only visible until first interaction */}
      <p
        className="text-2xs uppercase tracking-[0.22em] text-center mt-2"
        style={{ color: 'var(--color-graphite)' }}
      >
        {labels.instructions}
      </p>
    </div>
  );
}

// ============================================================
// DeckCard — a single positioned card in the stack
// ============================================================

interface DeckCardProps {
  customer: DeckCustomer;
  cardNumber: number;
  total: number;
  offset: number;
  direction: number;
  isActive: boolean;
  labels: CustomerWallDeckProps['labels'];
  onSwipe: (direction: number) => void;
}

function DeckCard({
  customer,
  cardNumber,
  total,
  offset,
  direction,
  isActive,
  labels,
  onSwipe,
}: DeckCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-15, 0, 15]);
  const opacity = useTransform(x, [-300, -100, 0, 100, 300], [0.3, 1, 1, 1, 0.3]);

// Cards behind the active one fan out behind it, tilted but tucked in.
// Cards in the read-pile (already viewed) tilt the OTHER way, also tucked in.
// All translations stay small enough that the cards never overflow the stage,
// so no horizontal scroll on mobile. The tilt is what carries the "deck" feel.
const baseTransform = isActive
  ? { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }
  : offset > 0
    ? {
        // Behind-the-active stack: tilts to the right, slight forward translate
        x: offset * 4,
        y: offset * 4,
        rotate: offset * 4,
        scale: 1 - offset * 0.04,
        opacity: 1 - offset * 0.22,
      }
    : {
        // Read pile: tilts to the left, mirror of the behind-stack
        x: offset * 4,
        y: Math.abs(offset) * 4,
        rotate: offset * 4,
        scale: 1 - Math.abs(offset) * 0.05,
        opacity: 0.45 + offset * 0.15,
      };

  const handleDragEnd = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const SWIPE_THRESHOLD = 100;
    if (Math.abs(info.offset.x) > SWIPE_THRESHOLD || Math.abs(info.velocity.x) > 500) {
      onSwipe(info.offset.x < 0 ? 1 : -1);
    } else {
      // Snap back
      x.set(0);
    }
  };

  return (
    <motion.article
      className="absolute inset-0"
      drag={isActive ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      style={isActive ? { x, rotate, opacity } : undefined}
      animate={!isActive ? baseTransform : undefined}
      initial={
        offset === 0
          ? {
              x: direction * 80,
              y: 0,
              rotate: direction * 5,
              opacity: 0,
              scale: 0.96,
            }
          : false
      }
      transition={{
        type: 'spring',
        stiffness: 140,
        damping: 22,
        mass: 0.9,
      }}
      tabIndex={isActive ? 0 : -1}
      aria-hidden={!isActive}
    >
      <div
        className={cn(
          'relative w-full h-full overflow-hidden',
          isActive ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none',
        )}
        style={{
          backgroundColor: 'var(--color-cream)',
          // Index-card paper feel: warm off-white, very subtle texture, hairline border
          border: '1px solid var(--color-rule-light)',
          boxShadow: isActive
            ? '0 24px 60px -20px rgba(14, 17, 22, 0.25), 0 8px 24px -8px rgba(14, 17, 22, 0.12)'
            : '0 8px 20px -8px rgba(14, 17, 22, 0.18)',
        }}
      >
        {/* Faint horizontal rule lines, like an index card */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 bottom-0 pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(to bottom, transparent 0px, transparent 31px, rgba(176, 138, 74, 0.07) 31px, rgba(176, 138, 74, 0.07) 32px)',
            backgroundPosition: '0 6.5rem',
          }}
        />

        {/* Top-left red margin line, like a real index card */}
        <span
          aria-hidden="true"
          className="absolute top-0 bottom-0 pointer-events-none"
          style={{
            left: '3.5rem',
            width: '1px',
            backgroundColor: 'var(--color-oxblood-soft)',
            opacity: 0.45,
          }}
        />

        {/* Top-right "stamp" — date stamped on the card */}
        <div
          aria-hidden="true"
          className="absolute top-5 right-5 md:top-6 md:right-6 inline-flex flex-col items-center justify-center text-center"
          style={{
            transform: 'rotate(-6deg)',
            border: '1.5px solid var(--color-oxblood)',
            color: 'var(--color-oxblood)',
            padding: '6px 10px',
            minWidth: '70px',
          }}
        >
          <span
            className="text-[8px] uppercase font-medium leading-none mb-0.5"
            style={{ letterSpacing: '0.2em' }}
          >
            {labels.verified}
          </span>
          <span
            className="text-[10px] uppercase leading-none tabular-nums"
            style={{ letterSpacing: '0.18em' }}
          >
            {customer.purchasedAt}
          </span>
        </div>

        {/* Top-left card number — typewritten feel */}
        <div className="absolute top-5 left-5 md:top-6 md:left-7 flex flex-col">
          <span
            className="text-[9px] uppercase mb-1"
            style={{
              color: 'var(--color-graphite)',
              letterSpacing: '0.24em',
            }}
          >
            {labels.cardLabel}
          </span>
          <span
            className="display-italic tabular-nums leading-none"
            style={{
              color: 'var(--color-ink)',
              fontSize: '1.75rem',
            }}
          >
            № {String(cardNumber).padStart(2, '0')}
          </span>
        </div>

        {/* Quote body */}
        <div
          className="relative h-full flex flex-col justify-between"
          style={{
            paddingTop: 'clamp(5rem, 14%, 6.5rem)',
            paddingBottom: 'clamp(2rem, 8%, 3rem)',
            paddingLeft: 'clamp(4.5rem, 12%, 5.5rem)',
            paddingRight: 'clamp(1.5rem, 6%, 3rem)',
          }}
        >
          <blockquote
            className="display text-balance leading-[1.22] tracking-tight"
            style={{
              color: 'var(--color-ink)',
              fontSize: 'clamp(1.05rem, 2.4vw, 1.65rem)',
            }}
          >
            <span
              aria-hidden="true"
              className="inline-block leading-none mr-1"
              style={{
                color: 'var(--color-accent)',
                fontSize: '1.4em',
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                verticalAlign: '-0.2em',
              }}
            >
              &ldquo;
            </span>
            {customer.quote}
          </blockquote>

          {/* Signature row */}
          <footer className="flex items-end justify-between gap-4 pt-6">
            <div className="flex flex-col gap-1">
              <span
                className="display-italic leading-none"
                style={{
                  color: 'var(--color-ink)',
                  fontSize: '1.5rem',
                  letterSpacing: '-0.01em',
                }}
              >
                {customer.name}
              </span>
              <span
                className="text-[10px] uppercase"
                style={{
                  color: 'var(--color-graphite)',
                  letterSpacing: '0.22em',
                }}
              >
                {customer.location} · {customer.car}
              </span>
            </div>

            {/* Signature flourish — drawn line */}
            <svg
              width="60"
              height="20"
              viewBox="0 0 60 20"
              aria-hidden="true"
              style={{ flexShrink: 0, opacity: 0.7 }}
            >
              <path
                d="M2 14 Q 8 4, 16 12 T 32 10 Q 38 6, 46 12 L 56 8"
                stroke="var(--color-ink)"
                strokeWidth="1"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </footer>
        </div>
      </div>
    </motion.article>
  );
}

// ============================================================
// Static fallback for reduced-motion
// ============================================================

function StaticCard({
  customer,
  index,
  total,
  labels,
}: {
  customer: DeckCustomer;
  index: number;
  total: number;
  labels: CustomerWallDeckProps['labels'];
}) {
  return (
    <article
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: 'var(--color-cream)',
        border: '1px solid var(--color-rule-light)',
        padding: '2rem 1.5rem 1.5rem 4rem',
      }}
    >
      <span
        aria-hidden="true"
        className="absolute top-0 bottom-0 pointer-events-none"
        style={{
          left: '3rem',
          width: '1px',
          backgroundColor: 'var(--color-oxblood-soft)',
          opacity: 0.45,
        }}
      />
      <div className="flex items-baseline justify-between mb-3">
        <span
          className="display-italic tabular-nums leading-none"
          style={{ color: 'var(--color-ink)', fontSize: '1.4rem' }}
        >
          № {String(index + 1).padStart(2, '0')}
        </span>
        <span
          className="text-2xs uppercase tracking-[0.18em]"
          style={{ color: 'var(--color-oxblood)' }}
        >
          {labels.verified} · {customer.purchasedAt}
        </span>
      </div>
      <blockquote
        className="display leading-[1.25] mb-4"
        style={{ color: 'var(--color-ink)', fontSize: '1.15rem' }}
      >
        &ldquo;{customer.quote}
      </blockquote>
      <footer className="flex items-baseline gap-2 text-2xs uppercase tracking-[0.22em]">
        <span
          className="display-italic normal-case tracking-tight"
          style={{
            color: 'var(--color-ink)',
            fontSize: '1.1rem',
            fontStyle: 'italic',
            letterSpacing: '-0.01em',
          }}
        >
          {customer.name}
        </span>
        <span style={{ color: 'var(--color-mist)' }}>·</span>
        <span style={{ color: 'var(--color-graphite)' }}>{customer.location}</span>
        <span style={{ color: 'var(--color-mist)' }}>·</span>
        <span style={{ color: 'var(--color-graphite)' }}>{customer.car}</span>
      </footer>
    </article>
  );
}

// ============================================================
// Inline arrow icon
// ============================================================

function ArrowIcon({ size = 14, direction }: { size?: number; direction: 'left' | 'right' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{
        transform: direction === 'left' ? 'rotate(180deg)' : undefined,
      }}
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}