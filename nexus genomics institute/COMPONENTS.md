# 🧱 Shared Components Library: COMPONENTS.md

This document catalogues the modular component layout structure for the **Nexus Genomics Institute** React code base.

---

## 🌐 1. Public Layout Elements

### `Navbar.tsx` (Server / Client Hybrid)
- **Role**: Site-wide header navigation bar.
- **Features**: 
  * Responsive mobile dropdown menu.
  * Interactive dark-theme switch.
  * Secret admin gate link (visualized as a secure key/lock vector).
- **Location**: `src/components/Navbar.tsx`

### `Footer.tsx` (Server)
- **Role**: Bottom footer with social links, copyright declarations, and fast navigation links.
- **Location**: `src/components/Footer.tsx`

### `ScrollToTop.tsx` (Client)
- **Role**: A floating button that fades in when the user scrolls past the fold, facilitating quick layout returns.
- **Location**: `src/components/ui/ScrollToTop.tsx`

---

## 📈 2. Interactive Page Components

### `CountdownClock.tsx` (Client)
- **Role**: Calculates time distance to the next upcoming lab session in the database.
- **Logic**: Fired by a React state timer update loop every 60 seconds.
- **Location**: `src/components/CountdownClock.tsx`

### `JoinForm.tsx` (Client)
- **Role**: Multi-step data capture validation form.
- **Features**: 
  * Integrates file ingestion uploading resumes into Supabase storage.
  * Interactive upload state spinners and success modals.
- **Location**: `src/components/JoinForm.tsx`

---

## 🔒 3. Administrative Workspace UI

### `AdminSidebar.tsx` (Client)
- **Role**: Left navigation layout switcher for the Admin Workspace CMS.
- **Location**: `src/app/admin/components/AdminSidebar.tsx`

### `ApplicationsTab.tsx` (Client)
- **Role**: Displays lists of applicant entries, file link hooks, review comment boxes, and update triggers.
- **Location**: `src/app/admin/components/ApplicationsTab.tsx`

### `SessionsTab.tsx` (Client)
- **Role**: Scheduling panel with drag-to-sort presenter lists, historical logging, and session deletion controllers.
- **Location**: `src/app/admin/components/SessionsTab.tsx`

---

## 🛠️ 4. Shared Atomic UI Primitives
Located under `src/components/ui/`:

1.  **`Button.tsx`**: Base interactive element supporting variants (primary, secondary, warning) and scale changes.
2.  **`Modal.tsx`**: Standard screen overlay dialog with click-outside dismiss listeners and Framer Motion spring fade transitions.
3.  **`Input.tsx`**: Secure styled input with focus states.
4.  **`Toast.tsx`**: System notifications showing status confirmations (e.g. "Save Successful" or "Access Denied").
5.  **`ErrorBoundary.tsx`**: Visual fallback screen preventing React crashes from breaking the application view.

---
**Project Lead**: Bushra Khan
