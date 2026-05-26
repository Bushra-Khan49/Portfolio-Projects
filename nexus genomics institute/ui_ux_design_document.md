# UI/UX Design Document
## Project: Nexus Genomics Institute — Official Digital Portal
**Prepared by:** Design & Development Team  
**Client:** Nexus Genomics Institute, Dr. Evelyn Vance  
**Document Version:** 1.0  
**Date:** May 2026  
**Status:** Approved — Pre-Development Reference  
**Reference Documents:** `prd.md` v1.0 · `trd.md` v1.0

---

## 1. Design Brief & Philosophy

### 1.1 The Design Challenge
Nexus Genomics Institute is entering the digital world for the first time. The design must do more than inform — it must immediately establish the institute as a **credible, serious, and forward-looking scientific institution** while remaining approachable to diverse audiences: academic collaborators, prospective scholars, funding bodies, and the broader public.

The design must compete visually with the world's top research institutions (MIT Media Lab, Broad Institute, Sanger Institute) while reflecting Nexus's unique positioning at the intersection of **nature and genomic science**.

### 1.2 Design Pillars

| Pillar | Meaning in Practice |
|---|---|
| **Scientific Authority** | Clean, structured layouts that communicate precision and rigor |
| **Organic Intelligence** | Warm, natural undertones that reference the lab's herbal and plant genomics focus |
| **Premium Modernity** | Dark, rich backgrounds with luminous accents — contemporary, not clinical |
| **Information Clarity** | Dense content made scannable through hierarchy, spacing, and typographic contrast |
| **Living Interface** | Subtle, purposeful animations that make the site feel alive and dynamic — not decorative |

### 1.3 Inspiration References
- **MIT Media Lab** — Structured, grid-based scientific information architecture
- **Broad Institute** — Authoritative use of typographic hierarchy and data-dense layouts
- **Apple Science pages** — Ultra-clean dark-mode aesthetics with glowing accent elements
- **Nature / Cell journal websites** — Respect for content density in academic contexts

---

## 2. Brand Identity

### 2.1 Brand Personality
- **Voice:** Authoritative, rigorous, visionary, accessible
- **Tone:** Confident without being inaccessible; scientific without being cold
- **Feel:** Premium dark-mode academic portal — the kind of site that makes a prospective PhD student think *"I want to work here"*

### 2.2 Logo & Wordmark
- **Primary Wordmark:** "NEXUS GENOMICS" in uppercase, letter-spaced tracking
- **Secondary Name:** "Institute" in lighter weight beneath
- **Icon Mark:** An abstract DNA double-helix rendered as two interlocking arcs — can be used standalone as a favicon and loading indicator
- **Favicon:** 32×32 icon mark only, on a deep navy background

### 2.3 Brand Voice in UI Copy
| Context | Tone Example |
|---|---|
| Hero headline | *"Decoding Nature's Blueprint — One Gene at a Time"* |
| Section headings | *"Our Research Focus"*, *"Advanced Facilities"*, *"Join the Lab"* |
| Button labels | *"Explore Research"*, *"View Facilities"*, *"Apply Now"*, *"Learn More"* |
| Error messages | *"Something went wrong. Please try again."* (no jargon) |
| Empty states | *"No sessions scheduled yet. Check back soon."* |

---

## 3. Color System

The palette is built around a **dark deep-space navy base** with **emerald-teal scientific accents** — referencing both the precision of genomics and the organic richness of plant biology.

### 3.1 Primary Palette

| Token Name | Hex Value | Usage |
|---|---|---|
| `--color-bg-primary` | `#050d1a` | Main page background |
| `--color-bg-secondary` | `#0a1628` | Card backgrounds, section alternates |
| `--color-bg-elevated` | `#0f1f38` | Modal backgrounds, admin panels |
| `--color-bg-glass` | `rgba(10, 22, 40, 0.7)` | Glassmorphism overlays |
| `--color-accent-primary` | `#00c896` | CTAs, highlights, active states, glowing elements |
| `--color-accent-secondary` | `#0ea5e9` | Links, secondary badges, info states |
| `--color-accent-warm` | `#7c3aed` | Tertiary accent for goals and milestone indicators |
| `--color-border` | `rgba(0, 200, 150, 0.15)` | Card and section borders |
| `--color-border-subtle` | `rgba(255, 255, 255, 0.06)` | Dividers, subtle separators |

### 3.2 Text Palette

| Token Name | Hex Value | Usage |
|---|---|---|
| `--color-text-primary` | `#f0f6ff` | Headlines and primary body copy |
| `--color-text-secondary` | `#94a3b8` | Subheadings, meta labels, supporting text |
| `--color-text-muted` | `#4a6080` | Timestamps, placeholder text, disabled states |
| `--color-text-accent` | `#00c896` | Highlighted terms, hover states, active nav |
| `--color-text-inverse` | `#050d1a` | Text on light/accent button backgrounds |

### 3.3 Status Colors

| Token Name | Hex Value | Usage |
|---|---|---|
| `--color-success` | `#10b981` | Completed milestones, active protocols |
| `--color-warning` | `#f59e0b` | In-progress indicators, pending status |
| `--color-error` | `#ef4444` | Form validation errors, failed states |
| `--color-info` | `#0ea5e9` | Informational badges, open-public session tags |

### 3.4 Gradient Library

| Name | Definition | Usage |
|---|---|---|
| `gradient-hero` | `linear-gradient(135deg, #050d1a 0%, #0a1628 50%, #0d2040 100%)` | Hero section background |
| `gradient-accent` | `linear-gradient(135deg, #00c896 0%, #0ea5e9 100%)` | CTA buttons, active tab underlines |
| `gradient-card-hover` | `linear-gradient(135deg, rgba(0,200,150,0.05) 0%, rgba(14,165,233,0.05) 100%)` | Card hover state overlay |
| `gradient-glow` | `radial-gradient(ellipse at center, rgba(0,200,150,0.15) 0%, transparent 70%)` | Section highlight glows |

---

## 4. Typography System

All typefaces are loaded via `next/font` from Google Fonts for zero layout shift.

### 4.1 Typeface Selection

| Role | Typeface | Weight(s) | Rationale |
|---|---|---|---|
| **Display / Headlines** | Inter | 700, 800 | Geometric, technical, modern — used for hero and section headings |
| **Body / UI Text** | Inter | 400, 500 | Consistent with headlines; excellent readability at small sizes |
| **Monospace / Data** | JetBrains Mono | 400, 500 | Equipment specs, data metrics, code snippets, status labels |

### 4.2 Type Scale

| Token | Size | Line Height | Weight | Usage |
|---|---|---|---|---|
| `--text-display` | `clamp(2.5rem, 6vw, 5rem)` | 1.1 | 800 | Hero section headline |
| `--text-h1` | `clamp(2rem, 4vw, 3.5rem)` | 1.15 | 700 | Page titles |
| `--text-h2` | `clamp(1.5rem, 3vw, 2.25rem)` | 1.2 | 700 | Section headings |
| `--text-h3` | `clamp(1.125rem, 2vw, 1.5rem)` | 1.3 | 600 | Card titles, subsection headings |
| `--text-body-lg` | `1.125rem` | 1.7 | 400 | Feature paragraphs, descriptions |
| `--text-body` | `1rem` | 1.6 | 400 | Standard body copy |
| `--text-sm` | `0.875rem` | 1.5 | 400 | Meta labels, timestamps, captions |
| `--text-xs` | `0.75rem` | 1.4 | 500 | Tags, status badges, legal text |
| `--text-mono` | `0.875rem` | 1.5 | 400 | Spec values, data readouts |

### 4.3 Typographic Rules
- **Letter-spacing:** Display text uses `letter-spacing: -0.02em`; labels and badges use `letter-spacing: 0.08em` uppercase.
- **Text gradient:** Key headline words use `background-clip: text` with `gradient-accent` for emphasis.
- **Maximum line length:** Body paragraphs are capped at `68ch` to preserve readability.

---

## 5. Spacing & Layout System

### 5.1 Base Spacing Scale

All spacing uses an 8px base unit system.

| Token | Value | Usage |
|---|---|---|
| `--space-1` | `4px` | Micro gaps, inline icon spacing |
| `--space-2` | `8px` | Compact element padding |
| `--space-3` | `12px` | Input field internal padding |
| `--space-4` | `16px` | Default component padding |
| `--space-5` | `24px` | Card internal padding |
| `--space-6` | `32px` | Section internal padding |
| `--space-8` | `48px` | Between components within a section |
| `--space-10` | `64px` | Section vertical padding |
| `--space-12` | `80px` | Section separation |
| `--space-16` | `128px` | Hero section padding |

### 5.2 Layout Grid

| Breakpoint | Columns | Gutter | Max Width |
|---|---|---|---|
| Mobile (< 768px) | 1 | 16px | 100% |
| Tablet (768px – 1023px) | 2 | 24px | 100% |
| Desktop (1024px – 1439px) | 3–4 | 32px | 1280px |
| Wide (≥ 1440px) | 4 | 40px | 1440px |

### 5.3 Container Widths
```css
.container       { max-width: 1280px; margin: 0 auto; padding: 0 var(--space-6); }
.container-narrow { max-width: 800px;  margin: 0 auto; }
.container-wide  { max-width: 1440px; margin: 0 auto; padding: 0 var(--space-8); }
```

---

## 6. Elevation & Surface System

### 6.1 Card Surfaces
Cards use a layered glass approach — not flat fills. Each level adds subtle transparency and border glow.

| Level | Background | Border | Shadow |
|---|---|---|---|
| **Base** | `--color-bg-secondary` | `1px solid --color-border-subtle` | None |
| **Elevated** | `--color-bg-elevated` | `1px solid --color-border` | `0 4px 24px rgba(0,0,0,0.4)` |
| **Glass** | `--color-bg-glass` + `backdrop-filter: blur(12px)` | `1px solid rgba(0,200,150,0.2)` | `0 8px 32px rgba(0,0,0,0.5)` |

### 6.2 Glow Effects
Used sparingly on hero elements, active tabs, and milestone indicators.
```css
.glow-accent {
  box-shadow: 0 0 24px rgba(0, 200, 150, 0.25), 0 0 48px rgba(0, 200, 150, 0.1);
}
.glow-blue {
  box-shadow: 0 0 24px rgba(14, 165, 233, 0.2), 0 0 48px rgba(14, 165, 233, 0.08);
}
```

---

## 7. Component Library

### 7.1 Navigation Bar
**Layout:** Fixed top bar, full-width, glassmorphism background.  
**Contents (left to right):**
- Logo mark + "NEXUS GENOMICS INSTITUTE" wordmark
- Navigation links: `Home`, `Research`, `Facilities`, `Goals`, `Sessions`, `Join`
- Active state: accent underline + text color change to `--color-text-accent`
- CTA button: `Apply Now` — filled accent gradient button

**Mobile behavior:** Collapses to hamburger icon (☰). Tapping opens a full-height slide-in drawer with all nav links stacked vertically.

---

### 7.2 Buttons

| Variant | Background | Text | Use Case |
|---|---|---|---|
| **Primary** | `gradient-accent` | `--color-text-inverse` | Primary CTAs: Apply Now, Explore |
| **Secondary** | Transparent | `--color-accent-primary` with border | Secondary actions: Learn More, View All |
| **Ghost** | Transparent | `--color-text-secondary` | Tertiary: Cancel, Back |
| **Danger** | `rgba(239,68,68,0.1)` | `--color-error` with border | Admin: Delete, Reject |
| **Icon** | `--color-bg-elevated` | Icon only | Compact actions: Edit, Download |

All buttons have:
- `border-radius: 8px`
- `padding: 12px 24px`
- Hover: `transform: translateY(-1px)` + brightness increase
- Active: `transform: translateY(0)` (snap back)
- Focus: `outline: 2px solid --color-accent-primary` (accessibility)
- Transition: `all 0.2s cubic-bezier(0.4, 0, 0.2, 1)`

---

### 7.3 Cards

**Research / Facility / Goal Cards:**
- Background: `--color-bg-secondary`
- Border: `1px solid --color-border-subtle`
- Border-radius: `16px`
- Padding: `24px`
- Image: top-aligned, `aspect-ratio: 16/9`, `border-radius: 12px`, `object-fit: cover`
- Hover state: `border-color` transitions to `--color-border` + card lifts with `translateY(-4px)` and `box-shadow` deepens
- Mobile: image stacks above text (`flex-direction: column`)

**Stat / Metric Cards (inside detail pages):**
- Compact, monospace value display
- Accent-colored value, muted label below
- Used in sidebar panels of `/research/[slug]` and `/facilities/[slug]`

---

### 7.4 Tabs / Panel Switcher
Used on `/research`, `/facilities`, `/goals` pages.

- **Style:** Horizontal scrollable tab row on desktop; horizontally scrollable on mobile (no line wrap)
- **Active tab:** Solid accent underline (3px), text in `--color-text-accent`
- **Inactive tab:** `--color-text-secondary`, no underline
- **Tab content:** Appears below with a fade-in animation (`opacity: 0 → 1`, `duration: 200ms`)
- **Keyboard:** Full arrow-key navigation support between tabs

---

### 7.5 Tags & Badges

| Type | Style | Example |
|---|---|---|
| Research tag | `background: rgba(0,200,150,0.1)` + accent border + accent text | `GENOMICS` |
| Status badge | Color-coded by status enum | `● ACTIVE`, `● COMPLETED`, `● PENDING` |
| Session type | Icon + label | `📅 Weekly Meeting`, `🔬 Symposium` |
| Audience label | Subtle outline badge | `Internal`, `Open Public`, `Collaborators` |

---

### 7.6 Form Elements

All form elements share:
- Background: `--color-bg-elevated`
- Border: `1px solid --color-border-subtle`
- Border-radius: `8px`
- Padding: `12px 16px`
- Focus: border color transitions to `--color-accent-primary` with a soft glow
- Error state: border turns `--color-error`, error message appears below in red

**Input types used:**
- Text input
- Textarea (auto-resize)
- Select / Dropdown
- File upload dropzone (dashed border + drag-and-drop zone)
- Date/time picker (native, styled to match theme)

---

### 7.7 Countdown Timer
Used in the homepage Upcoming Sessions section.

- **Layout:** Four blocks side by side — `DAYS`, `HOURS`, `MINUTES`, `SECONDS`
- **Style:** Each block is a glass card with a large monospace number and small label below
- **Animation:** Digit flip animation on each tick using CSS `@keyframes`
- **Color:** Numbers in `--color-accent-primary`; labels in `--color-text-muted`
- **Mobile:** Four blocks wrap into a 2×2 grid

---

### 7.8 Progress Indicators

**Circular Progress (Goals index cards):**
- SVG circle with stroke-dashoffset animation on mount
- Accent green stroke on a muted gray track
- Percentage displayed in the center in monospace

**Linear Progress Bar (Goal detail pages):**
- Full-width bar, accent fill, animated on scroll entry
- Phase milestones shown as dots on the bar at calculated positions

**Vertical Timeline (Goal detail — phase breakdown):**
- Left-aligned glowing vertical line
- Each milestone is a node: filled circle if complete, outlined if pending
- Connecting line animates from top to bottom as user scrolls

---

### 7.9 Sessions Calendar (Public View)
A card-based grid of upcoming sessions, filterable by type and audience.

- **Layout:** 3-column grid on desktop, 2 on tablet, 1 on mobile
- **Each session card contains:**
  - Session type icon + badge
  - Title (bold)
  - Date + time (formatted: `Monday, 2 June 2026 · 3:00 PM`)
  - Location (with map pin icon)
  - Audience badge (`Internal`, `Open Public`, `Collaborators`)
  - Presenter name(s)
- **Filter bar:** Horizontal pill filters — `All`, `Weekly`, `Symposium`, `Public Events`
- **Empty state:** Illustrated empty state with message: *"No upcoming sessions. Check back soon."*

---

### 7.10 Admin Dashboard Components

**Admin Sidebar:**
- Fixed left rail, 240px wide
- Icon + label nav items per module
- Active item: accent left-border + accent text
- Bottom: user email + logout button

**Data Tables (Applicants Board):**
- Striped rows for readability
- Columns: Name, Position, Date, Status badge, Actions (View, Download CV, Update Status)
- Row click expands inline to show statement of purpose and admin notes field

**Editor Forms:**
- Full-width center-column layout
- Section labels in uppercase tracking
- Save / Cancel buttons fixed at bottom of form
- Unsaved-change warning on navigation away

---

## 8. Page-by-Page Layout Specifications

### 8.1 Homepage (`/`)

```
┌────────────────────────────────────────────────┐
│  NAVIGATION BAR (fixed, glass)                 │
├────────────────────────────────────────────────┤
│  HERO SECTION                                  │
│  ─ Animated gradient background                │
│  ─ Display headline with gradient word         │
│  ─ Subheadline (1–2 sentences)                 │
│  ─ Two CTAs: [Explore Research] [Join the Lab] │
│  ─ Floating animated DNA helix (CSS/SVG)       │
├────────────────────────────────────────────────┤
│  RESEARCH AREAS PREVIEW                        │
│  ─ Section label + heading                     │
│  ─ 3-column card grid (collapses to 1 mobile)  │
│  ─ [View All Research →] link                  │
├────────────────────────────────────────────────┤
│  FACILITIES OVERVIEW                           │
│  ─ 2-column image-text alternating layout      │
│  ─ Each facility: image + name + key spec      │
│  ─ [View All Facilities →] link                │
├────────────────────────────────────────────────┤
│  UPCOMING SESSIONS                             │
│  ─ Countdown timer to next public session      │
│  ─ Session list below (next 3 sessions)        │
│  ─ [View Full Calendar →] link                 │
├────────────────────────────────────────────────┤
│  STRATEGIC ROADMAP TEASER                      │
│  ─ Horizontal timeline with 3–4 goal nodes     │
│  ─ Click node → navigates to /goals/[slug]     │
├────────────────────────────────────────────────┤
│  TEAM HIERARCHY                                │
│  ─ PI card (featured, large)                   │
│  ─ PhD Scholars grid                           │
│  ─ Research Associates + Interns grid          │
├────────────────────────────────────────────────┤
│  LAB PROGRESS TRACKER                          │
│  ─ Active experiment cards with status badges  │
├────────────────────────────────────────────────┤
│  CAREERS CTA BANNER                            │
│  ─ Full-width accent gradient band             │
│  ─ Heading + [Apply Now] button                │
├────────────────────────────────────────────────┤
│  FOOTER                                        │
│  ─ Logo + tagline                              │
│  ─ Nav link columns                            │
│  ─ Contact email + copyright                  │
└────────────────────────────────────────────────┘
```

---

### 8.2 Research Index (`/research`)

```
┌────────────────────────────────────────────────┐
│  Page Hero: Title + subtitle (no full-height)  │
├────────────────────────────────────────────────┤
│  LEFT: Tab sidebar (research area list)        │
│  RIGHT: Active research area detail panel      │
│         ─ Title + tags                         │
│         ─ Image (full-width)                   │
│         ─ Description paragraphs               │
│         ─ Focus Metrics (key stats grid)       │
│         ─ [View Full Detail →] link            │
└────────────────────────────────────────────────┘
Mobile: Tabs become horizontal scrollable strip above content.
```

---

### 8.3 Research Detail (`/research/[slug]`)

```
┌────────────────────────────────────────────────┐
│  Breadcrumb: Home > Research > [Area Name]     │
├───────────────────────────┬────────────────────┤
│  MAIN CONTENT (70%)       │  SIDEBAR (30%)     │
│  ─ Hero image             │  ─ Focus Metrics   │
│  ─ Title + tags           │  ─ Stat cards      │
│  ─ Long description       │  ─ Related areas   │
│  ─ Sub-sections           │                    │
└───────────────────────────┴────────────────────┘
Mobile: Sidebar stacks below main content.
```

---

### 8.4 Sessions Calendar (`/sessions`)

```
┌────────────────────────────────────────────────┐
│  Page Hero: "Upcoming Sessions & Events"       │
├────────────────────────────────────────────────┤
│  Filter bar: [All] [Weekly] [Symposium] [Public│
├────────────────────────────────────────────────┤
│  3-column session card grid                    │
│  Each card: type badge, title, date/time,      │
│             location, audience label,          │
│             presenter list                     │
├────────────────────────────────────────────────┤
│  Past Sessions (collapsed accordion)           │
└────────────────────────────────────────────────┘
```

---

### 8.5 Careers / Join (`/join`)

```
┌────────────────────────────────────────────────┐
│  Page Hero: "Join the Lab"                     │
│  ─ Brief pitch + current openings listed       │
├────────────────────────────────────────────────┤
│  APPLICATION FORM (centered, narrow container) │
│  ─ Full Name                                   │
│  ─ Email Address                               │
│  ─ Position of Interest (select dropdown)      │
│  ─ Statement of Purpose (textarea)             │
│  ─ CV Upload (dropzone, PDF only)              │
│  ─ [Submit Application] button                 │
│  ─ Note: "We do not share your data."          │
├────────────────────────────────────────────────┤
│  SUCCESS STATE: Confirmation card replaces form│
│  ─ "Application received. We'll be in touch." │
└────────────────────────────────────────────────┘
```

---

### 8.6 Admin Dashboard (`/admin`)

```
┌────────────────────────────────────────────────┐
│  [SIDEBAR - fixed left 240px]                  │
│  ─ Nexus logo (small)                          │
│  ─ Dashboard / Research / Facilities / Goals   │
│  ─ Team / Sessions / Applicants / PI Profile  │
│  ─ [Logout]                                   │
│                                                │
│  [MAIN CONTENT AREA]                           │
│  ─ Module-specific editor or list table       │
│                                                │
│  [TOP BAR]                                     │
│  ─ Page title + breadcrumb                    │
│  ─ Admin user badge                           │
└────────────────────────────────────────────────┘
Mobile: Sidebar collapses to top hamburger menu.
```

---

## 9. Interaction & Animation Principles

### 9.1 Guiding Rules
1. **Purpose over decoration:** Every animation must serve a functional purpose — directing attention, confirming an action, or revealing a state change.
2. **Subtlety:** Default to short durations (150–300ms) and ease curves. Avoid anything that delays the user.
3. **Consistency:** All transitions use the same easing function family.
4. **Respect preference:** All animations respect `prefers-reduced-motion: reduce`.

### 9.2 Standard Easing Tokens

```css
--ease-standard:  cubic-bezier(0.4, 0, 0.2, 1);   /* General UI transitions */
--ease-enter:     cubic-bezier(0.0, 0, 0.2, 1);    /* Elements entering the screen */
--ease-exit:      cubic-bezier(0.4, 0, 1, 1);      /* Elements leaving the screen */
--ease-spring:    cubic-bezier(0.34, 1.56, 0.64, 1); /* Playful spring — buttons, modals */
```

### 9.3 Animation Catalogue

| Element | Trigger | Animation | Duration |
|---|---|---|---|
| Page load | Mount | Fade + slide up (`translateY(20px) → 0`) | 400ms, staggered |
| Card hover | Mouse enter | `translateY(-4px)` + shadow deepen | 200ms |
| Tab switch | Click | Content fade out → in | 150ms each |
| Button press | Click | `translateY(1px)` snap | 100ms |
| Countdown digit | Every second | Flip — old digit exits up, new enters from below | 300ms |
| Goal progress bar | Scroll into view | Width animates from 0% to target % | 800ms |
| Vertical timeline | Scroll | Line draws downward, nodes pulse in sequentially | 600ms staggered |
| Hero DNA helix | Continuous | Slow rotate and float (`translateY` oscillation) | 6s loop, infinite |
| Nav bar | Scroll down 80px | Background shifts from transparent to glass | 200ms |
| Session card appear | Scroll into view | Staggered fade + slide up per card | 300ms staggered |
| Form submission | Submit click | Button shows spinner → success state replaces form | 200ms |
| Admin save | Save click | Button momentarily shows "Saving…" → "Saved ✓" | 300ms |

### 9.4 Loading States
- **Skeleton screens** (not spinners) for all data-fetched content. Skeleton blocks mimic the layout of the actual content with a shimmer animation.
- **Inline spinner** only inside buttons during submission actions.
- **Full-page loading** is avoided — sections load independently with their own skeletons.

---

## 10. Accessibility Standards

The portal targets **WCAG 2.1 AA compliance** as a minimum.

### 10.1 Color Contrast
| Pair | Contrast Ratio | Standard |
|---|---|---|
| `--color-text-primary` on `--color-bg-primary` | ≥ 7:1 | AA + AAA |
| `--color-text-secondary` on `--color-bg-secondary` | ≥ 4.5:1 | AA |
| `--color-accent-primary` on `--color-bg-primary` | ≥ 4.5:1 | AA |
| Button text on gradient background | ≥ 4.5:1 | AA |

### 10.2 Interactive Elements
- All interactive elements are keyboard-reachable via `Tab`.
- Focus rings are always visible: `outline: 2px solid #00c896; outline-offset: 3px`.
- Tab panels use `role="tablist"`, `role="tab"`, `role="tabpanel"` with `aria-selected` and `aria-controls`.
- Modals trap focus within when open; `Escape` closes.
- All images have meaningful `alt` text. Decorative images use `alt=""`.

### 10.3 Semantic HTML
- Each page has exactly one `<h1>`.
- Heading hierarchy follows `h1 → h2 → h3` without skips.
- Navigation uses `<nav>` with `aria-label="Main navigation"`.
- Forms use `<label for="id">` correctly paired with every input.
- Skip-to-main-content link as the first focusable element on every page.

### 10.4 Motion Sensitivity
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 11. Responsive Design Specifications

### 11.1 Breakpoint Reference

| Name | Range | Behavior |
|---|---|---|
| `mobile` | 0 – 767px | Single column, stacked layouts, hamburger nav |
| `tablet` | 768px – 1023px | 2-column grids, condensed nav |
| `desktop` | 1024px – 1439px | 3–4 column grids, full navigation |
| `wide` | ≥ 1440px | Max-width containers with large whitespace |

### 11.2 Key Responsive Behaviors

| Component | Desktop | Tablet | Mobile |
|---|---|---|---|
| Navigation | Full horizontal bar | Full horizontal bar | Hamburger drawer |
| Hero | Full height, side-by-side content and visual | Reduced padding | Stacked, condensed |
| Research/Facility/Goal cards | 3-column grid | 2-column grid | 1-column stack |
| Card inner layout | Image left + text right (row) | Image left + text right (row) | Image top + text below (column) |
| Countdown timer | 4 blocks in a row | 4 blocks in a row | 2×2 grid |
| Sessions calendar | 3-column grid | 2-column grid | 1-column stack |
| Research tab sidebar | Left panel + right content | Top tabs + below content | Top scrollable tabs + below content |
| Admin sidebar | Fixed left 240px | Fixed left 64px (icons only) | Top hamburger menu |
| Goal timeline | Vertical, left-aligned | Vertical, left-aligned | Vertical, full width |
| Footer | 4-column link grid | 2-column link grid | Stacked single column |

---

## 12. Design Handoff Checklist

Before passing any design component to development, the following must be confirmed:

- [ ] All color tokens defined in `globals.css` as CSS custom properties.
- [ ] All spacing values use tokens — no hardcoded pixel values.
- [ ] Every interactive element has designed states: default, hover, focus, active, disabled.
- [ ] All card layouts have a defined mobile variant (column direction).
- [ ] All text truncation behaviors defined (max lines, ellipsis or wrap).
- [ ] Empty states designed for every list/grid component.
- [ ] Error states designed for every form field.
- [ ] All animations documented with duration, easing, and trigger.
- [ ] `prefers-reduced-motion` variant confirmed for every animation.
- [ ] All components have unique, descriptive `id` attributes for QA and browser testing.
- [ ] Admin components have labeled form fields for accessibility.
- [ ] Color contrast verified for all text/background pairs using a contrast checker.
