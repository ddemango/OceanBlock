import { rect, ellipse, circle, poly, line, curve, sh, stroke, place, shade, rng, linearGradient } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { FindActivity, FindItem } from '../types';
import { basket, mug, jug, teacup, teapot, spectacles, croissant, doughnut, cupcake, macaron, cake, cakeStand, cakeSlice } from '../kitchen/props-find';
import { bookStack } from '../library/props';
import {
  woodFloor, fairyLights, cappuccino, muffin, cookie, pastryCaseBack, pastryCaseFront, chalkboard, paperback, armchair, bistroChair, cafeTable, pendant,
  monstera, hangingPlant, cactus, cityView, wallShelf, cushion, yarnBall,
} from '../cafe/props-find';
import { curtain } from '../blooms/props-find';
import { PET as C, pawPrint, catSit, catLoaf, catLie, catCurl, catPeek, catWalk, petBed, petBedFront, petBowl, toyMouse, featherWand, catTree, catPortrait, fishBiscuit, heartPath, boxBack, boxFront } from './props-find';

const ID = 'pets-find-3';
const W = 1200, H = 1500;
const items: FindItem[] = [];
const scene = (...s: (Shape | Shape[])[]) => { items.push({ shapes: s.flat() }); };
const target = (id: string, name: string, shapes: Shape[]) => { items.push({ id, name, target: true, shapes }); };
const at = (s: Shape[], x: number, y: number, k = 1, rot = 0) => place(s, { x, y, s: k, rot });
const ol = (d: string, fill: string, w = 1, amt = -0.3): Shape => sh(d, fill, { stroke: shade(fill, amt), strokeWidth: w });

const defs = linearGradient(`${ID}-sky`, [[0, '#f6c890'], [0.55, '#f9dfb4'], [1, '#fcefd8']]);

// =====================================================================
// walls and ceiling
// =====================================================================
scene(sh(rect(0, 40, W, 750), '#efd2bc'));
{
  let st = '', hearts = '';
  for (let x = 0; x < W; x += 48) st += rect(x, 40, 24, 600);
  const g = rng(4);
  for (let r = 0, y = 96; y < 620; y += 76, r++) for (let x = (r % 2 ? 60 : 12); x < W; x += 96) hearts += r % 2 ? pawPrint(x, y + g.range(-4, 4), 7, g.range(-20, 20)) : heartPath(x, y + g.range(-4, 4), 6);
  scene(sh(st, '#f3dac6'), sh(hearts, '#e6bfa6'));
}
scene(sh(rect(0, 0, W, 44), '#5e4230'), sh(rect(0, 36, W, 8), '#3a2618'), sh(rect(0, 44, W, 12), '#f8ecd8'), sh(rect(0, 56, W, 4), '#d9a890'));
{
  let b = '';
  for (let x = 60; x < W; x += 170) b += rect(x, 0, 18, 44);
  scene(sh(b, '#73533c'));
}
// wainscot
scene(sh(rect(0, 630, W, 160), '#f6ead6'), sh(rect(0, 622, W, 10, 2), '#fbf3e4'), sh(rect(0, 632, W, 5), '#000000', { opacity: 0.1 }));
{
  let p = '';
  for (let x = 14; x < W; x += 92) p += rect(x, 650, 72, 116, 4);
  scene(stroke(p, '#e2d2b8', 2.2), sh(rect(0, 774, W, 16), '#d9c4a4'));
}

// =====================================================================
// big window with a window seat
// =====================================================================
{
  const x0 = 70, y0 = 124, w = 420, h = 440;
  scene(cityView(x0, y0, w, h, 9, false, `url(#${ID}-sky)`));
  scene(sh(rect(x0, y0 + h - 40, w, 40), '#cbbfa8'), sh(rect(x0, y0 + h - 40, w, 5), '#a89a82'));
  scene(sh(rect(x0 + 330, y0 + 210, 10, 190), '#6a4a32'));
  const g = rng(3);
  let c1 = '', c2 = '';
  for (let i = 0; i < 14; i++) { const d = circle(x0 + 336 + g.range(-52, 44), y0 + 170 + g.range(-54, 40), g.range(20, 34)); if (i % 2) c1 += d; else c2 += d; }
  scene(sh(c1, '#7a9a5c'), sh(c2, '#96b06a'));
  scene(sh(poly([[x0 + 60, y0], [x0 + 120, y0], [x0 + 10, y0 + h], [x0 - 50, y0 + h]]), '#ffffff', { opacity: 0.1 }), sh(poly([[x0 + 250, y0], [x0 + 280, y0], [x0 + 180, y0 + h], [x0 + 150, y0 + h]]), '#ffffff', { opacity: 0.1 }));
  const fc = '#fbf3e4';
  let mul = rect(x0 + w / 3 - 5, y0, 10, h) + rect(x0 + (2 * w) / 3 - 5, y0, 10, h) + rect(x0, y0 + 104, w, 9);
  scene(ol(rect(x0 - 16, y0 - 16, w + 32, 16) + rect(x0 - 16, y0, 16, h) + rect(x0 + w, y0, 16, h), fc, 1.2, -0.2), ol(mul, fc, 1, -0.2));
  scene(at(hangingPlant(26, 60, 6, '#d98a7a'), x0 + 110, y0 + 2), at(hangingPlant(40, 56, 11, '#f0e6d4'), x0 + 320, y0 + 2));
  scene(fairyLights([[x0 - 6, y0 + 6], [x0 + w / 2, y0 + 12], [x0 + w + 6, y0 + 6]], 26, 26, ['#ffd98a', '#f6b0a0', '#fff1c4'], 4, 4));
  // curtains
  scene(sh(rect(x0 - 50, y0 - 34, w + 100, 8, 4), '#8a5a36'), sh(circle(x0 - 50, y0 - 30, 8) + circle(x0 + w + 50, y0 - 30, 8), '#8a5a36'));
  scene(at(curtain(96, 480, '#d98a7a', 3, 0.6, 1), x0 - 44, y0 - 28), at(curtain(96, 480, '#d98a7a', 5, 0.6, -1), x0 + w - 52, y0 - 28));
}
// window seat with cubby holes
{
  const x0 = 30, x1 = 530, top = 590;
  scene(ol(rect(x0, top + 10, x1 - x0, 184), '#f8ecd8', 1.2, -0.2));
  for (const cx of [124, 280, 436]) scene(ol(`M${cx - 56} 772L${cx - 56} 690Q${cx - 56} 640 ${cx} 640Q${cx + 56} 640 ${cx + 56} 690L${cx + 56} 772Z`, '#6a4a40', 1.4, 0.25));
  // left cubby: a peeking cat; middle: yarn; right: a pair of eyes in the dark
  scene(at(catPeek(66, C.grey, { pat: 'tabby' }), 124, 770));
  scene(ol(circle(258, 746, 22), '#e89ab0', 1.2), ol(circle(300, 750, 20), '#f2c84a', 1.2), ol(circle(280, 716, 20), '#9ad28a', 1.2), stroke(curve([[244, 740], [258, 748], [274, 742]]) + curve([[288, 746], [300, 754], [314, 746]]) + curve([[268, 712], [280, 720], [294, 712]]), '#ffffff', 1.4, { opacity: 0.6 }));
  scene(sh(ellipse(420, 716, 8, 9) + ellipse(452, 716, 8, 9), '#f2c84a'), sh(ellipse(420, 716, 2.4, 8) + ellipse(452, 716, 2.4, 8), '#2b2622'));
  scene(sh(rect(x0, top + 10, x1 - x0, 8), '#000000', { opacity: 0.1 }), ol(rect(x0 - 8, top - 16, x1 - x0 + 16, 28, 12), '#3f7f7a', 1.4), sh(rect(x0, top - 13, x1 - x0, 6, 3), '#5a9a94'));
  let tuft = '';
  for (let x = x0 + 40; x < x1; x += 70) tuft += circle(x, top - 1, 3);
  scene(sh(tuft, '#2f625e'));
}
const SEAT = 574;
scene(at(cushion(74, '#d9a53a', '#fbf6ec', 1, -8), 78, SEAT - 34), at(cushion(70, '#c8473a', '#fbf6ec', 0, 10), 488, SEAT - 32));
scene(at(catLoaf(140, C.grey, { pat: 'tabby', eyes: 'closed' }), 196, SEAT));
target('book', 'Paperback book', at(paperback(58, '#7a4a62'), 300, SEAT - 4, 1, -6));
scene(at(catSit(112, C.white, { pat: 'calico' }), 392, SEAT));

// =====================================================================
// right wall: menu, portraits and cat walkways
// =====================================================================
scene(at(chalkboard(232, 158, 6), 934, 84));
scene(at(catPortrait(86, 106, '#e8c8a0'), 586, 92), at(catPortrait(72, 90, '#b8d4c8', '#e3924a', '#3f7f7a'), 698, 108), at(catPortrait(66, 82, '#f0c0c8', '#8a8a92', '#d9a53a'), 800, 96));
scene(at(wallShelf(226, '#c69462'), 584, 300));
scene(at(catLie(156, C.ginger, { pat: 'tabby' }), 700, 300));
scene(at(wallShelf(236, '#c69462'), 846, 392));
scene(at(catCurl(124, C.black, { pat: 'tux' }), 930, 392));
scene(at(wallShelf(196, '#c69462'), 596, 478));
target('siamese', 'Siamese cat', at(catSit(104, C.cream, { pat: 'siam' }), 692, 478));
// little steps between the walkways
scene(ol(rect(800, 346, 40, 10, 3), '#c69462', 1), ol(rect(786, 432, 40, 10, 3), '#c69462', 1));
scene(at(pendant(110, 60, '#c8473a'), 300, 44));

// =====================================================================
// counter with the cake case
// =====================================================================
{
  const top = 612, x0 = 800;
  scene(ol(rect(x0 + 10, top + 18, 400, 166), '#7a4a62', 1.4));
  let pan = '';
  for (let i = 0; i < 3; i++) pan += rect(x0 + 28 + i * 124, top + 40, 106, 126, 5);
  scene(stroke(pan, '#623a4e', 2.4), sh(rect(x0 + 10, top + 18, 400, 10), '#000000', { opacity: 0.2 }), sh(rect(x0 + 10, top + 168, 400, 16), '#623a4e'));
  scene(sh(circle(x0 + 205, top + 102, 36), '#f6ead2'), sh(`M${x0 + 181} ${top + 112}L${x0 + 185} ${top + 76}L${x0 + 199} ${top + 92}L${x0 + 211} ${top + 92}L${x0 + 225} ${top + 76}L${x0 + 229} ${top + 112}Q${x0 + 205} ${top + 134} ${x0 + 181} ${top + 112}Z`, '#7a4a62'), sh(circle(x0 + 196, top + 104, 3) + circle(x0 + 214, top + 104, 3), '#f2c84a'));
  scene(ol(rect(x0 - 8, top, 420, 20, 4), '#b07a4a', 1.2), sh(rect(x0 - 8, top, 420, 6, 3), '#d0a070'));
  const px = 816, pw = 196, ph = 152, py = top - ph;
  scene(at(pastryCaseBack(pw, ph, [54, 104]), px, py));
  scene(at(doughnut(40, '#7a4a2a'), px + 36, py + 40), at(doughnut(40, '#f29bb5'), px + 76, py + 42), at(cupcake(42, '#6f8fd6', '#fbf6ec'), px + 124, py + 52), at(cupcake(42, '#e89ab0', '#f6c8d8'), px + 166, py + 52));
  scene(at(muffin(40, '#7a4a2a', '#f3ead6'), px + 30, py + 102), at(muffin(40, '#c98a4a', '#5a3420'), px + 70, py + 102), at(macaron(26, '#f2b0c0'), px + 112, py + 94), at(macaron(26, '#a9c98a'), px + 140, py + 94), at(macaron(26, '#f3d77a'), px + 168, py + 94));
  scene(sh(ellipse(px + 52, py + 146, 40, 6), '#fbf6ec'), at(cookie(14), px + 36, py + 138), at(cookie(14), px + 60, py + 136), at(cookie(13), px + 48, py + 130), at(fishBiscuit(34, '#c98a4a'), px + 120, py + 140), at(fishBiscuit(34, '#c98a4a'), px + 158, py + 138, 1, -8));
  scene(at(pastryCaseFront(pw, ph), px, py));
  scene(at(cakeStand(92, 40, '#fbf6ec'), 1066, top), at(cake(72, 46, '#f2d18a', '#f6c8d8', '#c8322a'), 1066, top - 42));
  target('mug', 'Paw-print mug', [...at(mug(42, '#fbf6ec', '#fbf6ec'), 1126, top), sh(pawPrint(1126, top - 19, 9), '#c8473a')]);
  target('cactus', 'Cactus', at(cactus(64, '#3f7f7a'), 1174, top));
}

// =====================================================================
// floor
// =====================================================================
scene(woodFloor(790, H, W, ['#b98552', '#aa7646', '#c8945e', '#a06c40'], 17));
scene(sh(rect(0, 790, W, 14), '#000000', { opacity: 0.16 }));

// =====================================================================
// cat tree
// =====================================================================
{
  const cx = 668, by = 1120, h = 330, u = h / 100;
  scene(at(catTree(h, '#e8d6c0', '#c9a46a'), cx, by));
  scene(at(catSit(86, C.slate, { eye: '#f2c84a' }), cx - 22 * u, by - 94 * u));
  scene(at(catLoaf(98, C.ginger, { pat: 'tabby' }), cx + 22 * u, by - 66 * u));
  scene(at(catPeek(46, C.white, { pat: 'calico' }), cx - 17 * u, by - 9.5 * u));
  target('fish-biscuit', 'Fish biscuit', at(fishBiscuit(44), cx - 1.5 * u, by - 41.5 * u, 1, -8));
}

// =====================================================================
// tables
// =====================================================================
scene(at(bistroChair(230, '#3b2a22'), 110, 1160), at(bistroChair(230, '#3b2a22'), 470, 1160));
scene(at(cafeTable(232, 184, '#f6ead6'), 290, 1170));
{
  const ty = 984;
  target('milk-jug', 'Milk jug', at(jug(48, '#fbf6ec', '#6f8fd6'), 206, ty));
  target('teapot', 'Pink teapot', at(teapot(60, '#e89ab0'), 268, ty));
  scene(stroke(curve([[250, ty - 50], [258, ty - 66], [250, ty - 82]]), '#ffffff', 2.4, { opacity: 0.6 }));
  scene(at(teacup(26, '#e89ab0'), 326, ty));
  scene(sh(ellipse(372, ty - 3, 30, 6), '#fbf6ec', { stroke: '#d9cfb8', strokeWidth: 1 }));
  target('cake-slice', 'Slice of cake', at(cakeSlice(46), 372, ty - 8));
}
scene(at(armchair(214, '#5c8a4e', 1), 1092, 1140));
scene(at(cushion(62, '#e89ab0', '#fbf6ec', 2, 8), 1094, 1018));
scene(at(bistroChair(220, '#3b2a22'), 812, 1196));
scene(at(cafeTable(214, 180, '#f6ead6'), 962, 1210));
{
  const ty = 1028;
  scene(sh(ellipse(894, ty - 3, 34, 7), '#fbf6ec', { stroke: '#d9cfb8', strokeWidth: 1 }));
  target('croissant', 'Croissant', at(croissant(54), 894, ty - 6));
  target('spectacles', 'Spectacles', at(spectacles(54, '#5a3a2a'), 962, ty - 6));
  target('cappuccino', 'Cappuccino', at(cappuccino(27, '#fbf6ec', '#c8473a'), 1030, ty + 2));
}

// =====================================================================
// foreground
// =====================================================================
scene(sh(ellipse(470, 1396, 400, 96), '#d98a7a'), stroke(ellipse(470, 1396, 368, 84) + ellipse(470, 1396, 296, 62), '#fbf3e4', 3, { opacity: 0.8 }), stroke(ellipse(470, 1396, 332, 73), '#7a4a62', 2.4, { opacity: 0.7 }));
{
  // basket of yarn
  scene(at(yarnBall(30, '#e89ab0'), 96, 1336), at(yarnBall(28, '#d9a53a'), 160, 1332), at(yarnBall(26, '#3f7f7a'), 128, 1310));
  scene(at(basket(160, 88, '#c99a5b'), 128, 1352));
}
scene(stroke(curve([[140, 1400], [200, 1460], [270, 1440], [300, 1414]]), '#5aa8d8', 2.2));
target('yarn', 'Blue ball of yarn', at(yarnBall(30, '#5aa8d8'), 326, 1418));
scene(at(catSit(112, C.ginger, { pat: 'tabby', head: 1.18, collar: C.teal }), 450, 1460));
target('toy-mouse', 'Toy mouse', at(toyMouse(54), 590, 1474));
target('feather-wand', 'Feather wand', at(featherWand(124), 664, 1486));
scene(at(petBed(240, C.mustard), 880, 1462), at(catCurl(156, C.grey, { pat: 'tabby' }), 880, 1436), at(petBedFront(240, C.mustard, '#fbf6ec'), 880, 1462));
scene(at(petBowl(84, '#e89ab0', '#9a6238', 'fish'), 1050, 1486), at(petBowl(70, '#5aa8d8', '#8fd0dc', 'paw'), 560, 1268));
scene(at(monstera(300, 7, '#f6ead2', 0.42), 1140, 1498));
scene(at(catWalk(128, C.black, { pat: 'tux' }), 690, 1300));
scene(at(boxBack(120, 84), 60, 1220), at(catPeek(58, C.cream, { pat: 'plain' }), 60, 1138), at(boxFront(120, 84), 60, 1220));
scene(bookStack(770, 1250, 60, 3, rng(21)).shapes);
void line;

const activity: FindActivity = {
  id: 'pets-find-3', version: 1, mode: 'find', title: 'The Cat Café', blurb: 'Cats nap on every shelf, cushion and windowsill of this cosy tea room, where fourteen treats and playthings are tucked among the whiskers.',
  collectionId: 'pets', categories: ["Animals", "Pets"], difficulty: 'Moderate',
  added: '2026-11-26',
  width: W, height: H, defs, items,
};
export default activity;
