'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/cn';

interface HeroVideoProps {
  sources: Array<{ src: string; type: string }>;
  posterUrl: string;
  className?: string;
  alt: string;
}

export function HeroVideo({ sources, posterUrl, className, alt }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (reduced) {
      v.pause();
      return;
    }
    v.muted = true;
    const playPromise = v.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Browser blocked autoplay — poster image stays visible
      });
    }
  }, [reduced]);

  return (
    <div className={cn('relative w-full h-full overflow-hidden', className)}>
      {/*
       * Poster delivered through Next.js image optimisation:
       * - Converts hero.jpg (3.2 MB) → AVIF/WebP (typically < 100 KB)
       * - `priority` adds fetchpriority="high" + <link rel="preload"> in <head>
       *   so the browser discovers and fetches it during HTML parse (fixes LCP)
       * - `sizes` generates a srcset matching real viewport breakpoints
       */}
      <Image
        src={posterUrl}
        alt={reduced ? alt : ''}
        fill
        priority
        sizes="(min-width: 1280px) 1280px, (min-width: 768px) 1024px, 768px"
        quality={75}
        className="object-cover"
        aria-hidden={reduced ? undefined : true}
      />

      {/* Video plays on top of the poster once loaded; reduced-motion users only see the Image */}
      {!reduced && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-label={alt}
          className="absolute inset-0 w-full h-full object-cover"
        >
          {sources.map((s) => (
            <source key={s.src} src={s.src} type={s.type} />
          ))}
        </video>
      )}

      {/* Warm color-grade overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 mix-blend-multiply pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(176,138,74,0.08) 0%, rgba(14,17,22,0) 30%, rgba(14,17,22,0.45) 100%)',
        }}
      />

      {/* Bottom veil — headline legibility on any video frame */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-2/3 pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, rgba(14,17,22,0.78) 0%, rgba(14,17,22,0.32) 50%, rgba(14,17,22,0) 100%)',
        }}
      />
    </div>
  );
}
