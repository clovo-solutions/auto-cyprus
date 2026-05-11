import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import { isLocale, type Locale } from '@/i18n/config';
import { Container, Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/SectionHeader';
import { SellTimeline } from '@/components/sell/SellTimeline';
import { SellForm } from '@/components/forms/SellForm';
import { ArrowRightIcon, PhoneIcon, WhatsappIcon } from '@/components/icons';
import { Reveal } from '@/components/motion/Reveal';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { Magnetic } from '@/components/motion/Magnetic';
import { issueToken } from '@/lib/inquiryToken';
import { buildAlternates } from '@/lib/seo';
import { phoneHref, whatsappHref } from '@/lib/site';

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) {
    return {};
  }
  const t = await getTranslations({ locale, namespace: 'seo.sell' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: buildAlternates('/sell', locale),
  };
}

export default async function SellPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const typedLocale: Locale = locale;

  const t = await getTranslations({ locale: typedLocale, namespace: 'sell' });
  const tForm = await getTranslations({ locale: typedLocale, namespace: 'sell.form' });
  const token = issueToken();

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-ink overflow-hidden" style={{ color: '#ffffff' }}>
        <div
          className="relative w-full"
          style={{ height: 'min(88vh, 860px)', minHeight: '580px' }}
        >
          {/* Background image */}
          <div className="absolute inset-0" style={{ zIndex: 0 }}>
            <Image
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=85&w=2400"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: 'center 40%' }}
            />
          </div>

          {/* Gradient overlay — desktop: strong left for text, open right to reveal car */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none hidden md:block"
            style={{
              zIndex: 1,
              background:
                'linear-gradient(to right, rgba(14,17,22,0.93) 0%, rgba(14,17,22,0.78) 38%, rgba(14,17,22,0.48) 65%, rgba(14,17,22,0.2) 100%), linear-gradient(to top, rgba(14,17,22,0.65) 0%, rgba(14,17,22,0.1) 50%)',
            }}
          />
          {/* Mobile: uniform dark veil */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none md:hidden"
            style={{
              zIndex: 1,
              background:
                'linear-gradient(to bottom, rgba(14,17,22,0.55) 0%, rgba(14,17,22,0.45) 30%, rgba(14,17,22,0.72) 70%, rgba(14,17,22,0.9) 100%)',
            }}
          />

          {/* Masthead row */}
          <div
            className="absolute top-0 inset-x-0 border-b container-page"
            style={{ zIndex: 2, borderColor: 'rgba(255,255,255,0.12)' }}
          >
            <div
              className="flex items-center justify-between uppercase"
              style={{ minHeight: '44px', fontSize: '10px', letterSpacing: '0.18em' }}
            >
              <div className="flex items-center gap-3 py-3">
                <span style={{ color: 'var(--color-accent-soft)' }}>{t('hero.eyebrow')}</span>
              </div>
              <div
                className="hidden md:flex items-center gap-3 py-3"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                <span>The AZZ&apos;s</span>
                <span aria-hidden="true">·</span>
                <span>Limassol</span>
                <span aria-hidden="true">·</span>
                <span>Since 2013</span>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div
            className="absolute inset-x-0 flex flex-col container-page"
            style={{
              zIndex: 2,
              top: '44px',
              bottom: 0,
              paddingTop: 'clamp(2rem, 5vh, 5rem)',
              paddingBottom: 'clamp(2rem, 5vh, 4rem)',
            }}
          >
            {/* Eyebrow rule */}
            <Reveal className="flex items-center gap-3">
              <span
                className="block w-8 md:w-12 h-px"
                style={{ backgroundColor: 'var(--color-accent-soft)' }}
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
                {t('hero.eyebrow')}
              </span>
            </Reveal>

            {/* Headline */}
            <div className="flex-1 flex items-center py-6 md:py-8">
              <div className="max-w-[820px]">
                <h1
                  className="display text-balance"
                  style={{
                    color: '#ffffff',
                    fontSize: 'clamp(2.75rem, 6vw, 5.5rem)',
                    lineHeight: 0.92,
                    letterSpacing: '-0.022em',
                    textShadow: '0 2px 24px rgba(0,0,0,0.4)',
                  }}
                >
                  <SplitReveal
                    text={t('hero.headline')}
                    as="span"
                    staggerChildren={0.045}
                    delay={0.2}
                  />
                </h1>

                <Reveal delay={0.65}>
                  <p
                    className="mt-6 text-base md:text-lg max-w-[44ch] leading-relaxed text-pretty"
                    style={{ color: 'rgba(255,255,255,0.68)' }}
                  >
                    {t('hero.sub')}
                  </p>
                </Reveal>
              </div>
            </div>

            {/* CTAs + trust badges */}
            <div className="flex flex-col gap-6">
              <Reveal delay={0.9}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Magnetic strength={0.18}>
                    <a
                      href="#sell-form"
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
                        <span>{t('hero.cta')}</span>
                        <ArrowRightIcon
                          size={14}
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </span>
                    </a>
                  </Magnetic>
                  <a
                    href={whatsappHref()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-2 py-3 text-sm link-rule self-start sm:self-auto"
                    style={{ color: 'rgba(255,255,255,0.85)' }}
                  >
                    {t('hero.secondaryCta')}
                    <ArrowRightIcon size={12} />
                  </a>
                </div>
              </Reveal>

              <Reveal delay={1.1}>
                <ul className="flex flex-wrap items-center gap-x-6 gap-y-2.5">
                  {([t('hero.badge1'), t('hero.badge2'), t('hero.badge3')] as string[]).map(
                    (badge) => (
                      <li key={badge} className="flex items-center gap-2">
                        <span
                          aria-hidden="true"
                          className="flex-shrink-0 inline-flex items-center justify-center w-4 h-4 rounded-full"
                          style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                        >
                          <svg
                            width="7"
                            height="6"
                            viewBox="0 0 7 6"
                            fill="none"
                            aria-hidden="true"
                          >
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
                            color: 'rgba(255,255,255,0.65)',
                          }}
                        >
                          {badge}
                        </span>
                      </li>
                    ),
                  )}
                </ul>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why us ───────────────────────────────────────────────────────── */}
      <Section tone="cream" spacing="md">
        <Container>
          <SectionHeader
            eyebrow="01 / Why us"
            title={t('pitch.title')}
            index="01"
            size="md"
            className="mb-12 md:mb-16"
          />
          <div className="grid md:grid-cols-3 gap-px bg-rule-light">
            {(['speed', 'fair', 'clean'] as const).map((key, i) => (
              <Reveal key={key} delay={i * 0.12} className="h-full">
                <div className="group bg-cream p-8 md:p-10 flex flex-col gap-4 min-h-[280px] relative overflow-hidden h-full">
                  {/* Brass hairlines — draw on hover */}
                  <span
                    className="absolute top-0 inset-x-0 h-px origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{ backgroundColor: 'var(--color-accent)' }}
                    aria-hidden="true"
                  />
                  <span
                    className="absolute bottom-0 inset-x-0 h-px origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{ backgroundColor: 'var(--color-accent)' }}
                    aria-hidden="true"
                  />

                  <span className="display-italic text-accent text-4xl leading-none">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="display text-xl md:text-2xl tracking-tight text-balance">
                    {t(`pitch.items.${key}.title`)}
                  </h3>
                  <p className="text-sm text-graphite leading-relaxed text-pretty mt-auto">
                    {t(`pitch.items.${key}.body`)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── Timeline ─────────────────────────────────────────────────────── */}
      <SellTimeline locale={typedLocale} />

      {/* ── Mid-page CTA ─────────────────────────────────────────────────── */}
      <section
        className="bg-ink py-14 md:py-20"
        style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
      >
        <Container>
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 md:gap-16">
              <div className="flex flex-col gap-3 max-w-[38ch]">
                <span
                  className="uppercase font-medium"
                  style={{
                    color: 'var(--color-accent-soft)',
                    fontSize: '10px',
                    letterSpacing: '0.2em',
                  }}
                >
                  {t('midCta.eyebrow')}
                </span>
                <p
                  className="display text-2xl md:text-3xl tracking-tight text-balance"
                  style={{ color: 'var(--color-bone)' }}
                >
                  {t('midCta.title')}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-mist)' }}>
                  {t('midCta.sub')}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
                <Magnetic strength={0.18}>
                  <a
                    href={whatsappHref()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group btn-base inline-flex items-center justify-center gap-2.5 font-medium tracking-[0.04em] uppercase border text-sm px-7 py-4 min-h-[48px] relative overflow-hidden"
                    style={{
                      backgroundColor: 'transparent',
                      color: 'var(--color-bone)',
                      borderColor: 'rgba(255,255,255,0.22)',
                    }}
                  >
                    <span
                      className="absolute inset-0 -translate-x-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0"
                      style={{ backgroundColor: 'var(--color-accent)' }}
                      aria-hidden="true"
                    />
                    <WhatsappIcon
                      size={14}
                      className="relative transition-colors duration-500"
                      style={{ color: 'inherit' }}
                    />
                    <span className="relative">{t('midCta.whatsapp')}</span>
                  </a>
                </Magnetic>

                <a
                  href={phoneHref()}
                  className="inline-flex items-center gap-2 px-2 py-3 text-sm"
                  style={{ color: 'rgba(255,255,255,0.65)' }}
                >
                  <PhoneIcon size={14} />
                  <span className="link-rule" style={{ color: 'rgba(255,255,255,0.65)' }}>
                    {t('midCta.phone')}
                  </span>
                </a>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ── Form ─────────────────────────────────────────────────────────── */}
      <section id="sell-form" className="bg-bone py-16 md:py-24 border-t border-rule-light">
        <Container size="narrow">
          <SectionHeader
            eyebrow="03 / Submit"
            title={tForm('title')}
            sub={tForm('sub')}
            index="03"
            size="md"
            className="mb-10 md:mb-14"
          />

          {/* Trust signals row */}
          <div className="flex flex-wrap gap-x-7 gap-y-3 pb-10 mb-10 border-b border-rule-light">
            {([t('hero.badge1'), t('hero.badge2'), t('hero.badge3')] as string[]).map((badge) => (
              <span key={badge} className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="flex-shrink-0 inline-flex items-center justify-center w-4 h-4 rounded-full bg-ink/[0.06]"
                >
                  <svg width="7" height="6" viewBox="0 0 7 6" fill="none" aria-hidden="true">
                    <path
                      d="M1 3L2.8 5L6 1"
                      stroke="var(--color-accent)"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="text-sm text-graphite">{badge}</span>
              </span>
            ))}
          </div>

          <SellForm token={token} />
        </Container>
      </section>
    </>
  );
}
