import { rect, ellipse, circle, poly, blob, curve, line } from '../../art/kit';
import type { PaintActivity, PaletteColor } from '../types';
import { canvas, sample, below, ribbon, cloud, puff, foamCap, gull, M, L, Q, type Pt } from './props-paint';

const W = 1000, H = 1250, HOR = 700;

const palette: PaletteColor[] = [
  { id: 'skyD', number: 1, name: 'Storm blue', hex: '#4f6381' },
  { id: 'skyM', number: 2, name: 'Rain grey', hex: '#8fa6bb' },
  { id: 'skyL', number: 3, name: 'Clearing light', hex: '#f4e1ba' },
  { id: 'cloudD', number: 4, name: 'Thunderhead', hex: '#5d6076' },
  { id: 'cloudM', number: 5, name: 'Cloud shadow', hex: '#a9adbe' },
  { id: 'white', number: 6, name: 'Whitewash', hex: '#f8f4ea' },
  { id: 'beam', number: 7, name: 'Lamp light', hex: '#f9e79a' },
  { id: 'red', number: 8, name: 'Signal red', hex: '#d04c3d' },
  { id: 'redD', number: 9, name: 'Brick shadow', hex: '#9b3531' },
  { id: 'seaL', number: 10, name: 'Sea spray', hex: '#8cc0bd' },
  { id: 'seaM', number: 11, name: 'Rolling teal', hex: '#3f8791' },
  { id: 'seaD', number: 12, name: 'Deep swell', hex: '#27586c' },
  { id: 'grass', number: 13, name: 'Clifftop grass', hex: '#86aa5c' },
  { id: 'grassD', number: 14, name: 'Gorse green', hex: '#547a45' },
  { id: 'rockL', number: 15, name: 'Sandstone', hex: '#bca188' },
  { id: 'rockM', number: 16, name: 'Cliff brown', hex: '#8b7260' },
  { id: 'rockD', number: 17, name: 'Wet rock', hex: '#54463f' },
];

const { regions, detail, R, D } = canvas();
const CX = 650; // lighthouse centre line

// ---------------------------------------------------------------- sky, lamp beams, clouds
R('sky-storm', rect(0, 0, W, HOR + 4), 'skyD');
R('sky-rain', below(sample([[0, 350], [240, 322], [500, 356], [760, 326], [1000, 344]]), HOR + 4), 'skyM');
R('sky-clearing', below(sample([[0, 584], [260, 566], [520, 590], [780, 568], [1000, 580]]), HOR + 4), 'skyL');
R('beam-left', poly([[CX, 284], [0, 186], [0, 284], [CX, 300]]), 'beam');
R('beam-right', poly([[CX, 284], [W, 216], [W, 292], [CX, 300]]), 'beam');
function stormCloud(id: string, cx: number, base: number, w: number, h: number, k: number, ph: number) {
  R(`${id}-top`, cloud(cx, base, w, h, k, ph), 'white');
  R(`${id}-mid`, cloud(cx + w * 0.05, base, w * 0.88, h * 0.62, k, ph + 0.9), 'cloudM');
  R(`${id}-base`, cloud(cx - w * 0.03, base, w * 0.74, h * 0.3, k - 1, ph + 2), 'cloudD');
}
stormCloud('cloud-crown', 200, 138, 340, 96, 5, 0.3);
stormCloud('cloud-high', 850, 160, 280, 84, 4, 1.1);
stormCloud('cloud-left', 262, 560, 500, 210, 6, 0.5);
stormCloud('cloud-right', 842, 548, 300, 170, 4, 1.4);

// ---------------------------------------------------------------- the sea
R('far-headland', below(sample([[0, 668], [70, 662], [150, 678], [230, HOR]]), HOR + 4), 'cloudD');
R('sea-far', rect(0, HOR, W, H - HOR), 'seaL');
R('sea-mid', below(sample([[0, 774], [130, 762], [300, 778], [480, 764], [700, 776], [1000, 766]]), H), 'seaM');
R('sea-near', below(sample([[0, 968], [160, 950], [340, 974], [520, 956], [760, 972], [1000, 958]]), H), 'seaD');
R('whitecap-1', ellipse(92, 742, 46, 8), 'white');
R('whitecap-2', ellipse(56, 802, 40, 8), 'white');
R('whitecap-3', ellipse(60, 846, 52, 9), 'seaL');
R('whitecap-4', ellipse(120, 918, 40, 8), 'seaL');

// ---------------------------------------------------------------- the headland
const BACK = sample([[286, 806], [330, 764], [400, 744], [520, 734], [700, 726], [850, 712], [1000, 704]], 6);
const EDGE = sample([[286, 806], [380, 810], [520, 826], [680, 816], [840, 804], [1000, 796]], 6);
const SHORE = sample([[232, 910], [330, 964], [460, 1008], [620, 1042], [800, 1062], [1000, 1054]], 6);
R('grass', poly([...BACK, [1000, 860], [286, 860]]), 'grass');
R('bush-1', cloud(350, 792, 60, 28, 3, 0.4), 'grassD');
R('bush-2', cloud(800, 786, 96, 34, 4, 1), 'grassD');
R('bush-3', cloud(930, 772, 76, 30, 3, 0.2), 'grassD');
R('tower-shadow', ellipse(748, 794, 76, 9), 'grassD');
R('path', ribbon([[450, 786], [500, 800], [570, 806], [640, 798]], 13, 13), 'rockL');
{
  const cuts = [0, 4, 8, 13, 17, 22, 26, 30], tones = ['rockM', 'rockL', 'rockD', 'rockM', 'rockL', 'rockD', 'rockM'];
  for (let j = 0; j < 7; j++) {
    const a = cuts[j], b = cuts[j + 1];
    const top = EDGE.slice(a, b + 1), bot = SHORE.slice(a, b + 1).reverse();
    const lean = j % 2 ? 14 : -10;
    const midR: Pt = [(top[top.length - 1][0] + bot[0][0]) / 2 + lean, (top[top.length - 1][1] + bot[0][1]) / 2];
    const midL: Pt = [(top[0][0] + bot[bot.length - 1][0]) / 2 + (j ? -lean : 0), (top[0][1] + bot[bot.length - 1][1]) / 2];
    R(`cliff-${j + 1}`, poly([...top, ...(j < 6 ? [midR] : []), ...bot, ...(j ? [midL] : [])]), tones[j]);
  }
}
R('ledge-1', poly([[420, 868], [486, 862], [500, 884], [440, 894]]), 'rockL');
R('ledge-2', poly([[700, 880], [770, 870], [790, 896], [716, 906]]), 'rockD');
R('ledge-3', poly([[880, 900], [950, 888], [968, 914], [900, 926]]), 'rockL');

// ---------------------------------------------------------------- the keeper's cottage
R('smoke-1', puff(410, 598, 26, 18, 5, 0.3), 'white');
R('smoke-2', puff(366, 566, 34, 22, 6, 1.2), 'white');
R('chimney', rect(424, 618, 28, 50), 'redD');
R('cottage-front', rect(382, 694, 140, 88), 'white');
R('cottage-gable', poly([[522, 782], [570, 782], [570, 694], [546, 636], [522, 694]]), 'cloudM');
R('cottage-roof', poly([[368, 696], [522, 696], [546, 636], [392, 636]]), 'red');
R('cottage-door', rect(440, 728, 28, 54, 3), 'seaD');
R('cottage-window-left', rect(394, 720, 30, 28), 'beam');
R('cottage-window-right', rect(482, 720, 30, 28), 'beam');
R('cottage-gable-window', circle(546, 690, 9), 'beam');
D(line([[409, 720], [409, 748]]) + line([[394, 734], [424, 734]]) + line([[497, 720], [497, 748]]) + line([[482, 734], [512, 734]]), '#6e5a4a', 1.6);
D(circle(461, 757, 1.6), '#f9e79a', 2);

// ---------------------------------------------------------------- the lighthouse
const TOP = 336, BASE = 776;
const hw = (y: number) => 38 + ((y - TOP) / (BASE - TOP)) * 24;
R('plinth', poly([[CX - 76, 796], [CX + 76, 796], [CX + 66, 766], [CX - 66, 766]]), 'rockL');
for (let i = 0; i < 6; i++) {
  const y1 = BASE - ((BASE - TOP) * i) / 6, y0 = BASE - ((BASE - TOP) * (i + 1)) / 6;
  const red = i % 2 === 0, k = 0.26;
  R(`tower-band-${i + 1}`, poly([[CX - hw(y0), y0], [CX + hw(y0) * k, y0], [CX + hw(y1) * k, y1], [CX - hw(y1), y1]]), red ? 'red' : 'white');
  R(`tower-band-${i + 1}-shade`, poly([[CX + hw(y0) * k, y0], [CX + hw(y0), y0], [CX + hw(y1), y1], [CX + hw(y1) * k, y1]]), red ? 'redD' : 'cloudM');
}
R('tower-door', M(CX - 18, BASE) + L(CX - 18, 724) + Q(CX - 18, 704, CX - 2, 704) + Q(CX + 14, 704, CX + 14, 724) + L(CX + 14, BASE) + 'Z', 'rockD');
R('tower-window-low', rect(CX - 26, 588, 17, 30, 8), 'cloudD');
R('tower-window-high', rect(CX - 20, 440, 16, 28, 8), 'cloudD');
R('lantern-roof', M(CX - 40, 262) + Q(CX - 30, 216, CX, 204) + Q(CX + 30, 216, CX + 40, 262) + 'Z', 'red');
R('lantern-eave', rect(CX - 46, 254, 92, 13, 4), 'redD');
R('lantern-pane-left', rect(CX - 33, 267, 22, 56), 'beam');
R('lantern-pane-mid', rect(CX - 11, 267, 22, 56), 'white');
R('lantern-pane-right', rect(CX + 11, 267, 22, 56), 'beam');
R('gallery', rect(CX - 60, 322, 120, 18, 4), 'rockD');
R('finial', circle(CX, 198, 8.5), 'rockD');
{
  let rail = line([[CX - 60, 298], [CX + 60, 298]]);
  for (let x = CX - 58; x <= CX + 58; x += 14.5) rail += line([[x, 298], [x, 322]]);
  D(rail, '#3d3530', 2.4);
  D(line([[CX, 190], [CX, 174]]), '#3d3530', 2.4);
  D(line([[CX - 2, 730], [CX - 2, 776]]), '#3a302b', 1.6);
}

// ---------------------------------------------------------------- surf against the rocks
R('wash', poly([...SHORE.map(([x, y]) => [x, y - 14] as Pt), [1000, 1110], ...sample([[860, 1112], [700, 1104], [540, 1086], [400, 1054], [280, 1010], [190, 950]], 6)]), 'seaL');
R('surf-1', puff(410, 996, 92, 40, 8, 0.4), 'white');
R('surf-2', puff(630, 1050, 104, 40, 9, 1.1), 'white');
R('surf-3', puff(880, 1066, 110, 42, 9, 0.2), 'white');
R('plume', cloud(226, 968, 230, 300, 5, 0.5), 'white');
R('plume-core', cloud(232, 968, 118, 176, 3, 1.3), 'seaL');
R('plume-base', puff(214, 968, 138, 34, 9, 0.7), 'white');
([[128, 676, 10], [236, 662, 9], [312, 706, 9], [96, 760, 9.5], [338, 648, 8], [160, 628, 8], [520, 944, 8.5], [760, 1000, 8.5]] as number[][]).forEach(([x, y, r], i) => {
  R(`spray-${i + 1}`, circle(x, y, r), 'white');
});

// ---------------------------------------------------------------- foreground waves and rocks
const WAVE1 = sample([[0, 1096], [110, 1058], [250, 1056], [390, 1100], [520, 1156], [640, 1196], [720, 1250]], 10);
const WAVE2 = sample([[430, 1250], [540, 1196], [680, 1150], [840, 1136], [1000, 1150]], 10);
R('wave-right', below(WAVE2, H), 'seaM');
R('wave-right-foam', foamCap(WAVE2.slice(10, 40), 26, 12, 6, 0.6), 'white');
R('wave-left', below(WAVE1, H), 'seaM');
R('wave-left-face', poly([...WAVE1.slice(3, 44).map(([x, y]) => [x, y + 16] as Pt), ...WAVE1.slice(3, 44).reverse().map(([x, y], i) => [x - 8, y + 16 + 44 * Math.sin((Math.PI * i) / 40) ** 0.7] as Pt).slice(1, -1)]), 'seaL');
R('wave-left-foam', foamCap(WAVE1.slice(1, 46), 30, 13, 8, 0.2), 'white');
R('rock-big', poly([[766, 1250], ...sample([[766, 1250], [778, 1186], [832, 1150], [910, 1160], [956, 1204], [1000, 1196]], 6), [1000, 1250]]), 'rockD');
R('rock-big-top', poly([[794, 1192], [836, 1160], [902, 1170], [884, 1198], [826, 1208]]), 'rockM');
R('rock-small', poly(sample([[600, 1250], [616, 1214], [662, 1200], [700, 1222], [712, 1250]], 6)), 'rockM');
R('rock-foam', puff(738, 1230, 40, 16, 6, 0.3), 'white');
D(curve([[60, 1180], [130, 1168], [200, 1182]]) + curve([[240, 1220], [320, 1208], [400, 1224]]) + curve([[30, 1228], [90, 1220], [150, 1230]]), '#cfe6e2', 2.2, 0.8);

// ---------------------------------------------------------------- gulls
R('gull-1', gull(470, 132, 50, -8), 'white');
R('gull-2', gull(560, 208, 40, 6), 'white');
R('gull-3', gull(800, 640, 42, -6), 'rockD');
R('gull-4', gull(896, 612, 36, 8), 'rockD');
R('gull-5', gull(100, 1010, 46, -10), 'white');

const activity: PaintActivity = {
  id: 'ocean-paint-3', version: 1, mode: 'paint', title: 'The Lighthouse',
  blurb: 'A red-and-white lighthouse and its snug keeper’s cottage stand firm on a rocky headland as waves crash and storm clouds roll in.',
  collectionId: 'ocean', categories: ["Ocean", "Animals"], difficulty: 'Moderate',
  added: '2026-11-26',
  width: W, height: H, palette, regions, detail,
};
export default activity;
