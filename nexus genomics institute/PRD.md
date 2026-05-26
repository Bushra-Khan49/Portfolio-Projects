# Product Requirement Document (PRD)
## Project: Nexus Genomics Institute — Official Digital Portal
**Prepared by:** Development Team  
**Client:** Nexus Genomics Institute, Dr. Evelyn Vance (Lead Research Scientist & Founding Director)  
**Document Version:** 1.0  
**Date:** May 2026  
**Status:** Approved for Development

---

## 1. Executive Summary

Nexus Genomics Institute is an emerging academic research lab specializing in advanced genomics, plant systems biology, phytochemistry, and computational bioinformatics. The lab was founded and is directed by Dr. Evelyn Vance, a recognized authority in herbal genomics and omics integration.

The institute approached our team with a clear gap: **they had no web presence whatsoever.** No website, no public-facing portfolio, and no digital infrastructure to communicate their research agenda, attract prospective scholars, or be discoverable by academic collaborators or AI-driven search engines.

Beyond simply going online, the institute's leadership had a broader vision: to use this portal as a foundation for establishing Nexus Genomics as a **recognized and authoritative institution** in its field — a lab that grows in reputation alongside its research output. The portal would serve as the primary channel to publish research work, attract institutional funding and external project partnerships, draw in talented research candidates and interns, and signal to the wider scientific community that Nexus Genomics is a serious, forward-looking organization built for the long term.

This PRD defines the scope, requirements, and delivery roadmap for designing and developing the institute's **first-ever official digital portal** — built from the ground up.

---

## 2. Client Background & Discovery

### 2.1 Who Is the Client?
**Nexus Genomics Institute** is a specialist research organization based in Horizon City. Its mission is to unlock nature's therapeutic potential through genomic and molecular science. The lab operates a series of advanced scientific facilities including a Smart Greenhouse and Laminar Flow Systems, maintains an active team of PhD scholars and Research Associates, and conducts regular symposia and knowledge exchange sessions.

### 2.2 How the Client Came to Us
The institute reached out after identifying that academic peers, potential collaborators, and prospective research students had no way to discover them online. Senior lab personnel were relying entirely on email chains to share research updates, manage incoming scholar applications, and announce upcoming meetings. This approach was proving unsustainable as the lab's trajectory expanded.

Dr. Vance outlined two primary needs during our initial discovery session:
1. A **public-facing portal** that presents the institute's research identity with the same rigor and polish as global academic institutions.
2. An **internal control panel** that empowers non-technical lab staff to keep the site updated without ever touching code.

### 2.3 Current State (Before Project)
| Area | Current State |
|---|---|
| Website | None |
| Research Portfolio | Communicated only via email or private documents |
| Team Directory | Internal spreadsheets |
| Recruitment | Manual email submissions |
| Meeting Announcements | Group email broadcasts |
| Search Engine Presence | Zero — completely undiscoverable |
| AI Search Citations | None |

---

## 3. Problem Statements

1. **No Digital Presence:** The institute is completely invisible online. Searching "Nexus Genomics" on Google or any AI assistant returns zero results.
2. **Inefficient Internal Operations:** Content updates — including new team member additions, publication announcements, and equipment specifications — require manual coordination with no central source of truth, leading to miscommunication, version mismatches, and delays in everyday operations and ongoing projects.
3. **Recruitment is Unscalable:** Open scholar positions are filled entirely via word of mouth with no structured intake process, causing the lab to miss promising candidates.
4. **Low Search & AI Engine Visibility** *(Identified and recommended by our team; accepted by the client):* Modern researchers, potential partners, and funding bodies increasingly rely on AI-powered search tools (ChatGPT, Google Gemini, Perplexity) to discover institutions and collaborators. Without structured semantic data schemas, the institute cannot surface in these results — a missed opportunity our team proposed addressing through Generative Engine Optimization (GEO).

---

## 4. Goals & Success Criteria

| Goal | Owner | Success Metric |
|---|---|---|
| Establish digital identity | Client + Dev Team | Live deployment at a permanent public URL |
| Enable admin self-management | Client (Admin) | Admin holds highest authority — all site content can be created, edited, or deleted without developer involvement |
| Streamline scholar applications | Client (Admin) | All incoming applications tracked centrally in the admin board; no application-related traffic in Dr. Vance's personal email |
| Search discoverability | Dev Team | Site indexed on Google within 72 hours of launch |
| AI citation-readiness | Dev Team | Valid `ResearchOrganization` + `ResearchProject` JSON-LD schemas live and validated |
| Mobile accessibility | Dev Team *(Quality Standard)* | Zero layout overflows on iPhone SE, iPhone 15, and Samsung Galaxy viewports — delivered as part of our standard quality commitment |
| Performance | Dev Team *(Quality Standard)* | Google Lighthouse score of 90+ across SEO, Performance, and Accessibility — delivered as part of our standard quality commitment |

---

## 5. Stakeholders & User Personas

### Persona 1 — Dr. Evelyn Vance (Client & Primary Admin User)
> *"I need to be able to update our team page when a new PhD student joins, or post the details of our next symposium — without calling a developer. And I want to review incoming applications in one place, not have my personal inbox flooded with CVs. Only the candidates I shortlist should receive a follow-up from me directly."*

- **Goals:** Control lab narrative, manage publications list, review applicant CVs, update meeting dates, and manage session announcements.
- **Frustrations:** No technical background; has been manually emailing updates. Inbox is cluttered with unstructured applicant submissions.
- **Needs:** A clean, intuitive admin dashboard behind a password, with a dedicated applicant review board — incoming applications are stored and reviewable internally; only candidates that the admin approves are contacted via Dr. Vance's personal email.

### Persona 2 — Academic Collaborator / Peer Researcher
> *"I heard about Dr. Vance's work on multi-omics integration. I want to understand her lab's research focus and see if there's scope for collaboration."*

- **Goals:** Understand the institute's research domains and operational capabilities.
- **Needs:** Rich research area detail pages, facility specs, and clear contact pathways.

### Persona 3 — Prospective PhD Scholar / Intern
> *"I'm looking to apply to a genomics lab for my dissertation. I want to know their focus areas, see the team, and apply online. And honestly — sometimes I miss weekly lab meetings or symposia because I only find out about them last minute through someone's email chain. If there were a public sessions calendar showing what's coming up, when it is, where it's happening, and who it's for, I could plan around it without the confusion."*

- **Goals:** Evaluate lab culture, understand research opportunities, submit an application, and stay informed about upcoming lab sessions and public events.
- **Frustrations:** Meeting announcements are buried in email threads; last-minute scheduling conflicts cause missed sessions and miscommunications for both internal members and external attendees.
- **Needs:** Team page, research and goals overview, a structured application form, and a **public-facing sessions calendar** that surfaces upcoming meetings, symposia, and knowledge-exchange events — including date, time, location, and intended audience (internal lab, prospective collaborators, open public).

### Persona 4 — AI Search Engine / Web Crawler
- **Goals:** Index and map the institute's entity relationships (people, research, facilities) for citation in AI-generated answers.
- **Needs:** Semantic `schema.org` JSON-LD structured data embedded in server-rendered HTML.

### 5.1 User Stories

**Admin (Dr. Vance)**
- *As an Admin*, I want to securely log into my dashboard so that only authorized personnel can make changes to the website.
- *As an Admin*, I want to easily add and remove team members so that the public directory is always up to date.
- *As an Admin*, I want to review incoming scholar applications in a central board so that my personal email inbox isn't cluttered.
- *As an Admin*, I want to manage the sessions calendar so that my team and the public know when our events are happening.

**Academic Collaborators / Peer Researchers**
- *As a Peer Researcher*, I want to view detailed breakdowns of the lab's research areas so that I can identify potential alignment for collaboration.
- *As a Peer Researcher*, I want to see the technical specifications of the lab's facilities so that I know what capabilities they possess.

**Prospective PhD Scholars / Interns**
- *As a Prospective Scholar*, I want to apply for open positions directly on the website and upload my CV so that I can easily submit my candidacy.
- *As a Prospective Scholar*, I want to view a calendar of upcoming sessions so that I can attend open public events and learn more about the lab's work.
- *As a Prospective Scholar*, I want to see the lab's strategic goals and timeline so that I understand the long-term vision of the institute before applying.

**AI Search Engines / Web Crawlers**
- *As an AI Search Engine*, I want to read embedded JSON-LD schema data so that I can accurately answer user questions about the institute, its researchers, and its projects.

---

## 6. Scope of Work — Feature Requirements

### Phase 1: Public-Facing Portal
The publicly accessible website presenting the institute's identity.

**Homepage:**
- Hero section with institute name, tagline, and visual branding.
- Research Areas preview grid.
- Facilities overview cards with key specs.
- Upcoming Meetings section with a live countdown timer and session list.
- Interactive strategic roadmap section.
- Team hierarchy tree (PI, PhD Scholars, Research Associates, Interns).
- Lab Progress tracker.
- Careers section and footer with links.

**Inner Pages:**
- `/research` — Full research area index with an interactive sidebar panel switcher.
- `/research/[slug]` — Individual research area detail with description and focus metrics.
- `/facilities` — Full facilities index with sidebar panel switcher.
- `/facilities/[slug]` — Facility detail page with operational specs and current protocol deployments.
- `/goals` — Strategic goals roadmap index.
- `/goals/[slug]` — Interactive vertical timeline per goal with scroll-triggered phase animation.
- `/sessions/[slug]` — Individual presentation detail page.
- `/join` — Career application portal with form and CV upload.
- `/about` — Static institute overview page.

### Phase 2: Admin Dashboard
A password-protected internal control center accessible only to authorized lab staff.

- Login / session authentication.
- **PI Management Panel:** Edit name, title, affiliation, contact emails, publications, and quote.
- **Team Manager:** Add, edit, reorder, and remove team members at each hierarchical level.
- **Research Areas Editor:** Create, update, and delete research focus areas with descriptions and images.
- **Facilities Editor:** Manage facility cards, specs, and experimental protocol listings.
- **Strategic Goals Editor:** Update goal descriptions, progress percentages, target dates, and phase breakdowns.
- **Upcoming Meetings Editor:** Set next symposium date, time, location, title, and individual presenter slots.
- **Applicant Review Board:** View all submitted applications, read statements of purpose, and download CVs.
- **Image Upload Panel:** Drag-and-drop uploader for PI photos, team member circles, and facility images.

### Phase 3: Discoverability Foundation
- Dynamic XML sitemap auto-populated with all active dynamic slugs.
- `robots.txt` directive allowing public crawlers while blocking `/admin` and `/api`.
- Google Search Console verification meta tag.
- JSON-LD Structured Data schemas on all key page types.

---

## 7. Out of Scope (V1)
The following items are **explicitly excluded** from the current engagement:
- E-commerce or payment processing.
- User-facing account registration (only admin login is in scope).
- Real-time collaboration tools between lab members.
- Native mobile applications (iOS / Android).
- Multi-language internationalization.

---

## 8. Assumptions & Dependencies
- Client will provide all research content, facility descriptions, and biographical text for population.
- Dr. Vance will supply high-resolution photography for team pages and facilities.
- The client will create and maintain a Vercel account for live deployment.
- Google Search Console ownership verification will be performed by the client following our guidance.

---

## 9. Delivery Timeline (Indicative)

| Phase | Deliverable | Target |
|---|---|---|
| 0 | Discovery, wireframes, and content collection | Week 1 |
| 1 | Core public portal — homepage and inner pages | Weeks 2–4 |
| 2 | Admin dashboard and CMS integration | Weeks 5–7 |
| 3 | SEO / GEO schemas, sitemap, and robots directives | Week 7 |
| 4 | QA, mobile responsiveness testing, and launch | Week 8 |

---

## 10. Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Content delays from client | Timeline slip | Provide content templates upfront; use placeholder data during development |
| Google indexing delay post-launch | Discoverability gap | Submit sitemap and request indexing immediately on launch day |
| No prior hosting infrastructure | Deployment friction | Manage Vercel setup end-to-end during project handoff |
| Non-technical admin users | CMS misuse | Build an intuitive admin UI with inline validation and clear error messages |
