'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { FilterIcon, CloseIcon } from '@/components/icons';
import { FilterSidebar } from './FilterSidebar';
import type { Brand } from '@/payload-types';
import type { Filters } from '@/lib/filters';
import { countActiveFilters } from '@/lib/filters';

interface MobileFilterSheetProps {
  brands: Brand[];
  filters: Filters;
}

export function MobileFilterSheet({ brands, filters }: MobileFilterSheetProps) {
  const [open, setOpen] = useState(false);
  const t = useTranslations('cars.filters');
  const tCommon = useTranslations('common');
  const activeCount = countActiveFilters(filters);

  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 border border-ink text-sm tracking-wide min-h-[44px]"
      >
        <FilterIcon size={16} />
        <span>{t('title')}</span>
        {activeCount > 0 ? (
          <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-ink text-bone text-2xs">
            {activeCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label={t('title')}
        >
          <div
            className="absolute inset-0 filter-backdrop"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-bone max-h-[90vh] overflow-y-auto rounded-t-md shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between px-5 py-4 bg-bone border-b border-rule-light">
              <span className="display text-xl">{t('title')}</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center min-h-[44px] min-w-[44px] -mr-2"
                aria-label={tCommon('close')}
              >
                <CloseIcon size={22} />
              </button>
            </div>
            <div className="px-5 py-6 safe-bottom">
              <FilterSidebar
                brands={brands}
                filters={filters}
                onApply={() => setOpen(false)}
                layout="sheet"
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
