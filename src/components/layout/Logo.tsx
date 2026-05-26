import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/cn';

interface LogoProps {
  className?: string;
  onDark?: boolean;
}

export function Logo({ className, onDark = false }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        'brand-mark group inline-flex items-baseline gap-1.5',
        onDark ? 'text-bone' : 'text-ink',
        className,
      )}
      aria-label="Auto Cyprus — go to home page"
    >
      <span className="font-medium tracking-[0.02em]">Auto Cyprus</span>
    </Link>
  );
}
