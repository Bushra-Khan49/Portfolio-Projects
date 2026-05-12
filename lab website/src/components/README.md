# 🧱 UI Component Layer

This directory contains the atomic and sectional building blocks of the website. We follow a **Modular Design** pattern where each section of the site is its own isolated component.

## 🎨 Design Philosophy
- **CSS Modules**: Every component has a corresponding `*.module.css` file. This prevents styles from "leaking" and ensures that a change in the `Hero` section doesn't accidentally affect the `Footer`.
- **Framer Motion**: Used for staggered entrance animations (scroll-triggered) to give the site a premium, "living" feel.
- **Lucide React**: Our iconography of choice—lightweight, SVG-based, and highly readable.

## 📂 Key Components
- **`Navigation.tsx`**: The main header with theme toggle and secure login entry.
- **`Hero.tsx`**: The high-impact landing section with dynamic HSL gradients.
- **`TeamAndPI.tsx`**: Handles the complex grid layout for lab members and the P.I. profile.
- **`ui/LoginModal.tsx`**: The security gateway for the admin panel.
