import { rect, ellipse, circle, poly, line, curve, leaf, star, sh, stroke, place, shade, rng, xf, linearGradient } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { FindActivity, FindItem } from '../types';
import {
  M, L, Q, ol, shadow, P, planks, floor, stripes, edging, plate, mug, jug, tin, basket, sack, crate, pile, flowerVase,
  baguette, bloomer, cob, plait, bun, tart, eclair, danish, cake, cakeStand, biscuit, biscuitJarBack, biscuitJarFront,
  cupcake, pretzel, croissant, doughnut, cookieCutter, gingerbread, strawberry, shopBell, coin, spectacles, umbrella, teaspoon, macaron, cakeSlice, milkBottle,
} from './props-find';

const ID = 'kitchen-find-2';
const W = 1200, H = 1500;
const items: FindItem[] = [];
const scene = (...s: (Shape | Shape[])[]) => { items.push({ shapes: s.flat() }); };
const target = (id: string, name: string, shapes: Shape[]) => { items.push({ id, name, target: true, shapes }); };

const defs =
  linearGradient(`${ID}-street`, [[0, '#a9cdea'], [1, '#e6f0f2']]) +
  linearGradient(`${ID}-marble`, [[0, '#f7f2e6'], [1, '#e6ddca']]) +
  linearGradient(`${ID}-case`, [[0, '#fbf6ea'], [1, '#efe4cc']]);

function pendant(x: number, len: number, col: string): Shape[] {
  return [stroke(line([[x, 30], [x, 30 + len]]), '#3b2f2a', 1.6), sh(circle(x, 30 + len + 34, 13), '#fff3bf', { opacity: 0.9 }), ol(M(x - 10, 30 + len) + L(x + 10, 30 + len) + L(x + 40, 30 + len + 32) + Q(x, 30 + len + 40, x - 40, 30 + len + 32) + 'Z', col, 1), sh(rect(x - 6, 22 + len, 12, 10, 2), '#3b2f2a')];
}
/** Vintage cash register, origin bottom centre. */
function till(w: number, h: number): Shape[] {
  const c = '#c9a24a', r = P.tomato;
  let keys = '';
  for (let row = 0; row < 3; row++) for (let i = 0; i < 6; i++) keys += circle(-w * 0.34 + i * w * 0.13, -h * 0.5 - row * h * 0.1, w * 0.035);
  return [
    shadow(0, 0, w * 0.6, h * 0.05), ol(rect(-w / 2, -h * 0.22, w, h * 0.22, 4), shade(c, -0.15), 1.2, -0.35), sh(rect(-w * 0.12, -h * 0.14, w * 0.24, h * 0.04, 2), '#3b2f2a'),
    ol(poly([[-w * 0.46, -h * 0.22], [w * 0.46, -h * 0.22], [w * 0.4, -h * 0.76], [-w * 0.4, -h * 0.76]]), c, 1.2, -0.35), sh(poly([[-w * 0.42, -h * 0.4], [w * 0.42, -h * 0.4], [w * 0.4, -h * 0.74], [-w * 0.4, -h * 0.74]]), r),
    sh(keys, '#fbf6e8'), stroke(keys, '#3b2f2a', 0.8), ol(rect(-w * 0.3, -h * 1.0, w * 0.6, h * 0.26, 4), c, 1.2, -0.35), sh(rect(-w * 0.22, -h * 0.95, w * 0.44, h * 0.14, 2), '#fbf6e8'),
    stroke(line([[-w * 0.16, -h * 0.88], [w * 0.1, -h * 0.88]]), '#3b2f2a', 1.4), stroke(M(w * 0.46, -h * 0.4) + L(w * 0.62, -h * 0.4) + L(w * 0.62, -h * 0.56), shade(c, -0.3), 4), ol(circle(w * 0.62, -h * 0.6, w * 0.04), '#3b2f2a', 1),
    stroke(xf(curve([[-w * 0.3, -h * 0.3], [-w * 0.1, -h * 0.34], [w * 0.1, -h * 0.28], [w * 0.3, -h * 0.32]]), {}), shade(c, -0.35), 1.2),
  ];
}
/** Three-tier cake stand, origin at foot. Returns the stand; tier tops at -h1,-h2,-h3. */
function tierStand(ws: number[], hs: number[], col: string): Shape[] {
  const out: Shape[] = [sh(rect(-3, -hs[2] - 16, 6, hs[2] + 16), '#c9a24a'), sh(circle(0, -hs[2] - 20, 6), '#c9a24a'), sh(ellipse(0, 0, ws[0] * 0.2, 5), shade(col, -0.2))];
  ws.forEach((w, i) => out.push(ol(ellipse(0, -hs[i], w / 2, w * 0.07), col, 1, -0.2), sh(ellipse(0, -hs[i] + w * 0.03, w / 2, w * 0.04), shade(col, -0.15))));
  return out;
}
function petitFour(s: number, col: string): Shape[] {
  return [ol(rect(-s / 2, -s * 0.8, s, s * 0.8, 2), col, 0.8), sh(rect(-s / 2, -s * 0.8, s, s * 0.2, 2), '#fbf6e8'), sh(circle(0, -s * 0.86, s * 0.12), '#c8283a')];
}

// =====================================================================
// back wall, cornice, chalkboard and lamps
// =====================================================================
scene(stripes(0, 0, 966, 840, 26, '#f3ecd8', '#cfdcc0'));
scene(planks(0, 0, W, 30, 1, '#6f8a62', 3), sh(rect(0, 28, W, 8), '#4f6a48'), sh(rect(0, 36, W, 6), '#3b2a1c', { opacity: 0.15 }));
{
  let dent = '';
  for (let x = 4; x < W; x += 20) dent += rect(x, 6, 10, 14);
  scene(sh(dent, '#8fa880'));
}
// chalkboard with doodles (no writing)
{
  scene(sh(rect(42, 70, 388, 276, 6), '#8a5a34'), sh(rect(42, 70, 388, 8, 4), '#b98552'), sh(rect(58, 86, 356, 244), '#2f3f3a'), sh(rect(58, 86, 356, 244), '#ffffff', { opacity: 0.03 }));
  const ch = '#f2efe6';
  // loaf
  scene(stroke(M(90, 170) + Q(88, 120, 140, 118) + L(190, 118) + Q(240, 120, 238, 170) + 'Z' + curve([[120, 128], [128, 146], [122, 164]]) + curve([[150, 124], [158, 146], [152, 166]]) + curve([[182, 124], [190, 146], [184, 166]]), ch, 2));
  // wheat
  let wh = line([[290, 180], [300, 100]]);
  for (let i = 0; i < 5; i++) wh += M(296 - i * 0, 160 - i * 14) + Q(284, 150 - i * 14, 282, 140 - i * 14) + M(296, 160 - i * 14) + Q(310, 152 - i * 14, 312, 142 - i * 14);
  scene(stroke(wh, '#f3d77a', 2));
  // cake slice and cup
  scene(stroke(poly([[330, 160], [390, 150], [390, 120]]) + line([[330, 160], [390, 120]]) + line([[350, 146], [390, 140]]), '#f4b8c8', 2), stroke(M(320, 220) + L(320, 270) + Q(320, 290, 345, 290) + Q(370, 290, 370, 270) + L(370, 220) + 'Z' + M(370, 236) + Q(392, 236, 388, 256) + Q(384, 270, 370, 268) + curve([[336, 210], [330, 196], [340, 184]]) + curve([[354, 210], [348, 196], [358, 184]]), ch, 2));
  // squiggle 'menu' lines and stars
  let sq = '';
  for (let i = 0; i < 5; i++) { const y = 206 + i * 22, x0 = 84, x1 = 270 - (i % 2) * 40; sq += curve([[x0, y], [x0 + 20, y - 5], [x0 + 40, y + 2], [x0 + 60, y - 4], [x0 + 80, y + 1]]) + line([[x0 + 96, y], [x1, y]]); }
  scene(stroke(sq, ch, 1.8, { opacity: 0.9 }), stroke(star(270, 106, 9, 4, 5) + star(80, 104, 7, 3, 5) + star(398, 312, 7, 3, 5), '#f3d77a', 1.6), stroke(rect(68, 96, 336, 224, 4), ch, 1, { opacity: 0.5 }));
  scene(sh(rect(36, 340, 400, 12, 3), '#8a5a34'), sh(rect(100, 333, 30, 7, 2) + rect(150, 334, 22, 6, 2), '#fbf6e8'), sh(rect(190, 334, 24, 6, 2), '#f4b8c8'), sh(rect(116, 324, 40, 10, 3), '#c99a6a'));
  target('spectacles', 'Spectacles', place(spectacles(70, '#4a3a2e'), { x: 356, y: 324, rot: -4 }));
}
scene(pendant(560, 70, P.sage), pendant(820, 70, P.sage));
// biscuit jar shelf
{
  scene(sh(rect(448, 330, 512, 14, 2), '#8a5a34'), sh(rect(448, 330, 512, 4, 2), '#b98552'), sh(poly([[470, 344], [490, 344], [470, 372]]) + poly([[938, 344], [918, 344], [938, 372]]), '#7a5232'));
  const g = rng(5);
  const jarAt = (x: number, w: number, h: number, knob: string, fill: (cx: number) => Shape[]) => { scene(place(biscuitJarBack(w, h), { x, y: 330 }), fill(x), place(biscuitJarFront(w, h, knob), { x, y: 330 })); };
  jarAt(500, 78, 104, P.tomato, (cx) => { const o: Shape[] = []; for (let i = 0; i < 7; i++) o.push(...place(biscuit(14, '#d9a860'), { x: cx - 22 + (i % 3) * 22 + g.range(-3, 3), y: 316 - Math.floor(i / 3) * 24 })); return o; });
  target('gingerbread-man', 'Gingerbread man', place(gingerbread(70), { x: 566, y: 300, rot: 8 }));
  jarAt(632, 72, 96, P.cornflower, (cx) => { const o: Shape[] = []; for (let i = 0; i < 8; i++) o.push(ol(rect(cx - 28 + (i % 2) * 28, 316 - Math.floor(i / 2) * 18, 26, 14, 2), i % 3 ? '#f4b8c8' : '#f3d77a', 0.8)); return o; });
  jarAt(724, 80, 108, '#9cb48a', (cx) => { const o: Shape[] = []; for (let i = 0; i < 7; i++) o.push(...place(biscuit(14, '#c98a42', '#fbf3df'), { x: cx - 22 + (i % 3) * 22, y: 316 - Math.floor(i / 3) * 24 })); return o; });
  jarAt(812, 70, 90, '#e3a83a', (cx) => { const o: Shape[] = []; for (let i = 0; i < 6; i++) o.push(ol(star(cx - 16 + (i % 2) * 32, 316 - Math.floor(i / 2) * 22, 13, 6, 5), '#e8b86a', 0.8)); return o; });
  scene(place(tin(56, 60, P.tomato, '#fbf3df'), { x: 882, y: 330 }), place(tin(48, 40, P.cornflower, '#f3d77a'), { x: 882, y: 270 }), place(jug(56, '#fbf6e8', P.sage), { x: 934, y: 330 }));
}

// =====================================================================
// bread racks
// =====================================================================
scene(planks(30, 360, 930, 470, 12, '#c99a62', 7, true), sh(rect(30, 360, 930, 16), '#7a5232'), sh(rect(30, 376, 930, 10), '#3b2a1c', { opacity: 0.15 }), sh(rect(22, 360, 18, 470) + rect(950, 360, 18, 470), '#8a5a34'));
for (const y of [508, 660, 800]) scene(sh(rect(30, y, 930, 16), '#8a5a34'), sh(rect(30, y, 930, 4), '#b98552'), edging(30, y + 16, 930, 18, '#fbf6e8', P.tomato));
{
  // top shelf
  const bs: Shape[] = [];
  for (let i = 0; i < 6; i++) bs.push(...place(baguette(150, i % 2 ? '#d9a050' : '#cf9648'), { x: 68 + i * 12, y: 430, rot: 90 + (i - 2.5) * 5 }));
  scene(bs, place(basket(96, 56, '#b98b5a'), { x: 96, y: 454 }));
  scene(place(bloomer(124), { x: 210, y: 508 }), place(cob(46), { x: 330, y: 508 }), place(plait(130), { x: 452, y: 508 }), place(cob(42, '#a8682e'), { x: 572, y: 508 }), place(bloomer(116, '#b97a3a'), { x: 690, y: 508 }));
  scene(place(baguette(150), { x: 840, y: 496 }), place(baguette(150, '#cf9648'), { x: 846, y: 482 }), place(baguette(146), { x: 836, y: 468 }), place(cob(36), { x: 930, y: 508 }));
  // middle shelf
  scene(place(plait(120, '#c27a32'), { x: 100, y: 660 }), place(plait(110), { x: 228, y: 660 }));
  target('pretzel', 'Pretzel', place(pretzel(76), { x: 330, y: 618, rot: -6 }));
  scene(place(plait(112, '#b9702e'), { x: 436, y: 660 }), place(cob(44), { x: 552, y: 660 }), place(bloomer(116), { x: 668, y: 660 }));
  { const o: Shape[] = []; for (let i = 0; i < 5; i++) o.push(...place(bun(18, '#d9a060', '#e8c07a'), { x: 772 + i * 26, y: 646 - (i % 2) * 6 })); scene(o, place(basket(140, 34, '#b98b5a'), { x: 820, y: 640 })); }
  scene(place(cob(34, '#a8682e'), { x: 920, y: 660 }));
  // bottom shelf: rolls and seeded loaves
  { const o: Shape[] = []; for (let i = 0; i < 6; i++) o.push(...place(bun(17, '#c98a42', '#d9a060'), { x: 60 + i * 24, y: 786 - (i % 2) * 5 })); scene(o, place(basket(160, 30, '#b98b5a'), { x: 120, y: 782 })); }
  scene(place(bloomer(110, '#a8682e'), { x: 290, y: 800 }), place(cob(40), { x: 400, y: 800 }), place(plait(110), { x: 520, y: 800 }), place(bloomer(110), { x: 650, y: 800 }), place(cob(40, '#a8682e'), { x: 770, y: 800 }), place(cob(38), { x: 860, y: 800 }), place(cob(30), { x: 924, y: 800 }));
}

// =====================================================================
// shop door
// =====================================================================
{
  scene(sh(rect(966, 40, 234, 1220), '#4f6f52'), sh(rect(966, 40, 10, 1220), '#3f5a42'), sh(rect(990, 84, 184, 560), `url(#${ID}-street)`));
  // the street outside
  const g = rng(9);
  let bricks = '';
  for (let r = 0; r < 18; r++) for (let c = 0; c < 6; c++) bricks += rect(990 + c * 34 + (r % 2) * 17 - 17, 250 + r * 16, 32, 14, 1);
  scene(sh(rect(990, 240, 184, 404), '#c98a6a'), sh(bricks, '#b8735a'), sh(rect(1010, 300, 70, 110) + rect(1100, 300, 70, 110), '#3f5a6a'), stroke(rect(1010, 300, 70, 110) + rect(1100, 300, 70, 110) + line([[1045, 300], [1045, 410]]) + line([[1135, 300], [1135, 410]]), '#fbf6e8', 4));
  let aw = '';
  for (let i = 0; i < 6; i++) aw += poly([[990 + i * 32, 440], [1006 + i * 32, 440], [1012 + i * 32, 490], [996 + i * 32, 490]]);
  scene(sh(poly([[990, 440], [1174, 440], [1174, 490], [990, 490]]), '#fbf6e8'), sh(aw, P.cornflower), sh(rect(990, 560, 184, 84), '#a8a8a0'), sh(rect(990, 600, 184, 44), '#8a8a84'));
  let fl = '';
  for (let i = 0; i < 12; i++) fl += circle(1014 + g.range(0, 60), 412 + g.range(-8, 4), 4) + circle(1104 + g.range(0, 60), 412 + g.range(-8, 4), 4);
  scene(sh(rect(1010, 410, 70, 14) + rect(1100, 410, 70, 14), '#6f4a2f'), sh(fl, P.tomato), sh(ellipse(1050, 140, 30, 10) + ellipse(1120, 180, 26, 8), '#ffffff', { opacity: 0.85 }));
  scene(stroke(rect(990, 84, 184, 560) + line([[1082, 84], [1082, 644]]) + line([[990, 270], [1174, 270]]) + line([[990, 456], [1174, 456]]), '#4f6f52', 8), sh(poly([[1000, 100], [1040, 100], [1000, 160]]), '#ffffff', { opacity: 0.3 }));
  // hanging sign on the glass
  scene(stroke(line([[1050, 470], [1082, 450]]) + line([[1114, 470], [1082, 450]]), '#3b2f2a', 1.4), ol(ellipse(1082, 500, 44, 30), '#fbf6e8', 1.2, -0.4), stroke(M(1060, 510) + Q(1058, 486, 1076, 486) + L(1088, 486) + Q(1106, 486, 1104, 510) + 'Z', '#8a5a34', 2));
  scene(ol(rect(990, 668, 184, 250, 4) + rect(990, 936, 184, 290, 4), '#5c7f5e', 1.4, -0.35), stroke(rect(1006, 684, 152, 218, 3) + rect(1006, 952, 152, 258, 3), '#3f5a42', 2), sh(rect(984, 700, 12, 60, 4), '#c9a24a'), sh(circle(990, 776, 7), '#c9a24a'), sh(rect(990, 1200, 184, 20), '#c9a24a'));
  target('shop-bell', 'Shop bell', place(shopBell(70), { x: 990, y: 50 }));
}

// =====================================================================
// counter: marble top, display case, panelled front
// =====================================================================
scene(sh(rect(20, 836, 940, 420), '#a8743e'));
{
  // display case
  scene(sh(rect(30, 846, 612, 250), `url(#${ID}-case)`), sh(rect(30, 846, 612, 250), '#cfe2e8', { opacity: 0.2 }), sh(rect(30, 966, 612, 8), '#dfeaea'), sh(rect(30, 1080, 612, 16), '#e6ddca'));
  const g = rng(31);
  // upper glass shelf: danish, eclairs, iced buns and the doughnut
  scene(place(danish(26), { x: 76, y: 948 }), place(danish(26), { x: 132, y: 950 }), place(eclair(70), { x: 214, y: 960 }), place(eclair(70), { x: 222, y: 944 }));
  { const o: Shape[] = []; for (let i = 0; i < 4; i++) o.push(...place(bun(22, '#d9a060', i % 2 ? '#f4b8c8' : '#fbf3df'), { x: 300 + i * 46, y: 964 })); scene(o); }
  target('doughnut', 'Doughnut', place(doughnut(62, '#f4b0c4'), { x: 494, y: 944 }));
  scene(place(danish(26), { x: 570, y: 950 }), place(tart(24, '#c8283a', 1), { x: 612, y: 950 }));
  // lower shelf: tarts, cupcake, cake slice and a stray strawberry
  scene(place(tart(30, '#c8283a', 2), { x: 74, y: 1060 }), place(tart(30, '#6b3f86', 3), { x: 146, y: 1064 }));
  target('strawberry', 'Strawberry', place(strawberry(40), { x: 196, y: 1040, rot: -20 }));
  scene(place(tart(30, '#d8452f', 4), { x: 250, y: 1062 }));
  target('cupcake', 'Cupcake', place(cupcake(60, '#f3d77a', '#f4b8c8'), { x: 326, y: 1080 }));
  scene(place(tart(30, '#e8a03a', 5), { x: 404, y: 1060 }), ol(ellipse(486, 1070, 56, 13), '#fbf6e8', 1, -0.25));
  target('cake-slice', 'Cake slice', place(cakeSlice(80), { x: 486, y: 1068 }));
  scene(place(tart(28, '#c8283a', 6), { x: 576, y: 1062 }));
  // blank price cards
  let cards = '';
  for (const [x, y] of [[100, 958], [220, 966], [330, 970], [590, 960], [110, 1074], [260, 1076], [410, 1074], [600, 1074]] as [number, number][]) cards += rect(x - 12, y, 24, 14, 2);
  scene(sh(cards, '#fbf6e8', { stroke: '#a89a80', strokeWidth: 0.8 }));
  void g;
  // glass front glints and frame
  scene(stroke(line([[60, 1090], [120, 856]]) + line([[84, 1090], [140, 870]]) + line([[420, 1090], [470, 896]]), '#ffffff', 3, { opacity: 0.35 }), stroke(rect(30, 846, 612, 250), '#7a5232', 8), sh(rect(30, 1096, 612, 14), '#7a5232'));
  // panelled base and right counter front
  scene(planks(30, 1110, 612, 140, 6, '#b98552', 41, true), ol(rect(652, 852, 296, 392, 4), '#b98552', 1.4, -0.35), stroke(rect(672, 872, 118, 352, 3) + rect(810, 872, 118, 352, 3), '#8a5a34', 3), sh(rect(20, 1246, 940, 12), '#5a3a22'));
  let flute = '';
  for (let i = 0; i < 5; i++) flute += line([[688 + i * 22, 900], [688 + i * 22, 1196]]) + line([[826 + i * 22, 900], [826 + i * 22, 1196]]);
  scene(stroke(flute, '#9a6a3a', 3));
  // marble top
  scene(sh(rect(14, 818, 952, 22, 3), `url(#${ID}-marble)`), stroke(curve([[60, 822], [160, 830], [240, 824]]) + curve([[400, 834], [520, 826], [620, 832]]) + curve([[720, 824], [820, 834], [920, 826]]), '#c9c0b0', 1), sh(rect(14, 838, 952, 6), '#3b2a1c', { opacity: 0.2 }));
}
// little bunting along the marble edge
{
  const cols = [P.tomato, '#f3d77a', P.cornflower, '#fbf6e8', P.sage];
  const o: Shape[] = [];
  for (let i = 0; i < 18; i++) { const x = 664 + i * 16; o.push(sh(poly([[x, 846], [x + 14, 846], [x + 7, 864]]), cols[i % 5])); }
  scene(stroke(line([[660, 846], [952, 846]]), '#7a5232', 1.2), o);
}
// on the counter
{
  scene(place(cakeStand(130, 36, '#fbf6e8'), { x: 98, y: 820 }), place(cake(104, 62, '#f2d18a', '#fbf6e8', '#c8283a'), { x: 98, y: 786 }));
  // tiered stand of petit fours with the macaron
  scene(place(tierStand([150, 116, 80], [12, 62, 108], '#fbf6e8'), { x: 260, y: 820 }));
  const pf = ['#f4b8c8', '#cfe0b0', '#f3d77a', '#c9d8f0'];
  scene(...[0, 1, 2, 3, 4].map((i) => place(petitFour(20, pf[i % 4]), { x: 206 + i * 27, y: 808 })), ...[0, 1, 2].map((i) => place(petitFour(18, pf[(i + 1) % 4]), { x: 230 + i * 30, y: 758 })), place(petitFour(18, pf[2]), { x: 260, y: 712 }));
  target('macaron', 'Macaron', place(macaron(36, '#a9c98a'), { x: 294, y: 752 }));
  // glass dome over a chocolate cake
  scene(place(cakeStand(120, 20, '#e6ddca'), { x: 424, y: 820 }), place(cake(90, 56, '#6b3f2a', '#5a3420', '#f3d77a'), { x: 424, y: 802 }), sh(M(366, 800) + Q(366, 690, 424, 690) + Q(482, 690, 482, 800) + 'Z', '#dfeef2', { opacity: 0.3 }), stroke(M(366, 800) + Q(366, 690, 424, 690) + Q(482, 690, 482, 800), '#a9c0c4', 1.6), sh(circle(424, 684, 8), '#c9a24a'), stroke(curve([[378, 780], [376, 730], [400, 704]]), '#ffffff', 3, { opacity: 0.7 }));
  // paper bag and the croissant on a napkin
  scene(ol(poly([[516, 820], [590, 820], [584, 730], [522, 730]]), '#c9a070', 1, -0.3), sh(poly([[522, 730], [584, 730], [578, 716], [528, 716]]), '#b89060'), stroke(line([[530, 744], [576, 744]]), '#a8804a', 1.2));
  scene(sh(poly([[540, 820], [640, 820], [630, 806], [550, 804]]), '#fbf6e8'), stroke(line([[552, 812], [628, 812]]), P.cornflower, 1.4));
  target('croissant', 'Croissant', place(croissant(76), { x: 594, y: 780 }));
  scene(place(flowerVase(80, 4, P.cornflower, ['#fbf6e8', '#f4b8c8', '#f3d77a']), { x: 668, y: 820 }));
  scene(place(till(150, 136), { x: 780, y: 820 }));
  target('coin', 'Coin', place(coin(14), { x: 872, y: 812 }));
  scene(sh(ellipse(916, 816, 44, 8), '#c9d0d5'), sh(ellipse(916, 813, 40, 6), '#e6eaec'));
  { const o: Shape[] = []; const g = rng(55); for (let i = 0; i < 4; i++) o.push(ol(star(890 + i * 18, 808 - (i % 2) * 5, 11, 5, 5, -90 + g.range(-20, 20)), '#e0b06a', 0.8)); scene(o); }
  target('cookie-cutter', 'Cookie cutter', place(cookieCutter(40), { x: 930, y: 790, rot: 12 }));
  scene(place(mug(30, '#fbf6e8', P.sage), { x: 870, y: 780 }).map((p) => p));
}

// =====================================================================
// shop floor and foreground
// =====================================================================
scene(floor(1258, 1500, W, 600, 700, 20, '#a9bf98', '#f3ecd8', 77));
scene(sh(rect(984, 1270, 200, 46, 4), '#b8925a'), stroke(rect(992, 1276, 184, 34, 3), '#8a6a3a', 3), stroke(line([[1000, 1284], [1170, 1284]]) + line([[1000, 1294], [1170, 1294]]) + line([[1000, 1304], [1170, 1304]]), '#c9a878', 1.4));
// cafe table and bentwood chair
{
  const x = 200;
  scene(stroke(M(64, 1480) + L(80, 1330) + M(140, 1480) + L(130, 1330), '#3b2f2a', 6), stroke(M(70, 1330) + Q(60, 1220, 106, 1214) + Q(150, 1220, 142, 1330), '#3b2f2a', 6), stroke(ellipse(106, 1270, 28, 40), '#3b2f2a', 3), sh(ellipse(108, 1336, 52, 12), '#5a3a2a'));
  scene(shadow(x, 1488, 110, 12), stroke(line([[x, 1350], [x, 1480]]), '#3b2f2a', 9), stroke(M(x - 60, 1488) + Q(x, 1464, x + 60, 1488), '#3b2f2a', 7), sh(ellipse(x, 1350, 150, 34), '#e6ddca'), sh(ellipse(x, 1344, 150, 32), `url(#${ID}-marble)`), stroke(ellipse(x, 1344, 150, 32), '#c9c0b0', 1.4), stroke(curve([[x - 110, 1340], [x - 40, 1350], [x + 20, 1336]]), '#d2c8b6', 1));
  scene(ol(ellipse(x - 60, 1346, 44, 10), '#fbf6e8', 1, -0.25), place(tart(26, '#6b3f86', 12), { x: x - 60, y: 1336 }));
  scene(ol(ellipse(x + 50, 1346, 34, 8), '#fbf6e8', 1, -0.25), stroke(ellipse(x + 80, 1322, 7, 8), '#fbf6e8', 3), ol(M(x + 30, 1312) + Q(x + 32, 1342, x + 50, 1342) + Q(x + 70, 1342, x + 72, 1312) + 'Z', '#fbf6e8', 1, -0.25), sh(ellipse(x + 51, 1312, 20, 4), '#8a5a34'));
  target('teaspoon', 'Teaspoon', place(teaspoon(56), { x: x + 100, y: 1352, rot: -12 }));
  scene(place(flowerVase(46, 2, '#fbf6e8', [P.tomato, '#f3d77a']), { x: x - 4, y: 1338 }));
}
// umbrella against the counter, baskets, sacks, crates and the milk
// cake boxes stacked against the counter
{
  const box = (x: number, y: number, w: number, h: number, c: string): Shape[] => { let st = ''; for (let i = 0; i < w; i += 16) st += rect(x - w / 2 + i, y - h, 8, h); return [sh(rect(x - w / 2, y - h, w, h, 2), '#fbf6e8'), sh(st, c, { opacity: 0.7 }), sh(rect(x - w / 2 - 3, y - h - 8, w + 6, 10, 2), shade(c, -0.1)), stroke(line([[x, y - h - 8], [x, y]]), P.tomato, 2)]; };
  scene(box(800, 1262, 130, 70, '#f4b8c8'), box(796, 1182, 112, 62, '#c9d8f0'), box(804, 1110, 92, 54, '#cfe0b0'), sh(M(782, 1056) + Q(790, 1040, 804, 1052) + Q(818, 1040, 826, 1056), 'none', { stroke: P.tomato, strokeWidth: 2 }));
}
// wheat wreath and letterbox on the door
{
  const g = rng(19);
  let a = '', b = '';
  for (let i = 0; i < 30; i++) { const t = (i / 30) * Math.PI * 2, x = 1082 + Math.cos(t) * 48, y = 800 + Math.sin(t) * 48; const d = leaf(x, y, g.range(16, 24), 5, (t * 180) / Math.PI + 100 + g.range(-20, 20)); if (i % 2) a += d; else b += d; }
  scene(sh(a, '#d9b060'), sh(b, '#c09040'), stroke(M(1062, 752) + Q(1082, 740, 1102, 752), P.tomato, 4), sh(circle(1082, 754, 6), P.tomato));
  scene(ol(rect(1040, 1060, 84, 22, 3), '#c9a24a', 1.2, -0.35), sh(rect(1048, 1066, 68, 6, 2), '#8a6a2a'), ol(rect(1000, 1206, 164, 14, 2), '#c9a24a', 1, -0.3));
}
target('umbrella', 'Umbrella', place(umbrella(130, P.tomato), { x: 680, y: 1300, rot: -14 }));
{
  const bs: Shape[] = [];
  for (let i = 0; i < 7; i++) bs.push(...place(baguette(170, i % 2 ? '#d9a050' : '#cf9648'), { x: 450 + i * 12 - 36, y: 1290, rot: 90 + (i - 3) * 6 }));
  scene(bs, place(basket(120, 120, '#b98b5a'), { x: 450, y: 1330 }));
  scene(place(sack(130, 140, '#e8dcc0', P.cornflower), { x: 810, y: 1420 }), place(sack(120, 120, '#d9c9a4', P.tomato), { x: 920, y: 1446 }));
  target('milk-bottle', 'Milk bottle', place(milkBottle(84), { x: 872, y: 1482 }));
  scene(place(pile(150, 18, ['brownegg', 'egg'], 21, 2), { x: 1090, y: 1376 }), place(basket(160, 60, '#c99a5b'), { x: 1090, y: 1380 }));
  scene(place(crate(170, 60, '#a8743e'), { x: 1100, y: 1440 }));
  { const o: Shape[] = []; for (let i = 0; i < 4; i++) o.push(...place(cob(30, i % 2 ? '#b97a3a' : '#a8682e'), { x: 570 + i * 34, y: 1412 })); scene(o, place(crate(160, 68, '#c99a62'), { x: 620, y: 1412 })); }
}
void leaf; void plate; void bloomer;

const activity: FindActivity = {
  id: ID, version: 1, mode: 'find', title: 'The Corner Bakery',
  blurb: 'Warm loaves, glass jars of biscuits and a counter full of cakes hide fifteen treats and trinkets.',
  collectionId: 'kitchen', categories: ['Kitchen', 'Food', 'Cozy'], difficulty: 'Moderate',
  width: W, height: H, defs, items,
};
export default activity;
