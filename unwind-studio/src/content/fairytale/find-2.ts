import { blob, circle, curve, ellipse, leaf, line, linearGradient, petal, place, poly, rect, rng, sh, shade, stroke } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { FindActivity, FindItem } from '../types';
import {
  appleBasket, bluebird, bucket, butterfly, cottage, crownedFrog, fern, firefly, flowerSpray, foliage, glow, goldenKey, grassTuft, lantern, owl,
  rabbit, shadow, snail, spinningWheel, toadstool, trunk, twinkle, unicorn, wand, well, type Pt,
} from './props-find';

const WD = 1200, HT = 1500;
const ID = 'fairytale-find-2';
const items: FindItem[] = [];
const scene = (...s: Shape[]) => { items.push({ shapes: s }); };
const target = (id: string, name: string, s: Shape[]) => { items.push({ id, name, target: true, shapes: s }); };
const DEEP = ['#2c4a52', '#355a5a', '#3f6a5e', '#4a7a62'];
const LEAF = ['#3f6a4e', '#4f7f56', '#5f9060', '#6fa06a'];
const FLOWERS = ['#e8a0d0', '#b8a0f0', '#f6e6a0', '#9fd8e8'];

// ------------------------------------------------------------------ dusk sky, moon and stars
scene(sh(rect(0, 0, WD, 760), `url(#${ID}-sky)`));
{
  const g = rng(3);
  let st = '', tw = '';
  for (let i = 0; i < 70; i++) { const x = g.range(0, WD), y = g.range(10, 520); if (i % 9 === 0) tw += twinkle(x, y, g.range(4, 7)); else st += circle(x, y, g.range(0.8, 2)); }
  scene(sh(st, '#fff8dc', { opacity: 0.85 }), sh(tw, '#fff3c0'));
  scene(...glow(760, 190, 150, '#fff0c8', 0.35), sh(circle(760, 190, 54), '#fbf1cf'), sh(circle(742, 176, 9) + circle(780, 206, 12) + circle(770, 168, 5), '#efe0b0'));
}
// distant hills and a far tree line
scene(sh(blob([[-20, 560], [200, 470], [420, 520], [640, 450], [880, 500], [1220, 440], [1220, 760], [-20, 760]], 0.8), '#3a4878'));
{
  const g = rng(7);
  for (let i = 0; i < 18; i++) {
    const x = i * 70 + g.range(-10, 10), h = g.range(120, 220), y = 640;
    scene(sh(poly([[x - 34, y], [x, y - h], [x + 34, y]]) + poly([[x - 28, y - h * 0.45], [x, y - h * 0.95], [x + 28, y - h * 0.45]]), i % 2 ? '#2e3d62' : '#34456a'));
  }
}
scene(sh(rect(0, 620, WD, 140), '#2f4a5e'));
{
  const g = rng(9);
  for (let i = 0; i < 12; i++) scene(...place(foliage(100 + i, 160, 110, ['#2c4456', '#34505e', '#3a5a64'], 12), { x: i * 110 + g.range(-20, 20), y: 640 + g.range(-20, 20) }));
}

// ------------------------------------------------------------------ the forest floor
scene(sh(rect(0, 700, WD, 800), `url(#${ID}-ground)`));
{
  const g = rng(11);
  let a = '', b = '';
  for (let i = 0; i < 70; i++) { const y = g.range(720, 1490), x = g.range(0, WD), s = 0.4 + (y - 700) / 800; const d = ellipse(x, y, 46 * s, 9 * s); if (i % 2) a += d; else b += d; }
  scene(sh(a, '#5f8f60', { opacity: 0.35 }), sh(b, '#2a4a40', { opacity: 0.35 }));
}
// winding path from the cottage door
{
  const Lp: Pt[] = [[868, 760], [820, 820], [700, 900], [640, 980], [520, 1100], [480, 1220], [440, 1360], [380, 1510]];
  const Rp: Pt[] = [[900, 760], [880, 830], [790, 920], [750, 1000], [680, 1120], [660, 1240], [660, 1370], [720, 1510]];
  scene(sh(blob([...Lp, ...[...Rp].reverse()], 0.4), '#8a7d78'), sh(blob([...Lp.map(([x, y]) => [x + 10, y] as Pt), ...[...Rp].reverse().map(([x, y]) => [x - 14, y] as Pt)], 0.4), '#a0928a'));
  const g = rng(13);
  let st = '', st2 = '';
  for (let i = 0; i < 26; i++) {
    const t = i / 26, k = Math.min(Lp.length - 2, Math.floor(t * (Lp.length - 1))), f = t * (Lp.length - 1) - k;
    const lx = Lp[k][0] + (Lp[k + 1][0] - Lp[k][0]) * f, rx = Rp[k][0] + (Rp[k + 1][0] - Rp[k][0]) * f, y = Lp[k][1] + (Lp[k + 1][1] - Lp[k][1]) * f;
    const x = lx + (rx - lx) * g.range(0.2, 0.8), s = 0.4 + t;
    const d = ellipse(x, y, 16 * s, 7 * s, g.range(-10, 10));
    if (i % 2) st += d; else st2 += d;
  }
  scene(sh(st, '#b8aca4'), sh(st2, '#c6bab0'));
}

// ------------------------------------------------------------------ midground trees, cottage and unicorn
for (const [x, base, h, w, seed] of [[540, 760, 420, 40, 21], [180, 800, 460, 46, 22], [660, 740, 380, 30, 23], [990, 760, 400, 36, 24]] as [number, number, number, number, number][]) scene(...place(trunk(h, w, '#4a3a4a', seed), { x, y: base }));
for (const [x, y, w, h, s] of [[540, 360, 300, 200, 31], [180, 360, 320, 220, 32], [670, 380, 220, 160, 33], [990, 360, 280, 200, 34]] as number[][]) scene(...place(foliage(s, w, h, DEEP, 26), { x, y }));
scene(...place(cottage(), { x: 880, y: 770, s: 0.82 }));
scene(...place(foliage(41, 120, 70, LEAF, 12), { x: 760, y: 770, s: 0.8 }), ...place(foliage(42, 100, 60, LEAF, 10), { x: 1000, y: 776, s: 0.8 }));
target('wheel', 'Spinning wheel', place(spinningWheel(), { x: 1040, y: 860, s: 0.62 }));
target('unicorn', 'Unicorn', place(unicorn(), { x: 370, y: 790, s: 0.95 }));
// slender birch in front of the unicorn
scene(sh(rect(296, 420, 18, 380, 6), '#e8e4ee'), stroke(line([[298, 500], [312, 504]]) + line([[298, 600], [310, 596]]) + line([[300, 700], [312, 706]]) + line([[298, 760], [306, 758]]), '#5a5268', 2));
scene(...place(foliage(51, 90, 60, LEAF, 10), { x: 250, y: 800, s: 0.8 }), ...place(grassTuft(1.2, '#5f8f60', 52), { x: 430, y: 794 }), ...place(grassTuft(1.1, '#4f7f56', 53), { x: 330, y: 798 }));
target('lantern', 'Hanging lantern', place(lantern(), { x: 610, y: 600, s: 0.9 }));
scene(stroke(curve([[540, 520], [600, 520], [650, 540], [700, 560]]), '#4a3a4a', 7), stroke(line([[617, 528], [617, 528]]), '#2a2430', 1));

// ------------------------------------------------------------------ the stone well
scene(...place(well(), { x: 230, y: 1020, s: 0.82 }));
target('bluebird', 'Bluebird', place(bluebird(), { x: 248, y: 842, s: 0.9 }));
target('bucket', 'Wooden bucket', place(bucket(), { x: 342, y: 1040, s: 1 }));
scene(...place(flowerSpray(61, 10, 60, FLOWERS), { x: 150, y: 1030 }), ...place(grassTuft(1.2, '#4f7f56', 62), { x: 300, y: 1030 }));

// ------------------------------------------------------------------ the fairy ring
{
  const cx = 610, cy = 1080, rx = 130, ry = 40;
  scene(...glow(cx, cy - 10, 170, '#c8f0a8', 0.3), sh(ellipse(cx, cy, rx + 20, ry + 10), '#a8e09a', { opacity: 0.25 }));
  target('wand', 'Magic wand', place(wand(), { x: cx + 10, y: cy - 6, s: 0.85, rot: 10 }));
  const g = rng(71);
  for (let k = 0; k < 13; k++) {
    const a = (k / 13) * Math.PI * 2 + 0.3, x = cx + Math.cos(a) * rx, y = cy + Math.sin(a) * ry;
    if (Math.sin(a) > 0.2) continue;
    scene(...place(toadstool(g.range(0.7, 1), k % 3 ? '#d8433a' : '#e8803a'), { x, y }));
  }
  scene(...place(flowerSpray(72, 8, 70, FLOWERS), { x: cx - 60, y: cy + 4 }));
  for (let k = 0; k < 13; k++) {
    const a = (k / 13) * Math.PI * 2 + 0.3, x = cx + Math.cos(a) * rx, y = cy + Math.sin(a) * ry;
    if (Math.sin(a) <= 0.2) continue;
    scene(...place(toadstool(g.range(0.8, 1.1), k % 3 ? '#d8433a' : '#e8803a'), { x, y }));
  }
}
target('butterfly', 'Butterfly', place(butterfly('#b07ad8'), { x: 770, y: 960, s: 0.85, rot: 15 }));
scene(...place(flowerSpray(81, 12, 90, FLOWERS), { x: 780, y: 1000 }), ...place(flowerSpray(82, 10, 80, FLOWERS), { x: 450, y: 960 }));

// ------------------------------------------------------------------ big framing trees with owls
scene(...place(trunk(1300, 150, '#5a4250', 91), { x: 70, y: 1200 }));
scene(sh(ellipse(80, 560, 32, 46), '#2a1c24'), stroke(ellipse(80, 560, 34, 48), '#7a5a6a', 6));
target('owl', 'Brown owl', place(owl(), { x: 80, y: 600, s: 0.85 }));
scene(sh(blob([[46, 600], [80, 592], [114, 600], [110, 612], [50, 612]], 0.8), '#5a4250'));
scene(...place(trunk(1300, 130, '#5a4250', 92), { x: 1145, y: 1160 }));
scene(stroke(curve([[1110, 700], [1040, 690], [980, 700]]), '#5a4250', 14), sh(leaf(1000, 694, 22, 7, -150) + leaf(1030, 692, 20, 6, -40), '#5f9060'));
target('whiteowl', 'Little white owl', place(owl('#e6e8ee', '#ffffff', '#f2b84a'), { x: 1040, y: 690, s: 0.68 }));
{
  // canopies across the top
  const Lc: number[][] = [[60, 120, 380, 280, 101], [240, 30, 380, 200, 102], [-30, 330, 260, 240, 103], [380, 90, 220, 150, 104]];
  const Rc: number[][] = [[1110, 110, 380, 280, 105], [930, 20, 340, 180, 106], [1200, 340, 240, 240, 107], [1000, 240, 200, 130, 108]];
  [...Lc, ...Rc].forEach(([x, y, w, h, s]) => scene(...place(foliage(s, w, h, LEAF, 40), { x, y })));
  const g = rng(109);
  let lt = '';
  for (let i = 0; i < 50; i++) { const x = g.pick([g.range(0, 460), g.range(860, 1200)]), y = g.range(20, 460); lt += leaf(x, y, g.range(12, 20), 5, g.range(0, 360)); }
  scene(sh(lt, '#8fc07a', { opacity: 0.8 }));
  // hanging vines with glowing blossoms
  let vine = '', bl = '';
  for (const [x, len] of [[150, 260], [330, 180], [420, 140], [880, 160], [960, 230], [1060, 200]]) {
    vine += curve([[x, 120], [x + 8, 120 + len / 2], [x - 4, 120 + len]]);
    for (let k = 1; k < 5; k++) bl += circle(x + (k % 2 ? 6 : -2), 120 + (len * k) / 5, 3.2);
  }
  scene(stroke(vine, '#3f6a4e', 2), sh(bl, '#f3c4e8'));
}

// ------------------------------------------------------------------ apples, the stump and the path edge
target('apples', 'Basket of apples', place(appleBasket(), { x: 780, y: 1210, s: 0.85 }));
scene(...place([
  shadow(0, 4, 50, 8), sh(blob([[-46, 0], [-40, -50], [40, -50], [46, 0], [0, 6]], 0.5), '#6a4a3a'),
  sh(ellipse(0, -50, 41, 12), '#c8a07a'), stroke(ellipse(0, -50, 30, 8) + ellipse(0, -50, 18, 5) + ellipse(0, -50, 6, 2), '#9a7050', 1.2),
  sh(ellipse(-20, -10, 10, 5) + ellipse(24, -26, 8, 4), '#5f8f60', { opacity: 0.8 }),
], { x: 960, y: 1290 }));
target('snail', 'Snail', place(snail(), { x: 972, y: 1336, s: 0.75 }));
scene(...place(toadstool(1.2, '#c87a3a'), { x: 920, y: 1294 }), ...place(toadstool(0.8, '#c87a3a'), { x: 1000, y: 1292 }));
target('rabbit', 'Rabbit', place(rabbit(), { x: 440, y: 1200, s: 1 }));
scene(...place(fern(110, -120, '#4f7f56', 121), { x: 400, y: 1206 }), ...place(fern(100, -60, '#5f9060', 122), { x: 480, y: 1210 }));

// ------------------------------------------------------------------ the pond with the frog
{
  scene(sh(ellipse(220, 1360, 190, 60), '#2a3a48'), sh(ellipse(220, 1356, 176, 52), `url(#${ID}-pond)`));
  scene(stroke(curve([[100, 1350], [120, 1346], [140, 1350]]) + curve([[280, 1380], [300, 1376], [320, 1380]]) + curve([[200, 1330], [230, 1326], [250, 1330]]), '#c8dcf0', 1.4, { opacity: 0.6 }));
  scene(sh(circle(760 - 600, 1350, 3), '#fff8dc', { opacity: 0.6 }));
  scene(sh(ellipse(130, 1370, 26, 9) + ellipse(320, 1350, 22, 7), '#4f8f56'), sh(circle(320, 1346, 5), '#f6c4e0'));
  scene(sh(ellipse(220, 1372, 40, 12), '#5f9a5a'), sh(poly([[220, 1372], [250, 1362], [256, 1370]]), '#2a3a48'));
  let reeds = '';
  for (let i = 0; i < 12; i++) reeds += line([[32 + i * 6, 1350], [28 + i * 7, 1270 + (i % 3) * 14]]);
  scene(stroke(reeds, '#4f7f56', 2.4), sh(rect(52, 1268, 6, 22, 3) + rect(74, 1276, 6, 20, 3), '#6a4a3a'));
}
target('frog', 'Frog with a tiny crown', place(crownedFrog(), { x: 220, y: 1372, s: 1 }));

// ------------------------------------------------------------------ foreground ferns, flowers and mushrooms
{
  const g = rng(131);
  for (let i = 0; i < 70; i++) {
    const y = g.range(760, 1490), x = g.range(0, WD);
    if (Math.abs(x - 610) < 170 && Math.abs(y - 1080) < 60) continue;
    if (Math.abs(x - 220) < 200 && Math.abs(y - 1360) < 70) continue;
    const s = 0.6 + (y - 760) / 700;
    scene(...place(grassTuft(s, g.pick(['#4f7f56', '#5f9060', '#3f6a4e']), 300 + i), { x, y }));
  }
}
scene(...place(fern(200, -120, '#4f7f56', 141), { x: 30, y: 1500 }), ...place(fern(180, -70, '#5f9060', 142), { x: 70, y: 1500 }), ...place(fern(160, -150, '#3f6a4e', 143), { x: 10, y: 1480 }));
scene(...place(fern(200, -60, '#4f7f56', 144), { x: 1170, y: 1500 }), ...place(fern(180, -110, '#5f9060', 145), { x: 1130, y: 1500 }), ...place(fern(170, -30, '#3f6a4e', 146), { x: 1190, y: 1420 }));
scene(...place(flowerSpray(151, 14, 140, FLOWERS), { x: 820, y: 1440 }), ...place(flowerSpray(152, 12, 120, FLOWERS), { x: 520, y: 1470 }), ...place(flowerSpray(153, 10, 100, FLOWERS), { x: 1080, y: 1060 }));
scene(...place(flowerSpray(154, 10, 100, FLOWERS), { x: 360, y: 1420 }), ...place(flowerSpray(155, 10, 100, FLOWERS), { x: 120, y: 1150 }));
scene(...place(toadstool(1.1, '#d8433a'), { x: 300, y: 1480 }), ...place(toadstool(0.8, '#d8433a'), { x: 330, y: 1486 }), ...place(toadstool(0.9, '#b87ad8'), { x: 1060, y: 1460 }), ...place(toadstool(0.7, '#b87ad8'), { x: 1090, y: 1470 }));
scene(...place(toadstool(0.8, '#e8803a'), { x: 150, y: 1220 }), ...place(toadstool(0.6, '#e8803a'), { x: 170, y: 1226 }), ...place(toadstool(0.7, '#d8433a'), { x: 690, y: 1340 }));
{
  const g = rng(161);
  let st = '';
  for (let i = 0; i < 18; i++) st += ellipse(g.range(0, WD), g.range(1160, 1490), g.range(8, 16), g.range(4, 8));
  scene(sh(st, '#7a7488'));
  let lv = '';
  for (let i = 0; i < 30; i++) lv += leaf(g.range(0, WD), g.range(900, 1490), g.range(10, 16), 5, g.range(0, 360));
  scene(sh(lv, '#c89a5a', { opacity: 0.7 }));
}
target('key', 'Golden key', place(goldenKey(), { x: 610, y: 1300, s: 0.72, rot: 25 }));

// ------------------------------------------------------------------ fireflies everywhere
{
  const g = rng(171);
  for (let i = 0; i < 38; i++) scene(...place(firefly(g.range(0.6, 1.1)), { x: g.range(20, WD - 20), y: g.range(420, 1460) }));
}
scene(sh(rect(0, 0, WD, HT), `url(#${ID}-vignette)`, { opacity: 0.24 }));
void petal;

const activity: FindActivity = {
  id: ID, version: 2, mode: 'find',
  title: 'The Enchanted Forest',
  blurb: 'Fireflies drift between the trees at dusk, where a mushroom ring glows and something with a silver horn is watching from the shadows.',
  collectionId: 'fairytale', categories: ["Fairytale"], difficulty: 'Moderate',
  width: WD, height: HT,
  defs:
    linearGradient(`${ID}-sky`, [[0, '#1a2250'], [0.55, '#3e4a8a'], [1, '#8a6aa8']]) +
    linearGradient(`${ID}-ground`, [[0, '#2f5248'], [0.4, '#3a6050'], [1, '#2a4a3e']]) +
    linearGradient(`${ID}-pond`, [[0, '#3a5a8a'], [1, '#5a7ab0']], 0, 0, 1, 1) +
    `<radialGradient id="${ID}-vignette" cx="0.5" cy="0.5" r="0.75"><stop offset="0.6" stop-color="#141a30" stop-opacity="0"/><stop offset="1" stop-color="#141a30" stop-opacity="1"/></radialGradient>`,
  items,
};
export default activity;
