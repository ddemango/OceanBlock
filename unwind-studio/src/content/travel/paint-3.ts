import { rect, ellipse, circle, poly, line, curve, blob, sector, stroke } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { PaintActivity, PaintRegion, PaletteColor } from '../types';
import { n, scallop } from './props-paint';

const W = 1000, H = 1250;

const palette: PaletteColor[] = [
  { id: 'sky', number: 1, name: 'Aegean sky', hex: '#a6d4ec' },
  { id: 'white', number: 2, name: 'Whitewash', hex: '#fbfaf4' },
  { id: 'shade', number: 3, name: 'Wall in shade', hex: '#cdd6e2' },
  { id: 'blue', number: 4, name: 'Dome blue', hex: '#2459a6' },
  { id: 'blueLight', number: 5, name: 'Sunlit dome', hex: '#4f8ad2' },
  { id: 'sea', number: 6, name: 'Deep sea', hex: '#2b7cb2' },
  { id: 'seaLight', number: 7, name: 'Shallow sea', hex: '#6dbad6' },
  { id: 'island', number: 8, name: 'Far island', hex: '#a0a7ca' },
  { id: 'sand', number: 9, name: 'Warm stone', hex: '#e8d4ae' },
  { id: 'stone', number: 10, name: 'Stone in shade', hex: '#c2a982' },
  { id: 'magenta', number: 11, name: 'Bougainvillea', hex: '#c42f86' },
  { id: 'pink', number: 12, name: 'Bougainvillea light', hex: '#ea72b3' },
  { id: 'leaf', number: 13, name: 'Vine leaf', hex: '#4e8a46' },
  { id: 'terra', number: 14, name: 'Clay pot', hex: '#c96b43' },
  { id: 'teal', number: 15, name: 'Shutter teal', hex: '#36a1a6' },
  { id: 'cream', number: 16, name: 'Sailcloth', hex: '#f4e4c4' },
  { id: 'ochre', number: 17, name: 'Ochre plaster', hex: '#e9b85f' },
];

const regions: PaintRegion[] = [];
const R = (id: string, d: string, color: string) => { regions.push({ id, d, color }); };
const detail: Shape[] = [];
const archDoor = (x0: number, x1: number, yTop: number, yBot: number) => {
  const r = (x1 - x0) / 2, cx = (x0 + x1) / 2;
  return `M${n(x0)} ${n(yBot)}L${n(x0)} ${n(yTop + r)}Q${n(x0)} ${n(yTop)} ${n(cx)} ${n(yTop)}Q${n(x1)} ${n(yTop)} ${n(x1)} ${n(yTop + r)}L${n(x1)} ${n(yBot)}Z`;
};

// ---------- sky and sea ----------
R('sky', rect(0, 0, W, 272), 'sky');
R('cloud-1', blob([[420, 110], [460, 82], [520, 88], [562, 66], [630, 78], [672, 106], [620, 124], [470, 126]], 0.9), 'cream');
R('cloud-2', blob([[700, 70], [740, 50], [800, 56], [850, 44], [912, 62], [940, 86], [860, 96], [730, 94]], 0.9), 'cream');
R('island-1', curve([[0, 248], [90, 226], [190, 206], [280, 214], [380, 238], [470, 266]], 0.8) + 'L0 266Z', 'island');
R('island-2', curve([[700, 266], [780, 244], [870, 236], [W, 244]], 0.8) + `L${W} 266Z`, 'island');
R('sea', rect(0, 262, W, H - 262), 'sea');
R('sea-horizon', rect(0, 262, W, 28), 'seaLight');
R('sea-shallows', curve([[700, 1250], [760, 1130], [860, 1060], [940, 1010], [W, 990]], 0.8) + `L${W} ${H}Z`, 'seaLight');

// sailboat
R('boat-hull', poly([[856, 486], [966, 486], [950, 506], [872, 506]]), 'blue');
R('boat-sail', poly([[910, 480], [910, 380], [962, 480]]), 'cream');
R('boat-jib', poly([[902, 480], [902, 400], [862, 480]]), 'white');

// ---------- village above the terrace ----------
R('cube-back', rect(392, 462, 136, 84), 'white');
R('cube-back-side', poly([[392, 462], [372, 474], [372, 548], [392, 546]]), 'shade');
R('ochre-house', rect(360, 540, 190, 140), 'ochre');
R('ochre-window', rect(404, 576, 46, 58, 3), 'blue');
R('ochre-door', archDoor(476, 516, 590, 680), 'teal');

// church with its blue dome
R('church-body', rect(540, 470, 196, 210), 'white');
R('church-side', poly([[736, 470], [772, 452], [772, 668], [736, 680]]), 'shade');
R('church-drum', rect(580, 436, 116, 36, 3), 'shade');
R('church-dome', sector(638, 440, 80, 180, 360), 'blue');
R('church-dome-light', ellipse(604, 402, 32, 13, -42), 'blueLight');
R('church-finial', circle(638, 354, 9), 'blueLight');
R('church-door', archDoor(610, 666, 560, 680), 'blue');
R('church-rose', circle(638, 516, 15), 'teal');

// bell tower
R('tower', rect(774, 400, 64, 280), 'white');
R('tower-arch', archDoor(790, 822, 424, 486), 'sea');
R('tower-dome', sector(806, 402, 34, 180, 360), 'blue');
detail.push(stroke(curve([[800, 466], [806, 452], [812, 466]]) + line([[798, 468], [814, 468]]), '#c2a982', 3));

// house on the right
R('house-r', rect(838, 556, 162, 124), 'white');
R('house-r-door', archDoor(856, 896, 592, 680), 'blue');
R('house-r-window', rect(926, 588, 44, 44, 3), 'teal');

// terrace wall
R('terrace-wall', rect(300, 676, 700, 112), 'shade');
R('terrace-cap', rect(300, 668, 700, 16, 3), 'sand');
R('terrace-niche-1', archDoor(420, 452, 704, 760), 'blue');
R('terrace-niche-2', archDoor(800, 832, 704, 760), 'blue');

// house far below, beside the sea
R('low-house', rect(852, 852, 148, 110), 'white');
R('low-house-door', archDoor(880, 916, 886, 962), 'teal');
R('low-house-roof', rect(846, 842, 154, 16, 4), 'sand');

// ---------- the stepped lane ----------
const yTop = 820, yBot = H;
const xL = (y: number) => 470 - 110 * ((y - yTop) / (yBot - yTop));
const xR = (y: number) => 700 + 200 * ((y - yTop) / (yBot - yTop));
R('lane-ground', poly([[300, 784], [760, 784], [xR(yTop), yTop], [xR(yBot), yBot], [300, yBot]]), 'stone');
{
  const ys = Array.from({ length: 7 }, (_, k) => yTop + (yBot - yTop) * Math.pow(k / 6, 1.2));
  for (let k = 0; k < 6; k++) {
    const y0 = ys[k], y1 = ys[k + 1], ym = y0 + (y1 - y0) * 0.3;
    R(`step-${k + 1}-edge`, poly([[xL(y0), y0], [xR(y0), y0], [xR(ym), ym], [xL(ym), ym]]), 'white');
    R(`step-${k + 1}-tread`, poly([[xL(ym), ym], [xR(ym), ym], [xR(y1), y1], [xL(y1), y1]]), 'sand');
  }
}
R('lane-kerb', poly([[452, 820], [472, 820], [362, H], [336, H]]), 'white');
R('parapet', poly([[700, 820], [728, 788], [W, 1150], [W, H], [900, H]]), 'white');
R('parapet-cap', poly([[722, 778], [740, 778], [W, 1126], [W, 1152], [726, 796]]), 'sand');

// blue pot on the parapet
R('pot-blue', poly([[874, 990], [930, 990], [922, 1042], [882, 1042]]), 'blue');
R('pot-blue-leaves', scallop(902, 972, 46, 26, 8), 'leaf');
R('pot-blue-flowers', scallop(896, 962, 28, 16, 7), 'magenta');

// the cat
R('cat-body', blob([[566, 1074], [560, 1046], [570, 1016], [592, 1006], [612, 1020], [620, 1050], [616, 1074]], 0.9), 'ochre');
R('cat-head', blob([[572, 1004], [570, 982], [574, 962], [584, 974], [600, 974], [610, 962], [614, 982], [612, 1004], [592, 1014]], 0.5), 'ochre');
R('cat-chest', blob([[580, 1020], [592, 1012], [604, 1020], [602, 1046], [584, 1046]], 0.9), 'white');
detail.push(stroke(curve([[616, 1068], [640, 1062], [646, 1040], [636, 1028]]), '#c9913c', 5));
detail.push(stroke(circle(584, 988, 1.8) + circle(600, 988, 1.8), '#3a3a3a', 2));

// ---------- left house ----------
R('left-side', poly([[300, 250], [362, 268], [362, 1068], [300, yBot]]), 'shade');
R('left-front', rect(0, 250, 300, 1000), 'white');
R('left-shutter-l', rect(44, 364, 34, 112, 2), 'teal');
R('left-shutter-r', rect(160, 364, 34, 112, 2), 'teal');
R('left-glass', rect(82, 368, 74, 104), 'blue');
R('left-ledge', rect(64, 474, 110, 14, 3), 'sand');
R('ledge-plant', scallop(119, 466, 40, 16, 8), 'leaf');
R('ledge-flowers', scallop(119, 458, 22, 10, 6), 'magenta');
for (const [i, x] of [[1, 70], [2, 226]] as [number, number][]) {
  R(`wall-pot-${i}-leaves`, scallop(x, 640, 34, 20, 8), 'leaf');
  R(`wall-pot-${i}-flowers`, scallop(x - 4, 630, 20, 12, 6), i === 1 ? 'pink' : 'magenta');
  R(`wall-pot-${i}`, poly([[x - 22, 650], [x + 22, 650], [x + 16, 690], [x - 16, 690]]), 'terra');
}
R('left-door-frame', archDoor(104, 256, 812, 1206), 'sand');
R('left-door', archDoor(118, 242, 826, 1206), 'blue');
R('left-step', rect(92, 1204, 176, 22, 3), 'stone');
R('left-pot', poly([[22, 1140], [76, 1140], [68, 1204], [30, 1204]]), 'terra');
R('left-pot-leaves', scallop(48, 1116, 40, 30, 8), 'leaf');
R('left-pot-flowers', scallop(52, 1100, 22, 16, 7), 'pink');

// ---------- bougainvillea tumbling over the left house ----------
R('vine-mass', blob([[150, 250], [190, 214], [250, 196], [310, 206], [366, 240], [384, 300], [370, 380], [352, 470], [346, 560], [354, 650], [332, 720], [306, 650], [300, 560], [296, 470], [276, 380], [230, 320], [170, 300], [120, 290], [76, 270], [104, 248]], 0.8), 'leaf');
R('vine-bloom-1', scallop(232, 240, 62, 36, 9), 'magenta');
R('vine-bloom-2', scallop(330, 292, 44, 52, 8), 'magenta');
R('vine-bloom-3', scallop(340, 424, 26, 46, 7), 'magenta');
R('vine-bloom-4', scallop(328, 562, 22, 40, 6), 'magenta');
R('vine-bloom-5', scallop(326, 668, 18, 32, 6), 'magenta');
R('vine-bloom-6', scallop(132, 272, 40, 20, 7), 'magenta');
R('vine-light-1', scallop(272, 222, 34, 18, 7), 'pink');
R('vine-light-2', scallop(352, 346, 20, 26, 6), 'pink');
R('vine-light-3', scallop(190, 262, 26, 15, 6), 'pink');
R('vine-light-4', scallop(334, 500, 16, 24, 6), 'pink');

// ---------- line work ----------
detail.push(stroke(line([[119, 420], [156, 420]]) + line([[119, 368], [119, 472]]), '#fbfaf4', 3));
{
  let s = '';
  for (let y = 378; y < 472; y += 11) s += line([[48, y], [74, y]]) + line([[164, y], [190, y]]);
  detail.push(stroke(s, '#23777b', 1.3));
}
detail.push(stroke(line([[180, 830], [180, 1206]]) + circle(166, 1030, 4) + circle(194, 1030, 4), '#173f7a', 2));
detail.push(stroke(curve([[300, 160], [312, 150], [324, 160]]) + curve([[324, 160], [336, 150], [348, 160]]) + curve([[360, 196], [368, 189], [376, 196]]) + curve([[376, 196], [384, 189], [392, 196]]) + curve([[760, 170], [770, 162], [780, 170]]) + curve([[780, 170], [790, 162], [800, 170]]), '#4a5a72', 2));
detail.push(stroke(line([[906, 480], [906, 376]]), '#3a3a3a', 1.6));
detail.push(stroke(curve([[480, 380], [530, 376], [580, 380]]) + curve([[440, 420], [470, 417], [500, 420]]) + curve([[760, 740], [800, 736], [840, 740]]) + curve([[930, 1080], [960, 1076], [990, 1080]]) + curve([[800, 1220], [840, 1216], [880, 1220]]) + curve([[700, 330], [760, 327], [820, 330]]), '#ffffff', 2, { opacity: 0.75 }));
detail.push(stroke(line([[300, 250], [300, 1250]]) + line([[736, 470], [736, 680]]), '#b7c2d1', 1.6));
detail.push(stroke(curve([[110, 262], [180, 250], [260, 236], [330, 270], [352, 380], [332, 520], [330, 660]]), '#5a3f2e', 2, { opacity: 0.7 }));
{
  let d = '';
  for (const [y, x0] of [[706, 300], [730, 330], [754, 300], [778, 330]] as [number, number][]) for (let x = x0; x < W; x += 60) d += line([[x, y], [x + 44, y]]);
  detail.push(stroke(d, '#b7c2d1', 1.4));
  const ys = Array.from({ length: 7 }, (_, k) => yTop + (yBot - yTop) * Math.pow(k / 6, 1.2));
  let t = '';
  for (let k = 0; k < 6; k++) {
    const y0 = ys[k] + (ys[k + 1] - ys[k]) * 0.3, y1 = ys[k + 1];
    for (const f of [0.3, 0.62]) { const xa = xL(y0) + (xR(y0) - xL(y0)) * f, xb = xL(y1) + (xR(y1) - xL(y1)) * f; t += line([[xa, y0], [xb, y1]]); }
  }
  detail.push(stroke(t, '#cdb48a', 1.4));
}

const activity: PaintActivity = {
  id: 'travel-paint-3', version: 1, mode: 'paint', title: 'Whitewashed Village',
  blurb: 'Sun-bright steps wind down past blue domes and tumbling bougainvillea to a sea dotted with a single white sail.',
  collectionId: 'travel', categories: ['Travel', 'Seaside', 'Architecture'], difficulty: 'Moderate',
  width: W, height: H, palette, regions, detail,
};
export default activity;
