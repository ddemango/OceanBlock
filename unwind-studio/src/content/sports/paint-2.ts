import { rect, circle, ellipse, poly, line, curve, xf } from '../../art/kit';
import type { PaintActivity, PaletteColor } from '../types';
import { canvas, bar, canopy, crescent, halfRing, shoe, grassTufts, lerp, sample, subQuad, M, Q, L, type Pt } from './props-paint';

const W = 1000, H = 1250;

const palette: PaletteColor[] = [
  { id: 'dusk', number: 1, name: 'Evening lilac', hex: '#c7c0e4' },
  { id: 'peach', number: 2, name: 'Peach sky', hex: '#f8c9a6' },
  { id: 'gold', number: 3, name: 'Golden hour', hex: '#fbdc8e' },
  { id: 'sun', number: 4, name: 'Low sun', hex: '#fff3c4' },
  { id: 'roof', number: 5, name: 'Slate plum', hex: '#6c5870' },
  { id: 'trim', number: 6, name: 'Trim white', hex: '#fbf6ec' },
  { id: 'siding', number: 7, name: 'Warm clapboard', hex: '#e9b98c' },
  { id: 'sidingD', number: 8, name: 'Clapboard shade', hex: '#c98f67' },
  { id: 'door', number: 9, name: 'Garage cream', hex: '#f1e0c2' },
  { id: 'panel', number: 10, name: 'Panel shadow', hex: '#d8c19c' },
  { id: 'glass', number: 11, name: 'Window blue', hex: '#9cc0d4' },
  { id: 'orange', number: 12, name: 'Ball orange', hex: '#e5762f' },
  { id: 'rust', number: 13, name: 'Burnt orange', hex: '#b3521f' },
  { id: 'lawn', number: 14, name: 'Lawn green', hex: '#97b75c' },
  { id: 'leaf', number: 15, name: 'Deep leaf', hex: '#5d8645' },
  { id: 'concrete', number: 16, name: 'Warm concrete', hex: '#ddd1c2' },
  { id: 'shadow', number: 17, name: 'Long shadow', hex: '#b6a798' },
  { id: 'teal', number: 18, name: 'Bike teal', hex: '#3d8f94' },
];
// charcoal line work for fine details only
const INK = '#4a3f48';

const { regions, detail, R, D } = canvas();

// ---------------------------------------------------------------- golden-hour sky
R('sky', rect(0, 0, W, 980), 'dusk');
R('sky-peach', poly([[0, 980], ...sample([[0, 300], [300, 250], [640, 236], [1000, 196]], 6), [1000, 980]]), 'peach');
R('sky-gold', poly([[0, 980], ...sample([[0, 470], [300, 420], [640, 400], [1000, 360]], 6), [1000, 980]]), 'gold');
R('sun', circle(860, 250, 58), 'sun');
R('cloud-1', canopy(250, 120, 118, 26, 6, 0.2, 0.3, true), 'peach');
R('cloud-2', canopy(620, 70, 90, 20, 5, 0.2, 0.6, true), 'peach');

// ---------------------------------------------------------------- tree behind the house
R('tree-trunk', poly([[54, 980], [64, 520], [92, 520], [106, 980]]), 'roof');
R('tree-canopy', canopy(80, 400, 170, 200, 9, 0.1, 0.2), 'leaf');
R('tree-canopy-light', canopy(120, 350, 104, 118, 7, 0.12, 0.6), 'lawn');

// ---------------------------------------------------------------- house and garage
R('gable', poly([[120, 404], [540, 168], [960, 404]]), 'sidingD');
R('roof', poly([[80, 410], [540, 118], [1000, 410], [956, 410], [540, 170], [124, 410]]), 'roof');
R('wall', rect(130, 404, 820, 576), 'siding');
R('fascia', rect(118, 398, 844, 18), 'trim', [200, 407]);
R('vent', circle(540, 250, 30), 'trim');
D(line([[518, 238], [562, 238]]) + line([[514, 250], [566, 250]]) + line([[518, 262], [562, 262]]), INK, 1.6, 0.7);
// clapboard lines, kept clear of the door, lanterns and bushes
{
  let d = '';
  for (let y = 440; y < 900; y += 26) {
    const segs: [number, number][] = y > 520 && y < 610 ? [[130, 188], [232, 268], [812, 848], [892, 950]] : [[130, 268], [812, 950]];
    for (const [a, b] of segs) d += line([[a, y], [b, y]]);
  }
  for (let y = 300; y < 404; y += 26) {
    const half = ((y - 168) / (404 - 168)) * 420;
    d += line([[540 - half + 8, y], [390, y]]) + line([[690, y], [540 + half - 8, y]]);
  }
  D(d, '#b9805a', 1.4, 0.7);
}

// garage door
R('door-trim', rect(272, 566, 536, 414), 'trim');
R('door', rect(290, 582, 500, 398), 'door');
{
  const cols = 4, rows = 4, gap = 14;
  const pw = (500 - gap * (cols + 1)) / cols, ph = (398 - gap * (rows + 1)) / rows;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const x = 290 + gap + c * (pw + gap), y = 582 + gap + r * (ph + gap);
    R(`door-panel-${r + 1}-${c + 1}`, rect(x, y, pw, ph, 3), r === 0 ? 'glass' : 'panel');
    if (r === 0) D(line([[x + 18, y + ph - 12], [x + 44, y + 12]]) + line([[x + 34, y + ph - 12], [x + 54, y + 22]]), '#e8f1f4', 2.4, 0.9);
  }
  D(line([[290, 582 + gap + ph + gap / 2], [790, 582 + gap + ph + gap / 2]]) + line([[290, 582 + 2 * (gap + ph) + gap / 2], [790, 582 + 2 * (gap + ph) + gap / 2]]) + line([[290, 582 + 3 * (gap + ph) + gap / 2], [790, 582 + 3 * (gap + ph) + gap / 2]]), '#c2a77f', 1.4);
  R('door-handle', rect(518, 930, 44, 12, 5), 'roof');
}

// wall lanterns, already glowing
function lantern(id: string, x: number) {
  R(`${id}-glow`, circle(x, 566, 34), 'gold');
  R(`${id}-cap`, poly([[x - 20, 532], [x + 20, 532], [x + 12, 518], [x - 12, 518]]), 'roof');
  R(`${id}-glass`, rect(x - 14, 532, 28, 44, 3), 'sun');
  R(`${id}-base`, rect(x - 18, 576, 36, 12, 3), 'roof');
}
lantern('lantern-left', 210);
lantern('lantern-right', 870);

// ---------------------------------------------------------------- the hoop
R('board-frame', rect(396, 322, 288, 184, 8), 'roof');
R('board', rect(408, 334, 264, 160, 4), 'trim');
R('board-target', rect(482, 398, 116, 96), 'orange');
R('board-target-inner', rect(496, 412, 88, 82), 'trim');
{
  const cx = 540, cy = 522, rx = 66, ry = 22, t = 12;
  const half = (top: boolean) => {
    const out: Pt[] = [], inn: Pt[] = [];
    for (let i = 0; i <= 24; i++) {
      const a = Math.PI * (top ? 1 + i / 24 : i / 24);
      out.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]);
      inn.push([cx + Math.cos(a) * (rx - t), cy + Math.sin(a) * (ry - 10)]);
    }
    return poly([...out, ...inn.reverse()]);
  };
  R('rim-back', half(true), 'rust');
  R('net', poly([[cx - rx + 8, cy + 2], [cx + rx - 8, cy + 2], [cx + 38, cy + 104], [cx - 38, cy + 104]]), 'trim');
  let d = '';
  for (let i = 0; i <= 6; i++) {
    const t0 = i / 6;
    const top = lerp([cx - rx + 12, cy + 22], [cx + rx - 12, cy + 22], t0);
    const bot = lerp([cx - 36, cy + 102], [cx + 36, cy + 102], Math.min(1, t0 + 0.16));
    const bot2 = lerp([cx - 36, cy + 102], [cx + 36, cy + 102], Math.max(0, t0 - 0.16));
    d += line([top, bot]) + line([top, bot2]);
  }
  d += line([[cx - 52, cy + 36], [cx + 52, cy + 36]]) + line([[cx - 45, cy + 70], [cx + 45, cy + 70]]);
  D(d, '#a99f9a', 1.6);
  R('rim-front', half(false), 'orange');
}

// ---------------------------------------------------------------- lawn, bushes, driveway
R('lawn', rect(0, 960, W, 290), 'lawn');
R('bush-left', canopy(200, 940, 92, 62, 7, 0.12, 0.4, true), 'leaf');
R('bush-left-light', canopy(178, 926, 50, 32, 5, 0.14, 0.1, true), 'lawn');
R('bush-right', canopy(884, 940, 96, 62, 7, 0.12, 0.2, true), 'leaf');
R('bush-right-light', canopy(910, 924, 52, 32, 5, 0.14, 0.5, true), 'lawn');
{
  const A: Pt = [284, 980], B: Pt = [796, 980], Cc: Pt = [960, 1250], Dd: Pt = [120, 1250];
  const vs = [0, 0.31, 0.66, 1];
  for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) R(`driveway-${i + 1}-${j + 1}`, subQuad(A, B, Cc, Dd, j * 0.5, j * 0.5 + 0.5, vs[i], vs[i + 1]), 'concrete');
}
R('driveway-shadow', poly([[284, 980], [404, 980], [312, 1250], [120, 1250]]), 'shadow');
D(grassTufts(0, 1000, 1250, 50, 30, 4, [[110, 980], [20, 470]]) + grassTufts(0, 1000, 1004, 30, 16, 9, [[250, 830]]), '#6d9447', 1.6, 0.8);

// ---------------------------------------------------------------- bike leaning on its stand
{
  const Rw: Pt = [120, 1110], Fw: Pt = [372, 1110], r = 86;
  const BB: Pt = [236, 1118], ST: Pt = [210, 984], HT: Pt = [338, 980], HB: Pt = [348, 1016];
  for (const [id, c] of [['rear', Rw], ['front', Fw]] as [string, Pt][]) {
    R(`bike-${id}-tyre-top`, halfRing(c[0], c[1], r, r - 13, true), 'roof');
    R(`bike-${id}-tyre-bottom`, halfRing(c[0], c[1], r, r - 13, false), 'roof');
    let sp = '';
    for (let i = 0; i < 12; i++) { const a = (i * 30 * Math.PI) / 180; sp += line([[c[0] + Math.cos(a) * 8, c[1] + Math.sin(a) * 8], [c[0] + Math.cos(a) * (r - 14), c[1] + Math.sin(a) * (r - 14)]]); }
    D(sp, '#8f8a8e', 1.2);
  }
  R('bike-chainstay', bar(BB, Rw, 12, 10), 'teal');
  R('bike-seatstay', bar(ST, Rw, 12, 10), 'teal');
  R('bike-seat-tube', bar(BB, [ST[0] - 4, ST[1] - 20], 16), 'teal');
  R('bike-top-tube', bar(ST, HT, 16), 'teal');
  R('bike-down-tube', bar(BB, HB, 18), 'teal');
  R('bike-fork', bar(HB, Fw, 13, 10), 'teal');
  R('bike-head-tube', bar([HT[0] - 2, HT[1] - 18], HB, 18), 'teal');
  R('bike-stem', bar([HT[0] - 2, HT[1] - 16], [322, 942], 12), 'roof');
  R('bike-bars', poly([[300, 934], [356, 930], [360, 944], [304, 948]]), 'roof');
  R('bike-seat', blob5([[176, 958], [210, 950], [244, 954], [246, 968], [210, 970], [180, 972]]), 'roof');
  R('bike-crank', circle(BB[0], BB[1], 22), 'sidingD');
  R('bike-hub-rear', circle(Rw[0], Rw[1], 10), 'trim');
  R('bike-hub-front', circle(Fw[0], Fw[1], 10), 'trim');
  R('bike-basket', poly([[356, 950], [428, 950], [418, 1006], [366, 1006]]), 'sidingD');
  D(line([[360, 968], [424, 968]]) + line([[362, 988], [422, 988]]) + line([[380, 950], [380, 1006]]), '#9b6a48', 1.6);
  D(line([[392, 950], [400, 1006]]) + line([[404, 950], [412, 1006]]), '#9b6a48', 1.6);
  D(line([[BB[0], BB[1]], [BB[0] + 20, BB[1] + 34]]) + line([[BB[0] - 30, BB[1] - 4], [Rw[0] + 6, Rw[1] - 8]]), INK, 2);
}
function blob5(pts: Pt[]) { return poly(sample([...pts, pts[0]], 5)); }

// ---------------------------------------------------------------- the ball and sneakers
const bx = 600, by = 1096, br = 84;
R('ball-shadow', ellipse(bx - 64, by + br - 8, br * 1.3, 20, -4), 'shadow');
R('ball', circle(bx, by, br), 'orange');
R('ball-shade', crescent(bx, by, br, br, -40, 140, 0.32), 'rust');
D(curve([[bx - br * 0.98, by - 10], [bx, by + 6], [bx + br * 0.98, by - 10]], 0.8) + line([[bx + 6, by - br], [bx - 6, by + br]]) +
  curve([[bx - br * 0.6, by - br * 0.78], [bx - br * 0.28, by], [bx - br * 0.6, by + br * 0.8]]) + curve([[bx + br * 0.62, by - br * 0.78], [bx + br * 0.34, by], [bx + br * 0.62, by + br * 0.8]]), INK, 2.6);

function sneaker(id: string, x: number, y: number, len: number, dir: 1 | -1, rot: number) {
  const s = shoe(0, 0, len, dir, 0.95);
  const t = (d: string) => xf(d, { rot, x, y });
  R(`${id}-sole`, t(s.sole), 'trim');
  R(`${id}-upper`, t(s.upper), 'dusk');
  R(`${id}-collar`, t(s.collar), 'roof');
  R(`${id}-heel`, t(s.heel), 'orange');
  R(`${id}-toe`, t(s.toe), 'trim');
  R(`${id}-stripe`, t(s.stripe), 'orange');
  D(t(s.laces), '#fbf6ec', 3.4);
}
R('sneakers-shadow', ellipse(800, 1218, 168, 20), 'shadow');
sneaker('sneaker-back', 690, 1170, 210, 1, -4);
sneaker('sneaker-front', 742, 1226, 220, 1, 1);

// ---------------------------------------------------------------- sun rays and warm light
D(line([[860, 162], [860, 146]]) + line([[930, 190], [944, 178]]) + line([[948, 250], [966, 250]]) + line([[790, 190], [776, 178]]), '#f2b54e', 3, 0.8);
D(M(160, 136) + Q(240, 122, 330, 132) + M(560, 82) + L(680, 82), '#f3b896', 2);

const activity: PaintActivity = {
  id: 'sports-paint-2', version: 1, mode: 'paint', title: 'Backyard Hoops',
  blurb: 'Golden-hour light warms a driveway hoop above the garage, with a ball, a pair of sneakers and a teal bike waiting for one more game.',
  collectionId: 'sports', categories: ["Sports"], difficulty: 'Moderate',
  width: W, height: H, palette, regions, detail,
};
export default activity;
