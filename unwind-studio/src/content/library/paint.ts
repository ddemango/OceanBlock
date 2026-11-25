import { blob, circle, curve, ellipse, leaf, line, poly, rect, rng, stroke, xf } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { PaintActivity, PaintRegion, PaletteColor } from '../types';
import { ribbon } from './props';

const palette: PaletteColor[] = [
  { id: 'wall', number: 1, name: 'Sage wall', hex: '#7c9f8a' },
  { id: 'deep', number: 2, name: 'Deep green', hex: '#2f5a45' },
  { id: 'oak', number: 3, name: 'Oak', hex: '#bf8a56' },
  { id: 'wood', number: 4, name: 'Walnut', hex: '#8a5a36' },
  { id: 'dark', number: 5, name: 'Dark wood', hex: '#553420' },
  { id: 'parch', number: 6, name: 'Parchment', hex: '#e6d3aa' },
  { id: 'paper', number: 7, name: 'Cream', hex: '#fbf4e2' },
  { id: 'red', number: 8, name: 'Muted red', hex: '#9c3b32' },
  { id: 'terra', number: 9, name: 'Terracotta', hex: '#c0694a' },
  { id: 'mustard', number: 10, name: 'Mustard', hex: '#d1a03c' },
  { id: 'amber', number: 11, name: 'Amber', hex: '#f6c15a' },
  { id: 'blue', number: 12, name: 'Dusty blue', hex: '#7393ab' },
  { id: 'navy', number: 13, name: 'Slate blue', hex: '#3d566e' },
  { id: 'leaf', number: 14, name: 'Leaf green', hex: '#4a7a58' },
  { id: 'lime', number: 15, name: 'Soft green', hex: '#8fb070' },
  { id: 'plum', number: 16, name: 'Plum', hex: '#6a4560' },
  { id: 'rose', number: 17, name: 'Dusty rose', hex: '#d9a394' },
];

const regions: PaintRegion[] = [];
const R = (id: string, d: string, color: string) => regions.push({ id, d, color });
const detail: Shape[] = [];
const INK = '#3a2a22';
const D = (d: string, w = 1.6, op = 0.5, col = INK) => detail.push(stroke(d, col, w, { opacity: op }));

// ------------------------------------------------------------ background
R('wall', rect(0, 0, 1000, 810), 'wall');
R('niche', rect(0, 0, 1000, 302), 'deep');
R('shelf-top', rect(0, 0, 1000, 30), 'dark');
R('shelf-board', rect(0, 300, 1000, 30), 'oak');
R('shelf-edge', rect(0, 330, 1000, 24), 'dark');

// ------------------------------------------------------------ books on the shelf
const SH = 300;
const up = (id: string, x: number, w: number, h: number, color: string) => R(id, rect(x, SH - h, w, h, 3), color);
up('sbook1', 22, 54, 204, 'red');
R('sbook1-band', rect(22, 130, 54, 18), 'mustard');
up('sbook2', 78, 46, 170, 'parch');
up('sbook3', 126, 62, 218, 'navy');
R('sbook3-label', rect(138, 112, 38, 56, 3), 'parch');
up('sbook4', 190, 48, 186, 'mustard');
R('sbook4-band', rect(190, 238, 48, 18), 'dark');
up('sbook5', 240, 52, 154, 'plum');
R('sbook5-band', rect(240, 166, 52, 16), 'rose');
R('sbook6', xf(rect(0, -190, 46, 190, 3), { rot: -13, x: 338, y: SH }), 'terra');
// little vase with a sprig
R('sprig-left', leaf(428, 228, 78, 15, -128), 'leaf');
R('sprig-right', leaf(428, 228, 74, 15, -52), 'leaf');
R('sprig-mid', leaf(428, 230, 96, 16, -90), 'lime');
R('vase', blob([[408, 300], [392, 264], [408, 238], [417, 222], [439, 222], [448, 238], [464, 264], [448, 300]], 0.8), 'rose');
R('vase-band', ribbon([[393, 266], [428, 274], [463, 266]], 14), 'paper');
up('sbook7', 476, 58, 206, 'leaf');
R('sbook7-label', rect(486, 116, 38, 44, 3), 'paper');
up('sbook8', 536, 46, 168, 'red');
up('sbook9', 584, 62, 192, 'blue');
R('sbook9-band', rect(584, 132, 62, 18), 'parch');
up('sbook10', 648, 48, 212, 'terra');
up('sbook11', 698, 44, 178, 'parch');
R('sbook11-band', rect(698, 230, 44, 18), 'plum');
R('pile1', rect(752, 266, 172, 34, 4), 'mustard');
R('pile2', rect(762, 234, 152, 32, 4), 'navy');
R('pile2-label', rect(806, 241, 64, 18, 3), 'parch');
R('pile3', rect(756, 204, 164, 30, 4), 'rose');
R('jar', rect(808, 146, 60, 58, 12), 'paper');
R('jar-fill', rect(814, 172, 48, 28, 8), 'amber');
R('jar-lid', rect(802, 130, 72, 18, 5), 'wood');
up('sbook12', 934, 52, 198, 'plum');
R('sbook12-band', rect(934, 126, 52, 16), 'mustard');

// ------------------------------------------------------------ framed landscape
R('frame', rect(168, 392, 256, 196, 6), 'wood');
R('frame-mat', rect(184, 408, 224, 164, 3), 'paper');
R('frame-sky', rect(202, 426, 188, 128), 'blue');
R('frame-sun', circle(252, 462, 16), 'amber');
R('frame-hill-far', poly([[202, 554], [202, 520], [262, 488], [310, 512], [350, 480], [390, 506], [390, 554]]), 'lime');
R('frame-hill-near', poly([[202, 554], [202, 536], [280, 520], [340, 534], [390, 522], [390, 554]]), 'leaf');

// decorative wall plate
R('wplate', circle(560, 468, 56), 'navy');
R('wplate-inner', circle(560, 468, 41), 'paper');
R('wplate-centre', circle(560, 468, 17), 'mustard');

// ------------------------------------------------------------ table
R('table-top', rect(0, 800, 1000, 292), 'oak');
R('table-front', rect(0, 1090, 1000, 160), 'wood');
R('table-rail', rect(0, 1206, 1000, 44), 'dark');
R('runner', poly([[176, 800], [824, 800], [884, 1090], [884, 1192], [116, 1192], [116, 1090]]), 'parch');
R('runner-stripe', rect(116, 1106, 768, 26), 'red');
R('runner-hem', rect(116, 1146, 768, 26), 'navy');

// ------------------------------------------------------------ plant (back right)
const PX = 900, PY = 716;
const leaves: [number, number, number, string][] = [
  [-154, 205, 40, 'leaf'], [-20, 80, 30, 'lime'], [-138, 240, 46, 'lime'], [-50, 138, 38, 'leaf'],
  [-119, 262, 50, 'leaf'], [-70, 214, 46, 'lime'], [-96, 270, 52, 'leaf'],
];
leaves.forEach(([a, len, w, col], i) => R(`leaf${i + 1}`, leaf(PX + Math.cos((a * Math.PI) / 180) * 14, PY + 6, len, w, a), col));
R('pot', poly([[822, 724], [978, 724], [956, 872], [844, 872]]), 'terra');
R('pot-shade', poly([[940, 724], [978, 724], [956, 872], [926, 872]]), 'red');
R('pot-band', poly([[829, 772], [971, 772], [967, 798], [833, 798]]), 'paper');
R('pot-rim', rect(810, 702, 180, 30, 7), 'rose');

// ------------------------------------------------------------ stack of books with a teacup
R('stack1', rect(606, 872, 274, 48, 5), 'red');
R('stack1-label', rect(694, 885, 96, 22, 3), 'parch');
R('stack2', rect(622, 828, 244, 44, 5), 'navy');
R('stack2-pages', rect(640, 838, 226, 24), 'paper');
R('stack3', rect(612, 786, 260, 42, 5), 'mustard');
R('stack3-band-a', rect(640, 786, 20, 42), 'plum');
R('stack3-band-b', rect(820, 786, 20, 42), 'plum');
R('stack4', rect(636, 748, 220, 38, 5), 'deep');
R('stack4-label', rect(704, 757, 84, 20, 3), 'parch');
const CX = 746;
R('saucer', ellipse(CX, 744, 96, 17), 'paper');
R('cup-handle', ribbon([[800, 676], [846, 672], [850, 710], [794, 722]], 13), 'red');
R('cup', blob([[CX - 62, 664], [CX + 62, 664], [CX + 54, 710], [CX + 30, 738], [CX - 30, 738], [CX - 54, 710]], 0.75), 'rose');
R('cup-band', ribbon([[CX - 58, 692], [CX, 701], [CX + 58, 692]], 14), 'red');
R('cup-rim', ellipse(CX, 664, 64, 18), 'paper');
R('tea', ellipse(CX, 666, 48, 9), 'wood');
R('steam1', ribbon([[CX - 14, 640], [CX - 34, 600], [CX - 12, 556], [CX - 30, 510], [CX - 18, 468]], (t) => 8 + 14 * Math.sin(Math.PI * t), 10), 'paper');
R('steam2', ribbon([[CX + 24, 636], [CX + 40, 602], [CX + 24, 566], [CX + 36, 530]], (t) => 8 + 11 * Math.sin(Math.PI * t), 10), 'paper');

// ------------------------------------------------------------ teapot
const TX = 384, TY = 846;
R('pot-foot', ellipse(TX, 944, 84, 16), 'navy');
R('spout', ribbon([[TX - 96, 896], [TX - 160, 886], [TX - 192, 826], [TX - 208, 790], [TX - 232, 762]], (t) => 64 - t * 42), 'navy');
R('handle', ribbon([[TX + 112, 790], [TX + 196, 776], [TX + 206, 880], [TX + 106, 908]], 24), 'navy');
R('teapot', ellipse(TX, TY, 136, 104), 'blue');
{
  const o: [number, number][] = [], inn: [number, number][] = [];
  for (let i = 0; i <= 10; i++) {
    const t = i / 10, an = ((22 + t * 70) * Math.PI) / 180, f = 0.95 - 0.3 * Math.sin(Math.PI * t);
    o.push([TX + Math.cos(an) * 136 * 0.95, TY + Math.sin(an) * 104 * 0.95]);
    inn.push([TX + Math.cos(an) * 136 * f, TY + Math.sin(an) * 104 * f]);
  }
  R('teapot-shade', poly([...o, ...inn.reverse()]), 'navy');
}
R('teapot-band', ribbon([[TX - 134, 832], [TX, 856], [TX + 134, 832]], 30), 'parch');
[-70, 0, 70].forEach((dx, i) => R(`teapot-dot${i + 1}`, circle(TX + dx, 851 - Math.abs(dx) * 0.14, 9), 'red'));
R('teapot-shine', ellipse(TX - 62, 786, 20, 30, 28), 'paper');
R('lid', ellipse(TX, 750, 80, 20), 'navy');
R('lid-knob', circle(TX, 722, 19), 'mustard');

// ------------------------------------------------------------ candle
R('candle-dish', ellipse(108, 956, 80, 17), 'mustard');
R('candle-loop', ribbon([[176, 950], [214, 940], [216, 972], [180, 968]], 11), 'mustard');
R('candle-cup', rect(80, 912, 56, 44, 7), 'wood');
R('candle', rect(90, 772, 36, 146, 4), 'paper');
R('flame', blob([[108, 772], [90, 748], [96, 720], [108, 690], [120, 722], [126, 748]], 1), 'amber');
R('flame-core', blob([[108, 768], [99, 752], [108, 728], [117, 752]], 1), 'paper');

// ------------------------------------------------------------ apple
R('apple-leaf', leaf(112, 1000, 52, 15, -28), 'lime');
R('apple', blob([[104, 1004], [138, 996], [156, 1030], [136, 1068], [104, 1076], [72, 1068], [52, 1030], [70, 996]], 1), 'red');
R('apple-shine', ellipse(80, 1026, 8, 15, 18), 'rose');

// ------------------------------------------------------------ open book
R('open-cover', poly([[216, 1002], [458, 972], [700, 1002], [712, 1102], [458, 1084], [204, 1102]]), 'red');
R('open-left', poly([[240, 1002], [454, 984], [454, 1062], [232, 1080]]), 'paper');
R('open-right', poly([[462, 984], [676, 1002], [684, 1080], [462, 1062]]), 'parch');
R('bookmark', ribbon([[458, 1040], [468, 1092], [456, 1150]], 16), 'mustard');

// ------------------------------------------------------------ plate of biscuits
R('plate', ellipse(836, 1032, 112, 31), 'paper');
R('plate-well', ellipse(836, 1032, 84, 21), 'blue');
R('biscuit1', ellipse(800, 1026, 34, 13), 'mustard');
R('biscuit2', ellipse(872, 1026, 34, 13), 'oak');
R('biscuit3', ellipse(836, 1040, 32, 12), 'dark');

// ------------------------------------------------------------ line work
const r = rng(12);
// wallpaper sprigs
for (let row = 0, y = 372; y < 790; y += 58, row++) {
  for (let x = 40 + (row % 2) * 40; x < 1000; x += 80) {
    D(line([[x, y + 9], [x, y - 9]]), 1.4, 0.3, '#2f5a45');
    D(curve([[x, y], [x - 7, y - 4], [x - 9, y - 11]]), 1.4, 0.3, '#2f5a45');
    D(curve([[x, y], [x + 7, y - 4], [x + 9, y - 11]]), 1.4, 0.3, '#2f5a45');
  }
}
// spines on the shelf
for (const [x, w, h] of [[22, 54, 204], [78, 46, 170], [126, 62, 218], [190, 48, 186], [240, 52, 154], [476, 58, 206], [536, 46, 168], [584, 62, 192], [648, 48, 212], [698, 44, 178], [934, 52, 198]]) {
  D(line([[x + 5, SH - h + 12], [x + w - 5, SH - h + 12]]), 1.4, 0.4);
  D(line([[x + 5, SH - 14], [x + w - 5, SH - 14]]), 1.4, 0.4);
}
D(line([[146, 130], [168, 130]]), 1.6, 0.6); D(line([[146, 140], [168, 140]]), 1.6, 0.6); D(line([[150, 150], [164, 150]]), 1.6, 0.6);
D(line([[494, 130], [516, 130]]), 1.6, 0.6); D(line([[494, 140], [516, 140]]), 1.6, 0.6);
// shelf & table grain
for (let i = 0; i < 9; i++) { const x = r.range(0, 860), y = 306 + r.range(2, 20); D(curve([[x, y], [x + 60, y + r.range(-2, 2)], [x + 130, y]]), 1.2, 0.35); }
for (let i = 0; i < 26; i++) { const x = r.range(-40, 900), y = r.range(1096, 1200); D(curve([[x, y], [x + 80, y + r.range(-3, 3)], [x + r.range(120, 200), y]]), 1.3, 0.3); }
for (let i = 0; i < 16; i++) { const left = i % 2 === 0; const x = left ? r.range(0, 90) : r.range(900, 960), y = r.range(812, 1080); D(curve([[x, y], [x + 20, y + r.range(-2, 2)], [x + 44, y]]), 1.2, 0.3); }
// runner tassels
for (let x = 126; x < 884; x += 22) D(line([[x, 1192], [x, 1204]]), 2, 0.6, '#b89a5a');
for (let i = 0; i < 8; i++) { const a = (i * Math.PI) / 4; D(leaf(560 + Math.cos(a) * 20, 468 + Math.sin(a) * 20, 17, 5, (a * 180) / Math.PI), 1.4, 0.55, '#3d566e'); }
// leaf veins
leaves.forEach(([a, len]) => {
  const c = Math.cos((a * Math.PI) / 180), s = Math.sin((a * Math.PI) / 180), x0 = PX + c * 14, y0 = PY + 6;
  D(line([[x0 + c * len * 0.12, y0 + s * len * 0.12], [x0 + c * len * 0.9, y0 + s * len * 0.9]]), 1.5, 0.45, '#1f4032');
});
// stack details
for (let i = 0; i < 4; i++) D(line([[644, 843 + i * 5], [862, 843 + i * 5]]), 1, 0.35);
D(line([[708, 896], [776, 896]]), 1.6, 0.6); D(line([[716, 767], [776, 767]]), 1.6, 0.6);
// cup & teapot
D(curve([[CX - 50, 667], [CX, 678], [CX + 50, 667]]), 1.2, 0.35);
D(curve([[TX - 76, 752], [TX, 772], [TX + 76, 752]]), 1.5, 0.4, '#1d2c3c');
D(curve([[TX - 132, 818], [TX, 842], [TX + 132, 818]]), 1.2, 0.4);
D(curve([[TX - 132, 846], [TX, 870], [TX + 132, 846]]), 1.2, 0.4);
// candle
D(line([[108, 772], [108, 760]]), 2, 0.8);
D(curve([[96, 790], [98, 812], [94, 826]]), 1.4, 0.35);
// open book text
for (let i = 0; i < 7; i++) {
  const t = i / 7;
  D(line([[258, 1012 + i * 9 - t * 0, ], [438, 998 + i * 9]]), 1.3, 0.45);
  if (i < 6) D(line([[478, 998 + i * 9], [i === 5 ? 590 : 660, 1012 + i * 9]]), 1.3, 0.45);
}
D(line([[458, 980], [458, 1074]]), 2, 0.5);
// biscuits & apple
for (const [bx, by] of [[800, 1026], [872, 1026], [836, 1040]]) for (const dx of [-12, 0, 12]) D(circle(bx + dx, by, 1.6), 1.4, 0.5);
D(curve([[104, 1002], [106, 990], [112, 982]]), 3, 0.8, '#553420');
// frame inner edge
D(rect(202, 426, 188, 128), 1.6, 0.5);

const activity: PaintActivity = {
  id: 'library-paint',
  version: 2,
  mode: 'paint',
  title: 'Tea and a Good Book',
  blurb: 'A teapot, a steaming cup and a well-thumbed novel beneath a shelf of old favourites.',
  collectionId: 'library',
  categories: ['Still life', 'Cozy', 'Interiors'],
  difficulty: 'Moderate',
  width: 1000,
  height: 1250,
  palette,
  regions,
  detail,
};
export default activity;
