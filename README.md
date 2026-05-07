# Auto Cyprus

A premium used-car dealership website for Cyprus. Editorial design, multilingual (English / Greek / Russian), built on Next.js 15 and Payload CMS 3.

> "We keep the lot small so we know every car personally." — the brand voice that drives every choice in the design.

---

## Stack

- **Next.js 15** (App Router, React 19, Server Components by default)
- **Payload CMS 3** (MongoDB via Mongoose adapter, integrated into the same Next app)
- **Tailwind CSS v4** (configured via the `@theme` directive in `src/app/(frontend)/styles.css` — no `tailwind.config.js`)
- **next-intl** for `en` / `gr` / `ru` localization
- **Cloudflare R2** for media storage (S3-compatible)
- **Resend** for inquiry emails
- **Framer Motion** for restrained, reduced-motion-aware reveal animations
- **Zod** for inquiry validation
- **TypeScript strict** with `noUncheckedIndexedAccess`

## Architecture decisions worth knowing

- **Locale codes are `en`, `gr`, `ru`.** `gr` is non-standard for Greek — the ISO code is `el`. We use `gr` for URL branding (the customer-facing locale prefix) and map back to `el` / `el-CY` anywhere a real BCP-47 tag is needed (hreflang, `Intl` APIs). See `src/i18n/config.ts`.
- **URLs are English across every locale.** `/en/cars`, `/gr/cars`, `/ru/cars` — paths never get translated. `next-intl` is configured without a `pathnames` map.
- **Slugs are not localized.** A car has a single `slug` field shared across all locales; only the title, description, color, features, and meta fields are localized. This keeps URLs stable and simplifies the data model.
- **Cron warmup every 5 min.** Atlas M0 sleeps after inactivity. `vercel.json` schedules a `*/5 * * * *` cron that hits `/api/warm`, which runs a tiny `payload.count` query to keep the connection pool alive.
- **Caching by tag, not time.** Read-side calls in `src/lib/cars.ts` are wrapped in `unstable_cache` with explicit tags (`cars:index`, `homepage`, `car:detail:<slug>`, etc.). Payload `afterChange` / `afterDelete` hooks ping `/api/revalidate` with the relevant tags so updates appear within seconds of saving in the admin.

## Project structure

```
src/
├─ app/
│  ├─ (frontend)/                 # Public site, route group
│  │  ├─ layout.tsx               # Imports global CSS only
│  │  ├─ styles.css               # Tailwind v4 @theme + design tokens
│  │  └─ [locale]/                # Locale-prefixed pages (en | gr | ru)
│  │     ├─ layout.tsx            # html/body, fonts, header, footer
│  │     ├─ page.tsx              # Homepage
│  │     ├─ cars/
│  │     ├─ sell/
│  │     ├─ contact/
│  │     └─ about/
│  ├─ (payload)/                  # Payload-owned admin & API routes
│  │  ├─ admin/                   # /admin
│  │  └─ api/                     # /api/{collection}, /api/graphql, etc.
│  ├─ api/                        # Application API routes (separate from Payload)
│  │  ├─ inquiry/                 # POST — handles all contact forms
│  │  ├─ revalidate/              # POST — server-only revalidate endpoint
│  │  └─ warm/                    # GET — cron warmup
│  ├─ sitemap.ts
│  ├─ robots.ts
│  └─ not-found.tsx
├─ collections/                   # Payload collections
├─ components/                    # React components, organized by feature
├─ i18n/                          # next-intl config + messages
├─ lib/                           # data layer, validation, helpers
├─ middleware.ts                  # next-intl middleware
└─ payload.config.ts              # Payload main config
```

## Getting started

### Prerequisites

- Node.js 20.9+
- pnpm 9+
- A MongoDB instance (local or Atlas free tier)

### Setup

```bash
# 1. Install
pnpm install

# 2. Copy env and fill in values
cp .env.example .env
#    At minimum set: DATABASE_URI, PAYLOAD_SECRET, INQUIRY_HMAC_SECRET,
#                    REVALIDATE_SECRET, NEXT_PUBLIC_SITE_URL

# 3. Generate Payload types
pnpm generate:types

# 4. Run
pnpm dev
```

The first time you load `http://localhost:3000/admin` you'll be prompted to create the admin user.

### Adding content

1. Sign in at `/admin`.
2. Create a few **Brands** (BMW, Mercedes, Porsche, …). Slugs auto-generate from name.
3. Upload some **Media** (or skip — images can be added inline when creating a car).
4. Create **Cars**. Mark a few as `featured` to populate the homepage strip.

When you save or delete a car, hooks ping `/api/revalidate` and the affected tags (homepage, cars index, car detail) are invalidated immediately.

## Environment variables

See `.env.example`. The most important ones:

| Variable | Purpose |
|---|---|
| `DATABASE_URI` | MongoDB connection string |
| `PAYLOAD_SECRET` | Payload JWT secret. **Must be 32+ random bytes in production.** |
| `NEXT_PUBLIC_SITE_URL` | Public origin (used for canonical URLs, OG, sitemap) |
| `INQUIRY_HMAC_SECRET` | Signs inquiry tokens. Required in production. |
| `REVALIDATE_SECRET` | Header-checked secret for the revalidate endpoint |
| `WARM_SECRET` | Optional secret for the warmup endpoint (cron also accepted) |
| `RESEND_API_KEY` | Optional. If unset, inquiries still save to Payload but no email is sent. |
| `S3_*` | Optional R2 credentials. If unset, Payload uses local filesystem in `/media`. |

## Anti-bot pipeline

The inquiry endpoint (`/api/inquiry`) layers four checks before persisting:

1. **HMAC token.** Each form server-renders a token signed with `INQUIRY_HMAC_SECRET` (6h TTL). The browser sends it back; the server timing-safe-compares.
2. **Time-trap.** Submissions less than 1.2s after page render are silently accepted (returning `ok: true`) but never persisted.
3. **Honeypot.** A visually-hidden field named `website`. If filled, silent accept.
4. **Per-IP rate limit.** In-memory bucket, default 10/hour, configurable via `INQUIRY_RATE_LIMIT_PER_HOUR`.

Validation is via Zod. Either `phone` or `email` must be present; the schema refines this in addition to the per-field validation.

## Caching & revalidation

Read calls in `src/lib/cars.ts` are wrapped in `unstable_cache` with both:

- **Time-based revalidation** (5–10 min depending on the call), as a safety net.
- **Tag-based revalidation** triggered by Payload hooks. When you save a car, the `afterChange` hook POSTs to `/api/revalidate` with `['cars:index', 'homepage', 'inventory:count', 'car:detail:<slug>']`.

Payload-side hooks are best-effort — they swallow failures so DB writes never fail because of a revalidation hiccup.

## Localization

- Three locales: `en` (default), `gr` (Greek), `ru` (Russian).
- Translations live in `src/i18n/messages/{locale}.json`.
- The `localeToBcp47` map turns our internal codes into proper language tags for `<html lang>` and `hreflang`.
- The `localeToIntl` map turns them into BCP-47 codes for `Intl.NumberFormat` / `Intl.DateTimeFormat`.
- All metadata, including `alternates.languages`, comes from `src/lib/seo.ts` → `buildAlternates()`.

## Deploying to Vercel

1. Push to GitHub.
2. Import to Vercel.
3. Configure env vars from `.env.example`.
4. The `vercel.json` cron is automatically picked up.

The Hobby tier supports cron, R2 is free for inbound, and Atlas M0 keeps your DB free as well. Stay on free tiers until the dealership outgrows them.

## Design principles

- **Editorial, not SaaS.** Big serif display type (Instrument Serif), generous white space, hairlines instead of card borders. Magazine-style numbered sections (`01 / How we work`).
- **One accent color.** Aged brass `#b08a4a`, used sparingly — the slash in the logo, a single hover state, status stamps. Nowhere else.
- **Bone, not white. Ink, not black.** Background `#f7f6f1`, foreground `#0e1116`. Pure black + pure white look cheap; warm neutrals look considered.
- **Real photos.** Cars are photographed, not illustrated. The AI-image trap is avoided.
- **Restraint over decoration.** No glassmorphism, no gradients, no rounded-2xl, no shadows-by-default. The grid does the work.

## Scripts

- `pnpm dev` — dev server
- `pnpm build` — production build
- `pnpm start` — start prod server (after build)
- `pnpm generate:types` — regenerate Payload TypeScript types from collections
- `pnpm generate:importmap` — regenerate Payload admin import map (run after adding admin field overrides)
- `pnpm payload <command>` — Payload CLI (`payload migrate`, etc.)
