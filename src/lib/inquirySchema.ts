import { z } from 'zod';

export const InquiryType = z.enum(['car', 'general', 'sell', 'contact']);
export type InquiryTypeT = z.infer<typeof InquiryType>;

export const inquiryLocale = z.enum(['en', 'gr', 'ru']);

const baseSchema = z.object({
  type: InquiryType,
  name: z.string().min(2, 'Please enter your name').max(120),
  phone: z.string().min(5, 'Please enter a phone number').max(40).optional().or(z.literal('')),
  email: z.string().email('Please enter a valid email').max(200).optional().or(z.literal('')),
  message: z.string().max(4000).optional().or(z.literal('')),
  carId: z.union([z.string(), z.number()]).optional(),
  carSlug: z.string().max(200).optional(),
  locale: inquiryLocale.optional(),
  // Anti-bot
  website: z.string().max(0).optional().or(z.literal('')),
  renderedAt: z.number().int(),
  token: z.string().min(10),
  // Sell-only fields
  sellMake: z.string().max(80).optional(),
  sellModel: z.string().max(120).optional(),
  sellYear: z.number().int().min(1950).max(new Date().getFullYear() + 1).optional(),
  sellMileage: z.number().int().min(0).max(2_000_000).optional(),
  sellAsking: z.number().int().min(0).max(10_000_000).optional(),
});

export const InquirySchema = baseSchema.refine(
  (data) => {
    // Either phone or email must be present
    const hasPhone = data.phone && data.phone.trim().length > 0;
    const hasEmail = data.email && data.email.trim().length > 0;
    return Boolean(hasPhone || hasEmail);
  },
  {
    message: 'Please provide either a phone number or an email',
    path: ['phone'],
  },
);

export type InquiryInput = z.infer<typeof InquirySchema>;
