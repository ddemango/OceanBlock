import { rect, ellipse, circle, poly, line, curve, blob, waveBand, sh, stroke, place, rng, linearGradient, radialGradient } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { FindActivity, FindItem } from '../types';
import { rosette, planks, hayBale, barrel, lantern, rake, tree, pumpkin, boots, shadow, ol } from '../seasons/props-find';
import { sack, sittingCat, mouse, apple, egg, jar, tin } from '../kitchen/props-find';
import {
  F, hayPile, strewnStraw, railFence, cropRows, chicken, chick, cowFront, horseHead, swallow, swallowNest, barnOwl, milkChurn, bucket, strawHat, wagonWheel,
  vegString, shelf, pitchfork, spade, sickle, handSaw, ropeCoil, horseshoe, saddle, bridle, cowbell, milkingStool, ladder, cobweb, produceCrate, trough,
} from './props-find';

const ID = 'farm-find-3';
const W = 1200, H = 1500;
const items: FindItem[] = [];
const scene = (...s: (Shape | Shape[])[]) => { items.push({ shapes: s.flat() }); };
const target = (id: string, name: string, shapes: Shape[]) => { items.push({ id, name, target: true, shapes }); };
const at = (s: Shape[], x: number, y: number, k = 1, rot = 0, flip = false) => place(s, { x, y, sx: flip ? -k : k, sy: k, rot });

const defs =
  linearGradient(`${ID}-sky`, [[0, '#a9d0e6'], [0.7, '#e6f0e0'], [1, '#fbf0c8']]) +
  linearGradient(`${ID}-floor`, [[0, '#a8825a'], [1, '#c29a6c']]) +
  radialGradient(`${ID}-glow`, [[0, '#ffe9a8'], [1, '#ffe9a800']]);

const WALL = '#9a4a36', BEAM = '#6f4a2c', BEAM_DK = '#553622';

// =====================================================================
// roof, gable wall and timbers
// =====================================================================
scene(sh(rect(0, 0, W, 300), '#4a3024'));
{
  // roof boards and rafters running down from the ridge
  let bd = '', rf = '';
  for (let i = 1; i < 9; i++) { const y = 250 - i * 34; bd += line([[0, y], [600, y - 220]]) + line([[1200, y], [600, y - 220]]); }
  for (let i = 0; i < 4; i++) { const y = 250 - 62 - i * 70; rf += line([[0, y], [600, y - 220]]) + line([[1200, y], [600, y - 220]]); }
  scene(stroke(bd, '#3a241a', 1.4), stroke(rf, '#6a4630', 12), stroke(rf, '#7d5638', 4));
}
// gable wall
scene(sh(poly([[0, 250], [600, 30], [1200, 250], [1200, 1110], [0, 1110]]), WALL));
scene(planks(0, 250, W, 860, 34, WALL, 4, true));
{
  let gl = '';
  for (let i = 1; i < 34; i++) { const x = (W * i) / 34, y = 250 - (1 - Math.abs(x - 600) / 600) * 220; gl += line([[x, y + 4], [x, 252]]); }
  scene(stroke(gl, '#7a3626', 1.2), sh(poly([[0, 250], [600, 30], [1200, 250], [1200, 300], [600, 80], [0, 300]]), '#000000', { opacity: 0.2 }));
}
scene(sh(rect(0, 250, W, 860), '#2a1408', { opacity: 0.16 }));
// round loft window with morning light
scene(sh(circle(600, 158, 110), `url(#${ID}-glow)`, { opacity: 0.7 }), ol(circle(600, 158, 58), BEAM, 1.4), sh(circle(600, 158, 46), `url(#${ID}-sky)`), sh(circle(600, 174, 20), '#fff3c0', { opacity: 0.8 }), stroke(line([[554, 158], [646, 158]]) + line([[600, 112], [600, 204]]), BEAM, 6));
// gable edge beams, tie beam and posts
scene(stroke(line([[0, 250], [600, 30], [1200, 250]]), BEAM_DK, 22), stroke(line([[0, 244], [600, 24], [1200, 244]]), BEAM, 8));
scene(ol(rect(430, 92, 22, 170), BEAM, 1.2), ol(rect(748, 92, 22, 170), BEAM, 1.2));
scene(stroke(line([[452, 250], [540, 190]]) + line([[748, 250], [660, 190]]) + line([[430, 250], [330, 170]]) + line([[770, 250], [870, 170]]), BEAM_DK, 14));
scene(ol(rect(0, 250, W, 34), BEAM, 1.4), sh(rect(0, 250, W, 7), '#8a6038'), sh(rect(0, 277, W, 7), BEAM_DK));
{
  let kn = '';
  const g = rng(3);
  for (let i = 0; i < 16; i++) kn += line([[g.range(0, 1150), 262 + g.range(0, 12)], [g.range(0, 60) + i * 70, 262 + g.range(0, 12)]].sort((a, b) => a[0] - b[0]).map(([x, y], k, arr) => [k ? Math.min(x, arr[0][0] + 50) : x, y] as [number, number]));
  scene(stroke(kn, BEAM_DK, 1, { opacity: 0.6 }));
}
scene(place([cobweb(110)], { x: 0, y: 284 }), place([cobweb(90)], { x: 1200, y: 284, sx: -1, sy: 1 }), place([cobweb(60)], { x: 452, y: 96 }));
// light shafts from the window
scene(sh(poly([[570, 190], [630, 190], [560, 1100], [300, 1100]]), '#fff3c0', { opacity: 0.07 }), sh(poly([[590, 196], [640, 190], [860, 1100], [640, 1100]]), '#fff3c0', { opacity: 0.06 }));

// swallows in the rafters
scene(at(swallow(64), 250, 120, 1, -60), at(swallow(54), 960, 96, 1, 50), at(swallow(46), 1090, 190, 1, 100), at(swallow(40), 120, 196, 1, -100));
target('nest', "Swallows' nest", at(swallowNest(62), 880, 284));
target('owl', 'Barn owl', at(barnOwl(78), 190, 250));

// =====================================================================
// barn doorway with the morning outside
// =====================================================================
{
  const x0 = 540, x1 = 770, y0 = 560, y1 = 1104;
  scene(sh(rect(x0, y0, x1 - x0, y1 - y0), `url(#${ID}-sky)`));
  scene(sh(circle(700, 800, 34), '#fff3c0'), sh(circle(700, 800, 60), '#fff3c0', { opacity: 0.35 }));
  scene(sh(waveBand(x0, x1, 820, 10, 300, y1, 1), '#a9c6b0'), sh(waveBand(x0, x1, 850, 8, 240, y1, 3), '#9cc070'));
  scene(sh(poly([[x0, 900], [x1, 890], [x1, 960], [x0, 960]]), '#e6cf7a'), cropRows(x0, x1, 895, 960, 660, 10, '#c9a84a', 1.4));
  scene(at(tree(7, 44, ['#5f8a45', '#7fa35a', '#93b25c'], '#6b4a32'), 590, 900), at(tree(9, 30, ['#5f8a45', '#7fa35a'], '#6b4a32'), 740, 890));
  scene(sh(rect(x0, 955, x1 - x0, y1 - 955), '#93b25c'), sh(poly([[620, 955], [680, 955], [760, y1], [560, y1]]), '#e6d2a0'));
  scene(at(railFence(240, 44, 60, '#a8774a'), x0 - 6, 990).filter(() => true));
  scene(at(chicken(40, '#fbf6ec'), 716, 1070), at(chicken(34, '#c9783a'), 596, 1050, 1, 0, true));
  scene(sh(rect(x0, y0, x1 - x0, 60), '#000000', { opacity: 0.12 }));
  // frame
  scene(ol(rect(x0 - 18, y0 - 18, 18, y1 - y0 + 18), BEAM, 1.2), ol(rect(x1, y0 - 18, 18, y1 - y0 + 18), BEAM, 1.2), ol(rect(x0 - 26, y0 - 26, x1 - x0 + 52, 22), BEAM, 1.2));
  // sliding door parked to the right, red with white bracing
  scene(sh(rect(520, 522, 470, 10, 3), '#4a4440'), sh(circle(810, 536, 7) + circle(948, 536, 7), '#4a4440'));
  scene(ol(rect(788, 540, 184, 566), F.barn, 1.4));
  let pl = '';
  for (let x = 811; x < 972; x += 23) pl += line([[x, 540], [x, 1106]]);
  scene(stroke(pl, F.barnDk, 1.2), stroke(rect(796, 548, 168, 550) + line([[796, 822], [964, 822]]) + line([[796, 548], [964, 822]]) + line([[964, 548], [796, 822]]) + line([[796, 822], [964, 1098]]) + line([[964, 822], [796, 1098]]), F.trim, 12));
  scene(sh(rect(800, 800, 8, 44, 3), '#3b3633'));
}
target('horseshoe', 'Horseshoe', at(horseshoe(40), 655, 500));

// =====================================================================
// hay loft (left)
// =====================================================================
scene(sh(rect(0, 284, 452, 230), '#2a1408', { opacity: 0.22 }));
scene(stroke(line([[330, 284], [330, 330]]), '#3b3633', 2), sh(circle(330, 392, 70), `url(#${ID}-glow)`, { opacity: 0.6 }));
scene(hayBale(150, 72, 3).map((q) => place([q], { x: 6, y: 506 })[0]), hayBale(150, 72, 5).map((q) => place([q], { x: 172, y: 506 })[0]), hayBale(150, 70, 7).map((q) => place([q], { x: 70, y: 434 })[0]));
scene(at(hayPile(190, 96, 4), 352, 508), at(hayPile(120, 50, 8), 250, 366));
target('pitchfork', 'Pitchfork', at(pitchfork(190), 404, 476, 1, 12));
scene(at(chicken(48, '#d9b07a'), 270, 364, 1, 0, true));
// loft floor beam, joists and post
scene(ol(rect(0, 500, 462, 30), BEAM, 1.4), sh(rect(0, 500, 462, 7), '#8a6038'), sh(rect(0, 530, 452, 16), '#3a2418'));
{
  let j = '';
  for (let x = 20; x < 440; x += 60) j += rect(x, 530, 16, 16);
  scene(sh(j, BEAM_DK));
  scene(at(hayPile(90, 26, 11), 60, 502).map((q) => ({ ...q, d: place([q], { sy: -1, sx: 1, y: 1004 })[0].d })), stroke(line([[120, 530], [116, 566]]) + line([[150, 530], [158, 560]]) + line([[330, 530], [326, 572]]) + line([[344, 530], [352, 556]]) + line([[236, 530], [240, 552]]), F.straw, 2));
}
scene(ol(rect(440, 500, 24, 610), BEAM, 1.4), sh(rect(440, 500, 6, 610), '#8a6038'), stroke(line([[440, 600], [392, 532]]), BEAM_DK, 12));

// =====================================================================
// stalls under the loft
// =====================================================================
scene(sh(rect(8, 546, 432, 300), '#2e1c14'), sh(rect(8, 546, 432, 300), `url(#${ID}-glow)`, { opacity: 0.12 }));
scene(strewnStraw(14, 780, 420, 50, 30, 2));
scene(at(horseHead(236), 132, 842), at(cowFront(176), 344, 842));
scene(ol(rect(240, 546, 14, 300), BEAM, 1.2));
target('cowbell', 'Cow bell', at(cowbell(46), 247, 592));
// stall fronts
scene(planks(8, 838, 432, 270, 8, '#a8774a', 6));
scene(ol(rect(4, 826, 440, 16, 3), '#caa06c', 1.2), ol(rect(240, 838, 14, 270), BEAM, 1.2), ol(rect(0, 838, 12, 270), BEAM, 1.2));
for (const x of [36, 280]) {
  scene(stroke(rect(x, 862, 180, 226) + line([[x, 862], [x + 180, 1088]]) + line([[x + 180, 862], [x, 1088]]), '#7a5232', 10), stroke(rect(x, 862, 180, 226) + line([[x, 862], [x + 180, 1088]]) + line([[x + 180, 862], [x, 1088]]), '#b98a5c', 4));
  scene(sh(rect(x + 164, 960, 22, 9, 3) + rect(x - 6, 890, 16, 8, 2) + rect(x - 6, 1050, 16, 8, 2), '#3b3633'));
}
target('apple', 'Red apple', at(apple(30), 212, 811));
scene(at(bucket(40, '#8a949a', '#d9c08a'), 400, 826).filter((_, i) => i > 0));

// ladder up to the loft
scene(at(ladder(50, 640, 11), 520, 1150, 1, -6.5));

// =====================================================================
// tool wall and saddles (right)
// =====================================================================
scene(ol(rect(996, 372, 196, 14, 3), '#caa06c', 1.2));
{
  let pegs = '';
  for (const x of [1016, 1066, 1116, 1166]) pegs += rect(x - 4, 368, 8, 22, 3);
  scene(sh(pegs, BEAM_DK));
}
scene(at(spade(170), 1016, 560), at(rake(170), 1066, 536), at(sickle(96), 1124, 382, 1, 180), at(bridle(110), 1168, 388));
scene(ol(rect(800, 372, 170, 14, 3), '#caa06c', 1.2), sh(rect(820, 368, 8, 22, 3) + rect(884, 368, 8, 22, 3) + rect(944, 368, 8, 22, 3), BEAM_DK));
scene(at(handSaw(116), 822, 384));
target('rope', 'Coil of rope', at(ropeCoil(72), 888, 384));
scene(at(lantern(74, '#3f4a44'), 948, 380));
scene(at(saddle(124), 1062, 760), at(saddle(116, '#5e3520', '#5a86b8', '#f6d98a'), 1140, 960, 1, 0, true));
target('lantern', 'Red lantern', at(lantern(88, '#b8402e'), 330, 326));


// extra barn clutter: drying strings, shelf of tins, rosettes, name plates, broom
scene(at(vegString(84, '#c98a3c', 5), 520, 284), at(vegString(76, '#f4ecdc', 5), 560, 284), at(vegString(88, '#8a3550', 5), 1010, 284), at(vegString(70, '#e8c55e', 4), 690, 284));
scene(at(shelf(150, '#caa06c'), 590, 440), at(jar(26, 36, '#c98a2a', 1, '#c9ced1'), 612, 440), at(jar(24, 30, '#7a4a2a', 2, '#c9a06a'), 644, 440), at(tin(30, 38, '#5f8a6a', '#f6ecd6'), 680, 440), at(tin(26, 30, '#b8402e', '#f6ecd6'), 714, 440));
scene(at(rosette(34, '#3e64b0'), 60, 536), at(rosette(30, '#c8452f'), 104, 540), at(rosette(32, '#e0a83a', '#fbf6ec'), 300, 538));
scene(ol(rect(96, 880, 60, 20, 3), F.brass, 1), stroke(curve([[104, 892], [116, 886], [128, 893], [148, 888]]), '#7a5a1e', 1.6), ol(rect(340, 880, 60, 20, 3), F.brass, 1), stroke(curve([[348, 890], [362, 894], [374, 886], [392, 891]]), '#7a5a1e', 1.6));
{
  // broom leaning by the door and nail heads on the sliding door
  let br = '', nails = '';
  for (let i = 0; i < 9; i++) br += line([[984 + i * 4, 1050], [976 + i * 6.5, 1108]]);
  scene(stroke(line([[1000, 1050], [1016, 850]]), '#c99a62', 6), sh(rect(980, 1040, 40, 14, 3), '#8a5230'), stroke(br, '#d9b04c', 3));
  for (const y of [556, 814, 830, 1090]) for (let x = 811; x < 964; x += 23) nails += circle(x - 11, y, 1.8);
  scene(sh(nails, '#7a2a1e'));
}
scene(at(swallow(34), 700, 60, 1, 30), at(swallow(30), 420, 210, 1, -40), at(chicken(46, '#fbf6ec'), 60, 362), at(chick(20), 200, 1104), at(chick(18), 232, 1108, 1, 0, true));

// =====================================================================
// floor
// =====================================================================
scene(sh(rect(0, 1104, W, H - 1104), `url(#${ID}-floor)`));
{
  let seams = '';
  let y = 1104, hgt = 30;
  const g = rng(17);
  while (y < H) { seams += line([[0, y], [W, y]]); let x = g.range(40, 260); while (x < W) { seams += line([[x, y], [x, y + hgt]]); x += g.range(180, 360); } y += hgt; hgt *= 1.12; }
  scene(stroke(seams, '#7a5a3a', 1.4, { opacity: 0.5 }), sh(rect(0, 1104, W, 22), '#000000', { opacity: 0.22 }));
}
scene(sh(poly([[540, 1104], [770, 1104], [960, 1500], [420, 1500]]), '#fff3c0', { opacity: 0.2 }));
scene(strewnStraw(0, 1120, W, 370, 190, 8));

// sacks, barrels and wheel by the door (right)
target('wheel', 'Wagon wheel', at(wagonWheel(92), 1010, 1100));
scene(at(barrel(118, 150), 1132, 1200), at(barrel(104, 132, '#8a5a34'), 1036, 1236));
scene(at(sack(104, 124, '#d9c8a0', '#b8402e'), 880, 1250), at(sack(96, 110, '#cdb98a', '#5f8a45'), 964, 1300), at(sack(110, 80, '#d9c8a0', '#5a86b8'), 1110, 1310, 1, 0, true));
target('mouse', 'Mouse', at(mouse(44), 800, 1296));
scene(at(produceCrate(120, 54, '#b98552', ['apple', 'greenapple'], 9, 12, 2), 1100, 1420));
scene(at(pumpkin(70), 990, 1436), at(pumpkin(48, '#f0a03a'), 1050, 1470));

// hay bales with the barn cat (left)
scene(shadow(190, 1470, 200, 12), hayBale(180, 88, 13).map((q) => place([q], { x: 16, y: 1470 })[0]), hayBale(160, 80, 15).map((q) => place([q], { x: 206, y: 1484 })[0]), hayBale(170, 84, 17).map((q) => place([q], { x: 40, y: 1382 })[0]));
target('cat', 'Barn cat', at(sittingCat(96, '#8a8078'), 130, 1300));
target('hat', 'Straw hat', at(strawHat(88), 296, 1404));
scene(at(boots(54, '#5f8a45'), 420, 1486));

// milking corner (centre)
target('stool', 'Milking stool', at(milkingStool(104), 566, 1390));
target('bucket', 'Blue bucket', at(bucket(64, '#5a86b8', '#fbf6ec'), 678, 1420));
scene(at(milkChurn(128), 470, 1300), at(milkChurn(108), 394, 1316));
scene(at(chicken(72, '#c9783a'), 760, 1470), at(chick(26), 838, 1478), at(chick(24), 690, 1486, 1, 0, true));
scene(at(trough(150, '#d9c08a'), 620, 1210));
// nest of eggs in the hay
scene(at(hayPile(190, 60, 21), 870, 1496), at(egg(11), 840, 1456), at(egg(11, '#f7f0e2'), 866, 1450), at(egg(10), 892, 1458));
void ellipse; void curve; void blob;

const activity: FindActivity = {
  id: 'farm-find-3', version: 1, mode: 'find', title: 'Inside the Red Barn', blurb: 'Morning light slips through the barn door onto hay, harness and sleepy animals, with fourteen things tucked among them.',
  collectionId: 'farm', categories: ["Countryside", "Animals"], difficulty: 'Moderate',
  added: '2026-11-26',
  width: W, height: H, defs, items,
};
export default activity;
