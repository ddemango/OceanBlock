// Shared helpers for the Birds & Blooms paint-by-number artworks.
import { blob, curve, line, poly, stroke, xf, type Xf } from '../../art/kit';
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

/** A ribbon of varying width following a smooth curve (stems, branches). off shifts it sideways. */
export function band(pts: Pt[], w0: number, w1: number, off0 = 0, off1 = 0): string {
  const s = sample(pts);
  const left: Pt[] = [], right: Pt[] = [];
  s.forEach((p, i) => {
    const a = s[Math.max(0, i - 1)], b = s[Math.min(s.length - 1, i + 1)];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const nx = -(b[1] - a[1]) / len, ny = (b[0] - a[0]) / len;
    const t = i / (s.length - 1);
    const w = (w0 + (w1 - w0) * t) / 2, o = off0 + (off1 - off0) * t;
    left.push(clampPt([p[0] + nx * (o + w), p[1] + ny * (o + w)]));
    right.push(clampPt([p[0] + nx * (o - w), p[1] + ny * (o - w)]));
  });
  return poly([...left, ...right.reverse()]);
}

/** Point on a band's centre line at parameter t (0..1), for a manual number position. */
export function bandAt(pts: Pt[], t: number, off = 0): Pt {
  const s = sample(pts);
  const i = Math.max(1, Math.min(s.length - 2, Math.round(t * (s.length - 1))));
  const a = s[i - 1], b = s[i + 1];
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
  return [Math.round(s[i][0] - ((b[1] - a[1]) / len) * off), Math.round(s[i][1] + ((b[0] - a[0]) / len) * off)];
}

/** Smooth edge through pts, closed with straight lines through the given corner points. */
export function edged(pts: Pt[], corners: Pt[]): string {
  return poly([...sample(pts, 8).map(clampPt), ...corners]);
}

/** Lobed flower outline with n rounded petals. */
export function blossomPath(cx: number, cy: number, r: number, n = 5, inner = 0.5, rot = -90): string {
  const pts: Pt[] = [];
  for (let i = 0; i < n * 2; i++) pts.push(polar(cx, cy, i % 2 ? r * inner : r, rot + (i * 180) / n));
  return blob(pts, 1.1);
}

/**
 * A two-tone leaf split along its midrib, growing from (x,y) along rot.
 * shape 'ovate' is broad near the base (hibiscus, holly-free), 'lance' is narrow.
 */
export function leafHalves(
  c: Canvas, id: string, x: number, y: number, len: number, wid: number, rot: number,
  colUp: string, colDown: string, vein: string, shape: 'ovate' | 'lance' = 'lance', gloss = '', veinFrom = 0,
) {
  const t: Xf = { rot, x, y };
  const L = len, w = wid;
  const up = shape === 'ovate'
    ? `M0 0C${0.04 * L} ${-1.05 * w} ${0.56 * L} ${-1.12 * w} ${L} 0Q${0.5 * L} ${-0.05 * w} 0 0Z`
    : `M0 0Q${0.42 * L} ${-w} ${L} 0Q${0.5 * L} ${-0.06 * w} 0 0Z`;
  const dn = shape === 'ovate'
    ? `M0 0C${0.04 * L} ${1.05 * w} ${0.56 * L} ${1.12 * w} ${L} 0Q${0.5 * L} ${0.05 * w} 0 0Z`
    : `M0 0Q${0.42 * L} ${w} ${L} 0Q${0.5 * L} ${0.06 * w} 0 0Z`;
  c.R(`${id}-a`, xf(up, t), colUp);
  c.R(`${id}-b`, xf(dn, t), colDown);
  const v0 = Math.max(4, L * veinFrom);
  c.D(xf(curve([[v0, 0], [(v0 + L) / 2, w * 0.03], [L - 4, 0]]), t), vein, 1.6, 0.7);
  let v = '';
  for (let i = 1; i <= 4; i++) {
    const bx = (L * i) / 5.2;
    if (bx < L * veinFrom) continue;
    const k = shape === 'ovate' ? 1 - i * 0.12 : 1 - Math.abs(i - 2) / 4;
    v += line([[bx, 0], [bx + L * 0.12, -w * 0.5 * k]]) + line([[bx, 0], [bx + L * 0.12, w * 0.5 * k]]);
  }
  c.D(xf(v, t), vein, 1, 0.45);
  if (gloss && veinFrom < 0.25) c.D(xf(curve([[L * 0.2, -w * 0.42], [L * 0.45, -w * 0.58], [L * 0.7, -w * 0.4]]), t), gloss, 3, 0.55);
}

/** Half of a spiky holly leaf (upper side, -y), along +x. */
export function hollyHalf(L: number, w: number, side: 1 | -1, spikes = 3): string {
  const pts: Pt[] = [[0, 0]];
  const n = spikes;
  for (let i = 0; i <= n; i++) {
    const t = (i + 0.5) / (n + 1);
    const prof = Math.sin(Math.PI * Math.min(1, t * 1.05)) * w;
    // valley then spike
    const tv = i / (n + 1) + 0.02;
    if (i > 0) pts.push([tv * L, side * -Math.sin(Math.PI * tv) * w * 0.62]);
    pts.push([t * L, side * -(prof * 1.05 + 4)]);
  }
  pts.push([L * 1.06, 0]);
  pts.push([L * 0.5, side * -w * 0.04]);
  return poly(pts);
}
