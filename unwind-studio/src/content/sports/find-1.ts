import { rect, ellipse, circle, poly, line, blob, star, sh, stroke, place, shade, mix, rng, linearGradient } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { FindActivity, FindItem } from '../types';
import {
  M, L, Q, ol, shadow, hl, P, SKIN, HAIR, digits, crest, fanBack, vendor, player, baseball, bat, mitt, cap, foamFinger, pennant, bunting,
  hotDog, popcornBox, sodaCup, peanutBag, binoculars, sunglasses, clipboard, cottonCandy, pretzel, gull,
} from './props-find';

const ID = 'sports-find-1';
const W = 1200;
const items: FindItem[] = [];
const scene = (...s: (Shape | Shape[])[]) => { items.push({ shapes: s.flat() }); };
const target = (id: string, name: string, shapes: Shape[]) => { items.push({ id, name, target: true, shapes }); };

const defs =
  linearGradient(`${ID}-sky`, [[0, '#7fb6e0'], [0.6, '#b9dbef'], [1, '#e8f1ee']]) +
  linearGradient(`${ID}-grass`, [[0, '#7cae55'], [1, '#5f9a44']]) +
  linearGradient(`${ID}-board`, [[0, '#2c4a3e'], [1, '#1f362d']]);

// =====================================================================
// sky, distant hills and town
// =====================================================================
scene(sh(rect(0, 0, W, 300), `url(#${ID}-sky)`));
{
  const cl = (x: number, y: number, s: number) => blob([[x - 60 * s, y], [x - 40 * s, y - 22 * s], [x - 10 * s, y - 30 * s], [x + 20 * s, y - 36 * s], [x + 50 * s, y - 20 * s], [x + 70 * s, y]], 0.8);
  scene(sh(cl(150, 90, 1.1) + cl(980, 70, 1.3) + cl(560, 30, 0.8), '#ffffff', { opacity: 0.9 }), sh(cl(170, 96, 0.8) + cl(1010, 78, 0.9), '#e8f0f4', { opacity: 0.9 }));
  scene(sh(ellipse(1120, 40, 60, 60), '#fff6d0', { opacity: 0.5 }), sh(circle(1120, 40, 30), '#fff3c2'));
}
scene(sh(blob([[0, 230], [120, 196], [260, 214], [420, 186], [600, 206], [780, 182], [960, 204], [1100, 188], [1200, 200], [1200, 260], [0, 260]], 0.6), '#9cbf9a'));
{
  // little town skyline beyond the park
  const g = rng(8);
  let a = '', b = '', win = '';
  for (let x = 0; x < W; x += g.range(34, 60)) {
    const w = g.range(26, 50), h = g.range(20, 60);
    const d = rect(x, 250 - h, w, h);
    if (g.next() < 0.5) a += d; else b += d;
    for (let wy = 256 - h; wy < 240; wy += 10) for (let wx = x + 5; wx < x + w - 6; wx += 9) if (g.next() < 0.6) win += rect(wx, wy, 4, 5);
  }
  scene(sh(a, '#b8c8cf'), sh(b, '#a6b8c2'), sh(win, '#e9f0f2', { opacity: 0.8 }));
  let tr = '';
  for (let x = -10; x < W + 20; x += 22) tr += circle(x + g.range(-4, 4), 252 + g.range(-4, 4), g.range(14, 20));
  scene(sh(tr + rect(0, 252, W, 12), '#6f9a5c'));
}
// light towers
for (const x of [70, 1130]) {
  scene(sh(poly([[x - 6, 300], [x + 6, 300], [x + 3, 60], [x - 3, 60]]), '#8a949c'), stroke(line([[x - 5, 280], [x + 4, 240], [x - 4, 200], [x + 3, 160], [x - 3, 120], [x + 3, 80]]), '#6c767e', 1.5));
  scene(ol(rect(x - 44, 20, 88, 46, 3), '#5a646c', 1.2));
  let bulbs = '';
  for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) bulbs += circle(x - 35 + c * 14, 31 + r * 13, 4.5);
  scene(sh(bulbs, '#fff6d6'), sh(rect(x - 44, 20, 88, 4), '#7a848c'));
}

// =====================================================================
// outfield bleachers and scoreboard
// =====================================================================
{
  const g = rng(31);
  for (const [x0, x1] of [[0, 330], [870, 1200]]) {
    scene(sh(poly([[x0, 262], [x1, 262], [x1, 210], [x0, 210]]), '#5a6f8a'));
    let st = '';
    for (let y = 214; y < 262; y += 8) st += line([[x0, y], [x1, y]]);
    scene(stroke(st, '#4a5c74', 1));
    const dots: string[] = ['', '', '', '', ''];
    for (let y = 216; y < 258; y += 8) for (let x = x0 + 4; x < x1 - 4; x += g.range(5, 9)) if (g.next() < 0.75) dots[g.int(0, 4)] += circle(x, y, 2.6);
    ['#c8463a', '#f4f1ea', '#26395f', '#e3b23c', '#e0aa80'].forEach((c, i) => scene(sh(dots[i], c)));
  }
}
{
  // scoreboard on two legs
  scene(sh(rect(420, 200, 16, 70) + rect(764, 200, 16, 70), '#4a545c'));
  scene(ol(rect(330, 28, 540, 186, 6), '#1c2e27', 2, 0.2), sh(rect(340, 38, 520, 166, 4), `url(#${ID}-board)`));
  scene(sh(rect(330, 22, 540, 12, 4), '#c8463a'), sh(rect(330, 214, 540, 6), '#963026'));
  // header: inning numbers
  scene(sh(digits('123456789', 460, 46, 10, 16, 12.5), '#f6ecd6'));
  scene(sh(rect(726, 46, 2, 70), '#4a6a5c'));
  // R H E as little symbols (dots) to avoid lettering
  scene(sh(circle(752, 54, 5) + circle(784, 54, 5) + circle(816, 54, 5), '#e3b23c'));
  // team rows: crest + scores
  scene(place(crest(16, '#2f8f8a', '#f6ecd6', 'wave'), { x: 400, y: 86 }), place(crest(16, '#c8463a', '#f6ecd6', 'bird'), { x: 400, y: 124 }));
  scene(sh(digits('010200', 460, 76, 10, 18, 12.5) + digits('3', 744, 76, 10, 18) + digits('7', 776, 76, 10, 18) + digits('1', 808, 76, 10, 18), '#f2cf3a'));
  scene(sh(digits('00130', 460, 114, 10, 18, 12.5) + digits('4', 744, 114, 10, 18) + digits('9', 776, 114, 10, 18) + digits('0', 808, 114, 10, 18), '#f2cf3a'));
  scene(sh(rect(440, 70, 280, 1) + rect(440, 108, 280, 1) + rect(440, 146, 410, 1), '#4a6a5c'));
  // ball / strike / out lamps
  let on = '', off = '';
  for (let i = 0; i < 4; i++) (i < 2 ? (on += circle(400 + i * 18, 172, 6)) : (off += circle(400 + i * 18, 172, 6)));
  for (let i = 0; i < 3; i++) (i < 1 ? (on += circle(510 + i * 18, 172, 6)) : (off += circle(510 + i * 18, 172, 6)));
  scene(sh(on, '#7fe07a'), sh(off, '#2f4a3e'), sh(circle(600, 172, 6) + circle(618, 172, 6), '#e85a4a'));
  // clock face
  scene(ol(circle(800, 176, 20), '#f6ecd6', 2), stroke(M(800, 176) + L(800, 162) + M(800, 176) + L(810, 180), '#1c2e27', 2.5));
  scene(place(gull(26), { x: 380, y: 22 }));
}
target('seagull', 'Seagull', place(gull(46), { x: 326, y: 264 }));

// =====================================================================
// outfield wall and the field
// =====================================================================
scene(sh(rect(0, 262, W, 40), '#2f6a4a'), sh(rect(0, 262, W, 5), '#f2cf3a'));
{
  // advert panels with invented little icons
  const ads: [number, string, string][] = [[40, '#f6ecd6', 'sun'], [190, '#c8463a', 'cone'], [850, '#26395f', 'star'], [1000, '#f2cf3a', 'cup']];
  for (const [x, c, k] of ads) {
    scene(ol(rect(x, 270, 130, 26, 3), c, 1));
    const ic = shade(c, -0.5);
    if (k === 'sun') scene(sh(circle(x + 22, 283, 7), '#e3a23c'), sh(rect(x + 40, 278, 76, 4, 2) + rect(x + 40, 286, 56, 4, 2), ic));
    if (k === 'cone') scene(sh(poly([[x + 16, 278], [x + 28, 278], [x + 22, 293]]), '#e8c08a'), sh(circle(x + 22, 277, 6), '#f6d4e0'), sh(rect(x + 40, 278, 76, 4, 2) + rect(x + 40, 286, 50, 4, 2), '#f6ecd6'));
    if (k === 'star') scene(sh(star(x + 22, 283, 9, 4), '#f2cf3a'), sh(rect(x + 40, 278, 76, 4, 2) + rect(x + 40, 286, 60, 4, 2), '#f6ecd6'));
    if (k === 'cup') scene(sh(rect(x + 16, 276, 12, 15, 2), P.red), sh(rect(x + 40, 278, 76, 4, 2) + rect(x + 40, 286, 60, 4, 2), ic));
  }
  scene(sh(digits('400', 576, 272, 10, 20), '#f6ecd6'), sh(digits('375', 360, 272, 9, 18) + digits('375', 790, 272, 9, 18), '#f6ecd6'));
}
scene(sh(rect(0, 302, W, 440), `url(#${ID}-grass)`));
{
  // mowing pattern: perspective stripes plus cross bands
  let a = '';
  for (let i = -14; i < 14; i += 2) {
    const x0 = 600 + i * 70, x1 = 600 + (i + 1) * 70;
    a += poly([[600 + (x0 - 600) * 0.35, 302], [600 + (x1 - 600) * 0.35, 302], [600 + (x1 - 600) * 1.6, 742], [600 + (x0 - 600) * 1.6, 742]]);
  }
  scene(sh(a, '#8cbd62', { opacity: 0.45 }));
  let b = '';
  let y = 302, h = 18;
  for (let i = 0; i < 12 && y < 742; i++) { if (i % 2) b += rect(0, y, W, h); y += h; h *= 1.18; }
  scene(sh(b, '#4f8a3a', { opacity: 0.18 }));
  // warning track
  scene(sh(rect(0, 302, W, 16), '#c49a6a'));
}
// infield dirt, grass and lines
scene(sh(blob([[250, 600], [340, 478], [600, 418], [860, 478], [950, 600], [800, 690], [600, 745], [400, 690]], 0.85), '#c9925e'));
scene(sh(poly([[600, 676], [810, 590], [600, 508], [390, 590]]), '#6faa4f'));
{
  scene(sh(poly([[600, 676], [705, 633], [600, 590], [495, 633]]), '#7cb75a', { opacity: 0.5 }), sh(poly([[600, 590], [705, 549], [600, 508], [495, 549]]), '#7cb75a', { opacity: 0.5 }));
}
scene(stroke(line([[600, 700], [0, 452]]) + line([[600, 700], [W, 452]]), '#fbfaf2', 3));
scene(sh(ellipse(600, 592, 38, 15), '#c9925e'), sh(ellipse(600, 590, 26, 9), '#d8a470'), sh(rect(592, 586, 16, 4), '#fbfaf2'));
scene(sh(ellipse(600, 704, 80, 30), '#c9925e'), stroke(rect(548, 690, 34, 26) + rect(618, 690, 34, 26), '#fbfaf2', 2));
scene(sh(poly([[600, 698], [612, 702], [610, 708], [590, 708], [588, 702]]), '#fbfaf2'));
for (const [x, y] of [[810, 590], [600, 508], [390, 590]] as [number, number][]) scene(sh(poly([[x, y - 6], [x + 10, y], [x, y + 6], [x - 10, y]]), '#fbfaf2'), sh(poly([[x - 10, y], [x + 10, y], [x, y + 6]]), '#d8d4c8'));
{
  // players: visitors in teal batting, home team in cream and red fielding
  const home = '#f4f1ea', hc = P.red, vis = '#2f8f8a';
  const fielders: [number, number, number][] = [[600, 592, 48], [820, 574, 40], [700, 500, 36], [500, 500, 36], [380, 574, 40], [250, 400, 32], [600, 360, 30], [950, 400, 32]];
  fielders.forEach(([x, y, s], i) => scene(place(player(s, home, hc, SKIN[i % SKIN.length], 0), { x, y })));
  scene(place(player(46, vis, shade(vis, -0.3), SKIN[2], 0), { x: 760, y: 600 }));
  scene(place(player(58, vis, shade(vis, -0.3), SKIN[3], 1), { x: 572, y: 712 }));
  scene(place(player(44, home, hc, SKIN[1], 2), { x: 604, y: 722 }));
  scene(place(player(52, '#2b2f36', '#2b2f36', SKIN[0], 2), { x: 610, y: 734 }));
}
// dugouts
for (const [x0, flip] of [[0, 1], [930, -1]] as [number, number][]) {
  scene(sh(rect(x0, 680, 270, 62), '#3a4a5e'), sh(rect(x0, 672, 270, 12, 3), P.red), sh(rect(x0, 684, 270, 4), '#2a3646'));
  const g = rng(x0 + 3);
  for (let i = 0; i < 7; i++) {
    const x = x0 + 24 + i * 36 + g.range(-4, 4);
    scene(sh(circle(x, 718, 10), SKIN[g.int(0, 5)]), sh(M(x - 11, 716) + Q(x - 10, 704, x, 704) + Q(x + 10, 704, x + 11, 716) + 'Z', flip > 0 ? P.red : P.teal), sh(rect(x - 14, 728, 28, 14, 5), flip > 0 ? '#f4f1ea' : P.teal));
  }
  scene(sh(rect(x0, 736, 270, 8), '#2a3646'));
}
// front wall of the stands with bunting
scene(sh(rect(0, 742, W, 48), '#26395f'), sh(rect(0, 742, W, 6), '#3a5280'), sh(rect(0, 782, W, 8), '#18253f'));
scene(place(bunting(600, 10, 22, [P.red, '#f6ecd6', P.navy, '#f2cf3a']), { x: 0, y: 748 }), place(bunting(600, 10, 22, ['#f2cf3a', P.red, '#f6ecd6', '#3a5280']), { x: 600, y: 748 }));
scene(stroke(line([[0, 742], [W, 742]]), '#b8c0c8', 4));

// =====================================================================
// the stands: rows of fans seen from behind
// =====================================================================
scene(sh(rect(0, 790, W, 710), '#cfc8bb'));
const rows: [number, number][] = [[852, 70], [938, 84], [1038, 98], [1152, 114], [1290, 132]];
const aisles: [number, number][] = [[210, 270], [880, 950]];
const g = rng(2026);
const shirts = [P.red, P.red, P.navy, '#f4f1ea', P.teal, '#f2cf3a', '#7fa8d8', P.red, '#9b6fb0', P.navy, '#e57a2e'];
const seatCol = '#2f5f8f';
for (let r = 0; r < rows.length; r++) {
  const [y, s] = rows[r];
  // concrete step
  scene(sh(rect(0, y + 0.1 * s, W, rows[r + 1] ? rows[r + 1][0] - y : 300), mix('#d8d2c4', '#c4bcae', r / 5)), sh(rect(0, y + 0.1 * s, W, 4), '#b0a898'));
  // aisle steps and rail
  for (const [a0, a1] of aisles) {
    scene(sh(rect(a0, y - 0.9 * s, a1 - a0, s), '#bdb5a6'), sh(rect(a0, y + 0.06 * s, a1 - a0, 5), '#f2cf3a'));
  }
  const step = s * 1.04;
  for (let x = s * 0.55; x < W; x += step) {
    if (aisles.some(([a0, a1]) => x > a0 - s * 0.45 && x < a1 + s * 0.45)) continue;
    const empty = g.next() < 0.2;
    const shapes: Shape[] = [];
    if (!empty) {
      const shirt = g.pick(shirts);
      const num = shirt === P.red && g.next() < 0.5 ? String(g.int(1, 49)) : undefined;
      shapes.push(...place(fanBack(s, shirt, g.pick(HAIR), { skin: g.pick(SKIN), hat: g.next() < 0.4 ? g.pick([P.red, P.navy, '#f4f1ea', P.teal]) : undefined, long: g.next() < 0.3, arms: g.next() < 0.12 ? 2 : 0, num, numCol: '#f6ecd6' }), { x, y }));
    }
    shapes.push(ol(rect(x - s * 0.44, y - s * 0.3, s * 0.88, s * 0.42, s * 0.08), seatCol, 1, -0.3), sh(rect(x - s * 0.4, y - s * 0.28, s * 0.8, s * 0.06, s * 0.03), shade(seatCol, 0.2)));
    shapes.push(sh(rect(x - s * 0.04, y - s * 0.2, s * 0.08, s * 0.05, 2), '#d8d4c8'));
    scene(shapes);
  }
  // aisle rail
  for (const [a0, a1] of aisles) scene(stroke(line([[(a0 + a1) / 2, y - 0.6 * s], [(a0 + a1) / 2, y + 0.1 * s]]), '#9aa2a8', 4), sh(circle((a0 + a1) / 2, y - 0.6 * s, 4), '#b8c0c8'));
}
// a handrail running down each aisle
for (const [a0, a1] of aisles) scene(stroke(line([[(a0 + a1) / 2, 800], [(a0 + a1) / 2, 1380]]), '#b8c0c8', 5), stroke(line([[(a0 + a1) / 2 + 2, 800], [(a0 + a1) / 2 + 2, 1380]]), '#ffffff', 1.4, { opacity: 0.6 }));

// cheering details held up in the crowd
scene(place(pennant(70, P.red, '#f6ecd6'), { x: 520, y: 760, rot: -12 }));
scene(place(pennant(66, P.navy, '#f2cf3a'), { x: 1050, y: 770, rot: 8 }));
scene(place(pennant(80, P.red, P.navy), { x: 330, y: 862, rot: -18 }));
target('foam-finger', 'Foam finger', place(foamFinger(96), { x: 150, y: 948, rot: -8 }));
target('pennant', 'Yellow pennant', place(pennant(96, '#f2cf3a', P.navy), { x: 690, y: 948, rot: -14 }));
target('cotton-candy', 'Cotton candy', place(cottonCandy(84), { x: 1010, y: 902, rot: 10 }));

// vendors in the aisles
scene(place(vendor(260, '#f2cf3a', P.red, SKIN[2], HAIR[0], 'popcorn'), { x: 240, y: 1052 }));
scene(place(vendor(330, P.red, '#f4f1ea', SKIN[0], HAIR[3], 'hotdog'), { x: 915, y: 1300 }));

// things resting on seat backs
target('peanuts', 'Bag of peanuts', place(peanutBag(58), { x: 560, y: 1010 }));
target('baseball', 'Baseball', place(baseball(18), { x: 772, y: 894 }));
target('cap', 'Baseball cap', place(cap(66, P.navy, shade(P.navy, -0.2), '#f2cf3a'), { x: 1080, y: 1116, rot: -6 }));
target('mitt', 'Baseball mitt', place(mitt(90), { x: 430, y: 1222, rot: -12 }));
target('sunglasses', 'Sunglasses', place(sunglasses(70), { x: 700, y: 1108 }));

// =====================================================================
// foreground ledge with snacks
// =====================================================================
scene(sh(rect(0, 1372, W, 128), '#b5ad9e'), sh(rect(0, 1372, W, 36), '#d8d2c4'), sh(rect(0, 1372, W, 4), '#ece7dc'), sh(rect(0, 1406, W, 4), '#9c9484'));
{
  let cracks = '';
  const g2 = rng(77);
  for (let i = 0; i < 9; i++) { const x = g2.range(20, 1180); cracks += line([[x, 1420], [x + g2.range(-20, 20), 1450], [x + g2.range(-30, 30), 1490]]); }
  scene(stroke(cracks, '#a29a8a', 1.2, { opacity: 0.6 }));
  // cup holders
  for (const x of [380, 660, 940]) scene(sh(ellipse(x, 1392, 36, 9), '#6c6458'), sh(ellipse(x, 1390, 30, 6), '#4a443c'));
  // ticket stubs and napkins scattered
  scene(sh(poly([[300, 1450], [352, 1442], [356, 1468], [304, 1476]]), '#f6ecd6'), sh(poly([[300, 1450], [312, 1448], [316, 1474], [304, 1476]]), P.red), stroke(line([[318, 1452], [350, 1447]]) + line([[320, 1460], [345, 1456]]), '#9a8a70', 1.5));
  scene(sh(poly([[1110, 1440], [1170, 1436], [1174, 1480], [1112, 1486]]), '#fbfbf8'), stroke(line([[1118, 1452], [1160, 1448]]), '#d8d4c8', 1.5));
}
target('pretzel', 'Pretzel', place(pretzel(84), { x: 116, y: 1404 }));
target('hot-dog', 'Hot dog', place(hotDog(120), { x: 250, y: 1404 }));
target('soda', 'Teal soda cup', place(sodaCup(78), { x: 380, y: 1396 }));
target('popcorn', 'Popcorn', place(popcornBox(96), { x: 520, y: 1404 }));
scene(place(sodaCup(70, P.red), { x: 660, y: 1394 }));
target('scorecard', 'Scorecard', place(clipboard(100), { x: 800, y: 1440, rot: -8 }));
target('binoculars', 'Binoculars', place(binoculars(96), { x: 1030, y: 1430 }));
target('bat', 'Baseball bat', place(bat(260, '#b98552'), { x: 860, y: 1360, rot: -64 }));
scene(shadow(600, 1495, 600, 8, 0.12));

const a: FindActivity = {
  id: 'sports-find-1', version: 2, mode: 'find', title: 'Ballpark Afternoon', blurb: 'A sunny afternoon in the stands, with the whole diamond spread out below and snacks on every seat.',
  collectionId: 'sports', categories: ["Sports"], difficulty: 'Relaxed',
  width: 1200, height: 1500, defs,
  items,
};
export default a;
