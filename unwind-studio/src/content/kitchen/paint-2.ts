import { rect, ellipse, circle, poly, line, curve, blob, leaf, xf, stroke, rng } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { PaintActivity, PaletteColor } from '../types';
import { collector, vessel, crescent, halfLeaf, M, L, Q, type Pt } from './props-paint';

const W = 1000, H = 1250;

const palette: PaletteColor[] = [
  { id: 'sageL', number: 1, name: 'Sage wall', hex: '#c9d8b0' },
  { id: 'sageM', number: 2, name: 'Meadow green', hex: '#8fa874' },
  { id: 'sageD', number: 3, name: 'Deep sage', hex: '#56714b' },
  { id: 'linen', number: 4, name: 'Fresh linen', hex: '#fffaf0' },
  { id: 'sky', number: 5, name: 'Morning sky', hex: '#b6cfef' },
  { id: 'corn', number: 6, name: 'Cornflower', hex: '#6f8fcf' },
  { id: 'sun', number: 7, name: 'Sunshine', hex: '#fbe29a' },
  { id: 'butter', number: 8, name: 'Apricot butter', hex: '#f4c64a' },
  { id: 'crust', number: 9, name: 'Golden crust', hex: '#d9973a' },
  { id: 'crustD', number: 10, name: 'Dark crust', hex: '#a65f2a' },
  { id: 'crumb', number: 11, name: 'Soft crumb', hex: '#f6e2b8' },
  { id: 'tomato', number: 12, name: 'Strawberry jam', hex: '#d8503a' },
  { id: 'cherry', number: 13, name: 'Deep cherry', hex: '#962c30' },
  { id: 'woodL', number: 14, name: 'Honey oak', hex: '#d8a56f' },
  { id: 'shadow', number: 15, name: 'Oak shadow', hex: '#b5824f' },
  { id: 'woodD', number: 16, name: 'Walnut', hex: '#7c4f31' },
  { id: 'steel', number: 17, name: 'Glass and steel', hex: '#d3dbe1' },
];

const { regions, R } = collector();
const detail: Shape[] = [];
const INK = '#6b4e3a';

// ---------- wall ----------
R('wall', rect(0, 0, W, 720), 'sageL');

// ---------- sunny window ----------
R('window-frame', rect(540, 64, 400, 466), 'linen');
const panes: [number, number][] = [[566, 90], [748, 90], [566, 306], [748, 306]];
const PW = 166, PH = 200;
panes.forEach(([x, y], i) => R(`window-pane-${i + 1}`, rect(x, y, PW, PH), 'sky'));
R('window-sun', circle(852, 168, 38), 'sun');
R('window-cloud', blob([[588, 196], [606, 176], [636, 178], [656, 162], [690, 168], [708, 190], [690, 206], [604, 208]], 0.9), 'linen');
{
  const far = (x: number) => 418 - 26 * Math.sin((x - 566) / 120) - 10 * Math.sin((x - 566) / 47);
  const near = (x: number) => 466 - 22 * Math.sin((x - 520) / 90 + 1.4);
  const hill = (x0: number, f: (x: number) => number, yb: number) => {
    const pts: Pt[] = [];
    for (let x = x0; x <= x0 + PW + 0.1; x += PW / 10) pts.push([x, f(x)]);
    return poly([...pts, [x0 + PW, yb], [x0, yb]]);
  };
  R('hill-far-left', hill(566, far, 506), 'sageM');
  R('hill-far-right', hill(748, far, 506), 'sageM');
  R('hill-near-left', hill(566, near, 506), 'sageD');
  R('hill-near-right', hill(748, near, 506), 'sageD');
}
// gingham valance
R('valance', M(520, 40) + L(960, 40) + L(960, 104) + (() => {
  let d = '';
  for (let i = 0; i < 8; i++) { const x1 = 960 - i * 55, x2 = x1 - 55; d += Q(x1 - 27.5, 126, x2, 104); }
  return d;
})() + 'Z', 'tomato');
for (let i = 0; i < 8; i++) R(`valance-check-${i + 1}`, rect(534 + i * 55, 56, 26, 24), 'linen');
R('sill', rect(520, 522, 440, 26), 'woodL');
R('sill-front', rect(530, 548, 420, 16), 'woodD');
// basil on the sill
{
  const lv: [number, number, number, number, string][] = [[640, 462, 70, -150, 'sageD'], [640, 462, 66, -30, 'sageD'], [640, 466, 74, -112, 'sageM'], [640, 466, 74, -68, 'sageM'], [640, 462, 64, -90, 'sageD']];
  lv.forEach(([x, y, len, rot, c], i) => R(`basil-leaf-${i + 1}`, leaf(x, y, len, 20, rot), c));
  R('basil-pot', poly([[602, 474], [678, 474], [668, 522], [612, 522]]), 'corn');
  R('basil-pot-rim', rect(596, 462, 88, 18, 4), 'linen');
}

// ---------- left wall: hanging spoon and a little print ----------
R('rail', rect(70, 146, 360, 18, 5), 'woodD');
R('spoon-handle', rect(124, 160, 14, 160, 6), 'woodL');
R('spoon-bowl', ellipse(131, 344, 30, 42), 'woodL');
R('spoon-hollow', ellipse(131, 348, 18, 28), 'shadow');
R('print-frame', rect(232, 214, 168, 206), 'woodL');
R('print-mat', rect(248, 230, 136, 174), 'linen');
R('print-sky', rect(268, 250, 96, 134), 'sky');
R('print-pear', blob([[316, 368], [342, 356], [344, 330], [330, 312], [326, 286], [316, 276], [306, 286], [302, 312], [288, 330], [290, 356]], 1), 'butter');
R('print-leaf', leaf(318, 278, 34, 10, -40), 'sageM');

// ---------- counter ----------
R('counter', rect(0, 712, W, 460), 'woodL');
R('counter-edge', rect(0, 1170, W, 80), 'woodD');
R('splash-shadow', rect(0, 712, W, 30), 'shadow');

// ---------- tea towel over the counter edge ----------
R('towel-top', poly([[470, 1120], [690, 1112], [700, 1172], [462, 1172]]), 'linen');
R('towel-hang', poly([[462, 1170], [700, 1170], [708, 1250], [458, 1250]]), 'sky');
R('towel-stripe-1', poly([[461, 1198], [703, 1198], [704, 1214], [460, 1214]]), 'corn');
R('towel-stripe-2', poly([[460, 1226], [705, 1226], [706, 1238], [459, 1238]]), 'corn');

// ---------- bread board and loaf ----------
const boardPts: Pt[] = [[52, 884], [70, 862], [160, 860], [196, 824], [300, 794], [450, 788], [600, 802], [656, 842], [646, 902], [566, 944], [400, 956], [240, 946], [170, 916], [70, 912]];
R('board-shadow', ellipse(370, 978, 320, 34), 'shadow');
R('board-edge', xf(blob(boardPts, 0.7), { y: 20 }), 'crustD');
R('board', blob(boardPts, 0.7), 'woodD');
R('board-hole', circle(92, 886, 10), 'woodL');

R('loaf', ellipse(368, 834, 202, 80, -4), 'crust');
R('loaf-shade', crescent(368, 834, 202, 80, 15, 168, 0.46, -4), 'crustD');
[[214, 818], [312, 806], [410, 798]].forEach(([x, y], i) => R(`loaf-score-${i + 1}`, leaf(x, y, 104, 15, -22), 'sun'));
R('loaf-cut-crust', ellipse(560, 826, 46, 76, -4), 'crustD');
R('loaf-cut-crumb', ellipse(564, 826, 36, 66, -4), 'crumb');

// slices lying in front
const sliceShape = (cx: number, cy: number, w: number, h: number, rot: number, inset = 0) =>
  xf(blob([[-w / 2 + inset, h / 2 - inset], [-w / 2 + inset, 0], [-w * 0.38, -h * 0.36 + inset], [0, -h / 2 + inset], [w * 0.38, -h * 0.36 + inset], [w / 2 - inset, 0], [w / 2 - inset, h / 2 - inset]], 0.8), { rot, x: cx, y: cy });
R('slice-1-crust', sliceShape(452, 908, 128, 92, 10), 'crust');
R('slice-1-crumb', sliceShape(452, 908, 128, 92, 10, 11), 'crumb');
R('slice-2-crust', sliceShape(564, 934, 132, 94, -6), 'crust');
R('slice-2-crumb', sliceShape(564, 934, 132, 94, -6, 11), 'crumb');
R('slice-2-jam', xf(blob([[-50, -4], [-38, -26], [0, -34], [38, -26], [52, -4], [40, 14], [10, 6], [-20, 18]], 1), { rot: -6, x: 564, y: 930 }), 'tomato');

// ---------- knife ----------
{
  const t = { rot: -8, x: 70, y: 1090 };
  R('knife-shadow', xf(M(10, 14) + L(440, 14) + Q(474, 18, 474, 30) + L(10, 32) + 'Z', t), 'shadow');
  R('knife-handle', xf(rect(0, -14, 132, 28, 12), t), 'woodD');
  R('knife-bolster', xf(rect(130, -13, 18, 26, 3), t), 'steel');
  R('knife-blade', xf(M(148, -11) + L(400, -11) + Q(450, -8, 462, 10) + L(148, 12) + 'Z', t), 'steel');
  detail.push(stroke(xf(circle(30, 0, 3) + circle(66, 0, 3) + circle(102, 0, 3), t), '#e7c9a4', 2));
  let d = '';
  for (let x = 160; x < 440; x += 14) d += line([[x, 12], [x + 7, 8], [x + 14, 12]]);
  detail.push(stroke(xf(d, t), '#9aa6b1', 1.4));
  detail.push(stroke(xf(line([[160, -4], [400, -4]]), t), '#ffffff', 2.4, { opacity: 0.8 }));
}

// ---------- jam jars ----------
function jar(id: string, cx: number, top: number, bot: number, hwid: number, jam: string, jamShade: string, check: string) {
  const j = vessel(cx, [[top, hwid - 12], [top + 18, hwid - 10], [top + 34, hwid - 2], [top + 54, hwid], [bot - 20, hwid], [bot, hwid - 6]], 0.18);
  R(`${id}-shadow`, ellipse(cx + 10, bot + 8, hwid + 28, 16), 'shadow');
  R(`${id}-glass`, j.body(), 'steel');
  R(`${id}-jam`, j.band(top + 44, bot - 4, 6), jam);
  R(`${id}-jam-shade`, poly([[cx + hwid * 0.56, top + 66], [cx + hwid - 9, top + 60], [cx + hwid - 9, bot - 26], [cx + hwid * 0.6, bot - 18]]), jamShade);
  R(`${id}-glint`, rect(cx - hwid + 14, top + 64, 12, bot - top - 100, 6), 'linen');
  const ly = top + (bot - top) * 0.46;
  R(`${id}-label`, rect(cx - hwid * 0.5, ly, hwid * 1.02, 62, 8), 'linen');
  detail.push(stroke(curve([[cx - hwid * 0.34, ly + 24], [cx, ly + 20], [cx + hwid * 0.36, ly + 24]]) + line([[cx - hwid * 0.24, ly + 42], [cx + hwid * 0.26, ly + 42]]), INK, 1.8));
  // gingham cap
  const fw = hwid + 14, ft = top - 22;
  const cap: Pt[] = [[cx - fw, top + 8], [cx - fw * 0.7, ft + 2], [cx, ft - 6], [cx + fw * 0.7, ft + 2], [cx + fw, top + 8]];
  const sc = 5;
  for (let i = 0; i <= sc * 2; i++) {
    const x = cx + fw - (2 * fw * i) / (sc * 2);
    cap.push([x, top + (i % 2 ? 44 : 32)]);
  }
  R(`${id}-cap`, blob(cap, 0.55), 'linen');
  const sq = (fw * 2) / 6.2;
  for (let i = 0; i < 3; i++) R(`${id}-check-${i + 1}`, rect(cx - fw + sq * 0.7 + i * sq * 2, top + 10, sq * 0.82, 16), check);
  for (let i = 0; i < 2; i++) R(`${id}-check-${i + 4}`, rect(cx - fw + sq * 1.75 + i * sq * 2, ft + 6, sq * 0.82, 14), check);
  detail.push(stroke(curve([[cx - fw + 4, top + 30], [cx, top + 36], [cx + fw - 4, top + 30]]), '#7a5a3a', 2.4));
  detail.push(stroke(curve([[cx + 10, top + 35], [cx + 22, top + 56], [cx + 14, top + 66]]) + curve([[cx + 10, top + 35], [cx + 30, top + 50], [cx + 34, top + 62]]), '#7a5a3a', 2.2));
}
jar('jar-strawberry', 730, 640, 906, 80, 'tomato', 'cherry', 'tomato');
jar('jar-apricot', 888, 742, 940, 64, 'butter', 'crust', 'corn');

// ---------- strawberries ----------
function berry(id: string, cx: number, cy: number, s: number, rot: number) {
  R(id, xf(blob([[0, 34], [24, 12], [28, -10], [14, -24], [0, -22], [-14, -24], [-28, -10], [-24, 12]], 1), { s, rot, x: cx, y: cy }), 'tomato');
  R(`${id}-cap`, xf(blob([[-24, -20], [-10, -34], [0, -28], [10, -34], [24, -20], [10, -16], [0, -10], [-10, -16]], 0.6), { s, rot, x: cx, y: cy }), 'sageM');
  let d = '';
  for (const [x, y] of [[-12, -4], [4, -6], [16, 2], [-6, 10], [8, 14], [-14, 14], [0, 24], [18, -12]]) d += circle(x, y, 1.2);
  detail.push(stroke(xf(d, { s, rot, x: cx, y: cy }), '#fbe29a', 1.6));
}
berry('berry-1', 628, 986, 1.25, -18);
berry('berry-2', 688, 1004, 1.15, 22);

// ---------- butter dish ----------
R('dish-shadow', ellipse(842, 1116, 160, 28), 'shadow');
R('dish', ellipse(830, 1092, 152, 44), 'corn');
R('dish-well', ellipse(830, 1086, 126, 32), 'sky');
R('butter-end', poly([[744, 1046], [764, 1066], [764, 1104], [744, 1084]]), 'crust');
R('butter-front', poly([[764, 1066], [904, 1056], [904, 1094], [764, 1104]]), 'butter');
R('butter-top', poly([[744, 1046], [884, 1036], [904, 1056], [764, 1066]]), 'sun');
detail.push(stroke(curve([[790, 1054], [820, 1046], [856, 1050]]), '#e0b440', 1.6));

// ---------- line work ----------
detail.push(stroke(curve([[0, 860], [20, 864], [44, 860]]) + curve([[0, 1040], [40, 1046], [60, 1040]]) + curve([[930, 1000], [970, 1006], [1000, 1000]]), '#b58050', 1.6));
{
  const g = rng(31);
  let d = '';
  for (let i = 0; i < 26; i++) { const t = g.next(); d += circle(196 + t * 310 + g.range(-14, 14), 800 - t * 26 + g.range(-22, 18), 1.3); }
  detail.push(stroke(d, '#fffaf0', 2, { opacity: 0.9 }));
  let c = '';
  for (let i = 0; i < 16; i++) c += circle(g.range(546, 584), g.range(780, 872), 1);
  for (let i = 0; i < 12; i++) c += circle(g.range(422, 486), g.range(896, 926), 1);
  detail.push(stroke(c, '#d6b67e', 1.4));
}
const rib = (x: number, y: number, len: number, rot: number) => xf(line([[6, 0], [len * 0.88, 0]]), { rot, x, y });
detail.push(stroke(rib(640, 462, 70, -150) + rib(640, 462, 66, -30) + rib(640, 462, 64, -90), '#a9c08c', 1.4));
detail.push(stroke(line([[300, 150], [300, 214]]) + line([[332, 150], [332, 214]]), INK, 1.4));
detail.push(stroke(curve([[316, 276], [318, 266], [322, 258]]), INK, 2));

const activity: PaintActivity = {
  id: 'kitchen-paint-2', version: 1, mode: 'paint', title: 'Bread and Jam',
  blurb: 'A crusty loaf on its board, gingham-capped jars of strawberry and apricot jam and a dish of butter, beside a sunny window.',
  collectionId: 'kitchen', categories: ['Kitchen', 'Food', 'Cozy'], difficulty: 'Moderate',
  width: W, height: H, palette, regions, detail,
};
export default activity;
