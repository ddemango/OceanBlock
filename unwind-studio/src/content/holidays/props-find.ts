// Shared props for the Holiday Traditions hidden-object scenes. Every prop is
// drawn around the origin and returns Shape[]; position it with place().
import { rect, ellipse, circle, poly, line, curve, blob, leaf, petal, star, sh, stroke, shade, mix, rng, xf } from '../../art/kit';
import type { Pt } from '../../art/geometry';
import type { Shape } from '../../art/types';
import { M, L, Q, CB, ol, shadow } from '../kitchen/props-find';

export { M, L, Q, CB, ol, shadow };
export { planks, wallpaper, floor, gingham, stripes, plate, bowl, mug, jug, gingerbread, cornCob, veg, pile, basket, basketHandle } from '../kitchen/props-find';

export const hl = (d: string, op = 0.5): Shape => sh(d, '#ffffff', { opacity: op });
const mirror = (d: string) => xf(d, { sx: -1, sy: 1 });
const sym = (right: Pt[]): Pt[] => [...right, ...right.slice().reverse().map(([x, y]) => [-x, y] as Pt)];
const sc = (pts: Pt[], s: number, dx = 0, dy = 0): Pt[] => pts.map(([x, y]) => [x * s + dx, y * s + dy]);

export const H = {
  pumpkin: '#ec8a2c', pumpkinDk: '#c4651c', glow: '#ffd25a', glowLt: '#fff1b0', night: '#2a2147', plum: '#5a3f7a', moss: '#5f7a3e',
  wood: '#a8743e', woodDk: '#6e4a2a', woodLt: '#d0a068', cream: '#f7efdc', brass: '#d0a347', brassDk: '#9a7428', red: '#c8352e', redDk: '#8e2420',
  green: '#3f7a4a', greenDk: '#2c5a36', gold: '#e8b93c', snow: '#f4f7fb',
};

// =====================================================================
// leaves and foliage
// =====================================================================
const MAPLE_R: Pt[] = [[0, -0.5], [0.09, -0.3], [0.24, -0.4], [0.2, -0.17], [0.46, -0.24], [0.38, -0.06], [0.5, 0.02], [0.24, 0.1], [0.27, 0.22], [0.05, 0.15], [0.03, 0.3]];
/** Maple leaf path centred on the origin, `s` across. */
export const mapleLeafPath = (s: number, x = 0, y = 0, rot = 0) => xf(poly(sc(sym(MAPLE_R), s)), { rot, x, y });
/** Oak leaf path centred on the origin, `s` long (pointing up). */
export function oakLeafPath(s: number, x = 0, y = 0, rot = 0): string {
  const pts: Pt[] = [];
  const lobes = 4;
  for (let i = 0; i <= lobes * 2; i++) { const t = i / (lobes * 2); const yy = -0.5 + t * 0.9; const w = (i % 2 ? 0.26 : 0.15) * Math.sin(Math.PI * Math.min(0.95, t + 0.08)); pts.push([w, yy]); }
  const all = [[0, -0.52] as Pt, ...pts, [0.03, 0.42] as Pt, [-0.03, 0.42] as Pt, ...pts.slice().reverse().map(([a, b]) => [-a, b] as Pt)];
  return xf(blob(sc(all, s), 0.5), { rot, x, y });
}
/** A maple leaf with veins and stem, origin at its centre. */
export function mapleLeaf(s: number, col: string): Shape[] {
  return [ol(mapleLeafPath(s), col, 1, -0.28), stroke(line([[0, s * 0.5], [0, -s * 0.36]]) + line([[0, 0], [s * 0.36, -s * 0.12]]) + line([[0, 0], [-s * 0.36, -s * 0.12]]) + line([[0, s * 0.08], [s * 0.2, s * 0.16]]) + line([[0, s * 0.08], [-s * 0.2, s * 0.16]]), shade(col, -0.32), Math.max(0.8, s * 0.03))];
}
/** Scatter of fallen leaves in a box; each leaf is its own shape. */
export function leafScatter(x: number, y: number, w: number, h: number, n: number, seed: number, cols: string[], size = 26): Shape[] {
  const g = rng(seed);
  const out: Shape[] = [];
  for (let i = 0; i < n; i++) {
    const cx = x + g.range(0, w), cy = y + g.range(0, h), s = size * g.range(0.7, 1.2), c = g.pick(cols), r = g.range(0, 360);
    const d = g.next() < 0.55 ? mapleLeafPath(s, cx, cy, r) : oakLeafPath(s * 1.1, cx, cy, r);
    out.push(sh(d, c, { stroke: shade(c, -0.3), strokeWidth: 0.8 }));
  }
  return out;
}
/** Round clump of foliage made of overlapping circles (each colour one shape). */
export function foliageClump(seed: number, w: number, h: number, cols: string[], n = 26): Shape[] {
  const g = rng(seed);
  const parts = cols.map(() => '');
  for (let i = 0; i < n; i++) {
    const a = g.range(0, Math.PI * 2), r = Math.sqrt(g.next());
    const cx = Math.cos(a) * r * w * 0.42, cy = Math.sin(a) * r * h * 0.42, rr = g.range(0.12, 0.2) * Math.min(w, h);
    parts[i % cols.length] += circle(cx, cy, rr);
  }
  return parts.map((d, i) => sh(d, cols[i])).filter((p) => p.d);
}
/** Bare, twisty tree silhouette, origin at the base. */
export function bareTree(h: number, seed: number, col: string): Shape[] {
  const g = rng(seed);
  let d = '';
  const branch = (x: number, y: number, len: number, ang: number, w: number, depth: number) => {
    const a = (ang * Math.PI) / 180;
    const x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len;
    const mx = (x + x2) / 2 + g.range(-len * 0.12, len * 0.12), my = (y + y2) / 2 + g.range(-len * 0.08, len * 0.08);
    const nx = -Math.sin(a), ny = Math.cos(a);
    d += M(x + nx * w, y + ny * w) + Q(mx + nx * w * 0.7, my + ny * w * 0.7, x2 + nx * w * 0.35, y2 + ny * w * 0.35) + L(x2 - nx * w * 0.35, y2 - ny * w * 0.35) + Q(mx - nx * w * 0.7, my - ny * w * 0.7, x - nx * w, y - ny * w) + 'Z';
    if (depth > 0) {
      const k = depth > 2 ? 2 : g.int(2, 3);
      for (let i = 0; i < k; i++) branch(x2, y2, len * g.range(0.58, 0.74), ang + g.range(-38, 38) + (i - (k - 1) / 2) * 24, w * 0.62, depth - 1);
    }
  };
  branch(0, 0, h * 0.36, -90, h * 0.045, 4);
  return [sh(d, col)];
}

// =====================================================================
// pumpkins, gourds, straw
// =====================================================================
/** Pumpkin, origin bottom centre. face: 0 none, 1 triangle eyes, 2 round eyes, 3 happy crescent eyes, 4 star eyes. */
export function pumpkin(w: number, h: number, col = H.pumpkin, face = 0, stemCol = '#6b5a2a'): Shape[] {
  const cy = -h * 0.5, dk = shade(col, -0.14);
  const out: Shape[] = [
    shadow(0, -h * 0.02, w * 0.5, h * 0.08, 0.25),
    ol(ellipse(-w * 0.26, cy, w * 0.24, h * 0.48), dk, 1, -0.3), ol(ellipse(w * 0.26, cy, w * 0.24, h * 0.48), dk, 1, -0.3),
    ol(ellipse(-w * 0.12, cy, w * 0.22, h * 0.5), col, 1, -0.3), ol(ellipse(w * 0.12, cy, w * 0.22, h * 0.5), col, 1, -0.3),
    ol(ellipse(0, cy, w * 0.15, h * 0.5), shade(col, 0.08), 1, -0.3),
    ol(M(-w * 0.04, -h * 0.96) + Q(-w * 0.05, -h * 1.12, w * 0.06, -h * 1.2) + L(w * 0.09, -h * 1.12) + Q(w * 0.03, -h * 1.08, w * 0.05, -h * 0.96) + 'Z', stemCol, 1),
  ];
  if (face === 0) { out.push(hl(ellipse(-w * 0.14, -h * 0.68, w * 0.04, h * 0.14, 10), 0.25)); return out; }
  const gl = H.glow, inner = H.glowLt;
  let eyes = '', mouth = '';
  const ey = -h * 0.62, ex = w * 0.17, es = Math.min(w, h) * 0.13;
  if (face === 1) eyes = poly([[-ex - es, ey + es * 0.6], [-ex + es, ey + es * 0.6], [-ex, ey - es * 0.8]]) + poly([[ex - es, ey + es * 0.6], [ex + es, ey + es * 0.6], [ex, ey - es * 0.8]]);
  else if (face === 2) eyes = ellipse(-ex, ey, es * 0.8, es) + ellipse(ex, ey, es * 0.8, es);
  else if (face === 3) eyes = M(-ex - es, ey + es * 0.3) + Q(-ex, ey - es * 1.1, -ex + es, ey + es * 0.3) + Q(-ex, ey - es * 0.3, -ex - es, ey + es * 0.3) + 'Z' + M(ex - es, ey + es * 0.3) + Q(ex, ey - es * 1.1, ex + es, ey + es * 0.3) + Q(ex, ey - es * 0.3, ex - es, ey + es * 0.3) + 'Z';
  else eyes = star(-ex, ey, es * 1.1, es * 0.45) + star(ex, ey, es * 1.1, es * 0.45);
  const my = -h * 0.36, mw = w * 0.3;
  if (face === 1 || face === 4) {
    mouth = M(-mw, my - h * 0.04) + Q(0, my + h * 0.26, mw, my - h * 0.04) + L(mw * 0.62, my + h * 0.02) + L(mw * 0.45, my - h * 0.04) + L(mw * 0.2, my + h * 0.04) + L(0, my - h * 0.02) + L(-mw * 0.2, my + h * 0.04) + L(-mw * 0.45, my - h * 0.04) + L(-mw * 0.62, my + h * 0.02) + 'Z';
  } else if (face === 2) mouth = M(-mw * 0.7, my - h * 0.02) + Q(0, my + h * 0.2, mw * 0.7, my - h * 0.02) + Q(0, my + h * 0.08, -mw * 0.7, my - h * 0.02) + 'Z';
  else mouth = M(-mw, my - h * 0.06) + Q(0, my + h * 0.3, mw, my - h * 0.06) + Q(0, my + h * 0.06, -mw, my - h * 0.06) + 'Z';
  out.push(sh(eyes + mouth, '#8a3a10'), sh(xf(eyes + mouth, { s: 0.86, ox: 0, oy: -h * 0.5, y: h * 0.02 }), gl), sh(xf(eyes, { s: 0.5, ox: 0, oy: -h * 0.6 }), inner, { opacity: 0.8 }));
  if (face === 1 || face === 4) { let teeth = ''; for (const t of [-0.32, 0.32]) teeth += rect(mw * t - w * 0.025, my + h * 0.02, w * 0.05, h * 0.05); out.push(sh(teeth, col)); }
  out.push(hl(ellipse(-w * 0.3, -h * 0.72, w * 0.03, h * 0.1, 10), 0.22));
  return out;
}
/** Small gourd (bottle shape), origin bottom centre. */
export function gourd(s: number, col: string, stripe: string): Shape[] {
  const body = blob([[-s * 0.3, -s * 0.12], [-s * 0.26, -s * 0.38], [-s * 0.12, -s * 0.5], [-s * 0.12, -s * 0.78], [0, -s * 0.9], [s * 0.12, -s * 0.78], [s * 0.12, -s * 0.5], [s * 0.26, -s * 0.38], [s * 0.3, -s * 0.12], [0, 0]], 0.85);
  return [ol(body, col, 1, -0.3), stroke(curve([[0, -s * 0.84], [-s * 0.06, -s * 0.5], [-s * 0.12, -s * 0.06]]) + curve([[0, -s * 0.84], [s * 0.06, -s * 0.5], [s * 0.12, -s * 0.06]]), stripe, s * 0.05), sh(rect(-s * 0.03, -s * 1.0, s * 0.06, s * 0.13, 2), '#6b5a2a'), hl(ellipse(-s * 0.15, -s * 0.3, s * 0.04, s * 0.1), 0.3)];
}
/** Hay bale seen from the front, origin bottom centre. */
export function hayBale(w: number, h: number, seed: number): Shape[] {
  const g = rng(seed);
  let a = '', b = '';
  for (let i = 0; i < 46; i++) { const x = g.range(-w / 2 + 4, w / 2 - 4), y = g.range(-h + 4, -4), l = g.range(8, 20), ang = g.range(-30, 30); const d = xf(line([[0, 0], [l, 0]]), { rot: ang, x, y }); if (i % 2) a += d; else b += d; }
  return [shadow(0, 0, w * 0.55, 8, 0.25), ol(rect(-w / 2, -h, w, h, 8), '#e2bb5c', 1.2, -0.3), sh(rect(-w / 2, -h, w, h * 0.18, 8), '#efcf7a'), stroke(a, '#b88d34', 1.2), stroke(b, '#f6dc8c', 1.2), sh(rect(-w * 0.28, -h, w * 0.05, h) + rect(w * 0.23, -h, w * 0.05, h), '#a8743e', { opacity: 0.8 })];
}
/** Bundle of dried corn stalks tied in the middle, origin bottom centre. */
export function cornStalks(h: number, seed: number): Shape[] {
  const g = rng(seed);
  const out: Shape[] = [];
  const cols = ['#d9b45e', '#c9a04a', '#e6c87a', '#b98d3e'];
  for (let i = 0; i < 9; i++) {
    const bx = (i - 4) * h * 0.022, tx = (i - 4) * h * 0.06 + g.range(-6, 6), c = cols[i % cols.length];
    out.push(stroke(curve([[bx, 0], [bx * 0.6, -h * 0.4], [tx, -h * g.range(0.85, 1.0)]]), shade(c, -0.15), h * 0.018));
    out.push(sh(leaf(bx * 0.6 + tx * 0.3, -h * g.range(0.5, 0.8), h * g.range(0.26, 0.36), h * 0.035, i < 4 ? g.range(-170, -120) : g.range(-60, -10)), c, { stroke: shade(c, -0.25), strokeWidth: 0.8 }));
  }
  out.push(ol(rect(-h * 0.07, -h * 0.4, h * 0.14, h * 0.05, 2), '#8a5a34', 1));
  return out;
}
/** Wrapped sweet, origin centre. */
export function wrappedSweet(s: number, col: string): Shape[] {
  return [sh(poly([[-s * 0.5, -s * 0.22], [-s * 0.2, 0], [-s * 0.5, s * 0.22]]) + poly([[s * 0.5, -s * 0.22], [s * 0.2, 0], [s * 0.5, s * 0.22]]), shade(col, 0.15), { stroke: shade(col, -0.3), strokeWidth: 0.6 }), ol(ellipse(0, 0, s * 0.26, s * 0.18), col, 0.8), hl(ellipse(-s * 0.08, -s * 0.06, s * 0.08, s * 0.04), 0.6)];
}
/** Candy corn kernel, origin centre. */
export function candyCorn(s: number): Shape[] {
  const tri = M(0, -s * 0.5) + Q(s * 0.4, s * 0.2, s * 0.36, s * 0.42) + Q(0, s * 0.52, -s * 0.36, s * 0.42) + Q(-s * 0.4, s * 0.2, 0, -s * 0.5) + 'Z';
  return [sh(tri, '#f6f0e0'), sh(M(-s * 0.3, -s * 0.02) + L(s * 0.3, -s * 0.02) + Q(s * 0.4, s * 0.3, s * 0.36, s * 0.42) + Q(0, s * 0.52, -s * 0.36, s * 0.42) + Q(-s * 0.4, s * 0.3, -s * 0.3, -s * 0.02) + 'Z', '#f4a52c'), sh(M(-s * 0.34, s * 0.22) + L(s * 0.34, s * 0.22) + Q(s * 0.38, s * 0.36, s * 0.36, s * 0.42) + Q(0, s * 0.52, -s * 0.36, s * 0.42) + Q(-s * 0.38, s * 0.36, -s * 0.34, s * 0.22) + 'Z', '#f6d860')];
}

// =====================================================================
// Halloween
// =====================================================================
/** Friendly bat, origin at its body, `s` = wingspan. */
export function bat(s: number, col = '#4a3a62', face = true): Shape[] {
  const w = M(s * 0.08, -s * 0.06) + Q(s * 0.26, -s * 0.3, s * 0.5, -s * 0.16) + Q(s * 0.44, -s * 0.06, s * 0.42, s * 0.06) + Q(s * 0.36, 0, s * 0.3, s * 0.06) + Q(s * 0.24, -s * 0.01, s * 0.17, s * 0.08) + Q(s * 0.12, s * 0.02, s * 0.06, s * 0.06) + 'Z';
  const out: Shape[] = [sh(w + mirror(w), col, { stroke: shade(col, -0.35), strokeWidth: 1 }), stroke(line([[s * 0.1, -s * 0.04], [s * 0.42, s * 0.04]]) + line([[s * 0.1, -s * 0.04], [s * 0.28, s * 0.05]]) + mirror(line([[s * 0.1, -s * 0.04], [s * 0.42, s * 0.04]]) + line([[s * 0.1, -s * 0.04], [s * 0.28, s * 0.05]])), shade(col, -0.3), 0.8)];
  out.push(ol(poly([[-s * 0.08, -s * 0.06], [-s * 0.09, -s * 0.18], [-s * 0.02, -s * 0.1]]) + poly([[s * 0.08, -s * 0.06], [s * 0.09, -s * 0.18], [s * 0.02, -s * 0.1]]), col, 0.8), ol(ellipse(0, 0, s * 0.1, s * 0.11), col, 1));
  if (face) out.push(sh(circle(-s * 0.035, -s * 0.02, s * 0.028) + circle(s * 0.035, -s * 0.02, s * 0.028), '#fff6dc'), sh(circle(-s * 0.03, -s * 0.015, s * 0.013) + circle(s * 0.04, -s * 0.015, s * 0.013), '#1c1626'), sh(circle(-s * 0.06, s * 0.03, s * 0.016) + circle(s * 0.06, s * 0.03, s * 0.016), '#e89aa8', { opacity: 0.8 }), stroke(curve([[-s * 0.025, s * 0.04], [0, s * 0.058], [s * 0.025, s * 0.04]]), '#1c1626', Math.max(0.8, s * 0.008)), sh(poly([[-s * 0.016, s * 0.048], [-s * 0.008, s * 0.07], [0, s * 0.05]]), '#ffffff'));
  return out;
}
/** Black cat sitting, facing out, origin at its feet, `s` tall. */
export function blackCat(s: number, col = '#2c2735'): Shape[] {
  const lt = shade(col, 0.18), dk = shade(col, -0.4);
  return [
    shadow(0, 0, s * 0.36, s * 0.05, 0.3),
    stroke(M(s * 0.2, -s * 0.04) + Q(s * 0.52, -s * 0.02, s * 0.5, -s * 0.28) + Q(s * 0.48, -s * 0.44, s * 0.38, -s * 0.44), col, s * 0.08),
    sh(blob([[-s * 0.26, 0], [-s * 0.3, -s * 0.26], [-s * 0.18, -s * 0.52], [0, -s * 0.58], [s * 0.18, -s * 0.52], [s * 0.3, -s * 0.26], [s * 0.26, 0]], 0.9), col, { stroke: dk, strokeWidth: 1.2 }),
    sh(blob([[-s * 0.1, -s * 0.1], [-s * 0.12, -s * 0.34], [0, -s * 0.48], [s * 0.12, -s * 0.34], [s * 0.1, -s * 0.1]], 0.9), lt, { opacity: 0.6 }),
    sh(ellipse(-s * 0.1, -s * 0.03, s * 0.08, s * 0.045) + ellipse(s * 0.1, -s * 0.03, s * 0.08, s * 0.045), lt),
    sh(poly([[-s * 0.22, -s * 0.72], [-s * 0.2, -s * 0.98], [-s * 0.04, -s * 0.84]]) + poly([[s * 0.22, -s * 0.72], [s * 0.2, -s * 0.98], [s * 0.04, -s * 0.84]]), col, { stroke: dk, strokeWidth: 1 }),
    sh(poly([[-s * 0.18, -s * 0.78], [-s * 0.18, -s * 0.92], [-s * 0.08, -s * 0.84]]) + poly([[s * 0.18, -s * 0.78], [s * 0.18, -s * 0.92], [s * 0.08, -s * 0.84]]), '#c98aa0'),
    sh(ellipse(0, -s * 0.7, s * 0.24, s * 0.2), col, { stroke: dk, strokeWidth: 1.2 }),
    sh(rect(-s * 0.16, -s * 0.54, s * 0.32, s * 0.045, 2), '#e8742c'), ol(circle(0, -s * 0.49, s * 0.035), H.gold, 0.8),
    sh(ellipse(-s * 0.09, -s * 0.72, s * 0.06, s * 0.065) + ellipse(s * 0.09, -s * 0.72, s * 0.06, s * 0.065), '#d8e04a'),
    sh(ellipse(-s * 0.09, -s * 0.72, s * 0.018, s * 0.05) + ellipse(s * 0.09, -s * 0.72, s * 0.018, s * 0.05), '#14111a'),
    sh(circle(-s * 0.075, -s * 0.745, s * 0.014) + circle(s * 0.105, -s * 0.745, s * 0.014), '#ffffff'),
    sh(poly([[-s * 0.025, -s * 0.64], [s * 0.025, -s * 0.64], [0, -s * 0.615]]), '#e8a0b0'),
    stroke(line([[-s * 0.06, -s * 0.62], [-s * 0.3, -s * 0.66]]) + line([[-s * 0.06, -s * 0.61], [-s * 0.29, -s * 0.57]]) + line([[s * 0.06, -s * 0.62], [s * 0.3, -s * 0.66]]) + line([[s * 0.06, -s * 0.61], [s * 0.29, -s * 0.57]]), '#cfc8d8', 0.8),
  ];
}
/** Witch hat, origin bottom centre of the brim, `s` tall. */
export function witchHat(s: number, col = '#5a3f7a', band = '#e8742c'): Shape[] {
  const cone = M(-s * 0.28, -s * 0.08) + L(-s * 0.1, -s * 0.62) + Q(-s * 0.02, -s * 0.92, s * 0.32, -s * 0.94) + Q(s * 0.1, -s * 0.8, s * 0.08, -s * 0.6) + L(s * 0.28, -s * 0.08) + 'Z';
  return [ol(ellipse(0, -s * 0.06, s * 0.52, s * 0.1), shade(col, -0.1), 1.2), ol(cone, col, 1.2), sh(M(s * 0.02, -s * 0.6) + Q(s * 0.06, -s * 0.8, s * 0.3, -s * 0.93) + Q(s * 0.1, -s * 0.8, s * 0.08, -s * 0.6) + L(s * 0.28, -s * 0.08) + L(s * 0.14, -s * 0.08) + 'Z', shade(col, -0.18)), sh(M(-s * 0.26, -s * 0.13) + L(s * 0.26, -s * 0.13) + L(s * 0.23, -s * 0.26) + L(-s * 0.23, -s * 0.26) + 'Z', band), ol(rect(-s * 0.07, -s * 0.26, s * 0.14, s * 0.13, 1), H.gold, 1, -0.35), sh(rect(-s * 0.035, -s * 0.23, s * 0.07, s * 0.07), band), sh(star(-s * 0.12, -s * 0.44, s * 0.05, s * 0.02) + star(s * 0.06, -s * 0.36, s * 0.035, s * 0.014), '#f6d860')];
}
/** Ghost costume: a sheet hanging from a hook, origin at the hook, `s` tall. */
export function ghostSheet(s: number): Shape[] {
  const w = s * 0.34;
  let hem = M(0, s * 0.04) + Q(-w * 0.62, s * 0.06, -w * 0.78, s * 0.34) + L(-w, s * 0.92);
  const n = 5;
  for (let i = 0; i < n; i++) { const x0 = -w + (2 * w * i) / n, x1 = -w + (2 * w * (i + 1)) / n; hem += Q((x0 + x1) / 2, s * (i % 2 ? 1.02 : 0.98), x1, s * 0.92); }
  hem += L(w * 0.78, s * 0.34) + Q(w * 0.62, s * 0.06, 0, s * 0.04) + 'Z';
  return [stroke(M(0, -s * 0.02) + L(0, s * 0.05), '#5a5250', 2), ol(hem, '#f8f6f2', 1.2, -0.25), stroke(curve([[-w * 0.4, s * 0.4], [-w * 0.5, s * 0.66], [-w * 0.46, s * 0.92]]) + curve([[w * 0.36, s * 0.42], [w * 0.5, s * 0.7], [w * 0.5, s * 0.92]]) + curve([[0, s * 0.56], [w * 0.06, s * 0.76], [0, s * 0.96]]), '#d8d2cc', 1.4), sh(ellipse(-w * 0.26, s * 0.24, w * 0.11, w * 0.15) + ellipse(w * 0.26, s * 0.24, w * 0.11, w * 0.15), '#2a2430'), sh(ellipse(0, s * 0.36, w * 0.1, w * 0.07), '#2a2430'), sh(ellipse(-w * 0.44, s * 0.32, w * 0.08, w * 0.04) + ellipse(w * 0.44, s * 0.32, w * 0.08, w * 0.04), '#f0a8b8', { opacity: 0.6 })];
}
/** Hooded cape hanging from a hook, origin at the hook. */
export function cape(s: number, col: string, lining: string): Shape[] {
  const w = s * 0.36;
  return [stroke(M(0, -s * 0.02) + L(0, s * 0.05), '#5a5250', 2), ol(M(-w * 0.3, s * 0.05) + Q(-w * 0.9, s * 0.3, -w, s) + Q(0, s * 1.06, w, s) + Q(w * 0.9, s * 0.3, w * 0.3, s * 0.05) + 'Z', col, 1.2), sh(M(-w * 0.2, s * 0.12) + Q(-w * 0.3, s * 0.6, -w * 0.12, s * 1.02) + L(w * 0.12, s * 1.02) + Q(w * 0.3, s * 0.6, w * 0.2, s * 0.12) + 'Z', lining), stroke(curve([[-w * 0.6, s * 0.4], [-w * 0.7, s * 0.7], [-w * 0.66, s * 0.98]]) + curve([[w * 0.6, s * 0.4], [w * 0.7, s * 0.7], [w * 0.66, s * 0.98]]), shade(col, -0.3), 1.4), ol(ellipse(0, s * 0.06, w * 0.32, s * 0.08), shade(col, -0.1), 1)];
}
/** Bentwood coat stand, origin bottom centre, `h` tall. */
export function coatRack(h: number, col = '#6e4a2a'): Shape[] {
  const out: Shape[] = [shadow(0, 0, h * 0.2, h * 0.02, 0.3)];
  out.push(stroke(curve([[0, -h * 0.18], [-h * 0.1, -h * 0.06], [-h * 0.18, 0]]) + curve([[0, -h * 0.18], [h * 0.1, -h * 0.06], [h * 0.18, 0]]) + line([[0, -h * 0.18], [0, 0]]), col, h * 0.02));
  out.push(ol(rect(-h * 0.017, -h * 0.98, h * 0.034, h * 0.82, 3), col, 1, -0.35), sh(rect(-h * 0.011, -h * 0.96, h * 0.008, h * 0.78), shade(col, 0.25)));
  let hooks = '';
  for (const s of [-1, 1]) { hooks += M(0, -h * 0.9) + Q(s * h * 0.12, -h * 0.9, s * h * 0.12, -h * 0.82) + Q(s * h * 0.12, -h * 0.78, s * h * 0.08, -h * 0.8); hooks += M(0, -h * 0.76) + Q(s * h * 0.1, -h * 0.76, s * h * 0.1, -h * 0.7) + Q(s * h * 0.1, -h * 0.66, s * h * 0.07, -h * 0.68); }
  out.push(stroke(hooks, col, h * 0.014), ol(circle(0, -h * 0.99, h * 0.03), col, 1, -0.35), ol(rect(-h * 0.03, -h * 0.24, h * 0.06, h * 0.03, 2), shade(col, 0.1), 1));
  return out;
}
/** Witch's broom, origin at the tip of the bristles, pointing up, `l` long. */
export function broom(l: number): Shape[] {
  const g = rng(7);
  let br = '';
  for (let i = 0; i < 14; i++) { const t = (i / 13 - 0.5); br += line([[t * l * 0.08, -l * 0.3], [t * l * 0.26 + g.range(-2, 2), -2]]); }
  return [
    ol(rect(-l * 0.018, -l, l * 0.036, l * 0.74, l * 0.015), '#8a5a34', 1), sh(rect(-l * 0.01, -l * 0.98, l * 0.008, l * 0.7), '#b07a4a'),
    stroke(curve([[0, -l * 0.94], [l * 0.03, -l * 0.98], [l * 0.05, -l * 1.0]]), '#7a8a3a', 1.4), sh(leaf(l * 0.03, -l * 0.97, l * 0.06, l * 0.02, -40), '#8aa04a'),
    ol(M(-l * 0.05, -l * 0.3) + L(l * 0.05, -l * 0.3) + Q(l * 0.15, -l * 0.15, l * 0.14, 0) + Q(0, l * 0.02, -l * 0.14, 0) + Q(-l * 0.15, -l * 0.15, -l * 0.05, -l * 0.3) + 'Z', '#d9b25a', 1, -0.35),
    stroke(br, '#a8803a', 1.1), ol(rect(-l * 0.06, -l * 0.32, l * 0.12, l * 0.04, 2), '#7a4a8a', 1), ol(rect(-l * 0.09, -l * 0.2, l * 0.18, l * 0.03, 2), '#7a4a8a', 1),
  ];
}
/** Little owl perched, origin at its feet, `s` tall. */
export function owl(s: number, col = '#8a6040'): Shape[] {
  const lt = '#e9d3a8';
  let marks = '';
  for (let r = 0; r < 3; r++) for (let c = -1; c <= 1; c++) marks += M(c * s * 0.09 - s * 0.03, -s * 0.36 + r * s * 0.09) + Q(c * s * 0.09, -s * 0.32 + r * s * 0.09, c * s * 0.09 + s * 0.03, -s * 0.36 + r * s * 0.09);
  return [
    ol(blob([[-s * 0.28, -s * 0.05], [-s * 0.32, -s * 0.4], [-s * 0.24, -s * 0.72], [0, -s * 0.8], [s * 0.24, -s * 0.72], [s * 0.32, -s * 0.4], [s * 0.28, -s * 0.05], [0, 0]], 0.85), col, 1.2),
    ol(poly([[-s * 0.26, -s * 0.66], [-s * 0.3, -s * 0.94], [-s * 0.1, -s * 0.76]]) + poly([[s * 0.26, -s * 0.66], [s * 0.3, -s * 0.94], [s * 0.1, -s * 0.76]]), col, 1),
    sh(blob([[-s * 0.16, -s * 0.06], [-s * 0.2, -s * 0.3], [0, -s * 0.44], [s * 0.2, -s * 0.3], [s * 0.16, -s * 0.06]], 0.9), lt), stroke(marks, shade(col, -0.1), 1.2),
    sh(leaf(-s * 0.26, -s * 0.5, s * 0.44, s * 0.1, 80) + leaf(s * 0.26, -s * 0.5, s * 0.44, s * 0.1, 100), shade(col, -0.18)),
    sh(circle(-s * 0.12, -s * 0.6, s * 0.13) + circle(s * 0.12, -s * 0.6, s * 0.13), '#f4e4c0', { stroke: shade(col, -0.2), strokeWidth: 1 }),
    sh(circle(-s * 0.12, -s * 0.6, s * 0.08) + circle(s * 0.12, -s * 0.6, s * 0.08), '#f0a83a'), sh(circle(-s * 0.11, -s * 0.6, s * 0.045) + circle(s * 0.11, -s * 0.6, s * 0.045), '#1c1626'), sh(circle(-s * 0.095, -s * 0.62, s * 0.016) + circle(s * 0.125, -s * 0.62, s * 0.016), '#ffffff'),
    sh(poly([[-s * 0.04, -s * 0.52], [s * 0.04, -s * 0.52], [0, -s * 0.44]]), '#e88a2a'),
    sh(ellipse(-s * 0.08, -s * 0.01, s * 0.06, s * 0.03) + ellipse(s * 0.08, -s * 0.01, s * 0.06, s * 0.03), '#e88a2a'),
  ];
}
/** Spider web with a friendly little spider, origin at the web's anchor corner (top-left), radius r. */
export function spiderWeb(r: number, col = '#f2eef8'): Shape[] {
  const spokes = 7, rings = 5;
  let sp = '', rg = '';
  const ang = (i: number) => ((i / (spokes - 1)) * 90 * Math.PI) / 180;
  for (let i = 0; i < spokes; i++) sp += line([[0, 0], [Math.cos(ang(i)) * r, Math.sin(ang(i)) * r]]);
  for (let k = 1; k <= rings; k++) {
    const rr = (r * k) / rings;
    rg += M(Math.cos(ang(0)) * rr, Math.sin(ang(0)) * rr);
    for (let i = 1; i < spokes; i++) { const a0 = ang(i - 1), a1 = ang(i), am = (a0 + a1) / 2; rg += Q(Math.cos(am) * rr * 0.86, Math.sin(am) * rr * 0.86, Math.cos(a1) * rr, Math.sin(a1) * rr); }
  }
  const bx = r * 0.5, by = r * 0.72, s = r * 0.32;
  return [
    sh(sector(0, 0, r, 0, 90), col, { opacity: 0.08 }),
    stroke(sp, col, 1.2, { opacity: 0.9 }), stroke(rg, col, 1, { opacity: 0.85 }),
    stroke(line([[bx, by - s * 0.8], [bx, by - s * 0.2]]), col, 0.8),
    stroke(curve([[bx - s * 0.1, by], [bx - s * 0.4, by - s * 0.2], [bx - s * 0.55, by + s * 0.1]]) + curve([[bx - s * 0.1, by + s * 0.1], [bx - s * 0.45, by + s * 0.1], [bx - s * 0.5, by + s * 0.4]]) + curve([[bx + s * 0.1, by], [bx + s * 0.4, by - s * 0.2], [bx + s * 0.55, by + s * 0.1]]) + curve([[bx + s * 0.1, by + s * 0.1], [bx + s * 0.45, by + s * 0.1], [bx + s * 0.5, by + s * 0.4]]), '#2a2236', s * 0.06),
    sh(circle(bx, by + s * 0.12, s * 0.26), '#3a2f4a'), sh(circle(bx, by - s * 0.12, s * 0.18), '#3a2f4a'),
    sh(circle(bx - s * 0.07, by - s * 0.14, s * 0.06) + circle(bx + s * 0.07, by - s * 0.14, s * 0.06), '#ffffff'), sh(circle(bx - s * 0.06, by - s * 0.13, s * 0.03) + circle(bx + s * 0.08, by - s * 0.13, s * 0.03), '#1c1626'),
  ];
}
function sector(cx: number, cy: number, r: number, a0: number, a1: number): string {
  const pts: Pt[] = [[cx, cy]];
  for (let i = 0; i <= 12; i++) { const a = ((a0 + ((a1 - a0) * i) / 12) * Math.PI) / 180; pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
  return poly(pts);
}
/** Trick-or-treat pumpkin pail with sweets, origin bottom centre, `s` tall (without handle). */
export function pumpkinPail(s: number): Shape[] {
  const w = s * 1.1;
  const body = M(-w * 0.4, -s * 0.86) + Q(-w * 0.58, -s * 0.5, -w * 0.44, -s * 0.08) + Q(0, s * 0.04, w * 0.44, -s * 0.08) + Q(w * 0.58, -s * 0.5, w * 0.4, -s * 0.86) + 'Z';
  const face = poly([[-w * 0.26, -s * 0.48], [-w * 0.1, -s * 0.48], [-w * 0.18, -s * 0.66]]) + poly([[w * 0.26, -s * 0.48], [w * 0.1, -s * 0.48], [w * 0.18, -s * 0.66]]) + M(-w * 0.3, -s * 0.34) + Q(0, -s * 0.06, w * 0.3, -s * 0.34) + L(w * 0.18, -s * 0.28) + L(w * 0.08, -s * 0.34) + L(-w * 0.04, -s * 0.26) + L(-w * 0.14, -s * 0.33) + L(-w * 0.22, -s * 0.27) + 'Z';
  return [
    shadow(0, 0, w * 0.48, s * 0.07, 0.3),
    stroke(M(-w * 0.42, -s * 0.8) + Q(0, -s * 1.5, w * 0.42, -s * 0.8), '#2a2430', s * 0.05),
    sh(circle(-w * 0.18, -s * 0.88, s * 0.12), '#d8452f'), sh(circle(w * 0.06, -s * 0.92, s * 0.13), '#7ac06a'), ...place2(wrappedSweet(s * 0.32, '#6f8fd6'), w * 0.24, -s * 0.9, 30), sh(circle(-w * 0.02, -s * 0.84, s * 0.1), '#f4c63a'),
    ol(body, H.pumpkin, 1.2, -0.3), stroke(curve([[-w * 0.2, -s * 0.84], [-w * 0.3, -s * 0.46], [-w * 0.22, -s * 0.06]]) + curve([[w * 0.2, -s * 0.84], [w * 0.3, -s * 0.46], [w * 0.22, -s * 0.06]]), H.pumpkinDk, 1.2),
    ol(ellipse(0, -s * 0.86, w * 0.4, s * 0.08), shade(H.pumpkin, -0.1), 1), sh(face, '#2a2430'), hl(ellipse(-w * 0.32, -s * 0.6, w * 0.04, s * 0.12), 0.3),
  ];
}
function place2(shapes: Shape[], x: number, y: number, rot = 0): Shape[] { return shapes.map((p) => ({ ...p, d: xf(p.d, { x, y, rot }) })); }
/** Toffee apple on a stick, origin bottom centre, `s` tall. */
export function candyApple(s: number, col = '#c8202e'): Shape[] {
  const r = s * 0.3;
  return [
    shadow(0, 0, r * 1.1, r * 0.18, 0.3), sh(ellipse(0, -r * 0.05, r * 1.05, r * 0.22), shade(col, -0.25)),
    ol(rect(-s * 0.025, -s, s * 0.05, s * 0.5, 2), '#e8d2a0', 0.8, -0.3),
    ol(M(0, -r * 1.78) + CB(r * 0.6, -r * 2.05, r * 1.15, -r * 1.55, r * 1.0, -r * 0.7) + CB(r * 0.9, -r * 0.1, r * 0.4, -r * 0.02, 0, -r * 0.12) + CB(-r * 0.4, -r * 0.02, -r * 0.9, -r * 0.1, -r * 1.0, -r * 0.7) + CB(-r * 1.15, -r * 1.55, -r * 0.6, -r * 2.05, 0, -r * 1.78) + 'Z', col, 1.2, -0.35),
    sh(M(-r * 0.95, -r * 0.6) + Q(-r * 0.8, -r * 0.3, -r * 0.6, -r * 0.4) + Q(-r * 0.5, -r * 0.2, -r * 0.3, -r * 0.3) + Q(0, -r * 0.1, r * 0.3, -r * 0.32) + Q(r * 0.5, -r * 0.18, r * 0.6, -r * 0.38) + Q(r * 0.8, -r * 0.26, r * 0.96, -r * 0.6) + Q(r * 0.6, -r * 0.02, 0, -r * 0.1) + Q(-r * 0.6, -r * 0.02, -r * 0.95, -r * 0.6) + 'Z', shade(col, -0.2)),
    hl(ellipse(-r * 0.45, -r * 1.25, r * 0.16, r * 0.3, 25), 0.55), hl(circle(r * 0.5, -r * 1.4, r * 0.07), 0.6),
  ];
}
/** Swirly lollipop, origin at the bottom of the stick, `s` long. */
export function lollipop(s: number, a = '#e85a8a', b = '#fbeef2'): Shape[] {
  const r = s * 0.3, cy = -s + r;
  let sp = '';
  const pts: Pt[] = [];
  for (let i = 0; i <= 40; i++) { const t = i / 40, ang = t * Math.PI * 5, rr = r * 0.92 * t; pts.push([Math.cos(ang) * rr, cy + Math.sin(ang) * rr]); }
  sp = curve(pts);
  return [ol(rect(-s * 0.025, cy, s * 0.05, s - r, 2), '#f6f0e4', 0.8, -0.25), ol(circle(0, cy, r), a, 1.2, -0.3), stroke(sp, b, r * 0.2), hl(ellipse(-r * 0.4, cy - r * 0.45, r * 0.25, r * 0.12, -30), 0.5), ol(M(-r * 0.25, cy + r * 0.92) + L(r * 0.25, cy + r * 0.92) + L(0, cy + r * 1.2) + 'Z', '#f4c63a', 0.8)];
}
/** Bowl of wrapped sweets, origin bottom centre. */
export function candyBowl(w: number, seed: number): Shape[] {
  const g = rng(seed);
  const h = w * 0.36;
  const out: Shape[] = [shadow(0, 0, w * 0.52, h * 0.12, 0.3)];
  const cols = ['#d8452f', '#f4c63a', '#7ac06a', '#8a5ad0', '#f08a2a', '#6f8fd6', '#e85a8a'];
  for (let i = 0; i < 16; i++) { const x = g.range(-w * 0.4, w * 0.4), y = -h - g.range(-4, h * 0.38) * (1 - Math.abs(x) / (w * 0.5)); out.push(...place2(i % 4 === 3 ? candyCorn(w * 0.12) : wrappedSweet(w * 0.2, g.pick(cols)), x, y, g.range(-50, 50))); }
  const body = M(-w / 2, -h) + Q(-w * 0.46, 0, 0, 0) + Q(w * 0.46, 0, w / 2, -h) + 'Z';
  out.push(ol(body, '#f3e9d4', 1.2, -0.3), sh(M(-w * 0.47, -h * 0.7) + Q(0, -h * 0.46, w * 0.47, -h * 0.7) + L(w * 0.44, -h * 0.52) + Q(0, -h * 0.28, -w * 0.44, -h * 0.52) + 'Z', H.pumpkin));
  for (let i = -2; i <= 2; i++) out.push(...place2(bat(w * 0.14, '#3a2f4a', false), i * w * 0.17, -h * 0.58 + Math.abs(i) * h * 0.04));
  out.push(sh(rect(-w * 0.16, -h * 0.05, w * 0.32, h * 0.07, 2), '#d8c8a8'), hl(ellipse(-w * 0.3, -h * 0.4, w * 0.03, h * 0.16, 20), 0.35));
  return out;
}
/** Little black cauldron full of sweets, origin bottom centre, `w` wide. */
export function cauldron(w: number, seed: number): Shape[] {
  const g = rng(seed);
  const h = w * 0.72;
  const out: Shape[] = [shadow(0, 0, w * 0.55, h * 0.08, 0.3), sh(poly([[-w * 0.32, -h * 0.2], [-w * 0.24, -h * 0.2], [-w * 0.3, 0], [-w * 0.38, 0]]) + poly([[w * 0.32, -h * 0.2], [w * 0.24, -h * 0.2], [w * 0.3, 0], [w * 0.38, 0]]), '#1f1b26')];
  out.push(stroke(M(-w * 0.4, -h * 0.82) + Q(0, -h * 1.35, w * 0.4, -h * 0.82), '#3a3444', w * 0.035));
  out.push(sh(ellipse(0, -h * 0.84, w * 0.42, h * 0.1), '#7a4ab0'));
  const cols = ['#d8452f', '#f4c63a', '#7ac06a', '#e85a8a'];
  for (let i = 0; i < 6; i++) out.push(...place2(wrappedSweet(w * 0.22, g.pick(cols)), g.range(-w * 0.28, w * 0.28), -h * 0.86 - g.range(0, h * 0.08), g.range(-40, 40)));
  out.push(sh(circle(-w * 0.12, -h * 0.96, w * 0.05) + circle(w * 0.18, -h * 0.98, w * 0.04), '#b88ae0', { opacity: 0.8 }));
  out.push(ol(M(-w * 0.44, -h * 0.82) + Q(-w * 0.62, -h * 0.3, -w * 0.22, -h * 0.12) + Q(0, -h * 0.08, w * 0.22, -h * 0.12) + Q(w * 0.62, -h * 0.3, w * 0.44, -h * 0.82) + 'Z', '#2c2735', 1.2, -0.4));
  out.push(ol(rect(-w * 0.48, -h * 0.9, w * 0.96, h * 0.1, h * 0.05), '#3a3444', 1, -0.4), hl(ellipse(-w * 0.3, -h * 0.5, w * 0.04, h * 0.16, 15), 0.18));
  return out;
}
/** Hanging lantern, origin at the hook on top, `h` tall. glass gives the glow colour. */
export function lantern(h: number, frame = '#2c2735', glass = H.glow, glow = true): Shape[] {
  const w = h * 0.5;
  const out: Shape[] = [];
  if (glow) out.push(sh(circle(0, h * 0.55, h * 0.75), glass, { opacity: 0.14 }), sh(circle(0, h * 0.55, h * 0.48), glass, { opacity: 0.16 }));
  out.push(stroke(circle(0, h * 0.04, h * 0.05), frame, h * 0.025));
  out.push(ol(poly([[-w * 0.18, h * 0.08], [w * 0.18, h * 0.08], [w * 0.55, h * 0.24], [-w * 0.55, h * 0.24]]), frame, 1, 0.2));
  out.push(sh(rect(-w * 0.42, h * 0.24, w * 0.84, h * 0.58, 2), glass), sh(rect(-w * 0.22, h * 0.3, w * 0.44, h * 0.46, 2), H.glowLt, { opacity: 0.75 }));
  out.push(sh(M(-w * 0.07, h * 0.66) + Q(-w * 0.12, h * 0.52, 0, h * 0.4) + Q(w * 0.12, h * 0.52, w * 0.07, h * 0.66) + 'Z', '#f6a83a'), sh(rect(-w * 0.08, h * 0.66, w * 0.16, h * 0.14), '#fbf3df'));
  out.push(stroke(rect(-w * 0.42, h * 0.24, w * 0.84, h * 0.58) + line([[0, h * 0.24], [0, h * 0.82]]), frame, h * 0.03), ol(rect(-w * 0.52, h * 0.82, w * 1.04, h * 0.08, 2), frame, 1, 0.2), sh(rect(-w * 0.3, h * 0.9, w * 0.6, h * 0.06), frame));
  return out;
}
/** Paper lantern (round, ribbed), origin at its top string. */
export function paperLantern(r: number, col: string): Shape[] {
  let ribs = '';
  for (let i = 1; i < 5; i++) { const y = r * 0.2 + (i * r * 1.6) / 5, ww = r * Math.sqrt(Math.max(0.05, 1 - Math.pow((y - r) / r, 2))); ribs += line([[-ww, y], [ww, y]]); }
  return [sh(circle(0, r, r * 1.5), col, { opacity: 0.12 }), ol(ellipse(0, r, r, r * 0.86), col, 1, -0.25), stroke(ribs, shade(col, -0.2), 1), sh(ellipse(0, r * 1.0, r * 0.55, r * 0.5), H.glowLt, { opacity: 0.35 }), sh(rect(-r * 0.3, 0, r * 0.6, r * 0.18) + rect(-r * 0.3, r * 1.78, r * 0.6, r * 0.16), '#2c2735')];
}
/** Rocking chair seen from the front, origin bottom centre (rockers). */
export function rockingChair(w: number, h: number, col: string): Shape[] {
  let sp = '';
  for (let i = 1; i < 6; i++) { const x = -w * 0.4 + (i * w * 0.8) / 6; sp += line([[x, -h * 0.5], [x, -h * 0.92]]); }
  return [
    shadow(0, 0, w * 0.6, h * 0.03, 0.25),
    ol(M(-w * 0.62, -h * 0.06) + Q(0, h * 0.06, w * 0.62, -h * 0.06) + L(w * 0.62, -h * 0.02) + Q(0, h * 0.1, -w * 0.62, -h * 0.02) + 'Z', col, 1),
    ol(rect(-w * 0.46, -h, w * 0.08, h * 0.96, 3) + rect(w * 0.38, -h, w * 0.08, h * 0.96, 3), col, 1, -0.35),
    stroke(sp, col, w * 0.04), ol(rect(-w * 0.48, -h * 1.02, w * 0.96, h * 0.08, 4), shade(col, 0.08), 1),
    ol(rect(-w * 0.5, -h * 0.5, w, h * 0.08, 3), shade(col, 0.1), 1), ol(rect(-w * 0.58, -h * 0.66, w * 0.14, h * 0.05, 2) + rect(w * 0.44, -h * 0.66, w * 0.14, h * 0.05, 2), col, 1),
  ];
}
/** Draped plaid blanket hanging over a rail, origin at the top centre. */
export function plaidThrow(w: number, h: number, a: string, b: string): Shape[] {
  const body = M(-w / 2, 0) + L(w / 2, 0) + Q(w * 0.54, h * 0.5, w * 0.46, h) + Q(0, h * 1.06, -w * 0.46, h) + Q(-w * 0.54, h * 0.5, -w / 2, 0) + 'Z';
  let v = '', hz = '';
  for (let i = 1; i < 6; i++) { const t = i / 6; v += line([[-w / 2 + w * t, 0], [-w * 0.46 + w * 0.92 * t, h]]); }
  for (let i = 1; i < 5; i++) hz += line([[-w * 0.5, (h * i) / 5], [w * 0.5, (h * i) / 5]]);
  const fr = Array.from({ length: 12 }, (_, i) => line([[-w * 0.44 + (i * w * 0.88) / 11, h * 1.01], [-w * 0.44 + (i * w * 0.88) / 11, h * 1.1]])).join('');
  return [ol(body, a, 1.2), stroke(v, b, w * 0.05, { opacity: 0.75 }), stroke(hz, b, w * 0.04, { opacity: 0.6 }), stroke(v + hz, '#fbf3df', 1, { opacity: 0.5 }), stroke(fr, a, 2)];
}

// =====================================================================
// Thanksgiving
// =====================================================================
/** Roast turkey on an oval platter with garnish, origin at platter centre, `w` = platter width. */
export function roastTurkey(w: number): Shape[] {
  const s = w * 0.62;
  const out: Shape[] = [shadow(0, w * 0.1, w * 0.54, w * 0.14, 0.2), ol(ellipse(0, 0, w * 0.5, w * 0.2), '#f7f2e6', 1.2, -0.2), stroke(ellipse(0, 0, w * 0.44, w * 0.165), '#c9a24a', 1.4), sh(ellipse(0, 0, w * 0.4, w * 0.14), '#eee6d4')];
  // garnish
  let lv = '';
  for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2; lv += leaf(Math.cos(a) * w * 0.36, Math.sin(a) * w * 0.12, w * 0.07, w * 0.025, (a * 180) / Math.PI + 90); }
  out.push(sh(lv, '#5f8a45'));
  let ber = '';
  for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2 + 0.2; ber += circle(Math.cos(a) * w * 0.38, Math.sin(a) * w * 0.13, w * 0.018); }
  out.push(sh(ber, '#b8202e'));
  for (const sx of [-1, 1]) out.push(ol(xf(ellipse(0, 0, w * 0.06, w * 0.035), { x: sx * w * 0.34, y: w * 0.05 }), '#f4a52c', 0.8), sh(xf(ellipse(0, 0, w * 0.04, w * 0.022), { x: sx * w * 0.34, y: w * 0.05 }), '#fbd27a'));
  // body
  const body = blob([[-s * 0.52, -s * 0.02], [-s * 0.48, -s * 0.28], [-s * 0.28, -s * 0.46], [0, -s * 0.5], [s * 0.3, -s * 0.44], [s * 0.5, -s * 0.26], [s * 0.54, -s * 0.02], [0, s * 0.08]], 0.85);
  out.push(ol(body, '#c47a32', 1.4, -0.35));
  out.push(sh(blob([[-s * 0.4, -s * 0.12], [-s * 0.3, -s * 0.36], [0, -s * 0.44], [s * 0.26, -s * 0.38], [s * 0.36, -s * 0.18], [0, -s * 0.06]], 0.9), '#d8954a'));
  out.push(hl(ellipse(-s * 0.08, -s * 0.34, s * 0.18, s * 0.06, -8), 0.35), hl(ellipse(s * 0.22, -s * 0.26, s * 0.06, s * 0.03, 20), 0.3));
  out.push(stroke(curve([[-s * 0.1, -s * 0.48], [0, -s * 0.2], [-s * 0.02, s * 0.04]]), '#9a5a24', 1.4, { opacity: 0.6 }));
  // drumsticks
  for (const sx of [-1, 1]) {
    const leg = xf(blob([[0, 0], [s * 0.14, -s * 0.08], [s * 0.26, -s * 0.02], [s * 0.3, s * 0.1], [s * 0.18, s * 0.16], [s * 0.04, s * 0.12]], 0.9), { sx, sy: 1, x: sx * s * 0.3, y: -s * 0.14 });
    out.push(ol(leg, '#b86e2a', 1.2, -0.35));
    const bx = sx * s * 0.6, by = -s * 0.26;
    out.push(ol(xf(rect(-s * 0.03, -s * 0.12, s * 0.06, s * 0.14, 2), { rot: sx * 40, x: bx, y: by }), '#f6eedc', 1, -0.25));
    let fr = '';
    for (let i = 0; i < 5; i++) fr += xf(poly([[-s * 0.045 + i * s * 0.022, -s * 0.12], [-s * 0.035 + i * s * 0.022, -s * 0.18], [-s * 0.025 + i * s * 0.022, -s * 0.12]]), { rot: sx * 40, x: bx, y: by });
    out.push(sh(fr, '#ffffff', { stroke: '#d8d0c0', strokeWidth: 0.6 }));
  }
  return out;
}
/** Pie in a dish seen at an angle, origin at its centre, radius r. kind: 0 pumpkin, 1 apple lattice, 2 pecan, 3 cherry lattice. */
export function pie(r: number, kind: number): Shape[] {
  const ry = r * 0.46;
  const out: Shape[] = [shadow(0, ry * 0.9, r * 1.08, ry * 0.4, 0.2), ol(M(-r * 1.04, 0) + L(-r * 0.86, ry * 0.92) + Q(0, ry * 1.6, r * 0.86, ry * 0.92) + L(r * 1.04, 0) + 'Z', kind === 1 ? '#6f8fd6' : '#e8dcc0', 1, -0.3)];
  out.push(ol(ellipse(0, 0, r * 1.04, ry * 1.04), '#d9a35a', 1, -0.3));
  let cr = '';
  for (let i = 0; i < 26; i++) { const a = (i / 26) * Math.PI * 2; cr += ellipse(Math.cos(a) * r * 0.95, Math.sin(a) * ry * 0.95, r * 0.08, ry * 0.12); }
  out.push(sh(cr, '#e8b86a', { stroke: '#b98444', strokeWidth: 0.6 }));
  const fill = ['#d8792a', '#e0a040', '#7a4520', '#b01e2e'][kind];
  out.push(sh(ellipse(0, 0, r * 0.84, ry * 0.82), fill));
  if (kind === 0) {
    out.push(sh(ellipse(-r * 0.2, -ry * 0.2, r * 0.4, ry * 0.3), '#e48a3a', { opacity: 0.7 }));
    let cream = '';
    for (const [x, y] of [[0, 0], [-r * 0.45, -ry * 0.25], [r * 0.45, -ry * 0.2], [-r * 0.3, ry * 0.4], [r * 0.32, ry * 0.42]] as Pt[]) cream += M(x - r * 0.12, y) + Q(x - r * 0.12, y - ry * 0.4, x, y - ry * 0.5) + Q(x + r * 0.12, y - ry * 0.4, x + r * 0.12, y) + Q(x, y + ry * 0.12, x - r * 0.12, y) + 'Z';
    out.push(sh(cream, '#fbf6ea', { stroke: '#e0d6c4', strokeWidth: 0.8 }), sh(circle(0, -ry * 0.32, r * 0.04), '#c8722a', { opacity: 0.6 }));
  } else if (kind === 2) {
    let pc = '';
    for (let k = 0; k < 2; k++) for (let i = 0; i < (k ? 7 : 12); i++) { const a = (i / (k ? 7 : 12)) * Math.PI * 2, rr = k ? 0.38 : 0.68; pc += ellipse(Math.cos(a) * r * rr, Math.sin(a) * ry * rr, r * 0.12, ry * 0.16, (a * 180) / Math.PI); }
    out.push(sh(pc, '#a8642a', { stroke: '#5a3010', strokeWidth: 0.7 }), hl(ellipse(-r * 0.3, -ry * 0.3, r * 0.3, ry * 0.12), 0.25));
  } else {
    if (kind === 3) { let ch = ''; for (let i = 0; i < 9; i++) ch += circle(-r * 0.6 + (i % 3) * r * 0.55 + (i > 5 ? r * 0.1 : 0), -ry * 0.5 + Math.floor(i / 3) * ry * 0.5, r * 0.08); out.push(sh(ch, '#d8283a')); }
    else { let ap = ''; for (let i = 0; i < 7; i++) ap += ellipse(-r * 0.5 + i * r * 0.17, (i % 2 ? -1 : 1) * ry * 0.3, r * 0.1, ry * 0.18, 30); out.push(sh(ap, '#f2c870')); }
    let lat = '';
    for (let i = -2; i <= 2; i++) {
      const x = i * r * 0.3, yy = ry * Math.sqrt(Math.max(0, 1 - Math.pow(x / (r * 0.86), 2))) * 0.82;
      lat += rect(x - r * 0.07, -yy, r * 0.14, yy * 2, 3);
      const y = i * ry * 0.3, xx = r * Math.sqrt(Math.max(0, 1 - Math.pow(y / (ry * 0.86), 2))) * 0.82;
      lat += rect(-xx, y - ry * 0.07, xx * 2, ry * 0.14, 3);
    }
    out.push(sh(lat, '#e8b86a', { stroke: '#b98444', strokeWidth: 0.7 }));
  }
  out.push(hl(ellipse(-r * 0.55, -ry * 0.6, r * 0.2, ry * 0.1, -10), 0.25));
  return out;
}
/** Gravy boat on its saucer, origin bottom centre, `w` wide. */
export function gravyBoat(w: number, col = '#f6f0e2', band = '#6f8fd6'): Shape[] {
  const h = w * 0.42;
  return [
    shadow(0, 0, w * 0.55, h * 0.12, 0.2), ol(ellipse(0, -h * 0.06, w * 0.5, h * 0.18), col, 1, -0.25), stroke(ellipse(0, -h * 0.06, w * 0.42, h * 0.13), band, 1.2),
    stroke(M(w * 0.26, -h * 0.62) + Q(w * 0.6, -h * 0.8, w * 0.48, -h * 0.4) + Q(w * 0.42, -h * 0.24, w * 0.28, -h * 0.28), shade(col, -0.22), w * 0.05),
    ol(M(-w * 0.5, -h * 0.82) + Q(-w * 0.3, -h * 0.66, -w * 0.28, -h * 0.66) + Q(-w * 0.3, -h * 0.1, 0, -h * 0.12) + Q(w * 0.3, -h * 0.1, w * 0.32, -h * 0.66) + L(-w * 0.2, -h * 0.68) + Q(-w * 0.38, -h * 0.7, -w * 0.5, -h * 0.82) + 'Z', col, 1.2, -0.25),
    sh(M(-w * 0.42, -h * 0.78) + Q(-w * 0.3, -h * 0.7, -w * 0.2, -h * 0.68) + L(w * 0.3, -h * 0.66) + Q(w * 0.1, -h * 0.58, -w * 0.2, -h * 0.6) + Q(-w * 0.34, -h * 0.64, -w * 0.42, -h * 0.78) + 'Z', '#8a4a1e'),
    stroke(M(-w * 0.28, -h * 0.42) + Q(0, -h * 0.3, w * 0.3, -h * 0.44), band, w * 0.035),
    sh(rect(-w * 0.12, -h * 0.16, w * 0.24, h * 0.08, 2), shade(col, -0.12)), hl(ellipse(-w * 0.12, -h * 0.44, w * 0.05, h * 0.1, 50), 0.4),
    stroke(curve([[-w * 0.46, -h * 0.82], [-w * 0.5, -h * 0.7], [-w * 0.46, -h * 0.6]]), '#8a4a1e', w * 0.03),
  ];
}
/** Woven horn of plenty spilling fruit, origin bottom centre of the horn mouth area, `s` wide. */
export function cornucopia(s: number, seed: number): Shape[] {
  const g = rng(seed);
  const horn = M(s * 0.12, -s * 0.48) + Q(-s * 0.2, -s * 0.44, -s * 0.44, -s * 0.22) + Q(-s * 0.56, -s * 0.12, -s * 0.6, -s * 0.26) + Q(-s * 0.6, -s * 0.38, -s * 0.5, -s * 0.36) + Q(-s * 0.54, -s * 0.26, -s * 0.46, -s * 0.14) + Q(-s * 0.2, s * 0.02, s * 0.12, 0) + 'Z';
  let bands = '', weave = '';
  for (let i = 0; i < 6; i++) { const t = i / 6; const x = s * 0.1 - t * s * 0.5, hh = s * (0.25 - t * 0.17); bands += curve([[x, -s * 0.24 - hh], [x - s * 0.05, -s * 0.24], [x, -s * 0.24 + hh]]); }
  for (let i = 0; i < 4; i++) weave += curve([[s * 0.1, -s * 0.42 + i * s * 0.12], [-s * 0.2, -s * 0.36 + i * s * 0.09], [-s * 0.44, -s * 0.24 + i * s * 0.04]]);
  const out: Shape[] = [shadow(0, 0, s * 0.62, s * 0.06, 0.22), ol(horn, '#c99a5b', 1.4, -0.35), stroke(bands, '#a8743e', 2.4), stroke(weave, '#e0bc84', 1.4), ol(ellipse(s * 0.12, -s * 0.24, s * 0.1, s * 0.24), '#8a5a30', 1.2, -0.3)];
  // spilling produce
  out.push(...place2(pumpkin(s * 0.26, s * 0.18, '#f08a2a', 0), s * 0.3, -s * 0.02));
  out.push(...place2(gourd(s * 0.2, '#f2d060', '#7f9a4a'), s * 0.12, -s * 0.06, -70));
  let gr = '';
  for (let i = 0; i < 12; i++) gr += circle(s * 0.2 + (i % 3) * s * 0.035 + Math.floor(i / 3) * s * 0.015, -s * 0.36 + Math.floor(i / 3) * s * 0.04, s * 0.028);
  out.push(sh(gr, '#6a3a7a', { stroke: '#4a2050', strokeWidth: 0.8 }));
  out.push(ol(circle(s * 0.22, -s * 0.2, s * 0.07), '#c8322a', 1, -0.3), sh(circle(s * 0.2, -s * 0.22, s * 0.02), '#ffffff', { opacity: 0.4 }));
  out.push(ol(circle(s * 0.38, -s * 0.24, s * 0.065), '#b8c84a', 1, -0.3), ol(ellipse(s * 0.44, -s * 0.1, s * 0.07, s * 0.06), '#e8a03a', 1, -0.3));
  out.push(...place2(mapleLeaf(s * 0.14, '#d0602a'), s * 0.42, -s * 0.36, 20), ...place2(mapleLeaf(s * 0.12, '#e8b030'), s * 0.05, -s * 0.5, -30));
  void g;
  return out;
}
/** Tent-folded place card with a leaf and a name, origin bottom centre, `w` wide. */
export function placeCard(w: number, leafCol = '#d0602a'): Shape[] {
  const h = w * 0.5;
  return [shadow(0, 0, w * 0.55, h * 0.1, 0.2), ol(poly([[-w * 0.5, 0], [w * 0.5, 0], [w * 0.44, -h], [-w * 0.44, -h]]), '#fbf6ea', 1, -0.2), sh(poly([[-w * 0.44, -h], [w * 0.44, -h], [w * 0.42, -h * 1.08], [-w * 0.42, -h * 1.08]]), '#e8e0cc'), ...mapleLeaf(h * 0.5, leafCol).map((p) => ({ ...p, d: xf(p.d, { x: -w * 0.3, y: -h * 0.5, rot: -15 }) })), stroke(curve([[-w * 0.14, -h * 0.46], [-w * 0.08, -h * 0.6], [-w * 0.02, -h * 0.42], [w * 0.04, -h * 0.58], [w * 0.1, -h * 0.44], [w * 0.16, -h * 0.56], [w * 0.3, -h * 0.46]]), '#5a3a2a', 1.4), stroke(line([[-w * 0.18, -h * 0.26], [w * 0.34, -h * 0.26]]), '#c9a24a', 1)];
}
/** Brass candlestick with a lit taper, origin bottom centre, `h` tall. */
export function candlestick(h: number, metal = H.brass, wax = '#f6eedc'): Shape[] {
  const dk = shade(metal, -0.3);
  return [
    sh(circle(0, -h * 0.96, h * 0.14), '#ffe8a0', { opacity: 0.3 }), sh(circle(0, -h * 0.96, h * 0.07), '#fff3c0', { opacity: 0.4 }),
    shadow(0, 0, h * 0.16, h * 0.025, 0.25), ol(ellipse(0, -h * 0.02, h * 0.14, h * 0.035), metal, 1, -0.3), ol(M(-h * 0.1, -h * 0.03) + Q(-h * 0.02, -h * 0.06, -h * 0.025, -h * 0.14) + L(h * 0.025, -h * 0.14) + Q(h * 0.02, -h * 0.06, h * 0.1, -h * 0.03) + 'Z', metal, 1, -0.3),
    ol(rect(-h * 0.02, -h * 0.42, h * 0.04, h * 0.3), metal, 1, -0.3), ol(ellipse(0, -h * 0.16, h * 0.04, h * 0.02) + ellipse(0, -h * 0.28, h * 0.045, h * 0.025), metal, 1, -0.3),
    ol(M(-h * 0.07, -h * 0.46) + Q(0, -h * 0.38, h * 0.07, -h * 0.46) + L(h * 0.04, -h * 0.42) + L(-h * 0.04, -h * 0.42) + 'Z', metal, 1, -0.3), sh(rect(-h * 0.012, -h * 0.4, h * 0.01, h * 0.26), shade(metal, 0.35)),
    ol(rect(-h * 0.03, -h * 0.86, h * 0.06, h * 0.41, 2), wax, 0.8, -0.15), sh(M(h * 0.03, -h * 0.84) + Q(h * 0.04, -h * 0.76, h * 0.025, -h * 0.7) + L(h * 0.015, -h * 0.84) + 'Z', shade(wax, -0.05)),
    stroke(line([[0, -h * 0.86], [0, -h * 0.89]]), '#3b2f2a', 1), sh(M(0, -h * 1.02) + Q(h * 0.035, -h * 0.93, 0, -h * 0.885) + Q(-h * 0.035, -h * 0.93, 0, -h * 1.02) + 'Z', '#f6a83a'), sh(M(0, -h * 0.97) + Q(h * 0.017, -h * 0.92, 0, -h * 0.895) + Q(-h * 0.017, -h * 0.92, 0, -h * 0.97) + 'Z', '#fff3a6'),
    sh(rect(-h * 0.1, -h * 0.035, h * 0.03, h * 0.01), dk, { opacity: 0.4 }),
  ];
}
/** Pillar candle (no holder), origin bottom centre. */
export function pillarCandle(w: number, h: number, col = '#f2e6cc'): Shape[] {
  return [sh(circle(0, -h - w * 0.5, w * 0.9), '#ffe8a0', { opacity: 0.22 }), ol(rect(-w / 2, -h, w, h, 2), col, 1, -0.15), ol(ellipse(0, -h, w / 2, w * 0.12), shade(col, -0.06), 0.8, -0.15), stroke(line([[0, -h], [0, -h - w * 0.15]]), '#3b2f2a', 1), sh(M(0, -h - w * 0.62) + Q(w * 0.16, -h - w * 0.28, 0, -h - w * 0.12) + Q(-w * 0.16, -h - w * 0.28, 0, -h - w * 0.62) + 'Z', '#f6a83a'), sh(M(0, -h - w * 0.45) + Q(w * 0.07, -h - w * 0.26, 0, -h - w * 0.16) + Q(-w * 0.07, -h - w * 0.26, 0, -h - w * 0.45) + 'Z', '#fff3a6'), hl(rect(-w * 0.36, -h * 0.9, w * 0.1, h * 0.8, 2), 0.25)];
}
/** Glass dish of cranberry sauce on a little foot, origin bottom centre, `w` wide. */
export function cranberrySauce(w: number): Shape[] {
  const h = w * 0.5;
  let ber = '';
  for (let i = 0; i < 9; i++) ber += circle(-w * 0.28 + (i % 5) * w * 0.14 + (i > 4 ? w * 0.07 : 0), -h * 0.86 - (i > 4 ? h * 0.08 : 0), w * 0.05);
  return [
    shadow(0, 0, w * 0.4, h * 0.1, 0.2), ol(ellipse(0, -h * 0.04, w * 0.26, h * 0.08), '#dfe8ee', 1, -0.25), ol(rect(-w * 0.06, -h * 0.4, w * 0.12, h * 0.36), '#dfe8ee', 1, -0.25),
    sh(M(-w * 0.5, -h * 0.86) + Q(-w * 0.44, -h * 0.34, 0, -h * 0.34) + Q(w * 0.44, -h * 0.34, w * 0.5, -h * 0.86) + 'Z', '#a8182a'),
    sh(M(-w * 0.5, -h * 0.86) + Q(-w * 0.44, -h * 0.34, 0, -h * 0.34) + Q(w * 0.44, -h * 0.34, w * 0.5, -h * 0.86) + 'Z', '#e8f0f4', { opacity: 0.35, stroke: '#9ab0bc', strokeWidth: 1 }),
    stroke(M(-w * 0.4, -h * 0.66) + Q(0, -h * 0.5, w * 0.4, -h * 0.66) + M(-w * 0.32, -h * 0.5) + Q(0, -h * 0.38, w * 0.32, -h * 0.5), '#ffffff', 1.2, { opacity: 0.6 }),
    ol(ellipse(0, -h * 0.86, w * 0.5, h * 0.16), '#c8202e', 1, -0.35), sh(ber, '#e0303e', { stroke: '#8e1020', strokeWidth: 0.7 }), hl(ellipse(-w * 0.2, -h * 0.9, w * 0.12, h * 0.04), 0.4),
    stroke(M(w * 0.2, -h * 0.9) + L(w * 0.5, -h * 1.3), '#c9d0d5', w * 0.04), ol(ellipse(w * 0.52, -h * 1.33, w * 0.05, w * 0.035, -50), '#c9d0d5', 0.8),
  ];
}
/** Basket of dinner rolls on a napkin, origin bottom centre, `w` wide. */
export function breadBasket(w: number, seed: number): Shape[] {
  const g = rng(seed);
  const h = w * 0.34;
  const out: Shape[] = [shadow(0, 0, w * 0.55, h * 0.16, 0.22)];
  out.push(sh(poly([[-w * 0.56, -h * 0.9], [-w * 0.3, -h * 1.2], [w * 0.36, -h * 1.18], [w * 0.6, -h * 0.84], [w * 0.2, -h * 0.7]]), '#c8352e'), stroke(line([[-w * 0.5, -h * 0.94], [w * 0.5, -h * 0.9]]) + line([[-w * 0.36, -h * 1.12], [w * 0.4, -h * 1.1]]), '#f6eedc', 2));
  for (let i = 0; i < 7; i++) {
    const x = -w * 0.34 + i * w * 0.11 + g.range(-3, 3), y = -h * (i % 2 ? 1.12 : 0.98);
    out.push(ol(ellipse(x, y, w * 0.11, h * 0.22, g.range(-15, 15)), '#d49448', 1, -0.3), sh(ellipse(x - w * 0.02, y - h * 0.06, w * 0.06, h * 0.08, -20), '#e8b46a'), stroke(curve([[x - w * 0.05, y - h * 0.02], [x, y - h * 0.1], [x + w * 0.05, y - h * 0.02]]), '#a8642a', 1));
  }
  const body = M(-w * 0.5, -h) + L(w * 0.5, -h) + L(w * 0.42, 0) + L(-w * 0.42, 0) + 'Z';
  let wv = '';
  for (let i = 1; i < 4; i++) wv += line([[-w * 0.5 + i * w * 0.02, -h + (i * h) / 4], [w * 0.5 - i * w * 0.02, -h + (i * h) / 4]]);
  for (let i = 1; i < 10; i++) wv += line([[-w * 0.5 + i * w * 0.1, -h], [-w * 0.42 + i * w * 0.084, 0]]);
  out.push(ol(body, '#c99a5b', 1.2, -0.35), stroke(wv, '#a8743e', 1.2), ol(rect(-w * 0.52, -h * 1.06, w * 1.04, h * 0.14, 4), '#b98552', 1, -0.3));
  return out;
}
/** Wooden pepper mill, origin bottom centre, `h` tall. */
export function pepperMill(h: number, col = '#7a4a2a'): Shape[] {
  return [shadow(0, 0, h * 0.18, h * 0.03, 0.25), ol(M(-h * 0.12, 0) + Q(-h * 0.16, -h * 0.2, -h * 0.08, -h * 0.4) + Q(-h * 0.06, -h * 0.5, -h * 0.12, -h * 0.66) + L(h * 0.12, -h * 0.66) + Q(h * 0.06, -h * 0.5, h * 0.08, -h * 0.4) + Q(h * 0.16, -h * 0.2, h * 0.12, 0) + 'Z', col, 1.2, -0.35), sh(rect(-h * 0.14, -h * 0.1, h * 0.28, h * 0.04), shade(col, -0.25)), ol(M(-h * 0.13, -h * 0.66) + Q(-h * 0.13, -h * 0.84, 0, -h * 0.86) + Q(h * 0.13, -h * 0.84, h * 0.13, -h * 0.66) + 'Z', shade(col, 0.1), 1.2, -0.35), ol(circle(0, -h * 0.92, h * 0.05), '#c9d0d5', 1, -0.35), hl(rect(-h * 0.06, -h * 0.6, h * 0.025, h * 0.46, 2), 0.25), sh(rect(-h * 0.13, -h * 0.68, h * 0.26, h * 0.03), shade(col, -0.3))];
}
/** Glass pitcher of apple cider, origin bottom centre, `h` tall. */
export function ciderPitcher(h: number): Shape[] {
  const w = h * 0.66;
  const glass = M(-w * 0.36, -h) + L(w * 0.3, -h) + Q(w * 0.36, -h * 0.6, w * 0.4, -h * 0.3) + Q(w * 0.42, 0, w * 0.3, 0) + L(-w * 0.3, 0) + Q(-w * 0.42, 0, -w * 0.4, -h * 0.3) + Q(-w * 0.36, -h * 0.6, -w * 0.36, -h) + 'Z';
  const juice = M(-w * 0.38, -h * 0.66) + L(w * 0.35, -h * 0.66) + Q(w * 0.4, -h * 0.3, w * 0.38, -h * 0.14) + Q(w * 0.36, -h * 0.03, w * 0.28, -h * 0.03) + L(-w * 0.28, -h * 0.03) + Q(-w * 0.36, -h * 0.03, -w * 0.38, -h * 0.14) + Q(-w * 0.4, -h * 0.3, -w * 0.38, -h * 0.66) + 'Z';
  return [shadow(0, 0, w * 0.5, h * 0.05, 0.22), stroke(M(w * 0.3, -h * 0.86) + Q(w * 0.74, -h * 0.84, w * 0.62, -h * 0.4) + Q(w * 0.56, -h * 0.24, w * 0.38, -h * 0.22), '#c9dce4', h * 0.06), sh(glass, '#e8f2f6', { opacity: 0.5 }), sh(juice, '#d88a2a'), sh(ellipse(0, -h * 0.66, w * 0.37, h * 0.04), '#f0b050'), sh(poly([[-w * 0.36, -h], [-w * 0.52, -h * 1.06], [-w * 0.3, -h * 0.9]]), '#dcebf0', { opacity: 0.8 }), stroke(glass, '#9ab8c4', 1.4), hl(rect(-w * 0.26, -h * 0.9, w * 0.07, h * 0.78, 3), 0.45), sh(ellipse(w * 0.05, -h * 0.4, w * 0.08, w * 0.05) + ellipse(-w * 0.1, -h * 0.22, w * 0.07, w * 0.045), '#f0c070', { opacity: 0.8 })];
}
/** Stemmed glass with a drink, origin bottom centre, `h` tall. */
export function wineGlass(h: number, drink = '#9a2030'): Shape[] {
  const w = h * 0.4;
  return [ol(ellipse(0, -h * 0.02, w * 0.4, h * 0.035), '#e4eef2', 0.8, -0.3), sh(rect(-w * 0.04, -h * 0.5, w * 0.08, h * 0.48), '#dfeaee'), sh(M(-w * 0.46, -h * 0.72) + Q(-w * 0.46, -h * 0.5, 0, -h * 0.48) + Q(w * 0.46, -h * 0.5, w * 0.46, -h * 0.72) + 'Z', drink), sh(M(-w * 0.5, -h) + Q(-w * 0.56, -h * 0.5, 0, -h * 0.48) + Q(w * 0.56, -h * 0.5, w * 0.5, -h) + 'Z', '#eaf4f8', { opacity: 0.35, stroke: '#9ab8c4', strokeWidth: 1 }), sh(ellipse(0, -h * 0.72, w * 0.46, h * 0.03), shade(drink, 0.2)), hl(ellipse(-w * 0.28, -h * 0.8, w * 0.06, h * 0.12, 10), 0.6)];
}
/** Sitting squirrel holding an acorn, facing left, origin at its feet, `s` tall. */
export function squirrel(s: number, col = '#b8622e'): Shape[] {
  const lt = '#f2d8b0', dk = shade(col, -0.25);
  return [
    ol(M(s * 0.1, -s * 0.04) + Q(s * 0.62, -s * 0.06, s * 0.56, -s * 0.5) + Q(s * 0.52, -s * 0.94, s * 0.22, -s * 1.0) + Q(s * 0.04, -s * 0.98, s * 0.1, -s * 0.84) + Q(s * 0.34, -s * 0.84, s * 0.34, -s * 0.5) + Q(s * 0.32, -s * 0.22, s * 0.06, -s * 0.2) + 'Z', col, 1.2),
    stroke(curve([[s * 0.2, -s * 0.12], [s * 0.46, -s * 0.36], [s * 0.42, -s * 0.76], [s * 0.2, -s * 0.92]]), dk, 1.4, { opacity: 0.7 }),
    ol(blob([[-s * 0.16, 0], [-s * 0.2, -s * 0.28], [-s * 0.1, -s * 0.52], [s * 0.06, -s * 0.5], [s * 0.18, -s * 0.24], [s * 0.14, 0]], 0.9), col, 1.2),
    sh(blob([[-s * 0.12, -s * 0.06], [-s * 0.14, -s * 0.28], [-s * 0.06, -s * 0.44], [s * 0.02, -s * 0.3], [0, -s * 0.06]], 0.9), lt),
    ol(ellipse(-s * 0.1, -s * 0.6, s * 0.16, s * 0.13, -10), col, 1.2), ol(poly([[-s * 0.02, -s * 0.68], [0, -s * 0.84], [s * 0.06, -s * 0.66]]), col, 1),
    sh(ellipse(-s * 0.17, -s * 0.55, s * 0.08, s * 0.06), lt), sh(circle(-s * 0.12, -s * 0.63, s * 0.03), '#1c1626'), sh(circle(-s * 0.115, -s * 0.64, s * 0.01), '#ffffff'), sh(circle(-s * 0.25, -s * 0.58, s * 0.022), '#3b2a1c'),
    ol(ellipse(-s * 0.16, -s * 0.36, s * 0.07, s * 0.08), '#8a5a2a', 1), ol(M(-s * 0.23, -s * 0.4) + Q(-s * 0.16, -s * 0.5, -s * 0.09, -s * 0.4) + 'Z', '#5a3a1a', 0.8),
    sh(ellipse(-s * 0.12, -s * 0.32, s * 0.05, s * 0.035) + ellipse(-s * 0.04, -s * 0.03, s * 0.08, s * 0.035), col),
  ];
}
/** Vase of sunflowers, origin bottom centre, `h` tall. */
export function sunflowerVase(h: number, seed: number, vase = '#6f8fd6'): Shape[] {
  const g = rng(seed);
  const out: Shape[] = [shadow(0, 0, h * 0.18, h * 0.03, 0.22)];
  const heads: [number, number, number][] = [[-h * 0.2, -h * 0.82, h * 0.13], [h * 0.16, -h * 0.9, h * 0.14], [h * 0.02, -h * 1.0, h * 0.12], [-h * 0.06, -h * 0.66, h * 0.1], [h * 0.26, -h * 0.64, h * 0.1]];
  let st = '';
  for (const [x, y] of heads) st += curve([[0, -h * 0.3], [x * 0.5, (y - h * 0.3) / 2], [x, y]]);
  out.push(stroke(st, '#5f8a45', h * 0.02));
  let lv = '';
  for (let i = 0; i < 6; i++) lv += leaf(g.range(-h * 0.08, h * 0.08), -h * g.range(0.36, 0.6), h * 0.16, h * 0.05, i % 2 ? -150 - g.range(0, 30) : -30 + g.range(0, 30));
  out.push(sh(lv, '#6f9a52', { stroke: '#4f7a3f', strokeWidth: 0.8 }));
  for (const [x, y, r] of heads) {
    let p1 = '', p2 = '';
    for (let i = 0; i < 14; i++) { const d = petal(x, y, r, r * 0.26, i * (360 / 14)); if (i % 2) p1 += d; else p2 += d; }
    out.push(sh(p1, '#f2b81e', { stroke: '#c88a10', strokeWidth: 0.6 }), sh(p2, '#f8cc3a', { stroke: '#c88a10', strokeWidth: 0.6 }), ol(circle(x, y, r * 0.42), '#6a3a1a', 1), sh(circle(x - r * 0.1, y - r * 0.1, r * 0.2), '#8a5a2a'));
  }
  out.push(ol(M(-h * 0.12, -h * 0.4) + L(h * 0.12, -h * 0.4) + Q(h * 0.1, -h * 0.3, h * 0.15, -h * 0.18) + Q(h * 0.2, 0, h * 0.1, 0) + L(-h * 0.1, 0) + Q(-h * 0.2, 0, -h * 0.15, -h * 0.18) + Q(-h * 0.1, -h * 0.3, -h * 0.12, -h * 0.4) + 'Z', vase, 1.2), sh(rect(-h * 0.16, -h * 0.2, h * 0.32, h * 0.04), '#f6eedc', { opacity: 0.8 }), hl(ellipse(-h * 0.08, -h * 0.16, h * 0.02, h * 0.08), 0.35));
  return out;
}
/** Dinner plate seen at an angle, centred on the origin. */
export function platePersp(rx: number, ry: number, base = '#fbf6ea', rim = '#c9a24a'): Shape[] {
  return [shadow(0, ry * 0.25, rx * 1.02, ry * 0.9, 0.18), ol(ellipse(0, 0, rx, ry), base, 1, -0.2), stroke(ellipse(0, 0, rx * 0.88, ry * 0.88), rim, 1.2), sh(ellipse(0, ry * 0.04, rx * 0.64, ry * 0.6), shade(base, -0.04))];
}
/** Folded napkin with a ring, centred on the origin, sitting on a plate. */
export function napkin(w: number, col: string, ring = H.brass): Shape[] {
  return [ol(poly([[-w * 0.5, w * 0.05], [0, -w * 0.32], [w * 0.5, w * 0.05], [0, w * 0.2]]), col, 1, -0.3), sh(poly([[0, -w * 0.32], [w * 0.5, w * 0.05], [0, w * 0.2]]), shade(col, -0.1)), ol(rect(-w * 0.06, -w * 0.12, w * 0.12, w * 0.26, 3), ring, 1, -0.35)];
}
/** Covered serving dish (casserole) with contents, origin bottom centre. kind: 0 mash, 1 sweet potato, 2 green beans, 3 stuffing. */
export function servingDish(w: number, kind: number, seed: number, col = '#f6f0e2'): Shape[] {
  const g = rng(seed);
  const h = w * 0.34;
  const out: Shape[] = [shadow(0, 0, w * 0.55, h * 0.18, 0.2), ol(M(-w * 0.5, -h * 0.7) + L(-w * 0.44, -h * 0.06) + Q(0, h * 0.06, w * 0.44, -h * 0.06) + L(w * 0.5, -h * 0.7) + 'Z', col, 1, -0.25)];
  out.push(ol(rect(-w * 0.62, -h * 0.66, w * 0.14, h * 0.12, 4) + rect(w * 0.48, -h * 0.66, w * 0.14, h * 0.12, 4), col, 1, -0.25));
  const top = ellipse(0, -h * 0.7, w * 0.5, h * 0.34);
  out.push(ol(top, shade(col, -0.06), 1, -0.25));
  const fill = ['#f6ecd0', '#e88a3a', '#5f8a3a', '#b88a4a'][kind];
  out.push(sh(ellipse(0, -h * 0.72, w * 0.44, h * 0.28), fill));
  let d1 = '', d2 = '';
  if (kind === 0) { for (let i = 0; i < 6; i++) d1 += curve([[-w * 0.3 + i * w * 0.1, -h * 0.6], [-w * 0.26 + i * w * 0.1, -h * 0.86], [-w * 0.22 + i * w * 0.1, -h * 0.66]]); out.push(stroke(d1, '#e0d2b0', 1.6), ol(rect(-w * 0.08, -h * 0.84, w * 0.16, h * 0.12, 2), '#f6d860', 0.8)); }
  else if (kind === 1) { for (let i = 0; i < 12; i++) d1 += ellipse(g.range(-w * 0.34, w * 0.34), -h * 0.72 + g.range(-h * 0.18, h * 0.16), w * 0.05, h * 0.07); out.push(sh(d1, '#fbf3e4', { stroke: '#c8904a', strokeWidth: 1.2 })); }
  else if (kind === 2) { for (let i = 0; i < 22; i++) { const d = xf(rect(-w * 0.1, -w * 0.012, w * 0.2, w * 0.024, w * 0.012), { rot: g.range(-40, 40), x: g.range(-w * 0.3, w * 0.3), y: -h * 0.72 + g.range(-h * 0.16, h * 0.14) }); if (i % 2) d1 += d; else d2 += d; } out.push(sh(d1, '#7aa84a'), sh(d2, '#4f7a2f'), sh(circle(-w * 0.1, -h * 0.74, w * 0.03) + circle(w * 0.14, -h * 0.66, w * 0.025), '#e8c070')); }
  else { for (let i = 0; i < 18; i++) { const d = rect(g.range(-w * 0.34, w * 0.3), -h * 0.72 + g.range(-h * 0.18, h * 0.12), w * 0.06, w * 0.05, 2); if (i % 2) d1 += d; else d2 += d; } out.push(sh(d1, '#d8a868'), sh(d2, '#8a5a2a'), sh(circle(0, -h * 0.7, w * 0.02) + circle(-w * 0.2, -h * 0.76, w * 0.02), '#5f8a45')); }
  out.push(stroke(M(-w * 0.42, -h * 0.4) + Q(0, -h * 0.24, w * 0.42, -h * 0.4), '#6f8fd6', 1.6));
  return out;
}
/** Dining chair back seen from behind the table, origin at seat level centre. */
export function chairBack(w: number, h: number, col: string): Shape[] {
  let sl = '';
  for (let i = 0; i < 3; i++) { const x = -w * 0.2 + i * w * 0.2; sl += rect(x - w * 0.05, -h * 0.8, w * 0.1, h * 0.6, 3); }
  return [ol(rect(-w / 2, -h, w * 0.1, h + 30, 4) + rect(w * 0.4, -h, w * 0.1, h + 30, 4), col, 1, -0.3), ol(M(-w / 2, -h * 0.84) + Q(0, -h * 1.06, w / 2, -h * 0.84) + L(w / 2, -h * 0.74) + Q(0, -h * 0.94, -w / 2, -h * 0.74) + 'Z', shade(col, 0.08), 1, -0.3), ol(sl, col, 1, -0.3), ol(rect(-w / 2, -h * 0.24, w, h * 0.08, 3), shade(col, 0.05), 1, -0.3), sh(rect(-w * 0.48, -h * 0.98, w * 0.03, h * 0.9), shade(col, 0.25), { opacity: 0.5 })];
}
/** Picture frame with a little landscape, origin top-left. */
export function framedPicture(w: number, h: number, frame: string, seed: number, sky = '#cfe0e8', land = ['#a9c48a', '#7f9a5c']): Shape[] {
  const g = rng(seed);
  const b = Math.min(w, h) * 0.1;
  const out: Shape[] = [sh(rect(4, 6, w, h, 2), '#3b2a1c', { opacity: 0.18 }), ol(rect(0, 0, w, h, 2), frame, 1, -0.3), sh(rect(b * 0.4, b * 0.4, w - b * 0.8, h - b * 0.8), shade(frame, 0.2)), sh(rect(b, b, w - 2 * b, h - 2 * b), sky)];
  out.push(sh(blob([[b, h * 0.62], [w * 0.4, h * 0.5 + g.range(-6, 6)], [w - b, h * 0.6], [w - b, h - b], [b, h - b]], 0.4), land[0]), sh(blob([[b, h * 0.75], [w * 0.6, h * 0.66], [w - b, h * 0.74], [w - b, h - b], [b, h - b]], 0.4), land[1]));
  out.push(sh(circle(w * 0.7, h * 0.3, Math.min(w, h) * 0.08), '#f6e0a0'));
  return out;
}

// =====================================================================
// Christmas
// =====================================================================
/** Glass bauble hanging from its cap, origin at the cap. */
export function bauble(r: number, col: string, pat = 0): Shape[] {
  const out: Shape[] = [ol(circle(0, r * 1.1, r), col, 1, -0.35)];
  if (pat === 1) out.push(stroke(M(-r * 0.96, r * 1.0) + Q(0, r * 1.3, r * 0.96, r * 1.0), '#f6eedc', r * 0.14), stroke(M(-r * 0.9, r * 1.36) + Q(0, r * 1.66, r * 0.9, r * 1.36), '#f6eedc', r * 0.1));
  else if (pat === 2) { let d = ''; for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; d += circle(Math.cos(a) * r * 0.55, r * 1.1 + Math.sin(a) * r * 0.55, r * 0.1); } out.push(sh(d, '#f6eedc')); }
  else if (pat === 3) out.push(sh(star(0, r * 1.1, r * 0.5, r * 0.22), H.gold));
  out.push(hl(ellipse(-r * 0.35, r * 0.75, r * 0.22, r * 0.14, -30), 0.6), ol(rect(-r * 0.28, -r * 0.02, r * 0.56, r * 0.22, 1), H.gold, 0.8, -0.35));
  return out;
}
/** Candy cane (hook at the top), origin bottom of the stick, `s` tall. */
export function candyCane(s: number): Shape[] {
  const w = s * 0.1;
  const pts: Pt[] = [];
  for (let i = 0; i <= 10; i++) pts.push([0, -i * s * 0.07]);
  for (let i = 1; i <= 12; i++) { const a = Math.PI - (i / 12) * Math.PI; pts.push([s * 0.15 + Math.cos(a) * s * 0.15, -s * 0.7 - Math.sin(a) * s * 0.15]); }
  pts.push([s * 0.3, -s * 0.62]);
  let red = '';
  for (let i = 0; i < pts.length - 1; i += 2) red += line([pts[i], pts[i + 1]]);
  return [stroke(line(pts), '#c8b8b0', w + 2), stroke(line(pts), '#fbf6f2', w), stroke(red, '#d8283a', w * 0.9), stroke(line(pts.map(([x, y]) => [x - w * 0.22, y] as Pt)), '#ffffff', w * 0.18, { opacity: 0.6 })];
}
/** Wrapped present with ribbon and bow, origin bottom centre. */
export function present(w: number, h: number, col: string, ribbon: string, pat = 0): Shape[] {
  const lid = h * 0.18;
  const out: Shape[] = [shadow(0, 0, w * 0.56, h * 0.05, 0.22), ol(rect(-w / 2, -h, w, h), col, 1.2, -0.3)];
  if (pat === 1) { let d = ''; for (let y = -h + lid + 8; y < -4; y += 14) for (let x = -w / 2 + 8; x < w / 2 - 4; x += 16) d += circle(x + ((y / 14) % 2 ? 8 : 0) * 0, y, 2.4); out.push(sh(d, shade(col, 0.45), { opacity: 0.85 })); }
  else if (pat === 2) { let d = ''; for (let x = -w / 2 + 6; x < w / 2; x += 14) d += line([[x, -h + lid], [x + 10, -2]]); out.push(stroke(d, shade(col, 0.35), 3, { opacity: 0.8 })); }
  else if (pat === 3) { let d = ''; for (let y = -h + lid + 10; y < -6; y += 18) for (let x = -w / 2 + 10; x < w / 2 - 6; x += 18) d += star(x, y, 4.5, 2); out.push(sh(d, '#f6eedc', { opacity: 0.9 })); }
  out.push(ol(rect(-w / 2 - 3, -h - 2, w + 6, lid, 2), shade(col, 0.06), 1.2, -0.3), sh(rect(-w * 0.06, -h - 2, w * 0.12, h + 2), ribbon));
  const bw = Math.min(w, h) * 0.34;
  out.push(ol(M(0, -h - 2) + Q(-bw * 1.1, -h - bw * 0.9, -bw * 0.9, -h - 2) + Q(-bw * 0.5, -h + bw * 0.3, 0, -h - 2) + 'Z' + M(0, -h - 2) + Q(bw * 1.1, -h - bw * 0.9, bw * 0.9, -h - 2) + Q(bw * 0.5, -h + bw * 0.3, 0, -h - 2) + 'Z', ribbon, 1, -0.3), ol(circle(0, -h - 3, bw * 0.18), shade(ribbon, -0.1), 1, -0.3));
  return out;
}
/** Christmas stocking hanging from its loop, origin at the loop. */
export function stocking(s: number, col: string, cuff = '#fbf6ee', pat = 0): Shape[] {
  const body = M(-s * 0.18, s * 0.1) + L(s * 0.14, s * 0.1) + L(s * 0.14, s * 0.62) + Q(s * 0.14, s * 0.8, s * 0.0, s * 0.84) + L(-s * 0.3, s * 0.86) + Q(-s * 0.46, s * 0.86, -s * 0.44, s * 0.72) + Q(-s * 0.42, s * 0.62, -s * 0.18, s * 0.58) + 'Z';
  const out: Shape[] = [stroke(M(-s * 0.02, s * 0.12) + Q(0, -s * 0.04, s * 0.06, s * 0.12), '#8a5a34', 1.6), ol(body, col, 1.2, -0.3)];
  if (pat === 1) { let d = ''; for (let i = 0; i < 4; i++) d += rect(-s * 0.18, s * 0.26 + i * s * 0.1, s * 0.32, s * 0.04); out.push(sh(d, '#f6eedc', { opacity: 0.85 })); }
  else if (pat === 2) out.push(sh(star(-s * 0.02, s * 0.4, s * 0.08, s * 0.035) + star(-s * 0.22, s * 0.7, s * 0.06, s * 0.026), H.gold));
  else if (pat === 3) { let d = ''; for (let i = 0; i < 8; i++) d += circle(-s * 0.12 + (i % 3) * s * 0.11, s * 0.3 + Math.floor(i / 3) * s * 0.14, s * 0.025); out.push(sh(d, '#f6eedc')); }
  out.push(sh(M(-s * 0.18, s * 0.6) + Q(-s * 0.38, s * 0.62, -s * 0.42, s * 0.74) + Q(-s * 0.44, s * 0.86, -s * 0.3, s * 0.86) + L(-s * 0.22, s * 0.86) + Q(-s * 0.3, s * 0.72, -s * 0.18, s * 0.6) + 'Z', cuff, { opacity: 0.9 }), sh(M(s * 0.14, s * 0.62) + Q(s * 0.14, s * 0.8, 0, s * 0.84) + L(-s * 0.04, s * 0.84) + Q(s * 0.06, s * 0.74, s * 0.04, s * 0.6) + 'Z', cuff, { opacity: 0.9 }));
  out.push(ol(rect(-s * 0.22, s * 0.04, s * 0.4, s * 0.16, 4), cuff, 1, -0.2));
  return out;
}
/** Toy steam engine facing right, origin bottom centre of the wheels, `w` long. */
export function trainEngine(w: number, col = '#c8352e', trim = '#2c3a4a'): Shape[] {
  const h = w * 0.72;
  const out: Shape[] = [shadow(0, 0, w * 0.52, h * 0.05, 0.25)];
  out.push(ol(rect(-w * 0.48, -h * 0.82, w * 0.36, h * 0.6, 3), col, 1.2, -0.35), ol(rect(-w * 0.52, -h * 0.9, w * 0.44, h * 0.1, 3), trim, 1, 0.2));
  out.push(sh(rect(-w * 0.42, -h * 0.72, w * 0.24, h * 0.22, 2), '#fff1b0'), stroke(line([[-w * 0.3, -h * 0.72], [-w * 0.3, -h * 0.5]]), trim, 1.4));
  out.push(ol(rect(-w * 0.12, -h * 0.58, w * 0.52, h * 0.34, h * 0.17), col, 1.2, -0.35), stroke(line([[w * 0.05, -h * 0.58], [w * 0.05, -h * 0.24]]) + line([[w * 0.22, -h * 0.58], [w * 0.22, -h * 0.24]]), H.gold, 2));
  out.push(ol(M(w * 0.22, -h * 0.58) + L(w * 0.18, -h * 0.86) + L(w * 0.34, -h * 0.86) + L(w * 0.3, -h * 0.58) + 'Z', trim, 1, 0.2), ol(rect(w * 0.15, -h * 0.92, w * 0.22, h * 0.07, 2), trim, 1, 0.2));
  out.push(ol(circle(w * 0.0, -h * 0.66, h * 0.06), H.gold, 1, -0.35), ol(circle(w * 0.4, -h * 0.42, h * 0.05), '#f6e0a0', 1, -0.35));
  out.push(sh(poly([[w * 0.4, -h * 0.24], [w * 0.52, -h * 0.04], [w * 0.4, -h * 0.04]]), trim), sh(rect(-w * 0.5, -h * 0.26, w * 0.92, h * 0.08), trim));
  for (const [x, r] of [[-w * 0.36, h * 0.16], [-w * 0.08, h * 0.13], [w * 0.2, h * 0.13]] as Pt[]) out.push(ol(circle(x, -r, r), trim, 1, 0.2), sh(circle(x, -r, r * 0.55), H.gold), sh(circle(x, -r, r * 0.2), trim));
  out.push(stroke(line([[-w * 0.36, -h * 0.16], [w * 0.2, -h * 0.13]]), '#c9d0d5', 2.2));
  out.push(sh(circle(w * 0.3, -h * 1.02, h * 0.07) + circle(w * 0.2, -h * 1.1, h * 0.09) + circle(w * 0.06, -h * 1.16, h * 0.11), '#ffffff', { opacity: 0.85 }));
  return out;
}
/** Toy train wagon, origin bottom centre. */
export function trainCar(w: number, col: string, load: string, trim = '#2c3a4a'): Shape[] {
  const h = w * 0.55;
  return [shadow(0, 0, w * 0.5, h * 0.06, 0.25), ol(rect(-w * 0.46, -h * 0.86, w * 0.92, h * 0.12, 6), load, 1, -0.3), ol(rect(-w * 0.48, -h * 0.76, w * 0.96, h * 0.5, 3), col, 1.2, -0.35), stroke(rect(-w * 0.38, -h * 0.68, w * 0.76, h * 0.34, 2), shade(col, 0.3), 1.6), sh(rect(-w * 0.5, -h * 0.3, w, h * 0.08), trim), ol(circle(-w * 0.28, -h * 0.16, h * 0.16) + circle(w * 0.28, -h * 0.16, h * 0.16), trim, 1, 0.2), sh(circle(-w * 0.28, -h * 0.16, h * 0.07) + circle(w * 0.28, -h * 0.16, h * 0.07), H.gold), sh(rect(-w * 0.56, -h * 0.26, w * 0.08, h * 0.04), trim)];
}
/** Mug of cocoa with whipped cream and marshmallows, origin bottom centre, `s` tall. */
export function cocoaMug(s: number, col = '#c8352e'): Shape[] {
  const w = s * 0.84;
  return [
    shadow(0, 0, w * 0.6, s * 0.06, 0.22),
    stroke(M(w * 0.38, -s * 0.66) + Q(w * 0.8, -s * 0.62, w * 0.66, -s * 0.34) + Q(w * 0.58, -s * 0.18, w * 0.38, -s * 0.22), shade(col, -0.25), s * 0.1),
    ol(M(-w * 0.44, -s * 0.78) + L(w * 0.44, -s * 0.78) + L(w * 0.38, -s * 0.06) + Q(w * 0.36, 0, w * 0.28, 0) + L(-w * 0.28, 0) + Q(-w * 0.36, 0, -w * 0.38, -s * 0.06) + 'Z', col, 1.2, -0.3),
    sh(rect(-w * 0.42, -s * 0.5, w * 0.84, s * 0.08), '#f6eedc'), sh(star(0, -s * 0.33, s * 0.08, s * 0.035, 5), '#f6eedc'),
    ol(ellipse(0, -s * 0.78, w * 0.44, s * 0.09), '#6a3a1e', 1, -0.3),
    ol(blob([[-w * 0.36, -s * 0.8], [-w * 0.3, -s * 0.98], [-w * 0.06, -s * 1.08], [w * 0.1, -s * 1.16], [w * 0.28, -s * 1.0], [w * 0.36, -s * 0.8]], 0.9), '#fbf8f2', 1, -0.15),
    ol(rect(-w * 0.3, -s * 0.94, w * 0.16, s * 0.12, 2) + rect(w * 0.12, -s * 0.9, w * 0.16, s * 0.12, 2), '#f6d8e0', 0.8, -0.2), sh(circle(w * 0.04, -s * 1.12, s * 0.03) + circle(-w * 0.1, -s * 1.04, s * 0.025), '#8a4a2a'),
    stroke(curve([[-w * 0.1, -s * 1.24], [-w * 0.2, -s * 1.36], [-w * 0.06, -s * 1.48]]) + curve([[w * 0.14, -s * 1.26], [w * 0.04, -s * 1.38], [w * 0.18, -s * 1.5]]), '#ffffff', 2, { opacity: 0.55 }),
    hl(rect(-w * 0.32, -s * 0.72, w * 0.07, s * 0.6, 2), 0.25),
  ];
}
/** Teddy bear sitting, origin at its bottom centre, `s` tall. */
export function teddy(s: number, col = '#b8844a', bow = '#c8352e'): Shape[] {
  const lt = shade(col, 0.35), dk = shade(col, -0.3);
  return [
    shadow(0, 0, s * 0.4, s * 0.05, 0.25),
    ol(circle(-s * 0.26, -s * 0.36, s * 0.1) + circle(s * 0.26, -s * 0.36, s * 0.1), col, 1, -0.3),
    ol(ellipse(0, -s * 0.3, s * 0.26, s * 0.28), col, 1.2, -0.3), sh(ellipse(0, -s * 0.26, s * 0.15, s * 0.17), lt),
    ol(ellipse(-s * 0.2, -s * 0.07, s * 0.12, s * 0.09) + ellipse(s * 0.2, -s * 0.07, s * 0.12, s * 0.09), col, 1, -0.3), sh(ellipse(-s * 0.22, -s * 0.07, s * 0.07, s * 0.055) + ellipse(s * 0.22, -s * 0.07, s * 0.07, s * 0.055), lt),
    ol(circle(-s * 0.19, -s * 0.9, s * 0.09) + circle(s * 0.19, -s * 0.9, s * 0.09), col, 1, -0.3), sh(circle(-s * 0.19, -s * 0.9, s * 0.045) + circle(s * 0.19, -s * 0.9, s * 0.045), lt),
    ol(circle(0, -s * 0.72, s * 0.22), col, 1.2, -0.3), sh(ellipse(0, -s * 0.65, s * 0.1, s * 0.08), lt),
    sh(circle(-s * 0.08, -s * 0.76, s * 0.025) + circle(s * 0.08, -s * 0.76, s * 0.025), '#2a1e18'), sh(ellipse(0, -s * 0.68, s * 0.04, s * 0.028), dk), stroke(curve([[-s * 0.04, -s * 0.62], [0, -s * 0.6], [s * 0.04, -s * 0.62]]), dk, 1),
    ol(M(0, -s * 0.52) + L(-s * 0.13, -s * 0.58) + L(-s * 0.13, -s * 0.46) + 'Z' + M(0, -s * 0.52) + L(s * 0.13, -s * 0.58) + L(s * 0.13, -s * 0.46) + 'Z', bow, 1, -0.3), ol(circle(0, -s * 0.52, s * 0.035), bow, 1, -0.3),
  ];
}
/** Snow globe with a tiny house and tree, origin bottom centre, `s` tall. */
export function snowGlobe(s: number, base = '#7a4a2a'): Shape[] {
  const r = s * 0.38, cy = -s * 0.56;
  let flakes = '';
  const g = rng(5);
  for (let i = 0; i < 12; i++) { const a = g.range(0, Math.PI * 2), rr = Math.sqrt(g.next()) * r * 0.8; flakes += circle(Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.8 - r * 0.1, s * 0.012); }
  return [
    shadow(0, 0, s * 0.36, s * 0.05, 0.22),
    sh(circle(0, cy, r), '#cfe6f2'), sh(ellipse(0, cy + r * 0.62, r * 0.82, r * 0.24), '#ffffff'),
    sh(poly([[-r * 0.38, cy + r * 0.5], [-r * 0.24, cy + r * 0.1], [-r * 0.1, cy + r * 0.5]]) + poly([[-r * 0.36, cy + r * 0.28], [-r * 0.24, cy - r * 0.1], [-r * 0.12, cy + r * 0.28]]), '#3f7a4a'),
    sh(rect(r * 0.0, cy + r * 0.2, r * 0.38, r * 0.34), '#c8352e'), sh(poly([[-r * 0.06, cy + r * 0.22], [r * 0.19, cy - r * 0.06], [r * 0.44, cy + r * 0.22]]), '#fbf6ee'), sh(rect(r * 0.14, cy + r * 0.32, r * 0.1, r * 0.1), '#ffd25a'),
    sh(flakes, '#ffffff'), stroke(circle(0, cy, r), '#a8c8d8', 1.4), hl(ellipse(-r * 0.45, cy - r * 0.45, r * 0.18, r * 0.32, 35), 0.55),
    ol(M(-r * 0.86, cy + r * 0.82) + L(r * 0.86, cy + r * 0.82) + L(r * 1.0, 0) + L(-r * 1.0, 0) + 'Z', base, 1.2, -0.35), sh(rect(-r * 0.6, -s * 0.12, r * 1.2, s * 0.03), H.gold),
  ];
}
/** Little wooden rocking horse, origin bottom centre, `w` long. */
export function rockingHorse(w: number, col = '#e8d4b0', mane = '#8a4a2a', saddle = '#c8352e'): Shape[] {
  const h = w * 0.8;
  return [
    shadow(0, 0, w * 0.5, h * 0.04, 0.22),
    ol(M(-w * 0.5, -h * 0.14) + Q(0, h * 0.06, w * 0.5, -h * 0.14) + L(w * 0.5, -h * 0.08) + Q(0, h * 0.12, -w * 0.5, -h * 0.08) + 'Z', '#8a5a34', 1, -0.3),
    stroke(line([[-w * 0.26, -h * 0.06], [-w * 0.22, -h * 0.42]]) + line([[-w * 0.12, -h * 0.04], [-w * 0.12, -h * 0.42]]) + line([[w * 0.14, -h * 0.04], [w * 0.14, -h * 0.42]]) + line([[w * 0.28, -h * 0.06], [w * 0.24, -h * 0.42]]), shade(col, -0.2), w * 0.05),
    stroke(curve([[-w * 0.32, -h * 0.6], [-w * 0.46, -h * 0.5], [-w * 0.44, -h * 0.3]]), mane, w * 0.05),
    ol(rect(-w * 0.34, -h * 0.64, w * 0.6, h * 0.24, h * 0.12), col, 1.2, -0.3),
    ol(M(w * 0.16, -h * 0.6) + L(w * 0.22, -h * 0.9) + Q(w * 0.28, -h * 1.0, w * 0.4, -h * 0.94) + L(w * 0.52, -h * 0.74) + Q(w * 0.54, -h * 0.66, w * 0.44, -h * 0.66) + L(w * 0.32, -h * 0.72) + L(w * 0.28, -h * 0.5) + 'Z', col, 1.2, -0.3),
    ol(poly([[w * 0.24, -h * 0.96], [w * 0.26, -h * 1.08], [w * 0.32, -h * 0.98]]), col, 1, -0.3),
    stroke(curve([[w * 0.22, -h * 0.94], [w * 0.16, -h * 0.8], [w * 0.14, -h * 0.62]]), mane, w * 0.06), sh(circle(w * 0.36, -h * 0.86, w * 0.022), '#2a1e18'),
    ol(rect(-w * 0.14, -h * 0.7, w * 0.2, h * 0.12, 3), saddle, 1, -0.3), stroke(line([[w * 0.46, -h * 0.72], [w * 0.2, -h * 0.66]]), saddle, 1.6),
  ];
}
/** Wooden toy soldier, origin bottom centre, `s` tall. */
export function toySoldier(s: number, coat = '#c8352e', hat = '#2c2735'): Shape[] {
  const w = s * 0.3;
  return [
    shadow(0, 0, w * 0.8, s * 0.03, 0.22), ol(rect(-w * 0.55, -s * 0.05, w * 1.1, s * 0.05, 2), '#5f8a45', 1),
    ol(rect(-w * 0.4, -s * 0.36, w * 0.36, s * 0.31, 2) + rect(w * 0.04, -s * 0.36, w * 0.36, s * 0.31, 2), '#2c3a5a', 1, 0.2), sh(rect(-w * 0.4, -s * 0.1, w * 0.36, s * 0.05) + rect(w * 0.04, -s * 0.1, w * 0.36, s * 0.05), '#1c1626'),
    ol(rect(-w * 0.48, -s * 0.66, w * 0.96, s * 0.32, 4), coat, 1.2, -0.3), sh(rect(-w * 0.48, -s * 0.4, w * 0.96, s * 0.05), '#f6eedc'), sh(circle(0, -s * 0.58, s * 0.015) + circle(0, -s * 0.5, s * 0.015), H.gold),
    stroke(line([[-w * 0.4, -s * 0.66], [w * 0.4, -s * 0.46]]), '#f6eedc', s * 0.025), ol(rect(-w * 0.66, -s * 0.64, w * 0.18, s * 0.26, 3) + rect(w * 0.48, -s * 0.64, w * 0.18, s * 0.26, 3), coat, 1, -0.3),
    ol(circle(0, -s * 0.74, w * 0.36), '#f4d2b0', 1, -0.25), sh(circle(-w * 0.18, -s * 0.72, w * 0.08) + circle(w * 0.18, -s * 0.72, w * 0.08), '#e89a9a', { opacity: 0.8 }), sh(circle(-w * 0.12, -s * 0.76, w * 0.04) + circle(w * 0.12, -s * 0.76, w * 0.04), '#2a1e18'),
    ol(rect(-w * 0.34, -s * 1.0, w * 0.68, s * 0.22, 3), hat, 1, 0.2), sh(rect(-w * 0.38, -s * 0.8, w * 0.76, s * 0.03), H.gold), sh(circle(0, -s * 0.92, w * 0.1), H.gold),
  ];
}
/** Gold star tree-topper, origin at its centre. */
export function starTopper(r: number): Shape[] {
  return [sh(circle(0, 0, r * 1.8), '#fff3c0', { opacity: 0.2 }), ol(star(0, 0, r, r * 0.45), H.gold, 1.4, -0.3), sh(star(0, 0, r * 0.55, r * 0.25), '#f8dc78'), hl(circle(-r * 0.2, -r * 0.25, r * 0.12), 0.7)];
}
/** Knitted mitten, origin at the cuff top, pointing down. */
export function mitten(s: number, col: string, trim = '#fbf6ee'): Shape[] {
  const body = M(-s * 0.22, s * 0.2) + L(s * 0.22, s * 0.2) + L(s * 0.26, s * 0.42) + Q(s * 0.42, s * 0.44, s * 0.4, s * 0.6) + Q(s * 0.36, s * 0.66, s * 0.26, s * 0.62) + Q(s * 0.3, s * 1.0, 0, s * 1.0) + Q(-s * 0.3, s * 1.0, -s * 0.26, s * 0.6) + Q(-s * 0.28, s * 0.4, -s * 0.22, s * 0.2) + 'Z';
  let dots = '';
  for (let i = 0; i < 5; i++) dots += star(-s * 0.12 + (i % 3) * s * 0.12, s * 0.5 + Math.floor(i / 3) * s * 0.2, s * 0.05, s * 0.022, 6);
  return [ol(body, col, 1.2, -0.3), sh(dots, trim, { opacity: 0.9 }), ol(rect(-s * 0.26, 0, s * 0.52, s * 0.22, 4), trim, 1, -0.2), stroke(line([[-s * 0.16, s * 0.03], [-s * 0.16, s * 0.19]]) + line([[0, s * 0.03], [0, s * 0.19]]) + line([[s * 0.16, s * 0.03], [s * 0.16, s * 0.19]]), shade(trim, -0.12), 1.2)];
}
/** Jingle bell with a bow, origin at the top of the bow. */
export function jingleBell(s: number, col = H.gold, bow = '#c8352e'): Shape[] {
  return [ol(circle(0, s * 0.56, s * 0.34), col, 1.2, -0.35), sh(M(-s * 0.26, s * 0.62) + Q(0, s * 0.72, s * 0.26, s * 0.62), shade(col, -0.35), { stroke: shade(col, -0.4), strokeWidth: s * 0.04 }), sh(circle(0, s * 0.74, s * 0.06), shade(col, -0.5)), stroke(line([[0, s * 0.74], [0, s * 0.88]]), shade(col, -0.5), s * 0.03), hl(ellipse(-s * 0.12, s * 0.44, s * 0.08, s * 0.05, -30), 0.7), ol(M(0, s * 0.2) + Q(-s * 0.34, -s * 0.06, -s * 0.3, s * 0.22) + Q(-s * 0.18, s * 0.3, 0, s * 0.2) + 'Z' + M(0, s * 0.2) + Q(s * 0.34, -s * 0.06, s * 0.3, s * 0.22) + Q(s * 0.18, s * 0.3, 0, s * 0.2) + 'Z', bow, 1, -0.3), ol(circle(0, s * 0.2, s * 0.06), bow, 1, -0.3)];
}
/** Holly sprig: two leaves and berries, origin at the berries. */
export function holly(s: number, rot = 0): Shape[] {
  const hollyLeaf = (ang: number) => {
    const pts: Pt[] = [];
    const n = 5;
    for (let i = 0; i <= n; i++) { const t = i / n; pts.push([t * s * 0.6, -Math.sin(Math.PI * t) * s * 0.18 - (i % 2 ? s * 0.05 : 0)]); }
    for (let i = n; i >= 0; i--) { const t = i / n; pts.push([t * s * 0.6, Math.sin(Math.PI * t) * s * 0.18 + (i % 2 ? s * 0.05 : 0)]); }
    return xf(poly(pts), { rot: ang + rot });
  };
  return [sh(hollyLeaf(-150) + hollyLeaf(-30), '#2f7a3a', { stroke: '#1f5428', strokeWidth: 1 }), stroke(xf(line([[0, 0], [s * 0.5, 0]]), { rot: -150 + rot }) + xf(line([[0, 0], [s * 0.5, 0]]), { rot: -30 + rot }), '#7ab06a', 0.9), ol(circle(-s * 0.06, s * 0.04, s * 0.08) + circle(s * 0.07, s * 0.05, s * 0.08) + circle(0, -s * 0.06, s * 0.08), '#d8283a', 0.8, -0.35), hl(circle(-s * 0.08, s * 0.02, s * 0.025) + circle(s * 0.05, s * 0.03, s * 0.025), 0.7)];
}
/** Wooden sled with red runners, origin bottom centre, `w` long, seen from the side. */
export function sled(w: number, wood = '#c98f55', runner = '#c8352e'): Shape[] {
  const h = w * 0.3;
  let sl = '';
  for (let i = 0; i < 4; i++) sl += line([[-w * 0.36 + i * w * 0.22, -h * 0.7], [-w * 0.36 + i * w * 0.22, -h * 0.44]]);
  return [shadow(0, 0, w * 0.5, h * 0.1, 0.22), stroke(M(-w * 0.44, -h * 0.06) + L(w * 0.36, -h * 0.06) + Q(w * 0.54, -h * 0.06, w * 0.5, -h * 0.36) + Q(w * 0.46, -h * 0.56, w * 0.38, -h * 0.44), runner, h * 0.12), stroke(line([[-w * 0.3, -h * 0.06], [-w * 0.3, -h * 0.5]]) + line([[w * 0.2, -h * 0.06], [w * 0.2, -h * 0.5]]), runner, h * 0.1), ol(rect(-w * 0.48, -h * 0.82, w * 0.9, h * 0.22, 4), wood, 1.2, -0.3), stroke(sl, shade(wood, -0.3), 1.2), stroke(M(w * 0.4, -h * 0.74) + Q(w * 0.6, -h * 1.0, w * 0.7, -h * 0.6), '#d8c8a0', 1.6)];
}
/** Pine cone, origin at its top, hanging down. */
export function pinecone(s: number): Shape[] {
  const out: Shape[] = [ol(ellipse(0, s * 0.5, s * 0.26, s * 0.46), '#8a5a2a', 1, -0.35)];
  let sc1 = '';
  for (let r = 0; r < 6; r++) for (let c = -1; c <= 1; c++) { const y = s * 0.2 + r * s * 0.12, w = s * 0.24 * Math.sin(Math.PI * (0.15 + r / 7)); sc1 += M(c * w * 0.6 - w * 0.3, y) + Q(c * w * 0.6, y + s * 0.09, c * w * 0.6 + w * 0.3, y); }
  out.push(stroke(sc1, '#5a3a1a', 1.4), stroke(sc1, '#c08a50', 0.8, { opacity: 0.6 }));
  return out;
}
/** Snowman ornament, origin at the hanging loop. */
export function snowmanOrnament(s: number): Shape[] {
  return [stroke(M(0, 0) + L(0, s * 0.1), H.gold, 1), ol(circle(0, s * 0.7, s * 0.26), '#fbfdff', 1, -0.15), ol(circle(0, s * 0.34, s * 0.19), '#fbfdff', 1, -0.15), sh(rect(-s * 0.2, s * 0.46, s * 0.4, s * 0.07, 2), '#c8352e'), sh(rect(s * 0.06, s * 0.48, s * 0.08, s * 0.18, 2), '#c8352e'), sh(rect(-s * 0.15, s * 0.1, s * 0.3, s * 0.06) + rect(-s * 0.1, -s * 0.0, s * 0.2, s * 0.12), '#2c2735'), sh(circle(-s * 0.07, s * 0.3, s * 0.025) + circle(s * 0.07, s * 0.3, s * 0.025) + circle(0, s * 0.62, s * 0.025) + circle(0, s * 0.74, s * 0.025), '#2c2735'), sh(poly([[0, s * 0.35], [s * 0.16, s * 0.38], [0, s * 0.4]]), '#f08a2a')];
}
/** Sleeping kitten curled in a basket-like round bed, origin bottom centre. */
export function curledCat(s: number, col = '#e39a52'): Shape[] {
  const dk = shade(col, -0.25);
  return [
    ol(ellipse(0, -s * 0.26, s * 0.5, s * 0.26), col, 1.2, -0.3),
    stroke(curve([[-s * 0.3, -s * 0.34], [-s * 0.1, -s * 0.44], [s * 0.1, -s * 0.42]]) + curve([[-s * 0.2, -s * 0.2], [0, -s * 0.3], [s * 0.2, -s * 0.28]]), dk, s * 0.04),
    stroke(M(s * 0.4, -s * 0.14) + Q(s * 0.1, s * 0.02, -s * 0.36, -s * 0.08), col, s * 0.1), stroke(M(-s * 0.2, -s * 0.06) + Q(-s * 0.3, -s * 0.06, -s * 0.36, -s * 0.08), dk, s * 0.1),
    ol(circle(-s * 0.3, -s * 0.3, s * 0.18), col, 1.2, -0.3), ol(poly([[-s * 0.44, -s * 0.36], [-s * 0.46, -s * 0.54], [-s * 0.32, -s * 0.44]]) + poly([[-s * 0.24, -s * 0.44], [-s * 0.14, -s * 0.56], [-s * 0.14, -s * 0.38]]), col, 1, -0.3),
    stroke(curve([[-s * 0.4, -s * 0.3], [-s * 0.36, -s * 0.27], [-s * 0.32, -s * 0.3]]) + curve([[-s * 0.26, -s * 0.3], [-s * 0.22, -s * 0.27], [-s * 0.18, -s * 0.3]]), '#3b2a1c', 1.2),
    sh(poly([[-s * 0.31, -s * 0.24], [-s * 0.27, -s * 0.24], [-s * 0.29, -s * 0.21]]), '#d9736a'),
  ];
}
/** Simple wreath ring of foliage with a bow, origin at centre. */
export function wreath(r: number, seed: number, cols = ['#2f6a3a', '#3f7a4a', '#4f8a52'], bow = '#c8352e', berries = '#d8283a'): Shape[] {
  const g = rng(seed);
  const parts = cols.map(() => '');
  for (let i = 0; i < 36; i++) { const a = (i / 36) * Math.PI * 2 + g.range(-0.05, 0.05); parts[i % cols.length] += leaf(Math.cos(a) * r * 0.78, Math.sin(a) * r * 0.78, r * 0.42, r * 0.11, (a * 180) / Math.PI + 90 + g.range(-40, 40)); }
  const out: Shape[] = [stroke(circle(0, 0, r * 0.82), shade(cols[0], -0.2), r * 0.28)];
  out.push(...parts.map((d, i) => sh(d, cols[i])));
  let b = '';
  for (let i = 0; i < 10; i++) { const a = g.range(0, Math.PI * 2); b += circle(Math.cos(a) * r * 0.82, Math.sin(a) * r * 0.82, r * 0.06); }
  out.push(sh(b, berries));
  out.push(ol(M(0, r * 0.8) + Q(-r * 0.5, r * 0.5, -r * 0.42, r * 0.94) + Q(-r * 0.2, r * 0.96, 0, r * 0.8) + 'Z' + M(0, r * 0.8) + Q(r * 0.5, r * 0.5, r * 0.42, r * 0.94) + Q(r * 0.2, r * 0.96, 0, r * 0.8) + 'Z', bow, 1, -0.3), ol(poly([[-r * 0.04, r * 0.82], [-r * 0.24, r * 1.3], [-r * 0.12, r * 1.24], [-r * 0.04, r * 1.32]]) + poly([[r * 0.04, r * 0.82], [r * 0.24, r * 1.3], [r * 0.12, r * 1.24], [r * 0.04, r * 1.32]]), bow, 1, -0.3), ol(circle(0, r * 0.8, r * 0.1), bow, 1, -0.3));
  return out;
}
/** Garland of foliage swagging between two points. */
export function garland(x0: number, y0: number, x1: number, y1: number, sag: number, seed: number, cols = ['#2f6a3a', '#3f7a4a', '#4f8a52']): Shape[] {
  const g = rng(seed);
  const parts = cols.map(() => '');
  const n = Math.max(8, Math.round(Math.hypot(x1 - x0, y1 - y0) / 7));
  for (let i = 0; i <= n; i++) {
    const t = i / n, x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t + Math.sin(Math.PI * t) * sag;
    for (let k = 0; k < 2; k++) parts[(i + k) % cols.length] += leaf(x, y, g.range(14, 22), g.range(4, 6), g.range(0, 360));
  }
  return parts.map((d, i) => sh(d, cols[i]));
}
/** String of round fairy lights along a sagging wire. */
export function fairyLights(x0: number, y0: number, x1: number, y1: number, sag: number, n: number, cols: string[], r = 4.5, wire = '#3a4a3a'): Shape[] {
  const pts: Pt[] = [];
  for (let i = 0; i <= 20; i++) { const t = i / 20; pts.push([x0 + (x1 - x0) * t, y0 + (y1 - y0) * t + Math.sin(Math.PI * t) * sag]); }
  const out: Shape[] = [stroke(curve(pts), wire, 1.2)];
  const byCol = cols.map(() => '');
  const glow = cols.map(() => '');
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n, x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t + Math.sin(Math.PI * t) * sag + r * 0.9;
    byCol[i % cols.length] += ellipse(x, y, r * 0.75, r);
    glow[i % cols.length] += circle(x, y, r * 2.4);
  }
  cols.forEach((c, i) => out.push(sh(glow[i], c, { opacity: 0.18 })));
  cols.forEach((c, i) => out.push(sh(byCol[i], c)));
  return out;
}
export { mix, star };
