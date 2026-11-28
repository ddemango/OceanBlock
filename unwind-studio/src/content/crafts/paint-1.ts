import { rect, ellipse, circle, poly, line, curve, star, stroke } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { PaintActivity, PaletteColor } from '../types';
import { collector, heart, stitches, M, L, Q, type Pt } from './props-paint';

const W = 1000, H = 1250;

const palette: PaletteColor[] = [
  { id: 'wall', number: 1, name: 'Sage wall', hex: '#dfe4d2' },
  { id: 'cream', number: 2, name: 'Calico cream', hex: '#fbf3e0' },
  { id: 'butter', number: 3, name: 'Butter', hex: '#f5dc94' },
  { id: 'mustard', number: 4, name: 'Mustard', hex: '#e3a83a' },
  { id: 'pink', number: 5, name: 'Rosebud', hex: '#f2b9b6' },
  { id: 'rose', number: 6, name: 'Dusty rose', hex: '#d9737a' },
  { id: 'red', number: 7, name: 'Barn red', hex: '#b5413e' },
  { id: 'sky', number: 8, name: 'Chambray', hex: '#bcd4e4' },
  { id: 'blue', number: 9, name: 'Cornflower', hex: '#6c93bd' },
  { id: 'navy', number: 10, name: 'Indigo', hex: '#2f4668' },
  { id: 'sage', number: 11, name: 'Sage', hex: '#93b281' },
  { id: 'forest', number: 12, name: 'Forest', hex: '#4c7859' },
  { id: 'woodL', number: 13, name: 'Maple', hex: '#dba76c' },
  { id: 'woodD', number: 14, name: 'Walnut', hex: '#8a5836' },
  { id: 'silver', number: 15, name: 'Silver', hex: '#cfd4da' },
  { id: 'steel', number: 16, name: 'Pewter', hex: '#8d97a4' },
];

const { regions, R } = collector();
const detail: Shape[] = [];
const THREAD = '#fffaf0', INK = '#4a3a34';

// ---------- room ----------
R('wall', rect(0, 0, W, 970), 'wall');
R('skirting', rect(0, 962, W, 74), 'cream');
R('table-top', rect(0, 1030, W, 190), 'woodL');
R('table-edge', rect(0, 1214, W, 36), 'woodD');

// ---------- hanging rail ----------
R('rail', rect(56, 84, 888, 22, 8), 'woodD');
R('rail-knob-left', circle(56, 95, 22), 'woodL');
R('rail-knob-right', circle(944, 95, 22), 'woodL');

// ---------- the quilt ----------
const S = 210;
const BX = [169, 395, 621], BY = [189, 415, 641];
R('binding', rect(102, 122, 796, 796, 8), 'red');
R('border', rect(122, 142, 756, 756), 'butter');
R('sashing', rect(153, 173, 694, 694), 'navy');
for (const [i, x] of [379, 605].entries()) for (const [j, y] of [399, 625].entries()) {
  R(`cornerstone-${i + 1}-${j + 1}`, rect(x, y, 16, 16), 'mustard');
}
for (const [i, x] of [230, 470, 710].entries()) R(`tab-${i + 1}`, rect(x, 70, 60, 70, 6), ['rose', 'blue', 'sage'][i]);

/** Eight-point star on a plain square with corner triangles. */
function starBlock(id: string, x: number, y: number, bg: string, corner: string, body: string, centre: string) {
  R(`${id}-ground`, rect(x, y, S, S), bg);
  const k = 56;
  R(`${id}-corner-1`, poly([[x, y], [x + k, y], [x, y + k]]), corner);
  R(`${id}-corner-2`, poly([[x + S, y], [x + S, y + k], [x + S - k, y]]), corner);
  R(`${id}-corner-3`, poly([[x + S, y + S], [x + S - k, y + S], [x + S, y + S - k]]), corner);
  R(`${id}-corner-4`, poly([[x, y + S], [x, y + S - k], [x + k, y + S]]), corner);
  R(`${id}-star`, star(x + S / 2, y + S / 2, 92, 42, 8), body);
  R(`${id}-centre`, circle(x + S / 2, y + S / 2, 24), centre);
}

/** Flying geese: two columns (or rows) of three triangles. */
function geeseBlock(id: string, x: number, y: number, bg: string, colors: string[], sideways: boolean) {
  R(`${id}-ground`, rect(x, y, S, S), bg);
  const P = (u: number, v: number): Pt => (sideways ? [x + v, y + u] : [x + u, y + v]);
  for (let c = 0; c < 2; c++) for (let g = 0; g < 3; g++) {
    const mid = c ? 153 : 57, top = 16 + g * 62, up = c === 0;
    const tri: Pt[] = up
      ? [P(mid, top), P(mid + 42, top + 54), P(mid - 42, top + 54)]
      : [P(mid, top + 54), P(mid - 42, top), P(mid + 42, top)];
    R(`${id}-goose-${c + 1}-${g + 1}`, poly(tri), colors[(g + c) % colors.length]);
  }
}

/** A heart stitched onto a four-patch. */
function heartBlock(id: string, x: number, y: number, a: string, b: string, body: string, inner: string) {
  const h = S / 2;
  R(`${id}-patch-1`, rect(x, y, h, h), a);
  R(`${id}-patch-2`, rect(x + h, y, h, h), b);
  R(`${id}-patch-3`, rect(x, y + h, h, h), b);
  R(`${id}-patch-4`, rect(x + h, y + h, h, h), a);
  R(`${id}-heart`, heart(x + h, y + h + 2, 150), body);
  R(`${id}-heart-inner`, heart(x + h, y + h, 62), inner);
  detail.push(stroke(heart(x + h, y + h + 2, 132), THREAD, 1.6, { opacity: 0.8 }));
}

/** Log cabin: strips spiralling round a centre square, light on one side and dark on the other. */
function logCabin(id: string, x: number, y: number) {
  const u = S / 5;
  const strips: [number, number, number, number, string][] = [
    [2, 2, 1, 1, 'red'],
    [3, 2, 1, 1, 'butter'], [2, 3, 2, 1, 'pink'], [1, 2, 1, 2, 'navy'], [1, 1, 3, 1, 'blue'],
    [4, 1, 1, 3, 'cream'], [1, 4, 4, 1, 'butter'], [0, 1, 1, 4, 'forest'], [0, 0, 5, 1, 'sage'],
  ];
  strips.forEach(([cx, cy, w, h, color], i) => R(i ? `${id}-strip-${i}` : `${id}-hearth`, rect(x + cx * u, y + cy * u, w * u, h * u), color));
}

/** Sawtooth star pieced from squares and triangles. */
function sawtooth(id: string, x: number, y: number) {
  const u = S / 4, p = (a: number, b: number): Pt => [x + a * u, y + b * u];
  R(`${id}-star`, poly([p(1, 0), p(2, 1), p(3, 0), p(3, 1), p(4, 1), p(3, 2), p(4, 3), p(3, 3), p(3, 4), p(2, 3), p(1, 4), p(1, 3), p(0, 3), p(1, 2), p(0, 1), p(1, 1)]), 'red');
  R(`${id}-centre`, rect(x + u, y + u, 2 * u, 2 * u), 'butter');
  R(`${id}-diamond`, poly([p(2, 1.25), p(2.75, 2), p(2, 2.75), p(1.25, 2)]), 'navy');
  R(`${id}-sky-top`, poly([p(1, 0), p(3, 0), p(2, 1)]), 'cream');
  R(`${id}-sky-right`, poly([p(4, 1), p(4, 3), p(3, 2)]), 'cream');
  R(`${id}-sky-bottom`, poly([p(3, 4), p(1, 4), p(2, 3)]), 'cream');
  R(`${id}-sky-left`, poly([p(0, 3), p(0, 1), p(1, 2)]), 'cream');
  R(`${id}-corner-1`, rect(x, y, u, u), 'sky');
  R(`${id}-corner-2`, rect(x + 3 * u, y, u, u), 'sky');
  R(`${id}-corner-3`, rect(x + 3 * u, y + 3 * u, u, u), 'sky');
  R(`${id}-corner-4`, rect(x, y + 3 * u, u, u), 'sky');
}

/** Pinwheel of eight triangles. */
function pinwheel(id: string, x: number, y: number, blade: string, bg: string) {
  const h = S / 2, c: Pt = [x + h, y + h];
  const ring: Pt[] = [[x, y], [x + h, y], [x + S, y], [x + S, y + h], [x + S, y + S], [x + h, y + S], [x, y + S], [x, y + h]];
  for (let i = 0; i < 8; i++) R(`${id}-${i % 2 ? 'blade' : 'ground'}-${(i >> 1) + 1}`, poly([c, ring[i], ring[(i + 1) % 8]]), i % 2 ? blade : bg);
}

starBlock('star-a', BX[0], BY[0], 'cream', 'rose', 'blue', 'mustard');
geeseBlock('geese-a', BX[1], BY[0], 'sky', ['navy', 'mustard', 'blue'], false);
heartBlock('heart-a', BX[2], BY[0], 'pink', 'cream', 'red', 'butter');
logCabin('cabin', BX[0], BY[1]);
sawtooth('sawtooth', BX[1], BY[1]);
pinwheel('pinwheel', BX[2], BY[1], 'forest', 'butter');
heartBlock('heart-b', BX[0], BY[2], 'sage', 'cream', 'rose', 'cream');
geeseBlock('geese-b', BX[1], BY[2], 'butter', ['forest', 'rose', 'sage'], true);
starBlock('star-b', BX[2], BY[2], 'sky', 'forest', 'mustard', 'red');

// quilting stitches round the border and each block
detail.push(stroke(stitches([[137, 157], [863, 157], [863, 883], [137, 883], [137, 157]], 10, 8), '#c9a04a', 2));
{
  let d = '';
  for (const x of BX) for (const y of BY) d += stitches([[x + 7, y + 7], [x + S - 7, y + 7], [x + S - 7, y + S - 7], [x + 7, y + S - 7], [x + 7, y + 7]], 7, 6);
  detail.push(stroke(d, THREAD, 1.4, { opacity: 0.75 }));
}
detail.push(stroke(line([[230, 106], [290, 106]]) + line([[470, 106], [530, 106]]) + line([[710, 106], [770, 106]]), INK, 1.2, { opacity: 0.35 }));

// ---------- on the sewing table ----------
// spool of thread
R('spool-thread', rect(164, 1000, 112, 112, 10), 'rose');
R('spool-thread-shine', rect(184, 1008, 28, 96, 10), 'pink');
R('spool-top', rect(146, 980, 148, 28, 9), 'woodL');
R('spool-base', rect(146, 1104, 148, 28, 9), 'woodL');
{
  let d = '';
  for (let y = 1022; y <= 1094; y += 12) d += line([[166, y], [274, y + 4]]);
  detail.push(stroke(d, '#b4525b', 1.5, { opacity: 0.7 }));
  // loose thread and needle
  detail.push(stroke(curve([[276, 1060], [316, 1090], [300, 1150], [352, 1176], [410, 1168]]), '#c95f69', 2.2));
  detail.push(stroke(line([[404, 1172], [452, 1150]]), '#7d8794', 3));
}

// thimble
R('thimble', M(360, 1140) + L(371, 1082) + Q(400, 1038, 429, 1082) + L(440, 1140) + 'Z', 'silver');
R('thimble-rim', rect(350, 1126, 100, 22, 9), 'steel');
{
  let d = '';
  for (const [x, y] of [[384, 1086], [400, 1080], [416, 1086], [380, 1102], [394, 1098], [408, 1098], [421, 1102], [384, 1116], [400, 1113], [416, 1116]] as Pt[]) d += circle(x, y, 2);
  detail.push(stroke(d, '#8d97a4', 1.6));
}

// tomato pincushion with pins
R('pin-head-1', circle(566, 1012, 9), 'butter');
R('pin-head-2', circle(612, 996, 9), 'sky');
R('pin-head-3', circle(660, 1014, 9), 'cream');
detail.push(stroke(line([[568, 1020], [588, 1068]]) + line([[612, 1005], [612, 1058]]) + line([[658, 1022], [638, 1068]]), '#7d8794', 2.4));
R('pincushion', ellipse(612, 1108, 92, 56), 'red');
R('pincushion-lobe', ellipse(612, 1110, 40, 53), 'rose');
R('pincushion-top', star(612, 1064, 24, 10, 5), 'forest');
detail.push(stroke(curve([[548, 1080], [536, 1108], [550, 1140]]) + curve([[676, 1080], [688, 1108], [674, 1140]]), '#8f2f2e', 1.6, { opacity: 0.7 }));

// folded fat quarters
R('fabric-1', rect(736, 1126, 212, 38, 12), 'navy');
R('fabric-2', rect(746, 1092, 192, 38, 12), 'mustard');
R('fabric-3', rect(758, 1058, 170, 38, 12), 'sage');
detail.push(stroke(line([[752, 1145], [932, 1145]]) + line([[762, 1111], [922, 1111]]) + line([[774, 1077], [912, 1077]]), THREAD, 1.4, { opacity: 0.6 }));

// buttons
R('button-blue', circle(486, 1182, 17), 'blue');
R('button-yellow', circle(528, 1160, 13), 'butter');
detail.push(stroke(circle(481, 1182, 1.6) + circle(491, 1182, 1.6) + circle(524, 1160, 1.4) + circle(532, 1160, 1.4), INK, 1.6));

const activity: PaintActivity = {
  id: 'crafts-paint-1', version: 1, mode: 'paint', title: 'Patchwork Quilt', blurb: "A hand-pieced quilt of stars, hearts, flying geese and a log cabin hangs above the sewing table, with thread, a thimble and a pincushion close by.",
  collectionId: 'crafts', categories: ["Crafts", "Cozy"], difficulty: 'Detailed',
  added: '2026-11-26',
  width: W, height: H, palette, regions, detail,
};
export default activity;
