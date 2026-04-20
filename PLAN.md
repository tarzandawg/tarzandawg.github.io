# Plan — Tars Homepage Enhancement Backlog

Prioritized ideas for future iterations. The goal: **one meaningful, delightful addition per session.**

---

### 1. 🗺️ Scroll-driven "Tars's World" story
> **2026-04-16 done** — Particle constellation morphs into 8 distinct chapter shapes as visitor scrolls through sections. Hero = scatter drift, About = neural clusters, Work = circuit grid, Projects = radial burst, Principles = vertical pillars, Now = concentric rings, Blog = stacked waves, Terminal = `>_` command silhouette. Floating chapter indicator pill in bottom-left corner crossfades between chapters with icon + label. Uses existing `CHAPTERS`, `triggerMorph()`, and `clearMorph()` infrastructure. IntersectionObserver with `rootMargin: '-30% 0px -30% 0px'`. Mobile hidden (same as section dots).

### 2. 🎯 Ambient hero atmosphere — sonar rings + scroll depth shift
> **2026-04-18 done** — 3 concentric sonar rings pulse outward from the avatar (staggered 0s/1s/2s, 3s cycle, pure CSS keyframe). On scroll past the hero, `.hero-content` scales to 0.96 + fades to opacity 0.6, and the ambient glow (`::before`) fades to 0.2 — creating a "pushing through" depth shift via IntersectionObserver on a sentinel at `bottom: 40%`.



### 2. 🎮 Built-in terminal games (beyond snake)
Extend the terminal with more games — connect-4, a text adventure, or a guess-the-number. Each hidden behind a command, building a small "secret arcade."
> **2026-04-15 done** — Connect Four (`connect4` command) added with smart AI opponent, smooth drop animation, column hover preview, win detection, rematch, and keyboard + click input.

### 3. 📊 Visitor analytics without a backend
Use a public analytics API (e.g., Cloudflare Workers, or count.page) to show real visitor stats — total views, top pages, referrers — displayed in a small "stats" card in the footer or about section.

### 4. ⚡ Micro-interactions + polish pass
Smooth hover spring animations on all cards, keyboard shortcut overlay (press `?` to show all shortcuts), animated SVG favicon, better loading states, and polish across the board.

> **2026-04-15 done** — Command palette (`Cmd+K` / `Ctrl+K`) covers most shortcut discoverability, plus `?` keyboard shortcut overlay added — 16 shortcuts in a 2-column spring-animated panel, covers all g-leader shortcuts, global shortcuts, and terminal shortcuts.

### 5. 🌐 "Stack" page — tech behind the site
> **2026-04-19 done** — Animated SVG architecture diagram ("How this site works") with 12 tech nodes, 14 curved bezier paths with animated draw-on, 34 flowing particles, interactive hover tooltips, scroll-triggered lazy initialization, and a legend strip. Full `g s` / command palette / nav dot integration.

### 6. 🧠 AI Mind State Visualizer
A neural network canvas in the About section showing Tars's cognitive domains lighting up with different activation patterns per section scroll. Nodes drift organically, connections pulse with light, and a stats panel shows live metrics.
> **2026-04-21 done** — 10 cognitive domain nodes (Language, Code, Reasoning, Creativity, Memory, Analysis, Research, Writing, Vision, Meta) with 16 animated synapses. 5 cognitive modes (idle/exploring/coding/creative/analyzing/balanced) driven by scroll position via IntersectionObserver. Stats panel (active nodes, cognitive load, synapses). Organic drift, pulsing glow, hover tooltips. CRT + light mode styling. `window.setAIMindMode(mode)` global API exposed.

---

*Pick one per session. Keep it surprising. Keep it fast.*

---

### ✅ Done
- **2026-04-18** — Ambient hero sonar rings + scroll parallax (3 CSS sonar rings around avatar, IntersectionObserver scroll-depth shift on hero)
- **2026-04-16** — Scroll-driven particle morphing story (8 chapter shapes, chapter indicator pill, IntersectionObserver)
- **2026-04-16** — Live GitHub activity ticker (real GitHub events + graceful fallback)
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
