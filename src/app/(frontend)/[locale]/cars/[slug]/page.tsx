import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { isLocale, type Locale } from '@/i18n/config';
import { Container } from '@/components/ui/Section';
import { CarGallery } from '@/components/cars/CarGallery';
import { SpecTable } from '@/components/cars/SpecTable';
import { FeatureList } from '@/components/cars/FeatureList';
import { InquiryForm } from '@/components/cars/InquiryForm';
import { CarStickyBar } from '@/components/cars/CarStickyBar';
import { CarCard } from '@/components/cars/CarCard';
import { JsonLd } from '@/components/JsonLd';
import { Link } from '@/i18n/navigation';
import { findCarBySlug, findSimilarCars, findAllCarSlugs } from '@/lib/cars';
import { formatPrice } from '@/lib/format';
import { buildAlternates, localizedUrl, SITE_NAME } from '@/lib/seo';
import { carJsonLd, breadcrumbJsonLd } from '@/lib/seo-jsonld';
import { issueToken } from '@/lib/inquiryToken';
import { ArrowRightIcon, PhoneIcon, WhatsappIcon, MailIcon } from '@/components/icons';
import { phoneHref, emailHref, site } from '@/lib/site';
import { buildWhatsAppLink } from '@/lib/whatsapp';
import type { Car, Media } from '@/payload-types';

export const revalidate = 300;

export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const slugs = await findAllCarSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    // DB unreachable at build time — pages will be rendered on first request
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) {
    return {};
  }
  const car = await findCarBySlug(locale, slug);
  if (!car) {
    return {};
  }

  const metaTitle = car.meta?.title || `${car.title} — ${SITE_NAME}`;
  const metaDescription =
    car.meta?.description ||
    `${car.title}. ${car.year} · ${car.mileage.toLocaleString()} km · ${car.fuelType}.`;

  const ogImage =
    car.meta?.image && typeof car.meta.image === 'object' && 'url' in car.meta.image
      ? car.meta.image.url
      : car.images?.[0]?.image && typeof car.images[0].image === 'object'
        ? (car.images[0].image as Media).sizes?.og?.url ||
          (car.images[0].image as Media).url
        : null;

  const robots =
    car.status === 'sold'
      ? { index: false, follow: true }
      : { index: true, follow: true };

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: buildAlternates(`/cars/${slug}`, locale),
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      images: ogImage ? [{ url: ogImage }] : undefined,
      type: 'website',
    },
    robots,
  };
}

function getGalleryImages(car: Car): Array<{ url: string; heroUrl?: string | null; alt: string }> {
  return (car.images ?? []).flatMap((entry) => {
    const image = entry.image;
    if (!image || typeof image !== 'object') return [];
    const baseUrl = image.url;
    if (!baseUrl) return [];
    const sizes = (image as Media).sizes;
    const heroUrl = sizes?.hero?.url || baseUrl;
    const cardUrl = sizes?.card?.url || baseUrl;
    const alt = entry.alt || image.alt || car.title || 'Car photo';
    return [{ url: cardUrl, heroUrl, alt }];
  });
}

function renderRichText(node: unknown): string {
  // Fallback rich-text-to-text helper for Lexical descriptions.
  // For proper rendering you'd use @payloadcms/richtext-lexical's renderer,
  // but for SEO-friendly summary text this is enough.
  if (!node || typeof node !== 'object') {
    return '';
  }
  const obj = node as Record<string, unknown>;
  if (typeof obj['text'] === 'string') {
    return obj['text'];
  }
  const children = Array.isArray(obj['children']) ? (obj['children'] as unknown[]) : [];
  return children.map(renderRichText).join('');
}

function getDescriptionParagraphs(car: Car): string[] {
  if (!car.description) {
    return [];
  }
  const root =
    typeof car.description === 'object' && car.description !== null && 'root' in car.description
      ? (car.description as { root: unknown }).root
      : car.description;
  if (!root || typeof root !== 'object') {
    return [];
  }
  const children = (root as { children?: unknown[] }).children ?? [];
  return children
    .map(renderRichText)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export default async function CarDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const typedLocale: Locale = locale;

  const car = await findCarBySlug(typedLocale, slug);
  if (!car) {
    notFound();
  }

  const t = await getTranslations({ locale: typedLocale, namespace: 'carDetail' });
  const tInquiry = await getTranslations({ locale: typedLocale, namespace: 'inquiry' });
  const tCars = await getTranslations({ locale: typedLocale, namespace: 'cars' });
  const tNav = await getTranslations({ locale: typedLocale, namespace: 'nav' });

  const galleryImages = getGalleryImages(car);
  const description = getDescriptionParagraphs(car);
  const similar = await findSimilarCars(typedLocale, car, 3);
  const token = issueToken();

  const brandName =
    car.brand && typeof car.brand === 'object' && 'name' in car.brand ? car.brand.name : '';

  const priceLabel = car.priceOnRequest
    ? tCars('card.onRequest')
    : formatPrice(car.price, typedLocale);

  const isAvailable = car.status === 'available';
  const isSold = car.status === 'sold';
  const isReserved = car.status === 'reserved';

  return (
    <>
      <article>
        {/* Breadcrumb */}
        <Container>
          <nav aria-label="Breadcrumb" className="pt-6 md:pt-8 text-2xs uppercase tracking-[0.18em] text-graphite">
            <ol className="flex items-center gap-2 flex-wrap">
              <li>
                <Link href="/" className="hover:text-ink transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">·</li>
              <li>
                <Link href="/cars" className="hover:text-ink transition-colors">
                  {tNav('cars')}
                </Link>
              </li>
              <li aria-hidden="true">·</li>
              <li className="text-ink">{car.title}</li>
            </ol>
          </nav>
        </Container>

        {/* Title block */}
        <Container>
          <header className="pt-8 md:pt-12 pb-6 md:pb-10 grid lg:grid-cols-12 gap-6 lg:gap-8 items-end">
            <div className="lg:col-span-8">
              <div className="flex items-center gap-3 mb-4">
                {brandName ? (
                  <span className="eyebrow">
                    {brandName}
                  </span>
                ) : null}
                {car.featured ? (
                  <>
                    <span className="text-mist" aria-hidden="true">·</span>
                    <span className="eyebrow text-accent">Featured</span>
                  </>
                ) : null}
              </div>
              <h1 className="display text-3xl md:text-5xl lg:text-6xl tracking-tight text-balance">
                {car.title}
              </h1>
            </div>
            <div className="lg:col-span-4 lg:text-right">
              <p className="display-italic text-3xl md:text-5xl text-ink whitespace-nowrap">
                {priceLabel}
              </p>
              {isAvailable ? null : (
                <p
                  className={`mt-2 text-2xs uppercase tracking-[0.18em] ${
                    isSold ? 'text-danger' : 'text-warning'
                  }`}
                >
                  {isSold ? tCars('status.sold') : tCars('status.reserved')}
                </p>
              )}
            </div>
          </header>
        </Container>

        {/* Gallery */}
        <Container>
          <CarGallery images={galleryImages} status={car.status} />
        </Container>

        {/* Status notice */}
        {!isAvailable ? (
          <Container>
            <div className="mt-8 md:mt-12 border-t border-rule-light pt-6">
              <p className="text-base text-graphite max-w-prose">
                {isSold ? t('soldNotice') : t('reservedNotice')}
              </p>
            </div>
          </Container>
        ) : null}

        {/* Body grid: specs + description + sidebar inquiry */}
        <Container>
          <div className="mt-12 md:mt-20 grid lg:grid-cols-12 gap-12 lg:gap-16 pb-16 md:pb-24">
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-12 md:gap-16">
              {/* Description */}
              {description.length > 0 ? (
                <section aria-labelledby="desc-title">
                  <span className="eyebrow text-graphite mb-4 block">
                    01 / {t('description')}
                  </span>
                  <h2 id="desc-title" className="sr-only">{t('description')}</h2>
                  <div className="prose-editorial">
                    {description.map((para, i) => (
                      <p key={i} className={i === 0 ? 'drop-cap' : ''}>
                        {para}
                      </p>
                    ))}
                  </div>
                </section>
              ) : null}

              {/* Specs */}
              <section aria-labelledby="specs-title">
                <span className="eyebrow text-graphite mb-4 block">
                  02 / {t('specs')}
                </span>
                <h2 id="specs-title" className="display text-2xl md:text-3xl tracking-tight mb-6">
                  {t('specs')}
                </h2>
                <SpecTable car={car} locale={typedLocale} />
              </section>

              {/* Features */}
              {car.features && car.features.length > 0 ? (
                <section aria-labelledby="feat-title">
                  <span className="eyebrow text-graphite mb-4 block">
                    03 / {t('features')}
                  </span>
                  <h2 id="feat-title" className="display text-2xl md:text-3xl tracking-tight mb-6">
                    {t('features')}
                  </h2>
                  <FeatureList features={car.features} />
                </section>
              ) : null}
            </div>

            {/* Sidebar inquiry */}
            <aside
              id="inquire"
              className="lg:col-span-5 xl:col-span-4"
              aria-labelledby="inq-title"
            >
              <div className="lg:sticky lg:top-24 bg-cream p-7 md:p-9 border-t-2 border-ink">
                <span className="eyebrow text-graphite mb-3 block">04 / {t('inquireTitle', { make: brandName || car.title })}</span>
                <h2 id="inq-title" className="display text-2xl md:text-3xl tracking-tight">
                  {t('inquireTitle', { make: brandName || car.title })}
                </h2>
                <p className="mt-3 text-sm text-graphite text-pretty">
                  {t('inquireSub')}
                </p>

                <div className="mt-6 flex flex-col gap-3 pb-6 border-b border-rule-light">
                  <a
                    href={phoneHref()}
                    className="inline-flex items-center gap-2 text-sm hover:opacity-70 transition-opacity"
                  >
                    <PhoneIcon size={14} />
                    <span>{site.phone}</span>
                  </a>
                  <a
                    href={buildWhatsAppLink(`Hi, I'm interested in the ${car.title}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-success hover:opacity-70 transition-opacity"
                  >
                    <WhatsappIcon size={14} />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={emailHref(`Inquiry: ${car.title}`)}
                    className="inline-flex items-center gap-2 text-sm hover:opacity-70 transition-opacity"
                  >
                    <MailIcon size={14} />
                    <span>{tInquiry('fields.email')}</span>
                  </a>
                </div>

                <div className="mt-6">
                  <InquiryForm
                    token={token}
                    carId={car.id}
                    carSlug={car.slug}
                    type="car"
                  />
                </div>
              </div>
            </aside>
          </div>
        </Container>

        {/* Similar cars */}
        {similar.length > 0 ? (
          <section className="bg-cream py-16 md:py-24 border-t border-rule-light">
            <Container>
              <div className="flex items-baseline justify-between mb-10 md:mb-12">
                <div>
                  <span className="eyebrow text-graphite mb-3 block">05 / Also</span>
                  <h2 className="display text-2xl md:text-4xl tracking-tight">
                    {t('similar')}
                  </h2>
                </div>
                <Link
                  href="/cars"
                  className="link-rule text-sm tracking-wide whitespace-nowrap"
                >
                  <span>All cars</span>
                  <ArrowRightIcon size={14} />
                </Link>
              </div>
              <div className="grid md:grid-cols-3 gap-x-8 gap-y-12">
                {similar.map((similarCar, i) => (
                  <CarCard key={similarCar.id} car={similarCar} locale={typedLocale} index={i} />
                ))}
              </div>
            </Container>
          </section>
        ) : null}
      </article>

      {/* Mobile sticky CTA bar */}
      {isAvailable ? (
        <CarStickyBar carTitle={car.title} priceLabel={priceLabel} />
      ) : null}

      {/* JSON-LD */}
      <JsonLd data={carJsonLd(car, typedLocale)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', url: localizedUrl(typedLocale, '/') },
          { name: tNav('cars'), url: localizedUrl(typedLocale, '/cars') },
          { name: car.title, url: localizedUrl(typedLocale, `/cars/${car.slug}`) },
        ])}
      />
    </>
  );
}
