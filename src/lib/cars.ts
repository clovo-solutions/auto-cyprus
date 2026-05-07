import { unstable_cache } from 'next/cache';
import { getPayloadClient } from './payload';
import type { Where } from 'payload';
import type { Locale } from '@/i18n/config';
import type { Car, Brand } from '@/payload-types';
import {
  TAG_CARS_INDEX,
  TAG_BRANDS_INDEX,
  TAG_INVENTORY_COUNT,
  TAG_HOMEPAGE,
  carDetailTag,
} from './cacheTags';
import {
  applyFiltersToWhere,
  sortToPayload,
  PAGE_SIZE,
  type Filters,
} from './filters';

interface FindCarsResult {
  docs: Car[];
  totalDocs: number;
  totalPages: number;
  page: number;
}

export async function findAllBrands(locale: Locale): Promise<Brand[]> {
  return unstable_cache(
    async () => {
      const payload = await getPayloadClient();
      const result = await payload.find({
        collection: 'brands',
        locale,
        limit: 100,
        sort: 'name',
        depth: 1,
      });
      return result.docs as Brand[];
    },
    ['brands', locale],
    { tags: [TAG_BRANDS_INDEX], revalidate: 3600 },
  )();
}

export async function getInventoryCount(): Promise<number> {
  return unstable_cache(
    async () => {
      const payload = await getPayloadClient();
      const result = await payload.count({
        collection: 'cars',
        where: { status: { equals: 'available' } },
      });
      return result.totalDocs;
    },
    ['inventory-count'],
    { tags: [TAG_INVENTORY_COUNT], revalidate: 600 },
  )();
}

export async function findFeaturedCars(locale: Locale, limit = 6): Promise<Car[]> {
  return unstable_cache(
    async () => {
      const payload = await getPayloadClient();
      const result = await payload.find({
        collection: 'cars',
        locale,
        where: {
          and: [
            { status: { equals: 'available' } },
            { featured: { equals: true } },
          ],
        },
        limit,
        sort: '-createdAt',
        depth: 2,
      });
      // Fall back to most-recent-available if no explicitly featured cars exist
      if (result.docs.length === 0) {
        const fallback = await payload.find({
          collection: 'cars',
          locale,
          where: { status: { equals: 'available' } },
          limit,
          sort: '-createdAt',
          depth: 2,
        });
        return fallback.docs as Car[];
      }
      return result.docs as Car[];
    },
    ['featured-cars', locale, String(limit)],
    { tags: [TAG_HOMEPAGE, TAG_CARS_INDEX], revalidate: 300 },
  )();
}

export async function findCars(
  locale: Locale,
  filters: Filters,
): Promise<FindCarsResult> {
  return unstable_cache(
    async () => {
      const payload = await getPayloadClient();

      // Resolve brand slug → id (Payload `where` needs the id, not the slug)
      const brandIdMap: Record<string, string> = {};
      if (filters.brand) {
        const brandResult = await payload.find({
          collection: 'brands',
          where: { slug: { equals: filters.brand } },
          limit: 1,
          depth: 0,
        });
        const first = brandResult.docs[0];
        if (first) {
          brandIdMap[filters.brand] = String(first.id);
        }
      }

      const where = applyFiltersToWhere(filters, brandIdMap);
      const sort = sortToPayload(filters.sort);

      const result = await payload.find({
        collection: 'cars',
        locale,
        where,
        sort,
        limit: PAGE_SIZE,
        page: filters.page,
        depth: 2,
      });

      return {
        docs: result.docs as Car[],
        totalDocs: result.totalDocs,
        totalPages: result.totalPages,
        page: result.page ?? filters.page,
      };
    },
    ['cars-list', locale, JSON.stringify(filters)],
    { tags: [TAG_CARS_INDEX], revalidate: 300 },
  )();
}

export async function findCarBySlug(
  locale: Locale,
  slug: string,
): Promise<Car | null> {
  return unstable_cache(
    async () => {
      const payload = await getPayloadClient();
      const result = await payload.find({
        collection: 'cars',
        locale,
        where: { slug: { equals: slug } },
        limit: 1,
        depth: 2,
      });
      const first = result.docs[0];
      return first ? (first as Car) : null;
    },
    ['car-by-slug', locale, slug],
    { tags: [carDetailTag(slug), TAG_CARS_INDEX], revalidate: 300 },
  )();
}

export async function findSimilarCars(
  locale: Locale,
  car: Car,
  limit = 3,
): Promise<Car[]> {
  return unstable_cache(
    async () => {
      const payload = await getPayloadClient();
      const brandId =
        car.brand && typeof car.brand === 'object' && 'id' in car.brand
          ? car.brand.id
          : null;

      const where: Where = {
        and: [
          { id: { not_equals: car.id } },
          { status: { equals: 'available' } },
          {
            or: [
              ...(brandId ? [{ brand: { equals: brandId } }] : []),
              { bodyType: { equals: car.bodyType } },
            ],
          },
        ],
      };

      const result = await payload.find({
        collection: 'cars',
        locale,
        where,
        limit,
        sort: '-createdAt',
        depth: 2,
      });
      return result.docs as Car[];
    },
    ['similar-cars', locale, String(car.id), String(limit)],
    { tags: [TAG_CARS_INDEX], revalidate: 600 },
  )();
}

export async function findAllCarSlugs(): Promise<string[]> {
  return unstable_cache(
    async () => {
      const payload = await getPayloadClient();
      const result = await payload.find({
        collection: 'cars',
        limit: 1000,
        depth: 0,
        select: { slug: true },
      });
      return result.docs
        .map((doc) => doc.slug)
        .filter((slug): slug is string => typeof slug === 'string' && slug.length > 0);
    },
    ['car-slugs'],
    { tags: [TAG_CARS_INDEX], revalidate: 3600 },
  )();
}

export async function findBodyTypeCounts(): Promise<Record<string, number>> {
  return unstable_cache(
    async () => {
      const payload = await getPayloadClient();
      const result = await payload.find({
        collection: 'cars',
        where: { status: { equals: 'available' } },
        limit: 1000,
        depth: 0,
        select: { bodyType: true },
      });
      const counts: Record<string, number> = {};
      for (const car of result.docs) {
        if (car.bodyType) {
          counts[car.bodyType] = (counts[car.bodyType] ?? 0) + 1;
        }
      }
      return counts;
    },
    ['body-type-counts'],
    { tags: [TAG_CARS_INDEX, TAG_INVENTORY_COUNT], revalidate: 300 },
  )();
}

export async function resolveCar(
  locale: Locale,
  slug: string,
): Promise<Car | null> {
  return findCarBySlug(locale, slug);
}
