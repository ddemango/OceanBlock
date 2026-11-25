import { rect, ellipse, circle, poly, line, curve, blob, leaf, petal, sh, stroke, place, shade, mix, rng, xf, linearGradient, radialGradient, type Rng } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { FindActivity, FindItem } from '../types';
import {
  M, L, Q, ol, shadow, leafyPlant, pot, bistroChair, cafeTable, planeTrunk, foliage, bookRow,
  beret, umbrella, pigeon, baguette, bicycle, accordion, paintPalette, croissant, coffeeCup, fishingRod, lifebuoy, magnifier, poodle, bouquet, easel,
} from './props-find';

const ID = 'cities-find-2';
const W = 1200, H = 1500;
const items: FindItem[] = [];
const scene = (...s: (Shape | Shape[])[]) => { items.push({ shapes: s.flat() }); };
const target = (id: string, name: string, shapes: Shape[]) => { items.push({ id, name, target: true, shapes }); };
const STALL = '#2f5a44', STALL_D = '#234434', STALL_L = '#3f7058';
const STONE = '#d8c8a8', STONE_D = '#b8a684';
const LEAVES = ['#6f9a4a', '#5a8a42', '#88ac58', '#4a7a3a'];

const defs =
  linearGradient(`${ID}-sky`, [[0, '#8fc2de'], [0.6, '#c8dfe6'], [1, '#f6dcb8']]) +
  linearGradient(`${ID}-river`, [[0, '#7fa8a8'], [0.5, '#5f8e92'], [1, '#4a7478']]) +
  linearGradient(`${ID}-walk`, [[0, '#d6c8b0'], [1, '#c4b49a']]) +
  radialGradient(`${ID}-sun`, [[0, '#fff6dc'], [1, '#fff6dc00']]);

// =====================================================================
// sky, distant tower, far bank
// =====================================================================
scene(sh(rect(0, 0, W, 600), `url(#${ID}-sky)`));
scene(sh(circle(880, 260, 320), `url(#${ID}-sun)`, { opacity: 0.6 }));
scene(sh(blob([[420, 220], [520, 196], [640, 206], [700, 230], [580, 244], [460, 242]], 0.9), '#ffffff', { opacity: 0.6 }), sh(blob([[760, 320], [860, 300], [980, 312], [1030, 334], [900, 344], [800, 340]], 0.9), '#ffffff', { opacity: 0.5 }));
// =====================================================================
// landmarks: the Eiffel Tower (distant, right) and Notre-Dame (far bank, left)
// =====================================================================
{
  const cx = 830, top = 64, base = 540, col = '#8a7a72', dark = '#6e6260', haze = '#d2e2e6';
  const yAt = (t: number) => top + (base - top) * t;
  const hw = (t: number) => 3 + 168 * Math.pow(t, 2.4);
  const sec = (t0: number, t1: number) => poly([[cx - hw(t0), yAt(t0)], [cx + hw(t0), yAt(t0)], [cx + hw(t1), yAt(t1)], [cx - hw(t1), yAt(t1)]]);
  scene(stroke(line([[cx, top - 34], [cx, top + 4]]), dark, 2), sh(rect(cx - 5, top - 6, 10, 14, 2), dark));
  scene(sh(sec(0.02, 0.4), col));
  scene(sh(sec(0.4, 0.66), col));
  // legs with the great arch between them
  scene(sh(sec(0.66, 1), col), sh(M(cx - hw(1) + 46, base) + Q(cx - hw(0.78), yAt(0.76), cx, yAt(0.75)) + Q(cx + hw(0.78), yAt(0.76), cx + hw(1) - 46, base) + 'Z', haze));
  let lat = '';
  const bands = [0.04, 0.1, 0.16, 0.22, 0.28, 0.34, 0.4, 0.46, 0.52, 0.58, 0.66];
  for (let i = 0; i < bands.length - 1; i++) {
    const a = bands[i], b = bands[i + 1];
    lat += line([[cx - hw(a), yAt(a)], [cx + hw(b) * 0.2, yAt(b)]]) + line([[cx + hw(a), yAt(a)], [cx - hw(b) * 0.2, yAt(b)]]);
    lat += line([[cx - hw(a), yAt(a)], [cx + hw(a), yAt(a)]]);
  }
  for (const t of [0.72, 0.8, 0.88, 0.96]) lat += line([[cx - hw(t), yAt(t)], [cx - hw(t) + 34 + t * 10, yAt(t)]]) + line([[cx + hw(t), yAt(t)], [cx + hw(t) - 34 - t * 10, yAt(t)]]);
  scene(stroke(lat, haze, 1.2, { opacity: 0.8 }));
  scene(stroke(line([[cx, yAt(0.42)], [cx, yAt(0.64)]]), haze, 2, { opacity: 0.6 }));
  // the two viewing platforms
  scene(sh(rect(cx - hw(0.4) - 8, yAt(0.4) - 6, hw(0.4) * 2 + 16, 10, 1), dark));
  scene(sh(rect(cx - hw(0.66) - 10, yAt(0.66) - 10, hw(0.66) * 2 + 20, 16, 1), dark));
  let arcs = '';
  for (let x = cx - hw(0.66) - 4; x < cx + hw(0.66) + 4; x += 10) arcs += M(x, yAt(0.66) + 6) + Q(x + 5, yAt(0.66) - 4, x + 10, yAt(0.66) + 6);
  scene(stroke(arcs, haze, 1, { opacity: 0.7 }));
}
function farFacade(x: number, w: number, h: number, base: number, g: Rng): void {
  const y = base - h, body = g.pick(['#efe2c6', '#e8d6b8', '#f2e8d2', '#e2cfae']), roof = g.pick(['#7a8ea0', '#6a7e92', '#8496a8']);
  scene(sh(rect(x, y, w, h), body), sh(poly([[x - 4, y], [x + 8, y - 36], [x + w - 8, y - 36], [x + w + 4, y]]), roof));
  for (let dx = x + 14; dx < x + w - 20; dx += 30) scene(sh(rect(dx, y - 30, 14, 20, 2) + poly([[dx - 2, y - 30], [dx + 7, y - 40], [dx + 16, y - 30]]), shade(body, -0.05)), sh(rect(dx + 3, y - 26, 8, 14), '#4a5a6a'));
  if (g.next() < 0.7) scene(sh(rect(x + w * 0.7, y - 54, 14, 22), '#b08a6a'), sh(rect(x + w * 0.7 + 18, y - 50, 10, 18), '#b08a6a'));
  let wins = '', rails = '';
  for (let wy = y + 18; wy < base - 30; wy += 40) for (let wx = x + 10; wx < x + w - 16; wx += 24) { wins += rect(wx, wy, 12, 22, 1); rails += line([[wx - 2, wy + 20], [wx + 14, wy + 20]]); }
  scene(sh(wins, '#5a6a7a'), stroke(rails, '#3a3a40', 1.2));
  scene(sh(rect(x, base - 24, w, 24), shade(body, -0.12)), sh(rect(x, y + h * 0.18, w, 3), shade(body, -0.1)));
}
{
  const g = rng(17);
  for (let x = -10; x < W; ) { const w = g.range(100, 150), h = g.range(150, 230); farFacade(x, w, h, 560, g); x += w + 2; }
  // far-bank trees
  for (let x = 20; x < W; x += g.range(50, 90)) scene(place(foliage(g.range(30, 44), ['#7a9a5a', '#6a8a4a', '#8aaa62'], g, 6), { x, y: 540 }));
  scene(sh(rect(0, 556, W, 30), STONE_D), sh(rect(0, 556, W, 6), STONE));
}
{
  // Notre-Dame's west front: twin square towers, rose window, three portals and the spire
  const x = 216, base = 556, w = 220, stone = '#e6dbc2', sd = '#c8b894', dk = '#5a5866';
  scene(sh(poly([[x + 108, 300], [x + 112, 176], [x + 116, 300]]), '#7a7a86'), sh(poly([[x + 96, 310], [x + 112, 270], [x + 128, 310]]), '#7a7a86'));
  scene(sh(poly([[x + 70, 330], [x + 112, 290], [x + 154, 330]]), '#8a8a96'));
  scene(sh(rect(x, 330, w, base - 330), stone));
  scene(sh(rect(x, 262, 76, 80) + rect(x + w - 76, 262, 76, 80), stone));
  scene(sh(rect(x - 2, 256, 80, 8) + rect(x + w - 78, 256, 80, 8), sd));
  for (const tx of [x + 12, x + w - 64]) scene(sh(M(tx, 336) + L(tx, 288) + Q(tx + 11, 270, tx + 22, 288) + L(tx + 22, 336) + 'Z' + M(tx + 30, 336) + L(tx + 30, 288) + Q(tx + 41, 270, tx + 52, 288) + L(tx + 52, 336) + 'Z', dk));
  let gal = '';
  for (let gx = x + 6; gx < x + w - 6; gx += 10) gal += rect(gx, 346, 5, 18, 2);
  scene(sh(rect(x, 342, w, 4) + rect(x, 364, w, 4), sd), sh(gal, dk));
  scene(sh(circle(x + w / 2, 410, 30), sd), sh(circle(x + w / 2, 410, 24), '#6a5a7a'), stroke(line([[x + w / 2 - 24, 410], [x + w / 2 + 24, 410]]) + line([[x + w / 2, 386], [x + w / 2, 434]]) + line([[x + w / 2 - 17, 393], [x + w / 2 + 17, 427]]) + line([[x + w / 2 + 17, 393], [x + w / 2 - 17, 427]]), sd, 2));
  for (const wx of [x + 22, x + w - 52]) scene(sh(M(wx, 440) + L(wx, 404) + Q(wx + 15, 384, wx + 30, 404) + L(wx + 30, 440) + 'Z', dk));
  let kings = '';
  for (let kx = x + 8; kx < x + w - 6; kx += 9) kings += rect(kx, 454, 5, 14, 2);
  scene(sh(rect(x, 450, w, 22), sd), sh(kings, '#a8987a'));
  for (const [px, pw] of [[x + 14, 50], [x + w / 2 - 30, 60], [x + w - 64, 50]] as [number, number][]) scene(sh(M(px, base) + L(px, 508) + Q(px + pw / 2, 474, px + pw, 508) + L(px + pw, base) + 'Z', dk), stroke(M(px - 4, base) + L(px - 4, 506) + Q(px + pw / 2, 466, px + pw + 4, 506) + L(px + pw + 4, base), sd, 3));
  scene(stroke(line([[x + 80, 262], [x + 80, base]]) + line([[x + w - 80, 262], [x + w - 80, base]]), sd, 3));
}

// =====================================================================
// river and stone bridge
// =====================================================================
scene(sh(rect(0, 584, W, 260), `url(#${ID}-river)`));
{
  const g = rng(23);
  for (let i = 0; i < 70; i++) { const x = g.range(0, W), y = g.range(592, 830), w = g.range(14, 50); scene(stroke(line([[x, y], [x + w, y]]), g.pick(['#a8cccc', '#8ab8b8', '#3f6a6e']), g.range(1.2, 2.4), { opacity: 0.7 })); }
}
{
  // bridge spanning the river (right half)
  const x0 = 470, x1 = W + 10, deck = 500, water = 640;
  scene(sh(rect(x0, deck, x1 - x0, water - deck), '#d2bf9c'));
  const spans = 3, sw = (x1 - x0) / spans;
  for (let i = 0; i < spans; i++) {
    const ax0 = x0 + i * sw + 34, ax1 = x0 + (i + 1) * sw - 34, mid = (ax0 + ax1) / 2;
    scene(sh(M(ax0, water) + L(ax0, deck + 80) + Q(mid, deck + 6, ax1, deck + 80) + L(ax1, water) + 'Z', '#5f8486'));
    scene(sh(M(ax0, water) + L(ax0, deck + 80) + Q(mid, deck + 6, ax1, deck + 80) + L(ax1, water) + L(ax1 - 10, water) + L(ax1 - 10, deck + 84) + Q(mid, deck + 18, ax0 + 10, deck + 84) + L(ax0 + 10, water) + 'Z', '#b8a482'));
    let vs = '';
    for (let k = -4; k <= 4; k++) { const a = (k / 10) * Math.PI; vs += line([[mid + Math.sin(a) * (ax1 - ax0) * 0.5, deck + 80 - Math.cos(a) * 70], [mid + Math.sin(a) * (ax1 - ax0) * 0.58, deck + 70 - Math.cos(a) * 86]]); }
    scene(stroke(vs, '#b8a482', 1.4));
    scene(sh(ellipse(mid, water + 26, (ax1 - ax0) * 0.42, 14), '#3f6668', { opacity: 0.5 }));
  }
  for (let i = 1; i < spans; i++) { const px = x0 + i * sw; scene(sh(poly([[px - 40, water], [px - 34, deck + 70], [px + 34, deck + 70], [px + 40, water]]), '#c8b490'), sh(circle(px, deck + 46, 12), '#b8a482')); }
  scene(sh(rect(x0, deck - 6, x1 - x0, 16), '#c8b490'), sh(rect(x0, deck - 30, x1 - x0, 24), '#d8c8a8'));
  let bal = '';
  for (let x = x0 + 6; x < x1; x += 12) bal += rect(x, deck - 28, 5, 20, 2);
  scene(sh(bal, '#b8a482'));
  for (let x = x0 + 60; x < x1; x += 180) scene(stroke(line([[x, deck - 30], [x, deck - 90]]), '#3a4040', 3), sh(rect(x - 7, deck - 104, 14, 16, 3), '#3a4040'), sh(rect(x - 5, deck - 100, 10, 10, 2), '#f6e6b0'));
  // little figures crossing the bridge
  const g = rng(29);
  for (let i = 0; i < 5; i++) { const fx = x0 + 120 + i * 140 + g.range(-30, 30); scene(sh(rect(fx - 4, deck - 52, 8, 22, 3), g.pick(['#c8504a', '#3f5a7a', '#e8b866', '#5a7a4a'])), sh(circle(fx, deck - 57, 5), '#c89070')); }
}

// =====================================================================
// barge (right, between the stalls and the bridge)
// =====================================================================
{
  const x0 = 760, x1 = 1170, wl = 770;
  scene(sh(ellipse((x0 + x1) / 2, wl + 8, (x1 - x0) * 0.55, 12), '#3a5e62', { opacity: 0.6 }));
  scene(ol(M(x0, wl - 40) + L(x1, wl - 40) + Q(x1 + 20, wl - 30, x1 - 10, wl) + L(x0 + 20, wl) + Q(x0 - 6, wl - 20, x0, wl - 40) + 'Z', '#2a3a48', 1.2));
  scene(sh(rect(x0 + 2, wl - 32, x1 - x0 - 4, 8), '#c8423a'));
  scene(ol(rect(x0 + 160, wl - 110, 190, 72, 4), '#3f6a58', 1.2), sh(rect(x0 + 156, wl - 118, 198, 12, 3), '#2a3a48'));
  for (let i = 0; i < 4; i++) scene(sh(rect(x0 + 172 + i * 44, wl - 98, 30, 26, 3), '#f2e6c8'), sh(rect(x0 + 172 + i * 44, wl - 98, 30, 8), '#e88a8a'));
  const g = rng(31);
  for (let i = 0; i < 5; i++) {
    const px = x0 + 30 + i * 26;
    scene(place(pot(22, 20, '#c8673e'), { x: px, y: wl - 40 }), place(leafyPlant(26, ['#5f9058', '#4f7f52'], g, 6, 60, 0.35), { x: px, y: wl - 58 }));
    scene(sh(circle(px + g.range(-6, 6), wl - 74, 4), g.pick(['#e8556a', '#f2c84a', '#f6f0e8'])));
  }
  scene(stroke(line([[x1 - 40, wl - 40], [x1 - 40, wl - 140]]), '#3a3a40', 2), sh(poly([[x1 - 40, wl - 140], [x1 - 6, wl - 130], [x1 - 40, wl - 120]]), '#e8b866'));
  scene(ol(rect(x0 + 360, wl - 56, 40, 16, 3), '#8a5a3a', 1));
}
target('lifebuoy', 'Lifebuoy', place(lifebuoy(38), { x: 1020, y: 690 }));

// =====================================================================
// near quay: parapet wall and the green bookstalls
// =====================================================================
scene(sh(rect(0, 836, W, 110), STONE));
{
  let joints = '';
  for (let r = 0; r < 3; r++) { const y = 852 + r * 32; joints += line([[0, y], [W, y]]); for (let x = (r % 2) * 60; x < W; x += 120) joints += line([[x, y - 32 + (r ? 0 : 16)], [x, y]]); }
  scene(stroke(joints, STONE_D, 1.6));
  const g = rng(37);
  for (let i = 0; i < 20; i++) scene(sh(rect(g.range(0, W - 100), 856 + g.int(0, 2) * 32, g.range(40, 110), 28, 2), g.pick(['#cbb894', '#e2d4b8', '#c8b08e']), { opacity: 0.6 }));
}
scene(sh(rect(0, 822, W, 22, 2), '#e8dcc2'), sh(rect(0, 840, W, 5), STONE_D));

function print(w: number, h: number, g: Rng): Shape[] {
  const bg = g.pick(['#f6eed8', '#f2e2c6', '#eae2d0', '#f6e6e0']), kind = g.int(0, 3);
  const out: Shape[] = [sh(rect(-w / 2, 0, w, h, 1), bg, { stroke: '#a8987a', strokeWidth: 0.8 })];
  if (kind === 0) out.push(sh(rect(-w * 0.38, h * 0.1, w * 0.76, h * 0.6), '#9ac0d0'), sh(poly([[-w * 0.38, h * 0.7], [-w * 0.1, h * 0.36], [w * 0.1, h * 0.56], [w * 0.38, h * 0.3], [w * 0.38, h * 0.7]]), '#6a8a5a'));
  else if (kind === 1) out.push(sh(circle(0, h * 0.4, w * 0.28), g.pick(['#e8a0a0', '#e8c06a', '#a0b8e0'])), sh(leaf(0, h * 0.68, h * 0.2, w * 0.08, -90), '#5a8a4a'));
  else if (kind === 2) out.push(sh(poly([[0, h * 0.1], [w * 0.2, h * 0.7], [-w * 0.2, h * 0.7]]), '#7a8496'), sh(rect(-w * 0.32, h * 0.7, w * 0.64, h * 0.04), '#7a8496'));
  else out.push(sh(rect(-w * 0.36, h * 0.12, w * 0.72, h * 0.58), g.pick(['#c86a5a', '#3f6a8a', '#e8b866'])), sh(rect(-w * 0.24, h * 0.24, w * 0.48, h * 0.1), '#f6eed8'));
  out.push(sh(rect(-w * 0.3, h * 0.8, w * 0.6, h * 0.04), '#8a7a62'));
  return out;
}
function bookstall(x0: number, x1: number, seed: number): void {
  const g = rng(seed), w = x1 - x0, top = 748, lidTop = 590;
  // open lid (inner face), with prints pinned
  scene(ol(poly([[x0 + 10, top - 4], [x0 + 22, lidTop], [x1 - 22, lidTop], [x1 - 10, top - 4]]), STALL_D, 1.2, -0.3));
  scene(sh(poly([[x0 + 22, top - 4], [x0 + 32, lidTop + 12], [x1 - 32, lidTop + 12], [x1 - 22, top - 4]]), '#5a4a3a'));
  scene(stroke(line([[x0 + 24, top - 2], [x0 + 40, lidTop + 20]]) + line([[x1 - 24, top - 2], [x1 - 40, lidTop + 20]]), '#2a2a2e', 2.4));
  const cols = Math.floor((w - 70) / 56);
  for (let r = 0; r < 2; r++) for (let c = 0; c < cols; c++) {
    if (g.next() < 0.12) continue;
    const pw = g.range(38, 48), ph = g.range(50, 62);
    scene(place(print(pw, ph, g), { x: x0 + 52 + c * 56 + (w - 70 - cols * 56) / 2 + g.range(-3, 3), y: lidTop + 22 + r * 72, rot: g.range(-3, 3) }));
  }
  // box body
  scene(ol(rect(x0, top, w, 92, 3), STALL, 1.2, -0.3), sh(rect(x0, top, w, 10), STALL_L), sh(rect(x0 + 6, top + 22, w - 12, 3) + rect(x0 + 6, top + 64, w - 12, 3), STALL_D));
  scene(sh(rect(x0 + w / 2 - 14, top + 34, 28, 20, 3), '#c8a24a'), sh(circle(x0 + w / 2, top + 44, 4), '#5a4a2a'));
  // books standing and stacked along the top
  scene(place(bookRow(w - 20, 26, 44, g, ['#8a3a3a', '#3f5a7a', '#c89a4a', '#5a7a4a', '#e8dcc0', '#6a4a6a', '#a86a3a']), { x: x0 + 10, y: top + 2 }));
  // postcards clipped to a string along the front
  scene(stroke(line([[x0 + 8, top + 18], [x1 - 8, top + 18]]), '#6a5a4a', 1));
  for (let x = x0 + 26; x < x1 - 20; x += g.range(30, 40)) {
    const c = g.pick(['#f2e6c8', '#c8dce6', '#f2d0c8', '#e8e2b0']);
    scene(sh(rect(x - 11, top + 18, 22, 28, 1), c, { stroke: '#8a7a62', strokeWidth: 0.6 }), sh(rect(x - 8, top + 22, 16, 12), g.pick(['#7aa0b8', '#c86a5a', '#8aaa62', '#e8b866'])), sh(rect(x - 2, top + 15, 4, 6), '#c8a24a'));
  }
}
bookstall(16, 372, 41);
bookstall(398, 742, 43);
target('magnifying-glass', 'Magnifying glass', place(magnifier(64), { x: 560, y: 722, rot: -20 }));
target('pigeon', 'Pigeon on the bookstall', place(pigeon(54, '#8a8ea0'), { x: 108, y: 590 }));
{
  // postcard spinner rack on the open stretch of quay
  const cx = 830;
  scene(shadow(cx, 1062, 46, 8), stroke(line([[cx, 1060], [cx, 846]]), '#3a3a40', 4), sh(rect(cx - 36, 1054, 72, 8, 3), '#3a3a40'));
  const g = rng(47);
  for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) {
    const x = cx - 40 + c * 27, y = 860 + r * 46;
    scene(sh(rect(x, y, 24, 36, 1), g.pick(['#f6eed8', '#e8f0f2', '#f6e0d8']), { stroke: '#8a7a62', strokeWidth: 0.6 }), sh(rect(x + 3, y + 3, 18, 18), g.pick(['#7aa0b8', '#c86a5a', '#8aaa62', '#e8b866', '#9a7ac0'])));
  }
  scene(sh(circle(cx, 842, 7), '#3a3a40'));
}

// =====================================================================
// sidewalk
// =====================================================================
scene(sh(rect(0, 944, W, H - 944), `url(#${ID}-walk)`));
{
  const g = rng(53);
  for (let r = 0; r < 26; r++) {
    const y = 950 + r * 21, h = 16 + r * 0.25, w = 30 + r * 1.2;
    let d = '';
    for (let x = -((r * 17) % w); x < W; x += w + 4) d += rect(x, y, w, h, 5);
    scene(sh(d, g.pick(['#cbbda4', '#c6b69c', '#d2c4aa']), { stroke: '#a8987e', strokeWidth: 1 }));
  }
  // dappled shade and sun patches from the plane trees
  for (let i = 0; i < 26; i++) scene(sh(ellipse(g.range(0, W), g.range(960, 1480), g.range(30, 90), g.range(10, 24)), '#6a5a40', { opacity: 0.12 }));
  for (let i = 0; i < 14; i++) scene(sh(ellipse(g.range(0, W), g.range(980, 1480), g.range(20, 60), g.range(6, 14)), '#fff6dc', { opacity: 0.25 }));
  scene(sh(rect(0, 944, W, 10), '#a8987e', { opacity: 0.5 }));
  // fallen leaves
  for (let i = 0; i < 30; i++) scene(sh(leaf(g.range(0, W), g.range(970, 1490), g.range(10, 16), 5, g.range(0, 360)), g.pick(['#c8a24a', '#b8803a', '#8aaa58', '#d8b860'])));
}
target('fishing-rod', 'Fishing rod', place(fishingRod(250), { x: 1010, y: 960, rot: 4 }));
{
  // a bucket and tackle box by the rod
  scene(ol(poly([[1040, 924], [1080, 924], [1076, 966], [1044, 966]]), '#5c8fb0', 1), stroke(curve([[1040, 926], [1060, 906], [1080, 926]]), '#3a3a40', 1.6));
  scene(ol(rect(950, 936, 50, 30, 3), '#2f6b4a', 1), sh(rect(950, 936, 50, 8, 2), '#3f7d5a'), sh(rect(968, 932, 14, 6, 2), '#3a3a40'));
}

// =====================================================================
// left foreground: painter's corner
// =====================================================================
{
  const g = rng(61);
  const canvas: Shape[] = [
    ol(rect(-80, -300, 160, 120, 2), '#f6eed8', 1.4, -0.3),
    sh(rect(-72, -292, 144, 50), '#a8d0e0'), sh(circle(40, -276, 12), '#f6d48a'),
    sh(rect(-72, -242, 144, 54), '#6a9aa0'),
    sh(M(-72, -228) + Q(-30, -270, 10, -228) + L(10, -222) + Q(-30, -258, -72, -222) + 'Z', '#d8c8a8'),
    sh(rect(-60, -258, 20, 16) + rect(-36, -264, 26, 22) + rect(-6, -256, 18, 14), '#e8d6b8'),
    stroke(line([[30, -210], [60, -210]]) + line([[-20, -200], [10, -200]]), '#a8d0e0', 2),
  ];
  scene(shadow(150, 1300, 110, 12));
  scene(place(easel(320, canvas), { x: 150, y: 1300 }));
  // painter's stool
  scene(shadow(330, 1290, 50, 8), stroke(line([[300, 1290], [312, 1210]]) + line([[360, 1290], [348, 1210]]) + line([[316, 1290], [320, 1210]]), '#8a5a32', 5), ol(ellipse(330, 1208, 44, 10), '#a87444', 1));
  // jar of brushes and a paint box
  scene(sh(rect(40, 1320, 34, 44, 4), '#dff0f4', { opacity: 0.7, stroke: '#a8c8d0', strokeWidth: 1 }), stroke(line([[50, 1324], [44, 1286]]) + line([[58, 1324], [60, 1280]]) + line([[66, 1324], [74, 1290]]), '#8a5a32', 3));
  scene(sh(circle(44, 1284, 3), '#d8362c'), sh(circle(60, 1278, 3), '#3f7fc0'), sh(circle(74, 1288, 3), '#f2c23c'));
  scene(ol(rect(90, 1330, 90, 40, 3), '#3a3a40', 1));
  for (let i = 0; i < 6; i++) scene(sh(rect(96 + i * 14, 1336, 10, 12, 2), ['#d8362c', '#f2c23c', '#3f7fc0', '#4f9a4f', '#f6f0e2', '#9a4aa0'][i]));
  scene(place(pot(80, 70, '#c8673e'), { x: 60, y: 1480 }), place(leafyPlant(80, ['#5f9058', '#4f7f52', '#6aa060'], g, 14, 60, 0.35), { x: 60, y: 1414 }));
}
target('palette', 'Paint palette', place(paintPalette(84), { x: 334, y: 1196, rot: -8 }));
target('umbrella', 'Red umbrella', place(umbrella(120, '#c8322a', '#f2e6d0'), { x: 520, y: 1110, rot: 14 }));
{
  // busker's folding chair with an open case
  scene(shadow(500, 1400, 70, 10));
  scene(stroke(line([[456, 1400], [540, 1310]]) + line([[540, 1400], [456, 1310]]), '#6a4a32', 6), ol(rect(444, 1300, 112, 16, 3), '#a87444', 1), stroke(line([[456, 1306], [462, 1210]]) + line([[540, 1306], [534, 1210]]), '#6a4a32', 6), ol(rect(456, 1210, 84, 30, 4), '#a87444', 1));
  scene(ol(poly([[300, 1420], [440, 1420], [450, 1460], [290, 1460]]), '#3a2a2a', 1), sh(poly([[306, 1424], [434, 1424], [440, 1452], [298, 1452]]), '#8a2a3a'), sh(circle(340, 1440, 5) + circle(360, 1446, 5) + circle(400, 1438, 5), '#d8b44a'));
}
target('accordion', 'Accordion', place(accordion(92, '#c8322a'), { x: 500, y: 1300 }));

// =====================================================================
// centre: lamp post, bicycle, pigeons, poodle
// =====================================================================
{
  const x = 748;
  scene(shadow(x, 1250, 40, 8), sh(rect(x - 20, 1210, 40, 40, 4), '#2a3236'), sh(poly([[x - 12, 1210], [x + 12, 1210], [x + 7, 700], [x - 7, 700]]), '#2a3236'));
  scene(sh(rect(x - 16, 1000, 32, 12, 3) + rect(x - 12, 860, 24, 10, 3), '#3a4448'), stroke(line([[x - 40, 740], [x + 40, 740]]), '#2a3236', 4));
  scene(sh(poly([[x - 30, 690], [x + 30, 690], [x + 20, 620], [x - 20, 620]]), '#f6e2a0', { opacity: 0.9 }), stroke(poly([[x - 30, 690], [x + 30, 690], [x + 20, 620], [x - 20, 620]]) + line([[x, 620], [x, 690]]), '#2a3236', 3), sh(poly([[x - 34, 622], [x + 34, 622], [x, 594]]), '#2a3236'), sh(circle(x, 590, 6), '#2a3236'));
}
target('bicycle', 'Bicycle', place(bicycle(230, '#3f7d6a'), { x: 690, y: 1240 }));
scene(place(pigeon(44, '#9a9eb0'), { x: 860, y: 1180 }), place(pigeon(40, '#7a7e90'), { x: 330, y: 1060 }).map((p) => ({ ...p, d: xf(p.d, { sx: -1, ox: 330 }) })));
{
  const g = rng(67);
  let crumbs = '';
  for (let i = 0; i < 12; i++) crumbs += circle(880 + g.range(-30, 30), 1184 + g.range(-6, 8), 1.8);
  scene(sh(crumbs, '#e8c890'));
}
target('poodle', 'Poodle', place(poodle(84, '#e8c8a0'), { x: 640, y: 1440 }));
scene(stroke(curve([[612, 1376], [650, 1420], [700, 1430], [760, 1480]]), '#d8362c', 2));

// =====================================================================
// right foreground: café corner
// =====================================================================
{
  const g = rng(71);
  // chalkboard A-frame
  scene(shadow(1110, 1170, 50, 8), stroke(line([[1072, 1170], [1092, 1010]]) + line([[1148, 1170], [1128, 1010]]), '#6a4a32', 6), ol(rect(1076, 1012, 68, 110, 3), '#2a3230', 2, 0.3));
  scene(stroke(line([[1086, 1032], [1132, 1032]]) + line([[1086, 1050], [1120, 1050]]) + line([[1086, 1066], [1128, 1066]]) + line([[1086, 1084], [1110, 1084]]), '#e8e2d0', 2), sh(circle(1124, 1098, 8), '#e8b866'));
  // boxwood planters
  scene(place(pot(70, 60, '#5a5a5a'), { x: 1160, y: 1300 }), place(foliage(38, ['#4a7a3a', '#5a8a42', '#3a6a32'], g, 10), { x: 1160, y: 1220 }));
  // flower bucket stand
  scene(ol(poly([[880, 1046], [960, 1046], [952, 1110], [888, 1110]]), '#8a9aa0', 1), sh(rect(878, 1040, 84, 10, 3), '#a8b8c0'));
  for (let i = 0; i < 4; i++) scene(place(leafyPlant(50, ['#5a8a42', '#6f9a4a'], g, 6, 30, 0.2), { x: 892 + i * 18, y: 1044 }), sh(circle(892 + i * 18, 990, 9), ['#f2c84a', '#e8556a', '#fbf4ec', '#e87a3a'][i]));
}
target('bouquet', 'Bouquet', place(bouquet(110, rng(73)), { x: 984, y: 1110, rot: 8 }));
scene(place(bistroChair(110, '#c8423a'), { x: 860, y: 1440 }));
scene(place(cafeTable(190, 170, '#e8e0d0', '#2f3436'), { x: 1010, y: 1450 }));
scene(place(bistroChair(110, '#c8423a'), { x: 1150, y: 1460 }));
target('coffee-cup', 'Coffee cup', place(coffeeCup(52, '#f6f0e2', '#2f6b8a'), { x: 970, y: 1278 }));
scene(ol(ellipse(1050, 1276, 38, 8), '#ffffff', 1, -0.2));
target('croissant', 'Croissant', place(croissant(64), { x: 1050, y: 1262 }));
scene(sh(rect(1078, 1258, 12, 20, 2), '#c8dce0', { opacity: 0.7 }), sh(rect(1080, 1262, 8, 14), '#f6e0a0'));
target('beret', 'Beret', place(beret(62, '#3a3a5a'), { x: 860, y: 1352 }));
{
  // shopping bag with a baguette
  scene(shadow(1110, 1488, 50, 8), ol(poly([[1070, 1400], [1150, 1400], [1158, 1488], [1062, 1488]]), '#d8b07a', 1, -0.3), stroke(curve([[1084, 1400], [1096, 1376], [1110, 1400]]), '#a8804a', 2.4));
  scene(sh(leaf(1130, 1404, 40, 10, -70), '#6aa04a'), sh(circle(1140, 1394, 9), '#d8362c'));
}
target('baguette', 'Baguette', place(baguette(150, -64), { x: 1098, y: 1356 }));

// =====================================================================
// plane trees framing the scene
// =====================================================================
{
  const g = rng(81);
  scene(shadow(40, 1180, 80, 12), place(planeTrunk(80, 1180, g), { x: 30, y: 1180 }));
  scene(shadow(1180, 1050, 60, 10), place(planeTrunk(60, 1050, g), { x: 1186, y: 1050 }));
  scene(sh(rect(0, 1170, 110, 14, 2), '#6a6a6a'), stroke(line([[-4, 1176], [100, 1176]]), '#4a4a4a', 2));
  const clumps: [number, number, number][] = [[0, 30, 160], [120, 0, 140], [230, 40, 110], [60, 170, 120], [-20, 280, 110], [1200, 20, 170], [1080, -10, 130], [990, 30, 100], [1140, 170, 120], [1220, 300, 100]];
  for (const [x, y, r] of clumps) scene(place(foliage(r, LEAVES, g, 22), { x, y }));
  for (let i = 0; i < 40; i++) {
    const side = i % 2 ? g.range(0, 300) : g.range(920, 1200), y = g.range(0, 340);
    scene(sh(xf(M(0, 0) + Q(10, -14, 22, -6) + Q(18, 4, 26, 12) + Q(12, 12, 8, 24) + Q(0, 14, -8, 24) + Q(-12, 12, -26, 12) + Q(-18, 4, -22, -6) + Q(-10, -14, 0, 0) + 'Z', { x: side, y, rot: g.range(0, 360), s: g.range(0.7, 1.1) }), g.pick(LEAVES)));
  }
  for (let i = 0; i < 8; i++) scene(sh(circle(g.range(80, 300), g.range(200, 330), 6) + circle(g.range(940, 1150), g.range(200, 330), 6), '#7a8a4a'));
}
void curve; void petal; void mix; void L; void M; void cafeTable;

const activity: FindActivity = {
  id: ID, version: 1, mode: 'find', title: 'Bookstalls by the River',
  blurb: 'Browse the green bookstalls on a sunny Paris quay, with Notre-Dame and the Eiffel Tower beyond, and spot fourteen treasures among the prints, the barge and the café tables.',
  collectionId: 'cities', categories: ["Cities"], difficulty: 'Moderate',
  width: W, height: H, defs, items,
};
export default activity;
