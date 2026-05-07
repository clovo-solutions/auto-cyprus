import type { CollectionConfig } from 'payload';

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  access: {
    // Only authenticated admin users can read/edit inquiries.
    // The public POST happens via /api/inquiry which uses Payload's local API.
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'status', 'phone', 'email', 'createdAt'],
    listSearchableFields: ['name', 'phone', 'email', 'message'],
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Car inquiry', value: 'car' },
        { label: 'General', value: 'general' },
        { label: 'Sell your car', value: 'sell' },
        { label: 'Contact form', value: 'contact' },
      ],
    },
    {
      name: 'car',
      type: 'relationship',
      relationTo: 'cars',
      admin: {
        condition: (data) => data?.type === 'car',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'phone',
          type: 'text',
        },
        {
          name: 'email',
          type: 'email',
        },
      ],
    },
    {
      name: 'message',
      type: 'textarea',
    },
    {
      name: 'sellDetails',
      type: 'group',
      admin: {
        condition: (data) => data?.type === 'sell',
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'make', type: 'text' },
            { name: 'model', type: 'text' },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'year', type: 'number' },
            { name: 'mileage', type: 'number' },
            { name: 'askingPrice', type: 'number' },
          ],
        },
      ],
    },
    {
      name: 'locale',
      type: 'select',
      defaultValue: 'en',
      options: [
        { label: 'English', value: 'en' },
        { label: 'Greek', value: 'gr' },
        { label: 'Russian', value: 'ru' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Closed', value: 'closed' },
      ],
    },
    {
      name: 'meta',
      type: 'group',
      admin: {
        position: 'sidebar',
      },
      fields: [
        { name: 'ip', type: 'text' },
        { name: 'userAgent', type: 'text' },
        { name: 'sourceUrl', type: 'text' },
      ],
    },
  ],
};
