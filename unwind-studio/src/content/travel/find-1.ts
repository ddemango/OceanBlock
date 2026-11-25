import { rect, ellipse, circle, poly, line, curve, blob, leaf, star, sector, sh, stroke, place, shade, mix, rng, xf, linearGradient, radialGradient } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { FindActivity, FindItem } from '../types';
import {
  M, L, Q, ol, shadow, passport, camera, umbrellaClosed, postcard, topHat, globe, key, foldedMap, binoculars, teacup, paperFan, deskBell, pocketWatch, snowGlobe,
  suitcase, flatCase, trunk, hatbox, pottedPalm, figure, type Pt,
} from './props-find';

const ID = 'travel-find-1';
const W = 1200, H = 1500;
const items: FindItem[] = [];
const scene = (...s: (Shape | Shape[])[]) => { items.push({ shapes: s.flat() }); };
const target = (id: string, name: string, shapes: Shape[]) => { items.push({ id, name, target: true, shapes }); };
const GOLD = '#d9b45a', GOLD_D = '#9c7a2e', WOOD = '#6b3a24', WOOD_L = '#8a4f32';

const defs =
  linearGradient(`${ID}-wall`, [[0, '#e9d3a6'], [1, '#dcc08e']]) +
  linearGradient(`${ID}-sky`, [[0, '#9ccbe8'], [1, '#e8f1f2']]) +
  linearGradient(`${ID}-floor`, [[0, '#cdb896'], [1, '#e8dcc4']]) +
  radialGradient(`${ID}-glow`, [[0, '#fff3c4'], [1, '#fff3c400']]);

// =====================================================================
// room shell: ceiling, wallpaper, wainscot, floor
// =====================================================================
const FLOOR_Y = 900;
scene(sh(rect(0, 0, W, FLOOR_Y), `url(#${ID}-wall)`));
{
  // damask wallpaper: stripes of small motifs
  const g = rng(11);
  for (let col = 0; col < 16; col++) {
    const x = 20 + col * 76;
    scene(sh(rect(x + 30, 90, 16, 670), '#e2c690', { opacity: 0.6 }));
    let mot = '';
    for (let row = 0; row < 10; row++) {
      const y = 130 + row * 66 + (col % 2) * 33;
      mot += xf(poly([[0, -12], [7, 0], [0, 12], [-7, 0]]), { x, y }) + circle(x, y - 18, 2.4) + circle(x, y + 18, 2.4);
    }
    scene(sh(mot, g.pick(['#cfae72', '#c9a66a'])));
  }
  // cornice
  let dent = '';
  for (let x = 0; x < W; x += 22) dent += rect(x, 56, 12, 14);
  scene(sh(rect(0, 0, W, 56), '#f3e6c8'), sh(rect(0, 0, W, 18), '#e6d3a8'), sh(dent, '#d9c393'), sh(rect(0, 70, W, 10), '#c9a86a'), sh(rect(0, 80, W, 6), '#a8854a'));
  let coff = '';
  for (let x = 30; x < W; x += 150) coff += rect(x, 22, 110, 26, 3);
  scene(sh(coff, '#ead9b2'), stroke(coff, '#cdb07a', 1.2));
  // wainscot
  scene(sh(rect(0, 760, W, 140), WOOD), sh(rect(0, 760, W, 12), WOOD_L), sh(rect(0, 772, W, 4), GOLD_D));
  for (let x = 14; x < W; x += 98) scene(sh(rect(x, 790, 84, 96, 3), shade(WOOD, 0.12)), stroke(rect(x + 6, 796, 72, 84, 2), shade(WOOD, -0.25), 1.4));
  scene(sh(rect(0, 888, W, 14), '#3e2114'));
}
{
  // checkered marble floor in perspective
  const vx = 600, vy = 430, rows = [FLOOR_Y, 930, 968, 1016, 1076, 1150, 1240, 1352, 1500];
  const at = (xb: number, y: number) => vx + (xb - vx) * (y - vy) / (1500 - vy);
  const g = rng(21);
  scene(sh(rect(0, FLOOR_Y, W, H - FLOOR_Y), `url(#${ID}-floor)`));
  for (let r = 0; r < rows.length - 1; r++) {
    const y0 = rows[r], y1 = rows[r + 1];
    for (let c = -10; c < 18; c++) {
      const xa = -800 + c * 150, xb = xa + 150;
      const p: Pt[] = [[at(xa, y0), y0], [at(xb, y0), y0], [at(xb, y1), y1], [at(xa, y1), y1]];
      if (Math.max(p[1][0], p[2][0]) < 0 || Math.min(p[0][0], p[3][0]) > W) continue;
      const dark = (r + c) % 2 === 0;
      const base = dark ? g.pick(['#7a5a48', '#6f5040', '#84604c']) : g.pick(['#efe6d4', '#e9dfca', '#f3ebdb']);
      scene(sh(poly(p), base, { stroke: shade(base, -0.15), strokeWidth: 0.8 }));
      if (!dark && g.next() < 0.6) { const mx = (p[0][0] + p[2][0]) / 2, my = (y0 + y1) / 2; scene(stroke(curve([[mx - 30, my - 6], [mx - 8, my + 2], [mx + 10, my - 4], [mx + 34, my + 6]]), '#cbbca0', 1, { opacity: 0.8 })); }
    }
  }
  scene(sh(rect(0, FLOOR_Y, W, 40), '#2a1a10', { opacity: 0.12 }));
}

// =====================================================================
// revolving door (left)
// =====================================================================
{
  const x0 = 60, x1 = 380, top = 340, bot = 892;
  // fan transom
  scene(sh(M(x0, top) + L(x0, 250) + Q(x0, 150, 220, 150) + Q(x1, 150, x1, 250) + L(x1, top) + 'Z', '#5a3220'));
  scene(sh(M(x0 + 16, top) + L(x0 + 16, 254) + Q(x0 + 16, 168, 220, 168) + Q(x1 - 16, 168, x1 - 16, 254) + L(x1 - 16, top) + 'Z', '#cfe2ea'));
  let rays = '';
  for (let i = 0; i <= 8; i++) { const a = Math.PI + (Math.PI * i) / 8; rays += line([[220, top - 4], [220 + Math.cos(a) * 150, top - 4 + Math.sin(a) * 160]]); }
  scene(stroke(rays, GOLD, 3), sh(sector(220, top - 4, 40, 180, 360), GOLD), sh(sector(220, top - 4, 26, 180, 360), '#f6e6b0'));
  // outside view
  scene(sh(rect(x0, top, x1 - x0, bot - top), `url(#${ID}-sky)`));
  scene(sh(rect(x0, 440, x1 - x0, 300), '#e8c79a'), sh(rect(x0, 430, x1 - x0, 14), '#c99a6a'));
  for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) scene(sh(rect(x0 + 18 + i * 78, 462 + j * 84, 40, 58, 3), '#7ea3b8'), sh(rect(x0 + 18 + i * 78, 462 + j * 84, 40, 10), '#f6f2e6'), sh(rect(x0 + 14 + i * 78, 520 + j * 84, 48, 5), '#b98b5a'));
  scene(sh(rect(x0, 740, x1 - x0, 152), '#b9b1a4'), sh(rect(x0, 740, x1 - x0, 8), '#9a9184'));
  let cob = '';
  for (let r = 0; r < 6; r++) for (let c = 0; c < 10; c++) cob += rect(x0 + c * 34 + (r % 2) * 17, 760 + r * 22, 28, 16, 4);
  scene(sh(cob, '#c9c1b2'));
  scene(sh(rect(312, 560, 6, 200), '#2f3337'), sh(poly([[300, 560], [330, 560], [324, 536], [306, 536]]), '#2f3337'), sh(rect(306, 540, 18, 16), '#ffe7a8'));
  scene(sh(blob([[90, 600], [110, 520], [170, 500], [210, 560], [190, 620], [120, 630]]), '#5c8a45'), sh(blob([[110, 560], [150, 520], [190, 560], [160, 600]]), '#7aa65a'), sh(rect(144, 610, 10, 140), '#6b4a2f'));
  scene(place(figure(150, '#8c3b2e', 3), { x: 236, y: 812 }), place(figure(130, '#2f6690', 8), { x: 120, y: 790 }));
  // drum, glass and wings
  scene(sh(rect(x0, top, x1 - x0, bot - top), '#d8eef4', { opacity: 0.22 }));
  scene(stroke(line([[x0 + 30, top + 60], [x0 + 110, top + 220]]) + line([[x0 + 46, top + 60], [x0 + 126, top + 220]]) + line([[x1 - 90, top + 300], [x1 - 30, top + 420]]), '#ffffff', 5, { opacity: 0.35 }));
  // side fixed panels
  scene(sh(rect(x0, top, 18, bot - top) + rect(x1 - 18, top, 18, bot - top), WOOD), sh(rect(x0 + 18, top, 4, bot - top) + rect(x1 - 22, top, 4, bot - top), GOLD));
  // angled wings
  scene(sh(poly([[96, top + 40], [150, top + 30], [150, bot - 30], [96, bot - 40]]), '#bfdde8', { opacity: 0.5, stroke: GOLD, strokeWidth: 5 }));
  scene(sh(poly([[344, top + 40], [290, top + 30], [290, bot - 30], [344, bot - 40]]), '#bfdde8', { opacity: 0.5, stroke: GOLD, strokeWidth: 5 }));
  // front wing
  scene(sh(rect(164, top + 26, 112, bot - top - 52), '#cfe8f0', { opacity: 0.35 }), stroke(rect(164, top + 26, 112, bot - top - 52, 2), GOLD, 7), stroke(rect(170, top + 32, 100, bot - top - 64, 2), GOLD_D, 1.5));
  scene(sh(rect(164, 640, 112, 12), GOLD), sh(rect(164, 652, 112, 3), GOLD_D), sh(rect(214, top + 26, 12, bot - top - 52), GOLD));
  // canopy & base
  scene(sh(rect(x0 - 10, top - 14, x1 - x0 + 20, 48, 6), WOOD), sh(rect(x0 - 10, top - 14, x1 - x0 + 20, 10, 4), WOOD_L), sh(rect(x0 - 10, top + 26, x1 - x0 + 20, 6), GOLD), sh(rect(x0 + 60, top - 4, 200, 24, 3), '#3e2114'));
  let studs = '';
  for (let i = 0; i < 9; i++) studs += circle(x0 + 76 + i * 21, top + 8, 3);
  scene(sh(studs, GOLD));
  scene(sh(ellipse(220, bot + 2, 186, 14), '#5a3220'), sh(ellipse(220, bot - 2, 180, 10), GOLD_D), sh(ellipse(220, bot - 4, 172, 7), '#c9a86a'));
  // marble surround pilasters
  scene(sh(rect(30, 140, 30, 760), '#efe4cc'), sh(rect(380, 140, 34, 760), '#efe4cc'), sh(rect(52, 140, 8, 760) + rect(380, 140, 8, 760), '#cdbf9e'), sh(rect(24, 128, 42, 18, 3) + rect(374, 128, 46, 18, 3), '#e2d3b0'));
  let veins = '';
  for (let i = 0; i < 6; i++) veins += curve([[36, 200 + i * 120], [48, 240 + i * 120], [40, 290 + i * 120]]) + curve([[396, 180 + i * 120], [408, 230 + i * 120], [398, 280 + i * 120]]);
  scene(stroke(veins, '#c9b996', 1));
  // doormat
  scene(sh(poly([[90, 900], [350, 900], [380, 940], [60, 940]]), '#7a2a2a'), stroke(poly([[100, 906], [340, 906], [364, 934], [76, 934]]), GOLD, 2));
}

// =====================================================================
// back wall decor: clock, painting, sconces, key board
// =====================================================================
function sconce(): Shape[] {
  return [
    sh(circle(0, -10, 46), `url(#${ID}-glow)`), ol(rect(-10, 14, 20, 30, 4), GOLD, 1, -0.4), stroke(M(0, 30) + Q(-30, 30, -26, 0) + M(0, 30) + Q(30, 30, 26, 0), GOLD, 3),
    ol(M(-38, 0) + L(-14, 0) + L(-20, -26) + L(-32, -26) + 'Z', '#f6ead0', 1, -0.2), ol(M(38, 0) + L(14, 0) + L(20, -26) + L(32, -26) + 'Z', '#f6ead0', 1, -0.2),
  ];
}
{
  // painting of distant mountains
  const px = 476, py = 300, pw = 150, ph = 120;
  scene(sh(rect(px - 14, py - 14, pw + 28, ph + 28, 3), GOLD_D), sh(rect(px - 10, py - 10, pw + 20, ph + 20, 2), GOLD), sh(rect(px, py, pw, ph), '#bcdbe6'));
  scene(sh(poly([[px, py + 90], [px + 40, py + 40], [px + 70, py + 70], [px + 100, py + 30], [px + pw, py + 80], [px + pw, py + ph], [px, py + ph]]), '#7f9cab'), sh(poly([[px + 90, py + 40], [px + 100, py + 30], [px + 110, py + 40]]), '#ffffff'));
  scene(sh(rect(px, py + 92, pw, 28), '#7fa06a'), sh(circle(px + 120, py + 22, 10), '#f6e6a0'));
  scene(place(sconce(), { x: 700, y: 330 }), place(sconce(), { x: 1130, y: 330 }));
  // clock
  const cx = 915, cy = 250, r = 56;
  let ticks = '';
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; ticks += line([[cx + Math.cos(a) * r * 0.7, cy + Math.sin(a) * r * 0.7], [cx + Math.cos(a) * r * 0.84, cy + Math.sin(a) * r * 0.84]]); }
  scene(sh(sector(cx, cy, r + 26, 180, 360), WOOD), sh(star(cx, cy - r - 24, 12, 5, 8), GOLD), ol(circle(cx, cy, r + 8), GOLD, 1.4, -0.4), sh(circle(cx, cy, r), '#fbf6e8'), stroke(ticks, '#3a2a22', 2.4));
  scene(stroke(line([[cx, cy], [cx + 4, cy - 38]]) + line([[cx, cy], [cx + 28, cy + 10]]), '#2a1a10', 3), sh(circle(cx, cy, 4), '#2a1a10'));
}
{
  // key board: cabinet of pigeonholes with envelopes and tags
  const kx = 760, ky = 360, cw = 52, chh = 58, cols = 6, rows = 4;
  scene(sh(rect(kx - 18, ky - 30, cols * cw + 36, rows * chh + 52, 4), WOOD), sh(rect(kx - 24, ky - 38, cols * cw + 48, 14, 3), WOOD_L), sh(rect(kx - 18, ky - 22, cols * cw + 36, 4), GOLD));
  const g = rng(31);
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const x = kx + c * cw, y = ky + r * chh;
    scene(sh(rect(x + 3, y + 3, cw - 6, chh - 6), '#3e2114'), sh(circle(x + cw / 2, y + 14, 2.6), GOLD));
    const roll = g.next();
    if (r === 2 && c === 3) continue; // postcard slot
    if (roll < 0.45) scene(ol(xf(rect(-17, -11, 34, 22, 1), { rot: g.range(-12, 12), x: x + cw / 2, y: y + chh - 18 }), g.pick(['#f6efdc', '#efe2c2', '#f3e8d0']), 0.8, -0.25), stroke(xf(line([[-17, -11], [0, 2], [17, -11]]), { rot: 0, x: x + cw / 2, y: y + chh - 18 }), '#b9a88a', 0.9));
    else if (roll < 0.8) scene(stroke(line([[x + cw / 2, y + 16], [x + cw / 2, y + 26]]), GOLD_D, 1.4), ol(rect(x + cw / 2 - 7, y + 26, 14, 18, 3), g.pick(['#c8322a', '#2f6690', '#3f7d4e', '#d9b45a']), 0.8));
  }
  target('postcard', 'Postcard', place(postcard(46), { x: kx + 3 * cw + cw / 2, y: ky + 2 * chh + chh - 20, rot: 8 }));
  scene(sh(rect(kx - 18, ky + rows * chh + 10, cols * cw + 36, 12), WOOD_L));
}

// =====================================================================
// chandelier
// =====================================================================
{
  const cx = 600;
  let links = '';
  for (let y = 4; y < 86; y += 9) links += ellipse(cx, y, 3, 5);
  scene(sh(ellipse(cx, 6, 34, 10), GOLD_D), stroke(links, GOLD, 1.6));
  scene(sh(circle(cx, 200, 170), `url(#${ID}-glow)`, { opacity: 0.8 }));
  const g = rng(41);
  const tier = (y: number, span: number, n: number, sag: number) => {
    const out: Shape[] = [];
    let arms = '', drops = '', drops2 = '';
    for (let i = 0; i < n; i++) {
      const dx = -span + (2 * span * i) / (n - 1), ex = cx + dx, ey = y - 18 - Math.abs(dx) * 0.05;
      arms += M(cx, y + 12) + Q(cx + dx * 0.55, y + sag + Math.abs(dx) * 0.2, ex, ey + 8);
      out.push(sh(ellipse(ex, ey + 8, 12, 4), GOLD), sh(rect(ex - 4, ey - 18, 8, 24, 1), '#fbf6e8'), sh(leaf(ex, ey - 19, 12, 4, -90), '#f6a32c'), sh(circle(ex, ey - 24, 12), '#fff3c4', { opacity: 0.45 }));
      for (let k = 0; k < 2; k++) { const d = leaf(ex + (k ? 6 : -6), ey + 14, g.range(12, 18), 3.6, 90); if ((i + k) % 2) drops += d; else drops2 += d; }
      if (i < n - 1) {
        const nx = cx + (-span + (2 * span * (i + 1)) / (n - 1));
        for (let k = 1; k < 6; k++) { const t = k / 6; drops += circle(ex + (nx - ex) * t, ey + 12 + Math.sin(Math.PI * t) * 16, 2.4); }
      }
    }
    out.unshift(stroke(arms, GOLD, 4), stroke(arms, GOLD_D, 1));
    out.push(sh(drops, '#e8f4fa', { stroke: '#a8c8d8', strokeWidth: 0.6 }), sh(drops2, '#cfe6f2', { stroke: '#a8c8d8', strokeWidth: 0.6 }));
    return out;
  };
  scene(sh(ellipse(cx, 96, 14, 10) + ellipse(cx, 120, 18, 14) + rect(cx - 6, 96, 12, 140), GOLD));
  scene(tier(120, 70, 5, 30));
  scene(sh(ellipse(cx, 196, 34, 16), GOLD), sh(ellipse(cx, 192, 30, 8), '#f3dc9a'));
  scene(tier(206, 150, 7, 46));
  scene(sh(ellipse(cx, 236, 18, 22), GOLD), sh(leaf(cx, 252, 34, 7, 90), '#e8f4fa', { stroke: '#a8c8d8', strokeWidth: 0.8 }), sh(circle(cx, 290, 6), GOLD));
}

// =====================================================================
// reception desk (right)
// =====================================================================
{
  const x0 = 640, x1 = 1186, top = 712;
  // stuff standing on the desk (behind the counter top line)
  // flowers
  const g = rng(51);
  let stems = '';
  for (let i = 0; i < 9; i++) stems += M(700, 690) + Q(700 + (i - 4) * 6, 640, 700 + (i - 4) * 14, 600 + g.range(-20, 10));
  scene(stroke(stems, '#4f7a3a', 1.6));
  for (let i = 0; i < 9; i++) { const fx = 700 + (i - 4) * 14 + g.range(-3, 3), fy = 600 + g.range(-24, 10); scene(sh(blob([[fx - 9, fy], [fx, fy - 9], [fx + 9, fy], [fx, fy + 9]], 1), g.pick(['#e88aa8', '#f6f0e0', '#d2452f', '#f2b92e'])), sh(circle(fx, fy, 3), '#f6d23c')); }
  for (let i = 0; i < 6; i++) scene(sh(leaf(700, 650, g.range(26, 36), 7, -170 + i * 32), '#5c8a45'));
  scene(ol(M(684, 712) + Q(672, 680, 690, 660) + L(710, 660) + Q(728, 680, 716, 712) + 'Z', '#3f7fa8', 1), sh(rect(682, 676, 36, 6), GOLD));
  // banker's lamp
  scene(ol(rect(990, 700, 60, 12, 3), GOLD, 1, -0.4), sh(rect(1017, 660, 6, 42), GOLD_D), ol(M(986, 664) + Q(1020, 640, 1054, 664) + L(1050, 676) + L(990, 676) + 'Z', '#2f6b4a', 1), sh(ellipse(1020, 678, 30, 6), '#fff3c4', { opacity: 0.8 }));
  // ledger, pens, brochure stand
  scene(ol(poly([[840, 712], [960, 712], [954, 700], [846, 700]]), '#f6efdc', 1, -0.25), sh(rect(842, 708, 116, 6), '#7a2a2a'), stroke(line([[900, 700], [900, 712]]), '#b9a88a', 1));
  scene(ol(rect(1086, 680, 26, 32, 3), '#3a2a22', 1), stroke(line([[1092, 682], [1086, 652]]) + line([[1100, 682], [1104, 650]]), '#2f2f33', 2.4), sh(circle(1104, 650, 3), GOLD));
  scene(ol(rect(800, 660, 6, 52), '#6b4a2f', 1));
  // counter
  scene(sh(rect(x0, top, x1 - x0, 250), WOOD), sh(rect(x0, top - 14, x1 - x0 + 10, 22, 3), '#efe4cc'), sh(rect(x0, top - 14, x1 - x0 + 10, 6, 3), '#fbf6e8'), sh(rect(x0, top + 6, x1 - x0, 6), GOLD));
  let mv = '';
  for (let i = 0; i < 8; i++) mv += curve([[x0 + 20 + i * 70, top - 10], [x0 + 50 + i * 70, top - 4], [x0 + 70 + i * 70, top - 8]]);
  scene(stroke(mv, '#cdbf9e', 1));
  for (let i = 0; i < 5; i++) {
    const px = x0 + 18 + i * 106;
    scene(sh(rect(px, top + 30, 92, 190, 3), WOOD_L), sh(rect(px + 8, top + 38, 76, 174, 2), shade(WOOD, 0.05)), stroke(rect(px + 14, top + 44, 64, 162, 2), GOLD_D, 1.4));
    scene(sh(xf(poly([[0, -26], [16, 0], [0, 26], [-16, 0]]), { x: px + 46, y: top + 125 }), shade(WOOD_L, 0.15)), sh(xf(poly([[0, -12], [8, 0], [0, 12], [-8, 0]]), { x: px + 46, y: top + 125 }), GOLD));
  }
  scene(sh(rect(x0, 948, x1 - x0, 14), '#3e2114'), sh(rect(x0, 944, x1 - x0, 4), GOLD_D));
  // targets on the desk
  target('desk-bell', 'Desk bell', place(deskBell(56), { x: 776, y: 700 }));
  target('room-key', 'Room key', place(key(54, GOLD, '#c8322a'), { x: 906, y: 694, rot: -8 }));
  target('snow-globe', 'Snow globe', place(snowGlobe(46), { x: 1066, y: 702 }));
  target('globe', 'Globe', place(globe(78), { x: 1150, y: 652 }));
}

// =====================================================================
// middle: palm, umbrella stand, trolley
// =====================================================================
scene(place(pottedPalm(380, 61, '#3f7fa8'), { x: 560, y: 960 }));
{
  // umbrella stand by the door
  const ux = 250, uy = 1064;
  scene(shadow(ux + 6, uy, 40, 7), place(umbrellaClosed(150, '#2f3a5a'), { x: ux - 14, y: uy - 112, rot: -12 }), place(umbrellaClosed(140, '#3f6b4a'), { x: ux + 12, y: uy - 108, rot: 10 }));
  target('red-umbrella', 'Red umbrella', place(umbrellaClosed(150, '#b8322a'), { x: ux, y: uy - 124, rot: -1 }));
  scene(ol(poly([[ux - 30, uy - 68], [ux + 30, uy - 68], [ux + 24, uy], [ux - 24, uy]]), '#8a6a3a', 1), sh(rect(ux - 30, uy - 68, 60, 8), GOLD), sh(rect(ux - 26, uy - 18, 52, 6), GOLD), stroke(line([[ux - 14, uy - 56], [ux - 14, uy - 22]]) + line([[ux, uy - 56], [ux, uy - 22]]) + line([[ux + 14, uy - 56], [ux + 14, uy - 22]]), '#6b4a2a', 1.4));
}
{
  // luggage trolley
  const xl = 304, xr = 612, base = 1176, topY = 650;
  scene(sh(ellipse(458, base + 20, 190, 18), '#2a1a10', { opacity: 0.25 }));
  scene(stroke(M(xl, base) + L(xl, 720) + Q(xl, topY - 30, 458, topY - 30) + Q(xr, topY - 30, xr, 720) + L(xr, base), GOLD, 9), stroke(M(xl, base) + L(xl, 720) + Q(xl, topY - 30, 458, topY - 30) + Q(xr, topY - 30, xr, 720) + L(xr, base), GOLD_D, 1.5));
  scene(stroke(line([[xl + 30, 690], [xr - 30, 690]]), GOLD, 5));
  // garment bag on the rail
  scene(stroke(M(360, 690) + Q(360, 676, 370, 676), '#3a3a3f', 2), ol(M(340, 700) + L(400, 700) + L(408, 860) + L(332, 860) + 'Z', '#4a5a6a', 1), stroke(line([[370, 704], [370, 856]]), '#2f3a45', 1.4), sh(rect(354, 700, 32, 10, 3), '#3a4652'));
  // stack
  scene(place(trunk(286, 118, '#7a4a2f', '#3a2418'), { x: 458, y: base - 10 }));
  scene(place(suitcase(246, 96, '#c9a06a', { seed: 3, trim: '#6b3f22' }), { x: 444, y: base - 128 }));
  scene(place(suitcase(196, 78, '#3f6b8a', { seed: 7, trim: '#2a3a4a' }), { x: 470, y: base - 224 }));
  scene(place(hatbox(98, 70, '#e8c7c0', '#d27a7a'), { x: 404, y: base - 302 }));
  scene(place(flatCase(120, 30, '#8a3a3a', 4), { x: 520, y: base - 302 }));
  target('top-hat', 'Top hat', place(topHat(72), { x: 524, y: base - 334 }));
  // strap & camera hanging from the rail
  scene(stroke(M(566, 690) + Q(574, 740, 584, 770), '#3a2a22', 2.4));
  target('camera', 'Camera', place(camera(56), { x: 584, y: 790, rot: 6 }));
  // platform & wheels
  scene(sh(rect(xl - 16, base - 10, xr - xl + 32, 22, 4), '#8c2b2b'), sh(rect(xl - 16, base - 10, xr - xl + 32, 6, 3), '#a83a3a'), sh(rect(xl - 18, base + 10, xr - xl + 36, 6, 2), GOLD));
  for (const wx of [xl + 6, xl + 90, xr - 90, xr - 6]) scene(sh(circle(wx, base + 30, 15), '#2a2a2e'), sh(circle(wx, base + 30, 6), GOLD));
}
{
  // bags waiting by the desk
  scene(place(suitcase(118, 140, '#5a7a4a', { seed: 12, straps: false }), { x: 770, y: 1062 }));
  scene(place(suitcase(140, 100, '#d9b45a', { seed: 14, trim: '#7a5a2a' }), { x: 900, y: 1068 }));
  scene(place(flatCase(170, 40, '#7a3a5a', 9), { x: 1050, y: 1060 }), place(flatCase(150, 34, '#3a5a7a', 10), { x: 1046, y: 1020 }));
  // duffel bag
  scene(ol(blob([[970, 1010], [1000, 976], [1100, 972], [1136, 1004], [1120, 1020], [990, 1020]], 0.8), '#8a6a4a', 1.2), stroke(M(1000, 984) + Q(1050, 940, 1100, 980), '#4a3a2a', 3), stroke(line([[996, 998], [1120, 994]]), '#5a4a3a', 1.4));
  target('folded-map', 'Folded map', place(foldedMap(64), { x: 1038, y: 966, rot: -6 }));
}
scene(place(pottedPalm(330, 77, '#c9673f'), { x: 1130, y: 1250 }));

// =====================================================================
// rug & seating (foreground)
// =====================================================================
{
  const rug = poly([[350, 1200], [1010, 1200], [1080, 1470], [280, 1470]]);
  scene(sh(rug, '#8c2b2b'), stroke(poly([[366, 1212], [994, 1212], [1058, 1458], [302, 1458]]), GOLD, 4), sh(poly([[396, 1232], [964, 1232], [1020, 1436], [340, 1436]]), '#2f4a6a'));
  scene(sh(poly([[430, 1256], [930, 1256], [976, 1412], [384, 1412]]), '#a83a3a'));
  const g = rng(71);
  for (let i = 0; i < 7; i++) { const x = 470 + i * 72, y = 1336; scene(sh(xf(poly([[0, -30], [24, 0], [0, 30], [-24, 0]]), { x, y }), i % 2 ? '#e2c47a' : '#2f4a6a'), sh(xf(star(0, 0, 10, 4, 8), { x, y }), g.pick(['#f6efdc', '#c8322a']))); }
  let fringe = '';
  for (let x = 284; x < 1080; x += 10) fringe += line([[x, 1470], [x - 1, 1484]]);
  scene(stroke(fringe, '#e2c47a', 2));
}
function cushion(x: number, y: number, rot: number, col: string): Shape[] {
  const d = M(-24, -20) + Q(0, -14, 24, -20) + Q(18, 0, 24, 20) + Q(0, 14, -24, 20) + Q(-18, 0, -24, -20) + 'Z';
  return [ol(xf(d, { rot, x, y }), col, 1), sh(xf(circle(0, 0, 3), { x, y }), shade(col, -0.3)), sh(xf(circle(-24, -20, 3) + circle(24, -20, 3) + circle(24, 20, 3) + circle(-24, 20, 3), { rot, x, y }), shade(col, -0.2))];
}
function armchair(w: number, h: number, col: string): Shape[] {
  const d = shade(col, -0.22), l = shade(col, 0.15);
  let tufts = '';
  for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) tufts += circle(-w * 0.24 + i * w * 0.16, -h * 0.86 + j * h * 0.16, 2.4);
  return [
    shadow(0, 0, w * 0.56, 12), sh(rect(-w * 0.42, -h * 0.12, 10, h * 0.12) + rect(w * 0.42 - 10, -h * 0.12, 10, h * 0.12), '#3e2114'),
    ol(M(-w * 0.36, -h * 0.42) + L(-w * 0.36, -h * 0.9) + Q(-w * 0.36, -h * 1.06, 0, -h * 1.06) + Q(w * 0.36, -h * 1.06, w * 0.36, -h * 0.9) + L(w * 0.36, -h * 0.42) + 'Z', col, 1.4),
    sh(M(-w * 0.28, -h * 0.46) + L(-w * 0.28, -h * 0.88) + Q(0, -h * 0.98, w * 0.28, -h * 0.88) + L(w * 0.28, -h * 0.46) + 'Z', l), sh(tufts, d),
    ol(rect(-w * 0.4, -h * 0.46, w * 0.8, h * 0.34, 10), col, 1.4), sh(rect(-w * 0.36, -h * 0.46, w * 0.72, h * 0.1, 8), l),
    ol(rect(-w / 2, -h * 0.64, w * 0.16, h * 0.54, 12), d, 1.2), ol(rect(w / 2 - w * 0.16, -h * 0.64, w * 0.16, h * 0.54, 12), d, 1.2),
    sh(ellipse(-w / 2 + w * 0.08, -h * 0.62, w * 0.09, h * 0.05) + ellipse(w / 2 - w * 0.08, -h * 0.62, w * 0.09, h * 0.05), shade(d, 0.2)),
    sh(rect(-w * 0.4, -h * 0.14, w * 0.8, 6), GOLD_D),
  ];
}
{
  // left armchair & side table
  scene(place(armchair(250, 270, '#2f6b5a'), { x: 150, y: 1360 }));
  target('passport', 'Passport', place(passport(52, '#1f3a5a'), { x: 128, y: 1180, rot: -14 }));
  scene(cushion(196, 1168, 10, '#e2c47a'));
  scene(shadow(330, 1426, 46, 8), sh(rect(326, 1300, 8, 126), '#3e2114'), sh(rect(308, 1416, 44, 8, 2), '#3e2114'), ol(ellipse(330, 1300, 52, 12), WOOD_L, 1));
  scene(ol(rect(304, 1234, 18, 60, 3), '#efe4cc', 1), ol(poly([[290, 1236], [336, 1236], [326, 1196], [300, 1196]]), '#f6d8a0', 1, -0.3), sh(circle(313, 1220, 30), `url(#${ID}-glow)`, { opacity: 0.8 }));
  target('paper-fan', 'Paper fan', place(paperFan(58, '#2f6b5a', '#e2c47a'), { x: 352, y: 1290, rot: 15 }));
}
{
  // coffee table
  scene(shadow(640, 1452, 140, 14), sh(rect(530, 1390, 12, 60) + rect(738, 1390, 12, 60), '#3e2114'), ol(rect(510, 1370, 260, 22, 4), WOOD_L, 1.2), sh(rect(510, 1370, 260, 6, 3), '#a86a46'));
  scene(ol(rect(546, 1352, 70, 18, 2), '#7a2a2a', 1), sh(rect(548, 1356, 66, 4), '#f6efdc'), ol(rect(552, 1338, 60, 14, 2), '#2f4a6a', 1));
  target('teacup', 'Teacup', place(teacup(54), { x: 672, y: 1370 }));
  target('pocket-watch', 'Pocket watch', place(pocketWatch(16), { x: 728, y: 1356 }));
  scene(ol(ellipse(590, 1336, 16, 4), '#fbf6ec', 0.8));
}
{
  // right armchair
  scene(place(armchair(240, 256, '#8c3b4a'), { x: 900, y: 1470 }));
  target('binoculars', 'Binoculars', place(binoculars(54, '#3a2a22'), { x: 880, y: 1278, rot: -10 }));
  scene(cushion(952, 1292, -8, '#c9a86a'));
}
// little extras on the floor
scene(place(hatbox(70, 52, '#2f4a6a', '#e2c47a'), { x: 1040, y: 1460 }));
scene(place(suitcase(90, 120, '#b8322a', { seed: 19, straps: false }), { x: 46, y: 1480 }));
void blob; void mix; void radialGradient;

const activity: FindActivity = {
  id: ID, version: 1, mode: 'find', title: 'The Grand Hotel Lobby',
  blurb: 'Check in beneath the chandelier and spot fourteen traveller’s treasures among the trunks, palms and polished brass.',
  collectionId: 'travel', categories: ['Travel', 'Interiors', 'Architecture'], difficulty: 'Moderate',
  width: W, height: H, defs, items,
};
export default activity;
