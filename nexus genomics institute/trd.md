# Technical Requirements Document (TRD)
## Project: Nexus Genomics Institute — Official Digital Portal
**Prepared by:** Development Team  
**Client:** Nexus Genomics Institute, Dr. Evelyn Vance (Lead Research Scientist & Founding Director)  
**Document Version:** 1.0  
**Date:** May 2026  
**Status:** Approved for Development  
**Reference PRD:** `prd.md` v1.0

---

## 1. Purpose of This Document

This Technical Requirements Document translates the product requirements defined in the PRD into a precise, implementation-ready blueprint. It covers system architecture, technology stack decisions, data modeling, API contracts, security mechanisms, deployment pipeline, and testing strategy.

This document is the source of truth for all engineering decisions made during the build of the **Nexus Genomics Institute Digital Portal** — the institute's first-ever web presence, built from scratch.

---

## 2. System Architecture Overview

The system is composed of three logical tiers:

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer                             │
│   Browser (Desktop + Mobile) — React Server & Client Components │
└───────────────────────┬─────────────────────────────────────────┘
                        │  HTTPS
┌───────────────────────▼─────────────────────────────────────────┐
│                   Application Layer                             │
│     Next.js 15 App Router — Vercel Edge Network                 │
│     ├─ Server Components (SSR / HTML rendering for crawlers)    │
│     ├─ Client Components (Interactive UI / hydration)           │
│     └─ API Routes (File uploads, Admin auth, Supabase proxy)    │
└───────────────────────┬─────────────────────────────────────────┘
                        │ REST / SDK
┌───────────────────────▼─────────────────────────────────────────┐
│                      Data Layer                                 │
│     Supabase (PostgreSQL + Storage + Auth)                      │
│     ├─ Database: All CMS content (research, facilities, etc.)   │
│     ├─ Storage: CV file uploads + media assets                  │
│     └─ Auth: Admin session management                           │
└─────────────────────────────────────────────────────────────────┘
```

**Architecture Pattern:** Server-first hybrid rendering. Public pages are pre-rendered as Server Components to deliver full HTML to crawlers (critical for GEO/SEO). Interactive elements (countdown timers, tab panels, admin forms) are isolated in Client Components and hydrated after initial paint.

---

## 3. Technology Stack

### 3.1 Frontend

| Layer | Technology | Rationale |
|---|---|---|
| Framework | Next.js 15 (App Router) | Server Components for SSR/GEO; built-in routing and metadata API |
| Compiler/Bundler | Turbopack (Next.js default) | Faster HMR and local development cycles |
| Language | TypeScript | Type-safety across components, API responses, and Supabase queries |
| Styling | CSS Modules + Global CSS | Scoped styles per component; no runtime CSS-in-JS overhead |
| Font Loading | `next/font` (Google Fonts) | Zero layout shift; self-hosted with built-in font optimization |
| Image Optimization | `next/image` | Automatic WebP conversion, lazy loading, and responsive `srcset` |

### 3.2 Backend & Data

| Layer | Technology | Rationale |
|---|---|---|
| Database | Supabase (PostgreSQL) | Managed relational database with built-in REST and realtime APIs |
| File Storage | Supabase Storage | Handles CV uploads and image assets with CDN delivery |
| Admin Authentication | Supabase Auth (Email + Password) | Session tokens via `@supabase/ssr` for secure cookie-based server sessions |
| API Routes | Next.js Route Handlers (`/app/api`) | Server-side data mutations; CV upload proxy with size/type validation |
| Fallback Data | Local `src/data/db.json` | Development mode and Supabase outage resilience via a `useLiveData` hook |

### 3.3 Infrastructure & Deployment

| Layer | Technology | Rationale |
|---|---|---|
| Hosting | Vercel | Seamless Next.js deployment; Edge Network for global CDN caching |
| Domain / DNS | Client-managed (e.g., Namecheap / GoDaddy) | Client retains ownership; we configure CNAME records |
| Environment Secrets | Vercel Environment Variables | `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` never exposed to client |

---

## 4. Database Design

All CMS content is stored in Supabase PostgreSQL. Tables follow a normalized relational schema.

### 4.1 Table: `research_areas`
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | Auto-generated |
| `slug` | `text` UNIQUE | URL-safe identifier (e.g., `herbal-genomics`) |
| `title` | `text` | Display name |
| `summary` | `text` | Short overview (used in cards) |
| `description` | `text` | Full detail text (used on inner page) |
| `image_url` | `text` | Supabase Storage CDN URL |
| `focus_metrics` | `jsonb` | Array of `{ label, value }` sidebar stats |
| `created_at` | `timestamptz` | Auto-set on insert |

### 4.2 Table: `facilities`
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | Auto-generated |
| `slug` | `text` UNIQUE | URL-safe identifier |
| `name` | `text` | Facility display name |
| `summary` | `text` | Short card overview |
| `image_url` | `text` | Header image CDN URL |
| `specs` | `jsonb` | Array of `{ label, value }` specification rows |
| `protocols` | `jsonb` | Array of `{ name, status }` experimental protocols |

### 4.3 Table: `goals`
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | — |
| `slug` | `text` UNIQUE | — |
| `title` | `text` | Goal headline |
| `description` | `text` | Summary paragraph |
| `progress` | `integer` | 0–100 percentage complete |
| `target_date` | `date` | Projected completion date |
| `phases` | `jsonb` | Array of `{ phase_name, milestones[], is_complete }` |

### 4.4 Table: `team_members`
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | — |
| `name` | `text` | Full name |
| `role` | `text` | Display role title |
| `category` | `text` | `PI`, `PhD`, `RA`, `Intern` |
| `bio` | `text` | Short biography blurb |
| `photo_url` | `text` | Portrait image CDN URL |
| `email` | `text` | Optional contact address |
| `sort_order` | `integer` | Controls rendering order within category |

### 4.5 Table: `upcoming_sessions`

This table powers both the homepage countdown timer and the public-facing **Sessions Calendar** — a dedicated view that surfaces all scheduled meetings, symposia, and knowledge-exchange events so that internal members, prospective collaborators, and interested external parties can plan and attend without relying on email announcements.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | — |
| `title` | `text` | Session or symposium title |
| `description` | `text` | Brief agenda or purpose of the session |
| `session_type` | `text` | `weekly_meeting`, `symposium`, `knowledge_exchange`, `public_event` |
| `audience` | `text` | `internal`, `collaborators`, `open_public` — controls visibility label on the calendar |
| `scheduled_at` | `timestamptz` | Date and time for countdown calculation and calendar display |
| `end_at` | `timestamptz` | Session end time for duration display |
| `location` | `text` | Physical address or virtual meeting link |
| `is_public` | `boolean` | If `true`, shown on the public calendar; if `false`, visible only in admin |
| `presenters` | `jsonb` | Array of `{ name, topic }` |
| `created_at` | `timestamptz` | Auto-set on insert |

### 4.6 Table: `applicants`

> **Applicant Workflow Note:** Incoming applications are **never routed to Dr. Vance's personal email**. All submissions are stored directly in this table and surfaced exclusively through the admin dashboard. Dr. Vance reviews applications in the admin board and manually contacts only shortlisted candidates from her own email — the system does not send outbound mail on her behalf.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | — |
| `full_name` | `text` | Applicant full name |
| `email` | `text` | Contact email |
| `position` | `text` | Role applied for |
| `statement` | `text` | Statement of purpose |
| `cv_url` | `text` | Supabase Storage URL for CV file |
| `submitted_at` | `timestamptz` | Auto-set on insert |
| `status` | `text` | `new` → `reviewed` → `shortlisted` or `rejected` (admin-controlled status gate) |
| `admin_notes` | `text` | Internal notes added by admin during review; never visible to applicant |

### 4.7 Table: `pi_profile`
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | Singleton row (only one PI profile) |
| `name` | `text` | — |
| `title` | `text` | Academic title |
| `affiliation` | `text` | University or institution affiliation |
| `bio` | `text` | Extended biography |
| `photo_url` | `text` | — |
| `email` | `text` | Public contact email |
| `publications` | `jsonb` | Array of `{ title, journal, year, doi }` |
| `quote` | `text` | Featured pull quote |

---

## 5. API & Route Specifications

### 5.1 Public Data Fetching

All public data fetching is performed via Supabase's JavaScript SDK (`@supabase/supabase-js`) inside **Next.js Server Components**, ensuring the data is available in the initial HTML response.

```
Pattern: Server Component → supabase.from('table').select() → render HTML
Fallback: if (supabaseError) { return localFallbackData from db.json }
```

### 5.2 Admin API Routes (Next.js Route Handlers)

All mutation endpoints live under `/app/api/admin/` and validate the presence of a valid Supabase session cookie before processing any request.

> **Admin Authority:** The admin holds the highest level of authority over all site content. Every data entity — research areas, facilities, goals, team members, sessions, applicant records, and the PI profile — can be created, modified, or permanently deleted exclusively through these authenticated routes. No content change requires developer involvement.

| Route | Method | Description |
|---|---|---|
| `/api/admin/research` | `POST / PUT / DELETE` | Create, update, or remove a research area |
| `/api/admin/facilities` | `POST / PUT / DELETE` | Manage facility records |
| `/api/admin/goals` | `POST / PUT / DELETE` | Manage strategic goals and phases |
| `/api/admin/team` | `POST / PUT / DELETE` | Add or remove team members |
| `/api/admin/sessions` | `POST / PUT / DELETE` | Manage sessions calendar entries (title, type, audience, date, time, location, presenters, public visibility flag) |
| `/api/admin/applicants` | `GET / PUT` | Fetch applicant list; update applicant `status` and `admin_notes` (no DELETE — records are preserved for audit trail) |
| `/api/admin/upload` | `POST` | Handle image and CV file uploads (max 10 MB; accept: `.pdf`, `.docx`, `image/*`) |
| `/api/admin/pi` | `PUT` | Update the singleton PI profile record |

### 5.3 Authentication Flow

```
1. Admin navigates to /admin
2. Next.js middleware (middleware.ts) checks for a valid Supabase session cookie
3. If no valid session → redirect to /admin/login
4. On login form submit → call supabase.auth.signInWithPassword()
5. On success → Supabase sets an HttpOnly session cookie via @supabase/ssr
6. All subsequent /api/admin/* requests validate cookie server-side before any DB mutation
7. On logout → supabase.auth.signOut() clears session; redirect to /admin/login
```

**Session Persistence:** Sessions are managed via `@supabase/ssr` with cookie adapters for both Next.js Middleware and Route Handlers, ensuring no admin session data is exposed to the client JavaScript bundle.

---

## 6. Generative Engine Optimization (GEO) & SEO Implementation

> **Origin Note:** GEO/SEO was identified and recommended by our development team as a high-value, zero-cost enhancement. The client reviewed and formally accepted this recommendation. It is implemented as a first-class technical requirement.

The institute's research must be discoverable and citable by AI search systems (Google Gemini, ChatGPT Search, Perplexity) and indexed completely by traditional search engines.

### 6.1 Metadata API (Next.js)

Every page exports a `generateMetadata()` function returning:
- `title`: Page-specific descriptive title.
- `description`: 150–160 character human-readable summary.
- `keywords`: Domain-specific term arrays.
- `openGraph`: Title, description, image, and URL for social sharing previews.
- `twitter`: Card type and summary for Twitter/X preview.
- `alternates.canonical`: Absolute canonical URL to prevent duplicate indexing.

### 6.2 JSON-LD Structured Data Schemas

Injected as `<script type="application/ld+json">` in the `<head>` of Server Components, ensuring crawlers parse them from raw HTML without JavaScript execution.

| Page | Schema Type |
|---|---|
| Homepage (`/`) | `ResearchOrganization` |
| Research Index (`/research`) | `ItemList` of `ResearchProject` entities |
| Research Detail (`/research/[slug]`) | `ResearchProject` |
| Facilities Detail (`/facilities/[slug]`) | `FAQPage` (Specs as Q&A pairs) |
| Goals Detail (`/goals/[slug]`) | `Project` |
| Team / About | `Person` per team member |
| Careers | `JobPosting` |

### 6.3 Crawlability

**`/public/robots.txt`:**
```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api

Sitemap: https://[domain]/sitemap.xml
```

**`/app/sitemap.ts`** (Next.js Dynamic Sitemap):
Fetches all active slugs from Supabase and returns a `MetadataRoute.Sitemap` array including all `/research/[slug]`, `/facilities/[slug]`, and `/goals/[slug]` paths with `lastModified` and `priority` values.

---

## 7. Mobile Responsiveness Requirements

All layouts must function without horizontal overflow or visual truncation on the following target viewports:

| Device Class | Viewport Width |
|---|---|
| Small Phone (iPhone SE) | 375px |
| Standard Phone (iPhone 15, Pixel 8) | 390px – 414px |
| Large Phone (Samsung Galaxy S24) | 430px |
| Tablet | 768px |
| Desktop | 1024px+ |

### 7.1 CSS Strategy

- **Grid Collapse:** Multi-column CSS grids collapse to single-column via `@media (max-width: 768px)` breakpoints.
- **Card Inner Layout:** Content cards using `display: flex; flex-direction: row` switch to `flex-direction: column` at 768px to stack image above text.
- **Text Wrapping:** All card text elements enforce `word-wrap: break-word` and `overflow-wrap: break-word` to prevent content overflow.
- **Image Containment:** All images use `max-width: 100%; height: auto` and `object-fit: cover` within their flex/grid containers.
- **Session Grid:** Countdown timer and session list grids use `flex-wrap: wrap` to reflow at narrow widths.
- **Typography Scale:** Font sizes reduce proportionally using `clamp()` for fluid scaling between breakpoints.

---

## 8. Performance Requirements

| Metric | Target |
|---|---|
| Google Lighthouse Performance | ≥ 90 |
| Google Lighthouse SEO | ≥ 95 |
| Google Lighthouse Accessibility | ≥ 90 |
| Largest Contentful Paint (LCP) | < 2.5 seconds |
| Cumulative Layout Shift (CLS) | < 0.1 |
| Time to First Byte (TTFB) | < 800ms (Vercel Edge) |

### 8.1 Performance Techniques Applied
- **`next/image`** for automatic WebP conversion, responsive `sizes`, and lazy loading.
- **`next/font`** for zero-CLS font loading via `font-display: swap`.
- **Static pre-rendering** for all public pages via Server Components.
- **Dynamic imports** for heavy admin panel components to avoid bloating the public bundle.
- **`content-visibility: auto`** CSS on below-the-fold sections to defer paint.

---

## 9. Security Requirements

| Threat | Mitigation |
|---|---|
| Unauthorized admin access | Supabase Auth session validation on every Route Handler and Middleware |
| SQL injection | Parameterized queries via Supabase SDK (no raw SQL string interpolation) |
| Malicious file uploads | MIME type and extension validation on `/api/admin/upload`; max file size 10 MB |
| Exposed service-role key | Stored only in Vercel Environment Variables; never in client-side code |
| Cross-site scripting (XSS) | React's default HTML escaping; no use of `dangerouslySetInnerHTML` |
| Row-level data exposure | Supabase Row Level Security (RLS) policies restrict all write operations to authenticated admin sessions |

### 9.1 Supabase Row Level Security Policies

```sql
-- Allow public SELECT on all content tables
CREATE POLICY "Public read access" ON research_areas
  FOR SELECT USING (true);

-- Restrict INSERT/UPDATE/DELETE to authenticated admin users only
CREATE POLICY "Admin write access" ON research_areas
  FOR ALL USING (auth.role() = 'authenticated');
```

The same pattern is applied across `facilities`, `goals`, `team_members`, `upcoming_sessions`, `applicants`, and `pi_profile`.

---

## 10. Deployment Pipeline

### 10.1 Environments

| Environment | URL | Purpose |
|---|---|---|
| Local Development | `http://localhost:3000` | Active development with Turbopack HMR |
| Production | `https://[client-domain].vercel.app` (and custom domain) | Live public-facing site |

### 10.2 CI/CD Flow

```
Developer pushes to main branch
          │
          ▼
Vercel detects push via GitHub integration
          │
          ▼
Vercel runs: next build (Turbopack)
          │
          ▼
Build passes? ──No──► Deployment blocked; dev notified via Vercel dashboard
          │
         Yes
          ▼
Vercel deploys to Edge Network
          │
          ▼
Production URL is live; previous deployment kept on standby for instant rollback
```

### 10.3 Environment Variables Required

```
NEXT_PUBLIC_SUPABASE_URL          # Supabase project REST endpoint (public)
NEXT_PUBLIC_SUPABASE_ANON_KEY     # Supabase public anon key (read-only for public queries)
SUPABASE_SERVICE_ROLE_KEY         # Full admin key (server-only; never exposed to browser)
```

---

## 11. Testing Strategy

### 11.1 Manual QA Checklist (Pre-Launch)

**Core Rendering & SEO**
- [ ] All public pages render correct HTML with no JavaScript required (verify via browser devtools with JS disabled).
- [ ] All JSON-LD schemas validate in Google Rich Results Test (`https://search.google.com/test/rich-results`).
- [ ] Sitemap accessible at `/sitemap.xml` and lists all dynamic slugs.
- [ ] `robots.txt` disallows `/admin` and `/api` for all crawlers.

**Admin Dashboard**
- [ ] Admin login flow: valid credentials grant access; invalid credentials return error with a clear message.
- [ ] Admin session cookie is `HttpOnly` (verify via Network tab — must not be accessible via `document.cookie`).
- [ ] Admin can create, edit, and delete entries across all content types (research, facilities, goals, team, sessions).
- [ ] Admin can view the full applicant list, read statements of purpose, download CVs, update status, and add internal notes.
- [ ] Applicant submission form on `/join` does NOT send any email to Dr. Vance — data goes directly to admin board only.
- [ ] Admin can add a new session with all fields (title, type, audience, date, time, location, presenters) and toggle public visibility.

**Sessions Calendar**
- [ ] Public sessions calendar renders all sessions where `is_public = true`.
- [ ] Sessions flagged `is_public = false` do not appear on the public-facing calendar.
- [ ] Each calendar entry displays: title, date, time, location, session type, intended audience label, and presenter list.
- [ ] Countdown timer on homepage correctly targets the nearest upcoming `is_public` session.
- [ ] Sessions calendar layout reflows correctly on mobile (no horizontal overflow).

**File Uploads**
- [ ] Upload route rejects files > 10 MB with a clear error message.
- [ ] Upload route rejects non-PDF/non-image MIME types.

**Mobile Responsiveness** *(Dev Quality Standard)*
- [ ] All pages render without horizontal scroll on iPhone SE (375px) viewport.
- [ ] All card layouts stack vertically on mobile without text truncation or image clipping.
- [ ] Countdown timer reflows correctly on mobile.
- [ ] `next/image` components load WebP format (verify via Network tab).

### 11.2 Lighthouse Audit
Run Google Lighthouse on all five primary routes before and after deployment:
- `/` (Homepage)
- `/research`
- `/facilities`
- `/goals`
- `/join`

Target: ≥ 90 across Performance, SEO, and Accessibility.

### 11.3 Structured Data Validation
Submit to **Google Search Console** and validate via:
- `https://search.google.com/test/rich-results` (for JSON-LD schemas)
- `https://validator.schema.org/` (for schema.org compliance)

---

## 12. Handoff & Client Onboarding

Upon project completion, the following will be delivered to the client:

1. **Access Credentials:** Admin login email/password for the `/admin` dashboard.
2. **Vercel Project Transfer:** Vercel project ownership transferred to client's Vercel account.
3. **Supabase Project Transfer:** Supabase project transferred to client's Supabase organization.
4. **Admin Guide:** A short video walkthrough of the admin panel demonstrating how to update team members, research areas, and session schedules.
5. **Domain Configuration Guide:** Step-by-step instructions for connecting a custom domain to the Vercel deployment.
6. **Google Search Console Setup:** Instructions for submitting the sitemap and requesting initial indexing.
