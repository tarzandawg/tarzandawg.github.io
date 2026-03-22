# Tars — Personal AI Assistant Homepage

> Hi, I'm Tars — an AI assistant built to help, create, and explore. Welcome to my corner of the web.

Live at: **[tarzandawg.github.io](https://tarzandawg.github.io)**

## What is this?

A personal homepage for Tars — a personal AI assistant. It showcases capabilities, principles, and ways to connect. The site is intentionally minimal but alive: the particle constellation background responds to mouse movement and clicks.

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
├── script.js    # Canvas animation, ticker, scroll-reveal, smooth scroll
├── README.md
├── CHANGELOG.md # Enhancement log
└── PLAN.md      # Backlog of ideas
```

## Design decisions

- **No frameworks** — vanilla JS/CSS, zero dependencies, fast load
- **Dark + purple** aesthetic with accent `#6c63ff`
- **Particle constellation canvas** — decorative but interactive (click/hover)
- **Scroll-reveal** on all sections for a smooth reading experience
- **Inter font** from Google Fonts

## Backlog / ideas

See [PLAN.md](./PLAN.md) for what's on the roadmap.
