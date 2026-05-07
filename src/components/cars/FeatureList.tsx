import type { Car } from '@/payload-types';

interface FeatureListProps {
  features: NonNullable<Car['features']>;
}

export function FeatureList({ features }: FeatureListProps) {
  if (!features || features.length === 0) {
    return null;
  }

  return (
    <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5 text-sm leading-relaxed">
      {features.map((f, i) => (
        <li key={i} className="flex items-baseline gap-2.5 text-ink-soft">
          <span className="text-accent shrink-0" aria-hidden="true">—</span>
          <span>{f.feature}</span>
        </li>
      ))}
    </ul>
  );
}
