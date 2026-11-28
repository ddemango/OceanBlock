import { rect, ellipse, circle, poly, line, curve, blob, leaf, star, sector, sh, stroke, place, mix, shade, rng, xf, linearGradient, type Rng } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { FindActivity, FindItem } from '../types';
import { M, L, Q, boat, win, bougainvillea, treeClump, cloud, gull, bars, slats, type Pt } from './props';

const ID = 'coastal-find';
const W = 1200, H = 1500;
const items: FindItem[] = [];
const scene = (...s: (Shape | Shape[])[]) => { items.push({ shapes: s.flat() }); };
const target = (id: string, name: string, shapes: Shape[]) => { items.push({ id, name, target: true, shapes }); };
const ol = (d: string, fill: string, w = 1, amt = -0.3): Shape => sh(d, fill, { stroke: shade(fill, amt), strokeWidth: w });

const defs =
  linearGradient(`${ID}-sky`, [[0, '#8fc3e6'], [0.6, '#c9e4ef'], [1, '#fbf0d6']]) +
  linearGradient(`${ID}-sea`, [[0, '#8fd0d2'], [0.4, '#4aa3b8'], [1, '#2c7a9a']]) +
  linearGradient(`${ID}-shade`, [[0, '#b98862'], [1, '#d3a57c']]) +
  linearGradient(`${ID}-ground`, [[0, '#c4ae8c'], [1, '#a8916f']]);

// =====================================================================
// props
// =====================================================================
function crateFront(w: number, h: number, col: string): Shape[] {
  const x0 = -w / 2;
  return [
    sh(rect(x0, 0, w, h), col), sh(rect(x0, 0, w, h * 0.12), shade(col, 0.22)),
    stroke(slats(x0, 0, w, h, 2), shade(col, -0.32), 1.6),
    sh(rect(x0, 0, w * 0.06, h), shade(col, -0.16)), sh(rect(-x0 - w * 0.06, 0, w * 0.06, h), shade(col, -0.24)),
    sh(circle(x0 + w * 0.03, h * 0.17, 1.4) + circle(x0 + w * 0.03, h * 0.5, 1.4) + circle(x0 + w * 0.03, h * 0.83, 1.4) + circle(-x0 - w * 0.03, h * 0.17, 1.4) + circle(-x0 - w * 0.03, h * 0.5, 1.4) + circle(-x0 - w * 0.03, h * 0.83, 1.4), shade(col, -0.5)),
  ];
}
type Kind = 'lemon' | 'orange' | 'tomato' | 'peach' | 'aubergine' | 'pepper' | 'melon' | 'plum';
function fruit(x: number, y: number, r: number, kind: Kind, g: Rng): Shape[] {
  const rot = g.range(-35, 35);
  switch (kind) {
    case 'lemon': {
      const c = g.pick(['#f6d23c', '#f3c92f', '#f9dc55']);
      return [ol(ellipse(x, y, r * 1.2, r * 0.86, rot), c, 1, -0.26), sh(ellipse(x - r * 0.35, y - r * 0.3, r * 0.4, r * 0.2, rot - 10), '#fff3a6', { opacity: 0.85 }), sh(xf(ellipse(x + r * 1.16, y, r * 0.12, r * 0.14), { rot, ox: x, oy: y }), '#c9a52c')];
    }
    case 'orange': {
      const c = g.pick(['#f08a2b', '#ee7d22', '#f39a3a']);
      return [ol(circle(x, y, r), c, 1, -0.26), sh(ellipse(x - r * 0.35, y - r * 0.38, r * 0.34, r * 0.2, -30), '#ffd08a', { opacity: 0.85 }), sh(circle(x + r * 0.2, y + r * 0.1, r * 0.09), '#b85a14')];
    }
    case 'tomato': {
      const c = g.pick(['#d83a2e', '#c8322a', '#e04a34']);
      return [ol(circle(x, y, r), c, 1, -0.28), sh(ellipse(x - r * 0.36, y - r * 0.36, r * 0.3, r * 0.18, -30), '#ff9c85', { opacity: 0.85 }), sh(star(x + r * 0.1, y - r * 0.5, r * 0.42, r * 0.14, 5, rot), '#4f7a3f')];
    }
    case 'peach': {
      const c = g.pick(['#f6a878', '#f3b184', '#f09a70']);
      return [ol(circle(x, y, r), c, 1, -0.22), sh(sector(x, y, r * 0.96, 20 + rot, 170 + rot), '#e7735c', { opacity: 0.6 }), stroke(curve([[x - r * 0.1, y - r * 0.9], [x + r * 0.15, y - r * 0.2], [x, y + r * 0.5]]), '#c9634a', 1), sh(ellipse(x - r * 0.4, y - r * 0.4, r * 0.26, r * 0.16, -30), '#ffe0c4', { opacity: 0.85 })];
    }
    case 'aubergine': {
      const c = g.pick(['#5b2f6b', '#6a3a7c', '#4f2860']);
      const a = rot * 2 + 70;
      return [ol(xf(blob([[0, -r * 1.5], [r * 0.6, -r * 0.7], [r * 0.85, r * 0.6], [0, r * 1.4], [-r * 0.85, r * 0.6], [-r * 0.6, -r * 0.7]]), { rot: a, x, y }), c, 1, -0.3), sh(xf(ellipse(-r * 0.35, r * 0.2, r * 0.18, r * 0.6), { rot: a, x, y }), '#a880b8', { opacity: 0.7 }), sh(xf(star(0, -r * 1.35, r * 0.6, r * 0.25, 5), { rot: a, x, y }), '#5c8a45')];
    }
    case 'pepper': {
      const c = g.pick(['#d8362c', '#f2b92e', '#5c9a45', '#e8752a']);
      return [ol(xf(blob([[-r * 0.8, -r * 0.8], [0, -r * 0.6], [r * 0.8, -r * 0.8], [r * 0.9, r * 0.2], [r * 0.4, r * 1.1], [-r * 0.4, r * 1.1], [-r * 0.9, r * 0.2]], 0.9), { rot, x, y }), c, 1, -0.28), sh(xf(ellipse(-r * 0.4, -r * 0.1, r * 0.16, r * 0.5), { rot, x, y }), '#ffffff', { opacity: 0.4 }), sh(xf(rect(-r * 0.14, -r * 1.15, r * 0.28, r * 0.5, 2), { rot, x, y }), '#3f6b34')];
    }
    case 'melon': {
      const c = '#7fa650';
      return [ol(circle(x, y, r), c, 1, -0.3), stroke(curve([[x - r * 0.5, y - r * 0.8], [x - r * 0.7, y], [x - r * 0.5, y + r * 0.8]]) + curve([[x, y - r], [x - r * 0.1, y], [x, y + r]]) + curve([[x + r * 0.5, y - r * 0.8], [x + r * 0.62, y], [x + r * 0.5, y + r * 0.8]]), '#4f7a3a', 2.2), sh(ellipse(x - r * 0.4, y - r * 0.45, r * 0.24, r * 0.14, -30), '#d6e8a8', { opacity: 0.8 })];
    }
    default: {
      const c = g.pick(['#6b3f86', '#7a4a96', '#59347a']);
      return [ol(circle(x, y, r), c, 1, -0.3), sh(ellipse(x - r * 0.35, y - r * 0.38, r * 0.3, r * 0.18, -30), '#c9a8dc', { opacity: 0.8 })];
    }
  }
}
/** Heap of produce sitting on a line of width w; origin at centre of that line. */
function pile(w: number, r: number, kind: Kind, seed: number, rows = 3): Shape[] {
  const g = rng(seed), out: Shape[] = [];
  for (let row = rows - 1; row >= 0; row--) {
    const span = w - r * 1.2 - row * r * 1.5, n = Math.max(1, Math.round(span / (r * 1.85)));
    for (let i = 0; i < n; i++) {
      const x = n === 1 ? 0 : -span / 2 + (span * i) / (n - 1);
      out.push(...fruit(x + g.range(-r * 0.15, r * 0.15), -r * 0.45 - row * r * 1.25 + g.range(-r * 0.12, r * 0.12), r * g.range(0.92, 1.06), kind, g));
    }
  }
  return out;
}
function basket(w: number, h: number, col = '#c99a5b'): Shape[] {
  const body = poly([[-w / 2, 0], [w / 2, 0], [w * 0.4, h], [-w * 0.4, h]]);
  let weave = '', weave2 = '';
  for (let i = 1; i < 6; i++) { const y = (h * i) / 6, hw = w / 2 - (w * 0.1 * i) / 6; weave += line([[-hw, y], [hw, y]]); }
  for (let i = 0; i <= 12; i++) { const t = i / 12; weave2 += line([[-w / 2 + w * t, 0], [-w * 0.4 + w * 0.8 * t, h]]); }
  return [
    sh(ellipse(0, h, w * 0.46, h * 0.1), '#3b2a1c', { opacity: 0.25 }), sh(body, col), sh(poly([[w * 0.18, 0], [w / 2, 0], [w * 0.4, h], [w * 0.16, h]]), shade(col, -0.16)),
    stroke(weave2, shade(col, -0.3), 1.4), stroke(weave, shade(col, 0.25), 2.4, { opacity: 0.8 }),
    sh(rect(-w / 2 - 4, -5, w + 8, 12, 6), shade(col, 0.12)), stroke(slats(-w / 2 - 2, -5, 0, 0, 0) + line([[-w / 2 - 2, 1], [w / 2 + 2, 1]]), shade(col, -0.3), 1.2),
  ];
}
function barrel(w: number, h: number): Shape[] {
  const c = '#a8744a';
  const body = M(-w * 0.42, 0) + Q(-w * 0.56, -h / 2, -w * 0.42, -h) + L(w * 0.42, -h) + Q(w * 0.56, -h / 2, w * 0.42, 0) + 'Z';
  let st = '';
  for (let i = 1; i < 7; i++) { const t = i / 7 - 0.5; st += M(w * 0.84 * t, 0) + Q(w * 1.12 * t, -h / 2, w * 0.84 * t, -h); }
  const hoop = (y: number, bulge: number) => M(-w * bulge, y - 5) + Q(0, y + 3, w * bulge, y - 5) + L(w * bulge, y + 5) + Q(0, y + 13, -w * bulge, y + 5) + 'Z';
  return [
    sh(ellipse(w * 0.1, 2, w * 0.56, h * 0.08), '#3b2a1c', { opacity: 0.28 }), sh(body, c), sh(M(w * 0.16, 0) + Q(w * 0.2, -h / 2, w * 0.16, -h) + L(w * 0.42, -h) + Q(w * 0.56, -h / 2, w * 0.42, 0) + 'Z', shade(c, -0.2)),
    sh(M(-w * 0.42, 0) + Q(-w * 0.56, -h / 2, -w * 0.42, -h) + L(-w * 0.26, -h) + Q(-w * 0.36, -h / 2, -w * 0.26, 0) + 'Z', shade(c, 0.2)),
    stroke(st, shade(c, -0.38), 1.2), sh(hoop(-h * 0.2, 0.495), '#4a4e52'), sh(hoop(-h * 0.8, 0.495), '#4a4e52'), sh(hoop(-h * 0.5, 0.53), '#5b6064'),
    sh(ellipse(0, -h, w * 0.42, h * 0.1), '#c99a6a'), stroke(ellipse(0, -h, w * 0.42, h * 0.1), '#6b4a2f', 2), stroke(ellipse(0, -h, w * 0.33, h * 0.075) + line([[-w * 0.3, -h], [w * 0.3, -h]]) + line([[-w * 0.2, -h - h * 0.055], [w * 0.2, -h - h * 0.055]]) + line([[-w * 0.2, -h + h * 0.055], [w * 0.2, -h + h * 0.055]]), '#8a6238', 1),
  ];
}
function sack(w: number, h: number, col = '#c9a878'): Shape[] {
  const body = blob([[-w * 0.46, 0], [-w * 0.52, -h * 0.4], [-w * 0.38, -h * 0.82], [-w * 0.14, -h * 0.9], [0, -h * 0.86], [w * 0.16, -h * 0.9], [w * 0.4, -h * 0.82], [w * 0.52, -h * 0.4], [w * 0.46, 0]], 0.8);
  let tex = '';
  for (let i = 1; i < 7; i++) tex += curve([[-w * 0.46, -h * 0.12 * i], [0, -h * 0.12 * i + 5], [w * 0.46, -h * 0.12 * i]]);
  return [
    sh(ellipse(w * 0.06, 0, w * 0.56, h * 0.07), '#3b2a1c', { opacity: 0.25 }), sh(body, col), sh(blob([[w * 0.14, -4], [w * 0.2, -h * 0.5], [w * 0.16, -h * 0.84], [w * 0.4, -h * 0.8], [w * 0.5, -h * 0.4], [w * 0.44, -4]], 0.8), shade(col, -0.14)),
    stroke(tex, shade(col, -0.2), 0.9, { opacity: 0.8 }),
    sh(blob([[-w * 0.2, -h * 0.86], [-w * 0.28, -h * 1.02], [0, -h * 0.96], [w * 0.28, -h * 1.04], [w * 0.2, -h * 0.86], [0, -h * 0.82]], 0.8), shade(col, 0.1)), stroke(line([[-w * 0.2, -h * 0.87], [w * 0.2, -h * 0.87]]), '#7a5a35', 3),
  ];
}
function buoy(r: number, col: string, stripe = '#f7f2e4'): Shape[] {
  return [
    sh(ellipse(r * 0.15, r * 0.95, r * 1.05, r * 0.22), '#3b2a1c', { opacity: 0.25 }), ol(circle(0, 0, r), col, 1.2), sh(sector(0, 0, r, 200, 340), shade(col, 0.22)),
    sh(M(-r * 0.98, -r * 0.18) + Q(0, r * 0.2, r * 0.98, -r * 0.18) + L(r * 0.98, r * 0.12) + Q(0, r * 0.5, -r * 0.98, r * 0.12) + 'Z', stripe),
    sh(rect(-r * 0.2, -r * 1.28, r * 0.4, r * 0.36, 2), '#39424a'), stroke(circle(0, -r * 1.42, r * 0.2), '#d9c7a0', 2.4), sh(ellipse(-r * 0.4, -r * 0.5, r * 0.2, r * 0.13, -30), '#ffffff', { opacity: 0.7 }),
  ];
}
function netPile(w: number, h: number, col: string, seed: number): Shape[] {
  const g = rng(seed);
  const body = blob([[-w / 2, 0], [-w * 0.46, -h * 0.5], [-w * 0.24, -h * 0.92], [w * 0.06, -h], [w * 0.34, -h * 0.74], [w * 0.5, -h * 0.3], [w / 2, 0]], 0.85);
  let m1 = '', m2 = '';
  for (let i = 0; i < 13; i++) { const t = i / 12 - 0.5; m1 += M(w * 0.86 * t, -2) + Q(w * 0.9 * t + w * 0.12, -h * 0.5, w * 0.5 * t + w * 0.04, -h * (0.96 - Math.abs(t) * 0.9)); }
  for (let i = 1; i < 7; i++) { const y = -h * i * 0.14, hw = w * 0.47 * Math.sqrt(Math.max(0.05, 1 - Math.pow((i * 0.14 - 0.1), 2))); m2 += M(-hw * 0.96, y) + Q(0, y + g.range(4, 12), hw * 0.9, y - 2); }
  const out = [sh(ellipse(w * 0.04, 2, w * 0.56, h * 0.09), '#3b2a1c', { opacity: 0.25 }), sh(body, col), sh(blob([[w * 0.08, -4], [w * 0.14, -h * 0.6], [w * 0.1, -h * 0.94], [w * 0.34, -h * 0.72], [w * 0.48, -h * 0.3], [w * 0.47, -4]], 0.85), shade(col, -0.16)), stroke(m1, shade(col, -0.36), 1.1), stroke(m2, shade(col, 0.3), 1.1, { opacity: 0.8 })];
  for (let i = 0; i < 7; i++) { const a = Math.PI * (0.12 + (i / 6) * 0.76), fx = -Math.cos(a) * w * 0.4, fy = -Math.sin(a) * h * 0.78 + g.range(-4, 8); out.push(ol(ellipse(fx, fy, 10, 6.5, g.range(-40, 40)), i % 2 ? '#f08a2b' : '#f6d23c', 1)); }
  return out;
}
function lobsterPot(w: number, h: number): Shape[] {
  const c = '#b98b5a';
  const arch = M(-w / 2, 0) + L(-w / 2, -h * 0.45) + Q(-w / 2, -h, 0, -h) + Q(w / 2, -h, w / 2, -h * 0.45) + L(w / 2, 0) + 'Z';
  let mesh = '', ribs = '';
  for (let i = 1; i < 9; i++) { const x = -w / 2 + (w * i) / 9; const top = -h * (0.45 + 0.55 * Math.sqrt(Math.max(0, 1 - Math.pow((x / (w / 2)), 2)))); mesh += line([[x, 0], [x, top + 2]]); }
  for (let i = 1; i < 4; i++) ribs += line([[-w / 2, -h * 0.22 * i], [w / 2, -h * 0.22 * i]]);
  return [
    sh(ellipse(w * 0.04, 2, w * 0.56, h * 0.1), '#3b2a1c', { opacity: 0.25 }), sh(arch, '#5a4a3a'), stroke(mesh, '#d9b98a', 1.3), stroke(ribs, '#d9b98a', 1.3),
    stroke(arch, c, 5), sh(rect(-w / 2 - 3, -6, w + 6, 8), shade(c, -0.15)), sh(circle(0, -h * 0.42, h * 0.2), '#2f2620'), stroke(circle(0, -h * 0.42, h * 0.2), '#e0c193', 3),
  ];
}
function bollard(s: number): Shape[] {
  return [
    sh(ellipse(s * 0.2, 0, s * 0.8, s * 0.16), '#3b2a1c', { opacity: 0.3 }), sh(rect(-s * 0.36, -s * 1.1, s * 0.72, s * 1.1, 4), '#3f474e'), sh(rect(-s * 0.36, -s * 1.1, s * 0.22, s * 1.1, 4), '#66717a'), sh(rect(s * 0.1, -s * 1.1, s * 0.26, s * 1.1, 4), '#2b3237'),
    sh(rect(-s * 0.56, -s * 1.38, s * 1.12, s * 0.38, s * 0.16), '#4a535a'), sh(rect(-s * 0.56, -s * 1.38, s * 1.12, s * 0.14, s * 0.07), '#7a858d'), sh(rect(-s * 0.46, -s * 0.12, s * 0.92, s * 0.14, 3), '#2b3237'),
  ];
}
function terracotta(s: number, plant: 'herb' | 'flower' | 'lemon', seed: number): Shape[] {
  const out: Shape[] = [sh(ellipse(s * 0.15, 0, s * 1.05, s * 0.2), '#3b2a1c', { opacity: 0.25 })];
  if (plant === 'flower') out.push(...place(bougainvillea(s * 3.2, s * 2.4, seed, seed % 2 ? '#d6336c' : '#e4572e'), { x: 0, y: -s * 2.5 }));
  else {
    out.push(...place(treeClump(s * 3.4, s * 3.2, seed, plant === 'herb' ? '#5c8f4f' : '#4f7a3f'), { x: 0, y: -s * 1.1 }));
    if (plant === 'lemon') { const g = rng(seed); for (let i = 0; i < 5; i++) out.push(ol(ellipse(g.range(-s * 1.1, s * 1.1), -s * g.range(2.2, 3.6), s * 0.36, s * 0.27, g.range(-30, 30)), '#f6d23c', 0.8)); }
  }
  out.push(sh(poly([[-s, -s * 1.5], [s, -s * 1.5], [s * 0.7, 0], [-s * 0.7, 0]]), '#c9673f'), sh(poly([[s * 0.2, -s * 1.5], [s, -s * 1.5], [s * 0.7, 0], [s * 0.2, 0]]), '#a84f2e'), sh(poly([[-s, -s * 1.5], [-s * 0.55, -s * 1.5], [-s * 0.42, 0], [-s * 0.7, 0]]), '#de8459'), sh(rect(-s * 1.14, -s * 1.78, s * 2.28, s * 0.36, 3), '#d98058'), sh(rect(-s * 1.14, -s * 1.78, s * 2.28, s * 0.12, 2), '#eaa07a'));
  return out;
}
function jar(w: number, h: number, col: string, lid: string): Shape[] {
  return [ol(rect(-w / 2, -h, w, h, w * 0.22), col, 1), sh(rect(-w / 2 + 2, -h + 3, w * 0.2, h - 6, 2), '#ffffff', { opacity: 0.35 }), sh(rect(-w * 0.34, -h * 0.62, w * 0.68, h * 0.36), '#fbf1dc'), stroke(line([[-w * 0.22, -h * 0.5], [w * 0.22, -h * 0.5]]) + line([[-w * 0.16, -h * 0.4], [w * 0.16, -h * 0.4]]), '#a89a80', 1), sh(rect(-w / 2 - 1, -h - 5, w + 2, 7, 2), lid)];
}
function standingGull(s: number): Shape[] {
  return [
    stroke(line([[-s * 0.05, 0], [-s * 0.05, -s * 0.3]]) + line([[s * 0.12, 0], [s * 0.12, -s * 0.3]]) + line([[-s * 0.05, 0], [s * 0.06, 0]]) + line([[s * 0.12, 0], [s * 0.23, 0]]), '#e39a2d', 2),
    sh(blob([[-s * 0.62, -s * 0.5], [-s * 0.2, -s * 0.72], [s * 0.3, -s * 0.66], [s * 0.42, -s * 0.4], [s * 0.1, -s * 0.26], [-s * 0.3, -s * 0.3]], 0.9), '#fbfaf4'),
    sh(blob([[-s * 0.7, -s * 0.5], [-s * 0.2, -s * 0.66], [s * 0.2, -s * 0.52], [-s * 0.1, -s * 0.4]], 0.9), '#9aa7b2'), sh(poly([[-s * 0.7, -s * 0.5], [-s * 0.9, -s * 0.52], [-s * 0.6, -s * 0.42]]), '#39424a'),
    sh(circle(s * 0.36, -s * 0.8, s * 0.17), '#fbfaf4'), sh(blob([[s * 0.2, -s * 0.7], [s * 0.4, -s * 0.62], [s * 0.42, -s * 0.4], [s * 0.22, -s * 0.5]], 0.8), '#fbfaf4'),
    sh(poly([[s * 0.5, -s * 0.84], [s * 0.78, -s * 0.76], [s * 0.5, -s * 0.72]]), '#f0a830'), sh(circle(s * 0.4, -s * 0.84, s * 0.03), '#27323a'),
  ];
}
function cat(s: number): Shape[] {
  const c = '#e39a52';
  let str = '';
  for (let i = 0; i < 5; i++) str += curve([[-s * 0.2 + i * s * 0.16, -s * 0.52], [-s * 0.16 + i * s * 0.16, -s * 0.4], [-s * 0.2 + i * s * 0.16, -s * 0.28]]);
  return [
    sh(ellipse(0, 0, s * 0.95, s * 0.12), '#3b2a1c', { opacity: 0.25 }),
    sh(blob([[-s * 0.85, -s * 0.05], [-s * 0.8, -s * 0.36], [-s * 0.4, -s * 0.58], [s * 0.2, -s * 0.6], [s * 0.66, -s * 0.42], [s * 0.8, -s * 0.1], [s * 0.5, 0], [-s * 0.5, 0]], 0.9), c),
    stroke(str, '#b86f2e', 3), sh(blob([[s * 0.5, -s * 0.02], [s * 0.86, -s * 0.06], [s * 0.9, -s * 0.2], [s * 0.6, -s * 0.12], [-s * 0.1, -s * 0.1], [-s * 0.14, 0]], 0.9), shade(c, -0.12)),
    sh(circle(-s * 0.58, -s * 0.24, s * 0.26), c), sh(poly([[-s * 0.82, -s * 0.36], [-s * 0.8, -s * 0.62], [-s * 0.62, -s * 0.46]]), c), sh(poly([[-s * 0.52, -s * 0.48], [-s * 0.38, -s * 0.66], [-s * 0.36, -s * 0.4]]), c),
    sh(poly([[-s * 0.78, -s * 0.42], [-s * 0.77, -s * 0.54], [-s * 0.68, -s * 0.46]]), '#f6c9b0'), sh(ellipse(-s * 0.62, -s * 0.14, s * 0.13, s * 0.09), '#fbead0'),
    stroke(curve([[-s * 0.74, -s * 0.26], [-s * 0.69, -s * 0.23], [-s * 0.64, -s * 0.26]]) + curve([[-s * 0.54, -s * 0.26], [-s * 0.49, -s * 0.23], [-s * 0.44, -s * 0.26]]), '#3b2a1c', 1.6), sh(poly([[-s * 0.64, -s * 0.17], [-s * 0.6, -s * 0.17], [-s * 0.62, -s * 0.14]]), '#d9736a'),
    stroke(line([[-s * 0.7, -s * 0.12], [-s * 0.94, -s * 0.16]]) + line([[-s * 0.7, -s * 0.1], [-s * 0.94, -s * 0.06]]) + line([[-s * 0.54, -s * 0.12], [-s * 0.3, -s * 0.16]]), '#fbf1dc', 0.9),
  ];
}
function bunting(a: Pt, b: Pt, sag: number, n: number, seed: number): Shape[] {
  const cols = ['#e4572e', '#f6d23c', '#3f8fa3', '#fbf6e8', '#3f7d6e', '#f08a4b', '#d6336c'];
  const out: Shape[] = [];
  const at = (t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t + Math.sin(Math.PI * t) * sag];
  const pts: Pt[] = []; for (let i = 0; i <= 20; i++) pts.push(at(i / 20));
  out.push(stroke(line(pts), '#6b5b4b', 1.4));
  for (let i = 0; i < n; i++) { const p = at((i + 0.2) / n), q = at((i + 0.8) / n); const mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, len = Math.hypot(q[0] - p[0], q[1] - p[1]); out.push(ol(poly([p, q, [mx + 1, my + len * 1.25]]), cols[(i + seed) % cols.length], 0.8, -0.2)); }
  return out;
}

// =====================================================================
// targets
// =====================================================================
function anchor(h: number): Shape[] {
  const c = '#3f4a52', l = '#74838d', w = h * 0.075;
  return [
    stroke(circle(0, -h * 0.92, h * 0.07), c, w * 0.8),
    sh(rect(-w / 2, -h * 0.86, w, h * 0.82, 2), c), sh(rect(-w / 2, -h * 0.86, w * 0.4, h * 0.82, 1), l),
    sh(rect(-h * 0.24, -h * 0.76, h * 0.48, w * 0.9, 3), c), sh(circle(-h * 0.24, -h * 0.76 + w * 0.45, w * 0.7) + circle(h * 0.24, -h * 0.76 + w * 0.45, w * 0.7), c),
    sh(M(-h * 0.36, -h * 0.34) + Q(-h * 0.34, -h * 0.02, 0, 0) + Q(h * 0.34, -h * 0.02, h * 0.36, -h * 0.34) + L(h * 0.29, -h * 0.3) + Q(h * 0.26, -h * 0.1, 0, -h * 0.085) + Q(-h * 0.26, -h * 0.1, -h * 0.29, -h * 0.3) + 'Z', c),
    sh(poly([[-h * 0.44, -h * 0.27], [-h * 0.36, -h * 0.46], [-h * 0.24, -h * 0.3]]) + poly([[h * 0.44, -h * 0.27], [h * 0.36, -h * 0.46], [h * 0.24, -h * 0.3]]), c),
    stroke(M(-h * 0.32, -h * 0.28) + Q(-h * 0.29, -h * 0.07, -h * 0.02, -h * 0.045), l, 1.6),
  ];
}
function starfish(r: number): Shape[] {
  const pts = (ro: number, ri: number): Pt[] => { const p: Pt[] = []; for (let i = 0; i < 10; i++) { const a = ((-90 + i * 36) * Math.PI) / 180, rr = i % 2 ? ri : ro; p.push([Math.cos(a) * rr, Math.sin(a) * rr]); } return p; };
  let dots = '';
  for (let i = 0; i < 5; i++) { const a = ((-90 + i * 72) * Math.PI) / 180; for (const k of [0.3, 0.52, 0.72]) dots += circle(Math.cos(a) * r * k, Math.sin(a) * r * k, r * 0.045); }
  return [ol(blob(pts(r, r * 0.42), 0.55), '#ee7b3a', 1.2), sh(blob(pts(r * 0.72, r * 0.26), 0.5), '#f6a05c'), sh(dots + circle(0, 0, r * 0.06), '#fbe0b8')];
}
function seashell(r: number): Shape[] {
  const pts: Pt[] = [[0, r * 0.62]];
  for (let i = 0; i <= 12; i++) { const a = ((200 + (i * 140) / 12) * Math.PI) / 180, rr = r * (i % 2 ? 0.93 : 1.02); pts.push([Math.cos(a) * rr, r * 0.5 + Math.sin(a) * rr * 1.1]); }
  let ribs = '';
  for (let i = 1; i < 6; i++) { const a = ((200 + (i * 140) / 6) * Math.PI) / 180; ribs += line([[0, r * 0.5], [Math.cos(a) * r * 0.94, r * 0.5 + Math.sin(a) * r * 1.03]]); }
  return [
    sh(poly([[-r * 0.36, r * 0.42], [r * 0.36, r * 0.42], [r * 0.26, r * 0.74], [-r * 0.26, r * 0.74]]), '#e9b08c'),
    ol(blob(pts, 0.5), '#f8cdb0', 1.2), stroke(ribs, '#d98a6e', 1.4),
    stroke(M(-r * 0.6, -r * 0.02) + Q(0, -r * 0.36, r * 0.6, -r * 0.02), '#fbe6d6', 2.2), stroke(M(-r * 0.36, r * 0.24) + Q(0, r * 0.04, r * 0.36, r * 0.24), '#e9a48a', 1.6),
  ];
}
function sunHat(w: number): Shape[] {
  const c = '#e6c57a';
  let weave = '';
  for (let i = 0; i < 3; i++) weave += ellipse(0, 0, w * (0.5 - 0.055 * (i + 1)), w * (0.17 - 0.019 * (i + 1)));
  return [
    ol(ellipse(0, 0, w * 0.5, w * 0.17), c, 1.2), stroke(weave, shade(c, -0.2), 0.9), sh(M(-w * 0.5, 0) + Q(0, w * 0.2, w * 0.5, 0) + Q(0, w * 0.34, -w * 0.5, 0) + 'Z', shade(c, -0.14), { opacity: 0.7 }),
    ol(M(-w * 0.25, -w * 0.02) + Q(-w * 0.24, -w * 0.3, 0, -w * 0.31) + Q(w * 0.24, -w * 0.3, w * 0.25, -w * 0.02) + Q(0, w * 0.08, -w * 0.25, -w * 0.02) + 'Z', shade(c, 0.14), 1.2),
    sh(M(-w * 0.255, -w * 0.02) + Q(0, w * 0.08, w * 0.255, -w * 0.02) + L(w * 0.25, -w * 0.09) + Q(0, 0, -w * 0.25, -w * 0.09) + 'Z', '#2f6690'),
    sh(poly([[w * 0.2, -w * 0.06], [w * 0.34, -w * 0.13], [w * 0.33, 0]]) + poly([[w * 0.2, -w * 0.06], [w * 0.3, w * 0.07], [w * 0.22, w * 0.07]]), '#2f6690'), sh(circle(w * 0.205, -w * 0.058, w * 0.028), '#1f4c70'),
    stroke(M(-w * 0.17, -w * 0.14) + Q(-w * 0.14, -w * 0.25, -w * 0.02, -w * 0.27), '#fff6d8', 2),
  ];
}
function lantern(h: number): Shape[] {
  const w = h * 0.42, m = '#2f3a3f';
  return [
    stroke(circle(0, -h * 0.94, h * 0.06), m, 2), sh(poly([[-w * 0.2, -h * 0.88], [w * 0.2, -h * 0.88], [w * 0.56, -h * 0.72], [-w * 0.56, -h * 0.72]]), m),
    sh(rect(-w / 2, -h * 0.72, w, h * 0.58, 4), '#ffd978'), sh(ellipse(0, -h * 0.4, w * 0.32, h * 0.2), '#fff3bf'),
    sh(M(0, -h * 0.56) + Q(w * 0.2, -h * 0.4, 0, -h * 0.28) + Q(-w * 0.2, -h * 0.4, 0, -h * 0.56) + 'Z', '#f39c34'),
    stroke(bars(-w / 2, -h * 0.72, w, h * 0.58, 2) + line([[-w / 2, -h * 0.44], [w / 2, -h * 0.44]]), m, 2),
    sh(rect(-w * 0.58, -h * 0.16, w * 1.16, h * 0.09, 2), m), sh(rect(-w * 0.4, -h * 0.07, w * 0.8, h * 0.07, 2), '#465359'),
  ];
}
function coiledRope(w: number): Shape[] {
  const c = '#d9b578', d = '#a8824a', h = w * 0.36;
  let rings = '', tw = '';
  for (let i = 1; i <= 3; i++) rings += ellipse(0, 0, (w / 2) * (1 - i * 0.2), h * (1 - i * 0.2));
  for (let i = 0; i < 28; i++) { const a = (i / 28) * Math.PI * 2; for (const k of [0.9, 0.7, 0.5]) tw += line([[Math.cos(a) * (w / 2) * (k + 0.07), Math.sin(a) * h * (k + 0.07)], [Math.cos(a + 0.12) * (w / 2) * (k - 0.06), Math.sin(a + 0.12) * h * (k - 0.06)]]); }
  return [
    sh(ellipse(w * 0.04, h * 0.2, w * 0.54, h * 1.02), '#3b2a1c', { opacity: 0.25 }),
    stroke(M(w * 0.4, h * 0.3) + Q(w * 0.66, h * 0.72, w * 0.52, h * 1.1), c, w * 0.085), stroke(M(w * 0.4, h * 0.3) + Q(w * 0.66, h * 0.72, w * 0.52, h * 1.1), d, 1),
    sh(ellipse(0, -h * 0.26, w / 2, h), d), ol(ellipse(0, 0, w / 2, h), c, 1.4), sh(ellipse(0, -h * 0.26, w * 0.4, h * 0.8), d), ol(ellipse(0, -h * 0.14, w * 0.4, h * 0.8), shade(c, 0.1), 1.2),
    stroke(rings, d, 1.5), stroke(tw, d, 0.9, { opacity: 0.7 }), sh(ellipse(0, -h * 0.1, w * 0.13, h * 0.26), '#5b4630'),
  ];
}
function fish(len: number): Shape[] {
  const hh = len * 0.19;
  const body = M(-len * 0.5, 0) + Q(-len * 0.3, -hh * 1.25, len * 0.12, -hh * 0.8) + Q(len * 0.3, -hh * 0.4, len * 0.36, 0) + Q(len * 0.3, hh * 0.5, len * 0.1, hh * 0.85) + Q(-len * 0.3, hh * 1.2, -len * 0.5, 0) + 'Z';
  let sc = '';
  for (let i = 0; i < 5; i++) for (let j = -1; j <= 1; j++) { const x = -len * 0.22 + i * len * 0.1 + (j ? len * 0.05 : 0), y = j * hh * 0.42; sc += M(x, y - hh * 0.2) + Q(x + len * 0.045, y, x, y + hh * 0.2); }
  return [
    sh(poly([[len * 0.32, 0], [len * 0.5, -hh * 0.95], [len * 0.44, 0], [len * 0.5, hh * 0.95]]), '#5b88a8'), sh(poly([[-len * 0.12, -hh * 0.9], [len * 0.06, -hh * 1.5], [len * 0.14, -hh * 0.74]]), '#5b88a8'), sh(poly([[-len * 0.05, hh * 0.9], [len * 0.06, hh * 1.4], [len * 0.12, hh * 0.78]]), '#7fa6c0'),
    ol(body, '#7fb0cf', 1.2), sh(M(-len * 0.5, 0) + Q(-len * 0.1, hh * 0.3, len * 0.36, 0) + Q(len * 0.3, hh * 0.5, len * 0.1, hh * 0.85) + Q(-len * 0.3, hh * 1.2, -len * 0.5, 0) + 'Z', '#dfeef2'),
    sh(M(-len * 0.46, -hh * 0.1) + Q(-len * 0.3, -hh * 1.1, len * 0.1, -hh * 0.74) + Q(-len * 0.2, -hh * 0.7, -len * 0.46, -hh * 0.1) + 'Z', '#4f7fa3', { opacity: 0.6 }),
    stroke(sc, '#4f7fa3', 0.9, { opacity: 0.8 }), stroke(M(-len * 0.3, -hh * 0.78) + Q(-len * 0.24, 0, -len * 0.3, hh * 0.74), '#3f6a8a', 1.4),
    sh(circle(-len * 0.38, -hh * 0.2, len * 0.036), '#fbf6e8'), sh(circle(-len * 0.385, -hh * 0.2, len * 0.018), '#1f2a33'),
  ];
}
function key(len: number): Shape[] {
  const c = '#d9a93a', d = '#a87a1e', r = len * 0.2;
  return [
    stroke(circle(-len * 0.3, 0, r), d, len * 0.11), stroke(circle(-len * 0.3, 0, r), c, len * 0.07),
    ol(rect(-len * 0.1, -len * 0.04, len * 0.6, len * 0.08, 1), c, 1), ol(rect(len * 0.3, 0, len * 0.07, len * 0.17), c, 1), ol(rect(len * 0.42, 0, len * 0.07, len * 0.12), c, 1),
    sh(rect(-len * 0.08, -len * 0.03, len * 0.56, len * 0.025), '#f6dc8a'),
  ];
}
function compass(r: number): Shape[] {
  let ticks = '';
  for (let i = 0; i < 16; i++) { const a = (i * Math.PI) / 8, k = i % 4 === 0 ? 0.5 : 0.62; ticks += line([[Math.cos(a) * r * k, Math.sin(a) * r * k], [Math.cos(a) * r * 0.74, Math.sin(a) * r * 0.74]]); }
  return [
    stroke(circle(0, -r * 1.16, r * 0.17), '#a87a1e', r * 0.11), sh(rect(-r * 0.13, -r * 1.08, r * 0.26, r * 0.2), '#c9952c'),
    ol(circle(0, 0, r), '#d9a93a', 1.4), sh(sector(0, 0, r, 200, 320, r * 0.84), '#f6dc8a'), ol(circle(0, 0, r * 0.82), '#fbf6e8', 1, -0.2), stroke(ticks, '#5b4a3a', 1),
    sh(star(0, 0, r * 0.4, r * 0.1, 4, -90), '#d9cdb0'),
    sh(xf(poly([[0, -r * 0.66], [r * 0.13, 0], [-r * 0.13, 0]]), { rot: 28 }), '#d2452f'), sh(xf(poly([[0, r * 0.66], [r * 0.13, 0], [-r * 0.13, 0]]), { rot: 28 }), '#2f6690'), sh(circle(0, 0, r * 0.09), '#5b4a3a'),
  ];
}
function bottle(h: number): Shape[] {
  const w = h * 0.3, c = '#4f8a52';
  const body = M(-w / 2, 0) + L(-w / 2, -h * 0.56) + Q(-w / 2, -h * 0.7, -w * 0.16, -h * 0.76) + L(-w * 0.16, -h * 0.94) + L(w * 0.16, -h * 0.94) + L(w * 0.16, -h * 0.76) + Q(w / 2, -h * 0.7, w / 2, -h * 0.56) + L(w / 2, 0) + 'Z';
  return [
    ol(body, c, 1.2), sh(rect(-w * 0.38, -h * 0.54, w * 0.16, h * 0.5, 2), '#b9dba8', { opacity: 0.7 }), sh(rect(w * 0.2, -h * 0.56, w * 0.3, h * 0.56), '#2f6b3a', { opacity: 0.5 }),
    sh(rect(-w / 2, -h * 0.4, w, h * 0.24), '#fbf1dc'), sh(ellipse(0, -h * 0.28, w * 0.2, h * 0.07), '#f6d23c'), stroke(line([[-w * 0.3, -h * 0.2], [w * 0.3, -h * 0.2]]), '#a89a80', 0.9),
    sh(rect(-w * 0.2, -h * 0.97, w * 0.4, h * 0.05), '#2f6b3a'), sh(rect(-w * 0.13, -h * 1.04, w * 0.26, h * 0.08, 1), '#c9a06a'),
  ];
}
function crab(w: number): Shape[] {
  const c = '#d9482f', d = '#a83222';
  let legs = '';
  for (const s of [-1, 1]) for (let i = 0; i < 3; i++) legs += M(s * w * 0.2, w * (0.02 + i * 0.05)) + Q(s * w * (0.4 + i * 0.02), w * (-0.04 + i * 0.1), s * w * (0.44 - i * 0.04), w * (0.16 + i * 0.07));
  const claw = (s: number) => [
    stroke(M(s * w * 0.2, -w * 0.06) + Q(s * w * 0.36, -w * 0.12, s * w * 0.36, -w * 0.24), c, w * 0.06),
    ol(xf(M(0, 0) + Q(w * 0.16, -w * 0.02, w * 0.17, -w * 0.15) + L(w * 0.09, -w * 0.08) + L(w * 0.03, -w * 0.19) + Q(-w * 0.08, -w * 0.06, 0, 0) + 'Z', { sx: s, x: s * w * 0.32, y: -w * 0.2 }), c, 1),
  ];
  return [
    stroke(legs, d, w * 0.05), ...claw(-1), ...claw(1),
    ol(ellipse(0, 0, w * 0.27, w * 0.18), c, 1.2), sh(ellipse(-w * 0.06, -w * 0.06, w * 0.15, w * 0.07), '#f08a6a', { opacity: 0.8 }),
    stroke(line([[-w * 0.08, -w * 0.15], [-w * 0.09, -w * 0.25]]) + line([[w * 0.08, -w * 0.15], [w * 0.09, -w * 0.25]]), d, 1.6), sh(circle(-w * 0.09, -w * 0.26, w * 0.035) + circle(w * 0.09, -w * 0.26, w * 0.035), '#1f2a33'),
    stroke(M(-w * 0.07, w * 0.07) + Q(0, w * 0.11, w * 0.07, w * 0.07), d, 1.2),
  ];
}
function lifebuoy(r: number): Shape[] {
  let red = '';
  for (let i = 0; i < 4; i++) red += sector(0, 0, r, i * 90 + 22, i * 90 + 68, r * 0.56);
  return [
    sh(sector(0, 0, r, 0, 360, r * 0.56), '#fbf6e8'), sh(red, '#d2452f'), stroke(circle(0, 0, r) + circle(0, 0, r * 0.56), '#8a6a55', 1.2),
    sh(sector(0, 0, r * 0.95, 200, 300, r * 0.82), '#ffffff', { opacity: 0.5 }),
    stroke(M(-r, 0) + Q(-r * 1.14, -r * 0.9, 0, -r) + M(0, -r) + Q(r * 1.14, -r * 0.9, r, 0) + M(r, 0) + Q(r * 1.14, r * 0.9, 0, r) + M(0, r) + Q(-r * 1.14, r * 0.9, -r, 0), '#d9c7a0', 1.6),
  ];
}
function lemonSlice(r: number): Shape[] {
  let seg = '', rib = '';
  for (let i = 0; i < 8; i++) { seg += sector(0, 0, r * 0.76, i * 45 + 5, i * 45 + 40, r * 0.12); const a = ((i * 45 + 22.5) * Math.PI) / 180; rib += line([[Math.cos(a) * r * 0.25, Math.sin(a) * r * 0.25], [Math.cos(a) * r * 0.66, Math.sin(a) * r * 0.66]]); }
  return [ol(circle(0, 0, r), '#f3c92f', 1.2, -0.3), sh(circle(0, 0, r * 0.86), '#fff8dc'), sh(seg, '#fbe36a'), stroke(rib, '#fff3a6', 1.2), sh(sector(0, 0, r * 0.97, 210, 300, r * 0.88), '#fff3a6', { opacity: 0.8 })];
}
function postcard(w: number): Shape[] {
  const h = w * 0.68, x0 = -w / 2, y0 = -h / 2;
  return [
    sh(rect(x0 + 2, y0 + 2, w, h), '#3b2a1c', { opacity: 0.22 }), ol(rect(x0, y0, w, h), '#fbf6e8', 1, -0.25),
    sh(rect(x0 + w * 0.05, y0 + h * 0.08, w * 0.44, h * 0.84), '#9fd0e6'), sh(rect(x0 + w * 0.05, y0 + h * 0.52, w * 0.44, h * 0.4), '#3f8fa3'), sh(circle(x0 + w * 0.38, y0 + h * 0.28, h * 0.1), '#f6d23c'),
    sh(poly([[x0 + w * 0.2, y0 + h * 0.6], [x0 + w * 0.2, y0 + h * 0.28], [x0 + w * 0.32, y0 + h * 0.6]]), '#fbf6e8'), sh(poly([[x0 + w * 0.12, y0 + h * 0.62], [x0 + w * 0.36, y0 + h * 0.62], [x0 + w * 0.32, y0 + h * 0.7], [x0 + w * 0.16, y0 + h * 0.7]]), '#d2452f'),
    stroke(line([[x0 + w * 0.54, y0 + h * 0.1], [x0 + w * 0.54, y0 + h * 0.9]]), '#b9ad98', 0.9),
    ol(rect(x0 + w * 0.78, y0 + h * 0.1, w * 0.15, h * 0.26), '#e4572e', 0.8), sh(circle(x0 + w * 0.855, y0 + h * 0.23, w * 0.04), '#fbe0b8'),
    stroke(line([[x0 + w * 0.6, y0 + h * 0.52], [x0 + w * 0.92, y0 + h * 0.52]]) + line([[x0 + w * 0.6, y0 + h * 0.66], [x0 + w * 0.92, y0 + h * 0.66]]) + line([[x0 + w * 0.6, y0 + h * 0.8], [x0 + w * 0.84, y0 + h * 0.8]]), '#8a7f70', 1),
    stroke(curve([[x0 + w * 0.6, y0 + h * 0.2], [x0 + w * 0.66, y0 + h * 0.14], [x0 + w * 0.72, y0 + h * 0.2], [x0 + w * 0.78, y0 + h * 0.14]]) + curve([[x0 + w * 0.6, y0 + h * 0.3], [x0 + w * 0.66, y0 + h * 0.24], [x0 + w * 0.72, y0 + h * 0.3], [x0 + w * 0.78, y0 + h * 0.24]]), '#6b6b7a', 0.8),
  ];
}
function bell(h: number): Shape[] {
  const c = '#d9a93a', w = h * 0.8;
  const body = M(-w * 0.14, -h * 0.84) + Q(0, -h * 0.94, w * 0.14, -h * 0.84) + Q(w * 0.34, -h * 0.7, w * 0.36, -h * 0.34) + Q(w * 0.38, -h * 0.2, w * 0.5, -h * 0.12) + L(-w * 0.5, -h * 0.12) + Q(-w * 0.38, -h * 0.2, -w * 0.36, -h * 0.34) + Q(-w * 0.34, -h * 0.7, -w * 0.14, -h * 0.84) + 'Z';
  return [
    stroke(circle(0, -h * 0.93, h * 0.06), '#8a6a2a', 2.2), sh(circle(0, -h * 0.03, h * 0.08), '#8a6a2a'),
    ol(body, c, 1.2), sh(M(w * 0.06, -h * 0.86) + Q(w * 0.3, -h * 0.7, w * 0.33, -h * 0.34) + Q(w * 0.36, -h * 0.2, w * 0.46, -h * 0.13) + L(w * 0.16, -h * 0.13) + Q(w * 0.18, -h * 0.5, w * 0.06, -h * 0.86) + 'Z', '#b3831f', { opacity: 0.7 }),
    stroke(M(-w * 0.2, -h * 0.7) + Q(-w * 0.26, -h * 0.5, -w * 0.26, -h * 0.34), '#fff0b8', 2.2),
    ol(rect(-w * 0.52, -h * 0.14, w * 1.04, h * 0.07, 2), '#c9952c', 1),
  ];
}
function sunglasses(w: number): Shape[] {
  const lens = (s: number) => xf(blob([[w * 0.08, -w * 0.14], [w * 0.4, -w * 0.15], [w * 0.47, -w * 0.02], [w * 0.36, w * 0.13], [w * 0.16, w * 0.13], [w * 0.06, 0]], 0.9), { sx: s });
  return [
    stroke(M(-w * 0.45, -w * 0.1) + Q(-w * 0.62, -w * 0.3, -w * 0.3, -w * 0.3) + M(w * 0.45, -w * 0.1) + Q(w * 0.62, -w * 0.3, w * 0.3, -w * 0.3), '#3b2a22', 2.6),
    sh(lens(1), '#1f3a4a', { stroke: '#3b2a22', strokeWidth: 3 }), sh(lens(-1), '#1f3a4a', { stroke: '#3b2a22', strokeWidth: 3 }),
    stroke(M(-w * 0.08, -w * 0.08) + Q(0, -w * 0.15, w * 0.08, -w * 0.08), '#3b2a22', 3),
    stroke(line([[w * 0.16, -w * 0.07], [w * 0.26, 0.06 * w]]) + line([[w * 0.25, -w * 0.08], [w * 0.33, 0.02 * w]]) + line([[-w * 0.36, -w * 0.07], [-w * 0.26, 0.06 * w]]) + line([[-w * 0.27, -w * 0.08], [-w * 0.19, 0.02 * w]]), '#8fc3d6', 2.2, { opacity: 0.8 }),
  ];
}

// =====================================================================
// scene
// =====================================================================
// ---- sky, far shore, sea ----
scene(sh(rect(0, 0, W, 460), `url(#${ID}-sky)`));
scene(place(cloud(190, 30, 4, '#ffffff', '#dbe9f0'), { x: 150, y: 90 }), place(cloud(150, 22, 9, '#ffffff', '#dbe9f0'), { x: 390, y: 170 }), place(cloud(110, 16, 14, '#ffffff', '#dbe9f0'), { x: 70, y: 220 }));
scene(place(gull(34, '#fbfaf4', -8), { x: 330, y: 80 }), place(gull(22, '#fbfaf4', 10), { x: 440, y: 120 }), place(gull(18, '#fbfaf4', -4), { x: 60, y: 150 }));
{
  const g = rng(3);
  const hillPts: Pt[] = [[-10, 322], [60, 296], [130, 280], [210, 262], [290, 270], [370, 252], [450, 262], [540, 246], [540, 344], [-10, 344]];
  let h1 = '', h2 = '', rf = '';
  for (let i = 0; i < 34; i++) { const x = g.range(0, 520), y = g.range(296, 334), w = g.range(8, 16), hh = g.range(7, 13); if (i % 2) h1 += rect(x, y - hh, w, hh); else h2 += rect(x, y - hh, w, hh); rf += rect(x - 1, y - hh - 2.5, w + 2, 3); }
  scene(sh(poly(hillPts), '#9fb58a'), sh(poly([[-10, 322], [60, 296], [130, 280], [210, 262], [240, 265], [150, 300], [60, 320], [-10, 336]]), '#b9c99a'), sh(h1, '#fbead0'), sh(h2, '#f6cfae'), sh(rf, '#c9673f'));
  let tr = '';
  for (let i = 0; i < 22; i++) tr += ellipse(g.range(0, 530), g.range(276, 336), g.range(6, 12), g.range(5, 9));
  scene(sh(tr, '#6f8f5c'));
}
{
  const g = rng(8);
  let a = '', b = '', c = '';
  for (let i = 0; i < 90; i++) { const y = 344 + Math.pow(g.next(), 1.2) * 290, t = (y - 340) / 300, x = g.range(-10, 540), len = 8 + t * 34, d = M(x, y) + Q(x + len / 2, y - 1.5 - t * 3, x + len, y); if (i % 3 === 0) a += d; else if (i % 3 === 1) b += d; else c += d; }
  scene(sh(rect(0, 340, 560, 320), `url(#${ID}-sea)`), stroke(a, '#d9f2ee', 1.6, { opacity: 0.85 }), stroke(b, '#2c7391', 1.6, { opacity: 0.6 }), stroke(c, '#bfe6e2', 1.3, { opacity: 0.7 }));
  scene(sh(poly([[410, 372], [450, 372], [444, 381], [416, 381]]), '#6b4a4a'), sh(poly([[430, 370], [430, 336], [450, 368]]), '#fff6e0'), sh(poly([[427, 370], [427, 344], [412, 368]]), '#f6d9b0'));
  scene(sh(poly([[40, 392], [66, 392], [62, 399], [44, 399]]), '#2f6690'), sh(poly([[53, 390], [53, 366], [66, 388]]), '#fff6e0'));
}

// ---- moored boat ----
const BX = 258, BY = 640, BS = 2.6;
scene(place(boat({ len: 150, hull: '#fbf6e8', stripe: '#2f6690', keel: '#8c3b2e', cabin: true, mast: true, cargo: true, seed: 4 }), { x: BX, y: BY, s: BS }));
scene(bunting([BX - 8, BY - 117 * BS + 4], [520, 236], 26, 9, 2));
target('bell', 'Bell', place(bell(44), { x: 150, y: 560 }));
scene(stroke(line([[150, BY - 50 * BS], [150, 520]]), '#5b4a3a', 1.4));

// ---- ground ----
{
  const g = rng(17);
  const tints = ['#dccaa6', '#d3bf99', '#e4d4b2', '#c9b48f'];
  const d = ['', '', '', ''];
  let y = 664;
  while (y < H) {
    const hh = 15 + (y - 664) * 0.034, w0 = hh * 1.7;
    let x = -g.range(0, w0);
    while (x < W) { const w = w0 * g.range(0.8, 1.25); d[g.int(0, 3)] += rect(x + 1.5, y + 1.5, w - 3, hh - 3, hh * 0.3); x += w; }
    y += hh;
  }
  scene(sh(rect(0, 640, W, H - 640), `url(#${ID}-ground)`), sh(d[0], tints[0]), sh(d[1], tints[1]), sh(d[2], tints[2]), sh(d[3], tints[3]));
  let j = '';
  for (let i = 0; i < 9; i++) j += line([[i * 62 + 20, 642], [i * 62 + 20, 664]]);
  scene(sh(rect(0, 638, 524, 28), '#eadfc4'), sh(rect(0, 638, 524, 7), '#f7efd9'), sh(rect(0, 662, 524, 5), '#9a8566', { opacity: 0.6 }), stroke(j, '#b9a888', 1.4));
}

// ---- building facade ----
{
  const g = rng(23);
  const wall = '#f3c6a0';
  let patch = '', patch2 = '';
  for (let i = 0; i < 16; i++) { const d = ellipse(g.range(560, 1180), g.range(10, 430), g.range(14, 46), g.range(6, 16), g.range(-20, 20)); if (i % 2) patch += d; else patch2 += d; }
  scene(sh(rect(520, 0, 680, 470), wall), sh(patch, shade(wall, -0.06)), sh(patch2, shade(wall, 0.14)), sh(rect(520, 0, 30, 470), shade(wall, 0.2)));
  let q = '';
  for (let i = 0; i < 12; i++) q += rect(520, i * 40 + 2, i % 2 ? 34 : 24, 34, 2);
  scene(sh(q, '#f9e6c6'), stroke(q, '#d9b48c', 1));
  scene(sh(rect(566, 0, 9, 340), '#7f9aa3'), sh(rect(566, 0, 3, 340), '#a9c0c7'), sh(rect(563, 120, 15, 6) + rect(563, 260, 15, 6), '#5f7a84'));
  // cornice and bunting
  scene(sh(rect(520, 268, 680, 10), shade(wall, 0.25)), sh(rect(520, 278, 680, 4), shade(wall, -0.2)));
  for (const cx of [690, 1010]) {
    scene(sh(rect(cx - 80, 76, 160, 8, 2), '#f9e6c6'), place(win(70, 118, { shutter: '#3f7d6e', lod: 2, box: true, seed: cx }), { x: cx, y: 150 }));
    scene(sh(rect(cx - 46, 214, 92, 16, 2), '#93563a'), place(bougainvillea(104, 38, cx + 3, cx > 800 ? '#e4572e' : '#d6336c'), { x: cx, y: 206 }));
  }
  // painted shop board (a lemon, no lettering)
  scene(
    stroke(line([[812, 66], [812, 96]]) + line([[888, 66], [888, 96]]), '#4a4038', 1.6), sh(rect(796, 58, 108, 8, 3), '#4a4038'),
    sh(rect(790, 96, 120, 84, 12), '#2f6690'), stroke(rect(797, 103, 106, 70, 8), '#f6dc9c', 2),
    ol(ellipse(846, 142, 27, 19, -18), '#f6d23c', 1.2), sh(ellipse(838, 135, 9, 4.5, -18), '#fff3a6'), sh(leaf(868, 128, 26, 8, -40), '#7fb069'), sh(leaf(866, 130, 20, 6, -80), '#5c8f4f'),
  );
  scene(place(bougainvillea(170, 250, 31, '#c2257a'), { x: 1150, y: 130 }), place(bougainvillea(260, 60, 37, '#c2257a'), { x: 1040, y: 22 }), place(bougainvillea(90, 120, 39, '#d6336c'), { x: 1172, y: 300 }));
  scene(bunting([548, 34], [1204, 20], 46, 17, 0));
}

// ---- stall interior (in the shade of the awning) ----
scene(sh(rect(520, 440, 680, 570), `url(#${ID}-shade)`), sh(rect(520, 440, 680, 90), '#8f6648', { opacity: 0.35 }));
{
  // shelf with jars
  scene(sh(rect(544, 574, 286, 9), '#8a5f3c'), sh(rect(544, 574, 286, 3), '#b3855a'), sh(poly([[560, 583], [572, 583], [560, 604]]) + poly([[800, 583], [812, 583], [812, 604]]), '#6b4a2f'));
  const jars: [number, number, number, string, string][] = [[566, 26, 38, '#d98a2b', '#8c3b2e'], [598, 30, 48, '#b93a32', '#f7f2e4'], [634, 26, 36, '#e3b23c', '#3f7d6e'], [668, 30, 44, '#7a8f3c', '#8c3b2e'], [704, 24, 34, '#d98a2b', '#f7f2e4'], [768, 30, 46, '#b93a32', '#3f7d6e'], [804, 26, 38, '#e3b23c', '#8c3b2e']];
  for (const [x, w, h, c, l] of jars) scene(place(jar(w, h, c, l), { x, y: 574 }));
  target('bottle', 'Bottle', place(bottle(62), { x: 736, y: 574 }));
}
// awning
{
  const yb = 322, yf = 452, xb0 = 548, xb1 = 1200, xf0 = 492, xf1 = 1200, n = 15;
  let a = '', v0 = '', v1 = '';
  for (let i = 0; i < n; i++) {
    const t0 = i / n, t1 = (i + 1) / n;
    const q = poly([[xb0 + (xb1 - xb0) * t0, yb], [xb0 + (xb1 - xb0) * t1, yb], [xf0 + (xf1 - xf0) * t1, yf], [xf0 + (xf1 - xf0) * t0, yf]]);
    const xa = xf0 + (xf1 - xf0) * t0, xc = xf0 + (xf1 - xf0) * t1;
    const sc = M(xa, yf) + L(xc, yf) + L(xc, yf + 26) + Q((xa + xc) / 2, yf + 46, xa, yf + 26) + 'Z';
    if (i % 2) { a += q; v1 += sc; } else v0 += sc;
  }
  scene(sh(poly([[xb0, yb], [xb1, yb], [xf1, yf], [xf0, yf]]), '#fbf1dc'), sh(a, '#d2452f'), sh(poly([[xb0, yb], [xb1, yb], [xb1, yb + 16], [xb0 - 7, yb + 16]]), '#ffffff', { opacity: 0.25 }), sh(poly([[xf0 + 20, yf - 46], [xf1, yf - 46], [xf1, yf], [xf0, yf]]), '#6b3a2a', { opacity: 0.12 }));
  scene(sh(v0, '#eadcc0'), sh(v1, '#b53a28'), stroke(line([[xf0, yf], [xf1, yf]]), '#8a6a55', 1.6), sh(rect(xb0 - 4, yb - 7, xb1 - xb0 + 4, 9), '#6b4a2f'));
}
// produce tiers
{
  const back: [number, Kind, string][] = [[622, 'lemon', '#b98b5a'], [777, 'tomato', '#a87a4c'], [932, 'peach', '#c29a66'], [1087, 'aubergine', '#b08352']];
  scene(sh(rect(528, 700, 664, 44), '#6b4a2f'), sh(rect(528, 700, 664, 6), '#8a6238'));
  back.forEach(([x, k, c], i) => scene(place(pile(140, 17, k, 40 + i * 7), { x, y: 652 }), place(crateFront(148, 54, c), { x, y: 648 })));
  target('seashell', 'Seashell', place(seashell(22), { x: 962, y: 596, rot: -14 }));
  // ice tray with the catch of the day
  const g = rng(5);
  let ice = '', ice2 = '';
  for (let i = 0; i < 26; i++) { const d = poly([[0, -7], [7, -2], [5, 6], [-5, 6], [-8, -1]]); const p = xf(d, { x: g.range(540, 668), y: g.range(712, 746), rot: g.range(0, 360), s: g.range(0.8, 1.5) }); if (i % 2) ice += p; else ice2 += p; }
  scene(sh(blob([[530, 748], [540, 716], [580, 700], [640, 702], [672, 718], [678, 748]], 0.8), '#dceef2'), sh(ice, '#f4fbfc'), sh(ice2, '#bcdde6'), sh(rect(526, 744, 156, 56, 3), '#9fb3bd'), sh(rect(526, 744, 156, 9, 3), '#c9d8de'), sh(rect(526, 790, 156, 10, 3), '#7f949e'));
  scene(ol(sector(560, 740, 18, 180, 360), '#f6d23c', 1), sh(sector(560, 740, 14, 180, 360), '#fbe98f'), sh(leaf(648, 736, 30, 9, -150), '#5c8f4f'), sh(leaf(650, 738, 26, 8, -100), '#7fb069'));
  target('fish', 'Fish', place(fish(104), { x: 606, y: 722, rot: -8 }));
  const front: [number, Kind, string, number][] = [[762, 'orange', '#c29a66', 19], [920, 'pepper', '#a87a4c', 18], [1080, 'melon', '#b98b5a', 27]];
  front.forEach(([x, k, c, r], i) => scene(place(pile(144, r, k, 80 + i * 5, k === 'melon' ? 2 : 3), { x, y: 748 }), place(crateFront(152, 56, c), { x, y: 744 })));
  // blank price tags
  for (const [x, y] of [[622, 664], [777, 664], [932, 664], [1087, 664], [762, 762], [920, 762], [1080, 762]] as Pt[]) scene(ol(rect(x - 17, y, 34, 22, 2), '#fbf1dc', 0.8), stroke(curve([[x - 10, y + 9], [x - 4, y + 5], [x + 2, y + 10], [x + 9, y + 6]]) + line([[x - 9, y + 16], [x + 8, y + 16]]), '#6b5b4b', 1.1));
}
// hanging goods
{
  const bar = 494;
  // garlic braid
  let ga = '';
  for (let i = 0; i < 6; i++) ga += ellipse(916 + (i % 2 ? 7 : -7), bar + 22 + i * 12, 9, 8);
  scene(stroke(line([[916, bar - 6], [916, bar + 86]]), '#c9b58a', 2.2), ol(ga, '#f7f0e0', 1, -0.2), sh(poly([[910, bar + 92], [922, bar + 92], [926, bar + 108], [906, bar + 108]]), '#d9c7a0'));
  // scales
  scene(stroke(line([[990, bar - 6], [990, bar + 14]]) + line([[990, bar + 48], [966, bar + 78]]) + line([[990, bar + 48], [1014, bar + 78]]), '#5b5b5b', 1.3), ol(circle(990, bar + 30, 18), '#e8e2d2', 1.4, -0.4), stroke(line([[990, bar + 30], [998, bar + 20]]), '#d2452f', 1.8), sh(circle(990, bar + 30, 2.4), '#3a3a3f'), stroke(sector(990, bar + 30, 14, 200, 340, 13.9), '#8a8a8a', 1), ol(M(960, bar + 78) + L(1020, bar + 78) + Q(990, bar + 100, 960, bar + 78) + 'Z', '#c9a24a', 1.2));
  // chillies
  let ch = '';
  const g = rng(12);
  for (let i = 0; i < 12; i++) ch += leaf(1062 + g.range(-6, 6), bar + 8 + i * 5.5, g.range(16, 24), 4, g.pick([30, 60, 120, 150]));
  scene(stroke(line([[1062, bar - 6], [1062, bar + 74]]), '#6b5b4b', 1.3), sh(ch, '#c8322a'), sh(circle(1062, bar + 4, 4), '#4f7a3f'));
  // dried herbs
  let hb = '', hb2 = '';
  for (let i = 0; i < 9; i++) { const d = leaf(1132, bar + 20, g.range(40, 62), 6, 90 + g.range(-22, 22)); if (i % 2) hb += d; else hb2 += d; }
  scene(stroke(line([[1132, bar - 6], [1132, bar + 20]]), '#6b5b4b', 1.3), sh(hb, '#6f8f5c'), sh(hb2, '#8fae6a'), sh(rect(1126, bar + 16, 12, 7, 2), '#c9a06a'));
  scene(stroke(line([[852, bar - 6], [852, bar + 10]]), '#3a3a3f', 1.4));
  target('lantern', 'Lantern', place(lantern(78), { x: 852, y: bar + 84 }));
}
// stall table, cloth and posts
{
  scene(sh(rect(528, 964, 664, 46), '#4a3528'), sh(rect(534, 964, 14, 46) + rect(1172, 964, 14, 46) + rect(850, 964, 14, 46), '#7a5236'));
  scene(place(crateFront(120, 40, '#8a6238'), { x: 640, y: 970 }), place(crateFront(120, 40, '#7a5a35'), { x: 1010, y: 970 }), sh(ellipse(760, 1000, 40, 12) + ellipse(1110, 1000, 34, 11), '#2f2620', { opacity: 0.5 }));
  let st = '', sc = '', sc2 = '';
  const n = 28, x0 = 524, wd = 672 / n;
  for (let i = 0; i < n; i++) { const xa = x0 + i * wd; const s = M(xa, 958) + L(xa + wd, 958) + Q(xa + wd / 2, 980, xa, 958) + 'Z'; if (i % 2) { st += rect(xa, 814, wd, 146); sc += s; } else sc2 += s; }
  scene(sh(rect(524, 814, 672, 146), '#fbf1dc'), sh(st, '#3f7d6e'), sh(sc2, '#fbf1dc'), sh(sc, '#3f7d6e'), sh(rect(524, 814, 672, 14), '#3b2a1c', { opacity: 0.2 }));
  let folds = '';
  for (let i = 1; i < 6; i++) folds += line([[524 + i * 112, 816], [524 + i * 112 + 8, 958]]);
  scene(stroke(folds, '#3b2a1c', 5, { opacity: 0.08 }), sh(rect(516, 798, 688, 18, 3), '#b3855a'), sh(rect(516, 798, 688, 5, 2), '#d9aa78'), sh(rect(516, 812, 688, 4), '#7a5236'));
  // little cards pegged to the cloth
  scene(ol(xf(rect(-22, -15, 44, 30), { rot: 6, x: 640, y: 880 }), '#fbf1dc', 0.9), stroke(xf(curve([[-14, -4], [-6, -9], [2, -3], [12, -8]]) + line([[-13, 5], [10, 5]]), { rot: 6, x: 640, y: 880 }), '#6b5b4b', 1.1), sh(rect(636, 858, 7, 12, 1), '#c9a06a'));
  scene(ol(xf(rect(-24, -16, 48, 32), { rot: -5, x: 1090, y: 884 }), '#f6dc9c', 0.9), stroke(xf(curve([[-15, -4], [-6, -9], [3, -3], [13, -8]]) + line([[-14, 5], [11, 5]]) + line([[-14, 10], [4, 10]]), { rot: -5, x: 1090, y: 884 }), '#6b5b4b', 1.1), sh(rect(1086, 860, 7, 12, 1), '#c9a06a'));
  target('postcard', 'Postcard', place(postcard(74), { x: 876, y: 886, rot: -7 }));
  scene(sh(rect(872, 852, 7, 13, 1), '#c9a06a'));
  // posts
  scene(sh(rect(506, 448, 18, 562), '#f7f2e4'), sh(rect(518, 448, 6, 562), '#cfc4ae'), sh(rect(500, 1002, 30, 10, 2), '#8a6a55'), sh(rect(1180, 448, 18, 562), '#f7f2e4'), sh(rect(1192, 448, 6, 562), '#cfc4ae'), sh(rect(1174, 1002, 26, 10, 2), '#8a6a55'));
  scene(stroke(line([[515, 558], [515, 574]]), '#5b4a3a', 2), sh(circle(515, 556, 4), '#4a4038'));
  target('lifebuoy', 'Lifebuoy', place(lifebuoy(34), { x: 515, y: 606 }));
}

// ---- quayside clutter (left) ----
scene(place(bollard(52), { x: 118, y: 742 }), place(bollard(46), { x: 442, y: 726 }));
scene(stroke(M(118, 690) + Q(150, 660, 200, 628), '#e0cfa6', 4), stroke(M(118, 690) + Q(150, 660, 200, 628), '#a8824a', 1), stroke(M(442, 678) + Q(420, 650, 400, 622), '#e0cfa6', 4), stroke(ellipse(118, 696, 20, 6) + ellipse(442, 684, 18, 5), '#e0cfa6', 4.5));
target('rope', 'Coiled rope', place(coiledRope(96), { x: 290, y: 760 }));
// blue fish boxes with nets
{
  const box = (x: number, y: number, w: number, h: number, c: string) => [sh(rect(x - w / 2, y - h, w, h, 4), c), sh(rect(x - w / 2, y - h, w, h * 0.2, 4), shade(c, 0.25)), sh(rect(x - w / 2 + 10, y - h * 0.62, w - 20, h * 0.42, 3), shade(c, -0.14)), sh(rect(x - w * 0.14, y - h * 0.56, w * 0.28, h * 0.16, 4), shade(c, -0.4)), sh(rect(x + w / 2 - 10, y - h, 10, h, 3), shade(c, -0.22))];
  scene(sh(ellipse(250, 1004, 130, 12), '#3b2a1c', { opacity: 0.25 }), box(250, 1004, 200, 62, '#3f8fa3'), box(240, 944, 190, 58, '#4aa0b0'));
  scene(place(netPile(150, 46, '#e08a3c', 6), { x: 236, y: 890 }));
}
target('sunglasses', 'Sunglasses', place(sunglasses(58), { x: 312, y: 886, rot: -6 }));
target('anchor', 'Anchor', place(anchor(128), { x: 86, y: 1004, rot: -13 }));
scene(place(lobsterPot(128, 74), { x: 434, y: 1000 }), place(lobsterPot(118, 68), { x: 426, y: 926 }), place(standingGull(52), { x: 430, y: 858 }));
// nets, floats and buoys
scene(place(netPile(300, 150, '#3f9a9a', 9), { x: 168, y: 1300 }));
target('starfish', 'Starfish', place(starfish(31), { x: 196, y: 1212, rot: 14 }));
scene(place(buoy(38, '#e4572e'), { x: 372, y: 1270 }), place(buoy(30, '#f39c34', '#2f6690'), { x: 60, y: 1396 }), place(buoy(34, '#e8799f'), { x: 300, y: 1392 }), place(buoy(26, '#f6d23c', '#d2452f'), { x: 420, y: 1352 }));
scene(stroke(curve([[372, 1222], [340, 1180], [300, 1160], [250, 1168]]), '#d9c7a0', 3), stroke(curve([[60, 1356], [80, 1320], [70, 1290]]), '#d9c7a0', 3));
target('crab', 'Crab', place(crab(74), { x: 390, y: 1128, rot: 12 }));

// ---- foreground (centre and right) ----
{
  // chalkboard easel with chalk doodles (no words)
  const x = 566, y = 1218;
  scene(sh(ellipse(x + 6, y, 62, 9), '#3b2a1c', { opacity: 0.25 }), stroke(line([[x - 50, y], [x - 38, y - 196]]) + line([[x + 50, y], [x + 38, y - 196]]), '#8a5f3c', 7), sh(rect(x - 46, y - 190, 92, 148, 3), '#8a5f3c'), sh(rect(x - 39, y - 183, 78, 134, 2), '#2f3f3a'),
    stroke(circle(x, y - 146, 15) + line([[x, y - 170], [x, y - 164]]) + line([[x - 22, y - 146], [x - 17, y - 146]]) + line([[x + 17, y - 146], [x + 22, y - 146]]) + line([[x - 16, y - 162], [x - 12, y - 158]]) + line([[x + 16, y - 162], [x + 12, y - 158]]), '#f6d23c', 2),
    stroke(curve([[x - 28, y - 112], [x - 14, y - 120], [x, y - 110], [x + 14, y - 120], [x + 28, y - 112]]) + curve([[x - 24, y - 94], [x - 10, y - 100], [x + 6, y - 92], [x + 22, y - 98]]) + line([[x - 22, y - 74], [x + 20, y - 74]]) + line([[x - 16, y - 62], [x + 12, y - 62]]), '#f2efe6', 2));
  // lemon basket
  scene(place(pile(150, 21, 'lemon', 61, 3), { x: 716, y: 1166 }), place(basket(176, 108), { x: 716, y: 1160 }));
  scene(sh(leaf(650, 1138, 46, 13, -160), '#4f7a3f'), sh(leaf(780, 1140, 44, 12, -20), '#5c8f4f'));
  target('lemon-slice', 'Lemon slice', place(lemonSlice(24), { x: 742, y: 1100 }));
  // orange basket
  scene(place(pile(126, 20, 'orange', 71, 3), { x: 842, y: 1322 }), place(basket(150, 92, '#b98b5a'), { x: 842, y: 1316 }));
  // barrel with a key left on top
  scene(place(barrel(150, 170), { x: 976, y: 1226 }));
  target('key', 'Key', place(key(54), { x: 980, y: 1056, rot: 18 }));
  // sacks and a straw hat
  scene(place(sack(140, 150, '#c9a878'), { x: 1132, y: 1230 }), place(sack(120, 120, '#d3b68a'), { x: 1080, y: 1262 }));
  scene(sh(ellipse(1080, 1150, 34, 12), '#8a6238'), sh(ellipse(1066, 1148, 9, 7) + ellipse(1082, 1146, 9, 7) + ellipse(1096, 1150, 9, 7) + ellipse(1076, 1154, 8, 6), '#b9824a'));
  target('sun-hat', 'Sun hat', place(sunHat(124), { x: 1134, y: 1088, rot: -6 }));
  // upturned crate with the harbour-master's compass
  scene(sh(ellipse(1070, 1462, 110, 12), '#3b2a1c', { opacity: 0.25 }), sh(poly([[986, 1378], [1150, 1378], [1168, 1346], [1004, 1346]]), '#d3aa72'), stroke(line([[1040, 1378], [1058, 1346]]) + line([[1096, 1378], [1114, 1346]]), '#8a6238', 1.6), place(crateFront(164, 84, '#b98b5a'), { x: 1068, y: 1378 }));
  target('compass', 'Compass', place(compass(25), { x: 1090, y: 1352 }));
  // terracotta pots
  scene(place(terracotta(30, 'lemon', 15), { x: 520, y: 1392 }), place(terracotta(24, 'flower', 21), { x: 606, y: 1452 }), place(terracotta(22, 'herb', 33), { x: 676, y: 1396 }), place(terracotta(26, 'flower', 44), { x: 1160, y: 1016 }));
  // sleepy cat
  scene(place(cat(86), { x: 880, y: 1456 }));
  // dropped lemons and leaves
  const g = rng(91);
  scene(...fruit(470, 1232, 17, 'lemon', g), ...fruit(628, 1300, 16, 'lemon', g), ...fruit(748, 1420, 17, 'orange', g), sh(leaf(486, 1226, 34, 10, -30), '#5c8f4f'), sh(leaf(640, 1296, 30, 9, 20), '#4f7a3f'), sh(leaf(960, 1300, 30, 9, 140), '#5c8f4f'), sh(leaf(40, 1100, 30, 9, 40), '#6f8f5c'));
}
void blob; void mix; void slats;

const activity: FindActivity = {
  id: ID, version: 1, mode: 'find', title: 'Quayside Market',
  blurb: 'Morning on the quay: fruit stalls, fishing gear and a moored boat hide sixteen little seaside treasures.',
  collectionId: 'coastal', categories: ['Seaside', 'Travel'], difficulty: 'Moderate',
  width: W, height: H, defs, items,
};
export default activity;
