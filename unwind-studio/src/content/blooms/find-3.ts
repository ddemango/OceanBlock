import { blob, circle, curve, ellipse, leaf, line, linearGradient, place, poly, rect, rng, sector, sh, shade, star, stroke } from '../../art/kit';
import type { Pt } from '../../art/geometry';
import type { Shape } from '../../art/types';
import type { FindActivity, FindItem } from '../types';
import { blossomPath, bricks, leafClump, pot, soil, trailer } from '../garden/props';
import {
  C, bone, books, branch, candlestick, candyCane, flatBook, floorboards, framedPicture, garland, gingerbread, holly, mitten, mug, pineCone, robin, slipper, sleepingDog, snowGlobe, songbird, starOrnament, stocking, wallpaper, yarnBall,
} from './props-find';

const W = 1200, H = 1500;
const ID = 'blooms-find-3';
const items: FindItem[] = [];
const scene = (...s: Shape[]) => { items.push({ shapes: s }); };
const target = (id: string, name: string, s: Shape[]) => { items.push({ id, name, target: true, shapes: s }); };
const WOOD = '#8a603c', WOOD_LT = '#b98a5c';

/** Little jingle bell with a ribbon bow; origin at the bow, about 40 tall. */
function jingleBell(): Shape[] {
  const gold = '#d9a93a';
  return [
    sh(blob([[0, 0], [-16, -8], [-18, 4]], 0.7) + blob([[0, 0], [16, -8], [18, 4]], 0.7), '#a52e2a'),
    sh(poly([[-2, 0], [-8, 14], [-3, 12]]) + poly([[2, 0], [8, 14], [3, 12]]), '#c9302c'),
    sh(circle(0, 0, 4), '#c9302c'),
    sh(circle(0, 20, 15), gold), sh(blob([[6, 8], [14, 16], [12, 28], [4, 32], [10, 20]], 0.8), shade(gold, -0.2)),
    stroke(line([[-11, 20], [11, 20]]), shade(gold, -0.45), 2), sh(circle(0, 27, 3), shade(gold, -0.5)), stroke(line([[0, 27], [0, 33]]), shade(gold, -0.5), 2),
    sh(ellipse(-6, 13, 4, 2.5, -30), '#fff4cc', { opacity: 0.9 }),
  ];
}

// ================================================================= wall
scene(...wallpaper(0, 0, W, H, '#e9ddc8', '#8fa781', 37, 58));
// wainscot
scene(sh(rect(0, 1010, W, 270), '#c9d2bf'), sh(rect(0, 1004, W, 12, 2), '#e6eadd'), sh(rect(0, 1016, W, 4), '#a9b39c'));
{
  let pan = '', hi = '';
  for (let x = 14; x < W; x += 150) { pan += rect(x, 1040, 126, 210, 4); hi += rect(x + 4, 1044, 118, 4); }
  scene(sh(pan, '#bcc6b0'), sh(hi, '#dfe5d6'));
}
// bunting across the top
{
  scene(stroke(curve([[0, 36], [300, 92], [600, 112], [900, 92], [1200, 36]]), '#6e5440', 1.6));
  const cols = ['#c97a7a', '#e9dcc4', '#8fa781', '#d9a93a', '#9fb8c8'];
  for (let i = 0; i < 22; i++) {
    const x = 28 + i * 52, t = x / 1200, y = 36 + Math.sin(t * Math.PI) * 76 - 4;
    scene(sh(poly([[x - 18, y], [x + 18, y], [x, y + 40]]), cols[i % cols.length]), sh(poly([[x - 12, y + 4], [x - 2, y + 4], [x - 2, y + 26]]), '#ffffff', { opacity: 0.18 }));
  }
}
// left wall: pictures and a shelf
scene(...place(framedPicture(140, 110, '#8a5a3a', 'land', 1), { x: 120, y: 260 }));
scene(...place(framedPicture(90, 120, '#c9a66b', 'bird', 0), { x: 250, y: 290 }));
scene(...place(framedPicture(80, 80, '#6f8f8a', 'flower', 5), { x: 110, y: 410 }));
scene(sh(rect(20, 640, 290, 14, 2), WOOD_LT), sh(rect(20, 654, 290, 5), shade(WOOD, -0.3)), stroke(line([[60, 658], [60, 690], [90, 658]]) + line([[270, 658], [270, 690], [240, 658]]), '#3f4347', 3));
scene(...place(books(5, 110, 70, ['#8fa781', '#c97a7a', '#9fb8c8', '#d9c9ae', '#6e5440']), { x: 30, y: 640 }));
scene(...place(trailer(110, '#5f8a54', 6, 6), { x: 210, y: 600 }), ...place(leafClump(3, 7, 36, 10, '#6f9a5a', 140), { x: 210, y: 600 }), ...place(pot(50, 44, '#e9dcc4'), { x: 210, y: 640 }), ...place(soil(50), { x: 210, y: 600 }));
scene(sh(rect(262, 584, 30, 56, 4), '#d9e6ec', { opacity: 0.7 }), sh(rect(266, 600, 22, 36, 3), '#e9a85a', { opacity: 0.6 }), sh(rect(260, 578, 34, 8, 3), '#b9a27a'));

// ================================================================= right: frosty window
const WX0 = 920, WX1 = 1160, WY0 = 200, WY1 = 760;
scene(sh(rect(WX0, WY0, WX1 - WX0, WY1 - WY0), `url(#${ID}-snowsky)`));
{
  const g = rng(19);
  // distant snowy firs
  for (let i = 0; i < 7; i++) {
    const x = WX0 + 10 + i * 38 + g.range(-8, 8), h = g.range(90, 150), base = 660;
    scene(sh(poly([[x, base - h], [x + 26, base], [x - 26, base]]), g.pick(['#8fa59a', '#7f978d', '#9fb3a8'])), sh(poly([[x, base - h], [x + 10, base - h + 36], [x - 4, base - h + 30], [x - 10, base - h + 38]]), '#ffffff'));
  }
  scene(sh(blob([[WX0, 640], [1000, 620], [1080, 650], [WX1, 630], [WX1, WY1], [WX0, WY1]], 0.6), '#f6f8fa'), sh(blob([[WX0, 700], [1040, 690], [WX1, 704], [WX1, WY1], [WX0, WY1]], 0.6), '#e6edf2'));
  let fl = '';
  for (let i = 0; i < 50; i++) fl += circle(g.range(WX0, WX1), g.range(WY0, WY1), g.range(1.2, 3));
  scene(sh(fl, '#ffffff', { opacity: 0.9 }));
  // snowy branch with birds
  scene(...place(branch(260, 180, 4, '#5c4633', 9), { x: WX1 + 20, y: 540 }));
  scene(sh(blob([[WX1, 528], [1080, 526], [1000, 532], [930, 540], [1000, 536], [1080, 532], [WX1, 532]], 0.6), '#ffffff'));
  scene(...place(branch(180, 200, 9, '#5c4633', 6), { x: WX1 + 10, y: 600 }));
  scene(sh(blob([[WX1, 592], [1060, 594], [990, 616], [1060, 600], [WX1, 598]], 0.6), '#ffffff'));
  scene(...place(songbird('chickadee'), { x: 1104, y: 532, s: 0.55, sx: -0.55 }), ...place(songbird('cardinal'), { x: 1030, y: 610, s: 0.55 }));
  let ber = '';
  for (let i = 0; i < 12; i++) ber += circle(g.range(940, 1150), g.range(540, 566), 3.4);
  scene(sh(ber, '#c9302c'));
}
target('robin', 'Robin', place(robin(), { x: 984, y: 538, s: 0.62 }));
// frost
{
  const g = rng(3);
  let fr = '';
  for (const [cx, cy] of [[WX0, WY0], [WX1, WY0], [WX0, WY1], [WX1, WY1], [1040, WY1], [WX0, 380], [WX1, 660]] as Pt[]) for (let i = 0; i < 6; i++) {
    const r = g.range(8, 18);
    const x = Math.min(WX1 - r, Math.max(WX0 + r, cx + g.range(-30, 30))), y = Math.min(WY1 - r, Math.max(WY0 + r, cy + g.range(-24, 24)));
    fr += circle(x, y, r);
  }
  scene(sh(fr, '#ffffff', { opacity: 0.55 }));
  let crys = '';
  for (let i = 0; i < 14; i++) { const x = g.range(WX0 + 10, WX1 - 10), y = g.pick([g.range(WY0 + 8, WY0 + 60), g.range(WY1 - 60, WY1 - 8)]); for (let k = 0; k < 3; k++) { const a = (k * Math.PI) / 3; crys += line([[x - Math.cos(a) * 7, y - Math.sin(a) * 7], [x + Math.cos(a) * 7, y + Math.sin(a) * 7]]); } }
  scene(stroke(crys, '#ffffff', 1.4, { opacity: 0.9 }));
}
scene(
  sh(rect(WX0 - 20, WY0 - 20, WX1 - WX0 + 40, 22) + rect(WX0 - 20, WY0 - 20, 22, WY1 - WY0 + 20) + rect(WX1 - 2, WY0 - 20, 22, WY1 - WY0 + 20), '#f4efe4'),
  sh(rect(1033, WY0, 14, WY1 - WY0) + rect(WX0, 474, WX1 - WX0, 12), '#f4efe4'),
  sh(rect(1038, WY0, 3, WY1 - WY0) + rect(WX0, 476, WX1 - WX0, 3), '#ffffff'),
);
// valance
{
  let sc = '';
  for (let x = WX0 - 30; x < WX1 + 30; x += 34) sc += ellipse(x + 17, 222, 17, 14);
  scene(sh(rect(WX0 - 40, 150, WX1 - WX0 + 80, 74, 3) + sc, '#b77a7a'));
  let pl = '';
  for (let x = WX0 - 30; x < WX1 + 40; x += 24) pl += line([[x, 152], [x, 230]]);
  scene(stroke(pl, '#9a6262', 2, { opacity: 0.6 }), stroke(line([[WX0 - 40, 176], [WX1 + 40, 176]]) + line([[WX0 - 40, 200], [WX1 + 40, 200]]), '#e9dcc4', 2, { opacity: 0.7 }));
}
for (const [x, l, c] of [[952, 40, '#c97a7a'], [1004, 64, '#9fb8c8'], [1140, 30, '#8fa781']] as [number, number, string][]) {
  scene(stroke(line([[x, 222], [x, 222 + l]]), '#a52e2a', 1.2), sh(circle(x, 232 + l, 10), c), sh(rect(x - 4, 220 + l, 8, 4, 1), '#c9a54a'), sh(circle(x - 3, 229 + l, 3), '#ffffff', { opacity: 0.7 }));
}
target('star', 'Gold star ornament', place(starOrnament('#d9a93a'), { x: 1100, y: 232, s: 1 }));
// sill and plants
scene(sh(rect(WX0 - 30, WY1, WX1 - WX0 + 60, 24, 2), '#f4efe4'), sh(rect(WX0 - 24, WY1 + 24, WX1 - WX0 + 48, 10), '#d9d0c0'));
{
  // amaryllis
  scene(stroke(line([[970, 720], [966, 620]]) + line([[984, 720], [992, 640]]), '#5f9150', 4));
  for (const [x, y, n] of [[966, 616, 0], [992, 636, 1]] as [number, number, number][]) {
    let p = '';
    for (let k = 0; k < 5; k++) p += leaf(x, y, 26, 9, -90 + (k - 2) * 38 + n * 10);
    scene(sh(p, '#c9302c'), sh(circle(x, y, 5), '#f3c94f'));
  }
  scene(...place(leafClump(8, 5, 70, 8, '#5f9150', 70), { x: 976, y: 724 }), ...place(pot(56, 46, '#e9dcc4'), { x: 976, y: WY1 }), ...place(soil(56), { x: 976, y: 724 }));
  // lantern
  scene(sh(rect(1082, 690, 46, 70, 4), '#3f4347'), sh(rect(1088, 700, 34, 54, 2), '#fbe3a8', { opacity: 0.9 }), sh(poly([[1078, 690], [1132, 690], [1105, 666]]), '#3f4347'), stroke(curve([[1095, 666], [1105, 650], [1115, 666]]), '#3f4347', 2.4));
  scene(sh(rect(1099, 722, 12, 30, 2), '#f4ecd6'), sh(blob([[1105, 708], [1109, 716], [1105, 722], [1101, 716]], 0.9), '#f6c85a'));
}

// ================================================================= fireplace
scene(...bricks(330, 560, 540, 680, 7, 54, 22, 3, '#c4927a'));
// firebox opening
scene(sh(rect(440, 900, 320, 340) + sector(600, 902, 160, 180, 360), '#2f2420'));
scene(sh(rect(450, 910, 300, 330) + sector(600, 910, 150, 180, 360), `url(#${ID}-glow)`));
{
  // arch voussoirs
  let vs = '', vs2 = '';
  for (let i = 0; i < 13; i++) { const a0 = 180 + i * (180 / 13), d = sector(600, 902, 190, a0 + 0.8, a0 + 180 / 13 - 0.8, 162); if (i % 2) vs += d; else vs2 += d; }
  scene(sh(vs, '#b67e68'), sh(vs2, '#cf9c84'));
  scene(sh(rect(408, 900, 34, 340) + rect(758, 900, 34, 340), '#b98a74'));
  // back bricks inside
  let ib = '';
  for (let y = 920; y < 1100; y += 26) for (let x = 470 + (y % 52 ? 0 : 24); x < 730; x += 52) ib += rect(x, y, 46, 20, 2);
  scene(sh(ib, '#4a362c', { opacity: 0.7 }));
  // grate and logs
  scene(stroke(line([[480, 1210], [720, 1210]]) + line([[500, 1180], [500, 1226]]) + line([[700, 1180], [700, 1226]]) + line([[540, 1196], [540, 1214]]) + line([[660, 1196], [660, 1214]]), '#1f1a18', 6));
  const log = (x: number, y: number, w: number, rot: number) => place([sh(rect(-w / 2, -14, w, 28, 13), '#7a5434'), sh(rect(-w / 2, -14, w, 8, 4), '#9a6c44'), sh(ellipse(w / 2 - 4, 0, 9, 14), '#d9b48a'), stroke(ellipse(w / 2 - 4, 0, 5, 8), '#a37548', 1.4)], { x, y, rot });
  scene(...log(560, 1186, 170, -8), ...log(650, 1192, 160, 10), ...log(600, 1164, 150, 2));
  // flames
  scene(sh(blob([[500, 1180], [520, 1090], [550, 1130], [575, 1020], [610, 1110], [640, 1060], [665, 1130], [690, 1080], [710, 1180]], 0.8), '#e8833a'));
  scene(sh(blob([[530, 1180], [548, 1120], [570, 1146], [592, 1070], [618, 1140], [646, 1100], [670, 1180]], 0.8), '#f3b04a'));
  scene(sh(blob([[560, 1176], [576, 1140], [596, 1110], [614, 1150], [636, 1130], [646, 1176]], 0.8), '#fde08a'));
  let emb = '';
  const g = rng(2);
  for (let i = 0; i < 14; i++) emb += circle(g.range(500, 700), g.range(1000, 1100), g.range(1.4, 2.6));
  scene(sh(emb, '#fbd06a'), sh(ellipse(600, 1214, 120, 12), '#f3b04a', { opacity: 0.6 }));
}
// hearth
scene(sh(rect(280, 1236, 640, 44, 4), '#a9a39a'), sh(rect(280, 1236, 640, 8, 4), '#c9c3ba'), stroke(line([[440, 1244], [440, 1280]]) + line([[600, 1244], [600, 1280]]) + line([[760, 1244], [760, 1280]]), '#8f8980', 2));
// stacked logs on the right of the hearth, kettle on the left
{
  let ends = '', rings = '', bark = '';
  const pile: [number, number][] = [[800, 1220], [832, 1220], [864, 1220], [896, 1220], [816, 1194], [848, 1194], [880, 1194], [832, 1168], [864, 1168], [848, 1142]];
  for (const [x, y] of pile) { bark += circle(x, y, 16); ends += circle(x, y, 13); rings += circle(x, y, 8) + circle(x, y, 3.5); }
  scene(sh(bark, '#6e4a2e'), sh(ends, '#d9b48a'));
  scene(stroke(rings, '#a37548', 1.2));
  scene(sh(blob([[300, 1236], [296, 1196], [316, 1176], [360, 1176], [380, 1196], [376, 1236]], 0.7), '#3f4347'), sh(rect(316, 1166, 44, 12, 4), '#2f2a28'), sh(circle(338, 1160, 6), '#c9a54a'),
    stroke(curve([[304, 1190], [312, 1150], [338, 1140], [364, 1150], [372, 1190]]), '#2f2a28', 3), sh(poly([[378, 1210], [404, 1186], [408, 1192], [384, 1220]]), '#3f4347'), sh(ellipse(322, 1196, 6, 12), '#6a7378', { opacity: 0.7 }));
}
// mantel
scene(sh(rect(290, 520, 620, 36, 3), WOOD), sh(rect(290, 520, 620, 8, 3), WOOD_LT), sh(rect(300, 556, 600, 10), shade(WOOD, -0.35)));
scene(sh(poly([[330, 566], [370, 566], [362, 610], [338, 610]]) + poly([[830, 566], [870, 566], [862, 610], [838, 610]]), WOOD));

// mirror above the mantel
scene(sh(circle(600, 330, 158), '#c9a54a'), sh(circle(600, 330, 146), '#e0c06a'), sh(circle(600, 330, 134), `url(#${ID}-mirror)`));
scene(sh(rect(548, 236, 120, 190, 4), '#d6e0e2', { opacity: 0.7 }), sh(rect(556, 244, 50, 84) + rect(612, 244, 48, 84) + rect(556, 336, 50, 82) + rect(612, 336, 48, 82), '#eef3f5', { opacity: 0.8 }));
scene(sh(poly([[520, 230], [560, 210], [470, 440], [450, 400]]) + poly([[600, 200], [620, 205], [520, 460], [500, 450]]), '#ffffff', { opacity: 0.22 }));
{
  let beads = '';
  for (let i = 0; i < 36; i++) { const a = (i / 36) * Math.PI * 2; beads += circle(600 + Math.cos(a) * 152, 330 + Math.sin(a) * 152, 4); }
  scene(sh(beads, '#f0d88a'));
}
// mantel items (behind the garland)
{
  // pillar candles
  for (const [x, h, w] of [[330, 70, 30], [362, 50, 26], [800, 60, 30], [836, 84, 32]] as [number, number, number][]) {
    scene(sh(rect(x - w / 2, 520 - h, w, h, 4), '#f4ecd6'), sh(rect(x + w * 0.15, 520 - h, w * 0.35, h, 3), '#e2d6bc'), sh(ellipse(x, 520 - h, w / 2, 4), '#e8dcc2'));
    scene(stroke(line([[x, 520 - h], [x, 516 - h]]), '#3a3028', 1.4), sh(blob([[x, 498 - h], [x + 4, 508 - h], [x, 516 - h], [x - 4, 508 - h]], 0.9), '#f6c85a'), sh(ellipse(x, 506 - h, 10, 14), '#ffe9a8', { opacity: 0.25 }));
  }
  // mantel clock
  scene(sh(blob([[470, 520], [470, 470], [480, 440], [520, 430], [560, 440], [570, 470], [570, 520]], 0.6), '#7a5434'), sh(circle(520, 474, 30), '#c9a54a'), sh(circle(520, 474, 25), '#f8f2e4'));
  let ticks = '';
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; ticks += line([[520 + Math.cos(a) * 20, 474 + Math.sin(a) * 20], [520 + Math.cos(a) * 23, 474 + Math.sin(a) * 23]]); }
  scene(stroke(ticks, '#3a3028', 1.4), stroke(line([[520, 474], [520, 458]]) + line([[520, 474], [532, 480]]), '#3a3028', 2), sh(rect(462, 512, 116, 8, 2), '#5c3f24'));
  // little potted paperwhites
  scene(stroke(line([[640, 500], [636, 440]]) + line([[648, 500], [652, 430]]) + line([[656, 500], [664, 446]]), '#7fae5c', 2));
  for (const [x, y] of [[636, 440], [652, 430], [664, 446], [644, 452]] as Pt[]) scene(sh(blossomPath(x, y, 8, 6, 0.55), '#fffaf0'), sh(circle(x, y, 2.5), '#f3c94f'));
  scene(...place(pot(44, 30, '#9fb8c8'), { x: 648, y: 520 }));
  // photo frame
  scene(...place(framedPicture(52, 64, '#3f4347', 'land', 2), { x: 760, y: 486 }));
}
target('candlestick', 'Candlestick', place(candlestick(), { x: 420, y: 520, s: 0.95 }));
target('snowglobe', 'Snow globe', place(snowGlobe('#6e4a2e'), { x: 712, y: 520, s: 0.95 }));
// stockings
{
  const cols = ['#b5443e', '#8fa781', '#9fb8c8', '#c97a7a'];
  [380, 490, 710, 820].forEach((x, i) => scene(...place(stocking(cols[i], '#f6efe2', i + 2), { x, y: 560, s: 1.05, sx: i < 2 ? -1.05 : 1.05 })));
  // hooks
  scene(sh([380, 490, 710, 820].map((x) => rect(x - 4, 552, 8, 12, 2)).join(''), '#c9a54a'));
}
// garland along the mantel front
scene(...garland([[280, 600], [300, 540], [440, 560], [600, 548], [760, 560], [900, 540], [920, 610]], 11, 10, ['#c9302c', '#d9a93a', '#9fb8c8']));
target('pinecone', 'Pine cone', place(pineCone('#8a5a34'), { x: 640, y: 552, s: 0.9 }));
target('bell', 'Bell', place(jingleBell(), { x: 548, y: 560, s: 0.95 }));
target('candycane', 'Candy cane', place(candyCane(), { x: 880, y: 640, s: 0.9, rot: 8 }));
target('holly', 'Holly sprig', place(holly(1.15), { x: 476, y: 222, rot: -30 }));

// ================================================================= armchair with knitting
{
  const ch = '#b77a7a', chD = shade(ch, -0.16), chL = shade(ch, 0.14);
  scene(sh(blob([[40, 1120], [30, 880], [80, 810], [170, 790], [260, 810], [310, 880], [300, 1120]], 0.8), ch));
  let pat = '';
  for (let x = 60; x < 300; x += 30) pat += line([[x, 830], [x, 1100]]);
  scene(stroke(pat, chD, 3, { opacity: 0.45 }), stroke(curve([[60, 900], [170, 880], [280, 900]]), chL, 3, { opacity: 0.6 }));
  // tufting buttons
  scene(sh(circle(110, 900, 4) + circle(170, 890, 4) + circle(230, 900, 4) + circle(140, 980, 4) + circle(200, 980, 4), chD));
  // seat cushion
  scene(sh(rect(60, 1080, 230, 70, 20), chL), sh(rect(60, 1124, 230, 26, 12), ch));
  // arms
  scene(sh(rect(14, 990, 86, 220, 30), ch), sh(ellipse(57, 996, 46, 22), chL), sh(rect(250, 990, 86, 220, 30), ch), sh(ellipse(293, 996, 46, 22), chL));
  // skirt and legs
  scene(sh(rect(14, 1150, 322, 110, 8), chD), stroke(line([[14, 1190], [336, 1190]]), shade(ch, 0.2), 2.4), sh(rect(30, 1258, 18, 26, 3) + rect(300, 1258, 18, 26, 3), '#5c3f24'));
  let pl = '';
  for (let x = 30; x < 330; x += 22) pl += line([[x, 1194], [x, 1256]]);
  scene(stroke(pl, shade(ch, -0.3), 1.6, { opacity: 0.6 }));
  // patterned cushion
  scene(...place([sh(blob([[-60, -50], [60, -54], [56, 50], [-58, 52]], 0.5), '#e9dcc4'), sh(star(0, 0, 30, 14, 8), '#8fa781'), sh(star(0, 0, 14, 6, 8), '#c97a7a'), stroke(rect(-50, -44, 100, 88, 6), '#8fa781', 3)], { x: 170, y: 1010, rot: -6 }));
  // knitting draped over the right arm
  const kn: Shape[] = [sh(blob([[230, 980], [330, 972], [344, 1080], [320, 1100], [300, 1020], [236, 1030]], 0.5), '#8fa781')];
  let st = '';
  for (let y = 988; y < 1080; y += 9) for (let x = 240; x < 336; x += 10) if (y < 1030 || x > 300) st += line([[x - 3.5, y], [x, y + 5], [x + 3.5, y]]);
  kn.push(stroke(st, '#6f8a62', 1.1), stroke(line([[220, 960], [320, 1000]]) + line([[226, 952], [330, 990]]), '#c9a66b', 2.6), sh(circle(220, 960, 3) + circle(226, 952, 3), '#5c3f24'));
  scene(...kn);
}
target('mitten', 'Mitten', place(mitten('#c9302c', '#f6efe2'), { x: 66, y: 1000, s: 0.85, rot: -12 }));

// ================================================================= side table under the window
scene(sh(rect(930, 1000, 230, 18, 3), WOOD), sh(rect(944, 1018, 202, 30), shade(WOOD, -0.12)), sh(circle(1045, 1033, 4), '#c9a54a'), sh(rect(946, 1048, 14, 220, 3) + rect(1130, 1048, 14, 220, 3), shade(WOOD, -0.2)), sh(rect(952, 1180, 186, 10), shade(WOOD, -0.2)));
{
  // lamp
  scene(sh(blob([[1100, 1000], [1084, 990], [1088, 940], [1112, 940], [1116, 990], [1100, 1000]], 0.6), '#9fb8c8'), sh(rect(1096, 900, 8, 40), '#c9a54a'));
  scene(sh(poly([[1050, 900], [1150, 900], [1130, 830], [1070, 830]]), '#f2e2c4'), sh(poly([[1050, 900], [1150, 900], [1146, 886], [1054, 886]]), '#d9c59a'), sh(ellipse(1100, 920, 60, 14), '#ffe9a8', { opacity: 0.2 }));
  // books with glasses
  scene(...place(flatBook(90, 16, '#6f8f8a'), { x: 1040, y: 1000 }), ...place(flatBook(80, 14, '#c97a7a'), { x: 1046, y: 984 }));
  // plate of cookies
  scene(sh(ellipse(1000, 996, 46, 9), '#e9e3d6'), sh(ellipse(1000, 994, 38, 6), '#f6f2ea'), sh(circle(976, 990, 10) + circle(1024, 990, 10), '#c98a4a'), sh(circle(976, 988, 2) + circle(1022, 992, 2) + circle(1027, 987, 1.6), '#5c3f24'));
}
target('gingerbread', 'Gingerbread man', place(gingerbread(), { x: 1000, y: 976, s: 0.62, rot: 12 }));
target('mug', 'Mug of cocoa', place(mug('#8fa781', '#7a4a2a'), { x: 948, y: 1000, s: 0.85 }));

// ================================================================= fire tools and log basket
scene(sh(rect(904, 1150, 8, 120), '#2f2a28'), sh(ellipse(908, 1270, 22, 6), '#2f2a28'), stroke(line([[896, 1150], [920, 1150]]), '#2f2a28', 4));
scene(stroke(line([[898, 1152], [890, 1250]]), '#3f4347', 3), stroke(line([[918, 1152], [926, 1246]]), '#3f4347', 3), sh(poly([[920, 1236], [936, 1236], [940, 1262], [918, 1262]]), '#6e4a2e'), sh(circle(908, 1140, 6), '#c9a54a'));

// ================================================================= floor
scene(...floorboards(0, 1280, W, 220, '#9a7452', 61, 30));
scene(sh(rect(0, 1280, W, 6), '#5c4633'));
{
  // fair-isle rug
  scene(sh(rect(180, 1320, 860, 170, 10), '#e9dcc4'), sh(rect(180, 1320, 860, 22, 10) + rect(180, 1468, 860, 22, 10), '#b5443e'));
  let zz = '', dots = '', zz2 = '';
  for (let x = 196; x < 1024; x += 24) { zz += poly([[x, 1360], [x + 12, 1348], [x + 24, 1360], [x + 12, 1372]]); dots += circle(x + 12, 1410, 3); zz2 += poly([[x, 1450], [x + 12, 1438], [x + 24, 1450], [x + 12, 1462]]); }
  scene(sh(zz, '#8fa781'), sh(dots, '#c97a7a'), sh(zz2, '#9fb8c8'));
  let fr = '';
  for (let y = 1326; y < 1488; y += 8) fr += line([[172, y], [180, y]]) + line([[1040, y], [1048, y]]);
  scene(stroke(fr, '#d9c9ae', 2));
  // log basket
  scene(...place([
    sh(ellipse(0, -100, 34, 12), '#7a5434'), sh(ellipse(-30, -108, 14, 18, 20), '#9a6c44'), sh(ellipse(26, -104, 14, 18, -20), '#8a603c'),
    sh(ellipse(-30, -108, 8, 11, 20) + ellipse(26, -104, 8, 11, -20), '#d9b48a'),
    sh(ellipse(-4, -118, 13, 17, 5), '#7a5434'), sh(ellipse(-4, -118, 8, 11, 5), '#d9b48a'),
    sh(ellipse(46, -112, 12, 16, -30), '#8a603c'), sh(ellipse(46, -112, 7, 10, -30), '#e0c09a'),
    sh(ellipse(-50, -110, 12, 15, 30), '#7a5434'), sh(ellipse(-50, -110, 7, 9, 30), '#d9b48a'),
    sh(poly([[-70, -96], [70, -96], [56, 0], [-56, 0]]), '#b48a5a'),
  ], { x: 1100, y: 1480 }));
  let wv = '';
  for (let r = 0; r < 5; r++) for (let c = 0; c < 7; c++) wv += rect(1100 - 62 + c * 18 + (r % 2 ? 6 : 0) + r * 1.5, 1392 + r * 18, 12, 8, 3);
  scene(sh(wv, '#8a6a44'), sh(rect(1026, 1380, 148, 12, 5), '#c9a06a'));
  // yarn basket by the chair
  scene(sh(ellipse(150, 1380, 74, 16), '#7a5434'));
  for (const [x, y, c] of [[110, 1372, '#c97a7a'], [196, 1374, '#e9dcc4'], [150, 1366, '#8fa781']] as [number, number, string][]) scene(sh(circle(x, y, 22), c), stroke(curve([[x - 18, y - 6], [x, y + 4], [x + 18, y - 6]]) + curve([[x - 16, y + 8], [x, y - 2], [x + 16, y + 8]]), shade(c, -0.2), 1.2));
  scene(sh(poly([[76, 1380], [224, 1380], [206, 1460], [94, 1460]]), '#b48a5a'));
  let bw = '';
  for (let r = 0; r < 4; r++) bw += line([[80 + r * 3, 1396 + r * 18], [220 - r * 3, 1396 + r * 18]]);
  scene(stroke(bw, '#8a6a44', 4));
}
{
  // wrapped gifts by the side table
  const gift = (x: number, y: number, w: number, h: number, col: string, rib: string) => scene(
    sh(rect(x, y - h, w, h, 2), col), sh(rect(x + w * 0.65, y - h, w * 0.35, h, 2), shade(col, -0.12)),
    sh(rect(x + w / 2 - 4, y - h, 8, h) + rect(x, y - h / 2 - 4, w, 8), rib),
    sh(blob([[x + w / 2, y - h], [x + w / 2 - 16, y - h - 12], [x + w / 2 - 14, y - h + 2]], 0.8) + blob([[x + w / 2, y - h], [x + w / 2 + 16, y - h - 12], [x + w / 2 + 14, y - h + 2]], 0.8), rib),
  );
  gift(930, 1316, 70, 56, '#8fa781', '#f6efe2');
  gift(990, 1322, 56, 40, '#c97a7a', '#d9a93a');
  gift(944, 1262, 44, 36, '#9fb8c8', '#c9302c');
  // a row of little stars woven into the rug
  let rs = '';
  for (let x = 220; x < 1020; x += 60) rs += star(x, 1386, 7, 3, 8) + star(x + 30, 1430, 5, 2.2, 8);
  scene(sh(rs, '#b5443e', { opacity: 0.8 }));
  // cards standing on the mantel
  for (const [x, c, r] of [[598, '#c97a7a', -6], [772, '#8fa781', 8]] as [number, string, number][]) scene(...place([sh(rect(-14, -34, 28, 34, 1), '#f6efe2'), sh(rect(-10, -30, 20, 18), c), sh(star(0, -21, 5, 2.2), '#f6efe2')], { x, y: 520, rot: r }));
}
target('yarn', 'Blue yarn ball', place(yarnBall('#8fb3d6'), { x: 236, y: 1424, s: 0.85 }));
target('slipper', 'Slipper', place(slipper('#c97a7a', '#f6efe2'), { x: 330, y: 1474, s: 0.9, rot: -4 }));
scene(...place(sleepingDog('#d4a978', '#8a5a34'), { x: 640, y: 1430, s: 1.05 }));
target('bone', 'Dog bone', place(bone(), { x: 860, y: 1452, s: 0.85, rot: -18 }));
// scattered pine needles & a fallen sprig
{
  const g = rng(77);
  let nd = '';
  for (let i = 0; i < 18; i++) nd += leaf(g.range(300, 900), g.range(1286, 1310), 12, 2, g.range(-20, 20));
  scene(sh(nd, '#3d6b3c', { opacity: 0.8 }));
}

// ================================================================= warm light
scene(sh(ellipse(600, 1150, 520, 380), `url(#${ID}-warm)`, { opacity: 0.25 }));
scene(sh(rect(0, 0, W, H), `url(#${ID}-vignette)`, { opacity: 0.24 }));

const activity: FindActivity = {
  id: ID, version: 1, mode: 'find',
  title: 'Winter Hearth',
  blurb: 'A crackling fire, stockings on the mantel and a sleepy dog, while birds visit the frosty branch outside.',
  collectionId: 'blooms',
  categories: ['Winter', 'Cozy', 'Birds'],
  season: { from: '12-01', to: '02-28', label: 'winter' },
  difficulty: 'Moderate',
  width: W, height: H,
  defs:
    linearGradient(`${ID}-snowsky`, [[0, '#b9c9d8'], [0.6, '#dde6ee'], [1, '#eef2f5']]) +
    linearGradient(`${ID}-mirror`, [[0, '#dfe8ea'], [0.5, '#c9d6da'], [1, '#e6ddcc']], 0, 0, 1, 1) +
    `<radialGradient id="${ID}-glow" cx="0.5" cy="0.85" r="0.7"><stop offset="0" stop-color="#e8833a" stop-opacity="0.9"/><stop offset="0.5" stop-color="#8a3a22" stop-opacity="0.6"/><stop offset="1" stop-color="#2f2420" stop-opacity="0"/></radialGradient>` +
    `<radialGradient id="${ID}-warm"><stop offset="0" stop-color="#ffcf7a" stop-opacity="1"/><stop offset="1" stop-color="#ffcf7a" stop-opacity="0"/></radialGradient>` +
    `<radialGradient id="${ID}-vignette" cx="0.5" cy="0.45" r="0.75"><stop offset="0.7" stop-color="#2a1c18" stop-opacity="0"/><stop offset="1" stop-color="#2a1c18" stop-opacity="0.8"/></radialGradient>`,
  items,
};
export default activity;
void C;
