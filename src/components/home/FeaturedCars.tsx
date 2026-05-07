import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Container, Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/SectionHeader';
import { CarCard } from '@/components/cars/CarCard';
import { ArrowRightIcon } from '@/components/icons';
import { findFeaturedCars } from '@/lib/cars';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import type { Locale } from '@/i18n/config';

interface FeaturedCarsProps {
  locale: Locale;
}

export async function FeaturedCars({ locale }: FeaturedCarsProps) {
  const t = await getTranslations({ locale, namespace: 'home.featured' });
  const cars = await findFeaturedCars(locale, 6);

  if (cars.length === 0) {
    return null;
  }

  return (
    <Section tone="bone" spacing="lg">
      <Container>
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between mb-12 md:mb-16">
{/* <SectionHeader
  sub={t('sub')}
  size="md"
/> */}
          <Link
            href="/cars"
            className="group link-rule self-start text-sm tracking-wide whitespace-nowrap inline-flex items-center gap-2"
          >
            <span>{t('cta')}</span>
            <ArrowRightIcon
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        <Stagger
          staggerChildren={0.12}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14 md:gap-y-20"
        >
          {cars.map((car, i) => (
            <StaggerItem key={car.id}>
              <CarCard car={car} locale={locale} index={i} priority={i < 3} />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
