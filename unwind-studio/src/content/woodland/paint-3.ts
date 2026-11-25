import { blob, circle, curve, ellipse, line, poly, rect, rng, star, waveBand, xf, type Xf } from '../../art/kit';
import type { Pt } from '../../art/geometry';
import type { PaintActivity } from '../types';
import { W, H, band, bandAt, bandDir, canvas, clampPath, fern, leaflet, lobed } from './props-paint';

const { regions, detail, R, D } = canvas();

// ---------------------------------------------------------------- dusk sky in bands
R('sky-night', rect(0, 0, W, H), 'night');
R('sky-dusk', waveBand(0, 1000, 360, 14, 620, 1250), 'dusk');
R('sky-low', waveBand(0, 1000, 650, 12, 520, 1250, 1), 'duskLight');
R('sky-glow', waveBand(0, 1000, 880, 10, 700, 1250, 2), 'peach');
R('star-1', star(130, 120, 18, 7.5, 5), 'moon');
R('star-2', star(880, 96, 16, 7, 5, -80), 'moon');
R('star-3', star(910, 300, 14, 6.5, 5, -100), 'moon');
R('star-4', star(330, 66, 14, 6.5, 5, -96), 'moon');
[[60, 260], [250, 150], [700, 60], [960, 200], [790, 190], [420, 130]].forEach(([x, y]) => D(line([[x - 5, y], [x + 5, y]]) + line([[x, y - 5], [x, y + 5]]), '#f6ecd0', 1.6, 0.85));

// ---------------------------------------------------------------- the big moon
R('moon', circle(520, 470, 250), 'moon');
R('crater-1', ellipse(660, 330, 46, 36, 20), 'moonShade');
R('crater-2', ellipse(392, 300, 30, 24, -10), 'moonShade');
R('crater-3', ellipse(704, 560, 38, 30, 10), 'moonShade');
R('crater-4', ellipse(586, 248, 20, 15), 'moonShade');
D(ellipse(660, 330, 30, 22, 20) + ellipse(704, 560, 24, 18, 10), '#d2c196', 1.2, 0.6);
R('cloud-1', blob([[560, 650], [680, 618], [820, 626], [930, 650], [820, 672], [650, 676]], 1), 'duskLight');
R('cloud-2', blob([[40, 520], [150, 498], [280, 506], [340, 528], [240, 546], [110, 544]], 1), 'duskLight');
R('cloud-3', blob([[660, 712], [760, 700], [860, 712], [780, 728], [690, 728]], 1), 'peach');

// two bats far off
function bat(id: string, x: number, y: number, s: number) {
  const d = poly([[0, -6], [8, -2], [26, -14], [48, -10], [40, -2], [34, 6], [24, 2], [16, 10], [6, 6], [0, 10], [-6, 6], [-16, 10], [-24, 2], [-34, 6], [-40, -2], [-48, -10], [-26, -14], [-8, -2]]);
  R(id, xf(d, { s, x, y }), 'ink');
}
bat('bat-1', 830, 210, 1.15);
bat('bat-2', 190, 360, 0.95);

// ---------------------------------------------------------------- distant forest
{
  const pts: Pt[] = [[0, 1000]];
  const hs = [90, 60, 120, 80, 104, 66, 130, 84, 100, 70, 116, 76, 96];
  for (let i = 0; i < hs.length; i++) {
    const x = 40 + i * 76;
    pts.push([x - 28, 990 - hs[i] * 0.35], [x, 990 - hs[i]], [x + 28, 990 - hs[i] * 0.35], [x + 38, 996]);
  }
  R('forest', poly([...pts.map(([x, y]) => [Math.min(1000, x), y] as Pt), [1000, 1000], [1000, 1250], [0, 1250]]), 'forest');
}
R('bush-l', clampPath(lobed(120, 1200, 220, 110, 9, 0.12, 5), 1), 'leafDark');
R('bush-r', clampPath(lobed(890, 1210, 220, 120, 9, 0.12, 15), 1), 'leafDark');

// ---------------------------------------------------------------- leaves and berries
function sprig(id: string, pts: Pt[], w0: number, w1: number, leaves: [number, number, number][], col = 'bark') {
  R(`${id}`, band(pts, w0, w1), col);
  leaves.forEach(([t, side, len], i) => {
    const [x, y] = bandAt(pts, t);
    const tf: Xf = { rot: bandDir(pts, t) + side * 52, x, y };
    R(`${id}-leaf-${i + 1}`, clampPath(xf(leaflet(len, len * 0.3), tf)), i % 2 ? 'leafDark' : 'leaf');
    D(xf(curve([[6, 0], [len * 0.5, 1], [len * 0.9, 0]]), tf), '#2b4227', 1.2, 0.6);
  });
}
function berries(id: string, cx: number, cy: number, n: number, seed: number, stalkFrom: Pt) {
  const r = rng(seed);
  const pts: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + r.range(-0.3, 0.3);
    const rr = i === 0 ? 0 : 31 + r.range(-3, 5);
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.8]);
  }
  D(pts.map(([x, y]) => {
    const dx = stalkFrom[0] - x, dy = stalkFrom[1] - y, L = Math.hypot(dx, dy) || 1;
    return line([stalkFrom, [x + (dx / L) * 15, y + (dy / L) * 15]]);
  }).join(''), '#5a3f2c', 1.8, 0.85);
  pts.slice(1).concat([pts[0]]).forEach(([x, y], i) => {
    R(`${id}-${i + 1}`, circle(x, y, 16), 'berry');
    D(line([[x - 2, y + 10], [x + 2, y + 10]]) + line([[x, y + 8], [x, y + 12]]), '#6e1f1c', 1.2, 0.7);
  });
}
// a bough hanging in from the top left
const bough: Pt[] = [[0, 50], [90, 100], [170, 170], [230, 256]];
sprig('bough', bough, 26, 12, [[0.2, -1, 96], [0.35, 1, 90], [0.55, -1, 92], [0.7, 1, 84], [0.92, -1, 74]], 'barkDark');
berries('berries-top', 250, 316, 6, 31, [232, 258]);

// ---------------------------------------------------------------- the mossy branch
const branch: Pt[] = [[0, 936], [200, 910], [420, 890], [650, 872], [850, 840], [1010, 800]];
const twigR: Pt[] = [[800, 852], [856, 770], [900, 690], [932, 610]];
sprig('twig-r', twigR, 26, 12, [[0.25, -1, 98], [0.42, 1, 92], [0.62, -1, 88], [0.78, 1, 80], [0.98, -1, 70]]);
berries('berries-r', 944, 684, 6, 42, [916, 640]);
const twigL: Pt[] = [[270, 906], [210, 966], [150, 1016], [80, 1046]];
sprig('twig-l', twigL, 26, 12, [[0.3, 1, 96], [0.5, -1, 88], [0.72, 1, 84], [0.96, -1, 72]]);
berries('berries-l', 150, 1070, 6, 53, [160, 1020]);
R('branch', band(branch, 104, 64), 'bark');
R('branch-shade', band(branch, 34, 22, 36, 22), 'barkDark');
R('branch-knot', ellipse(250, 914, 22, 13, -8), 'barkDark');
D(curve([[30, 930], [180, 910], [330, 896]]) + curve([[600, 876], [760, 858], [900, 830]]), '#4a3324', 1.4, 0.55);
D(ellipse(250, 914, 12, 6, -8), '#3a2a1c', 1.2, 0.6);
function mossPad(id: string, x0: number, x1: number, y: number, col: string, seed: number) {
  const r = rng(seed), n = 7, top: Pt[] = [], bot: Pt[] = [];
  for (let i = 0; i <= n; i++) top.push([x0 + ((x1 - x0) * i) / n, y - r.range(4, 18) * Math.sin((Math.PI * (i + 0.5)) / (n + 1))]);
  for (let i = n; i >= 0; i--) bot.push([x0 + ((x1 - x0) * i) / n, y + 14 + (i % 3 === 1 ? r.range(12, 22) : r.range(0, 5))]);
  R(id, clampPath(blob([...top, ...bot], 0.85), 2), col);
}
mossPad('moss-1', 40, 220, 862, 'moss', 7);
mossPad('moss-2', 620, 780, 828, 'leaf', 8);
mossPad('moss-3', 860, 990, 790, 'moss', 9);

// ---------------------------------------------------------------- the owl
R('owl-tail', blob([[462, 860], [538, 860], [556, 936], [500, 956], [444, 936]], 1), 'owlDark');
R('owl-body', blob([[500, 560], [600, 600], [652, 700], [642, 800], [592, 872], [500, 892], [408, 872], [358, 800], [348, 700], [400, 600]], 1), 'owl');
const wingL: Pt[] = [[376, 612], [342, 700], [344, 800], [380, 872], [436, 894], [424, 800], [412, 700], [404, 640]];
R('owl-wing-l', blob(wingL, 1), 'owlDark');
R('owl-wing-r', blob(wingL.map(([x, y]) => [1000 - x, y] as Pt), 1), 'owlDark');
{
  let f = '';
  for (const s of [-1, 1]) {
    const X = (x: number) => (s < 0 ? x : 1000 - x);
    f += curve([[X(356), 740], [X(380), 752], [X(406), 744]]) + curve([[X(360), 790], [X(386), 804], [X(414), 796]]) + curve([[X(372), 840], [X(398), 852], [X(424), 846]]);
  }
  D(f, '#c79c6d', 1.6, 0.7);
}
R('owl-belly', blob([[500, 640], [566, 680], [588, 770], [562, 850], [500, 878], [438, 850], [412, 770], [434, 680]], 1), 'buff');
{
  let st = '';
  for (const [x, y] of [[470, 690], [530, 690], [450, 740], [500, 740], [550, 740], [470, 790], [530, 790], [500, 836], [452, 830], [548, 830]] as Pt[]) st += line([[x - 7, y - 6], [x, y + 4], [x + 7, y - 6]]);
  D(st, '#7a5236', 1.8, 0.75);
}
R('owl-foot-l', blob([[440, 870], [490, 870], [498, 896], [488, 906], [468, 900], [448, 906], [436, 896]], 0.9), 'gold');
R('owl-foot-r', blob([[510, 870], [560, 870], [564, 896], [552, 906], [532, 900], [512, 906], [502, 896]], 0.9), 'gold');
D(curve([[440, 900], [438, 910], [444, 914]]) + curve([[466, 902], [466, 912], [472, 916]]) + curve([[490, 900], [492, 910], [498, 912]]) + curve([[506, 900], [506, 910], [512, 914]]) + curve([[532, 902], [532, 912], [538, 916]]) + curve([[556, 900], [560, 910], [566, 912]]), '#2e2420', 2.4, 0.9);
R('owl-tuft-l', blob([[384, 476], [368, 386], [384, 380], [446, 440]], 0.5), 'owlDark');
R('owl-tuft-r', blob([[616, 476], [632, 386], [616, 380], [554, 440]], 0.5), 'owlDark');
R('owl-head', ellipse(500, 522, 142, 118), 'owl');
D(curve([[400, 440], [440, 420], [480, 414]]) + curve([[600, 440], [560, 420], [520, 414]]), '#7a5236', 1.4, 0.6);
R('owl-face', blob([[500, 452], [540, 432], [600, 446], [626, 510], [600, 580], [550, 610], [500, 626], [450, 610], [400, 580], [374, 510], [400, 446], [460, 432]], 1), 'buff');
D(curve([[408, 584], [384, 520], [404, 452], [460, 436], [500, 456], [540, 436], [596, 452], [616, 520], [592, 584]]), '#7a5236', 2, 0.7);
R('owl-ring-l', circle(446, 522, 44), 'peach');
R('owl-ring-r', circle(554, 522, 44), 'peach');
R('owl-brow', blob([[500, 466], [524, 446], [514, 520], [500, 554], [486, 520], [476, 446]], 0.8), 'owlDark');
R('owl-iris-l', circle(446, 524, 30), 'gold');
R('owl-iris-r', circle(554, 524, 30), 'gold');
R('owl-pupil-l', circle(448, 526, 14), 'ink');
R('owl-pupil-r', circle(552, 526, 14), 'ink');
D(circle(454, 519, 3) + circle(558, 519, 3), '#fffaf0', 2.4, 0.95);
R('owl-beak', blob([[486, 562], [514, 562], [508, 598], [500, 610], [492, 598]], 0.8), 'moonShade');

// foreground ferns
fern(R, D, 'fern-l', [[110, 1250], [170, 1176], [262, 1138], [372, 1132]], 4, 92, 'leaf', 'moss', 'leaf', '#22361f');
fern(R, D, 'fern-r', [[1000, 1246], [930, 1168], [830, 1128], [716, 1130]], 5, 100, 'moss', 'leaf', 'leaf', '#22361f');

// fireflies over the low forest
[[300, 1000], [700, 990], [560, 1080], [820, 1110], [420, 1150]].forEach(([x, y]) => D(circle(x, y, 3.2), '#fff3c4', 2.2, 0.9));

const activity: PaintActivity = {
  id: 'woodland-paint-3', version: 1, mode: 'paint',
  title: 'Owl at Dusk',
  blurb: 'A tawny owl keeps watch from a mossy rowan branch as a great pale moon rises over the woods.',
  collectionId: 'woodland',
  categories: ['Woodland', 'Birds'],
  difficulty: 'Moderate',
  width: W, height: H,
  palette: [
    { id: 'night', number: 1, name: 'Evening blue', hex: '#3e4d70' },
    { id: 'dusk', number: 2, name: 'Dusk blue', hex: '#6c80a4' },
    { id: 'duskLight', number: 3, name: 'Lavender haze', hex: '#aab4cf' },
    { id: 'peach', number: 4, name: 'Afterglow', hex: '#efc9a4' },
    { id: 'moon', number: 5, name: 'Moonlight', hex: '#f6edd2' },
    { id: 'moonShade', number: 6, name: 'Moon shadow', hex: '#e0cfa4' },
    { id: 'forest', number: 7, name: 'Night forest', hex: '#2f4846' },
    { id: 'bark', number: 8, name: 'Bark', hex: '#7e5a3e' },
    { id: 'barkDark', number: 9, name: 'Dark bark', hex: '#553b29' },
    { id: 'moss', number: 10, name: 'Moss', hex: '#829c4e' },
    { id: 'leaf', number: 11, name: 'Leaf green', hex: '#5f8a45' },
    { id: 'leafDark', number: 12, name: 'Deep green', hex: '#3a5c33' },
    { id: 'berry', number: 13, name: 'Rowan red', hex: '#cf4535' },
    { id: 'owl', number: 14, name: 'Tawny', hex: '#a7744a' },
    { id: 'owlDark', number: 15, name: 'Umber', hex: '#6d4a30' },
    { id: 'buff', number: 16, name: 'Buff', hex: '#e6cda1' },
    { id: 'gold', number: 17, name: 'Amber', hex: '#eab23c' },
    { id: 'ink', number: 18, name: 'Charcoal', hex: '#2e2a2c' },
  ],
  regions,
  detail,
};
export default activity;
