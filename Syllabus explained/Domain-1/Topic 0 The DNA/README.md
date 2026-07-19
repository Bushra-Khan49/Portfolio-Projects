# 🧬 Domain 1 · Topic 0 — The DNA

An interactive, scroll-driven 3D visualization exploring the structure and biology of DNA, with connections to Bioinformatics.

## 🌐 Live Demo

**[View Live Site →](https://bushra-khan49.github.io/Portfolio-Projects/Syllabus%20explained/Domain-1/Topic%200%20The%20DNA/index.html)**

---

## 📖 What's Covered

| Section | Topics |
|---------|--------|
| **Nucleotides** | Phosphate group, Deoxyribose sugar, Nitrogenous bases |
| **Purines vs Pyrimidines** | Adenine, Guanine (double-ring) vs Cytosine, Thymine (single-ring) |
| **RNA Differences** | Thymine → Uracil substitution; Uracil structure shown |
| **Base Pairing** | A=T (2 H-bonds), G≡C (3 H-bonds); Chargaff's rules |
| **Antiparallel Strands** | 5'→3' directionality; antiparallel double helix |
| **Chromatin Packaging** | Histone octamer (H2A, H2B, H3, H4) + Histone H1 linker |
| **Major & Minor Grooves** | Labeled on animated 3D GIF; protein binding sites |
| **Bioinformatics Applications** | Genome Assembly, Read Mapping, Variant Calling, Motif Discovery, Epigenomics |

---

## 🛠️ Tech Stack

- **Three.js** — 3D animated DNA helix in the background
- **GSAP + ScrollTrigger** — Scroll-driven card animations
- **Vanilla HTML/CSS/JS** — No frameworks, fast and lightweight

---

## 📁 File Structure

```
Topic 0 The DNA/
├── index.html      # Main page content & structure
├── style.css       # All styling (glassmorphism, animations, layout)
├── script.js       # Three.js DNA helix + GSAP scroll animations
├── package.json    # Dev dependencies (http-server)
└── .gitignore      # Excludes node_modules
```

---

## 🚀 Run Locally

```bash
npm install
npx http-server . -p 8000
```

Then open [http://localhost:8000](http://localhost:8000)

---

[← Back to Portfolio](https://bushra-khan49.github.io/Portfolio-Projects/)
