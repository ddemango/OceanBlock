import { rect, ellipse, circle, poly, line, curve, sh, stroke, place, shade, mix, rng, linearGradient } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { FindActivity, FindItem } from '../types';
import { M, Q, ol, shadow, teapot, mug } from '../kitchen/props-find';
import { woodFloor, armchair, cafeTable, floorLamp, cushion, monstera, pendant, slippers } from '../cafe/props-find';
import { fern, bookStack } from '../library/props';
import {
  Y, RAINBOW, dash, gardenView, windowFrame, bunting, wovenBasket, shears, tapeMeasure, yarnBall, skein, yarnCake, cubbyYarn, pompom, bobbleHat, sock, mitten, miniSweater, peg,
  knitting, crochetHook, yarnBowl, swift, ballWinder, needleJar, sleepingCat, toySheep, toteBag,
} from './props-find';

const ID = 'crafts-find-2';
const W = 1200, H = 1500;
const items: FindItem[] = [];
const scene = (...s: (Shape | Shape[])[]) => { items.push({ shapes: s.flat() }); };
const target = (id: string, name: string, shapes: Shape[]) => { items.push({ id, name, target: true, shapes }); };
const at = (s: Shape[], x: number, y: number, k = 1, rot = 0) => place(s, { x, y, s: k, rot });

const defs = linearGradient(`${ID}-sky`, [[0, '#a9d4e8'], [0.6, '#d6ebf0'], [1, '#f6f1d8']]);

// =====================================================================
// wall
// =====================================================================
scene(sh(rect(0, 0, W, 780), '#d3e2d8'));
{
  let pan = '';
  for (let x = 30; x < W; x += 60) pan += line([[x, 30], [x, 770]]);
  scene(stroke(pan, '#bfd2c6', 2), sh(rect(0, 0, W, 30), '#f8f1e0'), sh(rect(0, 26, W, 5), '#c9d6c2'), sh(rect(0, 752, W, 28), '#f8f1e0'), sh(rect(0, 752, W, 4), '#c9c2a6'));
}

// =====================================================================
// shop window (right) with a village green outside
// =====================================================================
{
  const x0 = 866, y0 = 112, w = 290, h = 410;
  scene(gardenView(x0, y0, w, h, `url(#${ID}-sky)`, 9));
  // striped awning seen through the top of the glass
  let a = '', b = '';
  for (let i = 0; i < 10; i++) { const x = x0 + i * 29; const q = M(x, y0) + `L${x + 29} ${y0}L${x + 29} ${y0 + 44}` + Q(x + 14.5, y0 + 62, x, y0 + 44) + 'Z'; if (i % 2) a += q; else b += q; }
  scene(sh(a, '#e8836a'), sh(b, '#fbf6ea'), sh(rect(x0, y0 + 40, w, 4), '#000000', { opacity: 0.08 }));
  scene(windowFrame(x0, y0, w, h, '#f8f1e0', 2, 1, '#d7a970'));
  // on the sill
  scene(at(yarnCake(50, RAINBOW[8]), 902, 530), at(yarnCake(44, RAINBOW[11]), 950, 530), at(yarnCake(40, RAINBOW[3]), 926, 498));
  scene(stroke(line([[1100, 530], [1100, 478]]), '#b98552', 5), sh(rect(1082, 524, 36, 6, 3), '#7a5232'));
  target('hat', 'Bobble hat', at(bobbleHat(74, '#cf4a3c', '#fbf6ea'), 1100, 492));
  scene(at(fern(rng(3), 50, 30, 26, '#e0a93a', 8), 1150, 530));
}
scene(bunting([[800, 34], [1000, 40], [1200, 34]], 26, 34, ['#e8836a', '#f3d77a', '#7fb0d0', '#fbf6ea', '#9cb48a'], 24));
target('scissors', 'Scissors', at(shears(86, '#cf4a3c'), 826, 300, 1, 90));
scene(stroke(line([[826, 246], [826, 262]]), '#6f7a82', 3), sh(circle(826, 244, 4), '#7a5232'));
// little framed sign with a ball of yarn
scene(ol(rect(800, 400, 52, 62, 3), '#b98552', 1.2), sh(rect(806, 406, 40, 50), '#fbf6ea'), at(yarnBall(13, '#e8836a', true), 822, 428));

// =====================================================================
// the wall of yarn: cubbies in rainbow order
// =====================================================================
{
  const x0 = 40, y0 = 152, cols = 8, rows = 5, cw = 94, ch = 112, t = 8;
  const hues = [0, 2, 3, 5, 7, 8, 10, 12];
  scene(sh(rect(x0 + 8, y0 + 8, cols * cw + t, rows * ch + t + 54), '#000000', { opacity: 0.12 }), sh(rect(x0, y0, cols * cw + t, rows * ch + t), '#8a623c'));
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const col = r < 2 ? mix(RAINBOW[hues[c]], '#ffffff', (1 - r) * 0.22 + 0.04) : mix(RAINBOW[hues[c]], '#2a1a10', (r - 2) * 0.1);
    const ix = x0 + t + c * cw, iy = y0 + (r + 1) * ch;
    scene(sh(rect(ix, iy - ch + t, cw - t, 12), '#000000', { opacity: 0.2 }), place(cubbyYarn((r * 2 + c) % 3, cw - t, ch - t, col, r * 10 + c + 1), { x: ix, y: iy }));
  }
  const fr: Shape[] = [];
  const wood = '#d7a970';
  for (let r = 0; r <= rows; r++) fr.push(sh(rect(x0, y0 + r * ch, cols * cw + t, t), wood), sh(rect(x0, y0 + r * ch, cols * cw + t, 2), shade(wood, 0.25)));
  let v = '';
  for (let c = 0; c <= cols; c++) v += rect(x0 + c * cw, y0, t, rows * ch + t);
  fr.push(sh(v, shade(wood, -0.08)), stroke(rect(x0, y0, cols * cw + t, rows * ch + t), '#8a623c', 1.6), ol(rect(x0 - 8, y0 - 10, cols * cw + t + 16, 12, 3), shade(wood, 0.1), 1, -0.35), ol(rect(x0 - 4, y0 + rows * ch + t, cols * cw + t + 8, 60, 3), shade(wood, -0.12), 1, -0.35));
  // price tags on the shelf edges
  let tags = '';
  for (let r = 1; r <= rows; r++) for (let c = 0; c < cols; c += 2) tags += rect(x0 + t + c * cw + ((r % 2) ? 30 : 76), y0 + r * ch - 1, 22, 10, 1.5);
  fr.push(sh(tags, '#fbf6ea'));
  scene(fr);
  // drawers in the plinth
  let dr = '', kn = '';
  for (let c = 0; c < 4; c++) { dr += rect(x0 + 10 + c * 188, y0 + rows * ch + t + 8, 176, 42, 3); kn += circle(x0 + 98 + c * 188, y0 + rows * ch + t + 29, 5); }
  scene(stroke(dr, '#9a6f40', 1.6), ol(kn, '#c9a24a', 0.8));
  // on top of the unit
  target('sheep', 'Toy sheep', at(toySheep(72), 690, y0 - 10));
  scene(at(needleJar(40, 3, '#fbf6ea', '#e8836a'), 760, y0 - 10));
}
// knitted samples pegged to a line
{
  const yAt = (x: number) => 46 + 22 * (1 - Math.pow((x - 310) / 300, 2));
  scene(stroke(M(10, 46) + Q(310, 90, 610, 46), '#8a6a4a', 1.8), sh(circle(10, 46, 4) + circle(610, 46, 4), '#7a5232'));
  scene(at(miniSweater(74, '#e0a93a', '#fbf6ea'), 92, yAt(92) + 4), at(peg(16), 74, yAt(74) + 4), at(peg(16), 110, yAt(110) + 4));
  target('sock', 'Striped sock', at(sock(74, '#3f8a84', '#fbf6ea'), 196, yAt(196) + 2));
  scene(at(peg(16), 196, yAt(196) + 4));
  // triangular shawl
  { const x = 290, y = yAt(290) + 4; let st = ''; for (let i = 1; i < 5; i++) st += line([[x - 46 + i * 9.2, y + i * 13], [x + 46 - i * 9.2, y + i * 13]]); scene(ol(poly([[x - 46, y], [x + 46, y], [x, y + 66]]), '#b39ad0', 1.2), stroke(st, '#fbf6ea', 2, { opacity: 0.8 }), at(pompom(6, '#fbf6ea'), x, y + 70), at(peg(16), x - 36, y + 2), at(peg(16), x + 36, y + 2)); }
  target('mitten', 'Mitten', at(mitten(70, '#cf4a3c', '#fbf6ea'), 388, yAt(388) + 2));
  scene(at(peg(16), 388, yAt(388) + 4));
  scene(at(miniSweater(70, '#7fb0d0', '#3a4f7a'), 484, yAt(484) + 4), at(peg(16), 466, yAt(466) + 4), at(peg(16), 502, yAt(502) + 4));
  { const x = 566, y = yAt(566) + 4; scene(ol(rect(x - 14, y, 28, 84, 3), '#9cb48a', 1.1), sh(rect(x - 14, y + 14, 28, 8) + rect(x - 14, y + 34, 28, 8) + rect(x - 14, y + 54, 28, 8), '#fbf6ea'), stroke(dash([[x - 12, y + 88], [x + 12, y + 88]], 2, 3), '#9cb48a', 8), at(peg(16), x, y + 2)); }
}

// =====================================================================
// floor
// =====================================================================
scene(woodFloor(780, H, W, ['#c8996a', '#bb8a5a', '#d2a678', '#b28052'], 21));
scene(sh(rect(0, 780, W, 14), '#000000', { opacity: 0.14 }));

// baskets of yarn in front of the shelves
{
  const g = rng(5);
  const spots: [number, number, number][] = [[130, 0, 2], [330, 5, 7], [530, 9, 11]];
  for (const [bx, a, b] of spots) {
    const cs = [RAINBOW[a], RAINBOW[b], shade(RAINBOW[a], 0.2), shade(RAINBOW[b], -0.12), RAINBOW[(a + 1) % 13]];
    const pos: [number, number][] = [[-50, -92], [0, -98], [50, -92], [-26, -128], [26, -130]];
    pos.forEach(([dx, dy], i) => scene(at(yarnBall(30, cs[i]), bx + dx, 890 + dy, 1, g.range(-50, 50))));
    scene(at(wovenBasket(176, 84, bx === 330 ? '#b98552' : '#cfa064'), bx, 890));
  }
  target('tape', 'Tape measure', place(tapeMeasure(104), { x: 716, y: 846, sy: 0.84 }));
}

// =====================================================================
// counter with the swift and ball winder
// =====================================================================
{
  const cx = 812, cy = 640;
  scene(sh(rect(cx + 12, cy + 20, 388, 222), '#3f8a84'), sh(rect(cx + 12, cy + 20, 388, 10), '#000000', { opacity: 0.2 }), sh(rect(cx + 12, cy + 224, 388, 18), '#2f6e69'));
  scene(stroke(rect(cx + 28, cy + 44, 110, 164, 4) + rect(cx + 152, cy + 44, 110, 164, 4) + rect(cx + 276, cy + 44, 110, 164, 4), '#2f6e69', 2.4), stroke(rect(cx + 36, cy + 52, 94, 148, 3) + rect(cx + 160, cy + 52, 94, 148, 3) + rect(cx + 284, cy + 52, 94, 148, 3), '#5aa39c', 1.4));
  // hanks hanging on the counter front
  scene(sh(rect(cx + 30, cy + 62, 352, 6, 3), '#c9a24a'));
  [1, 4, 6, 9, 11, 12, 3].forEach((k, i) => scene(place(skein(104, RAINBOW[k], false), { x: cx + 58 + i * 50, y: cy + 122, rot: 90 }), stroke(line([[cx + 58 + i * 50, cy + 64], [cx + 58 + i * 50, cy + 74]]), '#8a6a2a', 3)));
  scene(ol(rect(cx, cy, 400, 22, 4), '#d7a970', 1.2, -0.35), sh(rect(cx, cy, 400, 5, 3), '#ebc590'));
  scene(at(swift(220, '#e8836a'), 912, cy));
  scene(stroke(curve([[1000, cy - 125], [1060, cy - 112], [1101, cy - 92]]), '#e8836a', 1.4));
  target('winder', 'Ball winder', at(ballWinder(112, '#3f8a84', '#e8836a'), 1064, cy));
  scene(at(needleJar(50, 7, '#fbf6ea', '#3a4f7a'), 1152, cy), at(yarnBall(15, RAINBOW[3]), 1186, cy - 15), at(yarnBall(13, RAINBOW[9]), 838, cy - 13));
}
target('tote', 'Tote bag', at(toteBag(130, '#f6ecd6', '#e8836a'), 880, 930));
scene(at(yarnBall(20, RAINBOW[7]), 866, 836), at(yarnBall(18, RAINBOW[4]), 898, 840));
// crate of hanks and pattern books
{
  const x = 1066, y = 1090;
  let sl = '';
  for (let i = 0; i < 4; i++) sl += rect(x - 110, y - 100 + i * 26, 220, 20, 2);
  scene(shadow(x, y, 120, 10), sh(rect(x - 104, y - 100, 208, 98), '#7a5232'), ol(sl, '#d2a165', 1, -0.35), ol(rect(x - 112, y - 104, 16, 104, 2) + rect(x + 96, y - 104, 16, 104, 2), '#b98552', 1, -0.35));
  scene(at(skein(120, RAINBOW[10]), x - 44, y - 122), at(skein(120, RAINBOW[5]), x + 50, y - 120), at(skein(116, RAINBOW[2]), x + 2, y - 156), at(skein(110, RAINBOW[8], false), x - 30, y - 190, 1, -6));
  scene(bookStack(x - 160, y, 70, 4, rng(8)).shapes);
}

// =====================================================================
// the knitting circle
// =====================================================================
scene(sh(ellipse(436, 1230, 430, 120), '#2f6e69'), sh(ellipse(436, 1230, 406, 108), '#3f8a84'), stroke(ellipse(436, 1230, 366, 95), '#fbf0d8', 4), stroke(ellipse(436, 1230, 320, 82) + ellipse(436, 1230, 226, 54), '#f3d77a', 3), stroke(ellipse(436, 1230, 274, 68), '#e8836a', 5));
scene(at(floorLamp(360, '#f3d9a4', '#3b2f2a'), 52, 1160));
scene(at(armchair(260, '#e8836a', 2), 196, 1270));
target('cat', 'Cat', at(sleepingCat(140, '#9a8a80', '#f1e8dc'), 198, 1157));
scene(at(armchair(260, '#e0a93a', 1), 690, 1270));
scene(at(cushion(70, '#3a4f7a', '#fbf6ea', 1, 8), 640, 1108));
target('knitting', 'Knitting', at(knitting(96, '#7a4a6e'), 716, 1110, 1, 6));
scene(at(cafeTable(170, 150, '#d7a970', '#7a5232'), 440, 1322));
target('teapot', 'Teapot', at(teapot(58, '#7fb0d0'), 404, 1172));
scene(at(mug(26, '#fbf6ea', '#e8836a'), 362, 1172));
target('bowl', 'Yarn bowl', at(yarnBowl(62, '#9cb48a', '#e0a93a'), 480, 1172));
scene(at(yarnBall(24, RAINBOW[11], true), 330, 1372, 1, 20));
target('hook', 'Crochet hook', at(crochetHook(96, '#7a4a6e'), 452, 1436, 1, -18));
// project basket, slippers and a footstool at the front
scene(at(skein(92, RAINBOW[8]), 96, 1392, 1, -8), at(skein(92, RAINBOW[2]), 150, 1386, 1, 10), at(yarnBall(26, RAINBOW[5]), 70, 1376), []);
scene(stroke(line([[150, 1400], [196, 1330]]) + line([[120, 1400], [90, 1326]]), '#d7a970', 4), sh(circle(196, 1330, 5) + circle(90, 1326, 5), '#cf4a3c'));
scene(at(wovenBasket(190, 86, '#b98552'), 120, 1480));
scene(at(slippers(70, '#e79ab0'), 300, 1470));
scene(shadow(640, 1486, 90, 9), sh(rect(580, 1456, 10, 30) + rect(690, 1456, 10, 30), '#7a5232'), ol(rect(560, 1396, 160, 64, 26), '#7a4a6e', 1.2), sh(ellipse(640, 1402, 74, 14), '#8f5c82'), stroke(curve([[568, 1430], [640, 1440], [712, 1430]]), '#5e3654', 2));

// =====================================================================
// foreground: giant basket and a plant
// =====================================================================
{
  const bx = 960, by = 1470;
  const cs = [RAINBOW[1], RAINBOW[8], RAINBOW[3], RAINBOW[12], RAINBOW[6]];
  const pos: [number, number][] = [[-82, -150], [0, -160], [82, -150], [-42, -212], [44, -214]];
  pos.forEach(([dx, dy], i) => scene(at(yarnBall(50, cs[i]), bx + dx, by + dy, 1, i * 37)));
  scene(at(wovenBasket(290, 140, '#c99a5b'), bx, by));
  scene(at(monstera(260, 4, '#f6ecd6', 0.4), 1150, 1496));
}
scene(at(pendant(40, 56, '#e0a93a', false), 820, 30));

const activity: FindActivity = {
  id: 'crafts-find-2', version: 1, mode: 'find', title: 'The Yarn Shop',
  blurb: 'A wall of wool in rainbow order, a snoozing shop cat and two armchairs by the teapot hide thirteen things for knitters.',
  collectionId: 'crafts', categories: ["Crafts", "Cozy"], difficulty: 'Relaxed',
  added: '2026-11-26',
  width: W, height: H, defs, items,
};
export default activity;
