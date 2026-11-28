import { rect, ellipse, circle, poly, line, sh, stroke, place, shade, rng, linearGradient } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { FindActivity, FindItem } from '../types';
import { basket } from '../kitchen/props-find';
import { woodFloor, cactus, pendant, snakePlant, lyingDog, cityView, fairyLights } from '../cafe/props-find';
import { bunting } from '../seasons/props-find';
import {
  PET as C, pawPrint, dog, pup, catSit, catCurl, catPeek, catWalk, fishBowl, fishTank, parakeet, hamster, turtle, birdCageBack, birdCageFront, hamsterCage,
  petBed, petBedFront, leash, collar, bone, foodBag, foodCan, petBowl, treatJar, ropeToy, rubberDuck, toyMouse, featherWand, catTree, scratchPost, boxBack, boxFront,
  petCarrier, till, shampoo, brush, dogJumper, shopSign, fishBiscuit, frisbee, tennisBall, heartPath,
} from './props-find';

const ID = 'pets-find-1';
const W = 1200, H = 1500;
const items: FindItem[] = [];
const scene = (...s: (Shape | Shape[])[]) => { items.push({ shapes: s.flat() }); };
const target = (id: string, name: string, shapes: Shape[]) => { items.push({ id, name, target: true, shapes }); };
const at = (s: Shape[], x: number, y: number, k = 1, rot = 0) => place(s, { x, y, s: k, rot });
const ol = (d: string, fill: string, w = 1, amt = -0.3): Shape => sh(d, fill, { stroke: shade(fill, amt), strokeWidth: w });

const defs = linearGradient(`${ID}-sky`, [[0, '#bfe3ee'], [0.6, '#e2f1ea'], [1, '#f8efd6']]);

// =====================================================================
// walls and ceiling
// =====================================================================
scene(sh(rect(0, 40, W, 770), '#f3e2c4'));
{
  const g = rng(11);
  let paws = '', paws2 = '';
  for (let r = 0, y = 110; y < 790; y += 62, r++) for (let x = (r % 2 ? 50 : 5); x < W; x += 92) { const d = pawPrint(x + g.range(-6, 6), y + g.range(-6, 6), 9, g.range(-30, 30)); if ((r + Math.round(x / 92)) % 3) paws += d; else paws2 += d; }
  scene(sh(paws, '#ead2a8'), sh(paws2, '#e6c8a0'));
}
scene(sh(rect(0, 40, W, 30), '#3f7f7a'), sh(rect(0, 70, W, 5), '#f6ead2'), sh(rect(0, 75, W, 3), '#c8473a'));
{
  let sc = '';
  for (let x = 0; x < W; x += 40) sc += `M${x} 78Q${x + 20} 96 ${x + 40} 78Z`;
  scene(sh(sc, '#3f7f7a'));
}
scene(sh(rect(0, 0, W, 44), '#5e4230'), sh(rect(0, 36, W, 8), '#3a2618'));
{
  let b = '';
  for (let x = 30; x < W; x += 160) b += rect(x, 0, 18, 44);
  scene(sh(b, '#73533c'));
}
// wainscot on the left wall
scene(sh(rect(0, 566, 470, 244), '#8fb5a6'));
{
  let p = '';
  for (let x = 12; x < 460; x += 38) p += line([[x, 572], [x, 800]]);
  scene(stroke(p, '#7aa091', 2), sh(rect(0, 560, 470, 10, 2), '#f6ead2'), sh(rect(0, 570, 470, 5), '#000000', { opacity: 0.12 }));
}

// =====================================================================
// shop window with the street outside
// =====================================================================
{
  const x0 = 50, y0 = 126, w = 290, h = 392;
  scene(cityView(x0, y0, w, h, 5, false, `url(#${ID}-sky)`));
  scene(sh(rect(x0, y0 + h - 44, w, 44), '#cbbfa8'), sh(rect(x0, y0 + h - 44, w, 5), '#a89a82'));
  // street tree and a lamp
  scene(sh(rect(x0 + 216, y0 + 190, 10, 160), '#6a4a32'));
  const g = rng(3);
  let c1 = '', c2 = '';
  for (let i = 0; i < 14; i++) { const d = circle(x0 + 222 + g.range(-46, 40), y0 + 150 + g.range(-50, 40), g.range(20, 32)); if (i % 2) c1 += d; else c2 += d; }
  scene(sh(c1, '#6f9a5c'), sh(c2, '#88b06a'));
  scene(stroke(line([[x0 + 70, y0 + h - 30], [x0 + 70, y0 + 170]]), '#2b3a34', 5), sh(rect(x0 + 59, y0 + 148, 22, 26, 4), '#2b3a34'), sh(rect(x0 + 63, y0 + 153, 14, 16, 2), '#fbe3a0'));
  // paw decals on the glass and sheen
  scene(sh(pawPrint(x0 + 50, y0 + 54, 16, -14) + pawPrint(x0 + 104, y0 + 40, 12, 10) + pawPrint(x0 + 232, y0 + 58, 14, 16), '#ffffff', { opacity: 0.6 }));
  scene(sh(poly([[x0 + 40, y0], [x0 + 90, y0], [x0 - 10, y0 + h], [x0 - 60, y0 + h]]), '#ffffff', { opacity: 0.1 }), sh(poly([[x0 + 190, y0], [x0 + 216, y0], [x0 + 116, y0 + h], [x0 + 90, y0 + h]]), '#ffffff', { opacity: 0.1 }));
  const fc = '#2f5a50';
  scene(sh(rect(x0 - 14, y0 - 14, w + 28, 14) + rect(x0 - 14, y0 + h, w + 28, 8) + rect(x0 - 14, y0, 14, h) + rect(x0 + w, y0, 14, h) + rect(x0 + w / 2 - 5, y0, 10, h) + rect(x0, y0 + 96, w, 8), fc), sh(rect(x0 - 14, y0 - 14, w + 28, 4), '#4a7a6a'));
  scene(fairyLights([[x0 - 8, y0 + 4], [x0 + w / 2, y0 + 10], [x0 + w + 8, y0 + 4]], 22, 24, ['#ffd98a', '#f6b0a0', '#fff1c4'], 4, 4));
  // ledge
  scene(sh(rect(x0 - 24, y0 + h + 4, w + 48, 22, 3), '#8a5a36'), sh(rect(x0 - 24, y0 + h + 4, w + 48, 6, 3), '#b07a4a'));
}
const LEDGE = 522;
target('fish-bowl', 'Goldfish bowl', at(fishBowl(92), 104, LEDGE));
scene(at(catSit(96, C.grey, { pat: 'tabby', head: 1.15 }), 208, LEDGE));
scene(at(cactus(64, '#d98a7a'), 300, LEDGE));
scene(at(pendant(34, 46, '#c8473a'), 196, 44));
scene(bunting(0, 52, 400, 58, 40, 11, ['#c8473a', '#f2c84a', '#3f7f7a', '#f6ead2', '#e89ab0'], 20));

// hanging bird cage
scene(stroke(line([[412, 44], [412, 126]]), '#8a7a4a', 2.4));
scene(at(birdCageBack(116, 210), 412, 340), at(parakeet(68, '#5aa8e0', '#fbf6ec'), 408, 269), at(birdCageFront(116, 210), 412, 340));

// =====================================================================
// pegboard of leads, collars and jumpers
// =====================================================================
{
  scene(sh(rect(34, 590, 340, 196, 6), '#000000', { opacity: 0.12 }), ol(rect(30, 584, 340, 196, 6), '#dcc096', 1.4));
  let holes = '';
  for (let y = 600; y < 772; y += 18) for (let x = 44; x < 362; x += 18) holes += circle(x, y, 1.8);
  scene(sh(holes, '#b89a6c'));
  let hooks = '';
  for (const x of [62, 100, 138, 196, 256, 318]) hooks += rect(x - 4, 598, 8, 8, 2);
  scene(sh(hooks, '#6f7480'));
  scene(at(leash(160, C.red), 62, 602), at(leash(160, C.teal), 100, 602), at(leash(160, C.mustard), 138, 602));
  scene(at(collar(56, C.red), 196, 628), at(collar(56, C.green, '#c9d0d5'), 196, 708));
  scene(at(dogJumper(66, C.blue, '#f2c84a'), 256, 602));
  target('collar', 'Blue collar', at(collar(60, C.blue), 258, 712));
  target('jumper', 'Red dog jumper', at(dogJumper(78, C.red), 320, 602));
  scene(at(collar(46, C.plum, '#e8c04a'), 324, 722));
}
scene(sh(rect(0, 792, 470, 18), '#6f9486'));

// =====================================================================
// the big shelving unit
// =====================================================================
const SX = 480, SW = 690, ROWS = [240, 400, 570, 740];
{
  scene(sh(rect(SX + 8, 92, SW, 720), '#000000', { opacity: 0.12 }));
  scene(sh(rect(SX, 84, SW, 722), '#9a6a40'), sh(rect(SX + 14, 98, SW - 28, 654), '#f0dcb4'));
  let pl = '';
  for (let x = SX + 14; x < SX + SW - 14; x += 46) pl += line([[x, 98], [x, 752]]);
  scene(stroke(pl, '#e2caa0', 1.6));
  ROWS.forEach((y, i) => scene(sh(rect(SX + 14, y - (i === 0 ? 142 : i === 1 ? 148 : 158), SW - 28, 14), '#000000', { opacity: 0.1 })));
}
// row 1: food
{
  const y = ROWS[0];
  scene(at(foodBag(78, 124, C.teal, 'paw'), 540, y), at(foodBag(74, 112, C.red, 'fish'), 620, y), at(foodBag(80, 128, C.mustard, 'bone'), 700, y), at(foodBag(70, 106, C.plum, 'paw'), 778, y), at(foodBag(76, 120, C.blue, 'bone'), 852, y));
  scene(at(foodBag(54, 80, C.pink, 'heart', '#fbf6ec'), 924, y), at(foodBag(54, 86, C.green, 'fish'), 980, y));
  scene(at(shampoo(86, '#e89ab0'), 1036, y), at(shampoo(78, '#9ad28a'), 1074, y), at(shampoo(86, '#b89ae0'), 1112, y));
  scene(ol(rect(1128, y - 44, 24, 44, 3), '#f2c84a', 1), ol(rect(1128, y - 80, 24, 34, 3), '#e85a5a', 1), sh(pawPrint(1140, y - 22, 5) + pawPrint(1140, y - 62, 5), '#fbf6ec'));
}
// row 2: fish tanks and the turtle
{
  const y = ROWS[1];
  scene(at(fishTank(252, 116, 3), 626, y - 4), at(fishTank(196, 116, 8, { castle: false, n: 6 }), 866, y - 4));
  scene(ol(rect(990, y - 12, 150, 12, 4), '#7aa86a', 1.2), sh(ellipse(1100, y - 12, 26, 5), '#8fd0dc'), ol(ellipse(1016, y - 14, 16, 8), '#a4a8b0', 1));
  scene(sh(`M1118 ${y - 12}Q1106 ${y - 60} 1090 ${y - 72}Q1112 ${y - 52} 1122 ${y - 12}Z` + `M1122 ${y - 12}Q1128 ${y - 66} 1146 ${y - 78}Q1132 ${y - 52} 1128 ${y - 12}Z` + `M1120 ${y - 12}Q1118 ${y - 76} 1114 ${y - 96}Q1126 ${y - 60} 1125 ${y - 12}Z`, '#5c9a5a'));
  target('turtle', 'Turtle', at(turtle(62), 1064, y - 12));
}
// row 3: hamsters and toys
{
  const y = ROWS[2];
  scene(at(hamsterCage(188, 138), 596, y));
  target('hamster', 'Escaped hamster', at(hamster(48, '#e8b878'), 722, y));
  // basket of balls
  const cols = ['#e85a5a', '#f2c84a', '#5aa8d8', '#9ad28a', '#e89ab0', '#f08a2a', '#b89ae0'];
  const g = rng(5);
  for (let i = 0; i < 9; i++) scene(ol(circle(772 + (i % 5) * 16 + g.range(-3, 3), y - 62 - Math.floor(i / 5) * 13 + g.range(-3, 3), 11), cols[i % cols.length], 1));
  scene(at(basket(96, 52, '#c99a5b'), 804, y - 52));
  target('duck', 'Yellow rubber duck', at(rubberDuck(54), 896, y));
  scene(at(frisbee(30, C.red), 972, y - 8), at(frisbee(30, C.teal), 972, y - 19), at(frisbee(30, C.mustard), 972, y - 30), at(frisbee(30, C.blue), 972, y - 41));
  scene(at(bone(64, '#e89ab0'), 1048, y - 10), at(bone(64, '#9ad28a'), 1052, y - 30, 1, -8), at(bone(60, '#f2c84a'), 1046, y - 50, 1, 6));
  scene(at(ropeToy(70, '#4f86c0', '#fbf6ec'), 1122, y - 10), at(ropeToy(66, '#f08a2a', '#fbf6ec'), 1120, y - 32, 1, 6), at(toyMouse(44, '#e8b878'), 1120, y - 44));
  scene(at(toyMouse(40, '#c8a0d0'), 930, y - 96 + 96));
}
// row 4: beds, carrier, bowls
{
  const y = ROWS[3];
  scene(at(petBed(150, C.teal), 584, y), at(petBedFront(150, C.teal), 584, y), at(petBed(140, C.mustard), 584, y - 34), at(petBedFront(140, C.mustard), 584, y - 34), at(petBed(126, C.pink), 584, y - 66), at(petBedFront(126, C.pink), 584, y - 66));
  scene(at(petCarrier(136, C.blue), 752, y));
  scene(at(petBowl(84, C.red, undefined, 'bone'), 884, y), at(petBowl(76, C.teal, undefined, 'paw'), 884, y - 30), at(petBowl(68, C.mustard, undefined, 'fish'), 884, y - 58));
  scene(at(scratchPost(140, '#e89ab0'), 986, y));
  scene(at(foodBag(64, 118, '#5c8a4e', 'paw'), 1064, y), at(foodBag(60, 104, '#f08a2a', 'fish'), 1124, y));
}
// shelf boards, sides, crown and plinth
{
  const wood = '#b07a4a';
  ROWS.forEach((y) => scene(ol(rect(SX + 6, y, SW - 12, 13, 2), wood, 1), sh(rect(SX + 6, y, SW - 12, 4, 2), '#c99868')));
  scene(ol(rect(SX, 84, 15, 722), wood, 1), ol(rect(SX + SW - 15, 84, 15, 722), wood, 1), ol(rect(SX - 10, 72, SW + 20, 22, 4), '#9a6a40', 1.2), sh(rect(SX - 10, 72, SW + 20, 6, 3), '#c99868'));
  scene(sh(rect(SX + 15, 753, SW - 30, 53), '#8a5a36'), ol(rect(SX + 28, 762, 300, 36, 3), '#a06c40', 1), ol(rect(SX + 362, 762, 300, 36, 3), '#a06c40', 1), ol(rect(SX + 158, 776, 40, 8, 4), '#e8c04a', 0.8), ol(rect(SX + 492, 776, 40, 8, 4), '#e8c04a', 0.8));
  // price tags on shelf edges
  let tags = '';
  for (const y of ROWS) for (let x = SX + 50; x < SX + SW - 40; x += 96) tags += rect(x, y + 2, 26, 9, 1.5);
  scene(sh(tags, '#fbf6ec'));
}

// =====================================================================
// floor
// =====================================================================
scene(woodFloor(806, H, W, ['#d6a468', '#c9965a', '#deb078', '#c08c52'], 31));
scene(sh(rect(0, 806, W, 14), '#000000', { opacity: 0.16 }));
{
  // a trail of paw prints across the floor
  let tr = '';
  const pts: [number, number, number][] = [[690, 1250, -60], [650, 1296, -50], [596, 1316, -70], [548, 1360, -56], [500, 1376, -74], [640, 1470, -30], [700, 1440, -40]];
  pts.forEach(([x, y, r]) => { tr += pawPrint(x, y, 9, r); });
  scene(sh(tr, '#7a4f2e', { opacity: 0.22 }));
}

// =====================================================================
// puppy pen (left)
// =====================================================================
{
  const x0 = 30, x1 = 446;
  let back = '';
  for (let x = x0 + 8; x < x1; x += 14) back += line([[x, 846], [x, 950]]);
  scene(sh(poly([[x0, 950], [x1, 950], [x1 + 14, 1090], [x0 - 14, 1090]]), '#b8dcc8'), stroke(poly([[x0 + 30, 968], [x1 - 30, 968], [x1 - 20, 1070], [x0 + 20, 1070]]), '#f6ead2', 3, { opacity: 0.8 }));
  scene(stroke(back, '#aab2b8', 1.4), stroke(line([[x0, 846], [x1, 846]]) + line([[x0, 950], [x1, 950]]), '#8a9298', 3.4));
  scene(at(petBowl(70, C.blue, '#8fd0dc', 'paw'), 408, 1000));
  scene(at(pup(118, C.golden, { collar: C.red, tongue: true }), 112, 1052));
  scene(at(pup(104, C.white, { eyePatch: C.brown, earCol: C.brown, bow: C.red }), 226, 1034));
  scene(at(dog(112, C.ginger, { leg: 15, ear: 'point', tail: 'stub', patch: C.white, socks: C.white, muzzle: C.white, collar: C.teal, tongue: true }), 348, 1066));
  scene(ol(circle(268, 1064, 11), '#e85a5a', 1));
  let front = '';
  for (let x = x0 - 6; x < x1 + 14; x += 15) front += line([[x, 984], [x, 1090]]);
  scene(stroke(front, '#c0c8cc', 1.5), stroke(line([[x0 - 14, 984], [x1 + 14, 984]]) + line([[x0 - 14, 1090], [x1 + 14, 1090]]), '#8a9298', 4), sh(rect(x0 - 18, 976, 8, 118, 3) + rect(x1 + 10, 976, 8, 118, 3), '#6f7480'));
}

// =====================================================================
// cat tree (centre)
// =====================================================================
{
  const cx = 600, by = 1192, h = 380, u = h / 100;
  scene(at(catTree(h, '#e2d0b4'), cx, by));
  scene(at(catCurl(112, C.ginger, { pat: 'tabby' }), cx - 22 * u, by - 94 * u));
  scene(at(catSit(92, C.white, { pat: 'calico' }), cx + 23 * u, by - 66 * u));
  scene(at(catPeek(50, C.black, { pat: 'tux', eye: '#f2c84a' }), cx - 17 * u, by - 9.5 * u));
  target('toy-mouse', 'Grey toy mouse', at(toyMouse(46), cx - 4 * u, by - 39 * u));
}
target('feather-wand', 'Feather wand', at(featherWand(118), 420, 1196));

// =====================================================================
// shop counter (right)
// =====================================================================
{
  const x0 = 762, top = 946;
  scene(sh(ellipse(990, 1190, 250, 16), '#3b2a1c', { opacity: 0.2 }));
  scene(ol(rect(x0 + 10, top + 20, 440, 166), '#3f7f7a', 1.4));
  let pan = '';
  for (let i = 0; i < 3; i++) pan += rect(x0 + 28 + i * 138, top + 40, 120, 128, 5);
  scene(stroke(pan, '#2f625e', 2.4), sh(rect(x0 + 10, top + 20, 440, 10), '#000000', { opacity: 0.18 }), sh(rect(x0 + 10, top + 168, 440, 18), '#2f625e'));
  scene(sh(circle(x0 + 226, top + 104, 40), '#f6ead2'), sh(pawPrint(x0 + 226, top + 104, 22), '#c8473a'), sh(pawPrint(x0 + 88, top + 104, 14, -12) + pawPrint(x0 + 364, top + 104, 14, 12), '#5a9a94'));
  scene(ol(rect(x0, top, 460, 22, 4), '#b07a4a', 1.2), sh(rect(x0, top, 460, 6, 3), '#d0a070'));
  target('shampoo', 'Blue pet shampoo', at(shampoo(82, '#5aa8d8'), x0 + 30, top));
  scene(at(petBowl(84, '#f6ead2', '#d9a860', 'fish'), x0 + 104, top), at(fishBiscuit(34), x0 + 104, top - 44, 1, -20), at(fishBiscuit(30), x0 + 86, top - 38, 1, 24));
  target('treat-jar', 'Treat jar', at(treatJar(100), x0 + 192, top));
  target('cat-food', 'Tin of cat food', at(foodCan(44, C.mustard, 'fish'), x0 + 262, top));
  scene(at(till(118), x0 + 356, top));
  target('budgie', 'Green budgie', at(parakeet(62), x0 + 344, top - 94));
}
// big sacks and a customer by the counter
scene(at(foodBag(116, 176, C.red, 'bone'), 836, 1216), at(foodBag(104, 156, C.mustard, 'paw'), 934, 1210));
scene(at(dog(190, C.golden, { tail: 'plume', collar: C.red, tongue: true, earCol: '#c98a3a' }), 1076, 1296));
scene(at(shopSign(120, '#c8473a', 'heart'), 1086, 44));

// =====================================================================
// foreground
// =====================================================================
scene(sh(ellipse(300, 1392, 330, 96), '#3f7f7a'), stroke(ellipse(300, 1392, 300, 84) + ellipse(300, 1392, 236, 62), '#f6ead2', 3, { opacity: 0.8 }), stroke(ellipse(300, 1392, 268, 73), '#f2c84a', 2.4, { opacity: 0.85 }));
scene(at(petBed(280, C.red), 220, 1420), at(lyingDog(210, '#9a6238', '#f6ead2'), 228, 1388), at(petBedFront(280, C.red), 220, 1420));
target('rope-toy', 'Red rope toy', at(ropeToy(84), 400, 1140, 1, 16));
target('bone', 'Dog bone', at(bone(78), 478, 1430, 1, -18));
target('ball', 'Tennis ball', at(tennisBall(20), 742, 1236));
scene(at(catWalk(124, C.grey, { pat: 'tabby' }), 600, 1330));
target('brush', 'Grooming brush', at(brush(74), 730, 1440, 1, 12));
scene(at(petBowl(96, C.mustard, '#9a6238', 'bone'), 560, 1480));
scene(at(boxBack(130, 92), 880, 1476), at(catPeek(62, C.ginger, { pat: 'tabby' }), 880, 1386), at(boxFront(130, 92), 880, 1476));
{
  // toy basket
  scene(at(bone(70, '#8ab8e0'), 1010, 1380, 1, -50), at(ropeToy(80, '#9ad28a', '#fbf6ec'), 1060, 1378, 1, 62), ol(circle(1034, 1386, 17), '#e85a5a', 1.2), ol(circle(1084, 1390, 15), '#5aa8d8', 1.2), at(rubberDuck(40, '#f6b0c0'), 1100, 1388));
  scene(at(basket(150, 84, '#c99a5b'), 1050, 1392));
}
scene(at(snakePlant(170, 9, '#f6ead2'), 1160, 1496));
scene(at(scratchPost(150, '#5aa8d8'), 60, 1240));

const activity: FindActivity = {
  id: 'pets-find-1', version: 1, mode: 'find', title: 'The Pet Shop', blurb: 'Fish tanks bubble, puppies tumble in their pen and kittens rule the cat tree while sixteen pet-shop treasures wait to be found.',
  collectionId: 'pets', categories: ["Animals", "Pets"], difficulty: 'Detailed',
  added: '2026-11-26',
  width: W, height: H, defs, items,
};
export default activity;
