import { getTranslations } from 'next-intl/server';
import { Container, Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/SectionHeader';
import { TestimonialScroll, type TestimonialItem } from '@/components/ui/testimonial-v2';
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
  // ── Original four ──────────────────────────────────────────────────────────
  {
    name: 'Maria K.',
    location: 'Limassol',
    car: 'Mercedes GLC 300e',
    purchasedAt: { en: 'Oct 2022', gr: 'Οκτ 2022', ru: 'Окт 2022' },
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
    purchasedAt: { en: 'Jun 2023', gr: 'Ιούν 2023', ru: 'Июн 2023' },
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
    purchasedAt: { en: 'Mar 2024', gr: 'Μαρ 2024', ru: 'Мар 2024' },
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
    purchasedAt: { en: 'Sep 2023', gr: 'Σεπ 2023', ru: 'Сен 2023' },
    quote: {
      en: 'Andreas spent two hours walking me through the car. Twice. I never once felt rushed.',
      gr: 'Ο Ανδρέας πέρασε δύο ώρες δείχνοντάς μου το αυτοκίνητο. Δύο φορές. Ποτέ δεν ένιωσα ότι βιάστηκα.',
      ru: 'Андреас потратил два часа, показывая мне машину. Дважды. Ни разу не торопил.',
    },
  },
  // ── Added to fill three columns ────────────────────────────────────────────
  {
    name: 'Nikos A.',
    location: 'Nicosia',
    car: 'Range Rover Sport',
    purchasedAt: { en: 'Feb 2023', gr: 'Φεβ 2023', ru: 'Фев 2023' },
    quote: {
      en: 'They held the car for three days while I sorted the financing. Zero pressure.',
      gr: 'Κράτησαν το αυτοκίνητο τρεις μέρες ενώ τακτοποιούσα τη χρηματοδότηση. Καμία πίεση.',
      ru: 'Придержали машину три дня, пока я оформлял финансирование. Никакого давления.',
    },
  },
  {
    name: 'Sophie L.',
    location: 'Limassol',
    car: 'Audi Q5',
    purchasedAt: { en: 'Nov 2022', gr: 'Νοε 2022', ru: 'Ноя 2022' },
    quote: {
      en: 'The car was exactly as described and photographed. No last-minute surprises at all.',
      gr: 'Το αυτοκίνητο ήταν ακριβώς όπως περιγράφηκε και φωτογραφήθηκε. Καμία έκπληξη.',
      ru: 'Машина была именно такой, как описано и сфотографировано. Никаких сюрпризов.',
    },
  },
  {
    name: 'Demetris V.',
    location: 'Larnaca',
    car: 'Volkswagen Golf GTI',
    purchasedAt: { en: 'Apr 2024', gr: 'Απρ 2024', ru: 'Апр 2024' },
    quote: {
      en: 'Bought it remotely. They sent a full walk-around video. Car arrived exactly as shown.',
      gr: 'Αγόρασα εξ αποστάσεως. Έστειλαν βίντεο. Ήρθε ακριβώς όπως έδειχνε.',
      ru: 'Купил удалённо. Прислали подробное видео. Приехала именно такой, как показали.',
    },
  },
  {
    name: 'Anna K.',
    location: 'Paphos',
    car: 'Volvo XC60',
    purchasedAt: { en: 'Jul 2023', gr: 'Ιούλ 2023', ru: 'Июл 2023' },
    quote: {
      en: 'Second car I\'ve bought from them. Same calm, straightforward experience both times.',
      gr: 'Δεύτερο αυτοκίνητο από αυτούς. Ίδια ήρεμη, απλή εμπειρία και τις δύο φορές.',
      ru: 'Второй автомобиль у них. Оба раза — одинаково спокойно и честно.',
    },
  },
  {
    name: 'Andrei B.',
    location: 'Limassol',
    car: 'BMW 3 Series',
    purchasedAt: { en: 'Jan 2024', gr: 'Ιαν 2024', ru: 'Янв 2024' },
    quote: {
      en: 'Full service history, no surprises. Paperwork done in an afternoon.',
      gr: 'Πλήρες ιστορικό service, καμία έκπληξη. Χαρτιά σε ένα απόγευμα.',
      ru: 'Полная сервисная история, никаких сюрпризов. Документы оформили за день.',
    },
  },
];

export async function CustomerWall({ locale }: CustomerWallProps) {
  const t = await getTranslations({ locale, namespace: 'home.wall' });

  const localized: TestimonialItem[] = customers.map((c) => ({
    name: c.name,
    location: c.location,
    car: c.car,
    purchasedAt: c.purchasedAt[locale],
    quote: c.quote[locale],
  }));

  return (
    <Section tone="bone" spacing="lg" className="border-t-2 border-ink/12">
      <Container>
        <SectionHeader
          eyebrow={t('eyebrow')}
          title={t('title')}
          sub={t('sub')}
          index="05"
          size="md"
          className="mb-12 md:mb-16"
        />

        <TestimonialScroll items={localized} />
      </Container>
    </Section>
  );
}
