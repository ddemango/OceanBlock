import { rect, ellipse, circle, curve, line } from '../../art/kit';
import type { PaintActivity, PaletteColor } from '../types';
import { W, H, canvas, band, ringFront, tubBand, puff, foamFront, toes, mirror, M, L, C, Q } from './props-paint';

const palette: PaletteColor[] = [
  { id: 'tile', number: 1, name: 'Seafoam tile', hex: '#d3ebe6' },
  { id: 'aqua', number: 2, name: 'Aqua tile', hex: '#74c2bd' },
  { id: 'cream', number: 3, name: 'Cream', hex: '#fbf1dc' },
  { id: 'floor', number: 4, name: 'Sandstone floor', hex: '#e6cfa9' },
  { id: 'tin', number: 5, name: 'Tin grey', hex: '#b7c3cd' },
  { id: 'tinD', number: 6, name: 'Pewter', hex: '#7f8f9e' },
  { id: 'tinL', number: 7, name: 'Polished rim', hex: '#e1e8ee' },
  { id: 'foam', number: 8, name: 'Soap suds', hex: '#ffffff' },
  { id: 'bubble', number: 9, name: 'Bubble blue', hex: '#a9d9f0' },
  { id: 'gold', number: 10, name: 'Golden fur', hex: '#e7a95c' },
  { id: 'brown', number: 11, name: 'Chestnut ears', hex: '#a2643a' },
  { id: 'ink', number: 12, name: 'Button black', hex: '#35292b' },
  { id: 'pink', number: 13, name: 'Tongue pink', hex: '#f28d98' },
  { id: 'yellow', number: 14, name: 'Duck yellow', hex: '#f8d24a' },
  { id: 'orange', number: 15, name: 'Beak orange', hex: '#f18f3b' },
  { id: 'coral', number: 16, name: 'Coral towel', hex: '#ee7d6c' },
  { id: 'teal', number: 17, name: 'Shampoo teal', hex: '#3b9a96' },
];

const c = canvas();
const { R, D, F } = c;

// ---------------------------------------------------------------- bathroom
R('wall', rect(0, 0, W, H), 'tile');
for (let i = 0; i < 8; i++) R(`tile-${i + 1}`, rect(i * 125, 96, 125, 84), i % 2 ? 'cream' : 'aqua');
R('baseboard', rect(0, 902, W, 34), 'aqua', [40, 919]);
R('floor', rect(0, 936, W, 314), 'floor', [50, 1010]);
R('puddle-left', ellipse(96, 1040, 76, 20), 'bubble');
R('puddle-right', ellipse(912, 1030, 66, 18), 'bubble');
R('mat', rect(110, 1066, 780, 150, 34), 'coral');
R('mat-stripe-1', rect(150, 1138, 700, 24, 10), 'cream', [500, 1150]);
R('mat-stripe-2', rect(150, 1176, 700, 24, 10), 'cream', [500, 1188]);

// towel on a rail
R('rail', rect(40, 300, 240, 16, 8), 'tinD');
R('towel', rect(76, 290, 164, 300, 14), 'coral');
R('towel-stripe-1', rect(76, 496, 164, 24), 'cream');
R('towel-stripe-2', rect(76, 536, 164, 24), 'cream');

// shelf with shampoo and a sponge
R('shelf', rect(730, 318, 250, 22, 6), 'brown');
R('shampoo-cap', rect(790, 150, 40, 44, 8), 'orange');
R('shampoo', M(772, 318) + L(772, 222) + Q(772, 186, 810, 186) + Q(848, 186, 848, 222) + L(848, 318) + 'Z', 'teal');
R('shampoo-label', rect(784, 230, 52, 62, 12), 'cream');
R('shampoo-drop', M(810, 240) + C(826, 262, 824, 280, 810, 280) + C(796, 280, 794, 262, 810, 240) + 'Z', 'bubble');
R('sponge', rect(872, 266, 90, 52, 16), 'yellow');

// bubbles drifting up the wall
const air: [number, number, number][] = [[352, 262, 26], [640, 250, 19], [900, 470, 30], [846, 596, 20], [124, 668, 22], [806, 410, 17]];
air.forEach(([x, y, r], i) => R(`air-bubble-${i + 1}`, circle(x, y, r), i % 2 ? 'bubble' : 'foam'));

// ---------------------------------------------------------------- tub (back) and suds
const TX = 500, RIM = 745, RATIO = 0.21;
const hwAt = (y: number) => 372 + ((312 - 372) * (y - RIM)) / (1050 - RIM);
R('handle-left', band([[142, 800], [88, 814], [84, 884], [150, 902]], 22, 22), 'tinD');
R('handle-right', band([[858, 800], [912, 814], [916, 884], [850, 902]], 22, 22), 'tinD');
R('suds-back', foamFront(TX, 706, 364, 9, 40, RIM, 60), 'bubble');

// rubber duck bobbing in the suds
R('duck-body', M(196, 742) + C(196, 700, 250, 708, 286, 716) + C(310, 708, 326, 690, 336, 680) + C(340, 730, 320, 790, 262, 792) + C(222, 792, 196, 776, 196, 742) + 'Z', 'yellow');
R('duck-wing', ellipse(272, 746, 34, 20, -12), 'gold');
R('duck-beak', M(182, 676) + Q(148, 680, 142, 692) + Q(150, 704, 184, 704) + 'Z', 'orange');
R('duck-head', circle(212, 686, 38), 'yellow');

// ---------------------------------------------------------------- puppy
const PX = 500;
R('puppy-body', ellipse(PX, 700, 146, 128), 'gold');
R('puppy-bib', ellipse(PX, 712, 62, 92), 'cream');
R('head', M(PX, 322) + C(PX + 96, 322, PX + 156, 392, PX + 156, 476) + C(PX + 156, 560, PX + 92, 616, PX, 616) + C(PX - 92, 616, PX - 156, 560, PX - 156, 476) + C(PX - 156, 392, PX - 96, 322, PX, 322) + 'Z', 'gold');
R('eye-patch', ellipse(PX + 62, 446, 54, 62, -12), 'brown');
R('blaze', M(PX - 16, 326) + Q(PX, 318, PX + 16, 326) + C(PX + 20, 380, PX + 14, 430, PX, 470) + C(PX - 14, 430, PX - 20, 380, PX - 16, 326) + 'Z', 'cream');
const earL = M(PX - 108, 352) + C(PX - 190, 322, PX - 232, 420, PX - 214, 540) + C(PX - 206, 596, PX - 142, 592, PX - 124, 528) + C(PX - 108, 468, PX - 96, 398, PX - 108, 352) + 'Z';
R('ear-left', earL, 'brown');
R('ear-right', mirror(earL, PX), 'brown');
R('muzzle', ellipse(PX, 540, 86, 64), 'cream');
R('tongue', M(PX - 22, 566) + L(PX + 22, 566) + L(PX + 22, 600) + Q(PX + 22, 626, PX, 626) + Q(PX - 22, 626, PX - 22, 600) + 'Z', 'pink');
R('nose', M(PX - 32, 496) + Q(PX, 480, PX + 32, 496) + Q(PX + 30, 524, PX, 530) + Q(PX - 30, 524, PX - 32, 496) + 'Z', 'ink');
R('eye-left', circle(PX - 62, 448, 19), 'ink');
R('eye-right', circle(PX + 62, 448, 19), 'ink');
R('suds-hat', puff(PX - 6, 318, 74, 40, 6, 0.4), 'foam');
R('suds-hat-bubble', circle(PX + 78, 300, 17), 'bubble');

// ---------------------------------------------------------------- suds and tub (front)
R('suds-front', foamFront(TX, 762, 350, 7, 30, RIM, 66), 'foam');
const suds: [number, number, number][] = [[380, 772, 17], [640, 770, 20], [706, 782, 13], [300, 790, 13]];
suds.forEach(([x, y, r], i) => R(`suds-bubble-${i + 1}`, circle(x, y, r), 'bubble'));
R('tub-top', tubBand(TX, RIM, hwAt(RIM), 868, hwAt(868), RATIO), 'tin');
R('tub-hoop', tubBand(TX, 868, hwAt(868), 906, hwAt(906), RATIO), 'tinD');
R('tub-bottom', tubBand(TX, 906, hwAt(906), 1050, hwAt(1050), RATIO), 'tin');
R('tub-rim', ringFront(TX, RIM, 378, 82, 348, 62), 'tinL');
R('paw-left', ellipse(PX - 104, 812, 50, 36), 'cream');
R('paw-right', ellipse(PX + 104, 812, 50, 36), 'cream');

// ---------------------------------------------------------------- line work
// tile grid
{
  let d = '';
  d += line([[0, 96], [W, 96]]) + line([[0, 180], [W, 180]]);
  for (let x = 125; x < W; x += 125) d += line([[x, 20], [x, 96]]);
  D(d, '#a7cfcb', 2);
}
// puppy face
D(M(PX, 530) + L(PX, 552) + M(PX - 46, 548) + Q(PX - 22, 572, PX, 552) + Q(PX + 22, 572, PX + 46, 548), '#6b4334', 3);
D(line([[PX, 580], [PX, 612]]), '#d9697a', 2.2);
D(curve([[PX - 88, 414], [PX - 64, 404], [PX - 40, 412]]), '#a2643a', 3);
D(curve([[PX + 40, 412], [PX + 64, 404], [PX + 88, 414]]), '#5f3a22', 3);
F(circle(PX - 55, 440, 6.5), '#ffffff');
F(circle(PX + 69, 440, 6.5), '#ffffff');
F(ellipse(PX - 10, 498, 9, 4, -15), '#8b7f82');
D(toes(PX - 104, 812, 50, 36) + toes(PX + 104, 812, 50, 36), '#d8b996', 2.4);
for (const [x, y] of [[PX - 36, 538], [PX - 50, 552], [PX - 30, 556], [PX + 36, 538], [PX + 50, 552], [PX + 30, 556]]) F(circle(x, y, 2.4), '#c9a57e');
// duck
F(circle(204, 678, 5.5), '#35292b');
D(curve([[250, 746], [272, 760], [300, 744]]), '#c98f3f', 2);
// shine on the tub, bubbles and bottle
D(curve([[196, 850], [204, 930], [222, 1010]]), '#e9eff3', 5, 0.8);
D(curve([[804, 850], [796, 930], [778, 1010]]), '#93a1ae', 3, 0.7);
{
  let d = '';
  for (const [x, y, r] of [...air, ...suds, [PX + 78, 300, 17] as [number, number, number]]) d += curve([[x - r * 0.55, y - r * 0.1], [x - r * 0.4, y - r * 0.45], [x - r * 0.05, y - r * 0.58]]);
  D(d, '#7fb9d6', 2);
}
D(line([[886, 284], [886, 284.1]]) + line([[910, 296], [910, 296.1]]) + line([[938, 282], [938, 282.1]]) + line([[924, 304], [924, 304.1]]), '#d9a92c', 6);
// towel fringe and rail hooks
{
  let d = '';
  for (let x = 84; x <= 232; x += 12) d += line([[x, 590], [x, 606]]);
  D(d, '#ee7d6c', 2.4);
}

const activity: PaintActivity = {
  id: 'pets-paint-2', version: 2, mode: 'paint', title: 'Puppy Bath Time', blurb: 'A happy golden puppy sits in a tin tub of soap suds with a rubber duck, a towel on the rail and shampoo on the shelf.',
  collectionId: 'pets', categories: ["Animals", "Pets"], difficulty: 'Relaxed',
  added: '2026-11-26',
  width: W, height: H, palette, regions: c.regions, detail: c.detail,
};
export default activity;
