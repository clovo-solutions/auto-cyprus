import { setRequestLocale } from 'next-intl/server';
import { isLocale } from '@/i18n/config';
import { notFound } from 'next/navigation';
import { Hero } from '@/components/home/Hero';
import { TrustStrip } from '@/components/home/TrustStrip';
import { BrandWall } from '@/components/home/BrandWall';
import { HowItWorks } from '@/components/home/HowItWorks';
import { Categories } from '@/components/home/Categories';
import { CustomerWall } from '@/components/home/CustomerWall';
import { getInventoryCount } from '@/lib/cars';

export const revalidate = 600;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const inventoryCount = await getInventoryCount();

  return (
    <>
      <Hero locale={locale} inventoryCount={inventoryCount} />
      <TrustStrip locale={locale} />
      <BrandWall locale={locale} />
      <HowItWorks locale={locale} />
      <Categories locale={locale} />
      <CustomerWall locale={locale} />
    </>
  );
}
