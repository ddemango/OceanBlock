import { rect, ellipse, circle, curve, line, leaf, blob } from '../../art/kit';
import type { PaintActivity, PaletteColor } from '../types';
import { W, H, canvas, band, bandSlice, ringFront, tubBand, yarnBall, stripe, ear, fluffyHead, whiskers, toes, mirror, M, L, C, Q } from './props-paint';

const palette: PaletteColor[] = [
  { id: 'sage', number: 1, name: 'Sage wall', hex: '#c5d6bf' },
  { id: 'cream', number: 2, name: 'Cream', hex: '#fbf2df' },
  { id: 'woodL', number: 3, name: 'Light wicker', hex: '#dcae6e' },
  { id: 'woodM', number: 4, name: 'Honey wicker', hex: '#bd8548' },
  { id: 'woodD', number: 5, name: 'Chestnut', hex: '#8a5a33' },
  { id: 'ink', number: 6, name: 'Espresso', hex: '#3d2c28' },
  { id: 'ginger', number: 7, name: 'Ginger fur', hex: '#eda255' },
  { id: 'gingerD', number: 8, name: 'Marmalade stripe', hex: '#c9742f' },
  { id: 'pink', number: 9, name: 'Petal pink', hex: '#f4a6ac' },
  { id: 'berry', number: 10, name: 'Raspberry yarn', hex: '#d1506e' },
  { id: 'teal', number: 11, name: 'Teal yarn', hex: '#45a39b' },
  { id: 'tealD', number: 12, name: 'Deep teal', hex: '#2b716f' },
  { id: 'mustard', number: 13, name: 'Mustard yarn', hex: '#f0c048' },
  { id: 'lilac', number: 14, name: 'Lilac yarn', hex: '#a892d6' },
  { id: 'plum', number: 15, name: 'Plum', hex: '#7b4c86' },
  { id: 'green', number: 16, name: 'Spring green', hex: '#86b85c' },
  { id: 'blue', number: 17, name: 'Cornflower rug', hex: '#7ea3c9' },
];

const c = canvas();
const { R, D, F } = c;

// ---------------------------------------------------------------- room
R('wall', rect(0, 0, W, H), 'sage');
R('wainscot', rect(0, 610, W, 250), 'cream', [80, 740]);
R('rail', rect(0, 588, W, 26), 'woodM', [60, 601]);
R('skirting', rect(0, 852, W, 32), 'woodD', [50, 868]);
R('floor-back', rect(0, 884, W, 86), 'woodM', [40, 925]);
R('floor-front', rect(0, 970, W, 280), 'woodL', [28, 1215]);
R('rug', ellipse(500, 1104, 484, 138), 'blue');
R('rug-field', ellipse(500, 1104, 404, 102), 'cream');

// framed heart on the wall
R('frame', rect(50, 80, 200, 240, 8), 'woodD');
R('frame-mat', rect(70, 100, 160, 200), 'cream');
R('frame-picture', rect(90, 120, 120, 160), 'blue');
R('frame-heart', M(150, 240) + C(140, 226, 104, 206, 104, 178) + C(104, 150, 140, 148, 150, 172) + C(160, 148, 196, 150, 196, 178) + C(196, 206, 160, 226, 150, 240) + 'Z', 'berry');

// shelf with folded knits and a little plant
R('shelf', rect(640, 250, 310, 22, 5), 'woodM');
R('knit-bottom', rect(668, 204, 150, 46, 14), 'teal');
R('knit-top', rect(680, 160, 126, 46, 14), 'mustard');
R('plant-leaf-left', leaf(884, 196, 78, 34, -128), 'green');
R('plant-leaf-right', leaf(884, 196, 78, 34, -52), 'green');
R('plant-leaf-mid', leaf(884, 200, 96, 36, -90), 'tealD');
R('plant-pot', M(850, 192) + L(918, 192) + L(908, 250) + L(860, 250) + 'Z', 'berry');

// ---------------------------------------------------------------- basket (back)
const BX = 500, RIM = 760, RATIO = 0.214;
R('handle-left', band([[232, 786], [176, 796], [166, 850], [214, 876]], 20, 20), 'woodD');
R('handle-right', band([[768, 786], [824, 796], [834, 850], [786, 876]], 20, 20), 'woodD');
R('basket-inside', ellipse(BX, RIM, 290, 62), 'ink');

// knitting needles stuck in the yarn
R('needle-1', band([[706, 640], [846, 372]], 14, 14), 'woodD');
R('needle-1-knob', circle(850, 364, 15), 'pink');
R('needle-2', band([[748, 652], [918, 436]], 14, 14), 'woodD');
R('needle-2-knob', circle(924, 428, 15), 'pink');

// yarn piled in the basket
yarnBall(c, 'yarn-mustard', 668, 530, 72, 'mustard', 'ginger', 'cream', '#b8862a', 30, false);
yarnBall(c, 'yarn-teal', 692, 662, 98, 'teal', 'tealD', 'sage', '#1f5553', -28);
yarnBall(c, 'yarn-berry', 262, 690, 78, 'berry', 'plum', 'pink', '#8f2e4a', 24);

// ---------------------------------------------------------------- kitten
const KX = 440; // centre line of the kitten
R('kitten-body', ellipse(KX, 742, 150, 112), 'ginger');
R('kitten-bib', ellipse(KX, 736, 66, 84), 'cream');

const earL = ear(KX - 150, 532, KX - 152, 362, KX - 26, 452);
R('ear-left', earL, 'ginger');
R('ear-right', mirror(earL, KX), 'ginger');
const innerL = ear(KX - 130, 500, KX - 136, 392, KX - 58, 458);
R('ear-left-inner', innerL, 'pink');
R('ear-right-inner', mirror(innerL, KX), 'pink');

R('head', fluffyHead(KX, 566, 172, 130), 'ginger');
R('stripe-brow-mid', stripe(KX, 446, 74, 24, 90), 'gingerD');
R('stripe-brow-left', stripe(KX - 50, 456, 62, 22, 80), 'gingerD');
R('stripe-brow-right', stripe(KX + 50, 456, 62, 22, 100), 'gingerD');
R('stripe-cheek-left-1', stripe(KX - 168, 588, 56, 22, -6), 'gingerD');
R('stripe-cheek-left-2', stripe(KX - 148, 628, 48, 20, -14), 'gingerD');
R('stripe-cheek-right-1', stripe(KX + 168, 588, 56, 22, 186), 'gingerD');
R('stripe-cheek-right-2', stripe(KX + 148, 628, 48, 20, 194), 'gingerD');

R('muzzle', blob([[KX, 598], [KX + 42, 604], [KX + 68, 632], [KX + 46, 664], [KX, 674], [KX - 46, 664], [KX - 68, 632], [KX - 42, 604]], 1), 'cream');
R('nose', M(KX - 22, 602) + Q(KX, 596, KX + 22, 602) + Q(KX + 14, 624, KX, 628) + Q(KX - 14, 624, KX - 22, 602) + 'Z', 'pink');
R('eye-left', ellipse(KX - 64, 560, 37, 39), 'green');
R('eye-right', ellipse(KX + 64, 560, 37, 39), 'green');
R('pupil-left', ellipse(KX - 64, 562, 18, 28), 'ink');
R('pupil-right', ellipse(KX + 64, 562, 18, 28), 'ink');

// ---------------------------------------------------------------- basket (front)
const hwAt = (y: number) => 290 + ((235 - 290) * (y - RIM)) / (1070 - RIM);
const hoops: [number, number, string][] = [[RIM, 838, 'woodL'], [838, 916, 'woodM'], [916, 994, 'woodL'], [994, 1070, 'woodM']];
hoops.forEach(([y1, y2, col], i) => R(`basket-band-${i + 1}`, tubBand(BX, y1, hwAt(y1), y2, hwAt(y2), RATIO), col));
R('basket-rim', ringFront(BX, RIM, 296, 66, 262, 44), 'woodD');

// paws over the rim and the tail draped down the front
R('paw-left', ellipse(KX - 66, 800, 46, 34), 'cream');
R('paw-right', ellipse(KX + 66, 800, 46, 34), 'cream');
const tail: [number, number][] = [[592, 770], [636, 800], [664, 852], [664, 918], [632, 968], [584, 980]];
R('tail', band(tail, 54, 42, true), 'ginger');
R('tail-ring-1', bandSlice(tail, 54, 42, 0.3, 0.42), 'gingerD');
R('tail-ring-2', bandSlice(tail, 54, 42, 0.56, 0.68), 'gingerD');
R('tail-tip', bandSlice(tail, 54, 42, 0.82, 1, true), 'cream');

// ---------------------------------------------------------------- yarn on the rug
R('strand', band([[232, 1142], [330, 1184], [450, 1168], [560, 1196], [680, 1176], [760, 1150]], 16, 16), 'lilac');
yarnBall(c, 'yarn-lilac', 176, 1096, 80, 'lilac', 'plum', 'cream', '#5d3a68', -20);
yarnBall(c, 'yarn-floor-berry', 822, 1112, 60, 'berry', 'plum', 'pink', '#8f2e4a', 35);

// ---------------------------------------------------------------- line work
// face
D(M(KX, 628) + L(KX, 642) + M(KX, 642) + Q(KX - 6, 656, KX - 24, 652) + M(KX, 642) + Q(KX + 6, 656, KX + 24, 652), '#8a4f3a', 2.4);
D(whiskers(KX - 50, 640, 120, -1) + whiskers(KX + 50, 640, 120, 1), '#fffaf0', 2.2);
D(curve([[KX - 103, 548], [KX - 64, 520], [KX - 26, 544]]) + curve([[KX + 26, 544], [KX + 64, 520], [KX + 103, 548]]), '#8a4f3a', 2.6);
F(circle(KX - 55, 549, 8.5), '#ffffff');
F(circle(KX + 73, 549, 8.5), '#ffffff');
F(circle(KX - 72, 576, 4), '#ffffff');
F(circle(KX + 56, 576, 4), '#ffffff');
D(toes(KX - 66, 800, 46, 34) + toes(KX + 66, 800, 46, 34), '#d9b99a', 2.2);
// fluff on the chest and ear tufts
D(line([[KX - 20, 706], [KX - 12, 722], [KX - 2, 708], [KX + 8, 724], [KX + 20, 706]]), '#e3cfae', 2);
// wicker weave
{
  let d = '';
  hoops.forEach(([y1, y2], row) => {
    for (let i = 0; i < 13; i++) {
      const u = ((i + (row % 2 ? 0.5 : 0)) / 13) * 2 - 1;
      if (Math.abs(u) > 0.94) continue;
      const a = Math.acos(-u);
      const p = (y: number): [number, number] => [BX - Math.cos(a) * hwAt(y), y + Math.sin(a) * hwAt(y) * RATIO];
      const a0 = p(y1 + 8), a1 = p(y2 - 8);
      d += line([a0, a1]);
    }
  });
  D(d, '#7a4d2a', 2, 0.55);
}
// floor boards, rug stitches, knit folds, picture wire
D(line([[110, 884], [110, 970]]) + line([[900, 884], [900, 970]]), '#8a5a33', 1.6, 0.6);
D(line([[690, 227], [796, 227]]) + line([[700, 183], [786, 183]]), '#ffffff', 2, 0.55);
D(line([[884, 190], [884, 120]]), '#1f5553', 1.6, 0.6);

const activity: PaintActivity = {
  id: 'pets-paint-1', version: 2, mode: 'paint', title: 'Kitten in the Yarn Basket', blurb: 'A wide-eyed ginger kitten peeks out of a wicker basket piled with bright balls of yarn and a pair of knitting needles.',
  collectionId: 'pets', categories: ["Animals", "Pets"], difficulty: 'Moderate',
  added: '2026-11-26',
  width: W, height: H, palette, regions: c.regions, detail: c.detail,
};
export default activity;
