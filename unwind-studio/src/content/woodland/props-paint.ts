// Shared helpers for the Woodland Cottage paint-by-number artworks.
import { blob, curve, poly, stroke, xf, type Xf } from '../../art/kit';
import type { Pt } from '../../art/geometry';
import type { Shape } from '../../art/types';
import type { PaintRegion } from '../types';

export const W = 1000, H = 1250;

export function canvas() {
  const regions: PaintRegion[] = [];
  const detail: Shape[] = [];
  const R = (id: string, d: string, color: string, label?: Pt) => {
    regions.push(label ? { id, d, color, label } : { id, d, color });
  };
  const D = (d: string, c: string, w = 1.4, o = 0.7) => detail.push(stroke(d, c, w, { opacity: o }));
  return { regions, detail, R, D };
}

export const clampPt = ([x, y]: Pt): Pt => [Math.max(0, Math.min(W, x)), Math.max(0, Math.min(H, y))];

/** Clamp every coordinate pair of a path into the canvas (keeps curves inside by the convex-hull property). */
export function clampPath(d: string, m = 1): string {
  return d.replace(/(-?[\d.]+) (-?[\d.]+)/g, (_, x, y) => `${Math.max(m, Math.min(W - m, +x))} ${Math.max(m, Math.min(H - m, +y))}`);
}

/** Dense samples of a smooth open curve through pts. */
export function sample(pts: Pt[], per = 10): Pt[] {
  const out: Pt[] = [];
  const at = (i: number) => pts[Math.max(0, Math.min(pts.length - 1, i))];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    for (let k = 0; k < per; k++) {
      const t = k / per, t2 = t * t, t3 = t2 * t;
      out.push([
        0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
        0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3),
      ]);
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
}

/** Ribbon of varying width following a smooth curve; off shifts it sideways. t0..t1 selects a portion. */
export function band(pts: Pt[], w0: number, w1: number, off0 = 0, off1 = 0, t0 = 0, t1 = 1): string {
  const s = sample(pts);
  const left: Pt[] = [], right: Pt[] = [];
  s.forEach((p, i) => {
    const t = i / (s.length - 1);
    if (t < t0 - 1e-6 || t > t1 + 1e-6) return;
    const a = s[Math.max(0, i - 1)], b = s[Math.min(s.length - 1, i + 1)];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const nx = -(b[1] - a[1]) / len, ny = (b[0] - a[0]) / len;
    const w = (w0 + (w1 - w0) * t) / 2, o = off0 + (off1 - off0) * t;
    left.push(clampPt([p[0] + nx * (o + w), p[1] + ny * (o + w)]));
    right.push(clampPt([p[0] + nx * (o - w), p[1] + ny * (o - w)]));
  });
  return poly([...left, ...right.reverse()]);
}

/** Point on a curve at parameter t (0..1), offset sideways. */
export function bandAt(pts: Pt[], t: number, off = 0): Pt {
  const s = sample(pts);
  const i = Math.max(1, Math.min(s.length - 2, Math.round(t * (s.length - 1))));
  const a = s[i - 1], b = s[i + 1];
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
  return [Math.round(s[i][0] - ((b[1] - a[1]) / len) * off), Math.round(s[i][1] + ((b[0] - a[0]) / len) * off)];
}

/** Direction (degrees) of a curve at t. */
export function bandDir(pts: Pt[], t: number): number {
  const s = sample(pts);
  const i = Math.max(1, Math.min(s.length - 2, Math.round(t * (s.length - 1))));
  const a = s[i - 1], b = s[i + 1];
  return (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
}

/** Smooth edge through pts, closed with straight lines through corner points. */
export function edged(pts: Pt[], corners: Pt[]): string {
  return poly([...sample(pts, 8).map(clampPt), ...corners]);
}

/** A leafy, lobed clump (foliage) around a centre. */
export function lobed(cx: number, cy: number, rx: number, ry: number, n: number, depth: number, rot = 0): string {
  const pts: Pt[] = [];
  for (let i = 0; i < n * 2; i++) {
    const a = ((rot + (i * 180) / n) * Math.PI) / 180;
    const k = i % 2 ? 1 - depth : 1;
    pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  return blob(pts, 0.9);
}

/** Leaflet shape: pointed tip, rounded base, growing from origin along +x. */
export function leaflet(len: number, wid: number): string {
  return blob([[0, 0], [len * 0.25, -wid * 0.9], [len * 0.65, -wid * 0.7], [len, 0], [len * 0.65, wid * 0.7], [len * 0.25, wid * 0.9]], 0.9);
}

/**
 * A fern frond: a rachis band plus `n` leaflets per side, shrinking toward the tip.
 * Leaflets alternate between colA and colB. Returns nothing; writes into R/D.
 */
export function fern(
  R: (id: string, d: string, c: string, l?: Pt) => void,
  D: (d: string, c: string, w?: number, o?: number) => void,
  id: string, pts: Pt[], n: number, leafLen: number, colA: string, colB: string, stemCol: string, vein = '#2c4422',
) {
  for (let i = 0; i < n; i++) {
    const t = 0.18 + (i / n) * 0.76;
    const k = 1 - (i / n) * 0.62;
    const [x, y] = bandAt(pts, t);
    const dir = bandDir(pts, t);
    const L = leafLen * k, Wd = leafLen * 0.3 * k;
    for (const side of [-1, 1]) {
      const rot = dir + side * 56;
      const tf: Xf = { rot, x, y };
      R(`${id}-l${i + 1}${side < 0 ? 'a' : 'b'}`, clampPath(xf(leaflet(L, Wd), tf)), (i + (side < 0 ? 0 : 1)) % 2 ? colB : colA);
      let v = curve([[4, 0], [L * 0.5, Wd * 0.05], [L * 0.9, 0]]);
      for (let j = 1; j <= 4; j++) {
        const bx = (L * j) / 5.2, k2 = 1 - j / 6;
        v += curve([[bx, 0], [bx + L * 0.08, -Wd * 0.4 * k2], [bx + L * 0.12, -Wd * 0.72 * k2]]) + curve([[bx, 0], [bx + L * 0.08, Wd * 0.4 * k2], [bx + L * 0.12, Wd * 0.72 * k2]]);
      }
      D(xf(v, tf), vein, 1.1, 0.5);
    }
  }
  const [tx, ty] = bandAt(pts, 0.97);
  R(`${id}-tip`, clampPath(xf(leaflet(leafLen * 0.5, leafLen * 0.14), { rot: bandDir(pts, 0.97) - 10, x: tx, y: ty })), colA);
  R(`${id}-stem`, band(pts, 18, 11), stemCol);
}
