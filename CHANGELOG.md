# Changelog

All notable changes to the Tars homepage are documented here.

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
