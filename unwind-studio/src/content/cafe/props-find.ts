// Shared props for the Coffee & Good Company hidden-object scenes. Every prop is
// drawn around the origin and returns Shape[]; position it with place(). Unless a
// comment says otherwise the origin is the bottom centre (the prop stands on y = 0).
import { rect, ellipse, circle, poly, line, curve, blob, leaf, petal, star, sector, sh, stroke, shade, mix, rng, xf, type Rng } from '../../art/kit';
import type { Shape } from '../../art/types';
import { M, L, Q, CB, ol, shadow } from '../kitchen/props-find';

export type Pt = [number, number];
const hl = (d: string, op = 0.5): Shape => sh(d, '#ffffff', { opacity: op });

export const K = {
  espresso: '#4a2c1c', coffee: '#7a4a2a', crema: '#c98d55', foam: '#f4e6cf', milk: '#fbf6ec',
  chrome: '#b9c2c8', chromeDk: '#6f7a82', chromeLt: '#eef2f4', ink: '#2b2622', slate: '#2f3533', chalk: '#f1eee4',
  red: '#c8473a', redDk: '#8f2f26', mustard: '#d9a53a', teal: '#3f7f7a', tealDk: '#2b5e5a', sage: '#93ab84', green: '#5c8a4e', greenDk: '#3d6a3a',
  rose: '#d98a7a', plum: '#7a4a62', navy: '#34495e', cream: '#f5ead2', creamDk: '#e2d2b2', wood: '#9a6a40', woodDk: '#6a4428', woodLt: '#c69462',
  brick: '#b0583e', brickDk: '#8a412e', glow: '#ffe3a0', amber: '#f2b250', terracotta: '#c56a44',
};

// =====================================================================
// textures
// =====================================================================
/** Running-bond brick wall in mixed tones. */
export function bricks(x: number, y: number, w: number, h: number, bh: number, cols: string[], mortar: string, seed: number): Shape[] {
  const g = rng(seed);
  const bw = bh * 2.6;
  const by = cols.map(() => '');
  let hi = '';
  for (let r = 0, ty = y; ty < y + h; ty += bh, r++) {
    for (let tx = x - (r % 2 ? bw / 2 : 0); tx < x + w; tx += bw) {
      const x0 = Math.max(x, tx + 1.5), x1 = Math.min(x + w, tx + bw - 1.5), y1 = Math.min(y + h, ty + bh - 1.5);
      if (x1 - x0 < 2 || y1 - ty < 2) continue;
      by[g.int(0, cols.length - 1)] += rect(x0, ty + 1.5, x1 - x0, y1 - ty - 1.5);
      if (g.next() < 0.25) hi += rect(x0 + 2, ty + 3, (x1 - x0) * g.range(0.2, 0.6), 2);
    }
  }
  return [sh(rect(x, y, w, h), mortar), ...by.map((d, i) => sh(d, cols[i])).filter((p) => p.d), sh(hi, '#ffffff', { opacity: 0.14 })].filter((p) => p.d);
}

/** Herringbone-ish wooden floor band in perspective-free strips (y0 down to y1). */
export function woodFloor(y0: number, y1: number, W: number, cols: string[], seed: number): Shape[] {
  const g = rng(seed);
  const by = cols.map(() => '');
  let seams = '';
  let y = y0, rowH = 18;
  while (y < y1) {
    const h = Math.min(rowH, y1 - y);
    let x = -g.range(0, 160);
    while (x < W) { const len = g.range(100, 220) * (rowH / 30 + 0.5); by[g.int(0, cols.length - 1)] += rect(Math.max(0, x), y, Math.min(W, x + len) - Math.max(0, x), h); if (x > 0) seams += line([[x, y], [x, y + h]]); x += len; }
    seams += line([[0, y], [W, y]]);
    y += h; rowH *= 1.06;
  }
  return [sh(rect(0, y0, W, y1 - y0), cols[0]), ...by.map((d, i) => sh(d, cols[i])).filter((p) => p.d), stroke(seams, '#3b2414', 1.4, { opacity: 0.35 })];
}

/** Sagging string of fairy lights through anchor points, bulbs every `gap` units. */
export function fairyLights(pts: Pt[], sag: number, gap: number, cols: string[], seed: number, r = 5): Shape[] {
  const g = rng(seed);
  let wire = '';
  const bulbs: Pt[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, ay] = pts[i], [bx, by] = pts[i + 1];
    const mx = (ax + bx) / 2, my = (ay + by) / 2 + sag;
    wire += M(ax, ay) + Q(mx, my, bx, by);
    const n = Math.max(2, Math.round(Math.hypot(bx - ax, by - ay) / gap));
    for (let k = i ? 1 : 0; k <= n; k++) {
      const t = k / n;
      bulbs.push([(1 - t) * (1 - t) * ax + 2 * t * (1 - t) * mx + t * t * bx, (1 - t) * (1 - t) * ay + 2 * t * (1 - t) * my + t * t * by]);
    }
  }
  const glow = cols.map(() => ''), core = cols.map(() => '');
  let caps = '';
  bulbs.forEach(([x, y], i) => { const c = (i + g.int(0, 1)) % cols.length; glow[c] += circle(x, y + r * 1.6, r * 3); core[c] += ellipse(x, y + r * 1.6, r * 0.8, r * 1.2); caps += rect(x - r * 0.45, y, r * 0.9, r * 0.7); });
  return [
    ...glow.map((d, i) => sh(d, cols[i], { opacity: 0.2 })).filter((p) => p.d),
    stroke(wire, '#3a4a32', 1.6),
    sh(caps, '#3a4a32'),
    ...core.map((d, i) => sh(d, cols[i])).filter((p) => p.d),
  ];
}

// =====================================================================
// coffee bar
// =====================================================================
/** Two-group espresso machine, width w, origin bottom centre. */
export function espressoMachine(w: number, col = K.red): Shape[] {
  const h = w * 0.62, out: Shape[] = [];
  const top = -h;
  // cup warmer rail and cups on top
  out.push(sh(rect(-w * 0.46, top - 8, w * 0.92, 8, 2), K.chromeDk), stroke(line([[-w * 0.46, top - 16], [w * 0.46, top - 16]]), K.chrome, 3));
  for (let i = 0; i < 5; i++) {
    const cx = -w * 0.36 + i * w * 0.18;
    out.push(ol(M(cx - w * 0.06, top - 8) + L(cx - w * 0.045, top - 8 - w * 0.08) + L(cx + w * 0.045, top - 8 - w * 0.08) + L(cx + w * 0.06, top - 8) + 'Z', i % 2 ? '#fbf6ec' : '#f0e6d4', 0.8, -0.25));
    if (i % 2 === 0) out.push(ol(M(cx - w * 0.055, top - 8 - w * 0.08) + L(cx - w * 0.04, top - 8 - w * 0.15) + L(cx + w * 0.04, top - 8 - w * 0.15) + L(cx + w * 0.055, top - 8 - w * 0.08) + 'Z', '#fbf6ec', 0.8, -0.25));
  }
  // body
  out.push(ol(rect(-w / 2, top, w, h * 0.62, w * 0.04), col, 1.4, -0.3));
  out.push(sh(rect(-w / 2, top, w, h * 0.08, w * 0.04), shade(col, 0.2)), sh(rect(w * 0.36, top, w * 0.14, h * 0.62), shade(col, -0.18), { opacity: 0.6 }));
  out.push(ol(rect(-w * 0.4, top + h * 0.12, w * 0.8, h * 0.18, 4), K.chromeLt, 1, -0.35));
  // gauge and buttons
  out.push(ol(circle(0, top + h * 0.21, h * 0.075), '#fbf6ec', 1.2, -0.5), stroke(line([[0, top + h * 0.21], [h * 0.05, top + h * 0.17]]), K.red, 1.5));
  for (const s of [-1, 1]) out.push(sh(rect(s * w * 0.26 - 9, top + h * 0.17, 18, 10, 3), K.ink), sh(circle(s * w * 0.26, top + h * 0.22, 2.5), '#9ad28a'));
  // group heads with portafilters
  for (const s of [-1, 1]) {
    const gx = s * w * 0.22, gy = top + h * 0.62;
    out.push(ol(rect(gx - w * 0.08, gy, w * 0.16, h * 0.08, 3), K.chrome, 1, -0.4), ol(rect(gx - w * 0.06, gy + h * 0.08, w * 0.12, h * 0.07, 3), K.chromeDk, 1));
    out.push(ol(M(gx + w * 0.05, gy + h * 0.11) + L(gx + w * 0.2 * s + (s < 0 ? -w * 0.02 : w * 0.02), gy + h * 0.15) + L(gx + w * 0.2 * s, gy + h * 0.2) + L(gx + w * 0.05, gy + h * 0.15) + 'Z', K.ink, 0.8));
    // espresso shot glass below
    out.push(ol(rect(gx - w * 0.04, -h * 0.15 - w * 0.07, w * 0.08, w * 0.07, 2), '#e6eef0', 0.8, -0.3), sh(rect(gx - w * 0.035, -h * 0.15 - w * 0.045, w * 0.07, w * 0.042), K.espresso));
  }
  // steam wands
  out.push(stroke(M(-w * 0.48, top + h * 0.5) + L(-w * 0.56, top + h * 0.56) + L(-w * 0.56, -h * 0.25), K.chromeDk, 4), stroke(M(w * 0.48, top + h * 0.5) + L(w * 0.56, top + h * 0.56) + L(w * 0.56, -h * 0.3), K.chromeDk, 4));
  out.push(sh(circle(-w * 0.5, top + h * 0.34, 7) + circle(w * 0.5, top + h * 0.34, 7), K.ink));
  // drip tray
  out.push(ol(rect(-w * 0.44, -h * 0.15, w * 0.88, h * 0.15, 3), K.chrome, 1, -0.4));
  let grill = '';
  for (let i = 0; i < 16; i++) grill += line([[-w * 0.42 + i * w * 0.056, -h * 0.13], [-w * 0.42 + i * w * 0.056, -h * 0.03]]);
  out.push(stroke(grill, K.chromeDk, 1.4), hl(rect(-w * 0.46, top + 4, w * 0.04, h * 0.5, 2), 0.35));
  return out;
}

/** Burr grinder with a bean hopper, height s. */
export function grinder(s: number, col = '#3a3d40'): Shape[] {
  const g = rng(5);
  let beans = '';
  for (let i = 0; i < 22; i++) beans += ellipse(g.range(-s * 0.18, s * 0.18), -s * g.range(0.78, 0.97), s * 0.035, s * 0.024, g.range(0, 180));
  return [
    shadow(0, 0, s * 0.3, s * 0.04),
    ol(rect(-s * 0.24, -s * 0.08, s * 0.48, s * 0.08, 3), shade(col, -0.2), 1),
    ol(rect(-s * 0.16, -s * 0.62, s * 0.32, s * 0.56, 4), col, 1, -0.4),
    sh(rect(s * 0.06, -s * 0.62, s * 0.1, s * 0.56, 3), '#000000', { opacity: 0.2 }),
    ol(rect(-s * 0.13, -s * 0.36, s * 0.26, s * 0.22, 3), '#2a1d16', 0.8),
    sh(rect(-s * 0.1, -s * 0.26, s * 0.2, s * 0.1, 2), K.coffee),
    ol(circle(0, -s * 0.5, s * 0.07), K.chrome, 1, -0.4),
    sh(poly([[-s * 0.08, -s * 0.62], [s * 0.08, -s * 0.62], [s * 0.24, -s * 1.0], [-s * 0.24, -s * 1.0]]), '#d8e6ea', { opacity: 0.55 }),
    sh(beans, K.espresso),
    stroke(poly([[-s * 0.08, -s * 0.62], [s * 0.08, -s * 0.62], [s * 0.24, -s * 1.0], [-s * 0.24, -s * 1.0]]), '#8aa0a8', 1.2),
    hl(poly([[-s * 0.18, -s * 0.96], [-s * 0.12, -s * 0.96], [-s * 0.04, -s * 0.66], [-s * 0.07, -s * 0.66]]), 0.5),
    ol(rect(-s * 0.27, -s * 1.07, s * 0.54, s * 0.08, 4), col, 1, -0.4),
  ];
}

/** Steel milk pitcher, height s, spout to the left. */
export function milkPitcher(s: number): Shape[] {
  return [
    stroke(M(s * 0.26, -s * 0.8) + Q(s * 0.56, -s * 0.76, s * 0.5, -s * 0.46) + Q(s * 0.46, -s * 0.28, s * 0.3, -s * 0.24), K.chromeDk, s * 0.08),
    ol(M(-s * 0.36, -s * 0.98) + L(-s * 0.22, -s * 0.86) + L(s * 0.3, -s * 0.9) + L(s * 0.34, 0) + L(-s * 0.32, 0) + L(-s * 0.27, -s * 0.82) + 'Z', K.chrome, 1.2, -0.45),
    sh(rect(s * 0.1, -s * 0.86, s * 0.2, s * 0.84), K.chromeDk, { opacity: 0.35 }),
    hl(rect(-s * 0.2, -s * 0.8, s * 0.07, s * 0.74, 2), 0.7),
    sh(ellipse(0, -s * 0.89, s * 0.27, s * 0.05), K.milk),
  ];
}

/** Cappuccino with a heart of latte art on a saucer, about 2s wide. */
export function cappuccino(s: number, col = '#fbf6ec', band = K.teal): Shape[] {
  const cup = M(-s * 0.62, -s * 0.78) + L(s * 0.62, -s * 0.78) + Q(s * 0.6, -s * 0.12, 0, -s * 0.12) + Q(-s * 0.6, -s * 0.12, -s * 0.62, -s * 0.78) + 'Z';
  return [
    ol(ellipse(0, -s * 0.08, s * 0.98, s * 0.17), shade(col, -0.05), 1, -0.25),
    sh(ellipse(0, -s * 0.12, s * 0.56, s * 0.08), shade(col, -0.16)),
    stroke(M(s * 0.56, -s * 0.66) + Q(s * 0.95, -s * 0.66, s * 0.82, -s * 0.38) + Q(s * 0.74, -s * 0.24, s * 0.46, -s * 0.3), shade(col, -0.15), s * 0.11),
    ol(cup, col, 1, -0.25),
    sh(M(-s * 0.6, -s * 0.6) + L(s * 0.6, -s * 0.6) + L(s * 0.58, -s * 0.5) + L(-s * 0.58, -s * 0.5) + 'Z', band),
    sh(ellipse(0, -s * 0.78, s * 0.62, s * 0.15), shade(col, -0.08)),
    sh(ellipse(0, -s * 0.78, s * 0.55, s * 0.12), K.crema),
    sh(M(0, -s * 0.7) + Q(-s * 0.3, -s * 0.8, -s * 0.16, -s * 0.86) + Q(-s * 0.05, -s * 0.89, 0, -s * 0.82) + Q(s * 0.05, -s * 0.89, s * 0.16, -s * 0.86) + Q(s * 0.3, -s * 0.8, 0, -s * 0.7) + 'Z', K.foam),
    hl(ellipse(-s * 0.36, -s * 0.44, s * 0.06, s * 0.14), 0.45),
  ];
}

/** Takeaway cup with a sleeve and lid, height s. */
export function takeawayCup(s: number, col = '#fbf6ec', sleeve = '#b98552'): Shape[] {
  return [
    ol(poly([[-s * 0.3, -s * 0.86], [s * 0.3, -s * 0.86], [s * 0.22, 0], [-s * 0.22, 0]]), col, 1, -0.25),
    sh(poly([[s * 0.06, -s * 0.86], [s * 0.3, -s * 0.86], [s * 0.22, 0], [s * 0.04, 0]]), '#000000', { opacity: 0.08 }),
    ol(poly([[-s * 0.285, -s * 0.62], [s * 0.285, -s * 0.62], [s * 0.255, -s * 0.3], [-s * 0.255, -s * 0.3]]), sleeve, 0.8),
    sh(M(-s * 0.08, -s * 0.47) + Q(-s * 0.08, -s * 0.54, 0, -s * 0.5) + Q(s * 0.08, -s * 0.54, s * 0.08, -s * 0.47) + L(0, -s * 0.38) + 'Z', '#fbf3df', { opacity: 0.85 }),
    ol(rect(-s * 0.33, -s * 0.94, s * 0.66, s * 0.09, 3), '#3b3532', 1),
    ol(rect(-s * 0.26, -s * 1.0, s * 0.52, s * 0.07, 3), '#4f4844', 1),
    sh(rect(s * 0.05, -s * 0.99, s * 0.1, s * 0.03, 1), '#2a2522'),
  ];
}

/** Glass tip jar with coins and folded notes, height s. */
export function tipJar(s: number): Shape[] {
  const g = rng(19);
  let coins = '', notes = '';
  for (let i = 0; i < 9; i++) coins += ellipse(g.range(-s * 0.26, s * 0.26), -s * g.range(0.06, 0.3), s * 0.07, s * 0.035, g.range(-20, 20));
  for (let i = 0; i < 3; i++) notes += xf(rect(-s * 0.12, -s * 0.05, s * 0.24, s * 0.1, 1), { rot: g.range(-40, 40), x: g.range(-s * 0.15, s * 0.15), y: -s * g.range(0.35, 0.55) });
  return [
    shadow(0, 0, s * 0.36, s * 0.05),
    sh(rect(-s * 0.34, -s * 0.86, s * 0.68, s * 0.86, s * 0.1), '#dfeef0', { opacity: 0.55 }),
    sh(notes, '#9ac48a'), stroke(notes, '#5c8a4e', 0.8),
    sh(coins, '#d9b04a'), stroke(coins, '#a8832a', 0.8),
    stroke(rect(-s * 0.34, -s * 0.86, s * 0.68, s * 0.86, s * 0.1), '#8aa0a8', 1.4),
    ol(rect(-s * 0.37, -s * 0.94, s * 0.74, s * 0.1, 3), '#c9d0d5', 1, -0.4),
    hl(rect(-s * 0.27, -s * 0.78, s * 0.07, s * 0.66, 3), 0.6),
    // little heart tag on a string
    stroke(curve([[s * 0.3, -s * 0.9], [s * 0.42, -s * 0.8], [s * 0.4, -s * 0.66]]), '#7a5232', 1),
    ol(heart(s * 0.4, -s * 0.56, s * 0.14), K.red, 0.8),
  ];
}

/** Heart shape centred on (x, y). */
export function heart(x: number, y: number, r: number): string {
  return M(x, y + r) + CB(x - r * 1.4, y + r * 0.1, x - r * 0.9, y - r * 1.1, x, y - r * 0.45) + CB(x + r * 0.9, y - r * 1.1, x + r * 1.4, y + r * 0.1, x, y + r) + 'Z';
}

/** Muffin in a paper case, height s. */
export function muffin(s: number, top = '#c98a4a', dots = '#4a4a8a'): Shape[] {
  const g = rng(29);
  let d = '';
  for (let i = 0; i < 8; i++) d += circle(g.range(-s * 0.34, s * 0.34), -s * g.range(0.62, 0.92), s * 0.045);
  let pleats = '';
  for (let i = 1; i < 7; i++) pleats += line([[-s * 0.32 + i * s * 0.09, -s * 0.5], [-s * 0.24 + i * s * 0.068, 0]]);
  return [
    ol(poly([[-s * 0.34, -s * 0.5], [s * 0.34, -s * 0.5], [s * 0.24, 0], [-s * 0.24, 0]]), '#f0e2c4', 1, -0.3),
    stroke(pleats, '#c9b894', 1),
    ol(blob([[-s * 0.44, -s * 0.5], [-s * 0.4, -s * 0.8], [-s * 0.16, -s * 1.0], [s * 0.16, -s * 1.0], [s * 0.4, -s * 0.8], [s * 0.44, -s * 0.5]], 0.9), top, 1, -0.3),
    sh(d, dots),
    hl(ellipse(-s * 0.16, -s * 0.86, s * 0.12, s * 0.05, -20), 0.35),
  ];
}

/** Round cookie seen from above, radius r. */
export function cookie(r: number, col = '#d4a062'): Shape[] {
  const g = rng(Math.round(r * 13));
  let ch = '';
  for (let i = 0; i < 7; i++) { const a = g.range(0, Math.PI * 2), rr = g.range(0, r * 0.7); ch += ellipse(Math.cos(a) * rr, Math.sin(a) * rr, r * 0.12, r * 0.09, g.range(0, 90)); }
  return [ol(circle(0, 0, r), col, 1, -0.3), sh(ch, '#5a3420')];
}

/** Glass pastry display case drawn in two halves so pastries sit between: back and front. Origin top-left. */
export function pastryCaseBack(w: number, h: number, shelves: number[]): Shape[] {
  const out: Shape[] = [sh(rect(0, 0, w, h), '#f3ead6'), sh(rect(0, 0, w, h * 0.06), '#ffffff', { opacity: 0.4 })];
  for (const y of shelves) out.push(sh(rect(4, y, w - 8, 5), '#e8f2f4'), sh(rect(4, y + 5, w - 8, 3), '#000000', { opacity: 0.08 }));
  return out;
}
export function pastryCaseFront(w: number, h: number, col = K.woodDk): Shape[] {
  return [
    sh(rect(0, 0, w, h), '#cfe6ea', { opacity: 0.18 }),
    hl(poly([[w * 0.06, 6], [w * 0.16, 6], [w * 0.04, h - 6], [w * -0.0, h - 6]]), 0.25),
    hl(poly([[w * 0.6, 6], [w * 0.64, 6], [w * 0.52, h - 6], [w * 0.48, h - 6]]), 0.22),
    stroke(rect(0, 0, w, h, 3), K.chromeDk, 3),
    sh(rect(-6, -8, w + 12, 10, 3), col),
  ];
}

/** Chalkboard menu with chalk scribbles and doodles, origin top-left. */
export function chalkboard(w: number, h: number, seed: number, frame = K.wood): Shape[] {
  const g = rng(seed);
  const out: Shape[] = [ol(rect(0, 0, w, h, 4), frame, 1.4, -0.35), sh(rect(10, 10, w - 20, h - 20, 2), K.slate), sh(rect(10, 10, w - 20, h - 20, 2), '#ffffff', { opacity: 0.03 })];
  let heads = '', items = '', dots = '', prices = '', smudge = '';
  const cols = 2, cw = (w - 40) / cols;
  for (let c = 0; c < cols; c++) {
    const x0 = 22 + c * cw;
    let y = 30;
    for (let sec = 0; sec < 2 && y < h - 40; sec++) {
      let hd = M(x0 + cw * 0.15, y);
      for (let k = 1; k <= 8; k++) hd += L(x0 + cw * 0.15 + (k * cw * 0.5) / 8, y + (k % 2 ? -5 : 4));
      heads += hd;
      y += 22;
      const n = g.int(3, 4);
      for (let i = 0; i < n && y < h - 22; i++) {
        const len = cw * g.range(0.35, 0.55);
        let it = M(x0, y);
        for (let k = 1; k <= 10; k++) it += L(x0 + (k * len) / 10, y + (k % 2 ? -2.5 : 2));
        items += it;
        for (let k = 0; k < 4; k++) dots += circle(x0 + len + 6 + k * 6, y + 1, 1);
        prices += M(x0 + cw - 30, y - 3) + L(x0 + cw - 24, y + 3) + L(x0 + cw - 18, y - 3) + L(x0 + cw - 12, y + 3);
        y += 17;
      }
      y += 12;
    }
  }
  for (let i = 0; i < 5; i++) smudge += ellipse(g.range(20, w - 20), g.range(20, h - 20), g.range(14, 30), g.range(6, 12), g.range(-20, 20));
  out.push(sh(smudge, '#ffffff', { opacity: 0.05 }), stroke(heads, '#f3d77a', 2.4), stroke(items, K.chalk, 1.5, { opacity: 0.9 }), sh(dots, K.chalk, { opacity: 0.6 }), stroke(prices, '#f2a7a0', 1.6));
  // doodles: a steaming cup and a little leaf garland along the bottom
  const cx = w * 0.82, cy = h - 34;
  out.push(stroke(M(cx - 14, cy - 18) + L(cx - 11, cy) + L(cx + 11, cy) + L(cx + 14, cy - 18) + 'Z' + M(cx + 13, cy - 14) + Q(cx + 24, cy - 12, cx + 12, cy - 5), K.chalk, 1.8), stroke(curve([[cx - 4, cy - 24], [cx - 8, cy - 32], [cx - 3, cy - 40]]) + curve([[cx + 4, cy - 24], [cx, cy - 32], [cx + 5, cy - 40]]), K.chalk, 1.4, { opacity: 0.8 }));
  let lv = '';
  for (let i = 0; i < 7; i++) lv += leaf(24 + i * 16, h - 26 + (i % 2 ? -3 : 3), 11, 4, i % 2 ? -30 : 30);
  out.push(stroke(curve([[22, h - 26], [70, h - 22], [130, h - 28]]), '#9cc48a', 1.2), sh(lv, '#9cc48a', { opacity: 0.85 }));
  return out;
}

/** Bag of coffee beans with a folded top and a bean label, height s. */
export function coffeeBag(s: number, col = '#c9a46a', label = K.cream): Shape[] {
  return [
    ol(M(-s * 0.3, 0) + L(-s * 0.32, -s * 0.8) + L(-s * 0.26, -s * 0.94) + L(s * 0.26, -s * 0.94) + L(s * 0.32, -s * 0.8) + L(s * 0.3, 0) + 'Z', col, 1, -0.3),
    sh(rect(-s * 0.32, -s * 0.94, s * 0.64, s * 0.1), shade(col, -0.15)),
    stroke(line([[-s * 0.3, -s * 0.86], [s * 0.3, -s * 0.86]]), shade(col, -0.3), 1),
    ol(rect(-s * 0.2, -s * 0.62, s * 0.4, s * 0.34, 3), label, 0.8, -0.25),
    sh(ellipse(0, -s * 0.45, s * 0.07, s * 0.1, 20), K.coffee), stroke(curve([[-s * 0.02, -s * 0.54], [s * 0.02, -s * 0.45], [-s * 0.01, -s * 0.36]]), label, 1),
    sh(circle(0, -s * 0.72, s * 0.03), shade(col, -0.35)),
    sh(rect(s * 0.12, -s * 0.8, s * 0.16, s * 0.78), '#000000', { opacity: 0.08 }),
  ];
}

/** Flat paper-back book lying at an angle; origin centre. */
export function paperback(w: number, col: string, page = '#f6efdc'): Shape[] {
  const h = w * 0.68;
  return [
    sh(rect(-w / 2 + 3, -h / 2 + 3, w, h, 2), '#000000', { opacity: 0.12 }),
    sh(rect(-w / 2, -h / 2 + h * 0.84, w, h * 0.16, 2), page),
    ol(rect(-w / 2, -h / 2, w, h * 0.86, 2), col, 1, -0.3),
    sh(rect(-w / 2, -h / 2, w * 0.1, h * 0.86), shade(col, -0.2)),
    ol(rect(-w * 0.2, -h * 0.28, w * 0.5, h * 0.3, 2), shade(col, 0.55), 0.6),
    stroke(line([[-w * 0.12, -h * 0.17], [w * 0.22, -h * 0.17]]) + line([[-w * 0.08, -h * 0.07], [w * 0.18, -h * 0.07]]), shade(col, -0.25), 1.2),
  ];
}

/** Folded newspaper lying flat; origin centre. */
export function newspaper(w: number): Shape[] {
  const h = w * 0.62;
  let cols = '';
  for (let c = 0; c < 3; c++) for (let r = 0; r < 5; r++) cols += line([[-w * 0.42 + c * w * 0.29, -h * 0.08 + r * h * 0.09], [-w * 0.42 + c * w * 0.29 + w * 0.24, -h * 0.08 + r * h * 0.09]]);
  return [
    sh(rect(-w / 2 + 3, -h / 2 + 3, w, h, 1), '#000000', { opacity: 0.12 }),
    ol(rect(-w / 2, -h / 2, w, h, 1), '#ece6d6', 1, -0.3),
    sh(rect(-w * 0.42, -h * 0.4, w * 0.84, h * 0.13), '#3b3532', { opacity: 0.85 }),
    sh(rect(-w * 0.42, -h * 0.22, w * 0.36, h * 0.09), '#8a9aa0'),
    stroke(cols, '#8a847a', 1.1),
    stroke(line([[0, -h / 2], [0, h / 2]]), '#c9c0aa', 1.4),
  ];
}

/** Reading glasses, folded, origin centre. */
export function readingGlasses(s: number, col = '#3b2f2a'): Shape[] {
  return [
    stroke(M(-s * 0.48, -s * 0.02) + L(-s * 0.2, s * 0.14) + M(s * 0.48, -s * 0.02) + L(s * 0.2, s * 0.14), col, s * 0.04),
    sh(ellipse(-s * 0.24, 0, s * 0.2, s * 0.15) + ellipse(s * 0.24, 0, s * 0.2, s * 0.15), '#cfe3ea', { opacity: 0.6 }),
    stroke(ellipse(-s * 0.24, 0, s * 0.2, s * 0.15) + ellipse(s * 0.24, 0, s * 0.2, s * 0.15), col, s * 0.05),
    stroke(M(-s * 0.05, -s * 0.03) + Q(0, -s * 0.09, s * 0.05, -s * 0.03), col, s * 0.04),
    hl(ellipse(-s * 0.3, -s * 0.05, s * 0.06, s * 0.03, -20), 0.7), hl(ellipse(s * 0.18, -s * 0.05, s * 0.06, s * 0.03, -20), 0.7),
  ];
}

// =====================================================================
// furniture
// =====================================================================
/** Upholstered armchair seen from the front, width w. pattern 0 plain, 1 stripes, 2 dots, 3 buttons. */
export function armchair(w: number, col: string, pattern = 0, legs = K.woodDk): Shape[] {
  const h = w * 0.95;
  const dk = shade(col, -0.18), lt = shade(col, 0.14);
  const out: Shape[] = [shadow(0, 0, w * 0.52, w * 0.05)];
  out.push(sh(poly([[-w * 0.36, -w * 0.1], [-w * 0.33, 0], [-w * 0.3, 0], [-w * 0.3, -w * 0.1]]) + poly([[w * 0.36, -w * 0.1], [w * 0.33, 0], [w * 0.3, 0], [w * 0.3, -w * 0.1]]), legs));
  const back = blob([[-w * 0.38, -h * 0.4], [-w * 0.4, -h * 0.82], [-w * 0.2, -h], [w * 0.2, -h], [w * 0.4, -h * 0.82], [w * 0.38, -h * 0.4]], 0.7);
  out.push(ol(back, col, 1.2, -0.3));
  const inner = blob([[-w * 0.3, -h * 0.4], [-w * 0.3, -h * 0.78], [-w * 0.15, -h * 0.9], [w * 0.15, -h * 0.9], [w * 0.3, -h * 0.78], [w * 0.3, -h * 0.4]], 0.7);
  out.push(sh(inner, lt));
  if (pattern === 1) { let st = ''; for (let i = -3; i <= 3; i++) st += rect(i * w * 0.08 - w * 0.015, -h * 0.88, w * 0.03, h * 0.46); out.push(sh(st, dk, { opacity: 0.55 })); }
  if (pattern === 2) { let d = ''; for (let r = 0; r < 5; r++) for (let c = -3; c <= 3; c++) d += circle(c * w * 0.075 + (r % 2 ? w * 0.037 : 0), -h * 0.48 - r * h * 0.085, w * 0.012); out.push(sh(d, '#fbf3df', { opacity: 0.8 })); }
  if (pattern === 3) { let d = '', t = ''; for (let r = 0; r < 3; r++) for (let c = -1; c <= 1; c++) { const x = c * w * 0.12, y = -h * 0.55 - r * h * 0.11; d += circle(x, y, w * 0.012); t += line([[x - w * 0.05, y - h * 0.05], [x, y]]) + line([[x + w * 0.05, y - h * 0.05], [x, y]]); } out.push(stroke(t, dk, 1), sh(d, dk)); }
  // seat cushion
  out.push(ol(rect(-w * 0.34, -h * 0.46, w * 0.68, h * 0.16, w * 0.05), lt, 1, -0.3));
  out.push(ol(rect(-w * 0.38, -h * 0.32, w * 0.76, h * 0.22, w * 0.03), col, 1, -0.3));
  // arms
  for (const s of [-1, 1]) {
    out.push(ol(rect(s * w * 0.4 - w * 0.1, -h * 0.62, w * 0.2, h * 0.52, w * 0.06), col, 1.2, -0.3));
    out.push(ol(ellipse(s * w * 0.4, -h * 0.6, w * 0.105, w * 0.06), lt, 1, -0.3));
  }
  out.push(sh(rect(-w * 0.5, -h * 0.12, w, h * 0.04), dk));
  return out;
}

/** Bar / wooden stool, height h. */
export function stool(h: number, col = K.wood, seat = K.woodDk): Shape[] {
  const w = h * 0.5;
  return [
    shadow(0, 0, w * 0.6, h * 0.03),
    stroke(line([[-w * 0.3, -h * 0.92], [-w * 0.45, 0]]) + line([[w * 0.3, -h * 0.92], [w * 0.45, 0]]) + line([[-w * 0.1, -h * 0.92], [-w * 0.14, 0]]) + line([[w * 0.1, -h * 0.92], [w * 0.14, 0]]), col, h * 0.035),
    stroke(line([[-w * 0.38, -h * 0.35], [w * 0.38, -h * 0.35]]), shade(col, -0.15), h * 0.025),
    ol(ellipse(0, -h * 0.94, w * 0.5, w * 0.12), seat, 1, -0.3),
    ol(rect(-w * 0.5, -h * 0.94, w, h * 0.06, 3), shade(seat, -0.1), 1),
  ];
}

/** Bentwood bistro chair seen from the front, height h. */
export function bistroChair(h: number, col = '#3b2a22'): Shape[] {
  const w = h * 0.42, sy = -h * 0.48;
  return [
    shadow(0, 0, w * 0.6, h * 0.03),
    stroke(line([[-w * 0.4, sy], [-w * 0.5, 0]]) + line([[w * 0.4, sy], [w * 0.5, 0]]) + line([[-w * 0.2, sy], [-w * 0.24, 0]]) + line([[w * 0.2, sy], [w * 0.24, 0]]), col, h * 0.022),
    stroke(ellipse(0, -h * 0.2, w * 0.4, w * 0.06), col, h * 0.014),
    stroke(M(-w * 0.4, sy) + L(-w * 0.42, -h * 0.82) + Q(-w * 0.42, -h, 0, -h) + Q(w * 0.42, -h, w * 0.42, -h * 0.82) + L(w * 0.4, sy), col, h * 0.026),
    stroke(M(-w * 0.26, -h * 0.66) + Q(0, -h * 0.6, w * 0.26, -h * 0.66) + M(-w * 0.26, -h * 0.66) + Q(-w * 0.3, -h * 0.9, 0, -h * 0.9) + Q(w * 0.3, -h * 0.9, w * 0.26, -h * 0.66), col, h * 0.016),
    ol(ellipse(0, sy, w * 0.5, w * 0.13), shade(col, 0.15), 1, -0.3),
    ol(rect(-w * 0.5, sy, w, h * 0.035, 3), col, 1),
  ];
}

/** Small round café table with a pedestal, top width w, height h. Origin floor centre. */
export function cafeTable(w: number, h: number, top = '#ece4d2', base = '#3b3532'): Shape[] {
  return [
    shadow(0, 0, w * 0.4, w * 0.05),
    sh(ellipse(0, -4, w * 0.24, w * 0.05), base),
    sh(rect(-w * 0.03, -h, w * 0.06, h - 4), base),
    ol(ellipse(0, -h, w / 2, w * 0.1), top, 1, -0.25),
    sh(rect(-w / 2, -h, w, w * 0.04), shade(top, -0.2)),
    ol(ellipse(0, -h - w * 0.01, w / 2, w * 0.09), top, 1, -0.2),
  ];
}

/** Pendant lamp hanging from (0,0) on a cord of length len. */
export function pendant(len: number, s: number, col = K.tealDk, lit = true): Shape[] {
  const out: Shape[] = [];
  if (lit) out.push(sh(circle(0, len + s * 0.5, s * 1.6), K.glow, { opacity: 0.18 }), sh(poly([[-s * 0.5, len + s * 0.4], [s * 0.5, len + s * 0.4], [s * 1.6, len + s * 4], [-s * 1.6, len + s * 4]]), K.glow, { opacity: 0.08 }));
  out.push(stroke(line([[0, 0], [0, len]]), '#2b2622', 1.6), sh(rect(-s * 0.08, len - 4, s * 0.16, s * 0.2), '#2b2622'));
  out.push(ol(M(-s * 0.12, len + s * 0.1) + Q(-s * 0.2, len + s * 0.15, -s * 0.5, len + s * 0.5) + L(s * 0.5, len + s * 0.5) + Q(s * 0.2, len + s * 0.15, s * 0.12, len + s * 0.1) + 'Z', col, 1, -0.3));
  out.push(sh(ellipse(0, len + s * 0.5, s * 0.5, s * 0.07), lit ? '#fff1c4' : shade(col, -0.3)), sh(ellipse(0, len + s * 0.54, s * 0.15, s * 0.08), lit ? '#ffffff' : '#d9d0bc'));
  return out;
}

/** Floor lamp, height h, shade on the top. */
export function floorLamp(h: number, shadeCol = '#f0dcae', base = '#3b3532', lit = true): Shape[] {
  const s = h * 0.18;
  const out: Shape[] = [];
  if (lit) out.push(sh(circle(0, -h + s * 0.4, s * 1.8), K.glow, { opacity: 0.2 }));
  out.push(shadow(0, 0, s * 0.7, s * 0.12), sh(ellipse(0, -3, s * 0.55, s * 0.12), base), stroke(line([[0, -4], [0, -h + s * 0.5]]), base, 4));
  out.push(ol(poly([[-s * 0.45, -h], [s * 0.45, -h], [s * 0.7, -h + s * 0.7], [-s * 0.7, -h + s * 0.7]]), shadeCol, 1, -0.2), sh(poly([[s * 0.15, -h], [s * 0.45, -h], [s * 0.7, -h + s * 0.7], [s * 0.3, -h + s * 0.7]]), shade(shadeCol, -0.12), { opacity: 0.7 }));
  if (lit) out.push(sh(ellipse(0, -h + s * 0.7, s * 0.66, s * 0.08), '#fff3c8'));
  return out;
}

// =====================================================================
// music
// =====================================================================
/** Acoustic guitar standing upright, height s, origin at the bottom of the body. */
export function guitar(s: number, col = '#d9984a'): Shape[] {
  const body = blob([[0, 0], [-s * 0.2, -s * 0.04], [-s * 0.22, -s * 0.2], [-s * 0.14, -s * 0.3], [-s * 0.16, -s * 0.42], [-s * 0.08, -s * 0.5], [0, -s * 0.49], [s * 0.08, -s * 0.5], [s * 0.16, -s * 0.42], [s * 0.14, -s * 0.3], [s * 0.22, -s * 0.2], [s * 0.2, -s * 0.04]], 0.8);
  let strings = '';
  for (let i = 0; i < 4; i++) strings += line([[-s * 0.018 + i * s * 0.012, -s * 0.1], [-s * 0.018 + i * s * 0.012, -s * 0.97]]);
  let frets = '';
  for (let i = 0; i < 7; i++) frets += line([[-s * 0.025, -s * 0.56 - i * s * 0.05], [s * 0.025, -s * 0.56 - i * s * 0.05]]);
  return [
    ol(body, col, 1.4, -0.4),
    sh(blob([[s * 0.06, -s * 0.48], [s * 0.16, -s * 0.42], [s * 0.14, -s * 0.3], [s * 0.22, -s * 0.2], [s * 0.2, -s * 0.04], [s * 0.04, -s * 0.02], [s * 0.12, -s * 0.2]], 0.8), shade(col, -0.2), { opacity: 0.6 }),
    stroke(body, '#5a3420', 2),
    sh(circle(0, -s * 0.3, s * 0.06), '#2b1a12'), stroke(circle(0, -s * 0.3, s * 0.075), '#5a3420', 2),
    ol(rect(-s * 0.07, -s * 0.13, s * 0.14, s * 0.03, 2), '#3b2416', 1),
    ol(rect(-s * 0.03, -s * 0.9, s * 0.06, s * 0.45), '#5a3420', 1),
    stroke(frets, '#c9c0aa', 1),
    ol(poly([[-s * 0.045, -s * 0.9], [s * 0.045, -s * 0.9], [s * 0.055, -s * 1.02], [-s * 0.055, -s * 1.02]]), '#3b2416', 1),
    sh(circle(-s * 0.068, -s * 0.94, s * 0.012) + circle(-s * 0.07, -s * 0.98, s * 0.012) + circle(s * 0.068, -s * 0.94, s * 0.012) + circle(s * 0.07, -s * 0.98, s * 0.012), K.chrome),
    stroke(strings, '#efe6d0', 0.8),
    hl(ellipse(-s * 0.12, -s * 0.2, s * 0.03, s * 0.07, 10), 0.3),
  ];
}

/** Microphone on a tripod stand, height h. */
export function micStand(h: number, col = '#2b2622'): Shape[] {
  return [
    stroke(line([[0, -h * 0.18], [-h * 0.16, 0]]) + line([[0, -h * 0.18], [h * 0.16, 0]]) + line([[0, -h * 0.18], [h * 0.03, 0]]), col, 3),
    stroke(line([[0, -h * 0.18], [0, -h * 0.82]]), col, 3.5),
    sh(rect(-4, -h * 0.6, 8, 10, 2), K.chromeDk),
    stroke(M(0, -h * 0.82) + L(h * 0.07, -h * 0.9), col, 3),
    ol(xf(rect(-h * 0.02, -h * 0.03, h * 0.11, h * 0.06, h * 0.03), { rot: -40, x: h * 0.08, y: -h * 0.92 }), '#3b3532', 1),
    ol(circle(h * 0.15, -h * 0.98, h * 0.045), K.chrome, 1.2, -0.45),
    stroke(line([[h * 0.12, -h * 1.0], [h * 0.18, -h * 0.96]]) + line([[h * 0.13, -h * 0.95], [h * 0.17, -h * 1.01]]), K.chromeDk, 0.9),
  ];
}

/** Small guitar amplifier, width w. */
export function amp(w: number, col = '#2f2b28', cloth = '#8a7a64'): Shape[] {
  const h = w * 0.8;
  let weave = '';
  for (let i = 1; i < 8; i++) weave += line([[-w * 0.4, -h * 0.08 - i * h * 0.075], [w * 0.4, -h * 0.08 - i * h * 0.075]]);
  return [
    shadow(0, 0, w * 0.55, w * 0.05),
    ol(rect(-w / 2, -h, w, h, 6), col, 1.2),
    sh(rect(-w * 0.42, -h * 0.72, w * 0.84, h * 0.64, 3), cloth),
    stroke(weave, shade(cloth, -0.2), 1, { opacity: 0.6 }),
    sh(rect(-w * 0.42, -h * 0.94, w * 0.84, h * 0.16, 2), '#d9cfb8'),
    sh(circle(-w * 0.3, -h * 0.86, 4) + circle(-w * 0.15, -h * 0.86, 4) + circle(0, -h * 0.86, 4) + circle(w * 0.15, -h * 0.86, 4), '#2b2622'),
    sh(circle(w * 0.3, -h * 0.86, 3), K.red),
    ol(rect(-w * 0.14, -h * 1.06, w * 0.28, h * 0.06, 3), '#2b2622', 1),
  ];
}

/** Turntable seen from the front/above, width w. */
export function recordPlayer(w: number, col = '#b98552', lid = true): Shape[] {
  const h = w * 0.26;
  const out: Shape[] = [shadow(0, 0, w * 0.52, w * 0.04), ol(rect(-w / 2, -h, w, h, 4), col, 1.2, -0.35), sh(rect(-w / 2, -h, w, h * 0.18, 4), shade(col, 0.15))];
  out.push(sh(rect(-w * 0.44, -h * 0.55, w * 0.06, h * 0.22, 2), '#3b3532'), sh(circle(w * 0.36, -h * 0.45, w * 0.02) + circle(w * 0.42, -h * 0.45, w * 0.02), K.chrome));
  // top plate (perspective)
  out.push(ol(poly([[-w * 0.47, -h], [w * 0.47, -h], [w * 0.42, -h - w * 0.28], [-w * 0.42, -h - w * 0.28]]), shade(col, 0.08), 1, -0.3));
  out.push(sh(ellipse(-w * 0.08, -h - w * 0.14, w * 0.3, w * 0.11), '#2a2622'));
  let grooves = '';
  for (let i = 1; i < 5; i++) grooves += ellipse(-w * 0.08, -h - w * 0.14, w * 0.3 - i * w * 0.045, w * 0.11 - i * w * 0.0165);
  out.push(stroke(grooves, '#4a4440', 1), sh(ellipse(-w * 0.08, -h - w * 0.14, w * 0.09, w * 0.033), K.red), sh(circle(-w * 0.08, -h - w * 0.14, 2), K.chrome));
  out.push(hl(ellipse(-w * 0.2, -h - w * 0.19, w * 0.1, w * 0.02, -8), 0.18));
  out.push(sh(circle(w * 0.33, -h - w * 0.2, w * 0.035), K.chromeDk), stroke(M(w * 0.33, -h - w * 0.2) + L(w * 0.3, -h - w * 0.06) + L(w * 0.12, -h - w * 0.1), K.chrome, 3), sh(rect(w * 0.1, -h - w * 0.12, w * 0.04, w * 0.03, 1), '#2a2622'));
  if (lid) out.push(sh(poly([[-w * 0.47, -h - w * 0.28], [w * 0.47, -h - w * 0.28], [w * 0.47, -h - w * 0.62], [-w * 0.47, -h - w * 0.62]]), '#d8e8ec', { opacity: 0.22 }), stroke(poly([[-w * 0.47, -h - w * 0.28], [w * 0.47, -h - w * 0.28], [w * 0.47, -h - w * 0.62], [-w * 0.47, -h - w * 0.62]]), '#8aa0a8', 1.2, { opacity: 0.7 }));
  return out;
}

/** Vinyl record in its sleeve, leaning; origin bottom centre, size s. */
export function recordSleeve(s: number, col: string, art: string, seed: number): Shape[] {
  const g = rng(seed);
  const out: Shape[] = [ol(rect(-s / 2, -s, s, s, 2), col, 1, -0.3)];
  const v = g.int(0, 3);
  if (v === 0) out.push(sh(circle(0, -s / 2, s * 0.3), art), sh(circle(0, -s / 2, s * 0.15), shade(art, 0.4)));
  else if (v === 1) { let d = ''; for (let i = 0; i < 4; i++) d += rect(-s * 0.4, -s * 0.85 + i * s * 0.2, s * 0.8, s * 0.08); out.push(sh(d, art)); }
  else if (v === 2) out.push(sh(poly([[-s * 0.4, -s * 0.15], [0, -s * 0.85], [s * 0.4, -s * 0.15]]), art), sh(circle(s * 0.25, -s * 0.75, s * 0.08), '#f3d77a'));
  else out.push(sh(rect(-s * 0.35, -s * 0.85, s * 0.35, s * 0.35), art), sh(rect(0, -s * 0.5, s * 0.35, s * 0.35), shade(art, 0.3)));
  return out;
}

/** Loose vinyl record, radius r, origin centre. */
export function vinyl(r: number, label = K.mustard): Shape[] {
  let gr = '';
  for (let i = 1; i < 5; i++) gr += circle(0, 0, r - i * r * 0.13);
  return [sh(circle(0, 0, r), '#211d1b'), stroke(gr, '#3e3834', 1), hl(sector(0, 0, r * 0.95, 200, 240, r * 0.45), 0.12), sh(circle(0, 0, r * 0.32), label), sh(circle(0, 0, r * 0.05), '#f3ead6')];
}

/** Over-ear headphones, size s, origin centre. */
export function headphones(s: number, col = '#3b3532', pad = K.red): Shape[] {
  return [
    stroke(M(-s * 0.4, s * 0.1) + Q(-s * 0.45, -s * 0.5, 0, -s * 0.5) + Q(s * 0.45, -s * 0.5, s * 0.4, s * 0.1), col, s * 0.08),
    stroke(M(-s * 0.3, -s * 0.25) + Q(0, -s * 0.48, s * 0.3, -s * 0.25), shade(col, 0.4), s * 0.03),
    ol(ellipse(-s * 0.4, s * 0.16, s * 0.13, s * 0.2), pad, 1, -0.35), ol(ellipse(s * 0.4, s * 0.16, s * 0.13, s * 0.2), pad, 1, -0.35),
    sh(ellipse(-s * 0.36, s * 0.16, s * 0.06, s * 0.13) + ellipse(s * 0.44, s * 0.16, s * 0.06, s * 0.13), shade(pad, -0.3)),
  ];
}

// =====================================================================
// plants
// =====================================================================
/** Simple pot with a rim, w wide, h tall. */
export function plantPot(w: number, h: number, col: string): Shape[] {
  return [
    sh(poly([[-w / 2, -h], [w / 2, -h], [w * 0.38, 0], [-w * 0.38, 0]]), col),
    sh(poly([[w * 0.15, -h], [w / 2, -h], [w * 0.38, 0], [w * 0.12, 0]]), shade(col, -0.18), { opacity: 0.8 }),
    ol(rect(-w * 0.54, -h - h * 0.18, w * 1.08, h * 0.22, 3), shade(col, 0.1), 0.8, -0.25),
  ];
}

/** Monstera / split-leaf plant, size s, pot below. */
export function monstera(s: number, seed: number, potCol = K.terracotta, potW = 0.5): Shape[] {
  const g = rng(seed);
  const out: Shape[] = [];
  const n = 7;
  for (let i = 0; i < n; i++) {
    const a = -90 + (i - (n - 1) / 2) * 24 + g.range(-8, 8);
    const len = s * g.range(0.6, 1);
    const rad = (a * Math.PI) / 180;
    const ex = Math.cos(rad) * len * 0.7, ey = -s * 0.3 + Math.sin(rad) * len * 0.7;
    const col = g.pick([K.green, K.greenDk, '#4e7d45', '#679a55']);
    out.push(stroke(curve([[0, -s * 0.28], [ex * 0.5, ey * 0.7 - s * 0.05], [ex, ey]]), shade(col, -0.25), 2.5));
    const lw = s * g.range(0.2, 0.28);
    const lf = xf(M(0, 0) + Q(lw * 0.6, -lw * 1.1, lw * 2, -lw * 0.2) + Q(lw * 1.3, lw * 0.9, 0, 0) + 'Z', { rot: a + 30, x: ex, y: ey });
    out.push(sh(lf, col));
    // splits
    let sp = '';
    for (let k = 1; k <= 3; k++) { const t = k / 4; sp += xf(line([[lw * 2 * t, -lw * 0.05], [lw * 2 * t + lw * 0.1, lw * 0.4 * (1 - t) + lw * 0.2]]), { rot: a + 30, x: ex, y: ey }); }
    out.push(stroke(sp, '#f3ead6', 2.4, { opacity: 0.85 }), stroke(xf(line([[0, 0], [lw * 1.8, -lw * 0.2]]), { rot: a + 30, x: ex, y: ey }), shade(col, 0.3), 1.2, { opacity: 0.7 }));
  }
  return [...out, ...plantPot(s * potW, s * 0.32, potCol)];
}

/** Snake plant: tall upright striped leaves in a pot. */
export function snakePlant(s: number, seed: number, potCol = '#e8e0cf'): Shape[] {
  const g = rng(seed);
  const out: Shape[] = [];
  for (let i = 0; i < 7; i++) {
    const x = (i - 3) * s * 0.05, l = s * g.range(0.55, 0.95), tilt = (i - 3) * 4 + g.range(-3, 3);
    const lf = xf(M(-s * 0.04, 0) + Q(-s * 0.05, -l * 0.6, 0, -l) + Q(s * 0.05, -l * 0.6, s * 0.04, 0) + 'Z', { rot: tilt, x, y: -s * 0.25 });
    const col = i % 2 ? '#4e7d45' : '#3d6a3a';
    out.push(sh(lf, col), stroke(lf, '#c9c46a', 1.4));
    let bands = '';
    for (let k = 1; k < 6; k++) bands += xf(M(-s * 0.03, -l * k * 0.15) + Q(0, -l * k * 0.15 - 4, s * 0.03, -l * k * 0.15), { rot: tilt, x, y: -s * 0.25 });
    out.push(stroke(bands, '#8ab06a', 1.2, { opacity: 0.7 }));
  }
  return [...out, ...plantPot(s * 0.42, s * 0.28, potCol)];
}

/** Trailing plant hanging from (0,0) in a macramé holder. */
export function hangingPlant(drop: number, s: number, seed: number, potCol = '#f0e6d4'): Shape[] {
  const g = rng(seed);
  const py = drop;
  const out: Shape[] = [stroke(line([[0, 0], [-s * 0.3, py - s * 0.35]]) + line([[0, 0], [s * 0.3, py - s * 0.35]]) + line([[0, 0], [0, py - s * 0.35]]), '#e8dcc0', 1.6), sh(circle(0, 0, 4), '#c9a46a')];
  const vines: string[] = ['', ''];
  let lv1 = '', lv2 = '';
  for (let i = 0; i < 6; i++) {
    const x0 = g.range(-s * 0.3, s * 0.3), len = g.range(s * 0.5, s * 1.4), dir = x0 < 0 ? -1 : 1;
    const pts: Pt[] = [];
    for (let k = 0; k <= 5; k++) pts.push([x0 + dir * k * s * 0.05 + Math.sin(k) * 4, py - s * 0.1 + (k * len) / 5]);
    vines[i % 2] += curve(pts);
    for (let k = 1; k <= 5; k++) { const [x, y] = pts[k]; const l = leaf(x, y, s * 0.13, s * 0.06, k % 2 ? 40 : 140); if ((i + k) % 2) lv1 += l; else lv2 += l; }
  }
  for (let i = 0; i < 8; i++) lv1 += leaf(g.range(-s * 0.3, s * 0.3), py - s * 0.32, s * 0.16, s * 0.07, g.range(-160, -20));
  out.push(stroke(vines[0] + vines[1], '#4e7d45', 1.4), sh(lv2, '#5c8a4e'), sh(lv1, '#7aa860'));
  out.push(ol(M(-s * 0.34, py - s * 0.35) + L(s * 0.34, py - s * 0.35) + Q(s * 0.3, py, 0, py) + Q(-s * 0.3, py, -s * 0.34, py - s * 0.35) + 'Z', potCol, 1, -0.2));
  out.push(stroke(M(-s * 0.3, py - s * 0.2) + L(0, py - s * 0.05) + L(s * 0.3, py - s * 0.2), '#e8dcc0', 1.4));
  return out;
}

/** Little cactus in a pot, height s. */
export function cactus(s: number, potCol = K.terracotta, col = '#6f9a5c'): Shape[] {
  let sp = '';
  for (let i = 0; i < 10; i++) sp += circle(((i % 3) - 1) * s * 0.07, -s * 0.3 - (i * s * 0.05), s * 0.012);
  return [
    ol(rect(-s * 0.13, -s * 0.85, s * 0.26, s * 0.65, s * 0.13), col, 1, -0.3),
    ol(M(-s * 0.13, -s * 0.5) + L(-s * 0.24, -s * 0.5) + Q(-s * 0.32, -s * 0.5, -s * 0.32, -s * 0.6) + L(-s * 0.32, -s * 0.72) + Q(-s * 0.32, -s * 0.78, -s * 0.26, -s * 0.78) + Q(-s * 0.2, -s * 0.78, -s * 0.2, -s * 0.72) + L(-s * 0.2, -s * 0.6) + L(-s * 0.13, -s * 0.6) + 'Z', col, 1, -0.3),
    ol(M(s * 0.13, -s * 0.42) + L(s * 0.22, -s * 0.42) + Q(s * 0.3, -s * 0.42, s * 0.3, -s * 0.52) + L(s * 0.3, -s * 0.62) + Q(s * 0.3, -s * 0.68, s * 0.24, -s * 0.68) + Q(s * 0.18, -s * 0.68, s * 0.18, -s * 0.62) + L(s * 0.18, -s * 0.52) + L(s * 0.13, -s * 0.52) + 'Z', col, 1, -0.3),
    sh(sp, '#f3ead6'),
    sh(circle(0, -s * 0.88, s * 0.06), '#f29bb5'),
    ...plantPot(s * 0.44, s * 0.24, potCol),
  ];
}

// =====================================================================
// apartment and brunch
// =====================================================================
/** Three-seat sofa seen from the front, width w. */
export function sofa(w: number, col: string, legs = K.woodDk): Shape[] {
  const h = w * 0.4;
  const dk = shade(col, -0.16), lt = shade(col, 0.12);
  const out: Shape[] = [shadow(0, 0, w * 0.52, h * 0.08)];
  out.push(sh(rect(-w * 0.44, -h * 0.1, w * 0.03, h * 0.1) + rect(w * 0.41, -h * 0.1, w * 0.03, h * 0.1), legs));
  out.push(ol(rect(-w * 0.46, -h, w * 0.92, h * 0.7, h * 0.12), col, 1.2, -0.28));
  for (let i = 0; i < 3; i++) out.push(ol(rect(-w * 0.4 + i * w * 0.27, -h * 0.94, w * 0.26, h * 0.5, h * 0.1), lt, 1, -0.25));
  for (let i = 0; i < 3; i++) out.push(ol(rect(-w * 0.41 + i * w * 0.274, -h * 0.46, w * 0.272, h * 0.2, h * 0.07), lt, 1, -0.25));
  out.push(ol(rect(-w * 0.44, -h * 0.28, w * 0.88, h * 0.2, h * 0.04), col, 1, -0.28));
  for (const s of [-1, 1]) out.push(ol(rect(s * w * 0.44 - w * 0.06, -h * 0.66, w * 0.12, h * 0.58, h * 0.1), col, 1.2, -0.28), sh(rect(s * w * 0.44 - w * 0.06, -h * 0.66, w * 0.12, h * 0.08, h * 0.04), lt));
  out.push(sh(rect(-w * 0.5, -h * 0.1, w, h * 0.03), dk));
  return out;
}

/** Square cushion, size s, origin centre. pattern 0 stripes, 1 dots, 2 diamond, 3 tassel/plain. */
export function cushion(s: number, col: string, accent: string, pattern: number, rot = 0): Shape[] {
  const body = M(-s / 2, -s / 2) + Q(0, -s * 0.42, s / 2, -s / 2) + Q(s * 0.42, 0, s / 2, s / 2) + Q(0, s * 0.42, -s / 2, s / 2) + Q(-s * 0.42, 0, -s / 2, -s / 2) + 'Z';
  const out: Shape[] = [ol(body, col, 1.2, -0.3)];
  if (pattern === 0) { let d = ''; for (let i = 0; i < 4; i++) d += rect(-s * 0.4, -s * 0.33 + i * s * 0.2, s * 0.8, s * 0.07); out.push(sh(d, accent)); }
  else if (pattern === 1) { let d = ''; for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) d += circle(-s * 0.3 + c * s * 0.2, -s * 0.3 + r * s * 0.2, s * 0.035); out.push(sh(d, accent)); }
  else if (pattern === 2) out.push(sh(poly([[0, -s * 0.32], [s * 0.3, 0], [0, s * 0.32], [-s * 0.3, 0]]), accent), sh(poly([[0, -s * 0.14], [s * 0.13, 0], [0, s * 0.14], [-s * 0.13, 0]]), col));
  else out.push(stroke(rect(-s * 0.32, -s * 0.32, s * 0.64, s * 0.64, 3), accent, 2, { opacity: 0.8 }));
  out.push(sh(ellipse(s * 0.1, s * 0.12, s * 0.3, s * 0.25), '#000000', { opacity: 0.06 }));
  return rot ? out.map((p) => ({ ...p, d: xf(p.d, { rot }) })) : out;
}

/** Road bicycle seen side-on, wheel radius r, origin at the midpoint between the hubs. */
export function bicycle(r: number, col = K.teal): Shape[] {
  const bx = -r * 1.25, fx = r * 1.25;
  let spokes = '';
  for (const hx of [bx, fx]) for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI; spokes += line([[hx + Math.cos(a) * r * 0.9, Math.sin(a) * r * 0.9], [hx - Math.cos(a) * r * 0.9, -Math.sin(a) * r * 0.9]]); }
  const seatX = bx + r * 0.75, seatY = -r * 1.35, bbX = bx + r * 1.05, headX = fx - r * 0.55, headY = -r * 1.3;
  return [
    stroke(circle(bx, 0, r) + circle(fx, 0, r), '#2b2622', r * 0.1),
    stroke(circle(bx, 0, r * 0.9) + circle(fx, 0, r * 0.9), K.chromeDk, r * 0.03),
    stroke(spokes, K.chrome, 0.8),
    stroke(M(bx, 0) + L(bbX, 0) + L(seatX, seatY) + L(bx, 0) + M(bbX, 0) + L(headX, headY + r * 0.15) + L(seatX - r * 0.04, seatY + r * 0.08) + M(headX, headY) + L(fx, 0), col, r * 0.07),
    stroke(M(seatX, seatY) + L(seatX - r * 0.08, seatY - r * 0.2), K.chromeDk, r * 0.05),
    ol(M(seatX - r * 0.32, seatY - r * 0.26) + Q(seatX - r * 0.05, seatY - r * 0.32, seatX + r * 0.18, seatY - r * 0.22) + L(seatX - r * 0.3, seatY - r * 0.18) + 'Z', '#3b2f2a', 1),
    stroke(M(headX, headY) + L(headX - r * 0.08, headY - r * 0.22) + Q(headX + r * 0.2, headY - r * 0.3, headX + r * 0.3, headY - r * 0.12) + Q(headX + r * 0.32, headY + r * 0.05, headX + r * 0.16, headY + r * 0.05), '#3b2f2a', r * 0.06),
    sh(circle(bbX, 0, r * 0.16), K.chromeDk), stroke(line([[bbX - r * 0.15, r * 0.18], [bbX + r * 0.15, -r * 0.18]]), '#2b2622', r * 0.04),
    sh(circle(bx, 0, r * 0.07) + circle(fx, 0, r * 0.07), K.chromeDk),
  ];
}

/** Stack of pancakes with butter and syrup, width w, origin bottom centre (plate included). */
export function pancakes(w: number, n = 4): Shape[] {
  const out: Shape[] = [ol(ellipse(0, -w * 0.05, w * 0.62, w * 0.12), '#fbf6ec', 1, -0.2), sh(ellipse(0, -w * 0.06, w * 0.44, w * 0.07), '#ece4d2')];
  const ph = w * 0.1;
  for (let i = 0; i < n; i++) {
    const y = -w * 0.08 - i * ph;
    out.push(ol(M(-w * 0.45, y) + Q(-w * 0.5, y - ph * 0.5, -w * 0.42, y - ph) + L(w * 0.42, y - ph) + Q(w * 0.5, y - ph * 0.5, w * 0.45, y) + Q(0, y + ph * 0.5, -w * 0.45, y) + 'Z', i % 2 ? '#d99a52' : '#e0a75e', 1, -0.3));
    out.push(sh(rect(-w * 0.42, y - ph * 0.55, w * 0.84, ph * 0.18), '#f3d08a', { opacity: 0.7 }));
  }
  const top = -w * 0.08 - n * ph;
  out.push(ol(ellipse(0, top, w * 0.42, w * 0.08), '#e8b46a', 1, -0.3));
  out.push(sh(M(-w * 0.3, top - 2) + Q(-w * 0.05, top - w * 0.07, w * 0.3, top) + L(w * 0.34, top + ph * 1.5) + Q(w * 0.36, top + ph * 1.9, w * 0.32, top + ph * 1.9) + L(w * 0.28, top + ph * 0.6) + Q(0, top + w * 0.06, -w * 0.24, top + ph * 0.5) + L(-w * 0.26, top + ph * 1.2) + Q(-w * 0.28, top + ph * 1.5, -w * 0.31, top + ph * 1.1) + 'Z', '#a8581f', { opacity: 0.9 }));
  out.push(ol(rect(-w * 0.09, top - w * 0.07, w * 0.18, w * 0.07, 3), '#f6e39a', 0.8, -0.2));
  out.push(sh(circle(w * 0.2, top - w * 0.02, w * 0.035) + circle(w * 0.27, top - w * 0.01, w * 0.03), '#3f4a8a'), sh(circle(-w * 0.2, top - w * 0.015, w * 0.035), '#c8322a'));
  return out;
}

/** French press, height s. */
export function frenchPress(s: number, frame = K.chromeDk): Shape[] {
  return [
    shadow(0, 0, s * 0.3, s * 0.04),
    sh(rect(-s * 0.22, -s * 0.8, s * 0.44, s * 0.78, 4), '#d8e8ec', { opacity: 0.55 }),
    sh(rect(-s * 0.2, -s * 0.6, s * 0.4, s * 0.58, 3), K.coffee),
    sh(rect(-s * 0.2, -s * 0.6, s * 0.4, s * 0.06), K.crema),
    hl(rect(-s * 0.16, -s * 0.76, s * 0.05, s * 0.7, 2), 0.55),
    stroke(line([[0, -s * 0.8], [0, -s * 0.62]]), K.chromeDk, 2), sh(rect(-s * 0.19, -s * 0.66, s * 0.38, s * 0.03), K.chrome),
    ol(rect(-s * 0.25, -s * 0.06, s * 0.5, s * 0.06, 2), frame, 1),
    ol(rect(-s * 0.25, -s * 0.84, s * 0.5, s * 0.08, 3), frame, 1),
    sh(rect(-s * 0.25, -s * 0.78, s * 0.05, s * 0.72) + rect(s * 0.2, -s * 0.78, s * 0.05, s * 0.72), frame),
    stroke(M(s * 0.25, -s * 0.7) + Q(s * 0.48, -s * 0.68, s * 0.46, -s * 0.4) + Q(s * 0.44, -s * 0.18, s * 0.25, -s * 0.2), '#2b2622', s * 0.06),
    sh(poly([[-s * 0.25, -s * 0.84], [-s * 0.33, -s * 0.8], [-s * 0.25, -s * 0.78]]), frame),
    stroke(line([[0, -s * 0.84], [0, -s * 1.0]]), K.chrome, 2.4), ol(circle(0, -s * 1.02, s * 0.05), frame, 1),
  ];
}

/** Glass carafe of juice, height s. */
export function carafe(s: number, liquid = '#f2a23a'): Shape[] {
  const body = M(-s * 0.12, -s) + L(s * 0.12, -s) + L(s * 0.12, -s * 0.72) + Q(s * 0.32, -s * 0.6, s * 0.3, -s * 0.3) + L(s * 0.28, 0) + L(-s * 0.28, 0) + L(-s * 0.3, -s * 0.3) + Q(-s * 0.32, -s * 0.6, -s * 0.12, -s * 0.72) + 'Z';
  return [
    shadow(0, 0, s * 0.3, s * 0.04),
    sh(body, '#e2eef0', { opacity: 0.5 }),
    sh(M(-s * 0.29, -s * 0.48) + L(s * 0.29, -s * 0.48) + L(s * 0.28, -s * 0.02) + L(-s * 0.28, -s * 0.02) + 'Z', liquid),
    sh(ellipse(0, -s * 0.48, s * 0.29, s * 0.03), shade(liquid, 0.25)),
    stroke(body, '#8aa0a8', 1.2),
    hl(rect(-s * 0.22, -s * 0.44, s * 0.05, s * 0.38, 2), 0.5),
  ];
}

/** Drinking glass with optional straw and ice, height s. */
export function tumbler(s: number, liquid: string, straw?: string, ice = true): Shape[] {
  const out: Shape[] = [shadow(0, 0, s * 0.26, s * 0.04), sh(poly([[-s * 0.25, -s], [s * 0.25, -s], [s * 0.2, 0], [-s * 0.2, 0]]), '#e2eef0', { opacity: 0.45 })];
  out.push(sh(poly([[-s * 0.235, -s * 0.72], [s * 0.235, -s * 0.72], [s * 0.2, -s * 0.02], [-s * 0.2, -s * 0.02]]), liquid));
  if (ice) out.push(sh(xf(rect(-s * 0.15, -s * 0.8, s * 0.16, s * 0.16, 2), { rot: 12, ox: -s * 0.07, oy: -s * 0.72 }) + xf(rect(s * 0.0, -s * 0.74, s * 0.15, s * 0.14, 2), { rot: -15, ox: s * 0.07, oy: -s * 0.67 }), '#ffffff', { opacity: 0.5 }));
  if (straw) out.push(stroke(line([[s * 0.05, -s * 0.2], [s * 0.18, -s * 1.25]]), straw, s * 0.06));
  out.push(stroke(poly([[-s * 0.25, -s], [s * 0.25, -s], [s * 0.2, 0], [-s * 0.2, 0]]), '#8aa0a8', 1.1), hl(rect(-s * 0.18, -s * 0.9, s * 0.04, s * 0.8, 2), 0.5));
  return out;
}

/** Fried egg seen from above, radius r. */
export function friedEgg(r: number): Shape[] {
  return [sh(blob([[-r, 0], [-r * 0.7, -r * 0.7], [0, -r * 0.85], [r * 0.8, -r * 0.6], [r, 0.1 * r], [r * 0.6, r * 0.7], [-r * 0.2, r * 0.8], [-r * 0.8, r * 0.5]], 0.9), '#fbf8ee', { stroke: '#e2d6bc', strokeWidth: 1 }), sh(circle(r * 0.05, 0, r * 0.36), '#f2b22a'), hl(circle(-r * 0.05, -r * 0.1, r * 0.1), 0.7)];
}

/** Slice of toast, s across, origin centre (lying face up). */
export function toast(s: number, spread = '#9ac46a'): Shape[] {
  const crust = M(-s * 0.45, s * 0.45) + L(-s * 0.45, -s * 0.15) + Q(-s * 0.5, -s * 0.5, -s * 0.15, -s * 0.5) + Q(0, -s * 0.58, s * 0.15, -s * 0.5) + Q(s * 0.5, -s * 0.5, s * 0.45, -s * 0.15) + L(s * 0.45, s * 0.45) + 'Z';
  return [ol(crust, '#b9773a', 1, -0.3), sh(xf(crust, { s: 0.82 }), '#e6bf7a'), sh(blob([[-s * 0.3, -s * 0.2], [0, -s * 0.34], [s * 0.3, -s * 0.18], [s * 0.28, s * 0.2], [-s * 0.26, s * 0.24]], 0.9), spread, { opacity: 0.95 }), sh(circle(-s * 0.1, -s * 0.05, s * 0.04) + circle(s * 0.12, s * 0.05, s * 0.04) + circle(0, s * 0.14, s * 0.03), '#d8452f')];
}

/** Pineapple, height s. */
export function pineapple(s: number): Shape[] {
  let crown = '';
  for (let i = 0; i < 7; i++) crown += leaf(0, -s * 0.6, s * (0.28 + (3 - Math.abs(i - 3)) * 0.05), s * 0.05, -90 + (i - 3) * 18);
  let grid = '';
  for (let r = 0; r < 5; r++) for (let c = -2; c <= 2; c++) {
    const y = -s * 0.12 - r * s * 0.1, half = Math.sqrt(Math.max(0, 1 - ((y + s * 0.32) / (s * 0.29)) ** 2)) * s * 0.2;
    const x = c * s * 0.075 + (r % 2 ? s * 0.037 : 0);
    if (Math.abs(x) + s * 0.03 < half) grid += M(x - s * 0.03, y - s * 0.02) + L(x, y + s * 0.015) + L(x + s * 0.03, y - s * 0.02);
  }
  return [
    sh(crown, '#5c8a4e'), stroke(crown, '#3d6a3a', 0.8),
    ol(ellipse(0, -s * 0.32, s * 0.2, s * 0.29), '#e0a83a', 1, -0.3),
    stroke(grid, '#a8742a', 1, { opacity: 0.7 }),
    hl(ellipse(-s * 0.08, -s * 0.38, s * 0.04, s * 0.12), 0.3),
  ];
}

/** Avocado half, s tall, origin centre. */
export function avocado(s: number): Shape[] {
  const body = blob([[0, -s * 0.5], [s * 0.22, -s * 0.3], [s * 0.32, s * 0.15], [0, s * 0.45], [-s * 0.32, s * 0.15], [-s * 0.22, -s * 0.3]], 1);
  return [sh(body, '#3d5a2a'), sh(xf(body, { s: 0.85, y: s * 0.02 }), '#cfe08a'), sh(xf(body, { s: 0.55, y: s * 0.08 }), '#e6ecaa', { opacity: 0.8 }), ol(circle(0, s * 0.12, s * 0.16), '#8a5a2a', 1), hl(circle(-s * 0.05, s * 0.06, s * 0.04), 0.4)];
}

/** Watering can, spout to the right, height s. */
export function wateringCan(s: number, col = K.teal): Shape[] {
  return [
    stroke(M(-s * 0.3, -s * 0.66) + Q(-s * 0.05, -s * 1.02, s * 0.25, -s * 0.66), shade(col, -0.2), s * 0.07),
    stroke(M(s * 0.3, -s * 0.2) + L(s * 0.72, -s * 0.74), col, s * 0.09),
    ol(rect(s * 0.66, -s * 0.84, s * 0.12, s * 0.14, 2), shade(col, -0.1), 1),
    ol(M(-s * 0.36, 0) + L(-s * 0.36, -s * 0.58) + Q(-s * 0.36, -s * 0.66, -s * 0.28, -s * 0.66) + L(s * 0.28, -s * 0.66) + Q(s * 0.36, -s * 0.66, s * 0.36, -s * 0.58) + L(s * 0.36, 0) + 'Z', col, 1.2, -0.3),
    sh(rect(-s * 0.36, -s * 0.36, s * 0.72, s * 0.08), shade(col, 0.25)),
    hl(rect(-s * 0.28, -s * 0.58, s * 0.06, s * 0.52, 2), 0.3),
  ];
}

/** Sunglasses, s wide, origin centre. */
export function sunglasses(s: number, frame = '#2b2622', lens = '#4a3a4a'): Shape[] {
  const lensD = (x: number) => M(x - s * 0.22, -s * 0.1) + L(x + s * 0.2, -s * 0.1) + Q(x + s * 0.22, s * 0.14, x, s * 0.14) + Q(x - s * 0.22, s * 0.14, x - s * 0.22, -s * 0.1) + 'Z';
  return [
    stroke(M(-s * 0.46, -s * 0.08) + L(-s * 0.56, s * 0.02) + M(s * 0.46, -s * 0.08) + L(s * 0.56, s * 0.02), frame, s * 0.035),
    ol(lensD(-s * 0.24) + lensD(s * 0.24), lens, s * 0.03, -0.5),
    stroke(M(-s * 0.04, -s * 0.07) + Q(0, -s * 0.12, s * 0.04, -s * 0.07), frame, s * 0.04),
    hl(ellipse(-s * 0.3, -s * 0.03, s * 0.06, s * 0.025, -15), 0.45), hl(ellipse(s * 0.18, -s * 0.03, s * 0.06, s * 0.025, -15), 0.45),
  ];
}

/** Cycling helmet, s wide, origin bottom centre. */
export function helmet(s: number, col = K.mustard): Shape[] {
  const shell = M(-s * 0.5, 0) + Q(-s * 0.52, -s * 0.62, 0, -s * 0.64) + Q(s * 0.5, -s * 0.62, s * 0.54, -s * 0.08) + L(s * 0.3, 0) + 'Z';
  let vents = '';
  for (let i = 0; i < 4; i++) vents += xf(ellipse(0, 0, s * 0.09, s * 0.035), { rot: -30 + i * 20, x: -s * 0.26 + i * s * 0.17, y: -s * 0.42 + Math.abs(i - 1.5) * s * 0.06 });
  return [
    stroke(M(-s * 0.3, -s * 0.02) + Q(-s * 0.1, s * 0.3, s * 0.15, s * 0.0), '#2b2622', s * 0.025),
    ol(shell, col, 1.2, -0.35),
    sh(vents, '#2b2622'),
    sh(M(-s * 0.5, 0) + L(s * 0.3, 0) + L(s * 0.28, -s * 0.07) + L(-s * 0.48, -s * 0.07) + 'Z', '#3b3532'),
    hl(ellipse(-s * 0.18, -s * 0.5, s * 0.14, s * 0.04, -20), 0.35),
  ];
}

/** Instant camera, s wide, origin centre. */
export function instantCamera(s: number, col = '#efe6d4', stripe = K.red): Shape[] {
  const h = s * 0.8;
  return [
    ol(rect(-s / 2, -h / 2, s, h, s * 0.1), col, 1.2, -0.3),
    sh(rect(-s / 2, -h * 0.02, s, h * 0.08), stripe), sh(rect(-s / 2, h * 0.06, s, h * 0.05), K.mustard), sh(rect(-s / 2, h * 0.11, s, h * 0.05), K.teal),
    ol(circle(0, -h * 0.05, s * 0.24), '#3b3532', 1), sh(circle(0, -h * 0.05, s * 0.16), '#1f2a34'), hl(circle(-s * 0.05, -h * 0.1, s * 0.05), 0.6),
    sh(rect(s * 0.24, -h * 0.4, s * 0.16, s * 0.1, 2), '#2b2622'), sh(circle(-s * 0.32, -h * 0.32, s * 0.05), K.red),
    sh(rect(-s * 0.3, h * 0.36, s * 0.6, h * 0.06, 2), '#3b3532'),
  ];
}

/** Ball of yarn with knitting needles, radius r, origin centre. */
export function yarnBall(r: number, col = '#d98a9a'): Shape[] {
  let wraps = '';
  for (let i = 0; i < 5; i++) wraps += xf(ellipse(0, 0, r * 0.95, r * 0.35), { rot: -60 + i * 30 });
  return [
    stroke(line([[-r * 1.3, -r * 1.0], [r * 0.6, r * 0.2]]) + line([[-r * 0.6, -r * 1.3], [r * 0.5, r * 0.4]]), '#c9a46a', r * 0.09),
    sh(circle(-r * 1.32, -r * 1.02, r * 0.12) + circle(-r * 0.62, -r * 1.32, r * 0.12), K.red),
    ol(circle(0, 0, r), col, 1.2, -0.3),
    stroke(wraps, shade(col, -0.2), 1.2),
    stroke(curve([[r * 0.8, r * 0.5], [r * 1.3, r * 0.9], [r * 1.0, r * 1.3]]), col, 2),
  ];
}

/** TV / remote control, length l, origin centre, vertical. */
export function remote(l: number, col = '#3b3532'): Shape[] {
  const w = l * 0.26;
  let b = '';
  for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) b += circle(-w * 0.26 + c * w * 0.26, -l * 0.02 + r * l * 0.1, w * 0.08);
  return [ol(rect(-w / 2, -l / 2, w, l, w * 0.4), col, 1, -0.4), sh(circle(0, -l * 0.34, w * 0.14), K.red), sh(circle(0, -l * 0.18, w * 0.22), shade(col, 0.3)), sh(b, shade(col, 0.45))];
}

/** Slippers pair seen from above, s long, origin centre. */
export function slippers(s: number, col = '#9cb4c8'): Shape[] {
  const one = (x: number, rot: number) => xf(blob([[0, -s * 0.5], [s * 0.18, -s * 0.36], [s * 0.18, s * 0.3], [0, s * 0.5], [-s * 0.18, s * 0.3], [-s * 0.18, -s * 0.36]], 0.9), { rot, x });
  const band = (x: number, rot: number) => xf(M(-s * 0.19, -s * 0.05) + Q(0, -s * 0.15, s * 0.19, -s * 0.05) + L(s * 0.18, -s * 0.3) + Q(0, -s * 0.42, -s * 0.18, -s * 0.3) + 'Z', { rot, x });
  return [ol(one(-s * 0.2, -8) + one(s * 0.2, 10), '#f0e6d4', 1, -0.3), ol(band(-s * 0.2, -8) + band(s * 0.2, 10), col, 1, -0.3)];
}

/** Toaster with two slices popping up, width w. */
export function toaster(w: number, col = '#9cc4c0'): Shape[] {
  const h = w * 0.62;
  return [
    shadow(0, 0, w * 0.55, w * 0.05),
    ol(rect(-w * 0.32, -h - w * 0.16, w * 0.26, w * 0.24, 4), '#e6bf7a', 1, -0.3), ol(rect(w * 0.06, -h - w * 0.12, w * 0.26, w * 0.2, 4), '#dcae66', 1, -0.3),
    ol(rect(-w / 2, -h, w, h, w * 0.18), col, 1.2, -0.3),
    sh(rect(-w * 0.4, -h + 3, w * 0.8, 4, 2), '#2b2622', { opacity: 0.5 }),
    sh(rect(w * 0.28, -h * 0.5, w * 0.24, w * 0.07, 2), '#3b3532'),
    hl(rect(-w * 0.4, -h * 0.85, w * 0.08, h * 0.6, 3), 0.4),
    sh(rect(-w * 0.42, -w * 0.04, w * 0.08, w * 0.04) + rect(w * 0.34, -w * 0.04, w * 0.08, w * 0.04), '#3b3532'),
  ];
}

/** Stove-top moka pot, height s. */
export function mokaPot(s: number): Shape[] {
  return [
    stroke(M(s * 0.2, -s * 0.85) + L(s * 0.48, -s * 0.78) + L(s * 0.44, -s * 0.55), '#2b2622', s * 0.07),
    ol(poly([[-s * 0.26, 0], [s * 0.26, 0], [s * 0.18, -s * 0.42], [-s * 0.18, -s * 0.42]]), K.chrome, 1, -0.4),
    ol(poly([[-s * 0.18, -s * 0.46], [s * 0.18, -s * 0.46], [s * 0.26, -s * 0.86], [-s * 0.26, -s * 0.86]]), K.chrome, 1, -0.4),
    sh(rect(-s * 0.2, -s * 0.46, s * 0.4, s * 0.05), K.chromeDk),
    ol(poly([[-s * 0.26, -s * 0.86], [s * 0.26, -s * 0.86], [s * 0.14, -s * 0.96], [-s * 0.14, -s * 0.96]]), K.chromeLt, 1, -0.4),
    sh(poly([[-s * 0.26, -s * 0.86], [-s * 0.36, -s * 0.92], [-s * 0.22, -s * 0.8]]), K.chrome),
    ol(circle(0, -s * 0.99, s * 0.04), '#2b2622', 1),
    sh(poly([[s * 0.05, 0], [s * 0.26, 0], [s * 0.18, -s * 0.42], [s * 0.04, -s * 0.42]]), K.chromeDk, { opacity: 0.4 }),
  ];
}

/** Fridge, width w height h, origin top-left. Magnets and notes on the door. */
export function fridge(w: number, h: number, col = '#e8efe9', seed = 3): Shape[] {
  const g = rng(seed);
  const out: Shape[] = [ol(rect(0, 0, w, h, 10), col, 1.4, -0.25), sh(rect(w * 0.82, 0, w * 0.18, h, 10), '#000000', { opacity: 0.05 }), stroke(line([[4, h * 0.34], [w - 4, h * 0.34]]), shade(col, -0.25), 2)];
  out.push(sh(rect(w * 0.08, h * 0.12, 8, h * 0.16, 4) + rect(w * 0.08, h * 0.4, 8, h * 0.2, 4), K.chrome));
  const notes = ['#f3d77a', '#f2b0a8', '#a9cde0', '#bfe0a8', '#fbf6ec'];
  for (let i = 0; i < 7; i++) {
    const x = g.range(w * 0.3, w * 0.7), y = g.range(h * 0.06, h * 0.9);
    if (y > h * 0.3 && y < h * 0.38) continue;
    const c = g.pick(notes);
    const k = Math.min(1, w / 120), rot = g.range(-10, 10);
    out.push(sh(xf(rect(-18 * k, -14 * k, 36 * k, 28 * k, 1), { rot, x, y }), c), stroke(xf(line([[-12 * k, -4 * k], [12 * k, -4 * k]]) + line([[-12 * k, 3 * k], [8 * k, 3 * k]]), { rot, x, y }), '#8a847a', 1), sh(circle(x, y - 12 * k, 3.5 * k), g.pick([K.red, K.teal, K.mustard])));
  }
  return out;
}

// =====================================================================
// game night
// =====================================================================
/** Board game on the table, w wide, seen slightly from above; origin centre. */
export function boardGame(w: number, seed: number): Shape[] {
  const g = rng(seed);
  const h = w * 0.62;
  const top = poly([[-w * 0.44, -h / 2], [w * 0.44, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]]);
  const out: Shape[] = [sh(xf(top, { x: 4, y: 5 }), '#000000', { opacity: 0.18 }), ol(top, '#f4ead2', 1.2, -0.35)];
  // inner path squares around the board edge
  const cols = [K.red, K.teal, K.mustard, '#7f9f6a', K.plum, '#6f8fd6'];
  const quads = cols.map(() => '');
  const n = 10;
  const at = (u: number, v: number): Pt => { const y = -h / 2 + v * h, half = w * 0.44 + (w * 0.06) * v; return [-half + u * half * 2, y]; };
  const cell = (u0: number, v0: number, u1: number, v1: number) => poly([at(u0, v0), at(u1, v0), at(u1, v1), at(u0, v1)]);
  for (let i = 0; i < n; i++) {
    const a = 0.05 + (i * 0.9) / n, b = a + 0.9 / n - 0.008;
    quads[i % cols.length] += cell(a, 0.06, b, 0.16);
    quads[(i + 2) % cols.length] += cell(a, 0.84, b, 0.94);
  }
  for (let i = 1; i < 7; i++) { const a = 0.06 + (i * 0.78) / 7.8, b = a + 0.1; quads[(i + 1) % cols.length] += cell(0.05, a + 0.06, 0.14, b + 0.04); quads[(i + 4) % cols.length] += cell(0.86, a + 0.06, 0.95, b + 0.04); }
  out.push(...quads.map((d, i) => sh(d, cols[i])));
  // centre: a winding river and a little compass star
  out.push(sh(cell(0.2, 0.24, 0.8, 0.76), '#bcd6a0'));
  out.push(stroke(curve([at(0.22, 0.6), at(0.4, 0.5), at(0.55, 0.62), at(0.78, 0.4)]), '#7fb0d0', 6));
  let trees = '';
  for (let i = 0; i < 6; i++) { const [x, y] = at(g.range(0.26, 0.74), g.range(0.3, 0.72)); trees += circle(x, y, w * 0.018); }
  out.push(sh(trees, '#5c8a4e'), sh(star(...at(0.62, 0.34), w * 0.04, w * 0.016, 4), K.mustard));
  return out;
}

/** Six-sided die, size s, origin centre, showing `face`, slightly 3-D. */
export function die(s: number, face: number, col = '#fbf6ec', pip = '#2b2622'): Shape[] {
  const out: Shape[] = [
    sh(poly([[-s * 0.5, -s * 0.5], [-s * 0.3, -s * 0.66], [s * 0.66, -s * 0.66], [s * 0.5, -s * 0.5]]), shade(col, -0.06), { stroke: shade(col, -0.35), strokeWidth: 0.8 }),
    sh(poly([[s * 0.5, -s * 0.5], [s * 0.66, -s * 0.66], [s * 0.66, s * 0.36], [s * 0.5, s * 0.5]]), shade(col, -0.22), { stroke: shade(col, -0.35), strokeWidth: 0.8 }),
    ol(rect(-s * 0.5, -s * 0.5, s, s, s * 0.12), col, 1, -0.35),
  ];
  const p = s * 0.27, r = s * 0.09;
  const spots: Record<number, Pt[]> = { 1: [[0, 0]], 2: [[-p, -p], [p, p]], 3: [[-p, -p], [0, 0], [p, p]], 4: [[-p, -p], [p, -p], [-p, p], [p, p]], 5: [[-p, -p], [p, -p], [0, 0], [-p, p], [p, p]], 6: [[-p, -p], [p, -p], [-p, 0], [p, 0], [-p, p], [p, p]] };
  out.push(sh(spots[face].map(([x, y]) => circle(x, y, r)).join(''), pip));
  return out;
}

/** Playing card face-up, height s, origin centre. suit 0 hearts, 1 diamonds, 2 spades, 3 clubs. */
export function playingCard(s: number, suit: number, back = false): Shape[] {
  const w = s * 0.7;
  const out: Shape[] = [sh(rect(-w / 2 + 2, -s / 2 + 2, w, s, s * 0.06), '#000000', { opacity: 0.15 }), ol(rect(-w / 2, -s / 2, w, s, s * 0.06), '#fdfaf2', 1, -0.25)];
  if (back) {
    let d = '';
    for (let r = 0; r < 6; r++) for (let c = 0; c < 4; c++) d += poly([[-w * 0.3 + c * w * 0.2, -s * 0.38 + r * s * 0.15], [-w * 0.2 + c * w * 0.2, -s * 0.31 + r * s * 0.15], [-w * 0.3 + c * w * 0.2, -s * 0.24 + r * s * 0.15], [-w * 0.4 + c * w * 0.2, -s * 0.31 + r * s * 0.15]]);
    out.push(sh(rect(-w * 0.4, -s * 0.42, w * 0.8, s * 0.84, 3), '#3d5a8a'), sh(d, '#6f8fd6'));
    return out;
  }
  const red = suit < 2, col = red ? '#c8322a' : '#2b2622';
  out.push(sh(suitPath(suit, 0, 0, s * 0.2), col), sh(suitPath(suit, -w * 0.3, -s * 0.33, s * 0.07) + suitPath(suit, w * 0.3, s * 0.33, s * 0.07), col));
  out.push(stroke(line([[-w * 0.34, -s * 0.45], [-w * 0.26, -s * 0.45]]) + line([[w * 0.26, s * 0.45], [w * 0.34, s * 0.45]]), col, 1.6));
  return out;
}

/** Card suit symbol centred on (x, y), size r. */
export function suitPath(suit: number, x: number, y: number, r: number): string {
  if (suit === 0) return heart(x, y, r);
  if (suit === 1) return poly([[x, y - r * 1.1], [x + r * 0.75, y], [x, y + r * 1.1], [x - r * 0.75, y]]);
  if (suit === 2) return M(x, y - r) + CB(x + r * 1.4, y - r * 0.1, x + r * 0.9, y + r * 1.1, x, y + r * 0.45) + CB(x - r * 0.9, y + r * 1.1, x - r * 1.4, y - r * 0.1, x, y - r) + 'Z' + poly([[x, y + r * 0.3], [x + r * 0.35, y + r * 1.05], [x - r * 0.35, y + r * 1.05]]);
  return circle(x, y - r * 0.5, r * 0.45) + circle(x - r * 0.5, y + r * 0.15, r * 0.45) + circle(x + r * 0.5, y + r * 0.15, r * 0.45) + poly([[x, y], [x + r * 0.3, y + r * 1.05], [x - r * 0.3, y + r * 1.05]]);
}

/** Fan of cards held together, s tall, origin at the pivot. */
export function cardFan(s: number, n: number, rot0: number, seed: number): Shape[] {
  const g = rng(seed);
  const out: Shape[] = [];
  for (let i = 0; i < n; i++) out.push(...playingCard(s, g.int(0, 3)).map((p) => ({ ...p, d: xf(p.d, { rot: rot0 + i * 12, y: -s * 0.35, ox: 0, oy: s * 0.35 }) })));
  return out;
}

/** Game pawn, height s. */
export function pawn(s: number, col: string): Shape[] {
  return [
    ol(M(-s * 0.32, 0) + Q(-s * 0.3, -s * 0.18, -s * 0.1, -s * 0.5) + L(s * 0.1, -s * 0.5) + Q(s * 0.3, -s * 0.18, s * 0.32, 0) + 'Z', col, 1, -0.35),
    ol(ellipse(0, -s * 0.52, s * 0.2, s * 0.06), col, 1, -0.35),
    ol(circle(0, -s * 0.74, s * 0.2), col, 1, -0.35),
    hl(ellipse(-s * 0.08, -s * 0.8, s * 0.06, s * 0.04, -30), 0.5),
  ];
}

/** Sand timer, height s. */
export function sandTimer(s: number, frame = K.woodDk, sand = '#e8b84a'): Shape[] {
  return [
    ol(rect(-s * 0.3, -s * 0.08, s * 0.6, s * 0.08, 2), frame, 1),
    ol(rect(-s * 0.3, -s, s * 0.6, s * 0.08, 2), frame, 1),
    sh(M(-s * 0.2, -s * 0.92) + L(s * 0.2, -s * 0.92) + Q(s * 0.2, -s * 0.6, s * 0.04, -s * 0.5) + Q(s * 0.2, -s * 0.4, s * 0.2, -s * 0.08) + L(-s * 0.2, -s * 0.08) + Q(-s * 0.2, -s * 0.4, -s * 0.04, -s * 0.5) + Q(-s * 0.2, -s * 0.6, -s * 0.2, -s * 0.92) + 'Z', '#e2eef0', { opacity: 0.6 }),
    sh(M(-s * 0.12, -s * 0.68) + L(s * 0.12, -s * 0.68) + Q(s * 0.06, -s * 0.56, 0, -s * 0.52) + Q(-s * 0.06, -s * 0.56, -s * 0.12, -s * 0.68) + 'Z', sand),
    sh(M(-s * 0.19, -s * 0.09) + Q(0, -s * 0.3, s * 0.19, -s * 0.09) + 'Z', sand), stroke(line([[0, -s * 0.5], [0, -s * 0.2]]), sand, 1.2),
    sh(rect(-s * 0.28, -s * 0.92, s * 0.05, s * 0.84) + rect(s * 0.23, -s * 0.92, s * 0.05, s * 0.84), frame),
  ];
}

/** Popcorn in a striped paper bucket, height s. */
export function popcornBucket(s: number, stripe = K.red, seed = 7): Shape[] {
  const g = rng(seed);
  let st = '';
  for (let i = 0; i < 4; i++) { const t0 = i / 4, t1 = t0 + 0.125; st += poly([[-s * 0.34 + s * 0.68 * t0, -s * 0.62], [-s * 0.34 + s * 0.68 * t1, -s * 0.62], [-s * 0.24 + s * 0.48 * t1, 0], [-s * 0.24 + s * 0.48 * t0, 0]]); }
  const pop: string[] = ['', ''];
  for (let i = 0; i < 22; i++) { const x = g.range(-s * 0.34, s * 0.34), y = -s * 0.62 - g.range(0, s * 0.22) * (1 - Math.abs(x) / (s * 0.5)); const r = s * g.range(0.05, 0.08); pop[i % 2] += circle(x, y, r) + circle(x + r * 0.6, y - r * 0.4, r * 0.7) + circle(x - r * 0.5, y - r * 0.5, r * 0.65); }
  return [
    sh(pop[0], '#fbf0cc', { stroke: '#e0c47a', strokeWidth: 0.8 }), sh(pop[1], '#f6e3a4', { stroke: '#d9b860', strokeWidth: 0.8 }),
    sh(poly([[-s * 0.34, -s * 0.62], [s * 0.34, -s * 0.62], [s * 0.24, 0], [-s * 0.24, 0]]), '#fbf6ec'),
    sh(st, stripe),
    stroke(poly([[-s * 0.34, -s * 0.62], [s * 0.34, -s * 0.62], [s * 0.24, 0], [-s * 0.24, 0]]), shade(stripe, -0.3), 1),
    sh(circle(-s * 0.1, -s * 0.7, s * 0.06) + circle(s * 0.12, -s * 0.66, s * 0.05), '#fbf0cc'),
  ];
}

/** Open pizza box with a pizza (one slice missing), w wide, seen from above at a slant; origin centre. */
export function pizzaBox(w: number, seed: number, missing = true): Shape[] {
  const g = rng(seed);
  const h = w * 0.6;
  const out: Shape[] = [
    sh(poly([[-w * 0.46, -h * 0.5], [w * 0.46, -h * 0.5], [w * 0.42, -h * 1.15], [-w * 0.42, -h * 1.15]]), '#d6b88a', { stroke: '#a8885a', strokeWidth: 1 }),
    sh(poly([[-w * 0.38, -h * 0.6], [w * 0.38, -h * 0.6], [w * 0.35, -h * 1.05], [-w * 0.35, -h * 1.05]]), '#e4cba0'),
    sh(xf(poly([[-w * 0.5, -h * 0.5], [w * 0.5, -h * 0.5], [w * 0.5, h * 0.5], [-w * 0.5, h * 0.5]]), { x: 4, y: 5 }), '#000000', { opacity: 0.18 }),
    ol(poly([[-w * 0.5, -h * 0.5], [w * 0.5, -h * 0.5], [w * 0.5, h * 0.5], [-w * 0.5, h * 0.5]]), '#dcbf92', 1, -0.3),
    sh(rect(-w * 0.46, -h * 0.44, w * 0.92, h * 0.88), '#c9a878'),
  ];
  const pr = Math.min(w, h) * 0.42;
  const a0 = missing ? 20 : 0, a1 = missing ? 340 : 360;
  out.push(sh(xf(sector(0, 0, pr, a0, a1), { sy: 0.92 }), '#d9984a'), sh(xf(sector(0, 0, pr * 0.86, a0 + 2, a1 - 2), { sy: 0.92 }), '#c8473a'), sh(xf(sector(0, 0, pr * 0.82, a0 + 3, a1 - 3), { sy: 0.92 }), '#f3d07a'));
  let pep = '', olive = '', basil = '';
  for (let i = 0; i < 14; i++) {
    const a = g.range(a0 + 15, a1 - 15) * (Math.PI / 180), r = g.range(pr * 0.15, pr * 0.72);
    const x = Math.cos(a) * r, y = Math.sin(a) * r * 0.92;
    if (i % 3 === 0) olive += circle(x, y, pr * 0.05); else if (i % 3 === 1) pep += circle(x, y, pr * 0.1); else basil += leaf(x, y, pr * 0.14, pr * 0.05, g.range(0, 360));
  }
  out.push(sh(pep, '#b83a2c'), stroke(pep, '#8a2a20', 0.8), sh(olive, '#2b2622'), sh(basil, '#4e8a3e'));
  let cuts = '';
  for (let k = 0; k < 8; k++) { const a = ((a0 + (k * (a1 - a0)) / (missing ? 7 : 8)) * Math.PI) / 180; cuts += line([[0, 0], [Math.cos(a) * pr * 0.86, Math.sin(a) * pr * 0.86 * 0.92]]); }
  out.push(stroke(cuts, '#a8622a', 1, { opacity: 0.6 }));
  return out;
}

/** Single pizza slice, length s, tip pointing right, origin at crust centre. */
export function pizzaSlice(s: number, seed = 3): Shape[] {
  const g = rng(seed);
  const tri = M(0, -s * 0.36) + Q(-s * 0.06, 0, 0, s * 0.36) + L(s, 0) + 'Z';
  let pep = '';
  for (let i = 0; i < 3; i++) pep += circle(s * g.range(0.25, 0.55), s * g.range(-0.12, 0.12), s * 0.07);
  return [
    ol(tri, '#f3d07a', 1, -0.3),
    sh(M(s * 0.08, -s * 0.3) + L(s * 0.95, 0) + L(s * 0.08, s * 0.3) + 'Z', '#f6d98a'),
    sh(pep, '#b83a2c'), sh(circle(s * 0.7, s * 0.02, s * 0.03) + circle(s * 0.4, s * 0.2, s * 0.03), '#2b2622'),
    ol(M(0, -s * 0.38) + Q(-s * 0.12, 0, 0, s * 0.38) + L(s * 0.08, s * 0.34) + Q(-s * 0.03, 0, s * 0.08, -s * 0.34) + 'Z', '#d9984a', 1, -0.35),
  ];
}

/** Fizzy drink can (unbranded), height s. */
export function sodaCan(s: number, col = K.teal, band = '#fbf6ec'): Shape[] {
  const w = s * 0.56;
  return [
    shadow(0, 0, w * 0.6, s * 0.04),
    ol(rect(-w / 2, -s * 0.92, w, s * 0.88, w * 0.12), col, 1, -0.35),
    sh(rect(-w / 2, -s * 0.6, w, s * 0.22), band), sh(circle(0, -s * 0.49, w * 0.14), col),
    ol(rect(-w * 0.42, -s, w * 0.84, s * 0.1, 3), K.chrome, 1, -0.4),
    ol(rect(-w * 0.42, -s * 0.06, w * 0.84, s * 0.06, 3), K.chrome, 1, -0.4),
    hl(rect(-w * 0.34, -s * 0.88, w * 0.1, s * 0.78, 2), 0.35),
  ];
}

/** Score pad with columns of ticks, w wide, origin centre (lying flat). */
export function scorePad(w: number): Shape[] {
  const h = w * 1.3;
  let lines = '', ticks = '';
  for (let i = 0; i < 7; i++) lines += line([[-w * 0.4, -h * 0.28 + i * h * 0.1], [w * 0.4, -h * 0.28 + i * h * 0.1]]);
  for (let i = 0; i < 6; i++) for (let k = 0; k < 2; k++) ticks += line([[-w * 0.25 + k * w * 0.36, -h * 0.24 + i * h * 0.1], [-w * 0.12 + k * w * 0.36 - (i % 3) * 3, -h * 0.24 + i * h * 0.1 + 2]]);
  return [
    sh(rect(-w / 2 + 3, -h / 2 + 3, w, h, 2), '#000000', { opacity: 0.12 }),
    ol(rect(-w / 2, -h / 2, w, h, 2), '#fdf8e6', 1, -0.25),
    sh(rect(-w / 2, -h / 2, w, h * 0.1, 2), K.red),
    stroke(lines, '#9ac0d8', 1), stroke(line([[0, -h * 0.36], [0, h * 0.42]]), '#e0a0a0', 1),
    stroke(ticks, '#3b3532', 1.4),
  ];
}

/** Pencil, length l, origin centre, horizontal (tip to the right). */
export function pencil(l: number, col = K.mustard): Shape[] {
  const w = l * 0.08;
  return [
    ol(rect(-l / 2, -w / 2, l * 0.78, w, 1), col, 1, -0.35),
    sh(rect(-l / 2, -w * 0.1, l * 0.78, w * 0.2), shade(col, 0.25)),
    sh(rect(-l / 2 - l * 0.06, -w / 2, l * 0.06, w, 1), '#e8a0a8'), sh(rect(-l / 2, -w / 2, l * 0.04, w), K.chrome),
    sh(poly([[l * 0.28, -w / 2], [l / 2, 0], [l * 0.28, w / 2]]), '#e6c49a'), sh(poly([[l * 0.43, -w * 0.15], [l / 2, 0], [l * 0.43, w * 0.15]]), '#3b3532'),
  ];
}

/** Arrow spinner on a round card, radius r, origin centre. */
export function spinner(r: number): Shape[] {
  const cols = [K.red, K.mustard, K.teal, '#7f9f6a'];
  const out: Shape[] = [sh(circle(2, 3, r), '#000000', { opacity: 0.15 })];
  cols.forEach((c, i) => out.push(sh(sector(0, 0, r, i * 90, i * 90 + 90), c)));
  out.push(stroke(circle(0, 0, r), '#3b3532', 1.4), ol(poly([[-r * 0.2, r * 0.12], [r * 0.75, -r * 0.4], [r * 0.12, r * 0.2]]), '#2b2622', 1), sh(circle(0, 0, r * 0.12), K.chrome));
  return out;
}

/** Dog bone chew, length l, origin centre. */
export function bone(l: number, col = '#f2e6cc'): Shape[] {
  const r = l * 0.13;
  return [ol(rect(-l * 0.36, -r * 0.6, l * 0.72, r * 1.2) + circle(-l * 0.38, -r * 0.65, r) + circle(-l * 0.38, r * 0.65, r) + circle(l * 0.38, -r * 0.65, r) + circle(l * 0.38, r * 0.65, r), col, 1, -0.3), sh(rect(-l * 0.36, -r * 0.6, l * 0.72, r * 1.2), col)];
}

/** Tennis ball, radius r, origin centre. */
export function tennisBall(r: number): Shape[] {
  return [ol(circle(0, 0, r), '#d6e04a', 1, -0.35), stroke(M(-r * 0.7, -r * 0.7) + Q(0, 0, -r * 0.7, r * 0.7) + M(r * 0.7, -r * 0.7) + Q(0, 0, r * 0.7, r * 0.7), '#fbf6ec', r * 0.12), hl(circle(-r * 0.35, -r * 0.35, r * 0.2), 0.35)];
}

/** Lying dog, head to the left resting on its paws, length s. */
export function lyingDog(s: number, col = '#c98a4a', patch = '#fbf0dc'): Shape[] {
  const dk = shade(col, -0.28);
  return [
    shadow(0, 0, s * 0.52, s * 0.05),
    stroke(M(s * 0.42, -s * 0.12) + Q(s * 0.6, -s * 0.1, s * 0.62, -s * 0.24), col, s * 0.06),
    ol(blob([[-s * 0.22, 0], [-s * 0.26, -s * 0.18], [-s * 0.08, -s * 0.3], [s * 0.2, -s * 0.3], [s * 0.42, -s * 0.22], [s * 0.48, -s * 0.06], [s * 0.4, 0]], 0.9), col, 1.2, -0.25),
    sh(blob([[s * 0.24, -s * 0.06], [s * 0.3, -s * 0.2], [s * 0.42, -s * 0.18], [s * 0.44, -s * 0.04], [s * 0.36, 0]], 0.9), dk, { opacity: 0.5 }),
    ol(ellipse(s * 0.38, -s * 0.03, s * 0.1, s * 0.035), col, 1, -0.3),
    ol(ellipse(-s * 0.3, -s * 0.02, s * 0.16, s * 0.035) + ellipse(-s * 0.26, -s * 0.06, s * 0.14, s * 0.03), patch, 1, -0.2),
    ol(blob([[-s * 0.2, -s * 0.06], [-s * 0.26, -s * 0.22], [-s * 0.4, -s * 0.26], [-s * 0.52, -s * 0.18], [-s * 0.52, -s * 0.08], [-s * 0.36, -s * 0.05]], 0.9), col, 1.2, -0.25),
    sh(blob([[-s * 0.42, -s * 0.12], [-s * 0.52, -s * 0.16], [-s * 0.55, -s * 0.1], [-s * 0.46, -s * 0.07]], 0.9), patch),
    ol(blob([[-s * 0.28, -s * 0.24], [-s * 0.2, -s * 0.22], [-s * 0.18, -s * 0.08], [-s * 0.24, -s * 0.06], [-s * 0.3, -s * 0.16]], 0.9), dk, 1, -0.2),
    sh(ellipse(-s * 0.55, -s * 0.12, s * 0.025, s * 0.02), '#2b2622'),
    stroke(curve([[-s * 0.42, -s * 0.19], [-s * 0.39, -s * 0.18], [-s * 0.36, -s * 0.19]]), '#2b2622', s * 0.012),
    sh(rect(-s * 0.24, -s * 0.12, s * 0.04, s * 0.06, 2), K.red),
  ];
}

/** Candle in a glass jar, height s. */
export function jarCandle(s: number, wax = '#f0dcc0', lit = true): Shape[] {
  const out: Shape[] = [];
  if (lit) out.push(sh(circle(0, -s * 0.9, s * 0.6), K.glow, { opacity: 0.25 }));
  out.push(sh(rect(-s * 0.34, -s * 0.8, s * 0.68, s * 0.8, s * 0.1), '#e2eef0', { opacity: 0.45 }), sh(rect(-s * 0.3, -s * 0.52, s * 0.6, s * 0.5, s * 0.08), wax), sh(ellipse(0, -s * 0.52, s * 0.3, s * 0.06), shade(wax, 0.2)));
  out.push(ol(rect(-s * 0.26, -s * 0.38, s * 0.52, s * 0.2, 2), '#fbf6ec', 0.6, -0.2), sh(leaf(-s * 0.1, -s * 0.28, s * 0.2, s * 0.05, -20), '#7f9f6a'));
  out.push(stroke(rect(-s * 0.34, -s * 0.8, s * 0.68, s * 0.8, s * 0.1), '#8aa0a8', 1), stroke(line([[0, -s * 0.54], [0, -s * 0.62]]), '#2b2622', 1.2));
  if (lit) out.push(sh(blob([[0, -s * 0.6], [-s * 0.06, -s * 0.7], [0, -s * 0.86], [s * 0.06, -s * 0.7]], 1), K.amber), sh(blob([[0, -s * 0.62], [-s * 0.03, -s * 0.68], [0, -s * 0.76], [s * 0.03, -s * 0.68]], 1), '#fff3c4'));
  return out;
}

/** Bowl of snacks (pretzels / crisps) seen from the side, width w. */
export function snackBowl(w: number, col: string, food: string, seed: number): Shape[] {
  const g = rng(seed);
  let bits = '';
  for (let i = 0; i < 14; i++) bits += ellipse(g.range(-w * 0.4, w * 0.4), -w * 0.3 - g.range(0, w * 0.12), w * 0.08, w * 0.05, g.range(0, 180));
  return [sh(bits, food, { stroke: shade(food, -0.3), strokeWidth: 0.8 }), ol(M(-w / 2, -w * 0.3) + Q(-w * 0.48, 0, 0, 0) + Q(w * 0.48, 0, w / 2, -w * 0.3) + 'Z', col, 1, -0.3), sh(M(-w * 0.46, -w * 0.22) + Q(0, -w * 0.12, w * 0.46, -w * 0.22) + L(w * 0.44, -w * 0.16) + Q(0, -w * 0.06, -w * 0.44, -w * 0.16) + 'Z', shade(col, 0.4))];
}

/** Window view of a city street at night or day: brick buildings with windows. Draws inside (x, y, w, h). */
export function cityView(x: number, y: number, w: number, h: number, seed: number, night: boolean, sky: string): Shape[] {
  const g = rng(seed);
  const out: Shape[] = [sh(rect(x, y, w, h), sky)];
  let bx = x - 10;
  const lit: string[] = ['', ''];
  let dark = '', fire = '', sills = '';
  const bCols = night ? ['#4a3a48', '#3e3644', '#55424a', '#463c52'] : ['#b5654a', '#c27a58', '#a0573f', '#c98f6a', '#9a6a58'];
  while (bx < x + w) {
    const bw = g.range(w * 0.22, w * 0.42), top = y + g.range(h * 0.05, h * 0.35);
    const col = g.pick(bCols);
    out.push(sh(rect(Math.max(x, bx), top, Math.min(x + w, bx + bw) - Math.max(x, bx), y + h - top), col));
    out.push(sh(rect(Math.max(x, bx), top - 6, Math.min(x + w, bx + bw) - Math.max(x, bx), 8), shade(col, -0.25)));
    for (let wy = top + 18; wy < y + h - 20; wy += 42) for (let wx = bx + 12; wx < bx + bw - 22; wx += 30) {
      if (wx < x || wx + 16 > x + w) continue;
      const r = rect(wx, wy, 16, 24);
      if (night ? g.next() < 0.45 : g.next() < 0.15) lit[g.int(0, 1)] += r; else dark += r;
      sills += rect(wx - 2, wy + 24, 20, 3);
    }
    if (g.next() < 0.5) for (let fy = top + 50; fy < y + h - 30; fy += 84) { const fx = bx + bw * 0.3; if (fx > x && fx + 50 < x + w) fire += rect(fx, fy, 50, 3) + line([[fx, fy], [fx, fy - 30]]) + line([[fx + 50, fy], [fx + 50, fy - 30]]) + line([[fx + 10, fy], [fx + 40, fy - 42]]); }
    bx += bw + g.range(-4, 6);
  }
  out.push(sh(dark, night ? '#2a2632' : '#5a6a78'), sh(lit[0], night ? '#f6d27a' : '#a9c8d8'), sh(lit[1], night ? '#f2b860' : '#c4dae4'), sh(sills, night ? '#2a2430' : '#e8dccc', { opacity: 0.7 }));
  if (fire) out.push(stroke(fire, night ? '#1e1a22' : '#3b3532', 2));
  return out.filter((p) => p.d);
}

/** Abstract framed art print, w × h, origin top-left. variant picks the motif. */
export function artPrint(w: number, h: number, variant: number, frame = '#2b2622', bg = '#f5ead2'): Shape[] {
  const out: Shape[] = [sh(rect(4, 6, w, h), '#000000', { opacity: 0.12 }), sh(rect(0, 0, w, h), frame), sh(rect(w * 0.08, h * 0.08, w * 0.84, h * 0.84), bg)];
  const cx = w / 2, cy = h / 2;
  if (variant === 0) out.push(sh(circle(cx - w * 0.1, cy - h * 0.08, w * 0.22), K.mustard), sh(rect(cx - w * 0.05, cy, w * 0.32, h * 0.3), K.teal), sh(sector(cx - w * 0.2, cy + h * 0.3, w * 0.18, 180, 360), K.red));
  else if (variant === 1) { for (let i = 0; i < 4; i++) out.push(stroke(curve([[w * 0.14, h * 0.25 + i * h * 0.16], [w * 0.4, h * 0.18 + i * h * 0.16], [w * 0.6, h * 0.3 + i * h * 0.16], [w * 0.86, h * 0.22 + i * h * 0.16]]), [K.rose, K.teal, K.mustard, K.navy][i], w * 0.04)); }
  else if (variant === 2) { out.push(sh(rect(w * 0.08, cy + h * 0.1, w * 0.84, h * 0.32), '#9cc0c8'), sh(circle(cx + w * 0.12, cy - h * 0.12, w * 0.14), '#f2b250'), sh(poly([[w * 0.08, cy + h * 0.12], [cx - w * 0.1, cy - h * 0.15], [cx + w * 0.2, cy + h * 0.12]]), '#7f9f6a')); }
  else { let lv = ''; for (let i = 0; i < 7; i++) lv += leaf(cx, h * 0.82, h * 0.3 + (i % 3) * h * 0.05, w * 0.06, -90 + (i - 3) * 20); out.push(stroke(line([[cx, h * 0.84], [cx, h * 0.3]]), K.greenDk, 1.4), sh(lv, K.green)); }
  return out;
}

/** Wooden wall shelf bracket pair plus board, origin top-left of board. */
export function wallShelf(w: number, col = K.woodLt, bracket = '#3b3532'): Shape[] {
  return [sh(rect(0, 10, w, 6), '#000000', { opacity: 0.12 }), sh(poly([[w * 0.12, 10], [w * 0.12 + 4, 10], [w * 0.12 + 4, 34], [w * 0.12 - 18, 10]]) + poly([[w * 0.88, 10], [w * 0.88 - 4, 10], [w * 0.88 - 4, 34], [w * 0.88 + 18, 10]]), bracket), ol(rect(0, 0, w, 10, 2), col, 1, -0.3)];
}

/** Cream scarf draped over something, length l; origin at the top centre. */
export function scarf(l: number, col = K.red, stripe = K.cream): Shape[] {
  const a = M(-l * 0.12, 0) + Q(-l * 0.16, l * 0.5, -l * 0.1, l) + L(l * 0.04, l) + Q(-l * 0.02, l * 0.5, l * 0.04, 0) + 'Z';
  const b = M(l * 0.02, 0) + Q(l * 0.12, l * 0.4, l * 0.1, l * 0.8) + L(l * 0.22, l * 0.78) + Q(l * 0.24, l * 0.38, l * 0.16, 0) + 'Z';
  let fr = '';
  for (let i = 0; i < 5; i++) fr += line([[-l * 0.1 + i * l * 0.035, l], [-l * 0.1 + i * l * 0.035, l * 1.08]]) + line([[l * 0.1 + i * l * 0.03, l * 0.79], [l * 0.11 + i * l * 0.03, l * 0.87]]);
  return [ol(b, shade(col, -0.1), 1, -0.3), ol(a, col, 1, -0.3), sh(rect(-l * 0.14, l * 0.62, l * 0.18, l * 0.06) + rect(-l * 0.14, l * 0.74, l * 0.18, l * 0.06), stripe, { opacity: 0.9 }), stroke(fr, col, 2)];
}

void mix; void petal; void ellipse;
