import { blob, circle, curve, ellipse, leaf, line, linearGradient, place, poly, rect, rng, sh, shade, star, stroke, xf } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { PuzzleActivity } from '../types';
import {
  C, bookStack, bookcase, bookcaseFront, candle, frame, glowGradient, globe, grain, hourglass, ivy, jar, leafy, ribbon, shelfRow,
  steam, succulent, teacup, teapot, vase, vignetteGradient, box, type Seg,
} from './props';

const ID = 'library-puzzle';
const r = rng(4711);
const S: Shape[] = [];
const add = (...xs: (Shape | Shape[])[]) => { for (const x of xs) Array.isArray(x) ? S.push(...x) : S.push(x); };
const at = (shapes: Shape[], x: number, y: number, s = 1, rot = 0) => place(shapes, { x, y, s, rot });

// ------------------------------------------------------------ wall & wallpaper
add(sh(rect(0, 0, 1200, 880), `url(#${ID}-wall)`));
for (let x = 440, i = 0; x < 990; x += 34, i++) if (i % 2) add(sh(rect(x, 26, 34, 630), '#ffffff', { opacity: 0.045 }));
for (let row = 0, y = 52; y < 640; y += 40, row++) {
  for (let x = 457 + (row % 2) * 25.5; x < 985; x += 51) {
    if (x > 600 && x < 920 && y > 70 && y < 560) continue;
    add(sh(star(x, y, 10, 3.6, 4, 45), '#d0b060', { opacity: 0.6 }));
    if (row % 2) add(stroke(circle(x, y, 13), '#7fa88a', 1, { opacity: 0.4 }));
    add(sh(leaf(x, y + 11, 13, 4, 90), '#7fa88a', { opacity: 0.6 }));
    add(sh(circle(x, y, 2.2), '#f1e6cf', { opacity: 0.7 }));
  }
}
// cornice
add(sh(rect(0, 0, 1200, 30), '#e7dabb'), sh(rect(0, 24, 1200, 6), '#b9a780'), sh(rect(0, 0, 1200, 5), '#f6eed8'));
for (let x = 442; x < 990; x += 22) add(sh(rect(x, 10, 12, 10, 1), '#cdbd97'));

// wainscot
add(sh(rect(430, 650, 570, 230), '#5d3a24'));
add(sh(rect(430, 644, 570, 14, 2), '#8a5a36'), sh(rect(430, 644, 570, 4), '#a97a4c'));
for (let x = 446; x < 990; x += 108) {
  add(sh(rect(x, 676, 92, 150, 3), '#6f4529'), sh(rect(x + 6, 682, 80, 138, 2), '#7c5031'));
  add(sh(rect(x, 676, 92, 3), '#3d2415', { opacity: 0.7 }), sh(rect(x, 823, 92, 3), '#a97a4c', { opacity: 0.7 }));
  add(grain(x + 8, 686, 76, 130, r, '#4b2c18', 5, 0.45));
}
add(sh(rect(0, 846, 1200, 34), '#4a2c1a'), sh(rect(0, 846, 1200, 4), '#8a5a36'));

// ------------------------------------------------------------ window with evening rain
const WX = 620, WY = 92, WW = 280, WH = 440;
add(sh(rect(WX - 18, WY - 18, WW + 36, WH + 36, 4), '#e9dcbc'));
add(sh(rect(WX - 18, WY - 18, WW + 36, 5, 2), '#f8f0da'), sh(rect(WX - 6, WY - 6, WW + 12, WH + 12), '#b5a47c'));
add(sh(rect(WX, WY, WW, WH), `url(#${ID}-sky)`));
// clouds
for (let i = 0; i < 7; i++) {
  const cx = WX + r.range(20, WW - 20), cy = WY + 30 + i * 34 + r.range(-8, 8), w = r.range(70, 130);
  add(sh(blob([[cx - w, cy], [cx - w * 0.5, cy - 14], [cx, cy - 9], [cx + w * 0.5, cy - 16], [cx + w, cy], [cx + w * 0.4, cy + 9], [cx - w * 0.4, cy + 8]], 1), i < 4 ? '#22344e' : '#8a6f86', { opacity: 0.45 }));
}
// far hills & roofs
add(sh(blob([[WX, WY + 330], [WX + 60, WY + 300], [WX + 140, WY + 318], [WX + 220, WY + 292], [WX + WW, WY + 312], [WX + WW, WY + WH], [WX, WY + WH]], 0.8), '#3b4763'));
const roof = '#232c40';
const houses: [number, number, number][] = [[4, 54, 96], [58, 62, 124], [122, 50, 88], [174, 58, 112], [232, 48, 80]];
for (const [hx, hw, hh] of houses) {
  const x = WX + hx, top = WY + WH - hh;
  add(sh(poly([[x, WY + WH], [x, top], [x + hw / 2, top - 26], [x + hw, top], [x + hw, WY + WH]]), roof));
  add(sh(rect(x + hw * 0.66, top - 30, 9, 26), roof));
  add(sh(poly([[x, top], [x + hw / 2, top - 26], [x + hw / 2 + 3, top - 24], [x + 4, top + 2]]), '#4a5674', { opacity: 0.7 }));
  for (let k = 0; k < 2; k++) {
    const lit = r.next() < 0.7;
    add(sh(rect(x + hw * (0.2 + k * 0.42), top + 14 + r.range(0, 10), 10, 14, 1), lit ? '#f6c768' : '#3a4763'));
    if (lit && hh > 100) add(sh(rect(x + hw * (0.2 + k * 0.42), top + 50, 10, 14, 1), r.next() < 0.5 ? '#f6c768' : '#e79a52'));
  }
}
// bare tree
add(stroke(curve([[WX + 44, WY + WH], [WX + 48, WY + 380], [WX + 40, WY + 320]]), '#141a26', 7));
for (const [dx, dy, len] of [[-34, -60, 0], [24, -70, 0], [-10, -96, 0], [40, -30, 0], [-40, -20, 0]] as [number, number, number][]) {
  add(stroke(curve([[WX + 43, WY + 350 + len], [WX + 43 + dx * 0.5, WY + 345 + dy * 0.4], [WX + 43 + dx, WY + 340 + dy]]), '#141a26', 3));
  add(stroke(line([[WX + 43 + dx * 0.6, WY + 343 + dy * 0.55], [WX + 43 + dx * 0.6 + dy * 0.2, WY + 330 + dy * 0.8]]), '#141a26', 1.6));
}
// street lamp glow outside
add(sh(circle(WX + 206, WY + 300, 44), '#f9d98a', { opacity: 0.18 }), sh(circle(WX + 206, WY + 300, 7), '#fbe7ad'));
add(sh(rect(WX + 204, WY + 304, 4, 140), '#141a26'), sh(rect(WX + 196, WY + 288, 20, 5, 2), '#141a26'));
// rain
for (let i = 0; i < 95; i++) {
  const x = WX + r.range(8, WW - 4), y = WY + r.range(4, WH - 30), l = r.range(12, 26);
  add(stroke(line([[x, y], [x - l * 0.28, y + l]]), '#dce9f2', r.range(0.9, 1.6), { opacity: r.range(0.25, 0.6) }));
}
for (let i = 0; i < 22; i++) {
  const x = WX + r.range(10, WW - 10), y = WY + r.range(10, WH - 10), s = r.range(2, 4.2);
  add(sh(blob([[x, y - s * 1.6], [x + s, y], [x, y + s], [x - s, y]], 1), '#e6f1f6', { opacity: 0.55 }));
  if (i % 3 === 0) add(stroke(line([[x, y - s * 1.6], [x + 1, y - s * 1.6 - r.range(14, 40)]]), '#e6f1f6', 1, { opacity: 0.3 }));
}
add(sh(rect(WX, WY, WW, WH), '#f0b04a', { opacity: 0.06 }));
// glazing bars
const bar = '#e9dcbc';
add(sh(rect(WX + WW / 2 - 6, WY, 12, WH), bar), sh(rect(WX + WW / 2 + 3, WY, 3, WH), '#b5a47c'));
for (const fy of [0.34, 0.67]) add(sh(rect(WX, WY + WH * fy - 5, WW, 10), bar), sh(rect(WX, WY + WH * fy + 3, WW, 2.5), '#b5a47c'));
add(sh(rect(WX, WY, WW, 5), '#000000', { opacity: 0.25 }), sh(rect(WX, WY, 5, WH), '#000000', { opacity: 0.2 }));
// sill
add(sh(rect(WX - 34, WY + WH + 16, WW + 68, 20, 3), '#efe3c6'), sh(rect(WX - 34, WY + WH + 16, WW + 68, 5, 2), '#fbf5e4'));
add(sh(rect(WX - 26, WY + WH + 36, WW + 52, 9), '#000000', { opacity: 0.28 }));
add(at(succulent(C.rose, C.sage), WX + 34, WY + WH + 16, 1.1));
add(at(candle(), WX + WW - 30, WY + WH + 17, 0.72));
{
  const st = bookStack(WX + WW - 96, WY + WH + 16, 78, 3, r, [9, 13]);
  add(st.shapes);
}
add(at(vase(C.teal, 46), WX + 100, WY + WH + 16));
for (let i = 0; i < 5; i++) add(stroke(curve([[WX + 100, WY + WH - 30], [WX + 100 + (i - 2) * 9, WY + WH - 62], [WX + 100 + (i - 2) * 16, WY + WH - 84 - (i % 2) * 10]]), C.leaf, 1.6), sh(circle(WX + 100 + (i - 2) * 16, WY + WH - 86 - (i % 2) * 10, 5), i % 2 ? C.mustard : C.rose));

// curtains
function curtain(): Shape[] {
  const out: Shape[] = [];
  const base = '#8f3a36';
  out.push(sh(blob([[556, 70], [652, 70], [650, 200], [634, 330], [606, 418], [632, 520], [646, 668], [554, 668], [560, 520], [566, 418], [556, 250]], 0.55), base));
  const folds: [number, number, number, string, number][] = [[566, 578, 562, shade(base, -0.3), 9], [584, 584, 580, shade(base, 0.16), 8], [602, 590, 600, shade(base, -0.24), 9], [620, 596, 618, shade(base, 0.12), 7], [638, 601, 636, shade(base, -0.28), 8]];
  for (const [x0, x1, x2, col, w] of folds) {
    out.push(sh(ribbon([[x0, 74], [x0 - 1, 240], [x1, 416]], w), col, { opacity: 0.75 }));
    out.push(sh(ribbon([[x1, 424], [(x1 + x2) / 2, 540], [x2, 664]], w + 2), col, { opacity: 0.75 }));
  }
  // hem band and tie-back
  out.push(sh(ribbon([[554, 648], [600, 652], [646, 648]], 9), C.mustard), sh(ribbon([[554, 660], [600, 664], [646, 660]], 3), '#e6c878'));
  out.push(sh(ribbon([[562, 412], [588, 424], [612, 412]], 13), C.mustard), sh(ribbon([[562, 412], [588, 424], [612, 412]], 4), '#e6c878'));
  out.push(stroke(curve([[612, 414], [622, 440], [618, 462]]), C.mustard, 3), sh(blob([[612, 460], [624, 460], [627, 488], [609, 488]], 0.6), C.mustard));
  for (let k = 0; k < 4; k++) out.push(stroke(line([[612 + k * 4, 470], [611 + k * 4.5, 488]]), '#8f6a24', 1));
  // rings
  for (let x = 566; x < 650; x += 20) out.push(stroke(circle(x, 66, 6.5), C.brassDark, 2.5));
  return out;
}
const cur = curtain();
add(cur, cur.map((s) => ({ ...s, d: xf(s.d, { sx: -1, ox: WX + WW / 2 }) })));
add(sh(rect(540, 56, 440, 8, 4), C.brass), sh(rect(540, 56, 440, 2.5, 1), C.brassLight));
add(sh(circle(538, 60, 10), C.brass), sh(circle(982, 60, 10), C.brass), sh(circle(535, 57, 3.5), C.brassLight), sh(circle(979, 57, 3.5), C.brassLight));

// ------------------------------------------------------------ floor
add(sh(rect(0, 880, 1200, 320), `url(#${ID}-floor)`));
{
  const rows = [880, 902, 928, 960, 998, 1044, 1098, 1160, 1200];
  const woods = ['#8a5a36', '#7e5130', '#96643c', '#855634', '#a06c42', '#754a2c'];
  for (let i = 0; i < rows.length - 1; i++) {
    const y0 = rows[i], y1 = rows[i + 1];
    let x = -r.range(0, 160);
    while (x < 1200) {
      const w = r.range(170, 330) * (0.6 + i * 0.09);
      const col = r.pick(woods);
      add(sh(rect(Math.max(0, x), y0, Math.min(1200, x + w) - Math.max(0, x), y1 - y0), col));
      add(grain(Math.max(0, x), y0, Math.min(1200, x + w) - Math.max(0, x), y1 - y0, r, shade(col, -0.35), 2 + i, 0.4));
      add(sh(rect(Math.max(0, x), y0, 1.6, y1 - y0), '#3a2416', { opacity: 0.7 }));
      x += w;
    }
    add(sh(rect(0, y0, 1200, 1.8), '#3a2416', { opacity: 0.75 }), sh(rect(0, y0 + 1.8, 1200, 1.5), '#c59a68', { opacity: 0.25 }));
  }
}

// ------------------------------------------------------------ bookcases
function fillCase(x: number, y: number, w: number, h: number, rows: Seg[][], seed: number): void {
  const rr = rng(seed);
  const bc = bookcase(x, y, w, h, rows.length);
  add(bc.shapes);
  bc.cells.forEach((c, i) => add(shelfRow(c.x0, c.x1, c.baseY, c.h, rr, rows[i])));
  add(bookcaseFront(x, y, w, h, rows.length));
}
const P = (w: number, f: (rr: typeof r) => Shape[], s = 1): Seg => ({ w, make: (cx, by) => at(f(r), cx, by, s) });
fillCase(14, 36, 426, 846, [
  [0, P(84, (q) => frame(64, 82, q, C.brassDark)), 0],
  [0, { stack: 92, n: 4, top: (cx, y) => at(candle(), cx, y, 0.6) }, 0],
  [120, P(82, () => globe(), 0.82), 0],
  [0, P(70, (q) => jar(30, 50, C.mustard, q)), 120],
  [0, { stack: 96, n: 5 }, 0, P(64, () => hourglass()), 60],
  [0, P(90, (q) => box(70, 60, C.blueDark, q)), 0],
], 91);
fillCase(986, 36, 236, 846, [
  [0, P(60, () => vase(C.rose, 62))],
  [P(66, (q) => frame(52, 70, q, C.woodDark)), 0],
  [0, { stack: 76, n: 4 }],
  [0, P(56, () => hourglass(), 0.9), 50],
  [P(70, (q) => jar(34, 58, '#b9683f', q)), 0],
  [0, P(74, (q) => box(60, 50, C.red, q))],
], 177);
add(at(ivy(rng(5), 150, 46, 34, C.cream), 1092, 36 - 4 + 20, 1.05));
add(at(ivy(rng(8), 120, 40, 30, C.rose), 96, 52, 1));
// warm light catching the left case
add(sh(rect(14, 36, 426, 846), `url(#${ID}-caselight)`));

// ------------------------------------------------------------ rug
{
  const cx = 770, cy = 1078, rx = 410, ry = 108;
  const E = (f: number) => ellipse(cx, cy, rx * f, ry * f);
  add(sh(ellipse(cx, cy + 6, rx + 4, ry + 4), '#000000', { opacity: 0.25 }));
  add(sh(E(1), '#5e2320'), sh(E(0.97), C.red), sh(E(0.9), C.mustard), sh(E(0.875), C.cream));
  for (let i = 0; i < 44; i++) {
    const a0 = (i / 44) * Math.PI * 2, d = Math.PI / 44;
    const p = (a: number, f: number): [number, number] => [cx + Math.cos(a) * rx * f, cy + Math.sin(a) * ry * f];
    add(sh(poly([p(a0 - d * 0.8, 0.72), p(a0 + d * 0.8, 0.72), p(a0, 0.86)]), i % 2 ? C.green : C.brick));
  }
  add(sh(E(0.71), C.mustard), sh(E(0.69), C.blueDark), sh(E(0.66), C.blue));
  for (let i = 0; i < 20; i++) {
    const a = ((i + 0.5) / 20) * Math.PI * 2;
    add(sh(ellipse(cx + Math.cos(a) * rx * 0.57, cy + Math.sin(a) * ry * 0.57, 9, 4), C.cream), sh(ellipse(cx + Math.cos(a) * rx * 0.57, cy + Math.sin(a) * ry * 0.57, 4, 1.8), C.red));
  }
  add(sh(E(0.47), C.cream), sh(E(0.45), C.blueDark));
  const sy = ry / rx;
  add(place([sh(star(0, 0, 175, 95, 12, 0), C.red), sh(star(0, 0, 140, 62, 12, 15), C.mustard), sh(star(0, 0, 92, 44, 8, 0), C.cream), sh(circle(0, 0, 34), C.green), sh(circle(0, 0, 16), C.mustard)], { sx: 1, sy, x: cx, y: cy }));
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI, f = 1.0;
    add(stroke(line([[cx + Math.cos(a) * rx * f, cy + Math.sin(a) * ry * f], [cx + Math.cos(a) * (rx + 9), cy + Math.sin(a) * (ry + 9)]]), '#e6d6b4', 2, { opacity: 0.8 }));
  }
}

// ------------------------------------------------------------ floor lamp
{
  const lx = 452;
  add(sh(ellipse(lx, 912, 46, 9), '#000000', { opacity: 0.3 }));
  add(sh(ellipse(lx, 907, 34, 9), C.brassDark), sh(ellipse(lx, 903, 30, 7.5), C.brass), sh(ellipse(lx - 8, 901, 12, 2.5), C.brassLight, { opacity: 0.7 }));
  add(sh(rect(lx - 4, 430, 8, 472), C.brass), sh(rect(lx - 4, 430, 2.5, 472), C.brassLight), sh(rect(lx + 2, 430, 2, 472), C.brassDark));
  for (const y of [520, 700, 880]) add(sh(ellipse(lx, y, 7.5, 4.5), C.brassDark), sh(ellipse(lx, y - 1.5, 7, 3.2), C.brassLight));
  add(sh(poly([[lx - 34, 322], [lx + 34, 322], [lx + 68, 436], [lx - 68, 436]]), `url(#${ID}-shade)`));
  for (let i = -4; i <= 4; i++) add(stroke(line([[lx + i * 7.5, 324], [lx + i * 15, 434]]), '#b9742a', 1.2, { opacity: 0.35 }));
  add(sh(poly([[lx - 35, 320], [lx + 35, 320], [lx + 37, 328], [lx - 37, 328]]), '#a8642a'), sh(poly([[lx - 66, 428], [lx + 66, 428], [lx + 69, 438], [lx - 69, 438]]), '#a8642a'));
  for (let x = lx - 64; x < lx + 66; x += 9) add(sh(circle(x + 3, 441, 2.6), C.mustard));
  add(stroke(line([[lx + 22, 438], [lx + 22, 478]]), C.brassDark, 1.5), sh(circle(lx + 22, 481, 4), C.brass));
}

// ------------------------------------------------------------ big plant
add(sh(ellipse(118, 1160, 92, 16), '#000000', { opacity: 0.32 }));
add(at(leafy(rng(31), 140, 74, 58, C.blueDark, 17), 118, 1158, 1.9));
// band on pot
add(sh(ribbon([[58, 1082], [118, 1088], [178, 1082]], 9), C.cream), sh(ribbon([[60, 1098], [118, 1104], [176, 1098]], 3), C.mustard));

// ------------------------------------------------------------ armchair
{
  const body = '#a4483b', dk = shade(body, -0.28), lt = shade(body, 0.16);
  add(sh(ellipse(770, 968, 200, 22), '#000000', { opacity: 0.35 }));
  // legs
  for (const x of [628, 912]) add(sh(poly([[x - 10, 918], [x + 10, 918], [x + 6, 966], [x - 6, 966]]), C.woodDark), sh(rect(x - 6, 960, 12, 6, 2), C.brass));
  // back
  add(sh(blob([[648, 810], [638, 660], [656, 596], [716, 572], [824, 572], [884, 596], [902, 660], [892, 810]], 0.8), dk));
  add(sh(blob([[660, 806], [652, 664], [668, 608], [720, 586], [820, 586], [872, 608], [888, 664], [880, 806]], 0.8), body));
  add(sh(blob([[672, 660], [684, 616], [724, 598], [770, 594], [760, 606], [712, 618], [690, 640]], 0.9), lt, { opacity: 0.55 }));
  // tufting
  const btn: [number, number][] = [];
  for (let row = 0; row < 3; row++) for (let k = 0; k < (row % 2 ? 3 : 4); k++) btn.push([770 + (k - (row % 2 ? 1 : 1.5)) * 52, 632 + row * 48]);
  for (const [bx, by] of btn) {
    add(stroke(line([[bx - 26, by + 24], [bx, by], [bx + 26, by + 24]]), dk, 1.6, { opacity: 0.6 }), stroke(line([[bx - 26, by - 24], [bx, by], [bx + 26, by - 24]]), dk, 1.6, { opacity: 0.6 }));
    add(sh(circle(bx, by, 4.2), dk), sh(circle(bx - 1, by - 1, 1.6), lt));
  }
  // seat cushion
  add(sh(rect(664, 786, 212, 56, 18), lt), sh(rect(664, 812, 212, 30, 14), body), sh(rect(676, 790, 188, 8, 4), '#ffffff', { opacity: 0.16 }));
  add(stroke(line([[672, 812], [868, 812]]), dk, 1.6, { opacity: 0.7 }));
  // skirt
  add(sh(rect(640, 838, 260, 82, 6), body), sh(rect(640, 838, 260, 14), dk, { opacity: 0.5 }), sh(rect(640, 906, 260, 14, 5), dk));
  for (let x = 662; x < 900; x += 26) add(stroke(line([[x, 852], [x, 906]]), dk, 1.3, { opacity: 0.35 }));
  // arms
  for (const sx of [1, -1]) {
    const m = (shapes: Shape[]) => (sx === 1 ? shapes : shapes.map((s) => ({ ...s, d: xf(s.d, { sx: -1, ox: 770 }) })));
    add(m([
      sh(blob([[604, 724], [612, 700], [640, 688], [668, 700], [676, 724], [674, 918], [606, 918]], 0.7), body),
      sh(rect(606, 760, 14, 158), lt, { opacity: 0.4 }),
      sh(rect(660, 760, 14, 158), dk, { opacity: 0.55 }),
      sh(circle(640, 724, 35), lt),
      stroke(circle(640, 724, 35), dk, 2),
      stroke(circle(640, 724, 22), dk, 1.4, { opacity: 0.45 }),
      sh(ellipse(630, 712, 12, 7, -35), '#ffffff', { opacity: 0.14 }),
      sh(circle(640, 724, 4), dk),
      sh(rect(606, 908, 70, 10, 4), dk),
    ]));
  }
  // cushion
  add(place([
    sh(rect(-52, -52, 104, 104, 16), '#000000', { opacity: 0.2 }),
  ], { x: 722, y: 752, rot: -9 }));
  add(place([
    sh(rect(-50, -50, 100, 100, 16), C.cream),
    sh(rect(-50, 10, 100, 40, 14), '#d9caa6', { opacity: 0.7 }),
    stroke(rect(-40, -40, 80, 80, 10), C.mustard, 3),
    sh(poly([[0, -30], [30, 0], [0, 30], [-30, 0]]), C.green),
    sh(poly([[0, -17], [17, 0], [0, 17], [-17, 0]]), C.mustard),
    sh(circle(0, 0, 5), C.cream),
    ...[[-30, -30], [30, -30], [30, 30], [-30, 30]].map(([x, y]) => sh(circle(x, y, 4), C.brick)),
    ...[[-50, -50], [50, -50], [50, 50], [-50, 50]].map(([x, y]) => sh(circle(x * 0.96, y * 0.96, 6), C.mustard)),
  ], { x: 720, y: 748, rot: -9 }));
  // throw blanket
  const tb = C.blue;
  add(sh(blob([[836, 570], [884, 580], [926, 640], [946, 720], [950, 820], [938, 884], [872, 892], [870, 800], [862, 700], [836, 630]], 0.8), tb));
  add(sh(ribbon([[870, 600], [900, 700], [906, 800], [900, 886]], 16), shade(tb, -0.22), { opacity: 0.6 }));
  add(sh(ribbon([[850, 600], [878, 700], [884, 800], [880, 888]], 7), shade(tb, 0.25), { opacity: 0.6 }));
  for (const [y0, y1] of [[628, 650], [704, 716], [782, 790], [848, 852]]) {
    const x0 = y0 < 660 ? 842 : y0 < 730 ? 862 : 870, x1 = y0 < 660 ? 928 : y0 < 730 ? 946 : 950;
    add(sh(ribbon([[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2 + 4], [x1, y1]], 12), C.cream), sh(ribbon([[x0, y0 + 13], [(x0 + x1) / 2, (y0 + y1) / 2 + 17], [x1, y1 + 13]], 4), C.mustard));
  }
  for (let x = 874; x < 940; x += 6) add(stroke(line([[x, 888 - (x - 874) * 0.06], [x + r.range(-2, 2), 908 - (x - 874) * 0.06]]), C.cream, 2));
  // closed book resting on the left arm
  add(place([sh(rect(-34, -9, 68, 14, 2), C.greenDark), sh(rect(-30, -6, 62, 8), C.paper), sh(rect(-34, -11, 68, 5, 2), C.green), sh(rect(-34, -11, 6, 16, 2), C.greenDark), sh(rect(-10, -10, 22, 3), C.brass)], { x: 640, y: 686, rot: -3 }));
}

// ------------------------------------------------------------ side table with tea
{
  const tx = 540, ty = 902;
  add(sh(ellipse(tx, 1086, 76, 12), '#000000', { opacity: 0.32 }));
  for (const [fx, fy] of [[tx - 54, 1082], [tx + 54, 1082], [tx, 1092]] as [number, number][]) add(sh(ribbon([[tx, 1030], [(tx + fx) / 2, 1052], [fx, fy]], (t) => 13 - t * 5), C.woodDark), sh(circle(fx, fy, 5), C.brass));
  add(sh(rect(tx - 8, ty + 10, 16, 130), C.wood), sh(rect(tx - 8, ty + 10, 5, 130), C.woodLight, { opacity: 0.6 }));
  add(sh(ellipse(tx, 990, 13, 20), C.wood), sh(ellipse(tx - 4, 988, 4, 12), C.woodLight, { opacity: 0.6 }), sh(ellipse(tx, 1030, 12, 8), C.woodDark));
  add(sh(ellipse(tx, ty + 10, 92, 24), C.woodDark), sh(ellipse(tx, ty, 92, 24), C.woodLight), sh(ellipse(tx, ty, 83, 20), '#c08a56'));
  add(stroke(curve([[tx - 50, ty - 4], [tx - 10, ty - 10], [tx + 40, ty - 8]]), '#e2b684', 1.5, { opacity: 0.7 }));
  // doily, pot, cup
  add(sh(ellipse(tx - 26, ty - 2, 50, 11), C.cream, { opacity: 0.9 }));
  add(at(teapot(C.green, C.cream), tx - 24, ty + 3, 0.78));
  add(at(steam(50, '#ffffff'), tx - 84, ty - 56, 1));
  add(at(teacup(C.cream, C.red), tx + 50, ty + 12, 0.74));
  add(at(steam(56, '#ffffff'), tx + 50, ty - 28, 1));
}

// ------------------------------------------------------------ sleeping cat on the rug
{
  const fur = '#c9823f', dk = shade(fur, -0.3), lt = '#ecc48e';
  add(place([
    sh(ellipse(2, 2, 60, 9), '#000000', { opacity: 0.3 }),
    sh(ellipse(4, -19, 50, 21), fur),
    sh(ellipse(24, -22, 26, 20), shade(fur, 0.08)),
    ...[-14, -2, 10, 22, 34].map((x) => stroke(curve([[x, -39], [x + 4, -30], [x + 2, -22]]), dk, 3, { opacity: 0.6 })),
    sh(ribbon([[50, -18], [48, -4], [18, 1], [-20, -3], [-34, -6]], (t) => 11 - t * 3), dk),
    sh(circle(-36, -22, 17), fur),
    sh(poly([[-50, -30], [-49, -47], [-37, -37]]), fur), sh(poly([[-33, -38], [-24, -48], [-21, -33]]), fur),
    sh(poly([[-47, -33], [-47, -42], [-41, -37]]), '#e8a99a'), sh(poly([[-30, -38], [-25, -44], [-24, -35]]), '#e8a99a'),
    sh(ellipse(-41, -15, 9, 6.5), lt),
    stroke(curve([[-47, -24], [-43, -21], [-39, -24]]), C.ink, 1.5), stroke(curve([[-34, -25], [-30, -22], [-26, -25]]), C.ink, 1.5),
    sh(poly([[-43, -18], [-39, -18], [-41, -15]]), '#c9706a'),
    stroke(line([[-48, -15], [-60, -17]]), '#ffffff', 0.8, { opacity: 0.7 }), stroke(line([[-48, -13], [-60, -11]]), '#ffffff', 0.8, { opacity: 0.7 }),
    stroke(curve([[-34, -38], [-30, -34], [-36, -30]]), dk, 2, { opacity: 0.6 }),
  ], { x: 668, y: 1150, s: 1.3 }));
}

// ------------------------------------------------------------ floor clutter (right)
{
  add(sh(ellipse(1050, 1004, 78, 10), '#000000', { opacity: 0.3 }));
  const st = bookStack(1050, 1004, 126, 5, rng(77), [17, 24]);
  add(st.shapes);
  add(at(teacup(C.bluePale, C.blueDark), 1048, st.top + 4, 0.62));
  // basket of blankets
  const bx = 1090, by = 1176;
  add(sh(ellipse(bx, by, 96, 14), '#000000', { opacity: 0.3 }));
  for (const [dx, col] of [[-42, C.cream], [0, C.green], [42, C.brick]] as [number, string][]) {
    add(sh(circle(bx + dx, by - 96, 34), col), stroke(circle(bx + dx, by - 96, 24), shade(col, -0.25), 2.5, { opacity: 0.7 }), stroke(circle(bx + dx, by - 96, 14), shade(col, -0.25), 2.5, { opacity: 0.7 }), sh(circle(bx + dx, by - 96, 5), shade(col, -0.3)));
  }
  add(sh(poly([[bx - 92, by - 92], [bx + 92, by - 92], [bx + 74, by], [bx - 74, by]]), '#b08a52'));
  for (let i = 0; i < 6; i++) {
    const y = by - 84 + i * 15, hw = 90 - i * 3;
    add(sh(rect(bx - hw, y, hw * 2, 7, 3), i % 2 ? '#c9a468' : '#96723e'));
  }
  for (let x = -80; x <= 80; x += 16) add(stroke(line([[bx + x, by - 90], [bx + x * 0.82, by - 2]]), '#7a5a2e', 2.5, { opacity: 0.7 }));
  add(sh(rect(bx - 96, by - 98, 192, 11, 5), '#c9a468'), sh(rect(bx - 96, by - 98, 192, 3.5, 2), '#e6c88e'));
}

// ------------------------------------------------------------ light
add(sh(ellipse(520, 1000, 330, 90), `url(#${ID}-pool)`));
add(sh(circle(452, 410, 360), `url(#${ID}-glow)`));
add(sh(rect(0, 0, 1200, 1200), `url(#${ID}-vig)`));

const defs =
  linearGradient(`${ID}-wall`, [[0, '#23443a'], [0.6, '#2f5a49'], [1, '#3a6451']]) +
  linearGradient(`${ID}-sky`, [[0, '#1d2c47'], [0.45, '#44507a'], [0.72, '#a0708a'], [0.9, '#e39a66'], [1, '#f2c07a']]) +
  linearGradient(`${ID}-floor`, [[0, '#6e4428'], [1, '#8f5d38']]) +
  linearGradient(`${ID}-shade`, [[0, '#d98f38'], [0.5, '#ffeab4'], [1, '#d98f38']], 0, 0, 1, 0) +
  `<linearGradient id="${ID}-caselight" x1="1" y1="0.45" x2="0" y2="0.55"><stop offset="0" stop-color="#ffd27a" stop-opacity="0.2"/><stop offset="0.6" stop-color="#ffd27a" stop-opacity="0"/><stop offset="1" stop-color="#0d1420" stop-opacity="0.22"/></linearGradient>` +
  glowGradient(`${ID}-glow`, '#ffd98a', 0.5, 0.35) +
  glowGradient(`${ID}-pool`, '#ffd98a', 0.3, 0.5) +
  vignetteGradient(`${ID}-vig`, '#0b1220', 0.6, 0.5);

const activity: PuzzleActivity = {
  id: ID,
  version: 2,
  mode: 'puzzle',
  title: 'The Reading Nook',
  blurb: 'A lamplit armchair between tall bookshelves while evening rain taps at the window.',
  collectionId: 'library',
  categories: ['Interiors', 'Cozy'],
  difficulty: 'Moderate',
  pieceCounts: [36, 64, 100, 196],
  geometrySeed: 20417,
  geometryVersion: 1,
  art: { width: 1200, height: 1200, defs, shapes: S },
};
export default activity;
