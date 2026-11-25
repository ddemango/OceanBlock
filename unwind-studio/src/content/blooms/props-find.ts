// Props for the Birds & Blooms hidden-object scenes. Every prop returns
// Shape[] drawn around the origin (base at 0,0 unless noted).
import { blob, circle, curve, ellipse, leaf, line, mix, petal, poly, rect, rng, sector, sh, shade, star, stroke, xf, place } from '../../art/kit';
import type { Pt } from '../../art/geometry';
import type { Shape } from '../../art/types';
import { C, bird, blossomPath, daisy, leafClump, peony, polar, rose, roseBud, spike, tulip, type BirdCols } from '../garden/props';

export { C };

// ------------------------------------------------------------------ birds
export const BIRDS: Record<string, BirdCols> = {
  robin: { back: '#8a6a4a', breast: '#e0703a', wing: '#76583c', beak: '#3a3028' },
  bluetit: { back: '#9cb86a', breast: '#f0d65a', wing: '#5f8fc8', cap: '#4a7fc0', beak: '#3a3028' },
  sparrow: { back: '#a07a56', breast: '#d9c9ae', wing: '#7a5838', cap: '#8a8a80', beak: '#5a4a3a' },
  finch: { back: '#b99a6a', breast: '#e98a6a', wing: '#5a4a3a', cap: '#c94a3c', beak: '#d9c9ae' },
  chickadee: { back: '#9a9a92', breast: '#f2ece0', wing: '#6e6e6a', cap: '#2f2a28', beak: '#2f2a28' },
  goldfinch: { back: '#e9c64a', breast: '#f5dc72', wing: '#2f2a28', cap: '#d6453b', beak: '#e9d9b0' },
  cardinal: { back: '#c93a32', breast: '#d84a3c', wing: '#a52e2a', beak: '#e98a3a' },
  bluebird: { back: '#5a86c8', breast: '#e39a62', wing: '#4a70b0', beak: '#2f2a28' },
};
export const songbird = (k: keyof typeof BIRDS, legs = true) => bird(BIRDS[k], legs);

/** Robin with a bit of extra charm (target version, facing right). */
export function robin(): Shape[] {
  return [...bird(BIRDS.robin), sh(blob([[8, -38], [20, -34], [24, -24], [14, -14], [4, -22]], 1), '#e0703a'), sh(circle(22, -43.5, 2.6), C.ink), sh(circle(22.8, -44.4, 0.9), '#ffffff')];
}

/** Woodpecker clinging to a trunk, head up, facing right; about 70 tall. */
export function woodpecker(): Shape[] {
  return [
    sh(poly([[-6, 10], [-12, 34], [-2, 30], [2, 34], [4, 10]]), '#2f2a28'),
    sh(blob([[-10, 14], [-14, -6], [-8, -22], [6, -26], [12, -10], [8, 12]], 1), '#2f2a28'),
    sh(blob([[-2, 10], [0, -10], [8, -16], [12, -4], [8, 10]], 1), '#f2ece0'),
    sh(ellipse(-8, 0, 3, 2) + ellipse(-10, 8, 3, 2) + ellipse(-6, -10, 3, 2), '#f2ece0'),
    sh(circle(4, -30, 10), '#2f2a28'),
    sh(blob([[0, -40], [8, -42], [12, -34], [4, -34]], 1), '#d6453b'),
    sh(ellipse(7, -27, 6, 3.5), '#f2ece0'),
    sh(poly([[12, -32], [28, -30], [12, -27]]), '#5a5048'),
    sh(circle(8, -32, 1.8), '#ffffff'), sh(circle(8.3, -32, 1), C.ink),
    sh(blob([[0, 10], [6, 10], [8, 18], [2, 16]], 1), '#d6453b', { opacity: 0.9 }),
    stroke(line([[6, 4], [12, 6], [14, 2]]) + line([[4, 12], [12, 16], [14, 12]]), '#5a4a3a', 1.6),
  ];
}

/** Grey squirrel sitting up, facing right; origin at its feet, about 80 tall. */
export function squirrel(col = '#a08470'): Shape[] {
  const dk = shade(col, -0.2), lt = shade(col, 0.35);
  return [
    sh(blob([[-8, -4], [-30, -14], [-40, -40], [-34, -70], [-18, -82], [-6, -74], [-18, -60], [-22, -36], [-10, -18]], 1), dk),
    sh(blob([[-14, -14], [-30, -30], [-30, -58], [-20, -74], [-14, -66], [-22, -46], [-16, -24]], 1), col),
    sh(blob([[-12, 0], [-16, -20], [-8, -40], [8, -44], [16, -28], [14, -6], [4, 0]], 1), col),
    sh(blob([[0, -6], [6, -28], [14, -30], [14, -10], [8, -2]], 1), lt),
    sh(circle(10, -50, 12), col),
    sh(poly([[2, -58], [4, -70], [10, -60]]) + poly([[10, -60], [14, -70], [16, -58]]), dk),
    sh(ellipse(20, -46, 6, 4.5), lt),
    sh(circle(13, -53, 2.2), C.ink), sh(circle(13.6, -53.6, 0.8), '#ffffff'),
    sh(circle(25, -47, 1.6), C.ink),
    sh(ellipse(16, -32, 5, 4), dk),
    sh(ellipse(18, -32, 4.5, 5.5), '#b5824a'), sh(ellipse(18, -36.5, 4.8, 2.4), '#6e4a2e'),
    sh(ellipse(-4, -2, 9, 4) + ellipse(10, -1, 7, 3.5), dk),
  ];
}

// ------------------------------------------------------------------ small targets
export function scissors(col = '#d0607a'): Shape[] {
  return [
    stroke(ellipse(-26, -10, 11, 7, -15), col, 5), stroke(ellipse(-26, 10, 11, 7, 15), shade(col, -0.15), 5),
    sh(poly([[-16, -7], [0, -3], [0, 3], [-16, -2]]), shade(col, -0.1)),
    sh(poly([[-16, 7], [0, 3], [0, -3], [-16, 2]]), shade(col, -0.25)),
    sh(poly([[0, -3.5], [50, 5], [52, 8], [0, 3.5]]), '#a9b3b9'),
    sh(poly([[0, 3.5], [50, -5], [52, -8], [0, -3.5]]), '#dbe2e6'),
    stroke(line([[6, -2], [44, -6]]), '#ffffff', 1, { opacity: 0.8 }),
    sh(circle(0, 0, 3.6), '#6a7378'), sh(circle(0, 0, 1.4), '#e6ebee'),
  ];
}

/** Spool of ribbon seen face-on with a trailing tail; about 56 across. */
export function ribbonSpool(col = '#e58aa6'): Shape[] {
  const dk = shade(col, -0.2);
  return [
    sh(blob([[14, 10], [26, 22], [22, 34], [34, 40], [28, 28], [34, 18], [20, 8]], 0.8), dk),
    sh(circle(0, 0, 21), '#efe4cc'), stroke(circle(0, 0, 21), '#c9b48c', 1.4),
    sh(circle(0, 0, 17), col),
    stroke(circle(0, 0, 14) + circle(0, 0, 11), dk, 0.9),
    sh(ellipse(-6, -8, 6, 3, -35), shade(col, 0.35), { opacity: 0.8 }),
    sh(circle(0, 0, 7), '#efe4cc'), sh(circle(0, 0, 3), '#7a6648'),
    sh(poly([[12, 12], [26, 24], [22, 28], [10, 16]]), col),
  ];
}

/** Teacup on a saucer; about 64 wide, origin at the saucer base. */
export function teacup(col = '#f4ede0', trim = '#6f9fd0', tea = '#9a5a2e'): Shape[] {
  return [
    sh(ellipse(0, -4, 32, 6), shade(col, -0.12)), sh(ellipse(0, -6, 30, 5), col), stroke(ellipse(0, -6, 26, 4), trim, 1),
    stroke(curve([[17, -30], [30, -30], [28, -16], [15, -14]]), shade(col, -0.1), 4.5),
    sh(blob([[-22, -34], [22, -34], [18, -16], [8, -8], [-8, -8], [-18, -16]], 0.7), col),
    sh(blob([[6, -33], [22, -34], [18, -16], [8, -9]], 0.7), shade(col, -0.12)),
    sh(ellipse(0, -34, 22, 5), shade(col, -0.18)), sh(ellipse(0, -33.5, 19.5, 4), tea),
    stroke(line([[-21, -30], [21, -30]]), trim, 1.6),
    sh(blossomPath(-8, -21, 5, 5, 0.5) + blossomPath(6, -19, 4, 5, 0.5), trim, { opacity: 0.8 }),
    stroke(curve([[-6, -42], [-10, -50], [-4, -56], [-8, -64]]) + curve([[5, -42], [1, -50], [7, -56], [3, -62]]), '#ffffff', 1.6, { opacity: 0.6 }),
  ];
}

/** Mug with a heart; about 50 wide incl. handle; origin bottom centre. */
export function mug(col = '#c94a3c', drink = '#7a4a2a'): Shape[] {
  return [
    stroke(curve([[14, -34], [28, -34], [28, -14], [14, -12]]), shade(col, -0.15), 5),
    sh(rect(-17, -42, 34, 42, 5), col), sh(rect(5, -42, 12, 42, 5), shade(col, -0.15)),
    sh(ellipse(0, -42, 17, 4.5), shade(col, -0.25)), sh(ellipse(0, -41.5, 14.5, 3.4), drink),
    sh(ellipse(-4, -42, 5, 1.6) + ellipse(4, -41, 4, 1.4), '#fff4e4'),
    sh(blob([[-4, -24], [-8, -28], [-4, -31], [0, -27], [4, -31], [8, -28], [4, -24], [0, -19]], 0.6), '#fff4e4'),
    stroke(curve([[-4, -50], [-8, -58], [-2, -64]]) + curve([[5, -50], [1, -57], [6, -62]]), '#ffffff', 1.5, { opacity: 0.6 }),
  ];
}

/** Plant mister / spray bottle; origin bottom centre, about 66 tall. */
export function sprayBottle(col = '#7fb8a6'): Shape[] {
  return [
    sh(blob([[-16, 0], [-18, -20], [-12, -36], [12, -36], [18, -20], [16, 0]], 0.8), col),
    sh(blob([[4, -2], [6, -34], [12, -36], [18, -20], [16, 0]], 0.8), shade(col, -0.15)),
    sh(ellipse(-8, -20, 3.5, 10), '#ffffff', { opacity: 0.45 }),
    sh(rect(-6, -46, 12, 11, 2), '#e9e3d6'),
    sh(blob([[-8, -46], [-8, -60], [14, -60], [24, -56], [24, -52], [6, -50], [6, -46]], 0.5), '#4f6a66'),
    sh(blob([[2, -50], [4, -42], [10, -38], [8, -48]], 0.6), '#3f5652'),
    sh(rect(22, -58, 6, 5, 1), '#5a6a70'),
    stroke(line([[-14, -8], [14, -8]]), shade(col, -0.25), 1.2),
  ];
}

/** Brass shop bell on a curled bracket; origin at the bracket top, hangs downward, about 50 tall. */
export function shopBell(col = '#d4a23c'): Shape[] {
  return [
    stroke(curve([[-18, 0], [0, 0], [8, 6], [2, 12], [-4, 8]]), '#3f4347', 2.6),
    stroke(line([[0, 0], [0, 14]]), '#3f4347', 2),
    sh(blob([[-4, 16], [4, 16], [10, 26], [12, 40], [18, 46], [-18, 46], [-12, 40], [-10, 26]], 0.7), col),
    sh(blob([[4, 17], [9, 26], [11, 40], [17, 46], [6, 46], [6, 30]], 0.7), shade(col, -0.18)),
    sh(ellipse(-4, 30, 2.5, 8), '#f6e2a0', { opacity: 0.8 }),
    sh(ellipse(0, 46, 18, 3.5), shade(col, -0.3)),
    sh(circle(0, 50, 4), shade(col, -0.1)),
    sh(circle(0, 14, 3.5), shade(col, 0.1)),
  ];
}

/** Sealed envelope; about 60 wide, centred. */
export function envelope(col = '#f6ecd8', seal = '#c94a3c'): Shape[] {
  return [
    sh(rect(-30, -20, 60, 40, 2), col),
    sh(poly([[-30, 20], [0, -2], [30, 20]]), shade(col, -0.06)),
    sh(poly([[-30, -20], [0, 6], [30, -20]]), shade(col, -0.12)),
    stroke(rect(-30, -20, 60, 40, 2), shade(col, -0.3), 1),
    sh(circle(0, 5, 6.5), seal), sh(blob([[0, 9], [-3.5, 5], [-2, 2.5], [0, 4], [2, 2.5], [3.5, 5]], 0.6), shade(seal, 0.3)),
  ];
}

/** Pencil, about 80 long, pointing right; centred. */
export function pencil(col = '#f3c94f'): Shape[] {
  return [
    sh(rect(-40, -5, 10, 10, 2), '#e98a9a'), sh(rect(-31, -5.5, 6, 11), '#b9c2c8'),
    sh(rect(-25, -5, 50, 10), col), sh(rect(-25, 1.5, 50, 3.5), shade(col, -0.18)),
    stroke(line([[-25, -1.5], [25, -1.5]]), shade(col, 0.3), 1),
    sh(poly([[25, -5], [40, 0], [25, 5]]), '#e6c9a0'), sh(poly([[35, -1.8], [41, 0], [35, 1.8]]), '#3a3a3a'),
  ];
}

/** Round reading glasses, about 66 wide, centred. */
export function glasses(col = '#6e4a2e'): Shape[] {
  return [
    sh(circle(-17, 0, 13) + circle(17, 0, 13), '#dfeef5', { opacity: 0.5 }),
    stroke(circle(-17, 0, 13) + circle(17, 0, 13), col, 3),
    stroke(curve([[-4, -2], [0, -6], [4, -2]]), col, 2.6),
    stroke(line([[-30, -2], [-36, -6], [-40, 4]]) + line([[30, -2], [36, -6], [40, 4]]), col, 2.2),
    sh(ellipse(-21, -5, 4, 2.2, -30) + ellipse(13, -5, 4, 2.2, -30), '#ffffff', { opacity: 0.8 }),
  ];
}

/** Binoculars, front view; about 70 wide, centred. */
export function binoculars(col = '#3f4a44'): Shape[] {
  const lt = shade(col, 0.25);
  return [
    stroke(curve([[-22, -22], [0, -40], [22, -22]]), '#8a5a3a', 2.4),
    sh(rect(-34, -24, 26, 40, 6) + rect(8, -24, 26, 40, 6), col),
    sh(rect(-31, -22, 8, 34, 3) + rect(11, -22, 8, 34, 3), lt),
    sh(rect(-8, -16, 16, 14, 2), shade(col, -0.2)), sh(circle(0, -9, 4), '#b9c2c8'),
    sh(circle(-21, 20, 14) + circle(21, 20, 14), shade(col, -0.25)),
    sh(circle(-21, 20, 10) + circle(21, 20, 10), '#4a6f8a'),
    sh(circle(-24, 17, 3.5) + circle(18, 17, 3.5), '#cfe6f2', { opacity: 0.9 }),
  ];
}

/** Feather, about 80 long, pointing up; base of the quill at origin. */
export function feather(col = '#7fa6c9'): Shape[] {
  const vane = blob([[0, -8], [-10, -20], [-14, -40], [-10, -60], [-2, -76], [6, -64], [13, -44], [12, -24], [5, -10]], 0.9);
  let barbs = '';
  for (let i = 0; i < 9; i++) {
    const y = -16 - i * 6.5;
    barbs += line([[0, y], [-11 + Math.abs(i - 4) * 0.8, y - 7]]) + line([[0.5, y], [11 - Math.abs(i - 4) * 0.8, y - 6]]);
  }
  return [
    sh(vane, col),
    sh(blob([[1, -10], [5, -10], [12, -24], [13, -44], [6, -64], [0, -74]], 0.9), shade(col, -0.15)),
    sh(blob([[-6, -64], [-16, -58], [-12, -54]], 0.8) + blob([[9, -34], [18, -30], [12, -28]], 0.8), col),
    stroke(barbs, shade(col, -0.3), 0.9, { opacity: 0.8 }),
    sh(blob([[-2, -8], [-8, -4], [-10, -12], [-4, -14]], 1) + blob([[2, -8], [8, -4], [10, -12], [4, -14]], 1), shade(col, 0.35)),
    stroke(curve([[0, 8], [0, -20], [0.5, -50], [-1, -74]]), '#f4ecdc', 1.8),
  ];
}

/** Magnifying glass, about 80 long; lens centred on origin, handle down-right. */
export function magnifier(col = '#8a5a3a'): Shape[] {
  return [
    sh(xf(rect(18, -5, 46, 10, 5), { rot: 40 }), col),
    sh(xf(rect(18, -5, 46, 4, 2), { rot: 40 }), shade(col, 0.25)),
    sh(xf(rect(14, -6, 10, 12, 2), { rot: 40 }), '#c9a54a'),
    sh(circle(0, 0, 19), '#cfe6f2', { opacity: 0.55 }),
    stroke(circle(0, 0, 19), '#c9a54a', 4.5),
    sh(ellipse(-7, -7, 6, 3, -45), '#ffffff', { opacity: 0.8 }),
  ];
}

export function acorn(): Shape[] {
  return [
    stroke(curve([[0, -19], [2, -25], [7, -27]]), '#6b4a2b', 2.4),
    sh(blob([[-10.5, -4], [-10, 10], [-4, 19], [0, 23], [4, 19], [10, 10], [10.5, -4]], 0.9), '#c2914e'),
    sh(blob([[-7, -2], [-7, 8], [-3, 16], [-2, 2]], 0.9), '#e2bb7c', { opacity: 0.85 }),
    sh(blob([[-13, -6], [-11, -15], [0, -20], [11, -15], [13, -6], [0, -2]], 0.9), '#7a5a36'),
    stroke(line([[-9, -14], [-5, -4]]) + line([[-3, -18], [1, -3]]) + line([[4, -18], [7, -4]]) + line([[-11, -9], [11, -12]]), '#56391f', 1),
  ];
}

/** Bird's nest with three eggs; about 96 wide, origin at the base. */
export function nest(seed = 31, egg = '#a9d5d8'): Shape[] {
  const g = rng(seed);
  let tw = '', tw2 = '';
  for (let i = 0; i < 26; i++) {
    const [x, y] = polar(0, -16, g.range(30, 50), g.range(0, 360));
    const l = line([[x * 0.9, y * 0.5 - 6], [x * 0.9 + g.range(-22, 22), y * 0.5 - 6 + g.range(-7, 7)]]);
    if (i % 2) tw += l; else tw2 += l;
  }
  return [
    sh(blob([[-46, -22], [-40, -4], [-18, 2], [18, 2], [40, -4], [46, -22], [30, -32], [-30, -32]], 0.9), '#8a633c'),
    stroke(tw, '#b58a54', 2), stroke(tw2, '#5c3f24', 1.8),
    sh(ellipse(0, -26, 44, 12), '#a47a4a'), sh(ellipse(0, -25, 34, 8.5), '#4b331f'),
    sh(ellipse(-15, -29, 10, 12, -18), egg), sh(ellipse(15, -28, 10, 12, 20), shade(egg, -0.06)), sh(ellipse(0, -32, 10.5, 12.5), shade(egg, 0.2)),
    sh(circle(-17, -32, 1.2) + circle(2, -36, 1.2) + circle(14, -32, 1.1) + circle(4, -27, 1), '#7b6a55'),
    stroke(curve([[-44, -24], [-20, -15], [20, -15], [44, -24]]) + line([[-48, -24], [-58, -30]]) + line([[46, -22], [58, -30]]), '#b58a54', 2),
  ];
}

/** Knitted mitten, cuff down; about 60 tall, origin bottom centre. */
export function mitten(col = '#c94a3c', cuff = '#f2ece0'): Shape[] {
  const dk = shade(col, -0.2);
  let knit = '';
  for (let y = -46; y < -18; y += 7) for (let x = -12; x <= 12; x += 6) knit += line([[x - 2.5, y], [x, y + 3.5], [x + 2.5, y]]);
  return [
    sh(blob([[12, -26], [24, -32], [26, -42], [18, -42], [12, -36]], 0.9), dk),
    sh(blob([[-16, -12], [-18, -38], [-12, -56], [0, -60], [12, -54], [16, -36], [16, -12]], 0.9), col),
    stroke(knit, dk, 1),
    sh(star(0, -34, 7, 3, 6), cuff),
    sh(rect(-18, -14, 36, 14, 3), cuff),
    stroke(line([[-12, -12], [-12, -2]]) + line([[-6, -12], [-6, -2]]) + line([[0, -12], [0, -2]]) + line([[6, -12], [6, -2]]) + line([[12, -12], [12, -2]]), shade(cuff, -0.2), 1.2),
  ];
}

/** Brass candlestick with a lit taper; origin at the base, about 90 tall. */
export function candlestick(wax = '#f4ecd6', brass = '#c9a54a'): Shape[] {
  return [
    sh(ellipse(0, -3, 22, 5), shade(brass, -0.2)), sh(ellipse(0, -5, 20, 4.5), brass),
    stroke(curve([[18, -8], [30, -12], [30, -24], [20, -22]]), shade(brass, -0.1), 3),
    sh(blob([[-5, -6], [-3, -18], [-7, -30], [7, -30], [3, -18], [5, -6]], 0.7), brass),
    sh(ellipse(0, -31, 11, 3.5), shade(brass, 0.15)),
    sh(rect(-5.5, -78, 11, 47, 2), wax), sh(rect(1, -78, 4.5, 47, 2), shade(wax, -0.12)),
    sh(blob([[-5.5, -78], [-6, -70], [-4, -72], [-3, -66], [-1, -76]], 0.8), shade(wax, 0.4)),
    stroke(line([[0, -78], [0, -82]]), '#3a3028', 1.4),
    sh(ellipse(0, -90, 9, 14), '#f6c85a', { opacity: 0.35 }),
    sh(blob([[0, -102], [5, -90], [3, -82], [-3, -82], [-5, -90]], 0.9), '#f6c85a'),
    sh(blob([[0, -95], [2.5, -88], [0, -83], [-2.5, -88]], 0.9), '#fff4cc'),
  ];
}

/** Snow globe with a little fir tree; origin at the base, about 64 tall. */
export function snowGlobe(base = '#8a5a3a'): Shape[] {
  return [
    sh(poly([[-24, 0], [24, 0], [18, -16], [-18, -16]]), base), sh(rect(-20, -18, 40, 5, 2), shade(base, 0.2)),
    sh(circle(0, -38, 22), '#cfe6f2', { opacity: 0.9 }),
    sh(ellipse(0, -22, 16, 5), '#ffffff'),
    sh(poly([[0, -52], [9, -34], [3, -34], [10, -24], [-10, -24], [-3, -34], [-9, -34]]), '#4f8a72'),
    sh(star(0, -53, 3.5, 1.5), C.yellow),
    sh(circle(-12, -46, 1.6) + circle(10, -48, 1.4) + circle(-6, -30, 1.3) + circle(13, -36, 1.5) + circle(-15, -34, 1.3) + circle(4, -56, 1.2), '#ffffff'),
    sh(ellipse(-10, -48, 5, 8, 30), '#ffffff', { opacity: 0.55 }),
    stroke(circle(0, -38, 22), '#a9c7d6', 1.2),
  ];
}

/** Ball of yarn with knitting needles; about 60 wide, centred on the ball. */
export function yarnBall(col = '#8fb3d6'): Shape[] {
  const dk = shade(col, -0.22), lt = shade(col, 0.25);
  let w1 = '', w2 = '';
  for (let i = -3; i <= 3; i++) {
    w1 += curve([[-18 + Math.abs(i) * 2, i * 5 - 4], [0, i * 5.5 + 3], [18 - Math.abs(i) * 2, i * 5 - 3]]);
    w2 += curve([[i * 5 - 5, -18 + Math.abs(i) * 2], [i * 5.5 + 3, 0], [i * 5 - 2, 18 - Math.abs(i) * 2]]);
  }
  return [
    stroke(line([[-30, -26], [24, 18]]) + line([[-22, -32], [30, 10]]), '#c9a66b', 2.6),
    sh(circle(-30, -26, 3) + circle(-22, -32, 3), '#d6453b'),
    sh(circle(0, 0, 21), dk), sh(circle(-1, -1, 19), col),
    stroke(w2, dk, 1.3), stroke(w1, lt, 1.4),
    stroke(curve([[16, 12], [28, 20], [24, 30], [36, 32]]), col, 2.4),
  ];
}

/** Gingerbread man; about 56 tall, centred. */
export function gingerbread(): Shape[] {
  const c = '#b8743e';
  return [
    sh(circle(0, -18, 10) + rect(-9, -10, 18, 20, 6) + xf(rect(-24, -6, 18, 9, 4.5), { rot: -15, ox: -6, oy: -2 }) + xf(rect(6, -6, 18, 9, 4.5), { rot: 15, ox: 6, oy: -2 }) +
      xf(rect(-12, 6, 9, 22, 4.5), { rot: 14, ox: -7, oy: 8 }) + xf(rect(3, 6, 9, 22, 4.5), { rot: -14, ox: 7, oy: 8 }), c),
    stroke(curve([[-5, -14], [0, -11], [5, -14]]) + line([[-20, -8], [-20, -2]]) + line([[20, -8], [20, -2]]) + line([[-10, 22], [-6, 22]]) + line([[6, 22], [10, 22]]), '#fff8ec', 1.6),
    sh(circle(-3.5, -20, 1.6) + circle(3.5, -20, 1.6), '#3a2418'),
    sh(circle(0, -3, 2) + circle(0, 4, 2), '#d6453b'),
  ];
}

/** Candy cane; about 64 tall, origin bottom of the shaft. */
export function candyCane(): Shape[] {
  let stripes = '';
  for (let i = 0; i < 5; i++) stripes += xf(rect(-4, -10 - i * 10, 8, 4), { rot: -25, ox: 0, oy: -8 - i * 10 });
  return [
    sh(rect(-4.5, -46, 9, 46, 3) + sector(11, -46, 15.5, 180, 360, 6.5) + rect(17.5, -46, 9, 8, 3), '#fff8ec'),
    sh(stripes, '#d6453b'),
    sh(xf(rect(-3, -5, 6, 10), { rot: 30, x: 0, y: -56 }) + xf(rect(-3, -5, 6, 10), { rot: 90, x: 11, y: -58 }) + xf(rect(-3, -5, 6, 10), { rot: 150, x: 22, y: -52 }), '#d6453b'),
    stroke(line([[-2, -6], [-2, -40]]), '#ffffff', 1.4, { opacity: 0.8 }),
  ];
}

/** Dog bone toy; about 56 wide, centred. */
export function bone(col = '#f2ead8'): Shape[] {
  return [
    sh(rect(-20, -6, 40, 12, 4) + circle(-22, -7, 7) + circle(-22, 7, 7) + circle(22, -7, 7) + circle(22, 7, 7), col),
    sh(rect(-18, 1, 36, 5, 2) + circle(22, 8, 5) + circle(-22, 8, 5), shade(col, -0.12)),
    stroke(line([[-14, -3], [10, -3]]), '#ffffff', 1.6),
  ];
}

/** Pine cone; about 50 tall, origin at the stalk (top), hangs downward. */
export function pineCone(col = '#8a5a34'): Shape[] {
  const out: Shape[] = [stroke(line([[0, 0], [0, 6]]), '#5c3f24', 2.4), sh(ellipse(0, 26, 15, 22), shade(col, -0.3))];
  let a = '', b = '';
  for (let r = 0; r < 6; r++) {
    const y = 10 + r * 7, w = 13 - Math.abs(r - 2.5) * 2.4;
    for (let k = -1; k <= 1; k++) {
      const x = k * w * 0.66 + (r % 2 ? 3 : -3) * 0.5;
      const sc = blob([[x - 5, y], [x, y - 3], [x + 5, y], [x + 3, y + 6], [x - 3, y + 6]], 0.9);
      if ((r + k) % 2) a += sc; else b += sc;
    }
  }
  out.push(sh(a, col), sh(b, shade(col, 0.15)));
  out.push(stroke(line([[-6, 18], [-2, 20]]) + line([[4, 30], [8, 32]]), '#f2e0c0', 1, { opacity: 0.7 }));
  return out;
}

/** Felt slipper seen from the side, toe right; about 70 long, origin at sole centre. */
export function slipper(col = '#6f8fb0', lining = '#f2ece0'): Shape[] {
  return [
    sh(blob([[-34, 0], [-36, -12], [-26, -16], [-6, -14], [16, -22], [30, -18], [36, -6], [32, 0]], 0.8), col),
    sh(blob([[-30, -12], [-24, -18], [-6, -16], [-12, -10]], 0.8), lining),
    sh(blob([[0, -16], [16, -22], [30, -18], [26, -12], [8, -10]], 0.8), shade(col, 0.2)),
    sh(circle(18, -20, 5), lining), sh(circle(17, -21, 2.2), '#ffffff'),
    sh(rect(-36, -3, 70, 4, 2), '#5a4334'),
    stroke(curve([[-20, -8], [0, -6], [24, -8]]), shade(col, -0.25), 1, { opacity: 0.6 }),
  ];
}

/** Hanging star ornament; origin at the hook, about 40 tall. */
export function starOrnament(col = '#e0a53a'): Shape[] {
  return [stroke(line([[0, 0], [0, 10]]), '#a0262a', 1.4), sh(star(0, 26, 16, 7), col), sh(star(-1, 25, 9, 4), shade(col, 0.4)), sh(circle(0, 10, 2.5), shade(col, -0.2))];
}

/** Holly sprig: two leaves and berries; about 40 wide. */
export function holly(s = 1): Shape[] {
  const lf = (rot: number) => xf(blob([[0, 0], [8, -5], [14, -2], [20, -6], [26, -2], [32, -5], [36, 0], [32, 5], [26, 2], [20, 6], [14, 2], [8, 5]], 0.6), { rot, s });
  return [sh(lf(-160) + lf(-20), '#3d6b3c'), sh(circle(-3 * s, -2 * s, 4 * s) + circle(3 * s, -3 * s, 4 * s) + circle(0, 3 * s, 4 * s), '#c9302c'), sh(circle(-4 * s, -3 * s, 1.2 * s) + circle(2 * s, -4 * s, 1.2 * s), '#ffffff', { opacity: 0.7 })];
}

// ------------------------------------------------------------------ scenery
/** Glass or ceramic vase; origin bottom centre. */
export function vase(w: number, h: number, col: string, kind: 'jug' | 'bottle' | 'bowl' | 'cyl' = 'jug', glass = false): Shape[] {
  const o = glass ? { opacity: 0.55 } : {};
  let d: string;
  if (kind === 'bottle') d = blob([[-w * 0.5, 0], [-w * 0.55, -h * 0.4], [-w * 0.16, -h * 0.75], [-w * 0.16, -h], [w * 0.16, -h], [w * 0.16, -h * 0.75], [w * 0.55, -h * 0.4], [w * 0.5, 0]], 0.7);
  else if (kind === 'bowl') d = blob([[-w * 0.3, 0], [-w * 0.5, -h * 0.5], [-w * 0.44, -h], [w * 0.44, -h], [w * 0.5, -h * 0.5], [w * 0.3, 0]], 0.7);
  else if (kind === 'cyl') d = rect(-w / 2, -h, w, h, w * 0.08);
  else d = blob([[-w * 0.36, 0], [-w * 0.5, -h * 0.45], [-w * 0.3, -h * 0.82], [-w * 0.36, -h], [w * 0.36, -h], [w * 0.3, -h * 0.82], [w * 0.5, -h * 0.45], [w * 0.36, 0]], 0.7);
  return [
    sh(d, col, o),
    sh(xf(d, { sx: 0.45, ox: 0, x: w * 0.22 }), shade(col, -0.15), glass ? { opacity: 0.4 } : { opacity: 0.6 }),
    sh(ellipse(-w * 0.22, -h * 0.5, w * 0.06, h * 0.25), '#ffffff', { opacity: glass ? 0.6 : 0.35 }),
    sh(ellipse(0, -h, w * (kind === 'bowl' ? 0.44 : kind === 'cyl' ? 0.5 : 0.36), Math.max(2, w * 0.08)), shade(col, -0.3), glass ? { opacity: 0.6 } : {}),
  ];
}

/** Bouquet head of mixed blooms centred on origin (no stems). */
export function bouquet(seed: number, r: number, cols: string[], kinds: ('rose' | 'peony' | 'daisy' | 'bud' | 'spike')[] = ['rose', 'bud', 'daisy']): Shape[] {
  const g = rng(seed);
  const out: Shape[] = [];
  let lv = '';
  for (let i = 0; i < 9; i++) lv += leaf(g.range(-r * 0.3, r * 0.3), g.range(-r * 0.2, r * 0.2), r * g.range(0.7, 1.05), r * 0.2, g.range(-200, 20));
  out.push(sh(lv, C.leaf));
  const n = Math.max(3, Math.round(r / 9));
  for (let i = 0; i < n; i++) {
    const [x, y] = polar(0, 0, r * g.range(0.05, 0.65), g.range(0, 360));
    const k = g.pick(kinds), col = g.pick(cols), rr = r * g.range(0.24, 0.36);
    const p = k === 'rose' ? rose(rr, col, seed + i) : k === 'peony' ? peony(rr * 1.1, col, seed + i) : k === 'daisy' ? daisy(rr * 0.9, col) : k === 'spike' ? spike(rr * 3, col, seed + i) : roseBud(rr * 0.8, col);
    out.push(...place(p, { x, y, rot: k === 'spike' ? 0 : g.range(0, 70) }));
  }
  return out;
}

/** Galvanised florist bucket with a bunch of flowers; origin bottom centre, bucket width w. */
export function flowerBucket(w: number, seed: number, cols: string[], kind: 'tulip' | 'rose' | 'spike' | 'daisy' | 'peony' | 'sun' | 'euc', metal = '#a9b3b9'): Shape[] {
  const g = rng(seed);
  const h = w * 0.85;
  const out: Shape[] = [];
  const top = -h;
  // stems + blooms behind bucket rim
  const n = kind === 'euc' ? 9 : 7;
  for (let i = 0; i < n; i++) {
    const x = (i / (n - 1) - 0.5) * w * 0.8 + g.range(-4, 4);
    const hh = w * g.range(0.7, 1.1);
    const col = g.pick(cols);
    if (kind === 'tulip') out.push(...place(tulip(hh, col, (x / w) * 30), { x, y: top + 4 }));
    else if (kind === 'spike') out.push(...place(spike(hh * 1.1, col, seed + i, 0.8), { x, y: top + 4 }));
    else if (kind === 'euc') {
      const tip: Pt = [x * 1.6, top - hh];
      out.push(stroke(curve([[x, top], [x * 1.3, top - hh * 0.5], tip]), '#7a8a7a', 1.4));
      let d = '';
      for (let k = 1; k < 7; k++) {
        const t = k / 7;
        d += circle(x + (tip[0] - x) * t + (k % 2 ? 6 : -6), top - hh * t, 5 * (1.1 - t * 0.4));
      }
      out.push(sh(d, i % 2 ? '#9fb8a8' : '#86a596'));
    } else {
      out.push(stroke(curve([[x, top], [x * 1.2, top - hh * 0.5], [x * 1.4, top - hh]]), C.leaf, 1.6));
      out.push(sh(leaf(x * 1.2, top - hh * 0.45, w * 0.18, w * 0.05, i % 2 ? -30 : -150), C.leafLight));
      const p = kind === 'rose' ? rose(w * 0.13, col, seed + i) : kind === 'peony' ? peony(w * 0.16, col, seed + i) : kind === 'sun' ? sunflower(w * 0.15) : daisy(w * 0.12, col);
      out.push(...place(p, { x: x * 1.4, y: top - hh, rot: g.range(0, 60) }));
    }
  }
  // bucket
  const tw = w / 2, bw = w * 0.38;
  out.push(sh(poly([[-tw, top], [tw, top], [bw, 0], [-bw, 0]]), metal));
  out.push(sh(poly([[tw * 0.3, top], [tw, top], [bw, 0], [bw * 0.25, 0]]), shade(metal, -0.15)));
  out.push(sh(poly([[-tw * 0.75, top], [-tw * 0.55, top], [-bw * 0.55, 0], [-bw * 0.72, 0]]), shade(metal, 0.3)));
  out.push(sh(rect(-tw - 2, top - 2, w + 4, 6, 3), shade(metal, 0.15)));
  out.push(stroke(line([[-tw * 0.93, top + h * 0.33], [tw * 0.93, top + h * 0.33]]) + line([[-tw * 0.86, top + h * 0.66], [tw * 0.86, top + h * 0.66]]), shade(metal, -0.25), 1.6));
  return out;
}

export function sunflower(r: number): Shape[] {
  let d = '', d2 = '';
  for (let i = 0; i < 14; i++) { d += petal(0, 0, r, r * 0.22, i * (360 / 14)); d2 += petal(0, 0, r * 0.8, r * 0.2, i * (360 / 14) + 12); }
  return [sh(d, '#e9b232'), sh(d2, '#f3c94f'), sh(circle(0, 0, r * 0.42), '#6e4a2e'), sh(circle(-r * 0.1, -r * 0.1, r * 0.22), '#8a5a34')];
}

/** A row of book spines standing on a shelf; origin at the left foot. Returns the width used via callback. */
export function books(seed: number, w: number, hMax: number, cols: string[]): Shape[] {
  const g = rng(seed);
  const out: Shape[] = [];
  let x = 0;
  while (x < w - 10) {
    const bw = g.range(10, 22), bh = hMax * g.range(0.7, 1);
    const col = g.pick(cols);
    if (x + bw > w) break;
    const lean = g.next() < 0.12 && x > 20;
    const spine = [sh(rect(0, -bh, bw, bh, 1.5), col), sh(rect(bw * 0.7, -bh, bw * 0.3, bh, 1), shade(col, -0.15)), sh(rect(1, -bh * 0.82, bw - 2, 3) + rect(1, -bh * 0.22, bw - 2, 3), shade(col, 0.35), { opacity: 0.85 })];
    if (g.next() < 0.4) spine.push(sh(rect(2, -bh * 0.6, bw - 4, bh * 0.16), mix(col, '#f6ecd2', 0.6)));
    out.push(...place(spine, lean ? { x: x + 4, rot: 10, ox: bw, oy: 0 } : { x }));
    x += bw + (lean ? 8 : 0.5);
  }
  return out;
}

/** Book lying flat (seen from the side); origin bottom-left. */
export function flatBook(w: number, h: number, col: string): Shape[] {
  return [sh(rect(0, -h, w, h, 1.5), col), sh(rect(3, -h + 2, w - 4, h - 4), '#f6ecd2'), stroke(line([[4, -h / 2], [w - 2, -h / 2]]), '#d9cbb4', 0.8), sh(rect(0, -h, 4, h, 1), shade(col, -0.15))];
}

/** Repeating wallpaper: small sprigs on a ground, within a rect. */
export function wallpaper(x: number, y: number, w: number, h: number, ground: string, ink: string, seed: number, step = 60): Shape[] {
  const g = rng(seed);
  let a = '', b = '', c = '';
  for (let yy = y + step / 2, row = 0; yy < y + h; yy += step, row++) {
    for (let xx = x + (row % 2 ? step / 2 : 0) + step / 4; xx < x + w; xx += step) {
      a += leaf(xx, yy, 12, 4, -60 + g.range(-10, 10)) + leaf(xx, yy, 12, 4, -120 + g.range(-10, 10));
      b += blossomPath(xx, yy - 12, 4.5, 5, 0.55);
      c += circle(xx + step / 2, yy + step / 2 - 4, 1.6);
    }
  }
  return [sh(rect(x, y, w, h), ground), sh(a, ink, { opacity: 0.55 }), sh(b, mix(ink, '#e98a9a', 0.6), { opacity: 0.55 }), sh(c, ink, { opacity: 0.4 })];
}

/** Wooden floorboards in a rect. */
export function floorboards(x: number, y: number, w: number, h: number, base: string, seed: number, bh = 34): Shape[] {
  const g = rng(seed);
  const out: Shape[] = [sh(rect(x, y, w, h), shade(base, -0.25))];
  const cols = [base, shade(base, 0.08), shade(base, -0.08), mix(base, '#c99a6a', 0.3)];
  const groups: string[] = cols.map(() => '');
  let grain = '';
  for (let yy = y, row = 0; yy < y + h; yy += bh, row++) {
    let xx = x - g.range(0, 200);
    while (xx < x + w) {
      const bw = g.range(180, 320);
      const x0 = Math.max(x, xx), x1 = Math.min(x + w, xx + bw - 2);
      if (x1 > x0 + 4) {
        groups[g.int(0, cols.length - 1)] += rect(x0, yy + 1, x1 - x0, Math.min(bh - 2, y + h - yy - 1));
        if (g.next() < 0.7) grain += curve([[x0 + 10, yy + bh * 0.4], [(x0 + x1) / 2, yy + bh * g.range(0.3, 0.7)], [x1 - 10, yy + bh * 0.5]]);
      }
      xx += bw;
    }
  }
  groups.forEach((d, i) => { if (d) out.push(sh(d, cols[i])); });
  out.push(stroke(grain, shade(base, -0.2), 1, { opacity: 0.5 }));
  return out;
}

/** Simple sitting dog (sleeping curl seen from the side); origin at the belly bottom centre, about 220 wide. */
export function sleepingDog(col = '#c99a6a', patch = '#8a5a34'): Shape[] {
  const dk = shade(col, -0.18), lt = shade(col, 0.3);
  return [
    sh(blob([[-100, -6], [-110, -30], [-90, -58], [-40, -74], [20, -72], [70, -56], [96, -30], [92, -4], [40, 2], [-40, 2]], 0.9), col),
    sh(blob([[-60, -66], [-30, -74], [10, -72], [0, -50], [-40, -46]], 0.9), patch),
    sh(blob([[-100, -6], [-112, -20], [-126, -16], [-118, -4]], 0.8), dk),
    sh(blob([[-120, -14], [-140, -22], [-150, -14], [-130, -6]], 0.9), col),
    sh(blob([[40, -40], [60, -58], [96, -60], [118, -44], [120, -22], [100, -8], [60, -10], [40, -20]], 0.9), col),
    sh(blob([[62, -56], [78, -70], [92, -66], [86, -40], [70, -34]], 0.9), patch),
    sh(blob([[104, -26], [124, -30], [134, -22], [124, -12], [106, -14]], 0.9), lt),
    sh(ellipse(132, -24, 5, 4), '#2f2a28'),
    stroke(curve([[92, -38], [98, -34], [104, -38]]), '#2f2a28', 1.8),
    sh(blob([[20, -6], [60, -10], [100, -6], [104, 2], [20, 2]], 0.8), lt),
    sh(ellipse(70, -2, 22, 6) + ellipse(108, 0, 14, 5), lt),
    stroke(curve([[-60, -30], [-30, -22], [0, -26]]), dk, 1.4, { opacity: 0.7 }),
  ];
}

/** Hanging Christmas-style stocking; origin at the hanging loop, about 90 tall. */
export function stocking(col: string, cuff = '#f6efe2', seed = 1): Shape[] {
  const g = rng(seed);
  const dk = shade(col, -0.2);
  const pat = g.next() < 0.5 ? star(0, 40, 7, 3) : blossomPath(0, 40, 7, 6, 0.5);
  return [
    stroke(curve([[0, 0], [-6, 4], [0, 10]]), '#6e4a2e', 1.6),
    sh(blob([[-16, 16], [16, 16], [16, 58], [32, 70], [34, 84], [20, 90], [0, 84], [-16, 70]], 0.7), col),
    sh(blob([[10, 18], [16, 18], [16, 58], [30, 70], [20, 64], [10, 56]], 0.7), dk),
    sh(blob([[18, 80], [34, 84], [22, 92], [10, 86]], 0.8), cuff),
    sh(pat, cuff, { opacity: 0.9 }),
    stroke(line([[-14, 54], [14, 54]]) + line([[-14, 60], [14, 62]]), cuff, 2, { opacity: 0.8 }),
    sh(rect(-20, 6, 40, 16, 5), cuff), sh(rect(-20, 16, 40, 6, 3), shade(cuff, -0.1)),
  ];
}

/** Garland of fir along a curve with berries and baubles. */
export function garland(pts: Pt[], seed: number, step = 10, baubles: string[] = ['#c9302c', '#e0a53a']): Shape[] {
  const g = rng(seed);
  let a = '', b = '', c = '', berries = '';
  const n = 60;
  const pathPts: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n, k = t * (pts.length - 1), j = Math.min(pts.length - 2, Math.floor(k)), u = k - j;
    pathPts.push([pts[j][0] + (pts[j + 1][0] - pts[j][0]) * u, pts[j][1] + (pts[j + 1][1] - pts[j][1]) * u]);
  }
  const balls: Shape[] = [];
  let count = 0;
  for (let i = 0; i < pathPts.length; i += Math.max(1, Math.round(step / 10))) {
    const [x, y] = pathPts[i];
    for (let k = 0; k < 4; k++) {
      const l = leaf(x + g.range(-6, 6), y + g.range(-6, 6), g.range(12, 20), 2.6, g.range(0, 360));
      const r = g.int(0, 2);
      if (r === 0) a += l; else if (r === 1) b += l; else c += l;
    }
    if (g.next() < 0.3) berries += circle(x + g.range(-8, 8), y + g.range(-6, 6), 3);
    if (++count % 9 === 4) balls.push(sh(circle(x, y + 10, 7), g.pick(baubles)), sh(circle(x - 2, y + 8, 2.2), '#ffffff', { opacity: 0.7 }));
  }
  return [sh(a, '#2c5034'), sh(b, '#3d6b3c'), sh(c, '#5f8a54'), sh(berries, '#c9302c'), ...balls];
}

/** Frame on a wall with a little painting of a bird or flower. */
export function framedPicture(w: number, h: number, frame: string, kind: 'bird' | 'flower' | 'land', seed = 1): Shape[] {
  const out: Shape[] = [sh(rect(-w / 2, -h / 2, w, h, 2), frame), sh(rect(-w / 2 + 6, -h / 2 + 6, w - 12, h - 12), '#f3ead6')];
  if (kind === 'land') {
    out.push(sh(rect(-w / 2 + 6, -h / 2 + 6, w - 12, (h - 12) * 0.55), '#cfe1e6'), sh(blob([[-w / 2 + 6, 6], [-w * 0.2, -h * 0.08], [w * 0.1, 2], [w / 2 - 6, -h * 0.1], [w / 2 - 6, h / 2 - 6], [-w / 2 + 6, h / 2 - 6]], 0.6), '#9caf88'));
  } else if (kind === 'bird') {
    out.push(stroke(curve([[-w / 2 + 8, h * 0.15], [0, h * 0.1], [w / 2 - 8, h * 0.2]]), '#6e4a2e', 2));
    out.push(...place(bird(BIRDS[(['bluetit', 'robin', 'goldfinch'] as const)[seed % 3]], false), { x: 0, y: h * 0.14, s: Math.min(w, h) / 120 }));
  } else {
    out.push(stroke(line([[0, h / 2 - 10], [0, -h * 0.1]]), C.leaf, 1.6), sh(leaf(0, h * 0.2, w * 0.25, w * 0.06, -30) + leaf(0, h * 0.1, w * 0.25, w * 0.06, -150), C.leaf));
    out.push(...place(rose(Math.min(w, h) * 0.18, '#e98a9a', seed), { y: -h * 0.12 }));
  }
  out.push(stroke(rect(-w / 2 + 6, -h / 2 + 6, w - 12, h - 12), shade(frame, -0.3), 1.2));
  return out;
}

/** Window curtain panel hanging from (0,0) down to h, gathered; width w. */
export function curtain(w: number, h: number, col: string, seed: number, tieY = 0.55, side: 1 | -1 = 1): Shape[] {
  const g = rng(seed);
  const dk = shade(col, -0.15), lt = shade(col, 0.15);
  const ty = h * tieY;
  const pinch = w * 0.32 * side;
  const outer = side === 1 ? 0 : w;
  const shape = blob([[0, 0], [w, 0], [outer === 0 ? w * 0.55 : w * 0.95, ty], [w * (side === 1 ? 0.95 : 0.6), h], [w * (side === 1 ? 0.0 : 0.05), h], [outer === 0 ? 0 : w * 0.45, ty]], 0.4);
  const out: Shape[] = [sh(shape, col)];
  let folds = '';
  for (let i = 1; i < 5; i++) {
    const fx = (w * i) / 5;
    const mid = side === 1 ? fx * 0.55 : w - (w - fx) * 0.55;
    folds += curve([[fx, 4], [mid + g.range(-3, 3), ty], [fx * (side === 1 ? 0.95 : 1) + (side === 1 ? 0 : 0), h - 4]]);
  }
  out.push(stroke(folds, dk, 3, { opacity: 0.6 }), stroke(xf(folds, { x: 5 }), lt, 2, { opacity: 0.5 }));
  out.push(sh(rect((side === 1 ? w * 0.3 : w * 0.45), ty - 8, w * 0.3, 14, 6), shade(col, -0.3)));
  void pinch;
  return out;
}

/** Bird feeder tube with seeds; origin at the hanging hook, about 120 tall. */
export function tubeFeeder(col = '#6f9f8f'): Shape[] {
  const g = rng(7);
  let seeds = '';
  for (let i = 0; i < 28; i++) seeds += ellipse(g.range(-9, 9), g.range(26, 96), 2.2, 1.4, g.range(0, 180));
  return [
    stroke(line([[0, 0], [0, 12]]), '#3f4347', 1.6),
    sh(blob([[-16, 22], [0, 10], [16, 22]], 0.5), col), sh(rect(-17, 20, 34, 5, 2), shade(col, -0.2)),
    sh(rect(-12, 24, 24, 76, 3), '#dfeef5', { opacity: 0.75 }), sh(seeds, '#8a6a4a'),
    sh(rect(-12, 24, 6, 76), '#ffffff', { opacity: 0.35 }),
    sh(circle(-12, 52, 3.5) + circle(12, 80, 3.5), col),
    stroke(line([[-22, 56], [-12, 56]]) + line([[12, 84], [22, 84]]), '#3f4347', 2),
    sh(rect(-15, 98, 30, 8, 3), col), sh(ellipse(0, 108, 20, 4), shade(col, -0.25)),
  ];
}

/** Wooden bird table on a post; origin at the ground, about 240 tall. */
export function birdTable(w = 120, h = 240, wood = '#a37548'): Shape[] {
  const dk = shade(wood, -0.25), lt = shade(wood, 0.2);
  const g = rng(41);
  let seeds = '';
  for (let i = 0; i < 26; i++) seeds += ellipse(g.range(-w * 0.4, w * 0.4), -h * 0.6 - g.range(2, 6), 2.4, 1.5, g.range(0, 180));
  return [
    sh(rect(-6, -h * 0.6, 12, h * 0.6), dk), sh(rect(-6, -h * 0.6, 4, h * 0.6), lt),
    sh(poly([[-20, 0], [0, -30], [20, 0]]), dk, { opacity: 0.5 }),
    sh(rect(-w / 2, -h * 0.6, w, 10, 2), wood), sh(rect(-w / 2, -h * 0.6 + 7, w, 3), dk),
    sh(seeds, '#8a6a4a'),
    sh(rect(-w / 2 + 6, -h * 0.95, 6, h * 0.35) + rect(w / 2 - 12, -h * 0.95, 6, h * 0.35), dk),
    sh(poly([[-w / 2 - 14, -h * 0.92], [0, -h], [w / 2 + 14, -h * 0.92], [w / 2 + 14, -h * 0.88], [0, -h * 0.96], [-w / 2 - 14, -h * 0.88]]), wood),
    sh(poly([[0, -h], [w / 2 + 14, -h * 0.92], [w / 2 + 14, -h * 0.88], [0, -h * 0.96]]), dk),
  ];
}

/** Stone bird bath; origin at the ground, about 130 tall. */
export function birdBath(col = '#cdbfa6'): Shape[] {
  return [
    sh(ellipse(0, -4, 34, 7), shade(col, -0.2)),
    sh(poly([[-26, -4], [-12, -16], [-10, -80], [10, -80], [12, -16], [26, -4]]), col),
    sh(poly([[2, -80], [10, -80], [12, -16], [26, -4], [10, -6]]), shade(col, -0.12)),
    sh(blob([[-62, -100], [62, -100], [44, -82], [-44, -82]], 0.6), col),
    sh(ellipse(0, -100, 62, 10), shade(col, 0.12)), sh(ellipse(0, -100, 54, 7), '#9cc8dc'),
    sh(ellipse(-16, -101, 14, 2.2), '#ffffff', { opacity: 0.6 }),
  ];
}

/** Bare winter branch with twigs, from (0,0) towards dir (deg). */
export function branch(len: number, rotDeg: number, seed: number, col = '#5c4633', w = 7): Shape[] {
  const g = rng(seed);
  const main: Pt[] = [];
  for (let i = 0; i <= 5; i++) main.push([(len * i) / 5, g.range(-6, 6) * (i ? 1 : 0)]);
  const out: Shape[] = [stroke(curve(main), col, w), stroke(curve(main), shade(col, 0.2), w * 0.3, { opacity: 0.6 })];
  let tw = '';
  for (let i = 1; i < 5; i++) {
    const [x, y] = main[i];
    const s = i % 2 ? -1 : 1;
    const l = len * g.range(0.15, 0.3) * (1 - i * 0.1);
    tw += curve([[x, y], [x + l * 0.5, y + s * l * 0.4], [x + l, y + s * l * 0.6]]);
  }
  out.push(stroke(tw, col, w * 0.45));
  return out.map((p) => ({ ...p, d: xf(p.d, { rot: rotDeg }) }));
}
