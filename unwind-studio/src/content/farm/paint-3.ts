import { blob, circle, curve, ellipse, line, poly, rect, sector, xf } from '../../art/kit';
import type { PaintActivity } from '../types';
import { W, H, band, barn, between, canvas, clipToCanvas, flower, polar, puff, soft, type Pt } from './props-paint';

const c = canvas();
const { R, D } = c;

// ---------------------------------------------------------------- big sky
R('sky', rect(0, 0, W, H), 'sky');
R('sky-low', between([[0, 436], [300, 420], [650, 438], [1000, 424]], [[0, 700], [1000, 700]]), 'skyLow');
R('cloud-1-shade', puff(262, 216, 188, 62, 7, 5, true), 'cloudShade');
R('cloud-1', puff(250, 184, 192, 64, 7, 0, true), 'cloud');
R('cloud-2-shade', puff(772, 330, 168, 54, 6, 12, true), 'cloudShade');
R('cloud-2', puff(760, 300, 172, 56, 6, 8, true), 'cloud');
R('cloud-3', puff(640, 96, 104, 32, 5, 20, true), 'cloud');
R('cloud-4', puff(420, 470, 96, 26, 4, 30, true), 'cloud');
D(curve([[452, 330], [466, 318], [480, 330], [494, 318], [508, 330]]) + curve([[540, 372], [550, 363], [560, 372], [570, 363], [580, 372]]), '#4a5568', 2.4, 0.8);

// ---------------------------------------------------------------- the mown field: rows running to the horizon
{
  const V: Pt = [520, 560];
  const xs = [-30000, -1500, -900, -480, -160, 110, 360, 620, 900, 1230, 1650, 2300, 30000];
  for (let i = 0; i < xs.length - 1; i++) {
    const pts = clipToCanvas([V, [xs[i + 1], H], [xs[i], H]]).filter(([, y]) => y >= 0);
    R(`row-${i + 1}`, poly(clipToCanvas(pts).map(([x, y]) => [x, Math.max(y, 640)] as Pt)), i % 2 ? 'gold' : 'straw');
  }
}
R('hills', between([[0, 600], [220, 572], [480, 602], [720, 576], [1000, 598]], [[0, 662], [1000, 662]]), 'hill');
R('hedge', between([[0, 640], [90, 630], [200, 642], [330, 632], [470, 644], [600, 634], [720, 644], [860, 634], [1000, 642]], [[0, 668], [1000, 668]]), 'hedge');

// windmill
R('windmill-tower', poly([[118, 664], [141, 440], [159, 440], [182, 664]]), 'wood');
D(line([[139, 470], [166, 520], [131, 560], [174, 610], [122, 650]]) + line([[161, 470], [134, 520], [169, 560], [126, 610], [178, 650]]), '#5d452c', 2);
R('windmill-vane', poly([[150, 418], [232, 398], [252, 426], [232, 454], [150, 434]]), 'red');
for (let i = 0; i < 8; i++) R(`windmill-blade-${i + 1}`, sector(150, 426, 66, i * 45 + 8, i * 45 + 38, 15), 'steel');
R('windmill-hub', circle(150, 426, 13), 'tyre');

// far barn, silo and trees
R('tree-1', puff(742, 630, 42, 36, 5, 0), 'hedge');
R('tree-2', puff(560, 640, 34, 26, 5, 14), 'hedge');
{
  const b = barn(792, 664, 0.62);
  R('barn-side', b.side, 'redDark');
  R('barn-front', b.front, 'red');
  R('barn-roof', b.roof, 'tyre');
  R('barn-door', b.door, 'cream');
}
R('silo', rect(958, 588, 36, 78), 'steel');
R('silo-dome', soft([[956, 590], [962, 572], [976, 564], [990, 572], [996, 590]]), 'grey');

// ---------------------------------------------------------------- hay bales
function bale(id: string, cx: number, cy: number, r: number, len: number, dir: 1 | -1, full = true) {
  const e = cx + dir * len, k = r * 0.36 * dir;
  R(`${id}-shadow`, ellipse(cx + (dir * len) / 2, cy + r, r * 0.9 + len / 2, Math.max(7, r * 0.16)), 'ochre');
  R(`${id}-body`, `M${cx} ${cy - r}L${e} ${cy - r}C${e + k} ${cy - r} ${e + k} ${cy + r} ${e} ${cy + r}L${cx} ${cy + r}Z`, 'goldDeep');
  if (full) {
    for (const [j, u] of [0.42, 0.78].entries()) {
      const x = cx + dir * len * u, w = r * 0.13;
      R(`${id}-twine-${j + 1}`, `M${x - w} ${cy - r}L${x + w} ${cy - r}Q${x + w + k * 1.3} ${cy} ${x + w} ${cy + r}L${x - w} ${cy + r}Q${x - w + k * 1.3} ${cy} ${x - w} ${cy - r}Z`, 'cream');
    }
  }
  R(`${id}-face`, circle(cx, cy, r), 'gold');
  if (full) R(`${id}-ring`, circle(cx, cy, r * 0.68), 'straw');
  R(`${id}-core`, circle(cx, cy, r * (full ? 0.32 : 0.42)), 'goldDeep');
  const sp: Pt[] = [];
  for (let a = 0; a < 360 * 3.2; a += 10) sp.push(polar(cx, cy, r * (0.14 + (0.8 * a) / (360 * 3.2)), a));
  D(curve(sp), '#a8742a', Math.max(1.4, r / 40), 0.7);
}
bale('bale-far-1', 86, 716, 36, 44, 1, false);
bale('bale-far-2', 936, 724, 30, 36, -1, false);
bale('bale-mid', 880, 830, 56, 70, -1, false);

// ---------------------------------------------------------------- the tractor (facing right)
R('tractor-shadow', ellipse(520, 1002, 340, 22), 'ochre');
R('exhaust-smoke-1', circle(612, 522, 22), 'cloudShade');
R('exhaust-smoke-2', circle(640, 472, 30), 'cloudShade');
R('exhaust-smoke-3', circle(688, 414, 40), 'cloudShade');
R('exhaust-pipe', rect(596, 556, 22, 140), 'tyre', [607, 575]);
R('exhaust-muffler', rect(587, 604, 40, 58, 12), 'grey');
R('seat', xf(blob([[258, 656], [326, 664], [354, 654], [350, 634], [302, 636], [282, 612], [272, 574], [250, 578], [246, 626]], 0.7), { x: 10, y: 8 }), 'tyre');
R('steering-column', band([[474, 700], [420, 612]], 13, 13), 'grey');
R('steering-wheel', ellipse(414, 602, 15, 50, 32), 'tyre');
R('chassis', rect(440, 846, 290, 36, 8), 'tyre');
R('engine', rect(468, 772, 274, 84, 8), 'grey');
R('engine-panel', rect(494, 790, 86, 46, 8), 'steel');
R('engine-flywheel', circle(650, 814, 27), 'tyre');
R('engine-flywheel-hub', circle(650, 814, 11), 'steel');
R('hood', 'M420 690L730 690Q792 690 792 742L792 782L420 782Z', 'red');
R('hood-stripe', rect(446, 730, 262, 15, 7), 'cream', [577, 737.5]);
R('grille', 'M750 696L766 696Q794 698 794 742L794 782L750 782Z', 'steel');
R('headlamp-housing', ellipse(726, 666, 30, 24), 'tyre');
R('headlamp', ellipse(746, 666, 15, 20), 'straw');
D(line([[758, 714], [786, 714]]) + line([[758, 730], [788, 730]]) + line([[758, 746], [788, 746]]) + line([[758, 762], [788, 762]]), '#59616f', 2.2);
D(line([[600, 700], [600, 774]]) + line([[690, 700], [690, 774]]), '#8f2620', 2, 0.8);

// rear wheel and fender
R('rear-tyre', circle(330, 850, 150), 'tyre');
R('fender', sector(330, 850, 190, 198, 346, 144), 'red');
R('rear-rim', circle(330, 850, 98), 'cream');
R('rear-dish', circle(330, 850, 64), 'red');
R('rear-hub', circle(330, 850, 24), 'tyre');
// front wheel
R('front-tyre', circle(736, 925, 76), 'tyre');
R('front-rim', circle(736, 925, 45), 'cream');
R('front-hub', circle(736, 925, 17), 'red');
{
  let lugs = '';
  for (let a = 4; a < 360; a += 18) { if (a > 196 && a < 348) continue; lugs += line([polar(330, 850, 108, a), polar(330, 850, 142, a + 9)]); }
  for (let a = 0; a < 360; a += 24) lugs += line([polar(736, 925, 52, a), polar(736, 925, 70, a + 10)]);
  D(lugs, '#6b7080', 5, 0.9);
  let bolts = '';
  for (let a = 0; a < 360; a += 60) bolts += circle(...polar(330, 850, 44, a), 3.5);
  D(bolts, '#8f2620', 3);
}

// ---------------------------------------------------------------- foreground bales, poppies and a visitor
bale('bale-left', 150, 1118, 106, 138, 1);
bale('bale-right', 868, 1128, 96, 124, -1);
R('crow', blob([[118, 990], [140, 972], [164, 974], [176, 990], [206, 1002], [176, 1010], [150, 1014], [126, 1008]]), 'tyre');
R('crow-wing', blob([[140, 986], [164, 984], [192, 1000], [162, 1004]]), 'grey');
D(line([[118, 990], [104, 994]]) + line([[150, 1012], [150, 1024]]) + line([[162, 1010], [162, 1022]]), '#34363f', 3);
{
  let stalks = '';
  for (const x of [400, 452, 506, 566, 622, 676]) stalks += curve([[x, 1250], [x + 4, 1205], [x + 12, 1170]]);
  D(stalks, '#b9862e', 3, 0.85);
}
flower(c, 'poppy-1', 440, 1150, 30, 'red', 'tyre', 5, 0.82);
flower(c, 'poppy-2', 532, 1196, 28, 'red', 'tyre', 5, 0.82, -60);
flower(c, 'poppy-3', 618, 1146, 26, 'red', 'tyre', 5, 0.82, -75);

const activity: PaintActivity = {
  id: 'farm-paint-3', version: 1, mode: 'paint', title: 'Tractor in the Hay Field', blurb: 'A trusty red tractor rests among round hay bales in a golden field, with a windmill turning slowly under a wide summer sky.',
  collectionId: 'farm', categories: ["Countryside", "Animals"], difficulty: 'Detailed',
  added: '2026-11-26',
  width: W, height: H,
  palette: [
    { id: 'sky', number: 1, name: 'Sky blue', hex: '#7fbbe6' },
    { id: 'skyLow', number: 2, name: 'Pale horizon', hex: '#c6e4f4' },
    { id: 'cloud', number: 3, name: 'Cloud white', hex: '#fffdf7' },
    { id: 'cloudShade', number: 4, name: 'Cloud shadow', hex: '#dce4ee' },
    { id: 'hill', number: 5, name: 'Far hills', hex: '#93b97c' },
    { id: 'hedge', number: 6, name: 'Hedgerow', hex: '#4a7d45' },
    { id: 'straw', number: 7, name: 'Pale straw', hex: '#f9e29c' },
    { id: 'gold', number: 8, name: 'Hay gold', hex: '#f0c452' },
    { id: 'goldDeep', number: 9, name: 'Deep gold', hex: '#dc9f31' },
    { id: 'ochre', number: 10, name: 'Ochre shadow', hex: '#a9762b' },
    { id: 'red', number: 11, name: 'Tractor red', hex: '#d03b2c' },
    { id: 'redDark', number: 12, name: 'Barn shadow', hex: '#8f2620' },
    { id: 'tyre', number: 13, name: 'Tyre black', hex: '#34363f' },
    { id: 'grey', number: 14, name: 'Iron grey', hex: '#7b8494' },
    { id: 'steel', number: 15, name: 'Steel', hex: '#b9c2ce' },
    { id: 'cream', number: 16, name: 'Cream', hex: '#f8ecd2' },
    { id: 'wood', number: 17, name: 'Weathered wood', hex: '#8c6c49' },
  ],
  regions: c.regions,
  detail: c.detail,
};
export default activity;
