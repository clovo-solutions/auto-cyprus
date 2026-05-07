import { getTranslations } from 'next-intl/server';
import { Container, Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/SectionHeader';
import { Reveal } from '@/components/motion/Reveal';
import type { Locale } from '@/i18n/config';

interface HowItWorksProps {
  locale: Locale;
}

const steps = ['one', 'two', 'three'] as const;

export async function HowItWorks({ locale }: HowItWorksProps) {
  const t = await getTranslations({ locale, namespace: 'home.how' });

  return (
    <Section tone="paper" spacing="xl">
      <Container>
        <SectionHeader
          eyebrow={t('eyebrow')}
          title={t('title')}
          onDark
          index="03"
          size="lg"
          className="mb-16 md:mb-24"
        />

        <ol className="grid md:grid-cols-3 gap-px bg-white/8 relative">
          {steps.map((step, i) => (
            <Reveal
              key={step}
              delay={i * 0.15}
              as="li"
              className="bg-ink p-8 md:p-12 flex flex-col gap-6 min-h-[280px] md:min-h-[360px] group relative overflow-hidden"
            >
              {/* Background numeral that scales on hover */}
              <span
                aria-hidden="true"
                className="absolute -top-8 -right-4 display-italic text-white/4 text-[14rem] leading-none select-none transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 group-hover:text-accent/10"
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              <div className="relative flex items-baseline gap-4 z-10">
                <span className="display-italic text-accent text-5xl md:text-6xl leading-none">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  className="block w-8 h-px bg-mist mt-3 origin-left transition-transform duration-500 group-hover:scale-x-150"
                  aria-hidden="true"
                />
              </div>

              <div className="relative flex flex-col gap-3 mt-auto z-10">
                <h3 className="text-bone text-xl md:text-2xl font-medium tracking-tight text-balance">
                  {t(`steps.${step}.title`)}
                </h3>
                <p className="text-mist text-sm md:text-base leading-relaxed text-pretty max-w-[36ch]">
                  {t(`steps.${step}.body`)}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
