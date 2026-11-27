import { rect, ellipse, circle, poly, line, curve, sh, stroke, place, shade, rng, linearGradient } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { FindActivity, FindItem } from '../types';
import {
  C, CANDY, ol, hl, shadow, stripes, checker, panels, shelf, scallop, awning, bunting, pendant, plant, candyJar, heart,
  cone, iceCreamCone, sundae, milkshake, bananaSplit, sodaFountain, popsicle, napkinDispenser, strawJar, sprinkleShaker, cherryJar, paperHat, iceCreamSandwich, iceScoop, tub,
  stool, roundTable, plate, cupcake, lemonadeGlass, cherry,
} from './props-find';

const ID = 'sweets-find-2';
const W = 1200, H = 1500;
const items: FindItem[] = [];
const scene = (...s: (Shape | Shape[])[]) => { items.push({ shapes: s.flat() }); };
const target = (id: string, name: string, shapes: Shape[]) => { items.push({ id, name, target: true, shapes }); };
const at = (s: Shape[], x: number, y: number, k = 1, rot = 0) => place(s, { x, y, s: k, rot });

/** Tower of upside-down cones standing on y. */
const tower = (x: number, y: number, hc: number, count: number) => { for (let i = 0; i < count; i++) scene(place(cone(hc), { rot: 180, x, y: y - hc - i * hc * 0.2 })); };

const defs = linearGradient(`${ID}-sky`, [[0, '#9fd8f0'], [1, '#e6f6f4']]) + linearGradient(`${ID}-top`, [[0, '#ffffff'], [1, '#f1e4e6']]);

// =====================================================================
// walls and ceiling
// =====================================================================
scene(stripes(0, 40, W, 680, 50, '#d9f2e6', '#c8ebdb', '#b5e0cd'));
scene(sh(rect(0, 0, W, 46), C.hot), sh(rect(0, 38, W, 8), shade(C.hot, -0.2)));
scene(scallop(0, 46, W, 30, 10, C.white, C.pink));

// window with a striped awning outside
{
  const x0 = 50, y0 = 118, w = 420, h = 400;
  scene(sh(rect(x0, y0, w, h), `url(#${ID}-sky)`));
  scene(sh(circle(x0 + 330, y0 + 150, 34), '#fff3b8'), sh(circle(x0 + 330, y0 + 150, 52), '#fff3b8', { opacity: 0.3 }));
  scene(sh(ellipse(x0 + 110, y0 + 170, 60, 18) + ellipse(x0 + 150, y0 + 158, 44, 20) + ellipse(x0 + 70, y0 + 160, 36, 14), '#ffffff', { opacity: 0.9 }));
  // houses across the street
  const hs: [number, number, number, string, string][] = [[0, 150, 150, '#f7c9b0', '#d8735a'], [150, 120, 190, '#f8e3a6', '#5aa39a'], [270, 150, 130, '#c9c4ea', '#8a62b8']];
  hs.forEach(([dx, bw, bh, col, roof]) => {
    const bx = x0 + dx, by = y0 + h - 60 - bh;
    let win = '';
    for (let j = 0; j < Math.floor(bh / 60); j++) for (let i = 0; i < 2; i++) win += rect(bx + bw * 0.2 + i * bw * 0.36, by + 22 + j * 58, bw * 0.22, 30, 3);
    scene(sh(rect(bx, by, bw, bh), col), sh(poly([[bx - 6, by], [bx + bw + 6, by], [bx + bw / 2, by - 44]]), roof), sh(win, '#fffaf0', { stroke: shade(col, -0.3), strokeWidth: 2 }), sh(rect(bx + bw * 0.4, by + bh - 44, bw * 0.2, 44, 3), roof));
  });
  // tree, pavement
  scene(sh(rect(x0 + 392, y0 + 250, 10, 100), '#8a5a3a'), sh(circle(x0 + 396, y0 + 230, 38) + circle(x0 + 372, y0 + 258, 26) + circle(x0 + 410, y0 + 262, 24), '#7cc36a'));
  scene(sh(rect(x0, y0 + h - 60, w, 60), '#d8d2c8'), sh(rect(x0, y0 + h - 60, w, 6), '#b9b2a6'), stroke(line([[x0 + 100, y0 + h - 54], [x0 + 80, y0 + h]]) + line([[x0 + 260, y0 + h - 54], [x0 + 262, y0 + h]]), '#b9b2a6', 1.6));
  scene(awning(x0, y0, w, 74, 10, C.hot, C.white));
  scene(sh(poly([[x0 + 90, y0 + 90], [x0 + 150, y0 + 90], [x0 + 60, y0 + h], [x0, y0 + h]]), '#ffffff', { opacity: 0.12 }), sh(poly([[x0 + 250, y0 + 90], [x0 + 280, y0 + 90], [x0 + 190, y0 + h], [x0 + 160, y0 + h]]), '#ffffff', { opacity: 0.12 }));
  const fc = C.white;
  scene(ol(rect(x0 - 16, y0 - 16, w + 32, 16) + rect(x0 - 16, y0, 16, h) + rect(x0 + w, y0, 16, h) + rect(x0 - 16, y0 + h, w + 32, 12), fc, 1.2, -0.22), sh(rect(x0 + w / 2 - 5, y0, 10, h) + rect(x0, y0 + 210, w, 8), fc, { stroke: shade(fc, -0.22), strokeWidth: 1 }));
  scene(ol(rect(x0 - 26, y0 + h + 10, w + 52, 18, 4), C.white, 1.2, -0.22));
  scene(at(plant(120, C.hot, 3), x0 + 60, y0 + h + 10), at(plant(100, C.lemon, 8, '#6fb36a'), x0 + 360, y0 + h + 10));
}

// picture menu board
{
  const x0 = 530, y0 = 100, w = 630, h = 290;
  scene(sh(rect(x0 + 5, y0 + 7, w, h, 8), '#000000', { opacity: 0.15 }), ol(rect(x0, y0, w, h, 8), C.brass, 1.4, -0.35), ol(rect(x0 + 12, y0 + 12, w - 24, h - 24, 4), '#2f6b66', 1.2, -0.3));
  const tw = (w - 24) / 5;
  let dv = '', sq = '';
  for (let i = 1; i < 5; i++) dv += line([[x0 + 12 + i * tw, y0 + 28], [x0 + 12 + i * tw, y0 + h - 28]]);
  const cx = (i: number) => x0 + 12 + (i + 0.5) * tw, base = y0 + 186;
  scene(stroke(dv, '#f5efe0', 1.6, { opacity: 0.35 }));
  scene(at(iceCreamCone(70, [C.pink]), cx(0), base), at(sundae(120, [C.mint, C.cream, C.choc]), cx(1), base), at(milkshake(112, C.pink, C.teal), cx(2), base), at(popsicle(110, C.lilac, C.sky), cx(3), base), at(iceCreamCone(62, [C.lemon, C.milk]), cx(4), base));
  for (let i = 0; i < 5; i++) {
    sq += curve([[cx(i) - 36, base + 26], [cx(i) - 18, base + 20], [cx(i), base + 28], [cx(i) + 18, base + 20], [cx(i) + 36, base + 26]]);
    let coins = '';
    for (let k = 0; k <= (i * 2) % 3 + 1; k++) coins += circle(cx(i) - 20 + k * 18, base + 52, 6);
    scene(sh(coins, C.lemon, { stroke: C.brassDk, strokeWidth: 1 }));
  }
  scene(stroke(sq, '#f5efe0', 2.4, { opacity: 0.85 }));
}

// back shelf with toppings
scene(sh(rect(500, 496, 700, 224), '#fdf4f0'));
{
  const g = rng(4);
  let a = '', grid = '';
  for (let y = 496; y < 720; y += 32) { grid += line([[500, y], [W, y]]); for (let x = 500; x < W; x += 32) if (g.next() < 0.28) a += rect(x + 1, y + 1, 30, 30); }
  for (let x = 500; x < W; x += 32) grid += line([[x, 496], [x, 720]]);
  scene(sh(a, '#fbd3dc'), stroke(grid, '#ecd6d8', 1.4));
}
scene(shelf(510, 482, 680, 14, C.white), sh(poly([[540, 496], [562, 496], [540, 530]]) + poly([[1140, 496], [1162, 496], [1162, 530]]), C.chrome));
{
  // syrup bottles
  const bottle = (x: number, col: string) => scene(ol(rect(x - 6, 392, 12, 22, 2), C.white, 1, -0.3), ol(rect(x - 16, 410, 32, 72, 8), col, 1.1, -0.3), sh(rect(x - 16, 432, 32, 24), C.cream, { opacity: 0.9 }), sh(heart(x, 443, 12), col), hl(rect(x - 12, 416, 5, 58, 2), 0.45));
  bottle(556, C.choc); bottle(598, C.hot); bottle(640, C.caramel);
  target('sprinkle-shaker', 'Sprinkle shaker', at(sprinkleShaker(78), 700, 482));
  scene(at(candyJar(58, 62, 'balls', CANDY, 14, { lid: C.chrome, size: 0.8 }), 772, 482), at(candyJar(58, 62, 'beans', [C.choc, C.milk, C.chocDk], 15, { lid: C.chrome }), 840, 482));
  target('cherry-jar', 'Jar of cherries', at(cherryJar(84), 916, 482));
  // empty sundae glasses
  for (let i = 0; i < 3; i++) { const x = 984 + i * 42; scene(sh(poly([[x - 17, 418], [x + 17, 418], [x + 4, 458], [x - 4, 458]]), C.glass, { opacity: 0.6 }), stroke(poly([[x - 17, 418], [x + 17, 418], [x + 4, 458], [x - 4, 458]]) + line([[x, 458], [x, 478]]) + line([[x - 12, 480], [x + 12, 480]]), C.glassLn, 1.6), hl(poly([[x - 13, 421], [x - 8, 421], [x - 2, 452], [x - 4, 452]]), 0.6)); }
  tower(1136, 482, 56, 5);
}

// lamps and bunting
scene(bunting([[0, 70], [300, 78], [600, 70], [900, 78], [1200, 70]], 30, 44, [C.hot, C.lemon, C.sky, C.white, C.lilac], 34));
scene(at(pendant(60, 90, C.pink), 250, 56), at(pendant(40, 80, C.mint), 500, 56), at(pendant(40, 80, C.lemon), 1178, 56));

// =====================================================================
// counter
// =====================================================================
scene(sh(rect(0, 716, W, 290), C.pink));
// display freezer with tubs of flavours
{
  const x0 = 40, y0 = 742, w = 640, h = 168;
  scene(ol(rect(x0 - 12, y0 - 12, w + 24, h + 24, 10), C.chrome, 1.4, -0.4), sh(rect(x0, y0, w, h, 4), '#e9f4f6'));
  const fl: [string, string | undefined][] = [[C.pink, C.cherry], [C.cream, undefined], [C.milk, C.chocDk], [C.mint, C.choc], [C.lemon, undefined], [C.lilac, C.purple], [C.sky, C.white], ['#f7b98a', C.orange], [C.choc, C.cream], ['#c8e6a0', C.greenDk]];
  fl.forEach(([c, f], i) => scene(at(tub(116, 68, c, f, i + 3), x0 + 68 + (i % 5) * 126, y0 + 44 + Math.floor(i / 5) * 80)));
  scene(sh(poly([[x0 + 80, y0], [x0 + 160, y0], [x0 + 90, y0 + h], [x0 + 10, y0 + h]]), '#ffffff', { opacity: 0.16 }), sh(poly([[x0 + 420, y0], [x0 + 460, y0], [x0 + 390, y0 + h], [x0 + 350, y0 + h]]), '#ffffff', { opacity: 0.16 }));
  scene(stroke(rect(x0, y0, w, h, 4), C.chromeDk, 3), stroke(line([[x0 + w / 2, y0], [x0 + w / 2, y0 + h]]), C.chromeDk, 2.4));
}
scene(panels(690, 736, 510, 190, 3, C.pink, 16));
[775, 945, 1115].forEach((x, i) => scene(at(iceCreamCone(56, [[C.mint], [C.cream, C.hot], [C.lemon]][i]), x, 890)));
scene(sh(rect(0, 926, W, 60), shade(C.pink, -0.08)), scallop(0, 926, W, 30, 8, C.white, C.cream));
scene(ol(rect(0, 986, W, 22), C.chrome, 1, -0.35), sh(rect(0, 989, W, 4), '#ffffff', { opacity: 0.6 }));
// counter top
scene(sh(rect(0, 716, W, 12), '#000000', { opacity: 0.15 }), ol(rect(-4, 692, W + 8, 26, 5), `url(#${ID}-top)`, 1.4, -0.25), sh(rect(0, 710, W, 5), C.hot, { opacity: 0.7 }));

// on the counter
scene(at(candyJar(70, 80, 'wrapped', [C.hot, C.teal, C.lemon], 44, { lid: C.chrome, round: true }), 74, 696));
target('paper-hat', "Paper server's hat", at(paperHat(104), 182, 696));
target('ice-cream-scoop', 'Ice-cream scoop', at(iceScoop(104), 310, 680, 1, -8));
target('straw-jar', 'Jar of straws', at(strawJar(140), 412, 696));
target('napkin-dispenser', 'Napkin dispenser', at(napkinDispenser(84), 506, 696));
// cone stand
scene(shadow(606, 696, 44, 5), ol(rect(566, 688, 80, 8, 3), C.chrome, 1, -0.4), ol(rect(602, 636, 8, 54), C.chrome, 1, -0.4), stroke(ellipse(606, 630, 22, 6), C.chromeDk, 4));
target('three-scoop-cone', 'Three-scoop cone', at(iceCreamCone(84, [C.pink, C.mint, C.lemon]), 606, 672));
tower(706, 696, 66, 6);
target('soda-fountain', 'Soda fountain', at(sodaFountain(196), 842, 696));
scene(at(milkshake(120, C.pink, C.teal), 962, 696));
target('chocolate-milkshake', 'Chocolate milkshake', at(milkshake(132, C.milk, C.red), 1030, 696));
target('strawberry-sundae', 'Strawberry sundae', at(sundae(130, [C.pink, C.hot, C.cream], C.cherry), 1124, 696));

// =====================================================================
// floor, stools and tables
// =====================================================================
scene(checker(1008, H, W, 600, 760, 140, '#fff6ea', '#f6a6bd', 1.2));
scene(sh(rect(0, 1008, W, 14), '#000000', { opacity: 0.14 }));
[150, 380, 610, 840].forEach((x, i) => scene(at(stool(250, [C.hot, C.teal, C.lemon, C.lilac][i]), x, 1196)));

// left table
scene(at(roundTable(300, 190, C.white), 240, 1470));
scene(at(plate(52, C.white, C.mint), 170, 1276), at(sundae(110, [C.choc, C.milk, C.cream]), 300, 1284), at(lemonadeGlass(56, C.hot), 232, 1296));
target('orange-popsicle', 'Orange popsicle', at(popsicle(92, C.orange, '#f8c56a'), 180, 1274, 1, -68));
// right table
scene(at(roundTable(340, 210, C.mint), 900, 1480));
target('banana-split', 'Banana split', at(bananaSplit(170), 860, 1272));
scene(at(plate(48, C.white, C.hot), 1000, 1284), at(cupcake(40, C.lemon, C.pink, 'sprinkles'), 760, 1284));
target('ice-cream-sandwich', 'Ice-cream sandwich', at(iceCreamSandwich(74), 1000, 1286, 1, -4));
// a stool pulled up to the right table and plants in the corners
scene(at(stool(210, C.sky), 1120, 1420), at(plant(260, C.teal, 11), 1150, 1220, 0.8), at(plant(220, C.hot, 5, '#6fb36a'), 520, 1496));
// dropped cherry, spare cone and napkin
scene(at(cherry(11), 660, 1410), at(cone(60), 600, 1330, 1, 110), sh(poly([[40, 1400], [90, 1392], [98, 1430], [50, 1440]]), C.white, { stroke: '#d8c8c8', strokeWidth: 1 }), stroke(line([[52, 1412], [88, 1406]]) + line([[54, 1424], [90, 1418]]), C.pink, 2));
void H; void hl;

const activity: FindActivity = {
  id: 'sweets-find-2', version: 1, mode: 'find', title: 'The Ice-Cream Parlour', blurb: "Tubs of every flavour, a gleaming soda fountain and pink stools hide thirteen cool treats.",
  collectionId: 'sweets', categories: ["Food", "Treats"], difficulty: 'Relaxed',
  added: '2026-11-26',
  width: W, height: H, defs, items,
};
export default activity;
