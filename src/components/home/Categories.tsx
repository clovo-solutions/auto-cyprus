import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { Container, Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/SectionHeader';
import { ArrowUpRightIcon } from '@/components/icons';
import { Reveal } from '@/components/motion/Reveal';
import type { Locale } from '@/i18n/config';

interface CategoriesProps {
  locale: Locale;
}

interface CategoryEntry {
  key: 'suv' | 'sedan' | 'coupe' | 'convertible' | 'hatchback' | 'wagon';
  body: string;
  image: string;
  caption: Record<Locale, string>;
  count: number;
  hero?: boolean;
}

const categories: CategoryEntry[] = [
  {
    key: 'suv',
    body: 'suv',
    image:
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&q=80&w=1600',
    caption: {
      en: 'For the school run, the mountain road, and everything in between.',
      gr: 'Για το σχολείο, τον ορεινό δρόμο, και ό,τι υπάρχει ενδιάμεσα.',
      ru: 'Для школы, горной дороги — и всего, что между ними.',
    },
    count: 14,
    hero: true,
  },
  {
    key: 'sedan',
    body: 'sedan',
    image:
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=1200',
    caption: {
      en: 'Quiet, considered, no nonsense.',
      gr: 'Ήσυχα, σκεπτικά, χωρίς υπερβολές.',
      ru: 'Тихие, продуманные, без излишеств.',
    },
    count: 9,
  },
  {
    key: 'coupe',
    body: 'coupe',
    image:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200',
    caption: {
      en: 'Two doors. One opinion.',
      gr: 'Δύο πόρτες. Μία γνώμη.',
      ru: 'Две двери. Одно мнение.',
    },
    count: 6,
  },
  {
    key: 'convertible',
    body: 'convertible',
    image:
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=1200',
    caption: {
      en: 'Cyprus has a roof season of about three weeks. Use them.',
      gr: 'Η Κύπρος έχει εποχή ανοιχτής οροφής περίπου τρεις εβδομάδες. Αξιοποιήστε τες.',
      ru: 'У Кипра сезон с открытой крышей — недели три. Не упустите.',
    },
    count: 4,
  },
];

export async function Categories({ locale }: CategoriesProps) {
  const t = await getTranslations({ locale, namespace: 'home.categories' });
  const tCount = locale === 'gr' ? 'στη συλλογή' : locale === 'ru' ? 'в наличии' : 'in stock';

  const hero = categories.find((c) => c.hero)!;
  const rest = categories.filter((c) => !c.hero);

  return (
    <Section tone="bone" spacing="lg">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
          <SectionHeader
            eyebrow={t('eyebrow')}
            title={t('title')}
            index="04"
            size="md"
          />
          <Link
            href="/cars"
            className="group link-rule self-start text-sm tracking-wide whitespace-nowrap inline-flex items-center gap-2"
          >
            <span>
              {locale === 'gr' ? 'Όλες οι κατηγορίες' : locale === 'ru' ? 'Все категории' : 'All categories'}
            </span>
            <ArrowUpRightIcon
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-[420px_300px] gap-3 md:gap-4">
          {/* Hero — left, 7 cols × 2 rows */}
          <Reveal className="lg:col-span-7 lg:row-span-2">
            <CategoryTile
              entry={hero}
              caption={hero.caption[locale]}
              label={t(`items.${hero.key}`)}
              countLabel={`${hero.count} ${tCount}`}
              hero
            />
          </Reveal>

          {/* Top-right — Sedan, 5 cols × 1 row */}
          <Reveal delay={0.1} className="lg:col-span-5 lg:row-span-1">
            <CategoryTile
              entry={rest[0]!}
              caption={rest[0]!.caption[locale]}
              label={t(`items.${rest[0]!.key}`)}
              countLabel={`${rest[0]!.count} ${tCount}`}
            />
          </Reveal>

          {/* Bottom-right — Coupe + Convertible, now bigger and equal */}
          <Reveal delay={0.18} className="lg:col-span-3 lg:row-span-1">
            <CategoryTile
              entry={rest[1]!}
              caption={rest[1]!.caption[locale]}
              label={t(`items.${rest[1]!.key}`)}
              countLabel={`${rest[1]!.count} ${tCount}`}
              compact
            />
          </Reveal>
          <Reveal delay={0.26} className="lg:col-span-2 lg:row-span-1">
            <CategoryTile
              entry={rest[2]!}
              caption={rest[2]!.caption[locale]}
              label={t(`items.${rest[2]!.key}`)}
              countLabel={`${rest[2]!.count} ${tCount}`}
              compact
              minimal
            />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

interface CategoryTileProps {
  entry: CategoryEntry;
  label: string;
  caption: string;
  countLabel: string;
  hero?: boolean;
  compact?: boolean;
  minimal?: boolean;
}

function CategoryTile({
  entry,
  label,
  caption,
  countLabel,
  hero = false,
  compact = false,
  minimal = false,
}: CategoryTileProps) {
  return (
    <Link
      href={`/cars?body=${entry.body}`}
      className="group relative block image-frame h-full min-h-[280px] overflow-hidden bg-ink/5"
      aria-label={`${label} — ${countLabel}`}
    >
      <Image
        src={entry.image}
        alt=""
        fill
        sizes={hero ? '(min-width: 1024px) 50vw, 100vw' : '(min-width: 1024px) 30vw, 50vw'}
        className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
      />

      {hero ? (
        <span
          aria-hidden="true"
          className="absolute -top-4 -left-2 display-italic text-bone/15 text-[10rem] leading-none select-none mix-blend-overlay transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-bone/25 group-hover:-translate-y-2"
        >
          {label}
        </span>
      ) : null}

      <span
        aria-hidden="true"
        className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 via-ink/40 to-transparent ${
          hero ? 'h-3/4' : 'h-1/2'
        } opacity-90 group-hover:opacity-100 transition-opacity duration-500`}
      />

      <span
        aria-hidden="true"
        className="absolute right-0 bottom-0 w-px h-0 bg-accent transition-[height] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:h-full"
      />

      {!minimal ? (
        <span className="absolute top-4 right-4 z-10 inline-flex items-center gap-1.5 bg-bone/95 backdrop-blur-sm text-ink px-2.5 py-1 text-2xs uppercase tracking-[0.18em] tabular-nums">
          <span className="block w-1 h-1 rounded-full bg-success" aria-hidden="true" />
          <span>{countLabel}</span>
        </span>
      ) : null}

      <span
        aria-hidden="true"
        className="absolute top-4 left-4 z-10 index-numeral text-bone/70 text-sm transition-all duration-500 group-hover:text-bone"
      >
        — {String(categories.findIndex((c) => c.key === entry.key) + 1).padStart(2, '0')}
      </span>

      <div
        className={`absolute inset-x-0 bottom-0 z-10 ${
          hero ? 'p-7 md:p-10' : compact ? 'p-5 md:p-6' : 'p-6 md:p-7'
        } flex flex-col gap-3`}
      >
        <h3
          className={`text-bone display tracking-tight transition-transform duration-500 group-hover:translate-y-[-2px] ${
            hero
              ? 'text-4xl md:text-5xl lg:text-6xl'
              : compact
                ? 'text-xl md:text-2xl'
                : 'text-2xl md:text-3xl'
          }`}
        >
          {label}
        </h3>

        {!minimal ? (
          <p
            className={`text-mist text-pretty leading-snug max-w-[36ch] transition-colors duration-500 group-hover:text-bone ${
              hero ? 'text-base md:text-lg' : 'text-sm'
            }`}
          >
            {caption}
          </p>
        ) : null}

        <div className="flex items-center justify-between mt-2 pt-3 border-t border-bone/20 group-hover:border-bone/40 transition-colors duration-500">
          <span className="text-2xs uppercase tracking-[0.22em] text-bone/70 group-hover:text-bone transition-colors duration-500">
            {minimal ? 'View' : 'Browse the range'}
          </span>
          <span className="text-bone transition-transform duration-500 group-hover:rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            <ArrowUpRightIcon size={hero ? 22 : 16} />
          </span>
        </div>
      </div>
    </Link>
  );
}