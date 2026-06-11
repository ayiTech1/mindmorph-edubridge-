# Mindmorph Edubridge

> West Africa's trusted bridge to global education.

A production-grade Next.js 14 implementation of the Mindmorph Edubridge website and admin console, built to the specification in `Mindmorph_Edubridge_Website_Plan.docx` (June 2026, v1.0).

---

## What's in this scaffold

### Phase 1 (delivered here — runs locally, 48 routes, production build green)

**Public website — 48 routes from the sitemap, all rendered server-side.**

- **Homepage** with photographic hero (educational background image), trust bar, image-led destination grid, services with gradient icons, how-it-works, student stories with real photos, partner marquee, image-led blog cards, final CTA.
- **`/study-abroad`** hub (image-led cards) + 7 destination pages (UK, Canada, USA, Australia, Germany, Türkiye, Malaysia) — each with full-bleed country photo hero, key stats strip, partner universities, popular programmes table, scholarships, visa timeline, local testimonials, and a pre-filled lead form. FAQ structured data per destination.
- **`/test-prep`** hub + 7 exam pages (IELTS, TOEFL, GRE, GMAT, SAT, PTE, WASSCE). Live **Class Schedule** filterable by exam + format with real-time seat counts (spec §6.4).
- **`/cost-calculator`** — interactive Cost & Destination Calculator (spec §6.3). Live tuition + living + total + Mindmorph fee estimate. Surfaces relevant scholarships dynamically.
- **`/counselling`**, **`/corporate`**, **`/student-support`** hubs + sub-pages.
- **`/success-stories`** with photo cards, client-side filters by destination / service / year, educational hero photo.
- **`/resources`** blog hub with featured-image cards + 10 launch articles (per spec §9.3) + article template with featured-image hero, **in-article CTAs at 40% and 80% scroll positions**, **mid-article newsletter capture at 60%** (spec §4.6), related posts, Article schema.
- **`/scholarships`** with destination + level filters and deadline auto-archival.
- **`/events`** hub + event detail with Event structured data.
- **`/about`**, **`/about/team`**, **`/about/partners`**, **`/about/offices`** — all with image heroes where appropriate.
- **`/book`** (noindex) — multi-step lead form + Cal.com embed placeholder.
- **`/contact`**, **`/privacy`**, **`/cookie-policy`**, **`/terms`**, **`/not-found`**.

**Lead-capture funnel — fully wired.**

- `<LeadForm>` is the canonical capture component. Pre-fills service and destination based on the host page. Honeypot + Zod validation.
- `POST /api/leads` validates with Zod, fires WhatsApp ack and HubSpot upsert in parallel (both stubbed — flip on by setting env vars), logs structured payload.
- `POST /api/bookings`, `POST /api/newsletter` follow the same pattern.
- `GET /api/health` for uptime monitoring.

**Conversion-friendly UX layers (spec §6).**

- **WhatsApp float button** with auto-tailored message per page (§6.1).
- **Sticky mobile CTA** that appears on scroll past the hero (§6.1).
- **Tawk.to live chat** scaffolding (§6.8) — activates when env keys are present.
- **Cookie consent banner** with localStorage persistence (§10.2).
- **Skip-link** + AA contrast + `prefers-reduced-motion` honoured (§11.3).

**Authentication & admin gating — fully wired.**

- **NextAuth.js v4** with Credentials (email + bcrypt password) and Google OAuth providers, JWT session strategy, 30-minute idle timeout (spec §5.1).
- **Edge middleware** at `src/middleware.ts` decrypts the JWT cookie and redirects unauthenticated visitors to `/admin/login` with a `next` parameter so they return to the page they tried to load.
- **`/admin/login`** is a real form that calls `signIn`, displays errors, and surfaces the dev fallback credentials when MySQL isn't configured.
- **User menu** in the admin topbar shows the signed-in name + role, with a working "Sign out" action.
- **Dev fallback** — when `DATABASE_URL` isn't set, a single hard-coded super-admin (`admin@mindmorphedubridge.com` / `mindmorph2026`) is accepted so the team can demo the admin UI before provisioning MySQL.

**Persistence layer — real Prisma writes & reads.**

- `POST /api/leads` validates, **auto-assigns a consultant** (best specialisation match, lightest load), persists to the `Lead` table, fires the **real Twilio WhatsApp ack** + **real HubSpot Contacts v3 upsert** in parallel, and records a `LEAD_CREATED` audit entry. Every successful submission returns a real `leadId`.
- `POST /api/bookings` and `POST /api/newsletter` persist via Prisma.
- Admin dashboard KPIs and the leads pipeline are computed from real `prisma.lead.count`/`groupBy` queries.
- All DB calls go through `src/lib/prisma.ts` (singleton + `safeDbWrite` / `safeDbRead` helpers) — every read gracefully falls back to mock data when the database is unreachable, so the admin UI keeps working on a developer's laptop with no MySQL running.
- `prisma/seed.ts` ships 6 team users, 18 leads across all 7 pipeline stages, 6 bookings, 8 scholarships, and 3 newsletter subscribers — idempotent, safe to re-run.
- `docker-compose.yml` provides a one-command local MySQL: `npm run db:up`.

**Live operational workflow — leads can be actioned from the admin.**

- `/admin/leads` rows link to `/admin/leads/[id]` — a real detail page with the lead's full info, contact buttons (WhatsApp / email), booking history, and documents.
- **Stage transitions** are 7 buttons backed by Next.js server actions (spec §5.4). Marking a lead "Consultation booked" fires a real WhatsApp confirmation to the student.
- **Internal notes** editor saves via server action with character counter and inline confirmation.
- **Consultant reassignment** dropdown updates the lead in real time.
- Every mutation writes to the `AuditLog` table, surfaced on `/admin/settings` (spec §5.12).

**Scholarship CMS (spec §5.8).**

- `/admin/scholarships` is a real CRUD table with **Add / Edit / Archive / Restore** actions.
- The "Add scholarship" and "Edit" buttons open an accessible `<dialog>` form (8 fields, Zod-validated, RBAC-gated to `SUPER_ADMIN | ADMIN | EDITOR`).
- Server actions live in `src/lib/actions/scholarships.ts` and call `revalidatePath()` on both `/admin/scholarships` and the public `/scholarships` so changes appear instantly.
- Public `/scholarships` is a server component that reads from MySQL first and falls back to the seed file when the DB is empty/unreachable — the page always renders.
- Past-deadline scholarships auto-hide from the public list. Editors can restore archived ones at any time.
- Each mutation appends to the audit log.

**Article CMS (spec §5.7).**

- `/admin/content` lists every article from MySQL with status badges (Draft / In review / Published / Archived), word count, read time, and last-updated label.
- The **New / Edit** dialog has all spec §5.7 fields: title, slug (auto-generated and uniquified), category, tags, excerpt, body, featured image, author, SEO overrides (meta title, meta description, OG image), and status. A side-by-side **live Markdown preview** shows how the body renders as the editor types.
- One-click **Publish / Unpublish / Archive / Restore** buttons on each row. Publishing stamps `publishedAt` and triggers `revalidatePath()` on both the article and the hub.
- Public `/resources` and `/resources/[slug]` now read from MySQL with ISR (1h revalidate). When DB is empty or unreachable they transparently fall back to the seed file — the site never blanks out.
- `generateStaticParams` queries the DB first so new articles get statically generated on the next build/cache flush. The 10 launch articles in `src/content/articles.ts` are seeded into MySQL by `npm run prisma:seed`.
- Read time is computed automatically from word count (~220 wpm).
- Every CRUD operation writes an `ARTICLE_*` entry to the audit log.

**Testimonial / Success Story CMS (spec §5.9).**

- `/admin/testimonials` is a real CRUD table — Add / Edit / Feature / Unfeature / Delete.
- The form captures all spec §5.9 fields: student name, origin country, destination country + university, programme, graduation year, service category, quote, full story, photo URL, video URL, and a **Feature on homepage** toggle.
- Public `/success-stories` is a server component that reads from MySQL with ISR (1h revalidate) and falls back to the seed file when the DB is empty. Filters (destination / service / year) auto-populate from the live data.
- The homepage **FeaturedStories** carousel reads featured rows directly from the DB. Toggling Featured on a story in the admin reflects on `/` within the next request.
- Initials avatar fallback when a story has no photo URL.
- Every CRUD operation writes a `TESTIMONIAL_*` audit entry.

**Floating CTAs — symmetric on both edges.**

- Bottom-right: the **WhatsApp** float (auto-tailored message per page).
- Bottom-left: the **"Book free consultation"** float — circular by default, expands on hover to reveal the full label. Both hidden on `/admin` and on `/book` itself.

**Real third-party integrations — no SDK bloat.**

- **Twilio WhatsApp** — `src/lib/whatsapp.ts` calls the Messages REST endpoint with native `fetch`. Activates on `TWILIO_ACCOUNT_SID` + `TWILIO_AUTH_TOKEN` + `TWILIO_WHATSAPP_FROM`. Gracefully no-ops in dev.
- **HubSpot CRM v3** — `src/lib/hubspot.ts` does a real search-or-create upsert against the Contacts API, mapping all 10 lead properties including lifecycle stage. Activates on `HUBSPOT_API_KEY`.
- **Cal.com inline embed** — `src/components/booking/CalEmbed.tsx` mounts the official embed.js script with brand-colour theming. Renders a placeholder block when `NEXT_PUBLIC_CALCOM_USER` is unset.

**Admin console — `/admin`.**

- Sidebar + topbar shell, role-aware structure (per §5.2 RBAC matrix). Marketing chrome (Header/Footer/WhatsApp float/cookie banner) is suppressed on admin routes.
- **Dashboard** with 6 KPI cards and the **full chart suite from spec §5.3**:
  - Lead volume bar chart (6 months)
  - Leads-by-destination donut
  - **Conversion funnel** (visitors → form starts → form completes → consultations → placements)
  - Service breakdown (horizontal bar)
  - Website traffic & conversion (line chart with two series)
  - **West Africa lead-origin geographic map** (pure SVG)
  - Revenue by service (bar)
  - Consultant performance (horizontal bar)
- All charts are pure inline SVG — no external chart library, keeps the admin bundle small.
- Leads & CRM: pipeline counters per stage, searchable table.
- Bookings, Pages & articles, Scholarships, Team, Settings sections.
- `/admin/login` page (Credentials + Google SSO placeholders).
- **Edge middleware** at `src/middleware.ts` gates the `/admin/*` route group — redirects unauthenticated visitors to `/admin/login`. Auth signal is the `__Secure-mindmorph.session` cookie (set by NextAuth in Phase 2).

**Imagery (production-ready CDN setup).**

- All photographic content uses **`next/image`** with Cloudinary/Unsplash CDN — automatic AVIF/WebP, lazy loading below the fold, proper `sizes` attributes for responsive `srcset`.
- Hero photos on homepage, study-abroad hub, every destination, test-prep, success stories, about, and every blog article.
- Student avatar photos on testimonials. Country photos on destination cards.
- `images.remotePatterns` in `next.config.mjs` whitelists Cloudinary, Unsplash, and Sanity CDN. **Phase 2 swap**: mirror photos to Cloudinary, change URLs in `src/content/*.ts`. No component changes required.

**Production hardening.**

- `src/middleware.ts` — admin auth gate.
- `src/app/error.tsx` — graceful global error boundary with retry button.
- `src/app/loading.tsx` — root loading skeleton.
- `src/app/icon.tsx` — dynamic favicon generated via `next/og`.
- `src/app/opengraph-image.tsx` — dynamic 1200×630 OG image with brand gradient, generated at the edge.
- Security headers in `next.config.mjs` (HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy, X-Content-Type-Options).

**SEO & infrastructure.**

- `sitemap.ts` enumerating all routes including dynamic pages.
- `robots.ts` blocking `/admin` and `/api`.
- `manifest.ts` for PWA-ready installability.
- Per-page metadata via `lib/seo.ts` with canonical, hreflang (`en-GH`, `en-NG`, `fr-CI`), OG, Twitter card.
- JSON-LD structured data: `EducationalOrganization` (homepage), `FAQPage` (destinations), `Article` (blog posts), `Event` (events).
- Security headers configured in `next.config.mjs` (HSTS, X-Frame-Options, Referrer-Policy, etc.).
- Cookie consent banner with localStorage persistence.
- WhatsApp float button (auto-tailored message per page).
- Skip-link for keyboard users; `prefers-reduced-motion` respected; AA contrast throughout.

**Design system — matches spec §8.**

- Tailwind config with the exact Mindmorph palette (Deep Navy `#0C447C`, Ocean `#185FA5`, Sky `#378ADD`, Ice `#E6F1FB`, Teal `#1D9E75`, Amber `#BA7517`, Charcoal `#2C2C2A`, Slate `#888780`, Cream `#F1EFE8`).
- Inter (display + body) and JetBrains Mono (code) via `next/font`.
- Reusable primitives: `Button`, `LinkButton`, `Card`, `Container`, `Section`, `Badge`, `Input`/`Textarea`/`Select`, `Logo`.
- All buttons meet the 44px tap-target requirement.

**Database schema.**

- `prisma/schema.prisma` for MySQL (per spec §7) with models for `User`, `Lead`, `LeadDocument`, `Booking`, `Scholarship`, `SuccessStory`, `Article`, `Event`, `NewsletterSubscriber`, `AuditLog`. Enums for roles, stages, sources, formats. Indexed for the most common admin queries.

### Phase 2 — wired but stubbed (drop-in real keys to activate)

Each item below works the moment its env keys are populated. No code changes required.

- **Twilio WhatsApp** — set `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_FROM` and acks ship for real.
- **HubSpot CRM** — set `HUBSPOT_API_KEY` and every captured lead lands as a contact (with lifecycle stage = lead, all 10 properties mapped).
- **Cal.com inline embed** on `/book` — set `NEXT_PUBLIC_CALCOM_USER` and the calendar mounts inline; the previous placeholder is gone.
- **Tawk.to live chat** — set `NEXT_PUBLIC_TAWK_PROPERTY_ID` and `NEXT_PUBLIC_TAWK_WIDGET_ID` and the widget loads automatically.
- **Google OAuth for admin** — set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and optionally `GOOGLE_HD` (Workspace hosted domain) and the "Continue with Google" button appears on the login page. Only emails matching an active `User` row are allowed in.
- **Sanity headless CMS** — the data model in `src/content/*.ts` mirrors the schemas the team will build in Sanity Studio. Migration path: replace each `import { destinations } from "@/content/destinations"` with a Sanity client query.
- **Cloudinary image CDN** — `next.config.mjs` already whitelists `res.cloudinary.com`. Mirror the photos used in `src/content/*.ts` (currently Unsplash) to your Cloudinary library, then swap the URLs.

### Phase 3 — not yet built (per spec scope)

- Student portal / application tracker (§ Phase 2 of the spec — Months 3–5).
- Full French website. Phase 1 ships English; `lib/i18n.ts` + `hreflang` are scaffolded for the team to layer translations.
- LMS, virtual campus tours, Algolia search, mobile PWA (Phase 3 of the spec — Months 6–12).

---

## Getting started

### Option A — fastest path (no database)

```bash
npm install
cp .env.example .env.local
npm run dev
```

Visit `http://localhost:3000`. The admin console at `/admin` will redirect you to `/admin/login`. The dev fallback credentials are:

- **Email:** `admin@mindmorphedubridge.com`
- **Password:** `mindmorph2026`

Lead submissions are validated and logged but not persisted. The admin pages show mock data.

### Option B — full local stack (with MySQL)

```bash
# 1. Install dependencies (postinstall regenerates the Prisma client)
npm install

# 2. Start MySQL via docker-compose (port 3306)
npm run db:up

# 3. Configure env
cp .env.example .env.local
# Edit .env.local — at minimum set:
#   DATABASE_URL="mysql://mindmorph:mindmorph@localhost:3306/mindmorph"
#   NEXTAUTH_SECRET="$(openssl rand -base64 32)"

# 4. Push the Prisma schema + seed dev data
npm run prisma:push
npm run prisma:seed

# 5. Dev server
npm run dev
```

The seed creates 6 team members (all with password `mindmorph2026`), 18 sample leads spread across the pipeline, 6 scheduled bookings, 8 live scholarships, and 3 newsletter subscribers. The admin dashboard and CRM now reflect real database state. New consultation requests from the public site land in the `Lead` table within the same second.

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the Next.js dev server. |
| `npm run build` | Production build (static + SSG where applicable). |
| `npm start` | Run the production build. |
| `npm run lint` | ESLint (next/core-web-vitals). |
| `npm run typecheck` | `tsc --noEmit`. |
| `npm run db:up` / `db:down` | Start / stop local MySQL via docker-compose. |
| `npm run prisma:push` | Apply `prisma/schema.prisma` to the connected database. |
| `npm run prisma:seed` | Seed dev users, leads, bookings, scholarships. |
| `npm run prisma:generate` | Regenerate the Prisma client. Runs automatically on install. |

---

## Project structure

```
src/
├── app/                # Next.js App Router
│   ├── (public site)   # All marketing routes — home, study-abroad, test-prep, …
│   ├── admin/          # Operations console
│   ├── api/            # leads, bookings, newsletter, health
│   ├── cost-calculator/# Interactive cost & destination calculator (§6.3)
│   ├── sitemap.ts      # generated from content + static routes
│   ├── robots.ts
│   ├── manifest.ts
│   ├── icon.tsx        # Dynamic favicon via next/og
│   ├── opengraph-image.tsx # Dynamic 1200×630 OG image
│   ├── loading.tsx     # Root loading skeleton
│   └── error.tsx       # Global error boundary
├── middleware.ts       # Edge middleware — gates /admin/*
├── components/
│   ├── ui/             # Button, Card, Section, Badge, Input, Logo
│   ├── layout/         # Header, Footer, WhatsAppFloat, StickyCTA, LiveChat, CookieBanner
│   ├── home/           # Homepage sections (Hero, TrustBar, DestinationGrid, …)
│   ├── forms/          # LeadForm, ContactForm, NewsletterForm
│   ├── article/        # ArticleBody (mid-scroll CTAs + newsletter, §4.6)
│   ├── calculator/     # CostCalculator (§6.3)
│   ├── test-prep/      # ClassSchedule (§6.4)
│   └── admin/          # Sidebar, Topbar, KpiCard, Charts (SVG suite §5.3)
├── content/            # Typed data — destinations, exams, classes, services,
│                       # articles, testimonials, scholarships, events, team,
│                       # partners. Sanity replaces this in Phase 2.
├── lib/                # site-config, seo, i18n, utils, whatsapp, hubspot, analytics
└── types/              # Shared TS types
prisma/schema.prisma    # MySQL schema (spec §7)
```

---

## Performance & accessibility (spec §11)

| Metric | Target | Status |
|---|---|---|
| LCP (mobile 4G) | < 2.5s | Static generation + lazy below-fold |
| CLS | < 0.1 | Fixed dimensions on hero / cards |
| TTI (3G) | < 3.5s | No client-side data fetching on public pages |
| Lighthouse Perf | > 85 | Achievable as scaffolded — verify after image assets land |
| Lighthouse SEO | > 95 | Per-page metadata, canonical, hreflang, JSON-LD all in place |
| Lighthouse A11y | > 90 | Skip-link, focus styles, ARIA labels, AA contrast |
| Reduced motion | Honoured | `globals.css` |

## Security (spec §10)

- HTTPS enforced via Vercel.
- Security headers in `next.config.mjs` (HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy, X-Content-Type-Options).
- All form payloads validated with Zod; honeypot field on the lead form.
- `/admin` and `/api` excluded in `robots.ts`. **Edge middleware** at `src/middleware.ts` actively blocks unauthenticated access to `/admin/*` (cookie-based session check, ready for NextAuth).
- Dependencies pinned by minor; Dependabot can be enabled at the repo level.
- reCAPTCHA v3 keys scaffolded in `.env.example`; integrate on the `LeadForm` once the team has a site key.
- Cloudflare WAF + rate limiting recommended in front of Vercel (spec §10.1).

---

## Deployment

Target: **Vercel** + **Cloudflare** in front (per spec §7).

1. Push the repo to GitHub.
2. Import the project at vercel.com. Framework: Next.js (auto-detected).
3. Add environment variables from `.env.example`.
4. Add the production domain. Cloudflare DNS in front for DDoS / WAF.
5. Connect Sanity Studio (Phase 2) and a managed MySQL (PlanetScale or RDS) for the lead/booking persistence.

CI/CD: GitHub Actions running `lint → typecheck → build` on every PR. Vercel preview deployment per PR.

---

## Implementation notes & decisions

- **Tech-stack reconciliation.** The spec lists MySQL as the database (§7) but also mentions Supabase elsewhere. I followed §7 strictly — Prisma + MySQL. NextAuth replaces the Supabase Auth reference. If the team prefers Supabase, swap `provider = "mysql"` to `"postgresql"` in `schema.prisma` and add `@supabase/supabase-js` for client features.
- **Content as code, then CMS.** Every typed content array under `src/content/` is shaped to mirror a Sanity document type. Migration is a one-file-at-a-time exercise: replace the import with a Sanity client call. The public pages don't need to change.
- **No external icon or chart libraries.** Inline SVG keeps the bundle small for West African 4G/3G targets. The dashboard chart is hand-rolled SVG; swap for Recharts only if interactivity becomes needed.
- **Hidden fields / honeypot.** `<LeadForm>` carries a hidden `company` field. Real users leave it empty; bots usually fill it.
- **Languages.** Phase 1 scaffolds the locale system (`/fr/` URL prefix, `hreflang`, cookie persistence) without shipping the French copy. The French translation is content work, not engineering.
- **Spec coverage.** §1–§12 are reflected in routes, components, and configuration. §13 (team), §14 (budget), and §15 (maintenance plan) are operational documents — not part of the codebase.

---

## What to do next (week-by-week handover)

1. **Week 1:** Wire DATABASE_URL, run `prisma db push`. Hook real WhatsApp/Twilio credentials. Mirror Unsplash hero images to Cloudinary and swap URLs in `src/content/destinations.ts`, `articles.ts`, `testimonials.ts`. Lighthouse audit on staging.
2. **Week 2:** Spin up Sanity Studio with the schemas mirrored from `src/content/`. Move article + scholarship admin into Sanity.
3. **Week 3:** Plug NextAuth Credentials + Google providers into `/admin/login` — the edge middleware already enforces the session cookie.
4. **Week 4:** Cal.com / Calendly embed on `/book`. HubSpot live. Google Analytics 4 + Search Console verified.
5. **Week 5:** Begin Lagos / Francophone content workstream (Phase 2 per spec §1.4).

---

© Mindmorph Edubridge. Built with care for West Africa's next generation.
