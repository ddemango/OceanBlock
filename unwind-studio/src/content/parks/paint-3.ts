import { rect, circle, ellipse, poly, line, curve, blob, leaf, waveBand, xf, stroke } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { PaintActivity, PaletteColor } from '../types';
import { collector, band, softBand, treeline, pine, pineTiers, flipY, streak, lens, tuft, boulder, type Pt } from './props-paint';

const W = 1000, H = 1250;
const SHORE = 640, WATER = 1010;

const palette: PaletteColor[] = [
  { id: 'periwinkle', number: 1, name: 'Fading night', hex: '#8c9fd2' },
  { id: 'lilac', number: 2, name: 'Dawn lilac', hex: '#e2b4cb' },
  { id: 'peach', number: 3, name: 'Peach dawn', hex: '#fbd2a8' },
  { id: 'cream', number: 4, name: 'Snow and mist', hex: '#fff6e8' },
  { id: 'pink', number: 5, name: 'Alpenglow', hex: '#f0988a' },
  { id: 'violet', number: 6, name: 'Mountain shadow', hex: '#7c70a8' },
  { id: 'indigo', number: 7, name: 'Foothills', hex: '#4d4b80' },
  { id: 'teal', number: 8, name: 'Dark timber', hex: '#234f4e' },
  { id: 'pine', number: 9, name: 'Lodgepole green', hex: '#3d7767' },
  { id: 'lakeLight', number: 10, name: 'Still water', hex: '#b6d8e6' },
  { id: 'lake', number: 11, name: 'Lake blue', hex: '#6ea6c8' },
  { id: 'lakeDeep', number: 12, name: 'Deep reflection', hex: '#3d6c8e' },
  { id: 'brown', number: 13, name: 'Moose brown', hex: '#5b3e2f' },
  { id: 'darkBrown', number: 14, name: 'Dark hide', hex: '#3a271f' },
  { id: 'chestnut', number: 15, name: 'Chestnut', hex: '#8b5b3d' },
  { id: 'tan', number: 16, name: 'Antler tan', hex: '#c9a877' },
  { id: 'reed', number: 17, name: 'Reed green', hex: '#7fa65a' },
  { id: 'gold', number: 18, name: 'Autumn grass', hex: '#dcbb5c' },
];

const { regions, R } = collector();
const detail: Shape[] = [];

// ---------- dawn sky ----------
R('sky-high', rect(0, 0, W, H), 'periwinkle');
R('sky-lilac', waveBand(0, W, 146, 9, 760, H, 0.4), 'lilac');
R('moon', circle(900, 74, 26), 'cream');
R('cloud-1', streak(660, 104, 300, 40), 'pink');
R('cloud-2', streak(300, 60, 230, 34), 'lilac');
R('cloud-3', streak(820, 250, 240, 34), 'peach');
R('cloud-4', streak(170, 236, 220, 32), 'peach');

// ---------- the range ----------
interface Peak { id: string; outline: Pt[]; lit: Pt[]; snow?: Pt[][] }
const peaks: Peak[] = [
  { id: 'south', outline: [[110, 600], [150, 470], [185, 400], [215, 330], [240, 372], [262, 350], [300, 440], [330, 600]],
    lit: [[215, 330], [240, 372], [262, 350], [300, 440], [330, 600], [250, 600], [235, 480], [222, 400]],
    snow: [[[203, 372], [215, 344], [222, 400], [214, 446], [196, 424]]] },
  { id: 'middle', outline: [[250, 600], [290, 420], [318, 330], [345, 262], [372, 300], [392, 290], [420, 400], [440, 600]],
    lit: [[345, 262], [372, 300], [392, 290], [420, 400], [440, 600], [380, 600], [362, 440], [352, 340]],
    snow: [[[328, 320], [345, 278], [352, 340], [342, 396], [320, 376]]] },
  { id: 'moran', outline: [[760, 600], [800, 440], [830, 360], [850, 330], [905, 326], [930, 362], [960, 430], [1000, 500], [1000, 600]],
    lit: [[905, 326], [930, 362], [960, 430], [1000, 500], [1000, 600], [930, 600], [915, 440]],
    snow: [[[850, 346], [898, 342], [908, 404], [880, 436], [854, 404]]] },
  { id: 'teewinot', outline: [[635, 600], [662, 400], [690, 310], [708, 292], [730, 340], [760, 440], [790, 600]],
    lit: [[708, 292], [730, 340], [760, 440], [790, 600], [735, 600], [722, 440]],
    snow: [[[690, 344], [706, 308], [718, 400], [702, 440], [684, 410]]] },
  { id: 'owen', outline: [[500, 600], [535, 400], [560, 290], [585, 232], [606, 262], [622, 250], [650, 360], [680, 600]],
    lit: [[585, 232], [606, 262], [622, 250], [650, 360], [680, 600], [625, 600], [606, 420], [592, 310]],
    snow: [[[570, 284], [585, 250], [592, 310], [584, 360], [564, 338]]] },
  { id: 'grand', outline: [[370, 600], [392, 400], [412, 280], [432, 222], [452, 180], [474, 214], [492, 208], [515, 270], [540, 380], [580, 600]],
    lit: [[452, 180], [474, 214], [492, 208], [515, 270], [540, 380], [580, 600], [500, 600], [478, 420], [462, 280]],
    snow: [[[436, 238], [452, 204], [460, 270], [446, 310], [426, 288]], [[420, 350], [440, 340], [452, 420], [436, 470], [414, 440]]] },
];
for (const p of peaks) {
  R(`${p.id}-shadow`, poly(p.outline), 'violet');
  R(`${p.id}-glow`, poly(p.lit), 'pink');
  (p.snow ?? []).forEach((s, i) => R(`${p.id}-snow-${i + 1}`, poly(s), 'cream'));
}
R('foothills', band([[0, 566], [100, 556], [180, 540], [260, 556], [350, 532], [450, 550], [550, 530], [650, 546], [750, 526], [850, 546], [1000, 522]], H), 'indigo');
R('mist', softBand([[0, 590], [150, 576], [300, 588], [450, 574], [600, 586], [750, 574], [900, 584], [1000, 576]], H), 'cream');
const treeTop = (x: number) => 610 + 6 * Math.sin(x / 80);
R('timber', treeline(0, W, treeTop, 22, 30, H, 0.7), 'teal');
for (const [i, x, h, w] of [[1, 196, 92, 44], [2, 262, 70, 38], [3, 330, 104, 48], [4, 404, 66, 36], [5, 690, 84, 42], [6, 770, 112, 50], [7, 846, 72, 38], [8, 930, 100, 46]] as const) {
  R(`shore-pine-${i}`, pine(x, SHORE + 6, h, w, 4), 'pine');
}

// ---------- the lake ----------
R('lake', rect(0, SHORE, W, H - SHORE), 'lakeLight');
const skyline: Pt[] = [
  [100, 640], [100, 600], [150, 470], [185, 400], [215, 330], [240, 372], [262, 350], [290, 400], [318, 330], [345, 262], [372, 300], [392, 290], [412, 280],
  [432, 222], [452, 180], [474, 214], [492, 208], [515, 270], [540, 330], [560, 290], [585, 232], [606, 262], [622, 250], [650, 340], [690, 310],
  [708, 292], [730, 340], [770, 430], [800, 440], [830, 360], [850, 330], [905, 326], [930, 362], [960, 430], [1000, 500], [1000, 640],
];
R('range-reflection', flipY(poly(skyline), SHORE, 0.52), 'lake');
R('owen-reflection', flipY(poly(peaks[4].lit), SHORE, 0.52), 'lilac');
R('moran-reflection', flipY(poly(peaks[2].lit), SHORE, 0.52), 'lilac');
R('timber-reflection', flipY(treeline(0, W, treeTop, 22, 30, SHORE, 0.7), SHORE, 1.3), 'lakeDeep');
R('shore-mist-1', lens(548, SHORE, 250, 24), 'cream');
R('shore-mist-2', lens(300, SHORE + 2, 190, 22), 'cream');
R('near-water', softBand([[0, 1104], [250, 1088], [500, 1104], [750, 1086], [1000, 1098]], H), 'lake');
R('ripple-1', lens(260, 724, 190, 20), 'cream');
R('ripple-2', lens(890, 746, 190, 20), 'cream');
R('ripple-3', lens(280, 826, 170, 20), 'cream');
R('ripple-4', lens(900, 856, 170, 20), 'cream');
R('ripple-5', lens(290, 950, 190, 20), 'lake');
R('ripple-6', lens(890, 966, 190, 20), 'lake');
R('ripple-7', lens(880, 1044, 150, 18), 'lake');
R('ripple-8', lens(470, 1226, 170, 20), 'lakeLight');

// ---------- moose ----------
const silhouette: Pt[] = [
  [490, 773], [530, 776], [540, 760], [572, 748], [630, 790], [690, 790], [750, 800], [785, 835], [790, 880], [786, 920], [772, 965], [770, 1010],
  [724, 1010], [722, 925], [600, 925], [598, 1010], [550, 1010], [546, 912], [525, 885], [510, 892], [470, 884], [468, 915], [452, 940], [440, 886],
  [430, 890], [392, 908], [366, 914], [346, 900], [350, 872], [378, 850], [415, 826], [455, 792],
];
R('moose-reflection', flipY(poly(silhouette), WATER, 0.8), 'lakeDeep');
R('ring-front', lens(574, WATER + 2, 170, 22), 'cream');
R('ring-hind', lens(748, WATER + 2, 150, 22), 'cream');
R('water-under-moose', rect(590, 915, 140, 96), 'lake');

const antler: Pt[] = [
  [486, 778], [470, 750], [436, 738], [462, 730], [452, 700], [428, 672], [462, 684], [462, 648], [486, 672], [500, 636], [516, 668],
  [540, 640], [546, 676], [576, 662], [566, 702], [540, 728], [506, 742], [498, 760],
];
R('antler-far', xf(poly(antler), { s: 0.8, ox: 486, oy: 778, x: -30, y: -6 }), 'chestnut');
R('leg-far-front', poly([[568, 900], [602, 900], [600, 960], [598, WATER], [576, WATER], [574, 960]]), 'darkBrown');
R('leg-far-hind', poly([[722, 900], [760, 905], [756, 950], [758, WATER], [724, WATER], [722, 955]]), 'darkBrown');
R('dewlap', blob([[438, 878], [472, 876], [470, 916], [453, 944], [440, 916]], 0.8), 'darkBrown');
R('moose-body', blob([[572, 748], [630, 790], [690, 790], [750, 800], [785, 835], [790, 880], [765, 915], [690, 925], [620, 925], [560, 915], [525, 880], [505, 840], [518, 790], [540, 762]], 0.8), 'brown');
R('moose-belly', blob([[545, 898], [620, 910], [700, 910], [772, 896], [766, 918], [690, 928], [620, 928], [556, 918]], 0.8), 'darkBrown');
R('moose-shoulder', blob([[546, 790], [574, 762], [612, 790], [620, 840], [590, 868], [554, 848]], 0.9), 'chestnut');
R('leg-near-front', poly([[538, 888], [580, 894], [573, 966], [547, 966]]), 'chestnut');
R('leg-near-front-shin', poly([[547, 958], [573, 958], [569, WATER], [550, WATER]]), 'tan');
R('leg-near-hind', poly([[744, 880], [791, 868], [787, 920], [773, 966], [749, 966], [752, 920]]), 'chestnut');
R('leg-near-hind-shin', poly([[749, 958], [773, 958], [771, WATER], [752, WATER]]), 'tan');
R('moose-head', blob([[532, 780], [490, 773], [455, 792], [415, 826], [378, 850], [350, 872], [346, 900], [366, 914], [392, 908], [430, 890], [470, 884], [512, 894], [542, 850]], 0.7), 'brown');
R('moose-muzzle', blob([[378, 852], [350, 872], [346, 900], [366, 914], [392, 908], [398, 878]], 0.8), 'tan');
R('moose-ear', leaf(496, 782, 52, 14, -52), 'chestnut');
R('antler-near', poly(antler), 'tan');

// ---------- near shore ----------
R('bank', softBand([[0, 1004], [90, 1012], [180, 1060], [260, 1130], [330, 1200], [372, 1250]], H), 'reed');
R('cattail-1', rect(240, 1030, 13, 42, 6), 'darkBrown');
R('cattail-2', rect(282, 1076, 13, 42, 6), 'darkBrown');
R('cattail-3', rect(330, 1120, 13, 40, 6), 'darkBrown');
R('bank-grass-1', tuft(214, 1128, 74, 84, 5, 0.1), 'gold');
R('bank-grass-2', tuft(292, 1206, 78, 74, 5, 0.12), 'pine');
R('bank-grass-3', tuft(236, 1236, 70, 60, 5), 'gold');
R('big-pine-trunk', rect(40, 1020, 30, 70), 'darkBrown');
pineTiers(54, 1046, 800, 300, 7, [W, H]).forEach((d, i) => R(`big-pine-${7 - i}`, d, i % 2 ? 'pine' : 'teal'));
R('bank-grass-4', tuft(120, 1130, 84, 70, 5, 0.05), 'gold');
R('bank-rock', boulder(90, 1236, 120, 60), 'indigo');

R('lily-pad-1', ellipse(820, 1186, 48, 17), 'reed');
R('lily-pad-2', ellipse(908, 1134, 40, 14), 'pine');
R('lily-pad-3', ellipse(724, 1222, 42, 15), 'pine');
R('lily-pad-4', ellipse(944, 1218, 44, 16), 'reed');
R('lily-flower-1', circle(836, 1176, 11), 'pink');
R('lily-flower-2', circle(934, 1210, 10), 'cream');
R('shallows-rock-1', boulder(600, 1246, 96, 44), 'indigo');
R('shallows-rock-2', boulder(948, 1100, 70, 36), 'indigo');

// ---------- line work ----------
{
  detail.push(stroke(circle(432, 826, 2.5), '#1d1410', 3));
  detail.push(stroke(line([[356, 884], [362, 888]]), '#3a271f', 2.5));
  detail.push(stroke(
    line([[246, 1072], [246, 1150]]) + line([[288, 1118], [288, 1190]]) + line([[336, 1160], [336, 1230]]), '#5b6f3c', 2.5));
  // ripples round the legs and across the reflections
  detail.push(stroke(
    curve([[470, 1030], [560, 1040], [660, 1034]], 0.9) + curve([[690, 1034], [760, 1042], [840, 1032]], 0.9) +
    line([[380, 1070], [470, 1070]]) + line([[610, 1090], [720, 1090]]) + line([[430, 1150], [540, 1150]]) +
    line([[120, 760], [230, 760]]) + line([[720, 800], [860, 800]]) + line([[60, 880], [150, 880]]) + line([[840, 910], [960, 910]]),
    '#f4fbfd', 2, { opacity: 0.75 }));
  // creases on the peaks
  detail.push(stroke(
    line([[452, 180], [462, 280], [478, 420]]) + line([[585, 232], [592, 310], [606, 420]]) + line([[345, 262], [352, 340], [362, 440]]) +
    line([[400, 420], [388, 520]]) + line([[548, 420], [540, 520]]) + line([[300, 470], [292, 540]]),
    '#4d4b80', 1.6, { opacity: 0.35 }));
  const bird = (x: number, y: number, s: number) => curve([[x - s, y - s * 0.3], [x - s * 0.5, y - s * 0.6], [x, y]], 0.8) + curve([[x, y], [x + s * 0.5, y - s * 0.6], [x + s, y - s * 0.3]], 0.8);
  detail.push(stroke(bird(250, 150, 11) + bird(280, 136, 8) + bird(312, 156, 9) + bird(342, 142, 7), '#4d4b80', 2));
}

const activity: PaintActivity = {
  id: 'parks-paint-3', version: 1, mode: 'paint', title: 'Moose at the Lake',
  blurb: 'A bull moose wades into a mirror-still lake at first light, with pink alpenglow on the jagged peaks and mist along the far shore.',
  collectionId: 'parks', categories: ["Nature", "Travel"], difficulty: 'Detailed',
  added: '2026-11-26',
  width: W, height: H, palette, regions, detail,
};
export default activity;
