import type {
  CollectionConfig,
  CollectionBeforeChangeHook,
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
} from 'payload';
import slugify from 'slugify';
import {
  TAG_CARS_INDEX,
  TAG_HOMEPAGE,
  TAG_INVENTORY_COUNT,
  carDetailTag,
} from '@/lib/cacheTags';

const beforeChangeSlug: CollectionBeforeChangeHook = ({ data, originalDoc }) => {
  if (!data) {
    return data;
  }
  // Auto-generate slug from title (English) or model when missing.
  // Slug is NOT localized — it's a single shared field.
  if (!data['slug'] || typeof data['slug'] !== 'string' || data['slug'].length === 0) {
    let source = '';
    if (typeof data['title'] === 'string') {
      source = data['title'];
    } else if (originalDoc && typeof originalDoc['title'] === 'string') {
      source = originalDoc['title'];
    }
    if (!source && typeof data['model'] === 'string') {
      source = data['model'];
    }
    if (source) {
      data['slug'] = slugify(source, { lower: true, strict: true });
    }
  }
  return data;
};

const pingRevalidate = async (tags: string[]): Promise<void> => {
  const secret = process.env['REVALIDATE_SECRET'];
  const baseUrl = process.env['NEXT_PUBLIC_SITE_URL'] || 'http://localhost:3000';
  if (!secret) {
    return;
  }
  try {
    await fetch(`${baseUrl}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-revalidate-secret': secret,
      },
      body: JSON.stringify({ tags }),
    });
  } catch {
    // Best-effort.
  }
};

const afterChangeRevalidate: CollectionAfterChangeHook = async ({ doc }) => {
  const tags = [TAG_CARS_INDEX, TAG_HOMEPAGE, TAG_INVENTORY_COUNT];
  if (doc && typeof doc['slug'] === 'string') {
    tags.push(carDetailTag(doc['slug']));
  }
  await pingRevalidate(tags);
};

const afterDeleteRevalidate: CollectionAfterDeleteHook = async ({ doc }) => {
  const tags = [TAG_CARS_INDEX, TAG_HOMEPAGE, TAG_INVENTORY_COUNT];
  if (doc && typeof doc['slug'] === 'string') {
    tags.push(carDetailTag(doc['slug']));
  }
  await pingRevalidate(tags);
};

export const Cars: CollectionConfig = {
  slug: 'cars',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'brand', 'year', 'price', 'status', 'featured'],
    listSearchableFields: ['title', 'model', 'vin', 'slug'],
  },
  hooks: {
    beforeChange: [beforeChangeSlug],
    afterChange: [afterChangeRevalidate],
    afterDelete: [afterDeleteRevalidate],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Display title (e.g. "BMW M340i xDrive").',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      // NOT localized — slug is shared across all locales.
      admin: {
        description: 'URL slug, shared across all locales. Auto-generated from title; edit if needed.',
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      type: 'richText',
      localized: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'brand',
          type: 'relationship',
          relationTo: 'brands',
          required: true,
          index: true,
        },
        {
          name: 'model',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'year',
          type: 'number',
          required: true,
          min: 1950,
          max: new Date().getFullYear() + 1,
          index: true,
        },
        {
          name: 'vin',
          type: 'text',
          required: true,
          unique: true,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'price',
          type: 'number',
          required: true,
          min: 0,
          index: true,
          admin: {
            description: 'Price in EUR.',
          },
        },
        {
          name: 'priceOnRequest',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Hide the price and show "Price on request" instead.',
          },
        },
      ],
    },
    {
      name: 'mileage',
      type: 'number',
      required: true,
      min: 0,
      index: true,
      admin: {
        description: 'Mileage in kilometres.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'fuelType',
          type: 'select',
          required: true,
          index: true,
          options: [
            { label: 'Petrol', value: 'petrol' },
            { label: 'Diesel', value: 'diesel' },
            { label: 'Hybrid', value: 'hybrid' },
            { label: 'Plug-in Hybrid', value: 'phev' },
            { label: 'Electric', value: 'electric' },
          ],
        },
        {
          name: 'transmission',
          type: 'select',
          required: true,
          index: true,
          options: [
            { label: 'Manual', value: 'manual' },
            { label: 'Automatic', value: 'automatic' },
          ],
        },
        {
          name: 'bodyType',
          type: 'select',
          required: true,
          index: true,
          options: [
            { label: 'Sedan', value: 'sedan' },
            { label: 'SUV', value: 'suv' },
            { label: 'Coupe', value: 'coupe' },
            { label: 'Hatchback', value: 'hatchback' },
            { label: 'Wagon', value: 'wagon' },
            { label: 'Convertible', value: 'convertible' },
            { label: 'Pickup', value: 'pickup' },
          ],
        },
      ],
    },
    {
      name: 'color',
      type: 'text',
      localized: true,
    },
    {
      name: 'engine',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'displacement',
              type: 'number',
              admin: { description: 'cc' },
            },
            {
              name: 'powerHp',
              type: 'number',
              admin: { description: 'horsepower' },
            },
            {
              name: 'torqueNm',
              type: 'number',
              admin: { description: 'Nm' },
            },
          ],
        },
        {
          name: 'driveType',
          type: 'select',
          options: [
            { label: 'Front-wheel drive', value: 'fwd' },
            { label: 'Rear-wheel drive', value: 'rwd' },
            { label: 'All-wheel drive', value: 'awd' },
          ],
        },
      ],
    },
    {
      name: 'features',
      type: 'array',
      localized: true,
      labels: {
        singular: 'Feature',
        plural: 'Features',
      },
      fields: [
        {
          name: 'feature',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'images',
      type: 'array',
      minRows: 1,
      maxRows: 30,
      labels: {
        singular: 'Image',
        plural: 'Images',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
          localized: true,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'available',
          index: true,
          options: [
            { label: 'Available', value: 'available' },
            { label: 'Reserved', value: 'reserved' },
            { label: 'Sold', value: 'sold' },
          ],
        },
        {
          name: 'featured',
          type: 'checkbox',
          defaultValue: false,
          index: true,
          admin: {
            description: 'Show on the homepage featured strip.',
          },
        },
      ],
    },
    {
      name: 'meta',
      type: 'group',
      label: 'SEO',
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
          maxLength: 200,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          // image is NOT localized — same OG image works for all locales
        },
      ],
    },
  ],
};
