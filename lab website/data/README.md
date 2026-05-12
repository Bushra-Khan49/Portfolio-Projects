# 📂 Data Layer (JSON Database)

This directory serves as the **Persistent Storage** for the Herbal Omics Lab platform. We use a "Flat-File" approach instead of a traditional SQL/NoSQL database for maximum portability and speed.

## 📄 File Mapping

- **`admin-pi.json`**: Stores the Principal Investigator's profile, publications, and contact info.
- **`admin-team.json`**: Contains the list of PhD scholars, Research Associates, and Interns.
- **`admin-sessions.json`**: Manages the laboratory meeting schedule and presenter history.
- **`admin-research.json`**: Lists the core research areas and detailed descriptions.
- **`admin-settings.json`**: Securely stores the admin login ID and password.
- **`applications.json`**: Collects "Join the Lab" form submissions.

## 🛠️ How it Works
When a change is made in the Admin Dashboard, the backend API uses the Node.js `fs` module to perform a direct write to these files. This ensures that data is saved permanently without needing an external hosting service for a database.
