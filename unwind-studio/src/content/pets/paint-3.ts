import { rect, ellipse, circle, curve, line, leaf, poly } from '../../art/kit';
import type { PaintActivity, PaletteColor } from '../types';
import { W, H, canvas, band, bandSlice, edged, puff, stripe, ear, whiskers, fluffyHead, mirror, M, L, C, Q } from './props-paint';

const palette: PaletteColor[] = [
  { id: 'wall', number: 1, name: 'Peach wall', hex: '#f3d8b8' },
  { id: 'cream', number: 2, name: 'Window white', hex: '#fcf5e6' },
  { id: 'sky', number: 3, name: 'Morning sky', hex: '#b9def0' },
  { id: 'sun', number: 4, name: 'Sunshine', hex: '#f7cf55' },
  { id: 'greenL', number: 5, name: 'Meadow green', hex: '#a8d08a' },
  { id: 'green', number: 6, name: 'Leaf green', hex: '#63a65c' },
  { id: 'greenD', number: 7, name: 'Deep green', hex: '#3a7550' },
  { id: 'terra', number: 8, name: 'Terracotta', hex: '#d27148' },
  { id: 'brick', number: 9, name: 'Brick red', hex: '#9d4a36' },
  { id: 'plaster', number: 10, name: 'Buttermilk', hex: '#f1e2ae' },
  { id: 'rose', number: 11, name: 'Rose curtain', hex: '#e58d93' },
  { id: 'roseD', number: 12, name: 'Deep rose', hex: '#bd5d70' },
  { id: 'tabby', number: 13, name: 'Tabby fur', hex: '#b39a7e' },
  { id: 'tabbyD', number: 14, name: 'Tabby stripe', hex: '#5e4a3d' },
  { id: 'slate', number: 15, name: 'Slate blue', hex: '#6b87a8' },
  { id: 'violet', number: 16, name: 'Violet bloom', hex: '#9270c4' },
  { id: 'wood', number: 17, name: 'Oak sill', hex: '#cb9c69' },
];

const c = canvas();
const { R, D } = c;

// ---------------------------------------------------------------- room and window frame
R('wall', rect(0, 0, W, H), 'wall');
R('panel', rect(190, 950, 620, 100, 10), 'plaster');
R('skirting', rect(0, 1084, W, 34), 'cream', [500, 1101]);
R('floor', rect(0, 1118, W, 132), 'wood', [150, 1150]);
R('frame', rect(100, 96, 800, 800), 'cream', [500, 116]);

// ---------------------------------------------------------------- the view (kept inside 140..860 x 136..870)
R('sky', rect(140, 136, 720, 734), 'sky', [600, 330]);
R('sun', circle(706, 232, 50), 'sun');
R('cloud-1', puff(300, 226, 92, 34, 5, 0.5), 'cream');
R('cloud-2', puff(640, 440, 74, 26, 4, 1.2), 'cream');
R('hills', edged([[140, 590], [260, 548], [400, 578], [560, 540], [700, 570], [860, 546]], [[860, 870], [140, 870]]), 'greenL');
R('tree-left', puff(196, 520, 42, 60, 5, 0.3), 'green');
R('tree-right', puff(672, 512, 42, 60, 5, 0.9), 'greenD');
// house A
R('a-chimney', rect(306, 486, 26, 60), 'brick');
R('a-wall', rect(206, 560, 140, 310), 'plaster');
R('a-roof', poly([[188, 568], [276, 484], [364, 568]]), 'terra');
R('a-window', rect(296, 584, 38, 46, 4), 'slate');
// house B
R('b-wall', rect(368, 520, 118, 350), 'rose');
R('b-roof', poly([[352, 528], [427, 448], [502, 528]]), 'slate');
R('b-window-1', rect(384, 548, 34, 46, 4), 'cream');
R('b-window-2', rect(436, 548, 34, 46, 4), 'cream');
// house C
R('c-chimney', rect(612, 496, 24, 50), 'terra');
R('c-wall', rect(522, 556, 128, 314), 'plaster');
R('c-roof', poly([[506, 564], [586, 488], [666, 564]]), 'brick');
R('c-window', rect(566, 588, 40, 46, 4), 'slate');
// house D
R('d-wall', rect(676, 600, 184, 270), 'cream');
R('d-roof', poly([[660, 608], [704, 540], [860, 540], [860, 608]]), 'terra');
R('d-window', rect(716, 632, 40, 48, 4), 'slate');

// glazing bars
R('glazing-bars', poly([[488, 136], [512, 136], [512, 384], [860, 384], [860, 408], [512, 408], [512, 870], [488, 870], [488, 408], [140, 408], [140, 384], [488, 384]]), 'cream', [500, 300]);

// ---------------------------------------------------------------- plants on the sill
const fan: [number, number, number, string][] = [[-126, 150, 44, 'greenD'], [-56, 150, 44, 'greenD'], [-108, 188, 50, 'green'], [-72, 188, 50, 'greenL'], [-90, 214, 54, 'greenD']];
fan.forEach(([rot, len, wid, col], i) => R(`fern-leaf-${i + 1}`, leaf(200, 772, len, wid, rot), col));
R('fern-pot', poly([[158, 780], [242, 780], [232, 870], [168, 870]]), 'terra');
R('fern-pot-rim', rect(148, 762, 104, 24, 7), 'brick');

R('geranium-leaf-1', circle(780, 752, 27), 'green');
R('geranium-leaf-2', circle(842, 750, 26), 'green');
R('geranium-leaf-3', circle(811, 730, 28), 'greenD');
R('bloom-1', puff(774, 690, 26, 26, 5, 0.2), 'violet');
R('bloom-2', puff(816, 656, 28, 28, 5, 0.8), 'violet');
R('bloom-3', puff(852, 700, 23, 23, 5, 1.4), 'violet');
R('bloom-1-centre', circle(774, 690, 9), 'sun');
R('bloom-2-centre', circle(816, 656, 10), 'sun');
R('bloom-3-centre', circle(852, 700, 8), 'sun');
R('geranium-pot', poly([[770, 786], [852, 786], [842, 870], [780, 870]]), 'terra');
R('geranium-pot-rim', rect(761, 770, 100, 22, 7), 'brick');

// ---------------------------------------------------------------- sill
R('sill-shadow', rect(96, 906, 808, 16), 'tabbyD', [150, 914]);
R('sill', rect(76, 866, 848, 42, 8), 'wood', [560, 892]);

// ---------------------------------------------------------------- the sleeping tabby
const CX = 366; // centre of the cat's head
R('cat-body', M(300, 868) + C(286, 780, 340, 692, 432, 672) + C(524, 652, 650, 664, 702, 738) + C(736, 788, 734, 840, 722, 868) + 'Z', 'tabby', [600, 800]);
R('back-stripe-1', stripe(498, 664, 78, 24, 96), 'tabbyD');
R('back-stripe-2', stripe(552, 662, 92, 26, 92), 'tabbyD');
R('back-stripe-3', stripe(606, 668, 92, 26, 86), 'tabbyD');
R('back-stripe-4', stripe(656, 688, 84, 26, 80), 'tabbyD');
R('back-stripe-5', stripe(698, 730, 70, 24, 72), 'tabbyD');
const earL = ear(CX - 86, 746, CX - 84, 634, CX - 8, 700);
R('cat-ear-left', earL, 'tabby');
R('cat-ear-right', mirror(earL, CX), 'tabby');
const innerL = ear(CX - 74, 722, CX - 74, 658, CX - 30, 702);
R('cat-ear-left-inner', innerL, 'rose');
R('cat-ear-right-inner', mirror(innerL, CX), 'rose');
R('cat-head', fluffyHead(CX, 774, 100, 80, 0.07), 'tabby');
R('brow-stripe-mid', stripe(CX, 698, 44, 18, 90), 'tabbyD');
R('brow-stripe-left', stripe(CX - 30, 704, 38, 17, 82), 'tabbyD');
R('brow-stripe-right', stripe(CX + 30, 704, 38, 17, 98), 'tabbyD');
R('cheek-stripe-left', stripe(CX - 96, 778, 34, 17, -6), 'tabbyD');
R('cheek-stripe-right', stripe(CX + 96, 778, 34, 17, 186), 'tabbyD');
R('cat-muzzle', ellipse(CX, 820, 40, 27), 'cream');
R('cat-nose', M(CX - 15, 800) + Q(CX, 795, CX + 15, 800) + Q(CX + 9, 815, CX, 818) + Q(CX - 9, 815, CX - 15, 800) + 'Z', 'rose');
R('cat-paw-left', ellipse(CX - 36, 866, 34, 17), 'cream');
R('cat-paw-right', ellipse(CX + 42, 866, 34, 17), 'cream');
const tail: [number, number][] = [[690, 846], [734, 872], [756, 930], [742, 1000], [704, 1040]];
R('cat-tail', band(tail, 46, 34, true), 'tabby');
R('tail-ring-1', bandSlice(tail, 46, 34, 0.3, 0.42), 'tabbyD');
R('tail-ring-2', bandSlice(tail, 46, 34, 0.54, 0.66), 'tabbyD');
R('tail-tip', bandSlice(tail, 46, 34, 0.8, 1, true), 'tabbyD');

// ---------------------------------------------------------------- curtains
R('rod', rect(22, 48, 956, 16, 8), 'tabbyD', [500, 56]);
R('finial-left', circle(24, 56, 19), 'sun');
R('finial-right', circle(976, 56, 19), 'sun');
const fold = (x0: number, x1: number, sag: number) => M(x0, 66) + L(x1, 66) + L(x1, 1076) + Q((x0 + x1) / 2, 1076 + sag, x0, 1076) + 'Z';
const hem = (x0: number, x1: number, sag: number) => M(x0, 1076) + Q((x0 + x1) / 2, 1076 + sag, x1, 1076) + L(x1, 1110) + Q((x0 + x1) / 2, 1110 + sag, x0, 1110) + 'Z';
const folds: [number, number, string][] = [[0, 44, 'roseD'], [44, 88, 'rose'], [88, 132, 'roseD']];
folds.forEach(([x0, x1, col], i) => {
  R(`curtain-left-${i + 1}`, fold(x0, x1, 14), col);
  R(`curtain-right-${i + 1}`, fold(W - x1, W - x0, 14), col);
  R(`curtain-left-hem-${i + 1}`, hem(x0, x1, 14), i % 2 ? 'roseD' : 'cream');
  R(`curtain-right-hem-${i + 1}`, hem(W - x1, W - x0, 14), i % 2 ? 'roseD' : 'cream');
});

// ---------------------------------------------------------------- floor: bowl, toy mouse, rug
R('rug', ellipse(730, 1196, 236, 42), 'violet');
R('rug-field', ellipse(730, 1196, 182, 24), 'cream');
R('bowl', poly([[268, 1160], [392, 1160], [372, 1222], [288, 1222]]), 'slate');
R('bowl-rim', ellipse(330, 1160, 64, 16), 'cream');
R('bowl-food', ellipse(330, 1160, 48, 9), 'brick');
R('mouse-ear', circle(498, 1172, 14), 'rose');
R('mouse', M(440, 1200) + C(446, 1168, 520, 1164, 548, 1200) + C(530, 1212, 462, 1212, 440, 1200) + 'Z', 'slate');

// ---------------------------------------------------------------- line work
// sleeping face
D(curve([[CX - 58, 776], [CX - 38, 788], [CX - 18, 776]]) + curve([[CX + 18, 776], [CX + 38, 788], [CX + 58, 776]]), '#3d2e26', 3.2);
D(M(CX, 818) + L(CX, 826) + M(CX - 16, 828) + Q(CX - 8, 836, CX, 826) + Q(CX + 8, 836, CX + 16, 828), '#7a5546', 2.2);
D(whiskers(CX - 30, 824, 78, -1) + whiskers(CX + 30, 824, 78, 1), '#fffaf0', 2);
D(line([[CX - 46, 862], [CX - 46, 876]]) + line([[CX - 28, 862], [CX - 28, 876]]) + line([[CX + 34, 862], [CX + 34, 876]]) + line([[CX + 52, 862], [CX + 52, 876]]), '#d6c3a4', 2);
// haunch and shoulder
D(curve([[590, 866], [580, 800], [626, 756], [688, 770]]), '#8a745c', 2.4);
D(curve([[462, 760], [486, 800], [478, 850]]), '#8a745c', 2.2);
// sun rays, birds, roof tiles
{
  let d = '';
  for (let i = 0; i < 10; i++) { const a = (i * Math.PI) / 5 + 0.3; d += line([[706 + Math.cos(a) * 60, 232 + Math.sin(a) * 60], [706 + Math.cos(a) * 76, 232 + Math.sin(a) * 76]]); }
  D(d, '#f0b93a', 3);
}
D(curve([[400, 300], [412, 290], [424, 300], [436, 290], [448, 300]]) + curve([[560, 196], [570, 188], [580, 196], [590, 188], [600, 196]]), '#4b607a', 2.2);
D(line([[228, 540], [324, 540]]) + line([[392, 500], [462, 500]]) + line([[544, 538], [628, 538]]) + line([[690, 574], [850, 574]]), '#ffffff', 1.8, 0.45);
D(line([[315, 584], [315, 630]]) + line([[586, 588], [586, 634]]) + line([[736, 632], [736, 680]]) + line([[401, 548], [401, 594]]) + line([[453, 548], [453, 594]]), '#ffffff', 1.6, 0.7);
// plant stems and leaf veins
D(curve([[790, 770], [780, 730], [774, 712]]) + curve([[812, 770], [814, 720], [816, 684]]) + curve([[830, 770], [846, 740], [852, 720]]), '#2f6142', 2.4);
fan.forEach(([rot, len]) => { const a = (rot * Math.PI) / 180; D(line([[200, 772], [200 + Math.cos(a) * len * 0.86, 772 + Math.sin(a) * len * 0.86]]), '#2c5a3d', 1.6, 0.6); });
// curtain rings, panel moulding, mouse tail and whiskers
{
  let d = '';
  for (const x of [22, 66, 110, 890, 934, 978]) d += circle(x, 66, 7);
  D(d, '#5e4a3d', 2.4);
}
D(rect(206, 964, 588, 72, 6), '#e2cf96', 2);
D(curve([[548, 1200], [580, 1210], [600, 1196], [622, 1204]]), '#6b87a8', 2.6);
D(circle(454, 1196, 1.6), '#2b2b33', 2.4);
D(line([[150, 1118], [150, 1140]]) + line([[420, 1118], [420, 1140]]) + line([[620, 1118], [620, 1146]]) + line([[900, 1118], [900, 1150]]), '#a97c4d', 1.6, 0.7);

const activity: PaintActivity = {
  id: 'pets-paint-3', version: 2, mode: 'paint', title: 'Cat on the Windowsill', blurb: 'A tabby cat dozes on a sunny windowsill between potted plants, with rose curtains and a row of rooftops beyond the glass.',
  collectionId: 'pets', categories: ["Animals", "Pets"], difficulty: 'Detailed',
  added: '2026-11-26',
  width: W, height: H, palette, regions: c.regions, detail: c.detail,
};
export default activity;
