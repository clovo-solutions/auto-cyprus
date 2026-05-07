export const TAG_HOMEPAGE = 'homepage';
export const TAG_CARS_INDEX = 'cars:index';
export const TAG_BRANDS_INDEX = 'brands:index';
export const TAG_INVENTORY_COUNT = 'inventory:count';
export const TAG_CAR_DETAIL = 'car:detail';

export function carDetailTag(slug: string): string {
  return `${TAG_CAR_DETAIL}:${slug}`;
}
