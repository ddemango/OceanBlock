// Shared drawing helpers for The Craft Room paint-by-number artworks.
import { ellipse, poly, line, xf } from '../../art/kit';
import type { PaintRegion } from '../types';

export type Pt = [number, number];
const n = (v: number) => String(Math.round(v * 10) / 10);
export const M = (x: number, y: number) => `M${n(x)} ${n(y)}`;
export const L = (x: number, y: number) => `L${n(x)} ${n(y)}`;
export const Q = (cx: number, cy: number, x: number, y: number) => `Q${n(cx)} ${n(cy)} ${n(x)} ${n(y)}`;
export const C = (a: number, b: number, c: number, d: number, x: number, y: number) => `C${n(a)} ${n(b)} ${n(c)} ${n(d)} ${n(x)} ${n(y)}`;

export type AddRegion = (id: string, d: string, color: string, label?: Pt) => void;

/** Collects regions in painter's order. */
export function collector() {
  const regions: PaintRegion[] = [];
  const R: AddRegion = (id, d, color, label) => {
    regions.push(label ? { id, d, color, label } : { id, d, color });
  };
  return { regions, R };
}

/** Points along an ellipse from angle a0 to a1 (degrees, 0 = right, 90 = down). */
export function arcPts(cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, steps = 20): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= steps; i++) {
    const a = ((a0 + ((a1 - a0) * i) / steps) * Math.PI) / 180;
    out.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]);
  }
  return out;
}

/**
 * A round container (basket, jar, mug) seen a little from above.
 * `prof` lists [y, half-width] pairs from the top down; `ratio` squashes the ellipses.
 */
export function pot(cx: number, prof: [number, number][], ratio: number) {
  const top = prof[0][0], bottom = prof[prof.length - 1][0];
  const hw = (y: number): number => {
    if (y <= top) return prof[0][1];
    if (y >= bottom) return prof[prof.length - 1][1];
    let i = 0;
    while (prof[i + 1][0] < y) i++;
    const [ya, wa] = prof[i], [yb, wb] = prof[i + 1];
    return wa + ((wb - wa) * (y - ya)) / (yb - ya);
  };
  /** Front (lower) half of the ellipse at height y, left to right. */
  const front = (y: number): Pt[] => arcPts(cx, y, hw(y), hw(y) * ratio, 180, 0);
  const edge = (ya: number, yb: number, sign: 1 | -1): Pt[] => {
    const pts: Pt[] = [];
    for (const [y] of prof) if (y > Math.min(ya, yb) && y < Math.max(ya, yb)) pts.push([cx + sign * hw(y), y]);
    return yb > ya ? pts : pts.reverse();
  };
  const band = (ya: number, yb: number): string =>
    poly([...front(ya), ...edge(ya, yb, 1), ...front(yb).reverse(), ...edge(yb, ya, -1)]);
  return {
    hw,
    front,
    band,
    body: () => band(top, bottom),
    opening: (inset = 0, dy = 0) => ellipse(cx, top + dy, hw(top) - inset, (hw(top) - inset) * ratio),
  };
}

/** Evenly spaced points along a smooth curve through `pts`. */
export function smoothPath(pts: Pt[], count: number): Pt[] {
  const k = pts.length, dense: Pt[] = [];
  const at = (i: number) => pts[Math.max(0, Math.min(k - 1, i))];
  for (let i = 0; i < k - 1; i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    for (let s = 0; s < 24; s++) {
      const t = s / 24, t2 = t * t, t3 = t2 * t;
      const f = (a: number, b: number, c: number, d: number) =>
        0.5 * (2 * b + (c - a) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (3 * b - a - 3 * c + d) * t3);
      dense.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  dense.push(pts[k - 1]);
  const acc = [0];
  for (let i = 1; i < dense.length; i++) acc.push(acc[i - 1] + Math.hypot(dense[i][0] - dense[i - 1][0], dense[i][1] - dense[i - 1][1]));
  const total = acc[acc.length - 1], out: Pt[] = [];
  let j = 0;
  for (let i = 0; i < count; i++) {
    const target = (total * i) / (count - 1);
    while (j < acc.length - 2 && acc[j + 1] < target) j++;
    const span = acc[j + 1] - acc[j] || 1, t = (target - acc[j]) / span;
    out.push([dense[j][0] + (dense[j + 1][0] - dense[j][0]) * t, dense[j][1] + (dense[j + 1][1] - dense[j][1]) * t]);
  }
  return out;
}

/** The two edges of a ribbon of the given width following a centre line. */
export function ribbonEdges(centre: Pt[], width: number): { a: Pt[]; b: Pt[] } {
  const a: Pt[] = [], b: Pt[] = [], k = centre.length;
  for (let i = 0; i < k; i++) {
    const p = centre[Math.max(0, i - 1)], q = centre[Math.min(k - 1, i + 1)];
    const dx = q[0] - p[0], dy = q[1] - p[1], len = Math.hypot(dx, dy) || 1;
    const nx = (-dy / len) * (width / 2), ny = (dx / len) * (width / 2);
    a.push([centre[i][0] + nx, centre[i][1] + ny]);
    b.push([centre[i][0] - nx, centre[i][1] - ny]);
  }
  return { a, b };
}

/** A ribbon of constant width along a smooth curve through `pts`. */
export function ribbon(pts: Pt[], width: number, samples = 40): string {
  const { a, b } = ribbonEdges(smoothPath(pts, samples), width);
  return poly([...a, ...b.reverse()]);
}

/** The same ribbon cut crossways into `count` stripes that share their edges exactly. */
export function ribbonStripes(pts: Pt[], width: number, count: number, sub = 6): string[] {
  const { a, b } = ribbonEdges(smoothPath(pts, count * sub + 1), width);
  const out: string[] = [];
  for (let s = 0; s < count; s++) {
    const i0 = s * sub, i1 = i0 + sub;
    out.push(poly([...a.slice(i0, i1 + 1), ...b.slice(i0, i1 + 1).reverse()]));
  }
  return out;
}

/** A rectangle of size w×h centred on (cx, cy), rotated by rot degrees, with rounded corners r. */
export function rotRect(cx: number, cy: number, w: number, h: number, rot: number, r = 0): string {
  const a = w / 2, b = h / 2, k = Math.min(r, a, b);
  const d = k > 0
    ? M(-a + k, -b) + L(a - k, -b) + Q(a, -b, a, -b + k) + L(a, b - k) + Q(a, b, a - k, b) + L(-a + k, b) + Q(-a, b, -a, b - k) + L(-a, -b + k) + Q(-a, -b, -a + k, -b) + 'Z'
    : poly([[-a, -b], [a, -b], [a, b], [-a, b]]);
  return xf(d, { rot, x: cx, y: cy });
}

/** Map a point given relative to a rotated centre onto the page. */
export function rotPt(cx: number, cy: number, rot: number, x: number, y: number): Pt {
  const a = (rot * Math.PI) / 180;
  return [cx + x * Math.cos(a) - y * Math.sin(a), cy + x * Math.sin(a) + y * Math.cos(a)];
}

/** A plump heart of width w centred on (cx, cy). */
export function heart(cx: number, cy: number, w: number, rot = 0): string {
  const s = w / 2;
  const d = M(0, s * 0.92) + C(-s * 0.25, s * 0.62, -s, s * 0.2, -s, -s * 0.3) + C(-s, -s * 0.82, -s * 0.22, -s * 0.9, 0, -s * 0.38) +
    C(s * 0.22, -s * 0.9, s, -s * 0.82, s, -s * 0.3) + C(s, s * 0.2, s * 0.25, s * 0.62, 0, s * 0.92) + 'Z';
  return xf(d, { rot, x: cx, y: cy });
}

/** A curl of steam rising from (x, y) by h. */
export function wisp(x: number, y: number, h: number, sway: number, w: number, phase = 0): string {
  const left: Pt[] = [], right: Pt[] = [], k = 22;
  for (let i = 0; i <= k; i++) {
    const t = i / k;
    const cx = x + Math.sin(t * Math.PI * 1.7 + phase) * sway * (0.35 + 0.65 * t);
    const half = (w / 2) * Math.sin(Math.PI * (0.12 + 0.8 * t)) + 1.5;
    left.push([cx - half, y - h * t]);
    right.push([cx + half, y - h * t]);
  }
  return poly([...left, ...right.reverse()]);
}

/** Running stitches: short dashes along a polyline (use with a stroke). */
export function stitches(pts: Pt[], dash = 9, gap = 7): string {
  let d = '';
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
    const len = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / len, uy = (y1 - y0) / len;
    for (let s = gap / 2; s + dash <= len; s += dash + gap) d += line([[x0 + ux * s, y0 + uy * s], [x0 + ux * (s + dash), y0 + uy * (s + dash)]]);
  }
  return d;
}

/** A ball of yarn: the ball plus a lighter band of wraps across it. */
export function yarnBall(R: AddRegion, id: string, cx: number, cy: number, r: number, color: string, wrap: string, rot: number) {
  R(id, ellipse(cx, cy, r, r), color);
  R(`${id}-wrap`, ellipse(cx, cy, r * 0.96, r * 0.36, rot), wrap);
}

/** Strands of yarn curving across a ball (use with a stroke). */
export function yarnStrands(cx: number, cy: number, r: number, rot: number): string {
  let d = '';
  for (const k of [-0.72, -0.52, 0.52, 0.72]) {
    const half = Math.sqrt(1 - k * k) * r * 0.94;
    const a = rotPt(cx, cy, rot, -half, k * r), c = rotPt(cx, cy, rot, 0, k * r * 1.25), b = rotPt(cx, cy, rot, half, k * r);
    d += M(a[0], a[1]) + Q(c[0], c[1], b[0], b[1]);
  }
  for (const k of [-0.5, 0, 0.5]) {
    const a = rotPt(cx, cy, rot, k * r * 0.9 - r * 0.2, -r * 0.3), b = rotPt(cx, cy, rot, k * r * 0.9 + r * 0.2, r * 0.3);
    d += M(a[0], a[1]) + L(b[0], b[1]);
  }
  return d;
}

/** An artist's brush pointing up from its handle end at (x, y), then turned by rot degrees. */
export function brush(R: AddRegion, id: string, x: number, y: number, rot: number, len: number, handle: string, ferrule: string, tip: string, w = 18) {
  const t = { rot, x, y };
  const hl = len * 0.68, fl = len * 0.14, tl = len * 0.18, fw = w * 1.05;
  R(`${id}-handle`, xf(poly([[-w * 0.36, 0], [w * 0.36, 0], [w / 2, -hl], [-w / 2, -hl]]), t), handle);
  R(`${id}-ferrule`, xf(poly([[-fw / 2, -hl], [fw / 2, -hl], [fw / 2, -hl - fl], [-fw / 2, -hl - fl]]), t), ferrule);
  R(`${id}-tip`, xf(M(-fw / 2, -hl - fl) + C(-fw * 0.95, -hl - fl - tl * 0.45, -fw * 0.3, -hl - fl - tl * 0.8, 0, -hl - fl - tl) +
    C(fw * 0.3, -hl - fl - tl * 0.8, fw * 0.95, -hl - fl - tl * 0.45, fw / 2, -hl - fl) + 'Z', t), tip);
}
