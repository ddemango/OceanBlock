// Shared drawing helpers for the Sunday Kitchen paint-by-number artworks.
import { ellipse, poly, blob, leaf, xf } from '../../art/kit';
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

/** Region collector. */
export function collector() {
  const regions: PaintRegion[] = [];
  const R = (id: string, d: string, color: string, label?: [number, number]) => {
    regions.push(label ? { id, d, color, label } : { id, d, color });
  };
  return { regions, R };
}

/** A turned vessel (bowl, jug, cup) seen slightly from above: profile of [y, half-width]. */
export function vessel(cx: number, prof: [number, number][], ratio: number) {
  const hw = (y: number) => {
    const k = prof.length;
    if (y <= prof[0][0]) return prof[0][1];
    if (y >= prof[k - 1][0]) return prof[k - 1][1];
    let i = 0;
    while (y > prof[i + 1][0]) i++;
    const [y0, v0] = prof[i], [y1, v1] = prof[i + 1];
    const m = (j: number) => { const a = prof[Math.max(0, j - 1)], b = prof[Math.min(k - 1, j + 1)]; return (b[1] - a[1]) / (b[0] - a[0]); };
    const h = y1 - y0, t = (y - y0) / h, t2 = t * t, t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * v0 + (t3 - 2 * t2 + t) * h * m(i) + (-2 * t3 + 3 * t2) * v1 + (t3 - t2) * h * m(i + 1);
  };
  const arc = (y: number, dir: 1 | -1, inset = 0): Pt[] => {
    const pts: Pt[] = [], w = hw(y) - inset;
    for (let i = 0; i <= 18; i++) { const a = (Math.PI * i) / 18; pts.push([cx - dir * Math.cos(a) * w, y + Math.sin(a) * w * ratio]); }
    return pts;
  };
  const side = (ya: number, yb: number, sgn: 1 | -1, inset = 0): Pt[] => {
    const pts: Pt[] = [], k = Math.max(2, Math.ceil(Math.abs(yb - ya) / 6));
    for (let i = 0; i <= k; i++) { const y = ya + ((yb - ya) * i) / k; pts.push([cx + sgn * (hw(y) - inset), y]); }
    return pts;
  };
  const yTop = prof[0][0], yBot = prof[prof.length - 1][0];
  return {
    hw,
    body: () => poly([...arc(yTop, 1), ...side(yTop, yBot, 1).slice(1), ...arc(yBot, -1).slice(1), ...side(yBot, yTop, -1).slice(1, -1)]),
    band: (y1: number, y2: number, inset = 0.8) => poly([...arc(y1, 1, inset), ...side(y1, y2, 1, inset).slice(1), ...arc(y2, -1, inset).slice(1), ...side(y2, y1, -1, inset).slice(1, -1)]),
    opening: (inset = 0) => ellipse(cx, yTop, hw(yTop) - inset, (hw(yTop) - inset) * ratio),
  };
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

/** Apple outline with a dimple at the top. */
export function apple(cx: number, cy: number, r: number, rot = 0): string {
  const p: Pt[] = [];
  for (let i = 0; i < 24; i++) {
    const deg = -90 + i * 15, a = (deg * Math.PI) / 180;
    const off = Math.min(Math.abs(deg + 90), Math.abs(deg - 270));
    const k = 1 - 0.2 * Math.exp(-((off / 16) ** 2)) + 0.05 * Math.max(0, -Math.sin(a)) - 0.04 * Math.max(0, Math.sin(a)) ** 3;
    p.push([Math.cos(a) * r * 1.03 * k, Math.sin(a) * r * 0.96 * k]);
  }
  return xf(blob(p, 1), { rot, x: cx, y: cy });
}

/** Pear: lower bulb of radius r centred on (cx, cy), neck rising up, rotated by rot. */
export function pear(cx: number, cy: number, r: number, rot = 0): string {
  const p: Pt[] = [
    [0, r], [r * 0.74, r * 0.7], [r, 0], [r * 0.78, -r * 0.62], [r * 0.46, -r * 1.06], [r * 0.38, -r * 1.5], [r * 0.24, -r * 1.84], [0, -r * 1.96],
    [-r * 0.24, -r * 1.84], [-r * 0.38, -r * 1.5], [-r * 0.46, -r * 1.06], [-r * 0.78, -r * 0.62], [-r, 0], [-r * 0.74, r * 0.7],
  ];
  return xf(blob(p, 1), { rot, x: cx, y: cy });
}
/** Where the pear's stem meets the fruit. */
export const pearTop = (cx: number, cy: number, r: number, rot: number): Pt => {
  const a = (rot * Math.PI) / 180, h = r * 1.9;
  return [cx + Math.sin(a) * h, cy - Math.cos(a) * h];
};

/** Lemon outline. */
export function lemon(cx: number, cy: number, rx: number, ry: number, rot = 0): string {
  const d = M(-rx * 1.2, 0) + C(-rx * 1.12, -ry * 0.46, -rx * 0.7, -ry, 0, -ry) + C(rx * 0.7, -ry, rx * 1.12, -ry * 0.46, rx * 1.2, 0) +
    C(rx * 1.12, ry * 0.46, rx * 0.7, ry, 0, ry) + C(-rx * 0.7, ry, -rx * 1.12, ry * 0.46, -rx * 1.2, 0) + 'Z';
  return xf(d, { rot, x: cx, y: cy });
}

/** The lighter half of a leaf (pair with kit `leaf`). */
export const halfLeaf = (x: number, y: number, len: number, wid: number, rot: number, flip = false) =>
  xf(M(0, 0) + Q(len * 0.45, flip ? wid : -wid, len, 0) + 'Z', { rot, x, y });

/** A short rounded stem: a thin quad from (x, y) along rot (deg, 0 = up), width w. */
export function stem(x: number, y: number, len: number, w: number, rot: number, bend = 0): string {
  const d = M(-w / 2, 0) + Q(-w / 2 + bend, -len * 0.5, -w * 0.4 + bend * 1.6, -len) + L(w * 0.4 + bend * 1.6, -len) + Q(w / 2 + bend, -len * 0.5, w / 2, 0) + 'Z';
  return xf(d, { rot, x, y });
}

export { leaf };
