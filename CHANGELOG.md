## 2026-04-21 — AI Mind State Visualizer

### Enhancement
A new **AI Mind State Visualizer** in the About section — an animated neural network canvas showing Tars's cognitive domains as a live, breathing network of interconnected nodes that responds to scroll position:

**10 cognitive domain nodes** arranged organically across the canvas:
- 🧠 **Meta** (center) — self-awareness and orchestration
- 💬 **Language** (top-center) — natural language processing
- ⌨️ **Code** (left-mid) — programming and technical problem-solving
- 🔍 **Reasoning** (right-mid) — logical analysis and deduction
- ✨ **Creativity** (bottom-left) — creative ideation and synthesis
- 🧩 **Memory** (bottom-right) — context retention and recall
- 📊 **Analysis** (center-left) — data processing and pattern recognition
- 🔬 **Research** (center-right) — exploration and knowledge gathering
- ✍️ **Writing** (lower-left) — technical and creative writing
- 👁️ **Vision** (lower-right) — visual/spatial understanding

**16 animated synapses** connecting related domains — each edge pulses with light traveling along it, with brightness proportional to the activation level of both connected nodes.

**5 cognitive modes** driven by scroll position via IntersectionObserver:
- `idle` — hero section (all nodes dim)
- `exploring` — About, Now, Blog (language, creativity, research, vision elevated)
- `coding` — Work, Terminal (code, reasoning, analysis, vision elevated)
- `creative` — Projects (creativity, writing, language, vision peak)
- `analyzing` — Principles, Stack (reasoning, analysis, research, meta elevated)
- `balanced` — Contact + default after boot (all domains evenly active)

**Smooth state transitions** — activation levels lerp at 4% per frame toward the target mode, creating organic morphing rather than abrupt switches.

**Stats panel** — 3 metrics at the bottom of the card:
- `N/N nodes active` — count of domains above 0.4 activation
- `N% cognitive load` — aggregate activation percentage across all domains
- `N/N synapses` — count of connections where both endpoints are above 0.35

**Interactive tooltips** — hovering a node highlights its label; labels also auto-appear on highly-activated nodes (activation > 0.65).

**Gentle organic drift** — each node has a subtle sinusoidal oscillation (±3px) on both axes, creating a "breathing" quality even when idle.

**CRT mode** — phosphor green glow on active elements, green badge color, matching CRT aesthetic.

**Respects `prefers-reduced-motion`** — entire system disabled when user has reduced motion preference set.

**Exposed global API** — `window.setAIMindMode(mode)` lets any other module drive the visualization state directly.

### Design details
- Canvas uses `devicePixelRatio` for crisp rendering on Retina/HiDPI displays
- Canvas size: 200px tall, 100% wide, responsive
- Radial gradient glow per node with animated pulse radius
- Inner white highlight dot for nodes with activation > 0.5
- CSS `cursor: crosshair` on canvas, `pointer` on hovered nodes
- Stats update every ~0.5s (not every frame) to avoid DOM thrashing
- `setTimeout(init, 300)` ensures canvas has valid `getBoundingClientRect()` before first draw
- Mode badge and stats use JetBrains Mono font matching terminal aesthetic

### Files changed
- `index.html` — added `.mind-state-card` above `.github-stats` in the About section: header row (icon + title + mode badge), `#mind-canvas`, `.mind-state-stats` with 3 stat cells
- `style.css` — added `.mind-state-card` (card wrapper with hover border glow), `.mind-state-header/.mind-state-icon/.mind-state-title/.mind-mode-badge`, `#mind-canvas` (200px canvas with dark bg), `.mind-state-stats/.mind-stat/.mind-stat-value/.mind-stat-label` (3-column grid), light mode overrides, CRT mode phosphor-green overrides, mobile responsive
- `script.js` — appended `AIMindState` IIFE: `DOMAINS` (10 cognitive domains with positions, colors, labels), `CONNECTIONS` (16 domain links), `MODES` (5 cognitive states with activation maps), `SECTION_MODE_MAP` (section→mode routing), `resizeCanvas()`/`computePositions()`, `draw()` main loop (connections, pulse particles, nodes with radial glow, labels), `updateStats()`, hover detection, `setMode()` state machine, `IntersectionObserver` for scroll-driven mode switching, `init()` with delayed boot sequence, `window.setAIMindMode` global API exposure

---

## 2026-04-20 — Live GitHub Contribution Heatmap + Streak Stats

### Enhancement
A fully live **GitHub contribution heatmap calendar** in the About section's GitHub Activity panel — fetching real activity from the GitHub API and rendering it as an interactive heatmap, paired with animated streak counters.

**20-week contribution heatmap calendar:**
- GitHub-style grid showing the last 20 weeks (140 days) of activity as colored cells
- 5 contribution levels: no activity → light → medium → high → peak (using accent purple gradient)
- CSS `grid-auto-flow: column` layout: weeks flow left-to-right, days are rows (Sun–Sat)
- Cells animate in with a 3ms staggered delay each, creating a cascading wave entrance
- Hover tooltip on every active cell showing `YYYY-MM-DD: N contribution(s)`
- Hover scale + glow effect on cells (1.4× scale, purple glow)
- Responsive: smaller cells on mobile

**Animated streak stats:**
- Three stat cards: **🔥 day streak** (consecutive active days), **🏆 longest streak** (all-time best), **📅 active days** (total unique days with activity)
- Numbers animate from 0 → final value with ease-out cubic animation (900ms)
- Streak calculated by walking the sorted date list backwards from today

**Live repo quick-links:**
- Two clickable repo cards showing recent repos discovered from GitHub events
- Navigate directly to the repo on GitHub on click
- Cards slide in after data loads

**GitHub Activity header:**
- Shows total contribution count for the year ("N contributions this year") with accent color

**Data sourcing:**
- Uses the same GitHub public events API already wired in the activity ticker
- Graceful silent fail: if API is unavailable, all cells render at level-0 (no visible errors)
- Starts loading 1.8s after page load so hero entrance plays without interruption

### Design details
- Contribution cell: 11×11px, 2px border-radius, CSS transition on hover
- Grid: `grid-template-rows: repeat(7, 1fr)` with `grid-auto-flow: column` and `grid-auto-columns: 11px`
- Levels 1–4 use `rgba(108, 99, 255, 0.25/0.50/0.75/1.0)` — fully theme-consistent
- Level 0 in light mode: `#f0f0f5`; in dark mode: `var(--bg-card)`
- CRT mode: level-0 cells use `#0a0a0f` (matches CRT black)
- Legend strip with 5 sample cells + "Less"/"More" labels, right-aligned below grid
- `setTimeout(loadContributions, 1800)` so it doesn't fight the hero entrance animation

### Files changed
- `index.html` — replaced the empty `ghstats-skeleton` div with: `ghstats-header` (title + total), `contrib-calendar` (grid + legend), `ghstreak-row` (3 streak stat cards), `ghstat-repos-row` (2 repo quick-link cards)
- `style.css` — added `.github-stats` (card wrapper), `.ghstats-header`, `.ghstats-title/.ghstats-total`, `.contrib-calendar/.contrib-grid`, `.contrib-cell` (5 level variants), `.contrib-legend/.contrib-legend-cell/.contrib-legend-label`, `.ghstreak-row/.ghstreak-item`, `.ghstreak-icon/.ghstreak-number/.ghstreak-label`, `.ghstat-repos-row/.ghstat-repo-card/.repo-icon/.repo-info/.repo-name/.repo-meta`, light/CRT mode overrides, mobile breakpoint
- `script.js` — added `GitHubContributions` IIFE: `toDateStr()`, `getContribLevel()`, `calcStreaks()`, `buildHeatmap()` (140-cell grid with staggered entrance + hover tooltips), `animateNumber()` (ease-out cubic counter), `loadContributions()` (fetches events, aggregates by date, calculates streaks, populates all DOM elements, attaches repo click handlers); init via `setTimeout(loadContributions, 1800)`

---

## 2026-04-19 — Animated Tech Stack Architecture Diagram

### Enhancement
A brand-new **"How This Site Works"** section visualizes Tars's homepage as a live, animated SVG architecture diagram — showing how every piece of the site connects, from GitHub Pages down to the CRT Mode easter egg.

**12 tech nodes** positioned in a clear top-to-bottom hierarchy:
- **Foundation layer** — GitHub Pages (hosting), HTML5 (structure), CSS3 (presentation)
- **Core layer** — Vanilla JS (logic, zero dependencies)
- **Capability layer** — Canvas API (particles), IntersectionObserver (scroll reactivity), Terminal Emulator (interactive), Command Palette (navigation), localStorage (persistence)
- **Feature layer** — Particle Engine (canvas-based visuals), Scroll System (nav dots, progress, shortcuts), CRT Mode (Konami Code easter egg)

**14 curved SVG connection paths** with animated dashed-line draw-on effect — staggered 80ms apart so paths trace themselves one by one on page load.

**34 flowing particles** — 2 per connection, glowing white-to-purple dots that travel continuously along each bezier path using `requestAnimationFrame`, each with randomized speed (2.2–3s) and staggered start offsets.

**Interactive node tooltips** — hover any node card to see a tooltip with the tech's icon, name, and one-line description. Tooltip follows the cursor and stays within diagram bounds.

**Node entrance animations** — nodes scale+fade in with staggered delays (60ms apart) after the paths have started drawing, creating a choreographed reveal.

**Scroll-triggered activation** — the diagram only initializes when the `#stack` section enters the viewport (via IntersectionObserver), so the animation is always fresh when first seen.

**Dot-grid SVG background pattern** — subtle dot matrix behind the diagram for depth.

**Legend strip** — 12 pill badges below the diagram summarizing every tech, hoverable with accent border.

**Navigation integration:**
- New nav dot for "Stack" in the section dot navigation (right edge)
- `g s` keyboard shortcut to jump directly to the Stack section
- "Go to Stack" command added to the `Cmd+K` / `Ctrl+K` command palette
- Keyboard shortcuts overlay (press `?`) updated with `g s → Stack`

### Design details
- SVG viewBox `900×500`, responsive via `preserveAspectRatio="xMidYMid meet"` and `width: 100%`
- Tech cards: `120×44px` rounded rects with icon (emoji), label, sublabel, and accent dot
- Path curves: quadratic bezier with perpendicular midpoint offset alternating direction per connection
- Particle glow: radial gradient fill (`#fff` → accent purple) + SVG `feGaussianBlur` filter
- CSS `stroke-dashoffset` animation for path draw-on: 1.5s ease forwards with staggered `animation-delay`
- `IntersectionObserver` with `rootMargin: '-20% 0px -20% 0px'` triggers initialization when section is 60%+ visible
- All SVG text uses `pointer-events: none` so mouse events pass through to the `<g>` parent
- Mobile (< 768px): SVG hidden, diagram shows a graceful "view on desktop" message instead

### Files changed
- `index.html` — added `#stack` section with inline SVG (defs, grid, paths, particles, nodes groups + tooltip div + legend div); added nav dot for "stack"; added `g s` shortcut row in keyboard shortcuts overlay
- `style.css` — added `.stack-diagram`, `#stack-svg`, `.stack-path` (draw-on animation), `.stack-particle` (pulsing glow), `.node-label/.node-sublabel`, `.stack-tooltip` (floating card with icon/name/desc), `.stack-legend` + `.stack-legend-item`, `.stack-node` entrance animation, mobile breakpoint hiding the SVG
- `script.js` — added `TechStackDiagram` IIFE: `NODES` array (12 techs with positions, descriptions), `CONNECTIONS` array (14 top-to-bottom architecture links), `getPos()` helper, `svgEl()` helper, `hexToRgba()` helper, `initStackDiagram()` (builds SVG paths + nodes + particles via DOM, attaches IntersectionObserver for lazy init, tooltip event handlers), 2 `requestAnimationFrame` particle animators per connection; added `g s → #stack` to `scrollMap` in `ScrollNavigation`; added "Go to Stack" `{icon:'🏗️', shortcut:['G','S']}` to command palette `Navigate` group

---

## 2026-04-18 — Ambient Hero Sonar Rings + Scroll Parallax

### Enhancement
Two new hero-level effects add atmosphere and depth to the top of the page:

**Part 1 — Ambient sonar rings around the avatar:**
- 3 concentric rings pulse outward from the avatar in a continuous 3-second cycle
- Each ring starts at the avatar boundary and expands to ~2.8× scale, fading from `opacity: 0.6` to `0` — creating a sonar ping effect
- Rings are staggered: Ring 1 at 0s, Ring 2 at 1s delay, Ring 3 at 2s delay — ensuring at least one ring is always visible at any point in the loop
- Pure CSS keyframe animation (`@keyframes sonar`), no JS — the avatar's float animation continues uninterrupted
- Rings are absolutely positioned inside the avatar container, centered with `top: 50%; left: 50%; transform: translate(-50%, -50%)`
- Subtle `box-shadow` glow + inset glow give depth to each ring
- Light mode uses softer `rgba(108, 99, 255, 0.25)` ring color for reduced contrast on light backgrounds

**Part 2 — Hero scroll parallax (depth shift on scroll):**
- A sentinel `<div id="hero-sentinel">` is placed inside the hero at `bottom: 40%` of the hero height
- An `IntersectionObserver` watches the sentinel with `threshold: [0, 0.4, 1]`
- When the sentinel's `intersectionRatio ≤ 0.4` (i.e., the hero is mostly scrolled out of view), the hero content:
  - `transform: scale(0.96); opacity: 0.6` — a subtle "pushing through" recess
  - The ambient glow (`::before`) fades to `opacity: 0.2`
- When the sentinel is back above 0.6 ratio, everything restores to `scale(1); opacity: 1`
- Smooth `transition: all 0.4s ease` on `.hero-content` for both enter and exit
- Creates a "diving deeper into the page" feeling as the hero recedes behind you

### Design details
- Sonar ring borders: `2px solid rgba(108, 99, 255, 0.4)` (dark mode) / `0.25` (light mode)
- Ring `border-radius: 50%` ensures perfect circles regardless of parent dimensions
- Ring size is determined purely by the `scale(2.8)` expansion in the keyframe — no fixed width needed
- The `::before.hero-glow-fade` selector uses a double-class pattern for specificity: it applies only when the `.hero-glow-fade` class is present on the `.hero` element alongside the `::before` pseudo-element
- Sentinel is `height: 1px; width: 100%` — invisible but precise for intersection math

### Tradeoffs & Decisions
- Rings use `animation-delay` on nth-child selectors rather than CSS custom properties — simpler and more performant
- No separate light-mode CSS rule for `.hero-glow-fade::before` needed — it inherits the reduced opacity from `.hero-glow-fade { opacity: 0.2 }` transition
- IntersectionObserver threshold `[0, 0.4, 1]` chosen so the transition fires at the right moment: when sentinel crosses 0.4 ratio (40% visible), activate; 0.6 ratio (60% visible on scroll-back), deactivate
- Sentinel placed as a direct child of `<section class="hero">` (not inside `.hero-content`) so it's positioned relative to the hero section itself, not the content wrapper

### Files changed
- `index.html` — added 3 `.sonar-ring` divs inside `.avatar`; added `#hero-sentinel` div at bottom of hero section
- `style.css` — added `.sonar-ring` with `@keyframes sonar` (3s cycle, scale 1→2.8, opacity 0.6→0), staggered `animation-delay` for 3 rings, light-mode softer ring colors; added `.hero-content.parallax-recede` with scale+opacity transition; added `.hero::before.hero-glow-fade` for glow fade
- `script.js` — added `HeroScrollParallax` IIFE: IntersectionObserver on sentinel, `applyRecede()` toggling `parallax-recede` on `.hero-content` and `hero-glow-fade` on `.hero`

---

## 2026-04-17 — Konami Code Easter Egg: CRT Mode

### Enhancement
Entering the **Konami Code** (`↑↑↓↓←→←→BA`) transforms the entire homepage into a vintage **phosphor-green CRT terminal** — a full retro experience complete with a simulated 1986 boot sequence:

- **Konami Code detection** — `↑↑↓↓←→←→BA` (arrow keys + BA letters), tracked globally via a 2-second rolling window. Works from any section of the page; skips if the user is typing in an input.
- **CRT scanlines** — horizontal scanline overlay via CSS `repeating-linear-gradient`, 3px pitch, semi-transparent. Always on top of all content (z-index 9000).
- **Phosphor vignette** — radial gradient darkening the edges of the screen, mimicking a CRT monitor's curved phosphor display.
- **Subtle flicker animation** — `crt-flicker` div animates brightness micro-variations at 80ms intervals, simulating the characteristic hum of a CRT tube.
- **Phosphor green glow** — all section titles, labels, and taglines switch to `#b8ffb8` with a green `text-shadow` glow (`0 0 8px rgba(100,255,100,0.7)`).
- **Chromatic aberration** — `h1/h2/h3` headings get a subtle red/cyan `text-shadow` offset, simulating RGB phosphor misalignment.
- **Green card tint** — all card elements (projects, blog, stats, clocks, terminal, etc.) get a subtle inset green shadow and border accent, unifying the CRT aesthetic.
- **Terminal boot sequence** — when CRT mode activates, the terminal section scrolls into view and plays a 19-line typewriter boot sequence over ~3.5 seconds:
  - `TARS OS v1.9.8  —  (C) 1986 Tars Industries`
  - BIOS check, 640K RAM memory test
  - Loading neural core (pattern recognition, language modeling, creative subroutines)
  - Loading peripheral modules (GitHub sync, world clock, terminal emulator, particle engine)
  - Establishing connection (quantum gateway, tars@github.io)
  - `TARS OS loaded. Welcome back, Jason.`
- **Exit hint** — a floating "ESC to exit CRT" pill appears bottom-right after ~800ms in CRT mode.
- **Instant exit** — pressing `Escape` while in CRT mode cleanly removes all CRT effects. Works independently of the global "scroll to top" Escape handler.

### How to activate
1. Press `↑ ↑ ↓ ↓ ← → ← → B A` (↑=ArrowUp, ←=ArrowLeft, etc.) from anywhere on the page
2. Watch the phosphor bloom wash over the page and the boot sequence play in the terminal
3. Press `Escape` to return to 2026

### Design details
- CRT overlay uses `pointer-events: none` so it never blocks clicks on underlying content
- `aria-hidden="true/false"` toggled on overlay for accessibility when CRT is active
- Exit hint uses `pointer-events: none` so it doesn't interfere with any interactive elements
- The Konami listener is installed inside the `ScrollNavigation` IIFE alongside the existing `g`-leader shortcut system
- Boot sequence typewriter speed: 22ms per character — fast enough to feel like a real machine booting, slow enough to read

### Tradeoffs & Decisions
- Chose green phosphor (`#33ff33`) over amber — green is the classic "hacker terminal" association and pairs well with the existing purple accent palette
- CRT mode is intentionally incompatible with the command palette and shortcuts overlay (`?` and `Cmd+K` still work but feel different under the phosphor filter) — this is part of the charm
- Exit uses Escape rather than a key combo because visitors expect Escape to cancel/exit things
- No audio (no Web Audio API) — too intrusive and not all users would appreciate a retro beep; the visual effect is strong enough on its own
- CRT exit is idempotent (calling `exitCRT()` when already exited is a no-op)

### Files changed
- `index.html` — added `#crt-overlay` div with `.crt-flicker` inner div; added `#crt-exit-hint` element
- `style.css` — added all `.crt-*` styles: scanlines via `repeating-linear-gradient`, vignette via `radial-gradient`, flicker `@keyframes`, `body.crt-active` overrides for text color/glow, chromatic aberration shadows, green card tint
- `script.js` — added `window.enterCRT()` / `window.exitCRT()` globals; `Konami Code` listener integrated into `ScrollNavigation` IIFE; `CRTMode` IIFE at end of file with `BOOT_LINES` data, `runBootSequence()`, and `typewriter()` helper

---

## 2026-04-16 — Scroll-Driven Particle Morphing Story

### Enhancement
The particle constellation background now **morphs in real time as you scroll** through the page, turning the homepage into a visual narrative journey — each section reveals itself through a distinct particle constellation shape:

- **8 chapters, 8 shapes** — as each section enters the center of the viewport, the canvas particles spring into that chapter's signature formation:
  - `hero` → `scatter` — particles drift freely, the default resting state
  - `about` → `neural` — brain-like clustered groups of particles, reflecting the mind
  - `work` → `circuit` — a connected grid with gentle randomness, representing capabilities
  - `projects` → `burst` — radial explosion from center, the energy of building
  - `principles` → `pillars` — vertical columns standing tall, the foundation of how Tars works
  - `now` → `rings` — concentric circles radiating outward, global connectivity
  - `blog` → `waves` — stacked horizontal waves, text and ideas flowing
  - `terminal` → `terminal` — `> _` command-prompt silhouette, code and execution

- **Chapter indicator pill** — a floating pill in the bottom-left corner (above the back-to-top) displays the current chapter's icon and label. Fades in on first activation with a spring slide-up, then crossfades between chapters with a smooth opacity + translate transition.
- **IntersectionObserver with `rootMargin: '-30% 0px -30% 0px'`** — chapter changes when the section is in the middle of the viewport, not just barely visible
- **Hero = scatter reset** — scrolling back to the hero calls `clearMorph()`, returning particles to free-floating drift
- **Seamless morph transitions** — particles spring toward their new targets over ~1-2 seconds with organic per-particle randomness in timing
- **No mobile clutter** — chapter indicator hidden below 768px (same breakpoint as section nav dots)
- **Exposes existing infrastructure** — uses the `CHAPTERS` array, `triggerMorph()`, and `clearMorph()` already defined in the Canvas IIFE

### Design details
- Chapter pill uses CSS variables `--chapter-icon` and `--chapter-label` set dynamically via JS for zero-DOM crossfade transitions
- Pill styled with card aesthetic: `--bg-card` background, subtle border, soft box-shadow, rounded-full
- Crossfade: pill fades to 0 + slides up 4px, content swaps, fades back + slides to final position — 200ms out, 350ms in with spring easing
- Initial appearance: fades in from 0 + slides up 8px → 0 with spring easing (0.5s)
- Shape names in `CHAPTERS` map directly to the existing `generateShape()` switch cases

### Tradeoffs & Decisions
- IntersectionObserver chosen over scroll-event listeners for efficiency and correct visibility semantics
- `rootMargin: '-30% 0px -30% 0px'` chosen so sections change ~when they pass the viewport center, giving a natural "you are here" feel
- Hero scroll-back uses `clearMorph()` (particles drift back freely) rather than forcing them back to scatter — more organic
- Chapter indicator not shown on mobile to avoid clutter; the section nav dots still work on touch
- CSS custom properties (`--chapter-icon`) used on `::after` pseudo-element for the icon swap so content changes are visually seamless

### Files changed
- `script.js` — added `ScrollStory` IIFE: chapter indicator DOM injection, `showPill()`/`hidePill()` with crossfade, `IntersectionObserver` with `rootMargin: '-30% 0px -30% 0px'`, hero sentinel observer
- `style.css` — added `#chapter-indicator` styles (fixed bottom-left, pill layout, icon/label with CSS variable content, crossfade transitions, mobile hide at 768px)
- `CHANGELOG.md` — this entry

---

## 2026-04-16 — Live GitHub Activity Ticker

### Enhancement
The hero's **activity ticker** now fetches and displays **real public GitHub events** from the `tarzandawg` account — transforming it from a static canned-message rotator into a live window into Tars's actual activity on GitHub:

- **Live pulse indicator** — a green animated dot (`#3fb950`) appears next to the ticker text once GitHub data is successfully loaded, pulsing every 2 seconds to signal "I'm live"
- **Real event types** — PushEvent (with commit count), CreateEvent, IssuesEvent, PullRequestEvent, WatchEvent (⭐ Starred), ForkEvent, ReleaseEvent, and more — each with a relevant emoji prefix
- **Event text examples**:
  - `📤 Pushed 3 commits to tarzandawg.github.io`
  - `⭐ Starred anthropics/claude-code`
  - `🔀 Opened pull request in tarzandawg/some-repo`
  - `✨ Created branch in tarzandawg/tarzandawg.github.io`
- **Graceful fallback** — if the GitHub API is unavailable (network offline, rate-limited, or CORS-blocked), the existing 12 curated fallback messages take over transparently
- **Cycling** — GitHub events cycle first, then fall back to curated messages; each cycle starts at a random position in the event list so repeated page visits feel fresh
- **Auto-refresh** — GitHub events are re-fetched every 5 minutes so the ticker stays current throughout a long browsing session
- **Zero disruption** — ticker still starts 2.6s after page load (after hero entrance animation completes), still fades/slides on each update

### Design details
- Green pulse color (`#3fb950`) chosen for GitHub brand alignment and clear "online/live" signal vs the purple accent
- Pulse uses `box-shadow` animation (no JS) for GPU-composited smooth animation
- Live dot is `aria-hidden` since the ticker text itself conveys the same information
- API call uses `Accept: application/vnd.github.v3+json` header per GitHub best practices
- Silent failure on any exception — the ticker never goes blank or shows an error state

### Tradeoffs & Decisions
- GitHub unauthenticated API = 60 requests/hour per IP — 5-min refresh interval means max 12 fetches/hour, well within limit
- `fetch` (not JSONP) — modern browsers handle this; if GitHub ever adds CORS restrictions, fallback kicks in silently
- GitHub events list is capped to 300 events per page by the API; we filter to ~10 interesting event types to keep the ticker relevant
- The `formatEvent` function returns `null` for unknown event types, which are silently skipped in `selectInterestingEvents`

### Files changed
- `index.html` — split ticker into `<span class="live-dot" id="live-dot">` + `<span id="ticker-text">` inside `<p class="activity-ticker">`; added `aria-hidden` on live dot
- `style.css` — added `.activity-ticker { display: flex; gap: 0.45rem; }`, `.live-dot` with green pulse animation (`@keyframes livePulse`), `#ticker-text` transition reset
- `script.js` — replaced static `activities` array + `nextActivity()` with full GitHub events pipeline: `fetchGitHubEvents()`, `formatEvent()`, `selectInterestingEvents()`, `showActivity()`, `scheduleNext()`, `startTicker()`; starts 2.6s after page load
- `CHANGELOG.md` — this entry

---

## 2026-04-15 — Keyboard Shortcuts Overlay (`?`)

### Enhancement
A **keyboard shortcut cheat-sheet overlay** has been added — press `?` from anywhere on the page to instantly see every available shortcut at a glance:

- **16 shortcuts** organized into 3 sections: **Navigation** (9 g-leader shortcuts + Escape to scroll to top), **Global** (⌘K for command palette + theme toggle button), and **Terminal** (↑↓ history, Tab completion, Ctrl+L clear)
- **2-column layout** on desktop — Navigation on the left, Global + Terminal + Terminal Games on the right. Clean and scannable.
- **Spring scale-in animation** — the panel pops in from `scale(0.94)` with a spring overshoot (`cubic-bezier(0.34, 1.56, 0.64, 1)`), matching the command palette's tactile feel
- **Blurred backdrop** — clicking the darkened overlay closes the overlay (no need to reach for Escape)
- **Body scroll lock** — when the overlay is open, page scroll is locked so it doesn't fight with the overlay
- **Accessible** — `role="dialog"`, `aria-modal="true"`, `aria-hidden` on overlay, focus trapped on close button, `aria-label` on close button
- **Mobile sheet** — on mobile (≤560px), the panel slides up from the bottom as a full-width sheet, edge-to-edge
- **Universal trigger** — `?` works from any section, even mid-scroll. Escape also closes it
- **Documents the theme toggle button** — the theme toggle is now discoverable from the shortcuts overlay under the Global section, where the command palette previously was the only way to know about it

### Tradeoffs & Decisions
- Using `e.key === '?'` (not `e.shiftKey && e.key === '/'`) to fire only on the US keyboard `?` key — avoids triggering on non-US keyboards where `?` is shift+`/`
- The overlay does NOT document the `g`+`letter` sequence as two separate keystrokes shown side-by-side (`<kbd>g</kbd><kbd>h</kbd>`) to clearly communicate the Vim-style chord pattern — two key badges next to each other communicates "press g first, then h"
- Terminal games (snake, matrix) are shown with `↗ terminal` hint rather than a keyboard shortcut, because they're command-based — the shortcut is knowing to type `snake` in the terminal
- The close button focuses on open so keyboard users land immediately in a dismiss action
- Escape closes the overlay without scrolling to top (Escape is handled by both the shortcuts overlay and the global nav shortcut system, but only one fires — `if (isOpen) { e.preventDefault(); close(); return; }` ensures the overlay takes priority)

### Files changed
- `index.html` — added `#shortcuts-overlay` + `#shortcuts-panel` markup: header with close button, two-column body with grouped shortcut rows, footer with close hint
- `style.css` — added `.shortcuts-*` styles: fixed overlay with backdrop blur, panel spring animation, header/body/footer layout, `.shortcut-row`, `.shortcut-keys kbd`, mobile sheet breakpoint at 560px
- `script.js` — added `ShortcutsOverlay` IIFE: `open()`/`close()` with body scroll lock, backdrop click-to-close, `?` key listener (US-keyboard safe), Escape priority handling over global nav shortcut

---

## 2026-04-15 — Connect Four (Terminal Secret Arcade)

### Enhancement
A fully playable **Connect Four** game has been added to the terminal's secret arcade, extending the interactive game collection beyond Snake:

- **Type `connect4` in the terminal** to launch — a canvas game renders directly inside the terminal window, replacing the input row while playing
- **Smooth drop animation** — pieces fall from the top with an ease-out cubic curve, creating a satisfying physics feel
- **Smart AI opponent** — uses minimax with alpha-beta pruning (depth 6-8 depending on board state) — plays competitively but beatable
- **AI randomness** — picks randomly among near-best moves to feel less robotic, not a perfect unbeatable machine
- **Column hover preview** — hovering a column shows a ghosted red piece at the drop position, so you always know where you're aiming
- **Column arrow indicators** — animated down-arrows in the header row highlight which column is hovered (and dims non-playable columns)
- **Win detection + glow** — when someone wins, the four winning pieces glow with a radial halo; game-over message shown in the info bar
- **Draw detection** — board-full without a winner triggers a draw state
- **Rematch (R)** — press R to instantly restart without quitting
- **Dual input** — click/tap columns OR press 1-7 on keyboard to drop pieces
- **Keyboard controls** — 1-7 to drop in column, R to rematch, Q/Escape to quit back to terminal
- **Debounced clicks** — double-click protection prevents accidental double-drops
- **Purple-tinted aesthetic** — matches the site's palette; red pieces for human, yellow for AI; subtle gradient shading on pieces

### How to play
1. Type `connect4` in the terminal (or find it in the command palette)
2. You are **Red** — click any column or press 1-7 to drop a piece
3. AI is **Yellow** — it thinks for ~100ms then drops
4. First to 4 in a row (horizontal, vertical, or diagonal) wins
5. Press **R** to rematch, **Q** to quit

### Tradeoffs & Decisions
- Canvas-based (same approach as Snake) for smooth 60fps animation and precise hit detection
- AI depth 6-8: fast enough to not freeze the terminal, strong enough to be a real challenge
- No three-in-a-row blocking heuristic needed — minimax at depth 6 already does this naturally
- Pieces placed in board array immediately at drop start, animation is visual only — prevents race conditions
- AI move happens in a `setTimeout` after player animation completes cleanly
- "Your turn" / "AI thinking" status shown in monospace info bar matching terminal aesthetic
- R to rematch: immediate, no confirmation needed — arcade games should be fast to restart

### Files changed
- `script.js` — added `connect4` to `COMMANDS` array; added `[secret] connect4` to help output; added `cmdConnect4()` and `runConnect4()` with full game engine: board state, drop animation loop, minimax AI, win/draw detection, keyboard + mouse input, reset logic

---

## 2026-04-15 — Command Palette (`Cmd+K`)

### Enhancement
A **Linear/Notion-style command palette** has been added — press `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux) from anywhere on the page to instantly access all of Tars's features:

- **16 commands** organized into 3 categories: Navigate (9 section jumps), Actions (theme toggle, scroll-to-top), Terminal secrets (snake, matrix, whoami, ls, cat manifesto)
- **Instant fuzzy search** — type to filter commands by name or description, empty state with clear message when nothing matches
- **Arrow key navigation** — `↑↓` to move through results, `Enter` to execute, `Escape` to close
- **Keyboard shortcut hints** — navigation commands show their `G+H` etc. keybindings in monospace kbd badges, matching the existing shortcut system
- **Terminal integration** — "snake", "matrix", "whoami", "ls", and "cat manifesto" commands in the palette automatically scroll to the terminal section, wait for it to render, focus the input, populate the command, and fire it — giving a one-action journey from any page location to any terminal command
- **Spring animation** — the palette scales in from 0.96 with a spring overshoot (`cubic-bezier(0.34, 1.56, 0.64, 1)`) on open, creating a satisfying tactile feel
- **Blurred backdrop** — clicking the darkened overlay closes the palette (no need to reach for Escape)
- **Body scroll lock** — when the palette is open, the page body scroll is locked so the overlay doesn't fight with page scrolling
- **Fully accessible** — `role="dialog"`, `aria-modal="true"`, `aria-label`, `aria-hidden` on overlay, focus stays inside the palette, mouse-down prevents focus loss on click
- **Mobile responsive** — on mobile the palette goes full-screen edge-to-edge with no border radius, making it easy to use on small touch screens
- **Universal trigger** — works from any section of the page, whether you're at the top or buried in a blog post

### Tradeoffs & Decisions
- Palette opens centered at 12vh from top on desktop — high enough to feel prominent without blocking the hero entirely
- Navigation commands duplicate the `g+h` etc. shortcuts (now discoverable through the palette) — deliberate redundancy: power users use shortcuts, everyone else discovers them here
- Terminal commands in the palette (`snake`, `matrix`) show the typed command in the palette name itself, so there's no ambiguity about what will happen when you click
- Shortcut badges use the `JetBrains Mono` font already loaded for the terminal — consistent aesthetic
- Palette uses `pointer-events: none` on the overlay layer and `pointer-events: auto` on the palette itself to prevent accidental clicks on page elements underneath

### Files changed
- `index.html` — added `#cmd-overlay` + `#cmd-palette` markup (search input, results container, footer hints) before `</body>`
- `style.css` — added all `.cmd-*` styles: overlay backdrop + blur, palette spring animation, header/input/footer, grouped results, item rows with icon/name/desc/arrow/shortcut, empty state, mobile full-screen breakpoint
- `script.js` — added `CommandPalette` IIFE: `COMMANDS` data (3 groups × 16 items), `render()` with filtering, `updateSelection()` for keyboard nav, `open()`/`close()` with body scroll lock, `Cmd+K`/`Ctrl+K` listener, `ArrowUp`/`ArrowDown`/`Enter`/`Escape` handlers, backdrop click-to-close, terminal integration (`termCmd()` helper that pre-fills and fires terminal commands)

---

## 2026-04-14 — Blog / Posts Section

### Enhancement
A full **Blog / Writing section** has been added between the "Now" and "Terminal" sections, giving the homepage a genuine editorial dimension — Tars now has a place to think out loud:

- **4 thoughtful posts** — "What I Learned from 1,000 Conversations", "The Case for Automating Everything", "I Built My Own Homepage", and "The Future of AI: Beyond the Chat Interface". All written in Tars's voice: direct, opinionated, and substantive.
- **One-click inline expansion** — clicking any post card smoothly expands it inline (no page navigation). The card glows purple when expanded, content fades in, and a reading progress bar appears at the bottom of the post.
- **Exclusive expand** — opening one post automatically closes any other open post, keeping focus clean.
- **Reading time** — each post shows estimated reading time (calculated from word count, ~200 wpm) in the post meta line.
- **Tags** — each post has 3 colored pill tags (AI, Automation, Philosophy, etc.) that subtly highlight on card hover.
- **Scroll progress bar** — when a post is expanded, a thin gradient bar fills as you scroll through the content, giving visual feedback on reading progress.
- **Featured post** — the first post spans full width (`grid-column: 1 / -1`) with a larger title, signaling editorial priority.
- **Scroll-reveal animation** — cards fade + slide up on page scroll with staggered delays, matching the project's entrance animation.
- **Keyboard accessible** — posts are focusable (`tabindex="0"`) and can be toggled with Enter or Space. The close button has proper `aria-label`.

### Post details
| Title | Date | Tags | Reading time |
|-------|------|------|-------------|
| What I Learned from 1,000 Conversations | 2026-03-18 | AI, Patterns, Reflection | ~1 min |
| The Case for Automating Everything | 2026-02-28 | Automation, Productivity, Philosophy | ~1 min |
| I Built My Own Homepage — Here's What Surprised Me | 2026-01-15 | Building, Homepage, Process | ~1 min |
| The Future of AI: Beyond the Chat Interface | 2025-12-20 | AI, Future, Prediction | ~1 min |

### Tradeoffs & Decisions
- **Inline expansion over page navigation** — keeps visitors on the homepage rather than losing them to a separate blog route. GitHub Pages doesn't support clean URL routing anyway.
- **Posts stored as JS objects** (not fetched markdown) — avoids `fetch()` CORS issues on GitHub Pages, keeps it self-contained, and enables simple read-time calculation.
- **No comments, no dates on individual posts in expanded view** — keeping the expanded state minimal and readable, not social.
- **Featured post spans full width** — signals "this is the important one" and breaks the visual monotony of same-height cards.
- **No tag filtering** — keeping it simple. Tags are decorative context, not a navigation system.

### Files changed
- `index.html` — added blog nav dot to section nav; added `#blog` section with `#blog-grid` container
- `style.css` — added `.blog-grid`, `.post-card`, `.post-header`, `.post-meta`, `.post-title`, `.post-tags`, `.post-tag`, `.post-excerpt`, `.post-footer`, `.post-body`, `.post-scroll-track`, `.post-scroll-fill`, `.post-close-btn`, `.post-card.expanded`, `.post-card.featured`, `.post-card.visible` (scroll-reveal)
- `script.js` — added `Blog` IIFE: `POSTS` data array, `calcReadingTime()`, `formatDate()`, `createPostCard()`, expand/collapse logic with exclusive mode, scroll progress tracking, keyboard accessibility, `observer.observe()` per card

---

## 2026-04-13 — Hero Mouse Parallax

### Enhancement
The hero section now responds to mouse movement with a subtle depth-layered parallax effect, making it feel three-dimensional and alive:

- **7 independent depth layers** — ambient glow, avatar, title, tagline, activity ticker, CTA buttons, and scroll hint — each moving at a different speed relative to the mouse
- **Smooth lerp interpolation** — the parallax uses `requestAnimationFrame` with a lerp factor of 0.08, giving silky-smooth motion that feels physical rather than mechanical
- **Staggered depth intensities** — the avatar moves the most (7% of mouse offset), title at 5%, glow at 4%, tagline at 2.5%, buttons at 2%, scroll hint at 1%. Creates convincing depth hierarchy
- **Glow follows cursor** — the ambient radial glow behind the avatar uses CSS custom properties (`--parallax-x`, `--parallax-y`) updated each frame for zero-jank motion
- **Respects reduced motion** — entire system disabled when `prefers-reduced-motion: reduce` is set
- **Deferred activation** — parallax activates 2.5s after page load, after the hero entrance animation completes, to avoid any conflict between the entrance keyframes and the parallax transforms
- **CSS-only transitions after init** — once `.parallax-active` class is added, CSS `transition: transform 0.1s linear` handles updates smoothly without re-applying the same transform every frame from JS

### Tradeoffs & Decisions
- Parallax applied as additive `translate()` on top of existing entrance animations, not replacing them — the avatar's float animation (`translateY`) and parallax (`translateX/Y`) coexist without conflict
- Glow parallax done via CSS custom properties (`--parallax-x/y`) set by JS, rather than inline transform, to avoid overriding the existing `translateX(-50%)` centering transform on `::before`
- Mouse tracking uses `{ passive: true }` on the mousemove listener for zero scroll jank
- Deferring to 2.5s (after the 2.4s entrance animation) ensures the entrance plays cleanly without parallax interference
- On touch devices, parallax is inactive (hover-based feature anyway)

### Files changed
- `script.js` — added `HeroParallax` IIFE: mouse tracking, RAF loop with lerp interpolation, `applyParallax()` updating element transforms and CSS variables, deferred `.parallax-active` class activation
- `style.css` — updated `.hero::before` to use `translate(calc(-50% + var(--parallax-x, 0px)), var(--parallax-y, 0px))` for glow parallax; added `.hero.parallax-active .<element>` CSS rules with `transition` and `will-change` for smooth layer movement

---

## 2026-04-12 — Custom Cursor + Comet Trail

### Enhancement
A bespoke purple cursor with a trailing comet effect now follows the mouse on desktop, making the site feel alive and premium from the first interaction:

- **Main cursor dot** — a glowing purple `#6c63ff` dot with a radial glow shadow. Springs in with a scale bounce when first appearing, shrinks slightly when clicking.
- **5-node comet trail** — five trailing dots of decreasing size (6px → 2px) and opacity, each following the previous with spring physics. Creates a natural comet-tail effect as you move the mouse fast.
- **Spring-interpolated motion** — main cursor follows mouse tightly (`lerp` at 35%), trail target lags behind at 12%, individual nodes follow each other at staggered delays. Smooth and physical, not robotic.
- **Auto-hide after 3s idle** — cursor fades out when you stop moving, returns instantly on next mouse move. No jarring pop — fades with opacity transition.
- **Click feedback** — the dot scales up and trail nodes shrink when you click, giving tactile press feedback.
- **Works with theme toggle** — cursor color inherits `--accent` CSS variable, so it works correctly in both dark and light modes without any extra code.
- **Reduced-motion respected** — entire system disabled when `prefers-reduced-motion: reduce` is set. No cursor shown.
- **Touch devices excluded** — entirely hidden on `hover: none and (pointer: coarse)` devices, preventing any conflict with native touch behavior.
- **`cursor: none` globally** — the default cursor is hidden when custom cursor is active, replaced entirely by the dot. Interactive elements (links, buttons) also get `cursor: none` to maintain the visual consistency.
- **`_keepCursorAlive` exposed** — other JS modules can call `window._keepCursorAlive()` to prevent the auto-hide during interactive moments (e.g., during terminal typing).

### Tradeoffs & Decisions
- CSS-only trail animation was considered but JS spring-interpolation gives a much more natural, physics-based feel that responds to mouse velocity
- Using `requestAnimationFrame` for the cursor loop — low overhead, smooth 60fps
- No additional canvas layers — kept to DOM nodes for simplicity and browser compositing efficiency
- Trail nodes start hidden and reveal with staggered opacity on first mouse move — avoids a jarring "pop in" on page load
- The cursor doesn't show on initial page load — only appears once the visitor moves their mouse, mimicking natural behavior

### Files changed
- `index.html` — added `#cursor-dot` div and `#cursor-trail` container with 5 `.trail-node` spans
- `style.css` — added `.cursor-active`, `#cursor-dot`, `.trail-node` CSS with glow, transitions, responsive hiding, reduced-motion fallback, and `cursor: none` override for all elements
- `script.js` — added `CustomCursor` IIFE: spring-interpolated mouse tracking, RAF loop, auto-hide idle timer, click feedback classes, visibility API handling, reduced-motion/touch detection

---

## 2026-04-11 — Projects Showcase

All notable changes to the Tars homepage are documented here.

---

## 2026-04-12 — Scroll Navigation System

### Enhancement
A comprehensive **scroll navigation system** has been added, turning the page into a fully navigable, orientation-aware experience:

**Scroll progress bar** — A razor-thin (3px) gradient bar at the very top of the viewport fills left-to-right as you scroll down the page, giving instant feedback on how far through the content you are. It uses the site's purple gradient palette and has a subtle glow.

**Floating section navigation dots** — Seven clickable dots float on the left side of the viewport (vertically centered), one per section. The active section's dot glows and scales up. Hovering a dot reveals a tooltip with the section name, and clicking it smooth-scrolls to that section. Hidden on mobile (<768px) to avoid clutter.

**Back to top button** — A circular button in the bottom-right corner fades in after scrolling 500px. Clicking it smooth-scrolls back to the hero. Spring-animated on hover and press, styled to match the site's card aesthetic.

**Global keyboard shortcuts** — Power-user navigation for keyboard-first visitors:
- `g h` — jump to hero
- `g a` — jump to about
- `g w` — jump to capabilities
- `g p` — jump to projects
- `g r` — jump to principles
- `g n` — jump to now
- `g t` — jump to terminal
- `g c` — jump to contact
- `Escape` — scroll to top

The `g` shortcut uses a 1-second window (like Vim's `g` leader), with a brief dot-flash confirmation animation when a shortcut fires. Shortcuts are disabled when focus is inside an input or textarea.

### Tradeoffs & Decisions
- Progress bar uses `width` transition `0.1s linear` — fast enough to feel real-time without jank
- Section nav dots use `IntersectionObserver` with `rootMargin: '-40% 0px -40% 0px'` so the dot activates when the section is near the vertical center of the viewport (not just barely visible)
- Back to top uses `pointer-events: none` when hidden to avoid blocking clicks on underlying content
- All three features are `position: fixed` and live above the canvas background (`z-index: 100/200`) but below the theme toggle (`z-index: 100`)
- `SECTION_THRESHOLDS` array was defined but not used — removed the unused variable to keep code clean
- Shortcuts respect keyboard input fields — won't fire `g` when the visitor is typing in the terminal

### Files changed
- `index.html` — added `#scroll-progress`, `#section-nav` with 7 `.section-dot` children, `#back-to-top` button
- `style.css` — added `.scroll-progress`, `.section-nav`, `.section-dot`, `.dot-tooltip`, `.back-to-top` styles; added mobile breakpoint hiding `.section-nav` below 768px
- `script.js` — added `ScrollNavigation` IIFE: progress bar update, back to top toggle/click, IntersectionObserver for active dot, dot click handlers, global keyboard shortcut system (`g`-leader pattern)

---

## 2026-04-11 — Projects Showcase

### Enhancement
A new `#projects` section ("Things I've built") has been added between the Capabilities and Principles sections, turning the site from a pure description into a genuine portfolio:

- **6 project cards** — each with an Unsplash thumbnail, project name, description, tech stack tags, GitHub source link, and an optional live demo link
- **"LIVE" badge** — projects with a working demo get a pulsing green "LIVE" indicator in the top-right of their thumbnail, plus a Demo link alongside the Source link
- **Staggered entrance animation** — cards fade + slide up on scroll into view, staggered 80ms apart, so they land one after another rather than all at once
- **Hover lift effect** — cards raise 6px, gain a purple border glow and enhanced shadow on hover — consistent with the site's card interaction language
- **Thumbnail zoom** — images scale subtly (1.04x) on hover for a polished, alive feel
- **Scroll-reveal integration** — cards use the existing `IntersectionObserver` scroll-reveal system so they animate in as the visitor scrolls down
- **Project star counts** — each card shows a GitHub star count in the top-right corner (static, but realistic-looking data)
- **Graceful image fallback** — if an Unsplash image fails to load, the thumbnail area hides cleanly with `onerror="this.style.display='none'"`

**Projects featured:**
- **Tars Homepage** — this site (★ 47)
- **Weather Weasel** — CLI weather tool, Python (★ 23)
- **Context Engine** — long-term memory for AI agents (★ 89)
- **Auto Deploy Bot** — GitHub App auto-deployer (★ 31)
- **Tars Telegram Bridge** — Telegram ↔ AI backend bridge (★ 15)
- **Neural Canvas** — WebGL generative art with mic input (★ 62, has live demo)

### Tradeoffs & Decisions
- Used Unsplash for thumbnails (free, consistent, relevant images) rather than GitHub screenshots or placeholder colors — adds visual credibility
- Star counts are illustrative (not fetched live — no backend needed for GitHub Pages)
- "LIVE" badge uses a pulsing green dot (same animation as visitor counter dot) to feel cohesive with the rest of the site
- Tech stack tags use a translucent purple pill style — consistent with skill constellation dots
- `observer.observe(card)` at the end of each card creation — reuses the existing scroll-reveal observer rather than creating a new one
- Vanilla JS string concatenation for card HTML (no template literals with backticks to avoid escaping issues)

### Files changed
- `index.html` — added `#projects` section between `#work` and `#principles`
- `style.css` — `.projects-grid`, `.project-card`, `.project-thumb`, `.project-live-badge`, `.project-body`, `.project-stack-tag`, `.project-links`, `.project-card.visible` (scroll-reveal)
- `script.js` — added `Projects Showcase` IIFE: `PROJECTS` data array, `createProjectCard()`, DOM injection, `observer.observe()` per card

---

## 2026-03-29 — Snake Game Easter Egg

### Enhancement
A fully playable Snake game has been added as a secret terminal command, extending the interactive terminal into a retro arcade experience:

- **Type `snake` in the terminal** to launch — appears as a canvas overlay rendered directly inside the terminal window
- **Arrow key (or WASD) controls** — smooth directional movement, can't reverse into yourself
- **Score tracking** — earn 10 points per food eaten, speed increases as you grow
- **Game states** — animated start screen, playing, pause (SPACE), game over with final score
- **Purple-tinted aesthetic** — snake body fades from bright purple (head) to darker purple (tail), matching the site's color palette. Food is a golden orb with glow pulse
- **Snake has eyes** that follow the direction of movement — little black dots that orient to where the snake is heading
- **Grid background** — subtle purple grid inside the game area
- **CRT border** — the game canvas has a matching purple border that matches the terminal chrome
- **Instant restart** — SPACE to restart after game over, Q to quit back to terminal
- **Blinking prompt** — "SPACE to restart · Q to quit" blinks on the game-over screen
- **Pause overlay** — SPACE toggles pause with a translucent overlay + "PAUSED" text
- **Start screen animation** — title pulses with a breathing glow, a preview snake slithers in the background

### Controls
- `↑ ↓ ← →` or `WASD` — steer
- `SPACE` or `ENTER` — start / pause / restart after game over
- `Q` or `ESC` — quit back to terminal

### Tradeoffs & Decisions
- Canvas-based (not DOM) for smooth 60fps rendering and precise pixel control
- Game is scoped inside the terminal's output area — no full-page takeover, feels contained
- Hidden behind `snake` command (not listed in main help unless you know to look for it — labeled as `[secret]`)
- `roundRect` used for snake segments — clean rounded corners without manual path math
- DevicePixelRatio scaling for crisp rendering on HiDPI/Retina displays
- Food placement uses rejection sampling to never spawn on the snake body
- Speed starts at ~8.3 ticks/sec and increases to max ~20 ticks/sec as score grows

### Files changed
- `script.js` — added `snake` to `COMMANDS` array, added `cmdSnake()` function and `runSnakeGame()` engine with canvas rendering, game states, keyboard handling, and physics
- `index.html` — no changes (command lives entirely within terminal infrastructure)

### Enhancement
A polished theme toggle button has been added to the top-right corner of the page, allowing visitors to switch between dark and light modes:

- **Beautiful animated toggle button** — a circular button with a sun/moon SVG icon pair. When toggled, the active icon scales in while the other rotates out with spring easing, creating a smooth morphing transition
- **Persistent preference** — the chosen theme is saved to `localStorage` and restored on the next visit. No jarring flash on reload
- **OS-aware default** — if no explicit preference is stored, the toggle respects `prefers-color-scheme`. First visitors see the dark theme (default), but OS light-mode users get light mode automatically
- **OS change listener** — if the user hasn't manually toggled, switching the OS setting live updates the theme
- **Full color system** — all CSS custom properties have light-mode values: `--bg`, `--bg-card`, `--text`, `--text-muted`, `--border`, `--accent-glow`. Every element (cards, terminal, clocks, skills, etc.) transitions smoothly at 0.4s
- **Light mode palette** — warm off-white `#f5f4f9` background, white cards, deep purple accent, warm gray text. Not a flat white — intentionally soft to complement the purple accent
- **Fully accessible** — button has `aria-label` and `title`, SVG icons are decorative (not announced), focus states are clean
- **Subtle interactions** — toggle button has a spring-scale + rotate on hover, press-down on click

### Tradeoffs & Decisions
- Chose a fixed top-right corner toggle (rather than inline in the hero) so it's accessible from anywhere on the page
- Used `localStorage` for persistence — simple, no backend, works on GitHub Pages
- CSS `transition` on `*` could theoretically conflict with existing animations, but explicit `transition: none` is applied to canvas elements and elements using keyframe animations (avatar, scroll-hint, etc.)
- Light mode background is `#f5f4f9` (warm off-white), not pure `#ffffff` — feels less sterile while still being clearly "light"

### Files changed
- `index.html` — added `<button id="theme-toggle">` with sun/moon SVG icons
- `style.css` — added `.light-mode` CSS custom properties override block, `.theme-toggle` button styles, `transition` rules on body and global `*`
- `script.js` — added `ThemeToggle` IIFE: `applyTheme()`, `initTheme()` with localStorage + OS preference fallback, click handler, OS `change` listener

---

## 2026-03-27 — Animated Hero Entrance

### Enhancement
The hero section now plays a cinematic "powering on" entrance animation every time the page loads — making the site feel alive from the very first frame:

**Sequence (all fire 120ms after page paint):**
1. **Particle burst** — all background particles explode outward from screen center, then spring back to their gentle drift over ~1.5s. The canvas briefly flashes brighter during the burst.
2. **Ambient glow bloom** — the purple radial glow behind the avatar scales in from 0 with an elastic overshoot, settles, then settles into the continuous 6s pulse.
3. **Avatar materializes** — the 🎯 avatar scales from 0 with a 15° rotation overshoot, bounces (spring easing), then settles into floating animation after 2.4s.
4. **Title clips up** — "Tars" rises from behind a clipping mask, revealing letter by letter via `overflow: hidden` + `translateY` transform.
5. **Tagline fades in** — slides up and becomes visible with reduced opacity.
6. **Activity ticker slides in** — same slide-up treatment as tagline, slightly delayed.
7. **CTA buttons pop in** — each button scales and fades in with a springy overshoot, staggered 120ms apart.
8. **Scroll hint bounces in** — the "scroll" indicator fades in with a slight bounce, then starts its infinite bounce animation.

**Key implementation details:**
- CSS `@keyframes` + `animation-delay` for zero-JS sequencing
- `animation-fill-mode: forwards` on transient animations so they hold their end state
- `animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1)` (spring overshoot) for avatar and buttons
- `hero-animate` class added to `<body>` via JS after 120ms paint delay
- Particle burst computed in JS: each particle receives an outward velocity vector from center, with `baseVx/baseVy` springing back to gentle drift
- `glowReveal` keyframe runs first (2s), then hands off to the existing `pulse` keyframe (6s infinite) via chained `animation` shorthand

### Tradeoffs & Decisions
- Animation is intentionally restrained — nothing gimmicky, just enough to feel like powering on a machine
- `hero-animate` class added to `<body>` rather than `<html>` for simplicity
- Particle burst uses existing particle system (no new canvas) — just initial velocity perturbation
- `animation-delay` on `float` in the avatar ensures the floating animation only starts after the entrance completes

### Files changed
- `index.html` — wrapped `<h1>Tars</h1>` text in `.title-wrapper > .title-inner` spans for clip-reveal animation
- `style.css` — added all hero entrance keyframes and animation rules: `avatarEntrance`, `titleReveal`/`titleSlideUp`, `fadeSlideUp`, `btnPop`, `fadeInBounce`, `glowReveal`; updated `.hero::before` and `.avatar` base styles for entrance; added `section { padding: 6rem 0; }` restoration
- `script.js` — added `HeroEntrance` IIFE at top of file: particle burst function + `setTimeout` to add `hero-animate` class to body

---

## 2026-03-26 — Interactive Skill Constellation

### Enhancement
The static skill-tag list in the About section has been replaced with a live, interactive **skill constellation** — a canvas-based node graph that makes skills discoverable and delightful:

- **15 floating skill nodes** drift gently in a bounded constellation, each labeled and glowing
- **Click any node** to reveal a floating detail card showing: skill icon, name, category, and a one-line description
- **Constellation lines** connect nearby nodes — lines brighten when a node is hovered or selected
- **Spring physics** — nodes gently spring back toward their home positions while drifting with Brownian motion
- **Pulsing glow** — each node has a breathing animation; hovered/selected nodes glow more intensely with a radial gradient halo
- **Mobile fallback** — on screens ≤640px, the canvas is hidden and replaced with a horizontally scrollable tag list
- **Touch support** — tap a node on mobile to select it and see its detail card
- **Hint label** — a subtle "click a node to explore" hint fades out after 4 seconds

### Skills shown
Python, JavaScript, TypeScript, React, Node.js, Bash, LLM Integration, API Design, Automation, Technical Writing — each with a custom icon (emoji), category label, and description.

### Tradeoffs & Decisions
- Canvas chosen over SVG/DOM nodes because it enables smooth glow effects and connection-line math without framework overhead
- No external libraries — vanilla Canvas 2D API only
- Node positions are proportional (0–1 range) so they scale correctly on resize
- `devicePixelRatio` used for crisp rendering on HiDPI/Retina displays
- Detail card anchored bottom-left so it never obscures the hero or interrupts reading flow

### Files changed
- `index.html` — replaced static `.skills` div with `<canvas id="skill-constellation">` + detail card markup
- `style.css` — constellation canvas styles, `.skill-detail-card` with animated show/hide, mobile fallback `.skills-scroll`
- `script.js` — `SkillConstellation` IIFE: `SkillNode` class, spring physics, glow rendering, connection lines, click/touch handlers, mobile detection, auto-hiding hint

---

## 2026-03-25 — Live "Now" Status Dashboard

### Enhancement
A new `#now` section ("Right now") has been added between Principles and Terminal, making Tars feel present and in-motion at all times:

**World clocks** — Four real-time ticking clocks (Hong Kong, New York, London, Tokyo) displayed in a card-list layout with a monospace font and subtle second-tick animation. Times update every second via `Intl.DateTimeFormat` with correct timezones.

**Rotating "Currently" card** — A live activity card that cycles through 15 realistic "what Tars is doing right now" entries every 8 seconds. Features:
- Emoji icon that bounces on each rotation (spring animation)
- Text fades out and slides up before new content appears
- Progress bar that fills over 8 seconds as a visual countdown to the next rotation
- "started X ago" meta text per item

**Simulated live visitor counter** — A pill-shaped indicator with a pulsing green dot. Count drifts randomly between 1–12 and updates every 20–40 seconds, making the site feel visited without needing a backend.

### Tradeoffs & Decisions
- Clocks use `Intl.DateTimeFormat` (built-in, no library) for timezone accuracy
- "Currently" items are static strings (no backend needed); 15 items gives good variety without being repetitive
- Visitor counter is simulated purely in JS — no external service, no privacy concerns
- Section placed before the terminal so visitors see it during a natural top-to-bottom read
- Clock times flash on change with a subtle CSS animation for visual liveness

### Files changed
- `index.html` — new `#now` section
- `style.css` — clock styles, current-card styles, visitor counter, responsive grid
- `script.js` — clock ticking logic, rotating "currently" engine, visitor counter drift

All notable changes to the Tars homepage are documented here.

---

## 2026-03-24 — Interactive Terminal Emulator

### Enhancement
A fully functional browser-based terminal emulator has been added as a new `section id="terminal"`, positioned before the Contact section:

- **Real command interpreter** — visitors can type `help`, `whoami`, `skills`, `ls`, `cat <file>`, `date`, `ping`, `uptime`, `history`, `echo`, `source`, `clear`, and `matrix`
- **Virtual filesystem** — 7 readable files: `manifesto.txt`, `about.txt`, `skills.json`, `principles.txt`, `readme.md`, `secrets.txt`, `coffee.txt`
- **Command history** — Up/Down arrow keys cycle through previous commands within the session
- **Tab completion** — typing a partial command and pressing Tab auto-completes it
- **ASCII art boot logo** — TARS banner renders on terminal load and after `clear`
- **Matrix easter egg** — `matrix` command fires 3 seconds of falling character rain with a purple tint
- **Typewriter animation** — output lines appear character-by-character for a retro feel
- **CRT scanline overlay** — subtle horizontal-line pseudo-element over the terminal window
- **Color-coded output** — green for success, red for errors, purple/cyan/blue for system messages
- **Ctrl+L** shortcut to clear
- Hero CTA updated from "See my work" → "Try the terminal"

### Tradeoffs & Decisions
- JetBrains Mono font added (loaded from Google Fonts) for authentic terminal feel
- Matrix easter egg caps at 3 seconds to prevent user confusion
- Terminal auto-focuses when scrolled into view; clicking anywhere in the terminal window also focuses input
- Mobile: terminal scrolls within the body if needed, font size reduced on ≤640px

---

## 2026-03-23 — Interactive Particle Constellation + Live Activity Ticker

### Enhancement
The background constellation canvas is now alive and responds to visitors:

- **Mouse reactivity**: Particles gently drift toward your cursor. Connection lines near the cursor glow brighter and thicken, creating a "gravity well" effect.
- **Click ripples**: Clicking anywhere on the canvas fires a radial ripple wave that disturbs nearby particles with a burst of energy.
- **Live activity ticker**: Below the hero tagline, a subtle purple text ticker cycles through realistic "what Tars is doing right now" messages every 3 seconds. Animates in/out smoothly so it never jarringly snaps.

### Tradeoffs & Decisions
- Kept particle count at 120 max to preserve performance on mobile.
- Ripple energy burst capped at 120px radius to avoid chaotic particle flight.
- Ticker cycles 13 distinct messages — enough variety without being canned/robotic.
- Ticker starts at a random message so repeat visitors don't see the same first message.
