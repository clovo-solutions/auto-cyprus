import crypto from 'node:crypto';

const TOKEN_TTL_MS = 1000 * 60 * 60 * 6; // 6 hours

function getSecret(): string {
  const secret = process.env['INQUIRY_HMAC_SECRET'];
  if (!secret || secret.length < 8) {
    // In dev we don't want to crash, but we don't want a silent insecure mode either.
    // Use a deterministic dev-only fallback that at least keeps things working locally.
    if (process.env.NODE_ENV !== 'production') {
      return 'dev-inquiry-hmac-secret-not-secure';
    }
    throw new Error('INQUIRY_HMAC_SECRET is not configured');
  }
  return secret;
}

function sign(input: string): string {
  return crypto
    .createHmac('sha256', getSecret())
    .update(input)
    .digest('base64url');
}

/**
 * Issue a token bound to an issued-at timestamp.
 * The token is `${issuedAt}.${signature}` where signature = HMAC(issuedAt).
 */
export function issueToken(issuedAt: number = Date.now()): string {
  const sig = sign(String(issuedAt));
  return `${issuedAt}.${sig}`;
}

export function verifyToken(token: string): { valid: boolean; issuedAt?: number } {
  if (typeof token !== 'string' || !token.includes('.')) {
    return { valid: false };
  }
  const [issuedAtRaw, sig] = token.split('.', 2);
  if (!issuedAtRaw || !sig) {
    return { valid: false };
  }
  const issuedAt = Number.parseInt(issuedAtRaw, 10);
  if (!Number.isFinite(issuedAt)) {
    return { valid: false };
  }
  const expected = sign(String(issuedAt));
  // timing-safe compare
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) {
    return { valid: false };
  }
  if (!crypto.timingSafeEqual(a, b)) {
    return { valid: false };
  }
  if (Date.now() - issuedAt > TOKEN_TTL_MS) {
    return { valid: false };
  }
  return { valid: true, issuedAt };
}
