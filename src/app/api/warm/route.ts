import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getPayloadClient } from '@/lib/payload';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const userAgent = req.headers.get('user-agent') || '';
  const isVercelCron = userAgent.toLowerCase().includes('vercel-cron');

  const expectedSecret = process.env['WARM_SECRET'];
  const providedSecret = req.headers.get('x-warm-secret');
  const hasValidSecret =
    expectedSecret && providedSecret && providedSecret === expectedSecret;

  // In production, require either Vercel cron UA or matching secret.
  if (process.env.NODE_ENV === 'production') {
    if (!isVercelCron && !hasValidSecret) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  // Tickle the DB — keeps Atlas M0 warm.
  try {
    const payload = await getPayloadClient();
    const result = await payload.count({
      collection: 'cars',
      where: { status: { equals: 'available' } },
    });
    return NextResponse.json({
      ok: true,
      warmedAt: new Date().toISOString(),
      inventoryCount: result.totalDocs,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { ok: false, error: message },
      { status: 503 },
    );
  }
}
