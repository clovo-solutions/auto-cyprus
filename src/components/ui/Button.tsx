import { forwardRef, type ButtonHTMLAttributes, type AnchorHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'inverse';
type Size = 'sm' | 'md' | 'lg';

const variantClasses: Record<Variant, string> = {
  primary: 'bg-ink text-bone hover:bg-ink-soft active:bg-ink-mid border-ink',
  secondary: 'bg-transparent text-ink border-ink hover:bg-ink hover:text-bone',
  ghost: 'bg-transparent text-ink border-transparent hover:bg-ink/5',
  inverse: 'bg-bone text-ink border-bone hover:bg-bone/90 active:bg-bone/80',
};

const sizeClasses: Record<Size, string> = {
  sm: 'text-xs px-4 py-2.5 min-h-[40px]',
  md: 'text-sm px-6 py-3.5 min-h-[48px]',
  lg: 'text-sm px-8 py-4 min-h-[52px]',
};

interface BaseProps {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  loading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  className?: string;
  children?: ReactNode;
}

type ButtonOwnProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { as?: 'button' };
type AnchorOwnProps = BaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { as: 'a'; href: string };

export type ButtonProps = ButtonOwnProps | AnchorOwnProps;

const baseClasses =
  'btn-base inline-flex items-center justify-center gap-2 font-medium tracking-[0.04em] uppercase border transition-colors duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button(props, ref) {
    const {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      iconLeft,
      iconRight,
      className,
      children,
      ...rest
    } = props;

    const classes = cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      fullWidth && 'w-full',
      className,
    );

    if (props.as === 'a') {
      const { as: _as, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement> & { as: 'a' };
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={classes}
          {...anchorRest}
        >
          {iconLeft}
          <span>{children}</span>
          {iconRight}
        </a>
      );
    }

    const { as: _as, disabled, ...buttonRest } = rest as ButtonHTMLAttributes<HTMLButtonElement> & { as?: 'button' };
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={classes}
        disabled={disabled || loading}
        {...buttonRest}
      >
        {iconLeft}
        <span>{loading ? '…' : children}</span>
        {iconRight}
      </button>
    );
  },
);
