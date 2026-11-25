import { rect, ellipse, circle, poly, line, curve, blob, leaf, sh, stroke, place, shade, rng, xf, linearGradient, radialGradient } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { FindActivity, FindItem } from '../types';
import {
  M, L, Q, ol, shadow, building, brickLines, seatedBack, letters, lettersWidth, coffeeCup,
  milkshake, cherryPie, ketchup, coffeePot, hamburger, hotDog, donut, fedora, newspaper, vinylRecord, spatula, saltShaker, pancakes, rollerSkate, iceCreamCone, alarmClock,
} from './props-find';

const ID = 'cities-find-3';
const W = 1200, H = 1500;
const items: FindItem[] = [];
const scene = (...s: (Shape | Shape[])[]) => { items.push({ shapes: s.flat() }); };
const target = (id: string, name: string, shapes: Shape[]) => { items.push({ id, name, target: true, shapes }); };
const RED = '#c8323a', RED_D = '#9a2430', TEAL = '#4aa8a0', CREAM = '#f4ead2', CHROME = '#d8dce4', CHROME_D = '#9aa0ac';

const defs =
  linearGradient(`${ID}-wall`, [[0, '#f6ecd6'], [1, '#ead8b8']]) +
  linearGradient(`${ID}-sky`, [[0, '#a8cce4'], [1, '#e8eef0']]) +
  linearGradient(`${ID}-chrome`, [[0, '#f2f4f8'], [0.5, '#b8bec8'], [1, '#e2e6ec']]) +
  linearGradient(`${ID}-juke`, [[0, '#ffcf6a'], [1, '#f2884a']]) +
  radialGradient(`${ID}-lamp`, [[0, '#fff2c8'], [1, '#fff2c800']]);

// =====================================================================
// back wall, sign
// =====================================================================
scene(sh(rect(0, 0, W, 660), `url(#${ID}-wall)`));
{
  // wallpaper stripes and a teal dado
  let st = '';
  for (let x = 0; x < W; x += 40) st += rect(x, 0, 14, 600);
  scene(sh(st, '#efe0c2', { opacity: 0.7 }));
  scene(sh(rect(0, 586, W, 74), TEAL), sh(rect(0, 580, W, 8), CHROME), stroke(line([[0, 620], [W, 620]]), '#3f8a84', 2));
  // pendant lamps
  for (const x of [180, 450, 760, 1040]) scene(stroke(line([[x, 0], [x, 70]]), '#3a3a40', 2), sh(M(x - 34, 100) + Q(x - 30, 66, x, 66) + Q(x + 30, 66, x + 34, 100) + 'Z', RED), sh(ellipse(x, 100, 34, 6), '#fff2c8'), sh(circle(x, 120, 70), `url(#${ID}-lamp)`, { opacity: 0.5 }));
  // framed photos of the city
  const frames: [number, number, number, number, string][] = [[40, 40, 70, 54, '#8ab0c4'], [126, 30, 44, 60, '#e8b866'], [970, 40, 60, 46, '#c86a5a'], [1046, 28, 52, 66, '#7a9aa8'], [1114, 44, 56, 44, '#a8c87a']];
  for (const [fx, fy, fw, fh, c] of frames) scene(ol(rect(fx, fy, fw, fh, 2), '#3a2a22', 1), sh(rect(fx + 5, fy + 5, fw - 10, fh - 10), c), sh(rect(fx + 8, fy + fh * 0.45, 8, fh * 0.45 - 6) + rect(fx + 18, fy + fh * 0.3, 10, fh * 0.6 - 6) + rect(fx + 30, fy + fh * 0.5, 9, fh * 0.4 - 6), '#3a4a5a', { opacity: 0.6 }));
  // hand-painted sign board
  const word = 'DINER', lw = 50, gap = 18, tw = lettersWidth(word, lw, gap);
  scene(ol(rect(600 - tw / 2 - 40, 18, tw + 80, 96, 10), RED, 2, -0.4), stroke(rect(600 - tw / 2 - 30, 26, tw + 60, 80, 6), CREAM, 2.4));
  scene(stroke(xf(letters(word, lw, 56, gap), { x: 600 - tw / 2 + 3, y: 41 }), RED_D, 11), stroke(xf(letters(word, lw, 56, gap), { x: 600 - tw / 2, y: 38 }), CREAM, 10));
  scene(stroke(line([[600 - tw / 2 - 26, 112], [600 - tw / 2 - 26, 0]]) + line([[600 + tw / 2 + 26, 112], [600 + tw / 2 + 26, 0]]), '#3a3a40', 2));
}

// =====================================================================
// big window onto a New York street
// =====================================================================
{
  const x0 = 46, x1 = 620, y0 = 160, y1 = 566;
  scene(sh(rect(x0, y0, x1 - x0, y1 - y0), `url(#${ID}-sky)`));
  const g = rng(5);
  // distant towers between the facades
  scene(sh(rect(300, 168, 60, 140) + rect(316, 140, 28, 40) + poly([[322, 140], [330, 110], [338, 140]]), '#9ab4c8'), sh(rect(380, 190, 80, 120), '#a8bed0'));
  // brownstone row across the street, with a fire escape
  scene(place(building(200, 300, '#9a5a46', g, { lit: 0.3, litCol: '#f6e0a0', darkCol: '#4a5a6a', ww: 22, wh: 34, gx: 50, gy: 62, top: 26 }), { x: x0, y: 210 }));
  scene(brickLines(x0, 210, 200, 300, 24, 9, '#7a4234', 0.6));
  scene(place(building(220, 270, '#b86a4a', g, { lit: 0.35, litCol: '#f6e0a0', darkCol: '#4a5a6a', ww: 22, wh: 34, gx: 54, gy: 60, top: 24 }), { x: 246, y: 240 }));
  scene(brickLines(246, 240, 220, 270, 24, 9, '#8a4a36', 0.6));
  scene(place(building(160, 320, '#c89a72', g, { lit: 0.3, litCol: '#f6e0a0', darkCol: '#4a5a6a', ww: 20, wh: 30, gx: 46, gy: 56, top: 26 }), { x: 466, y: 190 }));
  scene(sh(rect(x0, 204, 200, 8) + rect(246, 234, 220, 8) + rect(466, 184, 160, 8), '#6a4a3a'));
  {
    // fire escape on the middle building
    const fx0 = 262, fx1 = 450;
    let d = '';
    for (const y of [300, 360, 420]) d += line([[fx0, y], [fx1, y]]) + line([[fx0, y - 20], [fx1, y - 20]]);
    let bars = '';
    for (const y of [300, 360, 420]) for (let x = fx0; x <= fx1; x += 12) bars += line([[x, y], [x, y - 20]]);
    scene(stroke(d, '#2a2a30', 2.4), stroke(bars, '#2a2a30', 1), stroke(line([[fx0 + 30, 300], [fx0 + 90, 340]]) + line([[fx1 - 30, 360], [fx1 - 90, 400]]) + line([[fx0 + 40, 420], [fx0 + 40, 470]]), '#2a2a30', 2.4));
    scene(sh(rect(330, 286, 12, 12, 2) + rect(400, 406, 12, 12, 2), '#c8673e'), sh(circle(336, 282, 8) + circle(406, 402, 8), '#5a9a4a'));
  }
  // a stoop, sidewalk, hydrant and lamp post
  scene(sh(rect(x0, 470, x1 - x0, 24), '#b8b4ac'), sh(rect(x0, 492, x1 - x0, 4), '#8a8680'));
  scene(sh(poly([[100, 470], [170, 470], [180, 494], [90, 494]]), '#8a5a44'), stroke(line([[96, 476], [174, 476]]) + line([[93, 484], [177, 484]]), '#6a4434', 1.4));
  scene(sh(rect(520, 470, 10, 14, 3) + rect(516, 466, 18, 6, 2), '#c8323a'));
  scene(stroke(line([[580, 492], [580, 330]]) + M(580, 330) + Q(580, 316, 596, 318), '#2a4a3a', 4), sh(rect(590, 316, 16, 8, 2), '#2a4a3a'));
  scene(sh(rect(560, 360, 44, 12, 2), '#3f7d4e'));
  // street with yellow cabs and a crosswalk
  scene(sh(rect(x0, 496, x1 - x0, y1 - 496), '#4a4a52'));
  let cw = '';
  for (let x = 66; x < x1; x += 36) cw += rect(x, 552, 22, 8);
  scene(sh(cw, '#e8e4da'));
  const cab = (cx: number, y: number, flip: boolean) => {
    const s = flip ? -1 : 1;
    const shp = [
      sh(M(-70, y) + L(-70, y - 22) + L(-44, y - 26) + L(-26, y - 44) + L(28, y - 44) + L(44, y - 26) + L(70, y - 22) + L(70, y) + 'Z', '#f2c22e', { stroke: '#a8801a', strokeWidth: 1 }),
      sh(poly([[-22, y - 40], [-4, y - 40], [-4, y - 26], [-38, y - 26]]) + poly([[2, y - 40], [24, y - 40], [38, y - 26], [2, y - 26]]), '#8ab0c4'),
      sh(rect(-12, y - 52, 24, 8, 2), '#f6f0d8'), sh(rect(-70, y - 14, 140, 4), '#2a2a2e'),
      sh(circle(-42, y, 11) + circle(44, y, 11), '#1e1e22'), sh(circle(-42, y, 4) + circle(44, y, 4), '#b8b8c0'),
      sh(rect(64, y - 22, 6, 5), '#fff6d0'), sh(rect(-70, y - 22, 5, 5), '#e8443a'),
    ];
    return place(shp, { x: cx, sx: s, ox: 0 });
  };
  scene(cab(170, 538, false), cab(450, 548, true));
  // window frame and reflections
  scene(sh(poly([[120, y0], [200, y0], [80, y1], [40, y1]]) + poly([[360, y0], [400, y0], [300, y1], [270, y1]]), '#ffffff', { opacity: 0.14 }));
  scene(stroke(rect(x0, y0, x1 - x0, y1 - y0), `url(#${ID}-chrome)`, 12), stroke(line([[236, y0], [236, y1]]) + line([[428, y0], [428, y1]]) + line([[x0, 236], [x1, 236]]), CHROME, 6));
  scene(sh(rect(x0 - 10, y1, x1 - x0 + 20, 12, 3), CHROME_D));
  // a hanging plant and a hand-painted EAT sign in the window
  scene(stroke(line([[140, y0], [140, 200]]), '#3a3a40', 1.2), sh(ellipse(140, 210, 22, 12), '#c8673e'));
  for (let i = 0; i < 9; i++) scene(sh(leaf(140, 204, 24 + (i % 3) * 8, 6, 20 + i * 18), ['#4f8a4f', '#5f9a58', '#3f7a42'][i % 3]));
  scene(stroke(xf(letters('EAT', 22, 30, 8), { x: 474, y: 254 }), RED, 5));
}

// =====================================================================
// back bar: shelves, pass-through and menu
// =====================================================================
{
  // menu board
  scene(ol(rect(990, 160, 180, 220, 6), '#2a3230', 3, 0.35));
  const g = rng(11);
  for (let i = 0; i < 9; i++) { const y = 194 + i * 20; scene(stroke(line([[1006, y], [1006 + g.range(70, 110), y]]), '#e8e2d0', 2), sh(rect(1134, y - 4, 22, 6, 2), '#f2c84a')); }
  scene(sh(rect(1006, 172, 100, 8, 2), '#e88a8a'));
  // pass-through window to the kitchen, with the cook
  scene(sh(rect(680, 330, 280, 180), '#8a9aa4'), sh(rect(680, 330, 280, 40), '#a8b4bc'));
  scene(stroke(line([[700, 360], [940, 360]]), '#6a7a84', 3));
  for (let i = 0; i < 5; i++) scene(sh(rect(704 + i * 48, 344, 30, 12, 2), CHROME_D));
  // cook
  scene(sh(blob([[760, 510], [762, 470], [790, 446], [850, 446], [878, 470], [880, 510]], 0.8), '#fbfbf6'), sh(circle(820, 428, 26), '#c8906a'), sh(rect(796, 380, 48, 32, 8) + ellipse(820, 382, 30, 18), '#ffffff'));
  scene(sh(circle(812, 428, 2.6) + circle(830, 428, 2.6), '#3a2a22'), stroke(curve([[810, 440], [820, 446], [830, 440]]), '#8a4a3a', 1.6), sh(rect(806, 446, 28, 6), '#c8323a'));
  scene(stroke(rect(680, 330, 280, 180), `url(#${ID}-chrome)`, 10), sh(rect(670, 500, 300, 16, 3), CHROME));
  // order tickets on a rail
  scene(stroke(line([[700, 322], [940, 322]]), CHROME_D, 3));
  for (let i = 0; i < 6; i++) scene(sh(rect(708 + i * 38, 322, 24, 34, 1), '#fbf6e8', { stroke: '#c8c0b0', strokeWidth: 0.6 }), stroke(line([[712 + i * 38, 334], [726 + i * 38, 334]]) + line([[712 + i * 38, 342], [722 + i * 38, 342]]), '#8a8a8a', 1));
  // plates waiting on the pass
  scene(ol(ellipse(730, 498, 30, 7), '#ffffff', 1), sh(ellipse(730, 494, 16, 5), '#e8b466'), ol(ellipse(912, 498, 30, 7), '#ffffff', 1), sh(ellipse(906, 494, 12, 6), '#6aa84f'), sh(ellipse(918, 494, 10, 5), '#e0a04a'));
  // a wall clock
  scene(ol(circle(1080, 440, 46), '#f6f0e2', 4, -0.5), stroke(circle(1080, 440, 40), RED, 4), stroke(line([[1080, 440], [1080, 410]]) + line([[1080, 440], [1100, 452]]), '#2a2a2e', 3));
  // shelves of mugs and glasses
  scene(sh(rect(660, 190, 300, 10, 2) + rect(660, 270, 300, 10, 2), '#8a5a3a'), sh(rect(660, 200, 300, 4) + rect(660, 280, 300, 4), '#5a3a26'));
  for (let i = 0; i < 9; i++) {
    const x = 678 + i * 32;
    if (i === 6) continue;
    scene(ol(rect(x - 10, 166, 20, 24, 3), ['#f6f0e2', TEAL, RED, '#f6f0e2', '#f2c84a'][i % 5], 1), stroke(M(x + 10, 172) + Q(x + 18, 178, x + 10, 184), shade(['#f6f0e2', TEAL, RED, '#f6f0e2', '#f2c84a'][i % 5], -0.3), 2));
  }
  for (let i = 0; i < 10; i++) { const x = 676 + i * 28; if (i === 3 || i === 4) continue; scene(sh(poly([[x - 9, 236], [x + 9, 236], [x + 6, 270], [x - 6, 270]]), '#dff0f4', { opacity: 0.6, stroke: '#9ab8c0', strokeWidth: 1 })); }
  // coffee machine with warmers
  scene(ol(rect(970, 500, 100, 86, 4), CHROME, 1, -0.4), sh(rect(980, 510, 80, 20, 2), '#2a2a30'), sh(circle(990, 520, 4), '#e8443a'), sh(rect(976, 576, 88, 10, 2), '#2a2a30'));
  for (let i = 0; i < 5; i++) scene(ol(ellipse(1110, 584 - i * 7, 30, 6), '#ffffff', 1, -0.25));
}
target('alarm-clock', 'Alarm clock', place(alarmClock(44, '#3f7fc0'), { x: 870, y: 270 }));
target('spatula', 'Spatula', place(spatula(70, 90), { x: 700, y: 236 }));
target('coffee-pot', 'Coffee pot', place(coffeePot(62, '#2a2a2e'), { x: 1010, y: 576 }));
scene(sh(rect(1150, 500, 40, 86, 4), '#d8dce4'), sh(rect(1156, 510, 28, 20, 2), '#2a2a30'));

// =====================================================================
// the counter and what's on it
// =====================================================================
scene(sh(rect(0, 660, W, 160), RED));
{
  let p = '';
  for (let x = 20; x < W; x += 80) p += rect(x, 690, 40, 110, 4);
  scene(sh(p, RED_D, { opacity: 0.5 }), sh(rect(0, 680, W, 8) + rect(0, 806, W, 8), `url(#${ID}-chrome)`), sh(rect(0, 740, W, 5), CHROME));
}
scene(sh(rect(-4, 638, W + 8, 26, 3), '#f2e6d0'), sh(rect(-4, 658, W + 8, 8), `url(#${ID}-chrome)`));
{
  const g = rng(21);
  let flecks = '';
  for (let i = 0; i < 90; i++) flecks += rect(g.range(0, W), g.range(642, 656), 4, 1.4);
  scene(sh(flecks, '#c8b89a'));
}
{
  const y = 650;
  // napkin dispenser, sugar pourer, mustard
  const napkins = (x: number) => scene(ol(rect(x - 20, y - 36, 40, 36, 3), CHROME, 1, -0.4), sh(rect(x - 14, y - 44, 28, 10, 1), '#ffffff'));
  napkins(70); napkins(600); napkins(1140);
  const sugar = (x: number) => scene(sh(rect(x - 11, y - 34, 22, 34, 4), '#dff0f4', { opacity: 0.6, stroke: '#9ab8c0', strokeWidth: 1 }), sh(rect(x - 10, y - 20, 20, 19, 3), '#fbfbf6'), ol(M(x - 11, y - 34) + Q(x, y - 46, x + 11, y - 34) + 'Z', CHROME, 1, -0.4), stroke(line([[x + 6, y - 40], [x + 14, y - 48]]), CHROME_D, 3));
  sugar(112); sugar(642);
  scene(ol(rect(160, y - 50, 18, 50, 5), '#f2c832', 1), sh(poly([[162, y - 50], [176, y - 50], [169, y - 62]]), '#f2c832'));
  scene(place(saltShaker(30), { x: 1100, y }), place(saltShaker(30), { x: 668, y }));
  // pepper shaker next to the salt
  scene(sh(poly([[200, y - 22], [212, y - 22], [215, y], [197, y]]), '#4a4a4a', { opacity: 0.85 }), ol(M(199, y - 22) + Q(199, y - 30, 206, y - 30) + Q(213, y - 30, 213, y - 22) + 'Z', CHROME, 1, -0.4));
  // decoy shakes and a cone stand
  scene(place(milkshake(72, '#8a5a3a'), { x: 300, y }), place(milkshake(72, '#f6f0e2'), { x: 510, y }));
  scene(place(coffeeCup(46, '#f6f0e2', RED), { x: 240, y }), place(coffeeCup(46, '#f6f0e2', TEAL), { x: 560, y }), place(coffeeCup(46, '#f6f0e2', RED), { x: 940, y }));
  // plates with lunch
  scene(ol(ellipse(440, y - 4, 44, 9), '#ffffff', 1, -0.2));
  scene(ol(ellipse(1010, y - 4, 44, 9), '#ffffff', 1, -0.2), ol(poly([[976, y - 8], [1010, y - 44], [1010, y - 8]]), '#f2dca0', 1), sh(rect(976, y - 18, 34, 5) , '#6aa84f'), sh(rect(976, y - 24, 34, 4), '#d8362c'), ol(poly([[1014, y - 8], [1044, y - 8], [1014, y - 40]]), '#f2dca0', 1), stroke(line([[1010, y - 44], [1010, y - 56]]), '#c8a060', 1.4));
  scene(sh(rect(1030, y - 14, 30, 6, 3) + rect(1034, y - 20, 26, 6, 3), '#f2c84a'));
  // donut stand under a glass dome
  scene(ol(ellipse(800, y - 4, 66, 10), CHROME, 1, -0.4), sh(rect(796, y - 30, 8, 26), CHROME_D), ol(ellipse(800, y - 30, 60, 10), '#f6f0e2', 1, -0.2));
  scene(place(donut(40, '#8a5a32'), { x: 772, y: y - 40 }), place(donut(40, '#f6f0e2'), { x: 828, y: y - 40 }), place(donut(38, '#f2c84a'), { x: 800, y: y - 62 }));
}
target('pink-donut', 'Pink donut', place(donut(38, '#f29ab4'), { x: 800, y: 604 }));
{
  // glass dome over the donut stand (drawn after so the donuts sit inside it)
  scene(sh(M(740, 620) + L(740, 580) + Q(740, 520, 800, 516) + Q(860, 520, 860, 580) + L(860, 620) + 'Z', '#dff0f4', { opacity: 0.18, stroke: '#9ab8c0', strokeWidth: 1.4 }), sh(circle(800, 512, 6), CHROME_D), sh(poly([[752, 600], [760, 560], [768, 556], [760, 604]]), '#ffffff', { opacity: 0.35 }));
}
target('milkshake', 'Strawberry milkshake', place(milkshake(80, '#f2a6b8'), { x: 380, y: 650 }));
target('hamburger', 'Hamburger', place(hamburger(60), { x: 440, y: 646 }));
target('ketchup', 'Ketchup bottle', place(ketchup(56), { x: 144, y: 650 }));
target('salt-shaker', 'Salt shaker by the ketchup', place(saltShaker(34), { x: 214, y: 650 }));
target('ice-cream-cone', 'Ice cream cone', place(iceCreamCone(64), { x: 704, y: 650 }));
scene(ol(rect(690, 630, 28, 20, 3), CHROME, 1, -0.4), sh(rect(694, 626, 20, 6, 2), '#2a2a30'));
{
  // cherry pie on a cake stand at the end of the counter
  scene(ol(ellipse(900, 646, 50, 8), CHROME, 1, -0.4), sh(rect(896, 600, 8, 46), CHROME_D), ol(ellipse(900, 600, 56, 9), CHROME, 1, -0.4));
}
target('cherry-pie', 'Cherry pie', place(cherryPie(96), { x: 900, y: 600 }));

// =====================================================================
// floor and stools with customers
// =====================================================================
scene(sh(rect(0, 820, W, H - 820), '#f2ece0'));
{
  const s = 56, g = rng(31);
  for (let r = 0; r * s + 820 < H; r++) for (let c = 0; c * s < W; c++) if ((r + c) % 2 === 0) scene(sh(rect(c * s, 820 + r * s, s, s), g.pick(['#2e2e36', '#2a2a32', '#32323a'])));
  for (let i = 0; i < 30; i++) scene(sh(rect(g.int(0, 21) * s + 6, 830 + g.int(0, 11) * s, 18, 4, 2), '#ffffff', { opacity: 0.12 }));
  scene(sh(rect(0, 820, W, 16), '#1e1e24', { opacity: 0.35 }));
}
{
  const stool = (x: number) => scene(shadow(x, 966, 40, 8), sh(rect(x - 30, 958, 60, 10, 4), CHROME_D), sh(rect(x - 6, 830, 12, 130), `url(#${ID}-chrome)`), ol(ellipse(x, 832, 36, 12), RED, 1.2, -0.4), sh(rect(x - 36, 832, 72, 12, 4), RED_D), sh(rect(x - 38, 842, 76, 4), CHROME));
  const xs = [90, 230, 370, 510, 650, 790, 930, 1070];
  xs.forEach(stool);
  scene(place(seatedBack(90, '#3f6a9a', '#3a2a22', '#c8906a'), { x: 230, y: 830 }));
  scene(place(seatedBack(86, '#e8b84a', '#8a5a3a', '#e8b896'), { x: 650, y: 830 }));
  scene(place(seatedBack(92, '#5a8a5a', '#1e1a1a', '#8a5a3a'), { x: 1070, y: 830 }));
  scene(sh(rect(186, 760, 18, 40, 6) + rect(256, 760, 18, 40, 6), '#3f6a9a'));
}

// =====================================================================
// foreground left: a booth
// =====================================================================
{
  const top = 1180;
  scene(shadow(250, 1440, 230, 16));
  // far bench back (right of table) and table
  scene(ol(rect(420, 990, 70, 450, 26), RED, 2, -0.4), sh(rect(432, 1006, 46, 420, 20), '#d8424a'));
  let tuft = '';
  for (let y = 1030; y < 1420; y += 50) tuft += line([[440, y], [470, y]]);
  scene(stroke(tuft, RED_D, 2));
  scene(sh(rect(236, top + 20, 30, 230), CHROME_D), sh(rect(190, 1430, 120, 12, 4), CHROME_D));
  scene(ol(rect(80, top, 340, 26, 6), '#f2e6d0', 1.2, -0.3), sh(rect(80, top + 22, 340, 8, 3), `url(#${ID}-chrome)`));
  // jukebox selector on the table edge
  scene(ol(rect(380, top - 54, 34, 54, 4), CHROME, 1, -0.4), sh(rect(385, top - 48, 24, 24, 2), '#f6e6b0'), stroke(line([[388, top - 42], [406, top - 42]]) + line([[388, top - 34], [406, top - 34]]), '#c8a060', 1.2), sh(circle(397, top - 14, 5), RED));
  // near bench back (left)
  scene(ol(rect(-20, 960, 96, 540, 30), RED, 2, -0.4), sh(rect(-6, 980, 66, 500, 22), '#d8424a'));
  let t2 = '';
  for (let y = 1010; y < 1480; y += 54) t2 += line([[6, y], [50, y]]);
  scene(stroke(t2, RED_D, 2));
  scene(place(coffeeCup(48, '#f6f0e2', TEAL), { x: 330, y: top + 4 }));
  scene(ol(ellipse(250, top + 2, 50, 10), '#ffffff', 1, -0.2));
}
target('pancakes', 'Stack of pancakes', place(pancakes(84), { x: 154, y: 1186 }));
target('hot-dog', 'Hot dog', place(hotDog(70), { x: 250, y: 1172 }));
scene(ol(rect(40, 1300, 150, 40, 12), RED, 1.4, -0.4), sh(rect(48, 1304, 134, 10, 5), '#d8424a'), ol(rect(318, 1300, 130, 40, 12), RED, 1.4, -0.4), sh(rect(326, 1304, 114, 10, 5), '#d8424a'));
scene(sh(rect(52, 1340, 12, 100) + rect(170, 1340, 12, 100) + rect(330, 1340, 12, 100), CHROME_D));

target('newspaper', 'Newspaper', place(newspaper(96, -12), { x: 124, y: 1278 }));

// =====================================================================
// centre: coat rack with hats and coats
// =====================================================================
{
  const x = 620;
  scene(shadow(x, 1420, 70, 10), stroke(line([[x - 60, 1420], [x, 1380]]) + line([[x + 60, 1420], [x, 1380]]) + line([[x, 1420], [x, 1380]]), '#4a2e22', 6));
  scene(sh(rect(x - 6, 930, 12, 470, 4), '#5a3a28'), sh(circle(x, 926, 10), '#5a3a28'));
  scene(stroke(M(x, 960) + Q(x - 30, 960, x - 40, 944) + M(x, 960) + Q(x + 30, 960, x + 40, 944) + M(x, 1000) + Q(x - 26, 1000, x - 34, 986) + M(x, 1000) + Q(x + 26, 1000, x + 34, 986), '#5a3a28', 5));
  // coats
  scene(sh(blob([[x - 40, 960], [x - 76, 1000], [x - 84, 1180], [x - 60, 1210], [x - 14, 1200], [x - 10, 1000]], 0.8), '#8a6a4a'), stroke(line([[x - 44, 1000], [x - 46, 1190]]), '#6a4a32', 2), sh(circle(x - 32, 1050, 4) + circle(x - 32, 1090, 4) + circle(x - 32, 1130, 4), '#3a2a22'));
  scene(sh(blob([[x + 38, 990], [x + 14, 1010], [x + 10, 1150], [x + 30, 1170], [x + 70, 1160], [x + 74, 1010]], 0.8), '#3f5a7a'), sh(poly([[x + 30, 995], [x + 52, 995], [x + 46, 1080], [x + 36, 1080]]), '#c8a24a'));
  // a red scarf and an umbrella hooked on the rack
  scene(stroke(curve([[x - 8, 1000], [x - 14, 1060], [x - 6, 1120]]), RED, 10), stroke(M(x + 40, 944) + Q(x + 52, 940, x + 52, 954) + L(x + 52, 1150), '#2a2a30', 4), sh(poly([[x + 44, 970], [x + 60, 970], [x + 66, 1130], [x + 38, 1130]]), '#2a2a30'));
}
target('fedora', 'Fedora', place(fedora(78, '#6a5a44', '#2a2228'), { x: 600, y: 938 }));
target('roller-skate', 'Roller skate', place(rollerSkate(80, '#f2e6d8', '#4aa8a0'), { x: 520, y: 1480 }));

// =====================================================================
// foreground right: jukebox and a crate of records
// =====================================================================
{
  const x0 = 770, x1 = 1130, top = 900, bot = 1420, cx = (x0 + x1) / 2, r = (x1 - x0) / 2;
  scene(shadow(cx, bot, 210, 16));
  const outline = M(x0, bot) + L(x0, top + r) + Q(x0, top, cx, top) + Q(x1, top, x1, top + r) + L(x1, bot) + 'Z';
  scene(ol(outline, '#8a3a2a', 2, -0.4));
  const inner = M(x0 + 30, bot - 20) + L(x0 + 30, top + r) + Q(x0 + 30, top + 30, cx, top + 30) + Q(x1 - 30, top + 30, x1 - 30, top + r) + L(x1 - 30, bot - 20) + 'Z';
  scene(sh(inner, `url(#${ID}-juke)`));
  // bubble tubes following the arch
  const arch = (k: number) => M(x0 + 16 + k, bot - 40) + L(x0 + 16 + k, top + r) + Q(x0 + 16 + k, top + 16 + k, cx, top + 16 + k) + Q(x1 - 16 - k, top + 16 + k, x1 - 16 - k, top + r) + L(x1 - 16 - k, bot - 40);
  scene(stroke(arch(0), '#e8443a', 10), stroke(arch(14), '#f2c84a', 6));
  const g = rng(41);
  let bubbles = '';
  for (let i = 0; i < 18; i++) { const y = g.range(top + r, bot - 60); bubbles += circle(x0 + 16, y, 2.6) + circle(x1 - 16, y, 2.6); }
  scene(sh(bubbles, '#fff6d0'));
  // glass window with the record mechanism
  scene(sh(M(x0 + 60, top + 250) + L(x0 + 60, top + r + 10) + Q(x0 + 60, top + 70, cx, top + 70) + Q(x1 - 60, top + 70, x1 - 60, top + r + 10) + L(x1 - 60, top + 250) + 'Z', '#3a2a3a'));
  for (let i = 0; i < 5; i++) scene(sh(ellipse(cx, top + 150 + i * 16, 80, 6), i === 2 ? '#2a2a2e' : '#4a3a4a'), sh(ellipse(cx, top + 150 + i * 16, 16, 3), ['#e8443a', '#f2c84a', '#4aa8a0', '#f29ab4', '#f6f0e2'][i]));
  scene(sh(rect(cx + 70, top + 140, 6, 80, 2), CHROME));
  // song cards and buttons
  scene(sh(rect(x0 + 50, top + 262, x1 - x0 - 100, 60, 4), '#fbf6e8'));
  for (let i = 0; i < 2; i++) for (let k = 0; k < 6; k++) scene(stroke(line([[x0 + 60 + k * 40, top + 276 + i * 24], [x0 + 90 + k * 40, top + 276 + i * 24]]), '#c8a060', 1.6));
  let btn = '';
  for (let k = 0; k < 10; k++) btn += rect(x0 + 58 + k * 25, top + 334, 18, 12, 3);
  scene(sh(btn, CHROME), sh(rect(x0 + 40, top + 326, x1 - x0 - 80, 4), CHROME_D));
  // speaker grille
  let gr = '';
  for (let k = 0; k < 9; k++) gr += line([[x0 + 64 + k * 26, top + 364], [x0 + 64 + k * 26, bot - 40]]);
  scene(sh(rect(x0 + 50, top + 356, x1 - x0 - 100, bot - 40 - top - 356, 6), '#5a2a22'), stroke(gr, '#c8a24a', 3));
  scene(sh(rect(x0, bot - 20, x1 - x0, 20, 4), CHROME_D), sh(rect(x0 - 4, top + r - 6, 12, 12, 2) + rect(x1 - 8, top + r - 6, 12, 12, 2), CHROME));
  // crate of records beside it
  scene(ol(rect(1100, 1370, 96, 110, 4), '#b88a5a', 1.4, -0.4));
  for (let i = 0; i < 6; i++) scene(sh(rect(1108 + i * 14, 1338 + (i % 2) * 6, 10, 50, 1), ['#c8323a', '#2a2a30', '#f2c84a', '#4aa8a0', '#f29ab4', '#2a2a30'][i]));
  scene(sh(rect(1100, 1400, 96, 8), '#8a6040'));
}
target('vinyl-record', 'Vinyl record', place(vinylRecord(80, '#e8443a'), { x: 1000, y: 1450 }));
{
  // a dropped straw wrapper and a lost penny on the floor
  scene(stroke(curve([[700, 1460], [720, 1450], [740, 1462], [760, 1454]]), '#fbf6e8', 3), sh(circle(860, 1480, 6), '#c8843a'));
}
void ellipse; void L; void Q; void M; void blob; void circle;

const activity: FindActivity = {
  id: ID, version: 1, mode: 'find', title: 'Downtown Diner',
  blurb: 'Slide into a busy New York diner, with yellow cabs rolling past the window, and hunt for sixteen things among the booths, stools and pie stands.',
  collectionId: 'cities', categories: ["Cities"], difficulty: 'Detailed',
  width: W, height: H, defs, items,
};
export default activity;
