import { rect, ellipse, circle, poly, line, curve, blob, xf, stroke, rng } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { PaintActivity, PaintRegion, PaletteColor } from '../types';
import { n, sidePt, sideQuad } from './props-paint';

const W = 1000, H = 1250;

const palette: PaletteColor[] = [
  { id: 'sky', number: 1, name: 'Afternoon sky', hex: '#a9cfe4' },
  { id: 'cream', number: 2, name: 'Café cream', hex: '#f7ecd3' },
  { id: 'plaster', number: 3, name: 'Sunlit plaster', hex: '#efc07f' },
  { id: 'plasterShade', number: 4, name: 'Plaster in shade', hex: '#c8925e' },
  { id: 'roof', number: 5, name: 'Terracotta', hex: '#c8643f' },
  { id: 'roofDark', number: 6, name: 'Shaded tile', hex: '#8f402c' },
  { id: 'shutter', number: 7, name: 'Shutter green', hex: '#4b8676' },
  { id: 'leaf', number: 8, name: 'Geranium leaf', hex: '#6ea55a' },
  { id: 'glass', number: 9, name: 'Window glass', hex: '#4a5a72' },
  { id: 'amber', number: 10, name: 'Lamplight amber', hex: '#f6bb4f' },
  { id: 'red', number: 11, name: 'Awning red', hex: '#c9433b' },
  { id: 'iron', number: 12, name: 'Wrought iron', hex: '#34373d' },
  { id: 'stone', number: 13, name: 'Cobblestone', hex: '#a99d8c' },
  { id: 'stoneLight', number: 14, name: 'Pale stone', hex: '#d3c8b5' },
  { id: 'wicker', number: 15, name: 'Rattan', hex: '#b37d46' },
  { id: 'pink', number: 16, name: 'Geranium pink', hex: '#e2709a' },
  { id: 'lavender', number: 17, name: 'Distant street', hex: '#a2a8c8' },
  { id: 'shadow', number: 18, name: 'Cast shadow', hex: '#857a6d' },
];

const regions: PaintRegion[] = [];
const R = (id: string, d: string, color: string) => { regions.push({ id, d, color }); };
const detail: Shape[] = [];

// The side facade recedes toward a vanishing point at (2200, 760).
const VP = { x0: 600, vx: 2200, vy: 760 };
const sy = (x: number, y: number) => sidePt(VP, x, y);
const sq = (xa: number, xb: number, y1: number, y2: number) => sideQuad(VP, xa, xb, y1, y2);

// ---------- sky and the street beyond ----------
R('sky', rect(0, 0, W, 900), 'sky');
R('cloud-1', blob([[640, 70], [680, 40], [740, 46], [780, 22], [850, 30], [900, 58], [950, 66], [920, 92], [780, 98], [670, 96]], 0.9), 'cream');
R('cloud-2', blob([[880, 150], [910, 128], [950, 134], [986, 130], [990, 162], [920, 170]], 0.9), 'cream');
R('tower', rect(938, 150, 46, 120), 'stoneLight');
R('tower-roof', poly([[930, 152], [992, 152], [961, 96]]), 'roofDark');
R('far-building', poly([[830, 252], [W, 230], [W, 892], [830, 892]]), 'lavender');
R('far-roof', poly([[826, 236], [W, 212], [W, 232], [826, 256]]), 'roof');
R('far-window-1', rect(930, 330, 40, 66, 3), 'glass');
R('far-window-2', rect(930, 470, 40, 66, 3), 'glass');
R('pavement', rect(0, 860, W, H - 860), 'stone');

// ---------- the café building ----------
R('chimney', rect(404, 22, 46, 60), 'roofDark');
R('roof-front', rect(0, 70, 600, 82), 'roof');
R('roof-side', poly([[600, 70], [830, sy(830, 70)], [830, sy(830, 152)], [600, 152]]), 'roofDark');
R('facade-front', rect(0, 150, 600, 750), 'plaster');
R('facade-side', poly([[600, 150], [830, sy(830, 150)], [830, sy(830, 900)], [600, 900]]), 'plasterShade');
R('cornice-front', rect(0, 150, 600, 26), 'cream');
R('cornice-side', sq(600, 830, 150, 176), 'stoneLight');
R('band-front', rect(0, 368, 600, 20), 'cream');
R('band-side', sq(600, 830, 368, 388), 'stoneLight');

const slats = (x: number, y: number, w: number, h: number) => {
  let d = '';
  for (let yy = y + 12; yy < y + h - 4; yy += 12) d += line([[x + 5, yy], [x + w - 5, yy]]);
  detail.push(stroke(d, '#2f5c50', 1.3));
};
function windowFront(id: string, cx: number, y: number, h: number, box: boolean) {
  const w = 76, sw = 36;
  R(`${id}-glass`, rect(cx - w / 2, y, w, h), 'glass');
  R(`${id}-shutter-l`, rect(cx - w / 2 - 9 - sw, y - 6, sw, h + 12), 'shutter');
  R(`${id}-shutter-r`, rect(cx + w / 2 + 9, y - 6, sw, h + 12), 'shutter');
  slats(cx - w / 2 - 9 - sw, y - 6, sw, h + 12);
  slats(cx + w / 2 + 9, y - 6, sw, h + 12);
  detail.push(stroke(line([[cx, y], [cx, y + h]]) + line([[cx - w / 2, y + h * 0.42], [cx + w / 2, y + h * 0.42]]), '#f7ecd3', 3.5));
  detail.push(stroke(line([[cx - w / 2 + 10, y + 10], [cx - w / 2 + 26, y + 30]]), '#ffffff', 2, { opacity: 0.5 }));
  if (box) {
    const by = y + h - 4;
    R(`${id}-leaves`, blob([[cx - 62, by + 4], [cx - 56, by - 22], [cx - 30, by - 34], [cx, by - 26], [cx + 30, by - 36], [cx + 58, by - 22], [cx + 62, by + 4]], 0.9), 'leaf');
    R(`${id}-bloom-a`, blob([[cx - 46, by - 18], [cx - 34, by - 40], [cx - 12, by - 44], [cx - 2, by - 26], [cx - 20, by - 12]], 1), 'pink');
    R(`${id}-bloom-b`, blob([[cx + 8, by - 22], [cx + 22, by - 46], [cx + 44, by - 44], [cx + 50, by - 24], [cx + 30, by - 12]], 1), 'red');
    R(`${id}-box`, rect(cx - 58, by, 116, 30, 4), 'roof');
    detail.push(stroke(line([[cx - 52, by + 15], [cx + 52, by + 15]]), '#9c4a32', 1.5));
  }
}
windowFront('win-top-1', 105, 205, 125, false);
windowFront('win-top-2', 300, 205, 125, false);
windowFront('win-top-3', 495, 205, 125, false);
windowFront('win-mid-1', 105, 420, 130, true);
windowFront('win-mid-2', 300, 420, 130, true);
windowFront('win-mid-3', 495, 420, 130, true);

// side windows, in perspective
for (const [fl, y1, y2] of [['top', 205, 330], ['mid', 420, 550]] as [string, number, number][]) {
  R(`side-${fl}-glass-1`, sq(646, 702, y1, y2), 'glass');
  R(`side-${fl}-glass-2`, sq(748, 800, y1, y2), 'glass');
}

// ---------- ground floor: shopfront under the awning ----------
R('awning-shade', rect(0, 700, 600, 200), 'plasterShade');
R('shop-frame', rect(28, 722, 304, 170, 4), 'shutter');
R('shop-glow', rect(44, 740, 272, 136), 'amber');
R('shop-counter', rect(44, 826, 272, 50), 'wicker');
R('shop-lamp-1', circle(112, 774, 13), 'cream');
R('shop-lamp-2', circle(248, 774, 13), 'cream');
detail.push(stroke(line([[112, 740], [112, 761]]) + line([[248, 740], [248, 761]]), '#34373d', 2));
detail.push(stroke(line([[134, 740], [134, 876]]) + line([[226, 740], [226, 876]]), '#4b8676', 5));
detail.push(stroke(line([[50, 846], [310, 846]]), '#8a5a30', 1.5));
R('door-frame', rect(368, 712, 114, 188, 3), 'shutter');
R('door-glass', rect(386, 732, 78, 92, 4), 'amber');
R('door-panel', rect(386, 838, 78, 50, 3), 'roofDark');
detail.push(stroke(circle(472, 830, 4), '#f6bb4f', 2.5));
R('planter-topiary', circle(546, 790, 36), 'leaf');
R('planter-pot', poly([[514, 834], [578, 834], [568, 900], [524, 900]]), 'roof');
R('planter-rim', rect(508, 826, 76, 16, 4), 'roofDark');
R('side-window', sq(628, 740, 722, 862), 'glass');
R('side-door', sq(770, 816, 700, 900), 'shutter');

// ---------- striped awning ----------
{
  const nS = 8, wy = 596, fy = 700;
  for (let i = 0; i < nS; i++) {
    const a0 = 12 + (588 * i) / nS, a1 = 12 + (588 * (i + 1)) / nS;
    const b0 = Math.max(0, -6 + (622 * i) / nS), b1 = -6 + (622 * (i + 1)) / nS;
    const d = `M${n(a0)} ${wy}L${n(a1)} ${wy}L${n(b1)} ${fy}Q${n((b0 + b1) / 2)} ${fy + 44} ${n(b0)} ${fy}Z`;
    R(`awning-${i + 1}`, d, i % 2 === 0 ? 'red' : 'cream');
  }
  const xs = [606, 670, 734, 798];
  for (let i = 0; i < 3; i++) {
    const x0 = xs[i], x1 = xs[i + 1];
    const d = `M${n(x0)} ${n(sy(x0, 590))}L${n(x1)} ${n(sy(x1, 590))}L${n(x1)} ${n(sy(x1, 676))}Q${n((x0 + x1) / 2)} ${n(sy((x0 + x1) / 2, 676) + 32)} ${n(x0)} ${n(sy(x0, 676))}Z`;
    R(`awning-side-${i + 1}`, d, i % 2 === 0 ? 'red' : 'cream');
  }
  detail.push(stroke(line([[12, wy], [600, wy]]), '#8f402c', 3));
}

// ---------- street lamp ----------
R('lamp-glow', circle(870, 378, 66), 'cream');
R('lamp-post', poly([[850, 414], [890, 414], [890, 428], [876, 428], [876, 1176], [886, 1180], [896, 1234], [844, 1234], [854, 1180], [864, 1176], [864, 428], [850, 428]]), 'iron');
R('lamp-glass', poly([[838, 346], [902, 346], [892, 414], [848, 414]]), 'amber');
R('lamp-cap', poly([[824, 348], [916, 348], [884, 316], [870, 296], [856, 316]]), 'iron');
detail.push(stroke(circle(870, 288, 7), '#34373d', 4));
detail.push(stroke(line([[870, 346], [870, 414]]) + line([[838, 380], [902, 380]]), '#34373d', 2.5));
detail.push(stroke(curve([[864, 520], [846, 512], [840, 494], [852, 486]]) + curve([[876, 520], [894, 512], [900, 494], [888, 486]]), '#34373d', 3));

// ---------- light cobbles ----------
const cobbles: [number, number, number][] = [[64, 934, 6], [150, 1212, -4], [470, 1216, 3], [520, 942, -5], [958, 968, -3], [74, 1120, -6]];
cobbles.forEach(([x, y, r], i) => R(`cobble-${i + 1}`, xf(rect(-34, -12, 68, 24, 10), { rot: r, x, y }), 'stoneLight'));

// ---------- bistro tables and chairs ----------
function chair(id: string, cx: number, seatY: number, side: -1 | 1) {
  detail.push(stroke(line([[cx - 34, seatY + 8], [cx - 40, seatY + 82]]) + line([[cx + 34, seatY + 8], [cx + 40, seatY + 82]]) + line([[cx - 14, seatY + 14], [cx - 16, seatY + 74]]) + line([[cx + 14, seatY + 14], [cx + 16, seatY + 74]]), '#34373d', 4.5));
  R(`${id}-back`, xf(rect(-13, -108, 26, 110, 12), { rot: side * 9, x: cx + side * 34, y: seatY }), 'wicker');
  R(`${id}-cushion`, ellipse(cx, seatY, 44, 13), 'red');
  const bx = cx + side * 34;
  detail.push(stroke(xf(line([[0, -96], [0, -10]]), { rot: side * 9, x: bx, y: seatY }) + xf(line([[-6, -84], [6, -84]]), { rot: side * 9, x: bx, y: seatY }) + xf(line([[-6, -60], [6, -60]]), { rot: side * 9, x: bx, y: seatY }) + xf(line([[-6, -36], [6, -36]]), { rot: side * 9, x: bx, y: seatY }), '#7e542b', 1.5));
}
function table(id: string, cx: number, ty: number, rx: number) {
  R(`${id}-base`, poly([[cx - 7, ty + 20], [cx + 7, ty + 20], [cx + 7, ty + 124], [cx + 42, ty + 132], [cx + 42, ty + 144], [cx - 42, ty + 144], [cx - 42, ty + 132], [cx - 7, ty + 124]]), 'iron');
  R(`${id}-top`, ellipse(cx, ty, rx, 26), 'cream');
  detail.push(stroke(curve([[cx - rx + 4, ty + 6], [cx, ty + 26], [cx + rx - 4, ty + 6]]), '#c8b89a', 2));
}
R('shadow-a', ellipse(300, 1150, 150, 22), 'shadow');
R('shadow-b', ellipse(690, 1232, 160, 18), 'shadow');
chair('chair-a1', 182, 1062, -1);
chair('chair-a2', 418, 1062, 1);
table('table-a', 300, 1006, 96);
R('cup-a', rect(250, 976, 26, 26, 6), 'shutter');
R('carafe-a', rect(318, 958, 30, 46, 12), 'sky');
detail.push(stroke(curve([[276, 982], [286, 988], [276, 996]]) , '#34373d', 2.5));
chair('chair-b1', 560, 1144, -1);
chair('chair-b2', 816, 1144, 1);
table('table-b', 690, 1088, 106);
R('vase', rect(700, 1036, 26, 48, 10), 'sky');
R('vase-leaves', blob([[690, 1036], [700, 1010], [714, 1022], [728, 1006], [738, 1036]], 0.9), 'leaf');
R('vase-bloom', blob([[700, 1008], [706, 984], [722, 978], [734, 992], [726, 1010], [712, 1016]], 1), 'pink');
R('cup-b', rect(628, 1058, 26, 26, 6), 'shutter');
detail.push(stroke(curve([[654, 1064], [664, 1070], [654, 1078]]), '#34373d', 2.5));

// ---------- line work ----------
{
  let d = '';
  for (let x = 24; x < 600; x += 24) d += line([[x, 72], [x, 150]]);
  d += line([[0, 98], [600, 98]]) + line([[0, 124], [600, 124]]);
  detail.push(stroke(d, '#9c4a32', 1.4));
  let s = '';
  for (let x = 624; x < 830; x += 24) s += line([[x, sy(x, 72)], [x, sy(x, 150)]]);
  detail.push(stroke(s, '#6e2f20', 1.4));
}
// cobble outlines across the pavement
{
  const r = rng(1207);
  let d = '';
  for (let row = 0, y = 884; y < H + 20; row++) {
    const h = 16 + row * 2.2;
    for (let x = -r.range(0, 30); x < W; ) {
      const w = h * r.range(1.6, 2.4);
      d += curve([[x + 3, y + h * 0.5], [x + w * 0.5, y + h * 0.5 + 3], [x + w - 3, y + h * 0.5]], 0.8);
      d += line([[x + w, y], [x + w, y + h]]);
      x += w;
    }
    y += h;
  }
  detail.push(stroke(d, '#8b8070', 1.3, { opacity: 0.75 }));
}
detail.push(stroke(line([[600, 150], [600, 900]]), '#a87648', 2));
detail.push(stroke(line([[0, 900], [600, 900]]) + line([[600, 900], [830, sy(830, 900)]]), '#7c6a58', 2));

const activity: PaintActivity = {
  id: 'travel-paint-1', version: 1, mode: 'paint', title: 'Café Terrace',
  blurb: 'A sunny corner café with a striped awning, flower boxes at every window and bistro tables waiting on the cobbles.',
  collectionId: 'travel', categories: ['Travel', 'Architecture'], difficulty: 'Moderate',
  width: W, height: H, palette, regions, detail,
};
export default activity;
