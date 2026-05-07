import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/config';
import type { Car } from '@/payload-types';
import { formatNumber } from '@/lib/format';

interface SpecTableProps {
  car: Car;
  locale: Locale;
}

export async function SpecTable({ car, locale }: SpecTableProps) {
  const t = await getTranslations({ locale, namespace: 'carDetail' });
  const tCars = await getTranslations({ locale, namespace: 'cars' });

  const rows: Array<{ label: string; value: string | number | null | undefined }> = [
    { label: t('specLabels.year'), value: car.year },
    { label: t('specLabels.mileage'), value: `${formatNumber(car.mileage, locale)} ${t('units.km')}` },
    { label: t('specLabels.transmission'), value: tCars(`transmission.${car.transmission}`) },
    { label: t('specLabels.fuel'), value: tCars(`fuel.${car.fuelType}`) },
    { label: t('specLabels.body'), value: tCars(`body.${car.bodyType}`) },
    { label: t('specLabels.color'), value: car.color || null },
    {
      label: t('specLabels.engine'),
      value: car.engine?.displacement ? `${car.engine.displacement} ${t('units.cc')}` : null,
    },
    {
      label: t('specLabels.power'),
      value: car.engine?.powerHp ? `${car.engine.powerHp} ${t('units.hp')}` : null,
    },
    {
      label: t('specLabels.torque'),
      value: car.engine?.torqueNm ? `${car.engine.torqueNm} ${t('units.nm')}` : null,
    },
    {
      label: t('specLabels.drive'),
      value: car.engine?.driveType ? tCars(`drive.${car.engine.driveType}`) : null,
    },
    { label: t('specLabels.vin'), value: car.vin },
  ].filter((row) => row.value !== null && row.value !== undefined && row.value !== '');

  return (
    <dl className="border-b border-rule-light">
      {rows.map((row) => (
        <div key={row.label} className="spec-row">
          <dt className="text-graphite tracking-wide">{row.label}</dt>
          <dd className="text-ink">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
