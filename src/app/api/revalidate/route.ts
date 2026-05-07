import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { revalidateTag } from 'next/cache';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const expected = process.env['REVALIDATE_SECRET'];
  if (!expected) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }
  const provided = req.headers.get('x-revalidate-secret');
  if (provided !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { tags?: unknown };
  try {
    body = (await req.json()) as { tags?: unknown };
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!Array.isArray(body.tags)) {
    return NextResponse.json({ error: 'tags must be an array' }, { status: 400 });
  }

  const tags = body.tags.filter((t): t is string => typeof t === 'string');
  if (tags.length === 0) {
    return NextResponse.json({ error: 'no valid tags provided' }, { status: 400 });
  }

  for (const tag of tags) {
    revalidateTag(tag);
  }

  return NextResponse.json({ ok: true, revalidated: tags });
}
