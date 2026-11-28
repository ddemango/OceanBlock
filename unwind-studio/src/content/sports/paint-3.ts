import { rect, circle, ellipse, poly, line, curve, leaf, sector, xf } from '../../art/kit';
import type { PaintActivity, PaletteColor } from '../types';
import { canvas, bar, canopy, sample, subQuad, lerp, waveTop, M, Q, L, type Pt } from './props-paint';

const W = 1000, H = 1250;

const palette: PaletteColor[] = [
  { id: 'sky', number: 1, name: 'Clear morning', hex: '#cfe4ec' },
  { id: 'warm', number: 2, name: 'Sunrise blush', hex: '#f8dfc2' },
  { id: 'sun', number: 3, name: 'Sun yellow', hex: '#ffe08a' },
  { id: 'cream', number: 4, name: 'Cream', hex: '#fdf8ee' },
  { id: 'hillFar', number: 5, name: 'Distant hills', hex: '#a9b2cf' },
  { id: 'hillMid', number: 6, name: 'Sage slope', hex: '#93b38e' },
  { id: 'hillNear', number: 7, name: 'Shore green', hex: '#5f8c63' },
  { id: 'pine', number: 8, name: 'Pine', hex: '#3c6350' },
  { id: 'waterL', number: 9, name: 'Still water', hex: '#acd3da' },
  { id: 'waterM', number: 10, name: 'Lake blue', hex: '#80b4c3' },
  { id: 'waterD', number: 11, name: 'Deep water', hex: '#5a8ea2' },
  { id: 'woodL', number: 12, name: 'Weathered pine', hex: '#dcae76' },
  { id: 'woodM', number: 13, name: 'Dock cedar', hex: '#b37f50' },
  { id: 'woodD', number: 14, name: 'Wet timber', hex: '#6e4a32' },
  { id: 'red', number: 15, name: 'Boat red', hex: '#d2553f' },
  { id: 'metal', number: 16, name: 'Galvanised', hex: '#b9bec2' },
  { id: 'pink', number: 17, name: 'Lily pink', hex: '#f2a8b6' },
];

const { regions, detail, R, D } = canvas();
const RIPPLE = '#e6f3f5';

// ---------------------------------------------------------------- sky
R('sky', rect(0, 0, W, 520), 'sky');
R('sky-warm', poly([[0, 520], ...sample([[0, 330], [260, 300], [560, 270], [800, 290], [1000, 270]], 6), [1000, 520]]), 'warm');
R('sun', circle(640, 396, 58), 'sun');
R('cloud-1', canopy(190, 140, 120, 28, 6, 0.2, 0.3, true), 'cream');
R('cloud-2', canopy(560, 86, 92, 22, 5, 0.2, 0.7, true), 'cream');
R('cloud-3', canopy(880, 210, 100, 24, 6, 0.2, 0.1, true), 'cream');
D(M(110, 152) + Q(190, 136, 280, 150) + M(810, 222) + L(950, 222), '#d9e8ee', 2);
D(curve([[330, 200], [342, 192], [352, 200]]) + curve([[352, 200], [362, 192], [374, 200]]) + curve([[392, 232], [400, 226], [408, 232]]) + curve([[408, 232], [416, 226], [424, 232]]), '#5d6d78', 2);

// ---------------------------------------------------------------- hills and far shore
R('hill-far', poly([[0, 520], ...sample([[0, 420], [180, 366], [380, 404], [560, 352], [760, 392], [1000, 338]], 6), [1000, 520]]), 'hillFar');
R('hill-mid', poly([[0, 520], ...sample([[0, 446], [220, 414], [420, 456], [640, 436], [860, 402], [1000, 422]], 6), [1000, 520]]), 'hillMid');
R('hill-near-left', poly([[0, 524], ...sample([[0, 452], [130, 446], [300, 484], [440, 516]], 6), [440, 524]]), 'hillNear');
R('hill-near-right', poly([[580, 524], ...sample([[580, 520], [740, 478], [900, 458], [1000, 462]], 6), [1000, 524]]), 'hillNear');
function pine(id: string, x: number, base: number, h: number) {
  const w = h * 0.42;
  R(id, poly([[x, base - h], [x + w * 0.5, base - h * 0.6], [x + w * 0.32, base - h * 0.6], [x + w * 0.8, base - h * 0.22], [x + w * 0.55, base - h * 0.22], [x + w, base], [x - w, base], [x - w * 0.55, base - h * 0.22], [x - w * 0.8, base - h * 0.22], [x - w * 0.32, base - h * 0.6], [x - w * 0.5, base - h * 0.6]]), 'pine');
}
pine('pine-1', 52, 470, 96);
pine('pine-2', 116, 476, 74);
pine('pine-3', 186, 480, 108);
pine('pine-4', 256, 490, 70);
pine('pine-5', 938, 476, 92);
pine('pine-6', 966, 480, 66);
// little cabin on the far shore
R('cabin-wall', rect(770, 446, 82, 46), 'red');
R('cabin-roof', poly([[758, 450], [811, 414], [864, 450]]), 'woodD');
R('cabin-window', rect(786, 458, 22, 18), 'sun');
R('cabin-door', rect(826, 462, 16, 30), 'woodD');

// ---------------------------------------------------------------- the lake
R('lake', rect(0, 520, W, 730), 'waterL');
R('lake-reflection', poly([[0, 520], [1000, 520], [1000, 574], ...sample([[1000, 574], [820, 556], [640, 580], [420, 560], [200, 578], [0, 566]], 5).slice(1)]), 'waterM');
R('lake-mid', poly(waveTop(0, 1000, 690, 6, 220, 1250)), 'waterM');
R('lake-near', poly(waveTop(0, 1000, 930, 8, 260, 1250, 1.2)), 'waterD');
R('glint-1', ellipse(640, 546, 70, 9), 'sun');
R('glint-2', ellipse(644, 600, 46, 8), 'sun');
R('glint-3', ellipse(636, 640, 26, 7), 'sun');
// open-water ripples
D(line([[60, 610], [130, 610]]) + line([[260, 640], [330, 640]]) + line([[860, 620], [950, 620]]) + line([[720, 660], [780, 660]]) + line([[20, 760], [90, 760]]) + line([[880, 900], [960, 900]]) + line([[600, 990], [680, 990]]), RIPPLE, 2.4);

// ---------------------------------------------------------------- reeds and cattails, far left
function blade(id: string, x: number, y: number, len: number, wid: number, rot: number, col: string) {
  R(id, leaf(x, y, len, wid, rot), col);
}
blade('reed-far-1', 30, 700, 150, 14, -100, 'hillNear');
blade('reed-far-2', 60, 704, 120, 13, -78, 'hillMid');
blade('reed-far-3', 96, 706, 140, 14, -96, 'hillNear');
blade('reed-far-4', 130, 708, 100, 12, -66, 'hillMid');
R('cattail-far-1', ellipse(48, 590, 10, 26, 6), 'woodD');
R('cattail-far-2', ellipse(110, 612, 9, 24, -4), 'woodD');
D(line([[44, 616], [40, 706]]) + line([[110, 636], [108, 708]]) + line([[50, 564], [51, 548]]) + line([[110, 588], [111, 574]]), '#4e6b45', 2.2);
D(line([[0, 712], [160, 712]]), RIPPLE, 2.4);

// ---------------------------------------------------------------- rowboat moored off the dock
R('boat-reflection', poly([[668, 832], [910, 832], [880, 868], [720, 874]]), 'waterD');
R('boat-hull', poly(sample([[650, 772], [700, 776], [800, 780], [900, 768], [952, 742], [930, 790], [880, 826], [800, 842], [700, 836], [658, 812], [650, 772]], 5)), 'red');
R('boat-inside', poly([...sample([[656, 768], [760, 750], [860, 744], [944, 740]], 5), ...sample([[944, 744], [900, 764], [800, 774], [700, 772], [656, 768]], 5)]), 'woodM');
R('boat-seat-1', poly([[718, 754], [744, 752], [748, 774], [722, 775]]), 'woodL');
R('boat-seat-2', poly([[834, 746], [860, 745], [866, 772], [840, 773]]), 'woodL');
R('boat-gunwale', poly([...sample([[650, 772], [700, 776], [800, 780], [900, 768], [952, 742]], 5), ...sample([[948, 756], [900, 782], [800, 795], [700, 791], [652, 788]], 5)]), 'cream');
R('oar-shaft', bar([770, 762], [628, 884], 11), 'woodL');
R('oar-blade', ellipse(616, 896, 30, 11, -40), 'woodL');
D(curve([[660, 806], [800, 816], [890, 804]]) + curve([[662, 822], [780, 830], [870, 818]]), '#a8402f', 1.4, 0.7);
D(line([[690, 878], [760, 878]]) + line([[800, 884], [880, 884]]) + curve([[590, 906], [616, 914], [644, 906]]), RIPPLE, 2.4);

// ---------------------------------------------------------------- lily pads and a bloom
function pad(id: string, cx: number, cy: number, r: number, notch: number, col: string) {
  R(id, xf(sector(cx, cy, r, notch + 18, notch + 342), { sy: 0.42, ox: cx, oy: cy }), col);
}
pad('lily-pad-1', 720, 1000, 74, -30, 'hillMid');
pad('lily-pad-2', 830, 1050, 58, 200, 'hillNear');
pad('lily-pad-3', 640, 1090, 50, 160, 'hillNear');
pad('lily-pad-4', 760, 1130, 64, 10, 'hillMid');
R('lily-petal-1', leaf(726, 1000, 46, 14, -150), 'pink');
R('lily-petal-2', leaf(726, 1000, 46, 14, -30), 'pink');
R('lily-petal-3', leaf(726, 1000, 50, 15, -90), 'cream');
R('lily-petal-4', leaf(726, 1000, 46, 14, -120), 'pink');
R('lily-petal-5', leaf(726, 1000, 46, 14, -60), 'pink');
R('lily-centre', ellipse(726, 994, 13, 8), 'sun');

// ---------------------------------------------------------------- the dock
const A: Pt = [300, 720], B: Pt = [470, 720], Cn: Pt = [646, 1250], Dn: Pt = [0, 1250];
R('dock-side-face', poly([B, Cn, [Cn[0] + 50, 1250], [B[0] + 4, B[1] + 18]]), 'woodD');
R('dock-post-1', poly([[522, 840], [544, 840], [546, 904], [524, 904]]), 'woodD');
R('dock-post-2', poly([[614, 1056], [644, 1056], [648, 1150], [618, 1150]]), 'woodD');
D(M(504, 906) + Q(536, 918, 568, 906) + M(594, 1152) + Q(634, 1168, 676, 1152), RIPPLE, 2);
R('dock-gaps', poly([A, B, Cn, Dn]), 'woodD', [479, 1191]);
{
  const n = 12;
  const v = (i: number) => (i / n) ** 1.35;
  for (let i = 0; i < n; i++) {
    const g = 0.006 + 0.004 * (i / n);
    const v0 = v(i) + g, v1 = v(i + 1) - g;
    const col = i % 2 ? 'woodM' : 'woodL';
    if (i === 4 || i === 8) {
      R(`plank-${i + 1}a`, subQuad(A, B, Cn, Dn, 0, 0.46, v0, v1), col);
      R(`plank-${i + 1}b`, subQuad(A, B, Cn, Dn, 0.47, 1, v0, v1), i % 2 ? 'woodL' : 'woodM');
    } else R(`plank-${i + 1}`, subQuad(A, B, Cn, Dn, 0, 1, v0, v1), col);
  }
  // nail heads near each plank edge
  let d = '';
  for (let i = 1; i < n; i++) {
    const vm = (v(i) + v(i + 1)) / 2;
    for (const u of [0.95]) { const [x, y] = lerp(lerp(A, B, u), lerp(Dn, Cn, u), vm); d += circle(x, y, 1.5 + vm * 2.5); }
  }
  D(d, '#5a3a26', 1.6);
}

// ---------------------------------------------------------------- tackle box (open)
R('tackle-lid', poly([[116, 1062], [292, 1062], [280, 986], [128, 986]]), 'pine');
R('tackle-lid-inside', poly([[132, 1056], [276, 1056], [268, 1000], [140, 1000]]), 'hillNear');
{
  const cols = ['red', 'sun', 'pink'], cols2 = ['cream', 'red', 'sun'];
  R('tackle-tray-right', rect(196, 1018, 114, 48, 4), 'metal');
  for (let i = 0; i < 3; i++) R(`lure-right-${i + 1}`, rect(204 + i * 35, 1028, 30, 28, 3), cols2[i]);
  R('tackle-tray-left', rect(102, 1040, 118, 40, 4), 'metal');
  for (let i = 0; i < 3; i++) R(`lure-left-${i + 1}`, rect(108 + i * 36, 1046, 31, 28, 3), cols[i]);
}
R('tackle-body', rect(110, 1076, 184, 92, 8), 'hillNear');
R('tackle-band', rect(110, 1096, 184, 14), 'pine');
R('tackle-latch', rect(188, 1090, 28, 26, 3), 'metal');
D(line([[214, 1018], [214, 1004]]) + line([[300, 1018], [300, 1004]]) + line([[214, 1004], [300, 1004]]), '#7f868a', 3);

// ---------------------------------------------------------------- bucket with the morning catch
R('bucket', poly([[404, 1062], [532, 1062], [520, 1176], [416, 1176]]), 'metal');
R('bucket-band-1', poly([[407, 1090], [529, 1090], [528, 1102], [408, 1102]]), 'hillFar');
R('bucket-band-2', poly([[413, 1146], [523, 1146], [522, 1158], [414, 1158]]), 'hillFar');
R('bucket-water', ellipse(468, 1062, 64, 15), 'waterD');
R('fish-tail', poly([[476, 1062], [458, 1018], [470, 1024], [480, 1008], [488, 1022], [500, 1016], [486, 1060]]), 'sun');
D(curve([[404, 1068], [468, 990], [532, 1068]]), '#7f868a', 3);
D(ellipse(468, 1062, 64, 15), '#8a9095', 2.4);

// ---------------------------------------------------------------- fishing rod and bobber
R('rod', bar([368, 1190], [66, 596], 11, 6), 'woodD', [217, 893]);
R('rod-handle', bar([380, 1214], [344, 1144], 17), 'woodL');
R('rod-reel', circle(340, 1120, 17), 'metal');
D(line([[340, 1120], [356, 1108]]) + circle(358, 1106, 3), '#5a5f63', 2);
D(curve([[66, 596], [100, 720], [136, 880]], 0.6), '#f4f1ea', 1.4);
R('bobber-top', sector(138, 892, 15, 180, 360), 'red');
R('bobber-bottom', sector(138, 892, 15, 0, 180), 'cream');
D(ellipse(138, 904, 30, 6) + ellipse(138, 908, 48, 9), RIPPLE, 2);

// ---------------------------------------------------------------- foreground reeds, right
const reeds: [number, number, number, number, number, string][] = [
  [880, 1250, 300, 20, -98, 'hillNear'], [930, 1250, 280, 20, -80, 'hillMid'],
  [986, 1250, 320, 20, -96, 'hillNear'], [850, 1250, 220, 18, -116, 'hillMid'], [940, 1250, 200, 18, -104, 'pine'],
  [1000, 1250, 220, 18, -120, 'hillMid'], [900, 1250, 180, 17, -62, 'hillMid'], [916, 1250, 360, 22, -86, 'pine'],
];
const reedLabels: Record<number, [number, number]> = { 2: [952, 1126], 8: [929, 1070] };
reeds.forEach(([x, y, len, wid, rot, col], i) => R(`reed-${i + 1}`, leaf(x, y, len, wid, rot), col, reedLabels[i + 1]));
R('cattail-1', ellipse(862, 860, 13, 38, -6), 'woodD');
R('cattail-2', ellipse(966, 896, 12, 34, 8), 'woodD');
D(line([[866, 898], [880, 1080]]) + line([[962, 930], [956, 1060]]) + line([[860, 822], [858, 800]]) + line([[970, 862], [972, 842]]), '#4e6b45', 2.6);
// leaf ribs on the foreground reeds
D(reeds.map(([x, y, len, , rot]) => xf(line([[16, 0], [len * 0.8, 0]]), { rot, x, y })).join(''), '#36543f', 1.2, 0.5);

const activity: PaintActivity = {
  id: 'sports-paint-3', version: 1, mode: 'paint', title: 'Gone Fishing',
  blurb: 'A quiet sunrise on the lake: an old wooden dock with a rod, an open tackle box and a bucket, a red rowboat, reeds and lily pads under soft blue hills.',
  added: '2026-11-25', collectionId: 'sports', categories: ["Sports"], difficulty: 'Detailed',
  width: W, height: H, palette, regions, detail,
};
export default activity;
