import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { isLocale } from '@/i18n/config';
import { Container } from '@/components/ui/Section';
import { CarCard } from '@/components/cars/CarCard';
import { FilterSidebar } from '@/components/cars/FilterSidebar';
import { MobileFilterSheet } from '@/components/cars/MobileFilterSheet';
import { SortMenu } from '@/components/cars/SortMenu';
import { Pagination } from '@/components/cars/Pagination';
import { CarsEmptyState } from '@/components/cars/CarsEmptyState';
import { findCars, findAllBrands } from '@/lib/cars';
import { parseFilters, countActiveFilters } from '@/lib/filters';
import { buildAlternates } from '@/lib/seo';

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) {
    return {};
  }
  const t = await getTranslations({ locale, namespace: 'seo.cars' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: buildAlternates('/cars', locale),
  };
}

export default async function CarsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const search = await searchParams;
  const filters = parseFilters(search);
  const t = await getTranslations({ locale, namespace: 'cars' });
  const tFilters = await getTranslations({ locale, namespace: 'cars.filters' });

  const [brands, result] = await Promise.all([
    findAllBrands(locale),
    findCars(locale, filters),
  ]);

  const activeCount = countActiveFilters(filters);

  return (
    <>
      {/* Page header */}
      <section className="bg-bone pt-12 md:pt-20 pb-10 md:pb-16">
        <Container>
          <div className="flex items-center gap-3 mb-6">
            <span className="block w-12 h-px bg-ink" aria-hidden="true" />
            <span className="eyebrow">Inventory · Live</span>
          </div>
          <h1 className="display text-4xl md:text-6xl lg:text-7xl tracking-tight text-balance">
            {t('title')}
          </h1>
          <p className="mt-6 text-graphite text-base md:text-lg max-w-[44ch] text-pretty">
            {t('sub')}
          </p>
        </Container>
      </section>

      {/* Listing layout */}
      <section className="bg-bone pb-24">
        <Container>
          <div className="grid lg:grid-cols-[260px_1fr] gap-12 lg:gap-16">
            {/* Sidebar — desktop only */}
            <aside
              className="hidden lg:block sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto pr-2"
              aria-label={tFilters('title')}
            >
              <FilterSidebar brands={brands} filters={filters} />
            </aside>

            <div>
              {/* Top bar — mobile filter trigger + sort + result count */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 md:pb-8 border-b border-rule-light">
                <div className="flex items-center gap-3">
                  <MobileFilterSheet brands={brands} filters={filters} />
                  <p className="text-2xs uppercase tracking-[0.18em] text-graphite">
                    {tFilters('results', { count: result.totalDocs })}
                    {activeCount > 0 ? (
                      <span className="ml-3 text-graphite">
                        · {tFilters('active', { count: activeCount })}
                      </span>
                    ) : null}
                  </p>
                </div>
                <SortMenu current={filters.sort} />
              </div>

              {result.docs.length === 0 ? (
                <CarsEmptyState />
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12 md:gap-y-16 mt-10 md:mt-12">
                    {result.docs.map((car, i) => (
                      <CarCard key={car.id} car={car} locale={locale} index={i} priority={i < 3} />
                    ))}
                  </div>
                  <Pagination page={result.page} totalPages={result.totalPages} />
                </>
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
