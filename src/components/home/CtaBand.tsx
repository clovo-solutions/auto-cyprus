import { getTranslations } from 'next-intl/server';
import { Container, Section } from '@/components/ui/Section';
import { ArrowRightIcon, MapPinIcon, PhoneIcon } from '@/components/icons';
import { mapsHref, phoneHref, site } from '@/lib/site';
import type { Locale } from '@/i18n/config';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { Reveal } from '@/components/motion/Reveal';
import { Magnetic } from '@/components/motion/Magnetic';

interface CtaBandProps {
  locale: Locale;
}

export async function CtaBand({ locale }: CtaBandProps) {
  const t = await getTranslations({ locale, namespace: 'home.cta' });

  return (
    <Section tone="paper" spacing="xl">
      <Container>
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <Reveal className="flex items-center gap-3 mb-6">
              <span
                className="block w-12 h-px bg-accent draw-rule"
                style={{ animationDelay: '120ms' }}
                aria-hidden="true"
              />
              <span className="eyebrow-on-dark">06 / Visit</span>
            </Reveal>
            <h2 className="display text-bone text-balance text-4xl md:text-5xl lg:text-6xl leading-tight">
              <SplitReveal text={t('title')} as="span" staggerChildren={0.05} />
            </h2>
            <Reveal delay={0.5}>
              <p className="mt-7 text-mist text-base md:text-lg max-w-[44ch] text-pretty leading-relaxed">
                {t('sub')}
              </p>
            </Reveal>
            <Reveal delay={0.7}>
              <div className="mt-9 flex flex-col sm:flex-row gap-4">
                <Magnetic strength={0.18}>
                  <a
                    href={mapsHref()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group btn-base inline-flex items-center justify-center gap-2 font-medium tracking-[0.04em] uppercase border bg-bone text-ink hover:bg-bone/90 border-bone text-sm px-8 py-4 min-h-[52px] relative overflow-hidden"
                  >
                    <span
                      className="absolute inset-0 bg-accent -translate-x-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0"
                      aria-hidden="true"
                    />
                    <span className="relative flex items-center gap-2 group-hover:text-bone transition-colors duration-500">
                      <MapPinIcon size={14} />
                      <span>{t('primary')}</span>
                      <ArrowRightIcon
                        size={14}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </span>
                  </a>
                </Magnetic>
                <a
                  href={phoneHref()}
                  className="inline-flex items-center gap-2 px-2 py-3 text-sm text-bone link-rule self-start sm:self-auto"
                >
                  <PhoneIcon size={14} />
                  <span>
                    {t('secondary')} — {site.phone}
                  </span>
                </a>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5 lg:pl-8">
            <Reveal delay={0.4}>
              <div className="hairline-dark pt-8 grid grid-cols-2 gap-x-6 gap-y-8">
                <div>
                  <span className="eyebrow-on-dark">Mon — Fri</span>
                  <p className="mt-2 text-bone text-base tabular-nums">09:00 – 19:00</p>
                </div>
                <div>
                  <span className="eyebrow-on-dark">Saturday</span>
                  <p className="mt-2 text-bone text-base tabular-nums">10:00 – 16:00</p>
                </div>
                <div>
                  <span className="eyebrow-on-dark">Sunday</span>
                  <p className="mt-2 text-mist text-base">By appointment</p>
                </div>
                <div>
                  <span className="eyebrow-on-dark">Address</span>
                  <p className="mt-2 text-bone text-sm leading-relaxed">{site.address}</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
