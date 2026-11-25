import { blob, circle, curve, ellipse, leaf, line, linearGradient, mix, petal, place, poly, rect, rng, sector, sh, shade, stroke, type Rng } from '../../art/kit';
import type { Pt } from '../../art/geometry';
import type { Shape } from '../../art/types';
import type { PuzzleActivity } from '../types';
import { C, allium, bench, bird, blossomPath, bricks, bucket, bush, butterfly, cloud, flyingBird, leafClump, peony, polar, pot, rose, roseBud, soil, spike, tuftPath, vine, wateringCan } from './props';

const W = 1200, H = 1200;
const ID = 'garden-puzzle';
const S: Shape[] = [];
const add = (...s: Shape[]) => { S.push(...s); };

// ------------------------------------------------------------------ sky & beyond
add(sh(rect(0, 0, W, 420), `url(#${ID}-sky)`));
add(sh(circle(930, 90, 210), `url(#${ID}-sun)`));
add(...place(cloud(90), { x: 250, y: 80 }), ...place(cloud(60), { x: 610, y: 52 }), ...place(cloud(75), { x: 1040, y: 120 }), ...place(cloud(40), { x: 450, y: 150 }), ...place(cloud(34), { x: 790, y: 40 }));
add(...place(flyingBird('#5b6470'), { x: 520, y: 92, s: 0.7 }), ...place(flyingBird('#5b6470'), { x: 566, y: 114, s: 0.5, rot: -8 }), ...place(flyingBird('#5b6470'), { x: 716, y: 98, s: 0.6, rot: 10 }));

// distant hills
add(sh(blob([[-20, 260], [120, 205], [300, 230], [470, 190], [640, 228], [820, 196], [1010, 226], [1220, 200], [1220, 420], [-20, 420]], 0.9), '#a9cdb0'));
add(sh(blob([[-20, 290], [160, 250], [330, 268], [520, 238], [700, 270], [900, 240], [1220, 262], [1220, 420], [-20, 420]], 0.9), '#8fbd98'));
{
  // hedgerows and little fields on the hills
  const g = rng(41);
  let d = '';
  for (let i = 0; i < 26; i++) d += ellipse(g.range(0, W), g.range(232, 300), g.range(10, 26), g.range(4, 8));
  add(sh(d, '#7aa985', { opacity: 0.8 }));
}

// tree line behind the wall
{
  const g = rng(7);
  const greens = [C.leafDark, C.leaf, C.moss, C.teal, '#4b7a48', '#77a35a', C.deep];
  const xs = [-10, 70, 400, 470, 545, 640, 715, 770, 1110, 1180, 600, 30, 1150];
  xs.forEach((x, i) => {
    const w = g.range(130, 190), h = g.range(150, 230);
    add(...place(bush(100 + i, w, h, greens[i % greens.length], 16), { x, y: 372 + g.range(-6, 10) }));
  });
  // poplars / cypress
  for (const [x, h] of [[432, 250], [760, 230], [1128, 262], [52, 240]] as Pt[]) {
    add(sh(leaf(x, 370, h, 26, -90), C.deep), sh(leaf(x - 4, 366, h * 0.86, 13, -90), '#3d6a45'));
    let d = '';
    for (let k = 0; k < 9; k++) d += leaf(x + g.range(-10, 10), 360 - g.range(10, h * 0.8), 14, 4, -90 + g.range(-25, 25));
    add(sh(d, '#58875a'));
  }
}

// cottage (left)
{
  const wall = '#f3e6c8';
  add(sh(rect(118, 222, 248, 150), wall), sh(rect(292, 222, 74, 150), shade(wall, -0.08)));
  // chimney
  add(sh(rect(296, 92, 34, 62), C.brick), sh(rect(314, 92, 16, 62), C.brickDark), sh(rect(291, 86, 44, 10, 2), C.stone), sh(rect(301, 72, 9, 15, 2) + rect(316, 72, 9, 15, 2), C.terracotta));
  add(stroke(line([[296, 110], [330, 110]]) + line([[296, 126], [330, 126]]) + line([[296, 142], [330, 142]]), C.mortar, 1));
  add(sh(blob([[309, 66], [300, 46], [314, 30], [306, 12], [326, 20], [322, 40], [330, 54]], 1), '#ffffff', { opacity: 0.55 }));
  // roof with tile courses
  const roof: Pt[] = [[92, 232], [138, 136], [346, 136], [392, 232]];
  add(sh(poly(roof), C.terracotta));
  const g = rng(12);
  const tiles: Shape[] = [];
  for (let r = 0; r < 6; r++) {
    const y0 = 136 + r * 16, y1 = y0 + 16;
    const xl0 = 138 - (r * 16 * 46) / 96, xr0 = 346 + (r * 16 * 46) / 96;
    const xl1 = 138 - ((r + 1) * 16 * 46) / 96, xr1 = 346 + ((r + 1) * 16 * 46) / 96;
    const n = 9 + r;
    for (let i = 0; i < n; i++) {
      const a0 = (i + (r % 2 ? 0.5 : 0)) / n, a1 = Math.min(1, a0 + 1 / n - 0.012);
      if (a0 >= 1) continue;
      tiles.push(sh(poly([[xl0 + (xr0 - xl0) * a0, y0 + 1], [xl0 + (xr0 - xl0) * a1, y0 + 1], [xl1 + (xr1 - xl1) * a1, y1 - 1], [xl1 + (xr1 - xl1) * a0, y1 - 1]]), g.pick([C.terracotta, C.terraLight, C.terraDark, '#d6835c', '#b9664a'])));
    }
  }
  add(...bucket(tiles));
  add(sh(rect(134, 130, 216, 9, 3), C.terraDark));
  add(sh(poly([[86, 228], [398, 228], [398, 238], [86, 238]]), shade(wall, -0.3)));
  // windows
  for (const x of [150, 236]) {
    add(sh(rect(x - 4, 256, 50, 62, 2), '#ffffff'), sh(rect(x, 260, 42, 54), '#7fa8bd'), sh(rect(x, 260, 42, 20), '#a9cbd9'));
    add(stroke(line([[x + 21, 260], [x + 21, 314]]) + line([[x, 287], [x + 42, 287]]), '#ffffff', 3));
    add(sh(rect(x - 18, 256, 13, 62, 1) + rect(x + 47, 256, 13, 62, 1), C.sage));
    add(stroke(line([[x - 18, 272], [x - 5, 272]]) + line([[x - 18, 288], [x - 5, 288]]) + line([[x - 18, 304], [x - 5, 304]]) + line([[x + 47, 272], [x + 60, 272]]) + line([[x + 47, 288], [x + 60, 288]]) + line([[x + 47, 304], [x + 60, 304]]), shade(C.sage, -0.25), 1.2));
    add(sh(rect(x - 6, 318, 54, 9, 2), C.terraDark));
    let d = '';
    for (let k = 0; k < 6; k++) d += circle(x + 2 + k * 8, 314 + (k % 2) * 3, 4.5);
    add(sh(d, k2col(x)));
  }
  // wisteria on the cottage wall
  add(...vine([[120, 372], [128, 300], [122, 240], [200, 236], [300, 240]], 31, { leaf: C.moss, leafLen: 11, step: 12, bloom: [C.lavender, C.lilac], bloomR: 6, bloomEvery: 2, stemW: 2 }));
}
function k2col(x: number) { return x < 200 ? C.rose : C.peony; }

// greenhouse (right)
{
  add(sh(poly([[806, 258], [948, 170], [1090, 258], [1090, 380], [806, 380]]), `url(#${ID}-glass)`));
  // plants seen through the glass
  const g = rng(55);
  let d = '';
  for (let i = 0; i < 16; i++) d += ellipse(g.range(820, 1078), g.range(300, 372), g.range(12, 26), g.range(14, 30));
  add(sh(d, '#6fa477', { opacity: 0.55 }));
  let d2 = '';
  for (let i = 0; i < 10; i++) d2 += leaf(g.range(830, 1070), 372, g.range(40, 90), 9, -90 + g.range(-20, 20));
  add(sh(d2, '#4f8a5c', { opacity: 0.6 }));
  let d3 = '';
  for (let i = 0; i < 9; i++) d3 += circle(g.range(826, 1074), g.range(296, 350), g.range(3, 5));
  add(sh(d3, '#f08c7a', { opacity: 0.8 }));
  // glazing bars
  let bars = line([[806, 258], [1090, 258]]) + line([[806, 318], [1090, 318]]);
  for (let x = 806; x <= 1090; x += 35.5) bars += line([[x, 258], [x, 380]]);
  for (let i = 1; i < 8; i++) {
    const x = 806 + i * 35.5;
    const yTop = x < 948 ? 258 - ((x - 806) * 88) / 142 : 170 + ((x - 948) * 88) / 142;
    bars += line([[x, 258], [x, yTop]]);
  }
  add(stroke(bars, '#fbfdfb', 3));
  add(stroke(line([[802, 260], [948, 168], [1094, 260]]), '#ffffff', 6));
  add(stroke(line([[948, 168], [948, 146]]), '#ffffff', 3), sh(circle(948, 142, 5), '#ffffff'));
  add(sh(poly([[820, 262], [880, 262], [840, 316], [812, 316]]) + poly([[980, 200], [1010, 218], [972, 256], [952, 256]]), '#ffffff', { opacity: 0.25 }));
}

// ------------------------------------------------------------------ the wall
const WALL_TOP = 352, WALL_BASE = 648;
add(sh(rect(0, WALL_TOP, W, WALL_BASE - WALL_TOP), C.mortar));
add(...bricks(0, WALL_TOP + 2, 462, WALL_BASE - WALL_TOP, 3));
add(...bricks(738, WALL_TOP + 2, 462, WALL_BASE - WALL_TOP, 4));
// section over the arch + piers
add(sh(rect(462, 300, 276, 348), C.mortar));
add(...bricks(512, 318, 176, 130, 5, 40, 16));
add(...bricks(462, 300, 50, 348, 6, 28, 16, 3, mix(C.brick, '#a8563f', 0.5)));
add(...bricks(688, 300, 50, 348, 8, 28, 16, 3, mix(C.brick, '#a8563f', 0.5)));
// weathering: darker foot, moss and lichen
add(sh(rect(0, 560, W, 90), `url(#${ID}-wallshade)`));
{
  const g = rng(19);
  let moss = '', lichen = '';
  for (let i = 0; i < 40; i++) moss += ellipse(g.range(0, W), g.range(585, 646), g.range(8, 26), g.range(3, 8));
  for (let i = 0; i < 30; i++) lichen += circle(g.range(0, W), g.range(360, 600), g.range(2, 6));
  add(sh(moss, '#6f8f55', { opacity: 0.5 }), sh(lichen, '#e8e2c4', { opacity: 0.45 }));
}
// coping stones
{
  const g = rng(23);
  const cop: Shape[] = [];
  const run = (x0: number, x1: number, y: number) => {
    let x = x0;
    while (x < x1) {
      const w = Math.min(g.range(48, 72), x1 - x);
      cop.push(sh(rect(x, y, w - 2, 15, 3), g.pick([C.stone, C.stoneLight, C.stoneDark, '#bdb39c'])));
      x += w;
    }
  };
  run(-6, 462, WALL_TOP - 11);
  run(738, W + 6, WALL_TOP - 11);
  run(506, 694, 306);
  add(...bucket(cop));
  add(sh(rect(0, WALL_TOP + 4, 462, 4) + rect(738, WALL_TOP + 4, 462, 4) + rect(512, 321, 176, 4), '#5d3c30', { opacity: 0.35 }));
}
// pier caps and finials
for (const x of [487, 713]) {
  add(sh(rect(x - 33, 286, 66, 16, 3), C.stoneLight), sh(rect(x - 33, 296, 66, 6, 2), C.stoneDark), sh(rect(x - 24, 274, 48, 13, 3), C.stone));
  add(sh(rect(x - 7, 262, 14, 13), C.stoneDark), sh(circle(x, 248, 17), C.stone), sh(circle(x - 5, 243, 8), C.stoneLight), sh(ellipse(x + 6, 254, 8, 6), C.stoneDark, { opacity: 0.5 }));
}

// brick arch ring and the gate
const AX = 600, AY = 446, AR = 88;
{
  for (let i = 0; i < 15; i++) {
    const a0 = 180 + i * 12 + 0.8, a1 = 180 + (i + 1) * 12 - 0.8;
    add(sh(sector(AX, AY, AR + 26, a0, a1, AR), i === 7 ? C.stoneLight : i % 2 ? C.brickDark : C.brickLight));
  }
  // keystone
  add(sh(poly([polar(AX, AY, AR - 2, 263), polar(AX, AY, AR + 34, 261), polar(AX, AY, AR + 34, 279), polar(AX, AY, AR - 2, 277)]), C.stone));
  // dark reveal
  const arch = (r: number, x0: number, x1: number, bottom: number) => {
    const pts: Pt[] = [[x0, bottom]];
    for (let a = 180; a <= 360; a += 6) pts.push(polar(AX, AY, r, a));
    pts.push([x1, bottom]);
    return poly(pts);
  };
  add(sh(arch(AR, AX - AR, AX + AR, WALL_BASE), '#3a2c24'));
  // planks
  const door = '#5f9488';
  const g = rng(77);
  const x0 = AX - AR + 7, n = 8, pw = (AR * 2 - 14) / n, r = AR - 7;
  for (let i = 0; i < n; i++) {
    const xa = x0 + i * pw, xb = xa + pw - 2;
    const pts: Pt[] = [[xa, WALL_BASE - 4]];
    for (let k = 0; k <= 4; k++) {
      const x = xa + ((xb - xa) * k) / 4;
      pts.push([x, AY - Math.sqrt(Math.max(0, r * r - (x - AX) * (x - AX)))]);
    }
    pts.push([xb, WALL_BASE - 4]);
    add(sh(poly(pts), shade(door, g.range(-0.16, 0.14))));
    add(stroke(line([[xa + pw * 0.5, AY - 20 + g.range(-30, 60)], [xa + pw * 0.5, AY + 60 + g.range(0, 90)]]), shade(door, -0.3), 1, { opacity: 0.6 }));
  }
  // light across the top of the door
  add(sh(poly([[x0, AY + 10], [x0 + 60, AY - 62], [x0 + 110, AY - 76], [x0 + 20, AY + 60]]), '#ffffff', { opacity: 0.14 }));
  // little grille window
  add(sh(rect(AX - 17, AY - 24, 34, 40, 4), '#2c2420'), sh(rect(AX - 13, AY - 20, 26, 32, 2), '#9ccbb0'));
  add(sh(circle(AX - 3, AY - 2, 8), '#c9e6b8', { opacity: 0.8 }));
  add(stroke(line([[AX - 4.5, AY - 20], [AX - 4.5, AY + 12]]) + line([[AX + 4.5, AY - 20], [AX + 4.5, AY + 12]]) + line([[AX - 13, AY - 4], [AX + 13, AY - 4]]), '#2c2420', 2.4));
  // strap hinges
  for (const y of [AY + 44, AY + 150]) {
    add(sh(poly([[x0, y - 6], [x0 + 104, y - 3], [x0 + 118, y], [x0 + 104, y + 3], [x0, y + 6]]), C.iron));
    add(sh(circle(x0 + 12, y, 2) + circle(x0 + 44, y, 2) + circle(x0 + 76, y, 2), '#8b9096'));
  }
  // ring handle and key plate
  add(sh(rect(AX + 46, AY + 84, 16, 34, 4), C.iron), stroke(circle(AX + 54, AY + 102, 11), '#1f2224', 3.6), sh(circle(AX + 54, AY + 90, 3.2), '#8b9096'));
  add(sh(circle(AX + 54, AY + 128, 2.6) + rect(AX + 53, AY + 128, 2, 7), '#1f2224'));
  // door edge & threshold step
  add(stroke(arch(r, x0, x0 + n * pw - 2, WALL_BASE - 4), '#2f4f49', 2));
  add(sh(rect(AX - AR - 14, WALL_BASE - 6, AR * 2 + 28, 14, 3), C.stoneLight), sh(rect(AX - AR - 14, WALL_BASE + 3, AR * 2 + 28, 6, 2), C.stoneDark));
}

// birdhouse on the left wall, lantern on the right
{
  add(sh(rect(246, 434, 44, 50, 2), '#d9c391'), sh(rect(270, 434, 20, 50), '#c2aa77'), sh(poly([[238, 438], [268, 408], [298, 438]]), C.slate), sh(poly([[268, 408], [298, 438], [286, 438], [268, 420]]), shade(C.slate, -0.2)));
  add(sh(circle(268, 456, 8), '#3a2c24'), sh(rect(264, 470, 8, 3), C.woodDark), stroke(line([[268, 472], [268, 480]]), C.woodDark, 2.4), sh(rect(240, 484, 56, 6, 2), C.wood));
  add(sh(rect(905, 418, 6, 30), C.iron), sh(poly([[896, 448], [920, 448], [926, 486], [890, 486]]), C.iron), sh(poly([[900, 453], [916, 453], [920, 482], [896, 482]]), '#f6d98a'), sh(poly([[888, 448], [928, 448], [908, 432]]), '#2a2d30'), stroke(line([[908, 453], [908, 482]]), C.iron, 1.6));
}

// dappled sunlight on the wall
{
  const g = rng(91);
  let d = '';
  for (let i = 0; i < 46; i++) d += ellipse(g.range(0, W), g.range(360, 620), g.range(12, 34), g.range(8, 20), g.range(-30, 30));
  add(sh(d, '#fff3c9', { opacity: 0.16 }));
  let s2 = '';
  for (let i = 0; i < 20; i++) s2 += ellipse(g.range(0, W), g.range(370, 630), g.range(20, 50), g.range(12, 26), g.range(-30, 30));
  add(sh(s2, '#4a2f2a', { opacity: 0.08 }));
}

// climbing roses
const pinks = [C.peony, C.peonyLight, C.rose, C.peonyDark, C.blush];
add(...vine([[452, 646], [446, 540], [458, 430], [470, 330], [520, 296], [600, 280], [680, 294], [740, 326], [752, 420], [744, 500]], 201, { leafLen: 17, step: 13, bloom: pinks, bloomR: 10, bloomEvery: 2, stemW: 3.5 }));
add(...vine([[468, 330], [380, 338], [300, 322], [200, 340], [110, 330], [10, 346]], 202, { leafLen: 16, step: 13, bloom: pinks, bloomR: 9.5, bloomEvery: 2 }));
add(...vine([[380, 338], [372, 400], [392, 470]], 203, { leafLen: 14, bloom: pinks, bloomR: 8 }));
add(...vine([[200, 340], [186, 410], [204, 500], [190, 560]], 204, { leafLen: 14, bloom: pinks, bloomR: 8 }));
add(...vine([[60, 646], [50, 520], [70, 420], [58, 340]], 209, { leafLen: 15, bloom: [C.cream, C.blush, C.peonyLight], bloomR: 8.5 }));
add(...vine([[770, 646], [786, 520], [830, 420], [900, 350], [1000, 330], [1100, 344], [1200, 330]], 205, { leafLen: 16, step: 13, bloom: [C.cream, C.blush, C.peonyLight, '#f7d58c'], bloomR: 9.5, bloomEvery: 2, stemW: 3 }));
add(...vine([[1000, 330], [1010, 400], [990, 470], [1004, 530]], 206, { leafLen: 14, bloom: [C.cream, C.blush, '#f7d58c'], bloomR: 8 }));
add(...vine([[1150, 646], [1160, 540], [1140, 450], [1156, 350]], 207, { leafLen: 15, bloom: [C.rose, C.peony], bloomR: 8.5 }));
add(...vine([[600, 280], [596, 318], [610, 350]], 208, { leafLen: 13, bloom: pinks, bloomR: 9, bloomEvery: 1, stemW: 2 }));
// a few full roses over the arch
[[536, 290, 15, C.peony], [584, 268, 17, C.rose], [640, 276, 15, C.peonyLight], [700, 300, 16, C.peony], [470, 318, 14, C.peonyDark], [748, 380, 14, C.rose], [452, 470, 13, C.peony]].forEach(([x, y, r, c], i) => add(...place(rose(r as number, c as string, 300 + i), { x: x as number, y: y as number })));

// blue tit on the wall top, robin on a finial
add(...place(bird({ back: '#6f9fd0', breast: '#f1d25c', wing: '#4f7fb5', cap: '#4a7ab8', beak: '#4a4a4a' }), { x: 300, y: 342, s: 0.62 }));
add(...place(bird({ back: '#8a6a4c', breast: '#e2673a', wing: '#6d5038', beak: '#4a3a2a' }), { x: 713, y: 232, sx: -0.6, sy: 0.6 }));

// ------------------------------------------------------------------ ground
add(sh(rect(0, WALL_BASE, W, H - WALL_BASE), `url(#${ID}-lawn)`));
const uOf = (y: number) => (y - WALL_BASE) / (H - WALL_BASE);
const yOf = (u: number) => WALL_BASE + u * (H - WALL_BASE);
const pathCx = (u: number) => 600 + 265 * Math.sin(u * Math.PI * 1.7) * (0.2 + 0.8 * u);
const pathHw = (u: number) => 54 + 150 * Math.pow(Math.max(0, u), 1.3);
const scaleAt = (u: number) => 0.42 + 1.0 * u;

// mown stripes and tufts
{
  const g = rng(5);
  let lt = '', dk = '';
  for (let i = 0; i < 300; i++) {
    const u = Math.pow(g.next(), 0.8) * 1.02, x = g.range(0, W);
    if (Math.abs(x - pathCx(u)) < pathHw(u) + 4) continue;
    const t = tuftPath(x, yOf(u), scaleAt(u) * 0.9, g);
    if (i % 2) lt += t; else dk += t;
  }
  add(sh(dk, '#5f9a4c'), sh(lt, '#9dcc72'));
  // daisies and buttercups in the grass
  let dz = '', dc = '', bc = '';
  for (let i = 0; i < 110; i++) {
    const u = Math.pow(g.next(), 0.8) * 1.02, x = g.range(0, W);
    if (Math.abs(x - pathCx(u)) < pathHw(u) + 8) continue;
    const s = scaleAt(u);
    if (i % 3 === 0) bc += blossomPath(x, yOf(u), 4.2 * s, 5, 0.6, g.range(0, 72));
    else { dz += blossomPath(x, yOf(u), 5 * s, 6, 0.45, g.range(0, 60)); dc += circle(x, yOf(u), 1.7 * s); }
  }
  add(sh(dz, '#ffffff'), sh(dc, C.yellow), sh(bc, '#f6d24a'));
}

// the winding path
{
  const edgeL: Pt[] = [], edgeR: Pt[] = [];
  for (let i = 0; i <= 40; i++) {
    const u = (i / 40) * 1.06;
    edgeL.push([pathCx(u) - pathHw(u) - 5, yOf(u)]);
    edgeR.push([pathCx(u) + pathHw(u) + 5, yOf(u)]);
  }
  add(sh(poly([...edgeL, ...edgeR.reverse()]), '#8c8468'));
  const g = rng(63);
  const stones: Shape[] = [], lights: Shape[] = [];
  const cols = [C.stone, C.stoneLight, '#d8c9a8', '#bfb39b', '#c7b9a6', '#d3c4b0', '#b3ab93', '#cbb99a', '#a9b09a'];
  let u = -0.004, row = 0;
  while (u < 1.05) {
    const du = 0.02 + 0.068 * Math.max(0, u);
    const u1 = u + du;
    const n = (u < 0.25 ? 2 : u < 0.6 ? 3 : 4) + (row % 2);
    const cuts: number[] = [0];
    for (let i = 1; i < n; i++) cuts.push(i / n + g.range(-0.06, 0.06));
    cuts.push(1);
    for (let i = 0; i < n; i++) {
      const a = cuts[i], b = cuts[i + 1];
      const q = (uu: number, t: number): Pt => [pathCx(uu) - pathHw(uu) + 2 * pathHw(uu) * t, yOf(uu)];
      const gapX = 0.012 + 0.006 / (0.3 + u), gapU = du * 0.1;
      const p: Pt[] = [q(u + gapU, a + gapX), q(u + gapU, b - gapX), q(u1 - gapU, b - gapX), q(u1 - gapU, a + gapX)];
      const j = scaleAt(u) * 2.2;
      const pj = p.map(([x, y]) => [x + g.range(-j, j), y + g.range(-j * 0.4, j * 0.4)] as Pt);
      const c = g.pick(cols);
      stones.push(sh(blob(pj, 0.35), c));
      if (g.next() < 0.5) {
        const cx = (pj[0][0] + pj[2][0]) / 2, cy = (pj[0][1] + pj[2][1]) / 2;
        lights.push(sh(ellipse(cx + g.range(-6, 6), cy - (pj[2][1] - pj[0][1]) * 0.15, (pj[1][0] - pj[0][0]) * 0.28, (pj[2][1] - pj[0][1]) * 0.2), shade(c, 0.28), { opacity: 0.8 }));
      }
    }
    u = u1; row++;
  }
  add(...bucket(stones), ...bucket(lights));
  // moss in the joints, cracks, fallen petals
  let moss = '', pet = '', crack = '';
  for (let i = 0; i < 70; i++) {
    const uu = Math.pow(g.next(), 0.7), t = g.range(-0.95, 0.95);
    const x = pathCx(uu) + pathHw(uu) * t, y = yOf(uu), s = scaleAt(uu);
    if (i % 3 === 0) moss += ellipse(x, y, 9 * s, 3 * s, g.range(-20, 20));
    else if (i % 3 === 1) pet += petal(x, y, 9 * s, 3.4 * s, g.range(0, 360));
    else crack += line([[x, y], [x + g.range(-14, 14) * s, y + g.range(3, 9) * s], [x + g.range(-20, 20) * s, y + g.range(8, 16) * s]]);
  }
  add(sh(moss, '#7c9a55', { opacity: 0.8 }), stroke(crack, '#8a7f66', 1.2, { opacity: 0.7 }), sh(pet, C.peonyLight));
  // dappled light and shade across the path
  let li = '', sd = '';
  for (let i = 0; i < 26; i++) {
    const uu = g.range(0.05, 1), t = g.range(-0.9, 0.9);
    const e = ellipse(pathCx(uu) + pathHw(uu) * t, yOf(uu), g.range(18, 44) * scaleAt(uu), g.range(6, 13) * scaleAt(uu), g.range(-12, 12));
    if (i % 2) li += e; else sd += e;
  }
  add(sh(li, '#fff6d2', { opacity: 0.22 }), sh(sd, '#4d5a3c', { opacity: 0.12 }));
}

// ------------------------------------------------------------------ border planting
type Kind = 'shrub' | 'lavender' | 'foxglove' | 'delphinium' | 'peony' | 'daisy' | 'allium' | 'tulip' | 'hosta' | 'rosebush' | 'grass' | 'mound' | 'fern';

function plant(kind: Kind, g: Rng, near: boolean): Shape[] {
  const out: Shape[] = [];
  const seed = g.int(1, 99999);
  switch (kind) {
    case 'lavender': {
      let stems = '', fa = '', fb = '';
      for (let i = 0; i < 9; i++) {
        const a = -90 + g.range(-38, 38), h = g.range(46, 70);
        const [x, y] = polar(0, 0, h, a);
        stems += line([[g.range(-6, 6), 0], [x, y]]);
        for (let k = 0; k < 4; k++) {
          const [fx, fy] = polar(0, 0, h - k * 6, a);
          const e = ellipse(fx, fy, 3.6 - k * 0.3, 3.2, a);
          if (k % 2) fa += e; else fb += e;
        }
      }
      out.push(...leafClump(seed, 9, 30, 4, '#8fae8b', 150).map((s) => s), stroke(stems, '#7f9d7c', 1.4), sh(fb, C.lavDark), sh(fa, C.lavender));
      return bucketKeep(out);
    }
    case 'foxglove':
    case 'delphinium': {
      const cols = kind === 'foxglove' ? [C.peony, C.peonyDark, C.blush, '#d78fc2'] : ['#6f8fd6', '#4f6fc0', C.lavender, '#8fb0e6'];
      out.push(...bucketKeep(leafClump(seed, 8, 46, 12, C.leaf, 170)));
      const n = g.int(2, 4);
      for (let i = 0; i < n; i++) out.push(...place(spike(g.range(100, 150), g.pick(cols), seed + i, kind === 'foxglove' ? 1.25 : 1.05), { x: (i - (n - 1) / 2) * 22 + g.range(-5, 5), y: 0 }));
      return out;
    }
    case 'peony':
    case 'rosebush': {
      const cols = kind === 'peony' ? [C.peony, C.peonyLight, C.peonyDark, C.blush] : [C.rose, '#f2a23a', C.cream, '#e8617f', '#f6d77a'];
      out.push(...bush(seed, 120, 92, kind === 'peony' ? C.leaf : C.leafDark, 12));
      const n = g.int(3, 5);
      for (let i = 0; i < n; i++) {
        const x = g.range(-46, 46), y = -g.range(34, 92), r = g.range(15, 22);
        const c = g.pick(cols);
        out.push(...place(near ? (kind === 'peony' ? peony(r, c, seed + i) : rose(r * 0.9, c, seed + i)) : roseBud(r * 0.85, c), { x, y, rot: g.range(0, 60) }));
      }
      return out;
    }
    case 'shrub': {
      const col = g.pick([C.leafDark, C.teal, '#5f8f4e', '#7a9f58']);
      out.push(...bush(seed, 130, 110, col, 18));
      let fl = '';
      for (let i = 0; i < 12; i++) fl += blossomPath(g.range(-50, 50), -g.range(20, 96), 5, 5, 0.5, g.range(0, 72));
      out.push(sh(fl, g.pick([C.white, C.blush, '#f6e9a8'])));
      return out;
    }
    case 'daisy': {
      const yellow = g.next() < 0.35;
      let stems = '', pets = '', cen = '', lv = '';
      for (let i = 0; i < 12; i++) lv += leaf(g.range(-30, 30), 0, g.range(24, 44), 5, -90 + g.range(-40, 40));
      for (let i = 0; i < 9; i++) {
        const x = g.range(-44, 44), y = -g.range(34, 78), r = g.range(9, 13);
        stems += line([[x * 0.3, 0], [x, y]]);
        for (let k = 0; k < 8; k++) pets += petal(x, y, r, r * 0.26, k * 45 + i * 7);
        cen += circle(x, y, r * 0.32);
      }
      out.push(sh(lv, C.moss), stroke(stems, C.leaf, 1.4), sh(pets, yellow ? '#f6d66a' : C.white), sh(cen, yellow ? '#8a5a2c' : C.yellow));
      return out;
    }
    case 'allium': {
      out.push(...bucketKeep(leafClump(seed, 7, 44, 6, C.moss, 130)));
      const n = g.int(3, 5);
      for (let i = 0; i < n; i++) out.push(...place(allium(g.range(84, 128), g.pick([C.lavender, C.lavDark, '#b48fd0', C.violet]), seed + i), { x: (i - (n - 1) / 2) * 24 + g.range(-6, 6), y: 0, rot: g.range(-7, 7) }));
      return out;
    }
    case 'tulip': {
      const cols = [g.pick([C.rose, '#f2a23a', '#f6d66a', C.peony, '#b4508e', C.cream])];
      cols.push(shade(cols[0], -0.16));
      let stems = '', lv = '', lv2 = '', cupD = '', cupL = '';
      for (let i = 0; i < 8; i++) {
        const x = g.range(-46, 46), h = g.range(54, 86), lean = g.range(-8, 8), r = 8.5;
        stems += curve([[x, 0], [x + lean * 0.3, -h * 0.5], [x + lean, -h]]);
        lv += leaf(x, 0, h * 0.7, 6, -100 - g.range(0, 12));
        lv2 += leaf(x, 0, h * 0.6, 6, -76 + g.range(0, 10));
        cupD += petal(x + lean, -h + r * 0.6, r * 2.3, r * 0.8, -106) + petal(x + lean, -h + r * 0.6, r * 2.3, r * 0.8, -74);
        cupL += petal(x + lean, -h + r * 0.7, r * 2.3, r * 0.62, -90);
      }
      out.push(sh(lv, '#7fae74'), sh(lv2, C.leaf), stroke(stems, C.leaf, 2), sh(cupD, cols[1]), sh(cupL, shade(cols[0], 0.15)));
      return out;
    }
    case 'hosta': {
      const col = g.pick(['#6fa17a', '#86b56a', '#5d9a86']);
      const g2 = rng(seed);
      let ribs = '';
      for (let i = 0; i < 11; i++) {
        const a = -90 - 85 + (170 * (i + 0.5)) / 11 + g2.range(-6, 6), l = g2.range(44, 66);
        out.push(sh(leaf(0, 0, l, 15, a), i % 3 === 0 ? shade(col, -0.16) : i % 3 === 1 ? col : shade(col, 0.16)));
        ribs += line([polar(0, 0, 6, a), polar(0, 0, l * 0.86, a)]);
      }
      const r = bucketKeep(out);
      r.push(stroke(ribs, shade(col, 0.45), 1.1, { opacity: 0.8 }));
      return r;
    }
    case 'grass': {
      let a = '', b = '', c = '';
      for (let i = 0; i < 22; i++) {
        const l = leaf(g.range(-8, 8), 0, g.range(50, 96), 3.4, -90 + g.range(-46, 46));
        if (i % 3 === 0) a += l; else if (i % 3 === 1) b += l; else c += l;
      }
      let plume = '';
      for (let i = 0; i < 5; i++) plume += leaf(g.range(-8, 8), -60, g.range(30, 46), 4.5, -90 + g.range(-30, 30));
      return [sh(a, '#6f9a5c'), sh(b, '#a9c77a'), sh(c, '#88b068'), sh(plume, '#ecdcb0')];
    }
    case 'fern': {
      let a = '', b = '', ribs = '';
      for (let i = 0; i < 7; i++) {
        const ang = -90 - 70 + (140 * (i + 0.5)) / 7, l = g.range(54, 76);
        ribs += line([[0, 0], polar(0, 0, l, ang)]);
        for (let k = 1; k < 7; k++) {
          const [x, y] = polar(0, 0, (l * k) / 7, ang);
          const pl = 16 * (1.1 - k / 8);
          const d = leaf(x, y, pl, 3.6, ang + 62) + leaf(x, y, pl, 3.6, ang - 62);
          if (i % 2) a += d; else b += d;
        }
      }
      return [sh(b, '#4f8a57'), sh(a, '#7ab368'), stroke(ribs, '#3f6f45', 1.3)];
    }
    default: {
      // flowering mound (aubrieta / alyssum)
      const col = g.pick([C.lilac, C.white, C.peonyLight, '#f6d66a', C.lavender, '#8fb0e6']);
      out.push(sh(blob([[-44, 0], [-34, -22], [-8, -32], [22, -28], [42, -14], [46, 0]], 1), C.moss), sh(blob([[-30, -6], [-18, -24], [10, -28], [30, -14], [20, -4]], 1), '#86ad62'));
      let fl = '', ce = '';
      for (let i = 0; i < 13; i++) {
        const x = g.range(-38, 40), y = -g.range(3, 28) * (1 - Math.abs(x) / 70);
        fl += blossomPath(x, y, g.range(5, 7), 4, 0.5, g.range(0, 90));
        ce += circle(x, y, 1.6);
      }
      out.push(sh(fl, col), sh(ce, col === '#f6d66a' ? '#b9772c' : C.yellow));
      return out;
    }
  }
}
/** Merge same-styled shapes but keep first-seen order. */
function bucketKeep(s: Shape[]): Shape[] { return bucket(s); }

interface Placed { y: number; shapes: Shape[] }
const placed: Placed[] = [];
{
  const g = rng(2024);
  let y = WALL_BASE + 6;
  let row = 0;
  while (y < H + 70) {
    const u = uOf(y), s = scaleAt(u);
    const spacing = 96 * s;
    let x = -20 + (row % 2 ? spacing * 0.5 : 0) + g.range(-10, 10);
    while (x < W + 30) {
      const px = x + g.range(-0.25, 0.25) * spacing, py = y + g.range(-0.3, 0.3) * 30 * s;
      const pu = uOf(py);
      const d = Math.abs(px - pathCx(pu)) - pathHw(pu);
      x += spacing;
      if (d < 20 * s) continue;
      // keep the gate, bench and bird bath areas open
      if (py < 700 && Math.abs(px - 600) < 120) continue;
      if (px > 815 && px < 1180 && py < 748) continue;
      if (Math.abs(px - 232) < 80 && py > 800 && py < 880) continue;
      let kind: Kind;
      if (d < 78 * s) kind = g.pick<Kind>(['lavender', 'mound', 'mound', 'lavender', 'daisy', 'hosta', 'tulip', 'fern']);
      else if (d < 190 * s) kind = g.pick<Kind>(['peony', 'daisy', 'tulip', 'shrub', 'rosebush', 'lavender', 'hosta', 'grass', 'foxglove', 'peony', 'allium', 'fern']);
      else kind = g.pick<Kind>(['foxglove', 'delphinium', 'rosebush', 'peony', 'delphinium', 'shrub', 'shrub', 'grass', 'peony', 'allium', 'foxglove']);
      placed.push({ y: py, shapes: place(bucket(plant(kind, g, s > 0.8)), { x: px, y: py, s: s * g.range(0.88, 1.12), sx: undefined }) });
    }
    y += 41 * s;
    row++;
  }
}

// set pieces that sit among the planting (sorted by their base line)
const setPiece = (y: number, shapes: Shape[]) => placed.push({ y, shapes });

// bench against the right-hand wall with a cushion, a cat-free quiet corner
{
  const b: Shape[] = [];
  b.push(sh(ellipse(955, 716, 130, 12), '#33402a', { opacity: 0.25 }));
  b.push(...place(bench(210, '#b9895a'), { x: 955, y: 716 }));
  b.push(sh(rect(868, 646, 70, 16, 7), C.peonyLight), sh(rect(868, 655, 70, 7, 3), C.peony), stroke(line([[880, 648], [880, 660]]) + line([[896, 648], [896, 660]]) + line([[912, 648], [912, 660]]) + line([[928, 648], [928, 660]]), C.peonyDark, 1.4));
  b.push(sh(poly([[990, 660], [1030, 660], [1034, 644], [986, 644]]), '#d8c08a'), stroke(line([[990, 650], [1032, 650]]) + line([[996, 644], [994, 660]]) + line([[1008, 644], [1008, 660]]) + line([[1022, 644], [1024, 660]]), '#a98b52', 1.4), stroke(curve([[990, 644], [1010, 622], [1030, 644]]), '#a98b52', 2.4));
  b.push(...place(blossomRow([C.rose, C.peony, C.cream, C.lavender, '#f6d66a']), { x: 992, y: 642 }));
  setPiece(716, b);
}
function blossomRow(cols: string[]): Shape[] {
  const out: Shape[] = [];
  cols.forEach((c, i) => out.push(sh(blossomPath(4 + i * 9, -3 - (i % 2) * 5, 6, 5, 0.5, i * 20), c), sh(circle(4 + i * 9, -3 - (i % 2) * 5, 1.8), C.yellow)));
  return out;
}

// pots flanking the gate with clipped box balls
for (const [x, sgn] of [[452, 1], [748, -1]] as Pt[]) {
  const p: Shape[] = [sh(ellipse(x, 690, 44, 7), '#33402a', { opacity: 0.25 })];
  p.push(...place(pot(64, 60), { x, y: 692 }));
  p.push(sh(circle(x, 598, 36), C.leafDark), sh(circle(x - 7 * sgn, 590, 27), C.leaf), sh(circle(x - 12 * sgn, 584, 14), C.leafLight, { opacity: 0.8 }));
  const g = rng(900 + x);
  let d = '';
  for (let i = 0; i < 16; i++) d += leaf(x + g.range(-28, 28), 598 + g.range(-28, 28), 9, 3, g.range(0, 360));
  p.push(sh(d, '#7fb863'));
  setPiece(692, p);
}

// cluster of pots by the bench
{
  const p: Shape[] = [];
  p.push(...place(pot(50, 46), { x: 1100, y: 724 }), ...place(soil(50), { x: 1100, y: 679 }));
  p.push(...place(leafClump(61, 7, 46, 9, C.leaf, 140), { x: 1100, y: 680 }));
  [[1086, 640, C.rose], [1104, 628, '#e8617f'], [1118, 646, C.rose], [1096, 652, '#f08c7a']].forEach(([x, y, c], i) => p.push(...place(roseBud(9, c as string), { x: x as number, y: y as number, rot: i * 30 })));
  p.push(...place(pot(36, 32, C.terraLight), { x: 1142, y: 732 }), ...place(pot(30, 26, C.terraDark), { x: 1062, y: 730 }));
  p.push(...place(leafClump(62, 6, 26, 5, '#8fae8b', 120), { x: 1142, y: 702 }), ...place(leafClump(63, 5, 20, 6, C.leafLight, 120), { x: 1062, y: 706 }));
  setPiece(732, p);
}

// stone bird bath on the left with a bathing sparrow
{
  const x = 232, y = 826;
  const p: Shape[] = [sh(ellipse(x, y, 60, 9), '#33402a', { opacity: 0.25 })];
  p.push(sh(rect(x - 32, y - 14, 64, 14, 4), C.stoneDark), sh(rect(x - 24, y - 24, 48, 12, 3), C.stone));
  p.push(sh(poly([[x - 13, y - 24], [x + 13, y - 24], [x + 10, y - 86], [x - 10, y - 86]]), C.stone), sh(poly([[x + 3, y - 24], [x + 13, y - 24], [x + 10, y - 86], [x + 3, y - 86]]), C.stoneDark), sh(rect(x - 16, y - 60, 32, 6, 2), C.stoneLight));
  p.push(sh(blob([[x - 62, y - 104], [x - 50, y - 86], [x, y - 80], [x + 50, y - 86], [x + 62, y - 104]], 0.7), C.stoneDark));
  p.push(sh(ellipse(x, y - 104, 62, 13), C.stoneLight), sh(ellipse(x, y - 103, 52, 9), '#9fd0de'), sh(ellipse(x - 14, y - 105, 22, 3), '#dff3f7'));
  p.push(stroke(ellipse(x + 18, y - 102, 16, 3), '#ffffff', 1.2, { opacity: 0.8 }));
  p.push(...place(bird({ back: '#9b7a58', breast: '#e9dcc4', wing: '#7a5c40', cap: '#7a5236', beak: '#5a4a3a' }), { x: x + 34, y: y - 108, sx: -0.6, sy: 0.6 }));
  setPiece(y, p);
}

// watering can and a trug of cut flowers beside the path
{
  const p: Shape[] = [sh(ellipse(854, 932, 70, 9), '#33402a', { opacity: 0.25 })];
  p.push(...place(wateringCan('#7fa9b8'), { x: 858, y: 932, s: 0.86 }));
  setPiece(934, p);
}
{
  const x = 318, y = 1016;
  const p: Shape[] = [sh(ellipse(x, y, 70, 9), '#33402a', { opacity: 0.25 })];
  p.push(...place(pot(92, 84), { x, y }), ...place(soil(92), { x, y: y - 83 }));
  p.push(...place(leafClump(71, 9, 70, 13, C.leaf, 170), { x, y: y - 82 }));
  [[-34, -150, C.rose], [0, -168, '#f08c7a'], [32, -148, C.rose], [-14, -132, '#e8617f'], [18, -126, '#f08c7a']].forEach(([dx, dy, c], i) => p.push(...place(rose(15, c as string, 400 + i), { x: x + (dx as number), y: y + (dy as number) })));
  setPiece(y, p);
}

// blackbird hopping on the path, butterflies over the borders
setPiece(900, place(bird({ back: '#2f2d33', breast: '#3d3a42', wing: '#232228', beak: '#f2a23a' }), { x: 706, y: 856, s: 0.8 }));

placed.sort((a, b) => a.y - b.y);
for (const p of placed) add(...p.shapes);

add(...place(butterfly('#f2a23a', C.cream), { x: 206, y: 660, s: 0.6, rot: -24 }));
add(...place(butterfly(C.lilac, '#ffffff'), { x: 1006, y: 800, s: 0.66, rot: 28 }));
add(...place(butterfly('#f6d66a', '#ffffff'), { x: 700, y: 742, s: 0.5, rot: -10 }));
add(...place(butterfly(C.blue, '#ffffff'), { x: 420, y: 880, s: 0.6, rot: 40 }));

// ------------------------------------------------------------------ foreground frame
{
  // overhanging branch, top left and top right
  const g = rng(808);
  const branch = (pts: Pt[], seed: number, col: string) => {
    add(stroke(curve(pts), C.bark, 7), stroke(curve(pts), '#7a5d44', 2.5));
    add(...vine(pts, seed, { leaf: col, leafLen: 44, step: 19, stem: C.bark, stemW: 2 }));
    add(...vine(pts.map(([x, y]) => [x + 8, y + 16] as Pt), seed + 50, { leaf: shade(col, 0.12), leafLen: 36, step: 26, stem: C.bark, stemW: 1.5 }));
  };
  branch([[-10, 60], [90, 44], [200, 70], [300, 50], [380, 86]], 811, C.leaf);
  branch([[-10, 150], [70, 150], [150, 190], [230, 180]], 812, C.leafDark);
  branch([[1210, 30], [1110, 46], [1010, 30], [930, 58]], 813, C.leaf);
  branch([[1210, 190], [1150, 200], [1090, 236]], 814, C.leafDark);
  // apple blossom on the branches
  for (const [x, y] of [[120, 52], [236, 72], [330, 60], [96, 162], [190, 186], [1080, 44], [980, 40], [1140, 204], [40, 60], [1170, 44]] as Pt[]) {
    for (let k = 0; k < 3; k++) {
      const bx = x + g.range(-18, 18), by = y + g.range(-14, 14);
      add(sh(blossomPath(bx, by, g.range(9, 12), 5, 0.55, g.range(0, 72)), k % 2 ? C.blush : '#ffffff'), sh(circle(bx, by, 3), C.yellow));
    }
  }
}
{
  // big foreground blooms and leaves in the bottom corners
  add(...place(leafClump(901, 9, 150, 34, '#4f8f5c', 150), { x: 40, y: 1215 }));
  add(...place(peony(58, C.peony, 911), { x: 96, y: 1128 }), ...place(peony(44, C.peonyLight, 912), { x: 196, y: 1168 }), ...place(peony(34, C.peonyDark, 913), { x: 22, y: 1050 }));
  add(...place(leafClump(902, 9, 150, 30, '#5a9a66', 150), { x: 1165, y: 1215 }));
  [[1052, 200, C.lavender], [1092, 250, '#6f8fd6'], [1130, 280, C.lavDark], [1166, 230, C.lilac], [1196, 262, '#4f6fc0']].forEach(([x, h, c], i) => add(...place(spike(h as number, c as string, 921 + i, 1.15), { x: x as number, y: 1222 })));
  add(...place(peony(40, C.blush, 914), { x: 1010, y: 1176 }));
}

const activity: PuzzleActivity = {
  id: ID, version: 2, mode: 'puzzle',
  title: 'The Hidden Gate',
  blurb: 'A winding stone path leads through brimming flower borders to an old arched gate in the garden wall.',
  collectionId: 'garden',
  categories: ['Garden', 'Flowers', 'Architecture'],
  difficulty: 'Detailed',
  pieceCounts: [36, 64, 100, 196], geometrySeed: 4127, geometryVersion: 1,
  art: {
    width: W, height: H,
    defs:
      linearGradient(`${ID}-sky`, [[0, '#8fc6e6'], [0.55, '#c9e6f2'], [1, '#f3f0dc']]) +
      `<radialGradient id="${ID}-sun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#fff9dc" stop-opacity="0.95"/><stop offset="0.35" stop-color="#fff3c4" stop-opacity="0.5"/><stop offset="1" stop-color="#fff3c4" stop-opacity="0"/></radialGradient>` +
      linearGradient(`${ID}-glass`, [[0, '#d4eef0'], [1, '#a9d3d2']]) +
      `<linearGradient id="${ID}-wallshade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3d2a26" stop-opacity="0"/><stop offset="1" stop-color="#3d2a26" stop-opacity="0.5"/></linearGradient>` +
      linearGradient(`${ID}-lawn`, [[0, '#7fae5c'], [0.5, '#8cbb62'], [1, '#6fa351']]),
    shapes: S,
  },
};
export default activity;
