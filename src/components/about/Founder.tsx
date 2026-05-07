import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Container } from '@/components/ui/Section';
import type { Locale } from '@/i18n/config';

interface FounderProps {
  locale: Locale;
}

export async function Founder({ locale }: FounderProps) {
  const t = await getTranslations({ locale, namespace: 'about.founder' });

  return (
    <section className="bg-bone py-20 md:py-32">
      <Container>
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-5 lg:order-2">
            <div className="image-frame relative aspect-portrait bg-fog/40 overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=900"
                alt=""
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="lg:col-span-7 lg:order-1">
            <span className="eyebrow text-graphite mb-4 block">{t('eyebrow')}</span>
            <h2 className="display text-3xl md:text-4xl lg:text-5xl tracking-tight text-balance leading-tight">
              {t('title')}
            </h2>
            <p className="prose-editorial mt-8 drop-cap text-base md:text-lg">
              {t('body')}
            </p>
            <p className="mt-8 text-2xs uppercase tracking-[0.18em] text-graphite">
              — {t('signature')}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
