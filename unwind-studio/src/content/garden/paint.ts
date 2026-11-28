import { blob, circle, curve, ellipse, line, poly, rect, stroke, xf, type Xf } from '../../art/kit';
import type { Pt } from '../../art/geometry';
import type { Shape } from '../../art/types';
import type { PaintActivity, PaintRegion } from '../types';
import { blossomPath, polar } from './props';

const W = 1000, H = 1250;
const regions: PaintRegion[] = [];
const detail: Shape[] = [];
const R = (id: string, d: string, color: string, label?: Pt) => { regions.push(label ? { id, d, color, label } : { id, d, color }); };
const clampPt = ([x, y]: Pt): Pt => [Math.max(0, Math.min(W, x)), Math.max(0, Math.min(H, y))];

/** Dense samples of a smooth open curve through pts. */
function sample(pts: Pt[], per = 10): Pt[] {
  const out: Pt[] = [];
  const at = (i: number) => pts[Math.max(0, Math.min(pts.length - 1, i))];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    for (let k = 0; k < per; k++) {
      const t = k / per, t2 = t * t, t3 = t2 * t;
      out.push([
        0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
        0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3),
      ]);
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
}

/** A ribbon of varying width following a smooth curve (for stems and branches). off shifts it sideways. */
function band(pts: Pt[], w0: number, w1: number, off0 = 0, off1 = 0): string {
  const s = sample(pts);
  const left: Pt[] = [], right: Pt[] = [];
  s.forEach((p, i) => {
    const a = s[Math.max(0, i - 1)], b = s[Math.min(s.length - 1, i + 1)];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const nx = -(b[1] - a[1]) / len, ny = (b[0] - a[0]) / len;
    const t = i / (s.length - 1);
    const w = (w0 + (w1 - w0) * t) / 2, o = off0 + (off1 - off0) * t;
    left.push(clampPt([p[0] + nx * (o + w), p[1] + ny * (o + w)]));
    right.push(clampPt([p[0] + nx * (o - w), p[1] + ny * (o - w)]));
  });
  return poly([...left, ...right.reverse()]);
}
/** Point on a band's centre line at parameter t (0..1), for a manual number position. */
function bandAt(pts: Pt[], t: number, off = 0): Pt {
  const s = sample(pts);
  const i = Math.max(1, Math.min(s.length - 2, Math.round(t * (s.length - 1))));
  const a = s[i - 1], b = s[i + 1];
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
  return [Math.round(s[i][0] - ((b[1] - a[1]) / len) * off), Math.round(s[i][1] + ((b[0] - a[0]) / len) * off)];
}
/** Smooth edge through pts, closed with straight lines through the given corner points (keeps blobs inside the canvas). */
function edged(pts: Pt[], corners: Pt[]): string {
  return poly([...sample(pts, 8).map(clampPt), ...corners]);
}

// ---------------------------------------------------------------- background
const stemA: Pt[] = [[300, 1250], [276, 1130], [240, 1010], [232, 930]];
const stemB: Pt[] = [[690, 1250], [716, 1140], [770, 1010], [792, 900]];
const branch: Pt[] = [[0, 792], [130, 760], [300, 722], [500, 690], [700, 652], [860, 612], [1000, 566]];
R('bg-sky', rect(0, 0, W, H), 'sky');
R('bg-sky-low', poly([...sample(branch, 8).map(clampPt), [1000, 1250], [0, 1250]]), 'sky');
R('bg-sun', circle(742, 262, 236), 'cream');
R('bg-canopy', edged([[372, 0], [336, 66], [232, 104], [150, 176], [60, 196], [0, 270]], [[0, 0]]), 'sage');
R('bg-hedge', edged([[1000, 470], [930, 520], [880, 610], [905, 720], [960, 780], [1000, 800]], []), 'sage');
R('bg-hill', edged([[0, 930], [140, 872], [330, 842], [520, 890], [700, 930], [860, 850], [1000, 800]], [[1000, 1250], [0, 1250]]), 'cream');
{
  // the meadow is split along the two big stems so that every visible piece carries its own number
  const top = sample([[0, 1040], [150, 1000], [330, 1020], [520, 1090], [700, 1070], [860, 1010], [1000, 990]], 8).map(clampPt);
  const topY = (x: number) => {
    for (let i = 0; i < top.length - 1; i++) if (x >= top[i][0] && x <= top[i + 1][0]) return top[i][1] + ((top[i + 1][1] - top[i][1]) * (x - top[i][0])) / (top[i + 1][0] - top[i][0] || 1);
    return top[top.length - 1][1];
  };
  const below = (st: Pt[]) => sample(st, 8).filter(([x, y]) => y > topY(x) + 2).sort((p, q) => p[1] - q[1]);
  const sa = below(stemA), sb = below(stemB);
  R('bg-meadow-left', poly([...top.filter(([x]) => x < sa[0][0]), ...sa, [0, 1250]]), 'sage');
  R('bg-meadow-mid', poly([...top.filter(([x]) => x > sa[0][0] && x < sb[0][0]), ...sb, ...[...sa].reverse()]), 'sage');
  R('bg-meadow-right', poly([...top.filter(([x]) => x > sb[0][0]), [1000, 1250], ...[...sb].reverse()]), 'sage');
}

// ---------------------------------------------------------------- stems
const stemC: Pt[] = [[0, 560], [60, 500], [130, 410], [200, 320]];
const stemBud1: Pt[] = [[1000, 690], [950, 590], [915, 480], [896, 410]];
const stemBud2: Pt[] = [[300, 316], [400, 262], [500, 186], [578, 140]];
R('stem-a', band(stemA, 20, 16), 'leafDark', bandAt(stemA, 0.12));
R('stem-b', band(stemB, 20, 16), 'leafDark', bandAt(stemB, 0.12));
R('stem-c', band(stemC, 18, 14), 'leafDark', bandAt(stemC, 0.2));
R('stem-bud1', band(stemBud1, 16, 12), 'leafDark', bandAt(stemBud1, 0.72));
R('stem-bud2', band(stemBud2, 14, 11), 'leafDark', bandAt(stemBud2, 0.72));

// ---------------------------------------------------------------- leaves (two halves each)
function leafPair(id: string, x: number, y: number, len: number, wid: number, rot: number, flip = false, veinFrom = 0, single = veinFrom > 0.5) {
  const t: Xf = { rot, x, y };
  const up = `M0 0Q${len * 0.42} ${-wid} ${len} 0Q${len * 0.5} ${-wid * 0.06} 0 0Z`;
  const dn = `M0 0Q${len * 0.42} ${wid} ${len} 0Q${len * 0.5} ${wid * 0.06} 0 0Z`;
  if (single) R(id, xf(`M0 0Q${len * 0.42} ${-wid} ${len} 0Q${len * 0.42} ${wid} 0 0Z`, t), flip ? 'leaf' : 'leafLight');
  else {
    R(`${id}-a`, xf(up, t), flip ? 'leaf' : 'leafLight');
    R(`${id}-b`, xf(dn, t), flip ? 'leafLight' : 'leaf');
  }
  detail.push(stroke(xf(curve([[Math.max(4, len * veinFrom), 0], [len * (0.5 + veinFrom / 2), wid * 0.02], [len - 3, 0]]), t), '#2f5233', 1.6, { opacity: 0.7 }));
  let v = '';
  for (let i = 1; i <= 3; i++) {
    const bx = (len * i) / 4.4;
    if (bx < len * veinFrom) continue;
    const k = 1 - Math.abs(i - 1.8) / 4;
    v += line([[bx, 0], [bx + len * 0.14, -wid * 0.36 * k]]) + line([[bx, 0], [bx + len * 0.14, wid * 0.36 * k]]);
  }
  if (v) detail.push(stroke(xf(v, t), '#2f5233', 1, { opacity: 0.45 }));
}
// behind the blooms
leafPair('leaf-a1', 232, 932, 240, 62, -152, false, 0.8);
leafPair('leaf-a2', 232, 936, 244, 60, 22, true, 0.8);
leafPair('leaf-b1', 792, 902, 226, 58, -28, true, 0.78);
leafPair('leaf-b2', 792, 906, 222, 60, 197, false, 0.78);
leafPair('leaf-c1', 206, 300, 186, 46, -160, true, 0.7);
leafPair('leaf-c2', 206, 300, 196, 44, -42, false, 0.68);
// on the stems
leafPair('leaf-s1', 282, 1146, 176, 48, -22);
leafPair('leaf-s2', 712, 1150, 168, 46, -160, true);
leafPair('leaf-s3', 944, 574, 128, 38, -152, true, 0, true);
leafPair('leaf-s4', 440, 236, 120, 36, -96, true);
leafPair('leaf-s5', 70, 492, 130, 38, -18, false, 0, true);

// ---------------------------------------------------------------- branch
R('branch-main', band(branch, 50, 34), 'bark', bandAt(branch, 0.12, -8));
R('branch-shade', band(branch, 20, 14, 15, 10), 'wrenDark', bandAt(branch, 0.88, 11));
R('branch-knot', ellipse(318, 712, 20, 11, -12), 'wrenDark');
// a short leafy twig rising from the branch
R('twig', band([[660, 662], [690, 610], [700, 560]], 14, 9), 'bark', bandAt([[660, 662], [690, 610], [700, 560]], 0.3));
leafPair('leaf-t1', 700, 566, 116, 34, -52);
leafPair('leaf-t2', 694, 600, 96, 30, -148, true, 0, true);
const twig2: Pt[] = [[214, 742], [196, 680], [206, 610]];
R('twig2', band(twig2, 14, 9), 'bark', bandAt(twig2, 0.3));
leafPair('leaf-t3', 204, 616, 124, 36, -124, true, 0, true);
leafPair('leaf-t4', 198, 664, 118, 34, -30, false, 0, true);
leafPair('leaf-t5', 206, 612, 110, 32, -66, false, 0, true);
detail.push(stroke(curve([[40, 772], [160, 746], [280, 720]]) + curve([[380, 700], [520, 678], [640, 654]]) + curve([[730, 636], [850, 606], [960, 572]]), '#4a3524', 1.4, { opacity: 0.6 }));
detail.push(stroke(ellipse(318, 712, 11, 5, -12), '#3a2a1c', 1.2, { opacity: 0.7 }));

// ---------------------------------------------------------------- peonies
function petalPath(L: number, w: number): string {
  return blob([[0, 0], [0.3 * L, -0.72 * w], [0.62 * L, -w], [0.9 * L, -0.74 * w], [1.0 * L, -0.3 * w], [0.94 * L, 0], [1.0 * L, 0.3 * w], [0.9 * L, 0.74 * w], [0.62 * L, w], [0.3 * L, 0.72 * w]], 1);
}
function peonyRegions(id: string, cx: number, cy: number, rad: number, rings: { n: number; r: number; cols: string[]; off: number }[]) {
  rings.forEach((ring, k) => {
    const L = rad * ring.r;
    const w = L * Math.tan(Math.PI / ring.n) * 0.62 * 1.28;
    for (let i = 0; i < ring.n; i++) {
      const a = ring.off + (i * 360) / ring.n;
      const Li = L * (i % 2 ? 0.94 : 1.03);
      R(`${id}-p${k + 1}-${i + 1}`, xf(petalPath(Li, w), { rot: a, x: cx, y: cy }), ring.cols[i % ring.cols.length]);
      detail.push(stroke(xf(curve([[Li * 0.5, 0], [Li * 0.78, w * 0.06], [Li * 0.92, 0]]), { rot: a, x: cx, y: cy }), '#a8456a', 1.1, { opacity: 0.45 }));
    }
  });
  R(`${id}-heart`, blossomPath(cx, cy, rad * 0.19, 7, 0.68, 12), 'gold');
  let st = '';
  for (let i = 0; i < 7; i++) st += line([polar(cx, cy, rad * 0.04, i * 51), polar(cx, cy, rad * 0.12, i * 51)]);
  detail.push(stroke(st, '#a5701f', 1.4, { opacity: 0.8 }));
}

// half-open bloom, upper left
peonyRegions('peony-c', 206, 300, 122, [
  { n: 6, r: 1, cols: ['peony', 'peonyLight'], off: 14 },
  { n: 4, r: 0.62, cols: ['blush', 'peonyLight'], off: 48 },
]);

// buds
function bud(id: string, cx: number, cy: number, r: number, rot: number) {
  const t: Xf = { rot, x: cx, y: cy };
  R(`${id}-ball`, xf(circle(0, 0, r), t), 'peony');
  R(`${id}-fold`, xf(blob([[-r * 0.1, -r * 0.92], [r * 0.5, -r * 0.5], [r * 0.56, r * 0.2], [r * 0.1, r * 0.72], [-r * 0.08, 0]], 1), t), 'peonyLight');
  R(`${id}-sepal1`, xf(blob([[-r * 0.2, r * 1.12], [-r * 1.02, r * 0.5], [-r * 0.98, -r * 0.3], [-r * 0.6, r * 0.34], [0, r * 0.82]], 0.9), t), 'leaf');
  R(`${id}-sepal2`, xf(blob([[r * 0.2, r * 1.12], [r * 1.02, r * 0.5], [r * 0.98, -r * 0.3], [r * 0.6, r * 0.34], [0, r * 0.82]], 0.9), t), 'leafLight');
}
bud('bud1', 892, 392, 46, -14);
bud('bud2', 590, 132, 40, 58);

// ---------------------------------------------------------------- the wren
{
  const t: Xf = { x: 470, y: 674, s: 1.5 };
  const P = (id: string, d: string, c: string) => R(`wren-${id}`, xf(d, t), c);
  const D = (d: string, c: string, w: number, o = 1) => detail.push(stroke(xf(d, t), c, w, { opacity: o }));
  // legs and toes (decorative line work)
  D(line([[-8, -26], [-12, 0]]) + line([[22, -26], [24, 0]]), '#4a3524', 3.2);
  D(line([[-12, 0], [-26, 3]]) + line([[-12, 0], [0, 5]]) + line([[24, 0], [10, 4]]) + line([[24, 0], [38, 4]]), '#4a3524', 2.4);
  P('tail-a', blob([[-66, -86], [-100, -150], [-104, -196], [-84, -200], [-66, -150], [-44, -100]], 0.8), 'wrenDark');
  P('tail-b', blob([[-52, -96], [-74, -158], [-70, -206], [-50, -204], [-44, -156], [-28, -104]], 0.8), 'wren');
  P('body', blob([[-76, -76], [-62, -118], [-14, -140], [44, -130], [80, -92], [64, -42], [12, -22], [-44, -32]], 1), 'wren');
  P('belly', blob([[-34, -30], [-6, -58], [36, -78], [82, -96], [80, -64], [54, -36], [10, -20]], 1), 'buff');
  P('head', circle(60, -136, 45), 'wren');
  P('throat', blob([[40, -112], [68, -124], [100, -118], [92, -94], [58, -88]], 1), 'buff');
  P('brow', blob([[30, -158], [58, -174], [94, -164], [100, -152], [64, -160], [34, -146]], 0.9), 'cream');
  P('wing', blob([[26, -108], [-8, -128], [-58, -112], [-90, -62], [-44, -58], [10, -70]], 1), 'wrenDark');
  P('wing-bar', blob([[-62, -98], [-24, -112], [12, -100], [10, -88], [-24, -98], [-60, -84]], 0.9), 'buff');
  P('beak', blob([[100, -148], [124, -142], [146, -132], [122, -132], [100, -130]], 0.5), 'ink');
  P('eye', circle(80, -142, 7.5), 'ink');
  // barring on the wing and tail, breast flecks, eye glint
  D(curve([[-70, -74], [-36, -84], [0, -80]]) + curve([[-76, -64], [-44, -72], [-12, -70]]), '#3a2a1c', 1.6, 0.7);
  D(line([[-98, -166], [-80, -160]]) + line([[-100, -182], [-82, -176]]) + line([[-72, -168], [-52, -164]]) + line([[-72, -186], [-52, -182]]) + line([[-92, -148], [-74, -142]]), '#3a2a1c', 1.6, 0.6);
  D(curve([[14, -40], [32, -50], [54, -54]]) + curve([[28, -30], [44, -38], [62, -40]]), '#b8996a', 1.4, 0.7);
  D(line([[82, -145], [84, -147]]), '#ffffff', 2.4);
}

// ---------------------------------------------------------------- big foreground blooms
peonyRegions('peony-a', 232, 934, 178, [
  { n: 8, r: 1, cols: ['peonyDark', 'peony'], off: 8 },
  { n: 6, r: 0.74, cols: ['peony', 'peonyLight'], off: 34 },
  { n: 4, r: 0.48, cols: ['blush', 'peonyLight'], off: 10 },
]);
peonyRegions('peony-b', 792, 904, 158, [
  { n: 6, r: 1, cols: ['peony', 'peonyDark'], off: 22 },
  { n: 4, r: 0.74, cols: ['peonyLight', 'blush'], off: 60 },
  { n: 4, r: 0.48, cols: ['peony', 'peonyLight'], off: 18 },
]);

// ---------------------------------------------------------------- butterfly
{
  const t: Xf = { x: 800, y: 236, s: 2.9, rot: 24 };
  const P = (id: string, d: string, c: string) => R(`fly-${id}`, xf(d, t), c);
  const wingU = blob([[3, -4], [14, -24], [32, -27], [35, -10], [18, 1]], 1);
  const wingL = blob([[3, 2], [19, 2], [28, 13], [19, 25], [8, 17]], 1);
  P('wing-lower-r', wingL, 'lilac');
  P('wing-lower-l', xf(wingL, { sx: -1 }), 'lilac');
  P('wing-upper-r', wingU, 'lavender');
  P('wing-upper-l', xf(wingU, { sx: -1 }), 'lavender');
  P('spot-r', circle(23, -15, 5.4), 'cream');
  P('spot-l', circle(-23, -15, 5.4), 'cream');
  P('body', ellipse(0, 0, 3.6, 14), 'ink');
  detail.push(stroke(xf(curve([[-1, -14], [-5, -23], [-10, -27]]) + curve([[1, -14], [5, -23], [10, -27]]), t), '#3a3030', 1.8));
  detail.push(stroke(xf(curve([[5, -5], [16, -13], [29, -21]]) + curve([[-5, -5], [-16, -13], [-29, -21]]) + curve([[6, 5], [14, 10], [20, 19]]) + curve([[-6, 5], [-14, 10], [-20, 19]]), t), '#5d4a9c', 1.1, { opacity: 0.6 }));
}

const activity: PaintActivity = {
  id: 'garden-paint', version: 2, mode: 'paint',
  title: 'Wren among the Peonies',
  blurb: 'A little wren pauses on a mossy branch among full-blown peonies, with a lilac butterfly for company.',
  collectionId: 'garden',
  categories: ['Birds', 'Flowers', 'Garden'],
  difficulty: 'Moderate',
  width: W, height: H,
  palette: [
    { id: 'sky', number: 1, name: 'Soft sky', hex: '#cfe7ef' },
    { id: 'cream', number: 2, name: 'Cream', hex: '#fbf1d6' },
    { id: 'sage', number: 3, name: 'Sage', hex: '#b9cba6' },
    { id: 'leafLight', number: 4, name: 'Spring green', hex: '#93c172' },
    { id: 'leaf', number: 5, name: 'Leaf green', hex: '#5f9652' },
    { id: 'leafDark', number: 6, name: 'Deep green', hex: '#3f7044' },
    { id: 'peonyDark', number: 7, name: 'Deep peony', hex: '#cb5a84' },
    { id: 'peony', number: 8, name: 'Peony pink', hex: '#e987a8' },
    { id: 'peonyLight', number: 9, name: 'Petal pink', hex: '#f6bccd' },
    { id: 'blush', number: 10, name: 'Blush', hex: '#fde3e7' },
    { id: 'gold', number: 11, name: 'Pollen gold', hex: '#efc24a' },
    { id: 'wren', number: 12, name: 'Wren brown', hex: '#a06d3e' },
    { id: 'wrenDark', number: 13, name: 'Chestnut', hex: '#724827' },
    { id: 'buff', number: 14, name: 'Buff', hex: '#ead0a2' },
    { id: 'bark', number: 15, name: 'Warm bark', hex: '#8a6846' },
    { id: 'lavender', number: 16, name: 'Lavender', hex: '#a591d6' },
    { id: 'lilac', number: 17, name: 'Lilac', hex: '#cdbdea' },
    { id: 'ink', number: 18, name: 'Charcoal', hex: '#3a3030' },
  ],
  regions,
  detail,
};
export default activity;
