'use client';

import { useState, useRef, type FormEvent } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Input, Textarea, Field } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CheckIcon } from '@/components/icons';

interface InquiryFormProps {
  token: string;
  carId?: string | number;
  carSlug?: string;
  type: 'car' | 'contact' | 'general';
}

interface FormState {
  name: string;
  phone: string;
  email: string;
  message: string;
}

export function InquiryForm({ token, carId, carSlug, type }: InquiryFormProps) {
  const t = useTranslations('inquiry');
  const locale = useLocale();
  const [state, setState] = useState<FormState>({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const renderedAtRef = useRef<number>(Date.now());
  const honeypotRef = useRef<HTMLInputElement>(null);

  const update = (patch: Partial<FormState>) => setState((s) => ({ ...s, ...patch }));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    setError(null);

    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          carId,
          carSlug,
          locale,
          name: state.name,
          phone: state.phone,
          email: state.email,
          message: state.message,
          website: honeypotRef.current?.value ?? '',
          renderedAt: renderedAtRef.current,
          token,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      setStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="border-t border-rule-light pt-8 flex flex-col gap-3">
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-success/10 text-success">
          <CheckIcon size={20} />
        </span>
        <h3 className="display text-2xl tracking-tight">{t('success.title')}</h3>
        <p className="text-graphite text-pretty max-w-prose">{t('success.body')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      {/* Honeypot — hidden from users via aria + label, also visually */}
      <div className="absolute -left-[9999px] w-px h-px overflow-hidden" aria-hidden="true">
        <label>
          Website
          <input
            ref={honeypotRef}
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      <Field label={t('fields.name')} htmlFor="inq-name">
        <Input
          id="inq-name"
          type="text"
          required
          autoComplete="name"
          value={state.name}
          onChange={(e) => update({ name: e.target.value })}
        />
      </Field>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label={t('fields.phone')} htmlFor="inq-phone">
          <Input
            id="inq-phone"
            type="tel"
            autoComplete="tel"
            value={state.phone}
            onChange={(e) => update({ phone: e.target.value })}
          />
        </Field>
        <Field label={t('fields.email')} htmlFor="inq-email" optional>
          <Input
            id="inq-email"
            type="email"
            autoComplete="email"
            value={state.email}
            onChange={(e) => update({ email: e.target.value })}
          />
        </Field>
      </div>

      <Field label={t('fields.message')} htmlFor="inq-message" optional>
        <Textarea
          id="inq-message"
          rows={4}
          placeholder={t('fields.messagePlaceholder')}
          value={state.message}
          onChange={(e) => update({ message: e.target.value })}
        />
      </Field>

      {status === 'error' ? (
        <div className="border-t border-danger pt-4">
          <p className="text-sm text-danger">
            {t('error.title')} {t('error.body')}
          </p>
          {error ? <p className="text-2xs text-graphite mt-1">{error}</p> : null}
        </div>
      ) : null}

      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={status === 'submitting'}
          fullWidth
        >
          {status === 'submitting' ? t('submitting') : t('submit')}
        </Button>
      </div>
    </form>
  );
}
