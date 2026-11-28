import { rect, ellipse, circle, poly, line, curve, blob, leaf, sh, stroke, place, mix, shade, rng, linearGradient } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { PuzzleActivity } from '../types';
import { M, Q, WALLS, SHUTTERS, ROOFS, house, boat, reflect, bougainvillea, treeClump, cypress, palm, cloud, gull, lemon, citrusLeaf, awning, type Pt } from './props';

const ID = 'coastal-puzzle';
const W = 1200, H = 1200, HORIZON = 640;
const shapes: Shape[] = [];
const add = (...s: (Shape | Shape[])[]) => { for (const x of s) if (Array.isArray(x)) shapes.push(...x); else shapes.push(x); };
const HAZE = '#f3c79c';

const defs =
  linearGradient(`${ID}-sky`, [[0, '#5f86b5'], [0.3, '#93aecb'], [0.55, '#e9c3a6'], [0.8, '#f8cf8c'], [1, '#ffdf9a']]) +
  linearGradient(`${ID}-sea`, [[0, '#f6cf8e'], [0.1, '#d9bf98'], [0.32, '#7fb3b4'], [0.65, '#3f8ea2'], [1, '#235f7c']]) +
  `<radialGradient id="${ID}-glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#fff3c0" stop-opacity="0.95"/><stop offset="0.25" stop-color="#ffd98a" stop-opacity="0.6"/><stop offset="1" stop-color="#ffc56e" stop-opacity="0"/></radialGradient>` +
  `<linearGradient id="${ID}-path" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffe9a8" stop-opacity="0"/><stop offset="0.5" stop-color="#ffe9a8" stop-opacity="0.5"/><stop offset="1" stop-color="#ffe9a8" stop-opacity="0"/></linearGradient>` +
  `<linearGradient id="${ID}-warm" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffb85c" stop-opacity="0.22"/><stop offset="0.6" stop-color="#ffb85c" stop-opacity="0.04"/><stop offset="1" stop-color="#6a5aa0" stop-opacity="0.1"/></linearGradient>`;

// ---------- sky ----------
const SUN: Pt = [172, 548];
add(sh(rect(0, 0, W, HORIZON + 10), `url(#${ID}-sky)`));
{
  const r = rng(11);
  // high cirrus streaks
  let a = '', b = '', c = '';
  for (let i = 0; i < 26; i++) {
    const x = r.range(-40, W), y = r.range(20, 420), len = r.range(90, 260), d = leaf(x, y, len, r.range(3, 9), r.range(-7, -1));
    if (i % 3 === 0) a += d; else if (i % 3 === 1) b += d; else c += d;
  }
  add(sh(a, '#f8dcc4', { opacity: 0.75 }), sh(b, '#f3b9a6', { opacity: 0.6 }), sh(c, '#c9c2dc', { opacity: 0.6 }));
}
add(sh(circle(SUN[0], SUN[1], 340), `url(#${ID}-glow)`));
add(sh(circle(SUN[0], SUN[1], 52), '#ffe7a0', { opacity: 0.7 }), sh(circle(SUN[0], SUN[1], 40), '#fff6d4'));
{
  const cl: [number, number, number, number, number][] = [[420, 150, 230, 34, 1], [760, 80, 190, 28, 2], [90, 250, 200, 30, 3], [560, 300, 260, 30, 4], [330, 420, 210, 22, 5], [640, 470, 170, 18, 6], [30, 400, 150, 18, 7], [1010, 60, 150, 20, 8]];
  for (const [x, y, w, h, s] of cl) {
    const warm = Math.min(1, y / 480);
    add(place(cloud(w, h, s * 17, mix('#fff4e6', '#ffe1b0', warm), mix('#c79bb4', '#f0a27a', warm)), { x, y }));
  }
  // lit cloud bars near the sun
  let bars = '';
  const r = rng(5);
  for (let i = 0; i < 9; i++) bars += leaf(r.range(-30, 380), r.range(470, 610), r.range(120, 300), r.range(3, 7), r.range(-3, 1));
  add(sh(bars, '#ffe9b8', { opacity: 0.8 }));
}
// gulls
for (const [x, y, s, t] of [[505, 215, 44, -8], [575, 180, 30, 6], [300, 330, 26, -12], [700, 395, 22, 4], [245, 120, 34, 10], [800, 235, 18, -5], [450, 520, 16, 8]] as [number, number, number, number][]) add(place(gull(s, y > 450 ? '#6b5560' : '#fffaf0', t), { x, y }));

// ---------- distant headland ----------
add(sh(poly([[-10, 596], [50, 578], [110, 588], [170, 566], [215, 580], [290, 606], [370, 622], [470, 636], [560, HORIZON + 2], [-10, HORIZON + 2]]), '#d6a08e'));
add(sh(poly([[-10, 596], [50, 578], [110, 588], [170, 566], [190, 572], [120, 600], [40, 606], [-10, 612]]), '#e9b99a'));
add(sh(poly([[-10, 622], [70, 610], [150, 618], [240, 626], [330, 634], [400, HORIZON + 2], [-10, HORIZON + 2]]), '#b98a86'));
{
  let d = '';
  const r = rng(21);
  for (let i = 0; i < 16; i++) d += rect(r.range(10, 380), r.range(612, 634), r.range(3, 6), r.range(2, 4));
  add(sh(d, '#fbead0'));
  add(sh(rect(47, 562, 5, 18), '#fbead0'), sh(poly([[45, 562], [49.5, 554], [54, 562]]), '#c9673f'));
}

// ---------- sea ----------
add(sh(rect(0, HORIZON, W, H - HORIZON), `url(#${ID}-sea)`));
add(sh(rect(SUN[0] - 190, HORIZON, 380, H - HORIZON), `url(#${ID}-path)`));
{
  const r = rng(31);
  const buckets: Record<string, string> = { gold: '', light: '', pale: '', dark: '', deep: '' };
  for (let i = 0; i < 420; i++) {
    const y = HORIZON + 4 + Math.pow(r.next(), 1.25) * (H - HORIZON - 8), t = (y - HORIZON) / (H - HORIZON);
    const x = r.range(-20, W), len = 6 + t * 44 * r.range(0.5, 1.2), amp = 1 + t * 4;
    const d = M(x, y) + Q(x + len / 2, y - amp, x + len, y);
    const nearSun = Math.abs(x + len / 2 - SUN[0]) < 30 + t * 150;
    const k = r.next();
    if (nearSun && k < 0.75) buckets.gold += d + Q(x + len / 2, y + amp * 0.6, x, y) + 'Z';
    else if (k < 0.3) buckets.light += d; else if (k < 0.5) buckets.pale += d; else if (k < 0.8) buckets.dark += d; else buckets.deep += d;
  }
  add(sh(buckets.gold, '#fff0b8', { opacity: 0.9 }));
  add(stroke(buckets.light, '#c9ebe6', 1.6, { opacity: 0.8 }), stroke(buckets.pale, '#f6d9a8', 1.4, { opacity: 0.7 }), stroke(buckets.dark, '#2c7189', 1.6, { opacity: 0.7 }), stroke(buckets.deep, '#1e5571', 2, { opacity: 0.6 }));
  let bands = '', bands2 = '';
  for (let i = 0; i < 16; i++) {
    const y = r.range(HORIZON + 15, H - 20), t = (y - HORIZON) / (H - HORIZON);
    const d = ellipse(r.range(0, W), y, r.range(80, 240) * (0.5 + t), 1.5 + t * 5);
    if (i % 2) bands += d; else bands2 += d;
  }
  add(sh(bands, '#bfe6e2', { opacity: 0.3 }), sh(bands2, '#1f5b78', { opacity: 0.22 }));
}
// far sailboats and a breakwater with a small light
add(sh(poly([[70, 652], [112, 652], [106, 660], [76, 660]]), '#6b4a4a'), sh(poly([[90, 650], [90, 612], [112, 648]]), '#fff6e0'), sh(poly([[87, 650], [87, 620], [72, 648]]), '#f6d9b0'));
add(sh(poly([[330, 648], [352, 648], [349, 653], [333, 653]]), '#6b4a4a'), sh(poly([[341, 647], [341, 626], [353, 646]]), '#fff6e0'));
add(sh(poly([[-10, 700], [150, 694], [196, 700], [200, 710], [-10, 716]]), '#a88d76'), sh(poly([[-10, 700], [150, 694], [196, 700], [-10, 705]]), '#d9bf9a'));
{
  let rocks = '';
  const r = rng(77);
  for (let i = 0; i < 12; i++) rocks += ellipse(r.range(0, 195), r.range(709, 716), r.range(6, 13), r.range(3, 5));
  add(sh(rocks, '#8a745f'));
  add(sh(poly([[170, 696], [184, 696], [181, 660], [173, 660]]), '#fbf1dc'), sh(poly([[171.5, 684], [182.5, 684], [182, 674], [172.3, 674]]), '#d2452f'), sh(rect(171, 652, 12, 8), '#39424a'), sh(rect(173.5, 654, 7, 4.5), '#ffe08a'), sh(poly([[169, 652], [177, 644], [185, 652]]), '#d2452f'));
  add(sh(ellipse(177, 722, 9, 14), '#fbf1dc', { opacity: 0.25 }));
}

// ---------- hillside ----------
const hill: Pt[] = [[128, 872], [176, 780], [250, 660], [340, 606], [450, 528], [560, 452], [670, 372], [790, 292], [910, 214], [1030, 150], [1130, 118], [1210, 104], [1210, 900], [128, 900]];
add(sh(poly(hill), '#7f8f52'));
add(sh(poly([[250, 660], [340, 606], [450, 528], [560, 452], [670, 372], [790, 292], [910, 214], [1030, 150], [1130, 118], [1210, 104], [1210, 150], [1040, 190], [900, 262], [760, 350], [620, 446], [480, 548], [340, 640], [240, 716], [170, 800], [176, 780]]), '#a9a85e'));
{
  const r = rng(41);
  // trees along the ridge
  for (let i = 0; i < 26; i++) {
    const a = r.next(), x = 260 + a * 940, yRidge = 655 - (x - 250) * 0.575 + Math.max(0, (x - 1000) * 0.33);
    if (i % 3 === 0) add(place(cypress(r.range(34, 58)), { x, y: yRidge + r.range(8, 30) }));
    else add(place(treeClump(r.range(34, 60), r.range(28, 46), i * 13 + 3, r.pick(['#56783f', '#6a8a48', '#4a6c3c'])), { x, y: yRidge + r.range(14, 40) }));
  }
}

// lower slope: more trees, and rocks where the hill meets the water
{
  const r = rng(43);
  for (let i = 0; i < 9; i++) {
    const x = 196 + i * 22 + r.range(-6, 6), y = 800 - (x - 190) * 0.55 + r.range(10, 40);
    if (i % 3 === 1) add(place(cypress(r.range(40, 60)), { x, y }));
    else add(place(treeClump(r.range(40, 58), r.range(34, 48), i * 7 + 90, r.pick(['#56783f', '#6a8a48', '#4a6c3c'])), { x, y }));
  }
  const rock = (x: number, y: number, w: number, h: number, c: string) => {
    add(sh(blob([[x - w, y], [x - w * 0.7, y - h * 0.8], [x - w * 0.1, y - h], [x + w * 0.6, y - h * 0.75], [x + w, y]], 0.5), c));
    add(sh(blob([[x - w * 0.7, y - h * 0.8], [x - w * 0.1, y - h], [x + w * 0.1, y - h * 0.5], [x - w * 0.5, y - h * 0.3]], 0.5), shade(c, 0.3)));
    add(sh(ellipse(x, y + 1, w * 1.05, 3), '#1f4f66', { opacity: 0.4 }));
  };
  rock(118, 884, 30, 30, '#b39a80'); rock(156, 878, 34, 44, '#a88d76'); rock(196, 884, 30, 38, '#bda58a'); rock(84, 892, 20, 16, '#a08672'); rock(40, 904, 14, 10, '#b39a80');
  rock(222, 900, 24, 26, '#9c846e'); rock(176, 904, 26, 22, '#b39a80'); rock(138, 906, 20, 16, '#9c846e'); rock(104, 902, 16, 12, '#bda58a');
  let sc = '';
  for (let i = 0; i < 14; i++) sc += ellipse(r.range(150, 235), r.range(820, 872), r.range(5, 11), r.range(2.5, 5));
  add(sh(sc, '#c9b98a', { opacity: 0.8 }));
}

// church on the crest
{
  const cx = 968, by = 250;
  // nave
  add(sh(rect(cx - 10, by - 70, 130, 70), '#f6e2bc'), sh(rect(cx + 90, by - 70, 30, 70), '#dcc49c'));
  add(sh(poly([[cx - 16, by - 70], [cx + 55, by - 104], [cx + 126, by - 70]]), '#c9673f'), sh(poly([[cx - 16, by - 70], [cx + 55, by - 104], [cx + 55, by - 70]]), '#dd8455'));
  add(sh(circle(cx + 55, by - 58, 9), '#48697a'), stroke(circle(cx + 55, by - 58, 9), '#fbf1dc', 2), sh(rect(cx + 44, by - 34, 22, 34, 10), '#6b4a2f'));
  // dome with majolica tiles
  add(sh(rect(cx + 128, by - 78, 62, 78), '#f2d7a8'), sh(rect(cx + 172, by - 78, 18, 78), '#d8ba88'));
  add(sh(M(cx + 124, by - 78) + Q(cx + 126, by - 132, cx + 159, by - 136) + Q(cx + 192, by - 132, cx + 194, by - 78) + 'Z', '#e3b83c'));
  let st = '';
  for (let i = 1; i < 6; i++) st += M(cx + 124 + i * 11.6, by - 78) + Q(cx + 132 + i * 9, by - 120, cx + 159, by - 136);
  add(stroke(st, '#3f8a6e', 2.2), sh(M(cx + 124, by - 78) + Q(cx + 126, by - 132, cx + 159, by - 136) + Q(cx + 138, by - 120, cx + 138, by - 78) + 'Z', '#fff2b0', { opacity: 0.35 }));
  add(sh(rect(cx + 155, by - 150, 8, 16), '#f6e2bc'), stroke(line([[cx + 159, by - 150], [cx + 159, by - 166]]) + line([[cx + 154, by - 160], [cx + 164, by - 160]]), '#5b4a3a', 2));
  // bell tower
  const tx = cx - 62, tw = 48, th = 168;
  add(sh(rect(tx, by - th, tw, th), '#f9e9c6'), sh(rect(tx + tw * 0.68, by - th, tw * 0.32, th), '#dcc49c'));
  add(sh(poly([[tx, by - th], [tx + tw * 0.4, by - th], [tx + tw * 0.15, by], [tx, by]]), '#fff6dc', { opacity: 0.7 }));
  add(sh(rect(tx - 3, by - th - 5, tw + 6, 7), '#e6cfa2'), sh(rect(tx - 3, by - th + 46, tw + 6, 5), '#e6cfa2'), sh(rect(tx - 3, by - 60, tw + 6, 5), '#e6cfa2'));
  add(sh(rect(tx + 8, by - th + 10, 13, 30, 6.5), '#3d4d5c'), sh(rect(tx + 27, by - th + 10, 13, 30, 6.5), '#3d4d5c'));
  add(sh(blob([[tx + 14.5, by - th + 22], [tx + 19, by - th + 34], [tx + 10, by - th + 34]], 0.8), '#d9a441'), sh(blob([[tx + 33.5, by - th + 22], [tx + 38, by - th + 34], [tx + 29, by - th + 34]], 0.8), '#d9a441'));
  add(sh(circle(tx + tw / 2, by - th + 74, 10), '#fbf6e6'), stroke(circle(tx + tw / 2, by - th + 74, 10), '#8a6a45', 1.6), stroke(line([[tx + tw / 2, by - th + 74], [tx + tw / 2, by - th + 67]]) + line([[tx + tw / 2, by - th + 74], [tx + tw / 2 + 5, by - th + 76]]), '#3a3a3f', 1.4));
  add(sh(rect(tx + 17, by - 46, 14, 26, 7), '#48697a'));
  add(sh(poly([[tx - 5, by - th - 5], [tx + tw / 2, by - th - 52], [tx + tw + 5, by - th - 5]]), '#c9673f'), sh(poly([[tx - 5, by - th - 5], [tx + tw / 2, by - th - 52], [tx + tw / 2, by - th - 5]]), '#e08a5a'));
  add(stroke(line([[tx + tw / 2, by - th - 52], [tx + tw / 2, by - th - 70]]) + line([[tx + tw / 2 - 5, by - th - 63], [tx + tw / 2 + 5, by - th - 63]]), '#5b4a3a', 2));
}

// ---------- town rows (back to front) ----------
interface Placed { x: number; w: number; h: number; wall: string; y: number; roof: string }
function row(baseY: number, xStart: number, xEnd: number, wR: [number, number], hR: [number, number], unit: number, lod: number, haze: number, seed: number, front = false): Placed[] {
  const r = rng(seed), out: Placed[] = [];
  let x = xStart, prev = '', prevSh = '';
  let i = 0;
  while (x < xEnd) {
    const w = r.range(wR[0], wR[1]), h = r.range(hR[0], hR[1]);
    let wall = r.pick(WALLS); while (wall === prev) wall = r.pick(WALLS); prev = wall;
    let shut = r.pick(SHUTTERS); while (shut === prevSh) shut = r.pick(SHUTTERS); prevSh = shut;
    const cx = x + w / 2, by = baseY + r.range(-5, 5);
    if (r.next() < 0.3 && i > 0) {
      if (r.next() < 0.5) add(place(cypress(h * r.range(0.8, 1.15), mix('#3d5f3c', HAZE, haze)), { x: x - 4, y: by }));
      else add(place(treeClump(unit * 1.5, unit * 1.6, seed + i, mix('#55783f', HAZE, haze)), { x: x - 2, y: by - unit * 0.5 }));
    }
    const roofK = r.next();
    const roof = roofK < 0.42 ? 'shed' : roofK < 0.68 ? 'hip' : roofK < 0.84 ? 'flat' : 'gable';
    const rc = mix(r.pick(ROOFS), HAZE, haze * 0.8);
    const aw = front && r.next() < 0.7 ? r.pick<[string, string]>([['#f7f2e4', '#d2452f'], ['#f7f2e4', '#2f6690'], ['#f6dc9c', '#3f7d6e'], ['#f7f2e4', '#e39a2d']]) : undefined;
    add(place(house({
      w, h, wall: mix(wall, HAZE, haze), shutter: mix(shut, HAZE, haze * 0.7), roof, roofColor: rc, unit, seed: seed * 31 + i * 7, lod,
      litChance: front ? 0.22 : 0.16, door: front ? r.pick(['#2f6690', '#3f7d6e', '#8c3b2e', '#6b4a2f']) : undefined, awning: aw, shop: front && !!aw,
      vine: lod >= 1 && r.next() < 0.3 ? r.pick(['#c2257a', '#d6336c', '#a61e7d', '#e0559a']) : undefined,
    }), { x: cx, y: by }));
    out.push({ x: cx, w, h, wall, y: by, roof: rc });
    x += w - r.range(0, 3);
    i++;
  }
  return out;
}
row(318, 868, 1215, [50, 66], [62, 84], 24, 0, 0.34, 601);
row(396, 742, 1215, [58, 76], [76, 98], 28, 1, 0.26, 502);
row(486, 618, 1215, [70, 90], [92, 116], 33, 1, 0.18, 403);
row(588, 496, 1215, [84, 106], [112, 136], 39, 1, 0.1, 304);
row(700, 376, 1215, [98, 124], [128, 158], 46, 2, 0.04, 205);

// quay
const QY = 820;
add(sh(poly([[236, QY - 6], [W, QY - 6], [W, QY + 46], [206, QY + 46]]), '#e6d2aa'));
add(sh(poly([[236, QY - 6], [W, QY - 6], [W, QY + 6], [229, QY + 6]]), '#f3e2bd'));
{
  let pv = '';
  for (let i = 0; i < 34; i++) { const x = 230 + i * 30; pv += line([[x, QY + 6], [x - 12, QY + 46]]); }
  pv += line([[220, QY + 24], [W, QY + 24]]);
  add(stroke(pv, '#cbb58c', 1));
}
const front = row(QY, 262, 1215, [112, 146], [150, 186], 54, 2, 0, 106, true);
// quay wall
add(sh(poly([[206, QY + 46], [W, QY + 46], [W, QY + 76], [200, QY + 76]]), '#b59a76'), sh(rect(200, QY + 46, 1000, 4), '#d9c39a'));
{
  const r = rng(51);
  let j = '', moss = '';
  for (let i = 0; i < 50; i++) { const x = 204 + i * 20 + r.range(-3, 3); j += line([[x, QY + 50 + (i % 2) * 12], [x, QY + 62 + (i % 2) * 12]]); }
  j += line([[202, QY + 62], [W, QY + 62]]);
  add(stroke(j, '#8f775a', 1));
  for (let i = 0; i < 40; i++) moss += ellipse(r.range(200, W), QY + 75, r.range(8, 22), r.range(2, 4.5));
  add(sh(rect(200, QY + 72, 1000, 6), '#5d6b4a'), sh(moss, '#6f8050'));
  let rings = '';
  for (let i = 0; i < 7; i++) rings += circle(300 + i * 140, QY + 58, 4);
  add(stroke(rings, '#4a4038', 1.6));
  add(sh(rect(200, QY + 78, 1000, 8), '#1f4f66', { opacity: 0.45 }));
}

// ---------- quay life ----------
function lamp(x: number, y: number, h: number) {
  add(stroke(line([[x, y], [x, y - h]]), '#2f3a3f', 2.6), sh(rect(x - 4, y - 4, 8, 4), '#2f3a3f'));
  add(stroke(M(x, y - h) + Q(x, y - h - 10, x + 10, y - h - 10), '#2f3a3f', 2));
  add(sh(circle(x + 10, y - h - 2, 13), '#ffe9a8', { opacity: 0.4 }), sh(poly([[x + 5, y - h - 9], [x + 15, y - h - 9], [x + 13, y - h + 3], [x + 7, y - h + 3]]), '#fff1b8'), sh(poly([[x + 3, y - h - 9], [x + 17, y - h - 9], [x + 10, y - h - 15]]), '#2f3a3f'));
}
function bollard(x: number, y: number) {
  add(sh(rect(x - 5, y - 13, 10, 13, 2), '#3a3f45'), sh(rect(x - 7, y - 16, 14, 5, 2), '#4b5258'), sh(rect(x - 5, y - 13, 3, 13), '#5c646b'));
}
function cafe(x: number, y: number, c1: string, c2: string) {
  add(stroke(line([[x, y], [x, y - 62]]), '#6b4a2f', 2));
  const d1: string[] = [];
  let a = '', b = '';
  for (let i = 0; i < 6; i++) { const p = poly([[x, y - 76], [x - 39 + i * 13, y - 54], [x - 39 + (i + 1) * 13, y - 54]]); if (i % 2) a += p; else b += p; d1.push(p); }
  add(sh(b, c1), sh(a, c2), sh(poly([[x, y - 76], [x + 13, y - 54], [x + 39, y - 54]]), '#000000', { opacity: 0.1 }));
  add(sh(rect(x - 14, y - 22, 28, 3), '#f7f2e4'), stroke(line([[x - 10, y - 19], [x - 12, y]]) + line([[x + 10, y - 19], [x + 12, y]]), '#6b4a2f', 1.6));
  add(sh(rect(x - 30, y - 16, 10, 3), '#3f7d6e'), stroke(line([[x - 30, y - 30], [x - 30, y]]) + line([[x - 21, y - 14], [x - 21, y]]), '#3f7d6e', 1.6));
  add(sh(rect(x + 20, y - 16, 10, 3), '#3f7d6e'), stroke(line([[x + 30, y - 30], [x + 30, y]]) + line([[x + 21, y - 14], [x + 21, y]]), '#3f7d6e', 1.6));
  add(sh(circle(x - 3, y - 25, 2.6), '#f5cf3a'), sh(rect(x + 3, y - 29, 3, 7), '#9fc5c9'));
}
function pot(x: number, y: number, s: number, seed: number, flowers?: string) {
  add(sh(poly([[x - s, y - s * 1.5], [x + s, y - s * 1.5], [x + s * 0.72, y], [x - s * 0.72, y]]), '#c9673f'), sh(poly([[x + s * 0.2, y - s * 1.5], [x + s, y - s * 1.5], [x + s * 0.72, y], [x + s * 0.2, y]]), '#a84f2e'), sh(rect(x - s * 1.12, y - s * 1.75, s * 2.24, s * 0.34), '#d98058'));
  if (flowers) add(place(bougainvillea(s * 3.4, s * 2.6, seed, flowers), { x, y: y - s * 2.7 }));
  else {
    add(place(treeClump(s * 3.6, s * 3.6, seed, '#4f7a3f'), { x, y: y - s * 1.2 }));
    const r = rng(seed); let lm = '';
    for (let i = 0; i < 5; i++) lm += ellipse(x + r.range(-s * 1.2, s * 1.2), y - s * r.range(2.4, 4), s * 0.34, s * 0.26, r.range(-30, 30));
    add(sh(lm, '#f5cf3a'));
  }
}
add(place(palm(150, 9), { x: 252, y: QY + 10 }));
lamp(330, QY + 30, 78); lamp(628, QY + 30, 78); lamp(930, QY + 30, 78);
cafe(455, QY + 34, '#f7f2e4', '#d2452f'); cafe(760, QY + 36, '#f7f2e4', '#2f6690'); cafe(1085, QY + 36, '#f6dc9c', '#3f7d6e');
pot(385, QY + 32, 8, 3); pot(540, QY + 36, 7, 4, '#d6336c'); pot(690, QY + 30, 8, 5); pot(850, QY + 36, 7, 6, '#c2257a'); pot(1000, QY + 32, 8, 8); pot(1170, QY + 34, 7, 12, '#e0559a');
for (const x of [290, 420, 580, 720, 880, 1030, 1150]) bollard(x, QY + 46);
// crates and nets on the quay
{
  const crate = (x: number, y: number, c: string) => { add(sh(rect(x, y - 13, 22, 13), c), stroke(line([[x, y - 8.5], [x + 22, y - 8.5]]) + line([[x, y - 4], [x + 22, y - 4]]) + line([[x + 7, y - 13], [x + 7, y]]) + line([[x + 15, y - 13], [x + 15, y]]), shade(c, -0.3), 0.8)); };
  crate(640, QY + 44, '#3f8fa3'); crate(664, QY + 44, '#d98a4a'); crate(650, QY + 31, '#e4572e');
  crate(955, QY + 44, '#d9a441'); crate(979, QY + 44, '#3f8fa3');
  add(sh(blob([[485, QY + 44], [495, QY + 30], [512, QY + 26], [530, QY + 32], [538, QY + 44]], 0.9), '#d98a4a'), stroke(curve([[490, QY + 38], [510, QY + 30], [532, QY + 38]]) + curve([[498, QY + 44], [512, QY + 34], [526, QY + 44]]), '#a85f2e', 0.9), sh(circle(497, QY + 31, 4), '#f5cf3a'), sh(circle(526, QY + 30, 4), '#e4572e'));
  add(place(palm(120, 14), { x: 1120, y: QY + 12 }));
}

// ---------- reflections ----------
{
  const r = rng(61);
  for (const hs of front) {
    let a = '', b = '';
    for (let k = 0; k < 9; k++) {
      const y = QY + 92 + k * 15 + r.range(-3, 3), wv = hs.w * 0.5 * (1 - k * 0.055), d = ellipse(hs.x + r.range(-8, 8), y, wv, r.range(3, 5.5));
      if (k < 5) a += d; else b += d;
    }
    add(sh(a, mix(hs.wall, '#ffffff', 0.1), { opacity: 0.5 }), sh(b, mix(hs.roof, '#f3c79c', 0.3), { opacity: 0.32 }));
  }
  // lamp reflections
  for (const x of [340, 638, 940]) { let d = ''; for (let k = 0; k < 6; k++) d += ellipse(x + r.range(-3, 3), QY + 96 + k * 13, 7 - k * 0.6, 2.4); add(sh(d, '#fff1b8', { opacity: 0.75 })); }
}

// ---------- boats ----------
function moored(x: number, y: number, s: number, o: Parameters<typeof boat>[0], flip = false) {
  const b = boat(o);
  const t = { x, y, sx: flip ? -s : s, sy: s };
  add(place(reflect(b, 0.6, 0.3), t));
  add(sh(ellipse(x, y + 2 * s, o.len * 0.5 * s, 4 * s), '#163f55', { opacity: 0.4 }));
  add(place(b, t));
  // ripples over the reflection
  let rp = '';
  for (let i = 0; i < 4; i++) rp += M(x - o.len * 0.5 * s + i * 9, y + (8 + i * 9) * s) + Q(x, y + (5 + i * 9) * s, x + o.len * 0.5 * s - i * 9, y + (8 + i * 9) * s);
  add(stroke(rp, '#d8f0ea', 1.4 * s, { opacity: 0.55 }));
}
// mooring ropes drawn first so the hulls sit on top
add(stroke(M(420, QY + 58) + Q(410, QY + 90, 392, QY + 104) + M(720, QY + 58) + Q(700, QY + 96, 668, QY + 112) + M(1030, QY + 58) + Q(1010, QY + 92, 990, QY + 108), '#e9dcc0', 1.4));
moored(330, QY + 122, 0.9, { len: 150, hull: '#fbf6e8', stripe: '#2f6690', cabin: false, mast: true, seed: 2, cargo: true });
moored(610, QY + 130, 1, { len: 160, hull: '#fbf6e8', stripe: '#d2452f', keel: '#2f6690', cabin: true, seed: 5 }, true);
moored(920, QY + 126, 0.95, { len: 150, hull: '#9fd0cf', stripe: '#f6dc9c', keel: '#8c3b2e', mast: true, seed: 8, cargo: true });
moored(1130, QY + 150, 0.8, { len: 130, hull: '#f6dc9c', stripe: '#3f7d6e', cabin: true, seed: 9 }, true);
moored(130, 800, 0.62, { len: 140, hull: '#fbf6e8', stripe: '#e39a2d', cabin: true, mast: true, seed: 12 });
// buoys
{
  const buoy = (x: number, y: number, s: number, c: string) => {
    add(sh(ellipse(x, y + s * 1.6, s * 0.9, s * 1.5), c, { opacity: 0.3 }), sh(circle(x, y, s), c), sh(sector(x, y, s, 180, 360), shade(c, 0.25)), sh(rect(x - s * 0.18, y - s * 1.5, s * 0.36, s * 0.6), '#39424a'), sh(ellipse(x - s * 0.35, y - s * 0.4, s * 0.25, s * 0.18), '#ffffff', { opacity: 0.7 }));
    add(stroke(M(x - s * 1.6, y + s * 0.9) + Q(x, y + s * 1.5, x + s * 1.6, y + s * 0.9), '#d8f0ea', 1.2, { opacity: 0.7 }));
  };
  buoy(482, 1012, 9, '#e4572e'); buoy(790, 1090, 11, '#f39c34'); buoy(1068, 1040, 8, '#e4572e'); buoy(60, 930, 8, '#f39c34'); buoy(300, 1170, 12, '#e4572e');
}
moored(700, 1118, 1.5, { len: 170, hull: '#fbf6e8', stripe: '#3f7d6e', keel: '#8c3b2e', cabin: true, mast: true, seed: 21, cargo: true });
moored(1010, 1160, 1.25, { len: 150, hull: '#e89a7c', stripe: '#fbf6e8', keel: '#2f6690', seed: 23, cargo: true }, true);
moored(360, 1080, 1.15, { len: 140, hull: '#bcd3e6', stripe: '#d2452f', keel: '#27506b', mast: true, seed: 25 }, true);
// little rowing boat, bottom left
{
  const x = 120, y = 1130;
  add(sh(ellipse(x, y + 16, 92, 9), '#163f55', { opacity: 0.4 }));
  add(sh(M(x - 96, y - 14) + Q(x, y - 4, x + 100, y - 20) + Q(x + 78, y + 16, x + 40, y + 16) + L2(x - 50, y + 16) + Q(x - 86, y + 14, x - 96, y - 14) + 'Z', '#d2452f'));
  add(sh(M(x - 96, y - 14) + Q(x, y - 4, x + 100, y - 20) + Q(x + 96, y - 12, x + 92, y - 6) + Q(x, y + 8, x - 90, y - 2) + 'Z', '#fbf6e8'));
  add(sh(M(x - 88, y - 13) + Q(x, y - 4, x + 92, y - 18) + Q(x, y - 22, x - 88, y - 13) + 'Z', '#8a5a3a'), stroke(M(x - 96, y - 14) + Q(x, y - 4, x + 100, y - 20), '#f6dc9c', 3));
  add(sh(poly([[x - 30, y - 14], [x - 14, y - 14], [x - 16, y - 8], [x - 28, y - 8]]), '#c9a06a'), sh(poly([[x + 26, y - 14], [x + 42, y - 15], [x + 40, y - 9], [x + 28, y - 8]]), '#c9a06a'));
  add(stroke(line([[x - 10, y - 18], [x - 78, y + 26]]), '#c9a06a', 3), sh(ellipse(x - 84, y + 30, 13, 5, -33), '#e0b97f'));
  add(stroke(M(x + 100, y - 20) + Q(x + 150, y - 40, x + 190, y - 70), '#e9dcc0', 1.4));
}
function L2(x: number, y: number) { return `L${Math.round(x * 10) / 10} ${Math.round(y * 10) / 10}`; }
function sector(cx: number, cy: number, r: number, a0: number, a1: number) {
  const pts: Pt[] = [];
  for (let i = 0; i <= 10; i++) { const a = ((a0 + ((a1 - a0) * i) / 10) * Math.PI) / 180; pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
  return poly(pts);
}

// warm evening wash
add(sh(rect(0, 0, W, H), `url(#${ID}-warm)`));

// ---------- foreground lemon branch (top-left) ----------
{
  add(stroke(curve([[-10, 20], [80, 46], [170, 58], [262, 96], [330, 150]]), '#5b4630', 7), stroke(curve([[-10, 17], [80, 43], [170, 55], [262, 93]]), '#8a6a45', 2));
  add(stroke(curve([[120, 52], [150, 100], [165, 150]]) + curve([[220, 76], [250, 40], [300, 22]]) + curve([[60, 40], [70, 90], [50, 130]]), '#5b4630', 4));
  const leaves: [number, number, number, number][] = [[20, 26, 78, 60], [50, 38, 84, -38], [100, 48, 90, 30], [128, 60, 80, 110], [150, 100, 76, 40], [165, 150, 70, 100], [160, 144, 66, 160], [190, 64, 84, -52], [232, 66, 78, -80], [270, 40, 74, -8], [300, 22, 70, -40], [262, 96, 84, 62], [300, 124, 72, 10], [330, 150, 70, 70], [62, 80, 70, 150], [52, 128, 64, 60], [-6, 22, 70, 100], [296, 26, 60, 40]];
  leaves.forEach(([x, y, l, rot], i) => add(place(citrusLeaf(l, rot, i % 3 === 0 ? '#2f5a34' : i % 3 === 1 ? '#3f6f3a' : '#557f3c'), { x, y })));
  add(place(lemon(34, 25, 62), { x: 176, y: 196 }), place(lemon(30, 22, 100), { x: 60, y: 168 }), place(lemon(28, 21, 20), { x: 312, y: 64 }));
  add(place(citrusLeaf(60, 25, '#4b7a3a'), { x: 130, y: 150 }), place(citrusLeaf(52, 130, '#3f6f3a'), { x: 78, y: 122 }));
  let fl = '';
  for (const [x, y] of [[226, 110], [236, 118], [220, 122]] as Pt[]) for (let k = 0; k < 5; k++) fl += leaf(x, y, 9, 3.2, k * 72);
  add(sh(fl, '#fffaf0'), sh(circle(226, 110, 2.2) + circle(236, 118, 2.2) + circle(220, 122, 2.2), '#f5cf3a'));
}
void awning; void blob;

const activity: PuzzleActivity = {
  id: ID, version: 1, mode: 'puzzle', title: 'Harbour at Golden Hour',
  blurb: 'Pastel houses climb the hillside above a little fishing harbour as the evening sun turns the water to gold.',
  collectionId: 'coastal', categories: ['Seaside', 'Architecture', 'Travel'], difficulty: 'Moderate',
  pieceCounts: [36, 64, 100, 196], geometrySeed: 4817, geometryVersion: 1,
  art: { width: W, height: H, defs, shapes },
};
export default activity;
