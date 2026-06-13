'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { CloseIcon, MenuIcon, PhoneIcon, WhatsappIcon, MailIcon } from '@/components/icons';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { Logo } from './Logo';
import { cn } from '@/lib/cn';
import { phoneHref, emailHref, whatsappHref, site } from '@/lib/site';

const items = [
  { href: '/cars', key: 'cars' as const },
  { href: '/sell', key: 'sell' as const },
  { href: '/about', key: 'about' as const },
  { href: '/contact', key: 'contact' as const },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');

  // Mirror `open` into a ref so the route-change effect below can tell whether
  // the navigation was triggered from inside the open menu.
  const openRef = useRef(false);
  useEffect(() => {
    openRef.current = open;
  }, [open]);

  useEffect(() => {
    const cameFromMenu = openRef.current;
    setOpen(false);
    if (!cameFromMenu) return;

    // The menu locks body scroll, which suppresses the router's automatic
    // scroll-to-top on mobile. Release the lock immediately, then force the
    // new page to the top *after* it paints (two frames out) so nothing — the
    // route commit, the loading skeleton, or scroll restoration — resets it.
    document.body.style.overflow = '';
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [pathname]);

  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="md:hidden flex items-center justify-center min-h-[44px] min-w-[44px] -mr-2 text-ink"
        aria-label={tCommon('menu')}
        aria-expanded={open}
      >
        <MenuIcon size={22} />
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[100] md:hidden isolate"
          role="dialog"
          aria-modal="true"
          aria-label={tCommon('menu')}
          style={{ height: '100dvh' }}
        >
          <div
            className="absolute inset-0"
            onClick={() => setOpen(false)}
            aria-hidden="true"
            style={{
              backgroundColor: 'rgba(14, 17, 22, 0.55)',
              backdropFilter: 'blur(3px)',
              WebkitBackdropFilter: 'blur(3px)',
            }}
          />
          <div
            className="absolute right-0 top-0 w-full max-w-[440px] flex flex-col"
            style={{
              backgroundColor: '#f7f6f1',
              boxShadow: '-12px 0 40px rgba(14, 17, 22, 0.18)',
              height: '100dvh',
            }}
          >
            <div
              className="flex items-center justify-between px-5 py-5 border-b border-rule-light shrink-0"
              style={{ backgroundColor: '#f7f6f1' }}
            >
              <Logo />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center min-h-[44px] min-w-[44px] -mr-2 text-ink"
                aria-label={tCommon('close')}
              >
                <CloseIcon size={22} />
              </button>
            </div>

            <nav
              className="flex-1 min-h-0 overflow-y-auto px-5 py-8"
              style={{ backgroundColor: '#f7f6f1' }}
            >
              <ul className="flex flex-col">
                {items.map((item, i) => {
                  const isActive = pathname.endsWith(item.href);
                  return (
                    <li
                      key={item.href}
                      className="border-b border-rule-light first:border-t"
                    >
                      <Link
                        href={item.href}
                        onClick={() => {
                          // Unlock body scroll synchronously, before the route
                          // commits, so the router's scroll-to-top can apply.
                          document.body.style.overflow = '';
                        }}
                        className={cn(
                          'flex items-baseline justify-between py-6 group',
                          'text-3xl display tracking-tight',
                          isActive ? 'text-ink' : 'text-ink hover:opacity-70',
                        )}
                      >
                        <span className="flex items-baseline gap-3">
                          <span className="index-numeral text-base text-graphite">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span>{t(item.key)}</span>
                        </span>
                        <span
                          aria-hidden="true"
                          className="text-accent text-base transition-transform duration-300 group-hover:translate-x-1"
                        >
                          →
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div
              className="px-5 py-6 border-t border-rule-light flex flex-col gap-4 safe-bottom shrink-0"
              style={{ backgroundColor: '#f7f6f1' }}
            >
              <div className="flex flex-col gap-3">
                <a
                  href={phoneHref()}
                  className="flex items-center gap-3 text-sm tracking-wide text-ink hover:opacity-70 transition-opacity duration-150"
                >
                  <PhoneIcon size={16} />
                  <span className="tabular-nums">{site.phone}</span>
                </a>
                <a
                  href={whatsappHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm tracking-wide text-ink hover:opacity-70 transition-opacity duration-150"
                >
                  <WhatsappIcon size={16} />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={emailHref()}
                  className="flex items-center gap-3 text-sm tracking-wide text-ink hover:opacity-70 transition-opacity duration-150"
                >
                  <MailIcon size={16} />
                  <span className="truncate">{site.email}</span>
                </a>
              </div>
              <div className="pt-4 border-t border-rule-light">
                <LocaleSwitcher />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}