import { rect, ellipse, circle, poly, line, curve, blob, leaf, sh, stroke, place, shade, rng, linearGradient } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { FindActivity, FindItem } from '../types';
import {
  M, Q, ol, shadow, pine, peaks, cloud, rock, tuft, flower, logWall, logEnds, woodStack, rangerHat, binoculars, trailMap, compass, backpack, snowshoes, paddle,
  lantern, deer, bird, canteen, hikingBoots, thermos, pineCone, trailSign, squirrel, axe, type Pt,
} from './props-find';

const ID = 'parks-find-1';
const W = 1200, H = 1500;
const items: FindItem[] = [];
const scene = (...s: (Shape | Shape[])[]) => { items.push({ shapes: s.flat() }); };
const target = (id: string, name: string, shapes: Shape[]) => { items.push({ id, name, target: true, shapes }); };

const GROUND = 870, LOG = '#a8703c', ROOF = '#96503a', TRIM = '#f1e6c8', DOOR = '#4f7a5a', WOOD = '#8a5c38';
const PINE = '#2f5f4a', PINE2 = '#3f7256', PINE3 = '#28523f';

const defs =
  linearGradient(`${ID}-sky`, [[0, '#6fb0dc'], [0.55, '#b4dcee'], [1, '#eef4e2']]) +
  linearGradient(`${ID}-ground`, [[0, '#8ab262'], [1, '#5f9048']]);

// =====================================================================
// sky, peaks and forest
// =====================================================================
scene(sh(rect(0, 0, W, GROUND + 20), `url(#${ID}-sky)`));
scene(place(cloud(260), { x: 180, y: 150 }), place(cloud(200, '#ffffff', 0.8), { x: 620, y: 96 }), place(cloud(300), { x: 1010, y: 190 }), place(cloud(150, '#ffffff', 0.7), { x: 420, y: 250 }));
{
  const g = rng(3);
  for (let i = 0; i < 5; i++) { const x = g.range(480, 800), y = g.range(120, 220), s = g.range(10, 16); scene(stroke(M(x - s, y) + Q(x - s / 2, y - s * 0.6, x, y) + Q(x + s / 2, y - s * 0.6, x + s, y), '#4a5a6a', 1.8)); }
}
scene(peaks([[0, 470], [70, 410], [140, 440], [230, 330], [300, 392], [370, 262], [450, 372], [520, 318], [600, 400], [690, 286], [760, 352], [840, 250], [930, 380], [1010, 322], [1100, 410], [1200, 350]], 640, '#8a9cc4', '#f8fafe', 345));
scene(peaks([[0, 540], [120, 470], [220, 520], [330, 440], [440, 510], [560, 452], [680, 530], [800, 460], [930, 524], [1060, 470], [1200, 520]], 660, '#6f8eaa', '#f8fafe', 0));
{
  // forested slopes: three ranks of small conifers
  const g = rng(5);
  const ranks: [number, string, number][] = [[600, '#5a8a72', 26], [660, '#477a62', 34], [730, '#3a6a54', 46]];
  for (const [y, c, hh] of ranks) {
    const top: Pt[] = [[0, y + 40]];
    for (let x = 0; x <= W; x += 100) top.push([x, y + Math.sin(x / 170 + y) * 16]);
    scene(sh(poly([...top, [W, y + 40], [W, GROUND + 20], [0, GROUND + 20]]), c));
    let a = '', b = '';
    for (let x = -10; x < W + 10; x += g.range(hh * 0.34, hh * 0.6)) {
      const by = y + Math.sin(x / 170 + y) * 16 + g.range(4, 26), h = hh * g.range(0.8, 1.4), d = poly([[x - h * 0.3, by], [x, by - h], [x + h * 0.3, by]]);
      if (g.next() < 0.5) a += d; else b += d;
    }
    scene(sh(a, shade(c, -0.1)), sh(b, shade(c, 0.08)));
  }
}
// meadow
scene(sh(blob([[0, H], [0, GROUND - 6], [200, GROUND - 20], [420, GROUND - 4], [660, GROUND - 14], [900, GROUND], [1200, GROUND - 16], [1200, H]], 0.5), `url(#${ID}-ground)`));
scene(sh(blob([[0, GROUND + 60], [0, GROUND - 6], [200, GROUND - 20], [420, GROUND - 4], [660, GROUND - 14], [900, GROUND], [1200, GROUND - 16], [1200, GROUND + 50], [600, GROUND + 80]], 0.5), '#9cc070', { opacity: 0.6 }));

// tall pines behind the station
scene(place(pine(600, PINE2, 11), { x: 300, y: 900 }), place(pine(660, PINE, 12), { x: 470, y: 900 }), place(pine(560, PINE2, 13), { x: 640, y: 890 }), place(pine(720, PINE, 14), { x: 870, y: 900 }));
scene(place(pine(600, PINE2, 15), { x: 1020, y: 900 }), place(pine(560, PINE3, 16), { x: 180, y: 905 }));
scene(place(pine(860, PINE, 17), { x: 30, y: 1000 }), place(pine(800, PINE3, 18), { x: 1150, y: 980 }));

// deer at the tree line
scene(shadow(130, 944, 70, 9, 0.2));
target('deer', 'Deer', place(deer(150), { x: 126, y: 944 }));
scene(tuft(70, 950, 1.3, '#5f8a48'), tuft(190, 952, 1.2, '#6f9a52'), tuft(110, 958, 1, '#7aa85a'));

// =====================================================================
// flagpole
// =====================================================================
{
  const x = 248, top = 236, base = 1010;
  scene(shadow(x + 8, base + 2, 30, 6), ol(rect(x - 4, top, 8, base - top, 3), '#e8e4da', 1, -0.3), sh(rect(x - 4, top, 3, base - top), '#ffffff', { opacity: 0.6 }), ol(circle(x, top - 6, 8), '#d9b45a', 1));
  scene(ol(rect(x - 16, base - 10, 32, 14, 3), '#9a9488', 1), ol(rect(x - 11, base - 20, 22, 12, 3), '#b0aaa0', 1));
  scene(stroke(line([[x + 5, top + 12], [x + 7, base - 60]]), '#8a8478', 1));
  const fy = top + 14, flag = M(x + 4, fy) + Q(x + 44, fy - 14, x + 78, fy) + Q(x + 104, fy + 10, x + 132, fy - 2) + L2(x + 132, fy + 76) + Q(x + 104, fy + 88, x + 78, fy + 78) + Q(x + 44, fy + 64, x + 4, fy + 78) + 'Z';
  scene(ol(flag, '#3f7256', 1.2), sh(M(x + 4, fy + 56) + Q(x + 44, fy + 42, x + 78, fy + 56) + Q(x + 104, fy + 66, x + 132, fy + 54) + L2(x + 132, fy + 76) + Q(x + 104, fy + 88, x + 78, fy + 78) + Q(x + 44, fy + 64, x + 4, fy + 78) + 'Z', '#e8c05a'));
  scene(sh(circle(x + 66, fy + 26, 20), TRIM), sh(poly([[x + 66, fy + 9], [x + 76, fy + 24], [x + 56, fy + 24]]) + poly([[x + 66, fy + 18], [x + 79, fy + 36], [x + 53, fy + 36]]) + rect(x + 64, fy + 36, 4, 6), '#3f7256'), sh(M(x + 78, fy) + Q(x + 104, fy + 10, x + 132, fy - 2) + L2(x + 132, fy + 76) + Q(x + 104, fy + 88, x + 78, fy + 78) + 'Z', '#000000', { opacity: 0.1 }));
}
function L2(x: number, y: number) { return `L${Math.round(x * 10) / 10} ${Math.round(y * 10) / 10}`; }

// =====================================================================
// the log station
// =====================================================================
const WX0 = 360, WX1 = 960, WTOP = 620, FLOOR = 1040, EAVE = 676;
{
  // stone chimney and smoke
  const g = rng(21);
  scene(ol(rect(800, 372, 64, 120), '#9a9488', 1.2), ol(rect(792, 362, 80, 16, 3), '#7a756a', 1));
  for (let r = 0; r < 6; r++) for (let i = 0; i < 3; i++) scene(ol(rect(803 + i * 20 + (r % 2) * 4 - 2, 381 + r * 18, g.range(13, 17), 13, 4), g.pick(['#b0aaa0', '#8a8478', '#a39a8c', '#c0b8aa']), 0.6, -0.25));
  scene(stroke(curve([[832, 356], [820, 320], [846, 286], [830, 246], [852, 204]]), '#ffffff', 10, { opacity: 0.45 }), stroke(curve([[840, 350], [852, 318], [834, 290]]), '#ffffff', 6, { opacity: 0.35 }));
  // wall
  scene(logWall(WX0, WTOP, WX1, FLOOR, 28, LOG, 7));
  scene(sh(rect(WX0, EAVE + 12, WX1 - WX0, 110), '#1f160e', { opacity: 0.2 }), sh(rect(WX0, EAVE + 122, WX1 - WX0, 50), '#1f160e', { opacity: 0.08 }));
  scene(logEnds(WX0, WTOP + 56, FLOOR, 28, LOG), logEnds(WX1, WTOP + 56, FLOOR, 28, LOG));
  // main roof with shingle courses
  const rx = (y: number, side: number) => (side < 0 ? 390 - ((y - 452) / 160) * 60 : 930 + ((y - 452) / 160) * 60);
  scene(sh(poly([[330, 612], [990, 612], [930, 452], [390, 452]]), ROOF));
  for (let y = 452, i = 0; y < 612; y += 20, i++) {
    scene(sh(poly([[rx(y, -1), y], [rx(y, 1), y], [rx(y + 20, 1), y + 20], [rx(y + 20, -1), y + 20]]), shade(ROOF, i % 2 ? -0.06 : 0.05)));
    let ticks = '';
    for (let x = rx(y, -1) + 14 + (i % 2) * 15; x < rx(y, 1) - 6; x += 30) ticks += line([[x, y + 2], [x, y + 19]]);
    scene(stroke(ticks, shade(ROOF, -0.3), 1.2), sh(rect(rx(y + 20, -1), y + 17, rx(y + 20, 1) - rx(y + 20, -1), 3), shade(ROOF, -0.28), { opacity: 0.7 }));
  }
  scene(ol(rect(384, 444, 552, 12, 4), shade(ROOF, -0.2), 1));
  // dormer with a carved plaque
  scene(ol(poly([[606, 590], [714, 590], [714, 540], [660, 496], [606, 540]]), shade(LOG, 0.1), 1.2), stroke(line([[606, 556], [714, 556]]) + line([[606, 573], [714, 573]]), shade(LOG, -0.25), 1.2));
  scene(stroke(line([[594, 548], [660, 490], [726, 548]]), shade(ROOF, -0.25), 13), stroke(line([[596, 544], [660, 488], [724, 544]]), shade(ROOF, 0.08), 6));
  scene(ol(circle(660, 548, 25), TRIM, 2, -0.45), sh(poly([[660, 528], [672, 546], [648, 546]]) + poly([[660, 538], [675, 559], [645, 559]]) + rect(657, 559, 6, 8), PINE2));
  // porch roof and fascia
  scene(sh(poly([[330, 612], [990, 612], [1022, EAVE], [298, EAVE]]), shade(ROOF, -0.14)));
  for (let k = 0; k < 3; k++) { const y = 612 + k * 21.3, l = 330 - k * 10.7, r = 990 + k * 10.7; let ticks = ''; for (let x = l + 10 + (k % 2) * 16; x < r - 4; x += 32) ticks += line([[x, y + 2], [x, y + 20]]); scene(stroke(ticks, shade(ROOF, -0.36), 1.2), sh(rect(l, y, r - l, 3), shade(ROOF, -0.34), { opacity: 0.6 })); }
  scene(ol(rect(296, EAVE - 2, 728, 14, 3), shade(WOOD, -0.12), 1));
  // windows
  for (const wx of [392, 824]) {
    scene(ol(rect(wx - 22, 786, 22, 118, 2), DOOR, 1), ol(rect(wx + 104, 786, 22, 118, 2), DOOR, 1));
    let lou = '';
    for (let y = 796; y < 898; y += 12) lou += line([[wx - 19, y], [wx - 3, y]]) + line([[wx + 107, y], [wx + 123, y]]);
    scene(stroke(lou, shade(DOOR, -0.3), 1.4));
    scene(ol(rect(wx, 786, 104, 118, 3), TRIM, 1.2), sh(rect(wx + 8, 794, 88, 102), '#8fb8c8'), sh(poly([[wx + 8, 794], [wx + 50, 794], [wx + 8, 850]]), '#ffffff', { opacity: 0.3 }), sh(rect(wx + 8, 794, 88, 40), '#f6dc9c', { opacity: 0.35 }));
    scene(sh(M(wx + 8, 794) + Q(wx + 30, 830, wx + 8, 860) + 'Z', '#e86a5a', { opacity: 0.9 }) , sh(M(wx + 96, 794) + Q(wx + 74, 830, wx + 96, 860) + 'Z', '#e86a5a', { opacity: 0.9 }), sh(rect(wx + 49, 794, 6, 102) + rect(wx + 8, 842, 88, 5), TRIM));
    // flower box
    scene(ol(rect(wx - 6, 906, 116, 20, 3), WOOD, 1));
    const g2 = rng(wx);
    for (let i = 0; i < 9; i++) { const x = wx + 2 + i * 12.5, y = 902 - g2.range(0, 8); scene(sh(leaf(x, 906, 14, 4, -110) + leaf(x, 906, 14, 4, -60), '#4f8a48'), ...flower(x, y, 6.5, g2.pick(['#e8558f', '#f6d24a', '#fbf6ec', '#e8553a']))); }
  }
  // door
  scene(ol(rect(530, 794, 92, 246, 3), TRIM, 1.2), ol(rect(538, 802, 76, 238), DOOR, 1), stroke(line([[557, 880], [557, 1036]]) + line([[576, 880], [576, 1036]]) + line([[595, 880], [595, 1036]]), shade(DOOR, -0.25), 1.4));
  scene(ol(rect(548, 812, 56, 56, 3), '#8fb8c8', 1.4, -0.4), sh(rect(574, 812, 4, 56) + rect(548, 838, 56, 4), TRIM), sh(poly([[548, 812], [574, 812], [548, 838]]), '#ffffff', { opacity: 0.3 }), ol(circle(604, 936, 5), '#d9b45a', 0.8));
  // notice board of pictures under a little roof
  scene(ol(rect(650, 772, 156, 130, 3), shade(WOOD, -0.15), 1.2), sh(rect(658, 780, 140, 114), '#d9b888'), ol(poly([[640, 772], [816, 772], [804, 756], [652, 756]]), shade(ROOF, -0.1), 1));
  const pics: [number, number, number, number, string][] = [[664, 786, 40, 32, '#bfe0ee'], [710, 784, 34, 44, '#fbf6ec'], [750, 788, 42, 30, '#f6e2b0'], [664, 824, 40, 34, '#fbf6ec'], [750, 824, 42, 40, '#d6ecd0'], [666, 864, 36, 26, '#f6e2b0'], [708, 834, 36, 56, '#bfe0ee']];
  for (const [x, y, w, h, c] of pics) scene(sh(rect(x + 2, y + 2, w, h), '#000000', { opacity: 0.18 }), ol(rect(x, y, w, h), c, 0.8, -0.3), sh(circle(x + w / 2, y + 3, 2.2), '#c8322a'));
  scene(sh(poly([[666, 816], [680, 796], [690, 808], [698, 800], [702, 816]]), '#6f8eaa'), sh(circle(696, 794, 4), '#f2c14e'));
  scene(place(bird(22, '#c8322a', '#8c2b2b', '#f1dcc0'), { x: 726, y: 818 }), stroke(line([[714, 818], [740, 818]]), '#6b4a2f', 1.6));
  scene(sh(leaf(758, 812, 28, 9, -30), '#e8823a'), stroke(line([[758, 812], [782, 798]]), '#8a4a1a', 1));
  scene(sh(ellipse(684, 846, 7, 6) + circle(675, 836, 3) + circle(681, 833, 3) + circle(688, 833, 3) + circle(694, 836, 3), '#5a4a3a'));
  scene(sh(poly([[756, 860], [771, 834], [786, 860]]) + rect(769, 860, 4, 3), PINE2), ...flower(684, 877, 7, '#e8558f'), sh(leaf(714, 870, 24, 7, -10) + poly([[712, 870], [704, 864], [704, 876]]), '#3f8fbf'), stroke(curve([[712, 846], [726, 852], [718, 860], [738, 858]]), '#c8322a', 1.4));
  // bench
  scene(sh(rect(664, 988, 8, 52) + rect(790, 988, 8, 52), shade(WOOD, -0.2)), ol(rect(654, 980, 154, 12, 3), '#b8824a', 1), ol(rect(658, 950, 146, 9, 3), '#b8824a', 1), sh(rect(668, 958, 6, 24) + rect(788, 958, 6, 24), shade(WOOD, -0.1)));
  // posts and brackets
  for (const px of [350, 548, 772, 970]) scene(ol(rect(px - 9, EAVE + 12, 18, FLOOR - EAVE - 12), '#9a6a40', 1), sh(rect(px - 9, EAVE + 12, 5, FLOOR - EAVE - 12), '#ffffff', { opacity: 0.14 }), sh(poly([[px - 9, EAVE + 12], [px - 30, EAVE + 12], [px - 9, EAVE + 40]]) + poly([[px + 9, EAVE + 12], [px + 30, EAVE + 12], [px + 9, EAVE + 40]]), shade(WOOD, -0.05)));
  // porch floor, stone footing and steps
  scene(ol(rect(322, FLOOR, 676, 16, 2), '#c9a070', 1), sh(rect(322, FLOOR + 14, 676, 10), shade(WOOD, -0.1)));
  let pl = '';
  for (let x = 350; x < 990; x += 34) pl += line([[x, FLOOR + 1], [x, FLOOR + 14]]);
  scene(stroke(pl, '#9a7a50', 1));
  scene(sh(rect(336, FLOOR + 24, 648, 60), '#8a8478'));
  for (let r = 0; r < 3; r++) for (let x = 338 + (r % 2) * 18; x < 970; x += g.range(34, 52)) scene(ol(rect(x, FLOOR + 26 + r * 19, Math.min(g.range(28, 44), 980 - x), 16, 5), g.pick(['#b0aaa0', '#9a9488', '#a8a090', '#c0b8aa', '#8f887a']), 0.6, -0.25));
  for (let i = 0; i < 3; i++) scene(ol(rect(566 - i * 12, FLOOR + 22 + i * 22, 188 + i * 24, 22, 2), i % 2 ? '#b8905c' : '#c9a070', 1), sh(rect(566 - i * 12, FLOOR + 38 + i * 22, 188 + i * 24, 6), shade(WOOD, -0.1)));
  scene(ol(rect(546, FLOOR - 4, 60, 7, 2), '#c8522a', 0.8), sh(rect(552, FLOOR - 3, 4, 5) + rect(566, FLOOR - 3, 4, 5) + rect(580, FLOOR - 3, 4, 5) + rect(594, FLOOR - 3, 4, 5), '#f1e6c8'));
}
// things on the porch
scene(stroke(line([[632, EAVE + 12], [632, 706]]), '#3a3a40', 1.6));
target('lantern', 'Oil lantern', place(lantern(62, '#c8322a'), { x: 632, y: 770 }));
scene(sh(circle(548, 846, 4), '#3a3a40'));
target('binoculars', 'Binoculars', place(binoculars(40, '#3a4a3a'), { x: 548, y: 900 }));
target('map', 'Trail map', place(trailMap(62), { x: 694, y: 974, sy: 0.62, rot: -4 }));
target('hat', 'Ranger hat', place(rangerHat(66), { x: 762, y: 976 }));
target('thermos', 'Thermos flask', place(thermos(48, '#3f7d6e'), { x: 638, y: FLOOR + 2 }));
scene(place(backpack(76, '#3f6fa8', '#8fb07a'), { x: 906, y: FLOOR + 2 }));
target('squirrel', 'Squirrel', place(squirrel(48), { x: 446, y: 644 }));
target('paddle', 'Canoe paddle', place(paddle(236, '#c98a4a', '#3f8fa3'), { x: 318, y: 868, rot: -5 }));
target('snowshoes', 'Snowshoes', place(snowshoes(112), { x: 452, y: FLOOR + 30 }));
target('boots', 'Hiking boots', place(hikingBoots(42), { x: 724, y: FLOOR + 44 }));
// firewood and axe at the corner
scene(shadow(1012, 1128, 50, 7), place(woodStack(4, 3, 11, 3), { x: 972, y: 1128 }), place(axe(70), { x: 1066, y: 1126, rot: 18 }));

// =====================================================================
// trailhead kiosk with the big map
// =====================================================================
{
  const x0 = 1046, x1 = 1184, top = 884;
  scene(shadow((x0 + x1) / 2, 1104, 80, 8), sh(rect(x0 + 2, top, 12, 220) + rect(x1 - 14, top, 12, 220), WOOD), ol(rect(x0 + 10, top + 16, x1 - x0 - 20, 124, 2), '#f4ead0', 1.4, -0.45));
  scene(sh(blob([[x0 + 20, top + 30], [x0 + 60, top + 24], [x0 + 70, top + 60], [x0 + 30, top + 70]], 0.9), '#a9cc94'), sh(blob([[x0 + 76, top + 80], [x0 + 112, top + 74], [x0 + 118, top + 110], [x0 + 84, top + 118]], 0.9), '#8fc4e0'), stroke(curve([[x0 + 96, top + 76], [x0 + 88, top + 50], [x0 + 104, top + 26]]), '#8fc4e0', 2.4));
  let dots = '';
  for (let i = 0; i < 14; i++) dots += circle(x0 + 22 + i * 7, top + 122 - Math.sin(i / 2.2) * 16 - i * 5, 1.6);
  scene(sh(dots, '#c8322a'), sh(poly([[x0 + 30, top + 62], [x0 + 38, top + 42], [x0 + 46, top + 62]]) + poly([[x0 + 46, top + 56], [x0 + 54, top + 38], [x0 + 62, top + 56]]), '#4f7d4a'), sh(poly([[x0 + 72, top + 48], [x0 + 84, top + 26], [x0 + 96, top + 48]]), '#b0a08a'), sh(circle(x0 + 30, top + 118, 4), '#c8322a'));
  scene(ol(poly([[x0 - 14, top + 6], [x1 + 14, top + 6], [x1 - 4, top - 22], [x0 + 4, top - 22]]), shade(ROOF, -0.05), 1.2), stroke(line([[x0 - 6, top - 4], [x1 + 6, top - 4]]), shade(ROOF, -0.3), 1.2));
  scene(ol(rect(x0 + 16, top + 148, x1 - x0 - 32, 26, 2), '#b8824a', 1), sh(rect(x0 + 24, top + 154, 22, 14, 1) + rect(x0 + 52, top + 154, 22, 14, 1) + rect(x0 + 80, top + 154, 22, 14, 1), '#f4ead0'));
  target('blue-jay', 'Blue jay', place(bird(46, '#4a7ac8', '#2f5aa8', '#eef0f6', true), { x: 1104, y: top - 22 }));
}

// =====================================================================
// path, canoe rack, signpost and foreground
// =====================================================================
scene(sh(blob([[566, 1120], [760, 1120], [800, 1240], [930, 1500], [330, 1500], [500, 1250]], 0.6), '#cdb083'), sh(blob([[600, 1140], [730, 1140], [770, 1260], [840, 1500], [430, 1500], [540, 1260]], 0.6), '#d9c096', { opacity: 0.8 }));
{
  const g = rng(41);
  for (let i = 0; i < 46; i++) { const y = g.range(1140, 1490), half = 80 + (y - 1120) * 0.52, x = 650 + g.range(-1, 1) * half * 0.9; scene(sh(ellipse(x, y, g.range(3, 8), g.range(2, 4)), g.pick(['#b89a6c', '#a88a60', '#e6d2ae', '#9a9488']), { opacity: 0.85 })); }
  // grass tufts and wild flowers over the meadow
  for (let i = 0; i < 120; i++) {
    const x = g.range(0, W), y = g.range(GROUND + 60, H), half = 90 + Math.max(0, y - 1120) * 0.55;
    if (y > 1110 && Math.abs(x - 650) < half) continue;
    if (y < 1130 && x > 320 && x < 1000) continue;
    const s = 0.7 + (y - GROUND) / 600;
    if (g.next() < 0.7) scene(tuft(x, y, s, g.pick(['#5f8a48', '#7aa85a', '#4f7a40', '#8ab862'])));
    else scene(stroke(line([[x, y], [x + 1, y - 12 * s]]), '#4f7a40', 1.4), ...flower(x + 1, y - 13 * s, 4.5 * s, g.pick(['#f6d24a', '#fbf6ec', '#e8558f', '#9a7ad0', '#f08a4b'])));
  }
}
{
  // canoe rack
  const x0 = 24, x1 = 318;
  scene(shadow(170, 1346, 170, 12));
  scene(stroke(line([[x0 + 30, 1340], [x0 + 46, 1130]]) + line([[x1 - 30, 1340], [x1 - 46, 1130]]), WOOD, 12), stroke(line([[x0 + 70, 1340], [x0 + 46, 1130]]) + line([[x1 - 70, 1340], [x1 - 46, 1130]]), shade(WOOD, -0.2), 9));
  const canoe = (y: number, col: string, stripe: string) => {
    scene(ol(M(x0, y + 52) + Q(x0 + 14, y + 4, x0 + 80, y) + L2(x1 - 80, y) + Q(x1 - 14, y + 4, x1, y + 52) + Q((x0 + x1) / 2, y + 36, x0, y + 52) + 'Z', col, 1.4));
    scene(stroke(M(x0 + 6, y + 44) + Q((x0 + x1) / 2, y + 28, x1 - 6, y + 44), stripe, 4), stroke(M(x0 + 30, y + 14) + Q((x0 + x1) / 2, y + 2, x1 - 30, y + 14), '#ffffff', 3, { opacity: 0.3 }), stroke(line([[x0 + 100, y + 2], [x0 + 100, y + 32]]) + line([[x1 - 100, y + 2], [x1 - 100, y + 32]]), shade(col, -0.25), 1.2));
  };
  scene(stroke(line([[x0 + 20, 1198], [x1 - 20, 1198]]), shade(WOOD, 0.1), 9));
  canoe(1140, '#c8442e', '#f1e6c8');
  scene(stroke(line([[x0 + 16, 1284], [x1 - 16, 1284]]), shade(WOOD, 0.1), 9));
  canoe(1226, '#3f8f6a', '#f2c14e');
  scene(place(rock(70, '#9a9488', 3), { x: 330, y: 1352 }), place(rock(44, '#b0aaa0', 4), { x: 372, y: 1364 }));
}
target('pine-cone', 'Pine cone', place(pineCone(42), { x: 206, y: 1424, rot: -20 }));
scene(place(pineCone(26, '#7a5030'), { x: 96, y: 1462, rot: 30 }));
{
  // signpost
  const x = 1004;
  scene(shadow(x + 10, 1456, 44, 8), ol(rect(x - 9, 1150, 18, 306, 3), WOOD, 1.2), sh(rect(x - 9, 1150, 5, 306), '#ffffff', { opacity: 0.14 }), ol(poly([[x - 12, 1152], [x + 12, 1152], [x, 1134]]), shade(WOOD, -0.15), 1));
  scene(place(trailSign(170, '#b8824a', 'hiker'), { x: x + 52, y: 1194, rot: -3 }), place(trailSign(160, '#a8703c', 'tent'), { x: x - 46, y: 1258, sx: -1, rot: 2 }));
  target('fire-sign', 'Campfire sign', place(trailSign(164, '#c08a50', 'fire'), { x: x + 50, y: 1322, rot: 2 }));
  scene(sh(circle(x - 2, 1376, 3), '#3a3a40'));
  target('canteen', 'Canteen', place(canteen(60, '#5f7a4a'), { x: x - 4, y: 1426 }));
  scene(place(rock(90, '#a39a8c', 7), { x: 1120, y: 1470 }), place(rock(50, '#8f887a', 8), { x: 1066, y: 1484 }));
  target('compass', 'Compass', place(compass(17), { x: 1118, y: 1404 }));
}
target('backpack', 'Red backpack', place(backpack(104, '#c8322a'), { x: 846, y: 1132 }));
{
  // stump seat, ferns and a butterfly in the near corner
  scene(shadow(470, 1420, 60, 9), ol(rect(424, 1360, 92, 60, 8), '#8a5c38', 1.2), ol(ellipse(470, 1362, 46, 15), '#e2bc84', 1.2, -0.4), stroke(ellipse(470, 1362, 30, 9) + ellipse(470, 1362, 15, 4), '#b8894f', 1), stroke(line([[440, 1380], [442, 1414]]) + line([[468, 1384], [466, 1416]]) + line([[496, 1380], [498, 1412]]), shade(WOOD, -0.3), 1.2));
  const g = rng(51);
  for (const [fx, fy] of [[60, 1380], [300, 1470], [1170, 1300], [900, 1420]] as Pt[]) { let f = ''; for (let i = 0; i < 9; i++) f += leaf(fx, fy, g.range(36, 58), 6, -160 + i * 17.5); scene(sh(f, g.pick(['#3f7a48', '#4f8a50']))); }
  scene(sh(blob([[620, 1300], [632, 1288], [640, 1300], [632, 1306]], 0.9) + blob([[644, 1300], [652, 1288], [664, 1300], [652, 1306]], 0.9), '#f08a2b'), stroke(line([[642, 1294], [642, 1308]]), '#2a2420', 1.6));
  scene(sh(blob([[250, 1090], [260, 1080], [267, 1090], [260, 1096]], 0.9) + blob([[270, 1090], [277, 1080], [287, 1090], [277, 1096]], 0.9), '#f6d24a'), stroke(line([[268, 1085], [268, 1097]]), '#2a2420', 1.4));
}

const activity: FindActivity = {
  id: 'parks-find-1', version: 1, mode: 'find', title: 'The Ranger Station',
  blurb: 'A snug log station sits among the tall pines: find sixteen trail treasures around the porch, the canoe rack and the signpost.',
  collectionId: 'parks', categories: ["Nature", "Travel"], difficulty: 'Moderate',
  added: '2026-11-26',
  width: W, height: H, defs, items,
};
export default activity;
