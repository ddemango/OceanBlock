import { blob, circle, curve, ellipse, line, poly, rect, xf, type Xf } from '../../art/kit';
import type { Pt } from '../../art/geometry';
import type { PaintActivity } from '../types';
import { W, H, band, bandAt, blossomPath, canvas, edged, leafHalves, polar, sample } from './props-paint';

const c = canvas();
const { R, D } = c;

// ---------------------------------------------------------------- background
R('bg-sky', rect(0, 0, W, H), 'sky');
R('bg-halo', circle(650, 560, 340), 'pearl');
R('bg-glow', circle(650, 560, 280), 'cream');
R('bg-foliage-tl', edged([[0, 150], [70, 120], [130, 60], [150, 0]], [[0, 0]]), 'sage');
R('bg-foliage-r', edged([[1000, 520], [950, 600], [930, 700], [960, 800], [1000, 830]], []), 'sage');
R('bg-foliage-b', edged([[0, 1010], [90, 1060], [160, 1140], [260, 1180], [400, 1200], [560, 1180], [700, 1210], [840, 1190], [1000, 1150]], [[1000, 1250], [0, 1250]]), 'sage');
R('bokeh-1', circle(330, 150, 56), 'blush');
R('bokeh-2', circle(530, 90, 34), 'cream');
R('bokeh-3', circle(95, 610, 44), 'cream');
R('bokeh-4', circle(940, 980, 40), 'blush');
R('bokeh-5', circle(600, 1080, 36), 'cream');
R('bokeh-6', circle(200, 520, 26), 'blush');


// ---------------------------------------------------------------- stems
const stemMain: Pt[] = [[470, 1250], [440, 1130], [370, 990], [300, 880]];
const stemTop: Pt[] = [[1000, 560], [930, 460], [870, 340], [810, 260]];
const stemBud1: Pt[] = [[0, 440], [60, 420], [112, 392], [150, 350]];
const stemBud2: Pt[] = [[740, 1250], [790, 1170], [840, 1110], [872, 1072]];
R('stem-main', band(stemMain, 24, 18), 'leafDark', bandAt(stemMain, 0.1));
R('stem-top', band(stemTop, 18, 14), 'leafDark');
R('stem-bud1', band(stemBud1, 14, 11), 'leafDark', bandAt(stemBud1, 0.12));
R('stem-bud2', band(stemBud2, 14, 11), 'leafDark', bandAt(stemBud2, 0.3));

// ---------------------------------------------------------------- glossy leaves (behind the blooms)
const L = (id: string, x: number, y: number, len: number, wid: number, rot: number, flip = false, from = 0) =>
  leafHalves(c, id, x, y, len, wid, rot, flip ? 'leaf' : 'leafLight', flip ? 'leafLight' : 'leaf', '#24553a', 'ovate', '#ffffff', from);
L('leaf-1', 214, 990, 196, 66, 156, false, 0.4);
L('leaf-2', 300, 884, 370, 92, 106, true, 0.72);
L('leaf-3', 330, 862, 410, 92, 24, true, 0.66);
L('leaf-4', 438, 1124, 196, 60, -4);
L('leaf-5', 808, 262, 310, 78, -170, true, 0.62);
L('leaf-6', 920, 452, 150, 48, 72);
L('leaf-8', 84, 418, 150, 46, -112, true);
L('leaf-10', 46, 432, 150, 46, 74);
L('leaf-9', 826, 1124, 168, 52, -12, true);

// ---------------------------------------------------------------- hibiscus
function petalHalf(Lp: number, w: number, s: 1 | -1): string {
  const outer: Pt[] = [[0, 0], [0.28 * Lp, -s * 0.42 * w], [0.6 * Lp, -s * 0.9 * w], [0.86 * Lp, -s * 0.98 * w], [0.99 * Lp, -s * 0.66 * w], [1.03 * Lp, -s * 0.3 * w], [0.96 * Lp, -s * 0.08 * w], [1.0 * Lp, 0]];
  return poly([...sample(outer, 6), [0.5 * Lp, 0]]);
}
interface Bloom { cx: number; cy: number; Lp: number; a0: number; squash: number; tilt: number; up: string; down: string; colAngle: number }
function hibiscus(id: string, b: Bloom) {
  const place = (d: string, rot = 0) => {
    let p = xf(d, { rot, x: b.cx, y: b.cy });
    if (b.squash !== 1) p = xf(p, { sy: b.squash, ox: b.cx, oy: b.cy });
    if (b.tilt) p = xf(p, { rot: b.tilt, ox: b.cx, oy: b.cy });
    return p;
  };
  const w = b.Lp * 0.8;
  for (let i = 0; i < 5; i++) {
    const a = b.a0 + i * 72;
    const Li = b.Lp * (i % 2 ? 0.96 : 1.02);
    R(`${id}-p${i + 1}a`, place(petalHalf(Li, w, 1), a), b.up);
    R(`${id}-p${i + 1}b`, place(petalHalf(Li, w, -1), a), b.down);
    // radiating veins
    let v = '';
    for (const k of [-0.55, -0.3, 0.3, 0.55]) v += curve([[Li * 0.22, 0], [Li * 0.55, k * w * 0.5], [Li * 0.85, k * w * 0.82]]);
    D(place(v, a), '#b03a48', 1.2, 0.4);
    D(place(curve([[Li * 0.3, 0], [Li * 0.65, 0.01 * w], [Li * 0.95, 0]]), a), '#b03a48', 1.4, 0.5);
  }
  R(`${id}-eye`, place(blossomPath(0, 0, b.Lp * 0.3, 5, 0.62, b.a0)), 'crimson');
  // staminal column with pollen and stigma pads
  const tip = polar(0, 0, b.Lp * 0.98, b.colAngle);
  const col: Pt[] = [[0, 0], polar(0, 0, b.Lp * 0.5, b.colAngle - 4), tip];
  const sh5 = (pts: Pt[]) => pts.map(([x, y]) => [x + 500, y + 500] as Pt);
  R(`${id}-column`, place(xf(band(sh5(col), 15, 10), { x: -500, y: -500 })), 'blush');
  const pol = polar(0, 0, b.Lp * 0.82, b.colAngle);
  R(`${id}-pollen`, place(ellipse(pol[0], pol[1], b.Lp * 0.13, b.Lp * 0.075, b.colAngle)), 'gold');
  const st = polar(0, 0, b.Lp * 1.02, b.colAngle);
  R(`${id}-stigma`, place(circle(st[0], st[1], b.Lp * 0.05)), 'crimson');
  let dots = '';
  for (let i = 0; i < 9; i++) {
    const p = polar(pol[0], pol[1], b.Lp * (0.04 + (i % 3) * 0.025), i * 40 + 10);
    dots += line([p, [p[0] + 1.5, p[1] + 1.5]]);
  }
  D(place(dots), '#b27a1c', 3, 0.8);
}

hibiscus('far', { cx: 800, cy: 246, Lp: 176, a0: -70, squash: 0.68, tilt: -18, up: 'blush', down: 'coralLight', colAngle: 210 });

// ---------------------------------------------------------------- buds
function bud(id: string, x: number, y: number, s: number, rot: number) {
  const t: Xf = { x, y, s, rot };
  const div = sample([[2, -128], [-6, -92], [10, -46], [0, 0]], 8);
  const outerL = sample([[0, 0], [-30, -16], [-38, -54], [-24, -98], [2, -128]], 8);
  const outerR = sample([[0, 0], [32, -18], [36, -58], [20, -102], [2, -128]], 8);
  R(`${id}-left`, xf(poly([...outerL, ...div.slice(1)]), t), 'coral');
  R(`${id}-right`, xf(poly([...outerR, ...div.slice(1)]), t), 'crimson');
  R(`${id}-sepal-l`, xf(blob([[0, 8], [-38, 0], [-40, -46], [-18, -30], [-4, -12]], 0.9), t), 'leaf');
  R(`${id}-sepal-r`, xf(blob([[0, 8], [38, 0], [40, -48], [18, -30], [4, -12]], 0.9), t), 'leafLight');
  D(xf(curve([[-4, -20], [-14, -60], [-6, -104]]) + curve([[12, -24], [18, -66], [10, -108]]), t), '#9e2d40', 1.2, 0.5);
  D(xf(line([[-30, 4], [-52, 18]]) + line([[30, 4], [52, 16]]) + line([[-14, 8], [-24, 30]]), t), '#2d6a4a', 1.8);
}
bud('bud-1', 150, 352, 1.05, 34);
bud('bud-2', 874, 1074, 1.1, 22);

// ---------------------------------------------------------------- main bloom
hibiscus('main', { cx: 300, cy: 862, Lp: 262, a0: -100, squash: 1, tilt: 0, up: 'coralLight', down: 'coral', colAngle: -118 });

// ---------------------------------------------------------------- drifting petals
function loosePetal(id: string, x: number, y: number, Lp: number, rot: number) {
  R(`${id}-a`, xf(petalHalf(Lp, Lp * 0.62, 1), { x, y, rot }), 'coralLight');
  R(`${id}-b`, xf(petalHalf(Lp, Lp * 0.62, -1), { x, y, rot }), 'coral');
  D(xf(curve([[Lp * 0.2, 0], [Lp * 0.6, -Lp * 0.12], [Lp * 0.9, -Lp * 0.3]]), { x, y, rot }), '#b03a48', 1.1, 0.45);
}
loosePetal('petal-drift-1', 500, 340, 84, 28);
loosePetal('petal-drift-2', 420, 500, 62, -40);

// ---------------------------------------------------------------- hummingbird
{
  const t: Xf = { x: 640, y: 688, s: 1.65, rot: -10 };
  const P = (id: string, d: string, col: string) => R(`bird-${id}`, xf(d, t), col);
  const DD = (d: string, col: string, w: number, o = 1) => D(xf(d, t), col, w, o);
  P('wing-far', blob([[22, -8], [38, -70], [74, -140], [106, -172], [120, -154], [100, -94], [64, -32]], 1), 'sage');
  P('tail-1', xf('M0 0Q34 -14 78 0Q34 14 0 0Z', { rot: 50, x: 92, y: 98 }), 'teal');
  P('tail-3', xf('M0 0Q34 -14 80 0Q34 14 0 0Z', { rot: 88, x: 86, y: 100 }), 'teal');
  P('tail-2', xf('M0 0Q34 -16 84 0Q34 16 0 0Z', { rot: 68, x: 90, y: 100 }), 'emerald');
  P('body', blob([[14, -26], [48, -14], [78, 18], [102, 62], [110, 100], [88, 114], [56, 90], [26, 56], [0, 34], [-6, 18]], 1), 'emerald');
  P('belly', blob([[2, 36], [30, 42], [60, 70], [88, 104], [66, 112], [40, 94], [14, 66]], 1), 'pearl');
  P('head', blob([[-28, -2], [-20, -24], [2, -32], [24, -22], [30, 2], [16, 20], [-12, 18]], 1), 'emerald');
  P('gorget', blob([[-24, 8], [-12, 26], [8, 42], [32, 40], [36, 20], [14, 14], [-6, 8]], 1), 'magenta');
  P('beak', poly([[-24, -5], [-76, -2], [-124, 3], [-125, 5], [-76, 5], [-24, 7]]), 'ink');
  P('cheek', ellipse(10, 4, 8, 5, 24), 'cream');
  P('eye', circle(-8, -6, 6.5), 'ink');
  P('wing-near', blob([[34, 4], [50, -60], [100, -130], [152, -164], [164, -142], [134, -82], [86, -20], [56, 12]], 1), 'pearl');
  P('coverts', blob([[34, 4], [46, -32], [74, -58], [98, -48], [80, -10], [54, 12]], 1), 'teal');
  // feather lines, eye glint, gorget sheen, hover blur
  DD(curve([[86, -40], [118, -100], [150, -150]]) + curve([[70, -30], [100, -96], [132, -150]]) + curve([[100, -50], [130, -100], [158, -140]]), '#7fa59e', 1.4, 0.8);
  DD(curve([[50, -40], [76, -100], [104, -156]]), '#5b8c80', 1.2, 0.6);
  DD(line([[-9, -8], [-7, -10]]), '#ffffff', 2.4);
  DD(curve([[-12, 20], [6, 30], [26, 30]]), '#d9578e', 1.6, 0.8);
  DD(curve([[30, 60], [52, 80], [72, 100]]), '#c5cbc0', 1.4, 0.8);
  DD(curve([[168, -120], [178, -100], [176, -80]]) + curve([[180, -150], [192, -128], [190, -104]]) + curve([[128, -184], [148, -192], [168, -186]]), '#9fb7b0', 1.6, 0.6);
}

// sparkle of nectar dust drifting
D(line([[470, 600], [470, 616]]) + line([[462, 608], [478, 608]]) + line([[540, 820], [540, 832]]) + line([[534, 826], [546, 826]]) + line([[720, 520], [720, 532]]) + line([[714, 526], [726, 526]]), '#e6b23a', 1.6, 0.8);

const activity: PaintActivity = {
  id: 'blooms-paint-1', version: 1, mode: 'paint',
  title: 'Hummingbird and Hibiscus',
  blurb: 'An emerald hummingbird hovers to sip from a great coral hibiscus, with glossy leaves and tight buds waiting their turn.',
  collectionId: 'blooms',
  categories: ['Birds', 'Flowers', 'Garden'],
  difficulty: 'Moderate',
  width: W, height: H,
  palette: [
    { id: 'sky', number: 1, name: 'Morning sky', hex: '#d6ecef' },
    { id: 'cream', number: 2, name: 'Cream', hex: '#fdf3dc' },
    { id: 'sage', number: 3, name: 'Sage', hex: '#b8d0ab' },
    { id: 'leafLight', number: 4, name: 'Bright leaf', hex: '#8cc47e' },
    { id: 'leaf', number: 5, name: 'Leaf green', hex: '#4e9a5e' },
    { id: 'leafDark', number: 6, name: 'Deep green', hex: '#2d6a4a' },
    { id: 'blush', number: 7, name: 'Blush', hex: '#fdd8cd' },
    { id: 'coralLight', number: 8, name: 'Soft coral', hex: '#f6a493' },
    { id: 'coral', number: 9, name: 'Coral', hex: '#ea6a66' },
    { id: 'crimson', number: 10, name: 'Crimson', hex: '#bf364b' },
    { id: 'gold', number: 11, name: 'Pollen gold', hex: '#f3c24f' },
    { id: 'magenta', number: 12, name: 'Ruby throat', hex: '#a3285c' },
    { id: 'emerald', number: 13, name: 'Emerald', hex: '#3f9e86' },
    { id: 'teal', number: 14, name: 'Deep teal', hex: '#25666a' },
    { id: 'pearl', number: 15, name: 'Pearl', hex: '#eef1ea' },
    { id: 'ink', number: 16, name: 'Charcoal', hex: '#2e2b2c' },
  ],
  regions: c.regions,
  detail: c.detail,
};
export default activity;
