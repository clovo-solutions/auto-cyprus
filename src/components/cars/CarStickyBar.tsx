'use client';

import { useTranslations } from 'next-intl';
import { PhoneIcon, WhatsappIcon } from '@/components/icons';
import { phoneHref } from '@/lib/site';
import { buildWhatsAppLink } from '@/lib/whatsapp';

interface CarStickyBarProps {
  carTitle: string;
  priceLabel: string;
  inquiryHref?: string;
}

export function CarStickyBar({ carTitle, priceLabel, inquiryHref = '#inquire' }: CarStickyBarProps) {
  const t = useTranslations('carDetail');
  const waLink = buildWhatsAppLink(`Hi, I'm interested in the ${carTitle} (${priceLabel})`);

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-bone border-t border-rule-light shadow-[0_-2px_24px_rgba(14,17,22,0.08)] safe-bottom">
      <div className="flex items-stretch h-16">
        <div className="flex-1 flex flex-col justify-center px-4 border-r border-rule-light">
          <p className="text-2xs uppercase tracking-[0.18em] text-graphite truncate">{carTitle}</p>
          <p className="display-italic text-lg leading-tight text-ink">{priceLabel}</p>
        </div>
        <a
          href={phoneHref()}
          className="flex flex-col items-center justify-center px-4 text-ink min-w-[60px] border-r border-rule-light hover:bg-ink/5 transition-colors"
          aria-label={t('stickyCall')}
        >
          <PhoneIcon size={20} />
          <span className="text-2xs mt-1 tracking-wider uppercase">{t('stickyCall')}</span>
        </a>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center px-4 bg-ink text-bone min-w-[100px]"
        >
          <WhatsappIcon size={20} />
          <span className="text-2xs mt-1 tracking-wider uppercase">{t('stickyInquire')}</span>
        </a>
      </div>
    </div>
  );
}
