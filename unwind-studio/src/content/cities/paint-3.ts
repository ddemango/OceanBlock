import { rect, ellipse, circle, poly, line, blob, stroke, rng } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { PaintActivity, PaletteColor } from '../types';
import { collector, reflection, umbrella, umbrellaPanel, coat, M, L, Q } from './props-paint';

const W = 1000, H = 1250;

const palette: PaletteColor[] = [
  { id: 'sky', number: 1, name: 'Rainy sky', hex: '#a9b8c9' },
  { id: 'cloud', number: 2, name: 'Rain cloud', hex: '#cdd6e0' },
  { id: 'stone', number: 3, name: 'Portland stone', hex: '#dacbb0' },
  { id: 'brick', number: 4, name: 'London brick', hex: '#ad7a62' },
  { id: 'slate', number: 5, name: 'Wet slate', hex: '#535c6b' },
  { id: 'amber', number: 6, name: 'Lamplight', hex: '#f4bf55' },
  { id: 'red', number: 7, name: 'Pillar-box red', hex: '#d13f35' },
  { id: 'darkRed', number: 8, name: 'Shadow red', hex: '#8e2b2b' },
  { id: 'glass', number: 9, name: 'Rainy glass', hex: '#3f5169' },
  { id: 'cream', number: 10, name: 'Cream', hex: '#f4ead3' },
  { id: 'road', number: 11, name: 'Wet road', hex: '#6d7484' },
  { id: 'pavement', number: 12, name: 'Pavement', hex: '#9ca3af' },
  { id: 'teal', number: 13, name: 'Raincoat teal', hex: '#3e8a86' },
  { id: 'skin', number: 14, name: 'Warm skin', hex: '#e6b691' },
];

const { regions, R } = collector();
const detail: Shape[] = [];

// ---------- sky ----------
R('sky', rect(0, 0, W, 820), 'sky');
R('cloud-1', blob([[20, 116], [70, 72], [160, 80], [240, 50], [330, 90], [300, 140], [140, 150], [30, 148]], 0.8), 'cloud');
R('cloud-2', blob([[700, 60], [770, 30], [880, 40], [960, 70], [930, 110], [760, 112]], 0.9), 'cloud');
R('cloud-3', blob([[380, 210], [450, 180], [540, 188], [520, 232], [410, 238]], 0.9), 'cloud');

// ---------- the clock tower beyond the rooftops ----------
const TX = 610;
R('tower-spire', poly([[TX - 40, 172], [TX + 40, 172], [TX + 14, 70], [TX, 22], [TX - 14, 70]]), 'slate');
R('tower-belfry', rect(TX - 46, 170, 92, 64, 2), 'stone');
R('tower-clock-block', rect(TX - 54, 234, 108, 120, 2), 'stone');
R('tower-clock-face', circle(TX, 294, 40), 'cream');
R('tower-shaft', rect(TX - 46, 354, 92, 400), 'stone');
{
  let d = line([[TX, 294], [TX, 266]]) + line([[TX, 294], [TX + 20, 304]]);
  detail.push(stroke(d, '#535c6b', 3.5));
  let t = '';
  for (let k = 0; k < 12; k++) {
    const a = (k * 30 * Math.PI) / 180;
    t += line([[TX + Math.cos(a) * 33, 294 + Math.sin(a) * 33], [TX + Math.cos(a) * 37, 294 + Math.sin(a) * 37]]);
  }
  detail.push(stroke(t + circle(TX, 294, 40), '#8b7d63', 1.6));
  // gothic panels on the shaft and belfry arches
  let g = '';
  for (const x of [TX - 30, TX - 10, TX + 10, TX + 30]) g += line([[x, 366], [x, 412]]);
  for (const x of [TX - 26, TX, TX + 26]) g += line([[x - 8, 228], [x - 8, 196]]) + `M${x - 8} 196Q${x} 180 ${x + 8} 196` + line([[x + 8, 196], [x + 8, 228]]);
  g += line([[TX - 54, 252], [TX + 54, 252]]);
  detail.push(stroke(g, '#a8987a', 1.6));
}

// ---------- terraces ----------
R('building-1', rect(0, 210, 330, 600), 'stone');
R('building-1-roof', rect(0, 190, 330, 28), 'slate');
R('building-2', rect(330, 300, 220, 510), 'brick');
R('building-2-roof', poly([[322, 304], [558, 304], [530, 270], [350, 270]]), 'slate');
R('building-3', rect(680, 250, 320, 560), 'stone');
R('building-3-roof', rect(680, 230, 320, 28), 'slate');
const win = (id: string, x: number, y: number, c: string) => R(id, M(x, y + 84) + L(x, y + 20) + Q(x, y, x + 25, y) + Q(x + 50, y, x + 50, y + 20) + L(x + 50, y + 84) + 'Z', c);
win('window-1', 60, 260, 'amber');
win('window-2', 200, 260, 'glass');
win('window-3', 400, 340, 'glass');
win('window-4', 740, 300, 'amber');
win('window-5', 880, 300, 'glass');
R('shop-window', rect(920, 590, 80, 190, 4), 'amber');
R('shop-awning', poly([[910, 560], [1000, 560], [1000, 598], [900, 598]]), 'teal');

// ---------- street ----------
R('back-pavement', rect(0, 800, W, 80), 'pavement');
R('road', rect(0, 884, W, 220), 'road');
R('kerb', rect(0, 872, W, 14), 'cream', [760, 879]);
R('near-pavement', rect(0, 1100, W, 150), 'pavement');
R('bus-reflection', blob([[100, 930], [300, 940], [500, 928], [690, 938], [660, 990], [520, 1010], [380, 996], [220, 1016], [120, 990]], 0.8), 'darkRed');
R('phone-reflection', reflection(845, 888, 1040, 96, 5), 'red');
R('lamp-reflection', reflection(42, 888, 1010, 40, 4), 'amber');
R('puddle-1', ellipse(470, 1180, 100, 20), 'sky');
R('puddle-2', ellipse(930, 1210, 60, 14), 'sky');

// ---------- street lamp ----------
R('lamp-post', rect(36, 360, 12, 512, 3), 'slate', [42, 600]);
R('lamp-glass', poly([[18, 300], [66, 300], [58, 360], [26, 360]]), 'amber');
R('lamp-cap', poly([[8, 304], [76, 304], [42, 268]]), 'slate');

// ---------- the double-decker ----------
R('bus-body', rect(90, 420, 600, 460, 34), 'red');
for (let k = 0; k < 4; k++) R(`bus-upper-window-${k + 1}`, rect(120 + k * 134, 452, 116, 106, 10), 'glass');
R('bus-windscreen-upper', rect(646, 452, 34, 106, 8), 'glass');
R('bus-stripe', rect(90, 586, 600, 28), 'cream', [380, 600]);
for (let k = 0; k < 3; k++) R(`bus-lower-window-${k + 1}`, rect(200 + k * 134, 640, 116, 112, 10), 'glass');
R('bus-door', rect(612, 640, 64, 200, 6), 'glass');
R('bus-rear-window', rect(104, 640, 76, 112, 10), 'glass');
R('bus-destination', rect(476, 426, 200, 22, 8), 'amber', [576, 437]);
R('bus-skirt', rect(90, 830, 600, 54, 22), 'darkRed');
R('bus-headlight', circle(670, 806, 15), 'amber');
for (const [id, x] of [['rear', 220], ['front', 548]] as [string, number][]) {
  R(`bus-wheel-${id}`, circle(x, 884, 46), 'slate');
  R(`bus-hub-${id}`, circle(x, 884, 18), 'pavement');
}
detail.push(stroke(line([[644, 640], [644, 840]]), '#8e2b2b', 3));
detail.push(stroke(line([[110, 868], [670, 868]]), '#6e1f1f', 1.5));
detail.push(stroke(line([[120, 505], [650, 505]]) + line([[200, 696], [580, 696]]), '#c9d4e2', 1.2, { opacity: 0.6 }));

// ---------- the phone box ----------
R('phone-crown', M(790, 504) + Q(845, 438, 900, 504) + 'Z', 'red');
R('phone-sign', rect(796, 504, 98, 26, 3), 'cream');
R('phone-body', rect(796, 530, 98, 310), 'red');
R('phone-glass', rect(812, 560, 66, 240, 2), 'glass');
R('phone-base', rect(786, 838, 118, 20, 3), 'darkRed');
{
  let g = '';
  for (const x of [834, 856]) g += line([[x, 560], [x, 800]]);
  for (let y = 600; y < 800; y += 40) g += line([[812, y], [878, y]]);
  detail.push(stroke(g, '#d13f35', 4));
  detail.push(stroke(line([[812, 517], [878, 517]]), '#535c6b', 2));
}

// ---------- people under umbrellas ----------
// by the phone box
R('person-a-coat', coat(952, 660, 852, 44), 'slate');
R('person-a-head', circle(952, 650, 15), 'skin');
R('person-a-umbrella', umbrella(950, 630, 52), 'teal');
// foreground, a big yellow umbrella
R('person-b-coat', coat(240, 1108, 1250, 132), 'teal');
R('person-b-head', ellipse(240, 1086, 26, 28), 'skin');
R('person-b-umbrella', umbrella(236, 1056, 136, -6), 'amber');
// foreground right, a striped umbrella
R('person-c-coat', coat(760, 1132, 1250, 118), 'brick');
R('person-c-head', ellipse(760, 1110, 24, 26), 'skin');
for (let k = 0; k < 4; k++) R(`person-c-umbrella-${k + 1}`, umbrellaPanel(764, 1084, 118, k / 4, (k + 1) / 4, 4), k % 2 ? 'cream' : 'red');
detail.push(stroke(line([[236, 1056], [240, 1132]]) + line([[764, 1084], [762, 1150]]) + line([[950, 630], [952, 676]]), '#3a3a44', 3));
detail.push(stroke(line([[234, 960], [233, 942]]) + line([[766, 1001], [767, 985]]), '#3a3a44', 3));

// ---------- rain ----------
{
  const r = rng(4410);
  let d = '';
  for (let i = 0; i < 150; i++) {
    const x = r.range(0, W), y = r.range(0, 1240), len = r.range(16, 30);
    d += line([[x, y], [x - len * 0.25, y + len]]);
  }
  detail.push(stroke(d, '#eef3f8', 1.4, { opacity: 0.65 }));
  let ripple = '';
  for (const [x, y, w] of [[440, 1180, 30], [500, 1186, 22], [920, 1210, 20], [300, 960, 24], [820, 1020, 26]] as [number, number, number][]) ripple += ellipse(x, y, w, w * 0.22);
  detail.push(stroke(ripple, '#dfe6ee', 1.4));
}

const a: PaintActivity = {
  id: 'cities-paint-3', version: 1, mode: 'paint', title: 'Red Bus in the Rain',
  blurb: 'A red double-decker splashes past a phone box on a rainy London street, with the great clock tower rising above the rooftops.',
  collectionId: 'cities', categories: ["Cities"], difficulty: 'Relaxed',
  width: W, height: H, palette, regions, detail,
};
export default a;
