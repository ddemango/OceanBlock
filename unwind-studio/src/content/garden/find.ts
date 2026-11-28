import { blob, circle, curve, ellipse, leaf, line, linearGradient, petal, place, poly, rect, rng, sector, sh, shade, stroke } from '../../art/kit';
import type { Pt } from '../../art/geometry';
import type { Shape } from '../../art/types';
import type { FindActivity, FindItem } from '../types';
import { C, bee, bird, blossomPath, bricks, bucket, bush, butterfly, ladybird, leafClump, polar, pot, roseBud, snail, soil, trailer, wateringCan } from './props';

const W = 1200, H = 1500;
const ID = 'garden-find';
const items: FindItem[] = [];
const scene = (...s: Shape[]) => { items.push({ shapes: s }); };
const target = (id: string, name: string, s: Shape[]) => { items.push({ id, name, target: true, shapes: s }); };

// =================================================================== target props
function trowel(): Shape[] {
  return [
    sh(rect(0, -7, 36, 14, 7), '#b5763f'), sh(rect(4, -7, 28, 5, 2.5), '#d39a5e'), sh(circle(5, 0, 2), '#6e4a2e'),
    sh(rect(34, -5, 13, 10, 2), '#8d979e'),
    sh(poly([[46, -3], [58, -4], [58, 4], [46, 3]]), '#7a858c'),
    sh(blob([[55, 0], [62, -15], [84, -15], [103, 0], [84, 15], [62, 15]], 0.8), '#aab4ba'),
    sh(blob([[60, -2], [65, -12], [84, -12], [98, -2]], 0.8), '#d3dade'),
    stroke(line([[58, 0], [98, 0]]), '#7a858c', 1.4),
    sh(blob([[86, 4], [98, 2], [100, 6], [90, 12]], 1), '#5a4334', { opacity: 0.8 }),
  ];
}

function secateurs(): Shape[] {
  const red = '#cf4a3c';
  const up = blob([[2, -5], [-22, -15], [-50, -17], [-64, -11], [-60, -4], [-46, -8], [-24, -6], [-2, 3]], 0.9);
  const dn = blob([[2, 5], [-22, 16], [-50, 20], [-64, 15], [-61, 8], [-46, 11], [-24, 8], [-2, -3]], 0.9);
  return [
    stroke(line([[-16, -8], [-20, 0], [-14, 2], [-20, 6], [-16, 10]]), '#7a858c', 1.6),
    sh(blob([[-2, 3], [14, 9], [32, 5], [38, 9], [20, 16], [2, 9]], 0.9), '#77828a'),
    sh(blob([[-2, -3], [12, -13], [34, -12], [44, -4], [22, 2]], 0.9), '#b9c2c8'),
    sh(blob([[6, -5], [14, -11], [32, -10], [38, -5]], 0.9), '#e2e7ea'),
    sh(dn, shade(red, -0.18)), sh(up, red),
    sh(blob([[-22, -13], [-48, -15], [-58, -11], [-46, -11], [-24, -9]], 0.9), shade(red, 0.3), { opacity: 0.8 }),
    sh(circle(0, 0, 5.5), '#5d666c'), sh(circle(0, 0, 2.2), '#d3dade'),
    sh(rect(-66, 2, 7, 5, 2), '#3a3a3a'),
  ];
}

function seedPacket(): Shape[] {
  return [
    sh(rect(-24, -32, 48, 64, 2), '#f6ecd2'),
    sh(rect(-24, -32, 48, 15), '#d9624e'),
    stroke(line([[-24, -26], [24, -26]]), '#f6ecd2', 1, { opacity: 0.7 }),
    stroke(line([[-13, -22], [13, -22]]), '#fff7e6', 2.2),
    stroke(curve([[0, 20], [-2, 8], [0, -2]]), C.leaf, 2),
    sh(leaf(0, 12, 13, 4, -150) + leaf(-1, 8, 13, 4, -28), C.leafLight),
    sh(blossomPath(0, -3, 10, 6, 0.5), '#f2a23a'), sh(circle(0, -3, 3.4), '#8a4f24'),
    stroke(line([[-15, 24], [15, 24]]) + line([[-10, 28], [10, 28]]), '#9a8f7a', 1.4),
    stroke(rect(-24, -32, 48, 64, 2), '#c9b98f', 1.2),
  ];
}

function nest(): Shape[] {
  const g = rng(31);
  const out: Shape[] = [];
  let tw = '', tw2 = '';
  for (let i = 0; i < 26; i++) {
    const a = g.range(0, 360), r = g.range(30, 50);
    const [x, y] = polar(0, -16, r, a);
    const l = line([[x * 0.9, y * 0.5 - 6], [x * 0.9 + g.range(-22, 22), y * 0.5 - 6 + g.range(-7, 7)]]);
    if (i % 2) tw += l; else tw2 += l;
  }
  out.push(sh(blob([[-46, -22], [-40, -4], [-18, 2], [18, 2], [40, -4], [46, -22], [30, -32], [-30, -32]], 0.9), '#8a633c'));
  out.push(sh(blob([[-40, -8], [-18, 0], [18, 0], [40, -8], [20, -6], [-20, -6]], 0.9), '#6b4a2b'));
  out.push(stroke(tw, '#b58a54', 2), stroke(tw2, '#5c3f24', 1.8));
  out.push(sh(ellipse(0, -26, 44, 12), '#a47a4a'), sh(ellipse(0, -25, 34, 8.5), '#4b331f'));
  out.push(sh(ellipse(-15, -29, 10, 12, -18), '#a9d5d8'), sh(ellipse(15, -28, 10, 12, 20), '#9fcbd0'), sh(ellipse(0, -32, 10.5, 12.5), '#bfe3e4'));
  out.push(sh(circle(-17, -32, 1.2) + circle(-12, -27, 1) + circle(2, -36, 1.2) + circle(-3, -30, 1) + circle(14, -32, 1.1) + circle(18, -26, 1) + circle(4, -27, 1), '#7b6a55'));
  out.push(sh(ellipse(-3, -37, 4, 3, -20), '#ffffff', { opacity: 0.6 }));
  out.push(stroke(curve([[-44, -24], [-20, -15], [20, -15], [44, -24]]) + line([[-48, -24], [-58, -30]]) + line([[46, -22], [58, -30]]) + line([[-30, -32], [-38, -42]]) + line([[34, -30], [44, -40]]), '#b58a54', 2));
  return out;
}

function glove(col: string, cuff: string): Shape[] {
  const dk = shade(col, -0.18);
  return [
    sh(rect(-13, -26, 26, 26, 3), cuff), stroke(line([[-13, -18], [13, -18]]) + line([[-13, -10], [13, -10]]), shade(cuff, -0.25), 1.6),
    sh(ellipse(18, -40, 6.5, 14, 32), dk),
    sh(rect(-17, -52, 34, 30, 8), col),
    sh(rect(-17, -76, 8, 30, 4) + rect(-8, -82, 8, 36, 4) + rect(1, -80, 8, 34, 4) + rect(10, -73, 7.5, 28, 3.7), col),
    stroke(line([[-8.5, -70], [-8.5, -50]]) + line([[0.5, -74], [0.5, -50]]) + line([[9.5, -70], [9.5, -50]]), dk, 1.3),
    sh(blob([[-12, -44], [0, -48], [12, -44], [10, -30], [-10, -30]], 1), shade(col, 0.22), { opacity: 0.7 }),
  ];
}
function gloves(): Shape[] {
  return [...place(glove('#e3b65a', '#5f9150'), { rot: -28, x: -12, y: 4 }), ...place(glove('#ecc46c', '#6fa15e'), { rot: 24, x: 14, y: 8 })];
}

function twine(): Shape[] {
  const c = '#c9a66b';
  let a = '', b = '';
  for (let i = -3; i <= 3; i++) {
    a += curve([[-20 + Math.abs(i) * 2, i * 6 - 6], [0, i * 6.4 + 2], [20 - Math.abs(i) * 2, i * 6 - 4]]);
    b += curve([[i * 6 - 6, -20 + Math.abs(i) * 2], [i * 6.4 + 3, 0], [i * 6 - 2, 20 - Math.abs(i) * 2]]);
  }
  return [
    stroke(curve([[14, 16], [30, 24], [42, 18], [50, 26], [60, 22]]), '#b08d52', 2.2),
    sh(circle(0, 0, 23), shade(c, -0.2)), sh(circle(-2, -2, 20.5), c),
    stroke(b, shade(c, -0.3), 1.3), stroke(a, shade(c, 0.3), 1.4),
    sh(ellipse(-8, -9, 7, 4.5, -30), '#ffffff', { opacity: 0.3 }),
    sh(ellipse(1, 1, 4.5, 3.5), '#6e5231'),
  ];
}

function key(): Shape[] {
  const brass = '#c29a3c', dk = '#8a6a22';
  return [
    stroke(curve([[0, -22], [-3, -12], [0, -2]]), '#b9a27a', 1.5),
    sh(sector(0, 10, 12, 0, 360, 6.5), brass), stroke(circle(0, 10, 12), dk, 1),
    sh(rect(-4.5, 20, 9, 5, 1.5), dk),
    sh(rect(-2.8, 24, 5.6, 40, 1.5), brass), sh(rect(0.6, 24, 2.2, 40), dk, { opacity: 0.6 }),
    sh(rect(2.8, 46, 10, 5.5, 1) + rect(2.8, 55, 7.5, 5, 1) + rect(2.8, 51, 4, 5), brass),
    sh(ellipse(-5, 5, 2.4, 4, 30), '#f1dc9a', { opacity: 0.8 }),
  ];
}

function acorn(): Shape[] {
  return [
    stroke(curve([[0, -19], [2, -25], [7, -27]]), '#6b4a2b', 2.4),
    sh(blob([[-10.5, -4], [-10, 10], [-4, 19], [0, 23], [4, 19], [10, 10], [10.5, -4]], 0.9), '#c2914e'),
    sh(blob([[-7, -2], [-7, 8], [-3, 16], [-2, 2]], 0.9), '#e2bb7c', { opacity: 0.85 }),
    sh(blob([[-13, -6], [-11, -15], [0, -20], [11, -15], [13, -6], [0, -2]], 0.9), '#7a5a36'),
    stroke(line([[-9, -14], [-5, -4]]) + line([[-3, -18], [1, -3]]) + line([[4, -18], [7, -4]]) + line([[-11, -9], [11, -12]]) + line([[-10, -5], [12, -7]]), '#56391f', 1),
    sh(ellipse(-4, -14, 4, 2, -20), '#a17c50', { opacity: 0.8 }),
  ];
}

function mushroom(): Shape[] {
  return [
    sh(blob([[-7, 0], [-6, -18], [-5, -30], [5, -30], [6, -18], [8, 0]], 0.7), '#f4ead6'),
    sh(blob([[2, 0], [2, -28], [5, -30], [6, -18], [8, 0]], 0.7), '#d9cdb4'),
    sh(blob([[-9, -19], [0, -16], [9, -19], [7, -23], [-7, -23]], 0.8), '#e9dfc8'),
    sh(ellipse(0, -29, 23, 6), '#e6d9bd'),
    sh(blob([[-25, -29], [-22, -42], [-10, -52], [4, -54], [17, -48], [25, -36], [25, -29], [0, -25]], 0.9), '#d6453b'),
    sh(blob([[6, -53], [17, -48], [25, -36], [25, -29], [12, -27], [16, -38]], 0.9), '#b43229'),
    sh(ellipse(-12, -40, 4.5, 3.5, -30) + ellipse(0, -47, 4, 3) + ellipse(12, -40, 3.6, 3) + ellipse(-3, -34, 3, 2.4) + ellipse(-19, -33, 2.6, 2.2) + ellipse(19, -32, 2.6, 2.2), '#fff8ec'),
    // a baby one beside it
    sh(blob([[15, 0], [15, -9], [20, -9], [21, 0]], 0.6), '#f4ead6'),
    sh(blob([[8, -9], [11, -17], [18, -20], [25, -16], [27, -9], [18, -7]], 0.9), '#d6453b'),
    sh(circle(14, -13, 1.6) + circle(20, -15, 1.6) + circle(23, -11, 1.3), '#fff8ec'),
  ];
}

function frog(): Shape[] {
  const g1 = '#6faa4a', g2 = '#4f8a3a', pale = '#d8e6a6';
  return [
    sh(blob([[-30, -2], [-34, -14], [-22, -26], [-4, -20], [2, -6], [-6, 0]], 1), g2),
    sh(blob([[-34, 0], [-22, -5], [-6, -3], [2, 1], [-14, 3], [-36, 3]], 0.8), g2),
    sh(blob([[-22, -8], [-22, -24], [-6, -35], [14, -34], [30, -24], [32, -14], [22, -5], [0, -2]], 1), g1),
    sh(blob([[2, -4], [8, -14], [22, -17], [31, -15], [24, -5]], 1), pale),
    sh(circle(1, -35, 6.5), g2), sh(circle(15, -35, 8), g1),
    sh(circle(16, -36, 5), '#f0c64a'), sh(ellipse(16.5, -36, 3.4, 2), '#1f2a1a'), sh(circle(15, -37.5, 1.1), '#ffffff'),
    sh(circle(1.5, -36, 3.4), '#f0c64a'), sh(ellipse(2, -36, 2.2, 1.4), '#1f2a1a'),
    stroke(curve([[6, -19], [18, -17], [31, -18]]), '#2f5a26', 1.5),
    sh(circle(29, -24, 1), '#2f5a26'),
    sh(blob([[10, -12], [16, -12], [18, -2], [24, 1], [12, 2], [11, -2]], 0.8), g2),
    stroke(line([[14, 1], [10, 4]]) + line([[18, 1], [18, 5]]) + line([[22, 1], [26, 4]]) + line([[-30, 2], [-38, 5]]) + line([[-24, 3], [-28, 7]]), g2, 2),
    sh(ellipse(-10, -24, 4, 2.6, -20) + ellipse(0, -28, 3, 2) + ellipse(-16, -15, 3.4, 2.2) + ellipse(8, -29, 2.4, 1.8), '#3f7530', { opacity: 0.8 }),
    sh(ellipse(-2, -30, 9, 3, -14), '#a9d47c', { opacity: 0.6 }),
  ];
}

// =================================================================== scenery props
const TERRA = [C.terracotta, C.terraLight, C.terraDark, '#d68a62', '#b9664a', '#c9805e'];

function succulent(r: number, col: string): Shape[] {
  const out: Shape[] = [];
  for (const [n, rr, c, off] of [[8, r, shade(col, -0.18), 0], [7, r * 0.72, col, 20], [5, r * 0.45, shade(col, 0.25), 8]] as [number, number, string, number][]) {
    let d = '';
    for (let i = 0; i < n; i++) d += leaf(0, 0, rr, rr * 0.34, -180 + off + (i * 180) / (n - 1) * 1 - 0);
    out.push(sh(d, c));
  }
  return out;
}
function cactus(h: number, col = '#5f9a6a'): Shape[] {
  let sp = '';
  for (let i = 0; i < 7; i++) sp += line([[-h * 0.16, -h * (0.15 + i * 0.11)], [-h * 0.24, -h * (0.18 + i * 0.11)]]) + line([[h * 0.16, -h * (0.15 + i * 0.11)], [h * 0.24, -h * (0.18 + i * 0.11)]]);
  return [
    sh(rect(-h * 0.2, -h, h * 0.4, h, h * 0.2), col), sh(rect(-h * 0.05, -h * 0.96, h * 0.1, h * 0.94, h * 0.05), shade(col, 0.2)),
    sh(rect(h * 0.2, -h * 0.62, h * 0.24, h * 0.14, h * 0.07) + rect(h * 0.32, -h * 0.82, h * 0.13, h * 0.3, h * 0.06), shade(col, -0.1)),
    stroke(sp, '#f3ecd2', 1),
    sh(blossomPath(0, -h, h * 0.12, 6, 0.5), C.peony), sh(circle(0, -h, h * 0.04), C.yellow),
  ];
}
function seedlings(w: number, n: number, seed: number, h = 22): Shape[] {
  const g = rng(seed);
  let st = '', a = '', b = '';
  for (let i = 0; i < n; i++) {
    const x = -w / 2 + (w * (i + 0.5)) / n + g.range(-2, 2), hh = h * g.range(0.7, 1.2);
    st += line([[x, 0], [x + g.range(-2, 2), -hh]]);
    a += leaf(x, -hh, hh * 0.45, hh * 0.16, -150 + g.range(-15, 15));
    b += leaf(x, -hh, hh * 0.45, hh * 0.16, -30 + g.range(-15, 15));
  }
  return [stroke(st, '#7fae5c', 1.6), sh(a, C.leafLight), sh(b, C.leaf)];
}
function geranium(seed: number, col: string): Shape[] {
  const g = rng(seed);
  const out: Shape[] = [];
  let lv = '', lv2 = '', st = '';
  for (let i = 0; i < 12; i++) {
    const x = g.range(-46, 46), y = -g.range(10, 70);
    st += line([[x * 0.2, 0], [x, y]]);
    const d = blossomPath(x, y, g.range(12, 17), 7, 0.82, g.range(0, 50));
    if (i % 2) lv += d; else lv2 += d;
  }
  out.push(stroke(st, C.leafDark, 2), sh(lv2, C.leafDark), sh(lv, C.leaf));
  for (let i = 0; i < 4; i++) {
    const x = g.range(-40, 40), y = -g.range(80, 118);
    out.push(stroke(line([[x * 0.3, -20], [x, y]]), C.moss, 2));
    let fl = '';
    for (let k = 0; k < 7; k++) fl += blossomPath(x + g.range(-11, 11), y + g.range(-9, 9), 6, 5, 0.55, g.range(0, 72));
    out.push(sh(fl, i % 2 ? col : shade(col, 0.2)), sh(circle(x, y, 2), C.yellow));
  }
  return out;
}
function herb(seed: number, w: number, h: number, col: string): Shape[] {
  const g = rng(seed);
  let a = '', b = '', c = '';
  for (let i = 0; i < 26; i++) {
    const x = g.range(-w / 2, w / 2), y = -g.range(4, h) * (1 - Math.abs(x) / w * 0.8);
    const d = leaf(x, y, g.range(10, 16), g.range(4, 6.5), g.range(180, 360));
    if (i % 3 === 0) a += d; else if (i % 3 === 1) b += d; else c += d;
  }
  return [sh(blob([[-w * 0.42, 0], [-w * 0.46, -h * 0.5], [0, -h * 0.86], [w * 0.46, -h * 0.5], [w * 0.42, 0]], 1), shade(col, -0.25)), sh(a, shade(col, -0.1)), sh(b, col), sh(c, shade(col, 0.22))];
}
/** A pot with something growing in it; origin bottom-centre. */
function potted(w: number, h: number, top: Shape[], col = C.terracotta): Shape[] {
  return [...pot(w, h, col), ...place(soil(w), { y: -h + 1 }), ...place(top, { y: -h + 2 })];
}
function jar(w: number, h: number, inside: Shape[] = [], lid = '#b9a27a'): Shape[] {
  return [
    sh(rect(-w / 2, -h, w, h, w * 0.18), '#d5ebe6', { opacity: 0.75 }),
    ...inside,
    stroke(rect(-w / 2, -h, w, h, w * 0.18), '#8fb5ae', 1.4),
    sh(rect(-w / 2 + 3, -h + 6, 4, h - 14, 2), '#ffffff', { opacity: 0.7 }),
    sh(rect(-w / 2 - 1, -h - 6, w + 2, 9, 2), lid), sh(rect(-w / 2 - 1, -h - 1, w + 2, 3), shade(lid, -0.25)),
  ];
}
function potStack(n: number, w: number, col = C.terracotta): Shape[] {
  const out: Shape[] = [];
  for (let i = 0; i < n; i++) out.push(...place(pot(w, w * 0.8, TERRA[(i * 2) % TERRA.length] ?? col), { y: -i * w * 0.24 }));
  return out;
}
function crate(w: number, h: number, col = '#b98f5e'): Shape[] {
  const out: Shape[] = [sh(rect(-w / 2, -h, w, h), shade(col, -0.45))];
  const n = 4, sl = h / n;
  for (let i = 0; i < n; i++) out.push(sh(rect(-w / 2, -h + i * sl + 2, w, sl - 5, 1.5), i % 2 ? col : shade(col, 0.1)), stroke(line([[-w / 2 + 14, -h + i * sl + sl * 0.5], [w / 2 - 20, -h + i * sl + sl * 0.45]]), shade(col, -0.2), 1));
  out.push(sh(rect(-w / 2, -h, 12, h) + rect(w / 2 - 12, -h, 12, h), shade(col, -0.14)));
  let nails = '';
  for (let i = 0; i < n; i++) nails += circle(-w / 2 + 6, -h + i * sl + sl * 0.5, 1.6) + circle(w / 2 - 6, -h + i * sl + sl * 0.5, 1.6);
  out.push(sh(nails, '#5c4630'));
  return out;
}
function basket(w: number, h: number): Shape[] {
  const col = '#c9a368';
  const out: Shape[] = [sh(blob([[-w / 2, -h], [w / 2, -h], [w * 0.42, -h * 0.1], [w * 0.3, 0], [-w * 0.3, 0], [-w * 0.42, -h * 0.1]], 0.5), col)];
  let weave = '';
  for (let r = 0; r < 5; r++) for (let i = 0; i < 9; i++) if ((i + r) % 2) weave += rect(-w * 0.44 + i * w * 0.1, -h + 8 + r * (h - 12) / 5, w * 0.085, (h - 12) / 5 - 3, 2);
  out.push(sh(weave, shade(col, -0.2)), sh(rect(-w / 2 - 3, -h - 4, w + 6, 10, 5), shade(col, 0.15)), stroke(line([[-w / 2, -h + 1], [w / 2, -h + 1]]), shade(col, -0.3), 1.2));
  return out;
}
function metalBucket(w: number, h: number): Shape[] {
  const c = '#aab3b8';
  return [
    stroke(curve([[-w * 0.46, -h + 4], [0, -h - w * 0.5], [w * 0.46, -h + 4]]), '#6d767c', 3),
    sh(poly([[-w / 2, -h], [w / 2, -h], [w * 0.38, 0], [-w * 0.38, 0]]), c),
    sh(poly([[w * 0.14, -h], [w / 2, -h], [w * 0.38, 0], [w * 0.1, 0]]), shade(c, -0.18)),
    sh(poly([[-w * 0.4, -h], [-w * 0.28, -h], [-w * 0.22, 0], [-w * 0.32, 0]]), shade(c, 0.35)),
    sh(rect(-w / 2 - 2, -h - 3, w + 4, 8, 4), shade(c, 0.2)),
    sh(rect(-w * 0.44, -h * 0.62, w * 0.88, 4) + rect(-w * 0.41, -h * 0.3, w * 0.82, 4), shade(c, -0.3), { opacity: 0.6 }),
    sh(circle(-w * 0.46, -h + 5, 3) + circle(w * 0.46, -h + 5, 3), '#6d767c'),
  ];
}
function boot(col = '#4f7a5a'): Shape[] {
  return [
    sh(blob([[-16, -86], [16, -86], [17, -30], [44, -16], [48, -4], [44, 0], [-18, 0], [-18, -40]], 0.45), col),
    sh(blob([[6, -86], [16, -86], [17, -30], [44, -16], [48, -4], [30, -8], [8, -22]], 0.45), shade(col, -0.18)),
    sh(rect(-18, -92, 36, 10, 3), shade(col, 0.2)), sh(rect(-20, -3, 68, 6, 2), '#2f3a30'),
    sh(rect(-12, -80, 5, 44, 2.5), '#ffffff', { opacity: 0.25 }),
    sh(blob([[20, -6], [34, -12], [44, -6], [40, -3]], 1), '#7a6a4e', { opacity: 0.7 }),
  ];
}
function handFork(): Shape[] {
  return [
    sh(rect(-6, 0, 12, 40, 6), '#b5763f'), sh(rect(-4, 4, 4, 30, 2), '#d39a5e'), sh(circle(0, 6, 2), '#5c3f24'), sh(rect(-4.5, 38, 9, 12, 2), '#8d979e'),
    sh(poly([[-13, 58], [13, 58], [9, 50], [-9, 50]]), '#9aa4aa'),
    sh(rect(-13, 56, 5, 36, 2.5) + rect(-2.5, 56, 5, 40, 2.5) + rect(8, 56, 5, 36, 2.5), '#aab4ba'),
    sh(rect(-12, 58, 1.6, 30) + rect(-1.5, 58, 1.6, 34) + rect(9, 58, 1.6, 30), '#dfe5e8'),
  ];
}
function handBrush(): Shape[] {
  let br = '';
  for (let i = 0; i < 9; i++) br += line([[-20 + i * 5, 58], [-22 + i * 5.5, 86]]);
  return [sh(rect(-5, 0, 10, 36, 5), '#a37548'), sh(circle(0, 7, 2), '#5c3f24'), sh(rect(-22, 34, 44, 24, 6), '#8a633c'), sh(rect(-22, 34, 44, 8, 4), '#a37548'), sh(poly([[-22, 56], [22, 56], [26, 88], [-26, 88]]), '#e3cf9a'), stroke(br, '#b99f62', 1.2)];
}
function dibber(): Shape[] {
  return [sh(rect(-13, 0, 26, 10, 5), '#a37548'), sh(circle(0, 5, 2), '#5c3f24'), sh(poly([[-6, 10], [6, 10], [2.5, 74], [0, 80], [-2.5, 74]]), '#c59a69'), sh(poly([[1, 10], [6, 10], [2.5, 74], [0, 80]]), '#a37548'), stroke(line([[-5, 28], [5, 28]]) + line([[-4, 44], [4, 44]]) + line([[-3, 58], [3, 58]]), '#6e4a2e', 1)];
}
function lavenderBunch(seed: number): Shape[] {
  const g = rng(seed);
  let st = '', a = '', b = '';
  for (let i = 0; i < 12; i++) {
    const x = g.range(-16, 16);
    st += line([[x * 0.25, 0], [x, 58]]);
    for (let k = 0; k < 5; k++) { const e = ellipse(x + g.range(-1.5, 1.5), 58 + k * 6, 3.6, 3.4); if ((i + k) % 2) a += e; else b += e; }
  }
  return [stroke(line([[0, -30], [0, 0]]), '#b9a27a', 1.4), stroke(st, '#8fa37a', 1.3), sh(b, C.lavDark), sh(a, C.lavender), sh(rect(-6, 2, 12, 9, 2), '#c9a66b'), stroke(line([[-6, 5], [6, 5]]) + line([[-6, 8], [6, 8]]), '#8a6a3a', 1)];
}
function hangingBasket(seed: number): Shape[] {
  const out: Shape[] = [];
  out.push(stroke(line([[0, -150], [-50, 0]]) + line([[0, -150], [50, 0]]) + line([[0, -150], [0, 0]]), '#6d6a60', 1.6), sh(circle(0, -150, 4), '#4a4a48'));
  out.push(...place(trailer(110, C.leaf, seed, 7), { y: 14 }));
  out.push(sh(blob([[-56, 0], [56, 0], [44, 36], [20, 50], [-20, 50], [-44, 36]], 0.7), '#8a6a48'));
  let w = '';
  for (let i = 0; i < 9; i++) w += line([[-50 + i * 12.5, 2], [-38 + i * 9.5, 46]]) + line([[50 - i * 12.5, 2], [38 - i * 9.5, 46]]);
  out.push(stroke(w, '#6a4f34', 1.2), sh(rect(-58, -4, 116, 8, 4), '#a58460'));
  out.push(...place(herb(seed + 1, 110, 56, C.leaf), { y: -2 }));
  const g = rng(seed + 2);
  for (let i = 0; i < 9; i++) out.push(...place(roseBud(g.range(6, 9), g.pick([C.peony, C.rose, '#f6d66a', C.white, C.lavender])), { x: g.range(-48, 48), y: -g.range(6, 44) }));
  out.push(...place(trailer(90, C.leafLight, seed + 3, 4), { y: 10 }));
  return out;
}
function sack(): Shape[] {
  const c = '#cdb98f';
  return [
    sh(blob([[-112, 0], [-118, -70], [-100, -148], [-60, -168], [20, -160], [86, -172], [112, -120], [118, -40], [108, 0]], 0.7), c),
    sh(blob([[40, 0], [60, -80], [50, -162], [86, -172], [112, -120], [118, -40], [108, 0]], 0.7), shade(c, -0.14)),
    sh(blob([[-80, -150], [-96, -182], [-60, -176], [-30, -190], [-6, -172], [-40, -160]], 0.8), shade(c, -0.08)),
    stroke(curve([[-70, -160], [-40, -168], [-10, -162]]), '#8a6a3a', 3),
    sh(rect(-78, -116, 96, 70, 4), '#e9dcba'), sh(blossomPath(-30, -84, 20, 6, 0.55), C.leaf), sh(circle(-30, -84, 6), C.leafLight),
    stroke(line([[-66, -54], [6, -56]]) + line([[-2, -98], [10, -98]]) + line([[-2, -86], [12, -86]]) + line([[-2, -74], [8, -74]]), '#8a7a58', 2),
    stroke(curve([[-104, -40], [-96, -90], [-100, -130]]) + curve([[70, -30], [80, -90], [70, -150]]), shade(c, -0.25), 1.4),
  ];
}
function label(col = '#f3ead2'): Shape[] {
  return [sh(poly([[-4, 0], [4, 0], [5, -30], [0, -36], [-5, -30]]), col), stroke(line([[-2, -26], [2, -26]]) + line([[-2, -21], [2, -21]]) + line([[-2, -16], [2, -16]]), '#8a7a58', 1)];
}

// =================================================================== the view outside
scene(sh(rect(0, 0, W, H), `url(#${ID}-sky)`));
{
  const g = rng(11);
  const far: Shape[] = [];
  far.push(sh(blob([[-20, 470], [150, 420], [330, 450], [520, 410], [720, 446], [900, 414], [1220, 440], [1220, 900], [-20, 900]], 0.9), '#bcdcc0'));
  const greens = ['#8fbf8a', '#a3cc92', '#7fb383', '#9cc7a0', '#b3d69a', '#86b88f'];
  for (let i = 0; i < 12; i++) far.push(...place(bush(40 + i, g.range(150, 230), g.range(180, 280), greens[i % greens.length], 14), { x: i * 108 + g.range(-30, 30), y: 640 + g.range(-10, 20) }));
  far.push(sh(blob([[-20, 640], [200, 610], [420, 630], [640, 604], [860, 632], [1220, 606], [1220, 900], [-20, 900]], 0.9), '#a8d08c'));
  let fl1 = '', fl2 = '', fl3 = '', spk = '';
  for (let i = 0; i < 90; i++) {
    const x = g.range(0, W), y = g.range(630, 820);
    const d = circle(x, y, g.range(5, 10));
    if (i % 3 === 0) fl1 += d; else if (i % 3 === 1) fl2 += d; else fl3 += d;
    if (i % 4 === 0) spk += leaf(x, y + 30, g.range(40, 70), 7, -90 + g.range(-10, 10));
  }
  far.push(sh(spk, '#b8a9e0'), sh(fl1, '#f3b6c8'), sh(fl2, '#fdf3d8'), sh(fl3, '#f6d98a'));
  far.push(sh(blob([[-20, 760], [300, 730], [600, 760], [900, 736], [1220, 770], [1220, 900], [-20, 900]], 0.9), '#93c47a'));
  scene(...far);
  // climbing rose pressed against the outside of the glass, top left
  scene(sh(rect(0, 0, W, 860), '#eaf6f2', { opacity: 0.22 }));
}

// =================================================================== glasshouse frame
const BAR = '#f4f1e4', BAR_D = '#cdc8b6';
{
  const fr: Shape[] = [];
  const g = rng(17);
  // pane tints & reflections
  let tintA = '', tintB = '', refl = '';
  for (let c = 0; c < 8; c++) for (let r = 0; r < 2; r++) {
    const x = c * 150 + 6, y = r ? 480 : 140, h = r ? 360 : 330;
    if ((c + r) % 2) tintA += rect(x, y, 138, h); else tintB += rect(x, y, 138, h);
    if (g.next() < 0.6) { const rx = x + g.range(10, 70), w = g.range(14, 30); refl += poly([[rx, y + 8], [rx + w, y + 8], [rx + w - 70, y + h - 8], [rx - 70, y + h - 8]].map(([px, py]) => [Math.max(x, px), py] as Pt)); }
  }
  fr.push(sh(tintA, '#bfe3df', { opacity: 0.2 }), sh(tintB, '#ffffff', { opacity: 0.12 }), sh(refl, '#ffffff', { opacity: 0.22 }));
  // roof panes: bars converge upwards
  const vx = (x: number) => 600 + (x - 600) * 0.7;
  for (let c = 0; c < 8; c++) fr.push(sh(poly([[c * 150, 120], [c * 150 + 150, 120], [vx(c * 150 + 150), 0], [vx(c * 150), 0]]), c % 2 ? '#d7ecf1' : '#c7e3ec', { opacity: 0.55 }));
  // leafy shadow of a tree over the roof
  let lv = '';
  for (let i = 0; i < 40; i++) lv += leaf(g.range(0, 520), g.range(0, 100), g.range(26, 44), 9, g.range(0, 360));
  fr.push(sh(lv, '#6fa477', { opacity: 0.45 }));
  let lv2 = '';
  for (let i = 0; i < 22; i++) lv2 += leaf(g.range(820, 1200), g.range(0, 84), g.range(24, 40), 8, g.range(0, 360));
  fr.push(sh(lv2, '#7fb383', { opacity: 0.4 }));
  let roofBars = '', roofSh = '';
  for (let c = 0; c <= 8; c++) {
    const x = c * 150, x2 = vx(x);
    roofBars += poly([[x - 5, 122], [x + 5, 122], [x2 + 4, 0], [x2 - 4, 0]]);
    roofSh += poly([[x + 2, 122], [x + 5, 122], [x2 + 4, 0], [x2 + 1.5, 0]]);
  }
  fr.push(sh(roofBars, BAR), sh(roofSh, BAR_D));
  fr.push(sh(rect(0, 56, W, 6), BAR), sh(rect(0, 60, W, 2), BAR_D));
  // wall bars
  let v = '', vs = '';
  for (let c = 0; c <= 8; c++) { v += rect(c * 150 - 7, 120, 14, 740); vs += rect(c * 150 + 3, 120, 4, 740); }
  fr.push(sh(v, BAR), sh(vs, BAR_D));
  fr.push(sh(rect(0, 112, W, 30), BAR), sh(rect(0, 134, W, 8), BAR_D), sh(rect(0, 112, W, 4), '#ffffff'));
  fr.push(sh(rect(0, 468, W, 14), BAR), sh(rect(0, 478, W, 4), BAR_D));
  // window stay and catch on one pane
  fr.push(stroke(line([[764, 474], [800, 450], [836, 474]]), '#6d6a60', 3), sh(circle(800, 450, 4), '#4a4a48'));
  scene(...fr);
}

// lavender bunches and a hanging basket from the eaves
scene(...place(lavenderBunch(3), { x: 228, y: 172 }), ...place(lavenderBunch(4), { x: 268, y: 160, rot: 6 }), ...place(lavenderBunch(5), { x: 190, y: 164, rot: -7 }));
scene(...place(hangingBasket(21), { x: 1066, y: 262 }));
// bunting of drying seed heads on a string
{
  const g = rng(29);
  const s: Shape[] = [stroke(curve([[456, 142], [560, 176], [680, 184], [800, 170], [896, 142]]), '#b9a27a', 1.5)];
  [[500, 160], [560, 176], [620, 182], [690, 184], [760, 176], [830, 162]].forEach(([x, y], i) => {
    s.push(stroke(line([[x, y], [x, y + 34]]), '#a8956a', 1.4));
    if (i % 2) { s.push(sh(circle(x, y + 44, 11), '#d9c08a'), sh(circle(x, y + 44, 6), '#b9975a')); let d = ''; for (let k = 0; k < 10; k++) d += line([polar(x, y + 44, 6, k * 36), polar(x, y + 44, 13, k * 36)]); s.push(stroke(d, '#a8854a', 1.2)); }
    else { let d = ''; for (let k = 0; k < 7; k++) d += petal(x, y + 36, g.range(16, 22), 4.5, 90 + (k - 3) * 22); s.push(sh(d, i % 4 ? '#e9c9a0' : '#d9a7b8'), sh(circle(x, y + 36, 4), '#8a6a3a')); }
  });
  scene(...s);
}

// =================================================================== shelves
function shelf(y: number, x0: number, x1: number, under: boolean): Shape[] {
  const out: Shape[] = [];
  for (let x = x0 + 60; x < x1; x += 300) {
    out.push(stroke(line([[x, y + 14], [x, y + 70]]) + line([[x - 44, y + 16], [x, y + 66]]), '#3f4347', 5));
    out.push(stroke(curve([[x - 38, y + 22], [x - 14, y + 30], [x - 8, y + 54]]), '#3f4347', 2.5));
  }
  out.push(sh(rect(x0, y, x1 - x0, 16, 2), '#b98f5e'), sh(rect(x0, y, x1 - x0, 4, 2), under ? '#d6b07c' : '#e0bd8a'), sh(rect(x0, y + 12, x1 - x0, 4, 2), '#8a633c'));
  let grain = '';
  const g = rng(y);
  for (let i = 0; i < 14; i++) { const x = g.range(x0 + 10, x1 - 80); grain += line([[x, y + 8 + g.range(-2, 2)], [x + g.range(30, 70), y + 8 + g.range(-2, 2)]]); }
  out.push(stroke(grain, '#9a7446', 1));
  return out;
}

const S1 = 330, S2 = 596;
// ---- upper shelf
scene(...shelf(S1, 30, 950, true));
scene(...place(potted(76, 62, [...herb(51, 80, 44, C.leaf), ...place(trailer(120, C.leaf, 52, 6), { y: 6 })]), { x: 88, y: S1 }));
scene(...place(trailer(150, C.leafLight, 53, 3), { x: 70, y: S1 - 52 }));
// wooden seed box with dividers
scene(sh(rect(150, S1 - 54, 110, 54, 2), '#a37548'), sh(rect(150, S1 - 54, 110, 10), '#c59a69'), sh(rect(156, S1 - 40, 98, 34, 2), '#8a633c'), stroke(line([[176, S1 - 30], [234, S1 - 30]]) + line([[186, S1 - 20], [224, S1 - 20]]), '#e9dcba', 2.4), sh(rect(158, S1 - 74, 20, 22, 1) + rect(206, S1 - 70, 20, 18, 1), '#f3ead2'), sh(rect(182, S1 - 78, 20, 26, 1) + rect(230, S1 - 76, 20, 24, 1), '#e3d2a4'), stroke(line([[162, S1 - 66], [174, S1 - 66]]) + line([[186, S1 - 70], [198, S1 - 70]]) + line([[210, S1 - 62], [222, S1 - 62]]) + line([[234, S1 - 68], [246, S1 - 68]]), '#b56a4a', 2));
// jar of dried seed heads
{
  const ins: Shape[] = [];
  let st = '', hd = '';
  for (let i = 0; i < 5; i++) { const x = -14 + i * 7; st += line([[x * 0.4, -4], [x * 1.6, -96 - (i % 2) * 14]]); hd += circle(x * 1.6, -100 - (i % 2) * 14, 7); }
  ins.push(stroke(st, '#a8956a', 1.6), sh(hd, '#c9a66b'));
  scene(...place(jar(44, 62, ins), { x: 302, y: S1 }));
}
scene(...place(potted(90, 70, [...place(trailer(120, '#5f9a6a', 61, 9), { y: -30 }), ...leafClump(62, 9, 74, 9, '#5f9a6a', 170)]), { x: 400, y: S1 }));
// pots lying on their side
scene(...place(pot(50, 44, C.terraLight), { x: 492, y: S1 - 22, rot: 90 }), ...place(pot(42, 38, C.terraDark), { x: 482, y: S1 - 58, rot: 82 }), sh(ellipse(470, S1 - 22, 6, 20), '#5a3626'));
// enamel jug of tulips
{
  const s: Shape[] = [];
  const g = rng(71);
  for (let i = 0; i < 6; i++) {
    const x = 592 + (i - 2.5) * 13, top = S1 - 150 - g.range(0, 34), lean = (i - 2.5) * 7;
    s.push(stroke(curve([[592 + (i - 2.5) * 4, S1 - 80], [x, S1 - 110], [x + lean, top]]), C.leaf, 2.2));
    const c = g.pick(['#f08c7a', '#f6d66a', C.peony, '#f2a23a', C.rose]);
    s.push(sh(petal(x + lean, top + 6, 22, 8, -106) + petal(x + lean, top + 6, 22, 8, -74), shade(c, -0.15)), sh(petal(x + lean, top + 7, 22, 6, -90), shade(c, 0.12)));
  }
  s.push(sh(leaf(580, S1 - 80, 60, 9, -118) + leaf(604, S1 - 80, 56, 9, -64), C.leafLight));
  s.push(sh(blob([[560, S1 - 84], [624, S1 - 84], [632, S1 - 30], [622, S1], [562, S1], [552, S1 - 30]], 0.6), '#f4f1e4'), sh(blob([[604, S1 - 84], [624, S1 - 84], [632, S1 - 30], [622, S1], [600, S1]], 0.6), '#d9d5c4'));
  s.push(sh(rect(556, S1 - 90, 72, 8, 3), '#5f86b5'), sh(rect(560, S1 - 6, 64, 6, 2), '#5f86b5'), stroke(curve([[628, S1 - 72], [652, S1 - 62], [634, S1 - 28]]), '#f4f1e4', 6), stroke(curve([[628, S1 - 72], [652, S1 - 62], [634, S1 - 28]]), '#5f86b5', 1.4));
  s.push(sh(blob([[570, S1 - 20], [576, S1 - 26], [582, S1 - 18]], 1), '#3f4347', { opacity: 0.6 }));
  scene(...s);
}
// glass cloche over a little auricula
{
  const x = 760;
  scene(sh(rect(x - 46, S1 - 6, 92, 6, 2), '#8a633c'), ...place(potted(40, 32, [...leafClump(81, 6, 22, 6, C.leaf, 150), ...place(roseBud(7, C.violet), { x: -6, y: -24 }), ...place(roseBud(7, '#f6d66a'), { x: 8, y: -28 })]), { x, y: S1 - 6 }),
    sh(blob([[x - 40, S1 - 6], [x - 40, S1 - 70], [x - 22, S1 - 104], [x + 22, S1 - 104], [x + 40, S1 - 70], [x + 40, S1 - 6]], 0.7), '#e4f3ef', { opacity: 0.4 }),
    stroke(blob([[x - 40, S1 - 6], [x - 40, S1 - 70], [x - 22, S1 - 104], [x + 22, S1 - 104], [x + 40, S1 - 70], [x + 40, S1 - 6]], 0.7), '#9fc3bb', 1.6),
    sh(circle(x, S1 - 112, 7), '#cfe6e0'), stroke(circle(x, S1 - 112, 7), '#9fc3bb', 1.4), sh(rect(x - 30, S1 - 84, 5, 60, 2.5), '#ffffff', { opacity: 0.6 }));
}
scene(...place(potted(46, 40, cactus(58)), { x: 846, y: S1 }), ...place(potted(40, 34, cactus(40, '#7aa868'), C.terraLight), { x: 900, y: S1 }));
// pine cone and conkers beside the jug
scene(sh(blob([[672, S1], [664, S1 - 16], [674, S1 - 34], [686, S1 - 16], [680, S1]], 0.9), '#7a5a36'), stroke(line([[666, S1 - 10], [684, S1 - 10]]) + line([[666, S1 - 18], [684, S1 - 18]]) + line([[669, S1 - 26], [680, S1 - 26]]), '#56391f', 1.4));

// ---- lower shelf
scene(...shelf(S2, 0, W, false));
scene(...place(potStack(5, 62), { x: 70, y: S2 }));
scene(...place(potted(54, 44, succulent(34, '#7fb89a'), C.terraLight), { x: 330, y: S2 }), ...place(potted(46, 38, succulent(28, '#9a8fc0'), C.terraDark), { x: 388, y: S2 }));
// tray of labels and bulbs
scene(sh(rect(430, S2 - 34, 96, 34, 2), '#8fae8b'), sh(rect(430, S2 - 34, 96, 7), '#a9c7a4'), sh(rect(430, S2 - 6, 96, 6), '#6f8f6c'),
  ...[0, 1, 2, 3, 4].flatMap((i) => place(label(i % 2 ? '#f3ead2' : '#e9dcba'), { x: 444 + i * 17, y: S2 - 30, rot: (i - 2) * 5 })));
// jar with brushes and canes
{
  const ins: Shape[] = [stroke(line([[-8, -6], [-16, -110]]) + line([[0, -6], [2, -124]]) + line([[8, -6], [18, -104]]), '#c9a66b', 3), sh(ellipse(-16, -114, 4, 9, -8), '#6e4a2e'), sh(ellipse(18, -108, 4, 8, 10), '#3f4347')];
  scene(...place(jar(46, 66, ins, '#8fae8b'), { x: 566, y: S2 }));
}
scene(...place(potted(88, 68, herb(91, 104, 84, '#6fa85a')), { x: 668, y: S2 }));
// brass plant mister
scene(sh(blob([[742, S2], [736, S2 - 30], [748, S2 - 50], [772, S2 - 50], [784, S2 - 30], [778, S2]], 0.7), '#c9a24a'), sh(blob([[766, S2], [772, S2 - 30], [766, S2 - 50], [772, S2 - 50], [784, S2 - 30], [778, S2]], 0.7), '#a5822f'), sh(rect(754, S2 - 64, 12, 16, 2), '#a5822f'), sh(rect(742, S2 - 72, 30, 9, 3), '#d9b65e'), sh(rect(734, S2 - 70, 10, 5, 2), '#8a6a22'), stroke(curve([[772, S2 - 68], [786, S2 - 62], [782, S2 - 46]]), '#8a6a22', 3), sh(ellipse(752, S2 - 26, 4, 12, 8), '#f1dc9a', { opacity: 0.7 }));
// pansies
{
  const s: Shape[] = [...herb(95, 76, 30, C.leaf)];
  const g = rng(96);
  for (let i = 0; i < 6; i++) {
    const x = g.range(-30, 30), y = -g.range(22, 46), c = g.pick([C.violet, '#f6d66a', C.lavender, '#f08c7a']);
    s.push(sh(blossomPath(x, y, 11, 5, 0.7, g.range(0, 72)), c), sh(blossomPath(x, y + 1, 5, 3, 0.5, 90), '#3a2a4a'), sh(circle(x, y + 1, 1.8), C.yellow));
  }
  scene(...place(potted(70, 50, s, '#b9664a'), { x: 846, y: S2 }));
}
// upturned pot (the robin's perch) and candle jars
scene(...place(pot(60, 52, C.terraLight), { x: 940, y: S2 - 52, sy: -1 }), sh(rect(912, S2 - 56, 56, 5, 2), '#b9664a'));
scene(...place(jar(34, 40, [sh(rect(-9, -26, 18, 26, 2), '#f6ecd2'), stroke(line([[0, -26], [0, -32]]), '#3a3a3a', 1.2), sh(leaf(0, -31, 9, 3, -90), '#f2a23a')], '#c9a24a'), { x: 1012, y: S2 }), ...place(jar(28, 30, [sh(rect(-7, -18, 14, 18, 2), '#f3d9c8'), stroke(line([[0, -18], [0, -23]]), '#3a3a3a', 1.2)], '#c9a24a'), { x: 1048, y: S2 }));
scene(...place(potted(66, 50, [...herb(97, 72, 30, '#7fb383'), ...place(trailer(150, '#7fb383', 98, 8), { y: 8 })], C.terraDark), { x: 1130, y: S2 }));

// things hanging from hooks under the lower shelf
{
  const hook = (x: number) => [stroke(curve([[x, S2 + 16], [x, S2 + 26], [x + 5, S2 + 30], [x + 8, S2 + 24]]), '#3f4347', 2.4)];
  scene(...hook(470), ...place(handFork(), { x: 474, y: S2 + 26 }), ...hook(540), ...place(handBrush(), { x: 546, y: S2 + 26 }), ...hook(700), ...place(dibber(), { x: 706, y: S2 + 28 }));
  // string of garlic
  const s: Shape[] = [...hook(780), stroke(line([[786, S2 + 26], [786, S2 + 150]]), '#c9b98f', 2.4)];
  [[776, 60], [796, 84], [778, 108], [796, 132], [784, 156]].forEach(([x, dy]) => s.push(sh(blob([[x - 13, S2 + dy + 6], [x - 8, S2 + dy - 8], [x, S2 + dy - 18], [x + 8, S2 + dy - 8], [x + 13, S2 + dy + 6], [x, S2 + dy + 13]], 1), '#f1ead8'), stroke(curve([[x - 5, S2 + dy - 6], [x - 7, S2 + dy + 4], [x - 2, S2 + dy + 11]]) + curve([[x + 4, S2 + dy - 6], [x + 6, S2 + dy + 4], [x + 2, S2 + dy + 11]]), '#cdbfa0', 1.2), sh(circle(x, S2 + dy + 13, 2), '#b9a27a')));
  scene(...s);
  scene(...hook(592));
  // straw sun hat
  const hx = 936, hy = S2 + 30;
  scene(...hook(930), sh(ellipse(hx, hy + 62, 62, 20), '#d9bd7c'), sh(ellipse(hx, hy + 60, 56, 16), '#e9d295'), sh(blob([[hx - 34, hy + 58], [hx - 30, hy + 22], [hx, hy + 6], [hx + 30, hy + 22], [hx + 34, hy + 58], [hx, hy + 66]], 0.9), '#e3c988'), sh(blob([[hx - 34, hy + 58], [hx - 33, hy + 44], [hx, hy + 52], [hx + 33, hy + 44], [hx + 34, hy + 58], [hx, hy + 66]], 0.9), '#8fae8b'), stroke(curve([[hx - 26, hy + 30], [hx, hy + 22], [hx + 26, hy + 30]]) + curve([[hx - 30, hy + 40], [hx, hy + 33], [hx + 30, hy + 40]]) + curve([[hx - 52, hy + 66], [hx, hy + 78], [hx + 52, hy + 66]]), '#c4a45e', 1.2), sh(blossomPath(hx + 22, hy + 52, 8, 5, 0.5), C.peony), sh(circle(hx + 22, hy + 52, 2.4), C.yellow));
  // cobweb in the corner of a pane
  let web = '';
  for (let i = 0; i <= 5; i++) web += line([[1193, 143], polar(1193, 143, 96, 90 + i * 18)]);
  for (let r = 24; r <= 84; r += 20) web += curve([0, 1, 2, 3, 4, 5].map((i) => polar(1193, 143, r - (i % 2) * 4, 90 + i * 18)));
  scene(stroke(web, '#ffffff', 1, { opacity: 0.75 }));
}

// =================================================================== under the bench (drawn before the bench itself)
const BT = 868, BF = 946; // bench top: back edge and front edge
{
  scene(sh(rect(0, 860, W, 500), '#6a4638'), ...bricks(0, 862, W, 470, 44, 58, 22, 3, '#8a5846'), sh(rect(0, 860, W, 500), `url(#${ID}-under)`));
  // floor of worn quarry tiles
  const fl: Shape[] = [sh(rect(0, 1318, W, 190), '#8a6a52')];
  const g = rng(47);
  const rows = [1320, 1346, 1378, 1418, 1466, 1524];
  for (let r = 0; r < rows.length - 1; r++) {
    const y0 = rows[r], y1 = rows[r + 1];
    const k0 = 0.62 + ((y0 - 1320) / 204) * 0.5, k1 = 0.62 + ((y1 - 1320) / 204) * 0.5;
    for (let c = -7; c < 7; c++) {
      const off = r % 2 ? 0.5 : 0;
      const p: Pt[] = [[600 + (c + off) * 150 * k0 + 2, y0 + 2], [600 + (c + off + 1) * 150 * k0 - 2, y0 + 2], [600 + (c + off + 1) * 150 * k1 - 2, y1 - 1], [600 + (c + off) * 150 * k1 + 2, y1 - 1]];
      fl.push(sh(poly(p), g.pick(['#c98a62', '#b9785a', '#d39a70', '#c08464', '#a96e52', '#cf9068'])));
    }
  }
  scene(...bucket(fl), sh(rect(0, 1318, W, 60), '#3a2a22', { opacity: 0.25 }));
}
// lower slatted shelf
const LS = 1236;
scene(sh(rect(40, LS, 1120, 14, 2), '#9a7446'), sh(rect(40, LS, 1120, 4), '#c59a69'), sh(rect(40, LS + 14, 1120, 10), '#5c4028'));
// crate of apples
{
  const g = rng(83);
  const s: Shape[] = [];
  for (let i = 0; i < 9; i++) {
    const x = 120 + i * 26 + g.range(-4, 4), y = LS - 124 - (i % 2) * 12, c = g.pick(['#d6453b', '#9cc15a', '#e0833a', '#c93a3a', '#b8d06a']);
    s.push(sh(circle(x, y, 17), c), sh(circle(x - 5, y - 5, 6), shade(c, 0.35), { opacity: 0.7 }), stroke(line([[x, y - 15], [x + 3, y - 23]]), '#5c4028', 2));
  }
  scene(...s, ...place(crate(270, 124), { x: 225, y: LS }), sh(rect(150, LS - 96, 120, 44, 3), '#f3ead2'), stroke(line([[166, LS - 82], [254, LS - 82]]) + line([[176, LS - 68], [244, LS - 68]]), '#b56a4a', 3));
}
scene(...place(potStack(4, 96), { x: 446, y: LS }), ...place(potStack(3, 60), { x: 530, y: LS }));
scene(...place(sack(), { x: 700, y: LS }));
// basket of bulbs
{
  const g = rng(87);
  const s: Shape[] = [];
  for (let i = 0; i < 10; i++) { const x = 880 + i * 20 + g.range(-4, 4), y = LS - 104 - (i % 3) * 8; s.push(sh(blob([[x - 13, y + 8], [x - 10, y - 6], [x, y - 18], [x + 10, y - 6], [x + 13, y + 8]], 1), g.pick(['#c9965a', '#b8834a', '#d6a76c'])), stroke(line([[x, y - 16], [x + 1, y - 24]]), '#8fbf6a', 2.4)); }
  scene(...s, ...place(basket(230, 104), { x: 968, y: LS }), stroke(curve([[862, LS - 100], [968, LS - 196], [1074, LS - 100]]), '#a9834c', 7), stroke(curve([[862, LS - 100], [968, LS - 196], [1074, LS - 100]]), '#d6b07c', 2));
}

// =================================================================== the bench
{
  const wood = '#b28a5c';
  const s: Shape[] = [];
  // back legs (in shadow)
  s.push(sh(rect(96, 960, 34, 300) + rect(1070, 960, 34, 300), '#5c4028'));
  // front legs
  s.push(sh(rect(34, 960, 46, 476, 2) + rect(1120, 960, 46, 476, 2), '#9a7446'), sh(rect(66, 960, 14, 476) + rect(1152, 960, 14, 476), '#7a5a36'), sh(rect(38, 964, 6, 460, 3) + rect(1124, 964, 6, 460, 3), '#c59a69'));
  // side rails to the lower shelf
  s.push(sh(rect(34, LS - 4, 46, 30) + rect(1120, LS - 4, 46, 30), '#8a633c'));
  // apron
  s.push(sh(rect(20, BF + 10, 1160, 52, 2), wood), sh(rect(20, BF + 10, 1160, 7), '#8a633c'), sh(rect(20, BF + 52, 1160, 10, 2), '#8a633c'));
  // little drawer with knob
  s.push(sh(rect(500, BF + 22, 200, 30, 2), '#c59a69'), stroke(rect(500, BF + 22, 200, 30, 2), '#8a633c', 1.6), sh(circle(600, BF + 37, 6), '#3f4347'), sh(circle(598, BF + 35, 2), '#9aa4aa'));
  // top surface (planks running left to right in perspective)
  s.push(sh(poly([[44, BT], [1156, BT], [1194, BF], [6, BF]]), '#c9a070'));
  const g = rng(57);
  const pl: Shape[] = [];
  for (let i = 0; i < 4; i++) {
    const t0 = i / 4, t1 = (i + 1) / 4;
    const y0 = BT + (BF - BT) * t0, y1 = BT + (BF - BT) * t1, xa0 = 44 - 38 * t0, xb0 = 1156 + 38 * t0, xa1 = 44 - 38 * t1, xb1 = 1156 + 38 * t1;
    pl.push(sh(poly([[xa0, y0 + 1], [xb0, y0 + 1], [xb1, y1 - 1], [xa1, y1 - 1]]), ['#d2aa78', '#c59a69', '#cfa674', '#bf9463'][i]));
    let gr = '';
    for (let k = 0; k < 10; k++) { const x = g.range(60, 1060); gr += line([[x, (y0 + y1) / 2 + g.range(-5, 5)], [x + g.range(40, 110), (y0 + y1) / 2 + g.range(-5, 5)]]); }
    pl.push(stroke(gr, '#a67f50', 1, { opacity: 0.8 }));
  }
  s.push(...pl);
  s.push(sh(rect(6, BF, 1188, 12, 2), '#a37548'), sh(rect(6, BF + 8, 1188, 4), '#7a5a36'));
  // window sill behind the bench
  s.push(sh(rect(0, 846, W, 24), BAR), sh(rect(0, 864, W, 6), BAR_D));
  scene(...s);
}

// =================================================================== on the bench
// big geranium, left
scene(sh(ellipse(128, 916, 76, 12), '#5c4028', { opacity: 0.3 }), ...place(potted(124, 112, place(geranium(101, '#e2553f'), { s: 1.45 })), { x: 122, y: 918 }));
target('snail', 'Snail', place(snail(), { x: 64, y: 941, s: 0.7 }));
// stack of small pots and a single one
scene(...place(potStack(4, 58), { x: 250, y: 920 }), ...place(pot(48, 42, C.terraDark), { x: 304, y: 930 }), ...place(soil(48), { x: 304, y: 889 }), ...place(seedlings(30, 4, 105, 18), { x: 304, y: 888 }));
// seed tray
{
  const s: Shape[] = [sh(poly([[344, 884], [520, 884], [530, 924], [334, 924]]), '#3f4347'), sh(poly([[348, 888], [516, 888], [522, 910], [342, 910]]), '#5a4334'), sh(poly([[334, 920], [530, 920], [530, 928], [334, 928]]), '#2c2f33')];
  s.push(...place(seedlings(166, 14, 111, 26), { x: 432, y: 896 }), ...place(seedlings(170, 12, 112, 22), { x: 432, y: 908 }));
  s.push(...place(label(), { x: 356, y: 908, rot: -8 }), ...place(label('#e9dcba'), { x: 510, y: 906, rot: 10 }));
  scene(sh(ellipse(432, 926, 110, 8), '#5c4028', { opacity: 0.3 }), ...s);
}
target('secateurs', 'Secateurs', place(secateurs(), { x: 404, y: 936, s: 0.74, rot: 172 }));
target('can', 'Watering can', [sh(ellipse(618, 922, 64, 7), '#5c4028', { opacity: 0.2 }), ...place(wateringCan('#7fa9b8'), { x: 620, y: 922, s: 0.66 })]);
// heap of compost with a scoop of perlite
scene(sh(blob([[690, 934], [706, 910], [740, 896], [776, 902], [806, 916], [826, 936]], 0.9), '#4f3a2d'), sh(blob([[716, 916], [740, 902], [770, 906], [752, 914]], 0.9), '#6a5040'), sh(circle(720, 926, 2) + circle(760, 920, 2.4) + circle(790, 928, 2) + circle(742, 930, 1.8) + circle(804, 932, 1.6) + circle(700, 936, 1.6), '#e9e2d0'));
target('trowel', 'Trowel', place(trowel(), { x: 812, y: 892, s: 0.8, rot: 152 }));
target('twine', 'Ball of twine', place(twine(), { x: 862, y: 920, s: 0.8 }));
// herbs in pots, right
scene(sh(ellipse(1000, 916, 150, 10), '#5c4028', { opacity: 0.25 }), ...place(potted(80, 66, herb(121, 96, 70, '#5f9a6a')), { x: 958, y: 908 }), ...place(potted(110, 96, [...leafClump(122, 11, 120, 22, '#5f9150', 150), ...place(roseBud(12, C.white), { x: -30, y: -96 }), ...place(roseBud(13, C.blush), { x: 14, y: -116 }), ...place(roseBud(11, C.white), { x: 44, y: -84 })]), { x: 1088, y: 916 }));
target('packet', 'Seed packet', place(seedPacket(), { x: 908, y: 902, s: 0.78, rot: -12 }));
scene(...place(pot(40, 34, C.terraLight), { x: 1010, y: 936 }), ...place(soil(40), { x: 1010, y: 903 }), ...place(seedlings(26, 3, 131, 20), { x: 1010, y: 902 }));
target('ladybird', 'Ladybird', place(ladybird(), { x: 1130, y: 760, s: 1, rot: 40 }));
// plant labels, pencil and a mug of tea on the bench
scene(sh(poly([[540, 938], [600, 932], [601, 936], [541, 942]]), '#f2c84b'), sh(poly([[600, 932], [608, 933], [601, 936]]), '#e9c9a0'), sh(rect(214, 932, 34, 7, 2), '#f3ead2'), sh(rect(196, 938, 34, 7, 2), '#e9dcba'));
target('gloves', 'Gardening gloves', place(gloves(), { x: 1096, y: 952, s: 0.72, rot: 98 }));

// =================================================================== wildlife and small treasures
target('nest', "Bird's nest", place(nest(), { x: 214, y: S2 - 1, s: 0.92 }));
target('robin', 'Robin', place(bird({ back: '#8a6a4c', breast: '#e2673a', wing: '#6d5038', beak: '#4a3a2a' }), { x: 944, y: S2 - 57, s: 0.86 }));
target('key', 'Key', place(key(), { x: 600, y: S2 + 48, s: 0.9 }));
target('acorn', 'Acorn', place(acorn(), { x: 702, y: S1 - 16, s: 0.82, rot: 24 }));
target('butterfly', 'Butterfly', place(butterfly('#f2a23a', '#fff3d6'), { x: 985, y: 205, s: 0.86, rot: -18 }));
target('bee', 'Bumblebee', place(bee(), { x: 330, y: 226, s: 1.1, rot: -12 }));

// =================================================================== floor things
scene(sh(ellipse(300, 1474, 86, 10), '#3a2a22', { opacity: 0.3 }), ...place(metalBucket(128, 132), { x: 300, y: 1476 }), stroke(line([[262, 1350], [236, 1210]]), '#a37548', 7), stroke(line([[330, 1350], [372, 1190]]), '#8a633c', 6));
// coiled hose
{
  const s: Shape[] = [sh(ellipse(640, 1470, 110, 12), '#3a2a22', { opacity: 0.3 })];
  for (let i = 0; i < 4; i++) s.push(stroke(ellipse(640, 1456 - i * 9, 100 - i * 3, 22 - i), i % 2 ? '#6fa15e' : '#5f9150', 9));
  s.push(stroke(curve([[736, 1450], [790, 1462], [840, 1474]]), '#5f9150', 9), sh(rect(836, 1466, 28, 14, 3), '#c9a24a'), sh(rect(860, 1469, 12, 8, 2), '#8a6a22'));
  scene(...s);
}
scene(sh(ellipse(1010, 1480, 90, 9), '#3a2a22', { opacity: 0.3 }), ...place(boot(), { x: 968, y: 1480 }), ...place(boot('#5a8a66'), { x: 1040, y: 1486, rot: 4 }));
// moss, fallen leaves and petals
{
  const g = rng(133);
  let moss = '', lf = '', pt = '';
  for (let i = 0; i < 16; i++) moss += ellipse(g.range(0, W), g.range(1400, 1496), g.range(10, 26), g.range(3, 6));
  for (let i = 0; i < 12; i++) lf += leaf(g.range(90, 1100), g.range(1400, 1490), g.range(16, 26), 6, g.range(0, 360));
  for (let i = 0; i < 12; i++) pt += petal(g.range(60, 1140), g.range(1380, 1494), 9, 3.6, g.range(0, 360));
  scene(sh(moss, '#6f8f55', { opacity: 0.7 }), sh(lf, '#b98a4a'), sh(pt, C.peonyLight));
}
target('frog', 'Frog', place(frog(), { x: 470, y: 1478, s: 0.92 }));
target('mushroom', 'Mushroom', place(mushroom(), { x: 116, y: 1484, s: 0.86 }));

// =================================================================== light
scene(
  sh(poly([[150, 0], [330, 0], [-150, 1500], [-330, 1500]]) + poly([[620, 0], [760, 0], [300, 1500], [160, 1500]]) + poly([[1010, 0], [1090, 0], [640, 1500], [560, 1500]]), '#fff6d2', { opacity: 0.07 }),
  sh(rect(0, 0, W, H), `url(#${ID}-vignette)`, { opacity: 0.25 }),
);

const activity: FindActivity = {
  id: ID, version: 2, mode: 'find',
  title: 'The Potting Bench',
  blurb: 'A sunny glasshouse bench crowded with pots, seedlings and well-used tools — and a few small visitors.',
  collectionId: 'garden',
  categories: ['Garden', 'Still life', 'Cozy'],
  difficulty: 'Moderate',
  width: W, height: H,
  defs:
    linearGradient(`${ID}-sky`, [[0, '#a9d6ea'], [0.35, '#d6edf2'], [0.6, '#eef4e2'], [1, '#eef4e2']]) +
    `<linearGradient id="${ID}-under" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a1c18" stop-opacity="0.7"/><stop offset="0.5" stop-color="#2a1c18" stop-opacity="0.45"/><stop offset="1" stop-color="#2a1c18" stop-opacity="0.3"/></linearGradient>` +
    `<radialGradient id="${ID}-vignette" cx="0.5" cy="0.45" r="0.75"><stop offset="0.7" stop-color="#2a1c18" stop-opacity="0"/><stop offset="1" stop-color="#2a1c18" stop-opacity="0.8"/></radialGradient>`,
  items,
};
export default activity;
