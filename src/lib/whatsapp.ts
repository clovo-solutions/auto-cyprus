import { site } from './site';

function digitsOnly(value: string): string {
  return value.replace(/[^\d]/g, '');
}

export function buildWhatsAppLink(message?: string): string {
  const number = digitsOnly(site.whatsapp);
  if (message && message.trim()) {
    return `https://wa.me/${number}?text=${encodeURIComponent(message.trim())}`;
  }
  return `https://wa.me/${number}`;
}
