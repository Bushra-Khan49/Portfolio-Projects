# 📜 Herbal Omics Lab: Detailed Project Guidelines

This document provides the definitive standards for code, architecture, design, and operations for the Herbal Omics Lab platform. It is designed to ensure consistency across all future laboratory updates.

---

## 🏗️ 1. Architectural Principles

### "Flat-File" Data Management (The JSON Engine)
- **Concept**: We avoid traditional SQL/NoSQL databases to eliminate latency, cost, and infrastructure dependency.
- **Implementation**: All lab data lives in the **`/data`** directory as persistent JSON objects.
- **Concurrency**: While the PI is the sole admin, the API handles file writes using atomic `fs.writeFileSync` patterns to prevent data corruption.
- **Rule**: Every new site section *must* have a corresponding JSON file in `/data`.

### React Component Modularity
- **Atomic UI**: Small, reusable primitives (Buttons, Inputs, Modals) live in `src/components/ui`.
- **Sectional Blocks**: Large homepage segments (Hero, Team, Facilities) live in `src/components`.
- **Client vs Server**: Use `'use client'` strictly for components requiring state (`useState`) or browser APIs (Framer Motion). Keep structural layouts as Server Components for SEO.

---

## 🎨 2. Design & UX Standards

### High-Contrast "Scientific" Aesthetic
- **Color Logic**: Use the **HSL color variables** defined in `src/styles/theme.css`. This allows for programmatic theme switching.
- **Scientific Clarity**: Avoid decorative elements that obscure data. Prioritize typography and white space.
- **Glassmorphism**: Use for secondary interaction layers (Modals, Hover states). Implementation: `backdrop-filter: blur(12px); border-color: rgba(255, 255, 255, 0.1);`.

### Micro-Animations
- **Framer Motion**: The standard for all motion logic. 
- **Stagger Pattern**: Grid items (Teams, Research) should animate sequentially with a `0.1s` delay between each item.
- **Interaction Feedback**: Buttons should have a slight `scale: 0.98` on tap and `scale: 1.05` on hover.

---

## 💻 3. Coding Conventions

- **Next.js 16 App Router**: The `/src/app` directory is the master controller for routing.
- **CSS Modules**: Mandatory for all component styling (`*.module.css`). Global styles are reserved for theme variables in `globals.css`.
- **TypeScript**: Use Interfaces for all data models. Example:
  ```typescript
  interface LabMember {
    id: string;
    role: 'PhD' | 'Associate' | 'Intern';
    imagePath: string;
    description: string;
  }
  ```
- **Error Handling**: Every API route and fetch request must be wrapped in a `try/catch` block with user-friendly error fallback states.

---

## 🔄 4. The Live-Sync Engine
- **Purpose**: To bridge the gap between a static-feeling JSON site and a dynamic dashboard.
- **Hook**: `useLiveData.ts` in `src/hooks`.
- **Config**: Default polling is set to `5000ms`. Do not decrease this below `2000ms` as it may hit rate limits on some hosting providers.

---

## 🤝 5. Collaboration & Maintenance
- **Maintainers**: Bushra Khan
- **Version Control**: Use descriptive commit messages (e.g., `feat: add research category`, `fix: admin session gate`).
- **Documentation**: Any change to the Data JSON structure must be reflected in **`docs/ARCHITECTURE.md`**.

---
**Vision Statement**: To create a digital environment that reflects the precision, innovation, and scientific excellence of the Herbal Omics Laboratory.
