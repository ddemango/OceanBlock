import { rect, ellipse, circle, poly, line, curve, blob, leaf, star, sector, sh, stroke, place, shade, mix, rng, xf, linearGradient, radialGradient } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { FindActivity, FindItem } from '../types';
import {
  M, L, Q, ol, shadow, ticket, bowler, thermos, umbrellaClosed, teddy, camera, key, toyBoat, railLantern, whistle, binoculars, paperPlane, apple, passport,
  suitcase, flatCase, trunk, hatbox, pigeon, figure, type Pt,
} from './props-find';

const ID = 'travel-find-3';
const W = 1200, H = 1500;
const items: FindItem[] = [];
const scene = (...s: (Shape | Shape[])[]) => { items.push({ shapes: s.flat() }); };
const target = (id: string, name: string, shapes: Shape[]) => { items.push({ id, name, target: true, shapes }); };
const IRON = '#2f4a4a', IRON_L = '#4a6a68', GOLD = '#d9b45a', BRICK = '#a8553a';

const defs =
  linearGradient(`${ID}-sky`, [[0, '#a9cfe6'], [0.7, '#e6eef0'], [1, '#f6e8c8']]) +
  linearGradient(`${ID}-steam`, [[0, '#ffffff'], [1, '#d8dde2']]) +
  linearGradient(`${ID}-plat`, [[0, '#b8ad9c'], [1, '#d6cbb6']]) +
  radialGradient(`${ID}-glow`, [[0, '#fff3c4'], [1, '#fff3c400']]);

// =====================================================================
// brick end wall with a great fan window
// =====================================================================
scene(sh(rect(0, 0, W, 460), BRICK));
{
  const g = rng(3);
  for (let r = 0; r < 23; r++) {
    let d = '', d2 = '';
    for (let c = -1; c < 26; c++) { const b = rect(c * 48 + (r % 2) * 24, r * 20, 44, 17, 1.5); if (g.next() < 0.3) d2 += b; else d += b; }
    scene(sh(d, '#b8644a'), sh(d2, '#9a4a32'));
  }
}
{
  const cx = 600, cy = 470, R = 640;
  scene(sh(sector(cx, cy, R + 26, 180, 360), '#d9c9a8'), sh(sector(cx, cy, R + 14, 180, 360), '#efe4cc'));
  scene(sh(sector(cx, cy, R, 180, 360), `url(#${ID}-sky)`));
  // distant city through the glass
  const g = rng(5);
  let city = '';
  for (let x = 0; x < W; x += 60) { const h = g.range(40, 120); city += rect(x, 470 - h, 54, h); if (g.next() < 0.4) city += sector(x + 27, 470 - h, 20, 180, 360); }
  scene(sh(city, '#b9c6cf'), sh(blob([[180, 200], [260, 170], [360, 190], [330, 220], [220, 224]], 0.9), '#ffffff', { opacity: 0.8 }), sh(blob([[760, 140], [860, 112], [960, 140], [900, 160], [800, 162]], 0.9), '#ffffff', { opacity: 0.7 }));
  // tinted panes
  for (let ring = 0; ring < 4; ring++) {
    const r0 = 160 + ring * 120, r1 = r0 + 120, n = 6 + ring * 3;
    for (let i = 0; i < n; i++) if (g.next() < 0.35) scene(sh(sector(cx, cy, r1, 180 + (180 * i) / n, 180 + (180 * (i + 1)) / n, r0), g.pick(['#ffffff', '#cfe2ea', '#f6e8c8']), { opacity: 0.3 }));
  }
  // glazing bars
  let bars = '';
  for (let i = 1; i < 18; i++) { const a = Math.PI + (Math.PI * i) / 18; bars += line([[cx + Math.cos(a) * 160, cy + Math.sin(a) * 160], [cx + Math.cos(a) * R, cy + Math.sin(a) * R]]); }
  scene(stroke(bars, IRON, 5));
  for (let ring = 0; ring < 5; ring++) scene(stroke(sector(cx, cy, 160 + ring * 120, 180, 360).replace(/L[\d. ]+Z$/, ''), IRON, ring === 0 ? 8 : 4));
  scene(sh(sector(cx, cy, 160, 180, 360), IRON_L), sh(sector(cx, cy, 120, 180, 360), '#cfe2ea'), stroke(sector(cx, cy, 120, 180, 360), IRON, 5));
  let sun = '';
  for (let i = 1; i < 8; i++) { const a = Math.PI + (Math.PI * i) / 8; sun += line([[cx, cy], [cx + Math.cos(a) * 120, cy + Math.sin(a) * 120]]); }
  scene(stroke(sun, IRON, 3), stroke(sector(cx, cy, R, 180, 360), IRON, 10));
}
// girder across the station
{
  let riv = '';
  for (let x = 10; x < W; x += 24) riv += circle(x, 452, 2.2) + circle(x, 480, 2.2);
  scene(sh(rect(0, 440, W, 50), IRON), sh(rect(0, 440, W, 8), IRON_L), sh(riv, '#7a9a96'));
  let lattice = '';
  for (let x = 0; x < W; x += 40) lattice += line([[x, 456], [x + 20, 476]]) + line([[x + 20, 476], [x + 40, 456]]);
  scene(stroke(lattice, '#1f3434', 2));
}
// hanging clock
{
  const cx = 600, cy = 300, r = 66;
  scene(stroke(line([[560, 0], [580, 236]]) + line([[640, 0], [620, 236]]), IRON, 4));
  scene(sh(rect(570, 222, 60, 18, 4), IRON), sh(ellipse(cx, cy, r + 18, r + 18), IRON), sh(circle(cx, cy, r + 10), GOLD), sh(circle(cx, cy, r), '#fbf6e8'));
  let ticks = '', mins = '';
  for (let i = 0; i < 60; i++) { const a = (i / 60) * Math.PI * 2, big = i % 5 === 0; const seg = line([[cx + Math.cos(a) * r * (big ? 0.74 : 0.86), cy + Math.sin(a) * r * (big ? 0.74 : 0.86)], [cx + Math.cos(a) * r * 0.92, cy + Math.sin(a) * r * 0.92]]); if (big) ticks += seg; else mins += seg; }
  scene(stroke(ticks, '#1f1f24', 3), stroke(mins, '#1f1f24', 1));
  scene(stroke(line([[cx, cy], [cx - 22, cy - 30]]), '#1f1f24', 4), stroke(line([[cx, cy], [cx + 44, cy + 6]]), '#1f1f24', 2.4), sh(circle(cx, cy, 5), '#c8322a'));
  scene(place(pigeon(40, '#8a93a0', 1), { x: 600, y: 216 }));
}

// =====================================================================
// far platform wall & the waiting train
// =====================================================================
scene(sh(rect(0, 490, W, 330), '#e8dcc0'));
{
  let tiles = '';
  for (let y = 500; y < 820; y += 22) tiles += line([[0, y], [W, y]]);
  for (let x = 0; x < W; x += 34) tiles += line([[x, 490], [x, 820]]);
  scene(stroke(tiles, '#d4c6a6', 1), sh(rect(0, 690, W, 26), '#3f6b5a'), sh(rect(0, 716, W, 104), '#d9cba8'));
}
function wheel(r: number): Shape[] {
  let sp = '';
  for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2; sp += line([[0, 0], [Math.cos(a) * r * 0.82, Math.sin(a) * r * 0.82]]); }
  return [sh(circle(0, 0, r), '#2a2a2e'), sh(circle(0, 0, r * 0.86), '#8c2b2b'), stroke(sp, '#2a2a2e', Math.max(1.4, r * 0.08)), sh(circle(0, 0, r * 0.22), '#2a2a2e'), sh(circle(0, 0, r * 0.1), GOLD)];
}
{
  // carriage
  const top = 520, bot = 790, x0 = -20, x1 = 700, body = '#6b2230', cream = '#efe2c2';
  scene(sh(rect(x0, bot - 6, x1 - x0, 40), '#2a2a2e'));
  for (const wx of [60, 130, 520, 590]) scene(place(wheel(30), { x: wx, y: bot + 34 }));
  scene(sh(M(x0, top + 20) + Q(x0, top, x0 + 40, top) + L(x1 - 40, top) + Q(x1, top, x1, top + 20) + L(x1, bot) + L(x0, bot) + 'Z', body));
  scene(sh(rect(x0, top - 14, x1 - x0, 30, 10), '#5a5a62'), sh(rect(x0, top - 14, x1 - x0, 8, 6), '#7a7a82'));
  scene(sh(rect(x0, top + 22, x1 - x0, 100), cream), sh(rect(x0, top + 18, x1 - x0, 4) + rect(x0, top + 124, x1 - x0, 4) + rect(x0, bot - 30, x1 - x0, 4), GOLD));
  const g = rng(11), coats = ['#2f4a6a', '#6b3f22', '#3f6b5a', '#8a3a4a', '#5a5a7a'];
  for (let i = 0; i < 8; i++) {
    const wx = x0 + 34 + i * 86;
    if (i === 3) {
      // door
      scene(sh(rect(wx - 6, top + 22, 74, bot - top - 26, 3), shade(body, 0.08)), stroke(rect(wx, top + 32, 62, bot - top - 46, 3), GOLD, 1.6), sh(rect(wx + 8, top + 40, 46, 70, 4), '#9cc4d8'), sh(rect(wx + 50, top + 150, 8, 22, 2), GOLD));
      continue;
    }
    scene(sh(rect(wx, top + 34, 64, 76, 8), '#9cc4d8'), sh(rect(wx, top + 34, 64, 76, 8), '#ffffff', { opacity: 0.15 }));
    if (g.next() < 0.7) scene(place(figure(150, g.pick(coats), 40 + i), { x: wx + 32, y: top + 168 }));
    scene(sh(M(wx, top + 34) + L(wx + 16, top + 34) + Q(wx + 10, top + 70, wx, top + 110) + 'Z', '#c8a24a'), sh(M(wx + 64, top + 34) + L(wx + 48, top + 34) + Q(wx + 54, top + 70, wx + 64, top + 110) + 'Z', '#c8a24a'));
    scene(stroke(rect(wx, top + 34, 64, 76, 8), GOLD, 2.4));
    scene(sh(rect(wx + 4, top + 150, 56, 50, 4), shade(body, 0.1)), stroke(rect(wx + 10, top + 156, 44, 38, 3), GOLD, 1));
  }
  target('binoculars', 'Binoculars', place(binoculars(46, '#2f3a33'), { x: x0 + 34 + 5 * 86 + 30, y: top + 92, rot: -6 }));
  scene(sh(rect(x1 - 8, top + 80, 30, 26, 4) + rect(x1 + 20, top + 86, 16, 14, 7), '#2a2a2e'));
}
{
  // locomotive facing right
  const x0 = 730, base = 790, green = '#2f5a3f';
  scene(sh(rect(x0, base - 10, 470, 40), '#2a2a2e'), sh(rect(x0, base + 26, 470, 8), '#8c2b2b'));
  // cab
  scene(sh(rect(x0, 520, 150, base - 520), green), sh(rect(x0 - 10, 506, 170, 22, 6), '#2a2a2e'), sh(rect(x0 + 30, 550, 80, 70, 6), '#ffe9a8'), stroke(rect(x0 + 30, 550, 80, 70, 6), GOLD, 3), sh(rect(x0 + 10, 640, 130, 4), GOLD));
  scene(place(figure(130, '#2f3a4a', 77), { x: x0 + 70, y: 690 }));
  scene(sh(rect(x0 + 30, 550, 80, 50, 6), '#ffffff', { opacity: 0.2 }));
  // boiler
  scene(sh(rect(x0 + 150, 600, 300, 130, 10), green), sh(rect(x0 + 150, 606, 300, 22), shade(green, 0.18)), sh(rect(x0 + 150, 700, 300, 30), shade(green, -0.2)));
  scene(sh(rect(x0 + 200, 600, 8, 130) + rect(x0 + 300, 600, 8, 130) + rect(x0 + 400, 600, 8, 130), GOLD));
  scene(sh(rect(x0 + 400, 590, 80, 150, 12), '#2a2a2e'), sh(circle(x0 + 472, 665, 30), '#3a3a40'), sh(circle(x0 + 472, 665, 8), GOLD));
  // dome & chimney
  scene(sh(M(x0 + 250, 602) + Q(x0 + 250, 560, x0 + 280, 560) + Q(x0 + 310, 560, x0 + 310, 602) + 'Z', GOLD), sh(rect(x0 + 410, 530, 40, 72), '#2a2a2e'), sh(rect(x0 + 402, 520, 56, 16, 4), '#3a3a40'));
  scene(sh(rect(x0 + 340, 580, 16, 22, 3), GOLD));
  // wheels & rods
  for (const wx of [x0 + 210, x0 + 320]) scene(place(wheel(52), { x: wx, y: base - 8 }));
  scene(place(wheel(26), { x: x0 + 430, y: base + 12 }), place(wheel(26), { x: x0 + 60, y: base + 12 }));
  scene(sh(rect(x0 + 196, base - 30, 140, 10, 4), '#9aa0a6'), sh(circle(x0 + 210, base - 25, 6) + circle(x0 + 320, base - 25, 6), '#5a5a62'));
  scene(sh(poly([[x0 + 470, base + 10], [x0 + 470, base + 40], [1210, base + 40], [1210, base + 10]]), '#8c2b2b'), sh(rect(x0 + 460, base - 40, 20, 50), '#2a2a2e'));
  scene(sh(circle(x0 + 452, 760, 14), '#ffe9a8'), sh(circle(x0 + 452, 760, 30), `url(#${ID}-glow)`));
}
{
  // steam drifting up into the roof
  const g = rng(17);
  const puffs: Pt[] = [[1160, 500], [1110, 440], [1060, 380], [1000, 330], [930, 300], [860, 290], [1170, 430]];
  for (const [x, y] of puffs) { const r = g.range(40, 70); scene(sh(blob([[x - r, y], [x - r * 0.6, y - r * 0.7], [x, y - r * 0.9], [x + r * 0.7, y - r * 0.6], [x + r, y], [x + r * 0.4, y + r * 0.5], [x - r * 0.5, y + r * 0.5]], 1), `url(#${ID}-steam)`, { opacity: 0.85 })); }
  scene(sh(circle(1160, 520, 30) + circle(1180, 500, 26), '#ffffff', { opacity: 0.9 }));
}

// =====================================================================
// the platform
// =====================================================================
scene(sh(rect(0, 820, W, H - 820), `url(#${ID}-plat)`));
{
  scene(sh(rect(0, 820, W, 26), '#efe6d2'), sh(rect(0, 846, W, 6), '#8a8070'), sh(rect(0, 852, W, 10), '#f2d27a'));
  const rows = [862, 900, 946, 1000, 1064, 1140, 1230, 1340, 1500];
  const g = rng(23);
  for (let r = 0; r < rows.length - 1; r++) {
    const y0 = rows[r], y1 = rows[r + 1], w = 80 + r * 22;
    for (let x = -((r * 37) % w); x < W; x += w) {
      const c = g.pick(['#c9bea9', '#c2b6a0', '#d0c5b0', '#bdb19b']);
      scene(sh(rect(x + 2, y0 + 2, w - 4, y1 - y0 - 4, 3), c, { stroke: '#9a907e', strokeWidth: 1 }));
      if (g.next() < 0.3) scene(stroke(curve([[x + w * 0.2, y0 + (y1 - y0) * 0.4], [x + w * 0.4, y0 + (y1 - y0) * 0.55], [x + w * 0.5, y0 + (y1 - y0) * 0.45]]), '#a89c86', 1));
    }
  }
}
// iron columns
function column(x: number, top: number, bot: number): Shape[] {
  return [
    sh(rect(x - 14, top, 28, bot - top), IRON), sh(rect(x - 14, top, 8, bot - top), IRON_L),
    sh(M(x - 40, top) + Q(x - 14, top + 10, x - 14, top + 40) + L(x + 14, top + 40) + Q(x + 14, top + 10, x + 40, top) + 'Z', IRON),
    sh(rect(x - 24, bot - 50, 48, 50, 4), IRON), sh(rect(x - 30, bot - 12, 60, 12, 3), '#1f3434'), sh(rect(x - 20, top + 60, 40, 10, 3) + rect(x - 20, bot - 64, 40, 10, 3), GOLD),
    stroke(M(x - 14, top + 40) + Q(x - 80, top + 20, x - 130, top) + M(x + 14, top + 40) + Q(x + 80, top + 20, x + 130, top), IRON, 6),
  ];
}
scene(column(150, 488, 980), column(1060, 488, 940));
{
  // hanging sign with a little train pictogram
  scene(stroke(line([[256, 490], [256, 530]]) + line([[384, 490], [384, 530]]), IRON, 3), ol(rect(236, 528, 168, 64, 6), '#2f4a6a', 1.4), stroke(rect(242, 534, 156, 52, 4), '#efe2c2', 2));
  scene(sh(rect(270, 548, 50, 24, 3) + rect(320, 538, 34, 34, 3) + rect(286, 540, 10, 10), '#efe2c2'), sh(circle(284, 576, 6) + circle(310, 576, 6) + circle(342, 576, 6), '#efe2c2'));
}

// ---- left: bench, lamp ----
{
  const bx = 210, by = 1050;
  scene(shadow(bx, by + 22, 170, 14));
  let slats = '';
  for (let i = 0; i < 4; i++) slats += rect(bx - 160, by - 140 + i * 22, 320, 15, 3);
  scene(sh(rect(bx - 150, by - 16, 12, 40) + rect(bx + 138, by - 16, 12, 40), '#1f2a2a'), sh(slats, '#8a5a38'), stroke(line([[bx - 150, by - 150], [bx - 150, by - 40]]) + line([[bx + 150, by - 150], [bx + 150, by - 40]]), '#1f2a2a', 8));
  scene(sh(rect(bx - 170, by - 40, 340, 16, 3) + rect(bx - 170, by - 22, 340, 12, 3), '#9a6a44'));
  scene(stroke(M(bx - 166, by - 40) + Q(bx - 186, by - 60, bx - 170, by - 80) + M(bx + 166, by - 40) + Q(bx + 186, by - 60, bx + 170, by - 80), '#1f2a2a', 6));
  // things on the bench
  scene(ol(xf(rect(-34, -6, 68, 12, 2), { rot: -4, x: bx + 30, y: by - 46 }), '#efe8d8', 1, -0.2), stroke(xf(line([[-28, -2], [26, -2]]) + line([[-28, 2], [20, 2]]), { rot: -4, x: bx + 30, y: by - 46 }), '#9a907e', 1));
  target('bowler-hat', 'Bowler hat', place(bowler(76), { x: bx - 90, y: by - 42 }));
  target('ticket', 'Ticket', place(ticket(46, '#f2c14e'), { x: bx + 110, y: by - 50, rot: 12 }));
  target('thermos', 'Thermos flask', place(thermos(56, '#3f6b5a'), { x: bx - 40, y: by + 26 }));
  scene(place(pigeon(44, '#8a93a0', 2), { x: bx + 60, y: by + 30 }));
  target('umbrella', 'Umbrella', place(umbrellaClosed(150, '#2f3a5a'), { x: bx + 190, y: by - 50, rot: 16 }));
}
{
  // lamp post
  const lx = 430;
  scene(shadow(lx, 1104, 40, 8), sh(rect(lx - 18, 1060, 36, 44, 4), IRON), sh(rect(lx - 7, 700, 14, 370), IRON), sh(rect(lx - 7, 700, 4, 370), IRON_L), sh(rect(lx - 12, 900, 24, 10, 3), GOLD));
  scene(stroke(M(lx, 720) + Q(lx + 50, 700, lx + 60, 740), IRON, 4), sh(circle(lx, 660, 50), `url(#${ID}-glow)`), ol(poly([[lx - 22, 640], [lx + 22, 640], [lx + 16, 700], [lx - 16, 700]]), '#fff3c4', 1, -0.5), sh(poly([[lx - 28, 640], [lx + 28, 640], [lx, 616]]), IRON), sh(rect(lx - 18, 698, 36, 8, 2), IRON));
}
target('railway-lantern', 'Railway lantern', place(railLantern(54, '#c8322a'), { x: 620, y: 900 }));

// ---- centre: porter's barrow piled with luggage ----
{
  const cx = 600, base = 1280;
  scene(shadow(cx, base + 22, 200, 16));
  scene(stroke(line([[cx - 190, base - 6], [cx - 230, base - 220]]) + line([[cx - 166, base - 6], [cx - 206, base - 220]]), '#5a3a24', 7), stroke(line([[cx - 236, base - 222], [cx - 200, base - 222]]), '#5a3a24', 8));
  scene(place(trunk(300, 130, '#3f5a7a', '#1f2a3a'), { x: cx, y: base - 14 }));
  scene(place(suitcase(220, 90, '#a8743a', { seed: 31, trim: '#5a3a22' }), { x: cx - 30, y: base - 144 }));
  scene(place(hatbox(90, 74, '#efe2c2', '#3f7d6e'), { x: cx + 120, y: base - 144 }));
  scene(place(suitcase(160, 70, '#8c2b2b', { seed: 35, trim: '#3a1a1a' }), { x: cx - 10, y: base - 234 }));
  target('teddy-bear', 'Teddy bear', place(teddy(78, '#c48a4a'), { x: cx - 4, y: base - 304 }));
  target('camera', 'Camera', place(camera(52, '#2a2a2e'), { x: cx + 120, y: base - 240, rot: -8 }));
  target('old-key', 'Old key', place(key(56, '#b0904a'), { x: cx - 70, y: base - 96, rot: -4 }));
  scene(sh(rect(cx - 190, base - 14, 380, 16, 3), '#5a3a24'), place(wheel(26), { x: cx - 140, y: base + 12 }), place(wheel(26), { x: cx + 140, y: base + 12 }));
  // carpet bag beside the barrow, with a toy boat poking out
  target('toy-boat', 'Toy sailboat', place(toyBoat(60, '#2f6690'), { x: 352, y: 1252, rot: -10 }));
  scene(shadow(350, 1336, 70, 10), ol(M(290, 1336) + Q(282, 1270, 300, 1250) + L(400, 1250) + Q(418, 1270, 410, 1336) + 'Z', '#7a3a5a', 1.2), sh(rect(296, 1250, 108, 12, 4), '#c9a24a'), stroke(M(318, 1252) + Q(350, 1210, 382, 1252), '#3a2418', 4));
  let pat = '';
  for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) pat += xf(star(0, 0, 9, 4, 6), { x: 312 + i * 26, y: 1284 + j * 18 });
  scene(sh(pat, '#e2b44a'));
}

// ---- right: newsstand ----
{
  const x0 = 820, x1 = 1186, roof = 860, base = 1250;
  scene(shadow((x0 + x1) / 2, base + 10, 200, 14));
  scene(sh(rect(x0, roof, x1 - x0, base - roof), '#2f5a3f'), sh(rect(x0 + 16, roof + 60, x1 - x0 - 32, 220), '#1f3a2a'));
  // magazines on racks (abstract covers, no words)
  const g = rng(41), cov = ['#c8322a', '#f2c14e', '#3f8fbf', '#e8799f', '#7fb069', '#efe2c2', '#8a3a7a', '#f08a2b'];
  for (let r = 0; r < 3; r++) {
    const y = roof + 70 + r * 70;
    scene(sh(rect(x0 + 16, y + 56, x1 - x0 - 32, 6), '#8a5a38'));
    for (let i = 0; i < 7; i++) {
      const mx = x0 + 28 + i * 46;
      if (r === 1 && i === 2) continue;
      const c = g.pick(cov);
      scene(ol(rect(mx, y + 4, 38, 52, 2), c, 0.8), sh(rect(mx + 4, y + 8, 30, 6), '#ffffff', { opacity: 0.8 }));
      const k = g.int(0, 2);
      if (k === 0) scene(sh(circle(mx + 19, y + 34, 10), g.pick(cov)));
      else if (k === 1) scene(sh(poly([[mx + 6, y + 50], [mx + 18, y + 24], [mx + 32, y + 50]]), g.pick(cov)));
      else scene(sh(rect(mx + 6, y + 22, 26, 26, 2), g.pick(cov)), stroke(line([[mx + 8, y + 52], [mx + 30, y + 52]]), '#3a3a3f', 1));
    }
  }
  target('paper-plane', 'Paper plane', place(paperPlane(52), { x: x0 + 28 + 2 * 46 + 18, y: roof + 70 + 70 + 32, rot: -10 }));
  // awning roof
  let st = '', st2 = '';
  for (let i = 0; i < 10; i++) { const r = rect(x0 - 16 + i * 40, roof - 40, 40, 44); if (i % 2) st += r; else st2 += r; }
  scene(sh(st, '#2f5a3f'), sh(st2, '#efe2c2'), sh(rect(x0 - 20, roof - 54, x1 - x0 + 40, 16, 4), '#1f3a2a'));
  let sc = '', sc2 = '';
  for (let i = 0; i < 10; i++) { const d = M(x0 - 16 + i * 40, roof + 4) + Q(x0 + 4 + i * 40, roof + 30, x0 + 24 + i * 40, roof + 4) + 'Z'; if (i % 2) sc += d; else sc2 += d; }
  scene(sh(sc, '#2f5a3f'), sh(sc2, '#efe2c2'));
  scene(place(pigeon(44, '#9aa3ae', 3), { x: x0 + 60, y: roof - 54 }), place(pigeon(40, '#7a8390', 4), { x: x1 - 40, y: roof - 54, sx: -1 }));
  // counter with newspapers, sweets and the vendor's things
  const cy = roof + 300;
  scene(sh(rect(x0 - 10, cy, x1 - x0 + 20, 20, 3), '#8a5a38'), sh(rect(x0 - 10, cy, x1 - x0 + 20, 5, 2), '#a8784a'));
  for (let i = 0; i < 3; i++) { const nx = x0 + 30 + i * 40; scene(ol(rect(nx, cy - 18 + i * 2, 36, 18 - i * 2, 1), '#e8e2d4', 0.8, -0.25), stroke(line([[nx + 3, cy - 12 + i * 2], [nx + 33, cy - 12 + i * 2]]) + line([[nx + 3, cy - 7 + i * 2], [nx + 30, cy - 7 + i * 2]]), '#8a8a8a', 1)); }
  for (let i = 0; i < 3; i++) { const jx = x0 + 230 + i * 40; scene(sh(rect(jx - 14, cy - 44, 28, 44, 6), '#e8f0f0', { opacity: 0.6, stroke: '#a8b8b8', strokeWidth: 0.8 }), sh(rect(jx - 12, cy - 30, 24, 28, 4), g.pick(['#e8799f', '#f2c14e', '#7fb069'])), sh(rect(jx - 15, cy - 50, 30, 8, 2), '#c8322a')); }
  target('whistle', 'Whistle', place(whistle(48, '#c9ccd2'), { x: x0 + 180, y: cy - 14, rot: -10 }));
  // front panel
  scene(sh(rect(x0, cy + 20, x1 - x0, base - cy - 20), '#2f5a3f'), stroke(rect(x0 + 14, cy + 32, x1 - x0 - 28, base - cy - 46, 4), GOLD, 2));
  let bundles = '';
  for (let i = 0; i < 3; i++) bundles += rect(x0 + 40 + i * 104, cy + 80, 80, 60, 2);
  scene(sh(bundles, '#e8e2d4'), stroke(bundles, '#9a907e', 1));
  let lines2 = '';
  for (let i = 0; i < 3; i++) for (let k = 0; k < 5; k++) lines2 += line([[x0 + 44 + i * 104, cy + 90 + k * 10], [x0 + 116 + i * 104, cy + 90 + k * 10]]);
  scene(stroke(lines2, '#9a907e', 1.4), stroke(line([[x0 + 80, cy + 76], [x0 + 80, cy + 144]]) + line([[x0 + 184, cy + 76], [x0 + 184, cy + 144]]) + line([[x0 + 288, cy + 76], [x0 + 288, cy + 144]]), '#8a5a38', 2));
}

// ---- foreground ----
{
  // flower barrel bottom-left
  const g = rng(51);
  scene(shadow(110, 1480, 90, 12));
  for (let i = 0; i < 22; i++) { const fx = 110 + g.range(-70, 70), fy = 1340 + g.range(-40, 20); scene(sh(leaf(fx, fy, 22, 7, g.range(0, 360)), g.pick(['#4f7a3a', '#5c8f4f']))); }
  for (let i = 0; i < 14; i++) { const fx = 110 + g.range(-64, 64), fy = 1330 + g.range(-40, 16); scene(sh(circle(fx, fy, 8), g.pick(['#d2452f', '#f2c14e', '#e8799f', '#fbf6e8'])), sh(circle(fx, fy, 2.6), '#7a4a2a')); }
  scene(ol(M(30, 1360) + Q(22, 1420, 40, 1480) + L(180, 1480) + Q(198, 1420, 190, 1360) + 'Z', '#8a5a38', 1.2), sh(rect(26, 1380, 168, 10) + rect(30, 1446, 160, 10), '#3a3a40'));
  // pigeons pecking
  scene(place(pigeon(46, '#8a93a0', 5), { x: 300, y: 1410 }), place(pigeon(42, '#a0a8b2', 6), { x: 380, y: 1450, sx: -1 }), place(pigeon(40, '#6f7884', 7), { x: 760, y: 1110 }), place(pigeon(38, '#8a93a0', 8), { x: 520, y: 1000, sx: -1 }));
  let crumbs = '';
  for (let i = 0; i < 10; i++) crumbs += circle(330 + g.range(-30, 40), 1420 + g.range(-6, 20), 2);
  scene(sh(crumbs, '#e8d6a8'));
  // a row of cases at the front right
  scene(place(suitcase(150, 110, '#3f7d6e', { seed: 61 }), { x: 1000, y: 1480 }), place(suitcase(110, 150, '#c9a06a', { seed: 63, straps: false }), { x: 1130, y: 1492 }));
  scene(place(flatCase(150, 34, '#7a3a3a', 65), { x: 1004, y: 1374 }));
  target('apple', 'Apple', place(apple(36, '#c8322a'), { x: 1040, y: 1338 }));
  target('passport', 'Passport', place(passport(46, '#2f4a3a'), { x: 690, y: 1420, rot: 24 }));
  scene(ol(xf(rect(-30, -20, 60, 40, 2), { rot: -10, x: 820, y: 1440 }), '#efe2c2', 1, -0.2), stroke(xf(line([[-22, -8], [22, -8]]) + line([[-22, 0], [16, 0]]) + line([[-22, 8], [20, 8]]), { rot: -10, x: 820, y: 1440 }), '#9a907e', 1.2));
}
void blob; void mix; void sector; void radialGradient; void flatCase;

const activity: FindActivity = {
  id: ID, version: 1, mode: 'find', title: 'Platform Four',
  blurb: 'The train is waiting under the great glass roof: find fourteen travel bits among the trunks, pigeons and the newsstand.',
  collectionId: 'travel', categories: ['Travel', 'Architecture'], difficulty: 'Moderate',
  width: W, height: H, defs, items,
};
export default activity;
