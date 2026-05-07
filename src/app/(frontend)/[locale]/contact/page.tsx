import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { isLocale, type Locale } from '@/i18n/config';
import { Container, Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/SectionHeader';
import { Reveal } from '@/components/motion/Reveal';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { ShowroomMap } from '@/components/contact/ShowroomMap';
import { ContactFormBlock } from '@/components/contact/ContactFormBlock';
import { PhoneIcon, WhatsappIcon, MailIcon, MapPinIcon } from '@/components/icons';
import { phoneHref, emailHref, whatsappHref, mapsHref, site } from '@/lib/site';
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
  const t = await getTranslations({ locale, namespace: 'seo.contact' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: buildAlternates('/contact', locale),
  };
}

export default async function ContactPage({
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

  const t = await getTranslations({ locale: typedLocale, namespace: 'contact' });

  const tiles = [
    {
      label: t('tiles.phone.label'),
      help: t('tiles.phone.help'),
      value: site.phone,
      href: phoneHref(),
      icon: <PhoneIcon size={18} />,
      external: false,
    },
    {
      label: t('tiles.whatsapp.label'),
      help: t('tiles.whatsapp.help'),
      value: site.whatsapp,
      href: whatsappHref(),
      icon: <WhatsappIcon size={18} />,
      external: true,
    },
    {
      label: t('tiles.email.label'),
      help: t('tiles.email.help'),
      value: site.email,
      href: emailHref(),
      icon: <MailIcon size={18} />,
      external: false,
    },
    {
      label: t('tiles.visit.label'),
      help: t('tiles.visit.help'),
      value: site.address,
      href: mapsHref(),
      icon: <MapPinIcon size={18} />,
      external: true,
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-bone pt-12 md:pt-20 pb-12 md:pb-16">
        <Container>
          <div className="grid lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-7">
              <Reveal>
                <div className="flex items-center gap-3 mb-6">
                  <span className="block w-12 h-px bg-ink draw-rule" aria-hidden="true" />
                  <span className="eyebrow">{t('hero.eyebrow')}</span>
                </div>
              </Reveal>
              <h1 className="display text-4xl md:text-6xl lg:text-7xl tracking-tight text-balance">
                <SplitReveal text={t('hero.headline')} delay={0.15} staggerChildren={0.04} />
              </h1>
              <Reveal delay={0.5}>
                <p className="mt-7 text-base md:text-lg text-graphite max-w-[44ch] text-pretty leading-relaxed">
                  {t('hero.sub')}
                </p>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* Map */}
      <Reveal className="overflow-hidden">
        <Container>
          <ShowroomMap />
        </Container>
      </Reveal>

      {/* Contact tiles */}
      <Section tone="bone" spacing="md">
        <Container>
          <Reveal className="mb-10">
            <SectionHeader
              eyebrow="01 / Channels"
              title="The fastest ways to reach us"
              size="md"
            />
          </Reveal>
          <ul className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-rule-light">
            {tiles.map((tile, i) => (
              <Reveal
                key={tile.label}
                delay={i * 0.1}
                as="li"
                className="bg-bone"
              >
                <a
                  href={tile.href}
                  target={tile.external ? '_blank' : undefined}
                  rel={tile.external ? 'noopener noreferrer' : undefined}
                  className="group relative block p-8 md:p-10 overflow-hidden min-h-[280px] flex flex-col gap-5"
                >
                  {/* Index numeral */}
                  <span
                    className="absolute top-4 right-5 index-numeral text-mist text-sm group-hover:text-accent transition-colors duration-500"
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <span className="text-ink">{tile.icon}</span>

                  <div>
                    <p className="eyebrow text-graphite mb-3">{tile.label}</p>
                    <p className="text-base text-ink break-words">{tile.value}</p>
                    <p className="text-xs text-graphite mt-2">{tile.help}</p>
                  </div>

                  {/* Hairlines — top draws right→left, bottom draws left→right */}
                  <span
                    className="absolute top-0 left-0 h-px w-full bg-accent scale-x-0 origin-right transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
                    aria-hidden="true"
                  />
                  <span
                    className="absolute bottom-0 left-0 h-px w-full bg-accent scale-x-0 origin-left transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
                    aria-hidden="true"
                  />
                </a>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Form */}
      <ContactFormBlock locale={typedLocale} />
    </>
  );
}
