// Shared props for the Game Day hidden-object scenes. Every prop is drawn
// around the origin and returns Shape[]; position it with place().
// All teams, emblems and colours are invented for this app.
import { rect, ellipse, circle, poly, line, curve, blob, leaf, petal, star, sector, sh, stroke, shade, rng, xf, place } from '../../art/kit';
import type { Shape } from '../../art/types';

export type Pt = [number, number];
const n = (v: number) => String(Math.round(v * 10) / 10);
export const M = (x: number, y: number) => `M${n(x)} ${n(y)}`;
export const L = (x: number, y: number) => `L${n(x)} ${n(y)}`;
export const Q = (cx: number, cy: number, x: number, y: number) => `Q${n(cx)} ${n(cy)} ${n(x)} ${n(y)}`;
export const CB = (a: number, b: number, c: number, d: number, x: number, y: number) => `C${n(a)} ${n(b)} ${n(c)} ${n(d)} ${n(x)} ${n(y)}`;

/** Filled shape with a darker outline of the same hue. */
export const ol = (d: string, fill: string, w = 1, amt = -0.3): Shape => sh(d, fill, { stroke: shade(fill, amt), strokeWidth: w });
export const shadow = (cx: number, cy: number, rx: number, ry: number, op = 0.2): Shape => sh(ellipse(cx, cy, rx, ry), '#2b2418', { opacity: op });
export const hl = (d: string, op = 0.5): Shape => sh(d, '#ffffff', { opacity: op });

export const P = {
  red: '#c8463a', redDk: '#963026', navy: '#26395f', navyDk: '#18253f', cream: '#f6ecd6', creamDk: '#e2d3b2',
  teal: '#2f8f8a', tealDk: '#1f6863', gold: '#e3b23c', goldDk: '#b4842a', green: '#5f9a4c', greenDk: '#3f7436',
  wood: '#b98552', woodLt: '#d4a26c', woodDk: '#7a5232', steel: '#a3abb2', steelDk: '#667078', leather: '#9a5a2e', leatherDk: '#6b3a1a',
  orange: '#e57a2e', sky: '#9fcbe8',
};
export const SKIN = ['#f1c9a5', '#e0aa80', '#c68b5e', '#a46a43', '#7a4b2c', '#f5d6bb'];
export const HAIR = ['#3b2a20', '#6b4426', '#a8743c', '#d9b56a', '#1f1a18', '#8a8a8a', '#b5502e'];

// =====================================================================
// small helpers
// =====================================================================
const SEG: Record<string, string> = { '0': 'abcdef', '1': 'bc', '2': 'abged', '3': 'abgcd', '4': 'fgbc', '5': 'afgcd', '6': 'afgedc', '7': 'abc', '8': 'abcdefg', '9': 'abcdfg', '-': 'g' };
/** Seven-segment digits as one filled path; (x,y) is the top-left of the first digit. */
export function digits(str: string, x: number, y: number, w: number, h: number, gap = w * 0.35): string {
  let d = '', cx = x;
  const t = w * 0.24, hh = h / 2;
  for (const ch of str) {
    for (const s of SEG[ch] ?? '') {
      if (s === 'a') d += rect(cx + t * 0.5, y, w - t, t);
      if (s === 'b') d += rect(cx + w - t, y + t * 0.5, t, hh - t * 0.3);
      if (s === 'c') d += rect(cx + w - t, y + hh, t, hh - t * 0.5);
      if (s === 'd') d += rect(cx + t * 0.5, y + h - t, w - t, t);
      if (s === 'e') d += rect(cx, y + hh, t, hh - t * 0.5);
      if (s === 'f') d += rect(cx, y + t * 0.5, t, hh - t * 0.3);
      if (s === 'g') d += rect(cx + t * 0.5, y + hh - t / 2, w - t, t);
    }
    cx += w + gap;
  }
  return d;
}

/** Little round team crest with a star (invented emblem). */
export function crest(r: number, col: string, accent: string, kind: 'star' | 'bird' | 'wave' = 'star'): Shape[] {
  const out: Shape[] = [ol(circle(0, 0, r), col, r * 0.08, -0.35), stroke(circle(0, 0, r * 0.8), accent, r * 0.07)];
  if (kind === 'star') out.push(sh(star(0, 0, r * 0.52, r * 0.22), accent));
  if (kind === 'bird') out.push(sh(M(-r * 0.55, r * 0.05) + Q(-r * 0.2, -r * 0.5, 0, -r * 0.05) + Q(r * 0.2, -r * 0.5, r * 0.55, r * 0.05) + Q(r * 0.2, -r * 0.2, 0, r * 0.25) + Q(-r * 0.2, -r * 0.2, -r * 0.55, r * 0.05) + 'Z', accent));
  if (kind === 'wave') out.push(sh(M(-r * 0.55, r * 0.1) + Q(-r * 0.3, -r * 0.35, 0, r * 0.05) + Q(r * 0.3, r * 0.4, r * 0.55, -r * 0.1) + L(r * 0.55, r * 0.25) + Q(r * 0.3, r * 0.6, 0, r * 0.3) + Q(-r * 0.3, 0, -r * 0.55, r * 0.4) + 'Z', accent));
  return out;
}

// =====================================================================
// textures
// =====================================================================
/** Wooden boards with seams and grain. */
export function planks(x: number, y: number, w: number, h: number, count: number, col: string, seed: number, vertical = false): Shape[] {
  const g = rng(seed);
  let lt = '', dk = '', seams = '', grain = '';
  const size = (vertical ? w : h) / count;
  for (let i = 0; i < count; i++) {
    const a = (vertical ? x : y) + i * size;
    const r = vertical ? rect(a, y, size, h) : rect(x, a, w, size);
    const t = g.int(0, 2);
    if (t === 0) lt += r; else if (t === 1) dk += r;
    if (i) seams += vertical ? line([[a, y], [a, y + h]]) : line([[x, a], [x + w, a]]);
    const len = vertical ? h : w;
    for (let k = 0; k < 2; k++) {
      const off = size * (0.3 + 0.4 * k + g.range(-0.06, 0.06));
      const pts: Pt[] = [];
      for (let s = 0; s <= 6; s++) { const along = (len * s) / 6, wob = g.range(-size * 0.06, size * 0.06); pts.push(vertical ? [a + off + wob, y + along] : [x + along, a + off + wob]); }
      grain += curve(pts);
    }
  }
  return [sh(rect(x, y, w, h), col), sh(lt, shade(col, 0.07)), sh(dk, shade(col, -0.07)), stroke(grain, shade(col, -0.2), 0.8, { opacity: 0.5 }), stroke(seams, shade(col, -0.4), 1.6)].filter((p) => p.d);
}

/** Running-bond tiles (subway tiles or bricks). */
export function brickWall(x: number, y: number, w: number, h: number, bw: number, bh: number, cols: string[], mortar: string, seed: number): Shape[] {
  const g = rng(seed);
  const by: string[] = cols.map(() => '');
  let ml = '';
  let row = 0;
  for (let ty = y; ty < y + h - 0.5; ty += bh, row++) {
    const off = row % 2 ? bw / 2 : 0;
    for (let tx = x - off; tx < x + w; tx += bw) {
      const x0 = Math.max(x, tx), x1 = Math.min(x + w, tx + bw);
      if (x1 - x0 < 1) continue;
      by[g.int(0, cols.length - 1)] += rect(x0, ty, x1 - x0, Math.min(bh, y + h - ty));
      if (tx > x) ml += line([[tx, ty], [tx, Math.min(ty + bh, y + h)]]);
    }
    if (ty > y) ml += line([[x, ty], [x + w, ty]]);
  }
  const out = by.map((d, i) => sh(d, cols[i])).filter((p) => p.d);
  out.push(stroke(ml, mortar, 1.2));
  return out;
}

// =====================================================================
// people
// =====================================================================
export interface FanOpts { hat?: string; arms?: 0 | 1 | 2; long?: boolean; skin?: string; num?: string; numCol?: string }
/** Seated fan seen from behind, origin at the seat line under the torso. */
export function fanBack(s: number, shirt: string, hair: string, o: FanOpts = {}): Shape[] {
  const skin = o.skin ?? SKIN[0];
  const out: Shape[] = [];
  const shoulder = blob([[-0.42 * s, 0.05 * s], [-0.45 * s, -0.42 * s], [-0.32 * s, -0.64 * s], [0, -0.68 * s], [0.32 * s, -0.64 * s], [0.45 * s, -0.42 * s], [0.42 * s, 0.05 * s]], 0.5);
  const arm = (side: number, up: boolean) => {
    if (up) {
      out.push(stroke(curve([[side * 0.34 * s, -0.58 * s], [side * 0.5 * s, -0.9 * s], [side * 0.46 * s, -1.22 * s]]), shirt, 0.17 * s));
      out.push(sh(circle(side * 0.46 * s, -1.27 * s, 0.085 * s), skin));
    }
  };
  if (o.arms) { arm(-1, true); if (o.arms === 2) arm(1, true); }
  out.push(sh(shoulder, shirt), sh(M(-0.3 * s, -0.62 * s) + Q(0, -0.5 * s, 0.3 * s, -0.62 * s) + L(0.32 * s, -0.66 * s) + Q(0, -0.72 * s, -0.32 * s, -0.66 * s) + 'Z', shade(shirt, -0.18)));
  if (o.num) out.push(sh(digits(o.num, -0.07 * s * o.num.length - 0.02 * s, -0.48 * s, 0.11 * s, 0.22 * s, 0.04 * s), o.numCol ?? P.cream));
  out.push(sh(rect(-0.08 * s, -0.78 * s, 0.16 * s, 0.14 * s), shade(skin, -0.08)));
  out.push(sh(ellipse(-0.19 * s, -0.86 * s, 0.05 * s, 0.07 * s) + ellipse(0.19 * s, -0.86 * s, 0.05 * s, 0.07 * s), shade(skin, -0.06)));
  out.push(sh(circle(0, -0.9 * s, 0.2 * s), skin));
  if (o.long) out.push(sh(blob([[-0.21 * s, -0.95 * s], [-0.16 * s, -1.08 * s], [0, -1.12 * s], [0.16 * s, -1.08 * s], [0.21 * s, -0.95 * s], [0.22 * s, -0.66 * s], [0, -0.6 * s], [-0.22 * s, -0.66 * s]], 0.8), hair));
  else out.push(sh(blob([[-0.205 * s, -0.92 * s], [-0.15 * s, -1.06 * s], [0, -1.11 * s], [0.15 * s, -1.06 * s], [0.205 * s, -0.92 * s], [0.17 * s, -0.79 * s], [0, -0.76 * s], [-0.17 * s, -0.79 * s]], 0.8), hair));
  if (o.hat) {
    out.push(sh(M(-0.215 * s, -0.94 * s) + Q(-0.2 * s, -1.15 * s, 0, -1.15 * s) + Q(0.2 * s, -1.15 * s, 0.215 * s, -0.94 * s) + 'Z', o.hat));
    out.push(sh(rect(-0.215 * s, -0.96 * s, 0.43 * s, 0.04 * s), shade(o.hat, -0.25)), sh(ellipse(0, -0.93 * s, 0.05 * s, 0.025 * s), hair), sh(circle(0, -1.15 * s, 0.025 * s), shade(o.hat, -0.3)));
  }
  return out;
}

/** Simple friendly face on a head circle at (0,0) radius r. */
export function face(r: number, skin: string, hair: string, smile = true): Shape[] {
  return [
    sh(circle(0, 0, r), skin),
    sh(ellipse(-r * 0.98, 0.05 * r, r * 0.16, r * 0.22) + ellipse(r * 0.98, 0.05 * r, r * 0.16, r * 0.22), shade(skin, -0.05)),
    sh(blob([[-r * 1.02, 0.05 * r], [-r * 0.9, -0.7 * r], [0, -1.08 * r], [r * 0.9, -0.7 * r], [r * 1.02, 0.05 * r], [r * 0.7, -0.4 * r], [0, -0.55 * r], [-r * 0.7, -0.4 * r]], 0.8), hair),
    sh(circle(-r * 0.36, 0.05 * r, r * 0.1) + circle(r * 0.36, 0.05 * r, r * 0.1), '#2b2420'),
    sh(circle(-r * 0.55, 0.38 * r, r * 0.16) + circle(r * 0.55, 0.38 * r, r * 0.16), '#e8866e', { opacity: 0.35 }),
    stroke(smile ? M(-r * 0.28, r * 0.42) + Q(0, r * 0.68, r * 0.28, r * 0.42) : M(-r * 0.2, r * 0.5) + L(r * 0.2, r * 0.5), '#7a3a2a', r * 0.09),
  ];
}

/** Stadium vendor walking the aisle with a tray. origin at the feet, height s. */
export function vendor(s: number, shirt: string, hat: string, skin: string, hair: string, kind: 'hotdog' | 'popcorn'): Shape[] {
  const out: Shape[] = [shadow(0, 0, 0.22 * s, 0.03 * s, 0.25)];
  out.push(sh(rect(-0.13 * s, -0.46 * s, 0.11 * s, 0.44 * s, 0.03 * s) + rect(0.02 * s, -0.46 * s, 0.11 * s, 0.44 * s, 0.03 * s), '#3a4a63'));
  out.push(sh(ellipse(-0.08 * s, -0.015 * s, 0.08 * s, 0.03 * s) + ellipse(0.08 * s, -0.015 * s, 0.08 * s, 0.03 * s), '#2a2420'));
  out.push(sh(blob([[-0.17 * s, -0.42 * s], [-0.2 * s, -0.7 * s], [-0.12 * s, -0.8 * s], [0.12 * s, -0.8 * s], [0.2 * s, -0.7 * s], [0.17 * s, -0.42 * s]], 0.4), shirt));
  out.push(sh(M(-0.07 * s, -0.8 * s) + L(0, -0.73 * s) + L(0.07 * s, -0.8 * s) + 'Z', P.cream));
  out.push(stroke(M(-0.12 * s, -0.79 * s) + L(-0.2 * s, -0.5 * s) + M(0.12 * s, -0.79 * s) + L(0.2 * s, -0.5 * s), '#e9e2d2', 0.022 * s));
  // arms holding tray
  out.push(stroke(curve([[-0.19 * s, -0.74 * s], [-0.25 * s, -0.6 * s], [-0.22 * s, -0.5 * s]]) + curve([[0.19 * s, -0.74 * s], [0.25 * s, -0.6 * s], [0.22 * s, -0.5 * s]]), shirt, 0.07 * s));
  // tray box
  const tw = 0.62 * s, th = 0.13 * s, ty = -0.52 * s;
  out.push(ol(rect(-tw / 2, ty, tw, th, 0.015 * s), kind === 'hotdog' ? '#f2f2ee' : '#f2f2ee', 0.008 * s));
  out.push(sh(rect(-tw / 2, ty + th * 0.35, tw, th * 0.3), kind === 'hotdog' ? P.red : '#e3b23c'));
  out.push(sh(star(0, ty + th * 0.5, th * 0.28, th * 0.12), '#ffffff'));
  if (kind === 'hotdog') {
    for (let i = 0; i < 4; i++) out.push(...place(hotDog(0.12 * s, false), { x: -tw / 2 + 0.09 * s + i * 0.145 * s, y: ty - 0.012 * s }));
  } else {
    for (let i = 0; i < 5; i++) out.push(...place(popcornBox(0.1 * s), { x: -tw / 2 + 0.07 * s + i * 0.12 * s, y: ty + 0.01 * s }));
  }
  out.push(sh(circle(-0.22 * s, -0.5 * s, 0.035 * s) + circle(0.22 * s, -0.5 * s, 0.035 * s), skin));
  out.push(sh(rect(-0.035 * s, -0.86 * s, 0.07 * s, 0.08 * s), shade(skin, -0.08)));
  out.push(...place(face(0.1 * s, skin, hair), { y: -0.94 * s }));
  out.push(sh(M(-0.105 * s, -0.97 * s) + Q(-0.1 * s, -1.08 * s, 0, -1.08 * s) + Q(0.1 * s, -1.08 * s, 0.105 * s, -0.97 * s) + 'Z', hat), sh(M(-0.11 * s, -0.975 * s) + Q(0, -0.99 * s, 0.17 * s, -0.96 * s) + L(0.17 * s, -0.945 * s) + Q(0, -0.96 * s, -0.11 * s, -0.955 * s) + 'Z', shade(hat, -0.25)));
  return out;
}

/** Tiny ballplayer, origin at the feet, height s. pose: 0 stand, 1 batter, 2 crouch. */
export function player(s: number, uni: string, cap: string, skin: string, pose: 0 | 1 | 2 = 0): Shape[] {
  const out: Shape[] = [shadow(0, 0, 0.22 * s, 0.05 * s, 0.25)];
  if (pose === 2) {
    out.push(sh(blob([[-0.25 * s, -0.05 * s], [-0.28 * s, -0.4 * s], [0, -0.55 * s], [0.28 * s, -0.4 * s], [0.25 * s, -0.05 * s]], 0.6), uni));
    out.push(sh(circle(0, -0.62 * s, 0.13 * s), '#333'), sh(rect(-0.1 * s, -0.66 * s, 0.2 * s, 0.1 * s), '#555'));
    return out;
  }
  out.push(sh(rect(-0.1 * s, -0.42 * s, 0.08 * s, 0.4 * s) + rect(0.02 * s, -0.42 * s, 0.08 * s, 0.4 * s), uni));
  out.push(sh(rect(-0.1 * s, -0.12 * s, 0.08 * s, 0.1 * s) + rect(0.02 * s, -0.12 * s, 0.08 * s, 0.1 * s), cap));
  out.push(sh(rect(-0.14 * s, -0.76 * s, 0.28 * s, 0.36 * s, 0.05 * s), uni), sh(rect(-0.14 * s, -0.46 * s, 0.28 * s, 0.04 * s), shade(cap, -0.2)));
  out.push(sh(circle(0, -0.86 * s, 0.1 * s), skin), sh(M(-0.11 * s, -0.86 * s) + Q(-0.1 * s, -0.98 * s, 0, -0.98 * s) + Q(0.1 * s, -0.98 * s, 0.11 * s, -0.86 * s) + 'Z', cap), sh(rect(0, -0.885 * s, 0.17 * s, 0.03 * s, 0.01 * s), cap));
  if (pose === 1) out.push(stroke(line([[0.12 * s, -0.66 * s], [0.34 * s, -1.08 * s]]), '#c49a62', 0.05 * s), stroke(line([[-0.12 * s, -0.7 * s], [0.12 * s, -0.66 * s]]), uni, 0.06 * s));
  else out.push(stroke(line([[-0.14 * s, -0.72 * s], [-0.2 * s, -0.48 * s]]) + line([[0.14 * s, -0.72 * s], [0.2 * s, -0.48 * s]]), uni, 0.06 * s));
  return out;
}

// =====================================================================
// ballpark props
// =====================================================================
/** Baseball, origin centre. */
export function baseball(r: number): Shape[] {
  return [ol(circle(0, 0, r), '#fbf8f0', r * 0.06, -0.25), stroke(M(-r * 0.62, -r * 0.78) + Q(-r * 0.2, 0, -r * 0.62, r * 0.78), '#c8463a', r * 0.09), stroke(M(r * 0.62, -r * 0.78) + Q(r * 0.2, 0, r * 0.62, r * 0.78), '#c8463a', r * 0.09), hl(ellipse(-r * 0.25, -r * 0.4, r * 0.22, r * 0.12, -30), 0.6)];
}

/** Baseball bat along +x, knob at the origin. */
export function bat(len: number, col = '#d4a26c'): Shape[] {
  const d = M(0, -len * 0.016) + L(len * 0.3, -len * 0.018) + Q(len * 0.6, -len * 0.045, len * 0.96, -len * 0.052) + Q(len * 1.01, 0, len * 0.96, len * 0.052) + Q(len * 0.6, len * 0.045, len * 0.3, len * 0.018) + L(0, len * 0.016) + 'Z';
  return [ol(d, col, len * 0.006, -0.35), sh(ellipse(0, 0, len * 0.014, len * 0.036), shade(col, -0.35)), sh(rect(len * 0.02, -len * 0.018, len * 0.2, len * 0.036), '#2f2f36'), stroke(line([[len * 0.05, -len * 0.014], [len * 0.07, len * 0.014]]) + line([[len * 0.11, -len * 0.014], [len * 0.13, len * 0.014]]) + line([[len * 0.17, -len * 0.014], [len * 0.19, len * 0.014]]), '#55555e', len * 0.004), hl(M(len * 0.35, -len * 0.01) + Q(len * 0.65, -len * 0.022, len * 0.93, -len * 0.028) + L(len * 0.93, -len * 0.018) + Q(len * 0.65, -len * 0.012, len * 0.35, -len * 0.004) + 'Z', 0.45), sh(star(len * 0.72, 0, len * 0.016, len * 0.007), shade(col, -0.4))];
}

/** Baseball mitt with fingers up, origin centre, width ~s. */
export function mitt(s: number, col = P.leather): Shape[] {
  const dk = shade(col, -0.25), lace = '#e9c79a';
  const out: Shape[] = [];
  out.push(ol(xf(rect(-0.14 * s, -0.42 * s, 0.17 * s, 0.46 * s, 0.085 * s), { rot: -48, ox: 0, oy: 0, x: -0.28 * s, y: 0.12 * s }), col, s * 0.012));
  // web
  out.push(sh(poly([[-0.36 * s, -0.22 * s], [-0.2 * s, -0.5 * s], [-0.16 * s, -0.08 * s]]), dk), stroke(line([[-0.33 * s, -0.25 * s], [-0.19 * s, -0.22 * s]]) + line([[-0.3 * s, -0.33 * s], [-0.18 * s, -0.3 * s]]) + line([[-0.25 * s, -0.42 * s], [-0.18 * s, -0.4 * s]]), lace, s * 0.015));
  const fx = [-0.2, -0.05, 0.1, 0.24];
  fx.forEach((x, i) => out.push(ol(rect(x * s - 0.075 * s, (-0.62 + Math.abs(i - 1.2) * 0.05) * s, 0.15 * s, 0.6 * s, 0.075 * s), i % 2 ? col : shade(col, 0.06), s * 0.012)));
  out.push(ol(rect(-0.3 * s, -0.2 * s, 0.64 * s, 0.56 * s, 0.22 * s), col, s * 0.012));
  out.push(sh(ellipse(0.03 * s, 0.05 * s, 0.2 * s, 0.17 * s), dk, { opacity: 0.6 }));
  out.push(ol(rect(-0.24 * s, 0.3 * s, 0.52 * s, 0.15 * s, 0.05 * s), dk, s * 0.01));
  let ld = '';
  fx.forEach((x, i) => { const top = (-0.62 + Math.abs(i - 1.2) * 0.05) * s; ld += M(x * s - 0.03 * s, top + 0.05 * s) + L(x * s + 0.03 * s, top + 0.09 * s); });
  out.push(stroke(ld, lace, s * 0.018));
  out.push(sh(circle(-0.16 * s, 0.375 * s, 0.025 * s) + circle(0.02 * s, 0.375 * s, 0.025 * s) + circle(0.2 * s, 0.375 * s, 0.025 * s), lace));
  out.push(sh(star(0.04 * s, 0.375 * s, 0.03 * s, 0.013 * s), P.gold));
  return out;
}

/** Ball cap in side view, origin at the bottom of the crown, brim to the right. */
export function cap(s: number, col: string, brim = shade(col, -0.2), logo = '#ffffff'): Shape[] {
  return [
    ol(M(-0.42 * s, 0) + Q(-0.42 * s, -0.55 * s, 0, -0.55 * s) + Q(0.38 * s, -0.55 * s, 0.4 * s, 0) + 'Z', col, s * 0.02),
    ol(M(0.3 * s, -0.02 * s) + Q(0.6 * s, -0.08 * s, 0.82 * s, 0.04 * s) + Q(0.6 * s, 0.1 * s, 0.3 * s, 0.06 * s) + 'Z', brim, s * 0.02),
    stroke(M(-0.02 * s, -0.55 * s) + Q(-0.1 * s, -0.25 * s, -0.06 * s, 0), shade(col, -0.25), s * 0.02),
    sh(ellipse(0, -0.56 * s, 0.07 * s, 0.035 * s), shade(col, -0.25)),
    sh(star(0.2 * s, -0.26 * s, 0.13 * s, 0.055 * s), logo),
    sh(rect(-0.42 * s, -0.06 * s, 0.75 * s, 0.06 * s), shade(col, -0.12)),
  ];
}

/** Giant foam "#1" finger, origin bottom centre, height s. */
export function foamFinger(s: number, col = '#f2cf3a', text = P.red): Shape[] {
  const out: Shape[] = [];
  out.push(ol(rect(-0.22 * s, -0.22 * s, 0.44 * s, 0.22 * s, 0.03 * s), shade(col, -0.12), s * 0.012));
  out.push(ol(xf(rect(-0.05 * s, -0.3 * s, 0.13 * s, 0.32 * s, 0.065 * s), { rot: -40, x: -0.28 * s, y: -0.36 * s }), col, s * 0.012));
  out.push(ol(rect(-0.18 * s, -1.0 * s, 0.17 * s, 0.6 * s, 0.085 * s), col, s * 0.012));
  out.push(ol(rect(-0.28 * s, -0.56 * s, 0.56 * s, 0.38 * s, 0.1 * s), col, s * 0.012));
  out.push(stroke(M(0.04 * s, -0.56 * s) + Q(0.06 * s, -0.46 * s, 0.04 * s, -0.4 * s) + M(0.16 * s, -0.55 * s) + Q(0.18 * s, -0.46 * s, 0.16 * s, -0.4 * s), shade(col, -0.25), s * 0.012));
  out.push(sh(digits('1', -0.1 * s, -0.37 * s, 0.08 * s, 0.15 * s), text));
  out.push(sh(star(0, -0.11 * s, 0.06 * s, 0.025 * s), text));
  out.push(hl(rect(-0.15 * s, -0.95 * s, 0.04 * s, 0.4 * s, 0.02 * s), 0.4));
  return out;
}

/** Felt pennant on a stick, origin at the top of the stick; flag points right. */
export function pennant(len: number, col: string, accent: string, stick = true): Shape[] {
  const h = len * 0.42;
  const out: Shape[] = [];
  if (stick) out.push(sh(rect(-len * 0.025, -len * 0.02, len * 0.05, h + len * 0.55, len * 0.02), '#d4b07a'));
  out.push(ol(poly([[0, 0], [len, h * 0.5], [0, h]]), col, len * 0.01));
  out.push(sh(rect(0, 0, len * 0.12, h), shade(col, -0.2)));
  out.push(sh(poly([[len * 0.12, h * 0.42], [len * 0.9, h * 0.5], [len * 0.12, h * 0.58]]), accent));
  out.push(sh(star(len * 0.3, h * 0.5, h * 0.2, h * 0.08), accent));
  out.push(sh(circle(len * 0.06, h * 0.2, len * 0.018) + circle(len * 0.06, h * 0.8, len * 0.018), accent));
  return out;
}

/** String of bunting pennants from (0,0) to (w, 0). */
export function bunting(w: number, sag: number, size: number, cols: string[]): Shape[] {
  const out: Shape[] = [stroke(M(0, 0) + Q(w / 2, sag * 2, w, 0), '#6b5a48', 1.4)];
  const count = Math.floor(w / (size * 1.25));
  for (let i = 0; i < count; i++) {
    const t = (i + 0.5) / count, x = w * t, y = 2 * (1 - t) * t * sag * 2;
    out.push(sh(poly([[x - size / 2, y], [x + size / 2, y], [x, y + size * 1.1]]), cols[i % cols.length]));
  }
  return out;
}

/** Hot dog in a paper boat, origin centre, length s. */
export function hotDog(s: number, tray = true): Shape[] {
  const out: Shape[] = [];
  if (tray) {
    out.push(ol(poly([[-0.52 * s, -0.08 * s], [0.52 * s, -0.08 * s], [0.44 * s, 0.16 * s], [-0.44 * s, 0.16 * s]]), '#fbf8f0', s * 0.01, -0.2));
    let st = '';
    for (let i = 0; i < 5; i++) { const x = -0.4 * s + i * 0.2 * s; st += poly([[x, -0.08 * s], [x + 0.08 * s, -0.08 * s], [x + 0.07 * s, 0.16 * s], [x - 0.01 * s, 0.16 * s]]); }
    out.push(sh(st, P.red));
  }
  out.push(sh(blob([[-0.48 * s, -0.1 * s], [-0.3 * s, -0.22 * s], [0.3 * s, -0.22 * s], [0.48 * s, -0.1 * s], [0.3 * s, -0.06 * s], [-0.3 * s, -0.06 * s]], 0.7), '#d99a52'));
  out.push(ol(rect(-0.56 * s, -0.17 * s, 1.12 * s, 0.13 * s, 0.065 * s), '#b84a32', s * 0.008));
  out.push(hl(rect(-0.48 * s, -0.155 * s, 0.9 * s, 0.03 * s, 0.015 * s), 0.35));
  let z = M(-0.42 * s, -0.11 * s);
  for (let i = 1; i <= 8; i++) z += L(-0.42 * s + i * 0.105 * s, i % 2 ? -0.15 * s : -0.08 * s);
  out.push(stroke(z, '#f2c230', s * 0.03));
  out.push(ol(blob([[-0.5 * s, -0.06 * s], [-0.3 * s, -0.08 * s], [0.3 * s, -0.08 * s], [0.5 * s, -0.06 * s], [0.4 * s, 0.06 * s], [-0.4 * s, 0.06 * s]], 0.7), '#e8b06a', s * 0.008));
  return out;
}

/** Striped popcorn box, origin bottom centre, height h. */
export function popcornBox(h: number, col = P.red): Shape[] {
  const out: Shape[] = [];
  const bot = 0.26 * h, top = 0.36 * h, bh = 0.78 * h;
  const g = rng(Math.round(h * 13));
  let p1 = '', p2 = '';
  for (let i = 0; i < 14; i++) { const d = circle(g.range(-top * 0.9, top * 0.9), -bh - g.range(0.0, 0.2) * h, g.range(0.07, 0.11) * h); if (i % 2) p1 += d; else p2 += d; }
  out.push(sh(p1, '#fbeeb8'), sh(p2, '#f4dc8a'));
  out.push(ol(poly([[-bot, 0], [bot, 0], [top, -bh], [-top, -bh]]), '#fbf8f0', h * 0.015, -0.2));
  let st = '';
  for (let i = 0; i < 5; i++) {
    const a = -1 + (i * 2 + 0.5) / 5, b = a + 0.2;
    st += poly([[a * bot, 0], [b * bot, 0], [b * top, -bh], [a * top, -bh]]);
  }
  out.push(sh(st, col));
  out.push(sh(circle(0, -bh * 0.5, 0.13 * h), '#fbf8f0'), sh(star(0, -bh * 0.5, 0.1 * h, 0.04 * h), col));
  out.push(sh(circle(-0.12 * h, -bh - 0.05 * h, 0.08 * h) + circle(0.14 * h, -bh - 0.03 * h, 0.075 * h), '#fff4c8'));
  return out;
}

/** Soda cup with lid and straw, origin bottom centre, height h. */
export function sodaCup(h: number, col = P.teal): Shape[] {
  return [
    ol(rect(0.04 * h, -1.28 * h, 0.07 * h, 0.5 * h, 0.03 * h), '#f6f2ea', h * 0.01),
    sh(rect(0.04 * h, -1.2 * h, 0.07 * h, 0.06 * h) + rect(0.04 * h, -1.08 * h, 0.07 * h, 0.06 * h) + rect(0.04 * h, -0.96 * h, 0.07 * h, 0.06 * h), P.red),
    ol(poly([[-0.22 * h, 0], [0.22 * h, 0], [0.3 * h, -0.84 * h], [-0.3 * h, -0.84 * h]]), col, h * 0.015),
    sh(poly([[-0.25 * h, -0.36 * h], [0.25 * h, -0.36 * h], [0.27 * h, -0.56 * h], [-0.27 * h, -0.56 * h]]), '#fbf8f0'),
    sh(M(-0.18 * h, -0.42 * h) + Q(-0.09 * h, -0.54 * h, 0, -0.46 * h) + Q(0.09 * h, -0.38 * h, 0.18 * h, -0.5 * h) + L(0.18 * h, -0.44 * h) + Q(0.09 * h, -0.32 * h, 0, -0.4 * h) + Q(-0.09 * h, -0.48 * h, -0.18 * h, -0.36 * h) + 'Z', col),
    ol(rect(-0.33 * h, -0.9 * h, 0.66 * h, 0.08 * h, 0.03 * h), '#eef1f2', h * 0.01, -0.2),
    ol(M(-0.24 * h, -0.9 * h) + Q(0, -1.02 * h, 0.24 * h, -0.9 * h) + 'Z', '#e3e8ea', h * 0.01, -0.2),
    hl(poly([[-0.2 * h, -0.08 * h], [-0.15 * h, -0.08 * h], [-0.21 * h, -0.78 * h], [-0.26 * h, -0.78 * h]]), 0.3),
  ];
}

/** Paper bag of peanuts, origin bottom centre, height h. */
export function peanutBag(h: number): Shape[] {
  const w = 0.62 * h;
  let zig = M(-w / 2, -0.88 * h);
  for (let i = 1; i <= 8; i++) zig += L(-w / 2 + (w * i) / 8, i % 2 ? -0.95 * h : -0.88 * h);
  const nut = (x: number, y: number, s: number, r: number) => xf(ellipse(-s * 0.42, 0, s * 0.5, s * 0.36) + ellipse(s * 0.42, 0, s * 0.48, s * 0.38) + rect(-s * 0.4, -s * 0.3, s * 0.8, s * 0.6), { rot: r, x, y });
  return [
    sh(nut(-0.05 * h, -0.96 * h, 0.12 * h, -20) + nut(0.14 * h, -0.98 * h, 0.11 * h, 25), '#d6a86a', { stroke: '#a77a42', strokeWidth: h * 0.012 }),
    ol(zig + L(w / 2, 0) + L(-w / 2, 0) + 'Z', '#cfa577', h * 0.012),
    sh(rect(-w / 2, -0.12 * h, w, 0.12 * h), '#b88c5c'),
    ol(ellipse(0, -0.5 * h, 0.22 * h, 0.17 * h), '#f6ecd6', h * 0.01),
    sh(nut(0, -0.5 * h, 0.15 * h, -15), '#c48a4a'),
    stroke(M(-0.06 * h, -0.55 * h) + L(-0.05 * h, -0.47 * h) + M(0.06 * h, -0.52 * h) + L(0.05 * h, -0.44 * h), '#8a5a2a', h * 0.012),
    sh(star(0, -0.25 * h, 0.06 * h, 0.025 * h), P.red),
  ];
}

/** Binoculars seen from the front, origin centre, width s. */
export function binoculars(s: number, col = '#2e3440'): Shape[] {
  const out: Shape[] = [];
  out.push(ol(rect(-0.12 * s, -0.22 * s, 0.24 * s, 0.32 * s, 0.05 * s), shade(col, 0.15), s * 0.01));
  for (const x of [-0.27 * s, 0.27 * s]) {
    out.push(ol(rect(x - 0.22 * s, -0.36 * s, 0.44 * s, 0.5 * s, 0.1 * s), col, s * 0.01));
    out.push(sh(circle(x, 0.04 * s, 0.22 * s), shade(col, -0.2)));
    out.push(sh(circle(x, 0.04 * s, 0.17 * s), '#5e8fb8'), sh(circle(x, 0.04 * s, 0.11 * s), '#2b4a6a'));
    out.push(hl(ellipse(x - 0.06 * s, -0.02 * s, 0.06 * s, 0.035 * s, -30), 0.7));
    out.push(sh(rect(x - 0.2 * s, -0.22 * s, 0.4 * s, 0.05 * s), shade(col, 0.2)));
  }
  out.push(ol(circle(0, -0.3 * s, 0.07 * s), '#8a929a', s * 0.01));
  out.push(stroke(M(-0.47 * s, -0.25 * s) + Q(-0.6 * s, 0.3 * s, -0.3 * s, 0.45 * s), '#6b3a1a', s * 0.03));
  return out;
}

/** Sunglasses, origin centre, width s. */
export function sunglasses(s: number, frame = '#1f1f24', lens = '#3a3f52'): Shape[] {
  const lensD = (x: number) => blob([[x - 0.2 * s, -0.1 * s], [x + 0.2 * s, -0.12 * s], [x + 0.19 * s, 0.05 * s], [x + 0.05 * s, 0.15 * s], [x - 0.15 * s, 0.1 * s]], 0.7);
  return [
    stroke(M(-0.44 * s, -0.08 * s) + L(-0.52 * s, -0.04 * s) + M(0.44 * s, -0.08 * s) + L(0.52 * s, -0.04 * s), frame, s * 0.04),
    sh(lensD(-0.24 * s), frame, { stroke: frame, strokeWidth: s * 0.05 }),
    sh(xf(lensD(-0.24 * s), { sx: -1 }), frame, { stroke: frame, strokeWidth: s * 0.05 }),
    sh(lensD(-0.24 * s), lens), sh(xf(lensD(-0.24 * s), { sx: -1 }), lens),
    stroke(M(-0.05 * s, -0.07 * s) + Q(0, -0.12 * s, 0.05 * s, -0.07 * s), frame, s * 0.04),
    hl(ellipse(-0.3 * s, -0.04 * s, 0.07 * s, 0.03 * s, -20), 0.45), hl(ellipse(0.18 * s, -0.04 * s, 0.07 * s, 0.03 * s, -20), 0.45),
  ];
}

/** Clipboard with a scorecard (or chalk plays), origin centre, height s. */
export function clipboard(s: number, kind: 'score' | 'plays' = 'score', board = '#b98552'): Shape[] {
  const w = 0.74 * s;
  const out: Shape[] = [ol(rect(-w / 2, -s / 2, w, s, 0.04 * s), board, s * 0.012), sh(rect(-w / 2 + 0.05 * s, -0.42 * s, w - 0.1 * s, 0.86 * s), '#fbf8f0')];
  let g = '';
  if (kind === 'score') {
    for (let i = 1; i < 9; i++) g += line([[-w / 2 + 0.05 * s, -0.42 * s + i * 0.095 * s], [w / 2 - 0.05 * s, -0.42 * s + i * 0.095 * s]]);
    for (let i = 1; i < 5; i++) g += line([[-w / 2 + 0.05 * s + i * 0.128 * s, -0.33 * s], [-w / 2 + 0.05 * s + i * 0.128 * s, 0.44 * s]]);
    out.push(stroke(g, '#6f8fb8', s * 0.008));
    out.push(sh(rect(-w / 2 + 0.05 * s, -0.42 * s, w - 0.1 * s, 0.09 * s), '#c8463a', { opacity: 0.85 }));
    out.push(stroke(M(-0.12 * s, -0.1 * s) + L(-0.06 * s, -0.17 * s) + L(0, -0.1 * s) + L(-0.06 * s, -0.03 * s) + 'Z', '#2b2b30', s * 0.01));
  } else {
    out.push(stroke(circle(-0.14 * s, -0.2 * s, 0.05 * s) + circle(0.1 * s, -0.05 * s, 0.05 * s), '#2b4a8a', s * 0.015));
    out.push(stroke(M(-0.2 * s, 0.08 * s) + L(-0.1 * s, 0.18 * s) + M(-0.1 * s, 0.08 * s) + L(-0.2 * s, 0.18 * s) + M(0.06 * s, 0.2 * s) + L(0.16 * s, 0.3 * s) + M(0.16 * s, 0.2 * s) + L(0.06 * s, 0.3 * s), '#c8463a', s * 0.015));
    out.push(stroke(M(-0.14 * s, -0.14 * s) + Q(-0.1 * s, 0.05 * s, 0.1 * s, 0.1 * s), '#2b2b30', s * 0.01), sh(poly([[0.1 * s, 0.1 * s], [0.04 * s, 0.07 * s], [0.06 * s, 0.13 * s]]), '#2b2b30'));
  }
  out.push(ol(rect(-0.14 * s, -0.56 * s, 0.28 * s, 0.12 * s, 0.03 * s), '#b8c0c8', s * 0.01), sh(circle(0, -0.53 * s, 0.025 * s), '#667078'));
  out.push(...place([ol(rect(0, -0.025 * s, 0.6 * s, 0.05 * s, 0.01 * s), '#f2c230', s * 0.006), sh(poly([[0.6 * s, -0.025 * s], [0.68 * s, 0], [0.6 * s, 0.025 * s]]), '#e8c9a0'), sh(rect(-0.05 * s, -0.025 * s, 0.05 * s, 0.05 * s), '#e88a9a')], { rot: -60, x: 0.2 * s, y: 0.3 * s }));
  return out;
}

/** Cotton candy on a paper cone, origin at the bottom of the cone, height s. */
export function cottonCandy(s: number, col = '#f4a6c4'): Shape[] {
  const g = rng(Math.round(s * 7));
  let a = '', b = '';
  for (let i = 0; i < 12; i++) { const ang = (i / 12) * Math.PI * 2, d = circle(Math.cos(ang) * 0.17 * s, -0.72 * s + Math.sin(ang) * 0.17 * s, g.range(0.1, 0.14) * s); if (i % 2) a += d; else b += d; }
  return [
    sh(circle(0, -0.72 * s, 0.25 * s) + a, col), sh(b, shade(col, 0.25)), hl(circle(-0.08 * s, -0.8 * s, 0.07 * s), 0.35),
    ol(poly([[-0.03 * s, 0], [0.03 * s, 0], [0.12 * s, -0.5 * s], [-0.12 * s, -0.5 * s]]), '#fbf8f0', s * 0.01, -0.2),
    sh(poly([[-0.08 * s, -0.3 * s], [0.08 * s, -0.3 * s], [0.1 * s, -0.4 * s], [-0.1 * s, -0.4 * s]]), '#6aa8d8'),
  ];
}

/** Soft pretzel, origin centre, width s. */
export function pretzel(s: number): Shape[] {
  const c = '#b86a2e';
  const g = rng(5);
  let salt = '';
  for (let i = 0; i < 14; i++) { const a = g.range(0, Math.PI * 2), r = g.range(0.18, 0.32) * s; salt += rect(Math.cos(a) * r + (i % 2 ? 0.2 : -0.2) * s, Math.sin(a) * r * 0.8 - 0.05 * s, 0.025 * s, 0.025 * s); }
  return [
    ol(sector(-0.2 * s, -0.05 * s, 0.3 * s, 120, 400, 0.18 * s), c, s * 0.012),
    ol(sector(0.2 * s, -0.05 * s, 0.3 * s, 140, 420, 0.18 * s), c, s * 0.012),
    ol(sector(0, -0.2 * s, 0.5 * s, 45, 135, 0.39 * s), shade(c, 0.05), s * 0.012),
    hl(sector(-0.2 * s, -0.05 * s, 0.27 * s, 200, 280, 0.23 * s), 0.3), hl(sector(0.2 * s, -0.05 * s, 0.27 * s, 220, 300, 0.23 * s), 0.3),
    sh(salt, '#fbf8f0'),
  ];
}

/** Seagull standing, origin at the feet, facing right, height s. */
export function gull(s: number): Shape[] {
  return [
    stroke(M(-0.06 * s, 0) + L(-0.04 * s, -0.2 * s) + M(0.08 * s, 0) + L(0.06 * s, -0.2 * s), '#e8a23a', 0.03 * s),
    ol(blob([[-0.5 * s, -0.42 * s], [-0.2 * s, -0.6 * s], [0.25 * s, -0.55 * s], [0.32 * s, -0.3 * s], [0.05 * s, -0.18 * s], [-0.3 * s, -0.28 * s]], 0.8), '#fbfbf8', 0.015 * s, -0.15),
    sh(blob([[-0.55 * s, -0.4 * s], [-0.25 * s, -0.52 * s], [0.15 * s, -0.48 * s], [0.0 * s, -0.36 * s], [-0.3 * s, -0.34 * s]], 0.8), '#9aa4ae'),
    sh(poly([[-0.6 * s, -0.42 * s], [-0.45 * s, -0.45 * s], [-0.45 * s, -0.37 * s]]), '#2b2f36'),
    ol(circle(0.28 * s, -0.66 * s, 0.13 * s), '#fbfbf8', 0.015 * s, -0.15),
    sh(poly([[0.38 * s, -0.68 * s], [0.56 * s, -0.64 * s], [0.38 * s, -0.6 * s]]), '#f0b63a'),
    sh(circle(0.31 * s, -0.69 * s, 0.025 * s), '#1f1f24'),
  ];
}

// =====================================================================
// locker-room props
// =====================================================================
/** Classic soccer ball, origin centre. */
export function soccerBall(r: number): Shape[] {
  const pent = (cx: number, cy: number, rr: number, rot: number) => { const pts: Pt[] = []; for (let i = 0; i < 5; i++) { const a = ((rot + i * 72) * Math.PI) / 180; pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); } return pts; };
  const centre = pent(0, 0, r * 0.3, -90);
  let edge = '', seams = '';
  for (let k = 0; k < 5; k++) {
    const a = -90 + 36 + k * 72;
    const ar = (deg: number) => (deg * Math.PI) / 180;
    const pts: Pt[] = [[Math.cos(ar(a - 17)) * r * 0.68, Math.sin(ar(a - 17)) * r * 0.68], [Math.cos(ar(a - 24)) * r, Math.sin(ar(a - 24)) * r], [Math.cos(ar(a)) * r * 1.0, Math.sin(ar(a)) * r * 1.0], [Math.cos(ar(a + 24)) * r, Math.sin(ar(a + 24)) * r], [Math.cos(ar(a + 17)) * r * 0.68, Math.sin(ar(a + 17)) * r * 0.68]];
    edge += poly(pts);
    const v = centre[k];
    seams += line([v, [Math.cos(ar(-90 + k * 72)) * r * 0.62, Math.sin(ar(-90 + k * 72)) * r * 0.62]]);
    seams += line([[Math.cos(ar(-90 + k * 72)) * r * 0.62, Math.sin(ar(-90 + k * 72)) * r * 0.62], pts[0]]) + line([[Math.cos(ar(-90 + (k + 1) * 72)) * r * 0.62, Math.sin(ar(-90 + (k + 1) * 72)) * r * 0.62], pts[4]]);
  }
  return [sh(circle(0, 0, r), '#fbfbf8'), sh(poly(centre) + edge, '#24242a'), stroke(seams, '#6a6a72', r * 0.04), stroke(circle(0, 0, r), '#3a3a42', r * 0.05), hl(ellipse(-r * 0.4, -r * 0.45, r * 0.2, r * 0.1, -35), 0.5)];
}

/** Basketball, origin centre. */
export function basketball(r: number, col = '#e07a2e'): Shape[] {
  const c = '#3a2418';
  return [ol(circle(0, 0, r), col, r * 0.05, -0.35), sh(ellipse(r * 0.25, r * 0.3, r * 0.6, r * 0.55), shade(col, -0.1), { opacity: 0.5 }), stroke(M(0, -r) + L(0, r) + M(-r, 0) + L(r, 0) + M(-r * 0.7, -r * 0.7) + Q(-r * 0.25, 0, -r * 0.7, r * 0.7) + M(r * 0.7, -r * 0.7) + Q(r * 0.25, 0, r * 0.7, r * 0.7), c, r * 0.06), hl(ellipse(-r * 0.42, -r * 0.48, r * 0.18, r * 0.09, -35), 0.35)];
}

/** American football, origin centre, length s (pointing right). */
export function football(s: number): Shape[] {
  const body = M(-0.5 * s, 0) + Q(-0.25 * s, -0.36 * s, 0, -0.33 * s) + Q(0.25 * s, -0.36 * s, 0.5 * s, 0) + Q(0.25 * s, 0.36 * s, 0, 0.33 * s) + Q(-0.25 * s, 0.36 * s, -0.5 * s, 0) + 'Z';
  return [
    ol(body, '#8a4a26', s * 0.012), sh(ellipse(0.05 * s, 0.08 * s, 0.38 * s, 0.18 * s), '#6e3a1c', { opacity: 0.4 }),
    stroke(M(-0.34 * s, -0.2 * s) + Q(-0.36 * s, 0, -0.34 * s, 0.2 * s) + M(0.34 * s, -0.2 * s) + Q(0.36 * s, 0, 0.34 * s, 0.2 * s), '#f6ecd6', s * 0.035),
    stroke(M(-0.16 * s, -0.12 * s) + L(0.16 * s, -0.12 * s), '#f6ecd6', s * 0.025),
    stroke(M(-0.12 * s, -0.16 * s) + L(-0.12 * s, -0.08 * s) + M(-0.04 * s, -0.16 * s) + L(-0.04 * s, -0.08 * s) + M(0.04 * s, -0.16 * s) + L(0.04 * s, -0.08 * s) + M(0.12 * s, -0.16 * s) + L(0.12 * s, -0.08 * s), '#f6ecd6', s * 0.025),
    hl(M(-0.3 * s, -0.18 * s) + Q(0, -0.3 * s, 0.25 * s, -0.2 * s) + Q(0, -0.26 * s, -0.3 * s, -0.15 * s) + 'Z', 0.3),
  ];
}

/** Volleyball, origin centre. */
export function volleyball(r: number, a = '#f2cf3a', b = '#3f6fb8'): Shape[] {
  return [
    sh(circle(0, 0, r), '#fbfbf8'),
    sh(M(-r * 0.98, -r * 0.2) + Q(-r * 0.2, -r * 0.6, r * 0.45, -r * 0.89) + Q(r * 0.7, -r * 0.7, r * 0.8, -r * 0.58) + Q(0, -r * 0.4, -r * 0.92, r * 0.38) + Q(-r * 1.02, 0.1 * r, -r * 0.98, -r * 0.2) + 'Z', a),
    sh(M(r * 0.15, r * 0.99) + Q(r * 0.3, r * 0.2, r * 0.92, -r * 0.38) + Q(r * 1.0, -r * 0.1, r * 0.99, r * 0.15) + Q(r * 0.55, r * 0.5, r * 0.5, r * 0.88) + Q(r * 0.3, r * 0.98, r * 0.15, r * 0.99) + 'Z', b),
    stroke(M(-r * 0.3, -r * 0.1) + Q(0, r * 0.3, r * 0.1, r * 0.98) + M(-r * 0.3, -r * 0.1) + Q(r * 0.3, -r * 0.4, r * 0.95, -r * 0.3), '#8a8a92', r * 0.035),
    stroke(circle(0, 0, r), '#6a6a72', r * 0.05), hl(ellipse(-r * 0.4, -r * 0.5, r * 0.18, r * 0.08, -35), 0.4),
  ];
}

/** Tennis ball, origin centre. */
export function tennisBall(r: number): Shape[] {
  return [ol(circle(0, 0, r), '#d6e04a', r * 0.06, -0.3), stroke(M(-r * 0.9, -r * 0.4) + Q(-r * 0.1, -r * 0.1, -r * 0.4, r * 0.9) + M(r * 0.9, r * 0.4) + Q(r * 0.1, r * 0.1, r * 0.4, -r * 0.9), '#fbfbf0', r * 0.12)];
}

/** Tennis racket, handle end at the origin, head pointing up (-y), length len. */
export function tennisRacket(len: number, frame = P.red, grip = '#2b2b30', str = '#e4dcc4'): Shape[] {
  const hx = 0.22 * len, hy = 0.29 * len, cy = -0.68 * len;
  let s = '';
  for (let i = -4; i <= 4; i++) { const x = (i / 5) * hx; const yy = hy * Math.sqrt(1 - (x / hx) ** 2) * 0.96; s += line([[x, cy - yy], [x, cy + yy]]); }
  for (let i = -5; i <= 5; i++) { const y = (i / 6) * hy; const xx = hx * Math.sqrt(1 - (y / hy) ** 2) * 0.96; s += line([[-xx, cy + y], [xx, cy + y]]); }
  return [
    sh(poly([[-0.025 * len, -0.32 * len], [-0.13 * len, -0.44 * len], [-0.1 * len, -0.45 * len], [0, -0.36 * len], [0.1 * len, -0.45 * len], [0.13 * len, -0.44 * len], [0.025 * len, -0.32 * len]]), frame),
    ol(rect(-0.03 * len, -0.34 * len, 0.06 * len, 0.34 * len, 0.015 * len), grip, len * 0.004, 0.3),
    stroke(M(-0.03 * len, -0.06 * len) + L(0.03 * len, -0.1 * len) + M(-0.03 * len, -0.14 * len) + L(0.03 * len, -0.18 * len) + M(-0.03 * len, -0.22 * len) + L(0.03 * len, -0.26 * len), shade(grip, 0.3), len * 0.006),
    sh(ellipse(0, cy, hx, hy), '#ffffff', { opacity: 0.18 }),
    stroke(s, str, len * 0.008),
    sh(ringPath(0, cy, hx + 0.025 * len, hy + 0.025 * len, hx, hy), frame, { stroke: shade(frame, -0.3), strokeWidth: len * 0.004 }),
  ];
}
/** Elliptical ring as a single closed path (outer clockwise, inner anticlockwise via evenodd-free winding). */
function ringPath(cx: number, cy: number, rx: number, ry: number, ix: number, iy: number): string {
  const pts: Pt[] = [];
  for (let i = 0; i <= 36; i++) { const a = (i / 36) * Math.PI * 2; pts.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); }
  for (let i = 36; i >= 0; i--) { const a = (i / 36) * Math.PI * 2; pts.push([cx + Math.cos(a) * ix, cy + Math.sin(a) * iy]); }
  return poly(pts);
}

/** Sneaker in side view, toe to the right, origin bottom centre, length s. */
export function sneaker(s: number, col: string, accent = '#ffffff', sole = '#f4f1ea'): Shape[] {
  const upper = M(-0.48 * s, -0.08 * s) + L(-0.46 * s, -0.36 * s) + Q(-0.4 * s, -0.42 * s, -0.3 * s, -0.4 * s) + L(-0.1 * s, -0.34 * s) + Q(0.15 * s, -0.24 * s, 0.38 * s, -0.17 * s) + Q(0.52 * s, -0.13 * s, 0.5 * s, -0.08 * s) + 'Z';
  return [
    ol(upper, col, s * 0.012),
    ol(rect(-0.5 * s, -0.1 * s, 1.02 * s, 0.1 * s, 0.045 * s), sole, s * 0.01, -0.25),
    sh(rect(-0.5 * s, -0.03 * s, 1.02 * s, 0.03 * s, 0.015 * s), shade(sole, -0.3)),
    sh(M(0.25 * s, -0.1 * s) + Q(0.3 * s, -0.2 * s, 0.4 * s, -0.17 * s) + Q(0.5 * s, -0.14 * s, 0.5 * s, -0.1 * s) + 'Z', shade(col, 0.2)),
    sh(M(-0.3 * s, -0.12 * s) + L(0.05 * s, -0.3 * s) + L(0.1 * s, -0.26 * s) + L(-0.22 * s, -0.12 * s) + 'Z' + M(-0.18 * s, -0.12 * s) + L(0.12 * s, -0.25 * s) + L(0.16 * s, -0.22 * s) + L(-0.1 * s, -0.12 * s) + 'Z', accent),
    stroke(M(-0.12 * s, -0.35 * s) + L(-0.06 * s, -0.29 * s) + M(-0.03 * s, -0.32 * s) + L(0.02 * s, -0.26 * s) + M(0.06 * s, -0.29 * s) + L(0.1 * s, -0.23 * s), '#fbfbf8', s * 0.025),
    sh(rect(-0.48 * s, -0.36 * s, 0.07 * s, 0.24 * s, 0.02 * s), shade(col, -0.25)),
  ];
}

/** Jersey on a hanger, origin at the hook top, width s. */
export function jersey(s: number, col: string, trim: string, num: string, hanger = true): Shape[] {
  const out: Shape[] = [];
  if (hanger) out.push(stroke(M(0, 0) + Q(0.06 * s, 0, 0.05 * s, 0.06 * s) + Q(0.03 * s, 0.1 * s, 0, 0.1 * s) + L(-0.34 * s, 0.24 * s) + L(0.34 * s, 0.24 * s) + L(0, 0.1 * s), '#8a8f96', s * 0.02));
  const body = M(-0.18 * s, 0.12 * s) + Q(0, 0.2 * s, 0.18 * s, 0.12 * s) + L(0.5 * s, 0.26 * s) + L(0.42 * s, 0.5 * s) + L(0.3 * s, 0.46 * s) + L(0.3 * s, 1.05 * s) + L(-0.3 * s, 1.05 * s) + L(-0.3 * s, 0.46 * s) + L(-0.42 * s, 0.5 * s) + L(-0.5 * s, 0.26 * s) + 'Z';
  out.push(ol(body, col, s * 0.012));
  out.push(sh(M(-0.18 * s, 0.12 * s) + Q(0, 0.2 * s, 0.18 * s, 0.12 * s) + L(0.13 * s, 0.17 * s) + Q(0, 0.32 * s, -0.13 * s, 0.17 * s) + 'Z', trim));
  out.push(sh(poly([[0.43 * s, 0.47 * s], [0.5 * s, 0.26 * s], [0.47 * s, 0.25 * s], [0.4 * s, 0.46 * s]]) + poly([[-0.43 * s, 0.47 * s], [-0.5 * s, 0.26 * s], [-0.47 * s, 0.25 * s], [-0.4 * s, 0.46 * s]]), trim));
  out.push(sh(rect(-0.3 * s, 0.94 * s, 0.6 * s, 0.04 * s), trim));
  const dw = 0.16 * s, gap = 0.05 * s, tw = num.length * dw + (num.length - 1) * gap;
  out.push(sh(digits(num, -tw / 2, 0.46 * s, dw, 0.34 * s, gap), trim));
  return out;
}

/** Squeeze water bottle, origin bottom centre, height h. */
export function waterBottle(h: number, col: string, cap = '#f4f1ea'): Shape[] {
  return [
    ol(rect(-0.2 * h, -0.8 * h, 0.4 * h, 0.8 * h, 0.08 * h), col, h * 0.012),
    sh(rect(-0.2 * h, -0.5 * h, 0.4 * h, 0.06 * h) + rect(-0.2 * h, -0.3 * h, 0.4 * h, 0.06 * h), shade(col, -0.15)),
    ol(rect(-0.16 * h, -0.92 * h, 0.32 * h, 0.14 * h, 0.03 * h), cap, h * 0.01, -0.25),
    ol(poly([[-0.05 * h, -0.92 * h], [0.05 * h, -0.92 * h], [0.03 * h, -1.04 * h], [-0.03 * h, -1.04 * h]]), cap, h * 0.01, -0.25),
    sh(star(0, -0.62 * h, 0.08 * h, 0.035 * h), '#fbfbf8'),
    hl(rect(-0.15 * h, -0.74 * h, 0.05 * h, 0.6 * h, 0.025 * h), 0.3),
  ];
}

/** Folded towel stack piece, origin bottom-left, w × h. */
export function foldedTowel(w: number, h: number, col: string, stripe: string): Shape[] {
  return [ol(rect(0, -h, w, h, h * 0.35), col, 1), sh(rect(w * 0.12, -h, w * 0.06, h) + rect(w * 0.22, -h, w * 0.03, h), stripe), sh(rect(w * 0.05, -h * 0.75, w * 0.9, h * 0.12, h * 0.06), shade(col, -0.1), { opacity: 0.5 })];
}

/** Rolled towel seen end-on, origin centre, radius r. */
export function rolledTowel(r: number, col: string, stripe: string): Shape[] {
  return [ol(rect(-r * 2.4, -r, r * 2.4, r * 2, r * 0.3), col, r * 0.06), sh(rect(-r * 2.0, -r, r * 0.25, r * 2) + rect(-r * 1.6, -r, r * 0.12, r * 2), stripe), ol(circle(0, 0, r), shade(col, 0.1), r * 0.06), stroke(M(0, 0) + Q(r * 0.5, -r * 0.1, r * 0.35, r * 0.4) + Q(-r * 0.1, r * 0.8, -r * 0.6, r * 0.2) + Q(-r * 0.7, -r * 0.6, 0, -r * 0.7) + Q(r * 0.7, -r * 0.6, r * 0.8, 0), shade(col, -0.25), r * 0.08)];
}

/** Trophy cup, origin bottom centre, height s. */
export function trophy(s: number, col = P.gold, base = '#5a3a24'): Shape[] {
  const dk = shade(col, -0.25);
  return [
    ol(sector(-0.3 * s, -0.75 * s, 0.17 * s, 80, 280, 0.11 * s), col, s * 0.01, -0.3),
    ol(sector(0.3 * s, -0.75 * s, 0.17 * s, -100, 100, 0.11 * s), col, s * 0.01, -0.3),
    ol(M(-0.32 * s, -1.0 * s) + L(0.32 * s, -1.0 * s) + Q(0.32 * s, -0.55 * s, 0.04 * s, -0.48 * s) + L(-0.04 * s, -0.48 * s) + Q(-0.32 * s, -0.55 * s, -0.32 * s, -1.0 * s) + 'Z', col, s * 0.012, -0.3),
    ol(rect(-0.34 * s, -1.04 * s, 0.68 * s, 0.06 * s, 0.02 * s), shade(col, 0.1), s * 0.01, -0.3),
    sh(rect(-0.04 * s, -0.5 * s, 0.08 * s, 0.18 * s), dk),
    ol(poly([[-0.14 * s, -0.3 * s], [0.14 * s, -0.3 * s], [0.18 * s, -0.24 * s], [-0.18 * s, -0.24 * s]]), col, s * 0.01, -0.3),
    ol(rect(-0.26 * s, -0.24 * s, 0.52 * s, 0.24 * s, 0.02 * s), base, s * 0.01),
    sh(rect(-0.14 * s, -0.17 * s, 0.28 * s, 0.1 * s, 0.01 * s), '#e8d49a'),
    sh(star(0, -0.78 * s, 0.11 * s, 0.045 * s), dk),
    hl(M(-0.22 * s, -0.95 * s) + Q(-0.22 * s, -0.66 * s, -0.08 * s, -0.56 * s) + L(-0.13 * s, -0.6 * s) + Q(-0.18 * s, -0.7 * s, -0.17 * s, -0.95 * s) + 'Z', 0.45),
  ];
}

/** Coach's whistle on a lanyard, origin at the whistle centre, size s. */
export function whistle(s: number, col = '#c9ced4', cord = P.red): Shape[] {
  return [
    stroke(M(-0.32 * s, -0.1 * s) + Q(-0.5 * s, -0.7 * s, 0.05 * s, -0.75 * s) + Q(0.55 * s, -0.7 * s, 0.38 * s, -0.25 * s), cord, s * 0.04),
    ol(rect(0.08 * s, -0.3 * s, 0.48 * s, 0.17 * s, 0.03 * s), col, s * 0.015),
    ol(circle(-0.02 * s, -0.08 * s, 0.26 * s), col, s * 0.015),
    sh(circle(-0.02 * s, -0.08 * s, 0.1 * s), shade(col, -0.35)),
    ol(circle(-0.3 * s, -0.1 * s, 0.06 * s), shade(col, -0.1), s * 0.012),
    hl(ellipse(-0.08 * s, -0.2 * s, 0.08 * s, 0.04 * s, -20), 0.6),
  ];
}

/** Stopwatch, origin at the dial centre, radius r. */
export function stopwatch(r: number, col = '#3a7fc2'): Shape[] {
  let ticks = '';
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; ticks += line([[Math.cos(a) * r * 0.72, Math.sin(a) * r * 0.72], [Math.cos(a) * r * 0.82, Math.sin(a) * r * 0.82]]); }
  return [
    ol(rect(-r * 0.14, -r * 1.32, r * 0.28, r * 0.25, r * 0.05), '#b8c0c8', r * 0.05),
    ol(rect(-r * 0.24, -r * 1.4, r * 0.48, r * 0.12, r * 0.05), '#b8c0c8', r * 0.05),
    ol(xf(rect(-r * 0.09, -r * 1.2, r * 0.18, r * 0.22, r * 0.04), { rot: 40 }), '#b8c0c8', r * 0.05),
    ol(circle(0, 0, r), col, r * 0.06),
    ol(circle(0, 0, r * 0.85), '#fbfbf8', r * 0.04, -0.15),
    stroke(ticks, '#2b2b30', r * 0.05),
    stroke(M(0, 0) + L(r * 0.35, -r * 0.48), P.red, r * 0.07), stroke(M(0, 0) + L(-r * 0.3, r * 0.1), '#2b2b30', r * 0.07),
    sh(circle(0, 0, r * 0.08), '#2b2b30'),
  ];
}

/** Dumbbell lying sideways, origin centre, length s. */
export function dumbbell(s: number, col = '#3a3f4a'): Shape[] {
  return [
    ol(rect(-0.34 * s, -0.04 * s, 0.68 * s, 0.08 * s, 0.02 * s), '#b8c0c8', s * 0.008),
    stroke(M(-0.1 * s, -0.04 * s) + L(-0.06 * s, 0.04 * s) + M(-0.02 * s, -0.04 * s) + L(0.02 * s, 0.04 * s) + M(0.06 * s, -0.04 * s) + L(0.1 * s, 0.04 * s), '#7a828a', s * 0.01),
    ol(rect(-0.5 * s, -0.24 * s, 0.1 * s, 0.48 * s, 0.03 * s), col, s * 0.01), ol(rect(-0.4 * s, -0.19 * s, 0.07 * s, 0.38 * s, 0.02 * s), shade(col, 0.15), s * 0.01),
    ol(rect(0.4 * s, -0.24 * s, 0.1 * s, 0.48 * s, 0.03 * s), col, s * 0.01), ol(rect(0.33 * s, -0.19 * s, 0.07 * s, 0.38 * s, 0.02 * s), shade(col, 0.15), s * 0.01),
  ];
}

/** Jump rope coiled on the floor, origin centre, width s. */
export function jumpRope(s: number, rope = '#3a8fd0', handle = P.red): Shape[] {
  return [
    stroke(M(-0.36 * s, 0.05 * s) + CB(-0.6 * s, -0.4 * s, 0.4 * s, -0.5 * s, 0.3 * s, -0.05 * s) + CB(0.2 * s, 0.35 * s, -0.4 * s, 0.25 * s, -0.2 * s, -0.12 * s) + CB(0, -0.4 * s, 0.6 * s, -0.1 * s, 0.38 * s, 0.1 * s), rope, s * 0.035),
    ol(xf(rect(-0.05 * s, 0, 0.1 * s, 0.3 * s, 0.05 * s), { rot: 30, x: -0.38 * s, y: 0.02 * s }), handle, s * 0.01),
    ol(xf(rect(-0.05 * s, 0, 0.1 * s, 0.3 * s, 0.05 * s), { rot: -50, x: 0.38 * s, y: 0.06 * s }), handle, s * 0.01),
    sh(xf(rect(-0.05 * s, 0.2 * s, 0.1 * s, 0.06 * s), { rot: 30, x: -0.38 * s, y: 0.02 * s }) + xf(rect(-0.05 * s, 0.2 * s, 0.1 * s, 0.06 * s), { rot: -50, x: 0.38 * s, y: 0.06 * s }), '#fbfbf8'),
  ];
}

/** Medal on a ribbon, origin at the top of the ribbon, height s. */
export function medal(s: number, col = P.gold, rib1 = P.red, rib2 = P.navy): Shape[] {
  return [
    sh(poly([[-0.25 * s, 0], [-0.08 * s, 0], [0.06 * s, 0.55 * s], [-0.08 * s, 0.6 * s]]), rib1),
    sh(poly([[0.25 * s, 0], [0.08 * s, 0], [-0.06 * s, 0.55 * s], [0.08 * s, 0.6 * s]]), rib2),
    ol(circle(0, 0.75 * s, 0.22 * s), col, s * 0.015, -0.3),
    sh(circle(0, 0.75 * s, 0.16 * s), shade(col, -0.12)),
    sh(star(0, 0.75 * s, 0.12 * s, 0.05 * s), shade(col, 0.25)),
  ];
}

/** Gym duffel bag, origin bottom centre, length w. */
export function duffel(w: number, col: string, trim: string): Shape[] {
  return [
    stroke(M(-0.25 * w, -0.32 * w) + Q(0, -0.62 * w, 0.25 * w, -0.32 * w), shade(col, -0.3), 0.04 * w),
    ol(rect(-0.5 * w, -0.36 * w, w, 0.36 * w, 0.17 * w), col, 0.012 * w),
    sh(rect(-0.5 * w, -0.08 * w, w, 0.05 * w), trim),
    stroke(M(-0.36 * w, -0.33 * w) + L(0.36 * w, -0.33 * w), '#d8d8d0', 0.012 * w),
    ol(circle(-0.5 * w + 0.02 * w, -0.18 * w, 0.13 * w), shade(col, -0.12), 0.01 * w),
    sh(star(0.12 * w, -0.2 * w, 0.07 * w, 0.03 * w), trim),
  ];
}

/** Football helmet facing left, origin bottom centre, size s. */
export function helmet(s: number, col: string, stripe: string): Shape[] {
  return [
    ol(M(0.45 * s, -0.05 * s) + Q(0.5 * s, -0.85 * s, -0.05 * s, -0.85 * s) + Q(-0.48 * s, -0.82 * s, -0.42 * s, -0.4 * s) + L(-0.2 * s, -0.3 * s) + L(-0.18 * s, -0.05 * s) + 'Z', col, s * 0.015),
    sh(M(0.05 * s, -0.85 * s) + Q(0.4 * s, -0.75 * s, 0.45 * s, -0.4 * s) + L(0.37 * s, -0.4 * s) + Q(0.34 * s, -0.7 * s, 0.03 * s, -0.79 * s) + 'Z', stripe),
    sh(circle(0.08 * s, -0.36 * s, 0.1 * s), shade(col, -0.35)),
    stroke(M(-0.4 * s, -0.42 * s) + L(-0.58 * s, -0.38 * s) + L(-0.55 * s, -0.08 * s) + L(-0.2 * s, -0.08 * s) + M(-0.57 * s, -0.24 * s) + L(-0.19 * s, -0.22 * s), '#e8e6e0', s * 0.035),
    hl(M(-0.2 * s, -0.75 * s) + Q(0.05 * s, -0.82 * s, 0.25 * s, -0.7 * s) + Q(0.05 * s, -0.76 * s, -0.2 * s, -0.7 * s) + 'Z', 0.35),
  ];
}

/** Hockey stick, blade at origin pointing left, handle going up-right, length len. */
export function hockeyStick(len: number, col = '#d4a26c', tape = '#2b2b30'): Shape[] {
  return [
    sh(xf(rect(-len * 0.018, -len, len * 0.036, len * 0.92, len * 0.01), { rot: 12 }), col),
    sh(xf(rect(-len * 0.018, -len, len * 0.036, len * 0.14), { rot: 12 }), tape),
    sh(M(len * 0.02, -len * 0.1) + Q(0, 0, -len * 0.06, 0) + L(-len * 0.3, 0) + Q(-len * 0.32, -len * 0.04, -len * 0.28, -len * 0.05) + L(-len * 0.02, -len * 0.06) + 'Z', tape),
  ];
}

/** Traffic cone, origin bottom centre, height h. */
export function cone(h: number, col = '#ef7a2a'): Shape[] {
  return [ol(rect(-0.4 * h, -0.08 * h, 0.8 * h, 0.08 * h, 0.02 * h), col, h * 0.01), ol(poly([[-0.28 * h, -0.08 * h], [0.28 * h, -0.08 * h], [0.06 * h, -h], [-0.06 * h, -h]]), col, h * 0.01), sh(poly([[-0.2 * h, -0.4 * h], [0.2 * h, -0.4 * h], [0.15 * h, -0.58 * h], [-0.15 * h, -0.58 * h]]), '#fbfbf8')];
}

/** Wall clock, origin centre. */
export function wallClock(r: number, rim = '#2b2b30'): Shape[] {
  let ticks = '';
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; ticks += line([[Math.cos(a) * r * 0.74, Math.sin(a) * r * 0.74], [Math.cos(a) * r * 0.86, Math.sin(a) * r * 0.86]]); }
  return [ol(circle(0, 0, r), rim, 1), sh(circle(0, 0, r * 0.9), '#fbfbf8'), stroke(ticks, '#2b2b30', r * 0.05), stroke(M(0, 0) + L(r * 0.42, -r * 0.2) + M(0, 0) + L(-r * 0.1, -r * 0.62), '#2b2b30', r * 0.07), stroke(M(0, 0) + L(-r * 0.4, r * 0.5), P.red, r * 0.03), sh(circle(0, 0, r * 0.07), '#2b2b30')];
}

// =====================================================================
// clubhouse props
// =====================================================================
/** Golf ball, origin centre. */
export function golfBall(r: number): Shape[] {
  let dim = '';
  for (const [x, y] of [[-0.4, -0.3], [0, -0.45], [0.4, -0.3], [-0.5, 0.1], [-0.1, 0], [0.3, 0.05], [-0.25, 0.42], [0.15, 0.42], [0.55, 0.38]] as Pt[]) dim += circle(x * r, y * r, r * 0.09);
  return [ol(circle(0, 0, r), '#fbfbf8', r * 0.06, -0.2), sh(dim, '#d4d8dc'), hl(ellipse(-r * 0.35, -r * 0.4, r * 0.18, r * 0.1, -30), 0.8)];
}

/** Golf club, grip end at origin, shaft going down (+y), length len. kind 0 driver, 1 iron, 2 putter. */
export function golfClub(len: number, kind: 0 | 1 | 2, grip = '#2b2b30'): Shape[] {
  const out: Shape[] = [stroke(line([[0, 0], [0, len * 0.95]]), '#b8c0c8', len * 0.016), sh(rect(-len * 0.014, 0, len * 0.028, len * 0.22, len * 0.01), grip)];
  if (kind === 0) out.push(ol(blob([[-len * 0.01, len * 0.92], [len * 0.1, len * 0.9], [len * 0.15, len * 0.96], [len * 0.1, len * 1.01], [-len * 0.02, len * 1.0]], 0.8), '#3a3f4a', len * 0.006));
  if (kind === 1) out.push(ol(poly([[-len * 0.012, len * 0.92], [len * 0.1, len * 0.95], [len * 0.11, len * 1.0], [-len * 0.012, len * 1.0]]), '#c9ced4', len * 0.006));
  if (kind === 2) out.push(ol(rect(-len * 0.03, len * 0.95, len * 0.14, len * 0.045, len * 0.01), '#9aa2a8', len * 0.006));
  return out;
}

/** Golf bag on its stand legs, origin bottom centre, height h. */
export function golfBag(h: number, col = P.navy, trim = P.red): Shape[] {
  const w = 0.3 * h;
  const out: Shape[] = [shadow(0.05 * h, 0, 0.3 * h, 0.04 * h)];
  out.push(stroke(M(0.08 * h, -0.55 * h) + L(0.3 * h, 0) + M(0.06 * h, -0.55 * h) + L(0.22 * h, 0), '#3a3f4a', 0.015 * h));
  // club heads poking out
  const heads: [number, string, number][] = [[-0.09, '#3a3f4a', 0], [-0.02, '#c9ced4', 1], [0.05, '#3a3f4a', 0], [0.11, '#c9ced4', 1], [0.0, '#9aa2a8', 2]];
  for (const [x, c, k] of heads) {
    out.push(stroke(line([[x * h, -0.9 * h], [x * h + 0.01 * h, -1.04 * h]]), '#b8c0c8', 0.012 * h));
    if (k === 0) out.push(ol(blob([[x * h - 0.04 * h, -1.04 * h], [x * h + 0.02 * h, -1.1 * h], [x * h + 0.07 * h, -1.05 * h], [x * h + 0.02 * h, -1.01 * h]], 0.8), c, 0.006 * h), sh(blob([[x * h - 0.05 * h, -1.02 * h], [x * h + 0.02 * h, -1.1 * h], [x * h + 0.08 * h, -1.04 * h], [x * h, -0.98 * h]], 0.8), i2c(c)));
    else if (k === 1) out.push(ol(poly([[x * h, -1.08 * h], [x * h + 0.06 * h, -1.06 * h], [x * h + 0.06 * h, -1.03 * h], [x * h, -1.03 * h]]), c, 0.005 * h));
    else out.push(ol(rect(x * h - 0.02 * h, -1.08 * h, 0.08 * h, 0.03 * h, 0.01 * h), c, 0.005 * h));
  }
  out.push(ol(rect(-w / 2, -0.92 * h, w, 0.9 * h, 0.05 * h), col, 0.01 * h));
  out.push(ol(rect(-w / 2 - 0.01 * h, -0.95 * h, w + 0.02 * h, 0.09 * h, 0.03 * h), shade(col, 0.15), 0.01 * h));
  out.push(sh(rect(-w / 2, -0.86 * h, w, 0.03 * h) + rect(-w / 2, -0.14 * h, w, 0.04 * h), trim));
  out.push(ol(rect(-w / 2 + 0.02 * h, -0.62 * h, w * 0.6, 0.36 * h, 0.03 * h), shade(col, -0.12), 0.008 * h));
  out.push(stroke(M(-w / 2 + 0.04 * h, -0.6 * h) + L(-w / 2 + 0.04 * h, -0.28 * h), '#d8d8d0', 0.008 * h));
  out.push(ol(rect(-w / 2 - 0.02 * h, -0.04 * h, w + 0.04 * h, 0.05 * h, 0.02 * h), '#2b2b30', 0.006 * h));
  out.push(stroke(M(w / 2, -0.78 * h) + Q(w / 2 + 0.14 * h, -0.55 * h, w / 2, -0.32 * h), '#2b2b30', 0.025 * h));
  out.push(sh(star(0.04 * h, -0.72 * h, 0.04 * h, 0.017 * h), trim));
  return out;
}
const i2c = (c: string) => (c === '#3a3f4a' ? '#2b2f36' : c);

/** Golf cart in side view facing right, origin ground centre, length s. */
export function golfCart(s: number, col = '#f4f1ea', roof = '#2f8f8a'): Shape[] {
  const out: Shape[] = [shadow(0, 0, 0.55 * s, 0.05 * s, 0.25)];
  out.push(stroke(M(-0.38 * s, -0.3 * s) + L(-0.38 * s, -0.86 * s) + M(0.3 * s, -0.36 * s) + L(0.24 * s, -0.86 * s), '#3a3f4a', 0.02 * s));
  out.push(sh(poly([[0.29 * s, -0.36 * s], [0.25 * s, -0.8 * s], [0.31 * s, -0.8 * s], [0.4 * s, -0.4 * s]]), '#bfe0ef', { opacity: 0.7 }));
  // golf bag on the back
  out.push(ol(rect(-0.56 * s, -0.62 * s, 0.12 * s, 0.34 * s, 0.02 * s), P.red, 0.006 * s), stroke(line([[-0.53 * s, -0.62 * s], [-0.54 * s, -0.7 * s]]) + line([[-0.48 * s, -0.62 * s], [-0.47 * s, -0.72 * s]]), '#b8c0c8', 0.01 * s), sh(circle(-0.54 * s, -0.71 * s, 0.022 * s) + circle(-0.47 * s, -0.73 * s, 0.022 * s), '#3a3f4a'));
  out.push(ol(blob([[-0.5 * s, -0.12 * s], [-0.5 * s, -0.32 * s], [0.3 * s, -0.36 * s], [0.46 * s, -0.3 * s], [0.52 * s, -0.16 * s], [0.48 * s, -0.1 * s]], 0.4), col, 0.008 * s));
  out.push(ol(rect(-0.32 * s, -0.56 * s, 0.1 * s, 0.26 * s, 0.03 * s), '#3a3f4a', 0.006 * s), ol(rect(-0.32 * s, -0.36 * s, 0.4 * s, 0.07 * s, 0.03 * s), '#3a3f4a', 0.006 * s));
  out.push(stroke(M(0.15 * s, -0.36 * s) + L(0.2 * s, -0.5 * s), '#3a3f4a', 0.02 * s), sh(ellipse(0.2 * s, -0.51 * s, 0.05 * s, 0.015 * s, -20), '#2b2b30'));
  out.push(sh(rect(-0.5 * s, -0.2 * s, 1.0 * s, 0.03 * s), roof));
  out.push(ol(rect(-0.46 * s, -0.92 * s, 0.78 * s, 0.07 * s, 0.03 * s), roof, 0.006 * s), sh(rect(-0.44 * s, -0.86 * s, 0.74 * s, 0.015 * s), shade(roof, -0.25)));
  for (const x of [-0.3 * s, 0.32 * s]) out.push(sh(circle(x, -0.1 * s, 0.11 * s), '#2b2b30'), sh(circle(x, -0.1 * s, 0.05 * s), '#c9ced4'));
  out.push(sh(circle(0.49 * s, -0.22 * s, 0.025 * s), '#f2cf3a'));
  return out;
}

/** Patio umbrella, origin at the finial top, canopy width w, pole length pole. */
export function umbrella(w: number, c1: string, c2: string, pole: number): Shape[] {
  const out: Shape[] = [sh(rect(-w * 0.012, 0, w * 0.024, pole), '#e8e2d4'), sh(rect(-w * 0.012, 0, w * 0.008, pole), '#ffffff', { opacity: 0.5 })];
  const panels = 6, h = w * 0.24;
  const edge = (t: number): Pt => [-w / 2 + w * t, h + Math.sin(t * Math.PI) * h * 0.12];
  for (let i = 0; i < panels; i++) {
    const a = edge(i / panels), b = edge((i + 1) / panels);
    const mid: Pt = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - h * 0.1];
    out.push(sh(M(0, 0) + L(a[0], a[1]) + Q(mid[0], mid[1] + h * 0.18, b[0], b[1]) + 'Z', i % 2 ? c1 : c2));
  }
  let val = '';
  for (let i = 0; i < panels; i++) { const a = edge(i / panels), b = edge((i + 1) / panels); val += M(a[0], a[1]) + Q((a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + h * 0.3, b[0], b[1]) + L(b[0], b[1] - h * 0.04) + L(a[0], a[1] - h * 0.04) + 'Z'; }
  out.push(sh(val, shade(c1, -0.12)));
  out.push(sh(circle(0, -w * 0.01, w * 0.022), '#e8e2d4'));
  return out;
}

/** Tall glass of iced tea, origin bottom centre, height h. */
export function icedTea(h: number, lemon = true): Shape[] {
  const w0 = 0.22 * h, w1 = 0.28 * h;
  const out: Shape[] = [
    stroke(M(0.05 * h, -0.82 * h) + L(0.18 * h, -1.2 * h), '#f2f2ee', 0.05 * h), stroke(M(0.05 * h, -0.82 * h) + L(0.18 * h, -1.2 * h), P.teal, 0.02 * h),
    sh(poly([[-w0, 0], [w0, 0], [w1, -0.95 * h], [-w1, -0.95 * h]]), '#e8f3f6', { opacity: 0.6 }),
    sh(poly([[-w0 + 0.01 * h, -0.03 * h], [w0 - 0.01 * h, -0.03 * h], [w1 - 0.02 * h, -0.8 * h], [-w1 + 0.02 * h, -0.8 * h]]), '#c27a2e'),
    sh(rect(-0.16 * h, -0.78 * h, 0.14 * h, 0.13 * h, 0.03 * h) + rect(0.02 * h, -0.7 * h, 0.14 * h, 0.13 * h, 0.03 * h) + rect(-0.1 * h, -0.58 * h, 0.13 * h, 0.12 * h, 0.03 * h), '#f2e6d6', { opacity: 0.6 }),
    stroke(poly([[-w0, 0], [w0, 0], [w1, -0.95 * h], [-w1, -0.95 * h]]), '#9ab8c2', 0.015 * h),
    hl(poly([[-w0 + 0.04 * h, -0.08 * h], [-w0 + 0.08 * h, -0.08 * h], [-w1 + 0.1 * h, -0.88 * h], [-w1 + 0.06 * h, -0.88 * h]]), 0.45),
  ];
  if (lemon) out.push(ol(sector(-w1 + 0.02 * h, -0.95 * h, 0.15 * h, 180, 360), '#f2d43a', 0.01 * h), sh(sector(-w1 + 0.02 * h, -0.95 * h, 0.11 * h, 180, 360), '#fbeea0'), sh(leaf(0.04 * h, -0.97 * h, 0.14 * h, 0.05 * h, -60), '#5f9a4c'));
  return out;
}

/** Glass pitcher of iced tea with lemon slices, origin bottom centre, height h. */
export function pitcher(h: number): Shape[] {
  const body = M(-0.3 * h, 0) + L(0.3 * h, 0) + Q(0.36 * h, -0.5 * h, 0.26 * h, -0.9 * h) + L(0.36 * h, -1.0 * h) + L(-0.28 * h, -1.0 * h) + Q(-0.36 * h, -0.5 * h, -0.3 * h, 0) + 'Z';
  return [
    stroke(M(0.3 * h, -0.82 * h) + Q(0.58 * h, -0.78 * h, 0.5 * h, -0.45 * h) + Q(0.45 * h, -0.3 * h, 0.32 * h, -0.28 * h), '#b8d4dc', 0.05 * h),
    sh(body, '#e8f3f6', { opacity: 0.55 }),
    sh(M(-0.29 * h, -0.04 * h) + L(0.29 * h, -0.04 * h) + Q(0.34 * h, -0.4 * h, 0.3 * h, -0.72 * h) + L(-0.31 * h, -0.72 * h) + Q(-0.34 * h, -0.4 * h, -0.29 * h, -0.04 * h) + 'Z', '#c27a2e'),
    ol(circle(-0.08 * h, -0.4 * h, 0.1 * h), '#f2d43a', 0.01 * h), sh(circle(-0.08 * h, -0.4 * h, 0.075 * h), '#fbeea0'),
    ol(circle(0.12 * h, -0.22 * h, 0.09 * h), '#f2d43a', 0.01 * h), sh(circle(0.12 * h, -0.22 * h, 0.065 * h), '#fbeea0'),
    sh(leaf(-0.05 * h, -0.66 * h, 0.16 * h, 0.05 * h, -30) + leaf(0.02 * h, -0.68 * h, 0.14 * h, 0.05 * h, -130), '#5f9a4c'),
    stroke(body, '#9ab8c2', 0.015 * h), hl(rect(-0.24 * h, -0.85 * h, 0.05 * h, 0.7 * h, 0.025 * h), 0.45),
  ];
}

/** Can of tennis balls, origin bottom centre, height h. */
export function tennisCan(h: number, col = '#2f6fb8'): Shape[] {
  return [
    ol(rect(-0.22 * h, -0.92 * h, 0.44 * h, 0.92 * h, 0.03 * h), col, h * 0.01),
    sh(rect(-0.22 * h, -0.62 * h, 0.44 * h, 0.3 * h), '#fbfbf8'),
    ...place(tennisBall(0.1 * h), { y: -0.47 * h }),
    ol(rect(-0.24 * h, -1.0 * h, 0.48 * h, 0.1 * h, 0.04 * h), '#d8dde2', h * 0.01),
    sh(rect(-0.22 * h, -0.12 * h, 0.44 * h, 0.04 * h), shade(col, 0.3)),
    hl(rect(-0.17 * h, -0.86 * h, 0.05 * h, 0.8 * h, 0.02 * h), 0.3),
  ];
}

/** Straw sun hat seen slightly from above, origin centre, width s. */
export function strawHat(s: number, band = P.navy): Shape[] {
  let weave = '';
  for (let i = 1; i <= 3; i++) weave += M(-0.5 * s + i * 0.06 * s, 0) + Q(0, 0.32 * s - i * 0.055 * s, 0.5 * s - i * 0.06 * s, 0);
  return [
    ol(ellipse(0, 0, 0.5 * s, 0.2 * s), '#e8cd8a', s * 0.01),
    stroke(weave, '#c9a85e', s * 0.008),
    ol(M(-0.25 * s, -0.02 * s) + Q(-0.26 * s, -0.32 * s, 0, -0.32 * s) + Q(0.26 * s, -0.32 * s, 0.25 * s, -0.02 * s) + Q(0, 0.05 * s, -0.25 * s, -0.02 * s) + 'Z', '#efd798', s * 0.01),
    sh(M(-0.25 * s, -0.05 * s) + Q(0, 0.02 * s, 0.25 * s, -0.05 * s) + L(0.255 * s, -0.12 * s) + Q(0, -0.05 * s, -0.255 * s, -0.12 * s) + 'Z', band),
    sh(petal(0.18 * s, -0.08 * s, 0.14 * s, 0.05 * s, 30), band),
  ];
}

/** Sun visor, origin centre, width s. */
export function visor(s: number, col = '#f4f1ea', brim = P.teal): Shape[] {
  return [
    ol(M(-0.45 * s, 0) + Q(-0.45 * s, -0.3 * s, 0, -0.3 * s) + Q(0.45 * s, -0.3 * s, 0.45 * s, 0) + L(0.38 * s, 0) + Q(0.38 * s, -0.22 * s, 0, -0.22 * s) + Q(-0.38 * s, -0.22 * s, -0.38 * s, 0) + 'Z', col, s * 0.012),
    ol(M(-0.42 * s, 0) + Q(0, 0.45 * s, 0.42 * s, 0) + Q(0, 0.12 * s, -0.42 * s, 0) + 'Z', brim, s * 0.012),
    sh(star(0, -0.25 * s, 0.05 * s, 0.02 * s), brim),
  ];
}

/** Golf glove, fingers up, origin at the cuff centre, height s. */
export function golfGlove(s: number, col = '#fbfbf8', tab = P.navy): Shape[] {
  const out: Shape[] = [];
  const fx = [-0.15, -0.05, 0.05, 0.15];
  fx.forEach((x, i) => out.push(ol(rect(x * s - 0.05 * s, (-0.95 + Math.abs(i - 1.5) * 0.06) * s, 0.1 * s, 0.5 * s, 0.05 * s), col, s * 0.012, -0.18)));
  out.push(ol(xf(rect(-0.05 * s, -0.32 * s, 0.1 * s, 0.32 * s, 0.05 * s), { rot: -45, x: -0.2 * s, y: -0.35 * s }), col, s * 0.012, -0.18));
  out.push(ol(rect(-0.22 * s, -0.55 * s, 0.44 * s, 0.45 * s, 0.12 * s), col, s * 0.012, -0.18));
  out.push(ol(rect(-0.2 * s, -0.14 * s, 0.4 * s, 0.14 * s, 0.03 * s), shade(col, -0.05), s * 0.01, -0.18));
  out.push(ol(rect(-0.05 * s, -0.36 * s, 0.24 * s, 0.14 * s, 0.05 * s), tab, s * 0.01));
  out.push(stroke(M(-0.1 * s, -0.5 * s) + L(-0.1 * s, -0.2 * s) + M(0.1 * s, -0.5 * s) + L(0.1 * s, -0.42 * s), '#d8d4c8', s * 0.012));
  return out;
}

/** Club sandwich halves on a plate, origin centre, width s. */
export function clubSandwich(s: number): Shape[] {
  const H = 0.42 * s, B = 0.2 * s;
  const tri = (x: number, rot: number) => {
    const t: Shape[] = [];
    const band = (y0: number, y1: number) => { const w0 = B * (1 - y0), w1 = B * (1 - y1); return poly([[-w0, -y0 * H], [w0, -y0 * H], [w1, -y1 * H], [-w1, -y1 * H]]); };
    t.push(ol(poly([[-B, 0], [B, 0], [0, -H]]), '#f2dcae', s * 0.008, -0.35));
    t.push(sh(band(0, 0.08) + band(0.4, 0.47), '#c9934e'));
    t.push(sh(band(0.12, 0.18), '#7fb04a'), sh(band(0.18, 0.25), '#d8452f'), sh(band(0.25, 0.34), '#f4c9b0'), sh(band(0.5, 0.58), '#b8503a'), sh(band(0.58, 0.64), '#9cc35a'));
    t.push(stroke(line([[0, -H - 0.12 * s], [0, -H * 0.5]]), '#d4b07a', s * 0.015), sh(circle(0, -H - 0.12 * s, 0.035 * s), '#5f8a3a'));
    return place(t, { x, rot });
  };
  return [ol(ellipse(0, 0.02 * s, 0.5 * s, 0.14 * s), '#fbfbf8', s * 0.008, -0.15), stroke(ellipse(0, 0.02 * s, 0.4 * s, 0.1 * s), '#6fa8c8', s * 0.01), ...tri(-0.17 * s, -6), ...tri(0.17 * s, 8)];
}

/** Mallard duck swimming, facing left, origin at the waterline centre, length s. */
export function duck(s: number): Shape[] {
  return [
    sh(ellipse(0, 0.02 * s, 0.6 * s, 0.06 * s), '#ffffff', { opacity: 0.35 }),
    ol(blob([[-0.4 * s, -0.1 * s], [-0.2 * s, -0.28 * s], [0.3 * s, -0.25 * s], [0.5 * s, -0.35 * s], [0.42 * s, -0.08 * s], [0.2 * s, 0], [-0.3 * s, 0]], 0.7), '#a88a6a', s * 0.012),
    sh(blob([[-0.15 * s, -0.18 * s], [0.15 * s, -0.24 * s], [0.38 * s, -0.22 * s], [0.2 * s, -0.08 * s], [-0.1 * s, -0.08 * s]], 0.7), '#8a6a4a'),
    sh(rect(-0.35 * s, -0.32 * s, 0.14 * s, 0.12 * s, 0.03 * s), '#f4f1ea'),
    ol(circle(-0.34 * s, -0.4 * s, 0.13 * s), '#2f7a4a', s * 0.012),
    sh(poly([[-0.45 * s, -0.42 * s], [-0.62 * s, -0.38 * s], [-0.46 * s, -0.35 * s]]), '#f0b63a'),
    sh(circle(-0.38 * s, -0.43 * s, 0.022 * s), '#1f1f24'),
  ];
}

/** Bunker rake lying at an angle, origin at the handle end, length len (along +x). */
export function rake(len: number): Shape[] {
  let teeth = '';
  for (let i = 0; i < 8; i++) teeth += rect(len * 0.97, -len * 0.14 + i * len * 0.04, len * 0.05, len * 0.012);
  return [sh(rect(0, -len * 0.012, len * 0.96, len * 0.024, len * 0.01), '#d4a26c'), ol(rect(len * 0.94, -len * 0.16, len * 0.04, len * 0.32, len * 0.01), '#3a3f4a', len * 0.004), sh(teeth, '#3a3f4a')];
}

/** Folded newspaper, origin centre, width s. */
export function newspaper(s: number): Shape[] {
  let lines = '';
  for (let i = 0; i < 7; i++) lines += line([[-0.4 * s, -0.05 * s + i * 0.05 * s], [-0.05 * s, -0.05 * s + i * 0.05 * s]]) + line([[0.05 * s, -0.05 * s + i * 0.05 * s], [0.4 * s, -0.05 * s + i * 0.05 * s]]);
  return [
    sh(poly([[-0.46 * s, -0.26 * s], [0.46 * s, -0.3 * s], [0.48 * s, 0.32 * s], [-0.44 * s, 0.34 * s]]), '#d8d4c8'),
    ol(rect(-0.45 * s, -0.28 * s, 0.9 * s, 0.6 * s, 0.01 * s), '#f2efe6', s * 0.008, -0.2),
    sh(rect(-0.4 * s, -0.22 * s, 0.8 * s, 0.08 * s), '#3a3a40'),
    sh(rect(0.05 * s, -0.1 * s, 0.35 * s, 0.15 * s), '#9ab0c4'),
    stroke(lines, '#9a9a9a', s * 0.012),
  ];
}

/** Golf flagstick with a flag, origin at the hole, height h. */
export function golfFlag(h: number, col = P.red, num = '9'): Shape[] {
  return [
    sh(ellipse(0, 0, 0.07 * h, 0.02 * h), '#1f2a1a'),
    stroke(line([[0, 0], [0, -h]]), '#f4f1ea', 0.02 * h),
    sh(M(0.01 * h, -h) + Q(0.25 * h, -0.98 * h, 0.42 * h, -0.9 * h) + Q(0.25 * h, -0.85 * h, 0.01 * h, -0.78 * h) + 'Z', col),
    sh(digits(num, 0.1 * h, -0.95 * h, 0.06 * h, 0.1 * h), '#fbfbf8'),
  ];
}

/** Round café table with cloth, origin at the floor under the pedestal, top width w. */
export function cafeTable(w: number, cloth: string, check?: string): Shape[] {
  const h = 0.62 * w;
  const out: Shape[] = [shadow(0, 0, w * 0.45, w * 0.06), sh(rect(-w * 0.03, -h, w * 0.06, h), '#3a3f4a'), sh(ellipse(0, -w * 0.01, w * 0.2, w * 0.035), '#3a3f4a')];
  out.push(sh(M(-w / 2, -h) + L(w / 2, -h) + L(w * 0.52, -h + w * 0.2) + Q(0, -h + w * 0.26, -w * 0.52, -h + w * 0.2) + 'Z', cloth));
  if (check) {
    let c = '';
    for (let i = 0; i < 8; i++) { const x = -w / 2 + (i + 0.25) * (w / 8); c += poly([[x, -h], [x + w / 16, -h], [x + w / 16 * 1.04, -h + w * 0.22], [x + w * 0.002, -h + w * 0.22]]); }
    out.push(sh(c, check, { opacity: 0.55 }));
  }
  out.push(sh(ellipse(0, -h, w / 2, w * 0.12), shade(cloth, 0.08)));
  return out;
}

/** Bistro chair seen from the front-ish, origin at the floor centre, height h. */
export function bistroChair(h: number, col = '#2f5a4a', seat = '#d4a26c'): Shape[] {
  const w = 0.5 * h;
  return [
    stroke(M(-w * 0.45, 0) + L(-w * 0.4, -0.5 * h) + M(w * 0.45, 0) + L(w * 0.4, -0.5 * h) + M(-w * 0.3, -0.04 * h) + L(-w * 0.32, -0.48 * h) + M(w * 0.3, -0.04 * h) + L(w * 0.32, -0.48 * h), col, 0.03 * h),
    stroke(M(-w * 0.44, -0.18 * h) + L(w * 0.44, -0.18 * h), col, 0.02 * h),
    stroke(M(-w * 0.4, -0.5 * h) + L(-w * 0.38, -h) + Q(0, -1.08 * h, w * 0.38, -h) + L(w * 0.4, -0.5 * h), col, 0.035 * h),
    stroke(M(-w * 0.38, -0.85 * h) + Q(0, -0.92 * h, w * 0.38, -0.85 * h) + M(-w * 0.38, -0.72 * h) + Q(0, -0.79 * h, w * 0.38, -0.72 * h), col, 0.025 * h),
    ol(ellipse(0, -0.5 * h, w * 0.48, 0.07 * h), seat, 0.01 * h),
  ];
}

/** Round tree canopy with a trunk, origin at the trunk base, height h. */
export function tree(h: number, col: string, seed: number): Shape[] {
  const g = rng(seed);
  let a = '', b = '', c = '';
  for (let i = 0; i < 14; i++) {
    const d = circle(g.range(-0.3, 0.3) * h, -h * 0.62 + g.range(-0.24, 0.2) * h, g.range(0.13, 0.2) * h);
    if (i % 3 === 0) a += d; else if (i % 3 === 1) b += d; else c += d;
  }
  return [sh(rect(-0.035 * h, -0.4 * h, 0.07 * h, 0.4 * h), '#6b4a32'), sh(a, shade(col, -0.12)), sh(b, col), sh(c, shade(col, 0.12))];
}

/** Flower box / planter with blooms, origin bottom-left, w × h box. */
export function flowerBox(w: number, h: number, box: string, cols: string[], seed: number): Shape[] {
  const g = rng(seed);
  let lv = '';
  const fl: string[] = cols.map(() => '');
  for (let i = 0; i < w / 6; i++) lv += leaf(g.range(0, w), -h, g.range(10, 18), 5, g.range(-160, -20));
  for (let i = 0; i < w / 9; i++) { const x = g.range(4, w - 4), y = -h - g.range(4, 20), r = g.range(3, 5.5); fl[g.int(0, cols.length - 1)] += circle(x, y, r); }
  return [sh(lv, '#4f8a3e'), ...fl.map((d, i) => sh(d, cols[i])).filter((p) => p.d), ol(rect(0, -h, w, h, 3), box, 1)];
}
