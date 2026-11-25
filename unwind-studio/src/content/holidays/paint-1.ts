import { rect, ellipse, circle, poly, blob, leaf, curve, line, xf, stroke } from '../../art/kit';
import type { PaintActivity, PaletteColor } from '../types';
import { W, H, collector, heart, vessel, band, clipRect, archPts, sampleCurve, sagAt, M, Q, type Pt } from './props-paint';

const palette: PaletteColor[] = [
  { id: 'blush', number: 1, name: 'Blush plaster', hex: '#f1cbc3' },
  { id: 'shell', number: 2, name: 'Shell pink', hex: '#f8e2dc' },
  { id: 'linen', number: 3, name: 'Lace white', hex: '#fff8ef' },
  { id: 'sky', number: 4, name: 'February sky', hex: '#b9d6e4' },
  { id: 'cloud', number: 5, name: 'Pale cloud', hex: '#e6f1f3' },
  { id: 'rose', number: 6, name: 'Rose red', hex: '#d84a5a' },
  { id: 'crimson', number: 7, name: 'Deep crimson', hex: '#982840' },
  { id: 'pink', number: 8, name: 'Sugar pink', hex: '#f29aa4' },
  { id: 'leaf', number: 9, name: 'Rose leaf', hex: '#86a96c' },
  { id: 'leafD', number: 10, name: 'Deep stem', hex: '#4d7150' },
  { id: 'tea', number: 11, name: 'Black tea', hex: '#a9662f' },
  { id: 'biscuit', number: 12, name: 'Shortbread', hex: '#e3b273' },
  { id: 'gold', number: 13, name: 'Gilded rim', hex: '#e7c162' },
  { id: 'wood', number: 14, name: 'Walnut', hex: '#7d4f35' },
  { id: 'floor', number: 15, name: 'Oat tile', hex: '#ead8bd' },
  { id: 'floorD', number: 16, name: 'Toffee tile', hex: '#c8a27c' },
  { id: 'lilac', number: 17, name: 'Lilac glaze', hex: '#b7a3d0' },
];

const { regions, detail, R } = collector();
const INK = '#7a4a42';

// ---------------------------------------------------------------- wall & floor
R('wall', rect(0, 0, W, 790), 'blush');
for (const [i, x] of [20, 140, 860, 980].entries()) R(`wall-stripe-${i + 1}`, rect(x - 20, 0, 40, 790), 'shell');
R('wall-stripe-top', rect(480, 0, 40, 130), 'shell');
R('floor', rect(0, 790, W, 460), 'floor');
R('skirting', rect(0, 776, W, 26), 'wood');
const tiles: Pt[] = [[90, 1100], [300, 1100], [700, 1100], [910, 1100], [190, 1200], [810, 1200]];
tiles.forEach(([x, y], i) => R(`floor-tile-${i + 1}`, poly([[x - 80, y], [x, y - 40], [x + 80, y], [x, y + 40]]), 'floorD'));

// ---------------------------------------------------------------- window
const outer = archPts(290, 710, 108, 300, 590);
R('window-frame', poly(outer), 'linen');
const inner = archPts(314, 686, 132, 300, 572);
const panes: [string, number, number, number, number][] = [
  ['pane-tl', 300, 0, 491, 352], ['pane-tr', 509, 0, 700, 352],
  ['pane-bl', 300, 368, 491, 600], ['pane-br', 509, 368, 700, 600],
];
for (const [id, x0, y0, x1, y1] of panes) R(id, poly(clipRect(inner, x0, y0, x1, y1)), 'sky');
R('cloud-1', poly(clipRect(sampleCurve([[330, 262], [360, 228], [400, 222], [430, 196], [478, 204], [491, 240], [491, 270], [330, 270]], 6), 314, 0, 491, 352)), 'cloud');
R('cloud-2', blob([[560, 300], [586, 276], [620, 280], [646, 258], [676, 274], [686, 300], [686, 314], [560, 314]], 0.8), 'cloud');
R('rooftops', poly([[314, 572], [314, 500], [360, 470], [404, 500], [404, 470], [450, 446], [491, 470], [491, 572]]), 'cloud');
R('rooftops-r', poly([[509, 572], [509, 486], [560, 486], [596, 456], [632, 486], [686, 486], [686, 572]]), 'cloud');
R('sill', rect(266, 584, 468, 26, 4), 'wood');

// heart garland across the window
{
  const a: Pt = [300, 168], b: Pt = [700, 168];
  detail.push(stroke(curve(sampleCurve([a, sagAt(a, b, 60, 0.5), b], 1)), '#b0606a', 2));
  const ts = [0.14, 0.32, 0.5, 0.68, 0.86];
  ts.forEach((t, i) => {
    const p = sagAt(a, b, 60, t);
    R(`garland-heart-${i + 1}`, heart(p[0], p[1] + 22, 40, 38, (t - 0.5) * 20), i % 2 ? 'pink' : 'rose');
  });
}

// ---------------------------------------------------------------- curtains
R('rod', rect(150, 68, 700, 16, 8), 'wood');
R('rod-end-l', circle(150, 76, 16), 'gold');
R('rod-end-r', circle(850, 76, 16), 'gold');
for (const s of [1, -1] as const) {
  const X = (x: number) => (s === 1 ? x : W - x);
  const side = s === 1 ? 'l' : 'r';
  R(`curtain-${side}`, blob([[X(180), 84], [X(352), 84], [X(340), 220], [X(302), 400], [X(326), 520], [X(334), 640], [X(170), 640], [X(214), 520], [X(248), 400], [X(196), 230]].map(([x, y]) => [x, y] as Pt), 0.5), 'pink');
  R(`curtain-${side}-fold`, blob([[X(252), 90], [X(290), 90], [X(282), 300], [X(276), 410], [X(286), 520], [X(268), 634], [X(236), 634], [X(258), 520], [X(266), 410], [X(266), 300]].map(([x, y]) => [x, y] as Pt), 0.6), 'rose');
  R(`curtain-${side}-tie`, xf(rect(-44, -12, 88, 24, 10), { rot: s * -8, x: X(276), y: 404 }), 'gold');
}

// ---------------------------------------------------------------- table
R('table-shadow', ellipse(500, 1190, 300, 40), 'floorD');
R('table-leg', poly([[472, 1000], [528, 1000], [530, 1150], [600, 1180], [610, 1198], [390, 1198], [400, 1180], [470, 1150]]), 'wood');
{
  R('cloth-drape', poly([[64, 830], [84, 1020], [916, 1020], [936, 830]]), 'shell');
  const hem: Pt[] = [];
  const nS = 12;
  for (let i = 0; i <= nS * 4; i++) {
    const t = i / (nS * 4), x = 84 + t * 832;
    hem.push([x, 1024 + Math.abs(Math.sin(t * nS * Math.PI)) * 26]);
  }
  R('cloth-lace', poly([[84, 990], [916, 990], ...hem.reverse()]), 'linen');
  R('cloth-top', ellipse(500, 830, 436, 112), 'linen');
}

// ---------------------------------------------------------------- vase and roses
const vase = vessel(500, [[648, 34], [664, 28], [712, 52], [770, 58], [808, 42]], 0.24);
// leaves behind roses
const lv: [string, number, number, number, number, number, string][] = [
  ['leaf-1', 470, 640, 120, 34, -160, 'leaf'],
  ['leaf-2', 530, 640, 120, 34, -20, 'leafD'],
  ['leaf-3', 488, 600, 110, 30, -118, 'leafD'],
  ['leaf-4', 516, 604, 110, 30, -62, 'leaf'],
  ['leaf-5', 456, 650, 90, 28, 160, 'leafD'],
  ['leaf-6', 544, 650, 90, 28, 20, 'leaf'],
];
for (const [id, x, y, l, w, r, c] of lv) R(id, leaf(x, y, l, w, r), c);
const roses: [string, number, number, number][] = [
  ['rose-top', 500, 506, 44], ['rose-left', 430, 572, 46], ['rose-right', 572, 566, 46], ['rose-low-l', 372, 640, 36], ['rose-low-r', 628, 636, 36],
];
for (const [id, x, y, r] of roses) {
  R(id, blob([[x - r, y], [x - r * 0.7, y - r * 0.76], [x, y - r], [x + r * 0.76, y - r * 0.7], [x + r, y + r * 0.05], [x + r * 0.62, y + r * 0.78], [x, y + r * 0.92], [x - r * 0.72, y + r * 0.7]]), 'rose');
  R(`${id}-heart`, blob([[x - r * 0.5, y - r * 0.08], [x - r * 0.1, y - r * 0.5], [x + r * 0.44, y - r * 0.3], [x + r * 0.42, y + r * 0.22], [x - r * 0.06, y + r * 0.4]]), 'crimson');
  R(`${id}-petal`, blob([[x - r * 0.86, y + r * 0.2], [x - r * 0.2, y + r * 0.62], [x + r * 0.6, y + r * 0.44], [x + r * 0.2, y + r * 0.8], [x - r * 0.5, y + r * 0.74]]), 'pink');
  detail.push(stroke(curve([[x - r * 0.18, y - r * 0.06], [x + r * 0.1, y - r * 0.2], [x + r * 0.2, y + r * 0.08], [x - r * 0.02, y + r * 0.2]]), '#6e1c2e', 2));
}
R('vase', vase.body(), 'lilac');
R('vase-mouth', vase.opening(), 'leafD');
R('vase-band', vase.band(726, 744), 'linen');
R('vase-heart', heart(500, 774, 30, 26), 'rose');

// ---------------------------------------------------------------- teacups
function teacup(id: string, cx: number, flip: 1 | -1) {
  R(`${id}-saucer`, ellipse(cx, 858, 122, 32), 'sky');
  R(`${id}-saucer-well`, ellipse(cx, 854, 76, 18), 'cloud');
  const cup = vessel(cx, [[756, 72], [790, 66], [826, 46], [850, 32]], 0.24);
  const hx = cx + flip * 64;
  R(`${id}-handle`, band([[hx, 772], [hx + flip * 40, 774], [hx + flip * 44, 806], [hx + flip * 4, 826]], 15, 13), 'linen');
  R(`${id}`, cup.body(), 'linen');
  R(`${id}-tea`, cup.opening(6), 'tea');
  detail.push(stroke(cup.opening(1.5), '#d9a93f', 3));
  R(`${id}-band`, cup.band(828, 842, 1), 'pink');
  R(`${id}-heart`, heart(cx, 798, 36, 32), 'rose');
  detail.push(stroke(curve([[cx - 14, 730], [cx - 26, 706], [cx - 10, 684], [cx - 22, 660]]) + curve([[cx + 12, 728], [cx + 2, 704], [cx + 18, 682], [cx + 6, 658]]), '#ffffff', 3, { opacity: 0.8 }));
}
teacup('cup-left', 262, 1);
teacup('cup-right', 738, 1);

// ---------------------------------------------------------------- cookie plate
R('plate', ellipse(500, 904, 170, 40), 'sky');
R('plate-well', ellipse(500, 900, 120, 26), 'cloud');
const squash = (d: string, cx: number, cy: number) => xf(d, { sy: 0.58, ox: cx, oy: cy });
const cookies: [string, number, number, number, number, string][] = [
  ['cookie-left', 420, 896, 104, -16, 'pink'],
  ['cookie-right', 582, 898, 104, 14, 'rose'],
  ['cookie-mid', 500, 908, 112, 0, 'pink'],
];
for (const [id, x, y, w, r, ic] of cookies) {
  R(id, squash(heart(x, y, w, w * 0.92, r), x, y), 'biscuit');
  R(`${id}-icing`, squash(heart(x, y - 2, w * 0.68, w * 0.6, r), x, y), ic);
}
detail.push(stroke(circle(486, 900, 1.5) + circle(512, 896, 1.5) + circle(500, 914, 1.5) + circle(410, 892, 1.5) + circle(430, 900, 1.5) + circle(574, 892, 1.5) + circle(594, 900, 1.5), '#ffffff', 2.4));

// ---------------------------------------------------------------- valentine card
R('card-back', poly([[96, 870], [118, 756], [214, 770], [204, 880]]), 'pink');
R('card-front', poly([[70, 872], [100, 766], [192, 784], [168, 890]]), 'linen');
R('card-heart', heart(134, 818, 54, 48, 12), 'rose');
detail.push(stroke(line([[108, 858], [152, 866]]) + line([[112, 846], [140, 851]]), INK, 1.6));

// ---------------------------------------------------------------- line work
detail.push(stroke(line([[500, 108], [500, 132]]) + line([[290, 360], [314, 360]]) + line([[686, 360], [710, 360]]), '#e8d8cc', 1.4));
detail.push(stroke(curve([[150, 950], [300, 990], [500, 1000], [700, 990], [850, 950]]), '#e4c4bd', 1.6));
for (const [, x, y, l, , r] of lv) detail.push(stroke(xf(line([[6, 0], [l * 0.85, 0]]), { rot: r, x, y }), '#e5efd8', 1.4));
detail.push(stroke(M(64, 836) + Q(500, 1000, 936, 836), '#efe0d6', 1.4));

const activity: PaintActivity = {
  id: 'holidays-paint-1', version: 1, mode: 'paint', title: "Valentine's Tea for Two",
  blurb: 'Two gilded teacups, heart-shaped shortbread and a vase of red roses on a lace-draped café table by the window.',
  collectionId: 'holidays', categories: ["Holidays"], difficulty: 'Moderate',
  season: { from: '01-28', to: '02-15', label: "Valentine's Day" },
  width: W, height: H, palette, regions, detail,
};
export default activity;
