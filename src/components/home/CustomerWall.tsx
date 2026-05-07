import { getTranslations } from 'next-intl/server';
import { Container, Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/SectionHeader';
import { CustomerWallDeck, type DeckCustomer } from './CustomerWallDeck';
import type { Locale } from '@/i18n/config';

interface CustomerWallProps {
  locale: Locale;
}

interface RawCustomer {
  name: string;
  location: string;
  car: string;
  purchasedAt: { en: string; gr: string; ru: string };
  quote: { en: string; gr: string; ru: string };
}

const customers: RawCustomer[] = [
  {
    name: 'Maria K.',
    location: 'Limassol',
    car: 'Mercedes GLC 300e',
    purchasedAt: {
      en: 'Oct 2022',
      gr: 'Οκτ 2022',
      ru: 'Окт 2022',
    },
    quote: {
      en: 'Honest about a small dent, fixed it before pickup. Three years on, still my car.',
      gr: 'Ειλικρινείς για ένα γρατζούνισμα, το διόρθωσαν πριν την παράδοση. Τρία χρόνια μετά, ακόμα δικό μου.',
      ru: 'Честно сказали про вмятину, починили до передачи. Три года спустя — всё ещё моя машина.',
    },
  },
  {
    name: 'Ivan M.',
    location: 'Paphos',
    car: 'BMW X3',
    purchasedAt: {
      en: 'Jun 2023',
      gr: 'Ιούν 2023',
      ru: 'Июн 2023',
    },
    quote: {
      en: 'Bought a 5-year-old BMW. They handed me a folder with every service receipt — even from the previous owner.',
      gr: 'Αγόρασα μια BMW 5 ετών. Μου έδωσαν φάκελο με όλες τις αποδείξεις service — και του προηγούμενου ιδιοκτήτη.',
      ru: 'Купил 5-летнюю BMW. Передали папку со всеми сервисными чеками — даже от предыдущего владельца.',
    },
  },
  {
    name: 'Christos P.',
    location: 'Limassol',
    car: 'Porsche Macan S',
    purchasedAt: {
      en: 'Mar 2024',
      gr: 'Μαρ 2024',
      ru: 'Мар 2024',
    },
    quote: {
      en: 'I sold them my old car and bought a new one in the same week. Paperwork done, no chasing.',
      gr: 'Τους πούλησα το παλιό και αγόρασα νέο την ίδια εβδομάδα. Τα χαρτιά τακτοποιημένα, χωρίς τρεξίματα.',
      ru: 'Продал им свою старую машину и купил новую в ту же неделю. Документы оформили без проблем.',
    },
  },
  {
    name: 'Elena G.',
    location: 'Larnaca',
    car: 'Tesla Model 3',
    purchasedAt: {
      en: 'Sep 2023',
      gr: 'Σεπ 2023',
      ru: 'Сен 2023',
    },
    quote: {
      en: 'Andreas spent two hours walking me through the car. Twice. I never once felt rushed.',
      gr: 'Ο Ανδρέας πέρασε δύο ώρες δείχνοντάς μου το αυτοκίνητο. Δύο φορές. Ποτέ δεν ένιωσα ότι βιάστηκα.',
      ru: 'Андреас потратил два часа, показывая мне машину. Дважды. Ни разу не торопил.',
    },
  },
];

export async function CustomerWall({ locale }: CustomerWallProps) {
  const t = await getTranslations({ locale, namespace: 'home.wall' });

  const localized: DeckCustomer[] = customers.map((c) => ({
    name: c.name,
    location: c.location,
    car: c.car,
    purchasedAt: c.purchasedAt[locale],
    quote: c.quote[locale],
  }));

  const deckLabels = {
    en: {
      cardLabel: 'Card',
      of: 'of',
      next: 'Next testimonial',
      previous: 'Previous testimonial',
      purchased: 'Bought',
      verified: 'Verified',
      instructions: 'Drag, click, or use arrow keys',
    },
    gr: {
      cardLabel: 'Κάρτα',
      of: 'από',
      next: 'Επόμενη μαρτυρία',
      previous: 'Προηγούμενη μαρτυρία',
      purchased: 'Αγόρασε',
      verified: 'Επαληθευμένη',
      instructions: 'Σύρετε, κάντε κλικ ή χρησιμοποιήστε τα βέλη',
    },
    ru: {
      cardLabel: 'Карточка',
      of: 'из',
      next: 'Следующий отзыв',
      previous: 'Предыдущий отзыв',
      purchased: 'Куплено',
      verified: 'Проверено',
      instructions: 'Свайп, клик или стрелки',
    },
  };

  return (
    <Section tone="bone" spacing="lg">
      <Container>
        <SectionHeader
          eyebrow={t('eyebrow')}
          title={t('title')}
          sub={t('sub')}
          index="05"
          size="md"
          className="mb-12 md:mb-16"
        />

        <CustomerWallDeck customers={localized} labels={deckLabels[locale]} />
      </Container>
    </Section>
  );
}