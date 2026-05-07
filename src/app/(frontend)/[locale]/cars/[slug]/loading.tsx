import { Container } from '@/components/ui/Section';

export default function CarDetailLoading() {
  return (
    <Container>
      <div className="pt-12 md:pt-20 pb-24">
        <div className="h-3 w-40 skeleton mb-6" />
        <div className="grid lg:grid-cols-12 gap-8 items-end mb-10">
          <div className="lg:col-span-8 flex flex-col gap-3">
            <div className="h-3 w-24 skeleton" />
            <div className="h-12 md:h-16 w-3/4 skeleton" />
          </div>
          <div className="lg:col-span-4 lg:flex lg:justify-end">
            <div className="h-10 w-40 skeleton" />
          </div>
        </div>

        <div className="aspect-cinema skeleton mb-4" />
        <div className="grid grid-cols-6 md:grid-cols-8 gap-3 mb-12">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-square skeleton" />
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 flex flex-col gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-3 w-full skeleton" />
            ))}
          </div>
          <div className="lg:col-span-5">
            <div className="h-96 skeleton" />
          </div>
        </div>
      </div>
    </Container>
  );
}
