import { rect, ellipse, circle, poly, line, curve, blob, leaf, star, sector, sh, stroke, place, shade, mix, rng, xf, linearGradient, radialGradient, type Rng } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { FindActivity, FindItem } from '../types';
import {
  M, L, Q, ol, shadow, teapot, kite, pineapple, spinningTop, mask, windChime, compass, sunglasses, strawHat, elephant, butterfly, seashell, candle, paperFan,
  paperLantern, type Pt,
} from './props-find';

const ID = 'travel-find-2';
const W = 1200, H = 1500;
const items: FindItem[] = [];
const scene = (...s: (Shape | Shape[])[]) => { items.push({ shapes: s.flat() }); };
const target = (id: string, name: string, shapes: Shape[]) => { items.push({ id, name, target: true, shapes }); };
const GOLD = '#e2b44a', WOOD = '#5a3424', WOOD_L = '#7a4a30';
const glow = (x: number, y: number, r: number, o = 0.8): Shape => sh(circle(x, y, r), `url(#${ID}-glow)`, { opacity: o });

const defs =
  linearGradient(`${ID}-sky`, [[0, '#23264f'], [0.45, '#4f3a6e'], [0.8, '#b8607a'], [1, '#f2a466']]) +
  linearGradient(`${ID}-stall`, [[0, '#f6c27a'], [1, '#c9784a']]) +
  linearGradient(`${ID}-ground`, [[0, '#4a3a4e'], [1, '#6b5258']]) +
  radialGradient(`${ID}-glow`, [[0, '#ffe2a0'], [0.5, '#ffc46a88'], [1, '#ffc46a00']]);

// =====================================================================
// sky, skyline, ground
// =====================================================================
scene(sh(rect(0, 0, W, 470), `url(#${ID}-sky)`));
{
  const g = rng(3);
  let st = '', st2 = '';
  for (let i = 0; i < 70; i++) { const x = g.range(0, W), y = g.range(0, 250); if (i % 7 === 0) st2 += star(x, y, 5, 1.6, 4); else st += circle(x, y, g.range(0.8, 1.8)); }
  scene(sh(st, '#fbf3d8', { opacity: 0.8 }), sh(st2, '#fff6dc'));
  scene(sh(circle(1010, 96, 70), '#fbefc8', { opacity: 0.12 }), sh(circle(1010, 96, 36), '#fbefc8'), sh(circle(1026, 86, 33), '#2a2a56'));
  scene(sh(blob([[60, 180], [140, 160], [240, 176], [300, 196], [180, 204], [80, 200]], 0.9), '#6a4a7a', { opacity: 0.6 }), sh(blob([[700, 230], [820, 210], [940, 230], [880, 246], [740, 248]], 0.9), '#8a5a80', { opacity: 0.5 }));
}
{
  // far skyline: domes, roofs and towers
  const g = rng(7);
  const far = '#3a2c56', near = '#2c2246';
  let d1 = '', d2 = '', wins = '';
  for (let x = -20; x < W; ) {
    const w = g.range(70, 140), h = g.range(50, 120), base = 450, kind = g.int(0, 3);
    const y = base - h;
    d1 += rect(x, y, w, h + 20);
    if (kind === 0) d1 += sector(x + w / 2, y, w * 0.36, 180, 360) + rect(x + w / 2 - 2, y - w * 0.36 - 22, 4, 24);
    else if (kind === 1) d1 += poly([[x - 8, y], [x + w / 2, y - h * 0.45], [x + w + 8, y]]);
    else if (kind === 2) d1 += rect(x + w * 0.3, y - 90, w * 0.3, 92) + poly([[x + w * 0.26, y - 90], [x + w * 0.45, y - 130], [x + w * 0.64, y - 90]]);
    for (let k = 0; k < 4; k++) if (g.next() < 0.6) wins += rect(x + g.range(8, w - 16), y + g.range(10, h - 10), 6, 8);
    x += w + g.range(-10, 6);
  }
  scene(sh(d1, far));
  for (let x = 30; x < W; x += 260) d2 += poly([[x, 470], [x, 400], [x + 30, 370], [x + 60, 400], [x + 60, 470]]) + rect(x + 70, 420, 120, 60) + sector(x + 130, 420, 40, 180, 360);
  scene(sh(d2, near), sh(wins, '#ffd27a', { opacity: 0.9 }));
}
scene(sh(rect(0, 460, W, H - 460), `url(#${ID}-ground)`));

// =====================================================================
// back row of stalls (seen between and above the front stalls)
// =====================================================================
function awning(w: number, h: number, a: string, b: string, n: number): Shape[] {
  const out: Shape[] = [];
  let s1 = '', s2 = '', sc1 = '', sc2 = '';
  const sw = w / n;
  for (let i = 0; i < n; i++) {
    const x = -w / 2 + i * sw, r = rect(x, 0, sw, h), sc = M(x, h) + Q(x + sw / 2, h + sw * 0.7, x + sw, h) + 'Z';
    if (i % 2) { s1 += r; sc1 += sc; } else { s2 += r; sc2 += sc; }
  }
  out.push(sh(s1, a), sh(s2, b), sh(sc1, a), sh(sc2, b), sh(rect(-w / 2, 0, w, h * 0.22), '#000000', { opacity: 0.18 }), sh(rect(-w / 2 - 6, -8, w + 12, 10, 3), WOOD));
  return out;
}
function goodsRow(x0: number, x1: number, y: number, g: Rng, r = 6): Shape[] {
  const cols = ['#f08a2b', '#d8362c', '#f6d23c', '#7fb069', '#9a5aa8', '#f3c6a8', '#3f8fa3', '#e8799f'];
  const out: Shape[] = [];
  for (let x = x0; x < x1; x += r * 3.2) {
    const c = g.pick(cols);
    let d = '';
    for (let k = 0; k < 3; k++) d += circle(x + (k - 1) * r * 0.9, y - (k === 1 ? r * 0.9 : 0), r);
    out.push(sh(d, c, { stroke: shade(c, -0.3), strokeWidth: 0.6 }));
  }
  return out;
}
{
  const g = rng(13);
  const palettes: [string, string][] = [['#c8322a', '#f6e6c8'], ['#2f6b8a', '#f2d27a'], ['#3f7d4e', '#f6e6c8'], ['#8a3a7a', '#f2b46a'], ['#c8642a', '#fbefd8']];
  for (let i = 0; i < 5; i++) {
    const cx = 120 + i * 245, w = 230;
    scene(sh(rect(cx - w / 2, 470, w, 200), `url(#${ID}-stall)`), glow(cx, 560, 140, 0.6));
    scene(sh(rect(cx - w / 2 + 10, 520, w - 20, 8), WOOD_L), goodsRow(cx - w / 2 + 18, cx + w / 2 - 10, 516, g, 6));
    scene(sh(rect(cx - w / 2 + 10, 580, w - 20, 8), WOOD_L), goodsRow(cx - w / 2 + 18, cx + w / 2 - 10, 576, g, 7));
    scene(sh(rect(cx - w / 2, 630, w, 50), WOOD), sh(rect(cx - w / 2, 630, w, 6), WOOD_L));
    scene(sh(rect(cx - w / 2 - 4, 452, 8, 230) + rect(cx + w / 2 - 4, 452, 8, 230), '#3a2418'));
    scene(place(awning(w + 10, 34, palettes[i][0], palettes[i][1], 9), { x: cx, y: 452 }));
  }
}

// =====================================================================
// strings of lanterns across the top
// =====================================================================
function lanternString(a: Pt, b: Pt, sag: number, n: number, seed: number, r = 16): Shape[] {
  const g = rng(seed), cols = ['#d8362c', '#f08a2b', '#f6c23c', '#e8508a', '#c8322a'];
  const at = (t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t + Math.sin(Math.PI * t) * sag];
  const pts: Pt[] = [];
  for (let i = 0; i <= 24; i++) pts.push(at(i / 24));
  const out: Shape[] = [stroke(line(pts), '#2a1a22', 1.6)];
  for (let i = 0; i < n; i++) {
    const p = at((i + 0.5) / n), rr = r * g.range(0.85, 1.15);
    out.push(glow(p[0], p[1] + 10 + rr, rr * 3, 0.55), ...place(paperLantern(rr, g.pick(cols), 10 + g.range(0, 10)), { x: p[0], y: p[1] }));
  }
  return out;
}
scene(lanternString([-10, 40], [1210, 70], 120, 11, 5, 18));
scene(lanternString([-10, 250], [1210, 230], 70, 13, 9, 14));
target('butterfly', 'Butterfly', place(butterfly(42, '#f2a33c'), { x: 846, y: 186, rot: 14 }));

// =====================================================================
// front left stall: fruit & spices
// =====================================================================
function crate(w: number, h: number, col = '#9a6a42'): Shape[] {
  return [sh(rect(-w / 2, -h, w, h), col), sh(rect(-w / 2, -h, w, h * 0.16), shade(col, 0.2)), stroke(line([[-w / 2, -h * 0.5], [w / 2, -h * 0.5]]), shade(col, -0.35), 1.4), sh(rect(-w / 2, -h, 6, h) + rect(w / 2 - 6, -h, 6, h), shade(col, -0.2))];
}
function fruitHeap(w: number, r: number, cols: string[], seed: number, rows = 3): Shape[] {
  const g = rng(seed), out: Shape[] = [];
  for (let row = rows - 1; row >= 0; row--) {
    const span = w - r - row * r * 1.4, n = Math.max(1, Math.round(span / (r * 1.8)));
    for (let i = 0; i < n; i++) {
      const x = n === 1 ? 0 : -span / 2 + (span * i) / (n - 1), y = -r * 0.5 - row * r * 1.2, c = g.pick(cols), rr = r * g.range(0.9, 1.08);
      out.push(ol(circle(x + g.range(-2, 2), y, rr), c, 0.8, -0.3), sh(ellipse(x - rr * 0.35, y - rr * 0.35, rr * 0.3, rr * 0.18, -30), '#ffffff', { opacity: 0.35 }));
    }
  }
  return out;
}
function spiceBowl(w: number, col: string): Shape[] {
  return [
    ol(M(-w * 0.42, -w * 0.12) + Q(-w * 0.3, -w * 0.62, 0, -w * 0.64) + Q(w * 0.3, -w * 0.62, w * 0.42, -w * 0.12) + 'Z', col, 0.8, -0.25),
    sh(ellipse(-w * 0.1, -w * 0.4, w * 0.1, w * 0.06), shade(col, 0.3), { opacity: 0.6 }), ol(M(-w / 2, -w * 0.14) + L(w / 2, -w * 0.14) + Q(w * 0.4, w * 0.06, 0, w * 0.06) + Q(-w * 0.4, w * 0.06, -w / 2, -w * 0.14) + 'Z', '#b8643a', 1),
    stroke(line([[-w / 2, -w * 0.09], [w / 2, -w * 0.09]]), '#f2d27a', 1.6),
  ];
}
function sack(w: number, h: number, fill: string, col = '#c9a878'): Shape[] {
  return [
    shadow(0, 0, w * 0.55, 6), ol(blob([[-w * 0.46, 0], [-w * 0.52, -h * 0.5], [-w * 0.42, -h * 0.86], [w * 0.42, -h * 0.86], [w * 0.52, -h * 0.5], [w * 0.46, 0]], 0.8), col, 1, -0.3),
    sh(blob([[-w * 0.5, -h * 0.84], [-w * 0.3, -h * 0.98], [w * 0.3, -h * 0.98], [w * 0.5, -h * 0.84], [0, -h * 0.76]], 0.8), shade(col, 0.15)),
    sh(ellipse(0, -h * 0.88, w * 0.4, h * 0.08), fill), sh(blob([[-w * 0.3, -h * 0.9], [0, -h * 1.08], [w * 0.3, -h * 0.9]], 0.9), fill),
    stroke(curve([[-w * 0.4, -h * 0.3], [0, -h * 0.25], [w * 0.4, -h * 0.3]]) + curve([[-w * 0.44, -h * 0.55], [0, -h * 0.5], [w * 0.44, -h * 0.55]]), shade(col, -0.2), 0.9),
  ];
}
function basket(w: number, h: number, col = '#c99a5b'): Shape[] {
  let wv = '';
  for (let i = 1; i < 4; i++) wv += line([[-w / 2 + i * 2, -h + (h * i) / 4], [w / 2 - i * 2, -h + (h * i) / 4]]);
  for (let i = 1; i < 9; i++) wv += line([[-w / 2 + (w * i) / 9, -h], [-w * 0.42 + (w * 0.84 * i) / 9, 0]]);
  return [shadow(0, 0, w * 0.5, 6), ol(poly([[-w / 2, -h], [w / 2, -h], [w * 0.42, 0], [-w * 0.42, 0]]), col, 1), stroke(wv, shade(col, -0.3), 1), sh(rect(-w / 2 - 3, -h - 5, w + 6, 9, 4), shade(col, 0.15))];
}
{
  const x0 = 14, x1 = 590, top = 590;
  // back panel & shelves
  scene(sh(rect(x0, top, x1 - x0, 330), '#6a3626'), glow(300, 760, 280, 0.5));
  let planks = '';
  for (let x = x0 + 40; x < x1; x += 46) planks += line([[x, top], [x, top + 330]]);
  scene(stroke(planks, '#55291c', 2));
  scene(sh(rect(x0 + 10, 780, x1 - x0 - 20, 12), WOOD_L), sh(rect(x0 + 10, 792, x1 - x0 - 20, 4), '#3a2418'));
  {
    const g = rng(21), jc = ['#d8362c', '#f6c23c', '#c8642a', '#7a4a2a', '#5c8a45', '#e8a03a'];
    for (let i = 0; i < 13; i++) {
      const jx = x0 + 34 + i * 42, jh = g.range(38, 52), c = g.pick(jc);
      if (i === 6) continue;
      scene(sh(rect(jx - 14, 780 - jh, 28, jh, 5), '#e8f0f0', { opacity: 0.55, stroke: '#a8b8b8', strokeWidth: 0.8 }), sh(rect(jx - 12, 780 - jh * 0.75, 24, jh * 0.72, 4), c), sh(rect(jx - 15, 774 - jh, 30, 8, 2), g.pick(['#3a2418', '#c9a24a'])));
    }
  }
  target('candle', 'Candle', place(candle(40, '#f4e2c0'), { x: x0 + 34 + 6 * 42, y: 780 }));
  // hanging bar with chillies, garlic, bunches and lanterns
  scene(sh(rect(x0, 640, x1 - x0, 8), '#3a2418'));
  {
    const g = rng(23);
    const hang = (x: number, len: number) => stroke(line([[x, 646], [x, 646 + len]]), '#3a2a22', 1.2);
    let ch = '';
    for (let i = 0; i < 14; i++) ch += leaf(70 + g.range(-5, 5), 664 + i * 6, g.range(14, 22), 3.4, g.pick([60, 120, 75, 105]));
    scene(hang(70, 16), sh(ch, '#c8322a'));
    let gar = '';
    for (let i = 0; i < 5; i++) gar += ellipse(140 + (i % 2 ? 7 : -7), 668 + i * 13, 9, 8);
    scene(hang(140, 16), ol(gar, '#f4ecd8', 0.8, -0.2));
    let ban = '';
    for (let i = 0; i < 6; i++) ban += xf(M(0, 0) + Q(-14, 30, 4, 56) + Q(-4, 30, 6, 0) + 'Z', { x: 470 + i * 6, y: 664, rot: -20 + i * 8 });
    scene(hang(486, 18), ol(ban, '#f2c84a', 0.8, -0.3));
    scene(place(paperLantern(17, '#d8362c', 14), { x: 220, y: 646 }), glow(220, 690, 50, 0.6), place(paperLantern(15, '#f6c23c', 18), { x: 540, y: 646 }), glow(540, 692, 44, 0.6));
    let herbs = '';
    for (let i = 0; i < 8; i++) herbs += leaf(420, 664, g.range(30, 48), 5, 90 + g.range(-20, 20));
    scene(hang(420, 18), sh(herbs, '#6f8f5c'));
  }
  target('wind-chime', 'Wind chime', place(windChime(66), { x: 340, y: 700 }));
  // posts & awning
  scene(sh(rect(x0, top - 20, 16, 640) + rect(x1 - 16, top - 20, 16, 640), '#3a2418'), sh(rect(x0 + 4, top - 20, 4, 640) + rect(x1 - 12, top - 20, 4, 640), '#5a3a28'));
  scene(place(awning(x1 - x0 + 30, 60, '#c8322a', '#f6e6c8', 14), { x: (x0 + x1) / 2, y: 572 }));
  // counter with crates, fruit and spice bowls
  const cy = 920;
  scene(place(fruitHeap(110, 15, ['#f08a2b', '#f39a3a', '#ee7d22'], 31), { x: 90, y: cy - 30 }), place(crate(120, 34), { x: 90, y: cy }));
  scene(place(fruitHeap(110, 14, ['#c8322a', '#d8362c', '#a82a2a', '#e04a34'], 33), { x: 216, y: cy - 30 }), place(crate(120, 34, '#8a5a38'), { x: 216, y: cy }));
  scene(place(fruitHeap(116, 16, ['#f2c84a', '#e0a83a', '#d8b03a'], 35), { x: 344, y: cy - 30 }), place(crate(124, 34), { x: 344, y: cy }));
  target('pineapple', 'Pineapple', place(pineapple(70), { x: 318, y: cy - 58 }));
  scene(place(fruitHeap(110, 13, ['#6a3a7a', '#7a4a96', '#59347a'], 37), { x: 472, y: cy - 30 }), place(crate(116, 34, '#8a5a38'), { x: 472, y: cy }));
  scene(sh(leaf(150, cy - 70, 40, 10, -150), '#4f7a3f'), sh(leaf(410, cy - 72, 38, 10, -30), '#5c8f4f'));
  scene(sh(rect(x0 - 4, cy, x1 - x0 + 8, 18, 3), WOOD_L), sh(rect(x0 - 4, cy, x1 - x0 + 8, 5, 2), '#9a6a48'));
  // counter front: woven panel
  scene(sh(rect(x0, cy + 18, x1 - x0, 230), WOOD));
  let wv = '';
  for (let y = cy + 30; y < cy + 240; y += 18) wv += line([[x0 + 8, y], [x1 - 8, y]]);
  for (let x = x0 + 20; x < x1; x += 28) wv += line([[x, cy + 22], [x, cy + 244]]);
  scene(stroke(wv, '#7a4a30', 1.6));
  // spice bowls row on a low step
  scene(sh(rect(x0 - 10, cy + 150, x1 - x0 + 20, 14, 2), '#8a5a3a'), sh(rect(x0 - 10, cy + 164, x1 - x0 + 20, 6), '#3a2418'));
  const spices = ['#e8a32c', '#c8322a', '#d8642a', '#7a8a3a', '#8a4a2a', '#f2c84a', '#a8402a', '#5a6a2a'];
  for (let i = 0; i < 8; i++) scene(place(spiceBowl(58, spices[i]), { x: 50 + i * 70, y: cy + 150 }));
  // sacks in front
  scene(place(sack(110, 110, '#c8642a'), { x: 90, y: 1250 }), place(sack(120, 120, '#e8a32c', '#d3b68a'), { x: 220, y: 1262 }), place(sack(104, 100, '#6a3a2a'), { x: 470, y: 1248 }));
  scene(place(basket(130, 70, '#c99a5b'), { x: 352, y: 1266 }), place(fruitHeap(110, 13, ['#7fb069', '#8fc069', '#6a9a4a'], 41, 2), { x: 352, y: 1192 }));
  target('straw-hat', 'Straw hat', place(strawHat(96, '#c8322a'), { x: 214, y: 1146, rot: -8 }));
}

// =====================================================================
// front right stall: fabrics, pottery & souvenirs
// =====================================================================
function scarf(w: number, h: number, a: string, b: string, kind: number): Shape[] {
  const out: Shape[] = [ol(M(-w / 2, 0) + L(w / 2, 0) + L(w / 2 - 2, h) + L(-w / 2 + 2, h) + 'Z', a, 0.8, -0.3)];
  if (kind === 0) { let st = ''; for (let y = 10; y < h; y += 22) st += rect(-w / 2 + 1, y, w - 2, 8); out.push(sh(st, b)); }
  else if (kind === 1) { let d = ''; for (let y = 14; y < h; y += 20) for (let x = -w / 2 + 8; x < w / 2; x += 14) d += circle(x + ((y / 20) % 2) * 6, y, 3); out.push(sh(d, b)); }
  else { let d = ''; for (let y = 18; y < h; y += 30) d += xf(poly([[0, -10], [8, 0], [0, 10], [-8, 0]]), { y }); out.push(sh(d, b), stroke(line([[-w / 2 + 4, 0], [-w / 2 + 4, h]]) + line([[w / 2 - 4, 0], [w / 2 - 4, h]]), b, 2)); }
  let fr = '';
  for (let x = -w / 2 + 3; x < w / 2; x += 5) fr += line([[x, h], [x, h + 9]]);
  out.push(stroke(fr, a, 1.4), sh(rect(-w / 2, -3, w, 8, 2), shade(a, -0.2)));
  return out;
}
function vase(w: number, h: number, col: string, band: string, kind: number): Shape[] {
  let body: string;
  if (kind === 0) body = M(-w * 0.2, -h) + L(w * 0.2, -h) + Q(w * 0.16, -h * 0.75, w * 0.5, -h * 0.45) + Q(w * 0.6, -h * 0.05, w * 0.3, 0) + L(-w * 0.3, 0) + Q(-w * 0.6, -h * 0.05, -w * 0.5, -h * 0.45) + Q(-w * 0.16, -h * 0.75, -w * 0.2, -h) + 'Z';
  else if (kind === 1) body = M(-w * 0.3, -h) + L(w * 0.3, -h) + Q(w * 0.5, -h * 0.5, w * 0.36, 0) + L(-w * 0.36, 0) + Q(-w * 0.5, -h * 0.5, -w * 0.3, -h) + 'Z';
  else body = M(-w / 2, -h) + L(w / 2, -h) + Q(w * 0.44, -h * 0.2, w * 0.2, 0) + L(-w * 0.2, 0) + Q(-w * 0.44, -h * 0.2, -w / 2, -h) + 'Z';
  const by = kind === 2 ? -h * 0.75 : -h * 0.48;
  const out = [ol(body, col, 1, -0.35), sh(rect(-w * 0.45, by, w * 0.9, h * 0.1), band, { opacity: 0.9 }), sh(ellipse(-w * 0.18, -h * 0.5, w * 0.06, h * 0.18), '#ffffff', { opacity: 0.25 })];
  if (kind === 0) out.push(sh(ellipse(0, -h, w * 0.22, h * 0.04), shade(col, -0.4)));
  if (kind === 2) out.push(sh(ellipse(0, -h, w / 2, h * 0.08), shade(col, -0.4)));
  return out;
}
{
  const x0 = 620, x1 = 1188, top = 600;
  scene(sh(rect(x0, top, x1 - x0, 360), '#2f3a5a'), glow(900, 780, 300, 0.45));
  // fabric rail with scarves
  scene(sh(rect(x0 + 10, 650, 300, 8, 3), GOLD));
  const fab: [string, string][] = [['#c8322a', '#f2c84a'], ['#2f8a8a', '#f6e6c8'], ['#f2a33c', '#8a2a5a'], ['#6a3a8a', '#f2c84a'], ['#3f7d4e', '#f2a33c'], ['#e8508a', '#fbefd8'], ['#2f4a8a', '#e8a32c']];
  for (let i = 0; i < 7; i++) scene(place(scarf(40, 210 + (i % 3) * 26, fab[i][0], fab[i][1], i % 3), { x: x0 + 34 + i * 42, y: 654 }));
  target('kite', 'Kite', place(kite(64, '#2f8a8a', '#f2c84a'), { x: x0 + 140, y: 760, rot: 8 }));
  // shelves of pottery
  const sx = x0 + 330;
  scene(sh(rect(sx, 760, x1 - sx - 14, 10), WOOD_L), sh(rect(sx, 870, x1 - sx - 14, 10), WOOD_L), sh(rect(sx, 770, x1 - sx - 14, 3) + rect(sx, 880, x1 - sx - 14, 3), '#2a1a12'));
  {
    const g = rng(51), pc = ['#3f7fa8', '#c8642a', '#2f8a8a', '#e8c79a', '#8a3a2a', '#f2e6c8'], bands = ['#f2c84a', '#fbefd8', '#2f4a6a', '#c8322a'];
    let x = sx + 22;
    for (let i = 0; i < 6; i++) { const w = g.range(30, 44); if (i !== 3) scene(place(vase(w, g.range(48, 70), g.pick(pc), g.pick(bands), i % 3), { x: x + w / 2, y: 760 })); x += w + 10; }
    x = sx + 18;
    for (let i = 0; i < 6; i++) { const w = g.range(32, 46); if (i !== 2) scene(place(vase(w, g.range(44, 64), g.pick(pc), g.pick(bands), (i + 1) % 3), { x: x + w / 2, y: 870 })); x += w + 8; }
    // plates leaning at the back of the top shelf
    scene(ol(circle(sx + 150, 684, 30), '#f2e6c8', 1), stroke(circle(sx + 150, 684, 22), '#2f4a8a', 3), sh(star(sx + 150, 684, 12, 5, 8), '#c8322a'));
    scene(ol(circle(sx + 70, 690, 26), '#3f7fa8', 1), stroke(circle(sx + 70, 690, 18), '#f2c84a', 2.4), sh(circle(sx + 70, 690, 7), '#fbefd8'));
  }
  target('teapot', 'Teapot', place(teapot(56, '#2f8a8a'), { x: sx + 168, y: 760 }));
  target('elephant', 'Elephant figurine', place(elephant(54, '#c9a06a'), { x: sx + 102, y: 870 }));
  // hanging mask on the post
  scene(sh(rect(x1 - 30, 640, 6, 6), '#3a2418'));
  // posts & awning
  scene(sh(rect(x0, top - 20, 16, 640) + rect(x1 - 16, top - 20, 16, 640), '#3a2418'), sh(rect(x0 + 4, top - 20, 4, 640) + rect(x1 - 12, top - 20, 4, 640), '#5a3a28'));
  scene(place(awning(x1 - x0 + 30, 60, '#2f6b8a', '#f2d27a', 13), { x: (x0 + x1) / 2, y: 572 }));
  target('mask', 'Masquerade mask', place(mask(64, '#8a2a5a'), { x: x1 - 50, y: 700, rot: -6 }));
  scene(place(paperLantern(16, '#f08a2b', 12), { x: 980, y: 646 }), glow(980, 690, 48, 0.6));
  // counter with souvenirs
  const cy = 960;
  scene(sh(rect(x0 - 4, cy, x1 - x0 + 8, 18, 3), WOOD_L), sh(rect(x0 - 4, cy, x1 - x0 + 8, 5, 2), '#9a6a48'));
  {
    const g = rng(57);
    // trinket tray
    scene(ol(rect(660, 930, 230, 30, 4), '#7a2a2a', 1), sh(rect(664, 934, 222, 6), '#9a3a3a'));
    let beads = '';
    for (let i = 0; i < 16; i++) beads += circle(680 + i * 6, 948 + Math.sin(i / 2) * 5, 3);
    scene(sh(beads, '#2f8a8a'), sh(circle(830, 944, 8), '#f2c84a'), sh(circle(850, 948, 7), '#c8322a'), ol(rect(864, 936, 18, 14, 2), '#3f7fa8', 0.8));
    // little boxes & figurines
    for (let i = 0; i < 5; i++) { const bx = 920 + i * 48; scene(ol(rect(bx - 16, cy - 26 - (i % 2) * 6, 32, 26 + (i % 2) * 6, 3), g.pick(['#c8322a', '#2f6b8a', '#e2b44a', '#3f7d4e', '#8a3a7a']), 1), sh(rect(bx - 16, cy - 20 - (i % 2) * 6, 32, 4), GOLD)); }
    scene(ol(rect(1140, cy - 70, 26, 70, 3), '#6a4a3a', 1), sh(circle(1153, cy - 80, 12), '#e2b44a'));
  }
  target('compass', 'Compass', place(compass(17), { x: 744, y: 926 }));
  target('sunglasses', 'Sunglasses', place(sunglasses(62, '#7a2a2a'), { x: 1010, y: 914, rot: 4 }));
  // draped rug over the counter front
  scene(sh(rect(x0, cy + 18, x1 - x0, 240), '#8a2a3a'));
  {
    let d1 = '', d2 = '';
    for (let i = 0; i < 9; i++) { const x = x0 + 32 + i * 64; d1 += xf(poly([[0, -40], [26, 0], [0, 40], [-26, 0]]), { x, y: cy + 120 }); d2 += xf(star(0, 0, 12, 5, 8), { x, y: cy + 120 }); }
    let zig = '', dots = '';
    for (let x = x0 + 12; x < x1 - 12; x += 16) { zig += M(x, cy + 66) + L(x + 8, cy + 56) + L(x + 16, cy + 66) + M(x, cy + 184) + L(x + 8, cy + 174) + L(x + 16, cy + 184); dots += circle(x + 8, cy + 48, 2.4) + circle(x + 8, cy + 220, 2.4); }
    for (let i = 0; i < 8; i++) dots += circle(x0 + 64 + i * 64, cy + 120, 5);
    scene(sh(rect(x0 + 10, cy + 30, x1 - x0 - 20, 12) + rect(x0 + 10, cy + 200, x1 - x0 - 20, 12), '#e2b44a'), stroke(zig, '#f2a33c', 2), sh(d1, '#2f4a6a'), sh(d2, '#f2d27a'), sh(dots, '#fbefd8'));
    let fr = '';
    for (let x = x0 + 4; x < x1; x += 8) fr += line([[x, cy + 258], [x, cy + 270]]);
    scene(stroke(fr, '#e2b44a', 2));
  }
}

// =====================================================================
// foreground: cobbles, mats, pots, baskets
// =====================================================================
{
  const g = rng(61);
  for (let r = 0; r < 9; r++) {
    const y = 1240 + r * 30, h = 18 + r * 1.6, w = 46 + r * 4;
    for (let x = -((r * 23) % w); x < W; x += w + 4) scene(sh(rect(x, y, w, h, 7), g.pick(['#7a6470', '#6e5a66', '#86707a', '#5e4c58']), { stroke: '#3e3040', strokeWidth: 1 }));
  }
  // warm light pooling on the stones
  scene(sh(ellipse(300, 1300, 300, 60), '#ffc46a', { opacity: 0.12 }), sh(ellipse(900, 1310, 300, 60), '#ffc46a', { opacity: 0.12 }));
}
{
  // left: big woven mat with pottery
  scene(sh(poly([[20, 1330], [430, 1330], [470, 1480], [-20, 1480]]), '#c9a060'), stroke(poly([[34, 1340], [418, 1340], [452, 1470], [0, 1470]]), '#8a5a2a', 3));
  let mw = '';
  for (let y = 1352; y < 1470; y += 14) mw += line([[10, y], [452, y]]);
  scene(stroke(mw, '#a8783a', 1.4));
  scene(place(vase(90, 120, '#c8642a', '#f2d27a', 0), { x: 90, y: 1430 }), place(vase(70, 80, '#3f7fa8', '#fbefd8', 1), { x: 190, y: 1450 }), place(vase(80, 60, '#e8c79a', '#2f4a6a', 2), { x: 300, y: 1450 }));
  scene(place(vase(60, 96, '#8a3a2a', '#f2c84a', 0), { x: 390, y: 1440 }));
  target('seashell', 'Seashell', place(seashell(44, '#f3c6a8'), { x: 250, y: 1386, rot: -10 }));
  scene(ol(ellipse(120, 1360, 32, 10), '#3f7fa8', 1), ol(ellipse(130, 1356, 28, 8), '#f2e6c8', 1));
}
{
  // centre: crate, ground lantern, stool with fan
  scene(place(crate(140, 90, '#8a5a38'), { x: 610, y: 1400 }), place(fruitHeap(126, 16, ['#f08a2b', '#f6d23c', '#c8322a'], 71, 2), { x: 610, y: 1318 }));
  scene(glow(560, 1440, 90, 0.7), ol(rect(530, 1400, 60, 76, 6), '#3a2418', 1), sh(rect(538, 1410, 44, 56, 3), '#ffc46a'), stroke(line([[560, 1410], [560, 1466]]) + line([[538, 1438], [582, 1438]]), '#3a2418', 3), sh(poly([[524, 1402], [596, 1402], [560, 1376]]), '#3a2418'));
  scene(shadow(760, 1470, 50, 8), sh(rect(724, 1420, 8, 50) + rect(788, 1420, 8, 50), WOOD), ol(ellipse(760, 1418, 50, 12), WOOD_L, 1));
  target('paper-fan', 'Paper fan', place(paperFan(66, '#c8322a', '#f6e6c8'), { x: 752, y: 1398, rot: -6 }));
  target('spinning-top', 'Spinning top', place(spinningTop(48), { x: 680, y: 1484 }));
}
{
  // right: baskets and a sleepy cat on a rug
  scene(sh(poly([[860, 1340], [1200, 1340], [1200, 1490], [830, 1490]]), '#2f4a6a'), stroke(poly([[872, 1350], [1200, 1350], [1200, 1478], [846, 1478]]), '#e2b44a', 3));
  scene(place(basket(120, 64, '#b98b5a'), { x: 940, y: 1440 }), place(fruitHeap(104, 12, ['#7fb069', '#f2c84a'], 73, 2), { x: 940, y: 1376 }));
  scene(place(basket(110, 60, '#c99a5b'), { x: 1080, y: 1450 }), place(fruitHeap(96, 12, ['#d8362c', '#a82a2a'], 75, 2), { x: 1080, y: 1390 }));
  const c = '#3a3036';
  scene(shadow(1110, 1340, 60, 8), sh(blob([[1050, 1336], [1060, 1306], [1110, 1292], [1160, 1300], [1176, 1330], [1150, 1340], [1070, 1342]], 0.9), c), sh(circle(1062, 1316, 20), c), sh(poly([[1046, 1306], [1050, 1284], [1062, 1298]]) + poly([[1068, 1298], [1078, 1282], [1080, 1302]]), c), stroke(curve([[1054, 1318], [1058, 1321], [1062, 1318]]) + curve([[1066, 1318], [1070, 1321], [1074, 1318]]), '#e2b44a', 1.4), stroke(M(1174, 1330) + Q(1200, 1340, 1186, 1300), c, 6));
}
void blob; void mix; void sector; void curve;

const activity: FindActivity = {
  id: ID, version: 1, mode: 'find', title: 'Night Market',
  blurb: 'Wander the lantern-lit stalls at dusk and look for fourteen little finds among the fruit, spices, fabrics and pottery.',
  collectionId: 'travel', categories: ['Travel', 'Food'], difficulty: 'Detailed',
  width: W, height: H, defs, items,
};
export default activity;
