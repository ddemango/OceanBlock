import { rect, ellipse, circle, poly, line, curve, blob, xf, stroke } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { PaintActivity, PaletteColor } from '../types';
import { collector, pot, brush, rotRect, rotPt, M, L, C, type Pt } from './props-paint';

const W = 1000, H = 1250;

const palette: PaletteColor[] = [
  { id: 'oak', number: 1, name: 'Oak table', hex: '#c58e59' },
  { id: 'oakD', number: 2, name: 'Dark oak', hex: '#b07a48' },
  { id: 'birch', number: 3, name: 'Birch', hex: '#f1dcb2' },
  { id: 'cream', number: 4, name: 'Titanium white', hex: '#fdf8ec' },
  { id: 'sky', number: 5, name: 'Sky blue', hex: '#a9d4ea' },
  { id: 'yellow', number: 6, name: 'Cadmium yellow', hex: '#f4c53a' },
  { id: 'orange', number: 7, name: 'Orange', hex: '#ea8a3a' },
  { id: 'red', number: 8, name: 'Vermilion', hex: '#d44a3f' },
  { id: 'pink', number: 9, name: 'Rose tint', hex: '#f1a9a8' },
  { id: 'violet', number: 10, name: 'Violet', hex: '#8a6fb0' },
  { id: 'blue', number: 11, name: 'Ultramarine', hex: '#3d63a8' },
  { id: 'green', number: 12, name: 'Sap green', hex: '#7fb069' },
  { id: 'forest', number: 13, name: 'Viridian', hex: '#3f7a5c' },
  { id: 'glass', number: 14, name: 'Glass', hex: '#dcecef' },
  { id: 'silver', number: 15, name: 'Silver', hex: '#c3c9d0' },
  { id: 'umber', number: 16, name: 'Burnt umber', hex: '#6d4a35' },
  { id: 'charcoal', number: 17, name: 'Charcoal', hex: '#3c3b44' },
];

const { regions, R } = collector();
const detail: Shape[] = [];
const INK = '#4a3a34';

// ---------- table boards ----------
for (let i = 0; i < 5; i++) R(`board-${i + 1}`, rect(0, i * 250, W, 250), i % 2 ? 'oakD' : 'oak');
detail.push(stroke(line([[0, 250], [W, 250]]) + line([[0, 500], [W, 500]]) + line([[0, 750], [W, 750]]) + line([[0, 1000], [W, 1000]]), '#8f5f35', 1.6, { opacity: 0.6 }));
detail.push(stroke(curve([[560, 120], [610, 110], [660, 122]]) + curve([[40, 560], [100, 548], [150, 562]]) + curve([[760, 1020], [830, 1012], [900, 1024]]) + curve([[380, 1230], [450, 1222], [520, 1232]]), '#8f5f35', 1.3, { opacity: 0.5 }));

// ---------- little landscape canvas ----------
{
  const T = (d: string) => xf(d, { rot: -6, ox: 300, oy: 300 });
  R('canvas', T(rect(90, 135, 420, 330, 6)), 'cream');
  R('picture-sky', T(rect(110, 155, 380, 290)), 'sky');
  R('picture-sun', T(circle(408, 222, 30)), 'yellow');
  R('picture-cloud', T(blob([[160, 214], [184, 196], [214, 200], [240, 192], [266, 208], [252, 226], [200, 230], [170, 228]], 1)), 'cream');
  R('picture-mountains', T(poly([[110, 336], [186, 246], [238, 300], [316, 222], [396, 312], [440, 276], [490, 318], [490, 372], [110, 372]])), 'violet');
  R('picture-meadow', T(M(110, 348) + C(200, 318, 320, 344, 490, 330) + L(490, 445) + L(110, 445) + 'Z'), 'green');
  R('picture-lake', T(blob([[262, 384], [330, 368], [420, 372], [462, 390], [410, 408], [320, 410]], 1)), 'blue');
  R('picture-hill', T(M(110, 392) + C(160, 376, 220, 398, 268, 445) + L(110, 445) + 'Z'), 'forest');
  R('picture-tree', T(poly([[178, 286], [212, 380], [144, 380]])), 'forest');
  detail.push(stroke(T(line([[178, 380], [178, 398]])), '#6d4a35', 5));
  detail.push(stroke(T(curve([[300, 388], [340, 384], [380, 390]]) + curve([[350, 398], [384, 395], [420, 398]])), '#fdf8ec', 2, { opacity: 0.8 }));
}

// ---------- jar of brushes ----------
const jar = pot(762, [[268, 84], [300, 90], [476, 78]], 0.25);
R('jar-inside', jar.opening(), 'charcoal');
brush(R, 'brush-1', 722, 312, -24, 270, 'red', 'silver', 'umber', 18);
brush(R, 'brush-4', 802, 312, 22, 258, 'yellow', 'silver', 'umber', 18);
brush(R, 'brush-2', 748, 312, -8, 292, 'forest', 'silver', 'cream', 20);
brush(R, 'brush-3', 778, 312, 7, 280, 'blue', 'silver', 'umber', 18);
R('jar', jar.body(), 'sky');
R('jar-band', jar.band(346, 420), 'cream');
detail.push(stroke(line(jar.front(300).slice(2, -2)), '#7fb4cc', 1.6));

// ---------- glass of rinse water ----------
const glass = pot(884, [[572, 62], [730, 52]], 0.25);
R('glass', glass.body(), 'glass');
R('glass-water', glass.band(622, 730), 'sky');
R('glass-rim', glass.opening(), 'cream');
detail.push(stroke(line(glass.front(572)), '#9dbcc4', 1.6));
detail.push(stroke(line([[846, 640], [844, 716]]), '#ffffff', 3, { opacity: 0.7 }));

// ---------- the palette ----------
R('palette', blob([[138, 786], [182, 676], [296, 610], [452, 596], [604, 640], [696, 760], [688, 890], [598, 978], [446, 1008], [304, 990], [210, 940], [154, 870]], 1), 'birch');
R('palette-hole', ellipse(254, 884, 36, 27, -24), 'oakD');
const dab = (id: string, x: number, y: number, r: number, rot: number, color: string) =>
  R(id, xf(blob([[-1, -0.82], [0.1, -1], [0.92, -0.62], [1, 0.2], [0.42, 0.94], [-0.5, 0.86], [-1.04, 0.16]], 1), { s: r, rot, x, y }), color);
dab('paint-red', 236, 734, 36, 10, 'red');
dab('paint-orange', 312, 672, 35, 70, 'orange');
dab('paint-yellow', 406, 644, 36, 140, 'yellow');
dab('paint-green', 504, 652, 36, 30, 'green');
dab('paint-blue', 592, 702, 36, 200, 'blue');
dab('paint-violet', 646, 786, 35, 100, 'violet');
dab('paint-white', 632, 878, 33, 260, 'cream');
R('mix-pink', blob([[330, 800], [370, 760], [440, 756], [486, 790], [468, 838], [400, 852], [344, 840]], 1), 'pink');
R('mix-sky', blob([[430, 900], [476, 872], [540, 880], [566, 918], [528, 950], [460, 946]], 1), 'sky');
detail.push(stroke(curve([[352, 800], [400, 782], [452, 800]]) + curve([[452, 912], [496, 898], [540, 914]]), '#ffffff', 2.4, { opacity: 0.6 }));
// the brush in use, resting across the palette
brush(R, 'brush-rest', 742, 1002, -52, 300, 'orange', 'silver', 'umber', 20);

// ---------- tubes of paint ----------
function tube(id: string, x: number, y: number, rot: number, color: string) {
  const T = (d: string) => xf(d, { rot, x, y });
  R(`${id}-crimp`, T(rect(-38, 74, 76, 22, 3)), 'silver');
  R(`${id}-body`, T(poly([[-30, -50], [30, -50], [36, 80], [-36, 80]])), 'cream');
  R(`${id}-label`, T(poly([[-31.7, -14], [31.7, -14], [34.4, 46], [-34.4, 46]])), color);
  R(`${id}-shoulder`, T(poly([[-30, -50], [-14, -74], [14, -74], [30, -50]])), 'silver');
  R(`${id}-cap`, T(rect(-15, -102, 30, 30, 5)), 'charcoal');
  detail.push(stroke(T(line([[-34, 80], [34, 80]]) + line([[-36, 87], [36, 87]])), '#8d97a4', 1.4));
  detail.push(stroke(T(rect(-18, 2, 36, 26, 3)), '#fdf8ec', 2, { opacity: 0.85 }));
}
tube('tube-red', 98, 1132, -12, 'red');
tube('tube-blue', 206, 1130, 3, 'blue');
tube('tube-yellow', 318, 1134, 14, 'yellow');

// ---------- pencils ----------
function pencil(id: string, x: number, y: number, rot: number, color: string) {
  R(`${id}-eraser`, rotRect(...rotPt(x, y, rot, -160, 0), 30, 24, rot, 6), 'pink');
  R(`${id}-body`, rotRect(...rotPt(x, y, rot, -24, 0), 250, 24, rot), color);
  R(`${id}-tip`, poly([rotPt(x, y, rot, 100, -12), rotPt(x, y, rot, 146, 0), rotPt(x, y, rot, 100, 12)]), 'birch');
  detail.push(stroke(line([rotPt(x, y, rot, 134, 0), rotPt(x, y, rot, 146, 0)]), INK, 5));
  detail.push(stroke(line([rotPt(x, y, rot, -146, -4), rotPt(x, y, rot, 98, -4)]), '#ffffff', 1.6, { opacity: 0.45 }));
  detail.push(stroke(line([rotPt(x, y, rot, -146, -12), rotPt(x, y, rot, -146, 12)]), '#8d97a4', 4));
}
pencil('pencil-green', 792, 1092, -14, 'green');
pencil('pencil-violet', 806, 1138, -14, 'violet');
pencil('pencil-red', 784, 1186, -14, 'red');

// ---------- drips on the table ----------
R('drip-blue', blob([[452, 1090], [476, 1076], [500, 1092], [494, 1116], [466, 1120]], 1), 'blue');
R('drip-green', blob([[52, 596], [76, 584], [96, 600], [88, 624], [60, 626]], 1), 'green');
R('drip-red', blob([[588, 512], [606, 500], [624, 514], [616, 538], [594, 536]], 1), 'red');
R('drip-yellow', blob([[520, 1160], [540, 1150], [556, 1164], [546, 1184], [524, 1182]], 1), 'yellow');

const activity: PaintActivity = {
  id: 'crafts-paint-3', version: 1, mode: 'paint', title: "The Painter's Table", blurb: "A well-loved palette dotted with colour sits among brushes in a jar, tubes of paint, sharpened pencils and a little landscape just finished.",
  collectionId: 'crafts', categories: ["Crafts", "Cozy"], difficulty: 'Moderate',
  added: '2026-11-26',
  width: W, height: H, palette, regions, detail,
};
export default activity;
