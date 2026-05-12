# 🏗️ Component Catalog: COMPONENTS.md

This document lists the modular, reusable components that form the architecture of the Herbal Omics Lab.

---

## 📦 1. UI Primitives (`src/components/ui/`)
Foundational elements used across all pages.
- **`LoginModal`**: The security gateway. Handles auth, validation, and session creation.
- **`SearchModal`**: Full-text searching of the laboratory's resources and pages.
- **`Toast` (Internal)**: Animated notification system used in the Admin dashboard for save/fail updates.
- **`ImageCard`**: Standardized slot for member/facility photos with built-in upload/delete handling.

## 🧱 2. Sectional Components (`src/components/`)
High-level structural blocks.
- **`Navigation`**: Global header with scroll-reactive styling, theme toggle, and search entry.
- **`Hero`**: The animated landing portal with focal laboratory vision.
- **`ResearchAreas`**: Dynamic list rendering research items with hover-expansion.
- **`LabProgress`**: Real-time counter logic using `useLiveData` hooks.
- **`TeamAndPI`**: Complex grid management for the PI profile and lab member categories.
- **`Facilities`**: Informative cards showcasing lab equipment and technical resources.
- **`Goals`**: Descriptive goals list with progress tracking.
- **`Footer`**: Global summary with contact links and navigation recap.

## ⚙️ 3. Functional Components (Non-Visual)
- **`AdminDashboard`**: The heavy-lifting Single Page Application (SPA) wrapper for the CMS.
- **`useLiveData`**: The custom React hook responsible for client-side polling and data hydration.

---
**Maintainers**: Bushra Khan 
