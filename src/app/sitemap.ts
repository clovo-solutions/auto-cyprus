import type { MetadataRoute } from 'next';
import { locales, defaultLocale, localeToBcp47 } from '@/i18n/config';
import { SITE_URL, localizedUrl } from '@/lib/seo';
import { getPayloadClient } from '@/lib/payload';
import type { Car } from '@/payload-types';

interface SitemapEntry {
  url: string;
  lastModified?: Date;
  changeFrequency?:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never';
  priority?: number;
  alternates?: { languages: Record<string, string> };
}

function alternatesFor(path: string): { languages: Record<string, string> } {
  const languages: Record<string, string> = {};
  for (const loc of locales) {
    languages[localeToBcp47[loc]] = localizedUrl(loc, path);
  }
  languages['x-default'] = localizedUrl(defaultLocale, path);
  return { languages };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = ['/', '/cars', '/sell', '/about', '/contact'];
  const now = new Date();

  const staticEntries: SitemapEntry[] = staticPaths.flatMap((path) =>
    locales.map((loc) => ({
      url: localizedUrl(loc, path),
      lastModified: now,
      changeFrequency: path === '/cars' || path === '/' ? ('daily' as const) : ('weekly' as const),
      priority: path === '/' ? 1.0 : 0.8,
      alternates: alternatesFor(path),
    })),
  );

  // Cars — only include non-sold cars in the sitemap. Sold cars should be
  // crawlable but not aggressively re-indexed; we drop them entirely.
  let carEntries: SitemapEntry[] = [];
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: 'cars',
      where: { status: { not_equals: 'sold' } },
      limit: 1000,
      depth: 0,
      select: { slug: true, updatedAt: true },
    });

    carEntries = (result.docs as Pick<Car, 'slug' | 'updatedAt'>[])
      .filter((doc) => typeof doc.slug === 'string' && doc.slug.length > 0)
      .flatMap((doc) =>
        locales.map((loc) => ({
          url: localizedUrl(loc, `/cars/${doc.slug}`),
          lastModified: doc.updatedAt ? new Date(doc.updatedAt) : now,
          changeFrequency: 'weekly' as const,
          priority: 0.7,
          alternates: alternatesFor(`/cars/${doc.slug}`),
        })),
      );
  } catch {
    // If DB isn't reachable at build time, return a static sitemap.
  }

  return [...staticEntries, ...carEntries];
}

export const revalidate = 3600;
