import { Marquee } from '@/components/motion/Marquee';
import { Container } from '@/components/ui/Section';
import type { Locale } from '@/i18n/config';

interface BrandWallProps {
  locale: Locale;
}

const brands = [
  'BMW',
  'Mercedes-Benz',
  'Audi',
  'Porsche',
  'Tesla',
  'Volvo',
  'Lexus',
  'Range Rover',
  'Volkswagen',
  'Mini',
  'Genesis',
  'Toyota',
  'Honda',
  'Hyundai',
];

export function BrandWall({ locale: _locale }: BrandWallProps) {
  const eyebrow = 'Brands on the floor';

  return (
    <section className="relative bg-bone py-16 md:py-20 border-y border-rule-light overflow-hidden">
      <Container>
        <div className="flex items-center gap-4 mb-8 md:mb-10">
          <span className="block w-12 h-px bg-accent" aria-hidden="true" />
          <span className="eyebrow">{eyebrow}</span>
        </div>
      </Container>

      {/* Full-bleed marquee outside the container */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-full w-28 md:w-40 z-10"
        style={{ background: 'linear-gradient(to right, var(--color-bone) 0%, transparent 100%)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-full w-28 md:w-40 z-10"
        style={{ background: 'linear-gradient(to left, var(--color-bone) 0%, transparent 100%)' }}
      />
      <Marquee duration={60}>
        {brands.map((brand, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-12 px-12 text-graphite hover:text-ink transition-colors duration-300"
          >
            <span className="display-italic text-3xl md:text-5xl tracking-tight whitespace-nowrap">
              {brand}
            </span>
            <span className="text-mist display-italic text-3xl md:text-5xl" aria-hidden="true">
              ·
            </span>
          </span>
        ))}
      </Marquee>
    </section>
  );
}
