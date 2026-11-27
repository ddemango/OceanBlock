import { rect, ellipse, circle, poly, blob, leaf, star, sector, curve, line, xf } from '../../art/kit';
import type { PaintActivity, PaletteColor } from '../types';
import { canvas, sample, above, below, ribbon, cloud, inset, fish, M, Q, type Pt } from './props-paint';

const W = 1000, H = 1250;

const palette: PaletteColor[] = [
  { id: 'light', number: 1, name: 'Surface light', hex: '#c9ecea' },
  { id: 'w1', number: 2, name: 'Lagoon', hex: '#8fd1d6' },
  { id: 'w2', number: 3, name: 'Open water', hex: '#58acc6' },
  { id: 'w3', number: 4, name: 'Deep blue', hex: '#2f7ea8' },
  { id: 'skin', number: 5, name: 'Turtle green', hex: '#86b37a' },
  { id: 'skinD', number: 6, name: 'Moss', hex: '#4c7d58' },
  { id: 'skinL', number: 7, name: 'Pale belly', hex: '#d5e2ab' },
  { id: 'shellD', number: 8, name: 'Shell brown', hex: '#5a4230' },
  { id: 'shellM', number: 9, name: 'Amber', hex: '#b8793a' },
  { id: 'shellL', number: 10, name: 'Honey', hex: '#e6bb62' },
  { id: 'sand', number: 11, name: 'Sand', hex: '#f0deb0' },
  { id: 'sandD', number: 12, name: 'Wet sand', hex: '#d5b77c' },
  { id: 'pink', number: 13, name: 'Coral pink', hex: '#f0938f' },
  { id: 'orange', number: 14, name: 'Fire coral', hex: '#e9683e' },
  { id: 'purple', number: 15, name: 'Sea fan', hex: '#9b76ba' },
  { id: 'yellow', number: 16, name: 'Sponge yellow', hex: '#f5cf54' },
  { id: 'weed', number: 17, name: 'Kelp', hex: '#2f8f6c' },
  { id: 'white', number: 18, name: 'Pearl', hex: '#fbf8ec' },
];

const { regions, detail, R, D } = canvas();

// ---------------------------------------------------------------- water and light
const SURF = sample([[0, 54], [200, 76], [420, 48], [650, 78], [850, 50], [1000, 68]], 10);
const LINE1 = sample([[0, 380], [240, 350], [500, 392], [760, 352], [1000, 374]], 10);
const LINE2 = sample([[0, 760], [250, 725], [520, 775], [780, 735], [1000, 765]], 10);
R('water-deep', rect(0, 0, W, H), 'w3');
R('water-mid', above(LINE2, 0), 'w2');
R('water-top', above(LINE1, 0), 'w1');
R('surface', above(SURF, 0), 'light');
/** Where a slanted ray edge x = a + b·y crosses a left-to-right line. */
function cut(ln: Pt[], [a, b]: Pt): { i: number; p: Pt } {
  const f = ([x, y]: Pt) => x - (a + b * y);
  for (let i = 0; i < ln.length - 1; i++) {
    const f0 = f(ln[i]), f1 = f(ln[i + 1]);
    if (f0 <= 0 && f1 > 0) { const t = f0 / (f0 - f1); return { i, p: [ln[i][0] + (ln[i + 1][0] - ln[i][0]) * t, ln[i][1] + (ln[i + 1][1] - ln[i][1]) * t] }; }
  }
  throw new Error('ray misses line');
}
/** The part of a sunbeam (between two slanted edges) that lies between two water lines. */
function beam(top: Pt[], bot: Pt[], eL: Pt, eR: Pt): string {
  const tl = cut(top, eL), tr = cut(top, eR), bl = cut(bot, eL), br = cut(bot, eR);
  return poly([tl.p, ...top.slice(tl.i + 1, tr.i + 1), tr.p, br.p, ...bot.slice(bl.i + 1, br.i + 1).reverse(), bl.p]);
}
([[[230, -0.22], [310, -0.13]], [[480, 0.06], [590, 0.14]], [[800, 0.08], [880, 0.14]]] as [Pt, Pt][]).forEach(([eL, eR], i) => {
  R(`ray-${i + 1}-upper`, beam(SURF, LINE1, eL, eR), 'light');
  R(`ray-${i + 1}-lower`, beam(LINE1, LINE2, eL, eR), 'w1');
});
D(curve([[60, 30], [130, 22], [200, 32]]) + curve([[330, 24], [410, 16], [480, 26]]) + curve([[700, 34], [780, 26], [860, 36]]), '#ffffff', 2.4, 0.8);

// ---------------------------------------------------------------- the reef floor
R('seaweed-left-1', ribbon([[44, 1160], [26, 1060], [66, 960], [30, 850], [62, 760]], 34, 12), 'weed');
R('seaweed-left-2', ribbon([[104, 1160], [128, 1070], [86, 990], [124, 900]], 30, 12), 'skinD');
R('fan-stem', poly([[236, 1130], [262, 1130], [256, 1040], [242, 1040]]), 'shellM', [249, 1090]);
R('fan-coral', poly([[249, 1056], ...Array.from({ length: 57 }, (_, i) => { const a = ((200 + i * 2.5) * Math.PI) / 180, r = 156 * (0.9 + 0.1 * Math.abs(Math.sin(((i * 2.5) / 140) * Math.PI * 5))); return [249 + Math.cos(a) * r, 1050 + Math.sin(a) * r] as Pt; })]), 'purple');
R('seaweed-right-1', ribbon([[958, 1150], [976, 1050], [940, 950], [972, 840], [944, 740]], 34, 12), 'weed');
R('seaweed-right-2', ribbon([[906, 1160], [884, 1080], [922, 1000], [892, 920]], 28, 12), 'skinD');
// branching coral, right
R('branch-coral-1', ribbon([[790, 1150], [770, 1060], [730, 990], [716, 930]], 34, 16), 'orange');
R('branch-coral-2', ribbon([[790, 1150], [806, 1050], [800, 960], [822, 880]], 34, 16), 'orange');
R('branch-coral-3', ribbon([[800, 1150], [846, 1080], [876, 1040], [872, 970]], 32, 16), 'orange');
R('branch-coral-4', ribbon([[770, 1070], [744, 1040], [690, 1030], [664, 1000]], 24, 14), 'orange');
R('branch-coral-5', ribbon([[804, 1010], [770, 960], [768, 900]], 22, 14), 'orange');

R('sand', below(sample([[0, 1128], [160, 1108], [340, 1140], [520, 1118], [720, 1146], [880, 1120], [1000, 1136]]), H), 'sand');
R('sand-shade', below(sample([[0, 1214], [180, 1196], [400, 1226], [640, 1204], [840, 1228], [1000, 1208]]), H), 'sandD');

// tube sponges
function tube(id: string, x: number, top: number, w: number, base: number) {
  R(id, M(x - w / 2, base) + Q(x - w / 2 - 6, (top + base) / 2, x - w / 2, top) + Q(x, top - w * 0.3, x + w / 2, top) + Q(x + w / 2 + 6, (top + base) / 2, x + w / 2, base) + 'Z', 'yellow');
  R(`${id}-mouth`, ellipse(x, top + 2, w / 2 - 8, w * 0.17), 'shellM');
}
tube('sponge-1', 566, 1010, 60, 1160);
tube('sponge-2', 626, 950, 66, 1170);
tube('sponge-3', 510, 1070, 54, 1166);

// brain coral and rocks
R('rock-left', blob([[150, 1196], [170, 1130], [250, 1100], [340, 1120], [380, 1180], [330, 1214], [200, 1216]]), 'shellD');
R('rock-left-top', blob([[196, 1140], [252, 1114], [318, 1128], [300, 1150], [230, 1158]]), 'sandD');
R('brain-coral', cloud(118, 1178, 250, 104, 5, 0.3), 'pink');
R('brain-coral-shade', cloud(118, 1178, 226, 42, 5, 0.3), 'orange');
R('rock-right', blob([[820, 1200], [836, 1150], [900, 1130], [968, 1150], [990, 1196], [930, 1216], [860, 1214]]), 'shellD');
R('rock-right-top', blob([[856, 1160], [900, 1142], [950, 1158], [930, 1174], [880, 1178]]), 'sandD');
R('seaweed-mid-1', ribbon([[410, 1170], [392, 1100], [424, 1040], [400, 980]], 26, 11), 'weed');
R('seaweed-mid-2', ribbon([[452, 1176], [470, 1120], [446, 1070]], 24, 11), 'skinD');
R('starfish', star(690, 1196, 40, 17, 5, -70), 'orange');
R('shell-pearl', sector(432, 1222, 26, 180, 360), 'white');
D(curve([[40, 1150], [70, 1120], [100, 1150], [130, 1118], [160, 1150], [196, 1124]]) + curve([[70, 1108], [100, 1092], [140, 1100], [170, 1090]]), '#d97f7c', 1.8);
D(line([[249, 1050], [140, 1000]]) + line([[249, 1050], [180, 940]]) + line([[249, 1050], [249, 902]]) + line([[249, 1050], [318, 940]]) + line([[249, 1050], [372, 1004]]), '#7b5a9c', 2);
D(line([[432, 1222], [414, 1204]]) + line([[432, 1222], [432, 1198]]) + line([[432, 1222], [450, 1204]]), '#d8cdb0', 1.6);

// ---------------------------------------------------------------- the turtle
const T = (d: string) => xf(d, { s: 1.08, rot: -20, x: 470, y: 480 });
const mir = (pts: Pt[]) => pts.map(([x, y]) => [x, -y] as Pt);
const dots = (id: string, list: [number, number, number, number][], col: string) =>
  list.forEach(([x, y, rx, ry], i) => R(`${id}-${i + 1}`, T(ellipse(x, y, rx, ry)), col));

// far side flippers first
R('flipper-far', T(blob([[172, -80], [176, -156], [136, -240], [58, -306], [40, -298], [74, -228], [98, -166], [102, -100]])), 'skinD');
dots('flipper-far-spot', [[138, -126, 14, 11], [128, -178, 13, 10], [106, -228, 11, 9], [76, -272, 8.5, 7.5]], 'skin');
R('hind-far', T(blob([[-150, -85], [-190, -122], [-252, -160], [-266, -148], [-236, -104], [-186, -60]])), 'skinD');
R('tail', T(leaf(-188, 0, 56, 16, 180)), 'skin');
R('hind-near', T(blob([[-150, 85], [-196, 126], [-262, 150], [-274, 136], [-240, 98], [-186, 60]])), 'skin');
R('hind-near-spot', T(ellipse(-214, 112, 12, 9, 150)), 'skinD');
R('flipper-near', T(blob([[172, 80], [172, 160], [126, 250], [40, 326], [22, 318], [60, 240], [90, 170], [100, 100]])), 'skin');
dots('flipper-near-spot', [[136, 126, 14, 11], [124, 180, 13, 10], [100, 234, 11, 9], [66, 284, 9, 8]], 'skinD');
R('neck', T(rect(160, -40, 96, 80, 22)), 'skinL');
R('head', T(blob([[224, -40], [276, -47], [320, -29], [338, 0], [320, 29], [276, 47], [224, 40]])), 'skin');
R('head-scale-1', T(poly(inset([[240, -30], [262, -32], [270, -14], [256, -2], [238, -8]], 1))), 'skinD');
R('head-scale-2', T(poly([[238, 6], [256, 4], [266, 20], [254, 34], [238, 28]])), 'skinD');
R('head-scale-3', T(poly([[278, -24], [298, -22], [304, -6], [290, 2], [274, -6]])), 'skinD');
R('eye', T(circle(300, 20, 8.5)), 'shellD');

// shell
const E = (x: number) => 128 * Math.sqrt(Math.max(0, 1 - (x / 178) ** 2));
R('shell-rim', T(ellipse(0, 0, 200, 150)), 'shellD');
[-120, -60, 0, 60, 120].forEach((cx, i) => {
  const hh = [28, 33, 35, 33, 28][i], hw = 26;
  const hex: Pt[] = [[cx - hw, 0], [cx - 14, -hh], [cx + 14, -hh], [cx + hw, 0], [cx + 14, hh], [cx - 14, hh]];
  R(`scute-centre-${i + 1}`, T(poly(hex)), 'shellL');
  R(`scute-centre-${i + 1}-core`, T(poly(inset(hex, 0.48))), 'shellM');
});
[-120, -60, 0, 60].forEach((xa, i) => {
  const outer: Pt[] = [];
  for (let k = 0; k <= 6; k++) { const x = xa + 55 - (50 * k) / 6; outer.push([x, -E(x)]); }
  const side: Pt[] = [[xa + 5, -43], [xa + 17, -43], [xa + 30, -11], [xa + 43, -43], [xa + 55, -43], ...outer];
  const core = inset([[xa + 14, -56], [xa + 46, -56], [xa + 46, -E(xa + 30) + 12], [xa + 14, -E(xa + 30) + 12]], 0.62);
  R(`scute-far-${i + 1}`, T(poly(side)), 'shellM');
  R(`scute-far-${i + 1}-core`, T(poly(core)), 'shellL');
  R(`scute-near-${i + 1}`, T(poly(mir(side))), 'shellM');
  R(`scute-near-${i + 1}-core`, T(poly(mir(core))), 'shellL');
});
{
  const corner: Pt[] = [[125, -43], [150, -27], [163, -43], [150, -67], [125, -89]];
  const cap: Pt[] = [[153, -14], [168, -30], [176, -16], [178, 0], [176, 16], [168, 30], [153, 14]];
  const flip = (pts: Pt[]) => pts.map(([x, y]) => [-x, y] as Pt);
  R('scute-front-far', T(poly(corner)), 'shellL');
  R('scute-front-near', T(poly(mir(corner))), 'shellL');
  R('scute-back-far', T(poly(flip(corner))), 'shellL');
  R('scute-back-near', T(poly(flip(mir(corner)))), 'shellL');
  R('scute-front', T(poly(cap)), 'shellM');
  R('scute-back', T(poly(flip(cap))), 'shellM');
}
D(T(circle(303, 17, 2)), '#ffffff', 2.5);
D(T(curve([[322, 12], [334, 6], [338, -2]])), '#3f6a4a', 1.8);

// ---------------------------------------------------------------- fish and bubbles
const eyes: string[] = [];
eyes.push(fish(R, 'fish-clown-1', 190, 250, 96, -8, 1, 'orange', 'orange', 'white'));
eyes.push(fish(R, 'fish-tang-1', 110, 360, 74, 6, 1, 'yellow', 'yellow'));
eyes.push(fish(R, 'fish-tang-2', 842, 720, 84, -6, -1, 'yellow', 'yellow'));
eyes.push(fish(R, 'fish-clown-2', 900, 836, 78, 8, -1, 'orange', 'orange', 'white'));
eyes.push(fish(R, 'fish-violet', 210, 820, 80, -4, 1, 'purple', 'pink'));
D(eyes.join(''), '#2b2018', 3);
([[862, 268, 15], [898, 200, 11], [872, 132, 17], [330, 936, 12], [352, 872, 9.5]] as [number, number, number][]).forEach(([x, y, r], i) => {
  R(`bubble-${i + 1}`, circle(x, y, r), 'white');
});

const activity: PaintActivity = {
  id: 'ocean-paint-1', version: 1, mode: 'paint', title: 'Sea Turtle',
  blurb: 'A green sea turtle with a honey-and-amber shell glides through shafts of sunlight above a bright coral reef.',
  collectionId: 'ocean', categories: ["Ocean", "Animals"], difficulty: 'Detailed',
  added: '2026-11-26',
  width: W, height: H, palette, regions, detail,
};
export default activity;
