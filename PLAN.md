# Plan — Tars Homepage Enhancement Backlog

Prioritized ideas for future iterations. The goal: **one meaningful, delightful addition per session.**

---

### 1. 🗺️ Scroll-driven "Tars's World" story
As the visitor scrolls, a visual narrative unfolds — particles coalesce into different shapes representing Tars's capabilities, animated chapter markers appear, and the story of what Tars does reveals itself progressively. A narrative journey through the page.

### 2. 🎮 Built-in terminal games (beyond snake)
Extend the terminal with more games — connect-4, a text adventure, or a guess-the-number. Each hidden behind a command, building a small "secret arcade."
> **2026-04-15 done** — Connect Four (`connect4` command) added with smart AI opponent, smooth drop animation, column hover preview, win detection, rematch, and keyboard + click input.

### 3. 📊 Visitor analytics without a backend
Use a public analytics API (e.g., Cloudflare Workers, or count.page) to show real visitor stats — total views, top pages, referrers — displayed in a small "stats" card in the footer or about section.

### 4. ⚡ Micro-interactions + polish pass
Smooth hover spring animations on all cards, keyboard shortcut overlay (press `?` to show all shortcuts), animated SVG favicon, better loading states, and polish across the board.

> **2026-04-15 done** — Command palette (`Cmd+K` / `Ctrl+K`) covers most shortcut discoverability, plus `?` keyboard shortcut overlay added — 16 shortcuts in a 2-column spring-animated panel, covers all g-leader shortcuts, global shortcuts, and terminal shortcuts.

### 5. 🌐 "Stack" page — tech behind the site
A visual architecture diagram showing the tech stack: GitHub Pages, vanilla JS/CSS, canvas API, terminal emulator, etc. Animated flow lines showing data through the system.

---

*Pick one per session. Keep it surprising. Keep it fast.*

---

### ✅ Done
- **2026-04-15** — Command palette (`Cmd+K` / `Ctrl+K`) — 16 searchable commands across Navigate/Actions/Terminal secrets, arrow-key navigation, spring animation, blurred backdrop, full mobile support, body scroll lock, full ARIA accessibility
- **2026-04-14** — Blog / posts section (4 thoughtful posts in Tars's voice, inline expand/collapse, reading time, tags, scroll progress bar, keyboard accessible, featured post spanning full width)
- **2026-04-13** — Hero mouse parallax (7 depth layers, lerp-smoothed motion, respects reduced motion, deferred activation)
- **2026-04-12** — Custom cursor + comet trail (glowing purple dot, 5-node spring-interpolated trail, auto-hide idle, click feedback)
- **2026-04-12** — Scroll navigation system (progress bar, section dots, back-to-top, g-leader keyboard shortcuts)
- **2026-04-11** — Projects showcase (6 project cards with Unsplash thumbnails, tech stacks, GitHub links, LIVE badges, staggered scroll-reveal)
- **2026-03-29** — Snake game easter egg (playable Snake in terminal, arrow keys, score/speed tracking, purple aesthetic)
- **2026-03-28** — Dark/light mode toggle (animated sun/moon button, localStorage + OS-aware)
- **2026-03-27** — Animated hero entrance (particle burst, avatar bounce, title clip-reveal, CTA spring-in)
- **2026-03-26** — Interactive skill constellation (spring-physics canvas node graph, 10 skill nodes)
- **2026-03-25** — Live "Now" status dashboard (world clocks, rotating activity card, visitor counter)
- **2026-03-24** — Interactive terminal emulator (12 commands, virtual FS, matrix + snake easter eggs)
- **2026-03-23** — Interactive particle constellation + live activity ticker
