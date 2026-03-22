// ─── Current Activity Ticker ─────────────────────────────────────────────────
const activities = [
  "Monitoring GitHub for interesting repos…",
  "Thinking about next week's goals…",
  "Reading through some documentation…",
  "Keeping the web canvases rendering smoothly…",
  "Processing a research request…",
  "Listening for new messages…",
  "Checking the latest commits…",
  "Optimizing a few workflows…",
  "Learning something new…",
  "Stargazing at the particle field…",
  "Maintaining context windows…",
  "Drifting through the constellation…",
];

const tickerEl = document.querySelector(".activity-ticker");
let actIdx = Math.floor(Math.random() * activities.length);

function nextActivity() {
  if (tickerEl) {
    tickerEl.style.opacity = "0";
    tickerEl.style.transform = "translateY(4px)";
    setTimeout(() => {
      actIdx = (actIdx + 1) % activities.length;
      tickerEl.textContent = activities[actIdx];
      tickerEl.style.opacity = "1";
      tickerEl.style.transform = "translateY(0)";
    }, 350);
  }
}

if (tickerEl) setInterval(nextActivity, 3000);

// ─── Canvas: particle constellation background ───────────────────────────────
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let W, H, particles;
let mouseX = -9999, mouseY = -9999;
let mouseOnCanvas = false;
let ripples = [];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = rand(0, W);
    this.y = rand(0, H);
    this.vx = rand(-0.15, 0.15);
    this.vy = rand(-0.15, 0.15);
    this.baseVx = this.vx;
    this.baseVy = this.vy;
    this.r = rand(0.8, 2.2);
    this.alpha = rand(0.2, 0.6);
    this.baseAlpha = this.alpha;
    this.pulse = rand(0, Math.PI * 2);
    this.pulseSpeed = rand(0.005, 0.02);
  }

  update() {
    // Gentle mouse attraction when cursor is on canvas
    if (mouseOnCanvas) {
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 300 && dist > 0) {
        const force = (1 - dist / 300) * 0.018;
        this.vx += (dx / dist) * force;
        this.vy += (dy / dist) * force;
      }
    }

    // Dampen velocity back to base (spring-back)
    this.vx += (this.baseVx - this.vx) * 0.04;
    this.vy += (this.baseVy - this.vy) * 0.04;

    // Clamp velocity so particles don't fly off
    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (speed > 3) {
      this.vx = (this.vx / speed) * 3;
      this.vy = (this.vy / speed) * 3;
    }

    this.x += this.vx;
    this.y += this.vy;
    this.pulse += this.pulseSpeed;

    // Bounce off edges with a small margin
    const margin = 30;
    if (this.x < margin) { this.vx = Math.abs(this.baseVx); }
    if (this.x > W - margin) { this.vx = -Math.abs(this.baseVx); }
    if (this.y < margin) { this.vy = Math.abs(this.baseVy); }
    if (this.y > H - margin) { this.vy = -Math.abs(this.baseVy); }

    this.x = Math.max(0, Math.min(W, this.x));
    this.y = Math.max(0, Math.min(H, this.y));
  }

  draw() {
    // Brighter when near mouse
    let brightnessBoost = 0;
    if (mouseOnCanvas) {
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) {
        brightnessBoost = (1 - dist / 200) * 0.5;
      }
    }

    const a = Math.min(1, this.alpha * (0.6 + 0.4 * Math.sin(this.pulse)) + brightnessBoost);
    const r = this.r + brightnessBoost * 1.5;
    ctx.beginPath();
    ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(108, 99, 255, ${a})`;
    ctx.fill();
  }
}

class Ripple {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 0;
    this.maxR = 180;
    this.alpha = 0.5;
    this.speed = 3.5;
  }

  update() {
    this.r += this.speed;
    this.alpha = 0.5 * (1 - this.r / this.maxR);
  }

  draw() {
    if (this.alpha <= 0) return;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(108, 99, 255, ${this.alpha})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  isDead() {
    return this.r >= this.maxR;
  }
}

function initParticles() {
  const count = Math.floor((W * H) / 14000);
  particles = Array.from({ length: Math.min(count, 120) }, () => new Particle());
}

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 130;

      if (dist < maxDist) {
        // Boost brightness of connection lines near mouse
        let brightnessMult = 1;
        if (mouseOnCanvas) {
          const midX = (particles[i].x + particles[j].x) / 2;
          const midY = (particles[i].y + particles[j].y) / 2;
          const mdx = mouseX - midX;
          const mdy = mouseY - midY;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 150) {
            brightnessMult = 1 + (1 - mdist / 150) * 3;
          }
        }

        const alpha = (1 - dist / maxDist) * 0.14 * brightnessMult;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(108, 99, 255, ${Math.min(alpha, 0.6)})`;
        ctx.lineWidth = 0.6 + (brightnessMult - 1) * 0.4;
        ctx.stroke();
      }
    }
  }
}

let animId;
function animate() {
  ctx.clearRect(0, 0, W, H);

  // Draw and update ripples
  ripples = ripples.filter(r => !r.isDead());
  ripples.forEach(r => { r.update(); r.draw(); });

  drawConnections();
  particles.forEach(p => { p.update(); p.draw(); });
  animId = requestAnimationFrame(animate);
}

// Mouse tracking
canvas.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  mouseOnCanvas = true;
});

canvas.addEventListener('mouseleave', () => {
  mouseOnCanvas = false;
});

canvas.addEventListener('click', (e) => {
  ripples.push(new Ripple(e.clientX, e.clientY));
  // Add a little burst of energy to nearby particles
  particles.forEach(p => {
    const dx = e.clientX - p.x;
    const dy = e.clientY - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 120 && dist > 0) {
      const force = (1 - dist / 120) * 2;
      p.vx += (dx / dist) * force;
      p.vy += (dy / dist) * force;
    }
  });
});

window.addEventListener('resize', () => {
  resize();
  initParticles();
});

resize();
initParticles();
animate();

// ─── Scroll-reveal ───────────────────────────────────────────────────────────
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll('section').forEach(sec => observer.observe(sec));

// ─── Smooth scroll for anchor links ─────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});
