import { blob, circle, curve, ellipse, leaf, line, linearGradient, mix, petal, place, poly, radialGradient, rect, rng, sh, shade, stroke } from '../../art/kit';
import type { Pt } from '../../art/geometry';
import type { Shape } from '../../art/types';
import type { FindActivity, FindItem } from '../types';
import {
  W as P, acorn, basket, bee, brownMushrooms, butterfly, dragonfly, feather, fern, flowers, foliage, foxCub, frog, grass, hedgehog,
  ladybird, owl, pinecone, rabbit, snail, squirrel, stone, teacup, toadstool,
} from './props-find';

const WD = 1200, HT = 1500;
const ID = 'woodland-find-2';
const items: FindItem[] = [];
const scene = (...s: Shape[]) => { items.push({ shapes: s }); };
const target = (id: string, name: string, s: Shape[]) => { items.push({ id, name, target: true, shapes: s }); };
const GREENS = ['#4e6b38', '#5f8a45', '#6f8f4e', '#7fa35a', '#8db35e'];

// ------------------------------------------------------------------ helpers
function trunk(x: number, base: number, top: number, w: number, seed: number): Shape[] {
  const g = rng(seed);
  const out: Shape[] = [];
  const body = blob([[x - w / 2 - 34, base], [x - w / 2 - 6, base - 30], [x - w / 2, base - 120], [x - w * 0.42, top], [x + w * 0.42, top], [x + w / 2, base - 120], [x + w / 2 + 6, base - 30], [x + w / 2 + 40, base], [x, base + 8]], 0.6);
  out.push(sh(body, '#5e4630'));
  out.push(sh(blob([[x + w * 0.05, base - 20], [x + w * 0.12, top], [x + w * 0.42, top], [x + w / 2, base - 120], [x + w / 2 + 6, base - 30], [x + w / 2 + 40, base]], 0.6), '#4a3524'));
  let bk = '', bk2 = '';
  for (let i = 0; i < 26; i++) {
    const bx = x + g.range(-w * 0.42, w * 0.42), by = g.range(top + 20, base - 40), len = g.range(40, 110);
    const d = curve([[bx, by], [bx + g.range(-5, 5), by + len / 2], [bx + g.range(-4, 4), by + len]]);
    if (i % 2) bk += d; else bk2 += d;
  }
  out.push(stroke(bk, '#3a2a1c', 2.2), stroke(bk2, '#7d5f40', 1.6));
  // roots
  out.push(sh(blob([[x - w / 2 - 70, base + 10], [x - w / 2 - 20, base - 16], [x - w / 4, base], [x - w / 2 - 20, base + 8]], 0.8) + blob([[x + w / 2 + 80, base + 12], [x + w / 2 + 20, base - 18], [x + w / 4, base], [x + w / 2 + 20, base + 8]], 0.8), '#5e4630'));
  // moss
  let ms = '';
  for (let i = 0; i < 10; i++) ms += ellipse(x - w * 0.3 + g.range(0, w * 0.3), base - g.range(10, 200), g.range(6, 12), g.range(3, 6));
  out.push(sh(ms, '#5f7a3e', { opacity: 0.7 }));
  return out;
}

function quadPt(q: Pt[], u: number, v: number): Pt {
  const top: Pt = [q[0][0] + (q[1][0] - q[0][0]) * u, q[0][1] + (q[1][1] - q[0][1]) * u];
  const bot: Pt = [q[3][0] + (q[2][0] - q[3][0]) * u, q[3][1] + (q[2][1] - q[3][1]) * u];
  return [top[0] + (bot[0] - top[0]) * v, top[1] + (bot[1] - top[1]) * v];
}

// ------------------------------------------------------------------ sky and distance
scene(sh(rect(0, 0, WD, 640), `url(#${ID}-sky)`));
scene(sh(circle(820, 150, 160), `url(#${ID}-sun)`, { opacity: 0.25 }), sh(circle(820, 150, 46), '#fff3c8'));
{
  const cl = (x: number, y: number, s: number) => blob([[x - 70 * s, y], [x - 50 * s, y - 24 * s], [x - 14 * s, y - 34 * s], [x + 20 * s, y - 30 * s], [x + 54 * s, y - 20 * s], [x + 74 * s, y], [x, y + 8 * s]], 1);
  scene(sh(cl(560, 120, 1.1) + cl(1050, 250, 0.9), '#ffffff', { opacity: 0.85 }), sh(cl(600, 128, 0.7) + cl(1080, 256, 0.6), '#eaf3f6'));
}
// far hills
scene(sh(blob([[-20, 470], [200, 380], [420, 420], [640, 360], [880, 400], [1220, 360], [1220, 640], [-20, 640]], 0.8), '#a9c4a0'));
{
  // distant tree line
  const g = rng(7);
  for (let i = 0; i < 14; i++) {
    const x = 180 + i * 64 + g.range(-14, 14), y = 470 + g.range(-20, 20);
    scene(...place(foliage(60 + i, 80, 110, ['#7f9f72', '#6f8f62', '#90ad80'], 16), { x, y, s: 0.9 }));
  }
}
// the cottage far off
{
  const cx = 760, cy = 532;
  scene(sh(rect(cx - 46, cy - 40, 92, 44), '#efe4cc'), sh(rect(cx + 14, cy - 40, 32, 44), '#d9cdb4'));
  scene(sh(blob([[cx - 60, cy - 36], [cx - 30, cy - 82], [cx + 30, cy - 82], [cx + 62, cy - 36], [cx, cy - 30]], 0.6), '#c9a25a'), stroke(curve([[cx - 52, cy - 44], [cx, cy - 40], [cx + 52, cy - 44]]) + curve([[cx - 40, cy - 60], [cx, cy - 56], [cx + 40, cy - 60]]), '#a5803e', 1.6));
  scene(sh(rect(cx + 20, cy - 96, 12, 24), '#9a8a7a'), sh(blob([[cx + 26, cy - 100], [cx + 20, cy - 130], [cx + 36, cy - 150], [cx + 30, cy - 180], [cx + 44, cy - 150], [cx + 32, cy - 128]], 1), '#ffffff', { opacity: 0.55 }));
  scene(sh(rect(cx - 30, cy - 26, 16, 14) + rect(cx + 18, cy - 26, 16, 14), '#f2b84a'), sh(rect(cx - 6, cy - 22, 14, 26, 2), '#7a5333'));
  scene(...place(foliage(71, 60, 50, GREENS, 10), { x: cx - 70, y: cy + 4, s: 0.8 }), ...place(foliage(72, 60, 50, GREENS, 10), { x: cx + 74, y: cy + 4, s: 0.7 }));
}

// ------------------------------------------------------------------ meadow
scene(sh(rect(0, 540, WD, 960), `url(#${ID}-meadow)`));
{
  const g = rng(17);
  let a = '', b = '';
  for (let i = 0; i < 60; i++) {
    const y = g.range(560, 1490), x = g.range(0, WD), s = 0.5 + (y - 560) / 900;
    const d = ellipse(x, y, 40 * s, 8 * s);
    if (i % 2) a += d; else b += d;
  }
  scene(sh(a, '#8db35e', { opacity: 0.5 }), sh(b, '#5f8a45', { opacity: 0.35 }));
}
// mid-distance bushes along the forest edge
{
  const spots: [number, number, number][] = [[300, 600, 0.9], [420, 590, 0.8], [600, 600, 0.9], [900, 610, 1], [980, 596, 0.8], [200, 610, 1]];
  spots.forEach(([x, y, s], i) => scene(...place(foliage(80 + i, 120, 70, GREENS, 18), { x, y, s })));
}
target('rabbit', 'Rabbit', place(rabbit(), { x: 860, y: 640, s: 0.65 }));
scene(...place(grass(1.2, '#5f8a45', 101), { x: 846, y: 642 }), ...place(grass(1.1, '#6f8f4e', 102), { x: 880, y: 646 }));

// ------------------------------------------------------------------ the stream
{
  const L: Pt[] = [[520, 576], [470, 620], [380, 680], [250, 750], [120, 800], [0, 830]];
  const R: Pt[] = [[540, 578], [508, 630], [440, 712], [330, 800], [180, 880], [0, 960]];
  const bed = blob([...L, [-10, 900], ...[...R].reverse()], 0.3);
  scene(sh(blob([...L.map(([x, y]) => [x - 10, y - 4] as Pt), [-20, 900], ...[...R].reverse().map(([x, y]) => [x + 12, y + 10] as Pt)], 0.3), '#8a7a5a'));
  scene(sh(bed, `url(#${ID}-water)`));
  const g = rng(23);
  let rip = '', glint = '';
  for (let i = 0; i < 30; i++) {
    const t = g.range(0.05, 0.95), u = g.range(0.2, 0.8);
    const k = Math.min(L.length - 2, Math.floor(t * (L.length - 1))), f = t * (L.length - 1) - k;
    const lx = L[k][0] + (L[k + 1][0] - L[k][0]) * f, ly = L[k][1] + (L[k + 1][1] - L[k][1]) * f;
    const rx = R[k][0] + (R[k + 1][0] - R[k][0]) * f, ry = R[k][1] + (R[k + 1][1] - R[k][1]) * f;
    const x = lx + (rx - lx) * u, y = ly + (ry - ly) * u, s = 0.4 + t;
    rip += curve([[x - 16 * s, y], [x, y - 3 * s], [x + 16 * s, y]]);
    if (i % 3 === 0) glint += ellipse(x + 6, y + 4, 6 * s, 1.6 * s);
  }
  scene(stroke(rip, '#e6f3f6', 1.6, { opacity: 0.8 }), sh(glint, '#ffffff', { opacity: 0.7 }));
  // bank stones
  const st: [number, number, number][] = [[470, 610, 10], [508, 640, 9], [400, 690, 13], [450, 724, 12], [300, 750, 15], [350, 806, 16], [190, 790, 16], [230, 872, 18], [90, 818, 18], [110, 930, 20], [40, 840, 16]];
  st.forEach(([x, y, r], i) => scene(...place(stone(r * 1.4, r, ['#a39d90', '#8f887a', '#b6ae9e'][i % 3], 200 + i), { x, y })));
  // stepping stones across
  [[300, 780], [262, 810], [220, 840]].forEach(([x, y], i) => scene(...place(stone(20, 10, '#b6ae9e', 220 + i), { x, y })));
  // lily pads and reeds
  scene(sh(ellipse(420, 700, 16, 6) + ellipse(160, 870, 22, 8) + ellipse(196, 856, 14, 5), '#5f8a45'), sh(circle(160, 866, 5), '#f6dfe6'));
  let reeds = '';
  for (let i = 0; i < 14; i++) { const x = 560 + i * 6 + g.range(-3, 3), h = g.range(30, 60); reeds += line([[x, 610], [x + g.range(-6, 6), 610 - h]]); }
  scene(stroke(reeds, '#6f8f4e', 2), sh(rect(568, 560, 5, 18, 2.5) + rect(590, 566, 5, 16, 2.5), '#7a5333'));
}
target('frog', 'Frog', place(frog(), { x: 350, y: 800, s: 0.75 }));
target('dragonfly', 'Dragonfly', place(dragonfly(), { x: 470, y: 660, s: 0.75, rot: -15 }));

// ------------------------------------------------------------------ big trees
// left tree (in front of the stream)
scene(...trunk(80, 1040, -10, 130, 31));
target('fox', 'Fox cub', place(foxCub(), { x: 196, y: 1030, s: 0.72 }));
scene(...place(fern(150, -120, '#5f8a45', 41), { x: 170, y: 1040 }), ...place(fern(130, -70, '#6f8f4e', 42), { x: 200, y: 1044 }), ...place(fern(120, -150, '#4e6b38', 43), { x: 150, y: 1046 }));
// right tree with the owl's hollow
scene(...trunk(1100, 1080, -10, 150, 37));
scene(sh(ellipse(1088, 690, 34, 50), '#2a1c14'), stroke(ellipse(1088, 690, 36, 52), '#7d5f40', 6));
target('owl', 'Owl', place(owl(), { x: 1088, y: 734, s: 0.68 }));
scene(sh(blob([[1050, 736], [1088, 726], [1126, 736], [1120, 748], [1056, 748]], 0.8), '#5e4630'));
scene(...place(squirrel(), { x: 1150, y: 610, s: 0.8, rot: -90 }));
// bracket fungi on the right trunk
scene(sh(blob([[1028, 900], [1010, 890], [1004, 876], [1030, 880]], 0.9) + blob([[1032, 930], [1008, 924], [1000, 910], [1030, 912]], 0.9), '#d9b46a'), sh(blob([[1028, 896], [1012, 888], [1018, 884], [1030, 886]], 0.9), '#f0d48a'));

// canopies
{
  const L: [number, number, number, number][] = [[60, 120, 380, 260], [220, 40, 360, 220], [-40, 300, 260, 220], [330, 170, 240, 160], [120, 360, 240, 150]];
  L.forEach(([x, y, w, h], i) => scene(...place(foliage(300 + i, w, h, GREENS, 46), { x, y })));
  const R: [number, number, number, number][] = [[1080, 110, 360, 260], [900, 40, 320, 200], [1180, 330, 240, 220], [960, 210, 230, 150], [1080, 420, 220, 140]];
  R.forEach(([x, y, w, h], i) => scene(...place(foliage(320 + i, w, h, GREENS, 46), { x, y })));
  // dangling branch tips with lighter leaves
  const g = rng(51);
  let lt = '';
  for (let i = 0; i < 40; i++) { const x = g.pick([g.range(0, 420), g.range(820, 1200)]), y = g.range(30, 480); lt += leaf(x, y, g.range(12, 20), 5, g.range(0, 360)); }
  scene(sh(lt, '#a9c96e', { opacity: 0.9 }));
}

// ------------------------------------------------------------------ the picnic blanket
const Q: Pt[] = [[330, 920], [930, 910], [1010, 1210], [250, 1230]];
scene(sh(poly([[Q[0][0] + 10, Q[0][1] + 16], [Q[1][0] + 14, Q[1][1] + 16], [Q[2][0] + 20, Q[2][1] + 22], [Q[3][0] + 4, Q[3][1] + 22]]), '#2a3a20', { opacity: 0.25 }));
scene(sh(poly(Q), '#f6efdc'));
{
  const n = 12;
  let a = '', b = '';
  for (let i = 0; i < n; i += 2) {
    const u0 = i / n, u1 = (i + 1) / n;
    a += poly([quadPt(Q, u0, 0), quadPt(Q, u1, 0), quadPt(Q, u1, 1), quadPt(Q, u0, 1)]);
    b += poly([quadPt(Q, 0, u0), quadPt(Q, 1, u0), quadPt(Q, 1, u1), quadPt(Q, 0, u1)]);
  }
  scene(sh(a, '#c8423a', { opacity: 0.5 }), sh(b, '#c8423a', { opacity: 0.5 }));
  let fr = '';
  for (let i = 0; i <= 40; i++) { const p = quadPt(Q, i / 40, 1); fr += line([p, [p[0] - 1, p[1] + 10]]); const q = quadPt(Q, 1, i / 40); fr += line([q, [q[0] + 9, q[1] + 1]]); }
  scene(stroke(fr, '#e9dcc0', 2));
  scene(stroke(curve([quadPt(Q, 0.1, 0.55), quadPt(Q, 0.4, 0.5), quadPt(Q, 0.8, 0.58)]), '#a5352e', 1.4, { opacity: 0.4 }));
}
// basket, open lid
{
  const bx = 470, by = 1020;
  scene(sh(blob([[bx - 80, by - 66], [bx - 60, by - 128], [bx + 60, by - 128], [bx + 80, by - 66]], 0.4), '#a5754a'), sh(blob([[bx - 70, by - 72], [bx - 54, by - 118], [bx + 54, by - 118], [bx + 70, by - 72]], 0.4), '#c49a5c'));
  {
    let wv = '';
    for (let k = 0; k < 7; k++) wv += line([[bx - 66 + k * 4, by - 76 - k * 6], [bx + 66 - k * 4, by - 76 - k * 6]]);
    scene(stroke(wv, '#8a6038', 1.4));
  }
  scene(sh(rect(bx - 56, by - 92, 112, 30, 4), '#f6efdc'), stroke(line([[bx - 50, by - 80], [bx + 50, by - 82]]), '#c8423a', 3));
  scene(...place(basket(170, 80, '#c49a5c'), { x: bx, y: by }));
  scene(sh(blob([[bx - 40, by - 82], [bx - 30, by - 100], [bx + 10, by - 104], [bx + 20, by - 84]], 0.9), '#e0a868'), sh(circle(bx + 42, by - 92, 15), '#c8423a'), sh(circle(bx + 37, by - 97, 5), '#ef7a68', { opacity: 0.8 }), sh(rect(bx - 66, by - 130, 14, 50, 3), '#5f8a6a'), sh(rect(bx - 64, by - 138, 10, 10, 2), '#c29a3c'));
  scene(stroke(curve([[bx - 84, by - 84], [bx, by - 150], [bx + 84, by - 84]]), '#8a6038', 7), stroke(curve([[bx - 84, by - 84], [bx, by - 150], [bx + 84, by - 84]]), '#c49a5c', 2));
}
// plates, teapot, food
{
  const plate = (x: number, y: number, rx: number) => [sh(ellipse(x, y, rx, rx * 0.36), '#d9cdb4'), sh(ellipse(x, y - 1, rx * 0.9, rx * 0.3), '#fbf6ea'), stroke(ellipse(x, y - 1, rx * 0.72, rx * 0.24), '#6f8fb0', 1.4)];
  scene(...plate(640, 1000, 50));
  scene(sh(poly([[612, 994], [650, 980], [670, 996], [632, 1008]]), '#f3dca0'), sh(poly([[612, 990], [650, 976], [670, 992], [632, 1004]]), '#f8eccc'), sh(poly([[616, 989], [650, 978], [665, 989]]), '#8db35e'));
  scene(...plate(780, 1090, 56));
  {
    const g = rng(61);
    let berries = '', tops = '', seeds = '';
    for (let i = 0; i < 7; i++) {
      const x = 754 + (i % 4) * 14 - 20 + g.range(-3, 3), y = 1080 + Math.floor(i / 4) * 10 + g.range(-2, 2);
      berries += blob([[x - 7, y - 4], [x + 7, y - 4], [x + 5, y + 5], [x, y + 11], [x - 5, y + 5]], 1);
      tops += leaf(x, y - 4, 7, 2.5, -150) + leaf(x, y - 4, 7, 2.5, -30) + leaf(x, y - 4, 6, 2.5, -90);
      seeds += circle(x - 2, y, 0.8) + circle(x + 2, y + 2, 0.8) + circle(x, y + 6, 0.8);
    }
    scene(sh(berries, '#d6362e'), sh(seeds, '#f3c94f'), sh(tops, '#5f8a45'));
  }
  // teapot
  const tp = '#e7dcc4';
  scene(sh(ellipse(870, 1000, 40, 34), tp), sh(ellipse(884, 994, 18, 26), shade(tp, -0.1), { opacity: 0.7 }), stroke(curve([[906, 986], [926, 984], [924, 1010], [904, 1014]]), tp, 6), sh(poly([[834, 996], [808, 970], [804, 976], [830, 1012]]), tp), sh(ellipse(870, 970, 22, 6), shade(tp, -0.15)), sh(circle(870, 962, 6), '#6f8fb0'), stroke(curve([[836, 1004], [870, 1012], [906, 1004]]), '#6f8fb0', 3));
  scene(...place(teacup('#6f8fb0'), { x: 940, y: 1060, s: 0.9 }), ...place(teacup('#c8423a'), { x: 380, y: 1110, s: 0.9 }));
  // loaf, cheese, jam
  scene(sh(blob([[560, 1150], [556, 1120], [590, 1104], [640, 1106], [662, 1126], [656, 1150]], 0.9), '#c88a4a'), stroke(line([[584, 1110], [590, 1130]]) + line([[606, 1106], [612, 1128]]) + line([[628, 1108], [634, 1130]]), '#9a5a2a', 2));
  scene(sh(poly([[690, 1170], [760, 1150], [760, 1186], [690, 1196]]), '#f3c94f'), sh(poly([[690, 1170], [760, 1150], [740, 1140], [676, 1158]]), '#f8df8a'), sh(circle(716, 1178, 4) + circle(740, 1170, 3), '#e0a83a'));
  scene(sh(rect(450, 1130, 40, 48, 8), '#a9283a'), sh(rect(446, 1120, 48, 14, 4), '#f6efdc'), sh(circle(458, 1126, 2) + circle(474, 1124, 2) + circle(486, 1128, 2), '#c8423a'), sh(rect(456, 1150, 28, 14, 2), '#f6efdc'));
  // a book face down and a straw hat
  scene(sh(poly([[330, 1180], [400, 1168], [410, 1204], [338, 1216]]), '#3f5f7a'), sh(poly([[400, 1168], [406, 1166], [416, 1202], [410, 1204]]), '#f3ead2'));
  scene(sh(ellipse(960, 1160, 60, 22), '#d9bd7c'), sh(ellipse(960, 1152, 36, 18), '#e3c988'), sh(blob([[924, 1156], [960, 1162], [996, 1156], [996, 1148], [924, 1148]], 0.8), '#5f8a6a'), stroke(curve([[912, 1170], [960, 1180], [1008, 1170]]), '#c4a45e', 1.2));
}
target('feather', 'Feather', place(feather('#9aa7b0', '#3d4650'), { x: 560, y: 1196, s: 0.8, rot: -12 }));

// ------------------------------------------------------------------ grass across the meadow
{
  const g = rng(91);
  for (let i = 0; i < 150; i++) {
    const y = g.range(640, 1480), x = g.range(0, WD);
    if (y > 900 && y < 1240 && x > 240 && x < 1020) continue;
    const s = 0.5 + (y - 600) / 700;
    scene(...place(grass(s, g.pick(['#5f8a45', '#6f8f4e', '#7fa35a']), 500 + i), { x, y }));
  }
}
scene(...place(flowers(111, 14, 160, ['#f3ead2', '#f2c84b', '#c9a0d9']), { x: 690, y: 820 }), ...place(flowers(112, 10, 120, ['#f3ead2', '#e8833a']), { x: 260, y: 1060 }), ...place(flowers(113, 12, 140, ['#c9a0d9', '#f3ead2', '#f6b8c8']), { x: 1080, y: 1250 }));
scene(...place(flowers(114, 16, 200, ['#f3ead2', '#f2c84b']), { x: 620, y: 720 }), ...place(flowers(115, 8, 90, ['#f6b8c8', '#f3ead2']), { x: 980, y: 800 }));
target('butterfly', 'Butterfly', place(butterfly('#e8833a'), { x: 712, y: 770, s: 0.62, rot: 20 }));
target('bee', 'Bumblebee', place(bee(), { x: 1100, y: 1208, s: 1 }));
{
  const g = rng(97);
  let clover = '', pebble = '', daisy = '';
  for (let i = 0; i < 40; i++) {
    const x = g.range(0, WD), y = g.range(1240, 1490);
    if (x > 620 && x < 1200 && y > 1300 && y < 1410) continue;
    for (let k = 0; k < 3; k++) clover += circle(x + Math.cos(k * 2.1) * 5, y + Math.sin(k * 2.1) * 4, 4.2);
  }
  for (let i = 0; i < 24; i++) pebble += ellipse(g.range(0, WD), g.range(1250, 1490), g.range(4, 9), g.range(2.5, 5));
  for (let i = 0; i < 30; i++) { const x = g.range(0, WD), y = g.range(1000, 1490); if (x > 240 && x < 1020 && y < 1240) continue; for (let k = 0; k < 6; k++) daisy += petal(x, y, 5, 1.8, k * 60); }
  scene(sh(clover, '#4e7a38', { opacity: 0.9 }), sh(pebble, '#b6ae9e'), sh(daisy, '#fbf6ea'));
}
scene(...place(flowers(116, 12, 160, ['#f2c84b', '#f3ead2', '#c9a0d9']), { x: 160, y: 1180 }), ...place(flowers(117, 10, 120, ['#f6b8c8', '#f3ead2']), { x: 560, y: 1290 }), ...place(flowers(118, 10, 140, ['#f3ead2', '#e8833a']), { x: 360, y: 1300 }));
// squirrel by the blanket nibbling
scene(...place(squirrel('#b85a2a'), { x: 1040, y: 980, s: 0.72 }));

// ------------------------------------------------------------------ foreground: log, ferns, fungi
{
  // fallen log
  const lx0 = 640, lx1 = 1190, ly = 1360;
  scene(sh(blob([[lx0, ly - 40], [lx1, ly - 60], [lx1 + 20, ly - 10], [lx1, ly + 36], [lx0, ly + 44], [lx0 - 10, ly]], 0.5), '#6b4a2f'));
  scene(sh(blob([[lx0, ly - 40], [lx1, ly - 60], [lx1, ly - 40], [lx0 + 20, ly - 20]], 0.6), '#8f6a45'));
  const g = rng(121);
  let bk = '';
  for (let i = 0; i < 18; i++) { const x = g.range(lx0 + 30, lx1 - 40); bk += line([[x, ly - 30 - (x - lx0) * 0.03], [x + g.range(30, 70), ly - 30 - (x - lx0) * 0.03 + g.range(10, 40)]]); }
  scene(stroke(bk, '#3e2a1a', 1.6, { opacity: 0.8 }));
  scene(sh(ellipse(lx0, ly + 2, 26, 42), '#5a3d24'), sh(ellipse(lx0, ly + 2, 21, 36), '#d8b07a'), stroke(ellipse(lx0, ly + 2, 14, 24) + ellipse(lx0, ly + 2, 7, 12), '#b08454', 1.4));
  let moss = '';
  for (let i = 0; i < 12; i++) moss += ellipse(g.range(lx0 + 40, lx1 - 20), ly - 46 + g.range(-6, 10), g.range(12, 30), g.range(5, 9));
  scene(sh(moss, '#7fa35a'));
  scene(...place(brownMushrooms(131), { x: 880, y: ly - 42 }), ...place(brownMushrooms(132, '#c99a5e'), { x: 1100, y: ly - 54, s: 0.8 }));
  scene(...place(squirrel('#c0642e'), { x: 760, y: ly - 46, s: 0.7 }));
}
target('snail', 'Snail', place(snail('#c49a5c'), { x: 1010, y: 1318, s: 0.62 }));
target('acorn', 'Acorn', place(acorn(), { x: 590, y: 1420, s: 0.8, rot: -60 }));
// ferns and plants in the front
scene(...place(fern(220, -110, '#5f8a45', 141), { x: 60, y: 1500 }), ...place(fern(200, -60, '#6f8f4e', 142), { x: 100, y: 1500 }), ...place(fern(180, -140, '#4e6b38', 143), { x: 40, y: 1500 }));
target('hedgehog', 'Hedgehog', place(hedgehog(), { x: 290, y: 1440, s: 0.85 }));
scene(...place(fern(170, -80, '#8db35e', 144), { x: 380, y: 1500 }), ...place(fern(150, -110, '#6f8f4e', 145), { x: 420, y: 1500 }), ...place(fern(150, -45, '#5f8a45', 146), { x: 230, y: 1500 }));
target('ladybird', 'Ladybird', place(ladybird(), { x: 120, y: 1360, s: 0.75, rot: -30 }));
scene(...place(brownMushrooms(151), { x: 520, y: 1460 }), ...place(brownMushrooms(152, '#a5754a'), { x: 180, y: 1260, s: 0.8 }));
target('toadstool', 'Red toadstool', place(toadstool(), { x: 1012, y: 1096, s: 0.66 }));
scene(...place(fern(190, -100, '#5f8a45', 161), { x: 1140, y: 1500 }), ...place(fern(170, -150, '#4e6b38', 162), { x: 1180, y: 1500 }));
{
  const g = rng(171);
  for (let i = 0; i < 14; i++) scene(...place(grass(1.4, g.pick(['#5f8a45', '#4e6b38', '#7fa35a']), 700 + i), { x: g.range(440, 1100), y: g.range(1440, 1500) }));
  let lv = '';
  for (let i = 0; i < 18; i++) lv += leaf(g.range(300, 1100), g.range(1250, 1490), g.range(14, 22), 6, g.range(0, 360));
  scene(sh(lv, '#c49a5c', { opacity: 0.9 }));
}

target('pinecone', 'Pine cone', place(pinecone(), { x: 1060, y: 1462, s: 0.72, rot: 70 }));

// ------------------------------------------------------------------ sunlight
scene(sh(poly([[760, 0], [880, 0], [620, 1500], [420, 1500]]) + poly([[960, 0], [1020, 0], [900, 1500], [780, 1500]]), '#fff6d2', { opacity: 0.1 }));
scene(sh(rect(0, 0, WD, HT), `url(#${ID}-vignette)`, { opacity: 0.2 }));

void mix; void petal;
const activity: FindActivity = {
  id: ID, version: 1, mode: 'find',
  title: 'Picnic in the Clearing',
  blurb: 'A checked blanket in a sunny forest clearing beside a babbling stream, where the woodland folk come to look.',
  collectionId: 'woodland',
  categories: ['Woodland', 'Animals', 'Food'],
  difficulty: 'Moderate',
  width: WD, height: HT,
  defs:
    linearGradient(`${ID}-sky`, [[0, '#8fc3de'], [0.6, '#cfe6ee'], [1, '#eef3e0']]) +
    radialGradient(`${ID}-sun`, [[0, '#fff3c8'], [1, '#fff3c8']]) +
    linearGradient(`${ID}-meadow`, [[0, '#9ab874'], [0.4, '#7fa35a'], [1, '#5f8a45']]) +
    linearGradient(`${ID}-water`, [[0, '#9fcbd8'], [0.5, '#6fa8bd'], [1, '#4f8aa3']], 0, 0, 1, 1) +
    `<radialGradient id="${ID}-vignette" cx="0.5" cy="0.5" r="0.75"><stop offset="0.65" stop-color="#1f2a18" stop-opacity="0"/><stop offset="1" stop-color="#1f2a18" stop-opacity="1"/></radialGradient>`,
  items,
};
export default activity;
