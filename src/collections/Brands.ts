import type { CollectionConfig, CollectionBeforeChangeHook, CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload';
import slugify from 'slugify';
import { TAG_BRANDS_INDEX, TAG_HOMEPAGE } from '@/lib/cacheTags';

const beforeChangeSlug: CollectionBeforeChangeHook = ({ data }) => {
  if (data && typeof data['name'] === 'string' && (!data['slug'] || typeof data['slug'] !== 'string' || data['slug'].length === 0)) {
    data['slug'] = slugify(data['name'], { lower: true, strict: true });
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
    // Best-effort — don't fail the Payload write if revalidation ping fails.
  }
};

const afterChangeRevalidate: CollectionAfterChangeHook = async () => {
  await pingRevalidate([TAG_BRANDS_INDEX, TAG_HOMEPAGE]);
};

const afterDeleteRevalidate: CollectionAfterDeleteHook = async () => {
  await pingRevalidate([TAG_BRANDS_INDEX, TAG_HOMEPAGE]);
};

export const Brands: CollectionConfig = {
  slug: 'brands',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'logo'],
  },
  hooks: {
    beforeChange: [beforeChangeSlug],
    afterChange: [afterChangeRevalidate],
    afterDelete: [afterDeleteRevalidate],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Auto-generated from name on save. Edit only if needed.',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
  ],
};
