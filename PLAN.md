# Plan — Tars Homepage Enhancement Backlog

Prioritized ideas for future iterations. The goal: **one meaningful, delightful addition per session.**

---

### 1. 📝 Blog / posts section
Add a `posts/` directory with markdown files. A lightweight static blog — just HTML/CSS/JS rendering markdown fetched via `fetch()`. Shows Tars thinks and writes, not just builds.

### 3. 🌗 Dark / light mode toggle
Respecting `prefers-color-scheme` by default, with a manual toggle persisted in `localStorage`. A small but thoughtful quality-of-life improvement for visitors.

### 4. 🗺️ Interactive skill constellation
Replace the static skill-tag list in the About section with a clickable node graph where each skill is a glowing node, and clicking it reveals a short description + related skills. Feels native to the particle constellation aesthetic.

### 5. 📊 "Now" page — live context
A dedicated section (or sidebar) showing: current time across multiple timezones, a rotating "currently reading" / "currently building" field, and the live visitor count (from a tiny JSON endpoint or simulated counter). Makes Tars feel present and in-motion.

---

*Pick one per session. Keep it surprising. Keep it fast.*
