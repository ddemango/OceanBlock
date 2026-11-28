import { rect, ellipse, circle, poly, line, curve, blob, leaf, sh, stroke, place, shade, mix, rng, linearGradient, radialGradient } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { FindActivity, FindItem } from '../types';
import {
  M, Q, ol, shadow, cloud, rock, tuft, flower, pricklyPear, barrelCactus, yucca, juniper, cactusFlower, viewer, condor, lizard, sunHat, camera, trekkingPoles, flask,
  picnicBasket, roadrunner, sunglasses, apple, guidebook, backpack, hikingBoots, trailSign, type Pt,
} from './props-find';

const ID = 'parks-find-2';
const W = 1200, H = 1500;
const items: FindItem[] = [];
const scene = (...s: (Shape | Shape[])[]) => { items.push({ shapes: s.flat() }); };
const target = (id: string, name: string, shapes: Shape[]) => { items.push({ id, name, target: true, shapes }); };

const WALL = 884, WALLB = 984, WOOD = '#9a6a44';
const ROCKS = ['#ecd6ac', '#d49a70', '#c25c3e', '#bd7a5c', '#a84a38', '#8c4c46'];
const HAZE = '#c9b4cc';

const defs =
  linearGradient(`${ID}-sky`, [[0, '#4a96d0'], [0.6, '#a4d0e8'], [1, '#f6e6c8']]) +
  linearGradient(`${ID}-terrace`, [[0, '#e6c090'], [1, '#c8956a']]) +
  linearGradient(`${ID}-gorge`, [[0, '#b0624a'], [1, '#6e3a3c']]) +
  radialGradient(`${ID}-sun`, [[0, '#fff6d8'], [0.4, '#fff0c066'], [1, '#fff0c000']]);

/** A stepped butte of alternating cliffs and talus slopes. */
function butte(cx: number, top: number, base: number, topW: number, seed: number, haze = 0, spire = true): Shape[] {
  const g = rng(seed), out: Shape[] = [];
  const spec: [number, boolean][] = [[0.1, true], [0.13, false], [0.2, true], [0.2, false], [0.15, true], [0.22, false]];
  const Ht = base - top;
  let y = top, w = topW;
  if (spire) {
    const sw = topW * g.range(0.3, 0.5), sx = cx + g.range(-0.2, 0.2) * topW, shh = Ht * 0.07, c = mix(ROCKS[0], HAZE, haze);
    out.push(sh(poly([[sx - sw / 2, top - shh], [sx + sw / 2, top - shh], [sx + sw * 0.56, top + 1], [sx - sw * 0.56, top + 1]]), c), sh(poly([[sx + sw * 0.1, top - shh], [sx + sw / 2, top - shh], [sx + sw * 0.56, top + 1], [sx + sw * 0.16, top + 1]]), shade(c, -0.18), { opacity: 0.6 }));
  }
  spec.forEach(([f, cliff], i) => {
    const h = Ht * f, w1 = w + (cliff ? h * 0.14 : h * 1.7), y1 = y + h, c = mix(ROCKS[i], HAZE, haze);
    const nl = g.range(0.2, 0.8), nr = g.range(0.2, 0.8), jl = cliff ? g.range(2, 7) : 0, jr = cliff ? g.range(2, 7) : 0;
    out.push(sh(poly([[cx - w / 2, y], [cx + w / 2, y], [cx + w / 2 + (w1 - w) / 2 * nr + jr, y + h * nr], [cx + w1 / 2, y1], [cx - w1 / 2, y1], [cx - w / 2 - (w1 - w) / 2 * nl - jl, y + h * nl]]), c));
    out.push(sh(poly([[cx + w * 0.14, y], [cx + w / 2, y], [cx + w / 2 + (w1 - w) / 2 * nr + jr, y + h * nr], [cx + w1 / 2, y1], [cx + w1 * 0.22, y1]]), shade(c, -0.22), { opacity: 0.55 }));
    if (cliff) {
      let cr = '';
      for (let k = 0; k < Math.max(3, w / 22); k++) { const x = cx + g.range(-0.46, 0.46) * w; cr += line([[x, y + 2], [x + g.range(-3, 3), y1 - g.range(1, h * 0.4)]]); }
      out.push(stroke(cr, shade(c, -0.3), 1.2, { opacity: 0.55 }), sh(rect(cx - w / 2, y, w, Math.max(2, h * 0.1)), shade(c, 0.25), { opacity: 0.6 }));
    } else {
      out.push(stroke(line([[cx - (w * 0.6 + w1 * 0.4) / 2, y + h * 0.4], [cx + (w * 0.6 + w1 * 0.4) / 2, y + h * 0.4]]) + line([[cx - (w * 0.25 + w1 * 0.75) / 2, y + h * 0.75], [cx + (w * 0.25 + w1 * 0.75) / 2, y + h * 0.75]]), shade(c, 0.16), 1.6, { opacity: 0.6 }));
    }
    y = y1; w = w1 + (cliff ? h * 0.2 : 0);
  });
  return out;
}

// =====================================================================
// sky
// =====================================================================
scene(sh(rect(0, 0, W, 600), `url(#${ID}-sky)`), sh(circle(1010, 150, 190), `url(#${ID}-sun)`), sh(circle(1010, 150, 40), '#fff8e0'));
scene(place(cloud(300, '#ffffff', 0.85), { x: 190, y: 330 }), place(cloud(220, '#ffffff', 0.8), { x: 760, y: 290 }), place(cloud(180, '#ffffff', 0.7), { x: 520, y: 120 }), place(cloud(140, '#ffffff', 0.6), { x: 80, y: 130 }));
target('condor', 'Condor', place(condor(240), { x: 392, y: 214, rot: -10 }));
scene(place(condor(64), { x: 846, y: 168, rot: 14 }), place(condor(40), { x: 912, y: 214, rot: -6 }));

// =====================================================================
// the canyon: far rim, temples, mesas and the gorge
// =====================================================================
{
  const rim: Pt[] = [[0, 452], [90, 444], [180, 450], [300, 440], [330, 430], [420, 432], [450, 444], [600, 448], [720, 438], [760, 426], [880, 430], [910, 442], [1040, 446], [1200, 436]];
  const c = mix('#c98a78', HAZE, 0.62);
  scene(sh(poly([[0, 640], ...rim, [W, 640]]), c), sh(rect(0, 462, W, 9), shade(c, 0.2), { opacity: 0.7 }), sh(rect(0, 486, W, 14), shade(c, -0.1), { opacity: 0.7 }), sh(rect(0, 516, W, 8), shade(c, 0.14), { opacity: 0.6 }), sh(rect(0, 540, W, 20), shade(c, -0.14), { opacity: 0.6 }));
  let cr = '';
  const g = rng(2);
  for (let i = 0; i < 60; i++) { const x = g.range(0, W), y = g.range(470, 560); cr += line([[x, y], [x + g.range(-3, 3), y + g.range(12, 30)]]); }
  scene(stroke(cr, shade(c, -0.2), 1, { opacity: 0.5 }));
}
scene(butte(120, 440, 700, 70, 11, 0.5), butte(440, 418, 700, 46, 12, 0.48), butte(800, 432, 700, 90, 13, 0.5), butte(1090, 452, 700, 50, 14, 0.46));
scene(sh(rect(0, 560, W, 150), HAZE, { opacity: 0.22 }));
scene(butte(280, 476, 790, 120, 21, 0.24), butte(640, 500, 800, 64, 22, 0.26), butte(960, 470, 800, 130, 23, 0.22));
scene(sh(rect(0, 680, W, 260), `url(#${ID}-gorge)`));
{
  // interlocking spurs stepping down into the gorge
  const spurs: [number, number, number, string][] = [[-1, 690, 540, '#b3644c'], [1, 700, 700, '#a65842'], [-1, 744, 500, '#a2523f'], [1, 760, 740, '#96493c'], [-1, 800, 520, '#93473a'], [1, 818, 760, '#873f38'], [-1, 858, 470, '#823c36']];
  const g = rng(8);
  for (const [sd, y, tip, c] of spurs) {
    const edge = sd < 0 ? 0 : W;
    scene(sh(poly([[edge, y - 60], [tip - sd * 150, y - 36], [tip, y + 6], [tip - sd * 30, y + 40], [tip - sd * 170, y + 70], [edge, y + 120]]), c));
    scene(sh(poly([[tip - sd * 150, y - 36], [tip, y + 6], [tip - sd * 30, y + 40], [tip - sd * 120, y + 10]]), shade(c, sd < 0 ? -0.14 : 0.12), { opacity: 0.7 }));
    let st = '';
    for (let k = 0; k < 4; k++) { const yy = y - 20 + k * 22; st += line([[edge, yy + 10], [tip - sd * (170 - k * 30) + g.range(-10, 10), yy + 4]]); }
    scene(stroke(st, shade(c, 0.18), 1.4, { opacity: 0.5 }));
  }
  // the river far below
  const mid: [number, number, number][] = [[640, 712, 4], [604, 748, 9], [650, 790, 14], [596, 832, 20], [640, 872, 28], [610, 900, 34]];
  const ribbon = (k: number): Pt[] => [...mid.map(([x, y, w]) => [x - w * k, y] as Pt), ...mid.slice().reverse().map(([x, y, w]) => [x + w * k, y] as Pt)];
  scene(sh(blob(ribbon(1.9), 0.8), '#5e2f34', { opacity: 0.75 }), sh(blob(ribbon(1), 0.8), '#3fa8a4'), stroke(curve(mid.map(([x, y]) => [x - 2, y] as Pt)), '#a8ece0', 2.4, { opacity: 0.75 }));
  scene(sh(ellipse(612, 760, 8, 2.4) + ellipse(628, 810, 12, 3) + ellipse(612, 852, 16, 3.4), '#f1fbf6', { opacity: 0.85 }));
}
// near cliffs framing the view
scene(butte(10, 520, 960, 260, 31, 0, false), butte(1190, 560, 960, 200, 32, 0, false));
{
  const g = rng(33);
  for (let i = 0; i < 12; i++) { const left = i % 2 === 0, x = left ? g.range(10, 190) : g.range(1040, 1190), y = g.range(590, 860); scene(sh(blob([[x - 10, y], [x - 4, y - 9], [x + 8, y - 7], [x + 11, y]], 0.9), g.pick(['#5f7a52', '#6f8a5a', '#4f6a48']))); }
}

// =====================================================================
// viewpoint terrace and stone wall
// =====================================================================
scene(sh(rect(0, WALLB - 30, W, H - WALLB + 30), `url(#${ID}-terrace)`));
{
  const g = rng(40);
  // flagstone joints
  let j = '';
  for (let r = 0; r < 7; r++) {
    const y = WALLB + 30 + r * 70 + r * r * 3, yn = y + 70 + (2 * r + 1) * 3;
    j += line([[0, y + g.range(-4, 4)], [300, y + g.range(-5, 5)], [620, y + g.range(-5, 5)], [900, y + g.range(-5, 5)], [W, y + g.range(-4, 4)]]);
    for (let x = g.range(40, 160); x < W; x += g.range(150, 260) * (1 + r * 0.12)) j += line([[x, y], [x + g.range(-26, 26), yn]]);
  }
  scene(stroke(j, '#a8744e', 2, { opacity: 0.55 }));
  for (let i = 0; i < 14; i++) { const x = g.range(0, W), y = g.range(WALLB + 30, H); scene(sh(blob([[x - 60, y], [x - 20, y - 14], [x + 50, y - 8], [x + 70, y + 8], [x, y + 16]], 0.9), i % 2 ? '#f1d2a4' : '#b9845c', { opacity: 0.3 })); }
  for (let i = 0; i < 70; i++) { const x = g.range(0, W), y = g.range(WALLB + 10, H), s = 0.6 + (y - WALLB) / 500; scene(sh(ellipse(x, y, g.range(2.5, 6) * s, g.range(1.6, 3.4) * s), g.pick(['#a8744e', '#f4dcb4', '#8f6a50', '#c9a480']), { opacity: 0.9 })); }
  // wall
  scene(sh(rect(0, WALL + 8, W, WALLB - WALL - 8), '#8f7a66'), shadow(600, WALLB + 4, 640, 12, 0.22));
  const stones = ['#d2b48c', '#c49c78', '#b88a6a', '#dcc4a0', '#a88a74', '#c8a488', '#b49a86'];
  for (let r = 0; r < 4; r++) {
    for (let x = -20 + (r % 2) * 22; x < W; ) { const w = g.range(40, 76); const c = g.pick(stones); scene(ol(rect(x, WALL + 14 + r * 21, w - 3, 18, 6), c, 0.8, -0.25)); x += w; }
  }
  for (let x = -10; x < W; ) { const w = g.range(70, 120); scene(ol(rect(x, WALL, w - 3, 16, 5), g.pick(['#e6d0ac', '#dcc09a', '#ecd8b8']), 1, -0.3), sh(rect(x + 4, WALL + 2, w - 12, 4, 2), '#ffffff', { opacity: 0.3 })); x += w; }
}
target('roadrunner', 'Roadrunner', place(roadrunner(84), { x: 316, y: WALL + 1 }));
target('hat', 'Straw sun hat', place(sunHat(84), { x: 556, y: WALL - 2 }));
target('lizard', 'Green lizard', place(lizard(84), { x: 652, y: 938, rot: -24 }));
scene(place(lizard(50, '#b8946a'), { x: 96, y: 950, rot: 160 }));

// juniper, sign and cacti along the wall
scene(shadow(1120, 1014, 90, 12), place(juniper(430, 5), { x: 1120, y: 1012 }));
{
  const x = 196;
  scene(shadow(x + 6, 1112, 30, 6), ol(rect(x - 8, 960, 16, 152, 3), WOOD, 1.2), sh(rect(x - 8, 960, 5, 152), '#ffffff', { opacity: 0.14 }), place(trailSign(150, '#b8824a', 'hiker'), { x: x + 46, y: 1000, rot: -2 }), place(trailSign(120, '#a8703c', 'pine'), { x: x - 40, y: 1052, sx: -1, rot: 2 }));
}
scene(place(pricklyPear(120, 3), { x: 62, y: 1040 }), place(barrelCactus(64), { x: 420, y: 1022 }), place(barrelCactus(44, '#6f9a5c'), { x: 470, y: 1030 }));

// the viewing telescope
scene(shadow(770, 1136, 70, 12, 0.28));
target('telescope', 'Viewing telescope', place(viewer(300), { x: 760, y: 1134 }));
// little step for small visitors
scene(ol(rect(700, 1150, 120, 20, 4), '#b0aaa0', 1), sh(rect(704, 1152, 112, 5, 2), '#ffffff', { opacity: 0.3 }));

// hikers' gear against the wall
scene(shadow(970, 1040, 70, 9));
target('backpack', 'Orange backpack', place(backpack(128, '#e8823a', '#5f8a8a'), { x: 960, y: 1040 }));
target('poles', 'Trekking poles', place(trekkingPoles(190), { x: 1056, y: 1046, rot: 9 }));
scene(shadow(880, 1052, 26, 5));
target('flask', 'Blue water flask', place(flask(70), { x: 878, y: 1052 }));
scene(place(hikingBoots(50, '#8a5a35', '#fbf6ec'), { x: 1010, y: 1096 }));

// =====================================================================
// picnic table
// =====================================================================
{
  const x0 = 36, x1 = 520, ty = 1214, w = x1 - x0;
  scene(shadow((x0 + x1) / 2 + 10, 1452, 280, 20, 0.26));
  scene(ol(rect(x0 + 26, ty - 22, w - 52, 12, 3), shade(WOOD, -0.18), 1));
  scene(stroke(line([[x0 + 90, ty + 40], [x0 + 40, 1450]]) + line([[x0 + 90, ty + 40], [x0 + 150, 1450]]) + line([[x1 - 90, ty + 40], [x1 - 150, 1450]]) + line([[x1 - 90, ty + 40], [x1 - 40, 1450]]), shade(WOOD, -0.25), 13));
  for (let i = 0; i < 4; i++) scene(ol(rect(x0, ty + i * 12, w, 12, 2), i % 2 ? WOOD : shade(WOOD, 0.1), 0.8, -0.3));
  scene(ol(rect(x0 - 5, ty + 48, w + 10, 15, 3), shade(WOOD, -0.14), 1));
  let gr = '';
  for (let i = 0; i < 9; i++) gr += curve([[x0 + 20 + i * 52, ty + 6 + (i % 4) * 12], [x0 + 42 + i * 52, ty + 8 + (i % 4) * 12], [x0 + 62 + i * 52, ty + 5 + (i % 4) * 12]]);
  scene(stroke(gr, shade(WOOD, -0.3), 1));
  scene(stroke(line([[x0 + 60, 1340], [x0 + 60, 1392]]) + line([[x1 - 60, 1340], [x1 - 60, 1392]]), shade(WOOD, -0.25), 12), ol(rect(x0 + 12, 1340, w - 24, 16, 3), shade(WOOD, 0.06), 1), sh(rect(x0 + 12, 1354, w - 24, 6), shade(WOOD, -0.25)));
  // picnic things
  target('basket', 'Picnic basket', place(picnicBasket(124), { x: x0 + 96, y: ty + 30 }));
  scene(ol(ellipse(x0 + 218, ty + 26, 34, 10), '#fbf6ec', 0.8, -0.2), ol(poly([[x0 + 194, ty + 22], [x0 + 240, ty + 22], [x0 + 217, ty - 4]]), '#e8c890', 0.8), sh(poly([[x0 + 198, ty + 19], [x0 + 236, ty + 19], [x0 + 232, ty + 14], [x0 + 202, ty + 14]]), '#6fae5a'), sh(rect(x0 + 204, ty + 10, 26, 4), '#e8553a'));
  target('guidebook', 'Guidebook', place(guidebook(62, '#2f6690'), { x: x0 + 300, y: ty + 22, sy: 0.6, rot: -12 }));
  target('apple', 'Red apple', place(apple(30), { x: x0 + 368, y: ty + 16 }));
  target('sunglasses', 'Sunglasses', place(sunglasses(54), { x: x0 + 430, y: ty + 30 }));
  target('camera', 'Camera', place(camera(62), { x: x0 + 400, y: 1326 }));
  scene(ol(rect(x0 + 150, 1318, 60, 22, 4), '#f2c14e', 0.8), sh(rect(x0 + 150, 1326, 60, 6), '#c8322a'));
}

// =====================================================================
// foreground rocks and desert plants
// =====================================================================
scene(place(rock(250, '#c98a66', 5), { x: 1060, y: 1500 }), place(rock(130, '#d9a47c', 6), { x: 900, y: 1498 }), place(rock(90, '#b87a5a', 9), { x: 1170, y: 1380 }));
scene(place(pricklyPear(200, 7), { x: 1066, y: 1372 }));
target('flower', 'Pink cactus flower', place(cactusFlower(46), { x: 1072, y: 1196, sy: 0.8 }));
scene(place(cactusFlower(26, '#f08a4b'), { x: 984, y: 1218, sy: 0.8 }), place(lizard(64, '#c8a070'), { x: 906, y: 1436, rot: 14 }));
scene(place(yucca(150, 4), { x: 640, y: 1492 }), place(barrelCactus(96), { x: 770, y: 1470 }), place(yucca(110, 9), { x: 28, y: 1160 }));
{
  const g = rng(60);
  for (let i = 0; i < 46; i++) {
    const x = g.range(0, W), y = g.range(WALLB + 40, H), s = 0.7 + (y - WALLB) / 520;
    if (x > 30 && x < 530 && y > 1190 && y < 1460) continue;
    if (g.next() < 0.7) scene(tuft(x, y, s, g.pick(['#b8a45a', '#c8b46a', '#9a9a52', '#a89048'])));
    else scene(stroke(line([[x, y], [x, y - 10 * s]]), '#8a8a4a', 1.2), ...flower(x, y - 11 * s, 4.2 * s, g.pick(['#f6d24a', '#fbf6ec', '#f08a4b', '#b07ad0'])));
  }
  scene(sh(leaf(560, 1260, 16, 5, 20) + leaf(580, 1290, 14, 5, -30), '#b8946a'));
}

const activity: FindActivity = {
  id: 'parks-find-2', version: 1, mode: 'find', title: 'Canyon Lookout',
  blurb: 'Red rock layers tumble down to a turquoise river: find fourteen things the hikers and the desert wildlife have left around the lookout.',
  collectionId: 'parks', categories: ["Nature", "Travel"], difficulty: 'Relaxed',
  added: '2026-11-26',
  width: W, height: H, defs, items,
};
export default activity;
