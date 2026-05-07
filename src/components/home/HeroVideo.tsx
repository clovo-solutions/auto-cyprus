'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
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
        // Browser blocked autoplay; poster stays visible
      });
    }
  }, [reduced]);

  return (
    <div className={cn('relative w-full h-full overflow-hidden', className)}>
      {reduced ? (
        <img
          src={posterUrl}
          alt={alt}
          fetchPriority="high"
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={posterUrl}
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
