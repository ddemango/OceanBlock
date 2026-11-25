import { rect, ellipse, circle, poly, line, curve, blob, leaf, sh, stroke, place, shade, rng, linearGradient } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { FindActivity, FindItem } from '../types';
import {
  M, L, Q, ol, shadow, H, planks, wallpaper, plate, jug, pumpkin, gourd, leafScatter, mapleLeafPath, foliageClump, roastTurkey, pie, gravyBoat, cornucopia, placeCard,
  candlestick, pillarCandle, cranberrySauce, breadBasket, pepperMill, ciderPitcher, wineGlass, squirrel, sunflowerVase, platePersp, napkin, servingDish, chairBack,
  framedPicture, cornCob, garland,
} from './props-find';

const ID = 'holidays-find-2';
const W = 1200, HT = 1500;
const items: FindItem[] = [];
const scene = (...s: (Shape | Shape[])[]) => { items.push({ shapes: s.flat() }); };
const target = (id: string, name: string, shapes: Shape[]) => { items.push({ id, name, target: true, shapes }); };

const defs =
  linearGradient(`${ID}-sky`, [[0, '#9cc4dc'], [0.7, '#d8e6e4'], [1, '#f4e8c8']]) +
  linearGradient(`${ID}-cloth`, [[0, '#f2e8d2'], [1, '#fbf5e8']]);

const LEAVES = ['#d0602a', '#e8902c', '#c8402a', '#e8b030', '#a84a2a'];

// =====================================================================
// back wall, wainscot and floor
// =====================================================================
scene(wallpaper(0, 0, W, 660, 64, '#f4e6cc', '#b98a5a', '#d0703a', 5));
scene(planks(0, 640, W, 130, 12, '#8a5a34', 7, true), ol(rect(0, 628, W, 16, 2), '#a8743e', 1, -0.3), sh(rect(0, 644, W, 6), '#3b2a1c', { opacity: 0.2 }));
{
  let pan = '';
  for (let x = 20; x < W; x += 100) pan += rect(x, 662, 80, 90, 3);
  scene(stroke(pan, '#6e4a2a', 2));
}
scene(planks(0, 770, W, 660, 22, '#9a6a40', 9), sh(rect(0, 770, W, 8), '#3b2a1c', { opacity: 0.25 }));
// woven rug under the table
scene(sh(poly([[60, 880], [1140, 880], [1200, 920], [0, 920]]), '#a8402a'), stroke(line([[80, 888], [1120, 888]]) + line([[40, 904], [1160, 904]]), '#e8b030', 3));

// =====================================================================
// the window with autumn trees and the squirrel
// =====================================================================
{
  const x0 = 310, y0 = 120, w = 380, h = 430;
  scene(sh(rect(x0, y0, w, h), `url(#${ID}-sky)`));
  scene(sh(blob([[x0, y0 + 340], [x0 + 120, y0 + 310], [x0 + 260, y0 + 330], [x0 + w, y0 + 300], [x0 + w, y0 + h], [x0, y0 + h]], 0.6), '#a8b86a'), sh(blob([[x0, y0 + 380], [x0 + 200, y0 + 360], [x0 + w, y0 + 380], [x0 + w, y0 + h], [x0, y0 + h]], 0.6), '#8aa058'));
  scene(sh(ellipse(x0 + 90, y0 + 60, 40, 12) + ellipse(x0 + 120, y0 + 52, 30, 12) + ellipse(x0 + 290, y0 + 90, 34, 10), '#ffffff', { opacity: 0.85 }));
  // distant trees
  const far: [number, number, string[]][] = [[x0 + 40, y0 + 290, ['#e8a030', '#d88a2a', '#f2c040']], [x0 + 330, y0 + 280, ['#c8502a', '#d8702a', '#e89040']], [x0 + 190, y0 + 300, ['#b8862a', '#d8a83a', '#9a7a2a']]];
  for (const [x, y, c] of far) scene(sh(rect(x - 4, y, 8, 60), '#6e4a2a'), place(foliageClump(x, 110, 90, c, 22), { x, y }));
  // near tree with a branch for the squirrel
  scene(sh(M(x0 + 70, y0 + h) + L(x0 + 80, y0 + 200) + Q(x0 + 84, y0 + 120, x0 + 60, y0) + L(x0 + 96, y0) + Q(x0 + 110, y0 + 150, x0 + 110, y0 + 290) + Q(x0 + 200, y0 + 270, x0 + w, y0 + 280) + L(x0 + w, y0 + 296) + Q(x0 + 220, y0 + 292, x0 + 112, y0 + 330) + L(x0 + 116, y0 + h) + 'Z', '#5a3a24'));
  scene(place(foliageClump(17, 260, 200, ['#d0602a', '#e8902c', '#c8402a', '#f0b040'], 34), { x: x0 + 110, y: y0 + 90 }), place(foliageClump(23, 200, 120, ['#e8a030', '#d0702a', '#f2c850'], 22), { x: x0 + 320, y: y0 + 210 }));
  const g = rng(33);
  for (let i = 0; i < 16; i++) scene(sh(mapleLeafPath(g.range(10, 15), x0 + g.range(20, w - 20), y0 + g.range(200, h - 20), g.range(0, 360)), g.pick(LEAVES)));
  target('squirrel', 'Squirrel', place(squirrel(74, '#a85a2a'), { x: x0 + 250, y: y0 + 286 }));
  // frame and mullions
  scene(stroke(rect(x0, y0, w, h) + line([[x0 + w / 2, y0], [x0 + w / 2, y0 + h]]) + line([[x0, y0 + h / 2], [x0 + w, y0 + h / 2]]), '#fbf6e8', 10), stroke(rect(x0 - 6, y0 - 6, w + 12, h + 12), '#d9ccb0', 2));
  scene(ol(rect(x0 - 24, y0 + h, w + 48, 18, 2), '#f2e8d2', 1), sh(rect(x0 - 18, y0 + h + 18, w + 36, 8), '#c9b894'));
  scene(place(pumpkin(56, 42, '#f0a040', 0), { x: x0 + 60, y: y0 + h }), place(gourd(34, '#f2d060', '#7f9a4a'), { x: x0 + 110, y: y0 + h }), place(pumpkin(48, 36, '#e8d8b8', 0, '#5a6a3a'), { x: x0 + 320, y: y0 + h }));
  // curtains, rod and valance
  const drape = (x: number, dir: number, col: string): Shape[] => {
    const d = M(x, 90) + L(x + dir * 110, 90) + Q(x + dir * 70, 300, x + dir * 120, 560) + Q(x + dir * 150, 620, x + dir * 110, 640) + L(x, 640) + 'Z';
    let fold = '';
    for (let i = 1; i < 4; i++) fold += curve([[x + dir * i * 26, 96], [x + dir * (i * 20 + 6), 330], [x + dir * (i * 26 + 4), 636]]);
    return [ol(d, col, 1.2, -0.25), stroke(fold, shade(col, -0.18), 2), ol(rect(Math.min(x + dir * 60, x + dir * 100) - 6, 380, 46, 16, 6), shade(col, -0.25), 1)];
  };
  scene(drape(x0 - 10, -1, '#c9802a'), drape(x0 + w + 10, 1, '#c9802a'));
  scene(sh(rect(170, 82, 660, 8, 3), '#6e4a2a'), sh(circle(170, 86, 9) + circle(830, 86, 9), '#6e4a2a'));
  let val = M(180, 90);
  for (let x = 180; x < 820; x += 64) val += L(x, 130) + Q(x + 32, 160, x + 64, 130);
  val += L(820, 90) + 'Z';
  scene(sh(val, '#8a3a24'), stroke(M(180, 124) + L(820, 124), '#e8b030', 2));
}
// leaf garland along the valance
scene(garland(170, 92, 830, 92, 26, 4, ['#c8502a', '#e8902c', '#a84a2a']));
scene(leafScatter(180, 92, 640, 40, 24, 12, LEAVES, 22));

// =====================================================================
// china hutch (left)
// =====================================================================
scene(ol(rect(8, 150, 236, 630, 3), '#7a4a2a', 1.2, -0.3), sh(rect(24, 168, 204, 360), '#e8dcc0'), sh(rect(8, 130, 236, 26, 3), '#8a5a34'), sh(rect(0, 120, 252, 14, 3), '#6e4a2a'));
for (const y of [288, 408, 528]) scene(sh(rect(24, y, 204, 12), '#8a5a34'), sh(rect(24, y + 12, 204, 4), '#3b2a1c', { opacity: 0.2 }));
{
  const ac = ['#c8502a', '#6f8fd6', '#d8a030', '#7f9f6a'];
  [60, 126, 192].forEach((x, i) => scene(place(plate(30, '#fbf6e8', ac[i], i), { x, y: 254 })));
  scene(stroke(line([[24, 274], [228, 274]]), '#6e4a2a', 3));
  scene(place(jug(70, '#f7efdc', '#c8502a'), { x: 66, y: 408 }), place(jug(56, '#d8a030', '#fbf6e8'), { x: 136, y: 408 }), place(plate(26, '#fbf6e8', '#6f8fd6', 3), { x: 196, y: 376 }));
  for (let i = 0; i < 4; i++) scene(ol(rect(40 + i * 46, 488, 34, 40, 4), ['#c8502a', '#6f8fd6', '#d8a030', '#7f9f6a'][i], 1), sh(ellipse(57 + i * 46, 488, 17, 4), '#3b2a1c', { opacity: 0.3 }));
  scene(stroke(rect(24, 168, 102, 360) + rect(126, 168, 102, 360), '#7a4a2a', 6), sh(rect(24, 168, 204, 360), '#ffffff', { opacity: 0.08 }));
  scene(ol(rect(24, 548, 98, 214, 3) + rect(130, 548, 98, 214, 3), '#8a5a34', 1, -0.3), sh(circle(112, 655, 5) + circle(140, 655, 5), H.brass));
  scene(place(pumpkin(70, 52, H.pumpkin, 0), { x: 70, y: 120 }), place(gourd(40, '#f2d060', '#7f9a4a'), { x: 130, y: 120 }), place(pumpkin(50, 38, '#e8d8b8', 0, '#5a6a3a'), { x: 186, y: 120 }));
}
// framed pictures and a wall sconce
scene(place(framedPicture(150, 112, '#8a5a34', 3, '#f0dcb0', ['#d8a040', '#a8642a']), { x: 880, y: 230 }), place(framedPicture(80, 100, '#c9a24a', 5, '#d8e6e4', ['#a8b86a', '#7f9a5c']), { x: 1060, y: 236 }));
scene(sh(circle(820, 300, 50), '#ffe8a0', { opacity: 0.16 }), ol(rect(816, 320, 8, 30, 2), H.brass, 1, -0.3), ol(M(796, 320) + L(844, 320) + L(834, 290) + L(806, 290) + 'Z', '#f6eedc', 1, -0.2));

// =====================================================================
// sideboard (right)
// =====================================================================
scene(ol(rect(756, 604, 432, 22, 3), '#8a5a34', 1, -0.3), sh(rect(756, 604, 432, 5, 2), '#b98552'));
scene(ol(rect(770, 626, 404, 200, 3), '#7a4a2a', 1, -0.3), ol(rect(786, 640, 120, 170, 3) + rect(918, 640, 120, 170, 3) + rect(1050, 640, 110, 170, 3), '#8a5a34', 1, -0.3), sh(circle(894, 726, 5) + circle(930, 726, 5) + circle(1062, 726, 5), H.brass));
scene(sh(rect(780, 826, 12, 40) + rect(1152, 826, 12, 40), '#5a3a22'));
// table runner on the sideboard
scene(sh(rect(800, 598, 360, 8), '#c8502a'), stroke(line([[800, 602], [1160, 602]]), '#e8b030', 1.4));
target('sunflowers', 'Vase of sunflowers', place(sunflowerVase(170, 7, '#6f8fd6'), { x: 808, y: 604 }));
// cake stand with apple pie
scene(ol(M(870, 604) + L(940, 604) + L(918, 590) + L(912, 556) + L(898, 556) + L(892, 590) + 'Z', '#f6f0e2', 1, -0.25), ol(ellipse(905, 552, 64, 12), '#f6f0e2', 1, -0.25));
target('apple-pie', 'Apple pie', place(pie(54, 1), { x: 905, y: 530 }));
target('cider-pitcher', 'Pitcher of cider', place(ciderPitcher(104), { x: 1010, y: 604 }));
scene(place(pie(50, 2), { x: 1110, y: 586 }), place(wineGlass(60, '#d88a2a'), { x: 1060, y: 604 }), place(wineGlass(56, '#d88a2a'), { x: 1170, y: 606 }));

// =====================================================================
// chandelier
// =====================================================================
{
  scene(stroke(line([[600, 0], [600, 120]]), '#6e5a2a', 3));
  scene(stroke(M(480, 150) + Q(480, 180, 540, 176) + L(660, 176) + Q(720, 180, 720, 150) + M(540, 176) + Q(560, 150, 600, 140) + Q(640, 150, 660, 176), H.brassDk, 5), ol(ellipse(600, 140, 16, 26), H.brass, 1, -0.3));
  for (const x of [480, 540, 660, 720]) scene(place(candlestick(64, H.brass), { x, y: x === 480 || x === 720 ? 156 : 180 }));
}

// =====================================================================
// chairs and the table
// =====================================================================
scene(place(chairBack(170, 210, '#6e4a2a'), { x: 200, y: 900 }), place(chairBack(170, 210, '#6e4a2a'), { x: 1000, y: 900 }), place(chairBack(150, 190, '#6e4a2a'), { x: 600, y: 900 }));
const back = 900, front = 1420;
scene(sh(poly([[90, back], [1110, back], [1240, front], [-40, front]]), `url(#${ID}-cloth)`));
{
  // plaid runner down the middle
  const rl = (t: number, y: number) => { const f = (y - back) / (front - back); return 470 + t * 260 - (1 - f) * 0 + (f * (t - 0.5) * 160); };
  scene(sh(poly([[rl(0, back), back], [rl(1, back), back], [rl(1, front), front], [rl(0, front), front]]), '#c8602a'));
  let lines = '';
  for (const t of [0.15, 0.3, 0.7, 0.85]) lines += line([[rl(t, back), back], [rl(t, front), front]]);
  for (let y = back + 30; y < front; y += 44) lines += line([[rl(0, y), y], [rl(1, y), y]]);
  scene(stroke(lines, '#8a3a1e', 4, { opacity: 0.6 }), stroke(lines, '#f2c050', 1.2, { opacity: 0.8 }));
}
// cloth hanging over the front edge
scene(sh(M(-40, front) + L(1240, front) + L(1240, 1500) + L(-40, 1500) + 'Z', '#efe4cc'), stroke(line([[-40, front + 2], [1240, front + 2]]), '#d8ccb0', 4));
{
  let fold = '';
  for (let x = 40; x < W; x += 110) fold += curve([[x, front + 10], [x + 6, 1460], [x - 4, 1500]]);
  scene(stroke(fold, '#d8ccb0', 2), sh(rect(-40, front, 1280, 10), '#3b2a1c', { opacity: 0.08 }));
}
// scattered leaves on the cloth
scene(leafScatter(80, 930, 1040, 470, 36, 51, LEAVES, 22));

// --- back row
function setting(x: number, y: number, rx: number, nap: string): Shape[] {
  const ry = rx * 0.36;
  return [
    ...place(platePersp(rx, ry, '#fbf6ea', '#c9a24a'), { x, y }), ...place(platePersp(rx * 0.7, ry * 0.7, '#f6eedc', '#c8602a'), { x, y: y - 2 }),
    ...place(napkin(rx * 0.7, nap), { x, y: y - 6 }),
    stroke(line([[x - rx * 1.22, y - ry * 0.6], [x - rx * 1.26, y + ry * 0.8]]) + line([[x - rx * 1.38, y - ry * 0.6], [x - rx * 1.42, y + ry * 0.8]]), '#b9c0c4', 3),
    stroke(line([[x + rx * 1.24, y - ry * 0.6], [x + rx * 1.28, y + ry * 0.8]]), '#b9c0c4', 3),
  ];
}
scene(setting(330, 950, 64, '#7f9f6a'), place(wineGlass(70, '#9a2030'), { x: 420, y: 930 }));
scene(setting(870, 950, 64, '#c8602a'), place(wineGlass(70, '#d88a2a'), { x: 960, y: 930 }));
target('place-card', 'Place card', place(placeCard(70, '#c8402a'), { x: 862, y: 1000 }));
scene(place(pillarCandle(26, 60, '#f2e6cc'), { x: 720, y: 1000 }), place(pillarCandle(22, 44, '#e8c890'), { x: 752, y: 1010 }));
target('candlestick', 'Brass candlestick', place(candlestick(170), { x: 420, y: 1030 }));
target('cornucopia', 'Cornucopia', place(cornucopia(250, 3), { x: 600, y: 1010 }));
// --- middle row
target('bread-basket', 'Basket of rolls', place(breadBasket(190, 9), { x: 200, y: 1130 }));
target('turkey', 'Roast turkey', place(roastTurkey(360), { x: 600, y: 1160 }));
target('pumpkin-pie', 'Pumpkin pie', place(pie(84, 0), { x: 950, y: 1150 }));
target('pepper-mill', 'Pepper mill', place(pepperMill(120), { x: 1100, y: 1090 }));
scene(place(wineGlass(76, '#9a2030'), { x: 1060, y: 1060 }), place(wineGlass(76, '#d88a2a'), { x: 130, y: 1050 }));
// mini pumpkins, gourds, butter and salt dotted around the runner
scene(place(pumpkin(44, 32, '#f0a040', 0), { x: 486, y: 1084 }), place(gourd(30, '#f2d060', '#7f9a4a'), { x: 520, y: 1090, rot: -12 }), place(pumpkin(40, 30, '#e8d8b8', 0, '#5a6a3a'), { x: 770, y: 1090 }));
scene(place(pumpkin(38, 28, '#e8802a', 0), { x: 700, y: 1420 }), place(gourd(28, '#7fa04a', '#f2d060'), { x: 498, y: 1416, rot: 20 }));
scene(sh(ellipse(260, 1236, 52, 14), '#3b2a1c', { opacity: 0.15 }), ol(ellipse(260, 1230, 50, 14), '#f6f0e2', 1, -0.25), ol(rect(236, 1206, 48, 22, 3), '#f6d860', 1, -0.3), sh(rect(236, 1206, 48, 6, 3), '#fbe8a0'));
scene(sh(ellipse(1000, 1060, 14, 4), '#3b2a1c', { opacity: 0.2 }), ol(M(990, 1060) + L(1010, 1060) + L(1006, 1030) + Q(1000, 1018, 994, 1030) + 'Z', '#f6f0e2', 1, -0.3), sh(circle(997, 1028, 1.5) + circle(1003, 1030, 1.5), '#3b2a1c'));
// --- front row
scene(place(servingDish(170, 0, 4), { x: 150, y: 1310 }), place(servingDish(170, 2, 6, '#e8dcc8'), { x: 1040, y: 1320 }));
target('gravy-boat', 'Gravy boat', place(gravyBoat(150), { x: 400, y: 1270 }));
target('cranberry-sauce', 'Cranberry sauce', place(cranberrySauce(124), { x: 810, y: 1280 }));
target('corn', 'Corn on the cob', place(cornCob(130), { x: 1140, y: 1200, rot: 70 }));
scene(place(servingDish(140, 1, 8, '#f6f0e2'), { x: 600, y: 1340 }));
scene(setting(330, 1390, 88, '#c8602a'), setting(880, 1390, 88, '#7f9f6a'));
scene(place(wineGlass(90, '#d88a2a'), { x: 460, y: 1372 }), place(wineGlass(90, '#9a2030'), { x: 1010, y: 1372 }));
void leaf; void circle; void ellipse; void shadow; void M; void L; void Q;

const activity: FindActivity = {
  id: ID, version: 1, mode: 'find', title: 'Thanksgiving Table',
  blurb: 'A family table laid for the harvest feast, with a golden turkey, warm pies and fall trees glowing outside the window.',
  collectionId: 'holidays', categories: ["Holidays"], difficulty: 'Relaxed',
  season: { from: '11-01', to: '11-30', label: 'Thanksgiving' },
  width: W, height: HT, defs, items,
};
export default activity;
