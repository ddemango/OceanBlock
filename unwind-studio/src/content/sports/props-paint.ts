// Shared drawing helpers for the Game Day paint-by-number artworks.
import { blob, poly, line, curve, xf, sector, stroke, ellipse } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { PaintRegion } from '../types';

export type Pt = [number, number];
const n = (v: number) => String(Math.round(v * 10) / 10);
export const M = (x: number, y: number) => `M${n(x)} ${n(y)}`;
export const L = (x: number, y: number) => `L${n(x)} ${n(y)}`;
export const Q = (cx: number, cy: number, x: number, y: number) => `Q${n(cx)} ${n(cy)} ${n(x)} ${n(y)}`;
export const C = (a: number, b: number, c: number, d: number, x: number, y: number) => `C${n(a)} ${n(b)} ${n(c)} ${n(d)} ${n(x)} ${n(y)}`;

export const lerp = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
/** Point inside a quad (a top-left, b top-right, c bottom-right, d bottom-left) at (u, v) in 0..1. */
export const quadAt = (a: Pt, b: Pt, c: Pt, d: Pt, u: number, v: number): Pt => lerp(lerp(a, b, u), lerp(d, c, u), v);
/** Sub-quad of a quad between u0..u1, v0..v1. */
export const subQuad = (a: Pt, b: Pt, c: Pt, d: Pt, u0: number, u1: number, v0: number, v1: number) =>
  poly([quadAt(a, b, c, d, u0, v0), quadAt(a, b, c, d, u1, v0), quadAt(a, b, c, d, u1, v1), quadAt(a, b, c, d, u0, v1)]);

/** Region + detail collector. */
export function canvas() {
  const regions: PaintRegion[] = [];
  const detail: Shape[] = [];
  const R = (id: string, d: string, color: string, label?: [number, number]) => {
    regions.push(label ? { id, d, color, label } : { id, d, color });
  };
  const D = (d: string, col: string, w = 1.6, opacity?: number) => {
    detail.push(stroke(d, col, w, opacity === undefined ? {} : { opacity }));
  };
  return { regions, detail, R, D };
}

/** A straight bar of width w between two points (posts, frame tubes, rods). */
export function bar(a: Pt, b: Pt, w: number, w2 = w): string {
  const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len, ny = dx / len;
  return poly([[a[0] + nx * w / 2, a[1] + ny * w / 2], [b[0] + nx * w2 / 2, b[1] + ny * w2 / 2], [b[0] - nx * w2 / 2, b[1] - ny * w2 / 2], [a[0] - nx * w / 2, a[1] - ny * w / 2]]);
}

/** Half of a ring (top = upper half, else lower half). */
export const halfRing = (cx: number, cy: number, r: number, rIn: number, top: boolean) =>
  top ? sector(cx, cy, r, 180, 360, rIn) : sector(cx, cy, r, 0, 180, rIn);

/** Points of a closed smooth loop through the given points (Catmull-Rom). */
export function smoothClosed(pts: Pt[], steps = 6): Pt[] {
  const n2 = pts.length, out: Pt[] = [];
  const at = (i: number) => pts[(i + n2) % n2];
  for (let i = 0; i < n2; i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    for (let s = 0; s < steps; s++) {
      const t = s / steps, t2 = t * t, t3 = t2 * t;
      out.push([
        0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
        0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3),
      ]);
    }
  }
  return out;
}

/** Clamp points into the canvas rectangle. */
export const clampPts = (pts: Pt[], w = 1000, h = 1250): Pt[] => pts.map(([x, y]) => [Math.max(0, Math.min(w, x)), Math.max(0, Math.min(h, y))]);

/** A billowy tree canopy / bush: bumpy closed outline around (cx, cy), clamped to the canvas. */
export function canopy(cx: number, cy: number, rx: number, ry: number, bumps: number, depth = 0.12, phase = 0, flatBottom = false): string {
  const pts: Pt[] = [];
  const k = bumps * 2;
  for (let i = 0; i < k; i++) {
    const a = phase + (i / k) * Math.PI * 2;
    const r = i % 2 ? 1 - depth : 1;
    let y = cy + Math.sin(a) * ry * r;
    if (flatBottom && y > cy + ry * 0.55) y = cy + ry * 0.55;
    pts.push([cx + Math.cos(a) * rx * r, y]);
  }
  return poly(clampPts(smoothClosed(pts, 5)));
}

/** Crescent hugging the edge of an ellipse between angles a0..a1 (degrees, 0 = right, 90 = down). */
export function crescent(cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, depth: number, rot = 0): string {
  const out: Pt[] = [], inn: Pt[] = [], k = 20;
  for (let i = 0; i <= k; i++) {
    const t = i / k, a = ((a0 + (a1 - a0) * t) * Math.PI) / 180;
    const ex = Math.cos(a) * rx, ey = Math.sin(a) * ry;
    out.push([ex, ey]);
    const f = 1 - depth * Math.sin(Math.PI * t);
    inn.push([ex * f, ey * f]);
  }
  return xf(poly([...out, ...inn.reverse().slice(1, -1)]), { rot, x: cx, y: cy });
}

/** Smoothly sampled points along a polyline-ish cubic path through control points. */
export function sample(pts: Pt[], steps = 8): Pt[] {
  const out: Pt[] = [];
  const n2 = pts.length;
  const at = (i: number) => pts[Math.max(0, Math.min(n2 - 1, i))];
  for (let i = 0; i < n2 - 1; i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    for (let s = 0; s < steps; s++) {
      const t = s / steps, t2 = t * t, t3 = t2 * t;
      out.push([
        0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
        0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3),
      ]);
    }
  }
  out.push(at(n2 - 1));
  return out;
}

/**
 * A classic panelled ball seen face-on: returns the dark patches (centre pentagon plus
 * five edge patches clipped to the rim) and the seam lines.
 */
export function panelBall(cx: number, cy: number, r: number, rot = 0) {
  const ang = (i: number, off = 0) => ((rot - 90 + off + i * 72) * Math.PI) / 180;
  const pc = r * 0.3;
  const P = (a: number, d: number): Pt => [cx + Math.cos(a) * d, cy + Math.sin(a) * d];
  const centre: Pt[] = [0, 1, 2, 3, 4].map((i) => P(ang(i), pc));
  const edge: string[] = [];
  const w = 0.34;
  // The five neighbouring pentagons lie beyond the centre pentagon's corners, cut by the rim.
  for (let i = 0; i < 5; i++) {
    const a = ang(i);
    const raw: Pt[] = [P(a, r * 0.64), P(a + w, r * 0.8), P(a + w * 0.8, r * 1.2), P(a - w * 0.8, r * 1.2), P(a - w, r * 0.8)];
    const pts: Pt[] = [];
    for (let j = 0; j < raw.length; j++) {
      const p = raw[j], q = raw[(j + 1) % raw.length];
      for (let s = 0; s < 6; s++) {
        let [x, y] = lerp(p, q, s / 6);
        const dx = x - cx, dy = y - cy, d = Math.hypot(dx, dy);
        if (d > r * 0.985) { x = cx + (dx / d) * r * 0.985; y = cy + (dy / d) * r * 0.985; }
        pts.push([x, y]);
      }
    }
    edge.push(poly(pts));
  }
  let seams = '';
  for (let i = 0; i < 5; i++) {
    const a = ang(i);
    seams += line([P(a, pc), P(a, r * 0.64)]);
    seams += line([P(a + w, r * 0.8), P(a + (36 * Math.PI) / 180, r * 0.92), P(ang(i + 1) - w, r * 0.8)]);
  }
  return { centre: poly(centre), edge, seams };
}

/**
 * A side-view shoe (toe points to +x when dir = 1). Origin is the ground under the heel,
 * length `len`. Returns sole, upper, toe cap, heel tab, collar opening and lace line.
 */
export function shoe(x: number, y: number, len: number, dir: 1 | -1 = 1, high = 1) {
  const s = len / 300;
  const t = (d: string) => xf(d, { x, y, sx: s * dir, sy: s });
  const sole = t(M(0, 0) + L(300, 0) + Q(318, -4, 312, -22) + L(4, -22) + Q(-6, -14, 0, 0) + 'Z');
  const upper = t(blob([[6, -20], [2, -70 * high], [16, -118 * high], [70, -124 * high], [110, -104 * high], [170, -82], [236, -62], [286, -48], [306, -36], [308, -22]], 0.6));
  const toe = t(M(232, -20) + Q(234, -58, 262, -60) + Q(300, -52, 312, -32) + Q(314, -22, 306, -20) + 'Z');
  const heel = t(M(4, -20) + Q(-2, -60, 8, -96 * high) + Q(40, -90 * high, 46, -60) + Q(44, -30, 40, -20) + 'Z');
  const collar = t(ellipse(60, -116 * high, 44, 10, 8));
  const laces = t(line([[96, -100 * high], [118, -86]]) + line([[122, -96 * high + 4], [146, -80]]) + line([[148, -90], [172, -74]]) + line([[174, -82], [198, -66]]));
  const stripe = t(M(90, -40) + Q(130, -82, 176, -84) + L(188, -70) + Q(146, -66, 112, -32) + 'Z');
  return { sole, upper, toe, heel, collar, laces, stripe, studs: (count: number) => {
    const out: string[] = [];
    for (let i = 0; i < count; i++) {
      const sx2 = 30 + i * (250 / Math.max(1, count - 1));
      out.push(t(poly([[sx2 - 16, -2], [sx2 + 16, -2], [sx2 + 11, 18], [sx2 - 11, 18]])));
    }
    return out;
  } };
}

/** Thin grass blades along a baseline for detail work, skipping the x ranges in `skip`. */
export function grassTufts(x0: number, x1: number, y: number, count: number, h: number, seed = 1, skip: [number, number][] = []): string {
  let d = '';
  let s = seed;
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  for (let i = 0; i < count; i++) {
    const x = x0 + ((x1 - x0) * (i + rnd() * 0.6)) / count;
    const hh = h * (0.6 + rnd() * 0.6);
    const lean = 2 - rnd() * 6, tip = 6 - rnd() * 12;
    if (skip.some(([a, b]) => x > a - 14 && x < b + 14)) continue;
    d += curve([[x, y], [x + lean, y - hh * 0.5], [x + tip, y - hh]]);
  }
  return d;
}

export { blob, poly, line, curve, xf, sector, ellipse };

/** Points of a band whose top edge is a gentle wave from x0..x1 at height y, filled down to `bottom`. */
export function waveTop(x0: number, x1: number, y: number, amp: number, wavelength: number, bottom: number, phase = 0): Pt[] {
  const pts: Pt[] = [];
  const steps = Math.max(4, Math.ceil(((x1 - x0) / wavelength) * 8));
  for (let i = 0; i <= steps; i++) {
    const x = x0 + ((x1 - x0) * i) / steps;
    pts.push([x, y + Math.sin(((x - x0) / wavelength) * Math.PI * 2 + phase) * amp]);
  }
  pts.push([x1, bottom], [x0, bottom]);
  return pts;
}
