# 🤝 Contributing Guidelines: CONTRIBUTING.md

We are excited that you want to contribute to the **Nexus Genomics Institute** platform! Please review the guidelines below before making changes to ensure a smooth integration.

---

## 🚥 Quick Setup
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Bushra-Khan49/Portfolio-Projects.git
   cd Portfolio-Projects/projects
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Environment Setup**:
   Copy `.env.example` to `.env.local` and add your local Supabase keys.
4. **Run Dev Environment**:
   ```bash
   npm run dev
   ```

---

## 🌿 Branching Strategy
We use structured branch names to track edits cleanly:
- **`main`**: Production-ready code.
- **`feature/your-feature`**: For introducing new features or pages.
- **`bugfix/your-fix`**: For resolving codebase bugs or styling glitches.
- **`docs/your-updates`**: For changes to documentation files under `nexus genomics institute/`.

---

## 🛠️ Contribution Rules

### 1. Code Standards
* **No ESLint Warnings**: Ensure your code is clean by running `npm run lint` before committing.
* **Strict Type Safety**: Avoid using `any` type variables in TypeScript. Always write complete type declarations.
* **Modular CSS**: Write styles in isolated CSS modules. Do not pollute global namespace files.

### 2. Commit Format
Write descriptive, prefix-based commit messages:
* `feat: add new PubMed bibliography hook`
* `fix: repair admin session redirect loop on safari`
* `docs: update styling guide rules`

### 3. Pull Request (PR) Flow
1. Create a branch from `main`.
2. Commit your code modifications.
3. Push your branch to the remote repository.
4. Open a Pull Request detailing the changes, visual changes, and what tests you performed.

---
**Project Lead**: Bushra Khan
