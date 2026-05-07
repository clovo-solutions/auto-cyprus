import { CountUp } from '@/components/motion/CountUp';
import type { Locale } from '@/i18n/config';

interface HeroDashboardProps {
  inventoryCount: number;
  locale: Locale;
}

interface Gauge {
  label: string;
  value: number | string;
  unit?: string;
  format?: 'count' | 'plain';
}

/**
 * Four gauges at the bottom of the hero, like a watch dial / instrument cluster.
 * Each gauge sits inside a thin circular rule with the value centred — the
 * label sits below the circle in eyebrow type. Reads as "we know what
 * matters about a car" without spelling it out.
 *
 * Server component — no animation state, but the CountUp inside is client.
 */
export function HeroDashboard({ inventoryCount, locale }: HeroDashboardProps) {
  const labels = {
    en: { stock: 'In stock', inspection: 'Inspection', since: 'Since', customers: 'Customers' },
    gr: { stock: 'Στόλος', inspection: 'Έλεγχος', since: 'Από', customers: 'Πελάτες' },
    ru: { stock: 'В наличии', inspection: 'Проверка', since: 'С', customers: 'Клиентов' },
  } as const;
  const l = labels[locale];

  const gauges: Gauge[] = [
    { label: l.stock, value: inventoryCount, format: 'count', unit: '' },
    { label: l.inspection, value: 100, format: 'count', unit: 'pt' },
    { label: l.since, value: 2013, format: 'plain' },
    { label: l.customers, value: 3000, format: 'count', unit: '+' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-rule-light">
      {gauges.map((g) => (
        <div
          key={g.label}
          className="bg-bone flex flex-col items-center justify-center gap-4 py-10 md:py-12 px-4"
        >
          {/* The gauge — a hairline circle with the value at its center */}
          <div className="relative flex items-center justify-center w-[88px] h-[88px] md:w-[112px] md:h-[112px]">
            {/* Outer ring */}
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full border border-ink/15"
            />
            {/* Tick at 12 o'clock — small accent detail */}
            <span
              aria-hidden="true"
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 block w-px h-2 bg-accent"
            />
            {/* Tick at 6 o'clock */}
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 block w-px h-2 bg-ink/15"
            />
            <p className="display-italic text-ink text-3xl md:text-4xl tabular-nums leading-none">
              {g.format === 'count' ? (
                <>
                  <CountUp value={g.value as number} duration={1800} />
                  {g.unit ? <span className="text-mist text-base">{g.unit}</span> : null}
                </>
              ) : (
                <>{g.value}</>
              )}
            </p>
          </div>

          <div className="text-center">
            <p className="eyebrow text-graphite">{g.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}