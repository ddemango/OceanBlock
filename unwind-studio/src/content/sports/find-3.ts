import { rect, ellipse, circle, poly, line, curve, blob, leaf, star, sh, stroke, place, shade, mix, rng, linearGradient } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { FindActivity, FindItem } from '../types';
import {
  M, L, Q, ol, shadow, hl, P, SKIN, HAIR, digits, crest, golfBall, golfClub, golfBag, golfCart, umbrella, icedTea, pitcher, tennisCan, strawHat,
  visor, golfGlove, clubSandwich, duck, rake, newspaper, golfFlag, cafeTable, bistroChair, tree, flowerBox, tennisRacket, tennisBall, sunglasses, player,
  clipboard, face,
} from './props-find';

const ID = 'sports-find-3';
const xfTee = (x: number, y: number, r: number) => poly([[x - 4, y - 2], [x + 4, y - 2], [x + 1, y + 12], [x - 1, y + 12]].map(([px, py]) => { const a = (r * Math.PI) / 180, dx = px - x, dy = py - y; return [x + dx * Math.cos(a) - dy * Math.sin(a), y + dx * Math.sin(a) + dy * Math.cos(a)] as [number, number]; }));
const W = 1200;
const items: FindItem[] = [];
const scene = (...s: (Shape | Shape[])[]) => { items.push({ shapes: s.flat() }); };
const target = (id: string, name: string, shapes: Shape[]) => { items.push({ id, name, target: true, shapes }); };

const defs =
  linearGradient(`${ID}-sky`, [[0, '#8cc0e6'], [0.7, '#cfe6f2'], [1, '#f2efe0']]) +
  linearGradient(`${ID}-fair`, [[0, '#9cc46e'], [1, '#6ea24e']]) +
  linearGradient(`${ID}-pond`, [[0, '#7fb4c8'], [1, '#5a94b0']]) +
  linearGradient(`${ID}-stone`, [[0, '#e8dcc4'], [1, '#d6c6a6']]);

// =====================================================================
// sky and distant hills
// =====================================================================
scene(sh(rect(0, 0, W, 460), `url(#${ID}-sky)`));
{
  const cl = (x: number, y: number, s: number) => blob([[x - 70 * s, y], [x - 46 * s, y - 24 * s], [x - 12 * s, y - 34 * s], [x + 24 * s, y - 40 * s], [x + 56 * s, y - 22 * s], [x + 80 * s, y]], 0.8);
  scene(sh(cl(420, 120, 1.2) + cl(860, 70, 1.0) + cl(1120, 160, 0.8), '#ffffff', { opacity: 0.9 }), sh(cl(440, 128, 0.8) + cl(880, 76, 0.7), '#eaf2f6', { opacity: 0.9 }));
  scene(stroke(M(620, 90) + Q(630, 82, 640, 90) + Q(650, 82, 660, 90) + M(680, 110) + Q(688, 103, 696, 110) + Q(704, 103, 712, 110), '#5a6a7a', 2));
}
scene(sh(blob([[0, 360], [180, 320], [380, 346], [560, 312], [760, 338], [960, 300], [1200, 330], [1200, 420], [0, 420]], 0.6), '#a9c4a8'));
scene(sh(blob([[0, 392], [220, 370], [480, 388], [720, 366], [980, 384], [1200, 368], [1200, 440], [0, 440]], 0.6), '#8db38a'));
{
  // distant tree line
  const g = rng(12);
  const a: string[] = ['', '', ''];
  for (let x = -10; x < W + 20; x += 18) a[g.int(0, 2)] += circle(x + g.range(-5, 5), 420 + g.range(-6, 6), g.range(14, 24));
  scene(sh(a[0], '#5f8a4f'), sh(a[1], '#6f9a5a'), sh(a[2], '#557f48'), sh(rect(0, 420, W, 30), '#5f8a4f'));
}

// =====================================================================
// tennis courts (right, behind a fence)
// =====================================================================
{
  scene(sh(poly([[620, 452], [1200, 452], [1200, 560], [560, 560]]), '#6f9a5a'));
  for (const [x0, x1] of [[640, 900], [920, 1180]] as [number, number][]) {
    const pr = (t: number, y: number) => x0 + (x1 - x0) * t - (y - 470) * 0.25 * (0.5 - t) * 2;
    scene(sh(poly([[pr(0, 470), 470], [pr(1, 470), 470], [pr(1, 548), 548], [pr(0, 548), 548]]), '#4f8a7a'));
    scene(sh(poly([[pr(0.08, 476), 476], [pr(0.92, 476), 476], [pr(0.92, 542), 542], [pr(0.08, 542), 542]]), '#3f7f9a'));
    scene(stroke(poly([[pr(0.08, 476), 476], [pr(0.92, 476), 476], [pr(0.92, 542), 542], [pr(0.08, 542), 542]]) + line([[pr(0.2, 476), 476], [pr(0.2, 542), 542]]) + line([[pr(0.8, 476), 476], [pr(0.8, 542), 542]]) + line([[pr(0.2, 497), 497], [pr(0.8, 497), 497]]) + line([[pr(0.2, 522), 522], [pr(0.8, 522), 522]]) + line([[pr(0.5, 497), 497], [pr(0.5, 522), 522]]), '#f4f1ea', 1.4));
    scene(stroke(line([[pr(0.04, 508), 508], [pr(0.96, 508), 508]]), '#2b2b30', 2), stroke(line([[pr(0.04, 503), 503], [pr(0.96, 503), 503]]), '#f4f1ea', 1.4));
    scene(place(player(22, '#f4f1ea', '#f4f1ea', SKIN[1], 0), { x: pr(0.35, 490), y: 490 }), place(player(26, '#f4f1ea', P.teal, SKIN[3], 0), { x: pr(0.62, 536), y: 536 }));
  }
  let fence = '';
  for (let x = 620; x < W; x += 6) fence += line([[x, 450], [x + 12, 472]]) + line([[x + 12, 450], [x, 472]]);
  scene(stroke(fence, '#4a5a52', 0.6, { opacity: 0.6 }), stroke(line([[620, 450], [W, 450]]), '#3a4a42', 2));
  let posts = '';
  for (let x = 620; x < W; x += 60) posts += rect(x, 446, 3, 30);
  scene(sh(posts, '#3a4a42'));
  scene(place(tennisBall(3), { x: 760, y: 512 }));
}

// =====================================================================
// the golf course
// =====================================================================
scene(sh(blob([[0, 470], [200, 450], [420, 462], [620, 470], [620, 560], [1200, 560], [1200, 760], [0, 760]], 0.4), `url(#${ID}-fair)`));
{
  // mowing stripes on the fairway
  let st = '';
  for (let i = 0; i < 10; i++) { const y = 470 + i * 30 + i * i * 1.2; st += poly([[0, y], [W, y - 40], [W, y - 22 + i * 1.5], [0, y + 14 + i * 1.5]]); }
  scene(sh(st, '#b2d486', { opacity: 0.25 }));
}
// trees around the course
for (const [x, y, h, c, sd] of [[40, 520, 150, '#4f7f42', 1], [120, 510, 120, '#5f8f4a', 2], [560, 500, 110, '#4f7f42', 3], [1160, 600, 150, '#5a8a45', 4], [620, 540, 90, '#6a9a52', 5], [250, 498, 80, '#5a8a45', 6]] as [number, number, number, string, number][]) {
  scene(shadow(x + 10, y, h * 0.3, h * 0.05, 0.2), place(tree(h, c, sd), { x, y }));
}
// the pond with a duck
scene(sh(blob([[290, 590], [380, 566], [500, 574], [540, 600], [480, 628], [340, 630], [280, 612]], 0.8), `url(#${ID}-pond)`));
scene(stroke(M(330, 590) + L(370, 590) + M(410, 612) + L(470, 612) + M(350, 618) + L(390, 618), '#cfe6f2', 2, { opacity: 0.8 }));
{
  let reeds = '';
  for (let i = 0; i < 10; i++) reeds += leaf(276 + i * 5, 616 - (i % 3) * 4, 24 + (i % 4) * 5, 3, -95 + i * 2);
  scene(sh(reeds, '#5f8a3a'), sh(ellipse(286, 590, 3, 9) + ellipse(300, 586, 3, 9), '#7a4a2a'));
}
target('duck', 'Duck', place(duck(48), { x: 440, y: 606 }));
scene(sh(ellipse(360, 592, 12, 4) + ellipse(384, 600, 9, 3) + ellipse(500, 590, 10, 3.5), '#5f9a4c'), sh(circle(362, 590, 3), '#f4c4d4'));
// the green, bunkers, flag
scene(sh(ellipse(720, 600, 150, 40), '#a6d27a'), sh(ellipse(720, 600, 120, 30), '#b6dc8a', { opacity: 0.6 }));
scene(sh(blob([[850, 610], [900, 596], [960, 606], [940, 630], [870, 632]], 0.8), '#ead9a8'), sh(blob([[560, 616], [600, 606], [630, 622], [600, 638], [562, 632]], 0.8), '#ead9a8'));
scene(stroke(M(862, 612) + Q(900, 602, 940, 612) + M(870, 622) + Q(900, 614, 930, 624), '#d4c08a', 1.4));
target('flag', 'Golf flag', place(golfFlag(70, P.red, '9'), { x: 750, y: 598 }));
target('rake', 'Bunker rake', place(rake(64), { x: 880, y: 640, rot: -12 }));
scene(place(player(38, '#f4f1ea', P.navy, SKIN[0], 0), { x: 660, y: 606 }), place(player(38, '#e8c9d8', '#f4f1ea', SKIN[2], 0), { x: 800, y: 604 }));
scene(stroke(line([[806, 580], [818, 604]]), '#b8c0c8', 2), place(golfBall(3), { x: 730, y: 606 }));
// cart path and cart
scene(stroke(M(1200, 690) + Q(980, 660, 820, 700) + Q(700, 730, 560, 720), '#d8cfb8', 16), stroke(M(1200, 690) + Q(980, 660, 820, 700) + Q(700, 730, 560, 720), '#e6dec8', 10));
target('golf-cart', 'Teal golf cart', place(golfCart(104, '#f4f1ea', P.teal), { x: 1080, y: 684 }));
scene(place(golfCart(64, '#f4f1ea', P.red), { x: 600, y: 716 }));
// flagpoles with club flags beyond the terrace
// more trees and little daisies in the rough
for (const [x, y, h, c, sd] of [[980, 560, 90, '#4f7f42', 8], [300, 560, 70, '#6a9a52', 9]] as [number, number, number, string, number][]) scene(place(tree(h, c, sd), { x, y }));
{
  const g = rng(71);
  let d = '';
  for (let i = 0; i < 40; i++) d += circle(g.range(280, 1190), g.range(650, 735), 1.8);
  scene(sh(d, '#f8f4e0'));
}

const BY = 790;
// stone floor in perspective
scene(sh(rect(250, BY + 30, W - 250, 1500 - BY - 30) + rect(0, 1010, 250, 490), `url(#${ID}-stone)`));
{
  const vx = 640, vy = 520, y0 = BY + 30, y1 = 1500;
  let gl = '';
  for (let i = -14; i <= 14; i++) { const bx = vx + i * 120; const t0 = (y0 - vy) / (y1 - vy); gl += line([[vx + (bx - vx) * t0, y0], [bx, y1]]); }
  let y = y0, h = 26;
  while (y < y1) { y += h; h *= 1.16; gl += line([[0, y], [W, y]]); }
  scene(stroke(gl, '#c4b392', 1.6));
  const g = rng(19);
  let spots = '';
  for (let i = 0; i < 40; i++) spots += ellipse(g.range(260, 1190), g.range(840, 1490), g.range(3, 10), g.range(1.5, 4));
  scene(sh(spots, '#cdbd9c', { opacity: 0.6 }));
}
// fallen leaves and pebbles on the terrace
{
  const g = rng(303);
  for (let i = 0; i < 10; i++) scene(sh(leaf(g.range(300, 1150), g.range(1150, 1300), g.range(12, 18), 5, g.range(0, 360)), g.pick(['#c9a24a', '#b8783a', '#8fae5a'])));
}
// lavender pots along the balustrade
for (const x of [770, 810, 1100]) {
  scene(sh(leaf(x - 4, 872, 30, 4, -100) + leaf(x, 872, 34, 4, -90) + leaf(x + 4, 872, 30, 4, -80), '#6a8a52'), sh(ellipse(x - 6, 846, 3, 9) + ellipse(x, 840, 3, 10) + ellipse(x + 6, 846, 3, 9), '#9a7ac8'), ol(poly([[x - 14, 866], [x + 14, 866], [x + 11, 890], [x - 11, 890]]), '#c9824a', 1));
}
// birds over the hills, benches by the courts
scene(stroke(M(980, 250) + Q(986, 244, 992, 250) + Q(998, 244, 1004, 250), '#5a6a7a', 1.6), stroke(M(1020, 270) + Q(1025, 265, 1030, 270) + Q(1035, 265, 1040, 270), '#5a6a7a', 1.4), stroke(M(300, 210) + Q(306, 204, 312, 210) + Q(318, 204, 324, 210), '#5a6a7a', 1.6));
scene(sh(rect(905, 552, 24, 4) + rect(1185, 552, 15, 4), '#7a5232'), sh(rect(907, 556, 2, 5) + rect(925, 556, 2, 5), '#3a3f4a'));
{
  const g = rng(404);
  let a = '', b = '';
  for (let i = 0; i < 30; i++) { const d = ellipse(g.range(260, 1190), g.range(840, 1490), g.range(2, 6), g.range(1, 3)); if (i % 2) a += d; else b += d; }
  scene(sh(a, '#c4b28e', { opacity: 0.6 }), sh(b, '#efe6d2', { opacity: 0.7 }));
}
// =====================================================================
// clubhouse wall (left)
// =====================================================================
{
  const x1 = 250;
  scene(sh(rect(0, 150, x1, 860), '#f4efe2'));
  let cb = '';
  for (let y = 162; y < 1010; y += 22) cb += line([[0, y], [x1, y]]);
  scene(stroke(cb, '#ddd4c0', 2), sh(rect(x1 - 12, 150, 12, 860), '#e2d8c4'));
  scene(sh(poly([[0, 120], [x1 + 30, 150], [x1 + 30, 168], [0, 140]]), '#5a6a6a'));
  scene(stroke(line([[180, 142], [180, 30]]), '#e8e2d4', 3), sh(circle(180, 28, 4), P.gold), sh(M(182, 36) + Q(214, 30, 244, 40) + L(244, 74) + Q(214, 66, 182, 72) + 'Z', P.navy), sh(star(212, 54, 9, 4), '#f6ecd6'));
  // window with shutters and flower box
  scene(ol(rect(50, 230, 140, 180, 3), '#fbfaf2', 2, -0.2), sh(rect(62, 242, 116, 156), '#9cc4dc'), sh(poly([[62, 300], [120, 242], [150, 242], [62, 330]]), '#ffffff', { opacity: 0.3 }), stroke(line([[120, 242], [120, 398]]) + line([[62, 320], [178, 320]]), '#fbfaf2', 6));
  scene(ol(rect(14, 226, 34, 188, 2), '#2f5a4a', 1), ol(rect(192, 226, 34, 188, 2), '#2f5a4a', 1));
  let lv = '';
  for (let y = 236; y < 410; y += 12) lv += line([[18, y], [44, y + 4]]) + line([[196, y], [222, y + 4]]);
  scene(stroke(lv, '#244a3c', 1.4));
  scene(place(flowerBox(160, 26, '#2f5a4a', ['#e86a6a', '#f4f1ea', '#f2cf3a', '#c86ab0'], 9), { x: 40, y: 440 }));
  // striped awning
  const aw: Shape[] = [];
  for (let i = 0; i < 8; i++) aw.push(sh(poly([[i * 34, 480], [(i + 1) * 34, 480], [(i + 1) * 36 + 4, 560], [i * 36 + 4, 560]]), i % 2 ? '#f4f1ea' : '#2f8f8a'));
  scene(aw);
  let sc = '';
  for (let i = 0; i < 8; i++) sc += M(i * 36 + 4, 560) + Q(i * 36 + 22, 580, (i + 1) * 36 + 4, 560) + 'Z';
  scene(sh(sc, '#2f8f8a'), sh(rect(0, 476, 272, 6), '#246f6a'));
  // door with lantern and a club crest
  scene(ol(rect(40, 640, 150, 370, 3), '#7a5232', 2), sh(rect(56, 660, 118, 150), '#9cc4dc'), stroke(line([[115, 660], [115, 810]]) + line([[56, 735], [174, 735]]), '#7a5232', 5), sh(rect(56, 830, 52, 160, 3) + rect(122, 830, 52, 160, 3), '#6b4628'), sh(circle(170, 900, 6), P.gold));
  scene(place(crest(30, '#2f5a4a', P.gold, 'star'), { x: 115, y: 600 }));
  scene(stroke(line([[214, 640], [232, 640]]), '#2b2b30', 3), ol(rect(214, 646, 26, 40, 4), '#2b2b30', 1), sh(rect(219, 652, 16, 28, 2), '#fff4c8'));
  // hanging basket
  scene(stroke(M(240, 560) + L(225, 610) + M(240, 560) + L(255, 610), '#5a4a3a', 1.4), ol(M(214, 610) + L(266, 610) + Q(262, 640, 240, 642) + Q(218, 640, 214, 610) + 'Z', '#8a6a42', 1));
  const g = rng(44);
  let fl = '', lv2 = '';
  for (let i = 0; i < 16; i++) { fl += circle(240 + g.range(-28, 28), 606 + g.range(-14, 10), g.range(4, 6)); lv2 += leaf(240 + g.range(-20, 20), 612, g.range(14, 24), 4, g.range(30, 150)); }
  scene(sh(lv2, '#4f8a3e'), sh(fl, '#e86a8a'));
}

// =====================================================================
// terrace: balustrade, floor, tables and umbrellas
// =====================================================================
scene(sh(rect(250, BY - 60, W - 250, 6), '#c9b894'));
{
  scene(sh(rect(250, BY - 58, W - 250, 18, 3), '#ece2cc'), sh(rect(250, BY - 44, W - 250, 4), '#c9b894'));
  let bal = '';
  for (let x = 262; x < W; x += 30) bal += M(x, BY - 40) + Q(x + 14, BY - 36, x + 6, BY - 24) + Q(x - 2, BY - 10, x + 7, BY + 6) + L(x + 15, BY + 6) + Q(x + 24, BY - 10, x + 16, BY - 24) + Q(x + 8, BY - 36, x + 22, BY - 40) + 'Z';
  scene(sh(bal, '#ece2cc'), stroke(bal, '#c9b894', 1));
  scene(sh(rect(250, BY + 6, W - 250, 24), '#e2d6bc'), sh(rect(250, BY + 6, W - 250, 4), '#f2eadb'));
  for (const x of [250, 720, 1170]) scene(sh(rect(x, BY - 70, 34, 100, 2), '#e8dcc4'), sh(rect(x - 4, BY - 76, 42, 10, 2), '#f2eadb'));
  scene(place(flowerBox(80, 22, '#c9a77a', ['#e86a6a', '#f2cf3a', '#f4f1ea'], 3), { x: 727, y: BY - 76 }));
}
// left table with umbrella
scene(place(umbrella(380, '#2f8f8a', '#f4f1ea', 350), { x: 470, y: 652 }));
scene(place(bistroChair(170), { x: 360, y: 1080 }), place(bistroChair(170), { x: 690, y: 1080 }));
scene(place(cafeTable(300, '#f4f1ea', P.teal), { x: 520, y: 1130 }));
// right table with umbrella
scene(place(umbrella(330, P.navy, '#f4f1ea', 250), { x: 900, y: 704 }));
scene(place(bistroChair(150), { x: 1040, y: 1010 }));
scene(place(cafeTable(250, '#f4f1ea', P.red), { x: 900, y: 1050 }));
target('sun-visor', 'Sun visor', place(visor(60, '#f4f1ea', P.navy), { x: 1040, y: 940 }));

// things on the left table (top surface at y ~944)
const TY = 1130 - 186;
scene(place(icedTea(52, false), { x: 430, y: TY + 6 }), place(icedTea(48, false), { x: 640, y: TY + 10 }));
target('iced-tea', 'Iced tea with lemon', place(icedTea(56), { x: 600, y: TY - 4 }));
target('pitcher', 'Pitcher of iced tea', place(pitcher(74), { x: 520, y: TY - 8 }));
target('sandwich', 'Club sandwich', place(clubSandwich(90), { x: 458, y: TY + 22 }));
scene(place(sunglasses(48), { x: 560, y: TY + 30, rot: 8 }));
// a member reading behind the right table
{
  const x = 905, sk = SKIN[2];
  scene(sh(blob([[x - 46, 900], [x - 44, 852], [x - 26, 836], [x + 26, 836], [x + 44, 852], [x + 46, 900]], 0.5), '#e8c9d8'), sh(M(x - 12, 836) + L(x, 852) + L(x + 12, 836) + 'Z', '#fbfbf8'));
  scene(sh(rect(x - 7, 818, 14, 20), shade(sk, -0.08)), place(face(22, sk, HAIR[5]), { x, y: 800 }));
  scene(sh(ellipse(x, 784, 44, 9), '#f2efe6'), sh(M(x - 24, 786) + Q(x - 22, 760, x, 760) + Q(x + 22, 760, x + 24, 786) + 'Z', '#f2efe6'), sh(rect(x - 24, 778, 48, 7), P.teal));
}
// things on the right table (top ~ 895)
const TY2 = 1050 - 155;
target('newspaper', 'Newspaper', place(newspaper(80), { x: 858, y: TY2 + 8, rot: -6 }));
scene(place(icedTea(44, false), { x: 940, y: TY2 + 6 }), place(golfBall(7), { x: 910, y: TY2 + 16 }));
scene(place(clipboard(46, 'score', '#c9a77a'), { x: 972, y: TY2 + 14, rot: 70 }));

// =====================================================================
// foreground: bags, rackets and odds and ends
// =====================================================================
target('golf-bag', 'Golf bag', place(golfBag(230, P.navy, P.red), { x: 1100, y: 1330 }));
target('putter', 'Putter', place(golfClub(200, 2), { x: 860, y: 1180, rot: -14 }));
// basket of range balls
{
  const x = 420, y = 1480;
  scene(shadow(x, y, 80, 12));
  const g = rng(5);
  for (let i = 0; i < 12; i++) scene(place(golfBall(11), { x: x - 54 + (i % 6) * 22 + g.range(-3, 3), y: y - 70 - Math.floor(i / 6) * 14 + g.range(-3, 3) }));
  scene(ol(poly([[x - 70, y - 70], [x + 70, y - 70], [x + 56, y], [x - 56, y]]), '#3a5a8a', 1.4), sh(rect(x - 66, y - 52, 132, 8) + rect(x - 62, y - 30, 124, 8), '#2b4a78'), sh(star(x, y - 14, 10, 4), '#f6ecd6'));
}
target('golf-ball', 'Golf ball on the tee', [...place(golfBall(13), { x: 330, y: 1268 }), sh(poly([[324, 1280], [336, 1280], [332, 1300], [328, 1300]]), P.red)]);
// front table with coffee and scones
scene(place(bistroChair(200, '#2f5a4a', '#d4a26c'), { x: 830, y: 1500 }));
scene(place(cafeTable(300, '#f4f1ea', '#e3b23c'), { x: 660, y: 1560 }));
{
  const ty = 1560 - 186;
  scene(ol(ellipse(700, ty + 6, 60, 14), '#fbfbf8', 1, -0.15), sh(circle(680, ty - 4, 14) + circle(706, ty - 6, 14) + circle(726, ty + 2, 12), '#e0b072'), sh(circle(680, ty - 8, 5) + circle(706, ty - 10, 5), '#c8463a'), sh(ellipse(694, ty - 14, 10, 4), '#fbf4d8'));
  for (const x of [782]) scene(ol(ellipse(x, ty + 10, 24, 6), '#fbfbf8', 1, -0.15), ol(rect(x - 14, ty - 18, 28, 26, 6), '#fbfbf8', 1, -0.15), stroke(M(x + 14, ty - 12) + Q(x + 24, ty - 8, x + 14, ty), '#d8d4c8', 3), sh(ellipse(x, ty - 18, 13, 3), '#6b3a1a'));
  scene(ol(rect(530, ty - 40, 26, 44, 8), '#9cc4dc', 1), sh(leaf(543, ty - 40, 30, 6, -110) + leaf(543, ty - 40, 26, 6, -70), '#5f9a4c'), sh(circle(536, ty - 72, 7) + circle(552, ty - 66, 7) + circle(544, ty - 80, 6), '#f2cf3a'));
}
target('glove-table', 'Golf glove', place(golfGlove(52), { x: 600, y: 1372, rot: -70 }));
// chalkboard menu by the door
{
  const x = 300, y = 1200;
  scene(shadow(x, y, 50, 8), stroke(line([[x - 40, y], [x - 20, y - 150]]) + line([[x + 40, y], [x + 20, y - 150]]), '#7a5232', 6));
  scene(ol(rect(x - 42, y - 150, 84, 110, 4), '#7a5232', 1), sh(rect(x - 34, y - 142, 68, 94), '#2f3a36'));
  scene(stroke(line([[x - 24, y - 124], [x + 20, y - 124]]) + line([[x - 24, y - 108], [x + 10, y - 108]]) + line([[x - 24, y - 92], [x + 16, y - 92]]) + line([[x - 24, y - 76], [x + 6, y - 76]]), '#e8e4d8', 2), sh(star(x, y - 60, 6, 2.6), '#f2cf3a'));
}
// ivy on the clubhouse
{
  const g = rng(55);
  let a = '', b = '';
  for (let i = 0; i < 30; i++) { const y = 1010 - i * 14, x = 236 + Math.sin(i * 0.7) * 10; const d = leaf(x, y, g.range(12, 18), 5, g.range(120, 240)); if (i % 2) a += d; else b += d; }
  scene(stroke(curve(Array.from({ length: 16 }, (_, i) => [236 + Math.sin(i * 1.3) * 10, 1010 - i * 28] as [number, number])), '#5a4a32', 2), sh(a, '#4f7f42'), sh(b, '#6a9a52'));
}
// planters on the balustrade posts
scene(place(flowerBox(40, 16, '#c9a77a', ['#e86a8a', '#f4f1ea'], 21), { x: 247, y: 714 }), place(flowerBox(40, 16, '#c9a77a', ['#f2cf3a', '#e86a6a'], 22), { x: 1167, y: 714 }));
// large planters
for (const [x, y, sd] of [[60, 1290, 1], [1160, 1500, 2]] as [number, number, number][]) {
  const g = rng(sd * 17);
  let a = '', b = '', f = '';
  for (let i = 0; i < 12; i++) { const d = leaf(x + g.range(-20, 20), y - 70, g.range(40, 70), 10, g.range(-170, -10)); if (i % 2) a += d; else b += d; }
  for (let i = 0; i < 9; i++) f += circle(x + g.range(-44, 44), y - 100 + g.range(-30, 20), g.range(5, 8));
  scene(sh(a, '#4f8a3e'), sh(b, '#6aa250'), sh(f, sd === 1 ? '#e86a8a' : '#f4f1ea'), ol(poly([[x - 50, y - 76], [x + 50, y - 76], [x + 40, y], [x - 40, y]]), '#c9824a', 1), sh(rect(x - 52, y - 82, 104, 12, 3), '#b06a3a'));
}
// folded golf umbrella leaning on the bag
scene(sh(poly([[1000, 1300], [1022, 1300], [1060, 1080], [1054, 1078]]), P.red), sh(poly([[1012, 1300], [1022, 1300], [1060, 1080]]), '#f4f1ea'), stroke(M(1006, 1300) + L(1000, 1330) + Q(996, 1342, 984, 1336), '#3a3f4a', 4));
// scattered tees
{
  const g = rng(9);
  for (let i = 0; i < 6; i++) scene(sh(xfTee(g.range(250, 470), g.range(1290, 1330), g.pick([80, 100, 260, 280])), g.pick([P.red, '#f4f1ea', '#f2cf3a', '#3a8fd0'])));
}
// chair in front with tennis kit
scene(place(bistroChair(230, '#2f5a4a', '#d4a26c'), { x: 220, y: 1500 }));
target('straw-hat', 'Straw hat', place(strawHat(130, P.red), { x: 218, y: 1384 }));
target('tennis-racket', 'Tennis racket', place(tennisRacket(240, P.teal, '#f4f1ea'), { x: 70, y: 1480, rot: 20 }));
target('tennis-can', 'Tennis ball can', place(tennisCan(80, '#2f8f8a'), { x: 980, y: 1474 }));
scene(place(tennisBall(12), { x: 1040, y: 1480 }), place(tennisBall(12), { x: 520, y: 1488 }));
// potted shrubs on the terrace
for (const [x, y, s] of [[300, 920, 1], [1180, 860, 0.8]] as [number, number, number][]) {
  const g = rng(x);
  let a = '', b = '';
  for (let i = 0; i < 10; i++) { const d = circle(x + g.range(-34, 34) * s, y - 80 * s + g.range(-34, 24) * s, g.range(16, 24) * s); if (i % 2) a += d; else b += d; }
  scene(sh(a, '#4f7f42'), sh(b, '#5f9a4c'), ol(poly([[x - 40 * s, y - 50 * s], [x + 40 * s, y - 50 * s], [x + 32 * s, y], [x - 32 * s, y]]), '#c9824a', 1));
}

const a: FindActivity = {
  id: 'sports-find-3', version: 2, mode: 'find', title: 'Clubhouse at the Links', blurb: 'Iced tea on the clubhouse terrace, looking out over the ninth green and the tennis courts beyond.',
  collectionId: 'sports', categories: ["Sports"], difficulty: 'Detailed',
  width: 1200, height: 1500, defs,
  items,
};
export default a;
