import { Container } from '@/components/ui/Section';

// Instant placeholder while the car detail page renders on the server.
export default function CarDetailLoading() {
  return (
    <article>
      <Container>
        <div className="pt-6 md:pt-8 h-4 w-48 skeleton" />
      </Container>

      <Container>
        <header className="pt-8 md:pt-12 pb-6 md:pb-10 grid lg:grid-cols-12 gap-6 lg:gap-8 items-end">
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="h-4 w-24 skeleton" />
            <div className="h-12 md:h-16 w-3/4 skeleton" />
          </div>
          <div className="lg:col-span-4 lg:flex lg:justify-end">
            <div className="h-10 w-40 skeleton" />
          </div>
        </header>
      </Container>

      <Container>
        <div className="aspect-[16/10] w-full skeleton" />
      </Container>

      <Container>
        <div className="mt-12 md:mt-20 grid lg:grid-cols-12 gap-12 lg:gap-16 pb-16 md:pb-24">
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
            <div className="h-4 w-32 skeleton" />
            <div className="h-4 w-full skeleton" />
            <div className="h-4 w-full skeleton" />
            <div className="h-4 w-5/6 skeleton" />
            <div className="mt-8 h-64 w-full skeleton" />
          </div>
          <aside className="lg:col-span-5 xl:col-span-4">
            <div className="h-96 w-full skeleton" />
          </aside>
        </div>
      </Container>
    </article>
  );
}
