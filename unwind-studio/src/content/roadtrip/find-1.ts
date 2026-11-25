import { rect, ellipse, circle, poly, line, curve, blob, sh, stroke, place, shade, rng, xf, linearGradient, radialGradient } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { FindActivity, FindItem } from '../types';
import {
  M, L, Q, ol, shadow, GOLD, neckPillow, boardingPass, passport, coffeeCup, croissant, headphones, sunglasses, toyPlane, camera, waterBottle,
  luggageTag, wristwatch, book, umbrellaClosed, magazine, figure, rollerCase, suitcase, backpack, pottedPalm, cloud,
} from './props-find';

const ID = 'roadtrip-find-1';
const W = 1200, H = 1500;
const items: FindItem[] = [];
const scene = (...s: (Shape | Shape[])[]) => { items.push({ shapes: s.flat() }); };
const target = (id: string, name: string, shapes: Shape[]) => { items.push({ id, name, target: true, shapes }); };

const FRAME = '#5a6470', FRAME_L = '#7a848e', SEAT = '#2f5a78', SEAT2 = '#3f7d8e', CHROME = '#b8bec6';
const HORIZON = 470, SILL = 640;

const defs =
  linearGradient(`${ID}-sky`, [[0, '#8fc4e6'], [0.65, '#cfe6f2'], [1, '#f6ead0']]) +
  linearGradient(`${ID}-tarmac`, [[0, '#9aa0a2'], [1, '#7f8588']]) +
  linearGradient(`${ID}-floor`, [[0, '#c9b49a'], [1, '#b89c7e']]) +
  linearGradient(`${ID}-glass`, [[0, '#ffffff'], [1, '#ffffff00']], 0, 0, 1, 1) +
  radialGradient(`${ID}-glow`, [[0, '#fff6d8'], [1, '#fff6d800']]);

// =====================================================================
// the view: sky, hills, apron and the waiting plane
// =====================================================================
scene(sh(rect(0, 100, W, HORIZON - 100), `url(#${ID}-sky)`));
scene(place(cloud(220), { x: 210, y: 210 }), place(cloud(160, '#ffffff', 0.8), { x: 560, y: 170 }), place(cloud(260, '#ffffff', 0.85), { x: 900, y: 360 }), place(cloud(120, '#ffffff', 0.7), { x: 420, y: 330 }));
scene(sh(blob([[0, HORIZON], [0, 420], [140, 400], [300, 424], [460, 396], [620, 418], [760, 404], [940, 426], [1100, 402], [1200, 416], [1200, HORIZON]], 0.6), '#a9c2b4'));
scene(sh(blob([[0, HORIZON], [0, 448], [200, 436], [400, 452], [620, 438], [820, 452], [1040, 440], [1200, 450], [1200, HORIZON]], 0.6), '#8fb09a'));
{
  // control tower and terminal far off
  scene(sh(rect(1010, 330, 22, 120), '#c9d2d8'), sh(poly([[990, 330], [1052, 330], [1046, 300], [996, 300]]), '#5a7a8e'), sh(rect(994, 292, 54, 10, 2), '#e8eef0'), sh(rect(1018, 270, 6, 22), '#c9d2d8'), sh(circle(1021, 268, 4), '#d2452f'));
  const g = rng(2);
  for (let x = 560; x < 1200; x += 46) { const h = g.range(14, 34); scene(sh(rect(x, HORIZON - h, 42, h), g.pick(['#d8dfe4', '#c9d2d8', '#e2e6e8']))); }
}
scene(sh(rect(0, HORIZON, W, SILL - HORIZON), `url(#${ID}-tarmac)`));
{
  let marks = '';
  for (let x = -40; x < W; x += 120) marks += rect(x, 600, 70, 5);
  scene(sh(marks, '#f6f0e0', { opacity: 0.8 }), stroke(curve([[0, 520], [300, 540], [700, 548], [1200, 532]]), '#f2c14e', 4), stroke(line([[0, 490], [W, 490]]), '#8a9092', 2));
  let lights = '';
  for (let x = 20; x < W; x += 80) lights += circle(x, 486, 2.6);
  scene(sh(lights, '#7fd6f6'));
}
{
  // the airliner, nose pointing right
  const cy = 488, x0 = 150, x1 = 880, r = 42;
  const body = '#f8f8f6', belly = '#dfe4e8', stripe = '#2f7d8e';
  scene(shadow(520, 586, 380, 12, 0.3));
  // far wing and engine
  scene(sh(poly([[520, cy - 6], [600, cy - 6], [470, cy - 64], [440, cy - 64]]), '#d8dde2'));
  // tail fin
  scene(ol(M(x0 + 10, cy - 20) + L(x0 - 40, cy - 168) + L(x0 + 10, cy - 168) + L(x0 + 120, cy - 30) + 'Z', stripe, 1.2, -0.3), sh(poly([[x0 - 20, cy - 132], [x0 + 22, cy - 132], [x0 + 50, cy - 96], [x0 + 2, cy - 96]]), '#f2c14e'));
  scene(sh(poly([[x0 - 20, cy - 10], [x0 - 70, cy - 30], [x0 - 54, cy - 2], [x0 + 40, cy + 4]]), '#c9d2d8'));
  // fuselage
  scene(ol(M(x0 - 50, cy - 18) + Q(x0 - 10, cy - r, x0 + 80, cy - r) + L(x1 - 80, cy - r) + Q(x1 + 10, cy - r, x1 + 40, cy + 6) + Q(x1 + 20, cy + r, x1 - 60, cy + r) + L(x0 + 80, cy + r) + Q(x0, cy + r * 0.8, x0 - 50, cy - 18) + 'Z', body, 1.2, -0.25));
  scene(sh(M(x0 + 40, cy + 14) + L(x1 + 10, cy + 14) + Q(x1 + 20, cy + r, x1 - 60, cy + r) + L(x0 + 80, cy + r) + Q(x0 + 30, cy + r * 0.8, x0 + 40, cy + 14) + 'Z', belly));
  scene(sh(M(x0 - 20, cy + 4) + L(x1 + 26, cy + 4) + L(x1 + 30, cy + 12) + L(x0 + 10, cy + 12) + 'Z', stripe));
  let win = '';
  for (let x = x0 + 70; x < x1 - 70; x += 20) win += rect(x, cy - 16, 9, 12, 4);
  scene(sh(win, '#3a5a72'));
  scene(sh(M(x1 - 34, cy - 22) + L(x1 - 6, cy - 22) + L(x1 + 4, cy - 10) + L(x1 - 34, cy - 10) + 'Z', '#2a3a4a'));
  scene(stroke(rect(x0 + 110, cy - 26, 20, 40, 3) + rect(x1 - 110, cy - 26, 20, 40, 3), '#aab2ba', 1.6));
  // near wing & engine
  scene(ol(poly([[440, cy + 14], [610, cy + 14], [700, cy + 58], [660, cy + 64]]), '#e8ecef', 1, -0.25));
  scene(ol(rect(530, cy + 34, 110, 40, 18), '#eef0f2', 1, -0.3), sh(ellipse(636, cy + 54, 8, 18), '#3a3a40'), sh(rect(530, cy + 46, 100, 6), stripe));
  // landing gear
  for (const gx of [470, 520, x1 - 80]) scene(stroke(line([[gx, cy + r - 4], [gx, cy + r + 20]]), '#5a5a62', 4), sh(circle(gx, cy + r + 24, 11), '#2a2a2e'), sh(circle(gx, cy + r + 24, 4), '#8a8e96'));
}
{
  // jet bridge reaching to the door, tug and baggage carts
  scene(sh(poly([[780, 452], [1200, 430], [1200, 520], [780, 512]]), '#c9ced2'), sh(poly([[780, 452], [1200, 430], [1200, 446], [780, 466]]), '#aab0b6'));
  let acc = '';
  for (let x = 800; x < 1200; x += 26) acc += line([[x, 452 - (x - 780) * 0.05], [x, 512 - (x - 780) * 0.02]]);
  scene(stroke(acc, '#9aa0a6', 1.4), sh(rect(1060, 518, 20, 100), '#8a9096'), sh(rect(1040, 612, 60, 14, 3), '#5a6068'), sh(circle(1050, 632, 9) + circle(1090, 632, 9), '#2a2a2e'));
  const cx = 230;
  scene(shadow(cx + 60, 626, 140, 6), ol(rect(cx - 70, 590, 60, 30, 4), '#f2c14e', 1), sh(rect(cx - 56, 572, 30, 20, 3), '#3a4a5a'), sh(circle(cx - 56, 622, 8) + circle(cx - 22, 622, 8), '#2a2a2e'));
  for (let i = 0; i < 2; i++) {
    const bx = cx + 10 + i * 84;
    scene(ol(rect(bx, 584, 74, 34, 2), '#5a7a8e', 1), stroke(line([[bx - 10, 604], [bx, 604]]), '#3a3a40', 2), sh(circle(bx + 12, 622, 7) + circle(bx + 62, 622, 7), '#2a2a2e'));
    const g = rng(5 + i);
    for (let k = 0; k < 3; k++) scene(ol(rect(bx + 4 + k * 23, 562 + g.range(-6, 4), 20, 24 - g.range(-6, 4), 3), g.pick(['#d2452f', '#2f4a6a', '#7fb069', '#f6dc9c', '#8a3a7a']), 0.8));
  }
  for (const [x, y] of [[700, 610], [736, 624], [400, 630]] as [number, number][]) scene(sh(poly([[x - 7, y], [x + 7, y], [x + 2, y - 20], [x - 2, y - 20]]), '#f08a2b'), sh(rect(x - 5, y - 12, 10, 4), '#fbf6ec'));
  scene(place(figure(56, '#f2d23c', 9), { x: 760, y: 624 }));
}

// =====================================================================
// window frame, ceiling and sill
// =====================================================================
scene(sh(rect(0, 100, W, 540), `url(#${ID}-glass)`, { opacity: 0.12 }));
{
  let refl = '';
  for (const x of [40, 340, 640, 940]) refl += poly([[x + 40, 110], [x + 90, 110], [x + 10, 400], [x - 40, 400]]);
  scene(sh(refl, '#ffffff', { opacity: 0.12 }));
  for (const x of [0, 300, 600, 900, 1200]) scene(sh(rect(x - 10, 100, 20, SILL - 100), FRAME), sh(rect(x - 10, 100, 6, SILL - 100), FRAME_L));
  scene(sh(rect(0, 286, W, 12), FRAME), sh(rect(0, 286, W, 4), FRAME_L));
}
scene(sh(rect(0, 0, W, 104), '#ece6dc'), sh(rect(0, 96, W, 12), '#b8b0a2'));
{
  let tiles = '';
  for (let x = 0; x < W; x += 100) tiles += line([[x, 0], [x, 96]]);
  scene(stroke(tiles + line([[0, 48], [W, 48]]), '#d6cebe', 1.4));
  for (const x of [90, 390, 690, 990]) scene(sh(rect(x, 28, 120, 14, 4), '#fffbe8'), sh(ellipse(x + 60, 46, 90, 22), `url(#${ID}-glow)`, { opacity: 0.6 }));
  for (const x of [240, 540, 840]) scene(sh(circle(x, 70, 9), '#f4f0e6', { stroke: '#c9c0b0', strokeWidth: 1.4 }), sh(circle(x, 70, 3), '#c9c0b0'));
}
scene(sh(rect(0, SILL - 8, W, 54), '#d6cfc2'), sh(rect(0, SILL - 8, W, 10), '#ece6dc'), sh(rect(0, SILL + 40, W, 6), '#b8b0a2'));
{
  let grille = '';
  for (let x = 20; x < W; x += 14) grille += line([[x, SILL + 12], [x, SILL + 34]]);
  scene(stroke(grille, '#bdb4a4', 2));
}
target('toy-plane', 'Toy plane', place(toyPlane(70, '#d2452f', '#f2c14e'), { x: 760, y: SILL - 14, rot: -6 }));

// =====================================================================
// departures board hanging above the cafe
// =====================================================================
{
  const bx = 720, by = 130, bw = 440, bh = 210;
  scene(stroke(line([[bx + 60, 104], [bx + 60, by]]) + line([[bx + bw - 60, 104], [bx + bw - 60, by]]), '#5a5a62', 3));
  scene(sh(rect(bx - 8, by - 8, bw + 16, bh + 16, 8), '#2a2e36'), sh(rect(bx, by, bw, bh, 4), '#14181f'));
  scene(sh(rect(bx, by, bw, 30, 4), '#2f5a78'), sh(xf(poly([[-10, 0], [8, -1.5], [11, 0], [8, 1.5]]) + poly([[-2, 0], [4, -8], [6, -8], [3, 0]]) + poly([[-2, 0], [4, 8], [6, 8], [3, 0]]), { s: 1.2, x: bx + 26, y: by + 15, rot: -30 }), '#ffffff'));
  scene(sh(rect(bx + 46, by + 10, 60, 10, 2) + rect(bx + 112, by + 10, 40, 10, 2), '#cfe6f2'));
  const g = rng(31), status = ['#7fd66a', '#f2c14e', '#7fd66a', '#e8665a', '#7fd66a', '#7fd6f6'];
  for (let r = 0; r < 6; r++) {
    const y = by + 40 + r * 28;
    if (r % 2) scene(sh(rect(bx + 4, y - 3, bw - 8, 26), '#1d222b'));
    let chars = '', chars2 = '';
    for (let c = 0; c < 4; c++) chars += rect(bx + 14 + c * 11, y + 4, 8, 13, 1);
    for (let c = 0; c < g.int(5, 9); c++) chars2 += rect(bx + 74 + c * 11, y + 4, 8, 13, 1);
    scene(sh(chars, '#f6d26a'), sh(chars2, '#f6e8c8'));
    let gate = '';
    for (let c = 0; c < 2; c++) gate += rect(bx + 280 + c * 11, y + 4, 8, 13, 1);
    scene(sh(gate, '#f6d26a'), sh(rect(bx + 334, y + 4, 86, 13, 3), status[r], { opacity: 0.9 }));
  }
  // round clock beside the board
  const cx = 640, cy = 200;
  scene(stroke(line([[cx, 104], [cx, cy - 40]]), '#5a5a62', 3), sh(circle(cx, cy, 40), '#2a2e36'), sh(circle(cx, cy, 34), '#fbf8f0'));
  let ticks = '';
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; ticks += line([[cx + Math.cos(a) * 26, cy + Math.sin(a) * 26], [cx + Math.cos(a) * 31, cy + Math.sin(a) * 31]]); }
  scene(stroke(ticks, '#2a2e36', 2.4), stroke(line([[cx, cy], [cx + 14, cy - 12]]) + line([[cx, cy], [cx - 4, cy - 26]]), '#2a2e36', 3), sh(circle(cx, cy, 3), '#d2452f'));
}

// =====================================================================
// floor
// =====================================================================
scene(sh(rect(0, SILL + 46, W, H - SILL - 46), `url(#${ID}-floor)`));
{
  const rows = [686, 720, 760, 808, 866, 934, 1014, 1108, 1218, 1350, 1500];
  const g = rng(41);
  for (let r = 0; r < rows.length - 1; r++) {
    const y0 = rows[r], y1 = rows[r + 1], w = 44 + r * 11;
    for (let x = -((r * 29) % w); x < W; x += w) {
      const c = g.pick(['#c4ac90', '#bfa486', '#c9b296', '#b9a084']);
      scene(sh(rect(x + 1, y0 + 1, w - 2, y1 - y0 - 2, 2), c));
      if ((Math.round(x / w) + r) % 3 === 0) scene(sh(poly([[x + w / 2, y0 + (y1 - y0) * 0.28], [x + w * 0.62, y0 + (y1 - y0) / 2], [x + w / 2, y0 + (y1 - y0) * 0.72], [x + w * 0.38, y0 + (y1 - y0) / 2]]), '#a88c6c', { opacity: 0.6 }));
    }
  }
}

// =====================================================================
// back row of seats along the window
// =====================================================================
function seatRow(x0: number, n: number, sw: number, base: number, col: string, seed: number): number[] {
  const h = sw * 1.25, xs: number[] = [];
  scene(shadow(x0 + (n * sw) / 2, base + 2, (n * sw) / 2 + 30, sw * 0.12));
  scene(sh(rect(x0 + sw * 0.4, base - h * 0.34, n * sw - sw * 0.8, sw * 0.08), '#6a7078'), sh(rect(x0 + sw * 0.6, base - h * 0.3, 10, h * 0.3) + rect(x0 + n * sw - sw * 0.6 - 10, base - h * 0.3, 10, h * 0.3), CHROME), sh(rect(x0 + sw * 0.4, base - 8, 40, 8, 2) + rect(x0 + n * sw - sw * 0.4 - 40, base - 8, 40, 8, 2), '#6a7078'));
  const g = rng(seed);
  for (let i = 0; i < n; i++) {
    const sx = x0 + i * sw, c = g.next() < 0.85 ? col : shade(col, 0.12);
    xs.push(sx + sw / 2);
    scene(ol(rect(sx + 5, base - h, sw - 10, h * 0.5, 10), c, 1, -0.35), sh(rect(sx + 9, base - h + 4, sw - 18, h * 0.08, 6), shade(c, 0.18)), stroke(line([[sx + sw / 2, base - h + 16], [sx + sw / 2, base - h * 0.56]]), shade(c, -0.25), 1.4));
    scene(ol(rect(sx + 3, base - h * 0.52, sw - 6, h * 0.16, 8), shade(c, 0.06), 1, -0.35), sh(rect(sx + 8, base - h * 0.5, sw - 16, h * 0.04, 4), shade(c, 0.22)));
  }
  for (let i = 0; i <= n; i++) {
    const ax = x0 + i * sw;
    scene(sh(rect(ax - 6, base - h * 0.6, 12, h * 0.28, 4), '#3a3e46'), sh(rect(ax - 8, base - h * 0.62, 16, 8, 3), CHROME));
  }
  return xs;
}
const row1 = seatRow(40, 7, 84, 820, SEAT, 3);
// things on the back row
scene(place(magazine(46, '#e8799f', '#f2c14e', 2), { x: row1[0], y: 768, rot: -12 }), ol(M(row1[2] - 36, 776) + Q(row1[2] - 20, 728, row1[2] + 10, 744) + Q(row1[2] + 40, 758, row1[2] + 34, 780) + 'Z', '#8a5a35', 1));
target('neck-pillow', 'Neck pillow', place(neckPillow(56, '#e8a43a'), { x: row1[4], y: 752, rot: 8 }));
target('paperback', 'Paperback book', place(book(48, '#3f8f6a', '#f6dc9c'), { x: row1[1], y: 770, rot: 10 }));
scene(place(backpack(70, '#8a3a4a'), { x: row1[6], y: 788 }), place(rollerCase(64, 84, '#d2452f', 11), { x: row1[3] + 10, y: 846 }));
scene(place(figure(150, '#3f6b5a', 22), { x: 735, y: 836 }), place(rollerCase(46, 66, '#2f4a6a', 12), { x: 770, y: 840 }));

// =====================================================================
// the cafe kiosk on the right
// =====================================================================
{
  const x0 = 800, x1 = 1200, top = 610, ctop = 830, base = 990;
  // back shelf wall
  scene(sh(rect(x0 + 20, top, x1 - x0 - 20, ctop - top), '#7a4a32'), sh(rect(x0 + 20, top, x1 - x0 - 20, 10), '#5a3422'));
  let jars = '';
  const g = rng(51);
  for (let r = 0; r < 2; r++) {
    scene(sh(rect(x0 + 30, top + 66 + r * 60, x1 - x0 - 40, 6), '#d9b98a'));
    for (let x = x0 + 40; x < x1 - 20; x += 34) {
      const k = g.int(0, 2), c = g.pick(['#fbf6ec', '#3f7d6e', '#d2452f', '#f2c14e', '#efe2c2']);
      if (k === 0) scene(ol(rect(x, top + 40 + r * 60, 22, 26, 4), c, 0.8));
      else if (k === 1) scene(ol(M(x, top + 66 + r * 60) + L(x + 2, top + 48 + r * 60) + L(x + 20, top + 48 + r * 60) + L(x + 22, top + 66 + r * 60) + 'Z', c, 0.8), sh(rect(x - 2, top + 44 + r * 60, 26, 5, 2), shade(c, -0.2)));
      else jars += rect(x + 4, top + 36 + r * 60, 14, 30, 6);
    }
  }
  scene(sh(jars, '#c9a06a', { stroke: '#8a6a4a', strokeWidth: 0.8 }));
  // barista
  scene(place(figure(170, '#fbf6ec', 61), { x: 1010, y: 900 }), sh(rect(992, 790, 36, 50, 4), '#2f5a3f'));
  // canopy
  let st = '', st2 = '';
  for (let i = 0; i < 11; i++) { const r = rect(x0 - 10 + i * 40, top - 40, 40, 44); if (i % 2) st += r; else st2 += r; }
  scene(sh(st, '#2f5a3f'), sh(st2, '#f4ecd8'), sh(rect(x0 - 16, top - 52, x1 - x0 + 30, 14, 4), '#1f3a2a'));
  let sc = '', sc2 = '';
  for (let i = 0; i < 11; i++) { const d = M(x0 - 10 + i * 40, top + 4) + Q(x0 + 10 + i * 40, top + 28, x0 + 30 + i * 40, top + 4) + 'Z'; if (i % 2) sc += d; else sc2 += d; }
  scene(sh(sc, '#2f5a3f'), sh(sc2, '#f4ecd8'));
  // menu boards with pictograms
  for (const [mx, k] of [[850, 0], [1110, 1]] as [number, number][]) {
    scene(sh(rect(mx - 36, top + 14, 72, 58, 4), '#1f2a24'), stroke(rect(mx - 32, top + 18, 64, 50, 3), '#c9a06a', 1.4));
    if (k === 0) scene(stroke(M(mx - 12, top + 34) + L(mx - 10, top + 58) + L(mx + 8, top + 58) + L(mx + 10, top + 34) + 'Z' + M(mx + 10, top + 40) + Q(mx + 20, top + 42, mx + 10, top + 52), '#f4ecd8', 2), stroke(curve([[mx - 4, top + 30], [mx - 1, top + 25], [mx - 4, top + 20]]), '#f4ecd8', 1.4));
    else scene(stroke(M(mx - 18, top + 52) + Q(mx, top + 26, mx + 18, top + 52) + Q(mx, top + 44, mx - 18, top + 52), '#f4ecd8', 2), stroke(line([[mx - 6, top + 40], [mx - 2, top + 50]]) + line([[mx + 6, top + 40], [mx + 2, top + 50]]), '#f4ecd8', 1.4));
  }
  // counter
  scene(shadow((x0 + x1) / 2, base + 4, 220, 12));
  scene(sh(rect(x0, ctop, x1 - x0, base - ctop), '#c9a06a'), sh(rect(x0 - 8, ctop - 14, x1 - x0 + 16, 18, 3), '#efe6d2'), sh(rect(x0 - 8, ctop + 2, x1 - x0 + 16, 4), '#b8ad9a'));
  let slats = '';
  for (let x = x0 + 14; x < x1; x += 26) slats += rect(x, ctop + 14, 14, base - ctop - 24, 4);
  scene(sh(slats, '#b88a52'), sh(rect(x0, base - 10, x1 - x0, 10), '#5a3a24'));
  // espresso machine
  {
    const ex = 1110, ey = ctop - 14;
    scene(ol(rect(ex - 50, ey - 74, 100, 74, 6), '#c9ccd2', 1), sh(rect(ex - 50, ey - 74, 100, 16, 6), '#d2452f'), sh(rect(ex - 40, ey - 50, 80, 4), '#8a8e96'));
    scene(sh(rect(ex - 30, ey - 46, 14, 14, 2) + rect(ex + 16, ey - 46, 14, 14, 2), '#3a3a40'), stroke(line([[ex - 23, ey - 32], [ex - 23, ey - 22]]) + line([[ex + 23, ey - 32], [ex + 23, ey - 22]]), '#3a3a40', 3));
    scene(ol(rect(ex - 30, ey - 18, 14, 16, 2), '#fbf6ec', 0.8), ol(rect(ex + 16, ey - 18, 14, 16, 2), '#fbf6ec', 0.8), sh(circle(ex, ey - 64, 4) + circle(ex + 16, ey - 64, 4), '#fbf6ec'));
    let cups = '';
    for (let i = 0; i < 3; i++) cups += rect(ex - 24 + i * 18, ey - 94, 14, 16, 3);
    scene(sh(cups, '#fbf6ec', { stroke: '#b8b0a0', strokeWidth: 0.8 }));
  }
  // pastry case with buns, muffins and the croissant
  {
    const px = 830, pw = 200, py = ctop - 14;
    scene(sh(rect(px, py - 70, pw, 70, 4), '#dff0f4', { opacity: 0.5 }), sh(rect(px, py - 74, pw, 6, 2), '#c9ccd2'), sh(rect(px, py - 38, pw, 4), '#c9ccd2'));
    const pg = rng(53);
    for (let i = 0; i < 5; i++) {
      const bx = px + 22 + i * 40;
      if (i === 1) continue;
      const k = pg.int(0, 2);
      if (k === 0) scene(ol(ellipse(bx, py - 48, 14, 9), '#d99a48', 0.8), sh(ellipse(bx - 3, py - 51, 6, 3), '#f2c47a'));
      else if (k === 1) scene(ol(poly([[bx - 10, py - 40], [bx + 10, py - 40], [bx + 8, py - 52], [bx - 8, py - 52]]), '#e8d8b8', 0.8), ol(blob([[bx - 12, py - 52], [bx - 6, py - 62], [bx + 6, py - 62], [bx + 12, py - 52]], 0.9), '#7a4a2a', 0.8));
      else scene(ol(circle(bx, py - 48, 11), '#e6b060', 0.8), sh(circle(bx, py - 48, 4), '#d2452f'));
    }
    target('croissant', 'Croissant', place(croissant(40), { x: px + 62, y: py - 52 }));
    for (let i = 0; i < 4; i++) { const bx = px + 26 + i * 48; scene(ol(ellipse(bx, py - 12, 16, 10), pg.pick(['#e6b060', '#c98a4a', '#f2d8a0']), 0.8), sh(ellipse(bx, py - 16, 8, 3), '#ffffff', { opacity: 0.5 })); }
    scene(sh(poly([[px + 10, py - 70], [px + 40, py - 70], [px + 20, py - 4], [px - 4, py - 4]]), '#ffffff', { opacity: 0.25 }));
  }
  // saucers, sugar and the watch on the counter
  scene(ol(ellipse(1050, ctop - 16, 16, 4), '#fbf6ec', 0.8), ol(rect(1042, ctop - 34, 16, 16, 3), '#fbf6ec', 0.8), stroke(M(1058, ctop - 30) + Q(1066, ctop - 26, 1058, ctop - 20), '#b8b0a0', 1.6));
  scene(ol(rect(1166, ctop - 40, 18, 26, 4), '#f6e8c8', 0.8), sh(rect(1164, ctop - 44, 22, 6, 2), '#c9ccd2'));
  target('wristwatch', 'Wristwatch', place(wristwatch(42, '#2f4a6a'), { x: 1068, y: ctop - 4, rot: 80 }));
  // stools
  for (const sx of [860, 990]) {
    scene(shadow(sx, 1100, 34, 6), stroke(line([[sx, 1010], [sx, 1096]]), '#5a5a62', 5), sh(rect(sx - 24, 1092, 48, 8, 3), '#5a5a62'), sh(rect(sx - 18, 1060, 36, 5, 2), '#5a5a62'), ol(ellipse(sx, 1006, 32, 10), '#d2452f', 1), sh(ellipse(sx, 1001, 28, 6), '#e8665a'));
  }
  target('camera', 'Camera', place(camera(46, '#2f2f33', '#6b4a2f'), { x: 990, y: 990 }));
}
scene(place(pottedPalm(260, 71, '#efe6d2'), { x: 712, y: 1010 }));
target('umbrella', 'Folded umbrella', place(umbrellaClosed(120, '#2f3a5a'), { x: 670, y: 970, rot: -14 }));

// travellers crossing the hall, a gate sign and a bin
{
  scene(place(figure(196, '#5a5a7a', 31), { x: 296, y: 952 }), place(backpack(46, '#d2452f'), { x: 278, y: 860 }));
  scene(place(figure(206, '#c98a4a', 33), { x: 446, y: 966 }), place(rollerCase(58, 80, '#2f4a6a', 34), { x: 494, y: 968 }));
  const gx = 560;
  scene(shadow(gx, 962, 30, 5), sh(rect(gx - 5, 830, 10, 132), '#5a6470'), sh(rect(gx - 20, 956, 40, 8, 3), '#5a6470'));
  scene(sh(rect(gx - 50, 770, 100, 64, 6), '#2f5a78'), stroke(rect(gx - 45, 775, 90, 54, 4), '#cfe6f2', 1.4));
  scene(sh(xf(poly([[-10, 0], [8, -1.5], [11, 0], [8, 1.5]]) + poly([[-2, 0], [4, -8], [6, -8], [3, 0]]) + poly([[-2, 0], [4, 8], [6, 8], [3, 0]]), { s: 1.8, x: gx - 18, y: 802, rot: -30 }), '#ffffff'), sh(poly([[gx + 8, 796], [gx + 28, 796], [gx + 28, 788], [gx + 42, 802], [gx + 28, 816], [gx + 28, 808], [gx + 8, 808]]), '#f2c14e'));
  scene(shadow(612, 1004, 26, 5), ol(rect(590, 940, 44, 64, 6), '#5a6470', 1, 0.3), sh(rect(586, 932, 52, 12, 4), '#3a4048'), sh(circle(612, 938, 8), '#1f2328'), sh(rect(598, 960, 28, 6, 2), '#7fb069'));
}

// =====================================================================
// front row of seats facing us
// =====================================================================
const row2 = seatRow(20, 6, 104, 1150, SEAT2, 7);
{
  // a coat draped, a laptop bag and things on the seats
  scene(place([ol(M(row2[0] - 44, 978) + Q(row2[0] - 30, 960, row2[0] + 30, 966) + L(row2[0] + 44, 1030) + Q(row2[0] + 20, 1040, row2[0] - 40, 1030) + 'Z', '#a8743a', 1), stroke(line([[row2[0], 970], [row2[0] + 6, 1034]]), '#6b4a2a', 1.4), sh(circle(row2[0] + 14, 990, 3) + circle(row2[0] + 16, 1010, 3), '#3a2a1a')], { y: 50 }));
  scene(place([ol(rect(row2[3] - 40, 978, 80, 56, 6), '#3a3a40', 1, 0.3), sh(rect(row2[3] - 40, 978, 80, 14, 6), '#4a4a52'), stroke(M(row2[3] - 26, 980) + Q(row2[3], 950, row2[3] + 26, 980), '#2a2a2e', 3)], { y: 56 }));
  scene(place(magazine(52, '#3f8fbf', '#f6dc9c', 4), { x: row2[4], y: 1080, rot: 16 }), place(magazine(48, '#7fb069', '#fbf6ec', 5), { x: row2[4] + 20, y: 1086, rot: -8 }));
  target('headphones', 'Headphones', place(headphones(64, '#e8665a'), { x: row2[2], y: 1066 }));
  target('boarding-pass', 'Boarding pass', place(boardingPass(64, '#2f6690'), { x: row2[5], y: 1084, rot: -10 }));
}
target('takeaway-coffee', 'Takeaway coffee', place(coffeeCup(58, '#3f7d6e'), { x: 690, y: 1176 }));

// =====================================================================
// foreground: rug, coffee table, luggage
// =====================================================================
{
  const cx = 470, cy = 1360;
  scene(sh(ellipse(cx, cy, 330, 90), '#8a4a3a'), sh(ellipse(cx, cy, 310, 80), '#b8654a'), stroke(ellipse(cx, cy, 280, 68), '#f2c14e', 3), stroke(ellipse(cx, cy, 240, 54), '#efe2c2', 1.6));
  let dots = '';
  for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2; dots += circle(cx + Math.cos(a) * 296, cy + Math.sin(a) * 74, 3); }
  scene(sh(dots, '#efe2c2'));
  // low table
  scene(shadow(cx, 1384, 190, 18, 0.25), stroke(line([[cx - 150, 1310], [cx - 160, 1380]]) + line([[cx + 150, 1310], [cx + 160, 1380]]) + line([[cx - 110, 1316], [cx - 116, 1366]]) + line([[cx + 110, 1316], [cx + 116, 1366]]), '#4a3222', 6));
  scene(ol(ellipse(cx, 1300, 200, 44), '#c98a4a', 1.4, -0.4), sh(ellipse(cx, 1296, 190, 38), '#d9a060'), stroke(ellipse(cx - 20, 1294, 120, 22), '#c98a4a', 1.4), sh(ellipse(cx - 60, 1284, 70, 10), '#ffffff', { opacity: 0.18 }));
  scene(place(magazine(54, '#f2c14e', '#d2452f', 7), { x: cx - 120, y: 1294, rot: 70 }), place(magazine(50, '#fbf6ec', '#3f8fbf', 8), { x: cx - 90, y: 1300, rot: 96 }), place(magazine(50, '#8a3a7a', '#f6dc9c', 9), { x: cx + 100, y: 1290, rot: -74 }));
  target('sunglasses', 'Sunglasses', place(sunglasses(58, '#1f1f24', '#4a3a2a'), { x: cx - 110, y: 1296, rot: -6 }));
  scene(ol(ellipse(cx + 30, 1300, 30, 9), '#fbf6ec', 0.8, -0.2), ol(rect(cx + 18, 1276, 24, 22, 4), '#fbf6ec', 0.8, -0.2), sh(ellipse(cx + 30, 1278, 10, 3), '#6b4a2a'), stroke(M(cx + 42, 1282) + Q(cx + 52, 1286, cx + 42, 1294), '#b8b0a0', 2));
  scene(ol(ellipse(cx + 160, 1304, 24, 7), '#fbf6ec', 0.8, -0.2), sh(ellipse(cx + 154, 1300, 10, 5), '#d99a48'), sh(ellipse(cx + 166, 1302, 8, 4), '#e6b060'));
}
// suitcases in the foreground
scene(place(suitcase(170, 120, '#2f6690', 81, '#1f3a5a'), { x: 960, y: 1460 }));
target('passport', 'Passport', place(passport(48, '#6b1f2e'), { x: 920, y: 1320, rot: -14 }));
target('luggage-tag', 'Luggage tag', place(luggageTag(52, '#7fb069'), { x: 1010, y: 1304, rot: 18 }));
scene(place(rollerCase(110, 150, '#8a3a4a', 83), { x: 1120, y: 1496 }));
scene(place(rollerCase(96, 132, '#3f7d6e', 85), { x: 110, y: 1490 }), place(backpack(110, '#d9a040'), { x: 236, y: 1494 }));
target('water-bottle', 'Water bottle', place(waterBottle(80, '#3f8fbf'), { x: 304, y: 1480 }));
scene(place(pottedPalm(300, 91, '#c9673f'), { x: 1140, y: 1250 }));
{
  // a sleepy dog by the rug and a duffel bag
  const dx = 150, dy = 1300, c = '#c98a4a';
  scene(shadow(dx, dy + 4, 70, 9), ol(blob([[dx - 60, dy], [dx - 50, dy - 30], [dx + 10, dy - 38], [dx + 50, dy - 26], [dx + 56, dy]], 0.9), c, 1), stroke(curve([[dx - 58, dy - 6], [dx - 84, dy - 14], [dx - 92, dy - 2]]), c, 7));
  scene(ol(blob([[dx + 30, dy], [dx + 34, dy - 34], [dx + 64, dy - 40], [dx + 86, dy - 22], [dx + 84, dy]], 0.9), c, 1), ol(blob([[dx + 44, dy - 36], [dx + 36, dy - 10], [dx + 48, dy - 8], [dx + 58, dy - 30]], 0.9), shade(c, -0.3), 1));
  scene(sh(ellipse(dx + 84, dy - 14, 9, 7), '#f2d8b0'), sh(circle(dx + 90, dy - 16, 3.4), '#2a2a2e'), stroke(M(dx + 66, dy - 24) + Q(dx + 72, dy - 20, dx + 78, dy - 24), '#3a2a1a', 1.6), sh(rect(dx + 26, dy - 36, 8, 30, 3), '#d2452f'));
  scene(sh(blob([[dx - 20, dy], [dx - 6, dy - 14], [dx + 30, dy - 10], [dx + 34, dy]], 0.9), shade(c, 0.15)));
  const bx = 770, by = 1480;
  scene(shadow(bx, by + 2, 90, 10), ol(M(bx - 86, by) + Q(bx - 100, by - 60, bx - 60, by - 66) + L(bx + 60, by - 66) + Q(bx + 100, by - 60, bx + 86, by) + 'Z', '#3f6b5a', 1.2), sh(rect(bx - 84, by - 40, 168, 10), '#2a4a3e'));
  scene(stroke(M(bx - 40, by - 64) + Q(bx, by - 120, bx + 40, by - 64), '#2a4a3e', 6), sh(circle(bx - 66, by - 30, 10) + circle(bx + 66, by - 30, 10), '#2a4a3e'), stroke(line([[bx - 50, by - 60], [bx + 50, by - 60]]), '#c9ccd2', 2));
}
scene(place(figure(250, '#3f6b8e', 41), { x: 780, y: 1250 }));
scene(place(rollerCase(70, 96, '#c9a06a', 87), { x: 820, y: 1210 }));
void blob; void GOLD; void L;

const activity: FindActivity = {
  id: 'roadtrip-find-1', version: 1, mode: 'find', title: 'Airport Lounge',
  blurb: 'Your flight is boarding soon: find fourteen travel bits among the seats, suitcases and café counter while the plane waits outside.',
  collectionId: 'roadtrip', categories: ["Travel"], difficulty: 'Moderate',
  width: W, height: H, defs, items,
};
export default activity;
