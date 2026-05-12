# 🧬 Herbal Omics Lab: The Digital Headquarters

A state-of-the-art, high-performance web platform for the **Herbal Omics Laboratory**, featuring a custom-built JSON-backed CMS, real-time data synchronization, and a secure PI Admin Dashboard.

![Herbal Omics Preview](file:///Users/bushrakhan/Desktop/Herbal%20Omics%20Lab/public/hero-crystal.png)

---

## 👥 The Maintainers
- **Bushra Khan** (Project Lead & Researcher)

---

## 🚀 Key Features

### 🛠️ Custom "Flat-File" JSON CMS
We've engineered a database-less CMS that stores all lab data in persistent JSON files. This ensures zero hosting costs for databases (Supabase/Firebase) while maintaining lightning-fast local read/write speeds.

### 🛰️ Real-time "Live Sync" Engine
The platform uses a custom **`useLiveData`** React hook with client-side polling. This ensures that any change made by the PI in the Admin Dashboard is reflected on the homepage in near real-time (5-second latency).

### 🛡️ Secure PI Admin Dashboard
A private suite for managing:
- **Research Areas**: Dynamic updates to laboratory focus.
- **Lab Sessions**: Weekly meeting scheduling with presenter history.
- **Team Management**: Real-time updates to PhD scholars, Associates, and Interns.
- **P.I. Profile**: Bibliography, publications, and contact management.

### 🎨 High-Contrast "Scientific" UI
A premium, laboratory-inspired interface built with **React 19** and **Framer Motion** for smooth, professional micro-animations and interaction feedback.

---

## 🛠️ Tech Stack & Technical Ligo
- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **State & Logic**: [React 19](https://react.dev/)
- **Dynamics**: [Framer Motion](https://www.framer.com/motion/)
- **Engine**: [Turbopack](https://nextjs.org/docs/architecture/turbopack)
- **Persistence**: Flat-File JSON Storage

---

## 📁 Project Architecture & File System
The project follows a clean, modular "Separation of Concerns" architecture:

- **[data/](./data)**: The "Source of Truth"—stores all persistent site content.
- **[src/app/admin](./src/app/admin)**: The Secure SPA Dashboard logic.
- **[src/app/api](./src/app/api)**: The RESTful endpoints for CRUD operations on JSON files.
- **[src/components](./src/components)**: Atomic UI sections and primitives.
- **[docs/](./docs)**: Comprehensive archives, history, and technical blueprints.

---

## 🚥 Getting Started
1. **Install Dependencies**: `npm install`
2. **Run Development Server**: `npm run dev`
3. **Access Admin Panel**: Click the **Lock Icon** in the navigation bar.

---

## 📜 Professional Standards & Guides
- **[GUIDELINES.md](./GUIDELINES.md)**: Coding, design, and architectural standards.
- **[ROADMAP.md](./ROADMAP.md)**: Future features and planned laboratory expansions.
- **[LICENSE](./LICENSE)**: MIT License.
- **[CONTRIBUTING.md](./CONTRIBUTING.md)**: How to help improve the project.
- **[CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)**: Our behavioral standards.
- **[SECURITY.md](./SECURITY.md)**: How to report vulnerabilities.

### 📖 History & Story
For a deep dive into the build journey, check out the **[BUILD_HISTORY.md](./docs/BUILD_HISTORY.md)**.
