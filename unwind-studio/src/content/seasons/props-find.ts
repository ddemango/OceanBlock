// Shared props for the Four Seasons hidden-object scenes. Every prop is drawn
// around the origin (usually bottom-centre, where it meets the ground) and
// returns Shape[]; position it with place().
import { rect, ellipse, circle, poly, line, curve, blob, leaf, petal, star, sector, sh, stroke, shade, mix, rng, xf, place } from '../../art/kit';
import type { Pt } from '../../art/geometry';
import type { Shape } from '../../art/types';

const n = (v: number) => String(Math.round(v * 10) / 10);
export const M = (x: number, y: number) => `M${n(x)} ${n(y)}`;
export const L = (x: number, y: number) => `L${n(x)} ${n(y)}`;
export const Q = (cx: number, cy: number, x: number, y: number) => `Q${n(cx)} ${n(cy)} ${n(x)} ${n(y)}`;
export const C = (a: number, b: number, c: number, d: number, x: number, y: number) => `C${n(a)} ${n(b)} ${n(c)} ${n(d)} ${n(x)} ${n(y)}`;

/** Filled shape with a darker outline of the same hue. */
export const ol = (d: string, fill: string, w = 1, amt = -0.3): Shape => sh(d, fill, { stroke: shade(fill, amt), strokeWidth: w });
export const shadow = (cx: number, cy: number, rx: number, ry: number, op = 0.2): Shape => sh(ellipse(cx, cy, rx, ry), '#3b2a1c', { opacity: op });
export const hl = (d: string, op = 0.5): Shape => sh(d, '#ffffff', { opacity: op });
const nz = (s: Shape[]) => s.filter((p) => p.d);

export const P = {
  leaf: '#5f8a45', leafLt: '#7fa35a', leafDk: '#456b34', terracotta: '#c8693f', wood: '#b98552', woodLt: '#d4a26c', woodDk: '#7a5232',
  zinc: '#a9b3b8', zincDk: '#79858c', wicker: '#c99a5b', cream: '#f7efdc', ink: '#3b2f2a', straw: '#e2bd5a',
};

// =====================================================================
// textures and landscape
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
    for (let k = 0; k < 2; k++) {
      const off = size * (0.3 + 0.4 * k + g.range(-0.06, 0.06));
      const pts: Pt[] = [];
      for (let s = 0; s <= 6; s++) { const along = (len * s) / 6, wob = g.range(-size * 0.06, size * 0.06); pts.push(vertical ? [a + off + wob, y + along] : [x + along, a + off + wob]); }
      grain += curve(pts);
    }
    if (g.next() < 0.4) { const along = g.range(0.15, 0.85) * len, cx = vertical ? a + size * g.range(0.3, 0.7) : x + along, cy = vertical ? y + along : a + size * g.range(0.3, 0.7); knots += ellipse(cx, cy, vertical ? size * 0.09 : size * 0.2, vertical ? size * 0.2 : size * 0.09); }
  }
  return nz([sh(rect(x, y, w, h), col), sh(lt, shade(col, 0.07)), sh(dk, shade(col, -0.07)), stroke(grain, shade(col, -0.2), 0.8, { opacity: 0.5 }), stroke(knots, shade(col, -0.32), 1.1), stroke(seams, shade(col, -0.42), 1.6)]);
}

/** Cobbled ground in perspective: small stones at the top, larger ones nearer. */
export function cobbles(x0: number, y0: number, w: number, h: number, seed: number, base: string, cols: string[]): Shape[] {
  const g = rng(seed);
  const by = cols.map(() => '');
  let hls = '';
  let y = y0;
  while (y < y0 + h) {
    const rh = 9 + ((y - y0) / h) * 24;
    let x = x0 - g.range(0, rh * 1.5);
    while (x < x0 + w) {
      const cw = rh * g.range(1.3, 1.9);
      const k = g.int(0, cols.length - 1);
      by[k] += blob([[x + 2, y + rh * 0.5], [x + cw * 0.5, y + 1.5], [x + cw - 2, y + rh * 0.5], [x + cw * 0.5, y + rh - 1.5]], 0.9);
      if (g.next() < 0.35) hls += ellipse(x + cw * 0.42, y + rh * 0.32, cw * 0.2, rh * 0.1);
      x += cw;
    }
    y += rh;
  }
  return nz([sh(rect(x0, y0, w, h), base), ...cols.map((c, i) => sh(by[i], c)), sh(hls, '#ffffff', { opacity: 0.22 })]);
}

/** Soft puffy cloud path centred on (x,y). */
export const cloud = (x: number, y: number, s: number) =>
  blob([[x - 80 * s, y + 10 * s], [x - 64 * s, y - 16 * s], [x - 30 * s, y - 30 * s], [x - 4 * s, y - 44 * s], [x + 34 * s, y - 36 * s], [x + 60 * s, y - 18 * s], [x + 84 * s, y + 8 * s], [x, y + 18 * s]], 1);

/** Tufts of grass blades scattered over an area. */
export function grassTufts(x0: number, y0: number, w: number, h: number, count: number, seed: number, cols: string[], size = 14): Shape[] {
  const g = rng(seed);
  const by = cols.map(() => '');
  for (let i = 0; i < count; i++) {
    const x = x0 + g.range(0, w), y = y0 + g.range(0, h), s = size * (0.6 + ((y - y0) / Math.max(1, h)) * 0.7);
    let d = '';
    for (let k = 0; k < 5; k++) d += leaf(x + (k - 2) * s * 0.18, y, s * g.range(0.8, 1.3), s * 0.12, -90 + (k - 2) * 16 + g.range(-6, 6));
    by[g.int(0, cols.length - 1)] += d;
  }
  return nz(cols.map((c, i) => sh(by[i], c)));
}

/** Leafy round-headed tree; origin at the base of the trunk. Optional blossom or fruit dots. */
export function tree(seed: number, s: number, cols: string[], trunk: string, dots?: { cols: string[]; count: number; size: number; flower?: boolean }): Shape[] {
  const g = rng(seed);
  const out: Shape[] = [];
  out.push(sh(poly([[-0.12 * s, 0], [0.12 * s, 0], [0.07 * s, -0.9 * s], [-0.06 * s, -0.9 * s]]), trunk));
  out.push(stroke(curve([[0, -0.75 * s], [-0.25 * s, -1.1 * s], [-0.55 * s, -1.35 * s]]) + curve([[0, -0.8 * s], [0.25 * s, -1.15 * s], [0.5 * s, -1.45 * s]]) + curve([[0, -0.85 * s], [0.02 * s, -1.3 * s], [-0.05 * s, -1.8 * s]]), trunk, 0.07 * s));
  out.push(sh(poly([[0.02 * s, 0], [0.12 * s, 0], [0.07 * s, -0.9 * s], [0.03 * s, -0.9 * s]]), shade(trunk, -0.2)));
  const layers = cols.map(() => '');
  for (let i = 0; i < 34; i++) {
    const a = g.range(0, Math.PI * 2), rr = Math.sqrt(g.next());
    const cx = Math.cos(a) * rr * 0.82 * s, cy = -1.5 * s + Math.sin(a) * rr * 0.55 * s;
    const r = g.range(0.2, 0.34) * s;
    const t = (cy + 1.5 * s) / (0.55 * s) * 0.5 + 0.5 - (cx / s) * 0.25;
    const k = Math.max(0, Math.min(cols.length - 1, Math.floor((1 - t) * cols.length)));
    layers[k] += circle(cx, cy, r);
  }
  cols.forEach((c, i) => out.push(sh(layers[i], c)));
  if (dots) {
    const by = dots.cols.map(() => '');
    for (let i = 0; i < dots.count; i++) {
      const a = g.range(0, Math.PI * 2), rr = Math.sqrt(g.next());
      const cx = Math.cos(a) * rr * 0.95 * s, cy = -1.5 * s + Math.sin(a) * rr * 0.7 * s;
      const k = g.int(0, dots.cols.length - 1), r = dots.size * g.range(0.75, 1.2);
      if (dots.flower) for (let p = 0; p < 5; p++) by[k] += circle(cx + Math.cos((p * 72 * Math.PI) / 180) * r * 0.55, cy + Math.sin((p * 72 * Math.PI) / 180) * r * 0.55, r * 0.5);
      else by[k] += circle(cx, cy, r);
    }
    dots.cols.forEach((c, i) => out.push(sh(by[i], c)));
  }
  return nz(out);
}

/** A string of bunting sagging between two points. */
export function bunting(x0: number, y0: number, x1: number, y1: number, sag: number, count: number, cols: string[], size: number, cord = '#6b5a48'): Shape[] {
  const p = (t: number): Pt => [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t + sag * 4 * t * (1 - t)];
  const pts: Pt[] = [];
  for (let i = 0; i <= 16; i++) pts.push(p(i / 16));
  const by = cols.map(() => '');
  for (let i = 0; i < count; i++) {
    const a = p((i + 0.12) / count), b = p((i + 0.88) / count);
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
    by[i % cols.length] += poly([a, b, [mx, my + size]]);
  }
  return nz([stroke(curve(pts), cord, 1.6), ...cols.map((c, i) => sh(by[i], c))]);
}

/** Pastel townhouse facade; origin bottom-left. */
export function townhouse(w: number, h: number, wall: string, trim: string, roof: string, seed: number, opts: { gable?: boolean; shutter?: string; boxes?: string[] } = {}): Shape[] {
  const g = rng(seed);
  const out: Shape[] = [];
  if (opts.gable) {
    out.push(ol(poly([[-6, -h], [w + 6, -h], [w / 2, -h - w * 0.42]]), roof, 1.2));
    out.push(sh(poly([[w / 2, -h - w * 0.42], [w + 6, -h], [w / 2 + 6, -h]]), shade(roof, -0.12)));
    out.push(ol(circle(w / 2, -h - w * 0.17, w * 0.07), '#dfe9ee', 1.4, -0.5));
  } else {
    out.push(ol(poly([[-4, -h], [w + 4, -h], [w - 10, -h - 46], [10, -h - 46]]), roof, 1.2));
    let sl = '';
    for (let y = -h - 36; y < -h; y += 10) sl += line([[8, y], [w - 8, y]]);
    out.push(stroke(sl, shade(roof, -0.18), 1));
    out.push(ol(rect(w * 0.42, -h - 40, w * 0.16, 26, 2), '#f3f6f7', 1, -0.3), sh(rect(w * 0.44, -h - 36, w * 0.12, 18), '#9fc1d6'));
  }
  out.push(ol(rect(w * 0.72, -h - (opts.gable ? w * 0.42 : 46) - 4, 18, 40), shade(wall, -0.15), 1), sh(rect(w * 0.72 - 3, -h - (opts.gable ? w * 0.42 : 46) - 8, 24, 7), shade(wall, -0.35)));
  out.push(sh(rect(0, -h, w, h), wall), sh(rect(w - 10, -h, 10, h), shade(wall, -0.07)), sh(rect(-3, -h - 6, w + 6, 10, 2), trim), sh(rect(0, -h + 4, w, 4), '#000000', { opacity: 0.06 }));
  const colsN = w > 170 ? 3 : 2, rows = Math.max(1, Math.floor((h - 60) / 112));
  const ww = Math.min(44, (w - 30) / colsN - 22), wh = 64;
  let glass = '', frames = '', mull = '', shut = '', boxes = '', refl = '';
  const flowerBy = (opts.boxes ?? []).map(() => '');
  let foliage = '';
  for (let r = 0; r < rows; r++) for (let c = 0; c < colsN; c++) {
    const cx = (w * (c + 0.5)) / colsN, y = -h + 34 + r * 112;
    frames += rect(cx - ww / 2 - 4, y - 4, ww + 8, wh + 8, 3);
    glass += rect(cx - ww / 2, y, ww, wh);
    refl += poly([[cx - ww / 2 + 4, y + wh * 0.6], [cx - ww / 2 + ww * 0.5, y + 4], [cx - ww / 2 + ww * 0.7, y + 4], [cx - ww / 2 + 4, y + wh * 0.85]]);
    mull += line([[cx, y], [cx, y + wh]]) + line([[cx - ww / 2, y + wh * 0.45], [cx + ww / 2, y + wh * 0.45]]);
    if (opts.shutter) shut += rect(cx - ww / 2 - 18, y - 2, 13, wh + 4, 2) + rect(cx + ww / 2 + 5, y - 2, 13, wh + 4, 2);
    if (opts.boxes?.length) {
      boxes += rect(cx - ww / 2 - 6, y + wh + 2, ww + 12, 11, 2);
      for (let k = 0; k < 7; k++) {
        const fx = cx - ww / 2 - 2 + k * ((ww + 4) / 6);
        foliage += circle(fx, y + wh + 1, 5.5);
        flowerBy[g.int(0, flowerBy.length - 1)] += circle(fx + g.range(-2, 2), y + wh - 3 + g.range(-2, 2), 3.6);
      }
    }
  }
  out.push(sh(frames, trim), sh(glass, '#a8c6d8'), sh(refl, '#ffffff', { opacity: 0.35 }), stroke(mull, trim, 3));
  if (shut) out.push(ol(shut, opts.shutter!, 1, -0.25));
  if (boxes) out.push(sh(foliage, P.leaf), ...flowerBy.map((d, i) => sh(d, opts.boxes![i])), ol(boxes, P.woodDk, 1));
  return nz(out);
}

// =====================================================================
// spring market
// =====================================================================
/** Striped scalloped awning; origin top-left, `w` wide, `d` deep. */
export function awning(w: number, d: number, count: number, a: string, b: string): Shape[] {
  let sa = '', sb = '';
  const sw = w / count;
  for (let i = 0; i < count; i++) {
    const x = i * sw;
    const p = M(x, 0) + L(x + sw, 0) + L(x + sw, d) + Q(x + sw / 2, d + sw * 0.75, x, d) + 'Z';
    if (i % 2) sb += p; else sa += p;
  }
  return [sh(sa, a), sh(sb, b), sh(rect(0, 0, w, d * 0.22), '#000000', { opacity: 0.1 }), sh(rect(-4, -8, w + 8, 10, 3), shade(a, -0.3)), stroke(line([[0, d], [w, d]]), shade(a, -0.25), 1, { opacity: 0.5 })];
}

/** Terracotta (or painted) flower pot; origin bottom-centre, `s` tall. */
export function pot(s: number, col: string): Shape[] {
  return [
    ol(poly([[-0.4 * s, -0.82 * s], [0.4 * s, -0.82 * s], [0.3 * s, 0], [-0.3 * s, 0]]), col, 1),
    sh(poly([[0.14 * s, -0.82 * s], [0.4 * s, -0.82 * s], [0.3 * s, 0], [0.1 * s, 0]]), shade(col, -0.12)),
    ol(rect(-0.48 * s, -s, 0.96 * s, 0.22 * s, 0.04 * s), shade(col, 0.06), 1),
    sh(rect(-0.4 * s, -0.78 * s, 0.8 * s, 0.05 * s), '#000000', { opacity: 0.12 }),
  ];
}

const tulipHead = (x: number, y: number, r: number) =>
  M(x - r * 0.55, y - r * 0.2) + L(x - r * 0.62, y - r * 1.05) + L(x - r * 0.25, y - r * 0.72) + L(x, y - r * 1.15) + L(x + r * 0.25, y - r * 0.72) + L(x + r * 0.62, y - r * 1.05) + L(x + r * 0.55, y - r * 0.2) + Q(x, y + r * 0.3, x - r * 0.55, y - r * 0.2) + 'Z';
const daisy = (x: number, y: number, r: number, petals = 10): [string, string] => {
  let p = '';
  for (let k = 0; k < petals; k++) p += petal(x, y, r, r * 0.3, (k * 360) / petals);
  return [p, circle(x, y, r * 0.34)];
};

export type PlantKind = 'tulip' | 'daisy' | 'geranium' | 'hyacinth' | 'lavender' | 'leafy' | 'pansy' | 'seedling';

/** A potted plant; origin bottom-centre of the pot, `s` = pot height. */
export function potted(s: number, potCol: string, kind: PlantKind, fc: string, seed: number): Shape[] {
  const g = rng(seed);
  const out: Shape[] = [];
  const top = -s;
  let lv = '', lv2 = '', fl = '', fl2 = '', ctr = '', stems = '';
  if (kind === 'tulip') {
    const k = g.int(3, 5);
    for (let i = 0; i < k; i++) {
      const x = (i / (k - 1) - 0.5) * 0.6 * s, hgt = g.range(0.75, 1.25) * s, hx = x * 1.3;
      stems += curve([[x, top], [x + (hx - x) * 0.5, top - hgt * 0.5], [hx, top - hgt]]);
      fl += tulipHead(hx, top - hgt + 0.08 * s, 0.24 * s);
      fl2 += petal(hx - 0.05 * s, top - hgt - 0.02 * s, 0.18 * s, 0.05 * s, -95);
    }
    lv += leaf(-0.1 * s, top + 0.05 * s, 0.75 * s, 0.13 * s, -120) + leaf(0.1 * s, top + 0.05 * s, 0.7 * s, 0.13 * s, -58);
    lv2 += leaf(0, top + 0.05 * s, 0.55 * s, 0.12 * s, -95);
    out.push(stroke(stems, P.leafDk, 0.05 * s), sh(lv, P.leaf), sh(lv2, P.leafLt), sh(fl, fc), sh(fl2, shade(fc, 0.25)));
  } else if (kind === 'daisy' || kind === 'pansy') {
    for (let i = 0; i < 9; i++) (i % 2 ? (lv += leaf(0, top + 0.05 * s, g.range(0.45, 0.6) * s, 0.15 * s, -170 + i * 20)) : (lv2 += leaf(0, top + 0.05 * s, g.range(0.4, 0.55) * s, 0.15 * s, -170 + i * 20)));
    out.push(sh(lv, P.leaf), sh(lv2, P.leafLt));
    const k = g.int(5, 7);
    for (let i = 0; i < k; i++) {
      const a = Math.PI + (i / (k - 1)) * Math.PI, rr = g.range(0.25, 0.45) * s;
      const x = Math.cos(a) * rr, y = top + Math.sin(a) * rr * 0.9 - 0.05 * s;
      if (kind === 'daisy') { const [p, c] = daisy(x, y, 0.15 * s); fl += p; ctr += c; }
      else { fl += circle(x - 0.06 * s, y - 0.05 * s, 0.08 * s) + circle(x + 0.06 * s, y - 0.05 * s, 0.08 * s); fl2 += circle(x - 0.07 * s, y + 0.04 * s, 0.075 * s) + circle(x + 0.07 * s, y + 0.04 * s, 0.075 * s) + circle(x, y + 0.07 * s, 0.075 * s); ctr += circle(x, y + 0.02 * s, 0.03 * s); }
    }
    out.push(sh(fl, kind === 'daisy' ? fc : shade(fc, -0.35)), sh(fl2, fc), sh(ctr, '#f2c14e'));
  } else if (kind === 'geranium') {
    for (let i = 0; i < 12; i++) { const a = Math.PI + g.range(0.05, 0.95) * Math.PI, rr = g.range(0.1, 0.42) * s; (i % 2 ? (lv += circle(Math.cos(a) * rr, top + Math.sin(a) * rr * 0.8, 0.14 * s)) : (lv2 += circle(Math.cos(a) * rr, top + Math.sin(a) * rr * 0.8, 0.13 * s))); }
    out.push(sh(lv, P.leaf), sh(lv2, P.leafLt));
    for (let c = 0; c < 4; c++) {
      const cx = (c / 3 - 0.5) * 0.6 * s, cy = top - g.range(0.35, 0.6) * s;
      stems += line([[cx * 0.6, top - 0.1 * s], [cx, cy]]);
      for (let k = 0; k < 7; k++) { const a = (k * 2 * Math.PI) / 7; (k % 2 ? (fl += circle(cx + Math.cos(a) * 0.08 * s, cy + Math.sin(a) * 0.07 * s, 0.06 * s)) : (fl2 += circle(cx + Math.cos(a) * 0.08 * s, cy + Math.sin(a) * 0.07 * s, 0.06 * s))); }
    }
    out.push(stroke(stems, P.leafDk, 0.03 * s), sh(fl, fc), sh(fl2, shade(fc, 0.2)));
  } else if (kind === 'hyacinth') {
    lv += leaf(-0.05 * s, top + 0.05 * s, 0.7 * s, 0.1 * s, -110) + leaf(0.05 * s, top + 0.05 * s, 0.65 * s, 0.1 * s, -70);
    lv2 += leaf(0, top + 0.05 * s, 0.5 * s, 0.09 * s, -125) + leaf(0, top + 0.05 * s, 0.5 * s, 0.09 * s, -55);
    out.push(sh(lv, P.leaf), sh(lv2, P.leafLt));
    for (const x of [-0.18 * s, 0.16 * s]) for (let k = 0; k < 7; k++) { const y = top - 0.25 * s - k * 0.1 * s, rr = 0.065 * s * (1 - k * 0.06); fl += circle(x - 0.06 * s, y, rr) + circle(x + 0.06 * s, y, rr); fl2 += circle(x, y - 0.04 * s, rr); }
    out.push(sh(fl, fc), sh(fl2, shade(fc, 0.25)));
  } else if (kind === 'lavender') {
    for (let i = 0; i < 9; i++) {
      const bx = (i / 8 - 0.5) * 0.5 * s, tx = (i / 8 - 0.5) * 1.1 * s, ty = top - g.range(0.7, 1.0) * s;
      stems += line([[bx, top], [tx, ty]]);
      for (let k = 0; k < 4; k++) fl += ellipse(bx + (tx - bx) * (1 - k * 0.07), ty + (top - ty) * k * 0.07, 0.035 * s, 0.06 * s);
    }
    out.push(stroke(stems, '#8aa078', 0.03 * s), sh(fl, fc));
    for (let i = 0; i < 6; i++) lv += leaf(0, top + 0.03 * s, 0.35 * s, 0.06 * s, -160 + i * 28);
    out.push(sh(lv, '#9cb08a'));
  } else if (kind === 'leafy') {
    let veins = '';
    for (let i = 0; i < 7; i++) {
      const a = -160 + i * 23, len = g.range(0.6, 0.85) * s;
      (i % 2 ? (lv += leaf(0, top + 0.05 * s, len, 0.2 * s, a)) : (lv2 += leaf(0, top + 0.05 * s, len, 0.2 * s, a)));
      const r = (a * Math.PI) / 180;
      veins += line([[0, top + 0.05 * s], [Math.cos(r) * len * 0.85, top + 0.05 * s + Math.sin(r) * len * 0.85]]);
    }
    out.push(sh(lv, fc), sh(lv2, shade(fc, 0.18)), stroke(veins, shade(fc, -0.25), 0.02 * s));
  } else {
    for (let i = 0; i < 3; i++) {
      const x = (i - 1) * 0.22 * s, hgt = g.range(0.25, 0.4) * s;
      stems += line([[x, top], [x, top - hgt]]);
      lv += leaf(x, top - hgt, 0.2 * s, 0.07 * s, -150) + leaf(x, top - hgt, 0.2 * s, 0.07 * s, -30);
    }
    out.push(stroke(stems, P.leafLt, 0.03 * s), sh(lv, fc));
  }
  out.push(...pot(s, potCol));
  return nz(out);
}

/** Galvanised bucket of cut tulips; origin bottom-centre, `s` = bucket height. */
export function tulipBucket(s: number, fc: string, seed: number, bucket = P.zinc): Shape[] {
  const g = rng(seed);
  let stems = '', fl = '', fl2 = '', lv = '';
  for (let i = 0; i < 9; i++) {
    const bx = g.range(-0.3, 0.3) * s, tx = bx * 1.9 + g.range(-0.1, 0.1) * s, ty = -s - g.range(0.6, 1.05) * s;
    stems += curve([[bx, -s * 0.8], [(bx + tx) / 2, (ty - s) / 2], [tx, ty]]);
    fl += tulipHead(tx, ty + 0.06 * s, 0.2 * s);
    fl2 += petal(tx - 0.04 * s, ty - 0.02 * s, 0.15 * s, 0.045 * s, -95);
  }
  for (let i = 0; i < 5; i++) lv += leaf(g.range(-0.2, 0.2) * s, -s * 0.85, g.range(0.5, 0.7) * s, 0.1 * s, -90 + g.range(-45, 45));
  return [
    stroke(stems, P.leafDk, 0.04 * s), sh(lv, P.leafLt), sh(fl, fc), sh(fl2, shade(fc, 0.25)),
    ...bucketShape(s, bucket),
  ];
}

function bucketShape(s: number, col: string): Shape[] {
  return [
    ol(poly([[-0.42 * s, -s], [0.42 * s, -s], [0.33 * s, 0], [-0.33 * s, 0]]), col, 1),
    sh(poly([[0.12 * s, -s], [0.42 * s, -s], [0.33 * s, 0], [0.1 * s, 0]]), shade(col, -0.1)),
    stroke(line([[-0.4 * s, -0.75 * s], [0.4 * s, -0.75 * s]]) + line([[-0.36 * s, -0.25 * s], [0.36 * s, -0.25 * s]]), shade(col, -0.25), 0.03 * s),
    sh(rect(-0.44 * s, -1.03 * s, 0.88 * s, 0.07 * s, 0.03 * s), shade(col, 0.15)),
    hl(rect(-0.3 * s, -0.92 * s, 0.06 * s, 0.8 * s), 0.35),
  ];
}

/** Watering can with a rose spout; origin bottom-centre, `s` ≈ overall width. */
export function wateringCan(s: number, col: string): Shape[] {
  const dk = shade(col, -0.3);
  return [
    stroke(M(-0.27 * s, -0.42 * s) + Q(-0.5 * s, -0.36 * s, -0.27 * s, -0.12 * s), dk, 0.05 * s),
    ol(poly([[0.18 * s, -0.16 * s], [0.18 * s, -0.3 * s], [0.6 * s, -0.6 * s], [0.64 * s, -0.54 * s]]), col, 1),
    ol(ellipse(0.65 * s, -0.6 * s, 0.045 * s, 0.09 * s, -40), dk, 1),
    ol(rect(-0.28 * s, -0.5 * s, 0.5 * s, 0.5 * s, 0.05 * s), col, 1),
    sh(rect(0.06 * s, -0.5 * s, 0.16 * s, 0.5 * s, 0.04 * s), shade(col, -0.12)),
    ol(ellipse(-0.03 * s, -0.5 * s, 0.25 * s, 0.05 * s), shade(col, 0.15), 1),
    stroke(M(-0.22 * s, -0.53 * s) + Q(-0.03 * s, -0.88 * s, 0.16 * s, -0.53 * s), dk, 0.05 * s),
    sh(rect(-0.28 * s, -0.14 * s, 0.5 * s, 0.05 * s), dk),
    hl(rect(-0.22 * s, -0.44 * s, 0.05 * s, 0.26 * s), 0.4),
  ];
}

/** Wicker basket; origin bottom-centre. Draw `basketHandle` first if wanted. */
export function basket(w: number, h: number, col = P.wicker): Shape[] {
  let weave = '';
  for (let i = 1; i < 4; i++) weave += line([[-w / 2 + (w * 0.1 * i) / 4, -h + (h * i) / 4], [w / 2 - (w * 0.1 * i) / 4, -h + (h * i) / 4]]);
  for (let i = 1; i < 8; i++) { const t = i / 8; weave += line([[-w / 2 + w * t, -h], [-w * 0.4 + w * 0.8 * t, 0]]); }
  return [
    ol(poly([[-w / 2, -h], [w / 2, -h], [w * 0.4, 0], [-w * 0.4, 0]]), col, 1),
    stroke(weave, shade(col, -0.3), 1.1),
    ol(rect(-w / 2 - 3, -h - h * 0.12, w + 6, h * 0.16, 3), shade(col, -0.12), 1),
  ];
}
export const basketHandle = (w: number, h: number, col = P.wicker): Shape[] => [stroke(M(-w * 0.4, -h) + C(-w * 0.42, -h - h * 1.3, w * 0.42, -h - h * 1.3, w * 0.4, -h), shade(col, -0.2), Math.max(3, w * 0.06)), stroke(M(-w * 0.4, -h) + C(-w * 0.42, -h - h * 1.3, w * 0.42, -h - h * 1.3, w * 0.4, -h), shade(col, 0.1), Math.max(1, w * 0.02))];

/** Vintage step-through bicycle; origin on the ground, centred. */
export function bicycle(s: number, col: string, frontBasket = false): Shape[] {
  const r = 0.3 * s;
  const R: Pt = [-0.52 * s, -r], F: Pt = [0.52 * s, -r], B: Pt = [-0.06 * s, -r], S: Pt = [-0.2 * s, -r - 0.48 * s], Ht: Pt = [0.32 * s, -r - 0.5 * s], Hb: Pt = [0.36 * s, -r - 0.34 * s];
  const out: Shape[] = [];
  const wheel = (c: Pt) => {
    let sp = '';
    for (let k = 0; k < 14; k++) { const a = (k * Math.PI * 2) / 14; sp += line([c, [c[0] + Math.cos(a) * r * 0.86, c[1] + Math.sin(a) * r * 0.86]]); }
    out.push(stroke(sp, '#c9ced1', 0.008 * s + 0.4), stroke(circle(c[0], c[1], r * 0.88), '#b8bec2', 0.02 * s), stroke(circle(c[0], c[1], r * 0.96), '#2f2a28', 0.06 * s), sh(circle(c[0], c[1], 0.035 * s), '#8a9095'));
    const g: Pt[] = [];
    for (let a = 195; a <= 345; a += 15) g.push([c[0] + Math.cos((a * Math.PI) / 180) * r * 1.1, c[1] + Math.sin((a * Math.PI) / 180) * r * 1.1]);
    out.push(stroke(curve(g), col, 0.04 * s));
  };
  wheel(R); wheel(F);
  out.push(stroke(circle(B[0], B[1], 0.07 * s), '#7d858a', 0.02 * s), stroke(line([R, B]), '#7d858a', 0.012 * s));
  out.push(stroke(line([R, B]) + line([R, S]) + line([B, [S[0] - 0.01 * s, S[1] - 0.04 * s]]) + line([Ht, Hb]) + line([Hb, F]), col, 0.045 * s));
  out.push(stroke(curve([Hb, [0.12 * s, -r - 0.12 * s], B]), col, 0.055 * s));
  out.push(stroke(line([[B[0] - 0.05 * s, B[1] + 0.09 * s], [B[0] + 0.05 * s, B[1] - 0.09 * s]]), '#4a4a4a', 0.025 * s), sh(rect(B[0] + 0.02 * s, B[1] - 0.12 * s, 0.08 * s, 0.03 * s, 0.01 * s) + rect(B[0] - 0.1 * s, B[1] + 0.08 * s, 0.08 * s, 0.03 * s, 0.01 * s), '#3a3a3a'));
  out.push(stroke(line([S, [S[0], S[1] - 0.06 * s]]), '#8a9095', 0.03 * s), ol(blob([[S[0] - 0.13 * s, S[1] - 0.08 * s], [S[0] - 0.02 * s, S[1] - 0.12 * s], [S[0] + 0.1 * s, S[1] - 0.09 * s], [S[0] + 0.02 * s, S[1] - 0.04 * s]], 0.8), '#6b4a32', 1));
  out.push(stroke(line([Ht, [Ht[0] - 0.02 * s, Ht[1] - 0.08 * s]]) + curve([[Ht[0] - 0.02 * s, Ht[1] - 0.08 * s], [Ht[0] - 0.1 * s, Ht[1] - 0.12 * s], [Ht[0] - 0.18 * s, Ht[1] - 0.08 * s]]), '#8a9095', 0.03 * s), sh(rect(Ht[0] - 0.24 * s, Ht[1] - 0.1 * s, 0.08 * s, 0.035 * s, 0.015 * s), '#6b4a32'));
  out.push(sh(circle(Ht[0] + 0.03 * s, Ht[1] - 0.02 * s, 0.035 * s), '#f3e7b0'), stroke(circle(Ht[0] + 0.03 * s, Ht[1] - 0.02 * s, 0.035 * s), '#8a9095', 0.01 * s));
  if (frontBasket) out.push(stroke(line([[Ht[0], Ht[1] - 0.04 * s], [Ht[0] + 0.06 * s, Ht[1] - 0.02 * s]]) + line([[Ht[0] + 0.12 * s, Ht[1] + 0.14 * s], [F[0], F[1] - 0.05 * s]]), '#8a9095', 0.015 * s), ...place(basket(0.24 * s, 0.17 * s), { x: Ht[0] + 0.15 * s, y: Ht[1] + 0.14 * s }));
  return out;
}

/** Seed tray of seedlings; origin bottom-centre. */
export function seedTray(w: number, seed: number, tray = '#3d3a36'): Shape[] {
  const g = rng(seed);
  const h = w * 0.18;
  let stems = '', lv = '', lv2 = '';
  for (let row = 0; row < 2; row++) for (let i = 0; i < 6; i++) {
    const x = -w / 2 + w * ((i + 0.5) / 6) + (row ? w * 0.03 : -w * 0.02), y = -h - w * 0.04 - row * w * 0.05, hh = g.range(0.1, 0.16) * w;
    stems += line([[x, y], [x, y - hh]]);
    lv += leaf(x, y - hh, w * 0.08, w * 0.03, -160 + g.range(-10, 10));
    lv2 += leaf(x, y - hh, w * 0.08, w * 0.03, -20 + g.range(-10, 10));
  }
  return [
    ol(poly([[-w / 2, -h - w * 0.1], [w / 2, -h - w * 0.1], [w / 2 + w * 0.02, -h], [-w / 2 - w * 0.02, -h]]), '#6b4a32', 1),
    stroke(stems, '#7fa35a', w * 0.012), sh(lv, '#8fc06a'), sh(lv2, '#7fb05a'),
    ol(rect(-w / 2 - w * 0.02, -h, w * 1.04, h, 2), tray, 1, 0.2),
    stroke(line([[-w / 6, -h], [-w / 6, 0]]) + line([[w / 6, -h], [w / 6, 0]]) + line([[-w / 2, -h], [-w / 2, 0]]) + line([[w / 2, -h], [w / 2, 0]]), shade(tray, 0.25), 1.2),
  ];
}

/** A pair of gardening gloves; origin at the centre. */
export function gloves(s: number, col: string, cuff: string): Shape[] {
  const one = (dx: number, rot: number, c: string): Shape[] => {
    const sc = (d: string) => xfRot(d, rot, dx);
    let fingers = '';
    for (let i = 0; i < 4; i++) fingers += rect(-0.24 * s + i * 0.125 * s, -0.9 * s + Math.abs(i - 1.5) * 0.07 * s, 0.11 * s, 0.5 * s, 0.055 * s);
    return [
      ol(sc(fingers + rect(-0.26 * s, -0.5 * s, 0.52 * s, 0.55 * s, 0.12 * s) + xfRot(rect(0.18 * s, -0.42 * s, 0.11 * s, 0.34 * s, 0.055 * s), -35, 0)), c, 1.2),
      ol(sc(rect(-0.28 * s, 0.02 * s, 0.56 * s, 0.28 * s, 0.05 * s)), cuff, 1.2),
      stroke(sc(line([[-0.26 * s, 0.12 * s], [0.28 * s, 0.12 * s]]) + line([[-0.26 * s, 0.2 * s], [0.28 * s, 0.2 * s]])), shade(cuff, -0.3), 1.4),
    ];
  };
  return [...one(-0.18 * s, -16, shade(col, -0.08)), ...one(0.2 * s, 14, col)];
}
const xfRot = (d: string, rot: number, dx: number) => xf(d, { rot, x: dx });

/** Garden trowel pointing right; origin at the centre. */
export function trowel(s: number, handle = '#c0472e'): Shape[] {
  return [
    ol(rect(-0.55 * s, -0.07 * s, 0.4 * s, 0.14 * s, 0.07 * s), handle, 1),
    hl(rect(-0.5 * s, -0.05 * s, 0.3 * s, 0.03 * s, 0.015 * s), 0.4),
    sh(rect(-0.16 * s, -0.05 * s, 0.08 * s, 0.1 * s), '#c9ced1'),
    stroke(line([[-0.08 * s, 0], [0.02 * s, 0]]), '#9aa2a8', 0.04 * s),
    ol(M(0, 0) + Q(0.1 * s, -0.2 * s, 0.32 * s, -0.12 * s) + Q(0.46 * s, -0.05 * s, 0.52 * s, 0) + Q(0.46 * s, 0.05 * s, 0.32 * s, 0.12 * s) + Q(0.1 * s, 0.2 * s, 0, 0) + 'Z', '#b8c0c5', 1),
    stroke(line([[0.04 * s, 0], [0.44 * s, 0]]), '#8a9298', 0.015 * s),
  ];
}

/** Robin perched, facing left; origin at the feet. */
export function robin(s: number): Shape[] {
  return [
    sh(poly([[0.3 * s, -0.5 * s], [0.72 * s, -0.68 * s], [0.75 * s, -0.56 * s], [0.34 * s, -0.36 * s]]), '#6b5038'),
    stroke(line([[-0.05 * s, -0.16 * s], [-0.08 * s, 0]]) + line([[0.08 * s, -0.16 * s], [0.08 * s, 0]]), '#4a3a2e', 0.03 * s),
    ol(ellipse(0.02 * s, -0.42 * s, 0.38 * s, 0.3 * s, -8), '#8a6a48', 1),
    sh(blob([[-0.34 * s, -0.5 * s], [-0.2 * s, -0.7 * s], [0.0 * s, -0.62 * s], [0.04 * s, -0.36 * s], [-0.1 * s, -0.16 * s], [-0.3 * s, -0.28 * s]], 0.9), '#e0643a'),
    sh(ellipse(0.12 * s, -0.42 * s, 0.24 * s, 0.14 * s, -12), '#6b5038'),
    sh(ellipse(-0.02 * s, -0.22 * s, 0.2 * s, 0.08 * s), '#efe4d0'),
    ol(circle(-0.22 * s, -0.68 * s, 0.18 * s), '#8a6a48', 1),
    sh(blob([[-0.36 * s, -0.66 * s], [-0.26 * s, -0.56 * s], [-0.1 * s, -0.58 * s], [-0.12 * s, -0.5 * s], [-0.36 * s, -0.5 * s]], 0.8), '#e0643a'),
    sh(poly([[-0.38 * s, -0.72 * s], [-0.52 * s, -0.68 * s], [-0.38 * s, -0.65 * s]]), '#3b2f2a'),
    sh(circle(-0.26 * s, -0.72 * s, 0.035 * s), '#1e1a18'), hl(circle(-0.27 * s, -0.73 * s, 0.012 * s), 0.9),
  ];
}

/** Butterfly seen from above; origin at the body centre. */
export function butterfly(s: number, col: string, spot = '#fff6e0'): Shape[] {
  const dk = shade(col, -0.35);
  return [
    ol(petal(0, -0.02 * s, 0.5 * s, 0.26 * s, -145) + petal(0, -0.02 * s, 0.5 * s, 0.26 * s, -35), col, 1.2, -0.4),
    ol(petal(0, 0.04 * s, 0.36 * s, 0.2 * s, 140) + petal(0, 0.04 * s, 0.36 * s, 0.2 * s, 40), shade(col, -0.1), 1.2, -0.4),
    sh(circle(-0.3 * s, -0.24 * s, 0.06 * s) + circle(0.3 * s, -0.24 * s, 0.06 * s) + circle(-0.2 * s, 0.2 * s, 0.045 * s) + circle(0.2 * s, 0.2 * s, 0.045 * s), spot),
    sh(circle(-0.38 * s, -0.12 * s, 0.035 * s) + circle(0.38 * s, -0.12 * s, 0.035 * s), dk),
    sh(ellipse(0, 0, 0.04 * s, 0.22 * s), '#3b2f2a'),
    stroke(curve([[0, -0.2 * s], [-0.06 * s, -0.36 * s], [-0.12 * s, -0.42 * s]]) + curve([[0, -0.2 * s], [0.06 * s, -0.36 * s], [0.12 * s, -0.42 * s]]), '#3b2f2a', 0.02 * s),
  ];
}

/** A-frame chalkboard sign with a chalk flower doodle; origin bottom-centre, `s` tall. */
export function chalkboard(s: number): Shape[] {
  let doodle = '';
  for (let k = 0; k < 5; k++) doodle += petal(0, -0.72 * s, 0.1 * s, 0.045 * s, k * 72 - 90);
  return [
    stroke(line([[-0.22 * s, -0.95 * s], [-0.3 * s, 0]]) + line([[0.22 * s, -0.95 * s], [0.3 * s, 0]]), '#7a5232', 0.05 * s),
    ol(rect(-0.32 * s, -s, 0.64 * s, 0.74 * s, 0.03 * s), '#a8743e', 1),
    sh(rect(-0.27 * s, -0.95 * s, 0.54 * s, 0.64 * s, 0.02 * s), '#33403b'),
    stroke(doodle + line([[0, -0.62 * s], [0, -0.5 * s]]) + curve([[-0.18 * s, -0.42 * s], [-0.08 * s, -0.45 * s], [0.04 * s, -0.4 * s], [0.18 * s, -0.43 * s]]), '#f3efe4', 0.012 * s + 0.6),
    sh(circle(0, -0.72 * s, 0.03 * s), '#f2c14e'),
    stroke(leaf(0, -0.56 * s, 0.1 * s, 0.035 * s, -150) + leaf(0, -0.58 * s, 0.1 * s, 0.035 * s, -30), '#bfe3a8', 0.012 * s + 0.6),
    stroke(line([[-0.2 * s, -0.86 * s], [-0.14 * s, -0.86 * s]]) + line([[0.14 * s, -0.86 * s], [0.2 * s, -0.86 * s]]) + line([[-0.2 * s, -0.36 * s], [0.2 * s, -0.36 * s]]), '#f3a8b8', 0.012 * s + 0.6),
    stroke(line([[-0.3 * s, -0.28 * s], [-0.33 * s, 0]]) + line([[0.3 * s, -0.28 * s], [0.33 * s, 0]]), '#a8743e', 0.05 * s),
  ];
}

/** Wheelbarrow facing right; origin on the ground under the middle. */
export function wheelbarrow(s: number, col: string): Shape[] {
  return [
    stroke(line([[-0.35 * s, -0.38 * s], [-0.78 * s, -0.5 * s]]), '#8a5a30', 0.045 * s),
    stroke(line([[-0.26 * s, -0.26 * s], [-0.3 * s, 0]]) + line([[0.25 * s, -0.3 * s], [0.42 * s, -0.16 * s]]), '#5a5a5a', 0.035 * s),
    ol(circle(0.42 * s, -0.16 * s, 0.16 * s), '#3b3633', 1), sh(circle(0.42 * s, -0.16 * s, 0.07 * s), '#c9ced1'),
    ol(poly([[-0.5 * s, -0.6 * s], [0.46 * s, -0.6 * s], [0.3 * s, -0.25 * s], [-0.35 * s, -0.25 * s]]), col, 1.2),
    sh(poly([[-0.5 * s, -0.6 * s], [0.46 * s, -0.6 * s], [0.42 * s, -0.53 * s], [-0.46 * s, -0.53 * s]]), shade(col, -0.25)),
    hl(poly([[-0.38 * s, -0.5 * s], [-0.26 * s, -0.5 * s], [-0.22 * s, -0.3 * s], [-0.3 * s, -0.3 * s]]), 0.25),
    stroke(line([[-0.78 * s, -0.5 * s], [-0.86 * s, -0.52 * s]]), '#3b2f2a', 0.06 * s),
  ];
}

/** A pair of rubber boots; origin on the ground. */
export function boots(s: number, col: string): Shape[] {
  const boot = (dx: number, c: string): Shape[] => [
    ol(M(dx - 0.15 * s, -s) + L(dx + 0.12 * s, -s) + L(dx + 0.14 * s, -0.32 * s) + Q(dx + 0.42 * s, -0.26 * s, dx + 0.42 * s, -0.06 * s) + L(dx - 0.17 * s, -0.06 * s) + 'Z', c, 1.2),
    sh(rect(dx - 0.19 * s, -0.08 * s, 0.63 * s, 0.08 * s, 0.03 * s), '#3b3633'),
    sh(rect(dx - 0.17 * s, -1.02 * s, 0.31 * s, 0.09 * s, 0.03 * s), shade(c, 0.2)),
    hl(rect(dx - 0.1 * s, -0.88 * s, 0.04 * s, 0.6 * s, 0.02 * s), 0.3),
  ];
  return [...boot(0.18 * s, shade(col, -0.1)), ...boot(-0.12 * s, col)];
}

/** Bird house on a short post; origin at the bottom of the post. */
export function birdhouse(s: number, col: string, roof: string): Shape[] {
  return [
    sh(rect(-0.05 * s, -0.6 * s, 0.1 * s, 0.6 * s), '#8a5a30'),
    ol(rect(-0.25 * s, -1.1 * s, 0.5 * s, 0.5 * s, 0.02 * s), col, 1.2),
    ol(poly([[-0.34 * s, -1.06 * s], [0, -1.42 * s], [0.34 * s, -1.06 * s], [0.3 * s, -1.02 * s], [0, -1.32 * s], [-0.3 * s, -1.02 * s]]), roof, 1.2),
    sh(poly([[-0.25 * s, -1.08 * s], [0, -1.32 * s], [0.25 * s, -1.08 * s]]), col),
    sh(circle(0, -0.9 * s, 0.09 * s), '#3b2f2a'),
    stroke(line([[0, -0.74 * s], [0.18 * s, -0.74 * s]]), '#8a5a30', 0.035 * s),
  ];
}

/** A wooden crate; origin bottom-centre. */
export function crate(w: number, h: number, col: string): Shape[] {
  let slats = '';
  for (let i = 0; i < 3; i++) slats += rect(-w / 2, -h + (i * h) / 3 + 2, w, h / 3 - 5, 2);
  return [sh(rect(-w / 2, -h, w, h), shade(col, -0.35)), ol(slats, col, 1), sh(rect(-w / 2, -h, 8, h) + rect(w / 2 - 8, -h, 8, h), shade(col, -0.1))];
}

// =====================================================================
// summer seaside
// =====================================================================
/** Beach parasol; origin at the foot of the pole. */
export function parasol(s: number, a: string, b: string): Shape[] {
  const apex: Pt = [0, -1.04 * s];
  let pa = '', pb = '';
  const k = 6;
  for (let i = 0; i < k; i++) {
    const x0 = -0.56 * s + (i * 1.12 * s) / k, x1 = x0 + (1.12 * s) / k;
    const y0 = -0.74 * s - Math.sin((i / k) * Math.PI) * 0.06 * s, y1 = -0.74 * s - Math.sin(((i + 1) / k) * Math.PI) * 0.06 * s;
    const d = M(apex[0], apex[1]) + L(x0, y0) + Q((x0 + x1) / 2, (y0 + y1) / 2 + 0.07 * s, x1, y1) + 'Z';
    if (i % 2) pb += d; else pa += d;
  }
  return [stroke(line([[0, 0], [0, -1.04 * s]]), '#efe8dc', 0.025 * s), stroke(line([[0, 0], [0, -1.04 * s]]), '#9a8a7a', 0.008 * s), sh(pa, a), sh(pb, b), sh(poly([apex, [-0.56 * s, -0.74 * s], [0.56 * s, -0.74 * s]]), '#000000', { opacity: 0.04 }), sh(circle(0, -1.06 * s, 0.03 * s), shade(a, -0.3))];
}

/** Striped deckchair seen from the front; origin on the ground. */
export function deckchair(s: number, a: string, b: string, frame = '#c99a62'): Shape[] {
  const tl: Pt = [-0.32 * s, -0.95 * s], tr: Pt = [0.32 * s, -0.95 * s], bl: Pt = [-0.38 * s, -0.38 * s], br: Pt = [0.38 * s, -0.38 * s];
  let sa = '', sb = '';
  const k = 7;
  for (let i = 0; i < k; i++) {
    const u0 = i / k, u1 = (i + 1) / k;
    const p = poly([[tl[0] + (tr[0] - tl[0]) * u0, tl[1]], [tl[0] + (tr[0] - tl[0]) * u1, tl[1]], [bl[0] + (br[0] - bl[0]) * u1, bl[1] + Math.sin(u1 * Math.PI) * 0.12 * s], [bl[0] + (br[0] - bl[0]) * u0, bl[1] + Math.sin(u0 * Math.PI) * 0.12 * s]]);
    if (i % 2) sb += p; else sa += p;
  }
  return [
    stroke(line([[-0.3 * s, -0.55 * s], [-0.36 * s, 0]]) + line([[0.3 * s, -0.55 * s], [0.36 * s, 0]]), shade(frame, -0.2), 0.045 * s),
    sh(sa, a), sh(sb, b),
    sh(poly([bl, br, [br[0], br[1] + 0.02 * s], [0, bl[1] + 0.14 * s], [bl[0], bl[1] + 0.02 * s]]), '#000000', { opacity: 0.12 }),
    stroke(line([[-0.35 * s, -1.0 * s], [-0.46 * s, 0]]) + line([[0.35 * s, -1.0 * s], [0.46 * s, 0]]), frame, 0.05 * s),
    stroke(line([[-0.36 * s, -0.96 * s], [0.36 * s, -0.96 * s]]) + line([[-0.42 * s, -0.4 * s], [0.42 * s, -0.4 * s]]), frame, 0.035 * s),
  ];
}

/** Surfboard standing upright; origin at the centre. */
export function surfboard(l: number, col: string, stripe: string): Shape[] {
  const w = l * 0.13;
  const body = blob([[0, -l / 2], [w * 0.6, -l * 0.36], [w, -l * 0.05], [w * 0.8, l * 0.36], [0, l / 2], [-w * 0.8, l * 0.36], [-w, -l * 0.05], [-w * 0.6, -l * 0.36]], 0.9);
  return [
    ol(body, col, 1.2),
    sh(blob([[0, -l * 0.42], [w * 0.22, -l * 0.1], [w * 0.2, l * 0.4], [0, l * 0.45], [-w * 0.2, l * 0.4], [-w * 0.22, -l * 0.1]], 0.9), stripe),
    hl(blob([[-w * 0.5, -l * 0.3], [-w * 0.35, -l * 0.34], [-w * 0.6, l * 0.1], [-w * 0.72, l * 0.0]], 0.9), 0.3),
  ];
}

/** Sandcastle with towers and a little flag; origin bottom-centre. */
export function sandcastle(s: number, flag: string): Shape[] {
  const sand = '#e7c486', dk = '#d1a964';
  const tower = (x: number, w: number, h: number) => rect(x - w / 2, -h, w, h) + rect(x - w / 2 - 2, -h - 0.08 * s, w * 0.28, 0.1 * s) + rect(x - w * 0.14, -h - 0.08 * s, w * 0.28, 0.1 * s) + rect(x + w / 2 - w * 0.28 + 2, -h - 0.08 * s, w * 0.28, 0.1 * s);
  let tex = '';
  const g = rng(Math.round(s * 7));
  for (let i = 0; i < 14; i++) tex += circle(g.range(-0.45, 0.45) * s, -g.range(0.05, 0.4) * s, 0.012 * s + 0.5);
  return [
    ol(blob([[-0.6 * s, 0], [-0.5 * s, -0.08 * s], [0.5 * s, -0.08 * s], [0.6 * s, 0]], 0.5), dk, 1, -0.15),
    ol(tower(0, 0.44 * s, 0.62 * s), sand, 1, -0.2),
    ol(tower(-0.34 * s, 0.26 * s, 0.44 * s) + tower(0.34 * s, 0.26 * s, 0.44 * s), sand, 1, -0.2),
    sh(rect(-0.47 * s, -0.16 * s, 0.94 * s, 0.16 * s), dk),
    sh(M(-0.08 * s, 0) + L(-0.08 * s, -0.16 * s) + Q(0, -0.26 * s, 0.08 * s, -0.16 * s) + L(0.08 * s, 0) + 'Z', '#a7834a'),
    sh(rect(-0.37 * s, -0.34 * s, 0.06 * s, 0.08 * s) + rect(0.31 * s, -0.34 * s, 0.06 * s, 0.08 * s) + rect(-0.03 * s, -0.5 * s, 0.06 * s, 0.08 * s), '#b8925a'),
    sh(tex, '#c49a5a'),
    stroke(line([[0, -0.7 * s], [0, -1.0 * s]]), '#7a5232', 0.02 * s),
    sh(poly([[0, -1.0 * s], [0.2 * s, -0.94 * s], [0, -0.88 * s]]), flag),
  ];
}

/** Bucket and spade; origin bottom-centre. */
export function bucketSpade(s: number, col: string, spade = '#f2c14e'): Shape[] {
  return [
    stroke(line([[0.1 * s, -1.05 * s], [0.38 * s, -0.25 * s]]), '#c99a62', 0.05 * s),
    ol(poly([[0.32 * s, -0.36 * s], [0.48 * s, -0.42 * s], [0.56 * s, -0.08 * s], [0.44 * s, 0], [0.38 * s, -0.04 * s]]), spade, 1),
    stroke(M(-0.34 * s, -0.66 * s) + Q(0, -1.12 * s, 0.34 * s, -0.66 * s), shade(col, -0.25), 0.03 * s),
    ol(poly([[-0.36 * s, -0.66 * s], [0.36 * s, -0.66 * s], [0.27 * s, 0], [-0.27 * s, 0]]), col, 1.2),
    sh(rect(-0.38 * s, -0.7 * s, 0.76 * s, 0.08 * s, 0.03 * s), shade(col, 0.2)),
    sh(star(-0.02 * s, -0.34 * s, 0.14 * s, 0.06 * s), '#fff6e0'),
    sh(circle(-0.38 * s, -0.66 * s, 0.03 * s) + circle(0.38 * s, -0.66 * s, 0.03 * s), shade(col, -0.3)),
  ];
}

/** Beach ball; origin at the centre. */
export function beachBall(r: number, cols: [string, string, string]): Shape[] {
  const gore = (k1: number, k2: number) => M(0, -r) + Q(k1 * r, 0, 0, r) + Q(k2 * r, 0, 0, -r) + 'Z';
  return [
    ol(circle(0, 0, r), '#fbf6ea', 1.2, -0.2),
    sh(gore(-2, -0.95), cols[0]), sh(gore(-0.38, 0.38), cols[1]), sh(gore(0.95, 2), cols[2]),
    sh(ellipse(0, -r * 0.88, r * 0.2, r * 0.1), '#fbf6ea'),
    hl(ellipse(-r * 0.42, -r * 0.45, r * 0.18, r * 0.1, -40), 0.5),
    stroke(circle(0, 0, r), '#8a7a6a', 1, { opacity: 0.5 }),
  ];
}

/** Starfish; origin at the centre. */
export function starfish(s: number, col: string): Shape[] {
  const pts: Pt[] = [];
  for (let i = 0; i < 10; i++) { const a = ((-90 + i * 36) * Math.PI) / 180, r = i % 2 ? s * 0.22 : s * 0.5; pts.push([Math.cos(a) * r, Math.sin(a) * r]); }
  let dots = '';
  for (let i = 0; i < 5; i++) { const a = ((-90 + i * 72) * Math.PI) / 180; for (const t of [0.18, 0.3, 0.4]) dots += circle(Math.cos(a) * s * t, Math.sin(a) * s * t, s * 0.025); }
  return [ol(blob(pts, 0.35), col, 1.2), sh(blob(pts.map(([x, y]) => [x * 0.55, y * 0.55] as Pt), 0.35), shade(col, 0.15)), sh(dots, '#fff3dc')];
}

/** Scallop shell; origin at the hinge. */
export function shell(s: number, col: string): Shape[] {
  let ridges = '';
  for (let i = 0; i <= 6; i++) { const a = ((-150 + i * 20) * Math.PI) / 180; ridges += line([[0, 0], [Math.cos(a) * s * 0.5, Math.sin(a) * s * 0.5]]); }
  const fan: Pt[] = [];
  for (let i = 0; i <= 12; i++) { const a = ((-160 + i * (140 / 12)) * Math.PI) / 180, r = s * (i % 2 ? 0.55 : 0.6); fan.push([Math.cos(a) * r, Math.sin(a) * r]); }
  return [ol(poly([[0, 0], ...fan]), col, 1), stroke(ridges, shade(col, -0.25), 1), ol(poly([[-0.14 * s, 0.04 * s], [0.14 * s, 0.04 * s], [0.08 * s, -0.08 * s], [-0.08 * s, -0.08 * s]]), shade(col, -0.1), 1)];
}

/** Crab; origin at the centre. */
export function crab(s: number, col = '#e0583a'): Shape[] {
  const dk = shade(col, -0.3);
  let legs = '';
  for (let i = 0; i < 3; i++) { legs += curve([[-0.3 * s, 0.02 * s + i * 0.07 * s], [-0.5 * s, -0.02 * s + i * 0.1 * s], [-0.58 * s, 0.14 * s + i * 0.1 * s]]); legs += curve([[0.3 * s, 0.02 * s + i * 0.07 * s], [0.5 * s, -0.02 * s + i * 0.1 * s], [0.58 * s, 0.14 * s + i * 0.1 * s]]); }
  const claw = (x: number, flip: number) => M(x, -0.36 * s) + Q(x - flip * 0.14 * s, -0.4 * s, x - flip * 0.12 * s, -0.24 * s) + Q(x - flip * 0.04 * s, -0.14 * s, x + flip * 0.06 * s, -0.2 * s) + L(x - flip * 0.02 * s, -0.27 * s) + L(x + flip * 0.06 * s, -0.32 * s) + 'Z';
  return [
    stroke(legs, dk, 0.045 * s),
    stroke(line([[-0.22 * s, -0.08 * s], [-0.32 * s, -0.24 * s]]) + line([[0.22 * s, -0.08 * s], [0.32 * s, -0.24 * s]]), dk, 0.05 * s),
    ol(claw(-0.3 * s, -1) + claw(0.3 * s, 1), col, 1),
    ol(ellipse(0, 0, 0.34 * s, 0.22 * s), col, 1.2),
    stroke(line([[-0.08 * s, -0.16 * s], [-0.1 * s, -0.3 * s]]) + line([[0.08 * s, -0.16 * s], [0.1 * s, -0.3 * s]]), dk, 0.025 * s),
    sh(circle(-0.1 * s, -0.32 * s, 0.05 * s) + circle(0.1 * s, -0.32 * s, 0.05 * s), '#ffffff'), sh(circle(-0.1 * s, -0.32 * s, 0.025 * s) + circle(0.1 * s, -0.32 * s, 0.025 * s), '#1e1a18'),
    hl(ellipse(-0.1 * s, -0.08 * s, 0.12 * s, 0.05 * s), 0.3),
  ];
}

/** Sunglasses; origin at the bridge. */
export function sunglasses(s: number, frame = '#2f2a28', lens = '#3d4f5c'): Shape[] {
  const lensD = (x: number) => blob([[x - 0.2 * s, -0.08 * s], [x + 0.2 * s, -0.08 * s], [x + 0.18 * s, 0.08 * s], [x, 0.14 * s], [x - 0.18 * s, 0.08 * s]], 0.7);
  return [
    stroke(line([[-0.42 * s, -0.06 * s], [-0.52 * s, -0.12 * s]]) + line([[0.42 * s, -0.06 * s], [0.52 * s, -0.12 * s]]), frame, 0.04 * s),
    sh(lensD(-0.22 * s) + lensD(0.22 * s), frame, { stroke: frame, strokeWidth: 0.05 * s }),
    sh(lensD(-0.22 * s) + lensD(0.22 * s), lens),
    hl(ellipse(-0.3 * s, -0.02 * s, 0.05 * s, 0.025 * s, -20) + ellipse(0.14 * s, -0.02 * s, 0.05 * s, 0.025 * s, -20), 0.45),
    stroke(M(-0.04 * s, -0.06 * s) + Q(0, -0.1 * s, 0.04 * s, -0.06 * s), frame, 0.04 * s),
  ];
}

/** A pair of flip-flops seen from above; origin at the centre. */
export function flipflops(s: number, col: string, strap: string): Shape[] {
  const sole = (x: number, rot: number) => xf(blob([[0, -0.45 * s], [0.13 * s, -0.38 * s], [0.12 * s, 0.05 * s], [0.14 * s, 0.38 * s], [0, 0.46 * s], [-0.13 * s, 0.38 * s], [-0.1 * s, 0.05 * s], [-0.14 * s, -0.36 * s]], 0.9), { rot, x });
  const st = (x: number, rot: number) => xf(M(-0.11 * s, 0.02 * s) + Q(-0.06 * s, -0.3 * s, 0, -0.3 * s) + Q(0.06 * s, -0.3 * s, 0.11 * s, 0.02 * s), { rot, x });
  return [ol(sole(-0.17 * s, -8) + sole(0.17 * s, 10), col, 1.2), stroke(st(-0.17 * s, -8) + st(0.17 * s, 10), strap, 0.05 * s), sh(xf(circle(0, -0.3 * s, 0.03 * s), { rot: -8, x: -0.17 * s }) + xf(circle(0, -0.3 * s, 0.03 * s), { rot: 10, x: 0.17 * s }), shade(strap, -0.3))];
}

/** Life ring; origin at the centre. */
export function lifebuoy(r: number): Shape[] {
  let red = '', white = '';
  for (let i = 0; i < 4; i++) { red += sector(0, 0, r, i * 90 - 22, i * 90 + 22, r * 0.55); white += sector(0, 0, r, i * 90 + 22, i * 90 + 68, r * 0.55); }
  return [sh(white, '#fbf6ea'), sh(red, '#d8452f'), stroke(circle(0, 0, r) + circle(0, 0, r * 0.55), '#8a3a2a', 1.2), stroke(circle(0, 0, r * 0.78), '#c9b48a', 1.4, { opacity: 0.8 })];
}

/** Straw sun hat with a ribbon; origin at the centre of the brim. */
export function sunhat(s: number, ribbon: string): Shape[] {
  const straw = '#e9cf8e';
  let weave = '';
  for (let i = 1; i < 4; i++) weave += ellipse(0, 0, 0.5 * s * (i / 4) + 0.12 * s, 0.14 * s * (i / 4) + 0.04 * s);
  return [
    ol(ellipse(0, 0, 0.62 * s, 0.2 * s), straw, 1.2, -0.25),
    stroke(weave, shade(straw, -0.15), 1),
    ol(M(-0.26 * s, -0.02 * s) + C(-0.28 * s, -0.42 * s, 0.28 * s, -0.42 * s, 0.26 * s, -0.02 * s) + Q(0, 0.06 * s, -0.26 * s, -0.02 * s) + 'Z', shade(straw, 0.06), 1.2, -0.25),
    sh(M(-0.26 * s, -0.04 * s) + Q(0, 0.04 * s, 0.26 * s, -0.04 * s) + L(0.27 * s, -0.12 * s) + Q(0, -0.04 * s, -0.27 * s, -0.12 * s) + 'Z', ribbon),
    sh(leaf(0.22 * s, -0.06 * s, 0.22 * s, 0.05 * s, 40) + leaf(0.22 * s, -0.06 * s, 0.2 * s, 0.05 * s, 75), ribbon),
  ];
}

/** Small sailing boat; origin at the waterline centre. */
export function sailboat(s: number, hull: string, sail: string, sail2 = '#f3e6c8'): Shape[] {
  return [
    stroke(line([[0, -0.02 * s], [0, -s]]), '#7a5232', 0.025 * s),
    ol(poly([[0.03 * s, -0.96 * s], [0.45 * s, -0.12 * s], [0.03 * s, -0.12 * s]]), sail, 1, -0.15),
    ol(poly([[-0.03 * s, -0.82 * s], [-0.03 * s, -0.12 * s], [-0.36 * s, -0.12 * s]]), sail2, 1, -0.15),
    ol(M(-0.5 * s, -0.12 * s) + L(0.55 * s, -0.12 * s) + Q(0.4 * s, 0.06 * s, 0.32 * s, 0.06 * s) + L(-0.36 * s, 0.06 * s) + Q(-0.44 * s, 0.04 * s, -0.5 * s, -0.12 * s) + 'Z', hull, 1),
    sh(rect(-0.45 * s, -0.08 * s, 0.95 * s, 0.03 * s), '#fbf6ea'),
    sh(poly([[0, -s], [0.12 * s, -0.96 * s], [0, -0.92 * s]]), '#d8452f'),
  ];
}

/** Seagull standing, facing right; origin at the feet. */
export function gull(s: number): Shape[] {
  return [
    stroke(line([[-0.04 * s, -0.3 * s], [-0.06 * s, 0]]) + line([[0.08 * s, -0.3 * s], [0.1 * s, 0]]), '#e9a23a', 0.035 * s),
    ol(blob([[-0.5 * s, -0.48 * s], [-0.1 * s, -0.66 * s], [0.25 * s, -0.62 * s], [0.34 * s, -0.46 * s], [0.12 * s, -0.28 * s], [-0.28 * s, -0.36 * s]], 0.8), '#fbfbf8', 1, -0.2),
    sh(blob([[-0.6 * s, -0.5 * s], [-0.16 * s, -0.66 * s], [0.18 * s, -0.56 * s], [-0.04 * s, -0.44 * s], [-0.4 * s, -0.42 * s]], 0.8), '#a9b2b8'),
    sh(poly([[-0.62 * s, -0.5 * s], [-0.42 * s, -0.54 * s], [-0.4 * s, -0.44 * s]]), '#2f2f33'),
    ol(circle(0.3 * s, -0.74 * s, 0.14 * s), '#fbfbf8', 1, -0.2),
    sh(poly([[0.4 * s, -0.78 * s], [0.62 * s, -0.74 * s], [0.4 * s, -0.7 * s]]), '#f2c14e'), sh(circle(0.55 * s, -0.73 * s, 0.018 * s), '#d8452f'),
    sh(circle(0.33 * s, -0.78 * s, 0.025 * s), '#1e1a18'),
  ];
}

/** Gull in flight (distant), origin at the body. */
export const flyingGull = (s: number, col = '#5a6670'): Shape => stroke(curve([[-s, 0.15 * s], [-0.55 * s, -0.28 * s], [0, 0]]) + curve([[0, 0], [0.55 * s, -0.28 * s], [s, 0.15 * s]]), col, Math.max(1.5, 0.1 * s));

/** Diamond kite with a bow tail; origin at the centre. Tail hangs down-left. */
export function kite(s: number, a: string, b: string, tail: string): Shape[] {
  const T: Pt = [0, -0.6 * s], R: Pt = [0.4 * s, -0.12 * s], B: Pt = [0, 0.6 * s], Lf: Pt = [-0.4 * s, -0.12 * s], Cc: Pt = [0, -0.12 * s];
  const tailPts: Pt[] = [B, [-0.1 * s, 0.85 * s], [0.06 * s, 1.1 * s], [-0.12 * s, 1.35 * s], [-0.02 * s, 1.6 * s]];
  let bows = '';
  for (const [x, y] of tailPts.slice(1, 5)) bows += poly([[x, y], [x - 0.09 * s, y - 0.05 * s], [x - 0.09 * s, y + 0.05 * s]]) + poly([[x, y], [x + 0.09 * s, y - 0.05 * s], [x + 0.09 * s, y + 0.05 * s]]);
  return [
    stroke(curve(tailPts), '#6b5a48', 0.012 * s + 0.6),
    sh(bows, tail),
    sh(poly([T, R, Cc]) + poly([B, Lf, Cc]), a), sh(poly([R, B, Cc]) + poly([Lf, T, Cc]), b),
    stroke(poly([T, R, B, Lf]), shade(a, -0.35), 1.2),
    stroke(line([T, B]) + line([Lf, R]), '#6b5a48', 1.2),
  ];
}

/** Ice-cream cone with two scoops; origin at the tip of the cone. */
export function iceCream(s: number, a = '#f4a6b8', b = '#bfe3c8'): Shape[] {
  const Lp = (u: number): Pt => [-0.22 * s * (1 - u), -0.62 * s * (1 - u)], Rp = (u: number): Pt => [0.22 * s * (1 - u), -0.62 * s * (1 - u)];
  let hatch = '';
  for (let u = 0.25; u < 1; u += 0.25) { hatch += line([Lp(u), Rp(Math.max(0, u - 0.4))]) + line([Lp(Math.max(0, u - 0.4)), Rp(u)]); }
  return [
    ol(poly([[-0.22 * s, -0.62 * s], [0.22 * s, -0.62 * s], [0, 0]]), '#d9a35a', 1, -0.3),
    stroke(hatch, '#b07a3a', 0.015 * s + 0.4),
    ol(circle(0, -0.96 * s, 0.2 * s), b, 1, -0.2),
    ol(M(-0.25 * s, -0.66 * s) + C(-0.3 * s, -0.95 * s, 0.3 * s, -0.95 * s, 0.25 * s, -0.66 * s) + Q(0.16 * s, -0.56 * s, 0.1 * s, -0.64 * s) + Q(0.02 * s, -0.54 * s, -0.06 * s, -0.63 * s) + Q(-0.16 * s, -0.56 * s, -0.25 * s, -0.66 * s) + 'Z', a, 1, -0.2),
    sh(rect(0.06 * s, -1.26 * s, 0.07 * s, 0.24 * s, 0.02 * s), '#e8c27a', { stroke: '#b07a3a', strokeWidth: 0.6 }),
    ol(circle(-0.02 * s, -1.18 * s, 0.065 * s), '#d8302f', 1),
    hl(ellipse(-0.1 * s, -0.8 * s, 0.06 * s, 0.03 * s, -20) + ellipse(-0.08 * s, -1.04 * s, 0.05 * s, 0.025 * s, -20), 0.5),
  ];
}

/** Beach hut with a gabled roof and plank door; origin bottom-left. */
export function beachHut(w: number, h: number, col: string, trim: string, seed: number): Shape[] {
  return [
    ...planks(0, -h, w, h, Math.max(4, Math.round(w / 14)), col, seed, true),
    ol(poly([[-8, -h + 2], [w / 2, -h - w * 0.45], [w + 8, -h + 2]]), trim, 1.2),
    sh(poly([[w / 2, -h - w * 0.45], [w + 8, -h + 2], [w / 2, -h + 2]]), shade(trim, -0.12)),
    ol(rect(w * 0.26, -h * 0.72, w * 0.48, h * 0.72), shade(col, 0.15), 1),
    stroke(line([[w / 2, -h * 0.72], [w / 2, 0]]), shade(col, -0.25), 1.4),
    sh(circle(w * 0.46, -h * 0.36, 2.2) + circle(w * 0.54, -h * 0.36, 2.2), '#c9a24a'),
    ol(circle(w / 2, -h - w * 0.16, w * 0.08), '#fbf6ea', 1),
    sh(rect(-4, -2, w + 8, 6), shade(col, -0.35)),
  ];
}

/** Striped beach towel lying flat (seen in perspective); origin at the centre. */
export function towel(w: number, h: number, a: string, b: string): Shape[] {
  let s = '';
  const k = 5;
  for (let i = 0; i < k; i++) if (i % 2) s += poly([[-w / 2 + (w * i) / k + h * 0.15, -h / 2], [-w / 2 + (w * (i + 1)) / k + h * 0.15, -h / 2], [-w / 2 + (w * (i + 1)) / k - h * 0.15, h / 2], [-w / 2 + (w * i) / k - h * 0.15, h / 2]]);
  return [sh(poly([[-w / 2 + h * 0.15, -h / 2], [w / 2 + h * 0.15, -h / 2], [w / 2 - h * 0.15, h / 2], [-w / 2 - h * 0.15, h / 2]]), a), sh(s, b)];
}

// =====================================================================
// autumn fair
// =====================================================================
/** Pumpkin; origin bottom-centre, `s` wide. */
export function pumpkin(s: number, col = '#e8862e'): Shape[] {
  return [
    ol(ellipse(-0.28 * s, -0.27 * s, 0.22 * s, 0.26 * s) + ellipse(0.28 * s, -0.27 * s, 0.22 * s, 0.26 * s), shade(col, -0.12), 1, -0.3),
    ol(ellipse(-0.15 * s, -0.29 * s, 0.2 * s, 0.28 * s) + ellipse(0.15 * s, -0.29 * s, 0.2 * s, 0.28 * s), col, 1, -0.25),
    ol(ellipse(0, -0.3 * s, 0.16 * s, 0.29 * s), shade(col, 0.1), 1, -0.25),
    hl(ellipse(-0.05 * s, -0.42 * s, 0.03 * s, 0.1 * s), 0.3),
    ol(M(-0.04 * s, -0.56 * s) + Q(-0.03 * s, -0.7 * s, 0.06 * s, -0.76 * s) + L(0.09 * s, -0.71 * s) + Q(0.04 * s, -0.66 * s, 0.05 * s, -0.56 * s) + 'Z', '#6b7a3a', 1),
    stroke(curve([[0.04 * s, -0.62 * s], [0.14 * s, -0.66 * s], [0.13 * s, -0.58 * s], [0.2 * s, -0.6 * s]]), '#7f8f4a', 0.015 * s + 0.4),
  ];
}

/** Jack-o'-lantern style carved pumpkin with a warm glow; origin bottom-centre. */
export function carvedPumpkin(s: number): Shape[] {
  const glow = '#f7c948';
  return [
    ...pumpkin(s, '#e07a28'),
    sh(poly([[-0.2 * s, -0.4 * s], [-0.08 * s, -0.4 * s], [-0.14 * s, -0.5 * s]]) + poly([[0.08 * s, -0.4 * s], [0.2 * s, -0.4 * s], [0.14 * s, -0.5 * s]]) + poly([[-0.03 * s, -0.33 * s], [0.03 * s, -0.33 * s], [0, -0.38 * s]]), glow, { stroke: '#8a3a14', strokeWidth: 1 }),
    sh(M(-0.24 * s, -0.24 * s) + Q(0, -0.08 * s, 0.24 * s, -0.24 * s) + Q(0, -0.16 * s, -0.24 * s, -0.24 * s) + 'Z', glow, { stroke: '#8a3a14', strokeWidth: 1 }),
    sh(rect(-0.06 * s, -0.2 * s, 0.04 * s, 0.03 * s) + rect(0.04 * s, -0.2 * s, 0.04 * s, 0.03 * s), '#e07a28'),
  ];
}

/** Gourd; origin bottom-centre, `s` tall. */
export function gourd(s: number, col: string, stripes?: string): Shape[] {
  const body = blob([[0, -0.98 * s], [0.12 * s, -0.86 * s], [0.14 * s, -0.6 * s], [0.34 * s, -0.36 * s], [0.3 * s, -0.04 * s], [0, 0], [-0.3 * s, -0.04 * s], [-0.34 * s, -0.36 * s], [-0.14 * s, -0.6 * s], [-0.12 * s, -0.86 * s]], 0.8);
  const out: Shape[] = [ol(body, col, 1)];
  if (stripes) out.push(stroke(curve([[0, -0.96 * s], [0.06 * s, -0.6 * s], [0.18 * s, -0.3 * s], [0.12 * s, -0.04 * s]]) + curve([[0, -0.96 * s], [-0.06 * s, -0.6 * s], [-0.18 * s, -0.3 * s], [-0.12 * s, -0.04 * s]]) + curve([[0, -0.96 * s], [0, -0.5 * s], [0, 0]]), stripes, 0.05 * s));
  out.push(hl(ellipse(-0.14 * s, -0.36 * s, 0.05 * s, 0.12 * s), 0.3), sh(rect(-0.03 * s, -1.08 * s, 0.06 * s, 0.12 * s, 0.02 * s), '#6b5a3a'));
  return out;
}

/** Rectangular hay bale in three-quarter view; origin bottom-left of the front face. */
export function hayBale(w: number, h: number, seed: number): Shape[] {
  const g = rng(seed);
  const d = h * 0.35, col = '#e2bd5a';
  let straw = '';
  for (let i = 0; i < Math.round((w * h) / 260); i++) { const x = g.range(4, w - 4), y = -g.range(4, h - 4), a = g.range(-30, 30); straw += line([[x, y], [x + Math.cos((a * Math.PI) / 180) * 9, y + Math.sin((a * Math.PI) / 180) * 9]]); }
  return [
    sh(poly([[w, 0], [w, -h], [w + d, -h - d * 0.6], [w + d, -d * 0.6]]), shade(col, -0.18)),
    sh(poly([[0, -h], [d, -h - d * 0.6], [w + d, -h - d * 0.6], [w, -h]]), shade(col, 0.15)),
    sh(rect(0, -h, w, h), col),
    stroke(straw, shade(col, -0.22), 1),
    stroke(line([[w * 0.25, 0], [w * 0.25, -h], [w * 0.25 + d, -h - d * 0.6]]) + line([[w * 0.75, 0], [w * 0.75, -h], [w * 0.75 + d, -h - d * 0.6]]), '#a0502e', 2),
    stroke(rect(0, -h, w, h), shade(col, -0.3), 1),
  ];
}

/** Apple; origin at the centre. */
export function apple(r: number, col: string): Shape[] {
  return [ol(blob([[0, -0.8 * r], [0.7 * r, -0.95 * r], [r, -0.1 * r], [0.6 * r, 0.9 * r], [0, 0.8 * r], [-0.6 * r, 0.9 * r], [-r, -0.1 * r], [-0.7 * r, -0.95 * r]], 0.9), col, 1), hl(ellipse(-0.45 * r, -0.35 * r, 0.16 * r, 0.26 * r, 20), 0.4), stroke(line([[0, -0.8 * r], [0.12 * r, -1.25 * r]]), '#5a3a22', 0.14 * r), sh(leaf(0.08 * r, -1.0 * r, 0.6 * r, 0.22 * r, -20), '#6f9a3a')];
}

/** Heap of apples with a rounded top; origin at the base centre. */
export function appleHeap(w: number, h: number, seed: number, cols: string[]): Shape[] {
  const g = rng(seed);
  const by = cols.map(() => '');
  let hls = '';
  const r = w * 0.09;
  for (let row = 0; row < 4; row++) {
    const yy = -row * r * 1.3, half = (w / 2) * Math.sqrt(1 - Math.pow(row / 4, 2)) - r * 0.4;
    for (let x = -half; x <= half; x += r * 1.6) {
      const cx = x + g.range(-2, 2), cy = yy - g.range(0, 3) - (h - r * 5) * (row / 4);
      by[g.int(0, cols.length - 1)] += circle(cx, cy, r);
      hls += ellipse(cx - r * 0.35, cy - r * 0.3, r * 0.18, r * 0.12, -30);
    }
  }
  return nz([...cols.map((c, i) => sh(by[i], c, { stroke: shade(c, -0.35), strokeWidth: 0.8 })), sh(hls, '#ffffff', { opacity: 0.35 })]);
}

/** Oak barrel; origin bottom-centre. */
export function barrel(w: number, h: number, col = '#9a6a3e'): Shape[] {
  const body = M(-w * 0.44, -h) + Q(-w * 0.58, -h / 2, -w * 0.44, 0) + L(w * 0.44, 0) + Q(w * 0.58, -h / 2, w * 0.44, -h) + 'Z';
  let staves = '';
  for (let i = 1; i < 6; i++) { const t = i / 6 - 0.5; staves += M(t * w * 0.88, -h) + Q(t * w * 1.16, -h / 2, t * w * 0.88, 0); }
  const hoop = (y: number, k: number) => M(-w * (0.44 + k), y - 4) + Q(0, y + 4, w * (0.44 + k), y - 4) + L(w * (0.44 + k), y + 3) + Q(0, y + 11, -w * (0.44 + k), y + 3) + 'Z';
  return [ol(body, col, 1.2), sh(M(w * 0.15, -h) + Q(w * 0.3, -h / 2, w * 0.15, 0) + L(w * 0.44, 0) + Q(w * 0.58, -h / 2, w * 0.44, -h) + 'Z', shade(col, -0.12)), stroke(staves, shade(col, -0.3), 1), sh(hoop(-h * 0.86, 0.02) + hoop(-h * 0.16, 0.02), '#4a4440'), ol(ellipse(0, -h, w * 0.44, w * 0.1), shade(col, 0.1), 1)];
}

/** Stoneware cider jug; origin bottom-centre. */
export function jug(s: number, top = '#8a5a34', base = '#efe2c4'): Shape[] {
  return [
    stroke(M(0.1 * s, -0.86 * s) + Q(0.42 * s, -0.86 * s, 0.32 * s, -0.56 * s), top, 0.07 * s),
    ol(blob([[-0.1 * s, -0.95 * s], [0.1 * s, -0.95 * s], [0.12 * s, -0.78 * s], [0.36 * s, -0.55 * s], [0.38 * s, -0.12 * s], [0.26 * s, 0], [-0.26 * s, 0], [-0.38 * s, -0.12 * s], [-0.36 * s, -0.55 * s], [-0.12 * s, -0.78 * s]], 0.7), base, 1),
    sh(blob([[-0.1 * s, -0.95 * s], [0.1 * s, -0.95 * s], [0.12 * s, -0.78 * s], [0.32 * s, -0.62 * s], [0.36 * s, -0.5 * s], [-0.36 * s, -0.5 * s], [-0.32 * s, -0.62 * s], [-0.12 * s, -0.78 * s]], 0.7), top),
    sh(rect(-0.12 * s, -1.0 * s, 0.24 * s, 0.07 * s, 0.02 * s), shade(top, -0.2)),
    sh(rect(-0.08 * s, -1.08 * s, 0.16 * s, 0.09 * s, 0.03 * s), '#c9a46a'),
    hl(ellipse(-0.2 * s, -0.3 * s, 0.05 * s, 0.14 * s), 0.35),
  ];
}

/** Scarecrow; origin at the foot of the pole, `s` tall. */
export function scarecrow(s: number): Shape[] {
  const straw = '#e8c55e', shirt = '#c8452f', jeans = '#5a74a0';
  let plaid = '', tufts = '';
  for (let i = 0; i < 6; i++) plaid += line([[-0.4 * s + i * 0.16 * s, -0.78 * s], [-0.4 * s + i * 0.16 * s, -0.4 * s]]);
  for (let i = 0; i < 3; i++) plaid += line([[-0.42 * s, -0.74 * s + i * 0.1 * s], [0.42 * s, -0.74 * s + i * 0.1 * s]]);
  for (const [x, y, r] of [[-0.46 * s, -0.7 * s, 180], [0.46 * s, -0.7 * s, 0], [-0.08 * s, -0.17 * s, 90], [0.08 * s, -0.17 * s, 90]] as [number, number, number][]) for (let k = -2; k <= 2; k++) tufts += leaf(x, y, 0.1 * s, 0.015 * s + 0.5, r + k * 18);
  return [
    sh(rect(-0.025 * s, -0.95 * s, 0.05 * s, 0.95 * s), '#7a5232'),
    sh(tufts, straw),
    ol(rect(-0.16 * s, -0.44 * s, 0.32 * s, 0.28 * s, 0.03 * s), jeans, 1),
    stroke(line([[0, -0.4 * s], [0, -0.17 * s]]), shade(jeans, -0.25), 1.2),
    sh(rect(0.03 * s, -0.32 * s, 0.08 * s, 0.07 * s), '#e0a43a'),
    ol(M(-0.44 * s, -0.78 * s) + L(0.44 * s, -0.78 * s) + L(0.44 * s, -0.66 * s) + L(0.18 * s, -0.66 * s) + L(0.17 * s, -0.4 * s) + L(-0.17 * s, -0.4 * s) + L(-0.18 * s, -0.66 * s) + L(-0.44 * s, -0.66 * s) + 'Z', shirt, 1),
    stroke(plaid, shade(shirt, -0.3), 0.012 * s + 0.6, { opacity: 0.7 }),
    sh(rect(-0.18 * s, -0.47 * s, 0.36 * s, 0.04 * s), '#5a3a22'),
    ol(circle(0, -0.87 * s, 0.1 * s), '#dcc39a', 1),
    sh(circle(-0.04 * s, -0.89 * s, 0.014 * s) + circle(0.04 * s, -0.89 * s, 0.014 * s), '#3b2f2a'),
    stroke(curve([[-0.05 * s, -0.84 * s], [0, -0.82 * s], [0.05 * s, -0.84 * s]]), '#3b2f2a', 0.008 * s + 0.4),
    ol(ellipse(0, -0.95 * s, 0.2 * s, 0.035 * s), '#8a6a3a', 1),
    ol(M(-0.1 * s, -0.95 * s) + L(-0.08 * s, -1.08 * s) + Q(0, -1.12 * s, 0.08 * s, -1.08 * s) + L(0.1 * s, -0.95 * s) + 'Z', '#8a6a3a', 1),
    sh(rect(-0.1 * s, -0.99 * s, 0.2 * s, 0.03 * s), '#c8452f'),
  ];
}

/** Patchwork quilt hanging from a line; origin top-left. */
export function quilt(w: number, h: number, cols: string[], seed: number): Shape[] {
  const g = rng(seed);
  const bx = 4, by2 = 5, cw = (w - 12) / bx, chh = (h - 12) / by2;
  const byc = cols.map(() => '');
  for (let j = 0; j < by2; j++) for (let i = 0; i < bx; i++) {
    const x = 6 + i * cw, y = 6 + j * chh;
    const a = g.int(0, cols.length - 1), b = (a + g.int(1, cols.length - 1)) % cols.length;
    byc[a] += rect(x, y, cw, chh);
    if ((i + j) % 2) byc[b] += poly([[x, y], [x + cw, y], [x, y + chh]]);
    else byc[b] += rect(x + cw * 0.3, y + chh * 0.3, cw * 0.4, chh * 0.4);
  }
  let seams = '';
  for (let i = 1; i < bx; i++) seams += line([[6 + i * cw, 6], [6 + i * cw, h - 6]]);
  for (let j = 1; j < by2; j++) seams += line([[6, 6 + j * chh], [w - 6, 6 + j * chh]]);
  return nz([sh(rect(0, 0, w, h, 2), '#f3e6c8', { stroke: '#c9b48a', strokeWidth: 1 }), ...cols.map((c, i) => sh(byc[i], c)), stroke(seams, '#fbf3df', 1.2, { opacity: 0.7 }), sh(rect(w * 0.15, -6, 7, 14, 2) + rect(w * 0.8, -6, 7, 14, 2), '#c9a46a')]);
}

/** Small ferris wheel; origin at the hub. */
export function ferrisWheel(r: number, cabins: string[], frame = '#f3efe6'): Shape[] {
  let spokes = '', lights = '';
  for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6; spokes += line([[0, 0], [Math.cos(a) * r, Math.sin(a) * r]]); }
  for (let i = 0; i < 36; i++) { const a = (i * Math.PI) / 18; lights += circle(Math.cos(a) * r, Math.sin(a) * r, r * 0.022); }
  const out: Shape[] = [
    stroke(line([[0, 0], [-0.62 * r, r * 1.28]]) + line([[0, 0], [0.62 * r, r * 1.28]]) + line([[-0.38 * r, r * 0.78], [0.38 * r, r * 0.78]]), shade(frame, -0.25), r * 0.05),
    stroke(spokes, frame, r * 0.015 + 0.5), stroke(circle(0, 0, r) + circle(0, 0, r * 0.86), frame, r * 0.03), sh(lights, '#f7d774'),
  ];
  const byc = cabins.map(() => '');
  let rods = '';
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4 + 0.2, x = Math.cos(a) * r, y = Math.sin(a) * r;
    rods += line([[x, y], [x, y + r * 0.09]]);
    byc[i % cabins.length] += M(x - r * 0.12, y + r * 0.09) + L(x + r * 0.12, y + r * 0.09) + L(x + r * 0.1, y + r * 0.24) + Q(x, y + r * 0.27, x - r * 0.1, y + r * 0.24) + 'Z';
  }
  out.push(stroke(rods, '#6b5a48', r * 0.02 + 0.4), ...cabins.map((c, i) => sh(byc[i], c, { stroke: shade(c, -0.3), strokeWidth: 1 })), ol(circle(0, 0, r * 0.08), '#c8452f', 1));
  return out;
}

/** Corn stalk with leaves; origin at the base. */
export function cornStalk(h: number, seed: number, col = '#c9b66a'): Shape[] {
  const g = rng(seed);
  let lv = '', lv2 = '';
  for (let i = 0; i < 7; i++) { const y = -h * (0.2 + i * 0.11), side = i % 2 ? 1 : -1; (i % 2 ? (lv += leaf(0, y, h * g.range(0.3, 0.42), h * 0.035, side > 0 ? -30 + g.range(-10, 20) : -150 - g.range(-10, 20))) : (lv2 += leaf(0, y, h * g.range(0.3, 0.42), h * 0.035, side > 0 ? -30 + g.range(-10, 20) : -150 - g.range(-10, 20)))); }
  return [stroke(curve([[0, 0], [h * 0.02, -h * 0.5], [-h * 0.01, -h]]), shade(col, -0.15), h * 0.025), sh(lv, col), sh(lv2, shade(col, -0.12)), sh(leaf(0, -h, h * 0.12, h * 0.02, -80) + leaf(0, -h, h * 0.1, h * 0.02, -110), '#b89a4a')];
}

/** Corn cob with husks peeled back; origin at the stalk end, pointing up. */
export function cornCob(s: number): Shape[] {
  let k = '';
  for (let j = 0; j < 7; j++) for (let i = -1; i <= 1; i++) k += circle(i * 0.08 * s, -0.24 * s - j * 0.085 * s, 0.04 * s);
  return [
    sh(leaf(0, -0.05 * s, 0.6 * s, 0.12 * s, -125) + leaf(0, -0.05 * s, 0.6 * s, 0.12 * s, -55), '#c9c27a'),
    ol(ellipse(0, -0.5 * s, 0.14 * s, 0.38 * s), '#f2c440', 1, -0.3),
    sh(k, '#f7d86a'),
    sh(leaf(0, -0.02 * s, 0.5 * s, 0.1 * s, -100), '#a9b06a'),
    sh(rect(-0.04 * s, -0.08 * s, 0.08 * s, 0.1 * s), '#8a8a4a'),
  ];
}

/** Lattice-topped pie in a tin; origin bottom-centre. */
export function pie(s: number, fill = '#b8302a'): Shape[] {
  let lat = '';
  for (let i = -2; i <= 2; i++) { lat += line([[i * 0.1 * s - 0.08 * s, -0.33 * s], [i * 0.1 * s + 0.08 * s, -0.09 * s]]); lat += line([[i * 0.1 * s + 0.08 * s, -0.33 * s], [i * 0.1 * s - 0.08 * s, -0.09 * s]]); }
  let crimp = '';
  for (let i = 0; i < 18; i++) { const a = (i * Math.PI * 2) / 18; crimp += circle(Math.cos(a) * 0.43 * s, -0.21 * s + Math.sin(a) * 0.15 * s, 0.045 * s); }
  return [
    ol(M(-0.5 * s, -0.2 * s) + L(0.5 * s, -0.2 * s) + L(0.42 * s, 0) + L(-0.42 * s, 0) + 'Z', '#b9c0c4', 1),
    sh(ellipse(0, -0.21 * s, 0.44 * s, 0.15 * s), fill),
    stroke(lat, '#e2a95a', 0.05 * s),
    sh(crimp, '#e8b064', { stroke: '#c48a40', strokeWidth: 0.6 }),
  ];
}

/** Jar of honey with a gingham lid; origin bottom-centre. */
export function honeyJar(s: number, cloth = '#d8452f'): Shape[] {
  let check = '';
  for (let i = 0; i < 4; i++) check += rect(-0.3 * s + i * 0.15 * s, -1.02 * s, 0.07 * s, 0.22 * s);
  return [
    ol(rect(-0.3 * s, -0.82 * s, 0.6 * s, 0.82 * s, 0.1 * s), '#e5a12a', 1),
    sh(rect(-0.3 * s, -0.82 * s, 0.6 * s, 0.22 * s, 0.06 * s), '#f3c35a', { opacity: 0.5 }),
    ol(rect(-0.2 * s, -0.56 * s, 0.4 * s, 0.3 * s, 0.04 * s), '#fbf3df', 1),
    sh(star(0, -0.41 * s, 0.09 * s, 0.08 * s, 6), '#e5a12a'),
    hl(rect(-0.24 * s, -0.7 * s, 0.05 * s, 0.6 * s, 0.025 * s), 0.35),
    sh(M(-0.36 * s, -0.8 * s) + L(-0.3 * s, -1.0 * s) + L(0.3 * s, -1.0 * s) + L(0.36 * s, -0.8 * s) + Q(0.2 * s, -0.86 * s, 0, -0.78 * s) + Q(-0.2 * s, -0.86 * s, -0.36 * s, -0.8 * s) + 'Z', '#fbf3df', { stroke: shade(cloth, -0.2), strokeWidth: 1 }),
    sh(check, cloth, { opacity: 0.75 }),
    stroke(line([[-0.31 * s, -0.86 * s], [0.31 * s, -0.86 * s]]), '#8a6a3a', 0.03 * s),
  ];
}

/** Hanging lantern; origin at the top of its hook ring. */
export function lantern(s: number, metal = '#3f4a44'): Shape[] {
  return [
    stroke(circle(0, 0.05 * s, 0.06 * s), metal, 0.025 * s),
    ol(poly([[-0.16 * s, 0.22 * s], [0.16 * s, 0.22 * s], [0.08 * s, 0.1 * s], [-0.08 * s, 0.1 * s]]), metal, 1),
    sh(rect(-0.16 * s, 0.22 * s, 0.32 * s, 0.42 * s, 0.03 * s), '#f7d06a'),
    sh(ellipse(0, 0.46 * s, 0.07 * s, 0.11 * s), '#fff3c0'),
    stroke(rect(-0.16 * s, 0.22 * s, 0.32 * s, 0.42 * s, 0.03 * s) + line([[0, 0.22 * s], [0, 0.64 * s]]), metal, 0.03 * s),
    ol(rect(-0.2 * s, 0.62 * s, 0.4 * s, 0.07 * s, 0.02 * s), metal, 1),
  ];
}

/** Crow perched, facing left; origin at the feet. */
export function crow(s: number): Shape[] {
  const c = '#2d2a30';
  return [
    sh(poly([[0.3 * s, -0.48 * s], [0.75 * s, -0.4 * s], [0.72 * s, -0.3 * s], [0.3 * s, -0.34 * s]]), shade(c, 0.1)),
    stroke(line([[-0.04 * s, -0.18 * s], [-0.06 * s, 0]]) + line([[0.1 * s, -0.18 * s], [0.1 * s, 0]]), '#4a4a4a', 0.03 * s),
    sh(ellipse(0.04 * s, -0.42 * s, 0.38 * s, 0.25 * s, -6), c),
    sh(ellipse(0.12 * s, -0.44 * s, 0.26 * s, 0.14 * s, -10), '#4a4856'),
    sh(circle(-0.28 * s, -0.62 * s, 0.17 * s), c),
    sh(poly([[-0.4 * s, -0.66 * s], [-0.66 * s, -0.6 * s], [-0.42 * s, -0.56 * s]]), '#6b6670'),
    sh(circle(-0.32 * s, -0.66 * s, 0.035 * s), '#f2d24a'), sh(circle(-0.32 * s, -0.66 * s, 0.015 * s), '#1e1a18'),
  ];
}

/** Red squirrel sitting up, facing left, holding a nut; origin at the feet. */
export function squirrel(s: number, col = '#c8662e'): Shape[] {
  const dk = shade(col, -0.2);
  return [
    ol(blob([[0.1 * s, -0.1 * s], [0.42 * s, -0.2 * s], [0.55 * s, -0.55 * s], [0.5 * s, -0.95 * s], [0.3 * s, -1.05 * s], [0.18 * s, -0.88 * s], [0.34 * s, -0.7 * s], [0.3 * s, -0.4 * s], [0.12 * s, -0.3 * s]], 0.9), shade(col, 0.08), 1, -0.25),
    stroke(curve([[0.22 * s, -0.3 * s], [0.42 * s, -0.55 * s], [0.4 * s, -0.86 * s]]), dk, 0.02 * s, { opacity: 0.5 }),
    ol(blob([[-0.12 * s, -0.04 * s], [0.18 * s, -0.04 * s], [0.22 * s, -0.3 * s], [0.12 * s, -0.56 * s], [-0.08 * s, -0.58 * s], [-0.18 * s, -0.3 * s]], 0.9), col, 1),
    sh(ellipse(-0.06 * s, -0.3 * s, 0.08 * s, 0.18 * s), '#f3dcb8'),
    ol(circle(-0.12 * s, -0.66 * s, 0.14 * s), col, 1),
    sh(poly([[-0.06 * s, -0.76 * s], [-0.02 * s, -0.92 * s], [0.04 * s, -0.74 * s]]), dk),
    sh(circle(-0.17 * s, -0.68 * s, 0.025 * s), '#1e1a18'),
    sh(circle(-0.26 * s, -0.63 * s, 0.022 * s), '#3b2f2a'),
    ol(ellipse(-0.2 * s, -0.42 * s, 0.07 * s, 0.06 * s), '#a8743e', 1),
    sh(ellipse(-0.2 * s, -0.47 * s, 0.075 * s, 0.03 * s), '#6b4a2a'),
    sh(ellipse(-0.08 * s, -0.42 * s, 0.07 * s, 0.035 * s, 20), dk),
    sh(ellipse(-0.04 * s, -0.02 * s, 0.12 * s, 0.04 * s), dk),
  ];
}

/** Leaf rake; origin at the head, handle going up-right. */
export function rake(l: number): Shape[] {
  let tines = '';
  for (let i = 0; i < 9; i++) { const x = -0.16 * l + i * 0.04 * l; tines += line([[x, 0], [x * 1.1, 0.12 * l]]); }
  return [stroke(line([[0, 0], [0, -0.85 * l]]), '#c99a62', 0.03 * l), stroke(tines, '#7d858a', 0.012 * l + 0.4), stroke(line([[-0.17 * l, 0], [0.17 * l, 0]]), '#5a6268', 0.025 * l)];
}

/** Knitted scarf draped over a rail; origin at the top of the fold. */
export function scarf(s: number, a: string, b: string): Shape[] {
  let stripes = '', fringe = '';
  for (const [x0, len] of [[-0.24 * s, 0.9 * s], [0.02 * s, 0.7 * s]] as [number, number][]) {
    for (let k = 1; k < 5; k++) stripes += rect(x0, (len * k) / 5 - 0.04 * s, 0.22 * s, 0.07 * s);
    for (let k = 0; k < 5; k++) fringe += line([[x0 + 0.02 * s + k * 0.045 * s, len], [x0 + 0.02 * s + k * 0.045 * s, len + 0.1 * s]]);
  }
  return [
    stroke(fringe, a, 0.02 * s + 0.4),
    ol(rect(-0.24 * s, 0, 0.22 * s, 0.9 * s, 0.02 * s) + rect(0.02 * s, 0, 0.22 * s, 0.7 * s, 0.02 * s), a, 1),
    sh(stripes, b),
    ol(M(-0.26 * s, 0.05 * s) + Q(0, -0.12 * s, 0.26 * s, 0.05 * s) + L(0.26 * s, 0.14 * s) + Q(0, -0.02 * s, -0.26 * s, 0.14 * s) + 'Z', shade(a, -0.08), 1),
  ];
}

/** Acorn; origin at the centre. */
export function acorn(s: number): Shape[] {
  let tex = '';
  for (let i = 0; i < 4; i++) tex += line([[-0.3 * s + i * 0.17 * s, -0.12 * s], [-0.22 * s + i * 0.17 * s, -0.24 * s]]);
  return [ol(blob([[-0.24 * s, -0.1 * s], [0.24 * s, -0.1 * s], [0.22 * s, 0.2 * s], [0, 0.46 * s], [-0.22 * s, 0.2 * s]], 0.9), '#c9923e', 1), hl(ellipse(-0.1 * s, 0.08 * s, 0.04 * s, 0.12 * s), 0.35), ol(M(-0.32 * s, -0.08 * s) + Q(-0.3 * s, -0.36 * s, 0, -0.36 * s) + Q(0.3 * s, -0.36 * s, 0.32 * s, -0.08 * s) + Q(0, 0, -0.32 * s, -0.08 * s) + 'Z', '#7a5232', 1), stroke(tex, '#5a3a22', 1), stroke(line([[0, -0.34 * s], [0.06 * s, -0.48 * s]]), '#5a3a22', 0.06 * s)];
}

/** Sunflower on its stem; origin at the bottom of the stem, `s` = head width. */
export function sunflower(s: number, stem: number): Shape[] {
  let p1 = '', p2 = '', seeds = '';
  for (let k = 0; k < 14; k++) { p1 += petal(0, -stem, 0.48 * s, 0.11 * s, k * (360 / 14)); p2 += petal(0, -stem, 0.42 * s, 0.1 * s, k * (360 / 14) + 360 / 28); }
  for (let i = 0; i < 10; i++) { const a = i * 2.4, r = Math.sqrt(i / 10) * 0.16 * s; seeds += circle(Math.cos(a) * r, -stem + Math.sin(a) * r, 0.025 * s); }
  return [stroke(line([[0, 0], [0, -stem]]), '#5f8a45', 0.06 * s), sh(leaf(0, -stem * 0.4, 0.45 * s, 0.14 * s, -30) + leaf(0, -stem * 0.55, 0.42 * s, 0.13 * s, -150), '#6f9a4e'), sh(p2, '#e8a826'), sh(p1, '#f6c93a'), ol(circle(0, -stem, 0.2 * s), '#6b4a2a', 1), sh(seeds, '#3b2a1c')];
}

/** Pear; origin bottom-centre. */
export function pear(s: number, col = '#c9c24a'): Shape[] {
  return [ol(blob([[0, -0.92 * s], [0.12 * s, -0.84 * s], [0.16 * s, -0.56 * s], [0.34 * s, -0.3 * s], [0.28 * s, -0.04 * s], [0, 0], [-0.28 * s, -0.04 * s], [-0.34 * s, -0.3 * s], [-0.16 * s, -0.56 * s], [-0.12 * s, -0.84 * s]], 0.85), col, 1), sh(ellipse(0.12 * s, -0.24 * s, 0.12 * s, 0.14 * s), '#d8a040', { opacity: 0.45 }), hl(ellipse(-0.14 * s, -0.36 * s, 0.05 * s, 0.12 * s), 0.35), stroke(line([[0, -0.9 * s], [0.05 * s, -1.06 * s]]), '#5a3a22', 0.05 * s), sh(leaf(0.04 * s, -0.98 * s, 0.32 * s, 0.1 * s, -15), '#6f9a3a')];
}

/** Prize rosette; origin at the centre of the rosette. */
export function rosette(s: number, col = '#3e64b0', centre = '#f2c440'): Shape[] {
  const tail = (x: number, rot: number) => xf(poly([[-0.1 * s, 0], [0.1 * s, 0], [0.12 * s, 0.6 * s], [0, 0.5 * s], [-0.12 * s, 0.6 * s]]), { rot, x });
  return [sh(tail(-0.08 * s, 14) + tail(0.08 * s, -14), shade(col, -0.1), { stroke: shade(col, -0.4), strokeWidth: 1 }), ol(star(0, 0, 0.36 * s, 0.29 * s, 16), col, 1, -0.35), sh(star(0, 0, 0.27 * s, 0.22 * s, 16), shade(col, 0.25)), ol(circle(0, 0, 0.16 * s), centre, 1), sh(star(0, 0, 0.08 * s, 0.035 * s), '#fbf3df')];
}

/** Toffee apple on a stick; origin at the bottom of the apple. */
export function toffeeApple(s: number): Shape[] {
  return [
    stroke(line([[0, -0.6 * s], [0.04 * s, -1.25 * s]]), '#e8d2a2', 0.06 * s),
    ol(blob([[0, -0.82 * s], [0.34 * s, -0.86 * s], [0.46 * s, -0.4 * s], [0.3 * s, -0.06 * s], [0, -0.08 * s], [-0.3 * s, -0.06 * s], [-0.46 * s, -0.4 * s], [-0.34 * s, -0.86 * s]], 0.9), '#a8281e', 1),
    sh(M(-0.44 * s, -0.36 * s) + Q(-0.42 * s, -0.04 * s, 0, -0.06 * s) + Q(0.42 * s, -0.04 * s, 0.44 * s, -0.36 * s) + Q(0.3 * s, -0.28 * s, 0.24 * s, -0.36 * s) + Q(0.14 * s, -0.22 * s, 0.04 * s, -0.32 * s) + Q(-0.1 * s, -0.22 * s, -0.2 * s, -0.34 * s) + Q(-0.32 * s, -0.26 * s, -0.44 * s, -0.36 * s) + 'Z', '#c8782a'),
    hl(ellipse(-0.2 * s, -0.6 * s, 0.07 * s, 0.13 * s, 20), 0.5),
    ol(ellipse(0, 0, 0.36 * s, 0.06 * s), '#c8782a', 1),
  ];
}

/** Maple leaf; origin at the centre. */
export function mapleLeaf(s: number, col: string): Shape[] {
  const half: Pt[] = [[0, -1], [0.14, -0.6], [0.4, -0.72], [0.34, -0.36], [0.76, -0.4], [0.58, -0.12], [0.7, 0.02], [0.3, 0.12], [0.32, 0.32], [0.04, 0.22]];
  const pts: Pt[] = [...half, ...half.slice(1).reverse().map(([x, y]) => [-x, y] as Pt)].map(([x, y]) => [x * s * 0.5, y * s * 0.5] as Pt);
  return [sh(poly(pts), col), stroke(line([[0, 0.11 * s], [0, 0.32 * s]]) + line([[0, 0.1 * s], [0, -0.4 * s]]) + line([[0, 0.05 * s], [0.3 * s, -0.16 * s]]) + line([[0, 0.05 * s], [-0.3 * s, -0.16 * s]]), shade(col, -0.3), 0.03 * s + 0.3)];
}

/** Hanging light bulb string; returns a cord and bulbs between two points. */
export function festoon(x0: number, y0: number, x1: number, y1: number, sag: number, count: number, bulb = '#fbe7a1'): Shape[] {
  const p = (t: number): Pt => [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t + sag * 4 * t * (1 - t)];
  const pts: Pt[] = [];
  for (let i = 0; i <= 16; i++) pts.push(p(i / 16));
  let b = '', glow = '';
  for (let i = 0; i < count; i++) { const [x, y] = p((i + 0.5) / count); b += ellipse(x, y + 7, 4, 6); glow += circle(x, y + 7, 11); }
  return [stroke(curve(pts), '#3b3633', 1.4), sh(glow, bulb, { opacity: 0.25 }), sh(b, bulb, { stroke: '#c9a24a', strokeWidth: 0.8 })];
}

/** Small round blossom flowers scattered on a path (fallen petals etc). */
export function petals(x0: number, y0: number, w: number, h: number, count: number, seed: number, cols: string[], size = 4): Shape[] {
  const g = rng(seed);
  const by = cols.map(() => '');
  for (let i = 0; i < count; i++) by[g.int(0, cols.length - 1)] += ellipse(x0 + g.range(0, w), y0 + g.range(0, h), size * g.range(0.7, 1.2), size * 0.6 * g.range(0.7, 1.2), g.range(0, 180));
  return nz(cols.map((c, i) => sh(by[i], c)));
}

export { mix };
