import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/Section';
import { InquiryForm } from '@/components/cars/InquiryForm';
import { issueToken } from '@/lib/inquiryToken';
import { PhoneIcon, WhatsappIcon, MailIcon, MapPinIcon } from '@/components/icons';
import { phoneHref, whatsappHref, emailHref, mapsHref, site } from '@/lib/site';
import type { Locale } from '@/i18n/config';

interface ContactFormBlockProps {
  locale: Locale;
}

export async function ContactFormBlock({ locale }: ContactFormBlockProps) {
  const t = await getTranslations({ locale, namespace: 'contact.form' });
  const tHero = await getTranslations({ locale, namespace: 'contact.hero' });
  const tTiles = await getTranslations({ locale, namespace: 'contact.tiles' });
  const token = issueToken();

  const aside = locale === 'gr'
    ? {
        eyebrow: '02 / Στείλτε μήνυμα',
        title: 'Ή απλώς πάρτε μας τηλέφωνο.',
        body: 'Δεν χρειάζεται φόρμα — αν προτιμάτε να μιλήσετε με κάποιον αμέσως, καλέστε ή στείλτε μας WhatsApp. Συνήθως σηκώνουμε από το πρώτο χτύπημα.',
        replyEyebrow: 'Χρόνος απάντησης',
        replyTime: 'Συνήθως μέσα στην ώρα, τις καθημερινές',
      }
    : locale === 'ru'
      ? {
          eyebrow: '02 / Сообщение',
          title: 'Или просто позвоните нам.',
          body: 'Форма необязательна — если хотите сразу поговорить с человеком, звоните или пишите в WhatsApp. Обычно отвечаем с первого гудка.',
          replyEyebrow: 'Время ответа',
          replyTime: 'Обычно в течение часа в будни',
        }
      : {
          eyebrow: '02 / Message',
          title: 'Or just give us a ring.',
          body: "No need for a form — if you'd rather speak to someone right away, call or send a WhatsApp. We usually pick up on the first ring.",
          replyEyebrow: 'Response time',
          replyTime: 'Usually within the hour on weekdays',
        };

  return (
    <section className="bg-cream py-16 md:py-24 lg:py-28 border-t border-rule-light">
      <Container>
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 xl:gap-20 items-start">
          {/* Left side — context, contacts, response time */}
          <aside className="lg:col-span-5 lg:sticky lg:top-28 flex flex-col gap-10">
            <div className="flex flex-col gap-3">
              <span className="eyebrow text-graphite">{aside.eyebrow}</span>
              <h2 className="display text-3xl md:text-4xl lg:text-5xl tracking-tight text-balance">
                {aside.title}
              </h2>
              <p className="text-graphite text-pretty max-w-prose mt-2">
                {aside.body}
              </p>
            </div>

            {/* Quick-contact list */}
            <ul className="flex flex-col gap-px bg-rule-light">
              <li>
                <a
                  href={phoneHref()}
                  className="flex items-center gap-4 bg-cream hover:bg-bone transition-colors duration-200 px-5 py-5 group"
                >
                  <span className="flex items-center justify-center w-10 h-10 border border-ink/15 text-ink group-hover:bg-ink group-hover:text-bone transition-colors duration-200">
                    <PhoneIcon size={16} />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-2xs uppercase tracking-[0.18em] text-graphite">
                      {tTiles('phone.label')}
                    </span>
                    <span className="text-base text-ink mt-1 tabular-nums">{site.phone}</span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={whatsappHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 bg-cream hover:bg-bone transition-colors duration-200 px-5 py-5 group"
                >
                  <span className="flex items-center justify-center w-10 h-10 border border-ink/15 text-ink group-hover:bg-ink group-hover:text-bone transition-colors duration-200">
                    <WhatsappIcon size={16} />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-2xs uppercase tracking-[0.18em] text-graphite">
                      {tTiles('whatsapp.label')}
                    </span>
                    <span className="text-base text-ink mt-1">{tTiles('whatsapp.help')}</span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={emailHref()}
                  className="flex items-center gap-4 bg-cream hover:bg-bone transition-colors duration-200 px-5 py-5 group"
                >
                  <span className="flex items-center justify-center w-10 h-10 border border-ink/15 text-ink group-hover:bg-ink group-hover:text-bone transition-colors duration-200">
                    <MailIcon size={16} />
                  </span>
                  <span className="flex flex-col min-w-0">
                    <span className="text-2xs uppercase tracking-[0.18em] text-graphite">
                      {tTiles('email.label')}
                    </span>
                    <span className="text-base text-ink mt-1 truncate">{site.email}</span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={mapsHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 bg-cream hover:bg-bone transition-colors duration-200 px-5 py-5 group"
                >
                  <span className="flex items-center justify-center w-10 h-10 border border-ink/15 text-ink group-hover:bg-ink group-hover:text-bone transition-colors duration-200">
                    <MapPinIcon size={16} />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-2xs uppercase tracking-[0.18em] text-graphite">
                      {tTiles('visit.label')}
                    </span>
                    <span className="text-base text-ink mt-1 leading-relaxed">{site.address}</span>
                  </span>
                </a>
              </li>
            </ul>

            {/* Response time chip */}
            <div className="hairline pt-5 flex items-center justify-between gap-4">
              <span className="text-2xs uppercase tracking-[0.22em] text-graphite">
                {aside.replyEyebrow}
              </span>
              <span className="text-sm text-ink-soft text-right">{aside.replyTime}</span>
            </div>
          </aside>

          {/* Right side — the form, on its own card */}
          <div className="lg:col-span-7">
            <div className="bg-bone p-7 md:p-10 lg:p-12 border-t-2 border-ink shadow-[0_2px_24px_rgba(14,17,22,0.04)]">
              <div className="flex flex-col gap-3 mb-8">
                <span className="eyebrow text-graphite">
                  {locale === 'gr' ? '03 / Φόρμα' : locale === 'ru' ? '03 / Форма' : '03 / Form'}
                </span>
                <h3 className="display text-2xl md:text-3xl tracking-tight">{t('title')}</h3>
                <p className="text-graphite text-sm md:text-base text-pretty">{t('sub')}</p>
              </div>

              <InquiryForm token={token} type="contact" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}