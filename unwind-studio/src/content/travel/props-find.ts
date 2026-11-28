// Shared props for the "Around the World" hidden-object scenes.
// Every prop is drawn around the origin and sized by `s` (roughly its width), then place()d.
import { rect, ellipse, circle, poly, line, curve, blob, leaf, star, sector, sh, stroke, place, shade, mix, rng, xf } from '../../art/kit';
import type { Shape } from '../../art/types';

export type Pt = [number, number];
const n = (v: number) => String(Math.round(v * 10) / 10);
export const M = (x: number, y: number) => `M${n(x)} ${n(y)}`;
export const L = (x: number, y: number) => `L${n(x)} ${n(y)}`;
export const Q = (cx: number, cy: number, x: number, y: number) => `Q${n(cx)} ${n(cy)} ${n(x)} ${n(y)}`;

/** Filled shape with a darker outline of the same hue. */
export const ol = (d: string, fill: string, w = 1, amt = -0.35): Shape => sh(d, fill, { stroke: shade(fill, amt), strokeWidth: w });
export const shadow = (cx: number, cy: number, rx: number, ry: number, o = 0.25): Shape => sh(ellipse(cx, cy, rx, ry), '#2a1a10', { opacity: o });
const GOLD = '#d9b45a', GOLD_D = '#9c7a2e';

// =====================================================================
// target props
// =====================================================================
export function passport(s: number, col = '#6b1f2e'): Shape[] {
  const w = s * 0.72, h = s;
  return [
    sh(rect(-w / 2 + 3, -h / 2 + 3, w, h, 4), '#000000', { opacity: 0.2 }), sh(rect(w / 2 - 7, -h / 2 + 2, 6, h - 4, 2), '#f3ead6'),
    ol(rect(-w / 2, -h / 2, w - 3, h, 4), col, 1), stroke(circle(-1.5, -h * 0.06, w * 0.22), GOLD, 1.6), sh(star(-1.5, -h * 0.06, w * 0.13, w * 0.055, 5), GOLD),
    sh(rect(-w * 0.3, -h * 0.4, w * 0.56, 2.2) + rect(-w * 0.3, h * 0.24, w * 0.56, 2.4) + rect(-w * 0.22, h * 0.32, w * 0.4, 2), GOLD),
  ];
}
export function camera(s: number, body = '#2f2f33'): Shape[] {
  const w = s, h = s * 0.62;
  return [
    sh(rect(-w * 0.32, -h * 0.62, w * 0.3, h * 0.2, 3), shade(body, 0.15)), sh(rect(w * 0.18, -h * 0.58, w * 0.16, h * 0.14, 2), '#c7c7c7'),
    ol(rect(-w / 2, -h * 0.45, w, h * 0.9, 6), body, 1.2), sh(rect(-w / 2, -h * 0.12, w, h * 0.32), '#8a5a3a'), stroke(line([[-w / 2, -h * 0.12], [w / 2, -h * 0.12]]) + line([[-w / 2, h * 0.2], [w / 2, h * 0.2]]), '#5a3a22', 1),
    sh(circle(0, 0.03 * h, h * 0.4), '#c9c9c9'), sh(circle(0, 0.03 * h, h * 0.31), '#2a2a2e'), sh(circle(0, 0.03 * h, h * 0.2), '#3b5a78'), sh(circle(-h * 0.07, -h * 0.05, h * 0.07), '#ffffff', { opacity: 0.7 }),
    sh(rect(w * 0.3, -h * 0.36, w * 0.12, h * 0.12, 2), '#f4efe0'), sh(circle(-w * 0.36, -h * 0.3, h * 0.06), '#c33'),
  ];
}
export function compass(r: number): Shape[] {
  let ticks = '';
  for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2, r0 = r * (i % 4 ? 0.74 : 0.66); ticks += line([[Math.cos(a) * r0, Math.sin(a) * r0], [Math.cos(a) * r * 0.82, Math.sin(a) * r * 0.82]]); }
  return [
    shadow(r * 0.12, r * 0.15, r * 1.05, r * 1.0, 0.25), stroke(circle(0, -r * 1.15, r * 0.18), GOLD_D, 2.4), sh(rect(-r * 0.14, -r * 1.08, r * 0.28, r * 0.16, 2), GOLD),
    ol(circle(0, 0, r), GOLD, 1.2), sh(circle(0, 0, r * 0.86), '#fbf6e8'), stroke(ticks, '#6b5b4b', 1),
    sh(poly([[0, -r * 0.7], [r * 0.12, 0], [-r * 0.12, 0]]), '#c8322a'), sh(poly([[0, r * 0.7], [r * 0.12, 0], [-r * 0.12, 0]]), '#2f4a6a'), sh(circle(0, 0, r * 0.08), GOLD_D),
  ];
}
export function umbrellaClosed(h: number, col: string): Shape[] {
  const w = h * 0.14;
  return [
    stroke(line([[0, -h * 0.5], [0, h * 0.36]]), '#4a3a2a', 2.2), stroke(M(0, h * 0.34) + Q(0, h * 0.5, w * 0.8, h * 0.5) + Q(w * 1.5, h * 0.5, w * 1.5, h * 0.4), '#6b3f22', 4),
    ol(M(0, -h * 0.42) + Q(w * 1.1, -h * 0.05, w * 0.6, h * 0.24) + L(-w * 0.6, h * 0.24) + Q(-w * 1.1, -h * 0.05, 0, -h * 0.42) + 'Z', col, 1),
    stroke(line([[0, -h * 0.4], [w * 0.25, h * 0.22]]) + line([[0, -h * 0.4], [-w * 0.3, h * 0.22]]), shade(col, -0.35), 1), sh(rect(-w * 0.5, h * 0.06, w, h * 0.05, 1), shade(col, 0.3)),
    sh(circle(0, -h * 0.5, w * 0.16), GOLD),
  ];
}
export function umbrellaOpen(w: number, col: string, col2: string): Shape[] {
  const h = w * 0.42, out: Shape[] = [stroke(line([[0, -h], [0, h * 1.5]]), '#4a3a2a', 2.2), stroke(M(0, h * 1.45) + Q(0, h * 1.75, w * 0.1, h * 1.75) + Q(w * 0.18, h * 1.75, w * 0.18, h * 1.55), '#6b3f22', 4)];
  const segs = 6;
  for (let i = 0; i < segs; i++) {
    const x0 = -w / 2 + (w * i) / segs, x1 = x0 + w / segs;
    out.push(ol(M(0, -h) + Q((x0 + x1) / 2 - w * 0.02, -h * 0.9, x0, 0) + Q((x0 + x1) / 2, -h * 0.18, x1, 0) + Q((x0 + x1) / 2 + w * 0.02, -h * 0.9, 0, -h) + 'Z', i % 2 ? col : col2, 0.8));
  }
  out.push(sh(circle(0, -h - 3, 3), GOLD));
  return out;
}
export function postcard(s: number): Shape[] {
  const w = s, h = s * 0.66;
  return [
    sh(rect(-w / 2 + 3, -h / 2 + 3, w, h, 2), '#000000', { opacity: 0.18 }), ol(rect(-w / 2, -h / 2, w, h, 2), '#fbf4e2', 1, -0.3),
    sh(rect(-w * 0.45, -h * 0.4, w * 0.46, h * 0.8), '#8fc3e6'), sh(poly([[-w * 0.45, h * 0.4], [-w * 0.45, h * 0.05], [-w * 0.3, -h * 0.15], [-w * 0.16, h * 0.05], [-w * 0.06, -h * 0.05], [w * 0.01, h * 0.1], [w * 0.01, h * 0.4]]), '#5b8f5a'),
    sh(circle(-w * 0.08, -h * 0.22, h * 0.09), '#f6d23c'), sh(rect(-w * 0.45, h * 0.24, w * 0.46, h * 0.16), '#3f8fbf'),
    sh(rect(w * 0.27, -h * 0.38, w * 0.17, h * 0.3), '#d2452f'), sh(rect(w * 0.3, -h * 0.33, w * 0.11, h * 0.2), '#f6dc9c'),
    stroke(line([[w * 0.08, h * 0.04], [w * 0.42, h * 0.04]]) + line([[w * 0.08, h * 0.17], [w * 0.42, h * 0.17]]) + line([[w * 0.08, h * 0.3], [w * 0.36, h * 0.3]]) + line([[w * 0.04, -h * 0.36], [w * 0.04, h * 0.38]]), '#8a7a66', 1.1),
  ];
}
export function ticket(s: number, col = '#f2c14e'): Shape[] {
  const w = s, h = s * 0.48, c = h * 0.16;
  const body = poly([[-w / 2 + c, -h / 2], [w / 2 - c, -h / 2], [w / 2, -h / 2 + c], [w / 2, h / 2 - c], [w / 2 - c, h / 2], [-w / 2 + c, h / 2], [-w / 2, h / 2 - c], [-w / 2, -h / 2 + c]]);
  let perf = '';
  for (let i = 0; i < 7; i++) perf += circle(w * 0.22, -h * 0.38 + (h * 0.76 * i) / 6, 1.3);
  return [
    sh(xf(body, { x: 3, y: 3 }), '#000000', { opacity: 0.18 }), ol(body, col, 1), sh(rect(-w * 0.42, -h * 0.32, w * 0.58, h * 0.2), shade(col, -0.25)), sh(perf, shade(col, -0.45)),
    stroke(line([[-w * 0.4, h * 0.08], [w * 0.12, h * 0.08]]) + line([[-w * 0.4, h * 0.24], [w * 0.02, h * 0.24]]), shade(col, -0.45), 1.4), sh(star(w * 0.36, 0, h * 0.2, h * 0.08, 5), '#c8322a'),
  ];
}
export function sunglasses(s: number, frame = '#1f1f24'): Shape[] {
  const r = s * 0.2;
  return [
    stroke(M(-s * 0.48, -r * 0.4) + L(-s * 0.62, -r * 0.6) + M(s * 0.48, -r * 0.4) + L(s * 0.62, -r * 0.6), frame, 2.4),
    ol(blob([[-s * 0.48, -r * 0.5], [-s * 0.08, -r * 0.6], [-s * 0.1, r * 0.4], [-s * 0.3, r * 0.85], [-s * 0.46, r * 0.3]], 0.8), '#2b3540', 2, -0.3),
    ol(blob([[s * 0.48, -r * 0.5], [s * 0.08, -r * 0.6], [s * 0.1, r * 0.4], [s * 0.3, r * 0.85], [s * 0.46, r * 0.3]], 0.8), '#2b3540', 2, -0.3),
    stroke(M(-s * 0.1, -r * 0.4) + Q(0, -r * 0.75, s * 0.1, -r * 0.4), frame, 2.4),
    sh(ellipse(-s * 0.3, -r * 0.15, r * 0.3, r * 0.14, -25) + ellipse(s * 0.24, -r * 0.15, r * 0.3, r * 0.14, -25), '#9ec4e0', { opacity: 0.7 }),
  ];
}
export function topHat(s: number, col = '#232327', band = '#8c2b2b'): Shape[] {
  const w = s * 0.58, h = s * 0.62;
  return [
    ol(ellipse(0, 0, s / 2, s * 0.12), col, 1, 0.2), ol(poly([[-w / 2, 0], [-w / 2 - 2, -h], [w / 2 + 2, -h], [w / 2, 0]]), col, 1, 0.25),
    sh(ellipse(0, -h, w / 2 + 2, s * 0.07), shade(col, 0.2)), sh(rect(-w / 2 - 0.5, -h * 0.3, w + 1, h * 0.18), band), sh(rect(-w * 0.36, -h * 0.92, w * 0.12, h * 0.6), '#ffffff', { opacity: 0.12 }),
  ];
}
export function bowler(s: number, col = '#3a2a22', band = '#1d1612'): Shape[] {
  return [
    ol(M(-s / 2, 0) + Q(-s * 0.4, -s * 0.12, -s * 0.3, -s * 0.06) + L(s * 0.3, -s * 0.06) + Q(s * 0.4, -s * 0.12, s / 2, 0) + Q(0, s * 0.12, -s / 2, 0) + 'Z', col, 1, 0.2),
    ol(M(-s * 0.32, -s * 0.06) + Q(-s * 0.34, -s * 0.56, 0, -s * 0.56) + Q(s * 0.34, -s * 0.56, s * 0.32, -s * 0.06) + 'Z', col, 1, 0.22),
    sh(M(-s * 0.32, -s * 0.06) + L(s * 0.32, -s * 0.06) + L(s * 0.31, -s * 0.16) + L(-s * 0.31, -s * 0.16) + 'Z', band), sh(ellipse(-s * 0.14, -s * 0.38, s * 0.07, s * 0.12, 20), '#ffffff', { opacity: 0.15 }),
  ];
}
export function strawHat(s: number, band = '#2f6690'): Shape[] {
  let weave = '';
  for (let i = 1; i < 5; i++) weave += M(-s * 0.48 + i * 3, 0) + Q(0, s * (0.1 + i * 0.005), s * 0.48 - i * 3, 0);
  return [
    ol(ellipse(0, 0, s / 2, s * 0.17), '#e3c27a', 1, -0.3), stroke(weave, '#b9934a', 0.9, { opacity: 0.8 }),
    ol(M(-s * 0.26, -s * 0.02) + Q(-s * 0.28, -s * 0.36, 0, -s * 0.36) + Q(s * 0.28, -s * 0.36, s * 0.26, -s * 0.02) + 'Z', '#ecd08e', 1, -0.3),
    sh(M(-s * 0.26, -s * 0.02) + L(s * 0.26, -s * 0.02) + L(s * 0.265, -s * 0.12) + L(-s * 0.265, -s * 0.12) + 'Z', band), sh(leaf(s * 0.2, -s * 0.08, s * 0.16, s * 0.05, -30), band),
  ];
}
export function globe(s: number): Shape[] {
  const r = s * 0.4;
  return [
    shadow(0, s * 0.62, s * 0.3, s * 0.05), ol(poly([[-s * 0.24, s * 0.62], [s * 0.24, s * 0.62], [s * 0.14, s * 0.54], [-s * 0.14, s * 0.54]]), '#8a5a3a', 1), sh(rect(-s * 0.03, r * 0.9, s * 0.06, s * 0.2), '#8a5a3a'),
    ol(circle(0, 0, r), '#4f9cc9', 1, -0.4), sh(blob([[-r * 0.5, -r * 0.6], [-r * 0.1, -r * 0.7], [0, -r * 0.3], [-r * 0.3, r * 0.1], [-r * 0.6, -r * 0.1]], 0.8), '#7fb069'),
    sh(blob([[r * 0.15, -r * 0.1], [r * 0.6, -r * 0.3], [r * 0.7, r * 0.2], [r * 0.4, r * 0.6], [r * 0.2, r * 0.3]], 0.8), '#e2c47a'), sh(blob([[-r * 0.5, r * 0.4], [-r * 0.2, r * 0.35], [-r * 0.25, r * 0.7]], 0.8), '#7fb069'),
    stroke(xf(sector(0, 0, r * 1.18, 120, 400, r * 1.08), { rot: 20 }), GOLD_D, 1), sh(xf(sector(0, 0, r * 1.18, 110, 410, r * 1.08), { rot: 20 }), GOLD), sh(ellipse(-r * 0.4, -r * 0.4, r * 0.2, r * 0.12, -40), '#ffffff', { opacity: 0.35 }),
  ];
}
export function key(s: number, col = GOLD, tassel?: string): Shape[] {
  const out: Shape[] = [];
  if (tassel) out.push(stroke(curve([[-s * 0.42, s * 0.08], [-s * 0.46, s * 0.3], [-s * 0.4, s * 0.42]]), tassel, 2), sh(poly([[-s * 0.46, s * 0.4], [-s * 0.34, s * 0.4], [-s * 0.3, s * 0.62], [-s * 0.5, s * 0.62]]), tassel));
  out.push(
    ol(circle(-s * 0.36, 0, s * 0.14), col, 1.2), sh(circle(-s * 0.36, 0, s * 0.065), shade(col, -0.45)),
    ol(rect(-s * 0.24, -s * 0.035, s * 0.7, s * 0.07, 2), col, 1), ol(poly([[s * 0.3, 0], [s * 0.3, s * 0.16], [s * 0.36, s * 0.16], [s * 0.36, s * 0.1], [s * 0.42, s * 0.1], [s * 0.42, s * 0.16], [s * 0.47, s * 0.16], [s * 0.47, 0]]), col, 1),
    sh(rect(-s * 0.2, -s * 0.06, s * 0.04, s * 0.12, 1), shade(col, -0.2)),
  );
  return out;
}
export function foldedMap(s: number): Shape[] {
  const w = s, h = s * 0.7, p = 4, out: Shape[] = [sh(rect(-w / 2 + 3, -h / 2 + 4, w, h), '#000000', { opacity: 0.18 })];
  const cols = ['#f1e6c8', '#e6d8b2', '#f1e6c8', '#e6d8b2'];
  for (let i = 0; i < p; i++) {
    const x0 = -w / 2 + (w * i) / p, x1 = x0 + w / p, dy = i % 2 ? 3 : 0;
    out.push(ol(poly([[x0, -h / 2 + dy], [x1, -h / 2 + 3 - dy], [x1, h / 2 + 3 - dy], [x0, h / 2 + dy]]), cols[i], 0.8, -0.25));
  }
  out.push(
    sh(blob([[-w * 0.4, -h * 0.1], [-w * 0.1, -h * 0.3], [w * 0.1, -h * 0.05], [-w * 0.05, h * 0.25], [-w * 0.35, h * 0.2]], 0.8), '#b7d3a0', { opacity: 0.8 }),
    sh(blob([[w * 0.15, h * 0.1], [w * 0.4, -h * 0.2], [w * 0.45, h * 0.3], [w * 0.2, h * 0.35]], 0.8), '#9cc6dc', { opacity: 0.9 }),
    stroke(curve([[-w * 0.45, h * 0.3], [-w * 0.2, h * 0.05], [w * 0.05, h * 0.15], [w * 0.4, -h * 0.35]]), '#c8322a', 1.6), stroke(curve([[-w * 0.3, -h * 0.4], [-w * 0.15, 0], [-w * 0.25, h * 0.4]]), '#8a6a4a', 1.2),
    sh(circle(w * 0.4, -h * 0.35, 3.5), '#c8322a'), stroke(line([[-w * 0.05, -h * 0.3], [w * 0.05, -h * 0.2]]) + line([[w * 0.05, -h * 0.3], [-w * 0.05, -h * 0.2]]), '#c8322a', 1.4),
  );
  return out;
}
export function binoculars(s: number, col = '#2f3a33'): Shape[] {
  const tube = (x: number) => [ol(rect(x - s * 0.17, -s * 0.3, s * 0.34, s * 0.5, 5), col, 1), sh(rect(x - s * 0.17, -s * 0.1, s * 0.34, s * 0.12), '#6b4a2f'), ol(rect(x - s * 0.2, s * 0.18, s * 0.4, s * 0.16, 4), shade(col, -0.2), 1), sh(ellipse(x, s * 0.34, s * 0.15, s * 0.05), '#8fb4c9'), ol(rect(x - s * 0.12, -s * 0.44, s * 0.24, s * 0.16, 3), shade(col, 0.15), 1)];
  return [shadow(0, s * 0.38, s * 0.48, s * 0.06), ...tube(-s * 0.24), ...tube(s * 0.24), ol(rect(-s * 0.1, -s * 0.24, s * 0.2, s * 0.12, 2), '#9a9a9a', 1), sh(circle(0, -s * 0.18, s * 0.05), '#5a5a5a')];
}
export function teacup(s: number, col = '#fbf6ec', pat = '#3f7fa8'): Shape[] {
  const w = s * 0.62, h = s * 0.42;
  return [
    shadow(0, s * 0.02, s * 0.5, s * 0.08), ol(ellipse(0, 0, s / 2, s * 0.1), col, 1, -0.25), stroke(ellipse(0, -1, s * 0.36, s * 0.065), pat, 1),
    ol(M(-w / 2, -h) + Q(-w / 2, -h * 0.1, 0, -h * 0.02) + Q(w / 2, -h * 0.1, w / 2, -h) + 'Z', col, 1, -0.25), stroke(M(w * 0.46, -h * 0.82) + Q(w * 0.95, -h * 0.85, w * 0.62, -h * 0.3), col, 4), stroke(M(w * 0.46, -h * 0.82) + Q(w * 0.95, -h * 0.85, w * 0.62, -h * 0.3), shade(col, -0.3), 1),
    sh(rect(-w / 2 + 1, -h * 0.82, w - 2, h * 0.14), pat), sh(ellipse(0, -h, w / 2, h * 0.14), '#8a5a3a'), sh(circle(-w * 0.18, -h * 0.5, 2) + circle(0, -h * 0.45, 2) + circle(w * 0.18, -h * 0.5, 2), pat),
  ];
}
export function paperFan(s: number, a = '#d2452f', b = '#f6dcc0'): Shape[] {
  const out: Shape[] = [], segs = 9, r = s * 0.55;
  for (let i = 0; i < segs; i++) out.push(sh(sector(0, 0, r, 200 + (140 * i) / segs, 200 + (140 * (i + 1)) / segs, r * 0.25), i % 2 ? a : b, { stroke: shade(a, -0.3), strokeWidth: 0.6 }));
  out.push(sh(xf(blob([[-r * 0.3, -r * 0.55], [-r * 0.05, -r * 0.7], [r * 0.25, -r * 0.6], [r * 0.05, -r * 0.45]], 0.8), {}), '#ffffff', { opacity: 0.35 }));
  out.push(sh(sector(0, 0, r * 0.28, 195, 345), '#6b3f22'), stroke(line([[0, 0], [0, s * 0.26]]), '#6b3f22', 3.4), sh(circle(0, 0, 2.6), GOLD), stroke(curve([[0, s * 0.26], [-4, s * 0.36], [2, s * 0.44]]), a, 1.6));
  return out;
}
export function deskBell(s: number): Shape[] {
  return [
    shadow(0, 0, s * 0.52, s * 0.08), ol(ellipse(0, -s * 0.04, s * 0.48, s * 0.09), '#5a3a22', 1), ol(rect(-s * 0.48, -s * 0.12, s * 0.96, s * 0.08, 3), '#6b4a2f', 1),
    ol(M(-s * 0.4, -s * 0.13) + Q(-s * 0.4, -s * 0.55, 0, -s * 0.55) + Q(s * 0.4, -s * 0.55, s * 0.4, -s * 0.13) + 'Z', GOLD, 1, -0.4),
    sh(ellipse(-s * 0.16, -s * 0.36, s * 0.07, s * 0.11, 30), '#fff4c8', { opacity: 0.8 }), sh(rect(-s * 0.03, -s * 0.66, s * 0.06, s * 0.12), GOLD_D), ol(ellipse(0, -s * 0.66, s * 0.1, s * 0.04), GOLD, 1),
  ];
}
export function pocketWatch(r: number, chain = true): Shape[] {
  const out: Shape[] = [];
  if (chain) { let ch = ''; for (let i = 0; i < 9; i++) ch += ellipse(r * 0.2 + i * r * 0.22, -r * 1.3 - Math.sin(i / 2.6) * r * 0.4, r * 0.09, r * 0.06, 20); out.push(stroke(ch, GOLD_D, 1.2)); }
  let ticks = '';
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; ticks += line([[Math.cos(a) * r * 0.62, Math.sin(a) * r * 0.62], [Math.cos(a) * r * 0.74, Math.sin(a) * r * 0.74]]); }
  out.push(
    stroke(circle(0, -r * 1.22, r * 0.14), GOLD_D, 2), ol(rect(-r * 0.12, -r * 1.12, r * 0.24, r * 0.2, 2), GOLD, 1), ol(circle(0, 0, r), GOLD, 1.2, -0.4), sh(circle(0, 0, r * 0.82), '#fbf6e8'),
    stroke(ticks, '#3a3a3f', 1.1), stroke(line([[0, 0], [0, -r * 0.56]]) + line([[0, 0], [r * 0.38, r * 0.14]]), '#2a2a2e', 1.6), sh(circle(0, 0, r * 0.06), '#2a2a2e'), sh(ellipse(-r * 0.4, -r * 0.4, r * 0.18, r * 0.1, -40), '#ffffff', { opacity: 0.5 }),
  );
  return out;
}
export function snowGlobe(s: number): Shape[] {
  const r = s * 0.38, g = rng(5);
  let flakes = '';
  for (let i = 0; i < 9; i++) flakes += circle(g.range(-r * 0.6, r * 0.6), g.range(-r * 1.6, -r * 0.6), 1.4);
  return [
    shadow(0, 0, s * 0.42, s * 0.06), ol(poly([[-s * 0.4, 0], [s * 0.4, 0], [s * 0.3, -s * 0.22], [-s * 0.3, -s * 0.22]]), '#7a4a2f', 1), sh(rect(-s * 0.3, -s * 0.14, s * 0.6, s * 0.04), GOLD),
    sh(circle(0, -s * 0.22 - r * 0.9, r), '#cfe6f2', { opacity: 0.85, stroke: '#8fb4c9', strokeWidth: 1.2 }), sh(ellipse(0, -s * 0.26, r * 0.86, r * 0.18), '#ffffff'),
    sh(poly([[-r * 0.45, -s * 0.28], [-r * 0.45, -s * 0.28 - r * 0.5], [-r * 0.15, -s * 0.28 - r * 0.8], [r * 0.15, -s * 0.28 - r * 0.5], [r * 0.15, -s * 0.28]]), '#e4572e'), sh(rect(-r * 0.34, -s * 0.28 - r * 0.36, r * 0.16, r * 0.2), '#f6d23c'),
    sh(poly([[r * 0.5, -s * 0.28 - r * 0.95], [r * 0.72, -s * 0.28], [r * 0.28, -s * 0.28]]), '#3f7d4e'), sh(flakes, '#ffffff'), sh(ellipse(-r * 0.45, -s * 0.22 - r * 1.35, r * 0.18, r * 0.3, 30), '#ffffff', { opacity: 0.6 }),
  ];
}
export function teapot(s: number, col = '#3f7d6e'): Shape[] {
  return [
    shadow(0, 0, s * 0.46, s * 0.07), stroke(M(-s * 0.3, -s * 0.3) + Q(-s * 0.62, -s * 0.36, -s * 0.5, -s * 0.12) + Q(-s * 0.44, -s * 0.06, -s * 0.32, -s * 0.12), col, 5),
    ol(M(s * 0.25, -s * 0.18) + Q(s * 0.42, -s * 0.2, s * 0.5, -s * 0.46) + L(s * 0.56, -s * 0.46) + Q(s * 0.5, -s * 0.12, s * 0.28, -s * 0.06) + 'Z', col, 1),
    ol(M(-s * 0.36, -s * 0.04) + Q(-s * 0.46, -s * 0.44, 0, -s * 0.46) + Q(s * 0.46, -s * 0.44, s * 0.36, -s * 0.04) + Q(0, s * 0.03, -s * 0.36, -s * 0.04) + 'Z', col, 1.2),
    sh(rect(-s * 0.34, -s * 0.3, s * 0.68, s * 0.07), GOLD), ol(ellipse(0, -s * 0.46, s * 0.2, s * 0.05), shade(col, -0.1), 1), sh(circle(0, -s * 0.53, s * 0.05), GOLD),
    sh(ellipse(-s * 0.16, -s * 0.18, s * 0.06, s * 0.1, 20), '#ffffff', { opacity: 0.3 }), sh(sector(0, -s * 0.2, s * 0.1, 0, 360), '#f6dc9c', { opacity: 0.8 }),
  ];
}
export function kite(s: number, a = '#e4572e', b = '#f6d23c'): Shape[] {
  const h = s, w = s * 0.7;
  const tail: Pt[] = [[0, h * 0.62], [-s * 0.1, h * 0.8], [s * 0.06, h * 0.95], [-s * 0.08, h * 1.12]];
  return [
    stroke(curve(tail), '#5a4a3a', 1.2), sh(xf(poly([[0, -5], [5, 0], [0, 5], [-5, 0]]), { x: -s * 0.1, y: h * 0.8 }) + xf(poly([[0, -5], [5, 0], [0, 5], [-5, 0]]), { x: s * 0.06, y: h * 0.95 }), a),
    sh(poly([[0, -h * 0.4], [w / 2, -h * 0.05], [0, 0], [0, -h * 0.4]]), a), sh(poly([[0, -h * 0.4], [-w / 2, -h * 0.05], [0, 0]]), b), sh(poly([[-w / 2, -h * 0.05], [0, h * 0.62], [0, 0]]), a), sh(poly([[w / 2, -h * 0.05], [0, h * 0.62], [0, 0]]), b),
    stroke(poly([[0, -h * 0.4], [w / 2, -h * 0.05], [0, h * 0.62], [-w / 2, -h * 0.05]]) + line([[0, -h * 0.4], [0, h * 0.62]]) + line([[-w / 2, -h * 0.05], [w / 2, -h * 0.05]]), '#5a3a22', 1.1),
  ];
}
export function pineapple(s: number): Shape[] {
  const w = s * 0.5, h = s * 0.62;
  let scales = '';
  for (let r = 1; r < 6; r++) {
    const y = -h + (h * r) / 6, hw = (w / 2) * Math.sqrt(1 - Math.pow((y + h / 2) / (h / 2), 2)) * 0.86, k = Math.max(1, Math.round(hw / (w * 0.12)));
    for (let i = -k; i <= k; i++) { const x = (i * hw) / (k + 0.5) + (r % 2) * w * 0.05; scales += M(x - w * 0.07, y - h * 0.05) + L(x, y + h * 0.04) + L(x + w * 0.07, y - h * 0.05); }
  }
  let crown = '';
  for (let i = 0; i < 7; i++) crown += leaf(0, -h * 0.96, s * (0.3 + (i % 3) * 0.06), s * 0.05, -90 + (i - 3) * 18);
  return [shadow(0, 0, w * 0.6, s * 0.05), sh(crown, '#4f8a3a', { stroke: '#2f5a24', strokeWidth: 0.8 }), ol(ellipse(0, -h / 2, w / 2, h / 2), '#e0a83a', 1, -0.4), stroke(scales, '#a8702a', 1.1), sh(ellipse(-w * 0.18, -h * 0.65, w * 0.1, h * 0.16), '#ffe9a0', { opacity: 0.5 })];
}
export function spinningTop(s: number): Shape[] {
  return [
    shadow(0, s * 0.02, s * 0.2, s * 0.04), sh(rect(-s * 0.05, -s * 0.9, s * 0.1, s * 0.22, 2), '#6b3f22'),
    ol(M(-s * 0.46, -s * 0.52) + Q(0, -s * 0.8, s * 0.46, -s * 0.52) + L(0, 0) + 'Z', '#2f6690', 1),
    sh(M(-s * 0.4, -s * 0.44) + L(s * 0.4, -s * 0.44) + L(s * 0.31, -s * 0.34) + L(-s * 0.31, -s * 0.34) + 'Z', '#f6d23c'), sh(M(-s * 0.22, -s * 0.24) + L(s * 0.22, -s * 0.24) + L(s * 0.14, -s * 0.16) + L(-s * 0.14, -s * 0.16) + 'Z', '#e4572e'),
    sh(ellipse(0, -s * 0.6, s * 0.44, s * 0.09), '#4f8ab8'),
  ];
}
export function mask(s: number, col = '#7a3a9a'): Shape[] {
  const body = blob([[-s * 0.5, -s * 0.12], [-s * 0.3, -s * 0.24], [0, -s * 0.14], [s * 0.3, -s * 0.24], [s * 0.5, -s * 0.12], [s * 0.4, s * 0.12], [s * 0.12, s * 0.16], [0, s * 0.06], [-s * 0.12, s * 0.16], [-s * 0.4, s * 0.12]], 0.7);
  return [
    stroke(curve([[s * 0.48, -s * 0.05], [s * 0.6, s * 0.2], [s * 0.54, s * 0.45]]), '#d2452f', 1.4), ol(body, col, 1.2), stroke(body, GOLD, 0.8),
    sh(ellipse(-s * 0.22, -s * 0.04, s * 0.11, s * 0.065, 8) + ellipse(s * 0.22, -s * 0.04, s * 0.11, s * 0.065, -8), '#1b1b22'),
    sh(circle(0, -s * 0.12, s * 0.035) + circle(-s * 0.38, s * 0.02, s * 0.025) + circle(s * 0.38, s * 0.02, s * 0.025), GOLD),
    sh(leaf(s * 0.3, -s * 0.2, s * 0.36, s * 0.07, -70), '#2fa0a0'), sh(leaf(s * 0.36, -s * 0.18, s * 0.3, s * 0.06, -45), '#f2b92e'),
  ];
}
export function windChime(s: number): Shape[] {
  const out: Shape[] = [stroke(line([[0, -s * 0.6], [0, -s * 0.42]]), '#5a4a3a', 1.2), ol(ellipse(0, -s * 0.4, s * 0.32, s * 0.07), '#8a5a3a', 1)];
  const lens = [0.5, 0.62, 0.74, 0.58, 0.46];
  for (let i = 0; i < 5; i++) { const x = -s * 0.24 + i * s * 0.12; out.push(stroke(line([[x, -s * 0.38], [x, -s * 0.3]]), '#5a4a3a', 0.8), ol(rect(x - s * 0.03, -s * 0.3, s * 0.06, s * lens[i], 2), '#c9ccd2', 0.8, -0.4)); }
  out.push(stroke(line([[0, -s * 0.38], [0, s * 0.28]]), '#5a4a3a', 0.8), ol(circle(0, s * 0.06, s * 0.06), '#d2452f', 0.8), ol(poly([[-s * 0.1, s * 0.3], [s * 0.1, s * 0.3], [s * 0.06, s * 0.52], [-s * 0.06, s * 0.52]]), '#f2b92e', 0.8));
  return out;
}
export function elephant(s: number, col = '#7a8a9a'): Shape[] {
  return [
    shadow(0, 0, s * 0.45, s * 0.05),
    ol(rect(-s * 0.34, -s * 0.2, s * 0.11, s * 0.2, 2) + '', shade(col, -0.1), 1), ol(rect(s * 0.12, -s * 0.2, s * 0.11, s * 0.2, 2), shade(col, -0.1), 1),
    ol(blob([[-s * 0.42, -s * 0.3], [-s * 0.2, -s * 0.56], [s * 0.18, -s * 0.54], [s * 0.3, -s * 0.3], [s * 0.2, -s * 0.12], [-s * 0.36, -s * 0.12]], 0.9), col, 1),
    ol(rect(-s * 0.24, -s * 0.2, s * 0.11, s * 0.2, 2), col, 1), ol(rect(s * 0.02, -s * 0.2, s * 0.11, s * 0.2, 2), col, 1),
    ol(M(s * 0.22, -s * 0.5) + Q(s * 0.5, -s * 0.62, s * 0.46, -s * 0.3) + Q(s * 0.48, -s * 0.08, s * 0.58, -s * 0.06) + L(s * 0.56, s * 0.0) + Q(s * 0.38, s * 0.0, s * 0.36, -s * 0.24) + Q(s * 0.3, -s * 0.3, s * 0.2, -s * 0.28) + 'Z', col, 1),
    ol(ellipse(s * 0.2, -s * 0.38, s * 0.12, s * 0.16, -10), shade(col, 0.12), 1), sh(circle(s * 0.38, -s * 0.44, s * 0.025), '#1b1b22'),
    ol(blob([[-s * 0.18, -s * 0.56], [s * 0.08, -s * 0.58], [s * 0.06, -s * 0.38], [-s * 0.16, -s * 0.38]], 0.6), '#c8322a', 0.8), sh(rect(-s * 0.17, -s * 0.42, s * 0.24, s * 0.03), GOLD),
    stroke(M(-s * 0.42, -s * 0.3) + Q(-s * 0.52, -s * 0.22, -s * 0.48, -s * 0.12), col, 2),
  ];
}
export function butterfly(s: number, a = '#f08a2b', b = '#2b2b30'): Shape[] {
  return [
    ol(blob([[0, -s * 0.05], [-s * 0.3, -s * 0.4], [-s * 0.5, -s * 0.3], [-s * 0.38, 0]], 0.8), a, 1.2, -0.6), ol(blob([[0, -s * 0.05], [s * 0.3, -s * 0.4], [s * 0.5, -s * 0.3], [s * 0.38, 0]], 0.8), a, 1.2, -0.6),
    ol(blob([[0, 0], [-s * 0.32, s * 0.08], [-s * 0.3, s * 0.32], [-s * 0.08, s * 0.24]], 0.8), shade(a, -0.1), 1.2, -0.6), ol(blob([[0, 0], [s * 0.32, s * 0.08], [s * 0.3, s * 0.32], [s * 0.08, s * 0.24]], 0.8), shade(a, -0.1), 1.2, -0.6),
    sh(circle(-s * 0.36, -s * 0.24, s * 0.05) + circle(s * 0.36, -s * 0.24, s * 0.05) + circle(-s * 0.2, s * 0.2, s * 0.04) + circle(s * 0.2, s * 0.2, s * 0.04), '#fbf6e8'),
    sh(ellipse(0, 0, s * 0.04, s * 0.2), b), stroke(curve([[0, -s * 0.18], [-s * 0.06, -s * 0.32], [-s * 0.12, -s * 0.36]]) + curve([[0, -s * 0.18], [s * 0.06, -s * 0.32], [s * 0.12, -s * 0.36]]), b, 1),
  ];
}
export function seashell(s: number, col = '#f3c6a8'): Shape[] {
  let ribs = '';
  for (let i = 0; i < 7; i++) { const a = 200 + i * 23.3, r = (a * Math.PI) / 180; ribs += line([[0, s * 0.3], [Math.cos(r) * s * 0.46, s * 0.3 + Math.sin(r) * s * 0.46 * 1.2]]); }
  return [
    shadow(0, s * 0.32, s * 0.46, s * 0.05), ol(xf(sector(0, 0, s * 0.48, 190, 350), { sy: 1.2, y: s * 0.3 }), col, 1, -0.35), stroke(ribs, shade(col, -0.3), 1),
    ol(poly([[-s * 0.14, s * 0.24], [s * 0.14, s * 0.24], [s * 0.2, s * 0.38], [-s * 0.2, s * 0.38]]), shade(col, -0.08), 1, -0.35),
  ];
}
export function candle(s: number, col = '#f4e2c0'): Shape[] {
  const w = s * 0.32, h = s * 0.8;
  return [
    sh(circle(0, -h - s * 0.1, s * 0.2), '#ffd77a', { opacity: 0.35 }), ol(ellipse(0, 0, s * 0.44, s * 0.1), '#b98b3a', 1), ol(rect(-w / 2, -h, w, h * 0.96, 2), col, 1, -0.25),
    sh(M(-w / 2, -h + 2) + Q(-w * 0.3, -h + 10, -w * 0.2, -h + 2) + 'Z', shade(col, 0.2)), stroke(line([[0, -h], [0, -h - 4]]), '#3a2a22', 1.2),
    sh(leaf(0, -h - 3, s * 0.2, s * 0.06, -90), '#f6a32c'), sh(leaf(0, -h - 4, s * 0.12, s * 0.03, -90), '#fff3b0'),
    stroke(M(s * 0.4, -2) + Q(s * 0.56, -s * 0.06, s * 0.44, -s * 0.16), '#b98b3a', 2.4),
  ];
}
export function teddy(s: number, col = '#b9824a'): Shape[] {
  const lt = shade(col, 0.3);
  return [
    shadow(0, 0, s * 0.4, s * 0.06), ol(circle(-s * 0.2, -s * 0.06, s * 0.13), col, 1), ol(circle(s * 0.2, -s * 0.06, s * 0.13), col, 1),
    ol(ellipse(0, -s * 0.3, s * 0.26, s * 0.28), col, 1), sh(ellipse(0, -s * 0.26, s * 0.15, s * 0.17), lt),
    ol(ellipse(-s * 0.3, -s * 0.36, s * 0.09, s * 0.15, 30), col, 1), ol(ellipse(s * 0.3, -s * 0.36, s * 0.09, s * 0.15, -30), col, 1),
    ol(circle(-s * 0.2, -s * 0.82, s * 0.09), col, 1), ol(circle(s * 0.2, -s * 0.82, s * 0.09), col, 1), sh(circle(-s * 0.2, -s * 0.82, s * 0.045) + circle(s * 0.2, -s * 0.82, s * 0.045), lt),
    ol(circle(0, -s * 0.68, s * 0.22), col, 1), sh(ellipse(0, -s * 0.62, s * 0.1, s * 0.075), lt), sh(ellipse(0, -s * 0.65, s * 0.04, s * 0.03), '#2a1a10'),
    sh(circle(-s * 0.08, -s * 0.73, s * 0.025) + circle(s * 0.08, -s * 0.73, s * 0.025), '#2a1a10'), sh(poly([[-s * 0.14, -s * 0.5], [0, -s * 0.46], [s * 0.14, -s * 0.5], [s * 0.14, -s * 0.4], [0, -s * 0.44], [-s * 0.14, -s * 0.4]]), '#c8322a'),
  ];
}
export function railLantern(s: number, glass = '#e4572e'): Shape[] {
  const w = s * 0.5, h = s * 0.7;
  return [
    stroke(M(-w * 0.35, -h * 0.82) + Q(0, -h * 1.25, w * 0.35, -h * 0.82), '#2f3337', 2.4), shadow(0, 0, w * 0.6, s * 0.05),
    ol(rect(-w / 2, -h * 0.12, w, h * 0.12, 2), '#3a4045', 1), ol(rect(-w * 0.42, -h * 0.66, w * 0.84, h * 0.54, 3), '#3a4045', 1),
    sh(rect(-w * 0.32, -h * 0.6, w * 0.64, h * 0.42, 2), glass), sh(ellipse(0, -h * 0.38, w * 0.18, h * 0.14), '#ffd77a'), stroke(line([[0, -h * 0.6], [0, -h * 0.18]]) + line([[-w * 0.32, -h * 0.4], [w * 0.32, -h * 0.4]]), '#2a2e32', 1.4),
    ol(M(-w * 0.5, -h * 0.66) + L(w * 0.5, -h * 0.66) + L(w * 0.3, -h * 0.82) + L(-w * 0.3, -h * 0.82) + 'Z', '#4a5258', 1), ol(rect(-w * 0.14, -h * 0.9, w * 0.28, h * 0.08, 2), '#4a5258', 1),
  ];
}
export function whistle(s: number, col = '#c9ccd2'): Shape[] {
  return [
    stroke(curve([[-s * 0.48, -s * 0.06], [-s * 0.6, s * 0.12], [-s * 0.4, s * 0.3], [-s * 0.1, s * 0.3]]), '#c8322a', 1.8), stroke(circle(-s * 0.44, -s * 0.06, s * 0.06), '#8a8f96', 1.6),
    ol(circle(s * 0.1, 0, s * 0.24), col, 1.2, -0.45), ol(rect(-s * 0.42, -s * 0.24, s * 0.5, s * 0.16, 2), col, 1.2, -0.45), sh(rect(-s * 0.1, -s * 0.24, s * 0.12, s * 0.06), '#3a3f45'),
    sh(ellipse(s * 0.02, -s * 0.08, s * 0.1, s * 0.05, -20), '#ffffff', { opacity: 0.7 }),
  ];
}
export function apple(s: number, col = '#c8322a'): Shape[] {
  return [
    shadow(0, s * 0.42, s * 0.36, s * 0.06), ol(M(0, -s * 0.28) + Q(s * 0.5, -s * 0.48, s * 0.46, 0) + Q(s * 0.4, s * 0.46, 0, s * 0.4) + Q(-s * 0.4, s * 0.46, -s * 0.46, 0) + Q(-s * 0.5, -s * 0.48, 0, -s * 0.28) + 'Z', col, 1),
    stroke(M(0, -s * 0.26) + Q(-s * 0.02, -s * 0.4, s * 0.06, -s * 0.48), '#5a3a22', 2.2), sh(leaf(s * 0.04, -s * 0.38, s * 0.28, s * 0.08, -20), '#5c8f3f'), sh(ellipse(-s * 0.2, -s * 0.12, s * 0.07, s * 0.12, 20), '#ffffff', { opacity: 0.45 }),
  ];
}
export function thermos(s: number, col = '#3f7d6e'): Shape[] {
  const w = s * 0.36;
  return [
    shadow(0, 0, w * 0.8, s * 0.05), ol(rect(-w / 2, -s * 0.78, w, s * 0.78, 5), col, 1), sh(rect(-w / 2, -s * 0.5, w, s * 0.08) + rect(-w / 2, -s * 0.2, w, s * 0.06), shade(col, 0.3)),
    ol(rect(-w * 0.55, -s * 1.0, w * 1.1, s * 0.24, 4), '#c9ccd2', 1, -0.45), ol(rect(-w * 0.3, -s * 1.08, w * 0.6, s * 0.1, 2), '#8a8f96', 1), sh(rect(-w * 0.34, -s * 0.74, w * 0.14, s * 0.7, 3), '#ffffff', { opacity: 0.22 }),
  ];
}
export function paperPlane(s: number, col = '#f7f4ea'): Shape[] {
  return [
    sh(poly([[-s * 0.5, -s * 0.05], [s * 0.5, -s * 0.24], [-s * 0.12, s * 0.06]]), col, { stroke: '#9a9080', strokeWidth: 1 }),
    sh(poly([[-s * 0.12, s * 0.06], [s * 0.5, -s * 0.24], [-s * 0.04, s * 0.26]]), shade(col, -0.12), { stroke: '#9a9080', strokeWidth: 1 }),
    sh(poly([[-s * 0.12, s * 0.06], [s * 0.5, -s * 0.24], [-s * 0.2, s * 0.14]]), shade(col, -0.25), { stroke: '#9a9080', strokeWidth: 0.8 }),
  ];
}
export function toyBoat(s: number, hull = '#d2452f'): Shape[] {
  return [
    shadow(0, s * 0.04, s * 0.48, s * 0.05), stroke(line([[0, -s * 0.12], [0, -s * 0.8]]), '#6b3f22', 2),
    ol(poly([[s * 0.02, -s * 0.78], [s * 0.4, -s * 0.2], [s * 0.02, -s * 0.2]]), '#f7f4ea', 1, -0.3), ol(poly([[-s * 0.04, -s * 0.66], [-s * 0.04, -s * 0.22], [-s * 0.32, -s * 0.22]]), '#f6d23c', 1, -0.3),
    sh(poly([[0, -s * 0.8], [s * 0.14, -s * 0.74], [0, -s * 0.68]]), '#2f6690'),
    ol(poly([[-s * 0.5, -s * 0.18], [s * 0.5, -s * 0.18], [s * 0.36, s * 0.04], [-s * 0.38, s * 0.04]]), hull, 1), sh(rect(-s * 0.44, -s * 0.12, s * 0.88, s * 0.05), '#f7f4ea'),
  ];
}

// =====================================================================
// scenery props
// =====================================================================
export interface CaseOpts { seed?: number; stickers?: boolean; straps?: boolean; handle?: boolean; trim?: string }
/** Hard-sided suitcase standing on its base at origin (bottom centre). */
export function suitcase(w: number, h: number, col: string, o: CaseOpts = {}): Shape[] {
  const g = rng(o.seed ?? 1), trim = o.trim ?? '#6b4a2f';
  const out: Shape[] = [shadow(w * 0.04, 0, w * 0.54, Math.max(4, h * 0.08), 0.22)];
  if (o.handle !== false) out.push(stroke(rect(-w * 0.14, -h - h * 0.12, w * 0.28, h * 0.16, 4), shade(trim, -0.2), 3.4));
  out.push(ol(rect(-w / 2, -h, w, h, Math.min(8, h * 0.12)), col, 1.2, -0.4), sh(rect(-w / 2 + 3, -h + 3, w - 6, h * 0.16, 4), shade(col, 0.16)), sh(rect(w * 0.32, -h + 2, w * 0.16, h - 4, 4), shade(col, -0.14)));
  out.push(stroke(line([[-w / 2 + 2, -h * 0.5], [w / 2 - 2, -h * 0.5]]), shade(col, -0.35), 1.2));
  const cs = Math.min(w, h) * 0.14;
  out.push(sh(poly([[-w / 2, -h], [-w / 2 + cs, -h], [-w / 2, -h + cs]]) + poly([[w / 2, -h], [w / 2 - cs, -h], [w / 2, -h + cs]]) + poly([[-w / 2, 0], [-w / 2 + cs, 0], [-w / 2, -cs]]) + poly([[w / 2, 0], [w / 2 - cs, 0], [w / 2, -cs]]), trim));
  if (o.straps !== false && w > 50) {
    for (const t of [-0.28, 0.24]) out.push(sh(rect(w * t - 4, -h, 8, h), trim), sh(rect(w * t - 5, -h * 0.56, 10, h * 0.12, 1), GOLD));
  } else out.push(sh(rect(-w * 0.12, -h * 0.56, w * 0.24, h * 0.12, 2), GOLD));
  if (o.stickers !== false) {
    const cols = ['#f6dc9c', '#d2452f', '#3f8fa3', '#fbf6e8', '#7fb069', '#f08a4b', '#2f6690'];
    const k = Math.max(1, Math.round((w * h) / 4200));
    for (let i = 0; i < k; i++) {
      const sx = g.range(-w * 0.38, w * 0.38), sy = g.range(-h * 0.82, -h * 0.2), r = Math.min(w, h) * g.range(0.08, 0.13), c = g.pick(cols);
      if (g.next() < 0.5) out.push(ol(circle(sx, sy, r), c, 0.8, -0.3), sh(circle(sx, sy, r * 0.55), g.pick(cols), { opacity: 0.85 }));
      else out.push(ol(xf(rect(-r * 1.2, -r * 0.8, r * 2.4, r * 1.6, 2), { rot: g.range(-15, 15), x: sx, y: sy }), c, 0.8, -0.3), sh(xf(star(0, 0, r * 0.5, r * 0.22, 5), { rot: g.range(-15, 15), x: sx, y: sy }), g.pick(cols), { opacity: 0.85 }));
    }
  }
  return out;
}
/** Suitcase seen lying flat (shown as a long low box with the handle on the near side). */
export function flatCase(w: number, h: number, col: string, seed = 1): Shape[] {
  const g = rng(seed);
  const out: Shape[] = [shadow(0, 0, w * 0.52, 5, 0.2), ol(rect(-w / 2, -h, w, h, 5), col, 1.2, -0.4), sh(rect(-w / 2 + 2, -h + 2, w - 4, h * 0.3, 3), shade(col, 0.18)), stroke(line([[-w / 2, -h * 0.55], [w / 2, -h * 0.55]]), shade(col, -0.35), 1)];
  out.push(sh(rect(-w * 0.1, -h * 0.4, w * 0.2, h * 0.24, 3), shade(col, -0.3)), sh(rect(-w * 0.42, -h * 0.68, 10, h * 0.26, 1) + rect(w * 0.42 - 10, -h * 0.68, 10, h * 0.26, 1), GOLD));
  if (g.next() < 0.7) { const c = g.pick(['#f6dc9c', '#d2452f', '#3f8fa3', '#fbf6e8']); out.push(ol(circle(g.range(-w * 0.3, -w * 0.15), -h * 0.5, h * 0.24), c, 0.8)); }
  return out;
}
export function trunk(w: number, h: number, col = '#6b4a2f', band = '#3a2a1c'): Shape[] {
  const out: Shape[] = [shadow(w * 0.04, 0, w * 0.54, 7, 0.25), ol(rect(-w / 2, -h, w, h, 4), col, 1.2, -0.4)];
  let planks = '';
  for (let i = 1; i < 5; i++) planks += line([[-w / 2, -h + (h * i) / 5], [w / 2, -h + (h * i) / 5]]);
  out.push(stroke(planks, shade(col, -0.25), 1), sh(rect(-w / 2, -h, w, h * 0.3, 4), shade(col, 0.12)), stroke(line([[-w / 2, -h * 0.7], [w / 2, -h * 0.7]]), shade(col, -0.5), 1.6));
  for (const t of [-0.42, -0.14, 0.14, 0.42]) out.push(sh(rect(w * t - 5, -h, 10, h), band));
  let rivets = '';
  for (const t of [-0.42, -0.14, 0.14, 0.42]) for (let i = 0; i < 5; i++) rivets += circle(w * t, -h + 6 + ((h - 12) * i) / 4, 1.3);
  out.push(sh(rivets, GOLD), ol(rect(-w * 0.06, -h * 0.76, w * 0.12, h * 0.16, 2), GOLD, 1), sh(circle(0, -h * 0.67, 2), '#3a2a1c'));
  out.push(stroke(rect(-w / 2 - 6, -h * 0.58, 8, h * 0.18, 3) + rect(w / 2 - 2, -h * 0.58, 8, h * 0.18, 3), '#2a1a10', 2.4));
  return out;
}
export function hatbox(w: number, h: number, col: string, stripe: string): Shape[] {
  let st = '';
  for (let i = 0; i < 6; i++) st += rect(-w / 2 + (w * i) / 6 + w / 24, -h * 0.82, w / 12, h * 0.82);
  return [
    shadow(0, 0, w * 0.52, 6, 0.22), ol(M(-w / 2, -h * 0.82) + L(-w / 2, 0) + Q(0, h * 0.14, w / 2, 0) + L(w / 2, -h * 0.82) + 'Z', col, 1),
    sh(st, stripe, { opacity: 0.8 }), ol(ellipse(0, -h * 0.84, w / 2 + 3, h * 0.14), shade(col, 0.1), 1), ol(rect(-w / 2 - 3, -h * 0.86, w + 6, h * 0.14, 3), shade(col, -0.05), 1),
    stroke(M(-w * 0.18, -h * 0.98) + Q(0, -h * 1.3, w * 0.18, -h * 0.98), '#2a1a10', 2),
  ];
}
/** Large potted palm; origin at base of pot. */
export function pottedPalm(h: number, seed: number, pot = '#c9673f'): Shape[] {
  const g = rng(seed), out: Shape[] = [shadow(0, 0, h * 0.22, h * 0.03)];
  const fr: Shape[] = [];
  const N = 9;
  for (let i = 0; i < N; i++) {
    const a = -170 + (160 * i) / (N - 1) + g.range(-8, 8), len = h * g.range(0.42, 0.58), rad = (a * Math.PI) / 180;
    const bx = 0, by = -h * 0.55, ex = bx + Math.cos(rad) * len, ey = by + Math.sin(rad) * len * 0.75 + len * 0.25;
    const mx = (bx + ex) / 2, my = Math.min(by, ey) - len * 0.18;
    fr.push(stroke(M(bx, by) + Q(mx, my, ex, ey), '#4f6b2f', 1.6));
    let lf = '', lf2 = '';
    for (let k = 1; k < 9; k++) {
      const t = k / 9, px = (1 - t) * (1 - t) * bx + 2 * (1 - t) * t * mx + t * t * ex, py = (1 - t) * (1 - t) * by + 2 * (1 - t) * t * my + t * t * ey;
      const dir = Math.atan2(ey - by, ex - bx) * (180 / Math.PI), ll = len * 0.22 * (1 - t * 0.5);
      lf += leaf(px, py, ll, ll * 0.18, dir + 55); lf2 += leaf(px, py, ll, ll * 0.18, dir - 55);
    }
    const c = g.pick(['#3f7a3a', '#4f8a3f', '#5c9a45']);
    fr.push(sh(lf, c), sh(lf2, shade(c, -0.15)));
  }
  out.push(stroke(line([[0, -h * 0.2], [0, -h * 0.55]]), '#7a5a35', 6), ...fr);
  const pw = h * 0.2, ph = h * 0.2;
  out.push(ol(poly([[-pw / 2, -ph], [pw / 2, -ph], [pw * 0.36, 0], [-pw * 0.36, 0]]), pot, 1), sh(poly([[pw * 0.1, -ph], [pw / 2, -ph], [pw * 0.36, 0], [pw * 0.08, 0]]), shade(pot, -0.15)), ol(rect(-pw * 0.56, -ph - 8, pw * 1.12, 12, 3), shade(pot, 0.12), 1), stroke(line([[-pw * 0.42, -ph * 0.5], [pw * 0.42, -ph * 0.5]]), shade(pot, 0.3), 2));
  return out;
}
/** Pigeon standing, facing right (use sx:-1 to flip). Origin at feet. */
export function pigeon(s: number, col = '#8a93a0', seed = 0): Shape[] {
  const neck = seed % 2 ? '#6f8f7a' : '#7a6f94';
  return [
    shadow(0, 0, s * 0.4, s * 0.05, 0.2), stroke(line([[-s * 0.06, 0], [-s * 0.04, -s * 0.16]]) + line([[s * 0.08, 0], [s * 0.06, -s * 0.16]]), '#d9736a', 1.6),
    sh(blob([[-s * 0.55, -s * 0.34], [-s * 0.2, -s * 0.46], [s * 0.2, -s * 0.44], [s * 0.32, -s * 0.28], [s * 0.1, -s * 0.14], [-s * 0.3, -s * 0.2]], 0.9), col),
    sh(blob([[-s * 0.48, -s * 0.36], [-s * 0.1, -s * 0.42], [s * 0.12, -s * 0.32], [-s * 0.2, -s * 0.26]], 0.9), shade(col, -0.18)), stroke(line([[-s * 0.3, -s * 0.33], [0, -s * 0.33]]) + line([[-s * 0.25, -s * 0.29], [-s * 0.02, -s * 0.29]]), '#3a3f48', 1.4),
    sh(blob([[s * 0.12, -s * 0.44], [s * 0.3, -s * 0.5], [s * 0.36, -s * 0.34], [s * 0.2, -s * 0.28]], 0.9), neck), sh(circle(s * 0.3, -s * 0.56, s * 0.11), shade(col, 0.05)),
    sh(poly([[s * 0.4, -s * 0.58], [s * 0.5, -s * 0.54], [s * 0.4, -s * 0.52]]), '#3a3a3f'), sh(circle(s * 0.33, -s * 0.58, s * 0.022), '#d2452f'),
  ];
}
/** Round paper lantern hanging from origin (top of cord). */
export function paperLantern(r: number, col: string, cord = 30): Shape[] {
  let ribs = '';
  for (let i = -2; i <= 2; i++) ribs += M(r * i * 0.38, cord + 4) + Q(r * i * 0.52, cord + r, r * i * 0.38, cord + r * 2 - 4);
  return [
    stroke(line([[0, 0], [0, cord]]), '#3a2a22', 1.2), sh(circle(0, cord + r, r * 1.6), '#ffd77a', { opacity: 0.18 }),
    sh(ellipse(0, cord + r, r, r * 0.95), col), sh(ellipse(-r * 0.25, cord + r * 0.8, r * 0.45, r * 0.55), '#ffe9a8', { opacity: 0.45 }), stroke(ribs, shade(col, -0.35), 0.9),
    sh(rect(-r * 0.4, cord - 2, r * 0.8, 6, 1) + rect(-r * 0.4, cord + r * 2 - 4, r * 0.8, 6, 1), '#2a1a10'), stroke(line([[0, cord + r * 2 + 2], [0, cord + r * 2 + 14]]), '#f2b92e', 2),
  ];
}
/** Simple background figure silhouette (no face detail), origin at feet. */
export function figure(h: number, coat: string, seed: number): Shape[] {
  const g = rng(seed), skin = g.pick(['#e8b994', '#c98e64', '#8a5a3a', '#f2cfae']), hair = g.pick(['#3a2a22', '#6b4a2f', '#1f1f24', '#9a8a7a']);
  const out: Shape[] = [shadow(0, 0, h * 0.14, h * 0.025, 0.2), sh(rect(-h * 0.07, -h * 0.46, h * 0.06, h * 0.46) + rect(h * 0.01, -h * 0.46, h * 0.06, h * 0.46), '#3a3a42')];
  out.push(sh(M(-h * 0.13, -h * 0.4) + L(-h * 0.11, -h * 0.78) + Q(0, -h * 0.84, h * 0.11, -h * 0.78) + L(h * 0.13, -h * 0.4) + 'Z', coat), sh(rect(-h * 0.03, -h * 0.84, h * 0.06, h * 0.06), skin), sh(circle(0, -h * 0.9, h * 0.075), skin), sh(sector(0, -h * 0.91, h * 0.08, 180, 360), hair));
  if (g.next() < 0.5) out.push(sh(ellipse(0, -h * 0.97, h * 0.11, h * 0.025) + rect(-h * 0.065, -h * 1.03, h * 0.13, h * 0.06, 2), g.pick(['#2a2a2e', '#6b4a2f', '#8c2b2b'])));
  return out;
}
export { place, shade, mix, rng, xf, sh, stroke, rect, ellipse, circle, poly, line, curve, blob, leaf, star, sector };
