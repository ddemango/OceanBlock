import { rect, ellipse, circle, poly, line, curve, blob, sector, stroke } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { Pt } from '../../art/geometry';
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
R('sky', rect(0, 0, W, 340), 'sky');
R('cloud-1', blob([[120, 120], [160, 92], [220, 98], [262, 76], [330, 88], [372, 116], [320, 134], [170, 136]], 0.9), 'cream');
R('cloud-2', blob([[700, 70], [740, 50], [800, 56], [850, 44], [912, 62], [940, 86], [860, 96], [730, 94]], 0.9), 'cream');
R('island-1', curve([[0, 300], [80, 286], [170, 262], [250, 276], [330, 304], [400, 334]], 0.8) + 'L0 334Z', 'island');
R('island-2', curve([[820, 334], [870, 314], [930, 306], [W, 312]], 0.8) + `L${W} 334Z`, 'island');
R('sea', rect(0, 330, W, H - 330), 'sea');
R('sea-horizon', rect(0, 330, W, 26), 'seaLight');
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
{
  const pts: Pt[] = [];
  for (let a = 196; a <= 272; a += 6) pts.push([638 + Math.cos((a * Math.PI) / 180) * 74, 440 + Math.sin((a * Math.PI) / 180) * 74]);
  for (let a = 268; a >= 200; a -= 6) pts.push([652 + Math.cos((a * Math.PI) / 180) * 56, 446 + Math.sin((a * Math.PI) / 180) * 56]);
  R('church-dome-light', blob(pts, 0.4), 'blueLight');
}
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
R('left-door-frame', archDoor(104, 256, 812, 1206), 'sand');
R('left-door', archDoor(118, 242, 826, 1206), 'blue');
R('left-step', rect(92, 1204, 176, 22, 3), 'stone');
R('left-pot', poly([[22, 1140], [76, 1140], [68, 1204], [30, 1204]]), 'terra');
R('left-pot-leaves', scallop(48, 1116, 40, 30, 8), 'leaf');
R('left-pot-flowers', scallop(52, 1100, 22, 16, 7), 'pink');

// ---------- bougainvillea tumbling over the left house ----------
R('vine-mass', blob([[0, 120], [60, 150], [140, 170], [220, 196], [296, 220], [360, 262], [378, 330], [352, 420], [334, 520], [348, 640], [318, 700], [296, 620], [282, 520], [250, 420], [190, 330], [110, 300], [40, 330], [0, 340]], 0.8), 'leaf');
R('vine-bloom-1', scallop(60, 200, 70, 46, 9), 'magenta');
R('vine-bloom-2', scallop(196, 228, 64, 40, 9), 'magenta');
R('vine-bloom-3', scallop(312, 300, 46, 52, 8), 'magenta');
R('vine-bloom-4', scallop(320, 460, 30, 50, 7), 'magenta');
R('vine-bloom-5', scallop(326, 610, 22, 40, 6), 'magenta');
R('vine-light-1', scallop(110, 180, 42, 24, 7), 'pink');
R('vine-light-2', scallop(250, 210, 36, 22, 7), 'pink');
R('vine-light-3', scallop(318, 372, 24, 30, 6), 'pink');
R('vine-light-4', scallop(22, 300, 26, 20, 6), 'pink');

// ---------- line work ----------
detail.push(stroke(line([[119, 420], [156, 420]]) + line([[119, 368], [119, 472]]), '#fbfaf4', 3));
{
  let s = '';
  for (let y = 378; y < 472; y += 11) s += line([[48, y], [74, y]]) + line([[164, y], [190, y]]);
  detail.push(stroke(s, '#23777b', 1.3));
}
detail.push(stroke(line([[180, 830], [180, 1206]]) + circle(166, 1030, 4) + circle(194, 1030, 4), '#173f7a', 2));
detail.push(stroke(line([[906, 480], [906, 376]]), '#3a3a3a', 1.6));
detail.push(stroke(curve([[30, 420], [70, 416], [110, 420]]) + curve([[480, 380], [530, 376], [580, 380]]) + curve([[440, 420], [470, 417], [500, 420]]) + curve([[760, 740], [800, 736], [840, 740]]) + curve([[930, 1080], [960, 1076], [990, 1080]]) + curve([[800, 1220], [840, 1216], [880, 1220]]) + curve([[700, 360], [760, 357], [820, 360]]), '#ffffff', 2, { opacity: 0.75 }));
detail.push(stroke(line([[300, 250], [300, 1250]]) + line([[736, 470], [736, 680]]), '#b7c2d1', 1.6));
detail.push(stroke(curve([[0, 160], [80, 190], [180, 220], [270, 250], [330, 310], [340, 420], [326, 560]]), '#5a3f2e', 2, { opacity: 0.7 }));

const activity: PaintActivity = {
  id: 'travel-paint-3', version: 1, mode: 'paint', title: 'Whitewashed Village',
  blurb: 'Sun-bright steps wind down past blue domes and tumbling bougainvillea to a sea dotted with a single white sail.',
  collectionId: 'travel', categories: ['Travel', 'Seaside', 'Architecture'], difficulty: 'Moderate',
  width: W, height: H, palette, regions, detail,
};
export default activity;
