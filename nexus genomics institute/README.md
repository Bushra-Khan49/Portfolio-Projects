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
- `prd.md`: The complete Product Requirements Document, including user stories, personas, and scope.
- `ui_ux_design_document.md`: The visual specifications, color tokens, typography scales, and accessibility guidelines.
- `app_flow.md`: Comprehensive user journey maps, state transitions, and admin authentication flows.
- `backend_schema.md`: The database architecture, tables, and relationships.
- `implementation_plan.md`: The step-by-step roadmap for developers.
- `trd.md`: The Technical Requirements Document.

## 📖 The Project Journey: Challenges & Solutions

Building the digital presence for Nexus Genomics Institute required overcoming significant infrastructural and operational challenges. 

### 1. Challenge: Zero Digital Infrastructure
- **The Problem:** The lab had absolutely no web presence. They were entirely undiscoverable by modern search engines and AI assistants. 
- **The Solution:** We architected a complete digital identity from the ground up, starting with comprehensive documentation (PRD, TRD, UI/UX). We established a modern, mobile-first design system reflecting scientific authority and implemented Generative Engine Optimization (GEO) principles using semantic `schema.org` JSON-LD to ensure discoverability.

### 2. Challenge: Non-Technical Administrators & Data Management
- **The Problem:** Dr. Vance and her team needed to update complex research portfolios, goals, and team directories frequently, but had no technical background and didn't want to rely on developers for every change.
- **The Solution:** Instead of a complex traditional CMS, we designed a highly permissive, flat-structure Admin Dashboard. We mapped out clear App Flows (documented in `app_flow.md`) to ensure every CRUD operation was intuitive, providing immediate toast notifications and error handling. 

### 3. Challenge: Unscalable Recruitment & Cluttered Inboxes
- **The Problem:** Prospective scholars were applying via email, causing unstructured data and flooded inboxes for the PI, leading to lost applications.
- **The Solution:** We designed a dedicated Applicant Review Board flow. Applications submitted on the site are securely stored in the database silently (without triggering spam emails). Dr. Vance can log in, review CVs, change application statuses, and only contact shortlisted candidates directly on her own terms.

### 4. Challenge: Miscommunication Around Lab Sessions
- **The Problem:** Weekly meetings and symposia were announced via disjointed email chains, leading to missed sessions and scheduling conflicts.
- **The Solution:** We mapped a structured data schema for an "Upcoming Sessions" calendar that filters audiences (Internal, Collaborators, Open Public). This acts as a single source of truth, ending email reliance for internal operations.
