import { rect, ellipse, circle, poly, line, curve, blob, leaf, sh, stroke, place, shade, rng, linearGradient } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { FindActivity, FindItem } from '../types';
import {
  M, L, Q, ol, shadow, P, planks, tiles, floor, gingham, wallpaper, plate, bowl, mug, jug, cookPot, kettle, fryingPan, colander, utensil, teaTowel,
  jar, tin, spiceJar, bottle, basket, basketHandle, sack, pile, veg, leek, cabbage, herbPot, flowerVase, clock, bloomer,
  whisk, rollingPin, ovenGlove, teacup, ladle, egg, cherries, sittingCat, lemon, key, saltShaker, scissors, carrot, butterfly, woodenSpoon,
} from './props-find';

const ID = 'kitchen-find-1';
const W = 1200, H = 1500;
const items: FindItem[] = [];
const scene = (...s: (Shape | Shape[])[]) => { items.push({ shapes: s.flat() }); };
const target = (id: string, name: string, shapes: Shape[]) => { items.push({ id, name, target: true, shapes }); };

const defs =
  linearGradient(`${ID}-sky`, [[0, '#a9cdea'], [0.7, '#dcecf2'], [1, '#f6efd8']]) +
  linearGradient(`${ID}-range`, [[0, '#f8eed6'], [1, '#e9dcbc']]);

/** Bunch of dried herbs hanging upside-down from a string. */
function herbBunch(x: number, y: number, len: number, seed: number, col: string): Shape[] {
  const g = rng(seed);
  let a = '', b = '';
  for (let i = 0; i < 11; i++) { const d = leaf(x + g.range(-3, 3), y + len * 0.4, g.range(len * 0.4, len * 0.62), 5, 90 + g.range(-28, 28)); if (i % 2) a += d; else b += d; }
  return [stroke(line([[x, y], [x, y + len * 0.42]]), '#8a7050', 1.3), sh(a, col), sh(b, shade(col, 0.18)), sh(rect(x - 5, y + len * 0.36, 10, 7, 2), '#c99a6a')];
}

// =====================================================================
// back wall, beam and window
// =====================================================================
scene(wallpaper(0, 0, W, 1010, 62, '#f5ecd6', '#a9bf98', '#e8a58f', 3));
scene(planks(0, 0, W, 44, 1, '#7a5232', 4), sh(rect(0, 44, W, 10), '#3b2a1c', { opacity: 0.18 }));
for (const [x, s, c] of [[540, 1, '#7f9a5c'], [600, 2, '#9aa86a'], [665, 3, '#8a9a58'], [905, 4, '#7f9a5c'], [968, 5, '#a8a070'], [1040, 6, '#8a9a58'], [1110, 7, '#9aa86a'], [1170, 8, '#7f9a5c']] as [number, number, string][]) scene(herbBunch(x, 44, 92 + (s % 3) * 14, s * 13, c));
// strings of onions from the beam
{
  const g = rng(41);
  const out: Shape[] = [stroke(line([[790, 44], [790, 150]]) + line([[842, 44], [842, 130]]), '#b8a070', 1.6)];
  for (let i = 0; i < 6; i++) out.push(...veg(790 + (i % 2 ? 7 : -7), 64 + i * 15, 9, 'onion', g));
  for (let i = 0; i < 5; i++) out.push(...veg(842 + (i % 2 ? 6 : -6), 62 + i * 14, 8, 'redonion', g));
  scene(out);
}
// window over the garden
{
  const x0 = 1010, y0 = 160, w = 160, h = 372;
  scene(sh(rect(x0, y0, w, h), `url(#${ID}-sky)`));
  scene(sh(blob([[x0, y0 + 250], [x0 + 50, y0 + 220], [x0 + 110, y0 + 236], [x0 + 160, y0 + 214], [x0 + 160, y0 + h], [x0, y0 + h]], 0.6), '#a9c48a'), sh(blob([[x0, y0 + 290], [x0 + 80, y0 + 270], [x0 + 160, y0 + 286], [x0 + 160, y0 + h], [x0, y0 + h]], 0.6), '#8fb070'));
  const g = rng(17);
  let t1 = '', t2 = '';
  for (let i = 0; i < 16; i++) { const d = circle(x0 + g.range(6, 154), y0 + g.range(200, 270), g.range(12, 22)); if (i % 2) t1 += d; else t2 += d; }
  scene(sh(t1, '#6f9a5c'), sh(t2, '#5c8a4f'), sh(ellipse(x0 + 40, y0 + 60, 26, 9) + ellipse(x0 + 60, y0 + 54, 20, 9) + ellipse(x0 + 120, y0 + 110, 22, 7), '#ffffff', { opacity: 0.85 }));
  let fl = '';
  for (let i = 0; i < 18; i++) fl += circle(x0 + g.range(6, 154), y0 + g.range(300, 366), 2.6);
  scene(sh(fl, '#f3d77a'));
  scene(stroke(rect(x0, y0, w, h) + line([[x0 + w / 2, y0], [x0 + w / 2, y0 + h]]) + line([[x0, y0 + h / 3], [x0 + w, y0 + h / 3]]) + line([[x0, y0 + (h * 2) / 3], [x0 + w, y0 + (h * 2) / 3]]), '#fbf6e8', 8), stroke(rect(x0 - 4, y0 - 4, w + 8, h + 8), '#d9ccb0', 2));
  // curtain pole and gingham curtains
  scene(sh(rect(986, 138, 214, 8, 3), '#7a5232'), sh(circle(986, 142, 7), '#7a5232'));
  const cl = gingham(988, 146, 48, 300, 7, '#fbf3df', P.tomato), cr = gingham(1150, 146, 50, 300, 7, '#fbf3df', P.tomato);
  scene(cl, stroke(line([[1000, 150], [1004, 440]]) + line([[1016, 150], [1022, 440]]), '#3b2a1c', 3, { opacity: 0.12 }), sh(rect(986, 330, 54, 12, 4), P.tomatoDk));
  scene(cr, stroke(line([[1168, 150], [1166, 440]]) + line([[1184, 150], [1186, 440]]), '#3b2a1c', 3, { opacity: 0.12 }), sh(rect(1146, 330, 56, 12, 4), P.tomatoDk));
  // sill with herbs
  scene(sh(rect(996, 532, 204, 14, 2), '#e8dcc0'), sh(rect(996, 544, 204, 6), '#c9b894'));
  scene(place(herbPot(46, 21), { x: 1040, y: 532 }), place(herbPot(40, 22, '#b85a38'), { x: 1150, y: 532 }));
  target('butterfly', 'Butterfly', place(butterfly(46, '#7f9fd8'), { x: 1100, y: 470, rot: 14 }));
  scene(place(jug(46, '#f3d77a', P.cornflower), { x: 1096, y: 532 }));
}

// =====================================================================
// welsh dresser (left)
// =====================================================================
scene(planks(56, 150, 388, 534, 7, '#a9bf98', 11, true), sh(rect(56, 150, 388, 14), '#3b2a1c', { opacity: 0.15 }));
scene(sh(rect(40, 140, 18, 548), '#87a278'), sh(rect(442, 140, 18, 548), '#6f8a62'), sh(rect(28, 116, 444, 28, 3), '#8fa880'), sh(rect(28, 116, 444, 8, 3), '#a9bf98'), sh(rect(34, 140, 432, 10), '#6f8a62'));
{
  let sc = '';
  for (let x = 40; x < 460; x += 28) sc += M(x, 150) + Q(x + 14, 168, x + 28, 150);
  scene(stroke(sc, '#6f8a62', 3));
}
// things on top of the dresser
scene(place(basketHandle(84, 46), { x: 100, y: 96 }), place(basket(84, 22, '#c99a5b'), { x: 100, y: 96 }));
scene(place(jug(70, '#f7efdc', P.cornflower), { x: 200, y: 116 }), place(plate(40, '#f7efdc', P.tomato, 2), { x: 280, y: 78 }));
target('cat', 'Cat', place(sittingCat(84, '#e39a52'), { x: 386, y: 116 }));
// shelves: plates leaning on rails, mugs on hooks
const shelfY = [300, 452, 596];
for (const y of shelfY) scene(sh(rect(56, y, 388, 14), '#7f9a70'), sh(rect(56, y, 388, 4), '#a9bf98'), sh(rect(56, y + 14, 388, 6), '#3b2a1c', { opacity: 0.15 }));
{
  const accents = [P.cornflower, P.tomato, '#7f9f6a', P.cornflower, '#e3a83a', P.tomato];
  const row1: number[] = [96, 168, 240, 312, 384];
  row1.forEach((x, i) => scene(place(plate(34, i % 2 ? '#fbf6e8' : '#f3ecd8', accents[i], i % 4), { x, y: 264 })));
  scene(stroke(line([[56, 284], [444, 284]]), '#6f8a62', 4));
  // hooks and mugs under shelf 1
  const mugs: [number, string, string][] = [[90, P.cornflower, '#fbf3df'], [150, '#f3d77a', P.tomato], [270, '#fbf3df', P.cornflower], [330, P.tomato, '#fbf3df'], [400, '#9cb48a', '#fbf3df']];
  for (const [x, c, b] of mugs) scene(stroke(M(x, 316) + L(x, 326) + Q(x, 332, x + 6, 330), '#4a5258', 1.6), place(mug(34, c, b), { x: x - 8, y: 366 }));
  // scissors hanging from the dresser side
  scene(stroke(M(452, 380) + L(452, 392), '#4a5258', 2));
  target('scissors', 'Scissors', place(scissors(70, P.tomato), { x: 452, y: 400, rot: 120 }));
  // shelf 2: plates, jugs and the teacup
  scene(place(plate(32, '#fbf6e8', P.cornflower, 3), { x: 92, y: 418 }), place(plate(32, '#f3ecd8', P.tomato, 0), { x: 160, y: 418 }));
  scene(place(jug(56, P.cornflower, '#fbf3df'), { x: 232, y: 452 }), place(jug(48, '#f3d77a', P.tomato), { x: 296, y: 452 }));
  target('teacup', 'Teacup', place(teacup(46, '#7f9fd8'), { x: 352, y: 452 }));
  scene(place(plate(30, '#fbf6e8', '#7f9f6a', 2), { x: 408, y: 420 }));
  scene(stroke(line([[56, 438], [444, 438]]), '#6f8a62', 4));
  // shelf 3: bowls, jars and a teapot-shaped jug
  scene(place(bowl(80, 30, '#fbf6e8', P.cornflower), { x: 104, y: 596 }), place(bowl(70, 26, '#f3d77a', '#fbf3df'), { x: 104, y: 566 }), place(bowl(60, 22, P.tomato, '#fbf3df'), { x: 104, y: 540 }));
  scene(place(jar(38, 56, '#c8322a', 0, '#fbf3df'), { x: 186, y: 596 }), place(jar(38, 50, '#e8a03a', 0, P.cornflower), { x: 232, y: 596 }), place(jar(36, 58, '#7d2f4a', 0, '#f3d77a'), { x: 276, y: 596 }));
  scene(place(plate(30, '#f3ecd8', '#e3a83a', 1), { x: 330, y: 562 }), place(jug(62, '#fbf6e8', P.tomato), { x: 400, y: 596 }));
}
// worktop, drawers and cupboard
scene(sh(rect(28, 680, 444, 20, 2), '#b98552'), sh(rect(28, 680, 444, 5, 2), '#d4a26c'));
scene(planks(40, 700, 420, 290, 1, '#87a278', 21), sh(rect(40, 700, 420, 290), '#000000', { opacity: 0.03 }));
scene(ol(rect(54, 710, 190, 56, 4), '#94ad84', 1.4, -0.3), ol(rect(256, 710, 190, 56, 4), '#94ad84', 1.4, -0.3), sh(circle(149, 738, 6) + circle(351, 738, 6), '#c9a24a'));
scene(ol(rect(54, 778, 190, 200, 4), '#94ad84', 1.4, -0.3), ol(rect(256, 778, 190, 200, 4), '#94ad84', 1.4, -0.3), stroke(rect(72, 796, 154, 164, 3) + rect(274, 796, 154, 164, 3), '#6f8a62', 2), sh(circle(232, 878, 6) + circle(268, 878, 6), '#c9a24a'), sh(rect(36, 986, 428, 16), '#6f8a62'));
// on the worktop: crock, bread board, rolling pin, jars
{
  scene(place(utensil(110, 2, P.steel, '#7a5232'), { x: 76, y: 572 }), place(utensil(120, 0, '#c98f55', '#c98f55'), { x: 96, y: 562 }), place(utensil(104, 3, P.steel, '#3b2f2a'), { x: 112, y: 580 }));
  scene(ol(rect(66, 610, 64, 70, 8), '#efe4c8', 1.2, -0.25), sh(rect(66, 630, 64, 10), P.cornflower), sh(ellipse(98, 612, 32, 7), '#c9b894'));
  scene(ol(rect(150, 596, 110, 84, 30), '#c98f55', 1.2, -0.35), sh(circle(205, 610, 6), '#8a5a30'), stroke(line([[166, 640], [244, 642]]) + line([[164, 660], [246, 660]]), '#a8743e', 1));
  scene(place(bloomer(96), { x: 205, y: 676 }));
  target('rolling-pin', 'Rolling pin', place(rollingPin(132), { x: 236, y: 670, rot: -3 }));
  scene(place(tin(40, 52, P.tomato, '#fbf3df'), { x: 330, y: 680 }), place(tin(34, 40, '#9cb48a', '#f3d77a'), { x: 372, y: 680 }), place(jar(32, 44, '#f3d77a', 1, '#c9d0d5'), { x: 414, y: 680 }), place(spiceJar(18, 26, '#b8742e', '#3b2f2a'), { x: 446, y: 680 }));
}

// =====================================================================
// chimney: mantel shelf, tiles, rail and range
// =====================================================================
scene(tiles(482, 264, 516, 378, 43, ['#f7f1e2', '#efe8d6', '#f3ecda'], '#d6ccb4', 31, P.cornflower));
scene(sh(rect(474, 246, 532, 16, 2), '#8a5a34'), sh(rect(474, 246, 532, 4, 2), '#b98552'), sh(rect(474, 262, 532, 8), '#3b2a1c', { opacity: 0.18 }));
scene(sh(poly([[492, 262], [512, 262], [492, 296]]) + poly([[988, 262], [968, 262], [988, 296]]), '#7a5232'));
// on the mantel
{
  scene(place(tin(44, 62, '#f3d77a', P.tomato), { x: 510, y: 246 }), place(jar(36, 52, '#e8a03a', 2, ''), { x: 556, y: 246 }));
  scene(sh(rect(586, 206, 64, 40, 4), '#8a5a34'), place(clock(30, '#8a5a34'), { x: 618, y: 196 }));
  scene(place(spiceJar(20, 30, '#c8562a', '#3b2f2a'), { x: 672, y: 246 }), place(spiceJar(20, 34, '#7a8a3a', '#3b2f2a'), { x: 698, y: 246 }), place(spiceJar(20, 30, '#e8c060', P.tomato), { x: 724, y: 246 }));
  scene(place(plate(34, '#fbf6e8', P.tomato, 2), { x: 782, y: 212 }), stroke(line([[748, 238], [816, 238]]), '#7a5232', 3));
  scene(place(tin(42, 70, P.cornflower, '#fbf3df'), { x: 846, y: 246 }), place(jar(34, 46, '#c8322a', 0, '#9cb48a'), { x: 892, y: 246 }), place(bottle(22, 64, '#7a8a3a', '#c99a6a'), { x: 930, y: 246 }), place(tin(36, 44, '#9cb48a', '#e8a03a'), { x: 970, y: 246 }));
  // cup hooks under the mantel with mugs and the key
  for (const x of [540, 600, 700, 760, 900]) scene(stroke(M(x, 270) + L(x, 278) + Q(x, 284, x + 5, 282), '#4a5258', 1.4));
  scene(place(mug(30, '#f7efdc', P.tomato), { x: 534, y: 318 }), place(mug(30, P.tomato, '#fbf3df'), { x: 594, y: 318 }), place(mug(30, '#f3d77a', P.cornflower), { x: 754, y: 318 }), place(mug(30, P.cornflower, '#fbf3df'), { x: 894, y: 318 }));
  target('key', 'Key', place(key(52), { x: 704, y: 300, rot: 84 }));
}
// rail with hanging utensils
{
  const ry = 398;
  scene(sh(rect(520, ry - 4, 446, 7, 3), '#9aa2a8'), sh(circle(522, ry, 7) + circle(964, ry, 7), '#646c72'));
  scene(place(fryingPan(38, '#3f3a36'), { x: 562, y: ry }));
  target('ladle', 'Ladle', place(ladle(150), { x: 632, y: ry }));
  scene(place(utensil(140, 0), { x: 682, y: ry }));
  target('whisk', 'Whisk', place(whisk(132), { x: 732, y: ry }));
  scene(place(utensil(146, 1), { x: 780, y: ry }), place(utensil(132, 3, P.copper, '#3b2f2a'), { x: 818, y: ry }));
  target('oven-glove', 'Oven glove', place(ovenGlove(112, P.tomato), { x: 864, y: ry - 6 }));
  scene(place(colander(36, P.copper), { x: 932, y: ry }));
}
// range cooker
{
  const x0 = 520, x1 = 960;
  scene(sh(rect(x0 - 8, 636, x1 - x0 + 16, 18, 3), '#3b3532'), sh(rect(x0 - 8, 636, x1 - x0 + 16, 4, 2), '#5a5250'));
  scene(sh(rect(x0, 654, x1 - x0, 336, 6), `url(#${ID}-range)`), sh(rect(x1 - 30, 654, 30, 336), '#000000', { opacity: 0.06 }));
  scene(sh(rect(x0 + 10, 660, x1 - x0 - 20, 40, 4), '#e9dcbc'));
  let kn = '';
  for (let i = 0; i < 6; i++) kn += circle(x0 + 60 + i * 64, 680, 10);
  scene(sh(kn, '#3b3532'), sh(circle(x0 + 60, 680, 4) + circle(x0 + 124, 680, 4) + circle(x0 + 188, 680, 4) + circle(x0 + 252, 680, 4) + circle(x0 + 316, 680, 4) + circle(x0 + 380, 680, 4), '#c9d0d5'));
  scene(sh(rect(x0 + 12, 716, 200, 196, 6) + rect(x1 - 212, 716, 200, 196, 6), '#efe2c4'), stroke(rect(x0 + 12, 716, 200, 196, 6) + rect(x1 - 212, 716, 200, 196, 6), '#c9b894', 2));
  scene(sh(rect(x0 + 44, 770, 136, 100, 6) + rect(x1 - 180, 770, 136, 100, 6), '#3b3532'), sh(rect(x0 + 52, 776, 40, 88, 4) + rect(x1 - 172, 776, 40, 88, 4), '#5a5250', { opacity: 0.6 }));
  scene(sh(rect(x0 + 30, 728, 164, 9, 4) + rect(x1 - 194, 728, 164, 9, 4), '#c9d0d5'), sh(rect(x0 + 30, 728, 164, 3, 2) + rect(x1 - 194, 728, 164, 3, 2), '#ffffff', { opacity: 0.6 }));
  scene(place(teaTowel(62, 110, '#fbf3df', P.cornflower), { x: x0 + 150, y: 734 }));
  scene(sh(rect(x0 + 12, 924, x1 - x0 - 24, 54, 4), '#e9dcbc'), sh(rect(x0 + 180, 944, 80, 10, 4), '#c9d0d5'), sh(rect(x0, 984, x1 - x0, 12), '#3b3532'));
  // on the hob
  scene(place(cookPot(124, 84, P.tomato, P.tomatoDk), { x: 604, y: 636 }), stroke(curve([[590, 520], [600, 500], [588, 480], [598, 462]]) + curve([[620, 522], [630, 502], [618, 484]]), '#ffffff', 3, { opacity: 0.5 }));
  scene(place(cookPot(76, 52, P.copper, shade(P.copper, -0.1)), { x: 720, y: 636 }), sh(rect(758, 594, 70, 9, 4), '#3b2f2a'));
  scene(place(kettle(86, '#f3d77a'), { x: 880, y: 636 }));
}

// =====================================================================
// right-hand counter
// =====================================================================
scene(sh(rect(960, 642, 240, 18), '#b98552'), sh(rect(960, 642, 240, 4), '#d4a26c'));
scene(planks(964, 660, 236, 340, 1, '#87a278', 51), ol(rect(980, 676, 96, 300, 4), '#94ad84', 1.4, -0.3), ol(rect(1090, 676, 104, 300, 4), '#94ad84', 1.4, -0.3), sh(circle(1062, 820, 6) + circle(1104, 820, 6), '#c9a24a'), sh(rect(960, 986, 240, 16), '#6f8a62'));
scene(stroke(rect(994, 692, 68, 268, 3) + rect(1104, 692, 76, 268, 3), '#6f8a62', 2));
{
  scene(place(utensil(110, 0, '#c98f55', '#c98f55'), { x: 990, y: 534 }), place(utensil(112, 2, P.steel, '#3b2f2a'), { x: 1006, y: 528 }), place(utensil(100, 3, P.steel, '#7a5232'), { x: 1022, y: 546 }));
  scene(ol(rect(978, 574, 58, 68, 8), '#c9673f', 1.2, -0.25), sh(rect(978, 594, 58, 8), '#f3d77a'), sh(ellipse(1007, 576, 29, 6), '#8a4a2a'));
  scene(place(bottle(30, 92, '#a8b84a', '#c99a6a'), { x: 1060, y: 642 }), place(bottle(22, 60, '#7d2f4a', '#3b2f2a'), { x: 1088, y: 642 }));
  scene(ol(rect(1150, 560, 16, 82, 6), '#5a3a2a', 1), ol(circle(1158, 556, 10), '#5a3a2a', 1));
  target('salt-shaker', 'Salt shaker', place(saltShaker(56), { x: 1120, y: 642 }));
  scene(place(bowl(52, 22, '#fbf6e8', P.tomato), { x: 1180, y: 642 }));
}

// =====================================================================
// floor and the big table
// =====================================================================
scene(floor(1002, 1500, W, 600, 640, 18, '#c8734a', '#e0a878', 61));
scene(sh(ellipse(600, 1110, 300, 50), P.cornflower, { opacity: 0.85 }), stroke(ellipse(600, 1110, 270, 42) + ellipse(600, 1110, 230, 34) + ellipse(600, 1110, 180, 26), '#fbf3df', 4, { opacity: 0.8 }), stroke(ellipse(600, 1110, 250, 38) + ellipse(600, 1110, 205, 30), P.tomato, 3, { opacity: 0.8 }));
// boots and a log basket by the dresser
scene(ol(M(70, 1040) + L(70, 1110) + Q(70, 1124, 86, 1124) + L(126, 1124) + Q(134, 1110, 116, 1104) + L(98, 1100) + L(98, 1040) + 'Z', '#4f6f52', 1.2), ol(M(108, 1046) + L(108, 1116) + Q(108, 1130, 124, 1130) + L(164, 1130) + Q(172, 1116, 154, 1110) + L(136, 1106) + L(136, 1046) + 'Z', '#5c7f5e', 1.2), sh(rect(68, 1036, 32, 10, 3) + rect(106, 1042, 32, 10, 3), '#3f5a42'));
{
  const g = rng(71);
  const logs: Shape[] = [];
  for (let i = 0; i < 6; i++) { const x = 400 + (i % 3) * 34, y = 1010 + Math.floor(i / 3) * 22 + g.range(-3, 3); logs.push(ol(rect(x - 30, y - 9, 62, 20, 9), '#8a6238', 1), ol(ellipse(x + 30, y + 1, 7, 10), '#d9b07a', 1, -0.3), stroke(ellipse(x + 30, y + 1, 3.5, 5), '#a8743e', 0.8)); }
  scene(logs, place(basket(170, 70, '#a8743e'), { x: 434, y: 1046 }));
}
// table top, apron and legs
{
  const back = 1146, front = 1292;
  scene(sh(rect(96, 1320, 34, 180, 4) + rect(1070, 1320, 34, 180, 4), '#7a5232'), sh(rect(120, 1320, 10, 180) + rect(1094, 1320, 10, 180), '#5a3a22'));
  scene(sh(rect(180, 1150, 22, 160) + rect(1000, 1150, 22, 160), '#5a3a22'));
  scene(place(sack(150, 120, '#d9c39a', P.tomato), { x: 820, y: 1488 }), place(pile(110, 15, ['potato'], 5, 1), { x: 720, y: 1490 }), shadow(600, 1494, 480, 14, 0.2));
  const top = poly([[150, back], [1050, back], [1132, front], [68, front]]);
  let seams = '';
  for (let i = 1; i < 6; i++) { const t = i / 6; seams += line([[150 + 900 * t, back], [68 + 1064 * t, front]]); }
  let grain = '';
  const g = rng(81);
  for (let i = 0; i < 18; i++) { const t = g.range(0.02, 0.98), y0 = back + 6, y1 = front - 6; grain += curve([[150 + 900 * t + g.range(-8, 8), y0], [110 + 980 * t, (y0 + y1) / 2], [68 + 1064 * t + g.range(-8, 8), y1]]); }
  scene(sh(top, '#c99a62'), stroke(grain, '#a8743e', 1, { opacity: 0.5 }), stroke(seams, '#8a5a34', 1.6), sh(rect(62, front, 1076, 30, 3), '#a8743e'), sh(rect(62, front, 1076, 5, 2), '#d4a26c'), sh(rect(62, front + 30, 1076, 6), '#3b2a1c', { opacity: 0.25 }));
  // linen runner
  scene(sh(poly([[300, back], [900, back], [930, front], [270, front]]), '#efe4c8'), stroke(line([[312, back + 6], [282, front - 6]]) + line([[888, back + 6], [918, front - 6]]), P.cornflower, 3), stroke(line([[322, back + 6], [292, front - 6]]) + line([[878, back + 6], [908, front - 6]]), P.cornflower, 1.4));
}
// on the table
{
  // flowers and a mixing bowl at the back
  scene(place(flowerVase(110, 9, '#fbf6e8', ['#f3d77a', '#fbf6e8', P.tomato, '#7f9fd8']), { x: 1030, y: 1196 }));
  // left basket of potatoes and onions with the egg
  scene(place(basketHandle(200, 96, '#c99a5b'), { x: 250, y: 1206 }), place(pile(186, 22, ['potato', 'onion', 'potato', 'whiteonion'], 13, 2), { x: 250, y: 1206 }));
  target('egg', 'Egg', place(egg(18, '#e9cfa6'), { x: 222, y: 1176, rot: -20 }));
  scene(place(basket(200, 70, '#c99a5b'), { x: 250, y: 1206 }));
  // bread board with a loaf
  scene(sh(ellipse(470, 1262, 92, 22), '#a8743e'), sh(ellipse(470, 1258, 90, 20), '#d4a26c'), place(bloomer(140, '#c98a42'), { x: 456, y: 1256 }), stroke(line([[500, 1266], [570, 1250]]), '#c9d0d5', 5), stroke(line([[480, 1270], [508, 1264]]), '#3b2f2a', 7));
  // fruit bowl with the cherries
  scene(place(pile(196, 22, ['apple', 'plum', 'orange', 'greenapple', 'plum'], 23, 2), { x: 650, y: 1204 }));
  target('cherries', 'Cherries', place(cherries(44), { x: 700, y: 1170, rot: 18 }));
  scene(place(bowl(214, 62, '#fbf6e8', P.cornflower), { x: 650, y: 1262 }));
  // right basket of peppers with the lemon
  scene(place(pile(170, 20, ['pepper', 'tomato', 'pepper'], 33, 2), { x: 900, y: 1202 }));
  target('lemon', 'Lemon', place(lemon(18), { x: 930, y: 1170, rot: -16 }));
  scene(place(basket(180, 64, '#b98b5a'), { x: 900, y: 1202 }));
  // front: leeks, beetroot, radishes, the carrot, a wooden spoon and a cabbage
  scene(place(leek(170), { x: 120, y: 1266, rot: -6 }), place(leek(160), { x: 136, y: 1280, rot: -2 }));
  const g = rng(91);
  scene(veg(330, 1270, 15, 'beet', g), veg(362, 1276, 14, 'beet', g), veg(560, 1276, 10, 'radish', g), veg(584, 1272, 10, 'radish', g), veg(604, 1280, 9, 'radish', g));
  target('carrot', 'Carrot', place(carrot(96), { x: 382, y: 1262, rot: 12 }));
  target('wooden-spoon', 'Wooden spoon', place(woodenSpoon(118), { x: 784, y: 1268, rot: -100 }));
  scene(place(cabbage(32, 4), { x: 1060, y: 1250 }), veg(1004, 1270, 14, 'tomato', g), veg(980, 1280, 13, 'tomato', g));
}
void circle;

const activity: FindActivity = {
  id: ID, version: 1, mode: 'find', title: 'Farmhouse Kitchen',
  blurb: 'A painted dresser, a cream range and a big scrubbed table hide fifteen everyday kitchen things.',
  collectionId: 'kitchen', categories: ['Kitchen', 'Interiors', 'Cozy'], difficulty: 'Moderate',
  width: W, height: H, defs, items,
};
export default activity;
