import { rect, ellipse, circle, poly, line, curve, blob, leaf, xf, stroke } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { PaintActivity, PaletteColor } from '../types';
import { collector, rrect, trunk, M, L, Q, type Pt } from './props-paint';

const W = 1000, H = 1250;

const palette: PaletteColor[] = [
  { id: 'oakL', number: 1, name: 'Light oak', hex: '#e4b882' },
  { id: 'oakM', number: 2, name: 'Warm oak', hex: '#c98f58' },
  { id: 'oakD', number: 3, name: 'Dark oak', hex: '#9a6840' },
  { id: 'teal', number: 4, name: 'Suitcase teal', hex: '#2f8a88' },
  { id: 'charcoal', number: 5, name: 'Charcoal', hex: '#3a3a44' },
  { id: 'lining', number: 6, name: 'Blush lining', hex: '#f4d6c8' },
  { id: 'rose', number: 7, name: 'Dusty rose', hex: '#e3a99a' },
  { id: 'cream', number: 8, name: 'Cotton cream', hex: '#fbf4e4' },
  { id: 'navy', number: 9, name: 'Navy', hex: '#2f4a6d' },
  { id: 'denim', number: 10, name: 'Faded denim', hex: '#6f95c6' },
  { id: 'mustard', number: 11, name: 'Mustard knit', hex: '#e7b443' },
  { id: 'coral', number: 12, name: 'Coral', hex: '#e4705c' },
  { id: 'sage', number: 13, name: 'Sage', hex: '#9bbb88' },
  { id: 'brass', number: 14, name: 'Brass', hex: '#c9a24a' },
  { id: 'straw', number: 15, name: 'Straw', hex: '#edd49c' },
  { id: 'sky', number: 16, name: 'Lake blue', hex: '#9fd0e0' },
  { id: 'silver', number: 17, name: 'Silver', hex: '#c8cbd0' },
];

const { regions, R } = collector();
const detail: Shape[] = [];
const INK = '#4b3a33';

// ---------- wooden floor: planks with staggered seams ----------
{
  const woods = ['oakL', 'oakM', 'oakD'];
  const seams = [380, 610, 470, 700, 330, 560, 420, 650, 300];
  const ph = H / 9;
  for (let i = 0; i < 9; i++) {
    const y = i * ph;
    R(`plank-${i + 1}-a`, rect(0, y, seams[i], ph), woods[i % 3]);
    R(`plank-${i + 1}-b`, rect(seams[i], y, W - seams[i], ph), woods[(i + 1) % 3]);
  }
}

// ---------- folded map beside the case ----------
{
  const T = (d: string) => xf(d, { rot: 4, ox: 885, oy: 230 });
  const x0 = 785, y0 = 50, pw = 100, ph = 180;
  for (let c = 0; c < 2; c++) for (let r = 0; r < 2; r++) {
    R(`map-panel-${c + 1}-${r + 1}`, T(rect(x0 + c * pw, y0 + r * ph, pw, ph)), (c + r) % 2 ? 'straw' : 'cream');
  }
  R('map-land-1', T(blob([[800, 120], [840, 82], [910, 96], [960, 150], [950, 240], [900, 270], [850, 250], [810, 200]], 1)), 'sage');
  R('map-land-2', T(blob([[880, 330], [930, 300], [972, 330], [966, 390], [910, 400], [870, 370]], 1)), 'sage');
  R('map-lake', T(blob([[870, 150], [905, 132], [930, 160], [915, 200], [880, 196]], 1)), 'sky');
  R('map-sea', T(blob([[795, 300], [830, 290], [850, 340], [835, 400], [795, 400]], 0.8)), 'sky');
  detail.push(stroke(T(curve([[812, 380], [836, 330], [856, 290], [846, 250], [862, 224], [898, 220], [930, 246], [946, 290], [950, 330]], 0.8)), '#d0473a', 2.5));
  R('map-pin-tip', T(poly([[938, 352], [962, 352], [950, 380]])), 'coral');
  R('map-pin', T(circle(950, 345, 16)), 'coral');
  R('map-pin-dot', T(circle(950, 345, 6)), 'cream');
  detail.push(stroke(T(line([[885, 50], [885, 410]]) + line([[785, 230], [985, 230]])), '#b89a62', 1.5));
}

// ---------- compass ----------
R('compass-case', circle(84, 92, 62), 'brass');
R('compass-face', circle(84, 92, 48), 'cream');
R('compass-north', poly([[84, 48], [96, 92], [72, 92]]), 'coral');
R('compass-south', poly([[84, 136], [96, 92], [72, 92]]), 'navy');
R('compass-pin', circle(84, 92, 7), 'charcoal');
{
  let ticks = '';
  for (let k = 0; k < 16; k++) {
    const a = (k * Math.PI) / 8, r0 = k % 4 ? 42 : 38;
    ticks += line([[84 + Math.cos(a) * r0, 92 + Math.sin(a) * r0], [84 + Math.cos(a) * 46, 92 + Math.sin(a) * 46]]);
  }
  detail.push(stroke(ticks, INK, 1.4));
}

// ---------- flip-flops ----------
function flipflop(id: string, cx: number, cy: number, rot: number, color: string) {
  const T = (d: string) => xf(d, { rot, x: cx, y: cy });
  R(`${id}-sole`, T(blob([[0, -112], [30, -96], [38, -40], [28, 20], [34, 80], [18, 112], [-18, 112], [-34, 80], [-28, 20], [-36, -40], [-30, -96]], 1)), color);
  R(`${id}-strap`, T(poly([[-30, -6], [-2, -66], [2, -66], [30, -6], [18, -2], [0, -44], [-18, -2]])), 'navy');
  detail.push(stroke(T(circle(0, -64, 3)), INK, 2));
}
flipflop('flipflop-left', 52, 420, -6, 'coral');
flipflop('flipflop-right', 128, 470, 8, 'coral');

// ---------- the open suitcase (whole case rotated a little) ----------
const ROT = { rot: -4, ox: 490, oy: 545 };
const S = (d: string) => xf(d, ROT);
const sp = (x: number, y: number): [number, number] => {
  const a = (ROT.rot * Math.PI) / 180, dx = x - ROT.ox, dy = y - ROT.oy;
  return [ROT.ox + dx * Math.cos(a) - dy * Math.sin(a), ROT.oy + dx * Math.sin(a) + dy * Math.cos(a)];
};
const RS = (id: string, d: string, color: string, label?: Pt) => R(id, S(d), color, label ? sp(label[0], label[1]) : undefined);

// lid
RS('lid-shell', rrect(190, 80, 600, 440, [40, 40, 40, 40]), 'teal');
RS('lid-lining', rrect(214, 104, 552, 392, [26, 26, 26, 26]), 'lining');
RS('postcard', xf(rrect(-70, -46, 140, 92, [4, 4, 4, 4]), { rot: -6, x: 380, y: 330 }), 'sky');
RS('postcard-stamp', xf(rrect(30, -38, 28, 32, [2, 2, 2, 2]), { rot: -6, x: 380, y: 330 }), 'coral');
RS('lid-pocket', rrect(240, 316, 500, 156, [18, 18, 18, 18]), 'rose');
RS('lid-zip-pull', rrect(694, 320, 16, 30, [6, 6, 6, 6]), 'brass');
// boarding pass tucked behind the passport
RS('ticket', xf(rrect(-96, -38, 150, 76, [6, 6, 6, 6]), { rot: 12, x: 430, y: 230 }), 'cream');
RS('ticket-stub', xf(rrect(54, -38, 46, 76, [0, 6, 6, 0]), { rot: 12, x: 430, y: 230 }), 'coral');
RS('passport', rrect(262, 128, 124, 168, [8, 8, 8, 8]), 'navy');
RS('passport-globe', circle(324, 196, 30), 'brass');
// sunglasses on the lining
RS('glasses-frame-left', ellipse(554, 214, 56, 48), 'coral');
RS('glasses-frame-right', ellipse(674, 214, 56, 48), 'coral');
RS('glasses-lens-left', ellipse(554, 216, 42, 34), 'charcoal');
RS('glasses-lens-right', ellipse(674, 216, 42, 34), 'charcoal');

// base
RS('base-shell', rrect(190, 540, 600, 470, [40, 40, 40, 40]), 'teal');
RS('base-lining', rrect(214, 564, 552, 422, [26, 26, 26, 26]), 'lining');
RS('handle', rrect(788, 700, 28, 140, [0, 14, 14, 0]), 'charcoal');
RS('hinge-1', rrect(300, 508, 64, 44, [6, 6, 6, 6]), 'silver');
RS('hinge-2', rrect(616, 508, 64, 44, [6, 6, 6, 6]), 'silver');
for (const [k, x, y, r] of [
  [1, 186, 76, [26, 6, 6, 6]], [2, 742, 76, [6, 26, 6, 6]], [3, 742, 472, [6, 6, 26, 6]], [4, 186, 472, [6, 6, 6, 26]],
  [5, 186, 536, [26, 6, 6, 6]], [6, 742, 536, [6, 26, 6, 6]], [8, 186, 966, [6, 6, 6, 26]],
] as [number, number, number, [number, number, number, number]][]) {
  RS(`corner-${k}`, rrect(x, y, 52, 48, r), 'charcoal');
}

// striped tee
RS('tee', rrect(236, 588, 252, 170, [12, 12, 12, 12]), 'cream');
RS('tee-stripe-1', rect(236, 638, 252, 18), 'navy', [362, 647]);
RS('tee-stripe-2', rect(236, 678, 252, 18), 'navy', [362, 687]);
RS('tee-stripe-3', rect(236, 718, 252, 18), 'navy', [362, 727]);
RS('tee-collar', M(318, 588) + Q(362, 632, 406, 588) + 'Z', 'coral');
// denim shorts
RS('shorts', rrect(508, 588, 236, 170, [12, 12, 12, 12]), 'denim');
RS('shorts-waistband', rrect(508, 588, 236, 30, [12, 12, 0, 0]), 'navy', [580, 603]);
RS('shorts-button', circle(626, 603, 8), 'brass');
RS('shorts-pocket', poly([[600, 650], [692, 650], [692, 704], [646, 724], [600, 704]]), 'sky');
// compression strap
RS('strap', rect(214, 764, 552, 20), 'charcoal', [300, 774]);
RS('buckle', rrect(470, 756, 44, 36, [6, 6, 6, 6]), 'brass');
// knit jumper
RS('jumper', rrect(236, 796, 252, 168, [12, 12, 12, 12]), 'mustard');
RS('jumper-rib', rrect(236, 926, 252, 38, [0, 0, 12, 12]), 'oakL');
// wash bag and socks
RS('washbag', rrect(508, 800, 150, 112, [16, 16, 16, 16]), 'sage');
RS('washbag-zip', rect(508, 818, 150, 14), 'brass', [560, 825]);
RS('washbag-tag', rrect(640, 836, 24, 30, [4, 4, 4, 4]), 'coral');
RS('socks-1', circle(708, 836, 36), 'coral');
RS('socks-2', circle(708, 920, 36), 'cream');
RS('sunscreen', rrect(518, 924, 130, 40, [18, 18, 18, 18]), 'cream');
RS('sunscreen-cap', rrect(518, 924, 36, 40, [18, 0, 0, 18]), 'coral');

// line work on the case
detail.push(stroke(S(
  line([[250, 328], [730, 328]]) // pocket zip
), '#7f5a52', 2));
detail.push(stroke(S(
  curve([[300, 806], [292, 860], [300, 920]]) + curve([[324, 806], [332, 860], [324, 920]]) + curve([[400, 806], [392, 860], [400, 920]]) + curve([[424, 806], [432, 860], [424, 920]]) +
  line([[260, 934], [260, 960]]) + line([[300, 934], [300, 960]]) + line([[340, 934], [340, 960]]) + line([[380, 934], [380, 960]]) + line([[420, 934], [420, 960]]) + line([[460, 934], [460, 960]])
), '#b98622', 1.8));
detail.push(stroke(S(
  curve([[686, 828], [700, 818], [716, 828], [710, 846]]) + curve([[686, 912], [700, 902], [716, 912], [710, 930]]) +
  line([[540, 620], [540, 756]]) + curve([[600, 650], [646, 660], [692, 650]])
), INK, 1.6, { opacity: 0.6 }));
detail.push(stroke(S(curve([[296, 196], [324, 186], [352, 196]]) + curve([[296, 196], [324, 206], [352, 196]]) + line([[324, 166], [324, 226]]) + circle(324, 196, 30)), '#7a5f22', 1.6));
detail.push(stroke(S(curve([[610, 210], [614, 200], [618, 210]]) + line([[498, 200], [470, 190]]) + line([[730, 200], [758, 190]])), '#a54f40', 4));
detail.push(stroke(S(line([[526, 196], [546, 184]]) + line([[646, 196], [666, 184]])), '#ffffff', 3, { opacity: 0.6 }));
detail.push(stroke(S(xf(line([[78, -24], [78, 24]]) + line([[-80, -20], [-80, 20]]) + line([[-74, -20], [-74, 20]]) + line([[-66, -20], [-66, 20]]) + line([[-60, -20], [-60, 20]]), { rot: 12, x: 430, y: 230 })), INK, 2));
detail.push(stroke(S(xf(line([[-40, -12], [10, -12]]) + line([[-40, 4], [20, 4]]), { rot: 12, x: 430, y: 230 })), '#b0a48e', 3));

// ---------- travel journal and pencil ----------
{
  const T = (d: string) => xf(d, { rot: -8, x: 480, y: 1130 });
  R('journal', T(rrect(-100, -70, 200, 140, [10, 10, 10, 10])), 'sage');
  R('journal-band', T(rect(56, -70, 16, 140)), 'charcoal', [544, 1112]);
  R('pencil', T(xf(rrect(-80, -9, 150, 18, [2, 2, 2, 2]), { rot: 6, x: 10, y: 92 })), 'mustard', [492, 1222]);
  R('pencil-tip', T(xf(poly([[70, -9], [96, 0], [70, 9]]), { rot: 6, x: 10, y: 92 })), 'cream');
  detail.push(stroke(T(line([[-80, -40], [30, -40]]) + line([[-80, -20], [20, -20]])), '#5f7d52', 2));
}

// ---------- vintage camera with its strap ----------
{
  const strapT = trunk([28, 1220], [330, 1206], -120, 16, 16);
  R('camera-strap', strapT.outline(), 'navy');
  const T = (d: string) => xf(d, { rot: 10, x: 182, y: 1110 });
  R('camera-body', T(rrect(-132, -40, 264, 120, [6, 6, 16, 16])), 'charcoal');
  R('camera-top', T(rrect(-132, -72, 264, 36, [16, 16, 0, 0])), 'silver');
  R('camera-finder', T(poly([[-36, -72], [-24, -96], [24, -96], [36, -72]])), 'charcoal');
  R('camera-button', T(rrect(-104, -88, 28, 18, [6, 6, 0, 0])), 'coral');
  R('camera-flash', T(rrect(70, -62, 46, 18, [4, 4, 4, 4])), 'cream');
  R('camera-lens-ring', T(circle(0, 22, 56)), 'silver');
  R('camera-lens', T(circle(0, 22, 42)), 'charcoal');
  R('camera-glass', T(circle(0, 22, 28)), 'navy');
  R('camera-glint', T(ellipse(-10, 12, 9, 6, -30)), 'cream');
  R('camera-grip', T(rrect(-120, -24, 26, 92, [6, 6, 6, 6])), 'oakD');
}

// ---------- straw sunhat ----------
{
  const hx = 806, hy = 1094;
  R('hat-brim', circle(hx, hy, 150), 'straw');
  R('hat-ribbon', circle(hx, hy, 98), 'coral');
  R('hat-crown', circle(hx, hy, 84), 'straw');
  R('hat-crown-top', circle(hx - 8, hy - 8, 56), 'cream');
  R('hat-bow-1', leaf(hx - 72, hy + 62, 70, 26, 150), 'rose');
  R('hat-bow-2', leaf(hx - 72, hy + 62, 64, 24, 100), 'rose');
  R('hat-knot', circle(hx - 72, hy + 62, 13), 'coral');
  let weave = '';
  for (const r of [112, 126, 140]) weave += circle(hx, hy, r);
  detail.push(stroke(weave, '#c9a865', 1.4));
  detail.push(stroke(circle(hx, hy, 70), '#c9a865', 1.4));
}

const activity: PaintActivity = {
  id: 'roadtrip-paint-3', version: 1, mode: 'paint', title: 'Packed for Adventure',
  blurb: 'An open suitcase of neatly folded holiday clothes, with a camera, map, passport, sunhat and sunglasses ready for the road.',
  collectionId: 'roadtrip', categories: ["Travel"], difficulty: 'Detailed',
  width: W, height: H, palette, regions, detail,
};
export default activity;
