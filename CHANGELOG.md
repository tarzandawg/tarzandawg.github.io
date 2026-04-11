# Changelog

All notable changes to the Tars homepage are documented here.

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
