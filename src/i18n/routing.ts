import { defineRouting } from 'next-intl/routing';
import { locales, defaultLocale } from './config';

export const routing = defineRouting({
  locales,
  defaultLocale,
  // Always prefix with locale, so /en/cars, /gr/cars, /ru/cars
  localePrefix: 'always',
  // NOTE: deliberately no `pathnames` map — URLs stay English in every locale.
});
