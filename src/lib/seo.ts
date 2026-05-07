import { locales, defaultLocale, localeToBcp47, type Locale } from '@/i18n/config';
import { site } from './site';

export const SITE_URL = site.url.replace(/\/$/, '');
export const SITE_NAME = site.name;

/**
 * Build a fully-qualified localized URL.
 * Path should start with `/` and NOT include a locale prefix.
 */
export function localizedUrl(locale: Locale, path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}/${locale}${cleanPath === '/' ? '' : cleanPath}`;
}

/**
 * Build a Next.js `metadata.alternates` block including all locales + x-default.
 * Use the same `path` for every locale (URLs are English-only across locales).
 */
export function buildAlternates(path: string, currentLocale: Locale) {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const languages: Record<string, string> = {};

  for (const loc of locales) {
    languages[localeToBcp47[loc]] = localizedUrl(loc, cleanPath);
  }
  languages['x-default'] = localizedUrl(defaultLocale, cleanPath);

  return {
    canonical: localizedUrl(currentLocale, cleanPath),
    languages,
  };
}
