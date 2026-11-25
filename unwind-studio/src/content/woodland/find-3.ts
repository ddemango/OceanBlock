import { blob, circle, curve, ellipse, leaf, line, linearGradient, place, poly, radialGradient, rect, rng, sh, shade, stroke } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { FindActivity, FindItem } from '../types';
import {
  W as P, birdhouse, books, button, compass, feather, fern, foliage, grass, hammer, horseshoe, jar, key, lantern, logEnd, logPile,
  magnifier, mouse, oilCan, paintbrush, pencil, pinecone, planks, robin, shaving, snail, tin, toyDuck,
} from './props-find';

const WD = 1200, HT = 1500;
const ID = 'woodland-find-3';
const items: FindItem[] = [];
const scene = (...s: Shape[]) => { items.push({ shapes: s }); };
const target = (id: string, name: string, s: Shape[]) => { items.push({ id, name, target: true, shapes: s }); };

// ------------------------------------------------------------------ tool silhouettes (scenery)
function handSaw(len: number): Shape[] {
  let teeth = '';
  for (let x = -len / 2 + 30; x < len / 2 - 6; x += 7) teeth += poly([[x, 14], [x + 3.5, 20], [x + 7, 14]]);
  return [
    sh(poly([[-len / 2 + 30, -10], [len / 2, 6], [len / 2, 14], [-len / 2 + 30, 14]]), '#b9c2c8'), sh(teeth, '#8d979e'),
    sh(poly([[-len / 2 + 30, -10], [len / 2, 6], [len / 2, 9], [-len / 2 + 30, -4]]), '#e2e7ea', { opacity: 0.7 }),
    sh(blob([[-len / 2, -18], [-len / 2 + 34, -18], [-len / 2 + 38, 18], [-len / 2 + 4, 22], [-len / 2 - 4, 4]], 0.6), '#a0703e'),
    sh(ellipse(-len / 2 + 16, 0, 9, 6), '#5a3d24'),
    sh(circle(-len / 2 + 32, -6, 2) + circle(-len / 2 + 32, 8, 2), '#c29a3c'),
  ];
}
function chisel(len: number, col: string): Shape[] {
  return [sh(rect(-5, -len / 2, 10, len * 0.45, 4), col), sh(rect(-3, -len / 2, 3, len * 0.45, 1.5), shade(col, 0.25)), sh(rect(-5.5, -len * 0.06, 11, 5, 1), '#c29a3c'), sh(poly([[-3.5, -len * 0.04], [3.5, -len * 0.04], [4, len / 2 - 6], [0, len / 2], [-4, len / 2 - 6]]), '#9aa4aa')];
}
function mallet(): Shape[] {
  return [sh(rect(-4, -10, 8, 80, 4), '#c9955a'), sh(rect(-24, -34, 48, 28, 4), '#8a613c'), sh(rect(-24, -34, 48, 8, 4), '#a5754a'), stroke(line([[-16, -30], [-16, -8]]) + line([[16, -30], [16, -8]]), '#6b4a2f', 1.2)];
}
function trySquare(): Shape[] {
  return [sh(rect(-4, -6, 12, 70, 2), '#a0703e'), sh(rect(8, -6, 62, 8), '#b9c2c8'), stroke(line([[16, -6], [16, 0]]) + line([[26, -6], [26, -1]]) + line([[36, -6], [36, 0]]) + line([[46, -6], [46, -1]]) + line([[56, -6], [56, 0]]), '#5d666c', 1), sh(circle(2, 4, 2) + circle(2, 50, 2), '#c29a3c')];
}
function pliers(): Shape[] {
  return [sh(poly([[-3, 0], [-10, 56], [-4, 58], [2, 2]]), '#c8423a'), sh(poly([[3, 0], [10, 56], [4, 58], [-2, 2]]), '#a5352e'), sh(poly([[-4, 0], [-2, -26], [0, -28], [1, 0]]), '#7a858c'), sh(poly([[4, 0], [2, -26], [0, -28], [-1, 0]]), '#9aa4aa'), sh(circle(0, 0, 3.5), '#5d666c')];
}
function handDrill(): Shape[] {
  return [sh(rect(-3, -50, 6, 110, 2), '#7a858c'), sh(ellipse(0, -58, 10, 14), '#a0703e'), sh(circle(0, 0, 16), '#5d666c'), sh(circle(0, 0, 12), '#9aa4aa'), stroke(line([[0, 0], [22, -6]]), '#7a858c', 3), sh(ellipse(26, -8, 5, 9), '#a0703e'), sh(rect(-6, 58, 12, 10, 2), '#3d3a36')];
}
function clamp(): Shape[] {
  return [stroke(line([[0, -36], [0, 36]]) + line([[0, -36], [30, -36]]) + line([[0, 36], [30, 36]]), '#3f6e9a', 7), stroke(line([[26, -20], [26, 40]]), '#9aa4aa', 3), sh(rect(18, 40, 16, 14, 3), '#a0703e')];
}
function rope(): Shape[] {
  let d = '';
  for (let i = 0; i < 6; i++) d += ellipse(0, 30, 30 - i * 2, 34 - i * 2);
  return [stroke(d, '#c9a66b', 3.2), stroke(ellipse(0, 30, 28, 32), '#a5824a', 1.2), stroke(line([[0, -4], [0, 4]]), '#c9a66b', 5)];
}
function plane(): Shape[] {
  return [sh(poly([[-46, 0], [-42, -18], [46, -18], [48, 0]]), '#a0703e'), sh(poly([[-42, -18], [46, -18], [44, -14], [-40, -14]]), '#c9955a'), sh(blob([[18, -18], [12, -42], [26, -48], [38, -40], [32, -18]], 0.8), '#7a5333'), sh(poly([[-10, -18], [-4, -36], [6, -36], [2, -18]]), '#9aa4aa'), sh(circle(-24, -24, 8), '#7a5333')];
}
function paintPot(col: string): Shape[] {
  return [sh(rect(-18, -36, 36, 36, 3), '#9aa4aa'), sh(rect(-18, -26, 36, 16), shade(col, 0.1)), sh(ellipse(0, -36, 18, 5), col), stroke(curve([[-18, -34], [0, -56], [18, -34]]), '#5d666c', 1.6), sh(blob([[-14, -36], [-12, -24], [-8, -36]], 1), col)];
}
function ruler(len: number): Shape[] {
  let t = '';
  for (let x = -len / 2 + 6; x < len / 2; x += 6) t += line([[x, -4], [x, (Math.round(x) % 30 === 0 ? 2 : -1)]]);
  return [sh(rect(-len / 2, -5, len, 10, 1), '#e9c98e'), stroke(t, '#6b4a2f', 0.8)];
}

// ------------------------------------------------------------------ back wall
scene(...planks(0, 0, WD, 1220, 3, '#8a613c', false, 34));
// roof rafters and a cross beam
scene(sh(poly([[0, 0], [WD, 0], [WD, 40], [0, 40]]), '#4a3220'));
scene(sh(poly([[0, 40], [600, -10], [600, 10], [0, 70]]) + poly([[WD, 40], [600, -10], [600, 10], [WD, 70]]), '#5a3d26'));
scene(sh(rect(0, 120, WD, 34), '#5a3d26'), sh(rect(0, 120, WD, 7), '#7a5536'), sh(rect(0, 148, WD, 6), '#3e2a1a'), sh(circle(80, 137, 4) + circle(600, 137, 4) + circle(1120, 137, 4), '#2c1e12'));
// cobweb in the corner
{
  let web = '';
  for (let i = 0; i <= 5; i++) { const a = (i / 5) * (Math.PI / 2); web += line([[1196, 158], [1196 - Math.cos(a) * 90, 158 + Math.sin(a) * 90]]); }
  for (let r = 22; r <= 82; r += 20) { const pts: [number, number][] = []; for (let i = 0; i <= 5; i++) { const a = (i / 5) * (Math.PI / 2); pts.push([1196 - Math.cos(a) * (r - (i % 2) * 4), 158 + Math.sin(a) * (r - (i % 2) * 4)]); } web += curve(pts); }
  scene(stroke(web, '#f3ead2', 1, { opacity: 0.7 }));
}

// ------------------------------------------------------------------ window (centre left)
const WX = 380, WY = 190, WW = 250, WH = 250;
{
  scene(sh(rect(WX - 16, WY - 16, WW + 32, WH + 32, 3), '#5a3d26'));
  scene(sh(rect(WX, WY, WW, WH), `url(#${ID}-sky)`));
  for (let i = 0; i < 6; i++) scene(...place(foliage(30 + i, 90, 120, ['#4e6b38', '#5f8a45', '#6f8f4e'], 14), { x: WX + 10 + i * 48, y: WY + 170 + (i % 2) * 12, s: 0.9 }));
  scene(sh(rect(WX, WY + 196, WW, 54), '#7fa35a'));
  {
    const g = rng(37);
    let d = '';
    for (let i = 0; i < 24; i++) d += leaf(WX + g.range(4, WW - 4), WY + WH, g.range(10, 22), 2, -90 + g.range(-30, 30));
    scene(sh(d, '#5f8a45'));
  }
  scene(sh(rect(WX + WW / 2 - 6, WY, 12, WH), '#5a3d26'), sh(rect(WX, WY + WH / 2 - 6, WW, 12), '#5a3d26'));
  scene(sh(poly([[WX + 8, WY + 8], [WX + 70, WY + 8], [WX + 8, WY + 90]]), '#ffffff', { opacity: 0.18 }));
  scene(sh(rect(WX - 26, WY + WH + 8, WW + 52, 18, 2), '#a5754a'), sh(rect(WX - 26, WY + WH + 8, WW + 52, 5, 2), '#c08f5c'), sh(rect(WX - 20, WY + WH + 26, WW + 40, 6), '#5a3d26'));
}
const SILL = WY + WH + 8;
scene(...place(jar(30, 44, '#c4dce0', '#5a3d26'), { x: WX + 30, y: SILL }), stroke(line([[WX + 26, SILL - 34], [WX + 18, SILL - 70]]) + line([[WX + 34, SILL - 34], [WX + 40, SILL - 76]]), '#5f8a45', 1.6), sh(leaf(WX + 18, SILL - 70, 16, 5, -120) + leaf(WX + 40, SILL - 76, 16, 5, -60), '#6f8f4e'));
scene(...place(birdhouse(46, '#5f8a6a', '#b2523e'), { x: WX + 196, y: SILL }));
target('robin', 'Robin', place(robin(), { x: WX + 110, y: SILL, s: 0.62 }));
scene(sh(ellipse(WX + 150, SILL - 5, 10, 5) + ellipse(WX + 236, SILL - 4, 8, 4), '#c4bdae'));

// hanging lanterns from the beam
scene(stroke(line([[700, 154], [700, 200]]), '#2a2622', 2));
scene(...place(lantern(P.iron, true), { x: 700, y: 196, s: 0.9 }));

// pinned birdhouse plan, a bow saw and a leather apron on the wall below the window
{
  scene(sh(rect(420, 590, 150, 180, 2), '#f3ead2', { opacity: 1 }), sh(poly([[420, 590], [440, 590], [420, 612]]), '#d9cdb4'));
  scene(stroke(poly([[460, 700], [460, 650], [495, 620], [530, 650], [530, 700]]) + circle(495, 668, 10) + line([[440, 730], [550, 730]]) + line([[440, 744], [520, 744]]) + line([[444, 610], [444, 760]]) + line([[548, 616], [548, 704]]), '#3f6e9a', 1.6));
  scene(sh(circle(428, 598, 4) + circle(562, 598, 4), '#c8423a'));
  scene(stroke(curve([[600, 600], [640, 580], [720, 580], [760, 600]]), '#a0703e', 7), stroke(line([[600, 604], [760, 604]]), '#9aa4aa', 3), sh(circle(680, 576, 3), '#2a2622'));
  scene(stroke(curve([[630, 650], [630, 640], [636, 636]]), '#2a2622', 2.6), sh(blob([[610, 652], [652, 652], [664, 700], [668, 800], [600, 804], [602, 700]], 0.5), '#8a5a34'), sh(rect(612, 710, 48, 34, 3), '#7a4a2a'), stroke(curve([[612, 656], [596, 690], [590, 740]]) + curve([[652, 656], [672, 690], [682, 736]]), '#6b4024', 3), stroke(line([[618, 722], [654, 722]]), '#c9a66b', 2));
}

// ------------------------------------------------------------------ tool board (right)
const TX = 760, TY = 200, TW = 420, TH = 420;
scene(sh(rect(TX, TY, TW, TH, 3), '#c9a46a'), sh(rect(TX, TY, TW, 8), '#d9b98a'), stroke(rect(TX, TY, TW, TH, 3), '#6b4a2f', 6));
{
  let holes = '';
  for (let y = TY + 22; y < TY + TH - 10; y += 24) for (let x = TX + 18; x < TX + TW - 10; x += 24) holes += circle(x, y, 2.2);
  scene(sh(holes, '#8a6a45'));
  // painted outlines behind the tools
  scene(stroke(rect(TX + 30, TY + 30, 220, 60, 4) + rect(TX + 300, TY + 30, 90, 150, 4), '#e9dcc0', 2, { opacity: 0.6 }));
}
scene(...place(handSaw(220), { x: TX + 140, y: TY + 60 }));
scene(...place(handSaw(150), { x: TX + 110, y: TY + 140, rot: -4 }));
scene(...place(rope(), { x: TX + 346, y: TY + 40 }));
[0, 1, 2, 3, 4].forEach((i) => scene(...place(chisel(70 + i * 6, ['#a0703e', '#c8423a', '#a0703e', '#3f6e9a', '#a0703e'][i]), { x: TX + 40 + i * 26, y: TY + 240 })));
scene(...place(mallet(), { x: TX + 200, y: TY + 230 }));
scene(...place(pliers(), { x: TX + 330, y: TY + 200 }));
scene(...place(handDrill(), { x: TX + 380, y: TY + 260 }));
scene(...place(trySquare(), { x: TX + 30, y: TY + 320 }));
scene(...place(clamp(), { x: TX + 170, y: TY + 360 }));
scene(...place(clamp(), { x: TX + 215, y: TY + 360 }));
target('hammer', 'Hammer', place(hammer(), { x: TX + 290, y: TY + 330, s: 0.82, rot: 20 }));
scene(sh(circle(TX + 285, TY + 286, 3) + circle(TX + 40, TY + 225, 3) + circle(TX + 200, TY + 172, 3), '#3d3a36'));

// ------------------------------------------------------------------ shelves (left)
const SX = 24, SW = 320;
const SH = [250, 420, 590];
SH.forEach((y) => {
  scene(sh(rect(SX, y, SW, 14, 1), '#b8864f'), sh(rect(SX, y, SW, 4), '#d4a56c'), sh(rect(SX, y + 12, SW, 4), '#5a3d26'));
  scene(sh(poly([[SX + 20, y + 14], [SX + 26, y + 14], [SX + 26, y + 50], [SX + 60, y + 16], [SX + 60, y + 22], [SX + 30, y + 52], [SX + 20, y + 52]]) + poly([[SX + SW - 20, y + 14], [SX + SW - 26, y + 14], [SX + SW - 26, y + 50], [SX + SW - 60, y + 16], [SX + SW - 60, y + 22], [SX + SW - 30, y + 52], [SX + SW - 20, y + 52]]), '#3d3a36'));
});
// top shelf: jars of screws and nails, tins
{
  const y = SH[0];
  const fills = ['#9aa4aa', '#c29a3c', '#7a858c', '#b08454', '#d4a640'];
  [0, 1, 2, 3].forEach((i) => {
    scene(...place(jar(38, 52, fills[i], ['#b2523e', '#3f6e9a', '#5f8a6a', '#3d3a36'][i]), { x: SX + 40 + i * 46, y }));
    const g = rng(50 + i);
    let d = '';
    for (let k = 0; k < 10; k++) d += circle(SX + 40 + i * 46 + g.range(-12, 12), y - g.range(6, 34), g.range(1.2, 2.4));
    scene(sh(d, shade(fills[i], -0.35)));
  });
  scene(...place(tin(40, 40, '#3f6e9a'), { x: SX + 238, y }), ...place(tin(34, 30, '#b2523e', '#f2c84b'), { x: SX + 286, y }));
}
target('compass', 'Compass', place(compass(), { x: SX + 286, y: SH[0] - 54, s: 0.75 }));
// middle shelf: birdhouses, the toy duck, pine cone
scene(...place(birdhouse(60, '#c9955a', '#5f8a6a'), { x: SX + 60, y: SH[1] }), ...place(birdhouse(46, '#f3ead2', '#3f6e9a'), { x: SX + 140, y: SH[1] }));
scene(...place(books(4, 81, 70), { x: SX + 262, y: SH[1] }));
target('duck', 'Toy duck', place(toyDuck(), { x: SX + 214, y: SH[1], s: 0.8 }));
target('pinecone', 'Pine cone', place(pinecone(), { x: SX + 106, y: SH[1] - 14, s: 0.55, rot: 90 }));
// bottom shelf: paint tins, oil can, twine, more tins
scene(...place(paintPot('#3f6e9a'), { x: SX + 40, y: SH[2] }), ...place(paintPot('#b2523e'), { x: SX + 86, y: SH[2] }));
scene(...place(tin(46, 48, '#5f8a6a', '#e9d9b4'), { x: SX + 240, y: SH[2] }));
scene(sh(circle(SX + 292, SH[2] - 18, 18), '#c9a66b'), stroke(curve([[SX + 278, SH[2] - 24], [SX + 292, SH[2] - 14], [SX + 306, SH[2] - 24]]) + curve([[SX + 278, SH[2] - 14], [SX + 292, SH[2] - 4], [SX + 306, SH[2] - 14]]), '#a5824a', 1.4));
target('oilcan', 'Oil can', place(oilCan(), { x: SX + 160, y: SH[2], s: 0.95 }));
// feathers and keys hung on nails under the bottom shelf
scene(stroke(line([[SX + 190, SH[2] + 14], [SX + 310, SH[2] + 14]]), '#3d3a36', 3));
target('key', 'Brass key', place(key(), { x: SX + 250, y: SH[2] + 58, rot: 90, s: 0.75 }));
scene(...place(key('#7a858c'), { x: SX + 210, y: SH[2] + 52, rot: 90, s: 0.6 }), ...place(key('#6e6a64'), { x: SX + 290, y: SH[2] + 54, rot: 90, s: 0.65 }));
scene(sh(circle(SX + 250, SH[2] + 20, 2.5) + circle(SX + 210, SH[2] + 20, 2.5) + circle(SX + 290, SH[2] + 20, 2.5), '#2a2622'));

// ------------------------------------------------------------------ open door (left, lower)
const DX0 = 24, DX1 = 250, DY0 = 720, DY1 = 1220;
{
  scene(sh(rect(DX0 - 14, DY0 - 16, DX1 - DX0 + 28, DY1 - DY0 + 16), '#4a3220'));
  scene(sh(rect(DX0, DY0, DX1 - DX0, DY1 - DY0), `url(#${ID}-out)`));
  scene(...place(foliage(61, 260, 240, ['#4e6b38', '#5f8a45', '#6f8f4e', '#7fa35a'], 30), { x: DX0 + 110, y: DY0 + 230 }));
  scene(sh(rect(DX0, DY0 + 300, DX1 - DX0, DY1 - DY0 - 300), '#7fa35a'));
  scene(...place(fern(120, -110, '#8db35e', 71), { x: DX0 + 40, y: DY1 - 30 }), ...place(fern(110, -60, '#5f8a45', 72), { x: DX0 + 70, y: DY1 - 30 }), ...place(fern(100, -130, '#a9c96e', 73), { x: DX0 + 180, y: DY1 - 40 }));
  scene(...place(grass(1.2, '#5f8a45', 74), { x: DX0 + 130, y: DY1 - 50 }), ...place(grass(1, '#6f8f4e', 75), { x: DX0 + 200, y: DY1 - 20 }));
  // the door itself swung open into the shed
  scene(sh(poly([[DX1, DY0], [DX1 + 70, DY0 + 26], [DX1 + 70, DY1 - 10], [DX1, DY1]]), '#7a5333'));
  scene(stroke(line([[DX1 + 22, DY0 + 10], [DX1 + 22, DY1 - 4]]) + line([[DX1 + 46, DY0 + 18], [DX1 + 46, DY1 - 6]]), '#5a3d24', 2));
  scene(sh(poly([[DX1, DY0 + 80], [DX1 + 70, DY0 + 100], [DX1 + 70, DY0 + 112], [DX1, DY0 + 92]]) + poly([[DX1, DY1 - 100], [DX1 + 70, DY1 - 96], [DX1 + 70, DY1 - 84], [DX1, DY1 - 88]]), '#3d3a36'));
  // step stone
  scene(sh(rect(DX0 - 10, DY1 - 20, DX1 - DX0 + 20, 22, 4), '#9a9182'), sh(rect(DX0 - 10, DY1 - 20, DX1 - DX0 + 20, 6, 3), '#b6ae9e'));
}
target('horseshoe', 'Horseshoe', place(horseshoe(), { x: (DX0 + DX1) / 2, y: DY0 - 52, s: 0.9 }));
target('snail', 'Snail', place(snail('#b8864f'), { x: DX0 + 150, y: DY1 - 20, s: 0.6 }));

// ------------------------------------------------------------------ log pile (right) and things under the bench
{
  scene(sh(rect(900, 900, 300, 330), '#3e2a1a', { opacity: 0.4 }));
  scene(...place(logPile(5, 6, 30, 7), { x: 896, y: 1260 }));
}
target('mouse', 'Field mouse', place(mouse('#a88a6c'), { x: 1060, y: 948, s: 0.85 }));

// ------------------------------------------------------------------ workbench
const BT = 830;
{
  // legs and stretcher
  scene(sh(rect(320, BT + 40, 34, 380) + rect(840, BT + 40, 34, 380), '#7a5333'), sh(rect(340, BT + 40, 10, 380) + rect(860, BT + 40, 10, 380), '#5a3d26'));
  scene(sh(rect(320, BT + 300, 554, 24), '#6b4a2f'));
  // lower shelf: offcuts and a bucket
  scene(...place(logPile(7, 2, 22, 91), { x: 360, y: BT + 300 }));
  scene(sh(rect(560, BT + 190, 160, 24, 2), '#c9955a'), sh(rect(580, BT + 166, 120, 24, 2), '#b8864f'), sh(rect(600, BT + 142, 90, 24, 2), '#d4a56c'), ...place(logEnd(12, 93), { x: 560, y: BT + 202 }), ...place(logEnd(12, 94), { x: 580, y: BT + 178 }));
  scene(sh(poly([[740, BT + 300], [732, BT + 200], [820, BT + 200], [812, BT + 300]]), '#6e7880'), sh(ellipse(776, BT + 200, 44, 10), '#8d979e'), sh(ellipse(776, BT + 200, 38, 7), '#3d3a36'), stroke(line([[732, BT + 230], [820, BT + 230]]) + line([[736, BT + 270], [816, BT + 270]]), '#5a636a', 2));
  scene(stroke(line([[760, BT + 196], [748, BT + 150]]) + line([[780, BT + 196], [790, BT + 140]]) + line([[796, BT + 196], [812, BT + 160]]), '#d4a56c', 6));
  // top
  scene(...planks(280, BT, 900, 44, 101, '#c08f5c', true, 15));
  scene(sh(rect(280, BT + 44, 900, 10), '#5a3d26'));
  // vice on the left end
  scene(sh(rect(270, BT - 30, 26, 80, 2), '#7a5333'), sh(rect(250, BT - 20, 20, 60, 2), '#8a613c'), stroke(line([[210, BT + 10], [270, BT + 10]]), '#7a858c', 5), sh(circle(206, BT + 10, 6) + circle(274, BT + 10, 4), '#5d666c'), stroke(line([[206, BT - 10], [206, BT + 30]]), '#a0703e', 5));
}
// on the bench
{
  // birdhouse in progress
  scene(...place(birdhouse(90, '#d4a56c', '#a0703e'), { x: 470, y: BT + 4 }));
  scene(sh(poly([[540, BT], [640, BT - 6], [644, BT + 4], [544, BT + 10]]), '#e0b47c'), sh(poly([[560, BT - 14], [680, BT - 20], [682, BT - 10], [562, BT - 4]]), '#c99a5e'));
  scene(...place(plane(), { x: 740, y: BT + 6 }));
  scene(...place(ruler(160), { x: 900, y: BT + 20, rot: -3 }));
  scene(...place(paintPot('#5f8a6a'), { x: 1010, y: BT + 8 }), ...place(paintPot('#f2c84b'), { x: 1056, y: BT + 12 }));
  scene(...place(jar(40, 60, '#e9d9b4', '#3d3a36'), { x: 1130, y: BT + 6 }), stroke(line([[1120, BT - 50], [1112, BT - 100]]) + line([[1132, BT - 50], [1136, BT - 108]]) + line([[1142, BT - 50], [1152, BT - 96]]), '#a0703e', 4), sh(ellipse(1112, BT - 104, 4, 9) + ellipse(1152, BT - 100, 4, 8), '#3f6e9a'), sh(ellipse(1136, BT - 112, 4, 9), '#b2523e'));
  // a little spill of screws and buttons
  const g = rng(121);
  let sc = '', bt = '';
  for (let i = 0; i < 16; i++) sc += ellipse(960 + g.range(-40, 40), BT + 30 + g.range(-6, 8), 4, 1.6, g.range(0, 180));
  for (let i = 0; i < 6; i++) bt += circle(980 + g.range(-40, 40), BT + 32 + g.range(-6, 8), g.range(3, 5));
  scene(sh(sc, '#7a858c'), sh(bt, '#e9d9b4'), sh(circle(940, BT + 30, 4) + circle(1000, BT + 34, 3.5), '#c8423a'));
  // wood shavings
  [[600, BT + 30], [640, BT + 18], [680, BT + 34], [820, BT + 24], [520, BT + 32], [860, BT + 36], [700, BT + 22]].forEach(([x, y], i) => scene(...place(shaving(130 + i), { x, y })));
}
target('pencil', 'Pencil', place(pencil(), { x: 610, y: BT + 26, s: 0.8, rot: 6 }));
target('paintbrush', 'Paintbrush', place(paintbrush('#5f8a6a'), { x: 1080, y: BT - 50, s: 0.6, rot: 70 }));
target('button', 'Blue button', place(button('#3f6e9a'), { x: 1030, y: BT + 34, s: 0.7 }));
target('magnifier', 'Magnifying glass', place(magnifier(), { x: 380, y: BT + 24, s: 0.75, rot: -20 }));

// ------------------------------------------------------------------ floor
{
  scene(...planks(0, 1220, WD, 280, 141, '#8f6a45', true, 40));
  const g = rng(151);
  let dust = '';
  for (let i = 0; i < 26; i++) dust += ellipse(g.range(260, 1000), g.range(1240, 1480), g.range(10, 34), g.range(3, 8));
  scene(sh(dust, '#e9c98e', { opacity: 0.5 }));
  for (let i = 0; i < 12; i++) scene(...place(shaving(170 + i), { x: g.range(300, 1100), y: g.range(1260, 1480), rot: g.range(-30, 30) }));
  scene(sh(rect(0, 1220, WD, 30), '#2a1c18', { opacity: 0.25 }));
}
// chopping block and axe, saw horse
{
  scene(sh(ellipse(1050, 1440, 90, 20), '#2a1c18', { opacity: 0.3 }), sh(rect(970, 1330, 160, 110, 6), '#6b4a2f'), sh(rect(976, 1330, 30, 110), '#5a3d26'));
  scene(sh(ellipse(1050, 1330, 80, 22), '#d8b07a'), stroke(ellipse(1050, 1330, 60, 16) + ellipse(1050, 1330, 38, 10) + ellipse(1050, 1330, 16, 4), '#b08454', 1.4));
  scene(stroke(line([[1060, 1320], [1150, 1210]]), '#c9955a', 9), sh(poly([[1030, 1310], [1068, 1300], [1076, 1330], [1036, 1338]]), '#8d979e'), sh(poly([[1030, 1310], [1040, 1308], [1046, 1336], [1036, 1338]]), '#d3dade'));
  let ch = '';
  const g = rng(161);
  for (let i = 0; i < 10; i++) ch += poly([[0, 0], [10, -2], [8, 4]].map(([x, y]) => [x + g.range(880, 1180), y + g.range(1420, 1490)] as [number, number]));
  scene(sh(ch, '#d8b07a'));
  // saw horse with a plank
  scene(stroke(line([[300, 1460], [340, 1320]]) + line([[380, 1460], [340, 1320]]) + line([[600, 1460], [640, 1320]]) + line([[680, 1460], [640, 1320]]), '#7a5333', 10));
  scene(sh(rect(300, 1306, 400, 18, 2), '#a0703e'), sh(rect(260, 1290, 480, 18, 2), '#d4a56c'), sh(rect(260, 1290, 480, 5, 2), '#e9c98e'));
  scene(...place(handSaw(200), { x: 520, y: 1270, rot: -8, s: 0.9 }));
}
// broom, basket of kindling
scene(stroke(line([[860, 1000], [790, 1420]]), '#a5754a', 7), sh(blob([[770, 1390], [810, 1394], [826, 1490], [752, 1494]], 0.6), '#d9b46a'), stroke(line([[776, 1420], [770, 1490]]) + line([[792, 1420], [790, 1492]]) + line([[806, 1420], [810, 1490]]), '#a98242', 1.4));
{
  const s: Shape[] = [];
  const g = rng(181);
  for (let i = 0; i < 9; i++) s.push(stroke(line([[110 + i * 14, 1390], [100 + i * 16 + g.range(-10, 10), 1300 + g.range(-10, 10)]]), g.pick(['#a0703e', '#c9955a', '#7a5333']), 6));
  scene(...s);
  scene(sh(poly([[70, 1390], [250, 1390], [236, 1480], [84, 1480]]), '#b8864f'), stroke(line([[76, 1414], [244, 1414]]) + line([[80, 1440], [240, 1440]]) + line([[82, 1464], [238, 1464]]), '#8a6038', 3));
}
// toolbox under the saw horse, a crate of jars and a standing lantern
scene(sh(rect(410, 1404, 170, 62, 3), '#5f8a6a'), sh(rect(410, 1404, 170, 12, 3), '#7fa38a'), stroke(curve([[440, 1404], [495, 1360], [550, 1404]]), '#3d3a36', 5), sh(rect(480, 1426, 30, 14, 2), '#c29a3c'), sh(rect(430, 1390, 6, 20) + rect(456, 1384, 6, 24), '#9aa4aa'));
scene(sh(rect(850, 1400, 110, 80, 2), '#a0703e'), stroke(line([[850, 1426], [960, 1426]]) + line([[850, 1452], [960, 1452]]) + line([[860, 1400], [860, 1480]]) + line([[950, 1400], [950, 1480]]), '#7a5333', 3), ...place(jar(28, 40, '#c4944c', '#3d3a36'), { x: 878, y: 1404 }), ...place(jar(26, 34, '#a9483a', '#3d3a36'), { x: 912, y: 1404 }), ...place(jar(24, 30, '#5f8a45', '#3d3a36'), { x: 940, y: 1404 }));
scene(...place(lantern('#5f6a52', true), { x: 730, y: 1404, s: 0.8 }));
target('feather', 'Feather', place(feather('#c4945c', '#6b4a2f'), { x: 170, y: 1236, s: 0.7, rot: 8 }));

// ------------------------------------------------------------------ light
scene(sh(poly([[WX, WY], [WX + WW, WY], [900, 1500], [300, 1500]]), '#fff6d2', { opacity: 0.07 }));
scene(sh(rect(0, 0, WD, HT), `url(#${ID}-glow)`, { opacity: 0.2 }));
scene(sh(rect(0, 0, WD, HT), `url(#${ID}-vignette)`, { opacity: 0.25 }));

void blob;
const activity: FindActivity = {
  id: ID, version: 1, mode: 'find',
  title: "The Woodworker's Shed",
  blurb: 'A cluttered workbench, walls of tools and shelves of tins and jars, warmed by a lantern and the smell of sawdust.',
  collectionId: 'woodland',
  categories: ['Woodland', 'Interiors', 'Cozy'],
  difficulty: 'Detailed',
  width: WD, height: HT,
  defs:
    linearGradient(`${ID}-sky`, [[0, '#a9cfe0'], [1, '#e9eed6']]) +
    linearGradient(`${ID}-out`, [[0, '#cfe3d0'], [1, '#9ab874']]) +
    `<radialGradient id="${ID}-glow" cx="0.25" cy="0.15" r="0.6"><stop offset="0" stop-color="#ffcf7a" stop-opacity="1"/><stop offset="1" stop-color="#ffcf7a" stop-opacity="0"/></radialGradient>` +
    `<radialGradient id="${ID}-vignette" cx="0.5" cy="0.5" r="0.75"><stop offset="0.6" stop-color="#2a1c18" stop-opacity="0"/><stop offset="1" stop-color="#2a1c18" stop-opacity="1"/></radialGradient>`,
  items,
};
export default activity;
