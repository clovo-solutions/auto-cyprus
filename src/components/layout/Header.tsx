'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
// import { Container } from '@/components/ui/Section';
import { Logo } from './Logo';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { MobileNav } from './MobileNav';
import { PhoneIcon } from '@/components/icons';
import { site, phoneHref } from '@/lib/site';
import type { Locale } from '@/i18n/config';
import { cn } from '@/lib/cn';

interface HeaderProps {
  locale: Locale;
}

const items = [
  { href: '/cars', key: 'cars' as const },
  { href: '/sell', key: 'sell' as const },
  { href: '/about', key: 'about' as const },
  { href: '/contact', key: 'contact' as const },
];

export function Header({ locale: _locale }: HeaderProps) {
  const t = useTranslations('nav');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-all duration-300',
        scrolled
          ? 'bg-bone/95 backdrop-blur-md border-b border-rule-light shadow-[0_2px_24px_rgba(14,17,22,0.04)]'
          : 'bg-bone/90 backdrop-blur-sm border-b border-transparent',
      )}
    >
<div className="container-page">
        <div
          className={cn(
            'flex items-center justify-between transition-all duration-300',
            scrolled ? 'h-14 md:h-16' : 'h-16 md:h-20',
          )}
        >
          <div className="flex-1 md:flex-none">
            <Logo />
          </div>

          <nav aria-label="Main" className="hidden md:flex items-center gap-9 text-sm">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative text-ink hover:text-ink transition-colors duration-150 tracking-wide py-1"
              >
                <span>{t(item.key)}</span>
                <span
                  className="absolute -bottom-0.5 left-0 right-0 h-px bg-ink scale-x-0 origin-left transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-6">
            <a
              href={phoneHref()}
              className="flex items-center gap-2 text-sm tracking-wide hover:opacity-70 transition-opacity duration-150 tabular-nums"
            >
              <PhoneIcon size={14} />
              <span>{site.phone}</span>
            </a>
            <span className="text-mist" aria-hidden="true">·</span>
            <LocaleSwitcher />
          </div>

          <MobileNav />
        </div>
      </div>
    </header>
  );
}
