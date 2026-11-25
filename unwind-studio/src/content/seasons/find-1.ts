import { rect, ellipse, circle, line, sh, stroke, place, shade, rng, linearGradient } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { FindActivity, FindItem } from '../types';
import {
  P, ol, shadow, cobbles, cloud, tree, bunting, townhouse, awning, planks, potted, tulipBucket, wateringCan, basket, basketHandle, bicycle,
  seedTray, gloves, trowel, robin, butterfly, chalkboard, wheelbarrow, boots, birdhouse, crate, petals, type PlantKind,
} from './props-find';

const ID = 'seasons-find-1';
const W = 1200, H = 1500;
const items: FindItem[] = [];
const scene = (...s: (Shape | Shape[])[]) => { items.push({ shapes: s.flat() }); };
const target = (id: string, name: string, shapes: Shape[]) => { items.push({ id, name, target: true, shapes }); };

const defs =
  linearGradient(`${ID}-sky`, [[0, '#9fcbe8'], [0.75, '#d9ecf2'], [1, '#f6efdc']]) +
  linearGradient(`${ID}-canvas`, [[0, '#f3ead6'], [1, '#e6d9bb']]);

const FLOWERS = ['#e8607a', '#f2c14e', '#f39a6a', '#c86bb0', '#fbf3df', '#e8423a', '#8e7bd0', '#f4a6b8'];
const POTS = [P.terracotta, '#d9825a', '#b85a38', '#e9dcc0', '#7f9fc8', '#9cb48a'];
const KINDS: PlantKind[] = ['tulip', 'daisy', 'geranium', 'hyacinth', 'lavender', 'leafy', 'pansy', 'daisy', 'geranium', 'tulip'];

// =====================================================================
// sky, houses, trees, bunting
// =====================================================================
scene(sh(rect(0, 0, W, 660), `url(#${ID}-sky)`));
scene(sh(cloud(220, 90, 1.1) + cloud(760, 60, 0.9) + cloud(1080, 140, 0.7), '#ffffff', { opacity: 0.9 }), sh(cloud(240, 100, 0.7) + cloud(780, 70, 0.55), '#eaf3f6'));

const houses: [number, number, number, string, string, string, boolean, string][] = [
  [-10, 200, 420, '#f2d4c4', '#fbf6ea', '#9a5a4a', true, '#7f9fc8'],
  [190, 220, 470, '#e9e0b8', '#fbf6ea', '#6f7a86', false, '#9cb48a'],
  [410, 200, 400, '#cfe0d4', '#fbf6ea', '#a86048', true, '#e8a05a'],
  [610, 210, 450, '#f5e6d0', '#fbf6ea', '#6f7a86', false, '#c8665a'],
  [820, 190, 410, '#d8d4ea', '#fbf6ea', '#9a5a4a', true, '#7f9fc8'],
  [1010, 200, 460, '#f3cfcf', '#fbf6ea', '#6f7a86', false, '#7f9a70'],
];
houses.forEach(([x, w, h, wall, trim, roof, gable, shut], i) =>
  scene(place(townhouse(w, h, wall, trim, roof, 30 + i, { gable, shutter: shut, boxes: ['#e8607a', '#f2c14e', '#e8423a', '#fbf3df'] }), { x, y: 660 })));
// ground-floor shop fronts peeking between the stalls
scene(sh(rect(0, 600, W, 60), '#e8dcc4'), sh(rect(0, 596, W, 6), '#c9b894'));

scene(place(tree(11, 150, ['#f7c6d0', '#f3b0c0', '#e99ab0', '#fbe0e6'], '#7a5a48', { cols: ['#ffffff', '#fbe0e6', '#e8607a'], count: 40, size: 9, flower: true }), { x: 70, y: 700 }));
scene(place(tree(23, 140, ['#fbe6ec', '#f7cdd8', '#efb2c4', '#ffffff'], '#7a5a48', { cols: ['#ffffff', '#f4a6b8'], count: 36, size: 8, flower: true }), { x: 1130, y: 700 }));

scene(bunting(0, 230, 600, 250, 90, 16, ['#e8607a', '#f2c14e', '#7fb0d8', '#9cc48a', '#fbf3df'], 30));
scene(bunting(600, 250, 1200, 220, 100, 16, ['#f2c14e', '#7fb0d8', '#e8607a', '#fbf3df', '#9cc48a'], 30));
scene(bunting(0, 380, 1200, 380, 70, 30, ['#9cc48a', '#f4a6b8', '#f2c14e', '#7fb0d8'], 24));

// =====================================================================
// cobbles
// =====================================================================
scene(cobbles(0, 660, W, 840, 5, '#b9aa94', ['#d9cdb8', '#cfc2ab', '#e2d7c4', '#c8b99f']));
scene(petals(0, 700, W, 800, 90, 8, ['#f7c6d0', '#ffffff', '#e99ab0'], 4.5));

// =====================================================================
// three striped stalls
// =====================================================================
function stall(x0: number, x1: number, a: string, b: string, panel: string, seed: number, shelfPlants: number, counterPlants: number, skipCounter: number[] = []) {
  const w = x1 - x0;
  const g = rng(seed);
  scene(sh(rect(x0 + 12, 600, w - 24, 230), `url(#${ID}-canvas)`), stroke(line([[x0 + 12, 830], [x1 - 12, 830]]), '#000000', 1, { opacity: 0.1 }));
  scene(sh(rect(x0 + 4, 580, 14, 370, 3) + rect(x1 - 18, 580, 14, 370, 3), P.woodDk), sh(rect(x0 + 4, 580, 5, 370) + rect(x1 - 18, 580, 5, 370), P.wood));
  // back shelf
  scene(sh(rect(x0 + 18, 726, w - 36, 12, 2), P.wood), sh(rect(x0 + 18, 738, w - 36, 5), '#3b2a1c', { opacity: 0.2 }));
  for (let i = 0; i < shelfPlants; i++) {
    const x = x0 + 40 + ((w - 80) * i) / (shelfPlants - 1);
    scene(place(potted(36 + g.range(-4, 6), g.pick(POTS), KINDS[(i + seed) % KINDS.length], FLOWERS[(i * 3 + seed) % FLOWERS.length], seed * 10 + i), { x, y: 727 }));
  }
  // counter and front panel
  scene(planks(x0 + 10, 840, w - 20, 100, Math.round(w / 34), panel, seed + 5, true), sh(rect(x0 + 6, 828, w - 12, 14, 2), P.woodLt), sh(rect(x0 + 6, 840, w - 12, 5), '#3b2a1c', { opacity: 0.2 }));
  scene(shadow((x0 + x1) / 2, 950, w * 0.5, 10, 0.18));
  for (let i = 0; i < counterPlants; i++) {
    if (skipCounter.includes(i)) continue;
    const x = x0 + 46 + ((w - 92) * i) / (counterPlants - 1);
    scene(place(potted(44 + g.range(-4, 6), g.pick(POTS), KINDS[(i * 2 + seed + 3) % KINDS.length], FLOWERS[(i * 5 + seed + 1) % FLOWERS.length], seed * 20 + i), { x, y: 830 }));
  }
  scene(place(awning(w + 24, 58, Math.round((w + 24) / 32), a, b), { x: x0 - 12, y: 568 }));
}
stall(30, 400, '#9cc48a', '#fbf6ea', '#7f9a70', 1, 7, 5);
stall(420, 780, '#e8607a', '#fbf6ea', '#c8665a', 2, 7, 5, [2]);
stall(800, 1170, '#7fb0d8', '#fbf6ea', '#6f8fb0', 3, 7, 5);
// seedling tray on the middle counter
target('seed-tray', 'Seedling tray', place(seedTray(110, 4), { x: 600, y: 830 }));
// robin on the pink awning, butterfly by the blue stall
target('robin', 'Robin', place(robin(56), { x: 700, y: 566 }));
target('butterfly', 'Butterfly', place(butterfly(56, '#f2a23a'), { x: 930, y: 676, rot: -18 }));

// bird house on a post between the stalls
target('birdhouse', 'Bird house', place(birdhouse(80, '#f2d27a', '#c8452f'), { x: 410, y: 1000 }));

// =====================================================================
// foreground: buckets, crates, cans, bikes
// =====================================================================
// boots by the blue stall
target('boots', 'Rubber boots', place(boots(70, '#e2b84a'), { x: 1120, y: 1010 }));

// chalkboard sign
scene(shadow(120, 1080, 70, 10));
target('chalkboard', 'Chalkboard sign', place(chalkboard(160), { x: 120, y: 1080 }));

// buckets of cut tulips
const buckets: [number, number, string, number][] = [[250, 1010, '#e8423a', 1], [320, 1060, '#f2c14e', 2], [500, 1030, '#fbf3df', 3], [570, 1070, '#f4a6b8', 4]];
for (const [x, y, c, s] of buckets) scene(shadow(x, y, 34, 7), place(tulipBucket(64, c, s * 7), { x, y }));
scene(shadow(420, 1080, 38, 8));
target('tulip-bucket', 'Bucket of purple tulips', place(tulipBucket(70, '#8e5bb0', 99), { x: 420, y: 1080 }));

// crates with pots and seed trays (centre)
scene(shadow(700, 1200, 90, 12), place(crate(150, 70, '#c99a62'), { x: 680, y: 1200 }), place(crate(130, 60, '#b98552'), { x: 690, y: 1130 }));
scene(place(potted(40, POTS[0], 'pansy', '#8e7bd0', 51), { x: 645, y: 1070 }), place(potted(40, POTS[4], 'daisy', '#fbf3df', 52), { x: 735, y: 1070 }));
scene(place(seedTray(90, 61, '#4a3f38'), { x: 830, y: 1150 }), place(crate(110, 50, '#d4a26c'), { x: 830, y: 1200 }));
target('gloves', 'Garden gloves', place(gloves(54, '#7fb0a8', '#e8607a'), { x: 560, y: 1185, rot: -20 }));

// a row of potted plants on the cobbles (right)
{
  const g = rng(71);
  for (let i = 0; i < 6; i++) { const x = 880 + i * 52, y = 1040 + (i % 2) * 22; scene(shadow(x, y, 22, 5), place(potted(42, g.pick(POTS), KINDS[(i + 4) % KINDS.length], FLOWERS[(i + 2) % FLOWERS.length], 80 + i), { x, y })); }
}
// watering cans
scene(shadow(170, 1250, 50, 8), place(wateringCan(100, '#7fa392'), { x: 160, y: 1250 }));
scene(shadow(470, 1300, 44, 7), place(wateringCan(90, '#7f9fc8'), { x: 470, y: 1300, sx: -1 }));
scene(shadow(330, 1272, 52, 8));
target('watering-can', 'Yellow watering can', place(wateringCan(112, '#f2c14e'), { x: 320, y: 1272 }));

// trowel on the cobbles
target('trowel', 'Trowel', place(trowel(90), { x: 820, y: 1262, rot: -12 }));
scene(place(potted(46, POTS[2], 'geranium', '#e8423a', 91), { x: 900, y: 1300 }), place(potted(38, POTS[3], 'lavender', '#8e7bd0', 92), { x: 960, y: 1290 }));

// wheelbarrow with pots
scene(shadow(210, 1420, 140, 12));
target('wheelbarrow', 'Wheelbarrow', place(wheelbarrow(190, '#5f9a8a'), { x: 200, y: 1420 }));
scene(place(potted(34, POTS[0], 'tulip', '#f2c14e', 101), { x: 150, y: 1310 }), place(potted(32, POTS[1], 'hyacinth', '#8e7bd0', 102), { x: 210, y: 1308 }), place(potted(34, POTS[5], 'tulip', '#e8607a', 103), { x: 268, y: 1310 }));

// wicker basket of pots
scene(shadow(640, 1400, 70, 10));
target('basket', 'Wicker basket', [...place(basketHandle(120, 56), { x: 640, y: 1400 }), ...place(basket(120, 56), { x: 640, y: 1400 })]);
scene(place(potted(30, POTS[0], 'daisy', '#fbf3df', 111), { x: 610, y: 1366 }), place(potted(30, POTS[1], 'pansy', '#f2c14e', 112), { x: 668, y: 1366 }));
scene(place(basket(110, 50, '#b8864a'), { x: 450, y: 1440 }), place(potted(32, POTS[2], 'geranium', '#f4a6b8', 113), { x: 425, y: 1405 }), place(potted(30, POTS[4], 'leafy', '#6f9a5c', 114), { x: 478, y: 1405 }));

// bicycles
scene(shadow(980, 1180, 130, 10), place(bicycle(170, '#c8665a', true), { x: 980, y: 1180 }));
scene(place(tulipBucket(30, '#fbf3df', 121), { x: 1077, y: 1050 }));
scene(shadow(960, 1470, 160, 12));
target('bicycle', 'Blue bicycle', place(bicycle(200, '#4a78b8', true), { x: 960, y: 1468 }));
scene(place(potted(28, POTS[0], 'tulip', '#e8607a', 131), { x: 1076, y: 1302 }));

// a few fallen petals on top of everything at the very front
scene(petals(0, 1440, W, 60, 30, 141, ['#f7c6d0', '#ffffff'], 5));

const a: FindActivity = {
  id: 'seasons-find-1', version: 1, mode: 'find', title: 'Spring Flower Market', blurb: 'Wander a cobbled square of striped flower stalls, blossom trees and bicycles laden with seedlings.',
  collectionId: 'seasons', categories: ["Seasons"], difficulty: 'Relaxed',
  season: { from: '03-01', to: '05-31', label: 'spring' },
  width: W, height: H, defs, items,
};
export default a;
