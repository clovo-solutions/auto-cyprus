'use client';

import { useEffect, useState } from 'react';

const KEYFRAMES = `
  @keyframes ac-up {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes ac-draw {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }
  @keyframes ac-fade {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes ac-spin {
    to { transform: rotate(360deg); }
  }
`;

export function SplashScreen() {
  const [fading, setFading] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    function dismiss() {
      setFading(true);
      timer = setTimeout(() => setGone(true), 750);
    }

    if (document.readyState === 'complete') {
      dismiss();
    } else {
      window.addEventListener('load', dismiss, { once: true });
    }

    return () => {
      window.removeEventListener('load', dismiss);
      clearTimeout(timer);
    };
  }, []);

  if (gone) return null;

  return (
    <>
      <style>{KEYFRAMES}</style>
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(ellipse 90% 65% at 50% 50%, #16191f 0%, #0e1116 100%)',
          opacity: fading ? 0 : 1,
          transition: 'opacity 750ms cubic-bezier(0.4, 0, 0.2, 1)',
          pointerEvents: fading ? 'none' : 'auto',
        }}
      >
        {/* Eyebrow — establishes provenance before the brand name arrives */}
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.6875rem',
            fontWeight: 500,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--color-mist)',
            margin: '0 0 2.25rem',
            animation: 'ac-up 0.7s cubic-bezier(0.22,1,0.36,1) 0ms both',
          }}
        >
          Limassol&nbsp;&nbsp;·&nbsp;&nbsp;Since 2013
        </p>

        {/* Brand mark */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontWeight: 500,
              fontSize: 'clamp(2rem, 6vw, 3.5rem)',
              letterSpacing: '0.02em',
              color: 'var(--color-bone)',
              animation: 'ac-up 0.7s cubic-bezier(0.22,1,0.36,1) 180ms both',
            }}
          >
            The AZZ&apos;s
          </span>
        </div>

        {/* Hairline — draws left-to-right after the name is complete */}
        <div
          style={{
            width: '3rem',
            height: '1px',
            backgroundColor: 'var(--color-accent)',
            opacity: 0.3,
            marginTop: '1.75rem',
            transformOrigin: 'left center',
            animation: 'ac-draw 0.8s cubic-bezier(0.22,1,0.36,1) 520ms both',
          }}
        />

        {/* Spinner — last to arrive, keeps the screen alive while assets load */}
        <svg
          width={32}
          height={32}
          viewBox="0 0 44 44"
          style={{
            marginTop: '1.5rem',
            color: 'var(--color-accent)',
            animation: 'ac-fade 0.6s ease 680ms both, ac-spin 1.4s linear 680ms infinite',
          }}
        >
          <circle cx={22} cy={22} r={17} stroke="currentColor" strokeWidth={1} fill="none" opacity={0.2} />
          <circle
            cx={22}
            cy={22}
            r={17}
            stroke="currentColor"
            strokeWidth={1.5}
            strokeDasharray="80 107"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>
    </>
  );
}
