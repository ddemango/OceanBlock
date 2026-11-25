import { rect, ellipse, circle, poly, line, curve, blob, leaf, sh, stroke, place, shade, rng, linearGradient } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { FindActivity, FindItem } from '../types';
import { M, Q, ol, shadow, mug, jar, plate, croissant, cupcake, doughnut, cakeSlice, macaron, sittingCat, teapot as kTeapot, flowerVase } from '../kitchen/props-find';
import { books, bookStack, fern, leafy } from '../library/props';
import {
  K, bricks, woodFloor, fairyLights, espressoMachine, grinder, milkPitcher, cappuccino, takeawayCup, tipJar, muffin, cookie, pastryCaseBack, pastryCaseFront,
  chalkboard, coffeeBag, paperback, newspaper, readingGlasses, armchair, stool, cafeTable, bistroChair, pendant, floorLamp, guitar, micStand, amp, headphones,
  monstera, snakePlant, hangingPlant, cactus, cityView, wallShelf, artPrint, scarf, cushion, heart,
} from './props-find';

const ID = 'cafe-find-1';
const W = 1200, H = 1500;
const items: FindItem[] = [];
const scene = (...s: (Shape | Shape[])[]) => { items.push({ shapes: s.flat() }); };
const target = (id: string, name: string, shapes: Shape[]) => { items.push({ id, name, target: true, shapes }); };
const at = (s: Shape[], x: number, y: number, k = 1, rot = 0) => place(s, { x, y, s: k, rot });

const defs =
  linearGradient(`${ID}-sky`, [[0, '#f2c98a'], [0.6, '#f7dfb2'], [1, '#fbeed4']]) +
  linearGradient(`${ID}-glass`, [[0, '#ffffff'], [1, '#ffffff']], 0, 0, 1, 1);

// =====================================================================
// back walls, ceiling
// =====================================================================
scene(bricks(0, 40, 630, 740, 20, [K.brick, K.brickDk, '#c06a4a', '#a65a40'], '#d8c4a6', 11));
scene(sh(rect(620, 40, 580, 740), '#2f5a50'));
{
  let pan = '';
  for (let x = 660; x < 1200; x += 60) pan += line([[x, 40], [x, 290]]);
  scene(stroke(pan, '#284d44', 2));
}
scene(sh(rect(612, 40, 22, 740), '#8a4a34'), sh(rect(612, 40, 6, 740), '#a65a40'));
// ceiling beams
scene(sh(rect(0, 0, W, 44), '#4a3324'), sh(rect(0, 36, W, 8), '#3a2618'));
{
  let b = '';
  for (let x = 0; x < W; x += 150) b += rect(x, 0, 18, 44);
  scene(sh(b, '#5e4230'));
}

// =====================================================================
// the big street window (left)
// =====================================================================
{
  const x0 = 46, y0 = 118, w = 528, h = 466;
  scene(sh(rect(x0, y0, w, h), `url(#${ID}-sky)`));
  scene(cityView(x0, y0 + 40, w, h - 40, 7, false, `url(#${ID}-sky)`));
  // shop across the street with a striped awning
  let aw = '', aw2 = '';
  for (let i = 0; i < 12; i++) { const x = x0 + 10 + i * 24; const q = poly([[x, 452], [x + 24, 452], [x + 24, 480], [x + 12, 488], [x, 480]]); if (i % 2) aw += q; else aw2 += q; }
  scene(sh(rect(x0 + 10, 480, 288, 60), '#3b3532'), sh(rect(x0 + 24, 490, 120, 50), '#f6d48a', { opacity: 0.85 }), sh(rect(x0 + 160, 490, 120, 50), '#f6d48a', { opacity: 0.7 }), sh(aw, '#2f7a6a'), sh(aw2, '#fbf3df'));
  // sidewalk, lamppost, tree and a parked bike
  scene(sh(rect(x0, 540, w, 44), '#cbbfa8'), sh(rect(x0, 540, w, 5), '#a89a82'), stroke(line([[x0 + 120, 545], [x0 + 110, 584]]) + line([[x0 + 300, 545], [x0 + 296, 584]]) + line([[x0 + 460, 545], [x0 + 462, 584]]), '#b0a48c', 1.4));
  scene(stroke(line([[x0 + 380, 560], [x0 + 380, 330]]), '#2b3a34', 6), sh(rect(x0 + 368, 306, 24, 28, 4), '#2b3a34'), sh(rect(x0 + 372, 312, 16, 18, 2), '#fbe3a0'));
  scene(sh(rect(x0 + 466, 380, 12, 180), '#6a4a32'));
  const g = rng(3);
  let c1 = '', c2 = '';
  for (let i = 0; i < 14; i++) { const d = circle(x0 + 472 + g.range(-60, 50), 330 + g.range(-60, 40), g.range(22, 36)); if (i % 2) c1 += d; else c2 += d; }
  scene(sh(c1, '#6f9a5c'), sh(c2, '#88b06a'));
  scene(stroke(circle(x0 + 190, 556, 20) + circle(x0 + 250, 556, 20), '#2b2622', 3), stroke(M(x0 + 190, 556) + Q(x0 + 210, 530, x0 + 225, 556) + M(x0 + 210, 532) + Q(x0 + 230, 532, x0 + 250, 556) + M(x0 + 238, 520) + Q(x0 + 240, 530, x0 + 235, 540), '#c8473a', 3));
  // glass sheen
  scene(sh(poly([[x0 + 60, y0], [x0 + 120, y0], [x0 + 10, y0 + h], [x0 - 50, y0 + h]]), '#ffffff', { opacity: 0.08 }), sh(poly([[x0 + 300, y0], [x0 + 330, y0], [x0 + 230, y0 + h], [x0 + 200, y0 + h]]), '#ffffff', { opacity: 0.08 }));
  // frame and mullions
  const fc = '#2f4a3e';
  let mul = rect(x0 + 168, y0, 10, h) + rect(x0 + 348, y0, 10, h) + rect(x0, y0 + 92, w, 10);
  for (let x = x0 + 66; x < x0 + w; x += 66) mul += rect(x, y0, 6, 92);
  scene(sh(rect(x0 - 14, y0 - 14, w + 28, 14) + rect(x0 - 14, y0 + h, w + 28, 8) + rect(x0 - 14, y0, 14, h) + rect(x0 + w, y0, 14, h), fc), sh(mul, fc), sh(rect(x0 - 14, y0 - 14, w + 28, 4), '#4a6a5a'));
  // fairy lights along the top
  scene(fairyLights([[x0 - 10, y0 + 6], [x0 + 180, y0 + 10], [x0 + 360, y0 + 6], [x0 + w + 10, y0 + 10]], 26, 26, ['#ffd98a', '#f6b0a0', '#fff1c4'], 4, 4));
}
// pendant lamps over the window
scene(at(pendant(70, 56, K.mustard), 170, 44), at(pendant(100, 56, K.tealDk), 450, 44));
// wainscot and window ledge
{
  scene(sh(rect(0, 610, 630, 170), '#6a4a32'));
  let p = '';
  for (let x = 20; x < 610; x += 100) p += rect(x, 636, 80, 124, 3);
  scene(stroke(p, '#4f3524', 2), sh(rect(0, 610, 630, 6), '#000000', { opacity: 0.2 }));
  scene(sh(rect(16, 584, 600, 26, 3), '#8a5a36'), sh(rect(16, 584, 600, 6, 3), '#b07a4a'));
}
// on the window ledge
scene(at(snakePlant(150, 4, '#f0e6d4'), 80, 586));
scene(bookStack(178, 586, 70, 4, rng(8)).shapes);
target('cat', 'Cat', at(sittingCat(84, '#9a8a80'), 268, 586));
scene(at(jar(30, 40, '#7a4a2a', 1, '#c9a46a'), 336, 586), at(flowerVase(60, 9, '#f5ead2', ['#f29bb5', '#fbf6ec', '#f3d77a']), 390, 586));
target('takeaway-cup', 'Takeaway cup', at(takeawayCup(60, '#fbf6ec', '#3f7f7a'), 446, 586));
target('cactus', 'Cactus', at(cactus(70, '#d98a7a'), 500, 586));
scene(at(leafy(rng(12), 70, 40, 34, '#e8e0cf', 7), 560, 586));
// bar stools in front of the ledge
scene(at(stool(200, '#3b3532', K.woodDk), 150, 800), at(stool(200, '#3b3532', K.woodDk), 340, 800), at(stool(200, '#3b3532', K.woodDk), 530, 800));

// =====================================================================
// coffee bar (right)
// =====================================================================
scene(at(chalkboard(250, 176, 3), 648, 70), at(chalkboard(250, 176, 8, K.woodLt), 924, 70));
// subway tiles behind the bar
scene(bricks(634, 290, 566, 266, 18, ['#f3ead6', '#efe4cc', '#f6efe0'], '#d6c9ae', 21));
// shelf 1: coffee bags and jars
scene(at(wallShelf(540), 646, 268));
scene(at(coffeeBag(62, '#c9a46a'), 680, 268), at(coffeeBag(70, '#8a5a3a', '#f3d77a'), 730, 268), at(coffeeBag(58, '#3f7f7a'), 780, 268));
scene(at(jar(30, 46, '#4a2c1c', 1, K.chrome), 830, 268), at(jar(30, 40, '#c98d55', 1, K.chrome), 866, 268), at(jar(30, 46, '#2b1a12', 1, K.chrome), 902, 268));
scene(at(hangingPlant(10, 70, 6, '#d98a7a'), 960, 230));
scene(at(kTeapot(46, '#3f7f7a'), 1040, 268), at(coffeeBag(64, '#c8473a', K.cream), 1100, 268), at(coffeeBag(54, '#c9a46a'), 1150, 268));
// shelf 2: mugs
scene(at(wallShelf(540), 646, 340));
{
  const cols: [string, string][] = [['#fbf6ec', K.teal], [K.mustard, '#fbf6ec'], ['#fbf6ec', K.red], [K.teal, '#fbf6ec'], ['#e8d8c0', K.rose], [K.red, '#fbf6ec'], ['#fbf6ec', K.mustard], [K.sage, '#fbf6ec'], ['#fbf6ec', K.navy], [K.rose, '#fbf6ec'], ['#fbf6ec', K.teal], [K.mustard, '#fbf6ec']];
  cols.forEach(([c, b], i) => scene(at(mug(34, c, b), 670 + i * 44, 340)));
}
// counter
scene(sh(rect(612, 556, 588, 20, 2), '#3b2a22'), sh(rect(612, 556, 588, 5, 2), '#5e4230'));
{
  scene(sh(rect(612, 576, 588, 204), '#9a6a40'));
  let sl = '';
  for (let x = 630; x < 1200; x += 28) sl += line([[x, 580], [x, 776]]);
  scene(stroke(sl, '#7a4f2e', 2), sh(rect(612, 576, 588, 10), '#000000', { opacity: 0.2 }), sh(rect(612, 762, 588, 18), '#5e4230'));
}
// pastry case with treats
{
  const px = 628, py = 404, pw = 196, ph = 152;
  scene(at(pastryCaseBack(pw, ph, [54, 104]), px, py));
  scene(at(cakeSlice(46), px + 36, py + 52), at(cakeSlice(46), px + 90, py + 52), at(doughnut(40, '#7a4a2a'), px + 140, py + 40), at(doughnut(40, '#f29bb5'), px + 172, py + 42));
  scene(at(muffin(40, '#7a4a2a', '#f3ead6'), px + 28, py + 102), at(muffin(40, '#c98a4a', '#5a3420'), px + 66, py + 102));
  target('croissant', 'Croissant', at(croissant(56), px + 118, py + 86));
  scene(at(cupcake(40, '#f3d77a', '#fbf6ec'), px + 168, py + 102));
  scene(sh(ellipse(px + 50, py + 146, 40, 6), '#fbf6ec'), at(cookie(14), px + 34, py + 138), at(cookie(14), px + 58, py + 136), at(cookie(13), px + 46, py + 130));
  scene(at(macaron(26, '#f2b0c0'), px + 108, py + 142), at(macaron(26, '#a9c98a'), px + 136, py + 142), at(macaron(26, '#f3d77a'), px + 164, py + 142));
  scene(at(pastryCaseFront(pw, ph), px, py));
}
target('tip-jar', 'Tip jar', at(tipJar(54), 852, 556));
target('coffee-grinder', 'Coffee grinder', at(grinder(116), 910, 556));
scene(at(espressoMachine(200, K.red), 1046, 556));
target('milk-pitcher', 'Milk pitcher', at(milkPitcher(50), 1172, 556));

// =====================================================================
// floor
// =====================================================================
scene(woodFloor(780, H, W, ['#b07a4a', '#a06c40', '#c08a58', '#99653c'], 31));
scene(sh(rect(0, 780, W, 14), '#000000', { opacity: 0.18 }));

// mid tables behind the lounge
scene(at(bistroChair(170, '#3b2a22'), 676, 940), at(cafeTable(130, 130), 760, 950), at(bistroChair(170, '#3b2a22'), 846, 940));
scene(sh(ellipse(740, 822, 22, 5), '#fbf6ec'), at(mug(26, '#fbf6ec', K.teal), 740, 820));
scene(at(paperback(40, K.plum), 784, 812, 1, -8));
scene(at(bistroChair(170, '#3b2a22'), 1000, 930), at(cafeTable(124, 128), 1090, 940), at(snakePlant(110, 9, '#2f5a50'), 1170, 960));
scene(at(kTeapot(30, '#f3d77a'), 1080, 812), at(mug(22, K.red, '#fbf6ec'), 1116, 812));

// =====================================================================
// the little stage (left)
// =====================================================================
{
  scene(sh(poly([[0, 990], [440, 990], [470, 1110], [0, 1110]]), '#6a3f2a'));
  let bd = '';
  for (let y = 1010; y < 1110; y += 22) bd += line([[0, y], [440 + (y - 990) * 0.25, y]]);
  scene(stroke(bd, '#55311f', 1.6), sh(rect(0, 1110, 474, 44), '#4a2c1c'), sh(rect(0, 1110, 474, 6), '#7a4a32'));
  // rug on stage
  scene(sh(poly([[40, 1020], [380, 1020], [400, 1096], [30, 1096]]), '#a8473a'), stroke(poly([[52, 1028], [372, 1028], [390, 1088], [42, 1088]]), '#f3d77a', 3), stroke(poly([[64, 1036], [364, 1036], [380, 1080], [54, 1080]]), '#2f5a50', 2));
  // string of lights hanging over the stage from the window frame
  scene(fairyLights([[10, 640], [220, 660], [440, 640]], 30, 24, ['#ffd98a', '#fff1c4'], 5, 4));
  scene(at(amp(120, '#2f2b28'), 300, 1070));
  target('headphones', 'Headphones', at(headphones(70, '#3b3532', K.mustard), 300, 950));
  scene(at(stool(170, K.woodDk, '#3b2a22'), 200, 1080));
  scene(stroke(line([[80, 1084], [100, 1000]]) + line([[120, 1084], [100, 1000]]) + line([[100, 1000], [100, 990]]), '#2b2622', 3));
  target('guitar', 'Guitar', at(guitar(250, '#d9984a'), 100, 1084, 1, -6));
  target('microphone', 'Microphone', at(micStand(230), 400, 1090));
  scene(at(scarf(60, K.teal, K.cream), 200, 908));
}

// =====================================================================
// lounge: mismatched armchairs around a low table
// =====================================================================
scene(sh(ellipse(850, 1150, 340, 70), '#2f5a50'), stroke(ellipse(850, 1150, 310, 60) + ellipse(850, 1150, 250, 46), '#f3d77a', 3, { opacity: 0.8 }), stroke(ellipse(850, 1150, 280, 53), '#c8473a', 2, { opacity: 0.8 }));
scene(at(floorLamp(300, '#f0dcae', '#3b3532'), 1160, 1090));
scene(at(armchair(220, '#5c8a4e', 1), 620, 1130));
scene(at(cushion(66, K.mustard, '#fbf6ec', 1, -8), 626, 1006));
target('reading-glasses', 'Reading glasses', at(readingGlasses(62), 528, 1000, 1, -12));
scene(at(armchair(210, K.mustard, 3), 1070, 1130));
scene(at(cushion(60, K.red, '#fbf6ec', 0, 10), 1068, 1010));
// low table
{
  scene(sh(rect(740, 1100, 10, 70) + rect(950, 1100, 10, 70), K.woodDk), shadow(850, 1176, 140, 10, 0.2));
  scene(ol(rect(720, 1080, 260, 24, 6), '#b07a4a', 1, -0.35), sh(rect(720, 1080, 260, 6, 4), '#c99868'));
  target('newspaper', 'Newspaper', at(newspaper(90), 790, 1060, 1, -6));
  target('cappuccino', 'Cappuccino', at(cappuccino(26, '#fbf6ec', K.red), 880, 1082));
  scene(sh(ellipse(944, 1076, 26, 6), '#fbf6ec'), at(cookie(10), 936, 1070), at(cookie(10), 954, 1072));
  scene(bookStack(946, 1098, 50, 2, rng(31)).shapes.map((p) => ({ ...p })));
}

// =====================================================================
// foreground: café table, chairs and plants
// =====================================================================
scene(sh(ellipse(300, 1440, 260, 46), '#c98a5a', { opacity: 0.55 }), stroke(ellipse(300, 1440, 230, 38), '#fbf3df', 3, { opacity: 0.5 }));
scene(at(bistroChair(260, '#3b2a22'), 120, 1430), at(bistroChair(260, '#3b2a22'), 480, 1430));
scene(at(cafeTable(270, 200, '#ece4d2'), 300, 1450));
{
  scene(sh(ellipse(240, 1246, 40, 9), '#fbf6ec', { stroke: '#d9cfb8', strokeWidth: 1 }));
  target('muffin', 'Blueberry muffin', at(muffin(54, '#c98a4a', '#3f4a8a'), 240, 1246));
  scene(at(kTeapot(54, '#d98a7a'), 330, 1250), at(mug(36, '#fbf6ec', K.navy), 388, 1252));
  scene(at(plate(18, '#fbf6ec', K.teal, 0), 196, 1258));
  scene(stroke(curve([[318, 1190], [326, 1170], [318, 1150]]), '#ffffff', 2.4, { opacity: 0.6 }));
}
scene(at(paperback(54, '#c8473a'), 520, 1470, 1, 14));
target('paperback', 'Paperback book', at(paperback(60, '#3f7f7a'), 650, 1390, 1, -10));
scene(at(fern(rng(4), 140, 90, 70, K.terracotta, 13), 760, 1490));
// pouf and basket of blankets
scene(ol(ellipse(900, 1440, 90, 26), '#d9a53a', 1, -0.3), ol(rect(810, 1350, 180, 90, 40), '#e0b04a', 1.2, -0.3), sh(ellipse(900, 1354, 88, 22), '#ecc460'), stroke(curve([[820, 1395], [900, 1410], [980, 1395]]), '#b88a2a', 2));
scene(at(monstera(330, 7, '#3b3532', 0.42), 1090, 1495));
scene(at(cushion(70, K.teal, '#fbf6ec', 2, 6), 880, 1330));
void books; void blob; void leaf; void artPrint; void heart; void shade;


const activity: FindActivity = {
  id: ID, version: 1, mode: 'find', title: 'The Corner Coffeehouse',
  blurb: 'A big street window, a hissing espresso machine and a little open-mic stage hide fifteen coffeehouse things.',
  collectionId: 'cafe', categories: ["Friends", "Cozy"], difficulty: 'Moderate',
  width: W, height: H, defs, items,
};
export default activity;
