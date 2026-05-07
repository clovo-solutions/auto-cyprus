import { type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface SectionHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  sub?: ReactNode;
  align?: 'left' | 'center';
  onDark?: boolean;
  index?: string;
  className?: string;
  id?: string;
  size?: 'md' | 'lg';
}

export function SectionHeader({
  eyebrow,
  title,
  sub,
  align = 'left',
  onDark = false,
  index,
  className,
  id,
  size = 'md',
}: SectionHeaderProps) {
  return (
    <header
      className={cn(
        'flex flex-col gap-5 max-w-[60rem]',
        align === 'center' && 'mx-auto items-center text-center',
        className,
      )}
    >
      {(eyebrow || index) ? (
        <div
          className={cn(
            'flex items-baseline gap-3',
            align === 'center' && 'justify-center',
          )}
        >
          {index ? <span className="index-numeral">{index}</span> : null}
          {eyebrow ? (
            <span className={onDark ? 'eyebrow-on-dark' : 'eyebrow'}>{eyebrow}</span>
          ) : null}
        </div>
      ) : null}
      <h2
        id={id}
        className={cn(
          'display text-balance',
          size === 'lg' ? 'text-4xl md:text-5xl lg:text-6xl' : 'text-3xl md:text-4xl lg:text-5xl',
          onDark ? 'text-bone' : 'text-ink',
        )}
      >
        {title}
      </h2>
      {sub ? (
        <p
          className={cn(
            'text-base md:text-lg max-w-[42ch] text-pretty',
            onDark ? 'text-mist' : 'text-graphite',
            align === 'center' && 'mx-auto',
          )}
        >
          {sub}
        </p>
      ) : null}
    </header>
  );
}
