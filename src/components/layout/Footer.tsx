import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Container } from '@/components/ui/Section';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { PhoneIcon, MailIcon, MapPinIcon, WhatsappIcon } from '@/components/icons';
import { site, phoneHref, emailHref, whatsappHref, mapsHref } from '@/lib/site';
import type { Locale } from '@/i18n/config';

interface FooterProps {
  locale: Locale;
}

export async function Footer({ locale }: FooterProps) {
  const t = await getTranslations({ locale, namespace: 'footer' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });
  const year = new Date().getFullYear();

  return (
    <footer className="paper text-bone relative">
      <Container>
        {/* The big italic-serif statement at the top of the footer.
            This is the visual anchor — the brand name in lowercase
            italic serif, very large, that pulls the eye to the bottom
            of the page. */}
        <div className="pt-24 pb-12 md:pt-32 md:pb-16 border-b border-white/8">
          <div className="grid md:grid-cols-12 gap-12 md:gap-8">
            <div className="md:col-span-7">
              <p className="display-italic text-bone text-5xl md:text-7xl lg:text-[9rem] leading-[0.9] tracking-tight">
                Auto Cyprus
              </p>
              <p className="mt-8 text-mist text-base max-w-md text-pretty">
                {t('tagline')}
              </p>
            </div>

            <div className="md:col-span-5 grid grid-cols-2 gap-8 md:pt-2">
              <div className="flex flex-col gap-3">
                <span className="eyebrow-on-dark">{t('explore')}</span>
                <ul className="flex flex-col gap-2.5 text-sm">
                  <li>
                    <Link href="/cars" className="text-bone hover:text-mist transition-colors duration-150">
                      {tNav('cars')}
                    </Link>
                  </li>
                  <li>
                    <Link href="/sell" className="text-bone hover:text-mist transition-colors duration-150">
                      {tNav('sell')}
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="text-bone hover:text-mist transition-colors duration-150">
                      {tNav('about')}
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-bone hover:text-mist transition-colors duration-150">
                      {tNav('contact')}
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-3">
                <span className="eyebrow-on-dark">{t('hours')}</span>
                <ul className="flex flex-col gap-2 text-sm text-mist">
                  <li>{t('weekdays')}</li>
                  <li>{t('saturday')}</li>
                  <li>{t('sunday')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Contact row */}
        <div className="py-10 md:py-12 grid md:grid-cols-2 gap-10 border-b border-white/8">
          <div>
            <span className="eyebrow-on-dark">{t('address')}</span>
            <p className="mt-3 text-bone text-base">{site.address}</p>
            <a
              href={mapsHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-sm text-mist hover:text-bone transition-colors duration-150"
            >
              <MapPinIcon size={14} />
              <span className="link-rule">Open in Maps</span>
            </a>
          </div>

          <div className="flex flex-col gap-3 md:items-end">
            <span className="eyebrow-on-dark">{t('contact')}</span>
            <div className="flex flex-col gap-2 md:items-end text-sm">
              <a href={phoneHref()} className="flex items-center gap-2 text-bone hover:text-mist transition-colors duration-150">
                <PhoneIcon size={14} />
                <span>{site.phone}</span>
              </a>
              <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-bone hover:text-mist transition-colors duration-150">
                <WhatsappIcon size={14} />
                <span>{site.whatsapp}</span>
              </a>
              <a href={emailHref()} className="flex items-center gap-2 text-bone hover:text-mist transition-colors duration-150">
                <MailIcon size={14} />
                <span>{site.email}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="py-6 md:py-8 flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-2xs text-mist tracking-wider uppercase">
            © {year} Auto Cyprus& · {t('rights')}
          </p>
          <LocaleSwitcher onDark />
        </div>
      </Container>
    </footer>
  );
}
