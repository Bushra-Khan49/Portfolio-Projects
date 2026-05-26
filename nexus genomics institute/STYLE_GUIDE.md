# 🎨 Visual & Design Rules: STYLE_GUIDE.md

This document defines the visual identity guidelines and design tokens for the **Nexus Genomics Institute** platform.

---

## 🌓 1. Color System: Premium Cyberpunk Scientific
The visual system is designed to evoke a professional "Genomic Terminal"—clean, dark, high-contrast, with neon data highlights.

| Token Name | HSL Value | Hex Equivalent | Use Case |
| :--- | :--- | :--- | :--- |
| **Primary (Glow Cyan)** | HSL(185, 100%, 50%) | `#00F0FF` | Interactive buttons, neon text tags, focus borders. |
| **Secondary (Glow Emerald)**| HSL(145, 100%, 45%) | `#00FF66` | Completion stats, successful alerts, active countdown. |
| **Danger (Warning Pink)** | HSL(345, 100%, 55%) | `#FF0066` | Alert logs, delete buttons, error messages. |
| **Background (Main Slate)** | HSL(225, 30%, 8%) | `#0B0F19` | Main layout background. |
| **Card Background** | HSL(225, 25%, 12%, 0.7) | `#141A29` (Alpha) | Glassmorphism card overlays. |
| **Text Primary (Off-White)** | HSL(210, 20%, 95%) | `#F0F3F7` | Primary page headings and body text. |
| **Text Secondary (Muted)** | HSL(210, 10%, 65%) | `#A1ACB9` | Captions, descriptions, metadata text. |

---

## 🔠 2. Typography Hierarchy
A highly legible, clean sans-serif type system is used to display data tables and genetic sequences effectively.

- **Primary Font**: [Inter](https://fonts.google.com/specimen/Inter) or Vercel [Geist](https://vercel.com/font).
- **Metric Font (Numbers)**: Monospace font stacks (`Fira Code`, `SF Mono`, `monospace`) for countdown clocks, statistics metrics, and date grids.
- **Hero Title**: `4.0rem` (Large screens) / `2.5rem` (Mobile) | Weight: `800` (Extra Bold).
- **Section Heading**: `2.25rem` | Weight: `700` (Bold) | Spacing: `-0.02em`.
- **Card Subheading**: `1.25rem` | Weight: `600` (Semi-Bold).
- **Body Text**: `1.0rem` | Line Height: `1.6` | Weight: `400` (Regular).

---

## 🏗️ 3. Structure & Glassmorphism Metrics
- **Main Container**: Max-width `1280px` (`max-w-7xl`) with `1.5rem` (`px-6`) gutters.
- **Borders & Radii**:
  * Cards: `border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.08);`
  * Buttons: `border-radius: 8px;`
  * Inputs: `border-radius: 6px;`
- **Glassmorphism Spec**:
  ```css
  background: rgba(20, 26, 41, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  ```

---

## 🎞️ 4. Motion Guidelines
Animations must behave mechanically and cleanly, avoiding slow or cartoony eases.

- **Animation Engine**: Framer Motion
- **Damping Profile**: `type: "spring", damping: 28, stiffness: 260`
- **Animation States**:
  * **Entrance**: Translate up by `16px` and fade-in. Stagger nested elements with `0.06s` intervals.
  * **Hover Interaction**: Card elements shift up by `4px` and outline brightness transitions smoothly.
  * **Click / Tab Interaction**: Scale down slightly to `0.98`.

---
**Project Lead**: Bushra Khan
