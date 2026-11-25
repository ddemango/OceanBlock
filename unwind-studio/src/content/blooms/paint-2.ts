import { blob, circle, curve, ellipse, line, poly, rect, star, xf, type Xf } from '../../art/kit';
import type { Pt } from '../../art/geometry';
import type { PaintActivity } from '../types';
import { W, H, band, bandAt, canvas, edged, hollyHalf, polar } from './props-paint';

const c = canvas();
const { R, D } = c;

// ---------------------------------------------------------------- winter sky
R('bg-sky', rect(0, 0, W, H), 'sky');
R('bg-sky-top', edged([[0, 360], [180, 320], [420, 340], [640, 300], [860, 250], [1000, 236]], [[1000, 0], [0, 0]]), 'skyDeep');
R('sun-halo', circle(760, 210, 150), 'sky');
R('sun', circle(760, 210, 100), 'snow');

// distant firs on a snowy rise
function fir(x: number, base: number, h: number, w: number): string {
  const right: Pt[] = [];
  const tiers = 4;
  for (let i = 1; i <= tiers; i++) {
    const y = base - h + (h * i) / tiers;
    const hw = (w / 2) * (0.35 + (0.65 * i) / tiers);
    right.push([x + hw, y]);
    right.push([x + (i < tiers ? hw * 0.45 : 10), y - (i < tiers ? h * 0.03 : 0)]);
  }
  right.push([x + 10, base + 30]);
  const left = right.map(([px, py]) => [2 * x - px, py] as Pt).reverse();
  return poly([[x, base - h], ...right, ...left]);
}
[[90, 1010, 230, 120], [210, 1000, 300, 150], [360, 1020, 200, 110], [640, 1000, 260, 130], [790, 990, 330, 160], [930, 1005, 240, 120]].forEach(([x, b, h, w], i) =>
  R(`fir-${i + 1}`, fir(x, b, h, w), 'pine'));
R('ground-far', edged([[0, 990], [160, 960], [380, 985], [600, 955], [820, 970], [1000, 950]], [[1000, 1250], [0, 1250]]), 'snow');
R('ground-near', edged([[0, 1120], [200, 1090], [420, 1110], [640, 1150], [860, 1120], [1000, 1100]], [[1000, 1250], [0, 1250]]), 'snowShade');

// ---------------------------------------------------------------- branch
const branch: Pt[] = [[0, 806], [200, 776], [400, 750], [600, 728], [800, 702], [1000, 670]];
const twig: Pt[] = [[850, 694], [880, 610], [920, 520], [960, 440]];
const twig2: Pt[] = [[110, 790], [96, 700], [70, 610], [30, 530]];
R('twig', band(twig, 26, 14), 'bark', bandAt(twig, 0.35, 4));
R('twig2', band(twig2, 28, 16), 'bark', bandAt(twig2, 0.55, 4));
R('branch', band(branch, 54, 36), 'bark', bandAt(branch, 0.06, -6));
R('branch-shade', band(branch, 20, 14, 16, 11), 'barkDark', bandAt(branch, 0.94, 12));
R('knot', ellipse(530, 744, 22, 12, -6), 'barkDark');
D(curve([[20, 798], [140, 782], [260, 768]]) + curve([[560, 730], [680, 716], [800, 700]]), '#3c2c20', 1.4, 0.6);
D(ellipse(530, 744, 12, 6, -6), '#2e2118', 1.2, 0.7);

// snow lying along the top of the branch and twigs
/** A drift of snow on the upper edge of a band (centre line pts, half width half) between t0..t1. */
function snowCap(id: string, pts: Pt[], t0: number, t1: number, thick: number, half: number) {
  const s: Pt[] = [];
  for (let i = 0; i <= 12; i++) s.push(bandAt(pts, t0 + ((t1 - t0) * i) / 12, -half + 3));
  const top: Pt[] = s.map(([x, y], i) => [x, y - thick * Math.pow(Math.sin((Math.PI * i) / 12), 0.6) - 2] as Pt);
  R(id, poly([...s, ...top.reverse()]), 'snow');
}
snowCap('snow-1', branch, 0.0, 0.17, 30, 26);
snowCap('snow-2', branch, 0.36, 0.54, 26, 24);
snowCap('snow-3', branch, 0.9, 1.0, 28, 19);
R('snow-tuft-1', blob([[948, 452], [962, 426], [984, 432], [986, 456], [966, 466]], 1), 'snow');
R('snow-tuft-2', blob([[18, 540], [30, 512], [54, 516], [56, 540], [36, 552]], 1), 'snow');
D(curve([[20, 780], [80, 772], [150, 768]]) + curve([[680, 704], [740, 696], [790, 690]]), '#b9c9d8', 1.6, 0.8);

// ---------------------------------------------------------------- holly
function holly(id: string, x: number, y: number, len: number, wid: number, rot: number, flip = false) {
  const t: Xf = { x, y, rot };
  R(`${id}-a`, xf(hollyHalf(len, wid, 1), t), flip ? 'hollyLight' : 'holly');
  R(`${id}-b`, xf(hollyHalf(len, wid, -1), t), flip ? 'holly' : 'hollyLight');
  D(xf(curve([[4, 0], [len * 0.5, wid * 0.03], [len, 0]]), t), '#1f4a35', 1.6, 0.7);
  D(xf(curve([[len * 0.2, -wid * 0.45], [len * 0.45, -wid * 0.62], [len * 0.7, -wid * 0.45]]), t), '#ffffff', 2.4, 0.4);
}
function berries(id: string, pts: [number, number, number][]) {
  pts.forEach(([x, y, r], i) => {
    R(`${id}-${i + 1}`, circle(x, y, r), i % 3 === 1 ? 'berryLight' : 'berry');
    D(curve([[x - r * 0.55, y - r * 0.1], [x - r * 0.4, y - r * 0.45], [x - r * 0.1, y - r * 0.6]]), '#ffffff', 2.2, 0.7);
    D(line([[x + r * 0.15, y + r * 0.25], [x + r * 0.3, y + r * 0.35]]), '#5a1a1e', 2, 0.6);
  });
}
// left sprig rising from the branch
holly('holly-l1', 230, 772, 150, 40, -150);
holly('holly-l2', 236, 768, 160, 42, -112, true);
holly('holly-l3', 246, 768, 150, 40, -62);
holly('holly-l4', 250, 774, 130, 36, -18, true);
holly('holly-l5', 232, 786, 120, 34, 160, true);
berries('berry-l', [[236, 742, 18], [264, 752, 17], [214, 756, 16], [248, 722, 16], [278, 728, 15], [222, 726, 15]]);
// right sprig at the twig fork
holly('holly-r1', 850, 692, 150, 40, -160, true);
holly('holly-r2', 856, 684, 140, 38, -112);
holly('holly-r3', 870, 690, 150, 40, -36, true);
holly('holly-r4', 864, 704, 128, 36, 26);
berries('berry-r', [[858, 672, 18], [884, 680, 17], [836, 682, 16], [872, 654, 15], [848, 650, 15]]);
// sprig on the high twig
holly('holly-t1', 904, 448, 120, 32, -140, true);
holly('holly-t2', 906, 446, 116, 32, -60);
berries('berry-t', [[904, 430, 15], [926, 440, 14], [884, 438, 14]]);
// sprig hanging into the top-left corner
const hang: Pt[] = [[0, 150], [90, 170], [170, 200], [230, 240]];
R('hang-twig', band(hang, 18, 10), 'bark', bandAt(hang, 0.3));
holly('holly-h1', 120, 178, 130, 36, 70, true);
holly('holly-h2', 180, 206, 130, 36, 120);
holly('holly-h3', 226, 238, 116, 32, 30, true);
berries('berry-h', [[168, 236, 15], [192, 248, 14], [148, 252, 14]]);
// foreground sprig
holly('holly-f1', 970, 1218, 220, 60, -146);
holly('holly-f2', 960, 1222, 190, 54, -108, true);
holly('holly-f3', 975, 1200, 170, 48, -172, true);
berries('berry-f', [[842, 1150, 22], [872, 1168, 21], [836, 1186, 20], [866, 1132, 19]]);

// ---------------------------------------------------------------- the robin
{
  const t: Xf = { x: 470, y: 556, s: 1.55, rot: -4 };
  const P = (id: string, d: string, col: string) => R(`robin-${id}`, xf(d, t), col);
  const DD = (d: string, col: string, w: number, o = 1) => D(xf(d, t), col, w, o);
  // legs and toes gripping the branch
  DD(line([[-34, 84], [-38, 106]]) + line([[0, 88], [2, 106]]), '#5a3a2a', 3);
  DD(line([[-38, 106], [-52, 110]]) + line([[-38, 106], [-26, 111]]) + line([[2, 106], [-10, 110]]) + line([[2, 106], [16, 109]]), '#5a3a2a', 2.4);
  P('tail', blob([[70, 24], [150, 72], [192, 112], [178, 128], [120, 104], [56, 64]], 0.9), 'robinBrown');
  P('tail-edge', blob([[120, 76], [168, 100], [190, 116], [180, 128], [140, 112], [112, 92]], 0.9), 'barkDark');
  P('body', blob([[-70, -112], [-20, -122], [40, -102], [92, -54], [112, 10], [90, 62], [30, 92], [-40, 90], [-84, 60], [-96, -40]], 1), 'robinBrown');
  P('belly', blob([[-86, 46], [-50, 76], [10, 92], [66, 74], [40, 52], [-20, 44], [-60, 34]], 1), 'cream');
  P('grey-edge', blob([[-112, -94], [-78, -126], [-40, -122], [-20, -80], [-12, -20], [-26, 40], [-58, 70], [-98, 58], [-122, -20]], 1), 'snowShade');
  P('breast', blob([[-126, -60], [-112, -102], [-80, -118], [-52, -108], [-36, -72], [-30, -18], [-42, 34], [-70, 58], [-104, 46], [-126, 0]], 1), 'robinOrange');
  P('breast-light', blob([[-114, -34], [-98, -56], [-74, -46], [-62, -6], [-76, 28], [-104, 18]], 1), 'robinPeach');
  P('wing', blob([[-14, -76], [40, -90], [90, -48], [116, 10], [96, 48], [40, 40], [-4, 4], [-20, -36]], 1), 'robinTan');
  P('wing-tip', blob([[52, 14], [100, 6], [134, 36], [112, 58], [62, 44]], 0.9), 'barkDark');
  P('beak', poly([[-120, -88], [-152, -78], [-120, -68]]), 'ink');
  P('eye', circle(-94, -86, 8.5), 'ink');
  DD(line([[-97, -90], [-95, -92]]), '#ffffff', 2.6);
  // feather detail
  DD(curve([[4, -50], [40, -58], [76, -34]]) + curve([[10, -28], [46, -32], [86, -10]]) + curve([[16, -6], [52, -4], [96, 14]]), '#7a5c40', 1.6, 0.7);
  DD(curve([[-60, 60], [-30, 74], [0, 80]]) + curve([[-20, 66], [10, 76], [40, 70]]), '#d9c9b0', 1.4, 0.8);
  DD(curve([[-118, -10], [-104, 14], [-86, 24]]), '#c25f28', 1.2, 0.5);
  DD(curve([[-60, -116], [-30, -112], [0, -98]]), '#6f5540', 1.2, 0.6);
}

// ---------------------------------------------------------------- falling snow
const flakes: [number, number, number][] = [
  [90, 120, 24], [260, 220, 18], [420, 80, 26], [560, 240, 17], [930, 80, 20], [640, 440, 19], [150, 400, 22],
  [330, 340, 16], [960, 600, 18], [700, 920, 17], [250, 900, 18], [480, 1040, 22], [80, 1160, 18], [600, 1180, 16],
];
flakes.forEach(([x, y, r], i) => {
  R(`flake-${i + 1}`, star(x, y, r, r * 0.5, 6, -90 + i * 7), 'snow');
  let arms = '';
  for (let k = 0; k < 6; k++) arms += line([[x, y], polar(x, y, r * 0.8, -90 + i * 7 + k * 60)]);
  D(arms, '#b9c9d8', 1, 0.8);
});
let dust = '';
[[180, 300], [380, 170], [700, 120], [860, 330], [60, 640], [340, 520], [900, 820], [600, 860], [120, 880], [760, 560], [470, 300], [30, 260]].forEach(([x, y]) => {
  dust += circle(x, y, 2.5);
});
D(dust, '#ffffff', 3, 0.9);

const activity: PaintActivity = {
  id: 'blooms-paint-2', version: 1, mode: 'paint',
  title: 'Robin in Winter Berries',
  blurb: 'A round little robin warms the snowy branch, framed by glossy holly and bright red berries while the first flakes drift down.',
  collectionId: 'blooms',
  categories: ['Birds', 'Winter', 'Garden'],
  difficulty: 'Moderate',
  width: W, height: H,
  palette: [
    { id: 'sky', number: 1, name: 'Winter sky', hex: '#dce8f0' },
    { id: 'skyDeep', number: 2, name: 'Frost blue', hex: '#b5cadb' },
    { id: 'snow', number: 3, name: 'Snow', hex: '#fbfdff' },
    { id: 'snowShade', number: 4, name: 'Snow shadow', hex: '#cfdbe6' },
    { id: 'pine', number: 5, name: 'Misty fir', hex: '#8fa9a5' },
    { id: 'bark', number: 6, name: 'Bark', hex: '#7b5b43' },
    { id: 'barkDark', number: 7, name: 'Dark bark', hex: '#4d3a2c' },
    { id: 'holly', number: 8, name: 'Holly green', hex: '#2c6a4b' },
    { id: 'hollyLight', number: 9, name: 'Light holly', hex: '#5e9c6c' },
    { id: 'berry', number: 10, name: 'Berry red', hex: '#c42f3a' },
    { id: 'berryLight', number: 11, name: 'Bright berry', hex: '#e8625a' },
    { id: 'robinOrange', number: 12, name: 'Robin orange', hex: '#e0773a' },
    { id: 'robinPeach', number: 13, name: 'Apricot', hex: '#f4ab6c' },
    { id: 'robinBrown', number: 14, name: 'Olive brown', hex: '#8a6d50' },
    { id: 'robinTan', number: 15, name: 'Warm tan', hex: '#b89a79' },
    { id: 'cream', number: 16, name: 'Cream', hex: '#f6ecda' },
    { id: 'ink', number: 17, name: 'Charcoal', hex: '#2e2a2a' },
  ],
  regions: c.regions,
  detail: c.detail,
};
export default activity;
