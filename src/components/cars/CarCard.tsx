import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { type Locale } from '@/i18n/config';
import { formatPrice, formatNumber } from '@/lib/format';
import { cn } from '@/lib/cn';
import type { Car } from '@/payload-types';
import { ArrowUpRightIcon } from '@/components/icons';

interface CarCardProps {
  car: Car;
  locale: Locale;
  priority?: boolean;
  index?: number;
}

function getCardImage(car: Car): { url: string; alt: string } | null {
  const first = car.images?.[0];
  if (!first) {
    return null;
  }
  const image = first.image;
  if (!image || typeof image !== 'object') {
    return null;
  }
  const sizes = 'sizes' in image ? image.sizes : null;
  const cardSize = sizes?.card?.url;
  const baseUrl = cardSize || image.url;
  if (!baseUrl) {
    return null;
  }
  const alt = first.alt || image.alt || car.title || 'Car photo';
  return { url: baseUrl, alt };
}

export async function CarCard({ car, locale, priority = false, index = 0 }: CarCardProps) {
  const t = await getTranslations({ locale, namespace: 'cars' });
  const tCard = await getTranslations({ locale, namespace: 'cars.card' });
  const image = getCardImage(car);

  const isSold = car.status === 'sold';
  const isReserved = car.status === 'reserved';

  return (
    <article className="group relative">
      <Link
        href={`/cars/${car.slug}`}
        className="flex flex-col gap-4"
        aria-label={`${car.title} — ${tCard('view')}`}
      >
        <div className="image-frame relative aspect-[4/3] bg-fog/40 overflow-hidden">
          {image ? (
            <Image
              src={image.url}
              alt={image.alt}
              fill
              sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
              priority={priority}
              className={cn(
                'object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
                'group-hover:scale-[1.06]',
                isSold && 'opacity-60 grayscale',
              )}
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-mist text-xs">
              No image
            </div>
          )}

          {isSold ? (
            <span className="corner-stamp corner-stamp-sold">{t('status.sold')}</span>
          ) : isReserved ? (
            <span className="corner-stamp corner-stamp-reserved">{t('status.reserved')}</span>
          ) : null}

          {/* Index numeral, top-right — slides up + fades on hover, replaced by arrow */}
          <span
            aria-hidden="true"
            className="absolute top-3 right-3 z-2 index-numeral text-bone text-sm mix-blend-difference transition-all duration-500 group-hover:-translate-y-1 group-hover:opacity-0"
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <span
            aria-hidden="true"
            className="absolute top-3 right-3 z-2 inline-flex items-center justify-center w-8 h-8 bg-bone text-ink rounded-full opacity-0 translate-y-1 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0"
          >
            <ArrowUpRightIcon size={14} />
          </span>

          {/* Bottom gradient veil that intensifies on hover */}
          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        </div>

        <div className="flex flex-col gap-3 px-1">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-lg md:text-xl font-medium tracking-tight text-ink leading-tight text-balance">
              <span className="reveal-rule">{car.title}</span>
            </h3>
            <p className="display-italic text-ink text-xl md:text-2xl whitespace-nowrap tabular-nums">
              {car.priceOnRequest ? (
                <span className="text-base text-graphite italic">{tCard('onRequest')}</span>
              ) : (
                formatPrice(car.price, locale)
              )}
            </p>
          </div>

          <dl className="flex items-center gap-x-5 gap-y-1 flex-wrap text-xs text-graphite tracking-wide">
            <div className="flex items-baseline gap-1.5">
              <dt className="sr-only">Year</dt>
              <dd className="tabular-nums">{car.year}</dd>
            </div>
            <span aria-hidden="true" className="text-mist">·</span>
            <div className="flex items-baseline gap-1.5">
              <dt className="sr-only">Mileage</dt>
              <dd className="tabular-nums">
                {formatNumber(car.mileage, locale)}
                <span className="ml-0.5 text-mist">{tCard('kmShort')}</span>
              </dd>
            </div>
            <span aria-hidden="true" className="text-mist">·</span>
            <div className="flex items-baseline gap-1.5">
              <dt className="sr-only">Transmission</dt>
              <dd>{t(`transmission.${car.transmission}`)}</dd>
            </div>
            <span aria-hidden="true" className="text-mist">·</span>
            <div className="flex items-baseline gap-1.5">
              <dt className="sr-only">Fuel</dt>
              <dd>{t(`fuel.${car.fuelType}`)}</dd>
            </div>
          </dl>
        </div>
      </Link>
    </article>
  );
}

export function CarCardSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="aspect-[4/3] skeleton" />
      <div className="flex flex-col gap-2 px-1">
        <div className="h-5 w-2/3 skeleton" />
        <div className="h-3 w-1/2 skeleton" />
      </div>
    </div>
  );
}
