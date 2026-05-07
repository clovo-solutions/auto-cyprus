import { type Locale, localeToIntl } from '@/i18n/config';

function intlLocale(locale: Locale): string {
  return localeToIntl[locale];
}

export function formatPrice(
  amount: number,
  locale: Locale,
  options: { compact?: boolean } = {},
): string {
  const formatter = new Intl.NumberFormat(intlLocale(locale), {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
    notation: options.compact ? 'compact' : 'standard',
  });
  return formatter.format(amount);
}

export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(intlLocale(locale)).format(value);
}

export function formatMileage(km: number, locale: Locale, kmLabel = 'km'): string {
  const num = new Intl.NumberFormat(intlLocale(locale), {
    maximumFractionDigits: 0,
  }).format(km);
  return `${num}\u00A0${kmLabel}`;
}

export function formatDate(date: Date | string, locale: Locale): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(intlLocale(locale), {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

export function formatYear(year: number): string {
  return String(year);
}
