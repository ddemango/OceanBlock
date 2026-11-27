// Shared props for the Down on the Farm hidden-object scenes. Every prop is drawn
// around the origin and returns Shape[]; position it with place(). Unless a comment
// says otherwise the origin is the bottom centre (the prop stands on y = 0).
import { rect, ellipse, circle, poly, line, curve, blob, leaf, petal, sector, sh, stroke, shade, mix, rng, xf, place } from '../../art/kit';
import type { Shape } from '../../art/types';
import { M, L, Q, C, ol, shadow, hl, crate as sCrate, basket as sBasket } from '../seasons/props-find';
import { pile, type Veg } from '../kitchen/props-find';

export type Pt = [number, number];
const nz = (s: Shape[]) => s.filter((p) => p.d);
/** Scale a list of unit points by s. */
const sc = (s: number, pts: number[][]): Pt[] => pts.map(([x, y]) => [x * s, y * s]);

export const F = {
  barn: '#b8402e', barnDk: '#8f2f22', barnLt: '#cf5a44', trim: '#f6ecd6', straw: '#e2bd5a', strawDk: '#c79a3c', strawLt: '#f0d684',
  wood: '#a8774a', woodDk: '#6f4a2c', woodLt: '#caa06c', zinc: '#aab4b9', zincDk: '#78848b', zincLt: '#d5dde0',
  grass: '#8fae5a', grassDk: '#6b8f45', grassLt: '#a9c46c', soil: '#8a6238', mud: '#7a5638', cream: '#f7efdc', ink: '#3b2f2a',
  stone: '#b9b0a2', stoneDk: '#8f8678', roof: '#7a4a3a', pink: '#f0b0a4', pinkDk: '#d98a80', hen: '#c9783a', white: '#fbf6ec',
  leather: '#8a5230', leatherDk: '#5e3520', brass: '#d4a63c', red: '#c8452f', blue: '#5a86b8', teal: '#3f7f7a', mustard: '#e0a83a',
};

// =====================================================================
// landscape
// =====================================================================
/** A cluster of round bushes sitting on y = 0, w wide and about h tall. */
export function bush(seed: number, w: number, h: number, cols: string[]): Shape[] {
  const g = rng(seed);
  const by = cols.map(() => '');
  const n = Math.max(5, Math.round(w / (h * 0.32)));
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1), x = -w / 2 + w * t + g.range(-h * 0.1, h * 0.1);
    const r = h * g.range(0.34, 0.5) * (0.7 + 0.3 * Math.sin(t * Math.PI));
    by[i % cols.length] += circle(x, -r * g.range(0.7, 1.0), r);
  }
  return nz(cols.map((c, i) => sh(by[i], c)));
}

/** Little five-dot flowers on stems scattered over an area. */
export function wildflowers(x0: number, y0: number, w: number, h: number, count: number, seed: number, cols: string[], size = 5): Shape[] {
  const g = rng(seed);
  const by = cols.map(() => '');
  let stems = '', mids = '';
  for (let i = 0; i < count; i++) {
    const x = x0 + g.range(0, w), y = y0 + g.range(0, h), r = size * g.range(0.8, 1.25), top = y - r * g.range(2.2, 3.6);
    stems += line([[x, y], [x + g.range(-2, 2), top]]);
    let d = '';
    for (let k = 0; k < 5; k++) d += circle(x + Math.cos((k * 72 * Math.PI) / 180) * r * 0.62, top + Math.sin((k * 72 * Math.PI) / 180) * r * 0.62, r * 0.48);
    by[g.int(0, cols.length - 1)] += d;
    mids += circle(x, top, r * 0.36);
  }
  return nz([stroke(stems, '#5f8a45', 1.4), ...cols.map((c, i) => sh(by[i], c)), sh(mids, '#f2c440')]);
}

/** Rows of a crop running away over a field band (simple perspective fan from a vanishing point). */
export function cropRows(x0: number, x1: number, y0: number, y1: number, vx: number, count: number, col: string, width = 2): Shape {
  let d = '';
  for (let i = 0; i <= count; i++) {
    const xb = x0 + ((x1 - x0) * i) / count;
    const xt = vx + (xb - vx) * 0.55;
    d += line([[xt, y0], [xb, y1]]);
  }
  return stroke(d, col, width, { opacity: 0.6 });
}

/** Post-and-rail fence; origin bottom-left, posts every `gap`. */
export function railFence(w: number, h: number, gap: number, col = F.wood, rails = 2): Shape[] {
  let posts = '', caps = '', rl = '', rs = '';
  const n = Math.max(1, Math.round(w / gap));
  for (let r = 0; r < rails; r++) {
    const y = -h * (0.82 - (r * 0.5) / Math.max(1, rails - 1) * (rails > 1 ? 1 : 0));
    rl += rect(0, y, w, h * 0.11, 2);
    rs += rect(0, y + h * 0.075, w, h * 0.035);
  }
  for (let i = 0; i <= n; i++) {
    const x = (w * i) / n;
    posts += rect(x - h * 0.06, -h, h * 0.12, h, 2);
    caps += rect(x - h * 0.075, -h - h * 0.03, h * 0.15, h * 0.06, 2);
  }
  return [ol(rl, shade(col, 0.08), 1, -0.3), sh(rs, shade(col, -0.2)), ol(posts, col, 1, -0.3), sh(caps, shade(col, 0.18))];
}

/** White picket fence; origin bottom-left. */
export function picketFence(w: number, h: number, gap: number, col = F.white): Shape[] {
  let pk = '', sd = '';
  for (let x = gap * 0.2; x < w - gap * 0.3; x += gap) {
    const pw = gap * 0.56;
    pk += poly([[x, 0], [x, -h * 0.86], [x + pw / 2, -h], [x + pw, -h * 0.86], [x + pw, 0]]);
    sd += rect(x + pw * 0.68, -h * 0.84, pw * 0.32, h * 0.84);
  }
  return [ol(rect(0, -h * 0.72, w, h * 0.09) + rect(0, -h * 0.3, w, h * 0.09), shade(col, -0.1), 0.8, -0.3), ol(pk, col, 0.9, -0.25), sh(sd, shade(col, -0.1))];
}

/** Conical haystack. */
export function haystack(s: number): Shape[] {
  const g = rng(Math.round(s));
  let st = '';
  for (let i = 0; i < 22; i++) { const x = g.range(-0.34, 0.34) * s, y = -g.range(0.05, 0.7) * s; st += line([[x, y], [x + g.range(-3, 3), y + s * 0.09]]); }
  return [
    shadow(0, 0, s * 0.5, s * 0.05),
    ol(M(-s * 0.46, 0) + Q(-s * 0.46, -s * 0.5, -s * 0.1, -s * 0.92) + Q(0, -s * 1.04, s * 0.1, -s * 0.92) + Q(s * 0.46, -s * 0.5, s * 0.46, 0) + 'Z', F.straw, 1, -0.3),
    sh(M(s * 0.1, -s * 0.92) + Q(s * 0.46, -s * 0.5, s * 0.46, 0) + L(s * 0.18, 0) + Q(s * 0.2, -s * 0.5, s * 0.02, -s * 0.98) + 'Z', F.strawDk, { opacity: 0.5 }),
    stroke(st, shade(F.straw, -0.25), 1),
  ];
}

/** A pile of loose hay: a mound w wide and h tall with stray straws. */
export function hayPile(w: number, h: number, seed: number, col = F.straw): Shape[] {
  const g = rng(seed);
  let st = '', st2 = '', out = '';
  for (let i = 0; i < Math.round(w / 5); i++) {
    const x = g.range(-0.44, 0.44) * w, t = 1 - Math.abs(x / (w / 2)), y = -g.range(0.04, 0.9) * h * t, a = g.range(-70, 70) * (Math.PI / 180), l = g.range(8, 18);
    (i % 2 ? (st += line([[x, y], [x + Math.sin(a) * l, y - Math.cos(a) * l * 0.6]])) : (st2 += line([[x, y], [x + Math.sin(a) * l, y + Math.cos(a) * l * 0.5]])));
  }
  for (let i = 0; i < Math.round(w / 14); i++) {
    const x = g.range(-0.5, 0.5) * w, t = 1 - Math.abs(x / (w / 2)), y = -h * t * 0.86, a = g.range(-60, 60) * (Math.PI / 180), l = g.range(10, 22);
    out += line([[x, y], [x + Math.sin(a) * l, y - Math.cos(a) * l]]);
  }
  return [
    stroke(out, shade(col, -0.12), 1.6),
    ol(M(-w / 2, 0) + C(-w * 0.5, -h * 0.5, -w * 0.3, -h * 1.02, 0, -h) + C(w * 0.3, -h * 1.02, w * 0.5, -h * 0.5, w / 2, 0) + 'Z', col, 1, -0.28),
    sh(M(w * 0.08, -h * 0.98) + C(w * 0.32, -h, w * 0.5, -h * 0.5, w / 2, 0) + L(w * 0.2, 0) + C(w * 0.26, -h * 0.4, w * 0.2, -h * 0.8, w * 0.08, -h * 0.98) + 'Z', shade(col, -0.14), { opacity: 0.7 }),
    stroke(st, shade(col, -0.28), 1.2), stroke(st2, shade(col, 0.3), 1.2),
  ];
}

/** Strewn straw: short strokes scattered over an area. */
export function strewnStraw(x0: number, y0: number, w: number, h: number, count: number, seed: number, cols: string[] = [F.straw, F.strawLt, F.strawDk]): Shape[] {
  const g = rng(seed);
  const by = cols.map(() => '');
  for (let i = 0; i < count; i++) {
    const x = x0 + g.range(0, w), y = y0 + g.range(0, h), a = g.range(-0.6, 0.6), l = g.range(10, 26) * (0.6 + ((y - y0) / h) * 0.7);
    by[g.int(0, cols.length - 1)] += line([[x, y], [x + Math.cos(a) * l, y + Math.sin(a) * l * 0.5]]);
  }
  return nz(cols.map((c, i) => stroke(by[i], c, 1.8)));
}

// =====================================================================
// buildings
// =====================================================================
/** Clapboard farmhouse with a covered porch; origin bottom-centre, w wide. `lit` makes the windows glow. */
export function farmhouse(w: number, wall = '#f3ead6', roof = '#8a4a3a', trim = '#fbf6ec', shutter = '#5f8a6a'): Shape[] {
  const out: Shape[] = [];
  const top = -w * 0.62;
  // chimney (behind the roof)
  out.push(ol(rect(w * 0.24, -w * 1.0, w * 0.085, w * 0.2), '#b0583e', 1), sh(rect(w * 0.23, -w * 1.02, w * 0.105, w * 0.035, 2), '#8a412e'));
  let br = '';
  for (let i = 1; i < 6; i++) br += line([[w * 0.24, -w * 1.0 + i * w * 0.03], [w * 0.325, -w * 1.0 + i * w * 0.03]]);
  out.push(stroke(br, '#8a412e', 0.9));
  // main roof with shingle rows
  out.push(ol(poly([[-w * 0.56, top], [w * 0.56, top], [w * 0.43, -w * 0.9], [-w * 0.43, -w * 0.9]]), roof, 1.2));
  let sg = '', sv = '';
  for (let r = 1; r < 7; r++) {
    const y = -w * 0.9 + (r * w * 0.28) / 7, hw = w * 0.43 + (w * 0.13 * r) / 7;
    sg += line([[-hw, y], [hw, y]]);
    for (let x = -hw + (r % 2) * w * 0.02; x < hw; x += w * 0.04) sv += line([[x, y], [x, y + w * 0.04]]);
  }
  out.push(stroke(sg, shade(roof, -0.28), 1.1), stroke(sv, shade(roof, -0.22), 0.7), sh(rect(-w * 0.44, -w * 0.915, w * 0.88, w * 0.025, 2), shade(roof, -0.3)));
  // wall and clapboards
  out.push(ol(rect(-w / 2, top, w, w * 0.62), wall, 1.2, -0.25));
  let cb = '';
  for (let y = top + w * 0.03; y < -2; y += w * 0.03) cb += line([[-w / 2, y], [w / 2, y]]);
  out.push(stroke(cb, shade(wall, -0.13), 0.9), sh(rect(-w / 2, top, w, w * 0.03), '#000000', { opacity: 0.14 }), sh(rect(-w / 2, top, w * 0.035, w * 0.62) + rect(w / 2 - w * 0.035, top, w * 0.035, w * 0.62), trim));
  // central gable
  out.push(ol(poly([[-w * 0.19, top + 1], [-w * 0.19, -w * 0.72], [0, -w * 0.9], [w * 0.19, -w * 0.72], [w * 0.19, top + 1]]), wall, 1.2, -0.25));
  let gb = '';
  for (let y = -w * 0.84; y < top; y += w * 0.03) { const hw = Math.min(w * 0.19, ((y + w * 0.9) / (w * 0.18)) * w * 0.19); gb += line([[-hw, y], [hw, y]]); }
  out.push(stroke(gb, shade(wall, -0.13), 0.9));
  out.push(stroke(line([[-w * 0.215, -w * 0.7], [0, -w * 0.92], [w * 0.215, -w * 0.7]]), shade(roof, -0.15), w * 0.03), stroke(line([[-w * 0.215, -w * 0.715], [0, -w * 0.935], [w * 0.215, -w * 0.715]]), shade(roof, 0.15), w * 0.008));
  out.push(ol(circle(0, -w * 0.76, w * 0.045), '#ffe2a0', 1.6, -0.55), stroke(line([[-w * 0.045, -w * 0.76], [w * 0.045, -w * 0.76]]) + line([[0, -w * 0.805], [0, -w * 0.715]]), trim, 1.6));
  // windows with shutters
  const win = (cx: number, y: number, ww: number, wh: number, glow: string) => {
    out.push(sh(rect(cx - ww / 2 - ww * 0.42, y, ww * 0.38, wh, 1) + rect(cx + ww / 2 + ww * 0.04, y, ww * 0.38, wh, 1), shutter));
    let sl = '';
    for (let i = 1; i < 6; i++) sl += line([[cx - ww / 2 - ww * 0.4, y + (wh * i) / 6], [cx - ww / 2 - ww * 0.06, y + (wh * i) / 6]]) + line([[cx + ww / 2 + ww * 0.06, y + (wh * i) / 6], [cx + ww / 2 + ww * 0.4, y + (wh * i) / 6]]);
    out.push(stroke(sl, shade(shutter, -0.25), 0.8));
    out.push(ol(rect(cx - ww / 2 - 2, y - 2, ww + 4, wh + 4, 1), trim, 1, -0.3), sh(rect(cx - ww / 2, y, ww, wh), glow));
    out.push(sh(poly([[cx - ww / 2, y], [cx - ww * 0.1, y], [cx - ww / 2, y + wh * 0.6]]), '#ffffff', { opacity: 0.28 }));
    out.push(sh(M(cx - ww / 2, y) + L(cx - ww * 0.2, y) + Q(cx - ww * 0.26, y + wh * 0.55, cx - ww / 2, y + wh * 0.7) + 'Z' + M(cx + ww / 2, y) + L(cx + ww * 0.2, y) + Q(cx + ww * 0.26, y + wh * 0.55, cx + ww / 2, y + wh * 0.7) + 'Z', '#f6d9d0', { opacity: 0.9 }));
    out.push(stroke(line([[cx, y], [cx, y + wh]]) + line([[cx - ww / 2, y + wh / 2], [cx + ww / 2, y + wh / 2]]), trim, 1.8), sh(rect(cx - ww / 2 - 4, y + wh + 1, ww + 8, 3.5, 1), shade(trim, -0.12)));
  };
  win(-w * 0.34, -w * 0.565, w * 0.11, w * 0.14, '#ffe2a0');
  win(w * 0.34, -w * 0.565, w * 0.11, w * 0.14, '#9fb8c8');
  win(0, -w * 0.585, w * 0.1, w * 0.13, '#9fb8c8');
  win(-w * 0.33, -w * 0.27, w * 0.12, w * 0.17, '#ffe2a0');
  win(w * 0.33, -w * 0.27, w * 0.12, w * 0.17, '#ffd98a');
  // door
  out.push(ol(rect(-w * 0.075, -w * 0.3, w * 0.15, w * 0.26, 2), trim, 1), ol(rect(-w * 0.06, -w * 0.285, w * 0.12, w * 0.245, 1), '#b8402e', 1));
  out.push(sh(rect(-w * 0.045, -w * 0.265, w * 0.09, w * 0.08, 1), '#ffe2a0'), stroke(line([[0, -w * 0.265], [0, -w * 0.185]]), '#8f2f22', 1.4), stroke(rect(-w * 0.045, -w * 0.16, w * 0.09, w * 0.1, 1), '#8f2f22', 1), sh(circle(w * 0.04, -w * 0.15, w * 0.009), F.brass));
  // porch deck, steps
  out.push(ol(rect(-w * 0.56, -w * 0.05, w * 1.12, w * 0.05), '#b98a5c', 1), sh(rect(-w * 0.56, -w * 0.05, w * 1.12, w * 0.012), '#d4a878'));
  let lat = '';
  for (let x = -w * 0.55; x < w * 0.55; x += w * 0.03) lat += line([[x, -w * 0.038], [x, 0]]);
  out.push(stroke(lat, '#8a6238', 0.8));
  out.push(ol(rect(-w * 0.13, -w * 0.035, w * 0.26, w * 0.035), '#d4a878', 0.9), ol(rect(-w * 0.15, -w * 0.01, w * 0.3, w * 0.035), '#c79a68', 0.9));
  // railing
  let bal = '';
  for (const [a, b] of [[-0.52, -0.17], [0.17, 0.52]] as Pt[]) {
    for (let x = a + 0.03; x < b - 0.01; x += 0.03) bal += rect(x * w - 1.2, -w * 0.13, 2.4, w * 0.08);
    out.push(sh(rect(a * w, -w * 0.145, (b - a) * w, w * 0.018, 1) + rect(a * w, -w * 0.062, (b - a) * w, w * 0.012), trim));
  }
  out.push(sh(bal, trim));
  // posts and porch roof
  let ps = '';
  for (const x of [-0.53, -0.17, 0.17, 0.53]) ps += rect(x * w - w * 0.014, -w * 0.345, w * 0.028, w * 0.3);
  out.push(ol(ps, trim, 0.9, -0.25));
  out.push(ol(poly([[-w * 0.5, -w * 0.41], [w * 0.5, -w * 0.41], [w * 0.58, -w * 0.335], [-w * 0.58, -w * 0.335]]), shade(roof, 0.1), 1.1), sh(rect(-w * 0.58, -w * 0.338, w * 1.16, w * 0.02, 2), shade(roof, -0.3)));
  let pr = '';
  for (let i = 1; i < 16; i++) { const t = i / 16 - 0.5; pr += line([[t * w, -w * 0.41], [t * w * 1.16, -w * 0.335]]); }
  out.push(stroke(pr, shade(roof, -0.18), 0.8));
  // brackets, hanging basket and lamp
  let bk = '';
  for (const x of [-0.53, -0.17, 0.17, 0.53]) bk += M(x * w - w * 0.05, -w * 0.318) + Q(x * w - w * 0.014, -w * 0.31, x * w - w * 0.014, -w * 0.27) + M(x * w + w * 0.05, -w * 0.318) + Q(x * w + w * 0.014, -w * 0.31, x * w + w * 0.014, -w * 0.27);
  out.push(stroke(bk, trim, 1.6));
  out.push(stroke(line([[-w * 0.43, -w * 0.318], [-w * 0.43, -w * 0.28]]), F.ink, 1), sh(M(-w * 0.465, -w * 0.28) + L(-w * 0.395, -w * 0.28) + Q(-w * 0.43, -w * 0.235, -w * 0.465, -w * 0.28) + 'Z', '#8a5a36'));
  let fl = '', fl2 = '', lv = '';
  for (let i = 0; i < 6; i++) { const x = -w * 0.46 + i * w * 0.012, y = -w * 0.29 - (i % 2) * w * 0.012; (i % 2 ? (fl += circle(x, y, w * 0.011)) : (fl2 += circle(x, y, w * 0.011))); lv += leaf(x, -w * 0.276, w * 0.03, w * 0.008, 60 + i * 12); }
  out.push(sh(lv, '#5f8a45'), sh(fl, '#e8607a'), sh(fl2, '#f4a6b8'));
  out.push(stroke(line([[w * 0.1, -w * 0.318], [w * 0.1, -w * 0.3]]), F.ink, 1), ol(rect(w * 0.088, -w * 0.3, w * 0.024, w * 0.034, 1), '#ffe9a8', 1, -0.6), sh(circle(w * 0.1, -w * 0.283, w * 0.04), '#ffe9a8', { opacity: 0.22 }));
  return out;
}

/** Little hen house on stilts with a ramp and a nesting box; origin bottom-centre, s wide. */
export function henHouse(s: number, col = F.barn, roof = '#6f4a3a', trim = F.trim): Shape[] {
  const out: Shape[] = [];
  const floor = -s * 0.24, top = -s * 0.74;
  // stilts and shadow under
  out.push(shadow(0, 0, s * 0.56, s * 0.04, 0.22));
  out.push(ol(rect(-s * 0.42, floor, s * 0.06, s * 0.24) + rect(s * 0.36, floor, s * 0.06, s * 0.24) + rect(-s * 0.04, floor, s * 0.05, s * 0.24), F.woodDk, 1));
  out.push(stroke(line([[-s * 0.39, floor + s * 0.03], [s * 0.38, -s * 0.03]]), F.woodDk, 2));
  // nesting box on the right side
  out.push(ol(rect(s * 0.44, -s * 0.5, s * 0.18, s * 0.2), shade(col, -0.12), 1), ol(poly([[s * 0.43, -s * 0.52], [s * 0.64, -s * 0.47], [s * 0.64, -s * 0.44], [s * 0.43, -s * 0.49]]), roof, 1));
  out.push(stroke(line([[s * 0.5, -s * 0.48], [s * 0.5, -s * 0.3]]) + line([[s * 0.56, -s * 0.47], [s * 0.56, -s * 0.3]]), shade(col, -0.35), 0.9), stroke(line([[s * 0.44, -s * 0.3], [s * 0.6, -s * 0.24]]) , F.woodDk, 2));
  // body with planks
  out.push(ol(rect(-s * 0.45, top, s * 0.9, s * 0.5), col, 1.2));
  let pl = '';
  for (let i = 1; i < 12; i++) pl += line([[-s * 0.45 + i * s * 0.075, top], [-s * 0.45 + i * s * 0.075, floor]]);
  out.push(stroke(pl, shade(col, -0.22), 1), sh(rect(-s * 0.45, top, s * 0.9, s * 0.04), '#000000', { opacity: 0.18 }));
  // gable front and roof
  out.push(ol(poly([[-s * 0.45, top], [0, -s * 1.02], [s * 0.45, top]]), col, 1.2));
  out.push(stroke(line([[-s * 0.3, top], [-s * 0.3, -s * 0.83]]) + line([[-s * 0.15, top], [-s * 0.15, -s * 0.925]]) + line([[0, top], [0, -s * 1.02]]) + line([[s * 0.15, top], [s * 0.15, -s * 0.925]]) + line([[s * 0.3, top], [s * 0.3, -s * 0.83]]), shade(col, -0.22), 1));
  out.push(ol(poly([[-s * 0.56, -s * 0.7], [-s * 0.5, -s * 0.76], [0, -s * 1.1], [s * 0.5, -s * 0.76], [s * 0.56, -s * 0.7], [0, -s * 1.03]]), roof, 1.2), stroke(line([[-s * 0.53, -s * 0.73], [0, -s * 1.065], [s * 0.53, -s * 0.73]]), shade(roof, 0.2), 1.2));
  // vent heart / round window
  out.push(ol(circle(0, -s * 0.86, s * 0.055), '#2e2019', 1.6, 0), stroke(circle(0, -s * 0.86, s * 0.055), trim, 2), stroke(line([[-s * 0.055, -s * 0.86], [s * 0.055, -s * 0.86]]) + line([[0, -s * 0.915], [0, -s * 0.805]]), trim, 1.4));
  // pop hole with arch and ramp
  out.push(ol(M(-s * 0.31, floor) + L(-s * 0.31, -s * 0.46) + Q(-s * 0.31, -s * 0.58, -s * 0.2, -s * 0.58) + Q(-s * 0.09, -s * 0.58, -s * 0.09, -s * 0.46) + L(-s * 0.09, floor) + 'Z', '#2e2019', 3, 0));
  out.push(stroke(M(-s * 0.31, floor) + L(-s * 0.31, -s * 0.46) + Q(-s * 0.31, -s * 0.58, -s * 0.2, -s * 0.58) + Q(-s * 0.09, -s * 0.58, -s * 0.09, -s * 0.46) + L(-s * 0.09, floor), trim, 3));
  // window with wire
  out.push(ol(rect(s * 0.1, -s * 0.6, s * 0.24, s * 0.2, 2), '#f6d98a', 1, -0.5));
  let wr = '';
  for (let i = 1; i < 6; i++) wr += line([[s * 0.1 + i * s * 0.04, -s * 0.6], [s * 0.1 + i * s * 0.04, -s * 0.4]]);
  for (let i = 1; i < 5; i++) wr += line([[s * 0.1, -s * 0.6 + i * s * 0.04], [s * 0.34, -s * 0.6 + i * s * 0.04]]);
  out.push(stroke(wr, '#7a6a52', 0.7), stroke(rect(s * 0.1, -s * 0.6, s * 0.24, s * 0.2, 2), trim, 3));
  // corner trim
  out.push(sh(rect(-s * 0.45, top, s * 0.03, s * 0.5) + rect(s * 0.42, top, s * 0.03, s * 0.5) + rect(-s * 0.47, floor - s * 0.015, s * 0.94, s * 0.03, 2), trim));
  // ramp
  out.push(ol(poly([[-s * 0.3, floor], [-s * 0.1, floor], [-s * 0.42, 0], [-s * 0.66, 0]]), F.woodLt, 1));
  let cl = '';
  for (let i = 1; i < 6; i++) { const t = i / 6; cl += line([[-s * 0.3 - t * s * 0.36, floor + t * s * 0.24], [-s * 0.1 - t * s * 0.32, floor + t * s * 0.24]]); }
  out.push(stroke(cl, F.woodDk, 2));
  return out;
}

/** Distant barn with a gambrel roof and silo; origin bottom-centre of the barn, w wide. */
export function barnFar(w: number, col = F.barn): Shape[] {
  const h = w * 0.5;
  return [
    ol(rect(w * 0.56, -w * 0.95, w * 0.24, w * 0.95, 2), '#c9ccd0', 1), sh(M(w * 0.56, -w * 0.95) + Q(w * 0.68, -w * 1.18, w * 0.8, -w * 0.95) + 'Z', '#9aa4aa'),
    stroke(line([[w * 0.56, -w * 0.7], [w * 0.8, -w * 0.7]]) + line([[w * 0.56, -w * 0.45], [w * 0.8, -w * 0.45]]) + line([[w * 0.56, -w * 0.2], [w * 0.8, -w * 0.2]]), '#9aa4aa', 1),
    sh(rect(w * 0.72, -w * 0.95, w * 0.08, w * 0.95), '#000000', { opacity: 0.1 }),
    ol(poly([[-w / 2, 0], [-w / 2, -h], [-w * 0.42, -h - w * 0.26], [-w * 0.16, -h - w * 0.44], [w * 0.16, -h - w * 0.44], [w * 0.42, -h - w * 0.26], [w / 2, -h], [w / 2, 0]]), col, 1),
    stroke(line([[-w * 0.54, -h + 2], [-w * 0.44, -h - w * 0.28], [-w * 0.17, -h - w * 0.47], [w * 0.17, -h - w * 0.47], [w * 0.44, -h - w * 0.28], [w * 0.54, -h + 2]]), '#5e4238', w * 0.05),
    ol(rect(-w * 0.16, -h * 0.72, w * 0.32, h * 0.72), shade(col, -0.15), 1),
    stroke(rect(-w * 0.16, -h * 0.72, w * 0.32, h * 0.72) + line([[-w * 0.16, -h * 0.72], [w * 0.16, 0]]) + line([[w * 0.16, -h * 0.72], [-w * 0.16, 0]]) + line([[0, -h * 0.72], [0, 0]]), F.trim, Math.max(1.2, w * 0.018)),
    ol(rect(-w * 0.07, -h - w * 0.3, w * 0.14, w * 0.14), '#3b2a22', 1), stroke(rect(-w * 0.07, -h - w * 0.3, w * 0.14, w * 0.14), F.trim, Math.max(1.2, w * 0.018)),
  ];
}

/** Wind pump on a lattice tower; origin at the foot, s tall. */
export function windPump(s: number, col = '#6f7a80'): Shape[] {
  let lat = '', blades = '';
  for (let i = 0; i < 5; i++) { const y0 = -s * 0.14 * i, y1 = -s * 0.14 * (i + 1), w0 = s * 0.16 * (1 - i * 0.15), w1 = s * 0.16 * (1 - (i + 1) * 0.15); lat += line([[-w0, y0], [w1, y1]]) + line([[w0, y0], [-w1, y1]]) + line([[-w1, y1], [w1, y1]]); }
  for (let i = 0; i < 12; i++) blades += sector(0, -s * 0.76, s * 0.22, i * 30, i * 30 + 18, s * 0.05);
  return [
    stroke(line([[-s * 0.16, 0], [-s * 0.03, -s * 0.74]]) + line([[s * 0.16, 0], [s * 0.03, -s * 0.74]]) + lat, col, Math.max(1, s * 0.012)),
    sh(poly([[0, -s * 0.76], [s * 0.3, -s * 0.84], [s * 0.36, -s * 0.76], [s * 0.3, -s * 0.68]]), '#b8402e'),
    sh(blades, '#d5dde0', { stroke: col, strokeWidth: 0.6 }), sh(circle(0, -s * 0.76, s * 0.035), col),
  ];
}

/** Unbranded farm tractor facing right; origin on the ground under the middle, s long. */
export function tractor(s: number, col = F.red): Shape[] {
  const wheel = (cx: number, r: number): Shape[] => {
    let tr = '', sp = '';
    for (let i = 0; i < 14; i++) { const a = (i * 360) / 14; tr += xf(rect(-r * 0.09, -r * 1.06, r * 0.18, r * 0.14, 1), { rot: a, x: cx, y: -r }); }
    for (let i = 0; i < 6; i++) { const a = (i * 60 * Math.PI) / 180; sp += line([[cx, -r], [cx + Math.cos(a) * r * 0.5, -r + Math.sin(a) * r * 0.5]]); }
    return [sh(tr, '#2b2826'), ol(circle(cx, -r, r), '#3b3633', 1), sh(circle(cx, -r, r * 0.56), '#e8b63a'), stroke(sp, '#b88a1e', r * 0.08), sh(circle(cx, -r, r * 0.16), '#3b3633')];
  };
  return [
    shadow(0, 0, s * 0.52, s * 0.035),
    stroke(line([[s * 0.2, -s * 0.5], [s * 0.2, -s * 0.74]]), '#3b3633', s * 0.03), sh(rect(s * 0.18, -s * 0.78, s * 0.04, s * 0.05, 1), '#55504c'),
    stroke(line([[-s * 0.02, -s * 0.5], [-s * 0.08, -s * 0.64]]), '#3b3633', s * 0.02), stroke(line([[-s * 0.14, -s * 0.67], [-s * 0.02, -s * 0.61]]), '#3b3633', s * 0.03),
    ol(blob(sc(s, [[-0.3, -0.5], [-0.26, -0.66], [-0.12, -0.66], [-0.12, -0.5]]), 0.4), '#3b3633', 1),
    ol(poly(sc(s, [[-0.02, -0.5], [0.42, -0.5], [0.44, -0.3], [0.4, -0.2], [-0.1, -0.2], [-0.2, -0.3], [-0.2, -0.42]])), col, 1.2),
    sh(rect(0.3 * s, -0.46 * s, 0.11 * s, 0.2 * s, 2), shade(col, -0.25)), stroke(line(sc(s, [[0.32, -0.42], [0.4, -0.42]])) + line(sc(s, [[0.32, -0.37], [0.4, -0.37]])) + line(sc(s, [[0.32, -0.32], [0.4, -0.32]])), '#3b3633', 1.2),
    hl(rect(0.0, -0.48 * s, 0.28 * s, 0.03 * s, 2), 0.3), sh(circle(0.44 * s, -0.4 * s, 0.025 * s), '#ffe9a8'),
    ...wheel(0.32 * s, 0.13 * s),
    ol(M(-0.44 * s, -0.36 * s) + Q(-0.42 * s, -0.6 * s, -0.2 * s, -0.6 * s) + Q(0, -0.6 * s, 0.02 * s, -0.36 * s) + L(-0.03 * s, -0.36 * s) + Q(-0.04 * s, -0.54 * s, -0.2 * s, -0.54 * s) + Q(-0.38 * s, -0.54 * s, -0.39 * s, -0.36 * s) + 'Z', shade(col, -0.12), 1),
    ...wheel(-0.2 * s, 0.24 * s),
  ];
}

/** Stone well with a shingled roof, crank and rope; origin bottom-centre, s tall. The bucket is separate. */
export function well(s: number): Shape[] {
  const g = rng(41);
  const out: Shape[] = [shadow(0, 0, s * 0.42, s * 0.04, 0.22)];
  const rimY = -s * 0.36, hw = s * 0.3;
  // back of rim, dark inside
  out.push(sh(ellipse(0, rimY, hw, s * 0.07), '#3b3430'));
  // posts
  out.push(ol(rect(-hw - s * 0.01, -s * 0.82, s * 0.05, s * 0.5), F.woodDk, 1), ol(rect(hw - s * 0.04, -s * 0.82, s * 0.05, s * 0.5), F.woodDk, 1));
  // windlass, rope
  out.push(ol(rect(-hw, -s * 0.63, hw * 2, s * 0.055, s * 0.02), F.wood, 1));
  let rp = '';
  for (let i = 0; i < 6; i++) rp += line([[-s * 0.08 + i * s * 0.022, -s * 0.63], [-s * 0.07 + i * s * 0.022, -s * 0.575]]);
  out.push(sh(rect(-s * 0.09, -s * 0.64, s * 0.14, s * 0.075, 2), '#d9c08a'), stroke(rp, '#a88a52', 1));
  out.push(stroke(line([[hw + s * 0.01, -s * 0.6], [hw + s * 0.09, -s * 0.6], [hw + s * 0.09, -s * 0.5], [hw + s * 0.15, -s * 0.5]]), '#4a4440', s * 0.022));
  // stone drum
  out.push(ol(M(-hw, rimY) + L(-hw, -s * 0.02) + Q(0, s * 0.05, hw, -s * 0.02) + L(hw, rimY) + Q(0, rimY + s * 0.14, -hw, rimY) + 'Z', F.stone, 1.2));
  const cols = [shade(F.stone, 0.14), shade(F.stone, -0.1), '#c9bfae', '#a89e90'];
  const by = cols.map(() => '');
  for (let r = 0; r < 4; r++) {
    const y = rimY + s * 0.1 + r * s * 0.075;
    for (let x = -hw + (r % 2) * s * 0.05 + 3; x < hw - s * 0.06; x += s * 0.115) {
      const bw = s * g.range(0.08, 0.1), sag = (1 - (x / hw) * (x / hw)) * s * 0.035;
      by[g.int(0, cols.length - 1)] += rect(x, y + sag - s * 0.03, bw, s * 0.058, 3);
    }
  }
  cols.forEach((c, i) => by[i] && out.push(sh(by[i], c)));
  out.push(sh(M(hw * 0.5, rimY + s * 0.06) + L(hw, rimY) + L(hw, -s * 0.02) + Q(hw * 0.8, 0, hw * 0.55, s * 0.01) + 'Z', '#000000', { opacity: 0.12 }));
  // rim front
  out.push(stroke(M(-hw, rimY) + Q(0, rimY + s * 0.14, hw, rimY), shade(F.stone, 0.2), s * 0.035), stroke(M(-hw, rimY + s * 0.02) + Q(0, rimY + s * 0.16, hw, rimY + s * 0.02), F.stoneDk, 1));
  // roof
  out.push(ol(poly([[-s * 0.44, -s * 0.78], [0, -s * 1.02], [s * 0.44, -s * 0.78], [s * 0.4, -s * 0.74], [-s * 0.4, -s * 0.74]]), '#8a4a3a', 1.2));
  let sg = '';
  for (let i = 1; i < 5; i++) { const t = i / 5; sg += line([[-s * 0.44 * t, -s * 1.02 + t * s * 0.24], [s * 0.44 * t, -s * 1.02 + t * s * 0.24]]); }
  for (let i = -5; i <= 5; i++) sg += line([[i * s * 0.035, -s * 1.0 + Math.abs(i) * s * 0.02], [i * s * 0.075, -s * 0.76]]);
  out.push(stroke(sg, '#6a3528', 0.9), sh(rect(-s * 0.44, -s * 0.775, s * 0.88, s * 0.035, 2), '#6a3528'));
  return out;
}

/** Iron weathervane with a rooster; origin at the foot of the pole, s tall. */
export function weathervane(s: number, col = '#2f2a2a'): Shape[] {
  return [
    stroke(line([[0, 0], [0, -s * 0.72]]), col, s * 0.04),
    stroke(line([[-s * 0.3, -s * 0.3], [s * 0.3, -s * 0.3]]) + line([[0, -s * 0.18], [0, -s * 0.42]]), col, s * 0.03),
    sh(circle(-s * 0.32, -s * 0.3, s * 0.035) + circle(s * 0.32, -s * 0.3, s * 0.035) + circle(0, -s * 0.08, s * 0.05), col),
    sh(poly(sc(s, [[-0.42, -0.56], [-0.3, -0.62], [-0.3, -0.58], [0.26, -0.58], [0.26, -0.63], [0.4, -0.56], [0.26, -0.49], [0.26, -0.54], [-0.3, -0.54], [-0.3, -0.5]])), col),
    sh(blob(sc(s, [[-0.14, -0.62], [-0.22, -0.76], [-0.2, -0.9], [-0.1, -0.94], [-0.04, -0.84], [0.04, -0.76], [0.1, -0.86], [0.2, -0.98], [0.3, -0.9], [0.24, -0.72], [0.1, -0.62]]), 0.7), col),
    sh(poly(sc(s, [[-0.21, -0.86], [-0.3, -0.84], [-0.21, -0.81]])) + circle(-0.15 * s, -0.96 * s, 0.03 * s) + circle(-0.1 * s, -0.975 * s, 0.03 * s), col),
  ];
}

// =====================================================================
// animals
// =====================================================================
/** Hen (or rooster) facing left; origin at the feet, s tall. */
export function chicken(s: number, col = F.hen, rooster = false): Shape[] {
  const dk = shade(col, -0.25), out: Shape[] = [shadow(s * 0.04, 0, s * 0.3, s * 0.035)];
  if (rooster) {
    ['#22423c', '#2f5a50', '#3f7f6a', '#1f3530'].forEach((c, i) =>
      out.push(stroke(curve(sc(s, [[0.24, -0.46], [0.36 + i * 0.03, -0.86 + i * 0.07], [0.56 + i * 0.03, -0.9 + i * 0.1], [0.68 - i * 0.02, -0.62 + i * 0.1]])), c, 0.075 * s)));
  } else {
    let t = '';
    for (let i = 0; i < 4; i++) t += leaf(0.26 * s, -0.48 * s, 0.32 * s, 0.07 * s, -74 + i * 17);
    out.push(ol(t, dk, 0.8));
  }
  out.push(stroke(line(sc(s, [[-0.04, -0.22], [-0.06, -0.02]])) + line(sc(s, [[0.1, -0.22], [0.1, -0.02]])) + line(sc(s, [[-0.15, 0], [-0.06, -0.035], [0.01, 0]])) + line(sc(s, [[0.02, 0], [0.1, -0.035], [0.18, 0]])), '#e0a030', 0.035 * s));
  const cr = rooster ? 0.062 : 0.042;
  out.push(sh(circle(-0.31 * s, -0.93 * s, cr * s) + circle(-0.24 * s, -0.97 * s, cr * s * 1.1) + circle(-0.17 * s, -0.94 * s, cr * s), '#d8362c'));
  out.push(ol(blob(sc(s, [[-0.36, -0.84], [-0.26, -0.93], [-0.15, -0.86], [-0.1, -0.68], [0.1, -0.62], [0.32, -0.62], [0.42, -0.46], [0.3, -0.26], [0.04, -0.18], [-0.2, -0.24], [-0.3, -0.42], [-0.3, -0.62], [-0.38, -0.74]]), 0.9), col, 1.1, -0.28));
  if (rooster) out.push(sh(blob(sc(s, [[-0.36, -0.76], [-0.24, -0.84], [-0.12, -0.74], [-0.06, -0.52], [-0.18, -0.4], [-0.3, -0.46], [-0.3, -0.62]]), 0.9), '#e8b03a'), stroke(line(sc(s, [[-0.24, -0.7], [-0.2, -0.5]])) + line(sc(s, [[-0.17, -0.7], [-0.13, -0.52]])), '#c8862a', 1));
  out.push(ol(blob(sc(s, [[-0.1, -0.5], [0.12, -0.55], [0.3, -0.44], [0.14, -0.3], [-0.04, -0.34]]), 0.9), dk, 0.9, -0.2));
  out.push(stroke(curve(sc(s, [[0.0, -0.44], [0.1, -0.4], [0.2, -0.43]])) + curve(sc(s, [[0.02, -0.38], [0.1, -0.35], [0.17, -0.37]])), shade(col, -0.45), 0.9));
  out.push(sh(poly(sc(s, [[-0.37, -0.83], [-0.49, -0.78], [-0.37, -0.75]])), '#f2b92e'), sh(ellipse(-0.355 * s, -0.69 * s, (rooster ? 0.045 : 0.03) * s, (rooster ? 0.08 : 0.055) * s), '#d8362c'), sh(circle(-0.29 * s, -0.83 * s, 0.022 * s), '#2b2622'));
  return out;
}

/** Fluffy chick facing left; origin at the feet. */
export function chick(s: number, col = '#f6d04a'): Shape[] {
  return [
    stroke(line(sc(s, [[-0.06, -0.2], [-0.08, 0]])) + line(sc(s, [[0.1, -0.2], [0.1, 0]])), '#e08a2a', 0.06 * s),
    ol(ellipse(0.04 * s, -0.42 * s, 0.34 * s, 0.28 * s), col, 1, -0.25), ol(circle(-0.2 * s, -0.72 * s, 0.22 * s), col, 1, -0.25),
    sh(ellipse(0.12 * s, -0.4 * s, 0.16 * s, 0.11 * s, -15), shade(col, -0.15)),
    sh(poly(sc(s, [[-0.4, -0.74], [-0.56, -0.68], [-0.4, -0.62]])), '#e8862a'), sh(circle(-0.26 * s, -0.76 * s, 0.035 * s), '#2b2622'),
  ];
}

/** Pig facing left; origin under the middle, s long. */
export function pig(s: number, col = F.pink, muddy = false): Shape[] {
  const dk = shade(col, -0.18);
  const out: Shape[] = [shadow(0, 0, s * 0.46, s * 0.04, 0.22)];
  out.push(ol(rect(-s * 0.2, -s * 0.2, s * 0.08, s * 0.2, 3) + rect(s * 0.24, -s * 0.2, s * 0.08, s * 0.2, 3), dk, 1));
  out.push(stroke(curve(sc(s, [[0.42, -0.4], [0.5, -0.46], [0.52, -0.36], [0.46, -0.34], [0.5, -0.28]])), dk, 0.03 * s));
  out.push(ol(blob(sc(s, [[-0.36, -0.36], [-0.26, -0.56], [0.06, -0.6], [0.34, -0.56], [0.46, -0.38], [0.4, -0.18], [0.1, -0.12], [-0.22, -0.14]]), 0.9), col, 1.2, -0.25));
  if (muddy) out.push(sh(blob(sc(s, [[0.0, -0.2], [0.12, -0.3], [0.3, -0.26], [0.38, -0.2], [0.2, -0.14]]), 0.9) + ellipse(0.02 * s, -0.4 * s, 0.07 * s, 0.04 * s) , F.mud, { opacity: 0.55 }));
  out.push(ol(rect(-s * 0.08, -s * 0.18, s * 0.085, s * 0.18, 3) + rect(s * 0.32, -s * 0.18, s * 0.085, s * 0.18, 3), col, 1, -0.25), sh(rect(-s * 0.08, -s * 0.035, s * 0.085, s * 0.035) + rect(s * 0.32, -s * 0.035, s * 0.085, s * 0.035) + rect(-s * 0.2, -s * 0.035, s * 0.08, s * 0.035) + rect(s * 0.24, -s * 0.035, s * 0.08, s * 0.035), '#8a5a50'));
  out.push(ol(circle(-0.34 * s, -0.37 * s, 0.185 * s), col, 1.2, -0.25));
  out.push(ol(blob(sc(s, [[-0.38, -0.52], [-0.3, -0.68], [-0.18, -0.52], [-0.26, -0.44]]), 0.8), dk, 1, -0.2), ol(blob(sc(s, [[-0.5, -0.46], [-0.5, -0.62], [-0.38, -0.54]]), 0.8), dk, 1, -0.2));
  out.push(ol(ellipse(-0.5 * s, -0.32 * s, 0.065 * s, 0.08 * s), shade(col, -0.1), 1, -0.3), sh(ellipse(-0.52 * s, -0.33 * s, 0.014 * s, 0.024 * s) + ellipse(-0.475 * s, -0.33 * s, 0.014 * s, 0.024 * s), '#a05a52'));
  out.push(sh(circle(-0.4 * s, -0.43 * s, 0.02 * s), '#2b2622'), stroke(curve(sc(s, [[-0.46, -0.24], [-0.4, -0.2], [-0.32, -0.22]])), '#a05a52', 1), hl(ellipse(0.02 * s, -0.5 * s, 0.2 * s, 0.035 * s), 0.25));
  return out;
}

/** Woolly sheep facing left; origin under the middle, s long. */
export function sheep(s: number, wool = '#f6efe2'): Shape[] {
  let w = '';
  for (const [x, y, r] of [[-0.24, -0.42, 0.16], [-0.06, -0.5, 0.18], [0.14, -0.5, 0.18], [0.3, -0.42, 0.16], [0.26, -0.28, 0.15], [0.06, -0.24, 0.17], [-0.14, -0.26, 0.16], [-0.3, -0.3, 0.13]]) w += circle(x * s, y * s, r * s);
  return [
    stroke(line(sc(s, [[-0.18, -0.2], [-0.18, 0]])) + line(sc(s, [[-0.06, -0.2], [-0.06, 0]])) + line(sc(s, [[0.16, -0.2], [0.16, 0]])) + line(sc(s, [[0.28, -0.2], [0.28, 0]])), '#3b3430', 0.05 * s),
    ol(w, wool, 1, -0.16), ol(ellipse(-0.42 * s, -0.42 * s, 0.11 * s, 0.14 * s, 20), '#3b3430', 1), sh(ellipse(-0.33 * s, -0.52 * s, 0.07 * s, 0.035 * s, -30), '#3b3430'), sh(circle(-0.44 * s, -0.46 * s, 0.015 * s), '#fbf6ec'),
  ];
}

/** Cow seen side-on, facing left; origin under the middle, s long. */
export function cow(s: number, col = '#fbf6ec', patch = '#3b3430'): Shape[] {
  const out: Shape[] = [shadow(0, 0, s * 0.46, s * 0.035, 0.2)];
  out.push(stroke(curve(sc(s, [[0.42, -0.56], [0.48, -0.44], [0.47, -0.24]])), shade(col, -0.25), 0.02 * s), sh(ellipse(0.47 * s, -0.2 * s, 0.025 * s, 0.05 * s), patch));
  out.push(ol(poly(sc(s, [[-0.22, -0.3], [-0.14, -0.3], [-0.16, 0], [-0.22, 0]])) + poly(sc(s, [[0.24, -0.3], [0.33, -0.3], [0.3, 0], [0.24, 0]])), shade(col, -0.14), 1));
  out.push(sh(ellipse(0.2 * s, -0.24 * s, 0.07 * s, 0.05 * s), '#f0b0a4'));
  out.push(ol(blob(sc(s, [[-0.32, -0.6], [0.0, -0.66], [0.34, -0.63], [0.44, -0.5], [0.42, -0.32], [0.3, -0.24], [-0.1, -0.22], [-0.3, -0.26], [-0.37, -0.44]]), 0.8), col, 1.2, -0.28));
  out.push(sh(blob(sc(s, [[-0.1, -0.62], [0.12, -0.63], [0.16, -0.46], [0.02, -0.38], [-0.12, -0.46]]), 0.9) + blob(sc(s, [[0.26, -0.5], [0.4, -0.5], [0.4, -0.34], [0.3, -0.3]]), 0.9) + ellipse(-0.24 * s, -0.36 * s, 0.05 * s, 0.07 * s), patch));
  out.push(ol(poly(sc(s, [[-0.3, -0.28], [-0.22, -0.28], [-0.24, 0], [-0.3, 0]])) + poly(sc(s, [[0.33, -0.3], [0.42, -0.32], [0.39, 0], [0.33, 0]])), col, 1, -0.28), sh(rect(-0.3 * s, -0.04 * s, 0.06 * s, 0.04 * s) + rect(0.33 * s, -0.04 * s, 0.06 * s, 0.04 * s) + rect(-0.22 * s, -0.04 * s, 0.06 * s, 0.04 * s) + rect(0.24 * s, -0.04 * s, 0.06 * s, 0.04 * s), '#3b3430'));
  out.push(sh(leaf(-0.38 * s, -0.68 * s, 0.14 * s, 0.04 * s, -20), shade(col, -0.2)));
  out.push(ol(blob(sc(s, [[-0.34, -0.7], [-0.48, -0.7], [-0.58, -0.52], [-0.57, -0.4], [-0.47, -0.37], [-0.36, -0.48]]), 0.8), col, 1.1, -0.28));
  out.push(sh(blob(sc(s, [[-0.36, -0.69], [-0.46, -0.69], [-0.5, -0.58], [-0.4, -0.56]]), 0.9), patch), ol(ellipse(-0.54 * s, -0.43 * s, 0.06 * s, 0.05 * s, 20), '#f0b0a4', 0.9), sh(circle(-0.46 * s, -0.57 * s, 0.016 * s), '#2b2622'));
  out.push(sh(poly(sc(s, [[-0.44, -0.7], [-0.47, -0.79], [-0.4, -0.71]])), '#e8dcc0'));
  return out;
}

/** Cow's head and shoulders seen from the front (for a stall); origin bottom-centre of the chest, s tall. */
export function cowFront(s: number, col = '#fbf6ec', patch = '#4a3a34'): Shape[] {
  const out: Shape[] = [];
  out.push(ol(blob(sc(s, [[-0.44, 0], [-0.46, -0.3], [-0.3, -0.48], [0, -0.52], [0.3, -0.48], [0.46, -0.3], [0.44, 0]]), 0.8), col, 1.2, -0.28));
  out.push(sh(blob(sc(s, [[0.14, -0.44], [0.34, -0.4], [0.4, -0.16], [0.26, -0.06], [0.12, -0.2]]), 0.9) + blob(sc(s, [[-0.42, -0.2], [-0.3, -0.26], [-0.26, -0.08], [-0.4, -0.02]]), 0.9), patch));
  // ears
  out.push(ol(blob(sc(s, [[-0.2, -0.78], [-0.42, -0.86], [-0.5, -0.76], [-0.36, -0.68], [-0.2, -0.7]]), 0.9) + blob(sc(s, [[0.2, -0.78], [0.42, -0.86], [0.5, -0.76], [0.36, -0.68], [0.2, -0.7]]), 0.9), patch, 1, -0.2));
  out.push(sh(blob(sc(s, [[-0.24, -0.76], [-0.4, -0.81], [-0.44, -0.76], [-0.34, -0.72]]), 0.9) + blob(sc(s, [[0.24, -0.76], [0.4, -0.81], [0.44, -0.76], [0.34, -0.72]]), 0.9), '#f0b0a4'));
  // horns
  out.push(ol(M(-0.16 * s, -0.9 * s) + Q(-0.26 * s, -0.96 * s, -0.24 * s, -1.06 * s) + Q(-0.14 * s, -1.0 * s, -0.08 * s, -0.92 * s) + 'Z' + M(0.16 * s, -0.9 * s) + Q(0.26 * s, -0.96 * s, 0.24 * s, -1.06 * s) + Q(0.14 * s, -1.0 * s, 0.08 * s, -0.92 * s) + 'Z', '#e8dcc0', 1));
  // head
  out.push(ol(blob(sc(s, [[-0.2, -0.9], [0, -0.96], [0.2, -0.9], [0.24, -0.66], [0.2, -0.44], [0, -0.36], [-0.2, -0.44], [-0.24, -0.66]]), 0.9), col, 1.2, -0.28));
  out.push(sh(blob(sc(s, [[-0.2, -0.9], [-0.04, -0.95], [-0.06, -0.74], [-0.12, -0.58], [-0.23, -0.64]]), 0.9) + blob(sc(s, [[0.2, -0.9], [0.06, -0.94], [0.1, -0.76], [0.23, -0.7]]), 0.9), patch));
  out.push(sh(blob(sc(s, [[-0.06, -0.98], [0.06, -0.98], [0.1, -0.9], [0, -0.86], [-0.1, -0.9]]), 0.9), shade(col, -0.08)));
  out.push(ol(ellipse(0, -0.46 * s, 0.2 * s, 0.13 * s), '#f0b0a4', 1.1, -0.25), sh(ellipse(-0.08 * s, -0.48 * s, 0.03 * s, 0.04 * s) + ellipse(0.08 * s, -0.48 * s, 0.03 * s, 0.04 * s), '#a05a52'), stroke(curve(sc(s, [[-0.08, -0.4], [0, -0.37], [0.08, -0.4]])), '#a05a52', 1.2));
  out.push(sh(ellipse(-0.13 * s, -0.7 * s, 0.03 * s, 0.04 * s) + ellipse(0.13 * s, -0.7 * s, 0.03 * s, 0.04 * s), '#2b2622'), sh(circle(-0.125 * s, -0.715 * s, 0.01 * s) + circle(0.135 * s, -0.715 * s, 0.01 * s), '#ffffff'));
  return out;
}

/** Horse's head and neck facing left (for looking over a stall door); origin bottom-centre of the neck, s tall. */
export function horseHead(s: number, col = '#9a5a30', mane = '#3b2a22'): Shape[] {
  const out: Shape[] = [];
  out.push(ol(blob(sc(s, [[0.04, -0.98], [0.26, -0.8], [0.42, -0.4], [0.4, 0], [0.26, 0], [0.28, -0.4], [0.16, -0.72], [0.0, -0.88]]), 0.9), mane, 1));
  out.push(ol(poly(sc(s, [[-0.04, -0.92], [-0.02, -1.12], [0.08, -0.94]])), col, 1, -0.3), ol(poly(sc(s, [[0.06, -0.94], [0.12, -1.1], [0.17, -0.9]])), shade(col, -0.12), 1, -0.3));
  out.push(ol(blob(sc(s, [[0.3, 0], [0.32, -0.4], [0.2, -0.76], [0.04, -0.95], [-0.12, -0.93], [-0.28, -0.72], [-0.45, -0.47], [-0.5, -0.36], [-0.42, -0.27], [-0.27, -0.34], [-0.14, -0.46], [-0.16, -0.22], [-0.24, 0]]), 0.75), col, 1.2, -0.3));
  out.push(sh(blob(sc(s, [[-0.14, -0.46], [-0.02, -0.6], [0.06, -0.4], [0.02, -0.1], [-0.2, 0], [-0.16, -0.22]]), 0.8), shade(col, -0.1), { opacity: 0.6 }));
  out.push(sh(blob(sc(s, [[-0.1, -0.9], [-0.04, -0.88], [-0.3, -0.56], [-0.44, -0.44], [-0.46, -0.48], [-0.3, -0.68]]), 0.7), '#fbf3df'));
  out.push(sh(blob(sc(s, [[-0.5, -0.38], [-0.44, -0.46], [-0.36, -0.36], [-0.42, -0.27]]), 0.9), shade(col, -0.3), { opacity: 0.55 }), sh(ellipse(-0.44 * s, -0.37 * s, 0.018 * s, 0.028 * s, 30), '#2b2622'));
  out.push(sh(ellipse(-0.13 * s, -0.72 * s, 0.03 * s, 0.036 * s), '#2b2622'), sh(circle(-0.137 * s, -0.73 * s, 0.01 * s), '#ffffff'));
  out.push(sh(blob(sc(s, [[-0.06, -0.96], [0.04, -0.98], [0.0, -0.8], [-0.1, -0.84]]), 0.9), mane));
  // halter
  out.push(stroke(line(sc(s, [[-0.4, -0.52], [-0.29, -0.33]])) + line(sc(s, [[-0.35, -0.44], [-0.05, -0.62]])) + line(sc(s, [[-0.05, -0.62], [0.06, -0.92]])), '#c8452f', 0.03 * s), sh(circle(-0.35 * s, -0.44 * s, 0.022 * s), F.brass));
  return out;
}

/** Dog curled up asleep, head to the left; origin bottom-centre, s long. */
export function sleepyDog(s: number, col = '#c98d55', ear = '#7a4a2a'): Shape[] {
  const lt = shade(col, 0.35);
  return [
    shadow(0, 0, s * 0.54, s * 0.04, 0.22),
    stroke(curve(sc(s, [[0.42, -0.1], [0.54, -0.06], [0.4, -0.02], [0.18, -0.03]])), col, 0.07 * s),
    ol(blob(sc(s, [[-0.22, -0.01], [-0.3, -0.2], [-0.1, -0.36], [0.2, -0.4], [0.42, -0.28], [0.48, -0.1], [0.4, -0.01], [0, 0]]), 0.9), col, 1.2, -0.28),
    sh(blob(sc(s, [[0.06, -0.38], [0.28, -0.37], [0.4, -0.26], [0.3, -0.16], [0.1, -0.2]]), 0.9), ear, { opacity: 0.75 }),
    ol(ellipse(0.24 * s, -0.04 * s, 0.14 * s, 0.045 * s), lt, 1, -0.3),
    ol(blob(sc(s, [[-0.52, -0.07], [-0.5, -0.2], [-0.38, -0.31], [-0.2, -0.29], [-0.13, -0.15], [-0.2, -0.03], [-0.4, -0.01]]), 0.9), col, 1.2, -0.28),
    sh(blob(sc(s, [[-0.52, -0.07], [-0.5, -0.17], [-0.38, -0.2], [-0.32, -0.08], [-0.4, -0.02]]), 0.9), lt),
    ol(ellipse(-0.3 * s, -0.025 * s, 0.11 * s, 0.035 * s), lt, 1, -0.3),
    ol(blob(sc(s, [[-0.27, -0.3], [-0.15, -0.26], [-0.12, -0.06], [-0.22, -0.05], [-0.25, -0.16]]), 0.9), ear, 1),
    sh(ellipse(-0.51 * s, -0.12 * s, 0.03 * s, 0.025 * s), '#2b2622'),
    stroke(curve(sc(s, [[-0.4, -0.19], [-0.365, -0.165], [-0.33, -0.19]])), '#2b2622', 0.016 * s),
    stroke(curve(sc(s, [[-0.2, -0.24], [-0.14, -0.2], [-0.12, -0.12]])), '#c8452f', 0.03 * s),
  ];
}

/** Swallow in flight seen from below, head up; origin at the centre, s = wingspan. */
export function swallow(s: number): Shape[] {
  const c = '#27344e';
  return [
    sh(leaf(0, 0.12 * s, 0.36 * s, 0.035 * s, 76) + leaf(0, 0.12 * s, 0.36 * s, 0.035 * s, 104), c),
    sh(M(0, -0.08 * s) + Q(-0.3 * s, -0.16 * s, -0.5 * s, 0.1 * s) + Q(-0.24 * s, 0.0, 0, 0.06 * s) + 'Z' + M(0, -0.08 * s) + Q(0.3 * s, -0.16 * s, 0.5 * s, 0.1 * s) + Q(0.24 * s, 0.0, 0, 0.06 * s) + 'Z', c),
    sh(ellipse(0, 0.02 * s, 0.065 * s, 0.16 * s), '#f6ecd6'), sh(circle(0, -0.15 * s, 0.06 * s), c), sh(ellipse(0, -0.1 * s, 0.045 * s, 0.035 * s), '#b8402e'),
    sh(poly([[-0.015 * s, -0.2 * s], [0, -0.25 * s], [0.015 * s, -0.2 * s]]), '#2b2622'),
  ];
}

/** Mud swallows' nest tucked under a beam with hungry chicks; origin top-centre (where it meets the beam), s wide. */
export function swallowNest(s: number): Shape[] {
  const g = rng(6);
  let pel = '', pel2 = '';
  for (let i = 0; i < 26; i++) { const x = g.range(-0.4, 0.4) * s, y = g.range(0.22, 0.6) * s * (1 - Math.abs(x / (0.5 * s)) * 0.7); (i % 2 ? (pel += circle(x, y, s * 0.035)) : (pel2 += circle(x, y, s * 0.03))); }
  const out: Shape[] = [];
  for (const [x, r] of [[-0.2, -12], [0.02, 4], [0.22, 14]]) {
    out.push(...place([ol(circle(0, 0, 0.1 * s), '#27344e', 0.8), sh(ellipse(0, 0.05 * s, 0.07 * s, 0.045 * s), '#b8402e'), sh(poly([[-0.06 * s, -0.04 * s], [0, -0.2 * s], [0.06 * s, -0.04 * s]]), '#f2b92e'), sh(poly([[-0.03 * s, -0.05 * s], [0, -0.15 * s], [0.03 * s, -0.05 * s]]), '#c8452f'), sh(circle(-0.06 * s, 0.0, 0.015 * s) + circle(0.06 * s, 0.0, 0.015 * s), '#ffffff')], { x: x * s, y: 0.16 * s, rot: r }));
  }
  out.push(ol(M(-0.5 * s, 0.02 * s) + L(-0.44 * s, 0.2 * s) + Q(-0.4 * s, 0.66 * s, 0, 0.68 * s) + Q(0.4 * s, 0.66 * s, 0.44 * s, 0.2 * s) + L(0.5 * s, 0.02 * s) + L(0.4 * s, 0.02 * s) + Q(0.3 * s, 0.24 * s, 0, 0.24 * s) + Q(-0.3 * s, 0.24 * s, -0.4 * s, 0.02 * s) + 'Z', '#8a6a4a', 1.1));
  out.push(sh(pel, '#75573a'), sh(pel2, '#a08260'), stroke(line([[-0.36 * s, 0.24 * s], [-0.5 * s, 0.34 * s]]) + line([[0.3 * s, 0.26 * s], [0.48 * s, 0.3 * s]]) + line([[0.1 * s, 0.24 * s], [0.16 * s, 0.14 * s]]), F.straw, 1.4));
  return out;
}

/** Barn owl perched; origin at the feet, s tall. */
export function barnOwl(s: number): Shape[] {
  const g = rng(9);
  let sp = '';
  for (let i = 0; i < 12; i++) sp += circle(g.range(-0.14, 0.14) * s, -g.range(0.12, 0.5) * s, s * 0.012);
  return [
    sh(poly(sc(s, [[-0.1, -0.1], [0.1, -0.1], [0.06, 0.12], [-0.06, 0.12]])), '#b98a52'),
    ol(blob(sc(s, [[-0.26, -0.3], [-0.28, -0.66], [0, -0.82], [0.28, -0.66], [0.26, -0.3], [0.1, -0.04], [-0.1, -0.04]]), 0.9), '#d9a860', 1.1),
    ol(blob(sc(s, [[-0.17, -0.3], [-0.16, -0.58], [0, -0.66], [0.16, -0.58], [0.17, -0.3], [0.06, -0.08], [-0.06, -0.08]]), 0.9), '#fbf3df', 0.8, -0.15), sh(sp, '#b98a52'),
    ol(blob(sc(s, [[-0.26, -0.3], [-0.3, -0.56], [-0.2, -0.66], [-0.16, -0.36], [-0.12, -0.12]]), 0.8) + blob(sc(s, [[0.26, -0.3], [0.3, -0.56], [0.2, -0.66], [0.16, -0.36], [0.12, -0.12]]), 0.8), '#b98a52', 0.9),
    ol(M(0, -0.58 * s) + C(-0.1 * s, -0.56 * s, -0.3 * s, -0.66 * s, -0.27 * s, -0.86 * s) + C(-0.24 * s, -1.02 * s, -0.06 * s, -1.02 * s, 0, -0.92 * s) + C(0.06 * s, -1.02 * s, 0.24 * s, -1.02 * s, 0.27 * s, -0.86 * s) + C(0.3 * s, -0.66 * s, 0.1 * s, -0.56 * s, 0, -0.58 * s) + 'Z', '#fbf6ec', 1.6, -0.3),
    sh(circle(-0.11 * s, -0.82 * s, 0.04 * s) + circle(0.11 * s, -0.82 * s, 0.04 * s), '#2b2622'), sh(circle(-0.1 * s, -0.83 * s, 0.012 * s) + circle(0.12 * s, -0.83 * s, 0.012 * s), '#ffffff'),
    sh(poly(sc(s, [[-0.03, -0.76], [0.03, -0.76], [0, -0.67]])), '#e0a868'),
    stroke(line(sc(s, [[-0.07, -0.02], [-0.07, 0.03]])) + line(sc(s, [[-0.03, -0.02], [-0.03, 0.03]])) + line(sc(s, [[0.03, -0.02], [0.03, 0.03]])) + line(sc(s, [[0.07, -0.02], [0.07, 0.03]])), '#8a6a3a', 0.025 * s),
  ];
}

/** White duck facing left; origin at the feet, s long. */
export function duck(s: number, col = '#fbf6ec'): Shape[] {
  return [
    shadow(0, 0, s * 0.34, s * 0.035),
    stroke(line(sc(s, [[-0.02, -0.14], [-0.04, 0], [-0.12, 0]])) + line(sc(s, [[0.1, -0.14], [0.1, 0], [0.02, 0]])), '#e8862a', 0.04 * s),
    ol(blob(sc(s, [[-0.3, -0.3], [-0.12, -0.42], [0.2, -0.4], [0.46, -0.5], [0.38, -0.26], [0.14, -0.1], [-0.16, -0.1]]), 0.9), col, 1.1, -0.2),
    ol(blob(sc(s, [[-0.3, -0.3], [-0.34, -0.56], [-0.3, -0.72], [-0.18, -0.74], [-0.12, -0.62], [-0.14, -0.42], [-0.08, -0.3]]), 0.9), col, 1.1, -0.2),
    sh(blob(sc(s, [[-0.02, -0.34], [0.2, -0.36], [0.32, -0.28], [0.12, -0.18]]), 0.9), shade(col, -0.1)),
    ol(blob(sc(s, [[-0.32, -0.66], [-0.5, -0.62], [-0.5, -0.57], [-0.32, -0.58]]), 0.6), '#f2a02e', 0.9), sh(circle(-0.25 * s, -0.66 * s, 0.022 * s), '#2b2622'),
  ];
}

/** Bumble bee; origin at the centre, s long. */
export function bee(s: number): Shape[] {
  return [
    sh(ellipse(-0.06 * s, -0.3 * s, 0.2 * s, 0.13 * s, -30) + ellipse(0.16 * s, -0.3 * s, 0.2 * s, 0.13 * s, 30), '#eaf4f8', { stroke: '#8aa0a8', strokeWidth: 0.8, opacity: 0.9 }),
    ol(ellipse(0, 0, 0.36 * s, 0.24 * s), '#f2c02e', 1, -0.35),
    sh(rect(-0.1 * s, -0.235 * s, 0.09 * s, 0.47 * s, 2) + rect(0.1 * s, -0.215 * s, 0.09 * s, 0.43 * s, 2), '#2b2622'),
    sh(circle(-0.36 * s, -0.02 * s, 0.13 * s), '#2b2622'), sh(circle(-0.4 * s, -0.05 * s, 0.025 * s), '#ffffff'),
    stroke(line([[-0.42 * s, -0.12 * s], [-0.5 * s, -0.26 * s]]) + line([[-0.36 * s, -0.14 * s], [-0.38 * s, -0.3 * s]]), '#2b2622', 1),
    sh(poly([[0.34 * s, -0.04 * s], [0.46 * s, 0], [0.34 * s, 0.04 * s]]), '#2b2622'),
  ];
}

// =====================================================================
// yard things
// =====================================================================
/** Milk churn; origin bottom-centre, h tall. */
export function milkChurn(h: number, col = F.zinc): Shape[] {
  const body = M(-0.26 * h, 0) + L(-0.26 * h, -0.6 * h) + Q(-0.26 * h, -0.74 * h, -0.15 * h, -0.8 * h) + L(-0.15 * h, -0.9 * h) + L(0.15 * h, -0.9 * h) + L(0.15 * h, -0.8 * h) + Q(0.26 * h, -0.74 * h, 0.26 * h, -0.6 * h) + L(0.26 * h, 0) + 'Z';
  return [
    shadow(0.03 * h, 0, 0.34 * h, 0.035 * h, 0.24),
    stroke(M(-0.26 * h, -0.52 * h) + Q(-0.4 * h, -0.52 * h, -0.4 * h, -0.42 * h) + Q(-0.4 * h, -0.32 * h, -0.26 * h, -0.32 * h) + M(0.26 * h, -0.52 * h) + Q(0.4 * h, -0.52 * h, 0.4 * h, -0.42 * h) + Q(0.4 * h, -0.32 * h, 0.26 * h, -0.32 * h), shade(col, -0.35), 0.04 * h),
    ol(body, col, 1.3, -0.35),
    sh(M(0.1 * h, 0) + L(0.1 * h, -0.62 * h) + Q(0.1 * h, -0.74 * h, 0.06 * h, -0.8 * h) + L(0.15 * h, -0.8 * h) + Q(0.26 * h, -0.74 * h, 0.26 * h, -0.6 * h) + L(0.26 * h, 0) + 'Z', shade(col, -0.16)),
    hl(rect(-0.2 * h, -0.6 * h, 0.06 * h, 0.52 * h, 0.03 * h), 0.5),
    sh(rect(-0.26 * h, -0.6 * h, 0.52 * h, 0.03 * h) + rect(-0.26 * h, -0.08 * h, 0.52 * h, 0.03 * h), shade(col, -0.3)),
    ol(rect(-0.2 * h, -0.97 * h, 0.4 * h, 0.08 * h, 0.02 * h), shade(col, 0.15), 1.1, -0.4), ol(rect(-0.08 * h, -1.02 * h, 0.16 * h, 0.05 * h, 0.02 * h), shade(col, -0.1), 1, -0.3),
  ];
}

/** Pail with a bail handle; origin bottom-centre, s tall. `fill` paints the contents (milk, water, feed). */
export function bucket(s: number, col = F.zinc, fill?: string, handleUp = true): Shape[] {
  const out: Shape[] = [shadow(0, 0, s * 0.4, s * 0.05, 0.2)];
  if (handleUp) out.push(stroke(M(-0.42 * s, -0.92 * s) + C(-0.4 * s, -1.5 * s, 0.4 * s, -1.5 * s, 0.42 * s, -0.92 * s), shade(col, -0.45), 0.05 * s));
  out.push(ol(poly(sc(s, [[-0.44, -0.94], [0.44, -0.94], [0.33, 0], [-0.33, 0]])), col, 1.2, -0.35));
  out.push(sh(poly(sc(s, [[0.14, -0.94], [0.44, -0.94], [0.33, 0], [0.1, 0]])), shade(col, -0.16)), hl(poly(sc(s, [[-0.32, -0.86], [-0.22, -0.86], [-0.2, -0.1], [-0.27, -0.1]])), 0.4));
  out.push(sh(rect(-0.4 * s, -0.66 * s, 0.8 * s, 0.045 * s) + rect(-0.36 * s, -0.24 * s, 0.72 * s, 0.045 * s), shade(col, -0.28)));
  out.push(ol(ellipse(0, -0.94 * s, 0.46 * s, 0.1 * s), shade(col, 0.18), 1.1, -0.45), sh(ellipse(0, -0.93 * s, 0.4 * s, 0.07 * s), fill ?? shade(col, -0.45)));
  if (!handleUp) out.push(stroke(M(-0.46 * s, -0.92 * s) + C(-0.44 * s, -0.4 * s, 0.3 * s, -0.36 * s, 0.46 * s, -0.92 * s), shade(col, -0.45), 0.045 * s));
  return out;
}

/** Wooden feeding trough; origin bottom-centre, w wide. */
export function trough(w: number, fill = '#c9a86a'): Shape[] {
  return [
    shadow(0, 0, w * 0.54, w * 0.04, 0.22),
    ol(rect(-w * 0.42, -w * 0.08, w * 0.07, w * 0.08) + rect(w * 0.35, -w * 0.08, w * 0.07, w * 0.08), F.woodDk, 1),
    ol(poly([[-w / 2, -w * 0.3], [w / 2, -w * 0.3], [w * 0.44, -w * 0.06], [-w * 0.44, -w * 0.06]]), F.wood, 1.2),
    stroke(line([[-w * 0.48, -w * 0.2], [w * 0.48, -w * 0.2]]) + line([[-w * 0.46, -w * 0.13], [w * 0.46, -w * 0.13]]), shade(F.wood, -0.28), 1),
    ol(ellipse(0, -w * 0.3, w / 2, w * 0.05), shade(F.wood, 0.14), 1), sh(ellipse(0, -w * 0.3, w * 0.45, w * 0.032), fill),
  ];
}

/** Straw hat seen from the side; origin bottom-centre of the brim, s wide. */
export function strawHat(s: number, band = F.red): Shape[] {
  let w = '';
  for (let i = 1; i < 6; i++) w += M(-0.26 * s + i * 0.004 * s, -0.12 * s - i * 0.045 * s) + Q(0, -0.08 * s - i * 0.05 * s, 0.26 * s - i * 0.004 * s, -0.12 * s - i * 0.045 * s);
  return [
    ol(ellipse(0, -0.08 * s, 0.5 * s, 0.1 * s), F.straw, 1.1, -0.3), stroke(ellipse(0, -0.08 * s, 0.4 * s, 0.07 * s), shade(F.straw, -0.2), 0.9),
    ol(M(-0.27 * s, -0.1 * s) + C(-0.27 * s, -0.52 * s, 0.27 * s, -0.52 * s, 0.27 * s, -0.1 * s) + Q(0, -0.02 * s, -0.27 * s, -0.1 * s) + 'Z', shade(F.straw, 0.1), 1.1, -0.3),
    stroke(w, shade(F.straw, -0.2), 0.8),
    sh(M(-0.27 * s, -0.1 * s) + L(-0.268 * s, -0.19 * s) + Q(0, -0.1 * s, 0.268 * s, -0.19 * s) + L(0.27 * s, -0.1 * s) + Q(0, -0.02 * s, -0.27 * s, -0.1 * s) + 'Z', band),
  ];
}

/** Old cart wheel; origin at the hub, radius r. */
export function wagonWheel(r: number, col = F.wood): Shape[] {
  let sp = '';
  for (let i = 0; i < 10; i++) sp += xf(rect(-r * 0.035, -r * 0.86, r * 0.07, r * 0.72, 2), { rot: i * 36 });
  return [
    ol(sector(0, 0, r, 0, 360, r * 0.84), col, 1.2, -0.35), stroke(circle(0, 0, r * 0.99), '#55504c', r * 0.04),
    ol(sp, shade(col, 0.12), 0.9, -0.35), ol(circle(0, 0, r * 0.2), shade(col, -0.15), 1.2, -0.35), sh(circle(0, 0, r * 0.08), '#55504c'),
  ];
}

/** Hay fork standing upright, tines up; origin at the bottom of the handle, l long. */
export function pitchfork(l: number): Shape[] {
  return [
    ol(rect(-0.014 * l, -0.76 * l, 0.028 * l, 0.76 * l, 0.014 * l), '#c99a62', 1),
    stroke(M(-0.08 * l, -l) + L(-0.08 * l, -0.82 * l) + Q(-0.08 * l, -0.76 * l, 0, -0.76 * l) + Q(0.08 * l, -0.76 * l, 0.08 * l, -0.82 * l) + L(0.08 * l, -l) + M(0, -0.7 * l) + L(0, -l), '#59636a', 0.022 * l),
    sh(rect(-0.02 * l, -0.78 * l, 0.04 * l, 0.08 * l, 2), '#59636a'),
  ];
}

/** Spade standing upright, blade down; origin at the tip of the blade, l long. */
export function spade(l: number): Shape[] {
  return [
    ol(rect(-0.014 * l, -0.92 * l, 0.028 * l, 0.7 * l, 0.01 * l), '#c99a62', 1),
    stroke(M(-0.05 * l, -0.92 * l) + L(0.05 * l, -0.92 * l) + L(0.05 * l, -l) + L(-0.05 * l, -l) + 'Z', '#8a5a30', 0.022 * l),
    ol(M(-0.075 * l, -0.26 * l) + L(0.075 * l, -0.26 * l) + L(0.07 * l, -0.06 * l) + Q(0, 0.02 * l, -0.07 * l, -0.06 * l) + 'Z', '#8a949a', 1), hl(rect(-0.05 * l, -0.24 * l, 0.02 * l, 0.16 * l), 0.4),
  ];
}

/** Sickle; origin at the end of the handle, s long, blade curling up-right. */
export function sickle(s: number): Shape[] {
  return [
    ol(M(0, -0.3 * s) + C(-0.1 * s, -0.8 * s, 0.4 * s, -1.05 * s, 0.6 * s, -0.6 * s) + C(0.42 * s, -0.86 * s, 0.1 * s, -0.74 * s, 0.05 * s, -0.3 * s) + 'Z', '#aab4b9', 1, -0.4),
    ol(rect(-0.03 * s, -0.32 * s, 0.085 * s, 0.32 * s, 0.03 * s), '#8a5a30', 1),
  ];
}

/** Hand saw hanging blade-down; origin at the top of the handle, s long. */
export function handSaw(s: number): Shape[] {
  let teeth = '';
  for (let i = 0; i < 12; i++) teeth += poly([[0.12 * s, 0.22 * s + i * 0.062 * s], [0.155 * s, 0.25 * s + i * 0.062 * s], [0.12 * s, 0.28 * s + i * 0.062 * s]]);
  return [
    ol(poly([[-0.1 * s, 0.2 * s], [0.12 * s, 0.2 * s], [0.12 * s, 0.98 * s], [0.0, 0.98 * s]]), '#c2cacd', 1, -0.35), sh(teeth, '#9aa4a8'),
    ol(blob(sc(s, [[-0.14, 0], [0.14, 0], [0.16, 0.22], [-0.12, 0.24]]), 0.5), '#a8662e', 1), sh(ellipse(0.0, 0.11 * s, 0.07 * s, 0.045 * s), '#5e3520'),
  ];
}

/** Coil of rope hanging on a peg; origin at the peg, s across. */
export function ropeCoil(s: number, col = '#d9bd84'): Shape[] {
  let tw = '';
  for (let i = 0; i < 16; i++) { const a = (i * 22.5 * Math.PI) / 180; tw += line([[Math.cos(a) * 0.3 * s, 0.5 * s + Math.sin(a) * 0.36 * s], [Math.cos(a + 0.18) * 0.44 * s, 0.5 * s + Math.sin(a + 0.18) * 0.5 * s]]); }
  return [
    stroke(ellipse(0, 0.5 * s, 0.37 * s, 0.44 * s), shade(col, -0.3), 0.19 * s), stroke(ellipse(0, 0.5 * s, 0.37 * s, 0.44 * s), col, 0.15 * s),
    stroke(ellipse(0.02 * s, 0.52 * s, 0.3 * s, 0.37 * s), shade(col, -0.18), 0.02 * s), stroke(tw, shade(col, -0.28), 0.9),
    ol(rect(-0.09 * s, 0.0, 0.18 * s, 0.2 * s, 0.03 * s), shade(col, -0.12), 0.9), sh(circle(0, 0, 0.05 * s), '#4a4440'),
    stroke(curve([[0.06 * s, 0.94 * s], [0.14 * s, 1.1 * s], [0.08 * s, 1.24 * s]]), col, 0.05 * s),
  ];
}

/** Horseshoe, open end down; origin at the centre, s tall. */
export function horseshoe(s: number, col = '#7d858a'): Shape[] {
  let holes = '';
  for (const a of [160, 200, 240, 300, 340, 20]) holes += circle(Math.cos((a * Math.PI) / 180) * 0.34 * s, Math.sin((a * Math.PI) / 180) * 0.34 * s, 0.03 * s);
  return [ol(sector(0, -0.06 * s, 0.44 * s, 115, 425, 0.25 * s) + rect(-0.2 * s, 0.3 * s, 0.1 * s, 0.14 * s, 1) + rect(0.1 * s, 0.3 * s, 0.1 * s, 0.14 * s, 1), col, 1, -0.4), sh(xf(holes, { y: -0.06 * s }), '#3b3633'), hl(sector(0, -0.06 * s, 0.42 * s, 200, 250, 0.36 * s), 0.4)];
}

/** Western saddle on a wall rack; origin at the wall bracket under the saddle, s wide. */
export function saddle(s: number, col = F.leather, blanket = F.red, b2 = F.trim): Shape[] {
  const dk = shade(col, -0.25);
  let st = '';
  for (let i = 0; i < 7; i++) st += rect(-0.5 * s + i * 0.15 * s, -0.3 * s, 0.07 * s, 0.2 * s);
  return [
    ol(rect(-0.12 * s, -0.08 * s, 0.24 * s, 0.07 * s, 2), F.woodDk, 1), stroke(line([[-0.06 * s, -0.02 * s], [-0.14 * s, 0.14 * s]]) + line([[0.06 * s, -0.02 * s], [0.14 * s, 0.14 * s]]), F.woodDk, 0.035 * s),
    ol(poly(sc(s, [[-0.52, -0.32], [0.54, -0.32], [0.5, -0.08], [-0.5, -0.08]])), blanket, 1), sh(st, b2, { opacity: 0.85 }), sh(rect(-0.5 * s, -0.12 * s, s, 0.02 * s), shade(blanket, -0.25)),
    ol(blob(sc(s, [[-0.46, -0.3], [-0.4, -0.52], [0, -0.56], [0.42, -0.5], [0.48, -0.3], [0.3, -0.18], [-0.3, -0.18]]), 0.8), dk, 1.1),
    ol(poly(sc(s, [[-0.12, -0.44], [0.08, -0.44], [0.1, 0.1], [-0.08, 0.1]])), col, 1, -0.35),
    stroke(M(-0.07 * s, 0.1 * s) + L(-0.11 * s, 0.26 * s) + L(0.13 * s, 0.26 * s) + L(0.09 * s, 0.1 * s), '#7d858a', 0.035 * s),
    ol(blob(sc(s, [[-0.4, -0.5], [-0.37, -0.74], [-0.24, -0.62], [0.0, -0.54], [0.24, -0.6], [0.42, -0.8], [0.47, -0.56], [0.3, -0.44], [-0.26, -0.44]]), 0.8), col, 1.2, -0.35),
    ol(circle(-0.37 * s, -0.78 * s, 0.05 * s), dk, 1), hl(blob(sc(s, [[-0.2, -0.58], [0.0, -0.52], [0.2, -0.57], [0.0, -0.49]]), 0.9), 0.25),
    stroke(curve(sc(s, [[-0.36, -0.34], [0, -0.26], [0.38, -0.34]])), shade(col, 0.3), 0.9), sh(circle(-0.3 * s, -0.36 * s, 0.02 * s) + circle(0.34 * s, -0.36 * s, 0.02 * s), F.brass),
  ];
}

/** Bridle hanging on a peg; origin at the peg, s long. */
export function bridle(s: number, col = F.leatherDk): Shape[] {
  return [
    stroke(M(0, 0) + C(-0.3 * s, 0.1 * s, -0.24 * s, 0.6 * s, -0.1 * s, 0.66 * s) + M(0, 0) + C(0.3 * s, 0.1 * s, 0.24 * s, 0.6 * s, 0.1 * s, 0.66 * s) + M(-0.2 * s, 0.34 * s) + L(0.2 * s, 0.34 * s) + M(-0.1 * s, 0.66 * s) + L(0.1 * s, 0.66 * s), col, 0.045 * s),
    stroke(M(-0.1 * s, 0.66 * s) + C(-0.3 * s, 0.9 * s, 0.3 * s, 0.9 * s, 0.1 * s, 0.66 * s), shade(col, 0.15), 0.03 * s),
    stroke(circle(-0.12 * s, 0.66 * s, 0.045 * s) + circle(0.12 * s, 0.66 * s, 0.045 * s), '#aab4b9', 0.02 * s), sh(circle(0, 0, 0.04 * s), '#4a4440'),
  ];
}

/** Brass cow bell on a leather strap; origin at the top of the strap, s tall. */
export function cowbell(s: number): Shape[] {
  return [
    stroke(M(-0.14 * s, 0.36 * s) + C(-0.26 * s, 0.0, 0.26 * s, 0.0, 0.14 * s, 0.36 * s), F.leather, 0.08 * s),
    ol(poly(sc(s, [[-0.2, 0.34], [0.2, 0.34], [0.34, 0.9], [-0.34, 0.9]])), F.brass, 1.2, -0.35), sh(poly(sc(s, [[0.06, 0.34], [0.2, 0.34], [0.34, 0.9], [0.14, 0.9]])), shade(F.brass, -0.18)),
    hl(poly(sc(s, [[-0.14, 0.4], [-0.07, 0.4], [-0.14, 0.82], [-0.24, 0.82]])), 0.45), sh(rect(-0.35 * s, 0.86 * s, 0.7 * s, 0.06 * s, 2), shade(F.brass, -0.3)), sh(circle(0, 0.97 * s, 0.07 * s), '#55504c'),
  ];
}

/** Three-legged milking stool; origin bottom-centre, s wide. */
export function milkingStool(s: number, col = F.woodLt): Shape[] {
  return [
    shadow(0, 0, s * 0.5, s * 0.05, 0.2),
    ol(poly(sc(s, [[-0.3, -0.56], [-0.2, -0.56], [-0.36, 0], [-0.46, 0]])) + poly(sc(s, [[0.2, -0.56], [0.3, -0.56], [0.46, 0], [0.36, 0]])) + rect(-0.05 * s, -0.56 * s, 0.1 * s, 0.5 * s), shade(col, -0.2), 1),
    ol(rect(-0.46 * s, -0.66 * s, 0.92 * s, 0.12 * s, 0.04 * s), shade(col, -0.08), 1.1), ol(ellipse(0, -0.66 * s, 0.46 * s, 0.1 * s), col, 1.1),
    stroke(ellipse(0, -0.66 * s, 0.3 * s, 0.055 * s) + ellipse(0, -0.66 * s, 0.14 * s, 0.025 * s), shade(col, -0.2), 0.8),
  ];
}

/** Ladder standing upright; origin bottom-centre. Rotate it with place() to lean it. */
export function ladder(w: number, h: number, rungs: number, col = F.woodLt): Shape[] {
  let rg = '', rgS = '';
  for (let i = 0; i < rungs; i++) { const y = -h * ((i + 0.6) / (rungs + 0.2)); rg += rect(-w / 2, y, w, w * 0.11, 2); rgS += rect(-w / 2, y + w * 0.08, w, w * 0.03); }
  return [ol(rg, shade(col, -0.08), 0.9), sh(rgS, shade(col, -0.3)), ol(rect(-w / 2 - w * 0.07, -h, w * 0.13, h, 2) + rect(w / 2 - w * 0.06, -h, w * 0.13, h, 2), col, 1.1, -0.35), hl(rect(-w / 2 - w * 0.05, -h, w * 0.03, h), 0.22)];
}

/** Cobweb for a corner; origin at the corner, spreading right and down, s across. */
export function cobweb(s: number): Shape {
  let d = '';
  const rays = [0, 22, 45, 68, 90];
  for (const a of rays) d += line([[0, 0], [Math.cos((a * Math.PI) / 180) * s, Math.sin((a * Math.PI) / 180) * s]]);
  for (const k of [0.3, 0.52, 0.76]) for (let i = 0; i < rays.length - 1; i++) {
    const a0 = (rays[i] * Math.PI) / 180, a1 = (rays[i + 1] * Math.PI) / 180, am = (a0 + a1) / 2;
    d += M(Math.cos(a0) * s * k, Math.sin(a0) * s * k) + Q(Math.cos(am) * s * k * 0.86, Math.sin(am) * s * k * 0.86, Math.cos(a1) * s * k, Math.sin(a1) * s * k);
  }
  return stroke(d, '#f3ead6', 0.9, { opacity: 0.55 });
}

/** Straw bee skep; origin bottom-centre, s tall. */
export function beeSkep(s: number): Shape[] {
  let rings = '';
  for (let i = 1; i < 7; i++) { const y = -i * 0.13 * s, hw = 0.42 * s * Math.sqrt(Math.max(0, 1 - Math.pow(i / 7.4, 2.2))); rings += M(-hw, y) + Q(0, y + 0.06 * s, hw, y); }
  return [
    shadow(0, 0, s * 0.5, s * 0.04, 0.2),
    ol(M(-0.44 * s, 0) + C(-0.46 * s, -0.6 * s, -0.26 * s, -0.98 * s, 0, -0.98 * s) + C(0.26 * s, -0.98 * s, 0.46 * s, -0.6 * s, 0.44 * s, 0) + 'Z', F.straw, 1.2, -0.3),
    sh(M(0.12 * s, -0.96 * s) + C(0.32 * s, -0.9 * s, 0.46 * s, -0.6 * s, 0.44 * s, 0) + L(0.2 * s, 0) + C(0.26 * s, -0.5 * s, 0.22 * s, -0.8 * s, 0.12 * s, -0.96 * s) + 'Z', F.strawDk, { opacity: 0.6 }),
    stroke(rings, shade(F.straw, -0.3), 1.2), sh(M(-0.1 * s, 0) + L(-0.1 * s, -0.1 * s) + Q(0, -0.2 * s, 0.1 * s, -0.1 * s) + L(0.1 * s, 0) + 'Z', '#3b2a1c'),
  ];
}

// ---- washing on the line (each hangs from its origin at the top centre) ----
const pegs = (xs: number[], s: number): Shape => sh(xs.map((x) => rect(x - s * 0.5, -s * 1.2, s, s * 2.6, s * 0.3)).join(''), '#d9b98a', { stroke: '#a8824e', strokeWidth: 0.7 });

/** Shirt pegged by the shoulders; w wide across the body. */
export function shirt(w: number, col: string, check?: string): Shape[] {
  const out: Shape[] = [ol(poly(sc(w, [[-0.3, 0], [-0.1, 0.02], [0, 0.08], [0.1, 0.02], [0.3, 0], [0.58, 0.3], [0.44, 0.44], [0.31, 0.32], [0.33, 1.0], [-0.33, 1.0], [-0.31, 0.32], [-0.44, 0.44], [-0.58, 0.3]])), col, 1.1, -0.3)];
  if (check) {
    let v = '', hh = '';
    for (let i = -2; i <= 2; i++) v += line([[i * 0.11 * w, 0.1 * w], [i * 0.115 * w, 0.98 * w]]);
    for (let i = 0; i < 6; i++) hh += line([[-0.31 * w, (0.22 + i * 0.14) * w], [0.31 * w, (0.22 + i * 0.14) * w]]);
    out.push(stroke(v, check, 2.4, { opacity: 0.55 }), stroke(hh, check, 2.4, { opacity: 0.55 }));
  }
  out.push(sh(poly(sc(w, [[-0.1, 0.02], [0, 0.08], [0.1, 0.02], [0, 0.2]])), shade(col, -0.3)), stroke(line([[0, 0.2 * w], [0, w]]), shade(col, -0.3), 1), sh(circle(0.025 * w, 0.36 * w, 0.016 * w) + circle(0.025 * w, 0.56 * w, 0.016 * w) + circle(0.025 * w, 0.76 * w, 0.016 * w), '#fbf6ec'));
  out.push(pegs([-0.26 * w, 0.26 * w], Math.max(4, w * 0.05)));
  return out;
}

/** A pair of socks pegged at the cuffs; s tall. */
export function socks(s: number, col: string, stripe = '#fbf6ec'): Shape[] {
  const one = (dx: number): Shape[] => {
    const d = M(dx - 0.14 * s, 0) + L(dx + 0.14 * s, 0) + L(dx + 0.14 * s, 0.56 * s) + Q(dx + 0.14 * s, 0.7 * s, dx + 0.3 * s, 0.76 * s) + Q(dx + 0.46 * s, 0.86 * s, dx + 0.34 * s, 0.98 * s) + Q(dx + 0.1 * s, 1.04 * s, dx - 0.08 * s, 0.9 * s) + Q(dx - 0.14 * s, 0.82 * s, dx - 0.14 * s, 0.6 * s) + 'Z';
    return [ol(d, col, 1, -0.3), sh(rect(dx - 0.14 * s, 0.02 * s, 0.28 * s, 0.1 * s) + rect(dx - 0.14 * s, 0.2 * s, 0.28 * s, 0.06 * s) + rect(dx - 0.14 * s, 0.32 * s, 0.28 * s, 0.06 * s), stripe), sh(blob([[dx + 0.24 * s, 0.82 * s], [dx + 0.4 * s, 0.86 * s], [dx + 0.34 * s, 0.98 * s], [dx + 0.2 * s, 0.98 * s]], 0.9), shade(col, -0.25))];
  };
  return [...one(-0.24 * s), ...one(0.24 * s), pegs([-0.24 * s, 0.24 * s], Math.max(4, s * 0.07))];
}

/** Sheet or towel with a soft billow; w wide, h long. */
export function sheet(w: number, h: number, col: string, stripe?: string): Shape[] {
  const d = M(-w / 2, 0) + L(w / 2, 0) + Q(w / 2 + w * 0.03, h / 2, w / 2 - w * 0.02, h) + Q(w * 0.2, h + w * 0.06, 0, h - w * 0.01) + Q(-w * 0.26, h - w * 0.07, -w / 2 + w * 0.03, h) + Q(-w / 2 - w * 0.03, h / 2, -w / 2, 0) + 'Z';
  const out: Shape[] = [ol(d, col, 1.1, -0.25)];
  if (stripe) out.push(sh(rect(-w / 2 + 2, h * 0.1, w - 4, h * 0.06) + rect(-w / 2 + 2, h * 0.2, w - 4, h * 0.03) + rect(-w / 2 + 2, h * 0.76, w - 5, h * 0.06) + rect(-w / 2 + 2, h * 0.7, w - 5, h * 0.03), stripe, { opacity: 0.8 }));
  out.push(stroke(curve([[-w * 0.22, h * 0.04], [-w * 0.26, h * 0.5], [-w * 0.2, h * 0.92]]) + curve([[w * 0.16, h * 0.04], [w * 0.12, h * 0.5], [w * 0.2, h * 0.96]]), shade(col, -0.16), 1.2));
  out.push(pegs([-w * 0.4, 0, w * 0.4], Math.max(4, w * 0.035)));
  return out;
}

/** Dungarees pegged by the straps; s wide at the hips. */
export function dungarees(s: number, col = '#5a7fb0'): Shape[] {
  const dk = shade(col, -0.25);
  return [
    stroke(line([[-0.26 * s, 0], [-0.2 * s, 0.34 * s]]) + line([[0.26 * s, 0], [0.2 * s, 0.34 * s]]), dk, 0.07 * s),
    ol(poly(sc(s, [[-0.24, 0.3], [0.24, 0.3], [0.28, 0.62], [0.5, 0.66], [0.52, 1.7], [0.1, 1.7], [0.02, 0.98], [-0.02, 0.98], [-0.1, 1.7], [-0.52, 1.7], [-0.5, 0.66], [-0.28, 0.62]])), col, 1.2, -0.3),
    stroke(rect(-0.14 * s, 0.38 * s, 0.28 * s, 0.18 * s, 2) + line([[-0.5 * s, 0.7 * s], [0.5 * s, 0.7 * s]]) + line([[-0.5 * s, 1.6 * s], [-0.1 * s, 1.6 * s]]) + line([[0.1 * s, 1.6 * s], [0.5 * s, 1.6 * s]]), '#f2d08a', 1.1),
    sh(circle(-0.2 * s, 0.34 * s, 0.035 * s) + circle(0.2 * s, 0.34 * s, 0.035 * s), F.brass), sh(rect(0.2 * s, 1.1 * s, 0.2 * s, 0.2 * s, 2), '#c8452f'),
    pegs([-0.26 * s, 0.26 * s], Math.max(4, s * 0.06)),
  ];
}

// =====================================================================
// market
// =====================================================================
/** Back of a market stall: posts, dark plank back wall and a shelf. Origin bottom-left; h overall, counter at ch. */
export function stallBack(w: number, h: number, ch: number, wood: string, seed: number): Shape[] {
  const g = rng(seed);
  const out: Shape[] = [];
  const n = Math.round(w / 34);
  let a = '', b = '', seams = '';
  for (let i = 0; i < n; i++) { const x = (w * i) / n; (g.next() < 0.5 ? (a += rect(x, -h + 8, w / n, h - ch - 8)) : (b += rect(x, -h + 8, w / n, h - ch - 8))); if (i) seams += line([[x, -h + 8], [x, -ch]]); }
  out.push(sh(rect(0, -h + 8, w, h - ch - 8), wood), sh(a, shade(wood, -0.08)), sh(b, shade(wood, 0.06)), stroke(seams, shade(wood, -0.3), 1));
  out.push(sh(rect(0, -h + 8, w, (h - ch) * 0.34), '#000000', { opacity: 0.2 }));
  out.push(ol(rect(-6, -h, 12, h, 2) + rect(w - 6, -h, 12, h, 2), shade(wood, 0.2), 1, -0.4));
  return out;
}

/** Front of a market stall: counter slab and a cloth skirt down to the ground. Origin bottom-left. */
export function stallFront(w: number, ch: number, cloth: string, stripe: string | null, slab = F.woodLt): Shape[] {
  const out: Shape[] = [];
  const hem = -6;
  let sc2 = M(4, -ch + 4) + L(w - 4, -ch + 4) + L(w - 4, hem);
  const n = Math.round(w / 40);
  for (let i = n; i > 0; i--) { const x1 = 4 + ((w - 8) * i) / n, x0 = 4 + ((w - 8) * (i - 1)) / n; sc2 += Q((x0 + x1) / 2, hem + 12, x0, hem); }
  sc2 += 'Z';
  out.push(sh(rect(10, -30, w - 20, 30), '#3b2a1c', { opacity: 0.35 }), ol(sc2, cloth, 1, -0.25));
  if (stripe) {
    let st = '';
    for (let i = 0; i < n * 2; i++) if (i % 2) st += rect(4 + ((w - 8) * i) / (n * 2), -ch + 4, (w - 8) / (n * 2), ch - 12);
    out.push(sh(st, stripe, { opacity: 0.9 }));
  }
  let folds = '';
  for (let i = 1; i < n; i++) { const x = 4 + ((w - 8) * i) / n; folds += line([[x, -ch + 10], [x + 2, hem]]); }
  out.push(stroke(folds, shade(cloth, -0.2), 1, { opacity: 0.7 }), sh(rect(4, -ch + 4, w - 8, 12), '#000000', { opacity: 0.16 }));
  out.push(ol(rect(-10, -ch - 10, w + 20, 16, 3), slab, 1.1, -0.35), sh(rect(-10, -ch - 10, w + 20, 5, 3), shade(slab, 0.2)));
  return out;
}

/** A plank shelf on two brackets; origin left end on the top surface. */
export function shelf(w: number, col = F.wood): Shape[] {
  return [sh(poly([[w * 0.08, 8], [w * 0.08 + 8, 8], [w * 0.08, 26]]) + poly([[w * 0.92, 8], [w * 0.92 - 8, 8], [w * 0.92, 26]]), shade(col, -0.4)), ol(rect(0, 0, w, 9, 2), col, 1, -0.35), sh(rect(0, 0, w, 3, 2), shade(col, 0.2))];
}

/** Crate tilted for display with produce heaped inside; origin bottom-centre. */
export function produceCrate(w: number, h: number, col: string, kinds: Veg[], seed: number, r = w * 0.085, rows = 2): Shape[] {
  return [sh(rect(-w / 2, -h - r * 0.6, w, h * 0.7 + r * 0.6, 2), shade(col, -0.45)), ...place(pile(w * 0.98, r, kinds, seed, rows), { y: -h * 0.86 }), ...sCrate(w, h, col)];
}

/** Wicker basket heaped with produce; origin bottom-centre. */
export function produceBasket(w: number, h: number, kinds: Veg[], seed: number, r = w * 0.1, rows = 2, col = '#c99a5b'): Shape[] {
  return [...place(pile(w * 0.94, r, kinds, seed, rows), { y: -h * 0.92 }), ...sBasket(w, h, col)];
}

type Icon = 'carrot' | 'apple' | 'egg' | 'cheese' | 'flower' | 'bread' | 'honey' | 'milk' | 'cherry' | 'pear';
/** Chalk doodle path centred on the origin, about u across. */
export function chalkIcon(kind: Icon, u: number): string {
  const k = (pts: number[][]) => sc(u, pts);
  switch (kind) {
    case 'carrot': return poly(k([[-0.28, -0.2], [-0.02, -0.34], [0.42, 0.42]])) + line(k([[-0.18, -0.3], [-0.42, -0.44]])) + line(k([[-0.16, -0.3], [-0.26, -0.52]])) + line(k([[-0.14, -0.3], [-0.08, -0.5]])) + line(k([[-0.1, -0.12], [0.02, -0.18]])) + line(k([[0.06, 0.04], [0.16, -0.02]]));
    case 'apple': return blob(k([[0, -0.22], [0.26, -0.34], [0.4, -0.06], [0.28, 0.32], [0, 0.38], [-0.28, 0.32], [-0.4, -0.06], [-0.26, -0.34]]), 0.9) + line(k([[0, -0.22], [0.04, -0.44]])) + leaf(0.04 * u, -0.4 * u, 0.26 * u, 0.08 * u, -25);
    case 'egg': return xf(M(0, -0.4 * u) + C(0.2 * u, -0.4 * u, 0.3 * u, -0.1 * u, 0.3 * u, 0.08 * u) + C(0.3 * u, 0.28 * u, 0.16 * u, 0.4 * u, 0, 0.4 * u) + C(-0.16 * u, 0.4 * u, -0.3 * u, 0.28 * u, -0.3 * u, 0.08 * u) + C(-0.3 * u, -0.1 * u, -0.2 * u, -0.4 * u, 0, -0.4 * u) + 'Z', { rot: 12, x: -0.16 * u }) + xf(ellipse(0, 0.08 * u, 0.24 * u, 0.32 * u), { rot: -14, x: 0.26 * u, y: 0.04 * u });
    case 'cheese': return poly(k([[-0.44, 0.08], [0.3, -0.34], [0.44, -0.06], [0.44, 0.3], [-0.44, 0.34]])) + line(k([[-0.44, 0.08], [0.44, -0.06]])) + circle(-0.06 * u, 0.2 * u, 0.06 * u) + circle(0.22 * u, 0.12 * u, 0.045 * u) + circle(0.3 * u, 0.24 * u, 0.03 * u);
    case 'flower': { let d = circle(0, -0.14 * u, 0.09 * u) + line(k([[0, 0.1], [0, 0.48]])) + leaf(0, 0.36 * u, 0.24 * u, 0.07 * u, -35) + leaf(0, 0.4 * u, 0.22 * u, 0.07 * u, -150); for (let i = 0; i < 6; i++) d += petal(0, -0.14 * u, 0.28 * u, 0.09 * u, i * 60); return d; }
    case 'bread': return M(-0.44 * u, 0.26 * u) + C(-0.5 * u, -0.2 * u, -0.2 * u, -0.34 * u, 0, -0.34 * u) + C(0.2 * u, -0.34 * u, 0.5 * u, -0.2 * u, 0.44 * u, 0.26 * u) + 'Z' + line(k([[-0.22, -0.2], [-0.12, 0.02]])) + line(k([[-0.02, -0.24], [0.08, -0.02]])) + line(k([[0.18, -0.2], [0.28, 0.02]]));
    case 'honey': { let d = ''; for (const [x, y] of [[-0.22, -0.13], [0.22, -0.13], [0, 0.25]]) { const p: Pt[] = []; for (let i = 0; i < 6; i++) p.push([x * u + Math.cos(((i * 60 + 30) * Math.PI) / 180) * 0.24 * u, y * u + Math.sin(((i * 60 + 30) * Math.PI) / 180) * 0.24 * u]); d += poly(p); } return d; }
    case 'milk': return M(-0.1 * u, -0.46 * u) + L(0.1 * u, -0.46 * u) + L(0.1 * u, -0.26 * u) + Q(0.24 * u, -0.14 * u, 0.24 * u, 0.02 * u) + L(0.24 * u, 0.44 * u) + L(-0.24 * u, 0.44 * u) + L(-0.24 * u, 0.02 * u) + Q(-0.24 * u, -0.14 * u, -0.1 * u, -0.26 * u) + 'Z' + line(k([[-0.24, 0.1], [0.24, 0.1]]));
    case 'cherry': return circle(-0.2 * u, 0.22 * u, 0.17 * u) + circle(0.22 * u, 0.26 * u, 0.17 * u) + M(-0.2 * u, 0.05 * u) + Q(-0.1 * u, -0.3 * u, 0.1 * u, -0.42 * u) + M(0.22 * u, 0.09 * u) + Q(0.2 * u, -0.2 * u, 0.1 * u, -0.42 * u) + leaf(0.1 * u, -0.42 * u, 0.28 * u, 0.09 * u, 10);
    default: return blob(k([[0, -0.36], [0.14, -0.2], [0.3, 0.14], [0.2, 0.4], [0, 0.44], [-0.2, 0.4], [-0.3, 0.14], [-0.14, -0.2]]), 0.9) + line(k([[0, -0.36], [0.06, -0.5]]));
  }
}

/** Framed slate with chalk pictures and tally marks (no words); origin top-left. */
export function chalkSign(w: number, h: number, icons: Icon[], seed: number, frame = F.woodLt): Shape[] {
  const g = rng(seed);
  const cols = ['#f6f1e4', '#f6d9a0', '#f2b6b0', '#bfe0c8'];
  const out: Shape[] = [ol(rect(0, 0, w, h, 4), frame, 1.2, -0.35), sh(rect(6, 6, w - 12, h - 12, 2), '#2f3533'), sh(rect(6, 6, w - 12, 6), '#000000', { opacity: 0.25 })];
  const cw = (w - 16) / icons.length, u = Math.min(cw * 0.78, (h - 16) * 0.62);
  icons.forEach((ic, i) => {
    const cx = 8 + cw * (i + 0.5), cy = 10 + (h - 20) * 0.4;
    out.push(stroke(xf(chalkIcon(ic, u), { x: cx, y: cy, rot: g.range(-6, 6) }), cols[(i + seed) % cols.length], Math.max(1.4, u * 0.05)));
    // a row of tally strokes and dots instead of a price
    let t = '';
    const n = g.int(2, 4), ty = h - 12 - (h - 20) * 0.08;
    for (let k = 0; k < n; k++) t += line([[cx - n * 3 + k * 6, ty - 5], [cx - n * 3 + k * 6 + 1.5, ty + 4]]);
    out.push(stroke(t, '#f6f1e4', 1.4, { opacity: 0.85 }));
  });
  out.push(stroke(curve([[12, h - 9], [w * 0.3, h - 11], [w * 0.5, h - 8], [w * 0.7, h - 11], [w - 12, h - 9]]), '#f6f1e4', 1, { opacity: 0.5 }));
  return out;
}

/** Shopkeeper's dial scale with a brass pan; origin bottom-centre, s tall. */
export function scale(s: number, col = '#b8402e'): Shape[] {
  let tk = '';
  for (let i = 0; i < 12; i++) { const a = (i * 30 * Math.PI) / 180; tk += line([[Math.cos(a) * 0.17 * s, -0.4 * s + Math.sin(a) * 0.17 * s], [Math.cos(a) * 0.2 * s, -0.4 * s + Math.sin(a) * 0.2 * s]]); }
  return [
    shadow(0, 0, s * 0.42, s * 0.04, 0.22),
    stroke(line([[0, -0.6 * s], [0, -0.76 * s]]), '#4a4440', 0.05 * s),
    ol(M(-0.42 * s, -0.92 * s) + Q(0, -0.6 * s, 0.42 * s, -0.92 * s) + 'Z', F.brass, 1.2, -0.35), ol(ellipse(0, -0.92 * s, 0.42 * s, 0.05 * s), shade(F.brass, 0.25), 1, -0.4), hl(ellipse(-0.14 * s, -0.84 * s, 0.1 * s, 0.03 * s, 14), 0.5),
    ol(M(-0.36 * s, 0) + L(-0.3 * s, -0.56 * s) + Q(0, -0.72 * s, 0.3 * s, -0.56 * s) + L(0.36 * s, 0) + 'Z', col, 1.2), sh(M(0.14 * s, -0.64 * s) + Q(0.26 * s, -0.6 * s, 0.3 * s, -0.56 * s) + L(0.36 * s, 0) + L(0.2 * s, 0) + 'Z', shade(col, -0.2)),
    ol(circle(0, -0.4 * s, 0.23 * s), '#fbf6ec', 1.6, -0.45), stroke(tk, '#3b2f2a', 1), stroke(line([[0, -0.4 * s], [0.1 * s, -0.53 * s]]), '#c8452f', 0.022 * s), sh(circle(0, -0.4 * s, 0.03 * s), '#3b2f2a'),
    ol(rect(-0.4 * s, -0.08 * s, 0.8 * s, 0.08 * s, 0.02 * s), shade(col, -0.25), 1),
  ];
}

/** Wheel of cheese with a wedge cut out; origin bottom-centre, w wide. */
export function cheeseWheel(w: number, col = '#f2c85a', rind = '#d99a2e'): Shape[] {
  return [
    shadow(0, 0, w * 0.52, w * 0.04, 0.2),
    ol(M(-w / 2, -w * 0.3) + L(-w / 2, -w * 0.06) + Q(0, w * 0.06, w / 2, -w * 0.06) + L(w / 2, -w * 0.3) + 'Z', rind, 1.1),
    ol(ellipse(0, -w * 0.3, w / 2, w * 0.12), shade(rind, 0.22), 1.1, -0.35),
    sh(poly([[0, -w * 0.3], [w * 0.16, -w * 0.19], [w * 0.4, -w * 0.235]]), '#3b2a1c', { opacity: 0.35 }),
    sh(poly([[0, -w * 0.3], [w * 0.16, -w * 0.19], [w * 0.16, w * 0.02], [0, -w * 0.06]]), col), sh(poly([[0, -w * 0.3], [w * 0.4, -w * 0.235], [w * 0.4, -w * 0.02], [w * 0.16, w * 0.02], [w * 0.16, -w * 0.19]]), shade(col, -0.1)),
    sh(circle(w * 0.07, -w * 0.12, w * 0.02) + circle(w * 0.26, -w * 0.1, w * 0.025) + circle(w * 0.33, -w * 0.16, w * 0.015), shade(col, -0.3)),
    hl(ellipse(-w * 0.2, -w * 0.33, w * 0.16, w * 0.03), 0.3),
  ];
}

/** Wedge of holey cheese; origin bottom-centre, s wide. */
export function cheeseWedge(s: number, col = '#f6d458'): Shape[] {
  return [
    shadow(0, 0, s * 0.52, s * 0.05, 0.2),
    ol(poly(sc(s, [[-0.5, -0.34], [0.2, -0.66], [0.5, -0.5]])), shade(col, 0.22), 1.1, -0.35),
    ol(poly(sc(s, [[-0.5, -0.34], [0.5, -0.5], [0.5, 0], [-0.5, 0]])), col, 1.2, -0.35),
    sh(ellipse(-0.2 * s, -0.16 * s, 0.09 * s, 0.07 * s) + ellipse(0.12 * s, -0.3 * s, 0.07 * s, 0.055 * s) + ellipse(0.3 * s, -0.12 * s, 0.1 * s, 0.075 * s) + ellipse(-0.36 * s, -0.24 * s, 0.035 * s, 0.03 * s) + ellipse(0.02 * s, -0.08 * s, 0.035 * s, 0.03 * s), shade(col, -0.28)),
    sh(rect(-0.5 * s, -0.05 * s, s, 0.05 * s), '#d99a2e'),
  ];
}

/** Open box of six eggs; origin bottom-centre, w wide. */
export function eggBox(w: number, col = '#b8ad9a'): Shape[] {
  const out: Shape[] = [shadow(0, 0, w * 0.54, w * 0.04, 0.2), ol(poly([[-w * 0.5, -w * 0.3], [w * 0.5, -w * 0.3], [w * 0.46, -w * 0.62], [-w * 0.46, -w * 0.62]]), shade(col, -0.1), 1.1), stroke(line([[-w * 0.42, -w * 0.52], [w * 0.42, -w * 0.52]]), shade(col, -0.3), 1)];
  const eggs = ['#e6c296', '#f7f0e2', '#d9ab7a', '#f3ead8', '#e0b78a', '#f7f0e2'];
  for (let i = 0; i < 6; i++) {
    const row = i < 3 ? 0 : 1, cx = -w * 0.3 + (i % 3) * w * 0.3 + (row ? 0 : w * 0.02), cy = -w * 0.3 + (row ? w * 0.06 : -w * 0.03), r = w * 0.12;
    out.push(ol(M(cx, cy - r * 1.3) + C(cx + r * 0.6, cy - r * 1.3, cx + r, cy - r * 0.4, cx + r, cy + r * 0.2) + L(cx - r, cy + r * 0.2) + C(cx - r, cy - r * 0.4, cx - r * 0.6, cy - r * 1.3, cx, cy - r * 1.3) + 'Z', eggs[i], 0.9, -0.25), hl(ellipse(cx - r * 0.35, cy - r * 0.6, r * 0.16, r * 0.3, 20), 0.6));
  }
  let fr = M(-w * 0.5, -w * 0.3);
  for (let i = 0; i < 3; i++) fr += Q(-w * 0.5 + (i + 0.5) * (w / 3), -w * 0.08, -w * 0.5 + (i + 1) * (w / 3), -w * 0.3);
  fr += L(w * 0.46, 0) + L(-w * 0.46, 0) + 'Z';
  out.push(ol(fr, col, 1.1), stroke(line([[-w * 0.47, -w * 0.07], [w * 0.47, -w * 0.07]]), shade(col, -0.25), 1));
  return out;
}

/** Brown paper bag with a loaf and leafy greens poking out; origin bottom-centre, s tall. */
export function paperBag(s: number, col = '#c9a06a'): Shape[] {
  let cuts = '';
  for (let i = 0; i < 3; i++) cuts += line([[0.1 * s + i * 0.035 * s, -0.84 * s - i * 0.1 * s], [0.2 * s + i * 0.035 * s, -0.8 * s - i * 0.1 * s]]);
  return [
    shadow(0, 0, s * 0.36, s * 0.04, 0.22),
    sh(leaf(-0.14 * s, -0.66 * s, 0.4 * s, 0.11 * s, -110) + leaf(-0.08 * s, -0.66 * s, 0.44 * s, 0.12 * s, -88) + leaf(-0.2 * s, -0.66 * s, 0.34 * s, 0.1 * s, -132), '#5f8a45'), sh(leaf(-0.1 * s, -0.66 * s, 0.34 * s, 0.07 * s, -100), '#7fa35a'),
    ol(xf(rect(-0.07 * s, -0.5 * s, 0.14 * s, 0.56 * s, 0.07 * s), { rot: 16, x: 0.12 * s, y: -0.62 * s }), '#d9a050', 1, -0.3), stroke(cuts, '#f4dca0', 1.6),
    ol(poly(sc(s, [[-0.3, 0], [-0.32, -0.7], [-0.2, -0.66], [-0.08, -0.72], [0.06, -0.66], [0.2, -0.72], [0.32, -0.68], [0.3, 0]])), col, 1.2, -0.3),
    sh(poly(sc(s, [[0.12, 0], [0.14, -0.68], [0.2, -0.72], [0.32, -0.68], [0.3, 0]])), shade(col, -0.14)), stroke(line(sc(s, [[-0.12, -0.68], [-0.1, 0]])) + line(sc(s, [[-0.3, -0.16], [0.3, -0.16]])), shade(col, -0.22), 0.9),
  ];
}

/** Bunch of carrots tied with twine, tops up; origin at the tie, s long. */
export function carrotBunch(s: number): Shape[] {
  const out: Shape[] = [];
  let tops = '', tops2 = '';
  for (let i = 0; i < 9; i++) { const a = -90 + (i - 4) * 13; (i % 2 ? (tops += leaf(0, -0.02 * s, 0.4 * s, 0.05 * s, a)) : (tops2 += leaf(0, -0.02 * s, 0.34 * s, 0.06 * s, a + 4))); }
  out.push(sh(tops, '#4f7a3f'), sh(tops2, '#6f9a52'));
  for (const [rot, c] of [[28, '#e8862e'], [-26, '#f08a2b'], [10, '#ee7d22'], [-8, '#f39a3a']] as [number, string][]) {
    let rg = '';
    for (let k = 1; k < 5; k++) rg += line([[-0.05 * s + k * 0.008 * s, k * 0.11 * s], [0.02 * s, k * 0.11 * s + 0.01 * s]]);
    out.push(...place([ol(M(-0.085 * s, 0.02 * s) + Q(0, -0.03 * s, 0.085 * s, 0.02 * s) + Q(0.06 * s, 0.4 * s, 0, 0.62 * s) + Q(-0.06 * s, 0.4 * s, -0.085 * s, 0.02 * s) + 'Z', c, 1, -0.3), stroke(rg, shade(c, -0.25), 0.8)], { rot }));
  }
  out.push(stroke(line([[-0.09 * s, 0.0], [0.09 * s, 0.0]]) + line([[-0.08 * s, 0.03 * s], [0.08 * s, 0.03 * s]]), '#d9c08a', 0.03 * s));
  return out;
}

/** Whole watermelon with a slice leaning on it; origin bottom-centre, s wide. */
export function watermelon(s: number): Shape[] {
  let st = '';
  for (let i = -3; i <= 3; i++) st += M(i * 0.1 * s - 0.06 * s, -0.6 * s + Math.abs(i) * 0.03 * s) + Q(i * 0.15 * s - 0.06 * s, -0.32 * s, i * 0.1 * s - 0.06 * s, -0.03 * s - Math.abs(i) * 0.0 * s + Math.abs(i) * 0.03 * s);
  let seeds = '';
  for (const [x, y] of [[0.2, -0.16], [0.3, -0.24], [0.38, -0.14], [0.28, -0.1], [0.44, -0.24]]) seeds += ellipse(x * s, y * s, 0.014 * s, 0.024 * s, 20);
  return [
    shadow(0, 0, s * 0.52, s * 0.04, 0.2),
    ol(ellipse(-0.06 * s, -0.32 * s, 0.42 * s, 0.31 * s), '#4f8a45', 1.2, -0.3), stroke(st, '#2f5a30', 0.035 * s), hl(ellipse(-0.24 * s, -0.5 * s, 0.12 * s, 0.04 * s, -20), 0.3),
    ol(M(0.06 * s, -0.04 * s) + L(0.56 * s, -0.36 * s) + Q(0.5 * s, 0.02 * s, 0.14 * s, 0.02 * s) + 'Z', '#4f8a45', 1, -0.3),
    sh(M(0.09 * s, -0.045 * s) + L(0.545 * s, -0.335 * s) + Q(0.49 * s, -0.01 * s, 0.15 * s, -0.005 * s) + 'Z', '#f3ead6'),
    sh(M(0.12 * s, -0.06 * s) + L(0.53 * s, -0.32 * s) + Q(0.47 * s, -0.04 * s, 0.17 * s, -0.03 * s) + 'Z', '#e0483e'), sh(seeds, '#2b2622'),
  ];
}

/** Bunch of grapes; origin at the top of the stalk, s tall. */
export function grapes(s: number, col = '#6b3f86'): Shape[] {
  const out: Shape[] = [stroke(line([[0, 0], [0, 0.16 * s]]), '#6a4a2c', 0.04 * s), ol(leaf(0, 0.1 * s, 0.34 * s, 0.14 * s, -20), '#5f8a45', 0.9)];
  let a = '', b = '', h = '';
  const rows = [3, 4, 3, 2, 1];
  rows.forEach((n, r) => { for (let i = 0; i < n; i++) { const x = (i - (n - 1) / 2) * 0.17 * s, y = 0.26 * s + r * 0.15 * s, d = circle(x, y, 0.1 * s); ((i + r) % 2 ? (a += d) : (b += d)); h += circle(x - 0.03 * s, y - 0.03 * s, 0.025 * s); } });
  out.push(ol(a, col, 0.9, -0.3), ol(b, shade(col, 0.14), 0.9, -0.35), hl(h, 0.45));
  return out;
}

/** Zinc bucket of mixed cut flowers; origin bottom-centre, s = bucket height. */
export function flowerBucket(s: number, seed: number, cols: string[], bucketCol = F.zinc): Shape[] {
  const g = rng(seed);
  const out: Shape[] = [];
  let stems = '', lv = '', mids = '';
  const heads = cols.map(() => '');
  for (let i = 0; i < 11; i++) {
    const x = g.range(-0.42, 0.42) * s, top = -s * g.range(1.35, 2.0), r = s * g.range(0.1, 0.15);
    const tx = x * 1.5;
    stems += line([[x * 0.6, -s * 0.9], [tx, top]]);
    lv += leaf(x * 0.8, -s * 1.1, s * 0.3, s * 0.06, -90 + g.range(-50, 50));
    let d = '';
    const k = i % cols.length;
    if (i % 3 === 0) { for (let p = 0; p < 8; p++) d += petal(tx, top, r * 1.2, r * 0.36, p * 45); mids += circle(tx, top, r * 0.4); }
    else if (i % 3 === 1) { for (let p = 0; p < 5; p++) d += circle(tx + Math.cos((p * 72 * Math.PI) / 180) * r * 0.6, top + Math.sin((p * 72 * Math.PI) / 180) * r * 0.6, r * 0.55); mids += circle(tx, top, r * 0.3); }
    else d += circle(tx, top, r) + circle(tx - r * 0.5, top + r * 0.3, r * 0.6) + circle(tx + r * 0.5, top + r * 0.3, r * 0.6);
    heads[k] += d;
  }
  out.push(stroke(stems, '#4f7a3f', 1.6), sh(lv, '#6f9a52'));
  cols.forEach((c, i) => heads[i] && out.push(ol(heads[i], c, 0.7, -0.22)));
  out.push(sh(mids, '#f2c440'));
  out.push(...bucket(s, bucketCol, '#4f7a3f', false).slice(0));
  return out;
}

/** Round loaf basket liner / gingham cloth square draped over an edge; origin top-centre. */
export function clothDrape(w: number, h: number, col: string, check: string): Shape[] {
  let v = '', hh = '';
  for (let x = -w / 2 + w * 0.1; x < w / 2; x += w * 0.2) v += rect(x, 0, w * 0.1, h * 0.86);
  for (let y = h * 0.14; y < h * 0.8; y += h * 0.28) hh += rect(-w / 2, y, w, h * 0.14);
  return [ol(poly([[-w / 2, 0], [w / 2, 0], [w / 2, h * 0.86], [0, h], [-w / 2, h * 0.86]]), col, 1, -0.2), sh(v, check, { opacity: 0.5 }), sh(hh, check, { opacity: 0.5 })];
}

/** String of garlic or onions hanging; origin at the top, s long. */
export function vegString(s: number, col: string, n = 5): Shape[] {
  const out: Shape[] = [stroke(line([[0, 0], [0, s * 0.9]]), '#c9b07a', 2)];
  for (let i = 0; i < n; i++) {
    const y = s * (0.2 + (i * 0.75) / n), x = (i % 2 ? 1 : -1) * s * 0.09, r = s * 0.1;
    out.push(ol(blob([[x, y - r * 1.2], [x + r, y - r * 0.1], [x + r * 0.7, y + r * 0.8], [x, y + r], [x - r * 0.7, y + r * 0.8], [x - r, y - r * 0.1]], 0.9), i % 2 ? col : shade(col, -0.08), 0.9, -0.3), stroke(curve([[x, y - r], [x + r * 0.3, y], [x, y + r * 0.9]]), shade(col, -0.25), 0.7));
  }
  return out;
}

void mix; void Q; void L;
