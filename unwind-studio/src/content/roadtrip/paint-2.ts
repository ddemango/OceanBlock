import { rect, ellipse, circle, poly, line, curve, blob, star, sector, waveBand, stroke } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { PaintActivity, PaletteColor } from '../types';
import { collector, rrect, frond, frondHalf, trunk, chordBand, ellipseSlice, M, L, Q, type Pt } from './props-paint';

const W = 1000, H = 1250;

const palette: PaletteColor[] = [
  { id: 'dusk', number: 1, name: 'Dusk violet', hex: '#9089bd' },
  { id: 'rose', number: 2, name: 'Sunset rose', hex: '#ee9c96' },
  { id: 'tangerine', number: 3, name: 'Tangerine', hex: '#f4a35b' },
  { id: 'gold', number: 4, name: 'Golden hour', hex: '#fbd26e' },
  { id: 'cream', number: 5, name: 'Vanilla cream', hex: '#fff3dc' },
  { id: 'deepSea', number: 6, name: 'Deep water', hex: '#2f6f88' },
  { id: 'teal', number: 7, name: 'Ocean teal', hex: '#45a0a6' },
  { id: 'turquoise', number: 8, name: 'Seafoam paint', hex: '#79cbc0' },
  { id: 'coral', number: 9, name: 'Coral', hex: '#e86b58' },
  { id: 'sand', number: 10, name: 'Warm sand', hex: '#f2d8aa' },
  { id: 'sandShadow', number: 11, name: 'Dune shadow', hex: '#d8ae7c' },
  { id: 'palmGreen', number: 12, name: 'Palm green', hex: '#66a35c' },
  { id: 'palmDark', number: 13, name: 'Deep palm', hex: '#3b6c4b' },
  { id: 'trunk', number: 14, name: 'Palm bark', hex: '#a7764b' },
  { id: 'plum', number: 15, name: 'Twilight plum', hex: '#5f4a6e' },
  { id: 'charcoal', number: 16, name: 'Tyre black', hex: '#3b383f' },
  { id: 'silver', number: 17, name: 'Chrome', hex: '#c9ccd2' },
  { id: 'glass', number: 18, name: 'Window glass', hex: '#4e6d86' },
];

const { regions, R } = collector();
const detail: Shape[] = [];
const INK = '#4a3b45';
const HORIZON = 600;

// ---------- sunset sky ----------
R('sky', rect(0, 0, W, H), 'dusk');
R('sky-rose', waveBand(0, W, 190, 8, 820, H, 0.4), 'rose');
R('sky-tangerine', waveBand(0, W, 350, 7, 700, H, 2.1), 'tangerine');
R('sky-gold', waveBand(0, W, 480, 6, 760, H, 4), 'gold');
R('cloud-1', blob([[90, 290], [150, 268], [260, 262], [330, 276], [300, 296], [150, 300]], 0.8), 'cream');
R('cloud-2', blob([[620, 128], [700, 104], [820, 100], [920, 116], [880, 138], [700, 142]], 0.8), 'rose');
R('cloud-3', blob([[700, 420], [760, 404], [860, 404], [920, 420], [870, 436], [740, 436]], 0.8), 'cream');

// ---------- the sun, sinking into the sea ----------
const SUN = { x: 560, y: HORIZON + 6, r: 136 };
R('sun', circle(SUN.x, SUN.y, SUN.r), 'cream');
R('sun-stripe-1', chordBand(SUN.x, SUN.y, SUN.r, 540, 554), 'tangerine');
R('sun-stripe-2', chordBand(SUN.x, SUN.y, SUN.r, 570, 586), 'tangerine');
R('headland', curve([[0, 548], [60, 536], [130, 546], [200, 570], [260, 586], [310, 600]], 0.8) + L(0, 600) + 'Z', 'plum');
R('islet', curve([[318, 600], [346, 588], [380, 582], [410, 588], [436, 600]], 0.8) + 'Z', 'plum');

// ---------- ocean ----------
R('sea-far', rect(0, HORIZON, W, H - HORIZON), 'deepSea');
R('sea-near', waveBand(0, W, 668, 5, 260, H, 0.8), 'teal');
const glints: [number, number, number][] = [[614, 220, 12], [633, 160, 12], [652, 104, 12]];
glints.forEach(([y, w, h], i) => R(`glint-${i + 1}`, rrect(SUN.x - w / 2 + (i % 2) * 14, y - h / 2, w, h, [h / 2, h / 2, h / 2, h / 2]), 'gold'));
R('foam', waveBand(0, W, 786, 7, 170, H, 1), 'cream');
R('beach', waveBand(0, W, 806, 8, 260, H, 2.4), 'sand');

// ---------- palm trees ----------
function palm(id: string, base: Pt, top: Pt, bend: number, w0: number, w1: number, bands: number, fronds: [number, number, number][], nuts: Pt[]) {
  const t = trunk(base, top, bend, w0, w1);
  for (let i = 0; i < bands; i++) R(`${id}-trunk-${i + 1}`, t.band(i / bands, (i + 1) / bands + (i === bands - 1 ? 0.03 : 0)), i % 2 ? 'sandShadow' : 'trunk');
  fronds.forEach(([rot, len, droop], i) => {
    const d = Math.cos((rot * Math.PI) / 180) >= 0 ? droop : -droop;
    R(`${id}-frond-${i + 1}`, frond(top[0], top[1], len, 25, rot, d), 'palmDark');
    R(`${id}-frond-${i + 1}-light`, frondHalf(top[0], top[1], len, 25, rot, d), 'palmGreen');
  });
  nuts.forEach(([x, y], i) => R(`${id}-coconut-${i + 1}`, circle(x, y, 15), 'plum'));
}
palm('palm-left', [92, 1146], [178, 548], -46, 40, 22, 7,
  [[-162, 150, 56], [-136, 180, 60], [-100, 150, 50], [-58, 190, 60], [-18, 220, 80], [24, 180, 70]],
  [[166, 566], [192, 572], [178, 590]]);
palm('palm-right', [948, 1110], [872, 598], 30, 34, 20, 5,
  [[-176, 170, 64], [-128, 150, 50], [-62, 160, 54], [-16, 118, 40], [30, 120, 46]],
  [[862, 614], [886, 616]]);

// ---------- the coast highway along the bottom, and a starfish ----------
R('starfish', star(410, 1112, 28, 11, 5, -80), 'coral');
R('road-shoulder', waveBand(0, W, 1150, 4, 500, H, 1), 'sandShadow', [300, 1160]);
R('highway', rect(0, 1168, W, H - 1168), 'glass');
for (let i = 0; i < 5; i++) R(`lane-dash-${i + 1}`, rrect(50 + i * 200, 1204, 100, 12, [3, 3, 3, 3]), 'gold');
detail.push(stroke(line([[0, 1176], [W, 1176]]) + line([[0, 1242], [W, 1242]]), '#fff3dc', 3));
detail.push(stroke(line([[0, 1158], [W, 1158]]), '#8a7c6c', 2));
{
  // wooden guard-rail posts on the shoulder
  let posts = '';
  for (let x = 40; x < W; x += 120) posts += line([[x, 1150], [x, 1166]]);
  detail.push(stroke(posts, '#7a5638', 3));
}

// ---------- the camper van ----------
const SH = { x: 512, y: 1046 };
R('van-shadow', ellipse(SH.x, SH.y, 330, 20), 'sandShadow', [216, 1046]);

// surfboard on the roof rack
const BOARD = { x: 520, y: 700, rx: 318, ry: 20 };
detail.push(stroke(line([[330, 716], [330, 738]]) + line([[700, 716], [700, 738]]) + line([[300, 727], [730, 727]]), '#6d6f78', 5));
R('surfboard', ellipse(BOARD.x, BOARD.y, BOARD.rx, BOARD.ry), 'gold', [470, 700]);
R('surfboard-stripe-1', ellipseSlice(BOARD.x, BOARD.y, BOARD.rx, BOARD.ry, 286, 304), 'coral');
R('surfboard-stripe-2', ellipseSlice(BOARD.x, BOARD.y, BOARD.rx, BOARD.ry, 316, 334), 'turquoise');

// body: rounded nose on the left, upright rear on the right
const BODY = M(212, 975) + L(196, 850) + 'C190 760 232 735 322 735' + L(762, 735) + Q(822, 735, 823, 795) + L(826, 950) + Q(826, 975, 800, 975) + 'Z';
R('van-body', BODY, 'cream');
R('van-stripe', poly([[196.1, 846], [824.1, 846], [824.3, 862], [197.5, 862]]), 'coral', [580, 854]);
R('van-lower', M(197.5, 862) + L(824.3, 862) + L(826, 950) + Q(826, 975, 800, 975) + L(212, 975) + 'Z', 'turquoise');

// windows
R('cab-window', M(240, 830) + L(234, 800) + 'C234 774 252 760 284 760' + L(338, 760) + L(338, 830) + 'Z', 'glass');
R('window-1', rrect(370, 760, 120, 70, [14, 14, 14, 14]), 'glass');
R('window-2', rrect(510, 760, 120, 70, [14, 14, 14, 14]), 'glass');
R('window-3', rrect(650, 760, 140, 70, [14, 14, 14, 14]), 'glass');
R('curtain-2', M(524, 760) + L(560, 760) + Q(546, 792, 556, 830) + L(524, 830) + Q(510, 830, 510, 816) + L(510, 774) + Q(510, 760, 524, 760) + 'Z', 'gold');
R('curtain-3', M(776, 760) + L(738, 760) + Q(752, 792, 742, 830) + L(776, 830) + Q(790, 830, 790, 816) + L(790, 774) + Q(790, 760, 776, 760) + 'Z', 'gold');
detail.push(stroke(line([[264, 768], [252, 798]]) + line([[392, 768], [380, 796]]) + line([[674, 768], [662, 796]]), '#ffffff', 3, { opacity: 0.45 }));
detail.push(stroke(curve([[548, 794], [552, 800], [548, 806]]) + curve([[750, 794], [746, 800], [750, 806]]), '#c99a3a', 2));

// doors, handle and trim
detail.push(stroke(
  M(350, 745) + L(350, 900) + M(500, 745) + L(500, 968) + M(636, 745) + L(636, 900),
  '#b9a98e', 2));
R('door-handle', rrect(514, 886, 38, 12, [6, 6, 6, 6]), 'silver');
R('cab-handle', rrect(300, 886, 30, 12, [6, 6, 6, 6]), 'silver');
R('mirror', ellipse(214, 790, 12, 17, -10), 'silver');
detail.push(stroke(line([[224, 796], [238, 806]]), '#6d6f78', 3));

// lights and bumpers
R('headlight-rim', circle(204, 896, 21), 'silver');
R('headlight', circle(204, 896, 13), 'gold');
R('tail-light', rrect(814, 880, 16, 38, [7, 7, 7, 7]), 'coral');
R('bumper-front', rrect(172, 956, 76, 22, [10, 10, 10, 10]), 'silver');
R('bumper-rear', rrect(786, 956, 58, 22, [10, 10, 10, 10]), 'silver');

// wheels
for (const [i, wx] of [[1, 334], [2, 700]] as const) {
  R(`arch-${i}`, sector(wx, 976, 68, 180, 360), 'plum');
  R(`tyre-${i}`, circle(wx, 990, 56), 'charcoal');
  R(`hubcap-${i}`, circle(wx, 990, 32), 'cream');
  R(`hub-${i}`, circle(wx, 990, 13), 'silver');
  let spokes = '';
  for (let k = 0; k < 6; k++) {
    const a = (k * Math.PI) / 3;
    spokes += line([[wx + Math.cos(a) * 16, 990 + Math.sin(a) * 16], [wx + Math.cos(a) * 28, 990 + Math.sin(a) * 28]]);
  }
  detail.push(stroke(spokes, '#b8b2a4', 2));
}

// ---------- line work ----------
{
  // gentle wave lines on the sea
  let d = '';
  for (const [x, y, w] of [[60, 640, 70], [240, 650, 60], [760, 646, 60], [150, 750, 70], [850, 760, 50]] as [number, number, number][]) {
    d += curve([[x, y], [x + w * 0.25, y - 4], [x + w * 0.5, y], [x + w * 0.75, y - 4], [x + w, y]], 0.8);
  }
  detail.push(stroke(d, '#ffffff', 2, { opacity: 0.45 }));
  // palm frond ribs
  // a few birds heading home
  const bird = (x: number, y: number, s: number) => curve([[x - s, y - s * 0.4], [x - s * 0.5, y - s * 0.6], [x, y]], 0.8) + curve([[x, y], [x + s * 0.5, y - s * 0.6], [x + s, y - s * 0.4]], 0.8);
  detail.push(stroke(bird(470, 220, 13) + bird(510, 200, 10) + bird(540, 236, 8), INK, 2));
  // footprints and grass tufts in the sand
  detail.push(stroke(
    curve([[150, 1140], [154, 1112], [148, 1092]]) + curve([[162, 1140], [170, 1118], [180, 1104]]) + curve([[138, 1140], [130, 1122], [118, 1112]]) +
    curve([[960, 1000], [962, 972], [956, 954]]) + curve([[970, 1000], [978, 978], [988, 966]]),
    '#7d9a4f', 3));
}

const activity: PaintActivity = {
  id: 'roadtrip-paint-2', version: 1, mode: 'paint', title: 'Vintage Camper Van',
  blurb: 'A two-tone camper van with a surfboard on the roof, pulled off the coast highway between the palms as the sun sinks into the Pacific.',
  collectionId: 'roadtrip', categories: ["Travel"], difficulty: 'Moderate',
  width: W, height: H, palette, regions, detail,
};
export default activity;
