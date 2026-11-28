import { rect, ellipse, circle, line, curve, sh, stroke, place, shade, rng, linearGradient } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { FindActivity, FindItem } from '../types';
import { chalkboard, hayBale, awning, townhouse, bunting, cobbles, cloud, honeyJar, sunflower, tulipBucket, potted, robin, bicycle, pumpkin, basket, basketHandle, lantern, pie, jug, tree, shadow, ol } from '../seasons/props-find';
import { pile, baguette, bloomer, cob, plait, bun, pretzel, milkBottle, honeyPot, shopBell, ladybird, cabbage, leek, strawberry, cherries, lemon, pear, jar, sack, mushroom, cornCob } from '../kitchen/props-find';
import {
  F, stallBack, stallFront, shelf, produceCrate, produceBasket, chalkSign, scale, cheeseWheel, cheeseWedge, eggBox, paperBag, carrotBunch, watermelon, grapes,
  flowerBucket, clothDrape, vegString, beeSkep, bee, bucket, milkChurn, strewnStraw,
} from './props-find';

const ID = 'farm-find-2';
const W = 1200, H = 1500;
const items: FindItem[] = [];
const scene = (...s: (Shape | Shape[])[]) => { items.push({ shapes: s.flat() }); };
const target = (id: string, name: string, shapes: Shape[]) => { items.push({ id, name, target: true, shapes }); };
const at = (s: Shape[], x: number, y: number, k = 1, rot = 0, flip = false) => place(s, { x, y, sx: flip ? -k : k, sy: k, rot });

const defs = linearGradient(`${ID}-sky`, [[0, '#a9d0e6'], [0.6, '#d9ecf0'], [1, '#fbf0d6']]);

// =====================================================================
// sky and the square's houses
// =====================================================================
scene(sh(rect(0, 0, W, 420), `url(#${ID}-sky)`));
scene(sh(cloud(170, 60, 1.0), '#ffffff'), sh(cloud(640, 40, 0.8), '#ffffff', { opacity: 0.9 }), sh(cloud(1040, 76, 1.1), '#ffffff'));
scene(at(tree(5, 120, ['#5f8a45', '#7fa35a', '#93b25c'], '#6b4a32'), 404, 400), at(tree(9, 130, ['#4f7a3f', '#6f9a52', '#8fb25c'], '#6b4a32'), 806, 404));
scene(at(townhouse(200, 250, '#f3d9b0', '#fbf6ec', '#8a4a3a', 3, { gable: true, shutter: '#5f8a6a', boxes: ['#e8607a', '#f6d04a'] }), 0, 410));
scene(at(townhouse(190, 290, '#e8b8a0', '#fbf6ec', '#6f5a52', 5, { shutter: '#7a4a3a', boxes: ['#fbf6ec', '#b48ad6'] }), 204, 410));
scene(at(townhouse(196, 244, '#cfe0d0', '#fbf6ec', '#7a5a4a', 8, { gable: true, shutter: '#3f7f7a', boxes: ['#e8607a'] }), 500, 410));
scene(at(townhouse(180, 300, '#f6e6b8', '#fbf6ec', '#8a4a3a', 11, { shutter: '#b8402e', boxes: ['#f4a6b8', '#fbf6ec'] }), 700, 410));
scene(at(townhouse(200, 256, '#d9c8e0', '#fbf6ec', '#6f5a52', 14, { gable: true, shutter: '#6b5a8a', boxes: ['#f6d04a'] }), 1000, 410));
scene(bunting(-10, 150, 600, 120, 60, 17, ['#d8452f', '#f6d04a', '#5a86b8', '#fbf6ec', '#5f8a45'], 26));
scene(bunting(600, 120, 1210, 160, 64, 17, ['#f6d04a', '#5a86b8', '#fbf6ec', '#d8452f', '#5f8a45'], 26));

// =====================================================================
// cobbled square
// =====================================================================
scene(cobbles(0, 404, W, H - 404, 7, '#b8ab98', ['#c9bda8', '#d4c8b2', '#beb09a', '#cbb89e']));
scene(sh(rect(0, 404, W, 30), '#000000', { opacity: 0.12 }));

interface Stall { x: number; base: number; w: number; top: number; slab: number; shelfY: number }
function stall(x: number, base: number, w: number, h: number, ch: number, a: string, b: string, cloth: string, stripe: string | null, wood: string, seed: number, shelfUp: number): Stall {
  scene(shadow(x + w / 2, base + 2, w * 0.54, 12, 0.22));
  scene(at(stallBack(w, h, ch, wood, seed), x, base));
  scene(at(shelf(w - 36, F.woodLt), x + 18, base - ch - 10 - shelfUp));
  return { x, base, w, top: base - h, slab: base - ch - 10, shelfY: base - ch - 10 - shelfUp };
}
const front = (s: Stall, ch: number, cloth: string, stripe: string | null) => scene(at(stallFront(s.w, ch, cloth, stripe), s.x, s.base));
const sign = (s: Stall, dx: number, w: number, icons: Parameters<typeof chalkSign>[2], seed: number) => scene(sh(rect(s.x + dx + 14, s.top - 12, 7, 24) + rect(s.x + dx + w - 21, s.top - 12, 7, 24), '#6f4a2c'), at(chalkSign(w, 76, icons, seed), s.x + dx, s.top - 84));
const roof = (s: Stall, d: number, n: number, a: string, b: string) => scene(at(awning(s.w + 28, d, n, a, b), s.x - 14, s.top));

// =====================================================================
// back row, stall 1: vegetables
// =====================================================================
{
  const s = stall(22, 836, 368, 440, 170, '#5f8a45', F.cream, '#e6efd4', '#8fb26a', '#8a6238', 3, 96);
  // hanging strings and sign
  scene(at(vegString(84, '#f4ecdc', 5), 60, s.top + 64), at(vegString(90, '#c98a3c', 5), 96, s.top + 60), at(vegString(80, '#8a3550', 4), 132, s.top + 66));
  sign(s, 118, 150, ['carrot', 'pear'], 2);
  // shelf
  scene(at(produceBasket(72, 34, ['onion', 'redonion'], 4, 8, 2), 72, s.shelfY), at(produceBasket(72, 34, ['potato'], 6, 9, 2), 152, s.shelfY));
  scene(at(cabbage(21, 3), 214, s.shelfY - 20), at(cabbage(19, 8), 252, s.shelfY - 18), at(pumpkin(50, '#e8862e'), 304, s.shelfY), at(pumpkin(38, '#f3ead6'), 346, s.shelfY));
  front(s, 170, '#e6efd4', '#8fb26a');
  // counter
  scene(at(produceCrate(84, 36, '#c69462', ['tomato'], 11, 8, 2), 70, s.slab), at(produceCrate(84, 36, '#b98552', ['pepper'], 13, 8, 2), 160, s.slab));
  scene(at(leek(74), 204, s.slab - 8, 1, -14), at(leek(70), 210, s.slab - 3, 1, -8));
  target('carrots', 'Bunch of carrots', at(carrotBunch(62), 246, s.slab - 44, 1, 12));
  scene(at(cabbage(24, 31), 300, s.slab - 23));
  target('ladybird', 'Ladybird', at(ladybird(20), 304, s.slab - 34, 1, -30));
  target('scale', 'Brass scale', at(scale(84), 352, s.slab));
  scene(at(mushroom(18), 344, s.slab - 78), at(mushroom(15), 362, s.slab - 76));
  roof(s, 62, 10, '#5f8a45', F.cream);
}

// =====================================================================
// back row, stall 2: bread and cheese
// =====================================================================
{
  const s = stall(416, 836, 368, 440, 170, '#b8402e', F.cream, '#f7efdc', '#d8452f', '#7a5232', 5, 96);
  // peg rail with pretzel, lantern, sign
  scene(sh(rect(440, s.top + 76, 150, 7, 3), '#5a3a22'), sh(circle(462, s.top + 80, 4) + circle(520, s.top + 80, 4) + circle(574, s.top + 80, 4), '#3b2a1c'));
  target('pretzel', 'Pretzel', at(pretzel(50), 462, s.top + 104));
  scene(at(lantern(60, '#3f4a44'), 520, s.top + 78));
  scene(at(clothDrape(40, 54, '#fbf6ec', '#d8452f'), 574, s.top + 82));
  sign(s, 110, 150, ['bread', 'cheese'], 5);
  // shelf of loaves
  scene(at(bloomer(78), 478, s.shelfY), at(cob(26, '#b97a3a'), 552, s.shelfY), at(plait(80), 632, s.shelfY), at(cob(24, '#a86a2e'), 706, s.shelfY), at(bun(15), 748, s.shelfY), at(bun(14, '#c98a42'), 742, s.shelfY - 20));
  front(s, 170, '#f7efdc', '#d8452f');
  // counter: cheeses and bread
  scene(ol(rect(432, s.slab - 8, 150, 9, 3), '#caa06c', 1));
  scene(at(cheeseWheel(84, '#f6d98a', '#e0a83a'), 478, s.slab - 8), at(cheeseWheel(62, '#f3ead6', '#c8452f'), 470, s.slab - 34));
  target('cheese', 'Cheese wedge', at(cheeseWedge(54), 552, s.slab - 8));
  target('baguette', 'Baguette', at(baguette(132), 664, s.slab - 12, 1, -6));
  scene(at(bun(16), 610, s.slab), at(bun(16, '#c98a42'), 640, s.slab), at(bun(15), 626, s.slab - 22));
  target('milk', 'Milk bottle', at(milkBottle(72), 734, s.slab));
  scene(at(jar(26, 34, '#f6e6a8', 0, '#5a86b8'), 768, s.slab));
  roof(s, 62, 10, '#b8402e', F.cream);
}

// =====================================================================
// back row, stall 3: flowers
// =====================================================================
{
  const s = stall(810, 836, 368, 440, 170, '#d98aa0', F.cream, '#fbe6ea', '#f4c0cc', '#8a6238', 7, 96);
  sign(s, 124, 120, ['flower', 'flower'], 9);
  target('bell', 'Shop bell', at(shopBell(62), 1168, s.top + 96, 1, 0, true));
  // shelf
  scene(at(potted(30, '#c8693f', 'geranium', '#e8607a', 3), 982, s.shelfY), at(potted(28, '#5a86b8', 'daisy', '#fbf6ec', 5), 1030, s.shelfY), at(potted(30, '#c8693f', 'pansy', '#b48ad6', 7), 1078, s.shelfY), at(potted(28, '#f6d98a', 'hyacinth', '#6f8fd6', 9), 1124, s.shelfY));
  scene(at(flowerBucket(34, 4, ['#f4a6b8', '#fbf6ec', '#e8607a']), 860, s.shelfY), at(flowerBucket(32, 6, ['#b48ad6', '#fbf6ec', '#f4a6b8']), 922, s.shelfY));
  front(s, 170, '#fbe6ea', '#f4c0cc');
  scene(at(tulipBucket(46, '#e8607a', 3), 850, s.slab), at(flowerBucket(44, 8, ['#fbf6ec', '#f6a03a', '#e8607a']), 916, s.slab), at(tulipBucket(44, '#f6d04a', 5), 982, s.slab));
  target('sunflower', 'Sunflower', [...at(sunflower(56, 96), 1048, s.slab - 30)]);
  scene(at(bucket(44, '#5a86b8', '#4f7a3f', false), 1048, s.slab));
  scene(at(flowerBucket(42, 12, ['#b48ad6', '#f4a6b8', '#fbf6ec']), 1114, s.slab), at(tulipBucket(38, '#b48ad6', 9), 1160, s.slab));
  roof(s, 62, 10, '#d98aa0', F.cream);
}
// flower buckets spilling onto the cobbles in front of the flower stall
scene(shadow(1160, 866, 50, 6), at(flowerBucket(50, 21, ['#e8607a', '#fbf6ec', '#f6d04a']), 1164, 868), at(tulipBucket(44, '#f6a03a', 13), 1104, 872));


// goods standing on the cobbles in front of the back row
scene(at(produceCrate(110, 46, '#b98552', ['potato'], 61, 11, 2), 96, 868), at(sack(70, 84, '#d9c8a0', '#5f8a45'), 178, 872));
scene(at(cabbage(22, 71), 60, 800), at(cabbage(20, 72), 100, 802), at(cabbage(21, 73), 138, 800));
scene(at(produceBasket(104, 44, ['whiteonion', 'onion'], 63, 11, 2), 476, 866), at(milkChurn(96), 566, 870), at(milkChurn(80), 618, 876));
scene(at(flowerBucket(46, 23, ['#b48ad6', '#fbf6ec', '#f4a6b8']), 876, 870), at(tulipBucket(44, '#e8607a', 15), 936, 866), at(potted(34, '#c8693f', 'lavender', '#8a7ac8', 4), 994, 870));

// =====================================================================
// front row, stall 4: fruit
// =====================================================================
{
  const s = stall(44, 1272, 510, 400, 160, '#e8862e', F.cream, '#fdecc8', '#f0a84a', '#7a5232', 9, 86);
  scene(sh(rect(70, s.top + 80, 180, 7, 3), '#5a3a22'));
  scene(at(grapes(66), 96, s.top + 84), at(grapes(60, '#8fb24e'), 150, s.top + 84), at(grapes(64), 204, s.top + 84));
  sign(s, 150, 210, ['apple', 'cherry', 'pear'], 3);
  // shelf
  scene(at(produceBasket(84, 34, ['apple'], 4, 10, 2), 104, s.shelfY), at(produceBasket(84, 34, ['greenapple'], 5, 10, 2), 204, s.shelfY));
  scene(at(pear(34), 270, s.shelfY - 16), at(pear(32, '#c9c24a'), 296, s.shelfY - 15), at(pear(34), 322, s.shelfY - 16));
  scene(at(produceBasket(84, 34, ['plum'], 8, 9, 2), 396, s.shelfY), at(lemon(13), 462, s.shelfY - 12), at(lemon(13), 490, s.shelfY - 12), at(lemon(12), 476, s.shelfY - 30), at(lemon(12), 516, s.shelfY - 11));
  front(s, 160, '#fdecc8', '#f0a84a');
  scene(at(produceCrate(100, 40, '#c69462', ['orange'], 21, 9.5, 2), 104, s.slab), at(produceCrate(100, 40, '#b98552', ['apple', 'greenapple'], 23, 9.5, 2), 214, s.slab));
  target('strawberries', 'Strawberries', [...at(basket(54, 22, '#c9b08a'), 300, s.slab), ...at(strawberry(24), 284, s.slab - 30), ...at(strawberry(24), 316, s.slab - 30), ...at(strawberry(26), 300, s.slab - 42), ...at(strawberry(22), 300, s.slab - 26)]);
  scene(at(cherries(36), 352, s.slab - 18), at(cherries(32), 380, s.slab - 14));
  target('watermelon', 'Watermelon', at(watermelon(110), 462, s.slab));
  roof(s, 66, 13, '#e8862e', F.cream);
}

// =====================================================================
// front row, stall 5: eggs and honey
// =====================================================================
{
  const s = stall(646, 1272, 510, 400, 160, '#e0a83a', F.cream, '#fbf3d0', '#f2c85a', '#8a6238', 11, 86);
  sign(s, 60, 160, ['egg', 'honey'], 7);
  scene(at(lantern(64, '#6f4a2c'), 900, s.top + 70));
  sign(s, 330, 110, ['milk'], 4);
  // shelf: honey jars and a skep
  [0, 1, 2, 3, 4].forEach((i) => scene(at(honeyJar(36, ['#d8452f', '#5a86b8', '#5f8a45', '#d8452f', '#e0a83a'][i]), 690 + i * 40, s.shelfY)));
  scene(at(beeSkep(66), 918, s.shelfY));
  target('bee', 'Bee', at(bee(30), 972, s.shelfY - 26, 1, -16));
  scene(at(jar(28, 40, '#e0a83a', 1, '#c9ced1'), 1010, s.shelfY), at(jar(28, 40, '#f0c860', 1, '#c9ced1'), 1044, s.shelfY), at(jar(26, 34, '#c98a2a', 0, '#fbf6ec'), 1078, s.shelfY), at(jar(26, 34, '#e0a83a', 0, '#d8452f'), 1110, s.shelfY));
  front(s, 160, '#fbf3d0', '#f2c85a');
  scene(at(produceBasket(96, 38, ['egg', 'brownegg'], 31, 10, 2), 706, s.slab));
  target('eggs', 'Egg box', at(eggBox(74), 806, s.slab));
  scene(ol(rect(858, s.slab - 14, 70, 14, 3), '#b8ad9a', 1), ol(rect(862, s.slab - 28, 66, 14, 3), '#c4b9a6', 1), ol(rect(860, s.slab - 42, 68, 14, 3), '#b8ad9a', 1), stroke(line([[860, s.slab - 7], [926, s.slab - 7]]) + line([[864, s.slab - 21], [926, s.slab - 21]]) + line([[862, s.slab - 35], [926, s.slab - 35]]), '#8f8678', 1));
  target('honey', 'Honey pot', at(honeyPot(62), 976, s.slab));
  scene(at(honeyJar(34, '#f6d04a'), 1030, s.slab), at(honeyJar(30, '#d8452f'), 1062, s.slab), at(milkChurn(74), 1116, s.slab));
  roof(s, 66, 13, '#e0a83a', F.cream);
}


// goods in front of the front row
scene(at(chalkboard(190), 600, 1392));
scene(at(produceCrate(124, 52, '#c69462', ['apple'], 65, 12, 2), 130, 1330), at(produceCrate(118, 50, '#b98552', ['greenapple'], 66, 12, 2), 262, 1338), at(pumpkin(64), 480, 1336), at(pumpkin(48, '#f3ead6'), 426, 1342));
scene(hayBale(140, 66, 9).map((q) => place([q], { x: 880, y: 1348 })[0]), at(beeSkep(70), 930, 1282), at(honeyJar(34, '#5a86b8'), 990, 1282), at(milkChurn(112), 1096, 1346), at(produceBasket(92, 40, ['brownegg', 'egg'], 67, 10, 2), 760, 1342));

// =====================================================================
// foreground on the cobbles
// =====================================================================
scene(at(bicycle(210, '#3f7f7a', true), 170, 1490));
scene(at(produceCrate(120, 52, '#b98552', ['potato'], 41, 12, 2), 400, 1420), at(produceCrate(110, 48, '#c69462', ['onion', 'whiteonion'], 43, 11, 2), 376, 1496));
target('robin', 'Robin', at(robin(36), 448, 1366));
scene(at(pumpkin(70), 494, 1496));
target('bag', 'Paper bag', at(paperBag(118), 590, 1486));
scene(at(cornCob(40), 650, 1486, 1, 70), at(cornCob(36), 668, 1492, 1, 96));
scene(at(sack(92, 110, '#d9c8a0', '#b8402e'), 742, 1480), at(sack(84, 96, '#cdb98a', '#5f8a45'), 820, 1492));
scene(at(produceBasket(120, 50, ['apple', 'greenapple'], 47, 13, 2), 930, 1470), at(jug(64), 1016, 1488));
scene(at(flowerBucket(56, 33, ['#f6a03a', '#fbf6ec', '#e8607a']), 1110, 1486), at(tulipBucket(46, '#e8607a', 17), 1166, 1496));
scene(strewnStraw(680, 1470, 200, 24, 16, 5));
{
  // fallen petals and leaves
  const g = rng(12);
  let a = '', b = '', c = '';
  for (let i = 0; i < 46; i++) { const x = g.range(10, 1190), y = g.range(1290, 1490), d = ellipse(x, y, g.range(3, 6), g.range(1.6, 3), g.range(0, 180)); if (i % 3 === 0) a += d; else if (i % 3 === 1) b += d; else c += d; }
  scene(sh(a, '#f4a6b8'), sh(b, '#8fb26a'), sh(c, '#f6d98a'));
  let d2 = '';
  for (let i = 0; i < 20; i++) d2 += ellipse(g.range(10, 1190), g.range(846, 866), g.range(3, 5), 2, g.range(0, 180));
  scene(sh(d2, '#f4a6b8', { opacity: 0.8 }));
}
void curve; void shade; void basketHandle; void pie;

const activity: FindActivity = {
  id: 'farm-find-2', version: 1, mode: 'find', title: "The Farmers' Market", blurb: 'Five brimming stalls of vegetables, bread and cheese, flowers, fruit, eggs and honey hide sixteen market-day finds.',
  collectionId: 'farm', categories: ["Countryside", "Animals"], difficulty: 'Detailed',
  added: '2026-11-26',
  width: W, height: H, defs, items,
};
export default activity;
