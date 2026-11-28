import { rect, ellipse, circle, poly, line, blob, sh, stroke, place, shade, rng, linearGradient } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { FindActivity, FindItem } from '../types';
import { basket, basketHandle, baguette, apple } from '../kitchen/props-find';
import { cloud, grassTufts, tree, butterfly, kite, squirrel, sunhat } from '../seasons/props-find';
import { bench, bush } from '../garden/props';
import { pigeon } from '../cities/props-find';
import { flowers } from '../woodland/props-find';
import {
  PET as C, pawPrint, dog, pup, bone, petBowl, ropeToy, frisbee, tennisBall, agilityHoop, hurdle, weavePoles, tunnel, fountain, coffeeCart, paperCup, lampPost, parkSign,
  bagStation, waterStation, railing, backpack, waterBottle, towerBlock, leash,
} from './props-find';

const ID = 'pets-find-2';
const W = 1200, H = 1500;
const items: FindItem[] = [];
const scene = (...s: (Shape | Shape[])[]) => { items.push({ shapes: s.flat() }); };
const at = (s: Shape[], x: number, y: number, k = 1, rot = 0) => place(s, { x, y, s: k, rot });
const flip = (s: Shape[], x: number, y: number, k = 1) => place(s, { x, y, sx: -k, sy: k });
const ol = (d: string, fill: string, w = 1, amt = -0.3): Shape => sh(d, fill, { stroke: shade(fill, amt), strokeWidth: w });
// things standing on the lawn are queued with their base line and drawn back to front
const queue: { y: number; item: FindItem }[] = [];
const put = (y: number, ...s: (Shape | Shape[])[]) => { queue.push({ y, item: { shapes: s.flat() } }); };
const hide = (y: number, id: string, name: string, shapes: Shape[]) => { queue.push({ y, item: { id, name, target: true, shapes } }); };

const defs =
  linearGradient(`${ID}-sky`, [[0, '#8fcdf0'], [0.7, '#cdeaf6'], [1, '#f2f6e4']]) +
  linearGradient(`${ID}-lawn`, [[0, '#a8d47c'], [0.35, '#8cc468'], [1, '#6fae58']]);

// =====================================================================
// sky and city
// =====================================================================
scene(sh(rect(0, 0, W, 480), `url(#${ID}-sky)`));
scene(sh(circle(1040, 110, 120), '#fff6c8', { opacity: 0.25 }), sh(circle(1040, 110, 80), '#fff6c8', { opacity: 0.35 }), sh(circle(1040, 110, 44), '#fff3b0'));
scene(sh(cloud(210, 110, 1.2), '#ffffff'), sh(cloud(250, 128, 0.7), '#eef6fa'), sh(cloud(640, 70, 0.9), '#ffffff'), sh(cloud(860, 190, 0.8), '#ffffff', { opacity: 0.9 }), sh(cloud(460, 200, 0.6), '#ffffff', { opacity: 0.85 }), sh(cloud(1130, 250, 0.7), '#ffffff', { opacity: 0.85 }));
{
  let birds = '';
  for (const [x, y] of [[380, 90], [420, 110], [350, 120], [760, 130], [800, 118]]) birds += `M${x - 10} ${y}Q${x - 5} ${y - 7} ${x} ${y}Q${x + 5} ${y - 7} ${x + 10} ${y}`;
  scene(stroke(birds, '#5a6a7a', 1.8));
}
{
  const B: [number, number, number, string, number][] = [[-10, 120, 210, '#c4d2de', 0], [100, 92, 276, '#d8c8c0', 1], [196, 132, 180, '#b8c8d4', 0], [330, 86, 310, '#e0d0b8', 3], [420, 124, 222, '#c8bcd0', 2], [548, 104, 262, '#c4d2de', 0], [656, 144, 190, '#dccabc', 1], [806, 92, 300, '#b8c8d4', 3], [902, 122, 232, '#e0d0b8', 0], [1030, 180, 200, '#c8bcd0', 2]];
  B.forEach(([x, w, h, c, r], i) => scene(at(towerBlock(w, h, c, i * 7 + 3, r), x, 470)));
  scene(sh(rect(0, 330, W, 150), '#f2f6e4', { opacity: 0.25 }));
}
// tree line and hedge
{
  const greens = [['#4f8a48', '#63a056', '#7ab868'], ['#5a9450', '#70aa5e', '#8cc070'], ['#3f7a44', '#56924e', '#6eaa5c']];
  let i = 0;
  for (let x = 150; x < 1100; x += 104, i++) scene(at(tree(20 + i, 62 + (i % 3) * 10, greens[i % 3], '#7a5a3a'), x + (i % 2) * 14, 486));
  for (let x = 20, k = 0; x < W + 60; x += 84, k++) scene(at(bush(40 + k, 124, 50, k % 2 ? '#4f8a48' : '#5a9a50', 9), x, 500));
}

// =====================================================================
// lawn, path
// =====================================================================
scene(sh(rect(0, 490, W, 1010), `url(#${ID}-lawn)`));
{
  let st = '';
  for (let i = 0; i < 9; i++) { const y0 = 500 + i * i * 13 + i * 30, hh = 26 + i * 13; if (i % 2 === 0) st += poly([[0, y0], [W, y0 - 30], [W, y0 - 30 + hh], [0, y0 + hh]]); }
  scene(sh(st, '#ffffff', { opacity: 0.07 }));
}
scene(grassTufts(0, 540, W, 950, 210, 5, ['#5f9e4c', '#7ab85c', '#559048'], 15));
{
  const g = rng(8);
  let pet = '', mid = '', pet2 = '';
  for (let i = 0; i < 90; i++) {
    const x = g.range(10, 1190), y = g.range(560, 1490), r = 2.2 + (y - 500) / 420;
    let d = '';
    for (let k = 0; k < 6; k++) d += circle(x + Math.cos(k * 1.047) * r * 1.25, y + Math.sin(k * 1.047) * r * 1.25, r * 0.78);
    if (i % 4 === 0) pet2 += d; else pet += d;
    mid += circle(x, y, r * 0.7);
  }
  scene(sh(pet, '#fbf8ee'), sh(pet2, '#f6c8d8'), sh(mid, '#f2c84a'));
}
{
  // sandy path from the gate winding down to the right
  const pathD = blob([[566, 512], [558, 620], [640, 760], [760, 900], [860, 1080], [896, 1290], [890, 1520], [1100, 1520], [1066, 1280], [1012, 1040], [900, 840], [768, 700], [676, 600], [654, 512]], 0.8);
  scene(sh(pathD, '#c9b890'), sh(place([sh(pathD, '#e8d8b0')], { x: 0, y: -4 })[0].d, '#e8d8b0'));
  const g = rng(14);
  let peb = '', peb2 = '';
  const mids: [number, number, number][] = [[610, 560, 30], [610, 640, 34], [680, 730, 40], [790, 830, 46], [880, 960, 54], [950, 1100, 60], [985, 1240, 66], [990, 1380, 76], [995, 1470, 80]];
  for (const [mx, my, hw] of mids) for (let i = 0; i < 9; i++) { const d = ellipse(mx + g.range(-hw, hw), my + g.range(-40, 40), g.range(2, 5), g.range(1.4, 3)); if (i % 2) peb += d; else peb2 += d; }
  scene(sh(peb, '#d2c098'), sh(peb2, '#f2e6c4'));
  // paved pad for the coffee cart
  scene(sh(ellipse(962, 716, 190, 34), '#c9b890'), sh(ellipse(962, 712, 186, 31), '#e8d8b0'));
}

// =====================================================================
// fence, gate and the two big trees
// =====================================================================
scene(railing(0, 548, 540, 64), railing(676, W, 540, 64));
{
  const pillar = (x: number): Shape[] => [ol(rect(x - 16, 448, 32, 96), '#d6cab4', 1.2), sh(rect(x + 4, 448, 12, 96), '#000000', { opacity: 0.08 }), stroke(line([[x - 16, 480], [x + 16, 480]]) + line([[x - 16, 512], [x + 16, 512]]), '#b8ac96', 1.2), ol(rect(x - 20, 440, 40, 10, 2), '#e4dac6', 1.2), ol(circle(x, 432, 10), '#e4dac6', 1.2)];
  scene(pillar(552), pillar(672));
  scene(stroke(`M552 426Q612 372 672 426`, '#2f3a38', 5), sh(pawPrint(612, 392, 12), '#2f3a38'));
}
scene(at(tree(71, 150, ['#3f7a44', '#56924e', '#74b060'], '#7a5a3a'), 52, 640));
scene(at(tree(77, 150, ['#4f8a48', '#63a056', '#84c070'], '#7a5a3a', { cols: ['#f6c8d8', '#fbf0f4'], count: 26, size: 6, flower: true }), 1150, 650));
// flower borders along the fence
for (let x = 110, k = 0; x < 520; x += 76, k++) scene(at(flowers(30 + k, 9, 66, ['#e85a5a', '#f2c84a', '#fbf6ec', '#e89ab0', '#b89ae0']), x, 556, 1.5));
for (let x = 730, k = 0; x < 1100; x += 76, k++) scene(at(flowers(50 + k, 9, 66, ['#f08a2a', '#fbf6ec', '#e89ab0', '#f2c84a', '#5aa8d8']), x, 556, 1.5));

// =====================================================================
// things on the lawn
// =====================================================================
hide(390, 'kite', 'Kite', at(kite(54, '#e85a5a', '#f2c84a', '#5aa8d8'), 118, 370, 1, 24));
put(560, at(parkSign(150), 430, 566));
put(562, at(lampPost(250), 506, 566), at(lampPost(250), 720, 566));
put(570, at(bagStation(150), 768, 584));
hide(600, 'squirrel', 'Squirrel', at(squirrel(60), 112, 600));

// far lawn: a greyhound chasing a ball
put(606, at(dog(104, C.grey, { leg: 42, bodyH: 20, snout: 1.4, ear: 'fold', tail: 'down', run: true, collar: C.red }), 292, 630), ol(circle(206, 620, 7), '#e85a5a', 1));

// bench with someone's things
put(712, at(bench(196, '#b07a4a'), 152, 716));
hide(713, 'coffee', 'Coffee cup', at(paperCup(52, '#c8473a', 'paw'), 92, 667));
hide(714, 'backpack', 'Backpack', at(backpack(84), 184, 668));
put(730, at(dog(98, C.black, { leg: 16, ear: 'point', beard: true, fluffy: true, tail: 'up', collar: C.red }), 70, 772));

// fountain
put(850, at(fountain(300), 412, 850));
hide(851, 'pigeon', 'Pigeon', at(pigeon(64), 318, 788));
put(852, at(petBowl(70, C.blue, '#8fd0dc', 'paw'), 590, 872));

// coffee cart
put(720, at(coffeeCart(250), 962, 722));
{
  const cy = 722 - 250 * 0.56;
  put(721, at(paperCup(34, '#b98552'), 880, cy - 7), at(paperCup(34, '#3f7f7a'), 908, cy - 7), at(paperCup(28, '#b98552'), 934, cy - 7), ol(rect(1004, cy - 44, 44, 38, 4), '#c9d0d5', 1, -0.4), ol(rect(1010, cy - 38, 32, 14, 2), '#3b3532', 1), sh(circle(1016, cy - 16, 3) + circle(1036, cy - 16, 3), '#c8473a'), ol(rect(966, cy - 30, 22, 24, 3), '#f6ead2', 1), sh(pawPrint(977, cy - 18, 5), '#c8473a'));
}
put(760, at(dog(110, C.white, { pom: true, fluffy: true, earCol: C.white, collar: C.pink }), 668, 760));
put(800, flip(dog(84, C.tan, { leg: 18, snout: 0.45, tail: 'curl', mask: '#5a4238', muzzle: '#5a4238', ear: 'fold', earCol: '#5a4238', head: 1.15, collar: C.blue }), 792, 806));
put(890, at(waterStation(150), 1112, 900));
put(905, flip(dog(120, C.white, { saddle: C.brown, ear: 'long', earCol: C.brown, mask: C.brown, tail: 'up', collar: C.red }), 1040, 908));

// middle lawn: fetch
put(960, at(dog(170, C.golden, { tail: 'plume', collar: C.red, tongue: true, earCol: '#c98a3a' }), 236, 986));
hide(990, 'tennis-ball', 'Tennis ball', at(tennisBall(22), 86, 990));
hide(900, 'frisbee', 'Red frisbee', at(frisbee(40, C.red, 0.5), 520, 944, 1, -14));
put(1040, at(dog(176, C.white, { spots: 4, tail: 'up', collar: C.blue, run: true, tongue: true }), 668, 1052));

// bench by the path
put(1016, at(bench(176, '#b07a4a'), 1104, 1020));
hide(1017, 'sunhat', 'Sun hat', at(sunhat(74, '#e85a5a'), 1076, 968));
put(1018, at(leash(120, C.teal), 1170, 932, 1, 8));
hide(1160, 'butterfly', 'Butterfly', at(butterfly(54, '#f08a2a'), 800, 1172, 1, 18));

// agility course
put(1150, at(weavePoles(6, 46, 112), 250, 1150));
put(1168, at(dog(126, C.ginger, { leg: 15, ear: 'point', tail: 'stub', patch: C.white, socks: C.white, muzzle: C.white, collar: C.teal, tongue: true, run: true }), 430, 1172));
put(1262, at(agilityHoop(236), 150, 1266));
put(1290, at(tunnel(250), 690, 1296));
put(1296, at(pup(124, C.slate, { ear: 'point', patch: C.white, blaze: true, collar: C.red, tongue: true }), 344, 1300));
put(1398, at(dog(140, C.white, { saddle: C.brown, ear: 'long', earCol: C.brown, mask: C.brown, tail: 'up', run: true, collar: C.red }).slice(1), 486, 1320));
put(1400, at(hurdle(196), 478, 1410));
hide(1440, 'rope-toy', 'Rope toy', at(ropeToy(92), 668, 1436, 1, -12));
put(1340, at(dog(156, C.brown, { leg: 12, len: 1.25, ear: 'long', tail: 'up', snout: 1.3, collar: C.mustard }), 986, 1352));
hide(1300, 'bone', 'Dog bone', at(bone(84), 1128, 1300, 1, -20));
put(1470, at(pup(132, C.golden, { collar: C.blue, tongue: true }), 1120, 1476));

// picnic in the corner
{
  const bl = poly([[10, 1392], [300, 1380], [330, 1492], [-10, 1500]]);
  let chk = '';
  for (let i = 1; i < 6; i++) chk += poly([[10 + i * 48, 1392 - i * 2], [10 + i * 48 + 22, 1391 - i * 2], [-10 + i * 57 + 26, 1500 - i * 1.4], [-10 + i * 57, 1500 - i * 1.4]]);
  put(1392, sh(bl, '#e85a5a'), sh(chk, '#fbf6ec', { opacity: 0.85 }), sh(poly([[4, 1418], [308, 1407], [314, 1429], [0, 1441]]) + poly([[-4, 1462], [322, 1452], [326, 1472], [-8, 1484]]), '#fbf6ec', { opacity: 0.5 }), stroke(bl, '#b8403a', 1.4));
  put(1393, at(basketHandle(104, 62), 96, 1404));
  put(1394, at(baguette(96), 122, 1398, 1, -58));
  hide(1395, 'picnic-basket', 'Picnic basket', [...at(basket(112, 64, '#c99a5b'), 96, 1404), sh(poly([[40, 1400], [152, 1400], [146, 1416], [90, 1420], [46, 1414]]), '#f6ead2'), stroke(line([[60, 1406], [130, 1406]]), '#5aa8d8', 2)]);
  hide(1480, 'water-bottle', 'Water bottle', at(waterBottle(84), 214, 1474, 1, 0));
  put(1481, at(apple(30), 268, 1470), at(apple(28, '#8ab84a'), 292, 1482));
}

queue.sort((a, b) => a.y - b.y).forEach((q) => items.push(q.item));
// foreground grass along the bottom edge
scene(grassTufts(0, 1486, W, 12, 46, 9, ['#4f8e44', '#63a652'], 26));

const activity: FindActivity = {
  id: 'pets-find-2', version: 1, mode: 'find', title: 'Dog Park Saturday', blurb: 'Under a blue city sky the dogs race, leap and splash around the fountain while thirteen things from a sunny day out hide in the grass.',
  collectionId: 'pets', categories: ["Animals", "Pets"], difficulty: 'Relaxed',
  added: '2026-11-26',
  width: W, height: H, defs, items,
};
export default activity;
