import { site, mapsHref } from '@/lib/site';
import { ArrowUpRightIcon } from '@/components/icons';

export function ShowroomMap() {
  const src = "https://www.google.com/maps?q=Azz+Brothers+Car+Dealers,+Omonoias+55,+Limassol,+Cyprus&output=embed";

  return (
    <div className="relative aspect-cinema md:aspect-[2/1] bg-fog/40 overflow-hidden">
      <iframe
        src={src}
        title="The AZZ's showroom map"
        className="absolute inset-0 w-full h-full grayscale-[40%] contrast-[1.05]"
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />
      <a
        href={mapsHref()}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-4 right-4 z-10 inline-flex items-center gap-2 bg-bone text-ink px-4 py-2.5 text-2xs uppercase tracking-[0.18em] hover:bg-ink hover:text-bone transition-colors duration-150"
      >
        <span>Open in Maps</span>
        <ArrowUpRightIcon size={14} />
      </a>
    </div>
  );
}
