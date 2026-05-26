# Nexus Genomics Institute — Project Documentation

This repository contains the comprehensive product, design, and technical specifications for the **Nexus Genomics Institute Digital Portal**.

## 🛠️ Tools & Technologies Used
To design, define, and architect this platform, the following toolkit was utilized:
- **Next.js 15 (App Router)**: For server-side rendering and routing.
- **React 19**: For component state and UI interactivity.
- **TypeScript**: For end-to-end type safety in defining the application schemas.
- **Supabase**: Chosen as the backend-as-a-service (BaaS) for PostgreSQL database, Authentication, and Row Level Security (RLS) to manage applicant data and admin access.
- **Vercel**: For scalable, zero-configuration deployment.
- **Framer Motion**: For fluid UI transitions and micro-interactions.
- **Mermaid JS**: For mapping out application flows and state machines in the documentation.
- **AI Product Development Toolkit**: To ensure our PRD and UX documentation met enterprise standards.

## 📁 Documentation Included
- `PRD.md`: The complete Product Requirements Document, including user stories, personas, and scope.
- `UI_UX_DESIGN_DOCUMENT.md`: The visual specifications, color tokens, typography scales, and accessibility guidelines.
- `APP_FLOW.md`: Comprehensive user journey maps, state transitions, and admin authentication flows.
- `BACKEND_SCHEMA.md`: The database architecture, tables, and relationships.
- `IMPLEMENTATION_PLAN.md`: The step-by-step roadmap for developers.
- `TRD.md`: The Technical Requirements Document.

## 📖 The Developer & Planning Journey: Challenges & Solutions

Building this digital portal and its specs required navigating complex ideation, architectural design decisions, and hands-on technical development hurdles. Below is an honest look at the challenges faced on our side—from the initial thought process to the final git push.

---

### 🧠 Phase 1: Ideation & Planning Challenges

#### 1. Audience Calibration & Tone Ideation
* **The Challenge:** A genomics lab serves highly distinct audiences: elite scientific peers looking for raw research, prospective PhD/Intern applicants seeking a modern research home, and general funders/institutes. We struggled with deciding how academic vs. how modern/interactive the design should be.
* **The Solution:** During planning, we chose a **hybrid design aesthetic**: a premium dark-mode interface with HSL-tailored colors, subtle grid patterns, and glassmorphism. This visual style communicates cutting-edge scientific innovation (attracting young talent) while maintaining strict semantic structure and data clarity (respecting academic peers).

#### 2. The CMS Dilemma: Headless vs. Database-Driven
* **The Challenge:** In planning the architecture, we initially considered standard headless CMS platforms (like Sanity or Contentful) to allow Dr. Vance to edit content. However, this introduced external billing dependencies and complex API integrations that clashed with the goal of a zero-funds, zero-maintenance launch.
* **The Solution:** We opted to design a **direct Postgres/Supabase-driven schema** combined with an elegant client-side Admin Panel. This allowed us to build custom inline-editable fields directly in Next.js, saving hosting costs and offering a completely tailormade administrative experience.

---

### 💻 Phase 2: Technical Development Challenges

#### 1. Next.js 15 App Router & React 19 Ecosystem Mismatches
* **The Challenge:** Building the website with the cutting-edge Next.js 15 and React 19 stack introduced strict TypeScript compilation errors and package mismatch warnings, especially with older React hooks and styling frameworks.
* **The Solution:** We spent considerable time auditing and refactoring component files to eliminate all ESLint warnings. We removed outdated `react-hooks` dependencies, strictly typed all server-client boundaries, and implemented type-safe database schemas mapped to Supabase definitions.

#### 2. Mobile Spacing & Layout Overflow Bugs
* **The Challenge:** During interactive testing, we discovered layout overflow issues on mobile viewport sizes (particularly around the dynamic Meetings Timeline and dense Research Details tables). Long chemical formulas and genetic terms were breaking container boundaries.
* **The Solution:** We refactored the global and utility CSS files to implement responsive word-breaks, horizontal scroll wrappers for data-heavy sections, and container queries to dynamically scale typography size on smaller screens.

#### 3. Administrative Routing & Redirect Loops
* **The Challenge:** Implementing secure redirect rules for the Admin Dashboard led to edge cases where authenticated states caused redirect loops between `/admin/login` and `/admin/dashboard`.
* **The Solution:** We refactored the authentication middleware and root layouts to handle session state changes reactively. We introduced explicit client-side session checks, a loading transition barrier, and robust error catch blocks to gracefully reset broken sessions.

#### 4. Collaborative AI Development & Workspace Synchronization
* **The Challenge:** Working as an AI partner, keeping codebase changes and markdown specifications in sync was difficult. When generating documentation, we initially committed to the wrong repository branch (`Herbal-Omics-Lab-`), which required a careful, non-destructive git rollback.
* **The Solution:** We isolated the portfolio work into this independent `Portfolio-Projects` repository under `nexus genomics institute/`. We ran safety audits to ensure the original repository remained pristine and untouched, and systematically converted all `.doc` files to clean, readable `.md` files.

