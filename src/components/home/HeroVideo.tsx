'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/cn';

interface HeroVideoProps {
  /** Multiple sources for browser compatibility (mp4 first, webm fallback) */
  sources: Array<{ src: string; type: string }>;
  /** Static poster shown before the video plays + as the reduced-motion fallback */
  posterUrl: string;
  className?: string;
  /** Accessibility-only label for the visual content */
  alt: string;
}

export function HeroVideo({ sources, posterUrl, className, alt }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const [muted, setMuted] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) {
      return;
    }
    if (reduced) {
      v.pause();
      return;
    }
    // Defensive autoplay — required to be muted on Chrome, iOS Safari
    v.muted = muted;
    if (!muted) {
      v.muted = false;
    }
    const playPromise = v.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Browser blocked autoplay; leave the poster visible
      });
    }
  }, [reduced, muted]);

  return (
    <div className={cn('relative w-full h-full overflow-hidden', className)}>
      {reduced ? (
        // Reduced-motion users get a still image, never the video
        <img
          src={posterUrl}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={muted}
          playsInline
          preload="metadata"
          poster={posterUrl}
          aria-label={alt}
          className="absolute inset-0 w-full h-full object-cover"
        >
          {sources.map((s) => (
            <source key={s.src} src={s.src} type={s.type} />
          ))}
          {/* Browsers that can't play any of the above will fall back to the poster */}
        </video>
      )}

      {/* Warm color-grade overlay — ties the footage tonally to the brass */}
      <div
        aria-hidden="true"
        className="absolute inset-0 mix-blend-multiply pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(176, 138, 74, 0.08) 0%, rgba(14, 17, 22, 0.0) 30%, rgba(14, 17, 22, 0.45) 100%)',
        }}
      />

      {/* Bottom darker veil so headline text reads on any frame */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-2/3 pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, rgba(14, 17, 22, 0.78) 0%, rgba(14, 17, 22, 0.32) 50%, rgba(14, 17, 22, 0) 100%)',
        }}
      />

      {/* Mute toggle — top-right, square 44pt button */}
      {hasMounted && !reduced ? (
        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? 'Unmute video' : 'Mute video'}
          aria-pressed={!muted}
          className={cn(
            'absolute top-4 right-4 md:top-6 md:right-6 z-30',
            'inline-flex items-center justify-center min-w-[44px] min-h-[44px]',
            'border border-bone/30 bg-ink/40 backdrop-blur-md text-bone',
            'hover:bg-ink/60 hover:border-bone/60 transition-colors duration-200',
          )}
        >
          {muted ? (
            <SpeakerOffIcon size={18} />
          ) : (
            <SpeakerOnIcon size={18} />
          )}
        </button>
      ) : null}
    </div>
  );
}

function SpeakerOffIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M11 5L6 9H2v6h4l5 4V5z" />
      <line x1="22" y1="9" x2="16" y2="15" />
      <line x1="16" y1="9" x2="22" y2="15" />
    </svg>
  );
}

function SpeakerOnIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M11 5L6 9H2v6h4l5 4V5z" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}