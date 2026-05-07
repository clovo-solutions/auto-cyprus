import { getTranslations } from 'next-intl/server';
import { Container, Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/SectionHeader';
import { Reveal } from '@/components/motion/Reveal';
import { CountUp } from '@/components/motion/CountUp';
import type { Locale } from '@/i18n/config';

interface TrustStripProps {
  locale: Locale;
}

interface TrustItem {
  key: 'inspection' | 'history' | 'customers' | 'return';
  numeric?: { value: number; prefix?: string; suffix?: string };
}

const items: TrustItem[] = [
  { key: 'inspection', numeric: { value: 100 } },
  { key: 'history', numeric: { value: 12, suffix: ' yrs' } },
  { key: 'customers', numeric: { value: 3000, suffix: '+' } },
  { key: 'return', numeric: { value: 7, suffix: ' days' } },
];

export async function TrustStrip({ locale }: TrustStripProps) {
  const t = await getTranslations({ locale, namespace: 'home.trust' });

  return (
    <Section tone="cream" spacing="lg">
      <Container>
        <SectionHeader
          eyebrow="01 / Why us"
          title={t('title')}
          size="md"
          className="mb-12 md:mb-16"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-rule-light">
          {items.map((item, i) => (
            <Reveal
              key={item.key}
              delay={i * 0.1}
              className="bg-cream p-8 md:p-10 flex flex-col gap-5 min-h-[280px] group relative overflow-hidden"
            >
              {/* Tiny index numeral, top-right corner */}
              <span
                className="absolute top-4 right-5 index-numeral text-mist text-sm group-hover:text-accent transition-colors duration-500"
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              <div className="big-stat text-ink tabular-nums">
                {item.numeric ? (
                  <CountUp
                    value={item.numeric.value}
                    prefix={item.numeric.prefix}
                    suffix={item.numeric.suffix}
                    duration={1800}
                  />
                ) : (
                  t(`items.${item.key}.stat`)
                )}
              </div>
              <div>
                <p className="eyebrow text-graphite mb-3">
                  {t(`items.${item.key}.label`)}
                </p>
                <p className="text-sm text-ink-soft text-pretty leading-relaxed">
                  {t(`items.${item.key}.body`)}
                </p>
              </div>

              {/* Hairline that draws in on hover */}
              <span
                className="absolute bottom-0 left-0 h-px w-full bg-accent scale-x-0 origin-left transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
                aria-hidden="true"
              />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
