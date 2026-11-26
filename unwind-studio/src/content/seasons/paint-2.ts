import { ellipse, line, petal, poly, rect } from '../../art/kit';
import type { Pt } from '../../art/geometry';
import type { PaintActivity } from '../types';
import { W, H, band, between, canvas, curve, edged, polar, puff, sample, soft } from './props-paint';

const c = canvas();
const { R, D } = c;

/** Points of a lumpy crown, for soft(). */
function crown(cx: number, cy: number, rx: number, ry: number, bumps: number, seed: number, dip = 0.86): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i < bumps * 2; i++) {
    const a = -90 + (i * 180) / bumps + seed;
    const k = i % 2 ? dip : 1 + 0.05 * Math.sin(i * 1.7 + seed);
    const p = polar(0, 0, 1, a);
    pts.push([cx + p[0] * rx * k, cy + p[1] * ry * k]);
  }
  return pts;
}

// ---------------------------------------------------------------- sky and distance
R('sky', rect(0, 0, W, H), 'sky');
R('cloud-1', puff(500, 250, 110, 36, 6, 10, true), 'mist');
R('cloud-2', puff(540, 390, 70, 22, 5, 30, true), 'mist');
R('hill-far', edged([[0, 560], [200, 520], [430, 548], [640, 512], [850, 540], [1000, 520]], [[1000, 1250], [0, 1250]]), 'hill');
R('meadow', edged([[0, 610], [250, 596], [500, 606], [750, 592], [1000, 604]], [[1000, 1250], [0, 1250]]), 'grass');

// ---------------------------------------------------------------- stream
R('stream', between([[0, 640], [260, 632], [520, 646], [780, 630], [1000, 640]], [[0, 690], [300, 680], [560, 694], [800, 680], [1000, 692]]), 'water');
D(curve([[60, 660], [120, 656], [180, 660]]) + curve([[700, 652], [760, 648], [820, 652]]) + curve([[860, 674], [910, 670], [960, 674]]) + curve([[220, 676], [270, 672], [320, 676]]), '#ffffff', 2, 0.8);

// ---------------------------------------------------------------- lane
const laneL: Pt[] = [[484, 690], [440, 770], [340, 920], [210, 1090], [120, 1250]];
const laneR: Pt[] = [[540, 690], [590, 770], [690, 920], [790, 1090], [870, 1250]];
R('lane-far', poly([[494, 612], [522, 612], [532, 632], [490, 632]]), 'path');
R('lane', poly([...sample(laneL, 8), ...sample(laneR, 8).reverse()]), 'path');
R('lane-shadow-1', soft([[440, 800], [520, 790], [620, 798], [600, 822], [480, 826]]), 'pathShade');
R('lane-shadow-2', soft([[330, 960], [470, 944], [640, 950], [720, 976], [560, 996], [380, 994]]), 'pathShade');
R('lane-shadow-3', soft([[200, 1140], [380, 1110], [560, 1120], [760, 1140], [780, 1180], [520, 1190], [230, 1186]]), 'pathShade');
R('verge-left', band([[480, 700], [420, 800], [320, 950], [200, 1110], [130, 1250]], 10, 34), 'grassDark');
R('verge-right', band([[545, 700], [610, 800], [710, 950], [810, 1110], [870, 1250]], 10, 34), 'grassDark');

// ---------------------------------------------------------------- little red bridge over the stream
const deck: Pt[] = [[410, 672], [460, 646], [512, 636], [564, 646], [614, 672]];
const rail: Pt[] = deck.map(([x, y]) => [x, y - 44]);
for (let i = 0; i < 3; i++) {
  const t = 0.3 + i * 0.2;
  const s = sample(deck, 8), r = sample(rail, 8);
  const k = Math.round(t * (s.length - 1));
  R(`bridge-post-${i + 1}`, poly([[s[k][0] - 8, r[k][1]], [s[k][0] + 8, r[k][1]], [s[k][0] + 8, s[k][1]], [s[k][0] - 8, s[k][1]]]), 'bridgeDark');
}
R('bridge-rail', band(rail, 13, 13), 'bridge');
R('bridge-arch', poly([...sample(deck, 8).map(([x, y]) => [x, y - 4] as Pt), [606, 690], [580, 676], [540, 666], [484, 666], [444, 676], [418, 690]]), 'bridge');
R('bridge-deck', band(deck, 16, 16), 'bridgeDark');

// ---------------------------------------------------------------- cherry trees
type Cluster = [number, number, number, boolean?];
/** One blossom cluster: a rose shadow base, a pink body and (optionally) a pale highlight. */
function cluster(id: string, [x, y, r, hi]: Cluster, seed: number) {
  if (r < 60) { R(`${id}`, soft(crown(x, y, r, r * 0.8, 9, seed, 0.9)), 'pink'); return; }
  R(`${id}`, soft(crown(x, y, r, r * 0.8, 15, seed, 0.92), 6), 'deep');
  R(`${id}-pink`, soft(crown(x - r * 0.1, y - r * 0.12, r * 0.84, r * 0.64, 13, seed + 17, 0.92), 6), 'pink');
  if (hi) R(`${id}-light`, soft(crown(x - r * 0.3, y - r * 0.28, r * 0.42, r * 0.3, 7, seed + 31, 0.88)), 'pale');
}
const mirror = (pts: Pt[], m: boolean): Pt[] => (m ? pts.map(([x, y]) => [W - x, y] as Pt) : pts);
interface Limb { pts: Pt[]; w0: number; w1: number }
function tree(id: string, trunk: Limb, limbs: Limb[], clusters: Cluster[], m = false, light = true) {
  limbs.forEach((l, i) => R(`${id}-limb-${i + 1}`, band(mirror(l.pts, m), l.w0, l.w1), 'bark'));
  R(`${id}-trunk`, band(mirror(trunk.pts, m), trunk.w0, trunk.w1), 'bark');
  if (light) {
    const lp = trunk.pts.slice(0, -1).map(([x, y]) => [x - trunk.w0 * 0.22, y] as Pt);
    R(`${id}-trunk-light`, band(mirror(lp, m), trunk.w0 * 0.24, trunk.w1 * 0.3), 'barkLight');
  }
  clusters.forEach((cl, i) => {
    const [x, y, r, hi] = cl;
    cluster(`${id}-bloom-${i + 1}`, [m ? W - x : x, y, r, hi], i * 23 + (m ? 11 : 0));
  });
}

// distant pair beside the bridge
tree('tree-far-l', { pts: [[414, 700], [412, 660], [408, 620]], w0: 14, w1: 9 }, [], [[410, 596, 52]], false, false);
tree('tree-far-r', { pts: [[414, 700], [412, 660], [408, 620]], w0: 14, w1: 9 }, [], [[410, 596, 52]], true, false);

// middle pair
const midTrunk: Limb = { pts: [[226, 860], [232, 780], [240, 710], [246, 660]], w0: 38, w1: 22 };
const midLimbs: Limb[] = [{ pts: [[244, 680], [212, 640], [180, 614]], w0: 16, w1: 9 }, { pts: [[246, 670], [290, 636], [318, 620]], w0: 16, w1: 9 }];
tree('tree-mid-l', midTrunk, midLimbs, [[180, 612, 70], [314, 618, 66], [246, 570, 76, true]], false, false);
tree('tree-mid-r', midTrunk, midLimbs, [[180, 618, 68], [312, 610, 70, true], [246, 566, 74]], true, false);

// bench under the right-hand trees
R('bench-shadow', ellipse(790, 1010, 110, 16), 'grassDark');
R('bench-back-1', poly([[702, 862], [858, 848], [858, 874], [702, 888]]), 'bench');
R('bench-back-2', poly([[702, 896], [858, 882], [858, 908], [702, 922]]), 'bench');
R('bench-seat', poly([[688, 934], [860, 916], [880, 940], [704, 960]]), 'bench');
R('bench-leg-front-l', poly([[704, 956], [718, 954], [718, 1016], [704, 1016]]), 'iron');
R('bench-leg-front-r', poly([[860, 938], [874, 936], [874, 1004], [860, 1004]]), 'iron');
R('bench-arm-l', band([[692, 930], [696, 900], [716, 894], [724, 912]], 9, 9), 'iron');

// nearest pair framing the view
const nearTrunk: Limb = { pts: [[66, 1250], [84, 1080], [116, 880], [148, 700]], w0: 76, w1: 44 };
const nearLimbs: Limb[] = [
  { pts: [[146, 720], [110, 560], [70, 420], [40, 300]], w0: 38, w1: 18 },
  { pts: [[146, 710], [210, 560], [290, 420], [360, 300]], w0: 36, w1: 16 },
];
tree('tree-near-l', nearTrunk, nearLimbs, [
  [70, 60, 140], [300, 40, 130, true], [30, 280, 140, true], [220, 200, 140], [380, 236, 100, true], [150, 410, 116],
]);
tree('tree-near-r', nearTrunk, nearLimbs, [
  [80, 50, 140, true], [310, 50, 124], [40, 290, 140], [230, 210, 136, true], [376, 250, 96], [140, 420, 112, true],
], true);

// ---------------------------------------------------------------- fallen petals and blossoms on the ground
const fallen: [number, number, number, number][] = [[260, 1180, 70, 18], [560, 1060, 60, 14], [640, 1200, 80, 18], [820, 1210, 60, 16], [210, 900, 54, 12], [110, 760, 44, 10], [900, 780, 40, 10]];
fallen.forEach(([x, y, rx, ry], i) => R(`fallen-${i + 1}`, ellipse(x, y, rx, ry), i % 2 ? 'pale' : 'pink'));

// ---------------------------------------------------------------- drifting petals
const drift: [number, number, number][] = [
  [470, 330, 20], [560, 460, -30], [440, 520, 60], [620, 380, 140], [420, 760, 30],
  [600, 860, 110], [380, 1000, 70], [660, 1080, 160], [460, 1140, 40],
];
drift.forEach(([x, y, rot], i) => R(`petal-${i + 1}`, petal(x, y, 34, 14, rot), i % 3 === 0 ? 'deep' : i % 3 === 1 ? 'pink' : 'pale'));

// ---------------------------------------------------------------- line work
D(curve([[710, 878], [780, 872], [850, 866]]) + curve([[710, 912], [780, 906], [850, 900]]), '#8a5a34', 1.4, 0.7);
D(curve([[130, 1000], [140, 900], [150, 820]]) + curve([[918, 990], [910, 900], [906, 820]]), '#3f2b23', 1.6, 0.6);
D(curve([[250, 1000], [258, 980], [266, 1000]]) + curve([[290, 760], [296, 744], [302, 760]]) + curve([[880, 1110], [888, 1090], [896, 1110]]) + curve([[40, 1250], [60, 1230], [80, 1250]]) + curve([[900, 1250], [920, 1226], [944, 1250]]) + curve([[600, 760], [606, 744], [612, 760]]) + curve([[380, 770], [386, 752], [392, 770]]), '#4c8448', 2);

const activity: PaintActivity = {
  id: 'seasons-paint-2', version: 1, mode: 'paint', title: 'Cherry Blossom Lane',
  blurb: 'A quiet lane runs beneath cherry trees in full bloom, past a garden bench and over a little red bridge while petals drift down.',
  added: '2026-11-25', collectionId: 'seasons', categories: ["Seasons"], difficulty: 'Detailed',
  season: { from: '03-01', to: '05-31', label: 'spring' },
  width: W, height: H,
  palette: [
    { id: 'sky', number: 1, name: 'Spring sky', hex: '#cfe6f2' },
    { id: 'mist', number: 2, name: 'Cloud', hex: '#f6f9f6' },
    { id: 'hill', number: 3, name: 'Far hills', hex: '#bcd8a6' },
    { id: 'grass', number: 4, name: 'Meadow', hex: '#95c57c' },
    { id: 'grassDark', number: 5, name: 'Verge green', hex: '#5f9a5a' },
    { id: 'water', number: 6, name: 'Stream', hex: '#8cc3dc' },
    { id: 'path', number: 7, name: 'Sandy path', hex: '#eedcb9' },
    { id: 'pathShade', number: 8, name: 'Dappled shade', hex: '#d3b88e' },
    { id: 'bridge', number: 9, name: 'Bridge red', hex: '#cc5a42' },
    { id: 'bridgeDark', number: 10, name: 'Deep red', hex: '#8c392c' },
    { id: 'bark', number: 11, name: 'Bark', hex: '#5e4237' },
    { id: 'barkLight', number: 12, name: 'Sunlit bark', hex: '#8c6852' },
    { id: 'pale', number: 13, name: 'Blossom white', hex: '#fde8ee' },
    { id: 'pink', number: 14, name: 'Cherry pink', hex: '#f5b4c7' },
    { id: 'deep', number: 15, name: 'Rose shadow', hex: '#df80a0' },
    { id: 'bench', number: 16, name: 'Bench wood', hex: '#b97d4b' },
    { id: 'iron', number: 17, name: 'Iron', hex: '#3f3c45' },
  ],
  regions: c.regions,
  detail: c.detail,
};
export default activity;
