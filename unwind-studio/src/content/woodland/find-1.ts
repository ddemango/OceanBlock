import { blob, circle, curve, ellipse, leaf, line, linearGradient, place, poly, radialGradient, rect, rng, sh, shade, stroke } from '../../art/kit';
import type { Pt } from '../../art/geometry';
import type { Shape } from '../../art/types';
import type { FindActivity, FindItem } from '../types';
import {
  W as P, acorn, basket, candle, copperPan, foliage, herbBundle, honeyJar, jar, key, ladybird, logEnd, mouse, pocketWatch,
  robin, rollingPin, scissors, sleepingCat, spectacles, teacup, tin, woodenSpoon, yarnBall,
} from './props-find';

const WD = 1200, HT = 1500;
const ID = 'woodland-find-1';
const items: FindItem[] = [];
const scene = (...s: Shape[]) => { items.push({ shapes: s }); };
const target = (id: string, name: string, s: Shape[]) => { items.push({ id, name, target: true, shapes: s }); };

// ------------------------------------------------------------------ helpers
function stoneWall(x0: number, y0: number, w: number, h: number, seed: number, cols: string[], sw = 64, shh = 40): Shape[] {
  const g = rng(seed);
  const out: Shape[] = [sh(rect(x0, y0, w, h), '#5e564a')];
  const groups = cols.map(() => '');
  for (let y = y0; y < y0 + h; y += shh) {
    let x = x0 - g.range(0, sw * 0.6);
    while (x < x0 + w) {
      const ww = sw * g.range(0.7, 1.3), hh = Math.min(shh, y0 + h - y);
      const a = Math.max(x, x0) + 2.5, b = Math.min(x + ww, x0 + w) - 2.5;
      if (b - a > 8 && hh > 8) {
        const k = g.int(0, cols.length - 1);
        groups[k] += blob([[a, y + 3], [(a + b) / 2, y + 2 + g.range(-1, 1)], [b, y + 4], [b + 1, y + hh / 2], [b, y + hh - 3], [(a + b) / 2, y + hh - 2], [a, y + hh - 3], [a - 1, y + hh / 2]], 0.5);
      }
      x += ww;
    }
  }
  groups.forEach((d, k) => out.push(sh(d, cols[k])));
  // highlights and lichen specks
  let hl = '', sp = '';
  for (let i = 0; i < (w * h) / 5000; i++) {
    hl += ellipse(x0 + g.range(10, w - 10), y0 + g.range(8, h - 8), g.range(6, 14), g.range(2, 3.5));
    sp += circle(x0 + g.range(5, w - 5), y0 + g.range(5, h - 5), g.range(0.8, 1.8));
  }
  out.push(sh(hl, '#ffffff', { opacity: 0.12 }), sh(sp, '#3f3a32', { opacity: 0.5 }));
  return out;
}

function planks(x0: number, y0: number, w: number, h: number, seed: number, base: string, horizontal = true, pw = 26): Shape[] {
  const g = rng(seed);
  const out: Shape[] = [sh(rect(x0, y0, w, h), shade(base, -0.35))];
  let grain = '';
  const n = Math.ceil((horizontal ? h : w) / pw);
  for (let i = 0; i < n; i++) {
    const c = shade(base, g.range(-0.12, 0.1));
    if (horizontal) {
      const y = y0 + i * pw, hh = Math.min(pw, y0 + h - y) - 1.5;
      out.push(sh(rect(x0, y, w, hh), c));
      for (let k = 0; k < w / 120; k++) { const x = x0 + g.range(0, w - 60); grain += line([[x, y + g.range(4, hh - 4)], [x + g.range(30, 80), y + g.range(4, hh - 4)]]); }
    } else {
      const x = x0 + i * pw, ww = Math.min(pw, x0 + w - x) - 1.5;
      out.push(sh(rect(x, y0, ww, h), c));
      for (let k = 0; k < h / 120; k++) { const y = y0 + g.range(0, h - 60); grain += line([[x + g.range(4, ww - 4), y], [x + g.range(4, ww - 4), y + g.range(30, 80)]]); }
    }
  }
  out.push(stroke(grain, shade(base, -0.3), 1, { opacity: 0.6 }));
  return out;
}

function plate(r: number, rim: string, seed: number): Shape[] {
  const g = rng(seed);
  let dots = '';
  for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2; dots += circle(Math.cos(a) * r * 0.8, -r + Math.sin(a) * r * 0.8, r * 0.07); }
  return [
    sh(circle(0, -r, r), '#e7dcc4'), sh(circle(0, -r, r * 0.92), '#f6f0e2'), sh(circle(0, -r, r * 0.62), shade('#f6f0e2', -0.05)),
    stroke(circle(0, -r, r * 0.8), rim, r * 0.08), sh(dots, rim),
    sh(circle(0, -r, r * 0.22), g.next() > 0.5 ? rim : shade(rim, 0.3), { opacity: 0.6 }),
  ];
}

function jug(h: number, col: string): Shape[] {
  const dk = shade(col, -0.2);
  return [
    stroke(curve([[h * 0.3, -h * 0.8], [h * 0.55, -h * 0.75], [h * 0.5, -h * 0.35], [h * 0.3, -h * 0.3]]), dk, h * 0.08),
    sh(blob([[-h * 0.32, 0], [-h * 0.38, -h * 0.4], [-h * 0.26, -h * 0.78], [-h * 0.34, -h * 0.92], [h * 0.3, -h * 0.92], [h * 0.26, -h * 0.78], [h * 0.38, -h * 0.4], [h * 0.32, 0]], 0.7), col),
    sh(blob([[h * 0.08, 0], [h * 0.2, -h * 0.4], [h * 0.12, -h * 0.78], [h * 0.26, -h * 0.78], [h * 0.38, -h * 0.4], [h * 0.32, 0]], 0.7), dk, { opacity: 0.7 }),
    sh(poly([[-h * 0.34, -h * 0.92], [-h * 0.46, -h * 0.98], [-h * 0.2, -h * 0.94]]), col),
    stroke(line([[-h * 0.36, -h * 0.5], [h * 0.36, -h * 0.5]]), '#f3ead2', h * 0.05),
    sh(ellipse(-h * 0.18, -h * 0.45, h * 0.05, h * 0.18), '#ffffff', { opacity: 0.45 }),
  ];
}

function mug(col: string): Shape[] {
  return [
    stroke(curve([[8, -18], [16, -16], [15, -6], [8, -5]]), shade(col, -0.2), 3),
    sh(rect(-9, -22, 18, 22, 3), col), sh(rect(2, -22, 7, 22, 2), shade(col, -0.15)),
    sh(ellipse(0, -22, 9, 2.4), shade(col, -0.35)),
  ];
}

// ------------------------------------------------------------------ back wall
scene(sh(rect(0, 0, WD, 1100), `url(#${ID}-wall)`));
{
  const g = rng(11);
  let a = '', b = '', c = '';
  for (let i = 0; i < 90; i++) {
    const x = g.range(0, WD), y = g.range(90, 1090);
    const d = blob([[x - g.range(14, 40), y], [x, y - g.range(6, 18)], [x + g.range(14, 40), y], [x, y + g.range(6, 18)]], 1);
    if (i % 3 === 0) a += d; else if (i % 3 === 1) b += d; else c += d;
  }
  scene(sh(a, '#d9c7a4', { opacity: 0.55 }), sh(b, '#f3e6c8', { opacity: 0.6 }), sh(c, '#c9b48e', { opacity: 0.35 }));
  // cracks
  scene(stroke(curve([[96, 640], [110, 680], [102, 720], [118, 760]]) + curve([[1170, 140], [1160, 180], [1172, 214]]), '#a8946e', 1.2));
}
// timber posts and the ceiling
scene(...planks(0, 0, WD, 78, 3, '#6b4a2f', true, 26));
scene(sh(rect(0, 78, WD, 40), '#5a3d26'), sh(rect(0, 78, WD, 8), '#7a5536'), sh(rect(0, 112, WD, 6), '#3e2a1a'));
{
  const g = rng(5);
  let gr = '', pegs = '';
  for (let i = 0; i < 18; i++) { const x = g.range(0, WD - 80); gr += line([[x, 96 + g.range(-6, 6)], [x + g.range(40, 120), 96 + g.range(-6, 6)]]); }
  for (let x = 60; x < WD; x += 140) pegs += circle(x, 98, 3.5);
  scene(stroke(gr, '#3e2a1a', 1, { opacity: 0.7 }), sh(pegs, '#2c1e12'));
}
// ceiling rafters peeking down
scene(sh(rect(0, 0, 26, 1100), '#5a3d26'), sh(rect(20, 0, 6, 1100), '#3e2a1a'), sh(rect(WD - 26, 0, 26, 1100), '#5a3d26'), sh(rect(WD - 26, 0, 6, 1100), '#7a5536'));

// ------------------------------------------------------------------ window (left)
const WX = 46, WY = 210, WW = 210, WH = 330;
{
  scene(sh(rect(WX - 18, WY - 18, WW + 36, WH + 36, 4), '#c9b48e'), sh(rect(WX - 10, WY - 10, WW + 20, WH + 20, 3), '#7a5536'));
  scene(sh(rect(WX, WY, WW, WH), `url(#${ID}-sky)`));
  // distant forest
  scene(sh(blob([[WX, WY + 170], [WX + 50, WY + 140], [WX + 110, WY + 160], [WX + 170, WY + 130], [WX + WW, WY + 150], [WX + WW, WY + WH], [WX, WY + WH]], 0.8), '#8fae7a'));
  for (let i = 0; i < 6; i++) scene(...place(foliage(40 + i, 70, 90, ['#4e6b38', '#5f8a45', '#6f8f4e']), { x: WX + 10 + i * 40, y: WY + 230 + (i % 2) * 10, s: 0.8 }));
  scene(sh(rect(WX, WY + 270, WW, 60), '#7fa35a'));
  {
    const g = rng(19);
    let d = '';
    for (let i = 0; i < 26; i++) d += leaf(WX + g.range(2, WW - 2), WY + WH, g.range(10, 22), 1.8, -90 + g.range(-30, 30));
    scene(sh(d, '#5f8a45'));
  }
  // a branch with the robin outside
  scene(stroke(curve([[WX + WW, WY + 90], [WX + 150, WY + 104], [WX + 90, WY + 100], [WX + 60, WY + 112]]), '#5a3d26', 6));
  scene(sh(leaf(WX + 150, WY + 104, 22, 6, -60) + leaf(WX + 110, WY + 102, 20, 6, -130) + leaf(WX + 84, WY + 102, 18, 5, -40), '#6f8f4e'));
  // panes and lead lines
  let lead = '';
  for (let x = WX + 35; x < WX + WW; x += 35) lead += line([[x, WY], [x, WY + WH]]);
  for (let y = WY + 41; y < WY + WH; y += 41) lead += line([[WX, y], [WX + WW, y]]);
  scene(stroke(lead, '#4a4a48', 1.4, { opacity: 0.75 }));
  scene(sh(rect(WX + WW / 2 - 6, WY, 12, WH), '#7a5536'), sh(rect(WX, WY + WH / 2 - 6, WW, 12), '#7a5536'));
  scene(sh(poly([[WX + 10, WY + 10], [WX + 60, WY + 10], [WX + 10, WY + 90]]), '#ffffff', { opacity: 0.15 }));
  // curtains on a pole
  scene(stroke(line([[WX - 34, WY - 30], [WX + WW + 34, WY - 30]]), '#3e2a1a', 6), sh(circle(WX - 36, WY - 30, 7) + circle(WX + WW + 36, WY - 30, 7), '#3e2a1a'));
  for (const side of [-1, 1]) {
    const x = side < 0 ? WX - 30 : WX + WW + 30;
    const pts: Pt[] = side < 0
      ? [[x - 4, WY - 28], [x + 50, WY - 28], [x + 30, WY + 120], [x + 10, WY + 200], [x + 20, WY + 330], [x - 6, WY + 340]]
      : [[x + 4, WY - 28], [x - 50, WY - 28], [x - 30, WY + 120], [x - 10, WY + 200], [x - 20, WY + 330], [x + 6, WY + 340]];
    scene(sh(blob(pts, 0.6), '#b2523e'));
    let ch = '';
    for (let k = 0; k < 4; k++) ch += line([[x + side * -k * 10 - side * 6, WY - 24], [x + side * -k * 6 - side * 6, WY + 330]]);
    scene(stroke(ch, '#8a3a2c', 2, { opacity: 0.7 }));
    let check = '';
    for (let yy = WY; yy < WY + 320; yy += 24) check += line([[x - 10, yy], [x + 10 * -side + side * -30, yy + 6]]);
    scene(stroke(check, '#f3ead2', 1.2, { opacity: 0.45 }));
  }
  // sill
  scene(sh(rect(WX - 26, WY + WH + 8, WW + 52, 20, 3), '#8a6a45'), sh(rect(WX - 26, WY + WH + 8, WW + 52, 6, 3), '#a98256'), sh(rect(WX - 20, WY + WH + 28, WW + 40, 8), '#5a3d26'));
}
const SILL = WY + WH + 8;
// pot of thyme and a jar of wildflowers on the sill
{
  const s: Shape[] = [sh(poly([[WX + 140, SILL], [WX + 186, SILL], [WX + 190, SILL - 34], [WX + 136, SILL - 34]]), '#b9664a'), sh(rect(WX + 132, SILL - 40, 62, 9, 2), '#cb7650')];
  const g = rng(23);
  let l1 = '', l2 = '';
  for (let i = 0; i < 26; i++) { const x = WX + 140 + g.range(0, 46), y = SILL - 40 - g.range(0, 34); l1 += leaf(x, y, 9, 3, g.range(-160, -20)); l2 += circle(x + g.range(-4, 4), y + g.range(-4, 4), 2.4); }
  s.push(sh(l1, '#6f8f4e'), sh(l2, '#a591d6'));
  scene(...s);
  scene(...place(jar(30, 40, '#c4dce0', '#8a6a45'), { x: WX + 34, y: SILL }));
  scene(stroke(line([[WX + 28, SILL - 30], [WX + 20, SILL - 74]]) + line([[WX + 36, SILL - 30], [WX + 40, SILL - 80]]) + line([[WX + 40, SILL - 30], [WX + 54, SILL - 68]]), '#5f8a45', 1.6), sh(circle(WX + 20, SILL - 76, 6) + circle(WX + 54, SILL - 70, 5.5), '#f3ead2'), sh(circle(WX + 40, SILL - 82, 6), '#e8a03c'), sh(circle(WX + 20, SILL - 76, 2) + circle(WX + 54, SILL - 70, 2) + circle(WX + 40, SILL - 82, 2), '#c29a3c'));
}
target('candle', 'Candle', place(candle(), { x: WX + 92, y: SILL, s: 0.78 }));
target('robin', 'Robin', place(robin(), { x: WX + 128, y: WY + 102, s: 0.72 }));
scene(sh(leaf(WX + 176, WY + 98, 26, 7, -20) + leaf(WX + 168, WY + 100, 24, 7, 40) + leaf(WX + 96, WY + 104, 22, 6, 150) + leaf(WX + 70, WY + 110, 22, 6, -150), '#5f8a45'), sh(circle(WX + 184, WY + 108, 4) + circle(WX + 190, WY + 104, 4) + circle(WX + 76, WY + 118, 4), '#c8423a'));
scene(sh(ellipse(WX + 126, SILL - 6, 10, 6) + ellipse(WX + 194, SILL - 5, 8, 5), '#e9d9b4'), sh(ellipse(WX - 2, SILL - 5, 14, 5), '#9a9182'), stroke(curve([[WX + 118, SILL - 6], [WX + 126, SILL - 10], [WX + 134, SILL - 6]]), '#b8946a', 1.2));

// ------------------------------------------------------------------ dresser (right)
const DX = 812, DW = 368, DTOP = 186, COUNTER = 676;
{
  // back boards of the open rack
  scene(...planks(DX + 14, DTOP + 50, DW - 28, COUNTER - DTOP - 50, 61, '#7d5a3a', false, 30));
  // crown and sides
  scene(sh(rect(DX - 10, DTOP, DW + 20, 34, 2), '#8a613c'), sh(rect(DX - 16, DTOP - 14, DW + 32, 18, 3), '#a5754a'), sh(rect(DX, DTOP + 34, DW, 16), '#6b4a2f'));
  {
    let sc = '';
    for (let x = DX + 20; x < DX + DW - 10; x += 28) sc += ellipse(x, DTOP + 42, 10, 6);
    scene(sh(sc, '#5a3d26'));
  }
  scene(sh(rect(DX, DTOP + 34, 16, COUNTER - DTOP - 34), '#8a613c'), sh(rect(DX + DW - 16, DTOP + 34, 16, COUNTER - DTOP - 34), '#8a613c'), sh(rect(DX + 3, DTOP + 34, 4, COUNTER - DTOP - 34), '#a5754a'));
}
const SH = [330, 466, 600];
SH.forEach((y, i) => scene(sh(rect(DX + 14, y, DW - 28, 12, 1), '#a5754a'), sh(rect(DX + 14, y + 10, DW - 28, 4), '#5a3d26'), sh(rect(DX + 14, y - 8, DW - 28, 4), i === 2 ? '#8a613c' : '#8a613c', { opacity: 0.8 })));
// plates leaning on the shelves
{
  const rims = ['#3f6e9a', '#5f8a45', '#b2523e', '#3f6e9a', '#7a4d6a'];
  scene(...place(plate(44, rims[0], 1), { x: DX + 70, y: SH[0] - 6 }), ...place(plate(52, rims[1], 2), { x: DX + 164, y: SH[0] - 6 }), ...place(plate(44, rims[2], 3), { x: DX + 262, y: SH[0] - 6 }));
  scene(...place(plate(30, rims[3], 4), { x: DX + 330, y: SH[0] - 6 }));
  scene(...place(plate(38, rims[4], 5), { x: DX + 56, y: SH[1] - 6 }), ...place(plate(38, rims[0], 6), { x: DX + 114, y: SH[1] - 6 }));
}
// shelf 2: jugs and storage jars
scene(...place(jug(76, '#3f6e9a'), { x: DX + 190, y: SH[1] }), ...place(jug(54, '#d4a640'), { x: DX + 250, y: SH[1] }));
scene(...place(jar(34, 52, '#c4944c'), { x: DX + 300, y: SH[1] }), ...place(jar(30, 40, '#7a4d2a'), { x: DX + 336, y: SH[1] }));
// hanging mugs under shelf 1
{
  const s: Shape[] = [];
  [60, 104, 148, 192, 236, 280, 324].forEach((dx, i) => {
    const x = DX + dx;
    s.push(stroke(curve([[x, SH[0] + 14], [x, SH[0] + 22], [x + 4, SH[0] + 26]]), '#3d3a36', 2));
    s.push(...place(mug(['#e7dcc4', '#3f6e9a', '#b2523e', '#d4a640', '#5f8a45', '#e7dcc4', '#7a4d6a'][i]), { x: x + 2, y: SH[0] + 56, rot: 180 }));
  });
  scene(...s);
}
// shelf 3: teapot, tins, cups
{
  const tp = '#5f8a6a';
  scene(sh(ellipse(DX + 80, SH[2] - 30, 34, 30), tp), sh(ellipse(DX + 70, SH[2] - 38, 12, 14), shade(tp, 0.25), { opacity: 0.7 }), stroke(curve([[DX + 112, SH[2] - 44], [DX + 132, SH[2] - 40], [DX + 128, SH[2] - 18], [DX + 108, SH[2] - 16]]), tp, 5), sh(poly([[DX + 50, SH[2] - 30], [DX + 26, SH[2] - 54], [DX + 22, SH[2] - 50], [DX + 46, SH[2] - 18]]), tp), sh(ellipse(DX + 80, SH[2] - 58, 18, 5), shade(tp, -0.2)), sh(circle(DX + 80, SH[2] - 66, 5), shade(tp, -0.2)), sh(rect(DX + 60, SH[2] - 4, 40, 4, 2), shade(tp, -0.3)));
  scene(...place(tin(40, 50, '#b2523e'), { x: DX + 170, y: SH[2] }), ...place(tin(34, 38, '#3f6e9a', '#e9d9b4'), { x: DX + 212, y: SH[2] }));
  scene(...place(mug('#e7dcc4'), { x: DX + 250, y: SH[2] }), ...place(mug('#d4a640'), { x: DX + 274, y: SH[2] }));
}
target('teacup', 'Teacup and saucer', place(teacup('#3f6e9a'), { x: DX + 322, y: SH[2], s: 0.85 }));
// lower cupboard
{
  const LY = COUNTER;
  scene(sh(rect(DX - 14, LY, DW + 28, 22, 2), '#a5754a'), sh(rect(DX - 14, LY, DW + 28, 6, 2), '#c08f5c'), sh(rect(DX - 8, LY + 22, DW + 16, 1100 - LY - 22), '#7d5a3a'));
  // drawers
  for (let i = 0; i < 3; i++) {
    const x = DX + 6 + i * ((DW - 12) / 3);
    scene(sh(rect(x + 4, LY + 32, (DW - 12) / 3 - 8, 54, 2), '#8a613c'), stroke(rect(x + 10, LY + 38, (DW - 12) / 3 - 20, 42, 2), '#6b4a2f', 2), sh(circle(x + (DW - 12) / 6, LY + 59, 5), '#c29a3c'), sh(circle(x + (DW - 12) / 6 - 1.5, LY + 57.5, 1.6), '#ecd08a'));
  }
  // doors
  for (let i = 0; i < 2; i++) {
    const x = DX + 8 + i * (DW / 2 - 4);
    scene(sh(rect(x, LY + 100, DW / 2 - 12, 300, 3), '#8a613c'), sh(rect(x + 16, LY + 118, DW / 2 - 44, 264, 3), '#7a5333'), sh(rect(x + 22, LY + 124, DW / 2 - 56, 252, 2), '#946a42'));
    scene(sh(circle(i ? x + 14 : x + DW / 2 - 26, LY + 250, 5.5), '#c29a3c'));
  }
  {
    const g = rng(171);
    let gr = '';
    for (let i = 0; i < 40; i++) { const x = DX + 30 + g.range(0, DW - 60); const y = LY + 130 + g.range(0, 220); gr += line([[x, y], [x + g.range(-2, 2), y + g.range(20, 60)]]); }
    scene(stroke(gr, '#6b4a2f', 1, { opacity: 0.7 }));
    // checked tea towel over the door knob
    const tx = DX + DW / 2 + 8, ty = LY + 246;
    scene(sh(blob([[tx - 6, ty], [tx + 58, ty - 2], [tx + 62, ty + 120], [tx + 40, ty + 130], [tx - 2, ty + 124]], 0.4), '#f3ead2'));
    let ck = '';
    for (let k = 0; k < 6; k++) ck += line([[tx + 4 + k * 10, ty + 2], [tx + 4 + k * 10, ty + 124]]);
    for (let k = 0; k < 12; k++) ck += line([[tx - 2, ty + 8 + k * 10], [tx + 60, ty + 6 + k * 10]]);
    scene(stroke(ck, '#b2523e', 2.4, { opacity: 0.65 }), sh(rect(tx - 4, ty - 4, 66, 10, 4), '#e2d3b0'));
    // baskets on top of the cupboard floor line
  }
  scene(sh(rect(DX - 8, 1080, DW + 16, 20), '#5a3d26'));
}
// on the counter: bread crock, jars, honey
scene(...place(jar(52, 74, '#e9d9b4', '#8a6a45'), { x: DX + 46, y: COUNTER }), ...place(jar(40, 56, '#a9483a', '#8a6a45'), { x: DX + 98, y: COUNTER }));
scene(sh(blob([[DX + 140, COUNTER], [DX + 136, COUNTER - 60], [DX + 200, COUNTER - 66], [DX + 266, COUNTER - 60], [DX + 262, COUNTER]], 0.7), '#c9b48e'), sh(rect(DX + 136, COUNTER - 76, 130, 16, 6), '#a98a64'), sh(rect(DX + 150, COUNTER - 44, 100, 18, 3), '#e9dcc0'), stroke(line([[DX + 166, COUNTER - 35], [DX + 236, COUNTER - 35]]), '#7a5333', 3), sh(circle(DX + 201, COUNTER - 82, 6), '#8a6a45'));
target('honey', 'Honey pot', place(honeyJar(), { x: DX + 318, y: COUNTER, s: 0.8 }));
target('scissors', 'Scissors', place(scissors('#b2523e'), { x: DX - 2, y: 760, rot: 90, s: 0.85 }));
scene(stroke(curve([[DX - 4, 724], [DX - 4, 730], [DX - 1, 734]]), '#3d3a36', 2));

// ------------------------------------------------------------------ hearth
const HX = 288, HR = 782, MANTEL = 500, OPEN_T = 620, OPEN_L = 368, OPEN_R = 702, HEARTH_FLOOR = 1086;
scene(...stoneWall(HX, 118, HR - HX, MANTEL - 118, 71, ['#a39d90', '#b6ae9e', '#8f887a', '#c4bdae', '#9a9182'], 70, 46));
scene(...stoneWall(HX - 20, MANTEL + 40, HR - HX + 40, HEARTH_FLOOR - MANTEL - 40, 73, ['#a39d90', '#b6ae9e', '#8f887a', '#c4bdae', '#9a9182'], 64, 42));
// fire opening
const arch = `M${OPEN_L} ${HEARTH_FLOOR}L${OPEN_L} 700Q${OPEN_L} ${OPEN_T} 535 ${OPEN_T - 6}Q${OPEN_R} ${OPEN_T} ${OPEN_R} 700L${OPEN_R} ${HEARTH_FLOOR}Z`;
scene(sh(xfArch(18), '#7a7264'));
function xfArch(pad: number) {
  return `M${OPEN_L - pad} ${HEARTH_FLOOR}L${OPEN_L - pad} 700Q${OPEN_L - pad} ${OPEN_T - pad} 535 ${OPEN_T - 6 - pad}Q${OPEN_R + pad} ${OPEN_T - pad} ${OPEN_R + pad} 700L${OPEN_R + pad} ${HEARTH_FLOOR}Z`;
}
{
  // arch voussoir stones
  const g = rng(77);
  let v1 = '', v2 = '';
  for (let i = 0; i < 13; i++) {
    const t0 = i / 13, t1 = (i + 1) / 13;
    const p = (t: number, pad: number): Pt => {
      const a = Math.PI * (1 - t);
      return [535 + Math.cos(a) * (167 + pad), 700 - Math.sin(a) * (86 + pad)];
    };
    const d = poly([p(t0 + 0.005, 0), p(t1 - 0.005, 0), p(t1 - 0.005, 18), p(t0 + 0.005, 18)]);
    if (i % 2) v1 += d; else v2 += d;
  }
  scene(sh(v1, '#b6ae9e'), sh(v2, '#9a9182'));
  void g;
}
scene(sh(arch, `url(#${ID}-fireback)`));
// soot, back bricks
{
  const g = rng(81);
  let br = '';
  for (let y = 720; y < HEARTH_FLOOR - 40; y += 22) for (let x = OPEN_L + 30 + ((y / 22) % 2) * 22; x < OPEN_R - 40; x += 44) br += rect(x, y, 40, 19, 2);
  scene(sh(br, '#3a2a22', { opacity: 0.55 }));
  let soot = '';
  for (let i = 0; i < 8; i++) soot += ellipse(535 + g.range(-80, 80), 680 + g.range(0, 60), g.range(30, 60), g.range(12, 24));
  scene(sh(soot, '#1a1210', { opacity: 0.4 }));
}
// iron fire dogs, logs and flames
{
  scene(sh(rect(420, 1040, 12, 44, 2) + rect(640, 1040, 12, 44, 2), '#2a2622'), sh(circle(426, 1036, 9) + circle(646, 1036, 9), '#2a2622'));
  scene(sh(poly([[410, 1052], [668, 1040], [672, 1064], [406, 1076]]), '#5a3d24'), sh(poly([[420, 1030], [640, 1050], [636, 1072], [416, 1052]]), '#6b4a2f'));
  scene(...place(logEnd(16, 5), { x: 412, y: 1063 }), ...place(logEnd(14, 6), { x: 646, y: 1060 }));
  scene(sh(ellipse(535, 1070, 150, 18), '#d9622e', { opacity: 0.6 }), sh(ellipse(535, 1072, 110, 10), '#f7d77a', { opacity: 0.7 }));
  const fl = (x: number, h: number, w: number) => blob([[x - w, 1056], [x - w * 0.8, 1056 - h * 0.45], [x - w * 0.2, 1056 - h * 0.8], [x, 1056 - h], [x + w * 0.35, 1056 - h * 0.6], [x + w, 1056 - h * 0.25], [x + w * 0.9, 1056]], 1);
  scene(sh(fl(470, 90, 30) + fl(520, 130, 38) + fl(585, 110, 34) + fl(630, 70, 24), '#d9622e'));
  scene(sh(fl(480, 64, 20) + fl(525, 96, 26) + fl(582, 80, 22) + fl(626, 48, 16), '#f2a03a'));
  scene(sh(fl(486, 38, 12) + fl(528, 58, 16) + fl(580, 48, 14), '#f7d77a'));
  let sparks = '';
  const g = rng(91);
  for (let i = 0; i < 14; i++) sparks += circle(535 + g.range(-90, 90), 860 + g.range(0, 140), g.range(1.2, 2.6));
  scene(sh(sparks, '#ffd98a', { opacity: 0.85 }));
}
// crane and bubbling pot
{
  scene(sh(rect(OPEN_L + 4, 690, 10, 260, 3), '#2a2622'), stroke(line([[OPEN_L + 10, 712], [560, 712]]) + line([[OPEN_L + 10, 790], [520, 714]]), '#2a2622', 6));
  scene(stroke(line([[540, 714], [540, 810]]), '#2a2622', 3));
  let chain = '';
  for (let y = 720; y < 806; y += 9) chain += ellipse(540, y, 3, 5);
  scene(stroke(chain, '#4a4440', 1.4));
  scene(stroke(curve([[488, 846], [540, 796], [592, 846]]), '#2a2622', 3.5));
  scene(sh(blob([[478, 846], [470, 890], [492, 936], [540, 950], [588, 936], [610, 890], [602, 846]], 0.9), '#2a2622'), sh(ellipse(540, 846, 64, 14), '#3d3a36'), sh(ellipse(540, 846, 56, 10), '#6a8a4a'));
  scene(sh(ellipse(510, 890, 10, 28, 10), '#5a5550', { opacity: 0.6 }), sh(rect(486, 944, 10, 14, 2) + rect(584, 944, 10, 14, 2) + rect(535, 948, 10, 12, 2), '#2a2622'));
  scene(sh(circle(520, 842, 6) + circle(546, 838, 8) + circle(570, 844, 5) + circle(532, 832, 4), '#9ab874'), stroke(circle(520, 842, 6) + circle(546, 838, 8) + circle(570, 844, 5), '#4e6b38', 1));
  scene(sh(blob([[520, 826], [508, 790], [530, 760], [516, 720], [534, 690], [544, 720], [532, 760], [552, 792], [540, 826]], 1), '#f3ead2', { opacity: 0.35 }), sh(blob([[560, 828], [574, 790], [556, 758], [576, 724], [588, 750], [572, 790], [576, 828]], 1), '#f3ead2', { opacity: 0.25 }));
}
// hearth slab
scene(sh(rect(HX - 40, HEARTH_FLOOR, HR - HX + 80, 30, 3), '#8f887a'), sh(rect(HX - 40, HEARTH_FLOOR, HR - HX + 80, 7, 3), '#b6ae9e'), stroke(line([[420, HEARTH_FLOOR + 4], [420, HEARTH_FLOOR + 30]]) + line([[600, HEARTH_FLOOR + 4], [600, HEARTH_FLOOR + 30]]), '#5e564a', 2));
// fire tools and bellows by the hearth
{
  scene(sh(rect(722, 900, 50, 10, 3), '#2a2622'), stroke(line([[732, 900], [726, 760]]) + line([[748, 900], [748, 748]]) + line([[764, 900], [772, 762]]), '#2a2622', 4));
  scene(sh(circle(726, 754, 7) + circle(748, 742, 7) + circle(772, 756, 7), '#c29a3c'));
  scene(stroke(line([[722, 900], [722, 1080]]) + line([[772, 900], [772, 1080]]), '#2a2622', 3), sh(rect(712, 1074, 70, 10, 3), '#2a2622'));
  // copper coal scuttle
  scene(sh(blob([[296, 1084], [292, 1010], [300, 990], [350, 996], [362, 1020], [356, 1084]], 0.7), '#8e5230'), sh(blob([[300, 1080], [298, 1014], [306, 998], [330, 1000], [326, 1080]], 0.7), '#c07a45'), sh(ellipse(326, 994, 30, 8), '#5a3020'), sh(blob([[306, 990], [322, 976], [346, 980], [352, 994]], 0.9), '#2a2622'), stroke(curve([[300, 1004], [326, 960], [356, 1004]]), '#5a3020', 4), sh(ellipse(312, 1030, 5, 20), '#e0a06a', { opacity: 0.6 }), sh(rect(292, 1080, 72, 6, 2), '#5a3020'));
}
target('acorn', 'Acorn', place(acorn(), { x: 650, y: HEARTH_FLOOR + 12, s: 0.9, rot: 80 }));
// mantel beam
scene(sh(rect(HX - 30, MANTEL, HR - HX + 60, 42, 3), '#6b4a2f'), sh(rect(HX - 30, MANTEL, HR - HX + 60, 9, 3), '#8f6a45'), sh(rect(HX - 30, MANTEL + 36, HR - HX + 60, 6), '#3e2a1a'));
{
  const g = rng(97);
  let gr = '';
  for (let i = 0; i < 12; i++) { const x = g.range(HX - 20, HR - 40); gr += line([[x, MANTEL + 20 + g.range(-6, 6)], [x + g.range(30, 80), MANTEL + 20 + g.range(-6, 6)]]); }
  scene(stroke(gr, '#3e2a1a', 1.2, { opacity: 0.7 }), sh(circle(HX - 10, MANTEL + 22, 3) + circle(HR + 10, MANTEL + 22, 3), '#2c1e12'));
}
// mantel ornaments
{
  // clock
  const cx = 535;
  scene(sh(rect(cx - 38, MANTEL - 104, 76, 104, 6), '#5a3d26'), sh(blob([[cx - 40, MANTEL - 100], [cx, MANTEL - 132], [cx + 40, MANTEL - 100]], 0.8), '#6b4a2f'), sh(circle(cx, MANTEL - 70, 26), '#c29a3c'), sh(circle(cx, MANTEL - 70, 22), '#f6efdc'));
  let t = '';
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; t += line([[cx + Math.cos(a) * 17, MANTEL - 70 + Math.sin(a) * 17], [cx + Math.cos(a) * 20, MANTEL - 70 + Math.sin(a) * 20]]); }
  scene(stroke(t, '#3d3a36', 1.4), stroke(line([[cx, MANTEL - 70], [cx + 10, MANTEL - 76]]) + line([[cx, MANTEL - 70], [cx - 2, MANTEL - 86]]), '#3d3a36', 2), sh(rect(cx - 20, MANTEL - 36, 40, 28, 3), '#7a5333'), sh(circle(cx, MANTEL - 18, 6), '#c29a3c'));
  scene(...place(jug(46, '#e7dcc4'), { x: 340, y: MANTEL }), ...place(jar(30, 40, '#5f8a45', '#8a6a45'), { x: 392, y: MANTEL }));
  scene(...place(tin(36, 34, '#3f6e9a'), { x: 440, y: MANTEL }));
  // a row of little pebbles and a pinecone-like dried posy
  scene(sh(ellipse(616, MANTEL - 6, 12, 6) + ellipse(636, MANTEL - 5, 9, 5), '#9a9182'), sh(ellipse(616, MANTEL - 9, 6, 2), '#c4bdae'));
  scene(...place(jug(58, '#b2523e'), { x: 700, y: MANTEL }));
  scene(stroke(line([[692, MANTEL - 56], [676, MANTEL - 110]]) + line([[700, MANTEL - 56], [704, MANTEL - 120]]) + line([[708, MANTEL - 56], [728, MANTEL - 104]]), '#7a8a4a', 2), sh(circle(676, MANTEL - 114, 8) + circle(728, MANTEL - 108, 7), '#e9c9a0'), sh(circle(704, MANTEL - 124, 9), '#d9a640'));
  scene(...place(books(4, 7, 46), { x: 742, y: MANTEL }));
}
target('spectacles', 'Spectacles', place(spectacles(), { x: 600, y: MANTEL - 24, s: 0.8 }));
target('watch', 'Pocket watch', place(pocketWatch(), { x: 390, y: MANTEL + 92, s: 0.85 }));
scene(stroke(curve([[390, MANTEL + 42], [390, MANTEL + 58], [394, MANTEL + 62]]), '#2a2622', 2));
// hanging herbs on the mantel underside
scene(...place(herbBundle(301, '#7a8a4a', 64), { x: 660, y: MANTEL + 46 }));

// ------------------------------------------------------------------ the beam: pans, herbs, garlic
{
  const hooks = [70, 180, 300, 420, 560, 700, 830, 960, 1080];
  hooks.forEach((x) => scene(stroke(curve([[x, 118], [x, 132], [x + 6, 138], [x + 10, 132]]), '#2a2622', 2.6)));
  scene(...place(copperPan(26), { x: 76, y: 130 }));
  scene(...place(herbBundle(311, '#6f8f4e', 80), { x: 186, y: 132 }));
  scene(...place(copperPan(34), { x: 306, y: 130 }));
  scene(...place(herbBundle(312, '#8a9a5a', 70), { x: 426, y: 132 }));
  scene(...place(herbBundle(313, '#5f8a45', 86), { x: 566, y: 132 }));
  // string of onions
  {
    const s: Shape[] = [stroke(line([[706, 132], [706, 300]]), '#c9b98f', 2.4)];
    [[694, 160], [718, 186], [696, 214], [718, 240], [700, 268], [714, 294]].forEach(([x, y]) => s.push(sh(blob([[x - 13, y + 6], [x - 9, y - 8], [x, y - 16], [x + 9, y - 8], [x + 13, y + 6], [x, y + 13]], 1), '#c88a4a'), stroke(curve([[x - 4, y - 8], [x - 6, y + 2], [x - 1, y + 11]]) + curve([[x + 4, y - 8], [x + 6, y + 2], [x + 1, y + 11]]), '#9a6030', 1.2)));
    scene(...s);
  }
  scene(...place(copperPan(22), { x: 836, y: 130 }));
  scene(...place(herbBundle(314, '#a591d6', 60), { x: 966, y: 132 }));
  scene(...place(copperPan(30), { x: 1086, y: 130 }));
}
target('ladybird', 'Ladybird', place(ladybird(), { x: 440, y: 196, s: 0.85, rot: 150 }));

// tongue-and-groove wainscot behind the table, and a utensil rail
scene(...planks(26, 800, 262, 300, 141, '#9a7048', false, 22), sh(rect(26, 792, 262, 10, 2), '#6b4a2f'));
{
  const RY = 640;
  scene(sh(rect(120, RY - 6, 170, 8, 3), '#3d3a36'), sh(circle(122, RY - 2, 5) + circle(288, RY - 2, 5), '#2a2622'));
  // ladle
  scene(stroke(line([[150, RY], [150, RY + 74]]), '#6e6a64', 4), sh(ellipse(150, RY + 84, 13, 11), '#6e6a64'), sh(ellipse(150, RY + 80, 10, 5), '#97928a'));
  // sieve
  scene(stroke(line([[186, RY], [186, RY + 30]]), '#6e6a64', 3), sh(circle(186, RY + 54, 24), '#6e6a64'), sh(circle(186, RY + 54, 20), '#b9b4a8'));
  {
    let mesh = '';
    for (let k = -16; k <= 16; k += 5) mesh += line([[186 + k, RY + 54 - Math.sqrt(400 - k * k)], [186 + k, RY + 54 + Math.sqrt(400 - k * k)]]) + line([[186 - Math.sqrt(400 - k * k), RY + 54 + k], [186 + Math.sqrt(400 - k * k), RY + 54 + k]]);
    scene(stroke(mesh, '#6e6a64', 0.8));
  }
  // whisk and slotted spoon
  scene(stroke(line([[270, RY], [270, RY + 40]]), '#a5754a', 4), stroke(curve([[264, RY + 40], [258, RY + 70], [270, RY + 96], [282, RY + 70], [276, RY + 40]]) + curve([[270, RY + 40], [270, RY + 96]]), '#97928a', 1.6));
  scene(stroke(line([[214, RY], [214, RY + 62]]), '#6e6a64', 4), sh(ellipse(214, RY + 76, 10, 16), '#6e6a64'), sh(circle(211, RY + 70, 1.8) + circle(217, RY + 74, 1.8) + circle(212, RY + 80, 1.8), '#e2cfa8'));
  scene(stroke(curve([[236, RY], [236, RY + 10], [240, RY + 14]]), '#2a2622', 2));
}
target('key', 'Iron key', place(key('#6e6a64'), { x: 240, y: 688, rot: 90, s: 0.8 }));

// ------------------------------------------------------------------ work table under the window
const TT = 770;
{
  scene(sh(rect(36, TT + 22, 16, 1100 - TT - 22) + rect(232, TT + 22, 16, 1100 - TT - 22), '#6b4a2f'), sh(rect(36, 1000, 212, 10), '#5a3d26'));
  // flour sack and potato basket beneath
  scene(sh(blob([[60, 1096], [56, 1040], [70, 1000], [96, 990], [128, 996], [140, 1040], [136, 1096]], 0.9), '#e9dcc0'), sh(blob([[72, 1006], [96, 984], [124, 1002], [96, 1012]], 0.9), '#c9b48e'), stroke(curve([[70, 1010], [96, 1016], [126, 1008]]), '#a98a64', 3), sh(rect(76, 1040, 46, 26, 3), '#f6f0e2'), stroke(line([[84, 1050], [114, 1050]]) + line([[84, 1058], [108, 1058]]), '#7a5333', 2));
  scene(...place(basket(84, 50, '#b8864f'), { x: 196, y: 1098 }), sh(circle(170, 1044, 12) + circle(192, 1040, 13) + circle(214, 1046, 11) + circle(204, 1028, 10) + circle(180, 1026, 10), '#c9a46a'), sh(circle(176, 1040, 2) + circle(196, 1036, 2) + circle(212, 1042, 1.6), '#8a6a3a'));
  scene(...planks(20, TT, 248, 24, 131, '#b8864f', true, 12));
  scene(sh(rect(20, TT + 22, 248, 6), '#5a3d26'));
}
// on the table: bowl of eggs, loaf, flour
scene(sh(blob([[44, TT], [38, TT - 30], [118, TT - 30], [112, TT]], 0.7), '#e7dcc4'), stroke(line([[40, TT - 20], [116, TT - 20]]), '#3f6e9a', 3), sh(ellipse(60, TT - 36, 13, 10) + ellipse(84, TT - 40, 13, 10) + ellipse(104, TT - 35, 12, 9.5), '#e9c9a0'), sh(ellipse(72, TT - 30, 12, 9), '#f6f0e2'));
scene(sh(blob([[140, TT], [136, TT - 26], [160, TT - 46], [200, TT - 48], [228, TT - 30], [230, TT]], 0.9), '#c88a4a'), sh(blob([[148, TT - 30], [166, TT - 42], [204, TT - 44], [222, TT - 30]], 0.9), '#e0a868'), stroke(line([[166, TT - 44], [172, TT - 30]]) + line([[186, TT - 47], [192, TT - 32]]) + line([[206, TT - 46], [212, TT - 32]]), '#9a5a2a', 2));
scene(sh(ellipse(214, TT - 4, 26, 6), '#f6f0e2', { opacity: 0.9 }), sh(ellipse(60, TT - 2, 18, 3), '#f6f0e2', { opacity: 0.7 }));
target('pin', 'Rolling pin', place(rollingPin(), { x: 150, y: TT - 10, s: 0.95, rot: -4 }));
target('spoon', 'Wooden spoon', place(woodenSpoon(), { x: 118, y: TT + 60, rot: 90, s: 0.8 }));
scene(stroke(curve([[108, TT + 22], [108, TT + 30], [112, TT + 33]]), '#2a2622', 2));

// ------------------------------------------------------------------ floor
{
  scene(sh(rect(0, 1100, WD, 400), '#6e6658'));
  const g = rng(201);
  const rows = [1100, 1150, 1214, 1292, 1386, 1500];
  const cols = ['#9a9182', '#a39d90', '#8f887a', '#b0a898', '#968c7c'];
  const groups = cols.map(() => '');
  for (let r = 0; r < rows.length - 1; r++) {
    const y0 = rows[r] + 3, y1 = rows[r + 1] - 3;
    let x = -g.range(0, 80);
    while (x < WD) {
      const w = g.range(110, 190) * (0.7 + r * 0.15);
      const k = g.int(0, cols.length - 1);
      groups[k] += blob([[x + 4, y0 + g.range(0, 3)], [x + w / 2, y0 + g.range(-1, 2)], [x + w - 4, y0 + g.range(0, 3)], [x + w - 2, (y0 + y1) / 2], [x + w - 4, y1 - g.range(0, 3)], [x + w / 2, y1], [x + 4, y1 - g.range(0, 3)], [x + 2, (y0 + y1) / 2]], 0.5);
      x += w;
    }
  }
  groups.forEach((d, k) => scene(sh(d, cols[k])));
  let hl = '';
  for (let i = 0; i < 40; i++) hl += ellipse(g.range(0, WD), g.range(1110, 1490), g.range(8, 20), g.range(2, 4));
  scene(sh(hl, '#ffffff', { opacity: 0.1 }));
  scene(sh(rect(0, 1100, WD, 400), `url(#${ID}-floorglow)`));
}

// rag rug before the hearth
{
  const cx = 560, cy = 1290;
  const bands = ['#7a4d6a', '#d4a640', '#5f8a6a', '#b2523e', '#e9dcc0', '#3f6e9a', '#c88a4a'];
  bands.forEach((c, i) => scene(sh(ellipse(cx, cy, 330 - i * 40, 92 - i * 11.5), c)));
  const g = rng(211);
  let ty = '';
  for (let i = 0; i < 70; i++) { const a = g.range(0, Math.PI * 2), r = g.range(0.2, 0.98); const x = cx + Math.cos(a) * 320 * r, y = cy + Math.sin(a) * 88 * r; ty += line([[x - 4, y], [x + 4, y + g.range(-1, 1)]]); }
  scene(stroke(ty, '#f3ead2', 1.2, { opacity: 0.45 }));
  let fringe = '';
  for (let i = 0; i < 40; i++) { const a = (i / 40) * Math.PI * 2; const x = cx + Math.cos(a) * 330, y = cy + Math.sin(a) * 92; fringe += line([[x, y], [x + Math.cos(a) * 10, y + Math.sin(a) * 4]]); }
  scene(stroke(fringe, '#c9b48e', 2));
}
scene(...place(sleepingCat(), { x: 520, y: 1300, s: 1.25 }));

// knitting basket with balls of yarn
{
  scene(sh(circle(854, 1358, 22), '#5f8a6a'), sh(circle(894, 1352, 24), '#e9dcc0'), sh(circle(930, 1362, 20), '#3f6e9a'));
  let w1 = '';
  for (const [x, y, r] of [[854, 1358, 22], [894, 1352, 24], [930, 1362, 20]]) for (let k = -1; k <= 1; k++) w1 += curve([[x - r * 0.8, y + k * r * 0.4], [x, y + k * r * 0.45 + 4], [x + r * 0.8, y + k * r * 0.4]]);
  scene(stroke(w1, '#3a2a22', 1, { opacity: 0.35 }));
  scene(...place(basket(150, 66, '#b8864f'), { x: 892, y: 1430 }));
  scene(stroke(curve([[820, 1370], [892, 1290], [964, 1370]]), '#8a6038', 6), stroke(curve([[820, 1370], [892, 1290], [964, 1370]]), '#c49a5c', 2));
  scene(stroke(curve([[930, 1380], [990, 1420], [1010, 1460], [1060, 1470]]), '#3f6e9a', 2));
}
target('yarn', 'Red ball of yarn', place(yarnBall('#b2523e'), { x: 1040, y: 1440, s: 0.9 }));

// log basket and kindling, left front
{
  const s: Shape[] = [];
  const g = rng(221);
  for (let i = 0; i < 7; i++) {
    const x = 70 + i * 32 + g.range(-6, 6), y = 1290 - (i % 2) * 16;
    s.push(sh(rect(x - 14, y - 60, 28, 120, 10), '#6b4a2f'), sh(rect(x - 10, y - 60, 6, 120, 3), '#8f6a45'), ...place(logEnd(14, 300 + i), { x, y: y - 60 }));
  }
  scene(...s);
  scene(...place(basket(270, 110, '#a5754a'), { x: 160, y: 1430 }));
  scene(sh(rect(10, 1428, 300, 8, 3), '#2a1c18', { opacity: 0.25 }));
}
target('mouse', 'Mouse', place(mouse(), { x: 332, y: 1438, s: 0.9 }));
// wood chips, a dropped leaf, a stool on the right
{
  const g = rng(231);
  let chips = '';
  for (let i = 0; i < 18; i++) chips += ellipse(g.range(30, 420), g.range(1446, 1490), g.range(4, 9), g.range(1.5, 3), g.range(0, 180));
  scene(sh(chips, '#c49a5c'));
  scene(sh(leaf(720, 1460, 28, 9, 30) + leaf(760, 1478, 22, 7, -160), '#b8864f'));
  // three-legged stool
  scene(stroke(line([[1080, 1250], [1050, 1400]]) + line([[1140, 1250], [1168, 1396]]) + line([[1110, 1252], [1112, 1410]]), '#6b4a2f', 9), sh(ellipse(1110, 1244, 74, 18), '#8f6a45'), sh(ellipse(1110, 1240, 70, 15), '#b8864f'), stroke(line([[1062, 1340], [1158, 1340]]), '#6b4a2f', 6));
  // broom leaning on the dresser
  scene(stroke(line([[1170, 760], [1130, 1240]]), '#a5754a', 7), sh(blob([[1114, 1210], [1146, 1214], [1160, 1310], [1100, 1316]], 0.6), '#d9b46a'), stroke(line([[1114, 1240], [1110, 1312]]) + line([[1126, 1240], [1124, 1314]]) + line([[1138, 1240], [1140, 1314]]) + line([[1148, 1240], [1154, 1312]]), '#a98242', 1.4), sh(rect(1112, 1206, 38, 10, 3), '#b2523e'));
}

// cat's saucer of milk, apples rolled from a bowl, clogs by the stool
scene(sh(ellipse(780, 1400, 30, 8), '#e7dcc4'), sh(ellipse(780, 1398, 22, 5), '#fffaf0'), stroke(ellipse(780, 1400, 30, 8), '#3f6e9a', 1.5));
scene(sh(circle(640, 1460, 13), '#c8423a'), sh(circle(636, 1455, 4), '#ef7a68', { opacity: 0.8 }), stroke(line([[640, 1448], [642, 1440]]), '#4a3220', 2), sh(circle(470, 1470, 12), '#8db35e'), stroke(line([[470, 1459], [472, 1452]]), '#4a3220', 2));
scene(sh(blob([[1094, 1478], [1090, 1462], [1102, 1452], [1146, 1454], [1158, 1470], [1152, 1482]], 0.8), '#8a613c'), sh(ellipse(1112, 1462, 13, 5.5), '#3e2a1a'), sh(blob([[1116, 1496], [1114, 1480], [1126, 1472], [1172, 1474], [1186, 1488], [1180, 1499]], 0.8), '#7a5333'), sh(ellipse(1134, 1482, 12, 5), '#3e2a1a'));
{
  const g = rng(241);
  let st = '';
  for (let i = 0; i < 30; i++) st += ellipse(g.range(40, 1160), g.range(1150, 1490), g.range(2, 5), g.range(1, 2));
  scene(sh(st, '#4a4438', { opacity: 0.45 }));
}

// ------------------------------------------------------------------ light
scene(sh(rect(0, 0, WD, HT), `url(#${ID}-firelight)`, { opacity: 0.25 }));
scene(sh(poly([[WX, WY], [WX + WW, WY], [700, 1500], [300, 1500]]), '#fff6d2', { opacity: 0.05 }));
scene(sh(rect(0, 0, WD, HT), `url(#${ID}-vignette)`, { opacity: 0.25 }));

function books(n: number, seed: number, h: number): Shape[] {
  const g = rng(seed);
  const out: Shape[] = [];
  let x = 0;
  for (let i = 0; i < n; i++) { const w = g.range(8, 12), hh = h * g.range(0.75, 1), c = g.pick(['#7a4d6a', '#5f8a6a', '#a9483a', '#3f5f7a']); out.push(sh(rect(x, -hh, w, hh, 1), c), sh(rect(x + 1.5, -hh * 0.8, w - 3, 2.5), shade(c, 0.35))); x += w + 1; }
  return out;
}

const activity: FindActivity = {
  id: ID, version: 1, mode: 'find',
  title: 'The Cottage Kitchen',
  blurb: 'A warm stone hearth with a bubbling pot, copper pans, a well-stocked dresser and a cat asleep by the fire.',
  collectionId: 'woodland',
  categories: ['Woodland', 'Kitchen', 'Cozy', 'Interiors'],
  difficulty: 'Moderate',
  width: WD, height: HT,
  defs:
    linearGradient(`${ID}-wall`, [[0, '#e9dcbc'], [0.6, '#e2cfa8'], [1, '#c9b08a']]) +
    linearGradient(`${ID}-sky`, [[0, '#a9cfe0'], [0.6, '#d6e8e4'], [1, '#e9eed6']]) +
    radialGradient(`${ID}-fireback`, [[0, '#6a2e18'], [0.45, '#3a1e14'], [1, '#140c0a']], 0.5, 0.85, 0.7) +
    `<linearGradient id="${ID}-floorglow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a1c18" stop-opacity="0.35"/><stop offset="1" stop-color="#2a1c18" stop-opacity="0.05"/></linearGradient>` +
    `<radialGradient id="${ID}-firelight" cx="0.45" cy="0.68" r="0.55"><stop offset="0" stop-color="#ffb04a" stop-opacity="0.85"/><stop offset="1" stop-color="#ffb04a" stop-opacity="0"/></radialGradient>` +
    `<radialGradient id="${ID}-vignette" cx="0.5" cy="0.5" r="0.75"><stop offset="0.65" stop-color="#2a1c18" stop-opacity="0"/><stop offset="1" stop-color="#2a1c18" stop-opacity="1"/></radialGradient>`,
  items,
};
export default activity;
