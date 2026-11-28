// Shared props for The Cozy Library collection.
// Every prop returns Shape[] drawn around the origin (base centre at 0,0, growing
// upwards into negative y) unless its comment says otherwise.
import { blob, circle, curve, ellipse, leaf, line, mix, place, poly, rect, sector, sh, shade, stroke, type Rng } from '../../art/kit';
import type { Pt } from '../../art/geometry';
import type { Shape } from '../../art/types';

export const C = {
  woodDeep: '#3a2416', woodDark: '#553420', wood: '#7a4a2a', woodMid: '#94603a', woodLight: '#b58150', woodPale: '#d0a878',
  amber: '#f0b04a', glow: '#ffdf9a', brass: '#c9a045', brassDark: '#8a6524', brassLight: '#ecd08a',
  green: '#2f5a45', greenDark: '#1f4032', greenMid: '#4a7a58', sage: '#86a070', leaf: '#5c8a4e',
  red: '#9c3b32', redDark: '#702824', brick: '#b5523f', rose: '#cf9482',
  cream: '#f1e6cf', paper: '#f8f1e0', parchment: '#e2d0a8',
  blue: '#6f8fa6', blueDark: '#3d566e', bluePale: '#aec3cf',
  mustard: '#c99a3a', plum: '#6a4560', ink: '#2a2430', teal: '#3f7a7a', terracotta: '#b9683f',
};

export const SPINES = [
  C.red, C.redDark, C.brick, C.green, C.greenDark, C.greenMid, C.blue, C.blueDark, C.mustard, C.plum, C.teal,
  C.cream, C.parchment, C.wood, C.woodDark, '#8a3f4a', '#566b3c', '#a9793a', '#4d4a66', '#c7b08a', '#7d8f9a', '#a86a54',
];

/** Gradient that fades a colour from opacity `a0` in the centre to transparent. */
export function glowGradient(id: string, color: string, a0 = 0.6, mid = 0.45): string {
  return `<radialGradient id="${id}" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${color}" stop-opacity="${a0}"/><stop offset="${mid}" stop-color="${color}" stop-opacity="${a0 * 0.4}"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient>`;
}
/** Gradient that is transparent in the centre and darkens towards the edge (vignette). */
export function vignetteGradient(id: string, color: string, a1 = 0.5, start = 0.55): string {
  return `<radialGradient id="${id}" cx="0.5" cy="0.5" r="0.75"><stop offset="0" stop-color="${color}" stop-opacity="0"/><stop offset="${start}" stop-color="${color}" stop-opacity="0"/><stop offset="1" stop-color="${color}" stop-opacity="${a1}"/></radialGradient>`;
}

/** Sample a smooth open curve through pts. */
export function sample(pts: Pt[], per = 6): Pt[] {
  const n = pts.length;
  const at = (i: number) => pts[Math.max(0, Math.min(n - 1, i))];
  const P: Pt[] = [];
  for (let i = 0; i < n - 1; i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    for (let s = 0; s < per; s++) {
      const t = s / per, t2 = t * t, t3 = t2 * t;
      const c = (k: 0 | 1) => 0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3);
      P.push([c(0), c(1)]);
    }
  }
  P.push(pts[n - 1]);
  return P;
}

/** A closed band of the given width following a smooth curve through pts (single subpath). */
export function ribbon(pts: Pt[], w: number | ((t: number) => number), per = 6): string {
  const P = sample(pts, per);
  const L: Pt[] = [], R: Pt[] = [];
  P.forEach((p, i) => {
    const a = P[Math.max(0, i - 1)], b = P[Math.min(P.length - 1, i + 1)];
    let dx = b[0] - a[0], dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1;
    dx /= len; dy /= len;
    const hw = (typeof w === 'number' ? w : w(i / (P.length - 1))) / 2;
    L.push([p[0] - dy * hw, p[1] + dx * hw]);
    R.push([p[0] + dy * hw, p[1] - dx * hw]);
  });
  return poly([...L, ...R.reverse()]);
}

// ---------------------------------------------------------------- books

/** One upright book with its bottom-left corner at (x, baseY). */
export function book(x: number, baseY: number, w: number, h: number, col: string, r: Rng): Shape[] {
  const y = baseY - h;
  const out: Shape[] = [sh(rect(x, y, w, h, Math.min(2, w / 5)), col)];
  out.push(sh(rect(x + w * 0.08, y + 1, w * 0.2, h - 2), shade(col, 0.22), { opacity: 0.55 }));
  out.push(sh(rect(x + w * 0.8, y + 1, w * 0.2, h - 2, 1), shade(col, -0.3), { opacity: 0.6 }));
  const light = ['#f1e6cf', '#e2d0a8', '#c7b08a', '#f8f1e0'].includes(col);
  const foil = light ? r.pick([C.red, C.greenDark, C.blueDark, C.woodDark]) : r.pick([C.brass, C.brassLight, C.cream, C.parchment]);
  const v = r.int(0, 6);
  if (v === 0) {
    out.push(sh(rect(x, y + h * 0.1, w, Math.max(2, h * 0.03)), foil), sh(rect(x, y + h * 0.84, w, Math.max(2, h * 0.03)), foil));
  } else if (v === 1) {
    out.push(sh(rect(x + w * 0.15, y + h * 0.16, w * 0.7, h * 0.26, 1), light ? C.paper : C.cream));
    out.push(sh(rect(x + w * 0.28, y + h * 0.22, w * 0.44, 1.6), C.ink, { opacity: 0.55 }), sh(rect(x + w * 0.28, y + h * 0.3, w * 0.44, 1.6), C.ink, { opacity: 0.55 }));
  } else if (v === 2) {
    out.push(sh(rect(x, y + h * 0.2, w, h * 0.16), shade(col, -0.28)), sh(rect(x, y + h * 0.2, w, 1.8), foil), sh(rect(x, y + h * 0.36, w, 1.8), foil));
  } else if (v === 3) {
    for (const t of [0.12, 0.16, 0.8, 0.84, 0.88]) out.push(sh(rect(x, y + h * t, w, 1.6), foil, { opacity: 0.9 }));
  } else if (v === 4) {
    out.push(sh(circle(x + w / 2, y + h * 0.22, Math.min(w * 0.28, 5)), foil), sh(rect(x, y + h * 0.9, w, 2), foil));
    out.push(sh(poly([[x + w / 2, y + h * 0.5], [x + w * 0.78, y + h * 0.56], [x + w / 2, y + h * 0.62], [x + w * 0.22, y + h * 0.56]]), foil, { opacity: 0.85 }));
  } else if (v === 5) {
    out.push(sh(rect(x, y + h * 0.06, w, h * 0.1), foil, { opacity: 0.9 }), sh(rect(x, y + h * 0.7, w, h * 0.2), shade(col, 0.18)));
  } else {
    out.push(sh(rect(x + w * 0.42, y + h * 0.12, w * 0.16, h * 0.5, 1), foil, { opacity: 0.8 }));
  }
  return out;
}

/** A pile of books lying flat, centred on x, sitting on baseY. Returns the shapes and the top y. */
export function bookStack(cx: number, baseY: number, w: number, n: number, r: Rng, thick: [number, number] = [11, 18]): { shapes: Shape[]; top: number } {
  const out: Shape[] = [];
  let y = baseY;
  for (let i = 0; i < n; i++) {
    const t = r.range(thick[0], thick[1]);
    const bw = w * r.range(0.78, 1), off = r.range(-w * 0.07, w * 0.07);
    const col = r.pick(SPINES);
    const x = cx - bw / 2 + off;
    out.push(sh(rect(x, y - t, bw, t, 2), col));
    out.push(sh(rect(x + 1, y - t + 1, bw - 2, t * 0.28), shade(col, 0.22), { opacity: 0.6 }));
    out.push(sh(rect(x + 1, y - t * 0.3, bw - 2, t * 0.26), shade(col, -0.3), { opacity: 0.5 }));
    const foil = r.pick([C.brass, C.cream, C.brassLight]);
    if (r.next() < 0.5) {
      out.push(sh(rect(x + bw * 0.1, y - t, 2.2, t), foil), sh(rect(x + bw * 0.86, y - t, 2.2, t), foil));
    } else {
      out.push(sh(rect(x + bw * 0.3, y - t * 0.72, bw * 0.4, t * 0.44, 1), C.cream, { opacity: 0.9 }));
    }
    y -= t;
  }
  return { shapes: out, top: y };
}

export type Seg = number | { w: number; make: (cx: number, baseY: number) => Shape[] } | { stack: number; n?: number; top?: (cx: number, y: number) => Shape[] };

/**
 * Fill a shelf from x0..x1 standing on baseY. `segs` is read left to right: a number is a run of
 * upright books that wide (0 = share the remaining width), an object with `make` leaves a gap and
 * draws a prop centred in it, and `stack` draws a horizontal pile.
 */
export function shelfRow(x0: number, x1: number, baseY: number, h: number, r: Rng, segs: Seg[] = [0], pal: string[] = SPINES, bw: [number, number] = [11, 27]): Shape[] {
  const out: Shape[] = [];
  const fixed = segs.reduce<number>((a, s) => a + (typeof s === 'number' ? s : 'stack' in s ? s.stack : s.w), 0);
  const flex = segs.filter((s) => s === 0).length;
  const share = flex ? Math.max(0, (x1 - x0 - fixed) / flex) : 0;
  let x = x0;
  for (const s of segs) {
    if (typeof s === 'number') {
      const end = Math.min(x1, x + (s === 0 ? share : s));
      out.push(...books(x, end, baseY, h, r, pal, bw));
      x = end;
    } else if ('stack' in s) {
      const st = bookStack(x + s.stack / 2, baseY, s.stack - 8, s.n ?? r.int(3, 5), r);
      out.push(...st.shapes);
      if (s.top) out.push(...s.top(x + s.stack / 2, st.top));
      x += s.stack;
    } else {
      out.push(...s.make(x + s.w / 2, baseY));
      x += s.w;
    }
  }
  return out;
}

/** A run of upright books from x0 to x1 (some lean). */
export function books(x0: number, x1: number, baseY: number, h: number, r: Rng, pal: string[] = SPINES, bw: [number, number] = [11, 27]): Shape[] {
  const out: Shape[] = [];
  let x = x0, last = '';
  while (x < x1 - 7) {
    let w = r.range(bw[0], bw[1]);
    if (x + w > x1) w = x1 - x;
    if (x1 - (x + w) < 7) w = x1 - x;
    let col = r.pick(pal);
    if (col === last) col = r.pick(pal);
    last = col;
    const bh = h * r.range(0.62, 0.97);
    const lean = r.next() < 0.07 && x1 - x > w + bh * 0.3 && x > x0 + 30;
    if (lean) {
      const ang = r.range(8, 15);
      const off = Math.sin((ang * Math.PI) / 180) * bh;
      out.push(...place(book(0, 0, w, bh * 0.92, col, r), { rot: -ang, x: x + off + 1, y: baseY }));
      x += w + off + 3;
    } else {
      out.push(...book(x, baseY, w, bh, col, r));
      x += w + r.range(0, 1.2);
    }
  }
  return out;
}

/** Bookcase carcass: frame, dark back, shelf boards. Returns shapes plus each row's {baseY, h, x0, x1}. */
export function bookcase(x: number, y: number, w: number, h: number, rows: number, opt: { side?: number; board?: number; plinth?: number; crown?: number; wood?: string; cols?: number[] } = {}) {
  const side = opt.side ?? 16, board = opt.board ?? 11, plinth = opt.plinth ?? 26, crown = opt.crown ?? 20, wood = opt.wood ?? C.wood;
  const out: Shape[] = [];
  out.push(sh(rect(x, y, w, h), wood));
  out.push(sh(rect(x + side, y + crown, w - side * 2, h - crown - plinth), C.woodDeep));
  // back boards
  for (let bx = x + side + 40; bx < x + w - side; bx += 46) out.push(sh(rect(bx, y + crown, 1.5, h - crown - plinth), '#2a190f', { opacity: 0.7 }));
  const innerH = h - crown - plinth;
  const rh = innerH / rows;
  const cells: { baseY: number; h: number; x0: number; x1: number }[] = [];
  const cols = [x + side, ...(opt.cols ?? []), x + w - side];
  for (let i = 0; i < rows; i++) {
    const baseY = y + crown + rh * (i + 1) - board;
    for (let c = 0; c < cols.length - 1; c++) {
      const cx0 = cols[c] + (c ? side / 2 : 0), cx1 = cols[c + 1] - (c < cols.length - 2 ? side / 2 : 0);
      cells.push({ baseY, h: rh - board - 8, x0: cx0 + 3, x1: cx1 - 3 });
      // shadow under the shelf above
      out.push(sh(rect(cx0, baseY - rh + board, cx1 - cx0, 14), '#000000', { opacity: 0.28 }));
    }
  }
  return { shapes: out, cells, rh, board, side, plinth, crown, cols };
}

/** Front parts of a bookcase (boards, uprights, crown, plinth) drawn after the books. */
export function bookcaseFront(x: number, y: number, w: number, h: number, rows: number, opt: { side?: number; board?: number; plinth?: number; crown?: number; wood?: string; cols?: number[] } = {}): Shape[] {
  const side = opt.side ?? 16, board = opt.board ?? 11, plinth = opt.plinth ?? 26, crown = opt.crown ?? 20, wood = opt.wood ?? C.wood;
  const out: Shape[] = [];
  const innerH = h - crown - plinth, rh = innerH / rows;
  for (let i = 0; i < rows; i++) {
    const by = y + crown + rh * (i + 1) - board;
    out.push(sh(rect(x + side, by, w - side * 2, board), shade(wood, 0.12)));
    out.push(sh(rect(x + side, by, w - side * 2, 2.5), shade(wood, 0.32)));
    out.push(sh(rect(x + side, by + board - 3, w - side * 2, 3), shade(wood, -0.3)));
  }
  for (const cx of opt.cols ?? []) {
    out.push(sh(rect(cx - side / 2, y + crown, side, innerH), wood));
    out.push(sh(rect(cx - side / 2, y + crown, 3, innerH), shade(wood, 0.25)));
    out.push(sh(rect(cx + side / 2 - 3, y + crown, 3, innerH), shade(wood, -0.3)));
  }
  out.push(sh(rect(x, y, side, h), wood), sh(rect(x + w - side, y, side, h), wood));
  out.push(sh(rect(x + 2, y, 3, h), shade(wood, 0.28)), sh(rect(x + side - 3, y, 3, h), shade(wood, -0.32)));
  out.push(sh(rect(x + w - side, y, 3, h), shade(wood, 0.2)), sh(rect(x + w - 4, y, 4, h), shade(wood, -0.35)));
  out.push(sh(rect(x - 6, y - 4, w + 12, crown + 4, 3), shade(wood, 0.08)));
  out.push(sh(rect(x - 6, y - 4, w + 12, 4), shade(wood, 0.35)), sh(rect(x - 2, y + crown - 4, w + 4, 4), shade(wood, -0.35)));
  out.push(sh(rect(x - 4, y + h - plinth, w + 8, plinth), shade(wood, -0.08)));
  out.push(sh(rect(x - 4, y + h - plinth, w + 8, 3), shade(wood, 0.3)), sh(rect(x - 4, y + h - 5, w + 8, 5), shade(wood, -0.4)));
  return out;
}

// ---------------------------------------------------------------- tableware

export function steam(h = 60, col = '#ffffff'): Shape[] {
  return [
    stroke(curve([[-7, 0], [-13, -h * 0.3], [-3, -h * 0.6], [-10, -h]]), col, 3, { opacity: 0.55 }),
    stroke(curve([[6, -4], [0, -h * 0.35], [11, -h * 0.62], [4, -h * 0.95]]), col, 2.5, { opacity: 0.45 }),
  ];
}

/** Teacup on a saucer, about 78 wide and 52 tall. Handle on the right. */
export function teacup(col = C.cream, band = C.blue, tea = '#9a5a2c'): Shape[] {
  return [
    sh(ellipse(0, -5, 39, 8), shade(col, -0.18)),
    sh(ellipse(0, -7, 37, 6.5), col),
    sh(ellipse(0, -7, 20, 3.5), shade(col, -0.14)),
    stroke(curve([[22, -38], [42, -40], [42, -22], [19, -18]]), shade(col, -0.12), 6),
    sh(blob([[-26, -46], [26, -46], [23, -24], [12, -9], [-12, -9], [-23, -24]], 0.8), col),
    sh(blob([[8, -44], [25, -44], [22, -24], [12, -11], [4, -11], [14, -26]], 0.8), shade(col, -0.16), { opacity: 0.7 }),
    sh(ribbon([[-25, -36], [0, -32], [25, -36]], 5), band),
    sh(ellipse(0, -46, 26, 6.5), shade(col, 0.3)),
    sh(ellipse(0, -45.5, 22, 4.8), tea),
    sh(ellipse(-7, -46.5, 8, 1.6), shade(tea, 0.35), { opacity: 0.8 }),
  ];
}

/** Round teapot, spout to the left, about 150 wide and 100 tall. */
export function teapot(col = C.blue, trim = C.cream): Shape[] {
  const dk = shade(col, -0.3), lt = shade(col, 0.3);
  return [
    sh(ellipse(0, -4, 34, 6), dk),
    sh(ribbon([[-38, -30], [-58, -38], [-66, -58], [-76, -70]], (t) => 22 - t * 13), col),
    sh(ellipse(-76, -70, 5.5, 3.5, 40), dk),
    stroke(curve([[40, -62], [70, -66], [76, -36], [42, -22]]), col, 9),
    stroke(curve([[42, -60], [66, -62], [70, -38], [44, -26]]), lt, 2, { opacity: 0.6 }),
    sh(ellipse(0, -40, 48, 37), col),
    sh(blob([[14, -72], [44, -48], [40, -18], [10, -4], [26, -30]], 1), dk, { opacity: 0.45 }),
    sh(ribbon([[-46, -46], [0, -38], [46, -46]], 7), trim),
    sh(ribbon([[-45, -36], [0, -28], [45, -36]], 2.5), trim, { opacity: 0.8 }),
    sh(ellipse(-20, -58, 12, 7, -30), lt, { opacity: 0.7 }),
    sh(ellipse(0, -74, 27, 8), dk),
    sh(ellipse(0, -77, 25, 7), shade(col, 0.1)),
    sh(ellipse(0, -84, 5, 3), dk),
    sh(circle(0, -89, 7), trim),
    sh(circle(-2, -91, 2.2), '#ffffff', { opacity: 0.7 }),
  ];
}

// ---------------------------------------------------------------- plants

export function pot(w = 60, h = 50, col = C.terracotta): Shape[] {
  const t = w / 2, b = w * 0.36;
  return [
    sh(poly([[-t, -h], [t, -h], [b, 0], [-b, 0]]), col),
    sh(poly([[t * 0.3, -h], [t, -h], [b, 0], [b * 0.4, 0]]), shade(col, -0.22), { opacity: 0.7 }),
    sh(poly([[-t * 0.8, -h], [-t * 0.5, -h], [-b * 0.6, 0], [-b * 0.85, 0]]), shade(col, 0.25), { opacity: 0.6 }),
    sh(rect(-t - 4, -h - 10, w + 8, 12, 3), shade(col, 0.1)),
    sh(rect(-t - 4, -h - 10, w + 8, 3.5, 2), shade(col, 0.35)),
    sh(rect(-t - 4, -h - 1.5, w + 8, 3.5, 1), shade(col, -0.3)),
  ];
}

/** Bushy fern-like plant in a pot. Height is roughly potH + size. */
export function fern(r: Rng, size = 90, potW = 56, potH = 44, potCol = C.terracotta, n = 11): Shape[] {
  const out: Shape[] = [];
  const top = -potH - 8;
  const greens = [C.green, C.greenMid, C.leaf, C.sage, C.greenDark];
  for (let i = 0; i < n; i++) {
    const a = -90 + (i - (n - 1) / 2) * (150 / n) + r.range(-8, 8);
    const len = size * r.range(0.65, 1) * (1 - Math.abs(a + 90) / 260);
    const col = r.pick(greens);
    const rad = (a * Math.PI) / 180;
    const bend = (a + 90) * 0.012;
    const pts: Pt[] = [];
    for (let k = 0; k <= 5; k++) {
      const t = k / 5;
      pts.push([Math.cos(rad) * len * t + bend * len * t * t * 0.9, top + Math.sin(rad) * len * t + Math.abs(bend) * len * t * t * 0.6]);
    }
    out.push(stroke(curve(pts), shade(col, -0.25), 2));
    for (let k = 1; k <= 5; k++) {
      const p = pts[k], q = pts[k - 1];
      const dir = (Math.atan2(p[1] - q[1], p[0] - q[0]) * 180) / Math.PI;
      const l = len * 0.24 * (1.15 - k / 7);
      out.push(sh(leaf(p[0], p[1], l, l * 0.3, dir - 55), col), sh(leaf(p[0], p[1], l, l * 0.3, dir + 55), shade(col, 0.12)));
    }
    out.push(sh(leaf(pts[5][0], pts[5][1], len * 0.14, len * 0.04, a), col));
  }
  return [...out, ...pot(potW, potH, potCol)];
}

/** Broad-leaved plant (rubber plant / calathea style). */
export function leafy(r: Rng, size = 110, potW = 60, potH = 48, potCol = C.blueDark, n = 9): Shape[] {
  const out: Shape[] = [];
  const top = -potH - 6;
  for (let i = 0; i < n; i++) {
    const a = -90 + (i - (n - 1) / 2) * (140 / n) + r.range(-9, 9);
    const len = size * r.range(0.6, 1);
    const col = r.pick([C.green, C.greenMid, C.leaf, C.greenDark]);
    const rad = (a * Math.PI) / 180;
    const sx = Math.cos(rad) * len * 0.42, sy = top + Math.sin(rad) * len * 0.42;
    out.push(stroke(line([[0, top + 4], [sx, sy]]), shade(col, -0.3), 2.5));
    const l = len * 0.62, wd = l * 0.3;
    out.push(sh(leaf(sx, sy, l, wd, a + r.range(-12, 12)), col));
    out.push(stroke(line([[sx, sy], [sx + Math.cos(rad) * l * 0.85, sy + Math.sin(rad) * l * 0.85]]), shade(col, 0.3), 1.2, { opacity: 0.8 }));
  }
  return [...out, ...pot(potW, potH, potCol)];
}

/** Trailing ivy hanging down from a pot sitting on a shelf. */
export function ivy(r: Rng, drop = 90, potW = 44, potH = 34, potCol = C.cream): Shape[] {
  const out: Shape[] = [];
  const top = -potH - 6;
  for (let i = 0; i < 5; i++) {
    const dir = i % 2 ? 1 : -1;
    const x0 = dir * r.range(4, potW * 0.4);
    const reach = dir * r.range(potW * 0.5, potW * 0.9);
    const d = drop * r.range(0.45, 1);
    const pts: Pt[] = [[x0, top], [x0 + reach * 0.6, top - 14], [x0 + reach, top + d * 0.3], [x0 + reach * 0.9, top + d * 0.7], [x0 + reach * 1.1, top + d]];
    out.push(stroke(curve(pts), C.greenDark, 1.6));
    const S = sample(pts, 3);
    S.forEach((p, k) => {
      if (k === 0) return;
      const col = r.pick([C.greenMid, C.leaf, C.sage, C.green]);
      out.push(sh(leaf(p[0], p[1], r.range(9, 14), r.range(4, 6), (k % 2 ? 30 : 150) + r.range(-25, 25)), col));
    });
  }
  for (let i = 0; i < 6; i++) out.push(sh(leaf(r.range(-8, 8), top + 2, r.range(14, 22), 6, -90 + r.range(-60, 60)), r.pick([C.greenMid, C.leaf, C.green])));
  return [...out, ...pot(potW, potH, potCol)];
}

/** Small succulent/cactus in a pot. */
export function succulent(potCol = C.rose, col = C.sage): Shape[] {
  const out: Shape[] = [];
  for (let i = 0; i < 7; i++) out.push(sh(leaf(0, -30, 26 - Math.abs(i - 3) * 2, 7, -90 + (i - 3) * 26), i % 2 ? col : shade(col, -0.18)));
  out.push(sh(leaf(0, -30, 18, 6, -90), shade(col, 0.2)));
  return [...out, ...pot(36, 26, potCol)];
}

// ---------------------------------------------------------------- lamps & candles

/** Flame centred on the origin base. */
export function flame(s = 1): Shape[] {
  return place([
    sh(circle(0, -12, 26), C.glow, { opacity: 0.22 }),
    sh(blob([[0, 0], [-6, -8], [-3, -18], [0, -26], [4, -16], [6, -7]], 1), C.amber),
    sh(blob([[0, -1], [-3, -7], [0, -15], [3, -7]], 1), '#fff3c4'),
  ], { s });
}

/** Candle in a brass chamberstick, about 60 wide, 95 tall. */
export function candle(col = C.cream): Shape[] {
  return [
    sh(ellipse(0, -4, 30, 7), C.brassDark),
    sh(ellipse(0, -6, 28, 6), C.brass),
    sh(ellipse(-6, -7, 14, 2.5), C.brassLight, { opacity: 0.7 }),
    stroke(circle(33, -9, 7), C.brass, 3.5),
    sh(rect(-11, -18, 22, 12, 3), C.brass),
    sh(rect(-11, -18, 22, 3, 1.5), C.brassLight),
    sh(rect(-8, -62, 16, 46, 2), col),
    sh(rect(2, -62, 6, 46, 2), shade(col, -0.16)),
    sh(blob([[-8, -62], [8, -62], [8, -54], [5, -46], [3, -55], [-2, -57], [-5, -48], [-8, -52]], 0.8), shade(col, 0.4)),
    stroke(line([[0, -62], [0, -68]]), C.ink, 1.6),
    ...place(flame(0.85), { y: -66 }),
  ];
}

/** Table lamp with a fabric shade, about 110 wide and 150 tall. */
export function tableLamp(shadeCol = C.amber, baseCol = C.green): Shape[] {
  return [
    sh(ellipse(0, -4, 30, 7), shade(baseCol, -0.3)),
    sh(blob([[-10, -8], [-24, -30], [-16, -58], [-6, -70], [6, -70], [16, -58], [24, -30], [10, -8]], 0.9), baseCol),
    sh(blob([[4, -10], [22, -30], [14, -58], [5, -68], [12, -40]], 1), shade(baseCol, -0.28), { opacity: 0.6 }),
    sh(ellipse(-10, -42, 5, 12, 12), shade(baseCol, 0.4), { opacity: 0.6 }),
    sh(rect(-4, -84, 8, 16), C.brass),
    sh(poly([[-30, -150], [30, -150], [54, -84], [-54, -84]]), shadeCol),
    sh(poly([[-30, -150], [-12, -150], [-22, -84], [-54, -84]]), shade(shadeCol, 0.3), { opacity: 0.7 }),
    sh(poly([[14, -150], [30, -150], [54, -84], [26, -84]]), shade(shadeCol, -0.2), { opacity: 0.6 }),
    sh(rect(-54, -89, 108, 5, 2), shade(shadeCol, -0.3)),
    sh(rect(-30, -152, 60, 4, 2), shade(shadeCol, -0.3)),
  ];
}

// ---------------------------------------------------------------- curiosities

/** Desk globe on a brass stand, about 84 wide and 120 tall. */
export function globe(sea = C.blue, land = C.sage): Shape[] {
  const cy = -66, R = 36;
  return [
    sh(ellipse(0, -4, 28, 6), C.woodDark),
    sh(ellipse(0, -7, 24, 5), C.wood),
    sh(rect(-3.5, -30, 7, 24), C.brass),
    sh(ellipse(0, -9, 9, 3), C.brassDark),
    stroke(curve([[-14, cy + 39], [-40, cy + 16], [-40, cy - 18], [-13, cy - 40]]), C.brass, 5),
    sh(circle(0, cy, R), sea),
    sh(blob([[-22, cy - 20], [-8, cy - 28], [2, cy - 18], [-4, cy - 6], [-14, cy + 2], [-20, cy + 16], [-28, cy + 4], [-30, cy - 10]], 1), land),
    sh(blob([[10, cy - 6], [22, cy - 14], [32, cy - 4], [30, cy + 10], [20, cy + 22], [12, cy + 12]], 1), land),
    sh(blob([[-6, cy + 20], [4, cy + 16], [8, cy + 26], [0, cy + 32]], 1), shade(land, -0.1)),
    stroke(curve([[-35, cy - 6], [0, cy + 2], [35, cy - 6]]), '#ffffff', 1, { opacity: 0.45 }),
    stroke(curve([[-30, cy + 16], [0, cy + 24], [30, cy + 16]]), '#ffffff', 1, { opacity: 0.35 }),
    stroke(curve([[0, cy - 36], [10, cy], [0, cy + 36]]), '#ffffff', 1, { opacity: 0.35 }),
    sh(sector(0, cy, R, -40, 90), '#1c2a3a', { opacity: 0.22 }),
    sh(ellipse(-13, cy - 16, 9, 6, -35), '#ffffff', { opacity: 0.35 }),
    sh(circle(-13, cy - 41, 4), C.brassLight),
    sh(circle(-14, cy + 40, 4), C.brass),
  ];
}

/** Hourglass, about 50 wide and 86 tall. */
export function hourglass(): Shape[] {
  const sand = '#e0b060';
  return [
    sh(rect(-25, -8, 50, 8, 2), C.wood),
    sh(rect(-25, -8, 50, 2.5, 1), C.woodLight),
    sh(rect(-25, -86, 50, 8, 2), C.wood),
    sh(rect(-25, -86, 50, 2.5, 1), C.woodLight),
    sh(rect(-22, -78, 4, 70), C.woodMid),
    sh(rect(18, -78, 4, 70), C.woodDark),
    sh(blob([[-15, -78], [15, -78], [14, -62], [3, -45], [3, -41], [14, -24], [15, -8], [-15, -8], [-14, -24], [-3, -41], [-3, -45], [-14, -62]], 0.7), '#dcebee', { opacity: 0.85 }),
    sh(blob([[-10, -66], [10, -66], [2.5, -47], [-2.5, -47]], 0.5), sand),
    sh(blob([[-14, -9], [14, -9], [11, -18], [0, -27], [-11, -18]], 0.7), sand),
    sh(rect(-0.8, -46, 1.6, 22), sand),
    sh(blob([[-13, -76], [-9, -76], [-9, -62], [-12, -64]], 0.6), '#ffffff', { opacity: 0.7 }),
    sh(blob([[-13, -22], [-10, -24], [-10, -12], [-13, -11]], 0.6), '#ffffff', { opacity: 0.6 }),
  ];
}

/** Carved owl figurine, about 52 wide and 74 tall. */
export function owl(col = '#8a6238'): Shape[] {
  const dk = shade(col, -0.35), belly = '#d9bf8e';
  return [
    sh(ellipse(0, -3, 22, 4), dk),
    sh(blob([[-18, -4], [-25, -30], [-22, -56], [-12, -68], [12, -68], [22, -56], [25, -30], [18, -4]], 0.9), col),
    sh(poly([[-22, -58], [-20, -76], [-8, -66]]), col),
    sh(poly([[22, -58], [20, -76], [8, -66]]), col),
    sh(blob([[-13, -6], [-17, -26], [-10, -42], [10, -42], [17, -26], [13, -6]], 0.9), belly),
    ...[-34, -26, -18, -10].flatMap((y, i) => [-7, 0, 7].map((x) => stroke(line([[x - 3 + (i % 2) * 3.5, y], [x + (i % 2) * 3.5, y + 3], [x + 3 + (i % 2) * 3.5, y]]), dk, 1.3))),
    sh(blob([[-25, -30], [-22, -50], [-16, -36], [-17, -14]], 0.9), dk, { opacity: 0.55 }),
    sh(blob([[25, -30], [22, -50], [16, -36], [17, -14]], 0.9), dk, { opacity: 0.55 }),
    sh(circle(-10, -53, 10.5), '#f3e6c4'), sh(circle(10, -53, 10.5), '#f3e6c4'),
    stroke(circle(-10, -53, 10.5), dk, 1.5), stroke(circle(10, -53, 10.5), dk, 1.5),
    sh(circle(-10, -53, 5), C.mustard), sh(circle(10, -53, 5), C.mustard),
    sh(circle(-10, -53, 2.6), C.ink), sh(circle(10, -53, 2.6), C.ink),
    sh(circle(-11, -54.5, 1), '#ffffff'), sh(circle(9, -54.5, 1), '#ffffff'),
    sh(poly([[-3.5, -48], [3.5, -48], [0, -40]]), C.amber),
    sh(ellipse(-7, -3, 5, 2.5), C.amber), sh(ellipse(7, -3, 5, 2.5), C.amber),
  ];
}

/** Pocket watch lying flat with its crown at the top, about 60 wide and 78 tall (centre at 0,-30). */
export function pocketWatch(): Shape[] {
  const cy = -30;
  const out: Shape[] = [
    stroke(circle(0, cy - 38, 7), C.brass, 3.5),
    sh(rect(-5, cy - 34, 10, 8, 2), C.brassDark),
    sh(circle(0, cy, 30), C.brassDark),
    sh(circle(0, cy, 28), C.brass),
    sh(sector(0, cy, 28, 200, 300, 24), C.brassLight, { opacity: 0.8 }),
    sh(circle(0, cy, 22.5), C.paper),
    stroke(circle(0, cy, 22.5), C.brassDark, 1.2),
  ];
  for (let i = 0; i < 12; i++) {
    const a = (i * 30 * Math.PI) / 180, r0 = i % 3 ? 18.5 : 16, r1 = 20.5;
    out.push(stroke(line([[Math.cos(a) * r0, cy + Math.sin(a) * r0], [Math.cos(a) * r1, cy + Math.sin(a) * r1]]), C.ink, i % 3 ? 1 : 1.8));
  }
  out.push(stroke(line([[0, cy], [8, cy - 10]]), C.ink, 2.4), stroke(line([[0, cy], [-13, cy - 6]]), C.ink, 1.6), sh(circle(0, cy, 2.4), C.red));
  return out;
}

/** Chain made of small links along a curve. */
export function chain(pts: Pt[], col = C.brass): Shape[] {
  const S = sample(pts, 5);
  return S.map((p, i) => stroke(ellipse(p[0], p[1], 3.4, 2.2, i % 2 ? 60 : -30), i % 2 ? col : C.brassDark, 1.4));
}

/** Magnifying glass, lens centred on the origin, handle pointing down-right (about 100 across). */
export function magnifier(): Shape[] {
  return [
    sh(ribbon([[19, 19], [58, 58]], (t) => 9 + t * 3), C.woodDark),
    sh(ribbon([[22, 19], [56, 53]], 3), C.woodLight, { opacity: 0.6 }),
    sh(ribbon([[16, 16], [25, 25]], 10), C.brassDark),
    sh(circle(0, 0, 27), '#d8ecf0', { opacity: 0.6 }),
    stroke(circle(0, 0, 27), C.brassDark, 7),
    stroke(circle(0, 0, 27), C.brass, 4),
    sh(sector(0, 0, 21, 190, 260, 16), '#ffffff', { opacity: 0.8 }),
    sh(circle(9, 11, 3), '#ffffff', { opacity: 0.5 }),
  ];
}

/** Old brass key lying horizontally, bow on the left, about 84 long. */
export function key(col = C.brass): Shape[] {
  const dk = C.brassDark;
  return [
    sh(rect(8, -3.5, 62, 7, 2), col),
    sh(rect(8, -3.5, 62, 2.2, 1), C.brassLight),
    sh(rect(16, -5.5, 4, 11, 1), dk), sh(rect(24, -5, 3, 10, 1), dk),
    sh(poly([[50, 3], [68, 3], [68, 20], [63, 20], [63, 13], [59, 13], [59, 18], [54, 18], [54, 11], [50, 11]]), col),
    sh(rect(50, 3, 18, 2.4), dk, { opacity: 0.6 }),
    sh(circle(-6, 0, 17), col),
    sh(circle(-6, 0, 17), 'none', { stroke: dk, strokeWidth: 1.5 }),
    sh(circle(-13, 0, 5), '#3a2a1a'), sh(circle(-3, -7, 4.6), '#3a2a1a'), sh(circle(-3, 7, 4.6), '#3a2a1a'),
    sh(sector(-6, 0, 16, 180, 280, 13), C.brassLight, { opacity: 0.8 }),
  ];
}

/** Feather quill lying along +x from the nib at the origin, about 120 long. */
export function quill(col = '#f4ecd8'): Shape[] {
  const out: Shape[] = [
    sh(poly([[0, 0], [14, -3], [14, 3]]), C.ink),
    sh(ribbon([[12, 0], [60, -3], [118, -12]], (t) => 4 - t * 3), '#d8c9a0'),
    sh(blob([[36, -1], [48, -16], [76, -24], [104, -22], [121, -14], [112, -4], [88, 6], [60, 9], [44, 6]], 0.9), col),
    sh(blob([[38, 0], [60, -1], [90, -6], [119, -13], [110, -4], [88, 6], [60, 9], [44, 6]], 0.9), shade(col, -0.14)),
    stroke(curve([[30, -1], [60, -2.5], [90, -7], [120, -13]]), '#b8a070', 1.6),
  ];
  for (let i = 0; i < 7; i++) {
    const x = 48 + i * 9.5;
    out.push(stroke(line([[x, -2 - i * 1.2], [x + 8, -15 - i * 1.1]]), '#b8a47a', 1, { opacity: 0.8 }));
    out.push(stroke(line([[x, -1.5 - i * 1.2], [x + 9, 6 - i * 1.4]]), '#a89468', 1, { opacity: 0.8 }));
  }
  return out;
}

/** Round wire spectacles, about 96 wide, centred on the origin. */
export function spectacles(col = C.brassDark): Shape[] {
  return [
    stroke(curve([[-42, -2], [-52, -12], [-60, -30]]), col, 2.5),
    stroke(curve([[42, -2], [52, -12], [64, -26]]), col, 2.5),
    sh(circle(-23, 0, 18), '#dbeaf0', { opacity: 0.55 }),
    sh(circle(23, 0, 18), '#dbeaf0', { opacity: 0.55 }),
    stroke(circle(-23, 0, 18), col, 3.6),
    stroke(circle(23, 0, 18), col, 3.6),
    stroke(curve([[-6, -3], [0, -8], [6, -3]]), col, 3.2),
    sh(sector(-23, 0, 14, 195, 265, 10), '#ffffff', { opacity: 0.85 }),
    sh(sector(23, 0, 14, 195, 265, 10), '#ffffff', { opacity: 0.85 }),
  ];
}

/** Sealed letter, about 86 x 58, centred on the origin. */
export function envelope(col = C.paper): Shape[] {
  return [
    sh(rect(-43, -29, 86, 58, 3), col),
    sh(poly([[-43, 29], [0, -4], [43, 29]]), shade(col, -0.07)),
    sh(poly([[-43, -29], [0, 8], [43, -29]]), shade(col, -0.13)),
    stroke(line([[-43, -29], [0, 8], [43, -29]]), '#b7a47c', 1.5),
    stroke(rect(-43, -29, 86, 58, 3), '#b7a47c', 1.5),
    sh(blob([[-10, 2], [-4, -3], [5, -3], [10, 3], [9, 12], [2, 17], [-7, 15], [-11, 9]], 1), C.red),
    sh(circle(-0.5, 7, 5.5), C.redDark),
    sh(circle(-2, 5.5, 1.8), C.rose, { opacity: 0.8 }),
  ];
}

/** Squat ink bottle with a cork, about 50 wide and 62 tall. */
export function inkBottle(col = '#2c3e5c'): Shape[] {
  return [
    sh(ellipse(0, -2, 24, 4), '#000000', { opacity: 0.25 }),
    sh(rect(-24, -40, 48, 40, 7), col),
    sh(rect(8, -40, 16, 40, 7), shade(col, -0.35), { opacity: 0.7 }),
    sh(rect(-20, -36, 5, 30, 2.5), '#ffffff', { opacity: 0.35 }),
    sh(rect(-10, -50, 20, 12, 2), col),
    sh(rect(-13, -53, 26, 5, 2), shade(col, 0.2)),
    sh(rect(-8, -62, 16, 10, 2), '#b98c5a'),
    sh(rect(-8, -62, 16, 3, 1.5), '#d6ae7c'),
    sh(rect(-15, -30, 30, 20, 2), C.paper),
    stroke(line([[-10, -23], [10, -23]]), C.ink, 1.6),
    stroke(line([[-7, -17], [7, -17]]), C.ink, 1.2),
  ];
}

/** Chess knight, about 44 wide and 76 tall. */
export function knight(col = '#efe2c2'): Shape[] {
  const dk = shade(col, -0.3);
  return [
    sh(rect(-22, -8, 44, 8, 3), col),
    sh(rect(-22, -3, 44, 3, 1.5), dk),
    sh(rect(-17, -15, 34, 8, 3), col),
    sh(rect(-17, -10, 34, 2.5, 1), dk, { opacity: 0.7 }),
    sh(blob([[-13, -14], [-12, -28], [-5, -38], [-14, -38], [-23, -41], [-24, -49], [-12, -62], [-6, -66], [-4, -76], [3, -68], [11, -58], [16, -40], [14, -14]], 0.75), col),
    sh(blob([[4, -66], [11, -58], [16, -40], [14, -14], [6, -14], [9, -38], [6, -54]], 0.8), dk, { opacity: 0.55 }),
    sh(circle(-10, -54, 2.3), C.ink),
    stroke(line([[-23, -44], [-19, -45]]), C.ink, 1.4),
    stroke(curve([[-16, -42], [-9, -44], [-4, -40]]), dk, 1.4),
    stroke(line([[1, -62], [6, -50]]), dk, 1.3), stroke(line([[5, -52], [9, -40]]), dk, 1.3),
  ];
}

/** Little brown mouse facing left, about 76 wide (with tail) and 34 tall. */
export function mouse(col = '#9a8672'): Shape[] {
  const dk = shade(col, -0.3);
  return [
    stroke(curve([[22, -6], [38, -2], [44, -14], [54, -10]]), '#d9a79a', 2.6),
    sh(blob([[-14, -1], [-20, -10], [-10, -22], [8, -26], [22, -18], [26, -6], [20, -1]], 1), col),
    sh(blob([[4, -25], [22, -18], [26, -6], [20, -1], [8, -1], [16, -10]], 1), dk, { opacity: 0.4 }),
    sh(blob([[-10, -3], [-30, -5], [-36, -9], [-24, -18], [-12, -20]], 0.9), col),
    sh(circle(-13, -24, 8), col), sh(circle(-13, -24, 5), '#e2b3a6'),
    sh(circle(-5, -26, 6.5), dk), sh(circle(-5, -26, 3.8), '#d9a79a'),
    sh(circle(-24, -13, 1.9), C.ink),
    sh(circle(-36, -9, 2.2), '#c98a84'),
    stroke(line([[-32, -8], [-42, -4]]), dk, 0.9), stroke(line([[-32, -9], [-43, -11]]), dk, 0.9),
    sh(ellipse(-12, -1.5, 5, 2), '#d9a79a'), sh(ellipse(12, -1.5, 6, 2), '#d9a79a'),
  ];
}

/** Red apple, about 44 wide and 50 tall. */
export function apple(col = '#b8362e'): Shape[] {
  return [
    sh(blob([[0, -38], [10, -42], [20, -34], [22, -18], [14, -3], [4, 0], [-4, 0], [-14, -3], [-22, -18], [-20, -34], [-10, -42]], 1), col),
    sh(blob([[8, -40], [20, -34], [22, -18], [14, -3], [6, -1], [14, -18]], 1), shade(col, -0.3), { opacity: 0.6 }),
    sh(ellipse(-11, -27, 4.5, 8, 18), '#ffffff', { opacity: 0.4 }),
    stroke(curve([[0, -37], [1, -44], [5, -49]]), C.woodDark, 2.6),
    sh(leaf(3, -44, 17, 6, -22), C.leaf),
  ];
}

/** Brass hand bell with a wooden handle, about 46 wide and 76 tall. */
export function bell(): Shape[] {
  return [
    sh(ellipse(0, -2, 8, 4), C.brassDark),
    sh(blob([[-23, -5], [-18, -14], [-13, -34], [-6, -44], [6, -44], [13, -34], [18, -14], [23, -5]], 0.8), C.brass),
    sh(blob([[3, -43], [13, -34], [18, -14], [23, -5], [11, -5], [9, -28]], 0.8), C.brassDark, { opacity: 0.55 }),
    sh(ellipse(-8, -24, 3, 10, 14), C.brassLight, { opacity: 0.8 }),
    sh(ribbon([[-23, -6], [0, -3], [23, -6]], 4), C.brassDark),
    sh(rect(-4, -50, 8, 8, 2), C.brassDark),
    sh(blob([[-5, -50], [-7, -62], [-4, -74], [4, -74], [7, -62], [5, -50]], 0.8), C.woodDark),
    sh(ellipse(-2, -63, 1.8, 8), C.woodLight, { opacity: 0.6 }),
  ];
}

// ---------------------------------------------------------------- shelf fillers (non-targets)

/** Two-handled brass trophy cup, about 50 wide and 70 tall. */
export function trophy(): Shape[] {
  return [
    sh(rect(-16, -10, 32, 10, 2), C.woodDark), sh(rect(-16, -10, 32, 3, 1), C.woodLight),
    sh(rect(-4, -26, 8, 18), C.brass), sh(ellipse(0, -11, 11, 3), C.brassDark),
    stroke(curve([[-17, -60], [-30, -56], [-26, -40], [-12, -36]]), C.brass, 3.5), stroke(curve([[17, -60], [30, -56], [26, -40], [12, -36]]), C.brass, 3.5),
    sh(blob([[-19, -66], [19, -66], [16, -44], [6, -28], [-6, -28], [-16, -44]], 0.8), C.brass),
    sh(blob([[6, -66], [19, -66], [16, -44], [6, -29], [2, -30], [9, -46]], 0.8), C.brassDark, { opacity: 0.6 }),
    sh(ellipse(-9, -52, 3, 9, 8), C.brassLight, { opacity: 0.8 }),
    sh(ellipse(0, -66, 19, 4), C.brassDark),
  ];
}

/** Wooden mantel clock with a round face, about 70 wide and 62 tall. */
export function mantelClock(): Shape[] {
  return [
    sh(rect(-35, -8, 70, 8, 2), C.woodDark),
    sh(blob([[-30, -8], [-30, -34], [-18, -56], [0, -62], [18, -56], [30, -34], [30, -8]], 0.8), C.woodMid),
    sh(blob([[8, -60], [18, -56], [30, -34], [30, -8], [18, -8], [20, -36]], 0.8), C.woodDark, { opacity: 0.5 }),
    sh(circle(0, -32, 19), C.brass), sh(circle(0, -32, 16), C.paper),
    ...[0, 90, 180, 270].map((a) => sh(circle(Math.cos((a * Math.PI) / 180) * 12.5, -32 + Math.sin((a * Math.PI) / 180) * 12.5, 1.3), C.ink)),
    stroke(line([[0, -32], [0, -43]]), C.ink, 1.6), stroke(line([[0, -32], [7, -28]]), C.ink, 1.6),
  ];
}

/** Small model sailing boat on a stand, about 80 wide and 84 tall. */
export function modelBoat(): Shape[] {
  return [
    sh(rect(-22, -5, 44, 5, 2), C.woodDark), sh(rect(-3, -14, 6, 10), C.woodDark),
    sh(blob([[-38, -28], [38, -28], [28, -13], [-26, -13]], 0.5), C.redDark), sh(rect(-38, -30, 76, 4, 2), C.woodLight),
    stroke(line([[0, -30], [0, -84]]), C.woodDark, 2.2),
    sh(poly([[3, -80], [3, -36], [32, -36]]), C.paper), sh(poly([[-3, -74], [-3, -36], [-26, -36]]), C.parchment),
    sh(poly([[0, -84], [10, -81], [0, -78]]), C.red),
  ];
}

export function box(w: number, h: number, col: string, r: Rng): Shape[] {
  const out = [
    sh(rect(-w / 2, -h, w, h, 2), col),
    sh(rect(w * 0.25, -h, w * 0.25, h, 2), shade(col, -0.22), { opacity: 0.6 }),
    sh(rect(-w / 2 - 2, -h - 2, w + 4, h * 0.26, 2), shade(col, 0.14)),
    sh(rect(-w / 2 - 2, -h + h * 0.2, w + 4, 2.5), shade(col, -0.35)),
  ];
  if (r.next() < 0.6) out.push(sh(rect(-w * 0.22, -h * 0.58, w * 0.44, h * 0.3, 1.5), C.paper), stroke(line([[-w * 0.13, -h * 0.43], [w * 0.13, -h * 0.43]]), C.ink, 1.2));
  else out.push(sh(circle(0, -h * 0.42, 3.5), C.brass), stroke(circle(0, -h * 0.42, 6), C.brassDark, 1.2));
  return out;
}

export function jar(w: number, h: number, fill: string, r: Rng): Shape[] {
  const out = [
    sh(rect(-w / 2, -h, w, h, w * 0.22), '#cfe0e0', { opacity: 0.55 }),
    sh(rect(-w / 2 + 2, -h * r.range(0.45, 0.75), w - 4, h * 0.5, w * 0.18), fill),
    sh(rect(-w / 2 + 3, -h + 6, 3, h - 14, 1.5), '#ffffff', { opacity: 0.6 }),
    sh(rect(-w / 2 - 1, -h - 7, w + 2, 9, 2), r.pick([C.brass, C.woodMid, C.red, C.blueDark])),
    sh(rect(-w / 2 - 1, -h - 7, w + 2, 2.5, 1), '#ffffff', { opacity: 0.3 }),
  ];
  return out;
}

export function frame(w: number, h: number, r: Rng, wood = C.brassDark): Shape[] {
  const out = [
    sh(rect(-w / 2, -h, w, h, 2), wood),
    sh(rect(-w / 2, -h, w, 3, 1), shade(wood, 0.35)),
    sh(rect(-w / 2 + 5, -h + 5, w - 10, h - 10), C.paper),
  ];
  const ix = -w / 2 + 8, iy = -h + 8, iw = w - 16, ih = h - 16;
  const v = r.int(0, 2);
  if (v === 0) {
    out.push(sh(rect(ix, iy, iw, ih), '#b9cdd6'), sh(poly([[ix, iy + ih], [ix + iw * 0.35, iy + ih * 0.35], [ix + iw * 0.6, iy + ih * 0.7], [ix + iw * 0.8, iy + ih * 0.5], [ix + iw, iy + ih * 0.8], [ix + iw, iy + ih]]), C.greenMid), sh(circle(ix + iw * 0.72, iy + ih * 0.28, Math.min(iw, ih) * 0.12), C.amber));
  } else if (v === 1) {
    out.push(sh(rect(ix, iy, iw, ih), C.parchment), sh(ellipse(0, -h / 2 - ih * 0.08, iw * 0.2, ih * 0.22), C.woodMid), sh(blob([[-iw * 0.34, iy + ih], [-iw * 0.2, iy + ih * 0.68], [iw * 0.2, iy + ih * 0.68], [iw * 0.34, iy + ih]], 0.8), C.blueDark));
  } else {
    out.push(sh(rect(ix, iy, iw, ih), '#e9dcc0'));
    for (let i = 0; i < 5; i++) out.push(sh(leaf(0, iy + ih * 0.9, ih * r.range(0.45, 0.75), ih * 0.1, -90 + (i - 2) * 22), r.pick([C.greenMid, C.leaf, C.green])));
  }
  return out;
}

export function vase(col: string, h = 56): Shape[] {
  const w = h * 0.42;
  return [
    sh(blob([[-w * 0.5, 0], [-w, -h * 0.35], [-w * 0.75, -h * 0.7], [-w * 0.35, -h * 0.86], [-w * 0.45, -h], [w * 0.45, -h], [w * 0.35, -h * 0.86], [w * 0.75, -h * 0.7], [w, -h * 0.35], [w * 0.5, 0]], 0.9), col),
    sh(blob([[w * 0.2, -h * 0.84], [w * 0.75, -h * 0.7], [w, -h * 0.35], [w * 0.5, -2], [w * 0.1, -2], [w * 0.5, -h * 0.4]], 0.9), shade(col, -0.28), { opacity: 0.6 }),
    sh(ellipse(-w * 0.5, -h * 0.5, w * 0.14, h * 0.16, 10), '#ffffff', { opacity: 0.4 }),
    sh(ribbon([[-w * 0.95, -h * 0.42], [0, -h * 0.36], [w * 0.95, -h * 0.42]], 3), shade(col, 0.4), { opacity: 0.8 }),
  ];
}

export function bottle(col: string, h = 70): Shape[] {
  return [
    sh(rect(-11, -h * 0.66, 22, h * 0.66, 5), col),
    sh(rect(-4.5, -h, 9, h * 0.4, 2), col),
    sh(rect(-6, -h - 3, 12, 6, 2), '#b98c5a'),
    sh(rect(-8, -h * 0.5, 4, h * 0.4, 2), '#ffffff', { opacity: 0.35 }),
    sh(rect(-9, -h * 0.42, 18, h * 0.24, 1.5), C.paper, { opacity: 0.9 }),
  ];
}

/** Rolled scrolls / maps standing in a pot. */
export function scrolls(r: Rng): Shape[] {
  const out: Shape[] = [];
  for (let i = 0; i < 4; i++) {
    const a = (i - 1.5) * 9 + r.range(-3, 3), len = r.range(60, 84);
    out.push(...place([sh(rect(-5, -len, 10, len, 2), i % 2 ? C.parchment : C.paper), sh(rect(1, -len, 4, len, 1), '#b9a47a', { opacity: 0.6 }), sh(ellipse(0, -len, 5, 2), '#a8946a'), sh(rect(-5, -len * 0.55, 10, 3), C.red)], { rot: a, y: -20 }));
  }
  out.push(sh(poly([[-20, -34], [20, -34], [16, 0], [-16, 0]]), C.blueDark), sh(rect(-22, -38, 44, 6, 2), shade(C.blueDark, 0.2)), sh(poly([[4, -34], [20, -34], [16, 0], [6, 0]]), '#000000', { opacity: 0.2 }));
  return out;
}

/** Small mantel-style carriage lantern (unlit). */
export function lantern(): Shape[] {
  return [
    sh(rect(-17, -6, 34, 6, 2), C.ink),
    sh(rect(-14, -52, 28, 46), '#f2d590', { opacity: 0.75 }),
    sh(rect(-14, -52, 3, 46), C.ink), sh(rect(11, -52, 3, 46), C.ink), sh(rect(-1.5, -52, 3, 46), C.ink),
    sh(poly([[-18, -52], [18, -52], [8, -66], [-8, -66]]), C.ink),
    stroke(circle(0, -72, 6), C.ink, 2.5),
    ...place(flame(0.5), { x: -7, y: -14 }),
  ];
}

/** Pile of loose papers / letters, about w wide, centred on origin, lying flat. */
export function papers(w: number, r: Rng): Shape[] {
  const out: Shape[] = [];
  for (let i = 0; i < 3; i++) {
    const a = r.range(-9, 9);
    out.push(...place([sh(rect(-w / 2, -w * 0.36, w, w * 0.72, 1.5), i === 2 ? C.paper : shade(C.parchment, 0.2 * i)), stroke(rect(-w / 2, -w * 0.36, w, w * 0.72, 1.5), '#b9a57e', 1)], { rot: a, x: r.range(-5, 5), y: r.range(-4, 4) }));
    if (i === 2) for (let k = 0; k < 5; k++) out.push(...place([stroke(line([[-w * 0.38, -w * 0.22 + k * w * 0.1], [w * r.range(0.1, 0.38), -w * 0.22 + k * w * 0.1]]), '#6a5a48', 1.2, { opacity: 0.7 })], { rot: a }));
  }
  return out;
}

/** Wood-grain strokes over a rectangular area. */
export function grain(x: number, y: number, w: number, h: number, r: Rng, col: string, n = 6, op = 0.35): Shape[] {
  const out: Shape[] = [];
  for (let i = 0; i < n; i++) {
    const gy = y + r.range(3, h - 3), x0 = x + r.range(0, w * 0.5), len = r.range(w * 0.15, w * 0.5);
    out.push(stroke(curve([[x0, gy], [x0 + len * 0.5, gy + r.range(-2.5, 2.5)], [Math.min(x + w, x0 + len), gy + r.range(-1, 1)]]), col, r.range(0.8, 1.8), { opacity: op }));
  }
  return out;
}

export { mix };
