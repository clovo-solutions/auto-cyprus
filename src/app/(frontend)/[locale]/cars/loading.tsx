import { Container } from '@/components/ui/Section';
import { CarCardSkeleton } from '@/components/cars/CarCard';

// Shown instantly while the inventory page renders on the server (DB queries +
// RSC). Without this, navigating to /cars blocks on the full server render
// before anything paints.
export default function CarsLoading() {
  return (
    <>
      {/* Page header */}
      <section className="bg-bone pt-12 md:pt-20 pb-10 md:pb-16">
        <Container>
          <div className="flex items-center gap-3 mb-6">
            <span className="block w-12 h-px bg-ink" aria-hidden="true" />
            <span className="eyebrow">Inventory · Live</span>
          </div>
          <div className="h-12 md:h-20 w-2/3 max-w-xl skeleton" />
          <div className="mt-6 h-5 w-full max-w-[44ch] skeleton" />
        </Container>
      </section>

      {/* Listing layout */}
      <section className="bg-bone pb-24">
        <Container>
          <div className="grid lg:grid-cols-[260px_1fr] gap-12 lg:gap-16">
            {/* Sidebar — desktop only */}
            <aside className="hidden lg:flex flex-col gap-6" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <div className="h-4 w-1/2 skeleton" />
                  <div className="h-9 w-full skeleton" />
                </div>
              ))}
            </aside>

            <div>
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 md:pb-8 border-b border-rule-light">
                <div className="h-4 w-32 skeleton" />
                <div className="h-9 w-40 skeleton" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12 md:gap-y-16 mt-10 md:mt-12">
                {Array.from({ length: 6 }).map((_, i) => (
                  <CarCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
