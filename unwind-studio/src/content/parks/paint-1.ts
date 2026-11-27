import { rect, circle, ellipse, poly, line, curve, blob, waveBand, stroke } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { PaintActivity, PaletteColor } from '../types';
import { collector, band, ridge, treeline, pine, pineTiers, ribbon, xAtY, bank, puff, lens, tuft, boulder, type Pt } from './props-paint';

const W = 1000, H = 1250;

const palette: PaletteColor[] = [
  { id: 'skyTop', number: 1, name: 'High sky', hex: '#8cc2e2' },
  { id: 'sky', number: 2, name: 'Morning sky', hex: '#c6e4f0' },
  { id: 'white', number: 3, name: 'Falling water', hex: '#fffdf6' },
  { id: 'far', number: 4, name: 'Far ridge', hex: '#a6bcd3' },
  { id: 'granite', number: 5, name: 'Sunlit granite', hex: '#eee3d0' },
  { id: 'stone', number: 6, name: 'Warm stone', hex: '#c9bba9' },
  { id: 'shadow', number: 7, name: 'Cliff shadow', hex: '#8e8fa6' },
  { id: 'spruce', number: 8, name: 'Blue spruce', hex: '#5e8f88' },
  { id: 'forest', number: 9, name: 'Deep forest', hex: '#2d5848' },
  { id: 'pine', number: 10, name: 'Pine green', hex: '#43805a' },
  { id: 'moss', number: 11, name: 'Moss', hex: '#78a95d' },
  { id: 'meadow', number: 12, name: 'Spring meadow', hex: '#b7d780' },
  { id: 'gold', number: 13, name: 'Dry grass', hex: '#e6d77c' },
  { id: 'river', number: 14, name: 'River blue', hex: '#4f9fc6' },
  { id: 'riverLight', number: 15, name: 'Ripple', hex: '#a7d9e9' },
  { id: 'bark', number: 16, name: 'Pine bark', hex: '#6e4c38' },
  { id: 'poppy', number: 17, name: 'Poppy', hex: '#ee8a4f' },
];

const { regions, R } = collector();
const detail: Shape[] = [];

// ---------- sky ----------
R('sky-top', rect(0, 0, W, H), 'skyTop');
R('sky', waveBand(0, W, 176, 10, 800, H, 1), 'sky');
R('cloud-1', puff(470, 104, 1), 'white');
R('cloud-2', puff(826, 150, 0.74), 'white');
R('cloud-3', puff(610, 232, 0.5), 'white');

// ---------- the far end of the valley ----------
R('far-ridge', band([[280, 480], [350, 446], [430, 462], [500, 436], [580, 456], [660, 430], [730, 450], [780, 476]], H), 'far');
R('dome', poly([[474, 580], [480, 430], [486, 352], [497, 322], [520, 305], [552, 300], [588, 312], [618, 345], [640, 395], [655, 450], [668, 500], [690, 580]]), 'granite');
R('dome-face', poly([[474, 580], [480, 430], [486, 352], [497, 322], [514, 318], [520, 384], [516, 470], [524, 580]]), 'shadow');
R('mid-ridge', band([[280, 548], [370, 520], [440, 540], [500, 524], [560, 544], [620, 526], [690, 540], [780, 508]], H), 'stone');
R('valley-slopes', poly([[280, 566], [380, 580], [450, 614], [520, 668], [546, 692], [576, 664], [630, 616], [690, 570], [780, 530], [780, H], [280, H]]), 'spruce');

// ---------- the great cliff on the left ----------
const capTop: Pt[] = [[0, 160], [70, 140], [150, 150], [230, 178], [285, 215]];
const capY = xAtYInv(capTop);
function xAtYInv(pts: Pt[]) {
  return (x: number) => {
    for (let i = 1; i < pts.length; i++) if (x <= pts[i][0]) { const a = pts[i - 1], b = pts[i]; return a[1] + ((b[1] - a[1]) * (x - a[0])) / (b[0] - a[0]); }
    return pts[pts.length - 1][1];
  };
}
R('cliff-pines', treeline(0, 264, (x) => capY(x) - 12, 24, 24, 400, 1), 'forest');
R('cliff', poly([...capTop, [312, 300], [326, 420], [342, 540], [362, 650], [386, 740], [400, 800], [0, 800]]), 'granite');
R('cliff-side', poly([[0, 160], [70, 140], [122, 146], [100, 300], [114, 470], [92, 640], [110, 800], [0, 800]]), 'stone');
R('cliff-stain', poly([[188, 164], [232, 180], [222, 330], [238, 470], [214, 600], [198, 430], [206, 300]]), 'stone');
R('cliff-nose', poly([[285, 215], [312, 300], [326, 420], [342, 540], [362, 650], [336, 660], [312, 540], [296, 420], [286, 310], [266, 236]]), 'shadow');
R('cliff-ledge', poly([[130, 520], [190, 540], [206, 640], [188, 760], [140, 770], [150, 650]]), 'shadow');

// ---------- cathedral rocks and the waterfall on the right ----------
R('rocks', poly([[W, 225], [950, 212], [915, 250], [885, 238], [855, 290], [822, 322], [792, 350], [762, 330], [735, 296], [708, 340], [690, 430], [672, 560], [652, 680], [630, 800], [W, 800]]), 'stone');
R('rocks-light-1', poly([[735, 296], [708, 340], [690, 430], [672, 560], [652, 680], [690, 690], [712, 560], [728, 440], [744, 360], [754, 322]]), 'granite');
R('rocks-light-2', poly([[915, 250], [885, 238], [855, 290], [846, 420], [884, 440], [896, 310]]), 'granite');
R('rocks-light-3', poly([[W, 225], [950, 212], [930, 236], [942, 330], [W, 344]]), 'granite');
R('fall-alcove', poly([[762, 330], [792, 350], [822, 322], [840, 420], [848, 560], [854, 740], [752, 740], [762, 560], [768, 430]]), 'shadow');
R('rocks-gully', poly([[906, 470], [944, 482], [958, 600], [948, 740], [908, 740], [918, 600]]), 'shadow');
R('fall-veil', ribbon([[806, 352], [812, 450], [818, 560], [826, 650], [832, 736]], [8, 10, 13, 17, 22]), 'riverLight');
R('fall', ribbon([[793, 350], [797, 450], [801, 560], [805, 650], [808, 736]], [7, 9, 12, 16, 21]), 'white');

// ---------- valley floor ----------
R('forest', treeline(0, W, (x) => 762 + 12 * Math.sin(x / 90), 26, 36, H, 0.4), 'forest');
R('mist', blob([[730, 748], [752, 716], [790, 706], [832, 708], [868, 722], [888, 750], [850, 768], [770, 770]], 0.9), 'sky');

const riverSpine: Pt[] = [[548, 818], [515, 842], [455, 870], [440, 908], [505, 952], [590, 996], [615, 1052], [560, 1112], [490, 1176], [470, 1250]];
const riverX = xAtY(riverSpine);
R('far-bank-left', bank('l', (x) => 812 + 5 * Math.sin(x / 110), riverX, W, H), 'moss');
R('far-bank-right', bank('r', (x) => 812 + 5 * Math.sin(x / 110), riverX, W, H), 'moss');
R('meadow-left', bank('l', (x) => 856 + 8 * Math.sin(x / 120 + 1), riverX, W, H), 'meadow');
R('meadow-right', bank('r', (x) => 850 + 8 * Math.sin(x / 100 + 2), riverX, W, H), 'meadow');

// pines along the edge of the meadow
for (const [i, x, base, h, w] of [[1, 232, 850, 150, 62], [2, 306, 846, 118, 54], [3, 372, 850, 136, 58], [4, 668, 846, 140, 60], [5, 742, 850, 104, 50]] as const) {
  R(`valley-pine-${i}`, pine(x, base, h, w, 4), 'pine');
}

R('grass-gold-left', blob([[150, 940], [230, 918], [330, 926], [384, 948], [330, 972], [220, 976]], 0.9), 'gold');
R('grass-gold-right', blob([[660, 930], [740, 912], [850, 920], [900, 944], [840, 966], [720, 964]], 0.9), 'gold');
R('grass-moss-left', blob([[230, 1050], [300, 1024], [390, 1034], [430, 1064], [380, 1092], [280, 1090]], 0.9), 'moss');
R('grass-moss-right', blob([[700, 1050], [770, 1030], [850, 1040], [880, 1068], [820, 1090], [730, 1084]], 0.9), 'moss');

R('river', ribbon(riverSpine, [6, 9, 13, 18, 25, 33, 44, 58, 74, 88]), 'river');
R('ripple-1', lens(470, 892, 44, 9, -50), 'riverLight');
R('ripple-2', lens(548, 972, 78, 11, 28), 'riverLight');
R('ripple-3', lens(596, 1068, 82, 13, -55), 'riverLight');
R('ripple-4', lens(530, 1150, 110, 14, -40), 'riverLight');
R('ripple-5', lens(440, 1214, 90, 13, -8), 'riverLight');
R('river-rock-1', boulder(540, 1232, 76, 44), 'stone');
R('river-rock-2', boulder(602, 1128, 50, 30), 'shadow');
R('bank-rock-1', boulder(660, 1206, 96, 54), 'shadow');
R('bank-rock-2', boulder(352, 1176, 70, 40), 'stone');

// wildflowers and grasses
for (const [i, x, y] of [[1, 300, 1146], [2, 262, 1196], [3, 330, 1218], [4, 720, 1150], [5, 762, 1196], [6, 700, 1228]] as const) {
  R(`poppy-${i}`, circle(x, y, 12), 'poppy');
}
R('grass-tuft-1', tuft(416, 1140, 64, 60, 5, -0.1), 'pine');
R('grass-tuft-2', tuft(640, 1050, 56, 50, 5, 0.1), 'pine');
R('grass-tuft-3', tuft(290, 1010, 56, 46, 5), 'gold');
R('grass-tuft-4', tuft(800, 1010, 56, 46, 5), 'pine');

// ---------- framing pines ----------
R('big-pine-left-trunk', rect(88, 1150, 40, 100), 'bark');
pineTiers(108, 1200, 640, 330, 6, [W, H]).forEach((d, i) => R(`big-pine-left-${6 - i}`, d, i % 2 ? 'pine' : 'forest'));
R('big-pine-right-trunk', rect(902, 1160, 36, 90), 'bark');
pineTiers(920, 1206, 560, 290, 5, [W, H]).forEach((d, i) => R(`big-pine-right-${5 - i}`, d, i % 2 ? 'pine' : 'forest'));

// ---------- line work ----------
{
  detail.push(stroke(
    line([[150, 190], [146, 300], [156, 420]]) + line([[250, 230], [262, 360], [270, 500]]) + line([[60, 220], [56, 360]]) +
    line([[560, 330], [572, 420], [570, 520]]) + line([[610, 372], [626, 470]]) +
    line([[870, 300], [866, 420]]) + line([[968, 360], [974, 520]]) + line([[720, 420], [708, 560]]),
    '#6d6a78', 2, { opacity: 0.35 }));
  // spray lines in the waterfall
  detail.push(stroke(line([[795, 380], [798, 470]]) + line([[800, 520], [804, 640]]) + line([[812, 600], [816, 716]]), '#9cc9dc', 2, { opacity: 0.8 }));
  // flower centres
  let dots = '';
  for (const [x, y] of [[300, 1146], [262, 1196], [330, 1218], [720, 1150], [762, 1196], [700, 1228]]) dots += circleDot(x, y);
  detail.push(stroke(dots, '#7a3b1c', 3));
  const bird = (x: number, y: number, s: number) => curve([[x - s, y - s * 0.3], [x - s * 0.5, y - s * 0.6], [x, y]], 0.8) + curve([[x, y], [x + s * 0.5, y - s * 0.6], [x + s, y - s * 0.3]], 0.8);
  detail.push(stroke(bird(330, 300, 12) + bird(366, 282, 9) + bird(410, 318, 8), '#4a5568', 2));
}
function circleDot(x: number, y: number) { return line([[x - 1.5, y], [x + 1.5, y]]); }
void ellipse; void ridge;

const activity: PaintActivity = {
  id: 'parks-paint-1', version: 1, mode: 'paint', title: 'Waterfall Valley',
  blurb: 'A ribbon of white water drops from granite cliffs into a valley of pines, with a great stone dome watching over the meadow and its winding river.',
  collectionId: 'parks', categories: ["Nature", "Travel"], difficulty: 'Moderate',
  added: '2026-11-26',
  width: W, height: H, palette, regions, detail,
};
export default activity;
