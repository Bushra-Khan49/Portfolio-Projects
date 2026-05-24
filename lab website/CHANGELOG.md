# Changelog

All notable changes to the Nexus Genomics Institute portal are documented here.

## [1.2.0] — 2026-05-25

### Features
- Transitioned countdown clock and schedules from polling to real-time WebSockets
- Added secure server-side API proxy route under `/api/v1/proxy` to secure third-party tokens
- Introduced automated integration flows and browser testing via Playwright E2E tests

### Security
- Aligned client-side file upload limits from 10MB to 5MB to match server-side logic

### Testing
- Excluded E2E files from Jest unit tests running to separate integration and unit flows

## [1.1.0] — 2026-05-15

### Security
- Migrated password storage from plaintext JSON to bcrypt hashing (auto-migration on first login)
- Replaced insecure `sessionStorage` auth with httpOnly JWT cookies verified server-side
- Added `requireAdmin()` middleware — all admin POST endpoints now require authentication
- Added rate limiting on login: 5 attempts per IP per 15 minutes
- Added CSRF origin validation on all mutation endpoints
- Added security headers: CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- Added input sanitization with 500KB payload size limit
- Removed all hardcoded credentials from source code

### Performance
- Reduced data polling interval from 3s → 60s (95% fewer API calls)
- Reduced team images polling from 4s → 60s
- Added `document.hidden` check — background tabs no longer poll

### Features
- Custom 404 page matching site design
- Floating scroll-to-top button
- Countdown timer shows "This session has concluded" for past meeting dates
- Privacy Policy page (`/privacy`)
- Terms of Use page (`/terms`)
- Animated mobile menu (Framer Motion slide-in/out)
- React Error Boundaries on all homepage sections
- Loading skeletons for page transitions
- Open Graph + Twitter Card metadata for social sharing

### Infrastructure
- Upgraded Docker base from Node 18 (EOL) to Node 20 LTS
- Optimized `.dockerignore` for smaller build context
- Added `.env.example` for developer onboarding
- Added `API.md` documenting all API endpoints

## [1.0.0] — 2026-04-07

### Initial Release
- Full-stack Next.js 16 lab portal with admin CMS
- JSON-based local-first data storage
- Docker deployment with multi-stage builds
- Team management with image upload and cropping
- Research areas, facilities, and goals modules
- Lab meeting scheduler with countdown timer
- Application form with resume upload
- Full dark mode support
- Responsive design with CSS Modules
