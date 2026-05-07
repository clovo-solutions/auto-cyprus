'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useReducedMotion, AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/cn';

export interface FolioEntry {
  id: string;
  imageUrl: string;
  /** "BMW M340i xDrive" */
  title: string;
  /** "M Sport · Mineral Grey · 2021" */
  subtitle: string;
  /** Photographed at... */
  location: string;
  /** Photo credit string */
  photographer: string;
  /** Spec rows for the data table */
  specs: Array<{ label: string; value: string }>;
  /** Salesperson name + phone */
  contact: { name: string; role: string; phone: string };
  /** "€48,900" or "On request" */
  price: string;
  /** ISO date for the "filed on" footnote */
  filedAt: string;
  /** Car listing URL slug */
  slug: string;
}

interface HeroFolioProps {
  entries: FolioEntry[];
  className?: string;
}

export function HeroFolio({ entries, className }: HeroFolioProps) {
  const reduced = useReducedMotion();
  const [activeIdx, setActiveIdx] = useState(0);
  const startedRef = useRef(false);

  // First-load animation marker (so we know whether to animate the first paint)
  useEffect(() => {
    startedRef.current = true;
  }, []);

  if (entries.length === 0) {
    return null;
  }

  const active = entries[activeIdx]!;
  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(active.filedAt));

  return (
    <article className={cn('w-full', className)} aria-labelledby="folio-title">
      {/* The folio header — a slim row that frames the whole thing as
          an editorial entry. Issue number, dateline, page number. */}
      <div className="flex items-center justify-between text-2xs uppercase tracking-[0.22em] text-graphite border-b border-rule-light pb-3 mb-7 md:mb-9">
        <div className="flex items-center gap-3">
          <span className="display-italic text-ink text-base normal-case tracking-tight not-italic font-medium">
            №
          </span>
          <span className="tabular-nums">{String(activeIdx + 1).padStart(3, '0')}</span>
          <span className="text-mist" aria-hidden="true">·</span>
          <span>From the lot</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline tabular-nums">{formattedDate}</span>
          <span className="hidden sm:inline text-mist" aria-hidden="true">·</span>
          <span className="tabular-nums">
            <span className="text-ink font-medium">{String(activeIdx + 1).padStart(2, '0')}</span>
            <span className="text-mist mx-1">/</span>
            <span>{String(entries.length).padStart(2, '0')}</span>
          </span>
        </div>
      </div>

      {/* Body: photograph + spec column */}
      <div className="grid lg:grid-cols-12 gap-7 md:gap-10 lg:gap-12">
        {/* Photograph block — 7 cols */}
        <figure className="lg:col-span-7 flex flex-col gap-3 relative">
          <div className="relative image-frame film-grain aspect-[4/3] md:aspect-[16/10] bg-ink/5 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={reduced ? {} : { opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduced ? {} : { opacity: 0, scale: 1 }}
                transition={{ duration: reduced ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={active.imageUrl}
                  alt={active.title}
                  fill
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  priority={activeIdx === 0}
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>

            {/* Verified stamp — top-right, looks like a passport stamp */}
            <span
              aria-hidden="true"
              className={cn(
                'absolute top-4 right-4 z-10 inline-flex items-center gap-2 border-2 border-bone px-3 py-1.5',
                'text-bone text-2xs uppercase tracking-[0.22em] font-medium',
                'bg-ink/30 backdrop-blur-sm',
                'anim-stamp',
              )}
              style={{ transform: 'rotate(-8deg)' }}
            >
              <span>Verified</span>
              <span className="text-bone/60" aria-hidden="true">·</span>
              <span className="tabular-nums">100-pt</span>
            </span>
          </div>

          {/* Photo caption — italic serif, like a magazine */}
          <figcaption className="flex items-baseline justify-between gap-4 mt-1">
            <p className="display-italic text-graphite text-sm leading-snug max-w-[40ch]">
              {active.subtitle}, photographed at {active.location}.
            </p>
            <span className="text-2xs tracking-[0.18em] uppercase text-mist whitespace-nowrap shrink-0">
              {active.photographer}
            </span>
          </figcaption>
        </figure>

        {/* Spec column — 5 cols */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={`info-${active.id}`}
              initial={reduced ? {} : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? {} : { opacity: 0, y: -4 }}
              transition={{ duration: reduced ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-6"
            >
              {/* Title and price */}
              <header className="flex flex-col gap-3">
                <h3
                  id="folio-title"
                  className="display text-ink text-3xl md:text-4xl tracking-tight text-balance leading-[1.05]"
                >
                  {active.title}
                </h3>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="display-italic text-ink text-3xl md:text-4xl tabular-nums">
                    {active.price}
                  </span>
                  <a
                    href={`/cars/${active.slug}`}
                    className="link-rule text-sm tracking-wide whitespace-nowrap"
                  >
                    Full listing →
                  </a>
                </div>
              </header>

              {/* Spec table — minimal hairlines, tabular-num values */}
              <dl className="flex flex-col">
                {active.specs.map((row, i) => (
                  <div
                    key={`${row.label}-${i}`}
                    className="flex items-baseline justify-between gap-4 py-2.5 border-b border-rule-light first:border-t"
                  >
                    <dt className="text-2xs uppercase tracking-[0.22em] text-graphite">
                      {row.label}
                    </dt>
                    <dd className="text-sm text-ink text-right tabular-nums">{row.value}</dd>
                  </div>
                ))}
              </dl>

              {/* Salesperson card — small, photographic, signature-feel */}
              <div className="flex items-center gap-4 pt-2">
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-2xs uppercase tracking-[0.22em] text-graphite mb-1">
                    Speak to
                  </span>
                  <span className="text-base text-ink">
                    <span className="font-medium">{active.contact.name}</span>
                    <span className="text-mist mx-1.5">·</span>
                    <span className="text-graphite text-sm">{active.contact.role}</span>
                  </span>
                  <a
                    href={`tel:${active.contact.phone.replace(/[^+\d]/g, '')}`}
                    className="text-sm text-ink link-rule tabular-nums mt-1 self-start"
                  >
                    {active.contact.phone}
                  </a>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer / folio control row — manual page-flipping like a magazine.
          Numbered controls, never auto-rotating, so the user feels in charge. */}
      <div className="mt-10 md:mt-14 pt-6 border-t border-rule-light flex flex-wrap items-center justify-between gap-5">
        <div className="flex items-center gap-2 text-2xs uppercase tracking-[0.22em] text-graphite">
          <span>Pages</span>
          <span className="text-mist" aria-hidden="true">·</span>
          <span className="tabular-nums">
            {String(activeIdx + 1).padStart(2, '0')} / {String(entries.length).padStart(2, '0')}
          </span>
        </div>

        <div className="flex items-center gap-1.5" role="tablist" aria-label="Featured cars">
          {entries.map((entry, i) => (
            <button
              key={entry.id}
              type="button"
              role="tab"
              aria-selected={i === activeIdx}
              aria-label={`View ${entry.title}, page ${i + 1} of ${entries.length}`}
              onClick={() => setActiveIdx(i)}
              className={cn(
                'group relative inline-flex items-center justify-center',
                'min-h-[44px] min-w-[44px] px-3 py-2',
                'text-sm tabular-nums transition-colors duration-200',
                i === activeIdx ? 'text-ink' : 'text-graphite hover:text-ink',
              )}
            >
              <span>{String(i + 1).padStart(2, '0')}</span>
              <span
                aria-hidden="true"
                className={cn(
                  'absolute bottom-0 left-3 right-3 h-px transition-transform duration-300 origin-left',
                  i === activeIdx ? 'bg-ink scale-x-100' : 'bg-graphite/30 scale-x-0 group-hover:scale-x-100',
                )}
              />
            </button>
          ))}
        </div>
      </div>
    </article>
  );
}