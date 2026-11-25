// Shared props for the Woodland Cottage hidden-object scenes. Every prop returns
// Shape[] drawn around the origin (base at 0,0 unless noted).
import { blob, circle, curve, ellipse, leaf, line, mix, petal, place, poly, rect, rng, sector, sh, shade, star, stroke } from '../../art/kit';
import type { Pt } from '../../art/geometry';
import type { Shape } from '../../art/types';
import { polar } from '../garden/props';

export { polar };

export const W = {
  moss: '#6f8f4e', mossDark: '#4e6b38', fern: '#5f8a45', fernLight: '#8db35e', fernDark: '#3f6233', deep: '#2f4a2c',
  bark: '#6b4a2f', barkDark: '#4a3220', barkLight: '#8f6a45', wood: '#a7774a', woodLight: '#c89b68', woodDark: '#7a5333',
  amber: '#e8a03c', fire: '#f2b84a', flame: '#f7d77a', ember: '#d9622e',
  fox: '#d9692e', foxLight: '#ec9a5c', red: '#c8423a', redDark: '#9a2f2a',
  cream: '#f3ead2', creamDark: '#e2d3b0', paper: '#f8f1de',
  stone: '#a39d90', stoneLight: '#c4bdae', stoneDark: '#77705f',
  copper: '#c07a45', copperLight: '#e0a06a', copperDark: '#8e5230', brass: '#c29a3c', brassDark: '#8a6a22', brassLight: '#ecd08a',
  iron: '#3d3a36', ink: '#2c2622', white: '#fffaf0', sky: '#bfdcea', blue: '#6f8fb0', plum: '#7a4d6a', mustard: '#d4a640',
};

// =========================================================================== small targets

/** Teacup on a saucer, about 56 wide; origin at the bottom of the saucer. */
export function teacup(col = '#6f8fb0', china = '#f6f0e2'): Shape[] {
  const dk = shade(china, -0.12);
  return [
    sh(ellipse(0, -3, 28, 6.5), dk), sh(ellipse(0, -5, 27, 5.5), china), sh(ellipse(0, -5.5, 12, 2.5), shade(china, -0.06)),
    stroke(curve([[15, -28], [27, -29], [26, -18], [14, -13]]), china, 4.5), stroke(curve([[15, -28], [27, -29], [26, -18], [14, -13]]), dk, 1),
    sh(blob([[-19, -32], [19, -32], [16, -16], [8, -8], [-8, -8], [-16, -16]], 0.7), china),
    sh(blob([[5, -32], [19, -32], [16, -16], [8, -8], [2, -8]], 0.7), dk, { opacity: 0.7 }),
    stroke(curve([[-18, -24], [0, -21], [18, -24]]), col, 3),
    sh(circle(-10, -16, 2) + circle(0, -14, 2) + circle(10, -16, 2), col),
    sh(ellipse(0, -32, 19, 4.5), dk), sh(ellipse(0, -32, 16.5, 3.2), '#9a5a2e'),
    sh(ellipse(-11, -25, 2.5, 5, 10), '#ffffff', { opacity: 0.7 }),
  ];
}

/** Old brass key lying flat, bow to the left; about 80 long, centred. */
export function key(col = W.brass): Shape[] {
  const dk = shade(col, -0.32);
  return [
    sh(sector(-28, 0, 13, 0, 360, 7), col), stroke(circle(-28, 0, 13), dk, 1.2),
    sh(circle(-28, -10, 4) + circle(-28, 10, 4) + circle(-38, 0, 4), col),
    sh(rect(-16, -5, 6, 10, 2), dk),
    sh(rect(-12, -3, 46, 6, 2), col), sh(rect(-12, 0.5, 46, 2.5), dk, { opacity: 0.55 }),
    sh(rect(22, 3, 5, 10, 1) + rect(29, 3, 5, 13, 1), col), sh(rect(26, 3, 3, 6), col),
    stroke(rect(22, 3, 12, 13, 1), dk, 0.8),
    sh(ellipse(-31, -5, 3, 2, -30), shade(col, 0.5), { opacity: 0.8 }),
  ];
}

/** Little brown mouse in profile facing right; origin at its feet, about 70 long with tail. */
export function mouse(col = '#9a8270'): Shape[] {
  const dk = shade(col, -0.25), lt = shade(col, 0.28);
  return [
    stroke(curve([[-18, -6], [-34, -2], [-44, -10], [-52, -4]]), '#c99a8a', 2),
    sh(blob([[-22, -4], [-20, -18], [-4, -26], [12, -22], [22, -12], [26, -6], [10, 0], [-16, 0]], 1), col),
    sh(blob([[-14, -4], [-4, -12], [10, -10], [16, -4], [4, 0]], 1), lt, { opacity: 0.8 }),
    sh(blob([[12, -22], [24, -16], [32, -9], [24, -6], [14, -8]], 0.9), col),
    sh(circle(9, -25, 7), dk), sh(circle(9, -25, 4.4), '#e7a9a0'),
    sh(circle(21, -15, 2.2), W.ink), sh(circle(21.6, -15.8, 0.8), '#ffffff'),
    sh(circle(32, -9, 2), '#d8857e'),
    stroke(line([[30, -10], [40, -14]]) + line([[30, -8], [41, -8]]) + line([[30, -7], [39, -3]]), '#5a4a40', 0.6),
    sh(ellipse(-8, -1, 5, 2) + ellipse(14, -1, 4, 2), '#e7a9a0'),
  ];
}

/** Wooden spoon, bowl to the right; about 110 long, centred. */
export function woodenSpoon(col = '#c99a5e'): Shape[] {
  const dk = shade(col, -0.25);
  return [
    sh(rect(-56, -4, 74, 8, 4), col), sh(rect(-56, 0.5, 74, 3.5, 2), dk, { opacity: 0.6 }),
    sh(circle(-51, 0, 2), dk),
    sh(ellipse(34, 0, 22, 14), col), sh(ellipse(36, 1, 16, 9.5), dk), sh(ellipse(33, -2, 11, 5), shade(col, 0.15), { opacity: 0.8 }),
    stroke(line([[-40, -1], [-10, -2]]) + line([[-30, 2], [4, 1.5]]), shade(col, -0.15), 0.8),
  ];
}

/** Candle in a brass chamberstick; origin at the base, about 80 tall. */
export function candle(): Shape[] {
  return [
    sh(ellipse(0, -2, 28, 7), W.brassDark), sh(ellipse(0, -4, 27, 6), W.brass), sh(ellipse(-6, -5, 12, 2.5), W.brassLight, { opacity: 0.7 }),
    stroke(curve([[22, -6], [36, -8], [36, -18], [26, -16]]), W.brassDark, 3.2),
    sh(rect(-10, -14, 20, 10, 2), W.brass), sh(ellipse(0, -14, 11, 3), W.brassDark),
    sh(rect(-8, -60, 16, 47, 1.5), '#f5ecd5'), sh(rect(3, -60, 5, 47), '#ddd0b0'),
    sh(blob([[-8, -60], [-9, -48], [-6, -50], [-5, -58]], 0.8) + blob([[4, -60], [5, -44], [8, -46], [8, -58]], 0.8), '#e9dfc5'),
    sh(ellipse(0, -60, 8, 2.4), '#fff7e6'),
    stroke(line([[0, -60], [0, -65]]), W.ink, 1.2),
    sh(circle(0, -72, 10), '#ffd98a', { opacity: 0.35 }),
    sh(blob([[0, -84], [4.5, -72], [3.5, -66], [0, -64], [-3.5, -66], [-4.5, -72]], 1), W.fire),
    sh(blob([[0, -78], [2, -70], [0, -66], [-2, -70]], 1), '#fff4c8'),
  ];
}

/** Gold pocket watch with a short chain; centred, about 60 across plus chain. */
export function pocketWatch(): Shape[] {
  let ticks = '';
  for (let i = 0; i < 12; i++) ticks += line([polar(0, 0, 14, i * 30), polar(0, 0, i % 3 ? 16 : 17.5, i * 30)]);
  let chain = '';
  for (let i = 0; i < 7; i++) { const [x, y] = [6 + i * 6, -30 - Math.sin(i / 2) * 8]; chain += ellipse(x, y, 3.2, 2, i * 25); }
  return [
    stroke(chain, W.brassDark, 1.4),
    sh(sector(0, -27, 6, 0, 360, 3.2), W.brass),
    sh(rect(-4, -24, 8, 6, 1.5), W.brassDark),
    sh(circle(0, 0, 22), W.brassDark), sh(circle(0, 0, 20.5), W.brass),
    sh(circle(0, 0, 18), '#fbf5e4'), stroke(ticks, W.ink, 1.2),
    stroke(line([[0, 0], [0, -11]]) + line([[0, 0], [8, 4]]), W.ink, 1.6), sh(circle(0, 0, 1.8), W.ink),
    sh(ellipse(-9, -10, 6, 3, -40), '#ffffff', { opacity: 0.45 }),
  ];
}

/** Ball of yarn with two knitting needles; centred, about 70 across. */
export function yarnBall(col = '#c8423a'): Shape[] {
  const dk = shade(col, -0.25), lt = shade(col, 0.25);
  let a = '', b = '';
  for (let i = -2; i <= 2; i++) {
    a += curve([[-20 + Math.abs(i) * 3, i * 7 - 4], [0, i * 7.5 + 4], [20 - Math.abs(i) * 3, i * 7 - 3]]);
    b += curve([[i * 7 - 4, -20 + Math.abs(i) * 3], [i * 7.5 + 5, 0], [i * 7 - 1, 20 - Math.abs(i) * 3]]);
  }
  return [
    stroke(line([[-30, -30], [26, 22]]), '#b8946a', 3), sh(circle(-30, -30, 3.5), '#8a6a4a'),
    stroke(curve([[16, 14], [30, 26], [44, 18], [52, 26]]), col, 2.4),
    sh(circle(0, 0, 23), dk), sh(circle(-1, -1, 21), col),
    stroke(b, dk, 1.6), stroke(a, lt, 1.6),
    stroke(line([[-34, -18], [30, 8]]), '#b8946a', 3), sh(circle(-34, -18, 3.5), '#8a6a4a'),
  ];
}

/** Honey pot with a cloth lid tied with string and a wooden dipper; origin at the base, about 70 tall. */
export function honeyJar(): Shape[] {
  return [
    sh(blob([[-22, 0], [-26, -24], [-22, -44], [22, -44], [26, -24], [22, 0]], 0.7), '#d98c22'),
    sh(blob([[6, 0], [14, -24], [12, -44], [22, -44], [26, -24], [22, 0]], 0.7), '#b46a14'),
    sh(ellipse(-12, -26, 4, 10), '#f7c870', { opacity: 0.7 }),
    sh(rect(-14, -32, 28, 18, 2), W.paper), stroke(line([[-8, -25], [8, -25]]) + line([[-6, -20], [6, -20]]), '#8a5a2a', 1.6),
    sh(blob([[-28, -44], [-20, -54], [0, -57], [20, -54], [28, -44], [20, -38], [0, -42], [-20, -38]], 0.8), '#e9dcc0'),
    sh(circle(-14, -48, 2.2) + circle(-4, -51, 2.2) + circle(8, -50, 2.2) + circle(18, -47, 2.2) + circle(0, -45, 2), W.red),
    stroke(curve([[-22, -42], [0, -46], [22, -42]]), '#a07a4a', 1.6),
    stroke(line([[14, -54], [30, -84]]), '#b8864f', 3.5),
    sh(ellipse(31, -88, 5, 7, 28), '#a3713e'), stroke(line([[28, -92], [35, -85]]) + line([[27, -88], [34, -82]]), '#7a5333', 1),
    sh(blob([[-4, -42], [0, -36], [3, -42]], 1), '#e89a2a'),
  ];
}

/** Rolling pin, horizontal; centred, about 120 long. */
export function rollingPin(col = '#d8b07a'): Shape[] {
  const dk = shade(col, -0.22);
  return [
    sh(rect(-60, -4.5, 22, 9, 4.5) + rect(38, -4.5, 22, 9, 4.5), dk),
    sh(rect(-42, -11, 84, 22, 9), col), sh(rect(-42, 2, 84, 9, 5), dk, { opacity: 0.6 }),
    sh(rect(-38, -9, 76, 4, 2), shade(col, 0.3), { opacity: 0.8 }),
    stroke(line([[-30, -1], [-6, -2]]) + line([[4, 3], [28, 2]]), shade(col, -0.12), 0.8),
    sh(ellipse(-14, 0, 5, 2) + ellipse(18, -4, 3, 1.5), '#f6f0e2', { opacity: 0.8 }),
  ];
}

/** Round wire spectacles; centred, about 72 wide. */
export function spectacles(): Shape[] {
  return [
    stroke(curve([[-35, -2], [-42, -6], [-46, 2]]) + curve([[35, -2], [42, -6], [46, 2]]), '#6a5030', 1.6),
    sh(circle(-18, 0, 13), '#dfeef2', { opacity: 0.55 }), sh(circle(18, 0, 13), '#dfeef2', { opacity: 0.55 }),
    stroke(circle(-18, 0, 13) + circle(18, 0, 13), '#8a6a22', 2.4),
    stroke(curve([[-5, -2], [0, -6], [5, -2]]), '#8a6a22', 2),
    sh(ellipse(-23, -5, 3, 5, 30) + ellipse(13, -5, 3, 5, 30), '#ffffff', { opacity: 0.75 }),
  ];
}

/** Acorn hanging point-down; centred, about 50 tall. */
export function acorn(): Shape[] {
  return [
    stroke(curve([[0, -19], [2, -25], [7, -27]]), '#6b4a2b', 2.4),
    sh(blob([[-10.5, -4], [-10, 10], [-4, 19], [0, 23], [4, 19], [10, 10], [10.5, -4]], 0.9), '#c2914e'),
    sh(blob([[-7, -2], [-7, 8], [-3, 16], [-2, 2]], 0.9), '#e2bb7c', { opacity: 0.85 }),
    sh(blob([[-13, -6], [-11, -15], [0, -20], [11, -15], [13, -6], [0, -2]], 0.9), '#7a5a36'),
    stroke(line([[-9, -14], [-5, -4]]) + line([[-3, -18], [1, -3]]) + line([[4, -18], [7, -4]]) + line([[-11, -9], [11, -12]]) + line([[-10, -5], [12, -7]]), '#56391f', 1),
    sh(ellipse(-4, -14, 4, 2, -20), '#a17c50', { opacity: 0.8 }),
  ];
}

/** Pair of sewing scissors, closed, pointing right; centred, about 80 long. */
export function scissors(col = '#c8423a'): Shape[] {
  return [
    sh(poly([[-4, -3], [40, -1], [42, 0], [-4, 2]]), '#b9c2c8'),
    sh(poly([[-4, 1], [40, 1.5], [42, 0], [-4, 5]]), '#8d979e'),
    stroke(line([[0, -1], [38, 0]]), '#e2e7ea', 0.8),
    sh(sector(-20, -9, 10, 0, 360, 6), col), sh(sector(-20, 10, 10, 0, 360, 6), shade(col, -0.18)),
    sh(poly([[-12, -5], [-2, -2], [-2, 3], [-12, 5]]), '#8d979e'),
    sh(circle(0, 0.5, 3), '#5d666c'), sh(circle(0, 0.5, 1.2), '#d3dade'),
  ];
}

/** Robin in profile facing right; origin at the feet, about 70 long. */
export function robin(): Shape[] {
  const back = '#8a6a4c', breast = '#e2673a', wing = '#6d5038';
  return [
    stroke(line([[-3, -9], [-4, 0], [-9, 1]]) + line([[5, -9], [6, 0], [1, 1]]) + line([[6, 0], [11, 1]]), '#4a3220', 1.6),
    sh(poly([[-22, -26], [-56, -34], [-58, -27], [-54, -21], [-22, -13]]), shade(wing, -0.15)),
    sh(blob([[-28, -22], [-12, -38], [10, -44], [22, -34], [20, -18], [6, -8], [-14, -9]], 1), back),
    sh(blob([[-10, -12], [2, -26], [18, -30], [22, -20], [14, -10], [2, -7]], 1), '#efe2cc'),
    sh(circle(18, -41, 12.5), back),
    sh(blob([[6, -34], [20, -40], [30, -36], [26, -20], [10, -14], [0, -22]], 1), breast),
    sh(blob([[-30, -22], [-18, -34], [2, -36], [8, -26], [-6, -17], [-22, -16]], 1), wing),
    stroke(curve([[-24, -22], [-10, -26], [2, -27]]) + curve([[-20, -19], [-8, -21], [0, -22]]), shade(wing, -0.3), 1.2),
    sh(poly([[28.5, -44], [40, -41], [28.5, -38]]), '#4a3a2a'),
    sh(circle(22, -43.5, 2.6), W.ink), sh(circle(22.8, -44.4, 0.9), '#ffffff'),
  ];
}

/** Ladybird from above, about 30 long, heading up. */
export function ladybird(): Shape[] {
  return [
    stroke(line([[-10, -6], [-16, -10]]) + line([[10, -6], [16, -10]]) + line([[-12, 2], [-18, 3]]) + line([[12, 2], [18, 3]]) + line([[-10, 9], [-15, 14]]) + line([[10, 9], [15, 14]]), W.ink, 1.6),
    sh(ellipse(0, -11, 7.5, 6), W.ink),
    sh(ellipse(0, 1, 13, 14), '#d6362e'),
    sh(ellipse(-5, -4, 4, 6, 20), '#ef7a68', { opacity: 0.7 }),
    stroke(line([[0, -12], [0, 15]]), W.ink, 1.6),
    sh(circle(-6, -2, 2.8) + circle(6, -2, 2.8) + circle(-5, 7, 2.5) + circle(5, 7, 2.5) + circle(-9, 3, 1.6) + circle(9, 3, 1.6), W.ink),
    sh(circle(-3.5, -13, 1.6) + circle(3.5, -13, 1.6), '#ffffff'),
  ];
}

/** Hedgehog in profile facing right; origin at the feet, about 90 long. */
export function hedgehog(): Shape[] {
  const g = rng(404);
  let sp1 = '', sp2 = '', sp3 = '';
  for (let i = 0; i < 46; i++) {
    const a = g.range(185, 345), r = g.range(16, 30);
    const [x, y] = polar(-6, -6, r, a);
    const l = leaf(x, y, g.range(11, 17), 2.4, a - 8 + g.range(-12, 12));
    if (i % 3 === 0) sp1 += l; else if (i % 3 === 1) sp2 += l; else sp3 += l;
  }
  return [
    sh(blob([[-44, -2], [-46, -20], [-30, -38], [-6, -44], [18, -36], [28, -20], [22, -4], [0, 0]], 1), '#5e4630'),
    sh(sp1, '#7d5f40'), sh(sp2, '#4a3524'), sh(sp3, '#a9845a'),
    sh(blob([[14, -24], [26, -26], [40, -14], [46, -8], [38, -3], [18, -2]], 0.9), '#d8b88a'),
    sh(blob([[16, -6], [30, -6], [40, -4], [30, 0], [16, 0]], 0.9), '#c09c70'),
    sh(circle(46, -8.5, 3), W.ink),
    sh(circle(31, -16, 2.4), W.ink), sh(circle(31.8, -16.8, 0.8), '#ffffff'),
    sh(ellipse(22, -24, 4, 5), '#b8946a'),
    sh(ellipse(-22, -1, 6, 2.5) + ellipse(10, -1, 6, 2.5), '#6a4e36'),
  ];
}

/** Tawny owl perched, facing out; origin at the feet, about 90 tall. */
export function owl(): Shape[] {
  const body = '#9a7048', dk = '#6e4c2e', belly = '#e6d2a8';
  let chev = '';
  for (let r = 0; r < 4; r++) for (let c = -1; c <= 1; c++) { const x = c * 9 + (r % 2) * 4.5 - 2, y = -48 + r * 9; chev += line([[x - 3, y], [x, y + 3], [x + 3, y]]); }
  return [
    sh(blob([[-24, -10], [-28, -40], [-22, -62], [0, -70], [22, -62], [28, -40], [24, -10], [0, -2]], 1), body),
    sh(blob([[-15, -12], [-17, -42], [0, -52], [17, -42], [15, -12], [0, -6]], 1), belly),
    stroke(chev, '#8a6440', 1.4),
    sh(blob([[-26, -14], [-30, -42], [-20, -56], [-16, -30], [-14, -10]], 0.9), dk),
    sh(blob([[26, -14], [30, -42], [20, -56], [16, -30], [14, -10]], 0.9), dk),
    sh(poly([[-20, -66], [-24, -84], [-10, -70]]) + poly([[20, -66], [24, -84], [10, -70]]), dk),
    sh(blob([[-22, -62], [-18, -76], [0, -80], [18, -76], [22, -62], [0, -54]], 1), body),
    sh(circle(-10, -66, 10) + circle(10, -66, 10), '#e9d9b4'),
    sh(circle(-10, -66, 6) + circle(10, -66, 6), '#e8a03c'),
    sh(circle(-10, -66, 3.4) + circle(10, -66, 3.4), W.ink),
    sh(circle(-11, -67.5, 1.2) + circle(9, -67.5, 1.2), '#ffffff'),
    sh(poly([[-3, -62], [3, -62], [0, -54]]), '#d9a640'),
    stroke(line([[-8, -2], [-8, 3]]) + line([[-4, -2], [-4, 3]]) + line([[4, -2], [4, 3]]) + line([[8, -2], [8, 3]]), '#c99a3a', 2),
  ];
}

/** Garden snail in profile, heading right; origin at the foot, about 60 long. */
export function snail(shell = '#c98d54'): Shape[] {
  return [
    sh(blob([[-30, 0], [-22, -7], [0, -8], [22, -9], [30, -18], [36, -26], [41, -24], [38, -12], [34, -2], [20, 0]], 0.9), '#d9c58f'),
    sh(blob([[-28, -1], [0, -3], [30, -3], [20, 0], [-20, 0]], 0.9), '#bba76f'),
    stroke(line([[36, -25], [34, -37]]) + line([[40, -24], [43, -35]]), '#bba76f', 1.8),
    sh(circle(34, -38, 2.2) + circle(43, -36, 2.2), W.ink),
    sh(circle(-2, -24, 21), shade(shell, -0.15)), sh(circle(-2, -24, 17.5), shell),
    sh(circle(-3, -23, 11), shade(shell, 0.2)), sh(circle(-4, -22, 5.5), shell),
    stroke(curve([[-4, -22], [1, -27], [-7, -32], [-14, -22], [-3, -11], [12, -20], [6, -38]]), shade(shell, -0.4), 1.5),
  ];
}

/** Feather lying diagonally; centred, about 90 long. */
export function feather(col = '#8a9aa8', tip = '#3d4650'): Shape[] {
  let barbs = '';
  for (let i = 0; i < 9; i++) {
    const t = -30 + i * 7.5;
    barbs += line([[t, -t * 0.05], [t + 6, -10 + Math.abs(t) * 0.12]]) + line([[t, -t * 0.05], [t + 6, 10 - Math.abs(t) * 0.12]]);
  }
  return [
    sh(blob([[-34, 0], [-20, -12], [10, -13], [36, -6], [44, 0], [36, 6], [10, 13], [-20, 11]], 0.9), col),
    sh(blob([[22, -9], [36, -6], [44, 0], [36, 6], [22, 9], [30, 0]], 0.9), tip),
    sh(poly([[0, -13], [6, -4], [10, -13]]) + poly([[-14, 11], [-9, 3], [-6, 12]]), mix(col, '#f3ead2', 0.5)),
    stroke(barbs, shade(col, -0.2), 0.8),
    stroke(curve([[-48, 1], [-30, 0], [0, -0.5], [44, 0]]), '#f3ead2', 1.8),
  ];
}

/** Pine cone, point down; centred, about 70 tall. */
export function pinecone(): Shape[] {
  const out: Shape[] = [stroke(line([[0, -30], [1, -38]]), '#5c3f24', 3)];
  const rows = 7;
  for (let r = 0; r < rows; r++) {
    const y = -26 + r * 8.6, wid = 17 - Math.abs(r - 2) * 2.4 - (r > 4 ? (r - 4) * 2 : 0), n = r % 2 ? 4 : 3;
    let a = '', b = '';
    for (let i = 0; i < n; i++) {
      const x = -wid + ((i + 0.5) * 2 * wid) / n;
      a += blob([[x - 6, y - 4], [x + 6, y - 4], [x + 5, y + 4], [x, y + 8], [x - 5, y + 4]], 0.8);
      b += blob([[x - 3, y + 2], [x + 3, y + 2], [x, y + 6]], 0.9);
    }
    out.push(sh(a, r % 2 ? '#8a5f36' : '#9c6c3e'), sh(b, '#c4945c'));
  }
  out.push(stroke(curve([[-14, -24], [-18, 0], [-6, 28]]), '#5c3f24', 1, { opacity: 0.6 }));
  return out;
}

/** Red toadstool with white spots plus a small one; origin at the base, about 55 tall. */
export function toadstool(cap = '#d6362e'): Shape[] {
  return [
    sh(blob([[-7, 0], [-6, -18], [-5, -30], [5, -30], [6, -18], [8, 0]], 0.7), '#f4ead6'),
    sh(blob([[2, 0], [2, -28], [5, -30], [6, -18], [8, 0]], 0.7), '#d9cdb4'),
    sh(blob([[-9, -19], [0, -16], [9, -19], [7, -23], [-7, -23]], 0.8), '#e9dfc8'),
    sh(ellipse(0, -29, 23, 6), '#e6d9bd'),
    sh(blob([[-25, -29], [-22, -42], [-10, -52], [4, -54], [17, -48], [25, -36], [25, -29], [0, -25]], 0.9), cap),
    sh(blob([[6, -53], [17, -48], [25, -36], [25, -29], [12, -27], [16, -38]], 0.9), shade(cap, -0.2)),
    sh(ellipse(-12, -40, 4.5, 3.5, -30) + ellipse(0, -47, 4, 3) + ellipse(12, -40, 3.6, 3) + ellipse(-3, -34, 3, 2.4) + ellipse(-19, -33, 2.6, 2.2) + ellipse(19, -32, 2.6, 2.2), '#fff8ec'),
    sh(blob([[15, 0], [15, -9], [20, -9], [21, 0]], 0.6), '#f4ead6'),
    sh(blob([[8, -9], [11, -17], [18, -20], [25, -16], [27, -9], [18, -7]], 0.9), cap),
    sh(circle(14, -13, 1.6) + circle(20, -15, 1.6) + circle(23, -11, 1.3), '#fff8ec'),
  ];
}

/** Sitting frog facing right; origin at the feet, about 70 long. */
export function frog(): Shape[] {
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
    sh(blob([[10, -12], [16, -12], [18, -2], [24, 1], [12, 2], [11, -2]], 0.8), g2),
    sh(ellipse(-10, -24, 4, 2.6, -20) + ellipse(0, -28, 3, 2) + ellipse(-16, -15, 3.4, 2.2), '#3f7530', { opacity: 0.8 }),
  ];
}

/** Bumblebee in profile, about 34 long, centred. */
export function bee(): Shape[] {
  return [
    sh(ellipse(-3, -11, 9, 5.5, -28) + ellipse(6, -11, 8, 5, 20), '#e9f3f6', { opacity: 0.9 }),
    stroke(ellipse(-3, -11, 9, 5.5, -28) + ellipse(6, -11, 8, 5, 20), '#9fb6bf', 0.8),
    sh(ellipse(0, 0, 13, 8.5), '#f3c94f'),
    sh(poly([[-5, -8], [-1, -8.6], [-1, 8.6], [-5, 8]]) + poly([[3, -8.3], [7, -7.2], [7, 7.2], [3, 8.3]]) + poly([[-10, -6.5], [-16, 0], [-10, 6.5]]), W.ink),
    sh(circle(12, -1, 6), W.ink), sh(circle(14, -2.5, 1.3), '#ffffff'),
    stroke(curve([[14, -6], [18, -11], [21, -11]]), W.ink, 1),
  ];
}

/** Butterfly from above, wings open; about 60 wide, centred. */
export function butterfly(col = '#e8833a', col2 = '#fff3d6'): Shape[] {
  const wingU = blob([[3, -4], [14, -22], [30, -24], [32, -10], [18, 0]], 1);
  const wingL = blob([[3, 2], [18, 2], [26, 12], [18, 22], [8, 16]], 1);
  const flip = (d: string) => place([{ d }], { sx: -1 })[0].d;
  const dotU = circle(22, -15, 4.2) + circle(14, -8, 2.4), dotL = circle(17, 11, 3.2);
  return [
    sh(wingL + flip(wingL), shade(col, -0.12)), sh(wingU + flip(wingU), col),
    sh(dotU + flip(dotU) + dotL + flip(dotL), col2),
    stroke(blob([[3, -4], [14, -22], [30, -24], [32, -10], [18, 0]], 1) + flip(wingU), shade(col, -0.45), 1.2),
    sh(ellipse(0, 0, 3, 13), W.ink), sh(circle(0, -13, 3.4), W.ink),
    stroke(curve([[-1, -15], [-5, -22], [-9, -25]]) + curve([[1, -15], [5, -22], [9, -25]]), W.ink, 1.1),
  ];
}

/** Dragonfly from above, heading right; centred, about 80 long. */
export function dragonfly(): Shape[] {
  const wing = (x: number, len: number, a: number) => ellipse(x + Math.cos((a * Math.PI) / 180) * len / 2, Math.sin((a * Math.PI) / 180) * len / 2, len / 2, 5, a);
  const wings = wing(6, 34, -70) + wing(6, 34, 70) + wing(-2, 30, -110) + wing(-2, 30, 110);
  let seg = '';
  for (let i = 0; i < 6; i++) seg += line([[-6 - i * 6, -2.5], [-6 - i * 6, 2.5]]);
  return [
    sh(wings, '#dff1f4', { opacity: 0.75 }), stroke(wings, '#7fa9b8', 1),
    sh(rect(-42, -2.2, 40, 4.4, 2.2), '#3f7f9a'), stroke(seg, '#2a5a70', 1),
    sh(ellipse(4, 0, 8, 4.5), '#4f9ab6'), sh(circle(14, 0, 5), '#2f6f8a'),
    sh(circle(15.5, -3, 2.4) + circle(15.5, 3, 2.4), '#7fd0c8'),
  ];
}

/** Rabbit sitting in profile facing left; origin at the feet, about 80 tall. */
export function rabbit(col = '#a88a6c'): Shape[] {
  const dk = shade(col, -0.2), lt = shade(col, 0.3);
  return [
    sh(blob([[-14, -46], [-20, -74], [-14, -82], [-8, -70], [-6, -48]], 0.9), dk),
    sh(blob([[-6, -46], [-4, -76], [4, -82], [6, -68], [2, -46]], 0.9), col), sh(blob([[-2, -50], [0, -72], [3, -74], [3, -52]], 0.9), '#e7b3a6'),
    sh(blob([[-10, -4], [-14, -26], [-4, -42], [16, -42], [30, -26], [30, -6], [16, 0]], 1), col),
    sh(circle(32, -14, 8), '#f4ede0'),
    sh(blob([[-26, -36], [-22, -50], [-6, -54], [4, -44], [0, -30], [-16, -26]], 1), col),
    sh(blob([[-12, -2], [-8, -16], [6, -16], [8, -4], [-2, 0]], 0.9), dk),
    sh(ellipse(-10, -24, 9, 6, -10), lt, { opacity: 0.8 }),
    sh(circle(-13, -43, 3), W.ink), sh(circle(-13.8, -43.8, 1), '#ffffff'),
    sh(circle(-26, -38, 2), '#c97a72'),
    sh(ellipse(-20, -1, 9, 3), lt),
  ];
}

/** Fox cub sitting, facing out, tail curled round; origin at the feet, about 80 tall. */
export function foxCub(): Shape[] {
  const f = W.fox, lt = '#f6e8d2', dk = '#a9481c';
  return [
    sh(blob([[8, -4], [34, -10], [46, -24], [40, -32], [26, -16], [6, -14]], 0.9), f),
    sh(blob([[40, -32], [48, -28], [46, -20], [40, -22]], 0.9), lt),
    sh(blob([[-20, -2], [-22, -30], [-10, -44], [10, -44], [22, -30], [20, -2]], 1), f),
    sh(blob([[-9, -6], [-10, -30], [0, -38], [10, -30], [9, -6]], 1), lt),
    sh(poly([[-22, -60], [-24, -84], [-8, -70]]) + poly([[22, -60], [24, -84], [8, -70]]), dk),
    sh(poly([[-19, -64], [-21, -79], [-11, -70]]) + poly([[19, -64], [21, -79], [11, -70]]), '#3a2a22'),
    sh(blob([[-24, -58], [-18, -72], [0, -76], [18, -72], [24, -58], [10, -44], [0, -40], [-10, -44]], 1), f),
    sh(blob([[-14, -52], [-4, -54], [0, -44], [4, -54], [14, -52], [6, -42], [0, -40], [-6, -42]], 0.9), lt),
    sh(circle(0, -44, 3.2), W.ink),
    sh(ellipse(-9, -58, 2.6, 3.2) + ellipse(9, -58, 2.6, 3.2), W.ink), sh(circle(-8.2, -59, 0.9) + circle(9.8, -59, 0.9), '#ffffff'),
    sh(ellipse(-10, -2, 6, 3) + ellipse(10, -2, 6, 3), '#3a2a22'),
  ];
}

/** Claw hammer lying flat, head up-left; centred, about 100 long. */
export function hammer(): Shape[] {
  return [
    sh(rect(-6, -40, 12, 90, 5), '#c9955a'), sh(rect(1, -40, 5, 90, 2.5), '#a0703e'),
    sh(rect(-6, 30, 12, 20, 5), '#7a5333'), stroke(line([[-6, 34], [6, 34]]) + line([[-6, 40], [6, 40]]) + line([[-6, 46], [6, 46]]), '#5a3d24', 1),
    sh(blob([[-30, -50], [-20, -54], [10, -54], [14, -48], [14, -38], [10, -34], [-20, -36], [-30, -40]], 0.6), '#6e7880'),
    sh(blob([[14, -48], [26, -56], [40, -52], [30, -46], [16, -40]], 0.8), '#5a636a'),
    sh(blob([[14, -40], [26, -38], [42, -30], [30, -32], [16, -36]], 0.8), '#5a636a'),
    sh(rect(-34, -52, 8, 16, 2), '#8d979e'),
    sh(rect(-24, -53, 30, 4, 2), '#aab4ba', { opacity: 0.8 }),
  ];
}

/** Paintbrush with a green-tipped bristle head pointing up; centred, about 100 long. */
export function paintbrush(paint = '#3f8a5a'): Shape[] {
  return [
    sh(blob([[-4, 50], [-5, 10], [-4, -10], [4, -10], [5, 10], [4, 50], [0, 54]], 0.6), '#c8423a'),
    sh(blob([[1, 50], [2, 10], [2, -10], [4, -10], [5, 10], [4, 50]], 0.6), '#9a2f2a'),
    sh(rect(-5.5, -28, 11, 20, 1), '#b9c2c8'), stroke(line([[-5.5, -20], [5.5, -20]]) + line([[-5.5, -14], [5.5, -14]]), '#7a858c', 1),
    sh(blob([[-6, -28], [-7, -40], [-3, -50], [0, -54], [3, -50], [7, -40], [6, -28]], 0.8), '#e9d9b4'),
    sh(blob([[-6, -38], [-4, -48], [0, -54], [4, -48], [6, -38], [0, -42]], 0.8), paint),
    stroke(line([[-2, -30], [-2, -44]]) + line([[2, -30], [2, -46]]), '#c9b98f', 0.8),
    sh(circle(0, 46, 2), '#f3ead2'),
  ];
}

/** Oil can with long spout; origin at the base, about 80 wide. */
export function oilCan(col = '#5f8a6a'): Shape[] {
  const dk = shade(col, -0.25);
  return [
    stroke(curve([[-18, -26], [-34, -30], [-36, -14], [-20, -8]]), dk, 4),
    sh(ellipse(0, -2, 22, 5), dk),
    sh(blob([[-22, -2], [-24, -18], [-14, -30], [14, -30], [24, -18], [22, -2]], 0.7), col),
    sh(blob([[6, -2], [14, -18], [10, -30], [14, -30], [24, -18], [22, -2]], 0.7), dk),
    sh(ellipse(-10, -16, 4, 8), shade(col, 0.3), { opacity: 0.7 }),
    sh(poly([[-6, -30], [6, -30], [3, -40], [-3, -40]]), '#c9a24a'),
    sh(poly([[-2, -40], [2, -40], [46, -64], [44, -68]]), '#b08a3a'),
    sh(circle(46, -66, 2), '#5a4a2a'),
    sh(rect(-14, -14, 28, 6, 2), '#e9d9b4'),
  ];
}

/** Yellow pencil lying flat, point to the right; centred, about 100 long. */
export function pencil(): Shape[] {
  return [
    sh(rect(-50, -5, 8, 10, 2), '#e7a9a0'), sh(rect(-43, -5, 7, 10), '#b9c2c8'), stroke(line([[-40, -5], [-40, 5]]), '#7a858c', 1),
    sh(rect(-36, -5, 70, 10), '#f2c84b'), sh(rect(-36, -1.5, 70, 3), '#e0a83a'), sh(rect(-36, -5, 70, 2.5), '#f8df8a'),
    sh(poly([[34, -5], [48, -1], [48, 1], [34, 5]]), '#e9c9a0'),
    sh(poly([[44, -2], [52, 0], [44, 2]]), '#3a3a3a'),
  ];
}

/** Magnifying glass, handle down-right; centred on the lens, about 90 long. */
export function magnifier(): Shape[] {
  return [
    sh(poly([[14, 16], [20, 10], [48, 38], [42, 44]]), '#7a5333'), sh(poly([[17, 13], [20, 10], [48, 38], [45, 41]]), '#a07040'),
    sh(rect(12, 8, 10, 10, 2, ), '#c29a3c'),
    sh(circle(0, 0, 21), '#c29a3c'), sh(circle(0, 0, 17), '#d8ecef', { opacity: 0.7 }),
    sh(ellipse(-6, -7, 6, 3.4, -40), '#ffffff', { opacity: 0.8 }),
    stroke(circle(0, 0, 17), '#8a6a22', 1.2),
  ];
}

/** Iron horseshoe, open end down; centred, about 60 tall. */
export function horseshoe(): Shape[] {
  let holes = '';
  for (const a of [150, 120, 60, 30, 180, 0]) holes += circle(...polar(0, 0, 21, -a), 1.8);
  return [
    sh(sector(0, 0, 27, -200, 20, 15), '#6e6a64'), sh(sector(0, -1, 27, -190, -110, 22), '#97928a', { opacity: 0.8 }),
    sh(rect(-27, -2, 12, 26, 2) + rect(15, -2, 12, 26, 2), '#6e6a64'),
    sh(rect(-27, 18, 12, 6, 2) + rect(15, 18, 12, 6, 2), '#55514c'),
    sh(holes, '#2c2a28'),
  ];
}

/** Large sewing button with four holes; centred, about 36 across. */
export function button(col = '#3f7ea8'): Shape[] {
  return [
    sh(circle(0, 0, 17), shade(col, -0.25)), sh(circle(0, 0, 15), col), stroke(circle(0, 0, 11), shade(col, -0.3), 1.6),
    sh(circle(-4, -4, 2.4) + circle(4, -4, 2.4) + circle(-4, 4, 2.4) + circle(4, 4, 2.4), shade(col, -0.5)),
    stroke(line([[-4, -4], [4, 4]]) + line([[4, -4], [-4, 4]]), '#f3ead2', 1.4),
    sh(ellipse(-7, -9, 4, 2, -30), '#ffffff', { opacity: 0.45 }),
  ];
}

/** Brass pocket compass; centred, about 56 across. */
export function compass(): Shape[] {
  let ticks = '';
  for (let i = 0; i < 16; i++) ticks += line([polar(0, 0, 15, i * 22.5), polar(0, 0, i % 4 ? 17 : 19, i * 22.5)]);
  return [
    sh(sector(0, -26, 5, 0, 360, 2.6), W.brass),
    sh(circle(0, 0, 24), W.brassDark), sh(circle(0, 0, 22), W.brass), sh(circle(0, 0, 19.5), '#f6efdc'),
    stroke(ticks, '#6a5030', 1),
    sh(poly([[0, -16], [4, 0], [-4, 0]]), '#c8423a'), sh(poly([[0, 16], [4, 0], [-4, 0]]), '#3d4650'),
    sh(circle(0, 0, 2), W.brassDark),
    sh(ellipse(-8, -10, 6, 3, -40), '#ffffff', { opacity: 0.4 }),
  ];
}

/** Painted wooden toy duck on wheels, facing right; origin at the base, about 70 long. */
export function toyDuck(): Shape[] {
  return [
    stroke(curve([[-30, -10], [-46, -4], [-56, -12]]), '#b8946a', 1.5),
    sh(rect(-28, -14, 52, 6, 2), '#8a6a4a'),
    sh(circle(-18, -5, 7) + circle(14, -5, 7), '#c8423a'), sh(circle(-18, -5, 2.4) + circle(14, -5, 2.4), '#f3ead2'),
    sh(blob([[-30, -18], [-28, -34], [-10, -40], [10, -34], [20, -20], [8, -14], [-20, -14]], 0.9), '#f2c84b'),
    sh(blob([[-30, -18], [-38, -34], [-26, -30]], 0.9), '#e0a83a'),
    sh(blob([[-16, -22], [-8, -32], [6, -30], [2, -22]], 0.9), '#e0a83a'),
    sh(circle(14, -44, 11), '#f2c84b'),
    sh(poly([[23, -46], [36, -42], [23, -38]]), '#e8833a'),
    sh(circle(17, -47, 2), W.ink),
    stroke(curve([[-22, -26], [-4, -24], [12, -28]]), '#5f8a6a', 2),
  ];
}

// =========================================================================== scenery

/** Fern frond growing from the origin along an angle (deg, -90 = up). */
export function fern(len: number, ang: number, col: string, seed = 1): Shape[] {
  const g = rng(seed);
  const pts: Pt[] = [];
  const bend = g.range(-0.25, 0.25);
  for (let i = 0; i <= 10; i++) {
    const t = i / 10, a = ((ang + bend * 60 * t * t) * Math.PI) / 180;
    const prev = pts[i - 1] ?? [0, 0];
    pts.push(i ? [prev[0] + Math.cos(a) * len / 10, prev[1] + Math.sin(a) * len / 10] : [0, 0]);
  }
  let l1 = '', l2 = '';
  for (let i = 1; i < 10; i++) {
    const [x, y] = pts[i], [nx, ny] = pts[i + 1];
    const a = (Math.atan2(ny - y, nx - x) * 180) / Math.PI;
    const s = len * 0.22 * (1 - i / 11);
    l1 += leaf(x, y, s, s * 0.22, a - 62);
    l2 += leaf(x, y, s, s * 0.22, a + 62);
  }
  return [stroke(curve(pts), shade(col, -0.25), Math.max(1, len / 90)), sh(l1, col), sh(l2, shade(col, -0.12))];
}

/** Tuft of grass blades at the origin. */
export function grass(s: number, col: string, seed: number): Shape[] {
  const g = rng(seed);
  let a = '', b = '';
  for (let i = 0; i < 7; i++) {
    const d = leaf(g.range(-6, 6) * s, 0, s * g.range(14, 26), s * 1.8, -90 + g.range(-35, 35));
    if (i % 2) a += d; else b += d;
  }
  return [sh(a, col), sh(b, shade(col, -0.15))];
}

/** Small brown woodland mushrooms cluster (scenery). */
export function brownMushrooms(seed: number, col = '#b98a5a'): Shape[] {
  const g = rng(seed);
  const out: Shape[] = [];
  for (let i = 0; i < 3; i++) {
    const x = (i - 1) * 12 + g.range(-3, 3), h = g.range(12, 24), r = g.range(8, 13);
    out.push(sh(rect(x - 2.5, -h, 5, h, 2), '#efe4cc'));
    out.push(sh(blob([[x - r, -h + 1], [x - r * 0.7, -h - r * 0.6], [x, -h - r * 0.8], [x + r * 0.7, -h - r * 0.6], [x + r, -h + 1]], 0.9), shade(col, g.range(-0.15, 0.1))));
  }
  return out;
}

/** Leafy canopy clump made of many overlapping leaf dabs. */
export function foliage(seed: number, w: number, h: number, cols: string[], n = 40): Shape[] {
  const g = rng(seed);
  const out: Shape[] = [];
  const groups = cols.map(() => '');
  out.push(sh(blob([[-w / 2, 0], [-w * 0.4, -h * 0.6], [0, -h], [w * 0.4, -h * 0.6], [w / 2, 0], [0, h * 0.25]], 1), shade(cols[0], -0.25)));
  for (let i = 0; i < n; i++) {
    const a = g.range(0, Math.PI * 2), r = Math.sqrt(g.next());
    const x = Math.cos(a) * r * w * 0.45, y = -h * 0.4 + Math.sin(a) * r * h * 0.55;
    const k = g.int(0, cols.length - 1);
    groups[k] += blob([[x - 14, y], [x - 8, y - 12], [x + 6, y - 13], [x + 15, y - 2], [x + 8, y + 9], [x - 6, y + 9]], 1);
  }
  groups.forEach((d, k) => d && out.push(sh(d, cols[k])));
  return out;
}

/** A rounded stone. */
export function stone(rx: number, ry: number, col: string, seed = 1): Shape[] {
  const g = rng(seed);
  const pts: Pt[] = [];
  for (let i = 0; i < 8; i++) pts.push(polar(0, 0, (i % 2 ? rx : rx * 0.95) * g.range(0.9, 1.05), i * 45).map((v, j) => (j ? v * (ry / rx) : v)) as Pt);
  return [sh(blob(pts, 1), col), sh(ellipse(-rx * 0.25, -ry * 0.35, rx * 0.45, ry * 0.3), shade(col, 0.2), { opacity: 0.7 })];
}

/** Log seen end-on (rings) — centred. */
export function logEnd(r: number, seed: number): Shape[] {
  const g = rng(seed);
  const out: Shape[] = [sh(circle(0, 0, r), '#5a3d24'), sh(circle(g.range(-1, 1), g.range(-1, 1), r * 0.86), '#d8b07a')];
  let rings = '';
  for (let k = 1; k <= 3; k++) rings += circle(g.range(-1, 1), g.range(-1, 1), r * 0.22 * k);
  out.push(stroke(rings, '#b08454', Math.max(0.8, r / 18)), stroke(line([[0, 0], [r * 0.7, -r * 0.3]]), '#8a6038', 1));
  return out;
}

/** Hanging bundle of dried herbs, string at the origin, hanging down. */
export function herbBundle(seed: number, col: string, len = 70): Shape[] {
  const g = rng(seed);
  let st = '', lv = '', lv2 = '';
  for (let i = 0; i < 9; i++) {
    const a = 90 + (i - 4) * 6 + g.range(-3, 3);
    const [ex, ey] = polar(0, 14, len * g.range(0.8, 1.05), a);
    st += line([[0, 14], [ex, ey]]);
    for (let k = 0; k < 4; k++) {
      const t = 0.35 + k * 0.17, x = ex * t, y = 14 + (ey - 14) * t;
      lv += leaf(x, y, 10, 3, a + 40 + g.range(-10, 10));
      lv2 += leaf(x, y, 10, 3, a - 40 + g.range(-10, 10));
    }
  }
  return [
    stroke(line([[0, -6], [0, 14]]), '#b9a27a', 1.4), sh(rect(-5, 8, 10, 8, 2), '#c9a66b'),
    stroke(st, shade(col, -0.3), 1.2), sh(lv, col), sh(lv2, shade(col, -0.15)),
  ];
}

/** Copper pan hanging by its handle from a hook; hook at the origin. */
export function copperPan(r: number): Shape[] {
  return [
    sh(sector(0, 6, 5, 0, 360, 2.8), W.copperDark),
    sh(rect(-4, 8, 8, r * 1.3, 3), W.copperDark), sh(rect(-2, 8, 3, r * 1.3, 1.5), W.copperLight, { opacity: 0.6 }),
    sh(circle(0, 8 + r * 1.3 + r, r), W.copperDark), sh(circle(0, 8 + r * 1.3 + r, r * 0.9), W.copper),
    sh(circle(-r * 0.15, 8 + r * 1.3 + r * 0.95, r * 0.6), shade(W.copper, 0.15)),
    sh(ellipse(-r * 0.4, 8 + r * 1.3 + r * 0.6, r * 0.22, r * 0.35, 30), '#ffe3c0', { opacity: 0.6 }),
  ];
}

/** Woven wicker basket; origin bottom-centre. */
export function basket(w: number, h: number, col = '#c49a5c', seed = 1): Shape[] {
  const dk = shade(col, -0.25), lt = shade(col, 0.2);
  const out: Shape[] = [sh(poly([[-w / 2, -h], [w / 2, -h], [w * 0.42, 0], [-w * 0.42, 0]]), col)];
  let weave = '', weave2 = '';
  const rows = Math.max(3, Math.round(h / 9));
  for (let r = 0; r < rows; r++) {
    const y0 = -h + (r * h) / rows, y1 = -h + ((r + 1) * h) / rows;
    const t = (r + 0.5) / rows, hw = w / 2 - (w * 0.08) * t;
    const n = Math.round(w / 14);
    for (let i = 0; i < n; i++) {
      const x = -hw + ((i + (r % 2) * 0.5) * 2 * hw) / n;
      if (x > hw - 6) continue;
      const d = ellipse(x + hw / n, (y0 + y1) / 2, hw / n - 1, (y1 - y0) / 2 - 0.8);
      if ((i + r) % 2) weave += d; else weave2 += d;
    }
  }
  out.push(sh(weave, lt), sh(weave2, shade(col, -0.08)));
  out.push(sh(rect(-w / 2 - 3, -h - 6, w + 6, 9, 4), dk), sh(rect(-w / 2 - 3, -h - 6, w + 6, 3.5, 2), lt));
  void seed;
  return out;
}

/** Glass storage jar with lid and coloured contents; origin bottom-centre. */
export function jar(w: number, h: number, fill: string, lid = W.copperDark): Shape[] {
  return [
    sh(rect(-w / 2, -h, w, h, w * 0.2), '#e4eee8', { opacity: 0.55 }),
    sh(rect(-w / 2 + 3, -h * 0.72, w - 6, h * 0.72 - 3, w * 0.16), fill),
    sh(rect(-w / 2 + 3, -h * 0.72, w - 6, 4, 2), shade(fill, 0.2)),
    sh(rect(-w / 2 + 5, -h + 8, 4, h - 16, 2), '#ffffff', { opacity: 0.55 }),
    sh(rect(-w / 2 - 2, -h - 8, w + 4, 10, 3), lid), sh(rect(-w / 2 - 2, -h - 8, w + 4, 3, 1.5), shade(lid, 0.25)),
  ];
}

/** Square tin with a label band; origin bottom-centre. */
export function tin(w: number, h: number, col: string, band = W.cream): Shape[] {
  return [
    sh(rect(-w / 2, -h, w, h, 2), col), sh(rect(w * 0.2, -h, w * 0.3, h), shade(col, -0.18), { opacity: 0.7 }),
    sh(rect(-w / 2, -h * 0.62, w, h * 0.3), band), stroke(line([[-w * 0.3, -h * 0.47], [w * 0.3, -h * 0.47]]), shade(col, -0.2), 1.4),
    sh(rect(-w / 2 - 2, -h - 5, w + 4, 6, 2), shade(col, -0.3)),
  ];
}

/** Row of book spines standing on a shelf; origin bottom-left, returns shapes and width. */
export function books(n: number, seed: number, maxH: number): Shape[] {
  const g = rng(seed);
  const out: Shape[] = [];
  let x = 0;
  const cols = ['#7a4d6a', '#5f8a6a', '#a9483a', '#3f5f7a', '#c49a5c', '#6b4a2f', '#8a8a5a'];
  for (let i = 0; i < n; i++) {
    const w = g.range(9, 16), h = maxH * g.range(0.72, 1), c = g.pick(cols);
    out.push(sh(rect(x, -h, w, h, 1), c), sh(rect(x + 1.5, -h * 0.82, w - 3, 3) , shade(c, 0.35)), sh(rect(x + 1.5, -h * 0.3, w - 3, 2.5), shade(c, 0.35)));
    x += w + 1;
  }
  return out;
}

/** Hanging lantern with a glowing candle; hook at the origin, about 90 tall. */
export function lantern(col = W.iron, glow = true): Shape[] {
  const out: Shape[] = [
    sh(sector(0, 6, 7, 180, 360, 4), col),
    sh(poly([[-14, 20], [0, 8], [14, 20]]), col), sh(rect(-16, 20, 32, 5, 2), col),
    sh(rect(-13, 25, 26, 42, 2), glow ? '#ffe9a8' : '#cfdad8', { opacity: glow ? 0.9 : 0.5 }),
  ];
  if (glow) out.push(sh(circle(0, 46, 22), '#ffd98a', { opacity: 0.25 }), sh(rect(-4, 48, 8, 16, 1), '#f5ecd5'), sh(blob([[0, 36], [3, 44], [0, 48], [-3, 44]], 1), W.fire));
  out.push(stroke(line([[-13, 25], [-13, 67]]) + line([[13, 25], [13, 67]]) + line([[0, 25], [0, 34]]) + line([[0, 64], [0, 67]]), col, 2));
  out.push(sh(rect(-16, 66, 32, 6, 2), col), sh(rect(-8, 72, 16, 4, 1), col));
  return out;
}

/** Wooden birdhouse; origin bottom-centre (on a post stub). */
export function birdhouse(w: number, col: string, roof: string): Shape[] {
  const h = w * 1.1;
  return [
    sh(rect(-w * 0.1, -6, w * 0.2, 6), shade(col, -0.35)),
    sh(rect(-w / 2, -h, w, h - 6, 2), col), sh(rect(w * 0.15, -h, w * 0.35, h - 6), shade(col, -0.15)),
    sh(poly([[-w * 0.65, -h + 4], [0, -h - w * 0.55], [w * 0.65, -h + 4], [w * 0.58, -h + 12], [0, -h - w * 0.42], [-w * 0.58, -h + 12]]), roof),
    sh(poly([[0, -h - w * 0.55], [w * 0.65, -h + 4], [w * 0.58, -h + 12], [0, -h - w * 0.42]]), shade(roof, -0.2)),
    sh(circle(0, -h * 0.55, w * 0.14), '#2c2018'),
    sh(rect(-w * 0.04, -h * 0.34, w * 0.08, w * 0.16), shade(col, -0.4)),
  ];
}

/** Sleeping cat curled up, origin at the bottom-centre, about 140 wide. */
export function sleepingCat(col = '#d98c4a', stripe = '#b0652e'): Shape[] {
  const lt = shade(col, 0.3);
  return [
    sh(ellipse(0, -2, 72, 9), '#2a1c18', { opacity: 0.25 }),
    sh(blob([[-64, -6], [-60, -36], [-30, -56], [10, -58], [46, -44], [62, -22], [58, -4], [0, 0]], 1), col),
    stroke(curve([[-30, -50], [-36, -34], [-30, -14]]) + curve([[-10, -56], [-14, -36], [-8, -10]]) + curve([[12, -56], [10, -36], [16, -14]]) + curve([[32, -48], [30, -30], [36, -14]]), stripe, 3),
    sh(blob([[-64, -6], [-40, -14], [0, -10], [44, -12], [62, -6], [30, 0], [-30, 0]], 1), col),
    stroke(curve([[60, -8], [30, -2], [-20, -4], [-50, -12], [-58, -24]]), stripe, 9),
    stroke(curve([[60, -8], [30, -2], [-20, -4], [-50, -12], [-58, -24]]), col, 5),
    sh(blob([[-74, -14], [-78, -36], [-66, -50], [-44, -48], [-36, -30], [-44, -12]], 1), col),
    sh(poly([[-74, -38], [-80, -60], [-62, -48]]) + poly([[-52, -48], [-42, -64], [-40, -42]]), col),
    sh(poly([[-73, -42], [-76, -55], [-65, -48]]), '#e7a9a0'),
    sh(blob([[-70, -22], [-60, -16], [-48, -20], [-54, -28], [-64, -28]], 1), lt),
    stroke(curve([[-70, -32], [-66, -30], [-62, -32]]) + curve([[-54, -32], [-50, -30], [-46, -32]]), '#3a2a22', 1.6),
    sh(poly([[-59, -25], [-55, -25], [-57, -22]]), '#c97a72'),
    stroke(line([[-60, -22], [-76, -20]]) + line([[-60, -21], [-74, -16]]) + line([[-54, -22], [-38, -20]]), '#f3ead2', 0.7),
  ];
}

/** Red squirrel sitting up, facing right; origin at the feet, about 80 tall. */
export function squirrel(col = '#c0642e'): Shape[] {
  const dk = shade(col, -0.22), lt = '#f1dcc0';
  return [
    sh(blob([[-6, -4], [-30, -14], [-40, -44], [-30, -72], [-12, -78], [-6, -62], [-20, -48], [-16, -24], [-2, -14]], 1), dk),
    sh(blob([[-12, -10], [-30, -24], [-32, -48], [-22, -66], [-14, -60], [-22, -44], [-16, -24]], 1), col, { opacity: 0.9 }),
    sh(blob([[-8, -2], [-12, -24], [-2, -40], [12, -40], [18, -22], [12, -2]], 1), col),
    sh(blob([[2, -6], [2, -26], [10, -34], [14, -22], [10, -6]], 1), lt),
    sh(blob([[0, -38], [4, -52], [16, -56], [26, -48], [26, -40], [14, -36]], 1), col),
    sh(poly([[4, -50], [4, -64], [12, -54]]), dk),
    sh(circle(16, -48, 2.2), W.ink), sh(circle(16.6, -48.6, 0.8), '#ffffff'),
    sh(ellipse(10, -26, 5, 3), dk),
    sh(ellipse(-4, -2, 7, 2.5) + ellipse(12, -2, 6, 2.5), dk),
  ];
}

/** Woodpile of logs seen end-on, origin bottom-left. */
export function logPile(cols: number, rows: number, r: number, seed: number): Shape[] {
  const g = rng(seed);
  const out: Shape[] = [];
  for (let row = 0; row < rows; row++) {
    const n = cols - (row % 2);
    for (let i = 0; i < n; i++) {
      const rr = r * g.range(0.85, 1.05);
      const x = r + i * r * 2 + (row % 2) * r, y = -r - row * r * 1.72;
      out.push(...place(logEnd(rr, seed * 31 + row * 7 + i), { x, y }));
    }
  }
  return out;
}

/** Cluster of small wildflowers (scenery). */
export function flowers(seed: number, n: number, w: number, cols: string[]): Shape[] {
  const g = rng(seed);
  let st = '';
  const heads: Shape[] = [];
  for (let i = 0; i < n; i++) {
    const x = g.range(-w / 2, w / 2), h = g.range(18, 38);
    st += line([[x, 0], [x + g.range(-3, 3), -h]]);
    const c = g.pick(cols);
    let p = '';
    for (let k = 0; k < 5; k++) p += petal(x, -h, 6, 2.6, k * 72 + g.range(0, 30));
    heads.push(sh(p, c), sh(circle(x, -h, 1.8), '#f2c84b'));
  }
  return [stroke(st, '#5f8a45', 1.2), ...heads];
}

/** Five-point sparkle for sunlight glints. */
export const sparkle = (r: number) => [sh(star(0, 0, r, r * 0.3, 4, 0), '#fff6d2', { opacity: 0.8 })];
