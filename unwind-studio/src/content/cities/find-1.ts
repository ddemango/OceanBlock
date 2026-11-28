import { rect, ellipse, circle, poly, line, curve, blob, leaf, petal, star, sh, stroke, place, shade, mix, rng, linearGradient, radialGradient } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { FindActivity, FindItem } from '../types';
import {
  M, L, Q, ol, shadow, building, brickLines, bulbString, leafyPlant, pot, flowerDots, bistroChair,
  cat, wateringCan, telescope, guitar, teapot, candleJar, birdhouse, openBook, slippers, owl, kite, radio, sunflower,
} from './props-find';

const ID = 'cities-find-1';
const W = 1200, H = 1500;
const items: FindItem[] = [];
const scene = (...s: (Shape | Shape[])[]) => { items.push({ shapes: s.flat() }); };
const target = (id: string, name: string, shapes: Shape[]) => { items.push({ id, name, target: true, shapes }); };
const GLOW = `${ID}-glow`;
const glow = (x: number, y: number, r: number, o = 0.7): Shape => sh(circle(x, y, r), `url(#${GLOW})`, { opacity: o });
const WOOD = '#6a4632', WOOD_D = '#4a2e22', WOOD_L = '#8a6044';
const LEAF = ['#3f6a4a', '#4f7f52', '#5f9058', '#355a40'];

const defs =
  linearGradient(`${ID}-sky`, [[0, '#0f1433'], [0.45, '#23285a'], [0.78, '#4a3f78'], [1, '#a8608a']]) +
  linearGradient(`${ID}-deck`, [[0, '#5a3c2e'], [1, '#7a5440']]) +
  radialGradient(`${ID}-halo`, [[0, '#fff4d0'], [0.35, '#fff4d066'], [1, '#fff4d000']]) +
  radialGradient(GLOW, [[0, '#ffe2a0'], [0.45, '#ffc46a77'], [1, '#ffc46a00']]) +
  radialGradient(`${ID}-city`, [[0, '#ffb070'], [1, '#ffb07000']], 0.5, 1, 0.7);

// =====================================================================
// sky, moon, stars
// =====================================================================
scene(sh(rect(0, 0, W, 840), `url(#${ID}-sky)`));
{
  const g = rng(11);
  for (let i = 0; i < 90; i++) {
    const x = g.range(0, W), y = g.range(0, 460);
    if (i % 9 === 0) scene(sh(star(x, y, g.range(4, 7), 1.6, 4), '#fff6dc'));
    else scene(sh(circle(x, y, g.range(0.8, 2)), '#f6efd8', { opacity: g.range(0.5, 0.95) }));
  }
  scene(sh(circle(990, 150, 190), `url(#${ID}-halo)`, { opacity: 0.55 }));
  scene(sh(circle(990, 150, 62), '#fbf0cc'), sh(circle(966, 132, 12), '#efe0b2'), sh(circle(1012, 176, 9), '#efe0b2'), sh(circle(1018, 124, 6), '#efe0b2'), sh(circle(972, 178, 5), '#efe0b2'));
  scene(sh(blob([[60, 230], [160, 206], [290, 214], [360, 236], [240, 250], [110, 250]], 0.9), '#5a4f8a', { opacity: 0.45 }));
  scene(sh(blob([[700, 300], [820, 276], [960, 290], [1040, 312], [900, 324], [760, 322]], 0.9), '#6a5a92', { opacity: 0.4 }));
  scene(sh(blob([[380, 120], [470, 104], [560, 116], [500, 130], [410, 132]], 0.9), '#4a4a80', { opacity: 0.4 }));
  scene(sh(rect(0, 560, W, 300), `url(#${ID}-city)`, { opacity: 0.55 }));
}

// =====================================================================
// skyline: far, then near
// =====================================================================
{
  const g = rng(21);
  const far = '#2e3062';
  for (let x = -20; x < W; ) {
    const w = g.range(70, 130), h = g.range(180, 420), y = 820 - h;
    scene(place(building(w, h + 20, far, g, { lit: 0.28, litCol: '#e8b86a', darkCol: '#262854', ww: 7, wh: 9, gx: 15, gy: 19, top: 12 }), { x, y }));
    if (g.next() < 0.3) scene(sh(rect(x + w / 2 - 1.5, y - 60, 3, 60), far), sh(circle(x + w / 2, y - 62, 3), '#e8505a'));
    x += w + g.range(-6, 10);
  }
  // the Empire State Building: stacked setbacks, a rounded crown and the mast
  {
    const cx = 860, body = '#363a70', winC = '#f0c87a';
    const tiers: [number, number, number][] = [[124, 420, 830], [96, 360, 420], [70, 300, 360], [48, 262, 300], [34, 236, 262]];
    for (const [w, y0, y1] of tiers) scene(sh(rect(cx - w / 2, y0, w, y1 - y0), body), sh(rect(cx + w / 2 - w * 0.28, y0, w * 0.28, y1 - y0), '#2c2f62'));
    scene(sh(M(cx - 14, 236) + L(cx - 14, 210) + Q(cx, 192, cx + 14, 210) + L(cx + 14, 236) + 'Z', '#f2d68a'), sh(rect(cx - 4, 140, 8, 60, 2), '#c8c0d8'), stroke(line([[cx, 140], [cx, 96]]), '#c8c0d8', 2), sh(circle(cx, 94, 3), '#e8505a'));
    scene(sh(rect(cx - 17, 236, 34, 26), '#e8c06a', { opacity: 0.9 }), sh(rect(cx - 24, 262, 48, 10), '#f2d68a', { opacity: 0.8 }));
    let piers = '';
    for (let x = cx - 56; x <= cx + 56; x += 14) piers += line([[x, 430], [x, 830]]);
    for (let x = cx - 42; x <= cx + 42; x += 14) piers += line([[x, 366], [x, 420]]);
    scene(stroke(piers, '#4a4e88', 2));
    const gg = rng(25);
    for (let y = 440; y < 820; y += 16) for (let x = cx - 50; x < cx + 56; x += 14) if (gg.next() < 0.3) scene(sh(rect(x, y, 8, 8), winC));
    for (let y = 370; y < 414; y += 14) for (let x = cx - 38; x < cx + 42; x += 14) if (gg.next() < 0.45) scene(sh(rect(x, y, 8, 8), winC));
  }
  // a Chrysler-style Art Deco crown: stacked sunburst arches and a needle spire
  {
    const cx = 470, body = '#3a3e76', steel = '#c8c8dc';
    scene(sh(rect(cx - 44, 360, 88, 470), body), sh(rect(cx + 14, 360, 30, 470), '#2e3268'));
    for (let i = 0; i < 6; i++) {
      const r = 40 - i * 6.2, y = 360 - i * 17;
      scene(sh(M(cx - r, y) + L(cx - r, y - 4) + Q(cx - r, y - r * 1.15, cx, y - r * 1.25) + Q(cx + r, y - r * 1.15, cx + r, y - 4) + L(cx + r, y) + 'Z', i % 2 ? '#b0b2c8' : steel));
      let tri = '';
      for (let k = -2; k <= 2; k++) { const a = (k / 6) * Math.PI; const tx = cx + Math.sin(a) * r * 0.75, ty = y - 6 - Math.cos(a) * r * 0.7; tri += poly([[tx - 3, ty + 4], [tx + 3, ty + 4], [tx, ty - 5]]); }
      scene(sh(tri, '#ffe29a'));
    }
    scene(sh(poly([[cx - 5, 268], [cx, 170], [cx + 5, 268]]), steel));
    const gg = rng(27);
    for (let y = 372; y < 820; y += 16) for (let x = cx - 38; x < cx + 40; x += 13) if (gg.next() < 0.32) scene(sh(rect(x, y, 7, 8), '#f0c87a'));
    scene(sh(rect(cx - 46, 360, 92, 6), steel));
  }
}
{
  const g = rng(33);
  const near = '#1e2048';
  const blocks: [number, number, number][] = [[-10, 160, 250], [150, 120, 190], [262, 150, 300], [404, 110, 210], [506, 170, 360], [668, 130, 230], [790, 110, 170], [892, 160, 270], [1044, 170, 320]];
  for (const [x, w, h] of blocks) {
    const y = 840 - h;
    scene(place(building(w, h, near, g, { lit: 0.5, litCol: '#ffd27a', darkCol: '#191a3a', ww: 10, wh: 14, gx: 22, gy: 28, top: 16 }), { x, y }));
    scene(sh(rect(x - 4, y - 8, w + 8, 10), '#2a2c5a'));
  }
  // a neighbour's little water tower and an aerial (where the kite is caught)
  scene(sh(rect(684, 572, 70, 46) + poly([[680, 574], [719, 548], [758, 574]]), '#262a56'), stroke(line([[692, 618], [692, 610]]) + line([[746, 618], [746, 610]]), '#262a56', 4));
  scene(stroke(line([[580, 480], [580, 340]]) + line([[560, 380], [600, 380]]) + line([[566, 404], [594, 404]]) + line([[570, 360], [590, 360]]), '#3a3c6e', 3));
}
target('kite', 'Kite', place(kite(70, '#e2563f', '#f2c84a'), { x: 612, y: 364, rot: 18 }));

// =====================================================================
// rooftop: parapet and deck
// =====================================================================
scene(sh(rect(0, 770, W, 120), '#8a4a3a'));
scene(brickLines(0, 790, W, 100, 46, 16, '#6a3428', 1.4));
{
  const g = rng(41);
  for (let i = 0; i < 26; i++) scene(sh(rect(g.int(0, 25) * 46 + (i % 2) * 23, 790 + g.int(0, 5) * 16, 44, 14), g.pick(['#9a5644', '#7a3e30', '#a0604a']), { opacity: 0.7 }));
}
scene(sh(rect(0, 760, W, 22, 2), '#b8ada0'), sh(rect(0, 778, W, 6), '#6a6258'));
scene(sh(rect(0, 884, W, H - 884), `url(#${ID}-deck)`));
{
  let planks = '';
  for (let y = 904, k = 0; y < H; y += 22 + k * 1.2, k++) planks += line([[0, y], [W, y]]);
  scene(stroke(planks, WOOD_D, 2));
  const g = rng(43);
  let seams = '';
  for (let y = 884, k = 0; y < H; y += 22 + k * 1.2, k++) for (let x = g.range(0, 200); x < W; x += g.range(180, 320)) seams += line([[x, y], [x, y + 20 + k * 1.2]]);
  scene(stroke(seams, WOOD_D, 1.4));
  for (let i = 0; i < 18; i++) scene(sh(rect(g.range(0, W - 160), g.range(900, 1480), g.range(60, 160), 5, 2), '#8a604a', { opacity: 0.35 }));
  scene(sh(ellipse(620, 1180, 420, 110), '#ffc46a', { opacity: 0.12 }));
}

// =====================================================================
// water tower (left)
// =====================================================================
{
  const cx = 170;
  scene(stroke(line([[70, 900], [90, 560]]) + line([[270, 900], [250, 560]]) + line([[130, 910], [138, 560]]) + line([[210, 910], [202, 560]]), '#3a2a26', 8));
  scene(stroke(line([[80, 720], [260, 640]]) + line([[80, 640], [260, 720]]) + line([[76, 800], [264, 720]]) + line([[76, 720], [264, 800]]), '#3a2a26', 3));
  scene(sh(rect(60, 548, 220, 16, 2), '#3a2a26'));
  scene(ol(rect(66, 380, 208, 172, 4), '#8a5a3a', 1.4, -0.4));
  let staves = '';
  for (let x = 82; x < 274; x += 16) staves += line([[x, 384], [x, 548]]);
  scene(stroke(staves, '#6a4028', 1.6));
  scene(sh(rect(62, 410, 216, 8) + rect(62, 470, 216, 8) + rect(62, 526, 216, 8), '#3a3036'));
  scene(sh(poly([[54, 386], [cx, 300], [286, 386]]), '#5a3a2a'), sh(poly([[54, 386], [cx, 300], [cx, 386]]), '#6a4632'), sh(rect(cx - 5, 286, 10, 18), '#3a3036'));
  scene(sh(rect(66, 380, 26, 172), '#000000', { opacity: 0.12 }), sh(rect(240, 380, 34, 172), '#ffffff', { opacity: 0.06 }));
  // ladder
  let rungs = '';
  for (let y = 410; y < 900; y += 20) rungs += line([[288, y], [306, y]]);
  scene(stroke(line([[288, 400], [288, 900]]) + line([[306, 400], [306, 900]]), '#2a2026', 3), stroke(rungs, '#2a2026', 2));
}
target('owl', 'Owl', place(owl(50, '#a07a58'), { x: 214, y: 340 }));

// =====================================================================
// pergola with vines and string lights
// =====================================================================
scene(sh(rect(372, 520, 16, 380) + rect(1110, 520, 16, 380), WOOD_D), sh(rect(376, 520, 4, 380) + rect(1114, 520, 4, 380), WOOD_L));
scene(sh(rect(352, 508, 800, 18, 3), WOOD), sh(rect(352, 508, 800, 5, 2), WOOD_L));
{
  let beams = '';
  for (let x = 400; x < 1120; x += 72) beams += rect(x, 498, 10, 34, 2);
  scene(sh(beams, WOOD_D));
  const g = rng(51);
  // vines climbing the posts and along the beam
  for (const px of [380, 1118]) {
    scene(stroke(curve([[px, 900], [px - 10, 800], [px + 10, 700], [px - 8, 600], [px + 6, 520]]), '#3a5a32', 3));
    for (let y = 540; y < 880; y += 18) scene(sh(leaf(px + g.range(-4, 4), y, g.range(18, 26), 6, g.pick([-150, -30, 200, -10, 170])), g.pick(LEAF)));
  }
  for (let x = 360; x < 1150; x += 14) scene(sh(leaf(x, 520 + g.range(-6, 6), g.range(14, 22), 5, g.range(40, 140)), g.pick(LEAF)));
  for (let i = 0; i < 16; i++) { const x = g.range(370, 1140), y = 530 + g.range(0, 24); scene(stroke(line([[x, 520], [x, y]]), '#3a5a32', 1), sh(petal(x, y, 8, 5, 90), '#f2f0e8'), sh(petal(x - 3, y, 7, 4, 120), '#f6e6f0')); }
}
scene(bulbString([300, 470], [1200, 430], 110, 16, GLOW));
scene(bulbString([380, 540], [1118, 540], 60, 13, GLOW, ['#ffd27a', '#ffb08a', '#fff1c8']));
scene(bulbString([0, 610], [300, 560], 50, 5, GLOW));

// =====================================================================
// back planters along the parapet
// =====================================================================
function planter(x: number, w: number, seed: number, kind: 'tomato' | 'herb' | 'flower' | 'lavender'): void {
  const g = rng(seed), y = 900;
  if (kind === 'tomato') {
    scene(stroke(line([[x + 30, y - 70], [x + 30, y - 230]]) + line([[x + w - 30, y - 70], [x + w - 30, y - 230]]), '#8a6a42', 3));
    scene(place(leafyPlant(150, LEAF, g, 22, 40, 0.3), { x: x + w / 2, y: y - 66 }));
    for (let i = 0; i < 10; i++) scene(sh(circle(x + g.range(20, w - 20), y - g.range(90, 200), g.range(6, 9)), g.pick(['#d8362c', '#e8553a', '#f08a2b'])));
  } else if (kind === 'herb') {
    for (let k = 0; k < 3; k++) scene(place(leafyPlant(80, ['#5f9058', '#7aa860', '#4f7f52'], g, 12, 50, 0.3), { x: x + w * (0.2 + k * 0.3), y: y - 66 }));
  } else if (kind === 'flower') {
    scene(place(leafyPlant(90, LEAF, g, 16, 60, 0.3), { x: x + w / 2, y: y - 66 }));
    scene(place(flowerDots(w - 30, 90, '#f29ab4', g, 9, 8), { x: x + w / 2, y: y - 66 }));
    scene(place(flowerDots(w - 30, 70, '#fbf4ec', g, 6, 7), { x: x + w / 2, y: y - 66 }));
  } else {
    for (let i = 0; i < 16; i++) {
      const sx = x + 14 + (i * (w - 28)) / 15, top = y - g.range(130, 170);
      scene(stroke(line([[sx, y - 66], [sx + g.range(-6, 6), top]]), '#6a8a5a', 2));
      let buds = '';
      for (let k = 0; k < 6; k++) buds += ellipse(sx + g.range(-6, 6) * (1 - k / 6), top + k * 7, 3.4, 4.6);
      scene(sh(buds, g.pick(['#8a6ac0', '#9a7ad0', '#7a5ab0'])));
    }
  }
  scene(ol(rect(x, y - 72, w, 72, 3), '#9a6a44', 1.2, -0.4), sh(rect(x, y - 72, w, 10, 3), '#b88a5a'), stroke(line([[x, y - 36], [x + w, y - 36]]), '#7a4e30', 1.6));
}
planter(410, 160, 61, 'tomato');
planter(580, 130, 62, 'herb');
planter(720, 150, 63, 'lavender');
planter(880, 140, 64, 'flower');
{
  // sunflower planter by the right post
  const g = rng(65);
  scene(place(leafyPlant(110, LEAF, g, 14, 40, 0.3), { x: 1060, y: 836 }));
  scene(place(sunflower(60, 160), { x: 1004, y: 720 }));
  scene(place(sunflower(56, 190), { x: 1088, y: 690 }));
}
scene(stroke(line([[1046, 836], [1046, 640]]), '#4f7a3f', 6));
target('sunflower', 'Sunflower', place(sunflower(78, 90), { x: 1046, y: 640 }));
scene(ol(rect(990, 828, 120, 72, 3), '#9a6a44', 1.2, -0.4), sh(rect(990, 828, 120, 10, 3), '#b88a5a'));
target('cat', 'Cat', place(cat(62, '#e09a5a', '#8ad06a'), { x: 820, y: 762 }));

// telescope at the back right, aimed at the moon
target('telescope', 'Telescope', place(telescope(150), { x: 1110, y: 960 }));

// =====================================================================
// left side: birdhouse, crates, palm pot, radio, watering can
// =====================================================================
scene(sh(rect(335.5, 900, 9, 100), '#6a4a32'));
target('birdhouse', 'Birdhouse', place(birdhouse(64, '#5c8fb0', '#c8473a', 0.9), { x: 340, y: 900 }));
{
  const g = rng(71);
  // big potted palm
  scene(shadow(80, 1100, 80, 12));
  for (let i = 0; i < 9; i++) {
    const a = -160 + i * 18 + g.range(-6, 6), len = g.range(120, 170);
    scene(sh(leaf(80, 960, len, 22, a), g.pick(LEAF)), stroke(line([[80, 960], [80 + Math.cos((a * Math.PI) / 180) * len * 0.9, 960 + Math.sin((a * Math.PI) / 180) * len * 0.9]]), '#2a4a30', 1.4));
  }
  scene(place(pot(130, 130, '#c8673e'), { x: 80, y: 1100 }));
  // stacked crates
  const crate = (x: number, y: number, w: number, h: number, c = '#a87a4a') => scene(ol(rect(x, y, w, h, 2), c, 1.2, -0.4), stroke(line([[x, y + h / 3], [x + w, y + h / 3]]) + line([[x, y + (2 * h) / 3], [x + w, y + (2 * h) / 3]]), shade(c, -0.3), 1.6), sh(rect(x, y, 8, h) + rect(x + w - 8, y, 8, h), shade(c, -0.15)));
  crate(150, 1090, 150, 100);
  crate(166, 1000, 120, 90, '#b88a5a');
  scene(place(pot(60, 50, '#5c8fb0'), { x: 270, y: 1000 }), place(leafyPlant(60, ['#5f9058', '#7aa860'], g, 10, 60, 0.35), { x: 270, y: 952 }));
  scene(place(flowerDots(50, 50, '#f2c84a', g, 6, 6), { x: 270, y: 952 }));
}
target('radio', 'Radio', place(radio(84, '#3f8a7a'), { x: 214, y: 1000 }));
{
  const g = rng(73);
  scene(shadow(120, 1330, 110, 14));
  scene(place(leafyPlant(150, ['#4f7f52', '#5f9058', '#3f6a4a'], g, 18, 70, 0.28), { x: 120, y: 1240 }));
  scene(place(flowerDots(160, 120, '#e8556a', g, 10, 9), { x: 120, y: 1240 }));
  scene(place(pot(170, 100, '#b85a36'), { x: 120, y: 1330 }));
  scene(sh(rect(40, 1280, 160, 10), '#d8a070', { opacity: 0.6 }));
}
target('watering-can', 'Watering can', place(wateringCan(130, '#4a9a9a'), { x: 270, y: 1420 }));
{
  const g = rng(75);
  scene(place(pot(90, 70, '#d07a4a'), { x: 60, y: 1470 }), place(leafyPlant(70, ['#6aa060', '#4f7f52'], g, 10, 60, 0.4), { x: 60, y: 1404 }));
  // small trowel and seed packets
  scene(stroke(line([[380, 1440], [430, 1410]]), '#6a4024', 6), sh(leaf(380, 1440, 40, 12, 150), '#a8b0b8'));
  scene(ol(rect(440, 1430, 34, 46, 2), '#f2e6c8', 1), sh(circle(457, 1450, 9), '#e8553a'), ol(rect(480, 1440, 34, 46, 2), '#f2e6c8', 1), sh(circle(497, 1460, 9), '#f2c84a'));
}

// =====================================================================
// the table set for two
// =====================================================================
{
  // rug
  scene(sh(rect(360, 1180, 540, 170, 10), '#6a3a5a'), stroke(rect(374, 1192, 512, 146, 6), '#e8b866', 3));
  let rp = '';
  for (let i = 0; i < 7; i++) rp += poly([[410 + i * 72, 1265], [430 + i * 72, 1240], [450 + i * 72, 1265], [430 + i * 72, 1290]]);
  scene(sh(rp, '#c86a6a'), sh(rect(380, 1200, 500, 6) + rect(380, 1324, 500, 6), '#d89a6a'));
  let fr = '';
  for (let x = 364; x < 900; x += 9) fr += line([[x, 1350], [x, 1362]]);
  scene(stroke(fr, '#e8b866', 2));
}
scene(place(bistroChair(120, '#2f4a3a'), { x: 450, y: 1240 }));
scene(place(bistroChair(120, '#2f4a3a'), { x: 810, y: 1240 }));
{
  // table with a checked cloth
  const cx = 630, top = 1060, w = 300;
  scene(shadow(cx, 1252, 150, 16));
  scene(sh(rect(cx - 10, top, 20, 190), '#2f3436'), sh(poly([[cx - 70, 1250], [cx + 70, 1250], [cx + 10, 1236], [cx - 10, 1236]]), '#2f3436'));
  scene(ol(M(cx - w / 2, top) + L(cx + w / 2, top) + L(cx + w / 2 + 14, top + 90) + Q(cx, top + 110, cx - w / 2 - 14, top + 90) + 'Z', '#f6ecdc', 1, -0.2));
  let ck = '';
  for (let i = 0; i < 8; i++) ck += poly([[cx - w / 2 + i * 38, top], [cx - w / 2 + i * 38 + 18, top], [cx - w / 2 + i * 40 + 26, top + 96], [cx - w / 2 + i * 40 + 6, top + 96]]);
  scene(sh(ck, '#d86a5a', { opacity: 0.7 }), sh(rect(cx - w / 2 - 10, top + 40, w + 20, 16), '#d86a5a', { opacity: 0.5 }));
  scene(sh(ellipse(cx, top, w / 2, 26), '#f6ecdc'), stroke(ellipse(cx, top, w / 2, 26), '#d8c8b0', 1));
  // place settings
  for (const px of [cx - 90, cx + 90]) scene(ol(ellipse(px, top + 4, 40, 11), '#ffffff', 1, -0.2), sh(ellipse(px, top + 3, 26, 7), '#f2e6c8'), sh(ellipse(px, top + 1, 14, 5), '#e8a0a8'));
  scene(stroke(line([[cx - 140, top + 4], [cx - 136, top + 14]]) + line([[cx + 138, top + 4], [cx + 136, top + 14]]), '#b8b8c0', 2));
  // glasses of lemonade
  for (const gx of [cx - 46, cx + 128]) scene(sh(rect(gx - 7, top - 30, 14, 26, 2), '#f6e08a', { opacity: 0.8 }), sh(rect(gx - 8, top - 34, 16, 32, 3), '#dff0f4', { opacity: 0.35, stroke: '#a8c8d0', strokeWidth: 1 }), sh(circle(gx + 6, top - 32, 5), '#f2d23c'));
  // little vase of flowers
  scene(ol(rect(cx + 44, top - 40, 18, 36, 6), '#5c8fb0', 1), stroke(line([[cx + 53, top - 40], [cx + 44, top - 70]]) + line([[cx + 53, top - 40], [cx + 60, top - 76]]) + line([[cx + 53, top - 40], [cx + 54, top - 62]]), '#4f7a3f', 1.4));
  scene(sh(circle(cx + 44, top - 72, 6) + circle(cx + 60, top - 78, 6), '#f29ab4'), sh(circle(cx + 54, top - 64, 5), '#fbf4ec'));
}
scene(glow(612, 1030, 160, 0.4));
target('candle', 'Candle', place(candleJar(28, GLOW), { x: 612, y: 1058 }));
target('teapot', 'Teapot', place(teapot(80, '#e0605a'), { x: 560, y: 1062 }));

// =====================================================================
// right side: bench with cushions, guitar, book, slippers
// =====================================================================
{
  const x0 = 900, x1 = 1190, seat = 1210;
  scene(shadow(1045, 1340, 160, 14));
  scene(sh(rect(x0, seat - 150, x1 - x0, 20, 4) + rect(x0, seat - 110, x1 - x0, 20, 4) + rect(x0, seat - 70, x1 - x0, 20, 4), WOOD_L));
  scene(sh(rect(x0 + 8, seat - 160, 14, 280) + rect(x1 - 22, seat - 160, 14, 280), WOOD_D));
  scene(ol(rect(x0 - 6, seat, x1 - x0 + 12, 26, 4), WOOD, 1.2, -0.4), sh(rect(x0 - 6, seat, x1 - x0 + 12, 6, 3), WOOD_L));
  scene(ol(rect(x0 + 20, seat - 30, 120, 34, 12), '#e8b866', 1), ol(rect(x0 + 140, seat - 30, 130, 34, 12), '#5c8fb0', 1));
  scene(ol(xf2(rect(-38, -38, 76, 76, 14), x0 + 60, seat - 70, -10), '#d86a5a', 1), ol(xf2(rect(-34, -34, 68, 68, 14), x0 + 230, seat - 68, 8), '#f2e6c8', 1));
  let dots = '';
  for (let i = 0; i < 9; i++) dots += circle(x0 + 230 + ((i % 3) - 1) * 18, seat - 68 + (Math.floor(i / 3) - 1) * 18, 3);
  scene(sh(dots, '#5c8fb0'));
  // knitted throw hanging off the end
  scene(sh(poly([[x1 - 70, seat - 4], [x1 + 4, seat - 4], [x1 + 8, seat + 90], [x1 - 60, seat + 70]]), '#8a5a9a'), stroke(line([[x1 - 64, seat + 20], [x1 + 4, seat + 24]]) + line([[x1 - 62, seat + 44], [x1 + 6, seat + 50]]), '#a87ab8', 3));
}
target('open-book', 'Open book', place(openBook(96, '#3f6a8a'), { x: 1020, y: 1194 }));
target('guitar', 'Guitar', place(guitar(250, '#d08a3c'), { x: 880, y: 1360, rot: 10 }));
{
  // floor lantern and potted fern on the right
  scene(glow(1130, 1380, 120, 0.6), ol(rect(1104, 1360, 52, 76, 4), '#2a2a30', 1), sh(rect(1112, 1370, 36, 56, 2), '#ffd27a'), sh(poly([[1098, 1362], [1162, 1362], [1130, 1334]]), '#2a2a30'), stroke(curve([[1118, 1334], [1130, 1318], [1142, 1334]]), '#2a2a30', 2.4));
  scene(stroke(line([[1130, 1370], [1130, 1426]]) + line([[1112, 1398], [1148, 1398]]), '#2a2a30', 2));
  const g = rng(81);
  scene(place(leafyPlant(110, LEAF, g, 16, 80, 0.25), { x: 1040, y: 1420 }), place(pot(110, 80, '#5c8fb0'), { x: 1040, y: 1490 }));
}
target('slippers', 'Slippers', place(slippers(80, '#e88aa0'), { x: 740, y: 1430, rot: 0 }));
{
  // a dropped cushion and fairy lights trailing on the floor
  scene(ol(xf2(rect(-30, -22, 60, 44, 12), 560, 1440, -14), '#e8b866', 1));
  scene(bulbString([420, 1380], [880, 1500], 30, 9, GLOW, ['#ffd27a', '#fff1c8'], 4));
}

function xf2(d: string, x: number, y: number, rot: number): string {
  return place([sh(d, '#000')], { x, y, rot })[0].d;
}
void mix; void leaf;

const activity: FindActivity = {
  id: ID, version: 1, mode: 'find', title: 'Rooftop Garden at Night',
  blurb: 'String lights glow over a little table for two on a New York rooftop, with the lit-up skyline behind and thirteen cosy finds tucked among the planters.',
  added: '2026-11-25', collectionId: 'cities', categories: ["Cities"], difficulty: 'Relaxed',
  width: W, height: H, defs, items,
};
export default activity;
