import { rect, ellipse, circle, poly, line, curve, blob, sh, stroke, place, shade, rng, linearGradient, radialGradient, waveBand } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { FindActivity, FindItem } from '../types';
import {
  M, L, Q, ol, shadow, hl, cloud, planks, parasol, deckchair, surfboard, sandcastle, bucketSpade, beachBall, starfish, shell, crab, sunglasses,
  flipflops, lifebuoy, sunhat, sailboat, gull, flyingGull, kite, iceCream, beachHut, towel, bunting, festoon, grassTufts,
} from './props-find';

const ID = 'seasons-find-2';
const W = 1200, H = 1500;
const items: FindItem[] = [];
const scene = (...s: (Shape | Shape[])[]) => { items.push({ shapes: s.flat() }); };
const target = (id: string, name: string, shapes: Shape[]) => { items.push({ id, name, target: true, shapes }); };

const defs =
  linearGradient(`${ID}-sky`, [[0, '#7fc0e6'], [0.7, '#cfe8f2'], [1, '#f7efd8']]) +
  linearGradient(`${ID}-sea`, [[0, '#5aa8c8'], [0.6, '#6fc0cf'], [1, '#9fdad2']]) +
  linearGradient(`${ID}-sand`, [[0, '#f3dca8'], [1, '#e9c88a']]) +
  radialGradient(`${ID}-sun`, [[0, '#fff6c8'], [0.5, '#fbe7a0'], [1, '#fbe7a0']]);

// =====================================================================
// sky, kites, sun
// =====================================================================
scene(sh(rect(0, 0, W, 480), `url(#${ID}-sky)`));
scene(sh(circle(960, 130, 150), `url(#${ID}-sun)`, { opacity: 0.35 }), sh(circle(960, 130, 54), '#fff4c4'));
scene(sh(cloud(200, 120, 1.0) + cloud(640, 70, 0.8) + cloud(1100, 300, 0.6) + cloud(420, 330, 0.55), '#ffffff', { opacity: 0.9 }), sh(cloud(220, 128, 0.6) + cloud(660, 78, 0.5), '#eaf4f8'));
scene(flyingGull(16), place([flyingGull(16)], { x: 330, y: 200 }), place([flyingGull(12)], { x: 760, y: 240 }), place([flyingGull(10)], { x: 810, y: 210 }), place([flyingGull(14)], { x: 1060, y: 380 }));
// kites with strings running down to the beach
scene(stroke(curve([[160, 220], [240, 500], [300, 860]]), '#6b5a48', 1), place(kite(70, '#7fb0d8', '#f2c14e', '#e8607a'), { x: 160, y: 200, rot: -12 }));
scene(stroke(curve([[560, 150], [600, 450], [680, 820]]), '#6b5a48', 1), place(kite(60, '#9cc48a', '#fbf3df', '#7fb0d8'), { x: 560, y: 140, rot: 8 }));
scene(stroke(curve([[1040, 260], [980, 520], [900, 860]]), '#6b5a48', 1));
target('kite', 'Red kite', place(kite(82, '#d8452f', '#f7d06a', '#5a8fd0'), { x: 1040, y: 236, rot: 14 }));
scene(place([sh(ellipse(0, 0, 22, 10), '#f2c14e'), sh(poly([[18, 0], [40, -10], [40, 10]]), '#e8607a'), sh(circle(-10, -2, 2), '#3b2f2a')], { x: 380, y: 100, rot: -6 }), stroke(curve([[392, 108], [440, 400], [480, 840]]), '#6b5a48', 1));

// =====================================================================
// sea, headland, lighthouse, pier
// =====================================================================
scene(sh(rect(0, 470, W, 300), `url(#${ID}-sea)`));
{
  const g = rng(3);
  let wv = '';
  for (let i = 0; i < 70; i++) { const y = g.range(480, 760), x = g.range(0, W), l = 8 + (y - 470) * 0.08; wv += line([[x, y], [x + l, y]]); }
  scene(stroke(wv, '#ffffff', 1.6, { opacity: 0.55 }));
}
// headland with lighthouse (left)
scene(sh(blob([[-20, 480], [40, 420], [140, 400], [230, 430], [300, 476], [-20, 490]], 0.7), '#8faa70'), sh(blob([[-20, 488], [60, 450], [200, 452], [300, 478], [-20, 498]], 0.7), '#c9b48a'));
scene(grassTufts(0, 410, 260, 40, 14, 4, ['#7f9a5c', '#9ab86a'], 10));
{
  const x = 120, b = 432;
  scene(sh(poly([[x - 18, b], [x + 18, b], [x + 12, b - 110], [x - 12, b - 110]]), '#fbf6ea'), sh(poly([[x - 16, b - 22], [x + 16, b - 22], [x + 15, b - 44], [x - 15, b - 44]]) + poly([[x - 14, b - 66], [x + 14, b - 66], [x + 13, b - 88], [x - 13, b - 88]]), '#d8452f'));
  scene(sh(rect(x - 16, b - 126, 32, 18, 2), '#fff2b0'), sh(rect(x - 18, b - 110, 36, 4), '#3b3633'), sh(poly([[x - 18, b - 126], [x, b - 144], [x + 18, b - 126]]), '#d8452f'), stroke(line([[x - 8, b - 126], [x - 8, b - 108]]) + line([[x + 8, b - 126], [x + 8, b - 108]]), '#3b3633', 1.2));
  scene(sh(poly([[x + 16, b - 118], [x + 120, b - 140], [x + 120, b - 100]]), '#fff6c8', { opacity: 0.35 }));
}
// sailboats
scene(place(sailboat(60, '#5a7aa8', '#fbf6ea'), { x: 420, y: 520 }), place(sailboat(44, '#c8665a', '#f7e3b0'), { x: 560, y: 505 }), place(sailboat(36, '#3e8a7a', '#fbf6ea'), { x: 330, y: 500 }));
target('sailboat', 'Sailboat', place(sailboat(88, '#e8a03a', '#fbf6ea', '#e8607a'), { x: 250, y: 600 }));
// pier running out from the right
{
  let legs = '';
  for (let x = 760; x <= 1200; x += 36) legs += rect(x, 560, 7, 90 + (x - 760) * 0.12);
  scene(sh(legs, '#6b5440'), stroke(line([[760, 600], [1200, 620]]) + line([[760, 630], [1200, 660]]), '#5a4434', 2));
  scene(planks(740, 540, 460, 22, 1, '#b98a5a', 9), sh(rect(740, 560, 460, 5), '#3b2a1c', { opacity: 0.25 }));
  let rail = '';
  for (let x = 750; x <= 1200; x += 22) rail += line([[x, 540], [x, 518]]);
  scene(stroke(rail, '#fbf6ea', 2), stroke(line([[740, 518], [1200, 518]]), '#fbf6ea', 3));
  // pavilion at the end of the pier
  scene(sh(rect(760, 452, 120, 88), '#fbf6ea'), sh(rect(760, 452, 120, 10), '#e8e0cc'), ol(M(748, 456) + Q(820, 380, 892, 456) + 'Z', '#5aa0a8', 1.2), sh(circle(820, 404, 7), '#f2c14e'), stroke(line([[820, 397], [820, 372]]), '#5a4434', 2), sh(poly([[820, 372], [840, 378], [820, 384]]), '#d8452f'));
  scene(sh(rect(772, 474, 22, 40, 10) + rect(809, 474, 22, 40, 10) + rect(846, 474, 22, 40, 10), '#8fc0d0'), sh(rect(760, 520, 120, 20), '#e8e0cc'));
  for (const x of [930, 1040, 1150]) scene(stroke(line([[x, 518], [x, 470]]), '#3f4a44', 3), sh(circle(x, 466, 7), '#fbe7a1'), sh(rect(x - 6, 456, 12, 5), '#3f4a44'));
  scene(festoon(880, 476, 1200, 470, 22, 8));
}

// =====================================================================
// the beach
// =====================================================================
scene(sh(waveBand(0, W, 742, 6, 180, 1100, 0.8), `url(#${ID}-sand)`));
scene(stroke(curve([[0, 744], [200, 738], [400, 748], [600, 738], [800, 748], [1000, 738], [1200, 746]]), '#ffffff', 5, { opacity: 0.7 }));
{
  const g = rng(17);
  let dots = '', rip = '';
  for (let i = 0; i < 160; i++) dots += circle(g.range(0, W), g.range(760, 1090), g.range(1, 2.2));
  for (let i = 0; i < 26; i++) { const x = g.range(0, W), y = g.range(780, 1080); rip += curve([[x, y], [x + 14, y - 3], [x + 30, y]]); }
  scene(sh(dots, '#d4ae6c', { opacity: 0.7 }), stroke(rip, '#e0bd7c', 1.4));
}
// row of beach huts on the left
{
  const huts: [number, string, string][] = [[10, '#7fb0d8', '#fbf6ea'], [96, '#f2c14e', '#d8452f'], [182, '#e8607a', '#fbf6ea'], [268, '#9cc48a', '#5a7aa8'], [354, '#fbf6ea', '#7fb0d8']];
  huts.forEach(([x, c, t], i) => scene(place(beachHut(76, 104, c, t, 40 + i), { x, y: 830 })));
  scene(sh(rect(0, 826, 440, 8), '#c9a26a'));
}
// parasols, towels, deckchairs
scene(place(towel(120, 40, '#7fb0d8', '#fbf6ea'), { x: 560, y: 870 }), place(towel(110, 36, '#f2c14e', '#e8607a'), { x: 820, y: 900 }), place(towel(120, 40, '#9cc48a', '#fbf6ea'), { x: 1060, y: 830 }));
scene(shadow(600, 900, 70, 10, 0.15), place(parasol(170, '#e8607a', '#fbf6ea'), { x: 600, y: 900, rot: 4 }));
scene(shadow(860, 830, 64, 9, 0.15), place(parasol(150, '#7fb0d8', '#fbf6ea'), { x: 860, y: 830, rot: -5 }));
scene(shadow(1120, 930, 70, 10, 0.15), place(parasol(160, '#f2c14e', '#fbf6ea'), { x: 1120, y: 930, rot: 3 }));
scene(place(deckchair(110, '#e8607a', '#fbf6ea'), { x: 520, y: 960 }), place(deckchair(104, '#5a8fd0', '#fbf6ea'), { x: 700, y: 940 }), place(deckchair(110, '#9cc48a', '#fbf6ea'), { x: 960, y: 980 }));
// surfboards stuck in the sand
scene(place(surfboard(170, '#e8607a', '#fbf6ea'), { x: 470, y: 840, rot: -6 }), place(surfboard(150, '#7fb0d8', '#f2c14e'), { x: 418, y: 852, rot: 8 }));
// sandcastles and beach toys
scene(place(sandcastle(70, '#7fb0d8'), { x: 300, y: 1010 }));
target('sandcastle', 'Sandcastle', place(sandcastle(100, '#d8452f'), { x: 800, y: 1040 }));
target('bucket-spade', 'Bucket and spade', place(bucketSpade(62, '#5a8fd0'), { x: 890, y: 1040 }));
scene(place(bucketSpade(48, '#e8607a', '#9cc48a'), { x: 200, y: 990 }));
target('beach-ball', 'Beach ball', place(beachBall(30, ['#d8452f', '#f2c14e', '#5a8fd0']), { x: 640, y: 1020 }));
target('starfish', 'Starfish', place(starfish(52, '#f39a5a'), { x: 1100, y: 1040, rot: 12 }));
target('crab', 'Crab', place(crab(56), { x: 150, y: 1050 }));
target('shell', 'Scallop shell', place(shell(40, '#f7d9c0'), { x: 420, y: 1060, rot: 10 }));
scene(place(shell(22, '#f3e6c8'), { x: 1010, y: 1000, rot: -20 }), place(shell(18, '#f7d0c0'), { x: 560, y: 1070 }), place(starfish(26, '#e8b06a'), { x: 250, y: 1065, rot: -10 }));
scene(place(beachBall(18, ['#9cc48a', '#fbf6ea', '#e8607a']), { x: 1000, y: 905 }));

// =====================================================================
// the boardwalk (foreground)
// =====================================================================
scene(planks(0, 1110, W, 390, 9, '#c69a66', 21), sh(rect(0, 1110, W, 8), '#3b2a1c', { opacity: 0.25 }));
// railing between boardwalk and beach
{
  let posts = '';
  for (let x = 20; x < W; x += 110) posts += rect(x, 1030, 14, 96, 2);
  scene(sh(posts, '#f3ede0', { stroke: '#c9bea8', strokeWidth: 1 }), sh(rect(0, 1026, W, 12, 3) + rect(0, 1072, W, 8, 3), '#f3ede0', { stroke: '#c9bea8', strokeWidth: 1 }));
  scene(bunting(0, 1032, 600, 1032, 26, 12, ['#d8452f', '#fbf6ea', '#5a8fd0', '#f2c14e'], 20), bunting(600, 1032, 1200, 1032, 26, 12, ['#5a8fd0', '#f2c14e', '#d8452f', '#fbf6ea'], 20));
}
// gulls on the railing
scene(place(gull(54), { x: 260, y: 1028 }), place(gull(46), { x: 1000, y: 1028, sx: -1 }));
// life ring on a post
scene(sh(rect(660, 1040, 18, 120, 2), '#f3ede0'), sh(rect(664, 1040, 4, 120), '#ffffff', { opacity: 0.5 }));
target('lifebuoy', 'Life ring', place(lifebuoy(42), { x: 669, y: 1100 }));

// ice-cream cart
{
  const x = 300, y = 1330;
  scene(shadow(x, y + 4, 170, 16));
  scene(stroke(line([[x, y - 170], [x, y - 430]]), '#efe8dc', 6));
  scene(place(parasol(300, '#f4a6b8', '#fbf6ea'), { x, y: y - 140 }));
  scene(ol(rect(x - 150, y - 200, 300, 140, 14), '#fbf6ea', 1.4, -0.2), sh(rect(x - 150, y - 110, 300, 50), '#9fd6c8'));
  let sc = '';
  for (let i = 0; i < 10; i++) sc += M(x - 150 + i * 30, y - 110) + Q(x - 135 + i * 30, y - 92, x - 120 + i * 30, y - 110);
  scene(sh(sc, '#fbf6ea'));
  scene(ol(rect(x - 160, y - 214, 320, 18, 6), '#b8c0c4', 1), ol(rect(x - 130, y - 236, 120, 24, 8), '#d9dfe2', 1), ol(rect(x + 10, y - 236, 120, 24, 8), '#d9dfe2', 1));
  // painted cone motif on the side panel (no lettering)
  scene(place(iceCream(46, '#f4a6b8', '#fbe7a0'), { x: x - 40, y: y - 120 }), place(iceCream(40, '#bfe3c8', '#f4a6b8'), { x: x + 40, y: y - 124 }));
  // wheels and handle
  for (const wx of [x - 96, x + 96]) { let sp = ''; for (let k = 0; k < 10; k++) { const a = (k * Math.PI) / 5; sp += line([[wx, y - 46], [wx + Math.cos(a) * 40, y - 46 + Math.sin(a) * 40]]); } scene(stroke(sp, '#e8607a', 2), stroke(circle(wx, y - 46, 44), '#3b3633', 8), sh(circle(wx, y - 46, 7), '#e8607a')); }
  scene(stroke(line([[x - 150, y - 150], [x - 210, y - 170]]), '#b8c0c4', 6), sh(rect(x - 226, y - 180, 24, 14, 6), '#6b4a32'));
  // cones in a holder on the lid
  scene(sh(rect(x + 70, y - 248, 60, 14, 3), '#b8c0c4'));
  scene(place(iceCream(30, '#f7d06a', '#f4a6b8'), { x: x + 84, y: y - 232 }), place(iceCream(28, '#c89a6a', '#fbf6ea'), { x: x + 114, y: y - 232 }));
}
// table with the dropped ice cream and sunglasses
{
  const x = 640, y = 1330;
  scene(shadow(x, y + 4, 110, 12), stroke(line([[x - 80, y - 90], [x - 90, y]]) + line([[x + 80, y - 90], [x + 90, y]]) + line([[x - 40, y - 90], [x - 50, y + 6]]) + line([[x + 40, y - 90], [x + 50, y + 6]]), '#8a5a34', 7));
  scene(ol(ellipse(x, y - 94, 110, 24), '#fbf6ea', 1.2, -0.2), sh(ellipse(x, y - 94, 110, 24), '#ffffff', { opacity: 0 }));
  let check = '';
  for (let i = -5; i <= 5; i++) check += line([[x + i * 20 - 6, y - 116], [x + i * 20 + 6, y - 72]]);
  scene(stroke(check, '#7fb0d8', 4, { opacity: 0.5 }));
  scene(place([ol(rect(-14, -26, 28, 26, 6), '#fbf6ea', 1), sh(rect(-14, -18, 28, 6), '#5a8fd0')], { x: x + 60, y: y - 92 }), place([ol(ellipse(0, 0, 22, 7), '#f2c14e', 1)], { x: x - 70, y: y - 98 }));
  target('ice-cream', 'Ice-cream cone', place(iceCream(64), { x: x - 10, y: y - 84, rot: 72 }));
  target('sunglasses', 'Sunglasses', place(sunglasses(70), { x: x - 60, y: y - 106, rot: -8 }));
}
// surfboard rack (right)
{
  const x = 1000, y = 1330;
  scene(shadow(x, y, 170, 14), sh(rect(x - 160, y - 170, 14, 170) + rect(x + 146, y - 170, 14, 170), '#8a5a34'), sh(rect(x - 166, y - 112, 332, 12, 3), '#a8743e'));
  const boards: [number, number, string, string][] = [[x - 120, -8, '#5a8fd0', '#fbf6ea'], [x - 74, -4, '#e8607a', '#f7d06a'], [x + 30, 4, '#9cc48a', '#fbf6ea'], [x + 74, 7, '#fbf6ea', '#e8607a'], [x + 120, 10, '#f39a5a', '#fbf6ea']];
  for (const [bx, r, c, s] of boards.slice(0, 2)) scene(place(surfboard(250, c, s), { x: bx, y: y - 140, rot: r }));
  target('surfboard', 'Yellow surfboard', place(surfboard(250, '#f2c440', '#5a8fd0'), { x: x - 22, y: y - 140, rot: -1 }));
  for (const [bx, r, c, s] of boards.slice(2)) scene(place(surfboard(250, c, s), { x: bx, y: y - 140, rot: r }));
  scene(sh(rect(x - 166, y - 60, 332, 12, 3), '#a8743e'));
}
// bench with a sun hat and towel
{
  const x = 820, y = 1470;
  scene(shadow(x, y, 150, 12));
  scene(stroke(line([[x - 120, y - 40], [x - 124, y]]) + line([[x + 120, y - 40], [x + 124, y]]), '#3f4a44', 7));
  scene(planks(x - 150, y - 140, 300, 60, 3, '#8fb6c8', 31), planks(x - 160, y - 62, 320, 30, 2, '#8fb6c8', 32), stroke(line([[x - 140, y - 140], [x - 140, y - 46]]) + line([[x + 140, y - 140], [x + 140, y - 46]]), '#3f4a44', 6));
  scene(place(towel(120, 30, '#e8607a', '#fbf6ea'), { x: x + 70, y: y - 52 }));
}
target('sunhat', 'Sun hat', place(sunhat(100, '#5a8fd0'), { x: 740, y: 1404, rot: -6 }));
// flip-flops on the planks, a dog bowl and a crate of drinks
target('flip-flops', 'Flip-flops', place(flipflops(72, '#f39a5a', '#5a8fd0'), { x: 470, y: 1440, rot: -30 }));
scene(place([ol(rect(-60, -50, 120, 50, 4), '#b98552', 1), sh(rect(-60, -30, 120, 4), '#7a5232'), ...[-40, -14, 12, 38].map((dx, i) => ol(rect(dx - 8, -76, 16, 30, 5), ['#9fd6c8', '#f7d06a', '#f4a6b8', '#9fd6c8'][i], 1))], { x: 110, y: 1460 }));
scene(place(beachBall(22, ['#5a8fd0', '#fbf6ea', '#f2c14e']), { x: 1140, y: 1440 }), place(gull(40), { x: 590, y: 1470 }));
scene(place(bucketSpade(40, '#f2c14e', '#d8452f'), { x: 40, y: 1360 }));
// lamp post with hanging basket
{
  const x = 520;
  scene(sh(rect(x - 6, 1060, 12, 270), '#3f4a44'), sh(rect(x - 14, 1320, 28, 14, 3), '#3f4a44'), sh(poly([[x - 18, 1060], [x + 18, 1060], [x + 10, 1030], [x - 10, 1030]]), '#3f4a44'), sh(rect(x - 12, 1034, 24, 24), '#fbe7a1'), sh(poly([[x - 16, 1034], [x + 16, 1034], [x, 1018]]), '#3f4a44'));
}

const a: FindActivity = {
  id: 'seasons-find-2', version: 1, mode: 'find', title: 'Summer Boardwalk', blurb: 'Stroll a sunny seaside boardwalk of ice-cream carts, striped parasols, kites and sandcastles by the pier.',
  collectionId: 'seasons', categories: ["Seasons"], difficulty: 'Moderate',
  season: { from: '06-01', to: '08-31', label: 'summer' },
  width: W, height: H, defs, items,
};
export default a;
