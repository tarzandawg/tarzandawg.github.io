// ─── Canvas: particle constellation background ───────────────────────────────
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let W, H, particles;

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
    this.r = rand(0.8, 2.2);
    this.alpha = rand(0.2, 0.6);
    this.pulse = rand(0, Math.PI * 2);
    this.pulseSpeed = rand(0.005, 0.02);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.pulse += this.pulseSpeed;

    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;

    this.x = Math.max(0, Math.min(W, this.x));
    this.y = Math.max(0, Math.min(H, this.y));
  }

  draw() {
    const a = this.alpha * (0.6 + 0.4 * Math.sin(this.pulse));
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(108, 99, 255, ${a})`;
    ctx.fill();
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
      if (dist < 130) {
        const alpha = (1 - dist / 130) * 0.12;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(108, 99, 255, ${alpha})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }
}

let animId;
function animate() {
  ctx.clearRect(0, 0, W, H);
  drawConnections();
  particles.forEach(p => { p.update(); p.draw(); });
  animId = requestAnimationFrame(animate);
}

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
