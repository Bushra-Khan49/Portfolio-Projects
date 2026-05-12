Excellent. We’re rewriting this at enterprise-spec level, fully aligned with:
	•	✅ Next.js App Router
	•	✅ Sanity Headless CMS
	•	✅ Tailwind design system (tokens defined above)
	•	✅ Glassmorphism UI system
	•	✅ Role-based architecture
	•	✅ Search + RSS + Archive engine
	•	✅ Dark / Light mode support
	•	✅ Pixel-level layout system (1440px container, 8px grid)

This version is production-grade, technically explicit, and architecturally aware.

⸻

🔬 PRODUCTION-GRADE FIGMA AI PROMPT

Herbal Omics Lab – Technical System State Generation

⸻

MASTER INSTRUCTION

Generate functional UI system states and backend-driven interface designs for the Herbal Omics Lab platform.

⚠️ DO NOT alter or redesign the existing visual design system.

Maintain:
	•	Moss green / sage color palette
	•	Defined Tailwind tokens
	•	Typography scale (H1 64px, H2 40px, etc.)
	•	Glassmorphism effects (blur 20px, rgba overlays)
	•	Border radius system (8px–32px only)
	•	Shadow system (soft, hover, float)
	•	12-column layout, 1200px content width
	•	8px spacing system

This task is strictly to generate missing production-ready system states, dynamic interfaces, backend-connected UI, and architecture-driven layouts required for a full Next.js App Router + Sanity CMS + Firebase Auth system.

⸻

1️⃣ FORM VALIDATION + API STATE ARCHITECTURE

Design all system states for:
	•	Join the Lab (Public form)
	•	Admin CMS Forms (Sanity Studio interface)
	•	API-driven submission states

⸻

A. JOIN THE LAB FORM (Frontend)

Fields:
	•	fullName (required, min length 3)
	•	location
	•	institute
	•	position (dropdown)
	•	email (required, valid format)
	•	joiningDate (required)
	•	endingDate (must be > joiningDate)
	•	researchTopic (textarea)
	•	CV upload (optional)

⸻

Required UI STATES

1. Default State
	•	Clean glass card
	•	Inputs styled using defined radius + spacing system
	•	16px vertical gap between fields

⸻

2. Focus State
	•	2px outline using --green-accent
	•	Label transitions to active state
	•	Smooth 200ms transition

⸻

3. Validation Error State
Trigger:
	•	Empty required field
	•	Invalid email
	•	Date logic failure

UI behavior:
	•	Red border (#E5484D)
	•	Inline error message below input (14px text)
	•	Field background light red tint (5% opacity)
	•	Error icon inside input

Error Examples:
	•	“Email is required”
	•	“Ending date must be after joining date”
	•	“Please enter a valid institutional email”

⸻

4. API Loading State
Trigger:
User presses Submit

UI behavior:
	•	Button disabled
	•	Spinner inside button (centered)
	•	Button text fades to 60%
	•	All inputs temporarily disabled
	•	Global form blur overlay at 10%

⸻

5. Success State
	•	Toast notification (top right)
	•	Glass card style
	•	Green check icon
	•	Message:
“Application successfully submitted. We will contact you via email.”

Toast duration:
4 seconds with fade-out animation

⸻

6. API Failure State
If API returns error:
	•	Toast with red left border
	•	Message:
“Submission failed. Please try again.”
	•	Option to retry

⸻

2️⃣ AUTHENTICATION + RBAC (Firebase Auth + Role Mapping)

Design system-level variations of Admin Dashboard.

Roles:
	•	PI (Super Admin)
	•	Research Associate
	•	PhD Scholar
	•	Intern
	•	Viewer (Read-only external collaborator)

⸻

A. LOGIN MODAL

Overlay:
	•	Fullscreen blur (20px)
	•	Centered glass card
	•	480px width
	•	Email + Password
	•	Forgot password link
	•	Error message container

States:
	•	Invalid credentials
	•	Network failure
	•	Account disabled

Error message UI:
Red text + subtle shake animation (150ms)

⸻

B. ADMIN DASHBOARD VARIATIONS

1. PI (Full CRUD Access)

UI:
	•	Edit icons visible
	•	Delete buttons visible
	•	“Publish” toggle active
	•	Project progress slider enabled
	•	Team member isActive toggle enabled

Danger action UI:
Delete button:
Red hover state
Confirmation modal required

⸻

2. Research Associate

Permissions:
	•	Edit project description
	•	Update progress %
	•	Cannot delete
	•	Cannot manage users

UI behavior:
	•	Delete buttons hidden
	•	Manage Users tab removed

⸻

3. Intern

Permissions:
	•	View only
	•	Submit research notes
	•	Cannot edit goals
	•	Cannot publish blog

UI behavior:
	•	Edit buttons replaced with:
“Read Only” badge
	•	Disabled state with tooltip:
“Insufficient permissions”

⸻

4. Viewer

Permissions:
	•	Read-only dashboard
	•	No CMS editing
	•	No metrics editing

UI:
All actions hidden
Minimal layout

⸻

3️⃣ SANITY CMS DATA-MAPPING INTERFACES

Design internal CMS panels aligned exactly to schema structure.

⸻

A. TEAM MEMBER SCHEMA UI

Fields:
	•	name (text)
	•	role (dropdown: PI, PhD, RA, Intern, Collaborator)
	•	bio (rich text)
	•	image upload (with crop + hotspot selector)
	•	email
	•	scholarLink
	•	linkedin
	•	isActive (boolean toggle)

UI Structure:

Left column:
Text fields

Right column:
Image preview
Active toggle

Validation:
	•	Email must be valid
	•	Role required
	•	Image required for active members

⸻

B. PROJECT (GOALS) SCHEMA

Fields:
	•	title
	•	description (portable text)
	•	startDate
	•	targetDate
	•	progressPercent (0–100 slider)
	•	status (planned / ongoing / completed)
	•	relatedPublications (reference selector)

UI:

Progress slider:
Real-time visual circular preview

Date logic:
If progress = 100 → status auto-switch to “Completed”

Reference selector:
Searchable dropdown pulling publication schema

⸻

4️⃣ GLOBAL SEARCH ENGINE (GROQ + API ROUTE)

Design complete search modal states.

Trigger:
⌘ + K
or Navbar Search Icon

Modal:
Fullscreen
Dark glass background
Centered search input

⸻

STATES

A. Empty State

Placeholder:
“Search publications, projects, or presentations…”

Recent searches section

⸻

B. Typing State

Debounced input (300ms)

⸻

C. Loading Skeleton

Grouped shimmer placeholders:
	•	Publication row
	•	Project row
	•	Presentation row

⸻

D. No Results State

Icon + message:
“No results found for ‘Mentha silicon pathway’”

Suggest:
Check spelling
Browse archive

⸻

E. Results State

Grouped by type:

Publications (3)
Projects (2)
Presentations (1)

Each result:
Title
Short excerpt
Schema type badge
Hover highlight

⸻

5️⃣ ARCHIVAL + ROUTING SYSTEM

Dynamic Routes:
	•	/archive/[year]
	•	/archive/[year]/[month]
	•	/archive/publications
	•	/archive/projects

⸻

ARCHIVE UI REQUIREMENTS

Year Dropdown

2026
2025
2024

Month Filter

Optional

⸻

Pagination UI

If >10 results

Controls:
Previous
Next
Page Numbers

UI:
Rounded buttons
Current page highlighted green
Disabled state grayed out

⸻

6️⃣ RSS + METADATA STATES

Design:
	•	RSS indicator in footer
	•	Copy RSS link button
	•	Confirmation tooltip

⸻

7️⃣ DARK / LIGHT MODE VARIANTS

For all system states above:

Provide:
	•	Light mode rendering
	•	Dark mode rendering

Rules:
	•	Dark background: #0F1113
	•	Card background: #1A1D21
	•	Accent green lightened
	•	Glass background adjusted opacity

⸻

8️⃣ ERROR BOUNDARY + SYSTEM FAIL STATES

Design:
	•	404 page
	•	500 Server error page
	•	Sanity content fetch failure state
	•	API rate limit state

All styled within current design system.

⸻

FINAL OBJECTIVE

The output must reflect:

A fully production-ready technical UI layer for:
	•	Next.js App Router
	•	Sanity Headless CMS
	•	Firebase Auth RBAC
	•	GROQ Search Engine
	•	Archive system
	•	RSS feed
	•	Pagination
	•	API states
	•	Validation states
	•	Error handling
	•	Dark/Light system compatibility

WITHOUT modifying:
	•	Color tokens
	•	Typography scale
	•	Radius system
	•	Glass aesthetic
	•	Layout grid

⸻

This is not aesthetic design.

This is system architecture visualization.

⸻
