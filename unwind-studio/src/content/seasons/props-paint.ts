// Shared drawing helpers for the Four Seasons paint-by-number artworks.
import { blob, curve, poly, stroke, xf, type Xf } from '../../art/kit';
import type { Pt } from '../../art/geometry';
import type { Shape } from '../../art/types';
import type { PaintRegion } from '../types';

export const W = 1000, H = 1250;

export interface Canvas {
  regions: PaintRegion[];
  detail: Shape[];
  /** Add a region. */
  R(id: string, d: string, color: string, label?: Pt): void;
  /** Add a thin decorative stroke. */
  D(d: string, color: string, width: number, opacity?: number): void;
}

export function canvas(): Canvas {
  const regions: PaintRegion[] = [];
  const detail: Shape[] = [];
  return {
    regions,
    detail,
    R: (id, d, color, label) => { regions.push(label ? { id, d, color, label } : { id, d, color }); },
    D: (d, color, width, opacity = 1) => { detail.push(stroke(d, color, width, opacity < 1 ? { opacity } : {})); },
  };
}

const rad = (deg: number) => (deg * Math.PI) / 180;
export const polar = (cx: number, cy: number, r: number, deg: number): Pt => [cx + Math.cos(rad(deg)) * r, cy + Math.sin(rad(deg)) * r];
export const clampPt = ([x, y]: Pt): Pt => [Math.max(0, Math.min(W, x)), Math.max(0, Math.min(H, y))];
export const lerp = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

/** Dense samples of a smooth open Catmull-Rom curve through pts. */
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

/** A ribbon of tapering width following a smooth curve (stems, branches, scarves). */
export function band(pts: Pt[], w0: number, w1: number): string {
  const s = sample(pts);
  const left: Pt[] = [], right: Pt[] = [];
  s.forEach((p, i) => {
    const a = s[Math.max(0, i - 1)], b = s[Math.min(s.length - 1, i + 1)];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const nx = -(b[1] - a[1]) / len, ny = (b[0] - a[0]) / len;
    const w = (w0 + (w1 - w0) * (i / (s.length - 1))) / 2;
    left.push(clampPt([p[0] + nx * w, p[1] + ny * w]));
    right.push(clampPt([p[0] - nx * w, p[1] - ny * w]));
  });
  return poly([...left, ...right.reverse()]);
}

/** Smooth edge through pts, closed with straight lines through the given corner points. */
export function edged(pts: Pt[], corners: Pt[]): string {
  return poly([...sample(pts, 8).map(clampPt), ...corners]);
}

/** Region between two smooth edges (top edge left→right, bottom edge left→right). */
export function between(top: Pt[], bottom: Pt[]): string {
  return poly([...sample(top, 8).map(clampPt), ...sample(bottom, 8).map(clampPt).reverse()]);
}

/** Crescent hugging the edge of an ellipse between angles a0..a1 (degrees, 0 = right, 90 = down). */
export function crescent(cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, depth: number, rot = 0): string {
  const out: Pt[] = [], inn: Pt[] = [], k = 24;
  for (let i = 0; i <= k; i++) {
    const t = i / k, a = rad(a0 + (a1 - a0) * t);
    const ex = Math.cos(a) * rx, ey = Math.sin(a) * ry;
    out.push([ex, ey]);
    const f = 1 - depth * Math.sin(Math.PI * t);
    inn.push([ex * f, ey * f]);
  }
  return xf(poly([...out, ...inn.reverse().slice(1, -1)]), { rot, x: cx, y: cy });
}

/** Lobed outline with n rounded bumps (blossoms, back rings of petals). */
export function lobed(cx: number, cy: number, r: number, n = 5, inner = 0.5, rot = -90): string {
  const pts: Pt[] = [];
  for (let i = 0; i < n * 2; i++) pts.push(polar(cx, cy, i % 2 ? r * inner : r, rot + (i * 180) / n));
  return blob(pts, 1.1);
}

/** A puffy cloud (or tree crown): bumps of given radii laid along a base from x0..x1 at y. */
export function puff(cx: number, cy: number, rx: number, ry: number, bumps: number, seed = 0, flatBase = false): string {
  const pts: Pt[] = [];
  const n = bumps * 2;
  for (let i = 0; i < n; i++) {
    const a = rad(-90 + (i * 360) / n + seed);
    const bump = i % 2 ? 0.82 : 1 + 0.06 * Math.sin(i * 2.3 + seed);
    let y = cy + Math.sin(a) * ry * bump;
    if (flatBase && Math.sin(a) > 0.3) y = cy + ry * 0.45 + (Math.sin(a) - 0.3) * ry * 0.2;
    pts.push([cx + Math.cos(a) * rx * bump, y]);
  }
  return blob(pts, 1);
}

/**
 * A snow-dusted fir tree: tiers from the bottom up, each tier with a scalloped
 * snow ledge along its lower edge. Returns [suffix, d, role] with role 'tier' | 'snow' | 'trunk'.
 */
export function fir(cx: number, baseY: number, h: number, w: number, tiers = 3, ledges = true): [string, string, 'tier' | 'snow' | 'trunk'][] {
  const out: [string, string, 'tier' | 'snow' | 'trunk'][] = [];
  const trunkH = h * 0.12;
  out.push(['trunk', poly([[cx - w * 0.08, baseY - trunkH * 1.6], [cx + w * 0.08, baseY - trunkH * 1.6], [cx + w * 0.1, baseY], [cx - w * 0.1, baseY]]), 'trunk']);
  const top = baseY - h;
  const body = h - trunkH;
  for (let i = 0; i < tiers; i++) {
    const yb = baseY - trunkH - (body * i) / (tiers + 0.6);
    const yt = i === tiers - 1 ? top : Math.max(top + h * 0.14, yb - body * 0.62);
    const hw = (w / 2) * (1 - i / (tiers + 0.8));
    const pts: Pt[] = [[cx, yt]];
    // right edge down, then a drooping scalloped hem back to the left
    pts.push([cx + hw * 0.55, yt + (yb - yt) * 0.55]);
    pts.push([cx + hw, yb]);
    const sc = 4;
    for (let k = 1; k < sc * 2; k++) {
      const x = cx + hw - (2 * hw * k) / (sc * 2);
      pts.push([x, yb + (k % 2 ? -h * 0.025 : h * 0.012)]);
    }
    pts.push([cx - hw, yb]);
    pts.push([cx - hw * 0.55, yt + (yb - yt) * 0.55]);
    out.push([`tier${i + 1}`, poly(pts.map(clampPt)), 'tier']);
    if (ledges) {
      const th = Math.max(16, h * 0.05);
      const up: Pt[] = [], dn: Pt[] = [];
      for (let k = 0; k <= 10; k++) {
        const u = k / 10, x = cx - hw * 0.94 + 1.88 * hw * u;
        dn.push([x, yb - h * 0.004 + Math.sin(u * Math.PI * 4) * h * 0.012]);
        up.push([x, yb - th - Math.sin(u * Math.PI) * th * 0.3]);
      }
      out.push([`snow${i + 1}`, poly(sample([...dn, ...up.reverse(), dn[0]], 4).map(clampPt)), 'snow']);
    }
  }
  return out;
}

/** Two-tone leaf split along its midrib, growing from (x,y) along rot (0 = right). */
export function leafPair(L: number, w: number): [string, string] {
  const up = `M0 0C${0.1 * L} ${-1.0 * w} ${0.6 * L} ${-1.05 * w} ${L} 0Q${0.5 * L} ${-0.06 * w} 0 0Z`;
  const dn = `M0 0C${0.1 * L} ${1.0 * w} ${0.6 * L} ${1.05 * w} ${L} 0Q${0.5 * L} ${0.06 * w} 0 0Z`;
  return [up, dn];
}

export const at = (d: string, t: Xf) => xf(d, t);
export { curve };

/** Closed smooth shape through pts, kept inside the canvas. */
export function soft(pts: Pt[], per = 8): string {
  const n = pts.length;
  const s = sample([pts[n - 1], ...pts, pts[0], pts[1]], per);
  // one lap, starting at pts[0] with its proper neighbours on both sides
  return poly(s.slice(per, per + n * per).map(clampPt));
}
