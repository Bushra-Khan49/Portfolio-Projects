# Nexus Genomics Institute — Digital Portal
## Master Implementation Plan

> **Client:** Dr. Evelyn Vance, Lead Research Scientist, Nexus Genomics Institute
> **Prepared:** 2026-05-26
> **Stack:** Next.js 15 · TypeScript · CSS Modules · Supabase · Vercel
> **Status:** Pre-Development — Greenfield Build

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Repository & Project Structure](#2-repository--project-structure)
3. [Phased Delivery Plan](#3-phased-delivery-plan)
4. [Per-Phase Task Breakdown](#4-per-phase-task-breakdown)
5. [Component Development Order](#5-component-development-order)
6. [Data Seeding Plan](#6-data-seeding-plan)
7. [Environment Setup Instructions](#7-environment-setup-instructions)
8. [Deployment Pipeline](#8-deployment-pipeline)
9. [Risk Register](#9-risk-register)
10. [Definition of Done](#10-definition-of-done)
11. [Post-Launch Checklist](#11-post-launch-checklist)

---

## 1. Project Overview

### 1.1 Summary

The Nexus Genomics Institute Digital Portal is the institute's first-ever public-facing website and internal administration system. It serves three primary audiences:

| Audience | Purpose |
|---|---|
| **General Public / Prospective Researchers** | Discover institute mission, active research projects, team, news, events, and open positions |
| **Prospective Program Applicants** | Submit fellowship / research program applications via a structured form (no email — DB-stored) |
| **Institute Administrators** | Manage all content via a secure CMS: news, team, projects, sessions calendar, and applicant review board |

### 1.2 Technical Stack

| Layer | Technology | Rationale |
|---|---|---|
| Framework | Next.js 15 (App Router) | RSC-first, streaming SSR, file-system routing |
| Language | TypeScript (strict mode) | Type safety across client and server |
| Styling | CSS Modules + Global CSS Custom Properties | Zero-runtime, co-located, no Tailwind dependency |
| Database | Supabase PostgreSQL | Managed Postgres with Row-Level Security |
| File Storage | Supabase Storage | Team photos, publication PDFs, project images |
| Authentication | Supabase Auth (email + password) | Admin-only auth; public portal is fully unauthenticated |
| Hosting | Vercel | Git-based auto-deploy, Edge Functions, Image Optimization |
| SEO / GEO | JSON-LD structured data, dynamic sitemap, robots.txt | Google Knowledge Graph, AI citation eligibility |

### 1.3 Constraints & Non-Negotiables

- **No email notifications to admin** — all application submissions are stored in DB; admin contacts shortlisted applicants manually via provided contact details.
- **Mobile-first responsive design** — tested against iPhone SE (375 px) through Galaxy S24 Ultra (430 px).
- **Admin portal is private** — all `/admin/*` routes protected by Supabase session middleware; no public registration.
- **Applicant workflow is one-way** — applicants submit once; no applicant login or status dashboard is needed in v1.
- **Sessions calendar is public** — filtered by type, audience, and `is_public` flag; no login required.
- **All content is admin-editable** — no hardcoded copy in the codebase except placeholder seed data.

---

## 2. Repository & Project Structure

```
nexus-genomics-portal/
|
+-- .env.local                          # Local secrets (never committed)
+-- .env.example                        # Template for required env vars
+-- .gitignore
+-- next.config.ts                      # Next.js config: image domains, headers, redirects
+-- tsconfig.json                       # Strict TypeScript config
+-- package.json
+-- middleware.ts                       # Supabase session refresh + /admin route protection
|
+-- public/
|   +-- favicon.ico
|   +-- apple-touch-icon.png
|   +-- og-default.jpg                  # Default Open Graph image
|   +-- robots.txt                      # Generated at build; allows all, points to sitemap
|   +-- fonts/                          # Self-hosted woff2 font files
|
+-- src/
|   +-- app/                            # Next.js App Router root
|   |   +-- layout.tsx                  # Root layout: fonts, global CSS, metadata defaults
|   |   +-- page.tsx                    # Homepage (SSR)
|   |   +-- not-found.tsx               # Custom 404 page
|   |   +-- error.tsx                   # Global error boundary
|   |   +-- loading.tsx                 # Root-level Suspense fallback
|   |   +-- sitemap.ts                  # Dynamic sitemap generator
|   |   +-- robots.ts                   # robots.txt generator
|   |   +-- about/page.tsx              # About the Institute
|   |   +-- research/
|   |   |   +-- page.tsx                # Research Projects listing
|   |   |   +-- [slug]/page.tsx         # Individual project detail + JSON-LD
|   |   +-- team/
|   |   |   +-- page.tsx                # Team listing grouped by department
|   |   |   +-- [slug]/page.tsx         # Team member profile + JSON-LD Person
|   |   +-- news/
|   |   |   +-- page.tsx                # News & Publications listing (paginated)
|   |   |   +-- [slug]/page.tsx         # Article detail
|   |   +-- sessions/page.tsx           # Public Sessions Calendar (client filters)
|   |   +-- apply/
|   |   |   +-- page.tsx                # Program listing + JobPosting JSON-LD
|   |   |   +-- [programSlug]/page.tsx  # Application form
|   |   +-- faq/page.tsx                # FAQ + FAQPage JSON-LD
|   |   +-- contact/page.tsx            # Contact info + map
|   |   +-- admin/
|   |       +-- layout.tsx              # Admin shell (sidebar + topbar + auth guard)
|   |       +-- page.tsx                # Dashboard overview
|   |       +-- login/page.tsx          # Auth form
|   |       +-- news/(CRUD pages)
|   |       +-- research/(CRUD pages)
|   |       +-- team/(CRUD pages)
|   |       +-- sessions/(CRUD pages)
|   |       +-- programs/(CRUD pages)
|   |       +-- faq/(CRUD pages)
|   |       +-- applicants/
|   |           +-- page.tsx            # Review board
|   |           +-- [id]/page.tsx       # Applicant detail
|   |
|   +-- components/
|   |   +-- layout/
|   |   |   +-- Header/{Header.tsx, Header.module.css}
|   |   |   +-- Footer/{Footer.tsx, Footer.module.css}
|   |   |   +-- AdminSidebar/{AdminSidebar.tsx, AdminSidebar.module.css}
|   |   |   +-- AdminTopBar/{AdminTopBar.tsx, AdminTopBar.module.css}
|   |   +-- ui/
|   |   |   +-- Button/{Button.tsx, Button.module.css}
|   |   |   +-- Badge/{Badge.tsx, Badge.module.css}
|   |   |   +-- Card/{Card.tsx, Card.module.css}
|   |   |   +-- Modal/{Modal.tsx, Modal.module.css}
|   |   |   +-- Pagination/{Pagination.tsx, Pagination.module.css}
|   |   |   +-- Tabs/{Tabs.tsx, Tabs.module.css}
|   |   |   +-- Spinner/{Spinner.tsx, Spinner.module.css}
|   |   |   +-- Toast/{Toast.tsx, Toast.module.css}
|   |   |   +-- ImageUpload/{ImageUpload.tsx, ImageUpload.module.css}
|   |   +-- sections/
|   |   |   +-- HeroSection/
|   |   |   +-- MissionStrip/
|   |   |   +-- ResearchGrid/
|   |   |   +-- TeamGrid/
|   |   |   +-- NewsReel/
|   |   |   +-- StatsCounter/
|   |   |   +-- Timeline/
|   |   |   +-- SessionsCalendar/
|   |   |   +-- FAQAccordion/
|   |   |   +-- ApplicationForm/
|   |   +-- seo/
|   |   |   +-- JsonLd.tsx
|   |   |   +-- schemas/
|   |   |       +-- researchOrganization.ts
|   |   |       +-- researchProject.ts
|   |   |       +-- faqPage.ts
|   |   |       +-- person.ts
|   |   |       +-- jobPosting.ts
|   |   +-- admin/
|   |       +-- DataTable/
|   |       +-- FormField/
|   |       +-- RichTextEditor/
|   |       +-- ApplicantCard/
|   |
|   +-- lib/
|   |   +-- supabase/{client.ts, server.ts, middleware.ts}
|   |   +-- actions/{news.ts, research.ts, team.ts, sessions.ts, programs.ts, faq.ts, applications.ts, auth.ts}
|   |   +-- queries/{news.ts, research.ts, team.ts, sessions.ts, programs.ts, faq.ts, applications.ts}
|   |   +-- utils/{slugify.ts, formatDate.ts, generateMetadata.ts, storage.ts}
|   |   +-- validations/{applicationSchema.ts, newsSchema.ts, researchSchema.ts, teamSchema.ts, sessionSchema.ts, programSchema.ts}
|   |
|   +-- hooks/
|   |   +-- useDebounce.ts
|   |   +-- useMediaQuery.ts
|   |   +-- useToast.ts
|   |   +-- useScrollAnimation.ts
|   |
|   +-- types/
|   |   +-- database.ts                 # Auto-generated Supabase DB types
|   |   +-- models.ts                   # App-level model types
|   |   +-- enums.ts                    # SessionType, AudienceType, ApplicationStatus, etc.
|   |
|   +-- styles/
|       +-- globals.css
|       +-- tokens.css
|       +-- typography.css
|       +-- animations.css
|
+-- supabase/
|   +-- migrations/
|   |   +-- 001_initial_schema.sql
|   |   +-- 002_rls_policies.sql
|   |   +-- 003_storage_buckets.sql
|   +-- seed.sql
|
+-- scripts/
    +-- seed-dev.ts
```

---

## 3. Phased Delivery Plan

| Phase | Name | Duration | Deliverable |
|---|---|---|---|
| **0** | Project Setup & Foundation | 1–2 days | Repo, Supabase project, env, tokens, CI |
| **1** | Public Portal — Static & Dynamic Pages | 4–5 days | All public routes with real SSR data |
| **2** | Interactive Client Components | 2–3 days | Tabs, animations, sessions calendar filter |
| **3** | Admin Dashboard & CMS | 4–5 days | Full CRUD, file upload, applicant board |
| **4** | GEO/SEO, Performance & QA | 2–3 days | JSON-LD, sitemap, Lighthouse >= 90, mobile QA |

**Total estimated timeline: 13–18 working days**

---

## 4. Per-Phase Task Breakdown

### Phase 0 — Project Setup & Foundation

> Goal: A running Next.js 15 app connected to Supabase with design tokens and fonts in place.

- [ ] **0.01** Run `npx create-next-app@latest nexus-genomics-portal --typescript --app --src-dir --no-tailwind --import-alias "@/*"` → `package.json`, `tsconfig.json`
- [ ] **0.02** Enable strict mode: set `"strict": true` in `tsconfig.json` → `tsconfig.json`
- [ ] **0.03** Install core dependencies: `@supabase/supabase-js @supabase/ssr zod` → `package.json`
- [ ] **0.04** Install dev dependencies: `@types/node prettier eslint-config-next` → `package.json`
- [ ] **0.05** Create `.env.example` with all required variable names and inline comments → `.env.example`
- [ ] **0.06** Copy to `.env.local`, fill in Supabase Project URL + anon key + service role key → `.env.local`
- [ ] **0.07** Create Supabase project via dashboard; save Project URL, anon key, service role key → Supabase dashboard
- [ ] **0.08** Write `src/lib/supabase/client.ts` using `createBrowserClient` from `@supabase/ssr` → `src/lib/supabase/client.ts`
- [ ] **0.09** Write `src/lib/supabase/server.ts` using `createServerClient` with cookie adapter for RSCs and Server Actions → `src/lib/supabase/server.ts`
- [ ] **0.10** Write `middleware.ts`: refresh session on every request; redirect `/admin/*` (except `/admin/login`) to `/admin/login` if no session → `middleware.ts`
- [ ] **0.11** Write `supabase/migrations/001_initial_schema.sql`: all 7 tables with columns, types, indexes, foreign keys → `supabase/migrations/001_initial_schema.sql`
- [ ] **0.12** Write `supabase/migrations/002_rls_policies.sql`: enable RLS on all tables; default-deny; public SELECT on published rows; authenticated full access for admin → `supabase/migrations/002_rls_policies.sql`
- [ ] **0.13** Write `supabase/migrations/003_storage_buckets.sql`: create `team-photos`, `project-images`, `news-images`, `publication-pdfs` with public read policies → `supabase/migrations/003_storage_buckets.sql`
- [ ] **0.14** Apply migrations: `npx supabase db push --linked` → Supabase hosted DB
- [ ] **0.15** Generate TypeScript types: `npx supabase gen types typescript --project-id <id> > src/types/database.ts` → `src/types/database.ts`
- [ ] **0.16** Define app model types in `src/types/models.ts` (NewsArticle, ResearchProject, TeamMember, Session, Program, Application, FAQItem) → `src/types/models.ts`
- [ ] **0.17** Define enums in `src/types/enums.ts` (SessionType, AudienceType, ApplicationStatus, ProjectStatus, ProgramType) → `src/types/enums.ts`
- [ ] **0.18** Write `src/styles/tokens.css`: CSS custom properties for `--color-*`, `--space-*`, `--radius-*`, `--shadow-*`, `--font-*` → `src/styles/tokens.css`
- [ ] **0.19** Write `src/styles/globals.css`: box-sizing reset, margin/padding zero, import tokens, set base font and background → `src/styles/globals.css`
- [ ] **0.20** Write `src/styles/typography.css`: heading scale h1–h6, body/caption/label text sizes, line-heights → `src/styles/typography.css`
- [ ] **0.21** Write `src/styles/animations.css`: keyframes (fadeIn, slideUp, countUp), utility transition classes → `src/styles/animations.css`
- [ ] **0.22** Configure `next/font/google` in `src/app/layout.tsx`: Inter + JetBrains Mono; apply font variables to `<html>` element → `src/app/layout.tsx`
- [ ] **0.23** Create GitHub repo, push initial commit, import to Vercel, connect to `main` branch → GitHub + Vercel
- [ ] **0.24** Add all env vars to Vercel (Production + Preview); mark `SUPABASE_SERVICE_ROLE_KEY` as server-only → Vercel dashboard
- [ ] **0.25** Configure `next.config.ts`: `images.remotePatterns` for Supabase Storage CDN domain; `X-Frame-Options: DENY` and CSP headers → `next.config.ts`

---

### Phase 1 — Public Portal: Static & Dynamic Pages

> Goal: Every public-facing route renders with real data from Supabase, correct metadata, and a polished layout.

#### Layout & Navigation
- [ ] **1.01** Build `Header`: logo, nav links (Home, Research, Facilities, Goals, Sessions, Join), hamburger placeholder → `src/components/layout/Header/`
- [ ] **1.02** Build `Footer`: 3-column layout (Quick Links, Contact Info, Social Links), copyright → `src/components/layout/Footer/`
- [ ] **1.03** Wire Header + Footer into root `src/app/layout.tsx`; apply font CSS variable classNames → `src/app/layout.tsx`
- [ ] **1.04** Build `src/app/not-found.tsx`: styled 404 page with "Return Home" button → `src/app/not-found.tsx`
- [ ] **1.05** Build `src/app/error.tsx`: error boundary with "Try again" reset button → `src/app/error.tsx`

#### Homepage (`/`)
- [ ] **1.06** Write `getHomepageData()`: fetch 3 active research areas, 3 upcoming sessions, team members → `src/lib/queries/`
- [ ] **1.07** Build `HeroSection`: display headline with gradient word, sub-headline, 2 CTAs → `src/components/sections/HeroSection/`
- [ ] **1.08** Build `ResearchGrid` (3-column card grid): cover image + title + tag + summary → `src/components/sections/ResearchGrid/`
- [ ] **1.09** Build `StatsCounter` shell: 4 stat cards (projects, publications, team, years) → `src/components/sections/StatsCounter/`
- [ ] **1.10** Build `LabProgress` section: active experiment cards with progress bars and status badges → `src/components/sections/LabProgress/`
- [ ] **1.11** Build `TeamGrid`: grouped photo cards (PI, PhD, RA, Intern) → `src/components/sections/TeamGrid/`
- [ ] **1.12** Build Upcoming Sessions preview: countdown timer shell + 3 next sessions list → `src/components/sections/UpcomingSessions/`
- [ ] **1.13** Build Careers CTA banner: full-width gradient band + headline + Apply Now button → `src/components/sections/CareersBanner/`
- [ ] **1.14** Assemble `src/app/page.tsx`: server-fetch via `getHomepageData()`, pass to section components → `src/app/page.tsx`
- [ ] **1.15** Inject `ResearchOrganization` JSON-LD into homepage `<head>` → `src/app/page.tsx`

#### Research Pages
- [ ] **1.16** Write `getResearchAreas()` and `getResearchAreaBySlug(slug)` → `src/lib/queries/research.ts`
- [ ] **1.17** Build `src/app/research/page.tsx`: tab sidebar (area list) + active area detail panel → `src/app/research/page.tsx`
- [ ] **1.18** Build `src/app/research/[slug]/page.tsx`: hero image + breadcrumb + description + focus metrics sidebar → `src/app/research/[slug]/page.tsx`
- [ ] **1.19** Add `ResearchProject` JSON-LD, `generateStaticParams()`, `generateMetadata()` → `src/app/research/[slug]/page.tsx`

#### Facilities Pages
- [ ] **1.20** Write `getFacilities()` and `getFacilityBySlug(slug)` → `src/lib/queries/facilities.ts`
- [ ] **1.21** Build `src/app/facilities/page.tsx`: tab sidebar + active facility panel → `src/app/facilities/page.tsx`
- [ ] **1.22** Build `src/app/facilities/[slug]/page.tsx`: hero + specs table + protocols list → `src/app/facilities/[slug]/page.tsx`
- [ ] **1.23** Add `FAQPage` JSON-LD (specs as Q&A), `generateStaticParams()`, `generateMetadata()` → `src/app/facilities/[slug]/page.tsx`

#### Goals Pages
- [ ] **1.24** Write `getGoals()` and `getGoalBySlug(slug)` → `src/lib/queries/goals.ts`
- [ ] **1.25** Build `src/app/goals/page.tsx`: goals index cards with circular progress indicators → `src/app/goals/page.tsx`
- [ ] **1.26** Build `src/app/goals/[slug]/page.tsx`: linear progress bar + vertical phase timeline → `src/app/goals/[slug]/page.tsx`
- [ ] **1.27** Add `Project` JSON-LD, `generateStaticParams()`, `generateMetadata()` → `src/app/goals/[slug]/page.tsx`

#### Sessions Calendar Page
- [ ] **1.28** Write `getSessions(filters?)` fetching `is_public = true` sessions ordered by `scheduled_at ASC` → `src/lib/queries/sessions.ts`
- [ ] **1.29** Build sessions page shell `src/app/sessions/page.tsx` → `src/app/sessions/page.tsx`
- [ ] **1.30** Build `src/app/sessions/[slug]/page.tsx`: full session detail with presenters → `src/app/sessions/[slug]/page.tsx`

#### Careers / Join Page
- [ ] **1.31** Build `src/app/join/page.tsx`: page hero + position openings list + `ApplicationForm` → `src/app/join/page.tsx`
- [ ] **1.32** Add `JobPosting` JSON-LD for each open position → `src/app/join/page.tsx`

#### About Page
- [ ] **1.33** Build `src/app/about/page.tsx`: mission section + PI profile card + institute story → `src/app/about/page.tsx`

---

### Phase 2 — Interactive Client Components

> Goal: Add `"use client"` interactivity without breaking RSC data flow.

- [ ] **2.01** Build `Tabs` (`"use client"`): `role="tablist/tab/tabpanel"`, ArrowLeft/Right keyboard navigation → `src/components/ui/Tabs/`
- [ ] **2.02** Wire `Tabs` into `/research/page.tsx` and `/facilities/page.tsx` for area switching → respective pages
- [ ] **2.03** Upgrade `StatsCounter` to `"use client"`: IntersectionObserver triggers count-up animation on viewport entry → `src/components/sections/StatsCounter/`
- [ ] **2.04** Upgrade goal vertical Timeline to `"use client"`: milestones fade/slide in on scroll via `useScrollAnimation` hook → `src/app/goals/[slug]/page.tsx`
- [ ] **2.05** Build full `SessionsCalendar` `"use client"`: session_type filter + audience filter; state synced to URL search params → `src/components/sections/SessionsCalendar/`
- [ ] **2.06** Build countdown timer `"use client"`: live digit-flip to next `is_public` session → `src/components/sections/UpcomingSessions/`
- [ ] **2.07** Build `ApplicationForm` `"use client"`: full_name, email, position select, statement textarea, CV file upload, submit → `src/components/sections/ApplicationForm/`
- [ ] **2.08** Wire `ApplicationForm` submit to `submitApplication` Server Action → `src/lib/actions/applications.ts`
- [ ] **2.09** Build `useToast` hook + `Toast` component: auto-dismiss 5s success/error → `src/hooks/useToast.ts`
- [ ] **2.10** Implement mobile hamburger in `Header` (`"use client"`): focus trap, close on Escape + outside click → `src/components/layout/Header/`
- [ ] **2.11** Implement `useDebounce` (300ms) for any search inputs → `src/hooks/useDebounce.ts`
- [ ] **2.12** Implement `useScrollAnimation` IntersectionObserver hook → `src/hooks/useScrollAnimation.ts`
- [ ] **2.13** Animate goal progress bar width from 0% to target% on scroll entry → `src/app/goals/[slug]/page.tsx`

---

### Phase 3 — Admin Dashboard & CMS

> Goal: Fully functional admin panel behind authentication for all content types and applicant review.

#### Authentication
- [ ] **3.01** Build `src/app/admin/login/page.tsx`: email + password form, calls `signIn` Server Action → `src/app/admin/login/page.tsx`
- [ ] **3.02** Write `signIn` and `signOut` Server Actions using Supabase Auth → `src/lib/actions/auth.ts`
- [ ] **3.03** Build `AdminSidebar`: nav links with active-link detection via `usePathname` → `src/components/layout/AdminSidebar/`
- [ ] **3.04** Build `AdminTopBar`: breadcrumb, user email, Sign Out button → `src/components/layout/AdminTopBar/`
- [ ] **3.05** Build `src/app/admin/layout.tsx`: sidebar + main flex layout; server-side session check → `src/app/admin/layout.tsx`
- [ ] **3.06** Build `src/app/admin/page.tsx`: dashboard with stat cards + recent applicants + next sessions → `src/app/admin/page.tsx`

#### Admin UI Primitives
- [ ] **3.07** Build `DataTable`: sortable columns, text search, row actions (edit, delete with modal confirmation) → `src/components/admin/DataTable/`
- [ ] **3.08** Build `FormField`: label + control + error + help text with correct `htmlFor`/`id` → `src/components/admin/FormField/`
- [ ] **3.09** Build `ImageUpload`: file input + styled trigger + Supabase Storage upload + preview + delete → `src/components/ui/ImageUpload/`

#### Research Areas CRUD
- [ ] **3.10** Write Server Actions: `createResearchArea`, `updateResearchArea`, `deleteResearchArea` with `revalidatePath('/research')` → `src/lib/actions/research.ts`
- [ ] **3.11** Build `src/app/admin/research/page.tsx`: DataTable (Title, Slug, Published) → `src/app/admin/research/page.tsx`
- [ ] **3.12** Build new/edit forms: title (auto-slug), summary, description, cover image, focus_metrics editor, is_published toggle → admin research forms

#### Facilities CRUD
- [ ] **3.13** Write Server Actions: `createFacility`, `updateFacility`, `deleteFacility` with `revalidatePath('/facilities')` → `src/lib/actions/facilities.ts`
- [ ] **3.14** Build `src/app/admin/facilities/page.tsx` + new/edit forms: name, summary, image, specs editor, protocols editor → admin facilities pages

#### Goals CRUD
- [ ] **3.15** Write Server Actions: `createGoal`, `updateGoal`, `deleteGoal` with `revalidatePath('/goals')` → `src/lib/actions/goals.ts`
- [ ] **3.16** Build `src/app/admin/goals/page.tsx` + new/edit forms: title, description, progress %, target_date, phases editor → admin goals pages

#### Team Members CRUD
- [ ] **3.17** Write Server Actions: `createMember`, `updateMember`, `deleteMember` with `revalidatePath('/')` → `src/lib/actions/team.ts`
- [ ] **3.18** Build `src/app/admin/team/page.tsx` + new/edit forms: name, role, category select, bio, photo upload, email, sort_order → admin team pages

#### Sessions CRUD
- [ ] **3.19** Write Server Actions: `createSession`, `updateSession`, `deleteSession` with `revalidatePath('/sessions')` → `src/lib/actions/sessions.ts`
- [ ] **3.20** Build `src/app/admin/sessions/page.tsx` + new/edit forms: title, description, session_type, audience, scheduled_at, end_at, location, is_public, presenters → admin sessions pages

#### PI Profile Management
- [ ] **3.21** Write `updatePIProfile` Server Action → `src/lib/actions/pi.ts`
- [ ] **3.22** Build `src/app/admin/pi/page.tsx`: singleton form for PI name, title, bio, photo, email, publications list, quote → `src/app/admin/pi/page.tsx`

#### Applicant Review Board
- [ ] **3.23** Write `submitApplication` Server Action (public): Zod validate → insert to `applicants` table → NO email sent → `src/lib/actions/applications.ts`
- [ ] **3.24** Write `updateApplicantStatus(id, status, notes)` Server Action (admin-only) → `src/lib/actions/applications.ts`
- [ ] **3.25** Build `src/app/admin/applicants/page.tsx`: DataTable (Name, Position, Date, Status); filter by status → `src/app/admin/applicants/page.tsx`
- [ ] **3.26** Build `ApplicantCard`: all fields + CV download + status dropdown + admin_notes textarea + Save → `src/components/admin/ApplicantCard/`
- [ ] **3.27** Build `src/app/admin/applicants/[id]/page.tsx`: full ApplicantCard; when status = shortlisted, show email in highlighted callout with "Contact this applicant directly" label — NO automated email → `src/app/admin/applicants/[id]/page.tsx`

---

### Phase 4 — GEO/SEO, Performance & QA

> Goal: Lighthouse >= 90 across all audits. All structured data validated. Mobile verified at 375px–430px.

#### Structured Data
- [ ] **4.01** Build `JsonLd.tsx` component: renders `<script type="application/ld+json">` in head → `src/components/seo/JsonLd.tsx`
- [ ] **4.02** Build all 5 schema builders: `researchOrganization.ts`, `researchProject.ts`, `faqPage.ts`, `person.ts`, `jobPosting.ts` → `src/components/seo/schemas/`
- [ ] **4.03** Inject JSON-LD into every applicable page (see TRD §6.2 for page-to-schema mapping) → respective `page.tsx` files
- [ ] **4.04** Validate all schemas at https://search.google.com/test/rich-results — zero errors

#### Sitemap & Robots
- [ ] **4.05** Implement `src/app/sitemap.ts`: async fetch all published slugs → `MetadataRoute.Sitemap` with lastModified + priority → `src/app/sitemap.ts`
- [ ] **4.06** Implement `src/app/robots.ts`: `Allow: /`, `Disallow: /admin/`, sitemap URL → `src/app/robots.ts`

#### Metadata Audit
- [ ] **4.07** Confirm root `layout.tsx`: `metadataBase`, `title.template`, default OG image, `twitter.card` → `src/app/layout.tsx`
- [ ] **4.08** Audit every `page.tsx` — each must export `generateMetadata()` with unique title + description + OG image

#### Performance
- [ ] **4.09** Set `priority={true}` on all above-fold `<Image>` components; confirm others lazy-load → all pages
- [ ] **4.10** Add `export const revalidate = 3600` to dynamic detail pages → respective `[slug]/page.tsx` files
- [ ] **4.11** Confirm every CUD Server Action calls `revalidatePath()` for affected routes → `src/lib/actions/*.ts`
- [ ] **4.12** Wrap all async RSC data sections in `<Suspense fallback={<Spinner />}>` → all page files

#### Mobile QA
- [ ] **4.13** Test all public pages at 375px (iPhone SE): no horizontal overflow, touch targets >= 44×44px
- [ ] **4.14** Test all public pages at 430px (Galaxy S24): no layout breaks
- [ ] **4.15** Test admin panel at 768px: sidebar collapses, DataTable horizontally scrollable

#### Lighthouse & Accessibility
- [ ] **4.16** Run Lighthouse (Incognito) on homepage, a research page, a sessions page — all 4 scores >= 90
- [ ] **4.17** Fix all a11y violations: alt on every image, aria-labels on icon buttons, correct heading hierarchy
- [ ] **4.18** Keyboard-only navigation test: Header nav, Tabs, ApplicationForm, countdown timer

---

## 5. Component Development Order

```
 1. Design tokens & global CSS            ← no dependencies
 2. Button, Badge, Spinner, Toast         ← tokens
 3. FormField, Modal                      ← Button
 4. Header, Footer                        ← Button, tokens
 5. Card                                  ← tokens
 6. Pagination                            ← Button
 7. Tabs                                  ← tokens, Button
 8. ImageUpload                           ← Supabase client, Button
 9. DataTable                             ← Button, Modal
10. AdminSidebar, AdminTopBar             ← Button
11. HeroSection                           ← tokens, Button
12. ResearchGrid, TeamGrid                ← Card, Badge
13. StatsCounter                          ← useScrollAnimation
14. Timeline (vertical)                   ← useScrollAnimation
15. SessionsCalendar                      ← Badge, useDebounce
16. Countdown Timer                       ← tokens
17. ApplicationForm                       ← FormField, Button, Toast, ImageUpload
18. JsonLd + schema builders              ← no dependencies
19. ApplicantCard                         ← Badge, FormField, Button
20. CareersBanner, LabProgress            ← Card, Button
```

---

## 6. Data Seeding Plan

### 6.1 Seed Files

- `supabase/seed.sql` — auto-applied by `supabase db reset` (local dev)
- `scripts/seed-dev.ts` — TypeScript seeder for hosted Supabase: `npx tsx scripts/seed-dev.ts`

### 6.2 Seed Records Required

| Table | Count | Details |
|---|---|---|
| `team_members` | 8 | 1 PI, 2 PhD, 3 RA, 2 Interns |
| `research_areas` | 5 | 4 published, 1 draft |
| `facilities` | 4 | All published (Smart Greenhouse, Laminar Flow, etc.) |
| `goals` | 4 | Mix of progress percentages and phases |
| `upcoming_sessions` | 8 | Mix of all types/audiences; 2 with `is_public = false` |
| `applicants` | 5 | Statuses: 2 new, 1 reviewed, 1 shortlisted, 1 rejected |
| `pi_profile` | 1 | Dr. Evelyn Vance singleton row |
| `lab_progress` | 4 | Active experiment tracker cards |

### 6.3 Admin User

Create via Supabase Dashboard → Authentication → Users → "Invite User". **Do NOT seed admin credentials via SQL.** Store in a secure password manager. Enable TOTP 2FA after first login.

### 6.4 Storage Placeholder Images

Upload via Supabase Dashboard Storage UI (not git-tracked):
- `team-photos/`: 8 portrait photos `{slug}.jpg`
- `facility-images/`: 4 cover images
- `research-images/`: 5 cover images

---

## 7. Environment Setup Instructions

### 7.1 Prerequisites

```bash
node --version    # Node.js 20+
npm --version     # npm 10+
git --version
```

### 7.2 Clone & Install

```bash
git clone https://github.com/<org>/nexus-genomics-portal.git
cd nexus-genomics-portal
npm install
```

### 7.3 Environment Variables

```bash
cp .env.example .env.local
# Open .env.local and fill in your Supabase credentials
```

`.env.example`:
```bash
# Supabase (public — safe to expose in browser)
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>

# Supabase (private — NEVER expose to browser, NEVER prefix with NEXT_PUBLIC_)
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# Application
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Nexus Genomics Institute
```

### 7.4 Apply Migrations

```bash
# Hosted Supabase
npx supabase link --project-ref <ref>
npx supabase db push

# Local Supabase (requires Docker Desktop)
npx supabase start
npx supabase db reset   # applies migrations + seed.sql
```

### 7.5 Generate TypeScript Types

```bash
npx supabase gen types typescript \
  --project-id <ref> --schema public \
  > src/types/database.ts
```

Add to `package.json` scripts:
```json
"gen:types": "supabase gen types typescript --project-id <ref> --schema public > src/types/database.ts"
```

> **Rule:** Re-run `npm run gen:types` after every schema migration.

### 7.6 Run Dev Server

```bash
npm run dev
# http://localhost:3000         ← Public portal
# http://localhost:3000/admin   ← Redirects to /admin/login
```

### 7.7 Seed Development Data

```bash
# Local (auto via db reset above)
npx supabase db reset

# Hosted
npx tsx scripts/seed-dev.ts
```

---

## 8. Deployment Pipeline

### 8.1 Branch Strategy

| Branch | Environment | URL |
|---|---|---|
| `main` | Production | `https://nexusgenomics.org` |
| `feature/*` PRs | Preview | Auto-generated Vercel preview URL |

### 8.2 Vercel Setup

```
1. https://vercel.com/new → Import GitHub repo
2. Framework: Next.js (auto-detected)
3. Root Directory: /; Build: npm run build
4. Click Deploy
```

### 8.3 Environment Variables in Vercel

| Variable | Environments | Server-Only? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Production, Preview | No |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production, Preview | No |
| `SUPABASE_SERVICE_ROLE_KEY` | Production, Preview | **YES — uncheck "Expose to Browser"** |
| `NEXT_PUBLIC_SITE_URL` | Production: final domain; Preview: Vercel URL | No |
| `NEXT_PUBLIC_SITE_NAME` | Production, Preview | No |

### 8.4 Custom Domain Setup

```
1. Vercel → Project → Settings → Domains
   Add: nexusgenomics.org
   Add: www.nexusgenomics.org

2. DNS Registrar:
   A record:     @ → 76.76.21.21
   CNAME record: www → cname.vercel-dns.com

3. Vercel auto-provisions TLS via Let's Encrypt

4. Supabase Dashboard → Auth → URL Configuration:
   Site URL: https://nexusgenomics.org
   Redirect URLs: https://nexusgenomics.org/**
```

### 8.5 Post-Deploy Smoke Test

```bash
curl -I https://nexusgenomics.org              # Expect: HTTP 200
curl https://nexusgenomics.org/sitemap.xml     # Expect: valid XML
curl https://nexusgenomics.org/robots.txt      # Expect: Disallow: /admin/
curl -I https://nexusgenomics.org/admin        # Expect: HTTP 302 → /admin/login
```

---

## 9. Risk Register

| ID | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R1 | RLS misconfiguration exposes applicant PII | Medium | Critical | Default-deny RLS. No public SELECT on `applicants`. Manual audit before launch. |
| R2 | `SUPABASE_SERVICE_ROLE_KEY` committed to git | Low | Critical | `.gitignore` enforced. Rotate immediately if exposed. Use `git-secrets` pre-commit hook. |
| R3 | Admin account compromised (no 2FA) | Medium | High | Enable Supabase TOTP 2FA. Document in admin onboarding guide. |
| R4 | Uploaded CV/file contains malware | Low | High | Accept only `.pdf` and `image/*`. Run MIME type validation server-side. Max 10 MB. |
| R5 | `generateStaticParams` times out on large slug set | Low | Medium | Limit to 50 most recent slugs per entity. Set `dynamicParams = true` for ISR fallback. |
| R6 | `sitemap.ts` DB query fails during build | Low | Medium | Wrap in try/catch. Return partial sitemap on error rather than failing entire build. |
| R7 | Stale ISR cached pages after admin content edits | Medium | Medium | Every CUD Server Action calls `revalidatePath()` for all affected public routes. |
| R8 | Admin accidentally deletes critical content | Medium | Medium | Confirmation modal shows item name. Consider soft-delete in v1.1. |
| R9 | Website not indexed by Google post-launch | Medium | Medium | Submit sitemap + request indexing in GSC on Day 1. Monitor Coverage daily. |
| R10 | Generated `database.ts` types become stale after migration | High | Low | Run `npm run gen:types` after every migration. Add CI lint step to detect stale types. |
| R11 | Mobile layout breaks at 375px | Medium | Medium | Run Chrome DevTools mobile simulation after every new page/section build. |
| R12 | Admin contacts all applicants instead of only shortlisted | Low | High | UI only shows applicant email prominently when status = `shortlisted`. No mailto button for other statuses. |

---

## 10. Definition of Done

### Phase-Level DoD

#### Phase 0 — Foundation
- [ ] `npm run dev` starts with zero TypeScript errors in strict mode
- [ ] All 3 migrations applied successfully (`supabase db diff` shows no pending changes)
- [ ] `src/types/database.ts` generated and reflects current schema
- [ ] CSS tokens visible on `:root` in browser DevTools
- [ ] Vercel shows a successful production deployment
- [ ] All env vars confirmed set in Vercel (Production + Preview)

#### Phase 1 — Public Portal
- [ ] All public routes return HTTP 200 with real DB content (not seed placeholder text)
- [ ] Zero hardcoded content strings in any page file
- [ ] Every page exports `generateMetadata()` with unique title + description
- [ ] Dynamic pages return 404 for nonexistent slugs
- [ ] Zero JS console errors on any public page
- [ ] Basic layout intact at 375px width

#### Phase 2 — Interactive Components
- [ ] All client components function with JavaScript disabled (graceful degradation)
- [ ] `ApplicationForm` successfully writes a row to the `applicants` table (verified in Supabase dashboard)
- [ ] `SessionsCalendar` filter state syncs to and restores from URL search params
- [ ] `Tabs` keyboard navigation: ArrowLeft/Right switches, Enter activates
- [ ] Hamburger: opens, traps focus, closes on Escape and outside click
- [ ] Countdown timer updates every second and reflows correctly on mobile

#### Phase 3 — Admin CMS
- [ ] Admin login works with valid credentials; fails with clear error for invalid
- [ ] Visiting `/admin` without session redirects immediately — no content flash
- [ ] Admin can Create, Read, Update, Delete one record of every entity type
- [ ] Image upload works and CDN URL is saved to DB
- [ ] CV upload works and secure URL is saved to `applicants.cv_url`
- [ ] Admin can change applicant status through all states
- [ ] When status = `shortlisted`, applicant email appears prominently. No automated email is sent.
- [ ] Logout clears session; subsequent `/admin` visit redirects to login

#### Phase 4 — GEO/SEO & QA
- [ ] Lighthouse >= 90 for Performance, Accessibility, Best Practices, SEO on homepage (Incognito, desktop)
- [ ] All 5 JSON-LD schema types pass Google Rich Results Test with zero errors
- [ ] `sitemap.xml` returns valid XML listing all published slugs
- [ ] `robots.txt` contains `Disallow: /admin/` and sitemap URL
- [ ] Zero horizontal overflow at 375px on any public page
- [ ] All touch targets >= 44×44px on mobile
- [ ] Zero critical accessibility violations in Lighthouse

### Project Launch-Ready DoD (All phases complete, PLUS)

- [ ] Custom domain live with valid TLS certificate
- [ ] Admin has enabled TOTP 2FA on Supabase account
- [ ] All real production content in DB (not seed data)
- [ ] End-to-end application submission tested in production
- [ ] Google Search Console verified and sitemap submitted
- [ ] Dr. Vance has reviewed and approved all public-facing content
- [ ] Admin onboarding guide delivered to client

---

## 11. Post-Launch Checklist

### Day 0 — Launch Hour

- [ ] `https://nexusgenomics.org` loads with correct content and valid TLS
- [ ] Submit a test application end-to-end in production
- [ ] Verify test application visible in admin review board (not in email inbox)
- [ ] Change test application status to "shortlisted"; confirm email shown, no auto-email triggered
- [ ] Delete test application record
- [ ] Verify sitemap: `curl https://nexusgenomics.org/sitemap.xml | head -30`
- [ ] Verify robots: `curl https://nexusgenomics.org/robots.txt`
- [ ] Check Vercel deployment logs — zero build errors

### Day 1 — Google Search Console

- [ ] Add property: https://search.google.com/search-console → URL Prefix → `https://nexusgenomics.org`
- [ ] Verify via HTML meta tag: add `metadata.verification.google` to root `layout.tsx`, redeploy
- [ ] Submit sitemap: GSC → Sitemaps → `https://nexusgenomics.org/sitemap.xml`
- [ ] Request indexing: URL Inspection → homepage → "Request Indexing"
- [ ] Repeat for `/research`, `/facilities`, `/goals`, `/sessions`, `/join`

### Day 1 — Structured Data Validation

- [ ] Test homepage: https://search.google.com/test/rich-results → `ResearchOrganization` ✓
- [ ] Test `/research/[slug]` → `ResearchProject` ✓
- [ ] Test `/facilities/[slug]` → `FAQPage` ✓
- [ ] Test `/join` → `JobPosting` ✓
- [ ] Fix any errors, redeploy, re-validate

### Day 2 — Monitoring Setup

- [ ] Enable Vercel Web Analytics in Project Settings
- [ ] Configure uptime monitor (1-minute checks, email alert if down > 2 min)
- [ ] Enable Supabase usage alerts (disk > 80%, DB connections > 80%)

### Day 2 — Admin Handoff Verification

- [ ] Admin creates first real news/update post → appears on homepage and sessions page
- [ ] Admin creates upcoming session → appears on `/sessions` with correct type/audience filters
- [ ] Admin edits a team member → updated content reflects immediately on public site
- [ ] All images confirmed loading from Supabase CDN (verify via Network tab)

### Week 1 — GSC Monitoring

- [ ] GSC → Coverage: "Valid" count growing, zero errors
- [ ] GSC → Sitemaps: "Success" status with correct URL count
- [ ] GSC → Enhancements: No rich result errors
- [ ] Monitor for crawl errors (404s = broken internal links)
- [ ] Core Web Vitals report populates after 7–28 days of real-user traffic

---

*End of Master Implementation Plan — Nexus Genomics Institute Digital Portal*
*Version 1.0 · May 2026 · Prepared for Dr. Evelyn Vance, Nexus Genomics Institute*
