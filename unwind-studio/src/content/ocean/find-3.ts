import { rect, ellipse, circle, poly, line, curve, blob, sh, stroke, place, shade, rng, linearGradient, radialGradient, waveBand, type Xf } from '../../art/kit';
import type { Pt } from '../../art/geometry';
import type { Shape } from '../../art/types';
import type { FindActivity, FindItem } from '../types';
import {
  ol, hl, shadow, rock, pebbles, pp, starfish, scallop, spiralShell, snailShell, hermitCrab, crab, urchin, cloud, bucket, dipNet, gull, flyingGull, lighthouse,
  limpets, barnacles, mussels, wellies, sailboat, spade, poolAnemone, goby, driftwood, seaGlass, kelpFrond, seagrass,
} from './props-find';

const ID = 'ocean-find-3';
const W = 1200, H = 1500;
const items: FindItem[] = [];
const scene = (...s: (Shape | Shape[])[]) => { items.push({ shapes: s.flat() }); };
const target = (id: string, name: string, shapes: Shape[]) => { items.push({ id, name, target: true, shapes }); };
const at = (shapes: Shape[], x: number, y: number, o: Xf = {}) => place(shapes, { x, y, ...o });

const defs =
  linearGradient(`${ID}-sky`, [[0, '#8cc8ec'], [0.65, '#cfe9f4'], [1, '#fbeed8']]) +
  linearGradient(`${ID}-sea`, [[0, '#3f8fb8'], [0.5, '#4fb0c4'], [1, '#8fd8d0']]) +
  linearGradient(`${ID}-rock`, [[0, '#a89a8e'], [1, '#85786f']]) +
  linearGradient(`${ID}-pool`, [[0, '#5fc4c8'], [1, '#2f93a8']]) +
  radialGradient(`${ID}-sun`, [[0, '#fffbe0'], [0.4, '#fff3c0'], [1, '#cfe9f4']]);

// =====================================================================
// sky
// =====================================================================
scene(sh(rect(0, 0, W, 350), `url(#${ID}-sky)`));
scene(sh(circle(210, 120, 150), `url(#${ID}-sun)`, { opacity: 0.24 }), sh(circle(210, 120, 78), '#fff6d0', { opacity: 0.5 }), sh(circle(210, 120, 52), '#fffbe6'));
scene(sh(cloud(520, 110, 1.1) + cloud(900, 70, 0.8) + cloud(60, 250, 0.7) + cloud(700, 240, 0.6) + cloud(1140, 200, 0.7), '#ffffff', { opacity: 0.92 }), sh(cloud(540, 120, 0.7) + cloud(915, 78, 0.5) + cloud(1150, 207, 0.4), '#e6f1f6'));
scene(at(flyingGull(86), 420, 210, { rot: -8 }), at(flyingGull(60), 640, 150, { rot: 10 }), at(flyingGull(44), 760, 200, { rot: -4 }), at(flyingGull(70), 80, 120, { rot: 6 }), at(flyingGull(36), 1060, 110, { rot: -12 }));

// =====================================================================
// sea, headland and lighthouse
// =====================================================================
scene(sh(rect(0, 330, W, 290), `url(#${ID}-sea)`), stroke(line([[0, 331], [W, 331]]), '#e6f4f6', 2, { opacity: 0.7 }));
scene(sh(blob([[380, 334], [420, 318], [470, 310], [520, 320], [560, 334]], 0.7), '#7fa8bc'), sh(blob([[20, 334], [50, 322], [100, 318], [150, 334]], 0.7), '#8fb4c6'));
{
  const g = rng(3);
  let wv = '', wv2 = '';
  for (let i = 0; i < 80; i++) { const y = g.range(340, 560), x = g.range(0, W), l = 8 + (y - 330) * 0.14; if (i % 3) wv += line([[x, y], [x + l, y]]); else wv2 += curve([[x, y], [x + l * 0.5, y - 2.5], [x + l, y]]); }
  scene(stroke(wv, '#ffffff', 1.6, { opacity: 0.5 }), stroke(wv2, '#d6f2f0', 2, { opacity: 0.7 }));
}
// headland
scene(
  sh(blob([[800, 420], [850, 372], [930, 352], [1040, 346], [1130, 330], [1240, 320], [1240, 440]], 0.6), '#c9b490'),
  sh(blob([[820, 392], [860, 366], [930, 348], [1040, 342], [1130, 326], [1240, 316], [1240, 372], [1100, 372], [960, 378]], 0.6), '#8fb070'),
  sh(blob([[1040, 344], [1130, 328], [1240, 318], [1240, 350], [1120, 356]], 0.6), '#a4c27e'),
  stroke(line([[880, 392], [884, 414]]) + line([[960, 384], [956, 418]]) + line([[1050, 378], [1056, 420]]) + line([[1140, 376], [1136, 424]]), '#a8926e', 2, { opacity: 0.7 }),
  sh(waveBand(790, W, 426, 4, 70, 444, 1), '#ffffff', { opacity: 0.85 }),
);
target('lighthouse', 'Lighthouse', at(lighthouse(220), 980, 362));
target('sailboat', 'Sailboat', at(sailboat(92, '#d8493b', '#fbf6ea', '#f6d86a'), 270, 452));
scene(stroke(curve([[60, 500], [140, 492], [220, 502], [320, 492], [420, 502]]) + curve([[560, 520], [660, 510], [760, 522], [880, 510], [1000, 520], [1140, 510]]), '#ffffff', 3, { opacity: 0.55 }));
// surf breaking on the rocks
scene(sh(waveBand(0, W, 566, 9, 210, 640, 0.5), '#bfeae4'), sh(waveBand(0, W, 584, 10, 150, 640, 2), '#ffffff', { opacity: 0.9 }));
{
  const g = rng(5);
  let spray = '';
  for (let i = 0; i < 46; i++) spray += circle(g.range(0, W), g.range(552, 596), g.range(1.5, 4.5));
  scene(sh(spray, '#ffffff', { opacity: 0.9 }));
}

// =====================================================================
// the rocky shelf
// =====================================================================
scene(sh(waveBand(0, W, 606, 10, 330, H, 1.4), `url(#${ID}-rock)`));
{
  const g = rng(11);
  const cols = ['#b3a698', '#9a8c80', '#8a7d74', '#a3927f', '#93887f'];
  const by = cols.map(() => '');
  let shad = '', edge = '', crack = '';
  for (let row = 0; row < 9; row++) {
    const y = 640 + row * 100 + g.range(-10, 10), sz = 70 + row * 14;
    for (let x = -40 + g.range(0, 80); x < W + 60; x += sz * g.range(1.5, 2.1)) {
      const cy = y + g.range(-26, 26), rx = sz * g.range(0.8, 1.2), ry = sz * g.range(0.3, 0.46);
      const pts: Pt[] = [];
      for (let i = 0; i < 8; i++) { const [px, py] = pp(0, 0, 1, i * 45 + g.range(-12, 12)); const k = g.range(0.78, 1.1); pts.push([x + px * rx * k, cy + py * ry * k]); }
      by[g.int(0, cols.length - 1)] += blob(pts, 0.45);
      shad += blob(pts.map(([px, py]): Pt => [px + 3, py + 7]), 0.45);
      edge += curve([pts[4], pts[5], pts[6], pts[7]], 0.45);
      if (g.next() < 0.6) crack += curve([[x - rx * 0.4, cy - ry * 0.2], [x + g.range(-10, 10), cy + g.range(-4, 6)], [x + rx * 0.5, cy + ry * 0.3]]);
    }
  }
  scene(sh(shad, '#4f463f', { opacity: 0.45 }), ...cols.map((c, i) => sh(by[i], c)), stroke(edge, '#d6cab8', 2.2, { opacity: 0.75 }), stroke(crack, '#5f554d', 1.3, { opacity: 0.55 }));
  // lichen, algae and speckles
  let lichen = '', algae = '', speck = '';
  for (let i = 0; i < 22; i++) { const x = g.range(0, W), y = g.range(640, H); lichen += ellipse(x, y, g.range(8, 22), g.range(4, 9), g.range(-20, 20)) + circle(x + g.range(-20, 20), y + g.range(-8, 8), g.range(2, 5)); }
  for (let i = 0; i < 18; i++) algae += ellipse(g.range(0, W), g.range(660, H), g.range(14, 40), g.range(5, 11), g.range(-14, 14));
  for (let i = 0; i < 200; i++) speck += circle(g.range(0, W), g.range(630, H), g.range(0.8, 2));
  scene(sh(lichen, '#dcbc5c', { opacity: 0.6 }), sh(algae, '#7c9c5c', { opacity: 0.5 }), sh(speck, '#5f554d', { opacity: 0.45 }));
}

// --- tide pools ---
const poolPts = (cx: number, cy: number, rx: number, ry: number, seed: number): Pt[] => {
  const g = rng(seed);
  const pts: Pt[] = [];
  for (let i = 0; i < 12; i++) { const k = g.range(0.84, 1.1); const [x, y] = pp(0, 0, 1, i * 30 + g.range(-6, 6)); pts.push([cx + x * rx * k, cy + y * ry * k]); }
  return pts;
};
const grow = (pts: Pt[], cx: number, cy: number, k: number, dy = 0): Pt[] => pts.map(([x, y]) => [cx + (x - cx) * k, cy + (y - cy) * k + dy]);
function pool(cx: number, cy: number, rx: number, ry: number, seed: number) {
  const g = rng(seed + 100);
  const p = poolPts(cx, cy, rx, ry, seed);
  let rip = '', glint = '';
  for (let i = 0; i < 5; i++) { const x = cx + g.range(-rx * 0.6, rx * 0.5), y = cy + g.range(-ry * 0.55, ry * 0.55), l = g.range(rx * 0.12, rx * 0.3); rip += curve([[x, y], [x + l * 0.5, y - 3], [x + l, y]]); }
  for (let i = 0; i < 4; i++) glint += ellipse(cx + g.range(-rx * 0.6, rx * 0.6), cy + g.range(-ry * 0.5, ry * 0.5), g.range(3, 6), 1.4);
  scene(
    sh(blob(grow(p, cx, cy, 1.09, 2), 1), '#5f544c'), sh(blob(grow(p, cx, cy, 1.04, -2), 1), '#c9bca6'), sh(blob(p, 1), `url(#${ID}-pool)`),
    sh(blob(grow(p, cx, cy, 0.95, -ry * 0.06), 1), '#1f6f86', { opacity: 0.24 }), sh(blob(grow(p, cx, cy, 0.66, ry * 0.08), 1), '#e9dcae', { opacity: 0.5 }),
    sh(blob(grow(p, cx, cy, 0.36, ry * 0.12), 1), '#f6edc8', { opacity: 0.45 }), stroke(rip, '#ffffff', 2, { opacity: 0.55 }), sh(glint, '#ffffff', { opacity: 0.8 }),
  );
}

// far pools (smaller and flatter with distance)
pool(900, 700, 180, 54, 1);
scene(at(poolAnemone(21, 22, '#e8607a'), 800, 700, { sy: 0.62 }), at(poolAnemone(22, 18, '#8fd06a'), 1010, 690, { sy: 0.62 }), at(starfish(38, '#b06fd0', 20), 900, 712, { sy: 0.7 }), at(goby(40, '#6f8090'), 940, 684, { rot: 190 }), at(pebbles(23, 10, 220, 50, ['#8f9aa8', '#c9b99c', '#6f8090'], 4), 890, 708));
pool(240, 756, 160, 56, 2);
scene(at(poolAnemone(24, 22, '#f29a5a'), 150, 760, { sy: 0.62 }), at(poolAnemone(25, 17, '#e86a9a'), 330, 744, { sy: 0.62 }), at(urchin(3, 34, '#3f4a6a'), 260, 776, { sy: 0.75 }), at(goby(36, '#8a7a5c'), 220, 738, { rot: -12 }), at(pebbles(26, 10, 200, 50, ['#8f9aa8', '#c9b99c'], 4), 250, 764));
scene(at(crab(52, '#6f9a6a'), 1090, 742), at(limpets(27, 6, 90, 34, '#c9b79a', 8), 620, 690), at(barnacles(28, 22, 130, 40, 3.5), 480, 670), at(mussels(29, 9, 80, 26, 13), 700, 700));

// boulder with the watching gull
scene(shadow(96, 716, 110, 12, 0.25, '#3b322c'), at(rock(31, 200, 92, '#8c8078'), 92, 716), at(barnacles(32, 16, 110, 30, 3.5), 96, 690), at(limpets(33, 3, 60, 16, '#d6c6a8', 7), 140, 664));
target('gull', 'Standing gull', at(gull(112), 86, 636));
scene(at(kelpFrond([[20, 640], [60, 650], [110, 664], [170, 660], [220, 676]], 16, '#7a8a3a'), 400, 40, { rot: 6 }));

// middle pools
pool(880, 1010, 196, 96, 3);
scene(
  at(poolAnemone(41, 34, '#e8607a'), 760, 1010, { sy: 0.72 }), at(poolAnemone(42, 26, '#8fd06a'), 960, 960, { sy: 0.72 }), at(poolAnemone(43, 22, '#f2a8c4'), 1000, 1050, { sy: 0.72 }),
  at(starfish(58, '#e86a8a', -24), 880, 1040, { sy: 0.8 }), at(goby(54, '#6f8090'), 850, 962, { rot: 8 }), at(goby(44, '#8a7a5c'), 940, 1018, { rot: 200 }), at(pebbles(44, 14, 280, 110, ['#8f9aa8', '#c9b99c', '#6f8090', '#e3d6b8'], 5), 880, 1016),
);
scene(at(kelpFrond([[0, 0], [30, 14], [70, 10], [110, 26], [150, 20]], 18, '#6f8a3a'), 1000, 928, { rot: 14 }), at(mussels(45, 12, 110, 34, 15), 700, 1090), at(limpets(46, 5, 90, 30, '#c9b79a', 9), 1090, 1000));
pool(350, 1090, 250, 142, 4);
scene(
  at(poolAnemone(51, 40, '#f29a5a'), 190, 1060, { sy: 0.78 }), at(poolAnemone(52, 30, '#e8607a'), 480, 1010, { sy: 0.78 }), at(poolAnemone(53, 26, '#a884e6'), 520, 1150, { sy: 0.78 }), at(poolAnemone(54, 22, '#8fd06a'), 250, 1180, { sy: 0.78 }),
  at(urchin(5, 50, '#3f4a6a'), 420, 1170, { sy: 0.85 }), at(goby(60, '#6f8090'), 380, 1010, { rot: -10 }), at(goby(48, '#8a7a5c'), 300, 1004, { rot: 172 }), at(goby(42, '#6f8090'), 470, 1090, { rot: 30 }),
  at(pebbles(55, 18, 380, 180, ['#8f9aa8', '#c9b99c', '#6f8090', '#e3d6b8'], 6), 350, 1100), at(scallop(30, '#f6e2b0'), 400, 1100, { rot: 30 }),
);
target('starfish', 'Orange starfish', at(starfish(92, '#f6883a', 14), 300, 1096, { sy: 0.88 }));
scene(at(kelpFrond([[0, 0], [40, -16], [84, -8], [130, -26], [176, -18]], 20, '#7a8a3a'), 96, 1010, { rot: -8 }), at(barnacles(56, 26, 150, 40, 4), 600, 1180), at(limpets(57, 5, 100, 34, '#d6c6a8', 10), 130, 1190), at(mussels(58, 10, 90, 30, 16), 560, 1010));

// --- things left on the rocks ---
target('net', 'Fishing net', [sh(poly([[330, 876], [345, 872], [580, 800], [600, 810], [585, 840], [540, 836], [345, 884]]), '#3b322c', { opacity: 0.2 }), ...at(dipNet(170), 468, 824, { rot: -18 })]);
target('bucket', 'Red bucket', [shadow(706, 902, 62, 10, 0.28, '#3b322c'), ...at(bucket(124, '#d8493b'), 700, 900)]);
target('wellies', 'Yellow boots', [shadow(1094, 880, 66, 10, 0.28, '#3b322c'), ...at(wellies(128, '#f2c230'), 1086, 876)]);
target('spade', 'Blue spade', [shadow(606, 956, 60, 8, 0.2, '#3b322c'), ...at(spade(118, '#3f7fc4'), 600, 946, { rot: 74 })]);
scene(at(seaGlass(61, 6, 110, 36), 800, 1180), at(pebbles(62, 12, 160, 40, ['#d9cdb8', '#6f655f', '#b9a58c'], 6), 520, 900), at(scallop(34, '#f4a6b8'), 1000, 1190, { rot: -20 }), at(snailShell(26, '#c9a67a'), 640, 1108), at(snailShell(20, '#8f7fa8'), 76, 900), at(scallop(26, '#f6e2b0'), 160, 880, { rot: 40 }));
target('crab', 'Red crab', [shadow(1088, 1196, 50, 8, 0.25, '#3b322c'), ...at(crab(110, '#dc5a42'), 1086, 1172)]);
target('whelk', 'Spiral shell', [shadow(124, 1300, 44, 7, 0.25, '#3b322c'), ...at(spiralShell(92, '#eab07a'), 120, 1282, { rot: -10 })]);
scene(shadow(430, 1322, 110, 9, 0.22, '#3b322c'), at(driftwood(220), 420, 1308, { rot: -6 }), at(limpets(63, 4, 70, 20, '#c9b79a', 9), 250, 1300));
target('hermit', 'Hermit crab', [shadow(636, 1322, 42, 7, 0.25, '#3b322c'), ...at(hermitCrab(92, '#d9a66a', '#e0734f'), 630, 1320)]);

// near pools
pool(900, 1370, 230, 104, 5);
scene(
  at(poolAnemone(71, 40, '#e86a9a'), 760, 1380), at(poolAnemone(72, 32, '#8fd06a'), 1040, 1350), at(poolAnemone(73, 28, '#f29a5a'), 980, 1430), at(starfish(60, '#b06fd0', 30), 930, 1330),
  at(goby(66, '#6f8090'), 880, 1432, { rot: -8 }), at(goby(50, '#8a7a5c'), 820, 1310, { rot: 184 }), at(pebbles(74, 18, 340, 130, ['#8f9aa8', '#c9b99c', '#6f8090', '#e3d6b8'], 6), 900, 1376), at(scallop(28, '#c9d8ee'), 1010, 1400, { rot: -40 }),
);
target('urchin', 'Sea urchin', at(urchin(7, 80, '#7a4fa6'), 856, 1372));
pool(250, 1436, 150, 62, 6);
scene(at(poolAnemone(75, 28, '#e8607a'), 180, 1436, { sy: 0.9 }), at(poolAnemone(76, 22, '#a884e6'), 320, 1450, { sy: 0.9 }), at(starfish(44, '#ef6f8f', -12), 256, 1420), at(goby(44, '#6f8090'), 300, 1412, { rot: 12 }), at(pebbles(77, 10, 200, 70, ['#8f9aa8', '#c9b99c'], 5), 250, 1440));
scene(at(mussels(78, 12, 120, 34, 17), 620, 1420), at(barnacles(79, 24, 150, 40, 4.5), 500, 1450), at(limpets(80, 5, 110, 30, '#d6c6a8', 11), 1120, 1280), at(seaGlass(81, 4, 70, 26), 440, 1400));
// foreground boulders and weed along the bottom edge
scene(at(rock(91, 260, 80, '#6f655f'), 60, 1524), at(rock(92, 300, 70, '#756a62'), 640, 1530), at(rock(93, 240, 86, '#6a605a'), 1150, 1528));
scene(at(kelpFrond([[0, 0], [36, -20], [80, -12], [120, -34], [170, -26]], 22, '#6f8a3a'), 20, 1480), at(kelpFrond([[0, 0], [-40, -18], [-84, -8], [-124, -28]], 20, '#7a8a3a'), 1190, 1476), at(seagrass(94, 70, 60, '#6f9a4a', 8), 640, 1470), at(barnacles(95, 18, 160, 30, 4.5), 1120, 1470));

const a: FindActivity = {
  id: 'ocean-find-3', version: 1, mode: 'find', title: 'Tide Pools at Low Tide', blurb: 'The tide is out, leaving sunny rock pools full of starfish, crabs and anemones below the lighthouse.',
  collectionId: 'ocean', categories: ["Ocean", "Animals"], difficulty: 'Relaxed',
  added: '2026-11-26',
  width: W, height: H, defs, items,
};
export default a;
