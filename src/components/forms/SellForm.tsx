'use client';

import { useState, useRef, type FormEvent } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Input, Textarea, Field } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CheckIcon } from '@/components/icons';

interface SellFormProps {
  token: string;
}

interface State {
  make: string;
  model: string;
  year: string;
  mileage: string;
  asking: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
}

const blank: State = {
  make: '',
  model: '',
  year: '',
  mileage: '',
  asking: '',
  name: '',
  phone: '',
  email: '',
  notes: '',
};

function parseIntOrUndefined(v: string): number | undefined {
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? n : undefined;
}

export function SellForm({ token }: SellFormProps) {
  const t = useTranslations('sell.form');
  const tInquiry = useTranslations('inquiry');
  const locale = useLocale();
  const [state, setState] = useState<State>(blank);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const renderedAtRef = useRef<number>(Date.now());
  const honeypotRef = useRef<HTMLInputElement>(null);

  const update = (patch: Partial<State>) => setState((s) => ({ ...s, ...patch }));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    setError(null);

    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'sell',
          locale,
          name: state.name,
          phone: state.phone,
          email: state.email,
          message: state.notes,
          sellMake: state.make,
          sellModel: state.model,
          sellYear: parseIntOrUndefined(state.year),
          sellMileage: parseIntOrUndefined(state.mileage),
          sellAsking: parseIntOrUndefined(state.asking),
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
        <h3 className="display text-2xl tracking-tight">{tInquiry('success.title')}</h3>
        <p className="text-graphite text-pretty max-w-prose">{tInquiry('success.body')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-7" noValidate>
      <div className="absolute -left-[9999px] w-px h-px overflow-hidden" aria-hidden="true">
        <label>
          Website
          <input ref={honeypotRef} type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {/* Car details */}
      <div>
        <span className="eyebrow text-graphite mb-5 block">01 / Car</span>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label={t('fields.make')} htmlFor="sf-make">
            <Input
              id="sf-make"
              type="text"
              required
              value={state.make}
              onChange={(e) => update({ make: e.target.value })}
            />
          </Field>
          <Field label={t('fields.model')} htmlFor="sf-model">
            <Input
              id="sf-model"
              type="text"
              required
              value={state.model}
              onChange={(e) => update({ model: e.target.value })}
            />
          </Field>
          <Field label={t('fields.year')} htmlFor="sf-year">
            <Input
              id="sf-year"
              type="number"
              inputMode="numeric"
              min={1980}
              max={new Date().getFullYear() + 1}
              required
              value={state.year}
              onChange={(e) => update({ year: e.target.value })}
            />
          </Field>
          <Field label={t('fields.mileage')} htmlFor="sf-mileage">
            <Input
              id="sf-mileage"
              type="number"
              inputMode="numeric"
              min={0}
              step={1000}
              required
              value={state.mileage}
              onChange={(e) => update({ mileage: e.target.value })}
            />
          </Field>
          <Field
            label={t('fields.asking')}
            htmlFor="sf-asking"
            optional
            hint={t('fields.askingHelp')}
            className="sm:col-span-2"
          >
            <Input
              id="sf-asking"
              type="number"
              inputMode="numeric"
              min={0}
              step={500}
              value={state.asking}
              onChange={(e) => update({ asking: e.target.value })}
            />
          </Field>
        </div>
      </div>

      {/* Contact */}
      <div>
        <span className="eyebrow text-graphite mb-5 block">02 / You</span>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label={t('fields.name')} htmlFor="sf-name" className="sm:col-span-2">
            <Input
              id="sf-name"
              type="text"
              required
              autoComplete="name"
              value={state.name}
              onChange={(e) => update({ name: e.target.value })}
            />
          </Field>
          <Field label={t('fields.phone')} htmlFor="sf-phone">
            <Input
              id="sf-phone"
              type="tel"
              autoComplete="tel"
              value={state.phone}
              onChange={(e) => update({ phone: e.target.value })}
            />
          </Field>
          <Field label={t('fields.email')} htmlFor="sf-email" optional>
            <Input
              id="sf-email"
              type="email"
              autoComplete="email"
              value={state.email}
              onChange={(e) => update({ email: e.target.value })}
            />
          </Field>
          <Field label={t('fields.notes')} htmlFor="sf-notes" optional className="sm:col-span-2">
            <Textarea
              id="sf-notes"
              rows={4}
              placeholder={t('fields.notesPlaceholder')}
              value={state.notes}
              onChange={(e) => update({ notes: e.target.value })}
            />
          </Field>
        </div>
      </div>

      {status === 'error' ? (
        <div className="border-t border-danger pt-4">
          <p className="text-sm text-danger">
            {tInquiry('error.title')} {tInquiry('error.body')}
          </p>
          {error ? <p className="text-2xs text-graphite mt-1">{error}</p> : null}
        </div>
      ) : null}

      <div className="pt-2">
        <Button type="submit" variant="primary" size="lg" loading={status === 'submitting'}>
          {status === 'submitting' ? tInquiry('submitting') : t('submit')}
        </Button>
      </div>
    </form>
  );
}
