'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { CloseIcon, ChevronLeftIcon, ChevronRightIcon } from '@/components/icons';

interface LightboxImage {
  url: string;
  alt: string;
}

interface CarLightboxProps {
  images: LightboxImage[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function CarLightbox({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: CarLightboxProps) {
  const t = useTranslations('carDetail.gallery');
  const tCommon = useTranslations('common');

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      if (e.key === 'ArrowLeft') {
        onPrev();
      }
      if (e.key === 'ArrowRight') {
        onNext();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose, onPrev, onNext]);

  const current = images[currentIndex];
  if (!current) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-ink/95 flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery"
    >
      <div className="flex items-center justify-between px-5 py-4 text-bone">
        <span className="text-2xs uppercase tracking-[0.18em] text-mist">
          {currentIndex + 1} {t('of')} {images.length}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="flex items-center justify-center min-h-[44px] min-w-[44px] -mr-2"
          aria-label={tCommon('close')}
        >
          <CloseIcon size={22} />
        </button>
      </div>

      <div className="relative flex-1 flex items-center justify-center px-4 pb-4">
        <button
          type="button"
          onClick={onPrev}
          className="absolute left-3 md:left-6 z-10 p-3 text-bone hover:opacity-70 transition-opacity"
          aria-label={t('previous')}
        >
          <ChevronLeftIcon size={28} />
        </button>

        <div className="relative w-full max-w-[1400px] h-full flex items-center justify-center">
          <Image
            src={current.url}
            alt={current.alt}
            width={1600}
            height={1200}
            className="object-contain max-h-[80vh] w-auto h-auto"
            priority
          />
        </div>

        <button
          type="button"
          onClick={onNext}
          className="absolute right-3 md:right-6 z-10 p-3 text-bone hover:opacity-70 transition-opacity"
          aria-label={t('next')}
        >
          <ChevronRightIcon size={28} />
        </button>
      </div>
    </div>
  );
}
