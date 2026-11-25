import { rect, ellipse, circle, poly, line, curve, blob, sh, stroke, place, shade, rng, linearGradient } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { FindActivity, FindItem } from '../types';
import {
  M, Q, ol, shadow, cloud, tree, planks, awning, bunting, festoon, grassTufts, pumpkin, carvedPumpkin, gourd, hayBale, apple, appleHeap,
  barrel, jug, scarecrow, quilt, ferrisWheel, cornStalk, cornCob, pie, honeyJar, lantern, crow, squirrel, rake, scarf, acorn, sunflower,
  pear, rosette, toffeeApple, mapleLeaf, basket, wheelbarrow, crate, potted, flyingGull,
} from './props-find';

const ID = 'seasons-find-3';
const W = 1200, H = 1500;
const items: FindItem[] = [];
const scene = (...s: (Shape | Shape[])[]) => { items.push({ shapes: s.flat() }); };
const target = (id: string, name: string, shapes: Shape[]) => { items.push({ id, name, target: true, shapes }); };

const defs =
  linearGradient(`${ID}-sky`, [[0, '#9cc8e0'], [0.6, '#f3e2c0'], [1, '#f3c98e']]) +
  linearGradient(`${ID}-grass`, [[0, '#c4b86a'], [0.4, '#a9a85a'], [1, '#8f9650']]);

const GOLD = ['#f7d06a', '#f2b53a', '#e8862e', '#d8642a'];
const RUST = ['#e8a03a', '#d8642a', '#c8452f', '#f2c440'];
const LEAF_COLS = ['#e8862e', '#d8642a', '#f2b53a', '#c8452f', '#b8742e'];

// =====================================================================
// sky and distance
// =====================================================================
scene(sh(rect(0, 0, W, 560), `url(#${ID}-sky)`));
scene(sh(cloud(180, 110, 0.9) + cloud(620, 70, 0.7) + cloud(560, 260, 0.5), '#ffffff', { opacity: 0.85 }), sh(cloud(200, 118, 0.55) + cloud(636, 76, 0.45), '#f6efe2'));
for (const [x, y, s] of [[380, 180, 12], [410, 166, 9], [440, 186, 10], [720, 220, 8]] as [number, number, number][]) scene(place([flyingGull(s, '#4a4440')], { x, y }));
// rolling hills
scene(sh(blob([[-20, 470], [180, 420], [420, 450], [700, 410], [980, 440], [1220, 420], [1220, 600], [-20, 600]], 0.8), '#b8b070'));
scene(sh(blob([[-20, 500], [260, 470], [560, 492], [860, 466], [1220, 490], [1220, 600], [-20, 600]], 0.8), '#c9a860'));
{
  // ploughed field stripes
  let f = '';
  for (let i = 0; i < 6; i++) f += curve([[560 + i * 6, 486 + i * 3], [700, 474 + i * 5], [860, 470 + i * 4]]);
  scene(stroke(f, '#a8884a', 2, { opacity: 0.6 }));
}
// red barn
scene(sh(rect(40, 420, 150, 96), '#b8452f'), sh(poly([[30, 424], [115, 372], [200, 424]]), '#6b3a2e'), sh(rect(90, 452, 50, 64), '#fbf3df'), stroke(line([[90, 452], [140, 516]]) + line([[140, 452], [90, 516]]) + rect(94, 456, 42, 56), '#b8452f', 3), sh(rect(108, 396, 18, 18), '#fbf3df'));
scene(sh(rect(205, 410, 30, 106, 14), '#c9ccc4'), sh(ellipse(220, 410, 15, 10), '#9aa0a0'));
// ferris wheel
scene(place(ferrisWheel(150, ['#d8452f', '#f2c440', '#5a8fd0', '#7fa35a']), { x: 940, y: 300 }));
// striped tents
function tent(x: number, y: number, w: number, h: number, a: string, b: string) {
  let s1 = '', s2 = '';
  const k = 6;
  for (let i = 0; i < k; i++) { const p = poly([[x, y - h - w * 0.45], [x - w / 2 + (w * i) / k, y - h], [x - w / 2 + (w * (i + 1)) / k, y - h]]); if (i % 2) s2 += p; else s1 += p; }
  scene(sh(rect(x - w / 2, y - h, w, h), b), sh(rect(x - w / 2 + w * 0.34, y - h, w * 0.32, h), shade(a, -0.35)), sh(s1, a), sh(s2, b), stroke(line([[x, y - h - w * 0.45], [x, y - h - w * 0.62]]), '#5a4434', 2), sh(poly([[x, y - h - w * 0.62], [x + 18, y - h - w * 0.57], [x, y - h - w * 0.52]]), a));
  let sc = '';
  for (let i = 0; i < k; i++) sc += M(x - w / 2 + (w * i) / k, y - h) + Q(x - w / 2 + (w * (i + 0.5)) / k, y - h + 12, x - w / 2 + (w * (i + 1)) / k, y - h);
  scene(sh(sc, b));
}
tent(430, 560, 110, 70, '#c8452f', '#fbf3df');
tent(580, 556, 90, 60, '#5a8fd0', '#fbf3df');
// golden trees along the back
{
  const ts: [number, number, number][] = [[300, 560, 80], [700, 566, 90], [1150, 580, 110], [810, 560, 66], [-10, 600, 120]];
  ts.forEach(([x, y, s], i) => scene(place(tree(60 + i, s, i % 2 ? GOLD : RUST, '#6b4a32', { cols: ['#c8452f', '#f7d06a'], count: 10, size: s * 0.05 }), { x, y })));
}
scene(festoon(0, 210, 790, 170, 60, 14));

// =====================================================================
// field, path and grass
// =====================================================================
scene(sh(rect(0, 560, W, 940), `url(#${ID}-grass)`));
scene(sh(blob([[440, 1510], [520, 1250], [600, 1020], [700, 880], [760, 800], [860, 800], [860, 880], [820, 1020], [860, 1250], [980, 1510]], 0.7), '#dcc48a'));
scene(grassTufts(0, 580, W, 920, 120, 7, ['#8f9a4a', '#a8a85a', '#b8a050'], 16));

// =====================================================================
// quilt line (left)
// =====================================================================
scene(sh(rect(24, 586, 14, 330, 3) + rect(560, 586, 14, 330, 3), '#7a5232'), stroke(curve([[31, 600], [300, 630], [567, 600]]), '#e8dcc0', 2));
const quilts: [number, number, number, string[]][] = [
  [48, 612, 112, ['#c8452f', '#f2c440', '#fbf3df', '#7a8a4a']],
  [172, 622, 118, ['#5a8fd0', '#f3e6c8', '#d8642a', '#a87850']],
  [302, 624, 114, ['#7a8a4a', '#e8a03a', '#fbf3df', '#8a3a3a']],
  [428, 616, 118, ['#d8642a', '#fbf3df', '#6b8aa0', '#c9a24a']],
];
quilts.forEach(([x, y, w, cols], i) => scene(place(quilt(w, 170, cols, 200 + i), { x, y })));
scene(bunting(31, 586, 567, 586, 18, 14, ['#c8452f', '#f2c440', '#7a8a4a', '#fbf3df'], 16));
target('rosette', 'Prize rosette', place(rosette(56, '#3e64b0'), { x: 360, y: 720 }));

// =====================================================================
// cider stand (centre right)
// =====================================================================
{
  const x0 = 620, x1 = 1000;
  scene(planks(x0 + 16, 610, x1 - x0 - 32, 200, 9, '#a8743e', 81, true));
  scene(sh(rect(x0 + 4, 580, 16, 330, 3) + rect(x1 - 20, 580, 16, 330, 3), '#6b4a32'));
  // back shelf with mugs, bottles and apples
  scene(sh(rect(x0 + 20, 716, x1 - x0 - 40, 10, 2), '#7a5232'));
  const mugs: Shape[] = [];
  for (let i = 0; i < 6; i++) { const mx = x0 + 44 + i * 24; mugs.push(ol(rect(mx - 9, 694, 18, 22, 3), i % 2 ? '#efe2c4' : '#c9a46a', 1), stroke(M(mx + 9, 700) + Q(mx + 16, 705, mx + 9, 711), '#8a6a3a', 2)); }
  scene(mugs);
  for (let i = 0; i < 4; i++) { const bx = x0 + 210 + i * 26; scene(ol(rect(bx - 8, 678, 16, 38, 4), ['#8a6a2a', '#b8742e', '#6b7a3a', '#c8862e'][i], 1), sh(rect(bx - 4, 666, 8, 14), '#5a3a22'), sh(rect(bx - 8, 694, 16, 10), '#fbf3df')); }
  scene(place(basket(60, 26), { x: x1 - 70, y: 716 }), place(appleHeap(52, 22, 5, ['#c8302a', '#e05a3a', '#8fb04a']), { x: x1 - 70, y: 694 }));
  // counter with barrels
  scene(planks(x0 + 10, 812, x1 - x0 - 20, 100, 1, '#8a5a34', 82), sh(rect(x0 + 4, 800, x1 - x0 - 8, 14, 2), '#c99a62'));
  scene(place(apple(26, '#c8302a'), { x: (x0 + x1) / 2, y: 862 }));
  scene(place(barrel(80, 90), { x: x0 + 70, y: 800 }), place(barrel(80, 90), { x: x1 - 70, y: 800 }));
  scene(sh(rect(x0 + 62, 744, 16, 8) + rect(x1 - 78, 744, 16, 8), '#c9a24a'), sh(rect(x0 + 66, 752, 8, 10) + rect(x1 - 74, 752, 8, 10), '#c9a24a'));
  scene(ol(rect(x0 + 150, 776, 20, 24, 4), '#efe2c4', 1), ol(rect(x0 + 176, 776, 20, 24, 4), '#c9a46a', 1), ol(rect(x1 - 130, 776, 20, 24, 4), '#efe2c4', 1));
  target('cider-jug', 'Cider jug', place(jug(56), { x: x0 + 230, y: 800 }));
  scene(place(awning(x1 - x0 + 24, 52, 12, '#c8452f', '#fbf3df'), { x: x0 - 12, y: 584 }));
  // sign board above the awning with a painted apple (no lettering)
  scene(stroke(line([[x0 + 120, 576], [x0 + 120, 546]]) + line([[x1 - 120, 576], [x1 - 120, 546]]), '#6b4a32', 3), ol(rect(x0 + 100, 506, x1 - x0 - 200, 44, 6), '#efe2c4', 1.4, -0.4));
  scene(place(apple(13, '#c8302a'), { x: (x0 + x1) / 2, y: 530 }), stroke(curve([[x0 + 130, 528], [x0 + 150, 522], [x0 + 166, 530]]) + curve([[x1 - 166, 530], [x1 - 150, 522], [x1 - 130, 528]]), '#7a8a4a', 3));
  target('lantern', 'Lantern', place(lantern(54), { x: x0 + 40, y: 640 }));
}

// =====================================================================
// scarecrow among corn stalks (right)
// =====================================================================
for (const [x, h, s] of [[1050, 300, 1], [1180, 320, 2], [1130, 260, 3], [1010, 240, 4]] as [number, number, number][]) scene(place(cornStalk(h, s), { x, y: 960 }));
scene(place(scarecrow(300), { x: 1110, y: 960 }));
for (const [x, h, s] of [[1070, 200, 5], [1170, 220, 6]] as [number, number, number][]) scene(place(cornStalk(h, s, '#d4c07a'), { x, y: 980 }));
target('crow', 'Crow', place(crow(50), { x: 1006, y: 727 }));

// =====================================================================
// hay bales, apple barrels and the pie table
// =====================================================================
scene(shadow(210, 1064, 200, 14));
scene(place(hayBale(160, 72, 1), { x: 30, y: 1062 }), place(hayBale(160, 72, 2), { x: 196, y: 1062 }), place(hayBale(150, 68, 3), { x: 110, y: 990 }));
scene(place(pumpkin(70), { x: 70, y: 990 }), place(pumpkin(56, '#efe2c4'), { x: 290, y: 1000 }), place(pumpkin(60, '#d8642a'), { x: 150, y: 922 }));
target('squirrel', 'Squirrel', place(squirrel(60), { x: 222, y: 922 }));
target('rake', 'Rake', place(rake(190), { x: 392, y: 1064, rot: 18 }));
scene(place(gourd(36, '#f2c440'), { x: 340, y: 1064 }), place(gourd(30, '#7a9a4a'), { x: 22, y: 1064 }));

// apple barrels
scene(shadow(540, 1110, 120, 12));
scene(place(barrel(96, 104), { x: 480, y: 1100 }), place(appleHeap(82, 34, 11, ['#c8302a', '#d8452f', '#e05a3a', '#a8281e']), { x: 480, y: 1000 }));
scene(place(barrel(92, 96, '#8a5a34'), { x: 596, y: 1112 }), place(appleHeap(78, 32, 12, ['#8fb04a', '#a8c060', '#c9c24a', '#b8b04a']), { x: 596, y: 1020 }));
target('pear', 'Pear', place(pear(40, '#d4b84a'), { x: 612, y: 1012 }));

// pie table
{
  const x0 = 720, x1 = 1090, y = 1000;
  scene(shadow((x0 + x1) / 2, y + 112, 200, 12), stroke(line([[x0 + 20, y + 40], [x0 + 14, y + 110]]) + line([[x1 - 20, y + 40], [x1 - 14, y + 110]]), '#6b4a32', 8));
  let check = '';
  for (let i = 0; i < 19; i++) check += rect(x0 + i * 20, y, 10, 70);
  for (let j = 0; j < 4; j++) check += rect(x0, y + j * 20, x1 - x0, 10);
  scene(sh(rect(x0, y, x1 - x0, 70, 3), '#fbf3df'), sh(check, '#c8452f', { opacity: 0.55 }), sh(rect(x0, y - 6, x1 - x0, 8, 3), '#e8dcc0'));
  scene(place(pie(70, '#6b3a6a'), { x: x0 + 46, y: y + 2 }), place(pie(64, '#e8a03a'), { x: x0 + 340, y: y + 2 }));
  target('pie', 'Cherry pie', place(pie(74, '#b8302a'), { x: x0 + 124, y: y + 2 }));
  target('honey', 'Honey jar', place(honeyJar(46), { x: x0 + 196, y: y + 2 }));
  for (const [dx, c] of [[232, '#8a2a3a'], [260, '#c8452f'], [288, '#6b3a6a']] as [number, string][]) scene(ol(rect(x0 + dx - 11, y - 32, 22, 32, 4), c, 1), sh(rect(x0 + dx - 12, y - 38, 24, 8, 2), '#c9a24a'), sh(rect(x0 + dx - 7, y - 24, 14, 10), '#fbf3df'));
  target('toffee-apple', 'Toffee apple', place(toffeeApple(44), { x: x0 + 280, y: y + 34, rot: -10 }));
  scene(place(basket(56, 22), { x: x0 + 40, y: y + 66 }));
}
// milk churn of sunflowers next to the table
{
  const x = 1140, y = 1130;
  scene(shadow(x, y, 40, 8));
  scene(place(sunflower(44, 110), { x: x - 22, y: y - 70, rot: -14 }), place(sunflower(40, 96), { x: x + 20, y: y - 70, rot: 12 }));
  target('sunflower', 'Sunflower', place(sunflower(56, 120), { x, y: y - 70 }));
  scene(ol(blob([[x - 28, y], [x - 30, y - 46], [x - 16, y - 62], [x - 18, y - 80], [x + 18, y - 80], [x + 16, y - 62], [x + 30, y - 46], [x + 28, y]], 0.5), '#b8c0c4', 1), sh(rect(x - 20, y - 86, 40, 8, 3), '#9aa2a8'), sh(rect(x - 30, y - 30, 60, 6), '#9aa2a8'));
}

// =====================================================================
// foreground: fence, pumpkin patch, crates
// =====================================================================
{
  let posts = '';
  for (const x of [20, 150, 280, 410]) posts += rect(x, 1150, 18, 130, 3);
  scene(sh(posts, '#8a6a4a'), sh(rect(0, 1170, 440, 14, 3) + rect(0, 1222, 440, 14, 3), '#a8845a'), stroke(line([[0, 1176], [440, 1176]]) + line([[0, 1228], [440, 1228]]), '#7a5a3a', 1.2));
}
target('scarf', 'Knitted scarf', place(scarf(80, '#5a8fd0', '#f3e6c8'), { x: 230, y: 1166 }));
scene(place(potted(46, '#c8693f', 'daisy', '#b07ad0', 301), { x: 90, y: 1162 }), place(potted(40, '#a85a38', 'daisy', '#f2c440', 302), { x: 350, y: 1162 }));

// crate of apples with a corn cob
scene(shadow(540, 1300, 80, 10), place(crate(140, 62, '#c99a62'), { x: 540, y: 1300 }), place(appleHeap(120, 30, 21, ['#c8302a', '#e05a3a', '#8fb04a']), { x: 540, y: 1250 }));
target('corn', 'Corn cob', place(cornCob(64), { x: 600, y: 1262, rot: 28 }));
scene(place(cornCob(46), { x: 470, y: 1254, rot: -30 }));

// gourds in a basket
scene(shadow(900, 1300, 80, 10), place(basket(140, 54, '#b8864a'), { x: 900, y: 1300 }));
scene(place(gourd(44, '#f2c440'), { x: 850, y: 1248 }), place(gourd(40, '#7a9a4a'), { x: 878, y: 1244, rot: 10 }), place(gourd(38, '#e8862e'), { x: 960, y: 1246, rot: -8 }));
target('gourd', 'Striped gourd', place(gourd(52, '#e8d070', '#5f8a45'), { x: 914, y: 1248 }));

// pumpkin patch
{
  const g = rng(31);
  const spots: [number, number, number, string][] = [
    [80, 1330, 110, '#e8862e'], [200, 1360, 80, '#efe2c4'], [330, 1340, 96, '#d8642a'], [60, 1470, 130, '#e8862e'], [250, 1480, 100, '#c8862e'],
    [420, 1440, 90, '#8fa08a'], [760, 1430, 110, '#e8862e'], [880, 1490, 90, '#efe2c4'], [1100, 1300, 100, '#d8642a'], [1160, 1440, 120, '#e8862e'],
    [520, 1490, 70, '#f2b53a'], [1010, 1360, 70, '#8fa08a'],
  ];
  // vines first
  let vine = '';
  for (let i = 0; i < 10; i++) { const x = g.range(0, W), y = g.range(1300, 1490); vine += curve([[x, y], [x + 40, y - 20], [x + 80, y + 6], [x + 120, y - 14]]); }
  scene(stroke(vine, '#6b7a3a', 3));
  let lv = '';
  for (let i = 0; i < 24; i++) lv += blob([[0, 0], [14, -10], [26, 0], [14, 12]].map(([a, b]) => [a + g.range(0, W), b + g.range(1290, 1490)] as [number, number]), 0.8);
  scene(sh(lv, '#7a8a4a'));
  for (const [x, y, s, c] of spots) scene(shadow(x, y, s * 0.45, 8), place(pumpkin(s, c), { x, y }));
}
scene(shadow(650, 1416, 44, 8));
target('carved-pumpkin', 'Carved pumpkin', place(carvedPumpkin(92), { x: 650, y: 1416 }));
scene(place(pumpkin(60, '#e8862e'), { x: 690, y: 1470 }));

// wheelbarrow of pumpkins
scene(shadow(1000, 1230, 120, 10), place(pumpkin(60, '#e8862e'), { x: 960, y: 1196 }), place(pumpkin(50, '#efe2c4'), { x: 1010, y: 1194 }), place(pumpkin(44, '#d8642a'), { x: 1048, y: 1198 }));
scene(place(wheelbarrow(170, '#7a8a6a'), { x: 1000, y: 1232 }));

// fallen leaves everywhere
{
  const g = rng(77);
  for (let i = 0; i < 70; i++) {
    const x = g.range(0, W), y = g.range(1060, 1495);
    scene(place(mapleLeaf(g.range(14, 24), g.pick(LEAF_COLS)), { x, y, rot: g.range(-60, 60) }));
  }
  for (let i = 0; i < 10; i++) scene(place(mapleLeaf(g.range(10, 16), g.pick(LEAF_COLS)), { x: g.range(0, W), y: g.range(600, 1000), rot: g.range(-60, 60) }));
  for (let i = 0; i < 4; i++) scene(place(acorn(18), { x: g.range(60, 1150), y: g.range(1300, 1480), rot: g.range(-40, 40) }));
}
target('acorn', 'Acorn', place(acorn(30), { x: 410, y: 1380, rot: 20 }));

const a: FindActivity = {
  id: 'seasons-find-3', version: 1, mode: 'find', title: 'Autumn Harvest Fair', blurb: 'Browse a golden country fair of pumpkins, hay bales, patchwork quilts and a cider stand beneath a little ferris wheel.',
  collectionId: 'seasons', categories: ["Seasons"], difficulty: 'Detailed',
  season: { from: '09-01', to: '11-30', label: 'autumn' },
  width: W, height: H, defs, items,
};
export default a;
