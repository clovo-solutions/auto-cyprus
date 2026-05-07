import { Container } from '@/components/ui/Section';
import { Link } from '@/i18n/navigation';

export default function CarNotFound() {
  return (
    <Container>
      <div className="py-32 md:py-48 flex flex-col gap-6 max-w-[40rem]">
        <span className="display-italic text-mist text-7xl md:text-8xl leading-none" aria-hidden="true">
          ø
        </span>
        <h1 className="display text-4xl md:text-5xl tracking-tight">
          We couldn't find that car.
        </h1>
        <p className="text-graphite text-base md:text-lg max-w-prose">
          It may have been sold, or the link is no longer valid. Browse what's currently on the floor instead.
        </p>
        <div className="mt-2">
          <Link
            href="/cars"
            className="btn-base inline-flex items-center justify-center gap-2 font-medium tracking-[0.04em] uppercase border bg-ink text-bone hover:bg-ink-soft border-ink text-sm px-6 py-3.5 min-h-[48px] self-start"
          >
            View all cars
          </Link>
        </div>
      </div>
    </Container>
  );
}
