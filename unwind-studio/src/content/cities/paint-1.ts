import { rect, ellipse, circle, poly, line, curve, blob, waveBand, stroke } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { PaintActivity, PaletteColor } from '../types';
import { collector, steps, reflection, M, L, Q, type Pt } from './props-paint';

const W = 1000, H = 1250;

const palette: PaletteColor[] = [
  { id: 'violet', number: 1, name: 'Evening violet', hex: '#5d5288' },
  { id: 'mauve', number: 2, name: 'Dusky mauve', hex: '#9a6f9f' },
  { id: 'rose', number: 3, name: 'Sunset rose', hex: '#d97f8e' },
  { id: 'coral', number: 4, name: 'Warm coral', hex: '#ef9a74' },
  { id: 'peach', number: 5, name: 'Apricot glow', hex: '#f7c287' },
  { id: 'gold', number: 6, name: 'Horizon gold', hex: '#fbdf9c' },
  { id: 'cream', number: 7, name: 'Setting sun', hex: '#fff4d6' },
  { id: 'lilac', number: 8, name: 'Hazy towers', hex: '#bb8fa9' },
  { id: 'plum', number: 9, name: 'Plum towers', hex: '#734a72' },
  { id: 'indigo', number: 10, name: 'Night silhouette', hex: '#30294b' },
  { id: 'amber', number: 11, name: 'Lit window', hex: '#f7b853' },
  { id: 'teal', number: 12, name: 'Bridge teal', hex: '#2f5b63' },
  { id: 'tealLight', number: 13, name: 'Bridge rail', hex: '#5d8c8c' },
  { id: 'water', number: 14, name: 'River dusk', hex: '#7b6297' },
];

const { regions, R } = collector();
const detail: Shape[] = [];
const BASE = 800;

// ---------- sky bands ----------
R('sky-top', rect(0, 0, W, BASE + 10), 'violet');
R('sky-mauve', waveBand(0, W, 170, 10, 520, BASE + 10, 0.4), 'mauve');
R('sky-rose', waveBand(0, W, 290, 9, 460, BASE + 10, 1.8), 'rose');
R('sky-coral', waveBand(0, W, 400, 8, 560, BASE + 10, 3.1), 'coral');
R('sky-peach', waveBand(0, W, 495, 7, 480, BASE + 10, 0.9), 'peach');
R('sky-gold', waveBand(0, W, 590, 6, 600, BASE + 10, 2.2), 'gold');

// long thin clouds
R('cloud-1', blob([[90, 110], [160, 88], [290, 84], [380, 98], [330, 122], [170, 126]], 0.9), 'mauve');
R('cloud-2', blob([[600, 70], [700, 50], [860, 56], [930, 76], [840, 96], [660, 96]], 0.9), 'mauve');
R('cloud-3', blob([[520, 230], [610, 208], [770, 212], [840, 232], [740, 254], [580, 252]], 0.9), 'rose');
R('cloud-4', blob([[40, 340], [120, 318], [260, 322], [320, 344], [220, 366], [80, 362]], 0.9), 'coral');
R('cloud-5', blob([[680, 440], [770, 420], [900, 426], [960, 446], [880, 466], [720, 464]], 0.9), 'peach');

// sun with a soft halo
R('sun-halo', circle(490, 640, 158), 'gold');
R('sun', circle(490, 640, 112), 'cream');

// ---------- far, hazy skyline ----------
R('far-skyline', steps([
  [0, 650], [40, 610], [90, 672], [130, 590], [175, 640], [215, 690], [260, 620], [300, 680], [345, 700],
  [395, 712], [450, 690], [520, 706], [580, 668], [625, 600], [668, 650], [715, 590], [760, 670], [805, 630],
  [850, 690], [900, 610], [950, 660], [1000, 660],
], BASE), 'lilac');

// ---------- middle towers ----------
const mid: [string, Pt[]][] = [
  ['mid-1', [[0, 540], [60, 540]]],
  ['mid-2', [[170, 500], [186, 470], [226, 470], [240, 500]]],
  ['mid-3', [[240, 590], [300, 590]]],
  ['mid-4', [[384, 568], [430, 568]]],
  ['mid-5', [[430, 662], [466, 662]]],
  ['mid-6', [[520, 690], [576, 690]]],
  ['mid-7', [[580, 520], [596, 500], [626, 500], [640, 520]]],
  ['mid-8', [[710, 548], [780, 548]]],
  ['mid-9', [[790, 610], [850, 610]]],
  ['mid-10', [[920, 520], [940, 500], [1000, 500]]],
];
for (const [id, pts] of mid) R(id, steps(pts, BASE), 'plum');
R('mid-7-spire', poly([[600, 500], [622, 500], [611, 440]]), 'plum');

// ---------- near towers ----------
R('tower-a', steps([[60, 400], [80, 360], [100, 330], [130, 360], [150, 400], [170, 400]], BASE), 'indigo');
R('tower-a-spire', poly([[107, 332], [123, 332], [115, 250]]), 'indigo');
R('tower-b', poly([[300, BASE], [300, 430], [384, 392], [384, BASE]]), 'indigo');
R('tower-c', M(622, BASE) + L(622, 470) + Q(622, 410, 666, 410) + Q(710, 410, 710, 470) + L(710, BASE) + 'Z', 'indigo');
R('tower-c-cap', poly([[656, 412], [676, 412], [666, 372]]), 'indigo');
R('needle-shaft', poly([[866, BASE], [871, 356], [889, 356], [894, BASE]]), 'indigo');
R('needle-pod', ellipse(880, 336, 52, 24), 'indigo');
R('needle-pod-glow', ellipse(880, 340, 40, 9), 'amber');
R('needle-top', poly([[868, 316], [892, 316], [880, 270]]), 'indigo');
R('needle-base', poly([[846, BASE], [866, 690], [894, 690], [914, BASE]]), 'indigo');

// lit windows
const win = (id: string, x: number, y: number, w = 14, h = 20) => R(id, rect(x, y, w, h, 2), 'amber');
[[74, 430], [118, 430], [74, 500], [140, 520], [96, 590], [140, 620], [74, 680]].forEach(([x, y], i) => win(`tower-a-win-${i + 1}`, x, y));
[[314, 470], [350, 456], [314, 560], [350, 600], [330, 680]].forEach(([x, y], i) => win(`tower-b-win-${i + 1}`, x, y));
[[638, 470], [680, 470], [658, 540], [638, 620], [680, 650]].forEach(([x, y], i) => win(`tower-c-win-${i + 1}`, x, y));
[[190, 520], [256, 620], [736, 580], [756, 650], [946, 540], [960, 620], [20, 580]].forEach(([x, y], i) => win(`mid-win-${i + 1}`, x, y, 12, 18));

// ---------- embankment ----------
R('trees', M(0, 812) + L(0, 782) + curve([
  [0, 782], [40, 770], [90, 778], [140, 766], [200, 776], [250, 768], [310, 780], [380, 772], [450, 782], [520, 772],
  [590, 780], [650, 768], [720, 778], [790, 768], [860, 780], [930, 770], [1000, 780],
], 0.6).replace(/^M/, 'L') + L(1000, 812) + 'Z', 'teal');
R('embankment', rect(0, 800, W, 36), 'indigo');

// ---------- river ----------
R('river', rect(0, 834, W, H - 834), 'water');
// sun's reflection: stacked glints
const glints: [number, number, number, string][] = [
  [490, 862, 150, 'gold'], [490, 896, 120, 'cream'], [494, 1028, 104, 'gold'], [486, 1062, 80, 'cream'],
  [492, 1096, 96, 'peach'], [490, 1132, 62, 'gold'], [488, 1170, 84, 'peach'], [492, 1210, 44, 'gold'],
];
glints.forEach(([cx, cy, w, c], i) => R(`glint-${i + 1}`, rect(cx - w / 2, cy - 9, w, 18, 9), c, [cx, cy]));
R('tower-a-reflection', reflection(115, 838, 1000, 96), 'plum');
R('tower-b-reflection', reflection(342, 838, 960, 72), 'plum');
R('tower-c-reflection', reflection(666, 838, 970, 76), 'plum');
R('needle-reflection', reflection(880, 838, 1010, 50), 'plum');
R('streak-1', rect(40, 1100, 220, 16, 8), 'mauve', [60, 1108]);
R('streak-2', rect(700, 1150, 240, 16, 8), 'rose', [820, 1158]);
R('streak-3', rect(110, 1200, 180, 14, 7), 'coral', [200, 1207]);
R('streak-4', rect(640, 1060, 150, 14, 7), 'mauve', [715, 1067]);

// ---------- suspension bridge ----------
const DECK = 946;
function bridgeTower(id: string, cx: number) {
  R(`${id}-leg-l`, poly([[cx - 40, 1000], [cx - 34, 680], [cx - 14, 680], [cx - 18, 1000]]), 'teal');
  R(`${id}-leg-r`, poly([[cx + 18, 1000], [cx + 14, 680], [cx + 34, 680], [cx + 40, 1000]]), 'teal');
  R(`${id}-cap`, rect(cx - 42, 664, 84, 22, 4), 'tealLight');
  R(`${id}-beam-1`, rect(cx - 16, 722, 32, 18), 'tealLight');
  R(`${id}-beam-2`, rect(cx - 17, 830, 34, 18), 'tealLight');
  R(`${id}-footing`, rect(cx - 50, 994, 100, 30, 6), 'indigo');
}
bridgeTower('bridge-west', 230);
bridgeTower('bridge-east', 770);
R('deck', rect(0, DECK, W, 30), 'teal');
R('deck-rail', rect(0, DECK - 16, W, 16), 'tealLight', [480, DECK - 8]);

// main cables and hangers
{
  const cable = (pts: Pt[]) => curve(pts, 0.9);
  const sag = (x0: number, y0: number, x1: number, y1: number, low: number, k = 14): Pt[] => {
    const pts: Pt[] = [];
    for (let i = 0; i <= k; i++) {
      const t = i / k, x = x0 + (x1 - x0) * t;
      pts.push([x, y0 + (y1 - y0) * t + (low - (y0 + y1) / 2) * 4 * t * (1 - t)]);
    }
    return pts;
  };
  const spans: Pt[][] = [sag(-20, 900, 230, 672, 820), sag(230, 672, 770, 672, 900), sag(770, 672, 1020, 900, 820)];
  let hangers = '';
  for (const s of spans) {
    for (let i = 1; i < s.length - 1; i++) {
      const [x, y] = s[i];
      if (x > 0 && x < W) hangers += line([[x, y], [x, DECK - 16]]);
    }
  }
  detail.push(stroke(hangers, '#5d8c8c', 1.6));
  detail.push(stroke(spans.map(cable).join(''), '#2f5b63', 4));
}
// lamp posts on the deck
{
  let d = '';
  for (let x = 60; x < W; x += 120) if (Math.abs(x - 230) > 60 && Math.abs(x - 770) > 60) d += line([[x, DECK - 16], [x, DECK - 44]]);
  detail.push(stroke(d, '#2f5b63', 2.5));
  for (let x = 60; x < W; x += 120) if (Math.abs(x - 230) > 60 && Math.abs(x - 770) > 60) detail.push({ d: circle(x, DECK - 47, 4), fill: '#f7b853' });
  detail.push(stroke(line([[0, DECK - 8], [W, DECK - 8]]), '#2f5b63', 1.4));
}

// ---------- little river boat ----------
R('boat-hull', M(80, 1130) + L(330, 1130) + Q(320, 1160, 290, 1168) + L(120, 1168) + Q(96, 1160, 80, 1130) + 'Z', 'indigo');
R('boat-cabin', rect(130, 1090, 140, 42, 8), 'teal');
R('boat-window', rect(146, 1100, 108, 20, 6), 'amber');
R('boat-wake', blob([[300, 1170], [380, 1160], [470, 1166], [400, 1180], [320, 1182]], 0.9), 'peach');

// ---------- line work ----------
// window frames on the dome tower and the pod
detail.push(stroke(line([[838, 340], [922, 340]]), '#30294b', 1.5));
// birds
{
  const bird = (x: number, y: number, s: number) => curve([[x - s, y - s * 0.4], [x - s * 0.4, y - s * 0.5], [x, y]], 0.8) + curve([[x, y], [x + s * 0.4, y - s * 0.5], [x + s, y - s * 0.4]], 0.8);
  detail.push(stroke(bird(420, 330, 14) + bird(462, 300, 10) + bird(388, 290, 9) + bird(770, 360, 11), '#5d5288', 2.2));
}
// gentle ripples
{
  let d = '';
  const rip: [number, number, number][] = [[60, 880, 90], [600, 900, 110], [830, 1000, 80], [200, 1040, 100], [560, 1180, 90], [880, 1110, 70], [380, 1236, 120], [740, 1236, 90]];
  for (const [x, y, w] of rip) d += curve([[x, y], [x + w * 0.5, y - 3], [x + w, y]], 0.8);
  detail.push(stroke(d, '#c7a6c4', 2));
}
// antenna on the spire
detail.push(stroke(line([[115, 250], [115, 222]]) + line([[880, 270], [880, 236]]), '#30294b', 2));

const a: PaintActivity = {
  id: 'cities-paint-1', version: 1, mode: 'paint', title: 'Skyline at Sunset',
  blurb: 'Towers of every shape glow against a peach and violet sunset while a graceful bridge strides across the quiet river.',
  collectionId: 'cities', categories: ["Cities"], difficulty: 'Moderate',
  width: W, height: H, palette, regions, detail,
};
export default a;
