// Drawing toolkit used to author every illustration in code.
// Every helper returns a path string limited to absolute M L C Q Z commands.
import { transformPath, type Matrix, type Pt } from './geometry';
import type { Shape } from './types';

const f = (n: number) => String(Math.round(n * 10) / 10);
const K = 0.5522847498;

export function rect(x: number, y: number, w: number, h: number, r = 0): string {
  if (r <= 0) return `M${f(x)} ${f(y)}L${f(x + w)} ${f(y)}L${f(x + w)} ${f(y + h)}L${f(x)} ${f(y + h)}Z`;
  r = Math.min(r, w / 2, h / 2);
  return (
    `M${f(x + r)} ${f(y)}L${f(x + w - r)} ${f(y)}Q${f(x + w)} ${f(y)} ${f(x + w)} ${f(y + r)}` +
    `L${f(x + w)} ${f(y + h - r)}Q${f(x + w)} ${f(y + h)} ${f(x + w - r)} ${f(y + h)}` +
    `L${f(x + r)} ${f(y + h)}Q${f(x)} ${f(y + h)} ${f(x)} ${f(y + h - r)}L${f(x)} ${f(y + r)}Q${f(x)} ${f(y)} ${f(x + r)} ${f(y)}Z`
  );
}

export function ellipse(cx: number, cy: number, rx: number, ry: number, rotDeg = 0): string {
  const ox = rx * K, oy = ry * K;
  const d =
    `M${f(cx - rx)} ${f(cy)}C${f(cx - rx)} ${f(cy - oy)} ${f(cx - ox)} ${f(cy - ry)} ${f(cx)} ${f(cy - ry)}` +
    `C${f(cx + ox)} ${f(cy - ry)} ${f(cx + rx)} ${f(cy - oy)} ${f(cx + rx)} ${f(cy)}` +
    `C${f(cx + rx)} ${f(cy + oy)} ${f(cx + ox)} ${f(cy + ry)} ${f(cx)} ${f(cy + ry)}` +
    `C${f(cx - ox)} ${f(cy + ry)} ${f(cx - rx)} ${f(cy + oy)} ${f(cx - rx)} ${f(cy)}Z`;
  return rotDeg ? xf(d, { rot: rotDeg, ox: cx, oy: cy }) : d;
}

export const circle = (cx: number, cy: number, r: number) => ellipse(cx, cy, r, r);

/** Closed straight-edged polygon. */
export function poly(pts: Pt[]): string {
  return pts.map(([x, y], i) => `${i ? 'L' : 'M'}${f(x)} ${f(y)}`).join('') + 'Z';
}

/** Open straight polyline (use with a stroke). */
export function line(pts: Pt[]): string {
  return pts.map(([x, y], i) => `${i ? 'L' : 'M'}${f(x)} ${f(y)}`).join('');
}

function catmull(pts: Pt[], closed: boolean, tension: number): string {
  const n = pts.length;
  const at = (i: number): Pt => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  const segs = closed ? n : n - 1;
  for (let i = 0; i < segs; i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    const t = tension / 3;
    d += `C${f(p1[0] + (p2[0] - p0[0]) * t)} ${f(p1[1] + (p2[1] - p0[1]) * t)} ${f(p2[0] - (p3[0] - p1[0]) * t)} ${f(p2[1] - (p3[1] - p1[1]) * t)} ${f(p2[0])} ${f(p2[1])}`;
  }
  return closed ? d + 'Z' : d;
}

/** Closed smooth shape through the given points. tension 1 = round, 0 = polygon. */
export const blob = (pts: Pt[], tension = 1) => catmull(pts, true, tension);

/** Open smooth curve through the given points (use with a stroke). */
export const curve = (pts: Pt[], tension = 1) => catmull(pts, false, tension);

/** Pointed leaf / petal starting at (x,y), growing `len` along `rotDeg` (0 = right, 90 = down). */
export function leaf(x: number, y: number, len: number, wid: number, rotDeg = 0): string {
  const d = `M0 0Q${f(len * 0.45)} ${f(-wid)} ${f(len)} 0Q${f(len * 0.45)} ${f(wid)} 0 0Z`;
  return xf(d, { rot: rotDeg, x, y });
}

/** Rounded petal starting at (x,y), growing `len` along `rotDeg`. */
export function petal(x: number, y: number, len: number, wid: number, rotDeg = 0): string {
  const d = `M0 0C${f(len * 0.2)} ${f(-wid)} ${f(len)} ${f(-wid)} ${f(len)} 0C${f(len)} ${f(wid)} ${f(len * 0.2)} ${f(wid)} 0 0Z`;
  return xf(d, { rot: rotDeg, x, y });
}

export function star(cx: number, cy: number, rOuter: number, rInner: number, points = 5, rotDeg = -90): string {
  const pts: Pt[] = [];
  for (let i = 0; i < points * 2; i++) {
    const a = ((rotDeg + (i * 180) / points) * Math.PI) / 180;
    const r = i % 2 ? rInner : rOuter;
    pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  return poly(pts);
}

/** Pie slice or ring segment between angles a0..a1 (degrees, 0 = right, clockwise). */
export function sector(cx: number, cy: number, r: number, a0: number, a1: number, rInner = 0): string {
  const pts: Pt[] = [];
  const steps = Math.max(2, Math.ceil(Math.abs(a1 - a0) / 8));
  for (let i = 0; i <= steps; i++) {
    const a = ((a0 + ((a1 - a0) * i) / steps) * Math.PI) / 180;
    pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  if (rInner > 0) {
    for (let i = steps; i >= 0; i--) {
      const a = ((a0 + ((a1 - a0) * i) / steps) * Math.PI) / 180;
      pts.push([cx + Math.cos(a) * rInner, cy + Math.sin(a) * rInner]);
    }
  } else pts.push([cx, cy]);
  return poly(pts);
}

/** A closed band whose top edge is a wave from x0..x1 at height y, filled down to `bottom`. */
export function waveBand(x0: number, x1: number, y: number, amp: number, wavelength: number, bottom: number, phase = 0): string {
  const pts: Pt[] = [];
  const steps = Math.max(4, Math.ceil(((x1 - x0) / wavelength) * 8));
  for (let i = 0; i <= steps; i++) {
    const x = x0 + ((x1 - x0) * i) / steps;
    pts.push([x, y + Math.sin(((x - x0) / wavelength) * Math.PI * 2 + phase) * amp]);
  }
  return line(pts) + `L${f(x1)} ${f(bottom)}L${f(x0)} ${f(bottom)}Z`;
}

export interface Xf { x?: number; y?: number; s?: number; sx?: number; sy?: number; rot?: number; ox?: number; oy?: number }

/** Transform a path: scale and rotate about (ox,oy), then translate by (x,y). */
export function xf(d: string, t: Xf): string {
  const sx = t.sx ?? t.s ?? 1, sy = t.sy ?? t.s ?? 1;
  const a = ((t.rot ?? 0) * Math.PI) / 180;
  const cos = Math.cos(a), sin = Math.sin(a);
  const ox = t.ox ?? 0, oy = t.oy ?? 0;
  const m: Matrix = [cos * sx, sin * sx, -sin * sy, cos * sy, 0, 0];
  m[4] = ox - (m[0] * ox + m[2] * oy) + (t.x ?? 0);
  m[5] = oy - (m[1] * ox + m[3] * oy) + (t.y ?? 0);
  return transformPath(d, m);
}

/** Build a shape. */
export function sh(d: string, fill: string, extra: Partial<Shape> = {}): Shape {
  return { d, fill, ...extra };
}

/** Build a stroke-only shape. */
export function stroke(d: string, color: string, width = 2, extra: Partial<Shape> = {}): Shape {
  return { d, fill: 'none', stroke: color, strokeWidth: width, ...extra };
}

/** Transform a list of shapes (stroke widths scale with `s`). */
export function place(shapes: Shape[], t: Xf): Shape[] {
  const s = Math.sqrt(Math.abs((t.sx ?? t.s ?? 1) * (t.sy ?? t.s ?? 1)));
  return shapes.map((p) => ({ ...p, d: xf(p.d, t), strokeWidth: p.strokeWidth ? p.strokeWidth * s : p.strokeWidth }));
}

// ---- colour helpers ----
const hexToRgb = (h: string): [number, number, number] => {
  const s = h.replace('#', '');
  const v = s.length === 3 ? s.split('').map((c) => c + c).join('') : s;
  return [parseInt(v.slice(0, 2), 16), parseInt(v.slice(2, 4), 16), parseInt(v.slice(4, 6), 16)];
};
const rgbToHex = (r: number, g: number, b: number) =>
  '#' + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');

/** Mix two hex colours. t=0 → a, t=1 → b. */
export function mix(a: string, b: string, t: number): string {
  const A = hexToRgb(a), B = hexToRgb(b);
  return rgbToHex(A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t);
}
/** Lighten (amt > 0) or darken (amt < 0) a hex colour; amt in -1..1. */
export const shade = (hex: string, amt: number) => (amt >= 0 ? mix(hex, '#ffffff', amt) : mix(hex, '#000000', -amt));

// ---- gradients ----
export function linearGradient(id: string, stops: [number, string][], x1 = 0, y1 = 0, x2 = 0, y2 = 1): string {
  return `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops
    .map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`)
    .join('')}</linearGradient>`;
}
export function radialGradient(id: string, stops: [number, string][], cx = 0.5, cy = 0.5, r = 0.5): string {
  return `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops
    .map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`)
    .join('')}</radialGradient>`;
}

// ---- seeded random ----
export interface Rng { next(): number; range(a: number, b: number): number; int(a: number, b: number): number; pick<T>(arr: T[]): T }
export function rng(seed: number): Rng {
  let s = seed >>> 0;
  const next = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    range: (a, b) => a + next() * (b - a),
    int: (a, b) => Math.floor(a + next() * (b - a + 1)),
    pick: (arr) => arr[Math.floor(next() * arr.length)],
  };
}
