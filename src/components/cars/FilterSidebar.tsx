'use client';

import { useTransition, useState, useEffect } from 'react';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Input, Select, Field } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { FUEL_TYPES, TRANSMISSIONS, BODY_TYPES, type Filters } from '@/lib/filters';
import type { Brand } from '@/payload-types';
import { cn } from '@/lib/cn';

interface FilterSidebarProps {
  brands: Brand[];
  filters: Filters;
  onApply?: () => void;
  layout?: 'sidebar' | 'sheet';
}

interface State {
  brand: string;
  body: string;
  fuel: string;
  transmission: string;
  priceMin: string;
  priceMax: string;
  yearMin: string;
  yearMax: string;
  mileageMin: string;
  mileageMax: string;
}

function filtersToState(f: Filters): State {
  return {
    brand: f.brand ?? '',
    body: f.body ?? '',
    fuel: f.fuel ?? '',
    transmission: f.transmission ?? '',
    priceMin: f.priceMin !== undefined ? String(f.priceMin) : '',
    priceMax: f.priceMax !== undefined ? String(f.priceMax) : '',
    yearMin: f.yearMin !== undefined ? String(f.yearMin) : '',
    yearMax: f.yearMax !== undefined ? String(f.yearMax) : '',
    mileageMin: f.mileageMin !== undefined ? String(f.mileageMin) : '',
    mileageMax: f.mileageMax !== undefined ? String(f.mileageMax) : '',
  };
}

export function FilterSidebar({ brands, filters, onApply, layout = 'sidebar' }: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const t = useTranslations('cars.filters');
  const tCars = useTranslations('cars');
  const [state, setState] = useState<State>(filtersToState(filters));
  const [pending, startTransition] = useTransition();

  // Re-sync when external filters change
  useEffect(() => {
    setState(filtersToState(filters));
  }, [filters]);

  const update = (patch: Partial<State>) => setState((s) => ({ ...s, ...patch }));

  const apply = () => {
    const sp = new URLSearchParams();
    if (state.brand) {
      sp.set('brand', state.brand);
    }
    if (state.body) {
      sp.set('body', state.body);
    }
    if (state.fuel) {
      sp.set('fuel', state.fuel);
    }
    if (state.transmission) {
      sp.set('transmission', state.transmission);
    }
    if (state.priceMin) {
      sp.set('priceMin', state.priceMin);
    }
    if (state.priceMax) {
      sp.set('priceMax', state.priceMax);
    }
    if (state.yearMin) {
      sp.set('yearMin', state.yearMin);
    }
    if (state.yearMax) {
      sp.set('yearMax', state.yearMax);
    }
    if (state.mileageMin) {
      sp.set('mileageMin', state.mileageMin);
    }
    if (state.mileageMax) {
      sp.set('mileageMax', state.mileageMax);
    }
    // Preserve sort
    const currentSort = params.get('sort');
    if (currentSort) {
      sp.set('sort', currentSort);
    }
    const qs = sp.toString();
    startTransition(() => {
      router.replace(`${pathname}${qs ? `?${qs}` : ''}`);
      if (onApply) {
        onApply();
      }
    });
  };

  const clear = () => {
    setState({
      brand: '',
      body: '',
      fuel: '',
      transmission: '',
      priceMin: '',
      priceMax: '',
      yearMin: '',
      yearMax: '',
      mileageMin: '',
      mileageMax: '',
    });
    startTransition(() => {
      router.replace(pathname);
      if (onApply) {
        onApply();
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    apply();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'flex flex-col',
        layout === 'sheet' ? 'gap-7' : 'gap-8',
      )}
    >
      <div className="flex items-baseline justify-between">
        <h2 className="display text-2xl tracking-tight">{t('title')}</h2>
        <button
          type="button"
          onClick={clear}
          className="text-2xs uppercase tracking-[0.18em] text-graphite hover:text-ink transition-colors duration-150"
        >
          {t('clear')}
        </button>
      </div>

      <Field label={t('brand')}>
        <Select
          value={state.brand}
          onChange={(e) => update({ brand: e.target.value })}
          aria-label={t('brand')}
        >
          <option value="">{t('anyBrand')}</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.slug}>
              {brand.name}
            </option>
          ))}
        </Select>
      </Field>

      <Field label={t('bodyType')}>
        <Select
          value={state.body}
          onChange={(e) => update({ body: e.target.value })}
          aria-label={t('bodyType')}
        >
          <option value="">{t('anyBody')}</option>
          {BODY_TYPES.map((b) => (
            <option key={b} value={b}>
              {tCars(`body.${b}`)}
            </option>
          ))}
        </Select>
      </Field>

      <Field label={t('fuelType')}>
        <Select
          value={state.fuel}
          onChange={(e) => update({ fuel: e.target.value })}
          aria-label={t('fuelType')}
        >
          <option value="">{t('anyFuel')}</option>
          {FUEL_TYPES.map((f) => (
            <option key={f} value={f}>
              {tCars(`fuel.${f}`)}
            </option>
          ))}
        </Select>
      </Field>

      <Field label={t('transmission')}>
        <Select
          value={state.transmission}
          onChange={(e) => update({ transmission: e.target.value })}
          aria-label={t('transmission')}
        >
          <option value="">{t('anyTransmission')}</option>
          {TRANSMISSIONS.map((tr) => (
            <option key={tr} value={tr}>
              {tCars(`transmission.${tr}`)}
            </option>
          ))}
        </Select>
      </Field>

      <Field label={t('priceRange')}>
        <div className="grid grid-cols-2 gap-3">
          <Input
            type="number"
            inputMode="numeric"
            placeholder={t('min')}
            value={state.priceMin}
            onChange={(e) => update({ priceMin: e.target.value })}
            min={0}
            step={500}
            aria-label={`${t('priceRange')} ${t('min')}`}
          />
          <Input
            type="number"
            inputMode="numeric"
            placeholder={t('max')}
            value={state.priceMax}
            onChange={(e) => update({ priceMax: e.target.value })}
            min={0}
            step={500}
            aria-label={`${t('priceRange')} ${t('max')}`}
          />
        </div>
      </Field>

      <Field label={t('yearRange')}>
        <div className="grid grid-cols-2 gap-3">
          <Input
            type="number"
            inputMode="numeric"
            placeholder={t('min')}
            value={state.yearMin}
            onChange={(e) => update({ yearMin: e.target.value })}
            min={1980}
            max={new Date().getFullYear()}
            aria-label={`${t('yearRange')} ${t('min')}`}
          />
          <Input
            type="number"
            inputMode="numeric"
            placeholder={t('max')}
            value={state.yearMax}
            onChange={(e) => update({ yearMax: e.target.value })}
            min={1980}
            max={new Date().getFullYear()}
            aria-label={`${t('yearRange')} ${t('max')}`}
          />
        </div>
      </Field>

      <Field label={t('mileageRange')}>
        <div className="grid grid-cols-2 gap-3">
          <Input
            type="number"
            inputMode="numeric"
            placeholder={t('min')}
            value={state.mileageMin}
            onChange={(e) => update({ mileageMin: e.target.value })}
            min={0}
            step={5000}
            aria-label={`${t('mileageRange')} ${t('min')}`}
          />
          <Input
            type="number"
            inputMode="numeric"
            placeholder={t('max')}
            value={state.mileageMax}
            onChange={(e) => update({ mileageMax: e.target.value })}
            min={0}
            step={5000}
            aria-label={`${t('mileageRange')} ${t('max')}`}
          />
        </div>
      </Field>

      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={pending}
        >
          {t('apply')}
        </Button>
      </div>
    </form>
  );
}
