import { rect, ellipse, circle, poly, line, curve, leaf, xf, stroke, rng } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { PaintActivity, PaletteColor } from '../types';
import { collector, heart, scallopEllipse, M, L, Q, C, type Pt } from './props-paint';

const W = 1000, H = 1250;

const palette: PaletteColor[] = [
  { id: 'wall', number: 1, name: 'Vanilla wall', hex: '#fdeee6' },
  { id: 'blush', number: 2, name: 'Blush', hex: '#f8cdd0' },
  { id: 'pink', number: 3, name: 'Strawberry icing', hex: '#f291ad' },
  { id: 'berry', number: 4, name: 'Raspberry', hex: '#cf4f7b' },
  { id: 'mint', number: 5, name: 'Mint', hex: '#aee0cf' },
  { id: 'mintD', number: 6, name: 'Peppermint', hex: '#56b094' },
  { id: 'sky', number: 7, name: 'Blueberry icing', hex: '#93cdea' },
  { id: 'lav', number: 8, name: 'Lavender', hex: '#b7a2e3' },
  { id: 'lemon', number: 9, name: 'Lemon', hex: '#fbe08a' },
  { id: 'gold', number: 10, name: 'Honey gold', hex: '#e3a640' },
  { id: 'choc', number: 11, name: 'Chocolate', hex: '#7b4a33' },
  { id: 'chocL', number: 12, name: 'Milk chocolate', hex: '#b98660' },
  { id: 'cream', number: 13, name: 'Whipped cream', hex: '#fffaf0' },
  { id: 'red', number: 14, name: 'Cherry red', hex: '#d63c3f' },
  { id: 'teal', number: 15, name: 'Teal tablecloth', hex: '#3b8f95' },
  { id: 'flame', number: 16, name: 'Candle flame', hex: '#f58a3a' },
];

const { regions, R } = collector();
const detail: Shape[] = [];
const INK = '#7a5a4a';

// ---------- striped wall and table ----------
R('wall', rect(0, 0, W, 1110), 'wall');
[50, 250, 450, 650, 850].forEach((x, i) => R(`wall-stripe-${i + 1}`, rect(x, 0, 100, 1110), 'blush'));
R('table', rect(0, 1104, W, 146), 'teal');

// ---------- bunting ----------
{
  const A: Pt = [0, 50], Cc: Pt = [240, 215], B: Pt = [500, 26];
  const at = (t: number): { p: Pt; tan: Pt } => {
    const u = 1 - t;
    const p: Pt = [u * u * A[0] + 2 * u * t * Cc[0] + t * t * B[0], u * u * A[1] + 2 * u * t * Cc[1] + t * t * B[1]];
    const dx = 2 * u * (Cc[0] - A[0]) + 2 * t * (B[0] - Cc[0]), dy = 2 * u * (Cc[1] - A[1]) + 2 * t * (B[1] - Cc[1]);
    const len = Math.hypot(dx, dy);
    return { p, tan: [dx / len, dy / len] };
  };
  const cols = ['pink', 'mintD', 'lemon', 'sky', 'lav'];
  const ts = [0.1, 0.29, 0.48, 0.67, 0.86];
  for (const side of ['left', 'right'] as const) {
    const mx = (p: Pt): Pt => (side === 'left' ? p : [W - p[0], p[1]]);
    ts.forEach((t, i) => {
      const { p, tan } = at(t);
      const a: Pt = [p[0] - tan[0] * 36, p[1] - tan[1] * 36], b: Pt = [p[0] + tan[0] * 36, p[1] + tan[1] * 36];
      const tip: Pt = [p[0] - tan[1] * 88, p[1] + tan[0] * 88];
      R(`flag-${side}-${i + 1}`, poly([mx(a), mx(b), mx(tip)]), cols[(i + (side === 'left' ? 0 : 2)) % 5]);
    });
    const pts: Pt[] = [];
    for (let i = 0; i <= 12; i++) pts.push(mx(at(i / 12).p));
    detail.push(stroke(curve(pts), INK, 2.4));
  }
  R('rosette', circle(500, 32, 26), 'gold');
  R('rosette-centre', circle(500, 32, 13), 'cream');
}

// ---------- the stand ----------
R('doily', scallopEllipse(500, 1192, 258, 46, 20, 0.09), 'cream');
R('stand-foot', ellipse(500, 1186, 150, 24), 'mint');
R('stand-stem', M(468, 1100) + L(532, 1100) + Q(522, 1152, 566, 1182) + L(434, 1182) + Q(478, 1152, 468, 1100) + 'Z', 'gold');
const tiers: [string, number, number, number, number][] = [['bottom', 1050, 400, 44, 22], ['middle', 752, 285, 34, 18], ['top', 462, 150, 20, 16]];
const plate = ([name, y, rx, ry, lip]: [string, number, number, number, number]) => {
  R(`plate-${name}-rim`, ellipse(500, y + lip, rx, ry), 'gold');
  R(`plate-${name}`, ellipse(500, y, rx, ry), 'mint');
};
plate(tiers[0]);
R('post-lower', rect(486, 780, 28, 276), 'gold');
plate(tiers[1]);
R('post-upper', rect(486, 480, 28, 278), 'gold');
plate(tiers[2]);

// ---------- cupcakes ----------
type Topper = 'cherry' | 'heart' | 'candle' | 'none';
const sprinkleCols = ['#ffffff', '#f8cf47', '#d63c3f', '#56b094', '#5aa7d8'];
const sprinkles: string[] = sprinkleCols.map(() => '');
const g = rng(2611);
function cupcake(id: string, cx: number, by: number, s: number, main: string, light: string, wrap: string, stripeCol: string, top: Topper, topCol = 'red') {
  const t = { s, x: cx, y: by };
  const wy = (u: number) => -6 + 24 * u * (1 - u);
  R(`${id}-wrapper`, xf(M(-75, -88) + L(75, -88) + L(54, -6) + Q(0, 6, -54, -6) + 'Z', t), wrap);
  [[0.2, 0.4], [0.6, 0.8]].forEach(([u0, u1], i) =>
    R(`${id}-pleat-${i + 1}`, xf(poly([[-75 + 150 * u0, -88], [-75 + 150 * u1, -88], [-54 + 108 * u1, wy(u1)], [-54 + 108 * u0, wy(u0)]]), t), stripeCol));
  if (top === 'candle') {
    R(`${id}-candle`, xf(rect(-8, -292, 16, 86, 5), t), topCol);
    R(`${id}-flame`, xf(M(0, -340) + C(18, -316, 15, -295, 0, -293) + C(-15, -295, -18, -316, 0, -340) + 'Z', t), 'flame');
    R(`${id}-flame-heart`, xf(ellipse(0, -307, 6, 9), t), 'lemon');
    detail.push(stroke(xf(line([[-8, -272], [8, -282]]) + line([[-8, -250], [8, -260]]) + line([[-8, -228], [8, -238]]), t), '#ffffff', 2.4 * s, { opacity: 0.85 }));
  }
  R(`${id}-icing-1`, xf(rect(-86, -130, 172, 50, 25), t), main);
  R(`${id}-icing-2`, xf(rect(-64, -170, 128, 48, 24), t), light);
  R(`${id}-icing-3`, xf(M(-42, -160) + C(-46, -190, -8, -196, 2, -226) + C(10, -200, 46, -190, 42, -160) + Q(0, -150, -42, -160) + 'Z', t), main);
  if (top === 'cherry') {
    R(`${id}-cherry`, xf(circle(0, -236, 22), t), topCol);
    detail.push(stroke(xf(curve([[2, -256], [8, -278], [24, -292]]), t), '#6b8f3a', 2.6));
    detail.push(stroke(xf(curve([[-12, -244], [-8, -250], [-2, -252]]), t), '#ffffff', 2.4, { opacity: 0.85 }));
  }
  if (top === 'heart') R(`${id}-heart`, heart(cx, by - 238 * s, 46 * s), topCol);
  // pleats and swirl lines
  let d = '';
  for (const u of [0.1, 0.3, 0.5, 0.7, 0.9]) d += line([[-75 + 150 * u, -78], [-54 + 108 * u, wy(u) - 4]]);
  detail.push(stroke(xf(d, t), INK, 1.3, { opacity: 0.45 }));
  detail.push(stroke(xf(curve([[-70, -98], [-20, -90], [40, -98], [72, -112]]) + curve([[-50, -140], [-10, -132], [34, -140], [52, -152]]), t), INK, 1.5, { opacity: 0.4 }));
  // sprinkles
  for (let i = 0; i < 9; i++) {
    const row = i % 3 === 2 ? 1 : 0;
    const x = g.range(row ? -46 : -68, row ? 46 : 68), y = row ? g.range(-160, -134) : g.range(-120, -92), a = g.range(0, Math.PI);
    const k = g.int(0, sprinkleCols.length - 1);
    sprinkles[k] += xf(line([[x - Math.cos(a) * 5, y - Math.sin(a) * 5], [x + Math.cos(a) * 5, y + Math.sin(a) * 5]]), t);
  }
}
// bottom tier
cupcake('cake-1', 205, 1064, 1, 'pink', 'blush', 'cream', 'berry', 'cherry');
cupcake('cake-2', 400, 1064, 1, 'choc', 'chocL', 'lemon', 'gold', 'heart', 'pink');
cupcake('cake-3', 600, 1064, 1, 'mintD', 'cream', 'pink', 'berry', 'heart', 'red');
cupcake('cake-4', 795, 1064, 1, 'lav', 'cream', 'sky', 'cream', 'cherry');
// middle tier
cupcake('cake-5', 320, 764, 1, 'lemon', 'cream', 'lav', 'cream', 'candle', 'sky');
cupcake('cake-6', 500, 764, 1, 'sky', 'cream', 'berry', 'pink', 'none');
cupcake('cake-7', 680, 764, 1, 'chocL', 'choc', 'cream', 'mintD', 'candle', 'pink');
// top
cupcake('cake-8', 500, 472, 1.12, 'pink', 'cream', 'lemon', 'gold', 'candle', 'red');
sprinkles.forEach((d, i) => d && detail.push(stroke(d, sprinkleCols[i], 3.2)));

// ---------- on the table ----------
R('cherry-left', circle(112, 1182, 27), 'red');
R('cherry-right', circle(176, 1198, 25), 'red');
R('cherry-leaf', leaf(158, 1120, 66, 22, -20), 'mintD');
detail.push(stroke(curve([[114, 1158], [128, 1132], [158, 1118]]) + curve([[178, 1175], [174, 1144], [158, 1118]]), '#6b8f3a', 2.8));
detail.push(stroke(curve([[96, 1176], [100, 1168], [108, 1164]]) + curve([[162, 1192], [166, 1184], [173, 1181]]), '#ffffff', 2.6, { opacity: 0.85 }));

R('gift', rect(776, 1136, 136, 86, 4), 'pink');
R('gift-lid', rect(764, 1112, 160, 32, 5), 'berry');
R('gift-ribbon', rect(832, 1112, 24, 110), 'cream');
R('gift-bow', M(844, 1118) + C(812, 1052, 752, 1076, 790, 1114) + Q(820, 1126, 844, 1118) + Q(868, 1126, 898, 1114) + C(936, 1076, 876, 1052, 844, 1118) + 'Z', 'lemon');

// ---------- line work ----------
detail.push(stroke(ellipse(500, 1050, 330, 30) + ellipse(500, 752, 228, 22) + ellipse(500, 462, 112, 12), '#ffffff', 1.8, { opacity: 0.7 }));
detail.push(stroke(line([[0, 1104], [W, 1104]]), '#2c7177', 2));
{
  const s = rng(77);
  let d = '';
  for (let i = 0; i < 14; i++) {
    const x = s.pick([s.range(20, 230), s.range(770, 980)]), y = s.range(1126, 1240), a = s.range(0, Math.PI);
    if (y > 1140 && ((x > 70 && x < 215) || (x > 755 && x < 930))) continue;
    d += line([[x - Math.cos(a) * 6, y - Math.sin(a) * 6], [x + Math.cos(a) * 6, y + Math.sin(a) * 6]]);
  }
  detail.push(stroke(d, '#fbe08a', 3.2));
}

const activity: PaintActivity = {
  id: 'sweets-paint-1', version: 1, mode: 'paint', title: 'Cupcake Tower',
  blurb: 'Three tiers of frosted cupcakes topped with sprinkles, cherries and birthday candles, with party bunting strung across the wall behind.',
  collectionId: 'sweets', categories: ["Food", "Treats"], difficulty: 'Moderate',
  added: '2026-11-26',
  width: W, height: H, palette, regions, detail,
};
export default activity;
