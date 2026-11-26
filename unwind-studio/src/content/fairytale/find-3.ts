import { blob, circle, curve, ellipse, leaf, line, linearGradient, petal, place, poly, rect, rng, sh, shade, star, stroke } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { FindActivity, FindItem } from '../types';
import {
  GOLD, GOLD_DK, GOLD_LT, bookRow, broom, candle, cauldron, crystalBall, glow, goldenKey, hl, hourglass, ol, owl, planetMobile, pointedArch, potion,
  quillAndInk, shadow, sleepingPet, spectacles, spellbook, starChart, stoneWall, telescope, twinkle, wand, wizardHat, type Pt,
} from './props-find';

const WD = 1200, HT = 1500;
const ID = 'fairytale-find-3';
const items: FindItem[] = [];
const scene = (...s: Shape[]) => { items.push({ shapes: s }); };
const target = (id: string, name: string, s: Shape[]) => { items.push({ id, name, target: true, shapes: s }); };
const WOOD = '#6a4228', WOOD_LT = '#8a5a36', WOOD_DK = '#4a2c1a';
const BOOKS = ['#7a2a3a', '#2f4a7a', '#3f6a4a', '#8a5a2a', '#5a3a7a', '#a8743a', '#2f6a6a', '#9a3a2a'];
const BREWS = ['#7fd36a', '#e870a0', '#4ab0d8', '#b07ad8', '#f2b84a', '#e8603a'];

// ------------------------------------------------------------------ curved stone wall and beamed ceiling
scene(...stoneWall(0, 0, WD, 1110, 46, ['#a8968c', '#b4a296', '#9c8a82', '#ac9a90'], '#7d6c64', 3));
scene(sh(rect(0, 0, WD, 1110), `url(#${ID}-curve)`));
scene(...glow(600, 820, 520, '#ffcf7a', 0.25));
scene(sh(rect(0, 0, WD, 70), WOOD_DK));
{
  let bm = '';
  for (const x of [-200, 100, 400, 800, 1100, 1400]) bm += poly([[600 + (x - 600) * 0.2 - 14, 0], [600 + (x - 600) * 0.2 + 14, 0], [x + 26, 70], [x - 26, 70]]);
  scene(sh(bm, WOOD), sh(rect(0, 62, WD, 18), WOOD_LT), stroke(line([[0, 80], [WD, 80]]), WOOD_DK, 3));
}
// hanging dried herbs
{
  const g = rng(5);
  for (const x of [380, 450, 760, 830, 900]) {
    const len = g.range(60, 100);
    scene(stroke(line([[x, 80], [x, 80 + len * 0.4]]), '#c9b48a', 1.4));
    let lv = '';
    for (let k = 0; k < 9; k++) lv += leaf(x + g.range(-4, 4), 80 + len * 0.4, len * g.range(0.5, 0.75), 4, 90 + g.range(-25, 25));
    scene(sh(lv, g.pick(['#7a8a4a', '#8a9a5a', '#9a7a4a', '#6a7a5a'])), sh(rect(x - 6, 80 + len * 0.4 - 4, 12, 6, 2), '#a8323a'));
  }
}

// ------------------------------------------------------------------ the great pointed window
scene(ol(pointedArch(600, 680, 360, 600), '#c8b8aa', 1.6, -0.3), stroke(pointedArch(600, 680, 336, 584), '#8a7a70', 2));
scene(sh(pointedArch(600, 660, 300, 540), `url(#${ID}-sky)`));
{
  const g = rng(9);
  let st = '', tw = '';
  for (let i = 0; i < 60; i++) {
    const x = g.range(462, 738), y = g.range(170, 640);
    if (y < 300 && Math.abs(x - 600) > (y - 120) * 0.9) continue;
    if (i % 8 === 0) tw += twinkle(x, y, g.range(4, 7)); else st += circle(x, y, g.range(0.8, 2));
  }
  scene(sh(st, '#fff8dc'), sh(tw, '#fff3c0'));
  // a constellation and the crescent moon
  const con: Pt[] = [[480, 420], [510, 380], [548, 396], [572, 360], [560, 320]];
  scene(stroke(line(con), '#bcd0ff', 1, { opacity: 0.6 }), sh(con.map(([x, y]) => circle(x, y, 2.6)).join(''), '#ffffff'));
  scene(...glow(680, 250, 70, '#fff0c8', 0.35), sh(circle(680, 250, 30), '#fbf1cf'), sh(circle(694, 240, 26), '#283a7a'));
  // far mountains and forest under the moon
  scene(sh(blob([[450, 600], [500, 540], [560, 580], [620, 520], [690, 570], [750, 540], [750, 660], [450, 660]], 0.5), '#2a3466'), sh(poly([[620, 520], [606, 540], [634, 540]]), '#e8eaf6'));
  let pines = '';
  for (let x = 456; x < 748; x += 18) { const h = g.range(26, 46); pines += poly([[x - 9, 660], [x, 660 - h], [x + 9, 660]]); }
  scene(sh(pines, '#1c2448'));
}
scene(stroke(line([[600, 150], [600, 660]]) + line([[450, 420], [750, 420]]) + line([[450, 540], [750, 540]]), '#5a4a44', 6), stroke(line([[600, 150], [600, 660]]), '#8a7a70', 2));
scene(ol(rect(410, 660, 380, 22, 3), '#c8b8aa', 1.2, -0.3));
target('mobile', 'Planet mobile', place(planetMobile(), { x: 600, y: 80, s: 1 }));
target('telescope', 'Telescope', place(telescope(), { x: 610, y: 662, s: 1.1 }));
scene(...place([sh(ellipse(0, 0, 14, 4), '#9a8a7a'), ...potion(2, '#4ab0d8')], { x: 760, y: 662, s: 0.6 }));

// ------------------------------------------------------------------ wall sconces, framed moon phases, star chart
for (const [x, y] of [[392, 520], [880, 300]] as Pt[]) scene(...place([ol(rect(-8, -2, 16, 30, 3), GOLD, 1), ol(poly([[-16, 0], [16, 0], [10, -8], [-10, -8]]), GOLD, 1), ...candle(30)], { x, y }));
scene(ol(rect(380, 250, 52, 160, 3), WOOD, 1.2), sh(rect(388, 258, 36, 144), '#22284a'));
{
  let ph = '';
  for (let k = 0; k < 5; k++) ph += circle(406, 276 + k * 28, 9);
  scene(sh(ph, '#f6ecc8'), sh(circle(414, 276, 9) + circle(410, 304, 8) + circle(402, 360, 8) + circle(398, 388, 9), '#22284a'));
}
target('chart', 'Star chart', place(starChart(), { x: 880, y: 620, s: 1.25 }));
scene(sh(circle(880, 476, 4) + circle(880, 616, 4), '#c8324a'));
// potion shelf
{
  scene(ol(rect(760, 770, 230, 12, 2), WOOD_LT, 1), sh(poly([[770, 782], [790, 782], [770, 806]]) + poly([[980, 782], [960, 782], [980, 806]]), WOOD));
  const kinds = [1, 0, 2, 1, 0, 1, 2];
  kinds.forEach((k, i) => scene(...place(potion(k, BREWS[(i + 2) % BREWS.length]), { x: 782 + i * 31, y: 770, s: 0.7 })));
}

// ------------------------------------------------------------------ the curling staircase
{
  const N = 18;
  const pts: Pt[] = [];
  for (let i = 0; i <= N; i++) { const t = i / N; pts.push([960 + 220 * Math.pow(t, 0.7), 1090 - 1000 * t]); }
  for (let i = N - 1; i >= 0; i--) {
    const [x, y] = pts[i], w = 170 * (1 - 0.45 * (i / N)), d = 16 * (1 - 0.3 * (i / N));
    scene(sh(poly([[x - w * 0.45, y - 46], [x + w * 0.55, y - 46], [x + w * 0.55 + 10, y], [x - w * 0.45, y]]), '#8a7a72'));
    scene(sh(poly([[x - w * 0.45, y - 46 - d], [x + w * 0.55 + 10, y - 46 - d], [x + w * 0.55, y - 46], [x - w * 0.45, y - 46]]), i % 2 ? '#a08a6e' : '#9a8468'), stroke(line([[x - w * 0.45, y - 46], [x + w * 0.55, y - 46]]), '#5a4a40', 1.4));
  }
  // banister posts and rail
  let posts = '';
  const rail: Pt[] = [];
  for (let i = 0; i < N; i++) { const [x, y] = pts[i], w = 170 * (1 - 0.45 * (i / N)); const px = x - w * 0.45 + 6; posts += rect(px - 3, y - 46 - 70, 6, 70); rail.push([px, y - 46 - 72]); }
  scene(sh(posts, WOOD), stroke(curve(rail), WOOD_DK, 9), stroke(curve(rail), WOOD_LT, 3));
  scene(ol(rect(rail[0][0] - 9, 970, 18, 120, 3), WOOD, 1), ol(circle(rail[0][0], 964, 11), GOLD, 1));
}
target('wand', 'Magic wand', place(wand(), { x: 1050, y: 880, s: 0.75, rot: -10 }));

// ------------------------------------------------------------------ the tall bookcase
{
  const x0 = 20, x1 = 340;
  scene(ol(rect(x0, 150, x1 - x0, 950, 3), WOOD, 1.4), sh(rect(x0 + 16, 166, x1 - x0 - 32, 920), '#3a2620'));
  const shelves = [300, 450, 600, 750, 900, 1050];
  for (const y of shelves) scene(ol(rect(x0 + 10, y, x1 - x0 - 20, 14, 2), WOOD_LT, 1));
  scene(ol(rect(x0 - 10, 140, x1 - x0 + 20, 18, 3), WOOD_LT, 1.2));
  scene(...place(bookRow(190, 110, 11, BOOKS), { x: 40, y: 300 }));
  [0, 1, 0].forEach((k, i) => scene(...place(potion(k, BREWS[i * 2]), { x: 254 + i * 28, y: 300, s: 0.75 })));
  scene(...place(bookRow(110, 110, 12, BOOKS), { x: 40, y: 450 }));
  [1, 2, 0].forEach((k, i) => scene(...place(potion(k, BREWS[(i + 1) % 6]), { x: 236 + i * 32, y: 450, s: 0.85 })));
  scene(...place(bookRow(150, 120, 13, BOOKS), { x: 40, y: 600 }));
  // crystal cluster
  scene(sh(poly([[220, 600], [228, 552], [240, 600]]) + poly([[236, 600], [252, 540], [262, 600]]) + poly([[256, 600], [270, 566], [276, 600]]), '#b8a0f0'), sh(poly([[236, 600], [252, 540], [248, 600]]), '#d8c8ff'));
  scene(...place(bookRow(90, 100, 14, BOOKS), { x: 210, y: 600 }).map((p) => p).slice(0, 0));
  scene(...place(bookRow(130, 110, 15, BOOKS), { x: 190, y: 750 }));
  // jars of curiosities
  for (const [x, c] of [[60, '#e8c070'], [110, '#9fd8a0'], [156, '#e8a0b0']] as [number, string][]) scene(ol(rect(x - 18, 690, 36, 60, 6), '#dcecf0', 1, -0.3), sh(rect(x - 15, 712, 30, 36, 5), c, { opacity: 0.8 }), ol(rect(x - 20, 684, 40, 9, 2), '#8a5a3a', 1));
  scene(...place(bookRow(270, 120, 16, BOOKS), { x: 40, y: 900 }));
  // big books lying flat
  for (let k = 0; k < 4; k++) scene(ol(rect(44 + (k % 2) * 6, 1036 - k * 20, 140 - k * 8, 18, 2), BOOKS[k + 2], 1), sh(rect(44 + (k % 2) * 6 + 4, 1036 - k * 20 + 7, 130 - k * 8, 3), '#f3e6c4'));
  // scroll pile
  for (let k = 0; k < 5; k++) scene(ol(rect(210 + (k % 3) * 34, 1020 - Math.floor(k / 3) * 22, 30, 28, 14), '#efe0bc', 1, -0.25), sh(circle(225 + (k % 3) * 34, 1034 - Math.floor(k / 3) * 22, 5), '#d8c49a'));
}
target('potion', 'Heart-shaped potion', place(potion(3, '#e870a0'), { x: 186, y: 450, s: 1 }));
target('owl', 'Little owl', place(owl('#a8805a'), { x: 240, y: 142, s: 0.78 }));
scene(...place([ol(rect(-22, -40, 44, 40, 5), '#5a7aa0', 1), ol(rect(-26, -46, 52, 8, 3), '#3f5a7a', 1)], { x: 90, y: 142 }), ...place(candle(30), { x: 140, y: 142 }));

// ------------------------------------------------------------------ the floor and rug
scene(sh(rect(0, 1090, WD, 410), '#6e4a30'));
{
  let pl = '';
  for (let k = 0; k < 9; k++) { const y = 1110 + k * 46 + k * k * 2; pl += curve([[0, y + 20], [600, y - 8], [WD, y + 20]]); }
  for (let k = -8; k <= 8; k++) pl += line([[600 + k * 40, 1090], [600 + k * 170, 1500]]);
  scene(stroke(pl, '#563622', 2), sh(rect(0, 1090, WD, 12), '#4e3220'));
}
scene(sh(ellipse(620, 1310, 470, 150), '#2a3a6a'), sh(ellipse(620, 1310, 440, 136), '#34488a'), stroke(ellipse(620, 1310, 410, 124) + ellipse(620, 1310, 300, 88), GOLD, 3));
{
  let sm = '';
  for (let k = 0; k < 16; k++) { const a = (k / 16) * Math.PI * 2; sm += star(620 + Math.cos(a) * 355, 1310 + Math.sin(a) * 106, 9, 3.6, 5); }
  scene(sh(sm, GOLD_LT), sh(star(620, 1310, 120, 40, 8), '#4a5aa0'), sh(circle(620, 1310, 30), '#f3d27a', { opacity: 0.6 }));
  let fr = '';
  for (let k = 0; k < 60; k++) { const a = (k / 60) * Math.PI * 2; const x = 620 + Math.cos(a) * 470, y = 1310 + Math.sin(a) * 150; if (Math.sin(a) > 0) fr += line([[x, y], [x + Math.cos(a) * 10, y + Math.sin(a) * 10]]); }
  scene(stroke(fr, '#c8b07a', 2));
}

// ------------------------------------------------------------------ the desk
{
  const x0 = 400, x1 = 830, ty = 886;
  scene(shadow(615, 1092, 230, 12, 0.3));
  scene(ol(rect(x0 + 14, ty + 20, 24, 176, 3), WOOD_DK, 1), ol(rect(x1 - 38, ty + 20, 24, 176, 3), WOOD_DK, 1));
  scene(ol(rect(x0 + 30, ty + 18, x1 - x0 - 60, 80, 3), WOOD, 1.2));
  for (const x of [x0 + 50, x0 + 160, x0 + 270]) scene(ol(rect(x, ty + 30, 96, 52, 3), WOOD_LT, 1), ol(circle(x + 48, ty + 56, 5), GOLD, 1));
  scene(ol(rect(x0, ty - 4, x1 - x0, 24, 4), WOOD_LT, 1.2), sh(rect(x0 + 4, ty - 2, x1 - x0 - 8, 6, 3), '#a8784a'));
  // book stack and candles
  for (let k = 0; k < 4; k++) scene(ol(rect(796 - k * 3, ty - 18 - k * 16, 60 - k * 4, 16, 2), BOOKS[(k + 4) % BOOKS.length], 1));
  scene(...place(candle(46), { x: 820, y: ty - 82 }), ...place(candle(30), { x: 424, y: ty - 4 }), ...place(candle(20), { x: 442, y: ty - 4 }));
  // scattered papers
  scene(sh(poly([[540, ty - 4], [600, ty - 8], [606, ty + 6], [546, ty + 10]]), '#f3e6c4', { opacity: 0.95 }), stroke(line([[552, ty], [592, ty - 3]]) + line([[552, ty + 4], [596, ty + 1]]), '#9a8a70', 0.8));
}
target('ball', 'Crystal ball', place(crystalBall(), { x: 610, y: 884, s: 1.1 }));
target('book', 'Open spellbook', place(spellbook(), { x: 480, y: 896, s: 1 }));
target('quill', 'Quill and inkpot', place(quillAndInk(), { x: 700, y: 886, s: 1 }));
target('hourglass', 'Hourglass', place(hourglass(), { x: 762, y: 886, s: 0.85 }));
target('specs', 'Spectacles', place(spectacles(), { x: 630, y: 900, s: 0.9, rot: -6 }));

// ------------------------------------------------------------------ the cauldron corner
target('cauldron', 'Cauldron', place(cauldron(), { x: 210, y: 1250, s: 1.15 }));
{
  const g = rng(31);
  let lg = '';
  for (let k = 0; k < 4; k++) lg += rect(30 + k * 8, 1306 - k * 14, 70, 14, 7);
  scene(sh(lg, '#7a4e30'), sh(circle(34, 1313, 6) + circle(42, 1299, 6) + circle(50, 1285, 6) + circle(58, 1271, 6), '#c8a07a'));
  void g;
}
target('broom', 'Broomstick', place(broom(), { x: 372, y: 1100, s: 1.2, rot: 10 }));

// ------------------------------------------------------------------ chest, globe and odds on the floor
scene(...place([
  shadow(0, 2, 70, 8), ol(rect(-64, -60, 128, 60, 4), '#7a4a2a', 1.2), ol(blob([[-64, -60], [-60, -90], [0, -100], [60, -90], [64, -60]], 0.6), '#8a5a34', 1.2),
  sh(rect(-64, -66, 128, 8) + rect(-40, -100, 10, 100) + rect(30, -100, 10, 100), GOLD_DK), ol(rect(-9, -72, 18, 20, 3), GOLD, 1), sh(circle(0, -62, 3), '#3a2a1a'),
], { x: 1040, y: 1230 }));
scene(...place([
  shadow(0, 2, 30, 5), stroke(line([[0, 0], [0, -40]]) + line([[-20, 0], [20, 0]]), WOOD_DK, 4),
  stroke(curve([[-30, -70], [-34, -100], [-10, -128]]), GOLD_DK, 3), sh(circle(0, -92, 30), '#4a8ab0'),
  sh(blob([[-18, -110], [-4, -116], [4, -100], [-10, -88], [-20, -96]], 0.8) + blob([[6, -84], [20, -90], [24, -74], [10, -70]], 0.8), '#7aa85a'), hl(ellipse(-10, -104, 6, 4, -30), 0.4),
], { x: 1140, y: 1400 }));
target('hat', 'Pointed hat', place(wizardHat(), { x: 430, y: 1440, s: 0.95, rot: -6 }));
target('cat', 'Sleeping cat', place([sh(ellipse(0, -6, 66, 20), '#8a3a4a'), sh(ellipse(0, -12, 60, 14), '#a84a5a'), ...place(sleepingPet('#e39a52', 'cat'), { y: -12, s: 0.82 })], { x: 790, y: 1380 }));
target('key', 'Brass key', place(goldenKey('#c9963a'), { x: 990, y: 1420, s: 0.72, rot: -20 }));
// stack of books with a candle in the front corner
for (let k = 0; k < 5; k++) scene(ol(rect(60 + (k % 2) * 8, 1480 - k * 22, 150 - k * 10, 22, 2), BOOKS[k], 1), sh(rect(66 + (k % 2) * 8, 1480 - k * 22 + 9, 138 - k * 10, 3), '#f3e6c4'));
scene(...place(candle(40), { x: 120, y: 1370 }));
for (let k = 0; k < 5; k++) scene(ol(rect(898 + k * 9 - 6, 1440 - (k % 2) * 14 - 50, 14, 64, 7), '#efe0bc', 1, -0.25));
scene(...place([ol(poly([[-30, 0], [30, 0], [24, -50], [-24, -50]]), '#b8743a', 1.2), stroke(line([[-26, -16], [26, -16]]) + line([[-28, -34], [28, -34]]), '#8a5228', 2)], { x: 920, y: 1480 }));
{
  const g = rng(41);
  let cr = '';
  for (let i = 0; i < 6; i++) { const x = 560 + i * 12 + g.range(-3, 3); cr += poly([[x - 5, 1470], [x, 1470 - g.range(14, 30)], [x + 5, 1470]]); }
  scene(sh(cr, '#8ad8c8'), shadow(590, 1472, 40, 5));
  // scattered star confetti of magic
  let sp = '';
  for (let i = 0; i < 26; i++) sp += twinkle(g.range(20, WD - 20), g.range(160, 1490), g.range(3, 6));
  scene(sh(sp, '#fff3c0', { opacity: 0.8 }));
}
scene(...place(potion(0, '#e8603a'), { x: 300, y: 1470, s: 0.9 }), ...place(potion(1, '#7fd36a'), { x: 680, y: 1490, s: 0.9 }));
scene(sh(rect(0, 0, WD, HT), `url(#${ID}-vignette)`, { opacity: 0.24 }));
void petal; void GOLD_LT;

const activity: FindActivity = {
  id: ID, version: 2, mode: 'find',
  title: "The Wizard's Tower",
  blurb: 'High in a round stone study the candles burn low, the cauldron bubbles and the wizard\'s cat dreams among the star charts.',
  added: '2026-11-25', collectionId: 'fairytale', categories: ["Fairytale"], difficulty: 'Detailed',
  width: WD, height: HT,
  defs:
    linearGradient(`${ID}-sky`, [[0, '#10184a'], [0.6, '#283a7a'], [1, '#4a4a8a']]) +
    `<linearGradient id="${ID}-curve" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2a1a20" stop-opacity="0.5"/><stop offset="0.3" stop-color="#2a1a20" stop-opacity="0"/><stop offset="0.7" stop-color="#2a1a20" stop-opacity="0"/><stop offset="1" stop-color="#2a1a20" stop-opacity="0.5"/></linearGradient>` +
    `<radialGradient id="${ID}-vignette" cx="0.5" cy="0.5" r="0.75"><stop offset="0.6" stop-color="#1a1020" stop-opacity="0"/><stop offset="1" stop-color="#1a1020" stop-opacity="1"/></radialGradient>`,
  items,
};
export default activity;
