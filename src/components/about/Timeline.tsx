import { getTranslations } from 'next-intl/server';
import { Container, Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/SectionHeader';
import type { Locale } from '@/i18n/config';

interface TimelineProps {
  locale: Locale;
}

const items = ['one', 'two', 'three', 'four', 'five'] as const;

export async function Timeline({ locale }: TimelineProps) {
  const t = await getTranslations({ locale, namespace: 'about.timeline' });

  return (
    <Section tone="cream" spacing="lg">
      <Container>
        <SectionHeader
          eyebrow="History"
          title={t('title')}
          index="02"
          size="md"
          className="mb-16"
        />

        <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
          {items.map((key, i) => (
            <li key={key} className="relative">
              <div className="hairline pt-6">
                <span className="display-italic text-accent text-3xl md:text-4xl block leading-none mb-3">
                  {t(`items.${key}.year`)}
                </span>
                <h3 className="display text-xl md:text-2xl tracking-tight text-balance">
                  {t(`items.${key}.title`)}
                </h3>
                <p className="mt-3 text-sm text-graphite leading-relaxed text-pretty">
                  {t(`items.${key}.body`)}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
