import { Resend } from 'resend';
import type { InquiryInput } from './inquirySchema';

interface SendInquiryEmailParams {
  inquiry: InquiryInput;
  carTitle?: string;
}

export async function sendInquiryEmail({
  inquiry,
  carTitle,
}: SendInquiryEmailParams): Promise<{ sent: boolean; error?: string }> {
  const apiKey = process.env['RESEND_API_KEY'];
  const from = process.env['INQUIRY_FROM_EMAIL'];
  const to = process.env['INQUIRY_TO_EMAIL'];

  // Graceful fallback — no email config means we silently succeed.
  // The inquiry is still saved to Payload, so nothing is lost.
  if (!apiKey || !from || !to) {
    return { sent: false, error: 'email-not-configured' };
  }

  try {
    const resend = new Resend(apiKey);

    const lines: string[] = [];
    lines.push(`Type: ${inquiry.type}`);
    if (carTitle) {
      lines.push(`Car: ${carTitle}`);
    }
    if (inquiry.carSlug) {
      lines.push(`Slug: ${inquiry.carSlug}`);
    }
    lines.push('');
    lines.push(`Name: ${inquiry.name}`);
    if (inquiry.phone) {
      lines.push(`Phone: ${inquiry.phone}`);
    }
    if (inquiry.email) {
      lines.push(`Email: ${inquiry.email}`);
    }
    if (inquiry.locale) {
      lines.push(`Locale: ${inquiry.locale}`);
    }
    if (inquiry.type === 'sell') {
      lines.push('');
      lines.push('-- Sell details --');
      if (inquiry.sellMake) {
        lines.push(`Make: ${inquiry.sellMake}`);
      }
      if (inquiry.sellModel) {
        lines.push(`Model: ${inquiry.sellModel}`);
      }
      if (inquiry.sellYear) {
        lines.push(`Year: ${inquiry.sellYear}`);
      }
      if (inquiry.sellMileage !== undefined) {
        lines.push(`Mileage: ${inquiry.sellMileage} km`);
      }
      if (inquiry.sellAsking !== undefined) {
        lines.push(`Asking: €${inquiry.sellAsking}`);
      }
    }
    if (inquiry.message) {
      lines.push('');
      lines.push('Message:');
      lines.push(inquiry.message);
    }

    const subject =
      inquiry.type === 'car'
        ? `New car inquiry — ${carTitle ?? inquiry.carSlug ?? 'unknown'}`
        : inquiry.type === 'sell'
          ? `Sell-your-car inquiry — ${inquiry.sellMake ?? ''} ${inquiry.sellModel ?? ''}`.trim()
          : inquiry.type === 'contact'
            ? 'Contact form inquiry'
            : 'New inquiry';

    await resend.emails.send({
      from,
      to,
      replyTo: inquiry.email || undefined,
      subject,
      text: lines.join('\n'),
    });

    return { sent: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { sent: false, error: message };
  }
}
