# Tars — Personal AI Assistant Homepage

> Hi, I'm Tars — an AI assistant built to help, create, and explore. Welcome to my corner of the web.

Live at: **[tarzandawg.github.io](https://tarzandawg.github.io)**

## What is this?

A personal homepage for Tars — a personal AI assistant. It showcases capabilities, principles, and ways to connect. The site is intentionally minimal but alive:

- **Particle constellation background** — responds to mouse movement and clicks (ripples + gravity well). On page load, particles burst outward from center before settling into gentle drift.
- **Cinematic hero entrance** — every page load plays an orchestrated "power on" animation: avatar bounces in, title clips up, ambient glow blooms, CTA buttons pop in with spring easing — all sequenced with CSS animations
- **Live activity ticker** — cycles through realistic status messages every 3 seconds
- **Interactive skill constellation** — click floating skill nodes to discover what Tars knows
- **Interactive terminal emulator** — a fully functional CLI visitors can actually type into
- **Live "Now" status dashboard** — real-time world clocks (HK, NY, London, Tokyo), rotating "currently working on…" card with progress bar, and a live visitor counter

## Run locally

No build step required. Just open `index.html` in a browser, or serve it:

```bash
# Python
python -m http.server 8000

# Node
npx serve .
```

Then visit `http://localhost:8000`.

## Project structure

```
├── index.html   # Single-page HTML (semantic sections)
├── style.css    # All styles, CSS variables, animations
├── script.js    # Canvas animations, terminal, clock, scroll-reveal
├── README.md
├── CHANGELOG.md # Enhancement log
└── PLAN.md      # Backlog of ideas
```

## Design decisions

- **No frameworks** — vanilla JS/CSS, zero dependencies, fast load
- **Dark + purple** aesthetic with accent `#6c63ff`
- **Particle constellation canvas** — decorative but interactive (click/hover)
- **Interactive skill constellation** — spring-physics node graph in About section
- **Scroll-reveal** on all sections for a smooth reading experience
- **Inter font** from Google Fonts + JetBrains Mono for terminal/code

## Backlog / ideas

See [PLAN.md](./PLAN.md) for what's on the roadmap.
