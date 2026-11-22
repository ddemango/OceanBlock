import * as THREE from 'three';

// All art is drawn procedurally so the game ships with zero image assets.

function canvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return [c, c.getContext('2d')];
}

function toTexture(c, repeatX = 1) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  if (repeatX !== 1) {
    t.wrapS = THREE.RepeatWrapping;
    t.repeat.x = repeatX;
  }
  return t;
}

function drawAnchor(g, cx, cy, s, color) {
  g.save();
  g.translate(cx, cy);
  g.scale(s, s);
  g.strokeStyle = color;
  g.fillStyle = color;
  g.lineWidth = 9;
  g.lineCap = 'round';
  g.beginPath(); g.arc(0, -38, 10, 0, Math.PI * 2); g.stroke();
  g.beginPath(); g.moveTo(0, -28); g.lineTo(0, 36); g.stroke();
  g.beginPath(); g.moveTo(-20, -14); g.lineTo(20, -14); g.stroke();
  g.beginPath(); g.arc(0, 4, 34, Math.PI * 0.15, Math.PI * 0.85); g.stroke();
  for (const sx of [-1, 1]) {
    g.beginPath();
    g.moveTo(sx * 33, 16);
    g.lineTo(sx * 42, 4);
    g.lineTo(sx * 24, 12);
    g.closePath();
    g.fill();
  }
  g.restore();
}

function drawStar(g, cx, cy, r, color) {
  g.save();
  g.fillStyle = color;
  g.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 === 0 ? r : r * 0.45;
    g.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
  }
  g.closePath();
  g.fill();
  g.restore();
}

function drawWave(g, x, y, w, color) {
  g.save();
  g.strokeStyle = color;
  g.lineWidth = 8;
  g.lineCap = 'round';
  for (let row = 0; row < 2; row++) {
    g.beginPath();
    for (let i = 0; i <= 40; i++) {
      const px = x + (i / 40) * w;
      const py = y + row * 20 + Math.sin((i / 40) * Math.PI * 4) * 7;
      if (i === 0) g.moveTo(px, py); else g.lineTo(px, py);
    }
    g.stroke();
  }
  g.restore();
}

// Wooden cargo crate with an anchor stencil.
export function crateTexture(base = '#f0a24b', dark = '#b8692a') {
  const [c, g] = canvas(256, 256);
  g.fillStyle = base;
  g.fillRect(0, 0, 256, 256);
  // planks
  g.strokeStyle = dark;
  g.lineWidth = 3;
  for (let y = 64; y < 256; y += 64) {
    g.beginPath(); g.moveTo(0, y); g.lineTo(256, y); g.stroke();
  }
  // grain
  g.globalAlpha = 0.18;
  for (let i = 0; i < 40; i++) {
    g.beginPath();
    const y = Math.random() * 256;
    g.moveTo(0, y);
    g.bezierCurveTo(80, y + 6, 170, y - 6, 256, y + 3);
    g.stroke();
  }
  g.globalAlpha = 1;
  // frame
  g.lineWidth = 22;
  g.strokeStyle = dark;
  g.strokeRect(11, 11, 234, 234);
  g.lineWidth = 4;
  g.strokeStyle = '#7a4318';
  g.strokeRect(22, 22, 212, 212);
  // stencil badge
  g.fillStyle = 'rgba(255,240,210,0.9)';
  g.beginPath(); g.arc(128, 128, 62, 0, Math.PI * 2); g.fill();
  drawAnchor(g, 128, 132, 1.15, '#2a4a7a');
  // nails
  g.fillStyle = '#5b3412';
  for (const [x, y] of [[22, 22], [234, 22], [22, 234], [234, 234]]) {
    g.beginPath(); g.arc(x, y, 6, 0, Math.PI * 2); g.fill();
  }
  return toTexture(c);
}

// Painted steel drum with hoops and a starfish label, wraps around a cylinder.
export function drumTexture(base = '#2fb3a5', band = '#f6f1e3', emblem = '#ff7a59', tall = false) {
  const h = tall ? 512 : 256;
  const [c, g] = canvas(512, h);
  const grad = g.createLinearGradient(0, 0, 512, 0);
  grad.addColorStop(0, base);
  grad.addColorStop(0.5, shade(base, 18));
  grad.addColorStop(1, base);
  g.fillStyle = grad;
  g.fillRect(0, 0, 512, h);
  // hoops
  g.fillStyle = shade(base, -35);
  for (const y of tall ? [14, h * 0.33, h * 0.67, h - 26] : [12, h - 24]) {
    g.fillRect(0, y, 512, 12);
  }
  // label band
  const bandY = h / 2 - 48;
  g.fillStyle = band;
  g.fillRect(0, bandY, 512, 96);
  g.fillStyle = shade(band, -25);
  g.fillRect(0, bandY, 512, 6);
  g.fillRect(0, bandY + 90, 512, 6);
  drawStar(g, 128, h / 2, 34, emblem);
  drawStar(g, 384, h / 2, 34, emblem);
  drawWave(g, 186, h / 2 - 12, 140, shade(base, -20));
  return toTexture(c);
}

export function drumLidTexture(base = '#2fb3a5') {
  const [c, g] = canvas(128, 128);
  g.fillStyle = shade(base, -10);
  g.fillRect(0, 0, 128, 128);
  g.strokeStyle = shade(base, -40);
  g.lineWidth = 8;
  g.beginPath(); g.arc(64, 64, 56, 0, Math.PI * 2); g.stroke();
  g.lineWidth = 4;
  g.beginPath(); g.arc(64, 64, 40, 0, Math.PI * 2); g.stroke();
  g.fillStyle = shade(base, -40);
  g.beginPath(); g.arc(88, 50, 9, 0, Math.PI * 2); g.fill();
  return toTexture(c);
}

// Red / white striped buoy cap.
export function buoyTexture() {
  const [c, g] = canvas(256, 256);
  const stripes = 4;
  for (let i = 0; i < stripes; i++) {
    g.fillStyle = i % 2 === 0 ? '#ff5a4e' : '#fff6ea';
    g.fillRect(0, (i * 256) / stripes, 256, 256 / stripes);
  }
  return toTexture(c);
}

// Long beam with rope lashing.
export function beamTexture() {
  const [c, g] = canvas(512, 128);
  g.fillStyle = '#c98b4e';
  g.fillRect(0, 0, 512, 128);
  g.strokeStyle = '#8f5a2a';
  g.globalAlpha = 0.35;
  g.lineWidth = 3;
  for (let i = 0; i < 18; i++) {
    const y = Math.random() * 128;
    g.beginPath(); g.moveTo(0, y); g.bezierCurveTo(170, y + 8, 340, y - 8, 512, y); g.stroke();
  }
  g.globalAlpha = 1;
  for (const x of [70, 420]) {
    g.fillStyle = '#e8d3a2';
    g.fillRect(x, 0, 24, 128);
    g.strokeStyle = '#a88a52';
    g.lineWidth = 3;
    for (let y = 0; y < 128; y += 12) {
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + 24, y + 8); g.stroke();
    }
  }
  drawAnchor(g, 256, 66, 0.6, '#5a3414');
  return toTexture(c);
}

export function logTexture() {
  const [c, g] = canvas(256, 64);
  g.fillStyle = '#b07a46';
  g.fillRect(0, 0, 256, 64);
  g.strokeStyle = '#7d5129';
  g.globalAlpha = 0.5;
  for (let i = 0; i < 12; i++) {
    const y = Math.random() * 64;
    g.beginPath(); g.moveTo(0, y); g.lineTo(256, y + (Math.random() - 0.5) * 6); g.stroke();
  }
  return toTexture(c, 3);
}

export function stoneTexture() {
  const [c, g] = canvas(256, 256);
  g.fillStyle = '#9aa3ad';
  g.fillRect(0, 0, 256, 256);
  const rows = 4;
  for (let r = 0; r < rows; r++) {
    const off = r % 2 ? 32 : 0;
    for (let x = -64 + off; x < 256; x += 64) {
      const shadeAmt = Math.floor(Math.random() * 30) - 15;
      g.fillStyle = shade('#a7b0ba', shadeAmt);
      g.fillRect(x + 3, r * 64 + 3, 58, 58);
    }
  }
  return toTexture(c);
}

export function skyTexture() {
  const [c, g] = canvas(4, 512);
  const grad = g.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#3a9fe0');
  grad.addColorStop(0.55, '#8fd3f2');
  grad.addColorStop(1, '#e6f8ff');
  g.fillStyle = grad;
  g.fillRect(0, 0, 4, 512);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const clamp = (v) => Math.max(0, Math.min(255, v));
  const r = clamp((n >> 16) + amt);
  const gg = clamp(((n >> 8) & 255) + amt);
  const b = clamp((n & 255) + amt);
  return '#' + ((r << 16) | (gg << 8) | b).toString(16).padStart(6, '0');
}
