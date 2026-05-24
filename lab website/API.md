# 📡 API Reference — Nexus Genomics Institute

All endpoints are served from the Next.js App Router at `http://localhost:3000/api/`.

---

## Authentication

### `POST /api/auth` — Login
Validates credentials and sets an httpOnly JWT cookie.

**Request:**
```json
{ "adminId": "your@email.com", "password": "your-password" }
```

**Response (200):**
```json
{ "authenticated": true }
```

**Error (401):**
```json
{ "error": "Invalid credentials", "remaining": 4 }
```

**Error (429) — Rate limited:**
```json
{ "error": "Too many login attempts. Try again in 12 minute(s)." }
```

### `GET /api/auth` — Verify Session
Checks if the current JWT cookie is valid.

**Response (200):** `{ "authenticated": true, "adminId": "..." }`  
**Response (401):** `{ "authenticated": false }`

### `DELETE /api/auth` — Logout
Clears the httpOnly JWT cookie.

**Response (200):** `{ "success": true }`

---

## Admin Data

### `GET /api/admin-data?type={type}` — Read Data
Returns JSON data for a specific content type.

**Valid types:** `sessions`, `team`, `pi`, `research`, `facilities`, `goals`, `settings`

**Response:** The JSON contents of the corresponding `data/admin-{type}.json` file.

> Note: `?type=settings` never returns the password field.

### `POST /api/admin-data` — Write Data *(requires auth)*
Saves data to the corresponding JSON file. Requires a valid JWT cookie.

**Request:**
```json
{ "type": "team", "data": { "phdScholars": [], "researchAssociates": [], "interns": [] } }
```

**Response (200):** `{ "success": true }`  
**Response (401):** `{ "error": "Unauthorized — please log in" }`  
**Response (413):** `{ "error": "Payload too large" }` *(>500KB)*

---

## Search

### `GET /api/search?q={query}` — Full-Text Search
Searches across research, facilities, goals, publications, and sessions.

**Parameters:** `q` — search term (min 2 characters)

**Response:**
```json
{
  "results": [
    { "type": "research", "title": "...", "excerpt": "...", "link": "/research?topic=..." }
  ]
}
```

---

## Applications

### `GET /api/applications` — List Applications
Returns all lab applications.

### `POST /api/applications` — Submit Application *(multipart/form-data)*
Submit a new lab application with optional resume upload.

---

## Team Images

### `GET /api/team-images` — Get Image Map
Returns a JSON object mapping member keys to image paths.

### `POST /api/team-images` — Upload Image *(requires auth, multipart/form-data)*
Upload a cropped team member photo.

### `DELETE /api/team-images` — Delete Image *(requires auth)*
Remove a team member's photo.

---

## Health Check

### `GET /api/health` — Server Status
Returns server health info. Used by Docker HEALTHCHECK.

**Response:**
```json
{ "status": "ok", "timestamp": "2026-05-15T...", "uptime": 12345.67 }
```
