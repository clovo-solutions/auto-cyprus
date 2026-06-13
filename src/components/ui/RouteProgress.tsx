'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useReducedMotion } from 'framer-motion';

const STYLES = `
  .ac-progress {
    position: fixed;
    inset: 0 0 auto 0;
    height: 2px;
    z-index: 60;
    pointer-events: none;
  }
  .ac-progress__bar {
    height: 100%;
    width: 0;
    transform-origin: left center;
    background: linear-gradient(
      90deg,
      color-mix(in srgb, var(--color-accent) 35%, transparent) 0%,
      var(--color-accent) 60%,
      var(--color-accent-soft) 100%
    );
    box-shadow:
      0 0 10px 1px color-mix(in srgb, var(--color-accent) 65%, transparent),
      0 0 3px color-mix(in srgb, var(--color-accent) 90%, transparent);
  }
  /* Leading filament — a brighter cap that reads as the "head" of the bar */
  .ac-progress__bar::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: 64px;
    background: linear-gradient(
      90deg,
      transparent,
      color-mix(in srgb, var(--color-accent-soft) 80%, white)
    );
    opacity: 0.9;
  }
  @media (prefers-reduced-motion: reduce) {
    .ac-progress__bar::after { display: none; }
  }
`;

type Phase = 'idle' | 'loading' | 'done';

// A hairline navigation progress bar in the brass accent. It starts the instant
// an internal link is clicked — closing the perceived gap before the route's
// loading.tsx skeleton paints — and completes when the route resolves.
export function RouteProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const reduceMotion = useReducedMotion();

  const [phase, setPhase] = useState<Phase>('idle');
  const [width, setWidth] = useState(0);

  const activeRef = useRef(false);
  const firstRenderRef = useRef(true);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const rafRef = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    clearTimers();
    activeRef.current = true;
    setPhase('loading');
    setWidth(0);
    // Two rAFs so the browser registers the 0 width before transitioning,
    // otherwise the trickle animation is skipped.
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = requestAnimationFrame(() => setWidth(reduceMotion ? 100 : 88));
    });
    // Safety net: never let the bar hang if a route change is never observed.
    timersRef.current.push(
      setTimeout(() => {
        if (activeRef.current) {
          finish();
        }
      }, 12000),
    );
  }, [clearTimers, reduceMotion]);

  const finish = useCallback(() => {
    if (!activeRef.current) return;
    activeRef.current = false;
    clearTimers();
    setWidth(100);
    setPhase('done');
    timersRef.current.push(setTimeout(() => setWidth(0), 360));
    timersRef.current.push(setTimeout(() => setPhase('idle'), 600));
  }, [clearTimers]);

  // Begin progress the moment an internal navigation link is clicked.
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      const anchor = (event.target as HTMLElement | null)?.closest('a');
      if (!anchor) return;
      if (anchor.target === '_blank' || anchor.hasAttribute('download')) return;
      const rawHref = anchor.getAttribute('href');
      if (!rawHref) return;

      let target: URL;
      try {
        target = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      // Same origin only — skip tel:, mailto:, and external links.
      if (target.origin !== window.location.origin) return;
      // Skip pure hash / no-op clicks to the current URL.
      if (
        target.pathname === window.location.pathname &&
        target.search === window.location.search
      ) {
        return;
      }
      start();
    }

    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, [start]);

  // Complete when the route (path or query) actually changes.
  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    finish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  useEffect(() => clearTimers, [clearTimers]);

  if (phase === 'idle') return null;

  return (
    <div className="ac-progress" aria-hidden="true">
      <style>{STYLES}</style>
      <div
        className="ac-progress__bar"
        style={{
          width: `${width}%`,
          opacity: phase === 'done' ? 0 : 1,
          transition: reduceMotion
            ? 'opacity 200ms linear'
            : phase === 'loading'
              ? 'width 10s cubic-bezier(0.12, 0.86, 0.2, 1)'
              : 'width 320ms ease-out, opacity 280ms ease-out',
        }}
      />
    </div>
  );
}
