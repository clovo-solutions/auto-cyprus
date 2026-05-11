import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Container, Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/SectionHeader';
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
}

const team: TeamMember[] = [
  {
    name: "Andreas",
    role: "Co-founder · Sales",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=900",
    blurb:
      "Twelve years in. Knows every car on the floor by history, feel, and reputation. The buck stops here.",
    joined: "2013",
    languages: ["Greek", "English"],
  },
  {
    name: "Maria Christou",
    role: "Operations · Trade-ins",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=900",
    blurb:
      "If you're selling us a car, Maria does the paperwork, the bank transfer, and the small talk.",
    joined: "2017",
    languages: ["Greek", "English"],
  },
  {
    name: "Nikolas Ivanov",
    role: "Inspections · Service",
    image:
      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=900",
    blurb:
      "Master mechanic. The 100-point inspection is his work. Will refuse a car if it's not right.",
    joined: "2015",
    languages: ["Russian", "Greek", "English"],
  },
  {
    name: "Elena Zacharia",
    role: "Customer care",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=900",
    blurb:
      "Most of the WhatsApp replies. Three languages. Will not let you forget your service appointment.",
    joined: "2019",
    languages: ["Greek", "English", "Russian"],
  },
];

export async function TeamGrid({ locale }: TeamGridProps) {
  const t = await getTranslations({ locale, namespace: 'about.team' });
  const tSince = locale === 'gr' ? 'Από' : locale === 'ru' ? 'С' : 'Since';
  const tSpeaks = locale === 'gr' ? 'Μιλά' : locale === 'ru' ? 'Языки' : 'Speaks';

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

        <Stagger
          staggerChildren={0.12}
          className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 md:gap-x-10 gap-y-14 md:gap-y-20"
        >
          {team.map((member, i) => (
            <StaggerItem
              key={member.name}
              className={i % 2 === 1 ? 'lg:translate-y-12' : ''}
            >
              <TeamPortrait
                member={member}
                index={i + 1}
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
}

function TeamPortrait({ member, index, tSince, tSpeaks }: TeamPortraitProps) {
  return (
    <article className="group flex flex-col gap-5">
      <div className="relative aspect-square-tall bg-fog/40 overflow-hidden image-frame film-grain">
        <Image
          src={member.image}
          alt={`Portrait of ${member.name}`}
          fill
          sizes="(min-width: 1024px) 30vw, 50vw"
          className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        />

        <span
          aria-hidden="true"
          className="absolute top-4 right-4 z-10 index-numeral text-bone text-sm mix-blend-difference"
        >
          {String(index).padStart(2, '0')} / {String(team.length).padStart(2, '0')}
        </span>

        <span
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 h-px bg-accent scale-x-0 origin-left transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 z-10"
        />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between gap-3">
          <span className="eyebrow text-graphite">{member.role}</span>
          <span className="text-2xs uppercase tracking-[0.18em] text-mist tabular-nums">
            {tSince} {member.joined}
          </span>
        </div>

        <h3 className="display text-ink tracking-tight text-balance leading-[1.05] text-2xl md:text-3xl">
          <span className="reveal-rule">{member.name}</span>
        </h3>

        <p className="text-graphite leading-relaxed text-pretty text-sm max-w-[32ch]">
          {member.blurb}
        </p>

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
