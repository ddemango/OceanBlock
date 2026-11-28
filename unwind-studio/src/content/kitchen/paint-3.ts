import { rect, ellipse, circle, poly, line, curve, blob, leaf, xf, stroke } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { PaintActivity, PaletteColor } from '../types';
import { collector, vessel, crescent, halfLeaf, M, L, Q, C, type Pt } from './props-paint';

const W = 1000, H = 1250;

const palette: PaletteColor[] = [
  { id: 'cream', number: 1, name: 'Buttermilk wall', hex: '#f7ebcf' },
  { id: 'stripe', number: 2, name: 'Pale sage', hex: '#d5e0bd' },
  { id: 'linen', number: 3, name: 'Porcelain', hex: '#fffaf0' },
  { id: 'cornL', number: 4, name: 'Forget-me-not', hex: '#b7caee' },
  { id: 'corn', number: 5, name: 'Cornflower', hex: '#6f8fcf' },
  { id: 'cornD', number: 6, name: 'Deep cornflower', hex: '#45609e' },
  { id: 'pink', number: 7, name: 'Gingham rose', hex: '#efa28c' },
  { id: 'tomato', number: 8, name: 'Tomato red', hex: '#d64c38' },
  { id: 'cherry', number: 9, name: 'Cherry', hex: '#932b30' },
  { id: 'sun', number: 10, name: 'Primrose', hex: '#fbe39a' },
  { id: 'butter', number: 11, name: 'Butter yellow', hex: '#f4c64a' },
  { id: 'mustard', number: 12, name: 'Amber tea', hex: '#d4962c' },
  { id: 'sageL', number: 13, name: 'Spring leaf', hex: '#a9c48a' },
  { id: 'sageM', number: 14, name: 'Tulip leaf', hex: '#6f9160' },
  { id: 'sageD', number: 15, name: 'Deep stem', hex: '#466340' },
];

const { regions, R } = collector();
const detail: Shape[] = [];

// ---------- striped wall ----------
R('wall', rect(0, 0, W, 770), 'cream');
for (let i = 0; i < 8; i++) R(`wall-stripe-${i + 1}`, rect(28 + i * 128, 0, 56, 740), 'stripe');
R('skirting', rect(0, 732, W, 30), 'cornL');

// hanging plate, top right
R('plate-rim', circle(842, 214, 92), 'corn');
R('plate-well', circle(842, 214, 70), 'linen');
R('plate-flower', blob(Array.from({ length: 10 }, (_, i) => {
  const a = ((i * 36 - 90) * Math.PI) / 180, r = i % 2 ? 30 : 44;
  return [842 + Math.cos(a) * r, 214 + Math.sin(a) * r] as Pt;
}), 1), 'tomato');
R('plate-centre', circle(842, 214, 14), 'butter');
detail.push(stroke(line([[842, 0], [842, 122]]), '#8a6a4a', 2));

// ---------- gingham tablecloth ----------
R('cloth', rect(0, 760, W, H - 760), 'pink');
{
  const rows = [760, 832, 914, 1006, 1116, 1250];
  const xAt = (xf0: number, y: number) => { const xb = 500 + (xf0 - 500) * 0.8, t = (y - 760) / 490; return xb + (xf0 - xb) * t; };
  const cl = (v: number) => Math.max(0, Math.min(W, v));
  for (let i = 0; i < 8; i++) for (let j = 0; j < 5; j++) {
    const light = i % 2 === 0 && j % 2 === 0, dark = i % 2 === 1 && j % 2 === 1;
    if (!light && !dark) continue;
    const x0 = -110 + i * 152, x1 = x0 + 152, y0 = rows[j], y1 = rows[j + 1];
    const pts: Pt[] = [[cl(xAt(x0, y0)), y0], [cl(xAt(x1, y0)), y0], [cl(xAt(x1, y1)), y1], [cl(xAt(x0, y1)), y1]];
    if (pts[1][0] - pts[0][0] < 12 || (light && i === 2 && j === 0)) continue;
    R(`cloth-${light ? 'white' : 'red'}-${i + 1}-${j + 1}`, poly(pts), light ? 'linen' : 'tomato');
  }
}

// ---------- tulips in a butter-yellow jug ----------
const jug = vessel(292, [[566, 70], [596, 62], [646, 82], [724, 114], [806, 118], [852, 102], [872, 86]], 0.18);
R('jug-mouth', jug.opening(), 'sageD');

function band(a: Pt, c: Pt, b: Pt, w: number): string {
  const L0: Pt[] = [], L1: Pt[] = [];
  for (let i = 0; i <= 16; i++) {
    const t = i / 16, u = 1 - t;
    const x = u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], y = u * u * a[1] + 2 * u * t * c[1] + t * t * b[1];
    const dx = 2 * u * (c[0] - a[0]) + 2 * t * (b[0] - c[0]), dy = 2 * u * (c[1] - a[1]) + 2 * t * (b[1] - c[1]);
    const len = Math.hypot(dx, dy) || 1, ww = w * (1 - t * 0.3) / 2;
    L0.push([x - (dy / len) * ww, y + (dx / len) * ww]);
    L1.push([x + (dy / len) * ww, y - (dx / len) * ww]);
  }
  return poly([...L0, ...L1.reverse()]);
}

type Tulip = [string, number, number, number, number, string, string, string];
const tulips: Tulip[] = [
  ['tulip-red', 182, 318, -24, 1.05, 'cherry', 'pink', 'tomato'],
  ['tulip-yellow', 300, 206, 4, 1.15, 'mustard', 'sun', 'butter'],
  ['tulip-white', 414, 290, 22, 1.05, 'cornL', 'linen', 'linen'],
  ['tulip-red-2', 380, 424, 34, 0.95, 'cherry', 'pink', 'tomato'],
  ['tulip-yellow-2', 214, 452, -38, 0.95, 'mustard', 'sun', 'butter'],
];
// stems first
tulips.forEach(([id, x, y, rot, s]) => {
  const a = (rot * Math.PI) / 180, bx = x - Math.sin(a) * -30 * s, by = y + Math.cos(a) * 30 * s;
  const p0: Pt = [292 + (x - 292) * 0.3, 600], p1: Pt = [292 + (x - 292) * 0.45, (600 + by) / 2 + 20], p2: Pt = [bx, by];
  const t = id === 'tulip-red' || id === 'tulip-white' ? 0.86 : 0.66, u = 1 - t;
  const lab: Pt = [u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0], u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1]];
  R(`${id}-stem`, band(p0, p1, p2, 16), 'sageD', lab);
});
// leaves
R('leaf-left', leaf(262, 586, 240, 46, -138), 'sageM');
R('leaf-left-light', halfLeaf(262, 586, 240, 46, -138, true), 'sageL');
R('leaf-right', leaf(318, 586, 230, 44, -44), 'sageM');
R('leaf-right-light', halfLeaf(318, 586, 230, 44, -44), 'sageL');
R('leaf-mid', leaf(282, 590, 190, 34, -100), 'sageM');
R('leaf-mid-light', halfLeaf(282, 590, 190, 34, -100), 'sageL');
// heads
tulips.forEach(([id, x, y, rot, s, back, left, right]) => {
  const t = { s, rot, x, y };
  R(`${id}-back`, xf(blob([[-22, 10], [-24, -30], [-10, -60], [0, -80], [10, -60], [24, -30], [22, 10], [0, 26]], 0.8), t), back);
  R(`${id}-right`, xf(blob([[34, 10], [36, -24], [28, -58], [6, -38], [-4, 12], [12, 32]], 0.85), t), right);
  R(`${id}-left`, xf(blob([[-34, 10], [-36, -24], [-26, -62], [-2, -38], [8, 12], [-10, 32]], 0.85), t), left);
});

R('jug-handle', M(186, 640) + C(110, 630, 104, 760, 200, 790) + L(206, 766) + C(140, 744, 144, 664, 192, 668) + 'Z', 'butter');
R('jug', jug.body(), 'butter');
R('jug-shade', crescent(292, 746, 118, 128, -34, 76, 0.34), 'mustard');
R('jug-band', jug.band(820, 842), 'corn');
R('jug-spout', M(354, 572) + Q(380, 556, 404, 540) + Q(402, 584, 360, 600) + 'Z', 'butter');
R('jug-glint', leaf(206, 680, 120, 12, 76), 'sun');

// ---------- round teapot ----------
R('teapot-handle', M(512, 610) + C(420, 590, 410, 770, 500, 790) + L(504, 764) + C(446, 744, 452, 636, 516, 638) + 'Z', 'cornD');
R('teapot-spout', M(780, 700) + C(830, 690, 846, 620, 880, 596) + Q(896, 588, 902, 600) + C(874, 640, 866, 740, 792, 774) + 'Z', 'corn');
R('teapot-foot', ellipse(646, 848, 104, 20), 'cornD');
R('teapot', ellipse(646, 708, 162, 144), 'corn');
R('teapot-shade', crescent(646, 708, 160, 142, -40, 120, 0.3), 'cornD');
R('teapot-light', ellipse(572, 642, 26, 52, 32), 'cornL');
[[620, 640], [714, 628], [560, 732], [668, 724], [760, 712], [622, 800], [714, 800]].forEach(([x, y], i) => R(`teapot-dot-${i + 1}`, circle(x, y, 13), 'linen'));
R('teapot-lid-rim', ellipse(646, 574, 92, 22), 'cornD');
R('teapot-lid', M(562, 574) + C(570, 520, 722, 520, 730, 574) + Q(646, 590, 562, 574) + 'Z', 'corn');
R('teapot-knob', circle(646, 524, 18), 'butter');
detail.push(stroke(curve([[574, 574], [646, 588], [718, 574]]), '#33497a', 1.6));

// ---------- cups and saucers ----------
function cupSet(id: string, cx: number, y: number, s: number) {
  R(`${id}-saucer`, ellipse(cx, y + 50 * s, 160 * s, 42 * s), 'linen');
  R(`${id}-saucer-well`, ellipse(cx, y + 44 * s, 104 * s, 25 * s), 'cornL');
  R(`${id}-handle`, M(cx + 78 * s, y - 52 * s) + C(cx + 138 * s, y - 62 * s, cx + 138 * s, y + 10 * s, cx + 66 * s, y + 4 * s) + L(cx + 70 * s, y - 14 * s) + C(cx + 114 * s, y - 14 * s, cx + 112 * s, y - 46 * s, cx + 80 * s, y - 36 * s) + 'Z', 'linen');
  const cup = vessel(cx, [[y - 70 * s, 88 * s], [y - 40 * s, 82 * s], [y, 64 * s], [y + 30 * s, 44 * s]], 0.24);
  R(`${id}-tea`, cup.opening(), 'mustard');
  R(`${id}-cup`, cup.body(), 'linen');
  R(`${id}-band`, cup.band(y - 44 * s, y - 28 * s), 'tomato');
  R(`${id}-tea-light`, ellipse(cx - 20 * s, y - 72 * s, 34 * s, 7 * s), 'butter');
}
cupSet('cup-left', 230, 1020, 1);
cupSet('cup-right', 720, 1094, 1.12);

// ---------- line work ----------
const rib = (x: number, y: number, len: number, rot: number) => xf(curve([[6, 0], [len * 0.5, -2], [len * 0.9, 0]]), { rot, x, y });
detail.push(stroke(rib(262, 586, 240, -138) + rib(318, 586, 230, -44) + rib(282, 590, 190, -100), '#c9dbb0', 1.6));
tulips.forEach(([, x, y, rot, s]) => detail.push(stroke(xf(curve([[4, 10], [3, -14], [-2, -34]]), { s, rot, x, y }), '#7a2a2a', 1.4, { opacity: 0.45 })));
detail.push(stroke(curve([[700, 990], [708, 966], [698, 942]]) + curve([[730, 984], [738, 960], [728, 934]]), '#ffffff', 3, { opacity: 0.75 }));
detail.push(stroke(curve([[208, 930], [216, 912], [206, 894]]) + curve([[236, 934], [244, 914], [234, 896]]), '#ffffff', 3, { opacity: 0.75 }));

const activity: PaintActivity = {
  id: 'kitchen-paint-3', version: 1, mode: 'paint', title: 'Teapot and Tulips',
  blurb: 'A round cornflower teapot, two steaming cups and a jug of spring tulips on a red gingham tablecloth.',
  collectionId: 'kitchen', categories: ['Kitchen', 'Flowers', 'Cozy'], difficulty: 'Moderate',
  width: W, height: H, palette, regions, detail,
};
export default activity;
