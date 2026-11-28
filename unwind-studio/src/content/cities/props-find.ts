// Shared props for the "City Lights" hidden-object scenes.
// Every prop is drawn around the origin and returns Shape[]; position it with place().
// Unless noted, a prop stands on y = 0 and is centred on x = 0; `s` is roughly its width.
import { rect, ellipse, circle, poly, line, curve, blob, leaf, petal, star, sector, sh, stroke, shade, mix, xf, type Rng } from '../../art/kit';
import type { Shape } from '../../art/types';

export type Pt = [number, number];
const n = (v: number) => String(Math.round(v * 10) / 10);
export const M = (x: number, y: number) => `M${n(x)} ${n(y)}`;
export const L = (x: number, y: number) => `L${n(x)} ${n(y)}`;
export const Q = (cx: number, cy: number, x: number, y: number) => `Q${n(cx)} ${n(cy)} ${n(x)} ${n(y)}`;
export const C = (ax: number, ay: number, bx: number, by: number, x: number, y: number) => `C${n(ax)} ${n(ay)} ${n(bx)} ${n(by)} ${n(x)} ${n(y)}`;

/** Filled shape with a darker outline of the same hue. */
export const ol = (d: string, fill: string, w = 1, amt = -0.35): Shape => sh(d, fill, { stroke: shade(fill, amt), strokeWidth: w });
export const shadow = (cx: number, cy: number, rx: number, ry: number, o = 0.22): Shape => sh(ellipse(cx, cy, rx, ry), '#1a1420', { opacity: o });
const hl = (d: string, o = 0.35): Shape => sh(d, '#ffffff', { opacity: o });

// =====================================================================
// scenery helpers
// =====================================================================

/** A city block face: body with a grid of windows, some lit. Drawn from (0,0) top-left. */
export function building(w: number, h: number, body: string, g: Rng, opt: { lit?: number; litCol?: string; darkCol?: string; ww?: number; wh?: number; gx?: number; gy?: number; top?: number } = {}): Shape[] {
  const ww = opt.ww ?? 12, wh = opt.wh ?? 16, gx = opt.gx ?? 24, gy = opt.gy ?? 30, top = opt.top ?? 18;
  let lit = '', dark = '';
  const cols = Math.max(1, Math.floor((w - 10) / gx));
  const off = (w - cols * gx) / 2 + (gx - ww) / 2;
  for (let y = top; y + wh < h - 6; y += gy)
    for (let i = 0; i < cols; i++) {
      const r = rect(off + i * gx, y, ww, wh, 1.5);
      if (g.next() < (opt.lit ?? 0.45)) lit += r; else dark += r;
    }
  const out = [sh(rect(0, 0, w, h), body)];
  if (dark) out.push(sh(dark, opt.darkCol ?? shade(body, -0.25)));
  if (lit) out.push(sh(lit, opt.litCol ?? '#ffd27a'));
  return out;
}

/** Bricks laid over a rectangle (mortar lines only). */
export function brickLines(x: number, y: number, w: number, h: number, bw: number, bh: number, col: string, width = 1): Shape {
  let d = '';
  for (let r = 0, yy = y; yy < y + h; r++, yy += bh) {
    d += line([[x, yy], [x + w, yy]]);
    for (let xx = x + (r % 2 ? bw / 2 : 0); xx < x + w; xx += bw) d += line([[xx, yy], [xx, Math.min(y + h, yy + bh)]]);
  }
  return stroke(d, col, width);
}

/** A sagging string of round bulbs from a to b, glowing with gradient `glowId`. */
export function bulbString(a: Pt, b: Pt, sag: number, count: number, glowId: string, cols = ['#ffe6a0', '#ffd27a', '#fff1c8'], r = 5): Shape[] {
  const at = (t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t + Math.sin(Math.PI * t) * sag];
  const pts: Pt[] = [];
  for (let i = 0; i <= 30; i++) pts.push(at(i / 30));
  const out: Shape[] = [stroke(curve(pts), '#2a2230', 1.4)];
  let glow = '', caps = '';
  const bulbs: string[] = cols.map(() => '');
  for (let i = 0; i < count; i++) {
    const [x, y] = at((i + 0.5) / count);
    glow += circle(x, y + r + 3, r * 3.4);
    caps += rect(x - r * 0.45, y, r * 0.9, r * 0.8, 1);
    bulbs[i % cols.length] += ellipse(x, y + r * 1.6, r * 0.8, r);
  }
  out.push(sh(glow, `url(#${glowId})`, { opacity: 0.32 }), sh(caps, '#3a3036'));
  bulbs.forEach((d, i) => d && out.push(sh(d, cols[i])));
  return out;
}

/** Bushy plant made of leaves fanning from (0,0) upward. */
export function leafyPlant(h: number, cols: string[], g: Rng, count = 14, spread = 70, wid = 0.22): Shape[] {
  const ds = cols.map(() => '');
  for (let i = 0; i < count; i++) {
    const a = -90 + g.range(-spread, spread), len = h * g.range(0.55, 1);
    ds[i % cols.length] += leaf(g.range(-h * 0.08, h * 0.08), 0, len, len * wid, a);
  }
  return ds.map((d, i) => sh(d, cols[i]));
}

/** Tapered terracotta pot, rim at y = -h. */
export function pot(w: number, h: number, col = '#c8673e'): Shape[] {
  return [
    ol(poly([[-w * 0.42, -h * 0.86], [w * 0.42, -h * 0.86], [w * 0.32, 0], [-w * 0.32, 0]]), col, 1, -0.3),
    ol(rect(-w / 2, -h, w, h * 0.2, 2), shade(col, 0.1), 1, -0.3),
    sh(poly([[-w * 0.3, -h * 0.8], [-w * 0.2, -h * 0.8], [-w * 0.16, -h * 0.06], [-w * 0.24, -h * 0.06]]), '#ffffff', { opacity: 0.15 }),
  ];
}

/** Small flower heads scattered above a shrub. */
export function flowerDots(w: number, h: number, col: string, g: Rng, count = 10, r = 5): Shape[] {
  let d = '', c = '';
  for (let i = 0; i < count; i++) {
    const x = g.range(-w / 2, w / 2), y = -g.range(h * 0.4, h);
    for (let k = 0; k < 5; k++) d += petal(x, y, r, r * 0.55, k * 72 + g.range(0, 30));
    c += circle(x, y, r * 0.35);
  }
  return [sh(d, col), sh(c, '#f6d46a')];
}

/** Bistro chair seen from the front, standing on y = 0. */
export function bistroChair(s: number, col = '#2f4a3a'): Shape[] {
  const w = s;
  return [
    stroke(line([[-w * 0.34, 0], [-w * 0.3, -w * 0.82]]) + line([[w * 0.34, 0], [w * 0.3, -w * 0.82]]) + line([[-w * 0.24, 0], [-w * 0.22, -w * 0.78]]) + line([[w * 0.24, 0], [w * 0.22, -w * 0.78]]), col, w * 0.05),
    stroke(line([[-w * 0.32, -w * 0.3], [w * 0.32, -w * 0.3]]), col, w * 0.03),
    stroke(M(-w * 0.3, -w * 0.82) + L(-w * 0.32, -w * 1.5) + Q(0, -w * 1.66, w * 0.32, -w * 1.5) + L(w * 0.3, -w * 0.82), col, w * 0.05),
    stroke(line([[-w * 0.3, -w * 1.2], [w * 0.3, -w * 1.2]]) + line([[-w * 0.3, -w * 1.32], [w * 0.3, -w * 1.32]]), col, w * 0.03),
    ol(rect(-w * 0.4, -w * 0.88, w * 0.8, w * 0.1, w * 0.04), shade(col, 0.15), 1),
  ];
}

/** Small round café table with a pedestal, top surface at y = -h. */
export function cafeTable(w: number, h: number, top = '#e8e0d0', leg = '#2f3436'): Shape[] {
  return [
    shadow(0, 0, w * 0.4, w * 0.06),
    sh(poly([[-w * 0.28, 0], [w * 0.28, 0], [w * 0.06, -w * 0.06], [-w * 0.06, -w * 0.06]]), leg),
    sh(rect(-w * 0.035, -h, w * 0.07, h), leg),
    ol(ellipse(0, -h, w / 2, w * 0.1), top, 1, -0.25),
    sh(rect(-w / 2, -h, w, w * 0.05), shade(top, -0.2)),
    sh(ellipse(0, -h - w * 0.01, w / 2, w * 0.09), top),
  ];
}

/** Plane tree trunk with patchy bark, from y = 0 up to y = -h. */
export function planeTrunk(w: number, h: number, g: Rng): Shape[] {
  const out: Shape[] = [sh(poly([[-w * 0.6, 0], [-w * 0.45, -h * 0.2], [-w * 0.5, -h], [w * 0.5, -h], [w * 0.45, -h * 0.2], [w * 0.6, 0]]), '#9a9078')];
  let p1 = '', p2 = '';
  for (let i = 0; i < Math.round(h / 22); i++) {
    const x = g.range(-w * 0.4, w * 0.4), y = -g.range(10, h - 10), r = g.range(w * 0.1, w * 0.22);
    const d = blob([[x - r, y], [x, y - r * 1.4], [x + r, y], [x, y + r * 1.3]], 0.9);
    if (i % 2) p1 += d; else p2 += d;
  }
  out.push(sh(p1, '#c9c3a2'), sh(p2, '#6f6a58'), sh(rect(w * 0.18, -h, w * 0.24, h * 0.98), '#000000', { opacity: 0.12 }));
  return out;
}

/** Clump of foliage blobs around (0,0) of radius r. */
export function foliage(r: number, cols: string[], g: Rng, count = 18): Shape[] {
  const ds = cols.map(() => '');
  for (let i = 0; i < count; i++) {
    const a = g.range(0, Math.PI * 2), d = g.range(0, r * 0.75), x = Math.cos(a) * d, y = Math.sin(a) * d * 0.7, rr = g.range(r * 0.22, r * 0.4);
    ds[i % cols.length] += blob([[x - rr, y], [x - rr * 0.5, y - rr * 0.9], [x + rr * 0.6, y - rr * 0.85], [x + rr, y + rr * 0.1], [x + rr * 0.3, y + rr * 0.8], [x - rr * 0.6, y + rr * 0.7]], 1);
  }
  return ds.map((d, i) => sh(d, cols[i]));
}

/** Book spines standing on y = 0 from x = 0 to width w. */
export function bookRow(w: number, hMin: number, hMax: number, g: Rng, cols: string[]): Shape[] {
  const ds = cols.map(() => '');
  let bands = '';
  for (let x = 0; x < w - 4; ) {
    const bw = Math.min(g.range(6, 13), w - x), bh = g.range(hMin, hMax), k = g.int(0, cols.length - 1);
    ds[k] += rect(x, -bh, bw - 0.8, bh, 1);
    if (g.next() < 0.6) bands += rect(x + 1, -bh * 0.82, bw - 2.8, 2) + rect(x + 1, -bh * 0.22, bw - 2.8, 1.6);
    x += bw;
  }
  const out = ds.map((d, i) => sh(d, cols[i]));
  out.push(sh(bands, '#f2dca0', { opacity: 0.75 }));
  return out;
}

/** Simple seated person seen from behind (on a stool), seat at y = 0. */
export function seatedBack(s: number, shirt: string, hair: string, skin = '#d9a27a'): Shape[] {
  const w = s;
  return [
    ol(blob([[-w * 0.42, 0], [-w * 0.46, -w * 0.5], [-w * 0.3, -w * 0.88], [w * 0.3, -w * 0.88], [w * 0.46, -w * 0.5], [w * 0.42, 0]], 0.7), shirt, 1, -0.3),
    sh(rect(-w * 0.1, -w * 1.0, w * 0.2, w * 0.16), shade(skin, -0.1)),
    sh(circle(0, -w * 1.14, w * 0.24), skin),
    sh(blob([[-w * 0.26, -w * 1.1], [-w * 0.22, -w * 1.36], [0, -w * 1.42], [w * 0.22, -w * 1.36], [w * 0.26, -w * 1.1], [w * 0.2, -w * 0.98], [-w * 0.2, -w * 0.98]], 0.9), hair),
    sh(poly([[-w * 0.08, -w * 0.88], [w * 0.08, -w * 0.88], [0, -w * 0.4]]), shade(shirt, -0.15), { opacity: 0.5 }),
  ];
}

/** Hand-painted block letters for a sign; returns a stroke path (letter cell w × h). */
export function letters(word: string, w: number, h: number, gap: number): string {
  let d = '', x = 0;
  for (const ch of word) {
    const a = x, b = x + w, m = x + w / 2;
    switch (ch) {
      case 'D': d += M(a, 0) + L(a, h) + L(a + w * 0.4, h) + Q(b, h, b, h / 2) + Q(b, 0, a + w * 0.4, 0) + 'Z'; break;
      case 'I': d += line([[a + w * 0.2, 0], [a + w * 0.2, h]]); break;
      case 'N': d += line([[a, h], [a, 0], [b, h], [b, 0]]); break;
      case 'E': d += line([[b, 0], [a, 0], [a, h], [b, h]]) + line([[a, h / 2], [b - w * 0.2, h / 2]]); break;
      case 'R': d += line([[a, h], [a, 0], [a + w * 0.55, 0]]) + Q(b, 0, b, h * 0.26) + Q(b, h * 0.52, a + w * 0.55, h * 0.52) + L(a, h * 0.52) + M(a + w * 0.45, h * 0.52) + L(b, h); break;
      case 'A': d += line([[a, h], [m, 0], [b, h]]) + line([[a + w * 0.22, h * 0.62], [b - w * 0.22, h * 0.62]]); break;
      case 'T': d += line([[a, 0], [b, 0]]) + line([[m, 0], [m, h]]); break;
      case 'O': d += ellipse(m, h / 2, w / 2, h / 2); break;
      case 'S': d += M(b, h * 0.12) + Q(b - w * 0.2, 0, m, 0) + Q(a, 0, a, h * 0.26) + Q(a, h * 0.48, m, h * 0.5) + Q(b, h * 0.52, b, h * 0.75) + Q(b, h, m, h) + Q(a + w * 0.1, h, a, h * 0.86); break;
      case 'P': d += line([[a, h], [a, 0], [a + w * 0.55, 0]]) + Q(b, 0, b, h * 0.27) + Q(b, h * 0.54, a + w * 0.55, h * 0.54) + L(a, h * 0.54); break;
      case 'K': d += line([[a, 0], [a, h]]) + line([[b, 0], [a, h * 0.55]]) + line([[a + w * 0.3, h * 0.4], [b, h]]); break;
      case 'U': d += M(a, 0) + L(a, h * 0.7) + Q(a, h, m, h) + Q(b, h, b, h * 0.7) + L(b, 0); break;
      case 'C': d += M(b, h * 0.15) + Q(b - w * 0.15, 0, m, 0) + Q(a, 0, a, h / 2) + Q(a, h, m, h) + Q(b - w * 0.15, h, b, h * 0.85); break;
      case 'F': d += line([[b, 0], [a, 0], [a, h]]) + line([[a, h / 2], [b - w * 0.25, h / 2]]); break;
      case 'H': d += line([[a, 0], [a, h]]) + line([[b, 0], [b, h]]) + line([[a, h / 2], [b, h / 2]]); break;
      case 'L': d += line([[a, 0], [a, h], [b, h]]); break;
      case 'V': d += line([[a, 0], [m, h], [b, 0]]); break;
      case 'G': d += M(b, h * 0.15) + Q(b - w * 0.15, 0, m, 0) + Q(a, 0, a, h / 2) + Q(a, h, m, h) + Q(b, h, b, h * 0.6) + L(m + w * 0.05, h * 0.6); break;
      case 'Y': d += line([[a, 0], [m, h * 0.5], [b, 0]]) + line([[m, h * 0.5], [m, h]]); break;
      case 'B': d += M(a, 0) + L(a, h) + L(a + w * 0.55, h) + Q(b, h, b, h * 0.74) + Q(b, h * 0.48, a + w * 0.5, h * 0.48) + L(a, h * 0.48) + M(a + w * 0.5, h * 0.48) + Q(b - w * 0.05, h * 0.46, b - w * 0.05, h * 0.24) + Q(b - w * 0.05, 0, a + w * 0.5, 0) + L(a, 0); break;
      default: break;
    }
    x += (ch === 'I' ? w * 0.4 : w) + gap;
  }
  return d;
}
export const lettersWidth = (word: string, w: number, gap: number) => [...word].reduce((s, ch) => s + (ch === 'I' ? w * 0.4 : w) + gap, -gap);

// =====================================================================
// Rooftop garden targets
// =====================================================================

/** Sitting cat facing us; s = body width; height about 1.15·s. */
export function cat(s: number, col = '#3a3440', eye = '#f2c84a'): Shape[] {
  const w = s, d = shade(col, -0.3);
  return [
    stroke(curve([[w * 0.28, -w * 0.06], [w * 0.56, -w * 0.06], [w * 0.62, -w * 0.3], [w * 0.5, -w * 0.5]]), col, w * 0.1),
    sh(blob([[-w * 0.32, 0], [-w * 0.4, -w * 0.32], [-w * 0.24, -w * 0.68], [w * 0.22, -w * 0.7], [w * 0.38, -w * 0.32], [w * 0.32, 0]], 0.9), col),
    sh(ellipse(0, -w * 0.3, w * 0.13, w * 0.24), mix(col, '#ffffff', 0.18)),
    sh(poly([[-w * 0.24, -w * 0.86], [-w * 0.22, -w * 1.14], [-w * 0.04, -w * 1.0]]) + poly([[w * 0.24, -w * 0.86], [w * 0.22, -w * 1.14], [w * 0.04, -w * 1.0]]), col),
    sh(poly([[-w * 0.19, -w * 0.94], [-w * 0.19, -w * 1.06], [-w * 0.09, -w * 0.99]]) + poly([[w * 0.19, -w * 0.94], [w * 0.19, -w * 1.06], [w * 0.09, -w * 0.99]]), '#e8a0a8'),
    sh(ellipse(0, -w * 0.84, w * 0.27, w * 0.23), col),
    sh(ellipse(-w * 0.1, -w * 0.87, w * 0.055, w * 0.065) + ellipse(w * 0.1, -w * 0.87, w * 0.055, w * 0.065), eye),
    sh(ellipse(-w * 0.1, -w * 0.87, w * 0.018, w * 0.055) + ellipse(w * 0.1, -w * 0.87, w * 0.018, w * 0.055), '#1a1418'),
    sh(poly([[-w * 0.035, -w * 0.78], [w * 0.035, -w * 0.78], [0, -w * 0.745]]), '#e8a0a8'),
    stroke(line([[-w * 0.06, -w * 0.75], [-w * 0.34, -w * 0.78]]) + line([[-w * 0.06, -w * 0.73], [-w * 0.32, -w * 0.7]]) + line([[w * 0.06, -w * 0.75], [w * 0.34, -w * 0.78]]) + line([[w * 0.06, -w * 0.73], [w * 0.32, -w * 0.7]]), '#e8e0e8', 0.8, { opacity: 0.7 }),
    sh(ellipse(-w * 0.13, -w * 0.03, w * 0.09, w * 0.045) + ellipse(w * 0.13, -w * 0.03, w * 0.09, w * 0.045), d),
  ];
}

/** Watering can, s = overall width (spout to handle). */
export function wateringCan(s: number, col = '#3f8a8a'): Shape[] {
  const w = s * 0.5, h = s * 0.46;
  return [
    shadow(0, 0, w * 0.7, s * 0.04),
    stroke(M(-w * 0.3, -h) + Q(-w * 0.05, -h * 1.5, w * 0.35, -h * 1.0), shade(col, -0.2), s * 0.05),
    ol(poly([[w * 0.36, -h * 0.35], [s * 0.66, -h * 1.15], [s * 0.7, -h * 1.08], [w * 0.4, -h * 0.12]]), col, 1),
    ol(xf(ellipse(0, 0, s * 0.06, s * 0.045), { rot: -55, x: s * 0.68, y: -h * 1.14 }), shade(col, -0.15), 1),
    ol(rect(-w / 2, -h, w, h, s * 0.06), col, 1.2),
    sh(rect(-w / 2, -h * 0.7, w, h * 0.12), shade(col, -0.18)),
    stroke(M(-w / 2, -h * 0.75) + Q(-w * 1.0, -h * 0.7, -w * 0.5, -h * 0.25), shade(col, -0.25), s * 0.045),
    hl(rect(-w * 0.36, -h * 0.9, w * 0.1, h * 0.75, 2), 0.25),
  ];
}

/** Brass telescope on a tripod; s = height. */
export function telescope(s: number): Shape[] {
  const h = s;
  return [
    stroke(line([[0, -h * 0.55], [-h * 0.28, 0]]) + line([[0, -h * 0.55], [h * 0.28, 0]]) + line([[0, -h * 0.55], [h * 0.04, 0]]), '#4a3428', h * 0.035),
    sh(circle(0, -h * 0.56, h * 0.05), '#3a2a22'),
    ...[
      ol(rect(-h * 0.32, -h * 0.07, h * 0.42, h * 0.14, 3), '#c9963a', 1),
      ol(rect(h * 0.1, -h * 0.09, h * 0.36, h * 0.18, 3), '#d8a84a', 1),
      ol(rect(h * 0.42, -h * 0.11, h * 0.12, h * 0.22, 3), '#8a5a2a', 1),
      sh(rect(-h * 0.42, -h * 0.05, h * 0.1, h * 0.1, 2), '#3a2a22'),
      sh(rect(h * 0.0, -h * 0.07, h * 0.03, h * 0.14) + rect(h * 0.3, -h * 0.09, h * 0.03, h * 0.18), '#8a5a2a'),
      sh(ellipse(h * 0.54, 0, h * 0.03, h * 0.1), '#9ac0d8'),
      hl(rect(-h * 0.3, -h * 0.06, h * 0.7, h * 0.03), 0.35),
    ].map((p) => ({ ...p, d: xf(p.d, { rot: -28, x: 0, y: -h * 0.62 }) })),
  ];
}

/** Acoustic guitar standing upright; s = height. */
export function guitar(s: number, body = '#d08a3c'): Shape[] {
  const h = s, w = s * 0.38;
  const shape = blob([[0, -h * 0.02], [w * 0.5, -h * 0.12], [w * 0.46, -h * 0.28], [w * 0.3, -h * 0.36], [w * 0.38, -h * 0.47], [w * 0.2, -h * 0.56], [0, -h * 0.56], [-w * 0.2, -h * 0.56], [-w * 0.38, -h * 0.47], [-w * 0.3, -h * 0.36], [-w * 0.46, -h * 0.28], [-w * 0.5, -h * 0.12]], 0.9);
  return [
    ol(shape, body, 1.4, -0.45),
    sh(xf(shape, { s: 0.84, oy: -h * 0.28 }), shade(body, 0.18)),
    sh(rect(-w * 0.07, -h * 0.97, w * 0.14, h * 0.48, 1), '#5a3424'),
    ol(poly([[-w * 0.11, -h], [w * 0.11, -h], [w * 0.09, -h * 0.9], [-w * 0.09, -h * 0.9]]), '#3a2418', 1),
    sh(circle(-w * 0.15, -h * 0.97, w * 0.03) + circle(w * 0.15, -h * 0.97, w * 0.03) + circle(-w * 0.15, -h * 0.93, w * 0.03) + circle(w * 0.15, -h * 0.93, w * 0.03), '#e0c070'),
    sh(circle(0, -h * 0.33, w * 0.12), '#2a1a12'),
    stroke(circle(0, -h * 0.33, w * 0.15), '#7a4a22', 1.4),
    sh(rect(-w * 0.18, -h * 0.17, w * 0.36, h * 0.03, 1), '#3a2418'),
    stroke(line([[-w * 0.04, -h * 0.9], [-w * 0.04, -h * 0.16]]) + line([[w * 0.04, -h * 0.9], [w * 0.04, -h * 0.16]]) + line([[0, -h * 0.9], [0, -h * 0.16]]), '#f2ecd8', 0.6),
  ];
}

/** Round teapot, s = width including spout. */
export function teapot(s: number, col = '#e0605a'): Shape[] {
  const w = s * 0.62, h = s * 0.48;
  return [
    shadow(0, 0, w * 0.55, s * 0.04),
    stroke(M(w * 0.38, -h * 0.66) + Q(w * 0.92, -h * 0.66, w * 0.4, -h * 0.18), shade(col, -0.25), s * 0.06),
    ol(M(-w * 0.4, -h * 0.4) + Q(-w * 0.72, -h * 0.55, -s * 0.5, -h * 0.98) + L(-s * 0.44, -h * 1.0) + Q(-w * 0.62, -h * 0.5, -w * 0.3, -h * 0.2) + 'Z', col, 1),
    ol(ellipse(0, -h * 0.45, w / 2, h * 0.46), col, 1.2),
    ol(ellipse(0, -h * 0.88, w * 0.26, h * 0.07), shade(col, -0.1), 1),
    ol(circle(0, -h * 0.98, s * 0.04), shade(col, 0.1), 1),
    sh(rect(-w * 0.48, -h * 0.5, w * 0.96, h * 0.08), '#f6e6c8', { opacity: 0.85 }),
    hl(ellipse(-w * 0.2, -h * 0.6, w * 0.1, h * 0.14, -20)),
  ];
}

/** Pillar candle in a glass jar with a glow; s = width. */
export function candleJar(s: number, glowId: string): Shape[] {
  const w = s, h = s * 1.2;
  return [
    sh(circle(0, -h * 0.7, w * 1.4), `url(#${glowId})`, { opacity: 0.8 }),
    sh(rect(-w * 0.32, -h * 0.66, w * 0.64, h * 0.66, 2), '#f6ead2'),
    sh(ellipse(0, -h * 0.66, w * 0.32, w * 0.06), '#fff6e2'),
    stroke(line([[0, -h * 0.66], [0, -h * 0.74]]), '#2a1a12', 1.2),
    sh(petal(0, -h * 0.72, w * 0.3, w * 0.1, -90), '#ffb84a'),
    sh(petal(0, -h * 0.73, w * 0.18, w * 0.05, -90), '#fff2b0'),
    sh(rect(-w / 2, -h * 0.82, w, h * 0.82, w * 0.14), '#cfe6e8', { opacity: 0.35, stroke: '#9ab8c0', strokeWidth: 1 }),
    sh(rect(-w * 0.52, -h * 0.86, w * 1.04, h * 0.08, 2), '#b88a4a'),
    hl(rect(-w * 0.38, -h * 0.74, w * 0.08, h * 0.6, 2), 0.4),
  ];
}

/** Wooden birdhouse on a post; s = width of the house. */
export function birdhouse(s: number, col = '#5c8fb0', roof = '#c8473a', postLen = 1.6): Shape[] {
  const w = s, h = s * 0.9;
  return [
    sh(rect(-w * 0.07, -postLen * s, w * 0.14, postLen * s), '#6a4a32'),
    ol(poly([[-w * 0.4, -postLen * s], [w * 0.4, -postLen * s], [w * 0.4, -postLen * s - h * 0.7], [0, -postLen * s - h * 1.1], [-w * 0.4, -postLen * s - h * 0.7]]), col, 1.2),
    ol(poly([[-w * 0.58, -postLen * s - h * 0.62], [0, -postLen * s - h * 1.2], [w * 0.58, -postLen * s - h * 0.62], [w * 0.5, -postLen * s - h * 0.56], [0, -postLen * s - h * 1.06], [-w * 0.5, -postLen * s - h * 0.56]]), roof, 1),
    sh(circle(0, -postLen * s - h * 0.55, w * 0.13), '#2a1e18'),
    sh(rect(-w * 0.03, -postLen * s - h * 0.36, w * 0.06, h * 0.14), '#6a4a32'),
    sh(rect(-w * 0.4, -postLen * s - h * 0.12, w * 0.8, h * 0.1), shade(col, -0.2)),
  ];
}

/** Open book lying flat-ish; s = width. Centred on (0,0). */
export function openBook(s: number, cover = '#3f6a8a'): Shape[] {
  const w = s, h = s * 0.42;
  let lines = '';
  for (let i = 0; i < 5; i++) {
    const y = -h * 0.28 + i * h * 0.13;
    lines += line([[-w * 0.4, y], [-w * 0.08, y + h * 0.04]]) + line([[w * 0.08, y + h * 0.04], [w * 0.4, y]]);
  }
  return [
    ol(M(-w / 2, -h * 0.4) + Q(-w * 0.25, -h * 0.5, 0, -h * 0.34) + Q(w * 0.25, -h * 0.5, w / 2, -h * 0.4) + L(w / 2, h * 0.45) + Q(w * 0.25, h * 0.36, 0, h * 0.5) + Q(-w * 0.25, h * 0.36, -w / 2, h * 0.45) + 'Z', cover, 1),
    sh(M(-w * 0.46, -h * 0.44) + Q(-w * 0.24, -h * 0.56, 0, -h * 0.4) + L(0, h * 0.4) + Q(-w * 0.24, h * 0.26, -w * 0.46, h * 0.36) + 'Z', '#fbf4e2'),
    sh(M(w * 0.46, -h * 0.44) + Q(w * 0.24, -h * 0.56, 0, -h * 0.4) + L(0, h * 0.4) + Q(w * 0.24, h * 0.26, w * 0.46, h * 0.36) + 'Z', '#f2e8d0'),
    stroke(lines, '#a89a80', 1),
    stroke(line([[0, -h * 0.4], [0, h * 0.4]]), '#c8b89a', 1),
    sh(poly([[w * 0.2, -h * 0.5], [w * 0.26, -h * 0.5], [w * 0.26, h * 0.1], [w * 0.23, h * 0.04], [w * 0.2, h * 0.1]]), '#c8322a'),
  ];
}

/** Pair of fluffy slippers seen from above; s = width of the pair. Centred. */
export function slippers(s: number, col = '#e88aa0'): Shape[] {
  const one = (x: number, r: number): Shape[] => {
    const d = xf(blob([[0, -s * 0.36], [s * 0.15, -s * 0.24], [s * 0.15, s * 0.22], [0, s * 0.34], [-s * 0.15, s * 0.22], [-s * 0.15, -s * 0.24]], 1), { x, rot: r });
    const band = xf(blob([[-s * 0.16, -s * 0.08], [0, -s * 0.18], [s * 0.16, -s * 0.08], [s * 0.15, s * 0.08], [-s * 0.15, s * 0.08]], 0.9), { x, rot: r, y: -s * 0.08 });
    return [ol(d, '#f6e6e8', 1, -0.25), ol(band, col, 1), sh(xf(circle(0, -s * 0.06, s * 0.07), { x, rot: r, y: -s * 0.12 }), shade(col, 0.4))];
  };
  return [...one(-s * 0.22, -8), ...one(s * 0.22, 8)];
}

/** Owl perched; s = width; feet at y = 0. */
export function owl(s: number, col = '#9a7050'): Shape[] {
  const w = s;
  return [
    sh(blob([[-w * 0.42, 0], [-w * 0.5, -w * 0.5], [-w * 0.36, -w * 0.96], [w * 0.36, -w * 0.96], [w * 0.5, -w * 0.5], [w * 0.42, 0]], 0.9), col),
    sh(poly([[-w * 0.38, -w * 0.94], [-w * 0.44, -w * 1.2], [-w * 0.18, -w * 1.0]]) + poly([[w * 0.38, -w * 0.94], [w * 0.44, -w * 1.2], [w * 0.18, -w * 1.0]]), shade(col, -0.2)),
    sh(ellipse(0, -w * 0.34, w * 0.28, w * 0.3), '#e8d4b0'),
    stroke(curve([[-w * 0.14, -w * 0.42], [-w * 0.07, -w * 0.38], [0, -w * 0.42]]) + curve([[0, -w * 0.42], [w * 0.07, -w * 0.38], [w * 0.14, -w * 0.42]]) + curve([[-w * 0.12, -w * 0.28], [-w * 0.05, -w * 0.24], [w * 0.02, -w * 0.28]]) + curve([[w * 0.02, -w * 0.28], [w * 0.08, -w * 0.24], [w * 0.14, -w * 0.28]]), '#b89a70', 1),
    sh(circle(-w * 0.17, -w * 0.72, w * 0.16) + circle(w * 0.17, -w * 0.72, w * 0.16), '#f6ead2'),
    sh(circle(-w * 0.17, -w * 0.72, w * 0.09) + circle(w * 0.17, -w * 0.72, w * 0.09), '#f2b83a'),
    sh(circle(-w * 0.17, -w * 0.72, w * 0.05) + circle(w * 0.17, -w * 0.72, w * 0.05), '#1a1418'),
    sh(poly([[-w * 0.05, -w * 0.64], [w * 0.05, -w * 0.64], [0, -w * 0.52]]), '#e0a040'),
    sh(leaf(-w * 0.42, -w * 0.62, w * 0.6, w * 0.16, 78) + leaf(w * 0.42, -w * 0.62, w * 0.6, w * 0.16, 102), shade(col, -0.18)),
    sh(ellipse(-w * 0.14, 0, w * 0.08, w * 0.04) + ellipse(w * 0.14, 0, w * 0.08, w * 0.04), '#e0a040'),
  ];
}

/** Diamond kite with a ribbon tail; s = kite height. Centred on the kite's middle. */
export function kite(s: number, a = '#e2563f', b = '#f2c84a'): Shape[] {
  const h = s, w = s * 0.7;
  return [
    stroke(curve([[0, h * 0.55], [w * 0.2, h * 0.8], [-w * 0.15, h * 1.0], [w * 0.1, h * 1.25]]), '#3a3036', 1.2),
    sh(xf(poly([[0, -6], [6, 0], [0, 6], [-6, 0]]), { x: w * 0.12, y: h * 0.78, s: s / 60 }) + xf(poly([[0, -6], [6, 0], [0, 6], [-6, 0]]), { x: -w * 0.08, y: h * 0.98, s: s / 60 }) + xf(poly([[0, -6], [6, 0], [0, 6], [-6, 0]]), { x: w * 0.06, y: h * 1.18, s: s / 60 }), a),
    sh(poly([[0, -h * 0.55], [w / 2, -h * 0.1], [0, 0]]) + poly([[0, 0], [-w / 2, -h * 0.1], [0, h * 0.55]]), a, { stroke: shade(a, -0.35), strokeWidth: 1 }),
    sh(poly([[0, -h * 0.55], [-w / 2, -h * 0.1], [0, 0]]) + poly([[0, 0], [w / 2, -h * 0.1], [0, h * 0.55]]), b, { stroke: shade(b, -0.35), strokeWidth: 1 }),
    stroke(line([[0, -h * 0.55], [0, h * 0.55]]) + line([[-w / 2, -h * 0.1], [w / 2, -h * 0.1]]), '#5a3a22', 1.2),
  ];
}

/** Retro transistor radio; s = width. */
export function radio(s: number, col = '#3f8a7a'): Shape[] {
  const w = s, h = s * 0.62;
  let grille = '';
  for (let i = 0; i < 5; i++) grille += line([[-w * 0.4, -h * 0.75 + i * h * 0.12], [-w * 0.02, -h * 0.75 + i * h * 0.12]]);
  return [
    shadow(0, 0, w * 0.55, s * 0.05),
    stroke(M(-w * 0.32, -h) + L(-w * 0.26, -h * 1.3) + L(w * 0.26, -h * 1.3) + L(w * 0.32, -h), '#c8c0b0', s * 0.04),
    stroke(line([[w * 0.36, -h], [w * 0.62, -h * 1.9]]), '#c8c0b0', s * 0.02),
    ol(rect(-w / 2, -h, w, h, s * 0.1), col, 1.2),
    sh(rect(-w * 0.44, -h * 0.84, w * 0.48, h * 0.62, 4), '#f2e6c8'),
    stroke(grille, '#b8a888', 1.6),
    sh(circle(w * 0.24, -h * 0.62, w * 0.12), '#f2e6c8'),
    sh(circle(w * 0.24, -h * 0.62, w * 0.05), shade(col, -0.3)),
    sh(rect(w * 0.12, -h * 0.34, w * 0.26, h * 0.1, 2), '#e8b84a'),
    hl(rect(-w * 0.46, -h * 0.96, w * 0.9, h * 0.06, 2), 0.25),
  ];
}

/** Sunflower; s = flower head diameter; stem down to y = 0 with stemLen. */
export function sunflower(s: number, stemLen: number): Shape[] {
  const r = s / 2;
  let pet = '', pet2 = '';
  for (let i = 0; i < 14; i++) { pet += leaf(0, 0, r, r * 0.3, i * (360 / 14)); pet2 += leaf(0, 0, r * 0.82, r * 0.26, i * (360 / 14) + 13); }
  return [
    stroke(line([[0, 0], [0, stemLen]]), '#4f7a3f', Math.max(2, s * 0.08)),
    sh(leaf(0, stemLen * 0.55, s * 0.55, s * 0.18, -30) + leaf(0, stemLen * 0.35, s * 0.5, s * 0.16, -150), '#5c8a45'),
    sh(xf(pet, { y: 0 }), '#f2b72e'),
    sh(pet2, '#f6cf4a'),
    sh(circle(0, 0, r * 0.38), '#6a3a1e'),
    sh(circle(-r * 0.08, -r * 0.08, r * 0.2), '#8a5028'),
  ].map((p, i) => (i < 2 ? { ...p, d: xf(p.d, { y: -stemLen }) } : { ...p, d: xf(p.d, { y: -stemLen }) }));
}

// =====================================================================
// River quay targets
// =====================================================================

/** Beret seen from the side, on y = 0; s = width. */
export function beret(s: number, col = '#3a3a4a'): Shape[] {
  const w = s;
  return [
    ol(M(-w / 2, 0) + Q(-w * 0.52, -w * 0.36, -w * 0.05, -w * 0.38) + Q(w * 0.52, -w * 0.36, w / 2, 0) + Q(0, w * 0.08, -w / 2, 0) + 'Z', col, 1.2, -0.45),
    stroke(line([[0, -w * 0.38], [w * 0.03, -w * 0.48]]), col, w * 0.04),
    sh(rect(-w * 0.44, -w * 0.06, w * 0.88, w * 0.07, 2), shade(col, -0.3)),
    hl(ellipse(-w * 0.18, -w * 0.24, w * 0.14, w * 0.05, -12), 0.2),
  ];
}

/** Open umbrella with a crook handle; s = canopy width. Handle tip at y = 0. */
export function umbrella(s: number, col = '#c8322a', alt = '#f2e6d0'): Shape[] {
  const w = s, top = -w * 1.05;
  let a = '', b = '';
  const seg = 6;
  for (let i = 0; i < seg; i++) {
    const x0 = -w / 2 + (w * i) / seg, x1 = x0 + w / seg;
    const d = M(0, top) + Q((x0 + 0) / 2 - w * 0.02, top + w * 0.02, x0, top + w * 0.36) + Q((x0 + x1) / 2, top + w * 0.28, x1, top + w * 0.36) + Q((x1 + 0) / 2 + w * 0.02, top + w * 0.02, 0, top) + 'Z';
    if (i % 2) a += d; else b += d;
  }
  return [
    stroke(M(0, top) + L(0, -w * 0.12) + Q(0, w * 0.02, w * 0.1, w * 0.0) + Q(w * 0.16, -w * 0.04, w * 0.14, -w * 0.12), '#4a3428', w * 0.04),
    sh(b, col, { stroke: shade(col, -0.35), strokeWidth: 1 }),
    sh(a, alt, { stroke: shade(col, -0.35), strokeWidth: 1 }),
    sh(circle(0, top - w * 0.03, w * 0.03), '#4a3428'),
  ];
}

/** Pigeon standing, facing right; s = length. Feet at y = 0. */
export function pigeon(s: number, col = '#8a8ea0'): Shape[] {
  const w = s;
  return [
    sh(poly([[-w * 0.5, -w * 0.38], [-w * 0.2, -w * 0.32], [-w * 0.24, -w * 0.24]]), shade(col, -0.35)),
    ol(blob([[-w * 0.36, -w * 0.32], [-w * 0.1, -w * 0.5], [w * 0.2, -w * 0.48], [w * 0.3, -w * 0.3], [w * 0.1, -w * 0.12], [-w * 0.2, -w * 0.18]], 0.9), col, 1, -0.3),
    sh(blob([[w * 0.12, -w * 0.46], [w * 0.22, -w * 0.62], [w * 0.36, -w * 0.62], [w * 0.36, -w * 0.48], [w * 0.28, -w * 0.32]], 0.9), mix(col, '#5a8a7a', 0.45)),
    sh(circle(w * 0.3, -w * 0.64, w * 0.11), shade(col, -0.05)),
    sh(leaf(-w * 0.26, -w * 0.38, w * 0.42, w * 0.08, 8), shade(col, -0.18)),
    stroke(line([[-w * 0.18, -w * 0.4], [w * 0.0, -w * 0.38]]) + line([[-w * 0.14, -w * 0.33], [w * 0.04, -w * 0.32]]), shade(col, -0.45), 1.2),
    sh(poly([[w * 0.4, -w * 0.66], [w * 0.52, -w * 0.62], [w * 0.4, -w * 0.6]]), '#e0b080'),
    sh(circle(w * 0.33, -w * 0.67, w * 0.025), '#e86a2a'),
    stroke(line([[0, -w * 0.14], [-w * 0.02, 0]]) + line([[w * 0.08, -w * 0.14], [w * 0.1, 0]]) + line([[-w * 0.08, 0], [w * 0.04, 0]]) + line([[w * 0.04, 0], [w * 0.16, 0]]), '#d86a5a', 1.4),
  ];
}

/** Baguette lying on a diagonal; s = length. Centred. */
export function baguette(s: number, rot = -20): Shape[] {
  const w = s, h = s * 0.14;
  let cuts = '';
  for (let i = 0; i < 5; i++) cuts += leaf(-w * 0.34 + i * w * 0.16, -h * 0.04, w * 0.12, h * 0.16, -14);
  return [
    ol(rect(-w / 2, -h / 2, w, h, h / 2), '#d8a458', 1, -0.35),
    sh(rect(-w / 2 + 2, -h / 2, w - 4, h * 0.4, h / 3), '#e8bc72'),
    sh(cuts, '#f6dca0'),
  ].map((p) => ({ ...p, d: xf(p.d, { rot }) }));
}

/** Upright bicycle side view with a basket; s = wheelbase width; wheels on y = 0. */
export function bicycle(s: number, frame = '#3f7d6a'): Shape[] {
  const r = s * 0.22, x1 = -s * 0.36, x2 = s * 0.36, y = -r;
  const spokes = (cx: number) => { let d = ''; for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI; d += line([[cx + Math.cos(a) * r * 0.9, y + Math.sin(a) * r * 0.9], [cx - Math.cos(a) * r * 0.9, y - Math.sin(a) * r * 0.9]]); } return d; };
  const seat: Pt = [-s * 0.12, -r * 2.5], bar: Pt = [s * 0.26, -r * 2.75], crank: Pt = [-s * 0.02, y];
  return [
    stroke(spokes(x1) + spokes(x2), '#b8b8b8', 0.8),
    stroke(circle(x1, y, r) + circle(x2, y, r), '#2a2a2e', s * 0.03),
    stroke(line([[x1, y], crank, [seat[0] + s * 0.02, seat[1] + r * 0.2]]) + line([crank, [bar[0] - s * 0.04, bar[1] + r * 0.3]]) + line([[seat[0] + s * 0.02, seat[1] + r * 0.35], [bar[0] - s * 0.03, bar[1] + r * 0.45]]) + line([[x1, y], [seat[0] + s * 0.02, seat[1] + r * 0.35]]) + line([[x2, y], [bar[0] - s * 0.04, bar[1] + r * 0.3]]), frame, s * 0.028),
    stroke(line([[bar[0] - s * 0.04, bar[1] + r * 0.3], bar]) + M(bar[0] - s * 0.06, bar[1]) + Q(bar[0] + s * 0.02, bar[1] - r * 0.2, bar[0] + s * 0.06, bar[1] + r * 0.1), '#2a2a2e', s * 0.02),
    sh(ellipse(seat[0], seat[1], s * 0.07, s * 0.022), '#4a3024'),
    sh(circle(crank[0], crank[1], s * 0.035), '#6a6a6a'),
    ol(poly([[bar[0] + s * 0.02, bar[1] + r * 0.32], [bar[0] + s * 0.24, bar[1] + r * 0.32], [bar[0] + s * 0.21, bar[1] + r * 1.05], [bar[0] + s * 0.05, bar[1] + r * 1.05]]), '#c99a5b', 1, -0.4),
    stroke(line([[bar[0] + s * 0.04, bar[1] + r * 0.6], [bar[0] + s * 0.22, bar[1] + r * 0.6]]) + line([[bar[0] + s * 0.09, bar[1] + r * 0.32], [bar[0] + s * 0.1, bar[1] + r * 1.05]]) + line([[bar[0] + s * 0.16, bar[1] + r * 0.32], [bar[0] + s * 0.16, bar[1] + r * 1.05]]), '#8a6a3a', 1),
    sh(leaf(bar[0] + s * 0.1, bar[1] + r * 0.36, s * 0.14, s * 0.03, -70) + leaf(bar[0] + s * 0.14, bar[1] + r * 0.36, s * 0.12, s * 0.03, -100), '#e8bc72'),
    sh(circle(bar[0] + s * 0.18, bar[1] + r * 0.24, s * 0.03) + circle(bar[0] + s * 0.07, bar[1] + r * 0.22, s * 0.028), '#e85a6a'),
  ];
}

/** Accordion; s = width. Sits on y = 0. */
export function accordion(s: number, col = '#c8322a'): Shape[] {
  const w = s, h = s * 0.7;
  let folds = '';
  for (let i = 0; i < 7; i++) { const x = -w * 0.14 + i * w * 0.05; folds += line([[x, -h * 0.96], [x + w * 0.025, -h * 0.5], [x, -h * 0.04]]); }
  let keys = '', btn = '';
  for (let i = 0; i < 7; i++) keys += rect(-w * 0.46, -h * 0.9 + i * h * 0.12, w * 0.18, h * 0.1, 1);
  for (let i = 0; i < 6; i++) btn += circle(w * 0.36, -h * 0.84 + i * h * 0.14, w * 0.025) + circle(w * 0.43, -h * 0.78 + i * h * 0.14, w * 0.025);
  return [
    shadow(0, 0, w * 0.5, s * 0.04),
    ol(rect(-w * 0.18, -h * 0.98, w * 0.36, h * 0.96, 2), '#2a2a32', 1),
    stroke(folds, '#d8d0c0', 1.2),
    ol(rect(-w / 2, -h, w * 0.32, h, 4), col, 1.2),
    ol(rect(w * 0.18, -h, w * 0.32, h, 4), col, 1.2),
    sh(keys, '#f6f0e2'),
    sh(btn, '#f2e6c8'),
    sh(rect(-w * 0.5, -h * 1.02, w * 0.32, h * 0.06) + rect(w * 0.18, -h * 1.02, w * 0.32, h * 0.06), '#d8b44a'),
  ];
}

/** Painter's palette with paint blobs and a brush; s = width. Centred. */
export function paintPalette(s: number): Shape[] {
  const w = s, h = s * 0.72;
  const body = blob([[-w / 2, 0], [-w * 0.36, -h * 0.46], [w * 0.1, -h * 0.5], [w * 0.46, -h * 0.24], [w * 0.44, h * 0.24], [w * 0.1, h * 0.46], [-w * 0.2, h * 0.32], [-w * 0.12, h * 0.1], [-w * 0.3, h * 0.18]], 0.85);
  const cols = ['#d8362c', '#f2c23c', '#3f7fc0', '#4f9a4f', '#f6f0e2', '#9a4aa0'];
  const pos: Pt[] = [[-w * 0.26, -h * 0.18], [-w * 0.02, -h * 0.3], [w * 0.22, -h * 0.22], [w * 0.32, h * 0.04], [w * 0.22, h * 0.26], [w * 0.0, h * 0.24]];
  return [
    ol(body, '#d6a86a', 1.2, -0.4),
    sh(ellipse(-w * 0.17, h * 0.02, w * 0.06, h * 0.07), '#8a6a42'),
    ...cols.map((c, i) => sh(blob([[pos[i][0] - w * 0.06, pos[i][1]], [pos[i][0], pos[i][1] - w * 0.06], [pos[i][0] + w * 0.06, pos[i][1] + w * 0.01], [pos[i][0] + w * 0.01, pos[i][1] + w * 0.055]], 1), c)),
    stroke(line([[-w * 0.1, h * 0.42], [w * 0.42, -h * 0.4]]), '#6a3a22', w * 0.035),
    sh(xf(petal(0, 0, w * 0.1, w * 0.03, 0), { rot: -56, x: w * 0.42, y: -h * 0.4 }), '#2a2a2a'),
  ];
}

/** Croissant; s = width. Centred. */
export function croissant(s: number): Shape[] {
  const w = s;
  const body = M(-w * 0.5, w * 0.16) + Q(-w * 0.42, -w * 0.26, 0, -w * 0.28) + Q(w * 0.42, -w * 0.26, w * 0.5, w * 0.16) + Q(w * 0.3, w * 0.02, w * 0.2, w * 0.1) + Q(0, w * 0.16, -w * 0.2, w * 0.1) + Q(-w * 0.3, w * 0.02, -w * 0.5, w * 0.16) + 'Z';
  let ridges = '';
  for (const x of [-0.3, -0.12, 0.08, 0.26]) ridges += M(x * w - w * 0.04, -w * 0.22 + Math.abs(x) * w * 0.2) + Q(x * w + w * 0.06, -w * 0.06, x * w + w * 0.0, w * 0.12 - Math.abs(x) * w * 0.05);
  return [
    ol(body, '#e0a04a', 1.2, -0.4),
    sh(M(-w * 0.36, -w * 0.06) + Q(0, -w * 0.32, w * 0.36, -w * 0.06) + Q(0, -w * 0.18, -w * 0.36, -w * 0.06) + 'Z', '#f0c070'),
    stroke(ridges, '#a8682a', 1.6),
    hl(ellipse(-w * 0.06, -w * 0.2, w * 0.1, w * 0.03), 0.35),
  ];
}

/** Cup of coffee on a saucer; s = saucer width. Sits on y = 0. */
export function coffeeCup(s: number, col = '#f6f0e2', band = '#2f6b8a'): Shape[] {
  const w = s;
  return [
    ol(ellipse(0, -w * 0.04, w / 2, w * 0.1), col, 1, -0.25),
    stroke(M(w * 0.26, -w * 0.38) + Q(w * 0.46, -w * 0.36, w * 0.24, -w * 0.16), shade(col, -0.25), w * 0.05),
    ol(M(-w * 0.3, -w * 0.46) + L(w * 0.3, -w * 0.46) + Q(w * 0.28, -w * 0.08, 0, -w * 0.08) + Q(-w * 0.28, -w * 0.08, -w * 0.3, -w * 0.46) + 'Z', col, 1, -0.25),
    sh(rect(-w * 0.29, -w * 0.38, w * 0.58, w * 0.06), band),
    sh(ellipse(0, -w * 0.46, w * 0.3, w * 0.06), '#6a3a22'),
    sh(ellipse(0, -w * 0.46, w * 0.15, w * 0.025), '#c8945a'),
  ];
}

/** Fishing rod leaning; s = length. Butt at (0,0), tip up-right. */
export function fishingRod(s: number): Shape[] {
  const tip: Pt = [s * 0.42, -s * 0.9];
  return [
    stroke(line([[0, 0], tip]), '#5a3a22', s * 0.016),
    stroke(line([[0, 0], [s * 0.08, -s * 0.17]]), '#2a2a2e', s * 0.03),
    stroke(curve([tip, [s * 0.5, -s * 0.6], [s * 0.52, -s * 0.3]]), '#e8e8e8', 0.8),
    sh(circle(s * 0.08, -s * 0.12, s * 0.045), '#b8b8b8', { stroke: '#6a6a6a', strokeWidth: 1 }),
    sh(circle(s * 0.08, -s * 0.12, s * 0.015), '#4a4a4a'),
    sh(ellipse(s * 0.52, -s * 0.28, s * 0.022, s * 0.032), '#e8443a'),
    sh(ellipse(s * 0.52, -s * 0.3, s * 0.022, s * 0.012), '#ffffff'),
  ];
}

/** Ring lifebuoy; s = diameter. Centred. */
export function lifebuoy(s: number, a = '#e8553a', b = '#f6f0e2'): Shape[] {
  const r = s / 2;
  return [
    sh(sector(0, 0, r, 0, 360, r * 0.55), b, { stroke: '#8a8478', strokeWidth: 1 }),
    sh(sector(0, 0, r, 20, 70, r * 0.55) + sector(0, 0, r, 110, 160, r * 0.55) + sector(0, 0, r, 200, 250, r * 0.55) + sector(0, 0, r, 290, 340, r * 0.55), a),
    stroke(circle(0, 0, r * 0.78), '#c8b89a', 1.2),
  ];
}

/** Magnifying glass; s = length. Lens centred on (0,0), handle down-right. */
export function magnifier(s: number): Shape[] {
  const r = s * 0.3;
  return [
    stroke(line([[r * 0.7, r * 0.7], [s * 0.62, s * 0.62]]), '#5a3424', s * 0.09),
    stroke(line([[r * 0.7, r * 0.7], [r * 1.0, r * 1.0]]), '#c9a24a', s * 0.1),
    sh(circle(0, 0, r), '#cfe6ee', { opacity: 0.75 }),
    stroke(circle(0, 0, r), '#c9a24a', s * 0.06),
    hl(ellipse(-r * 0.3, -r * 0.35, r * 0.3, r * 0.14, -40), 0.6),
  ];
}

/** Sitting poodle, facing left; s = width. Feet on y = 0. */
export function poodle(s: number, col = '#f2ece4'): Shape[] {
  const w = s, d = shade(col, -0.18);
  const sh = (p: string, c: string) => ol(p, c, 1.2, -0.38);
  const puff = (x: number, y: number, r: number) => blob([[x - r, y], [x - r * 0.7, y - r * 0.8], [x, y - r], [x + r * 0.8, y - r * 0.7], [x + r, y], [x + r * 0.6, y + r * 0.8], [x - r * 0.6, y + r * 0.8]], 1);
  return [
    sh(rect(-w * 0.2, -w * 0.4, w * 0.08, w * 0.4) + rect(-w * 0.02, -w * 0.4, w * 0.08, w * 0.4), d),
    sh(puff(-w * 0.16, -w * 0.06, w * 0.1) + puff(w * 0.02, -w * 0.06, w * 0.1), col),
    sh(puff(w * 0.22, -w * 0.18, w * 0.2), col),
    sh(puff(w * 0.46, -w * 0.38, w * 0.08), col),
    stroke(line([[w * 0.32, -w * 0.24], [w * 0.44, -w * 0.36]]), d, w * 0.04),
    sh(puff(-w * 0.04, -w * 0.46, w * 0.24), col),
    sh(rect(-w * 0.24, -w * 0.74, w * 0.14, w * 0.2), d),
    sh(puff(-w * 0.22, -w * 0.8, w * 0.17), col),
    sh(puff(-w * 0.2, -w * 0.98, w * 0.11), col),
    sh(poly([[-w * 0.34, -w * 0.82], [-w * 0.5, -w * 0.76], [-w * 0.48, -w * 0.7], [-w * 0.32, -w * 0.72]]), d),
    sh(circle(-w * 0.49, -w * 0.74, w * 0.03), '#2a1a1a'),
    sh(circle(-w * 0.27, -w * 0.84, w * 0.025), '#2a1a1a'),
    sh(puff(-w * 0.1, -w * 0.76, w * 0.1), shade(col, -0.06)),
    sh(rect(-w * 0.24, -w * 0.66, w * 0.16, w * 0.04, 1), '#d8362c'),
  ];
}

/** Bouquet wrapped in kraft paper; s = height. Stems at y = 0. */
export function bouquet(s: number, g: Rng): Shape[] {
  const h = s;
  const out: Shape[] = [stroke(line([[-h * 0.04, 0], [-h * 0.06, -h * 0.4]]) + line([[h * 0.03, 0], [h * 0.05, -h * 0.4]]) + line([[0, 0], [0, -h * 0.4]]), '#4f7a3f', 2)];
  out.push(sh(leaf(0, -h * 0.5, h * 0.4, h * 0.08, -130) + leaf(0, -h * 0.5, h * 0.4, h * 0.08, -50), '#5c8f4f'));
  const cols = ['#e8556a', '#f2a6b8', '#f6d46a', '#e87a3a', '#fbf4ec'];
  for (let i = 0; i < 7; i++) {
    const x = g.range(-h * 0.2, h * 0.2), y = -h * g.range(0.62, 0.9), r = h * g.range(0.07, 0.1), c = cols[i % cols.length];
    let p = '';
    for (let k = 0; k < 5; k++) p += petal(x, y, r, r * 0.6, k * 72);
    out.push(sh(p, c), sh(circle(x, y, r * 0.35), shade(c, -0.25)));
  }
  out.push(ol(poly([[-h * 0.28, -h * 0.66], [h * 0.28, -h * 0.66], [h * 0.06, -h * 0.08], [-h * 0.06, -h * 0.08]]), '#d8b07a', 1, -0.3));
  out.push(sh(poly([[-h * 0.28, -h * 0.66], [-h * 0.12, -h * 0.66], [-h * 0.03, -h * 0.08], [-h * 0.06, -h * 0.08]]), '#c89a62'));
  out.push(sh(rect(-h * 0.11, -h * 0.3, h * 0.22, h * 0.05, 2), '#e8556a'));
  return out;
}

/** Easel holding a painting; s = height. Feet on y = 0. */
export function easel(s: number, canvas: Shape[]): Shape[] {
  const h = s;
  return [
    stroke(line([[0, -h], [-h * 0.24, 0]]) + line([[0, -h], [h * 0.24, 0]]) + line([[0, -h * 0.9], [h * 0.04, 0]]), '#8a5a32', h * 0.025),
    stroke(line([[-h * 0.2, -h * 0.34], [h * 0.2, -h * 0.34]]), '#6a4024', h * 0.03),
    ...canvas,
  ];
}

// =====================================================================
// Diner targets
// =====================================================================

/** Milkshake in a tall glass with cream and a cherry; s = height. On y = 0. */
export function milkshake(s: number, col = '#f2a6b8'): Shape[] {
  const h = s, w = s * 0.42;
  return [
    stroke(line([[w * 0.08, -h * 0.7], [w * 0.36, -h * 1.12]]), '#e84a4a', w * 0.1),
    stroke(line([[w * 0.14, -h * 0.79], [w * 0.2, -h * 0.88]]) + line([[w * 0.26, -h * 0.97], [w * 0.31, -h * 1.05]]), '#ffffff', w * 0.1),
    sh(blob([[-w * 0.46, -h * 0.72], [-w * 0.36, -h * 0.86], [-w * 0.1, -h * 0.94], [w * 0.16, -h * 0.9], [w * 0.4, -h * 0.82], [w * 0.46, -h * 0.72]], 0.9), '#fffaf2', { stroke: '#e0d8d0', strokeWidth: 1 }),
    sh(circle(0, -h * 0.98, w * 0.12), '#c8203a'),
    stroke(M(0, -h * 1.08) + Q(w * 0.04, -h * 1.16, w * 0.12, -h * 1.18), '#4f7a3f', 1.2),
    sh(poly([[-w * 0.46, -h * 0.72], [w * 0.46, -h * 0.72], [w * 0.22, -h * 0.2], [-w * 0.22, -h * 0.2]]), col),
    sh(poly([[-w * 0.5, -h * 0.74], [w * 0.5, -h * 0.74], [w * 0.24, -h * 0.18], [-w * 0.24, -h * 0.18]]), '#e8f2f4', { opacity: 0.3, stroke: '#a8c0c8', strokeWidth: 1 }),
    sh(rect(-w * 0.06, -h * 0.18, w * 0.12, h * 0.12), '#d8e6ea'),
    sh(ellipse(0, -h * 0.04, w * 0.32, h * 0.05), '#d8e6ea', { stroke: '#a8c0c8', strokeWidth: 1 }),
    hl(poly([[-w * 0.38, -h * 0.68], [-w * 0.28, -h * 0.68], [-w * 0.14, -h * 0.26], [-w * 0.2, -h * 0.26]]), 0.4),
  ];
}

/** Whole cherry pie with lattice top on a plate; s = width. On y = 0. */
export function cherryPie(s: number): Shape[] {
  const w = s, ry = w * 0.2;
  let lat = '';
  for (let i = -2; i <= 2; i++) lat += line([[i * w * 0.14 - w * 0.06, -ry * 1.7], [i * w * 0.14 + w * 0.06, -ry * 0.5]]) + line([[-w * 0.38, -ry * 1.1 + i * ry * 0.22], [w * 0.38, -ry * 1.1 + i * ry * 0.22]]);
  return [
    ol(ellipse(0, -ry * 0.35, w / 2, ry * 0.5), '#f6f0e2', 1, -0.2),
    ol(M(-w * 0.44, -ry * 1.1) + L(-w * 0.38, -ry * 0.4) + Q(0, ry * 0.05, w * 0.38, -ry * 0.4) + L(w * 0.44, -ry * 1.1) + 'Z', '#c88a3a', 1),
    sh(ellipse(0, -ry * 1.1, w * 0.44, ry * 0.62), '#b8202e'),
    sh(circle(-w * 0.12, -ry * 1.2, w * 0.04) + circle(w * 0.14, -ry * 1.0, w * 0.04) + circle(w * 0.02, -ry * 1.36, w * 0.035), '#e03a44'),
    stroke(lat, '#e8b866', w * 0.035),
    stroke(ellipse(0, -ry * 1.1, w * 0.44, ry * 0.62), '#d89a4a', w * 0.04),
  ];
}

/** Ketchup squeeze bottle; s = height. On y = 0. */
export function ketchup(s: number): Shape[] {
  const h = s, w = s * 0.36;
  return [
    ol(rect(-w / 2, -h * 0.78, w, h * 0.78, w * 0.3), '#d8262a', 1, -0.35),
    sh(poly([[-w * 0.3, -h * 0.78], [w * 0.3, -h * 0.78], [w * 0.14, -h * 0.92], [-w * 0.14, -h * 0.92]]), '#f6f0e2'),
    sh(poly([[-w * 0.06, -h * 0.92], [w * 0.06, -h * 0.92], [w * 0.02, -h], [-w * 0.02, -h]]), '#f6f0e2'),
    sh(rect(-w * 0.36, -h * 0.56, w * 0.72, h * 0.26, 3), '#f6f0e2'),
    sh(circle(0, -h * 0.43, w * 0.15), '#e84a3a'),
    sh(leaf(0, -h * 0.5, w * 0.12, w * 0.05, -60), '#4f8a3f'),
    hl(rect(-w * 0.36, -h * 0.74, w * 0.1, h * 0.66, 3), 0.3),
  ];
}

/** Glass coffee pot with an orange handle; s = height. On y = 0. */
export function coffeePot(s: number, lid = '#2a2a2e'): Shape[] {
  const h = s, w = s * 0.7;
  return [
    stroke(M(w * 0.26, -h * 0.72) + L(w * 0.5, -h * 0.68) + L(w * 0.46, -h * 0.28) + L(w * 0.3, -h * 0.3), lid, w * 0.1),
    sh(M(-w * 0.2, -h * 0.74) + L(w * 0.2, -h * 0.74) + Q(w * 0.5, -h * 0.5, w * 0.44, -h * 0.14) + Q(w * 0.4, 0, 0, 0) + Q(-w * 0.4, 0, -w * 0.44, -h * 0.14) + Q(-w * 0.5, -h * 0.5, -w * 0.2, -h * 0.74) + 'Z', '#e8f2f4', { opacity: 0.5, stroke: '#8aa0a8', strokeWidth: 1.2 }),
    sh(M(-w * 0.4, -h * 0.34) + L(w * 0.4, -h * 0.34) + Q(w * 0.44, -h * 0.14, w * 0.4, -h * 0.1) + Q(w * 0.3, 0, 0, 0) + Q(-w * 0.3, 0, -w * 0.4, -h * 0.1) + Q(-w * 0.44, -h * 0.14, -w * 0.4, -h * 0.34) + 'Z', '#5a2e1a'),
    ol(rect(-w * 0.26, -h * 0.86, w * 0.52, h * 0.14, 3), lid, 1),
    sh(poly([[-w * 0.26, -h * 0.8], [-w * 0.42, -h * 0.84], [-w * 0.26, -h * 0.74]]), lid),
    sh(rect(-w * 0.05, -h * 0.94, w * 0.1, h * 0.08, 2), '#e8742a'),
    hl(ellipse(-w * 0.22, -h * 0.5, w * 0.06, h * 0.14, 10), 0.5),
  ];
}

/** Hamburger; s = width. On y = 0. */
export function hamburger(s: number): Shape[] {
  const w = s;
  let seeds = '';
  for (const [x, y] of [[-0.22, -0.62], [-0.05, -0.7], [0.12, -0.64], [0.26, -0.56], [-0.32, -0.52], [0.0, -0.56]] as Pt[]) seeds += ellipse(x * w, y * w, w * 0.025, w * 0.014);
  return [
    ol(rect(-w * 0.46, -w * 0.14, w * 0.92, w * 0.14, w * 0.06), '#d89a4a', 1, -0.3),
    ol(rect(-w * 0.5, -w * 0.26, w, w * 0.12, w * 0.06), '#6a3420', 1),
    sh(poly([[-w * 0.5, -w * 0.28], [w * 0.5, -w * 0.28], [w * 0.4, -w * 0.18], [w * 0.2, -w * 0.26], [0, -w * 0.16], [-w * 0.2, -w * 0.26], [-w * 0.4, -w * 0.18]]), '#f2c23c'),
    sh(rect(-w * 0.44, -w * 0.33, w * 0.88, w * 0.06, 2), '#d8362c'),
    sh(blob([[-w * 0.54, -w * 0.34], [-w * 0.3, -w * 0.4], [0, -w * 0.34], [w * 0.3, -w * 0.4], [w * 0.54, -w * 0.34], [w * 0.3, -w * 0.3], [-w * 0.3, -w * 0.3]], 0.8), '#6aa84f'),
    ol(M(-w * 0.48, -w * 0.36) + Q(-w * 0.46, -w * 0.8, 0, -w * 0.8) + Q(w * 0.46, -w * 0.8, w * 0.48, -w * 0.36) + 'Z', '#e0a04a', 1, -0.3),
    sh(seeds, '#fbf0d0'),
    hl(ellipse(-w * 0.18, -w * 0.66, w * 0.14, w * 0.05, -10), 0.3),
  ];
}

/** Hot dog in a bun with mustard; s = width. Centred on y = 0. */
export function hotDog(s: number): Shape[] {
  const w = s;
  return [
    ol(rect(-w / 2, -w * 0.13, w, w * 0.16, w * 0.08), '#b8442a', 1),
    ol(M(-w * 0.44, -w * 0.06) + Q(-w * 0.46, w * 0.16, 0, w * 0.16) + Q(w * 0.46, w * 0.16, w * 0.44, -w * 0.06) + 'Z', '#e8b466', 1, -0.3),
    stroke(curve([[-w * 0.38, -w * 0.06], [-w * 0.28, -w * 0.12], [-w * 0.18, -w * 0.04], [-w * 0.06, -w * 0.12], [w * 0.06, -w * 0.04], [w * 0.18, -w * 0.12], [w * 0.3, -w * 0.04], [w * 0.38, -w * 0.1]]), '#f2c832', w * 0.035),
  ];
}

/** Ring donut with icing and sprinkles; s = width. Centred. */
export function donut(s: number, icing = '#f29ab4'): Shape[] {
  const r = s / 2;
  const cols = ['#ffffff', '#5ab0e0', '#f2d23c', '#7ac06a', '#e8556a'];
  const out: Shape[] = [
    ol(ellipse(0, 0, r, r * 0.62), '#d8984a', 1, -0.3),
    sh(blob([[-r * 0.92, -r * 0.04], [-r * 0.7, -r * 0.48], [0, -r * 0.6], [r * 0.7, -r * 0.48], [r * 0.92, -r * 0.02], [r * 0.7, r * 0.3], [r * 0.4, r * 0.18], [0, r * 0.34], [-r * 0.5, r * 0.22], [-r * 0.78, r * 0.3]], 0.9), icing),
    sh(ellipse(0, -r * 0.06, r * 0.3, r * 0.17), '#8a5a32'),
  ];
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2, rr = r * (i % 2 ? 0.55 : 0.72);
    out.push(sh(xf(rect(-r * 0.07, -r * 0.022, r * 0.14, r * 0.044, 1), { rot: i * 47, x: Math.cos(a) * rr, y: Math.sin(a) * rr * 0.55 - r * 0.06 }), cols[i % cols.length]));
  }
  return out;
}

/** Fedora hat, side view; s = brim width. On y = 0. */
export function fedora(s: number, col = '#5a4a3a', band = '#2a2228'): Shape[] {
  const w = s;
  return [
    ol(M(-w / 2, -w * 0.06) + Q(-w * 0.2, -w * 0.16, 0, -w * 0.12) + Q(w * 0.2, -w * 0.16, w / 2, -w * 0.06) + Q(w * 0.2, w * 0.02, 0, 0) + Q(-w * 0.2, w * 0.02, -w / 2, -w * 0.06) + 'Z', col, 1.2, -0.4),
    ol(M(-w * 0.3, -w * 0.12) + L(-w * 0.28, -w * 0.42) + Q(-w * 0.12, -w * 0.5, 0, -w * 0.4) + Q(w * 0.12, -w * 0.5, w * 0.28, -w * 0.42) + L(w * 0.3, -w * 0.12) + 'Z', col, 1.2, -0.4),
    sh(M(-w * 0.07, -w * 0.43) + Q(0, -w * 0.36, w * 0.07, -w * 0.43) + L(w * 0.05, -w * 0.38) + Q(0, -w * 0.33, -w * 0.05, -w * 0.38) + 'Z', shade(col, -0.3)),
    sh(rect(-w * 0.295, -w * 0.21, w * 0.59, w * 0.08), band),
    sh(rect(w * 0.18, -w * 0.21, w * 0.04, w * 0.08), '#c84a3a'),
  ];
}

/** Folded newspaper; s = width. Centred. */
export function newspaper(s: number, rot = -6): Shape[] {
  const w = s, h = s * 0.68;
  let txt = '';
  for (let i = 0; i < 6; i++) txt += line([[-w * 0.42, -h * 0.1 + i * h * 0.09], [-w * 0.04, -h * 0.1 + i * h * 0.09]]) + line([[w * 0.04, -h * 0.1 + i * h * 0.09], [w * 0.42, -h * 0.1 + i * h * 0.09]]);
  return [
    sh(rect(-w / 2 + 3, -h / 2 + 3, w, h, 2), '#000000', { opacity: 0.18 }),
    ol(rect(-w / 2, -h / 2, w, h, 2), '#f2ece0', 1, -0.3),
    sh(rect(-w * 0.44, -h * 0.42, w * 0.88, h * 0.16, 1), '#3a3a3a'),
    sh(rect(-w * 0.42, -h * 0.2, w * 0.38, h * 0.04), '#6a6a6a'),
    sh(rect(w * 0.06, -h * 0.2, w * 0.36, h * 0.3), '#a8b0b8'),
    stroke(txt, '#9a9a9a', 1),
    stroke(line([[0, -h * 0.22], [0, h * 0.46]]), '#c8c0b0', 1),
  ].map((p) => ({ ...p, d: xf(p.d, { rot }) }));
}

/** Vinyl record with a red label; s = diameter. Centred. */
export function vinylRecord(s: number, label = '#d8362c'): Shape[] {
  const r = s / 2;
  return [
    sh(circle(0, 0, r), '#1e1c20'),
    stroke(circle(0, 0, r * 0.85) + circle(0, 0, r * 0.7) + circle(0, 0, r * 0.55), '#3a3640', 1),
    sh(sector(0, 0, r * 0.95, 200, 240, r * 0.45), '#ffffff', { opacity: 0.12 }),
    sh(circle(0, 0, r * 0.36), label),
    stroke(circle(0, 0, r * 0.26), '#f2e6c8', 1),
    sh(circle(0, 0, r * 0.05), '#f2ece0'),
  ];
}

/** Metal spatula; s = length. Head at left, handle to the right. Centred. */
export function spatula(s: number, rot = 0): Shape[] {
  const w = s;
  return [
    ol(rect(w * 0.02, -w * 0.035, w * 0.48, w * 0.07, w * 0.035), '#2a2a2e', 1),
    sh(circle(w * 0.42, 0, w * 0.015), '#b8b8b8'),
    stroke(line([[-w * 0.16, 0], [w * 0.04, 0]]), '#9aa0a8', w * 0.03),
    ol(rect(-w * 0.5, -w * 0.11, w * 0.36, w * 0.22, 3), '#c8ccd2', 1, -0.3),
    stroke(line([[-w * 0.42, -w * 0.05], [-w * 0.22, -w * 0.05]]) + line([[-w * 0.42, w * 0.05], [-w * 0.22, w * 0.05]]), '#8a9098', 1.4),
  ].map((p) => ({ ...p, d: xf(p.d, { rot }) }));
}

/** Glass salt shaker with a chrome cap; s = height. On y = 0. */
export function saltShaker(s: number): Shape[] {
  const h = s, w = s * 0.5;
  return [
    sh(poly([[-w * 0.4, -h * 0.72], [w * 0.4, -h * 0.72], [w * 0.5, 0], [-w * 0.5, 0]]), '#e8f2f4', { opacity: 0.55, stroke: '#8aa0a8', strokeWidth: 1 }),
    sh(poly([[-w * 0.44, -h * 0.4], [w * 0.44, -h * 0.4], [w * 0.48, -h * 0.03], [-w * 0.48, -h * 0.03]]), '#ffffff'),
    stroke(line([[-w * 0.2, -h * 0.66], [-w * 0.26, -h * 0.06]]) + line([[w * 0.2, -h * 0.66], [w * 0.26, -h * 0.06]]), '#a8c0c8', 1),
    ol(M(-w * 0.42, -h * 0.72) + Q(-w * 0.42, -h, 0, -h) + Q(w * 0.42, -h, w * 0.42, -h * 0.72) + 'Z', '#c8ccd2', 1, -0.35),
    sh(circle(-w * 0.12, -h * 0.86, w * 0.04) + circle(w * 0.12, -h * 0.86, w * 0.04) + circle(0, -h * 0.92, w * 0.04), '#5a5a62'),
  ];
}

/** Stack of pancakes with butter and syrup on a plate; s = width. On y = 0. */
export function pancakes(s: number): Shape[] {
  const w = s;
  const out: Shape[] = [ol(ellipse(0, -w * 0.04, w / 2, w * 0.1), '#f6f0e2', 1, -0.2)];
  for (let i = 0; i < 4; i++) {
    const y = -w * 0.1 - i * w * 0.09;
    out.push(ol(rect(-w * 0.38, y - w * 0.08, w * 0.76, w * 0.1, w * 0.05), i % 2 ? '#d8984a' : '#e0a856', 1, -0.3));
  }
  out.push(
    sh(ellipse(0, -w * 0.46, w * 0.38, w * 0.06), '#e8b466'),
    sh(blob([[-w * 0.34, -w * 0.46], [0, -w * 0.52], [w * 0.34, -w * 0.46], [w * 0.36, -w * 0.3], [w * 0.3, -w * 0.4], [w * 0.1, -w * 0.42], [-w * 0.12, -w * 0.4], [-w * 0.28, -w * 0.42], [-w * 0.36, -w * 0.32]], 0.8), '#a8561e', { opacity: 0.85 }),
    ol(rect(-w * 0.08, -w * 0.56, w * 0.16, w * 0.08, 2), '#fbe08a', 1, -0.2),
  );
  return out;
}

/** Roller skate, side view facing right; s = length. Wheels on y = 0. */
export function rollerSkate(s: number, col = '#f2e6d8', wheel = '#e8556a'): Shape[] {
  const w = s;
  let lace = '';
  for (let i = 0; i < 4; i++) lace += line([[w * 0.02 + i * w * 0.04, -w * 0.5 + i * w * 0.08], [w * 0.14 + i * w * 0.04, -w * 0.46 + i * w * 0.08]]);
  return [
    ol(M(-w * 0.4, -w * 0.2) + L(-w * 0.38, -w * 0.82) + L(-w * 0.04, -w * 0.82) + L(0, -w * 0.5) + Q(w * 0.2, -w * 0.4, w * 0.44, -w * 0.32) + Q(w * 0.52, -w * 0.26, w * 0.46, -w * 0.2) + 'Z', col, 1.2, -0.35),
    sh(rect(-w * 0.4, -w * 0.84, w * 0.38, w * 0.06, 2), shade(col, -0.15)),
    stroke(lace, '#d8362c', 1.6),
    ol(rect(-w * 0.44, -w * 0.22, w * 0.94, w * 0.06, 2), '#8a8a92', 1),
    sh(circle(-w * 0.3, -w * 0.08, w * 0.09) + circle(w * 0.34, -w * 0.08, w * 0.09), wheel),
    sh(circle(-w * 0.3, -w * 0.08, w * 0.035) + circle(w * 0.34, -w * 0.08, w * 0.035), '#f6f0e2'),
    sh(ellipse(w * 0.5, -w * 0.16, w * 0.05, w * 0.04), '#e8556a'),
  ];
}

/** Ice cream cone with two scoops; s = height. Tip at y = 0. */
export function iceCreamCone(s: number): Shape[] {
  const h = s, w = s * 0.4;
  let grid = '';
  for (let i = -2; i <= 2; i++) grid += line([[i * w * 0.14 - w * 0.12, -h * 0.5], [i * w * 0.08 + w * 0.06, -h * 0.08]]) + line([[i * w * 0.14 + w * 0.12, -h * 0.5], [i * w * 0.08 - w * 0.06, -h * 0.08]]);
  return [
    ol(poly([[-w * 0.4, -h * 0.5], [w * 0.4, -h * 0.5], [0, 0]]), '#e0a856', 1, -0.35),
    stroke(grid, '#b8803a', 1),
    sh(blob([[-w * 0.46, -h * 0.5], [-w * 0.5, -h * 0.66], [-w * 0.2, -h * 0.82], [w * 0.24, -h * 0.8], [w * 0.5, -h * 0.64], [w * 0.44, -h * 0.5], [w * 0.2, -h * 0.46], [0, -h * 0.52], [-w * 0.24, -h * 0.46]], 0.8), '#f6e8c8'),
    sh(blob([[-w * 0.36, -h * 0.76], [-w * 0.32, -h * 0.94], [0, -h * 1.0], [w * 0.32, -h * 0.94], [w * 0.38, -h * 0.76], [w * 0.1, -h * 0.72], [-w * 0.12, -h * 0.74]], 0.8), '#f29ab4'),
    sh(circle(0, -h * 1.02, w * 0.1), '#c8203a'),
  ];
}

/** Twin-bell alarm clock; s = width. On y = 0. */
export function alarmClock(s: number, col = '#3f7fc0'): Shape[] {
  const w = s, r = w * 0.36;
  let ticks = '';
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; ticks += line([[Math.cos(a) * r * 0.72, -r * 1.2 + Math.sin(a) * r * 0.72], [Math.cos(a) * r * 0.84, -r * 1.2 + Math.sin(a) * r * 0.84]]); }
  return [
    stroke(line([[-r * 0.6, -r * 0.5], [-r * 0.8, 0]]) + line([[r * 0.6, -r * 0.5], [r * 0.8, 0]]), shade(col, -0.3), w * 0.05),
    sh(sector(-r * 0.68, -r * 2.0, r * 0.42, 180, 360) + sector(r * 0.68, -r * 2.0, r * 0.42, 180, 360), '#d8b44a', { stroke: '#9a7a2a', strokeWidth: 1 }),
    stroke(line([[0, -r * 2.2], [0, -r * 2.36]]), '#9a7a2a', w * 0.04),
    ol(circle(0, -r * 1.2, r), col, 1.2),
    sh(circle(0, -r * 1.2, r * 0.86), '#fbf6ea'),
    stroke(ticks, '#4a4a52', 1.2),
    stroke(line([[0, -r * 1.2], [0, -r * 1.74]]) + line([[0, -r * 1.2], [r * 0.4, -r * 1.06]]), '#2a2a2e', w * 0.04),
    sh(circle(0, -r * 1.2, w * 0.03), '#d8362c'),
  ];
}

void star; void Q;
