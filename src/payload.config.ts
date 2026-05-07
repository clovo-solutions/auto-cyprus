import path from 'path';
import { fileURLToPath } from 'url';
import { buildConfig } from 'payload';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { s3Storage } from '@payloadcms/storage-s3';
import sharp from 'sharp';

import { Users } from './collections/Users';
import { Media } from './collections/Media';
import { Brands } from './collections/Brands';
import { Cars } from './collections/Cars';
import { Inquiries } from './collections/Inquiries';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const s3Configured = Boolean(
  process.env['S3_ACCESS_KEY_ID'] &&
    process.env['S3_SECRET_ACCESS_KEY'] &&
    process.env['S3_BUCKET'] &&
    process.env['S3_ENDPOINT'] &&
    process.env['S3_PUBLIC_URL'],
);

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— Auto Cyprus',
    },
  },
  collections: [Users, Media, Brands, Cars, Inquiries],
  editor: lexicalEditor(),
  secret: process.env['PAYLOAD_SECRET'] || 'dev-secret-do-not-use-in-prod',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env['DATABASE_URI'] || '',
  }),
  sharp,
  localization: {
    locales: [
      { code: 'en', label: 'English' },
      { code: 'gr', label: 'Ελληνικά (Greek)' },
      { code: 'ru', label: 'Русский (Russian)' },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  plugins: s3Configured
    ? [
        s3Storage({
          collections: {
            media: {
              prefix: 'media',
              // Serve files directly from the R2 public CDN URL.
              // Called on every afterRead, so existing uploads are also fixed.
              generateFileURL: ({ filename, prefix }) => {
                const base = process.env['S3_PUBLIC_URL']!;
                const dir = prefix ? `${prefix}/` : '';
                return `${base}/${dir}${filename}`;
              },
            },
          },
          bucket: process.env['S3_BUCKET']!,
          config: {
            endpoint: process.env['S3_ENDPOINT']!,
            region: process.env['S3_REGION'] || 'auto',
            credentials: {
              accessKeyId: process.env['S3_ACCESS_KEY_ID']!,
              secretAccessKey: process.env['S3_SECRET_ACCESS_KEY']!,
            },
            forcePathStyle: true,
          },
        }),
      ]
    : [],
  cors: '*',
  csrf: process.env['NEXT_PUBLIC_SITE_URL'] ? [process.env['NEXT_PUBLIC_SITE_URL']] : undefined,
});
