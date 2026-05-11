import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Container } from '@/components/ui/Section';
import { Reveal } from '@/components/motion/Reveal';
import type { Locale } from '@/i18n/config';

interface FounderProps {
  locale: Locale;
}

export async function Founder({ locale }: FounderProps) {
  const t = await getTranslations({ locale, namespace: 'about.founder' });

  return (
    <section className="bg-bone py-20 md:py-32">
      <Container>
        <Reveal className="mb-12 md:mb-16">
          <span className="eyebrow text-graphite mb-4 block">{t('eyebrow')}</span>
          <h2 className="display text-3xl md:text-4xl lg:text-5xl tracking-tight text-balance leading-tight">
            {t('title')}
          </h2>
        </Reveal>

        {/* Always two columns — mobile included */}
        <div className="grid grid-cols-2 gap-6 md:gap-10 lg:gap-16">
          <Reveal delay={0.1} className="flex flex-col gap-4">
            <div className="relative aspect-[3/4] bg-fog/40 overflow-hidden image-frame">
              <Image
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=900"
                alt=""
                fill
                sizes="(min-width: 768px) 40vw, 50vw"
                className="object-cover"
              />
            </div>
            <p className="text-2xs uppercase tracking-[0.18em] text-graphite">
              — {t('andreasName')}, {t('role')}
            </p>
          </Reveal>

          <Reveal delay={0.2} className="flex flex-col gap-4">
            <div className="relative aspect-[3/4] bg-fog/40 overflow-hidden image-frame">
              <Image
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=900"
                alt=""
                fill
                sizes="(min-width: 768px) 40vw, 50vw"
                className="object-cover"
              />
            </div>
            <p className="text-2xs uppercase tracking-[0.18em] text-graphite">
              — {t('zachariasName')}, {t('role')}
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.3} className="mt-10 md:mt-16 max-w-2xl">
          <p className="prose-editorial drop-cap text-base md:text-lg">
            {t('body')}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
