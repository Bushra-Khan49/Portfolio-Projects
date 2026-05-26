# 🗺️ Site Map: Nexus Genomics Institute

This document maps out the navigational routing structure and structural hierarchy of the **Nexus Genomics Institute** platform.

---

## 🌐 1. Public Facing Pages
The public portal is optimized for SEO and AI search engines, using semantic schema metadata.

- **Home (`/`)**: Core entrance point.
  * **Hero Section**: Mission statement and active genomics highlights.
  * **Research Spotlight**: Interactive grid preview of core genomics tracks.
  * **Lab Metrics**: Staggered cards displaying counts for members, publications, and equipment.
  * **Next Session Calendar**: Live countdown timer for the upcoming weekly symposia.
  * **Strategic Goals**: High-level scientific milestones.
  * **Principal Investigator (PI) Section**: Bibliography and biography.
  * **Team Category Grid**: Dynamic scholar profile viewer.
- **Join the Lab (`/join`)**: Multi-step online applicant intake form with CV upload capability.
- **Research Areas (`/research`)**: Index of active genomics research vectors.
  * **Dynamic Research Detail (`/research/[slug]`)**: Deep-dive into specific research tracks.
- **Facilities (`/facilities`)**: Listing of core instrumentation resources.
  * **Dynamic Facility Detail (`/facilities/[slug]`)**: Details, usage rules, and photo galleries for specific hardware.
- **Goals Page (`/goals`)**: Vision statements and project tracking boards.
- **Privacy Policy (`/privacy`)**: Data safety declarations.
- **Terms of Service (`/terms`)**: Service use guidelines.

---

## 🔒 2. Secure Administrative Dashboard (`/admin`)
An authenticated Single Page Application (SPA) dashboard protected by Supabase Auth session gates.

- **Auth Login Page (`/admin/login`)**: Email/Password gate.
- **Admin Dashboard Layout (`/admin/dashboard`)**:
  * **Overview tab**: Dashboard metrics, system logs, and quick action widgets.
  * **Sessions CMS Tab**: Symposium schedule editor, attendance log, and archive controller.
  * **Team CMS Tab**: Scholar card manager with picture uploading utility.
  * **PI Profile Tab**: Biography editor and publications list builder.
  * **Research Tab**: Research area data editor.
  * **Facilities Tab**: Laboratory hardware listing manager.
  * **Strategic Goals Tab**: Milestone progression tracker.
  * **Applications Tab**: Recruited candidates list, resume downloader, review comments editor, and status toggles.
  * **Settings Tab**: Admin password and account manager.

---
**Project Lead**: Bushra Khan
