import { rect, ellipse, circle, poly, line, curve, blob, leaf, sector, xf, stroke } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { PaintActivity, PaintRegion, PaletteColor } from '../types';
import { M, L, Q, type Pt } from './props';

const W = 1000, H = 1250;

const palette: PaletteColor[] = [
  { id: 'sky', number: 1, name: 'Summer sky', hex: '#a8d4ea' },
  { id: 'cream', number: 2, name: 'Warm cream', hex: '#f8e9c4' },
  { id: 'peach', number: 3, name: 'Sunlit plaster', hex: '#f1c193' },
  { id: 'lavender', number: 4, name: 'Distant headland', hex: '#a3a9cf' },
  { id: 'sea', number: 5, name: 'Deep sea blue', hex: '#3d8bb8' },
  { id: 'aqua', number: 6, name: 'Shallow aqua', hex: '#7fc6c8' },
  { id: 'cobalt', number: 7, name: 'Cobalt glaze', hex: '#2a5aa0' },
  { id: 'lemon', number: 8, name: 'Lemon yellow', hex: '#f7d23e' },
  { id: 'ochre', number: 9, name: 'Lemon shadow', hex: '#dba32a' },
  { id: 'pale', number: 10, name: 'Lemon flesh', hex: '#fcef9f' },
  { id: 'leafd', number: 11, name: 'Citrus leaf', hex: '#3c6b3a' },
  { id: 'leafl', number: 12, name: 'Fresh green', hex: '#86ad55' },
  { id: 'terra', number: 13, name: 'Terracotta', hex: '#c8643c' },
  { id: 'magenta', number: 14, name: 'Bougainvillea', hex: '#c0277c' },
  { id: 'linen', number: 15, name: 'Sun-bleached linen', hex: '#ecdcb8' },
  { id: 'taupe', number: 16, name: 'Soft shadow', hex: '#c0a27a' },
  { id: 'coffee', number: 17, name: 'Espresso', hex: '#6a4a30' },
  { id: 'white', number: 18, name: 'Porcelain white', hex: '#fffdf7' },
];

const regions: PaintRegion[] = [];
const R = (id: string, d: string, color: string) => { regions.push({ id, d, color }); };
const detail: Shape[] = [];
const INK = '#5d5346';

// ---------- helpers ----------
/** A turned vessel (jug, bowl, cup) seen slightly from above: profile of half-widths by height. */
function vessel(cx: number, prof: [number, number][], ratio: number) {
  const hw = (y: number) => {
    const n = prof.length;
    if (y <= prof[0][0]) return prof[0][1];
    if (y >= prof[n - 1][0]) return prof[n - 1][1];
    let i = 0;
    while (y > prof[i + 1][0]) i++;
    const [y0, v0] = prof[i], [y1, v1] = prof[i + 1];
    const m = (k: number) => { const a = prof[Math.max(0, k - 1)], b = prof[Math.min(n - 1, k + 1)]; return (b[1] - a[1]) / (b[0] - a[0]); };
    const h = y1 - y0, t = (y - y0) / h, t2 = t * t, t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * v0 + (t3 - 2 * t2 + t) * h * m(i) + (-2 * t3 + 3 * t2) * v1 + (t3 - t2) * h * m(i + 1);
  };
  const arc = (y: number, dir: 1 | -1, inset = 0): Pt[] => {
    const pts: Pt[] = [], w = hw(y) - inset;
    for (let i = 0; i <= 16; i++) { const a = (Math.PI * i) / 16; pts.push([cx - dir * Math.cos(a) * w, y + Math.sin(a) * w * ratio]); }
    return pts;
  };
  const side = (ya: number, yb: number, sgn: 1 | -1, inset = 0): Pt[] => {
    const pts: Pt[] = [], k = Math.max(2, Math.ceil(Math.abs(yb - ya) / 6));
    for (let i = 0; i <= k; i++) { const y = ya + ((yb - ya) * i) / k; pts.push([cx + sgn * (hw(y) - inset), y]); }
    return pts;
  };
  const yTop = prof[0][0], yBot = prof[prof.length - 1][0];
  return {
    hw,
    /** Front wall: front rim arc, right side, base arc, left side. */
    body: () => poly([...arc(yTop, 1), ...side(yTop, yBot, 1).slice(1), ...arc(yBot, -1).slice(1), ...side(yBot, yTop, -1).slice(1, -1)]),
    /** A painted band between two heights (measured at the silhouette). */
    band: (y1: number, y2: number) => poly([...arc(y1, 1, 0.6), ...side(y1, y2, 1, 0.6).slice(1), ...arc(y2, -1, 0.6).slice(1), ...side(y2, y1, -1, 0.6).slice(1, -1)]),
    opening: () => ellipse(cx, yTop, hw(yTop), hw(yTop) * ratio),
  };
}
const lemonD = (rx: number, ry: number) =>
  M(-rx * 1.2, 0) + `C${-rx * 1.12} ${-ry * 0.46} ${-rx * 0.7} ${-ry} 0 ${-ry}C${rx * 0.7} ${-ry} ${rx * 1.12} ${-ry * 0.46} ${rx * 1.2} 0C${rx * 1.12} ${ry * 0.46} ${rx * 0.7} ${ry} 0 ${ry}C${-rx * 0.7} ${ry} ${-rx * 1.12} ${ry * 0.46} ${-rx * 1.2} 0Z`;
const lemonBody = (cx: number, cy: number, rx: number, ry: number, rot: number) => xf(lemonD(rx, ry), { rot, x: cx, y: cy });
/** Shaded crescent along the lower edge of a lemon (in the lemon's own frame). */
const lemonShade = (cx: number, cy: number, rx: number, ry: number, rot: number) =>
  xf(M(-rx * 0.96, ry * 0.22) + `C${-rx * 0.4} ${ry * 0.6} ${rx * 0.4} ${ry * 0.6} ${rx * 0.98} ${ry * 0.18}C${rx * 0.8} ${ry * 0.74} ${rx * 0.4} ${ry * 0.93} 0 ${ry * 0.93}C${-rx * 0.4} ${ry * 0.93} ${-rx * 0.8} ${ry * 0.74} ${-rx * 0.96} ${ry * 0.22}Z`, { rot, x: cx, y: cy });
const lemonLight = (cx: number, cy: number, rx: number, ry: number, rot: number) => xf(ellipse(-rx * 0.28, -ry * 0.46, rx * 0.42, ry * 0.22, -8), { rot, x: cx, y: cy });
const halfLeaf = (x: number, y: number, len: number, wid: number, rot: number) => xf(M(0, 0) + Q(len * 0.45, -wid, len, 0) + 'Z', { rot, x, y });
function leafPair(id: string, x: number, y: number, len: number, wid: number, rot: number, flip = false) {
  R(`${id}-dark`, leaf(x, y, len, wid, rot), 'leafd');
  R(`${id}-light`, flip ? xf(M(0, 0) + Q(len * 0.45, wid, len, 0) + 'Z', { rot, x, y }) : halfLeaf(x, y, len, wid, rot), 'leafl');
}
const bract = (cx: number, cy: number, r: number, rot: number) => {
  const pts: Pt[] = [];
  for (let i = 0; i < 6; i++) { const a = ((rot + i * 60) * Math.PI) / 180, rr = i % 2 ? r * 0.62 : r; pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); }
  return blob(pts, 1);
};

// ---------- background: sky, headland, sea ----------
R('sky', rect(0, 0, W, 380), 'sky');
R('cloud-bank', curve([[0, 346], [44, 326], [92, 338], [142, 316], [204, 334], [254, 320], [312, 340], [372, 326], [432, 344], [500, 336], [566, 354], [640, 372]]) + L(640, 380) + L(0, 380) + 'Z', 'white');
R('cloud-1', blob([[430, 110], [470, 78], [530, 86], [570, 62], [640, 74], [690, 100], [740, 112], [700, 132], [560, 136], [460, 132]], 0.9), 'white');
R('cloud-2', blob([[790, 150], [820, 128], [870, 132], [910, 118], [960, 140], [940, 164], [840, 168]], 0.9), 'white');
R('headland-far', poly([[540, 374], [620, 356], [700, 334], [770, 306], [850, 288], [930, 296], [W, 286], [W, 374]]), 'lavender');
R('headland-near', poly([[660, 374], [740, 352], [800, 344], [W, 338], [W, 374]]), 'leafl');
R('sea-far', rect(0, 372, W, 70), 'sea');
R('sea-near', M(0, 434) + Q(250, 424, 500, 434) + Q(750, 444, W, 432) + L(W, 540) + L(0, 540) + 'Z', 'aqua');
regions.push({ id: 'sea-glint-1', d: ellipse(390, 476, 100, 11), color: 'white', label: [390, 476] });
regions.push({ id: 'sea-glint-2', d: ellipse(110, 502, 84, 10), color: 'white', label: [110, 502] });
R('boat-hull', poly([[168, 408], [264, 408], [250, 427], [182, 427]]), 'terra');
R('boat-mainsail', poly([[216, 402], [216, 312], [266, 402]]), 'white');
R('boat-jib', poly([[208, 402], [208, 334], [170, 402]]), 'cream');

// ---------- terrace parapet and potted geranium ----------
R('parapet-face', rect(0, 560, W, 140), 'peach');
regions.push({ id: 'parapet-cap', d: rect(0, 528, W, 36), color: 'cream', label: [640, 546] });
for (const [i, x] of [[1, 62], [2, 590]] as [number, number][]) {
  R(`parapet-tile-${i}`, poly([[x, 584], [x + 44, 628], [x, 672], [x - 44, 628]]), 'cobalt');
  R(`parapet-tile-${i}-centre`, poly([[x, 606], [x + 22, 628], [x, 650], [x - 22, 628]]), 'lemon');
}
R('pot-foliage', blob([[840, 440], [816, 396], [836, 346], [880, 318], [930, 310], [968, 330], [984, 380], [980, 430], [940, 452], [890, 454]], 0.9), 'leafd');
R('pot-foliage-light', blob([[846, 392], [856, 354], [890, 334], [920, 344], [896, 372], [874, 402]], 0.9), 'leafl');
R('pot-body', poly([[860, 458], [960, 458], [944, 530], [876, 530]]), 'terra');
R('pot-rim', rect(850, 440, 120, 24, 5), 'peach');
R('geranium-1', circle(866, 340, 24), 'magenta');
R('geranium-2', circle(940, 350, 23), 'white');
R('geranium-3', circle(920, 412, 22), 'magenta');

// ---------- bougainvillea, top-left ----------
R('vine-foliage', curve([[362, 4], [372, 40], [330, 84], [262, 84], [228, 138], [160, 150], [128, 214], [78, 232], [56, 300], [24, 340], [8, 336]], 0.8) + L(0, 336) + L(0, 0) + L(362, 0) + 'Z', 'leafd');
R('vine-leaf-1', leaf(322, 78, 84, 22, 28), 'leafl');
R('vine-leaf-2', leaf(214, 140, 78, 21, 42), 'leafl');
R('vine-leaf-3', leaf(112, 220, 80, 21, 62), 'leafl');
R('vine-leaf-4', leaf(30, 326, 72, 19, 78), 'leafl');
R('vine-bloom-1', bract(70, 60, 44, 10), 'magenta');
R('vine-bloom-2', bract(190, 52, 40, 70), 'magenta');
R('vine-bloom-3', bract(318, 34, 30, 30), 'white');
R('vine-bloom-4', bract(128, 138, 34, 40), 'white');
R('vine-bloom-5', bract(52, 190, 38, 85), 'magenta');
R('vine-bloom-6', bract(250, 44, 26, 15), 'magenta');

// ---------- table: linen top, cobalt edge, majolica tiles ----------
R('table-top', rect(0, 692, W, 380), 'linen');
regions.push({ id: 'table-edge', d: rect(0, 1066, W, 24), color: 'cobalt', label: [30, 1078] });
{
  const n = 5, tw = W / n, y0 = 1088, th = H - y0, cy = y0 + th / 2;
  for (let i = 0; i < n; i++) {
    const x0 = i * tw, cx = x0 + tw / 2, a = i % 2 === 0;
    R(`tile-${i + 1}-base`, rect(x0, y0, tw, th), a ? 'white' : 'aqua');
    R(`tile-${i + 1}-diamond`, poly([[cx, y0 + 10], [x0 + tw - 10, cy], [cx, H - 10], [x0 + 10, cy]]), a ? 'cobalt' : 'white');
    R(`tile-${i + 1}-centre`, a ? circle(cx, cy, 30) : bract(cx, cy, 38, 30), a ? 'lemon' : 'cobalt');
  }
}

// ---------- cast shadows on the linen ----------
R('shadow-bowl', ellipse(410, 962, 196, 27), 'taupe');
R('shadow-jug', ellipse(826, 936, 124, 22), 'taupe');
R('shadow-cup', ellipse(180, 1032, 126, 27), 'taupe');
R('shadow-half', ellipse(690, 1046, 160, 18), 'taupe');
R('shadow-lemon', ellipse(900, 1046, 72, 16), 'taupe');

// ---------- striped jug ----------
{
  const jug = vessel(760, [[585, 70], [612, 62], [660, 58], [716, 80], [786, 108], [846, 116], [896, 106], [930, 84], [946, 64]], 0.22);
  R('jug-handle', M(806, 664) + 'C886 640 936 716 908 790' + 'C894 828 876 846 858 854' + L(852, 822) + 'C866 816 876 802 882 784' + 'C900 732 866 688 812 696Z', 'cobalt');
  R('jug-opening', jug.opening(), 'coffee');
  R('jug-body', jug.body(), 'white');
  R('jug-stripe-1', jug.band(634, 652), 'lemon');
  R('jug-stripe-2', jug.band(694, 724), 'cobalt');
  R('jug-stripe-3', jug.band(760, 796), 'cobalt');
  R('jug-stripe-4', jug.band(834, 864), 'cobalt');
  R('jug-stripe-5', jug.band(894, 912), 'lemon');
  R('jug-spout', M(700, 582) + Q(676, 574, 650, 560) + Q(654, 596, 706, 612) + 'Z', 'white');
  detail.push(stroke(curve([[716, 600], [716, 640]]) + curve([[706, 742], [700, 800], [708, 850]]), '#ffffff', 5, { opacity: 0.55 }));
}

// ---------- bowl of lemons ----------
{
  const bowl = vessel(330, [[775, 205], [800, 201], [845, 184], [890, 150], [930, 108], [958, 70]], 0.24);
  R('bowl-foot', poly([[258, 946], [402, 946], [394, 976], [370, 990], [330, 994], [290, 990], [266, 976]]), 'cobalt');
  R('bowl-inside', bowl.opening(), 'cobalt');
  leafPair('bowl-leaf-a', 180, 742, 132, 36, -152, true);
  leafPair('bowl-leaf-b', 392, 650, 124, 34, -58);
  leafPair('bowl-leaf-c', 496, 726, 130, 36, -22);
  const lemons: [string, number, number, number, number, number, 'shade' | 'light'][] = [
    ['lemon-top', 348, 668, 70, 50, 8, 'light'],
    ['lemon-back', 262, 694, 62, 46, 32, 'light'],
    ['lemon-left', 222, 746, 72, 52, 162, 'shade'],
    ['lemon-right', 452, 748, 72, 52, 24, 'shade'],
    ['lemon-front', 336, 764, 78, 56, -4, 'shade'],
  ];
  for (const [id, cx, cy, rx, ry, rot, kind] of lemons) {
    R(id, lemonBody(cx, cy, rx, ry, rot), 'lemon');
    if (kind === 'shade') R(`${id}-shade`, lemonShade(cx, cy, rx, ry, rot), 'ochre');
    else R(`${id}-light`, lemonLight(cx, cy, rx, ry, rot), 'pale');
  }
  R('bowl-body', bowl.body(), 'white');
  R('bowl-band', bowl.band(826, 858), 'cobalt');
  R('bowl-band-2', bowl.band(880, 904), 'lemon');
  detail.push(stroke(curve([[160, 800], [176, 850], [210, 896]]), '#ffffff', 5, { opacity: 0.6 }));
}

// ---------- espresso cup and saucer ----------
{
  R('saucer', ellipse(150, 1024, 124, 30), 'white');
  R('cup-handle', M(96, 946) + 'C34 938 34 1006 106 1000' + L(108, 982) + 'C66 986 66 954 98 964Z', 'terra');
  const cup = vessel(150, [[930, 64], [962, 62], [994, 50], [1012, 34]], 0.24);
  R('cup-coffee', cup.opening(), 'coffee');
  R('cup-body', cup.body(), 'terra');
  R('cup-band', cup.band(956, 974), 'white');
}

// ---------- cut lemon half ----------
{
  const cx = 566, cy = 990, sy = 0.9;
  R('half-rind', ellipse(584, 1004, 78, 68), 'ochre');
  R('half-face', ellipse(cx, cy, 73, 73 * sy), 'lemon');
  R('half-pith', ellipse(cx, cy, 58, 58 * sy), 'white');
  for (let i = 0; i < 6; i++) R(`half-segment-${i + 1}`, xf(sector(cx, cy, 48, i * 60 + 6, i * 60 + 54, 12), { sy, ox: cx, oy: cy }), 'pale');
}
// lemon wedge
R('wedge-rind', M(648, 1046) + 'C660 968 784 968 796 1046Z', 'lemon');
R('wedge-flesh', M(668, 1046) + 'C678 994 766 994 776 1046Z', 'pale');

// ---------- whole lemon with a leaf ----------
leafPair('table-leaf', 936, 996, 92, 26, -62);
R('table-lemon', lemonBody(884, 1014, 60, 44, -12), 'lemon');
R('table-lemon-shade', lemonShade(884, 1014, 60, 44, -12), 'ochre');

// ---------- line work ----------
detail.push(stroke(line([[212, 404], [212, 306]]), INK, 1.6));
detail.push(stroke(curve([[30, 462], [60, 458], [90, 462]]) + curve([[250, 456], [286, 452], [320, 456]]) + curve([[520, 462], [560, 458], [600, 462]]) + curve([[300, 516], [340, 512], [380, 516]]) + curve([[760, 476], [790, 472], [820, 476]]) + curve([[40, 396], [70, 393], [100, 396]]) + curve([[340, 400], [380, 397], [420, 400]]), '#ffffff', 2, { opacity: 0.8 }));
detail.push(stroke(M(330, 150) + Q(338, 142, 346, 150) + Q(354, 142, 362, 150) + M(380, 176) + Q(386, 170, 392, 176) + Q(398, 170, 404, 176), INK, 1.6));
// leaf midribs
const rib = (x: number, y: number, len: number, rot: number) => xf(line([[4, 0], [len * 0.92, 0]]), { rot, x, y });
detail.push(stroke(rib(180, 742, 132, -152) + rib(392, 650, 124, -58) + rib(496, 726, 130, -22) + rib(936, 996, 92, -62), '#e3efc0', 1.6));
// cut lemon membranes
{
  let d = '';
  for (let i = 0; i < 6; i++) { const a = ((i * 60 + 30) * Math.PI) / 180; d += line([[566 + Math.cos(a) * 20, 990 + Math.sin(a) * 18], [566 + Math.cos(a) * 42, 990 + Math.sin(a) * 37.8]]); }
  detail.push(stroke(d, '#f3d86a', 1.4, { opacity: 0.9 }));
  detail.push(stroke(curve([[686, 1038], [722, 1012], [758, 1038]]), '#f3d86a', 1.4));
}
// lemon dimples
detail.push(stroke(circle(300, 752, 1) + circle(318, 770, 1) + circle(352, 748, 1) + circle(372, 772, 1) + circle(868, 1004, 1) + circle(892, 1018, 1) + circle(910, 1002, 1) + circle(340, 660, 1) + circle(366, 676, 1), '#c9951f', 1.4));
// pot ribs
detail.push(stroke(line([[886, 478], [958, 478]]), '#a34d2b', 1.6));

const activity: PaintActivity = {
  id: 'coastal-paint', version: 1, mode: 'paint', title: 'Lemons on the Terrace',
  blurb: 'A bowl of lemons, a striped jug and a morning espresso on a tiled terrace table, with the sea and a passing sail beyond.',
  collectionId: 'coastal', categories: ['Still life', 'Seaside'], difficulty: 'Moderate',
  width: W, height: H, palette, regions, detail,
};
export default activity;
