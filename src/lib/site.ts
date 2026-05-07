function trimOrFallback(value: string | undefined, fallback: string): string {
  return value && value.trim() !== '' ? value.trim() : fallback;
}

export const site = {
  name: 'Auto Cyprus',
  shortName: 'Auto // Cyprus',
  url: trimOrFallback(process.env.NEXT_PUBLIC_SITE_URL, 'http://localhost:3000'),
  phone: trimOrFallback(process.env.NEXT_PUBLIC_PHONE, '+35795149488'),
  whatsapp: trimOrFallback(process.env.NEXT_PUBLIC_WHATSAPP, '+35795149488'),
  email: trimOrFallback(process.env.NEXT_PUBLIC_EMAIL, 'hello@autocyprus.example'),
  address: trimOrFallback(process.env.NEXT_PUBLIC_ADDRESS, 'Pafou 57, Limassol 3051, Cyprus'),
  geo: {
    lat: 35.1856,
    lng: 33.3823,
  },
};

function digitsOnly(value: string): string {
  return value.replace(/[^\d+]/g, '');
}

export function phoneHref(): string {
  return `tel:${digitsOnly(site.phone)}`;
}

export function whatsappHref(): string {
  // wa.me requires no leading +
  const cleaned = digitsOnly(site.whatsapp).replace(/^\+/, '');
  return `https://wa.me/${cleaned}`;
}

export function emailHref(subject?: string): string {
  if (subject) {
    return `mailto:${site.email}?subject=${encodeURIComponent(subject)}`;
  }
  return `mailto:${site.email}`;
}

export function mapsHref(): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address)}`;
}
