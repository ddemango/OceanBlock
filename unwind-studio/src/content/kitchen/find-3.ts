import { rect, ellipse, circle, poly, line, curve, leaf, sh, stroke, place, shade, rng, linearGradient } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { FindActivity, FindItem } from '../types';
import {
  M, L, Q, ol, shadow, P, planks, edging, plate, bowl, jug, jar, tin, spiceJar, bottle, basket, basketHandle, sack, crate, pile, veg, leek, cabbage,
  honeyPot, garlic, chilli, mushroom, apple, ladybird, candle, twine, pumpkin, cornCob, teapot, measuringJug, mouse, pear, peapod, type Veg,
} from './props-find';

const ID = 'kitchen-find-3';
const W = 1200, H = 1500;
const items: FindItem[] = [];
const scene = (...s: (Shape | Shape[])[]) => { items.push({ shapes: s.flat() }); };
const target = (id: string, name: string, shapes: Shape[]) => { items.push({ id, name, target: true, shapes }); };

const defs = linearGradient(`${ID}-glow`, [[0, '#fbf3df'], [1, '#efe2c4']]);

// =====================================================================
// local props
// =====================================================================
function butternut(s: number, rot: number): Shape[] {
  const d = M(-s * 0.5, -s * 0.06) + Q(-s * 0.5, -s * 0.2, -s * 0.3, -s * 0.18) + Q(-s * 0.05, -s * 0.14, s * 0.12, -s * 0.24) + Q(s * 0.5, -s * 0.34, s * 0.5, 0) + Q(s * 0.5, s * 0.34, s * 0.12, s * 0.24) + Q(-s * 0.05, s * 0.14, -s * 0.3, s * 0.18) + Q(-s * 0.5, s * 0.2, -s * 0.5, -s * 0.06) + 'Z';
  return place([ol(d, '#e8b870', 1.2, -0.3), sh(ellipse(s * 0.24, 0, s * 0.12, s * 0.1), '#d9a050'), sh(rect(-s * 0.6, -s * 0.04, s * 0.12, s * 0.08, 2), '#6b5a2a'), sh(ellipse(-s * 0.2, -s * 0.08, s * 0.16, s * 0.03), '#ffffff', { opacity: 0.35 })], { rot });
}
function parcel(w: number, h: number): Shape[] {
  return [ol(rect(-w / 2, -h, w, h, 2), '#c9a070', 1, -0.3), sh(rect(w * 0.2, -h, w * 0.3, h), '#000000', { opacity: 0.07 }), stroke(line([[-w * 0.1, -h], [-w * 0.1, 0]]) + line([[-w / 2, -h * 0.5], [w / 2, -h * 0.5]]), '#f2e6cc', 2), stroke(M(-w * 0.1, -h) + Q(-w * 0.3, -h - 10, -w * 0.2, -h - 4) + M(-w * 0.1, -h) + Q(w * 0.1, -h - 10, 0, -h - 4), '#f2e6cc', 2)];
}
function scales(s: number): Shape[] {
  return [ol(rect(-s * 0.5, -s * 0.2, s, s * 0.2, 4), P.tomato, 1.2), sh(rect(-s * 0.5, -s * 0.2, s, s * 0.05, 3), shade(P.tomato, 0.2)), sh(rect(-s * 0.05, -s * 0.42, s * 0.1, s * 0.22), P.tomato), ol(M(-s * 0.48, -s * 0.48) + L(s * 0.1, -s * 0.48) + Q(s * 0.06, -s * 0.36, -s * 0.19, -s * 0.36) + Q(-s * 0.44, -s * 0.36, -s * 0.48, -s * 0.48) + 'Z', '#c9a24a', 1.2, -0.35), ol(rect(s * 0.16, -s * 0.48, s * 0.3, s * 0.06, 2), '#c9a24a', 1, -0.35), ol(rect(s * 0.2, -s * 0.6, s * 0.12, s * 0.12, 2) + rect(s * 0.34, -s * 0.56, s * 0.09, s * 0.08, 2), '#8a8f94', 0.8, -0.35)];
}
function demijohn(h: number, col: string): Shape[] {
  const d = M(-h * 0.1, -h) + L(h * 0.1, -h) + L(h * 0.1, -h * 0.84) + Q(h * 0.44, -h * 0.76, h * 0.42, -h * 0.4) + Q(h * 0.42, 0, 0, 0) + Q(-h * 0.42, 0, -h * 0.42, -h * 0.4) + Q(-h * 0.44, -h * 0.76, -h * 0.1, -h * 0.84) + 'Z';
  let wick = '';
  for (let i = 0; i < 7; i++) wick += line([[-h * 0.4 + i * h * 0.13, -h * 0.02], [-h * 0.38 + i * h * 0.12, -h * 0.4]]);
  return [sh(d, col, { opacity: 0.85 }), stroke(d, shade(col, -0.35), 1.2), sh(M(-h * 0.42, -h * 0.42) + L(h * 0.42, -h * 0.42) + Q(h * 0.42, 0, 0, 0) + Q(-h * 0.42, 0, -h * 0.42, -h * 0.42) + 'Z', '#c9a070'), stroke(wick + line([[-h * 0.42, -h * 0.22], [h * 0.42, -h * 0.22]]), '#8a6a3a', 1.2), sh(rect(-h * 0.3, -h * 0.72, h * 0.06, h * 0.26, 2), '#ffffff', { opacity: 0.4 }), ol(rect(-h * 0.08, -h * 1.06, h * 0.16, h * 0.08, 2), '#c99a6a', 0.8)];
}
function crock(w: number, h: number, col: string, band: string): Shape[] {
  return [ol(M(-w * 0.42, -h) + L(w * 0.42, -h) + Q(w * 0.54, -h * 0.5, w * 0.42, 0) + L(-w * 0.42, 0) + Q(-w * 0.54, -h * 0.5, -w * 0.42, -h) + 'Z', col, 1.2), sh(rect(-w * 0.48, -h * 0.66, w * 0.96, h * 0.1), band), ol(ellipse(0, -h, w * 0.44, h * 0.08), shade(col, -0.1), 1), ol(M(-w * 0.4, -h) + Q(0, -h * 1.26, w * 0.4, -h) + 'Z', shade(col, 0.05), 1), sh(circle(0, -h * 1.16, w * 0.06), band), sh(rect(-w * 0.34, -h * 0.9, w * 0.06, h * 0.76, 2), '#ffffff', { opacity: 0.3 })];
}
function coffeePot(s: number, col: string): Shape[] {
  return [stroke(M(s * 0.22, -s * 0.8) + Q(s * 0.5, -s * 0.76, s * 0.44, -s * 0.4) + Q(s * 0.4, -s * 0.24, s * 0.22, -s * 0.22), shade(col, -0.25), s * 0.06), ol(M(-s * 0.22, -s * 0.66) + Q(-s * 0.4, -s * 0.74, -s * 0.48, -s * 0.9) + L(-s * 0.42, -s * 0.92) + Q(-s * 0.34, -s * 0.8, -s * 0.2, -s * 0.78) + 'Z', col, 1), ol(M(-s * 0.2, -s * 0.9) + L(s * 0.2, -s * 0.9) + L(s * 0.28, 0) + L(-s * 0.28, 0) + 'Z', col, 1.2), ol(M(-s * 0.2, -s * 0.9) + Q(0, -s * 1.06, s * 0.2, -s * 0.9) + 'Z', shade(col, 0.1), 1), sh(circle(0, -s * 1.04, s * 0.04), '#3b2f2a'), sh(rect(-s * 0.26, -s * 0.3, s * 0.52, s * 0.06), '#fbf6e8')];
}
/** Stepped spice riser with two rows of little jars. */
function spiceRack(w: number, seed: number, avoidRed = false): Shape[] {
  const g = rng(seed);
  const cont = ['#c8562a', '#7a8a3a', '#e8c060', '#8a4a2a', '#b8742e', '#5c7a3a', '#d9a050', avoidRed ? '#a8682e' : '#b8302a'];
  const lids = ['#3b2f2a', P.tomato, '#c9d0d5', '#3b2f2a', P.cornflower];
  const out: Shape[] = [sh(rect(-w / 2, -40, w, 40), '#a8743e'), sh(rect(-w / 2, -40, w, 6), '#c99a62'), sh(rect(-w / 2, -80, w, 40), '#b98552'), sh(rect(-w / 2, -80, w, 6), '#d4a26c')];
  const n = Math.floor(w / 26);
  for (let row = 1; row >= 0; row--) for (let i = 0; i < n - row; i++) out.push(...place(spiceJar(20, g.range(30, 38), g.pick(cont), g.pick(lids)), { x: -w / 2 + 16 + row * 12 + i * 26, y: row ? -80 : -40 }));
  for (let i = 0; i < n; i++) out.push(...place(spiceJar(20, g.range(28, 34), g.pick(cont), g.pick(lids)), { x: -w / 2 + 16 + i * 26, y: 0 }));
  return out;
}
/** Jar of grains, pasta or beans. */
function grainJar(w: number, h: number, col: string, kind: number, seed: number, lid = '#c9d0d5'): Shape[] {
  const g = rng(seed);
  const out = jar(w, h, col, 1, lid, false);
  let d = '';
  for (let i = 0; i < 26; i++) { const x = g.range(-w * 0.4, w * 0.4), y = -g.range(h * 0.06, h * 0.82); d += kind === 0 ? circle(x, y, w * 0.05) : kind === 1 ? rect(x - w * 0.06, y - 1.5, w * 0.12, 3, 1.5) : ellipse(x, y, w * 0.06, w * 0.035, g.range(0, 180)); }
  out.splice(4, 0, sh(d, shade(col, kind === 2 ? -0.35 : 0.25)));
  return out;
}
function hangingBunch(x: number, y: number, len: number, seed: number, col: string): Shape[] {
  const g = rng(seed);
  let a = '', b = '';
  for (let i = 0; i < 11; i++) { const d = leaf(x + g.range(-3, 3), y + len * 0.4, g.range(len * 0.4, len * 0.62), 5, 90 + g.range(-28, 28)); if (i % 2) a += d; else b += d; }
  return [stroke(line([[x, y], [x, y + len * 0.42]]), '#8a7050', 1.3), sh(a, col), sh(b, shade(col, 0.18)), sh(rect(x - 5, y + len * 0.36, 10, 7, 2), '#c99a6a')];
}

// =====================================================================
// back wall, beam and hanging strings
// =====================================================================
scene(planks(0, 0, W, 1110, 14, '#efe4c8', 3, true), sh(rect(0, 0, W, 1110), '#6f8a62', { opacity: 0.06 }));
scene(planks(0, 0, W, 34, 1, '#7a5232', 5), sh(rect(0, 34, W, 8), '#3b2a1c', { opacity: 0.2 }));
{
  const g = rng(8);
  const o: Shape[] = [stroke(line([[300, 34], [300, 150]]) + line([[880, 34], [880, 150]]), '#b8a070', 1.6)];
  for (let i = 0; i < 7; i++) o.push(...veg(300 + (i % 2 ? 7 : -7), 54 + i * 14, 9, i % 3 ? 'onion' : 'redonion', g));
  for (let i = 0; i < 7; i++) o.push(...veg(880 + (i % 2 ? 7 : -7), 54 + i * 14, 9, i % 3 ? 'redonion' : 'onion', g));
  scene(o);
  for (const [x, s] of [[120, 1], [200, 2], [430, 3], [510, 4], [700, 5], [780, 6], [1000, 7], [1090, 8]] as [number, number][]) scene(hangingBunch(x, 34, 84 + (s % 3) * 10, s * 7, s % 2 ? '#7f9a5c' : '#9aa86a'));
}

// =====================================================================
// shelving: uprights, boards and paper edging
// =====================================================================
const shelfY = [210, 390, 570, 750, 930, 1110];
const xL = 40, xM = 592, xR = 1160;
scene(sh(rect(xL - 22, 150, 22, 990) + rect(xM, 150, 18, 990) + rect(xR, 150, 22, 990), '#8a5a34'), sh(rect(xL - 22, 150, 6, 990) + rect(xM, 150, 5, 990) + rect(xR, 150, 6, 990), '#b98552'));

// ----- shelf 1 (y 210): preserves | crockery and the teapot
{
  const y = 210;
  const pres: [number, number, number, string, string][] = [[80, 50, 76, '#c8322a', '#fbf3df'], [136, 46, 66, '#e8a03a', P.cornflower], [190, 52, 84, '#7d2f4a', '#f3d77a'], [246, 46, 70, '#d8452f', '#9cb48a'], [300, 50, 78, '#e8c060', P.tomato], [356, 46, 64, '#6b3f86', '#fbf3df'], [410, 50, 80, '#c8322a', P.cornflower]];
  for (const [x, w, h, c, cap] of pres) scene(place(jar(w, h, c, 0, cap), { x, y }));
  scene(place(tin(62, 110, '#fbf6e8', P.cornflower), { x: 480, y }), place(tin(46, 74, P.tomato, '#fbf3df'), { x: 544, y }));
  // right: plate rack, jugs, coffee pot, the teapot
  scene(stroke(line([[628, y - 4], [628, y - 120]]) + line([[760, y - 4], [760, y - 120]]), '#7a5232', 4), stroke(line([[628, y - 60], [760, y - 60]]), '#7a5232', 3));
  for (let i = 0; i < 5; i++) scene(place(plate(46, i % 2 ? '#fbf6e8' : '#f3ecd8', [P.cornflower, P.tomato, '#7f9f6a'][i % 3], i % 4), { x: 650 + i * 24, y: y - 50, sx: 0.32, sy: 1 }));
  scene(place(jug(76, '#8fae8a', '#fbf6e8'), { x: 812, y }), place(coffeePot(96, '#a9bf98'), { x: 880, y }));
  target('teapot', 'Teapot', place(teapot(84, '#9cb48a'), { x: 966, y }));
  scene(place(jug(62, '#fbf6e8', '#8fae8a'), { x: 1044, y }), place(bowl(70, 24, '#a9bf98', '#fbf6e8'), { x: 1112, y }), place(bowl(60, 22, '#fbf6e8', '#8fae8a'), { x: 1112, y: y - 24 }));
}
// ----- shelf 2 (y 390): honey jars and tins | tins, cake tin and jam with the ladybird
{
  const y = 390;
  const hon: [number, number, number][] = [[74, 46, 70], [126, 50, 84], [236, 44, 64], [290, 50, 80], [344, 46, 70]];
  for (const [x, w, h] of hon) scene(place(jar(w, h, '#e0a83a', x % 3 ? 1 : 0, x % 3 ? '#c9a24a' : '#fbf3df'), { x, y }));
  target('honey-pot', 'Honey pot', place(honeyPot(76), { x: 182, y }));
  scene(place(tin(56, 100, '#4f6f52', '#e8c060'), { x: 420, y }), place(tin(50, 70, P.tomato, '#f3d77a'), { x: 482, y }), place(tin(44, 56, P.cornflower, '#fbf3df'), { x: 540, y }));
  scene(place(tin(110, 50, '#e8c060', P.tomato), { x: 682, y }), place(tin(94, 44, P.cornflower, '#fbf3df'), { x: 682, y: y - 50 }), place(tin(48, 92, '#fbf6e8', P.tomato), { x: 774, y }), place(tin(48, 92, '#fbf6e8', P.cornflower), { x: 828, y }));
  scene(place(jar(50, 72, '#c8322a', 0, P.tomato), { x: 900, y }), place(jar(46, 64, '#d8452f', 0, '#fbf3df'), { x: 958, y }));
  target('ladybird', 'Ladybird', place(ladybird(34), { x: 900, y: y - 82, rot: 20 }));
  scene(place(jar(50, 76, '#7d2f4a', 0, P.tomato), { x: 1016, y }), place(bottle(30, 104, '#5a7a3a', '#c99a6a'), { x: 1070, y }), place(bottle(30, 90, '#c9a24a', '#3b2f2a'), { x: 1118, y }));
}
// ----- shelf 3 (y 570): spice rack with the chilli, parcels and twine | grain jars
{
  const y = 570;
  scene(place(spiceRack(270, 4, true), { x: 190, y }));
  target('chilli', 'Chilli', place(chilli(56), { x: 140, y: y - 98, rot: -14 }));
  scene(ol(rect(338, y - 80, 18, 80, 6), '#5a3a2a', 1), ol(circle(347, y - 84, 11), '#5a3a2a', 1));
  scene(place(parcel(92, 60), { x: 420, y }), place(parcel(70, 44), { x: 420, y: y - 60 }), place(parcel(60, 50), { x: 520, y }));
  target('twine', 'Ball of twine', place(twine(48), { x: 520, y: y - 76 }));
  scene(place(grainJar(60, 110, '#f2e6c8', 1, 3), { x: 650, y }), place(grainJar(56, 96, '#e8d8a8', 0, 4), { x: 716, y }), place(grainJar(56, 104, '#c8562a', 2, 5, '#3b2f2a'), { x: 780, y }), place(grainJar(52, 86, '#f6ecd0', 2, 6), { x: 842, y }), place(grainJar(56, 108, '#8a4a2a', 2, 7, P.tomato), { x: 904, y }), place(grainJar(52, 90, '#e8c060', 0, 8), { x: 966, y }));
  scene(place(crock(80, 90, '#fbf6e8', P.cornflower), { x: 1060, y }), place(bottle(26, 80, '#7d2f4a', '#3b2f2a'), { x: 1126, y }));
}
// ----- shelf 4 (y 750): pickles and oils with the measuring jug | fruit bowl with the pear
{
  const y = 750;
  const pick = (x: number, w: number, h: number) => { const g = rng(x); const o = jar(w, h, '#c9d8a0', 1, '#c9a24a', false); let c = ''; for (let i = 0; i < 6; i++) c += ellipse(-w * 0.24 + (i % 3) * w * 0.24, -h * 0.2 - Math.floor(i / 3) * h * 0.36, w * 0.1, h * 0.17, g.range(-10, 10)); o.splice(4, 0, sh(c, '#7a9a4a', { stroke: '#5a7a3a', strokeWidth: 0.8 })); return place(o, { x, y }); };
  scene(pick(80, 56, 100), pick(144, 52, 86));
  scene(place(bottle(32, 120, '#c9b84a', '#3b2f2a'), { x: 202, y }), place(bottle(28, 104, '#8a3a2a', '#c99a6a'), { x: 246, y }));
  target('measuring-jug', 'Measuring jug', place(measuringJug(84), { x: 310, y }));
  scene(pick(380, 54, 94), place(jar(48, 70, '#f2e6c8', 1, '#c9d0d5'), { x: 440, y }), place(jar(44, 60, '#ffffff', 1, '#c9d0d5'), { x: 494, y }), place(tin(44, 74, P.tomato, '#fbf3df'), { x: 548, y }));
  // right: fruit bowl with lemons, oranges and the pear; mortar; jam
  scene(place(pile(170, 20, ['orange', 'orange', 'plum'], 13, 2), { x: 720, y: y - 40 }));
  const g = rng(29);
  const lemons: Shape[] = [];
  for (const [x, yy, r] of [[660, y - 74, 18], [778, y - 70, 18], [700, y - 100, 17], [752, y - 104, 17]] as [number, number, number][]) lemons.push(ol(ellipse(x, yy, r * 1.2, r * 0.86, g.range(-30, 30)), '#f6d23c', 1, -0.28), sh(ellipse(x - r * 0.35, yy - r * 0.3, r * 0.4, r * 0.18), '#fff3a6', { opacity: 0.85 }));
  scene(lemons);
  target('pear', 'Pear', place(pear(46, '#c8cc4a'), { x: 726, y: y - 86, rot: 16 }));
  scene(place(bowl(190, 56, '#fbf6e8', P.tomato), { x: 720, y }));
  scene(ol(M(840, y - 60) + L(900, y - 60) + Q(900, y, 870, y) + Q(840, y, 840, y - 60) + 'Z', '#d9d0c0', 1, -0.3), stroke(line([[880, y - 54], [904, y - 100]]), '#a89a88', 7));
  scene(place(jar(50, 70, '#6b3f86', 0, '#f3d77a'), { x: 960, y }), place(jar(46, 62, '#e8a03a', 0, P.tomato), { x: 1014, y }), place(jar(50, 74, '#c8322a', 0, '#9cb48a'), { x: 1070, y }), place(spiceJar(24, 40, '#7a8a3a', '#3b2f2a'), { x: 1122, y }));
}
// ----- shelf 5 (y 930): egg baskets and the candle | bread crock and scales
{
  const y = 930;
  scene(place(basketHandle(150, 80), { x: 110, y: y - 46 }), place(pile(140, 15, ['egg', 'brownegg'], 3, 2), { x: 110, y: y - 46 }), place(basket(150, 46, '#c99a5b'), { x: 110, y: y - 46 }));
  scene(place(pile(120, 14, ['brownegg', 'egg'], 4, 2), { x: 270, y: y - 40 }), place(basket(130, 40, '#b98b5a'), { x: 270, y: y - 40 }));
  target('candle', 'Candle', place(candle(84), { x: 372, y }));
  scene(place(crock(84, 96, '#efe4c8', '#8a5a34'), { x: 452, y }), place(bowl(70, 26, '#fbf6e8', P.cornflower), { x: 540, y }), place(bowl(60, 22, '#f3d77a', '#fbf3df'), { x: 540, y: y - 26 }));
  scene(place(crock(130, 100, '#c9673f', '#fbf6e8'), { x: 700, y }), place(scales(130), { x: 860, y }), place(demijohn(110, '#9ab890'), { x: 1010, y }), place(jar(44, 60, '#e8a03a', 0, '#fbf3df'), { x: 1110, y }));
}
// ----- shelf 6 (y 1110): wine rack, preserving pan, cake tins | cheese, butter, stoneware
{
  const y = 1110;
  let ends = '', necks = '';
  for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) { const cx = 80 + c * 38 + (r % 2) * 19, cy = y - 22 - r * 34; ends += circle(cx, cy, 15); necks += circle(cx, cy, 6); }
  scene(sh(rect(56, y - 120, 230, 120), '#7a5232'), sh(ends, '#4f6a3a', { stroke: '#2f4020', strokeWidth: 1.2 }), sh(necks, '#c99a6a'), stroke(line([[56, y - 40], [286, y - 40]]) + line([[56, y - 74], [286, y - 74]]), '#5a3a22', 3));
  scene(ol(M(310, y - 60) + L(450, y - 60) + Q(446, y, 380, y) + Q(314, y, 310, y - 60) + 'Z', P.copper, 1.2), ol(ellipse(380, y - 60, 70, 10), shade(P.copper, -0.2), 1), stroke(M(310, y - 54) + Q(290, y - 70, 300, y - 86) + M(450, y - 54) + Q(470, y - 70, 460, y - 86), shade(P.copper, -0.25), 4), sh(rect(330, y - 50, 8, 40, 3), '#ffffff', { opacity: 0.3 }));
  scene(place(tin(100, 40, P.cornflower, '#fbf6e8'), { x: 520, y }), place(tin(86, 36, '#e8c060', P.tomato), { x: 520, y: y - 40 }), place(tin(70, 32, P.tomato, '#fbf6e8'), { x: 520, y: y - 76 }));
  scene(ol(rect(640, y - 56, 120, 56, 10), '#f3d77a', 1.2, -0.3), ol(ellipse(700, y - 56, 60, 12), '#f8e29a', 1, -0.25), sh(rect(640, y - 40, 120, 6), '#e8c060'), ol(poly([[780, y], [840, y], [840, y - 40], [780, y - 18]]), '#f3d77a', 1, -0.3), sh(circle(810, y - 14, 4) + circle(826, y - 24, 3) + circle(796, y - 8, 3), '#e0b84a'));
  scene(ol(rect(870, y - 28, 90, 28, 4), '#fbf6e8', 1, -0.25), ol(M(876, y - 28) + Q(876, y - 64, 915, y - 64) + Q(954, y - 64, 954, y - 28) + 'Z', '#fbf6e8', 1, -0.25), sh(circle(915, y - 66, 6), P.cornflower), stroke(line([[880, y - 34], [950, y - 34]]), P.cornflower, 2));
  scene(place(bottle(40, 110, '#c9b894', '#8a5a34'), { x: 1000, y }), place(bottle(36, 90, '#a8946a', '#8a5a34'), { x: 1046, y }));
  scene(ol(rect(1076, y - 22, 70, 22, 3), P.tomato, 1), ol(rect(1080, y - 42, 64, 20, 3), '#fbf6e8', 1, -0.2), ol(rect(1078, y - 62, 68, 20, 3), P.cornflower, 1), sh(rect(1076, y - 14, 70, 3) + rect(1078, y - 54, 68, 3), '#fbf6e8'));
}
for (const y of shelfY) scene(sh(rect(xL - 22, y, xR - xL + 44, 16), '#8a5a34'), sh(rect(xL - 22, y, xR - xL + 44, 4), '#b98552'), edging(xL - 22, y + 16, xR - xL + 44, 20, '#fbf6e8', shelfY.indexOf(y) % 2 ? P.cornflower : P.tomato));

// =====================================================================
// flagstone floor and everything on it
// =====================================================================
{
  const g = rng(52);
  const y0 = 1136;
  const cols = ['#c9bfa8', '#bfb39a', '#d3c9b2', '#b8ad96'];
  const by = cols.map(() => '');
  let joints = '';
  const rows = [1136, 1190, 1260, 1350, 1500];
  for (let r = 0; r < rows.length - 1; r++) {
    let x = -g.range(0, 80);
    while (x < W) { const w = g.range(120, 220) * (1 + r * 0.2); by[g.int(0, 3)] += rect(x, rows[r], w, rows[r + 1] - rows[r]); joints += line([[x, rows[r]], [x, rows[r + 1]]]); x += w; }
    joints += line([[0, rows[r]], [W, rows[r]]]);
  }
  scene(sh(rect(0, y0, W, H - y0), cols[0]), by.map((d, i) => sh(d, cols[i])), stroke(joints, '#8f846e', 2.4), sh(rect(0, y0, W, 16), '#3b2a1c', { opacity: 0.18 }));
}
// back row against the wall
scene(place(demijohn(150, '#a9c0a0'), { x: 470, y: 1220 }), place(crock(120, 120, '#efe4c8', P.cornflower), { x: 610, y: 1222 }), place(demijohn(130, '#c9b07a'), { x: 760, y: 1222 }), place(crate(150, 80, '#b98552'), { x: 1080, y: 1146 }));
{ const g = rng(61); const o: Shape[] = []; for (let i = 0; i < 4; i++) o.push(...butternut(70, g.range(-20, 20)).map((p) => ({ ...p, d: p.d })).map((p) => place([p], { x: 1040 + (i % 2) * 70, y: 1136 - Math.floor(i / 2) * 26 })[0])); scene(o); }
target('pumpkin', 'Pumpkin', place(pumpkin(92), { x: 950, y: 1190 }));
// flour sacks and the mouse
scene(place(sack(170, 230, '#efe4c8', P.cornflower), { x: 120, y: 1320 }), place(sack(160, 190, '#e2d4b0', P.tomato), { x: 250, y: 1360 }), place(sack(180, 150, '#d9c9a4', '#6f8a62'), { x: 120, y: 1480 }));
target('mouse', 'Mouse', place(mouse(70, '#a39a92'), { x: 268, y: 1474 }));
// basket of onions with the garlic
scene(place(basketHandle(200, 100, '#c99a5b'), { x: 430, y: 1330 }), place(pile(190, 22, ['onion', 'whiteonion', 'onion', 'whiteonion'], 31, 2), { x: 430, y: 1330 }));
target('garlic', 'Garlic bulb', place(garlic(48), { x: 460, y: 1296, rot: 10 }));
scene(place(basket(200, 74, '#c99a5b'), { x: 430, y: 1330 }));
// open potato sack spilling, with the mushroom
{
  scene(place(sack(170, 170, '#c9a878', '#8a6a3a'), { x: 640, y: 1420 }), sh(ellipse(640, 1268, 64, 16), '#5a4a3a'));
  scene(place(pile(120, 18, ['potato'], 41, 2), { x: 640, y: 1290 }));
  const g = rng(43);
  const sp: Shape[] = [];
  for (const [x, y] of [[530, 1440], [566, 1460], [604, 1474], [700, 1468], [742, 1452], [780, 1476], [650, 1488]] as [number, number][]) sp.push(...veg(x, y, 18, 'potato', g));
  scene(sp);
  target('mushroom', 'Mushroom', place(mushroom(54), { x: 728, y: 1482 }));
}
// crate of roots and greens with the apple and the corn cob
{
  scene(place(leek(160), { x: 820, y: 1290, rot: -30 }), place(leek(150), { x: 840, y: 1300, rot: -40 }));
  target('corn-cob', 'Corn cob', place(cornCob(96), { x: 1000, y: 1250, rot: 24 }));
  scene(place(cabbage(34, 2), { x: 950, y: 1300 }), place(pile(150, 18, ['beet', 'redonion', 'beet', 'radish'] as Veg[], 51, 2), { x: 880, y: 1330 }));
  target('apple', 'Apple', place(apple(38), { x: 846, y: 1300, rot: -8 }));
  scene(place(crate(200, 90, '#a8743e'), { x: 900, y: 1330 }));
}
// wooden trug of greens with the pea pod
{
  const g = rng(71);
  let beans = '';
  for (let i = 0; i < 16; i++) beans += leaf(1030 + g.range(-60, 60), 1404 + g.range(-10, 6), g.range(40, 56), 3, g.range(-170, -150) + (i % 2) * 140);
  scene(stroke(M(970, 1416) + Q(1060, 1340, 1150, 1416), '#8a5a34', 6), sh(beans, '#6f9a52'), stroke(beans, '#4f7a3a', 0.6));
  target('pea-pod', 'Pea pod', place(peapod(84), { x: 1070, y: 1398, rot: -12 }));
  scene(ol(M(960, 1414) + L(1160, 1414) + L(1140, 1470) + L(980, 1470) + 'Z', '#b98552', 1.2, -0.35), stroke(line([[966, 1432], [1154, 1432]]) + line([[972, 1452], [1148, 1452]]), '#8a5a34', 1.4), shadow(1060, 1474, 100, 8));
}
{ const g = rng(83); const o: Shape[] = []; for (const [x, y, k] of [[520, 1430, 'onion'], [556, 1456, 'whiteonion'], [470, 1470, 'onion'], [360, 1440, 'redonion']] as [number, number, Veg][]) o.push(...veg(x, y, 18, k, g)); scene(o); }
scene(place(bottle(36, 120, '#7a9a6a', '#c99a6a'), { x: 1150, y: 1340 }), place(bottle(30, 96, '#8a3a2a', '#3b2f2a'), { x: 1180, y: 1350 }));
void curve; void poly; void circle;

const activity: FindActivity = {
  id: ID, version: 1, mode: 'find', title: 'The Pantry Shelves',
  blurb: 'Floor-to-ceiling shelves of jars, tins and spices, with sacks and baskets below, hide fifteen pantry finds.',
  collectionId: 'kitchen', categories: ['Kitchen', 'Food', 'Still life'], difficulty: 'Detailed',
  width: W, height: H, defs, items,
};
export default activity;
