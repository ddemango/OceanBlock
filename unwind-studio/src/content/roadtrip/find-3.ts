import { rect, ellipse, circle, poly, line, curve, blob, leaf, sh, stroke, place, shade, rng, linearGradient, radialGradient } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { FindActivity, FindItem } from '../types';
import {
  M, L, Q, ol, shadow, binoculars, cocktail, sunHat, beachBall, flipFlops, rubberDuck, sunscreen, dolphin, shuffleCue, pineapple, shipBell, camera,
  lounger, lifebuoy, parasol, cloud, gull, figure, pottedPalm, book,
} from './props-find';

const ID = 'roadtrip-find-3';
const W = 1200, H = 1500;
const items: FindItem[] = [];
const scene = (...s: (Shape | Shape[])[]) => { items.push({ shapes: s.flat() }); };
const target = (id: string, name: string, shapes: Shape[]) => { items.push({ id, name, target: true, shapes }); };

const SEA = 500, RAIL = 700, NAVY = '#1f3a5f', WHITE = '#f8f6f0', TEAK = '#c98f5a';

const defs =
  linearGradient(`${ID}-sky`, [[0, '#5fb0e6'], [0.7, '#a8daf2'], [1, '#e6f4f6']]) +
  linearGradient(`${ID}-sea`, [[0, '#4fa6c9'], [1, '#1f6f9a']]) +
  linearGradient(`${ID}-pool`, [[0, '#6fd6e6'], [1, '#2fa6c9']]) +
  radialGradient(`${ID}-sun`, [[0, '#fff8d0'], [0.4, '#fff3b0aa'], [1, '#fff3b000']]);

// =====================================================================
// sky, sea, islands
// =====================================================================
scene(sh(rect(0, 0, W, SEA + 4), `url(#${ID}-sky)`));
scene(sh(circle(170, 120, 150), `url(#${ID}-sun)`), sh(circle(170, 120, 46), '#fff6c8'));
scene(place(cloud(240), { x: 470, y: 150 }), place(cloud(170, '#ffffff', 0.8), { x: 720, y: 90 }), place(cloud(200, '#ffffff', 0.75), { x: 160, y: 330 }), place(cloud(140, '#ffffff', 0.7), { x: 620, y: 300 }));
{
  const g = rng(3);
  for (let i = 0; i < 9; i++) scene(place(gull(g.range(18, 34), '#4a5a6a'), { x: g.range(260, 820), y: g.range(60, 420) }));
}
scene(sh(rect(0, SEA, W, RAIL - SEA + 20), `url(#${ID}-sea)`));
{
  // islands on the horizon
  scene(sh(blob([[20, SEA + 2], [80, SEA - 40], [160, SEA - 64], [240, SEA - 40], [300, SEA + 2]], 0.8), '#5a9a6a'), sh(blob([[120, SEA + 2], [170, SEA - 30], [230, SEA - 22], [270, SEA + 2]], 0.8), '#4a8a5a'));
  scene(sh(blob([[520, SEA + 2], [560, SEA - 24], [620, SEA - 30], [680, SEA + 2]], 0.8), '#7aaa86'), sh(rect(520, SEA - 2, 160, 4), '#f2e2b0'));
  for (const [px, py, h] of [[170, SEA - 60, 40], [200, SEA - 52, 34], [600, SEA - 28, 30]] as [number, number, number][]) {
    scene(stroke(curve([[px, py], [px + 4, py - h * 0.5], [px + 2, py - h]]), '#5a4a32', 2.2));
    let fr = '';
    for (const a of [-160, -120, -60, -20, -90]) fr += leaf(px + 2, py - h, h * 0.45, h * 0.08, a);
    scene(sh(fr, '#3f7a3a'));
  }
  // lighthouse on the little island
  scene(sh(poly([[650, SEA - 8], [664, SEA - 8], [661, SEA - 54], [653, SEA - 54]]), '#fbf6ec'), sh(rect(652, SEA - 40, 10, 8) + rect(652, SEA - 24, 12, 8), '#d2452f'), sh(rect(650, SEA - 62, 14, 8, 2), '#3a3a40'));
  // distant sailboat
  scene(place([sh(poly([[880, SEA + 30], [930, SEA + 30], [922, SEA + 38], [888, SEA + 38]]), WHITE), sh(poly([[904, SEA + 28], [904, SEA - 26], [928, SEA + 26]]), '#fbf6ec'), sh(poly([[900, SEA + 28], [900, SEA - 14], [884, SEA + 26]]), '#e8799f')], { x: -470 }));
  // waves
  const g = rng(7);
  for (let i = 0; i < 46; i++) { const y = g.range(SEA + 10, RAIL), x = g.range(0, W), w = g.range(16, 40) * (0.6 + (y - SEA) / 200); scene(stroke(M(x, y) + Q(x + w / 2, y - 5, x + w, y), '#e6f6fb', 1.6, { opacity: g.range(0.5, 0.9) })); }
  target('dolphins', 'Pair of dolphins', [...place(dolphin(80, '#6f8fa8'), { x: 690, y: 576, rot: -16 }), ...place(dolphin(64, '#5f7f98'), { x: 760, y: 594, rot: -10 }), sh(ellipse(712, 616, 60, 6), '#e6f6fb', { opacity: 0.8 })]);
}

// =====================================================================
// the ship's superstructure and smokestack on the right
// =====================================================================
{
  const x0 = 800;
  // smokestack
  scene(ol(M(900, 290) + L(920, 70) + Q(1010, 50, 1110, 66) + L(1110, 290) + 'Z', WHITE, 1.4, -0.2), sh(M(918, 92) + Q(1010, 72, 1110, 86) + L(1110, 66) + Q(1010, 50, 920, 70) + 'Z', '#d2452f'));
  scene(sh(poly([[914, 140], [1110, 136], [1110, 162], [912, 166]]), NAVY), sh(poly([[912, 172], [1110, 168], [1110, 178], [911, 182]]), '#d2452f'), sh(ellipse(1012, 62, 80, 10), '#3a3a40'));
  scene(sh(rect(940, 100, 18, 180, 4), '#ffffff', { opacity: 0.35 }), sh(blob([[1000, 50], [1030, 20], [1070, 24], [1090, 0], [1130, 10], [1100, 40], [1050, 50]], 0.9), '#ffffff', { opacity: 0.6 }));
  // mast
  scene(stroke(line([[860, 300], [860, 40]]) + line([[836, 90], [884, 90]]), '#9aa0a6', 4), sh(circle(860, 36, 6), '#f2c14e'));
  // upper deck block
  scene(ol(rect(x0, 280, W - x0 + 10, 140, 4), WHITE, 1.2, -0.2), sh(rect(x0, 400, W - x0, 20), NAVY));
  for (let x = x0 + 20; x < W; x += 58) scene(sh(rect(x, 310, 44, 56, 6), '#4a7a9a'), sh(rect(x + 4, 314, 14, 48, 4), '#ffffff', { opacity: 0.3 }));
  // lifeboat on davits
  scene(stroke(line([[860, 420], [880, 470]]) + line([[1140, 420], [1120, 470]]), '#9aa0a6', 4), ol(M(860, 470) + L(1140, 470) + Q(1120, 530, 1000, 530) + Q(880, 530, 860, 470) + 'Z', '#f08a2b', 1.2), sh(rect(880, 470, 240, 14, 4), WHITE), sh(rect(880, 484, 240, 4), '#d2452f'));
  // main deck wall
  scene(ol(rect(x0, 530, W - x0 + 10, 320, 4), WHITE, 1.2, -0.2), sh(rect(x0, 530, W - x0, 14), '#e2ded4'));
  for (let x = x0 + 40; x < W; x += 80) scene(sh(circle(x, 580, 18), '#c9ccd2'), sh(circle(x, 580, 13), '#4a7a9a'), sh(circle(x - 4, 576, 4), '#ffffff', { opacity: 0.6 }));
  scene(ol(rect(990, 640, 110, 200, 10), '#4a7a9a', 1.2), sh(rect(1000, 650, 40, 120, 6) + rect(1050, 650, 40, 120, 6), '#8ac4dc'), sh(rect(1040, 650, 10, 190), '#c9ccd2'));
  scene(stroke(line([[x0, 620], [x0 + 160, 620]]), '#c9ccd2', 3));
  target('ships-bell', "Ship's bell", place(shipBell(56), { x: 900, y: 650 }));
  scene(place(lifebuoy(34, '#d2452f'), { x: 1150, y: 700 }));
}

// =====================================================================
// railing, bunting and deck
// =====================================================================
{
  // bunting from the mast to the left
  const pts: [number, number][] = [];
  for (let i = 0; i <= 16; i++) { const t = i / 16; pts.push([860 - t * 880, 90 + Math.sin(t * Math.PI) * 120 + t * 70]); }
  scene(stroke(curve(pts), '#5a5a62', 1.2));
  const cols = ['#d2452f', '#f6d23c', '#3f8fbf', '#fbf6ec', '#7fb069'];
  for (let i = 1; i < 16; i++) { const [x, y] = pts[i]; scene(sh(poly([[x - 9, y], [x + 9, y + 2], [x, y + 22]]), cols[i % cols.length])); }
}
scene(sh(rect(0, RAIL + 20, 820, 30), '#e8e2d4'));
{
  // glass rail panels and posts
  scene(sh(rect(0, RAIL - 50, 810, 70), '#cfeaf2', { opacity: 0.35 }));
  for (let x = 0; x <= 810; x += 90) scene(sh(rect(x - 4, RAIL - 60, 8, 84), '#c9ccd2'));
  scene(ol(rect(-4, RAIL - 66, 818, 12, 5), TEAK, 1));
  scene(place(lifebuoy(40, '#d2452f'), { x: 140, y: RAIL - 6 }), place(lifebuoy(40, '#d2452f'), { x: 620, y: RAIL - 6 }));
  target('binoculars', 'Binoculars', place(binoculars(44, '#2f3a33'), { x: 420, y: RAIL - 82 }));
  scene(place(figure(170, '#3f8fbf', 5), { x: 300, y: RAIL + 50 }), place(figure(160, '#e8799f', 6), { x: 520, y: RAIL + 52 }));
}
// teak deck
scene(sh(rect(0, RAIL + 48, W, H - RAIL - 48), TEAK));
{
  const g = rng(11);
  let y = RAIL + 48, k = 0;
  while (y < H) {
    const h = 14 + (y - RAIL) * 0.04;
    let x = -g.range(0, 200);
    while (x < W) { const w = g.range(160, 320); scene(sh(rect(x + 1, y + 1, w - 2, h - 2, 1), g.pick([TEAK, '#c48a56', '#d09a64', '#bf8650']))); x += w; }
    scene(stroke(line([[0, y], [W, y]]), '#8a5a35', 1.2));
    y += h; k++;
  }
}

// =====================================================================
// pool
// =====================================================================
{
  const x0 = 230, x1 = 830, y0 = 930, y1 = 1150;
  scene(shadow((x0 + x1) / 2, y1 + 18, 330, 18, 0.15));
  scene(sh(rect(x0 - 30, y0 - 30, x1 - x0 + 60, y1 - y0 + 60, 50), '#f4efe4'), sh(rect(x0 - 30, y0 - 30, x1 - x0 + 60, y1 - y0 + 60, 50), '#ffffff', { opacity: 0.0, stroke: '#c9c0b0', strokeWidth: 2 }));
  let tiles = '';
  for (let x = x0 - 20; x < x1 + 30; x += 30) tiles += line([[x, y0 - 30], [x, y0 - 6]]) + line([[x, y1 + 6], [x, y1 + 30]]);
  scene(stroke(tiles, '#d9d2c4', 1.2));
  scene(sh(rect(x0, y0, x1 - x0, y1 - y0, 34), `url(#${ID}-pool)`), sh(rect(x0, y0, x1 - x0, 14, 8), '#3f8fbf', { opacity: 0.5 }));
  const g = rng(13);
  for (let i = 0; i < 30; i++) { const x = g.range(x0 + 20, x1 - 40), y = g.range(y0 + 20, y1 - 16); scene(sh(blob([[x, y], [x + 12, y - 4], [x + 24, y + 1], [x + 12, y + 4]], 0.9), '#e6fbff', { opacity: g.range(0.3, 0.7) })); }
  // lane tiles on the floor of the pool
  scene(sh(rect(x0 + 60, y0 + 100, x1 - x0 - 120, 6, 3), '#1f7f9f', { opacity: 0.4 }));
  // ladder
  scene(stroke(M(x1 - 80, y0 - 34) + Q(x1 - 80, y0 - 60, x1 - 60, y0 - 60) + Q(x1 - 40, y0 - 60, x1 - 40, y0 + 40) + M(x1 - 130, y0 - 34) + Q(x1 - 130, y0 - 60, x1 - 110, y0 - 60) + Q(x1 - 90, y0 - 60, x1 - 90, y0 + 40), '#c9ccd2', 5));
  scene(stroke(line([[x1 - 90, y0 + 10], [x1 - 40, y0 + 10]]) + line([[x1 - 90, y0 + 30], [x1 - 40, y0 + 30]]), '#c9ccd2', 3));
  // swimmer and floats
  scene(sh(ellipse(420, 1060, 40, 10), '#2fa6c9'), sh(circle(420, 1046, 16), '#c98e64'), sh(M(404, 1044) + Q(420, 1022, 436, 1044) + 'Z', '#3a2a22'), stroke(M(380, 1060) + Q(400, 1052, 410, 1062) + M(430, 1062) + Q(440, 1052, 460, 1060), '#e6fbff', 2));
  scene(sh(circle(650, 1030, 34), '#e8799f'), sh(circle(650, 1030, 18), '#3fbad6'), stroke(circle(650, 1030, 26), '#fbf6ec', 3, { opacity: 0.7 }));
  target('rubber-duck', 'Rubber duck', place(rubberDuck(50), { x: 540, y: 1110 }));
  scene(sh(ellipse(300, 1120, 50, 14), '#f6d23c'), sh(ellipse(300, 1117, 44, 9), '#f8e27a'));
}

// =====================================================================
// loungers, parasols and deck life
// =====================================================================
// back row by the rail
{
  const g = rng(21);
  for (const [x, col] of [[110, '#3f8fbf'], [700, '#f2c14e']] as [number, string][]) {
    scene(place(lounger(200, col), { x, y: 880 }));
    scene(place([sh(rect(-60, -50, 90, 8, 3), g.pick(['#fbf6ec', '#e8799f']))], { x, y: 880 }));
  }
  scene(place(parasol(200, '#d2452f', '#fbf6ec', 150), { x: 250, y: 880 }));
  target('sun-hat', 'Sun hat', place(sunHat(70, '#efd9a0', '#d2452f'), { x: 70, y: 820 }));
  target('camera', 'Camera', place(camera(44, '#2f2f33', '#3f6b8e'), { x: 720, y: 830 }));
}
scene(place(pottedPalm(300, 31, '#3f8fbf'), { x: 920, y: 960 }));
{
  // little bar table with drinks and fruit
  const tx = 1060, ty = 1030;
  scene(shadow(tx, ty + 120, 80, 10), stroke(line([[tx, ty], [tx, ty + 116]]), '#c9ccd2', 6), sh(rect(tx - 40, ty + 112, 80, 8, 3), '#c9ccd2'), ol(ellipse(tx, ty, 90, 22), '#fbf6ec', 1.2, -0.3));
  target('cocktail', 'Tropical cocktail', place(cocktail(70, '#f08a4b', '#7fb069'), { x: tx - 40, y: ty + 2 }));
  target('pineapple', 'Pineapple', place(pineapple(80), { x: tx + 40, y: ty + 4 }));
  scene(ol(rect(tx - 10, ty - 30, 16, 26, 3), '#e8f4f6', 0.8), sh(rect(tx - 8, ty - 20, 12, 15, 2), '#3fbad6'));
  scene(place(figure(200, '#7fb069', 23), { x: 1150, y: 1160 }));
}
target('beach-ball', 'Beach ball', place(beachBall(34), { x: 160, y: 1010 }));
// front row of loungers
{
  for (const [x, col, towel] of [[180, '#2f6690', '#f6d23c'], [520, '#d2452f', '#3fbad6']] as [number, string, string][]) {
    scene(place(lounger(320, col), { x, y: 1360 }));
    let st = '';
    for (let i = 0; i < 4; i++) st += rect(-60 + i * 40, -122, 20, 14);
    scene(place([sh(rect(-60, -122, 160, 14, 3), '#fbf6ec'), sh(st, towel)], { x, y: 1360 }));
  }
  scene(place(parasol(260, '#3f8fbf', '#fbf6ec', 190), { x: 360, y: 1380 }));
  target('sunscreen', 'Sunscreen', place(sunscreen(56, '#f08a2b'), { x: 330, y: 1440 }));
  target('flip-flops', 'Flip-flops', place(flipFlops(60, '#e8799f', '#3f8fbf'), { x: 90, y: 1440, rot: 70 }));
  scene(place(book(50, '#7fb069', '#fbf6ec'), { x: 520, y: 1236, rot: 12 }));
  // towel basket
  scene(shadow(720, 1460, 60, 8), ol(poly([[660, 1380], [780, 1380], [770, 1460], [670, 1460]]), '#c9a06a', 1));
  for (let i = 0; i < 4; i++) scene(ol(ellipse(686 + i * 22, 1374, 12, 14), ['#fbf6ec', '#3fbad6', '#fbf6ec', '#f6d23c'][i], 0.8, -0.2));
  let weave = '';
  for (let y = 1394; y < 1460; y += 12) weave += line([[664, y], [776, y]]);
  scene(stroke(weave, '#a8804a', 1.2));
}
// shuffleboard court
{
  scene(sh(poly([[840, 1240], [1180, 1240], [1200, 1500], [820, 1500]]), '#b8804c'));
  scene(stroke(poly([[860, 1260], [1160, 1260], [1176, 1490], [844, 1490]]), '#fbf6ec', 3), stroke(poly([[1010, 1280], [1100, 1420], [920, 1420]]), '#fbf6ec', 3), stroke(line([[950, 1374], [1070, 1374]]) + line([[1010, 1280], [1010, 1420]]), '#fbf6ec', 2));
  for (const [x, y, c] of [[960, 1340, '#d2452f'], [1050, 1400, '#2f6690'], [900, 1460, '#d2452f'], [1110, 1460, '#2f6690']] as [number, number, string][]) scene(ol(ellipse(x, y, 18, 7), c, 1), sh(ellipse(x, y - 2, 12, 4), shade(c, 0.25)));
  target('shuffle-cue', 'Shuffleboard cue', place(shuffleCue(170, '#c98a4a'), { x: 860, y: 1300, rot: -14 }));
}
void L; void Q; void blob;

const activity: FindActivity = {
  id: 'roadtrip-find-3', version: 1, mode: 'find', title: 'Cruise Ship Deck',
  blurb: 'Sunshine, sea breeze and dolphins on the horizon: find twelve holiday things around the pool, loungers and shuffleboard court.',
  added: '2026-11-25', collectionId: 'roadtrip', categories: ["Travel"], difficulty: 'Relaxed',
  width: W, height: H, defs, items,
};
export default activity;
