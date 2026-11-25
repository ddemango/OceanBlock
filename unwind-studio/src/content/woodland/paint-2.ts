import { blob, circle, curve, ellipse, line, poly, rect, xf, type Xf } from '../../art/kit';
import type { Pt } from '../../art/geometry';
import type { PaintActivity } from '../types';
import { W, H, band, canvas, clampPath, edged, fern, lobed, sample } from './props-paint';

const { regions, detail, R, D } = canvas();

/** Round-topped arch: semicircle of radius r centred at (cx, cy), straight sides down to `bottom`. */
function arch(cx: number, cy: number, r: number, bottom: number): string {
  const pts: Pt[] = [[cx + r, bottom]];
  for (let i = 0; i <= 18; i++) {
    const a = (i / 18) * Math.PI;
    pts.push([cx + Math.cos(a) * r, cy - Math.sin(a) * r]);
  }
  pts.push([cx - r, bottom]);
  return poly(pts);
}

// ---------------------------------------------------------------- sky and distant wood
R('sky', rect(0, 0, W, H), 'sky');
R('cloud-1', blob([[330, 180], [380, 150], [450, 140], [520, 156], [600, 150], [640, 176], [580, 196], [460, 200], [360, 198]], 1), 'cream');
R('cloud-2', blob([[60, 256], [110, 232], [180, 230], [230, 250], [190, 268], [100, 270]], 1), 'peach');
R('horizon', edged([[0, 520], [200, 500], [420, 530], [640, 500], [860, 520], [1000, 506]], [[1000, 900], [0, 900]]), 'peach');
{
  // a row of distant fir tops
  const pts: Pt[] = [[0, 600]];
  const hs = [70, 40, 96, 60, 84, 50, 110, 66, 80, 46, 100, 58, 76];
  for (let i = 0; i < hs.length; i++) {
    const x = 40 + i * 76;
    pts.push([x - 26, 596 - hs[i] * 0.35], [x, 596 - hs[i]], [x + 26, 596 - hs[i] * 0.35], [x + 38, 600]);
  }
  R('far-wood', poly([...pts.map(([x, y]) => [Math.min(1000, x), y] as Pt), [1000, 600], [1000, 900], [0, 900]]), 'dusk');
  const p2: Pt[] = [];
  for (let i = 0; i <= 14; i++) p2.push([i * 72, 680 - (i % 2 ? 40 : 0) - (i % 3 === 0 ? 14 : 0)]);
  R('mid-wood', edged(p2, [[1000, 900], [0, 900]]), 'fernDark');
}

// ---------------------------------------------------------------- giant toadstool behind the cottage
function giant(id: string, stem: Pt[], sw0: number, sw1: number, cx: number, capY: number, w: number, h: number, spots: [number, number, number][]) {
  R(`${id}-gills`, blob([[cx - w * 0.47, capY + 4], [cx, capY - 10], [cx + w * 0.47, capY + 4], [cx + w * 0.3, capY + h * 0.22], [cx, capY + h * 0.28], [cx - w * 0.3, capY + h * 0.22]], 1), 'sand');
  const g: string[] = [];
  for (let i = -4; i <= 4; i++) g.push(line([[cx + i * w * 0.035, capY + h * 0.08], [cx + i * w * 0.075, capY + h * 0.2]]));
  D(g.join(''), '#a8875e', 1.2, 0.6);
  R(`${id}-stem`, band(stem, sw0, sw1), 'cream');
  R(`${id}-stem-shade`, band(stem, sw0 * 0.3, sw1 * 0.3, -sw0 * 0.33, -sw1 * 0.33, 0, 0.9), 'sand');
  R(`${id}-cap`, clampPath(blob([[cx - w / 2, capY + 8], [cx - w * 0.45, capY - h * 0.45], [cx - w * 0.25, capY - h * 0.85], [cx, capY - h], [cx + w * 0.25, capY - h * 0.85], [cx + w * 0.45, capY - h * 0.45], [cx + w / 2, capY + 8], [cx, capY - 4]], 1)), 'red');
  R(`${id}-cap-shade`, blob([[cx - w / 2 + 6, capY + 4], [cx - w * 0.2, capY - h * 0.16], [cx + w * 0.2, capY - h * 0.16], [cx + w / 2 - 6, capY + 4], [cx, capY - 2]], 1), 'redDark');
  spots.forEach(([sx, sy, r], i) => R(`${id}-spot-${i + 1}`, ellipse(cx + sx * w, capY - sy * h, r, r * 0.72, sx * 30), 'cream'));
}
giant('toad-r', [[812, 830], [800, 600], [790, 420]], 86, 66, 790, 410, 350, 200,
  [[-0.27, 0.42, 26], [-0.02, 0.74, 30], [0.25, 0.5, 24], [0.38, 0.18, 14]]);

// ---------------------------------------------------------------- the cottage
R('chimney', rect(612, 440, 54, 120), 'stone');
R('chimney-cap', rect(602, 424, 74, 24, 4), 'bark');
D(line([[612, 478], [666, 478]]) + line([[612, 514], [666, 514]]) + line([[638, 448], [638, 478]]) + line([[624, 478], [624, 514]]) + line([[652, 514], [652, 550]]), '#7c7364', 1.3, 0.6);
R('smoke-1', circle(606, 392, 17), 'cream');
R('smoke-2', circle(582, 346, 23), 'cream');
R('smoke-3', circle(550, 292, 30), 'cream');
R('wall', rect(376, 610, 290, 226, 26), 'wall');
D(ellipse(400, 690, 14, 9) + ellipse(650, 660, 12, 8) + ellipse(392, 790, 12, 8) + ellipse(646, 790, 14, 9) + ellipse(470, 646, 10, 7), '#b9a27c', 1.3, 0.7);
R('foundation', rect(368, 806, 306, 38, 14), 'stone');
D(line([[420, 806], [420, 844]]) + line([[470, 806], [470, 844]]) + line([[580, 806], [580, 844]]) + line([[630, 806], [630, 844]]), '#7c7364', 1.3, 0.6);
R('roof', blob([[318, 670], [336, 600], [392, 522], [468, 470], [540, 454], [620, 476], [690, 548], [722, 640], [706, 676], [620, 664], [520, 660], [420, 666]], 1), 'thatch');
{
  let th = '';
  for (let i = 0; i < 13; i++) {
    const x = 350 + i * 28;
    th += curve([[520 + (x - 520) * 0.25, 476], [520 + (x - 520) * 0.7, 560], [x, 650]]);
  }
  D(th, '#9b7637', 1.3, 0.55);
}
R('roof-eave', blob([[316, 668], [420, 652], [520, 648], [620, 652], [724, 664], [718, 698], [620, 688], [520, 686], [420, 690], [324, 700]], 1), 'thatchDark');
R('dormer-frame', circle(520, 560, 42), 'bark');
R('dormer-glass', circle(520, 560, 29), 'glow');
D(line([[520, 531], [520, 589]]) + line([[491, 560], [549, 560]]), '#5a3f2c', 2.2, 0.85);
R('dormer-brow', blob([[466, 540], [490, 504], [520, 494], [550, 504], [574, 540], [548, 524], [520, 516], [492, 524]], 0.9), 'thatchDark');
// round door
R('door-frame', arch(520, 760, 70, 836), 'stone');
R('door', arch(520, 760, 52, 836), 'bark');
D(line([[502, 712], [502, 836]]) + line([[520, 708], [520, 836]]) + line([[538, 712], [538, 836]]), '#5a3f2c', 1.4, 0.6);
D(curve([[452, 760], [462, 712], [496, 692]]) + curve([[588, 760], [578, 712], [544, 692]]), '#7c7364', 1.2, 0.5);
R('door-knob', circle(552, 792, 7), 'glow');
// windows
for (const [id, x] of [['window-l', 430], ['window-r', 612]] as [string, number][]) {
  R(`${id}-frame`, circle(x, 730, 38), 'bark');
  R(`${id}-glass`, circle(x, 730, 26), 'glow');
  D(line([[x, 704], [x, 756]]) + line([[x - 26, 730], [x + 26, 730]]), '#5a3f2c', 2.2, 0.85);
  R(`${id}-box`, rect(x - 40, 770, 80, 20, 5), 'thatchDark');
}
D(circle(422, 766, 6) + circle(438, 764, 6) + circle(604, 766, 6) + circle(620, 764, 6), '#c8423a', 3, 0.9);
R('step', ellipse(520, 848, 84, 16), 'stone');
R('bush-l', lobed(352, 818, 64, 46, 7, 0.14, 10), 'fern');
R('bush-r', lobed(698, 822, 62, 44, 7, 0.14, 30), 'fernDark');

// ---------------------------------------------------------------- ground and winding path
R('ground', edged([[0, 840], [200, 820], [350, 846], [700, 850], [850, 826], [1000, 838]], [[1000, 1250], [0, 1250]]), 'mossLight');
R('bank-l', edged([[0, 980], [150, 952], [300, 990], [380, 1040]], [[374, 1064], [420, 1180], [460, 1250], [0, 1250]]), 'moss');
R('bank-r', edged([[1000, 980], [860, 962], [720, 970], [620, 1010]], [[530, 1060], [560, 1140], [630, 1200], [740, 1250], [1000, 1250]]), 'moss');
const pathL: Pt[] = [[488, 846], [496, 890], [452, 940], [392, 1000], [360, 1070], [376, 1140], [420, 1200], [440, 1250]];
const pathR: Pt[] = [[780, 1250], [660, 1180], [566, 1120], [540, 1066], [566, 1000], [612, 940], [592, 880], [556, 846]];
R('path', poly([...sample(pathL, 8), ...sample(pathR, 8)]), 'sand');
D(curve([[470, 900], [520, 910], [560, 900]]) + curve([[430, 1010], [480, 1020], [520, 1010]]) + curve([[450, 1120], [520, 1134], [590, 1124]]), '#b59a6e', 1.2, 0.5);
[[542, 898, 28, 12], [488, 986, 38, 15], [452, 1086, 44, 17], [548, 1190, 56, 20]].forEach(([x, y, rx, ry], i) => R(`path-stone-${i + 1}`, ellipse(x, y, rx, ry, -8), 'stone'));

// ---------------------------------------------------------------- giant toadstool in front (left)
giant('toad-l', [[196, 1040], [206, 820], [232, 620], [236, 530]], 120, 84, 228, 520, 410, 210,
  [[-0.28, 0.42, 30], [0.02, 0.76, 34], [0.28, 0.5, 26], [-0.4, 0.12, 16], [0.12, 0.3, 20]]);

R('toad-l-tuft', lobed(206, 1040, 116, 36, 9, 0.24, 0), 'fern');

// ---------------------------------------------------------------- small toadstools and flowers
function toadstool(id: string, cx: number, base: number, h: number, w: number, rot: number, spot: boolean) {
  const t: Xf = { rot, x: cx, y: base };
  R(`${id}-stem`, xf(blob([[-w * 0.16, 0], [-w * 0.12, -h * 0.6], [-w * 0.1, -h], [w * 0.1, -h], [w * 0.12, -h * 0.6], [w * 0.18, 0]], 0.6), t), 'cream');
  R(`${id}-cap`, xf(blob([[-w * 0.52, -h * 0.9], [-w * 0.4, -h * 1.28], [0, -h * 1.5], [w * 0.4, -h * 1.28], [w * 0.52, -h * 0.9], [0, -h * 0.98]], 1), t), 'red');
  if (spot) R(`${id}-spot`, xf(ellipse(-w * 0.12, -h * 1.28, w * 0.09, w * 0.065), t), 'cream');
}
toadstool('shroom-a', 800, 1034, 62, 96, -4, true);
toadstool('shroom-b', 870, 1044, 44, 70, 10, true);
toadstool('shroom-c', 740, 1046, 32, 52, -14, false);

function flower(id: string, cx: number, cy: number, r: number, col: string, rot: number) {
  R(`${id}`, lobed(cx, cy, r, r, 5, 0.38, rot), col);
  R(`${id}-eye`, circle(cx, cy, r * 0.34), 'glow');
}
const flowers: [number, number, number, string][] = [
  [392, 880, 22, 'blue'], [330, 960, 24, 'cream'], [372, 1040, 26, 'blue'], [286, 1110, 28, 'cream'], [350, 1190, 30, 'blue'],
  [640, 892, 22, 'cream'], [668, 966, 24, 'blue'], [690, 1100, 28, 'cream'], [770, 1170, 30, 'blue'],
];
flowers.forEach(([x, y, r, c], i) => flower(`flower-${i + 1}`, x, y, r, c, i * 17));

// ---------------------------------------------------------------- foreground ferns
fern(R, D, 'fern-l', [[0, 1250], [30, 1140], [96, 1062], [180, 1020]], 5, 104, 'fern', 'fernDark', 'moss');
fern(R, D, 'fern-r', [[1000, 1236], [930, 1176], [850, 1170], [770, 1206]], 4, 84, 'fernDark', 'fern', 'moss');
for (const [x, y] of [[120, 900], [480, 1230], [930, 900], [260, 1000], [560, 1040]] as Pt[]) D(line([[x, y], [x - 6, y - 18]]) + line([[x + 6, y], [x + 6, y - 22]]) + line([[x + 12, y], [x + 18, y - 16]]), '#56702f', 1.6, 0.7);
[[120, 200], [300, 120], [880, 150], [560, 90], [940, 300]].forEach(([x, y]) => D(line([[x - 5, y], [x + 5, y]]) + line([[x, y - 5], [x, y + 5]]), '#fffaf0', 1.6, 0.8));

const activity: PaintActivity = {
  id: 'woodland-paint-2', version: 1, mode: 'paint',
  title: 'Toadstool Cottage',
  blurb: 'A tiny round-doored cottage glows at dusk between two giant toadstools, with a winding path lined in flowers.',
  collectionId: 'woodland',
  categories: ['Woodland', 'Cozy', 'Architecture'],
  difficulty: 'Moderate',
  width: W, height: H,
  palette: [
    { id: 'sky', number: 1, name: 'Dusk sky', hex: '#c9dbe4' },
    { id: 'peach', number: 2, name: 'Peach glow', hex: '#f1cfa8' },
    { id: 'dusk', number: 3, name: 'Distant blue', hex: '#8ca2b6' },
    { id: 'fernDark', number: 4, name: 'Deep fern', hex: '#3c5a2c' },
    { id: 'fern', number: 5, name: 'Fern green', hex: '#5c7f3b' },
    { id: 'moss', number: 6, name: 'Moss', hex: '#829d50' },
    { id: 'mossLight', number: 7, name: 'Pale moss', hex: '#b8c886' },
    { id: 'red', number: 8, name: 'Toadstool red', hex: '#cc463b' },
    { id: 'redDark', number: 9, name: 'Deep red', hex: '#93302b' },
    { id: 'cream', number: 10, name: 'Cream', hex: '#f7eed9' },
    { id: 'sand', number: 11, name: 'Sand', hex: '#dcc39a' },
    { id: 'wall', number: 12, name: 'Limewash', hex: '#ecdcbd' },
    { id: 'thatch', number: 13, name: 'Thatch', hex: '#cda35a' },
    { id: 'thatchDark', number: 14, name: 'Old straw', hex: '#9c7438' },
    { id: 'bark', number: 15, name: 'Oak brown', hex: '#7a5338' },
    { id: 'stone', number: 16, name: 'Stone grey', hex: '#a9a193' },
    { id: 'glow', number: 17, name: 'Firelight', hex: '#f4c04e' },
    { id: 'blue', number: 18, name: 'Bluebell', hex: '#7f99d1' },
  ],
  regions,
  detail,
};
export default activity;
