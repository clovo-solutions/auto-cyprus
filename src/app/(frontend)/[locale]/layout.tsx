import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google';
import { isLocale, localeToBcp47, type Locale } from '@/i18n/config';
import { routing } from '@/i18n/routing';
import { buildAlternates } from '@/lib/seo';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SplashScreen } from '@/components/ui/SplashScreen';
import { JsonLd } from '@/components/JsonLd';
import { organizationJsonLd, autoDealerJsonLd } from '@/lib/seo-jsonld';

const geistSans = Geist({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  variable: '--font-geist-sans',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin', 'latin-ext'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) {
    return {};
  }
  const t = await getTranslations({ locale, namespace: 'seo.default' });
  return {
    title: {
      default: t('title'),
      template: "%s — The AZZ's",
    },
    description: t('description'),
    alternates: buildAlternates('/', locale),
    openGraph: {
      type: 'website',
      locale: localeToBcp47[locale],
      siteName: "The AZZ's",
      title: t('title'),
      description: t('description'),
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const typedLocale: Locale = locale;

  return (
    <html
      lang={localeToBcp47[typedLocale]}
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-bone text-ink antialiased">
        <NextIntlClientProvider messages={messages}>
          <SplashScreen />
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-bone"
          >
            Skip to content
          </a>
          <Header locale={typedLocale} />
          <main id="main">{children}</main>
          <Footer locale={typedLocale} />
        </NextIntlClientProvider>
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={autoDealerJsonLd(typedLocale)} />
      </body>
    </html>
  );
}
