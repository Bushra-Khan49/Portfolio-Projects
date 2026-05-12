# 🧠 Service Layer (API Routes)

This directory contains the server-side logic that bridges the UI with our JSON data layer.

## 📡 Primary Endpoints

### `/api/admin-data`
The "Universal Handler" for all lab data.
- **`GET ?type={category}`**: Fetches the requested JSON file (e.g., `type=team`).
- **`POST { type, data }`**: Validates and writes the incoming payload to the corresponding JSON file.

### `/api/team-images`
Handles the storage and retrieval of lab member photos.
- **`POST`**: Uploads images to `public/uploads/` and updates the image mapping.
- **`DELETE`**: Removes old images to keep the server clean.

### `/api/applications`
Manages the "Join the Lab" workflow.
- **`POST`**: Saves incoming student applications and CV paths to `applications.json`.
