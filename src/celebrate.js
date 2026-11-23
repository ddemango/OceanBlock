// Fireworks + confetti overlay for the level-complete screen (2D canvas, no assets).
const COLORS = ['#ffc93c', '#ff7a59', '#3fbf6a', '#5bc8ff', '#ff5a8a', '#ffffff', '#b98cff'];

let cvs = null;
let ctx = null;
let parts = [];
let running = false;
let until = 0;
let nextRocket = 0;

function ensureCanvas() {
  if (cvs) return;
  cvs = document.createElement('canvas');
  cvs.id = 'fx';
  Object.assign(cvs.style, { position: 'fixed', inset: '0', width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 });
  document.body.appendChild(cvs);
  ctx = cvs.getContext('2d');
}

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  cvs.width = innerWidth * dpr;
  cvs.height = innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function burst(x, y) {
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  const n = 60;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const sp = 2.5 + Math.random() * 3.5;
    parts.push({ kind: 'spark', x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1, decay: 0.012 + Math.random() * 0.01, color });
  }
}

function rocket() {
  const x = innerWidth * (0.15 + Math.random() * 0.7);
  parts.push({ kind: 'rocket', x, y: innerHeight, vx: (Math.random() - 0.5) * 1.5, vy: -(9 + Math.random() * 4), life: 1, ty: innerHeight * (0.15 + Math.random() * 0.3) });
}

function confetti(n = 120) {
  for (let i = 0; i < n; i++) {
    parts.push({
      kind: 'confetti', x: Math.random() * innerWidth, y: -20 - Math.random() * innerHeight * 0.5,
      vx: (Math.random() - 0.5) * 1.5, vy: 1.5 + Math.random() * 2.5, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3,
      w: 6 + Math.random() * 6, h: 10 + Math.random() * 8, color: COLORS[Math.floor(Math.random() * COLORS.length)], life: 1,
    });
  }
}

function tick(t) {
  if (!running) return;
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  if (t < until && t > nextRocket) {
    rocket();
    nextRocket = t + 350 + Math.random() * 400;
  }
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i];
    if (p.kind === 'rocket') {
      p.x += p.vx; p.y += p.vy; p.vy += 0.12;
      ctx.fillStyle = '#fff3c4';
      ctx.fillRect(p.x - 1.5, p.y - 6, 3, 12);
      if (p.y <= p.ty || p.vy >= 0) { burst(p.x, p.y); parts.splice(i, 1); }
      continue;
    }
    if (p.kind === 'spark') {
      p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.vx *= 0.985; p.vy *= 0.985;
      p.life -= p.decay;
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
    } else {
      p.x += p.vx + Math.sin(p.y * 0.02) * 0.6; p.y += p.vy; p.rot += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.rot)));
      ctx.restore();
      if (p.y > innerHeight + 30) p.life = 0;
    }
    if (p.life <= 0) parts.splice(i, 1);
  }
  if (parts.length || t < until) requestAnimationFrame(tick);
  else stop();
}

export function celebrate(ms = 4500) {
  ensureCanvas();
  resize();
  parts = [];
  until = performance.now() + ms;
  nextRocket = 0;
  confetti();
  setTimeout(() => running && confetti(80), 900);
  if (!running) {
    running = true;
    requestAnimationFrame(tick);
  }
}

export function stop() {
  running = false;
  parts = [];
  if (ctx) ctx.clearRect(0, 0, innerWidth, innerHeight);
}

// Animate a number counting up inside an element.
export function countUp(el, to, ms = 900) {
  const start = performance.now();
  const step = (t) => {
    const k = Math.min(1, (t - start) / ms);
    el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
