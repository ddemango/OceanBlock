import { rect, ellipse, circle, poly, line, sh, stroke, place, shade, rng, linearGradient } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { FindActivity, FindItem } from '../types';
import {
  C, CANDY, RAINBOW, ol, hl, shadow, stripes, checker, panels, shelf, scallop, pendant, wallClock, lollipop, peppermint, candyCane, wrapped, candyJar, openJar,
  chocBox, heartBox, chocBar, brassScale, paperBag, gumballMachine, cashRegister, bell, gingerbread, candyApple, cottonCandy, gummyBear, teddy, scoop, barrel, crate, cupcake, present,
  type JarKind,
} from './props-find';

const ID = 'sweets-find-1';
const W = 1200, H = 1500;
const items: FindItem[] = [];
const scene = (...s: (Shape | Shape[])[]) => { items.push({ shapes: s.flat() }); };
const target = (id: string, name: string, shapes: Shape[]) => { items.push({ id, name, target: true, shapes }); };
const at = (s: Shape[], x: number, y: number, k = 1, rot = 0) => place(s, { x, y, s: k, rot });

const defs = linearGradient(`${ID}-top`, [[0, '#f3c7a0'], [1, '#e2a878']]) + linearGradient(`${ID}-case`, [[0, '#5a3a2a'], [1, '#3d2619']]);
const LIDS = [C.red, C.teal, C.hot, C.brass];

// =====================================================================
// wall, ceiling and valance
// =====================================================================
scene(stripes(0, 40, W, 830, 44, '#fdf0dc', '#f9d3d0', '#f3b9bd'));
scene(sh(rect(0, 0, W, 48), '#2f6b66'), sh(rect(0, 40, W, 8), '#245550'));
scene(scallop(0, 48, W, 24, 16, C.hot, C.cream));

// right wall: clock, peg rack and a shelf
target('wall-clock', 'Wall clock', at(wallClock(54, C.teal), 1010, 172));
{
  const x0 = 846, y0 = 262, w = 326, h = 250;
  scene(sh(rect(x0 + 4, y0 + 6, w, h, 6), '#000000', { opacity: 0.15 }), ol(rect(x0, y0, w, h, 6), '#f7e4c2', 1.4, -0.3), stroke(rect(x0 + 10, y0 + 10, w - 20, h - 20, 3), C.caramel, 2));
  let pegs = '';
  for (let i = 0; i < 6; i++) pegs += circle(x0 + 38 + i * 50, y0 + 34, 5);
  scene(stroke(line([[x0 + 22, y0 + 34], [x0 + w - 22, y0 + 34]]), C.woodDk, 5), sh(pegs, C.brass, { stroke: C.brassDk, strokeWidth: 1 }));
  // candy canes hooked over the rail
  [C.red, C.red, C.hot].forEach((c, i) => scene(at(candyCane(118, c), x0 + 30 + i * 52, y0 + 150 + (i % 2) * 8)));
  target('green-cane', 'Green candy cane', at(candyCane(118, C.greenDk), x0 + 186, y0 + 152));
  scene(at(candyCane(118, C.red), x0 + 238, y0 + 158), at(candyCane(110, C.teal), x0 + 286, y0 + 148, 0.9));
  // lollipops pinned below
  const lc = [[C.hot, C.white], [C.teal, C.lemon], [C.orange, C.white], [C.purple, C.pink], [C.red, C.white]];
  [0, 1, 3, 4].forEach((i) => scene(at(lollipop(20, lc[i], 40), x0 + 44 + i * 60, y0 + 238)));
  target('rainbow-lollipop', 'Rainbow lollipop', at(lollipop(24, RAINBOW, 36), x0 + 164, y0 + 238));
}
scene(shelf(836, 640, 350, 14, C.wood), sh(poly([[860, 654], [880, 654], [860, 690]]) + poly([[1140, 654], [1160, 654], [1160, 690]]), C.woodDk));
scene(at(chocBox(96, C.hot, 4), 900, 640), at(present(46, 44, C.teal, C.lemon, 'dots'), 990, 640), at(present(34, 30, C.lilac, C.white), 992, 596));
target('cotton-candy', 'Cotton candy', at(cottonCandy(96), 1060, 640));
scene(at(candyJar(58, 74, 'beans', CANDY, 91, { lid: C.brass, round: true }), 1136, 640));

// =====================================================================
// the big wall of jars
// =====================================================================
{
  const x0 = 26, x1 = 806;
  scene(sh(rect(x0, 104, x1 - x0, 760), '#3d8a84'));
  let tg = '';
  for (let x = x0 + 30; x < x1; x += 30) tg += line([[x, 110], [x, 770]]);
  scene(stroke(tg, '#33766f', 1.6));
  scene(sh(rect(x0, 116, x1 - x0, 26), '#000000', { opacity: 0.16 }));
  const rows = [270, 430, 590, 750];
  rows.forEach((y) => scene(shelf(x0, y, x1 - x0, 14, C.wood)));
  // posts and cornice
  scene(ol(rect(x0 - 10, 104, 22, 760), C.woodDk, 1.2), ol(rect(x1 - 12, 104, 22, 760), C.woodDk, 1.2), sh(rect(x0 - 6, 104, 5, 760), C.wood, { opacity: 0.7 }), sh(rect(x1 - 8, 104, 5, 760), C.wood, { opacity: 0.7 }));
  scene(ol(rect(x0 - 22, 88, x1 - x0 + 44, 26, 4), C.wood, 1.3, -0.35), sh(rect(x0 - 22, 88, x1 - x0 + 44, 7, 4), C.woodLt));
  // drawers along the bottom
  scene(panels(x0 + 12, 764, x1 - x0 - 24, 96, 6, C.wood, 10));
  let knobs = '';
  for (let i = 0; i < 6; i++) knobs += circle(x0 + 12 + (i + 0.5) * ((x1 - x0 - 24) / 6), 812, 7);
  scene(sh(knobs, C.brass, { stroke: C.brassDk, strokeWidth: 1.2 }));

  const slot = (i: number) => 86 + i * 91;
  const jar = (i: number, y: number, kind: JarKind, cols: string[], o: Parameters<typeof candyJar>[5] = {}, w = 68, h = 98) =>
    scene(at(candyJar(w, h, kind, cols, i * 7 + y, { lid: LIDS[(i + y / 10) % 4 | 0], ...o }), slot(i), y));

  // row 1
  jar(0, 270, 'balls', RAINBOW, { label: C.red });
  jar(1, 270, 'sticks', [C.hot, C.teal, C.lemon, C.purple]);
  target('teddy-bear', 'Teddy bear', at(teddy(98), slot(2), 270));
  jar(3, 270, 'beans', CANDY, { round: true }, 78, 96);
  jar(4, 270, 'mints', [C.red, C.greenDk], { label: C.greenDk });
  jar(5, 270, 'wrapped', [C.purple, C.orange, C.teal]);
  jar(6, 270, 'cubes', [C.pink, C.lemon, C.white, C.orange], {}, 68, 108);
  jar(7, 270, 'drops', [C.lemon, C.orange, C.green], { round: true }, 78, 96);
  // row 2
  jar(0, 430, 'wrapped', [C.red, C.lemon, C.sky], {}, 68, 108);
  jar(1, 430, 'drops', [C.hot, C.pink, C.cherry], { round: true }, 78, 96);
  jar(2, 430, 'balls', [C.choc, C.milk, C.cream], { label: C.choc });
  target('gingerbread-man', 'Gingerbread man', at(gingerbread(104), slot(3), 428));
  jar(4, 430, 'cubes', [C.sky, C.white, C.pink]);
  jar(5, 430, 'sticks', [C.red, C.white, C.greenDk], {}, 68, 108);
  jar(6, 430, 'beans', [C.purple, C.lilac, C.hot, C.sky], { label: C.purple });
  jar(7, 430, 'mints', [C.teal, C.blue]);
  // row 3
  target('heart-box', 'Heart-shaped chocolate box', at(heartBox(100), slot(0) + 6, 590));
  jar(1, 590, 'balls', [C.lemon, C.orange, C.red], {}, 68, 108);
  jar(2, 590, 'beans', [C.green, C.mint, C.lemon], { round: true }, 78, 96);
  jar(3, 590, 'sticks', [C.orange, C.lemon, C.hot], { label: C.orange });
  jar(4, 590, 'wrapped', [C.hot, C.teal, C.lemon]);
  scene(at(candyJar(48, 70, 'balls', [C.green, C.lemon, C.orange], 61, { lid: C.teal, size: 0.8 }), slot(5) - 18, 590), at(gummyBear(40, C.green), slot(5) + 52, 590), at(gummyBear(40, C.lemon), slot(5) + 86, 590));
  target('gummy-bear', 'Red gummy bear', at(gummyBear(46, C.red), slot(5) + 24, 590));
  jar(7, 590, 'cubes', [C.choc, C.pink, C.cream], { label: C.hot }, 68, 108);
  // row 4
  scene(at(chocBox(104, C.purple, 9), slot(0) + 8, 750));
  target('chocolate-bar', 'Chocolate bar', at(chocBar(52), slot(1) + 14, 750, 1, 6));
  jar(2, 750, 'mints', [C.hot, C.purple], { round: true }, 78, 96);
  jar(3, 750, 'drops', [C.sky, C.teal, C.mint]);
  scene(at(present(70, 40, C.lemon, C.red, 'stripes'), slot(4), 750), at(present(54, 34, C.pink, C.teal, 'dots'), slot(4) - 2, 712), at(present(36, 28, C.sky, C.hot), slot(4), 680));
  jar(5, 750, 'balls', [C.pink, C.white, C.hot], { label: C.hot });
  // open jar of lollipops
  [-18, 0, 18].forEach((dx, i) => scene(at(lollipop(15, [[C.red, C.white], [C.green, C.lemon], [C.blue, C.sky]][i], 70 + (i % 2) * 14), slot(6) + dx, 746, 1, dx * 0.6)));
  scene(at(openJar(64, 70), slot(6), 750));
  jar(7, 750, 'wrapped', [C.green, C.orange, C.purple]);
}

// pendant lamps
scene(at(pendant(54, 86, C.cream), 240, 60), at(pendant(54, 86, C.cream), 600, 60), at(pendant(30, 70, C.cream), 1150, 60));

// =====================================================================
// counter
// =====================================================================
scene(sh(rect(0, 884, W, 270), C.wood));
scene(panels(700, 890, 500, 250, 3, C.wood, 18));
[784, 950, 1116].forEach((x, i) => scene(at(i === 1 ? peppermint(34) : wrapped(74, i ? C.teal : C.hot), x, 1015)));
// glass display case in the counter front
{
  const x0 = 34, y0 = 902, w = 640, h = 226;
  scene(ol(rect(x0 - 10, y0 - 10, w + 20, h + 20, 6), C.woodDk, 1.4), sh(rect(x0, y0, w, h), `url(#${ID}-case)`));
  scene(sh(rect(x0, y0 + 108, w, 8), '#c9d6da'), sh(rect(x0, y0 + 216, w, 10), '#2a1810'));
  // upper shelf: trays of chocolates and truffles
  scene(at(chocBox(110, C.cream, 12), x0 + 74, y0 + 106), at(chocBox(110, C.teal, 17), x0 + 204, y0 + 106));
  for (let i = 0; i < 5; i++) scene(at(cupcake(46, [C.pink, C.sky, C.lemon, C.mint, C.lilac][i], [C.white, C.pink, C.choc, C.hot, C.cream][i], (['cherry', 'sprinkles', 'star', 'cherry', 'sprinkles'] as const)[i]), x0 + 310 + i * 56, y0 + 106));
  scene(sh(ellipse(x0 + 590, y0 + 102, 40, 7), C.white), at(peppermint(15), x0 + 568, y0 + 88), at(peppermint(15), x0 + 600, y0 + 90), at(peppermint(15), x0 + 584, y0 + 68));
  // lower shelf: fudge blocks, truffle pyramid, lollipops
  const g = rng(5);
  for (let j = 0; j < 3; j++) for (let i = 0; i < 4 - j; i++) scene(ol(rect(x0 + 34 + i * 44 + j * 22, y0 + 186 - j * 28, 40, 26, 4), [C.choc, C.milk, '#f3e2c4', C.pink][(i + j * 2) % 4], 1, -0.35));
  for (let j = 0; j < 4; j++) for (let i = 0; i < 4 - j; i++) scene(ol(circle(x0 + 250 + i * 30 + j * 15, y0 + 200 - j * 25, 14), [C.choc, C.milk, C.chocDk][g.int(0, 2)], 1), hl(circle(x0 + 245 + i * 30 + j * 15, y0 + 195 - j * 25, 3.5), 0.4));
  for (let i = 0; i < 6; i++) scene(at(lollipop(17, [[C.hot, C.white], [C.lemon, C.orange], [C.teal, C.white], [C.purple, C.lilac], [C.red, C.lemon], [C.green, C.white]][i], 30), x0 + 392 + i * 42, y0 + 214));
  // glass sheen and frame
  scene(sh(poly([[x0 + 60, y0], [x0 + 130, y0], [x0 + 40, y0 + h], [x0 - 30 + 30, y0 + h]]), '#ffffff', { opacity: 0.1 }), sh(poly([[x0 + 380, y0], [x0 + 420, y0], [x0 + 330, y0 + h], [x0 + 290, y0 + h]]), '#ffffff', { opacity: 0.1 }));
  scene(stroke(rect(x0, y0, w, h), C.brass, 4), stroke(line([[x0 + w / 2, y0], [x0 + w / 2, y0 + h]]), C.brass, 3));
}
scene(sh(rect(0, 1136, W, 18), C.woodDk), sh(rect(0, 1136, W, 4), '#000000', { opacity: 0.2 }));
// counter top
scene(sh(rect(0, 884, W, 12), '#000000', { opacity: 0.22 }), ol(rect(-4, 858, W + 8, 28, 4), `url(#${ID}-top)`, 1.4, -0.3), sh(rect(0, 859, W, 6), '#fbe2c4', { opacity: 0.8 }));

// on the counter
target('brass-scale', 'Brass scale', at(brassScale(132), 120, 862));
[-16, 4, 22].forEach((dx, i) => scene(at(lollipop(17, [[C.orange, C.white], [C.hot, C.lemon], [C.sky, C.white]][i], 78 + (i % 2) * 16), 250 + dx, 858, 1, dx * 0.5)));
scene(at(openJar(62, 72), 250, 862));
target('service-bell', 'Service bell', at(bell(58), 336, 862));
scene(at(paperBag(96, C.hot), 410, 862, 1, -3), at(paperBag(104, C.teal), 520, 862, 1, 3));
target('blue-bag', 'Blue striped bag', at(paperBag(112, C.blue), 464, 864));
scene(at(candyJar(96, 104, 'balls', RAINBOW, 77, { lid: C.teal, round: true, size: 1.1 }), 622, 862));
target('candy-scoop', 'Candy scoop', at(scoop(86), 724, 846, 1, -8));
scene(sh(ellipse(806, 858, 46, 8), C.white, { stroke: '#d8c8b0', strokeWidth: 1 }), at(peppermint(13), 786, 850), at(wrapped(34, C.purple), 824, 850, 1, 12));
target('candy-apple', 'Candy apple', at(candyApple(86), 808, 854));
target('cash-register', 'Cash register', at(cashRegister(150), 968, 862));
scene(at(candyJar(54, 70, 'sticks', [C.red, C.white, C.hot], 33, { lid: C.red }), 1100, 862), at(gummyBear(34, C.orange), 1150, 862), at(gummyBear(30, C.purple), 1178, 862));

// =====================================================================
// floor and foreground
// =====================================================================
scene(checker(1154, H, W, 600, 760, 150, '#f7ecd6', '#7cc0b4', 1.2));
scene(sh(rect(0, 1154, W, 16), '#000000', { opacity: 0.16 }));
// doormat
scene(ol(poly([[400, 1196], [800, 1196], [826, 1262], [374, 1262]]), C.hot, 1.4, -0.3), stroke(poly([[416, 1206], [784, 1206], [804, 1252], [396, 1252]]), C.cream, 3), sh(circle(600, 1229, 16), C.cream), ...[at(peppermint(13), 600, 1229)]);

// barrel of candy canes and lollipops
[-52, -26, 4, 34].forEach((dx, i) => scene(at(candyCane(170, i % 2 ? C.hot : C.red), 130 + dx, 1290, 1, -10 + i * 6)));
scene(at(lollipop(30, [C.teal, C.white], 110), 196, 1300, 1, 14), at(lollipop(26, [C.orange, C.lemon], 120), 90, 1296, 1, -16));
scene(at(barrel(190, 210, C.wood), 140, 1452));
// crate heaped with wrapped sweets
{
  const g = rng(21);
  for (let i = 0; i < 26; i++) scene(at(wrapped(46, CANDY[i % CANDY.length]), 330 + g.range(0, 190), 1338 + g.range(-22, 14) - Math.sin((i / 25) * Math.PI) * 6, 1, g.range(-40, 40)));
  scene(at(crate(230, 120), 425, 1470));
}
// big floor jars
scene(at(candyJar(120, 170, 'balls', CANDY, 55, { lid: C.red, size: 1.4, label: C.red }), 640, 1474), at(candyJar(96, 120, 'drops', [C.lemon, C.orange, C.hot], 58, { lid: C.teal, round: true, size: 1.3 }), 770, 1486));
scene(at(paperBag(120, C.red), 880, 1480, 1, -4), at(lollipop(22, [C.purple, C.white], 60), 866, 1400, 1, -12), at(candyCane(90, C.greenDk), 880, 1404, 1, 8));
// gumball machine on a stand
scene(shadow(1070, 1452, 70, 10), ol(poly([[1010, 1452], [1130, 1452], [1104, 1432], [1036, 1432]]), C.ink, 1.2), ol(rect(1062, 1310, 16, 124), C.chrome, 1.2, -0.4), hl(rect(1065, 1312, 4, 120), 0.6));
target('gumball-machine', 'Gumball machine', at(gumballMachine(230), 1070, 1314));
// stray sweets on the floor
scene(at(wrapped(40, C.lemon), 300, 1486, 1, 20), at(peppermint(14), 560, 1300), at(wrapped(36, C.sky), 940, 1300, 1, -25), at(gummyBear(30, C.hot), 1170, 1480));
void H;

const activity: FindActivity = {
  id: 'sweets-find-1', version: 1, mode: 'find', title: 'The Candy Store', blurb: "Walls of glass jars, a brass scale and a barrel of candy canes hide sixteen sweet-shop treasures.",
  collectionId: 'sweets', categories: ["Food", "Treats"], difficulty: 'Detailed',
  added: '2026-11-26',
  width: W, height: H, defs, items,
};
export default activity;
