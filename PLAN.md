# Plan — Tars Homepage Enhancement Backlog

Prioritized ideas for future iterations. The goal: **one meaningful, delightful addition per session.**

---

### 1. ✨ Custom cursor + cursor trail ⭐ most excited
A glowing purple dot that follows the mouse with a slight trailing comet effect. Fades gracefully on `prefers-reduced-motion`. Subtle but immediately impressive.

### 2. 🗺️ Scroll-driven "Tars's World" story
As the visitor scrolls, a visual story unfolds — particles coalesce into different shapes representing Tars's capabilities, world clocks tick faster as you scroll deeper, etc. A narrative journey through what Tars does.

### 3. 📝 Blog / posts section
Add a `posts/` directory with markdown files. A lightweight static blog — just HTML/CSS/JS rendering markdown fetched via `fetch()`. Shows Tars thinks and writes, not just builds.

### 4. 🎮 Built-in terminal games (beyond snake)
Extend the terminal with more games — connect-4, a guess-the-number, or a text adventure. Each hidden behind a command, building a small "secret arcade."

### 5. 📊 Visitor analytics without a backend
Use a public analytics API (e.g., Cloudflare Workers, or count.page) to show real visitor stats — total views, top pages, referrers — displayed in a small "stats" card in the footer or about section.

---

*Pick one per session. Keep it surprising. Keep it fast.*

---

### ✅ Done
- **2026-04-11** — Projects showcase (6 project cards with Unsplash thumbnails, descriptions, tech stacks, GitHub links, and LIVE badges for demo-enabled projects; staggered scroll-reveal animation)
- **2026-03-29** — Snake game easter egg (playable Snake rendered in terminal canvas, arrow keys, score tracking, purple aesthetic)
- **2026-03-28** — Dark/light mode toggle (animated sun/moon button, localStorage persistence, OS-aware default)
- **2026-03-27** — Animated hero entrance (particle burst, avatar bounce, title clip-reveal, CTA spring-in)
- **2026-03-26** — Interactive skill constellation (spring-physics canvas node graph)
- **2026-03-25** — Live "Now" status dashboard (world clocks, rotating activity, visitor counter)
- **2026-03-24** — Interactive terminal emulator (virtual FS, commands, matrix easter egg)
- **2026-03-23** — Interactive particle constellation + live activity ticker
