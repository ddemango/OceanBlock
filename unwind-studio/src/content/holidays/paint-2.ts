import { rect, ellipse, circle, poly, blob, curve, line, xf, stroke } from '../../art/kit';
import type { PaintActivity, PaletteColor } from '../types';
import { W, H, collector, band, blossom, tulip, bladeLeaf, egg, eggBand, sampleCurve, clipRect, bandPts, ridge, tuft, M, L, Q, C, type Pt } from './props-paint';

const palette: PaletteColor[] = [
  { id: 'sky', number: 1, name: 'Spring sky', hex: '#cfe6f2' },
  { id: 'white', number: 2, name: 'Cotton white', hex: '#fdfbf4' },
  { id: 'butter', number: 3, name: 'Daffodil', hex: '#f7d76f' },
  { id: 'pink', number: 4, name: 'Blossom pink', hex: '#f7c3d0' },
  { id: 'rose', number: 5, name: 'Tulip rose', hex: '#e5809f' },
  { id: 'coral', number: 6, name: 'Coral', hex: '#f39a7b' },
  { id: 'lilac', number: 7, name: 'Lilac', hex: '#c4a9e0' },
  { id: 'mint', number: 8, name: 'Mint', hex: '#a6dcc4' },
  { id: 'hill', number: 9, name: 'Far meadow', hex: '#c4de94' },
  { id: 'grass', number: 10, name: 'Spring grass', hex: '#8fc46c' },
  { id: 'grassD', number: 11, name: 'Deep grass', hex: '#5e9a52' },
  { id: 'wicker', number: 12, name: 'Wicker', hex: '#dfaa62' },
  { id: 'wickerD', number: 13, name: 'Toasted wicker', hex: '#aa7440' },
  { id: 'bark', number: 14, name: 'Bark', hex: '#7b5642' },
  { id: 'fawn', number: 15, name: 'Bunny fawn', hex: '#e3d2bd' },
];

const { regions, detail, R } = collector();
const INK = '#5a4436';

// ---------------------------------------------------------------- sky & meadow
R('sky', rect(0, 0, W, 720), 'sky');
R('sun', circle(830, 190, 78), 'butter');
R('cloud-1', blob([[480, 250], [520, 206], [576, 210], [610, 172], [672, 182], [700, 226], [740, 240], [730, 270], [470, 272]], 0.7), 'white');
R('cloud-2', blob([[700, 380], [740, 350], [790, 356], [830, 330], [890, 346], [920, 384], [900, 400], [710, 402]], 0.7), 'white');
R('hill-far', ridge([[0, 590], [180, 540], [420, 520], [640, 556], [860, 520], [1000, 548]], 780), 'hill');
R('hill-near', ridge([[0, 660], [240, 628], [470, 660], [720, 622], [1000, 650]], 800), 'mint');
R('meadow', ridge([[0, 740], [300, 724], [620, 744], [1000, 720]], H), 'grass');
R('meadow-front', ridge([[0, 1176], [260, 1150], [560, 1170], [800, 1146], [1000, 1166]], H), 'grassD');
const petals: [number, number, number][] = [[160, 410, 30], [330, 470, 120], [560, 420, -40]];
petals.forEach(([x, y, r], i) => R(`falling-petal-${i + 1}`, ellipse(x, y, 15, 10, r), 'pink'));
detail.push(stroke(curve([[600, 330], [614, 320], [626, 330]]) + curve([[626, 330], [638, 320], [652, 330]]) + curve([[660, 300], [670, 292], [680, 300]]) + curve([[680, 300], [690, 292], [702, 300]]), '#6d7f8c', 2.4));

// ---------------------------------------------------------------- blossom branch
const branch: Pt[] = [[-10, 70], [130, 112], [290, 130], [470, 104], [560, 70]];
const twig1: Pt[] = [[210, 126], [262, 196], [296, 268]];
const twig2: Pt[] = [[360, 126], [412, 70], [436, 20]];
R('twig-1', band(twig1, 16, 7), 'bark');
R('twig-2', band(twig2, 15, 7), 'bark');
R('branch', poly(clipRect(bandPts(branch, 40, 12), 0, 0, W, H)), 'bark');
const blooms: [number, number, number, number][] = [
  [86, 150, 42, 10], [190, 76, 40, -8], [268, 190, 38, 20], [318, 282, 34, 4], [398, 160, 40, -14], [446, 44, 34, 12], [520, 120, 38, 30],
];
blooms.forEach(([x, y, r, rot], i) => {
  R(`blossom-${i + 1}`, blossom(x, y, r, rot), i % 3 === 1 ? 'white' : 'pink');
  R(`blossom-${i + 1}-heart`, circle(x, y, r * 0.3), i % 3 === 1 ? 'pink' : 'rose');
});

// ---------------------------------------------------------------- tulips
const tulips: [number, number, number, number, string][] = [
  [92, 900, 112, -8, 'rose'], [176, 880, 128, 4, 'coral'], [258, 920, 104, 12, 'butter'],
];
tulips.forEach(([x, , , rot], i) => {
  const bx = x - rot * 2;
  R(`tulip-${i + 1}-leaf-a`, bladeLeaf(bx - 6, 1186, 250 - i * 24, 38, -14, -14), i % 2 ? 'mint' : 'grassD');
  R(`tulip-${i + 1}-leaf-b`, bladeLeaf(bx + 6, 1186, 210 - i * 14, 34, 16, 16), i % 2 ? 'grassD' : 'mint');
});
tulips.forEach(([x, top, h, rot, col], i) => {
  const base: Pt = [x - rot * 2, 1180];
  const head: Pt = [x, top];
  R(`tulip-${i + 1}-stem`, band([base, [x - rot, (top + 1180) / 2], head], 14, 12), 'grassD');
  const t = tulip(head[0], head[1] + 8, h, rot);
  R(`tulip-${i + 1}`, t.cup, col);
  R(`tulip-${i + 1}-petal`, t.front, col === 'butter' ? 'coral' : col === 'coral' ? 'rose' : 'pink');
});

// ---------------------------------------------------------------- basket of eggs
R('basket-shadow', ellipse(520, 1124, 230, 30), 'grassD');
R('basket-handle', band(sampleCurve([[348, 900], [372, 760], [520, 676], [668, 760], [692, 900]], 4), 30, 30, 4), 'wickerD');
const eggs: [string, number, number, number, number, number, string, string, number][] = [
  ['egg-1', 400, 866, 46, 60, -20, 'lilac', 'butter', 10],
  ['egg-2', 476, 846, 48, 64, -6, 'butter', 'rose', 0],
  ['egg-3', 556, 842, 48, 64, 8, 'mint', 'coral', 12],
  ['egg-4', 632, 862, 46, 60, 22, 'pink', 'lilac', 0],
  ['egg-5', 514, 884, 44, 56, 2, 'coral', 'white', 10],
];
for (const [id, x, y, rx, ry, rot, col, stripe, zig] of eggs) {
  R(id, egg(x, y, rx, ry, rot), col);
  R(`${id}-band`, eggBand(x, y, rx, ry, -16, 8, rot, zig), stripe);
}
R('basket', M(318, 900) + L(722, 900) + C(714, 990, 690, 1080, 620, 1110) + Q(520, 1130, 420, 1110) + C(350, 1080, 326, 990, 318, 900) + 'Z', 'wicker');
R('basket-weave-1', poly([[322, 952], [718, 952], [714, 978], [326, 978]]), 'wickerD');
R('basket-weave-2', poly([[336, 1024], [704, 1024], [696, 1050], [344, 1050]]), 'wickerD');
R('basket-rim', rect(304, 884, 432, 32, 16), 'wickerD');
// bow on the handle
R('bow-loop-l', blob([[520, 690], [470, 650], [440, 668], [452, 712], [500, 712]], 0.9), 'rose');
R('bow-loop-r', blob([[520, 690], [570, 650], [600, 668], [588, 712], [540, 712]], 0.9), 'rose');
R('bow-tail-l', poly([[512, 700], [486, 770], [500, 764], [510, 780], [526, 704]]), 'pink');
R('bow-tail-r', poly([[528, 700], [556, 768], [542, 762], [532, 778], [516, 704]]), 'pink');
R('bow-knot', ellipse(520, 694, 17, 15), 'coral');

// ---------------------------------------------------------------- eggs in the grass
const grassEggs: [string, number, number, number, number, number, string, string, number][] = [
  ['grass-egg-1', 316, 1120, 40, 52, -64, 'mint', 'lilac', 9],
  ['grass-egg-2', 742, 1140, 38, 50, 70, 'butter', 'mint', 0],
];
for (const [id, x, y, rx, ry, rot, col, stripe, zig] of grassEggs) {
  R(id, egg(x, y, rx, ry, rot), col);
  R(`${id}-band`, eggBand(x, y, rx, ry, -14, 8, rot, zig), stripe);
}

// ---------------------------------------------------------------- bunny
R('bunny-ear-back', xf(blob([[0, 0], [-26, -80], [-16, -150], [6, -170], [24, -140], [22, -70]], 1), { rot: 14, x: 836, y: 800 }), 'fawn');
R('bunny-ear-back-inner', xf(blob([[0, -20], [-12, -84], [-6, -140], [6, -150], [12, -110], [12, -60]], 1), { rot: 14, x: 836, y: 800 }), 'pink');
R('bunny-tail', circle(944, 1046, 30), 'white');
R('bunny-body', blob([[790, 900], [860, 880], [930, 920], [960, 1010], [940, 1090], [860, 1112], [790, 1100], [760, 1020]], 1), 'fawn');
R('bunny-chest', blob([[780, 930], [820, 940], [836, 1000], [820, 1060], [784, 1072], [766, 1000]], 1), 'white');
R('bunny-foot', ellipse(852, 1104, 64, 18, 0), 'white');
R('bunny-paw', ellipse(792, 1080, 24, 30, 10), 'white');
R('bunny-head', ellipse(800, 852, 66, 54, -12), 'fawn');
R('bunny-ear-front', xf(blob([[0, 0], [-30, -76], [-24, -150], [0, -176], [22, -146], [24, -70]], 1), { rot: -10, x: 806, y: 800 }), 'fawn');
R('bunny-ear-front-inner', xf(blob([[0, -22], [-14, -84], [-10, -140], [2, -154], [12, -116], [12, -62]], 1), { rot: -10, x: 806, y: 800 }), 'pink');
R('bunny-muzzle', ellipse(760, 876, 32, 22, -10), 'white');
R('bunny-nose', ellipse(740, 864, 10, 8), 'rose');
detail.push(stroke(circle(784, 838, 6), INK, 5));
detail.push(stroke(curve([[740, 872], [746, 886], [758, 890]]) + curve([[736, 876], [708, 872]]) + curve([[738, 882], [712, 890]]), INK, 1.6));
detail.push(stroke(curve([[880, 980], [930, 990], [946, 1050], [920, 1096]]), '#b9a48b', 2));
detail.push(stroke(curve([[812, 1092], [816, 1104], [814, 1114]]) + curve([[828, 1094], [832, 1108]]), '#c7b29a', 1.6));

// ---------------------------------------------------------------- grass tufts & daisies
R('tuft-1', tuft(440, 1166, 1.1), 'grassD');
R('tuft-2', tuft(660, 1150, 1), 'grassD');
R('tuft-3', tuft(930, 1196, 1.2), 'grass');
const daisies: [number, number][] = [[606, 1212]];
daisies.forEach(([x, y], i) => {
  R(`daisy-${i + 1}`, blossom(x, y, 26, i * 20, 6), 'white');
  R(`daisy-${i + 1}-eye`, circle(x, y, 9), 'butter');
});

// ---------------------------------------------------------------- line work
for (const [x, y, r, rot] of blooms) {
  let d = '';
  for (let k = 0; k < 5; k++) { const a = ((rot + 36 + k * 72) * Math.PI) / 180; d += line([[x + Math.cos(a) * r * 0.32, y + Math.sin(a) * r * 0.32], [x + Math.cos(a) * r * 0.6, y + Math.sin(a) * r * 0.6]]); }
  detail.push(stroke(d, '#c8607c', 1.6));
}
for (const y of [930, 1000, 1076]) detail.push(stroke(curve([[330, y], [520, y + 10], [710, y]]), '#b98447', 1.6));
for (let x = 350; x <= 700; x += 34) detail.push(stroke(line([[x, 920], [x + (x - 520) * 0.12, 1094]]), '#c38e4f', 1.2, { opacity: 0.6 }));
detail.push(stroke(circle(400, 896, 3) + circle(420, 900, 3) + circle(632, 896, 3) + circle(612, 902, 3), '#ffffff', 2));
detail.push(stroke(curve([[60, 760], [80, 740]]) + curve([[540, 790], [552, 770]]) + curve([[940, 800], [956, 782]]), '#6fa65a', 2));

const activity: PaintActivity = {
  id: 'holidays-paint-2', version: 1, mode: 'paint', title: 'Easter Garden',
  blurb: 'A basket of painted eggs on fresh spring grass, with tulips, a sleepy bunny and a branch of pink blossom overhead.',
  added: '2026-11-25', collectionId: 'holidays', categories: ["Holidays"], difficulty: 'Relaxed',
  season: { from: '03-15', to: '04-25', label: 'Easter' },
  width: W, height: H, palette, regions, detail,
};
export default activity;
