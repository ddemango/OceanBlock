import { blob, circle, curve, ellipse, line, poly, rect, xf, type Xf } from '../../art/kit';
import type { Pt } from '../../art/geometry';
import type { PaintActivity } from '../types';
import { W, H, band, bandAt, blossomPath, canvas, edged, polar, sample } from './props-paint';

const c = canvas();
const { R, D } = c;

// ---------------------------------------------------------------- summer sky
R('bg-sky', rect(0, 0, W, H), 'sky');
R('sun-halo', circle(810, 180, 136), 'blush');
R('sun', circle(810, 180, 100), 'daisy');
const cloud = (cx: number, cy: number, s: number) =>
  blob([[-120, 20], [-110, -10], [-70, -30], [-40, -60], [10, -70], [50, -44], [90, -50], [126, -20], [130, 20]].map(([x, y]) => [cx + x * s, cy + y * s] as Pt), 0.9);
R('cloud-1', cloud(230, 210, 1.2), 'daisy');
R('cloud-2', cloud(620, 330, 0.8), 'blush');
R('cloud-3', cloud(900, 430, 0.6), 'daisy');

// rolling hills and a lavender field running to the horizon
R('hill-far', edged([[0, 640], [160, 600], [360, 630], [560, 590], [780, 610], [1000, 570]], [[1000, 1250], [0, 1250]]), 'sage');
R('meadow', edged([[0, 720], [250, 700], [500, 712], [760, 694], [1000, 704]], [[1000, 1250], [0, 1250]]), 'meadow');
const rows: Pt[][] = [
  [[430, 712], [446, 712], [0, 1150], [0, 1010]],
  [[472, 712], [490, 712], [330, 1250], [130, 1250]],
  [[520, 712], [538, 712], [770, 1250], [570, 1250]],
  [[566, 710], [584, 710], [1000, 1200], [1000, 1060]],
];
rows.forEach((r, i) => R(`field-row-${i + 1}`, poly(r), 'lavender'));
// a few round trees on the far hill
[[120, 612, 34], [690, 600, 30], [900, 586, 36]].forEach(([x, y, r], i) => R(`tree-${i + 1}`, ellipse(x, y - r * 0.6, r, r * 0.9), 'stem'));

// ---------------------------------------------------------------- daisies (behind the lavender)
function daisy(id: string, x: number, y: number, r: number, stemFrom: Pt) {
  const stem: Pt[] = [stemFrom, [(stemFrom[0] + x) / 2 + 10, (stemFrom[1] + y) / 2], [x, y]];
  R(`${id}-stem`, band(stem, 12, 9), 'stem', bandAt(stem, 0.62));
  R(`${id}-petals`, blossomPath(x, y, r, 12, 0.72, -90), 'daisy');
  R(`${id}-centre`, circle(x, y, r * 0.3), 'yellow');
  R(`${id}-centre-shade`, poly(sample([[x - r * 0.3, y], [x - r * 0.2, y + r * 0.22], [x, y + r * 0.3], [x + r * 0.22, y + r * 0.2], [x + r * 0.3, y]], 6).concat([[x, y + r * 0.08]])), 'apricot');
  let v = '';
  for (let i = 0; i < 12; i++) v += line([polar(x, y, r * 0.36, -90 + i * 30), polar(x, y, r * 0.78, -90 + i * 30)]);
  D(v, '#c9c2b4', 1.1, 0.7);
  let dots = '';
  for (let i = 0; i < 8; i++) dots += circle(...polar(x, y - r * 0.04, r * 0.15, i * 45), 1.4);
  D(dots, '#c98a2a', 1.6, 0.8);
}
daisy('daisy-1', 262, 880, 78, [290, 1150]);
daisy('daisy-2', 752, 860, 70, [720, 1150]);
daisy('daisy-3', 500, 990, 62, [520, 1150]);

// ---------------------------------------------------------------- lavender
function lavender(id: string, base: Pt, top: Pt, bend: number, whorls: number, phase: number) {
  const mid: Pt = [(base[0] + top[0]) / 2 + bend, (base[1] + top[1]) / 2];
  const stem: Pt[] = [base, mid, top];
  R(`${id}-stem`, band(stem, 12, 9), 'stemDark', bandAt(stem, 0.3));
  const cols = ['lavDeep', 'lavender', 'lavLight', 'lavender'];
  // spike rises from top
  const ang = Math.atan2(top[1] - mid[1], top[0] - mid[0]);
  const deg = (ang * 180) / Math.PI;
  let y = 0;
  for (let i = 0; i < whorls; i++) {
    const k = i / (whorls - 1);
    const ry = 30 - 13 * k, rx = 25 - 11 * k;
    const p: Pt = [top[0] + Math.cos(ang) * y, top[1] + Math.sin(ang) * y];
    R(`${id}-w${i + 1}`, ellipse(p[0], p[1], ry, rx, deg), cols[(i + phase) % 4]);
    let dots = '';
    for (let j = 0; j < 3; j++) {
      const q = polar(p[0], p[1], rx * 0.5, deg + 90 + (j - 1) * 70);
      dots += line([q, [q[0] + 1, q[1] + 1]]);
    }
    D(dots, '#4f3d86', 2.6, 0.6);
    y += ry * 1.3;
  }
}
const stems: [string, Pt, Pt, number, number][] = [
  ['lav-1', [70, 1150], [92, 640], -16, 5],
  ['lav-2', [190, 1150], [176, 540], 24, 5],
  ['lav-3', [330, 1150], [372, 700], -22, 5],
  ['lav-4', [450, 1150], [440, 700], 18, 5],
  ['lav-5', [610, 1150], [620, 770], -20, 5],
  ['lav-6', [800, 1150], [842, 560], 26, 5],
  ['lav-7', [930, 1150], [916, 680], -14, 5],
  ['lav-8', [128, 1150], [130, 800], 12, 5],
  ['lav-9', [690, 1150], [682, 820], -12, 5],
];
stems.forEach(([id, b, t, bend, n], i) => lavender(id, b, t, bend, n, i));

// the leafy foot of the lavender bushes
R('bush', edged([[0, 1070], [110, 1112], [250, 1090], [400, 1120], [540, 1096], [700, 1122], [860, 1090], [1000, 1110]], [[1000, 1250], [0, 1250]]), 'deepGreen');
const blade = (id: string, x: number, y: number, len: number, wid: number, rot: number, col: string) =>
  R(id, xf(`M0 0Q${len * 0.42} ${-wid} ${len} 0Q${len * 0.42} ${wid} 0 0Z`, { x, y, rot }), col);
blade('blade-1', 40, 1250, 200, 18, -70, 'stem');
blade('blade-2', 190, 1250, 190, 18, -108, 'stemDark');
blade('blade-3', 330, 1250, 200, 18, -66, 'stem');
blade('blade-4', 470, 1250, 180, 16, -114, 'stemDark');
blade('blade-5', 640, 1250, 200, 18, -70, 'stem');
blade('blade-6', 800, 1250, 200, 18, -112, 'stemDark');
blade('blade-7', 950, 1250, 180, 16, -74, 'stem');

// ---------------------------------------------------------------- butterflies
function openButterfly(id: string, t: Xf, fore: string, hind: string, tip: string, withSpots: boolean, inner = '') {
  const P = (k: string, d: string, col: string) => R(`${id}-${k}`, xf(d, t), col);
  const foreW = blob([[4, -6], [18, -36], [52, -56], [80, -52], [78, -22], [42, -2]], 1);
  const hindW = blob([[4, 2], [36, 4], [60, 22], [56, 48], [30, 58], [10, 40]], 1);
  const tipW = blob([[58, -55], [80, -52], [78, -22], [66, -30], [56, -42]], 1);
  for (const sx of [1, -1]) {
    const side = sx > 0 ? 'r' : 'l';
    P(`hind-${side}`, xf(hindW, { sx }), hind);
    P(`fore-${side}`, xf(foreW, { sx }), fore);
    if (tip) P(`tip-${side}`, xf(tipW, { sx }), tip);
    if (inner) P(`inner-${side}`, xf(blob([[4, -4], [20, -22], [34, -18], [30, 6], [24, 22], [8, 16]], 1), { sx }), inner);
    if (withSpots) P(`spot-${side}`, circle(sx * 68, -40, 4.6), 'daisy');
    // veins and wing edges
    D(xf(xf(curve([[6, -6], [30, -26], [62, -44]]) + curve([[8, -4], [36, -14], [72, -26]]) + curve([[6, 4], [28, 20], [44, 44]]) + curve([[6, 4], [34, 12], [54, 26]]), { sx }), t), '#3a2a26', 1.2, 0.55);
  }
  P('body', ellipse(0, 4, 4.6, 26), 'ink');
  D(xf(curve([[-1, -20], [-8, -36], [-16, -46]]) + curve([[1, -20], [8, -36], [16, -46]]), t), '#2f2b33', 1.8);
  D(xf(circle(-16, -46, 1.6) + circle(16, -46, 1.6), t), '#2f2b33', 2.4);
}
openButterfly('fly-orange', { x: 470, y: 310, s: 2.5, rot: -14 }, 'orange', 'apricot', 'ink', true);
openButterfly('fly-blue', { x: 690, y: 470, sx: 1.05, sy: 1.5, rot: 22 }, 'blue', 'blueLight', '', false, 'blueDeep');

// a small yellow butterfly resting on a lavender tip, wings closed
{
  const t: Xf = { x: 172, y: 334, s: 1.6, rot: 8 };
  const P = (k: string, d: string, col: string) => R(`fly-yellow-${k}`, xf(d, t), col);
  P('hind', blob([[0, 0], [-34, 4], [-48, 26], [-30, 40], [-6, 26]], 1), 'apricot');
  P('fore', blob([[2, -2], [-12, -40], [-44, -64], [-62, -50], [-50, -10], [-14, 8]], 1), 'yellow');
  P('body', ellipse(4, -2, 4, 18, 10), 'ink');
  D(xf(curve([[-6, -8], [-26, -30], [-46, -48]]) + curve([[-6, 0], [-24, 12], [-38, 24]]), t), '#b8872a', 1.2, 0.7);
  D(xf(circle(-34, -30, 3) + circle(-26, 20, 2.4), t), '#d9771f', 2.2, 0.9);
  D(xf(curve([[6, -18], [12, -32], [20, -40]]) + curve([[8, -18], [18, -30], [28, -34]]), t), '#2f2b33', 1.6);
}

// meandering flight paths
let path = '';
sample([[120, 250], [200, 200], [300, 260], [370, 330]], 8).forEach(([x, y], i) => { if (i % 3 === 0) path += circle(x, y, 1.6); });
sample([[880, 640], [800, 600], [760, 560]], 8).forEach(([x, y], i) => { if (i % 3 === 0) path += circle(x, y, 1.6); });
D(path, '#7a6aa8', 2, 0.6);

const activity: PaintActivity = {
  id: 'blooms-paint-3', version: 1, mode: 'paint',
  title: 'Butterflies in Lavender',
  blurb: 'Butterflies drift over tall lavender spires and white daisies on a soft summer afternoon, the field rolling away to the hills.',
  collectionId: 'blooms',
  categories: ['Flowers', 'Garden', 'Animals'],
  difficulty: 'Moderate',
  width: W, height: H,
  palette: [
    { id: 'sky', number: 1, name: 'Summer sky', hex: '#cfe5f1' },
    { id: 'blush', number: 2, name: 'Blush cloud', hex: '#f9e1da' },
    { id: 'daisy', number: 3, name: 'Daisy white', hex: '#fffcf4' },
    { id: 'sage', number: 4, name: 'Far hills', hex: '#b9cfa3' },
    { id: 'meadow', number: 5, name: 'Meadow', hex: '#93ba7a' },
    { id: 'stem', number: 6, name: 'Stem green', hex: '#5f8f52' },
    { id: 'stemDark', number: 7, name: 'Grey-green', hex: '#5a7a62' },
    { id: 'deepGreen', number: 8, name: 'Deep green', hex: '#3f6a42' },
    { id: 'lavLight', number: 9, name: 'Pale lavender', hex: '#cbbdea' },
    { id: 'lavender', number: 10, name: 'Lavender', hex: '#9f8ad3' },
    { id: 'lavDeep', number: 11, name: 'Deep lavender', hex: '#6d58a6' },
    { id: 'yellow', number: 12, name: 'Buttercup', hex: '#f4c64e' },
    { id: 'apricot', number: 13, name: 'Apricot', hex: '#f7bd82' },
    { id: 'orange', number: 14, name: 'Marmalade', hex: '#ea8638' },
    { id: 'blue', number: 15, name: 'Cornflower', hex: '#79aade' },
    { id: 'blueLight', number: 16, name: 'Powder blue', hex: '#b5d2f0' },
    { id: 'blueDeep', number: 17, name: 'Deep blue', hex: '#3f68a6' },
    { id: 'ink', number: 18, name: 'Charcoal', hex: '#2f2b33' },
  ],
  regions: c.regions,
  detail: c.detail,
};
export default activity;
