import { rect, ellipse, circle, poly, line, curve, blob, sector, stroke, rng } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { PaintActivity, PaletteColor } from '../types';
import { collector, vessel, crescent, rotRect, rotPt, subQuad, lerp, M, L, Q, C, type Pt } from './props-paint';

const W = 1000, H = 1250;

const palette: PaletteColor[] = [
  { id: 'mint', number: 1, name: 'Diner mint', hex: '#bfe5dc' },
  { id: 'teal', number: 2, name: 'Deep teal', hex: '#35858a' },
  { id: 'red', number: 3, name: 'Cherry red', hex: '#d8413f' },
  { id: 'cherryD', number: 4, name: 'Dark cherry', hex: '#9f1f2d' },
  { id: 'cream', number: 5, name: 'Whipped cream', hex: '#fffaf0' },
  { id: 'pink', number: 6, name: 'Strawberry', hex: '#f6a5b8' },
  { id: 'pinkD', number: 7, name: 'Strawberry swirl', hex: '#e06c8c' },
  { id: 'choc', number: 8, name: 'Fudge sauce', hex: '#6b3f2a' },
  { id: 'chocL', number: 9, name: 'Chocolate scoop', hex: '#a26b47' },
  { id: 'vanilla', number: 10, name: 'Vanilla', hex: '#fbe6a8' },
  { id: 'wafer', number: 11, name: 'Wafer', hex: '#e8b566' },
  { id: 'waferD', number: 12, name: 'Toasted wafer', hex: '#c08238' },
  { id: 'glass', number: 13, name: 'Glass', hex: '#cfe8ee' },
  { id: 'steel', number: 14, name: 'Chrome', hex: '#aebbc5' },
  { id: 'peach', number: 15, name: 'Peach counter', hex: '#f9cfa8' },
  { id: 'peachD', number: 16, name: 'Counter shadow', hex: '#e2a67a' },
];

const { regions, R } = collector();
const detail: Shape[] = [];

// ---------- diner wall ----------
R('wall', rect(0, 0, W, 905), 'mint');
R('wall-stripe', rect(0, 300, W, 36), 'red', [60, 318]);
R('tile-band', rect(0, 790, W, 112), 'cream');
[0, 200, 600, 800].forEach((x, i) => R(`tile-top-${i + 1}`, rect(x, 790, 100, 56), 'teal'));
[100, 300, 700, 900].forEach((x, i) => R(`tile-bottom-${i + 1}`, rect(x, 846, 100, 56), 'teal'));

// pendant lamps
for (const [id, x] of [['lamp-left', 150], ['lamp-right', 850]] as [string, number][]) {
  R(`${id}-bulb`, circle(x, 232, 28), 'vanilla');
  R(`${id}-shade`, M(x - 80, 214) + Q(x - 80, 120, x, 120) + Q(x + 80, 120, x + 80, 214) + 'Z', 'teal');
  R(`${id}-rim`, rect(x - 88, 206, 176, 20, 8), 'steel');
  detail.push(stroke(line([[x, 0], [x, 120]]), '#35858a', 4));
  detail.push(stroke(curve([[x - 56, 190], [x - 50, 158], [x - 26, 138]]), '#ffffff', 3, { opacity: 0.5 }));
}

// ---------- counter ----------
R('counter', rect(0, 900, W, 274), 'peach');
R('counter-trim', rect(0, 1170, W, 36), 'steel', [500, 1179]);
R('counter-front', rect(0, 1204, W, 46), 'red', [500, 1228]);

// sugar shaker
R('shaker', rect(78, 752, 88, 170, 12), 'glass');
R('shaker-sugar', rect(88, 808, 68, 104, 8), 'cream');
R('shaker-cap', M(74, 760) + Q(74, 700, 122, 700) + Q(170, 700, 170, 760) + 'Z', 'steel');
R('shaker-band', rect(70, 752, 104, 18, 6), 'teal');
detail.push(stroke(circle(108, 722, 2) + circle(122, 716, 2) + circle(136, 722, 2) + circle(122, 730, 2), '#6f7c86', 2));

// napkin dispenser
R('dispenser', rect(828, 756, 144, 170, 12), 'steel');
R('dispenser-panel', rect(844, 772, 112, 138, 8), 'glass');
R('dispenser-napkin', rect(858, 822, 84, 30, 6), 'cream');

// ---------- the sundae ----------
R('glass-shadow', ellipse(544, 1086, 190, 24), 'peachD');
// wafers behind the scoops
R('wafer-fan', sector(600, 480, 250, -80, -42), 'wafer');
R('wafer-fan-edge', sector(600, 480, 250, -80, -42, 218), 'waferD');
R('wafer-roll', rotRect(330, 330, 34, 262, -24, 4), 'wafer');
R('wafer-roll-band-1', rotRect(...rotPt(330, 330, -24, 0, -92), 34, 20, -24), 'choc');
R('wafer-roll-band-2', rotRect(...rotPt(330, 330, -24, 0, -44), 34, 20, -24), 'choc');
// scoops
R('scoop-strawberry', circle(405, 505, 108), 'pink');
R('scoop-strawberry-shade', crescent(405, 505, 108, 108, 130, 232, 0.26), 'pinkD');
R('scoop-chocolate', circle(595, 505, 108), 'chocL');
R('scoop-chocolate-shade', crescent(595, 505, 108, 108, -52, 50, 0.26), 'choc');
R('scoop-vanilla', circle(500, 400, 112), 'vanilla');
{
  const pts: Pt[] = [];
  for (let a = 188; a <= 352.5; a += 13.67) pts.push([500 + Math.cos((a * Math.PI) / 180) * 114, 400 + Math.sin((a * Math.PI) / 180) * 114]);
  pts.push([606, 428], [590, 452], [574, 490], [556, 452], [532, 444], [512, 500], [494, 448], [470, 440], [450, 478], [432, 444], [410, 452], [394, 428]);
  R('sauce', blob(pts, 0.9), 'choc');
}
// whipped cream and the cherry
R('cream-1', rect(420, 262, 160, 48, 24), 'cream');
R('cream-2', rect(446, 226, 108, 46, 23), 'glass');
R('cream-3', M(462, 238) + C(458, 210, 490, 204, 500, 176) + C(510, 204, 542, 210, 538, 238) + Q(500, 248, 462, 238) + 'Z', 'cream');
R('cherry', circle(500, 160, 33), 'red');
R('cherry-shade', crescent(500, 160, 33, 33, 0, 140, 0.42), 'cherryD');
detail.push(stroke(curve([[504, 130], [512, 96], [544, 70]]), '#6b8f3a', 3.2));
detail.push(stroke(curve([[480, 152], [484, 142], [494, 138]]), '#ffffff', 3, { opacity: 0.9 }));

// the glass
const gl = vessel(500, [[560, 196], [640, 190], [740, 166], [840, 124], [920, 78], [975, 42], [992, 34]], 0.1);
R('glass-foot', ellipse(500, 1066, 138, 26), 'glass');
R('glass-foot-shine', ellipse(500, 1060, 94, 13), 'cream');
R('glass-stem', M(472, 986) + L(528, 986) + Q(506, 1016, 517, 1056) + L(483, 1056) + Q(494, 1016, 472, 986) + 'Z', 'glass');
R('glass', gl.body(), 'glass');
R('layer-strawberry', gl.band(586, 692, 12), 'pink');
R('layer-sauce', gl.band(692, 720, 12), 'red');
R('layer-vanilla', gl.band(720, 822, 12), 'vanilla');
R('layer-chocolate', gl.band(822, 916, 12), 'chocL');
R('layer-fudge', gl.band(916, 984, 12), 'choc');
R('glass-glint', gl.glint(612, 776, -1, 28, 14), 'cream');
R('glass-glint-small', gl.glint(608, 672, 1, 30, 12), 'cream');

// ---------- spoon ----------
{
  const rot = -11.3;
  R('spoon-handle', rotRect(232, 1097, 212, 16, rot, 8), 'steel');
  R('spoon', ellipse(92, 1126, 52, 31, rot), 'steel');
  R('spoon-hollow', ellipse(92, 1126, 37, 19, rot), 'glass');
}

// ---------- napkin and a spare cherry ----------
{
  const a: Pt = [748, 1040], b: Pt = [950, 1020], c: Pt = [975, 1130], d: Pt = [758, 1152];
  R('napkin', poly([a, b, c, d]), 'cream');
  R('napkin-stripe', subQuad(a, b, c, d, 0, 1, 0.76, 0.9), 'red');
  R('napkin-fold', poly([a, lerp(a, b, 0.3), lerp(a, d, 0.42)]), 'peachD');
  R('spare-cherry', circle(866, 1070, 30), 'red');
  R('spare-cherry-shade', crescent(866, 1070, 30, 30, 0, 140, 0.42), 'cherryD');
  detail.push(stroke(curve([[870, 1042], [884, 1012], [916, 996]]), '#6b8f3a', 3));
  detail.push(stroke(curve([[848, 1062], [852, 1053], [861, 1049]]), '#ffffff', 2.8, { opacity: 0.9 }));
}

// ---------- line work ----------
// wafer lattice
{
  let d = '';
  for (const r of [130, 160, 190]) {
    const pts: Pt[] = [];
    for (let a = -79; a <= -43; a += 6) pts.push([600 + Math.cos((a * Math.PI) / 180) * r, 480 + Math.sin((a * Math.PI) / 180) * r]);
    d += curve(pts, 0.6);
  }
  for (const a of [-70, -61, -52]) d += line([[600 + Math.cos((a * Math.PI) / 180) * 118, 480 + Math.sin((a * Math.PI) / 180) * 118], [600 + Math.cos((a * Math.PI) / 180) * 216, 480 + Math.sin((a * Math.PI) / 180) * 216]]);
  detail.push(stroke(d, '#c08238', 1.8));
}
// sprinkles on the sauce
{
  const g = rng(52);
  const cols = ['#fffaf0', '#f6a5b8', '#fbe6a8', '#bfe5dc'];
  const ds = cols.map(() => '');
  const spots: Pt[] = [[430, 380], [452, 340], [470, 410], [540, 420], [560, 350], [578, 398], [598, 420], [410, 420], [540, 322], [600, 372], [436, 322], [520, 470]];
  spots.forEach(([x, y], i) => {
    const a = g.range(0, Math.PI);
    ds[i % cols.length] += line([[x - Math.cos(a) * 6, y - Math.sin(a) * 6], [x + Math.cos(a) * 6, y + Math.sin(a) * 6]]);
  });
  ds.forEach((d, i) => detail.push(stroke(d, cols[i], 3.4)));
}
// swirl of the cream, rim of the glass, shine on the counter
detail.push(stroke(curve([[430, 290], [480, 300], [540, 290], [570, 276]]) + curve([[456, 252], [490, 260], [530, 252], [546, 242]]), '#9fb9c4', 1.8, { opacity: 0.8 }));
detail.push(stroke(curve([[306, 562], [400, 578], [500, 581], [600, 578], [694, 562]], 0.8), '#ffffff', 2.6, { opacity: 0.9 }));
detail.push(stroke(line([[60, 960], [300, 960]]) + line([[640, 950], [820, 950]]) + line([[420, 1140], [640, 1140]]) + line([[120, 1010], [220, 1010]]), '#fde6cf', 3, { opacity: 0.9 }));
detail.push(stroke(line([[0, 1188], [W, 1188]]), '#ffffff', 2.4, { opacity: 0.7 }));
detail.push(stroke(curve([[150, 1106], [230, 1090], [320, 1073]]), '#ffffff', 2.2, { opacity: 0.8 }));
detail.push(stroke(line([[866, 837], [934, 837]]), '#9fb9c4', 1.8));

const activity: PaintActivity = {
  id: 'sweets-paint-2', version: 1, mode: 'paint', title: 'Sundae with a Cherry',
  blurb: 'A tall glass sundae of strawberry, chocolate and vanilla scoops with fudge sauce, wafers, whipped cream and a cherry, waiting on the diner counter with a spoon and napkin.',
  collectionId: 'sweets', categories: ["Food", "Treats"], difficulty: 'Relaxed',
  added: '2026-11-26',
  width: W, height: H, palette, regions, detail,
};
export default activity;
