import { rect, ellipse, circle, poly, line, curve, blob, sh, stroke, place, shade, rng, linearGradient } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { FindActivity, FindItem } from '../types';
import { ol, shadow, floor, mug, teapot, rollingPin, ovenGlove } from '../kitchen/props-find';
import { bricks, wallShelf, stool, pendant, cactus, snakePlant, hangingPlant, wateringCan, monstera } from '../cafe/props-find';
import { fern } from '../library/props';
import {
  Y, gardenView, windowFrame, pot, plateStack, potteryWheel, wetPot, kiln, glazeBucket, apron, sponge, wireCutter, loopTool, woodRib, brush, toolJar, clayBag, bandingWheel,
  sprayBottle, clayBird, calipers, testTiles, splat,
} from './props-find';

const ID = 'crafts-find-3';
const W = 1200, H = 1500;
const items: FindItem[] = [];
const scene = (...s: (Shape | Shape[])[]) => { items.push({ shapes: s.flat() }); };
const target = (id: string, name: string, shapes: Shape[]) => { items.push({ id, name, target: true, shapes }); };
const at = (s: Shape[], x: number, y: number, k = 1, rot = 0) => place(s, { x, y, s: k, rot });

const defs = linearGradient(`${ID}-sky`, [[0, '#a6d2e6'], [0.6, '#d2e8ee'], [1, '#f2f0d6']]);
const G = { celadon: '#9cc4b0', cobalt: '#3f6fb0', honey: '#e0a93a', oxblood: '#b0413a', cream: '#f4ead2', teal: '#3f8a84', rose: '#e8a08a', slate: '#5a6e7a', moss: '#7f9a5a', white: '#fbf6ea' };

// =====================================================================
// walls and floor
// =====================================================================
scene(bricks(0, 0, W, 806, 22, ['#f1e8d8', '#eaddc8', '#f6f0e2', '#e4d6be'], '#d3c4a8', 7));
scene(sh(rect(0, 0, W, 26), '#6e5440'), sh(rect(0, 22, W, 6), '#55402f'));
scene(floor(806, H, W, 600, 520, 13, '#b7a48c', '#c6b59e', 5));
scene(sh(rect(0, 792, W, 18), '#8a745c'), sh(rect(0, 792, W, 4), '#a48c72'));
scene(place(splat(60, Y.wetClay, 3), { x: 640, y: 1010 }), place(splat(44, '#d9cdb8', 8), { x: 980, y: 1190 }), place(splat(50, Y.wetClay, 5), { x: 250, y: 1250 }), place(splat(36, '#d9cdb8', 2), { x: 60, y: 1010 }));

// =====================================================================
// window with plants
// =====================================================================
{
  const x0 = 72, y0 = 112, w = 300, h = 388;
  scene(gardenView(x0, y0, w, h, `url(#${ID}-sky)`, 12));
  scene(windowFrame(x0, y0, w, h, '#5d756c', 3, 2, '#c9a878'));
  scene(at(hangingPlant(96, 64, 4, '#e8a08a'), 318, y0 - 6), at(hangingPlant(70, 50, 9, G.white), 120, y0 - 6));
  target('cactus', 'Cactus', at(cactus(66, '#3f6fb0'), 104, 508));
  scene(at(snakePlant(86, 5, G.honey), 168, 508));
  target('bird', 'Clay bird', at(clayBird(52, '#7fb0d0'), 238, 508));
  scene(at(pot(1, 34, G.oxblood), 292, 508), at(fern(rng(2), 46, 30, 24, G.celadon, 8), 346, 508));
}

// =====================================================================
// peg rail with aprons
// =====================================================================
scene(sh(rect(404, 152, 196, 8), '#000000', { opacity: 0.12 }), ol(rect(400, 140, 196, 16, 3), '#b98552', 1, -0.35));
target('apron', 'Blue apron', at(apron(250, '#3f6fb0'), 448, 152));
scene(at(apron(228, G.honey, '#b9a492'), 520, 152));
target('calipers', 'Calipers', at(calipers(104), 578, 156));
scene(place(testTiles(6, 3, 28, [G.celadon, G.cobalt, G.honey, G.oxblood, G.cream, G.teal, G.rose, G.slate], 4), { x: 404, y: 436 }));

// =====================================================================
// shelves of finished pots
// =====================================================================
{
  const sx = 620, sw = 552;
  const s1 = 196, s2 = 336, s3 = 476;
  // top shelf: glazed vases and jars
  scene(at(pot(0, 120, G.cobalt, { band: G.white }), sx + 40, s1), at(pot(1, 86, G.celadon, { lid: true }), sx + 112, s1), at(pot(3, 132, G.cream, { dip: G.honey }), sx + 186, s1), at(pot(6, 110, G.oxblood), sx + 248, s1));
  target('teapot', 'Teapot', at(teapot(64, '#5c8a4e'), sx + 322, s1));
  scene(at(pot(5, 96, G.white, { dip: G.cobalt, speck: G.cobalt }), sx + 404, s1), at(pot(2, 118, G.teal, { band: G.cream }), sx + 466, s1), at(pot(0, 92, G.rose, { dip: G.white }), sx + 520, s1));
  // middle shelf: mugs, bowls, plates and a jug
  scene(at(mug(40, G.celadon, G.white), sx + 34, s2), at(mug(40, G.honey, G.white), sx + 84, s2));
  {
    const m = mug(44, G.white, G.white);
    let dots = '';
    for (const [x, y] of [[-9, -32], [5, -28], [-3, -18], [10, -14], [-11, -8], [2, -6]] as [number, number][]) dots += circle(x, y, 3.2);
    target('mug', 'Spotted mug', at([...m, sh(dots, G.oxblood)], sx + 138, s2));
  }
  scene(at(pot(4, 34, G.cobalt, { speck: G.white }), sx + 214, s2), at(pot(4, 28, G.cream, { dip: G.rose }), sx + 214, s2 - 30), at(plateStack(84, [G.cream, G.celadon, G.cream, G.honey, G.cream, G.teal]), sx + 306, s2));
  scene(at(pot(5, 88, G.honey, { handle: true, dip: G.cream }), sx + 392, s2), at(pot(4, 40, G.moss, { speck: G.cream }), sx + 476, s2), at(mug(36, G.oxblood, G.cream), sx + 532, s2));
  // bottom shelf: bisque ware waiting for glaze
  const b = Y.bisque;
  scene(at(pot(2, 84, b), sx + 36, s3), at(pot(5, 76, shade(b, -0.05)), sx + 100, s3), at(pot(0, 100, b), sx + 164, s3), at(pot(4, 36, shade(b, -0.04)), sx + 238, s3), at(pot(4, 30, b), sx + 238, s3 - 30));
  scene(at(pot(3, 104, shade(b, 0.04)), sx + 316, s3), at(pot(1, 70, b, { lid: true }), sx + 384, s3), at(mug(36, b, shade(b, -0.08)), sx + 444, s3), at(mug(36, shade(b, -0.04), shade(b, -0.1)), sx + 486, s3), at(pot(6, 92, b), sx + 532, s3));
  scene(at(wallShelf(sw), sx, s1), at(wallShelf(sw), sx, s2), at(wallShelf(sw), sx, s3));
}

// =====================================================================
// drying rack of greenware
// =====================================================================
{
  const x0 = 600, x1 = 846;
  const boards = [574, 662, 750, 838];
  scene(sh(rect(x0 + 8, 560, 12, 312) + rect(x1 - 20, 560, 12, 312), '#8a623c'));
  const gw = [Y.greenware, shade(Y.greenware, -0.08), shade(Y.greenware, 0.08), Y.wetClay];
  const kinds = [[2, 5, 0, 4], [4, 1, 3, 2], [5, 2, 4, 6], [0, 5, 1, 4]];
  boards.forEach((by, r) => {
    kinds[r].forEach((k, i) => scene(at(pot(k, k === 4 ? 28 : 46 + ((r + i) % 3) * 8, gw[(r + i) % 4], { rings: k === 2 }), x0 + 44 + i * 54, by)));
    scene(ol(rect(x0, by, x1 - x0, 10, 2), '#d2a56c', 1, -0.35), sh(rect(x0, by + 10, x1 - x0, 5), '#000000', { opacity: 0.14 }));
  });
  scene(sh(rect(x0 + 6, 866, 14, 8, 2) + rect(x1 - 22, 866, 14, 8, 2), '#3b2f2a'));
}
scene(stroke(line([[876, 588], [876, 600]]), '#6f7a82', 3));
target('glove', 'Kiln glove', at(ovenGlove(86, '#cf4a3c'), 878, 596));

// =====================================================================
// kiln
// =====================================================================
scene(at(kiln(270, 330), 1044, 874));
target('spray', 'Spray bottle', at(sprayBottle(62, '#7fb0d0'), 960, 544));
scene(at(pot(4, 22, Y.bisque), 1120, 544), at(pot(4, 18, Y.bisque), 1120, 524));

// =====================================================================
// workbench under the window
// =====================================================================
{
  const bx = 20, bw = 548, by = 640;
  scene(shadow(bx + bw / 2, 884, bw * 0.5, 10, 0.16));
  scene(ol(rect(bx + 16, by + 20, 26, 244, 2), '#9a6f44', 1, -0.35), ol(rect(bx + bw - 42, by + 20, 26, 244, 2), '#9a6f44', 1, -0.35), ol(rect(bx + 30, by + 20, bw - 60, 34, 2), '#a8794c', 1, -0.35));
  // glaze buckets underneath
  scene(at(glazeBucket(92, 104, G.celadon), 118, 880), at(glazeBucket(92, 104, G.cobalt, '#f4f0e6', false), 224, 880), at(glazeBucket(92, 104, G.honey), 330, 880), at(glazeBucket(92, 104, G.oxblood, '#f4f0e6', false), 436, 880));
  scene(stroke(line([[330, 776], [352, 716]]), '#d7a970', 5));
  scene(ol(rect(bx, by, bw, 22, 3), '#d2a56c', 1.2, -0.35), sh(rect(bx, by, bw, 5, 3), '#e6c08c'), sh(blob([[150, 640], [210, 638], [230, 642], [170, 645]], 0.9) + blob([[380, 640], [430, 639], [420, 644]], 0.9), Y.wetClay, { opacity: 0.6 }));
  // wedged clay
  scene(ol(blob([[52, 640], [48, 598], [70, 584], [112, 588], [122, 610], [120, 640]], 0.7), '#a98c78', 1.2), sh(blob([[58, 620], [60, 600], [80, 594], [78, 616]], 0.8), '#ffffff', { opacity: 0.16 }), stroke(curve([[56, 626], [86, 618], [118, 624]]), '#8a705e', 1.2));
  target('wire', 'Wire clay cutter', at(wireCutter(88), 184, 626, 1, -4));
  scene(at(toolJar(62, 6), 268, by));
  scene(at(bandingWheel(112), 368, by), at(pot(5, 86, Y.bisque, { band: G.cobalt }), 368, by - 43));
  target('brush', 'Paintbrush', at(brush(96, '#cf4a3c', G.cobalt), 470, 632, 1, -5));
  scene(at(pot(4, 20, G.white), 444, by), sh(ellipse(444, by - 19, 9, 2), G.cobalt));
  target('pin', 'Rolling pin', at(rollingPin(120), 500, by - 9 - 22));
  scene(sh(rect(450, by - 22, 104, 22, 3), '#a98c78'), stroke(rect(450, by - 22, 104, 22, 3), '#8a705e', 1));
}

// =====================================================================
// floor pots and the watering can
// =====================================================================
scene(at(pot(1, 200, G.teal, { band: G.cream }), 96, 1130), at(monstera(170, 3, G.teal, 0.1).slice(0, -3), 96, 1000));
scene(at(pot(3, 150, G.oxblood, { dip: G.honey }), 222, 1150));
target('can', 'Watering can', at(wateringCan(92, '#e0a93a'), 352, 1110));

// =====================================================================
// the wheel
// =====================================================================
scene(at(stool(210, '#9a6f44', '#7a5232'), 246, 1370));
scene(at(potteryWheel(360), 470, 1410));
scene(at(wetPot(132), 470, 1410 - 259));
target('sponge', 'Sponge', at(sponge(52), 596, 1410 - 254));
scene(sh(ellipse(360, 1410 - 256, 26, 6), Y.wetClay), sh(ellipse(360, 1410 - 262, 16, 5), shade(Y.wetClay, 0.1)));
// water bucket
scene(at(glazeBucket(112, 104, '#bcd0cc', '#8fa3a8'), 716, 1450));
target('clay', 'Bag of clay', at(clayBag(150), 110, 1470));
scene(ol(rect(170, 1420, 120, 52, 8), '#a98c78', 1.2), sh(rect(176, 1426, 30, 40, 5), '#ffffff', { opacity: 0.14 }));

// =====================================================================
// low tool table and glaze buckets (right)
// =====================================================================
{
  scene(shadow(880, 1474, 180, 10, 0.16), sh(rect(724, 1330, 22, 144) + rect(1002, 1330, 22, 144), '#8a623c'), sh(rect(760, 1330, 16, 110) + rect(972, 1330, 16, 110), '#6e4a2e'));
  scene(ol(poly([[742, 1232], [1004, 1232], [1046, 1318], [700, 1318]]), '#dab07a', 1.2, -0.35), ol(rect(696, 1318, 354, 22, 3), '#b98552', 1.2, -0.35));
  scene(sh(poly([[760, 1244], [880, 1244], [884, 1300], [744, 1300]]), '#efe6d0'), stroke(poly([[760, 1244], [880, 1244], [884, 1300], [744, 1300]]), '#b8a47e', 1));
  target('loop', 'Loop tool', at(loopTool(104, '#cf4a3c'), 812, 1272, 1, -12));
  target('rib', 'Wooden rib', place(woodRib(66), { x: 944, y: 1272, rot: 14, sy: 0.8 }));
  scene(stroke(line([[900, 1300], [990, 1306]]), '#8a9298', 2), ol(rect(892, 1296, 34, 8, 4), '#d7a970', 0.8), at(pot(4, 18, G.celadon), 1000, 1262), sh(ellipse(770, 1308, 14, 4) + ellipse(960, 1244, 10, 3), Y.wetClay, { opacity: 0.6 }));
  scene(at(glazeBucket(104, 110, G.teal, '#f4f0e6', false), 1100, 1372), at(glazeBucket(118, 122, G.rose), 1130, 1478));
  scene(stroke(line([[1130, 1360], [1160, 1290]]), '#d7a970', 6));
}
scene(at(pendant(70, 70, '#5d756c'), 470, 26), at(pendant(50, 60, '#b0413a'), 900, 26));

const activity: FindActivity = {
  id: 'crafts-find-3', version: 1, mode: 'find', title: "The Potter's Studio",
  blurb: 'Between the humming kiln, a pot rising on the wheel and shelves of glazed jugs, sixteen potter’s things are waiting to be spotted.',
  collectionId: 'crafts', categories: ["Crafts", "Cozy"], difficulty: 'Detailed',
  added: '2026-11-26',
  width: W, height: H, defs, items,
};
export default activity;
