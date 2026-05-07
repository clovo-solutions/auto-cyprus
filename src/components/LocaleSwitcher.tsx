'use client';

import { usePathname, useRouter } from '@/i18n/navigation';
import { locales, localeShortLabels, type Locale } from '@/i18n/config';
import { useLocale } from 'next-intl';
import { cn } from '@/lib/cn';

interface LocaleSwitcherProps {
  className?: string;
  onDark?: boolean;
}

export function LocaleSwitcher({ className, onDark = false }: LocaleSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  const current = useLocale() as Locale;

  const handleSelect = (locale: Locale) => {
    if (locale === current) {
      return;
    }
    router.replace(pathname, { locale });
  };

  return (
    <div
      className={cn('flex items-center gap-1', className)}
      role="group"
      aria-label="Language"
    >
      {locales.map((loc, i) => {
        const isActive = loc === current;
        return (
          <span key={loc} className="flex items-center">
            {i > 0 ? (
              <span
                aria-hidden="true"
                className={cn(
                  'mx-1 select-none',
                  onDark ? 'text-mist' : 'text-mist',
                )}
              >
                ·
              </span>
            ) : null}
            <button
              type="button"
              onClick={() => handleSelect(loc)}
              className={cn(
                'text-2xs tracking-[0.18em] uppercase transition-opacity duration-150',
                'min-h-[44px] px-2 py-2',
                onDark
                  ? isActive
                    ? 'text-bone font-medium'
                    : 'text-mist hover:text-bone'
                  : isActive
                    ? 'text-ink font-medium'
                    : 'text-graphite hover:text-ink',
              )}
              aria-current={isActive ? 'true' : undefined}
              aria-label={`Switch language to ${loc}`}
            >
              {localeShortLabels[loc]}
            </button>
          </span>
        );
      })}
    </div>
  );
}
