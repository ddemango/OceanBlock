import { blob, circle, curve, ellipse, leaf, line, linearGradient, petal, place, poly, rect, rng, sh, shade, stroke } from '../../art/kit';
import type { Pt } from '../../art/geometry';
import type { Shape } from '../../art/types';
import type { FindActivity, FindItem } from '../types';
import { bee, blossom, blossomPath, bush, butterfly, daisy, ladybird, leafClump, pot, rose, snail, soil, spike, trailer } from '../garden/props';
import { C, acorn, binoculars, birdBath, birdTable, books, feather, flatBook, floorboards, framedPicture, glasses, magnifier, nest, pencil, songbird, squirrel, teacup, tubeFeeder, wallpaper, woodpecker } from './props-find';

const W = 1200, H = 1500;
const ID = 'blooms-find-2';
const items: FindItem[] = [];
const scene = (...s: Shape[]) => { items.push({ shapes: s }); };
const target = (id: string, name: string, s: Shape[]) => { items.push({ id, name, target: true, shapes: s }); };
const lump = (g: ReturnType<typeof rng>, cx: number, cy: number, rx: number, ry: number, n = 10): string => {
  const pts: Pt[] = [];
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; const k = g.range(0.82, 1.12); pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]); }
  return blob(pts);
};

const WX0 = 120, WX1 = 1080, WY0 = 90, WY1 = 870;
const PAINT = '#f4efe4';

// ================================================================= room wall
scene(...wallpaper(0, 0, W, H, '#efe2cf', '#c49a7a', 23, 64));

// ================================================================= garden view
scene(sh(rect(WX0, WY0, WX1 - WX0, WY1 - WY0), `url(#${ID}-sky)`));
{
  const g = rng(12);
  let cl = '';
  for (let i = 0; i < 6; i++) { const x = g.range(160, 1040), y = g.range(120, 260); cl += ellipse(x, y, g.range(40, 70), 12) + circle(x - 15, y - 10, 18) + circle(x + 12, y - 12, 22); }
  scene(sh(cl, '#ffffff', { opacity: 0.85 }));
  // distant tree line
  const far = ['#a8c49a', '#9cbb8e', '#b5cfa5', '#8fb083'];
  for (let x = WX0 - 40; x < WX1 + 40; x += 70) scene(sh(lump(g, x, 470 + g.range(-20, 20), g.range(50, 80), g.range(60, 90)), g.pick(far)));
  let fl = '';
  for (let i = 0; i < 50; i++) fl += leaf(g.range(WX0, WX1), g.range(400, 540), 12, 4, g.range(0, 360));
  scene(sh(fl, '#c9ddb8', { opacity: 0.7 }));
  // flying birds
  let fb = '';
  for (const [bx, by] of [[300, 180], [336, 160], [372, 192], [560, 140]]) fb += curve([[bx - 10, by], [bx - 5, by - 5], [bx, by], [bx + 5, by - 5], [bx + 10, by]]);
  scene(stroke(fb, '#6a7a88', 1.8));
  // lawn
  scene(sh(rect(WX0, 560, WX1 - WX0, WY1 - 560), `url(#${ID}-lawn)`));
  let tuft = '', tuft2 = '';
  for (let i = 0; i < 70; i++) { const x = g.range(WX0, WX1), y = g.range(640, WY1); const l = leaf(x, y, g.range(8, 14), 2, -90 + g.range(-30, 30)) + leaf(x + 3, y, g.range(8, 12), 2, -90 + g.range(-30, 30)); if (i % 2) tuft += l; else tuft2 += l; }
  scene(sh(tuft, '#7fae5c'), sh(tuft2, '#a6c97a'));
  // picket fence
  let pk = '', pkS = '';
  for (let x = WX0 - 10; x < WX1; x += 28) { pk += poly([[x, 660], [x, 586], [x + 10, 574], [x + 20, 586], [x + 20, 660]]); pkS += rect(x + 14, 586, 6, 74); }
  scene(sh(pk, '#f2ece0'), sh(pkS, '#d9cfbf'), sh(rect(WX0, 600, WX1 - WX0, 10) + rect(WX0, 636, WX1 - WX0, 10), '#e2d9c9'));
  // shrubs behind flower border
  for (const [x, w, c] of [[180, 170, '#6f9a5a'], [520, 140, '#7fa66a'], [700, 120, '#5f8a54'], [1040, 160, '#6f9a5a']] as [number, number, string][]) scene(...place(bush(x, w, w * 0.6, c, 12), { x, y: 720 }));
}
// garden shed in the distance
{
  scene(sh(rect(560, 490, 150, 110), '#b9a0b4'), sh(poly([[548, 494], [635, 440], [722, 494]]), '#8a6a7a'), sh(poly([[548, 494], [635, 440], [640, 446], [556, 498]]), '#a8889a'));
  let plank = '';
  for (let x = 568; x < 710; x += 14) plank += line([[x, 498], [x, 600]]);
  scene(stroke(plank, '#9a8296', 1.2), sh(rect(590, 520, 40, 34, 2), '#f2ece0'), sh(rect(594, 524, 15, 12) + rect(613, 524, 13, 12) + rect(594, 540, 15, 11) + rect(613, 540, 13, 11), '#9cc8dc'), sh(rect(650, 524, 40, 76, 2), '#8a6a7a'), sh(circle(682, 562, 3), '#e0a53a'));
  scene(...place(trailer(70, '#7fa66a', 9, 5), { x: 610, y: 556 }), sh(rect(586, 554, 48, 8, 2), '#a37548'));
}
// blossom tree on the left with a birdhouse
{
  const g = rng(91);
  scene(stroke(curve([[250, 600], [244, 480], [262, 380], [240, 300]]), '#7a5c44', 14), stroke(curve([[252, 420], [200, 360], [170, 330]]) + curve([[258, 380], [320, 330], [350, 300]]), '#7a5c44', 7));
  for (let i = 0; i < 9; i++) scene(sh(lump(g, g.range(150, 370), g.range(220, 340), g.range(36, 60), g.range(28, 44)), g.pick(['#f6d2dc', '#f2bccb', '#fbe3e6', '#e9a8bc'])));
  let bl = '', bl2 = '';
  for (let i = 0; i < 46; i++) { const b = blossomPath(g.range(140, 380), g.range(200, 360), g.range(4, 7), 5, 0.5); if (i % 2) bl += b; else bl2 += b; }
  scene(sh(bl, '#ffffff', { opacity: 0.85 }), sh(bl2, '#d8607a', { opacity: 0.6 }));
  // birdhouse on the trunk
  scene(sh(rect(222, 420, 50, 56, 3), '#6f9f8f'), sh(poly([[214, 424], [247, 396], [280, 424]]), '#c97a5a'), sh(circle(247, 444, 9), '#2f2a28'), sh(rect(244, 458, 6, 12), '#a37548'));
  scene(...place(songbird('bluetit', false), { x: 280, y: 410, s: 0.48 }));
}
// big tree on the right
{
  const g = rng(44);
  scene(sh(poly([[900, WY1], [910, 300], [930, 150], [970, 90], [1010, 90], [990, 200], [985, 320], [1000, WY1]]), '#7a5c44'));
  scene(sh(poly([[960, WY1], [968, 300], [980, 160], [1000, 90], [1010, 90], [990, 200], [985, 320], [1000, WY1]]), '#5f4634'));
  let bark = '';
  for (let i = 0; i < 18; i++) { const y = g.range(220, 840); const x = 915 + g.range(0, 60); bark += curve([[x, y], [x + g.range(-4, 4), y + 20], [x + g.range(-4, 4), y + 40]]); }
  scene(stroke(bark, '#4a3626', 1.8, { opacity: 0.7 }));
  // main branch to the left
  scene(stroke(curve([[940, 240], [820, 232], [700, 250], [560, 236], [450, 248]]), '#6a4e3a', 16), stroke(curve([[700, 250], [650, 200], [620, 160]]) + curve([[820, 232], [800, 180], [770, 140]]), '#6a4e3a', 8));
  scene(stroke(curve([[560, 236], [520, 270], [480, 300]]) + curve([[480, 246], [430, 220], [400, 200]]), '#6a4e3a', 6));
  // canopy
  const greens = ['#7fa66a', '#6f9a5a', '#8fb877', '#5f8a54', '#9cc184'];
  for (let i = 0; i < 14; i++) scene(sh(lump(g, g.range(640, 1080), g.range(60, 190), g.range(50, 90), g.range(36, 60)), g.pick(greens)));
  for (let i = 0; i < 5; i++) scene(sh(lump(g, g.range(420, 640), g.range(150, 210), g.range(30, 50), g.range(24, 36)), g.pick(greens)));
  let lv = '', lv2 = '';
  for (let i = 0; i < 70; i++) { const l = leaf(g.range(420, 1080), g.range(60, 240), g.range(12, 18), 5, g.range(0, 360)); if (i % 2) lv += l; else lv2 += l; }
  scene(sh(lv, '#b5d69a'), sh(lv2, '#4f7a46'));
  // blossom dots on the tree
  let bl = '';
  for (let i = 0; i < 30; i++) bl += blossomPath(g.range(450, 1070), g.range(70, 230), 5, 5, 0.5);
  scene(sh(bl, '#fbe3e6'));
}
target('nest', "Bird's nest", place(nest(7, '#a9d5d8'), { x: 826, y: 248, s: 0.72 }));
target('woodpecker', 'Woodpecker', place(woodpecker(), { x: 918, y: 470, s: 0.95, rot: -4 }));
// feeders hanging from the branch
scene(...place(tubeFeeder('#6f9f8f'), { x: 620, y: 244 }));
scene(...place(songbird('bluetit', false), { x: 604, y: 302, s: 0.55, sx: -0.55 }), ...place(songbird('goldfinch', false), { x: 640, y: 330, s: 0.55 }));
{
  // peanut wreath feeder
  scene(stroke(line([[760, 236], [760, 270]]), '#3f4347', 1.4), stroke(circle(760, 300, 28), '#3f4347', 5));
  const g = rng(8);
  let nuts = '';
  for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; nuts += ellipse(760 + Math.cos(a) * 28, 300 + Math.sin(a) * 28, 6, 4, g.range(0, 180)); }
  scene(sh(nuts, '#d9b07a'), ...place(songbird('chickadee', false), { x: 770, y: 352, s: 0.5 }));
}
// bird table with visitors
scene(...place(birdTable(130, 300, '#a37548'), { x: 360, y: 760 }));
scene(...place(songbird('robin'), { x: 330, y: 578, s: 0.62 }), ...place(songbird('sparrow'), { x: 398, y: 578, s: 0.58, sx: -0.58 }));
target('squirrel', 'Squirrel', place(squirrel('#a08470'), { x: 176, y: 600, s: 0.78 }));
target('snail', 'Snail', place(snail('#c98d54'), { x: 560, y: 600, s: 0.55 }));
// bird bath
scene(...place(birdBath('#d9cdb6'), { x: 780, y: 790 }));
scene(...place(songbird('sparrow'), { x: 750, y: 690, s: 0.52 }), ...place(songbird('cardinal'), { x: 820, y: 690, s: 0.56, sx: -0.56 }));
// birds on the fence and lawn
scene(...place(songbird('bluebird'), { x: 470, y: 600, s: 0.5 }), ...place(songbird('finch'), { x: 1040, y: 600, s: 0.5, sx: -0.5 }), ...place(songbird('robin'), { x: 610, y: 820, s: 0.5 }), ...place(songbird('sparrow'), { x: 250, y: 820, s: 0.48, sx: -0.48 }));
// flower border
{
  const g = rng(70);
  for (let i = 0; i < 9; i++) scene(...place(spike(g.range(110, 160), g.pick(['#cdbdea', '#e98a9a', '#f8c9d6', '#a591d6']), i, 1), { x: 140 + i * 110 + g.range(-20, 20), y: WY1 }));
  for (let i = 0; i < 7; i++) scene(...place(rose(g.range(12, 16), g.pick(['#f2a7b8', '#e98a9a', '#fbe3c8']), i), { x: 180 + i * 130 + g.range(-30, 30), y: 800 + g.range(-20, 30) }));
  for (let i = 0; i < 12; i++) scene(...place(daisy(g.range(9, 12)), { x: g.range(140, 1060), y: 820 + g.range(-10, 40) }));
  let lv = '';
  for (let i = 0; i < 60; i++) lv += leaf(g.range(WX0, WX1), g.range(800, WY1), g.range(16, 24), 6, -90 + g.range(-70, 70));
  scene(sh(lv, '#5f9150'));
  for (let i = 0; i < 10; i++) scene(...place(blossom(7, g.pick(['#f3c94f', '#fffaf0', '#cdbdea'])), { x: g.range(140, 1060), y: g.range(820, 860) }));
}
target('butterfly', 'Butterfly', place(butterfly('#e98a9a', '#fbe3e6'), { x: 270, y: 735, s: 0.62, rot: 15 }));
target('bee', 'Bee', place(bee(), { x: 1000, y: 766, s: 0.85 }));
// glass reflection
scene(sh(poly([[200, WY1], [380, WY0], [430, WY0], [250, WY1]]) + poly([[700, WY1], [880, WY0], [900, WY0], [720, WY1]]), '#ffffff', { opacity: 0.1 }));

// ================================================================= window frame and glazing
scene(
  sh(rect(WX0 - 30, WY0 - 30, WX1 - WX0 + 60, 32) + rect(WX0 - 30, WY0 - 30, 32, WY1 - WY0 + 30) + rect(WX1 - 2, WY0 - 30, 32, WY1 - WY0 + 30), PAINT),
  sh(rect(432, WY0, 16, WY1 - WY0) + rect(752, WY0, 16, WY1 - WY0) + rect(WX0, 470, WX1 - WX0, 14), PAINT),
  sh(rect(WX0 - 30, WY0 - 30, WX1 - WX0 + 60, 6) + rect(440, WY0, 4, WY1 - WY0) + rect(760, WY0, 4, WY1 - WY0), '#ffffff'),
  sh(rect(WX0, 482, WX1 - WX0, 3) + rect(446, WY0, 2, WY1 - WY0) + rect(766, WY0, 2, WY1 - WY0), '#d9d0c0'),
  sh(rect(424, 520, 8, 30, 3), '#c9a54a'),
);
// curtains and pole
{
  const g = rng(5);
  const curtainPanel = (x0: number, x1: number, tie: number, flip: boolean) => {
    const w = x1 - x0;
    const inner = flip ? x0 : x1, outer = flip ? x1 : x0;
    const d = blob([[x0, 50], [x1, 50], [inner + (flip ? w * 0.55 : -w * 0.55), tie], [inner + (flip ? w * 0.2 : -w * 0.2), 1010], [outer, 1010], [outer, tie]], 0.35);
    scene(sh(d, '#b9c9a8'));
    let fold = '', foldL = '', spr = '', spr2 = '';
    for (let i = 1; i < 6; i++) {
      const fx = x0 + (w * i) / 6;
      const mx = flip ? x1 - (x1 - fx) * 0.5 : x0 + (fx - x0) * 0.5;
      fold += curve([[fx, 56], [mx, tie], [fx + (flip ? -w * 0.15 : w * 0.15) * (i / 6), 1004]]);
      foldL += curve([[fx + 6, 56], [mx + 5, tie], [fx + 6 + (flip ? -w * 0.15 : w * 0.15) * (i / 6), 1004]]);
    }
    for (let y = 80; y < 1000; y += 46) for (let k = 0; k < 4; k++) {
      const t = (k + 0.5 + (y % 92 ? 0.5 : 0)) / 4.5;
      const xx = y < tie ? x0 + w * t * (1 - 0.45 * (y - 50) / (tie - 50)) + (flip ? w * 0.45 * (y - 50) / (tie - 50) : 0) : outer + (inner - outer) * t * 0.9;
      spr += blossomPath(xx, y, 5, 5, 0.5);
      spr2 += leaf(xx, y + 4, 9, 3, 60 + g.range(-10, 10));
    }
    scene(stroke(fold, '#94a985', 4, { opacity: 0.7 }), stroke(foldL, '#d4e0c6', 2.5, { opacity: 0.6 }), sh(spr2, '#7f9a6a', { opacity: 0.6 }), sh(spr, '#f2ece0', { opacity: 0.8 }));
    const tx = flip ? x1 - 18 : x0 + 18;
    scene(sh(ellipse(tx + (flip ? -30 : 30), tie, 44, 12), '#c97a5a'), sh(ellipse(tx + (flip ? -30 : 30), tie - 3, 40, 5), '#e09a74'), sh(blob([[tx - 6, tie + 6], [tx + 6, tie + 6], [tx + 4, tie + 40], [tx - 4, tie + 40]], 0.6), '#c97a5a'));
  };
  curtainPanel(10, 190, 600, false);
  curtainPanel(1010, 1190, 600, true);
  scene(sh(rect(0, 38, W, 12, 6), '#6e4a2e'), sh(circle(14, 44, 14) + circle(1186, 44, 14), '#8a5a3a'));
  let rings = '';
  for (let x = 24; x < 190; x += 26) rings += circle(x, 50, 7);
  for (let x = 1020; x < 1180; x += 26) rings += circle(x, 50, 7);
  scene(stroke(rings, '#6e4a2e', 2.5));
}

// ================================================================= window seat
scene(sh(rect(70, 870, 1060, 26, 2), PAINT), sh(rect(70, 890, 1060, 6), '#d9d0c0'));
// little nature collection and pots on the inner sill
scene(...place(pot(40, 34, '#9fb8a8'), { x: 520, y: 872 }), ...place(leafClump(6, 7, 30, 9, '#6f9a5a', 140), { x: 520, y: 840 }));
scene(...place(pot(40, 34, C.terraLight), { x: 620, y: 872 }), ...place(trailer(46, '#5f9150', 2, 4), { x: 620, y: 842 }));
scene(sh(ellipse(680, 866, 12, 6) + ellipse(700, 868, 9, 5) + ellipse(828, 866, 10, 5), '#b9b2a6'), sh(ellipse(690, 862, 6, 3), '#d9d2c6'));
target('acorn', 'Acorn', place(acorn(), { x: 742, y: 852, s: 0.85, rot: 20 }));
scene(sh(ellipse(790, 862, 18, 8), '#8a5a34'), stroke(line([[776, 858], [804, 858]]) + line([[780, 864], [800, 864]]), '#6e4a2e', 1.4));
// cushion
scene(sh(rect(60, 896, 1080, 108, 22), '#e9dcc4'), sh(rect(60, 980, 1080, 24, 12), '#d4c4a6'));
{
  let ticking = '';
  for (let x = 80; x < 1130; x += 22) ticking += rect(x, 904, 5, 92);
  scene(sh(ticking, '#b9a88a', { opacity: 0.45 }), stroke(curve([[70, 918], [600, 912], [1130, 918]]), '#c4b293', 2), sh(circle(300, 952, 4) + circle(600, 952, 4) + circle(900, 952, 4), '#b9a88a'));
}
// pillows
const pillow = (cx: number, cy: number, w: number, h: number, col: string, kind: 'flower' | 'stripe' | 'knit', rot: number) => {
  const out: Shape[] = [sh(blob([[-w / 2, -h / 2], [0, -h / 2 + 8], [w / 2, -h / 2], [w / 2 - 8, 0], [w / 2, h / 2], [0, h / 2 - 8], [-w / 2, h / 2], [-w / 2 + 8, 0]], 0.6), col)];
  if (kind === 'stripe') { let d = ''; for (let i = -2; i <= 2; i++) d += rect(-w / 2 + 10, i * h * 0.16 - 4, w - 20, 8); out.push(sh(d, shade(col, -0.2))); }
  if (kind === 'knit') { let d = ''; for (let x = -w / 2 + 14; x < w / 2 - 8; x += 12) for (let y = -h / 2 + 14; y < h / 2 - 8; y += 10) d += line([[x - 4, y], [x, y + 5], [x + 4, y]]); out.push(stroke(d, shade(col, -0.2), 1.3)); }
  if (kind === 'flower') { out.push(...place(rose(h * 0.18, '#e98a9a', 3), { x: -w * 0.12 })); out.push(sh(leaf(-w * 0.12, 0, h * 0.3, h * 0.08, 20) + leaf(-w * 0.12, 0, h * 0.3, h * 0.08, 160), C.leaf)); out.push(...place(blossom(h * 0.1, '#fffaf0'), { x: w * 0.2, y: -h * 0.15 })); }
  out.push(sh(ellipse(-w * 0.15, -h * 0.25, w * 0.25, h * 0.08), '#ffffff', { opacity: 0.25 }));
  scene(...place(out, { x: cx, y: cy, rot }));
};
pillow(200, 860, 190, 160, '#f2e6d2', 'flower', -8);
pillow(370, 880, 150, 130, '#9fb8c8', 'knit', 6);
pillow(1000, 860, 180, 150, '#e8b4a0', 'stripe', 8);
// throw blanket over the right end
{
  scene(sh(blob([[880, 940], [1150, 920], [1160, 1080], [1120, 1140], [1060, 1060], [980, 1010], [900, 1000]], 0.6), '#a5b8cf'));
  let k = '';
  for (let x = 900; x < 1150; x += 14) for (let y = 940; y < 1060; y += 12) if (y < 990 + (x - 880) * 0.5) k += line([[x - 4, y], [x, y + 5], [x + 4, y]]);
  scene(stroke(k, '#7f95b0', 1.2));
  let fr = '';
  for (let i = 0; i < 12; i++) fr += line([[1062 + i * 5, 1066 + i * 6], [1058 + i * 5, 1090 + i * 6]]);
  scene(stroke(fr, '#a5b8cf', 2.2));
}
// tray with teapot and cup
scene(sh(rect(540, 938, 240, 42, 6), '#b98a5c'), sh(rect(540, 938, 240, 8, 4), '#d4a978'), sh(rect(550, 946, 220, 26, 4), '#c49a6c'));
{
  // teapot
  const tp: Shape[] = [
    stroke(curve([[44, -40], [68, -42], [68, -14], [44, -12]]), '#7f9cb0', 7),
    sh(poly([[-40, -32], [-62, -50], [-72, -54], [-70, -46], [-50, -16]]), '#8aa6ba'),
    sh(blob([[-44, 0], [-50, -24], [-34, -50], [34, -50], [50, -24], [44, 0]], 0.8), '#9fb8c8'),
    sh(blob([[10, -48], [34, -50], [50, -24], [44, 0], [20, 0]], 0.8), '#86a2b6'),
    sh(ellipse(0, -52, 28, 7), '#86a2b6'), sh(blob([[-18, -54], [0, -66], [18, -54]], 0.8), '#9fb8c8'), sh(ellipse(0, -68, 7, 5), '#e98a9a'),
    sh(blossomPath(-14, -26, 10, 5, 0.5) + blossomPath(14, -28, 8, 5, 0.5), '#f4efe4'), sh(circle(-14, -24, 2.5) + circle(12, -28, 2), '#f3c94f'),
    stroke(line([[-46, -10], [46, -10]]) + line([[-40, -42], [40, -42]]), '#f4efe4', 2),
  ];
  scene(...place(tp, { x: 610, y: 968 }));
  scene(sh(ellipse(740, 960, 14, 6), '#f4ede0'), sh(rect(730, 948, 4, 12, 1) + rect(738, 946, 4, 14, 1) + rect(746, 950, 4, 10, 1), '#e0c89a'));
}
target('teacup', 'Teacup', place(teacup('#f4ede0', '#e98a9a', '#a8683a'), { x: 690, y: 970, s: 0.85 }));
// open notebook with glasses and pencil
scene(sh(poly([[790, 990], [870, 980], [950, 992], [950, 940], [870, 930], [790, 940]]), '#f8f2e6'), sh(poly([[870, 930], [870, 980], [866, 980], [866, 930]]), '#d9cbb4'));
{
  let lines = '';
  for (let i = 0; i < 4; i++) lines += line([[800, 950 + i * 9], [860, 942 + i * 9]]) + line([[880, 942 + i * 9], [940, 950 + i * 9]]);
  scene(stroke(lines, '#c9bba4', 1));
  scene(...place(songbird('bluetit', false), { x: 912, y: 980, s: 0.36 }));
}
target('glasses', 'Reading glasses', place(glasses('#3f4347'), { x: 830, y: 956, s: 0.72, rot: -6 }));
target('pencil', 'Pencil', place(pencil('#7fa6c9'), { x: 880, y: 1000, s: 0.72, rot: 4 }));
target('binoculars', 'Binoculars', place(binoculars('#4a5a4e'), { x: 470, y: 958, s: 0.78, rot: -10 }));
target('feather', 'Feather', place(feather('#a89480'), { x: 262, y: 972, s: 0.78, rot: 72 }));
target('magnifier', 'Magnifying glass', place(magnifier('#8a5a3a'), { x: 1060, y: 938, s: 0.8, rot: 30 }));
// stack of books on the seat
scene(...place(flatBook(110, 18, '#6f8f8a'), { x: 112, y: 994 }), ...place(flatBook(100, 16, '#c97a5a'), { x: 118, y: 976 }), ...place(flatBook(92, 14, '#e3c46a'), { x: 122, y: 960 }));

// ================================================================= seat front: bookshelf cubbies
scene(sh(rect(60, 1004, 1080, 250), '#e8dfcf'), sh(rect(60, 1004, 1080, 10), '#cfc3ae'));
{
  const cubbies = [[80, 1024, 320], [420, 1024, 360], [800, 1024, 320]];
  const bookCols = ['#6f8f8a', '#c97a5a', '#e3c46a', '#9fb8c8', '#a591d6', '#e98a9a', '#7a5c44', '#5f8a54', '#d9c9ae'];
  cubbies.forEach(([x, y, w], i) => {
    scene(sh(rect(x, y, w, 210, 3), '#5a4a3e'), sh(rect(x, y, w, 12), '#4a3c32'));
    if (i === 1) {
      // two wicker baskets
      for (const bx of [x + 20, x + w / 2 + 6]) {
        const bw = w / 2 - 26;
        scene(sh(rect(bx, y + 70, bw, 140, 6), '#c49a64'));
        let wv = '';
        for (let r = 0; r < 7; r++) for (let c = 0; c < 6; c++) wv += rect(bx + 6 + c * (bw / 6) + (r % 2 ? 8 : 0), y + 80 + r * 18, bw / 6 - 10, 8, 3);
        scene(sh(wv, '#a37a4a'), sh(rect(bx - 4, y + 64, bw + 8, 14, 6), '#d4a978'));
      }
      scene(...place(trailer(60, '#6f9a5a', 4, 5), { x: x + 90, y: y + 70 }));
    } else {
      scene(...place(books(i * 7 + 3, w - 30, 150, bookCols), { x: x + 14, y: y + 210 }));
    }
  });
  scene(stroke(line([[60, 1252], [1140, 1252]]), '#bfb39e', 3));
}

// ================================================================= floor
scene(...floorboards(0, 1254, W, 246, '#b08a62', 21, 30));
{
  // braided rug
  const cols = ['#c97a5a', '#e9dcc4', '#9fb8c8', '#d4a978', '#b9c9a8'];
  for (let i = 0; i < 7; i++) scene(sh(ellipse(620, 1410, 430 - i * 58, 80 - i * 11), cols[i % cols.length]));
  let br = '';
  for (let i = 0; i < 60; i++) { const a = (i / 60) * Math.PI * 2; br += line([[620 + Math.cos(a) * 420, 1410 + Math.sin(a) * 76], [620 + Math.cos(a + 0.05) * 404, 1410 + Math.sin(a + 0.05) * 72]]); }
  scene(stroke(br, '#a35f44', 1.6));
  let tex = '';
  for (let i = 1; i < 7; i++) for (let k = 0; k < 40; k++) { const a = (k / 40) * Math.PI * 2; const rx = 430 - i * 58 + 29, ry = 80 - i * 11 + 5.5; tex += line([[620 + Math.cos(a) * rx, 1410 + Math.sin(a) * ry], [620 + Math.cos(a + 0.06) * rx, 1410 + Math.sin(a + 0.06) * ry - 3]]); }
  scene(stroke(tex, '#ffffff', 1.4, { opacity: 0.35 }));
  // slippers
  const slip = (x: number, y: number, rot: number) => scene(...place([sh(ellipse(0, 0, 36, 15), '#7a8aa8'), sh(ellipse(-10, 0, 20, 10), '#f2ece0'), sh(blob([[6, -14], [36, -6], [36, 6], [6, 14], [14, 0]], 0.8), '#8a9ab8')], { x, y, rot }));
  slip(820, 1420, -12); slip(870, 1446, 4);
  // floor plant on the left (big leafy plant)
  scene(...place(leafClump(31, 14, 190, 46, '#5f8a54', 160), { x: 110, y: 1380 }));
  scene(...place(leafClump(32, 9, 150, 30, '#7fa66a', 140), { x: 110, y: 1386 }));
}
target('ladybird', 'Ladybird', place(ladybird(), { x: 60, y: 1268, s: 0.75, rot: -40 }));
scene(...place(pot(130, 120, '#e9dcc4'), { x: 110, y: 1486 }), ...place(soil(130), { x: 110, y: 1370 }), sh(rect(58, 1414, 104, 10) + rect(62, 1434, 96, 4), '#c97a5a'), sh(circle(80, 1450, 4) + circle(110, 1452, 4) + circle(140, 1450, 4), '#9fb8c8'));
{
  // stool with a book pile and a lamp on the right
  scene(sh(rect(1000, 1350, 150, 18, 6), '#a37548'), sh(rect(1010, 1368, 12, 120, 3) + rect(1128, 1368, 12, 120, 3), '#8a603c'), sh(rect(1016, 1430, 118, 8, 3), '#8a603c'));
  scene(...place(flatBook(110, 18, '#a591d6'), { x: 1020, y: 1350 }), ...place(flatBook(96, 16, '#6f8f8a'), { x: 1028, y: 1332 }));
  scene(...place(framedPicture(70, 90, '#c9a66b', 'bird', 2), { x: 1080, y: 1270 }));
}
// side wall pictures
scene(...place(framedPicture(60, 80, '#8a5a3a', 'flower', 2), { x: 1170 - 2, y: 1130 - 900 + 900 }));

// ================================================================= light
scene(sh(poly([[300, 90], [560, 90], [800, 1500], [460, 1500]]), '#fff6dc', { opacity: 0.07 }));
scene(sh(rect(0, 0, W, H), `url(#${ID}-vignette)`, { opacity: 0.2 }));

const activity: FindActivity = {
  id: ID, version: 1, mode: 'find',
  title: "The Birdwatcher's Window",
  blurb: 'A cushioned window seat, a pot of tea and a garden full of feeders, flowers and busy birds.',
  collectionId: 'blooms',
  categories: ['Birds', 'Cozy', 'Garden'],
  difficulty: 'Moderate',
  width: W, height: H,
  defs:
    linearGradient(`${ID}-sky`, [[0, '#a9d3ea'], [0.5, '#d4ebf2'], [0.75, '#eef4e2'], [1, '#eef4e2']]) +
    linearGradient(`${ID}-lawn`, [[0, '#a9cc86'], [1, '#86b36a']]) +
    `<radialGradient id="${ID}-vignette" cx="0.5" cy="0.45" r="0.75"><stop offset="0.7" stop-color="#2a1c18" stop-opacity="0"/><stop offset="1" stop-color="#2a1c18" stop-opacity="0.8"/></radialGradient>`,
  items,
};
export default activity;
void petal;
