import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import { isLocale, type Locale } from '@/i18n/config';
import { Container, Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/SectionHeader';
import { SellTimeline } from '@/components/sell/SellTimeline';
import { SellForm } from '@/components/forms/SellForm';
import { Button } from '@/components/ui/Button';
import { ArrowRightIcon } from '@/components/icons';
import { issueToken } from '@/lib/inquiryToken';
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
      {/* Hero */}
      <section className="bg-bone pt-12 md:pt-20 pb-16 md:pb-24">
        <Container>
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 mb-6">
                <span className="block w-12 h-px bg-ink" aria-hidden="true" />
                <span className="eyebrow">{t('hero.eyebrow')}</span>
              </div>
              <h1 className="display text-4xl md:text-6xl lg:text-7xl tracking-tight text-balance">
                {t('hero.headline')}
              </h1>
              <p className="mt-7 text-base md:text-lg text-graphite max-w-[44ch] text-pretty leading-relaxed">
                {t('hero.sub')}
              </p>
              <div className="mt-8">
                <Button as="a" href="#sell-form" variant="primary" size="lg" iconRight={<ArrowRightIcon size={14} />}>
                  Get started
                </Button>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="image-frame relative aspect-portrait bg-fog/40 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1200"
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Pitch — three reasons */}
      <Section tone="cream" spacing="lg">
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
              <div
                key={key}
                className="bg-cream p-8 md:p-10 flex flex-col gap-4 min-h-[260px]"
              >
                <span className="display-italic text-accent text-4xl leading-none">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="display text-xl md:text-2xl tracking-tight text-balance">
                  {t(`pitch.items.${key}.title`)}
                </h3>
                <p className="text-sm text-graphite leading-relaxed text-pretty">
                  {t(`pitch.items.${key}.body`)}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Timeline */}
      <SellTimeline locale={typedLocale} />

      {/* Form */}
      <section id="sell-form" className="bg-bone py-16 md:py-24 border-t border-rule-light">
        <Container size="narrow">
          <div className="flex flex-col gap-3 mb-10">
            <span className="eyebrow text-graphite">03 / Submit</span>
            <h2 className="display text-3xl md:text-4xl tracking-tight">
              {tForm('title')}
            </h2>
            <p className="text-graphite text-pretty max-w-prose">{tForm('sub')}</p>
          </div>
          <SellForm token={token} />
        </Container>
      </section>
    </>
  );
}
