import { rect, ellipse, circle, poly, line, curve, blob, stroke } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { PaintActivity, PaletteColor } from '../types';
import { collector, pot, arcPts, ribbon, ribbonStripes, ribbonEdges, smoothPath, rotRect, rotPt, wisp, yarnBall, yarnStrands, M, L, C, type Pt } from './props-paint';

const W = 1000, H = 1250;

const palette: PaletteColor[] = [
  { id: 'wall', number: 1, name: 'Oat wall', hex: '#f1e3ca' },
  { id: 'cream', number: 2, name: 'Wool white', hex: '#fdf6e6' },
  { id: 'sky', number: 3, name: 'Morning sky', hex: '#b7d5e8' },
  { id: 'green', number: 4, name: 'Meadow', hex: '#8fb47a' },
  { id: 'tableL', number: 5, name: 'Chestnut', hex: '#b9794a' },
  { id: 'tableD', number: 6, name: 'Dark chestnut', hex: '#9a5f38' },
  { id: 'wickerL', number: 7, name: 'Straw', hex: '#ecca86' },
  { id: 'wickerM', number: 8, name: 'Willow', hex: '#d3a35a' },
  { id: 'wickerD', number: 9, name: 'Cane', hex: '#a9743a' },
  { id: 'shadow', number: 10, name: 'Cocoa', hex: '#5b3a26' },
  { id: 'mustard', number: 11, name: 'Mustard', hex: '#e2a733' },
  { id: 'teal', number: 12, name: 'Teal', hex: '#368883' },
  { id: 'tealL', number: 13, name: 'Seafoam', hex: '#8cc4bb' },
  { id: 'rose', number: 14, name: 'Raspberry', hex: '#cf5f76' },
  { id: 'pink', number: 15, name: 'Blush', hex: '#f3b6bc' },
  { id: 'plum', number: 16, name: 'Plum', hex: '#77517f' },
  { id: 'silver', number: 17, name: 'Pewter', hex: '#c4c9cf' },
];

const { regions, R } = collector();
const detail: Shape[] = [];

// ---------- room ----------
R('wall', rect(0, 0, W, 712), 'wall');
R('table', rect(0, 700, W, 550), 'tableL');
R('table-back', rect(0, 700, W, 28), 'tableD');

// window
R('window-frame', rect(40, 56, 230, 340, 8), 'cream');
R('pane-left', rect(58, 74, 90, 304), 'sky');
R('pane-right', rect(162, 74, 90, 304), 'sky');
R('hill-left', M(58, 300) + C(86, 268, 120, 270, 148, 292) + L(148, 378) + L(58, 378) + 'Z', 'green');
R('hill-right', M(162, 296) + C(190, 310, 222, 276, 252, 262) + L(252, 378) + L(162, 378) + 'Z', 'green');
R('window-sill', rect(26, 390, 258, 24, 8), 'wickerL');

// framed sheep
R('picture-frame', rect(770, 86, 184, 226, 8), 'wickerD');
R('picture-sky', rect(788, 104, 148, 190), 'sky');
R('picture-grass', M(788, 238) + C(830, 222, 890, 222, 936, 240) + L(936, 294) + L(788, 294) + 'Z', 'green');
R('sheep', blob([[826, 200], [846, 176], [880, 170], [906, 186], [912, 214], [892, 236], [856, 240], [830, 228]], 1), 'cream');
R('sheep-head', ellipse(826, 196, 15, 19, -18), 'shadow');
detail.push(stroke(line([[850, 236], [850, 254]]) + line([[866, 238], [866, 256]]) + line([[886, 236], [886, 254]]) + line([[898, 232], [898, 250]]), '#5b3a26', 4));

// ---------- on the table: tea ----------
R('saucer', ellipse(132, 938, 108, 27), 'cream');
R('saucer-well', ellipse(132, 934, 70, 15), 'wall');
R('steam-1', wisp(112, 786, 120, 12, 20, 0.4), 'cream');
R('steam-2', wisp(152, 780, 96, 10, 18, 2.2), 'cream');
const mug = pot(132, [[806, 64], [928, 56]], 0.3);
R('mug-handle', M(74, 826) + C(8, 822, 8, 912, 76, 904) + L(76, 886) + C(36, 890, 36, 840, 74, 844) + 'Z', 'teal');
R('mug', mug.body(), 'teal');
R('mug-band', mug.band(846, 884), 'tealL');
R('mug-rim', mug.opening(), 'cream');
R('mug-tea', mug.opening(14, 3), 'wickerD');

// ---------- the basket ----------
const BX = 500;
R('basket-shadow', ellipse(BX, 958, 300, 44), 'tableD');
R('handle', ribbon([[234, 566], [262, 400], [360, 264], [500, 214], [640, 264], [738, 400], [766, 566]], 28, 60), 'wickerD');
R('rim-back', poly([...arcPts(BX, 552, 282, 66, 180, 360), ...arcPts(BX, 556, 256, 50, 360, 180)]), 'wickerM');
R('basket-inside', ellipse(BX, 556, 256, 50), 'shadow');

// a needle standing in the yarn
R('needle-up', poly([rotPt(300, 132, -24.5, -6, 0), rotPt(300, 132, -24.5, 6, 0), rotPt(300, 132, -24.5, 6, 380), rotPt(300, 132, -24.5, -6, 380)]), 'silver');
R('needle-up-knob', circle(300, 132, 17), 'rose');

// balls of yarn
yarnBall(R, 'yarn-plum', 566, 400, 72, 'plum', 'pink', 24);
yarnBall(R, 'yarn-mustard', 318, 500, 90, 'mustard', 'wickerL', -32);
yarnBall(R, 'yarn-raspberry', 694, 494, 84, 'rose', 'pink', 38);
yarnBall(R, 'yarn-teal', 458, 452, 96, 'teal', 'tealL', 14);
yarnBall(R, 'yarn-white', 392, 566, 56, 'cream', 'wall', -50);
detail.push(stroke(yarnStrands(566, 400, 72, 24), '#5c3b64', 1.6, { opacity: 0.7 }));
detail.push(stroke(yarnStrands(318, 500, 90, -32), '#a97614', 1.6, { opacity: 0.7 }));
detail.push(stroke(yarnStrands(694, 494, 84, 38), '#9c3c53', 1.6, { opacity: 0.7 }));
detail.push(stroke(yarnStrands(458, 452, 96, 14), '#225f5b', 1.6, { opacity: 0.7 }));

// woven sides
const basket = pot(BX, [[592, 262], [934, 214]], 0.234);
const bands = [592, 676, 762, 848, 934];
for (let i = 0; i < 4; i++) R(`basket-band-${i + 1}`, basket.band(bands[i], bands[i + 1]), i % 2 ? 'wickerM' : 'wickerL');
R('rim-front', poly([...arcPts(BX, 556, 256, 50, 180, 0), [782, 552], [782, 592], ...arcPts(BX, 592, 282, 66, 0, 180), [218, 552]]), 'wickerD');
{
  // weave: short uprights staggered row by row
  let d = '';
  for (let row = 0; row < 8; row++) {
    const y0 = 600 + row * 43, y1 = y0 + 43;
    for (let k = -5; k <= 5; k++) {
      const u = (k + (row % 2 ? 0.5 : 0)) / 5.6;
      if (Math.abs(u) > 0.96) continue;
      const drop = (y: number) => Math.sqrt(Math.max(0, 1 - u * u)) * basket.hw(y) * 0.234;
      d += line([[BX + u * basket.hw(y0), y0 + drop(y0) + 4], [BX + u * basket.hw(y1), y1 + drop(y1) - 4]]);
    }
  }
  detail.push(stroke(d, '#8f6230', 1.8, { opacity: 0.55 }));
  let rim = '';
  for (let k = -9; k <= 9; k++) {
    const a = 90 - k * 8.6, c = Math.cos((a * Math.PI) / 180), s = Math.sin((a * Math.PI) / 180);
    rim += line([[BX + c * 270, 566 + s * 58], [BX + c * 276 + 10, 596 + s * 62]]);
  }
  detail.push(stroke(rim, '#6f4a22', 2, { opacity: 0.6 }));
}

// ---------- loose ball and pattern book ----------
yarnBall(R, 'yarn-loose', 150, 1108, 68, 'rose', 'pink', -20);
detail.push(stroke(yarnStrands(150, 1108, 68, -20), '#9c3c53', 1.6, { opacity: 0.7 }));
R('book-pages', rotRect(858, 1160, 214, 142, -8, 8), 'cream');
R('book-cover', rotRect(848, 1148, 214, 142, -8, 8), 'plum');

// ---------- the striped scarf ----------
const scarfLine: Pt[] = [[600, 426], [615, 540], [630, 660], [645, 790], [662, 900], [684, 980], [676, 1052], [628, 1106], [548, 1136], [440, 1146], [330, 1134]];
const stripeColors = ['rose', 'cream', 'teal', 'mustard'];
ribbonStripes(scarfLine, 132, 14).forEach((d, i) => R(`scarf-stripe-${i + 1}`, d, stripeColors[i % 4]));
{
  const centre = smoothPath(scarfLine, 85), { a, b } = ribbonEdges(centre, 132);
  // ribbing along the scarf and a fringe at the cast-on end
  let rib = '';
  for (const t of [0.25, 0.5, 0.75]) rib += line(a.map((p, i): Pt => [p[0] + (b[i][0] - p[0]) * t, p[1] + (b[i][1] - p[1]) * t]));
  detail.push(stroke(rib, '#3b2a24', 1.2, { opacity: 0.22 }));
  let fringe = '';
  const [ea, eb, prev] = [a[84], b[84], centre[82]], end = centre[84];
  const ux = end[0] - prev[0], uy = end[1] - prev[1], ul = Math.hypot(ux, uy);
  for (let k = 0; k <= 10; k++) {
    const x = ea[0] + ((eb[0] - ea[0]) * k) / 10, y = ea[1] + ((eb[1] - ea[1]) * k) / 10;
    fringe += line([[x, y], [x + (ux / ul) * 26, y + (uy / ul) * 26]]);
  }
  detail.push(stroke(fringe, '#b4455d', 3));
}

// the working needle through the top row of stitches
R('needle-across', poly([rotPt(600, 428, -7.4, -272, -6), rotPt(600, 428, -7.4, 250, -6), rotPt(600, 428, -7.4, 250, 6), rotPt(600, 428, -7.4, -272, 6), rotPt(600, 428, -7.4, -296, 0)]), 'silver');
R('needle-across-knob', circle(...rotPt(600, 428, -7.4, 262, 0), 17), 'teal');
{
  let loops = '';
  for (let k = -5; k <= 5; k++) {
    const [x, y] = rotPt(600, 428, -7.4, k * 12, 0);
    loops += curve([[x - 5, y + 10], [x, y - 9], [x + 5, y + 10]]);
  }
  detail.push(stroke(loops, '#b4455d', 2.6));
}
// yarn running from the loose ball up to the knitting
detail.push(stroke(curve([[196, 1060], [250, 1010], [236, 960], [290, 930]]), '#cf5f76', 2.6));

// ---------- reading glasses on the pattern book ----------
{
  const g = (x: number, y: number) => rotPt(848, 1148, -8, x, y);
  const [lx, ly] = g(-50, 6), [rx, ry] = g(50, 6);
  R('glasses-left', ellipse(lx, ly, 44, 37, -8), 'shadow');
  R('glasses-right', ellipse(rx, ry, 44, 37, -8), 'shadow');
  R('lens-left', ellipse(lx, ly, 34, 27, -8), 'sky');
  R('lens-right', ellipse(rx, ry, 34, 27, -8), 'sky');
  detail.push(stroke(curve([g(-9, 0), g(0, -8), g(9, 0)]), '#5b3a26', 5));
  detail.push(stroke(curve([g(-93, 0), g(-104, -30), g(-84, -58)]) + curve([g(93, 0), g(106, -28), g(92, -60)]), '#5b3a26', 5));
  detail.push(stroke(line([g(-62, -4), g(-46, -12)]) + line([g(38, -4), g(54, -12)]), '#ffffff', 2.4, { opacity: 0.8 }));
}

// table grain
detail.push(stroke(line([[0, 1010], [90, 1010]]) + line([[330, 1216], [700, 1216]]) + line([[820, 800], [1000, 800]]) + line([[0, 760], [60, 760]]) + line([[830, 1010], [1000, 1010]]), '#7c4a29', 1.4, { opacity: 0.45 }));
// window glazing bar
detail.push(stroke(line([[58, 226], [148, 226]]) + line([[162, 226], [252, 226]]), '#fdf6e6', 5));

const activity: PaintActivity = {
  id: 'crafts-paint-2', version: 1, mode: 'paint', title: 'The Knitting Basket', blurb: "A wicker basket brims with balls of yarn while a half-knitted striped scarf trails across the table beside a mug of tea and a pair of reading glasses.",
  collectionId: 'crafts', categories: ["Crafts", "Cozy"], difficulty: 'Relaxed',
  added: '2026-11-26',
  width: W, height: H, palette, regions, detail,
};
export default activity;
