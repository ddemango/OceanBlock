import { rect, ellipse, circle, poly, line, curve, blob, star, sh, stroke, place, shade, rng, linearGradient } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { FindActivity, FindItem } from '../types';
import {
  M, L, Q, ol, shadow, hl, P, digits, crest, planks, brickWall, bunting, soccerBall, basketball, football, volleyball, tennisBall, tennisRacket,
  sneaker, jersey, waterBottle, foldedTowel, rolledTowel, trophy, whistle, stopwatch, dumbbell, jumpRope, medal, duffel, helmet, hockeyStick,
  cone, wallClock, cap, clipboard, baseball, bat, mitt,
} from './props-find';

const ID = 'sports-find-2';
const W = 1200;
const items: FindItem[] = [];
const scene = (...s: (Shape | Shape[])[]) => { items.push({ shapes: s.flat() }); };
const target = (id: string, name: string, shapes: Shape[]) => { items.push({ id, name, target: true, shapes }); };

const defs =
  linearGradient(`${ID}-light`, [[0, '#fff8e0'], [1, '#fff8e0']]) +
  linearGradient(`${ID}-floor`, [[0, '#c99a62'], [1, '#b0824e']]) +
  linearGradient(`${ID}-locker`, [[0, '#3a6a9a'], [1, '#2c5480']]);

const LOCK = '#3a6a9a', LOCKDK = '#2a4f78', LOCKLT = '#5584b4';

// =====================================================================
// back wall: subway tiles, stripe, banner and clock
// =====================================================================
scene(brickWall(0, 0, W, 930, 60, 30, ['#f3eee2', '#ece6d8', '#f7f3ea'], '#d8d0bf', 4));
scene(sh(rect(0, 96, W, 22), P.red), sh(rect(0, 118, W, 8), P.navy));
scene(place(bunting(560, 12, 24, [P.red, '#f6ecd6', P.navy, P.gold]), { x: 20, y: 18 }), place(bunting(560, 12, 24, [P.gold, P.navy, '#f6ecd6', P.red]), { x: 620, y: 18 }));
scene(place(wallClock(34), { x: 600, y: 60 }));
// pendant lamps
for (const x of [210, 990]) {
  scene(stroke(line([[x, 0], [x, 40]]), '#4a4a50', 2), sh(M(x - 40, 70) + Q(x - 36, 38, x, 38) + Q(x + 36, 38, x + 40, 70) + 'Z', '#2f5f4a'), sh(ellipse(x, 70, 40, 6), '#fff4c8'), sh(poly([[x - 40, 72], [x + 40, 72], [x + 90, 140], [x - 90, 140]]), '#fff8e0', { opacity: 0.18 }));
}

// =====================================================================
// lockers
// =====================================================================
const LY0 = 160, LY1 = 890, LW = 104;
/** One locker bay. open = door swung to the right showing the inside. */
function locker(x: number, num: string, open: boolean, inside?: () => Shape[]): Shape[] {
  const out: Shape[] = [];
  const h = LY1 - LY0;
  if (open) {
    out.push(sh(rect(x + 4, LY0 + 4, LW - 8, h - 8), '#1f2e40'), sh(rect(x + 4, LY0 + 4, LW - 8, 16), '#16222f'));
    out.push(sh(rect(x + 6, LY0 + 120, LW - 12, 6), '#5a6a7a'), sh(rect(x + 6, LY1 - 150, LW - 12, 6), '#5a6a7a'));
    out.push(stroke(line([[x + 12, LY0 + 150], [x + LW - 12, LY0 + 150]]), '#8a96a2', 3));
    if (inside) out.push(...inside());
  } else {
    out.push(ol(rect(x + 3, LY0 + 3, LW - 6, h - 6, 3), LOCK, 1.5, -0.35));
    out.push(sh(rect(x + 3, LY0 + 3, 6, h - 6), LOCKLT, { opacity: 0.6 }));
    let v = '';
    for (let i = 0; i < 5; i++) v += rect(x + 22, LY0 + 26 + i * 12, LW - 44, 4, 2) + rect(x + 22, LY1 - 90 + i * 12, LW - 44, 4, 2);
    out.push(sh(v, LOCKDK));
    out.push(ol(rect(x + 30, LY0 + 110, LW - 60, 30, 3), '#e8e2d2', 1, -0.3), sh(digits(num, x + LW / 2 - num.length * 7 - 2, LY0 + 116, 9, 18, 5), P.navy));
    out.push(ol(rect(x + LW - 26, LY0 + 330, 12, 56, 4), '#b8c0c8', 1));
    out.push(sh(circle(x + LW - 20, LY0 + 400, 5), '#667078'));
  }
  return out;
}
/** The open locker door, swung out to the right of bay x. */
function door(x: number): Shape[] {
  const x0 = x + LW - 2, x1 = x0 + 34;
  return [
    ol(poly([[x0, LY0], [x1, LY0 + 26], [x1, LY1 + 22], [x0, LY1]]), LOCKDK, 1.5, -0.3),
    sh(poly([[x0 + 4, LY0 + 10], [x0 + 9, LY0 + 12], [x0 + 9, LY1 - 8], [x0 + 4, LY1 - 10]]), LOCKLT, { opacity: 0.5 }),
    sh(rect(x0 + 14, LY0 + 360, 8, 40, 3), '#b8c0c8'),
  ];
}
scene(sh(rect(0, LY0 - 16, 432, 16) + rect(768, LY0 - 16, 432, 16), '#2a4f78'), sh(rect(0, LY0 - 20, 432, 5) + rect(768, LY0 - 20, 432, 5), '#5584b4'));
scene(sh(rect(0, LY0, 432, LY1 - LY0) + rect(768, LY0, 432, LY1 - LY0), '#24456a'));
const bays = [0, 108, 216, 324, 768, 876, 984, 1092];
const nums = ['12', '4', '21', '9', '15', '7', '33', '18'];
const openBays: Record<number, () => Shape[]> = {
  108: () => [
    ...place(helmet(70, P.red, '#f6ecd6'), { x: 108 + 52, y: LY0 + 118 }),
    stroke(M(108 + 52, LY0 + 150) + L(108 + 52, LY0 + 162), '#b8c0c8', 3),
    ...place(jersey(90, P.red, '#f6ecd6', '4'), { x: 108 + 52, y: LY0 + 152 }),
    ...place(sneaker(64, '#f4f1ea', P.navy), { x: 108 + 50, y: LY1 - 12 }),
    ...place(foldedTowel(80, 18, '#f4f1ea', P.red), { x: 108 + 12, y: LY1 - 156 }),
  ],
  324: () => [
    ...place(basketball(30), { x: 324 + 52, y: LY0 + 90 }),
    ...place(jersey(90, '#f4f1ea', P.navy, '9'), { x: 324 + 52, y: LY0 + 152 }),
    ...place(hockeyStick(240, '#d4a26c', '#2b2b30'), { x: 324 + 62, y: LY1 - 12, rot: -4 }),
    ...place(duffel(82, P.teal, P.gold), { x: 324 + 50, y: LY1 - 12 }),
  ],
  876: () => [
    ...place(cap(48, P.navy, shade(P.navy, -0.2), P.gold), { x: 876 + 46, y: LY0 + 120 }),
    ...place(jersey(90, P.navy, P.gold, '22'), { x: 876 + 52, y: LY0 + 152 }),
    ...place(sneaker(64, '#2b2b30', P.gold), { x: 876 + 50, y: LY1 - 12 }),
    ...place(foldedTowel(80, 18, P.navy, '#f4f1ea'), { x: 876 + 12, y: LY1 - 156 }),
  ],
  1092: () => [
    ...place(soccerBall(30), { x: 1092 + 52, y: LY0 + 90 }),
    stroke(M(1092 + 52, LY0 + 150) + L(1092 + 52, LY0 + 162), '#b8c0c8', 3),
    ...place(bat(130, '#c49a62'), { x: 1092 + 20, y: LY1 - 20, rot: -80 }),
    ...place(mitt(54, P.leather), { x: 1092 + 70, y: LY1 - 40 }),
  ],
};
bays.forEach((x, i) => scene(locker(x, nums[i], x in openBays, openBays[x])));
// magnets and stickers on the closed doors
for (const [x, k] of [[0, 0], [216, 1], [768, 2], [984, 0]] as [number, number][]) {
  scene(place(crest(14, [P.red, P.navy, P.teal][k], '#f6ecd6', (['star', 'bird', 'wave'] as const)[k]), { x: x + 52, y: LY0 + 210 }));
  scene(sh(rect(x + 26, LY0 + 250, 52, 8, 3), '#f4f1ea', { opacity: 0.85 }), sh(rect(x + 30, LY0 + 252, 30, 4, 2), '#9a9a9a'));
}
// things inside open bays that are targets
target('jersey-7', 'Jersey number 7', place(jersey(90, P.teal, '#f6ecd6', '7'), { x: 1092 + 52, y: LY0 + 152 }));
target('racket', 'Tennis racket', place(tennisRacket(170, P.gold, '#2b2b30'), { x: 876 + 78, y: LY1 - 160, rot: 14 }));
for (const x of Object.keys(openBays).map(Number)) scene(door(x));
target('medal', 'Medal', place(medal(64), { x: 876 + LW + 16, y: LY0 + 190 }));
// locker tops: kit and boxes
scene(ol(rect(30, LY0 - 64, 90, 44, 3), '#c9a77a', 1), sh(rect(30, LY0 - 52, 90, 6), '#a8875a'), place(basketball(26), { x: 160, y: LY0 - 46 }), place(volleyball(24, '#f4f1ea', P.teal), { x: 214, y: LY0 - 44 }));
scene(place(duffel(110, P.red, '#f6ecd6'), { x: 330, y: LY0 - 20 }));
scene(place(helmet(56, P.navy, P.gold), { x: 830, y: LY0 - 20 }), ol(rect(880, LY0 - 74, 110, 54, 3), '#c9a77a', 1), sh(rect(880, LY0 - 60, 110, 6), '#a8875a'), sh(digits('24', 920, LY0 - 50, 8, 14), '#8a6a42'));
target('football', 'Football', place(football(74), { x: 1060, y: LY0 - 40, rot: -12 }));
scene(place(basketball(24), { x: 1150, y: LY0 - 44 }));

// =====================================================================
// trophy shelf and whiteboard
// =====================================================================
scene(sh(rect(432, LY0, 336, 4), '#d8d0bf'));
scene(sh(rect(450, 254, 300, 14, 2), '#7a5232'), sh(rect(450, 254, 300, 4), '#b98552'), sh(poly([[470, 268], [486, 268], [470, 290]]) + poly([[730, 268], [714, 268], [730, 290]]), '#7a5232'));
scene(place(trophy(66, '#c9ced4'), { x: 490, y: 254 }), place(trophy(56, '#c9824a'), { x: 690, y: 254 }), place(crest(26, P.navy, P.gold, 'star'), { x: 728, y: 222 }));
scene(ol(rect(536, 214, 46, 40, 3), '#7a5232', 1), sh(rect(542, 220, 34, 28), '#f4f1ea'), sh(circle(552, 236, 6) + circle(566, 236, 6), '#d8a06a'), sh(rect(546, 240, 26, 8), P.red));
target('trophy', 'Gold trophy', place(trophy(92), { x: 624, y: 254 }));
{
  const x0 = 444, y0 = 304, w = 312, h = 250;
  scene(ol(rect(x0, y0, w, h, 4), '#c9ced4', 2), sh(rect(x0 + 8, y0 + 8, w - 16, h - 16), '#fbfbf8'));
  // half-court diagram with X's and O's
  scene(stroke(rect(x0 + 24, y0 + 22, w - 48, h - 56) + M(x0 + 24, y0 + 120) + L(x0 + w - 24, y0 + 120), '#9ab0c4', 2));
  scene(stroke(M(x0 + w / 2 - 50, y0 + 22) + Q(x0 + w / 2 - 50, y0 + 90, x0 + w / 2, y0 + 90) + Q(x0 + w / 2 + 50, y0 + 90, x0 + w / 2 + 50, y0 + 22), '#9ab0c4', 2));
  scene(stroke(circle(x0 + 90, y0 + 70, 10) + circle(x0 + 160, y0 + 150, 10) + circle(x0 + 230, y0 + 80, 10) + circle(x0 + 110, y0 + 170, 10), '#2b4a8a', 3));
  scene(stroke(M(x0 + 80, y0 + 130) + L(x0 + 96, y0 + 146) + M(x0 + 96, y0 + 130) + L(x0 + 80, y0 + 146) + M(x0 + 200, y0 + 140) + L(x0 + 216, y0 + 156) + M(x0 + 216, y0 + 140) + L(x0 + 200, y0 + 156) + M(x0 + 250, y0 + 160) + L(x0 + 266, y0 + 176) + M(x0 + 266, y0 + 160) + L(x0 + 250, y0 + 176), P.red, 3));
  scene(stroke(curve([[x0 + 100, y0 + 76], [x0 + 140, y0 + 60], [x0 + 190, y0 + 72], [x0 + 220, y0 + 82]]) + curve([[x0 + 160, y0 + 140], [x0 + 150, y0 + 110], [x0 + 170, y0 + 92]]) + M(x0 + 118, y0 + 162) + L(x0 + 180, y0 + 196), '#2b2b30', 2.4));
  scene(sh(poly([[x0 + 220, y0 + 82], [x0 + 206, y0 + 72], [x0 + 208, y0 + 88]]) + poly([[x0 + 170, y0 + 92], [x0 + 158, y0 + 100], [x0 + 172, y0 + 104]]) + poly([[x0 + 180, y0 + 196], [x0 + 166, y0 + 194], [x0 + 172, y0 + 184]]), '#2b2b30'));
  scene(sh(rect(x0 + 10, y0 + h - 4, w - 20, 10, 2), '#a3abb2'));
  scene(sh(rect(x0 + 40, y0 + h - 12, 40, 8, 2), P.red), sh(rect(x0 + 90, y0 + h - 12, 40, 8, 2), '#2b4a8a'), sh(rect(x0 + 140, y0 + h - 12, 40, 8, 2), '#2b2b30'), ol(rect(x0 + 220, y0 + h - 16, 56, 14, 3), '#3a3f4a', 1), sh(rect(x0 + 220, y0 + h - 6, 56, 4), '#f2efe4'));
  scene(stroke(M(x0 + w - 10, y0 + 6) + L(x0 + w - 2, y0 - 2), '#667078', 2));
}
target('whistle', 'Whistle', place(whistle(54), { x: 752, y: 382, rot: 10 }));
// coat hooks with towels under the whiteboard
scene(sh(rect(440, 600, 320, 14, 3), '#7a5232'));
for (const [x, c, s2] of [[480, '#f4f1ea', P.red], [560, P.navy, '#f4f1ea'], [640, '#f2cf3a', P.navy], [720, '#f4f1ea', P.teal]] as [number, string, string][]) {
  scene(sh(circle(x, 616, 5), '#b8c0c8'), sh(M(x - 26, 610) + Q(x, 600, x + 26, 610) + L(x + 22, 760) + Q(x, 768, x - 22, 760) + 'Z', c, { stroke: shade(c, -0.2), strokeWidth: 1 }), sh(rect(x - 24, 730, 46, 6) + rect(x - 23, 742, 45, 3), s2));
}
scene(place(cap(44, P.red, shade(P.red, -0.2), '#f6ecd6'), { x: 600, y: 616, rot: 0 }));

// =====================================================================
// floor, crest and bench
// =====================================================================
scene(sh(rect(0, 890, W, 40), '#2a4f78'), sh(rect(0, 890, W, 6), '#5584b4'));
scene(planks(0, 930, W, 570, 12, '#c99a62', 51));
{
  // floor crest painted at the centre
  scene(sh(ellipse(600, 1260, 300, 90), P.navy, { opacity: 0.85 }), stroke(ellipse(600, 1260, 280, 80), P.gold, 4, { opacity: 0.9 }), sh(star(600, 1260, 60, 26, 5), P.gold, { opacity: 0.9 }));
  scene(sh(rect(0, 1150, W, 6), '#f4f1ea', { opacity: 0.6 }));
}
// ball cart with basketballs and the volleyball
{
  const cx = 600, cy = 900;
  scene(shadow(cx, cy + 92, 150, 12));
  scene(stroke(rect(cx - 130, cy - 40, 260, 110), '#8a929a', 4), stroke(line([[cx - 130, cy - 4], [cx + 130, cy - 4]]) + line([[cx - 130, cy + 32], [cx + 130, cy + 32]]), '#8a929a', 3));
  const pos: [number, number][] = [[-98, 4], [-44, 4], [10, 4], [64, 4], [110, 6], [-72, -36], [-18, -36], [36, -38], [90, -36], [-100, 44], [-46, 44], [8, 44], [62, 44], [112, 44]];
  pos.forEach(([dx, dy], i) => { if (i !== 7) scene(place(basketball(25, i % 3 ? '#e07a2e' : '#d0702a'), { x: cx + dx, y: cy + dy })); });
  target('volleyball', 'Yellow volleyball', place(volleyball(25, '#f2cf3a', P.navy), { x: cx + 36, y: cy - 38 }));
  scene(stroke(rect(cx - 130, cy - 40, 260, 110) + line([[cx - 130, cy + 70], [cx - 140, cy + 82]]) + line([[cx + 130, cy + 70], [cx + 140, cy + 82]]), '#a3abb2', 4));
  scene(sh(circle(cx - 140, cy + 86, 9) + circle(cx + 140, cy + 86, 9), '#2b2b30'));
}
// long bench
{
  const y = 1090;
  scene(shadow(600, y + 130, 520, 16, 0.18));
  scene(sh(rect(120, y + 30, 22, 100, 3) + rect(1058, y + 30, 22, 100, 3) + rect(588, y + 30, 24, 100, 3), '#5a3a24'));
  scene(sh(rect(130, y + 96, 940, 10, 3), '#6b4a32'));
  scene(planks(80, y, 1040, 36, 2, '#c58a4e', 7), sh(rect(80, y + 32, 1040, 8), '#7a5232'));
}
// things on the bench
scene(place(duffel(150, P.navy, P.red), { x: 200, y: 1090 }));
scene(place(foldedTowel(110, 18, '#f4f1ea', P.navy), { x: 300, y: 1090 }), place(foldedTowel(104, 18, P.red, '#f4f1ea'), { x: 303, y: 1072 }), place(foldedTowel(100, 18, '#f4f1ea', P.teal), { x: 305, y: 1054 }));
scene(place(waterBottle(68, P.red), { x: 440, y: 1090 }), place(waterBottle(62, P.teal), { x: 474, y: 1090 }));
target('stopwatch', 'Stopwatch', place(stopwatch(24), { x: 530, y: 1068 }));
target('clipboard', 'Clipboard', place(clipboard(90, 'plays'), { x: 650, y: 1062, rot: 78 }));
target('towel', 'Rolled towel', place(rolledTowel(20, '#f2cf3a', P.navy), { x: 790, y: 1070 }));
target('bottle', 'Blue water bottle', place(waterBottle(66, '#3a8fd0'), { x: 860, y: 1090 }));
scene(place(waterBottle(60, P.red), { x: 900, y: 1090 }));
scene(place(helmet(80, P.teal, '#f6ecd6'), { x: 1010, y: 1090 }));
scene(place(tennisBall(12), { x: 940, y: 1078 }), place(tennisBall(12), { x: 960, y: 1080 }));

// under the bench
target('soccer-ball', 'Soccer ball under the bench', place(soccerBall(34), { x: 420, y: 1190 }));
scene(place(sneaker(90, '#f4f1ea', P.navy), { x: 260, y: 1220 }), place(sneaker(86, '#f4f1ea', P.navy), { x: 280, y: 1236 }));
target('red-sneaker', 'Red sneaker', place(sneaker(92, P.red, '#f6ecd6'), { x: 820, y: 1226 }));
scene(place(sneaker(86, '#2b2b30', P.gold), { x: 960, y: 1240 }));
scene(place(baseball(12), { x: 700, y: 1214 }));

// =====================================================================
// foreground floor
// =====================================================================
// mesh bag of soccer balls
{
  scene(shadow(130, 1420, 120, 14));
  scene(place(soccerBall(36), { x: 80, y: 1380 }), place(soccerBall(36), { x: 150, y: 1388 }), place(soccerBall(34), { x: 112, y: 1330 }), place(soccerBall(32), { x: 180, y: 1332 }));
  let mesh = '';
  for (let i = 0; i < 10; i++) mesh += line([[40 + i * 18, 1300], [60 + i * 18, 1418]]) + line([[60 + i * 18, 1300], [40 + i * 18, 1418]]);
  scene(stroke(mesh, '#f4f1ea', 1.6, { opacity: 0.8 }), stroke(M(70, 1302) + Q(130, 1280, 200, 1302) + L(196, 1248), '#f4f1ea', 3));
}
scene(place(cone(70), { x: 300, y: 1470 }), place(cone(60), { x: 260, y: 1300 }), place(cone(64, '#f2cf3a'), { x: 1150, y: 1310 }));
target('jump-rope', 'Jump rope', place(jumpRope(130, '#3a8fd0', P.gold), { x: 470, y: 1420 }));
target('dumbbell', 'Teal dumbbell', place(dumbbell(110, P.teal), { x: 680, y: 1440, rot: -6 }));
scene(place(dumbbell(96), { x: 760, y: 1360, rot: 4 }));
// laundry bin with towels
{
  const x = 1010, y = 1480;
  scene(shadow(x, y, 120, 14), ol(poly([[x - 110, y - 180], [x + 110, y - 180], [x + 96, y], [x - 96, y]]), '#9aa4ae', 2), sh(poly([[x - 110, y - 180], [x + 110, y - 180], [x + 108, y - 160], [x - 108, y - 160]]), '#7a848c'));
  scene(sh(blob([[x - 104, y - 180], [x - 70, y - 210], [x - 20, y - 196], [x + 30, y - 220], [x + 80, y - 200], [x + 104, y - 180]], 0.8), '#f4f1ea'), sh(blob([[x - 60, y - 186], [x - 20, y - 214], [x + 20, y - 190]], 0.8), P.red), sh(blob([[x + 30, y - 186], [x + 60, y - 216], [x + 94, y - 186]], 0.8), '#f2cf3a'));
  let slats = '';
  for (let i = 0; i < 6; i++) slats += line([[x - 80 + i * 32, y - 150], [x - 74 + i * 29, y - 14]]);
  scene(stroke(slats, '#7a848c', 3), sh(star(x, y - 80, 22, 9), P.navy));
}
scene(place(volleyball(30, '#f4f1ea', P.red), { x: 860, y: 1450 }));
scene(place(tennisBall(14), { x: 560, y: 1480 }), place(baseball(14), { x: 380, y: 1340 }));

const a: FindActivity = {
  id: 'sports-find-2', version: 2, mode: 'find', title: 'The Locker Room', blurb: 'A friendly club locker room after practice, with kit, trophies and balls of every sport tucked into every corner.',
  collectionId: 'sports', categories: ["Sports"], difficulty: 'Moderate',
  width: 1200, height: 1500, defs,
  items,
};
export default a;
