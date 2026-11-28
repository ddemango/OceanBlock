// Shared drawing helpers for the Under the Sea paint-by-number artworks.
import { poly, blob, circle, xf, stroke } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { PaintRegion } from '../types';

export type Pt = [number, number];
const n = (v: number) => String(Math.round(v * 10) / 10);
export const M = (x: number, y: number) => `M${n(x)} ${n(y)}`;
export const L = (x: number, y: number) => `L${n(x)} ${n(y)}`;
export const Q = (cx: number, cy: number, x: number, y: number) => `Q${n(cx)} ${n(cy)} ${n(x)} ${n(y)}`;
export const C = (a: number, b: number, c: number, d: number, x: number, y: number) => `C${n(a)} ${n(b)} ${n(c)} ${n(d)} ${n(x)} ${n(y)}`;

export type AddRegion = (id: string, d: string, color: string, label?: Pt) => void;

/** Region + line-work collector. */
export function canvas() {
  const regions: PaintRegion[] = [];
  const detail: Shape[] = [];
  const R: AddRegion = (id, d, color, label) => { regions.push(label ? { id, d, color, label } : { id, d, color }); };
  const D = (d: string, color: string, width = 2, opacity = 1) => { detail.push(stroke(d, color, width, opacity < 1 ? { opacity } : {})); };
  return { regions, detail, R, D };
}

/** Points along a smooth (Catmull-Rom) open curve through `pts`, `per` steps per span. */
export function sample(pts: Pt[], per = 8): Pt[] {
  const k = pts.length, out: Pt[] = [];
  const at = (i: number) => pts[Math.max(0, Math.min(k - 1, i))];
  for (let i = 0; i < k - 1; i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    for (let j = 0; j < per; j++) {
      const t = j / per, t2 = t * t, t3 = t2 * t;
      out.push([0, 1].map((c) => 0.5 * (2 * p1[c] + (p2[c] - p0[c]) * t + (2 * p0[c] - 5 * p1[c] + 4 * p2[c] - p3[c]) * t2 + (3 * p1[c] - p0[c] - 3 * p2[c] + p3[c]) * t3)) as Pt);
    }
  }
  out.push(pts[k - 1]);
  return out;
}

/** Everything below a line (left to right) down to `bottom`. */
export const below = (top: Pt[], bottom: number) => poly([...top, [top[top.length - 1][0], bottom], [top[0][0], bottom]]);
/** Everything above a line (left to right) up to `top`. */
export const above = (line: Pt[], top: number) => poly([[line[0][0], top], [line[line.length - 1][0], top], ...[...line].reverse()]);
/** The strip between two lines that both run left to right. */
export const between = (a: Pt[], b: Pt[]) => poly([...a, ...[...b].reverse()]);

/** A tapering ribbon along a smooth path, with a blunt rounded tip. */
export function ribbon(pts: Pt[], w0: number, w1: number, per = 6): string {
  const p = sample(pts, per), k = p.length, a: Pt[] = [], b: Pt[] = [];
  let tx = 0, ty = 0;
  for (let i = 0; i < k; i++) {
    const q0 = p[Math.max(0, i - 1)], q1 = p[Math.min(k - 1, i + 1)];
    const len = Math.hypot(q1[0] - q0[0], q1[1] - q0[1]) || 1;
    tx = (q1[0] - q0[0]) / len; ty = (q1[1] - q0[1]) / len;
    const w = (w0 + ((w1 - w0) * i) / (k - 1)) / 2;
    a.push([p[i][0] + ty * w, p[i][1] - tx * w]);
    b.push([p[i][0] - ty * w, p[i][1] + tx * w]);
  }
  const tip: Pt = [p[k - 1][0] + tx * w1 * 0.5, p[k - 1][1] + ty * w1 * 0.5];
  return poly([...a, tip, ...b.reverse()]);
}

/** A flat-bottomed cloud: scalloped dome of width w and height h sitting on y = base. */
export function cloud(cx: number, base: number, w: number, h: number, bumps: number, phase = 0): string {
  const pts: Pt[] = [], k = bumps * 12;
  for (let i = 0; i <= k; i++) {
    const a = Math.PI - (Math.PI * i) / k;
    const m = 0.8 + 0.2 * Math.abs(Math.sin(bumps * a + phase));
    pts.push([cx + Math.cos(a) * (w / 2) * m, base - Math.sin(a) * h * m]);
  }
  return poly(pts);
}

/** A scalloped burst (foam, spray, bush) around (cx, cy). */
export function puff(cx: number, cy: number, rx: number, ry: number, bumps: number, phase = 0, depth = 0.2): string {
  const pts: Pt[] = [], k = bumps * 12;
  for (let i = 0; i < k; i++) {
    const a = (Math.PI * 2 * i) / k;
    const m = 1 - depth + depth * Math.abs(Math.sin((bumps * a) / 2 + phase));
    pts.push([cx + Math.cos(a) * rx * m, cy + Math.sin(a) * ry * m]);
  }
  return poly(pts);
}

/** A foam cap riding on a line: scalloped above it by up to `rise`, dipping `dip` below. */
export function foamCap(top: Pt[], rise: number, dip: number, bumps: number, phase = 0): string {
  const k = top.length - 1;
  const up: Pt[] = top.map(([x, y], i) => {
    const t = i / k, env = Math.sin(Math.PI * t) ** 0.6;
    return [x, y - rise * env * (0.45 + 0.55 * Math.abs(Math.sin(bumps * Math.PI * t + phase)))] as Pt;
  });
  const down: Pt[] = top.map(([x, y], i) => [x, y + dip * Math.sin(Math.PI * (i / k)) ** 0.6] as Pt);
  return poly([...up, ...down.reverse().slice(1, -1)]);
}

/** Scale a polygon about its centroid. */
export function inset(pts: Pt[], s: number): Pt[] {
  const cx = pts.reduce((a, p) => a + p[0], 0) / pts.length, cy = pts.reduce((a, p) => a + p[1], 0) / pts.length;
  return pts.map(([x, y]) => [cx + (x - cx) * s, cy + (y - cy) * s] as Pt);
}

/** Smooth 1-D interpolation through [t, value] keys. */
export function spline1(keys: Pt[]): (t: number) => number {
  const k = keys.length;
  const slope = (i: number) => {
    const a = keys[Math.max(0, i - 1)], b = keys[Math.min(k - 1, i + 1)];
    return (b[1] - a[1]) / (b[0] - a[0]);
  };
  return (t) => {
    if (t <= keys[0][0]) return keys[0][1];
    if (t >= keys[k - 1][0]) return keys[k - 1][1];
    let i = 0;
    while (t > keys[i + 1][0]) i++;
    const h = keys[i + 1][0] - keys[i][0], u = (t - keys[i][0]) / h, u2 = u * u, u3 = u2 * u;
    return (2 * u3 - 3 * u2 + 1) * keys[i][1] + (u3 - 2 * u2 + u) * h * slope(i) + (-2 * u3 + 3 * u2) * keys[i + 1][1] + (u3 - u2) * h * slope(i + 1);
  };
}

/** A gliding gull seen head-on: wingspan 2·s. */
export function gull(x: number, y: number, s: number, rot = 0): string {
  const p: Pt[] = [[-1, -0.05], [-0.5, -0.45], [0, -0.06], [0.5, -0.45], [1, -0.05], [0.5, -0.2], [0, 0.24], [-0.5, -0.2]];
  return xf(blob(p.map(([a, b]) => [a * s, b * s] as Pt), 0.6), { rot, x, y });
}

/** A small reef fish of length `len` with its nose toward +x (flip with dir -1). */
export function fish(R: AddRegion, id: string, x: number, y: number, len: number, rot: number, dir: 1 | -1, body: string, tail: string, band?: string) {
  const t = { rot, x, y, sx: dir, sy: 1 };
  const s = (pts: Pt[]) => pts.map(([a, b]) => [a * len, b * len] as Pt);
  R(`${id}-tail`, xf(blob(s([[-0.34, 0], [-0.64, -0.23], [-0.55, 0], [-0.64, 0.23]]), 0.5), t), tail);
  R(`${id}-body`, xf(blob(s([[0.5, 0], [0.2, -0.25], [-0.2, -0.2], [-0.42, 0], [-0.2, 0.2], [0.2, 0.25]])), t), body);
  if (band) R(`${id}-band`, xf(poly(s([[-0.02, -0.2], [0.14, -0.22], [0.14, 0.22], [-0.02, 0.2]])), t), band);
  return xf(circle(0.34 * len, -0.04 * len, 2), t);
}

export interface DolphinColours { body: string; belly: string; fin: string; eye: string }

/** A leaping dolphin whose spine follows a cubic curve from tail stock (P[0]) to beak tip (P[3]); W = half the body depth. */
export function dolphin(R: AddRegion, id: string, P: [Pt, Pt, Pt, Pt], W: number, col: DolphinColours) {
  const at = (t: number) => {
    const u = 1 - t;
    const p = [0, 1].map((c) => u * u * u * P[0][c] + 3 * u * u * t * P[1][c] + 3 * u * t * t * P[2][c] + t * t * t * P[3][c]) as Pt;
    const d = [0, 1].map((c) => 3 * u * u * (P[1][c] - P[0][c]) + 6 * u * t * (P[2][c] - P[1][c]) + 3 * t * t * (P[3][c] - P[2][c]));
    const len = Math.hypot(d[0], d[1]) || 1;
    const T: Pt = [d[0] / len, d[1] / len];
    return { p, T, N: [T[1], -T[0]] as Pt };
  };
  const top = spline1([[0, 0.17], [0.1, 0.27], [0.3, 0.72], [0.5, 1], [0.7, 0.96], [0.8, 0.86], [0.86, 0.7], [0.9, 0.34], [0.95, 0.23], [1, 0.1]]);
  const bot = spline1([[0, 0.17], [0.1, 0.25], [0.3, 0.6], [0.5, 0.84], [0.7, 0.86], [0.82, 0.72], [0.9, 0.42], [0.95, 0.28], [1, 0.1]]);
  /** Point at spine t, offset k·W toward the back (k > 0) or belly (k < 0), and j·W along the spine. */
  const off = (t: number, k: number, j = 0): Pt => {
    const { p, T, N } = at(t);
    return [p[0] + (N[0] * k + T[0] * j) * W, p[1] + (N[1] * k + T[1] * j) * W];
  };
  const steps = 48;
  const ts = Array.from({ length: steps + 1 }, (_, i) => i / steps);

  // flukes
  R(`${id}-fluke`, blob([off(0, 0.16, 0.4), off(0, 0.7, -0.15), off(0, 1.4, -0.85), off(0, 0.62, -0.62), off(0, 0, -0.34), off(0, -0.62, -0.62), off(0, -1.4, -0.85), off(0, -0.7, -0.15), off(0, -0.16, 0.4)], 0.7), col.fin);
  // dorsal fin
  {
    const a = off(0.57, top(0.57) * 0.6), b = off(0.41, top(0.41) * 0.6), tip = off(0.4, top(0.4) + 1.0, -0.25);
    const c1 = off(0.51, top(0.51) + 0.95), c2 = off(0.45, top(0.45) + 0.3);
    R(`${id}-dorsal`, M(a[0], a[1]) + Q(c1[0], c1[1], tip[0], tip[1]) + Q(c2[0], c2[1], b[0], b[1]) + 'Z', col.fin);
  }
  // body
  R(`${id}-body`, poly([...ts.map((t) => off(t, top(t))), ...[...ts].reverse().map((t) => off(t, -bot(t)))]), col.body);
  // belly
  {
    const t0 = 0.13, t1 = 0.93;
    const bs = Array.from({ length: 37 }, (_, i) => t0 + ((t1 - t0) * i) / 36);
    const inner = bs.map((t) => off(t, -bot(t) * (1 - 0.72 * Math.sin((Math.PI * (t - t0)) / (t1 - t0)) ** 0.8)));
    R(`${id}-belly`, poly([...inner, ...[...bs].reverse().map((t) => off(t, -bot(t))).slice(1, -1)]), col.belly);
  }
  // pectoral fin
  {
    const a = off(0.73, -bot(0.73) * 0.7), b = off(0.63, -bot(0.63) * 0.78), tip = off(0.55, -(bot(0.55) + 0.9));
    const c1 = off(0.67, -(bot(0.67) + 0.85)), c2 = off(0.6, -(bot(0.6) + 0.15));
    R(`${id}-flipper`, M(a[0], a[1]) + Q(c1[0], c1[1], tip[0], tip[1]) + Q(c2[0], c2[1], b[0], b[1]) + 'Z', col.fin);
  }
  // eye
  const e = off(0.835, -0.1), r = Math.max(5.5, W * 0.11);
  R(`${id}-eye`, poly(Array.from({ length: 16 }, (_, i) => [e[0] + Math.cos((i * Math.PI) / 8) * r, e[1] + Math.sin((i * Math.PI) / 8) * r] as Pt)), col.eye);
  // line of the mouth, for the detail layer
  const m0 = off(0.985, -0.02), m1 = off(0.93, -0.1), m2 = off(0.875, -0.3);
  return M(m0[0], m0[1]) + Q(m1[0], m1[1], m2[0], m2[1]);
}
