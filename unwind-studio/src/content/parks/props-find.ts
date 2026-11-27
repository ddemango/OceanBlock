// Shared props for "The Great Outdoors" hidden-object scenes.
// Every prop is drawn around the origin and sized by its first argument, then place()d.
import { rect, ellipse, circle, poly, line, curve, blob, leaf, petal, star, sector, sh, stroke, place, shade, mix, rng, xf } from '../../art/kit';
import type { Shape } from '../../art/types';

export type Pt = [number, number];
const n = (v: number) => String(Math.round(v * 10) / 10);
export const M = (x: number, y: number) => `M${n(x)} ${n(y)}`;
export const L = (x: number, y: number) => `L${n(x)} ${n(y)}`;
export const Q = (cx: number, cy: number, x: number, y: number) => `Q${n(cx)} ${n(cy)} ${n(x)} ${n(y)}`;

/** Filled shape with a darker outline of the same hue. */
export const ol = (d: string, fill: string, w = 1, amt = -0.35): Shape => sh(d, fill, { stroke: shade(fill, amt), strokeWidth: w });
export const shadow = (cx: number, cy: number, rx: number, ry: number, o = 0.22): Shape => sh(ellipse(cx, cy, rx, ry), '#1f160e', { opacity: o });
const hi = (d: string, o = 0.3): Shape => sh(d, '#ffffff', { opacity: o });
const INK = '#2a2420';
const BRASS = '#d9b45a';

// =====================================================================
// scenery
// =====================================================================
/** Layered conifer with drooping, ragged boughs; origin at the base of the trunk. */
export function pine(h: number, col: string, seed = 1, trunk = '#5a3c26'): Shape[] {
  const g = rng(seed), w = h * 0.4;
  const out: Shape[] = [sh(poly([[-h * 0.024, 0], [h * 0.024, 0], [h * 0.012, -h * 0.5], [-h * 0.012, -h * 0.5]]), trunk)];
  const tiers = 7;
  for (let i = 0; i < tiers; i++) {
    const t = i / tiers, y0 = -h * (0.12 + t * 0.76), tw = w * (1 - t * 0.82), th = h * 0.27 * (1 - t * 0.3), k = 6;
    const edge: Pt[] = [];
    for (let j = 0; j <= k; j++) {
      const x = tw / 2 - (tw * j) / k;
      edge.push([x + g.range(-1, 1) * tw * 0.025, y0 + (j % 2 ? -th * 0.17 : g.range(0, th * 0.05)) + (Math.abs(x) / (tw / 2)) * th * 0.1]);
    }
    out.push(sh(poly([[0, y0 - th], ...edge]), shade(col, t * 0.12 - 0.02)));
    out.push(sh(poly([[0, y0 - th], ...edge.filter((p) => p[0] >= -1), [0, y0 - th * 0.12]]), shade(col, -0.2 + t * 0.08)));
  }
  return out;
}
/** Mountain range from a ridge line (left to right) down to `base`, with shaded faces and snow on summits higher than `snowAbove`. */
export function peaks(ridge: Pt[], base: number, col: string, snow: string, snowAbove: number, t = 0.42): Shape[] {
  const out: Shape[] = [sh(poly([[ridge[0][0], base], ...ridge, [ridge[ridge.length - 1][0], base]]), col)];
  let caps = '', capShade = '', shd = '';
  for (let i = 1; i < ridge.length - 1; i++) {
    const p = ridge[i], a = ridge[i - 1], b = ridge[i + 1];
    if (!(p[1] < a[1] && p[1] < b[1])) continue;
    shd += poly([p, b, [b[0], base], [p[0] + (b[0] - p[0]) * 0.2, base]]);
    if (p[1] > snowAbove) continue;
    const l: Pt = [p[0] + (a[0] - p[0]) * t, p[1] + (a[1] - p[1]) * t], r: Pt = [p[0] + (b[0] - p[0]) * t, p[1] + (b[1] - p[1]) * t];
    const d = Math.min(a[1], b[1]) - p[1];
    const m = (k: number, dy: number): Pt => [l[0] + (r[0] - l[0]) * k, l[1] + (r[1] - l[1]) * k + dy * d];
    caps += poly([p, r, m(0.8, -0.14), m(0.64, 0.1), m(0.46, -0.12), m(0.27, 0.08), m(0.12, -0.1), l]);
    capShade += poly([p, r, m(0.8, -0.14), m(0.64, 0.1), m(0.5, -0.1)]);
  }
  out.push(sh(shd, shade(col, -0.3), { opacity: 0.4 }), sh(caps, snow), sh(capShade, shade(col, 0.45), { opacity: 0.7 }));
  return out;
}
/** Cloud puff. */
export function cloud(w: number, col = '#ffffff', o = 0.9): Shape[] {
  return [
    sh(blob([[-w / 2, 0], [-w * 0.38, -w * 0.12], [-w * 0.18, -w * 0.16], [-w * 0.02, -w * 0.28], [w * 0.2, -w * 0.2], [w * 0.36, -w * 0.1], [w / 2, 0], [w * 0.1, w * 0.03]], 0.9), col, { opacity: o }),
    sh(blob([[-w * 0.3, 0], [-w * 0.1, -w * 0.06], [w * 0.2, -w * 0.04], [w * 0.4, 0], [w * 0.1, w * 0.03]], 0.9), shade(col, -0.08), { opacity: o * 0.6 }),
  ];
}
/** Angular boulder; origin at bottom centre. */
export function rock(w: number, col: string, seed = 1): Shape[] {
  const g = rng(seed), h = w * g.range(0.5, 0.7);
  const a: Pt = [-w / 2, 0], b: Pt = [-w * g.range(0.36, 0.44), -h * g.range(0.5, 0.7)], c: Pt = [-w * g.range(0.05, 0.2), -h], d: Pt = [w * g.range(0.15, 0.3), -h * g.range(0.8, 0.95)], e: Pt = [w * 0.46, -h * g.range(0.3, 0.5)], f: Pt = [w / 2, 0];
  return [
    ol(poly([a, b, c, d, e, f]), col, 1, -0.3), sh(poly([c, d, e, f, [w * 0.08, 0], [w * 0.02, -h * 0.5]]), shade(col, -0.16)),
    sh(poly([b, c, [w * 0.02, -h * 0.5], [-w * 0.2, -h * 0.4]]), shade(col, 0.18)),
  ];
}
/** A tuft of grass blades at (x,y). */
export function tuft(x: number, y: number, s: number, col: string): Shape {
  return sh(leaf(x, y, 15 * s, 2.6 * s, -96) + leaf(x, y, 12 * s, 2.4 * s, -66) + leaf(x, y, 12 * s, 2.4 * s, -128) + leaf(x, y, 8 * s, 2 * s, -40) + leaf(x, y, 8 * s, 2 * s, -150), col);
}
/** Small five-petal flower. */
export function flower(x: number, y: number, r: number, col: string, centre = '#f2c14e'): Shape[] {
  let d = '';
  for (let i = 0; i < 5; i++) d += petal(x, y, r, r * 0.42, i * 72 - 90);
  return [sh(d, col), sh(circle(x, y, r * 0.32), centre)];
}
/** Horizontal log wall filling a rectangle. */
export function logWall(x0: number, y0: number, x1: number, y1: number, lh: number, col: string, seed = 1): Shape[] {
  const g = rng(seed), out: Shape[] = [sh(rect(x0, y0, x1 - x0, y1 - y0), shade(col, -0.42))];
  let grain = '', knots = '', i = 0;
  for (let y = y0; y < y1 - 2; y += lh, i++) {
    const hh = Math.min(lh, y1 - y);
    out.push(sh(rect(x0, y + 1, x1 - x0, hh - 2, Math.min(hh * 0.4, 9)), i % 2 ? col : shade(col, 0.08)));
    out.push(hi(rect(x0, y + 2.5, x1 - x0, hh * 0.2, 3), 0.13), sh(rect(x0, y + hh * 0.66, x1 - x0, hh * 0.27, 3), '#000000', { opacity: 0.12 }));
    for (let k = 0; k < (x1 - x0) / 130; k++) {
      const x = g.range(x0 + 8, x1 - 70), w = g.range(26, 80), yy = y + g.range(hh * 0.32, hh * 0.62);
      grain += curve([[x, yy], [x + w / 2, yy + g.range(-2, 2)], [x + w, yy]]);
      if (g.next() < 0.22) knots += ellipse(x + w + 12, yy, 5, 3);
    }
  }
  out.push(stroke(grain, shade(col, -0.32), 1.1, { opacity: 0.7 }), sh(knots, shade(col, -0.3), { opacity: 0.7 }));
  return out;
}
/** Column of sawn log ends (a cabin corner). */
export function logEnds(x: number, y0: number, y1: number, lh: number, col: string): Shape[] {
  const out: Shape[] = [];
  for (let y = y0, i = 0; y < y1 - 2; y += lh, i++) {
    const r = lh * 0.52, cx = x + (i % 2 ? 5 : -5), cy = y + lh / 2;
    out.push(ol(circle(cx, cy, r), shade(col, -0.05), 1, -0.4), sh(circle(cx, cy, r * 0.68), mix(col, '#e8c890', 0.55)), stroke(circle(cx, cy, r * 0.36), shade(col, -0.1), 1));
  }
  return out;
}
/** Stack of firewood seen end-on, `cols` wide and `rows` high; origin at bottom-left. */
export function woodStack(cols: number, rows: number, r: number, seed = 1): Shape[] {
  const g = rng(seed), out: Shape[] = [];
  for (let row = 0; row < rows; row++) for (let i = 0; i < cols - (row % 2); i++) {
    const x = r + i * r * 2 + (row % 2) * r + g.range(-1.5, 1.5), y = -r - row * r * 1.74, bark = g.pick(['#8a5c38', '#7a5030', '#96683e']);
    out.push(ol(circle(x, y, r), bark, 1, -0.4), sh(circle(x, y, r * 0.74), g.pick(['#e2bc84', '#d9b07a', '#ecc890'])), stroke(circle(x, y, r * 0.42), '#b8894f', 1));
    if (g.next() < 0.5) out.push(stroke(line([[x, y], [x + g.range(-1, 1) * r * 0.7, y + g.range(-1, 1) * r * 0.7]]), '#a87840', 1));
  }
  return out;
}

// =====================================================================
// desert plants
// =====================================================================
/** Cactus blossom, flat-on. */
export function cactusFlower(s: number, col = '#e8558f'): Shape[] {
  let a = '', b = '';
  for (let i = 0; i < 8; i++) { a += petal(0, 0, s * 0.5, s * 0.17, i * 45); b += petal(0, 0, s * 0.36, s * 0.13, i * 45 + 22); }
  return [ol(a, col, 0.8, -0.25), sh(b, shade(col, 0.28)), sh(circle(0, 0, s * 0.13), '#f6d24a'), sh(circle(0, 0, s * 0.06), '#d99a2a')];
}
/** Prickly pear clump; origin at the base. */
export function pricklyPear(s: number, seed = 1, col = '#6f9a5c'): Shape[] {
  const g = rng(seed), out: Shape[] = [shadow(0, 0, s * 0.5, s * 0.06)];
  const pad = (x: number, y: number, r: number, rot: number, fruit: boolean) => {
    const c = shade(col, g.range(-0.08, 0.1));
    out.push(ol(ellipse(x, y, r * 0.72, r, rot), c, 1.1, -0.3), hi(ellipse(x - r * 0.2, y - r * 0.2, r * 0.2, r * 0.5, rot), 0.14));
    let sp = '';
    for (let i = 0; i < 7; i++) { const a = g.range(0, 6.28), d = g.range(0.1, 0.72); sp += circle(x + Math.cos(a) * r * 0.6 * d, y + Math.sin(a) * r * 0.86 * d, 1.3); }
    out.push(sh(sp, '#f4eccc'));
    if (fruit) { const a = ((rot - 90) * Math.PI) / 180; out.push(ol(ellipse(x + Math.cos(a) * r * 0.98 + g.range(-6, 6), y + Math.sin(a) * r * 0.98, r * 0.16, r * 0.24, rot), '#c8386a', 0.8)); }
  };
  pad(0, -s * 0.24, s * 0.26, 0, false);
  pad(-s * 0.26, -s * 0.5, s * 0.2, -38, true);
  pad(s * 0.24, -s * 0.52, s * 0.21, 30, true);
  pad(s * 0.02, -s * 0.72, s * 0.19, -6, false);
  pad(-s * 0.4, -s * 0.78, s * 0.14, -50, true);
  pad(s * 0.4, -s * 0.84, s * 0.15, 40, false);
  return out;
}
/** Round barrel cactus with a crown of yellow flowers; origin at the base. */
export function barrelCactus(s: number, col = '#5f8a54'): Shape[] {
  const out: Shape[] = [shadow(0, 0, s * 0.56, s * 0.07), ol(ellipse(0, -s * 0.44, s * 0.5, s * 0.46), col, 1.2, -0.35)];
  let ribs = '', sp = '';
  for (const k of [0.84, 0.58, 0.3, 0.02]) ribs += ellipse(0, -s * 0.44, s * 0.5 * k, s * 0.45);
  out.push(stroke(ribs, shade(col, -0.25), 1.4), hi(ellipse(-s * 0.2, -s * 0.5, s * 0.07, s * 0.3), 0.14));
  for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) sp += star(-s * 0.36 + i * s * 0.18, -s * 0.72 + j * s * 0.14 + (i % 2) * s * 0.05, 3.2, 0.8, 4, 45);
  out.push(sh(sp, '#f4eccc'));
  for (const dx of [-0.16, 0.02, 0.18]) out.push(...place(cactusFlower(s * 0.2, '#f2c14e'), { x: s * dx, y: -s * 0.88, sy: 0.6 }));
  return out;
}
/** Spiky yucca with a tall flower stalk; origin at the base. */
export function yucca(s: number, seed = 1): Shape[] {
  const g = rng(seed), out: Shape[] = [shadow(0, 0, s * 0.4, s * 0.05)];
  out.push(stroke(curve([[0, -s * 0.3], [s * 0.02, -s * 0.8], [-s * 0.02, -s * 1.24]]), '#8a9a5a', 3));
  for (let i = 0; i < 12; i++) { const y = -s * (0.78 + i * 0.04), sd = i % 2 ? 1 : -1; out.push(ol(ellipse(-s * 0.01 + sd * s * 0.035 * (1 - i / 16), y, s * 0.032, s * 0.045, sd * 20), '#f6efd6', 0.6, -0.2)); }
  let a = '', b = '';
  for (let i = 0; i < 17; i++) { const ang = -172 + i * 10.2 + g.range(-3, 3), len = s * g.range(0.42, 0.58); const d = leaf(0, -s * 0.04, len, s * 0.035, ang); if (i % 2) a += d; else b += d; }
  out.push(sh(b, '#5f7f52'), sh(a, '#7a9a62'));
  return out;
}
/** Gnarled juniper; origin at the base of the trunk. */
export function juniper(h: number, seed = 1): Shape[] {
  const g = rng(seed), bark = '#7a5a48', out: Shape[] = [];
  out.push(ol(M(-h * 0.07, 0) + Q(-h * 0.02, -h * 0.2, -h * 0.1, -h * 0.4) + Q(-h * 0.16, -h * 0.56, -h * 0.3, -h * 0.66) + L(-h * 0.26, -h * 0.7) + Q(-h * 0.1, -h * 0.6, -h * 0.03, -h * 0.46) + Q(0, -h * 0.62, h * 0.14, -h * 0.76) + L(h * 0.18, -h * 0.72) + Q(h * 0.06, -h * 0.56, h * 0.04, -h * 0.36) + Q(h * 0.1, -h * 0.16, h * 0.09, 0) + 'Z', bark, 1.2));
  out.push(stroke(curve([[-h * 0.02, -h * 0.02], [h * 0.02, -h * 0.2], [-h * 0.04, -h * 0.4]]) + curve([[h * 0.04, -h * 0.04], [h * 0.05, -h * 0.26], [0, -h * 0.44]]), shade(bark, -0.3), 1.2));
  const clumps: [number, number, number][] = [[-0.3, -0.76, 0.2], [0.16, -0.86, 0.22], [-0.06, -0.92, 0.2], [0.34, -0.7, 0.15], [-0.44, -0.62, 0.13], [0.02, -0.72, 0.16]];
  for (const [cx, cy, r] of clumps) {
    const pts: Pt[] = [];
    for (let i = 0; i < 9; i++) { const a = (i / 9) * 6.283, rr = h * r * g.range(0.78, 1.1); pts.push([h * cx + Math.cos(a) * rr, h * cy + Math.sin(a) * rr * 0.7]); }
    const c = g.pick(['#4f6a4a', '#5a7652', '#466044']);
    out.push(sh(blob(pts, 0.9), c), sh(blob(pts.map(([x, y]) => [h * cx + (x - h * cx) * 0.6 - h * r * 0.2, h * cy + (y - h * cy) * 0.55 - h * r * 0.18] as Pt), 0.9), shade(c, 0.14)));
    let be = '';
    for (let i = 0; i < 4; i++) be += circle(h * cx + g.range(-1, 1) * h * r * 0.6, h * cy + g.range(-0.2, 0.5) * h * r, 2.2);
    out.push(sh(be, '#8fa6c4'));
  }
  return out;
}

// =====================================================================
// ranger & trail things
// =====================================================================
/** Flat-brimmed campaign hat; origin at brim centre. */
export function rangerHat(s: number, col = '#b08a5a'): Shape[] {
  return [
    ol(ellipse(0, 0, s / 2, s * 0.13), col, 1.2), hi(ellipse(-s * 0.1, -s * 0.03, s * 0.3, s * 0.04), 0.18),
    ol(M(-s * 0.25, -s * 0.03) + Q(-s * 0.26, -s * 0.32, -s * 0.11, -s * 0.44) + Q(0, -s * 0.5, s * 0.11, -s * 0.44) + Q(s * 0.26, -s * 0.32, s * 0.25, -s * 0.03) + Q(0, s * 0.06, -s * 0.25, -s * 0.03) + 'Z', shade(col, 0.06), 1.2),
    sh(leaf(-s * 0.09, -s * 0.44, s * 0.24, s * 0.05, 100) + leaf(s * 0.09, -s * 0.44, s * 0.24, s * 0.05, 80), shade(col, -0.2)),
    stroke(M(-s * 0.25, -s * 0.07) + Q(0, s * 0.02, s * 0.25, -s * 0.07), '#4a3222', s * 0.055),
    sh(circle(-s * 0.03, -s * 0.03, s * 0.022) + circle(s * 0.03, -s * 0.03, s * 0.022), BRASS),
  ];
}
/** Binoculars standing on their lenses; origin at base centre. */
export function binoculars(s: number, col = '#3a4a3a'): Shape[] {
  const out: Shape[] = [stroke(M(-s * 0.3, -s * 0.74) + Q(-s * 0.62, -s * 0.2, -s * 0.2, s * 0.06) + Q(0, s * 0.14, s * 0.34, s * 0.02), '#6b4a2f', 2.2)];
  for (const sd of [-1, 1]) {
    out.push(ol(poly([[sd * s * 0.07, -s * 0.74], [sd * s * 0.33, -s * 0.74], [sd * s * 0.42, -s * 0.1], [sd * s * 0.42, 0], [sd * s * 0.04, 0], [sd * s * 0.04, -s * 0.1]]), col, 1.1));
    out.push(ol(rect(sd * s * 0.2 - s * 0.1, -s * 0.9, s * 0.2, s * 0.17, 3), shade(col, -0.3), 1, 0.3), sh(rect(sd * s * 0.23 - s * 0.19, -s * 0.16, s * 0.38, s * 0.07), shade(col, 0.25)));
    out.push(sh(ellipse(sd * s * 0.23, -s * 0.01, s * 0.19, s * 0.045), '#8fc0d8'), hi(rect(sd * s * 0.23 - s * 0.14, -s * 0.66, s * 0.05, s * 0.44, 2), 0.2));
  }
  out.push(ol(rect(-s * 0.09, -s * 0.6, s * 0.18, s * 0.22, 2), shade(col, -0.15), 1), sh(circle(0, -s * 0.49, s * 0.05), BRASS));
  return out;
}
/** Folded trail map lying open; origin at centre. */
export function trailMap(s: number): Shape[] {
  const w = s, h = s * 0.68, p = 3, out: Shape[] = [sh(rect(-w / 2 + 3, -h / 2 + 4, w, h), '#000000', { opacity: 0.16 })];
  for (let i = 0; i < p; i++) {
    const x0 = -w / 2 + (w * i) / p, x1 = x0 + w / p, dy = i % 2 ? 4 : 0;
    out.push(ol(poly([[x0, -h / 2 + dy], [x1, -h / 2 + 4 - dy], [x1, h / 2 + 4 - dy], [x0, h / 2 + dy]]), i % 2 ? '#e9dcb6' : '#f4ead0', 0.8, -0.25));
  }
  let dots = '';
  const trail: Pt[] = [[-0.42, 0.3], [-0.3, 0.1], [-0.14, 0.16], [0, -0.04], [0.14, -0.18], [0.3, -0.12], [0.4, -0.3]];
  for (let i = 0; i < trail.length - 1; i++) for (let k = 0; k < 3; k++) { const t = k / 3; dots += circle((trail[i][0] + (trail[i + 1][0] - trail[i][0]) * t) * w, (trail[i][1] + (trail[i + 1][1] - trail[i][1]) * t) * h, 1.5); }
  out.push(
    sh(blob([[-w * 0.44, -h * 0.34], [-w * 0.2, -h * 0.4], [-w * 0.1, -h * 0.14], [-w * 0.3, -h * 0.02]], 0.9), '#a9cc94', { opacity: 0.85 }),
    sh(blob([[w * 0.06, h * 0.1], [w * 0.3, h * 0.04], [w * 0.4, h * 0.3], [w * 0.14, h * 0.36]], 0.9), '#8fc4e0', { opacity: 0.9 }),
    stroke(curve([[w * 0.18, h * 0.08], [w * 0.1, -h * 0.2], [w * 0.2, -h * 0.44]]), '#8fc4e0', 2),
    sh(poly([[-w * 0.36, -h * 0.12], [-w * 0.31, -h * 0.26], [-w * 0.26, -h * 0.12]]) + poly([[-w * 0.26, -h * 0.2], [-w * 0.21, -h * 0.34], [-w * 0.16, -h * 0.2]]), '#4f7d4a'),
    sh(poly([[-w * 0.02, -h * 0.22], [w * 0.06, -h * 0.4], [w * 0.13, -h * 0.22]]), '#b0a08a'), sh(dots, '#c8322a'),
    sh(star(w * 0.4, -h * 0.3, 5, 2, 5), '#c8322a'), sh(star(-w * 0.38, h * 0.34, 7, 1.6, 4, 0), '#6b5b4b'),
  );
  return out;
}
/** Brass compass; origin at centre. */
export function compass(r: number): Shape[] {
  let ticks = '';
  for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2, r0 = r * (i % 4 ? 0.74 : 0.64); ticks += line([[Math.cos(a) * r0, Math.sin(a) * r0], [Math.cos(a) * r * 0.82, Math.sin(a) * r * 0.82]]); }
  return [
    stroke(circle(0, -r * 1.16, r * 0.18), '#9c7a2e', 2.4), sh(rect(-r * 0.14, -r * 1.08, r * 0.28, r * 0.16, 2), BRASS),
    ol(circle(0, 0, r), BRASS, 1.2), sh(circle(0, 0, r * 0.86), '#fbf6e8'), stroke(ticks, '#6b5b4b', 1),
    sh(xf(poly([[0, -r * 0.7], [r * 0.13, 0], [-r * 0.13, 0]]), { rot: 30 }), '#c8322a'), sh(xf(poly([[0, r * 0.7], [r * 0.13, 0], [-r * 0.13, 0]]), { rot: 30 }), '#2f4a6a'),
    sh(circle(0, 0, r * 0.09), '#9c7a2e'), hi(sector(0, 0, r * 0.84, 200, 260, r * 0.5), 0.35),
  ];
}
/** Hiking pack with a bedroll on top; origin at base centre. */
export function backpack(s: number, col: string, roll = '#e8c05a'): Shape[] {
  const w = s * 0.66, h = s * 0.86;
  return [
    ol(rect(-w * 0.62, -h * 0.5, w * 0.2, h * 0.36, 5) + rect(w * 0.42, -h * 0.5, w * 0.2, h * 0.36, 5), shade(col, -0.18), 1),
    ol(M(-w / 2, -h * 0.6) + Q(-w / 2, -h, 0, -h) + Q(w / 2, -h, w / 2, -h * 0.6) + L(w / 2, -h * 0.05) + Q(w / 2, 0, w * 0.4, 0) + L(-w * 0.4, 0) + Q(-w / 2, 0, -w / 2, -h * 0.05) + 'Z', col, 1.2),
    ol(M(-w * 0.5, -h * 0.62) + Q(0, -h * 0.44, w * 0.5, -h * 0.62) + L(w * 0.5, -h * 0.76) + Q(0, -h * 1.02, -w * 0.5, -h * 0.76) + 'Z', shade(col, -0.14), 1),
    ol(rect(-w * 0.32, -h * 0.4, w * 0.64, h * 0.3, 6), shade(col, 0.14), 1), stroke(line([[-w * 0.26, -h * 0.33], [w * 0.26, -h * 0.33]]), shade(col, -0.4), 1.2),
    sh(rect(-w * 0.2, -h * 0.74, w * 0.07, h * 0.24, 2) + rect(w * 0.13, -h * 0.74, w * 0.07, h * 0.24, 2), '#4a3a2a'), sh(rect(-w * 0.215, -h * 0.56, w * 0.1, h * 0.05, 1) + rect(w * 0.115, -h * 0.56, w * 0.1, h * 0.05, 1), BRASS),
    ol(rect(-w * 0.56, -h * 1.16, w * 1.12, h * 0.2, h * 0.1), roll, 1.1), stroke(circle(-w * 0.44, -h * 1.06, h * 0.05), shade(roll, -0.3), 1.2),
    sh(rect(-w * 0.2, -h * 1.17, w * 0.06, h * 0.22) + rect(w * 0.14, -h * 1.17, w * 0.06, h * 0.22), '#4a3a2a'), hi(rect(-w * 0.42, -h * 0.56, w * 0.08, h * 0.5, 3), 0.16),
  ];
}
/** A pair of wooden snowshoes, crossed; origin at centre. */
export function snowshoes(s: number, col = '#c98a4a'): Shape[] {
  const one = (): Shape[] => {
    const prof: Pt[] = [[0, -0.5], [0.15, -0.4], [0.19, -0.14], [0.14, 0.14], [0.05, 0.36], [0, 0.56], [-0.05, 0.36], [-0.14, 0.14], [-0.19, -0.14], [-0.15, -0.4]];
    const d = blob(prof.map(([x, y]) => [x * s, y * s] as Pt), 0.9);
    const hw = (y: number) => (y < -0.14 ? 0.19 - Math.pow((-0.14 - y) / 0.36, 2) * 0.17 : 0.19 - ((y + 0.14) / 0.5) * 0.15) * s * 0.9;
    let web = '';
    for (let y = -0.36; y < 0.2; y += 0.07) { web += line([[-hw(y), y * s], [hw(y + 0.07), (y + 0.07) * s]]) + line([[hw(y), y * s], [-hw(y + 0.07), (y + 0.07) * s]]); }
    return [
      sh(d, '#f1e2bc', { opacity: 0.75 }), stroke(web, '#a8854a', 1), stroke(d, col, s * 0.035), stroke(d, shade(col, -0.4), 0.7),
      stroke(line([[-hw(-0.2), -0.2 * s], [hw(-0.2), -0.2 * s]]) + line([[-hw(0.12), 0.12 * s], [hw(0.12), 0.12 * s]]), col, s * 0.03),
      ol(rect(-s * 0.09, -s * 0.12, s * 0.18, s * 0.09, 2), '#6b3f22', 0.8), sh(rect(-s * 0.02, -s * 0.105, s * 0.04, s * 0.06, 1), BRASS),
    ];
  };
  return [...place(one(), { rot: -16, x: -s * 0.1 }), ...place(one(), { rot: 16, x: s * 0.1 })];
}
/** Canoe paddle, blade at the bottom; origin at the top of the grip. */
export function paddle(len: number, col = '#c98a4a', blade = '#d2452f'): Shape[] {
  return [
    ol(rect(-len * 0.06, 0, len * 0.12, len * 0.05, 3), shade(col, -0.1), 1), ol(rect(-len * 0.022, len * 0.04, len * 0.044, len * 0.6, 2), col, 1),
    ol(M(-len * 0.02, len * 0.6) + Q(-len * 0.12, len * 0.66, -len * 0.1, len * 0.9) + Q(0, len * 1.02, len * 0.1, len * 0.9) + Q(len * 0.12, len * 0.66, len * 0.02, len * 0.6) + 'Z', col, 1),
    sh(M(-len * 0.105, len * 0.8) + L(len * 0.105, len * 0.8) + L(len * 0.1, len * 0.9) + Q(0, len * 1.02, -len * 0.1, len * 0.9) + 'Z', blade),
    sh(rect(-len * 0.105, len * 0.76, len * 0.21, len * 0.02), '#fbf6ec'), stroke(line([[0, len * 0.62], [0, len * 0.74]]), shade(col, -0.25), 1),
  ];
}
/** Hurricane lantern; origin at base centre. `ring` adds a hanging loop on top. */
export function lantern(h: number, col = '#c8322a', lit = true): Shape[] {
  const w = h * 0.52, out: Shape[] = [];
  out.push(
    stroke(M(-w * 0.4, -h * 0.76) + Q(-w * 0.5, -h * 1.02, 0, -h * 1.04) + Q(w * 0.5, -h * 1.02, w * 0.4, -h * 0.76), '#3a3a40', 2),
    ol(M(-w * 0.44, -h * 0.02) + L(w * 0.44, -h * 0.02) + L(w * 0.36, -h * 0.2) + L(-w * 0.36, -h * 0.2) + 'Z', col, 1), sh(rect(-w * 0.48, -h * 0.05, w * 0.96, h * 0.05, 2), shade(col, -0.25)),
    ol(M(-w * 0.26, -h * 0.2) + Q(-w * 0.42, -h * 0.44, -w * 0.22, -h * 0.7) + L(w * 0.22, -h * 0.7) + Q(w * 0.42, -h * 0.44, w * 0.26, -h * 0.2) + 'Z', lit ? '#ffe9a8' : '#d8e6ea', 1, -0.25),
    sh(M(0, -h * 0.26) + Q(-w * 0.14, -h * 0.4, 0, -h * 0.58) + Q(w * 0.14, -h * 0.4, 0, -h * 0.26) + 'Z', lit ? '#ff9a2a' : '#a8b6ba'), sh(M(0, -h * 0.28) + Q(-w * 0.06, -h * 0.36, 0, -h * 0.46) + Q(w * 0.06, -h * 0.36, 0, -h * 0.28) + 'Z', lit ? '#fff3c4' : '#c8d2d6'),
    stroke(line([[-w * 0.4, -h * 0.2], [-w * 0.4, -h * 0.76]]) + line([[w * 0.4, -h * 0.2], [w * 0.4, -h * 0.76]]), shade(col, -0.1), 2.2),
    stroke(M(-w * 0.4, -h * 0.46) + Q(0, -h * 0.4, w * 0.4, -h * 0.46), shade(col, -0.2), 1.2),
    ol(poly([[-w * 0.44, -h * 0.7], [w * 0.44, -h * 0.7], [w * 0.24, -h * 0.84], [-w * 0.24, -h * 0.84]]), col, 1), ol(rect(-w * 0.13, -h * 0.92, w * 0.26, h * 0.09, 2), shade(col, -0.25), 0.8),
    hi(rect(-w * 0.22, -h * 0.64, w * 0.07, h * 0.38, 2), 0.4),
  );
  return out;
}
/** Deer standing, facing right; origin between the hooves, `s` = height to the top of the head. */
export function deer(s: number, col = '#b07a4a', antlers = true): Shape[] {
  const dk = shade(col, -0.22), P = (pts: Pt[]) => pts.map(([x, y]) => [x * s, y * s] as Pt);
  const out: Shape[] = [];
  // far legs
  out.push(sh(poly(P([[-0.3, -0.36], [-0.22, -0.36], [-0.25, -0.16], [-0.24, 0], [-0.28, 0], [-0.3, -0.16]])) + poly(P([[0.2, -0.36], [0.27, -0.36], [0.27, -0.18], [0.3, 0], [0.26, 0], [0.22, -0.18]])), dk));
  // body, neck
  out.push(ol(blob(P([[-0.42, -0.5], [-0.24, -0.6], [0.08, -0.57], [0.28, -0.56], [0.33, -0.4], [0.14, -0.31], [-0.16, -0.31], [-0.4, -0.34]]), 0.9), col, 1));
  out.push(sh(blob(P([[-0.3, -0.36], [-0.1, -0.33], [0.16, -0.33], [0.1, -0.29], [-0.18, -0.29]]), 0.9), '#f1dcc0'));
  out.push(ol(poly(P([[0.16, -0.54], [0.33, -0.42], [0.47, -0.78], [0.33, -0.86]])), col, 1), sh(poly(P([[0.3, -0.46], [0.33, -0.42], [0.47, -0.78], [0.43, -0.74]])), '#f1dcc0'));
  // near legs
  out.push(ol(poly(P([[-0.4, -0.4], [-0.3, -0.36], [-0.33, -0.18], [-0.36, 0], [-0.41, 0], [-0.4, -0.18], [-0.44, -0.3]])), col, 0.8), ol(poly(P([[0.1, -0.34], [0.19, -0.34], [0.16, -0.18], [0.17, 0], [0.12, 0], [0.11, -0.18]])), col, 0.8));
  out.push(sh(rect(-0.41 * s, -0.035 * s, 0.05 * s, 0.035 * s) + rect(0.12 * s, -0.035 * s, 0.05 * s, 0.035 * s) + rect(-0.28 * s, -0.03 * s, 0.04 * s, 0.03 * s) + rect(0.26 * s, -0.03 * s, 0.04 * s, 0.03 * s), INK));
  // tail, head
  out.push(ol(leaf(-0.42 * s, -0.5 * s, 0.13 * s, 0.045 * s, 130), '#fbf3e0', 0.8, -0.3));
  out.push(ol(leaf(0.33 * s, -0.9 * s, 0.17 * s, 0.05 * s, -140), dk, 0.8), ol(blob(P([[0.3, -0.88], [0.4, -0.97], [0.5, -0.93], [0.6, -0.84], [0.6, -0.78], [0.46, -0.76], [0.33, -0.78]]), 0.9), col, 1));
  out.push(ol(leaf(0.4 * s, -0.95 * s, 0.16 * s, 0.05 * s, -70), col, 0.8), sh(leaf(0.41 * s, -0.96 * s, 0.11 * s, 0.025 * s, -70), '#f1c8b0'));
  out.push(sh(ellipse(0.585 * s, -0.81 * s, 0.03 * s, 0.035 * s), INK), sh(circle(0.47 * s, -0.87 * s, 0.022 * s), INK), sh(circle(0.475 * s, -0.875 * s, 0.007 * s), '#ffffff'), sh(ellipse(0.52 * s, -0.79 * s, 0.05 * s, 0.02 * s), '#f1dcc0'));
  if (antlers) {
    const a = curve(P([[0.37, -0.95], [0.34, -1.1], [0.42, -1.24]])) + line(P([[0.345, -1.06], [0.27, -1.14]])) + line(P([[0.37, -1.16], [0.31, -1.25]])) + curve(P([[0.43, -0.96], [0.46, -1.08], [0.55, -1.18]])) + line(P([[0.46, -1.06], [0.53, -1.04]])) + line(P([[0.5, -1.13], [0.5, -1.22]]));
    out.push(stroke(a, '#8a6a4a', Math.max(1.6, s * 0.022)));
  }
  return out;
}
/** Perched songbird facing right; origin at the feet. */
export function bird(s: number, body: string, wing: string, belly: string, crest = false): Shape[] {
  const out: Shape[] = [stroke(line([[-s * 0.04, 0], [-s * 0.04, -s * 0.14]]) + line([[s * 0.06, 0], [s * 0.06, -s * 0.14]]), '#4a3a2a', 1.6)];
  out.push(ol(poly([[-s * 0.22, -s * 0.3], [-s * 0.62, -s * 0.12], [-s * 0.58, -s * 0.02], [-s * 0.18, -s * 0.18]]), wing, 0.8));
  out.push(ol(ellipse(0, -s * 0.34, s * 0.3, s * 0.21, -18), body, 1), sh(ellipse(s * 0.06, -s * 0.26, s * 0.2, s * 0.12, -18), belly));
  if (crest) out.push(ol(poly([[s * 0.14, -s * 0.66], [s * 0.04, -s * 0.9], [s * 0.3, -s * 0.7]]), body, 0.8));
  out.push(ol(circle(s * 0.22, -s * 0.56, s * 0.15), body, 1), sh(ellipse(s * 0.27, -s * 0.5, s * 0.09, s * 0.07), belly));
  out.push(ol(leaf(-s * 0.2, -s * 0.44, s * 0.4, s * 0.12, 24), wing, 0.8), stroke(line([[-s * 0.04, -s * 0.3], [s * 0.06, -s * 0.38]]) + line([[-s * 0.12, -s * 0.34], [-s * 0.02, -s * 0.42]]), '#ffffff', 1.6));
  out.push(sh(poly([[s * 0.35, -s * 0.6], [s * 0.52, -s * 0.54], [s * 0.35, -s * 0.5]]), '#3a3a40'), sh(circle(s * 0.26, -s * 0.59, s * 0.03), INK), sh(circle(s * 0.265, -s * 0.595, s * 0.01), '#ffffff'));
  if (crest) out.push(stroke(M(s * 0.1, -s * 0.5) + Q(s * 0.2, -s * 0.38, s * 0.34, -s * 0.46), INK, 1.6));
  return out;
}
/** Round canteen on a strap; origin at centre. */
export function canteen(s: number, col = '#5f7a4a'): Shape[] {
  const r = s * 0.4;
  return [
    stroke(M(-r * 0.8, -r * 0.5) + Q(-r * 1.3, -r * 2.1, 0, -r * 2.1) + Q(r * 1.3, -r * 2.1, r * 0.8, -r * 0.5), '#6b4a2f', 3),
    ol(rect(-r * 0.22, -r * 1.42, r * 0.44, r * 0.5, 2), '#c9ccd2', 1), ol(rect(-r * 0.28, -r * 1.5, r * 0.56, r * 0.18, 2), '#3a3a40', 0.8, 0.3),
    ol(circle(0, 0, r), col, 1.2), stroke(circle(0, 0, r * 0.78), shade(col, 0.3), 1.2), sh(circle(0, 0, r * 0.5), shade(col, -0.12)),
    hi(sector(0, 0, r * 0.9, 190, 250, r * 0.6), 0.25), sh(rect(-r * 1.02, -r * 0.14, r * 0.16, r * 0.28, 1) + rect(r * 0.86, -r * 0.14, r * 0.16, r * 0.28, 1), '#6b4a2f'),
  ];
}
/** One lace-up boot, toe to the right; origin at the sole centre. */
function boot(s: number, col: string, lace: string): Shape[] {
  let laces = '';
  for (let i = 0; i < 4; i++) laces += line([[i * s * 0.03, -s * 0.66 + i * s * 0.12], [s * 0.16 + i * s * 0.03, -s * 0.62 + i * s * 0.12]]);
  return [
    ol(M(-s * 0.3, -s * 0.8) + L(s * 0.06, -s * 0.8) + L(s * 0.12, -s * 0.36) + Q(s * 0.46, -s * 0.3, s * 0.5, -s * 0.1) + L(s * 0.5, -s * 0.04) + L(-s * 0.32, -s * 0.04) + 'Z', col, 1.2),
    ol(rect(-s * 0.34, -s * 0.1, s * 0.88, s * 0.1, 3), '#3a2a22', 1, 0.2), sh(rect(-s * 0.34, -s * 0.03, s * 0.2, s * 0.03) + rect(-s * 0.06, -s * 0.03, s * 0.2, s * 0.03) + rect(s * 0.22, -s * 0.03, s * 0.2, s * 0.03), '#1f1a16'),
    sh(M(-s * 0.32, -s * 0.86) + L(s * 0.08, -s * 0.86) + L(s * 0.07, -s * 0.74) + L(-s * 0.31, -s * 0.74) + 'Z', '#7a8a5a'),
    sh(M(s * 0.2, -s * 0.33) + Q(s * 0.46, -s * 0.28, s * 0.5, -s * 0.1) + L(s * 0.22, -s * 0.1) + 'Z', shade(col, -0.2)),
    stroke(laces, lace, 1.6), sh(circle(-s * 0.2, -s * 0.5, s * 0.03), shade(col, -0.35)),
  ];
}
/** A pair of hiking boots; origin at the sole centre of the front boot. */
export function hikingBoots(s: number, col = '#8a5a35', lace = '#f2c14e'): Shape[] {
  return [...place(boot(s, shade(col, -0.12), lace), { x: -s * 0.4, y: -s * 0.08, rot: -4 }), ...boot(s, col, lace)];
}
/** Vacuum flask with a cup lid; origin at base centre. */
export function thermos(h: number, col = '#3f7d6e'): Shape[] {
  const w = h * 0.32;
  return [
    stroke(M(w * 0.5, -h * 0.6) + Q(w * 1.1, -h * 0.5, w * 0.5, -h * 0.3), '#3a3a40', 3),
    ol(rect(-w / 2, -h * 0.72, w, h * 0.72, 3), col, 1.1), sh(rect(-w / 2, -h * 0.5, w, h * 0.05) + rect(-w / 2, -h * 0.2, w, h * 0.05), shade(col, 0.3)),
    ol(rect(-w * 0.42, -h * 0.8, w * 0.84, h * 0.1, 2), '#c9ccd2', 1), ol(rect(-w * 0.5, -h, w, h * 0.22, 4), '#e8e2d4', 1, -0.3),
    hi(rect(-w * 0.36, -h * 0.68, w * 0.16, h * 0.62, 2), 0.25),
  ];
}
/** Pine cone lying on its side; origin at centre. */
export function pineCone(s: number, col = '#8a5c38'): Shape[] {
  const out: Shape[] = [ol(ellipse(0, 0, s * 0.5, s * 0.3), shade(col, -0.2), 1)];
  let a = '', b = '';
  for (let r = 0; r < 5; r++) for (let i = -1; i <= 1; i++) {
    const x = -s * 0.36 + r * s * 0.18 + (i ? s * 0.06 : 0), y = i * s * 0.14 * (1 - Math.abs(r - 2) * 0.22);
    const d = sector(x, y, s * 0.11, -80, 80);
    if ((r + i) % 2) a += d; else b += d;
  }
  out.push(sh(a, col), sh(b, shade(col, 0.2)), sh(rect(-s * 0.6, -s * 0.03, s * 0.12, s * 0.06, 2), '#5a3c26'));
  return out;
}
export type SignSymbol = 'fire' | 'tent' | 'hiker' | 'fish' | 'pine' | 'canoe';
/** Arrow-shaped wooden trail board pointing right with a painted symbol; origin at centre. */
export function trailSign(w: number, col: string, symbol: SignSymbol, paint = '#fbf3dc'): Shape[] {
  const h = w * 0.34, u = h * 0.34, out: Shape[] = [];
  out.push(ol(poly([[-w / 2, -h / 2], [w * 0.3, -h / 2], [w / 2, 0], [w * 0.3, h / 2], [-w / 2, h / 2]]), col, 1.2));
  out.push(stroke(poly([[-w / 2 + 4, -h / 2 + 4], [w * 0.28, -h / 2 + 4], [w / 2 - 6, 0], [w * 0.28, h / 2 - 4], [-w / 2 + 4, h / 2 - 4]]), paint, 1.4, { opacity: 0.8 }));
  out.push(stroke(line([[-w * 0.3, -h * 0.2], [-w * 0.1, -h * 0.22]]) + line([[w * 0.02, h * 0.22], [w * 0.2, h * 0.2]]), shade(col, -0.25), 1, { opacity: 0.7 }));
  const cx = -w * 0.14;
  if (symbol === 'fire') {
    out.push(sh(M(cx - u * 0.7, u * 0.5) + Q(cx - u * 1.0, -u * 0.3, cx - u * 0.3, -u * 0.5) + Q(cx - u * 0.2, -u * 1.0, cx + u * 0.1, -u * 1.3) + Q(cx + u * 0.2, -u * 0.6, cx + u * 0.6, -u * 0.5) + Q(cx + u * 1.0, 0, cx + u * 0.6, u * 0.5) + 'Z', paint));
    out.push(sh(M(cx - u * 0.3, u * 0.5) + Q(cx - u * 0.4, -u * 0.1, cx, -u * 0.4) + Q(cx + u * 0.4, 0, cx + u * 0.25, u * 0.5) + 'Z', col), stroke(line([[cx - u * 1.1, u * 0.5], [cx + u * 1.1, u * 1.05]]) + line([[cx + u * 1.1, u * 0.5], [cx - u * 1.1, u * 1.05]]), paint, u * 0.3));
  } else if (symbol === 'tent') {
    out.push(sh(poly([[cx, -u * 1.1], [cx + u * 1.4, u * 0.9], [cx - u * 1.4, u * 0.9]]), paint), sh(poly([[cx, -u * 0.2], [cx + u * 0.45, u * 0.9], [cx - u * 0.45, u * 0.9]]), col), stroke(line([[cx - u * 0.3, -u * 1.4], [cx, -u * 1.1], [cx + u * 0.3, -u * 1.4]]), paint, u * 0.2));
  } else if (symbol === 'hiker') {
    out.push(sh(circle(cx + u * 0.1, -u * 0.95, u * 0.3), paint), stroke(line([[cx, -u * 0.6], [cx - u * 0.1, u * 0.1], [cx - u * 0.5, u * 1.0]]) + line([[cx - u * 0.1, u * 0.1], [cx + u * 0.4, u * 1.0]]) + line([[cx, -u * 0.4], [cx + u * 0.6, -u * 0.1]]), paint, u * 0.32));
    out.push(sh(rect(cx - u * 0.6, -u * 0.6, u * 0.4, u * 0.65, 2), paint), stroke(line([[cx + u * 0.7, -u * 0.5], [cx + u * 0.9, u * 1.0]]), paint, u * 0.16));
  } else if (symbol === 'fish') {
    out.push(sh(leaf(cx - u * 1.0, 0, u * 2.0, u * 0.6, 0) + poly([[cx - u * 0.9, 0], [cx - u * 1.5, -u * 0.6], [cx - u * 1.5, u * 0.6]]), paint), sh(circle(cx + u * 0.6, -u * 0.1, u * 0.12), col), stroke(M(cx - u * 1.4, u * 0.95) + Q(cx - u * 0.7, u * 0.7, cx, u * 0.95) + Q(cx + u * 0.7, u * 1.2, cx + u * 1.4, u * 0.95), paint, u * 0.18));
  } else if (symbol === 'canoe') {
    out.push(sh(M(cx - u * 1.6, -u * 0.1) + Q(cx, u * 0.3, cx + u * 1.6, -u * 0.1) + Q(cx + u * 1.2, u * 0.8, cx, u * 0.8) + Q(cx - u * 1.2, u * 0.8, cx - u * 1.6, -u * 0.1) + 'Z', paint), stroke(line([[cx - u * 0.6, -u * 1.2], [cx + u * 0.5, u * 0.3]]), paint, u * 0.2), sh(ellipse(cx - u * 0.7, -u * 1.1, u * 0.2, u * 0.36, -35), paint));
  } else {
    out.push(sh(poly([[cx, -u * 1.3], [cx + u * 0.7, -u * 0.2], [cx - u * 0.7, -u * 0.2]]) + poly([[cx, -u * 0.7], [cx + u * 0.95, u * 0.6], [cx - u * 0.95, u * 0.6]]) + rect(cx - u * 0.15, u * 0.6, u * 0.3, u * 0.5), paint));
  }
  out.push(sh(circle(-w * 0.44, 0, 2) + circle(w * 0.2, 0, 2), '#3a3a40'));
  return out;
}
/** Squirrel sitting up with a nut, facing right; origin at the feet. */
export function squirrel(s: number, col = '#b8652e'): Shape[] {
  return [
    ol(M(-s * 0.1, -s * 0.06) + Q(-s * 0.62, -s * 0.1, -s * 0.5, -s * 0.6) + Q(-s * 0.44, -s * 0.98, -s * 0.1, -s * 0.9) + Q(-s * 0.3, -s * 0.7, -s * 0.26, -s * 0.46) + Q(-s * 0.22, -s * 0.2, -s * 0.02, -s * 0.2) + 'Z', shade(col, 0.12), 1),
    sh(M(-s * 0.2, -s * 0.12) + Q(-s * 0.5, -s * 0.2, -s * 0.42, -s * 0.6) + Q(-s * 0.36, -s * 0.84, -s * 0.2, -s * 0.86), 'none', { stroke: shade(col, 0.35), strokeWidth: 1.4 }),
    ol(blob([[-s * 0.12, -s * 0.03], [-s * 0.17, -s * 0.36], [0, -s * 0.56], [s * 0.16, -s * 0.4], [s * 0.15, -s * 0.03]], 0.9), col, 1),
    ol(blob([[0, -s * 0.52], [s * 0.12, -s * 0.69], [s * 0.3, -s * 0.62], [s * 0.27, -s * 0.48], [s * 0.06, -s * 0.44]], 0.9), col, 1),
    ol(poly([[s * 0.05, -s * 0.64], [s * 0.05, -s * 0.8], [s * 0.14, -s * 0.66]]), col, 0.8), sh(circle(s * 0.18, -s * 0.6, s * 0.028), INK), sh(circle(s * 0.29, -s * 0.56, s * 0.02), INK),
    sh(ellipse(s * 0.03, -s * 0.24, s * 0.07, s * 0.15), '#f6e0bc'), ol(ellipse(s * 0.17, -s * 0.36, s * 0.055, s * 0.065), '#8a5a2a', 0.6), sh(rect(s * 0.12, -s * 0.44, s * 0.1, s * 0.035, 1), '#5a3c26'),
    ol(ellipse(s * 0.06, -s * 0.03, s * 0.12, s * 0.04), shade(col, -0.1), 0.6),
  ];
}
/** Hatchet or axe, head at the top; origin at the bottom of the handle. */
export function axe(len: number, head = '#9aa0a6'): Shape[] {
  return [
    ol(M(-len * 0.03, 0) + Q(-len * 0.05, -len * 0.5, -len * 0.025, -len) + L(len * 0.025, -len) + Q(len * 0.015, -len * 0.5, len * 0.04, 0) + 'Z', '#b8824a', 1),
    ol(M(-len * 0.05, -len * 0.98) + L(len * 0.16, -len * 1.0) + Q(len * 0.3, -len * 0.98, len * 0.34, -len * 1.06) + Q(len * 0.36, -len * 0.86, len * 0.3, -len * 0.7) + Q(len * 0.24, -len * 0.8, len * 0.14, -len * 0.82) + L(-len * 0.05, -len * 0.84) + 'Z', head, 1.1),
    sh(M(len * 0.25, -len * 0.985) + Q(len * 0.3, -len * 0.98, len * 0.34, -len * 1.06) + Q(len * 0.36, -len * 0.86, len * 0.3, -len * 0.7) + Q(len * 0.3, -len * 0.84, len * 0.25, -len * 0.985) + 'Z', '#e2e6ea'),
    sh(rect(-len * 0.035, -len * 0.14, len * 0.07, len * 0.03) + rect(-len * 0.035, -len * 0.08, len * 0.07, len * 0.03), '#8a5c38'),
  ];
}

// =====================================================================
// canyon things
// =====================================================================
/** Coin-operated viewing telescope seen from behind; origin at the foot of the pedestal. */
export function viewer(h: number, col = '#8fb0b8'): Shape[] {
  const w = h * 0.44, hy = -h * 0.8, hh = h * 0.3;
  return [
    ol(ellipse(0, -h * 0.01, w * 0.42, h * 0.03), '#5a6468', 1), ol(poly([[-w * 0.3, -h * 0.02], [w * 0.3, -h * 0.02], [w * 0.12, -h * 0.14], [-w * 0.12, -h * 0.14]]), '#6a767a', 1),
    ol(poly([[-w * 0.11, -h * 0.12], [w * 0.11, -h * 0.12], [w * 0.08, -h * 0.62], [-w * 0.08, -h * 0.62]]), '#7a888c', 1), hi(rect(-w * 0.07, -h * 0.6, w * 0.04, h * 0.46), 0.25),
    ol(poly([[-w * 0.2, -h * 0.6], [w * 0.2, -h * 0.6], [w * 0.3, -h * 0.68], [-w * 0.3, -h * 0.68]]), '#5a6468', 1),
    stroke(line([[-w * 0.5, hy + hh * 0.1], [-w * 0.72, hy + hh * 0.3]]) + line([[w * 0.5, hy + hh * 0.1], [w * 0.72, hy + hh * 0.3]]), '#3a3a40', 5), sh(circle(-w * 0.74, hy + hh * 0.32, 5) + circle(w * 0.74, hy + hh * 0.32, 5), '#c8322a'),
    ol(M(-w * 0.5, hy - hh * 0.2) + Q(-w * 0.5, hy - hh * 0.62, -w * 0.2, hy - hh * 0.62) + L(w * 0.2, hy - hh * 0.62) + Q(w * 0.5, hy - hh * 0.62, w * 0.5, hy - hh * 0.2) + L(w * 0.44, hy + hh * 0.3) + Q(w * 0.4, hy + hh * 0.42, w * 0.2, hy + hh * 0.42) + L(-w * 0.2, hy + hh * 0.42) + Q(-w * 0.4, hy + hh * 0.42, -w * 0.44, hy + hh * 0.3) + 'Z', col, 1.4),
    hi(M(-w * 0.44, hy - hh * 0.2) + Q(-w * 0.44, hy - hh * 0.54, -w * 0.2, hy - hh * 0.55) + L(w * 0.1, hy - hh * 0.55) + L(w * 0.1, hy - hh * 0.46) + L(-w * 0.2, hy - hh * 0.46) + Q(-w * 0.34, hy - hh * 0.44, -w * 0.36, hy - hh * 0.2) + 'Z', 0.3),
    ol(circle(-w * 0.2, hy - hh * 0.16, w * 0.15), '#3a4448', 1.2, 0.3), ol(circle(w * 0.2, hy - hh * 0.16, w * 0.15), '#3a4448', 1.2, 0.3),
    sh(circle(-w * 0.2, hy - hh * 0.16, w * 0.09) + circle(w * 0.2, hy - hh * 0.16, w * 0.09), '#1f2a30'), hi(circle(-w * 0.23, hy - hh * 0.2, w * 0.03) + circle(w * 0.17, hy - hh * 0.2, w * 0.03), 0.6),
    ol(rect(-w * 0.12, hy + hh * 0.12, w * 0.24, hh * 0.22, 2), shade(col, -0.25), 1), sh(rect(-w * 0.015, hy + hh * 0.15, w * 0.03, hh * 0.13, 1), INK), sh(circle(-w * 0.36, hy + hh * 0.26, 2.2) + circle(w * 0.36, hy + hh * 0.26, 2.2), '#5a6468'),
  ];
}
/** Condor soaring, seen from below; origin at the body centre, `w` = wingspan. */
export function condor(w: number): Shape[] {
  const out: Shape[] = [], blk = '#2e2824';
  for (const sd of [-1, 1]) {
    const X = (x: number) => sd * x * w;
    out.push(sh(M(X(0.03), -w * 0.03) + Q(X(0.2), -w * 0.1, X(0.42), -w * 0.1) + L(X(0.44), -w * 0.02) + Q(X(0.24), w * 0.06, X(0.03), w * 0.05) + 'Z', blk));
    let f = '';
    for (let i = 0; i < 6; i++) f += leaf(X(0.4), -w * 0.07 + i * w * 0.012, w * 0.13, w * 0.014, sd > 0 ? -34 + i * 13 : 214 - i * 13);
    out.push(sh(f, blk), sh(M(X(0.06), -w * 0.035) + Q(X(0.2), -w * 0.085, X(0.36), -w * 0.085) + L(X(0.3), -w * 0.03) + Q(X(0.16), -w * 0.01, X(0.06), -w * 0.005) + 'Z', '#f1ece0'));
    out.push(stroke(M(X(0.08), w * 0.03) + Q(X(0.24), w * 0.03, X(0.4), -w * 0.03), '#4a423c', 1));
  }
  out.push(sh(poly([[-w * 0.04, w * 0.03], [w * 0.04, w * 0.03], [w * 0.06, w * 0.12], [0, w * 0.1], [-w * 0.06, w * 0.12]]), blk), sh(ellipse(0, 0, w * 0.04, w * 0.07), '#3a322c'));
  out.push(sh(ellipse(0, -w * 0.05, w * 0.03, w * 0.012), '#1f1a16'), ol(ellipse(0, -w * 0.075, w * 0.017, w * 0.022), '#e8a07a', 0.6), sh(poly([[-w * 0.006, -w * 0.095], [w * 0.006, -w * 0.095], [0, -w * 0.112]]), '#f4eccc'));
  return out;
}
/** Lizard seen from above, head to the right; origin at the body centre. */
export function lizard(s: number, col = '#6fae5a'): Shape[] {
  const dk = shade(col, -0.3);
  let legs = '', toes = '';
  for (const [x, y, kx, ky] of [[0.1, -0.05, 0.2, -0.17], [0.1, 0.05, 0.2, 0.17], [-0.14, -0.05, -0.24, -0.16], [-0.14, 0.05, -0.24, 0.16]] as [number, number, number, number][]) {
    legs += line([[x * s, y * s], [kx * s, ky * s * 0.7], [(kx + 0.06) * s, ky * s]]);
    for (const a of [-0.03, 0.02, 0.07]) toes += line([[(kx + 0.06) * s, ky * s], [(kx + 0.06 + a) * s, ky * s * 1.3]]);
  }
  let dots = '';
  for (let i = 0; i < 6; i++) dots += circle((-0.16 + i * 0.07) * s, (i % 2 ? 0.015 : -0.015) * s, s * 0.013);
  return [
    stroke(legs, col, s * 0.035), stroke(toes, col, s * 0.016),
    ol(M(-s * 0.18, -s * 0.045) + Q(-s * 0.42, -s * 0.1, -s * 0.5, s * 0.06) + Q(-s * 0.52, s * 0.16, -s * 0.4, s * 0.17) + Q(-s * 0.48, s * 0.12, -s * 0.44, s * 0.05) + Q(-s * 0.38, -s * 0.02, -s * 0.18, s * 0.045) + 'Z', col, 0.8, -0.3),
    ol(blob([[-s * 0.2, 0], [-s * 0.06, -s * 0.07], [s * 0.12, -s * 0.06], [s * 0.22, 0], [s * 0.12, s * 0.06], [-s * 0.06, s * 0.07]], 0.9), col, 1, -0.3),
    ol(blob([[s * 0.18, 0], [s * 0.26, -s * 0.055], [s * 0.36, -s * 0.03], [s * 0.4, 0], [s * 0.36, s * 0.03], [s * 0.26, s * 0.055]], 0.9), shade(col, 0.06), 1, -0.3),
    sh(dots, dk), stroke(line([[-s * 0.18, 0], [s * 0.18, 0]]), shade(col, 0.3), 1), sh(circle(s * 0.31, -s * 0.032, s * 0.014) + circle(s * 0.31, s * 0.032, s * 0.014), INK),
  ];
}
/** Wide straw sun hat; origin at brim centre. */
export function sunHat(s: number, col = '#e8cf8a', band = '#c8522a'): Shape[] {
  let weave = '';
  for (const k of [0.82, 0.62]) weave += ellipse(0, 0, (s / 2) * k, s * 0.15 * k);
  return [
    ol(ellipse(0, 0, s / 2, s * 0.15), col, 1.2, -0.3), stroke(weave, shade(col, -0.18), 1),
    ol(M(-s * 0.23, -s * 0.02) + Q(-s * 0.22, -s * 0.36, 0, -s * 0.36) + Q(s * 0.22, -s * 0.36, s * 0.23, -s * 0.02) + Q(0, s * 0.07, -s * 0.23, -s * 0.02) + 'Z', shade(col, 0.08), 1.2, -0.3),
    stroke(M(-s * 0.23, -s * 0.07) + Q(0, s * 0.02, s * 0.23, -s * 0.07), band, s * 0.06), sh(poly([[s * 0.16, -s * 0.06], [s * 0.3, -s * 0.0], [s * 0.26, s * 0.06], [s * 0.18, -s * 0.01]]), band),
    hi(ellipse(-s * 0.08, -s * 0.24, s * 0.06, s * 0.08), 0.25),
  ];
}
/** Compact camera with a strap; origin at centre. */
export function camera(s: number, body = '#3a3a42', band = '#c98a4a'): Shape[] {
  const w = s, h = s * 0.62;
  return [
    stroke(M(-w * 0.44, -h * 0.4) + Q(-w * 0.7, -h * 1.1, 0, -h * 1.0) + Q(w * 0.7, -h * 1.1, w * 0.44, -h * 0.4), '#6b4a2f', 2.4),
    ol(rect(-w * 0.26, -h * 0.66, w * 0.3, h * 0.2, 2), shade(body, 0.1), 1, 0.3), ol(rect(-w / 2, -h / 2, w, h, 5), body, 1.2, 0.3), sh(rect(-w / 2, -h * 0.22, w, h * 0.5), band),
    ol(circle(w * 0.06, h * 0.02, h * 0.36), '#c9ccd2', 1), sh(circle(w * 0.06, h * 0.02, h * 0.27), '#2a2a2e'), sh(circle(w * 0.06, h * 0.02, h * 0.17), '#4a6a8a'), hi(circle(w * 0.01, -h * 0.05, h * 0.06), 0.7),
    sh(rect(w * 0.26, -h * 0.4, w * 0.16, h * 0.14, 2), '#fbf6ec'), sh(circle(-w * 0.36, -h * 0.33, h * 0.06), '#c8322a'), ol(rect(w * 0.2, -h * 0.6, w * 0.14, h * 0.1, 2), '#c9ccd2', 0.8),
  ];
}
/** A pair of trekking poles, tips down; origin at the midpoint between the tips. */
export function trekkingPoles(len: number, col = '#d2452f'): Shape[] {
  const one = (): Shape[] => [
    stroke(M(-len * 0.03, -len * 0.9) + Q(-len * 0.1, -len * 0.78, -len * 0.02, -len * 0.74), '#2a2a2e', 1.6),
    ol(rect(-len * 0.012, -len * 0.82, len * 0.024, len * 0.44, 1), '#c9ccd2', 0.8), ol(rect(-len * 0.01, -len * 0.4, len * 0.02, len * 0.36, 1), col, 0.8),
    ol(rect(-len * 0.022, -len * 1.0, len * 0.044, len * 0.2, len * 0.02), '#2a2a2e', 0.8, 0.3), sh(rect(-len * 0.018, -len * 0.42, len * 0.036, len * 0.03, 1), '#f2c14e'),
    ol(ellipse(0, -len * 0.06, len * 0.045, len * 0.014), '#3a3a40', 0.8, 0.3), sh(poly([[-len * 0.007, -len * 0.05], [len * 0.007, -len * 0.05], [0, 0]]), '#6a6e76'),
  ];
  return [...place(one(), { rot: -7, x: -len * 0.06 }), ...place(one(), { rot: 6, x: len * 0.06 })];
}
/** Metal water flask with a loop cap; origin at base centre. */
export function flask(h: number, col = '#3f8fbf'): Shape[] {
  const w = h * 0.36;
  return [
    stroke(circle(w * 0.24, -h * 0.94, h * 0.07), '#3a3a40', 2.2),
    ol(M(-w / 2, -h * 0.04) + L(-w / 2, -h * 0.62) + Q(-w / 2, -h * 0.76, -w * 0.2, -h * 0.8) + L(w * 0.2, -h * 0.8) + Q(w / 2, -h * 0.76, w / 2, -h * 0.62) + L(w / 2, -h * 0.04) + Q(w / 2, 0, w * 0.36, 0) + L(-w * 0.36, 0) + Q(-w / 2, 0, -w / 2, -h * 0.04) + 'Z', col, 1.1),
    ol(rect(-w * 0.24, -h * 0.92, w * 0.48, h * 0.14, 2), '#3a3a40', 0.8, 0.3), sh(rect(-w / 2, -h * 0.5, w, h * 0.16), shade(col, 0.4)), sh(poly([[-w * 0.2, -h * 0.38], [0, -h * 0.47], [w * 0.2, -h * 0.38]]), col),
    hi(rect(-w * 0.38, -h * 0.66, w * 0.14, h * 0.58, 3), 0.28),
  ];
}
/** Wicker picnic basket with a checked cloth; origin at base centre. */
export function picnicBasket(s: number, col = '#c99a5a'): Shape[] {
  const w = s, h = s * 0.5, out: Shape[] = [];
  out.push(stroke(M(-w * 0.34, -h * 0.9) + Q(-w * 0.36, -h * 1.9, 0, -h * 1.9) + Q(w * 0.36, -h * 1.9, w * 0.34, -h * 0.9), shade(col, -0.25), s * 0.07), stroke(M(-w * 0.34, -h * 0.9) + Q(-w * 0.36, -h * 1.9, 0, -h * 1.9) + Q(w * 0.36, -h * 1.9, w * 0.34, -h * 0.9), shade(col, 0.1), s * 0.035));
  out.push(sh(M(-w * 0.44, -h * 0.9) + Q(-w * 0.2, -h * 1.3, 0, -h * 1.06) + Q(w * 0.24, -h * 1.34, w * 0.44, -h * 0.9) + L(w * 0.5, -h * 0.5) + L(w * 0.3, -h * 0.64) + L(w * 0.34, -h * 0.9) + 'Z', '#fbf6ec'));
  let ck = '';
  for (let i = 0; i < 6; i++) ck += rect(-w * 0.36 + i * w * 0.13, -h * 1.12 + (i % 2) * h * 0.08, w * 0.065, h * 0.2);
  out.push(sh(ck, '#c8322a', { opacity: 0.85 }));
  out.push(ol(poly([[-w / 2, -h * 0.9], [w / 2, -h * 0.9], [w * 0.42, 0], [-w * 0.42, 0]]), col, 1.2));
  let a = '', b = '';
  for (let r = 0; r < 4; r++) for (let i = 0; i < 9; i++) {
    const y = -h * 0.86 + r * h * 0.21, k = 1 - (r + 0.5) * 0.04, x = (-w * 0.46 + i * w * 0.103) * k;
    const d = rect(x, y, w * 0.09 * k, h * 0.17, 2);
    if ((r + i) % 2) a += d; else b += d;
  }
  out.push(sh(a, shade(col, -0.16)), sh(b, shade(col, 0.14)), ol(rect(-w * 0.52, -h * 0.96, w * 1.04, h * 0.12, 3), shade(col, -0.1), 1));
  out.push(sh(poly([[w * 0.3, -h * 0.9], [w * 0.5, -h * 0.9], [w * 0.52, -h * 0.4], [w * 0.4, -h * 0.56]]), '#fbf6ec'), sh(rect(w * 0.36, -h * 0.86, w * 0.06, h * 0.12) + rect(w * 0.43, -h * 0.72, w * 0.05, h * 0.12), '#c8322a', { opacity: 0.85 }));
  return out;
}
/** Roadrunner standing, facing right; origin between the feet. */
export function roadrunner(s: number): Shape[] {
  const br = '#7a6048', cr = '#f1e6cc';
  let streak = '';
  for (let i = 0; i < 7; i++) streak += line([[(-0.12 + i * 0.05) * s, (-0.5 + (i % 2) * 0.05) * s], [(-0.08 + i * 0.05) * s, (-0.42 + (i % 2) * 0.05) * s]]);
  return [
    stroke(line([[-s * 0.02, -s * 0.36], [-s * 0.06, -s * 0.16], [-s * 0.02, 0], [s * 0.08, 0]]) + line([[s * 0.08, -s * 0.36], [s * 0.1, -s * 0.16], [s * 0.16, 0], [s * 0.26, 0]]), '#5a6a8a', s * 0.03),
    ol(poly([[-s * 0.16, -s * 0.5], [-s * 0.62, -s * 0.86], [-s * 0.56, -s * 0.92], [-s * 0.1, -s * 0.58]]), '#4a3c30', 0.8), stroke(line([[-s * 0.2, -s * 0.56], [-s * 0.56, -s * 0.86]]), cr, 1),
    ol(ellipse(0, -s * 0.46, s * 0.26, s * 0.14, -14), br, 1), sh(ellipse(s * 0.06, -s * 0.4, s * 0.17, s * 0.075, -14), cr), stroke(streak, '#3a2c22', 1.2),
    ol(poly([[s * 0.12, -s * 0.5], [s * 0.26, -s * 0.44], [s * 0.38, -s * 0.74], [s * 0.26, -s * 0.78]]), br, 0.8),
    ol(ellipse(s * 0.34, -s * 0.78, s * 0.1, s * 0.075, -10), br, 1), sh(poly([[s * 0.26, -s * 0.84], [s * 0.16, -s * 1.0], [s * 0.3, -s * 0.92], [s * 0.3, -s * 1.02], [s * 0.38, -s * 0.86]]), '#3a2c22'),
    ol(poly([[s * 0.42, -s * 0.81], [s * 0.66, -s * 0.76], [s * 0.42, -s * 0.73]]), '#3a3a40', 0.6), sh(circle(s * 0.37, -s * 0.79, s * 0.022), '#f2c14e'), sh(circle(s * 0.37, -s * 0.79, s * 0.011), INK),
    sh(leaf(s * 0.33, -s * 0.76, s * 0.09, s * 0.015, 170), '#e8823a'),
  ];
}
export function sunglasses(s: number, frame = '#1f1f24', lens = '#5a3a2a'): Shape[] {
  const out: Shape[] = [stroke(M(-s * 0.46, -s * 0.06) + Q(-s * 0.6, -s * 0.2, -s * 0.44, -s * 0.3) + M(s * 0.46, -s * 0.06) + Q(s * 0.6, -s * 0.2, s * 0.44, -s * 0.3), frame, 2.2)];
  for (const sd of [-1, 1]) out.push(ol(blob([[sd * s * 0.06, -s * 0.08], [sd * s * 0.26, -s * 0.12], [sd * s * 0.46, -s * 0.07], [sd * s * 0.42, s * 0.12], [sd * s * 0.24, s * 0.17], [sd * s * 0.09, s * 0.1]], 0.9), lens, 2.4, -0.6), hi(poly([[sd * s * 0.16 - s * 0.06, -s * 0.04], [sd * s * 0.16 + s * 0.02, -s * 0.06], [sd * s * 0.16 - s * 0.04, s * 0.08], [sd * s * 0.16 - s * 0.1, s * 0.08]]), 0.3));
  out.push(stroke(M(-s * 0.07, -s * 0.04) + Q(0, -s * 0.12, s * 0.07, -s * 0.04), frame, 2.6));
  return out;
}
export function apple(s: number, col = '#c8322a'): Shape[] {
  return [
    ol(blob([[-s * 0.02, -s * 0.36], [-s * 0.3, -s * 0.44], [-s * 0.46, -s * 0.1], [-s * 0.26, s * 0.4], [0, s * 0.34], [s * 0.26, s * 0.4], [s * 0.46, -s * 0.1], [s * 0.3, -s * 0.44]], 0.95), col, 1), hi(ellipse(-s * 0.22, -s * 0.12, s * 0.07, s * 0.16, 15), 0.35),
    stroke(M(0, -s * 0.32) + Q(s * 0.02, -s * 0.5, s * 0.1, -s * 0.58), '#5a3c26', 2), ol(leaf(s * 0.04, -s * 0.44, s * 0.3, s * 0.1, -20), '#6fae5a', 0.8),
  ];
}
/** Field guide with a mesa on the cover; origin at centre. */
export function guidebook(s: number, col = '#2f6690'): Shape[] {
  const w = s * 0.74, h = s;
  return [
    sh(rect(-w / 2 + 3, -h / 2 + 3, w, h, 3), '#000000', { opacity: 0.18 }), sh(rect(-w / 2 + 2, -h / 2 + 2, w, h - 2, 2), '#f3ead6'), ol(rect(-w / 2, -h / 2, w - 3, h - 3, 3), col, 1),
    sh(rect(-w * 0.4, -h * 0.34, w * 0.74, h * 0.46, 2), '#f6d9a0'), sh(circle(w * 0.14, -h * 0.16, w * 0.1), '#f08a2b'),
    sh(poly([[-w * 0.4, h * 0.12], [-w * 0.4, -h * 0.02], [-w * 0.26, -h * 0.02], [-w * 0.22, -h * 0.12], [-w * 0.06, -h * 0.12], [-w * 0.02, 0], [w * 0.14, 0], [w * 0.18, h * 0.04], [w * 0.34, h * 0.04], [w * 0.34, h * 0.12]]), '#c8522a'),
    sh(rect(-w * 0.3, h * 0.22, w * 0.54, h * 0.045, 1) + rect(-w * 0.22, h * 0.31, w * 0.38, h * 0.035, 1), '#fbf6ec'), sh(rect(-w / 2, -h / 2, w * 0.07, h - 3, 2), shade(col, -0.25)),
  ];
}

// =====================================================================
// cabin things
// =====================================================================
/** Enamel kettle, spout to the left; origin at base centre. */
export function kettle(s: number, col = '#3f6fa8'): Shape[] {
  const w = s * 0.74, h = s * 0.6;
  let speck = '';
  const g = rng(31);
  for (let i = 0; i < 10; i++) speck += circle(g.range(-w * 0.4, w * 0.4), g.range(-h * 0.56, -h * 0.08), 1.2);
  return [
    stroke(M(-w * 0.34, -h * 0.74) + Q(0, -h * 1.56, w * 0.34, -h * 0.74), '#3a3a40', 3),
    ol(M(-w * 0.4, -h * 0.44) + L(-w * 0.8, -h * 0.84) + L(-w * 0.86, -h * 0.74) + L(-w * 0.5, -h * 0.2) + 'Z', col, 1),
    ol(M(-w / 2, -h * 0.66) + Q(-w * 0.58, 0, -w * 0.3, 0) + L(w * 0.3, 0) + Q(w * 0.58, 0, w / 2, -h * 0.66) + Q(0, -h * 0.84, -w / 2, -h * 0.66) + 'Z', col, 1.2),
    sh(speck, '#fbf6ec', { opacity: 0.85 }), hi(ellipse(-w * 0.24, -h * 0.4, w * 0.07, h * 0.2, 12), 0.3),
    ol(ellipse(0, -h * 0.75, w * 0.3, h * 0.08), shade(col, 0.16), 1), ol(circle(0, -h * 0.87, w * 0.07), '#2a2a2e', 0.8, 0.3), sh(rect(-w * 0.36, -h * 0.06, w * 0.72, h * 0.06, 2), shade(col, -0.3)),
  ];
}
/** Two-burner camp stove with a lit ring; origin at base centre. */
export function campStove(s: number, col = '#5f8a54'): Shape[] {
  const w = s, h = s * 0.26;
  let fl = '';
  for (let i = 0; i < 7; i++) fl += petal(-w * 0.22 - w * 0.12 + i * w * 0.04, -h * 1.0, h * 0.26, h * 0.07, -90);
  return [
    ol(poly([[-w * 0.5, -h * 0.9], [-w * 0.5, -h * 1.9], [-w * 0.44, -h * 1.9], [-w * 0.44, -h * 0.9]]) + poly([[w * 0.5, -h * 0.9], [w * 0.5, -h * 1.9], [w * 0.44, -h * 1.9], [w * 0.44, -h * 0.9]]), shade(col, -0.1), 1),
    ol(rect(-w / 2, -h, w, h, 4), col, 1.2), sh(rect(-w / 2, -h * 0.34, w, h * 0.1), shade(col, -0.25)), sh(rect(-w * 0.46, -h * 1.02, w * 0.92, h * 0.1, 2), '#3a3a40'),
    sh(fl, '#5ab0e8'), stroke(line([[-w * 0.4, -h * 1.22], [-w * 0.04, -h * 1.22]]) + line([[w * 0.04, -h * 1.22], [w * 0.4, -h * 1.22]]), '#2a2a2e', 3),
    ol(circle(-w * 0.3, -h * 0.62, h * 0.14), '#2a2a2e', 0.8, 0.3), ol(circle(w * 0.04, -h * 0.62, h * 0.14), '#2a2a2e', 0.8, 0.3), sh(circle(w * 0.34, -h * 0.62, h * 0.1), '#c8322a'),
    ol(rect(w * 0.5, -h * 0.7, w * 0.16, h * 0.34, 3), '#c8322a', 1),
  ];
}
/** A pair of rubber boots; origin at the sole centre of the front boot. */
export function rubberBoots(s: number, col = '#3f7d5a'): Shape[] {
  const one = (c: string): Shape[] => [
    ol(M(-s * 0.26, -s) + L(s * 0.08, -s) + L(s * 0.1, -s * 0.34) + Q(s * 0.42, -s * 0.3, s * 0.46, -s * 0.12) + L(s * 0.46, -s * 0.05) + L(-s * 0.28, -s * 0.05) + 'Z', c, 1.2),
    ol(rect(-s * 0.3, -s * 0.09, s * 0.78, s * 0.09, 3), shade(c, -0.4), 0.8, 0.2), sh(rect(-s * 0.27, -s, s * 0.36, s * 0.1), shade(c, 0.3)),
    hi(rect(-s * 0.2, -s * 0.86, s * 0.06, s * 0.6, 2), 0.25), sh(M(s * 0.18, -s * 0.31) + Q(s * 0.42, -s * 0.28, s * 0.46, -s * 0.12) + L(s * 0.2, -s * 0.12) + 'Z', shade(c, -0.18)),
  ];
  return [...place(one(shade(col, -0.12)), { x: -s * 0.32, y: -s * 0.06, rot: -5 }), ...one(col)];
}
/** Fishing rod with a reel, handle at the origin, tip up and to the right. */
export function fishingRod(len: number, col = '#3a3a40'): Shape[] {
  const tx = len * 0.34, ty = -len * 0.94;
  let rings = '';
  for (const t of [0.3, 0.5, 0.68, 0.84, 0.97]) rings += circle(tx * t + 3, ty * t, 2.2);
  return [
    stroke(line([[len * 0.07, -len * 0.19], [tx, ty]]), col, 2.6), stroke(line([[0, 0], [len * 0.07, -len * 0.19]]), '#b8824a', 7), stroke(line([[len * 0.02, -len * 0.05], [len * 0.035, -len * 0.09]]), '#6b3f22', 7.6),
    stroke(rings, '#9aa0a6', 1.2), stroke(line([[tx * 0.3 + 3, ty * 0.3], [tx * 0.97 + 3, ty * 0.97]]), '#e8e8e8', 0.8),
    ol(circle(len * 0.085, -len * 0.14, len * 0.036), '#c9ccd2', 1), sh(circle(len * 0.085, -len * 0.14, len * 0.014), '#3a3a40'), stroke(line([[len * 0.085, -len * 0.14], [len * 0.135, -len * 0.12]]), '#3a3a40', 2), sh(circle(len * 0.138, -len * 0.118, 2.6), '#c8322a'),
  ];
}
/** Tackle box with a tray of lures; origin at base centre. */
export function tackleBox(s: number, col = '#c8522a'): Shape[] {
  const w = s, h = s * 0.42;
  return [
    ol(poly([[-w * 0.5, -h * 1.0], [w * 0.5, -h * 1.0], [w * 0.44, -h * 1.62], [-w * 0.44, -h * 1.62]]), shade(col, -0.16), 1.1),
    sh(rect(-w * 0.4, -h * 1.52, w * 0.24, h * 0.4, 2) + rect(-w * 0.12, -h * 1.52, w * 0.24, h * 0.4, 2) + rect(w * 0.16, -h * 1.52, w * 0.24, h * 0.4, 2), '#f4ead2'),
    sh(leaf(-w * 0.36, -h * 1.3, w * 0.16, h * 0.08, 0), '#f2c14e'), sh(circle(0, -h * 1.34, h * 0.1), '#c8322a'), sh(rect(-w * 0.012, -h * 1.5, w * 0.024, h * 0.14), '#fbf6ec'), sh(leaf(w * 0.2, -h * 1.26, w * 0.16, h * 0.07, -10), '#5ab0e8'),
    ol(rect(-w / 2, -h, w, h, 4), col, 1.2), sh(rect(-w / 2, -h * 0.55, w, h * 0.1), shade(col, -0.22)), hi(rect(-w * 0.44, -h * 0.92, w * 0.88, h * 0.12, 2), 0.2),
    ol(rect(-w * 0.09, -h * 0.84, w * 0.18, h * 0.3, 2), '#c9ccd2', 0.8), stroke(M(-w * 0.2, -h * 0.02) + Q(0, h * 0.16, w * 0.2, -h * 0.02), '#3a3a40', 2.6),
  ];
}
/** Landing net, hoop at the top; origin at the end of the handle. */
export function landingNet(len: number, col = '#b8824a'): Shape[] {
  const r = len * 0.2, cy = -len * 0.74;
  let mesh = '';
  for (let i = -3; i <= 3; i++) { mesh += line([[i * r * 0.26 - r * 0.2, cy - r * 0.9], [i * r * 0.26 + r * 0.3, cy + r * 1.0]]) + line([[i * r * 0.26 + r * 0.2, cy - r * 0.9], [i * r * 0.26 - r * 0.3, cy + r * 1.0]]); }
  return [
    ol(rect(-len * 0.022, -len * 0.5, len * 0.044, len * 0.5, 3), col, 1), sh(rect(-len * 0.026, -len * 0.16, len * 0.052, len * 0.14, 3), '#3a3a40'),
    sh(ellipse(0, cy, r * 0.9, r * 1.12), '#e8efe6', { opacity: 0.45 }), stroke(mesh, '#7a8a80', 0.8, { opacity: 0.9 }),
    stroke(ellipse(0, cy, r, r * 1.2), '#f4f4f0', len * 0.05), stroke(ellipse(0, cy, r, r * 1.2), col, len * 0.03), stroke(ellipse(0, cy, r * 1.07, r * 1.27), shade(col, -0.4), 0.8),
  ];
}
/** Dog curled up asleep, head to the left; origin at bottom centre, `s` = length. */
export function sleepingDog(s: number, col = '#c8914a'): Shape[] {
  const ear = shade(col, -0.32);
  return [
    stroke(M(s * 0.42, -s * 0.06) + Q(s * 0.56, -s * 0.02, s * 0.36, s * 0.0) + Q(s * 0.2, s * 0.0, s * 0.1, -s * 0.03), shade(col, 0.1), s * 0.06),
    ol(blob([[-s * 0.16, -s * 0.3], [s * 0.1, -s * 0.38], [s * 0.36, -s * 0.3], [s * 0.48, -s * 0.12], [s * 0.42, 0], [-s * 0.24, 0], [-s * 0.3, -s * 0.14]], 0.9), col, 1.2),
    sh(blob([[s * 0.0, -s * 0.34], [s * 0.2, -s * 0.36], [s * 0.3, -s * 0.28], [s * 0.1, -s * 0.24]], 0.9), shade(col, -0.14)), stroke(M(s * 0.2, -s * 0.02) + Q(s * 0.14, -s * 0.2, s * 0.32, -s * 0.24), shade(col, -0.25), 1.4),
    ol(ellipse(-s * 0.1, -s * 0.03, s * 0.12, s * 0.04), shade(col, 0.1), 0.8), ol(ellipse(-s * 0.36, -s * 0.03, s * 0.1, s * 0.035), shade(col, 0.1), 0.8),
    ol(blob([[-s * 0.2, -s * 0.2], [-s * 0.3, -s * 0.28], [-s * 0.44, -s * 0.22], [-s * 0.52, -s * 0.1], [-s * 0.46, -s * 0.04], [-s * 0.26, -s * 0.05]], 0.9), col, 1.2),
    sh(ellipse(-s * 0.46, -s * 0.09, s * 0.07, s * 0.045), '#f1dcc0'), sh(ellipse(-s * 0.515, -s * 0.105, s * 0.022, s * 0.018), INK),
    ol(M(-s * 0.24, -s * 0.26) + Q(-s * 0.12, -s * 0.24, -s * 0.16, -s * 0.06) + Q(-s * 0.26, -s * 0.08, -s * 0.3, -s * 0.24) + 'Z', ear, 0.8),
    stroke(M(-s * 0.41, -s * 0.17) + Q(-s * 0.38, -s * 0.15, -s * 0.35, -s * 0.17), INK, 1.4), sh(rect(-s * 0.2, -s * 0.06, s * 0.1, s * 0.03, 2), '#c8322a'),
  ];
}
/** Enamel mug, handle right; origin at base centre. */
export function enamelMug(s: number, col = '#f4ead2', rim = '#2f4a6a'): Shape[] {
  const w = s * 0.7, h = s * 0.66;
  return [
    stroke(M(w * 0.48, -h * 0.78) + Q(w * 1.0, -h * 0.74, w * 0.5, -h * 0.24), rim, 4.4),
    ol(rect(-w / 2, -h, w, h, 3), col, 1, -0.3), sh(ellipse(0, -h, w / 2, h * 0.1), '#5a3a22'), stroke(ellipse(0, -h, w / 2, h * 0.1), rim, 2.2),
    sh(rect(-w / 2, -h * 0.1, w, h * 0.1, 2), rim), sh(poly([[-w * 0.2, -h * 0.34], [0, -h * 0.66], [w * 0.2, -h * 0.34]]) + rect(-w * 0.04, -h * 0.34, w * 0.08, h * 0.12), '#4f7d4a'),
  ];
}
/** Book lying open; origin at centre. */
export function openBook(s: number, col = '#8c2b2b'): Shape[] {
  const w = s, h = s * 0.56;
  let lines = '';
  for (let i = 0; i < 5; i++) lines += line([[-w * 0.4, -h * 0.26 + i * h * 0.12], [-w * 0.08, -h * 0.3 + i * h * 0.12]]) + line([[w * 0.08, -h * 0.3 + i * h * 0.12], [w * 0.4, -h * 0.26 + i * h * 0.12]]);
  return [
    ol(M(-w / 2, -h * 0.36) + L(w / 2, -h * 0.36) + L(w / 2, h * 0.5) + L(-w / 2, h * 0.5) + 'Z', col, 1),
    ol(M(0, -h * 0.4) + Q(-w * 0.24, -h * 0.56, -w * 0.46, -h * 0.4) + L(-w * 0.46, h * 0.4) + Q(-w * 0.24, h * 0.26, 0, h * 0.42) + 'Z', '#fbf6ec', 0.8, -0.25),
    ol(M(0, -h * 0.4) + Q(w * 0.24, -h * 0.56, w * 0.46, -h * 0.4) + L(w * 0.46, h * 0.4) + Q(w * 0.24, h * 0.26, 0, h * 0.42) + 'Z', '#f4ecd8', 0.8, -0.25),
    stroke(lines, '#9a9488', 1), sh(poly([[w * 0.03, -h * 0.4], [w * 0.09, -h * 0.42], [w * 0.09, h * 0.62], [w * 0.06, h * 0.54], [w * 0.03, h * 0.62]]), '#d9a43a'),
  ];
}
/** Wind chime; origin at the hanging point. */
export function windChime(h: number, col = '#c9ccd2'): Shape[] {
  const out: Shape[] = [stroke(line([[0, 0], [0, h * 0.16]]), '#6b5b4b', 1.4), ol(ellipse(0, h * 0.2, h * 0.22, h * 0.05), '#b8824a', 1)];
  const lens = [0.46, 0.6, 0.52, 0.66, 0.42];
  lens.forEach((l, i) => {
    const x = (-0.17 + i * 0.085) * h;
    out.push(stroke(line([[x, h * 0.22], [x, h * 0.3]]), '#6b5b4b', 1), ol(rect(x - h * 0.022, h * 0.3, h * 0.044, h * l, 2), i % 2 ? col : shade(col, 0.2), 0.8), hi(rect(x - h * 0.014, h * 0.32, h * 0.012, h * l * 0.8), 0.5));
  });
  out.push(stroke(line([[0, h * 0.22], [0, h * 0.84]]), '#6b5b4b', 1), ol(circle(0, h * 0.6, h * 0.04), '#b8824a', 0.8), ol(poly([[-h * 0.06, h * 0.84], [h * 0.06, h * 0.84], [0, h * 1.0]]), '#3f8fa3', 0.8));
  return out;
}
/** Wicker fishing creel with a leather strap; origin at base centre. */
export function creel(s: number, col = '#c99a5a'): Shape[] {
  const w = s, h = s * 0.62;
  let weave = '';
  for (let r = 1; r < 5; r++) weave += M(-w * 0.44, -h * 0.9 + r * h * 0.18) + Q(0, -h * 0.84 + r * h * 0.18, w * 0.44, -h * 0.9 + r * h * 0.18);
  let ribs = '';
  for (let i = -3; i <= 3; i++) ribs += line([[i * w * 0.12, -h * 0.92], [i * w * 0.11, -h * 0.02]]);
  return [
    stroke(M(-w * 0.4, -h * 0.9) + Q(-w * 0.5, -h * 2.0, 0, -h * 2.0) + Q(w * 0.5, -h * 2.0, w * 0.4, -h * 0.9), '#6b3f22', 3.4),
    ol(M(-w * 0.46, -h * 0.94) + L(w * 0.46, -h * 0.94) + Q(w * 0.5, -h * 0.1, w * 0.36, 0) + L(-w * 0.36, 0) + Q(-w * 0.5, -h * 0.1, -w * 0.46, -h * 0.94) + 'Z', col, 1.2),
    stroke(weave, shade(col, -0.25), 1.2), stroke(ribs, shade(col, 0.2), 1.2, { opacity: 0.7 }),
    ol(M(-w * 0.5, -h * 0.9) + Q(0, -h * 1.24, w * 0.5, -h * 0.9) + L(w * 0.5, -h * 0.8) + L(-w * 0.5, -h * 0.8) + 'Z', shade(col, -0.1), 1), sh(rect(-w * 0.1, -h * 1.04, w * 0.2, h * 0.1, 2), '#3a2a22'),
    ol(rect(-w * 0.06, -h * 0.86, w * 0.12, h * 0.34, 2), '#6b3f22', 0.8), sh(rect(-w * 0.04, -h * 0.66, w * 0.08, h * 0.08, 1), BRASS),
  ];
}
/** Red-and-white fishing float; origin at centre. */
export function bobber(s: number): Shape[] {
  const r = s * 0.36;
  return [
    stroke(line([[0, -r * 1.5], [0, r * 1.4]]), '#3a3a40', 2), ol(circle(0, 0, r), '#fbf6ec', 1, -0.3), sh(sector(0, 0, r, 180, 360), '#d2322a'),
    stroke(line([[-r, 0], [r, 0]]), '#3a3a40', 1), hi(ellipse(-r * 0.36, -r * 0.44, r * 0.2, r * 0.3, 30), 0.5), sh(rect(-r * 0.14, -r * 1.3, r * 0.28, r * 0.34, 1), '#d2322a'),
  ];
}
/** Lattice-topped cherry pie in a dish; origin at base centre. */
export function pie(s: number): Shape[] {
  const w = s, h = s * 0.3;
  let lat = '';
  for (let i = -3; i <= 3; i++) lat += line([[i * w * 0.11 - w * 0.07, -h * 1.02], [i * w * 0.11 + w * 0.07, -h * 0.56]]) + line([[i * w * 0.11 + w * 0.07, -h * 1.02], [i * w * 0.11 - w * 0.07, -h * 0.56]]);
  let cr = '';
  for (let i = 0; i < 9; i++) cr += circle(-w * 0.44 + i * w * 0.11, -h * 0.56, w * 0.06);
  return [
    ol(poly([[-w * 0.46, -h * 0.5], [w * 0.46, -h * 0.5], [w * 0.36, 0], [-w * 0.36, 0]]), '#9ab8c4', 1),
    ol(M(-w * 0.44, -h * 0.56) + Q(0, -h * 1.5, w * 0.44, -h * 0.56) + 'Z', '#b8283a', 1), stroke(lat, '#e2b060', w * 0.045), stroke(lat, '#f1cc86', w * 0.02),
    ol(cr, '#e2b060', 0.8, -0.25), stroke(M(-w * 0.1, -h * 1.2) + Q(-w * 0.16, -h * 1.6, -w * 0.06, -h * 1.9) + M(w * 0.1, -h * 1.2) + Q(w * 0.04, -h * 1.6, w * 0.14, -h * 1.9), '#ffffff', 2, { opacity: 0.5 }),
  ];
}
/** Banjo, pot at the bottom; origin at the centre of the pot. */
export function banjo(len: number): Shape[] {
  const r = len * 0.17;
  let frets = '';
  for (let i = 0; i < 7; i++) frets += line([[-len * 0.018, -r - i * len * 0.075 - 8], [len * 0.018, -r - i * len * 0.075 - 8]]);
  return [
    ol(rect(-len * 0.022, -len * 0.72, len * 0.044, len * 0.6, 2), '#6b3f22', 1), stroke(frets, '#d9c9a8', 1),
    ol(poly([[-len * 0.036, -len * 0.82], [len * 0.036, -len * 0.82], [len * 0.026, -len * 0.7], [-len * 0.026, -len * 0.7]]), '#4a2c18', 1),
    sh(circle(-len * 0.05, -len * 0.79, 3) + circle(len * 0.05, -len * 0.79, 3) + circle(-len * 0.05, -len * 0.74, 3) + circle(len * 0.05, -len * 0.74, 3), '#c9ccd2'),
    ol(circle(0, 0, r), '#c9ccd2', 1.4), ol(circle(0, 0, r * 0.86), '#f6efdc', 1, -0.2), stroke(circle(0, 0, r * 0.62), '#e2d6b8', 1),
    sh(rect(-r * 0.3, r * 0.3, r * 0.6, r * 0.09, 1), '#4a2c18'), stroke(line([[-len * 0.01, -len * 0.7], [-r * 0.1, r * 0.9]]) + line([[0, -len * 0.7], [0, r * 0.9]]) + line([[len * 0.01, -len * 0.7], [r * 0.1, r * 0.9]]), '#8a8e96', 0.8),
    sh(rect(-r * 0.16, r * 0.84, r * 0.32, r * 0.14, 1), '#8a8e96'),
  ];
}
/** Ball of yarn with two knitting needles; origin at centre. */
export function yarnBall(r: number, col = '#c8527a'): Shape[] {
  let a = '', b = '';
  for (let i = -2; i <= 2; i++) { a += M(-r * 0.9, i * r * 0.3) + Q(0, i * r * 0.3 - r * 0.5, r * 0.9, i * r * 0.26); b += M(i * r * 0.3, -r * 0.9) + Q(i * r * 0.3 + r * 0.44, 0, i * r * 0.24, r * 0.9); }
  return [
    stroke(line([[-r * 1.1, r * 0.9], [r * 0.9, -r * 1.3]]) + line([[-r * 0.5, r * 1.1], [r * 1.3, -r * 0.9]]), '#d9c9a8', 2.6), sh(circle(r * 0.9, -r * 1.3, 3) + circle(r * 1.3, -r * 0.9, 3), '#8a6a4a'),
    ol(circle(0, 0, r), col, 1.2), stroke(a, shade(col, -0.25), 1.2), stroke(b, shade(col, 0.3), 1.2),
    stroke(M(r * 0.6, r * 0.7) + Q(r * 1.3, r * 1.2, r * 1.5, r * 0.6) + Q(r * 1.7, r * 0.2, r * 2.0, r * 0.9), col, 2),
  ];
}
/** Wooden rocking chair facing left in three-quarter view; origin on the floor under the seat, `s` = seat width. */
export function rockingChair(s: number, col = '#9a6238', cushion = '#c8522a'): Shape[] {
  const dk = shade(col, -0.25), lt = shade(col, 0.12), t = s * 0.06;
  const out: Shape[] = [];
  // far rocker and legs
  out.push(stroke(M(-s * 0.5, -s * 0.12) + Q(s * 0.1, s * 0.04, s * 0.72, -s * 0.2), dk, t), stroke(line([[-s * 0.26, -s * 0.1], [-s * 0.26, -s * 0.56]]) + line([[s * 0.44, -s * 0.12], [s * 0.44, -s * 0.6]]), dk, t));
  // back: posts, slats, top rail
  const bl: Pt = [s * 0.22, -s * 0.56], br: Pt = [s * 0.46, -s * 0.5], tl: Pt = [s * 0.38, -s * 1.32], tr: Pt = [s * 0.62, -s * 1.26];
  out.push(stroke(line([bl, tl]), dk, t));
  for (let i = 1; i < 5; i++) { const k = i / 5; out.push(stroke(line([[bl[0] + (br[0] - bl[0]) * k, bl[1] + (br[1] - bl[1]) * k - s * 0.04], [tl[0] + (tr[0] - tl[0]) * k, tl[1] + (tr[1] - tl[1]) * k + s * 0.04]]), i % 2 ? col : lt, t * 0.8)); }
  out.push(stroke(M(tl[0] - s * 0.02, tl[1]) + Q((tl[0] + tr[0]) / 2, tl[1] - s * 0.09, tr[0] + s * 0.02, tr[1]), lt, t * 1.5), stroke(line([[bl[0], bl[1] - s * 0.1], [br[0], br[1] - s * 0.1]]), col, t));
  // far arm
  out.push(stroke(line([[s * 0.28, -s * 0.86], [-s * 0.3, -s * 0.84]]), dk, t), stroke(line([[-s * 0.26, -s * 0.84], [-s * 0.26, -s * 0.56]]), dk, t * 0.8));
  // seat
  out.push(ol(poly([[-s * 0.34, -s * 0.56], [s * 0.26, -s * 0.58], [s * 0.5, -s * 0.48], [-s * 0.5, -s * 0.44]]), col, 1.2), sh(poly([[-s * 0.5, -s * 0.44], [s * 0.5, -s * 0.48], [s * 0.5, -s * 0.42], [-s * 0.5, -s * 0.38]]), dk));
  out.push(ol(blob([[-s * 0.3, -s * 0.56], [s * 0.2, -s * 0.6], [s * 0.42, -s * 0.5], [0, -s * 0.46], [-s * 0.44, -s * 0.47]], 0.8), cushion, 1), stroke(line([[-s * 0.2, -s * 0.53], [s * 0.2, -s * 0.55]]) + line([[-s * 0.3, -s * 0.49], [s * 0.3, -s * 0.51]]), shade(cushion, 0.3), 1.2));
  // near legs, post, rocker
  out.push(stroke(line([br, tr]), col, t * 1.1), stroke(line([[-s * 0.44, -s * 0.03], [-s * 0.44, -s * 0.42]]) + line([[s * 0.48, -s * 0.05], [s * 0.47, -s * 0.46]]), col, t * 1.1));
  out.push(stroke(M(-s * 0.72, -s * 0.06) + Q(-s * 0.04, s * 0.1, s * 0.76, -s * 0.14), lt, t * 1.2), stroke(M(-s * 0.72, -s * 0.03) + Q(-s * 0.04, s * 0.13, s * 0.76, -s * 0.11), dk, 1.4));
  // near arm
  out.push(stroke(line([[-s * 0.44, -s * 0.76], [-s * 0.44, -s * 0.44]]), col, t), stroke(line([[s * 0.52, -s * 0.8], [-s * 0.52, -s * 0.76]]), lt, t * 1.3), sh(circle(-s * 0.52, -s * 0.76, t * 0.8), lt));
  return out;
}

export { place, shade, mix, rng, xf, sh, stroke, rect, ellipse, circle, poly, line, curve, blob, leaf, petal, star, sector };
