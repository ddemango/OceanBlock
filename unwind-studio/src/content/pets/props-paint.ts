// Shared drawing helpers for the Paws & Whiskers paint-by-number artworks.
import { circle, poly, line, stroke, xf } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { PaintRegion } from '../types';

export const W = 1000, H = 1250;
export type Pt = [number, number];

const n = (v: number) => String(Math.round(v * 10) / 10);
export const M = (x: number, y: number) => `M${n(x)} ${n(y)}`;
export const L = (x: number, y: number) => `L${n(x)} ${n(y)}`;
export const Q = (cx: number, cy: number, x: number, y: number) => `Q${n(cx)} ${n(cy)} ${n(x)} ${n(y)}`;
export const C = (a: number, b: number, c: number, d: number, x: number, y: number) => `C${n(a)} ${n(b)} ${n(c)} ${n(d)} ${n(x)} ${n(y)}`;

export interface Canvas {
  regions: PaintRegion[];
  detail: Shape[];
  /** Add a region. */
  R(id: string, d: string, color: string, label?: Pt): void;
  /** Add a thin decorative stroke. */
  D(d: string, color: string, width: number, opacity?: number): void;
  /** Add a tiny filled accent (an eye highlight). */
  F(d: string, color: string): void;
}

export function canvas(): Canvas {
  const regions: PaintRegion[] = [];
  const detail: Shape[] = [];
  return {
    regions,
    detail,
    R: (id, d, color, label) => { regions.push(label ? { id, d, color, label } : { id, d, color }); },
    D: (d, color, width, opacity = 1) => { detail.push(stroke(d, color, width, opacity < 1 ? { opacity } : {})); },
    F: (d, color) => { detail.push({ d, fill: color }); },
  };
}

const rad = (deg: number) => (deg * Math.PI) / 180;
const clampPt = ([x, y]: Pt): Pt => [Math.max(0, Math.min(W, x)), Math.max(0, Math.min(H, y))];

/** Mirror a path left-to-right about the vertical line x = cx. */
export const mirror = (d: string, cx: number) => xf(d, { sx: -1, sy: 1, ox: cx });

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

/** The part t0..t1 (0..1 along its length) of a tapering ribbon that follows a smooth curve. */
export function bandSlice(pts: Pt[], w0: number, w1: number, t0: number, t1: number, cap = false): string {
  const s = sample(pts, 12);
  const last = s.length - 1;
  const i0 = Math.round(t0 * last), i1 = Math.round(t1 * last);
  const left: Pt[] = [], right: Pt[] = [];
  for (let i = i0; i <= i1; i++) {
    const p = s[i], a = s[Math.max(0, i - 1)], b = s[Math.min(last, i + 1)];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const nx = -(b[1] - a[1]) / len, ny = (b[0] - a[0]) / len;
    const w = (w0 + (w1 - w0) * (i / last)) / 2;
    left.push(clampPt([p[0] + nx * w, p[1] + ny * w]));
    right.push(clampPt([p[0] - nx * w, p[1] - ny * w]));
  }
  const tip: Pt[] = [];
  if (cap) {
    // round the far end with a half circle
    const p = s[i1], a = left[left.length - 1];
    const r = Math.hypot(a[0] - p[0], a[1] - p[1]), a0 = Math.atan2(a[1] - p[1], a[0] - p[0]);
    for (let k = 1; k < 10; k++) { const t = a0 - (Math.PI * k) / 10; tip.push(clampPt([p[0] + Math.cos(t) * r, p[1] + Math.sin(t) * r])); }
  }
  return poly([...left, ...tip, ...right.reverse()]);
}

/** A ribbon of tapering width following a smooth curve (tails, strands, handles). */
export const band = (pts: Pt[], w0: number, w1: number, cap = false) => bandSlice(pts, w0, w1, 0, 1, cap);

/** Smooth edge through pts, closed with straight lines through the given corner points. */
export function edged(pts: Pt[], corners: Pt[]): string {
  return poly([...sample(pts, 8).map(clampPt), ...corners]);
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

/** A puffy cloud of foam or foliage: `bumps` rounded lobes around an ellipse. */
export function puff(cx: number, cy: number, rx: number, ry: number, bumps: number, seed = 0): string {
  const pts: Pt[] = [];
  const k = bumps * 8;
  for (let i = 0; i < k; i++) {
    const a = (i / k) * Math.PI * 2;
    const f = 1 + 0.09 * Math.abs(Math.sin((a * bumps) / 2 + seed)) - 0.045;
    pts.push([cx + Math.cos(a) * rx * f, cy + Math.sin(a) * ry * f]);
  }
  return poly(pts);
}

/** A band whose top edge is a row of rounded foam bumps and whose bottom edge is the lower half of an ellipse. */
export function foamFront(cx: number, yTop: number, hw: number, bumps: number, bumpH: number, cyBottom: number, ryBottom: number): string {
  const top: Pt[] = [], k = bumps * 10;
  for (let i = 0; i <= k; i++) {
    const u = i / k;
    top.push([cx - hw + u * hw * 2, yTop - Math.abs(Math.sin(u * Math.PI * bumps)) * bumpH * (0.7 + 0.3 * Math.sin(u * 9 + 1))]);
  }
  const bottom: Pt[] = [];
  for (let i = 0; i <= 24; i++) { const a = (Math.PI * i) / 24; bottom.push([cx + Math.cos(a) * hw, cyBottom + Math.sin(a) * ryBottom]); }
  return poly([...top, ...bottom]);
}

/** The front (lower) half of a ring seen from above: the near rim of a tub or basket. */
export function ringFront(cx: number, cy: number, rxO: number, ryO: number, rxI: number, ryI: number): string {
  const out: Pt[] = [], inn: Pt[] = [], k = 30;
  for (let i = 0; i <= k; i++) {
    const a = (Math.PI * i) / k;
    out.push([cx + Math.cos(a) * rxO, cy + Math.sin(a) * ryO]);
    inn.push([cx + Math.cos(a) * rxI, cy + Math.sin(a) * ryI]);
  }
  return poly([...out, ...inn.reverse()]);
}

/** One hoop of a round tub or basket seen slightly from above, from height y1 (half-width hw1) down to y2 (hw2). */
export function tubBand(cx: number, y1: number, hw1: number, y2: number, hw2: number, ratio: number): string {
  const a: Pt[] = [], b: Pt[] = [], k = 30;
  for (let i = 0; i <= k; i++) {
    const t = (Math.PI * i) / k;
    a.push([cx - Math.cos(t) * hw1, y1 + Math.sin(t) * hw1 * ratio]);
    b.push([cx - Math.cos(t) * hw2, y2 + Math.sin(t) * hw2 * ratio]);
  }
  return poly([...a, ...b.reverse()]);
}

function latArc(cx: number, cy: number, r: number, phi: number, tilt: number, rot: number, t0 = 0, t1 = 180): Pt[] {
  const pts: Pt[] = [], k = 16, cr = Math.cos(rad(rot)), sr = Math.sin(rad(rot));
  for (let i = 0; i <= k; i++) {
    const t = rad(t0 + ((t1 - t0) * i) / k);
    const x = r * Math.cos(rad(phi)) * Math.cos(t), y = r * Math.sin(rad(phi)) + r * Math.cos(rad(phi)) * Math.sin(t) * tilt;
    pts.push([cx + x * cr - y * sr, cy + x * sr + y * cr]);
  }
  return pts;
}

/** A stripe wrapped round a ball between "latitudes" phi1..phi2 (degrees, 0 = equator, positive = lower). */
export function sphereBand(cx: number, cy: number, r: number, phi1: number, phi2: number, tilt = 0.3, rot = 0): string {
  const top = latArc(cx, cy, r, phi1, tilt, rot, 180, 0), bot = latArc(cx, cy, r, phi2, tilt, rot, 0, 180);
  const cr = Math.cos(rad(rot)), sr = Math.sin(rad(rot));
  const edge = (a0: number, a1: number): Pt[] => {
    const pts: Pt[] = [];
    for (let i = 1; i < 6; i++) { const a = rad(a0 + ((a1 - a0) * i) / 6); const x = r * Math.cos(a), y = r * Math.sin(a); pts.push([cx + x * cr - y * sr, cy + x * sr + y * cr]); }
    return pts;
  };
  return poly([...top, ...edge(phi1, phi2), ...bot, ...edge(180 - phi2, 180 - phi1)]);
}

/** A ball of yarn: the ball, a shaded underside and a lighter wrapped stripe, plus a few strands of line work. */
export function yarnBall(c: Canvas, id: string, cx: number, cy: number, r: number, base: string, shadeCol: string, wrapCol: string, ink: string, rot = -25, withShade = true) {
  c.R(id, circle(cx, cy, r), base);
  if (withShade) c.R(`${id}-shade`, crescent(cx, cy, r, r, 15, 165, 0.34, rot * 0.3), shadeCol);
  c.R(`${id}-wrap`, sphereBand(cx, cy, r, -34, 4, 0.34, rot), wrapCol);
  let d = '';
  for (const phi of [-58, -15, 24, 44]) d += line(latArc(cx, cy, r * 0.97, phi, 0.34, rot));
  for (const phi of [-30, 10, 40]) d += line(latArc(cx, cy, r * 0.97, phi, 0.3, rot + 78, 20, 160));
  c.D(d, ink, 1.8, 0.75);
}

/** Tabby stripe: a tapered dash starting at (x, y), `len` long toward `rot` degrees (0 = right, 90 = down). */
export function stripe(x: number, y: number, len: number, wid: number, rot: number): string {
  const d = M(0, -wid * 0.42) + Q(len * 0.5, -wid * 0.62, len, 0) + Q(len * 0.5, wid * 0.62, 0, wid * 0.42) + 'Z';
  return xf(d, { rot, x, y });
}

/** A rounded cat ear: base from (x0, y0) to (x1, y1), tip at (tx, ty). */
export function ear(x0: number, y0: number, tx: number, ty: number, x1: number, y1: number): string {
  const mx0 = (x0 + tx) / 2, my0 = (y0 + ty) / 2, mx1 = (x1 + tx) / 2, my1 = (y1 + ty) / 2;
  const bx = (x0 + x1) / 2, by = (y0 + y1) / 2;
  // bow the two sides outward a little, away from the middle of the base
  const o0x = mx0 + (mx0 - bx) * 0.22, o0y = my0 + (my0 - by) * 0.22, o1x = mx1 + (mx1 - bx) * 0.22, o1y = my1 + (my1 - by) * 0.22;
  const ax = tx + (x0 - tx) * 0.12, ay = ty + (y0 - ty) * 0.12, cx = tx + (x1 - tx) * 0.12, cy = ty + (y1 - ty) * 0.12;
  return M(x0, y0) + Q(o0x, o0y, ax, ay) + Q(tx, ty, cx, cy) + Q(o1x, o1y, x1, y1) + 'Z';
}

/** Whiskers fanning from (x, y): dir 1 = to the right, -1 = to the left. */
export function whiskers(x: number, y: number, len: number, dir: 1 | -1): string {
  let d = '';
  for (const [dy, rise] of [[-8, -16], [0, 0], [8, 16]] as Pt[]) d += M(x, y + dy) + Q(x + dir * len * 0.5, y + dy + rise * 0.3, x + dir * len, y + dy + rise);
  return d;
}

/** A row of short toe lines on a paw centred at (cx, cy). */
export function toes(cx: number, cy: number, rx: number, ry: number): string {
  return line([[cx - rx * 0.33, cy + ry * 0.1], [cx - rx * 0.33, cy + ry * 0.8]]) + line([[cx + rx * 0.33, cy + ry * 0.1], [cx + rx * 0.33, cy + ry * 0.8]]);
}

/** A round, fluffy cat head: an ellipse with three soft tufts of fur on each cheek. */
export function fluffyHead(cx: number, cy: number, rx: number, ry: number, tuft = 0.075): string {
  const pts: Pt[] = [];
  for (let i = 0; i < 120; i++) {
    const deg = i * 3;
    // cheeks sit just below the widest point on both sides: 0..60 and 120..180 degrees
    const side = deg <= 60 ? deg : deg >= 120 && deg <= 180 ? 180 - deg : -1;
    const f = side < 0 ? 1 : 1 + tuft * Math.abs(Math.sin((side / 20) * Math.PI)) * (1 - side / 120);
    pts.push([cx + Math.cos(rad(deg)) * rx * f, cy + Math.sin(rad(deg)) * ry * f]);
  }
  return poly(pts);
}
