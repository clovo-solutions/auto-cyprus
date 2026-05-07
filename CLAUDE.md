# CLAUDE.md — Auto Cyprus Project Brain

> Source of truth for all Claude-assisted development on this project.
> Read this before making any changes.

---

## Project Overview

**Auto Cyprus** is a premium used-car dealership website based in Limassol, Cyprus.

- Showroom: Limassol, Cyprus (island-wide delivery)
- Founded: 2013 by Andreas P.
- Stock: ~40 carefully selected cars at any time
- Customers: 3,000+ over 12 years
- Audience: English, Greek, and Russian speakers living in or visiting Cyprus
- Business model: curated used-car sales + direct car purchasing (sell-to-us)

The site is **conversion-focused** — every section exists to move a visitor toward browsing inventory, calling the showroom, or submitting a lead form. It is not a brochure site.

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.2.4 |
| Language | TypeScript | 5.6 |
| Styling | Tailwind CSS v4 | 4.x |
| Animation | framer-motion | 11.11.0 |
| i18n | next-intl | 3.21.0 |
| CMS | Payload CMS (headless) | 3.84.1 |
| Database | MongoDB (via Payload) | — |
| Image storage | AWS S3 (via Payload plugin) | — |
| Email | Resend | 4.x |
| Validation | Zod | 3.x |
| Utilities | clsx, tailwind-merge (via `cn()`) | — |
| Package manager | pnpm | — |

**Tailwind v4 note:** Configuration is in `src/app/(frontend)/styles.css` using `@theme {}` blocks — there is NO `tailwind.config.js`. All custom tokens are CSS custom properties.

---

## Architecture

```
src/
├── app/
│   ├── (frontend)/          # Public website
│   │   ├── [locale]/        # Locale-scoped pages (en / gr / ru)
│   │   │   ├── page.tsx     # Home
│   │   │   ├── cars/        # Inventory list + detail
│   │   │   ├── about/
│   │   │   ├── contact/
│   │   │   └── sell/
│   │   ├── layout.tsx       # Root frontend layout (fonts, Header, Footer)
│   │   └── styles.css       # Global styles + Tailwind v4 theme
│   ├── (payload)/           # CMS admin + API routes
│   │   └── admin/           # Payload dashboard at /admin
│   └── api/
│       └── inquiry/         # Lead form endpoint (rate-limited, Zod-validated)
├── components/
│   ├── home/                # Home page sections (Hero, TrustStrip, etc.)
│   ├── cars/                # Inventory components (CarCard, FilterSidebar, etc.)
│   ├── about/ contact/ sell/ forms/
│   ├── layout/              # Header, Footer, Logo, MobileNav
│   ├── motion/              # Animation wrappers (Reveal, SplitReveal, etc.)
│   └── ui/                  # Primitives (Section, Container, Button, Input)
├── i18n/
│   ├── messages/            # en.json, gr.json, ru.json
│   ├── config.ts
│   └── routing.ts
└── lib/                     # site.ts, cars.ts, filters.ts, seo.ts, etc.
```

### Key architectural patterns

- **Server components by default.** All page-level and section components are `async` server components. `'use client'` is only added when the component requires browser APIs, `useState`, `useEffect`, or framer-motion hooks.
- **Locale routing:** Every public page lives under `/[locale]/`. The supported locales are `en`, `gr`, `ru`. The `next-intl` library handles routing and translation lookup.
- **Section/Container primitives:** All page sections use `<Section tone="..." spacing="...">` and `<Container>` from `src/components/ui/`. Never build ad-hoc section layouts.
- **Design tokens via CSS variables:** All colors, fonts, radii, and spacing are accessed via `var(--color-*)` etc. Never use hardcoded hex values in components.
- **Site data from `lib/site.ts`:** Phone, WhatsApp, email, address, and geo coordinates all come from environment variables via `site.ts`. Never hardcode contact info in components.

---

## UI Direction

Editorial luxury. Think high-end automotive magazine, not e-commerce.

- **Restraint over decoration:** whitespace, hairlines, minimal shadows
- **Typography-first:** large Instrument Serif display headlines carry the visual weight
- **Warm palette:** bone (#f7f6f1) and cream (#fbfaf6) backgrounds, ink (#0e1116) text, single cognac brass accent (#c49a3c)
- **No rounded-2xl, no gradient cards, no glassmorphism**
- **Animation exists to reveal, not to entertain:** scroll-triggered fades, not parallax or 3D stacking

---

## Design Principles (in priority order)

1. **Trust first** — credibility signals before anything else (stats, testimonials, history)
2. **Clarity** — every element has a purpose; remove before adding
3. **Conversion** — every section has a clear next action
4. **Consistency** — the design system is the system; do not invent alternatives

---

## Rules for Claude

### Always
- Use existing CSS custom property tokens (`var(--color-ink)`, `var(--color-accent)`, etc.)
- Use `Section` + `Container` primitives for any new page section layout
- Use `SectionHeader` for section headlines (eyebrow + title + optional sub)
- Use `Reveal` for scroll-triggered entrance animations on section content
- Add translations to all three locale files (`en.json`, `gr.json`, `ru.json`) for any user-visible copy
- Keep components as server components unless interactivity is required
- Follow the Section tone sequence: alternate bone/cream sections with paper (dark) sections for visual rhythm

### Never
- Hardcode hex colors — always use CSS custom properties
- Add `rounded-2xl`, `rounded-3xl`, heavy `drop-shadow`, or `blur` effects on cards
- Introduce new npm packages without explicit user approval
- Redesign sections that are already implemented and working
- Add animations beyond the established patterns (Reveal, SplitReveal, CountUp, Marquee, Magnetic)
- Use `lucide-react`, `shadcn/ui`, or any icon library not already in the project (use `src/components/icons.tsx`)
- Write duplicate copy that bypasses the translation system
- Use `tailwind.config.js` — the project uses Tailwind v4 CSS-based config only

### When modifying components
- Check if a motion wrapper (`Reveal`, `SplitReveal`) is appropriate before adding animation inline
- Respect `useReducedMotion()` — all animated components must have a static fallback
- Keep `'use client'` at the top of the file, never inside a component function
- For new home sections: add to `src/app/(frontend)/[locale]/page.tsx` in the correct order

---

## Current Home Page Sections (in render order)

| # | Component | File | Tone | Purpose |
|---|---|---|---|---|
| 1 | Hero | `home/Hero.tsx` | dark (bg-ink) | First impression, primary CTA |
| 2 | TrustStrip | `home/TrustStrip.tsx` | cream | Credibility stats |
| 3 | BrandWall | `home/BrandWall.tsx` | bone | Brand recognition marquee |
| 4 | HowItWorks | `home/HowItWorks.tsx` | paper (dark) | Process clarity |
| 5 | Categories | `home/Categories.tsx` | bone | Browse by body type |
| 6 | CustomerWall | `home/CustomerWall.tsx` | bone | Social proof (scrolling testimonials) |
| 7 | CtaBand | `home/CtaBand.tsx` | paper (dark) | Final visit/contact CTA |

`FeaturedCars` is implemented but currently commented out in `page.tsx`.

---

## All Pages

| Route | File | Description |
|---|---|---|
| `/[locale]/` | `page.tsx` | Home |
| `/[locale]/cars/` | `cars/page.tsx` | Inventory with filters/sort/pagination |
| `/[locale]/cars/[slug]/` | `cars/[slug]/page.tsx` | Car detail with gallery, specs, inquiry form |
| `/[locale]/about/` | `about/page.tsx` | Founder note, values, timeline, team |
| `/[locale]/contact/` | `contact/page.tsx` | Contact tiles, form, showroom map |
| `/[locale]/sell/` | `sell/page.tsx` | Sell-your-car pitch, timeline, form |
| `/admin/` | Payload | CMS dashboard (not for frontend work) |

---

## Known Unused / Experimental Files

These exist in the codebase but are not currently rendered:

- `home/CustomerWallDeck.tsx` — deprecated deck/stack testimonial UI
- `home/CustomerWallFeatured.tsx` — alternate testimonial layout
- `home/FeaturedCars.tsx` — commented out in page.tsx
- `home/HeroAnatomy.tsx`, `HeroDashboard.tsx`, `HeroFolio.tsx`, `HeroRotatingShowcase.tsx` — alternate hero explorations

Do not import or activate these without explicit instruction.

---

## Environment Variables

```
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_PHONE
NEXT_PUBLIC_WHATSAPP
NEXT_PUBLIC_EMAIL
NEXT_PUBLIC_ADDRESS
DATABASE_URI          # MongoDB connection string
PAYLOAD_SECRET
S3_BUCKET, S3_REGION, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY
RESEND_API_KEY
INQUIRY_FROM_EMAIL    # Verified Resend sender — e.g. noreply@yourdomain.com
INQUIRY_TO_EMAIL      # Dealership inbox — where leads are delivered
```

Contact info and site URLs always come through `src/lib/site.ts` — never hardcoded.
