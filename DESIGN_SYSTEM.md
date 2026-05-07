# DESIGN_SYSTEM.md — Auto Cyprus Visual Language

> Rules derived from `src/app/(frontend)/styles.css` and the existing component library.
> All tokens are defined in the `@theme {}` block in styles.css — no tailwind.config.js.

---

## Design Philosophy

**Editorial luxury.** Instrument Serif headlines, Geist Sans UI, warm bone backgrounds, a single cognac brass accent. The reference point is a high-end print magazine — restrained, high-contrast, text-led. Car photography does the selling; the UI stays out of the way.

**Hairlines, not boxes.** Borders are `1px`. Shadows are barely visible (`0 2px 20px -8px rgba(...,0.07)`). Radius is at most `4–6px`. No rounded-2xl, no card shadows stacked three deep.

**Whitespace first.** Sections breathe. Padding is generous (`p-8 md:p-12`). The grid never feels crowded. Empty space is intentional.

**One accent colour.** All interactive highlights, hover states, numbered display accents, and the brand slash mark use `--color-accent` (cognac brass). Oxblood and slate exist only in the hero.

---

## Colour System

All tokens live in `@theme {}` in `styles.css`. In Tailwind v4, these are available as utility classes automatically (`bg-ink`, `text-accent`, etc.).

### Core Palette

| Token | Hex | Use |
|-------|-----|-----|
| `--color-ink` | `#0e1116` | Primary text, dark backgrounds |
| `--color-ink-soft` | `#1a1d22` | Body text on dark |
| `--color-ink-mid` | `#2a2e34` | Secondary dark backgrounds |
| `--color-graphite` | `#6b6f78` | Tertiary labels, eyebrow meta |
| `--color-mist` | `#a1a4ac` | Placeholder text, timestamps, disabled |
| `--color-fog` | `#d8d6cc` | Subtle dividers |
| `--color-bone` | `#f7f6f1` | Default page background |
| `--color-bone-deep` | `#efece2` | Slightly warmer bone (hover states) |
| `--color-cream` | `#fbfaf6` | Card backgrounds, TrustStrip section |
| `--color-rule` | `#1f242b` | Dark hairlines on light backgrounds |
| `--color-rule-light` | `#d8d6cc` | Light hairlines (default `border-color`) |

### Accent

| Token | Hex | Use |
|-------|-----|-----|
| `--color-accent` | `#c49a3c` | Primary interactive accent (cognac brass) |
| `--color-accent-soft` | `#d4ae58` | Lighter brass — hero eyebrow, checkmarks on dark |

**Accent rules:**
- Interactive hairlines on hover (`scale-x-0 → scale-x-100` on group-hover)
- Numbered display text in HowItWorks steps
- CTA hover fill on "Get directions" button
- Nav underline rule
- Focus ring (`outline: 2px solid var(--color-accent)`)
- Eyebrow decorative rule
- Brand logo slash mark in footer/header

### Auxiliary Accents (hero only)

| Token | Hex | Use |
|-------|-----|-----|
| `--color-oxblood` | `#6b2a26` | Hero pulse dot, primary CTA hover fill |
| `--color-oxblood-soft` | `#8a3530` | Hero pulse dot |
| `--color-slate` | `#3a4954` | Not currently used in UI |
| `--color-slate-soft` | `#586875` | Not currently used in UI |

### Semantic

| Token | Use |
|-------|-----|
| `--color-success` `#1f6f4a` | Form success states |
| `--color-warning` `#b88224` | Price change badges |
| `--color-danger` `#a23a2c` | Form errors |

---

## Typography System

### Typefaces

| Variable | Family | Role |
|----------|--------|------|
| `--font-serif` | Instrument Serif | Display — headlines, pull quotes, numbered accents, testimonial names |
| `--font-sans` | Geist Sans | UI — body text, labels, buttons, nav, forms, specs |
| `--font-mono` | Geist Mono | Code, VIN numbers, tabular data |

### Type Scale

| Token | Size | Use |
|-------|------|-----|
| `--text-2xs` | 11px | Eyebrow labels, masthead meta |
| `--text-xs` | 12px | Fine print, tags |
| `--text-sm` | 14px | Secondary body, card metadata |
| `--text-base` | 16px | Primary body copy |
| `--text-lg` | 18px | Lead paragraphs, hero subtext |
| `--text-xl` | 22px | Small section headers |
| `--text-2xl` | 28px | Step titles, card headlines |
| `--text-3xl` | 36px | Section h2 |
| `--text-4xl` | 48px | Section display |
| `--text-5xl` | 64px | Hero on tablet |
| `--text-6xl` | 88px | Hero on desktop |
| `--text-7xl` | 112px | Extra-large display |

### Utility Classes

```css
.display          /* Instrument Serif, weight 400, tracking -0.022em, leading 0.96 */
.display-italic   /* Same + font-style: italic */
.eyebrow          /* All-caps, letter-spacing 0.16–0.2em, text-2xs, font-sans medium */
.eyebrow-on-dark  /* Eyebrow on dark backgrounds (text-mist) */
.big-stat         /* Large tabular number — display font, large size, for TrustStrip */
.index-numeral    /* Small index number — top-right of stat cards */
.btn-base         /* Button reset — square corners, font-inherit, tracking, uppercase */
.link-rule        /* Underline-on-hover link style */
.hairline-dark    /* 1px top border in rule colour */
.draw-rule        /* Animated grow-in horizontal rule (used in section headers) */
```

### Hierarchy Rules

- Section eyebrows: always uppercase, `text-2xs`, `letter-spacing: 0.18–0.20em`, `--color-graphite` or `--color-mist` (on dark)
- Section headlines: `display` class + responsive size. Never `font-bold` — the serif weight carries itself at 400.
- Body paragraphs: `text-sm md:text-base`, `leading-relaxed` (1.625), `text-pretty`, max ~44ch on wide viewports
- Stat numerals: `display-italic` or `big-stat` — always tabular-nums
- Cite/names: `display-italic` class, ~1.1rem, `--color-ink`
- Metadata (location, dates): `eyebrow` class, `--color-graphite` or `--color-mist`

---

## Section Spacing & Layout

### Section Tones

The `<Section tone="...">` primitive sets background colour and text colour together.

| Tone | Background | Text default |
|------|-----------|--------------|
| `bone` | `--color-bone` | `--color-ink` |
| `cream` | `--color-cream` | `--color-ink` |
| `paper` | `--color-ink` | `--color-bone` (dark section) |
| `ink` | `--color-ink-soft` | `--color-bone` |

### Section Spacing

`<Section spacing="...">` controls vertical padding.

| Value | Padding |
|-------|---------|
| `sm` | `py-10 md:py-14` |
| `md` | `py-14 md:py-20` |
| `lg` | `py-20 md:py-28` |
| `xl` | `py-24 md:py-36` |

### Container Widths

| Class | Max-width | Use |
|-------|-----------|-----|
| `container-page` | 1320px | Most sections |
| `container-narrow` | 880px | Text-heavy pages (about, contact) |
| `container-text` | 720px | Long-form text blocks |

Side padding: `1.25rem` mobile → `2rem` tablet → `3rem` desktop.

### SectionHeader Pattern

```tsx
<SectionHeader
  eyebrow="01 / Section name"
  title={t('title')}
  sub={t('sub')}          // optional
  index="01"              // shown as a decorative number
  size="md"               // "sm" | "md" | "lg"
  onDark                  // inverts colours for ink-bg sections
  className="mb-12 md:mb-16"
/>
```

---

## Component Style Rules

### Buttons

**Primary button (white fill → oxblood on hover):**
```
border border-white bg-white text-ink
hover fill: absolute span bg-oxblood slides in from left (-translate-x-full → translate-x-0)
text transitions to white on hover
```

**CTA band button (bone fill → accent on hover):**
```
border border-bone bg-bone text-ink
hover fill: absolute span bg-accent slides in from left
text transitions to bone on hover
```

**All buttons share:**
- `btn-base` utility class
- `min-h-[52px]`, `px-8 py-4`
- `text-sm`, `font-medium`, `tracking-[0.04em]`, `uppercase`
- `square corners` — no border-radius
- `overflow-hidden` on the button + absolutely positioned hover fill span
- `Magnetic` wrapper at `strength={0.18}` for subtle cursor attraction

**Secondary/ghost links:**
- `link-rule` class — underline rule that grows from left on hover
- `inline-flex items-center gap-2`
- Never styled as a box

### Cards (general)

- Background: `bg-cream`
- Border: `border border-rule-light` (1px, `--color-rule-light`)
- Shadow: `box-shadow: 0 2px 20px -8px rgba(14,17,22,0.07)` — barely visible
- Padding: `p-6 md:p-7`
- No border-radius (or at most `radius-sm` 4px)
- Hover effects via hairlines, not shadow elevation

### Testimonial Cards

- `bg-cream`, `border border-rule-light`, subtle shadow
- Opening `"` mark: `display-italic`, `--color-accent`, `2.25rem`
- Quote body: `text-sm leading-[1.75] --color-ink-soft`
- Footer: `border-t border-rule-light`, flex between name+meta and date
- Name: `display-italic`, `1.1rem`, `--color-ink`
- Location · Car: `eyebrow`, `--color-graphite`
- Date: `eyebrow tabular-nums`, `--color-mist`

### Stat Cards (TrustStrip)

- `bg-cream`, `p-8 md:p-10`, `min-h-[280px]`
- Grid: `gap-px bg-rule-light` (hairline dividers between cells)
- Index numeral: top-right absolute, `text-mist`, transitions to `text-accent` on hover
- Two hairlines (brass): top draws right-to-left, bottom draws left-to-right on hover
  - `scale-x-0 origin-right → scale-x-100` (top)
  - `scale-x-0 origin-left → scale-x-100` (bottom)
  - `duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]`

### Step Cards (HowItWorks)

- `bg-ink`, `p-8 md:p-12`, `min-h-[360px]`
- Grid gap: `gap-px bg-white/8` (faint hairline dividers)
- Background numeral: absolute, `text-[14rem]`, `text-white/4`, scales on hover
- Active numeral: `display-italic text-accent text-5xl md:text-6xl`
- Horizontal rule beside numeral: `w-8 h-px bg-mist`, extends 1.5× on hover

---

## Motion System

All animation uses **framer-motion v11**. No CSS keyframe animations for entrance effects.

### Principles

1. Motion must reinforce hierarchy, not entertain.
2. Every animated component **must** have a `useReducedMotion()` fallback that is fully static.
3. Entrance: fade-up only (`opacity: 0, y: 16` → `opacity: 1, y: 0`). No slides from sides. No scale.
4. Duration: 0.7s ease for entrances. 150–450ms for hover transitions.
5. Scroll-triggered: use `whileInView` with `once: true` and `amount: 0.2`.

### Component Reference

| Component | File | What it does |
|-----------|------|-------------|
| `Reveal` | `motion/Reveal.tsx` | Fade-up on scroll. `delay` prop, `as` prop, `once: true` |
| `SplitReveal` | `motion/SplitReveal.tsx` | Word-by-word stagger reveal for headlines |
| `Magnetic` | `motion/Magnetic.tsx` | Subtle cursor attraction. Always `strength={0.18}` for buttons |
| `CountUp` | `motion/CountUp.tsx` | Animated number count-up in TrustStrip stats |
| `Marquee` | `motion/Marquee.tsx` | Infinite horizontal scroll for BrandWall logos |

### Reveal Defaults

```tsx
initial: { opacity: 0, y: 16 }
whileInView: { opacity: 1, y: 0 }
transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
viewport: { once: true, amount: 0.2 }
```

Delay prop is in seconds: `delay={0.15}` = 150ms.

### Infinite Scroll Pattern (testimonials, brand marquee)

```tsx
<motion.ul
  animate={{ y: '-50%' }}   // or x: '-50%' for horizontal
  transition={{
    duration: 22,           // seconds — adjust per column
    repeat: Infinity,
    ease: 'linear',
    repeatType: 'loop',
  }}
>
  {[0, 1].map(copy => (
    items.map((item, i) => (
      <li key={`${copy}-${i}`} aria-hidden={copy === 1 ? true : undefined}>
        ...
      </li>
    ))
  ))}
</motion.ul>
```

Content is duplicated twice. Second copy gets `aria-hidden` to avoid double screen reader reads. Column height must be unconstrained on the scroll axis; parent clips it.

### CSS Mask Fades

Columns with infinite scroll get fade masks to hide the loop seam:
```css
mask-image: linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%);
-webkit-mask-image: /* same */;
```

### Hover Transition Durations

| Interaction | Duration | Easing |
|-------------|----------|--------|
| Button fill wipe | 500ms | cubic-bezier(0.22,1,0.36,1) |
| Hairline draw | 700ms | cubic-bezier(0.22,1,0.36,1) |
| Colour change | 500ms | ease |
| Scale (numeral bg) | 700ms | cubic-bezier(0.22,1,0.36,1) |
| Nav underline | 300ms | ease |

### Easing Tokens

| Token | Value | Character |
|-------|-------|-----------|
| `--ease-editorial` | `cubic-bezier(0.22,1,0.36,1)` | Overshoots softly, settles quickly |
| `--ease-precise` | `cubic-bezier(0.4,0,0.2,1)` | Material standard — used for utility transitions |

---

## Layout Conventions

### Grid

- 12-column grid only where needed (CtaBand: `lg:grid-cols-12`)
- Prefer `grid md:grid-cols-2 lg:grid-cols-4` for stat/feature grids
- `gap-px bg-rule-light` or `bg-white/8` creates hairline gutters between grid cells
- Section content max-width is handled by `<Container>`, not per-element constraints

### Responsive Breakpoints

Standard Tailwind breakpoints. Mobile-first. Key transitions:
- `md: 768px` — two-column grids, header navigation
- `lg: 1024px` — three columns, full desktop layout
- `xl: 1280px` — larger type sizes, more padding

### Z-Index Convention (Hero)

```
z-0 — video background
z-1 — gradient overlay divs
z-2 — masthead row and headline block
```

All other pages: no explicit z-index unless creating stacking context for a hover effect.

### Whitespace Discipline

- `mb-12 md:mb-16` below SectionHeader → content
- `mt-5 md:mt-7` between headline and subtext
- `gap-5 md:gap-7` between CTA row items
- Section breathing room via `<Section spacing="xl">` (not padding on the container)
- Never `mb-4` directly below a section headline — always at least `mb-8`

---

## Borders & Dividers

- Default border colour (via `border-color` base rule): `--color-rule-light` (#d8d6cc)
- Dark hairline: `h-px w-full bg-rule` or `bg-ink/12`
- Accent hairline: `h-px bg-accent` — only used for animated hover effects, never static decoration
- `border-t-2` used for section separators: `border-t-2 border-ink/12` (CustomerWall top border)
- Grid dividers: `gap-px bg-rule-light` on the grid, cells get solid background — the gap shows through as a line

---

## Accessibility Rules

- `useReducedMotion()` — check in every animated component; return static layout when true
- Aria labels on decorative motion regions: `role="region" aria-label="Customer testimonials"`
- Duplicate content in infinite scroll: `aria-hidden={true}` on second copy
- Background numerals and decorative spans: always `aria-hidden="true"`
- Focus ring: `outline: 2px solid var(--color-accent)` via `:focus-visible` in base layer
- `text-pretty` and `text-balance` on all multi-line text — never let orphans happen on short headings
- Colour contrast: all body text at 4.5:1 minimum. Mist (`#a1a4ac`) on cream (`#fbfaf6`) = 2.6:1 — use only for de-emphasised metadata, never for primary readable content
