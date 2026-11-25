import { rect, ellipse, circle, poly, line, curve, blob, leaf, xf, stroke } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { PaintActivity, PaletteColor } from '../types';
import { collector, vessel, crescent, apple, pear, pearTop, lemon, halfLeaf, stem, subQuad, quadAt, lerp, M, Q, L, type Pt } from './props-paint';

const W = 1000, H = 1250;

const palette: PaletteColor[] = [
  { id: 'cream', number: 1, name: 'Morning plaster', hex: '#f6e9cf' },
  { id: 'sun', number: 2, name: 'Window light', hex: '#fbe39c' },
  { id: 'butter', number: 3, name: 'Lemon butter', hex: '#f4c64a' },
  { id: 'mustard', number: 4, name: 'Honey shadow', hex: '#d99a2c' },
  { id: 'pear', number: 5, name: 'Pear green', hex: '#cdd36c' },
  { id: 'tomato', number: 6, name: 'Apple red', hex: '#d6503a' },
  { id: 'cherry', number: 7, name: 'Deep cherry', hex: '#922c2e' },
  { id: 'sageL', number: 8, name: 'Pale sage', hex: '#c5d5a7' },
  { id: 'sageM', number: 9, name: 'Sage glaze', hex: '#8ea773' },
  { id: 'sageD', number: 10, name: 'Deep sage', hex: '#55704a' },
  { id: 'linen', number: 11, name: 'Fresh linen', hex: '#fffaf0' },
  { id: 'fold', number: 12, name: 'Linen shadow', hex: '#e3d4b6' },
  { id: 'corn', number: 13, name: 'Cornflower', hex: '#7d9ed8' },
  { id: 'woodL', number: 14, name: 'Honey oak', hex: '#d49c64' },
  { id: 'woodM', number: 15, name: 'Warm oak', hex: '#b57a48' },
  { id: 'woodD', number: 16, name: 'Walnut', hex: '#7c4f31' },
  { id: 'cocoa', number: 17, name: 'Stem brown', hex: '#4d3326' },
];

const { regions, R } = collector();
const detail: Shape[] = [];
const INK = '#6b4e3a';

// ---------- wall, window light, wainscot ----------
R('wall', rect(0, 0, W, 610), 'cream');
{
  const a: Pt = [96, 128], b: Pt = [426, 74], c: Pt = [470, 480], d: Pt = [138, 552];
  const g = 0.024;
  R('light-pane-1', subQuad(a, b, c, d, 0, 0.5 - g, 0, 0.5 - g), 'sun');
  R('light-pane-2', subQuad(a, b, c, d, 0.5 + g, 1, 0, 0.5 - g), 'sun');
  R('light-pane-3', subQuad(a, b, c, d, 0, 0.5 - g, 0.5 + g, 1), 'sun');
  R('light-pane-4', subQuad(a, b, c, d, 0.5 + g, 1, 0.5 + g, 1), 'sun');
}
R('wainscot', rect(0, 604, W, 150), 'sageL');
R('wainscot-rail', rect(0, 590, W, 26), 'woodM');
for (const x of [40, 110, 760, 830, 900, 970]) detail.push(stroke(line([[x, 620], [x, 740]]), '#9fb388', 2));

// ---------- shelf with a jug and a plate ----------
R('plate-rim', circle(888, 250, 82), 'corn');
R('plate-well', circle(888, 250, 62), 'linen');
R('plate-centre', circle(888, 250, 30), 'sun');
{
  const jug = vessel(732, [[210, 40], [230, 38], [262, 52], [298, 60], [328, 50], [348, 38]], 0.2);
  R('shelf-jug-handle', M(776, 246) + 'C826 236 832 314 778 320' + L(776, 302) + 'C808 296 806 262 778 266Z', 'corn');
  R('shelf-jug-mouth', jug.opening(), 'sageD');
  R('shelf-jug', jug.body(), 'corn');
  R('shelf-jug-band', jug.band(276, 296), 'linen');
  R('shelf-jug-spout', M(700, 212) + Q(682, 200, 670, 190) + Q(676, 222, 700, 230) + 'Z', 'corn');
}
R('shelf', rect(620, 346, 380, 24), 'woodD');
R('shelf-bracket-1', poly([[664, 370], [692, 370], [692, 440]]), 'woodM');
R('shelf-bracket-2', poly([[940, 370], [968, 370], [968, 440]]), 'woodM');

// ---------- table ----------
R('table-plank-1', rect(0, 740, W, 140), 'woodL');
R('table-plank-2', rect(0, 880, W, 150), 'woodM');
R('table-plank-3', rect(0, 1030, W, 150), 'woodL');
R('table-edge', rect(0, 1180, W, 70), 'woodD');
detail.push(stroke(curve([[740, 780], [860, 786], [1000, 780]]) + curve([[0, 960], [30, 964], [62, 960]]) + curve([[934, 966], [970, 970], [1000, 966]]) + curve([[0, 1110], [40, 1114], [80, 1110]]) + curve([[880, 1110], [940, 1116], [1000, 1110]]), '#9c6a3e', 1.6));

// ---------- olive oil bottle and a crock of spoons ----------
{
  const bottle = vessel(126, [[452, 15], [536, 15], [582, 40], [624, 54], [778, 54], [792, 48]], 0.2);
  R('oil-bottle', bottle.body(), 'sageM');
  R('oil-fill', bottle.band(640, 788, 7), 'butter');
  R('oil-glint', rect(84, 600, 11, 160, 5), 'sageL');
  R('oil-label', rect(98, 676, 64, 66, 6), 'linen');
  R('oil-cork', rect(110, 422, 32, 36, 6), 'woodM');
  detail.push(stroke(line([[112, 698], [148, 698]]) + line([[116, 716], [144, 716]]), INK, 1.6));
}
R('spoon-1', rect(820, 470, 14, 150, 6), 'woodL');
R('spoon-1-bowl', ellipse(827, 470, 22, 34, -6), 'woodL');
R('spoon-2', xf(rect(-7, -150, 14, 160, 6), { rot: 16, x: 900, y: 620 }), 'woodM');
R('spoon-2-bowl', ellipse(944, 482, 18, 26, 16), 'woodM');
R('spoon-3', xf(rect(-6, -130, 12, 140, 5), { rot: -12, x: 866, y: 620 }), 'woodD');
R('spoon-3-bowl', ellipse(838, 505, 15, 22, -12), 'woodD');
{
  const crock = vessel(876, [[600, 74], [616, 72], [680, 78], [760, 74], [788, 66]], 0.2);
  R('crock-mouth', crock.opening(), 'cocoa');
  R('crock', crock.body(), 'corn');
  R('crock-band', crock.band(650, 672), 'linen');
  R('crock-shade', poly([[918, 640], [946, 636], [944, 772], [920, 778]]), 'sageD');
}

// ---------- folded linen cloth ----------
{
  const A: Pt = [64, 862], B: Pt = [726, 806], Cc: Pt = [868, 1250], D: Pt = [104, 1250];
  const yEdge = 1180;
  const tE = (yEdge - A[1]) / (D[1] - A[1]), tE2 = (yEdge - B[1]) / (Cc[1] - B[1]);
  const D1 = lerp(A, D, tE), C1 = lerp(B, Cc, tE2);
  R('cloth', poly([A, lerp(A, B, 0.5).map((v, i) => v + (i ? 6 : 0)) as Pt, B, lerp(B, C1, 0.5), C1, lerp(D1, C1, 0.5), D1]), 'linen');
  R('cloth-drape', poly([D1, C1, [C1[0] + 14, 1250], [D1[0] + 4, 1250]]), 'fold');
  R('cloth-stripe-1', subQuad(A, B, C1, D1, 0, 1, 0.71, 0.78), 'corn');
  R('cloth-stripe-2', subQuad(A, B, C1, D1, 0, 1, 0.82, 0.88), 'corn');
  R('cloth-stripe-3', subQuad(A, B, C1, D1, 0.9, 0.93, 0, 1), 'corn');
  R('cloth-drape-stripe', poly([lerp(D1, C1, 0.9), lerp(D1, C1, 0.93), [lerp(D1, C1, 0.93)[0] + 14, 1250], [lerp(D1, C1, 0.9)[0] + 13, 1250]]), 'corn');
  // folded-back corner shows the underside
  R('cloth-flap', poly([A, quadAt(A, B, C1, D1, 0.3, 0), quadAt(A, B, C1, D1, 0.16, 0.36), quadAt(A, B, C1, D1, 0, 0.46)]), 'fold');
  detail.push(stroke(line([quadAt(A, B, C1, D1, 0.3, 0), quadAt(A, B, C1, D1, 0, 0.46)]), '#cbb894', 1.6));
  detail.push(stroke(curve([quadAt(A, B, C1, D1, 0.55, 0.3), quadAt(A, B, C1, D1, 0.62, 0.55), quadAt(A, B, C1, D1, 0.6, 0.9)]), '#d9c8a6', 1.6));
}
R('shadow-bowl', ellipse(470, 912, 262, 36), 'fold');
R('shadow-lemon', ellipse(786, 1052, 96, 18), 'fold');

// ---------- the bowl and its fruit ----------
const bowl = vessel(440, [[690, 262], [716, 257], [762, 238], [812, 204], [852, 160], [878, 118]], 0.2);
R('bowl-foot', poly([[330, 870], [550, 870], [538, 904], [500, 914], [440, 917], [380, 914], [342, 904]]), 'sageD');
R('bowl-inside', bowl.opening(), 'sageD');

// pears at the back
R('pear-back', pear(596, 604, 64, 14), 'pear');
R('pear-back-shade', crescent(596, 604, 61, 61, -30, 110, 0.34, 14), 'sageM');
R('pear-back-light', ellipse(578, 556, 14, 30, 14), 'sun');
R('pear-back-stem', stem(...pearTop(596, 604, 64, 14), 34, 10, 26, 4), 'cocoa');
R('pear-left', pear(288, 626, 56, -20), 'pear');
R('pear-left-shade', crescent(288, 626, 53, 53, -20, 130, 0.42, -20), 'sageM');
R('pear-left-light', ellipse(262, 590, 12, 26, -20), 'sun');
R('pear-left-stem', stem(...pearTop(288, 626, 56, -20), 30, 10, -30, -3), 'cocoa');

// leaves tucked in
R('bowl-leaf-1', leaf(470, 668, 150, 40, -36), 'sageD');
R('bowl-leaf-1-light', halfLeaf(470, 668, 150, 40, -36), 'sageM');
R('bowl-leaf-2', leaf(212, 694, 120, 32, -168), 'sageD');
R('bowl-leaf-2-light', halfLeaf(212, 694, 120, 32, -168, true), 'sageM');

// apples
const appleSet: [string, number, number, number, number][] = [
  ['apple-right', 634, 704, 60, 10],
  ['apple-left', 368, 690, 80, -6],
  ['apple-front', 510, 712, 76, 8],
];
for (const [id, cx, cy, r, rot] of appleSet) {
  R(id, apple(cx, cy, r, rot), 'tomato');
  R(`${id}-shade`, id === 'apple-right' ? crescent(cx, cy, r * 0.93, r * 0.88, -70, 60, 0.4, rot) : crescent(cx, cy, r * 0.93, r * 0.88, -15, 150, 0.36, rot), 'cherry');
  R(`${id}-light`, ellipse(cx - r * 0.5, cy - r * 0.3, r * 0.11, r * 0.24, 28), 'linen');
  R(`${id}-stem`, stem(cx + r * 0.02, cy - r * 0.68, r * 0.42, 9, 14, 2), 'cocoa');
}

R('bowl', bowl.body(), 'sageM');
R('bowl-rim-band', bowl.band(708, 736), 'linen');
R('bowl-stripe', bowl.band(770, 788), 'corn');
R('bowl-glint', leaf(640, 770, 96, 13, 118), 'sageL');

// grapes spilling over the front-left rim
{
  const rows: [number, number[]][] = [[724, [236, 280, 324]], [760, [214, 258, 302, 346]], [798, [236, 280, 324]], [834, [258, 302]], [868, [282]]];
  let i = 0;
  for (const [y, xs] of rows) for (const x of xs) {
    i++;
    R(`grape-${i}`, circle(x, y + ((x * 7) % 5), 24), i % 3 === 0 ? 'pear' : 'sageL');
  }
  detail.push(stroke(curve([[262, 706], [276, 690], [300, 676], [316, 672]]), '#5d7a3e', 4));
  let d = '';
  for (const [y, xs] of rows) for (const x of xs) d += circle(x - 9, y + ((x * 7) % 5) - 9, 2.5);
  detail.push(stroke(d, '#ffffff', 2.4, { opacity: 0.85 }));
}

// ---------- lemon on the cloth ----------
R('lemon-leaf', leaf(830, 1000, 120, 34, -40), 'sageD');
R('lemon-leaf-light', halfLeaf(830, 1000, 120, 34, -40), 'sageM');
R('lemon', lemon(772, 1000, 66, 48, -12), 'butter');
R('lemon-shade', crescent(772, 1000, 74, 46, -5, 165, 0.38, -12), 'mustard');
R('lemon-light', ellipse(748, 978, 30, 11, -14), 'sun');
R('loose-grape-1', circle(596, 1006, 22), 'sageL');
R('loose-grape-2', circle(640, 1024, 22), 'pear');

// ---------- line work ----------
const rib = (x: number, y: number, len: number, rot: number) => xf(line([[6, 0], [len * 0.9, 0]]), { rot, x, y });
detail.push(stroke(rib(470, 668, 150, -36) + rib(212, 694, 120, -168) + rib(830, 1000, 120, -40), '#e6efd2', 1.6));
detail.push(stroke(curve([[186, 690], [440, 744], [694, 690]], 0.8), '#46603d', 1.4, { opacity: 0.6 }));
detail.push(stroke(circle(600, 640, 1.2) + circle(616, 662, 1.2) + circle(586, 676, 1.2) + circle(300, 660, 1.2) + circle(278, 680, 1.2) + circle(744, 1006, 1.2) + circle(790, 992, 1.2) + circle(806, 1016, 1.2), '#8c8a3c', 1.4));
detail.push(stroke(curve([[330, 904], [440, 914], [550, 904]]), '#46603d', 1.4, { opacity: 0.6 }));
detail.push(stroke(blob([[884, 230], [892, 238], [884, 246], [876, 238]], 1) + M(888, 196) + Q(900, 206, 888, 214) + M(888, 286) + Q(876, 294, 888, 304), '#5c7cb8', 1.6));

const activity: PaintActivity = {
  id: 'kitchen-paint-1', version: 1, mode: 'paint', title: 'Morning Fruit Bowl',
  blurb: 'A sage-glazed bowl of pears, apples and green grapes on a folded linen cloth, with a lemon resting in the window light.',
  collectionId: 'kitchen', categories: ['Kitchen', 'Food', 'Still life'], difficulty: 'Moderate',
  width: W, height: H, palette, regions, detail,
};
export default activity;
