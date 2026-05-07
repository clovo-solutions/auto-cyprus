import { getTranslations } from 'next-intl/server';
import { Container, Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/SectionHeader';
import type { Locale } from '@/i18n/config';

interface SellTimelineProps {
  locale: Locale;
}

const steps = ['one', 'two', 'three', 'four'] as const;

export async function SellTimeline({ locale }: SellTimelineProps) {
  const t = await getTranslations({ locale, namespace: 'sell.timeline' });

  return (
    <Section tone="cream" spacing="lg">
      <Container>
        <SectionHeader
          eyebrow="02 / Process"
          title={t('title')}
          index="02"
          size="md"
          className="mb-12 md:mb-16"
        />

        <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-rule-light">
          {steps.map((step, i) => (
            <li
              key={step}
              className="bg-cream p-7 md:p-9 flex flex-col gap-5 min-h-[260px] relative"
            >
              <div className="flex items-baseline justify-between">
                <span className="display-italic text-accent text-3xl md:text-4xl leading-none">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-2xs uppercase tracking-[0.18em] text-graphite">
                  {t(`steps.${step}.label`)}
                </span>
              </div>
              <div className="mt-auto">
                <h3 className="display text-xl md:text-2xl tracking-tight text-balance">
                  {t(`steps.${step}.title`)}
                </h3>
                <p className="mt-3 text-sm text-graphite leading-relaxed text-pretty">
                  {t(`steps.${step}.body`)}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
