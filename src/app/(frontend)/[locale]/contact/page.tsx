import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { isLocale, type Locale } from '@/i18n/config';
import { Container, Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/SectionHeader';
import { ShowroomMap } from '@/components/contact/ShowroomMap';
import { ContactFormBlock } from '@/components/contact/ContactFormBlock';
import { PhoneIcon, WhatsappIcon, MailIcon, MapPinIcon, ArrowUpRightIcon } from '@/components/icons';
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
            </div>
          </div>
        </Container>
      </section>

      {/* Map */}
      <Container>
        <ShowroomMap />
      </Container>

      {/* Contact tiles */}
      <Section tone="bone" spacing="md">
        <Container>
          <SectionHeader
            eyebrow="01 / Channels"
            title="The fastest ways to reach us"
            size="md"
            className="mb-10"
          />
          <ul className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-rule-light">
            {tiles.map((tile) => (
              <li key={tile.label} className="bg-bone">
                <a
                  href={tile.href}
                  target={tile.external ? '_blank' : undefined}
                  rel={tile.external ? 'noopener noreferrer' : undefined}
                  className="block p-7 md:p-9 group hover:bg-cream transition-colors duration-200 h-full"
                >
                  <div className="flex items-start justify-between mb-6">
                    <span className="text-ink">{tile.icon}</span>
                    <ArrowUpRightIcon
                      size={14}
                      className="text-graphite group-hover:text-ink transition-colors"
                    />
                  </div>
                  <span className="eyebrow text-graphite block mb-2">{tile.label}</span>
                  <p className="text-base text-ink mb-2 break-words">{tile.value}</p>
                  <p className="text-xs text-graphite">{tile.help}</p>
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Form */}
      <ContactFormBlock locale={typedLocale} />
    </>
  );
}
