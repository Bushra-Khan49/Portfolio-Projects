# 🗺️ Site Map: Herbal Omics Lab

This document defines the navigational structure and architectural hierarchy of the platform.

## 🌐 1. Public Facing Website
The public site is a vertically-integrated, high-performance landing experience with dedicated dynamic pages.

- **Home (`/`)**: Main arrival point.
    - **Hero Section**: Vision statement and laboratory focus.
    - **Research Areas**: Interactive grid of current trajectories.
    - **Lab Progress**: Real-time stats (Team size, Presentations, Goals).
    - **Next Session**: Live countdown to the next lab meeting.
    - **Strategic Goals**: High-level laboratory objectives.
    - **Principal Investigator**: Profile, bibliography, and contact.
    - **Team**: PhD Scholars, Associates, and Interns category grid.
- **Join the Lab (`/join`)**: Application portal with file upload capability.
- **Dynamic Research Pages (`/research/[slug]`)**: Detailed deep-dives into specific areas.
- **Dynamic Session Pages (`/sessions/[slug]`)**: Historical record of lab meetings.
- **Dynamic Facility Pages (`/facilities/[slug]`)**: In-depth look at lab resources.

## 🔒 2. Secure Admin Dashboard (`/admin`)
Accessible only via the System Authentication portal.

- **Authentication Module**: Secure LoginModal with credential verification.
- **Dashboard Sidebar**:
    - **Overview**: High-level laboratory stats and notification center.
    - **Sessions**: Meeting scheduler, presenter editor, and history archiver.
    - **Team**: Lab member editor with image upload suite.
    - **PI Profile**: Biography and Publication editor.
    - **Research**: CMS for modifying research categories and details.
    - **Facilities**: Resource management center.
    - **Goals**: Strategic objective editor.
    - **Applications**: Review center for student submissions.
    - **Settings**: System credential management (Admin ID / Password).

---
**Maintainers**: Bushra Khan 
