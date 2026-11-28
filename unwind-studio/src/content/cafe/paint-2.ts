import { rect, ellipse, circle, poly, line, curve, blob, xf, stroke } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { PaintActivity, PaletteColor } from '../types';
import { collector, vessel, crescent, mugHandle, steam, M, L, C, type Pt } from './props-paint';

const W = 1000, H = 1250;

const palette: PaletteColor[] = [
  { id: 'wall', number: 1, name: 'Linen wall', hex: '#f1e5cf' },
  { id: 'glow', number: 2, name: 'Lamp glow', hex: '#f9e2a2' },
  { id: 'cream', number: 3, name: 'Wool white', hex: '#fdf7ea' },
  { id: 'tealL', number: 4, name: 'Sea glass', hex: '#7ab5ac' },
  { id: 'teal', number: 5, name: 'Teal velvet', hex: '#3e8984' },
  { id: 'tealD', number: 6, name: 'Deep teal', hex: '#285f5c' },
  { id: 'mustard', number: 7, name: 'Mustard', hex: '#e0a53b' },
  { id: 'rose', number: 8, name: 'Terracotta', hex: '#cf7556' },
  { id: 'woodL', number: 9, name: 'Light oak', hex: '#d9a96f' },
  { id: 'woodM', number: 10, name: 'Warm oak', hex: '#b37b4a' },
  { id: 'woodD', number: 11, name: 'Walnut', hex: '#76492f' },
  { id: 'sky', number: 12, name: 'Soft sky', hex: '#a9c7de' },
  { id: 'leaf', number: 13, name: 'Meadow green', hex: '#7fa863' },
  { id: 'navy', number: 14, name: 'Ink blue', hex: '#34445f' },
];

const { regions, R } = collector();
const detail: Shape[] = [];

// ---------- room ----------
R('wall', rect(0, 0, W, 800), 'wall');
R('lamp-glow-up', poly([[44, 152], [148, 152], [226, 0], [0, 0], [0, 60]]), 'glow', [96, 70]);
R('lamp-glow-down', poly([[10, 296], [182, 296], [250, 780], [0, 780], [0, 340]]), 'glow', [60, 560]);
R('skirting', rect(0, 780, W, 30), 'cream', [30, 795]);
R('floor-1', rect(0, 810, W, 120), 'woodM');
R('floor-2', rect(0, 930, W, 150), 'woodL');
R('floor-3', rect(0, 1080, W, 170), 'woodM');

// ---------- picture above the sofa ----------
R('frame', rect(326, 120, 348, 250, 6), 'woodD');
R('mat', rect(348, 142, 304, 206), 'cream');
R('picture-sky', rect(372, 166, 256, 158), 'sky');
R('picture-sun', circle(574, 214, 26), 'mustard');
R('picture-hill-back', M(372, 268) + C(420, 226, 480, 224, 530, 254) + C(570, 276, 600, 240, 628, 236) + L(628, 324) + L(372, 324) + 'Z', 'leaf');
R('picture-hill-front', M(372, 300) + C(430, 266, 500, 270, 560, 296) + C(590, 308, 610, 300, 628, 290) + L(628, 324) + L(372, 324) + 'Z', 'teal');

// ---------- floor lamp ----------
R('lamp-pole', rect(88, 250, 16, 640), 'woodD', [96, 600]);
R('lamp-base', ellipse(96, 892, 64, 15), 'woodD');
R('lamp-shade', poly([[44, 150], [148, 150], [182, 290], [10, 290]]), 'cream');
R('lamp-shade-band', poly([[13, 274], [179, 274], [184, 300], [8, 300]]), 'mustard', [96, 287]);

// ---------- rug ----------
R('rug', blob([[140, 960], [860, 960], [968, 1196], [32, 1196]], 0.15), 'rose');
R('rug-field', blob([[178, 986], [822, 986], [910, 1170], [90, 1170]], 0.15), 'cream');
R('rug-diamond', poly([[500, 1000], [700, 1078], [500, 1156], [300, 1078]]), 'mustard');
R('rug-tri-left', poly([[300, 1078], [360, 1040], [360, 1116]]), 'teal');
R('rug-tri-right', poly([[700, 1078], [640, 1040], [640, 1116]]), 'teal');
R('rug-diamond-centre', poly([[500, 1046], [560, 1078], [500, 1110], [440, 1078]]), 'rose');

// ---------- the sofa ----------
R('sofa-leg-left', poly([[196, 840], [226, 840], [220, 906], [204, 906]]), 'woodD');
R('sofa-leg-right', poly([[774, 840], [804, 840], [796, 906], [780, 906]]), 'woodD');
R('sofa-back', rect(186, 430, 628, 320, 56), 'tealD');
R('back-cushion-left', rect(226, 462, 272, 222, 40), 'teal');
R('back-cushion-right', rect(502, 462, 272, 222, 40), 'teal');
R('seat-cushion-left', rect(214, 668, 290, 92, 30), 'tealL');
R('seat-cushion-right', rect(496, 668, 290, 92, 30), 'tealL');
R('sofa-apron', rect(172, 744, 656, 104, 24), 'tealD');
R('arm-left', rect(132, 600, 128, 248, 46), 'teal');
R('arm-left-top', ellipse(196, 614, 64, 28), 'tealL');
R('arm-right', rect(740, 600, 128, 248, 46), 'teal');
R('arm-right-top', ellipse(804, 614, 64, 28), 'tealL');

// knitted throw over the back of the sofa
R('throw', M(560, 452) + C(600, 424, 720, 420, 772, 440) + C(778, 560, 790, 680, 802, 800) + C(740, 812, 660, 816, 590, 812) + C(584, 700, 570, 580, 560, 452) + 'Z', 'cream');
R('throw-fold', M(560, 452) + C(600, 424, 720, 420, 772, 440) + L(774, 486) + C(720, 470, 610, 474, 562, 498) + 'Z', 'glow', [668, 462]);
R('throw-stripe-1', M(565, 514) + C(640, 504, 720, 504, 776, 512) + L(778, 544) + C(720, 536, 640, 536, 567, 546) + 'Z', 'rose', [670, 525]);
R('throw-stripe-2', M(580, 712) + C(650, 704, 730, 704, 796, 712) + L(798, 742) + C(730, 734, 650, 734, 582, 742) + 'Z', 'rose', [772, 726]);

// cushions
R('pillow-mustard', xf(blob([[-74, -70], [0, -80], [74, -72], [84, 0], [74, 70], [0, 80], [-74, 72], [-84, 0]], 0.55), { rot: -10, x: 318, y: 618 }), 'mustard');
R('pillow-mustard-shade', crescent(318, 618, 78, 76, 10, 110, 0.3, -10), 'woodL');
R('pillow-rose', xf(blob([[-66, -64], [0, -72], [66, -66], [76, 0], [66, 64], [0, 72], [-66, 66], [-76, 0]], 0.55), { rot: 9, x: 660, y: 640 }), 'rose');
R('pillow-rose-stripe', xf(rect(-74, -15, 148, 30, 4), { rot: 9, x: 660, y: 640 }), 'cream');
R('pillow-round', ellipse(462, 652, 60, 52), 'cream');
R('pillow-round-button', circle(462, 652, 13), 'mustard');

// ---------- side table ----------
R('table-stem', rect(910, 770, 24, 120), 'woodD', [922, 840]);
R('table-foot', ellipse(922, 896, 56, 13), 'woodD');
R('table-edge', ellipse(922, 774, 76, 22), 'woodD');
R('table-top', ellipse(922, 764, 76, 22), 'woodM');
R('book-1', rect(860, 716, 128, 30, 3), 'navy');
R('book-1-pages', rect(950, 722, 32, 18), 'cream');
R('book-2', rect(870, 686, 116, 30, 3), 'mustard');
R('book-2-pages', rect(878, 692, 30, 18), 'cream');
R('book-3', rect(864, 658, 122, 28, 3), 'leaf');
R('book-3-pages', rect(948, 664, 30, 16), 'cream');
R('steam', steam(918, 588, 130, 12, 24, 0.8), 'cream');
const mug = vessel(916, [[590, 44], [656, 40]], 0.26);
R('mug-handle', mugHandle(960, 604, 646, 34, 14), 'rose');
R('mug', mug.body(), 'rose');
R('mug-rim', mug.opening(), 'cream');
R('mug-coffee', mug.opening(12, 4), 'woodD');

// ---------- yarn basket ----------
R('yarn-teal', circle(126, 1020, 52), 'teal');
R('yarn-mustard', circle(214, 1032, 46), 'mustard');
R('basket', M(54, 1040) + L(290, 1040) + C(284, 1110, 270, 1170, 236, 1190) + L(108, 1190) + C(74, 1170, 60, 1110, 54, 1040) + 'Z', 'woodL');
R('basket-rim', rect(46, 1030, 252, 30, 12), 'woodM', [172, 1045]);

// slippers
function slipper(id: string, x: number, y: number, rot: number) {
  const t = { rot, x, y };
  R(id, xf(ellipse(0, 0, 40, 80), t), 'navy');
  R(`${id}-lining`, xf(ellipse(0, 22, 24, 46), t), 'glow');
  R(`${id}-toe`, xf(M(-40, -6) + C(-40, -60, -22, -80, 0, -80) + C(22, -80, 40, -60, 40, -6) + C(20, 6, -20, 6, -40, -6) + 'Z', t), 'navy');
}
slipper('slipper-left', 760, 1120, -16);
slipper('slipper-right', 856, 1110, 8);

// ---------- line work ----------
// floor boards
detail.push(stroke(line([[330, 852], [330, 930]]) + line([[640, 852], [640, 930]]) + line([[160, 930], [160, 958]]) + line([[560, 930], [560, 958]]) + line([[300, 1212], [300, 1250]]) + line([[700, 1212], [700, 1250]]), '#8f5e35', 1.4, { opacity: 0.6 }));
// tufting buttons and cushion seams
{
  let d = '';
  for (const [x, y] of [[300, 530], [420, 530], [580, 530], [700, 530]] as Pt[]) d += circle(x, y, 3);
  detail.push(stroke(d, '#1f4a47', 2));
  detail.push(stroke(curve([[150, 640], [196, 650], [244, 640]]) + curve([[756, 640], [804, 650], [852, 640]]), '#2f6f6a', 1.6));
}
// knit stitches on the throw
{
  let d = '';
  for (const x0 of [600, 640, 680, 720, 756]) for (const y of [564, 754, 778]) {
    const x = x0 + (y - 500) * 0.06;
    d += line([[x - 7, y], [x, y + 9], [x + 7, y]]);
  }
  detail.push(stroke(d, '#d6c29a', 1.6));
  let f = '';
  for (let x = 596; x <= 796; x += 10) f += line([[x, 812 - (x - 596) * 0.05], [x - 2, 828 - (x - 596) * 0.05]]);
  detail.push(stroke(f, '#d6c29a', 2.2));
}
// yarn wraps and needles
detail.push(stroke(curve([[90, 990], [126, 1010], [160, 1044]]) + curve([[80, 1020], [120, 1036], [150, 1064]]) + curve([[100, 976], [140, 990], [172, 1016]]), '#2a625e', 1.8));
detail.push(stroke(curve([[184, 1004], [214, 1020], [246, 1046]]) + curve([[176, 1032], [206, 1046], [232, 1068]]), '#b07a24', 1.8));
detail.push(stroke(line([[150, 1050], [262, 960]]) + line([[170, 1052], [282, 980]]), '#8a5a3a', 3));
detail.push(stroke(curve([[70, 1090], [172, 1100], [276, 1090]]) + curve([[80, 1130], [172, 1140], [266, 1130]]) + curve([[96, 1166], [172, 1174], [250, 1166]]), '#a7773f', 1.6));
// rug fringe
{
  let d = '';
  for (let x = 50; x <= 950; x += 18) d += line([[x, 1198], [x, 1216]]);
  detail.push(stroke(d, '#e9d9b8', 2));
}
// lamp light rays and the mug's heart line
detail.push(stroke(line([[60, 170], [130, 170]]), '#e8d3a8', 1.4));

const activity: PaintActivity = {
  id: 'cafe-paint-2', version: 1, mode: 'paint', title: 'The Comfy Sofa',
  blurb: 'A deep teal sofa piled with cushions and a knitted throw, lit by a floor lamp beside a little table of books and a warm mug.',
  added: '2026-11-25', collectionId: 'cafe', categories: ["Cozy", "Coffeehouse"], difficulty: 'Relaxed',
  width: W, height: H, palette, regions, detail,
};
export default activity;
