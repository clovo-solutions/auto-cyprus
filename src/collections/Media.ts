import type { CollectionConfig } from 'payload';

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'filename',
  },
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*'],
    formatOptions: {
      format: 'webp',
      options: { quality: 82 },
    },
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
        formatOptions: { format: 'webp', options: { quality: 82 } },
      },
      {
        name: 'card',
        width: 800,
        height: 600,
        position: 'centre',
        formatOptions: { format: 'webp', options: { quality: 82 } },
      },
      {
        name: 'hero',
        width: 1600,
        height: 900,
        position: 'centre',
        formatOptions: { format: 'webp', options: { quality: 82 } },
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        position: 'centre',
        formatOptions: { format: 'webp', options: { quality: 82 } },
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      localized: true,
      required: false,
      admin: {
        description: 'Describe the image for screen readers and SEO.',
      },
    },
    {
      name: 'caption',
      type: 'text',
      localized: true,
      required: false,
    },
  ],
};
