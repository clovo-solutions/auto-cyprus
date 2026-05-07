import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { isLocale, type Locale } from '@/i18n/config';
import { Container, Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/SectionHeader';
import { Founder } from '@/components/about/Founder';
import { Timeline } from '@/components/about/Timeline';
import { TeamGrid } from '@/components/about/TeamGrid';
import { CtaBand } from '@/components/home/CtaBand';
import { buildAlternates } from '@/lib/seo';

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
  const t = await getTranslations({ locale, namespace: 'seo.about' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: buildAlternates('/about', locale),
  };
}

export default async function AboutPage({
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

  const t = await getTranslations({ locale: typedLocale, namespace: 'about' });
  const tValues = await getTranslations({ locale: typedLocale, namespace: 'about.values' });

  return (
    <>
      {/* Hero */}
      <section className="bg-bone pt-12 md:pt-20 pb-16 md:pb-24">
        <Container>
          <div className="flex items-center gap-3 mb-6">
            <span className="block w-12 h-px bg-ink" aria-hidden="true" />
            <span className="eyebrow">{t('hero.eyebrow')}</span>
          </div>
          <h1 className="display text-4xl md:text-6xl lg:text-7xl tracking-tight text-balance max-w-[18ch]">
            {t('hero.headline')}
          </h1>
          <p className="mt-8 text-base md:text-lg text-graphite max-w-[44ch] text-pretty leading-relaxed">
            {t('hero.sub')}
          </p>
        </Container>
      </section>

      {/* Founder block */}
      <Founder locale={typedLocale} />

      {/* Values — three columns on cream */}
      <Section tone="cream" spacing="lg">
        <Container>
          <SectionHeader
            eyebrow="Principles"
            title={tValues('title')}
            index="01"
            size="md"
            className="mb-12 md:mb-16"
          />
          <div className="grid md:grid-cols-3 gap-px bg-rule-light">
            {(['honest', 'small', 'longterm'] as const).map((key, i) => (
              <div
                key={key}
                className="bg-cream p-8 md:p-10 flex flex-col gap-4 min-h-[260px]"
              >
                <span className="display-italic text-accent text-4xl leading-none">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="display text-xl md:text-2xl tracking-tight text-balance">
                  {tValues(`items.${key}.title`)}
                </h3>
                <p className="text-sm text-graphite leading-relaxed text-pretty">
                  {tValues(`items.${key}.body`)}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Timeline locale={typedLocale} />
      <TeamGrid locale={typedLocale} />
      <CtaBand locale={typedLocale} />
    </>
  );
}
