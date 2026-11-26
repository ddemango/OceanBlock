import { rect, ellipse, circle, poly, line, curve, blob, xf, stroke } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { PaintActivity, PaletteColor } from '../types';
import { collector, slopeQuad, M, L, Q, type Pt } from './props-paint';

const W = 1000, H = 1250;

const palette: PaletteColor[] = [
  { id: 'sky', number: 1, name: 'Morning sky', hex: '#bfe1ef' },
  { id: 'white', number: 2, name: 'Painted trim', hex: '#fdf8ec' },
  { id: 'bay', number: 3, name: 'Bay blue', hex: '#5e9ec2' },
  { id: 'hills', number: 4, name: 'Distant hills', hex: '#93b6a6' },
  { id: 'green', number: 5, name: 'Park green', hex: '#5f9a62' },
  { id: 'butter', number: 6, name: 'Butter yellow', hex: '#f3d37c' },
  { id: 'mint', number: 7, name: 'Mint green', hex: '#a3d5bf' },
  { id: 'salmon', number: 8, name: 'Salmon pink', hex: '#f0a387' },
  { id: 'lavender', number: 9, name: 'Lavender', hex: '#b9a8d8' },
  { id: 'teal', number: 10, name: 'Door teal', hex: '#3f8a8c' },
  { id: 'glass', number: 11, name: 'Window glass', hex: '#40597a' },
  { id: 'red', number: 12, name: 'Cable car red', hex: '#b9443a' },
  { id: 'cream', number: 13, name: 'Cable car cream', hex: '#f0d9a6' },
  { id: 'road', number: 14, name: 'Asphalt', hex: '#8e8b94' },
  { id: 'pavement', number: 15, name: 'Pavement', hex: '#d2c9ba' },
  { id: 'wood', number: 16, name: 'Varnished wood', hex: '#8b5b3c' },
  { id: 'iron', number: 17, name: 'Iron', hex: '#3b3742' },
  { id: 'gold', number: 18, name: 'Brass and sun', hex: '#eab14b' },
];

const { regions, R } = collector();
const detail: Shape[] = [];

// The street climbs to the right. Building line, kerbs and the rail all share one slope.
const SL = -0.4;
const B = (x: number) => 930 + SL * x; // building line (back of the far pavement)
const K1 = (x: number) => 960 + SL * x; // far kerb
const K2 = (x: number) => 1200 + SL * x; // near kerb
const RAIL = (x: number) => 1086 + SL * x;
const ANG = (Math.atan(SL) * 180) / Math.PI;

// The cable car sits on the rail at CAR_X; house trim lines must not cross it.
const CAR_X = 560, CAR_Y = RAIL(CAR_X);
const inCar = (x: number, y: number) => {
  const a = (-ANG * Math.PI) / 180, dx = x - CAR_X, dy = y - CAR_Y;
  const lx = dx * Math.cos(a) - dy * Math.sin(a), ly = dx * Math.sin(a) + dy * Math.cos(a);
  return lx > -218 && lx < 218 && ly > -298 && ly < 34;
};
/** A trim segment, dropped where it would cross the cable car. */
const seg = (a: Pt, b: Pt) => (inCar(...a) || inCar(...b) || inCar((a[0] + b[0]) / 2, (a[1] + b[1]) / 2) ? '' : line([a, b]));

// ---------- sky, bay and the far shore ----------
R('sky', rect(0, 0, W, 460), 'sky');
R('sun', circle(150, 140, 58), 'gold');
R('cloud-1', blob([[260, 110], [300, 78], [350, 84], [380, 60], [440, 70], [470, 104], [430, 124], [290, 126]], 0.9), 'white');
R('cloud-2', blob([[560, 60], [600, 36], [660, 42], [700, 30], [760, 46], [770, 74], [600, 80]], 0.9), 'white');
R('cloud-3', blob([[40, 270], [80, 250], [140, 252], [190, 270], [150, 288], [60, 288]], 0.9), 'white');
R('bay', rect(0, 440, W, 260), 'bay');
R('far-hills-1', M(0, 452) + curve([[0, 422], [50, 404], [120, 392], [210, 404], [260, 430], [300, 452]], 0.8).replace(/^M/, 'L') + 'Z', 'hills');
R('far-hills-2', blob([[240, 452], [330, 418], [420, 406], [520, 424], [600, 452]], 0.8), 'hills');
// the great orange bridge across the strait
R('gate-tower-north', poly([[44, 448], [48, 318], [62, 318], [66, 448]]), 'red', [55, 400]);
R('gate-tower-south', poly([[166, 448], [170, 318], [184, 318], [188, 448]]), 'red', [177, 400]);
R('gate-deck', rect(0, 428, 228, 12, 2), 'red', [116, 434]);
{
  const sagPts = (x0: number, x1: number, y0: number, y1: number, low: number) => {
    const pts: Pt[] = [];
    for (let i = 0; i <= 12; i++) {
      const t = i / 12;
      pts.push([x0 + (x1 - x0) * t, y0 + (y1 - y0) * t + (low - (y0 + y1) / 2) * 4 * t * (1 - t)]);
    }
    return pts;
  };
  const main = sagPts(62, 170, 322, 322, 420);
  let h = '';
  for (const [x, y] of main.slice(1, -1)) h += line([[x, y], [x, 428]]);
  detail.push(stroke(h, '#c4584b', 1));
  detail.push(stroke(curve(main, 0.9) + curve(sagPts(-30, 48, 420, 322, 395), 0.9) + curve(sagPts(184, 236, 322, 420, 392), 0.9), '#9c3a31', 2.2));
  detail.push(stroke(line([[46, 350], [64, 350]]) + line([[168, 350], [186, 350]]) + line([[46, 384], [64, 384]]) + line([[168, 384], [186, 384]]), '#8a2f28', 1.6));
}
R('island', blob([[160, 500], [180, 482], [220, 478], [246, 500]], 0.8), 'hills');
// sailboat
R('boat-hull', M(46, 548) + L(150, 548) + Q(140, 566, 120, 566) + L(70, 566) + Q(54, 562, 46, 548) + 'Z', 'red');
R('boat-sail-main', poly([[100, 542], [100, 448], [148, 542]]), 'white');
R('boat-sail-jib', poly([[94, 542], [94, 466], [56, 542]]), 'gold');

// ---------- the hillside below, to the left ----------
R('lower-hill', M(0, B(0)) + L(0, 610) + curve([[0, 610], [60, 596], [140, 604], [210, 590], [260, 600]], 0.8).replace(/^M[^C]*/, '') + L(260, B(260)) + 'Z', 'green');
function cottage(id: string, x0: number, w: number, h: number, body: string, roof: string) {
  const base = B(x0 + w);
  R(`${id}-body`, poly([[x0, base - h], [x0 + w, base - h], [x0 + w, B(x0 + w)], [x0, B(x0)]]), body);
  R(`${id}-roof`, poly([[x0 - 10, base - h + 2], [x0 + w / 2, base - h - 46], [x0 + w + 10, base - h + 2]]), roof);
  R(`${id}-window`, rect(x0 + w / 2 - 16, base - h + 24, 32, 40, 3), 'glass');
}
R('tree-1', blob([[96, 720], [104, 662], [130, 640], [158, 660], [160, 720], [128, 740]], 1), 'teal');
R('tree-2', blob([[196, 690], [214, 640], [250, 628], [262, 680], [250, 740], [210, 744]], 1), 'hills');
cottage('cottage-1', 20, 100, 150, 'butter', 'salmon');
cottage('cottage-2', 134, 86, 190, 'lavender', 'teal');

// ---------- the row houses ----------
interface House { body: string; bay: string; door: string }
const houses: House[] = [
  { body: 'mint', bay: 'butter', door: 'teal' },
  { body: 'butter', bay: 'salmon', door: 'teal' },
  { body: 'lavender', bay: 'mint', door: 'red' },
  { body: 'salmon', bay: 'lavender', door: 'teal' },
  { body: 'mint', bay: 'butter', door: 'red' },
];
const HW = 154;
houses.forEach((h, i) => {
  const id = `house-${i + 1}`;
  const x0 = 230 + HW * i, x1 = x0 + HW, top = B(x0) - 360;
  R(`${id}-body`, poly([[x0, top], [x1, top], [x1, B(x1)], [x0, B(x0)]]), h.body);
  R(`${id}-cornice`, rect(x0 - 4, top - 24, Math.min(HW + 8, W - x0 + 4), 30, 3), 'white');
  // two-storey bay window
  const by0 = top + 46, by1 = top + 266;
  R(`${id}-bay-left`, poly([[x0 + 10, by0 + 8], [x0 + 28, by0], [x0 + 28, by1], [x0 + 10, by1 - 8]]), 'white');
  R(`${id}-bay`, rect(x0 + 28, by0, 56, by1 - by0), h.bay);
  R(`${id}-bay-right`, poly([[x0 + 84, by0], [x0 + 102, by0 + 8], [x0 + 102, by1 - 8], [x0 + 84, by1]]), 'white');
  R(`${id}-bay-cap`, rect(x0 + 4, by0 - 18, 104, 20, 4), 'white');
  R(`${id}-glass-up`, rect(x0 + 36, by0 + 22, 40, 74, 3), 'glass');
  R(`${id}-glass-low`, rect(x0 + 36, by0 + 122, 40, 74, 3), 'glass');
  // side window, door and its hood
  R(`${id}-window`, rect(x0 + 112, top + 70, 32, 74, 3), 'glass');
  const doorBot = B(x0 + 128) - 6;
  const doorShows = !inCar(x0 + 128, top + 200);
  if (doorShows) {
    R(`${id}-door-hood`, rect(x0 + 106, top + 168, 44, 16, 3), 'white');
    R(`${id}-door`, rect(x0 + 112, top + 184, 32, doorBot - top - 184, 2), h.door);
  }
  // trim lines: window muntins, door panel, cornice brackets, clapboard under the bay
  detail.push(stroke(
    seg([x0 + 36, by0 + 59], [x0 + 76, by0 + 59]) + seg([x0 + 36, by0 + 159], [x0 + 76, by0 + 159]) +
    seg([x0 + 112, top + 107], [x0 + 144, top + 107]), '#fdf8ec', 3));
  let trim = '';
  for (const bx of [10, 50, 100, 144]) trim += seg([x0 + bx, top - 4], [x0 + bx, top + 8]);
  if (doorShows) trim += rect(x0 + 118, top + 192, 20, 30, 2);
  detail.push(stroke(trim, '#6f6a7a', 1.4));
  let siding = '';
  for (let y = by1 + 14; y < B(x0 + 104) - 6; y += 13) siding += seg([x0 + 6, y], [x0 + 104, y]);
  for (let y = top + 18; y < by0 - 24; y += 13) siding += seg([x0 + 6, y], [x0 + 102, y]);
  if (siding) detail.push(stroke(siding, '#6f6a7a', 0.9, { opacity: 0.45 }));
  if (doorShows) detail.push({ d: circle(x0 + 139, top + 250, 2.5), fill: '#eab14b' });
});
{
  let d = '';
  houses.forEach((_, i) => {
    const x = 230 + HW * i;
    for (let y = B(x) - 360; y < B(x) - 4; y += 8) d += seg([x, y], [x, Math.min(y + 8, B(x))]);
  });
  detail.push(stroke(d, '#6f6a7a', 1.6));
}

// ---------- street ----------
R('far-pavement', slopeQuad(930, SL, 0, W, 0, 30), 'pavement', [300, B(300) + 15]);
R('road', poly([[0, K1(0)], [W, K1(W)], [W, K2(W)], [0, K2(0)]]), 'road');
R('near-pavement', poly([[0, K2(0) + 14], [W, K2(W) + 14], [W, H], [0, H]]), 'pavement');
R('near-kerb', slopeQuad(1200, SL, 0, W, 0, 16), 'white', [140, K2(140) + 8]);

// rails, cable slot and pavement joints (kept clear of the car, posts and street furniture)
{
  const a = (ANG * Math.PI) / 180;
  const wheelX = (lx: number) => CAR_X + Math.cos(a) * lx + Math.sin(a) * 8;
  const posts: [number, number][] = [[106, 134], [886, 914]];
  const wheels: [number, number][] = [[wheelX(-124) - 28, wheelX(-124) + 28], [wheelX(124) - 28, wheelX(124) + 28]];
  const rl = (off: number) => {
    let d = '', x = 0;
    const gaps = [...posts, ...(off === 0 ? [[wheels[0][0], wheels[1][1]] as [number, number]] : off < 20 ? wheels : [])].sort((p, q) => p[0] - q[0]);
    for (const [g0, g1] of [...gaps, [W, W] as [number, number]]) {
      if (g0 > x) d += line([[x, RAIL(x) + off], [g0, RAIL(g0) + off]]);
      x = g1;
    }
    return d;
  };
  detail.push(stroke(rl(0) + rl(26), '#5b5862', 3));
  detail.push(stroke(rl(13), '#5b5862', 1.5, { opacity: 0.7 }));
  const boxes = [[100, 930, 170, 1250], [310, 1086, 410, 1222], [570, 1050, 890, 1250], [876, 548, 924, 1250]];
  const clear = (a: Pt, b: Pt) => {
    for (let t = 0; t <= 1; t += 0.05) {
      const x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t;
      if (boxes.some(([x0, y0, x1, y1]) => x > x0 && x < x1 && y > y0 && y < y1)) return false;
    }
    return true;
  };
  let joints = '';
  for (let x = 40; x < W + 200; x += 90) {
    const a: Pt = [x, K2(x) + 16], b: Pt = [x - 50, H];
    if (a[1] < H && clear(a, b)) joints += line([a, b]);
  }
  for (let x = 60; x < W; x += 110) joints += line([[x, B(x) + 2], [x + 6, K1(x + 6) - 2]]);
  detail.push(stroke(joints, '#a99f90', 1.4));
}

// ---------- the cable car ----------
{
  const cx = CAR_X, cy = CAR_Y;
  const T = (d: string) => xf(d, { rot: ANG, x: cx, y: cy });
  const P = (id: string, d: string, c: string, lab?: Pt) => R(`car-${id}`, T(d), c, lab ? xf(`M${lab[0]} ${lab[1]}`, { rot: ANG, x: cx, y: cy }).slice(1).split(' ').map(Number) as Pt : undefined);
  P('wheel-back', circle(-124, -8, 22), 'iron');
  P('wheel-front', circle(124, -8, 22), 'iron');
  P('chassis', rect(-176, -40, 352, 22, 6), 'wood');
  P('lower-panel', rect(-196, -112, 392, 74, 6), 'red');
  P('belt', rect(-202, -132, 404, 22, 4), 'cream', [0, -121]);
  P('upper', rect(-196, -236, 392, 106, 4), 'cream');
  P('roof', rect(-212, -268, 424, 34, 14), 'red');
  P('clerestory', rect(-150, -292, 300, 26, 10), 'cream');
  for (let k = 0; k < 6; k++) P(`window-${k + 1}`, rect(-180 + k * 61, -222, 48, 80, 4), 'glass');
  P('head-1', circle(-95, -168, 15), 'wood');
  P('head-2', circle(-34, -172, 15), 'salmon');
  P('head-3', circle(88, -168, 15), 'gold');
  P('lamp', circle(186, -76, 12), 'gold');
  P('step', rect(-150, -18, 300, 16, 5), 'iron', [0, -10]);
  detail.push(...[
    stroke(T(line([[-150, -96], [150, -96]]) + line([[-190, -60], [190, -60]])), '#fdf8ec', 2.5),
    stroke(T(rect(-160, -100, 70, 30, 4) + rect(-35, -100, 70, 30, 4) + rect(90, -100, 70, 30, 4)), '#7e2c25', 1.6),
    stroke(T(circle(-124, -8, 8) + circle(124, -8, 8)), '#8e8b94', 2),
    stroke(T(line([[-196, -238], [196, -238]])), '#7e2c25', 2),
  ]);
}

// ---------- foreground: street lamp and a flower planter ----------
R('lamp-post', poly([[884, 1250], [892, 1236], [894, 640], [906, 640], [908, 1236], [916, 1250]]), 'iron', [900, 900]);
R('lamp-glass', M(878, 640) + L(922, 640) + L(930, 590) + Q(900, 566, 870, 590) + 'Z', 'gold');
R('lamp-cap', poly([[862, 594], [938, 594], [900, 552]]), 'iron');
R('planter-flowers', blob([[620, 1120], [640, 1080], [690, 1064], [740, 1076], [770, 1060], [820, 1078], [840, 1120]], 1), 'salmon');
R('planter-leaves', blob([[612, 1146], [620, 1114], [660, 1104], [700, 1118], [744, 1102], [800, 1110], [846, 1120], [850, 1146]], 0.9), 'green');
R('planter-box', poly([[600, 1144], [862, 1144], [848, 1236], [614, 1236]]), 'wood');
detail.push(stroke(line([[606, 1180], [856, 1180]]), '#6c4329', 2));
// a hydrant and a cable car stop sign
R('hydrant-base', rect(326, 1198, 68, 18, 4), 'iron');
R('hydrant-body', rect(338, 1128, 44, 72, 8), 'gold');
R('hydrant-cap', M(332, 1132) + L(388, 1132) + Q(388, 1096, 360, 1094) + Q(332, 1096, 332, 1132) + 'Z', 'red');
R('hydrant-nozzle', rect(316, 1150, 88, 22, 8), 'red');
R('stop-pole', rect(114, 1000, 12, 236, 3), 'iron', [120, 1150]);
R('stop-sign', rect(78, 936, 84, 64, 8), 'white');
R('stop-sign-band', rect(86, 944, 68, 20, 4), 'red', [120, 954]);
detail.push(stroke(line([[92, 986], [112, 986]]) + line([[128, 986], [148, 986]]), '#3b3742', 2));

const a: PaintActivity = {
  id: 'cities-paint-2', version: 1, mode: 'paint', title: 'Cable Car Hill',
  blurb: 'A cheerful cable car clangs up a steep San Francisco street of painted row houses, with the Golden Gate Bridge glowing across the bay.',
  added: '2026-11-25', collectionId: 'cities', categories: ["Cities"], difficulty: 'Detailed',
  width: W, height: H, palette, regions, detail,
};
export default a;
