import { blob, circle, curve, ellipse, leaf, line, linearGradient, petal, place, poly, rect, rng, sh, shade, star, stroke } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { FindActivity, FindItem } from '../types';
import {
  GOLD, GOLD_DK, GOLD_LT, arch, banner, candelabra, chandelier, crownOnCushion, fan, giftBox, glassSlipper, glow, goblet, grandClock, harp, hl,
  mask, ol, rose, shadow, sleepingPet, teapot, throne, tieredCake, twinkle, violin, type Pt,
} from './props-find';

const WD = 1200, HT = 1500;
const ID = 'fairytale-find-1';
const items: FindItem[] = [];
const scene = (...s: Shape[]) => { items.push({ shapes: s }); };
const target = (id: string, name: string, s: Shape[]) => { items.push({ id, name, target: true, shapes: s }); };

const WALL = '#f2e0d4', WALL_DK = '#e6cdbd', STONE = '#efe2d6', VELVET = '#2f6f78', CARPET = '#b0283c';

// ------------------------------------------------------------------ wall, cornice and damask
scene(sh(rect(0, 0, WD, 920), `url(#${ID}-wall)`));
{
  let dm = '', dots = '';
  for (let y = 120; y < 900; y += 74) for (let x = 20; x < WD; x += 64) {
    const ox = (Math.round(y / 74) % 2) * 32;
    for (let k = 0; k < 4; k++) dm += petal(x + ox, y, 11, 4, k * 90 + 45);
    dots += circle(x + ox + 32, y + 37, 2.2);
  }
  scene(sh(dm, WALL_DK, { opacity: 0.55 }), sh(dots, GOLD, { opacity: 0.35 }));
}
// wainscot panels
scene(sh(rect(0, 800, WD, 120), '#ead2c2'), stroke(line([[0, 800], [WD, 800]]), GOLD, 3));
{
  let pn = '';
  for (let x = 14; x < WD; x += 100) pn += rect(x, 818, 80, 76, 4);
  scene(stroke(pn, GOLD_DK, 1.6, { opacity: 0.6 }));
}
scene(sh(rect(0, 900, WD, 22), '#d8b8a6'), stroke(line([[0, 900], [WD, 900]]), GOLD_DK, 2));
// cornice
scene(sh(rect(0, 0, WD, 92), '#e9d0bd'), sh(rect(0, 70, WD, 22), '#f4e6da'), stroke(line([[0, 70], [WD, 70]]) + line([[0, 92], [WD, 92]]), GOLD, 3));
{
  let den = '';
  for (let x = 6; x < WD; x += 18) den += rect(x, 74, 10, 12, 1);
  scene(sh(den, '#e0c4ae'));
  let sw = '';
  for (let x = 0; x < WD; x += 100) sw += curve([[x, 20], [x + 50, 52], [x + 100, 20]]);
  scene(stroke(sw, GOLD, 2.4), sh(Array.from({ length: 13 }, (_, i) => circle(i * 100, 20, 6)).join(''), GOLD_LT, { stroke: GOLD_DK, strokeWidth: 1 }));
}

// ------------------------------------------------------------------ tall arched windows onto a starry night
function windowAt(cx: number, base: number, w: number, h: number, seed: number, moon: boolean) {
  const g = rng(seed);
  scene(ol(arch(cx, base + 16, w + 40, h + 36), STONE, 1.4, -0.2), stroke(arch(cx, base + 16, w + 22, h + 24), GOLD, 2.4));
  scene(sh(arch(cx, base, w, h), `url(#${ID}-night)`));
  const r = w / 2, sp = base - h + r;
  let st = '', tw = '';
  for (let i = 0; i < 26; i++) {
    const x = cx + g.range(-r + 8, r - 8), y = g.range(base - h + 10, base - 110);
    if (y < sp && Math.hypot(x - cx, y - sp) > r - 10) continue;
    if (i % 6 === 0) tw += twinkle(x, y, g.range(4, 7)); else st += circle(x, y, g.range(0.9, 2.1));
  }
  scene(sh(st, '#fff8dc', { opacity: 0.9 }), sh(tw, '#fff3c0'));
  if (moon) scene(...glow(cx + 18, base - h + 120, 60, '#fff3c8', 0.35), sh(circle(cx + 18, base - h + 120, 22), '#fbf3d0'), sh(circle(cx + 10, base - h + 114, 4) + circle(cx + 26, base - h + 128, 5), '#e8dcb0'));
  // distant hills and a little town with lit windows
  scene(sh(blob([[cx - r, base - 70], [cx - r * 0.4, base - 96], [cx + r * 0.3, base - 80], [cx + r, base - 104], [cx + r, base], [cx - r, base]], 0.6), '#30406e'));
  let roofs = '', lit = '';
  for (let i = 0; i < 4; i++) {
    const x = cx - r + 10 + i * (w - 20) / 4 + g.range(0, 8), bw = g.range(16, 24), bh = g.range(20, 40), y = base - 34;
    roofs += rect(x, y - bh, bw, bh + 34) + poly([[x - 3, y - bh], [x + bw / 2, y - bh - g.range(12, 22)], [x + bw + 3, y - bh]]);
    lit += rect(x + 5, y - bh + 8, 4, 6) + (bh > 28 ? rect(x + bw - 9, y - bh + 18, 4, 6) : '');
  }
  scene(sh(roofs, '#1e2a4e'), sh(lit, '#ffd36a'));
  // tracery
  let mul = line([[cx, sp - r * 0.3], [cx, base]]);
  for (let y = base - 70; y > sp; y -= 70) mul += line([[cx - r, y], [cx + r, y]]);
  scene(stroke(mul + line([[cx - r * 0.5, sp], [cx - r * 0.5, base]]) + line([[cx + r * 0.5, sp], [cx + r * 0.5, base]]), '#ead8c6', 4));
  scene(stroke(circle(cx, sp - r * 0.25, r * 0.42) + line([[cx - r, sp], [cx + r, sp]]), '#ead8c6', 4), sh(star(cx, sp - r * 0.25, r * 0.22, r * 0.09, 6), GOLD, { opacity: 0.8 }));
  scene(ol(rect(cx - w / 2 - 26, base, w + 52, 14, 3), STONE, 1.2, -0.25));
  // velvet drapes with gold tie-backs
  const top = base - h - 26, tie = base - 230;
  for (const side of [-1, 1]) {
    const x0 = cx + side * (w / 2 + 8);
    const d = blob([[x0 - side * 44, top], [x0 + side * 22, top], [x0 + side * 4, tie], [x0 + side * 16, tie + 60], [x0 + side * 30, base + 70], [x0 - side * 16, base + 70], [x0 - side * 6, tie + 40], [x0 - side * 26, tie]], 0.5);
    scene(sh(d, VELVET), stroke(curve([[x0 - side * 30, top + 10], [x0 - side * 10, tie - 40], [x0 - side * 2, tie]]) + curve([[x0 - side * 2, tie + 40], [x0 + side * 4, tie + 140], [x0 + side * 10, base + 60]]), shade(VELVET, -0.3), 2));
    scene(ol(ellipse(x0, tie + 6, 16, 7, side * 15), GOLD, 1), sh(petal(x0 + side * 12, tie + 10, 34, 5, 90 - side * 10), GOLD));
  }
  scene(sh(blob([[cx - w / 2 - 50, top - 6], [cx + w / 2 + 50, top - 6], [cx + w / 2 + 40, top + 30], [cx, top + 50], [cx - w / 2 - 40, top + 30]], 0.7), VELVET), stroke(curve([[cx - w / 2 - 40, top + 30], [cx, top + 50], [cx + w / 2 + 40, top + 30]]), GOLD, 3));
  scene(sh(circle(cx - w / 2 - 40, top + 30, 5) + circle(cx, top + 50, 6) + circle(cx + w / 2 + 40, top + 30, 5), GOLD_LT));
}
windowAt(130, 760, 140, 540, 11, false);
windowAt(335, 760, 120, 500, 12, false);
windowAt(865, 760, 120, 500, 13, false);
windowAt(1070, 760, 140, 540, 14, true);

// ------------------------------------------------------------------ banners on the wall
scene(...place(banner(60, 210, '#a8324a', 'crown'), { x: 233, y: 128 }));
scene(...place(banner(60, 210, '#3f5aa0', 'moon'), { x: 967, y: 128 }));

// ------------------------------------------------------------------ the great doorway, columns and the clock
scene(ol(arch(600, 560, 260, 370), STONE, 1.4, -0.2), stroke(arch(600, 560, 236, 352), GOLD, 3));
scene(sh(arch(600, 560, 220, 340), `url(#${ID}-night)`));
{
  const g = rng(21);
  let st = '';
  for (let i = 0; i < 26; i++) st += circle(g.range(500, 700), g.range(300, 470), g.range(0.8, 2));
  scene(sh(st, '#fff8dc'), sh(twinkle(540, 330, 7) + twinkle(660, 380, 5) + twinkle(610, 300, 4), '#fff3c0'));
  // balcony balustrade seen through the doors
  scene(sh(rect(490, 500, 220, 60), '#3a4a7a'), stroke(line([[490, 500], [710, 500]]), '#c8c0d8', 5));
  let bal = '';
  for (let x = 500; x < 710; x += 14) bal += ellipse(x, 526, 4, 20);
  scene(sh(bal, '#9a92b4'));
  // open doors
  scene(ol(poly([[490, 560], [490, 290], [452, 300], [452, 566]]), '#e8d4c0', 1.2, -0.3), ol(poly([[710, 560], [710, 290], [748, 300], [748, 566]]), '#e8d4c0', 1.2, -0.3));
  scene(stroke(rect(460, 330, 22, 90, 2) + rect(460, 440, 22, 100, 2) + rect(718, 330, 22, 90, 2) + rect(718, 440, 22, 100, 2), GOLD, 1.4), sh(circle(484, 430, 3) + circle(716, 430, 3), GOLD));
}
for (const x of [434, 766]) {
  scene(sh(rect(x - 22, 140, 44, 430), '#f6ede6'), sh(rect(x + 6, 140, 16, 430), '#e8d8ce'));
  scene(stroke(line([[x - 10, 160], [x - 10, 560]]) + line([[x, 160], [x, 560]]) + line([[x + 10, 160], [x + 10, 560]]), '#dccabe', 1.4));
  scene(ol(rect(x - 30, 118, 60, 24, 3), GOLD, 1.2), sh(ellipse(x - 20, 130, 9, 9) + ellipse(x + 20, 130, 9, 9), GOLD_LT), ol(rect(x - 28, 548, 56, 20, 3), STONE, 1, -0.25));
}
// rose garland swagged over the doorway
{
  const pts: Pt[] = [];
  for (let i = 0; i <= 20; i++) { const t = i / 20; pts.push([434 + 332 * t, 196 + Math.sin(Math.PI * t) * 54]); }
  scene(stroke(curve(pts), '#5f8a4a', 9));
  let lv = '', rs = '', rs2 = '';
  pts.forEach(([x, y], i) => {
    lv += leaf(x, y, 12, 4, i % 2 ? 30 : 150) + leaf(x, y, 10, 3.5, i % 2 ? 200 : -20);
    if (i % 2 === 0) rs += circle(x, y - 2, 7); else rs2 += circle(x, y + 2, 5.5);
  });
  scene(sh(lv, '#6f9a5a'), sh(rs, '#e8708e'), sh(rs2, '#f6c4cf'));
}
target('clock', 'Clock at midnight', place(grandClock(44), { x: 600, y: 160 }));

// ------------------------------------------------------------------ chandeliers
scene(...place(chandelier(210), { x: 300, y: 0 }));
scene(...place(chandelier(210), { x: 900, y: 0 }));

// ------------------------------------------------------------------ marble floor in perspective
{
  const vx = 600, vy = 330, y0 = 920;
  const rows: number[] = [];
  for (let k = 0; k <= 12; k++) rows.push(y0 + (HT + 40 - y0) * Math.pow(k / 12, 1.5));
  const xAt = (xb: number, y: number) => vx + ((xb - vx) * (y - vy)) / (HT - vy);
  const cols = ['#f6eee8', '#ead8d0', '#d8b4aa', '#c99c92'];
  const by = ['', '', '', ''];
  for (let k = 0; k < 12; k++) for (let j = -14; j < 14; j++) {
    const xb0 = vx + j * 120, xb1 = xb0 + 120, ya = rows[k], yb = rows[k + 1];
    const q = poly([[xAt(xb0, ya), ya], [xAt(xb1, ya), ya], [xAt(xb1, yb), yb], [xAt(xb0, yb), yb]]);
    by[((j + k) % 2 === 0 ? 0 : 2) + ((j * 7 + k * 3) % 5 === 0 ? 1 : 0)] += q;
  }
  by.forEach((d, i) => scene(sh(d, cols[i])));
  const g = rng(31);
  let vein = '';
  for (let i = 0; i < 40; i++) { const x = g.range(0, WD), y = g.range(940, 1500); vein += curve([[x, y], [x + g.range(10, 30), y + g.range(-6, 6)], [x + g.range(30, 60), y + g.range(-10, 10)]]); }
  scene(stroke(vein, '#b89a92', 0.9, { opacity: 0.5 }));
  // inlaid medallion
  scene(sh(ellipse(600, 1260, 300, 100), '#d8b4aa', { opacity: 0.6 }), stroke(ellipse(600, 1260, 300, 100) + ellipse(600, 1260, 250, 82), GOLD, 3, { opacity: 0.9 }));
  scene(sh(xfStar(600, 1260, 230, 76), '#ecd8a0', { opacity: 0.85 }), sh(xfStar(600, 1260, 120, 40), '#c8a0a8', { opacity: 0.7 }), sh(ellipse(600, 1260, 34, 12), GOLD));
  // moonlight
  scene(sh(poly([[60, 760], [200, 760], [340, 1500], [40, 1500]]) + poly([[1000, 760], [1140, 760], [1200, 1300], [1200, 1500], [900, 1500]]), '#dce8ff', { opacity: 0.1 }));
}
function xfStar(cx: number, cy: number, rx: number, ry: number) {
  const pts: Pt[] = [];
  for (let i = 0; i < 16; i++) { const a = (i * Math.PI) / 8 - Math.PI / 2, r = i % 2 ? 0.34 : 1; pts.push([cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r]); }
  return poly(pts);
}

// ------------------------------------------------------------------ the marble staircase
{
  const cx = 600, top = 560, step = 40, N = 11;
  scene(sh(rect(424, 540, 352, 24), '#f6eee8'), stroke(line([[424, 540], [776, 540]]), GOLD_DK, 1.4));
  const hw = (i: number) => 172 + i * 11;
  // stringers
  scene(sh(poly([[cx - hw(0) - 14, top], [cx - hw(0), top], [cx - hw(N - 1), top + N * step], [cx - hw(N - 1) - 18, top + N * step]]) + poly([[cx + hw(0) + 14, top], [cx + hw(0), top], [cx + hw(N - 1), top + N * step], [cx + hw(N - 1) + 18, top + N * step]]), '#dcc6ba'));
  const g = rng(41);
  for (let i = 0; i < N; i++) {
    const y = top + i * step, w = hw(i);
    scene(sh(rect(cx - w, y, w * 2, 11), '#fbf6f2'), sh(rect(cx - w, y + 11, w * 2, step - 11), i % 2 ? '#ead9cf' : '#e6d3c8'));
    scene(stroke(curve([[cx - w + g.range(10, 60), y + 20], [cx - w + g.range(80, 120), y + 26], [cx - w + g.range(130, 170), y + 22]]) + curve([[cx + w - g.range(10, 60), y + 24], [cx + w - g.range(80, 120), y + 18], [cx + w - g.range(130, 170), y + 28]]), '#cdb4a8', 0.9));
    const cw = 60 + i * 4;
    scene(sh(rect(cx - cw, y, cw * 2, 11), shade(CARPET, 0.12)), sh(rect(cx - cw, y + 11, cw * 2, step - 11), CARPET));
    scene(stroke(line([[cx - cw + 6, y + 2], [cx - cw + 6, y + step]]) + line([[cx + cw - 6, y + 2], [cx + cw - 6, y + step]]), GOLD, 1.6), ol(rect(cx - cw - 4, y + 9, cw * 2 + 8, 4, 2), GOLD, 0.6));
  }
  // balustrades
  for (const side of [-1, 1]) {
    let bal = '';
    for (let i = 0; i < N; i++) {
      const y = top + i * step, x = cx + side * (hw(i) - 6);
      bal += ellipse(x, y - 22, 5, 16) + rect(x - 3, y - 8, 6, 8);
    }
    scene(sh(bal, '#f2e8e0', { stroke: '#cdb8ac', strokeWidth: 1 }));
    scene(stroke(line([[cx + side * (hw(0) - 6), top - 44], [cx + side * (hw(N - 1) - 6), top + (N - 1) * step - 44]]), '#c99a5a', 9), stroke(line([[cx + side * (hw(0) - 6), top - 46], [cx + side * (hw(N - 1) - 6), top + (N - 1) * step - 46]]), '#e8c07a', 3));
    const nx = cx + side * (hw(N - 1) + 4);
    scene(ol(rect(nx - 17, 900, 34, 100, 3), '#f2e8e0', 1.2, -0.25), ol(rect(nx - 21, 892, 42, 12, 3), GOLD, 1), ol(rect(nx - 21, 992, 42, 12, 3), '#e6d3c8', 1, -0.25));
    scene(...place(candelabra(), { x: nx, y: 892, s: 0.9 }));
  }
  // top landing posts
  for (const x of [420, 780]) scene(ol(rect(x - 12, 486, 24, 76, 3), '#f2e8e0', 1, -0.25), ol(circle(x, 480, 10), GOLD, 1));
}
target('slipper', 'Glass slipper', place(glassSlipper(), { x: 718, y: 880, s: 0.95 }));

// ------------------------------------------------------------------ the royal dais and thrones
scene(sh(rect(0, 850, 400, 34), '#c99a8e'), sh(rect(0, 884, 412, 40), '#b88a7e'), stroke(line([[0, 850], [400, 850]]) + line([[0, 884], [412, 884]]), GOLD, 2.4));
scene(sh(rect(30, 848, 340, 6), CARPET), sh(poly([[40, 884], [360, 884], [372, 924], [28, 924]]), shade(CARPET, -0.1)));
scene(...place(throne('#7a2a4a'), { x: 95, y: 852, s: 0.82 }));
scene(...place(throne('#2f5a7a'), { x: 285, y: 852, s: 0.82 }));
scene(ol(rect(176, 790, 40, 62, 3), GOLD, 1.2), ol(rect(166, 782, 60, 10, 3), GOLD_LT, 1));
target('crown', 'Crown on a cushion', place(crownOnCushion(), { x: 196, y: 784, s: 0.68 }));
// little footstools
scene(ol(blob([[60, 880], [56, 866], [100, 862], [104, 880]], 0.6), '#7a2a4a', 1), ol(blob([[252, 880], [248, 866], [292, 862], [296, 880]], 0.6), '#2f5a7a', 1), sh(circle(80, 870, 2) + circle(272, 870, 2), GOLD));

// ------------------------------------------------------------------ the buffet
{
  const x0 = 900, x1 = 1210, ty = 872;
  scene(sh(rect(x0, ty, x1 - x0, 160), '#fbf4ee'), sh(rect(x0, ty - 14, x1 - x0, 16), '#f3e6dc'));
  let pleat = '';
  for (let x = x0 + 16; x < x1; x += 22) pleat += line([[x, ty + 40], [x + 3, ty + 158]]);
  scene(stroke(pleat, '#e2d0c4', 1.6));
  let sw = '', bows = '';
  for (let x = x0; x < x1; x += 62) { sw += blob([[x, ty], [x + 62, ty], [x + 52, ty + 30], [x + 31, ty + 42], [x + 10, ty + 30]], 0.7); bows += circle(x, ty + 4, 6); }
  scene(sh(sw, '#f3b4c2'), stroke(curve([[x0, ty + 26], [x0 + 300, ty + 26]]), '#fff', 0.1), sh(bows, GOLD), sh(rect(x0, ty + 152, x1 - x0, 10), '#e8d4c8'));
  // food and silver
  scene(...place(candelabra(), { x: 1186, y: ty - 6, s: 0.95 }));
  scene(sh(ellipse(1104, ty - 6, 40, 8), '#c8ccd4'), sh(ellipse(1104, ty - 9, 34, 6), '#e6e8ee'));
  {
    const g = rng(51);
    let fr = '', fr2 = '', gr = '';
    for (let r = 0; r < 4; r++) for (let c = 0; c <= 4 - r; c++) {
      const x = 1104 - (4 - r) * 8 + c * 16, y = ty - 18 - r * 13;
      if ((r + c) % 2) fr += circle(x, y, 8); else fr2 += circle(x, y, 8);
    }
    for (let i = 0; i < 8; i++) gr += circle(1076 + g.range(-6, 6), ty - 14 - i * 3 + g.range(-2, 2), 4);
    scene(sh(fr, '#f2a03a'), sh(fr2, '#d8433a'), sh(gr, '#8a5ab0'), sh(leaf(1104, ty - 72, 12, 4, -60) + leaf(1104, ty - 72, 12, 4, -120), '#5f8f4a'));
  }
  // macaron tower
  {
    const cols = ['#f3b4c2', '#bfe0c8', '#f6e0a0', '#cdb8ec', '#bcd8f0'];
    for (let r = 0; r < 6; r++) {
      let d = '';
      for (let c = -2; c <= 2; c++) if (Math.abs(c) <= (5 - r) / 2.2) d += ellipse(948 + c * 12, ty - 10 - r * 11, 6.5, 5);
      scene(sh(d, cols[r % 5]));
    }
    scene(sh(ellipse(948, ty - 4, 30, 5), '#d8dce4'));
  }
  scene(...place(teapot('#f6f0f4', '#c8708e'), { x: 1150, y: ty + 2, s: 0.7 }));
  // cupcakes along the front
  for (const [x, c] of [[1000, '#f3b4c2'], [1050, '#cdb8ec']] as [number, string][]) scene(sh(poly([[x - 10, ty + 1], [x + 10, ty + 1], [x + 7, ty - 12], [x - 7, ty - 12]]), '#e0a060'), sh(blob([[x - 11, ty - 11], [x, ty - 26], [x + 11, ty - 11]], 0.9), c), sh(circle(x, ty - 26, 3), '#c8324a'));
}
target('cake', 'Three-tier cake', place(tieredCake(), { x: 1018, y: 862, s: 0.95 }));
target('goblet', 'Golden goblet', place(goblet(), { x: 914, y: 864, s: 0.95 }));

// ------------------------------------------------------------------ music corner by the dais
// gilded chairs
function chair(x: number, y: number, s: number, seat: string) {
  scene(...place([
    shadow(0, 2, 28, 5),
    ol(arch(0, -44, 44, 70), GOLD, 1.2), sh(arch(0, -48, 32, 58), seat),
    ol(rect(-26, -50, 52, 12, 5), seat, 1), stroke(line([[-20, -40], [-24, 0]]) + line([[20, -40], [24, 0]]), GOLD_DK, 4),
  ], { x, y, s }));
}
chair(60, 1060, 1, '#7a2a4a');
chair(1150, 1100, 1, '#2f5a7a');
target('harp', 'Golden harp', place(harp(), { x: 250, y: 1094, s: 0.95 }));
// music stand with sheet music
scene(stroke(line([[120, 1100], [120, 990]]) + line([[120, 1100], [100, 1110]]) + line([[120, 1100], [140, 1110]]), GOLD_DK, 3));
scene(ol(poly([[90, 950], [150, 950], [154, 992], [86, 992]]), '#fbf6ea', 1, -0.2));
{
  let notes = '';
  for (let k = 0; k < 4; k++) notes += line([[94, 960 + k * 8], [148, 960 + k * 8]]);
  scene(stroke(notes, '#8a7a7a', 0.7), sh(circle(102, 964, 2.2) + circle(116, 972, 2.2) + circle(132, 960, 2.2) + circle(140, 980, 2.2), '#3a2a3a'));
}
target('violin', 'Violin', place(violin(), { x: 410, y: 1118, s: 0.85, rot: -58 }));

// ------------------------------------------------------------------ the dance floor after the ball
target('gift', 'Gift with a gold bow', place(giftBox('#4f86c6'), { x: 1080, y: 1100, s: 1 }));
scene(...place(giftBox('#e8708e', '#ffffff'), { x: 1010, y: 1112, s: 0.7 }));
// confetti and petals
{
  const g = rng(61);
  const cols = ['#e8708e', '#f3c94f', '#6fa8d8', '#9ad0a8', '#cdb8ec'];
  const by = cols.map(() => '');
  for (let i = 0; i < 140; i++) {
    const x = g.range(10, WD - 10), y = g.range(1020, 1490);
    const k = g.int(0, cols.length - 1);
    by[k] += g.next() < 0.5 ? rect(x, y, g.range(4, 7), g.range(2.5, 4), 1) : circle(x, y, g.range(1.8, 3));
  }
  by.forEach((d, i) => scene(sh(d, cols[i])));
  let pet = '', pet2 = '';
  for (let i = 0; i < 40; i++) { const d = petal(g.range(20, WD - 20), g.range(1030, 1490), g.range(8, 12), 4, g.range(0, 360)); if (i % 2) pet += d; else pet2 += d; }
  scene(sh(pet, '#d8344e'), sh(pet2, '#f3a7b8'));
  // fallen streamers
  scene(stroke(curve([[480, 1400], [520, 1380], [560, 1410], [610, 1390], [650, 1420]]), '#f3c94f', 3), stroke(curve([[760, 1070], [800, 1060], [830, 1084], [880, 1068]]), '#6fa8d8', 3), stroke(curve([[140, 1440], [180, 1420], [220, 1450], [260, 1430]]), '#e8708e', 3));
}
target('mask', 'Masquerade mask', place(mask(), { x: 330, y: 1290, s: 1, rot: -12 }));
target('fan', 'Lace fan', place(fan(), { x: 860, y: 1330, s: 1, rot: 18 }));
target('rose', 'Red rose', place(rose(), { x: 590, y: 1440, s: 1, rot: -70 }));

// potted topiaries at the front corners
function topiary(x: number, y: number, s: number) {
  scene(...place([
    shadow(0, 2, 44, 7),
    stroke(line([[0, -70], [0, -150]]), '#6a4a2a', 5),
    sh(circle(0, -170, 38), '#4f7f4a'), sh(circle(-10, -180, 24), '#6f9a5a'), sh(circle(14, -160, 14), '#3f6a3a'),
    sh(circle(-18, -168, 4) + circle(10, -190, 4) + circle(20, -170, 3.5) + circle(-4, -150, 3.5), '#f6c4cf'),
    ol(poly([[-34, -74], [34, -74], [24, 0], [-24, 0]]), GOLD, 1.4), sh(rect(-38, -80, 76, 10, 3), GOLD_LT), stroke(curve([[-26, -40], [0, -48], [26, -40]]), GOLD_DK, 2),
  ], { x, y, s }));
}
topiary(70, 1500, 1.15);
topiary(1150, 1500, 1.0);
// tall floor candle stands
for (const [x, y] of [[150, 1330], [1150, 1290]] as Pt[]) scene(...place([
  shadow(0, 2, 30, 6), ol(blob([[-26, 0], [-16, -14], [16, -14], [26, 0]], 0.6), GOLD, 1.2), ol(rect(-5, -150, 10, 140, 3), GOLD, 1),
  ol(ellipse(0, -60, 10, 6), GOLD, 1), ol(ellipse(0, -110, 9, 5), GOLD, 1), ol(blob([[-22, -152], [22, -152], [10, -164], [-10, -164]], 0.5), GOLD, 1.2),
  ...place(candelabra(), { y: -160, s: 0.8 }),
], { x, y }));
// a top hat, white gloves and a dropped bouquet
scene(...place([
  shadow(0, 2, 30, 5), sh(ellipse(0, -2, 32, 8), '#2a2430'), sh(rect(-20, -52, 40, 50, 3), '#3a3240'), sh(rect(-20, -16, 40, 8), '#a8324a'), sh(ellipse(0, -52, 20, 5), '#4a4252'),
], { x: 720, y: 1180, s: 0.9, rot: -8 }));
scene(...place([
  sh(blob([[-30, 0], [-34, -10], [-10, -14], [4, -20], [8, -14], [0, -8], [10, -6], [12, 0], [0, 6]], 0.7), '#fbf6f0', { stroke: '#d8ccc0', strokeWidth: 1 }),
  sh(blob([[-26, 14], [-30, 4], [-6, 2], [10, -2], [14, 4], [4, 8], [14, 12], [14, 18], [0, 20]], 0.7), '#f4eee6', { stroke: '#d8ccc0', strokeWidth: 1 }),
], { x: 180, y: 1200, rot: 10 }));
{
  const g = rng(71);
  let fl = '', fl2 = '', lv = '';
  for (let i = 0; i < 9; i++) { const a = -160 + i * 16, x = Math.cos((a * Math.PI) / 180) * 26, y = Math.sin((a * Math.PI) / 180) * 18; if (i % 2) fl += circle(x, y, 7); else fl2 += circle(x, y, 6); lv += leaf(x, y, 14, 4, a + g.range(-10, 10)); }
  scene(...place([sh(lv, '#5f8f4a'), sh(fl, '#f6c4cf'), sh(fl2, '#fbf6f0'), stroke(line([[0, 0], [0, 40]]) + line([[-4, 0], [-8, 40]]) + line([[4, 0], [8, 40]]), '#4e7a3e', 2), sh(poly([[-10, 14], [10, 14], [6, 26], [-6, 26]]), '#cdb8ec')], { x: 470, y: 1490, rot: 75 }));
}
target('puppy', 'Sleeping puppy', place([
  sh(ellipse(0, -6, 64, 20), '#8a3a5a'), sh(ellipse(0, -12, 58, 14), '#a84a6e'), sh(circle(-62, -2, 4) + circle(62, -2, 4), GOLD),
  ...place(sleepingPet('#f6efe6', 'dog'), { y: -12, s: 0.8 }),
], { x: 1010, y: 1440 }));
scene(...place([hl(ellipse(0, 0, 40, 6), 0.2)], { x: 600, y: 1300 }));


const activity: FindActivity = {
  id: ID, version: 2, mode: 'find',
  title: 'The Royal Ballroom',
  blurb: 'The music has stopped and the candles still glow, but someone has left a glass slipper on the grand marble stairs.',
  added: '2026-11-25', collectionId: 'fairytale', categories: ["Fairytale"], difficulty: 'Relaxed',
  width: WD, height: HT,
  defs:
    linearGradient(`${ID}-wall`, [[0, '#f6e6da'], [1, '#ecd4c4']]) +
    linearGradient(`${ID}-night`, [[0, '#121a44'], [0.6, '#2a3a7a'], [1, '#4a5a9a']]) +
    `<radialGradient id="${ID}-vignette" cx="0.5" cy="0.5" r="0.75"><stop offset="0.65" stop-color="#2a1a2e" stop-opacity="0"/><stop offset="1" stop-color="#2a1a2e" stop-opacity="1"/></radialGradient>`,
  items,
};
items.push({ shapes: [sh(rect(0, 0, WD, HT), `url(#${ID}-vignette)`, { opacity: 0.18 })] });
export default activity;
