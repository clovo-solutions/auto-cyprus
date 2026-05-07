# FEATURES.md — Auto Cyprus Product Map

> Living document of what exists and how it connects. Update when features change.

---

## Home Page Sections

The home page (`src/app/(frontend)/[locale]/page.tsx`) renders sections in this order. Each is a server component accepting `locale`.

| # | Section | Component | Tone | Key Content |
|---|---------|-----------|------|-------------|
| 01 | Hero | `home/Hero.tsx` | ink (dark) | Headline, subtext, primary/secondary CTAs, trust badge row |
| 02 | Trust Strip | `home/TrustStrip.tsx` | cream | 4 stat cards: 100% inspection, 12 yrs, 3000+ customers, 7-day return |
| 03 | How It Works | `home/HowItWorks.tsx` | paper (ink bg) | 3 numbered steps: Browse → Inspect → Drive |
| 04 | Categories | `home/Categories.tsx` | bone | Body-type grid (Saloon, SUV, Estate, Coupe, Convertible, other) |
| 05 | Customer Wall | `home/CustomerWall.tsx` | bone | 3-column infinite-scroll testimonials (9 cards, trilingual) |
| 06 | Brand Wall | `home/BrandWall.tsx` | bone | Scrolling logo marquee: BMW, Mercedes, Audi, Porsche, VW, Volvo, Tesla, Range Rover |
| 07 | CTA Band | `home/CtaBand.tsx` | paper (ink bg) | "Visit us" block: map link, phone, opening hours, address |
| 08 | Featured Cars | `home/FeaturedCars.tsx` | bone | 3–4 pinned inventory cards (from Payload) |

---

## Conversion Funnel

```
Hero
  └─ Primary CTA → /cars  (browse inventory)
  └─ Secondary CTA → /contact  (get in touch)
  └─ Trust badges  (Verified & inspected · Trusted across Cyprus · Transparent pricing)

TrustStrip
  └─ Social proof via stats (not clickable; builds confidence)

HowItWorks
  └─ Reduces friction by showing simplicity of process

Categories
  └─ → /cars?type=<body>  (filtered inventory entry point)

CustomerWall
  └─ Social proof via testimonials (no CTA; pure credibility)

BrandWall
  └─ Brand recognition (no CTA; signals inventory breadth)

CtaBand
  └─ "Get directions" → Google Maps
  └─ Phone link → direct call
  └─ Opening hours grid

FeaturedCars
  └─ Individual car cards → /cars/<slug>
  └─ "See all" → /cars
```

---

## Inventory System

**Source of truth:** Payload CMS (headless) backed by MongoDB.

**Collection:** `cars` — each document contains:
- `title`, `slug`, `make`, `model`, `year`, `price`
- `bodyType` (Saloon | SUV | Estate | Coupe | Convertible | Other)
- `mileage`, `fuel`, `transmission`, `colour`, `doors`, `seats`
- `description` (rich text)
- `images[]` (stored on S3/Cloudflare R2)
- `featured` (boolean — controls FeaturedCars section)
- `sold` (boolean — hides from public listing)
- `serviceHistory`, `previousOwners`, `vin`

**Data access:** `src/lib/cars.ts` — wrapper functions that call the Payload local API server-side.

**Revalidation:** `src/app/(frontend)/api/revalidate/route.ts` — webhook endpoint. Payload triggers it on document publish/save. Uses Next.js `revalidatePath`.

**Listing page:** `/cars` (`src/app/(frontend)/[locale]/cars/page.tsx`)  
- Server-rendered with filter support: `?type=`, `?make=`, `?sort=`
- Pagination via URL param `?page=`

**Detail page:** `/cars/[slug]` (`src/app/(frontend)/[locale]/cars/[slug]/page.tsx`)  
- Full specs, image gallery, contact form
- JSON-LD structured data (`src/lib/seo-jsonld.ts`)

---

## Testimonials System

**Current implementation:** `src/components/ui/testimonial-v2.tsx`  
**Used by:** `src/components/home/CustomerWall.tsx`

**Data:** 9 hardcoded testimonials in `CustomerWall.tsx` (not CMS-driven). Each has:
- `name`, `location`, `car` — display fields
- `purchasedAt: { en, gr, ru }` — trilingual month/year
- `quote: { en, gr, ru }` — trilingual review text

**Layout:** 3 columns (1 on mobile, 2 on tablet, 3 on desktop).  
Columns scroll at different speeds (22s / 28s / 25s) via framer-motion infinite loop.  
CSS mask gradient fades top and bottom edges.  
`useReducedMotion()` returns static stacked layout for accessibility.

**Unused files** (kept, do not delete without checking):
- `CustomerWallDeck.tsx` — previous deck/card implementation
- `CustomerWallFeatured.tsx` — featured single testimonial variant

---

## Body Type Filtering

**Entry points:**
1. Categories section on home page — each tile links to `/cars?type=<value>`
2. Filter bar on `/cars` listing page

**Body type values** (must match Payload collection enum exactly):
- `Saloon`, `SUV`, `Estate`, `Coupe`, `Convertible`, `Other`

**Grid layout** (`home/Categories.tsx`):
- Mobile: single column
- Desktop: 2-column grid with unequal row heights `[400px_360px]`
- Coupe and Convertible share a row and are larger on desktop (standard padding, full headline size)

---

## Contact & Lead Capture

**Page:** `/contact` (`src/app/(frontend)/[locale]/contact/page.tsx`)

**Form fields:** Name, phone, email, message, vehicle of interest (optional)

**Submission:** Sends email via Resend (`RESEND_API_KEY` env var). Recipient configured in `src/lib/site.ts`.

**CTA Band secondary link** (`home/CtaBand.tsx`): Direct phone link (`tel:`) using `phoneHref()` from `src/lib/site.ts`.

---

## Internationalisation

**Locales:** `en` (default), `gr`, `ru`

**Routing:** next-intl middleware — prefix strategy. `/cars` → `/en/cars`, `/gr/cars`, `/ru/cars`.

**Messages:** `src/i18n/messages/{en,gr,ru}.json`  
Namespace structure mirrors component tree:
```
home.hero.*        → Hero section
home.trust.*       → TrustStrip
home.how.*         → HowItWorks
home.categories.*  → Categories
home.wall.*        → CustomerWall
home.cta.*         → CtaBand
cars.*             → Listing & detail pages
contact.*          → Contact page
nav.*              → Header & footer navigation
```

---

## SEO & Metadata

**Default metadata:** `src/app/(frontend)/[locale]/layout.tsx`

**Per-page overrides:** `generateMetadata()` in each page file.

**Structured data:** `src/lib/seo-jsonld.ts` — generates `Car` schema JSON-LD for vehicle detail pages.

**Sitemap:** `src/app/(frontend)/sitemap.ts` — dynamic, queries Payload for all car slugs.

**Robots:** `src/app/(frontend)/robots.ts`

---

## Pages Reference

| Route | Purpose |
|-------|---------|
| `/` | Home page (8 sections) |
| `/cars` | Inventory listing with filters |
| `/cars/[slug]` | Vehicle detail page |
| `/contact` | Contact form + location |
| `/about` | About the dealership (static) |
| `/admin` | Payload CMS dashboard (not public) |
