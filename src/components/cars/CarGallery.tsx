'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ExpandIcon } from '@/components/icons';
import { CarLightbox } from './CarLightbox';
import { cn } from '@/lib/cn';

interface GalleryImage {
  url: string;
  heroUrl?: string | null;
  alt: string;
}

interface CarGalleryProps {
  images: GalleryImage[];
  status?: 'available' | 'reserved' | 'sold';
}

export function CarGallery({ images, status }: CarGalleryProps) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const t = useTranslations('carDetail.gallery');

  if (images.length === 0) {
    return (
      <div className="aspect-cinema bg-fog/40 grid place-items-center text-mist text-sm">
        No images
      </div>
    );
  }

  const main = images[active];
  if (!main) {
    return null;
  }

  const open = () => setLightboxOpen(true);
  const close = () => setLightboxOpen(false);
  const next = () => setActive((i) => (i + 1) % images.length);
  const prev = () => setActive((i) => (i - 1 + images.length) % images.length);

  return (
    <div className="flex flex-col gap-4">
      {/* Hero */}
      <button
        type="button"
        onClick={open}
        className="image-frame relative aspect-cinema bg-fog/40 group focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 cursor-zoom-in"
        aria-label={t('open')}
      >
        <Image
          src={main.heroUrl || main.url}
          alt={main.alt}
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          priority
          className={cn(
            'object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]',
            status === 'sold' && 'opacity-70 grayscale',
          )}
        />
        <span className="absolute top-4 right-4 z-2 inline-flex items-center gap-1.5 bg-bone/90 backdrop-blur-sm px-3 py-1.5 text-2xs uppercase tracking-[0.18em] text-ink">
          <ExpandIcon size={14} />
          <span>{active + 1} / {images.length}</span>
        </span>
      </button>

      {/* Thumbnails */}
      {images.length > 1 ? (
        <div className="grid grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2 md:gap-3">
          {images.slice(0, 16).map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                'relative aspect-square bg-fog/40 transition-opacity duration-150',
                i === active ? 'opacity-100' : 'opacity-60 hover:opacity-100',
              )}
              aria-label={`Photo ${i + 1}`}
              aria-pressed={i === active}
            >
              <Image
                src={img.url}
                alt=""
                fill
                sizes="120px"
                className="object-cover"
              />
              {i === active ? (
                <span className="absolute inset-0 ring-2 ring-ink ring-inset" aria-hidden="true" />
              ) : null}
            </button>
          ))}
        </div>
      ) : null}

      {lightboxOpen ? (
        <CarLightbox
          images={images.map((img) => ({ url: img.heroUrl || img.url, alt: img.alt }))}
          currentIndex={active}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      ) : null}
    </div>
  );
}
