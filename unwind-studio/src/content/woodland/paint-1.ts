import { blob, circle, curve, ellipse, line, poly, rng, xf, type Xf } from '../../art/kit';
import type { Pt } from '../../art/geometry';
import type { PaintActivity } from '../types';
import { W, H, band, bandAt, canvas, clampPath, edged, fern, leaflet, lobed } from './props-paint';

const { regions, detail, R, D } = canvas();

// ---------------------------------------------------------------- sky, glow and distant wood
R('sky', poly([[0, 0], [W, 0], [W, H], [0, H]]), 'sky');
R('glow', circle(610, 540, 150), 'peach');
R('far-wood', edged([[0, 560], [70, 530], [130, 552], [200, 515], [280, 548], [360, 530], [450, 556], [540, 528], [600, 560], [700, 524], [790, 552], [870, 520], [940, 546], [1000, 530]], [[1000, 820], [0, 820]]), 'dusk');

// ---------------------------------------------------------------- tree trunks
function trunk(id: string, x0: number, x1: number, b0: number, b1: number, baseY: number) {
  R(`${id}`, poly([[x0, 0], [x1, 0], [b1, baseY], [b0, baseY]]), 'bark');
  const k = 0.68;
  R(`${id}-shade`, poly([[x0 + (x1 - x0) * k, 0], [x1, 0], [b1, baseY], [b0 + (b1 - b0) * k, baseY]]), 'barkDark');
  D(curve([[x0 + (x1 - x0) * 0.3, 260], [b0 + (b1 - b0) * 0.28, 420], [b0 + (b1 - b0) * 0.34, 600]]), '#4a3324', 1.4, 0.5);
}
trunk('trunk-1', 30, 140, 14, 160, 760);
trunk('trunk-2', 296, 340, 288, 350, 740);
trunk('trunk-3', 758, 808, 750, 820, 740);
trunk('trunk-4', 905, 1000, 890, 1000, 760);

// ---------------------------------------------------------------- canopy
R('canopy', edged([[0, 214], [90, 172], [200, 196], [310, 140], [430, 172], [560, 118], [690, 162], [800, 120], [910, 176], [1000, 146]], [[1000, 0], [0, 0]]), 'fernDark');
R('canopy-clump-1', lobed(206, 214, 66, 44, 7, 0.16, 10), 'fern');
R('canopy-clump-2', lobed(536, 184, 74, 46, 8, 0.16, 0), 'fern');
R('canopy-clump-3', lobed(878, 190, 66, 46, 7, 0.16, 20), 'fern');

// ---------------------------------------------------------------- ground behind
R('ground', edged([[0, 742], [200, 722], [420, 736], [650, 716], [850, 730], [1000, 716]], [[1000, 1250], [0, 1250]]), 'mossLight');

// ---------------------------------------------------------------- foxgloves (behind the log)
function foxglove(id: string, x: number, baseY: number, topY: number, lean: number, lt = 0.24) {
  const stem: Pt[] = [[x, baseY], [x + lean * 0.5, (baseY + topY) / 2], [x + lean, topY]];
  R(`${id}-leaf-a`, xf(leaflet(130, 30), { rot: -150, x: x - 4, y: baseY - 40 }), 'fern');
  R(`${id}-leaf-b`, xf(leaflet(124, 28), { rot: -32, x: x + 4, y: baseY - 52 }), 'fernDark');
  R(`${id}-stem`, band(stem, 22, 14), 'moss', bandAt(stem, lt));
  const n = 5;
  for (let i = 0; i < n; i++) {
    const t = 0.36 + (i / (n - 1)) * 0.46;
    const [px, py] = bandAt(stem, t);
    const s = 64 - i * 6;
    const side = i % 2 ? -1 : 1;
    const bell = blob([[0, -4], [s * 0.5, -s * 0.2], [s * 0.95, s * 0.2], [s * 1.12, s * 0.72], [s * 0.8, s * 0.9], [s * 0.52, s * 0.64], [s * 0.12, s * 0.28]], 1);
    const t2: Xf = { sx: side, x: px, y: py };
    R(`${id}-bell-${i + 1}`, xf(bell, t2), i % 3 === 1 ? 'gloveLight' : 'glove');
    D(xf(curve([[s * 0.86, s * 0.72], [s * 0.96, s * 0.6], [s * 1.04, s * 0.7]]), t2), '#8a3f66', 1.2, 0.6);
    D(xf(circle(s * 0.82, s * 0.56, 2) + circle(s * 0.7, s * 0.5, 1.6), t2), '#7a2f55', 1.2, 0.7);
  }
  const [bx, by] = bandAt(stem, 0.93);
  R(`${id}-bud-1`, ellipse(bx + 12, by + 8, 14, 9, 30), 'mossLight');
}
foxglove('glove-l', 232, 740, 300, -20);
foxglove('glove-r', 870, 720, 340, 18, 0.3);

// ---------------------------------------------------------------- mossy log
const DY = 46;
const logPts: Pt[] = [[150, 690 + DY], [520, 676 + DY], [1010, 646 + DY]];
R('log', band(logPts, 132, 118), 'bark');
R('log-shade', band(logPts, 40, 36, 46, 40, 0.04, 1), 'barkDark');
D(xf(curve([[240, 660], [420, 652], [600, 642]]) + curve([[300, 700], [480, 692], [640, 684]]) + curve([[700, 640], [860, 630], [990, 620]]), { y: DY }), '#4a3324', 1.5, 0.55);
R('log-end', ellipse(150, 690 + DY, 48, 66), 'cream');
R('log-ring', ellipse(150, 690 + DY, 33, 46), 'bark');
R('log-ring-2', ellipse(150, 690 + DY, 20, 28), 'cream');
R('log-heart', ellipse(150, 690 + DY, 8, 11), 'barkDark');
D(ellipse(150, 690 + DY, 41, 56) + ellipse(150, 690 + DY, 27, 37), '#a07c5a', 1.2, 0.6);
function mossPad(id: string, x0: number, x1: number, y: number, col: string, seed: number) {
  const r = rng(seed), n = 7, top: Pt[] = [], bot: Pt[] = [];
  for (let i = 0; i <= n; i++) top.push([x0 + ((x1 - x0) * i) / n, y - r.range(4, 20) * Math.sin((Math.PI * (i + 0.5)) / (n + 1))]);
  for (let i = n; i >= 0; i--) bot.push([x0 + ((x1 - x0) * i) / n, y + 16 + (i % 3 === 1 ? r.range(14, 26) : r.range(0, 6))]);
  R(id, clampPath(blob([...top, ...bot], 0.85), 2), col);
}
mossPad('log-moss-1', 210, 470, 628 + DY, 'moss', 11);
mossPad('log-moss-2', 560, 770, 616 + DY, 'mossLight', 12);
mossPad('log-moss-3', 820, 990, 602 + DY, 'moss', 13);
R('log-moss-end', blob([[104, 640 + DY], [130, 616 + DY], [176, 616 + DY], [200, 640 + DY], [176, 652 + DY], [150, 636 + DY], [122, 652 + DY]], 0.9), 'mossLight');

// ---------------------------------------------------------------- toadstools
function toadstool(id: string, cx: number, base: number, h: number, w: number, rot: number, spots: Pt[]) {
  const t: Xf = { rot, x: cx, y: base };
  R(`${id}-stem`, xf(blob([[-w * 0.15, 0], [-w * 0.12, -h * 0.6], [-w * 0.1, -h], [w * 0.1, -h], [w * 0.12, -h * 0.6], [w * 0.17, 0]], 0.6), t), 'cream');
  R(`${id}-cap`, xf(blob([[-w * 0.52, -h * 0.9], [-w * 0.4, -h * 1.28], [0, -h * 1.5], [w * 0.4, -h * 1.28], [w * 0.52, -h * 0.9], [0, -h * 0.98]], 1), t), 'red');
  spots.forEach(([sx, sy], i) => R(`${id}-spot-${i + 1}`, xf(ellipse(sx * w, -h * sy, w * 0.075, w * 0.055), t), 'cream'));
  D(xf(curve([[-w * 0.4, -h * 0.94], [0, -h * 1.02], [w * 0.4, -h * 0.94]]), t), '#7a2420', 1.2, 0.6);
}
toadstool('shroom-a', 836, 884, 74, 110, 4, [[-0.18, 1.3], [0.2, 1.22]]);
toadstool('shroom-b', 912, 900, 50, 76, 12, [[0.05, 1.3]]);
toadstool('shroom-c', 952, 918, 36, 56, 8, []);

// ---------------------------------------------------------------- the sleeping fox
{
  const F = (id: string, d: string, c: string) => R(`fox-${id}`, xf(d, { y: DY }), c);
  const FD = (d: string, c: string, w: number, o: number) => D(xf(d, { y: DY }), c, w, o);
  const head: Xf = { s: 1.18, ox: 360, oy: 790, y: DY - 6 };
  R('fox-ear-far', xf(blob([[400, 756], [440, 676], [462, 686], [474, 770]], 0.4), head), 'foxDark');
  F('body', blob([[320, 800], [372, 714], [500, 664], [640, 674], [736, 738], [752, 820], [690, 872], [520, 884], [380, 866]], 1), 'fox');
  FD(curve([[590, 820], [604, 748], [664, 716], [724, 748]]), '#8c4318', 1.6, 0.6);
  FD(curve([[450, 716], [520, 698], [590, 700]]) + curve([[470, 746], [540, 730], [600, 734]]) + curve([[420, 780], [480, 770], [540, 776]]), '#a9531f', 1.2, 0.5);
  const tail: Pt[] = [[700, 806], [722, 884], [620, 934], [480, 944], [360, 926], [282, 892]];
  const tl = tail.map(([x, y]) => [x, y + DY] as Pt);
  R('fox-tail', band(tl, 104, 50), 'fox');
  R('fox-tail-shade', band(tl, 30, 18, -46, -26, 0.06, 0.74), 'foxDark');
  const a = bandAt(tl, 0.8, 33), b = bandAt(tl, 0.8, -33), c = bandAt(tl, 0.97, 24), d = bandAt(tl, 0.97, -24);
  R('fox-tail-tip', blob([a, c, [240, 918], d, b], 0.8), 'cream');
  F('haunch', blob([[596, 846], [660, 812], [714, 770], [744, 804], [722, 858], [650, 874]], 1), 'foxDark');
  FD(curve([[690, 900], [610, 926], [530, 932]]) + curve([[470, 936], [400, 926], [350, 912]]), '#a9531f', 1.2, 0.5);
  FD(curve([[290, 880], [262, 888], [240, 884]]) + curve([[300, 900], [270, 908], [246, 904]]), '#c7a983', 1.2, 0.7);
  F('paw', blob([[420, 866], [462, 858], [492, 872], [480, 890], [430, 890]], 1), 'ink');
  R('fox-head', xf(blob([[290, 758], [350, 728], [420, 736], [456, 782], [436, 832], [382, 852], [320, 846], [270, 836], [252, 816], [270, 786]], 1), head), 'fox');
  R('fox-muzzle', xf(blob([[252, 818], [286, 806], [334, 812], [376, 832], [398, 856], [350, 860], [290, 850]], 1), head), 'cream');
  R('fox-nose', xf(circle(258, 822, 9), head), 'ink');
  R('fox-ear', xf(blob([[336, 746], [364, 662], [380, 664], [414, 740]], 0.4), head), 'foxDark');
  R('fox-ear-inner', xf(blob([[354, 738], [368, 690], [394, 734]], 0.4), head), 'cream');
  D(xf(curve([[302, 786], [316, 796], [334, 792]]), head), '#2e2420', 2.6, 0.9);
  D(xf(line([[312, 795], [308, 803]]) + line([[322, 797], [322, 805]]), head), '#2e2420', 1.2, 0.7);
  D(xf(curve([[410, 770], [430, 800], [424, 830]]), head), '#a9531f', 1.2, 0.5);
  D(xf(curve([[268, 830], [290, 838], [312, 836]]), head), '#c7a983', 1.2, 0.6);
}

// ---------------------------------------------------------------- foreground moss and ferns
R('ground-front', edged([[0, 1050], [250, 1024], [500, 1044], [750, 1022], [1000, 1036]], [[1000, 1250], [0, 1250]]), 'moss');
D(curve([[420, 1100], [500, 1090], [580, 1106]]) + curve([[480, 1170], [560, 1160], [640, 1174]]) + curve([[600, 1220], [680, 1210], [760, 1224]]), '#56702f', 1.4, 0.55);
for (const [x, y] of [[470, 1080], [560, 1140], [660, 1100], [400, 1200], [720, 1180]] as Pt[]) D(line([[x, y], [x - 6, y - 18]]) + line([[x + 6, y], [x + 6, y - 22]]) + line([[x + 12, y], [x + 18, y - 16]]), '#4d6a2a', 1.6, 0.7);
fern(R, D, 'fern-l1', [[60, 1250], [80, 1120], [140, 1010], [214, 962]], 6, 118, 'fern', 'fernDark', 'moss');
fern(R, D, 'fern-l2', [[0, 1212], [110, 1172], [230, 1170], [360, 1206]], 5, 96, 'fernDark', 'fern', 'moss');
fern(R, D, 'fern-r1', [[950, 1250], [920, 1110], [850, 1000], [748, 944]], 6, 118, 'fern', 'fernDark', 'moss');

// distant birds
D(curve([[440, 300], [452, 292], [462, 300]]) + curve([[462, 300], [472, 292], [484, 300]]) + curve([[500, 330], [508, 324], [516, 330]]) + curve([[516, 330], [524, 324], [532, 330]]), '#5d6f86', 1.8, 0.8);

// fireflies
[[520, 420], [700, 360], [430, 560], [130, 470], [930, 470], [600, 610]].forEach(([x, y]) => D(circle(x, y, 3.2), '#fff3c4', 2.2, 0.9));

const activity: PaintActivity = {
  id: 'woodland-paint-1', version: 1, mode: 'paint',
  title: 'Fox in the Ferns',
  blurb: 'A red fox sleeps curled beside a mossy log as dusk settles over the foxgloves and ferns.',
  collectionId: 'woodland',
  categories: ['Woodland', 'Animals', 'Flowers'],
  difficulty: 'Moderate',
  width: W, height: H,
  palette: [
    { id: 'sky', number: 1, name: 'Dusk sky', hex: '#cbd8e4' },
    { id: 'dusk', number: 2, name: 'Twilight blue', hex: '#8ea5bf' },
    { id: 'cream', number: 3, name: 'Cream', hex: '#f6ecd4' },
    { id: 'mossLight', number: 4, name: 'Pale moss', hex: '#b7c684' },
    { id: 'moss', number: 5, name: 'Moss', hex: '#809b4f' },
    { id: 'fern', number: 6, name: 'Fern green', hex: '#5c7f3b' },
    { id: 'fernDark', number: 7, name: 'Deep fern', hex: '#3c5a2c' },
    { id: 'bark', number: 8, name: 'Bark', hex: '#8a6243' },
    { id: 'barkDark', number: 9, name: 'Dark bark', hex: '#5a3f2c' },
    { id: 'fox', number: 10, name: 'Fox orange', hex: '#dc7a30' },
    { id: 'foxDark', number: 11, name: 'Russet', hex: '#a6511f' },
    { id: 'peach', number: 12, name: 'Dusk peach', hex: '#f2cda6' },
    { id: 'glove', number: 13, name: 'Foxglove', hex: '#c46f9d' },
    { id: 'gloveLight', number: 14, name: 'Pale foxglove', hex: '#e9b3cf' },
    { id: 'red', number: 15, name: 'Toadstool red', hex: '#c8423a' },
    { id: 'ink', number: 16, name: 'Charcoal', hex: '#3a2e2a' },
  ],
  regions,
  detail,
};
export default activity;
