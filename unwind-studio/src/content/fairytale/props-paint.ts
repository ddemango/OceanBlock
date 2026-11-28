// Shared drawing helpers for the Fairytale Kingdom paint-by-number artworks.
import { blob, leaf, line, poly, rect, sector, stroke } from '../../art/kit';
import type { Pt } from '../../art/geometry';
import type { Shape } from '../../art/types';
import type { PaintRegion } from '../types';

export type { Pt };
export const W = 1000, H = 1250;

type RFn = (id: string, d: string, color: string, label?: Pt) => void;
type DFn = (d: string, c: string, w?: number, o?: number) => void;

/** Region + detail collector. */
export function canvas() {
  const regions: PaintRegion[] = [];
  const detail: Shape[] = [];
  const R: RFn = (id, d, color, label) => {
    regions.push(label ? { id, d, color, label } : { id, d, color });
  };
  const D: DFn = (d, c, w = 1.4, o = 0.7) => detail.push(stroke(d, c, w, { opacity: o }));
  return { regions, detail, R, D };
}

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

/** Smooth edge through pts, closed with straight lines through corner points. */
export function edged(pts: Pt[], corners: Pt[]): string {
  return poly([...sample(pts, 8).map(clampPt), ...corners]);
}

/** Ribbon of varying width following a smooth curve. */
export function band(pts: Pt[], w0: number, w1: number): string {
  const s = sample(pts);
  const left: Pt[] = [], right: Pt[] = [];
  s.forEach((p, i) => {
    const t = i / (s.length - 1);
    const a = s[Math.max(0, i - 1)], b = s[Math.min(s.length - 1, i + 1)];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const nx = -(b[1] - a[1]) / len, ny = (b[0] - a[0]) / len;
    const w = (w0 + (w1 - w0) * t) / 2;
    left.push(clampPt([p[0] + nx * w, p[1] + ny * w]));
    right.push(clampPt([p[0] - nx * w, p[1] - ny * w]));
  });
  return poly([...left, ...right.reverse()]);
}

/** A lobed clump (foliage, cloud, smoke) around a centre. */
export function lobed(cx: number, cy: number, rx: number, ry: number, n: number, depth: number, rot = 0): string {
  const pts: Pt[] = [];
  for (let i = 0; i < n * 2; i++) {
    const a = ((rot + (i * 180) / n) * Math.PI) / 180;
    const k = i % 2 ? 1 - depth : 1;
    pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  return blob(pts, 0.9);
}

/** Points around a circle between angles a0..a1 (degrees, 0 = right, 90 = down). */
export function arcPts(cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, steps = 18): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= steps; i++) {
    const a = ((a0 + ((a1 - a0) * i) / steps) * Math.PI) / 180;
    out.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]);
  }
  return out;
}

/** Round-topped arch: semicircle of radius r centred at (cx, cy), straight sides down to `bottom`. */
export function arch(cx: number, cy: number, r: number, bottom: number): string {
  return poly([[cx + r, bottom], ...arcPts(cx, cy, r, r, 0, -180), [cx - r, bottom]]);
}

/** Ring (annulus) as a single closed subpath. */
export function ring(cx: number, cy: number, r: number, rIn: number): string {
  const o = arcPts(cx, cy, r, r, -90, 270, 40);
  const i = arcPts(cx, cy, rIn, rIn, 270, -90, 40);
  return poly([...o, ...i]);
}

/** Crescent moon lit on the right: circle r minus the same circle shifted left by `off`. */
export function crescentMoon(cx: number, cy: number, r: number, off: number): string {
  const t0 = (Math.acos(-off / 2 / r) * 180) / Math.PI;
  const t1 = (Math.acos(off / 2 / r) * 180) / Math.PI;
  return poly([...arcPts(cx, cy, r, r, -t0, t0, 24), ...arcPts(cx - off, cy, r, r, t1, -t1, 24).slice(1, -1)]);
}

/** Crenellated top edge: merlons of width mw between x0..x1 (an odd count, so it starts and ends high). */
export function crenWall(x0: number, x1: number, top: number, bottom: number, mh: number, count: number): string {
  const n = count % 2 ? count : count + 1;
  const mw = (x1 - x0) / n;
  const pts: Pt[] = [[x0, bottom]];
  for (let i = 0; i < n; i++) {
    const y = i % 2 ? top : top - mh;
    pts.push([x0 + i * mw, y], [x0 + (i + 1) * mw, y]);
  }
  pts.push([x1, bottom]);
  return poly(pts);
}

/** Front of a round tower between fractions u0..u1 of its width (-0.5..0.5), with a curved base. */
export function drum(cx: number, w: number, top: number, bottom: number, u0 = -0.5, u1 = 0.5, depth = 12): string {
  const pts: Pt[] = [[cx + u0 * w, top], [cx + u1 * w, top]];
  for (let i = 0; i <= 16; i++) {
    const u = u1 + ((u0 - u1) * i) / 16;
    pts.push([cx + u * w, bottom + depth * (1 - (2 * u) ** 2)]);
  }
  return poly(pts);
}

/** A conical roof over a round tower. Returns the roof, its shaded right side and the apex. */
export function cone(cx: number, w: number, top: number, h: number, over = 12, depth = 14) {
  const half = w / 2 + over;
  const apex: Pt = [cx, top - h];
  const eave = (u0: number, u1: number) => {
    const pts: Pt[] = [];
    for (let i = 0; i <= 16; i++) {
      const u = u0 + ((u1 - u0) * i) / 16;
      pts.push([cx + u * 2 * half, top + depth * (1 - (2 * u) ** 2)]);
    }
    return pts;
  };
  return {
    apex,
    roof: poly([apex, ...eave(0.5, -0.5)]),
    shade: poly([apex, ...eave(0.5, 0.16)]),
  };
}

/** A waving pennant flying right from the top of a pole at (x, y). */
export function pennant(x: number, y: number, len: number, wid: number, flip = 1): string {
  return blob([[x, y], [x + flip * len * 0.4, y - wid * 0.12], [x + flip * len, y + wid * 0.25], [x + flip * len * 0.45, y + wid * 0.62], [x, y + wid]], 0.5);
}

/** A firework: `n` petals radiating from a gap around a core. Petals alternate colA / colB. */
export function burst(R: RFn, D: DFn, id: string, cx: number, cy: number, r: number, n: number, colA: string, colB: string, core: string, rot = 0) {
  const r0 = r * 0.3;
  const wid = Math.max(14, r * 0.17);
  for (let i = 0; i < n; i++) {
    const deg = rot + (i * 360) / n, a = (deg * Math.PI) / 180;
    R(`${id}-ray-${i + 1}`, leaf(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0, r - r0, wid, deg), i % 2 ? colB : colA);
  }
  R(`${id}-core`, poly(arcPts(cx, cy, r * 0.2, r * 0.2, 0, 345, 23)), core);
  // sparkles beyond the tips and between the rays
  let sp = '';
  for (let i = 0; i < n; i++) {
    const a = ((rot + (i * 360) / n) * Math.PI) / 180, b = ((rot + ((i + 0.5) * 360) / n) * Math.PI) / 180;
    const tx = cx + Math.cos(a) * r * 1.1, ty = cy + Math.sin(a) * r * 1.1;
    sp += line([[tx - 4, ty], [tx + 4, ty]]) + line([[tx, ty - 4], [tx, ty + 4]]);
    const mx = cx + Math.cos(b) * r * 0.72, my = cy + Math.sin(b) * r * 0.72;
    sp += line([[mx - 2.5, my], [mx + 2.5, my]]);
  }
  D(sp, '#fff6dc', 1.6, 0.85);
}

/** A gabled cottage standing on `base`. */
export function cottage(R: RFn, D: DFn, id: string, x: number, base: number, w: number, h: number, roofH: number, cols: { wall: string; roof: string; door: string; glow: string }, doorLeft = false) {
  const top = base - h, cx = x + w / 2;
  R(`${id}-wall`, rect(x, top, w, h), cols.wall);
  R(`${id}-roof`, poly([[x - 14, top + 10], [cx, top - roofH], [x + w + 14, top + 10], [x + w + 8, top + 18], [x - 8, top + 18]]), cols.roof);
  const dw = Math.max(22, w * 0.2), dh = h * 0.52;
  const dx = doorLeft ? x + w * 0.16 : x + w * 0.84 - dw;
  R(`${id}-door`, rect(dx, base - dh, dw, dh, 6), cols.door);
  const ww = w * 0.22, wx = doorLeft ? x + w * 0.62 : x + w * 0.16;
  R(`${id}-window`, rect(wx, top + h * 0.3, ww, ww * 0.9, 3), cols.glow);
  const wy = top + h * 0.3;
  D(line([[wx + ww / 2, wy], [wx + ww / 2, wy + ww * 0.9]]) + line([[wx, wy + ww * 0.45], [wx + ww, wy + ww * 0.45]]), '#6b4836', 1.6, 0.8);
}

/** Pumpkin outline (wider than tall, with a dimple at the top). */
export function pumpkin(cx: number, cy: number, rx: number, ry: number): string {
  const pts: Pt[] = [];
  for (let i = 0; i < 24; i++) {
    const deg = -90 + i * 15, a = (deg * Math.PI) / 180;
    const off = Math.min(Math.abs(deg + 90), Math.abs(deg - 270));
    const k = 1 - 0.12 * Math.exp(-((off / 18) ** 2)) - 0.04 * Math.max(0, Math.sin(a)) ** 4;
    pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  return blob(pts, 1);
}

/** A spoked wheel: gilt disc, `n` dark openings between spokes, and a hub. */
export function wheel(R: RFn, id: string, cx: number, cy: number, r: number, n: number, rim: string, gap: string, hub: string, rot = 0) {
  R(`${id}`, poly(arcPts(cx, cy, r, r, 0, 345, 23)), rim);
  const spoke = (r * 0.13 * 180) / (Math.PI * r * 0.55); // spoke half-width in degrees at mid radius
  for (let i = 0; i < n; i++) {
    const a0 = rot + (i * 360) / n + spoke, a1 = rot + ((i + 1) * 360) / n - spoke;
    R(`${id}-gap-${i + 1}`, sector(cx, cy, r * 0.8, a0, a1, r * 0.3), gap);
  }
  R(`${id}-hub`, poly(arcPts(cx, cy, r * 0.22, r * 0.22, 0, 330, 11)), hub);
}

/** A goblet standing on (cx, base): cup, stem and foot as one outline, h tall, cup w wide. */
export function goblet(cx: number, base: number, h: number, w: number): string {
  const top = base - h, cupB = top + h * 0.5, fw = w * 0.42, sw = w * 0.09;
  const pts: Pt[] = [
    [cx - w / 2, top], [cx + w / 2, top],
    [cx + w * 0.46, top + h * 0.22], [cx + w * 0.3, cupB - h * 0.04], [cx + sw, cupB + h * 0.04],
    [cx + sw, base - h * 0.14], [cx + fw, base - h * 0.03], [cx + fw, base], [cx - fw, base], [cx - fw, base - h * 0.03], [cx - sw, base - h * 0.14],
    [cx - sw, cupB + h * 0.04], [cx - w * 0.3, cupB - h * 0.04], [cx - w * 0.46, top + h * 0.22],
  ];
  return poly(pts);
}

/** Clamp every coordinate pair of a path into the canvas (curves stay inside by the convex-hull property). */
export function clampPath(d: string, m = 1): string {
  return d.replace(/(-?[\d.]+) (-?[\d.]+)/g, (_, x, y) => `${Math.max(m, Math.min(W - m, +x))} ${Math.max(m, Math.min(H - m, +y))}`);
}
