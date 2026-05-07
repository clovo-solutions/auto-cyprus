import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { InquirySchema } from '@/lib/inquirySchema';
import { verifyToken } from '@/lib/inquiryToken';
import { checkRateLimit, sweepRateLimits } from '@/lib/inquiryRateLimit';
import { getPayloadClient } from '@/lib/payload';
import { sendInquiryEmail } from '@/lib/inquiryEmail';
import type { Car } from '@/payload-types';

const MIN_RENDER_TO_SUBMIT_MS = 1200;

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0];
    if (first) {
      return first.trim();
    }
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return 'unknown';
}

export async function POST(req: NextRequest) {
  sweepRateLimits();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = InquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const data = parsed.data;

  // Honeypot
  if (data.website && data.website.trim().length > 0) {
    // Pretend success — never reveal the trap
    return NextResponse.json({ ok: true });
  }

  // Time-trap — form must have been on screen at least 1.2s
  const renderedDelta = Date.now() - data.renderedAt;
  if (renderedDelta < MIN_RENDER_TO_SUBMIT_MS) {
    return NextResponse.json({ ok: true });
  }
  if (renderedDelta < 0 || renderedDelta > 1000 * 60 * 60 * 12) {
    // Clock skew or stale
    return NextResponse.json({ error: 'Token expired' }, { status: 400 });
  }

  // HMAC token
  const tokenResult = verifyToken(data.token);
  if (!tokenResult.valid) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
  }

  // Rate limit
  const ip = getClientIp(req);
  const rateKey = `${ip}:${data.type}`;
  const rate = checkRateLimit(rateKey);
  if (!rate.ok) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil(rate.resetMs / 1000)),
        },
      },
    );
  }

  // Persist
  try {
    const payload = await getPayloadClient();
    let carRef: string | undefined;
    let carTitle: string | undefined;

    if (data.type === 'car' && (data.carId || data.carSlug)) {
      if (data.carId) {
        carRef = String(data.carId);
      } else if (data.carSlug) {
        const result = await payload.find({
          collection: 'cars',
          where: { slug: { equals: data.carSlug } },
          limit: 1,
          depth: 0,
        });
        const first = result.docs[0];
        if (first) {
          carRef = String(first.id);
          carTitle = (first as Car).title;
        }
      }
    }

    await payload.create({
      collection: 'inquiries',
      data: {
        type: data.type,
        car: carRef,
        name: data.name,
        phone: data.phone || null,
        email: data.email || null,
        message: data.message || null,
        sellDetails:
          data.type === 'sell'
            ? {
                make: data.sellMake || null,
                model: data.sellModel || null,
                year: data.sellYear || null,
                mileage: data.sellMileage || null,
                askingPrice: data.sellAsking || null,
              }
            : undefined,
        locale: data.locale || 'en',
        status: 'new',
        meta: {
          ip,
          userAgent: req.headers.get('user-agent') || null,
          sourceUrl: req.headers.get('referer') || null,
        },
      },
    });

    // Fire and forget — don't make the user wait on email send
    void sendInquiryEmail({ inquiry: data, carTitle });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[inquiry] persist failed', message);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
