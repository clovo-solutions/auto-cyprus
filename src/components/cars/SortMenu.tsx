'use client';

import { useTransition } from 'react';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Select } from '@/components/ui/Input';
import { SORT_KEYS, type SortKey } from '@/lib/filters';

interface SortMenuProps {
  current: SortKey;
}

export function SortMenu({ current }: SortMenuProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const t = useTranslations('cars.sort');
  const [pending, startTransition] = useTransition();

  const handleChange = (value: string) => {
    const sp = new URLSearchParams(params.toString());
    if (value === 'newest') {
      sp.delete('sort');
    } else {
      sp.set('sort', value);
    }
    sp.delete('page');
    const qs = sp.toString();
    startTransition(() => {
      router.replace(`${pathname}${qs ? `?${qs}` : ''}`);
    });
  };

  return (
    <label className="flex items-center gap-3 text-sm">
      <span className="eyebrow text-graphite">{t('label')}</span>
      <Select
        value={current}
        onChange={(e) => handleChange(e.target.value)}
        disabled={pending}
        className="!py-2 !text-sm min-w-[180px]"
        aria-label={t('label')}
      >
        {SORT_KEYS.map((key) => (
          <option key={key} value={key}>
            {t(key)}
          </option>
        ))}
      </Select>
    </label>
  );
}
