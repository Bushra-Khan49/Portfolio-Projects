# ⚙️ Detailed Functionality: FEATURES.md

This document details the core system features that power the **Nexus Genomics Institute** digital platform.

---

## 1. 🛡️ Enterprise-Grade Authentication & Authorization
- **Security Engine**: Powered by **Supabase Auth** with JSON Web Token (JWT) verification.
- **Access Control**: PostgreSQL Row Level Security (RLS) rules restrict all CRUD database tables. Only authenticated users with the `admin` role can perform write mutations.
- **Admin Session Gate**: Client-side session listener redirects unauthorized users away from `/admin/*` subpaths to `/admin/login`.
- **Automatic Expiration**: Admin sessions expire automatically after a set duration, triggering secure client-side cleanup.

## 2. 🛰️ Supabase Real-Time Database Sync
- **Mechanism**: The platform subscribes to PostgreSQL replication changes using Supabase Real-Time client libraries.
- **Live Sync**: Updates to team listings, research categories, or upcoming sessions are instantly pushed to the clients' screens within milliseconds (ending reliance on slow client-side HTTP polling).
- **Offline Resilience**: Clean error handling gracefully falls back to cached states if connection is interrupted.

## 3. 💾 Structured Relational Schema
- **Database**: Host-managed PostgreSQL on Supabase.
- **Tables**: Fully structured relational models (Team, Research Areas, Goals, Meetings, Applications, and System Logs) with foreign-key constraints (documented in `BACKEND_SCHEMA.md`).
- **Integrity**: Deletions are cascaded securely to prevent orphaned data.

## 4. 🗂️ Lab Sessions Timeline & Countdown
- **Dynamic Scheduler**: An administrative interface to reschedule, cancel, or complete laboratory meetings.
- **Automatic Countdown**: A live JavaScript countdown timer displaying remaining days, hours, and minutes until the next active lab session.
- **Archiving Logic**: Completing a session automatically archives it into the historical presentation table.

## 5. 👥 Team Directory & Biography Editor
- **Dynamic Grid**: Staggered cards that categorize members (PhD Candidates, Postdoctoral Researchers, Interns).
- **Publication Bibliography Manager**: An easy-to-use publication builder that parses title/DOI link pairs for the PI's profile page.
- **Image Storage Buckets**: Admin uploads are routed directly to the `nexus-public-uploads` Supabase Storage bucket, with automatic file size limits.

## 📝 6. Structured Scholar Applications Pipeline
- **Intake Form**: A secure, public-facing multi-step application form at `/join`.
- **CV Storage**: PDF files are securely uploaded to a private Supabase Storage bucket (`applicant-resumes`), mapped to the database ID.
- **Review Dashboard**: Authenticated admins can view, filter, write comments on, and toggle status (Pending, Under Review, Shortlisted, Declined) of applicant submissions.

---
**Project Lead**: Bushra Khan
