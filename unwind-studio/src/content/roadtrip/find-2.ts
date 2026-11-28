import { rect, ellipse, circle, poly, line, curve, blob, leaf, star, sh, stroke, place, shade, rng, xf, linearGradient, radialGradient } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { FindActivity, FindItem } from '../types';
import {
  M, L, Q, ol, shadow, campKettle, foldedMap, compass, campLantern, enamelMug, flashlight, fishingRod, marshmallowStick, ukulele, owl, hikingBoot,
  fryingPan, paddle, squirrel, binoculars, fireflyJar, beanie, pineTree, campChair, figure, type Pt,
} from './props-find';

const ID = 'roadtrip-find-2';
const W = 1200, H = 1500;
const items: FindItem[] = [];
const scene = (...s: (Shape | Shape[])[]) => { items.push({ shapes: s.flat() }); };
const target = (id: string, name: string, shapes: Shape[]) => { items.push({ id, name, target: true, shapes }); };

const SHORE = 800, LAKE = 560, PINE = '#2f5a48', PINE2 = '#3f6b52', GRASS = '#6a8a4f', WOOD = '#8a5a35';

const defs =
  linearGradient(`${ID}-sky`, [[0, '#2f3a6e'], [0.45, '#6a5a92'], [0.78, '#d98a7a'], [1, '#f6c890']]) +
  linearGradient(`${ID}-lake`, [[0, '#e8a888'], [0.25, '#8a7aa0'], [1, '#3a5a78']]) +
  linearGradient(`${ID}-ground`, [[0, '#6a8a4f'], [1, '#4f6a3a']]) +
  radialGradient(`${ID}-fire`, [[0, '#ffd27a'], [0.5, '#ff9a4a66'], [1, '#ff9a4a00']]) +
  radialGradient(`${ID}-win`, [[0, '#ffe9a8'], [1, '#ffe9a800']]);

// =====================================================================
// dusk sky, stars and moon
// =====================================================================
scene(sh(rect(0, 0, W, LAKE + 10), `url(#${ID}-sky)`));
{
  const g = rng(4);
  for (let i = 0; i < 70; i++) {
    const x = g.range(10, W - 10), y = g.range(10, 300), r = g.range(0.9, 2.4);
    if (g.next() < 0.18) scene(sh(star(x, y, r * 2.6, r * 0.8, 4, 0), '#fffbe0', { opacity: 0.9 }));
    else scene(sh(circle(x, y, r), '#fffbe0', { opacity: g.range(0.5, 0.95) }));
  }
  scene(sh(circle(930, 130, 60), '#fff6d0', { opacity: 0.12 }), sh(circle(930, 130, 34), '#fbf2c8'), sh(circle(946, 120, 32), '#3f4478'));
  scene(sh(blob([[120, 380], [260, 360], [420, 376], [300, 392]], 0.9), '#f2a890', { opacity: 0.6 }), sh(blob([[620, 330], [800, 312], [960, 330], [780, 344]], 0.9), '#e89a8e', { opacity: 0.5 }), sh(blob([[860, 420], [1020, 406], [1160, 422], [1000, 432]], 0.9), '#f6b894', { opacity: 0.55 }));
}
// jagged national-park peaks with snowfields
{
  const far: Pt[] = [[0, LAKE], [0, 440], [90, 400], [170, 430], [250, 360], [330, 410], [420, 300], [470, 250], [520, 310], [560, 280], [610, 350], [690, 330], [760, 400], [860, 360], [960, 420], [1060, 380], [1200, 430], [1200, LAKE]];
  scene(sh(poly(far), '#7a6e9e'));
  scene(sh(poly([[420, 300], [470, 250], [520, 310], [500, 304], [486, 330], [462, 296], [440, 320]]) + poly([[520, 310], [560, 280], [590, 318], [570, 314], [556, 334]]) + poly([[250, 360], [280, 380], [262, 378]]), '#f4eef6', { opacity: 0.9 }));
  scene(sh(poly([[470, 250], [520, 310], [610, 350], [560, LAKE], [470, LAKE]]), '#6a5e8e', { opacity: 0.6 }));
  scene(sh(blob([[0, LAKE], [0, 480], [160, 470], [340, 500], [520, 480], [700, 496], [880, 470], [1060, 492], [1200, 476], [1200, LAKE]], 0.6), '#5a5a86'));
  // far treeline
  const g = rng(6);
  let trees = '';
  for (let x = 0; x < W; x += g.range(10, 18)) { const h = g.range(20, 44); trees += poly([[x - 7, LAKE + 2], [x, LAKE + 2 - h], [x + 7, LAKE + 2]]); }
  scene(sh(trees, '#3a4a5e'));
}
// =====================================================================
// the lake
// =====================================================================
scene(sh(rect(0, LAKE, W, SHORE - LAKE + 40), `url(#${ID}-lake)`));
{
  // mirrored peaks and shimmering lines
  scene(sh(poly([[420, LAKE], [470, LAKE + 120], [520, LAKE + 60], [560, LAKE + 90], [610, LAKE + 40], [700, LAKE]]), '#7a6e9e', { opacity: 0.35 }));
  const g = rng(8);
  for (let i = 0; i < 36; i++) { const y = g.range(LAKE + 10, SHORE + 20), x = g.range(0, W), w = g.range(30, 120) * (0.6 + (y - LAKE) / 300); scene(sh(rect(x, y, w, 2.4, 1.2), g.pick(['#f6c8a0', '#fbe0c0', '#b8a8d0']), { opacity: g.range(0.35, 0.8) })); }
  scene(sh(rect(905, LAKE + 6, 50, 4, 2) + rect(898, LAKE + 20, 64, 4, 2) + rect(910, LAKE + 36, 40, 3, 1.5), '#fff6d0', { opacity: 0.6 }));
  // canoe with a paddler
  const cx = 545, cy = 724;
  scene(sh(ellipse(cx, cy + 8, 130, 10), '#2a3a58', { opacity: 0.4 }));
  scene(place(figure(90, '#d2452f', 12), { x: cx + 30, y: cy + 34 }));
  scene(stroke(line([[cx - 10, cy - 60], [cx + 50, cy + 20]]), '#8a5a35', 3), sh(ellipse(cx + 52, cy + 22, 6, 12, -40), '#8a5a35'));
  scene(ol(M(cx - 130, cy - 20) + Q(cx - 110, cy + 4, cx - 60, cy + 6) + L(cx + 60, cy + 6) + Q(cx + 110, cy + 4, cx + 130, cy - 20) + Q(cx, cy - 6, cx - 130, cy - 20) + 'Z', '#c8643a', 1.2), stroke(M(cx - 128, cy - 19) + Q(cx, cy - 4, cx + 128, cy - 19), '#e8a060', 2));
  // ducks
  for (const [dx, dy, f] of [[300, 640, 1], [336, 652, -1], [980, 740, 1]] as [number, number, number][]) scene(sh(ellipse(dx, dy, 14, 6), '#5a4a3a'), sh(circle(dx + 12 * f, dy - 8, 5), '#2f5a48'), sh(poly([[dx + 16 * f, dy - 8], [dx + 23 * f, dy - 7], [dx + 16 * f, dy - 5]]), '#e2a03a'), stroke(line([[dx - 20, dy + 6], [dx + 20, dy + 6]]), '#fbe0c0', 1, { opacity: 0.6 }));
}
// jetty on the right with the fishing rod
{
  const y0 = 760;
  scene(sh(poly([[860, y0], [1200, y0 - 20], [1200, y0 + 16], [860, y0 + 30]]), '#8a6a4a'));
  let planks = '';
  for (let x = 870; x < 1200; x += 22) planks += line([[x, y0 - (x - 860) * 0.06], [x, y0 + 30 - (x - 860) * 0.04]]);
  scene(stroke(planks, '#6b4a30', 1.6));
  for (const px of [880, 980, 1080]) scene(sh(rect(px - 5, y0 + 20 - (px - 860) * 0.05, 10, 50), '#5a3a24'), sh(ellipse(px, y0 + 70 - (px - 860) * 0.05, 14, 3), '#fbe0c0', { opacity: 0.4 }));
  scene(ol(rect(1010, y0 - 30, 46, 30, 3), '#3f6b8e', 1), sh(rect(1010, y0 - 30, 46, 8, 3), '#2f4a6a'));
}

// =====================================================================
// shore and meadow
// =====================================================================
scene(sh(blob([[0, SHORE + 40], [0, SHORE - 4], [200, SHORE - 14], [420, SHORE + 4], [640, SHORE - 6], [860, SHORE + 12], [1060, SHORE - 2], [1200, SHORE + 6], [1200, SHORE + 40]], 0.6), '#c9b48a'));
scene(sh(rect(0, SHORE + 20, W, H - SHORE - 20), `url(#${ID}-ground)`), sh(blob([[0, SHORE + 40], [0, SHORE + 14], [300, SHORE + 6], [600, SHORE + 22], [900, SHORE + 8], [1200, SHORE + 20], [1200, SHORE + 40]], 0.6), GRASS));
{
  // reeds along the waterline
  const g = rng(10);
  for (let i = 0; i < 26; i++) {
    const x = g.range(0, W), y = SHORE + g.range(6, 24), h = g.range(30, 60);
    if (x > 840 && x < 1200 && y < SHORE + 14) continue;
    scene(stroke(curve([[x, y], [x + g.range(-6, 6), y - h * 0.5], [x + g.range(-10, 10), y - h]]), g.pick(['#4f6a3a', '#5f7a42', '#3f5a32']), 2.2));
    if (g.next() < 0.4) scene(sh(ellipse(x + g.range(-3, 3), y - h * 0.82, 3, 9), '#6b4a2a'));
  }
  // dirt clearing round the fire
  scene(sh(ellipse(600, 1190, 360, 120), '#a88a62', { opacity: 0.7 }), sh(ellipse(600, 1190, 300, 96), '#b89a70', { opacity: 0.7 }));
  // grass tufts and pebbles
  for (let i = 0; i < 90; i++) {
    const x = g.range(0, W), y = g.range(SHORE + 40, H), s = 0.6 + (y - SHORE) / 700;
    const c = g.pick(['#5a7a42', '#7a9a52', '#4f6a3a', '#86a65a']);
    if (g.next() < 0.75) scene(sh(leaf(x, y, 14 * s, 2.6 * s, -100) + leaf(x, y, 12 * s, 2.4 * s, -70) + leaf(x, y, 11 * s, 2.4 * s, -130), c));
    else scene(sh(ellipse(x, y, 5 * s, 3 * s), g.pick(['#9a9488', '#b8b0a0', '#8a8478'])));
  }
  for (let i = 0; i < 16; i++) { const x = g.range(20, W - 20), y = g.range(SHORE + 60, H - 20); scene(sh(circle(x, y, 3.2), g.pick(['#f6dc9c', '#fbf6ec', '#e8799f'])), sh(circle(x, y, 1.2), '#c98a2a')); }
}

// =====================================================================
// tall pines framing the scene
// =====================================================================
scene(place(pineTree(560, PINE, 3), { x: 330, y: SHORE + 30 }), place(pineTree(460, PINE2, 4), { x: 740, y: SHORE + 20 }));
scene(place(pineTree(900, PINE, 1), { x: 70, y: 980 }), place(pineTree(760, PINE2, 2), { x: 190, y: 900 }));
scene(place(pineTree(980, PINE, 5), { x: 1130, y: 1020 }));
target('owl', 'Owl', place(owl(54, '#8a6a4a'), { x: 1102, y: 560 }));
scene(stroke(line([[1080, 562], [1150, 552]]), '#4a3222', 5));

// =====================================================================
// the vintage camper on the left
// =====================================================================
{
  const x0 = 150, x1 = 560, top = 840, base = 1050, cream = '#f4ead2', teal = '#4f9a9a';
  scene(shadow((x0 + x1) / 2 + 20, base + 22, 260, 18, 0.3));
  // hitch
  scene(stroke(line([[x0 - 10, base - 20], [x0 - 70, base + 6]]), '#3a3a40', 6), sh(rect(x0 - 84, base + 2, 22, 20, 3), '#3a3a40'));
  // body
  const body = M(x0 + 60, top) + L(x1 - 90, top) + Q(x1, top, x1, top + 100) + L(x1, base - 20) + Q(x1, base, x1 - 20, base) + L(x0 + 10, base) + Q(x0 - 10, base, x0 - 10, base - 20) + L(x0 - 10, top + 80) + Q(x0, top, x0 + 60, top) + 'Z';
  scene(ol(body, cream, 1.4, -0.3));
  scene(sh(M(x0 - 10, top + 120) + L(x1, top + 120) + L(x1, base - 20) + Q(x1, base, x1 - 20, base) + L(x0 + 10, base) + Q(x0 - 10, base, x0 - 10, base - 20) + 'Z', teal), sh(rect(x0 - 10, top + 112, x1 - x0 + 10, 8), '#c9ccd2'));
  scene(sh(rect(x0 + 40, top + 6, x1 - x0 - 140, 8, 4), '#ffffff', { opacity: 0.5 }));
  // windows glowing warm
  scene(sh(ellipse(x0 + 90, top + 70, 90, 70), `url(#${ID}-win)`, { opacity: 0.7 }), ol(rect(x0 + 30, top + 36, 120, 64, 16), '#ffe39a', 2, -0.5), stroke(line([[x0 + 90, top + 36], [x0 + 90, top + 100]]), '#c9a060', 2));
  scene(sh(M(x0 + 30, top + 40) + Q(x0 + 60, top + 30, x0 + 60, top + 70) + L(x0 + 60, top + 100) + L(x0 + 34, top + 100) + 'Z', '#e8665a', { opacity: 0.85 }), sh(M(x0 + 150, top + 40) + Q(x0 + 120, top + 30, x0 + 120, top + 70) + L(x0 + 120, top + 100) + L(x0 + 146, top + 100) + 'Z', '#e8665a', { opacity: 0.85 }));
  scene(ol(rect(x1 - 130, top + 40, 90, 54, 14), '#ffe39a', 2, -0.5), sh(rect(x1 - 126, top + 44, 82, 16, 8), '#e8665a', { opacity: 0.85 }));
  // door
  scene(ol(rect(x0 + 200, top + 30, 74, base - top - 40, 14), shade(cream, -0.04), 1.2, -0.3), sh(rect(x0 + 200, top + 120, 74, base - top - 130), shade(teal, -0.08)), ol(rect(x0 + 214, top + 44, 46, 50, 10), '#ffe39a', 1.4, -0.5), sh(circle(x0 + 262, top + 140, 4), '#c9ccd2'));
  scene(ol(rect(x0 + 190, base + 4, 94, 14, 3), '#8a8e96', 1), sh(rect(x0 + 200, base + 18, 74, 10, 2), '#6a6e76'));
  // wheel and fender
  scene(sh(circle(x1 - 120, base + 6, 38), '#2a2a2e'), sh(circle(x1 - 120, base + 6, 20), '#e8e2d4'), sh(circle(x1 - 120, base + 6, 7), '#8a8e96'));
  scene(ol(M(x1 - 172, base - 10) + Q(x1 - 170, base - 56, x1 - 120, base - 56) + Q(x1 - 70, base - 56, x1 - 68, base - 10) + 'Z', teal, 1.2));
  scene(sh(rect(x1 - 20, base - 70, 14, 22, 3), '#d2452f'), sh(rect(x0 - 8, base - 70, 10, 22, 3), '#f2c14e'));
  // striped awning stretching right
  let st = '', st2 = '';
  for (let i = 0; i < 6; i++) { const d = poly([[x1 - 120 + i * 36, top + 20], [x1 - 84 + i * 36, top + 20], [x1 - 20 + i * 46, top + 70], [x1 - 66 + i * 46, top + 70]]); if (i % 2) st += d; else st2 += d; }
  scene(sh(st, '#e8665a'), sh(st2, '#f4ead2'), stroke(line([[x1 + 90, top + 70], [x1 + 100, base + 10]]) + line([[x1 + 216, top + 70], [x1 + 226, base + 6]]), '#5a5a62', 3));
  let sc = '';
  for (let i = 0; i < 6; i++) sc += M(x1 - 66 + i * 46, top + 70) + Q(x1 - 43 + i * 46, top + 86, x1 - 20 + i * 46, top + 70) + 'Z';
  scene(sh(sc, '#e8665a'));
  // string lights from the awning to the pine
  const pts: Pt[] = [[x1 + 216, top + 76], [x1 + 280, top + 120], [x1 + 360, top + 110], [700, top + 40]];
  scene(stroke(curve(pts, 0.8), '#3a3a40', 1.2));
  const g = rng(14), cols = ['#ffd27a', '#ff9a6a', '#fff3c4', '#9ae0c0'];
  for (let i = 0; i < 9; i++) { const t = i / 8, x = x1 + 216 + t * (700 - x1 - 216), y = top + 76 + Math.sin(t * Math.PI) * 40 - t * 36; const c = g.pick(cols); scene(sh(circle(x, y + 6, 10), c, { opacity: 0.25 }), sh(ellipse(x, y + 6, 3.4, 5), c)); }
  // camper step clutter
  target('binoculars', 'Binoculars', place(binoculars(44, '#3a4a3a'), { x: 1046, y: 1186 }));
  target('firefly-jar', 'Jar of fireflies', place(fireflyJar(46), { x: x1 - 30, y: base - 76 }));
}
target('fishing-rod', 'Fishing rod', place(fishingRod(170), { x: 40, y: 1250, rot: 8 }));
// =====================================================================
// tent on the right
// =====================================================================
{
  const cx = 930, base = 1040, w = 330, h = 210, col = '#e8823a';
  scene(shadow(cx + 10, base + 8, w * 0.62, 18, 0.3));
  scene(stroke(line([[cx - w / 2 - 10, base - h * 0.4], [cx - w / 2 - 70, base + 10]]) + line([[cx + w / 2 + 10, base - h * 0.4], [cx + w / 2 + 70, base + 10]]), '#efe6d2', 1.4));
  scene(sh(poly([[cx - w / 2 - 74, base + 12], [cx - w / 2 - 66, base + 12], [cx - w / 2 - 70, base - 2]]) + poly([[cx + w / 2 + 66, base + 12], [cx + w / 2 + 74, base + 12], [cx + w / 2 + 70, base - 2]]), '#9a9488'));
  scene(ol(poly([[cx - w / 2, base], [cx, base - h], [cx + w / 2, base]]), col, 1.4, -0.35), sh(poly([[cx, base - h], [cx + w / 2, base], [cx + w * 0.1, base]]), shade(col, -0.18)));
  scene(sh(poly([[cx - w * 0.2, base], [cx, base - h + 26], [cx + w * 0.2, base]]), '#ffd27a'), sh(poly([[cx - w * 0.2, base], [cx, base - h + 26], [cx + w * 0.2, base]]), `url(#${ID}-win)`, { opacity: 0.8 }));
  scene(sh(poly([[cx - w * 0.2, base], [cx, base - h + 26], [cx - w * 0.06, base]]), shade(col, 0.12)), stroke(line([[cx, base - h], [cx, base - h - 20]]), '#5a5a62', 3), sh(poly([[cx, base - h - 22], [cx + 22, base - h - 16], [cx, base - h - 10]]), '#f2c14e'));
  scene(sh(rect(cx - w / 2, base - 18, w, 18), shade(col, -0.35), { opacity: 0.5 }));
  // sleeping bag peeking out
  scene(ol(blob([[cx - 40, base], [cx - 34, base - 30], [cx + 30, base - 34], [cx + 50, base]], 0.9), '#3f6b8e', 1), stroke(line([[cx - 30, base - 18], [cx + 40, base - 20]]), '#2f4a6a', 1.4));
  target('beanie', 'Bobble hat', place(beanie(48, '#3f8f6a', '#f6dc9c'), { x: cx - 120, y: base - 4, rot: -8 }));
}

// =====================================================================
// campfire with kettle, chairs
// =====================================================================
{
  const fx = 600, fy = 1170;
  scene(sh(ellipse(fx, fy - 30, 260, 180), `url(#${ID}-fire)`));
  // logs
  scene(ol(xf(rect(-70, -9, 140, 18, 8), { rot: 18, x: fx, y: fy - 4 }), '#6b4a30', 1), ol(xf(rect(-70, -9, 140, 18, 8), { rot: -18, x: fx, y: fy - 4 }), '#7a5a3a', 1));
  // flames
  scene(sh(blob([[fx - 50, fy - 6], [fx - 42, fy - 60], [fx - 20, fy - 40], [fx - 8, fy - 110], [fx + 16, fy - 50], [fx + 34, fy - 80], [fx + 50, fy - 6]], 0.9), '#f08a2b'));
  scene(sh(blob([[fx - 34, fy - 6], [fx - 26, fy - 44], [fx - 8, fy - 30], [fx + 2, fy - 80], [fx + 18, fy - 34], [fx + 34, fy - 6]], 0.9), '#f6c84a'), sh(blob([[fx - 16, fy - 6], [fx - 8, fy - 28], [fx + 4, fy - 50], [fx + 14, fy - 20], [fx + 16, fy - 6]], 0.9), '#fff3c4'));
  const g = rng(20);
  for (let i = 0; i < 10; i++) scene(sh(circle(fx + g.range(-50, 60), fy - g.range(120, 220), g.range(1.4, 2.8)), '#ffd27a', { opacity: g.range(0.5, 0.9) }));
  // ring of stones
  for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2; const x = fx + Math.cos(a) * 74, y = fy + Math.sin(a) * 24; scene(ol(ellipse(x, y, 16, 10), g.pick(['#8a8478', '#9a9488', '#7a756a']), 1)); }
  // grill on legs and the kettle
  scene(stroke(line([[fx - 76, fy + 6], [fx - 70, fy - 70]]) + line([[fx + 76, fy + 6], [fx + 70, fy - 70]]), '#3a3a40', 3.4), stroke(line([[fx - 80, fy - 70], [fx + 80, fy - 70]]), '#3a3a40', 4));
  target('kettle', 'Camp kettle', place(campKettle(70, '#3f7d6e'), { x: fx - 30, y: fy - 72 }));
  scene(stroke(curve([[fx - 20, fy - 128], [fx - 30, fy - 160], [fx - 14, fy - 190], [fx - 26, fy - 220]]), '#ffffff', 3, { opacity: 0.35 }));
  target('marshmallow', 'Toasted marshmallow', place(marshmallowStick(110), { x: fx + 140, y: fy - 50, sx: -1 }));
}
scene(place(campChair(110, '#2f6690'), { x: 380, y: 1200 }), place(campChair(110, '#c8322a'), { x: 830, y: 1210 }));
target('ukulele', 'Ukulele', place(ukulele(110, '#c98a4a'), { x: 840, y: 1130, rot: 24 }));

// =====================================================================
// foreground: picnic table, cooler, woodpile, log
// =====================================================================
{
  const x0 = 40, x1 = 560, ty = 1310;
  scene(shadow((x0 + x1) / 2, 1470, 300, 22, 0.3));
  // far bench
  scene(sh(rect(x0 + 20, ty - 40, x1 - x0 - 40, 14, 3), shade(WOOD, -0.15)));
  // legs
  scene(stroke(line([[x0 + 60, ty + 20], [x0 + 20, 1470]]) + line([[x0 + 60, ty + 20], [x0 + 110, 1470]]) + line([[x1 - 60, ty + 20], [x1 - 110, 1470]]) + line([[x1 - 60, ty + 20], [x1 - 20, 1470]]), '#6b4228', 12));
  // table top planks
  for (let i = 0; i < 4; i++) scene(ol(rect(x0, ty - 26 + i * 13, x1 - x0, 13, 3), i % 2 ? WOOD : shade(WOOD, 0.08), 0.8, -0.35));
  scene(ol(rect(x0 - 6, ty + 26, x1 - x0 + 12, 18, 3), shade(WOOD, -0.12), 1));
  let grain = '';
  for (let i = 0; i < 8; i++) grain += curve([[x0 + 30 + i * 60, ty - 20 + (i % 4) * 13], [x0 + 50 + i * 60, ty - 18 + (i % 4) * 13], [x0 + 70 + i * 60, ty - 21 + (i % 4) * 13]]);
  scene(stroke(grain, shade(WOOD, -0.3), 1));
  // near bench
  scene(ol(rect(x0 + 10, 1410, x1 - x0 - 20, 18, 3), shade(WOOD, 0.05), 1), sh(rect(x0 + 40, 1428, 14, 50) + rect(x1 - 54, 1428, 14, 50), '#6b4228'));
  // checked cloth
  let ck = '';
  for (let i = 0; i < 6; i++) for (let j = 0; j < 3; j++) if ((i + j) % 2 === 0) ck += rect(x0 + 150 + i * 22, ty - 30 + j * 16, 22, 16);
  scene(sh(rect(x0 + 150, ty - 30, 132, 48), '#fbf6ec'), sh(ck, '#c8322a', { opacity: 0.85 }));
  // things on the table
  target('map', 'Paper map', place(foldedMap(86), { x: x0 + 90, y: ty - 18, rot: -8 }));
  target('compass', 'Compass', place(compass(16), { x: x0 + 180, y: ty - 4 }));
  target('enamel-mug', 'Enamel mug', place(enamelMug(40, '#2f6690'), { x: x0 + 250, y: ty - 6 }));
  target('lantern', 'Camp lantern', place(campLantern(78, '#c8322a'), { x: x0 + 330, y: ty - 10 }));
  scene(ol(ellipse(x0 + 420, ty - 6, 30, 9), '#fbf6ec', 0.8, -0.2), sh(ellipse(x0 + 414, ty - 9, 12, 5), '#d99a48'), sh(ellipse(x0 + 428, ty - 8, 10, 4), '#c8322a'));
  scene(ol(rect(x0 + 456, ty - 40, 30, 34, 4), '#f2c14e', 0.8), sh(rect(x0 + 456, ty - 30, 30, 10), '#2f6690'), ol(ellipse(x0 + 210, ty + 4, 9, 3), '#fbf6ec', 0.6));
}
{
  // cooler, woodpile, axe, frying pan, boot, log with squirrel
  scene(shadow(700, 1420, 80, 10), ol(rect(624, 1340, 150, 80, 8), '#3f8fbf', 1.2), ol(rect(618, 1328, 162, 22, 6), '#fbf6ec', 1), sh(rect(680, 1354, 38, 10, 3), '#fbf6ec'), sh(rect(630, 1372, 138, 4), '#2f6a9a'));
  target('frying-pan', 'Frying pan', place(fryingPan(96), { x: 690, y: 1318 }));
  // wood pile
  const wx = 880, wy = 1470;
  scene(shadow(wx + 60, wy + 4, 140, 12));
  const g = rng(30);
  for (let r = 0; r < 4; r++) for (let i = 0; i < 6 - r; i++) {
    const x = wx - 40 + i * 44 + r * 22, y = wy - 18 - r * 36;
    scene(ol(circle(x, y, 20), '#a8784a', 1), sh(circle(x, y, 13), '#d9b07a'), stroke(circle(x, y, 7), '#a8784a', 1));
  }
  scene(stroke(line([[1100, 1470], [1150, 1350]]), '#8a5a35', 6), sh(poly([[1136, 1346], [1172, 1356], [1166, 1384], [1144, 1376]]), '#9aa0a6'));
  scene(place(hikingBoot(74, '#8a5a35'), { x: 760, y: 1480 }));
  target('flashlight', 'Flashlight', place(flashlight(80, '#f2c14e'), { x: 500, y: 1240, rot: -10 }));
  // log seat with the squirrel
  scene(shadow(1000, 1240, 110, 10), ol(rect(900, 1196, 200, 42, 20), '#7a5a3a', 1.2), ol(ellipse(1100, 1217, 14, 21), '#d9b07a', 1), stroke(circle(1100, 1217, 9), '#a8784a', 1), stroke(line([[920, 1210], [1060, 1208]]) + line([[930, 1224], [1070, 1226]]), '#5a3a24', 1.4));
  target('squirrel', 'Squirrel', place(squirrel(62, '#b8652e'), { x: 960, y: 1198 }));
  target('paddle', 'Canoe paddle', place(paddle(150, '#c98a4a', '#3f8fbf'), { x: 1078, y: 880, rot: 12 }));
  // a fallen pinecone scatter
  for (let i = 0; i < 6; i++) { const x = g.range(560, 1180), y = g.range(1260, 1490); scene(ol(ellipse(x, y, 6, 9, g.range(-60, 60)), '#7a5a3a', 0.8)); }
}
void L; void Q; void M;

const activity: FindActivity = {
  id: 'roadtrip-find-2', version: 1, mode: 'find', title: 'Campsite by the Lake',
  blurb: 'The first stars are out over the mountain lake: find sixteen camping treasures around the camper, the tent and the crackling fire.',
  added: '2026-11-25', collectionId: 'roadtrip', categories: ["Travel"], difficulty: 'Detailed',
  width: W, height: H, defs, items,
};
export default activity;
