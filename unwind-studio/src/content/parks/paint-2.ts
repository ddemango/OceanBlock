import { rect, circle, ellipse, poly, line, curve, blob, waveBand, stroke } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { PaintActivity, PaletteColor } from '../types';
import { collector, band, softBand, ridge, ribbon, tube, bank, streak, tuft, boulder, type Pt } from './props-paint';

const W = 1000, H = 1250;

const palette: PaletteColor[] = [
  { id: 'plum', number: 1, name: 'Night plum', hex: '#4b3866' },
  { id: 'violet', number: 2, name: 'Dusk violet', hex: '#86639f' },
  { id: 'rose', number: 3, name: 'Desert rose', hex: '#d86f8c' },
  { id: 'coral', number: 4, name: 'Sunset coral', hex: '#ef8560' },
  { id: 'apricot', number: 5, name: 'Apricot glow', hex: '#f9b06a' },
  { id: 'gold', number: 6, name: 'Last light', hex: '#fdd67f' },
  { id: 'cream', number: 7, name: 'Evening sun', hex: '#fff4d2' },
  { id: 'mauve', number: 8, name: 'Far mountains', hex: '#a67c9f' },
  { id: 'terracotta', number: 9, name: 'Red rock', hex: '#d55f36' },
  { id: 'rust', number: 10, name: 'Rust shadow', hex: '#a23d2c' },
  { id: 'maroon', number: 11, name: 'Deep canyon', hex: '#682a30' },
  { id: 'sand', number: 12, name: 'Trail sand', hex: '#f3d9aa' },
  { id: 'juniper', number: 13, name: 'Juniper', hex: '#4c7256' },
  { id: 'sage', number: 14, name: 'Sagebrush', hex: '#9bb07d' },
  { id: 'bark', number: 15, name: 'Weathered bark', hex: '#7a5a48' },
];

const { regions, R } = collector();
const detail: Shape[] = [];

// ---------- the arch (geometry first: the sky seen through it is drawn to fit) ----------
const AX = 525, ARX = 175, ABASE = 832, ARY = 445;
const archCentre = (t: number): Pt => {
  const a = Math.PI * t;
  return [AX - ARX * Math.cos(a), ABASE - ARY * Math.pow(Math.max(0, Math.sin(a)), 0.48)];
};
const archHalf = (t: number) =>
  68 - 24 * t + 4 * Math.sin(t * 19) + 18 * Math.exp(-t * 16) + 12 * Math.exp(-(1 - t) * 16);
const arch = tube(archCentre, archHalf);

// ---------- sunset sky ----------
R('sky-plum', rect(0, 0, W, H), 'plum');
R('sky-violet', waveBand(0, W, 104, 9, 700, H, 0.5), 'violet');
R('sky-rose', waveBand(0, W, 204, 9, 620, H, 1.9), 'rose');
R('sky-coral', waveBand(0, W, 300, 7, 760, H, 3.1), 'coral');
R('glow-left', softBand([[0, 628], [120, 640], [240, 632], [350, 646]], H), 'apricot');
R('glow-right', softBand([[700, 640], [800, 628], [900, 640], [1000, 630]], H), 'apricot');
R('cloud-1', streak(250, 58, 300, 46), 'violet');
R('cloud-2', streak(730, 152, 340, 50), 'rose');
R('cloud-3', streak(190, 256, 280, 44), 'coral');
R('cloud-4', streak(830, 372, 250, 40), 'gold');
R('cloud-5', streak(120, 470, 200, 36), 'apricot');

// the patch of sky framed by the arch
{
  const pts: Pt[] = [];
  for (let i = 0; i <= 60; i++) pts.push(archCentre(i / 60));
  R('window-sky', poly(pts), 'coral');
  R('window-glow', softBand([[350, 652], [440, 640], [530, 648], [620, 638], [700, 650]], H), 'apricot');
  R('sun-halo', circle(540, 612, 84), 'gold');
  R('sun', circle(540, 612, 52), 'cream');
}

// ---------- far country ----------
R('mountains-left', band([[0, 742], [80, 726], [170, 748], [260, 720], [350, 744]], H), 'mauve');
R('mountains-window', band([[350, 744], [430, 752], [500, 734], [580, 750], [650, 738], [700, 746]], H), 'mauve');
R('mountains-right', band([[700, 746], [780, 720], [880, 744], [1000, 728]], H), 'mauve');
R('far-mesa', poly([[70, 800], [82, 742], [150, 738], [158, 704], [214, 704], [222, 744], [262, 748], [270, 800]]), 'violet');
R('far-butte', poly([[440, 800], [448, 752], [462, 748], [468, 726], [498, 726], [504, 750], [516, 754], [522, 800]]), 'violet');

// ---------- mesas ----------
R('mesa-left-talus', poly([[0, 880], [0, 756], [206, 756], [300, 880]]), 'maroon');
R('mesa-left-cliff', poly([[0, 760], [0, 652], [150, 652], [158, 668], [196, 668], [206, 760]]), 'rust');
R('mesa-left-cap', poly([[0, 652], [150, 652], [158, 668], [196, 668], [199, 692], [0, 692]]), 'terracotta');
R('mesa-right-talus', poly([[712, 880], [800, 744], [W, 744], [W, 880]]), 'maroon');
R('mesa-right-cliff', poly([[800, 748], [808, 642], [850, 642], [858, 626], [W, 626], [W, 748]]), 'rust');
R('mesa-right-cap', poly([[808, 642], [850, 642], [858, 626], [W, 626], [W, 664], [806, 664]]), 'terracotta');

// ---------- slickrock rim and the arch standing on it ----------
const rimY = (x: number) => 790 + 80 * ((x - AX) / 525) ** 2;
R('rim', ridge(rimY, 0, W, H, 25), 'terracotta');

const taper = (t: number, a: number, b: number) => Math.sin(Math.PI * Math.max(0, Math.min(1, (t - a) / (b - a))));
R('arch', arch(0, 1, (t) => -1 - 0.07 * Math.sin(t * 24) - 0.05 * Math.sin(t * 53 + 2), 1, 90), 'rust');
R('arch-light', arch(0, 0.56, (t) => -1 - 0.07 * Math.sin(t * 24) - 0.05 * Math.sin(t * 53 + 2), (t) => -1 + 0.6 * Math.pow(taper(t, -0.3, 0.56), 0.7), 60), 'apricot');
R('arch-shade', arch(0.16, 1, (t) => 1 - 0.7 * Math.pow(taper(t, 0.16, 1.35), 0.8), 1), 'maroon');
R('arch-foot-left', boulder(318, 852, 170, 52), 'maroon');
R('arch-foot-right', boulder(722, 850, 130, 44), 'maroon');

// ---------- terraces of slickrock, split by the trail ----------
const trailX = (y: number) => 470 - 0.1 * (y - 830) + 75 * Math.sin((y - 830) / 95);
const trailHalf = (y: number) => 6 + (y - 830) * 0.09;
const terrace = (side: 'l' | 'r', f: (x: number) => number) => bank(side, f, trailX, W, H);
R('terrace-left-1', terrace('l', (x) => 925 - 20 * Math.cos(x / 150)), 'apricot');
R('terrace-right-1', terrace('r', (x) => 912 + 20 * Math.sin(x / 120 + 1)), 'coral');
R('terrace-left-2', terrace('l', (x) => 1012 + 18 * Math.sin(x / 110 + 1)), 'coral');
R('terrace-right-2', terrace('r', (x) => 1000 + 20 * Math.sin(x / 150 + 3)), 'apricot');
R('terrace-left-3', terrace('l', (x) => 1104 + 20 * Math.sin(x / 130 + 2.5)), 'rust');
R('terrace-right-3', terrace('r', (x) => 1088 + 20 * Math.sin(x / 100)), 'rust');
{
  const l: Pt[] = [], r: Pt[] = [];
  for (let y = 830; y <= H; y += 20) { l.push([trailX(y) - trailHalf(y), y]); r.push([trailX(y) + trailHalf(y), y]); }
  R('trail', curve(l, 0.7) + curve(r.reverse(), 0.7).replace(/^M/, 'L') + 'Z', 'sand');
}
R('mound-left', softBand([[0, 1140], [80, 1124], [170, 1150], [236, 1206], [272, 1250]], H), 'maroon');
R('mound-right', softBand([[452, 1250], [520, 1192], [640, 1152], [800, 1130], [1000, 1104]], H), 'maroon');

// rocks and scrub along the terraces
R('rock-1', boulder(262, 992, 78, 46), 'rust');
R('rock-2', boulder(690, 972, 64, 38), 'rust');
R('rock-3', boulder(930, 1078, 86, 50), 'maroon');
R('shrub-1', blob([[846, 934], [862, 906], [896, 900], [930, 912], [940, 934], [900, 942]], 0.9), 'juniper');
R('shrub-2', blob([[590, 1062], [604, 1038], [634, 1032], [660, 1046], [664, 1064], [628, 1070]], 0.9), 'sage');
R('shrub-3', blob([[330, 1078], [344, 1054], [376, 1050], [398, 1064], [400, 1082], [364, 1088]], 0.9), 'juniper');

// ---------- juniper ----------
R('juniper-branch-left', ribbon([[122, 1090], [84, 1044], [58, 992]], [10, 8, 6]), 'maroon');
R('juniper-branch-right', ribbon([[134, 1016], [188, 984], [228, 948]], [9, 7, 6]), 'maroon');
R('juniper-trunk', ribbon([[108, 1196], [128, 1124], [112, 1062], [138, 1002], [152, 944]], [24, 17, 14, 11, 8]), 'bark');
R('juniper-leaves-left', blob([[4, 978], [16, 940], [52, 926], [92, 938], [110, 970], [88, 998], [40, 1004]], 0.9), 'juniper');
R('juniper-leaves-right', blob([[186, 948], [200, 912], [240, 900], [280, 914], [290, 944], [262, 966], [214, 968]], 0.9), 'juniper');
R('juniper-leaves-top', blob([[72, 912], [86, 866], [130, 842], [182, 850], [214, 884], [204, 924], [160, 946], [104, 944]], 0.9), 'juniper');
R('juniper-leaves-light', blob([[96, 892], [112, 866], [146, 858], [172, 872], [166, 896], [128, 904]], 0.9), 'sage');
R('juniper-leaves-light-2', blob([[214, 932], [226, 916], [250, 912], [266, 924], [258, 940], [232, 944]], 0.9), 'sage');

// ---------- prickly pear and yucca ----------
R('pear-pad-1', ellipse(740, 1182, 42, 54, -10), 'juniper');
R('pear-pad-2', ellipse(814, 1166, 38, 50, 18), 'sage');
R('pear-pad-3', ellipse(690, 1112, 30, 40, -25), 'sage');
R('pear-pad-4', ellipse(776, 1070, 32, 42, 8), 'juniper');
R('pear-pad-5', ellipse(864, 1098, 28, 38, 30), 'juniper');
R('pear-flower-1', circle(676, 1072, 14), 'rose');
R('pear-flower-2', circle(782, 1026, 14), 'gold');
R('pear-flower-3', circle(880, 1062, 13), 'rose');
R('yucca-bloom', ellipse(566, 1040, 14, 34), 'cream');
R('yucca', tuft(560, 1200, 130, 96, 7), 'sage');

// ---------- line work ----------
{
  // bedding lines across the arch
  let beds = '';
  const bed = (t: number, a: number, b: number) => {
    const p = arch(t, t + 0.001, a, b, 1).match(/-?\d+(\.\d+)?/g)!.map(Number);
    return line([[p[0], p[1]], [p[4], p[5]]]);
  };
  for (const [t, a, b] of [[0.05, -0.95, 0.5], [0.1, -0.3, 0.95], [0.16, -0.95, 0.2], [0.22, -0.5, 0.9], [0.28, -0.95, 0], [0.74, -0.2, 0.95], [0.8, -0.95, 0.4], [0.87, -0.5, 0.95], [0.94, -0.95, 0.3]] as const) beds += bed(t, a, b);
  detail.push(stroke(beds, '#3d1418', 2.2, { opacity: 0.4 }));
  // strata on the mesas
  detail.push(stroke(line([[0, 716], [202, 716]]) + line([[0, 738], [204, 738]]) + line([[804, 694], [1000, 694]]) + line([[802, 720], [1000, 720]]), '#5c2026', 2, { opacity: 0.35 }));
  // sweeping lines in the slickrock
  detail.push(stroke(
    curve([[30, 968], [140, 954], [260, 962], [380, 986]], 0.8) + curve([[600, 948], [740, 934], [880, 950], [980, 944]], 0.8) +
    curve([[20, 1062], [120, 1052], [230, 1066], [330, 1060]], 0.8) + curve([[560, 1040], [700, 1026], [860, 1036], [980, 1024]], 0.8),
    '#5c2026', 2, { opacity: 0.28 }));
  // yucca stalk, cactus spines, ravens
  detail.push(stroke(line([[562, 1130], [566, 1066]]), '#6f7f55', 3));
  let spines = '';
  for (const [x, y] of [[726, 1164], [752, 1190], [744, 1150], [806, 1150], [824, 1178], [686, 1108], [772, 1066], [786, 1084], [862, 1100]]) spines += line([[x - 4, y - 4], [x + 4, y + 4]]) + line([[x + 4, y - 4], [x - 4, y + 4]]);
  detail.push(stroke(spines, '#f3e9c8', 1.6, { opacity: 0.85 }));
  const bird = (x: number, y: number, s: number) => curve([[x - s, y - s * 0.3], [x - s * 0.5, y - s * 0.6], [x, y]], 0.8) + curve([[x, y], [x + s * 0.5, y - s * 0.6], [x + s, y - s * 0.3]], 0.8);
  detail.push(stroke(bird(640, 250, 13) + bird(676, 232, 9) + bird(386, 180, 10), '#33254a', 2.2));
}

const activity: PaintActivity = {
  id: 'parks-paint-2', version: 1, mode: 'paint', title: 'Red Rock Arches',
  blurb: 'The setting sun glows through a great sandstone arch above layered mesas, a twisted juniper and a sandy trail winding up the slickrock.',
  collectionId: 'parks', categories: ["Nature", "Travel"], difficulty: 'Relaxed',
  added: '2026-11-26',
  width: W, height: H, palette, regions, detail,
};
export default activity;
