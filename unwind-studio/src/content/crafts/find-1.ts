import { rect, ellipse, circle, poly, line, curve, blob, sh, stroke, place, shade, rng, linearGradient } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { FindActivity, FindItem } from '../types';
import { M, Q, ol, shadow, wallpaper, clock, teacup } from '../kitchen/props-find';
import { woodFloor } from '../cafe/props-find';
import { fern, leafy, ivy, ribbon } from '../library/props';
import {
  Y, RAINBOW, dash, gardenView, windowFrame, curtain, patchwork, wovenBasket, chairBack, deskLamp, spool, spoolLoose, threadRack, button, buttonJar, pinCushion, shears,
  tapeMeasure, thimble, sewingMachine, dressForm, fabricStack, bolt, iron, bobbin, safetyPin, embroideryHoop, ribbonReel, tailorsChalk, patternEnvelope, patternPiece,
} from './props-find';

const ID = 'crafts-find-1';
const W = 1200, H = 1500;
const items: FindItem[] = [];
const scene = (...s: (Shape | Shape[])[]) => { items.push({ shapes: s.flat() }); };
const target = (id: string, name: string, shapes: Shape[]) => { items.push({ id, name, target: true, shapes }); };
const at = (s: Shape[], x: number, y: number, k = 1, rot = 0) => place(s, { x, y, s: k, rot });

const defs = linearGradient(`${ID}-sky`, [[0, '#9fd0ea'], [0.6, '#cfe8f2'], [1, '#f3f4dc']]);
const FAB = ['#cf4a3c', '#e8836a', '#e0a93a', '#f3d77a', '#9cb48a', '#5c8a4e', '#3f8a84', '#7fb0d0', '#3a4f7a', '#7a4a6e', '#e79ab0', '#f6ecd6'];

// =====================================================================
// wall
// =====================================================================
scene(wallpaper(0, 0, W, 800, 62, '#f4e8cf', '#9cb48a', '#e8a08a', 5));
scene(sh(rect(0, 0, W, 34), '#e2cfa6'), sh(rect(0, 30, W, 6), '#c9b388'), sh(rect(0, 796, W, 30), '#f8f1e0'), sh(rect(0, 796, W, 5), '#d9cbaa'), sh(rect(0, 820, W, 6), '#b9a888'));

// =====================================================================
// window with garden view
// =====================================================================
{
  const x0 = 386, y0 = 112, w = 292, h = 388;
  scene(gardenView(x0, y0, w, h, `url(#${ID}-sky)`, 4));
  scene(windowFrame(x0, y0, w, h, '#fbf6ea', 2, 3, '#d7a970'));
  scene(stroke(line([[326, 86], [738, 86]]), '#7a5232', 6), sh(circle(326, 86, 8) + circle(738, 86, 8), '#c9a24a'));
  scene(curtain(340, 88, 96, 440, '#e8836a', 1, '#fbf6ea'), curtain(724, 88, 96, 440, '#e8836a', -1, '#fbf6ea'));
  // sunbeam across the room
  scene(sh(poly([[x0, y0 + h], [x0 + w, y0 + h], [x0 + w + 330, 1500], [x0 - 120, 1500]]), '#fff3c4', { opacity: 0.07 }));
  // on the sill
  scene(at(leafy(rng(3), 46, 30, 26, '#7fb0d0', 7), 392, 508));
  scene(at(buttonJar(30, 42, 4), 452, 508), at(buttonJar(34, 52, 9, Y.red, [Y.sky, Y.navy, Y.teal, '#fbf6ea', Y.lilac]), 492, 508), at(buttonJar(28, 36, 2, Y.teal, [Y.red, Y.coral, Y.rose, Y.butter]), 530, 508));
  target('thimble', 'Thimble', at(thimble(30), 572, 508));
  scene(at(spool(34, Y.teal), 610, 508), at(spool(30, Y.mustard), 636, 508), at(spool(26, Y.plum), 624, 478));
  target('bobbin', 'Bobbin', at(bobbin(11, Y.red), 664, 496));
}
scene(at(clock(32, '#3f8a84'), 762, 176));

// =====================================================================
// fabric shelves (left)
// =====================================================================
{
  const x0 = 30, x1 = 300, top = 122, boards = [252, 386, 520, 654, 788];
  const wood = '#b98552';
  scene(sh(rect(x0 + 6, top + 8, x1 - x0, 820 - top), '#000000', { opacity: 0.12 }), sh(rect(x0, top, x1 - x0, 824 - top), '#6e4a2e'));
  let grain = '';
  for (let x = x0 + 30; x < x1; x += 34) grain += line([[x, top + 12], [x, 790]]);
  scene(stroke(grain, '#5e3e26', 1.4, { opacity: 0.7 }));
  // things on top of the unit
  scene(at(ivy(rng(6), 70, 40, 30, '#f6ecd6'), 70, top), ol(rect(120, top - 44, 96, 44, 6), '#7fb0d0', 1.2), sh(rect(116, top - 50, 104, 14, 4), '#6a9cc0'), stroke(line([[120, top - 22], [216, top - 22]]), '#fbf6ea', 3), ol(rect(132, top - 80, 72, 30, 5), '#e79ab0', 1.2), sh(rect(128, top - 86, 80, 12, 4), '#d27f98'));
  scene(at(wovenBasket(60, 40, '#c99a5b'), 262, top), at(spool(22, Y.red), 250, top - 44), at(spool(22, Y.sky), 274, top - 44));
  // row 1: bolts on end
  { const g = rng(11); let x = x0 + 34; for (let i = 0; x < x1 - 26; i++) { const w = g.range(28, 38), h = g.range(88, 118); scene(at(bolt(w, h, FAB[(i * 5 + 2) % FAB.length], i % 4), x, boards[0])); x += w + 3; } }
  // row 2: folded stacks
  scene(at(fabricStack(108, [FAB[8], FAB[6], FAB[11], FAB[4], FAB[2], FAB[0], FAB[7]], 2), 96, boards[1]), at(fabricStack(108, [FAB[10], FAB[1], FAB[3], FAB[9], FAB[5], FAB[11]], 5), 222, boards[1]));
  // row 3: more bolts, a jar and ribbon
  { const g = rng(23); let x = x0 + 32; for (let i = 0; x < 180; i++) { const w = g.range(26, 36), h = g.range(84, 112); scene(at(bolt(w, h, FAB[(i * 7 + 5) % FAB.length], (i + 2) % 4), x, boards[2])); x += w + 3; } }
  scene(at(buttonJar(40, 60, 7, Y.mustard), 218, boards[2]));
  target('ribbon', 'Reel of ribbon', at(ribbonReel(20, '#e79ab0'), 258, boards[2] - 22));
  scene(at(ribbonReel(13, Y.teal).slice(2), 262, boards[2] - 60), at(ribbonReel(13, Y.mustard).slice(2), 240, boards[2] - 78));
  // row 4: stacks and a pattern envelope
  scene(at(fabricStack(96, [FAB[5], FAB[3], FAB[0], FAB[7], FAB[10]], 7), 88, boards[3]), at(fabricStack(80, [FAB[9], FAB[2], FAB[6]], 3), 180, boards[3]));
  scene(at(patternEnvelope(54, '#7fb0d0'), 252, boards[3], 1, 5));
  target('pattern', 'Sewing pattern', at(patternEnvelope(64, '#e8836a'), 220, boards[3], 1, -7));
  // row 5: baskets of rolls
  for (const [bx, k] of [[100, 0], [228, 5]] as [number, number][]) {
    scene(at(bolt(24, 84, FAB[k], 1), bx - 30, boards[4] - 20), at(bolt(24, 96, FAB[k + 3], 2), bx - 4, boards[4] - 20), at(bolt(24, 78, FAB[k + 6], 3), bx + 24, boards[4] - 20));
    scene(at(wovenBasket(110, 62, k ? '#b98552' : '#d2a565'), bx, boards[4]));
  }
  // frame and boards on top of the contents
  const fr: Shape[] = [];
  for (const b of boards) fr.push(sh(rect(x0, b, x1 - x0, 12), wood), sh(rect(x0, b, x1 - x0, 3), shade(wood, 0.2)), sh(rect(x0, b + 12, x1 - x0, 5), '#000000', { opacity: 0.18 }));
  fr.push(ol(rect(x0 - 8, top - 2, 16, 826 - top), wood, 1, -0.35), ol(rect(x1 - 8, top - 2, 16, 826 - top), wood, 1, -0.35), ol(rect(x0 - 14, top - 12, x1 - x0 + 28, 16, 3), shade(wood, 0.1), 1, -0.35), sh(rect(x0 - 8, 800, x1 - x0 + 16, 26), shade(wood, -0.12)));
  scene(fr);
}

// =====================================================================
// thread rack and pegboard (right)
// =====================================================================
scene(at(threadRack(9, 3, 40, [...RAINBOW, '#f6ecd6', '#3b2f2a'], 14), 800, 96));
{
  const x0 = 792, y0 = 312, w = 370, h = 186;
  let holes = '';
  for (let y = y0 + 16; y < y0 + h - 6; y += 20) for (let x = x0 + 16; x < x0 + w - 6; x += 20) holes += circle(x, y, 2);
  scene(sh(rect(x0 + 4, y0 + 6, w, h, 5), '#000000', { opacity: 0.14 }), ol(rect(x0, y0, w, h, 5), '#efe1c2', 1.4, -0.3), sh(holes, '#b8a47e'));
  // hooks
  scene(stroke(line([[846, 336], [846, 352]]) + line([[944, 330], [944, 340]]) + line([[1040, 328], [1040, 340]]) + line([[1124, 328], [1124, 340]]), '#6f7a82', 3));
  target('scissors', 'Scissors', at(shears(112, '#3b2f2a'), 846, 402, 1, 90));
  scene(stroke(circle(944, 384, 38), '#d7a970', 6), stroke(circle(944, 384, 38), '#a47a48', 1), stroke(circle(944, 384, 32), '#a47a48', 1), ol(rect(939, 336, 10, 12, 2), '#c9a24a', 0.8));
  target('hoop', 'Embroidery hoop', at(embroideryHoop(42), 1040, 400));
  // tailor's ruler
  let tk = '';
  for (let y = 350; y < 480; y += 9) tk += line([[1114, y], [(y - 350) % 27 === 0 ? 1126 : 1121, y]]);
  scene(ol(rect(1114, 338, 22, 148, 3), '#e6c07a', 1, -0.35), stroke(tk, '#5a4636', 1), sh(circle(1125, 345, 3), '#5a4636'));
  // card of buttons
  scene(ol(rect(884, 440, 40, 48, 3), '#fbf6ea', 0.9, -0.3), at(button(7, Y.teal), 896, 454), at(button(7, Y.teal), 912, 454), at(button(7, Y.teal), 896, 474), at(button(7, Y.teal), 912, 474), sh(circle(904, 444, 2), '#8a7a66'));
}

// =====================================================================
// floor and rug
// =====================================================================
scene(woodFloor(826, H, W, ['#c99a62', '#bd8c54', '#d4a670', '#b5834c'], 9));
scene(sh(rect(0, 826, W, 14), '#000000', { opacity: 0.14 }));
scene(sh(poly([[386, 826], [678, 826], [1008, 1500], [266, 1500]]), '#fff3c4', { opacity: 0.1 }));
scene(sh(ellipse(800, 1196, 404, 86), '#b9503e'), sh(ellipse(800, 1196, 380, 76), '#e8836a'), stroke(ellipse(800, 1196, 340, 64), '#fbf0d8', 4), stroke(ellipse(800, 1196, 300, 53) + ellipse(800, 1196, 210, 34), '#3f8a84', 3), stroke(dash(Array.from({ length: 61 }, (_, i) => [800 + Math.cos((i / 60) * Math.PI * 2) * 255, 1196 + Math.sin((i / 60) * Math.PI * 2) * 43] as [number, number]), 10, 8), '#f3d77a', 3));

// big basket of bolts under the shelves and a fern
scene(at(bolt(34, 150, FAB[6], 2), 96, 1030), at(bolt(34, 176, FAB[0], 1), 134, 1030), at(bolt(34, 140, FAB[3], 3), 172, 1030), at(bolt(34, 164, FAB[9], 0), 208, 1030, 1, 6));
scene(at(wovenBasket(200, 120, '#c99a5b'), 150, 1090));
scene(at(fern(rng(8), 110, 64, 52, '#3f8a84', 12), 300, 960));

// =====================================================================
// sewing table with the machine and the quilt in progress
// =====================================================================
{
  const tx = 500, tw = 682, ty = 700;
  scene(shadow(tx + tw / 2, 1064, tw * 0.5, 12, 0.16));
  scene(ol(rect(tx + 18, ty + 20, 30, 344, 3), '#a8743f', 1, -0.35), ol(rect(tx + tw - 48, ty + 20, 30, 344, 3), '#a8743f', 1, -0.35), sh(rect(tx + 40, ty + 20, 8, 344), '#000000', { opacity: 0.12 }));
  scene(ol(rect(tx + 14, ty + 20, tw - 28, 54, 3), '#b98552', 1, -0.35), stroke(rect(tx + 330, ty + 30, 150, 36, 3) + rect(tx + 496, ty + 30, 130, 36, 3), '#8a5e36', 1.6), ol(circle(tx + 405, ty + 48, 6), '#c9a24a', 0.8) , ol(circle(tx + 561, ty + 48, 6), '#c9a24a', 0.8));
  // sewing basket under the table
  scene(at(bolt(26, 80, FAB[10], 2), 650, 1120), at(bolt(26, 96, FAB[7], 1), 682, 1120), at(bolt(26, 70, FAB[4], 3), 716, 1120), at(spool(30, Y.mustard), 746, 1090));
  scene(at(wovenBasket(170, 78, '#b98552'), 696, 1176));
  // quilt draped over the front of the table
  const qx = 522, qy = ty - 2, s = 56;
  const qpal = ['#cf4a3c', '#f6ecd6', '#3f8a84', '#f3d77a', '#3a4f7a', '#e79ab0', '#9cb48a'];
  scene(sh(rect(qx + 6, qy + 6, s * 5 + 12, s * 4 + 22), '#000000', { opacity: 0.15 }));
  scene(sh(rect(qx - 8, qy, s * 5 + 16, s * 4 + 16), '#3a4f7a'), place(patchwork(5, 4, s, qpal, 12), { x: qx, y: qy }));
  scene(sh(rect(qx + 62, qy, 16, s * 4 + 16) + rect(qx + 196, qy, 22, s * 4 + 16), '#000000', { opacity: 0.09 }), sh(rect(qx + 120, qy, 14, s * 4 + 16) + rect(qx + 250, qy, 10, s * 4 + 16), '#ffffff', { opacity: 0.1 }), stroke(dash([[qx - 4, qy + s * 4 + 8], [qx + s * 5 + 4, qy + s * 4 + 8]], 6, 5), '#fbf6ea', 1.4));
  // table top
  scene(ol(rect(tx, ty, tw, 22, 4), '#d2a165', 1.2, -0.35), sh(rect(tx, ty, tw, 5, 3), '#e6bd86'));
  // quilt bunched on the table, running under the needle
  scene(ol(blob([[516, 702], [526, 668], [580, 650], [640, 662], [700, 652], [756, 668], [806, 676], [812, 702]], 0.8), '#3a4f7a', 1.2), sh(blob([[536, 700], [546, 676], [590, 664], [640, 674], [650, 700]], 0.8), '#cf4a3c'), sh(blob([[650, 700], [652, 676], [700, 664], [740, 676], [746, 700]], 0.8), '#f3d77a'), sh(blob([[746, 700], [748, 680], [790, 682], [800, 700]], 0.8), '#f6ecd6'));
  scene(stroke(curve([[540, 690], [590, 672], [640, 684], [700, 670], [760, 686], [804, 690]]) + curve([[600, 700], [606, 680], [596, 666]]) + curve([[706, 700], [700, 682], [712, 668]]), '#2a3a5c', 1.4, { opacity: 0.7 }), stroke(dash([[548, 696], [640, 692], [730, 696], [800, 696]], 5, 4), '#fbf6ea', 1.2));
  scene(at(sewingMachine(300, '#2f3f4a', Y.red), 880, ty));
  target('pin-cushion', 'Pin cushion', at(pinCushion(46), 1066, ty));
  scene(at(deskLamp(150, '#3f8a84'), 1128, ty));
  
}
scene(at(chairBack(400, '#a8743f', '#3f8a84'), 1010, 1110));
target('spool', 'Spool of yellow thread', at(spoolLoose(40, '#f0bf45'), 1150, 1150, 1, -78));
target('safety-pin', 'Safety pin', at(safetyPin(46), 566, 1160, 1, -14));

// =====================================================================
// dress form with a half-pinned skirt
// =====================================================================
{
  const fx = 405, fy = 1130, h = 600;
  scene(at(dressForm(h, '#ecdfc4'), fx, fy));
  const sk = M(fx - h * 0.1, fy - h * 0.62) + Q(fx, fy - h * 0.6, fx + h * 0.1, fy - h * 0.62) + Q(fx + h * 0.17, fy - h * 0.46, fx + h * 0.21, fy - h * 0.25) + Q(fx, fy - h * 0.21, fx - h * 0.21, fy - h * 0.25) + Q(fx - h * 0.17, fy - h * 0.46, fx - h * 0.1, fy - h * 0.62) + 'Z';
  let dots = '', folds = '';
  const g = rng(31);
  for (let i = 0; i < 46; i++) { const t = g.range(0.08, 0.92), yy = fy - h * (0.58 - t * 0.33), half = h * (0.085 + t * 0.11); dots += circle(fx + g.range(-1, 1) * half, yy, 3); }
  for (const k of [-0.6, -0.2, 0.25, 0.65]) folds += M(fx + k * h * 0.1, fy - h * 0.6) + Q(fx + k * h * 0.17, fy - h * 0.42, fx + k * h * 0.2, fy - h * 0.245);
  scene(ol(sk, '#7fb0d0', 1.3, -0.3), sh(dots, '#fbf6ea', { opacity: 0.85 }), stroke(folds, '#5a8eae', 1.6, { opacity: 0.8 }), sh(rect(fx - h * 0.1, fy - h * 0.635, h * 0.2, h * 0.028, 3), '#3a4f7a'));
  // pins holding the hem and a tape measure round the neck
  let pins = '', heads = '';
  for (const k of [-0.15, -0.05, 0.05, 0.15]) { pins += line([[fx + k * h, fy - h * 0.25], [fx + k * h + 8, fy - h * 0.275]]); heads += circle(fx + k * h + 8, fy - h * 0.275, 3); }
  scene(stroke(pins, '#8a9298', 1.2), sh(heads, Y.red));
  const tp: [number, number][] = [[fx - 46, fy - h * 0.6], [fx - 54, fy - h * 0.76], [fx - 36, fy - h * 0.895], [fx, fy - h * 0.915], [fx + 36, fy - h * 0.895], [fx + 58, fy - h * 0.74], [fx + 50, fy - h * 0.54]];
  let tk = '';
  for (let i = 0; i < 12; i++) { const t = i / 11, a = tp[Math.min(5, Math.floor(t * 6))], b = tp[Math.min(6, Math.floor(t * 6) + 1)], f = t * 6 - Math.floor(t * 6); tk += circle(a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, 1.3); }
  scene(ol(ribbon(tp, 11, 6), '#f2c94c', 0.9, -0.35), sh(tk, '#3b2f2a'));
}

// =====================================================================
// foreground: cutting bench (left) and ironing board (right)
// =====================================================================
{
  scene(shadow(310, 1300, 330, 14, 0.12));
  scene(ol(poly([[40, 1194], [590, 1194], [622, 1298], [0, 1298]]), '#dab07a', 1.2, -0.35));
  // cutting mat
  let grid = '';
  for (let i = 0; i <= 10; i++) grid += line([[92 + i * 38, 1206], [70 + i * 42.4, 1286]]);
  for (const [y, k] of [[1206, 0], [1222, 0.2], [1241, 0.44], [1262, 0.7], [1286, 1]] as [number, number][]) grid += line([[92 - 22 * k, y], [472 + 22 * k, y]]);
  scene(ol(poly([[92, 1206], [472, 1206], [494, 1286], [70, 1286]]), '#5f9a86', 1, -0.3), stroke(grid, '#a8d0c0', 1, { opacity: 0.8 }));
  scene(place(patternPiece(150), { x: 224, y: 1243, sy: 0.5, rot: -8 }), place(patternPiece(96, '#f6ecd6'), { x: 110, y: 1232, sy: 0.5, rot: 14 }));
  // pins and a little pin tin
  let pn = '', ph = '';
  const g = rng(17);
  for (let i = 0; i < 9; i++) { const x = g.range(260, 330), y = g.range(1262, 1284), a = g.range(0, Math.PI); pn += line([[x, y], [x + Math.cos(a) * 16, y + Math.sin(a) * 6]]); ph += circle(x, y, 2.6); }
  scene(stroke(pn, '#8a9298', 1.1), sh(ph, Y.butter));
  target('tape', 'Tape measure', place(tapeMeasure(118), { x: 414, y: 1232, sy: 0.82 }));
  target('chalk', "Tailor's chalk", at(tailorsChalk(40, '#7fb0d0'), 528, 1262, 1, 8));
  scene(at(spool(34, Y.red), 548, 1226), at(spool(30, '#f6ecd6'), 580, 1240));
  target('teacup', 'Teacup', at(teacup(46, '#e8836a'), 62, 1276));
  // bench front with drawers
  scene(ol(rect(-6, 1298, 632, 26, 4), '#b98552', 1.2, -0.35), sh(rect(-6, 1298, 632, 6, 3), '#cfa06a'), sh(rect(0, 1324, 606, 176), '#9a6a3e'), sh(rect(0, 1324, 606, 10), '#000000', { opacity: 0.2 }));
  const dr: Shape[] = [];
  for (let i = 0; i < 3; i++) { const x = 16 + i * 196; dr.push(ol(rect(x, 1346, 180, 62, 4), '#b07a48', 1, -0.35), stroke(rect(x + 8, 1354, 164, 46, 3), '#8a5e36', 1.2), ol(rect(x + 70, 1370, 40, 12, 6), '#c9a24a', 0.8, -0.4), ol(rect(x, 1420, 180, 80, 4), '#b07a48', 1, -0.35), stroke(rect(x + 8, 1428, 164, 72, 3), '#8a5e36', 1.2), ol(rect(x + 70, 1448, 40, 12, 6), '#c9a24a', 0.8, -0.4)); }
  scene(dr);
  // ribbon trailing out of a drawer
  scene(ol(ribbon([[250, 1418], [262, 1440], [244, 1462], [258, 1490]], 12, 5), '#e79ab0', 0.8));
}
target('button', 'Red button', at(button(19, '#cf4a3c'), 676, 1392));
scene(at(button(11, '#3f8a84', 2), 716, 1438), at(button(9, '#f3d77a'), 648, 1452), at(button(8, '#fbf6ea', 2), 742, 1380));
{
  // ironing board
  scene(shadow(950, 1486, 190, 12, 0.16), stroke(line([[826, 1286], [1086, 1484]]) + line([[1080, 1286], [822, 1484]]), '#8a9298', 7), stroke(line([[826, 1286], [1086, 1484]]) + line([[1080, 1286], [822, 1484]]), '#c9d0d5', 2.4), sh(rect(800, 1480, 46, 8, 3) + rect(1062, 1480, 46, 8, 3), '#3b2f2a'), ol(circle(953, 1384, 6), '#6f7a82', 1));
  const top = M(748, 1258) + Q(704, 1271, 748, 1284) + 'L1200 1284L1200 1258Z';
  let chk = '';
  for (let x = 770; x < 1200; x += 26) chk += line([[x, 1259], [x, 1283]]);
  scene(ol(top, '#bcd9d4', 1.2, -0.35), stroke(chk, '#8fbdb6', 6, { opacity: 0.6 }), sh(rect(748, 1280, 452, 6), '#7fa8a2'), stroke(top, '#6a938d', 1.2));
  target('iron', 'Iron', at(iron(104, '#e8836a'), 872, 1258));
  scene(at(fabricStack(120, ['#f6ecd6', '#3f8a84', '#f3d77a', '#e79ab0', '#3a4f7a'], 4, 14), 1090, 1258));
  scene(at(fern(rng(14), 90, 56, 46, '#e8836a', 10), 1150, 1500));
}

const activity: FindActivity = {
  id: 'crafts-find-1', version: 1, mode: 'find', title: 'The Sewing Room',
  blurb: 'Sunshine pours over bolts of fabric, a rainbow of thread and a half-stitched quilt in a room where fourteen sewing notions are tucked away.',
  collectionId: 'crafts', categories: ["Crafts", "Cozy"], difficulty: 'Moderate',
  added: '2026-11-26',
  width: W, height: H, defs, items,
};
export default activity;
