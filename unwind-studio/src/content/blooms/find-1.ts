import { blob, circle, curve, ellipse, leaf, line, linearGradient, mix, petal, place, poly, radialGradient, rect, rng, sh, shade, stroke } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { FindActivity, FindItem } from '../types';
import { bee, blossom, butterfly, daisy, ladybird, leafClump, pot, rose, roseBud, snail, soil, spike, trailer, tulip, wateringCan } from '../garden/props';
import { C, bouquet, envelope, floorboards, flatBook, flowerBucket, framedPicture, glasses, pencil, ribbonSpool, robin, scissors, shopBell, sprayBottle, sunflower, teacup, vase, wallpaper } from './props-find';

const W = 1200, H = 1500;
const ID = 'blooms-find-1';
const items: FindItem[] = [];
const scene = (...s: Shape[]) => { items.push({ shapes: s }); };
const target = (id: string, name: string, s: Shape[]) => { items.push({ id, name, target: true, shapes: s }); };

const PINKS = ['#f2a7b8', '#e98a9a', '#f8c9d6', '#d8607a'];
const WARM = ['#f3b47a', '#f2a7b8', '#fbe3c8', '#e98a6a'];
const WOOD = '#b98a5c', WOOD_DK = '#8a603c', WOOD_LT = '#d4a978';

// ================================================================= wall
scene(...wallpaper(0, 0, W, H, '#e3e7d6', '#8fa781', 11, 56));

// ================================================================= window: outside at dawn
const WX0 = 80, WX1 = 1120, WY0 = 70, WY1 = 610;
scene(sh(rect(WX0, WY0, WX1 - WX0, WY1 - WY0), `url(#${ID}-sky)`));
scene(sh(circle(880, 430, 120), `url(#${ID}-sun)`), sh(circle(880, 430, 34), '#fff1d0'));
{
  const g = rng(5);
  // soft clouds
  let cl = '';
  for (let i = 0; i < 7; i++) { const x = g.range(120, 1080), y = g.range(150, 300); cl += ellipse(x, y, g.range(50, 90), g.range(8, 14)); }
  scene(sh(cl, '#fde8da', { opacity: 0.8 }));
  // far rooftops
  let far = '';
  for (let x = WX0; x < WX1; x += 70) {
    const h = g.range(90, 160);
    const fw = Math.min(72, WX1 - x);
    far += rect(x, WY1 - h, fw, h) + poly([[x, WY1 - h], [x + fw / 2, WY1 - h - 30], [x + fw, WY1 - h]]);
  }
  scene(sh(far, '#d9b8b8', { opacity: 0.8 }));
  // street buildings
  const bcols = ['#c9a3a0', '#b9a0b4', '#d2b29a', '#a89cb8', '#c6aa94'];
  let x = WX0;
  let wins = '', lit = '';
  while (x < WX1) {
    const bw = Math.min(g.range(110, 170), WX1 - x), bh = g.range(150, 220), top = WY1 - bh;
    const col = g.pick(bcols);
    scene(sh(rect(x, top, bw, bh), col), sh(rect(x, top - 10, bw, 12), shade(col, -0.18)), sh(rect(x + bw * 0.7, top, bw * 0.3, bh), shade(col, -0.08)));
    for (let wy = top + 20; wy < WY1 - 50; wy += 46) for (let wx = x + 14; wx < x + bw - 30; wx += 34) {
      if (g.next() < 0.25) lit += rect(wx, wy, 18, 26, 2); else wins += rect(wx, wy, 18, 26, 2);
    }
    scene(sh(rect(x + bw * 0.5 - 6, top - 34, 12, 26), shade(col, -0.25)));
    x += bw + 6;
  }
  scene(sh(wins, '#8a7e98', { opacity: 0.7 }), sh(lit, '#fbd98a'));
  // street
  scene(sh(rect(WX0, 560, WX1 - WX0, 50), '#a99a96'), sh(rect(WX0, 552, WX1 - WX0, 10), '#c8bab2'));
  // lamp post
  scene(sh(rect(756, 300, 8, 260), '#3f4347'), sh(rect(746, 290, 28, 10, 3), '#3f4347'), sh(poly([[748, 290], [772, 290], [778, 256], [742, 256]]), '#fbe3a8', { opacity: 0.9 }), sh(poly([[740, 256], [780, 256], [760, 240]]), '#3f4347'));
  // street tree on the left
  scene(sh(rect(244, 380, 16, 180), '#6e5440'));
  for (const [cx, cy, r, c] of [[252, 330, 80, '#7f9a6a'], [210, 360, 56, '#8fae76'], [296, 350, 60, '#6f8f5a'], [250, 290, 52, '#9cbb82']] as [number, number, number, string][]) {
    const pts: [number, number][] = [];
    for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2; const k = g.range(0.85, 1.1); pts.push([cx + Math.cos(a) * r * k, cy + Math.sin(a) * r * 0.8 * k]); }
    scene(sh(blob(pts), c));
  }
  let lv = '';
  for (let i = 0; i < 40; i++) lv += leaf(g.range(180, 330), g.range(260, 410), 12, 4, g.range(0, 360));
  scene(sh(lv, '#b5cf92', { opacity: 0.8 }));
  scene(stroke(curve([[255, 400], [300, 395], [330, 386]]), '#6e5440', 4));
  // birds in the sky
  let fl = '';
  for (const [bx, by] of [[520, 170], [560, 150], [600, 182], [1000, 140]]) fl += curve([[bx - 10, by], [bx - 5, by - 5], [bx, by], [bx + 5, by - 5], [bx + 10, by]]);
  scene(stroke(fl, '#7a6a70', 1.8));
  // awning scallops seen through the top of the glass
  let sa = '', sb = '';
  for (let i = 0; i < 21; i++) {
    const ax = WX0 + i * 50;
    const d = poly([[ax, WY0], [ax + 50, WY0], [ax + 50, WY0 + 26]]) + rect(ax, WY0, 50, 26) + ellipse(ax + 25, WY0 + 26, 25, 12);
    if (i % 2) sa += d; else sb += d;
  }
  scene(sh(sa, '#e9a0a8'), sh(sb, '#fbf0e4'));
}
target('robin', 'Robin', place(robin(), { x: 314, y: 392, s: 0.72 }));
// glass reflections
scene(sh(poly([[180, WY1], [330, WY0 + 40], [380, WY0 + 40], [230, WY1]]) + poly([[620, WY1], [800, WY0 + 40], [830, WY0 + 40], [650, WY1]]), '#ffffff', { opacity: 0.12 }));
// glazing bars and frame
{
  const bar = '#f4efe4';
  scene(
    sh(rect(WX0 - 18, WY0 - 18, WX1 - WX0 + 36, 22) + rect(WX0 - 18, WY0 - 18, 22, WY1 - WY0 + 18) + rect(WX1 - 4, WY0 - 18, 22, WY1 - WY0 + 18), bar),
    sh(rect(338, WY0, 14, WY1 - WY0) + rect(593, WY0, 14, WY1 - WY0) + rect(848, WY0, 14, WY1 - WY0) + rect(WX0, 205, WX1 - WX0, 12), bar),
    sh(rect(WX0 - 18, WY0 - 18, WX1 - WX0 + 36, 6) + rect(345, WY0, 4, WY1 - WY0) + rect(600, WY0, 4, WY1 - WY0) + rect(855, WY0, 4, WY1 - WY0), '#ffffff', { opacity: 0.8 }),
    sh(rect(WX0, 214, WX1 - WX0, 3), '#cfc6b4'),
  );
}
// ================================================================= ceiling beam and dried bunches
scene(sh(rect(0, 0, W, 44), WOOD_DK), sh(rect(0, 34, W, 10), shade(WOOD_DK, -0.2)), stroke(line([[0, 14], [W, 14]]) + line([[0, 24], [W, 26]]), shade(WOOD_DK, 0.15), 1.4));
{
  const g = rng(17);
  const bunches: [number, string, 'spike' | 'rose' | 'daisy'][] = [[150, '#a591d6', 'spike'], [300, '#d8a0a0', 'rose'], [470, '#e8d29a', 'daisy'], [650, '#a591d6', 'spike'], [820, '#c98a8a', 'rose'], [990, '#d9c27a', 'daisy']];
  for (const [bx, col, kind] of bunches) {
    const len = g.range(90, 120);
    scene(stroke(line([[bx, 40], [bx, 64]]), '#8a7a5a', 1.4));
    const out: Shape[] = [];
    let st = '';
    for (let i = 0; i < 7; i++) st += line([[bx + (i - 3) * 1.5, 62], [bx + (i - 3) * 6, 62 + len]]);
    out.push(stroke(st, '#8a8a5a', 1.6));
    for (let i = 0; i < 7; i++) {
      const fx = bx + (i - 3) * 6.5, fy = 62 + len + g.range(-8, 10);
      if (kind === 'spike') out.push(...place(spike(46, col, i + bx, 0.7), { x: fx, y: fy - 40, rot: 180 }));
      else if (kind === 'rose') out.push(...place(rose(9, shade(col, g.range(-0.1, 0.1)), i + bx), { x: fx, y: fy }));
      else out.push(...place(daisy(9, col, '#b98a4a', 9), { x: fx, y: fy }));
    }
    out.push(sh(rect(bx - 9, 66, 18, 8, 2), '#c9b48c'));
    scene(...out);
  }
  // fairy lights
  scene(stroke(curve([[0, 54], [200, 90], [400, 58], [600, 92], [800, 60], [1000, 92], [1200, 58]]), '#5a5048', 1.2));
  let bulbs = '', glow = '';
  for (let i = 1; i < 30; i++) { const x = i * 40; const y = 74 + Math.sin((x / 400) * Math.PI * 2 + 1.2) * 16; bulbs += ellipse(x, y + 4, 3, 4.5); glow += circle(x, y + 4, 9); }
  scene(sh(glow, '#ffe7a0', { opacity: 0.35 }), sh(bulbs, '#ffe08a'));
}
// hanging baskets inside the window
for (const [hx, hy, col] of [[470, 300, '#f2a7b8'], [1010, 320, '#cdbdea']] as [number, number, string][]) {
  scene(stroke(line([[hx, 44], [hx - 34, hy - 20]]) + line([[hx, 44], [hx + 34, hy - 20]]) + line([[hx, 44], [hx, hy - 24]]), '#5a5048', 1.4));
  scene(...place(trailer(110, '#6f9a5a', hx, 7), { x: hx, y: hy - 6 }));
  const g = rng(hx);
  let lv = '';
  for (let i = 0; i < 14; i++) lv += leaf(hx + g.range(-30, 30), hy - 26 + g.range(-8, 8), 18, 6, g.range(-180, 0));
  scene(sh(lv, '#7fa66a'));
  for (let i = 0; i < 6; i++) scene(...place(blossom(9, i % 2 ? col : '#fffaf0'), { x: hx + g.range(-30, 30), y: hy - 30 + g.range(-8, 6) }));
  scene(sh(blob([[hx - 44, hy - 22], [hx + 44, hy - 22], [hx + 30, hy + 10], [hx - 30, hy + 10]], 0.6), '#a37a4a'));
  let wv = '';
  for (let k = 0; k < 3; k++) wv += curve([[hx - 40 + k * 3, hy - 14 + k * 9], [hx, hy - 10 + k * 9], [hx + 40 - k * 3, hy - 14 + k * 9]]);
  scene(stroke(wv, '#7a5634', 2), sh(rect(hx - 46, hy - 26, 92, 7, 3), '#c49a64'));
}
target('bell', 'Shop bell', place(shopBell(), { x: 1150, y: 100, s: 1 }));

// ================================================================= window sill
scene(sh(rect(40, 606, 1120, 30, 3), WOOD), sh(rect(40, 606, 1120, 7, 3), WOOD_LT), sh(rect(50, 636, 1100, 12), shade(WOOD, -0.3)));
{
  // tall jug of peonies
  scene(...place(bouquet(3, 60, ['#f2a7b8', '#f8c9d6'], ['peony', 'peony', 'bud']), { x: 140, y: 500 }));
  scene(...place(vase(62, 92, '#e9e3d6', 'jug'), { x: 140, y: 610 }), sh(ellipse(140, 560, 16, 10) + ellipse(126, 580, 6, 5), '#8fa9c8', { opacity: 0.6 }));
  // little fern
  scene(...place(trailer(80, C.leaf, 3, 6), { x: 228, y: 560 }), ...place(pot(52, 48, '#e09a74'), { x: 228, y: 610 }), ...place(soil(52), { x: 228, y: 563 }));
  // bottle with tulips
  for (let i = 0; i < 3; i++) scene(...place(tulip(110, ['#f2a7b8', '#f3b47a', '#e98a9a'][i], (i - 1) * 16), { x: 300 + (i - 1) * 4, y: 560 }));
  scene(...place(vase(42, 70, '#b9d7d0', 'bottle', true), { x: 300, y: 610 }));
}
target('spray', 'Spray bottle', place(sprayBottle('#86b8a4'), { x: 378, y: 609, s: 0.92 }));
{
  // geranium pot
  scene(...place(leafClump(4, 9, 46, 16, '#6f9a5a', 170), { x: 462, y: 556 }));
  const g = rng(9);
  for (let i = 0; i < 6; i++) scene(...place(blossom(10, '#e06a6a'), { x: 440 + g.range(0, 44), y: 500 + g.range(0, 30) }));
  scene(...place(pot(64, 56, C.terracotta), { x: 462, y: 610 }), ...place(soil(64), { x: 462, y: 556 }));
  // jars
  scene(...place(vase(36, 58, '#d6e6e0', 'cyl', true), { x: 528, y: 610 }), ...place(vase(30, 40, '#e6dccb', 'cyl', true), { x: 560, y: 610 }), sh(rect(510, 548, 36, 8, 2) + rect(545, 566, 30, 7, 2), '#b9a27a'));
  // bowl of roses
  scene(...place(bouquet(21, 74, PINKS, ['rose', 'rose', 'bud', 'daisy']), { x: 650, y: 520 }));
  scene(...place(vase(92, 54, '#9fb8c8', 'bowl'), { x: 650, y: 610 }), stroke(line([[612, 584], [688, 584]]), '#f4efe4', 2));
}
target('butterfly', 'Butterfly', place(butterfly('#f0a35a', '#fbe3c8'), { x: 610, y: 470, s: 0.72, rot: -20 }));
target('teacup', 'Teacup', place(teacup('#f4ede0', '#e98a9a', '#a8683a'), { x: 730, y: 608, s: 0.92 }));
{
  // cream jug with daisies
  const g = rng(31);
  let st = '';
  for (let i = 0; i < 6; i++) st += curve([[796, 556], [796 + (i - 2.5) * 8, 520], [796 + (i - 2.5) * 16, 480 + g.range(-10, 10)]]);
  scene(stroke(st, C.leaf, 1.6));
  for (let i = 0; i < 6; i++) scene(...place(daisy(13, '#fffaf0', '#f3c94f', 11), { x: 796 + (i - 2.5) * 16, y: 480 + ((i * 7) % 20) - 6 }));
  scene(...place(vase(58, 66, '#f1ead8', 'jug'), { x: 796, y: 610 }), stroke(line([[774, 572], [818, 572]]), '#e98a9a', 2));
  // lavender pot
  for (let i = 0; i < 7; i++) scene(...place(spike(70 + (i % 3) * 10, '#a591d6', i + 3, 0.7), { x: 868 + (i - 3) * 6, y: 566 }));
  scene(...place(pot(56, 46, '#d68a62'), { x: 870, y: 610 }));
  // eucalyptus bottle
  scene(...place(flowerBucket(36, 5, ['#9fb8a8'], 'euc', '#c8d8d0').slice(0, 18), { x: 952, y: 590 }));
  scene(...place(vase(40, 74, '#c8d8d0', 'bottle', true), { x: 952, y: 610 }));
  // ivy spilling over the sill
  scene(...place(trailer(130, '#5f9150', 8, 6), { x: 1058, y: 572 }), ...place(pot(60, 44, '#9fb8a8'), { x: 1058, y: 610 }), ...place(soil(60), { x: 1058, y: 568 }));
}

// ================================================================= left: chalkboard and tiered stand
scene(...floorboards(0, 1248, W, 252, '#a9805a', 77, 32));
scene(sh(rect(0, 1248, W, 8), shade('#a9805a', -0.4)));
scene(sh(rect(36, 690, 330, 210, 4), WOOD_DK), sh(rect(48, 702, 306, 186), '#3f4a44'));
{
  const chalk = '#e9ece4';
  scene(
    stroke(curve([[80, 730], [100, 722], [120, 732], [140, 724]]) + curve([[160, 730], [180, 722], [210, 730]]) + line([[80, 760], [180, 760]]) + line([[80, 784], [150, 784]]) + line([[80, 808], [200, 808]]) + line([[80, 832], [160, 832]]), chalk, 2, { opacity: 0.8 }),
    stroke(blob([[290, 740], [300, 750], [290, 760], [280, 750]]) + blob([[270, 730], [282, 746], [270, 752], [262, 740]]) + line([[285, 760], [282, 820]]) + curve([[282, 790], [300, 780], [310, 784]]), chalk, 2, { opacity: 0.8 }),
    stroke(curve([[230, 760], [236, 764], [240, 760]]) + curve([[230, 784], [236, 788], [240, 784]]) + curve([[230, 808], [236, 812], [240, 808]]), '#f2a7b8', 2, { opacity: 0.8 }),
  );
}
{
  // stand frame
  const tiers: [number, number][] = [[900, 230], [1120, 320], [1340, 410]];
  scene(sh(rect(30, 880, 14, 600) + rect(200, 900, 12, 220), WOOD_DK));
  for (const [y, w] of tiers) scene(sh(rect(20, y, w, 18, 3), WOOD), sh(rect(20, y, w, 5, 2), WOOD_LT), sh(rect(20, y + 18, w, 6), shade(WOOD, -0.35)), sh(rect(w - 2, y + 18, 12, 1480 - y - 18), WOOD_DK));
  // buckets
  const plan: [number, number, number, string[], Parameters<typeof flowerBucket>[3]][] = [
    [80, 900, 86, ['#f3c94f', '#f3b47a'], 'tulip'], [170, 900, 80, ['#a591d6', '#cdbdea'], 'spike'],
    [80, 1120, 92, PINKS, 'rose'], [180, 1120, 90, ['#fffaf0'], 'daisy'], [270, 1120, 84, ['#f8c9d6', '#f2a7b8'], 'peony'],
    [80, 1340, 92, ['#9fb8a8'], 'euc'], [180, 1340, 92, ['#e98a6a', '#f3b47a'], 'tulip'], [280, 1340, 90, ['#d8607a', '#f2a7b8'], 'rose'], [370, 1340, 70, ['#fffaf0'], 'daisy'],
  ];
  plan.forEach(([x, y, w, cols, kind], i) => scene(...place(flowerBucket(w, 40 + i, cols, kind), { x, y })));
}
target('ladybird', 'Ladybird', place(ladybird(), { x: 236, y: 1050, s: 0.8, rot: 30 }));

// ================================================================= right: shelf, ribbon rod, paper roll
scene(sh(rect(430, 760, 760, 14, 2), WOOD), sh(rect(430, 774, 760, 5), shade(WOOD, -0.35)));
scene(stroke(line([[480, 778], [480, 806], [510, 778]]) + line([[1130, 778], [1130, 806], [1100, 778]]), '#3f4347', 3));
{
  scene(...place(framedPicture(110, 130, '#c9a66b', 'flower', 4), { x: 560, y: 695 }));
  scene(...place(framedPicture(80, 96, '#6f8f8a', 'bird', 1), { x: 690, y: 712 }));
  scene(...place(vase(40, 80, '#7fa6c9', 'bottle'), { x: 770, y: 760 }), ...place(vase(50, 56, '#e9c9b8', 'jug'), { x: 830, y: 760 }));
  scene(...place(pot(46, 40, C.terracotta), { x: 890, y: 760 }), ...place(pot(46, 40, C.terraLight), { x: 890, y: 744 }), ...place(pot(46, 40, '#d68a62'), { x: 890, y: 728 }));
  scene(...place(leafClump(12, 7, 40, 10, '#6f9a5a', 120), { x: 960, y: 724 }), ...place(pot(50, 40, '#f1ead8'), { x: 960, y: 760 }));
  scene(...place(vase(70, 46, '#c9b8d8', 'bowl'), { x: 1040, y: 760 }), ...place(bouquet(7, 30, ['#cdbdea', '#fffaf0'], ['daisy', 'bud']), { x: 1040, y: 700 }));
  scene(...place(vase(36, 70, '#f2e0c0', 'cyl', true), { x: 1120, y: 760 }), stroke(line([[1112, 700], [1108, 650]]) + line([[1124, 700], [1132, 660]]), C.leaf, 1.4), ...place(roseBud(9, '#f2a7b8'), { x: 1108, y: 648 }), ...place(roseBud(9, '#e98a9a'), { x: 1132, y: 658 }));
}
// ribbon rod with spools (no pink spool here)
scene(sh(rect(760, 836, 410, 8, 4), WOOD_DK), sh(circle(760, 840, 7) + circle(1170, 840, 7), WOOD));
{
  const cols = ['#7fa6c9', '#f3c94f', '#9caf88', '#a591d6', '#f4efe4', '#e8833a', '#6f9f8f'];
  cols.forEach((c, i) => {
    const x = 800 + i * 54;
    scene(sh(rect(x - 3, 852, 6, 40 + (i % 3) * 14), c), sh(poly([[x - 3, 892 + (i % 3) * 14], [x + 3, 892 + (i % 3) * 14], [x, 886 + (i % 3) * 14]]), '#e3e7d6'));
    scene(sh(circle(x, 840, 20), '#efe4cc'), sh(circle(x, 840, 16), c), stroke(circle(x, 840, 12), shade(c, -0.2), 0.9), sh(circle(x, 840, 6), '#efe4cc'), sh(circle(x, 840, 2.5), '#7a6648'));
  });
}
// kraft paper roll
scene(sh(rect(450, 870, 280, 46, 23), '#c9a06a'), sh(rect(450, 870, 280, 12, 6), '#ddb986'), sh(ellipse(730, 893, 12, 23), '#b48a56'), sh(ellipse(730, 893, 5, 9), '#6e4a2e'), sh(rect(440, 880, 10, 26, 3) + rect(736, 880, 10, 26, 3), '#3f4347'));
scene(sh(poly([[470, 912], [700, 912], [712, 950], [462, 950]]), '#d6b07c'), stroke(line([[480, 924], [700, 924]]), '#b48a56', 1, { opacity: 0.5 }));

// ================================================================= counter
scene(sh(rect(420, 940, 780, 52, 3), WOOD_LT), sh(rect(420, 940, 780, 6, 3), shade(WOOD_LT, 0.2)), sh(rect(420, 986, 780, 12), shade(WOOD, -0.25)));
scene(sh(rect(440, 998, 760, 250), WOOD), sh(rect(440, 1236, 760, 12), shade(WOOD, -0.35)));
{
  let panels = '', hi = '';
  for (let i = 0; i < 4; i++) { const x = 460 + i * 185; panels += rect(x, 1060, 165, 160, 4); hi += rect(x + 6, 1066, 153, 6); }
  scene(sh(panels, shade(WOOD, -0.12)), sh(hi, shade(WOOD, 0.15)));
  let drw = '';
  for (let i = 0; i < 4; i++) drw += rect(460 + i * 185, 1010, 165, 38, 3);
  scene(sh(drw, shade(WOOD, 0.08)), stroke(drw, shade(WOOD, -0.3), 1.2), sh([0, 1, 2, 3].map((i) => circle(542 + i * 185, 1029, 5)).join(''), '#c9a54a'));
  // label holder on drawer
  scene(sh(rect(612, 1018, 40, 12, 2) + rect(797, 1018, 40, 12, 2), '#f4efe4'), stroke(rect(612, 1018, 40, 12, 2) + rect(797, 1018, 40, 12, 2), '#8a8a80', 1));
}
{
  // counter front detail: grain, a hanging wreath, price tags
  const g = rng(63);
  let grain = '';
  for (let i = 0; i < 4; i++) for (let k = 0; k < 5; k++) { const x = 470 + i * 185 + g.range(0, 140), y = 1075 + k * 30 + g.range(0, 10); grain += curve([[x, y], [x + 30, y + g.range(-3, 3)], [x + 60, y + g.range(-2, 2)]]); }
  scene(stroke(grain, shade(WOOD, -0.28), 1, { opacity: 0.45 }));
  const wr: Shape[] = [stroke(line([[820, 1062], [820, 1090]]), '#8a7a5a', 1.4), stroke(circle(820, 1140, 46), '#8a6a44', 6)];
  let wl = '', wl2 = '';
  for (let i = 0; i < 30; i++) { const a = (i / 30) * 360; const x = 820 + Math.cos(a * Math.PI / 180) * 46, y = 1140 + Math.sin(a * Math.PI / 180) * 46; (i % 2 ? (wl += leaf(x, y, 18, 5, a + 100)) : (wl2 += leaf(x, y, 16, 4.5, a + 70))); }
  wr.push(sh(wl, '#6f8f5a'), sh(wl2, '#9fb8a8'));
  for (const a of [200, 250, 300, 340, 30]) wr.push(...place(rose(9, a % 100 ? '#f2a7b8' : '#fbe3c8', a), { x: 820 + Math.cos(a * Math.PI / 180) * 46, y: 1140 + Math.sin(a * Math.PI / 180) * 46 }));
  wr.push(sh(blob([[808, 1092], [820, 1100], [832, 1092], [826, 1106], [814, 1106]], 0.8), '#e98a9a'));
  scene(...wr);
  // little chalk price boards on string
  for (const [x, y] of [[540, 1110], [1100, 1120]] as [number, number][]) {
    scene(stroke(line([[x - 20, y - 30], [x, y - 50], [x + 20, y - 30]]), '#8a7a5a', 1.2), sh(rect(x - 28, y - 30, 56, 40, 3), WOOD_DK), sh(rect(x - 24, y - 26, 48, 32), '#3f4a44'),
      stroke(line([[x - 16, y - 16], [x + 14, y - 16]]) + line([[x - 12, y - 6], [x + 8, y - 6]]), '#e9ece4', 1.6, { opacity: 0.8 }));
  }
  // crate of terracotta pots on the floor
  scene(sh(rect(1050, 1300, 140, 100, 3), '#c49a64'), stroke(line([[1050, 1333], [1190, 1333]]) + line([[1050, 1366], [1190, 1366]]), '#8a6a44', 2), sh(rect(1050, 1300, 10, 100) + rect(1180, 1300, 10, 100), '#a37a4a'));
  scene(...place(pot(50, 44, C.terracotta), { x: 1086, y: 1306 }), ...place(pot(50, 44, C.terraLight), { x: 1150, y: 1302 }), ...place(pot(50, 44, '#d68a62'), { x: 1118, y: 1290 }));
}
// counter top: wrapping paper and bouquet
scene(sh(poly([[560, 948], [780, 940], [820, 986], [590, 990]]), '#d6b07c'), sh(poly([[580, 950], [780, 944], [800, 970], [600, 975]]), '#e5c899'));
{
  const g = rng(55);
  let st = '';
  for (let i = 0; i < 9; i++) st += line([[650, 958 + g.range(-6, 6)], [800, 966 + g.range(-4, 4)]]);
  scene(stroke(st, C.leaf, 2));
  scene(...place(bouquet(61, 52, ['#f2a7b8', '#fbe3c8', '#e98a9a', '#cdbdea'], ['rose', 'peony', 'daisy', 'bud']), { x: 640, y: 942 }));
  scene(sh(rect(730, 954, 14, 18, 3), '#e98a9a'));
}
target('glasses', 'Reading glasses', place(glasses('#8a5a3a'), { x: 488, y: 958, s: 0.9, rot: -6 }));
scene(...place(flatBook(80, 12, '#9caf88'), { x: 440, y: 986 }), ...place(flatBook(74, 10, '#c9b8d8'), { x: 444, y: 974 }));
target('envelope', 'Envelope', place(envelope('#f8eedc', '#c94a3c'), { x: 528, y: 960, s: 0.8, rot: -10 }));
target('scissors', 'Scissors', place(scissors('#d8607a'), { x: 858, y: 972, s: 0.85, rot: -12 }));
scene(sh(circle(930, 960, 20), '#c9a66b'), stroke(curve([[915, 950], [930, 968], [945, 952]]) + curve([[912, 962], [930, 945], [948, 966]]), '#9a7a48', 1.3), stroke(curve([[945, 970], [960, 980], [972, 976]]), '#b08d52', 1.6));
// tape dispenser
scene(sh(blob([[970, 986], [972, 966], [990, 956], [1010, 960], [1018, 986]], 0.6), '#5a6a70'), sh(circle(994, 970, 9), '#e9e3d6', { opacity: 0.8 }), sh(circle(994, 970, 4), '#5a6a70'));
target('ribbon', 'Pink ribbon spool', place(ribbonSpool('#ec8fab'), { x: 1062, y: 950, s: 0.95 }));
{
  // jar of loose stems and a card stand
  scene(...place(vase(38, 50, '#d6e6e0', 'cyl', true), { x: 1150, y: 988 }), stroke(line([[1142, 940], [1136, 900]]) + line([[1150, 940], [1152, 896]]) + line([[1158, 940], [1166, 904]]), C.leaf, 1.6));
  scene(...place(blossom(9, '#f3c94f'), { x: 1136, y: 900 }), ...place(blossom(9, '#fffaf0'), { x: 1152, y: 894 }), ...place(blossom(8, '#e98a9a'), { x: 1166, y: 902 }));
}
target('pencil', 'Pencil', place(pencil('#f3c94f'), { x: 1105, y: 982, s: 0.8, rot: -8 }));

// ================================================================= floor
{
  // rug-like mat under buckets
  scene(sh(rect(450, 1400, 720, 90, 6), '#b9c4a8'), stroke(rect(462, 1410, 696, 70, 4), '#e3e7d6', 2, { opacity: 0.8 }));
  const plan: [number, number, number, string[], Parameters<typeof flowerBucket>[3]][] = [
    [520, 1440, 96, ['#f2a7b8', '#fbe3c8'], 'tulip'], [640, 1460, 100, [''], 'sun'], [760, 1440, 96, ['#9fb8a8'], 'euc'],
    [880, 1462, 100, PINKS, 'rose'], [1000, 1442, 90, ['#fffaf0', '#fbe3c8'], 'daisy'],
  ];
  plan.forEach(([x, y, w, cols, kind], i) => scene(...place(flowerBucket(w, 90 + i, cols, kind), { x, y })));
  // a lone sunflower lying across
  scene(stroke(line([[560, 1490], [700, 1478]]), C.leaf, 3), ...place(sunflower(22), { x: 560, y: 1488 }));
}
target('bee', 'Bee', place(bee(), { x: 666, y: 1300, s: 0.9 }));
target('wateringcan', 'Watering can', place(wateringCan('#9fb8c8'), { x: 1120, y: 1478, s: 0.62 }));
target('snail', 'Snail', place(snail('#c98d54'), { x: 430, y: 1478, s: 0.7 }));
{
  const g = rng(99);
  let pt = '', lf = '';
  for (let i = 0; i < 18; i++) pt += petal(g.range(60, 1180), g.range(1300, 1494), 8, 3.4, g.range(0, 360));
  for (let i = 0; i < 12; i++) lf += leaf(g.range(60, 1180), g.range(1300, 1494), 18, 5, g.range(0, 360));
  scene(sh(pt, '#f2a7b8'), sh(lf, '#7f9a6a'));
}

// ================================================================= light
scene(sh(poly([[700, 70], [900, 70], [600, 1500], [300, 1500]]) + poly([[960, 70], [1060, 70], [900, 1500], [760, 1500]]), '#fff1d0', { opacity: 0.08 }));
scene(sh(rect(0, 0, W, H), `url(#${ID}-vignette)`, { opacity: 0.22 }));

const activity: FindActivity = {
  id: ID, version: 1, mode: 'find',
  title: 'The Florist at Dawn',
  blurb: 'Buckets of fresh blooms, ribbon and kraft paper as the little flower shop opens for the day.',
  collectionId: 'blooms',
  categories: ['Flowers', 'Interiors', 'Still life'],
  difficulty: 'Moderate',
  width: W, height: H,
  defs:
    linearGradient(`${ID}-sky`, [[0, '#f6c3a8'], [0.45, '#fbe0cc'], [0.8, '#f4ece4'], [1, '#e9e6ea']]) +
    `<radialGradient id="${ID}-sun"><stop offset="0" stop-color="#fff3d6"/><stop offset="0.45" stop-color="#fde2bc" stop-opacity="0.8"/><stop offset="1" stop-color="#fbe0cc" stop-opacity="0"/></radialGradient>` +
    `<radialGradient id="${ID}-vignette" cx="0.5" cy="0.45" r="0.75"><stop offset="0.7" stop-color="#2a1c18" stop-opacity="0"/><stop offset="1" stop-color="#2a1c18" stop-opacity="0.8"/></radialGradient>`,
  items,
};
export default activity;
void mix;
