# Changelog

All notable changes to the Tars homepage are documented here.

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
