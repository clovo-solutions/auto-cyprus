import { type ReactNode, type ElementType } from 'react';
import { cn } from '@/lib/cn';

export { Container } from './Container';

interface SectionProps {
  children: ReactNode;
  className?: string;
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  tone?: 'bone' | 'cream' | 'ink' | 'paper';
  as?: ElementType;
  id?: string;
  ariaLabelledby?: string;
}

const spacingClass: Record<NonNullable<SectionProps['spacing']>, string> = {
  sm: 'py-12 md:py-16',
  md: 'py-16 md:py-24',
  lg: 'py-24 md:py-32',
  xl: 'py-28 md:py-40',
};

export function Section({
  children,
  className,
  spacing = 'lg',
  tone = 'bone',
  as: Tag = 'section',
  id,
  ariaLabelledby,
}: SectionProps) {
  const toneClass =
    tone === 'bone'
      ? 'bg-bone text-ink'
      : tone === 'cream'
        ? 'bg-cream text-ink'
        : tone === 'paper'
          ? 'paper text-bone'
          : 'bg-ink text-bone';
  return (
    <Tag
      id={id}
      aria-labelledby={ariaLabelledby}
      className={cn(toneClass, spacingClass[spacing], className)}
    >
      {children}
    </Tag>
  );
}