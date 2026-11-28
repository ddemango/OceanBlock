import { rect, ellipse, circle, poly, line, curve, blob, leaf, star, sh, stroke, place, shade, rng, linearGradient } from '../../art/kit';
import type { Pt } from '../../art/geometry';
import type { Shape } from '../../art/types';
import type { FindActivity, FindItem } from '../types';
import {
  M, L, Q, ol, shadow, H, planks, pumpkin, gourd, hayBale, cornStalks, leafScatter, mapleLeafPath, foliageClump, bat, blackCat, witchHat, ghostSheet, cape, coatRack,
  broom, owl, spiderWeb, pumpkinPail, candyApple, lollipop, candyBowl, cauldron, lantern, paperLantern, rockingChair, plaidThrow, fairyLights, wreath, candyCorn, wrappedSweet, pillarCandle,
} from './props-find';

const ID = 'holidays-find-1';
const W = 1200, HT = 1500;
const items: FindItem[] = [];
const scene = (...s: (Shape | Shape[])[]) => { items.push({ shapes: s.flat() }); };
const target = (id: string, name: string, shapes: Shape[]) => { items.push({ id, name, target: true, shapes }); };

const defs =
  linearGradient(`${ID}-sky`, [[0, '#1b1838'], [0.45, '#2e2655'], [0.8, '#56407a'], [1, '#8a5a7a']]) +
  linearGradient(`${ID}-lawn`, [[0, '#2f3a2c'], [1, '#475536']]) +
  linearGradient(`${ID}-win`, [[0, '#ffe7a0'], [1, '#f4b24a']]) +
  linearGradient(`${ID}-wall`, [[0, '#3c4a5c'], [1, '#55606c']]);

const LEAVES = ['#d0602a', '#e8902c', '#c8402a', '#e8b030', '#a84a2a', '#b86a2a'];

// =====================================================================
// sky, moon, stars and distant village
// =====================================================================
scene(sh(rect(0, 0, W, 860), `url(#${ID}-sky)`), sh(rect(0, 850, W, 230), '#2a2440'));
{
  const g = rng(3);
  for (let i = 0; i < 46; i++) {
    const x = g.range(10, W - 10), y = g.range(10, 640), r = g.range(1.4, 3.6);
    if (x > 380 && y > 60) continue;
    scene(i % 4 ? sh(circle(x, y, r * 0.6), '#fff6d8', { opacity: g.range(0.5, 0.95) }) : sh(star(x, y, r * 2, r * 0.5, 4, 0), '#fff3c8', { opacity: 0.9 }));
  }
}
scene(sh(circle(250, 220, 220), '#f4e2b0', { opacity: 0.06 }), sh(circle(250, 220, 165), '#f4e2b0', { opacity: 0.08 }), sh(circle(250, 220, 128), '#f8ecc4', { opacity: 0.12 }));
scene(sh(circle(250, 220, 104), '#fbf0c8'), sh(circle(214, 196, 18) + circle(286, 250, 24) + circle(262, 176, 11) + circle(204, 262, 13) + circle(306, 196, 9), '#ecdcae', { opacity: 0.8 }));
{
  const cl = (x: number, y: number, s: number) => blob([[x - 90 * s, y], [x - 60 * s, y - 16 * s], [x - 20 * s, y - 24 * s], [x + 30 * s, y - 20 * s], [x + 80 * s, y - 10 * s], [x + 100 * s, y + 2 * s], [x, y + 8 * s]], 1);
  scene(sh(cl(170, 300, 1.3), '#6a5a8a', { opacity: 0.55 }), sh(cl(370, 140, 0.9), '#5a4a7a', { opacity: 0.5 }), sh(cl(140, 470, 1.1), '#7a5a8a', { opacity: 0.45 }));
}
// silhouette bats circling the moon
for (const [x, y, s, r] of [[120, 120, 40, -10], [360, 250, 34, 12], [180, 360, 30, -6], [90, 250, 26, 18], [330, 90, 28, -14]] as [number, number, number, number][]) scene(place(bat(s, '#1c1830', false), { x, y, rot: r }));
// hills and village roofs
scene(sh(blob([[-30, 760], [120, 700], [260, 730], [420, 690], [560, 720], [700, 700], [1230, 740], [1230, 900], [-30, 900]], 0.8), '#3a2f56'));
{
  const g = rng(9);
  let roofs = '', win = '';
  for (let i = 0; i < 8; i++) {
    const x = -10 + i * 54 + g.range(-6, 6), w = g.range(36, 52), h = g.range(26, 46), y = 790 - g.range(0, 30);
    roofs += rect(x, y - h, w, h + 60) + poly([[x - 4, y - h], [x + w / 2, y - h - g.range(16, 28)], [x + w + 4, y - h]]);
    if (g.next() < 0.8) win += rect(x + w * 0.2, y - h * 0.6, 6, 7);
    if (g.next() < 0.6) win += rect(x + w * 0.6, y - h * 0.6, 6, 7);
  }
  scene(sh(roofs, '#2a2244'), sh(win, '#f6c860', { opacity: 0.85 }));
  let trees = '';
  for (let i = 0; i < 10; i++) { const x = 20 + i * 42 + g.range(-10, 10), h = g.range(40, 70); trees += poly([[x - 14, 820], [x, 820 - h], [x + 14, 820]]); }
  scene(sh(trees, '#241e3a'));
}

// =====================================================================
// the house: upper storey, roof and porch roof
// =====================================================================
scene(sh(rect(400, 60, 800, 860), `url(#${ID}-wall)`));
scene(planks(400, 60, 800, 460, 20, '#4a5868', 11), planks(400, 520, 800, 400, 16, '#56606a', 12));
// gable roof
scene(sh(poly([[390, 0], [390, 172], [820, -24], [820, 0]]) + poly([[820, -24], [1210, 140], [1210, 0]]), '#1c1939'));
scene(sh(poly([[372, 160], [820, -30], [1220, 140], [1220, 170], [820, -8], [372, 186]]), '#2a2238'), sh(poly([[400, 150], [820, -26], [1210, 136], [1210, 112], [820, -50], [400, 126]]), '#3a3046'));
{
  // shingle rows on the roof edge
  let sh1 = '';
  for (let i = 0; i < 26; i++) { const t = i / 26, x = 380 + t * 440, y = 168 - t * 182; sh1 += line([[x, y], [x + 4, y + 14]]); }
  for (let i = 0; i < 24; i++) { const t = i / 24, x = 830 + t * 380, y = -6 + t * 152; sh1 += line([[x, y], [x - 4, y + 14]]); }
  scene(stroke(sh1, '#1a1428', 2));
}
// attic window and upstairs windows
function glowWindow(x: number, y: number, w: number, h: number, curtain: string, arched = false): Shape[] {
  const out: Shape[] = [sh(rect(x - 30, y - 30, w + 60, h + 60, 30), '#ffd27a', { opacity: 0.08 }), sh(rect(x - 10, y - 10, w + 20, h + 20, 12), '#ffd27a', { opacity: 0.12 })];
  const pane = arched ? M(x, y + h) + L(x, y + w / 2) + Q(x, y, x + w / 2, y) + Q(x + w, y, x + w, y + w / 2) + L(x + w, y + h) + 'Z' : rect(x, y, w, h);
  out.push(sh(pane, `url(#${ID}-win)`));
  out.push(sh(M(x, y + 4) + Q(x + w * 0.3, y + h * 0.4, x + w * 0.12, y + h) + L(x, y + h) + 'Z', curtain), sh(M(x + w, y + 4) + Q(x + w * 0.7, y + h * 0.4, x + w * 0.88, y + h) + L(x + w, y + h) + 'Z', curtain));
  out.push(stroke(pane + line([[x + w / 2, y], [x + w / 2, y + h]]) + line([[x, y + h / 2], [x + w, y + h / 2]]), '#efe4cc', 6), ol(rect(x - 12, y + h, w + 24, 12, 2), '#e8dcc0', 1));
  return out;
}
scene(glowWindow(540, 220, 130, 180, '#b0502a'), glowWindow(940, 220, 130, 180, '#7a4a8a'));
scene(place(pumpkin(54, 40, H.pumpkin, 3), { x: 1005, y: 400 }), place(pumpkin(40, 30, '#f0a040', 0), { x: 590, y: 400 }));
scene(sh(circle(820, 90, 34), '#ffd27a', { opacity: 0.12 }), sh(circle(820, 90, 26), `url(#${ID}-win)`), stroke(circle(820, 90, 26) + line([[794, 90], [846, 90]]) + line([[820, 64], [820, 116]]), '#efe4cc', 5));
// paper bat cut-outs on the upstairs windows
scene(place(bat(44, '#2a2236', false), { x: 605, y: 270, rot: -8 }), place(bat(36, '#2a2236', false), { x: 1012, y: 300, rot: 10 }));

// porch roof
scene(sh(poly([[372, 446], [1200, 446], [1200, 506], [372, 506]]), '#2c2438'));
{
  let rows = '';
  for (let r = 0; r < 3; r++) for (let x = 372 + (r % 2) * 14; x < 1200; x += 28) rows += rect(x, 446 + r * 18, 28, 18);
  scene(stroke(rows, '#1c1628', 1.4), sh(rect(372, 446, 828, 5), '#4a3e5a'));
}
scene(ol(rect(372, 506, 828, 26, 2), '#e8dcc0', 1, -0.3), sh(rect(372, 532, 828, 10), '#000000', { opacity: 0.2 }));
// string lights along the fascia
for (let i = 0; i < 4; i++) scene(fairyLights(380 + i * 205, 528, 585 + i * 205, 528, 18, 7, ['#f6a83a', '#a87ad8', '#ffe07a', '#7ad89a'], 4.5, '#2a2230'));

// =====================================================================
// the porch: door, window, wall lamp
// =====================================================================
// warm light wash over the porch wall
scene(sh(ellipse(800, 760, 420, 260), '#ffbe6a', { opacity: 0.1 }), sh(ellipse(800, 760, 280, 180), '#ffbe6a', { opacity: 0.1 }));
// big window left of the door
scene(glowWindow(492, 610, 210, 190, '#9a3a2a'));
scene(place(pumpkin(60, 44, H.pumpkin, 2), { x: 560, y: 800 }), place(pillarCandle(14, 30, '#f2e6cc'), { x: 640, y: 800 }), place(pillarCandle(12, 22, '#e8d0b0'), { x: 662, y: 800 }));
// door
scene(ol(rect(744, 586, 172, 318, 3), '#e8dcc0', 1), sh(rect(758, 600, 144, 304), '#7a2f2a'), sh(rect(758, 600, 144, 6), '#5a1f1a'));
scene(sh(M(774, 760) + L(774, 650) + Q(774, 618, 830, 618) + Q(886, 618, 886, 650) + L(886, 760) + 'Z', `url(#${ID}-win)`), stroke(M(774, 760) + L(774, 650) + Q(774, 618, 830, 618) + Q(886, 618, 886, 650) + L(886, 760) + 'Z' + line([[830, 618], [830, 760]]) + line([[774, 690], [886, 690]]), '#5a1f1a', 5));
scene(ol(rect(774, 778, 50, 106, 3) + rect(836, 778, 50, 106, 3), '#8a3a32', 1, -0.35), ol(circle(892, 772, 7), H.brass, 1, -0.35), ol(rect(810, 744, 40, 8, 3), H.brass, 1, -0.35));
scene(place(wreath(46, 21, ['#c8502a', '#e8902c', '#a84a2a'], '#5a3f7a', '#f2c040'), { x: 830, y: 690 }));
// wall lamp
scene(sh(circle(948, 640, 60), '#ffd27a', { opacity: 0.12 }), sh(circle(948, 640, 34), '#ffd27a', { opacity: 0.16 }), ol(rect(942, 666, 12, 24, 2), '#2c2735', 1, 0.2), place(lantern(64, '#2c2735', H.glow, false), { x: 948, y: 604 }));
// porch posts
scene(ol(rect(408, 532, 30, 370, 2), '#e8dcc0', 1, -0.35), ol(rect(1162, 532, 30, 370, 2), '#e8dcc0', 1, -0.35), sh(rect(430, 532, 8, 370) + rect(1184, 532, 8, 370), '#b8ac94'));
// corn stalks tied to the left post
scene(place(cornStalks(250, 5), { x: 423, y: 902 }));

// =====================================================================
// porch furniture, costumes and the targets on the porch
// =====================================================================
target('spider-web', 'Spider web', place(spiderWeb(84), { x: 440, y: 542 }));
target('hanging-lantern', 'Hanging lantern', place(lantern(76, '#2c2735', '#ffcb5a'), { x: 690, y: 542 }));
// rocking chair with a plaid throw in front of the window
scene(place(rockingChair(130, 200, '#5a3a2a'), { x: 590, y: 902 }), place(plaidThrow(110, 70, '#b8402a', '#2c2438'), { x: 584, y: 704 }));
// broom leaning between window and door
target('broomstick', 'Broomstick', place(broom(250), { x: 728, y: 900, rot: 10 }));
// side table, candy bowl and candle
scene(ol(rect(966, 790, 10, 112) + rect(1032, 790, 10, 112), '#3a2a20', 1, 0.2), ol(ellipse(1004, 790, 56, 12), '#5a3a2a', 1, -0.3));
target('candy-bowl', 'Candy bowl', place(candyBowl(96, 31), { x: 1000, y: 790 }));
// coat stand with costumes
scene(place(coatRack(310, '#4a3020'), { x: 1100, y: 902 }));
scene(place(cape(150, '#2c2438', '#b8402a'), { x: 1064, y: 650 }));
target('ghost-costume', 'Ghost costume', place(ghostSheet(150), { x: 1136, y: 654 }));
target('witch-hat', 'Witch hat', place(witchHat(96), { x: 1102, y: 604, rot: -6 }));

// porch floor and railings
scene(planks(372, 902, 828, 22, 1, '#7a6250', 21), sh(rect(372, 902, 828, 4), '#a08268'), sh(rect(372, 924, 828, 8), '#2a2030', { opacity: 0.5 }));
function railing(x0: number, x1: number): Shape[] {
  let bal = '';
  for (let x = x0 + 14; x < x1 - 8; x += 22) bal += rect(x, 814, 9, 88, 2);
  return [sh(bal, '#e0d4bc', { stroke: '#a89a80', strokeWidth: 1 }), ol(rect(x0, 800, x1 - x0, 16, 3), '#ece2cc', 1, -0.3), ol(rect(x0, 884, x1 - x0, 10, 2), '#d8ccb4', 1, -0.3)];
}
scene(railing(438, 690), railing(970, 1162));
// lattice skirt under the porch
{
  const sk = (x0: number, x1: number) => {
    let d = '';
    for (let x = x0 - 120; x < x1; x += 22) d += line([[Math.max(x0, x), 932 + Math.max(0, x0 - x)], [Math.min(x1, x + 128), 932 + Math.min(128, x1 - x)]]);
    for (let x = x0; x < x1 + 128; x += 22) d += line([[Math.min(x1, x), 932 + Math.max(0, x - x1)], [Math.max(x0, x - 128), 932 + Math.min(128, x - x0)]]);
    return [sh(rect(x0, 932, x1 - x0, 128), '#1c1626'), stroke(d, '#7a6a80', 3)];
  };
  scene(sk(372, 684), sk(976, 1200), ol(rect(372, 924, 312, 10, 1), '#e8dcc0', 1), ol(rect(976, 924, 224, 10, 1), '#e8dcc0', 1));
}
// steps
{
  const steps: [number, number, number][] = [[924, 690, 970], [970, 680, 980], [1016, 670, 990]];
  for (const [y, x0, x1] of steps) scene(sh(rect(x0, y, x1 - x0, 46), '#6a5444'), sh(rect(x0 - 6, y, x1 - x0 + 12, 12, 2), '#8e745e'), sh(rect(x0 - 6, y + 12, x1 - x0 + 12, 4), '#2a2030', { opacity: 0.35 }));
  scene(sh(poly([[690, 924], [970, 924], [990, 1062], [670, 1062]]), '#ffbe6a', { opacity: 0.12 }));
}
// pumpkins and candles on the steps
scene(place(pumpkin(70, 54, H.pumpkin, 1), { x: 716, y: 924 }), place(pumpkin(58, 46, '#f09a3a', 3), { x: 944, y: 924 }));
scene(place(gourd(34, '#f2d060', '#7f9a4a'), { x: 760, y: 924 }), place(pillarCandle(14, 26), { x: 904, y: 924 }));
scene(place(pumpkin(54, 42, '#e8802a', 0), { x: 704, y: 970 }), place(pumpkin(62, 48, H.pumpkin, 2), { x: 954, y: 970 }));
scene(place(pumpkin(66, 50, '#f0a040', 1), { x: 696, y: 1016 }), place(pumpkin(48, 36, '#e8d8b8', 0, '#5a6a3a'), { x: 980, y: 1016 }), place(gourd(30, '#7fa04a', '#f2d060'), { x: 1012, y: 1016 }));
target('black-cat', 'Black cat', place(blackCat(92), { x: 806, y: 1014 }));
{
  const g = rng(55);
  for (let i = 0; i < 7; i++) scene(place(i % 3 ? wrappedSweet(18, g.pick(['#d8452f', '#7ac06a', '#f4c63a', '#8a5ad0'])) : candyCorn(14), { x: 860 + g.range(0, 60), y: 1000 + g.range(-6, 10) + (i % 2) * 46, rot: g.range(-60, 60) }));
}

// =====================================================================
// the old tree, owl and paper lanterns (left)
// =====================================================================
{
  const trunk = M(70, 1210) + Q(120, 1150, 120, 1000) + L(126, 700) + Q(130, 560, 110, 420) + Q(96, 300, 60, 200) + L(84, 190) + Q(130, 300, 150, 420) + Q(176, 520, 200, 500) + Q(300, 470, 420, 440) + L(424, 458) + Q(300, 494, 210, 540) + Q(176, 560, 178, 700) + L(184, 1000) + Q(186, 1150, 250, 1210) + 'Z';
  scene(sh(trunk, '#2a2236'));
  let br = '';
  br += M(110, 420) + Q(60, 360, -10, 330) + L(-10, 316) + Q(70, 340, 120, 400) + 'Z';
  br += M(70, 220) + Q(30, 140, -10, 110) + L(0, 96) + Q(50, 130, 84, 210) + 'Z';
  br += M(84, 260) + Q(150, 160, 230, 120) + L(234, 132) + Q(160, 180, 96, 290) + 'Z';
  br += M(200, 140) + Q(240, 80, 300, 60) + L(302, 70) + Q(250, 90, 212, 136) + 'Z';
  br += M(330, 452) + Q(370, 400, 400, 380) + L(404, 388) + Q(376, 410, 342, 452) + 'Z';
  br += M(150, 620) + Q(80, 600, 30, 640) + L(28, 628) + Q(80, 586, 156, 600) + 'Z';
  scene(sh(br, '#2a2236'), stroke(curve([[132, 1100], [140, 900], [138, 700], [128, 520]]) + curve([[160, 1120], [166, 940], [160, 760]]), '#3a3048', 3));
  // a few clinging autumn leaves
  const g = rng(77);
  for (let i = 0; i < 22; i++) {
    const pts: Pt[] = [[-10, 330], [40, 350], [10, 120], [60, 160], [180, 150], [240, 110], [280, 72], [360, 420], [390, 392], [40, 630]];
    const [px, py] = pts[i % pts.length];
    scene(sh(mapleLeafPath(g.range(14, 22), px + g.range(-16, 16), py + g.range(-14, 14), g.range(0, 360)), g.pick(LEAVES)));
  }
}
target('owl', 'Owl', place(owl(84, '#8a6040'), { x: 300, y: 472, rot: -6 }));
// paper lanterns strung from the branch
scene(stroke(curve([[214, 520], [260, 540], [330, 534], [400, 450]]), '#1c1626', 1.2));
scene(place(paperLantern(16, '#f08a2a'), { x: 250, y: 534 }), place(paperLantern(14, '#a87ad8'), { x: 300, y: 540 }), place(paperLantern(13, '#7ac06a'), { x: 350, y: 520 }));
target('friendly-bat', 'Friendly bat', place(bat(96, '#5a4078'), { x: 478, y: 340, rot: 8 }));

// =====================================================================
// the yard
// =====================================================================
scene(sh(rect(0, 1040, W, 460), `url(#${ID}-lawn)`), sh(blob([[-20, 1060], [200, 1040], [420, 1060], [700, 1046], [1000, 1060], [1220, 1044], [1220, 1100], [-20, 1100]], 0.6), '#2f3a2c'));
// picket fence on the far left
{
  let pk = '';
  for (let x = -6; x < 330; x += 30) pk += M(x, 1150) + L(x, 1070) + L(x + 9, 1058) + L(x + 18, 1070) + L(x + 18, 1150) + 'Z';
  scene(sh(pk, '#5a4e64'), ol(rect(-10, 1084, 340, 10, 2) + rect(-10, 1124, 340, 10, 2), '#4a4054', 1));
}
// light spill on the lawn
scene(sh(ellipse(830, 1110, 260, 50), '#ffbe6a', { opacity: 0.1 }));
// stepping-stone path
{
  const stones: [number, number, number][] = [[830, 1090, 70], [812, 1150, 74], [790, 1218, 80], [776, 1294, 86], [770, 1380, 94], [776, 1470, 104]];
  for (const [x, y, r] of stones) scene(ol(ellipse(x, y, r, r * 0.3), '#8a8296', 1, -0.3), sh(ellipse(x - r * 0.2, y - r * 0.08, r * 0.5, r * 0.12), '#a8a0b4', { opacity: 0.6 }));
}
// grass tufts
{
  const g = rng(44);
  let t1 = '', t2 = '';
  for (let i = 0; i < 90; i++) { const x = g.range(0, W), y = g.range(1100, 1500); if (Math.abs(x - (800 - (y - 1100) * 0.08)) < 110) continue; const d = line([[x, y], [x - 4, y - 12]]) + line([[x, y], [x + 1, y - 15]]) + line([[x, y], [x + 5, y - 11]]); if (i % 2) t1 += d; else t2 += d; }
  scene(stroke(t1, '#5a6a42', 1.6), stroke(t2, '#3a4830', 1.6));
}
// hay bales and corn stalks at the foot of the porch
scene(place(cornStalks(220, 9), { x: 470, y: 1094 }), place(cornStalks(200, 13), { x: 1110, y: 1094 }));
scene(place(hayBale(190, 76, 3), { x: 470, y: 1110 }), place(hayBale(150, 64, 5), { x: 1110, y: 1112 }));
scene(place(pumpkin(66, 50, '#f0a040', 0), { x: 420, y: 1032 }), place(gourd(32, '#e8d8b8', '#7f9a4a'), { x: 1076, y: 1048 }), place(pumpkin(56, 44, H.pumpkin, 3), { x: 1130, y: 1048 }));
target('candy-apple', 'Candy apple', place(candyApple(64), { x: 520, y: 1034, rot: 4 }));
// pumpkin patch: vines, leaves and pumpkins
{
  const g = rng(61);
  scene(stroke(curve([[0, 1250], [120, 1200], [260, 1240], [400, 1210], [560, 1260]]) + curve([[30, 1340], [180, 1300], [320, 1330], [480, 1300], [620, 1350]]), '#4a6a32', 4));
  for (let i = 0; i < 26; i++) { const x = g.range(10, 620), y = g.range(1190, 1350); scene(sh(blob([[x, y], [x + 16, y - 18], [x + 34, y - 8], [x + 30, y + 14], [x + 10, y + 16]], 0.9), g.next() < 0.5 ? '#4a7a3a' : '#3a6a30', { stroke: '#2a4a22', strokeWidth: 1 })); }
  const patch: [number, number, number, number, number, string][] = [
    [70, 1250, 90, 66, 0, '#e8802a'], [200, 1236, 70, 54, 1, H.pumpkin], [320, 1262, 96, 72, 3, '#f09a3a'], [520, 1248, 64, 50, 0, '#d8702a'],
    [130, 1336, 78, 60, 2, H.pumpkin], [450, 1334, 84, 62, 1, '#e8802a'], [600, 1318, 58, 44, 0, '#f0a040'], [260, 1350, 60, 46, 0, '#e8d8b8'],
  ];
  for (const [x, y, w, h, f, c] of patch) scene(place(pumpkin(w, h, c, f), { x, y }));
  scene(place(gourd(36, '#f2d060', '#7f9a4a'), { x: 380, y: 1290, rot: -20 }), place(gourd(30, '#7fa04a', '#f2d060'), { x: 560, y: 1356, rot: 30 }));
}
target('star-eyed-pumpkin', 'Star-eyed pumpkin', place(pumpkin(80, 60, '#f09030', 4), { x: 400, y: 1264 }));
// mums in pots beside the path
function mums(x: number, y: number, col: string, seed: number): Shape[] {
  return [ol(M(x - 36, y - 40) + L(x + 36, y - 40) + L(x + 28, y) + L(x - 28, y) + 'Z', '#a8583a', 1), sh(rect(x - 38, y - 46, 76, 10, 3), '#8a4a30'), ...place(foliageClump(seed, 96, 70, [col, shade(col, -0.2), shade(col, 0.2), '#4a6a3a'], 30), { x, y: y - 70 })];
}
scene(mums(640, 1150, '#c8508a', 3), mums(1000, 1170, '#e8a030', 7));
target('cauldron', 'Cauldron', place(cauldron(96, 81), { x: 1050, y: 1262 }));
// fallen leaves all over the lawn
scene(leafScatter(0, 1100, W, 400, 150, 91, LEAVES, 24));
target('pumpkin-pail', 'Pumpkin pail', place(pumpkinPail(70), { x: 940, y: 1404 }));
target('lollipop', 'Lollipop', place(lollipop(80, '#8a5ad0', '#f6eefc'), { x: 210, y: 1452, rot: -64 }));
// foreground bushes in autumn colour
scene(place(foliageClump(5, 240, 160, ['#a84a2a', '#c8602a', '#8a3a24', '#d8803a'], 40), { x: 1130, y: 1450 }), place(foliageClump(8, 220, 150, ['#6a4a2a', '#a8642a', '#c8902c', '#8a5a24'], 36), { x: 40, y: 1470 }));
scene(leafScatter(560, 1400, 260, 100, 18, 93, LEAVES, 20));
void leaf; void ellipse;

const activity: FindActivity = {
  id: ID, version: 1, mode: 'find', title: 'Halloween Night',
  blurb: 'Under a big harvest moon, a glowing front porch and pumpkin patch hide fourteen friendly Halloween treats.',
  added: '2026-11-25', collectionId: 'holidays', categories: ["Holidays"], difficulty: 'Moderate',
  season: { from: '10-01', to: '10-31', label: 'Halloween' },
  width: W, height: HT, defs, items,
};
export default activity;
