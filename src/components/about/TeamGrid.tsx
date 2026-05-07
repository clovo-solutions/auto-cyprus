import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Container, Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/SectionHeader';
import { Reveal } from '@/components/motion/Reveal';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import type { Locale } from '@/i18n/config';

interface TeamGridProps {
  locale: Locale;
}

interface TeamMember {
  name: string;
  role: string;
  image: string;
  blurb: string;
  joined: string;
  languages: string[];
  /** Optional pull quote — only used for the lead member */
  quote?: string;
}

const team: TeamMember[] = [
  {
    name: 'Andreas Petrou',
    role: 'Founder · Sales',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=900',
    blurb:
      'Twelve years in. Knows every car on the floor by smell, sound, and history. The buck stops here.',
    joined: '2013',
    languages: ['Greek', 'English'],
    quote:
      'We could stock two hundred cars. We don’t — because then we’d stop knowing them.',
  },
  {
    name: 'Maria Christou',
    role: 'Operations · Trade-ins',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=900',
    blurb:
      'If you’re selling us a car, Maria does the paperwork, the bank transfer, and the small talk.',
    joined: '2017',
    languages: ['Greek', 'English'],
  },
  {
    name: 'Nikolas Ivanov',
    role: 'Inspections · Service',
    image:
      'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=900',
    blurb:
      'Master mechanic. The 100-point inspection is his work. Will refuse a car if it’s not right.',
    joined: '2015',
    languages: ['Russian', 'Greek', 'English'],
  },
  {
    name: 'Elena Zacharia',
    role: 'Customer care',
    image:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=900',
    blurb:
      'Most of the WhatsApp replies. Three languages. Will not let you forget your service appointment.',
    joined: '2019',
    languages: ['Greek', 'English', 'Russian'],
  },
];

export async function TeamGrid({ locale }: TeamGridProps) {
  const t = await getTranslations({ locale, namespace: 'about.team' });
  const tSince = locale === 'gr' ? 'Από' : locale === 'ru' ? 'С' : 'Since';
  const tSpeaks = locale === 'gr' ? 'Μιλά' : locale === 'ru' ? 'Языки' : 'Speaks';

  const lead = team[0]!;
  const others = team.slice(1);

  return (
    <Section tone="bone" spacing="lg">
      <Container>
        <SectionHeader
          eyebrow="People"
          title={t('title')}
          index="03"
          size="md"
          className="mb-12 md:mb-16"
        />

        {/* Lead row: founder portrait + pull-quote, two columns */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 mb-20 md:mb-28 items-end">
          <Reveal className="lg:col-span-5">
            <TeamPortrait member={lead} index={1} tSince={tSince} tSpeaks={tSpeaks} large />
          </Reveal>
          <Reveal delay={0.2} className="lg:col-span-7 lg:pb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="block w-12 h-px bg-accent" aria-hidden="true" />
              <span className="eyebrow">A note from the founder</span>
            </div>
            <blockquote className="display text-3xl md:text-4xl lg:text-5xl tracking-tight text-balance leading-[1.1] text-ink">
              <span
                className="display-italic text-accent text-5xl md:text-6xl mr-1 leading-none align-baseline"
                aria-hidden="true"
              >
                “
              </span>
              {lead.quote}
            </blockquote>
            <p className="mt-8 text-2xs uppercase tracking-[0.22em] text-graphite">
              — {lead.name}, {lead.role}
            </p>
          </Reveal>
        </div>

        {/* The rest of the team — staggered grid with vertical offsets */}
        <Stagger
          staggerChildren={0.12}
          className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 md:gap-x-10 gap-y-14 md:gap-y-20"
        >
          {others.map((member, i) => (
            <StaggerItem
              key={member.name}
              // Even-indexed members in this slice (i=0, 2, ...) sit lower for editorial rhythm
              className={i % 2 === 1 ? 'lg:translate-y-12' : ''}
            >
              <TeamPortrait
                member={member}
                index={i + 2}
                tSince={tSince}
                tSpeaks={tSpeaks}
              />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}

interface TeamPortraitProps {
  member: TeamMember;
  index: number;
  tSince: string;
  tSpeaks: string;
  large?: boolean;
}

function TeamPortrait({ member, index, tSince, tSpeaks, large = false }: TeamPortraitProps) {
  return (
    <article className="group flex flex-col gap-5">
      <div
        className={`relative ${
          large ? 'aspect-[4/5]' : 'aspect-square-tall'
        } bg-fog/40 overflow-hidden image-frame film-grain`}
      >
        <Image
          src={member.image}
          alt={`Portrait of ${member.name}`}
          fill
          sizes={large ? '(min-width: 1024px) 35vw, 100vw' : '(min-width: 1024px) 30vw, 50vw'}
          className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        />

        {/* Top-right index numeral */}
        <span
          aria-hidden="true"
          className="absolute top-4 right-4 z-10 index-numeral text-bone text-sm mix-blend-difference"
        >
          {String(index).padStart(2, '0')} / {String(team.length).padStart(2, '0')}
        </span>

        {/* Brass underline that draws on hover, bottom of photo */}
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 h-px bg-accent scale-x-0 origin-left transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 z-10"
        />
      </div>

      <div className="flex flex-col gap-3">
        {/* Eyebrow row: role + joined year */}
        <div className="flex items-baseline justify-between gap-3">
          <span className="eyebrow text-graphite">{member.role}</span>
          <span className="text-2xs uppercase tracking-[0.18em] text-mist tabular-nums">
            {tSince} {member.joined}
          </span>
        </div>

        {/* Name — display serif, with hover underline */}
        <h3
          className={`display text-ink tracking-tight text-balance leading-[1.05] ${
            large ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl'
          }`}
        >
          <span className="reveal-rule">{member.name}</span>
        </h3>

        {/* Blurb */}
        <p
          className={`text-graphite leading-relaxed text-pretty ${
            large ? 'text-base max-w-[44ch]' : 'text-sm max-w-[32ch]'
          }`}
        >
          {member.blurb}
        </p>

        {/* Language row — small tag-like spans separated by hairlines */}
        <div className="hairline pt-3 mt-1 flex items-baseline gap-2 flex-wrap">
          <span className="text-2xs uppercase tracking-[0.22em] text-graphite">{tSpeaks}</span>
          {member.languages.map((lang, i) => (
            <span key={lang} className="text-xs text-ink-soft">
              {i > 0 ? <span className="text-mist mr-2">·</span> : null}
              {lang}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}