import { rect, ellipse, circle, poly, star, sector, curve, line, stroke } from '../../art/kit';
import type { PaintActivity, PaletteColor } from '../types';
import { W, H, collector, spoke, pennant, sagAt, ridge, vessel, band, type Pt } from './props-paint';

const palette: PaletteColor[] = [
  { id: 'night', number: 1, name: 'Midnight', hex: '#1e2650' },
  { id: 'dusk', number: 2, name: 'Summer dusk', hex: '#34457c' },
  { id: 'glow', number: 3, name: 'Horizon violet', hex: '#7c70a6' },
  { id: 'cream', number: 4, name: 'Porch white', hex: '#fbf3dc' },
  { id: 'red', number: 5, name: 'Firecracker red', hex: '#d8433f' },
  { id: 'gold', number: 6, name: 'Sparkler gold', hex: '#f3c24f' },
  { id: 'sky', number: 7, name: 'Starlight blue', hex: '#90bce9' },
  { id: 'royal', number: 8, name: 'Flag blue', hex: '#3b5cae' },
  { id: 'magenta', number: 9, name: 'Peony pink', hex: '#d86aa8' },
  { id: 'slate', number: 10, name: 'Slate roof', hex: '#4b5886' },
  { id: 'ink', number: 11, name: 'Night ink', hex: '#272e4a' },
  { id: 'pine', number: 12, name: 'Pine shadow', hex: '#2f4c42' },
  { id: 'wood', number: 13, name: 'Porch stain', hex: '#8a5a3a' },
  { id: 'plank', number: 14, name: 'Floorboard', hex: '#c99666' },
  { id: 'lemon', number: 15, name: 'Lemonade', hex: '#f7de72' },
  { id: 'glass', number: 16, name: 'Glass', hex: '#d3e6ef' },
];

const { regions, detail, R } = collector();

// ---------------------------------------------------------------- sky
R('sky', rect(0, 0, W, 700), 'night');
R('sky-dusk', ridge([[0, 430], [260, 400], [520, 420], [780, 392], [1000, 414]], 700), 'dusk');
R('sky-glow', ridge([[0, 584], [300, 566], [600, 580], [1000, 560]], 700), 'glow');
for (const [i, [x, y]] of ([[136, 178], [906, 420]] as Pt[]).entries()) R(`star-${i + 1}`, star(x, y, 13, 6), 'cream');

// ---------------------------------------------------------------- fireworks
function burst(id: string, cx: number, cy: number, r: number, k: number, wid: number, cols: string[], core: string, a0 = 0) {
  for (let i = 0; i < k; i++) R(`${id}-ray-${i + 1}`, spoke(cx, cy, r * 0.17, r, wid, a0 + (360 * i) / k), cols[i % cols.length]);
  R(`${id}-core`, circle(cx, cy, r * 0.14), core);
  let d = '';
  for (let i = 0; i < k; i++) {
    const a = ((a0 + (360 * (i + 0.5)) / k) * Math.PI) / 180;
    d += circle(cx + Math.cos(a) * r * 0.82, cy + Math.sin(a) * r * 0.82, 2.5) + circle(cx + Math.cos(a) * r * 0.55, cy + Math.sin(a) * r * 0.55, 2);
  }
  detail.push(stroke(d, '#fff6d8', 2));
}
burst('burst-red', 300, 300, 176, 12, 30, ['red'], 'gold', 8);
burst('burst-blue', 724, 232, 156, 10, 28, ['sky', 'cream'], 'gold', -6);
burst('burst-pink', 540, 484, 100, 8, 24, ['magenta'], 'cream', 20);
detail.push(stroke(curve([[300, 690], [306, 600], [302, 500]]) + curve([[724, 690], [716, 520], [722, 400]]) + curve([[540, 690], [544, 620], [540, 598]]), '#f3c24f', 2, { opacity: 0.55 }));

// ---------------------------------------------------------------- the far shore and town
R('lake', rect(0, 640, W, 240), 'dusk');
R('treeline', ridge([[0, 650], [80, 630], [150, 646], [230, 626], [330, 640], [460, 624], [560, 644], [640, 628], [760, 640], [860, 622], [1000, 640]], 704), 'pine');
const houses: [string, number, number, number, number, string][] = [
  ['house-1', 140, 234, 646, 606, 'slate'],
  ['house-3', 336, 440, 652, 616, 'slate'],
  ['house-4', 590, 676, 640, 600, 'ink'],
  ['house-5', 684, 800, 650, 612, 'slate'],
  ['house-6', 810, 890, 644, 606, 'ink'],
];
for (const [id, x0, x1, wt, pk, c] of houses) R(id, poly([[x0, 704], [x0, wt], [(x0 + x1) / 2, pk], [x1, wt], [x1, 704]]), c);
R('church', poly([[246, 704], [246, 626], [266, 604], [266, 560], [280, 520], [294, 560], [294, 604], [314, 626], [314, 704]]), 'ink');
const wins: [number, number][] = [[612, 664], [700, 670], [756, 670], [836, 662]];
wins.forEach(([x, y], i) => R(`window-${i + 1}`, rect(x, y, 18, 20, 2), 'gold'));
R('reflect-red-1', ellipse(330, 838, 70, 8), 'red');
R('reflect-red-2', ellipse(92, 786, 30, 7), 'red');
R('reflect-blue', ellipse(724, 756, 56, 8), 'sky');
R('reflect-pink', ellipse(540, 780, 40, 7), 'magenta');
detail.push(stroke(curve([[120, 770], [160, 766], [200, 770]]) + curve([[400, 830], [450, 826], [500, 830]]) + curve([[600, 720], [640, 716], [680, 720]]) + curve([[800, 820], [850, 816], [900, 820]]), '#6d7cb0', 2));

// ---------------------------------------------------------------- porch: rail, posts, floor
R('lawn', rect(0, 858, W, 170), 'pine');
for (let i = 0; i < 9; i++) R(`baluster-${i + 1}`, rect(96 + i * 100, 878, 24, 126), 'cream');
R('rail-top', rect(0, 852, W, 28, 4), 'wood');
R('rail-bottom', rect(0, 998, W, 28), 'wood');
R('floor', rect(0, 1026, W, 224), 'plank');
detail.push(stroke(line([[0, 1066], [524, 1066]]) + line([[876, 1066], [1000, 1066]]) + line([[0, 1118], [684, 1118]]) + line([[718, 1118], [1000, 1118]]) + line([[0, 1178], [684, 1178]]) + line([[718, 1178], [1000, 1178]]) + line([[0, 1240], [1000, 1240]]), '#a87448', 2));
detail.push(stroke(line([[220, 1022], [220, 1066]]) + line([[400, 1066], [400, 1118]]) + line([[120, 1118], [120, 1178]]) + line([[880, 1178], [880, 1240]]) + line([[420, 1178], [420, 1240]]), '#a87448', 1.6));
R('post-left', rect(0, 44, 56, 980), 'cream');
R('post-right', rect(944, 44, 56, 980), 'cream');

// ---------------------------------------------------------------- eave, bunting & fan
R('eave', rect(0, 0, W, 48), 'wood');
const swags: [Pt, Pt][] = [[[56, 48], [500, 48]], [[500, 48], [944, 48]]];
const cols = ['red', 'cream', 'royal'];
let pn = 0;
for (const [a, b] of swags) {
  for (let k = 0; k < 5; k++) {
    const p = sagAt(a, b, 56, 0.1 + k * 0.17), q = sagAt(a, b, 56, 0.1 + k * 0.17 + 0.12);
    R(`pennant-${++pn}`, pennant(p, q, 66), cols[(pn - 1) % 3]);
  }
  detail.push(stroke(curve([a, sagAt(a, b, 56, 0.25), sagAt(a, b, 56, 0.5), sagAt(a, b, 56, 0.75), b]), '#e8dcc0', 2));
}
R('fan-outer', sector(500, 48, 96, 0, 180), 'red');
R('fan-middle', sector(500, 48, 70, 0, 180), 'cream');
R('fan-inner', sector(500, 48, 42, 0, 180), 'royal');
detail.push(stroke([20, 50, 80, 110, 140, 160].map((a) => line([[500 + Math.cos((a * Math.PI) / 180) * 44, 48 + Math.sin((a * Math.PI) / 180) * 44], [500 + Math.cos((a * Math.PI) / 180) * 94, 48 + Math.sin((a * Math.PI) / 180) * 94]])).join(''), '#a8322f', 1.4));

// ---------------------------------------------------------------- flag on the porch post
{
  const P0: Pt = [34, 1000];
  const ang = (-62 * Math.PI) / 180, dir: Pt = [Math.cos(ang), Math.sin(ang)];
  const F = (u: number, v: number): Pt => {
    const s = 380 - 170 * v;
    const wave = Math.sin(u * Math.PI * 1.7 + 0.3) * 10 * u;
    return [P0[0] + dir[0] * s + 270 * u, P0[1] + dir[1] * s + wave];
  };
  const quad = (u0: number, u1: number, v0: number, v1: number) => {
    const pts: Pt[] = [];
    const k = 14;
    for (let i = 0; i <= k; i++) pts.push(F(u0 + ((u1 - u0) * i) / k, v0));
    for (let i = k; i >= 0; i--) pts.push(F(u0 + ((u1 - u0) * i) / k, v1));
    return poly(pts);
  };
  R('flag', quad(0, 1, 0, 1), 'cream');
  for (let k = 0; k < 7; k++) R(`flag-stripe-${k + 1}`, quad(0, 1, (2 * k) / 13, (2 * k + 1) / 13), 'red');
  R('flag-canton', quad(0, 0.42, 0, 7 / 13), 'royal');
  let d = '';
  for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) {
    const p = F(0.05 + c * 0.075 + (r % 2) * 0.035, 0.07 + r * 0.125);
    d += star(p[0], p[1], 5, 2.1);
  }
  detail.push(stroke(d, '#ffffff', 1.4));
  const end: Pt = [P0[0] + dir[0] * 392, P0[1] + dir[1] * 392];
  R('flag-pole', band([P0, end], 18, 16, 2), 'wood');
  R('flag-finial', circle(end[0] + dir[0] * 8, end[1] + dir[1] * 8, 12), 'gold');
}

// ---------------------------------------------------------------- lemonade table
R('table-leg', rect(686, 1080, 30, 140), 'wood');
R('table-foot', ellipse(700, 1222, 90, 16), 'wood');
R('table-top', ellipse(700, 1074, 180, 34), 'cream');
{
  const jug = vessel(640, [[900, 44], [930, 48], [990, 60], [1060, 52], [1078, 46]], 0.2);
  R('pitcher-handle', band([[684, 924], [730, 930], [736, 990], [692, 1030]], 18, 16), 'glass');
  R('pitcher', jug.body(), 'glass');
  R('pitcher-lemonade', jug.band(948, 1066, 5), 'lemon');
  R('lemon-slice', circle(626, 1000, 28), 'cream');
  R('lemon-slice-flesh', circle(626, 1000, 20), 'gold');
  detail.push(stroke(line([[626, 984], [626, 1016]]) + line([[610, 1000], [642, 1000]]) + line([[614, 988], [638, 1012]]) + line([[638, 988], [614, 1012]]), '#fff6d8', 1.4));
}
function glass(id: string, cx: number, top: number, bot: number, hw: number) {
  const g = vessel(cx, [[top, hw], [bot, hw - 6]], 0.22);
  R(`${id}-straw`, band([[cx + 6, bot - 20], [cx + 22, top - 50]], 10, 10, 2), 'red');
  R(id, g.body(), 'glass');
  R(`${id}-lemonade`, g.band(top + 26, bot, 4), 'lemon');
}
glass('glass-1', 780, 966, 1070, 32);
glass('glass-2', 852, 986, 1082, 30);
detail.push(stroke(circle(772, 1020, 3) + circle(788, 1040, 2.5) + circle(846, 1044, 3) + circle(858, 1060, 2.5) + circle(650, 1040, 3) + circle(620, 1050, 2.5), '#ffffff', 2));

const activity: PaintActivity = {
  id: 'holidays-paint-3', version: 1, mode: 'paint', title: 'Fourth of July Fireworks',
  blurb: 'Fireworks bloom over a lakeside town while bunting, a flag and a pitcher of lemonade keep the porch cheerful.',
  collectionId: 'holidays', categories: ["Holidays"], difficulty: 'Detailed',
  season: { from: '06-24', to: '07-08', label: 'the Fourth of July' },
  width: W, height: H, palette, regions, detail,
};
export default activity;
