import { rect, ellipse, circle, poly, line, curve, leaf, sector, xf, stroke } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { PaintActivity, PaletteColor } from '../types';
import { collector, crescent, rotRect, rotPt, heart, M, L, C, type Pt } from './props-paint';

const W = 1000, H = 1250;

const palette: PaletteColor[] = [
  { id: 'rug', number: 1, name: 'Sage rug', hex: '#a9bf98' },
  { id: 'rugD', number: 2, name: 'Fern stripe', hex: '#6d8d60' },
  { id: 'woodL', number: 3, name: 'Light oak', hex: '#dcae76' },
  { id: 'woodM', number: 4, name: 'Warm oak', hex: '#bd8754' },
  { id: 'woodD', number: 5, name: 'Walnut', hex: '#7a4f33' },
  { id: 'kraft', number: 6, name: 'Box card', hex: '#e8cf9f' },
  { id: 'kraftD', number: 7, name: 'Box edge', hex: '#b98f5c' },
  { id: 'cheese', number: 8, name: 'Melted cheese', hex: '#f7d06c' },
  { id: 'crust', number: 9, name: 'Golden crust', hex: '#dd9a48' },
  { id: 'tomato', number: 10, name: 'Pepperoni red', hex: '#c9442f' },
  { id: 'basil', number: 11, name: 'Basil', hex: '#4e8a46' },
  { id: 'ink', number: 12, name: 'Olive black', hex: '#2f2d36' },
  { id: 'cream', number: 13, name: 'Napkin white', hex: '#fff8ea' },
  { id: 'glass', number: 14, name: 'Ice blue', hex: '#cfe4ee' },
  { id: 'cola', number: 15, name: 'Cola', hex: '#5b2f23' },
  { id: 'lemon', number: 16, name: 'Lemon', hex: '#f2dc52' },
  { id: 'teal', number: 17, name: 'Card blue', hex: '#3f7f99' },
];

const { regions, R } = collector();
const detail: Shape[] = [];

// ---------- rug and coffee table ----------
R('rug', rect(0, 0, W, H), 'rug');
R('rug-stripe-top', rect(0, 26, W, 34), 'rugD', [500, 43]);
R('rug-stripe-bottom', rect(0, 1190, W, 34), 'rugD', [500, 1207]);
R('table-edge', rect(40, 90, 920, 1074, 28), 'woodD', [500, 1153]);
R('table-top', rect(58, 108, 884, 1038, 18), 'woodM');
R('plank-1', rect(58, 108, 221, 1038), 'woodL', [80, 1060]);
R('plank-3', rect(500, 108, 221, 1038), 'woodL', [610, 1110]);

// ---------- the open pizza box ----------
R('lid', poly([[78, 284], [642, 284], [632, 522], [88, 522]]), 'kraftD');
R('lid-panel', poly([[104, 306], [616, 306], [608, 500], [112, 500]]), 'kraft');
R('lid-badge', circle(360, 403, 62), 'tomato');
R('lid-badge-slice', poly([[318, 374], [404, 374], [361, 446]]), 'cream');
R('box', rect(88, 520, 544, 544, 4), 'kraftD');
R('box-floor', rect(110, 542, 500, 500), 'kraft');

// ---------- the pizza ----------
const PX = 360, PY = 792;
R('pizza-crust', circle(PX, PY, 232), 'crust');
R('pizza-cheese', circle(PX, PY, 198), 'cheese');
R('pizza-gap', sector(PX, PY, 233, -60, -15), 'kraft');
const pol = (r: number, deg: number): Pt => [PX + Math.cos((deg * Math.PI) / 180) * r, PY + Math.sin((deg * Math.PI) / 180) * r];
const pepperoni: [number, number][] = [
  [150, -150], [80, -100], [150, 10], [70, 40], [160, 60], [150, 110], [80, 150], [160, 160], [140, -105], [100, 200],
];
pepperoni.forEach(([r, a], i) => R(`pepperoni-${i + 1}`, circle(...pol(r, a), 24), 'tomato'));
const basil: [number, number, number][] = [[118, -128, 30], [116, 36, 120], [118, 132, -40], [170, -172, 80], [40, 100, 200]];
basil.forEach(([r, a, rot], i) => R(`basil-${i + 1}`, leaf(...pol(r, a), 52, 15, rot), 'basil'));
const mush: [number, number, number][] = [[110, -10, 20], [36, -60, -30], [176, 84, 60], [118, 180, 0]];
const mushroom = (x: number, y: number, rot: number) =>
  xf(M(-20, 4) + C(-20, -24, 20, -24, 20, 4) + L(8, 4) + L(9, 22) + L(-9, 22) + L(-8, 4) + 'Z', { rot, x, y });
mush.forEach(([r, a, rot], i) => R(`mushroom-${i + 1}`, mushroom(...pol(r, a), rot), 'cream'));
const olives: [number, number][] = [[176, -128], [112, 72], [40, 170], [176, 136], [176, -80], [50, -130]];
olives.forEach(([r, a], i) => R(`olive-${i + 1}`, circle(...pol(r, a), 11), 'ink'));

const peppers: [number, number, number][] = [[60, 10, 30], [130, 90, -20], [150, 196, 100], [60, -20 + 230, 60]];
peppers.forEach(([rr, a, rot], i) => R(`pepper-${i + 1}`, crescent(...pol(rr, a), 22, 18, 200, 340, 0.55, rot), 'basil'));

// ---------- plate with a slice ----------
R('napkin-1', rotRect(792, 532, 240, 240, 14, 6), 'cream');
R('napkin-1-stripe-a', xf(rect(-120, 64, 240, 20), { rot: 14, x: 792, y: 532 }), 'tomato', rotPt(792, 532, 14, 112, 74));
R('napkin-1-stripe-b', xf(rect(64, -120, 20, 240), { rot: 14, x: 792, y: 532 }), 'tomato', rotPt(792, 532, 14, 74, 112));
R('plate-1', circle(790, 524, 112), 'cream');
R('plate-1-well', circle(790, 524, 84), 'glass');
const slice = (ax: number, ay: number, r: number, a0: number, a1: number, id: string) => {
  R(`${id}-crust`, sector(ax, ay, r, a0, a1), 'crust');
  R(`${id}-cheese`, sector(ax, ay, r - 28, a0 + 2, a1 - 2), 'cheese');
};
slice(742, 608, 156, -78, -32, 'slice');
R('slice-pepperoni-1', circle(768, 536, 18), 'tomato');
R('slice-pepperoni-2', circle(812, 562, 16), 'tomato');
R('slice-basil', leaf(756, 580, 36, 11, -50), 'basil');

// ---------- second plate with a leftover crust ----------
R('napkin-2', rotRect(476, 204, 180, 160, -12, 6), 'cream');
R('napkin-2-stripe', xf(rect(-90, 48, 180, 18), { rot: -12, x: 476, y: 204 }), 'teal', rotPt(476, 204, -12, 66, 57));
R('plate-2', circle(446, 192, 84), 'cream');
R('plate-2-well', circle(446, 192, 60), 'glass');
R('plate-2-crust', crescent(446, 200, 50, 44, 200, 330, 0.42, 0), 'crust');

// ---------- drinks ----------
function drink(id: string, cx: number, cy: number) {
  R(`${id}-glass`, circle(cx, cy, 66), 'glass');
  R(`${id}-cola`, circle(cx, cy, 52), 'cola');
  R(`${id}-ice-1`, rotRect(cx - 18, cy - 10, 30, 30, 18, 6), 'glass');
  R(`${id}-ice-2`, rotRect(cx + 14, cy + 16, 28, 28, -24, 6), 'glass');
  R(`${id}-lemon`, circle(cx + 42, cy - 42, 28), 'lemon');
  R(`${id}-straw`, rotRect(cx - 10, cy + 40, 16, 84, 34, 7), 'tomato');
}
drink('drink-left', 196, 196);
drink('drink-right', 820, 768);

// ---------- playing cards ----------
const cards: [number, number, number, string][] = [
  [744, 248, -26, 'teal'], [784, 228, -8, 'cream'], [828, 222, 10, 'cream'], [868, 232, 28, 'cream'],
];
cards.forEach(([x, y, rot, col], i) => R(`card-${i + 1}`, rotRect(x, y, 108, 156, rot, 10), col === 'teal' ? 'cream' : col));
R('card-1-back', rotRect(744, 248, 84, 132, -26, 6), 'teal');
R('card-2-spade', heart(...rotPt(784, 228, -8, -16, -40), 30, 172), 'ink');
R('card-3-diamond', xf(poly([[0, -22], [16, 0], [0, 22], [-16, 0]]), { rot: 10, x: rotPt(828, 222, 10, -14, -42)[0], y: rotPt(828, 222, 10, -14, -42)[1] }), 'tomato');
R('card-4-heart', heart(868, 232, 52, 28), 'tomato');

// ---------- dice ----------
function die(id: string, cx: number, cy: number, rot: number, pips: Pt[]) {
  R(id, rotRect(cx, cy, 78, 78, rot, 14), 'cream');
  pips.forEach(([x, y], i) => R(`${id}-pip-${i + 1}`, circle(...rotPt(cx, cy, rot, x, y), 8), 'ink'));
}
die('die-1', 690, 918, 18, [[-20, -20], [0, 0], [20, 20]]);
die('die-2', 806, 958, -14, [[-20, -20], [20, -20], [0, 0], [-20, 20], [20, 20]]);

// ---------- garlic dip and breadsticks ----------
R('dip-bowl', circle(684, 790, 42), 'teal');
R('dip', circle(684, 790, 30), 'cream');
R('dip-breadstick', rotRect(668, 760, 22, 96, -32, 10), 'crust', rotPt(668, 760, -32, 0, -30));
R('breadstick-1', rotRect(330, 1092, 420, 20, -2, 10), 'crust', [330, 1092]);
R('breadstick-2', rotRect(310, 1120, 400, 20, 1, 10), 'crust', [310, 1120]);
R('breadstick-band', rotRect(476, 1106, 36, 50, 0, 6), 'teal');

// ---------- score pad and pencil ----------
R('pad', rotRect(780, 1080, 200, 104, -4, 6), 'cream');
R('pad-band', xf(rect(-100, -52, 200, 22), { rot: -4, x: 780, y: 1080 }), 'teal', rotPt(780, 1080, -4, 0, -41));
R('pencil', rotRect(740, 1096, 190, 18, -18, 4), 'lemon', [740, 1096]);
R('pencil-tip', xf(poly([[95, -9], [124, 0], [95, 9]]), { rot: -18, x: 740, y: 1096 }), 'woodL');

// ---------- line work ----------
// slice cuts
{
  let d = '';
  for (const a of [-15, 30, 75, 120, 165, 210, 255, -60]) d += line([pol(4, a), pol(230, a)]);
  detail.push(stroke(d, '#c98a3c', 2));
}
// pepperoni spots, olive holes, mushroom gills
{
  let d = '';
  pepperoni.forEach(([r, a]) => { const [x, y] = pol(r, a); d += circle(x - 7, y - 5, 2) + circle(x + 6, y + 6, 2) + circle(x + 7, y - 7, 1.6); });
  detail.push(stroke(d, '#8f2b1f', 1.6));
  let o = '';
  olives.forEach(([r, a]) => { const [x, y] = pol(r, a); o += circle(x, y, 3.5); });
  detail.push(stroke(o, '#f7d06c', 2.4));
  let m = '';
  mush.forEach(([r, a, rot]) => { const [x, y] = pol(r, a); m += xf(line([[-14, 2], [14, 2]]), { rot, x, y }); });
  detail.push(stroke(m, '#c7b08c', 1.6));
}
// wood grain
detail.push(stroke(curve([[90, 1080], [100, 1110], [96, 1140]]) + curve([[618, 140], [622, 200], [616, 266]]) + curve([[930, 690], [934, 760], [930, 840]]) + curve([[880, 860], [886, 900]]), '#9c6a3e', 1.4, { opacity: 0.7 }));
// lemon segments
for (const [cx, cy] of [[196 + 42, 196 - 42], [820 + 42, 768 - 42]] as Pt[]) {
  let d = '';
  for (let a = 0; a < 360; a += 60) d += line([[cx, cy], [cx + Math.cos((a * Math.PI) / 180) * 22, cy + Math.sin((a * Math.PI) / 180) * 22]]);
  detail.push(stroke(d + circle(cx, cy, 23), '#fff6c8', 1.6));
}
// bubbles in the cola
detail.push(stroke(circle(196 - 30, 196 + 22, 3) + circle(196 + 30, 196 - 6, 2.4) + circle(820 - 32, 768 + 20, 3) + circle(820 + 32, 768 - 4, 2.4), '#c99a86', 1.4));
// pad lines and crumbs
{
  let d = '';
  for (const y of [-6, 14, 34]) d += line([rotPt(780, 1080, -4, -84, y), rotPt(780, 1080, -4, 84, y)]);
  detail.push(stroke(d, '#c9d6de', 1.6));
  let c = '';
  for (const [x, y] of [[660, 640], [680, 690], [640, 1080], [420, 290], [500, 270], [930, 860]] as Pt[]) c += circle(x, y, 2.6);
  detail.push(stroke(c, '#c98a3c', 2.4));
}
// box flaps and lid fold
detail.push(stroke(line([[110, 542], [88, 520]]) + line([[610, 542], [632, 520]]) + line([[110, 1042], [88, 1064]]) + line([[610, 1042], [632, 1064]]), '#9c7444', 1.4));
// card outlines on the face-down back
detail.push(stroke(xf(poly([[0, -26], [18, 0], [0, 26], [-18, 0]]), { rot: -26, x: 744, y: 248 }), '#d9ecf3', 1.6));

const activity: PaintActivity = {
  id: 'cafe-paint-3', version: 1, mode: 'paint', title: 'Pizza Night',
  blurb: 'An open box of pizza on the coffee table, with cold drinks, striped napkins, a hand of cards and a pair of dice, all seen from above.',
  collectionId: 'cafe', categories: ["Friends", "Cozy"], difficulty: 'Detailed',
  width: W, height: H, palette, regions, detail,
};
export default activity;
