import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

const fieldClasses =
  'w-full bg-transparent border-0 border-b border-rule-light px-0 py-3 text-base text-ink placeholder:text-mist focus:outline-none focus:border-ink transition-colors duration-150';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...rest }, ref) {
    return <input ref={ref} className={cn(fieldClasses, className)} {...rest} />;
  },
);

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, rows = 4, ...rest }, ref) {
    return <textarea ref={ref} rows={rows} className={cn(fieldClasses, 'resize-y', className)} {...rest} />;
  },
);

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, children, ...rest }, ref) {
    return (
      <select
        ref={ref}
        className={cn(
          fieldClasses,
          'cursor-pointer appearance-none pr-8',
          'bg-[length:14px_14px] bg-no-repeat',
          className,
        )}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b6f78' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><path d='m6 9 6 6 6-6'/></svg>\")",
          backgroundPosition: 'right 0 center',
        }}
        {...rest}
      >
        {children}
      </select>
    );
  },
);

interface FieldProps {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  optional?: boolean;
  className?: string;
}

export function Field({ label, htmlFor, hint, error, children, optional, className }: FieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label
        htmlFor={htmlFor}
        className="eyebrow text-graphite flex items-baseline justify-between gap-3"
      >
        <span>{label}</span>
        {optional ? (
          <span className="text-mist text-2xs normal-case tracking-wider">— optional</span>
        ) : null}
      </label>
      {children}
      {hint && !error ? <p className="text-xs text-graphite">{hint}</p> : null}
      {error ? <p className="text-xs text-danger">{error}</p> : null}
    </div>
  );
}
