// Shared props for the "On the Road" hidden-object scenes.
// Every prop is drawn around the origin and sized by `s` (roughly its width or height), then place()d.
import { rect, ellipse, circle, poly, line, curve, blob, leaf, star, sector, sh, stroke, place, shade, mix, rng, xf } from '../../art/kit';
import type { Shape } from '../../art/types';

export type Pt = [number, number];
const n = (v: number) => String(Math.round(v * 10) / 10);
export const M = (x: number, y: number) => `M${n(x)} ${n(y)}`;
export const L = (x: number, y: number) => `L${n(x)} ${n(y)}`;
export const Q = (cx: number, cy: number, x: number, y: number) => `Q${n(cx)} ${n(cy)} ${n(x)} ${n(y)}`;

/** Filled shape with a darker outline of the same hue. */
export const ol = (d: string, fill: string, w = 1, amt = -0.35): Shape => sh(d, fill, { stroke: shade(fill, amt), strokeWidth: w });
export const shadow = (cx: number, cy: number, rx: number, ry: number, o = 0.22): Shape => sh(ellipse(cx, cy, rx, ry), '#1f160e', { opacity: o });
export const GOLD = '#d9b45a';
const GOLD_D = '#9c7a2e';

// =====================================================================
// small travel things (targets)
// =====================================================================
/** U-shaped travel neck pillow, opening at the top. */
export function neckPillow(s: number, col: string): Shape[] {
  const d = M(-s * 0.5, -s * 0.12) + Q(-s * 0.52, s * 0.46, 0, s * 0.46) + Q(s * 0.52, s * 0.46, s * 0.5, -s * 0.12) + Q(s * 0.48, -s * 0.42, s * 0.3, -s * 0.4) +
    Q(s * 0.14, -s * 0.36, s * 0.18, -s * 0.08) + Q(s * 0.2, s * 0.2, 0, s * 0.2) + Q(-s * 0.2, s * 0.2, -s * 0.18, -s * 0.08) + Q(-s * 0.14, -s * 0.36, -s * 0.3, -s * 0.4) + Q(-s * 0.48, -s * 0.42, -s * 0.5, -s * 0.12) + 'Z';
  return [
    shadow(s * 0.03, s * 0.42, s * 0.42, s * 0.08), ol(d, col, 1.2, -0.3),
    stroke(M(-s * 0.36, -s * 0.28) + Q(-s * 0.38, s * 0.33, 0, s * 0.33) + Q(s * 0.38, s * 0.33, s * 0.36, -s * 0.28), shade(col, -0.25), 1.1),
    sh(ellipse(-s * 0.34, -s * 0.02, s * 0.05, s * 0.16, 10), '#ffffff', { opacity: 0.3 }), sh(rect(-s * 0.08, s * 0.38, s * 0.16, s * 0.06, 2), shade(col, -0.3)),
  ];
}
/** Boarding pass lying flat. */
export function boardingPass(s: number, col = '#2f6690'): Shape[] {
  const w = s, h = s * 0.42;
  let bars = '';
  const g = rng(7);
  for (let x = w * 0.18; x < w * 0.44; x += g.range(1.6, 3.4)) bars += rect(x, h * 0.02, g.range(0.7, 1.6), h * 0.3);
  return [
    sh(rect(-w / 2 + 3, -h / 2 + 3, w, h, 3), '#000000', { opacity: 0.18 }), ol(rect(-w / 2, -h / 2, w, h, 3), '#fbf8f0', 1, -0.3),
    sh(rect(-w / 2, -h / 2, w, h * 0.26, 3), col), sh(rect(w * 0.12, -h / 2, w * 0.38, h * 0.26), shade(col, -0.2)),
    sh(xf(poly([[-6, 0], [6, -1], [8, 0], [6, 1]]) + poly([[-1, 0], [3, -5], [4, -5], [2, 0]]) + poly([[-1, 0], [3, 5], [4, 5], [2, 0]]), { s: h * 0.06, x: -w * 0.3, y: -h * 0.36 }), '#ffffff'),
    sh(rect(-w * 0.44, -h * 0.12, w * 0.18, h * 0.12, 1) + rect(-w * 0.2, -h * 0.12, w * 0.18, h * 0.12, 1), shade(col, -0.1)),
    stroke(line([[-w * 0.44, h * 0.14], [w * 0.0, h * 0.14]]) + line([[-w * 0.44, h * 0.28], [-w * 0.1, h * 0.28]]), '#9a9488', 1.4),
    sh(bars, '#2a2a2e'), stroke(line([[w * 0.1, -h * 0.5], [w * 0.1, h * 0.5]]), '#b8b0a0', 1, { opacity: 0.9 }),
  ];
}
export function passport(s: number, col = '#6b1f2e'): Shape[] {
  const w = s * 0.72, h = s;
  return [
    sh(rect(-w / 2 + 3, -h / 2 + 3, w, h, 4), '#000000', { opacity: 0.2 }), sh(rect(w / 2 - 7, -h / 2 + 2, 6, h - 4, 2), '#f3ead6'),
    ol(rect(-w / 2, -h / 2, w - 3, h, 4), col, 1), stroke(circle(-1.5, -h * 0.06, w * 0.22), GOLD, 1.6), sh(star(-1.5, -h * 0.06, w * 0.13, w * 0.055, 5), GOLD),
    sh(rect(-w * 0.3, -h * 0.4, w * 0.56, 2.2) + rect(-w * 0.3, h * 0.24, w * 0.56, 2.4) + rect(-w * 0.22, h * 0.32, w * 0.4, 2), GOLD),
  ];
}
/** Takeaway coffee cup with lid and sleeve, origin at base. */
export function coffeeCup(s: number, sleeve = '#a8743a'): Shape[] {
  const h = s, tw = s * 0.62, bw = s * 0.46;
  return [
    shadow(0, 0, s * 0.3, s * 0.05), ol(poly([[-tw / 2, -h * 0.86], [tw / 2, -h * 0.86], [bw / 2, 0], [-bw / 2, 0]]), '#fbf6ec', 1, -0.25),
    ol(poly([[-tw * 0.47, -h * 0.62], [tw * 0.47, -h * 0.62], [tw * 0.41, -h * 0.3], [-tw * 0.41, -h * 0.3]]), sleeve, 0.8),
    sh(circle(0, -h * 0.46, h * 0.07), '#fbf6ec', { opacity: 0.8 }),
    ol(rect(-tw * 0.56, -h * 0.94, tw * 1.12, h * 0.1, 3), '#3a2a22', 0.8, 0.3), ol(rect(-tw * 0.4, -h, tw * 0.8, h * 0.07, 3), '#4a3a30', 0.8, 0.3),
    sh(rect(-tw * 0.38, -h * 0.8, tw * 0.12, h * 0.7), '#ffffff', { opacity: 0.4 }),
  ];
}
export function croissant(s: number): Shape[] {
  const out: Shape[] = [shadow(0, s * 0.18, s * 0.5, s * 0.08)];
  const segs = 5;
  for (let i = 0; i < segs; i++) {
    const t = i / (segs - 1), a = Math.PI * (1.15 - t * 1.3), r = s * 0.3;
    const x = Math.cos(a) * r, y = -Math.sin(a) * r * 0.7 + s * 0.12, big = 1 - Math.abs(t - 0.5) * 1.2;
    const rx = s * (0.1 + big * 0.12), ry = s * (0.1 + big * 0.07), rot = (-a * 180) / Math.PI + 90;
    out.push(ol(ellipse(x, y, rx, ry, rot), i % 2 ? '#d99a48' : '#e6ac58', 1, -0.3));
  }
  out.push(sh(ellipse(-s * 0.04, -s * 0.12, s * 0.12, s * 0.04, -8), '#f6d08a', { opacity: 0.7 }));
  return out;
}
export function headphones(s: number, col = '#2f3a5a'): Shape[] {
  return [
    sh(sector(0, s * 0.05, s * 0.44, 190, 350, s * 0.36), col), sh(sector(0, s * 0.05, s * 0.43, 230, 310, s * 0.4), shade(col, 0.3)),
    ol(rect(-s * 0.5, -s * 0.02, s * 0.16, s * 0.34, 6), shade(col, -0.1), 1, -0.4), ol(rect(s * 0.34, -s * 0.02, s * 0.16, s * 0.34, 6), shade(col, -0.1), 1, -0.4),
    sh(rect(-s * 0.36, s * 0.02, s * 0.06, s * 0.26, 3) + rect(s * 0.3, s * 0.02, s * 0.06, s * 0.26, 3), '#c9c9cf'),
    sh(circle(-s * 0.42, s * 0.15, s * 0.04) + circle(s * 0.42, s * 0.15, s * 0.04), shade(col, 0.35)),
  ];
}
export function sunglasses(s: number, frame = '#1f1f24', lens = '#2b3540'): Shape[] {
  const r = s * 0.2;
  return [
    stroke(M(-s * 0.48, -r * 0.4) + L(-s * 0.6, -r * 0.6) + M(s * 0.48, -r * 0.4) + L(s * 0.6, -r * 0.6), frame, 2.4),
    ol(blob([[-s * 0.48, -r * 0.5], [-s * 0.08, -r * 0.6], [-s * 0.1, r * 0.4], [-s * 0.3, r * 0.85], [-s * 0.46, r * 0.3]], 0.8), lens, 2, -0.3),
    ol(blob([[s * 0.48, -r * 0.5], [s * 0.08, -r * 0.6], [s * 0.1, r * 0.4], [s * 0.3, r * 0.85], [s * 0.46, r * 0.3]], 0.8), lens, 2, -0.3),
    stroke(M(-s * 0.1, -r * 0.4) + Q(0, -r * 0.75, s * 0.1, -r * 0.4), frame, 2.4),
    sh(ellipse(-s * 0.3, -r * 0.15, r * 0.3, r * 0.14, -25) + ellipse(s * 0.24, -r * 0.15, r * 0.3, r * 0.14, -25), '#bcd8ec', { opacity: 0.6 }),
  ];
}
/** Little toy aeroplane, nose pointing right. */
export function toyPlane(s: number, col = '#d2452f', wing = '#f2c14e'): Shape[] {
  let win = '';
  for (let i = 0; i < 4; i++) win += circle(-s * 0.16 + i * s * 0.11, -s * 0.03, s * 0.025);
  return [
    shadow(0, s * 0.22, s * 0.44, s * 0.05), ol(poly([[-s * 0.36, -s * 0.04], [-s * 0.46, -s * 0.28], [-s * 0.36, -s * 0.28], [-s * 0.22, -s * 0.06]]), wing, 1),
    ol(M(-s * 0.46, -s * 0.06) + Q(-s * 0.1, -s * 0.16, s * 0.34, -s * 0.1) + Q(s * 0.5, -s * 0.06, s * 0.48, 0) + Q(s * 0.4, s * 0.08, -s * 0.2, s * 0.06) + Q(-s * 0.42, s * 0.04, -s * 0.46, -s * 0.06) + 'Z', col, 1),
    ol(poly([[-s * 0.06, s * 0.02], [s * 0.12, s * 0.02], [-s * 0.02, s * 0.3], [-s * 0.14, s * 0.3]]), wing, 1),
    sh(win, '#cfe6f2'), sh(M(s * 0.32, -s * 0.1) + Q(s * 0.44, -s * 0.08, s * 0.46, -s * 0.02) + L(s * 0.34, -s * 0.03) + 'Z', '#cfe6f2'),
    sh(circle(-s * 0.02, s * 0.3, s * 0.03) + circle(s * 0.3, s * 0.08, s * 0.03), '#2a2a2e'),
  ];
}
export function camera(s: number, body = '#2f2f33', band = '#8a5a3a'): Shape[] {
  const w = s, h = s * 0.62;
  return [
    sh(rect(-w * 0.32, -h * 0.62, w * 0.3, h * 0.2, 3), shade(body, 0.15)), sh(rect(w * 0.18, -h * 0.58, w * 0.16, h * 0.14, 2), '#c7c7c7'),
    ol(rect(-w / 2, -h * 0.45, w, h * 0.9, 6), body, 1.2), sh(rect(-w / 2, -h * 0.12, w, h * 0.32), band),
    sh(circle(0, 0.03 * h, h * 0.4), '#c9c9c9'), sh(circle(0, 0.03 * h, h * 0.31), '#2a2a2e'), sh(circle(0, 0.03 * h, h * 0.2), '#3b5a78'), sh(circle(-h * 0.07, -h * 0.05, h * 0.07), '#ffffff', { opacity: 0.7 }),
    sh(rect(w * 0.3, -h * 0.36, w * 0.12, h * 0.12, 2), '#f4efe0'), sh(circle(-w * 0.36, -h * 0.3, h * 0.06), '#c33'),
  ];
}
/** Water bottle standing, origin at base. */
export function waterBottle(h: number, col = '#3f8fbf'): Shape[] {
  const w = h * 0.34;
  return [
    shadow(0, 0, w * 0.6, h * 0.04), ol(rect(-w / 2, -h * 0.84, w, h * 0.84, w * 0.28), '#cfe8f2', 1, -0.35),
    sh(rect(-w / 2 + 1, -h * 0.5, w - 2, h * 0.5 - 2, w * 0.25), col, { opacity: 0.55 }), sh(rect(-w / 2, -h * 0.62, w, h * 0.22), col),
    sh(rect(-w * 0.3, -h * 0.56, w * 0.6, h * 0.04), '#ffffff', { opacity: 0.7 }),
    ol(rect(-w * 0.34, -h, w * 0.68, h * 0.18, 3), shade(col, -0.2), 1), stroke(M(w * 0.34, -h * 0.94) + Q(w * 0.7, -h * 0.94, w * 0.36, -h * 0.84), shade(col, -0.3), 2),
    sh(rect(-w * 0.36, -h * 0.8, w * 0.12, h * 0.7, 3), '#ffffff', { opacity: 0.45 }),
  ];
}
/** Luggage tag with a loop of string at the top-left. */
export function luggageTag(s: number, col = '#f2c14e'): Shape[] {
  const w = s * 0.6, h = s;
  return [
    stroke(curve([[0, -h * 0.4], [-w * 0.3, -h * 0.62], [-w * 0.1, -h * 0.72], [w * 0.2, -h * 0.6]]), '#c8322a', 2),
    ol(poly([[-w / 2, -h * 0.28], [-w * 0.2, -h / 2], [w * 0.2, -h / 2], [w / 2, -h * 0.28], [w / 2, h / 2], [-w / 2, h / 2]]), col, 1.2),
    sh(circle(0, -h * 0.36, w * 0.09), shade(col, -0.5)), stroke(circle(0, -h * 0.36, w * 0.13), '#c9ccd2', 1.6),
    ol(rect(-w * 0.36, -h * 0.12, w * 0.72, h * 0.5, 2), '#fbf8f0', 0.8, -0.2),
    stroke(line([[-w * 0.28, 0], [w * 0.28, 0]]) + line([[-w * 0.28, h * 0.12], [w * 0.2, h * 0.12]]) + line([[-w * 0.28, h * 0.24], [w * 0.26, h * 0.24]]), '#8a8478', 1.2),
  ];
}
export function wristwatch(s: number, strap = '#6b3f22'): Shape[] {
  const r = s * 0.24;
  return [
    ol(rect(-s * 0.14, -s * 0.5, s * 0.28, s, 5), strap, 1), sh(rect(-s * 0.1, s * 0.3, s * 0.2, s * 0.04, 1) + rect(-s * 0.1, s * 0.4, s * 0.2, s * 0.04, 1), shade(strap, -0.3)),
    ol(rect(-s * 0.15, -s * 0.47, s * 0.3, s * 0.06, 1), '#c9ccd2', 0.8),
    ol(circle(0, 0, r * 1.18), GOLD, 1), sh(circle(0, 0, r), '#fbf6e8'),
    sh(circle(0, -r * 0.78, s * 0.018) + circle(r * 0.78, 0, s * 0.018) + circle(0, r * 0.78, s * 0.018) + circle(-r * 0.78, 0, s * 0.018), '#3a3a3f'),
    stroke(line([[0, 0], [r * 0.4, -r * 0.45]]) + line([[0, 0], [0, -r * 0.7]]), '#2a2a2e', 1.6), sh(rect(r * 1.14, -s * 0.03, s * 0.06, s * 0.06, 1), GOLD_D),
  ];
}
/** Paperback book lying closed. */
export function book(s: number, col: string, accent = '#f2c14e'): Shape[] {
  const w = s, h = s * 0.7;
  return [
    sh(rect(-w / 2 + 3, -h / 2 + 4, w, h, 2), '#000000', { opacity: 0.18 }), sh(rect(-w / 2 + 2, -h / 2 + 3, w, h, 2), '#f3ead6'),
    stroke(line([[-w / 2 + 3, h / 2 + 1], [w / 2, h / 2 + 1]]) + line([[w / 2 + 1, -h / 2 + 4], [w / 2 + 1, h / 2]]), '#c9bea4', 1),
    ol(rect(-w / 2, -h / 2, w, h, 2), col, 1), sh(rect(-w / 2, -h / 2, w * 0.1, h), shade(col, -0.2)),
    sh(circle(w * 0.08, -h * 0.05, h * 0.2), accent), sh(rect(-w * 0.28, h * 0.24, w * 0.66, h * 0.08, 1) + rect(-w * 0.28, -h * 0.38, w * 0.5, h * 0.06, 1), '#fbf6e8', { opacity: 0.85 }),
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
export function binoculars(s: number, col = '#2f3a33'): Shape[] {
  const tube = (x: number) => [ol(rect(x - s * 0.17, -s * 0.3, s * 0.34, s * 0.5, 5), col, 1), sh(rect(x - s * 0.17, -s * 0.1, s * 0.34, s * 0.12), '#6b4a2f'), ol(rect(x - s * 0.2, s * 0.18, s * 0.4, s * 0.16, 4), shade(col, -0.2), 1), sh(ellipse(x, s * 0.34, s * 0.15, s * 0.05), '#8fb4c9'), ol(rect(x - s * 0.12, -s * 0.44, s * 0.24, s * 0.16, 3), shade(col, 0.15), 1)];
  return [shadow(0, s * 0.38, s * 0.48, s * 0.06), ...tube(-s * 0.24), ...tube(s * 0.24), ol(rect(-s * 0.1, -s * 0.24, s * 0.2, s * 0.12, 2), '#9a9a9a', 1), sh(circle(0, -s * 0.18, s * 0.05), '#5a5a5a')];
}
/** Glossy magazine lying flat, abstract cover (no words). */
export function magazine(s: number, col: string, art: string, seed = 1): Shape[] {
  const w = s * 0.74, h = s, g = rng(seed), k = g.int(0, 2);
  const out: Shape[] = [sh(rect(-w / 2 + 3, -h / 2 + 3, w, h, 1), '#000000', { opacity: 0.16 }), ol(rect(-w / 2, -h / 2, w, h, 1), col, 0.8, -0.3), sh(rect(-w * 0.4, -h * 0.44, w * 0.8, h * 0.1), '#ffffff', { opacity: 0.85 })];
  if (k === 0) out.push(sh(circle(0, h * 0.08, w * 0.26), art));
  else if (k === 1) out.push(sh(poly([[-w * 0.36, h * 0.36], [-w * 0.05, -h * 0.18], [w * 0.36, h * 0.36]]), art));
  else out.push(sh(rect(-w * 0.32, -h * 0.22, w * 0.64, h * 0.5, 2), art));
  out.push(sh(rect(-w * 0.4, h * 0.38, w * 0.5, h * 0.04), '#ffffff', { opacity: 0.7 }));
  return out;
}

// =====================================================================
// campsite things
// =====================================================================
/** Enamel camp kettle on its base (origin at base). */
export function campKettle(s: number, col = '#3f7d6e'): Shape[] {
  const w = s * 0.72, h = s * 0.56;
  return [
    ol(M(-w * 0.44, -h * 0.5) + L(-w * 0.78, -h * 0.9) + L(-w * 0.86, -h * 0.84) + L(-w * 0.56, -h * 0.28) + 'Z', col, 1),
    ol(M(-w / 2, -h * 0.66) + Q(-w * 0.56, 0, 0, 0) + Q(w * 0.56, 0, w / 2, -h * 0.66) + Q(0, -h * 0.82, -w / 2, -h * 0.66) + 'Z', col, 1.2),
    sh(ellipse(-w * 0.22, -h * 0.4, w * 0.08, h * 0.18, 10), '#ffffff', { opacity: 0.3 }), sh(rect(-w / 2, -h * 0.12, w, h * 0.1, 2), '#fbf6ec', { opacity: 0.85 }),
    ol(ellipse(0, -h * 0.74, w * 0.28, h * 0.08), shade(col, 0.15), 1), sh(circle(0, -h * 0.84, w * 0.06), '#2a2a2e'),
    stroke(M(-w * 0.36, -h * 0.72) + Q(0, -h * 1.5, w * 0.36, -h * 0.72), '#4a4a50', 2.6),
  ];
}
/** Folded paper map lying open. */
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
export function compass(r: number): Shape[] {
  let ticks = '';
  for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2, r0 = r * (i % 4 ? 0.74 : 0.66); ticks += line([[Math.cos(a) * r0, Math.sin(a) * r0], [Math.cos(a) * r * 0.82, Math.sin(a) * r * 0.82]]); }
  return [
    shadow(r * 0.12, r * 0.15, r * 1.05, r * 1.0, 0.25), stroke(circle(0, -r * 1.15, r * 0.18), GOLD_D, 2.4), sh(rect(-r * 0.14, -r * 1.08, r * 0.28, r * 0.16, 2), GOLD),
    ol(circle(0, 0, r), GOLD, 1.2), sh(circle(0, 0, r * 0.86), '#fbf6e8'), stroke(ticks, '#6b5b4b', 1),
    sh(poly([[0, -r * 0.7], [r * 0.12, 0], [-r * 0.12, 0]]), '#c8322a'), sh(poly([[0, r * 0.7], [r * 0.12, 0], [-r * 0.12, 0]]), '#2f4a6a'), sh(circle(0, 0, r * 0.08), GOLD_D),
  ];
}
/** Hurricane camp lantern, origin at base. */
export function campLantern(h: number, col = '#c8322a', lit = true): Shape[] {
  const w = h * 0.5;
  const out: Shape[] = [shadow(0, 0, w * 0.6, h * 0.05)];
  if (lit) out.push(sh(circle(0, -h * 0.5, h * 0.7), '#ffd77a', { opacity: 0.16 }), sh(circle(0, -h * 0.5, h * 0.42), '#ffd77a', { opacity: 0.2 }));
  out.push(
    stroke(M(-w * 0.34, -h * 0.82) + Q(0, -h * 1.18, w * 0.34, -h * 0.82), '#3a3a40', 2.2),
    ol(rect(-w / 2, -h * 0.16, w, h * 0.16, 3), col, 1), sh(rect(-w * 0.42, -h * 0.14, w * 0.84, h * 0.04), shade(col, 0.25)),
    sh(ellipse(0, -h * 0.46, w * 0.36, h * 0.3), lit ? '#ffe39a' : '#d8e4e8', { opacity: 0.95 }), sh(ellipse(0, -h * 0.42, w * 0.12, h * 0.14), lit ? '#ffb43a' : '#a8b4b8'),
    stroke(line([[-w * 0.4, -h * 0.16], [-w * 0.4, -h * 0.76]]) + line([[w * 0.4, -h * 0.16], [w * 0.4, -h * 0.76]]), col, 2.4),
    ol(poly([[-w * 0.44, -h * 0.74], [w * 0.44, -h * 0.74], [w * 0.22, -h * 0.88], [-w * 0.22, -h * 0.88]]), col, 1), sh(rect(-w * 0.12, -h * 0.94, w * 0.24, h * 0.07, 2), shade(col, -0.25)),
  );
  return out;
}
/** Enamel mug, handle right, origin at base. */
export function enamelMug(s: number, col = '#2f6690'): Shape[] {
  const w = s * 0.7, h = s * 0.66;
  return [
    shadow(s * 0.05, 0, s * 0.44, s * 0.06), stroke(M(w * 0.48, -h * 0.78) + Q(w * 0.98, -h * 0.74, w * 0.5, -h * 0.24), col, 5), stroke(M(w * 0.48, -h * 0.78) + Q(w * 0.98, -h * 0.74, w * 0.5, -h * 0.24), shade(col, -0.35), 1),
    ol(rect(-w / 2, -h, w, h, 3), col, 1), sh(ellipse(0, -h, w / 2, h * 0.1), '#fbf6ec'), sh(ellipse(0, -h + 1, w * 0.42, h * 0.07), '#5a3a22'),
    stroke(ellipse(0, -h, w / 2, h * 0.1), '#fbf6ec', 2), sh(circle(-w * 0.14, -h * 0.46, w * 0.12), '#fbf6ec', { opacity: 0.9 }), sh(rect(-w * 0.42, -h * 0.9, w * 0.1, h * 0.8, 2), '#ffffff', { opacity: 0.22 }),
  ];
}
/** Torch / flashlight, beam end on the right. */
export function flashlight(s: number, col = '#f2c14e'): Shape[] {
  const h = s * 0.22;
  return [
    shadow(0, h * 0.7, s * 0.5, h * 0.25), ol(rect(-s * 0.5, -h / 2, s * 0.66, h, h * 0.3), col, 1), ol(poly([[s * 0.14, -h / 2], [s * 0.36, -h * 0.84], [s * 0.36, h * 0.84], [s * 0.14, h / 2]]), col, 1),
    ol(rect(s * 0.34, -h * 0.9, s * 0.1, h * 1.8, 2), '#c9ccd2', 1), sh(rect(s * 0.42, -h * 0.76, s * 0.04, h * 1.52, 1), '#fff3c4'),
    sh(rect(-s * 0.36, -h / 2, s * 0.04, h) + rect(-s * 0.26, -h / 2, s * 0.04, h) + rect(-s * 0.16, -h / 2, s * 0.04, h), shade(col, -0.3)), ol(rect(-s * 0.04, -h * 0.66, s * 0.1, h * 0.2, 1), '#2a2a2e', 0.6),
  ];
}
/** Fishing rod with reel and a dangling line, handle at origin, rod pointing up-right. */
export function fishingRod(len: number): Shape[] {
  const tx = len * 0.7, ty = -len * 0.7;
  return [
    stroke(line([[0, 0], [tx, ty]]), '#3a3a40', 3), stroke(line([[0, 0], [len * 0.16, -len * 0.16]]), '#6b3f22', 7),
    stroke(curve([[tx, ty], [tx + len * 0.06, ty + len * 0.3], [tx + len * 0.04, ty + len * 0.5]]), '#e8e8e8', 1),
    ol(circle(len * 0.2, -len * 0.14, len * 0.055), '#c9ccd2', 1), sh(circle(len * 0.2, -len * 0.14, len * 0.02), '#3a3a40'),
    ol(ellipse(tx + len * 0.04, ty + len * 0.52, len * 0.024, len * 0.036), '#d2452f', 0.6), sh(rect(tx + len * 0.016, ty + len * 0.52, len * 0.048, len * 0.04, 2), '#fbf6ec'),
  ];
}
/** Toasting stick with a marshmallow; stick runs from origin to the right and slightly up. */
export function marshmallowStick(len: number): Shape[] {
  const ex = len, ey = -len * 0.28;
  return [
    stroke(curve([[0, 0], [len * 0.5, -len * 0.12], [ex, ey]]), '#7a5a35', 4),
    ol(rect(ex - len * 0.06, ey - len * 0.11, len * 0.2, len * 0.22, len * 0.06), '#fbf3e0', 1, -0.25), sh(rect(ex + len * 0.07, ey - len * 0.11, len * 0.07, len * 0.22, len * 0.03), '#d9a560'),
    sh(ellipse(ex + len * 0.02, ey - len * 0.04, len * 0.025, len * 0.02), '#ffffff', { opacity: 0.8 }),
  ];
}
/** Ukulele lying on its back, neck pointing up-left. */
export function ukulele(s: number, col = '#c98a4a'): Shape[] {
  const out: Shape[] = [
    shadow(s * 0.08, s * 0.3, s * 0.3, s * 0.08),
    ol(rect(-s * 0.06, -s * 0.66, s * 0.12, s * 0.5, 2), '#5a3a22', 1), ol(rect(-s * 0.08, -s * 0.8, s * 0.16, s * 0.16, 3), '#4a2a18', 1),
    ol(blob([[0, -s * 0.2], [s * 0.18, -s * 0.16], [s * 0.15, 0], [s * 0.24, s * 0.2], [0, s * 0.36], [-s * 0.24, s * 0.2], [-s * 0.15, 0], [-s * 0.18, -s * 0.16]], 0.9), col, 1.2),
    sh(circle(0, s * 0.02, s * 0.07), '#3a2416'), ol(rect(-s * 0.1, s * 0.18, s * 0.2, s * 0.04, 1), '#4a2a18', 0.6),
    stroke(line([[-s * 0.03, -s * 0.78], [-s * 0.03, s * 0.2]]) + line([[s * 0.01, -s * 0.78], [s * 0.01, s * 0.2]]) + line([[-s * 0.01, -s * 0.78], [-s * 0.01, s * 0.2]]) + line([[s * 0.03, -s * 0.78], [s * 0.03, s * 0.2]]), '#efe6d2', 0.6),
    sh(circle(-s * 0.1, -s * 0.76, s * 0.02) + circle(s * 0.1, -s * 0.76, s * 0.02) + circle(-s * 0.1, -s * 0.69, s * 0.02) + circle(s * 0.1, -s * 0.69, s * 0.02), '#c9ccd2'),
  ];
  return out;
}
/** Sitting owl, origin at feet. */
export function owl(s: number, col = '#8a6a4a'): Shape[] {
  return [
    ol(blob([[-s * 0.32, -s * 0.2], [-s * 0.3, -s * 0.66], [0, -s * 0.8], [s * 0.3, -s * 0.66], [s * 0.32, -s * 0.2], [0, 0]], 0.9), col, 1, -0.4),
    sh(poly([[-s * 0.28, -s * 0.72], [-s * 0.3, -s * 0.92], [-s * 0.12, -s * 0.76]]) + poly([[s * 0.28, -s * 0.72], [s * 0.3, -s * 0.92], [s * 0.12, -s * 0.76]]), col),
    sh(blob([[-s * 0.18, -s * 0.36], [0, -s * 0.44], [s * 0.18, -s * 0.36], [s * 0.14, -s * 0.08], [-s * 0.14, -s * 0.08]], 0.9), shade(col, 0.4)),
    stroke(M(-s * 0.1, -s * 0.28) + Q(-s * 0.05, -s * 0.24, 0, -s * 0.28) + Q(s * 0.05, -s * 0.24, s * 0.1, -s * 0.28) + M(-s * 0.08, -s * 0.18) + Q(-s * 0.04, -s * 0.14, 0, -s * 0.18) + Q(s * 0.04, -s * 0.14, s * 0.08, -s * 0.18), shade(col, -0.2), 1),
    sh(circle(-s * 0.13, -s * 0.58, s * 0.12) + circle(s * 0.13, -s * 0.58, s * 0.12), '#f6e8c8'), sh(circle(-s * 0.13, -s * 0.58, s * 0.065) + circle(s * 0.13, -s * 0.58, s * 0.065), '#f2b92e'),
    sh(circle(-s * 0.13, -s * 0.58, s * 0.035) + circle(s * 0.13, -s * 0.58, s * 0.035), '#1f1f24'), sh(poly([[-s * 0.04, -s * 0.5], [s * 0.04, -s * 0.5], [0, -s * 0.4]]), '#e2a03a'),
    sh(blob([[-s * 0.32, -s * 0.5], [-s * 0.2, -s * 0.4], [-s * 0.22, -s * 0.08], [-s * 0.34, -s * 0.18]], 0.9), shade(col, -0.2)), sh(blob([[s * 0.32, -s * 0.5], [s * 0.2, -s * 0.4], [s * 0.22, -s * 0.08], [s * 0.34, -s * 0.18]], 0.9), shade(col, -0.2)),
    stroke(line([[-s * 0.1, 0], [-s * 0.1, s * 0.06]]) + line([[s * 0.1, 0], [s * 0.1, s * 0.06]]), '#e2a03a', 2),
  ];
}
/** Lace-up hiking boot, toe pointing right, origin at sole centre. */
export function hikingBoot(s: number, col = '#8a5a35'): Shape[] {
  let laces = '';
  for (let i = 0; i < 4; i++) laces += line([[s * 0.0 + i * s * 0.03, -s * 0.66 + i * s * 0.12], [s * 0.16 + i * s * 0.03, -s * 0.62 + i * s * 0.12]]);
  return [
    shadow(0, 0, s * 0.5, s * 0.05),
    ol(M(-s * 0.3, -s * 0.8) + L(s * 0.06, -s * 0.8) + L(s * 0.12, -s * 0.36) + Q(s * 0.46, -s * 0.3, s * 0.5, -s * 0.1) + L(s * 0.5, -s * 0.04) + L(-s * 0.32, -s * 0.04) + 'Z', col, 1.2),
    ol(rect(-s * 0.34, -s * 0.1, s * 0.88, s * 0.1, 3), '#3a2a22', 1, 0.2), stroke(line([[-s * 0.3, -s * 0.02], [s * 0.5, -s * 0.02]]), '#5a4a3a', 1),
    sh(M(-s * 0.32, -s * 0.84) + L(s * 0.08, -s * 0.84) + L(s * 0.07, -s * 0.74) + L(-s * 0.31, -s * 0.74) + 'Z', '#c8322a'),
    sh(M(s * 0.2, -s * 0.33) + Q(s * 0.46, -s * 0.28, s * 0.5, -s * 0.1) + L(s * 0.22, -s * 0.1) + 'Z', shade(col, -0.2)),
    stroke(laces, '#f2c14e', 1.6), sh(circle(-s * 0.2, -s * 0.5, s * 0.03), shade(col, -0.35)),
  ];
}
/** Cast-iron skillet, handle to the right. */
export function fryingPan(s: number): Shape[] {
  const r = s * 0.32;
  return [
    shadow(0, r * 0.4, s * 0.5, r * 0.3), ol(rect(r * 0.9, -r * 0.12, s * 0.42, r * 0.24, 4), '#2a2a2e', 1, 0.3), sh(circle(s * 0.62, 0, r * 0.06), '#7a7a82'),
    ol(ellipse(0, 0, r * 1.06, r * 0.82), '#2f2f35', 1.2, 0.3), sh(ellipse(0, r * 0.02, r * 0.86, r * 0.64), '#45454d'),
    sh(ellipse(-r * 0.3, -r * 0.16, r * 0.24, r * 0.1, -20), '#ffffff', { opacity: 0.15 }),
    sh(ellipse(r * 0.18, r * 0.08, r * 0.22, r * 0.18), '#fbf3e0'), sh(circle(r * 0.18, r * 0.08, r * 0.08), '#f2b92e'),
  ];
}
/** Canoe paddle, blade at the bottom, origin at grip top. */
export function paddle(len: number, col = '#c98a4a', blade = '#d2452f'): Shape[] {
  return [
    ol(rect(-len * 0.06, 0, len * 0.12, len * 0.05, 3), shade(col, -0.1), 1), ol(rect(-len * 0.022, len * 0.04, len * 0.044, len * 0.6, 2), col, 1),
    ol(M(-len * 0.02, len * 0.6) + Q(-len * 0.12, len * 0.66, -len * 0.1, len * 0.9) + Q(0, len * 1.02, len * 0.1, len * 0.9) + Q(len * 0.12, len * 0.66, len * 0.02, len * 0.6) + 'Z', col, 1),
    sh(M(-len * 0.1, len * 0.84) + Q(0, len * 0.96, len * 0.1, len * 0.84) + L(len * 0.1, len * 0.9) + Q(0, len * 1.02, -len * 0.1, len * 0.9) + 'Z', blade),
  ];
}
/** Squirrel sitting up, facing right, origin at feet. */
export function squirrel(s: number, col = '#b8652e'): Shape[] {
  return [
    ol(M(-s * 0.1, -s * 0.06) + Q(-s * 0.6, -s * 0.1, -s * 0.5, -s * 0.6) + Q(-s * 0.44, -s * 0.96, -s * 0.12, -s * 0.9) + Q(-s * 0.3, -s * 0.7, -s * 0.26, -s * 0.46) + Q(-s * 0.22, -s * 0.2, -s * 0.02, -s * 0.2) + 'Z', shade(col, 0.1), 1),
    ol(blob([[-s * 0.12, -s * 0.04], [-s * 0.16, -s * 0.36], [0, -s * 0.56], [s * 0.16, -s * 0.4], [s * 0.14, -s * 0.04]], 0.9), col, 1),
    ol(blob([[0, -s * 0.52], [s * 0.12, -s * 0.68], [s * 0.3, -s * 0.62], [s * 0.26, -s * 0.48], [s * 0.06, -s * 0.44]], 0.9), col, 1),
    sh(poly([[s * 0.06, -s * 0.64], [s * 0.06, -s * 0.78], [s * 0.14, -s * 0.66]]), col), sh(circle(s * 0.18, -s * 0.6, s * 0.025), '#1f1f24'),
    sh(ellipse(s * 0.02, -s * 0.24, s * 0.07, s * 0.14), '#f2d8b0'), ol(circle(s * 0.16, -s * 0.36, s * 0.05), '#8a5a2a', 0.6),
  ];
}

/** Glass jar of fireflies with a cloth lid, origin at base. */
export function fireflyJar(h: number): Shape[] {
  const w = h * 0.62, g = rng(19);
  const out: Shape[] = [sh(circle(0, -h * 0.45, h * 0.8), '#f6f08a', { opacity: 0.14 }), shadow(0, 0, w * 0.6, h * 0.05), ol(rect(-w / 2, -h * 0.86, w, h * 0.86, w * 0.2), '#cfe6e0', 1, -0.4)];
  out.push(sh(rect(-w / 2 + 2, -h * 0.84, w - 4, h * 0.82, w * 0.18), '#4a6a5a', { opacity: 0.35 }));
  for (let i = 0; i < 7; i++) { const x = g.range(-w * 0.32, w * 0.32), y = g.range(-h * 0.74, -h * 0.12); out.push(sh(circle(x, y, h * 0.07), '#f6f08a', { opacity: 0.45 }), sh(circle(x, y, h * 0.03), '#fffbd0')); }
  out.push(sh(rect(-w * 0.4, -h * 0.8, w * 0.12, h * 0.66, 3), '#ffffff', { opacity: 0.3 }), ol(rect(-w * 0.44, -h, w * 0.88, h * 0.16, 3), '#d2452f', 1), sh(rect(-w * 0.44, -h * 0.9, w * 0.88, h * 0.04), '#f6dc9c'));
  return out;
}
/** Knitted bobble hat, origin at the brim centre. */
export function beanie(s: number, col = '#d2452f', stripe = '#fbf6ec'): Shape[] {
  let rib = '';
  for (let i = -4; i <= 4; i++) rib += line([[i * s * 0.1, -s * 0.02], [i * s * 0.1, -s * 0.18]]);
  return [
    shadow(0, s * 0.02, s * 0.5, s * 0.06), ol(M(-s * 0.44, -s * 0.16) + Q(-s * 0.46, -s * 0.7, 0, -s * 0.7) + Q(s * 0.46, -s * 0.7, s * 0.44, -s * 0.16) + 'Z', col, 1),
    sh(M(-s * 0.44, -s * 0.36) + L(s * 0.44, -s * 0.36) + L(s * 0.42, -s * 0.46) + L(-s * 0.42, -s * 0.46) + 'Z', stripe),
    ol(rect(-s * 0.48, -s * 0.2, s * 0.96, s * 0.2, 4), shade(col, -0.12), 1), stroke(rib, shade(col, -0.35), 1),
    ol(circle(0, -s * 0.74, s * 0.14), stripe, 1, -0.25),
  ];
}

// =====================================================================
// cruise things
// =====================================================================
export function cocktail(s: number, drink = '#f08a4b', brolly = '#e8799f'): Shape[] {
  const w = s * 0.56, h = s;
  return [
    shadow(0, 0, w * 0.5, h * 0.04), ol(ellipse(0, -h * 0.02, w * 0.36, h * 0.04), '#e8f0f0', 0.8, -0.2), sh(rect(-w * 0.04, -h * 0.4, w * 0.08, h * 0.38), '#e8f0f0', { opacity: 0.9 }),
    ol(poly([[-w / 2, -h * 0.86], [w / 2, -h * 0.86], [w * 0.1, -h * 0.4], [-w * 0.1, -h * 0.4]]), '#e8f4f6', 1, -0.3), sh(poly([[-w * 0.42, -h * 0.78], [w * 0.42, -h * 0.78], [w * 0.1, -h * 0.44], [-w * 0.1, -h * 0.44]]), drink),
    sh(poly([[-w * 0.42, -h * 0.78], [w * 0.42, -h * 0.78], [w * 0.3, -h * 0.66], [-w * 0.3, -h * 0.66]]), '#f6d23c', { opacity: 0.8 }),
    ol(circle(w * 0.42, -h * 0.86, w * 0.18), '#f6d23c', 0.8), sh(circle(w * 0.42, -h * 0.86, w * 0.1), '#fbf0a0'),
    stroke(line([[-w * 0.16, -h * 0.6], [-w * 0.34, -h * 1.12]]), '#8a5a35', 1.4), sh(M(-w * 0.62, -h * 1.0) + Q(-w * 0.4, -h * 1.34, -w * 0.06, -h * 1.12) + Q(-w * 0.34, -h * 1.1, -w * 0.62, -h * 1.0) + 'Z', brolly),
    sh(circle(w * 0.12, -h * 0.84, w * 0.08), '#c8322a'),
  ];
}
export function sunHat(s: number, col = '#efd9a0', band = '#2f6690'): Shape[] {
  let weave = '';
  for (let i = 1; i < 5; i++) weave += M(-s * 0.48 + i * 3, 0) + Q(0, s * (0.1 + i * 0.005), s * 0.48 - i * 3, 0);
  return [
    shadow(0, s * 0.08, s * 0.5, s * 0.1), ol(ellipse(0, 0, s / 2, s * 0.18), col, 1, -0.3), stroke(weave, shade(col, -0.2), 0.9, { opacity: 0.8 }),
    ol(M(-s * 0.24, -s * 0.02) + Q(-s * 0.26, -s * 0.34, 0, -s * 0.34) + Q(s * 0.26, -s * 0.34, s * 0.24, -s * 0.02) + 'Z', shade(col, 0.08), 1, -0.3),
    sh(M(-s * 0.24, -s * 0.02) + L(s * 0.24, -s * 0.02) + L(s * 0.245, -s * 0.12) + L(-s * 0.245, -s * 0.12) + 'Z', band),
    sh(petal(s * 0.18, -s * 0.07, s * 0.2, s * 0.06, -10) + petal(s * 0.18, -s * 0.07, s * 0.2, s * 0.06, 30), band),
  ];
}
function petal(x: number, y: number, len: number, wid: number, rotDeg: number): string {
  return xf(`M0 0Q${n(len * 0.3)} ${n(-wid * 1.6)} ${n(len)} 0Q${n(len * 0.3)} ${n(wid * 1.6)} 0 0Z`, { rot: rotDeg, x, y });
}
export function beachBall(r: number): Shape[] {
  const cols = ['#d2452f', '#fbf6ec', '#3f8fbf', '#fbf6ec', '#f6d23c', '#fbf6ec'];
  const out: Shape[] = [shadow(r * 0.1, r * 0.95, r * 0.9, r * 0.16)];
  for (let i = 0; i < 6; i++) out.push(sh(sector(0, 0, r, -90 + i * 60, -30 + i * 60), cols[i]));
  out.push(stroke(circle(0, 0, r), '#7a5a4a', 1), sh(circle(0, 0, r * 0.18), '#fbf6ec'), stroke(circle(0, 0, r * 0.18), '#7a5a4a', 0.8), sh(ellipse(-r * 0.4, -r * 0.42, r * 0.22, r * 0.12, -40), '#ffffff', { opacity: 0.45 }));
  return out;
}
/** A pair of flip-flops lying side by side. */
export function flipFlops(s: number, col = '#3f8fbf', strap = '#f6d23c'): Shape[] {
  const one = (x: number, flip: number): Shape[] => {
    const d = blob([[x, -s * 0.48], [x + flip * s * 0.12, -s * 0.36], [x + flip * s * 0.1, -s * 0.04], [x + flip * s * 0.14, s * 0.3], [x, s * 0.48], [x - flip * s * 0.12, s * 0.3], [x - flip * s * 0.1, -s * 0.06], [x - flip * s * 0.12, -s * 0.36]], 0.95);
    return [ol(d, col, 1, -0.35), sh(xf(d, { s: 0.86, ox: x, oy: 0 }), shade(col, 0.25)), stroke(M(x - s * 0.1, -s * 0.02) + Q(x, -s * 0.12, x, -s * 0.34) + Q(x, -s * 0.12, x + s * 0.1, -s * 0.02), strap, 3), sh(circle(x, -s * 0.34, s * 0.025), shade(strap, -0.3))];
  };
  return [shadow(0, s * 0.05, s * 0.36, s * 0.5, 0.15), ...one(-s * 0.15, -1), ...one(s * 0.15, 1)];
}
export function rubberDuck(s: number): Shape[] {
  return [
    ol(M(-s * 0.48, -s * 0.24) + Q(-s * 0.4, -s * 0.06, -s * 0.24, 0) + L(s * 0.3, 0) + Q(s * 0.48, -s * 0.1, s * 0.38, -s * 0.32) + Q(s * 0.1, -s * 0.36, -s * 0.24, -s * 0.3) + Q(-s * 0.36, -s * 0.3, -s * 0.48, -s * 0.24) + 'Z', '#f6d23c', 1, -0.35),
    ol(circle(s * 0.14, -s * 0.5, s * 0.2), '#f6d23c', 1, -0.35), sh(M(s * 0.3, -s * 0.52) + Q(s * 0.5, -s * 0.52, s * 0.5, -s * 0.44) + Q(s * 0.4, -s * 0.4, s * 0.3, -s * 0.44) + 'Z', '#f08a2b'),
    sh(circle(s * 0.2, -s * 0.56, s * 0.03), '#1f1f24'), sh(M(-s * 0.2, -s * 0.24) + Q(0, -s * 0.12, s * 0.16, -s * 0.24) + Q(0, -s * 0.2, -s * 0.2, -s * 0.24) + 'Z', '#e2b42e'),
    sh(ellipse(s * 0.06, -s * 0.6, s * 0.05, s * 0.03, -30), '#ffffff', { opacity: 0.6 }),
  ];
}
/** Sun cream bottle, origin at base. */
export function sunscreen(h: number, col = '#f08a2b'): Shape[] {
  const w = h * 0.46;
  return [
    shadow(0, 0, w * 0.6, h * 0.05), ol(M(-w * 0.4, -h * 0.78) + Q(-w * 0.56, -h * 0.4, -w / 2, 0) + L(w / 2, 0) + Q(w * 0.56, -h * 0.4, w * 0.4, -h * 0.78) + 'Z', '#fbf6ec', 1, -0.3),
    sh(M(-w * 0.52, -h * 0.5) + L(w * 0.52, -h * 0.5) + L(w * 0.5, -h * 0.12) + L(-w * 0.5, -h * 0.12) + 'Z', col), sh(circle(0, -h * 0.31, w * 0.18), '#f6d23c'),
    ol(rect(-w * 0.32, -h, w * 0.64, h * 0.24, 3), col, 1), sh(rect(-w * 0.36, -h * 0.72, w * 0.1, h * 0.6, 2), '#ffffff', { opacity: 0.35 }),
  ];
}
/** Dolphin leaping, facing right. */
export function dolphin(s: number, col = '#6f8fa8'): Shape[] {
  return [
    ol(M(-s * 0.5, s * 0.1) + Q(-s * 0.2, -s * 0.34, s * 0.3, -s * 0.18) + Q(s * 0.44, -s * 0.12, s * 0.5, -s * 0.04) + L(s * 0.36, -s * 0.02) + Q(s * 0.1, s * 0.0, -s * 0.36, s * 0.16) + 'Z', col, 1, -0.3),
    sh(M(-s * 0.36, s * 0.16) + Q(s * 0.1, 0, s * 0.36, -s * 0.02) + Q(s * 0.1, s * 0.04, -s * 0.3, s * 0.2) + 'Z', '#dfe8ee'),
    sh(poly([[-s * 0.04, -s * 0.2], [-s * 0.14, -s * 0.38], [s * 0.08, -s * 0.22]]), col), sh(poly([[-s * 0.46, s * 0.1], [-s * 0.62, s * 0.0], [-s * 0.56, s * 0.2]]) + poly([[-s * 0.46, s * 0.12], [-s * 0.6, s * 0.28], [-s * 0.42, s * 0.2]]), col),
    sh(poly([[s * 0.08, -s * 0.06], [s * 0.0, s * 0.12], [s * 0.14, s * 0.0]]), shade(col, -0.2)), sh(circle(s * 0.3, -s * 0.12, s * 0.02), '#1f1f24'),
  ];
}
/** Shuffleboard cue: long pole with forked head at bottom-right; origin at handle end. */
export function shuffleCue(len: number, col = '#c98a4a'): Shape[] {
  const ex = len * 0.8, ey = len * 0.6;
  return [
    stroke(line([[0, 0], [ex, ey]]), shade(col, -0.35), 6), stroke(line([[0, 0], [ex, ey]]), col, 4),
    sh(xf(M(-len * 0.1, -len * 0.02) + L(len * 0.1, -len * 0.02) + L(len * 0.1, len * 0.06) + Q(len * 0.06, len * 0.06, len * 0.05, len * 0.02) + L(-len * 0.05, len * 0.02) + Q(-len * 0.06, len * 0.06, -len * 0.1, len * 0.06) + 'Z', { rot: -53, x: ex, y: ey }), '#c9ccd2', { stroke: '#7a7a82', strokeWidth: 1 }),
    sh(xf(rect(-len * 0.03, -len * 0.06, len * 0.06, len * 0.1, 2), { rot: -53, x: len * 0.04, y: len * 0.03 }), '#2a2a2e'),
  ];
}
export function pineapple(s: number): Shape[] {
  const w = s * 0.5, h = s * 0.62;
  let crosses = '';
  for (let i = -3; i <= 3; i++) crosses += line([[-w / 2 + (i + 3) * w * 0.08 - w * 0.2, -h * 0.1], [-w / 2 + (i + 3) * w * 0.08 + w * 0.4, -h * 0.92]]) + line([[w / 2 - (i + 3) * w * 0.08 + w * 0.2, -h * 0.1], [w / 2 - (i + 3) * w * 0.08 - w * 0.4, -h * 0.92]]);
  const out: Shape[] = [shadow(0, 0, w * 0.6, s * 0.05)];
  for (let i = 0; i < 7; i++) { const a = -150 + i * 20; out.push(sh(leaf(0, -h * 0.94, s * (0.28 + (i === 3 ? 0.12 : Math.abs(3 - i) < 2 ? 0.06 : 0)), s * 0.05, a), i % 2 ? '#4f8a3f' : '#3f7a3a')); }
  out.push(ol(ellipse(0, -h * 0.5, w / 2, h / 2), '#e8a83a', 1, -0.35), stroke(crosses, '#b8782a', 1), sh(ellipse(-w * 0.2, -h * 0.6, w * 0.08, h * 0.2, 10), '#ffffff', { opacity: 0.2 }));
  return out;
}
/** Brass ship's bell on a bracket, origin at top of bracket. */
export function shipBell(s: number): Shape[] {
  return [
    ol(rect(-s * 0.36, -s * 0.06, s * 0.72, s * 0.1, 2), '#3a3a40', 1, 0.3), ol(rect(-s * 0.06, s * 0.02, s * 0.12, s * 0.12, 2), GOLD_D, 1),
    ol(M(-s * 0.18, s * 0.14) + Q(-s * 0.22, s * 0.5, -s * 0.38, s * 0.74) + L(s * 0.38, s * 0.74) + Q(s * 0.22, s * 0.5, s * 0.18, s * 0.14) + Q(0, s * 0.08, -s * 0.18, s * 0.14) + 'Z', GOLD, 1.2, -0.4),
    ol(rect(-s * 0.42, s * 0.7, s * 0.84, s * 0.08, 3), shade(GOLD, -0.1), 1, -0.4), sh(ellipse(-s * 0.1, s * 0.4, s * 0.05, s * 0.2, 8), '#fff3c4', { opacity: 0.6 }),
    sh(circle(0, s * 0.84, s * 0.06), GOLD_D), stroke(curve([[0, s * 0.86], [s * 0.04, s * 1.0], [-s * 0.02, s * 1.12]]), '#efe2c2', 3),
  ];
}

// =====================================================================
// scenery
// =====================================================================
/** Background figure (no face detail), origin at feet. */
export function figure(h: number, coat: string, seed: number): Shape[] {
  const g = rng(seed), skin = g.pick(['#e8b994', '#c98e64', '#8a5a3a', '#f2cfae']), hair = g.pick(['#3a2a22', '#6b4a2f', '#1f1f24', '#9a8a7a']);
  const legs = g.pick(['#3a3a42', '#2f4a6a', '#6b5a4a', '#e8dcc0']);
  const out: Shape[] = [shadow(0, 0, h * 0.14, h * 0.025, 0.2), sh(rect(-h * 0.07, -h * 0.46, h * 0.06, h * 0.46) + rect(h * 0.01, -h * 0.46, h * 0.06, h * 0.46), legs)];
  out.push(sh(M(-h * 0.13, -h * 0.4) + L(-h * 0.11, -h * 0.78) + Q(0, -h * 0.84, h * 0.11, -h * 0.78) + L(h * 0.13, -h * 0.4) + 'Z', coat), sh(rect(-h * 0.03, -h * 0.84, h * 0.06, h * 0.06), skin), sh(circle(0, -h * 0.9, h * 0.075), skin), sh(sector(0, -h * 0.91, h * 0.08, 180, 360), hair));
  out.push(sh(rect(-h * 0.155, -h * 0.76, h * 0.04, h * 0.32, 2) + rect(h * 0.115, -h * 0.76, h * 0.04, h * 0.32, 2), shade(coat, -0.1)));
  if (g.next() < 0.4) out.push(sh(ellipse(0, -h * 0.97, h * 0.11, h * 0.025) + rect(-h * 0.065, -h * 1.03, h * 0.13, h * 0.06, 2), g.pick(['#2a2a2e', '#6b4a2f', '#8c2b2b', '#efd9a0'])));
  return out;
}
/** Wheeled cabin case with telescopic handle, origin at bottom centre. */
export function rollerCase(w: number, h: number, col: string, seed = 1): Shape[] {
  const g = rng(seed);
  const out: Shape[] = [shadow(w * 0.04, 0, w * 0.56, Math.max(4, h * 0.06))];
  if (g.next() < 0.7) out.push(stroke(line([[-w * 0.2, -h], [-w * 0.2, -h * 1.45]]) + line([[w * 0.2, -h], [w * 0.2, -h * 1.45]]), '#8a8e96', 3), ol(rect(-w * 0.26, -h * 1.5, w * 0.52, h * 0.08, 3), '#3a3a40', 1, 0.3));
  out.push(ol(rect(-w / 2, -h, w, h - 6, Math.min(10, w * 0.14)), col, 1.2, -0.4));
  let ribs = '';
  for (let i = 1; i < 4; i++) ribs += line([[-w / 2 + (w * i) / 4, -h + 6], [-w / 2 + (w * i) / 4, -12]]);
  out.push(stroke(ribs, shade(col, -0.2), 2), sh(rect(-w / 2 + 3, -h + 3, w * 0.2, h - 14, 6), '#ffffff', { opacity: 0.18 }), sh(circle(-w * 0.34, -3, 5) + circle(w * 0.34, -3, 5), '#2a2a2e'));
  if (g.next() < 0.6) { const c = g.pick(['#f2c14e', '#d2452f', '#7fb069', '#fbf6e8']); out.push(stroke(line([[w * 0.1, -h * 0.86], [w * 0.16, -h * 0.66]]), c, 1.4), ol(rect(w * 0.08, -h * 0.68, w * 0.18, h * 0.2, 2), c, 0.8)); }
  return out;
}
/** Hard-sided suitcase standing on its base at origin (bottom centre). */
export function suitcase(w: number, h: number, col: string, seed = 1, trim = '#6b4a2f'): Shape[] {
  const g = rng(seed);
  const out: Shape[] = [shadow(w * 0.04, 0, w * 0.54, Math.max(4, h * 0.08), 0.22), stroke(rect(-w * 0.14, -h - h * 0.12, w * 0.28, h * 0.16, 4), shade(trim, -0.2), 3.4)];
  out.push(ol(rect(-w / 2, -h, w, h, Math.min(8, h * 0.12)), col, 1.2, -0.4), sh(rect(-w / 2 + 3, -h + 3, w - 6, h * 0.16, 4), shade(col, 0.16)), sh(rect(w * 0.32, -h + 2, w * 0.16, h - 4, 4), shade(col, -0.14)));
  for (const t of [-0.28, 0.24]) out.push(sh(rect(w * t - 4, -h, 8, h), trim), sh(rect(w * t - 5, -h * 0.56, 10, h * 0.12, 1), GOLD));
  const cols = ['#f6dc9c', '#d2452f', '#3f8fa3', '#fbf6e8', '#7fb069', '#f08a4b'];
  for (let i = 0; i < 2; i++) {
    const sx = g.range(-w * 0.2, w * 0.2), sy = g.range(-h * 0.8, -h * 0.25), r = Math.min(w, h) * g.range(0.08, 0.12);
    out.push(ol(circle(sx, sy, r), g.pick(cols), 0.8, -0.3), sh(circle(sx, sy, r * 0.55), g.pick(cols), { opacity: 0.85 }));
  }
  return out;
}
export function backpack(s: number, col: string): Shape[] {
  const w = s * 0.7, h = s;
  return [
    shadow(0, 0, w * 0.6, h * 0.05), stroke(M(-w * 0.2, -h * 0.9) + Q(0, -h * 1.1, w * 0.2, -h * 0.9), shade(col, -0.3), 4),
    ol(M(-w / 2, -h * 0.6) + Q(-w / 2, -h * 0.98, 0, -h * 0.98) + Q(w / 2, -h * 0.98, w / 2, -h * 0.6) + L(w / 2, -h * 0.04) + Q(w / 2, 0, w * 0.4, 0) + L(-w * 0.4, 0) + Q(-w / 2, 0, -w / 2, -h * 0.04) + 'Z', col, 1.2),
    ol(M(-w * 0.48, -h * 0.66) + Q(0, -h * 0.5, w * 0.48, -h * 0.66) + L(w * 0.48, -h * 0.74) + Q(0, -h * 1.02, -w * 0.48, -h * 0.74) + 'Z', shade(col, -0.12), 1),
    ol(rect(-w * 0.32, -h * 0.4, w * 0.64, h * 0.32, 6), shade(col, 0.12), 1), stroke(line([[-w * 0.3, -h * 0.34], [w * 0.3, -h * 0.34]]), shade(col, -0.4), 1),
    sh(rect(-w * 0.05, -h * 0.66, w * 0.1, h * 0.08, 2) + rect(-w * 0.04, -h * 0.38, w * 0.08, h * 0.06, 2), '#2a2a2e'),
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
/** Layered pine tree, origin at the base of the trunk. */
export function pineTree(h: number, col: string, seed = 1): Shape[] {
  const g = rng(seed), w = h * 0.42, out: Shape[] = [sh(rect(-h * 0.025, -h * 0.14, h * 0.05, h * 0.14), '#4a3222')];
  const tiers = 5;
  for (let i = 0; i < tiers; i++) {
    const t = i / tiers, y0 = -h * (0.1 + t * 0.78), tw = w * (1 - t * 0.78), th = h * 0.3;
    const jag = g.range(0.04, 0.1) * tw;
    const d = M(-tw / 2, y0) + Q(-tw * 0.25, y0 - jag, 0, y0 + jag * 0.4) + Q(tw * 0.25, y0 - jag, tw / 2, y0) + L(0, y0 - th) + 'Z';
    out.push(sh(d, shade(col, -0.05 + t * 0.12)), sh(M(0, y0 - th) + L(tw / 2, y0) + Q(tw * 0.25, y0 - jag, 0, y0 + jag * 0.4) + 'Z', shade(col, -0.2 + t * 0.08)));
  }
  return out;
}
/** Folding camp chair seen from the front, origin at feet centre. */
export function campChair(w: number, col: string, frame = '#3a3a40'): Shape[] {
  const h = w * 1.1;
  return [
    shadow(0, 0, w * 0.6, w * 0.07), stroke(line([[-w * 0.44, 0], [w * 0.36, -h * 0.5]]) + line([[w * 0.44, 0], [-w * 0.36, -h * 0.5]]), frame, 3),
    stroke(line([[-w * 0.42, -h * 0.4], [-w * 0.42, -h]]) + line([[w * 0.42, -h * 0.4], [w * 0.42, -h]]), frame, 3),
    ol(M(-w * 0.42, -h * 0.98) + L(w * 0.42, -h * 0.98) + L(w * 0.42, -h * 0.5) + Q(0, -h * 0.44, -w * 0.42, -h * 0.5) + 'Z', col, 1),
    sh(rect(-w * 0.42, -h * 0.82, w * 0.84, h * 0.1), shade(col, -0.2)),
    ol(M(-w * 0.46, -h * 0.5) + Q(0, -h * 0.42, w * 0.46, -h * 0.5) + L(w * 0.42, -h * 0.4) + Q(0, -h * 0.32, -w * 0.42, -h * 0.4) + 'Z', shade(col, -0.12), 1),
    ol(rect(-w * 0.56, -h * 0.62, w * 0.16, h * 0.05, 2) + rect(w * 0.4, -h * 0.62, w * 0.16, h * 0.05, 2), shade(col, -0.25), 1),
    sh(circle(w * 0.5, -h * 0.56, w * 0.07), shade(frame, 0.2)),
  ];
}
/** Simple cloud puff. */
export function cloud(w: number, col = '#ffffff', o = 0.9): Shape[] {
  return [sh(blob([[-w / 2, 0], [-w * 0.36, -w * 0.14], [-w * 0.14, -w * 0.2], [0, -w * 0.32], [w * 0.2, -w * 0.24], [w * 0.36, -w * 0.12], [w / 2, 0], [w * 0.1, w * 0.04]], 0.9), col, { opacity: o })];
}
/** Seagull in flight. */
export function gull(s: number, col = '#4a4a52'): Shape[] {
  return [stroke(M(-s / 2, 0) + Q(-s * 0.25, -s * 0.3, 0, 0) + Q(s * 0.25, -s * 0.3, s / 2, 0), col, Math.max(1.4, s * 0.06))];
}
/** Sun lounger seen from the side, back raised on the left; origin at feet centre. */
export function lounger(w: number, col: string, frame = '#f4efe4'): Shape[] {
  const h = w * 0.18;
  return [
    shadow(w * 0.04, 0, w * 0.54, w * 0.04), stroke(line([[-w * 0.36, 0], [-w * 0.36, -h]]) + line([[w * 0.4, 0], [w * 0.4, -h]]), shade(frame, -0.35), 4),
    ol(poly([[-w * 0.2, -h], [w * 0.48, -h], [w * 0.48, -h - w * 0.05], [-w * 0.2, -h - w * 0.05]]), frame, 1, -0.3),
    ol(poly([[-w * 0.2, -h], [-w * 0.2, -h - w * 0.05], [-w * 0.5, -h - w * 0.34], [-w * 0.52, -h - w * 0.29]]), frame, 1, -0.3),
    ol(poly([[-w * 0.18, -h - w * 0.05], [w * 0.46, -h - w * 0.05], [w * 0.46, -h - w * 0.09], [-w * 0.18, -h - w * 0.09]]), col, 0.8),
    ol(poly([[-w * 0.2, -h - w * 0.07], [-w * 0.48, -h - w * 0.35], [-w * 0.45, -h - w * 0.38], [-w * 0.17, -h - w * 0.1]]), col, 0.8),
  ];
}
/** Life ring, origin at centre. */
export function lifebuoy(r: number, col = '#d2452f'): Shape[] {
  const out: Shape[] = [];
  for (let i = 0; i < 4; i++) out.push(sh(sector(0, 0, r, i * 90 - 22, i * 90 + 22, r * 0.56), col), sh(sector(0, 0, r, i * 90 + 22, i * 90 + 68, r * 0.56), '#fbf6ec'));
  out.push(stroke(circle(0, 0, r) + circle(0, 0, r * 0.56), '#8a8478', 1));
  let rope = '';
  for (let i = 0; i < 4; i++) rope += M(Math.cos((i * 90 + 45) * Math.PI / 180) * r * 0.78, Math.sin((i * 90 + 45) * Math.PI / 180) * r * 0.78);
  out.push(stroke(circle(0, 0, r * 0.98), '#efe2c2', 1.4));
  void rope;
  return out;
}
/** Market parasol, origin at pole foot. */
export function parasol(w: number, a: string, b: string, h = w * 0.9): Shape[] {
  const out: Shape[] = [stroke(line([[0, 0], [0, -h]]), '#efe6d2', 4), stroke(line([[0, 0], [0, -h]]), '#9a907e', 1)];
  const segs = 6, cy = -h, dh = w * 0.18;
  for (let i = 0; i < segs; i++) {
    const x0 = -w / 2 + (w * i) / segs, x1 = x0 + w / segs;
    out.push(sh(M(0, cy - dh) + L(x0, cy + dh * 0.2) + Q((x0 + x1) / 2, cy + dh * 0.55, x1, cy + dh * 0.2) + 'Z', i % 2 ? a : b, { stroke: shade(a, -0.3), strokeWidth: 0.6 }));
  }
  out.push(sh(circle(0, cy - dh - 3, 4), '#efe6d2'));
  return out;
}
export { place, shade, mix, rng, xf, sh, stroke, rect, ellipse, circle, poly, line, curve, blob, leaf, star, sector };
