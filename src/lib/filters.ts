import type { Where } from 'payload';

export const PAGE_SIZE = 12;

export type SortKey =
  | 'newest'
  | 'priceAsc'
  | 'priceDesc'
  | 'yearDesc'
  | 'mileageAsc';

export const SORT_KEYS: readonly SortKey[] = [
  'newest',
  'priceAsc',
  'priceDesc',
  'yearDesc',
  'mileageAsc',
] as const;

export const FUEL_TYPES = [
  'petrol',
  'diesel',
  'hybrid',
  'phev',
  'electric',
] as const;
export type FuelType = (typeof FUEL_TYPES)[number];

export const TRANSMISSIONS = ['manual', 'automatic'] as const;
export type Transmission = (typeof TRANSMISSIONS)[number];

export const BODY_TYPES = [
  'sedan',
  'suv',
  'coupe',
  'hatchback',
  'wagon',
  'convertible',
  'pickup',
] as const;
export type BodyType = (typeof BODY_TYPES)[number];

export interface Filters {
  brand?: string;
  body?: BodyType;
  fuel?: FuelType;
  transmission?: Transmission;
  priceMin?: number;
  priceMax?: number;
  yearMin?: number;
  yearMax?: number;
  mileageMin?: number;
  mileageMax?: number;
  sort: SortKey;
  page: number;
}

function parseInt0(value: string | string[] | undefined): number | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

function parseStr<T extends string>(
  value: string | string[] | undefined,
  allowed: readonly T[],
): T | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }
  return (allowed as readonly string[]).includes(value) ? (value as T) : undefined;
}

export function parseFilters(
  search: Record<string, string | string[] | undefined>,
): Filters {
  const sort = parseStr(search['sort'], SORT_KEYS) ?? 'newest';
  const pageRaw = parseInt0(search['page']) ?? 1;
  const page = pageRaw < 1 ? 1 : pageRaw;

  const brandRaw = search['brand'];
  const brand = typeof brandRaw === 'string' && brandRaw ? brandRaw : undefined;

  return {
    brand,
    body: parseStr(search['body'], BODY_TYPES),
    fuel: parseStr(search['fuel'], FUEL_TYPES),
    transmission: parseStr(search['transmission'], TRANSMISSIONS),
    priceMin: parseInt0(search['priceMin']),
    priceMax: parseInt0(search['priceMax']),
    yearMin: parseInt0(search['yearMin']),
    yearMax: parseInt0(search['yearMax']),
    mileageMin: parseInt0(search['mileageMin']),
    mileageMax: parseInt0(search['mileageMax']),
    sort,
    page,
  };
}

export function countActiveFilters(f: Filters): number {
  let n = 0;
  if (f.brand) {
    n += 1;
  }
  if (f.body) {
    n += 1;
  }
  if (f.fuel) {
    n += 1;
  }
  if (f.transmission) {
    n += 1;
  }
  if (f.priceMin !== undefined || f.priceMax !== undefined) {
    n += 1;
  }
  if (f.yearMin !== undefined || f.yearMax !== undefined) {
    n += 1;
  }
  if (f.mileageMin !== undefined || f.mileageMax !== undefined) {
    n += 1;
  }
  return n;
}

export function filtersToQuery(f: Filters): URLSearchParams {
  const params = new URLSearchParams();
  if (f.brand) {
    params.set('brand', f.brand);
  }
  if (f.body) {
    params.set('body', f.body);
  }
  if (f.fuel) {
    params.set('fuel', f.fuel);
  }
  if (f.transmission) {
    params.set('transmission', f.transmission);
  }
  if (f.priceMin !== undefined) {
    params.set('priceMin', String(f.priceMin));
  }
  if (f.priceMax !== undefined) {
    params.set('priceMax', String(f.priceMax));
  }
  if (f.yearMin !== undefined) {
    params.set('yearMin', String(f.yearMin));
  }
  if (f.yearMax !== undefined) {
    params.set('yearMax', String(f.yearMax));
  }
  if (f.mileageMin !== undefined) {
    params.set('mileageMin', String(f.mileageMin));
  }
  if (f.mileageMax !== undefined) {
    params.set('mileageMax', String(f.mileageMax));
  }
  if (f.sort !== 'newest') {
    params.set('sort', f.sort);
  }
  if (f.page > 1) {
    params.set('page', String(f.page));
  }
  return params;
}

export function applyFiltersToWhere(f: Filters, brandIdMap: Record<string, string>): Where {
  const where: Where = {
    status: { not_equals: 'sold' },
  };

  if (f.brand && brandIdMap[f.brand]) {
    where['brand'] = { equals: brandIdMap[f.brand] };
  }
  if (f.body) {
    where['bodyType'] = { equals: f.body };
  }
  if (f.fuel) {
    where['fuelType'] = { equals: f.fuel };
  }
  if (f.transmission) {
    where['transmission'] = { equals: f.transmission };
  }

  const price: Record<string, number> = {};
  if (f.priceMin !== undefined) {
    price['greater_than_equal'] = f.priceMin;
  }
  if (f.priceMax !== undefined) {
    price['less_than_equal'] = f.priceMax;
  }
  if (Object.keys(price).length > 0) {
    where['price'] = price;
  }

  const year: Record<string, number> = {};
  if (f.yearMin !== undefined) {
    year['greater_than_equal'] = f.yearMin;
  }
  if (f.yearMax !== undefined) {
    year['less_than_equal'] = f.yearMax;
  }
  if (Object.keys(year).length > 0) {
    where['year'] = year;
  }

  const mileage: Record<string, number> = {};
  if (f.mileageMin !== undefined) {
    mileage['greater_than_equal'] = f.mileageMin;
  }
  if (f.mileageMax !== undefined) {
    mileage['less_than_equal'] = f.mileageMax;
  }
  if (Object.keys(mileage).length > 0) {
    where['mileage'] = mileage;
  }

  return where;
}

export function sortToPayload(sort: SortKey): string {
  switch (sort) {
    case 'priceAsc': {
      return 'price';
    }
    case 'priceDesc': {
      return '-price';
    }
    case 'yearDesc': {
      return '-year';
    }
    case 'mileageAsc': {
      return 'mileage';
    }
    case 'newest':
    default: {
      return '-createdAt';
    }
  }
}
