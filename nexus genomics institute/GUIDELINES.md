# 📜 Nexus Genomics Institute: Detailed Project Guidelines

This document establishes the definitive coding, architectural, design, and operational standards for the **Nexus Genomics Institute** platform.

---

## 🏗️ 1. Architectural Principles

### Supabase-First Database & Storage
- **Relational Integrity**: Never bypass PostgreSQL foreign key constraint validation.
- **RLS Enforcement**: Every table must have a strict Row Level Security (RLS) policy enabling public reads but restricting writes to authenticated administrators.
- **Client Initialisation**: Use a singleton pattern for the Supabase Client class to prevent multiple WebSocket client instances.

### React Server vs. Client Components Split
- **Server Components (Default)**: Use for static informational views (About, Strategic Goals, Publication list) to optimize initial page loading speeds and SEO indexability.
- **Client Components (`'use client'`)**: Reserve for interactive subcomponents (Login Forms, Admin CMS Tabs, Countdown Timers, Upload Inputs).

---

## 🎨 2. Design & UI/UX Standards

### Glassmorphism & High-Contrast Cyberpunk Palette
- **Palette**: Strictly adhere to the HSL tokens defined in `src/styles/theme.css` (primary neon cyan, deep slate backgrounds, success emerald, error red).
- **Backdrop Blurs**: Use glassmorphism overlays for cards and modal dialogues. 
  * Recommended styling: `background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.08);`
- **Typography Hierarchy**: Use modern typography metrics (Inter or Vercel Geist), avoiding serif font usage on scientific metrics cards.

### Mechanical Motion Rules
- **Framer Motion**: Always apply subtle, mechanical movement profiles for animation (damping: 25, stiffness: 300).
- **Stagger Delays**: Use staggered entrances (e.g., `delay: index * 0.08s`) for listing loops (Research cards, Team members).
- **Haptic Scale Feedbacks**: Clickable links and buttons should animate with `whileHover={{ scale: 1.02 }}` and `whileTap={{ scale: 0.98 }}`.

---

## 💻 3. Coding Conventions

- **Next.js 15 routing**: All paths are mapped under `/src/app`. Nested dynamics use folder-based parameters: `/src/app/research/[slug]/page.tsx`.
- **CSS Modularity**: Ad-hoc styles or global pollution is strictly forbidden. Write modular CSS (`*.module.css`) files.
- **TypeScript Specifications**: Define Interfaces for database rows. Example:
  ```typescript
  export interface ResearchArea {
    id: string;
    slug: string;
    title: string;
    summary: string;
    description: string;
    image_url: string | null;
    created_at: string;
  }
  ```
- **Robust Exception Handling**: Every query fetch, storage upload, or authentication request must be handled in clean `try/catch` wrappers. Render helpful error logs and UI toast indicators.

---

## 🤝 4. Version Control & Updates
- **Maintainers**: Bushra Khan
- **Commit Messages**: Use clean prefixes (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`).
- **Documentation Maintenance**: Any modifications to database schemas must be updated concurrently in `backend_schema.md`.

---
**Vision Statement**: To represent the precision and biological ingenuity of Nexus Genomics Institute through a fast, beautiful, and type-safe digital environment.
