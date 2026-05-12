# 🔄 Herbal Omics Lab: Operational Workflow Guide

This guide explains the step-by-step process for managing and expanding the Herbal Omics Lab platform.

---

## 🏗️ How We Built This (The Step-by-Step)

### 1. The Core Infrastructure
We started with **Next.js 16** for its hybrid rendering (Server vs. Client) and built the UI sections as **Modular Components**. This allowed us to build the Hero, Team, and Research sections independently before "weaving" them into the main page.

### 2. The Data Layer
Unlike traditional sites that use databases, we built a **JSON-backed system**.
- **Challenge**: How to make the site editable?
- **Solution**: We created API routes that "talk" to JSON files. When you click 'Save' in the admin panel, the API physically updates a file on the server.

### 3. The Security Barrier
- **Challenge**: The admin panel was initially public.
- **Solution**: We implemented a **Session Storage Gate**. It’s like a digital ID card—if you haven’t logged in via the lock icon, the site "sweeps" you away from the admin route instantly.

---

## 🛠️ Common Workflows

### 🟢 Adding a New Research Area
1.  Log in to the **Admin Dashboard**.
2.  Navigate to the **Research** tab.
3.  Click **"Add Research Area"**.
4.  Fill in the Title and Description.
5.  Click **"Save All Changes"**.
6.  *Behind the Scenes*: The system updates `data/admin-research.json` and the homepage live-syncs the new content.

### 🔵 Scheduling Lab Sessions
1.  Go to the **Sessions** tab.
2.  Update the **Meeting Number** and **Title**.
3.  Add/Edit **Presenters** (You can drag them to reorder!).
4.  Click **"Save Session"**.
5.  *Result*: The Homepage countdown timer will automatically recalculate the time remaining until the next meeting.

### 🔴 Managing Team Members
1.  Use the **Team** tab to add PhD Scholars or Interns.
2.  Upload photos directly in the dashboard.
3.  The system automatically generates a unique `memberKey` for the image file system.

---

## 📁 File System Visualized

| Folder/File | Purpose | Why? |
| :--- | :--- | :--- |
| `data/*.json` | The Database | Ultra-fast local reads/writes. |
| `src/app/api/` | The Brain | Handles the logic for saving and fetching data. |
| `src/components/` | The Face | All visual elements of the site. |
| `public/uploads/` | The Gallery | Stores all images uploaded via the admin panel. |

---

## 📈 Next Steps for Growth
As the lab grows, you can easily add **Blog Posts**, **Project Galleries**, or **Collaboration Request Forms** by following the same pattern:
1. Create a data file.
2. Build an API route.
3. Add an Admin tab.
