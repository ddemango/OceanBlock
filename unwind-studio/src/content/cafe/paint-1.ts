import { rect, ellipse, circle, poly, line, curve, blob, leaf, xf, stroke } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { PaintActivity, PaletteColor } from '../types';
import { collector, vessel, halfLeaf, mugHandle, steam, heart, M, L, C, type Pt } from './props-paint';

const W = 1000, H = 1250;

const palette: PaletteColor[] = [
  { id: 'wall', number: 1, name: 'Oat wall', hex: '#f3e3c8' },
  { id: 'cream', number: 2, name: 'Warm white', hex: '#fffaf0' },
  { id: 'night', number: 3, name: 'Evening blue', hex: '#3d5583' },
  { id: 'dusk', number: 4, name: 'Rainy sky', hex: '#9fb3d3' },
  { id: 'slate', number: 5, name: 'Slate roofs', hex: '#687a9c' },
  { id: 'ink', number: 6, name: 'Night navy', hex: '#2b3753' },
  { id: 'lamp', number: 7, name: 'Lamplight', hex: '#f8d46c' },
  { id: 'rose', number: 8, name: 'Terracotta', hex: '#cc7353' },
  { id: 'roseD', number: 9, name: 'Clay shadow', hex: '#984a36' },
  { id: 'teal', number: 10, name: 'Teal glaze', hex: '#468a87' },
  { id: 'mustard', number: 11, name: 'Mustard', hex: '#dea23a' },
  { id: 'woodL', number: 12, name: 'Honey sill', hex: '#d39a5e' },
  { id: 'woodD', number: 13, name: 'Walnut', hex: '#85573a' },
  { id: 'cookie', number: 14, name: 'Biscuit', hex: '#ecc68c' },
  { id: 'coffee', number: 15, name: 'Coffee', hex: '#5e3a2a' },
  { id: 'leafL', number: 16, name: 'Leaf green', hex: '#8fba6c' },
  { id: 'leafD', number: 17, name: 'Deep leaf', hex: '#4c7744' },
  { id: 'sage', number: 18, name: 'Sage', hex: '#b9cba6' },
];

const { regions, R } = collector();
const detail: Shape[] = [];

// ---------- wall ----------
R('wall', rect(0, 0, W, H), 'wall');

// ---------- window: rainy evening rooftops ----------
R('window-frame', rect(110, 66, 780, 776, 6), 'cream');
R('sky', rect(150, 104, 700, 718), 'night');
R('sky-glow', rect(150, 470, 700, 352), 'dusk');
R('cloud-1', blob([[190, 250], [250, 210], [330, 214], [390, 196], [460, 226], [450, 262], [330, 270], [220, 272]], 0.8), 'slate');
R('cloud-2', blob([[560, 170], [630, 140], [720, 150], [800, 140], [838, 172], [790, 196], [650, 198]], 0.8), 'slate');

// back row of rooftops
R('roof-back-1', poly([[150, 560], [250, 560], [250, 530], [276, 530], [276, 560], [300, 560], [300, 822], [150, 822]]), 'slate');
R('roof-back-2', poly([[286, 548], [362, 478], [438, 548], [438, 822], [286, 822]]), 'slate');
R('roof-back-3', poly([[540, 520], [720, 520], [720, 822], [540, 822]]), 'slate');
R('tower-legs', poly([[592, 520], [600, 470], [664, 470], [672, 520]]), 'ink');
R('tower-tank', rect(588, 404, 88, 70, 8), 'woodD');
R('tower-roof', poly([[580, 410], [632, 362], [684, 410]]), 'ink');
R('roof-back-4', poly([[706, 580], [850, 580], [850, 822], [706, 822]]), 'slate');

// front row
R('house-1', poly([[150, 640], [262, 640], [262, 822], [150, 822]]), 'woodD');
R('house-2', poly([[248, 620], [268, 600], [452, 600], [472, 620], [472, 822], [248, 822]]), 'ink');
R('house-3', poly([[452, 662], [604, 662], [604, 822], [452, 822]]), 'woodD');
R('house-4', poly([[590, 626], [676, 566], [762, 626], [762, 822], [590, 822]]), 'ink');
R('house-5', poly([[748, 650], [850, 650], [850, 822], [748, 822]]), 'woodD');
const lit: [number, number, number, number][] = [
  [352, 636, 34, 42],
  [290, 636, 34, 42], [414, 636, 34, 42], [352, 712, 34, 42],
  [622, 646, 30, 40], [700, 646, 30, 40], [700, 720, 30, 40],
  [770, 676, 30, 38], [812, 742, 30, 38],
];
lit.forEach(([x, y, w, h], i) => R(`window-lit-${i + 1}`, rect(x, y, w, h, 3), 'lamp'));

// glazing bars
R('bar-v', rect(489, 104, 22, 718), 'cream', [500, 420]);
R('bar-h', rect(150, 330, 700, 20), 'cream', [700, 340]);

// ---------- curtain rod and curtains ----------
function curtain(id: string, flip: boolean) {
  const t = flip ? { sx: -1, ox: 500 } : {};
  R(`${id}`, xf(M(0, 44) + L(246, 44) + C(236, 260, 156, 480, 132, 590) + C(156, 724, 226, 868, 232, 1000) + L(0, 1000) + 'Z', t), 'rose');
  R(`${id}-fold`, xf(M(110, 44) + L(156, 44) + C(146, 262, 98, 470, 88, 590) + C(98, 708, 136, 866, 142, 1000) + L(96, 1000) + C(88, 866, 58, 708, 64, 590) + C(70, 470, 102, 262, 110, 44) + 'Z', t), 'roseD');
  R(`${id}-tie`, xf(M(0, 572) + C(60, 562, 120, 562, 150, 572) + L(150, 606) + C(120, 598, 60, 598, 0, 608) + 'Z', t), 'mustard');
}
curtain('curtain-left', false);
curtain('curtain-right', true);
R('rod', rect(0, 26, W, 22, 6), 'woodD', [500, 37]);
R('rod-end-left', circle(26, 37, 22), 'mustard');
R('rod-end-right', circle(974, 37, 22), 'mustard');

// ---------- the sill ----------
R('sill-top', poly([[60, 836], [940, 836], [1000, 1000], [0, 1000]]), 'woodL');
R('sill-front', rect(0, 1000, W, 58), 'woodD', [500, 1029]);
R('sill-shadow', rect(0, 1058, W, 22), 'roseD', [500, 1069]);

// radiator below
R('radiator', rect(130, 1104, 740, 146, 10), 'sage');
for (let i = 0; i < 7; i++) R(`radiator-fin-${i + 1}`, rect(148 + i * 103, 1122, 82, 128, 30), 'cream');

// ---------- the plant ----------
const leaves: [number, number, number][] = [
  [-152, 170, 42], [-126, 214, 46], [-100, 240, 48], [-74, 216, 46], [-50, 186, 42], [-28, 150, 38],
];
leaves.forEach(([rot, len, wid], i) => {
  R(`leaf-${i + 1}`, leaf(196, 872, len, wid, rot), 'leafD');
  R(`leaf-${i + 1}-light`, halfLeaf(196, 872, len, wid, rot, i % 2 === 0), 'leafL');
});
const pot = vessel(196, [[860, 82], [904, 74], [996, 58]], 0.18);
R('pot', pot.body(), 'cream');
R('pot-band', pot.band(924, 950), 'rose');
R('pot-rim', pot.band(860, 890, 0), 'sage');
R('pot-soil', pot.opening(4), 'coffee');
R('trail-leaf-1', leaf(262, 900, 130, 28, 62), 'leafD');
R('trail-leaf-2', leaf(226, 960, 104, 24, 96), 'leafL');

// ---------- the mugs ----------
function mug(id: string, cx: number, top: number, bot: number, hw: number, body: string, bandCol: string) {
  const m = vessel(cx, [[top, hw], [bot, hw - 4]], 0.27);
  R(`${id}-handle`, mugHandle(cx + hw, top + 34, top + (bot - top) * 0.78, 70, 26), body);
  R(`${id}`, m.body(), body);
  R(`${id}-band`, m.band(top + (bot - top) * 0.52, top + (bot - top) * 0.52 + 26), bandCol);
  R(`${id}-glint`, leaf(cx - hw + 24, top + 34, 74, 12, 90), 'cream');
  R(`${id}-rim`, m.opening(), body === 'teal' ? 'sage' : 'cookie');
  R(`${id}-coffee`, m.opening(15, 5), 'coffee');
  return m;
}
R('steam-1', steam(386, 812, 230, 22, 32, 0), 'cream');
R('steam-2', steam(426, 800, 180, 18, 26, 2.4), 'cream');
R('steam-3', steam(606, 786, 220, 20, 30, 1.2), 'cream');
R('steam-4', steam(644, 776, 160, 16, 24, 3.4), 'cream');
mug('mug-back', 625, 784, 946, 70, 'mustard', 'rose');
mug('mug-front', 400, 808, 990, 80, 'teal', 'cream');
R('mug-front-heart', heart(400, 916, 40), 'rose');

// ---------- plate of cookies ----------
R('plate', ellipse(836, 962, 126, 38), 'cream');
R('plate-well', ellipse(836, 960, 88, 24), 'sage');
function cookieSide(id: string, cx: number, top: number, rx: number) {
  R(id, vessel(cx, [[top, rx], [top + 16, rx]], 0.32).body(), 'woodL');
}
cookieSide('cookie-stack-1', 836, 940, 56);
cookieSide('cookie-stack-2', 834, 920, 56);
cookieSide('cookie-stack-3', 837, 900, 56);
R('cookie-stack-top', ellipse(838, 900, 56, 18), 'cookie');
R('cookie-left', ellipse(762, 970, 44, 15, -4), 'cookie');
R('cookie-right', ellipse(912, 968, 42, 14, 6), 'cookie');
const chips: Pt[] = [[816, 896], [846, 892], [862, 906], [826, 908], [752, 968], [776, 974], [904, 964], [924, 970]];
chips.forEach(([x, y], i) => R(`chip-${i + 1}`, ellipse(x, y, 8, 5.5), 'coffee'));

// ---------- line work ----------
// rain on the glass
{
  let d = '';
  const drops: Pt[] = [[180, 140], [260, 300], [330, 150], [420, 380], [210, 430], [560, 140], [640, 300], [740, 250], [810, 460], [700, 430], [580, 380], [450, 120], [300, 520], [780, 120], [240, 600], [540, 590]];
  for (const [x, y] of drops) d += line([[x, y], [x - 10, y + 34]]);
  detail.push(stroke(d, '#dbe5f4', 1.6, { opacity: 0.7 }));
  let e = '';
  for (const [x, y] of [[230, 190], [380, 260], [610, 210], [760, 330], [470, 470], [820, 210]] as Pt[]) e += circle(x, y, 2.4);
  detail.push(stroke(e, '#ffffff', 1.4, { opacity: 0.8 }));
}
// window panes in the lit windows
{
  let d = '';
  for (const [x, y, w, h] of lit) if (w > 24) d += line([[x + w / 2, y + 2], [x + w / 2, y + h - 2]]);
  detail.push(stroke(d, '#c99a3c', 1.4));
}
// leaf veins
{
  const rib = (x: number, y: number, len: number, rot: number) => xf(curve([[8, 0], [len * 0.5, -2], [len * 0.9, 0]]), { rot, x, y });
  let d = '';
  for (const [rot, len] of leaves) d += rib(196, 872, len, rot);
  d += rib(262, 900, 130, 62) + rib(226, 960, 104, 96);
  detail.push(stroke(d, '#d9ebc4', 1.5, { opacity: 0.8 }));
}
// sill grain
detail.push(stroke(curve([[300, 856], [340, 858], [380, 856]]) + curve([[490, 976], [520, 978], [550, 976]]) + curve([[700, 870], [750, 872], [800, 870]]) + curve([[40, 980], [70, 982], [100, 980]]) + curve([[880, 1006], [930, 1008]]), '#b47a44', 1.5));
// curtain gathers
detail.push(stroke(curve([[34, 612], [42, 720], [44, 830]]) + curve([[966, 612], [958, 720], [956, 830]]) + curve([[150, 300], [170, 180], [190, 50]]) + curve([[850, 300], [830, 180], [810, 50]]), '#a85a40', 1.4, { opacity: 0.7 }));

const activity: PaintActivity = {
  id: 'cafe-paint-1', version: 1, mode: 'paint', title: 'Two Mugs by the Window',
  blurb: 'Two steaming mugs and a plate of chocolate-chip cookies on a honey-wood windowsill, with rain falling over the lit-up rooftops outside.',
  collectionId: 'cafe', categories: ["Friends", "Cozy"], difficulty: 'Moderate',
  width: W, height: H, palette, regions, detail,
};
export default activity;
