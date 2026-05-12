# 🎨 Design Rules: STYLE_GUIDE.md

This document defines the visual identity and aesthetic standards for the Herbal Omics Lab project.

---

## 🌓 1. Theme: High-Contrast "Scientific" Dark/Light
The design is informed by a "Modern Laboratory" aesthetic—clean, high-contrast, and data-focused.

- **Primary Color (Lab Blue)**: `#5551FF` (HSL: `241, 100%, 66%`)
- **Secondary Color (Deep Slate)**: `#0F172A` (HSL: `222, 47%, 11%`)
- **Success Color (Lab Green)**: `#059669`
- **Error Color (Lab Red)**: `#DC2626`
- **Background (Main)**: White (`#FFFFFF`) with a Dark Mode toggle to Deep Slate.
- **Card Backgrounds**: Glassmorphism strategy using `rgba(255, 255, 255, 0.8)` with `backdrop-filter: blur(8px)`.

---

## 🔠 2. Typography
A clear, highly-legible sans-serif stack is mandatory for scientific data presentation.

- **Primary Font**: [Inter](https://fonts.google.com/specimen/Inter) or [Geist](https://vercel.com/font).
- **Heading 1 (Hero Text)**: 3.5rem - 4.5rem, Bold, 700.
- **Heading 2 (Section Headers)**: 2.25rem, Semi-Bold, 600.
- **Body Text**: 1rem - 1.125rem, Regular, 400.
- **Monospace (Data/Stats)**: For numbers and metric tracking.

---

## 🎞️ 3. Animation Standards
Animations should feel "mechanical" and professional, not "playful."

- **Engine**: Framer Motion.
- **Transitions**: `type: "spring", damping: 25, stiffness: 300`.
- **Patterns**:
    - **Staggered Entrance**: Hero sections and Card grids should enter one-by-one with a `200ms` delay.
    - **Scroll Reveal**: Sections fade-in and slide-up by `20px` as they enter the viewport.
    - **Hover States**: Subtle scale-up (`1.02`) and shadow-elevation transition.
    - **Page Transitions**: Smooth opacity fade between the public site and the admin panel.

---

## 🖼️ 4. Layout & Grid
- **Container**: Max-width `1280px` with `2rem` horizontal padding.
- **Gutters**: `1.5rem` - `2.5rem` between cards.
- **Border Radii**: `12px` (Cards), `8px` (Buttons), `6px` (Inputs).

---
**Maintainers**: Bushra Khan 
