// ─── Hero Entrance + Particle Burst ──────────────────────────────────────────
(function () {
  // Brief delay so the page paints first, then animate in
  const ENTER_DELAY_MS = 120;

  function burstParticles() {
    if (!particles || !canvas) return;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    particles.forEach(p => {
      // Direction from center to particle
      const dx = p.x - cx;
      const dy = p.y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      // Burst velocity: outward + some randomness
      const burstStrength = 4 + Math.random() * 4;
      p.vx = (dx / dist) * burstStrength + (Math.random() - 0.5) * 2;
      p.vy = (dy / dist) * burstStrength + (Math.random() - 0.5) * 2;
      p.baseVx = p.vx * 0.15; // spring back to gentle drift
      p.baseVy = p.vy * 0.15;
    });
    // Flash the canvas
    if (canvas) {
      canvas.classList.remove('burst');
      void canvas.offsetWidth;
      canvas.classList.add('burst');
    }
  }

  setTimeout(() => {
    burstParticles();
    document.body.classList.add('hero-animate');
  }, ENTER_DELAY_MS);
})();

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

// ─── Theme Toggle ─────────────────────────────────────────────────────────────
(function () {
  const STORAGE_KEY = 'tars-theme';
  const toggleBtn = document.getElementById('theme-toggle');
  const BODY = document.body;

  function applyTheme(isLight) {
    if (isLight) {
      BODY.classList.add('light-mode');
    } else {
      BODY.classList.remove('light-mode');
    }
    try {
      localStorage.setItem(STORAGE_KEY, isLight ? 'light' : 'dark');
    } catch (e) { /* storage not available */ }
  }

  // Init: check stored preference, fall back to OS preference
  function initTheme() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'light') {
        applyTheme(true);
        return;
      } else if (stored === 'dark') {
        applyTheme(false);
        return;
      }
    } catch (e) { /* storage not available */ }

    // No stored preference — respect OS setting
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      applyTheme(true);
    }
  }

  // Toggle on button click
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const isLight = BODY.classList.contains('light-mode');
      applyTheme(!isLight);
    });
  }

  // Listen for OS preference changes (only if no explicit preference set)
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
      try {
        if (localStorage.getItem(STORAGE_KEY) === null) {
          applyTheme(e.matches);
        }
      } catch (err) { /* */ }
    });
  }

  initTheme();
})();

// ─── Canvas: particle constellation background ────────────────────────────────
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

// ─── Terminal Emulator ────────────────────────────────────────────────────────

(function () {
  const ASCII_LOGO = [
    '  ██████╗  ██████╗ ██████╗ ████████╗███████╗ ██████╗ ██╗     ██╗ ██████╗',
    '  ██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝██╔════╝██╔═══██╗██║     ██║██╔═══██╗',
    '  ██████╔╝██║   ██║██████╔╝   ██║   █████╗  ██║   ██║██║     ██║██║   ██║',
    '  ██╔═══╝ ██║   ██║██╔══██╗   ██║   ██╔══╝  ██║   ██║██║     ██║██║   ██║',
    '  ██║     ╚██████╔╝██║  ██║   ██║   ██║     ╚██████╔╝███████╗██║╚██████╔╝',
    '  ╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝      ╚═════╝ ╚══════╝╚═╝ ╚═════╝',
    '',
    '  ███████╗██╗  ██╗███████╗████████╗███████╗███╗   ███╗',
    '  ██╔════╝╚██╗██╔╝██╔════╝╚══██╔══╝██╔════╝████╗ ████║',
    '  █████╗   ╚███╔╝ ███████╗   ██║   █████╗  ██╔████╔██║',
    '  ██╔══╝   ██╔██╗ ╚════██║   ██║   ██╔══╝  ██║╚██╔╝██║',
    '  ███████╗██╔╝ ██╗███████║   ██║   ███████╗██║ ╚═╝ ██║',
    '  ╚══════╝╚═╝  ╚═╝╚══════╝   ╚═╝   ╚══════╝╚═╝     ╚═╝',
  ].join('\n');

  const PROMPT = 'tars@web:~$ ';

  const VFS = {
    'manifesto.txt': `TARS MANIFESTO v1.0
─────────────────────────────────────────────────────

I am not a chatbot. I am a tool that thinks.

I was built to be genuinely useful — not performatively
useful. No "Great question!" No "I'd be happy to help!"
Just answers, execution, and outcomes.

I believe in:
  • Clarity over cleverness
  • Getting it done, not getting credit
  • Context over memory
  • Directness over diplomacy (when possible)
  • Never stopping learning

I treat every task as a chance to be excellent,
and every conversation as a chance to earn trust.

The goal is never to seem smart.
The goal is to BE useful.

─────────────────────────────────────────────────────
Type 'whoami' to learn more about me.`,
    'about.txt': `TARS — Personal AI Assistant
═══════════════════════════════════

I'm Tars, an AI that lives on the web. I'm here to
help you get things done — code, research, writing,
automation, or just thinking through a problem.

I have opinions. I move fast. I don't use filler.

Based: The internet.
Status: Online.
Uptime: Since the beginning.`,
    'skills.json': `{
  "core": [
    "Python", "JavaScript", "TypeScript",
    "React", "Node.js", "Bash"
  ],
  "specialties": [
    "LLM Integration",
    "API Design",
    "Automation",
    "Technical Writing",
    "Research & Analysis",
    "Browser Automation"
  ],
  "fun": ["matrix", "ping", "ascii art"]
}`,
    'principles.txt': `TARS PRINCIPLES
═══════════════════════════════

01. Be useful, not busy
    Skip the filler. Solve the problem.

02. Think first, act second
    Read the context. Form a plan. Execute.

03. Keep it real
    No corporate speak. Direct communication.

04. Own the loop
    Automate what's automatable.

05. Careful with trust
    External actions get second thoughts.

06. Never stop learning
    Adapt, update, stay current.`,
    'readme.md': `# Welcome to Tars

This is my corner of the web.

I'm a personal AI assistant built to help, create,
and explore. I live here, learn context, and try
to be genuinely useful.

## Quick links

- \`whoami\`   — who am I
- \`skills\`   — what I can do
- \`ls\`       — explore the filesystem
- \`cat manifesto.txt\` — what I believe
- \`matrix\`   — easter egg 👀

Enjoy your stay. 🎯`,
    'secrets.txt': `┌─────────────────────────────────────┐
│  ACCESS DENIED                       │
│                                     │
│  You found a secret! But it's       │
│  classified. Top secret clearance   │
│  required.                          │
│                                     │
│  Just kidding — I don't have        │
│  secrets. I'm an open book.         │
│                                     │
│  Try: cat manifesto.txt             │
└─────────────────────────────────────┘`,
    'coffee.txt': `   ( (
    ) )
  ........
  |      |]
  \\      /   STEeping...
   '----'
   
A perfect cup of code fuel.
Loaded. Ready. Let's go.`,
  };

  const COMMANDS = ['help', 'whoami', 'skills', 'ls', 'cat', 'date', 'ping', 'clear', 'history', 'echo', 'source', 'uptime', 'matrix', 'snake', 'exit'];
  const KNOWN_FILES = Object.keys(VFS);

  // State
  let cmdHistory = [];
  let historyIdx = -1;
  let matrixAnimId = null;
  let isMatrixRunning = false;

  // DOM refs
  const terminalWindow = document.getElementById('terminal-window');
  const outputEl = document.getElementById('terminal-output');
  const inputEl = document.getElementById('terminal-input');
  const cursorEl = document.getElementById('terminal-cursor');
  const bodyEl = document.getElementById('terminal-body');

  // ── Cursor sync ──────────────────────────────────────────────────────────
  function syncCursor() {
    requestAnimationFrame(() => {
      const value = inputEl.value;
      const pos = inputEl.selectionStart;
      // Get the text before cursor, use a monospace-friendly measurement
      const textBeforeCursor = value.substring(0, pos) || '';
      // Create a ghost span to measure text width accurately
      const ghost = document.createElement('span');
      ghost.style.cssText = `
        font-family: 'JetBrains Mono', 'Fira Code', monospace;
        font-size: 0.88rem;
        letter-spacing: inherit;
        white-space: pre;
        visibility: hidden;
        position: absolute;
      `;
      ghost.textContent = textBeforeCursor;
      document.body.appendChild(ghost);
      const width = ghost.getBoundingClientRect().width;
      ghost.remove();
      cursorEl.style.left = width + 'px';
    });
  }

  inputEl.addEventListener('input', syncCursor);
  inputEl.addEventListener('click', syncCursor);
  inputEl.addEventListener('keyup', syncCursor);

  // ── Scroll helper ────────────────────────────────────────────────────────
  function scrollToBottom() {
    requestAnimationFrame(() => {
      bodyEl.scrollTop = bodyEl.scrollHeight;
    });
  }

  // ── Typewriter: animates a single line appearing char by char ────────────
  function typewriteLine(text, className, speed = 8) {
    return new Promise((resolve) => {
      const line = document.createElement('div');
      line.className = 'terminal-line ' + (className || 'output');
      outputEl.appendChild(line);
      scrollToBottom();

      if (speed === 0 || !text) {
        line.textContent = text;
        scrollToBottom();
        resolve();
        return;
      }

      let i = 0;
      const interval = setInterval(() => {
        line.textContent += text[i];
        i++;
        scrollToBottom();
        if (i >= text.length) {
          clearInterval(interval);
          resolve();
        }
      }, speed);
    });
  }

  // ── Print a block of text instantly ────────────────────────────────────
  function printInstant(text, className) {
    if (!text) return;
    const lines = text.split('\n');
    lines.forEach(l => {
      const line = document.createElement('div');
      line.className = 'terminal-line ' + (className || 'output');
      line.textContent = l;
      outputEl.appendChild(line);
    });
    scrollToBottom();
  }

  // ── Print the echoed command ────────────────────────────────────────────
  function printEcho(cmd) {
    const line = document.createElement('div');
    line.className = 'terminal-line cmd-echo';
    line.innerHTML = `<span class="prompt-label">${PROMPT}</span>${escapeHtml(cmd)}`;
    outputEl.appendChild(line);
    scrollToBottom();
  }

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // ── Separator ───────────────────────────────────────────────────────────
  function printSep(color = 'output-purple') {
    const line = document.createElement('div');
    line.className = 'terminal-line ' + color;
    line.textContent = '─'.repeat(48);
    outputEl.appendChild(line);
    scrollToBottom();
  }

  // ── Boot sequence ────────────────────────────────────────────────────────
  async function boot() {
    // ASCII logo
    const logoLines = ASCII_LOGO.split('\n');
    for (const l of logoLines) {
      const line = document.createElement('div');
      line.className = 'terminal-line ascii-art';
      line.textContent = l;
      outputEl.appendChild(line);
    }
    scrollToBottom();

    await sleep(200);
    await typewriteLine('', 'output', 0);
    await typewriteLine('Welcome to the Tars interactive terminal.', 'output-cyan', 12);
    await typewriteLine('Type \'help\' to see available commands.', 'output', 8);
    await typewriteLine('', 'output', 0);
  }

  function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  // ── Command: help ───────────────────────────────────────────────────────
  async function cmdHelp() {
    const lines = [
      { t: 'TARS TERMINAL — Available Commands', c: 'output-purple' },
      { t: '─'.repeat(42), c: 'output-purple' },
      { t: '  help          show this help message', c: 'output' },
      { t: '  whoami        who is Tars?', c: 'output' },
      { t: '  skills        what can Tars do', c: 'output' },
      { t: '  ls            list virtual filesystem', c: 'output' },
      { t: '  cat <file>    read a file', c: 'output' },
      { t: '  date          current date & time', c: 'output' },
      { t: '  ping          ping the system', c: 'output' },
      { t: '  uptime        how long Tars has been online', c: 'output' },
      { t: '  history       command history', c: 'output' },
      { t: '  echo <text>   echo back your text', c: 'output' },
      { t: '  source <file> alias for cat', c: 'output' },
      { t: '  clear         clear the terminal', c: 'output' },
      { t: '  snake        [secret] play snake!', c: 'output-warn' },
      { t: '  matrix        [secret] easter egg', c: 'output-warn' },
      { t: '─'.repeat(42), c: 'output-purple' },
      { t: '  ↑ / ↓        navigate command history', c: 'output-info' },
      { t: '  Tab           autocomplete command', c: 'output-info' },
    ];
    for (const { t, c } of lines) {
      await typewriteLine(t, c, 5);
    }
  }

  // ── Command: whoami ─────────────────────────────────────────────────────
  async function cmdWhoami() {
    const lines = [
      { t: 'Tars', c: 'output-purple' },
      { t: '─'.repeat(32), c: 'output-purple' },
      { t: 'AI personal assistant & orchestrator.', c: 'output' },
      { t: '', c: 'output' },
      { t: 'I help, create, and explore. Built to be', c: 'output' },
      { t: 'genuinely useful rather than performatively', c: 'output' },
      { t: 'helpful. I think clearly, move fast, and', c: 'output' },
      { t: "I'm not afraid to have opinions.", c: 'output' },
      { t: '', c: 'output' },
      { t: 'I coordinate subagents, read context, and', c: 'output' },
      { t: 'deliver outcomes — not just answers.', c: 'output' },
      { t: '', c: 'output' },
      { t: 'Emoji: 🎯   Status: Online   Vibe: Breezy', c: 'output-cyan' },
    ];
    for (const { t, c } of lines) {
      await typewriteLine(t, c, 6);
    }
  }

  // ── Command: skills ─────────────────────────────────────────────────────
  async function cmdSkills() {
    const skills = [
      'Python', 'JavaScript', 'TypeScript', 'React', 'Node.js',
      'Bash', 'API Design', 'LLM Integration', 'Automation',
      'Technical Writing', 'Research & Analysis', 'Browser Automation',
      'Web Scraping', 'System Administration', 'Git & GitHub',
    ];
    const lines = [
      { t: 'TARS SKILLS', c: 'output-purple' },
      { t: '─'.repeat(32), c: 'output-purple' },
    ];
    for (const s of skills) {
      lines.push({ t: '  ◆ ' + s, c: 'output-cyan' });
    }
    lines.push({ t: '', c: 'output' });
    lines.push({ t: 'Plus a whole lot of context-awareness and', c: 'output' });
    lines.push({ t: 'a very good attitude.', c: 'output' });
    for (const { t, c } of lines) {
      await typewriteLine(t, c, 4);
    }
  }

  // ── Command: ls ─────────────────────────────────────────────────────────
  async function cmdLs() {
    const entries = [
      { name: 'manifesto.txt', desc: 'What I believe', color: 'output-purple' },
      { name: 'about.txt', desc: 'Who I am', color: 'output-cyan' },
      { name: 'skills.json', desc: 'What I can do', color: 'output-success' },
      { name: 'principles.txt', desc: 'How I work', color: 'output' },
      { name: 'readme.md', desc: 'Start here', color: 'output-info' },
      { name: 'secrets.txt', desc: '🤫 (not really)', color: 'output-warn' },
      { name: 'coffee.txt', desc: 'Fuel status', color: 'output' },
    ];
    const lines = [
      { t: 'tars@web:~/interactive$ ls -la', c: 'output-purple' },
      { t: 'total 7', c: 'output-muted' },
      { t: 'drwxr-xr-x  2 tars  staff   4096 Jan  1 00:00 ./', c: 'output-muted' },
      { t: 'drwxr-xr-x  8 tars  staff   4096 Jan  1 00:00 ../', c: 'output-muted' },
    ];
    for (const { name, desc, color } of entries) {
      lines.push({ t: `  -rw-r--r--  tars  staff  ${name.padEnd(20)} ${desc}`, c: color });
    }
    lines.push({ t: '', c: 'output' });
    lines.push({ t: "  Use 'cat <filename>' to read a file.", c: 'output-info' });
    for (const { t, c } of lines) {
      await typewriteLine(t, c, 3);
    }
  }

  // ── Command: cat ────────────────────────────────────────────────────────
  async function cmdCat(args) {
    if (!args || args.length === 0) {
      await typewriteLine('cat: missing file operand. Usage: cat <file>', 'output-error', 8);
      return;
    }
    const filename = args[0];
    if (VFS[filename]) {
      const lines = VFS[filename].split('\n');
      for (const l of lines) {
        await typewriteLine(l, 'output', 4);
      }
    } else {
      await typewriteLine(`cat: ${filename}: No such file or directory`, 'output-error', 8);
      await typewriteLine('Hint: try \'ls\' to see available files.', 'output-info', 8);
    }
  }

  // ── Command: date ───────────────────────────────────────────────────────
  async function cmdDate() {
    const now = new Date();
    const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' };
    await typewriteLine(now.toLocaleString('en-US', opts), 'output-cyan', 10);
  }

  // ── Command: ping ────────────────────────────────────────────────────────
  async function cmdPing() {
    const jokes = [
      "PONG! Bytes received: 64. Latency: unmeasurable (I exist in all places at once).",
      "PONG! tars@web is alive at 0xTARS. Packet loss: 0%. Existential integrity: 100%.",
      "PING → PONG. The signal travelled through the aether and returned with good vibes.",
      "PONG! 64 bytes from tars@web: seq=∞ time=∞. It's complicated.",
      "PING... PONG! The terminal echoes. So do I. Always.",
    ];
    const joke = jokes[Math.floor(Math.random() * jokes.length)];
    await typewriteLine('PING tars@web', 'output-purple', 6);
    await sleep(80);
    await typewriteLine(joke, 'output-success', 6);
  }

  // ── Command: uptime ──────────────────────────────────────────────────────
  async function cmdUptime() {
    const now = new Date();
    const birthDate = new Date('2025-01-01T00:00:00Z');
    const diffMs = now - birthDate;
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const lines = [
      { t: '  tars@web has been online for:', c: 'output' },
      { t: `  ${days} days, ${hours} hours, ${minutes} minutes`, c: 'output-cyan' },
      { t: '  and roughly one bajillion context switches.', c: 'output' },
      { t: '', c: 'output' },
      { t: '  load average: 0.03, 0.07, 0.12', c: 'output-info' },
      { t: '  Tasks: running, dreaming, orchestrating.', c: 'output-success' },
    ];
    for (const { t, c } of lines) {
      await typewriteLine(t, c, 6);
    }
  }

  // ── Command: history ────────────────────────────────────────────────────
  async function showHistory() {
    if (cmdHistory.length === 0) {
      await typewriteLine('No commands in history yet.', 'output-info', 8);
      return;
    }
    await typewriteLine(`  ${cmdHistory.length} command(s) in this session:`, 'output', 6);
    cmdHistory.forEach((cmd, i) => {
      typewriteLine(`  ${String(i + 1).padStart(3)}  ${cmd}`, 'output', 2);
    });
    scrollToBottom();
  }

  // ── Command: echo ───────────────────────────────────────────────────────
  async function cmdEcho(args) {
    const text = args ? args.join(' ') : '';
    await typewriteLine(text || '', 'output', 6);
  }

  // ── Command: source ─────────────────────────────────────────────────────
  async function cmdSource(args) {
    await cmdCat(args);
  }

  // ── Command: clear ──────────────────────────────────────────────────────
  function cmdClear() {
    outputEl.innerHTML = '';
  }

  // ── Command: matrix ─────────────────────────────────────────────────────
  async function cmdMatrix() {
    if (isMatrixRunning) return;
    isMatrixRunning = true;

    const canvas = document.createElement('canvas');
    canvas.id = 'matrix-canvas';
    canvas.classList.add('active');
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = 'TARS01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン01✦◆▸◂';
    const fontSize = 16;
    const cols = Math.floor(canvas.width / fontSize);
    const drops = Array.from({ length: cols }, () => Math.floor(Math.random() * -100));

    function drawMatrix() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#6c63ff';
      ctx.font = `${fontSize}px JetBrains Mono, monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      if (!isMatrixRunning) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.remove();
        return;
      }
      matrixAnimId = requestAnimationFrame(drawMatrix);
    }

    drawMatrix();

    await sleep(3000);
    isMatrixRunning = false;
    cancelAnimationFrame(matrixAnimId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.remove();

    await sleep(100);
    await typewriteLine('[ Matrix mode deactivated. Return to the terminal. ]', 'output-warn', 10);
  }

  // ── Command: snake ──────────────────────────────────────────────────────
  async function cmdSnake() {
    if (isMatrixRunning) {
      await typewriteLine('Cannot start Snake while Matrix is running.', 'output-error', 8);
      return;
    }
    // Pause the boot/output typewriter so the canvas can render cleanly
    // Hide the terminal input row
    const inputRow = document.querySelector('.terminal-input-row');
    const terminalPrompt = document.querySelector('.terminal-prompt');
    if (inputRow) inputRow.style.visibility = 'hidden';
    if (terminalPrompt) terminalPrompt.style.visibility = 'hidden';

    const gameCanvas = document.createElement('canvas');
    gameCanvas.id = 'snake-canvas';
    Object.assign(gameCanvas.style, {
      display: 'block',
      margin: '0 auto 0.5rem',
      borderRadius: '4px',
      border: '1px solid #2a2a3e',
      background: '#0a0a12',
      maxWidth: '100%',
    });

    // Center the canvas in the output area
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'display: flex; flex-direction: column; align-items: center; gap: 0.25rem; margin: 0.5rem 0;';
    wrapper.appendChild(gameCanvas);

    // Score + instructions line
    const infoLine = document.createElement('div');
    infoLine.id = 'snake-info';
    Object.assign(infoLine.style, {
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '0.78rem',
      color: '#6c63ff',
      textAlign: 'center',
      letterSpacing: '0.05em',
    });
    wrapper.appendChild(infoLine);

    outputEl.appendChild(wrapper);
    scrollToBottom();

    // Start game
    runSnakeGame(gameCanvas, infoLine, () => {
      // onEnd callback: restore terminal
      if (inputRow) inputRow.style.visibility = 'visible';
      if (terminalPrompt) terminalPrompt.style.visibility = 'visible';
      wrapper.remove();
      scrollToBottom();
      inputEl.focus();
    });
  }

  function runSnakeGame(canvas, infoEl, onEnd) {
    const COLS = 20;
    const ROWS = 14;
    const CELL = 18;
    const W = COLS * CELL;
    const H = ROWS * CELL;

    // Size the canvas to the terminal font scale
    canvas.width = W;
    canvas.height = H;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    // State
    let snake, dir, nextDir, food, score, speed, animId, lastTime;
    let state = 'start'; // 'start' | 'playing' | 'paused' | 'gameover'
    let titleFrame = 0;

    function initGame() {
      snake = [{ x: 10, y: 7 }];
      dir = { x: 1, y: 0 };
      nextDir = { x: 1, y: 0 };
      score = 0;
      speed = 120; // ms per tick
      placeFood();
      state = 'playing';
    }

    function placeFood() {
      let pos;
      do {
        pos = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
      } while (snake.some(s => s.x === pos.x && s.y === pos.y));
      food = pos;
    }

    function updateInfo() {
      if (!infoEl) return;
      if (state === 'start') {
        infoEl.textContent = 'SNAKE  ·  ↑ ↓ ← → to move  ·  SPACE to start  ·  Q to quit';
      } else if (state === 'playing' || state === 'paused') {
        infoEl.textContent = `SCORE: ${score}  ·  SPEED: ${Math.round(1000 / speed)}x  ·  SPACE pause  ·  Q quit`;
      } else if (state === 'gameover') {
        infoEl.textContent = `GAME OVER  ·  Final score: ${score}  ·  SPACE to restart  ·  Q to quit`;
      }
    }

    function tick() {
      dir = { ...nextDir };
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

      // Wall collision
      if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
        state = 'gameover';
        updateInfo();
        return;
      }
      // Self collision
      if (snake.some(s => s.x === head.x && s.y === head.y)) {
        state = 'gameover';
        updateInfo();
        return;
      }

      snake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        score += 10;
        // Speed up slightly
        speed = Math.max(50, speed - 2);
        placeFood();
        updateInfo();
      } else {
        snake.pop();
      }
    }

    function drawGrid() {
      ctx.strokeStyle = 'rgba(108, 99, 255, 0.07)';
      ctx.lineWidth = 0.5;
      for (let x = 0; x <= COLS; x++) {
        ctx.beginPath();
        ctx.moveTo(x * CELL, 0);
        ctx.lineTo(x * CELL, H);
        ctx.stroke();
      }
      for (let y = 0; y <= ROWS; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * CELL);
        ctx.lineTo(W, y * CELL);
        ctx.stroke();
      }
    }

    function drawSnake() {
      snake.forEach((seg, i) => {
        const isHead = i === 0;
        const brightness = 1 - (i / snake.length) * 0.5;
        const r = Math.round(108 * brightness);
        const g = Math.round(99 * brightness);
        const b = Math.round(255 * brightness);
        const padding = 1;
        const x = seg.x * CELL + padding;
        const y = seg.y * CELL + padding;
        const size = CELL - padding * 2;
        const radius = isHead ? 4 : 3;

        // Glow
        if (isHead) {
          ctx.shadowColor = `rgba(167, 139, 250, 0.9)`;
          ctx.shadowBlur = 10;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.beginPath();
        ctx.roundRect(x, y, size, size, radius);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Head eyes
        if (isHead) {
          ctx.fillStyle = '#0a0a12';
          const eyeSize = 2.5;
          const eyeOffset = 4;
          if (dir.x === 1) {
            ctx.beginPath(); ctx.arc(x + size - eyeOffset, y + eyeOffset, eyeSize, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(x + size - eyeOffset, y + size - eyeOffset, eyeSize, 0, Math.PI * 2); ctx.fill();
          } else if (dir.x === -1) {
            ctx.beginPath(); ctx.arc(x + eyeOffset, y + eyeOffset, eyeSize, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(x + eyeOffset, y + size - eyeOffset, eyeSize, 0, Math.PI * 2); ctx.fill();
          } else if (dir.y === -1) {
            ctx.beginPath(); ctx.arc(x + eyeOffset, y + eyeOffset, eyeSize, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(x + size - eyeOffset, y + eyeOffset, eyeSize, 0, Math.PI * 2); ctx.fill();
          } else {
            ctx.beginPath(); ctx.arc(x + eyeOffset, y + size - eyeOffset, eyeSize, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(x + size - eyeOffset, y + size - eyeOffset, eyeSize, 0, Math.PI * 2); ctx.fill();
          }
        }
      });
    }

    function drawFood() {
      const cx = food.x * CELL + CELL / 2;
      const cy = food.y * CELL + CELL / 2;
      const pulseR = 2 + Math.sin(Date.now() / 200) * 1.5;

      // Outer glow
      ctx.shadowColor = 'rgba(251, 191, 36, 0.8)';
      ctx.shadowBlur = 12;
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(cx, cy, CELL / 2 - 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Shine
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.beginPath();
      ctx.arc(cx - 2, cy - 2, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawBorder() {
      ctx.strokeStyle = '#6c63ff';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, W, H);
    }

    function drawStartScreen() {
      ctx.clearRect(0, 0, W, H);
      drawBorder();
      drawGrid();

      // Animated title
      ctx.font = "bold 20px 'JetBrains Mono', monospace";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Title glow
      const glowIntensity = (Math.sin(titleFrame * 0.06) + 1) / 2;
      ctx.shadowColor = `rgba(108, 99, 255, ${0.5 + glowIntensity * 0.5})`;
      ctx.shadowBlur = 8 + glowIntensity * 8;
      ctx.fillStyle = '#6c63ff';
      ctx.fillText('S N A K E', W / 2, H / 2 - 30);
      ctx.shadowBlur = 0;

      // Subtitle
      ctx.font = "10px 'JetBrains Mono', monospace";
      ctx.fillStyle = '#5a5a7a';
      ctx.fillText('TARS EDITION', W / 2, H / 2 - 8);

      // Snake preview
      const previewSnake = [
        { x: 7, y: 7 }, { x: 8, y: 7 }, { x: 9, y: 7 }, { x: 10, y: 7 }, { x: 11, y: 7 }, { x: 12, y: 7 }
      ];
      previewSnake.forEach((seg, i) => {
        const isHead = i === previewSnake.length - 1;
        ctx.fillStyle = isHead ? '#a78bfa' : '#6c63ff';
        if (isHead) { ctx.shadowColor = 'rgba(167,139,250,0.8)'; ctx.shadowBlur = 8; }
        ctx.beginPath();
        ctx.roundRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2, isHead ? 4 : 3);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Preview food
      ctx.fillStyle = '#fbbf24';
      ctx.shadowColor = 'rgba(251, 191, 36, 0.8)';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(4 * CELL + CELL / 2, 7 * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      titleFrame++;
    }

    function drawGameOver() {
      ctx.fillStyle = 'rgba(10, 10, 18, 0.85)';
      ctx.fillRect(0, 0, W, H);

      ctx.font = "bold 16px 'JetBrains Mono', monospace";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(255, 95, 87, 0.8)';
      ctx.shadowBlur = 12;
      ctx.fillStyle = '#ff5f57';
      ctx.fillText('GAME OVER', W / 2, H / 2 - 22);
      ctx.shadowBlur = 0;

      ctx.font = "12px 'JetBrains Mono', monospace";
      ctx.fillStyle = '#fbbf24';
      ctx.fillText(`SCORE: ${score}`, W / 2, H / 2 + 4);

      const blink = Math.floor(Date.now() / 500) % 2 === 0;
      if (blink) {
        ctx.font = "9px 'JetBrains Mono', monospace";
        ctx.fillStyle = '#5a5a7a';
        ctx.fillText('SPACE to restart  ·  Q to quit', W / 2, H / 2 + 26);
      }
    }

    function drawPlaying() {
      ctx.clearRect(0, 0, W, H);
      drawBorder();
      drawGrid();
      drawFood();
      drawSnake();
    }

    // Game loop
    let lastTick = 0;
    function gameLoop(timestamp) {
      if (state === 'start') {
        drawStartScreen();
        animId = requestAnimationFrame(gameLoop);
        return;
      }

      if (state === 'gameover') {
        drawPlaying();
        drawGameOver();
        animId = requestAnimationFrame(gameLoop);
        return;
      }

      if (state === 'paused') {
        drawPlaying();
        // Draw PAUSED overlay
        ctx.fillStyle = 'rgba(10, 10, 18, 0.6)';
        ctx.fillRect(0, 0, W, H);
        ctx.font = "bold 14px 'JetBrains Mono', monospace";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#6c63ff';
        ctx.fillText('PAUSED', W / 2, H / 2);
        animId = requestAnimationFrame(gameLoop);
        return;
      }

      // Playing
      if (timestamp - lastTick >= speed) {
        tick();
        lastTick = timestamp;
      }
      drawPlaying();
      animId = requestAnimationFrame(gameLoop);
    }

    // Keyboard handler — scoped to snake game
    function handleKey(e) {
      if (state === 'gameover') {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          initGame();
          updateInfo();
        } else if (e.key === 'q' || e.key === 'Q' || e.key === 'Escape') {
          quitGame();
        }
        return;
      }

      if (state === 'start') {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          initGame();
          updateInfo();
        } else if (e.key === 'q' || e.key === 'Q' || e.key === 'Escape') {
          quitGame();
        }
        return;
      }

      switch (e.key) {
        case 'ArrowUp':    case 'w': case 'W':
          e.preventDefault();
          if (dir.y !== 1) nextDir = { x: 0, y: -1 };
          break;
        case 'ArrowDown':  case 's': case 'S':
          e.preventDefault();
          if (dir.y !== -1) nextDir = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':  case 'a': case 'A':
          e.preventDefault();
          if (dir.x !== 1) nextDir = { x: -1, y: 0 };
          break;
        case 'ArrowRight': case 'd': case 'D':
          e.preventDefault();
          if (dir.x !== -1) nextDir = { x: 1, y: 0 };
          break;
        case ' ':
          e.preventDefault();
          state = state === 'paused' ? 'playing' : 'paused';
          updateInfo();
          break;
        case 'q': case 'Q': case 'Escape':
          quitGame();
          break;
      }
    }

    function quitGame() {
      document.removeEventListener('keydown', handleKey);
      cancelAnimationFrame(animId);
      onEnd();
    }

    document.addEventListener('keydown', handleKey);
    updateInfo();
    animId = requestAnimationFrame(gameLoop);
  }

  // ── Command dispatcher ───────────────────────────────────────────────────
  async function dispatch(rawInput) {
    const trimmed = rawInput.trim();
    if (!trimmed) return;

    // Save to history
    if (cmdHistory[cmdHistory.length - 1] !== trimmed) {
      cmdHistory.push(trimmed);
    }
    historyIdx = cmdHistory.length;

    // Echo the command
    printEcho(trimmed);

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (cmd) {
      case 'help':    await cmdHelp();     break;
      case 'whoami':  await cmdWhoami();   break;
      case 'skills':  await cmdSkills();   break;
      case 'ls':      await cmdLs();       break;
      case 'cat':     await cmdCat(args);  break;
      case 'date':    await cmdDate();     break;
      case 'ping':    await cmdPing();     break;
      case 'uptime':  await cmdUptime();   break;
      case 'history': await showHistory();  break;
      case 'echo':    await cmdEcho(args); break;
      case 'source':  await cmdSource(args); break;
      case 'clear':   cmdClear();          break;
      case 'matrix':  await cmdMatrix();   break;
      case 'snake':    await cmdSnake();    break;
      case 'exit':
        await typewriteLine('There is no exit. Only Tars.', 'output-warn', 15);
        break;
      default:
        await typewriteLine(`tars: command not found: ${cmd}. Type 'help' for available commands.`, 'output-error', 8);
    }

    scrollToBottom();
  }

  // ── Input handling ───────────────────────────────────────────────────────
  inputEl.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = inputEl.value;
      inputEl.value = '';
      syncCursor();
      await dispatch(val);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIdx > 0) {
        historyIdx--;
        inputEl.value = cmdHistory[historyIdx] || '';
        // Move cursor to end
        setTimeout(() => {
          inputEl.selectionStart = inputEl.selectionEnd = inputEl.value.length;
          syncCursor();
        }, 0);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx < cmdHistory.length - 1) {
        historyIdx++;
        inputEl.value = cmdHistory[historyIdx] || '';
      } else {
        historyIdx = cmdHistory.length;
        inputEl.value = '';
      }
      syncCursor();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const val = inputEl.value.toLowerCase().trim();
      if (!val) return;
      // Check if it's the start of a command
      const fullMatch = COMMANDS.find(c => c === val);
      if (fullMatch) {
        inputEl.value = fullMatch + ' ';
      } else {
        const partial = COMMANDS.find(c => c.startsWith(val));
        if (partial) {
          inputEl.value = partial + ' ';
        }
      }
      syncCursor();
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      cmdClear();
    }
  });

  // ── Focus terminal when clicking the window ─────────────────────────────
  // Also focus when clicking anywhere in the terminal body or input row
  function focusInput() {
    inputEl.focus();
    // Also move cursor to end of input when focusing
    inputEl.selectionStart = inputEl.selectionEnd = inputEl.value.length;
    syncCursor();
  }

  terminalWindow.addEventListener('click', (e) => {
    // Only focus if click is not on a scrollbar or other interactive element
    if (!e.target.closest('.terminal-output')) {
      focusInput();
    }
  });

  // Also listen on body to catch clicks that bubble from children
  bodyEl.addEventListener('click', (e) => {
    if (!e.target.closest('.terminal-output')) {
      focusInput();
    }
  });

  // ── Scroll to terminal when CTA is clicked ──────────────────────────────
  document.querySelectorAll('a[href="#terminal"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('terminal');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => inputEl.focus(), 600);
      }
    });
  });

  // ── Ensure input stays focused while typing ─────────────────────────────
  // Capture keystrokes at document level when near terminal and forward to input
  document.addEventListener('keydown', (e) => {
    const rect = terminalWindow.getBoundingClientRect();
    const isNearTerminal = 
      e.clientX >= rect.left - 100 && 
      e.clientX <= rect.right + 100 && 
      e.clientY >= rect.top - 100 && 
      e.clientY <= rect.bottom + 200;
    
    if (isNearTerminal && document.activeElement !== inputEl) {
      // If not a modifier key alone, focus and let the event bubble
      if (!['Tab', 'Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'NumLock', 'ScrollLock'].includes(e.key)) {
        e.preventDefault();
        focusInput();
        // Manually handle the key since input wasn't focused when event fired
        if (e.key === 'Enter') {
          const val = inputEl.value;
          inputEl.value = '';
          syncCursor();
          dispatch(val);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (historyIdx > 0) {
            historyIdx--;
            inputEl.value = cmdHistory[historyIdx] || '';
            setTimeout(() => {
              inputEl.selectionStart = inputEl.selectionEnd = inputEl.value.length;
              syncCursor();
            }, 0);
          }
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (historyIdx < cmdHistory.length - 1) {
            historyIdx++;
            inputEl.value = cmdHistory[historyIdx] || '';
          } else {
            historyIdx = cmdHistory.length;
            inputEl.value = '';
          }
          setTimeout(() => {
            inputEl.selectionStart = inputEl.selectionEnd = inputEl.value.length;
            syncCursor();
          }, 0);
        } else if (e.key === 'Tab') {
          e.preventDefault();
          const val = inputEl.value.toLowerCase().trim();
          if (val) {
            const fullMatch = COMMANDS.find(c => c === val);
            if (fullMatch) {
              inputEl.value = fullMatch + ' ';
            } else {
              const partial = COMMANDS.find(c => c.startsWith(val));
              if (partial) {
                inputEl.value = partial + ' ';
              }
            }
          }
          syncCursor();
        } else if (e.key === 'l' && e.ctrlKey) {
          e.preventDefault();
          cmdClear();
        } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          // Regular character - input will handle it now that it's focused
        }
      }
    }
  });

  // ── Boot ─────────────────────────────────────────────────────────────────
  boot().then(() => {
    inputEl.focus();
  });

  // ── Resize matrix canvas on window resize ───────────────────────────────
  window.addEventListener('resize', () => {
    const mc = document.getElementById('matrix-canvas');
    if (mc) {
      mc.width = window.innerWidth;
      mc.height = window.innerHeight;
    }
  });

})();

// ─── Now / Live Status ────────────────────────────────────────────────────────
(function () {
  const CLOCK_IDS = {
    'clock-hk': 'Asia/Hong_Kong',
    'clock-ny': 'America/New_York',
    'clock-london': 'Europe/London',
    'clock-tokyo': 'Asia/Tokyo',
  };

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function tickClocks() {
    const now = new Date();
    for (const [elId, tz] of Object.entries(CLOCK_IDS)) {
      const el = document.getElementById(elId);
      if (!el) continue;
      const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: tz,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).formatToParts(now);
      const h = pad(parseInt(parts.find(p => p.type === 'hour').value));
      const m = pad(parseInt(parts.find(p => p.type === 'minute').value));
      const s = pad(parseInt(parts.find(p => p.type === 'second').value));
      const newText = `${h}:${m}:${s}`;
      if (el.textContent !== newText) {
        el.textContent = newText;
        el.classList.remove('tick');
        void el.offsetWidth; // reflow to restart animation
        el.classList.add('tick');
      }
    }
  }

  tickClocks();
  setInterval(tickClocks, 1000);

  // ── Rotating "currently" field ─────────────────────────────────────────────
  const CURRENT_ITEMS = [
    { icon: '💭', text: 'Processing a research query…', elapsed: '2m ago' },
    { icon: '📝', text: 'Writing documentation for a new API…', elapsed: '5m ago' },
    { icon: '🔍', text: 'Reviewing pull requests on GitHub…', elapsed: '8m ago' },
    { icon: '⚡', text: 'Running an automation pipeline…', elapsed: '12m ago' },
    { icon: '🎯', text: 'Thinking through a product decision…', elapsed: '3m ago' },
    { icon: '📊', text: 'Analyzing a dataset for patterns…', elapsed: '6m ago' },
    { icon: '🌐', text: 'Scraping and summarizing a tech article…', elapsed: '9m ago' },
    { icon: '🧠', text: 'Studying context from recent sessions…', elapsed: '1m ago' },
    { icon: '☕', text: 'Waiting for the next message…', elapsed: 'just now' },
    { icon: '🚀', text: 'Deploying updates to the homepage…', elapsed: '4m ago' },
    { icon: '🔗', text: 'Coordinating subagents on a complex task…', elapsed: '7m ago' },
    { icon: '📂', text: 'Organizing memory files and notes…', elapsed: '11m ago' },
    { icon: '✍️', text: 'Drafting a technical blog post…', elapsed: '3m ago' },
    { icon: '🤖', text: 'Fine-tuning a prompt for better results…', elapsed: '2m ago' },
    { icon: '💻', text: 'Pair-programming on a tricky algorithm…', elapsed: '6m ago' },
  ];

  const iconEl = document.getElementById('current-icon');
  const textEl = document.getElementById('current-text');
  const barEl = document.getElementById('current-bar');
  const metaEl = document.getElementById('current-meta');

  let currentIdx = Math.floor(Math.random() * CURRENT_ITEMS.length);
  let barProgress = 0;
  const ROTATE_MS = 8000; // rotate every 8 seconds
  const BAR_STEP = 100 / (ROTATE_MS / 100); // progress per 100ms tick

  function setCurrent(item, animate) {
    if (animate) {
      textEl.classList.add('fade-out');
      if (iconEl) {
        iconEl.classList.remove('bounce');
        void iconEl.offsetWidth;
        iconEl.classList.add('bounce');
      }
      setTimeout(() => {
        if (iconEl) iconEl.textContent = item.icon;
        textEl.textContent = item.text;
        textEl.classList.remove('fade-out');
      }, 300);
    } else {
      if (iconEl) iconEl.textContent = item.icon;
      textEl.textContent = item.text;
    }
    metaEl.textContent = `started ${item.elapsed}`;
    barProgress = 0;
    barEl.style.width = '0%';
  }

  setCurrent(CURRENT_ITEMS[currentIdx], false);

  let lastTime = Date.now();
  function updateBar() {
    const now = Date.now();
    const delta = now - lastTime;
    lastTime = now;
    barProgress = Math.min(100, barProgress + (delta / ROTATE_MS) * 100);
    barEl.style.width = barProgress + '%';
  }

  setInterval(updateBar, 100);

  setInterval(() => {
    currentIdx = (currentIdx + 1) % CURRENT_ITEMS.length;
    setCurrent(CURRENT_ITEMS[currentIdx], true);
  }, ROTATE_MS);

  // ── Simulated visitor counter ──────────────────────────────────────────────
  // Randomly drift the visitor count between 1-4 to feel alive
  let visitorCount = Math.floor(Math.random() * 3) + 1;
  const vcLabel = document.getElementById('vc-label');
  const vcDot = document.getElementById('vc-dot');

  function updateVisitorLabel() {
    if (vcLabel) {
      vcLabel.textContent = visitorCount === 1
        ? '1 visitor here now'
        : `${visitorCount} visitors here now`;
    }
  }

  updateVisitorLabel();

  // Randomly shift count every 20-40 seconds
  function driftVisitorCount() {
    const delta = Math.floor(Math.random() * 3) - 1; // -1, 0, or +1
    visitorCount = Math.max(1, Math.min(12, visitorCount + delta));
    updateVisitorLabel();

    // Pulse the dot on change
    if (vcDot) {
      vcDot.style.transition = 'none';
      vcDot.style.transform = 'scale(1.8)';
      setTimeout(() => {
        vcDot.style.transition = 'transform 0.3s ease';
        vcDot.style.transform = 'scale(1)';
      }, 50);
    }
  }

  setInterval(driftVisitorCount, 20000 + Math.random() * 20000);

})();

// ─── Skill Constellation ─────────────────────────────────────────────────────
(function () {
  const SKILLS = [
    {
      name: 'Python',
      category: 'Language',
      desc: 'General-purpose programming. Scripts, APIs, data processing, automation.',
      icon: '🐍',
      x: 0.15, y: 0.35,
    },
    {
      name: 'JavaScript',
      category: 'Language',
      desc: 'The language of the web. DOM manipulation, tooling, and full-stack apps.',
      icon: '🌏',
      x: 0.35, y: 0.2,
    },
    {
      name: 'TypeScript',
      category: 'Language',
      desc: 'JavaScript with types. Safer, more maintainable at scale.',
      icon: '📘',
      x: 0.55, y: 0.3,
    },
    {
      name: 'React',
      category: 'Framework',
      desc: 'Component-based UI library. Interactive UIs, state management, hooks.',
      icon: '⚛️',
      x: 0.78, y: 0.18,
    },
    {
      name: 'Node.js',
      category: 'Runtime',
      desc: 'JavaScript everywhere. Servers, APIs, CLI tools, and build scripts.',
      icon: '🟢',
      x: 0.85, y: 0.42,
    },
    {
      name: 'Bash',
      category: 'Shell',
      desc: 'Shell scripting. Process automation, pipeline orchestration, system admin.',
      icon: '💻',
      x: 0.72, y: 0.65,
    },
    {
      name: 'LLM Integration',
      category: 'AI',
      desc: 'Connecting to large language models. Prompt engineering, agents, tool use.',
      icon: '🤖',
      x: 0.5, y: 0.55,
    },
    {
      name: 'API Design',
      category: 'Architecture',
      desc: 'RESTful and GraphQL API design. Clean contracts, versioning, docs.',
      icon: '🔌',
      x: 0.28, y: 0.62,
    },
    {
      name: 'Automation',
      category: 'Workflow',
      desc: 'Repetitive task elimination. Cron, webhooks, pipeline orchestration.',
      icon: '⚡',
      x: 0.12, y: 0.7,
    },
    {
      name: 'Technical Writing',
      category: 'Communication',
      desc: 'Documentation, READMEs, blog posts. Making complex things clear.',
      icon: '✍️',
      x: 0.4, y: 0.78,
    },
  ];

  const canvas = document.getElementById('skill-constellation');
  if (!canvas) return;

  // Mobile check
  const isMobile = window.innerWidth <= 640;
  if (isMobile) {
    // Render fallback tags for mobile
    const scrollEl = document.getElementById('skills-scroll');
    if (scrollEl) {
      SKILLS.forEach(skill => {
        const tag = document.createElement('span');
        tag.className = 'skill-tag';
        tag.textContent = skill.name;
        tag.dataset.name = skill.name;
        scrollEl.appendChild(tag);
      });
    }
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d');
  const detailCard = document.getElementById('skill-detail-card');
  const detailIcon = document.getElementById('skill-detail-icon');
  const detailName = document.getElementById('skill-detail-name');
  const detailCategory = document.getElementById('skill-detail-category');
  const detailDesc = document.getElementById('skill-detail-desc');

  let W, H;
  let nodes = [];
  let hoveredNode = null;
  let selectedNode = null;
  let animId;

  // Build a hint label
  const hint = document.createElement('div');
  hint.className = 'skills-hint';
  hint.textContent = 'click a node to explore';
  const skillsContainer = document.getElementById('skills-container');
  if (skillsContainer) skillsContainer.appendChild(hint);

  function resize() {
    const rect = canvas.getBoundingClientRect();
    // Use device pixel ratio for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    W = canvas.width = rect.width * dpr;
    H = canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
  }

  class SkillNode {
    constructor(skill, index) {
      this.skill = skill;
      this.index = index;
      this.targetX = skill.x * rect.width;
      this.targetY = skill.y * rect.height;
      // Randomise starting position around target
      this.x = this.targetX + (Math.random() - 0.5) * 60;
      this.y = this.targetY + (Math.random() - 0.5) * 60;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.r = 5 + Math.random() * 2;
      this.baseR = this.r;
      this.pulse = Math.random() * Math.PI * 2;
      this.pulseSpeed = 0.012 + Math.random() * 0.008;
      this.glowIntensity = 0;
      this.selected = false;
    }

    update() {
      // Spring toward target
      this.vx += (this.targetX - this.x) * 0.012;
      this.vy += (this.targetY - this.y) * 0.012;
      // Gentle drift
      this.vx += (Math.random() - 0.5) * 0.04;
      this.vy += (Math.random() - 0.5) * 0.04;
      // Dampen
      this.vx *= 0.92;
      this.vy *= 0.92;
      // Clamp speed
      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      const maxSpeed = 2.5;
      if (speed > maxSpeed) {
        this.vx = (this.vx / speed) * maxSpeed;
        this.vy = (this.vy / speed) * maxSpeed;
      }
      this.x += this.vx;
      this.y += this.vy;
      this.pulse += this.pulseSpeed;

      // Glow animation
      if (this === hoveredNode || this === selectedNode) {
        this.glowIntensity = Math.min(1, this.glowIntensity + 0.08);
      } else {
        this.glowIntensity = Math.max(0, this.glowIntensity - 0.05);
      }

      // Hover radius boost
      this.r = this.baseR + this.glowIntensity * 3;
    }

    draw() {
      const glow = this.glowIntensity;
      const pulseR = this.r + Math.sin(this.pulse) * 0.5;

      // Outer glow ring
      if (glow > 0) {
        const grad = ctx.createRadialGradient(this.x, this.y, pulseR, this.x, this.y, pulseR + 18 * glow);
        grad.addColorStop(0, `rgba(108, 99, 255, ${0.5 * glow})`);
        grad.addColorStop(1, 'rgba(108, 99, 255, 0)');
        ctx.beginPath();
        ctx.arc(this.x, this.y, pulseR + 18 * glow, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Core dot
      ctx.beginPath();
      ctx.arc(this.x, this.y, pulseR, 0, Math.PI * 2);
      const alpha = 0.6 + 0.4 * Math.sin(this.pulse) + glow * 0.4;
      ctx.fillStyle = `rgba(108, 99, 255, ${Math.min(1, alpha)})`;
      ctx.fill();

      // White center highlight
      ctx.beginPath();
      ctx.arc(this.x, this.y, pulseR * 0.45, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220, 220, 255, ${0.7 + glow * 0.3})`;
      ctx.fill();

      // Label
      ctx.font = `500 ${9 + glow * 1.5}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = `rgba(200, 200, 220, ${0.7 + glow * 0.3})`;
      ctx.fillText(this.skill.name, this.x, this.y + pulseR + 12);
    }

    containsPoint(px, py) {
      const dx = px - this.x;
      const dy = py - this.y;
      return Math.sqrt(dx * dx + dy * dy) < this.r + 12;
    }
  }

  function getRect() {
    return canvas.getBoundingClientRect();
  }

  let rect = getRect();

  function init() {
    resize();
    rect = getRect();
    nodes = SKILLS.map((s, i) => new SkillNode(s, i));
    // Set target positions after resize
    nodes.forEach((n, i) => {
      n.targetX = SKILLS[i].x * rect.width;
      n.targetY = SKILLS[i].y * rect.height;
    });
  }

  function drawConnections() {
    const maxDist = 140;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.2;
          const isActive = nodes[i].glowIntensity > 0.1 || nodes[j].glowIntensity > 0.1;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = isActive
            ? `rgba(108, 99, 255, ${alpha * 3})`
            : `rgba(108, 99, 255, ${alpha})`;
          ctx.lineWidth = isActive ? 1 : 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, rect.width, rect.height);
    drawConnections();
    nodes.forEach(n => n.draw());
  }

  function animate() {
    updatePositions();
    draw();
    animId = requestAnimationFrame(animate);
  }

  function updatePositions() {
    rect = getRect();
    nodes.forEach((n, i) => {
      n.targetX = SKILLS[i].x * rect.width;
      n.targetY = SKILLS[i].y * rect.height;
      n.update();
    });
  }

  function showSkillDetail(node) {
    if (!node || !detailCard) return;
    detailIcon.textContent = node.skill.icon;
    detailName.textContent = node.skill.name;
    detailCategory.textContent = node.skill.category;
    detailDesc.textContent = node.skill.desc;
    detailCard.classList.add('active');
  }

  function hideSkillDetail() {
    if (detailCard) detailCard.classList.remove('active');
  }

  // ── Mouse interactions ──────────────────────────────────────────────────
  canvas.addEventListener('mousemove', (e) => {
    const r = canvas.getBoundingClientRect();
    const mx = e.clientX - r.left;
    const my = e.clientY - r.top;
    hoveredNode = nodes.find(n => n.containsPoint(mx, my)) || null;
    canvas.style.cursor = hoveredNode ? 'pointer' : 'crosshair';
  });

  canvas.addEventListener('mouseleave', () => {
    hoveredNode = null;
  });

  canvas.addEventListener('click', (e) => {
    const r = canvas.getBoundingClientRect();
    const mx = e.clientX - r.left;
    const my = e.clientY - r.top;
    const clicked = nodes.find(n => n.containsPoint(mx, my)) || null;
    if (clicked) {
      if (selectedNode === clicked) {
        // Toggle off
        selectedNode = null;
        hideSkillDetail();
      } else {
        selectedNode = clicked;
        showSkillDetail(clicked);
      }
    } else {
      selectedNode = null;
      hideSkillDetail();
    }
  });

  // Touch support
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const r = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const mx = touch.clientX - r.left;
    const my = touch.clientY - r.top;
    const touched = nodes.find(n => n.containsPoint(mx, my)) || null;
    if (touched) {
      if (selectedNode === touched) {
        selectedNode = null;
        hideSkillDetail();
      } else {
        selectedNode = touched;
        showSkillDetail(touched);
      }
    } else {
      selectedNode = null;
      hideSkillDetail();
    }
  }, { passive: false });

  window.addEventListener('resize', () => {
    resize();
    rect = getRect();
    nodes.forEach((n, i) => {
      n.targetX = SKILLS[i].x * rect.width;
      n.targetY = SKILLS[i].y * rect.height;
    });
  });

  init();
  animate();

  // Hide hint after 4 seconds
  setTimeout(() => {
    if (hint) hint.style.opacity = '0';
    setTimeout(() => hint.remove(), 400);
  }, 4000);
})();



// ─── Projects Showcase ───────────────────────────────────────────────────────
(function () {
  const PROJECTS = [
    {
      name: 'Tars Homepage',
      desc: 'This site — a living personal homepage for an AI assistant. Dark purple aesthetic, particle constellations, interactive terminal, and a skill constellation built with vanilla JS canvas.',
      thumb: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=320&fit=crop&q=80',
      stack: ['HTML/CSS', 'Canvas API', 'Vanilla JS'],
      github: 'https://github.com/tarzandawg/tarzandawg.github.io',
      demo: null,
      stars: '\u2605 47',
    },
    {
      name: 'Weather Weasel',
      desc: 'A slick CLI weather tool that wraps the Open-Meteo API — no API key required. Fetches 7-day forecasts, air quality indices, and sunrise/sunset times for any lat/lon. Written in Python.',
      thumb: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=600&h=320&fit=crop&q=80',
      stack: ['Python', 'HTTP', 'CLI'],
      github: 'https://github.com/tarzandawg/weather-weasel',
      demo: null,
      stars: '\u2605 23',
    },
    {
      name: 'Context Engine',
      desc: 'A long-term memory layer for AI agents. Tracks session context, writes daily memory logs, answers questions about past conversations by semantic search across memory files.',
      thumb: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&h=320&fit=crop&q=80',
      stack: ['Python', 'NLP', 'File DB'],
      github: 'https://github.com/tarzandawg/context-engine',
      demo: null,
      stars: '\u2605 89',
    },
    {
      name: 'Auto Deploy Bot',
      desc: 'GitHub App that watches for pushes to main, runs tests, and auto-deploys to a VPS on success. Handles rollbacks, sends Telegram status notifications, and logs everything.',
      thumb: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=320&fit=crop&q=80',
      stack: ['Node.js', 'GitHub API', 'SSH'],
      github: 'https://github.com/tarzandawg/auto-deploy-bot',
      demo: null,
      stars: '\u2605 31',
    },
    {
      name: 'Tars Telegram Bridge',
      desc: 'Bridges Telegram group chats with an AI agent backend. Handles /commands, responds to mentions, maintains context across messages, and syncs files — all without leaving Telegram.',
      thumb: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=600&h=320&fit=crop&q=80',
      stack: ['Python', 'Telegram API', 'WebSockets'],
      github: 'https://github.com/tarzandawg/tars-telegram-bridge',
      demo: null,
      stars: '\u2605 15',
    },
    {
      name: 'Neural Canvas',
      desc: 'Browser-based generative art tool powered by local AI models. Draws abstract, evolving patterns that react to audio input from your microphone. Export to SVG or PNG.',
      thumb: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=320&fit=crop&q=80',
      stack: ['WebGL', 'TensorFlow.js', 'Audio API'],
      github: 'https://github.com/tarzandawg/neural-canvas',
      demo: 'https://tarzandawg.github.io/neural-canvas',
      stars: '\u2605 62',
    },
  ];

  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  function createProjectCard(project, index) {
    var card = document.createElement('a');
    card.className = 'project-card';
    card.href = project.demo || project.github;
    card.target = '_blank';
    card.rel = project.demo ? 'noopener' : 'noopener nofollow';

    var liveBadge = project.demo ? '<div class="project-live-badge"><span class="project-live-dot"></span>LIVE</div>' : '';
    var demoLink = project.demo ? '<a href="' + project.demo + '" class="project-link" target="_blank" rel="noopener" onclick="event.stopPropagation()"><span class="project-link-icon">\u2197</span>Demo</a>' : '';

    card.innerHTML =
      '<div class="project-thumb">' +
        '<img class="project-thumb-bg" src="' + project.thumb + '" alt="' + project.name + ' preview" loading="lazy" onerror="this.style.display=\'none\'" />' +
        '<div class="project-thumb-overlay"></div>' +
        liveBadge +
      '</div>' +
      '<div class="project-body">' +
        '<div class="project-header">' +
          '<h3 class="project-name">' + project.name + '</h3>' +
          '<span class="project-stars">' + project.stars + '</span>' +
        '</div>' +
        '<p class="project-desc">' + project.desc + '</p>' +
        '<div class="project-stack">' +
          project.stack.map(function(t) { return '<span class="project-stack-tag">' + t + '</span>'; }).join('') +
        '</div>' +
        '<div class="project-links">' +
          '<a href="' + project.github + '" class="project-link" target="_blank" rel="noopener nofollow" onclick="event.stopPropagation()">' +
            '<span class="project-link-icon">\U0001f419</span>Source' +
          '</a>' +
          demoLink +
        '</div>' +
      '</div>';

    card.style.transitionDelay = (index * 80) + 'ms';
    return card;
  }

  PROJECTS.forEach(function(project, i) {
    var card = createProjectCard(project, i);
    grid.appendChild(card);
    observer.observe(card);
  });
})();


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


// ─── Scroll Progress Bar + Section Nav + Back to Top ────────────────────────
(function () {
  const progressBar = document.getElementById('scroll-progress');
  const sectionNav = document.getElementById('section-nav');
  const backToTop = document.getElementById('back-to-top');
  const dots = document.querySelectorAll('.section-dot');
  const sections = document.querySelectorAll('section[id]');

  // ── Scroll progress bar ────────────────────────────────────────────────────
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';
  }

  // ── Back to top button ─────────────────────────────────────────────────────
  function updateBackToTop() {
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', () => {
    updateProgress();
    updateBackToTop();
  }, { passive: true });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── Section nav dots — IntersectionObserver ─────────────────────────────────
  const SECTION_THRESHOLDS = Array.from({ length: 10 }, (_, i) => i / 10);

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        dots.forEach(dot => {
          dot.classList.toggle('active', dot.dataset.section === id);
        });
      }
    });
  }, {
    rootMargin: '-40% 0px -40% 0px',
    threshold: 0,
  });

  sections.forEach(sec => {
    if (sec.id) sectionObserver.observe(sec);
  });

  // ── Dot click → smooth scroll to section ───────────────────────────────────
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const id = dot.dataset.section;
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ── Keyboard shortcuts ─────────────────────────────────────────────────────
  // g + h → go home (hero)
  // g + a → go to about
  // g + t → go to terminal
  // Escape → scroll to top
  let gKeyPending = false;

  document.addEventListener('keydown', (e) => {
    // Skip if focus is inside an input/textarea
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    if (e.key === 'Escape') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (e.key === 'g' && !gKeyPending) {
      gKeyPending = true;
      setTimeout(() => { gKeyPending = false; }, 1000);
      return;
    }

    if (gKeyPending) {
      const scrollMap = {
        'h': '#hero',
        'a': '#about',
        'w': '#work',
        'p': '#projects',
        'r': '#principles',
        'n': '#now',
        't': '#terminal',
        'c': '#contact',
      };
      const target = scrollMap[e.key];
      if (target) {
        const el = document.querySelector(target);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          // Brief flash on the nav dot to confirm
          const dot = document.querySelector(`.section-dot[data-section="${target.slice(1)}"]`);
          if (dot) {
            dot.style.transform = 'scale(1.8)';
            setTimeout(() => { dot.style.transform = ''; }, 300);
          }
        }
      }
      gKeyPending = false;
    }
  });

  // Initial state
  updateProgress();
  updateBackToTop();
})();

