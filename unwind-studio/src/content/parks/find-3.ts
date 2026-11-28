import { rect, ellipse, circle, poly, line, curve, blob, leaf, sh, stroke, place, shade, rng, linearGradient, radialGradient } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { FindActivity, FindItem } from '../types';
import {
  M, Q, ol, shadow, pine, peaks, cloud, rock, tuft, flower, logWall, logEnds, woodStack, lantern, axe, kettle, campStove, rubberBoots, fishingRod, tackleBox, landingNet,
  sleepingDog, enamelMug, openBook, windChime, creel, bobber, pie, banjo, yarnBall, rockingChair, bird, type Pt,
} from './props-find';

const ID = 'parks-find-3';
const W = 1200, H = 1500;
const items: FindItem[] = [];
const scene = (...s: (Shape | Shape[])[]) => { items.push({ shapes: s.flat() }); };
const target = (id: string, name: string, shapes: Shape[]) => { items.push({ id, name, target: true, shapes }); };

const LAKE = 640, SHORE = 850, EAVE = 345, FLOOR = 1040, EDGE = 1140;
const LOG = '#b87a44', ROOF = '#7c4c46', WOOD = '#8a5c38', TRIM = '#f1dcb0', GLOW = '#ffd98a';

const defs =
  linearGradient(`${ID}-sky`, [[0, '#4a5596'], [0.36, '#9a6a9c'], [0.66, '#ee8a66'], [0.88, '#f8c070'], [1, '#fde6a0']]) +
  linearGradient(`${ID}-lake`, [[0, '#f8c880'], [0.3, '#e89a7a'], [1, '#6a5a94']]) +
  linearGradient(`${ID}-ground`, [[0, '#8aa450'], [1, '#4f7a40']]) +
  radialGradient(`${ID}-sun`, [[0, '#fff6c8'], [0.3, '#ffe08a99'], [1, '#ffd07000']]) +
  radialGradient(`${ID}-glow`, [[0, '#ffe6a0'], [1, '#ffe6a000']]);

// =====================================================================
// golden-hour sky, peaks and the lake
// =====================================================================
scene(sh(rect(0, 0, W, LAKE + 10), `url(#${ID}-sky)`), sh(circle(214, 560, 260), `url(#${ID}-sun)`), sh(circle(214, 560, 34), '#fff6d0'));
scene(place(cloud(280, '#f6a488', 0.75), { x: 300, y: 250 }), place(cloud(200, '#f8b890', 0.7), { x: 80, y: 360 }), place(cloud(240, '#c88aa8', 0.6), { x: 200, y: 110 }), place(cloud(170, '#fbd0a0', 0.7), { x: 420, y: 420 }));
{
  const g = rng(3);
  for (let i = 0; i < 16; i++) scene(sh(circle(g.range(10, 700), g.range(10, 190), g.range(0.9, 2)), '#fff6e0', { opacity: g.range(0.4, 0.85) }));
  for (let i = 0; i < 4; i++) { const x = g.range(300, 470), y = g.range(300, 370), s = g.range(9, 14); scene(stroke(M(x - s, y) + Q(x - s / 2, y - s * 0.6, x, y) + Q(x + s / 2, y - s * 0.6, x + s, y), '#4a3a5a', 1.8)); }
}
scene(peaks([[0, 500], [60, 446], [110, 478], [190, 380], [250, 442], [330, 330], [400, 430], [470, 372], [540, 452], [610, 400], [700, 470]], LAKE, '#7a6aa0', '#fbd2b0', 410));
scene(peaks([[0, 580], [90, 530], [170, 566], [260, 520], [350, 574], [450, 528], [560, 580], [700, 540]], LAKE, '#5f5a8c', '#fbd2b0', 0));
{
  const g = rng(5);
  let trees = '';
  for (let x = 0; x < 720; x += g.range(9, 16)) { const h = g.range(16, 38); trees += poly([[x - 6, LAKE + 2], [x, LAKE + 2 - h], [x + 6, LAKE + 2]]); }
  scene(sh(trees, '#3a3a5e'));
  scene(sh(rect(0, LAKE, 720, SHORE - LAKE + 30), `url(#${ID}-lake)`));
  // mirrored peaks, sun path and ripples
  scene(sh(poly([[190, LAKE], [250, LAKE], [330, LAKE + 130], [400, LAKE + 30], [470, LAKE + 80], [540, LAKE]]), '#7a6aa0', { opacity: 0.28 }));
  for (let i = 0; i < 12; i++) { const y = LAKE + 8 + i * 15, w = 30 + i * 9 + g.range(-8, 8); scene(sh(rect(214 - w / 2 + g.range(-10, 10), y, w, 4, 2), '#fff3c0', { opacity: 0.85 - i * 0.04 })); }
  for (let i = 0; i < 34; i++) { const y = g.range(LAKE + 8, SHORE), x = g.range(0, 700), w = g.range(24, 90); scene(sh(rect(x, y, w, 2.4, 1.2), g.pick(['#fbe0b0', '#f8b890', '#b8a0d0', '#fff3c0']), { opacity: g.range(0.3, 0.75) })); }
  // little island
  scene(sh(ellipse(520, LAKE + 46, 60, 7), '#3a3a5e'), sh(poly([[486, LAKE + 44], [496, LAKE + 6], [506, LAKE + 44]]) + poly([[506, LAKE + 44], [520, LAKE - 8], [534, LAKE + 44]]) + poly([[534, LAKE + 44], [546, LAKE + 12], [558, LAKE + 44]]), '#33385a'));
  // dock and rowing boat
  scene(sh(rect(196, 792, 8, 40) + rect(296, 792, 8, 40), '#4a3428'), ol(poly([[180, 786], [320, 782], [326, 796], [176, 800]]), '#a8784a', 1));
  let pl = '';
  for (let x = 196; x < 320; x += 18) pl += line([[x, 786], [x - 2, 799]]);
  scene(stroke(pl, '#6b4a30', 1.2), sh(ellipse(410, 818, 74, 6), '#3a3058', { opacity: 0.4 }));
  scene(ol(M(340, 790) + Q(350, 818, 392, 818) + L2(440, 818) + Q(474, 816, 484, 788) + Q(412, 800, 340, 790) + 'Z', '#c8523a', 1.2), stroke(M(342, 791) + Q(412, 801, 482, 789), '#f4ead2', 2.4), stroke(line([[326, 792], [342, 792]]), '#e8e2d0', 1.2), stroke(line([[404, 780], [450, 812]]), '#b8824a', 3));
}
function L2(x: number, y: number) { return `L${Math.round(x * 10) / 10} ${Math.round(y * 10) / 10}`; }

// ground
scene(sh(blob([[0, H], [0, SHORE - 2], [180, SHORE - 12], [330, SHORE + 4], [480, SHORE - 6], [720, SHORE + 6], [1200, SHORE], [1200, H]], 0.5), `url(#${ID}-ground)`));
scene(sh(blob([[0, SHORE + 50], [0, SHORE - 2], [180, SHORE - 12], [330, SHORE + 4], [480, SHORE - 6], [600, SHORE + 20], [300, SHORE + 60]], 0.5), '#c8c060', { opacity: 0.55 }));
{
  const g = rng(7);
  for (let i = 0; i < 22; i++) { const x = g.range(0, 420), y = SHORE + g.range(-6, 16), h = g.range(26, 56); scene(stroke(curve([[x, y], [x + g.range(-5, 5), y - h * 0.5], [x + g.range(-9, 9), y - h]]), g.pick(['#5a7a3a', '#6a8a42', '#4a6a34']), 2.2)); if (g.next() < 0.45) scene(sh(ellipse(x + g.range(-3, 3), y - h * 0.84, 3, 9), '#6b4a2a')); }
}

// dark pines behind the cabin
scene(place(pine(520, '#2f4a48', 21), { x: 640, y: 420 }), place(pine(600, '#28423f', 22), { x: 830, y: 420 }), place(pine(480, '#2f4a48', 23), { x: 1150, y: 400 }), place(pine(420, '#3a5a50', 24), { x: 540, y: 430 }));

// =====================================================================
// the cabin
// =====================================================================
{
  const g = rng(11);
  // chimney, smoke
  scene(ol(rect(980, 14, 76, 120), '#a09488', 1.2), ol(rect(970, 4, 96, 16, 3), '#7a7068', 1));
  for (let r = 0; r < 6; r++) for (let i = 0; i < 3; i++) scene(ol(rect(984 + i * 23 + (r % 2) * 5 - 2, 24 + r * 18, g.range(15, 20), 13, 4), g.pick(['#b8aca0', '#948a80', '#a89c8e', '#c8b8a8']), 0.6, -0.25));
  // roof
  const rl = (y: number) => 470 - ((y - 90) / (EAVE - 90)) * 170;
  scene(sh(poly([[rl(EAVE), EAVE], [W, EAVE], [W, 90], [rl(90), 90]]), ROOF));
  for (let y = 90, i = 0; y < EAVE - 2; y += 25.5, i++) {
    scene(sh(poly([[rl(y), y], [W, y], [W, y + 25.5], [rl(y + 25.5), y + 25.5]]), shade(ROOF, i % 2 ? -0.07 : 0.05)));
    let ticks = '';
    for (let x = rl(y) + 18 + (i % 2) * 19; x < W; x += 38) ticks += line([[x, y + 2], [x, y + 24]]);
    scene(stroke(ticks, shade(ROOF, -0.32), 1.3), sh(rect(rl(y + 25.5), y + 22, W - rl(y + 25.5), 3.5), shade(ROOF, -0.3), { opacity: 0.7 }));
  }
  scene(sh(poly([[rl(90), 90], [W, 90], [W, 110], [rl(110), 110]]), '#f8a070', { opacity: 0.25 }), ol(rect(rl(90) - 6, 82, W, 12, 4), shade(ROOF, -0.22), 1));
  for (let i = 0; i < 7; i++) scene(sh(ellipse(g.range(520, 1180), g.range(120, 320), g.range(10, 22), 5), '#6a8a52', { opacity: 0.55 }));
  // log wall, corner and porch-ceiling shade
  scene(logWall(420, EAVE + 14, W, FLOOR, 38, LOG, 17));
  scene(sh(rect(420, EAVE + 14, W - 420, 120), '#2a1820', { opacity: 0.3 }), sh(rect(420, EAVE + 134, W - 420, 70), '#2a1820', { opacity: 0.12 }));
  scene(logEnds(420, EAVE + 14, FLOOR, 38, LOG));
  scene(ol(rect(290, EAVE - 4, W - 290 + 4, 20, 3), shade(WOOD, -0.1), 1), sh(rect(290, EAVE - 4, W - 290, 5), '#f8b070', { opacity: 0.35 }));
  // window with a warm glow
  scene(sh(ellipse(850, 650, 200, 180), `url(#${ID}-glow)`, { opacity: 0.5 }));
  scene(ol(rect(722, 532, 256, 246, 4), TRIM, 1.4), sh(rect(736, 546, 228, 218), GLOW), sh(rect(736, 546, 228, 90), '#fff0c0', { opacity: 0.5 }));
  scene(sh(M(736, 546) + Q(800, 610, 736, 700) + 'Z', '#d8684a', { opacity: 0.92 }), sh(M(964, 546) + Q(900, 610, 964, 700) + 'Z', '#d8684a', { opacity: 0.92 }), sh(rect(736, 546, 228, 20), '#c8553a'), stroke(M(744, 566) + Q(760, 578, 776, 566) + Q(792, 578, 808, 566) + Q(824, 578, 840, 566) + Q(856, 578, 872, 566) + Q(888, 578, 904, 566) + Q(920, 578, 936, 566) + Q(950, 578, 962, 566), '#f4ead2', 2));
  scene(sh(rect(846, 546, 8, 218) + rect(736, 650, 228, 7), TRIM));
  // lamp and jug silhouettes inside
  scene(sh(poly([[880, 700], [912, 700], [904, 670], [888, 670]]), '#e8a040'), sh(rect(893, 700, 6, 40) + rect(882, 738, 28, 6), '#8a5a2a'), sh(ellipse(800, 742, 18, 22) + rect(792, 706, 16, 18), '#b8683a', { opacity: 0.8 }));
  scene(ol(rect(712, 776, 276, 16, 3), shade(TRIM, -0.08), 1));
  // door
  scene(ol(rect(462, 604, 186, 436, 4), TRIM, 1.4), ol(rect(474, 616, 162, 424), '#8a3a30', 1.2));
  let dl = '';
  for (let x = 506; x < 636; x += 32.5) dl += line([[x, 736], [x, 1036]]);
  scene(stroke(dl, '#6a2a24', 1.6), ol(rect(498, 636, 114, 86, 4), GLOW, 1.6, -0.5), sh(rect(552, 636, 6, 86) + rect(498, 676, 114, 6), '#8a3a30'), sh(poly([[498, 636], [540, 636], [498, 680]]), '#ffffff', { opacity: 0.3 }));
  scene(sh(rect(474, 760, 162, 10) + rect(474, 990, 162, 10), '#3a2a26'), ol(circle(616, 860, 8), '#d9b45a', 1), sh(rect(610, 874, 12, 20, 2), '#3a2a26'));
  // carved trout plaque over the door
  scene(ol(rect(488, 520, 134, 60, 8), '#c99a5a', 1.4), sh(leaf(516, 550, 70, 15, 0) + poly([[520, 550], [502, 536], [502, 564]]), '#5f8a7a'), sh(circle(570, 546, 2.6), '#2a2420'), stroke(M(534, 556) + Q(552, 562, 572, 556), '#e8a07a', 2), sh(circle(496, 528, 2.4) + circle(614, 528, 2.4) + circle(496, 572, 2.4) + circle(614, 572, 2.4), '#5a3c26'));
  // corner post with brackets
  scene(ol(rect(348, EAVE + 14, 28, FLOOR - EAVE - 14), '#a06c40', 1.2), sh(rect(348, EAVE + 14, 8, FLOOR - EAVE - 14), '#ffc880', { opacity: 0.3 }), sh(poly([[376, EAVE + 14], [416, EAVE + 14], [376, EAVE + 62]]) + poly([[348, EAVE + 14], [312, EAVE + 14], [348, EAVE + 56]]), shade(WOOD, -0.05)));
  // porch floor boards, edge and lattice skirt
  scene(sh(rect(322, FLOOR, W - 322, EDGE - FLOOR), '#c89a64'));
  let fb = '';
  for (let x = 322; x <= W + 60; x += 58) fb += line([[760 + (x - 760) * 0.86, FLOOR], [x, EDGE]]);
  scene(stroke(fb, '#96693e', 1.6), sh(rect(322, FLOOR, W - 322, 16), '#2a1820', { opacity: 0.22 }), sh(poly([[322, FLOOR], [420, FLOOR], [322, EDGE]]), '#ffd080', { opacity: 0.25 }));
  scene(ol(rect(316, EDGE, W - 316 + 4, 24, 3), '#a8743e', 1), sh(rect(316, EDGE, W - 316, 5), '#ffc880', { opacity: 0.35 }));
  scene(sh(rect(326, EDGE + 24, W - 326, 78), '#3a2a24'));
  let lat = '';
  for (let x = 300; x < W + 80; x += 26) lat += line([[x, EDGE + 24], [x - 78, EDGE + 102]]) + line([[x - 78, EDGE + 24], [x, EDGE + 102]]);
  scene(stroke(lat, '#8a623c', 3.2), sh(rect(326, EDGE + 96, W - 326, 8), '#6a4a30'));
  for (let i = 0; i < 3; i++) scene(ol(rect(630 - i * 16, EDGE + 22 + i * 28, 260 + i * 32, 28, 2), i % 2 ? '#b8875a' : '#c89a64', 1), sh(rect(630 - i * 16, EDGE + 42 + i * 28, 260 + i * 32, 8), shade(WOOD, -0.12)));
}

// hanging things under the eave
scene(stroke(line([[690, EAVE + 16], [690, 400]]), '#3a3a40', 1.6), sh(circle(690, 440, 70), `url(#${ID}-glow)`, { opacity: 0.6 }));
target('lantern', 'Hanging lantern', place(lantern(80, '#c8322a'), { x: 690, y: 478 }));
target('chime', 'Wind chime', place(windChime(132), { x: 1066, y: EAVE + 16 }));
{
  // hanging basket of flowers
  const x = 876, y = 460, g = rng(13);
  scene(stroke(line([[x, EAVE + 16], [x - 34, y - 8]]) + line([[x, EAVE + 16], [x + 34, y - 8]]) + line([[x, EAVE + 16], [x, y - 8]]), '#5a4a3a', 1.2));
  let lf = '';
  for (let i = 0; i < 12; i++) lf += leaf(x + g.range(-30, 30), y - 6, g.range(18, 34), 5, g.range(-150, -30)) + leaf(x + g.range(-34, 34), y, g.range(16, 30), 4, g.range(40, 140));
  scene(sh(lf, '#4f7a40'), ol(M(x - 40, y - 8) + Q(x, y + 44, x + 40, y - 8) + 'Z', '#8a5c38', 1));
  for (let i = 0; i < 9; i++) scene(...flower(x + g.range(-36, 36), y - g.range(6, 30), 7, g.pick(['#e8558f', '#f6d24a', '#f08a4b', '#fbf6ec'])));
}
scene(place(bird(26, '#c8643a', '#8a4a2a', '#f1dcc0'), { x: 500, y: 76 }));

// =====================================================================
// on the porch
// =====================================================================
target('rod', 'Fishing rod', place(fishingRod(410), { x: 438, y: 1056, rot: -15 }));
scene(place(fishingRod(360, '#6a4a3a'), { x: 452, y: 1052, rot: -24 }));
scene(sh(circle(686, 762, 4), '#3a2a26'));
target('creel', 'Wicker creel', place(creel(62), { x: 686, y: 836 }));
// firewood
scene(sh(rect(1076, 1040, 124, 10), '#2a1820', { opacity: 0.3 }), place(woodStack(4, 7, 17, 5), { x: 1078, y: 1054 }), ol(rect(1070, 838, 10, 216, 2), '#7a5030', 1));
// rocking chairs
scene(shadow(770, 1094, 130, 10, 0.25), place(rockingChair(170, '#9a6238', '#c8553a'), { x: 770, y: 1090 }));
target('book', 'Open book', place(openBook(60, '#2f5a80'), { x: 762, y: 1000, sy: 0.62, rot: -6 }));
scene(shadow(966, 1098, 130, 10, 0.25), place(rockingChair(170, '#8a5632', '#5f8a7a'), { x: 966, y: 1094 }));
target('banjo', 'Banjo', place(banjo(196), { x: 950, y: 1002, rot: 13 }));
// braided rug and the dog
{
  const cx = 540, cy = 1104;
  scene(ol(ellipse(cx, cy, 128, 24), '#b8523a', 1), stroke(ellipse(cx, cy, 108, 19), '#f1dcb0', 3), stroke(ellipse(cx, cy, 88, 14.5), '#5f8a7a', 4), stroke(ellipse(cx, cy, 66, 10), '#e8a85a', 3), sh(ellipse(cx, cy, 46, 6), '#b8523a'));
}
target('dog', 'Sleeping dog', place(sleepingDog(172), { x: 548, y: 1110 }));
target('yarn', 'Ball of yarn', place(yarnBall(17, '#c8527a'), { x: 682, y: 1116 }));
scene(place(lantern(72, '#3f7d6e'), { x: 396, y: 1134 }));
target('pie', 'Cherry pie', place(pie(74), { x: 792, y: 777 }));
scene(ol(rect(900, 752, 40, 24, 3), '#c8553a', 1), sh(leaf(912, 752, 30, 8, -110) + leaf(920, 752, 36, 8, -90) + leaf(928, 752, 30, 8, -66), '#4f8a48'));
target('boots', 'Rubber boots', place(rubberBoots(60, '#3f7d5a'), { x: 846, y: EDGE + 50 }));
target('bobber', 'Red bobber', place(bobber(34), { x: 690, y: EDGE + 62, rot: 24 }));

// =====================================================================
// tall pine and hammock on the left
// =====================================================================
{
  scene(ol(poly([[18, 1060], [74, 1060], [62, 0], [30, 0]]), '#6a4630', 1.2), sh(poly([[18, 1060], [36, 1060], [38, 0], [30, 0]]), '#ffb070', { opacity: 0.25 }));
  const g = rng(31);
  let bk = '';
  for (let i = 0; i < 30; i++) { const y = g.range(380, 1040), x = g.range(30, 64); bk += line([[x, y], [x + g.range(-3, 3), y + g.range(14, 36)]]); }
  scene(stroke(bk, '#4a2e1e', 1.6), sh(blob([[8, 1064], [46, 1048], [88, 1064], [46, 1074]], 0.9), '#5a7a3a'));
  scene(place(pine(760, '#2f5446', 33), { x: 46, y: 420 }));
  // hammock
  const a: Pt = [62, 792], b: Pt = [350, 756], l: Pt = [112, 812], r: Pt = [312, 782];
  scene(stroke(line([a, l]) + line([a, [l[0] + 6, l[1] + 16]]) + line([a, [l[0] + 14, l[1] + 30]]) + line([b, r]) + line([b, [r[0] - 6, r[1] + 18]]) + line([b, [r[0] - 14, r[1] + 34]]), '#e8dcc0', 1.6));
  const stripes = ['#f1e2c0', '#d8684a', '#f1e2c0', '#5f8a8a', '#f1e2c0', '#e8a85a', '#f1e2c0'];
  for (let i = 0; i < stripes.length; i++) {
    const c0 = 876 + i * 12.6, c1 = c0 + 12.6;
    scene(sh(M(l[0], l[1]) + Q(214, c1, r[0], r[1]) + Q(214, c0, l[0], l[1]) + 'Z', stripes[i]));
  }
  scene(stroke(M(l[0], l[1]) + Q(214, 965, r[0], r[1]), '#8a5a3a', 2), stroke(M(l[0], l[1]) + Q(214, 876, r[0], r[1]), '#8a5a3a', 1.4));
  let fr = '';
  for (let i = 1; i < 16; i++) { const t = i / 16, x = (1 - t) * (1 - t) * l[0] + 2 * (1 - t) * t * 214 + t * t * r[0], y = (1 - t) * (1 - t) * l[1] + 2 * (1 - t) * t * 965 + t * t * r[1]; fr += line([[x, y], [x, y + 9]]); }
  scene(stroke(fr, '#f1e2c0', 1.6), ol(blob([[130, 826], [150, 812], [178, 826], [170, 846], [140, 846]], 0.9), '#f4ead2', 1), stroke(line([[142, 830], [168, 832]]), '#d8684a', 2));
  scene(sh(circle(a[0], a[1], 4) + circle(b[0], b[1], 4), '#3a3a40'));
}

// =====================================================================
// the yard: camp table, fishing gear, chopping block
// =====================================================================
{
  const g = rng(41);
  // stepping stones down to the lake
  for (const [x, y, rx] of [[760, 1262, 62], [700, 1316, 54], [616, 1356, 50], [520, 1372, 46], [430, 1346, 42], [366, 1290, 36], [330, 1222, 30], [300, 1150, 26], [262, 1086, 22], [236, 1030, 18], [222, 980, 15], [214, 934, 12]] as [number, number, number][]) scene(ol(ellipse(x, y, rx, rx * 0.32), g.pick(['#b8aa98', '#a89a8a', '#c8baa8']), 1, -0.3), sh(ellipse(x - rx * 0.2, y - rx * 0.08, rx * 0.5, rx * 0.1), '#ffd8a0', { opacity: 0.35 }));
  for (let i = 0; i < 110; i++) {
    const x = g.range(0, W), y = g.range(SHORE + 30, H);
    if (x > 300 && y < 1250) continue;
    const s = 0.7 + (y - SHORE) / 560;
    if (g.next() < 0.68) scene(tuft(x, y, s, g.pick(['#5f8a44', '#7a9a4a', '#4a7038', '#9aaa52'])));
    else scene(stroke(line([[x, y], [x + 1, y - 13 * s]]), '#4a7038', 1.4), ...flower(x + 1, y - 14 * s, 4.6 * s, g.pick(['#f6d24a', '#fbf6ec', '#e8558f', '#b07ad0', '#f08a4b'])));
  }
  for (let i = 0; i < 18; i++) { const x = g.range(20, 1180), y = g.range(900, 1480); scene(sh(circle(x, y, 7), '#fff0a0', { opacity: 0.22 }), sh(circle(x, y, 2.2), '#fffbd0')); }
}
{
  // folding camp table with the stove
  const x0 = 96, x1 = 330, ty = 1236;
  scene(shadow((x0 + x1) / 2, 1352, 130, 12, 0.25), stroke(line([[x0 + 24, ty + 8], [x1 - 30, 1350]]) + line([[x1 - 24, ty + 8], [x0 + 30, 1350]]), '#5a5a62', 6), sh(circle((x0 + x1) / 2, (ty + 8 + 1350) / 2, 5), '#3a3a40'));
  scene(ol(rect(x0, ty, x1 - x0, 13, 3), '#b8875a', 1.2), sh(rect(x0, ty, x1 - x0, 4, 2), '#ffd8a0', { opacity: 0.4 }));
  scene(place(campStove(130), { x: 192, y: ty }));
  target('kettle', 'Blue kettle', place(kettle(84), { x: 172, y: ty - 41 }));
  scene(stroke(curve([[174, ty - 124], [164, ty - 156], [182, ty - 186], [170, ty - 218]]), '#ffffff', 4, { opacity: 0.4 }), stroke(curve([[190, ty - 118], [198, ty - 146], [186, ty - 170]]), '#ffffff', 3, { opacity: 0.3 }));
  target('mug', 'Enamel mug', place(enamelMug(46), { x: 296, y: ty + 2 }));
  scene(ol(rect(42, 1296, 50, 60, 6), '#c8322a', 1.2), ol(rect(56, 1284, 22, 14, 3), '#3a3a40', 0.8, 0.3), sh(rect(42, 1318, 50, 12), '#f4ead2'));
}
scene(shadow(1004, 1326, 70, 8));
target('tackle', 'Tackle box', place(tackleBox(112, '#3f7d6e'), { x: 1000, y: 1326 }));
target('net', 'Landing net', place(landingNet(240), { x: 846, y: 1452, rot: 66 }));
{
  // chopping block, hatchet, kindling
  scene(shadow(1130, 1420, 70, 10), ol(rect(1078, 1340, 104, 78, 8), '#7a5030', 1.2), ol(ellipse(1130, 1342, 52, 16), '#e2bc84', 1.2, -0.4), stroke(ellipse(1130, 1342, 34, 10) + ellipse(1130, 1342, 17, 5), '#b8894f', 1));
  target('hatchet', 'Hatchet', place(axe(92), { x: 1166, y: 1262, rot: -128 }));
  for (const [x, y, r] of [[1010, 1440, 14], [1060, 1462, -20], [1150, 1470, 6]] as [number, number, number][]) scene(ol(place([sh(rect(-34, -7, 68, 14, 3), '#d9b07a')], { x, y, rot: r })[0].d, '#d9b07a', 1), sh(place([sh(ellipse(34, 0, 4, 7), '#f1d6a8')], { x, y, rot: r })[0].d, '#f1d6a8'));
  scene(place(rock(80, '#a89a8a', 3), { x: 560, y: 1490 }), place(rock(46, '#b8aa98', 4), { x: 616, y: 1496 }));
  const g = rng(51);
  for (const [fx, fy] of [[380, 1480], [1180, 1250], [30, 1440], [700, 1470]] as Pt[]) { let f = ''; for (let i = 0; i < 9; i++) f += leaf(fx, fy, g.range(36, 60), 6, -160 + i * 17.5); scene(sh(f, g.pick(['#3f6a40', '#4a7a44']))); }
}

const activity: FindActivity = {
  id: 'parks-find-3', version: 1, mode: 'find', title: 'Mountain Cabin Porch',
  blurb: 'Golden light spills across the lake as the kettle sings: find sixteen cosy things around the rocking chairs, the hammock and the porch steps.',
  collectionId: 'parks', categories: ["Nature", "Travel"], difficulty: 'Detailed',
  added: '2026-11-26',
  width: W, height: H, defs, items,
};
export default activity;
