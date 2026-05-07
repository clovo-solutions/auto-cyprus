export const locales = ['en', 'gr', 'ru'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeLabels: Record<Locale, string> = {
  en: 'English',
  gr: 'Ελληνικά',
  ru: 'Русский',
};

export const localeShortLabels: Record<Locale, string> = {
  en: 'EN',
  gr: 'GR',
  ru: 'RU',
};

/**
 * Map our internal locale codes to BCP-47 tags for hreflang and Intl APIs.
 * `gr` is non-standard for Greek (the ISO code is `el`) — we use it for URL branding,
 * but anywhere a real language tag is required, we map back to `el`.
 */
export const localeToBcp47: Record<Locale, string> = {
  en: 'en-CY',
  gr: 'el-CY',
  ru: 'ru-CY',
};

export const localeToIntl: Record<Locale, string> = {
  en: 'en',
  gr: 'el',
  ru: 'ru',
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
