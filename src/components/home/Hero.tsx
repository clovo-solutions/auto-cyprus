import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ArrowRightIcon } from '@/components/icons';
import type { Locale } from '@/i18n/config';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { Reveal } from '@/components/motion/Reveal';
import { Magnetic } from '@/components/motion/Magnetic';
import { CountUp } from '@/components/motion/CountUp';
import Image from 'next/image';
import { HeroVideoPlayer } from './HeroVideoPlayer';

interface HeroProps {
  locale: Locale;
  inventoryCount: number;
}

export async function Hero({ locale, inventoryCount }: HeroProps) {
  const t = await getTranslations({ locale, namespace: 'home.hero' });

  const heroLabels = {
    en: {
      live: 'Live',
      issue: 'Issue',
      cars: 'cars',
      trustBadges: [
        'Verified & inspected',
        'Trusted across Cyprus',
        'Transparent pricing',
      ],
    },
    gr: {
      live: 'Ζωντανά',
      issue: 'Έκδοση',
      cars: 'αυτοκίνητα',
      trustBadges: [
        'Πιστοποιημένα & ελεγμένα',
        'Εμπιστευμένα σε όλη την Κύπρο',
        'Διαφανείς τιμές',
      ],
    },
    ru: {
      live: 'В реальном времени',
      issue: 'Выпуск',
      cars: 'машин',
      trustBadges: [
        'Проверены и осмотрены',
        'Доверяют по всему Кипру',
        'Прозрачные цены',
      ],
    },
  };

  const labels = heroLabels[locale];

  const today = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date());

  return (
    <section className="relative bg-ink overflow-hidden" style={{ color: '#ffffff' }}>
      <div
        className="relative w-full"
        style={{
          height: 'min(92vh, 960px)',
          minHeight: '560px',
        }}
      >
        {/* Background — z-index 0.
            Image lives in this server component so Next.js generates fetchpriority=high
            + <link rel="preload"> in <head> for LCP optimisation. */}
        <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
          <Image
            src="/hero-poster.webp"
            alt=""
            fill
            priority
            sizes="(min-width: 1280px) 1280px, (min-width: 768px) 1024px, 768px"
            quality={75}
            className="object-cover"
            aria-hidden="true"
          />
          <HeroVideoPlayer
            sources={[{ src: '/hero.mp4', type: 'video/mp4' }]}
            alt="Behind the wheel — a closer look at the cars The AZZ's puts on the road"
          />
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

        {/* Gradient overlay — z-index 1.
            Mobile gets a much stronger veil because the headline + credential rail
            need to read against any frame on a small screen. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none md:hidden"
          style={{
            zIndex: 1,
            background:
              'linear-gradient(to bottom, rgba(14,17,22,0.55) 0%, rgba(14,17,22,0.45) 30%, rgba(14,17,22,0.65) 70%, rgba(14,17,22,0.85) 100%)',
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none hidden md:block"
          style={{
            zIndex: 1,
            background:
              'linear-gradient(to right, rgba(14,17,22,0.85) 0%, rgba(14,17,22,0.65) 30%, rgba(14,17,22,0.35) 60%, rgba(14,17,22,0.15) 100%), linear-gradient(to top, rgba(14,17,22,0.7) 0%, rgba(14,17,22,0.2) 40%, rgba(14,17,22,0.0) 70%), linear-gradient(to bottom, rgba(14,17,22,0.5) 0%, rgba(14,17,22,0) 25%)',
          }}
        />

        {/* Top masthead row */}
        <div
          className="absolute top-0 inset-x-0 border-b container-page"
          style={{
            zIndex: 2,
            borderColor: 'rgba(255, 255, 255, 0.15)',
            color: '#ffffff',
          }}
        >
          <div
            className="flex items-center justify-between uppercase"
            style={{
              minHeight: '44px',
              fontSize: '10px',
              letterSpacing: '0.18em',
            }}
          >
            <div className="flex items-center gap-2 md:gap-3 py-3" style={{ color: '#ffffff' }}>
              <span className="relative inline-flex items-center justify-center w-1.5 h-1.5">
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full anim-pulse-soft"
                  style={{ backgroundColor: 'var(--color-live)' }}
                />
                <span
                  className="relative rounded-full w-1.5 h-1.5"
                  style={{ backgroundColor: 'var(--color-live)' }}
                  aria-hidden="true"
                />
              </span>
              <span style={{ color: '#ffffff' }}>{labels.live}</span>
              <span style={{ color: 'rgba(255,255,255,0.5)' }} aria-hidden="true">·</span>
              <span className="tabular-nums" style={{ color: '#ffffff' }}>
                <CountUp value={inventoryCount} />{' '}
                <span style={{ color: 'rgba(255,255,255,0.85)' }}>{labels.cars}</span>
              </span>
            </div>
            <div className="hidden md:flex items-center gap-3 py-3" style={{ color: '#ffffff' }}>
              <span
                className="leading-none font-medium"
                style={{
                  color: '#ffffff',
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontSize: '15px',
                }}
              >
                {labels.issue}
              </span>
              <span className="tabular-nums" style={{ color: '#ffffff' }}>XII · 2026</span>
              <span style={{ color: 'rgba(255,255,255,0.5)' }} aria-hidden="true">·</span>
              <span className="tabular-nums" style={{ color: '#ffffff' }}>{today}</span>
              <span style={{ color: 'rgba(255,255,255,0.5)' }} aria-hidden="true">·</span>
              <span style={{ color: '#ffffff' }}>Limassol</span>
            </div>
            {/* Mobile only — date in compact form */}
            <div
              className="flex md:hidden items-center py-3 tabular-nums"
              style={{ color: 'rgba(255,255,255,0.85)' }}
            >
              {today}
            </div>
          </div>
        </div>

        {/* The headline block — fills the entire vertical space */}
        <div
          className="absolute inset-x-0 flex flex-col container-page"
          style={{
            zIndex: 2,
            top: '44px',
            bottom: '0',
            paddingTop: 'clamp(1.5rem, 3vh, 4rem)',
            paddingBottom: 'clamp(1.5rem, 4vh, 4rem)',
            color: '#ffffff',
          }}
        >
          {/* Top: Eyebrow */}
          <Reveal className="flex items-center gap-3">
            <span
              className="block w-8 md:w-12 h-px draw-rule"
              style={{
                backgroundColor: 'var(--color-accent-soft)',
                animationDelay: '120ms',
              }}
              aria-hidden="true"
            />
            <span
              className="uppercase font-medium"
              style={{
                color: 'var(--color-accent-soft)',
                fontSize: '10px',
                letterSpacing: '0.2em',
              }}
            >
              {t('eyebrow')}
            </span>
          </Reveal>

          <div className="flex-1 flex items-center py-4 sm:py-6 md:py-8">
            <div className="relative max-w-[920px] xl:max-w-[1080px]">
              <h1
                className="display text-balance text-[3.5rem] sm:text-6xl md:text-6xl lg:text-[6.5rem] xl:text-[8rem] leading-[0.92] tracking-[-0.02em]"
                style={{
                  color: '#ffffff',
                  textShadow: '0 2px 24px rgba(0, 0, 0, 0.5)',
                }}
              >
                <SplitReveal
                  text={t('headline')}
                  as="span"
                  staggerChildren={0.045}
                  delay={0.2}
                />
              </h1>

              <Reveal delay={0.65}>
                <p
                  className="mt-5 md:mt-7 text-base md:text-lg max-w-[40ch] leading-relaxed text-pretty"
                  style={{ color: 'rgba(255,255,255,0.72)' }}
                >
                  {t('sub')}
                </p>
              </Reveal>
            </div>
          </div>

          <div className="flex flex-col gap-5 md:gap-7">
            <Reveal delay={0.95}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-5">
                <Magnetic strength={0.18}>
                  <Link
                    href="/cars"
                    className="group btn-base inline-flex items-center justify-center gap-2 font-medium tracking-[0.04em] uppercase border text-sm px-8 py-4 min-h-[52px] relative overflow-hidden"
                    style={{
                      backgroundColor: '#ffffff',
                      color: 'var(--color-ink)',
                      borderColor: '#ffffff',
                    }}
                  >
                    <span
                      className="absolute inset-0 -translate-x-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0"
                      style={{ backgroundColor: 'var(--color-oxblood)' }}
                      aria-hidden="true"
                    />
                    <span className="relative flex items-center gap-2 group-hover:text-white transition-colors duration-500">
                      <span>{t('primaryCta')}</span>
                      <ArrowRightIcon
                        size={14}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </span>
                  </Link>
                </Magnetic>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-2 py-3 text-sm link-rule self-start sm:self-auto"
                  style={{ color: 'rgba(255,255,255,0.9)' }}
                >
                  {t('secondaryCta')}
                  <ArrowRightIcon size={12} />
                </Link>
              </div>
            </Reveal>

            <Reveal delay={1.2}>
              <ul className="flex flex-wrap items-center gap-x-5 gap-y-2.5">
                {labels.trustBadges.map((badge) => (
                  <li key={badge} className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="flex-shrink-0 inline-flex items-center justify-center w-4 h-4 rounded-full"
                      style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                    >
                      <svg width="7" height="6" viewBox="0 0 7 6" fill="none" aria-hidden="true">
                        <path
                          d="M1 3L2.8 5L6 1"
                          stroke="var(--color-accent-soft)"
                          strokeWidth="1.3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span
                      className="font-medium uppercase"
                      style={{
                        fontSize: '10px',
                        letterSpacing: '0.16em',
                        color: 'rgba(255,255,255,0.68)',
                        textShadow: '0 1px 6px rgba(0,0,0,0.3)',
                      }}
                    >
                      {badge}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}