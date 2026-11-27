import { rect, circle, poly, line, curve, sector, stroke, rng } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { PaintActivity, PaletteColor } from '../types';
import { collector, crescent, rotRect, bar, heart, wrappedSweet, lollipop, M, L, C, type Pt } from './props-paint';

const W = 1000, H = 1250;

const palette: PaletteColor[] = [
  { id: 'wall', number: 1, name: 'Custard wall', hex: '#fff1cf' },
  { id: 'mint', number: 2, name: 'Mint panelling', hex: '#a7dccb' },
  { id: 'cream', number: 3, name: 'Sugar white', hex: '#fffaf2' },
  { id: 'pink', number: 4, name: 'Bubblegum pink', hex: '#f59ab5' },
  { id: 'red', number: 5, name: 'Cherry red', hex: '#d83a3c' },
  { id: 'redD', number: 6, name: 'Deep red', hex: '#a5262f' },
  { id: 'chrome', number: 7, name: 'Chrome', hex: '#cfd8de' },
  { id: 'chromeD', number: 8, name: 'Dark chrome', hex: '#8794a0' },
  { id: 'glass', number: 9, name: 'Glass', hex: '#dcf1f4' },
  { id: 'yellow', number: 10, name: 'Lemon drop', hex: '#f8cf47' },
  { id: 'blue', number: 11, name: 'Blue raspberry', hex: '#4b9fdc' },
  { id: 'green', number: 12, name: 'Apple green', hex: '#5fbf78' },
  { id: 'orange', number: 13, name: 'Orange', hex: '#f58c3a' },
  { id: 'purple', number: 14, name: 'Grape', hex: '#9a7ed3' },
  { id: 'wood', number: 15, name: 'Oak counter', hex: '#dba36a' },
  { id: 'woodD', number: 16, name: 'Walnut', hex: '#a66d3d' },
];

const { regions, R } = collector();
const detail: Shape[] = [];

// ---------- shop wall, awning and counter ----------
R('wall', rect(0, 0, W, 660), 'wall');
R('panelling', rect(0, 650, W, 320), 'mint');
R('rail', rect(0, 636, W, 22), 'cream', [340, 647]);
for (let i = 0; i < 10; i++) {
  const x = i * 100;
  R(`awning-${i + 1}`, M(x, 0) + L(x + 100, 0) + L(x + 100, 88) + C(x + 100, 154, x, 154, x, 88) + 'Z', i % 2 ? 'cream' : 'pink');
}
R('counter', rect(0, 965, W, 229), 'wood');
R('counter-front', rect(0, 1190, W, 60), 'woodD');

// ---------- lollipops in a cup ----------
const lollies: [string, number, number, number, Pt, string, string][] = [
  ['lolly-1', 95, 700, 60, [150, 930], 'red', 'cream'],
  ['lolly-2', 200, 610, 72, [175, 930], 'blue', 'yellow'],
  ['lolly-3', 285, 740, 56, [205, 930], 'green', 'cream'],
];
for (const [id, x, y, , foot] of lollies) R(`${id}-stick`, bar([x, y], foot, 12), 'cream');
for (const [id, x, y, r, , a, b] of lollies) {
  lollipop(R, id, x, y, r, a, b);
  const pts: Pt[] = [];
  for (let i = 0; i <= 40; i++) { const t = i / 40, ang = t * Math.PI * 5, rr = r * 0.9 * t; pts.push([x + Math.cos(ang) * rr, y + Math.sin(ang) * rr]); }
  detail.push(stroke(curve(pts, 0.8), '#ffffff', 2, { opacity: 0.55 }));
}
R('cup', poly([[112, 900], [238, 900], [224, 1050], [126, 1050]]), 'purple');
R('cup-band', poly([[116.7, 950], [233.3, 950], [228.7, 1000], [121.3, 1000]]), 'cream');

// ---------- candy sticks in a jar ----------
const sticks: [Pt, Pt, string][] = [
  [[752, 652], [800, 910], 'pink'], [[815, 600], [830, 910], 'green'], [[885, 615], [858, 910], 'yellow'], [[944, 676], [886, 910], 'purple'],
];
sticks.forEach(([a, b, col], i) => {
  R(`candy-stick-${i + 1}`, bar(a, b, 20), col);
  let d = '';
  const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len;
  for (let s = 14; s < Math.min(len, 232); s += 26) {
    const cx = a[0] + ux * s, cy = a[1] + uy * s;
    d += line([[cx + uy * 7 - ux * 5, cy - ux * 7 - uy * 5], [cx - uy * 7 + ux * 5, cy + ux * 7 + uy * 5]]);
  }
  detail.push(stroke(d, '#ffffff', 4, { opacity: 0.85 }));
});
R('jar', poly([[772, 880], [908, 880], [894, 1045], [786, 1045]]), 'glass');
R('jar-label', rect(804, 926, 72, 72, 10), 'cream');
R('jar-label-heart', heart(840, 962, 40), 'red');

// ---------- the gumball machine ----------
const GX = 500, GY = 440, GR = 250;
R('cap-knob', circle(GX, 152, 20), 'chrome');
R('globe', circle(GX, GY, GR), 'glass');
R('cap', M(404, 222) + C(404, 150, 596, 150, 596, 222) + 'Z', 'red');
R('globe-glint', crescent(GX, GY, 226, 226, 198, 238, 0.12), 'cream');

// gumballs in a honeycomb pile
{
  const cols = ['red', 'yellow', 'blue', 'green', 'orange', 'pink', 'purple'];
  const r = 33, pitch = 70;
  const g = rng(418);
  const rows: [number, number[]][] = [
    [640, [-35, 35]], [579, [-140, -70, 0, 70, 140]], [518, [-175, -105, -35, 35, 105, 175]], [457, [-140, -70, 0, 70, 140]],
    [396, [-175, -105, -35, 35, 105, 175]], [335, [-140, -70, 0, 70, 140]], [274, [-35, 35]],
  ];
  const placed: { x: number; y: number; c: number }[] = [];
  let k = 0, shine = '';
  rows.forEach(([y, xs], ri) => xs.forEach((dx, ci) => {
    const x = GX + dx;
    let c = g.int(0, cols.length - 1);
    while (placed.some((p) => p.c === c && Math.hypot(p.x - x, p.y - y) < pitch * 1.2)) c = (c + 1) % cols.length;
    placed.push({ x, y, c });
    k++;
    R(`gumball-${ri + 1}-${ci + 1}`, circle(x, y, r), cols[c]);
    shine += curve([[x - 20, y - 6], [x - 16, y - 16], [x - 6, y - 21]]);
  }));
  detail.push(stroke(shine, '#ffffff', 3, { opacity: 0.8 }));
}

R('collar', rect(374, 668, 252, 38, 8), 'chrome');
R('base', M(372, 700) + L(628, 700) + C(650, 800, 672, 900, 680, 1004) + L(320, 1004) + C(328, 900, 350, 800, 372, 700) + 'Z', 'red');
R('base-shade', M(588, 700) + L(628, 700) + C(650, 800, 672, 900, 680, 1004) + L(628, 1004) + C(622, 900, 604, 800, 588, 700) + 'Z', 'redD');
R('coin-plate', rect(432, 736, 136, 152, 14), 'chrome');
R('coin-dial', circle(500, 816, 44), 'chromeD');
R('coin-handle', rotRect(500, 816, 78, 24, -30, 12), 'cream');
R('chute', rect(440, 912, 120, 64, 10), 'chromeD');
R('chute-flap', rect(452, 904, 96, 40, 8), 'chrome');
R('foot', rect(298, 1000, 404, 38, 12), 'chrome');
R('foot-base', rect(322, 1036, 356, 22, 8), 'redD');

// ---------- sweets on the counter ----------
wrappedSweet(R, 'sweet-1', 105, 1125, 1.1, -15, 'orange', 'yellow', 'cream');
wrappedSweet(R, 'sweet-2', 350, 1165, 1.08, 12, 'pink', 'cream', 'red');
wrappedSweet(R, 'sweet-3', 735, 1120, 1.08, -10, 'green', 'cream', 'yellow');
wrappedSweet(R, 'sweet-4', 915, 1185, 0.95, 30, 'blue', 'pink', 'cream');
R('peppermint', circle(255, 1080, 30), 'cream');
[10, 130, 250].forEach((a, i) => R(`peppermint-swirl-${i + 1}`, sector(255, 1080, 29.5, a, a + 58), 'red'));
R('loose-gumball-1', circle(545, 1115, 32), 'purple');
R('loose-gumball-2', circle(610, 1160, 30), 'yellow');
detail.push(stroke(curve([[526, 1108], [530, 1098], [540, 1093]]) + curve([[592, 1154], [596, 1145], [605, 1140]]), '#ffffff', 3, { opacity: 0.8 }));

// ---------- line work ----------
detail.push(stroke(line([[486, 752], [514, 752]]), '#5d6873', 4));
detail.push(stroke(curve([[392, 688], [500, 694], [608, 688]]) + line([[310, 1020], [690, 1020]]), '#ffffff', 2.2, { opacity: 0.8 }));
detail.push(stroke(curve([[352, 760], [340, 860], [336, 980]]), '#ffffff', 3, { opacity: 0.35 }));
detail.push(stroke(curve([[300, 520], [296, 440], [318, 370]]), '#ffffff', 3, { opacity: 0.7 }));
detail.push(stroke(line([[0, 1040], [90, 1040]]) + line([[400, 1090], [470, 1090]]) + line([[660, 1060], [760, 1060]]) + line([[930, 1090], [W, 1090]]) + line([[180, 1170], [250, 1170]]), '#c48a52', 2));
detail.push(stroke(line([[0, 1190], [W, 1190]]), '#8a5630', 2));
detail.push(stroke(line([[786, 890], [896, 890]]), '#ffffff', 2.4, { opacity: 0.8 }));

const activity: PaintActivity = {
  id: 'sweets-paint-3', version: 1, mode: 'paint', title: 'The Gumball Jar',
  blurb: 'A cherry-red gumball machine brimming with colourful gumballs, with swirly lollipops, candy sticks and wrapped sweets around it on the shop counter.',
  collectionId: 'sweets', categories: ["Food", "Treats"], difficulty: 'Detailed',
  added: '2026-11-26',
  width: W, height: H, palette, regions, detail,
};
export default activity;
