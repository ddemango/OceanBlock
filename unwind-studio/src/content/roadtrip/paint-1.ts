import { rect, circle, poly, line, curve, blob, waveBand, stroke } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { PaintActivity, PaletteColor } from '../types';
import { collector, balloon, rrect, clipRect, chimney, type Pt } from './props-paint';

const W = 1000, H = 1250;

const palette: PaletteColor[] = [
  { id: 'dawn', number: 1, name: 'Dawn blue', hex: '#a9cde3' },
  { id: 'peach', number: 2, name: 'Peach glow', hex: '#f8c9a0' },
  { id: 'gold', number: 3, name: 'First light', hex: '#fbdc8e' },
  { id: 'cream', number: 4, name: 'Cloud cream', hex: '#fff5e1' },
  { id: 'red', number: 5, name: 'Poppy red', hex: '#d8553f' },
  { id: 'mustard', number: 6, name: 'Marigold', hex: '#efb23e' },
  { id: 'teal', number: 7, name: 'Lagoon teal', hex: '#3e8f8b' },
  { id: 'rose', number: 8, name: 'Rose silk', hex: '#e78f8c' },
  { id: 'lavender', number: 9, name: 'Distant hills', hex: '#aa9cc6' },
  { id: 'sage', number: 10, name: 'Sage meadow', hex: '#a9c17f' },
  { id: 'meadow', number: 11, name: 'Spring field', hex: '#6f9c55' },
  { id: 'wheat', number: 12, name: 'Ripe wheat', hex: '#e5c57a' },
  { id: 'forest', number: 13, name: 'Hedgerow', hex: '#4d7849' },
  { id: 'wicker', number: 14, name: 'Wicker', hex: '#a46c3e' },
  { id: 'plum', number: 15, name: 'Plum', hex: '#77526e' },
];

const { regions, R } = collector();
const detail: Shape[] = [];
const ROPE = '#5c4038';

// ---------- sky ----------
R('sky', rect(0, 0, W, H), 'dawn');
R('sky-peach', waveBand(0, W, 470, 10, 760, H, 0.6), 'peach');
R('sky-gold', waveBand(0, W, 640, 8, 620, H, 2.2), 'gold');
R('sun-glow', circle(720, 762, 104), 'peach');
R('sun', circle(720, 762, 76), 'cream');
R('cloud-1', blob([[40, 214], [70, 182], [118, 180], [148, 150], [204, 152], [236, 184], [272, 196], [250, 226], [150, 232], [70, 234]], 0.9), 'cream');
R('cloud-2', blob([[548, 92], [580, 66], [626, 70], [660, 52], [712, 62], [730, 90], [700, 106], [600, 108]], 0.9), 'cream');
R('cloud-3', blob([[810, 486], [846, 458], [896, 462], [930, 448], [978, 466], [990, 494], [900, 506], [826, 504]], 0.9), 'cream');

// ---------- hills ----------
const farY = (x: number) => 742 + Math.sin(x / 170 + 0.4) * 26 + Math.sin(x / 71 + 1) * 9;
const midY = (x: number) => 818 + Math.sin(x / 240 + 2.2) * 20 + Math.sin(x / 97) * 7;
const hillBand = (fy: (x: number) => number) => {
  const pts: Pt[] = [];
  for (let x = 0; x <= W; x += 20) pts.push([x, fy(x)]);
  return poly([...pts, [W, H], [0, H]]);
};
R('hill-far', hillBand(farY), 'lavender');
R('hill-mid', hillBand(midY), 'sage');
for (const [i, x, r] of [[1, 70, 22], [2, 112, 18], [3, 470, 16], [4, 790, 20], [5, 826, 24]] as const) {
  R(`tree-${i}`, circle(x, midY(x) - r * 0.55, r), 'forest');
}
// Cappadocia-style rock chimneys rising out of the valley
{
  const rocks: [string, number, number, number][] = [
    ['rock-1', 248, 78, 176], ['rock-2', 320, 92, 232], ['rock-3', 396, 70, 150], ['rock-4', 872, 84, 182], ['rock-5', 944, 66, 128],
  ];
  for (const [id, x, bw, h] of rocks) {
    const c = chimney(x, midY(x) + 14, bw, h);
    R(id, c.body, 'wheat');
    R(`${id}-shade`, c.shade, 'peach');
    R(`${id}-cap`, c.cap, 'wicker');
  }
  R('rock-2-door', rrect(311, midY(320) - 46, 18, 26, [9, 9, 0, 0]), 'plum');
  R('rock-1-window', rrect(240, midY(248) - 96, 15, 18, [7, 7, 0, 0]), 'plum');
  R('rock-4-window', rrect(864, midY(872) - 104, 15, 18, [7, 7, 0, 0]), 'plum');
}
// ---------- patchwork fields ----------
{
  const vp: Pt = [500, 640];
  const rows = [862, 908, 970, 1056, 1166, 1262];
  const cols = [-1400, -700, -150, 330, 760, 1250, 1850, 2500];
  const fills = ['meadow', 'wheat', 'mustard', 'sage'];
  const rowY = (k: number, x: number) => rows[k] + Math.sin(x / 260 + k * 1.7) * (4 + k * 2);
  const colX = (c: number, y: number) => vp[0] + (cols[c] - vp[0]) * ((y - vp[1]) / (H - vp[1]));
  const corner = (k: number, c: number): Pt => {
    let y = rows[k];
    for (let i = 0; i < 4; i++) y = rowY(k, colX(c, y));
    return [colX(c, y), y];
  };
  const edge = (k: number, ca: number, cb: number): Pt[] => {
    const a = corner(k, ca), b = corner(k, cb), pts: Pt[] = [];
    for (let i = 0; i <= 16; i++) {
      const x = a[0] + ((b[0] - a[0]) * i) / 16;
      pts.push([x, rowY(k, x)]);
    }
    return pts;
  };
  const cellPts = (k: number, ca: number, cb: number) => clipRect([...edge(k, ca, cb), ...edge(k + 1, ca, cb).reverse()], 0, 0, W, H);
  const xr = (pts: Pt[]): [number, number] => [Math.min(...pts.map((p) => p[0])), Math.max(...pts.map((p) => p[0]))];
  const span = (k: number, ca: number, cb: number) => { const [a, b] = xr(cellPts(k, ca, cb).length ? cellPts(k, ca, cb) : [[0, 0]]); return b - a; };
  const nC = cols.length - 1;
  let prevRow: { x: [number, number]; fill: string }[] = [];
  for (let k = 0; k < rows.length - 1; k++) {
    const cells: [number, number][] = [];
    for (let c = 0; c < nC; ) {
      let e = c + 1;
      while (e < nC && span(k, c, e) < 130) e++;
      cells.push([c, e]);
      c = e;
    }
    const last = cells[cells.length - 1];
    if (cells.length > 1 && span(k, last[0], last[1]) < 130) { cells.pop(); cells[cells.length - 1][1] = last[1]; }
    const row: { x: [number, number]; fill: string }[] = [];
    cells.forEach(([ca, cb], i) => {
      const pts = cellPts(k, ca, cb);
      const x = xr(pts);
      const banned = new Set(prevRow.filter((p) => p.x[0] < x[1] - 30 && p.x[1] > x[0] + 30).map((p) => p.fill));
      if (row.length) banned.add(row[row.length - 1].fill);
      let fill = fills[(i + k * 2) % 4];
      for (let j = 0; j < 4 && banned.has(fill); j++) fill = fills[(i + k * 2 + j + 1) % 4];
      row.push({ x, fill });
      R(`field-${k + 1}-${ca + 1}`, poly(pts), fill);
    });
    prevRow = row;
  }
  // furrows in a few fields
  const furrow = (k: number, c: number, nLines: number) => {
    let d = '';
    for (let i = 1; i <= nLines; i++) {
      const t = i / (nLines + 1);
      const a = corner(k, c), b = corner(k + 1, c), e = corner(k, c + 1), f = corner(k + 1, c + 1);
      const p1: Pt = [a[0] + (e[0] - a[0]) * t, a[1] + (e[1] - a[1]) * t];
      const p2: Pt = [b[0] + (f[0] - b[0]) * t, b[1] + (f[1] - b[1]) * t];
      d += line([[Math.max(4, Math.min(W - 4, p1[0])), p1[1] + 6], [Math.max(4, Math.min(W - 4, p2[0])), Math.min(H, p2[1]) - 6]]);
    }
    return d;
  };
  detail.push(stroke(furrow(2, 3, 3) + furrow(4, 4, 4) + furrow(1, 4, 3), '#000000', 1.4, { opacity: 0.14 }));
}

// ---------- winding road ----------
{
  const spine: Pt[] = [[560, 860], [552, 900], [578, 960], [600, 1030], [568, 1130], [520, 1250]];
  const wid = [6, 12, 26, 44, 74, 112];
  const l: Pt[] = [], r: Pt[] = [];
  spine.forEach((p, i) => { l.push([p[0] - wid[i], p[1]]); r.push([p[0] + wid[i], p[1]]); });
  R('road', curve(l, 0.6) + curve(r.reverse(), 0.6).replace(/^M/, 'L') + 'Z', 'cream');
  detail.push(stroke(curve(spine.slice(2), 0.6), '#d9b884', 3, { opacity: 0.8 }));
}

// ---------- balloons ----------
interface BalloonSpec { id: string; cx: number; cy: number; r: number; gores: string[]; cap?: string; belt?: string }
function hotAirBalloon(b: BalloonSpec) {
  const env = balloon(b.cx, b.cy, b.r);
  const nG = b.gores.length;
  const u = (i: number) => { const t = -1 + (2 * i) / nG; return 0.45 * t + 0.55 * (2 / Math.PI) * Math.asin(t); };
  const capY = b.cy - 0.8 * b.r;
  const yStart = b.cap ? capY : env.yTop;
  const bands: [number, number, string][] = b.belt
    ? [[yStart, b.cy + 0.42 * b.r, 'up'], [b.cy + 0.58 * b.r, env.yNeck, 'low']]
    : [[yStart, env.yNeck, '']];
  for (const [ya, yb, tag] of bands) {
    for (let i = 0; i < nG; i++) R(`${b.id}-gore-${i + 1}${tag ? '-' + tag : ''}`, env.strip(u(i), u(i + 1), ya, yb), b.gores[i]);
  }
  if (b.cap) R(`${b.id}-crown`, env.cap(capY), b.cap);
  if (b.belt) R(`${b.id}-belt`, env.strip(-1, 1, b.cy + 0.42 * b.r, b.cy + 0.58 * b.r), b.belt);
  // skirt and basket
  const nw = env.hw(env.yNeck), sy = env.yNeck, sh = Math.max(10, 0.14 * b.r);
  const bw = Math.max(26, 0.42 * b.r), bh = Math.max(16, 0.22 * b.r), byTop = sy + sh + Math.max(14, 0.24 * b.r);
  R(`${b.id}-skirt`, poly([[b.cx - nw, sy], [b.cx + nw, sy], [b.cx + nw * 0.72, sy + sh], [b.cx - nw * 0.72, sy + sh]]), 'plum');
  R(`${b.id}-basket`, rrect(b.cx - bw / 2, byTop, bw, bh, [2, 2, bh * 0.3, bh * 0.3]), 'wicker');
  const lw = Math.max(1.2, b.r / 90);
  detail.push(stroke(
    line([[b.cx - nw * 0.72, sy + sh], [b.cx - bw / 2 + 1, byTop]]) + line([[b.cx + nw * 0.72, sy + sh], [b.cx + bw / 2 - 1, byTop]]) +
    line([[b.cx - nw * 0.25, sy + sh], [b.cx - bw * 0.18, byTop]]) + line([[b.cx + nw * 0.25, sy + sh], [b.cx + bw * 0.18, byTop]]),
    ROPE, lw * 1.3));
  if (b.r > 60) {
    let weave = '';
    for (let i = 1; i < 4; i++) weave += line([[b.cx - bw / 2 + 3, byTop + (bh * i) / 4], [b.cx + bw / 2 - 3, byTop + (bh * i) / 4]]);
    detail.push(stroke(weave, '#7a4c2a', lw));
  }
}

hotAirBalloon({ id: 'little-balloon', cx: 640, cy: 590, r: 42, gores: ['red', 'cream', 'red'] });
hotAirBalloon({ id: 'teal-balloon', cx: 800, cy: 250, r: 104, gores: ['teal', 'cream', 'teal', 'cream', 'teal'], cap: 'mustard' });
hotAirBalloon({ id: 'rose-balloon', cx: 168, cy: 628, r: 70, gores: ['rose', 'mustard', 'rose', 'mustard', 'rose'], cap: 'cream' });
hotAirBalloon({ id: 'big-balloon', cx: 404, cy: 330, r: 164, gores: ['red', 'mustard', 'teal', 'cream', 'teal', 'mustard', 'red'], cap: 'rose', belt: 'rose' });

// ---------- line work ----------
{
  // birds
  const bird = (x: number, y: number, s: number) => curve([[x - s, y - s * 0.4], [x - s * 0.5, y - s * 0.6], [x, y]], 0.8) + curve([[x, y], [x + s * 0.5, y - s * 0.6], [x + s, y - s * 0.4]], 0.8);
  detail.push(stroke(bird(610, 300, 12) + bird(642, 286, 9) + bird(300, 120, 10), '#5c5a72', 2));
}

const activity: PaintActivity = {
  id: 'roadtrip-paint-1', version: 1, mode: 'paint', title: 'Hot Air Balloons',
  blurb: 'Striped hot air balloons drift over fairy-chimney rocks, patchwork fields and a winding country road as the sun comes up.',
  collectionId: 'roadtrip', categories: ["Travel"], difficulty: 'Relaxed',
  width: W, height: H, palette, regions, detail,
};
export default activity;
