# ⚙️ Detailed Functionality: FEATURES.md

This document provides a technical deep-dive into the core functionalities that power the Herbal Omics Lab platform.

---

## 1. 🛡️ Secure System Authentication
- **Logic**: Implements a `sessionStorage`-based gate that protects the entire `/admin` route.
- **Validation**: Real-time server-side verification against `admin-settings.json`.
- **User Experience**: A sleek, animated `LoginModal` with password masking and brute-force discouragement (simulated network delay).
- **Session Persistence**: Maintains the authenticated state within the browser tab; automatically clears on tab closure for maximum security.

## 2. 🛰️ Real-Time "Live Sync" Engine
- **Pattern**: Client-side Polling (Pseudo-WebSockets).
- **Mechanism**: A custom `useLiveData` hook fires a lightweight `fetch` every 5000ms.
- **Synchronization**: Automatically updates the public homepage metrics (PhD counts, session countdowns) without requiring a user refresh when the PI makes changes in the dashboard.

## 3. 💾 JSON-Backed "Flat-File" CMS
- **Architecture**: RESTful API routes (`src/app/api/admin-data`) handle file system `fs` operations.
- **CRUD Operations**: Supporting Fetch (GET), Save (POST), update, and Archive patterns.
- **Performance**: Zero-latency reads using Next.js internal server-side processing.

## 4. 🗂️ Lab Session & History Management
- **Presenter Editor**: Drag-and-drop handles for reordering presentation sequences.
- **Status Indicators**: Color-coded scheduling (Scheduled, Completed, Postponed).
- **Archiving**: One-click "Archive & Start New" feature that rolls current session data into historical records.
- **Live Countdown**: Real-time calculation of days/hours/minutes until the next scheduled meeting.

## 5. 👥 Team & PI CMS
- **Proportional Scaling**: Intelligent CSS grid that arranges PhD scholars and associates based on categorical priority.
- **Publication Manager**: A title-to-hyperlink mapping system for the P.I.'s bibliography.
- **Image Hub**: Dedicated API for handling direct uploads, resizing, and persistent storage of lab member photos.

## 6. 📝 Application Processing
- **Form Validation**: Multi-step validation for student details and email formatting.
- **File Ingestion**: Secure file upload system for CVs and Research Statements, stored in `public/uploads/applications`.
- **Review Center**: Private dashboard tab for viewing and managing incoming student interest.

---
**Maintainers**: Bushra Khan 
