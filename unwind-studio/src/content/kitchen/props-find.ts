// Shared props for the Sunday Kitchen hidden-object scenes. Every prop is drawn
// around the origin and returns Shape[]; position it with place().
import { rect, ellipse, circle, poly, line, curve, blob, leaf, petal, star, sector, sh, stroke, shade, mix, rng, xf, type Rng } from '../../art/kit';
import type { Shape } from '../../art/types';

export type Pt = [number, number];
const n = (v: number) => String(Math.round(v * 10) / 10);
export const M = (x: number, y: number) => `M${n(x)} ${n(y)}`;
export const L = (x: number, y: number) => `L${n(x)} ${n(y)}`;
export const Q = (cx: number, cy: number, x: number, y: number) => `Q${n(cx)} ${n(cy)} ${n(x)} ${n(y)}`;
export const CB = (a: number, b: number, c: number, d: number, x: number, y: number) => `C${n(a)} ${n(b)} ${n(c)} ${n(d)} ${n(x)} ${n(y)}`;

/** Filled shape with a darker outline of the same hue. */
export const ol = (d: string, fill: string, w = 1, amt = -0.3): Shape => sh(d, fill, { stroke: shade(fill, amt), strokeWidth: w });
export const shadow = (cx: number, cy: number, rx: number, ry: number, op = 0.22): Shape => sh(ellipse(cx, cy, rx, ry), '#3b2a1c', { opacity: op });
const hl = (d: string, op = 0.55): Shape => sh(d, '#ffffff', { opacity: op });

export const P = {
  butter: '#f3d77a', butterLt: '#f9e8a8', tomato: '#d8452f', tomatoDk: '#a8301f', sage: '#9cb48a', sageDk: '#6f8a62', cream: '#f7efdc', creamDk: '#e8dcc0',
  wood: '#b98552', woodLt: '#d4a26c', woodDk: '#7a5232', cornflower: '#6f8fd6', cornflowerDk: '#4a68b0', steel: '#9aa2a8', steelDk: '#646c72', copper: '#c87a48',
};

// =====================================================================
// textures
// =====================================================================
/** Wooden boards with seams, grain and knots. */
export function planks(x: number, y: number, w: number, h: number, count: number, col: string, seed: number, vertical = false): Shape[] {
  const g = rng(seed);
  let lt = '', dk = '', seams = '', grain = '', knots = '';
  const size = (vertical ? w : h) / count;
  for (let i = 0; i < count; i++) {
    const a = (vertical ? x : y) + i * size;
    const r = vertical ? rect(a, y, size, h) : rect(x, a, w, size);
    const t = g.int(0, 2);
    if (t === 0) lt += r; else if (t === 1) dk += r;
    if (i) seams += vertical ? line([[a, y], [a, y + h]]) : line([[x, a], [x + w, a]]);
    const len = vertical ? h : w;
    for (let k = 0; k < 3; k++) {
      const off = size * (0.2 + 0.3 * k + g.range(-0.06, 0.06));
      const pts: Pt[] = [];
      for (let s = 0; s <= 6; s++) { const along = (len * s) / 6, wob = g.range(-size * 0.07, size * 0.07); pts.push(vertical ? [a + off + wob, y + along] : [x + along, a + off + wob]); }
      grain += curve(pts);
    }
    if (g.next() < 0.5) { const along = g.range(0.15, 0.85) * len, cx = vertical ? a + size * g.range(0.3, 0.7) : x + along, cy = vertical ? y + along : a + size * g.range(0.3, 0.7); knots += ellipse(cx, cy, vertical ? size * 0.09 : size * 0.22, vertical ? size * 0.22 : size * 0.09); }
  }
  return [sh(rect(x, y, w, h), col), sh(lt, shade(col, 0.07)), sh(dk, shade(col, -0.07)), stroke(grain, shade(col, -0.2), 0.8, { opacity: 0.55 }), stroke(knots, shade(col, -0.32), 1.1), stroke(seams, shade(col, -0.4), 1.6)].filter((p) => p.d);
}

/** Square tiles in mixed tones, grout lines and an optional little motif in each tile. */
export function tiles(x: number, y: number, w: number, h: number, s: number, cols: string[], grout: string, seed: number, motif?: string): Shape[] {
  const g = rng(seed);
  const byCol: string[] = cols.map(() => '');
  let mot = '', gl = '';
  for (let ty = y; ty < y + h - 0.5; ty += s) for (let tx = x; tx < x + w - 0.5; tx += s) {
    const tw = Math.min(s, x + w - tx), th = Math.min(s, y + h - ty);
    byCol[g.int(0, cols.length - 1)] += rect(tx, ty, tw, th);
    if (motif && tw > s * 0.8 && th > s * 0.8) { const cx = tx + s / 2, cy = ty + s / 2; for (let k = 0; k < 4; k++) mot += petal(cx, cy, s * 0.3, s * 0.11, 45 + k * 90); mot += circle(tx, ty, s * 0.09); }
  }
  for (let ty = y + s; ty < y + h; ty += s) gl += line([[x, ty], [x + w, ty]]);
  for (let tx = x + s; tx < x + w; tx += s) gl += line([[tx, y], [tx, y + h]]);
  const out = byCol.map((d, i) => sh(d, cols[i])).filter((p) => p.d);
  if (motif) out.push(sh(mot, motif, { opacity: 0.85 }));
  out.push(stroke(gl, grout, 1.2));
  return out;
}

/** Perspective checker floor between y0 and y1, converging to (vx, vy). */
export function floor(y0: number, y1: number, W: number, vx: number, vy: number, cols: number, a: string, b: string, seed: number): Shape[] {
  const ys: number[] = [y0];
  let d = y0 - vy;
  while (ys[ys.length - 1] < y1) { d *= 1.22; ys.push(Math.min(y1 + 40, vy + d)); }
  const xAt = (bx: number, y: number) => vx + ((bx - vx) * (y - vy)) / (y1 - vy);
  const span = W * 2.4, x0 = W / 2 - span / 2;
  let da = '', db = '';
  for (let r = 0; r < ys.length - 1; r++) for (let c = 0; c < cols; c++) {
    const b0 = x0 + (span * c) / cols, b1 = x0 + (span * (c + 1)) / cols;
    const q = poly([[xAt(b0, ys[r]), ys[r]], [xAt(b1, ys[r]), ys[r]], [xAt(b1, ys[r + 1]), ys[r + 1]], [xAt(b0, ys[r + 1]), ys[r + 1]]]);
    if ((r + c) % 2) da += q; else db += q;
  }
  const g = rng(seed);
  let spk = '', spk2 = '';
  for (let i = 0; i < 160; i++) { const yy = g.range(y0 + 4, y1), xx = g.range(0, W), rr = g.range(0.8, 2.2) * ((yy - vy) / (y1 - vy)) * 1.6; if (i % 2) spk += circle(xx, yy, rr); else spk2 += circle(xx, yy, rr); }
  return [sh(rect(0, y0, W, y1 - y0), a), sh(da, a), sh(db, b), sh(spk, shade(b, -0.2), { opacity: 0.35 }), sh(spk2, shade(a, 0.2), { opacity: 0.4 }), sh(rect(0, y0, W, 18), '#3b2a1c', { opacity: 0.12 })];
}

/** Gingham cloth rectangle. */
export function gingham(x: number, y: number, w: number, h: number, s: number, base: string, col: string): Shape[] {
  let v = '', hz = '';
  for (let tx = x; tx < x + w; tx += s * 2) v += rect(tx, y, Math.min(s, x + w - tx), h);
  for (let ty = y; ty < y + h; ty += s * 2) hz += rect(x, ty, w, Math.min(s, y + h - ty));
  return [sh(rect(x, y, w, h), base), sh(v, col, { opacity: 0.45 }), sh(hz, col, { opacity: 0.45 })];
}

/** Sprig wallpaper: little leaf pairs and dots in a half-drop grid. */
export function wallpaper(x: number, y: number, w: number, h: number, s: number, base: string, col: string, dot: string, seed: number): Shape[] {
  const g = rng(seed);
  let lv = '', dt = '', st = '';
  for (let r = 0, ty = y + s / 2; ty < y + h; ty += s, r++) for (let tx = x + (r % 2 ? s / 2 : 0); tx < x + w + s / 2; tx += s) {
    const a = g.range(-20, 20);
    st += line([[tx, ty + s * 0.18], [tx, ty - s * 0.16]]);
    lv += leaf(tx, ty, s * 0.2, s * 0.07, -60 + a) + leaf(tx, ty, s * 0.2, s * 0.07, -120 + a) + leaf(tx, ty + s * 0.1, s * 0.16, s * 0.06, -20 + a);
    dt += circle(tx + s / 2, ty + s * 0.02, s * 0.045);
  }
  return [sh(rect(x, y, w, h), base), stroke(st, col, 1, { opacity: 0.7 }), sh(lv, col, { opacity: 0.8 }), sh(dt, dot, { opacity: 0.8 })];
}

/** Vertical stripes. */
export function stripes(x: number, y: number, w: number, h: number, s: number, base: string, col: string): Shape[] {
  let d = '', d2 = '';
  for (let tx = x; tx < x + w; tx += s * 2) { d += rect(tx, y, Math.min(s, x + w - tx), h); d2 += rect(tx + s * 1.4, y, s * 0.2, h); }
  return [sh(rect(x, y, w, h), base), sh(d, col), sh(d2, col, { opacity: 0.6 })];
}

/** Scalloped paper shelf edging hanging down from y. */
export function edging(x: number, y: number, w: number, s: number, col: string, dot: string): Shape[] {
  let d = M(x, y), dots = '';
  for (let tx = x; tx < x + w - 0.5; tx += s) { const e = Math.min(tx + s, x + w); d += L(tx, y + s * 0.35) + Q((tx + e) / 2, y + s * 0.95, e, y + s * 0.35); dots += circle((tx + e) / 2, y + s * 0.42, s * 0.1); }
  d += L(x + w, y) + 'Z';
  return [sh(d, col), sh(dots, dot)];
}

// =====================================================================
// crockery and cookware
// =====================================================================
/** Decorated plate seen face-on, centred on the origin. pat 0..3 selects the pattern. */
export function plate(r: number, base: string, accent: string, pat: number): Shape[] {
  const out: Shape[] = [ol(circle(0, 0, r), base, 1, -0.25), sh(circle(0, 0, r * 0.66), shade(base, -0.04)), stroke(circle(0, 0, r * 0.66), shade(base, -0.18), 0.9)];
  let d = '';
  if (pat === 0) { for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2; d += circle(Math.cos(a) * r * 0.83, Math.sin(a) * r * 0.83, r * 0.065); } out.push(sh(d, accent), sh(circle(0, 0, r * 0.18), accent, { opacity: 0.7 })); }
  else if (pat === 1) { out.push(stroke(circle(0, 0, r * 0.84), accent, r * 0.11), stroke(circle(0, 0, r * 0.84), shade(base, 0.4), r * 0.025)); for (let i = 0; i < 5; i++) d += petal(0, 0, r * 0.4, r * 0.15, i * 72 - 90); out.push(sh(d, accent, { opacity: 0.85 }), sh(circle(0, 0, r * 0.1), '#f3d77a')); }
  else if (pat === 2) {
    let lv = '';
    for (let i = 0; i < 6; i++) { const a = i * 60; d += petal(0, 0, r * 0.32, r * 0.13, a); lv += leaf(0, 0, r * 0.5, r * 0.1, a + 30); }
    for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; d += circle(Math.cos(a) * r * 0.84, Math.sin(a) * r * 0.84, r * 0.1); }
    out.push(sh(lv, '#7f9f6a'), sh(d, accent), sh(circle(0, 0, r * 0.08), '#f3d77a'));
  } else {
    for (let i = 0; i < 16; i++) { const a = (i * 22.5 * Math.PI) / 180; d += poly([[Math.cos(a) * r * 0.74, Math.sin(a) * r * 0.74], [Math.cos(a + 0.2) * r * 0.95, Math.sin(a + 0.2) * r * 0.95], [Math.cos(a + 0.39) * r * 0.74, Math.sin(a + 0.39) * r * 0.74]]); }
    out.push(sh(d, accent), stroke(circle(0, 0, r * 0.4) + circle(0, 0, r * 0.26), accent, r * 0.04));
  }
  out.push(hl(ellipse(-r * 0.42, -r * 0.5, r * 0.26, r * 0.09, -40), 0.45));
  return out;
}
/** Bowl, origin at bottom centre. */
export function bowl(w: number, h: number, col: string, band: string): Shape[] {
  const body = M(-w / 2, -h) + Q(-w * 0.48, 0, 0, 0) + Q(w * 0.48, 0, w / 2, -h) + 'Z';
  return [ol(body, col, 1), sh(M(-w * 0.47, -h * 0.72) + Q(0, -h * 0.5, w * 0.47, -h * 0.72) + L(w * 0.44, -h * 0.55) + Q(0, -h * 0.33, -w * 0.44, -h * 0.55) + 'Z', band), ol(ellipse(0, -h, w / 2, h * 0.16), shade(col, -0.12), 1), sh(rect(-w * 0.18, -h * 0.04, w * 0.36, h * 0.06, 2), shade(col, -0.2)), hl(ellipse(-w * 0.28, -h * 0.5, w * 0.06, h * 0.2, 20), 0.35)];
}
/** Straight mug, origin bottom centre. */
export function mug(s: number, col: string, band: string): Shape[] {
  return [stroke(M(s * 0.3, -s * 0.72) + Q(s * 0.62, -s * 0.66, s * 0.5, -s * 0.38) + Q(s * 0.44, -s * 0.22, s * 0.3, -s * 0.24), shade(col, -0.25), s * 0.11), ol(rect(-s * 0.36, -s * 0.86, s * 0.72, s * 0.86, s * 0.07), col, 1), sh(rect(-s * 0.36, -s * 0.6, s * 0.72, s * 0.16), band), ol(ellipse(0, -s * 0.86, s * 0.36, s * 0.07), shade(col, -0.2), 0.8), hl(rect(-s * 0.28, -s * 0.8, s * 0.08, s * 0.7, 2), 0.3)];
}
/** Jug with spout and handle, origin bottom centre. */
export function jug(h: number, col: string, accent: string): Shape[] {
  const w = h * 0.7;
  const body = M(-w * 0.32, -h) + L(w * 0.3, -h) + Q(w * 0.26, -h * 0.75, w * 0.48, -h * 0.45) + Q(w * 0.56, -h * 0.05, w * 0.32, 0) + L(-w * 0.32, 0) + Q(-w * 0.56, -h * 0.05, -w * 0.48, -h * 0.45) + Q(-w * 0.26, -h * 0.75, -w * 0.32, -h) + 'Z';
  let dots = '';
  for (let i = 0; i < 5; i++) dots += circle(-w * 0.32 + i * w * 0.16, -h * 0.4, h * 0.035);
  return [
    stroke(M(w * 0.32, -h * 0.82) + Q(w * 0.82, -h * 0.8, w * 0.62, -h * 0.4) + Q(w * 0.52, -h * 0.2, w * 0.42, -h * 0.2), shade(col, -0.22), h * 0.07),
    ol(body, col, 1), sh(poly([[-w * 0.36, -h * 0.98], [-w * 0.56, -h * 1.06], [-w * 0.28, -h * 0.88]]), col), ol(ellipse(w * 0.0, -h, w * 0.33, h * 0.05), shade(col, -0.15), 0.8),
    sh(dots, accent), sh(M(-w * 0.47, -h * 0.28) + Q(0, -h * 0.2, w * 0.47, -h * 0.28) + L(w * 0.46, -h * 0.22) + Q(0, -h * 0.14, -w * 0.46, -h * 0.22) + 'Z', accent), hl(ellipse(-w * 0.24, -h * 0.55, w * 0.06, h * 0.18, 10), 0.35),
  ];
}
/** Cooking pot with lid, origin bottom centre. */
export function cookPot(w: number, h: number, col: string, lidCol = col): Shape[] {
  return [
    sh(rect(-w * 0.62, -h * 0.82, w * 0.16, h * 0.1, 3) + rect(w * 0.46, -h * 0.82, w * 0.16, h * 0.1, 3), shade(col, -0.35)),
    ol(rect(-w / 2, -h * 0.9, w, h * 0.9, w * 0.08), col, 1.2), sh(rect(w * 0.18, -h * 0.9, w * 0.32, h * 0.9, w * 0.08), shade(col, -0.14)), hl(rect(-w * 0.4, -h * 0.82, w * 0.08, h * 0.7, 3), 0.3),
    ol(M(-w * 0.53, -h * 0.9) + Q(0, -h * 1.22, w * 0.53, -h * 0.9) + 'Z', lidCol, 1.2), sh(rect(-w * 0.09, -h * 1.17, w * 0.18, h * 0.1, 3), '#3b2f2a'),
    sh(rect(-w * 0.5, -h * 0.2, w, h * 0.06), shade(col, -0.22)),
  ];
}
/** Kettle, origin bottom centre. */
export function kettle(s: number, col: string): Shape[] {
  const body = M(-s * 0.42, 0) + Q(-s * 0.52, -s * 0.5, -s * 0.22, -s * 0.66) + L(s * 0.22, -s * 0.66) + Q(s * 0.52, -s * 0.5, s * 0.42, 0) + 'Z';
  return [
    ol(M(s * 0.34, -s * 0.3) + Q(s * 0.56, -s * 0.4, s * 0.72, -s * 0.66) + L(s * 0.76, -s * 0.62) + Q(s * 0.62, -s * 0.28, s * 0.38, -s * 0.12) + 'Z', col, 1),
    stroke(M(-s * 0.26, -s * 0.66) + Q(-s * 0.28, -s * 1.02, 0, -s * 1.02) + Q(s * 0.28, -s * 1.02, s * 0.26, -s * 0.66), '#3b2f2a', s * 0.07),
    ol(body, col, 1.2), ol(ellipse(0, -s * 0.66, s * 0.22, s * 0.05), shade(col, -0.15), 0.8), sh(circle(0, -s * 0.72, s * 0.06), '#3b2f2a'), hl(ellipse(-s * 0.22, -s * 0.36, s * 0.07, s * 0.18, 20), 0.4),
  ];
}
/** Frying pan hanging from its handle, origin at the hanging hole. */
export function fryingPan(r: number, col: string): Shape[] {
  return [ol(rect(-r * 0.09, 0, r * 0.18, r * 1.3, r * 0.08), '#3b2f2a', 1), sh(circle(0, r * 0.1, r * 0.05), '#f4ecd8'), ol(circle(0, r * 2.2, r), col, 1.4), sh(circle(0, r * 2.2, r * 0.82), shade(col, -0.22)), hl(ellipse(-r * 0.4, r * 1.85, r * 0.25, r * 0.08, -40), 0.3)];
}
/** Colander hanging by a loop, origin at the loop. */
export function colander(r: number, col: string): Shape[] {
  let holes = '';
  for (let i = 0; i < 4; i++) for (let k = 0; k < 6 - i; k++) holes += circle(-r * 0.66 + (i * r * 0.16) + k * r * 0.27, r * 0.6 + i * r * 0.22, r * 0.045);
  return [stroke(circle(0, 0, r * 0.12), P.steelDk, 2), ol(M(-r, r * 0.3) + L(r, r * 0.3) + Q(r * 0.9, r * 1.4, 0, r * 1.4) + Q(-r * 0.9, r * 1.4, -r, r * 0.3) + 'Z', col, 1.2), sh(rect(-r * 1.06, r * 0.22, r * 2.12, r * 0.14, 3), shade(col, 0.2)), sh(holes, shade(col, -0.45))];
}
/** Hanging spatula / masher / fork utensils. kind 0 spatula, 1 masher, 2 fork, 3 slotted spoon. Origin top. */
export function utensil(l: number, kind: number, head = P.steel, handle = '#3b2f2a'): Shape[] {
  const out: Shape[] = [stroke(circle(0, l * 0.03, l * 0.025), P.steelDk, 1.4), ol(rect(-l * 0.035, l * 0.06, l * 0.07, l * 0.36, l * 0.03), handle, 1), sh(rect(-l * 0.014, l * 0.42, l * 0.028, l * 0.24), head)];
  if (kind === 0) out.push(ol(rect(-l * 0.09, l * 0.64, l * 0.18, l * 0.34, l * 0.03), head, 1), stroke(line([[-l * 0.04, l * 0.7], [-l * 0.04, l * 0.92]]) + line([[0, l * 0.7], [0, l * 0.92]]) + line([[l * 0.04, l * 0.7], [l * 0.04, l * 0.92]]), shade(head, -0.4), 1.4));
  else if (kind === 1) out.push(stroke(M(-l * 0.1, l * 0.98) + L(-l * 0.06, l * 0.86) + L(-l * 0.02, l * 0.98) + L(l * 0.02, l * 0.86) + L(l * 0.06, l * 0.98) + L(l * 0.1, l * 0.86), head, l * 0.025), stroke(line([[-l * 0.1, l * 0.86], [0, l * 0.66], [l * 0.1, l * 0.86]]), head, l * 0.02));
  else if (kind === 2) out.push(stroke(line([[0, l * 0.64], [0, l * 0.74]]) + M(-l * 0.07, l * 0.98) + L(-l * 0.07, l * 0.78) + Q(-l * 0.07, l * 0.72, 0, l * 0.72) + Q(l * 0.07, l * 0.72, l * 0.07, l * 0.78) + L(l * 0.07, l * 0.98) + line([[0, l * 0.74], [0, l * 0.98]]), head, l * 0.022));
  else out.push(ol(ellipse(0, l * 0.82, l * 0.1, l * 0.17), head, 1), sh(circle(0, l * 0.74, l * 0.018) + circle(0, l * 0.82, l * 0.018) + circle(0, l * 0.9, l * 0.018) + circle(-l * 0.045, l * 0.78, l * 0.016) + circle(l * 0.045, l * 0.78, l * 0.016), shade(head, -0.45)));
  return out;
}
/** Striped tea towel hanging over a rail, origin at the rail centre. */
export function teaTowel(w: number, h: number, col: string, stripe: string): Shape[] {
  return [ol(rect(-w / 2, -4, w, h, 3), col, 1, -0.15), sh(rect(-w / 2, h * 0.62, w, h * 0.07) + rect(-w / 2, h * 0.75, w, h * 0.04) + rect(-w / 2, h * 0.12, w, h * 0.04), stripe), stroke(line([[-w * 0.3, 4], [-w * 0.28, h - 4]]) + line([[w * 0.2, 4], [w * 0.22, h - 4]]), shade(col, -0.12), 2, { opacity: 0.5 }), stroke(line([[-w / 2, h - 2], [w / 2, h - 2]]), stripe, 3)];
}

// =====================================================================
// storage
// =====================================================================
/** Preserve jar, origin bottom centre. cover: 0 cloth cap, 1 metal lid, 2 cork. */
export function jar(w: number, h: number, content: string, cover: number, coverCol: string, label = true): Shape[] {
  const out: Shape[] = [sh(rect(-w / 2, -h, w, h, w * 0.18), '#dfeaea', { opacity: 0.9 }), sh(rect(-w / 2 + 2, -h * 0.86, w - 4, h * 0.84, w * 0.15), content), sh(rect(-w / 2 + 2, -h * 0.86, w * 0.3, h * 0.84, w * 0.12), shade(content, 0.18)), sh(rect(w * 0.18, -h * 0.86, w * 0.3 - 2, h * 0.84, w * 0.12), shade(content, -0.18))];
  if (label) out.push(ol(rect(-w * 0.34, -h * 0.56, w * 0.68, h * 0.3, 2), '#fbf3df', 0.7, -0.25), stroke(line([[-w * 0.22, -h * 0.44], [w * 0.22, -h * 0.44]]) + line([[-w * 0.14, -h * 0.35], [w * 0.14, -h * 0.35]]), '#9a8a70', 1));
  out.push(hl(rect(-w * 0.4, -h * 0.84, w * 0.08, h * 0.7, 2), 0.45), sh(rect(-w * 0.44, -h * 1.04, w * 0.88, h * 0.1, 2), '#cfdcdc'));
  if (cover === 0) out.push(ol(M(-w * 0.56, -h * 0.9) + Q(-w * 0.6, -h * 1.12, 0, -h * 1.12) + Q(w * 0.6, -h * 1.12, w * 0.56, -h * 0.9) + Q(w * 0.3, -h * 0.84, w * 0.1, -h * 0.92) + Q(-w * 0.2, -h * 0.84, -w * 0.56, -h * 0.9) + 'Z', coverCol, 0.8), stroke(line([[-w * 0.46, -h * 0.97], [w * 0.46, -h * 0.97]]), '#7a5a35', 1.6), sh(circle(-w * 0.2, -h * 1.04, w * 0.05) + circle(w * 0.12, -h * 1.06, w * 0.05) + circle(w * 0.36, -h * 0.98, w * 0.05), '#ffffff', { opacity: 0.8 }));
  else if (cover === 1) out.push(ol(rect(-w * 0.48, -h * 1.12, w * 0.96, h * 0.14, 3), coverCol, 0.8), stroke(line([[-w * 0.4, -h * 1.05], [w * 0.4, -h * 1.05]]), shade(coverCol, -0.3), 0.8));
  else out.push(ol(rect(-w * 0.3, -h * 1.16, w * 0.6, h * 0.16, 2), '#c99a6a', 0.8));
  return out;
}
/** Food tin with bands, origin bottom centre. */
export function tin(w: number, h: number, col: string, band: string): Shape[] {
  return [ol(rect(-w / 2, -h, w, h, 2), col, 1), sh(rect(-w / 2, -h * 0.68, w, h * 0.36), band), sh(rect(w * 0.2, -h, w * 0.3, h, 2), '#000000', { opacity: 0.12 }), ol(circle(0, -h * 0.5, Math.min(w, h) * 0.16), '#fbf3df', 0.6), stroke(line([[-w / 2, -h * 0.94], [w / 2, -h * 0.94]]) + line([[-w / 2, -h * 0.06], [w / 2, -h * 0.06]]), shade(col, -0.35), 1), hl(rect(-w * 0.38, -h * 0.9, w * 0.07, h * 0.8), 0.3), ol(ellipse(0, -h, w / 2, w * 0.1), shade(col, 0.15), 0.8)];
}
/** Small spice jar, origin bottom centre. */
export function spiceJar(w: number, h: number, content: string, lid: string): Shape[] {
  return [sh(rect(-w / 2, -h, w, h, 3), '#e6eeee'), sh(rect(-w / 2 + 1.5, -h * 0.75, w - 3, h * 0.73, 2), content), sh(rect(-w * 0.32, -h * 0.55, w * 0.64, h * 0.26), '#fbf3df'), hl(rect(-w * 0.38, -h * 0.9, w * 0.12, h * 0.8), 0.45), ol(rect(-w * 0.52, -h * 1.2, w * 1.04, h * 0.26, 2), lid, 0.7)];
}
/** Bottle, origin bottom centre. */
export function bottle(w: number, h: number, col: string, cap: string): Shape[] {
  const body = M(-w / 2, 0) + L(-w / 2, -h * 0.6) + Q(-w / 2, -h * 0.74, -w * 0.18, -h * 0.8) + L(-w * 0.16, -h * 0.96) + L(w * 0.16, -h * 0.96) + L(w * 0.18, -h * 0.8) + Q(w / 2, -h * 0.74, w / 2, -h * 0.6) + L(w / 2, 0) + 'Z';
  return [ol(body, col, 1), sh(rect(w * 0.12, -h * 0.6, w * 0.34, h * 0.58), '#000000', { opacity: 0.15 }), ol(rect(-w * 0.38, -h * 0.46, w * 0.76, h * 0.26, 2), '#fbf3df', 0.7, -0.25), hl(rect(-w * 0.38, -h * 0.66, w * 0.1, h * 0.6, 2), 0.4), ol(rect(-w * 0.2, -h * 1.04, w * 0.4, h * 0.1, 2), cap, 0.7)];
}
/** Woven basket, origin at the rim centre (contents sit above y=0). */
export function basket(w: number, h: number, col = '#c99a5b', handle = false): Shape[] {
  const body = poly([[-w / 2, 0], [w / 2, 0], [w * 0.4, h], [-w * 0.4, h]]);
  let weave = '', ribs = '';
  for (let i = 1; i < 6; i++) { const y = (h * i) / 6, hw = w / 2 - (w * 0.1 * i) / 6; weave += line([[-hw, y], [hw, y]]); }
  for (let i = 0; i <= 12; i++) { const t = i / 12; ribs += line([[-w / 2 + w * t, 0], [-w * 0.4 + w * 0.8 * t, h]]); }
  const out: Shape[] = [shadow(0, h, w * 0.46, h * 0.1), sh(body, col), sh(poly([[w * 0.18, 0], [w / 2, 0], [w * 0.4, h], [w * 0.16, h]]), shade(col, -0.16)), stroke(ribs, shade(col, -0.32), 1.3), stroke(weave, shade(col, 0.25), 2.4, { opacity: 0.8 }), sh(rect(-w / 2 - 4, -5, w + 8, 11, 5), shade(col, 0.12)), stroke(line([[-w / 2 - 2, 1], [w / 2 + 2, 1]]), shade(col, -0.3), 1.2)];
  return out;
}
/** Basket handle arch, drawn behind contents. Origin at rim centre. */
export const basketHandle = (w: number, h: number, col = '#c99a5b'): Shape[] => [stroke(M(-w * 0.42, 0) + Q(-w * 0.42, -h, 0, -h) + Q(w * 0.42, -h, w * 0.42, 0), shade(col, -0.2), 7), stroke(M(-w * 0.42, 0) + Q(-w * 0.42, -h, 0, -h) + Q(w * 0.42, -h, w * 0.42, 0), shade(col, 0.15), 3)];
/** Flour sack, origin bottom centre. */
export function sack(w: number, h: number, col: string, band = '#6f8fd6'): Shape[] {
  const body = blob([[-w * 0.46, 0], [-w * 0.52, -h * 0.4], [-w * 0.38, -h * 0.82], [-w * 0.14, -h * 0.9], [0, -h * 0.86], [w * 0.16, -h * 0.9], [w * 0.4, -h * 0.82], [w * 0.52, -h * 0.4], [w * 0.46, 0]], 0.8);
  let tex = '';
  for (let i = 1; i < 7; i++) tex += curve([[-w * 0.46, -h * 0.12 * i], [0, -h * 0.12 * i + 5], [w * 0.46, -h * 0.12 * i]]);
  return [
    shadow(w * 0.06, 0, w * 0.56, h * 0.07), sh(body, col), sh(blob([[w * 0.14, -4], [w * 0.2, -h * 0.5], [w * 0.16, -h * 0.84], [w * 0.4, -h * 0.8], [w * 0.5, -h * 0.4], [w * 0.44, -4]], 0.8), shade(col, -0.12)),
    stroke(tex, shade(col, -0.16), 0.9, { opacity: 0.8 }), sh(rect(-w * 0.47, -h * 0.52, w * 0.94, h * 0.08) + rect(-w * 0.48, -h * 0.38, w * 0.96, h * 0.04), band, { opacity: 0.85 }),
    ol(ellipse(0, -h * 0.25, w * 0.16, h * 0.08), '#fbf3df', 0.6, -0.2), sh(ellipse(-w * 0.03, -h * 0.25, w * 0.07, h * 0.035), band, { opacity: 0.6 }),
    sh(blob([[-w * 0.2, -h * 0.86], [-w * 0.28, -h * 1.02], [0, -h * 0.96], [w * 0.28, -h * 1.04], [w * 0.2, -h * 0.86], [0, -h * 0.82]], 0.8), shade(col, 0.08)), stroke(line([[-w * 0.2, -h * 0.87], [w * 0.2, -h * 0.87]]), '#7a5a35', 3),
  ];
}
/** Wooden crate front, origin top centre. */
export function crate(w: number, h: number, col: string): Shape[] {
  return [sh(rect(-w / 2, 0, w, h), col), sh(rect(-w / 2, h * 0.34, w, h * 0.04) + rect(-w / 2, h * 0.68, w, h * 0.04), shade(col, -0.3)), sh(rect(-w / 2, 0, w * 0.07, h) + rect(w / 2 - w * 0.07, 0, w * 0.07, h), shade(col, -0.16)), sh(rect(-w / 2, 0, w, h * 0.08), shade(col, 0.2)), stroke(line([[-w * 0.3, h * 0.12], [w * 0.2, h * 0.14]]) + line([[-w * 0.1, h * 0.5], [w * 0.35, h * 0.52]]) + line([[-w * 0.36, h * 0.84], [w * 0.1, h * 0.86]]), shade(col, -0.2), 0.8)];
}

// =====================================================================
// produce
// =====================================================================
export type Veg = 'onion' | 'redonion' | 'whiteonion' | 'potato' | 'tomato' | 'apple' | 'greenapple' | 'plum' | 'orange' | 'egg' | 'brownegg' | 'pepper' | 'beet' | 'radish';
export function veg(x: number, y: number, r: number, kind: Veg, g: Rng): Shape[] {
  const rot = g.range(-30, 30);
  const onion = (c: string): Shape[] => [ol(xf(blob([[0, -r * 1.15], [r * 0.5, -r * 0.7], [r, -r * 0.05], [r * 0.7, r * 0.75], [0, r * 0.95], [-r * 0.7, r * 0.75], [-r, -r * 0.05], [-r * 0.5, -r * 0.7]], 0.9), { rot, x, y }), c, 1, -0.3), stroke(xf(curve([[0, -r * 1.05], [-r * 0.45, -r * 0.1], [-r * 0.2, r * 0.85]]) + curve([[0, -r * 1.05], [r * 0.45, -r * 0.1], [r * 0.2, r * 0.85]]), { rot, x, y }), shade(c, -0.25), 1), hl(xf(ellipse(-r * 0.4, -r * 0.3, r * 0.14, r * 0.3, 20), { rot, x, y }), 0.35), stroke(xf(line([[0, -r * 1.1], [r * 0.08, -r * 1.4]]), { rot, x, y }), shade(c, -0.35), 1.6)];
  switch (kind) {
    case 'onion': return onion(g.pick(['#c98a3c', '#d39a4c', '#bf7f34']));
    case 'redonion': return onion(g.pick(['#8a3550', '#7d2f4a', '#96405c']));
    case 'whiteonion': return onion(g.pick(['#efe4c8', '#e8dcbc']));
    case 'potato': {
      const c = g.pick(['#c9a46a', '#bf9a5e', '#d2ae76']);
      const pts: Pt[] = []; for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; pts.push([Math.cos(a) * r * 1.2 * g.range(0.85, 1.05), Math.sin(a) * r * 0.86 * g.range(0.85, 1.05)]); }
      return [ol(xf(blob(pts), { rot, x, y }), c, 1, -0.3), sh(xf(circle(-r * 0.4, -r * 0.2, r * 0.07) + circle(r * 0.3, r * 0.25, r * 0.06) + circle(r * 0.5, -r * 0.3, r * 0.05), { rot, x, y }), shade(c, -0.35)), hl(xf(ellipse(-r * 0.3, -r * 0.4, r * 0.3, r * 0.12), { rot, x, y }), 0.3)];
    }
    case 'tomato': { const c = g.pick(['#d8452f', '#c8322a', '#e05238']); return [ol(circle(x, y, r), c, 1, -0.28), hl(ellipse(x - r * 0.36, y - r * 0.36, r * 0.3, r * 0.18, -30), 0.5), sh(star(x + r * 0.05, y - r * 0.6, r * 0.42, r * 0.14, 5, rot), '#4f7a3f')]; }
    case 'apple': case 'greenapple': {
      const c = kind === 'apple' ? g.pick(['#c8322a', '#d8452f', '#b8302a']) : g.pick(['#9cc05a', '#a9c766', '#8fb24e']);
      return [ol(blob([[x, y - r * 0.7], [x + r * 0.7, y - r * 0.9], [x + r, y - r * 0.1], [x + r * 0.7, y + r * 0.8], [x, y + r * 0.9], [x - r * 0.7, y + r * 0.8], [x - r, y - r * 0.1], [x - r * 0.7, y - r * 0.9]], 0.9), c, 1, -0.3), hl(ellipse(x - r * 0.45, y - r * 0.3, r * 0.16, r * 0.3, 20), 0.4), stroke(line([[x, y - r * 0.7], [x + r * 0.15, y - r * 1.1]]), '#5a3a22', 1.8)];
    }
    case 'plum': { const c = g.pick(['#6b3f86', '#7a4a96', '#59347a']); return [ol(ellipse(x, y, r * 0.92, r, rot), c, 1, -0.3), stroke(xf(curve([[0, -r], [r * 0.25, 0], [0, r]]), { rot, x, y }), shade(c, -0.3), 1), hl(ellipse(x - r * 0.35, y - r * 0.38, r * 0.26, r * 0.14, -30), 0.4)]; }
    case 'orange': { const c = g.pick(['#f08a2b', '#ee7d22', '#f39a3a']); return [ol(circle(x, y, r), c, 1, -0.26), hl(ellipse(x - r * 0.35, y - r * 0.38, r * 0.34, r * 0.2, -30), 0.4), sh(circle(x + r * 0.2, y + r * 0.1, r * 0.09), '#b85a14')]; }
    case 'egg': case 'brownegg': {
      const c = kind === 'egg' ? g.pick(['#f7f0e2', '#f3ead8']) : g.pick(['#e0b78a', '#d9ab7a', '#e6c296']);
      return [ol(xf(eggPath(r), { rot: rot * 1.5, x, y }), c, 1, -0.25), hl(xf(ellipse(-r * 0.3, -r * 0.45, r * 0.18, r * 0.3, 20), { rot: rot * 1.5, x, y }), 0.6)];
    }
    case 'pepper': { const c = g.pick(['#d8362c', '#f2b92e', '#5c9a45']); return [ol(xf(blob([[-r * 0.8, -r * 0.8], [0, -r * 0.6], [r * 0.8, -r * 0.8], [r * 0.9, r * 0.2], [r * 0.4, r * 1.1], [-r * 0.4, r * 1.1], [-r * 0.9, r * 0.2]], 0.9), { rot, x, y }), c, 1, -0.28), hl(xf(ellipse(-r * 0.4, -r * 0.1, r * 0.16, r * 0.5), { rot, x, y }), 0.4), sh(xf(rect(-r * 0.14, -r * 1.15, r * 0.28, r * 0.5, 2), { rot, x, y }), '#3f6b34')]; }
    case 'beet': { const c = '#7d2240'; return [ol(xf(blob([[0, -r], [r * 0.9, -r * 0.4], [r * 0.7, r * 0.6], [0, r * 1.3], [-r * 0.7, r * 0.6], [-r * 0.9, -r * 0.4]]), { rot, x, y }), c, 1, -0.3), sh(xf(leaf(0, -r, r * 1.2, r * 0.3, -70) + leaf(0, -r, r * 1.1, r * 0.3, -110), { rot, x, y }), '#5c8a45'), hl(xf(ellipse(-r * 0.35, -r * 0.2, r * 0.14, r * 0.3), { rot, x, y }), 0.3)]; }
    default: { const c = '#d8456a'; return [ol(circle(x, y, r), c, 1, -0.3), sh(xf(leaf(0, -r * 0.8, r * 1.4, r * 0.3, -75) + leaf(0, -r * 0.8, r * 1.3, r * 0.3, -110), { rot, x, y }), '#5c8a45'), sh(ellipse(x, y + r * 0.7, r * 0.3, r * 0.3), '#f7e9ee'), hl(ellipse(x - r * 0.35, y - r * 0.35, r * 0.25, r * 0.14, -30), 0.4)]; }
  }
}
/** Heap of produce sitting on a line of width w; origin at centre of that line. */
export function pile(w: number, r: number, kinds: Veg[], seed: number, rows = 3): Shape[] {
  const g = rng(seed), out: Shape[] = [];
  for (let row = rows - 1; row >= 0; row--) {
    const span = w - r * 1.2 - row * r * 1.5, cnt = Math.max(1, Math.round(span / (r * 1.85)));
    for (let i = 0; i < cnt; i++) {
      const x = cnt === 1 ? 0 : -span / 2 + (span * i) / (cnt - 1);
      out.push(...veg(x + g.range(-r * 0.15, r * 0.15), -r * 0.45 - row * r * 1.25 + g.range(-r * 0.12, r * 0.12), r * g.range(0.9, 1.06), g.pick(kinds), g));
    }
  }
  return out;
}
/** Leek lying diagonally, origin at root end. */
export function leek(l: number): Shape[] {
  return [sh(leaf(l * 0.55, -l * 0.02, l * 0.5, l * 0.07, -8) + leaf(l * 0.55, l * 0.02, l * 0.48, l * 0.06, 8), '#4f7a3f'), sh(leaf(l * 0.6, 0, l * 0.4, l * 0.05, 0), '#6f9a52'), ol(rect(0, -l * 0.05, l * 0.62, l * 0.1, l * 0.04), '#eef0d8', 0.8, -0.2), sh(rect(l * 0.36, -l * 0.05, l * 0.26, l * 0.1, l * 0.03), '#b8d08a'), stroke(line([[0, -l * 0.04], [-l * 0.06, -l * 0.07]]) + line([[0, 0], [-l * 0.07, 0.5]]) + line([[0, l * 0.04], [-l * 0.06, l * 0.07]]), '#c9b58a', 1.2)];
}
/** Cabbage, origin centre. */
export function cabbage(r: number, seed: number): Shape[] {
  const g = rng(seed), out: Shape[] = [ol(circle(0, 0, r), '#8fb25c', 1, -0.3)];
  let v = '';
  for (let i = 0; i < 7; i++) { const a = g.range(0, 360); out.push(sh(xf(petal(0, 0, r * 1.02, r * 0.55, a), {}), i % 2 ? '#9fc06a' : '#7fa24e', { opacity: 0.9 })); }
  for (let i = 0; i < 6; i++) v += curve([[0, 0], [Math.cos(i) * r * 0.5, Math.sin(i) * r * 0.5 + 2], [Math.cos(i) * r * 0.9, Math.sin(i) * r * 0.9]]);
  out.push(stroke(v, '#d8e8b0', 1.3), sh(circle(0, 0, r * 0.35), '#b8d08a'));
  return out;
}
/** Bunch of green herbs in a little terracotta pot, origin bottom centre. */
export function herbPot(s: number, seed: number, col = '#c9673f'): Shape[] {
  const g = rng(seed);
  let a = '', b = '';
  for (let i = 0; i < 16; i++) { const d = leaf(g.range(-s * 0.3, s * 0.3), -s * 0.9, s * g.range(0.35, 0.6), s * 0.1, g.range(-160, -20)); if (i % 2) a += d; else b += d; }
  return [sh(a, '#5c8f4f'), sh(b, '#7fb069'), sh(poly([[-s * 0.45, -s * 0.9], [s * 0.45, -s * 0.9], [s * 0.34, 0], [-s * 0.34, 0]]), col), sh(poly([[s * 0.1, -s * 0.9], [s * 0.45, -s * 0.9], [s * 0.34, 0], [s * 0.08, 0]]), shade(col, -0.18)), sh(rect(-s * 0.52, -s * 1.02, s * 1.04, s * 0.18, 2), shade(col, 0.15))];
}
/** Flowers in a little vase, origin bottom centre. */
export function flowerVase(s: number, seed: number, vase: string, cols: string[]): Shape[] {
  const g = rng(seed), out: Shape[] = [];
  let stems = '', lv = '';
  const heads: [number, number, string][] = [];
  for (let i = 0; i < 9; i++) { const x = g.range(-s * 0.55, s * 0.55), y = -s * g.range(0.85, 1.4); stems += curve([[0, -s * 0.4], [x * 0.5, (y - s * 0.4) / 2], [x, y]]); lv += leaf(x * 0.6, y * 0.75, s * 0.2, s * 0.06, g.range(-160, -20)); heads.push([x, y, g.pick(cols)]); }
  out.push(stroke(stems, '#5c8a45', 1.4), sh(lv, '#6f9a52'));
  for (const [x, y, c] of heads) { let d = ''; for (let k = 0; k < 5; k++) d += petal(x, y, s * 0.13, s * 0.07, k * 72 + g.range(0, 70)); out.push(sh(d, c), sh(circle(x, y, s * 0.04), '#f3c94a')); }
  out.push(ol(M(-s * 0.16, -s * 0.5) + L(s * 0.16, -s * 0.5) + Q(s * 0.38, -s * 0.2, s * 0.24, 0) + L(-s * 0.24, 0) + Q(-s * 0.38, -s * 0.2, -s * 0.16, -s * 0.5) + 'Z', vase, 1), hl(ellipse(-s * 0.14, -s * 0.22, s * 0.04, s * 0.12), 0.35));
  return out;
}
/** Wall clock, origin centre. */
export function clock(r: number, col: string): Shape[] {
  let ticks = '';
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; ticks += line([[Math.cos(a) * r * 0.7, Math.sin(a) * r * 0.7], [Math.cos(a) * r * 0.82, Math.sin(a) * r * 0.82]]); }
  return [ol(circle(0, 0, r), col, 1.4), sh(circle(0, 0, r * 0.86), '#fbf6e8'), stroke(ticks, '#3b2f2a', 1.6), stroke(line([[0, 0], [0, -r * 0.6]]) + line([[0, 0], [r * 0.4, r * 0.12]]), '#3b2f2a', 2.2), sh(circle(0, 0, r * 0.06), '#3b2f2a')];
}

// =====================================================================
// bakery goods
// =====================================================================
export function baguette(l: number, col = '#d9a050'): Shape[] {
  let cuts = '';
  for (let i = 0; i < 5; i++) cuts += M(-l * 0.36 + i * l * 0.17, l * 0.02) + Q(-l * 0.3 + i * l * 0.17, -l * 0.07, -l * 0.24 + i * l * 0.17, -l * 0.03);
  return [ol(xf(ellipse(0, 0, l / 2, l * 0.075), {}), col, 1, -0.3), sh(ellipse(0, l * 0.03, l * 0.48, l * 0.035), shade(col, -0.14)), stroke(cuts, '#f4dca0', l * 0.018), stroke(cuts, shade(col, -0.3), l * 0.006)];
}
export function bloomer(w: number, col = '#c98a42'): Shape[] {
  let cuts = '';
  for (let i = 0; i < 4; i++) cuts += curve([[-w * 0.32 + i * w * 0.2, -w * 0.36], [-w * 0.27 + i * w * 0.2, -w * 0.2], [-w * 0.32 + i * w * 0.2, -w * 0.04]]);
  return [shadow(0, 0, w * 0.5, w * 0.05), ol(M(-w / 2, 0) + Q(-w * 0.56, -w * 0.42, -w * 0.2, -w * 0.44) + L(w * 0.2, -w * 0.44) + Q(w * 0.56, -w * 0.42, w / 2, 0) + 'Z', col, 1, -0.3), sh(M(-w * 0.4, -w * 0.06) + Q(0, -w * 0.5, w * 0.4, -w * 0.06) + Q(0, -w * 0.38, -w * 0.4, -w * 0.06) + 'Z', shade(col, 0.15)), stroke(cuts, '#f2d59a', w * 0.035), stroke(cuts, shade(col, -0.25), w * 0.01)];
}
export function cob(r: number, col = '#b97a3a'): Shape[] {
  return [shadow(0, 0, r, r * 0.12), ol(M(-r, 0) + Q(-r * 1.05, -r * 1.2, 0, -r * 1.2) + Q(r * 1.05, -r * 1.2, r, 0) + 'Z', col, 1, -0.3), hl(ellipse(-r * 0.4, -r * 0.8, r * 0.3, r * 0.14, -25), 0.25), stroke(line([[-r * 0.5, -r * 0.95], [r * 0.5, -r * 0.35]]) + line([[r * 0.5, -r * 0.95], [-r * 0.5, -r * 0.35]]), '#f2d59a', r * 0.08), sh(circle(-r * 0.6, -r * 0.4, r * 0.04) + circle(r * 0.3, -r * 0.2, r * 0.04) + circle(-r * 0.1, -r * 0.9, r * 0.04), '#f6ead0')];
}
export function plait(w: number, col = '#d08a3a'): Shape[] {
  const out: Shape[] = [shadow(0, 0, w * 0.5, w * 0.05)];
  for (let i = 0; i < 6; i++) { const x = -w * 0.4 + i * w * 0.16, sz = w * (0.13 - Math.abs(i - 2.5) * 0.012); out.push(ol(ellipse(x, -w * 0.13 - (i % 2) * w * 0.05, sz, sz * 0.78, i % 2 ? 35 : -35), col, 1, -0.32), hl(ellipse(x - sz * 0.3, -w * 0.16 - (i % 2) * w * 0.05, sz * 0.4, sz * 0.18, i % 2 ? 35 : -35), 0.3)); }
  out.push(sh(circle(-w * 0.2, -w * 0.2, w * 0.012) + circle(w * 0.1, -w * 0.24, w * 0.012) + circle(w * 0.25, -w * 0.15, w * 0.012), '#f6ead0'));
  return out;
}
export function bun(r: number, col = '#d9a060', top = '#fbf3df'): Shape[] {
  return [ol(M(-r, 0) + Q(-r, -r * 0.95, 0, -r * 0.95) + Q(r, -r * 0.95, r, 0) + 'Z', col, 1, -0.3), sh(M(-r * 0.86, -r * 0.42) + Q(-r * 0.7, -r * 1.02, 0, -r * 0.98) + Q(r * 0.7, -r * 1.02, r * 0.86, -r * 0.42) + Q(r * 0.4, -r * 0.3, 0, -r * 0.5) + Q(-r * 0.4, -r * 0.3, -r * 0.86, -r * 0.42) + 'Z', top)];
}
/** Fruit tart seen from slightly above, origin centre. */
export function tart(r: number, fruit: string, seed: number): Shape[] {
  const g = rng(seed);
  let fr = '';
  for (let i = 0; i < 9; i++) fr += circle(g.range(-r * 0.55, r * 0.55), g.range(-r * 0.22, r * 0.18), r * 0.16);
  return [ol(ellipse(0, r * 0.12, r, r * 0.42), '#d9a050', 1), sh(ellipse(0, 0, r * 0.84, r * 0.32), '#f3e3b8'), sh(fr, fruit), hl(ellipse(-r * 0.3, -r * 0.08, r * 0.2, r * 0.05), 0.5), stroke(M(-r, r * 0.12) + Q(0, r * 0.66, r, r * 0.12), shade('#d9a050', -0.25), 1.4)];
}
export function eclair(l: number): Shape[] {
  return [ol(rect(-l / 2, -l * 0.22, l, l * 0.24, l * 0.12), '#dca45a', 1), ol(rect(-l * 0.47, -l * 0.26, l * 0.94, l * 0.12, l * 0.06), '#5a3420', 0.8), hl(rect(-l * 0.36, -l * 0.24, l * 0.4, l * 0.03, 2), 0.35)];
}
export function danish(r: number): Shape[] {
  let sw = M(0, 0);
  for (let i = 1; i < 18; i++) { const a = i * 0.55, rr = r * 0.05 * i; sw += L(Math.cos(a) * rr, Math.sin(a) * rr * 0.55); }
  return [ol(ellipse(0, 0, r, r * 0.6), '#d9984a', 1), stroke(sw, '#f2d59a', r * 0.13), stroke(sw, '#b8742e', r * 0.03), sh(ellipse(0, 0, r * 0.22, r * 0.14), '#c8322a')];
}
/** Round iced cake, origin bottom centre. */
export function cake(w: number, h: number, sponge: string, icing: string, deco: string): Shape[] {
  let drips = M(-w / 2, -h * 0.8);
  for (let i = 0; i < 8; i++) { const x0 = -w / 2 + (w * i) / 8, x1 = x0 + w / 8; drips += Q(x0 + w / 32, -h * (0.5 + (i % 3) * 0.08), (x0 + x1) / 2, -h * 0.62) + Q(x1 - w / 32, -h * 0.8, x1, -h * 0.8); }
  drips += L(w / 2, -h) + L(-w / 2, -h) + 'Z';
  let berries = '';
  for (let i = 0; i < 5; i++) berries += circle(-w * 0.32 + i * w * 0.16, -h * 1.02, w * 0.05);
  return [ol(rect(-w / 2, -h, w, h, 3), sponge, 1), stroke(line([[-w / 2, -h * 0.35], [w / 2, -h * 0.35]]), '#c8322a', h * 0.06), stroke(line([[-w / 2, -h * 0.42], [w / 2, -h * 0.42]]), '#fbf3df', h * 0.05), sh(drips, icing), ol(ellipse(0, -h, w / 2, w * 0.1), icing, 0.8, -0.12), sh(berries, deco), hl(ellipse(-w * 0.2, -h * 1.02, w * 0.12, w * 0.025), 0.5)];
}
/** Cake stand, origin at foot centre; plate top is at y = -h. */
export function cakeStand(w: number, h: number, col: string): Shape[] {
  return [sh(ellipse(0, 0, w * 0.26, w * 0.05), shade(col, -0.15)), sh(poly([[-w * 0.05, -h], [w * 0.05, -h], [w * 0.08, -2], [-w * 0.08, -2]]), col), ol(ellipse(0, -h, w / 2, w * 0.07), col, 1, -0.2), sh(ellipse(0, -h + w * 0.03, w * 0.5, w * 0.04), shade(col, -0.2))];
}
export function biscuit(r: number, col = '#d9a860', iced?: string): Shape[] {
  const out = [ol(circle(0, 0, r), col, 1, -0.3), sh(circle(-r * 0.4, -r * 0.2, r * 0.08) + circle(r * 0.3, r * 0.3, r * 0.08) + circle(r * 0.2, -r * 0.4, r * 0.08) + circle(-r * 0.2, r * 0.4, r * 0.08), shade(col, -0.32))];
  if (iced) out.push(sh(circle(0, 0, r * 0.62), iced));
  return out;
}
/** Glass biscuit barrel with a domed lid, origin bottom centre. Contents drawn by caller between back and front. */
export function biscuitJarBack(w: number, h: number): Shape[] {
  return [sh(rect(-w / 2, -h, w, h, w * 0.12), '#e6f0f0', { opacity: 0.85 }), sh(rect(w * 0.2, -h, w * 0.3, h, w * 0.1), '#c8dada', { opacity: 0.7 })];
}
export function biscuitJarFront(w: number, h: number, knob: string): Shape[] {
  return [stroke(rect(-w / 2, -h, w, h, w * 0.12), '#a9c0c4', 1.4), hl(rect(-w * 0.42, -h * 0.9, w * 0.06, h * 0.8, 2), 0.6), ol(M(-w * 0.54, -h) + Q(-w * 0.5, -h - w * 0.32, 0, -h - w * 0.34) + Q(w * 0.5, -h - w * 0.32, w * 0.54, -h) + 'Z', '#dfeaea', 1, -0.25), ol(circle(0, -h - w * 0.36, w * 0.08), knob, 0.8)];
}

// =====================================================================
// target objects (each recognisable on its own)
// =====================================================================
/** Balloon whisk hanging from its loop; origin at the loop, length h downwards. */
export function whisk(h: number): Shape[] {
  const hw = h * 0.05, top = h * 0.44, w = h * 0.24;
  let wires = '';
  for (const k of [0.3, 0.58, 0.82, 1]) { const wk = w * k; wires += M(-hw * 0.7, top) + CB(-wk * 1.15, h * 0.6, -wk, h * 0.97, 0, h) + CB(wk, h * 0.97, wk * 1.15, h * 0.6, hw * 0.7, top); }
  return [stroke(circle(0, h * 0.03, h * 0.03), P.steelDk, 1.6), ol(rect(-hw, h * 0.06, hw * 2, h * 0.33, hw), '#c98f55', 1, -0.35), sh(rect(-hw * 0.55, h * 0.08, hw * 0.5, h * 0.28, 1), '#e8bd86'), ol(rect(-hw * 1.15, h * 0.37, hw * 2.3, h * 0.07, 2), '#b9c0c4', 0.8), stroke(wires, '#5f676d', 2.4), stroke(wires, '#d6dcdf', 0.9)];
}
/** Rolling pin, horizontal, origin centre. */
export function rollingPin(w: number): Shape[] {
  const bw = w * 0.62, bh = w * 0.15, hlw = (w - bw) / 2;
  let grain = '';
  for (let i = 0; i < 3; i++) grain += curve([[-bw * 0.45, -bh * 0.25 + i * bh * 0.22], [-bw * 0.1, -bh * 0.2 + i * bh * 0.25], [bw * 0.2, -bh * 0.28 + i * bh * 0.22], [bw * 0.45, -bh * 0.22 + i * bh * 0.22]]);
  return [ol(rect(-w / 2, -bh * 0.22, hlw + 4, bh * 0.44, bh * 0.2), '#b87a44', 1, -0.35), ol(rect(w / 2 - hlw - 4, -bh * 0.22, hlw + 4, bh * 0.44, bh * 0.2), '#b87a44', 1, -0.35), ol(rect(-bw / 2, -bh / 2, bw, bh, bh * 0.25), '#e2b277', 1.2, -0.38), stroke(grain, '#c08a50', 0.9), sh(rect(-bw / 2 + 4, -bh * 0.4, bw - 8, bh * 0.18, 3), '#f6d8a8', { opacity: 0.8 }), sh(rect(-bw / 2 - 3, -bh * 0.3, 4, bh * 0.6, 1) + rect(bw / 2 - 1, -bh * 0.3, 4, bh * 0.6, 1), '#9a6438')];
}
/** Oven glove hanging by its loop, fingers down. Origin at the loop. */
export function ovenGlove(h: number, col = '#d8452f'): Shape[] {
  const w = h * 0.58;
  const body = blob([[-w * 0.42, h * 0.27], [w * 0.42, h * 0.27], [w * 0.5, h * 0.6], [w * 0.38, h * 0.92], [0, h], [-w * 0.38, h * 0.9], [-w * 0.46, h * 0.62]], 0.85);
  const thumb = blob([[-w * 0.36, h * 0.42], [-w * 0.72, h * 0.52], [-w * 0.84, h * 0.72], [-w * 0.66, h * 0.8], [-w * 0.42, h * 0.68]], 0.85);
  let dots = '';
  for (let i = 0; i < 4; i++) for (let k = 0; k < 3; k++) dots += circle(-w * 0.24 + k * w * 0.24 + (i % 2) * w * 0.12, h * 0.4 + i * h * 0.13, h * 0.03);
  return [stroke(M(-h * 0.06, h * 0.1) + Q(0, -h * 0.05, h * 0.06, h * 0.1), '#7a5232', 2.2), ol(thumb, col, 1.2), ol(body, col, 1.2), sh(dots, '#fbf3df'), stroke(curve([[-w * 0.36, h * 0.66], [-w * 0.42, h * 0.5], [-w * 0.34, h * 0.4]]), shade(col, -0.3), 1.2), ...gingham(-w * 0.44, h * 0.08, w * 0.88, h * 0.2, h * 0.04, '#fbf3df', col), stroke(rect(-w * 0.44, h * 0.08, w * 0.88, h * 0.2), shade(col, -0.3), 1)];
}
/** Teacup on its saucer, origin at saucer bottom. */
export function teacup(s: number, col = P.cornflower): Shape[] {
  let fl = '';
  for (const [x, y] of [[-0.2, -0.36], [0.12, -0.42], [0.02, -0.22]] as Pt[]) for (let k = 0; k < 5; k++) fl += petal(x * s, y * s, s * 0.07, s * 0.035, k * 72);
  return [ol(ellipse(0, -s * 0.07, s * 0.62, s * 0.1), shade(col, 0.55), 1, -0.3), stroke(ellipse(0, -s * 0.07, s * 0.5, s * 0.07), col, 1.2), stroke(ellipse(s * 0.5, -s * 0.4, s * 0.12, s * 0.14), shade(col, -0.2), s * 0.06), ol(M(-s * 0.46, -s * 0.6) + Q(-s * 0.42, -s * 0.1, 0, -s * 0.1) + Q(s * 0.42, -s * 0.1, s * 0.46, -s * 0.6) + 'Z', col, 1), sh(fl, '#fbf6e8'), ol(ellipse(0, -s * 0.6, s * 0.46, s * 0.08), '#fbf6e8', 0.8, -0.25), sh(ellipse(0, -s * 0.59, s * 0.38, s * 0.055), '#a8673a')];
}
/** Ladle hanging from its hole; origin at hole, length h downwards. */
export function ladle(h: number): Shape[] {
  const r = h * 0.17;
  return [stroke(M(0, 0) + Q(h * 0.02, h * 0.4, 0, h * 0.74), '#7a8288', h * 0.06), stroke(M(0, 0) + Q(h * 0.02, h * 0.4, 0, h * 0.74), '#c9d0d5', h * 0.02), sh(circle(0, h * 0.04, h * 0.018), '#f7efdc'), ol(sector(0, h * 0.76, r, 0, 180), '#aeb6bb', 1.2, -0.4), ol(ellipse(0, h * 0.76, r, r * 0.25), '#7a8288', 1, -0.3), hl(ellipse(-r * 0.5, h * 0.76 + r * 0.45, r * 0.2, r * 0.12, 30), 0.5)];
}
export const eggPath = (r: number) => M(0, -r * 1.15) + CB(r * 0.5, -r * 1.15, r * 0.85, -r * 0.45, r * 0.85, r * 0.1) + CB(r * 0.85, r * 0.65, r * 0.45, r, 0, r) + CB(-r * 0.45, r, -r * 0.85, r * 0.65, -r * 0.85, r * 0.1) + CB(-r * 0.85, -r * 0.45, -r * 0.5, -r * 1.15, 0, -r * 1.15) + 'Z';
export function egg(r: number, col = '#ecd4ae'): Shape[] {
  return [ol(eggPath(r), col, 1.2, -0.3), hl(ellipse(-r * 0.3, -r * 0.45, r * 0.18, r * 0.32, 20), 0.7), sh(circle(r * 0.3, r * 0.2, r * 0.04) + circle(r * 0.1, r * 0.5, r * 0.035) + circle(-r * 0.2, r * 0.1, r * 0.03), shade(col, -0.2))];
}
export function cherries(s: number): Shape[] {
  return [stroke(curve([[-s * 0.28, s * 0.15], [-s * 0.18, -s * 0.3], [s * 0.05, -s * 0.62]]) + curve([[s * 0.28, s * 0.22], [s * 0.22, -s * 0.22], [s * 0.05, -s * 0.62]]), '#5a7a3a', s * 0.04), sh(leaf(s * 0.05, -s * 0.62, s * 0.36, s * 0.12, -20), '#6f9a52'), stroke(line([[s * 0.08, -s * 0.62], [s * 0.36, -s * 0.66]]), '#4f7a3f', 1), ol(circle(-s * 0.28, s * 0.28, s * 0.22), '#b8202e', 1), ol(circle(s * 0.28, s * 0.35, s * 0.22), '#c8283a', 1), hl(ellipse(-s * 0.35, s * 0.2, s * 0.07, s * 0.04, -30), 0.7), hl(ellipse(s * 0.21, s * 0.27, s * 0.07, s * 0.04, -30), 0.7)];
}
/** Sitting cat seen side-on, origin at its feet. */
export function sittingCat(s: number, col = '#e39a52'): Shape[] {
  const dk = shade(col, -0.25);
  let str = '';
  for (let i = 0; i < 4; i++) str += curve([[-s * 0.3 + i * s * 0.1, -s * 0.62 + i * s * 0.05], [-s * 0.22 + i * s * 0.12, -s * 0.5], [-s * 0.26 + i * s * 0.12, -s * 0.36]]);
  return [
    shadow(0, 0, s * 0.45, s * 0.06),
    stroke(M(s * 0.22, -s * 0.06) + Q(s * 0.62, -s * 0.06, s * 0.58, -s * 0.4) + Q(s * 0.56, -s * 0.56, s * 0.46, -s * 0.58), col, s * 0.1), stroke(M(s * 0.5, -s * 0.5) + Q(s * 0.5, -s * 0.56, s * 0.46, -s * 0.58), dk, s * 0.1),
    ol(blob([[-s * 0.3, 0], [-s * 0.36, -s * 0.36], [-s * 0.2, -s * 0.72], [s * 0.06, -s * 0.78], [s * 0.24, -s * 0.56], [s * 0.32, -s * 0.22], [s * 0.26, 0]], 0.9), col, 1.2, -0.25),
    stroke(str, dk, s * 0.035), ol(ellipse(-s * 0.08, -s * 0.04, s * 0.1, s * 0.05) + ellipse(s * 0.12, -s * 0.04, s * 0.1, s * 0.05), shade(col, 0.15), 0.8),
    ol(poly([[-s * 0.16, -s * 1.02], [-s * 0.14, -s * 1.24], [s * 0.0, -s * 1.08]]), col, 1, -0.25), ol(poly([[s * 0.06, -s * 1.08], [s * 0.18, -s * 1.24], [s * 0.2, -s * 1.0]]), col, 1, -0.25),
    sh(poly([[-s * 0.13, -s * 1.06], [-s * 0.12, -s * 1.17], [-s * 0.04, -s * 1.08]]) + poly([[s * 0.09, -s * 1.08], [s * 0.16, -s * 1.17], [s * 0.17, -s * 1.04]]), '#f6c9b0'),
    ol(circle(s * 0.02, -s * 0.9, s * 0.2), col, 1.2, -0.25), sh(ellipse(s * 0.02, -s * 0.82, s * 0.1, s * 0.07), '#fbead0'),
    stroke(curve([[-s * 0.1, -s * 0.94], [-s * 0.06, -s * 0.91], [-s * 0.02, -s * 0.94]]) + curve([[s * 0.06, -s * 0.94], [s * 0.1, -s * 0.91], [s * 0.14, -s * 0.94]]), '#3b2a1c', s * 0.022),
    sh(poly([[s * 0.0, -s * 0.85], [s * 0.04, -s * 0.85], [s * 0.02, -s * 0.82]]), '#d9736a'), stroke(line([[-s * 0.04, -s * 0.82], [-s * 0.26, -s * 0.85]]) + line([[-s * 0.04, -s * 0.8], [-s * 0.25, -s * 0.76]]) + line([[s * 0.08, -s * 0.82], [s * 0.3, -s * 0.85]]) + line([[s * 0.08, -s * 0.8], [s * 0.29, -s * 0.76]]), '#fbf1dc', 0.9),
  ];
}
export function lemon(r: number): Shape[] {
  return [ol(ellipse(0, 0, r * 1.2, r * 0.86), '#f6d23c', 1.2, -0.28), sh(ellipse(-r * 0.35, -r * 0.3, r * 0.4, r * 0.18, -10), '#fff3a6', { opacity: 0.85 }), sh(ellipse(r * 1.18, 0, r * 0.13, r * 0.15), '#c9a52c'), sh(leaf(-r * 1.0, -r * 0.3, r * 0.9, r * 0.3, -150), '#5c8f4f')];
}
/** Old brass key, horizontal, origin centre. */
export function key(s: number, col = '#c9a24a'): Shape[] {
  return [stroke(circle(-s * 0.33, 0, s * 0.15), col, s * 0.075), stroke(circle(-s * 0.33, 0, s * 0.15), shade(col, 0.35), s * 0.02), ol(rect(-s * 0.2, -s * 0.04, s * 0.68, s * 0.08, 2), col, 0.8), ol(rect(s * 0.32, s * 0.02, s * 0.07, s * 0.16) + rect(s * 0.42, s * 0.02, s * 0.06, s * 0.12), col, 0.8), sh(rect(-s * 0.18, -s * 0.07, s * 0.05, s * 0.14, 1), shade(col, -0.2))];
}
/** Glass salt shaker, origin bottom centre. */
export function saltShaker(h: number): Shape[] {
  let holes = '';
  for (const [x, y] of [[-0.1, -0.93], [0, -0.95], [0.1, -0.93], [-0.05, -0.88], [0.05, -0.88]] as Pt[]) holes += circle(x * h, y * h, h * 0.018);
  return [shadow(0, 0, h * 0.3, h * 0.04), sh(M(-h * 0.24, 0) + L(-h * 0.2, -h * 0.76) + L(h * 0.2, -h * 0.76) + L(h * 0.24, 0) + 'Z', '#e4eef0'), sh(M(-h * 0.235, -h * 0.02) + L(-h * 0.215, -h * 0.4) + L(h * 0.215, -h * 0.4) + L(h * 0.235, -h * 0.02) + 'Z', '#ffffff'), stroke(M(-h * 0.24, 0) + L(-h * 0.2, -h * 0.76) + L(h * 0.2, -h * 0.76) + L(h * 0.24, 0) + 'Z' + line([[-h * 0.08, -h * 0.05], [-h * 0.07, -h * 0.72]]) + line([[h * 0.08, -h * 0.05], [h * 0.07, -h * 0.72]]), '#8fa3a8', 1.2), hl(rect(-h * 0.17, -h * 0.7, h * 0.05, h * 0.62), 0.8), ol(M(-h * 0.22, -h * 0.76) + L(-h * 0.22, -h * 0.84) + Q(-h * 0.2, -h * 1.0, 0, -h * 1.0) + Q(h * 0.2, -h * 1.0, h * 0.22, -h * 0.84) + L(h * 0.22, -h * 0.76) + 'Z', '#c9d0d5', 1, -0.35), sh(holes, '#4a5258'), sh(rect(-h * 0.23, -h * 0.8, h * 0.46, h * 0.04), '#8a9298')];
}
/** Open scissors, origin at the pivot. */
export function scissors(s: number, col = '#d8452f'): Shape[] {
  const half = (rot: number): Shape[] => [
    sh(xf(poly([[0, -s * 0.05], [s * 0.66, -s * 0.008], [s * 0.66, s * 0.012], [0, s * 0.045]]), { rot }), '#c9d0d5', { stroke: '#6e767c', strokeWidth: 1 }),
    sh(xf(rect(-s * 0.2, -s * 0.03, s * 0.22, s * 0.06), { rot }), col), stroke(xf(ellipse(-s * 0.34, 0, s * 0.15, s * 0.1), { rot }), col, s * 0.055),
  ];
  return [...half(-42), ...half(-14), sh(circle(0, 0, s * 0.04), '#4a5258')];
}
/** Carrot with fronds, origin at the top (frond end). */
export function carrot(l: number): Shape[] {
  return [sh(leaf(0, 0, l * 0.36, l * 0.06, 200) + leaf(0, 0, l * 0.4, l * 0.07, 170) + leaf(0, 0, l * 0.32, l * 0.05, 230), '#5c9a45'), sh(leaf(0, 0, l * 0.3, l * 0.05, 185), '#7fb85a'), ol(blob([[0, -l * 0.11], [l * 0.5, -l * 0.06], [l, 0], [l * 0.5, l * 0.07], [0, l * 0.11], [-l * 0.03, 0]], 0.5), '#ee7d22', 1, -0.3), stroke(line([[l * 0.2, -l * 0.06], [l * 0.25, -l * 0.02]]) + line([[l * 0.4, l * 0.05], [l * 0.46, l * 0.01]]) + line([[l * 0.6, -l * 0.04], [l * 0.64, 0]]) + line([[l * 0.12, l * 0.07], [l * 0.17, l * 0.03]]), '#b85a14', 1.2), hl(rect(l * 0.05, -l * 0.07, l * 0.5, l * 0.025, 2), 0.35)];
}
export function butterfly(s: number, col = P.cornflower): Shape[] {
  return [ol(petal(0, -s * 0.04, s * 0.5, s * 0.24, -40) + petal(0, -s * 0.04, s * 0.5, s * 0.24, -140), col, 1, -0.35), ol(petal(0, s * 0.04, s * 0.36, s * 0.17, 45) + petal(0, s * 0.04, s * 0.36, s * 0.17, 135), shade(col, -0.12), 1, -0.3), sh(circle(s * 0.28, -s * 0.24, s * 0.06) + circle(-s * 0.28, -s * 0.24, s * 0.06) + circle(s * 0.18, s * 0.2, s * 0.045) + circle(-s * 0.18, s * 0.2, s * 0.045), '#f3d77a'), sh(ellipse(0, 0, s * 0.045, s * 0.24), '#3b2f2a'), stroke(curve([[0, -s * 0.2], [-s * 0.06, -s * 0.36], [-s * 0.14, -s * 0.44]]) + curve([[0, -s * 0.2], [s * 0.06, -s * 0.36], [s * 0.14, -s * 0.44]]), '#3b2f2a', 1.2)];
}
/** Wooden spoon, origin at the top of the handle, pointing down. */
export function woodenSpoon(l: number, col = '#d9a868'): Shape[] {
  return [ol(rect(-l * 0.032, 0, l * 0.064, l * 0.7, l * 0.03), col, 1, -0.35), ol(ellipse(0, l * 0.82, l * 0.11, l * 0.18), col, 1, -0.35), sh(ellipse(0, l * 0.84, l * 0.075, l * 0.13), shade(col, -0.12)), stroke(line([[-l * 0.008, l * 0.05], [-l * 0.008, l * 0.6]]), '#f2cf98', 1.2)];
}
/** Cupcake, origin bottom centre. */
export function cupcake(s: number, cas = P.cornflower, frost = '#f4a7bb'): Shape[] {
  let pleats = '';
  for (let i = 1; i < 7; i++) pleats += line([[-s * 0.35 + i * s * 0.1, -s * 0.45], [-s * 0.26 + i * s * 0.074, 0]]);
  let spr = '';
  const g = rng(7);
  for (let i = 0; i < 10; i++) spr += xf(rect(-s * 0.025, -s * 0.008, s * 0.05, s * 0.016), { rot: g.range(0, 180), x: g.range(-s * 0.3, s * 0.3), y: -s * g.range(0.5, 0.8) });
  return [ol(poly([[-s * 0.36, -s * 0.45], [s * 0.36, -s * 0.45], [s * 0.26, 0], [-s * 0.26, 0]]), cas, 1), stroke(pleats, shade(cas, -0.25), 1), ol(ellipse(0, -s * 0.5, s * 0.42, s * 0.13), frost, 1, -0.2), ol(ellipse(0, -s * 0.64, s * 0.33, s * 0.12), shade(frost, 0.08), 1, -0.2), ol(ellipse(0, -s * 0.77, s * 0.2, s * 0.1), shade(frost, 0.15), 1, -0.2), sh(spr, '#fbf3df'), stroke(curve([[0, -s * 0.92], [s * 0.04, -s * 1.02], [s * 0.1, -s * 1.06]]), '#4f7a3f', 1.4), ol(circle(0, -s * 0.9, s * 0.08), '#c8283a', 0.8)];
}
/** Pretzel, origin centre. */
export function pretzel(s: number): Shape[] {
  const k = (pts: Pt[]) => curve(pts.map(([x, y]) => [x * s, y * s] as Pt));
  const a = k([[-0.4, 0.4], [0.1, 0.04], [0.42, -0.22], [0.32, -0.45], [0.06, -0.4], [0, -0.18]]);
  const b = k([[0.4, 0.4], [-0.1, 0.04], [-0.42, -0.22], [-0.32, -0.45], [-0.06, -0.4], [0, -0.18]]);
  const g = rng(3);
  let salt = '';
  for (let i = 0; i < 14; i++) salt += rect(g.range(-s * 0.4, s * 0.4), g.range(-s * 0.4, s * 0.3), s * 0.03, s * 0.025);
  return [stroke(a + b, '#6b3a1c', s * 0.17), stroke(b, '#a8632e', s * 0.12), stroke(a, '#b06a32', s * 0.12), stroke(a, '#d08a4a', s * 0.035), sh(salt, '#fbf6e8')];
}
/** Croissant, origin centre. */
export function croissant(s: number): Shape[] {
  const out: Shape[] = [];
  const segs = [-2, 2, -1, 1, 0];
  for (const i of segs) {
    const t = i / 2, a = ((-90 + t * 62) * Math.PI) / 180, R = s * 0.3;
    const x = Math.cos(a) * R, y = s * 0.28 + Math.sin(a) * R;
    const sz = s * (0.13 + 0.11 * (1 - Math.abs(t)));
    out.push(ol(ellipse(x, y, sz * 0.75, sz, t * 55), '#d9963e', 1.1, -0.38), hl(ellipse(x - sz * 0.15, y - sz * 0.45, sz * 0.35, sz * 0.14, t * 55), 0.35));
  }
  return out;
}
export function doughnut(s: number, icing = '#f29bb5'): Shape[] {
  const g = rng(11);
  const cols = ['#fbf3df', '#6f8fd6', '#f3d77a', '#9cb48a'];
  const spr = cols.map(() => '');
  for (let i = 0; i < 20; i++) { const a = g.range(0, Math.PI * 2), r = s * g.range(0.22, 0.38); spr[i % 4] += xf(rect(-s * 0.03, -s * 0.009, s * 0.06, s * 0.018), { rot: g.range(0, 180), x: Math.cos(a) * r, y: Math.sin(a) * r * 0.8 }); }
  return [ol(xf(sector(0, 0, s * 0.48, 0, 360, s * 0.15), { sy: 0.8 }), '#d39a58', 1, -0.35), sh(xf(blob([[s * 0.42, 0], [s * 0.3, s * 0.3], [0, s * 0.43], [-s * 0.32, s * 0.28], [-s * 0.43, 0], [-s * 0.3, -s * 0.3], [0, -s * 0.42], [s * 0.3, -s * 0.31]], 1), { sy: 0.8 }), icing), sh(xf(circle(0, 0, s * 0.18), { sy: 0.8 }), '#b87a3e'), sh(xf(circle(0, 0, s * 0.13), { sy: 0.8 }), '#5a3a22'), ...spr.map((d, i) => sh(d, cols[i])), hl(ellipse(-s * 0.2, -s * 0.22, s * 0.12, s * 0.04, -20), 0.5)];
}
export function cookieCutter(s: number): Shape[] {
  const d = star(0, 0, s * 0.5, s * 0.24, 5);
  return [stroke(d, '#6e767c', s * 0.075), stroke(d, '#d6dcdf', s * 0.03)];
}
export function gingerbread(s: number): Shape[] {
  const c = '#b9733a';
  const body = sh(circle(0, -s * 0.3, s * 0.16) + rect(-s * 0.15, -s * 0.18, s * 0.3, s * 0.32, s * 0.1) + xf(rect(-s * 0.08, -s * 0.06, s * 0.36, s * 0.12, s * 0.06), { rot: -20, x: s * 0.12, y: -s * 0.1 }) + xf(rect(-s * 0.28, -s * 0.06, s * 0.36, s * 0.12, s * 0.06), { rot: 20, x: -s * 0.12, y: -s * 0.1 }) + xf(rect(-s * 0.06, 0, s * 0.13, s * 0.36, s * 0.06), { rot: -22, x: s * 0.06, y: s * 0.1 }) + xf(rect(-s * 0.07, 0, s * 0.13, s * 0.36, s * 0.06), { rot: 22, x: -s * 0.06, y: s * 0.1 }), c, { stroke: shade(c, -0.35), strokeWidth: 1 });
  return [body, sh(circle(-s * 0.06, -s * 0.33, s * 0.025) + circle(s * 0.06, -s * 0.33, s * 0.025) + circle(0, -s * 0.08, s * 0.03) + circle(0, s * 0.02, s * 0.03), '#fbf6e8'), stroke(curve([[-s * 0.07, -s * 0.24], [0, -s * 0.2], [s * 0.07, -s * 0.24]]) + curve([[s * 0.3, -s * 0.22], [s * 0.33, -s * 0.18], [s * 0.3, -s * 0.14]]) + curve([[-s * 0.3, -s * 0.22], [-s * 0.33, -s * 0.18], [-s * 0.3, -s * 0.14]]) + curve([[s * 0.15, s * 0.42], [s * 0.2, s * 0.4], [s * 0.24, s * 0.36]]) + curve([[-s * 0.15, s * 0.42], [-s * 0.2, s * 0.4], [-s * 0.24, s * 0.36]]), '#fbf6e8', s * 0.025)];
}
export function strawberry(s: number): Shape[] {
  let seeds = '';
  for (const [x, y] of [[-0.18, -0.12], [0, -0.16], [0.18, -0.12], [-0.12, 0.05], [0.1, 0.05], [0, 0.22], [-0.24, -0.02], [0.24, -0.02]] as Pt[]) seeds += ellipse(x * s, y * s, s * 0.025, s * 0.035);
  return [ol(blob([[0, s * 0.45], [-s * 0.32, s * 0.08], [-s * 0.34, -s * 0.22], [0, -s * 0.3], [s * 0.34, -s * 0.22], [s * 0.32, s * 0.08]], 0.9), '#d8283a', 1), sh(seeds, '#f6d23c'), sh(star(0, -s * 0.3, s * 0.26, s * 0.08, 6, -90), '#4f8a3f'), stroke(line([[0, -s * 0.3], [s * 0.04, -s * 0.46]]), '#4f7a3f', 2), hl(ellipse(-s * 0.16, -s * 0.12, s * 0.06, s * 0.1, 20), 0.5)];
}
/** Shop bell on a curly bracket; origin at the wall end of the bracket. */
export function shopBell(s: number, col = '#d4a63c'): Shape[] {
  const bx = s * 0.5;
  return [stroke(M(0, 0) + L(bx, 0) + line([[bx, 0], [bx, s * 0.14]]) + M(s * 0.08, 0) + Q(s * 0.08, s * 0.16, s * 0.22, s * 0.12) + Q(s * 0.28, s * 0.04, s * 0.2, s * 0.04), '#3b2f2a', s * 0.04), ol(circle(bx, s * 0.6, s * 0.06), shade(col, -0.3), 1), ol(M(bx - s * 0.1, s * 0.16) + Q(bx - s * 0.13, s * 0.36, bx - s * 0.3, s * 0.54) + L(bx + s * 0.3, s * 0.54) + Q(bx + s * 0.13, s * 0.36, bx + s * 0.1, s * 0.16) + Q(bx, s * 0.1, bx - s * 0.1, s * 0.16) + 'Z', col, 1.2, -0.35), ol(ellipse(bx, s * 0.54, s * 0.31, s * 0.05), shade(col, -0.15), 1), hl(ellipse(bx - s * 0.12, s * 0.34, s * 0.03, s * 0.12, 25), 0.6)];
}
export function coin(r: number): Shape[] {
  return [ol(circle(0, 0, r), '#e0b03c', 1.2, -0.35), stroke(circle(0, 0, r * 0.78), '#b8892a', r * 0.08), sh(star(0, 0, r * 0.42, r * 0.18, 5), '#c99a2e'), hl(ellipse(-r * 0.35, -r * 0.4, r * 0.3, r * 0.12, -40), 0.6)];
}
export function spectacles(s: number, col = '#5a3a2a'): Shape[] {
  return [stroke(M(-s * 0.42, -s * 0.04) + L(-s * 0.5, -s * 0.18) + M(s * 0.42, -s * 0.04) + L(s * 0.5, -s * 0.18), col, s * 0.04), sh(circle(-s * 0.24, 0, s * 0.18) + circle(s * 0.24, 0, s * 0.18), '#cfe2ee', { opacity: 0.6 }), stroke(circle(-s * 0.24, 0, s * 0.18) + circle(s * 0.24, 0, s * 0.18), col, s * 0.05), stroke(M(-s * 0.07, -s * 0.02) + Q(0, -s * 0.1, s * 0.07, -s * 0.02), col, s * 0.04), hl(ellipse(-s * 0.3, -s * 0.07, s * 0.06, s * 0.03, -30), 0.8), hl(ellipse(s * 0.18, -s * 0.07, s * 0.06, s * 0.03, -30), 0.8)];
}
/** Closed umbrella with a crook handle, origin at the tip on the floor. */
export function umbrella(s: number, col = '#d8452f'): Shape[] {
  return [stroke(line([[0, 0], [0, -s * 0.08]]), '#4a5258', s * 0.025), ol(blob([[0, -s * 0.07], [s * 0.1, -s * 0.36], [s * 0.12, -s * 0.66], [s * 0.05, -s * 0.8], [-s * 0.05, -s * 0.8], [-s * 0.12, -s * 0.62], [-s * 0.08, -s * 0.34]], 0.8), col, 1.2), stroke(curve([[0, -s * 0.1], [s * 0.04, -s * 0.45], [s * 0.02, -s * 0.78]]) + curve([[0, -s * 0.1], [-s * 0.05, -s * 0.45], [-s * 0.07, -s * 0.66]]), shade(col, -0.28), 1.2), sh(rect(-s * 0.1, -s * 0.56, s * 0.2, s * 0.05, 2), '#fbf3df'), sh(circle(-s * 0.06, -s * 0.4, s * 0.02) + circle(s * 0.05, -s * 0.3, s * 0.02) + circle(s * 0.02, -s * 0.64, s * 0.02) + circle(-s * 0.04, -s * 0.2, s * 0.018), '#fbf3df'), stroke(M(0, -s * 0.8) + L(0, -s * 0.9) + Q(0, -s * 1.02, -s * 0.11, -s * 1.02) + Q(-s * 0.2, -s * 1.02, -s * 0.2, -s * 0.92), '#7a5232', s * 0.05)];
}
/** Teaspoon, horizontal, origin centre. */
export function teaspoon(s: number): Shape[] {
  return [ol(M(-s * 0.5, -s * 0.03) + Q(-s * 0.1, -s * 0.02, s * 0.12, -s * 0.015) + L(s * 0.12, s * 0.015) + Q(-s * 0.1, s * 0.02, -s * 0.5, s * 0.03) + Q(-s * 0.54, 0, -s * 0.5, -s * 0.03) + 'Z', '#c9d0d5', 0.8, -0.4), ol(ellipse(s * 0.28, 0, s * 0.2, s * 0.11), '#c9d0d5', 1, -0.4), sh(ellipse(s * 0.3, s * 0.01, s * 0.14, s * 0.07), '#aab3b8'), hl(ellipse(s * 0.22, -s * 0.04, s * 0.06, s * 0.025), 0.8)];
}
export function macaron(s: number, col = '#a9c98a'): Shape[] {
  const foot = (y: number) => { let d = M(-s * 0.4, y); for (let i = 0; i < 10; i++) d += Q(-s * 0.36 + i * s * 0.08, y + s * 0.05, -s * 0.32 + i * s * 0.08, y); return stroke(d, shade(col, -0.2), s * 0.04); };
  return [ol(M(-s * 0.42, s * 0.1) + Q(-s * 0.42, s * 0.34, 0, s * 0.34) + Q(s * 0.42, s * 0.34, s * 0.42, s * 0.1) + 'Z', col, 1, -0.25), foot(s * 0.1), sh(rect(-s * 0.38, -s * 0.04, s * 0.76, s * 0.12, s * 0.05), '#fbf3df'), ol(M(-s * 0.42, -s * 0.06) + Q(-s * 0.42, -s * 0.36, 0, -s * 0.36) + Q(s * 0.42, -s * 0.36, s * 0.42, -s * 0.06) + 'Z', col, 1, -0.25), foot(-s * 0.06), hl(ellipse(-s * 0.16, -s * 0.24, s * 0.12, s * 0.04, -12), 0.5)];
}
/** Slice of layered cake, tip pointing left, origin bottom centre. */
export function cakeSlice(s: number): Shape[] {
  const side = poly([[-s * 0.5, -s * 0.02], [s * 0.34, s * 0.12], [s * 0.34, -s * 0.34], [-s * 0.5, -s * 0.26]]);
  const lay = (t: number, th: number) => poly([[-s * 0.5, -s * 0.02 - s * 0.24 * t], [s * 0.34, s * 0.12 - s * 0.46 * t], [s * 0.34, s * 0.12 - s * 0.46 * (t + th)], [-s * 0.5, -s * 0.02 - s * 0.24 * (t + th)]]);
  return [ol(side, '#f2d18a', 1, -0.3), sh(lay(0.3, 0.1), '#d8283a'), sh(lay(0.4, 0.08), '#fbf6e8'), sh(lay(0.72, 0.1), '#d8283a'), sh(lay(0.82, 0.18), '#fbf6e8'), ol(poly([[-s * 0.5, -s * 0.26], [s * 0.34, -s * 0.34], [s * 0.48, -s * 0.44]]), '#fbf6e8', 1, -0.15), ol(poly([[s * 0.34, s * 0.12], [s * 0.48, 0], [s * 0.48, -s * 0.44], [s * 0.34, -s * 0.34]]), '#f4e4c8', 1, -0.2), ...strawberry(s * 0.3).map((p) => ({ ...p, d: xf(p.d, { x: s * 0.2, y: -s * 0.5 }) }))];
}
export function milkBottle(h: number): Shape[] {
  const body = M(-h * 0.12, -h * 0.94) + L(h * 0.12, -h * 0.94) + L(h * 0.13, -h * 0.8) + Q(h * 0.27, -h * 0.66, h * 0.27, -h * 0.5) + L(h * 0.27, -h * 0.05) + Q(h * 0.27, 0, h * 0.21, 0) + L(-h * 0.21, 0) + Q(-h * 0.27, 0, -h * 0.27, -h * 0.05) + L(-h * 0.27, -h * 0.5) + Q(-h * 0.27, -h * 0.66, -h * 0.13, -h * 0.8) + 'Z';
  return [shadow(0, 0, h * 0.3, h * 0.04), sh(body, '#fbfaf4', { stroke: '#a9b8bc', strokeWidth: 1.2 }), sh(rect(-h * 0.27, -h * 0.4, h * 0.54, h * 0.1), P.cornflower), hl(rect(-h * 0.21, -h * 0.7, h * 0.05, h * 0.6, 2), 0.9), stroke(line([[h * 0.16, -h * 0.6], [h * 0.18, -h * 0.1]]), '#dfe6e8', 2), ol(rect(-h * 0.14, -h * 1.0, h * 0.28, h * 0.08, 2), '#c9d0d5', 0.8, -0.35), sh(rect(-h * 0.14, -h * 0.96, h * 0.28, h * 0.025), '#d8452f')];
}
/** Honey pot with a dipper, origin bottom centre. */
export function honeyPot(s: number): Shape[] {
  const c = '#e0a83a';
  return [
    stroke(line([[s * 0.06, -s * 0.66], [s * 0.36, -s * 1.08]]), '#a8743e', s * 0.05),
    ol(blob([[-s * 0.42, -s * 0.3], [-s * 0.34, -s * 0.06], [0, 0], [s * 0.34, -s * 0.06], [s * 0.42, -s * 0.3], [s * 0.32, -s * 0.56], [0, -s * 0.62], [-s * 0.32, -s * 0.56]], 0.9), c, 1.2, -0.3),
    sh(rect(-s * 0.4, -s * 0.34, s * 0.8, s * 0.05) + rect(-s * 0.36, -s * 0.2, s * 0.72, s * 0.04), shade(c, -0.25)),
    ol(M(-s * 0.36, -s * 0.6) + L(s * 0.36, -s * 0.6) + L(s * 0.36, -s * 0.52) + Q(s * 0.3, -s * 0.4, s * 0.24, -s * 0.5) + Q(s * 0.18, -s * 0.36, s * 0.1, -s * 0.5) + Q(0, -s * 0.3, -s * 0.08, -s * 0.5) + Q(-s * 0.18, -s * 0.4, -s * 0.24, -s * 0.5) + Q(-s * 0.32, -s * 0.38, -s * 0.36, -s * 0.52) + 'Z', '#f2c14a', 1, -0.3),
    ol(rect(-s * 0.4, -s * 0.72, s * 0.8, s * 0.13, 4), '#c9893a', 1), ol(rect(-s * 0.1, -s * 0.8, s * 0.2, s * 0.08, 3), '#a8743e', 0.8),
    ol(xf(rect(-s * 0.09, -s * 0.07, s * 0.18, s * 0.14, 3), { rot: -55, x: s * 0.4, y: -s * 1.12 }), '#c9893a', 0.8), hl(ellipse(-s * 0.2, -s * 0.36, s * 0.05, s * 0.12, 20), 0.4),
  ];
}
export function garlic(s: number): Shape[] {
  return [ol(blob([[0, -s * 0.46], [s * 0.18, -s * 0.28], [s * 0.42, 0], [s * 0.32, s * 0.3], [0, s * 0.36], [-s * 0.32, s * 0.3], [-s * 0.42, 0], [-s * 0.18, -s * 0.28]], 0.9), '#f4ecdc', 1.2, -0.3), stroke(curve([[0, -s * 0.42], [-s * 0.2, -s * 0.05], [-s * 0.12, s * 0.34]]) + curve([[0, -s * 0.42], [s * 0.2, -s * 0.05], [s * 0.12, s * 0.34]]) + curve([[0, -s * 0.42], [-s * 0.36, 0], [-s * 0.26, s * 0.3]]) + curve([[0, -s * 0.42], [s * 0.36, 0], [s * 0.26, s * 0.3]]), '#c9b8a0', 1), sh(ellipse(-s * 0.16, s * 0.05, s * 0.05, s * 0.2, 10) + ellipse(s * 0.18, s * 0.05, s * 0.04, s * 0.18, -10), '#c9a0c0', { opacity: 0.7 }), ol(rect(-s * 0.04, -s * 0.62, s * 0.08, s * 0.2, 2), '#e3d6b8', 0.8), stroke(line([[-s * 0.1, s * 0.36], [-s * 0.14, s * 0.44]]) + line([[0, s * 0.36], [0, s * 0.46]]) + line([[s * 0.1, s * 0.36], [s * 0.14, s * 0.44]]), '#b8a888', 1.2)];
}
export function chilli(s: number): Shape[] {
  return [ol(M(-s * 0.34, -s * 0.12) + Q(s * 0.1, -s * 0.22, s * 0.48, s * 0.32) + Q(s * 0.02, s * 0.08, -s * 0.34, s * 0.06) + Q(-s * 0.4, -s * 0.03, -s * 0.34, -s * 0.12) + 'Z', '#d2302a', 1, -0.35), hl(M(-s * 0.24, -s * 0.1) + Q(s * 0.1, -s * 0.14, s * 0.32, s * 0.14) + Q(s * 0.06, -s * 0.06, -s * 0.24, -s * 0.06) + 'Z', 0.4), ol(M(-s * 0.36, -s * 0.12) + L(-s * 0.36, s * 0.06) + L(-s * 0.42, s * 0.04) + L(-s * 0.42, -s * 0.1) + 'Z', '#4f8a3f', 0.8), stroke(curve([[-s * 0.42, -s * 0.03], [-s * 0.5, -s * 0.06], [-s * 0.52, -s * 0.18]]), '#4f8a3f', s * 0.04)];
}
export function mushroom(s: number): Shape[] {
  return [ol(M(-s * 0.13, -s * 0.2) + L(-s * 0.16, s * 0.1) + Q(0, s * 0.18, s * 0.16, s * 0.1) + L(s * 0.13, -s * 0.2) + 'Z', '#f2e8d4', 1, -0.25), ol(ellipse(0, -s * 0.2, s * 0.4, s * 0.08), '#d9c4a0', 1, -0.25), stroke(line([[-s * 0.3, -s * 0.2], [-s * 0.15, -s * 0.18]]) + line([[s * 0.3, -s * 0.2], [s * 0.15, -s * 0.18]]) + line([[0, -s * 0.13], [0, -s * 0.15]]), '#a8906a', 1), ol(M(-s * 0.46, -s * 0.2) + Q(-s * 0.44, -s * 0.6, 0, -s * 0.6) + Q(s * 0.44, -s * 0.6, s * 0.46, -s * 0.2) + Q(0, -s * 0.24, -s * 0.46, -s * 0.2) + 'Z', '#9a6a42', 1.2, -0.3), hl(ellipse(-s * 0.18, -s * 0.46, s * 0.14, s * 0.05, -20), 0.35), sh(circle(s * 0.12, -s * 0.4, s * 0.04) + circle(-s * 0.04, -s * 0.5, s * 0.03), shade('#9a6a42', -0.2))];
}
export function apple(s: number, col = '#c8322a'): Shape[] {
  return [ol(blob([[0, -s * 0.3], [s * 0.3, -s * 0.42], [s * 0.46, -s * 0.1], [s * 0.36, s * 0.3], [s * 0.1, s * 0.44], [0, s * 0.4], [-s * 0.1, s * 0.44], [-s * 0.36, s * 0.3], [-s * 0.46, -s * 0.1], [-s * 0.3, -s * 0.42]], 0.9), col, 1.2, -0.3), hl(ellipse(-s * 0.24, -s * 0.12, s * 0.07, s * 0.16, 20), 0.5), stroke(curve([[0, -s * 0.3], [s * 0.02, -s * 0.44], [s * 0.08, -s * 0.52]]), '#5a3a22', s * 0.04), sh(leaf(s * 0.04, -s * 0.42, s * 0.3, s * 0.1, -30), '#5c9a45')];
}
export function ladybird(s: number): Shape[] {
  return [stroke(line([[-s * 0.3, -s * 0.05], [-s * 0.44, -s * 0.12]]) + line([[-s * 0.3, s * 0.12], [-s * 0.44, s * 0.18]]) + line([[s * 0.3, -s * 0.05], [s * 0.44, -s * 0.12]]) + line([[s * 0.3, s * 0.12], [s * 0.44, s * 0.18]]) + line([[0, -s * 0.4], [-s * 0.12, -s * 0.54]]) + line([[0, -s * 0.4], [s * 0.12, -s * 0.54]]), '#2a2420', 1.4), sh(ellipse(0, -s * 0.34, s * 0.17, s * 0.12), '#2a2420'), ol(ellipse(0, s * 0.04, s * 0.32, s * 0.36), '#d8283a', 1, -0.4), stroke(line([[0, -s * 0.3], [0, s * 0.4]]), '#2a2420', 1.4), sh(circle(-s * 0.14, -s * 0.08, s * 0.06) + circle(s * 0.14, -s * 0.08, s * 0.06) + circle(-s * 0.16, s * 0.16, s * 0.055) + circle(s * 0.16, s * 0.16, s * 0.055) + circle(0, s * 0.3, s * 0.04), '#2a2420'), sh(circle(-s * 0.07, -s * 0.38, s * 0.03) + circle(s * 0.07, -s * 0.38, s * 0.03), '#fbf6e8'), hl(ellipse(-s * 0.12, -s * 0.18, s * 0.06, s * 0.03, -30), 0.5)];
}
/** Candle in an enamel holder, origin bottom centre. */
export function candle(h: number): Shape[] {
  return [sh(circle(0, -h * 0.98, h * 0.16), '#ffe8a0', { opacity: 0.35 }), stroke(ellipse(h * 0.36, -h * 0.07, h * 0.08, h * 0.06), '#4a68b0', h * 0.03), ol(ellipse(0, -h * 0.04, h * 0.36, h * 0.07), P.cornflower, 1), ol(rect(-h * 0.11, -h * 0.78, h * 0.22, h * 0.72, 2), '#fbf3df', 1, -0.15), sh(M(h * 0.11, -h * 0.74) + Q(h * 0.15, -h * 0.6, h * 0.12, -h * 0.5) + L(h * 0.08, -h * 0.74) + 'Z', '#f4e8c8'), stroke(line([[0, -h * 0.78], [0, -h * 0.84]]), '#3b2f2a', 1.2), sh(M(0, -h * 1.06) + Q(h * 0.08, -h * 0.92, 0, -h * 0.83) + Q(-h * 0.08, -h * 0.92, 0, -h * 1.06) + 'Z', '#f6a83a'), sh(M(0, -h * 0.98) + Q(h * 0.04, -h * 0.9, 0, -h * 0.85) + Q(-h * 0.04, -h * 0.9, 0, -h * 0.98) + 'Z', '#fff3a6')];
}
export function twine(s: number): Shape[] {
  let w1 = '', w2 = '';
  for (let i = 0; i < 6; i++) { const t = (i - 2.5) / 3; w1 += curve([[-s * 0.4, t * s * 0.5], [0, t * s * 0.5 - s * 0.1], [s * 0.4, t * s * 0.5]]); w2 += curve([[t * s * 0.5, -s * 0.4], [t * s * 0.5 + s * 0.12, 0], [t * s * 0.5, s * 0.4]]); }
  return [stroke(curve([[s * 0.3, s * 0.3], [s * 0.5, s * 0.46], [s * 0.4, s * 0.62], [s * 0.6, s * 0.7]]), '#b8925a', s * 0.04), ol(circle(0, 0, s * 0.42), '#d2b07a', 1.2, -0.35), stroke(w1, '#b8925a', 1), stroke(w2, '#e6c896', 1)];
}
export function pumpkin(s: number): Shape[] {
  const c = '#ee8a2a';
  return [ol(ellipse(-s * 0.26, 0, s * 0.24, s * 0.34), shade(c, -0.1), 1, -0.3), ol(ellipse(s * 0.26, 0, s * 0.24, s * 0.34), shade(c, -0.1), 1, -0.3), ol(ellipse(-s * 0.12, 0, s * 0.22, s * 0.36), c, 1, -0.3), ol(ellipse(s * 0.12, 0, s * 0.22, s * 0.36), c, 1, -0.3), ol(ellipse(0, 0, s * 0.16, s * 0.37), shade(c, 0.1), 1, -0.3), ol(M(-s * 0.04, -s * 0.34) + Q(-s * 0.05, -s * 0.48, s * 0.06, -s * 0.54) + L(s * 0.08, -s * 0.48) + Q(s * 0.03, -s * 0.44, s * 0.05, -s * 0.34) + 'Z', '#6b5a2a', 1), stroke(curve([[s * 0.04, -s * 0.44], [s * 0.18, -s * 0.5], [s * 0.2, -s * 0.38], [s * 0.3, -s * 0.42]]), '#5c8a45', 1.4), sh(leaf(-s * 0.02, -s * 0.4, s * 0.22, s * 0.08, -160), '#5c8a45')];
}
export function cornCob(s: number): Shape[] {
  let k1 = '', k2 = '';
  for (let r = 0; r < 9; r++) for (let c = 0; c < 4; c++) { const y = -s * 0.36 + r * s * 0.085, wdt = s * 0.13 * Math.sqrt(Math.max(0.2, 1 - Math.pow((y / (s * 0.42)), 2))); const x = -wdt + (c + 0.5) * (wdt * 2) / 4; const d = ellipse(x, y, wdt * 0.24, s * 0.035); if ((r + c) % 2) k1 += d; else k2 += d; }
  return [sh(leaf(0, s * 0.42, s * 0.8, s * 0.12, -100) + leaf(0, s * 0.42, s * 0.62, s * 0.1, -60), '#7fa24e'), ol(ellipse(0, 0, s * 0.15, s * 0.44), '#e8b830', 1, -0.3), sh(k1, '#f6d23c'), sh(k2, '#f0c63a'), sh(leaf(0, s * 0.44, s * 0.7, s * 0.12, -80) + leaf(0, s * 0.44, s * 0.6, s * 0.1, -116), '#9cc05a', { stroke: '#6f8a42', strokeWidth: 0.8 })];
}
/** Teapot, origin bottom centre. */
export function teapot(s: number, col = '#8fae8a'): Shape[] {
  let dots = '';
  for (let i = 0; i < 6; i++) dots += circle(-s * 0.3 + i * s * 0.12, -s * 0.3 + (i % 2) * s * 0.07, s * 0.03);
  return [stroke(ellipse(s * 0.42, -s * 0.34, s * 0.12, s * 0.15), shade(col, -0.2), s * 0.06), ol(M(-s * 0.32, -s * 0.36) + Q(-s * 0.52, -s * 0.4, -s * 0.62, -s * 0.62) + L(-s * 0.56, -s * 0.64) + Q(-s * 0.46, -s * 0.5, -s * 0.3, -s * 0.22) + 'Z', col, 1), ol(blob([[-s * 0.38, -s * 0.1], [-s * 0.4, -s * 0.38], [-s * 0.2, -s * 0.55], [s * 0.2, -s * 0.55], [s * 0.4, -s * 0.38], [s * 0.38, -s * 0.1], [s * 0.22, 0], [-s * 0.22, 0]], 0.9), col, 1.2), sh(dots, '#fbf6e8'), ol(M(-s * 0.2, -s * 0.55) + Q(-s * 0.18, -s * 0.7, 0, -s * 0.7) + Q(s * 0.18, -s * 0.7, s * 0.2, -s * 0.55) + 'Z', shade(col, 0.1), 1), ol(circle(0, -s * 0.74, s * 0.05), shade(col, -0.2), 0.8), hl(ellipse(-s * 0.2, -s * 0.36, s * 0.05, s * 0.12, 20), 0.4)];
}
export function measuringJug(s: number): Shape[] {
  const body = M(-s * 0.3, -s * 0.8) + L(s * 0.26, -s * 0.8) + L(s * 0.24, 0) + L(-s * 0.26, 0) + L(-s * 0.3, -s * 0.8) + 'Z';
  let marks = '';
  for (let i = 1; i < 6; i++) marks += line([[-s * 0.2, -s * 0.13 * i], [-s * 0.06 + (i % 2) * s * 0.06, -s * 0.13 * i]]);
  return [stroke(M(s * 0.25, -s * 0.66) + L(s * 0.46, -s * 0.62) + L(s * 0.44, -s * 0.16) + L(s * 0.24, -s * 0.16), '#8fb0bc', s * 0.07), sh(body, '#e2f0f4', { opacity: 0.85 }), sh(M(-s * 0.27, -s * 0.3) + L(s * 0.25, -s * 0.3) + L(s * 0.24, 0) + L(-s * 0.26, 0) + 'Z', '#f8f2e0', { opacity: 0.9 }), stroke(body, '#8fb0bc', 1.4), sh(poly([[-s * 0.3, -s * 0.8], [-s * 0.44, -s * 0.86], [-s * 0.29, -s * 0.72]]), '#cfe2e8'), stroke(marks, '#d8452f', 1.4), hl(rect(s * 0.1, -s * 0.74, s * 0.05, s * 0.66), 0.8)];
}
/** Mouse facing left, origin at its feet. */
export function mouse(s: number, col = '#9a9290'): Shape[] {
  return [stroke(curve([[s * 0.3, -s * 0.06], [s * 0.55, -s * 0.02], [s * 0.6, -s * 0.22], [s * 0.78, -s * 0.24]]), '#c9a0a0', s * 0.035), ol(blob([[-s * 0.42, -s * 0.12], [-s * 0.2, -s * 0.34], [s * 0.12, -s * 0.36], [s * 0.36, -s * 0.18], [s * 0.3, 0], [-s * 0.2, 0]], 0.85), col, 1.2, -0.3), ol(circle(-s * 0.18, -s * 0.34, s * 0.11), col, 1, -0.3), sh(circle(-s * 0.18, -s * 0.34, s * 0.065), '#e9b0b0'), sh(circle(-s * 0.32, -s * 0.2, s * 0.03), '#1f1a18'), sh(circle(-s * 0.46, -s * 0.12, s * 0.035), '#e08a9a'), stroke(line([[-s * 0.42, -s * 0.12], [-s * 0.6, -s * 0.18]]) + line([[-s * 0.42, -s * 0.1], [-s * 0.6, -s * 0.06]]), '#5a5250', 0.8), sh(ellipse(-s * 0.16, -s * 0.01, s * 0.06, s * 0.025) + ellipse(s * 0.14, -s * 0.01, s * 0.06, s * 0.025), '#e9b0b0')];
}
export function pear(s: number, col = '#b8c84a'): Shape[] {
  return [ol(blob([[0, -s * 0.42], [s * 0.14, -s * 0.3], [s * 0.18, -s * 0.06], [s * 0.34, s * 0.16], [s * 0.26, s * 0.4], [0, s * 0.46], [-s * 0.26, s * 0.4], [-s * 0.34, s * 0.16], [-s * 0.18, -s * 0.06], [-s * 0.14, -s * 0.3]], 0.9), col, 1.2, -0.3), hl(ellipse(-s * 0.14, s * 0.12, s * 0.06, s * 0.14, 15), 0.45), sh(ellipse(s * 0.14, s * 0.26, s * 0.1, s * 0.12), '#d8813a', { opacity: 0.35 }), stroke(curve([[0, -s * 0.42], [s * 0.02, -s * 0.5], [s * 0.08, -s * 0.56]]), '#5a3a22', s * 0.04), sh(leaf(s * 0.03, -s * 0.48, s * 0.26, s * 0.08, -20), '#5c9a45')];
}
export function peapod(s: number): Shape[] {
  let peas = '';
  for (let i = 0; i < 5; i++) peas += circle(-s * 0.3 + i * s * 0.15, -s * 0.01 + Math.sin(i * 0.8) * s * 0.01, s * 0.07);
  return [ol(M(-s * 0.5, 0) + Q(-s * 0.1, s * 0.22, s * 0.48, -s * 0.04) + Q(s * 0.1, -s * 0.16, -s * 0.5, 0) + 'Z', '#5c9a45', 1, -0.3), sh(M(-s * 0.42, -s * 0.02) + Q(0, s * 0.1, s * 0.4, -s * 0.06) + Q(0, -s * 0.12, -s * 0.42, -s * 0.02) + 'Z', '#b8e08a'), sh(peas, '#7fbf4f', { stroke: '#4f8a3f', strokeWidth: 0.8 }), stroke(curve([[-s * 0.5, 0], [-s * 0.58, -s * 0.06], [-s * 0.62, -s * 0.14]]), '#4f8a3f', s * 0.03)];
}
void mix;
