'use client';

import { useRouter, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';

export function CarsEmptyState() {
  const t = useTranslations('cars.empty');
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex flex-col items-center text-center py-20 md:py-28 max-w-[36rem] mx-auto">
      <span className="display-italic text-mist text-7xl md:text-8xl leading-none mb-2" aria-hidden="true">
        ø
      </span>
      <h3 className="display text-2xl md:text-3xl tracking-tight mt-4">{t('title')}</h3>
      <p className="mt-4 text-graphite max-w-[36ch] text-pretty">{t('sub')}</p>
      <div className="mt-8">
        <Button
          variant="secondary"
          onClick={() => router.replace(pathname)}
        >
          {t('reset')}
        </Button>
      </div>
    </div>
  );
}
