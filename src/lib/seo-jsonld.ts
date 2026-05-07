import { site } from './site';
import { SITE_URL, SITE_NAME, localizedUrl } from './seo';
import type { Locale } from '@/i18n/config';
import type { Car, Media } from '@/payload-types';

function imgUrl(image: string | number | Media | null | undefined): string | undefined {
  if (image && typeof image === 'object' && 'url' in image && image.url) {
    return image.url.startsWith('http') ? image.url : `${SITE_URL}${image.url}`;
  }
  return undefined;
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.png`,
    sameAs: [],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: site.phone,
        email: site.email,
        contactType: 'sales',
        areaServed: 'CY',
        availableLanguage: ['English', 'Greek', 'Russian'],
      },
    ],
  };
}

export function autoDealerJsonLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    '@id': `${SITE_URL}/#dealer`,
    name: SITE_NAME,
    url: localizedUrl(locale, '/'),
    telephone: site.phone,
    email: site.email,
    image: `${SITE_URL}/og.jpg`,
    priceRange: '€€€',
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address,
      addressLocality: 'Limassol',
      addressCountry: 'CY',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: site.geo.lat,
      longitude: site.geo.lng,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '19:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '10:00',
        closes: '16:00',
      },
    ],
    areaServed: {
      '@type': 'Country',
      name: 'Cyprus',
    },
  };
}

export function carJsonLd(car: Car, locale: Locale) {
  const url = localizedUrl(locale, `/cars/${car.slug}`);
  const firstImage =
    Array.isArray(car.images) && car.images.length > 0 && car.images[0]
      ? imgUrl(car.images[0].image)
      : undefined;

  const brandName =
    car.brand && typeof car.brand === 'object' && 'name' in car.brand
      ? car.brand.name
      : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'Car',
    '@id': url,
    url,
    name: car.title,
    description:
      typeof car.description === 'string'
        ? car.description
        : `${brandName ?? ''} ${car.model ?? ''}`.trim(),
    image: firstImage,
    brand: brandName
      ? {
          '@type': 'Brand',
          name: brandName,
        }
      : undefined,
    model: car.model,
    vehicleModelDate: String(car.year),
    vehicleIdentificationNumber: car.vin,
    mileageFromOdometer: {
      '@type': 'QuantitativeValue',
      value: car.mileage,
      unitCode: 'KMT',
    },
    fuelType: car.fuelType,
    vehicleTransmission: car.transmission,
    bodyType: car.bodyType,
    color: car.color,
    offers: car.priceOnRequest
      ? undefined
      : {
          '@type': 'Offer',
          priceCurrency: 'EUR',
          price: car.price,
          availability:
            car.status === 'available'
              ? 'https://schema.org/InStock'
              : car.status === 'reserved'
                ? 'https://schema.org/LimitedAvailability'
                : 'https://schema.org/SoldOut',
          seller: {
            '@id': `${SITE_URL}/#dealer`,
          },
        },
  };
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; url: string }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
