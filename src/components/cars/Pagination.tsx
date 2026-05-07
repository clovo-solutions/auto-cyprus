'use client';

import { useRouter, usePathname } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons';
import { cn } from '@/lib/cn';

interface PaginationProps {
  page: number;
  totalPages: number;
}

export function Pagination({ page, totalPages }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const t = useTranslations('cars.pagination');

  if (totalPages <= 1) {
    return null;
  }

  const goTo = (target: number) => {
    const sp = new URLSearchParams(params.toString());
    if (target <= 1) {
      sp.delete('page');
    } else {
      sp.set('page', String(target));
    }
    const qs = sp.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ''}`, { scroll: true });
  };

  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  return (
    <nav
      className="flex items-center justify-between border-t border-rule-light pt-8 mt-12"
      aria-label="Pagination"
    >
      <button
        type="button"
        onClick={() => goTo(page - 1)}
        disabled={prevDisabled}
        className={cn(
          'inline-flex items-center gap-2 text-sm tracking-wide min-h-[44px] px-2',
          prevDisabled ? 'text-mist cursor-not-allowed' : 'text-ink hover:opacity-70',
        )}
        aria-label={t('prev')}
      >
        <ChevronLeftIcon size={16} />
        <span>{t('prev')}</span>
      </button>

      <span className="text-2xs uppercase tracking-[0.18em] text-graphite">
        {t('page', { page, total: totalPages })}
      </span>

      <button
        type="button"
        onClick={() => goTo(page + 1)}
        disabled={nextDisabled}
        className={cn(
          'inline-flex items-center gap-2 text-sm tracking-wide min-h-[44px] px-2',
          nextDisabled ? 'text-mist cursor-not-allowed' : 'text-ink hover:opacity-70',
        )}
        aria-label={t('next')}
      >
        <span>{t('next')}</span>
        <ChevronRightIcon size={16} />
      </button>
    </nav>
  );
}
