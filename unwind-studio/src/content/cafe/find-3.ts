import { rect, ellipse, circle, poly, line, curve, leaf, sh, stroke, place, shade, rng, linearGradient, xf, type Rng } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { FindActivity, FindItem } from '../types';
import { ol, shadow, mug } from '../kitchen/props-find';
import { bookcase, bookcaseFront, shelfRow, knight, globe, tableLamp, fern, ivy, succulent, glowGradient, type Seg } from '../library/props';
import {
  K, woodFloor, fairyLights, cityView, sofa, cushion, remote, boardGame, die, playingCard, pawn, sandTimer, popcornBucket, pizzaBox, pizzaSlice, sodaCan, scorePad, pencil,
  spinner, bone, tennisBall, lyingDog, jarCandle, snackBowl, tumbler, recordSleeve, artPrint, headphones,
} from './props-find';

const ID = 'cafe-find-3';
const W = 1200, H = 1500;
const items: FindItem[] = [];
const scene = (...s: (Shape | Shape[])[]) => { items.push({ shapes: s.flat() }); };
const target = (id: string, name: string, shapes: Shape[]) => { items.push({ id, name, target: true, shapes }); };
const at = (s: Shape[], x: number, y: number, k = 1, rot = 0) => place(s, { x, y, s: k, rot });

const defs =
  linearGradient(`${ID}-night`, [[0, '#1b2440'], [0.7, '#2e3a5c'], [1, '#4a4a68']]) +
  glowGradient(`${ID}-glow`, '#ffd98a', 0.45, 0.4) +
  glowGradient(`${ID}-lamp`, '#ffe3a0', 0.55, 0.35);

/** Stack of board-game boxes lying flat, width w, origin bottom centre. */
function gameBoxes(w: number, n: number, g: Rng): Shape[] {
  const out: Shape[] = [];
  let y = 0;
  const cols = [K.red, K.teal, K.mustard, K.navy, '#7f9f6a', '#d98a7a', K.plum, '#e8dcc0'];
  for (let i = 0; i < n; i++) {
    const t = g.range(12, 20), bw = w * g.range(0.8, 1), x = -bw / 2 + g.range(-4, 4), c = g.pick(cols);
    out.push(ol(rect(x, y - t, bw, t, 2), c, 1, -0.35), sh(rect(x, y - t, bw, t * 0.35, 2), shade(c, 0.2)), sh(rect(x + bw * 0.1, y - t * 0.7, bw * 0.3, t * 0.4, 1), '#fbf6ec', { opacity: 0.85 }), sh(circle(x + bw * 0.75, y - t / 2, t * 0.22), g.pick(cols)));
    y -= t;
  }
  return out;
}
/** Back of a playing card fan, origin pivot. */
function backFan(s: number, n: number, rot0: number): Shape[] {
  const out: Shape[] = [];
  for (let i = 0; i < n; i++) out.push(...playingCard(s, 0, true).map((p) => ({ ...p, d: xf(p.d, { rot: rot0 + i * 14, y: -s * 0.35, ox: 0, oy: s * 0.35 }) })));
  return out;
}

// =====================================================================
// back wall, window and fairy lights
// =====================================================================
scene(sh(rect(0, 0, W, 850), '#34505a'));
{
  const g = rng(2);
  let d = '';
  for (let r = 0, y = 30; y < 850; y += 48, r++) for (let x = (r % 2) * 30; x < W; x += 60) d += leaf(x, y, 12, 4, -60 + g.range(-10, 10)) + leaf(x, y, 12, 4, -120 + g.range(-10, 10));
  scene(sh(d, '#3f5e68', { opacity: 0.9 }));
}
scene(sh(rect(0, 820, W, 30), '#2a3e45'), sh(rect(0, 820, W, 4), '#4a6a72'));
// night window
{
  const x0 = 410, y0 = 110, w = 380, h = 360;
  scene(sh(rect(x0, y0, w, h), `url(#${ID}-night)`));
  const g = rng(9);
  let st = '';
  for (let i = 0; i < 30; i++) st += circle(x0 + g.range(5, w - 5), y0 + g.range(5, 110), g.range(0.8, 1.8));
  scene(sh(st, '#fbf3df', { opacity: 0.8 }), sh(circle(x0 + 300, y0 + 60, 26), '#f6ecc8'), sh(circle(x0 + 290, y0 + 54, 22), '#fbf6e0'));
  scene(cityView(x0, y0 + 90, w, h - 90, 33, true, `url(#${ID}-night)`));
  scene(sh(rect(x0 - 14, y0 - 14, w + 28, 14) + rect(x0 - 14, y0, 14, h) + rect(x0 + w, y0, 14, h) + rect(x0 + w / 2 - 6, y0, 12, h) + rect(x0, y0 + 140, w, 10), '#e8dcc0'));
  scene(sh(rect(x0 - 30, y0 + h, w + 60, 16, 3), '#e8dcc0'), sh(rect(x0 - 30, y0 + h + 16, w + 60, 6), '#000000', { opacity: 0.2 }));
  scene(at(succulent('#d98a7a', K.sage), x0 + 40, y0 + h), at(jarCandle(40, '#f0dcc0', true), x0 + 110, y0 + h), at(succulent(K.teal, '#7f9f6a'), x0 + 330, y0 + h));
  scene(at(recordSleeve(60, '#e8dcc0', K.red, 4), x0 + 220, y0 + h, 1, 6));
  // curtains
  for (const [cx, dir] of [[x0 - 40, -1], [x0 + w + 40, 1]] as [number, number][]) {
    scene(sh(poly([[cx - 40, y0 - 40], [cx + 40, y0 - 40], [cx + 30 + dir * 10, y0 + h + 60], [cx - 30 + dir * 10, y0 + h + 60]]), '#b8862e'), stroke(line([[cx - 16, y0 - 36], [cx - 14 + dir * 6, y0 + h + 56]]) + line([[cx + 14, y0 - 36], [cx + 18 + dir * 6, y0 + h + 56]]), '#94661e', 3));
  }
  scene(sh(rect(x0 - 100, y0 - 46, w + 200, 8, 4), '#2b2622'));
}
// lights in loose swags under the ceiling and around the window
scene(fairyLights([[0, 30], [300, 50], [600, 26], [900, 50], [1200, 30]], 46, 30, ['#ffd98a', '#f6b0a0', '#fff1c4', '#a8e0d0'], 3, 5));
scene(fairyLights([[396, 100], [600, 120], [804, 100]], 30, 28, ['#ffd98a', '#fff1c4'], 4, 4));

// =====================================================================
// bookshelves
// =====================================================================
type Pos = { x: number; y: number };
const spots: Record<string, Pos> = {};
const gap = (w: number, name: string): Seg => ({ w, make: (cx, by) => { spots[name] = { x: cx, y: by }; return []; } });
const prop = (w: number, f: () => Shape[]): Seg => ({ w, make: (cx, by) => at(f(), cx, by) });
const pal = [K.red, K.redDk, K.teal, K.tealDk, K.mustard, K.navy, '#7f9f6a', '#e8dcc0', '#c98a5a', K.plum, '#5a6a8a', '#d98a7a', '#3d6a3a'];
function shelves(x: number, seed: number, rows: Seg[][]) {
  const r = rng(seed);
  const opt = { wood: '#6a4428', cols: [] as number[] };
  const bc = bookcase(x, 110, 300, 712, 5, opt);
  const out: Shape[] = [...bc.shapes];
  bc.cells.forEach((c, i) => out.push(...shelfRow(c.x0, c.x1, c.baseY, c.h, r, rows[i] ?? [0], pal)));
  out.push(...bookcaseFront(x, 110, 300, 712, 5, opt));
  scene(out);
}
const g1 = rng(41), g2 = rng(42);
shelves(16, 5, [
  [0, prop(64, () => gameBoxes(60, 4, g1)), 60],
  [50, gap(56, 'knight'), 0, prop(60, () => at(ivy(rng(3), 60, 40, 30, '#e8dcc0'), 0, 0))],
  [prop(90, () => gameBoxes(86, 5, g1)), 0],
  [0, prop(70, () => at(globe(), 0, 0, 0.7)), 40],
  [prop(84, () => gameBoxes(80, 3, g1)), 0, prop(60, () => at(fern(rng(7), 50, 40, 32), 0, 0))],
]);
shelves(884, 6, [
  [prop(60, () => at(tableLamp('#e8b84a', K.teal), 0, 0, 0.55)), 0, 40],
  [0, prop(90, () => gameBoxes(86, 5, g2)), 30],
  [40, gap(64, 'headphones'), 0],
  [0, prop(64, () => at(fern(rng(8), 50, 40, 32, '#d98a7a'), 0, 0)), 50],
  [prop(92, () => gameBoxes(88, 4, g2)), 0],
]);
target('chess-knight', 'Chess knight', at(knight('#efe2c2'), spots.knight.x, spots.knight.y, 0.9));
target('headphones', 'Headphones', at(headphones(52, '#2b2622', K.teal), spots.headphones.x, spots.headphones.y - 30));
// warm glow from the lamps
scene(sh(circle(990, 160, 160), `url(#${ID}-lamp)`));

// =====================================================================
// sofa and floor
// =====================================================================
scene(woodFloor(850, H, W, ['#7a5032', '#6e472c', '#85583a', '#694228'], 57));
scene(sh(rect(0, 850, W, 14), '#000000', { opacity: 0.25 }));
scene(sh(ellipse(600, 1180, 560, 330), `url(#${ID}-glow)`));
scene(at(sofa(520, '#6a7a4a'), 600, 870));
scene(at(cushion(70, K.mustard, '#fbf6ec', 0, -8), 410, 750), at(cushion(66, '#d98a7a', '#fbf6ec', 1, 6), 780, 752), at(cushion(62, '#e8dcc0', K.teal, 2, -4), 720, 760));
scene(sh(poly([[512, 744], [570, 744], [584, 834], [524, 840]]), '#c8473a'), stroke(line([[516, 764], [574, 764]]) + line([[520, 800], [580, 802]]), '#f3d77a', 3));
target('remote', 'Remote control', at(remote(64, '#2b2622'), 650, 788, 1, 70));
scene(at(artPrint(64, 84, 1, '#c9a46a', '#f3ead6'), 344, 520), at(artPrint(64, 84, 2, '#2b2622'), 794, 520));
// big kilim rug
{
  scene(sh(poly([[60, 960], [1140, 960], [1190, 1490], [10, 1490]]), '#8a3a32'));
  let d1 = '', d2 = '';
  for (let i = 0; i < 6; i++) { const y = 990 + i * 84; d1 += poly([[50, y], [1150, y], [1152, y + 12], [48, y + 12]]); }
  for (let r = 0; r < 6; r++) for (let x = 90; x < 1120; x += 70) { const y = 1030 + r * 84; d2 += poly([[x, y], [x + 18, y - 14], [x + 36, y], [x + 18, y + 14]]); }
  scene(sh(d1, '#d9a53a', { opacity: 0.9 }), sh(d2, '#e8dcc0', { opacity: 0.7 }), stroke(poly([[70, 970], [1130, 970], [1178, 1480], [22, 1480]]), '#2f5a50', 6));
}
// things on the floor behind the table
scene(at(gameBoxes(110, 4, rng(5)), 960, 930), at(gameBoxes(90, 3, rng(6)), 240, 920));
scene(ol(ellipse(1100, 950, 60, 18), '#3f7f7a', 1, -0.3), ol(rect(1040, 890, 120, 58, 26), '#4a8a84', 1, -0.3), sh(ellipse(1100, 892, 58, 16), '#5aa098'));

// =====================================================================
// coffee table and the game
// =====================================================================
{
  const back = 1040, front = 1240;
  // legs and the dog underneath
  scene(sh(rect(120, 1260, 30, 210, 4) + rect(1050, 1260, 30, 210, 4), '#4a2c1c'), sh(rect(220, 1260, 20, 170) + rect(960, 1260, 20, 170), '#3b2416'));
  scene(at(lyingDog(330, '#c98a4a', '#fbf0dc'), 640, 1440));
  target('bone', 'Dog bone', at(bone(56), 380, 1430, 1, 18));
  target('tennis-ball', 'Tennis ball', at(tennisBall(15), 860, 1436));
  const top = poly([[170, back], [1030, back], [1100, front], [100, front]]);
  scene(sh(top, '#9a6a40'), stroke(curve([[300, back + 10], [290, 1140], [270, front - 6]]) + curve([[700, back + 8], [720, 1140], [740, front - 6]]), '#7a4f2e', 1.4, { opacity: 0.6 }), sh(rect(94, front, 1012, 26, 3), '#7a4f2e'), sh(rect(94, front, 1012, 5, 2), '#b07a4a'), sh(rect(94, front + 26, 1012, 6), '#000000', { opacity: 0.3 }));
  // back row
  target('popcorn', 'Popcorn bucket', at(popcornBucket(96, K.red, 3), 236, 1110));
  scene(at(tumbler(54, '#c98d55', undefined, true), 330, 1100));
  target('crisps', 'Bowl of crisps', at(snackBowl(84, '#3f7f7a', '#e8c070', 4), 150, 1200));
  target('candle', 'Scented candle', at(jarCandle(46, '#f0dcc0', true), 420, 1070));
  scene(at(boardGame(300, 7), 600, 1140));
  scene(at(pawn(22, K.red), 520, 1082), at(pawn(22, '#7f9f6a'), 660, 1100), at(pawn(22, K.mustard), 700, 1186), at(pawn(22, '#fbf6ec'), 486, 1192));
  target('soda-can', 'Fizzy drink can', at(sodaCan(58, K.teal, '#fbf6ec'), 790, 1078));
  target('sand-timer', 'Sand timer', at(sandTimer(50), 838, 1092));
  scene(at(pizzaBox(190, 5), 960, 1120));
  scene(at(tumbler(50, '#e86a5a', '#fbf6ec', true), 1066, 1130));
  // front row
  scene(sh(ellipse(256, 1206, 54, 13), '#fbf6ec', { stroke: '#d9cfb8', strokeWidth: 1 }));
  target('pizza-slice', 'Pizza slice', at(pizzaSlice(76, 9), 214, 1206, 1, -12));
  scene(at(backFan(56, 4, -24), 380, 1230));
  target('spinner', 'Game spinner', at(spinner(22), 404, 1146));
  target('red-die', 'Red die', at(die(24, 5, K.red, '#fbf6ec'), 500, 1226, 1, 8));
  scene(at(die(24, 3), 540, 1232, 1, -10), at(die(24, 6), 572, 1222, 1, 4));
  target('blue-pawn', 'Blue pawn', at(pawn(36, '#4a6ab0'), 644, 1236));
  target('ace', 'Ace of spades', at(playingCard(60, 2), 720, 1214, 1, 14));
  scene(at(backFan(56, 3, 0), 820, 1238));
  target('score-pad', 'Score pad', at(scorePad(52), 920, 1202, 1, -6));
  scene(at(pencil(80, K.mustard), 1010, 1214, 1, -30));
  scene(at(mug(34, '#fbf6ec', K.red), 1066, 1236));
  scene(stroke(curve([[232, 1010], [240, 986], [230, 966]]), '#ffffff', 2, { opacity: 0.4 }));
}

// =====================================================================
// foreground floor cushions and a basket
// =====================================================================
scene(at(cushion(150, '#2f5a50', '#d9a53a', 2, -6), 60, 1440), at(cushion(140, K.mustard, '#8a3a32', 0, 8), 1150, 1440));
scene(at(cushion(110, '#d98a7a', '#fbf6ec', 1, -12), 1080, 1490));

const activity: FindActivity = {
  id: ID, version: 1, mode: 'find', title: 'Game Night',
  blurb: 'Fairy lights, a half-finished board game, pizza and popcorn, with the dog asleep under the table.',
  added: '2026-11-25', collectionId: 'cafe', categories: ["Cozy", "Coffeehouse"], difficulty: 'Detailed',
  width: W, height: H, defs, items,
};
export default activity;
