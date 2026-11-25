import { rect, circle, ellipse, poly, line, curve, xf } from '../../art/kit';
import type { PaintActivity, PaletteColor } from '../types';
import { canvas, bar, canopy, crescent, panelBall, shoe, grassTufts, lerp, M, Q, L, type Pt } from './props-paint';

const W = 1000, H = 1250;

const palette: PaletteColor[] = [
  { id: 'sky', number: 1, name: 'Morning sky', hex: '#bfe0ee' },
  { id: 'haze', number: 2, name: 'Dawn haze', hex: '#fbe3c4' },
  { id: 'sun', number: 3, name: 'Early sun', hex: '#ffd36e' },
  { id: 'white', number: 4, name: 'Chalk white', hex: '#fdfbf4' },
  { id: 'mist', number: 5, name: 'Net mist', hex: '#e4ecec' },
  { id: 'treeD', number: 6, name: 'Shady oak', hex: '#3f6b4a' },
  { id: 'treeM', number: 7, name: 'Park green', hex: '#6f9a58' },
  { id: 'treeL', number: 8, name: 'Sunlit leaves', hex: '#a9c46c' },
  { id: 'grassL', number: 9, name: 'Dewy grass', hex: '#9ccc6e' },
  { id: 'grassM', number: 10, name: 'Mown stripe', hex: '#79b257' },
  { id: 'trunk', number: 11, name: 'Bark', hex: '#7a5438' },
  { id: 'coral', number: 12, name: 'Cleat coral', hex: '#e8664a' },
  { id: 'ink', number: 13, name: 'Charcoal', hex: '#3a3a40' },
  { id: 'cone', number: 14, name: 'Cone orange', hex: '#f39a3a' },
  { id: 'shadow', number: 15, name: 'Soft shadow', hex: '#c8d0cf' },
];

const { regions, detail, R, D } = canvas();

// ---------------------------------------------------------------- sky
R('sky', rect(0, 0, W, 640), 'sky');
R('sky-glow', poly([[0, 640], ...Array.from({ length: 21 }, (_, i): Pt => { const x = i * 50, u = (x - 700) / 760; return [x, 640 - 380 * Math.sqrt(Math.max(0, 1 - u * u))]; }), [1000, 640]]), 'haze');
R('sun-halo', circle(700, 250, 118), 'haze');
R('sun', circle(700, 250, 76), 'sun');
R('cloud-1', canopy(250, 150, 120, 34, 6, 0.18, 0.4, true), 'white');
R('cloud-2', canopy(480, 92, 84, 24, 5, 0.2, 0.2, true), 'white');

// ---------------------------------------------------------------- park trees
// distant tree line along the horizon
R('far-trees', poly([[0, 640], [0, 560], ...Array.from({ length: 21 }, (_, i): Pt => [i * 50, 552 + Math.sin(i * 1.7) * 18 - (i % 3) * 8]), [1000, 560], [1000, 640]]), 'treeM');
// left oak
R('oak-trunk', poly([[96, 640], [104, 440], [126, 440], [140, 640]]), 'trunk');
R('oak-branch', bar([118, 476], [182, 404], 24, 16), 'trunk');
R('oak-canopy', canopy(120, 300, 190, 170, 9, 0.1, 0.3), 'treeD');
R('oak-canopy-mid', canopy(150, 270, 140, 120, 8, 0.12, 0.5), 'treeM');
R('oak-canopy-light', canopy(190, 236, 76, 62, 6, 0.14, 0.1), 'treeL');
// right tree pair
R('maple-trunk', poly([[862, 640], [868, 470], [888, 470], [898, 640]]), 'trunk');
R('maple-canopy', canopy(880, 400, 150, 130, 8, 0.1, 0.9), 'treeD');
R('maple-canopy-light', canopy(840, 370, 82, 70, 6, 0.14, 0.4), 'treeM');
R('poplar', canopy(980, 430, 52, 150, 6, 0.08, 0.2), 'treeM');

// ---------------------------------------------------------------- field (mown stripes, nearer = taller)
const bands = [622, 668, 728, 808, 912, 1046, 1250];
for (let i = 0; i < bands.length - 1; i++) {
  R(`field-${i + 1}`, rect(0, bands[i], W, bands[i + 1] - bands[i]), i % 2 ? 'grassM' : 'grassL');
}
R('hedge', poly([[0, 640], ...Array.from({ length: 11 }, (_, i): Pt => [i * 100, 612 + (i % 2) * 10]), [1000, 640]]), 'treeD');

// ---------------------------------------------------------------- goal (three-quarter view)
const FL: Pt = [150, 728], FR: Pt = [640, 728], FTL: Pt = [150, 420], FTR: Pt = [640, 420];
const BL: Pt = [236, 664], BR: Pt = [726, 664], BTL: Pt = [236, 446], BTR: Pt = [726, 446];
R('goal-shadow', poly([[150, 734], [640, 734], [760, 690], [266, 690]]), 'treeM');
R('net-back', poly([BTL, BTR, BR, BL]), 'mist');
R('net-side', poly([FTR, BTR, BR, FR]), 'shadow');
R('net-roof', poly([FTL, FTR, BTR, BTL]), 'mist');
// net mesh
{
  let d = '';
  for (let i = 1; i < 14; i++) { const t = i / 14; d += line([lerp(BTL, BTR, t), lerp(lerp(BTL, BTR, t), lerp(BL, BR, t), 0.97)]); }
  for (let i = 1; i < 8; i++) { const t = i / 8; d += line([lerp(BTL, BL, t), lerp(BTR, BR, t)]); }
  for (let i = 1; i < 6; i++) { const t = i / 6; d += line([lerp(FTR, BTR, t), lerp(FR, BR, t)]); }
  for (let i = 1; i < 8; i++) { const t = i / 8; d += line([lerp(lerp(FTR, FR, t), lerp(BTR, BR, t), 0.12), lerp(BTR, BR, t)]); }
  for (let i = 1; i < 14; i++) { const t = i / 14; d += line([lerp(lerp(FTL, FTR, t), lerp(BTL, BTR, t), 0.35), lerp(BTL, BTR, t)]); }
  D(d, '#a6b4b2', 1.2, 0.9);
}
R('goal-back-bar', bar(BL, BR, 12), 'white');
R('goal-post-left', bar(FL, FTL, 18), 'white');
R('goal-post-right', bar(FR, FTR, 18), 'white');
R('goal-crossbar', bar([141, 420], [649, 420], 18), 'white');
R('goal-post-cap', circle(640, 728, 9), 'shadow');

// ---------------------------------------------------------------- training cones on the field
function cone(id: string, cx: number, by: number, s: number) {
  R(`${id}-base`, poly([[cx - 42 * s, by], [cx + 42 * s, by], [cx + 36 * s, by - 13 * s], [cx - 36 * s, by - 13 * s]]), 'cone');
  R(`${id}`, poly([[cx - 26 * s, by - 13 * s], [cx + 26 * s, by - 13 * s], [cx + 6 * s, by - 74 * s], [cx - 6 * s, by - 74 * s]]), 'cone');
  R(`${id}-band`, poly([[cx - 18.6 * s, by - 34 * s], [cx + 18.6 * s, by - 34 * s], [cx + 14 * s, by - 48 * s], [cx - 14 * s, by - 48 * s]]), 'white');
}
cone('cone-far', 800, 760, 0.8);
cone('cone-near', 880, 880, 1.15);

// ---------------------------------------------------------------- the ball
const bx = 650, by = 1000, br = 136;
R('ball-shadow', ellipse(bx + 46, by + br - 4, br * 1.15, 28), 'treeM');
R('ball', circle(bx, by, br), 'white');
{
  const b = panelBall(bx, by, br, 8);
  R('ball-shade', crescent(bx, by, br, br, -50, 130, 0.3), 'shadow');
  R('ball-patch-centre', b.centre, 'ink');
  b.edge.forEach((d, i) => R(`ball-patch-${i + 1}`, d, 'ink'));
  D(b.seams, '#9aa3a2', 2);
}

// ---------------------------------------------------------------- a pair of cleats
function cleat(id: string, x: number, y: number, len: number, dir: 1 | -1, rot: number) {
  const s = shoe(0, 0, len, dir);
  const t = (d: string) => xf(d, { rot, x, y });
  s.studs(5).forEach((d, i) => R(`${id}-stud-${i + 1}`, t(d), 'ink'));
  R(`${id}-sole`, t(s.sole), 'ink');
  R(`${id}-upper`, t(s.upper), 'coral');
  R(`${id}-collar`, t(s.collar), 'ink');
  R(`${id}-heel`, t(s.heel), 'white');
  R(`${id}-toe`, t(s.toe), 'white');
  R(`${id}-stripe`, t(s.stripe), 'white');
  D(t(s.laces), '#fdfbf4', 4);
}
R('cleats-shadow', ellipse(240, 1196, 230, 28), 'treeM');
cleat('cleat-back', 196, 1046, 270, 1, -3);
cleat('cleat-front', 36, 1196, 330, 1, 2);

// ---------------------------------------------------------------- water bottle lying in the grass
R('bottle', poly([[780, 1196], [930, 1162], [940, 1208], [790, 1242]]), 'sky');
R('bottle-cap', poly([[930, 1162], [960, 1155], [970, 1201], [940, 1208]]), 'ink');
R('bottle-label', poly([[826, 1186], [880, 1174], [890, 1220], [836, 1232]]), 'white');

// ---------------------------------------------------------------- dew, grass texture, rays
D(grassTufts(0, 1000, 1250, 60, 34, 3, [[20, 380], [770, 980]]) + grassTufts(0, 1000, 1046, 50, 24, 7, [[190, 470], [510, 790]]) + grassTufts(0, 1000, 912, 44, 16, 11, [[510, 790], [830, 930]]) + grassTufts(0, 1000, 808, 40, 12, 5, [[750, 850]]), '#5f9444', 1.6, 0.8);
{
  let d = '';
  const drops: Pt[] = [[60, 980], [150, 940], [500, 960], [440, 1090], [850, 1000], [940, 1050], [560, 1210], [480, 1230], [90, 860], [330, 860], [700, 830], [950, 960], [420, 780]];
  for (const [x, y] of drops) d += circle(x, y, 3);
  D(d, '#ffffff', 2, 0.9);
}
D(line([[700, 120], [700, 100]]) + line([[792, 158], [806, 144]]) + line([[830, 250], [850, 250]]) + line([[608, 158], [594, 144]]), '#f2b84a', 3, 0.8);
D(M(186, 162) + Q(250, 140, 320, 160) + M(430, 100) + L(520, 100), '#d6e4ea', 2);

const activity: PaintActivity = {
  id: 'sports-paint-1', version: 1, mode: 'paint', title: 'Soccer Morning',
  blurb: 'A ball and a pair of coral cleats rest on the dewy grass by the goal as the morning sun rises over the park trees.',
  collectionId: 'sports', categories: ["Sports"], difficulty: 'Relaxed',
  width: W, height: H, palette, regions, detail,
};
export default activity;
