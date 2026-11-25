import { blob, circle, curve, ellipse, leaf, line, linearGradient, place, poly, rect, rng, sh, shade, star, stroke } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { FindActivity, FindItem } from '../types';
import {
  C, apple, bell, mantelClock, modelBoat, trophy, bookStack, bookcase, bookcaseFront, bottle, box, candle, chain, envelope, fern, frame, globe, grain, hourglass, inkBottle, ivy,
  jar, key, knight, lantern, leafy, magnifier, mouse, owl, papers, pocketWatch, quill, ribbon, scrolls, shelfRow, spectacles, succulent, teacup,
  vase, type Seg,
} from './props';

const ID = 'library-find';
const W = 1200, H = 1500;
const r = rng(90210);
const items: FindItem[] = [];
const scene = (...xs: (Shape | Shape[])[]) => items.push({ shapes: xs.flat() });
const target = (id: string, name: string, shapes: Shape[]) => items.push({ id, name, target: true, shapes });
const at = (shapes: Shape[], x: number, y: number, s = 1, rot = 0) => place(shapes, { x, y, s, rot });

// ------------------------------------------------------------ wall
{
  const bg: Shape[] = [sh(rect(0, 0, W, H), `url(#${ID}-wall)`)];
  for (let x = 0, i = 0; x < W; x += 30, i++) if (i % 2) bg.push(sh(rect(x, 0, 30, 1000), '#ffffff', { opacity: 0.05 }));
  for (let row = 0, y = 22; y < 1000; y += 36, row++) for (let x = 15 + (row % 2) * 30; x < W; x += 60) {
    if (y > 80 && x > 40 && x < 1160) continue;
    bg.push(sh(star(x, y, 8, 3, 4, 45), '#d0b060', { opacity: 0.55 }), sh(circle(x, y, 1.8), C.cream, { opacity: 0.7 }));
  }
  bg.push(sh(rect(0, 0, W, 12), '#e7dabb'), sh(rect(0, 10, W, 4), '#b9a780'));
  scene(bg);
}

// ------------------------------------------------------------ things stored on top of the cabinet
{
  const top = 66;
  const s: Shape[] = [];
  // suitcase
  s.push(sh(rect(70, top - 46, 170, 46, 6), '#8a5a36'), sh(rect(70, top - 46, 170, 8, 4), '#a9774a'), sh(rect(70, top - 10, 170, 10, 4), '#5e3a22'));
  for (const x of [104, 196]) s.push(sh(rect(x, top - 46, 12, 46), '#553420'), sh(rect(x + 2, top - 30, 8, 9, 2), C.brass));
  s.push(stroke(curve([[138, top - 46], [146, top - 56], [164, top - 56], [172, top - 46]]), '#553420', 4));
  // hat box
  s.push(sh(rect(270, top - 38, 86, 38, 4), C.plum), sh(rect(266, top - 44, 94, 14, 4), shade(C.plum, 0.18)), sh(rect(270, top - 16, 86, 4), C.cream, { opacity: 0.7 }));
  s.push(...at(vase(C.teal, 44), 404, top));
  s.push(...at(box(82, 40, C.blueDark, r), 478, top));
  // basket
  s.push(sh(poly([[720, top - 44], [840, top - 44], [828, top], [732, top]]), '#b08a52'));
  for (let i = 0; i < 4; i++) s.push(sh(rect(724 + i * 2, top - 40 + i * 10, 112 - i * 4, 5, 2), i % 2 ? '#c9a468' : '#96723e'));
  s.push(sh(rect(716, top - 48, 128, 8, 4), '#c9a468'));
  s.push(...at(box(96, 36, C.green, r), 912, top), ...at(box(70, 28, C.mustard, r), 906, top - 38));
  s.push(...at(scrolls(r), 1016, top, 0.62));
  s.push(...at(globeBall(), 1090, top));
  scene(s);
}
function globeBall(): Shape[] {
  // an old leather football-ish ball / decorative sphere
  return [sh(circle(0, -24, 24), '#a86a44'), sh(circle(-7, -31, 8), '#ffffff', { opacity: 0.2 }), stroke(curve([[-22, -30], [0, -22], [22, -30]]), '#6a3f24', 1.5), stroke(curve([[-4, -47], [4, -24], [-4, -1]]), '#6a3f24', 1.5)];
}

// ------------------------------------------------------------ the cabinet
const CAB = { x: 30, y: 70, w: 1140, h: 896, rows: 5, opt: { cols: [410, 790], side: 18, board: 12, plinth: 30, crown: 24, wood: '#74462a' } };
const pos = new Map<string, [number, number]>();
const G = (w: number, name: string): Seg => ({ w, make: (cx, by) => { pos.set(name, [cx, by]); return []; } });
const P = (w: number, f: (q: typeof r) => Shape[], s = 1): Seg => ({ w, make: (cx, by) => at(f(r), cx, by, s) });
const ST = (w: number, n: number, name?: string, top?: (cx: number, y: number) => Shape[]): Seg => ({ stack: w, n, top: (cx, y) => { if (name) pos.set(name, [cx, y]); return top ? top(cx, y) : []; } });

const cells: Seg[][] = [
  // row 0
  [0, G(62, 'owl'), 0, P(62, () => vase(C.rose, 70)), 36],
  [P(86, (q) => frame(68, 96, q, C.brassDark)), 0, ST(104, 4, undefined, (cx, y) => at(succulent(C.cream, C.sage), cx, y, 1.1)), 0],
  [0, P(72, (q) => scrolls(q)), 0, P(58, () => trophy(), 1.1), 0, G(50, 'bell'), 46],
  // row 1
  [P(52, (q) => jar(36, 66, C.mustard, q)), P(46, (q) => jar(30, 50, '#8a3f4a', q)), 0, ST(100, 5), 0],
  [0, G(86, 'globe'), 0, P(84, () => mantelClock(), 1.05), 30],
  [0, P(84, (q) => box(66, 62, C.teal, q)), 60, G(62, 'candle'), 0],
  // row 2
  [0, G(50, 'knight'), 0, P(96, (q) => fern(q, 78, 50, 40, C.blueDark, 9))],
  [P(34, () => bottle('#4f7a62', 96)), P(34, () => bottle('#8a5a36', 78)), P(34, () => bottle(C.blueDark, 88)), 0, G(54, 'key'), 0, ST(96, 4)],
  [0, G(56, 'hourglass'), 0, P(84, (q) => frame(66, 84, q, C.woodDark)), 28],
  // row 3
  [ST(108, 4, 'teacup'), 0, P(54, () => lantern(), 1.25), 0],
  [0, P(92, (q) => box(74, 66, C.plum, q)), 0, P(96, () => modelBoat(), 1.15), 0, P(58, () => vase(C.mustard, 80)), 0],
  [0, G(44, 'envelope'), 0, P(64, (q) => jar(40, 74, '#b9683f', q)), 40],
  // row 4
  [P(96, (q) => box(80, 84, C.blueDark, q)), 0, ST(104, 5), 0],
  [0, ST(108, 3, 'apple'), 0, P(58, (q) => jar(40, 80, C.sage, q)), 30],
  [0, G(92, 'mouse'), 0, P(88, (q) => box(72, 64, C.brick, q))],
];
{
  const bc = bookcase(CAB.x, CAB.y, CAB.w, CAB.h, CAB.rows, CAB.opt);
  scene(bc.shapes);
  bc.cells.forEach((c, i) => scene(shelfRow(c.x0, c.x1, c.baseY, c.h, r, cells[i], undefined, [10, 22])));
  const front = bookcaseFront(CAB.x, CAB.y, CAB.w, CAB.h, CAB.rows, CAB.opt);
  // brass label holders on each shelf edge
  bc.cells.forEach((c) => front.push(sh(rect((c.x0 + c.x1) / 2 - 17, c.baseY + 2, 34, 8, 1.5), C.brass), sh(rect((c.x0 + c.x1) / 2 - 13, c.baseY + 4, 26, 4), C.paper)));
  scene(front);
  // ivy trailing from the top
  scene(at(ivy(rng(3), 170, 50, 36, C.cream), 600, CAB.y - 4, 1.1));
}

// ------------------------------------------------------------ desk
{
  const s: Shape[] = [];
  s.push(sh(rect(0, 966, W, 30), '#3a2416'));
  s.push(sh(rect(0, 990, W, 316), `url(#${ID}-desk)`));
  s.push(...grain(0, 996, W, 300, rng(5), '#5a3520', 46, 0.4));
  s.push(sh(rect(0, 990, W, 5), '#d0a878', { opacity: 0.5 }));
  // leather pad
  s.push(sh(poly([[272, 1066], [928, 1066], [982, 1284], [218, 1284]]), '#2c5140'));
  s.push(stroke(poly([[286, 1078], [914, 1078], [962, 1272], [238, 1272]]), C.brass, 2.2));
  s.push(sh(poly([[272, 1066], [928, 1066], [931, 1078], [269, 1078]]), '#3c6a54', { opacity: 0.6 }));
  // front edge and drawers
  s.push(sh(rect(0, 1300, W, 200), '#6a4026'));
  s.push(sh(rect(0, 1298, W, 18), '#a8754a'), sh(rect(0, 1298, W, 4), '#d0a878'), sh(rect(0, 1314, W, 6), '#3a2416', { opacity: 0.7 }));
  for (let i = 0; i < 3; i++) {
    const x = 28 + i * 386, w = 372;
    s.push(sh(rect(x, 1338, w, 150, 4), '#7c4c2c'), sh(rect(x, 1338, w, 4, 2), '#a8754a'), sh(rect(x, 1484, w, 4, 2), '#3a2416'));
    s.push(sh(rect(x + 14, 1352, w - 28, 122, 3), '#8a5834'), stroke(rect(x + 14, 1352, w - 28, 122, 3), '#5a3520', 2));
    s.push(...grain(x + 18, 1356, w - 36, 114, rng(40 + i), '#5a3520', 9, 0.45));
    s.push(stroke(rect(x + 26, 1364, w - 52, 98, 2), '#c79a5e', 1.4, { opacity: 0.6 }));
    for (const cx of [x + 44, x + w - 44]) s.push(sh(poly([[cx, 1400], [cx + 9, 1413], [cx, 1426], [cx - 9, 1413]]), '#c79a5e', { opacity: 0.7 }));
    for (const hx of i === 1 ? [x + w / 2] : [x + w * 0.3, x + w * 0.7]) {
      s.push(sh(ellipse(hx, 1410, 32, 9), C.brassDark), sh(ellipse(hx, 1408, 30, 8), C.brass));
      s.push(stroke(curve([[hx - 22, 1410], [hx - 16, 1432], [hx + 16, 1432], [hx + 22, 1410]]), C.brassDark, 6), stroke(curve([[hx - 22, 1409], [hx - 16, 1430], [hx + 16, 1430], [hx + 22, 1409]]), C.brassLight, 2));
    }
    if (i === 1) s.push(sh(ellipse(x + w / 2, 1368, 9, 11), C.brass), sh(circle(x + w / 2, 1365, 3), C.ink), sh(poly([[x + w / 2 - 2, 1366], [x + w / 2 + 2, 1366], [x + w / 2 + 3, 1375], [x + w / 2 - 3, 1375]]), C.ink));
  }
  scene(s);
}

// banker's lamp (back left)
{
  const lamp: Shape[] = [
    sh(ellipse(0, 0, 150, 34), '#ffe2a0', { opacity: 0.2 }),
    sh(ellipse(0, -4, 58, 13), '#000000', { opacity: 0.25 }),
    sh(ellipse(0, -8, 54, 12), C.brassDark), sh(ellipse(0, -12, 50, 10), C.brass), sh(ellipse(-14, -14, 20, 3), C.brassLight, { opacity: 0.8 }),
    sh(rect(-5, -100, 10, 90), C.brass), sh(rect(-5, -100, 3, 90), C.brassLight), sh(circle(0, -58, 8), C.brassDark), sh(circle(-1, -59, 5), C.brass),
    sh(rect(-64, -104, 128, 7, 3), '#fff0b8'),
    sh(rect(-78, -154, 156, 52, 26), '#2f6a4d'),
    sh(rect(-64, -148, 128, 12, 6), '#7fb694', { opacity: 0.55 }),
    sh(rect(-70, -116, 140, 12, 6), '#1c4532', { opacity: 0.6 }),
    sh(rect(-84, -140, 9, 24, 3), C.brass), sh(rect(75, -140, 9, 24, 3), C.brass),
    stroke(line([[38, -102], [38, -62]]), C.brassDark, 1.5), sh(circle(38, -59, 4), C.brass),
  ];
  scene(at(lamp, 128, 1092, 1.05));
}

// clutter on the desk
{
  const s: Shape[] = [];
  // old map under the magnifier
  s.push(...place([
    sh(rect(-86, -58, 172, 116, 2), '#000000', { opacity: 0.2 }),
    sh(rect(-88, -62, 172, 116, 2), C.parchment),
    stroke(rect(-80, -54, 156, 100), '#a8946a', 1.5),
    sh(blob([[-60, -30], [-30, -42], [-8, -28], [-20, -6], [-48, 4], [-66, -10]], 1), '#b7c49a'),
    sh(blob([[6, -10], [40, -26], [62, -8], [50, 22], [20, 30], [2, 14]], 1), '#c9b98a'),
    stroke(curve([[-70, 26], [-30, 16], [0, 32], [40, 38], [70, 26]]), '#6f8fa6', 1.4, { opacity: 0.8 }),
    sh(star(56, -38, 9, 3, 4), C.red), stroke(circle(56, -38, 12), '#8a6a44', 1),
    stroke(line([[-80, 0], [76, 0]]), '#a8946a', 0.8, { opacity: 0.6 }), stroke(line([[-4, -54], [-4, 46]]), '#a8946a', 0.8, { opacity: 0.6 }),
  ], { x: 380, y: 1158, rot: -8 }));
  // open book
  s.push(sh(poly([[452, 1128], [600, 1112], [748, 1128], [766, 1262], [600, 1246], [434, 1262]]), '#000000', { opacity: 0.25 }));
  s.push(sh(poly([[456, 1122], [600, 1106], [744, 1122], [760, 1254], [600, 1240], [440, 1254]]), C.redDark));
  s.push(sh(poly([[466, 1124], [598, 1110], [598, 1234], [452, 1246]]), C.paper), sh(poly([[602, 1110], [734, 1124], [748, 1246], [602, 1234]]), '#efe6cf'));
  s.push(sh(poly([[590, 1111], [598, 1110], [598, 1234], [588, 1235]]), '#d8cba8', { opacity: 0.8 }), sh(poly([[602, 1110], [612, 1111], [614, 1235], [602, 1234]]), '#d0c29c', { opacity: 0.8 }));
  for (let i = 0; i < 9; i++) {
    const y = 1136 + i * 11;
    if (i < 4) s.push(stroke(line([[540, y - 4], [586, y - 8]]), '#6a5a48', 1.3, { opacity: 0.7 }));
    else s.push(stroke(line([[474, y + 3], [586, y - 8]]), '#6a5a48', 1.3, { opacity: 0.7 }));
    s.push(stroke(line([[616, y - 9], [i === 8 ? 680 : 732, y + 2 - (i === 8 ? 5 : 0)]]), '#6a5a48', 1.3, { opacity: 0.7 }));
  }
  s.push(sh(poly([[474, 1136], [530, 1130], [530, 1172], [474, 1178]]), '#cfe0d0'), sh(leaf(502, 1172, 34, 8, -92), C.greenMid), sh(leaf(502, 1168, 22, 6, -140), C.leaf), sh(leaf(502, 1168, 22, 6, -44), C.leaf));
  s.push(sh(ribbon([[600, 1236], [606, 1262], [598, 1286]], 9), C.mustard));
  // pen pot
  for (const [dx, a, col] of [[-10, -14, C.red], [-3, -5, C.mustard], [4, 4, C.blue], [10, 12, C.greenMid], [0, -1, C.woodLight]] as [number, number, string][]) {
    s.push(...place([sh(rect(-3, -92, 6, 60, 1), col), sh(poly([[-3, -92], [3, -92], [0, -102]]), C.parchment), sh(poly([[-1, -98.5], [1, -98.5], [0, -102]]), C.ink)], { rot: a, x: 900 + dx, y: 1070 }));
  }
  s.push(sh(ellipse(900, 1070, 28, 6), '#000000', { opacity: 0.25 }), sh(rect(876, 1014, 48, 56, 5), C.mustard), sh(rect(906, 1014, 18, 56, 5), '#8f6a24', { opacity: 0.6 }), sh(ellipse(900, 1014, 24, 6), '#8f6a24'), sh(rect(876, 1036, 48, 8), C.redDark));
  // stack with a plant, back right
  s.push(sh(ellipse(1058, 1100, 96, 12), '#000000', { opacity: 0.25 }));
  const st = bookStack(1058, 1098, 168, 3, rng(21), [22, 28]);
  s.push(...st.shapes, ...at(leafy(rng(9), 96, 56, 42, C.terracotta, 9), 1068, st.top + 2, 0.95));
  // paperweight
  s.push(sh(ellipse(262, 1118, 30, 6), '#000000', { opacity: 0.25 }), sh(blob([[236, 1116], [236, 1098], [248, 1082], [276, 1082], [288, 1098], [288, 1116]], 0.9), '#bcd9de', { opacity: 0.75 }));
  for (let i = 0; i < 5; i++) s.push(sh(leaf(262, 1106, 12, 5, i * 72), i % 2 ? C.rose : C.red));
  s.push(sh(circle(262, 1106, 3), C.mustard), sh(ellipse(250, 1094, 5, 3, -30), '#ffffff', { opacity: 0.8 }));
  // loose papers, coins, wax and seal
  s.push(...at(papers(120, rng(6)), 1050, 1196));
  for (const [x, y] of [[806, 1262], [826, 1254], [820, 1272]]) s.push(sh(ellipse(x, y + 2, 11, 5.5), C.brassDark), sh(ellipse(x, y, 11, 5.5), C.brass), sh(ellipse(x - 2, y - 1, 5, 2), C.brassLight));
  s.push(...place([sh(rect(-34, -5, 68, 10, 3), C.red), sh(rect(-34, -5, 68, 3.5, 2), C.rose, { opacity: 0.7 }), sh(rect(26, -5, 8, 10, 2), C.redDark)], { x: 720, y: 1100, rot: 14 }));
  s.push(sh(ellipse(790, 1100, 16, 5), C.brassDark), sh(rect(778, 1086, 24, 14, 2), C.brass), sh(blob([[782, 1086], [778, 1066], [784, 1050], [796, 1050], [802, 1066], [798, 1086]], 0.9), C.woodDark), sh(ellipse(787, 1066, 2.5, 8), C.woodLight, { opacity: 0.6 }));
  // ruler
  s.push(...place([sh(rect(-80, -7, 160, 14, 2), '#d9b877'), ...Array.from({ length: 16 }, (_, i) => stroke(line([[-75 + i * 10, -7], [-75 + i * 10, i % 5 ? -2 : 1]]), '#6a4a26', 1))], { x: 150, y: 1210, rot: 6 }));
  // notebook with a pencil, front left
  s.push(...place([sh(rect(-52, -36, 108, 76, 4), '#000000', { opacity: 0.22 }), sh(rect(-54, -40, 108, 76, 4), C.blueDark), sh(rect(-54, -40, 14, 76, 4), '#2a3d50'), sh(rect(-28, -22, 60, 26, 2), C.paper), stroke(line([[-20, -13], [24, -13]]), C.ink, 1.4), stroke(line([[-20, -5], [12, -5]]), C.ink, 1.2), sh(rect(40, -40, 5, 76), C.red, { opacity: 0.9 })], { x: 120, y: 1262, rot: -7 }));
  s.push(...place([sh(rect(-44, -3.5, 78, 7, 1), C.mustard), sh(poly([[34, -3.5], [46, 0], [34, 3.5]]), C.parchment), sh(poly([[42, -1.2], [46, 0], [42, 1.2]]), C.ink), sh(rect(-50, -3.5, 8, 7, 2), C.rose)], { x: 136, y: 1228, rot: 24 }));
  // watch chain trailing off the desk
  s.push(...chain([[1018, 1218], [1060, 1228], [1100, 1262], [1150, 1272], [1196, 1262]]));
  scene(s);
}

// warm lamp glow and vignette (kept faint so they never hide a target)
scene(sh(circle(128, 1010, 420), `url(#${ID}-glow)`, { opacity: 0.25 }), sh(rect(0, 0, W, H), `url(#${ID}-vig)`, { opacity: 0.25 }));

// ------------------------------------------------------------ targets
const p = (name: string): [number, number] => {
  const v = pos.get(name);
  if (!v) throw new Error(`no slot for ${name}`);
  return v;
};
target('owl', 'Owl figurine', at(owl(), ...p('owl'), 1.02));
target('bell', 'Brass bell', at(bell(), ...p('bell'), 0.9));
target('globe', 'Globe', at(globe(), ...p('globe'), 0.88));
target('candle', 'Candle', at(candle(), ...p('candle'), 0.92));
target('knight', 'Chess knight', at(knight('#cdb68a'), ...p('knight'), 0.95));
{
  const [kx, ky] = p('key');
  const top = ky - 140;
  items.splice(items.length, 0, { shapes: [stroke(curve([[kx, top - 12], [kx + 6, top - 4], [kx, top + 2]]), C.brassDark, 2.5), sh(circle(kx, top - 13, 3), C.brassDark)] });
  target('key', 'Brass key', place(key(), { rot: 90, x: kx, y: top + 20, s: 0.82 }));
}
target('hourglass', 'Hourglass', at(hourglass(), ...p('hourglass'), 1.02));
target('teacup', 'Teacup', at(teacup(C.cream, C.blue), p('teacup')[0], p('teacup')[1] + 5, 0.9));
target('envelope', 'Sealed letter', place(envelope(), { rot: -80, x: p('envelope')[0], y: p('envelope')[1] - 40, s: 0.85 }));
target('apple', 'Red apple', at(apple(), p('apple')[0] + 8, p('apple')[1] + 1, 1));
target('mouse', 'Mouse', at(mouse(), p('mouse')[0] + 6, p('mouse')[1], 1.15));
target('magnifier', 'Magnifying glass', at(magnifier(), 366, 1150, 1));
target('spectacles', 'Spectacles', at(spectacles(), 676, 1192, 0.78, -8));
target('ink', 'Ink bottle', at(inkBottle(), 846, 1176, 1.05));
target('quill', 'Quill pen', at(quill(), 262, 1274, 1.1, -10));
target('watch', 'Pocket watch', at(pocketWatch(), 1004, 1272, 0.95, 18));

const defs =
  linearGradient(`${ID}-wall`, [[0, '#23443a'], [1, '#2f5a49']]) +
  linearGradient(`${ID}-desk`, [[0, '#7a4a2a'], [1, '#a06c40']]) +
  `<radialGradient id="${ID}-glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffd98a" stop-opacity="1"/><stop offset="0.4" stop-color="#ffd98a" stop-opacity="0.45"/><stop offset="1" stop-color="#ffd98a" stop-opacity="0"/></radialGradient>` +
  `<radialGradient id="${ID}-vig" cx="0.45" cy="0.55" r="0.8"><stop offset="0" stop-color="#0b1220" stop-opacity="0"/><stop offset="0.55" stop-color="#0b1220" stop-opacity="0"/><stop offset="1" stop-color="#0b1220" stop-opacity="1"/></radialGradient>`;

const activity: FindActivity = {
  id: ID,
  version: 2,
  mode: 'find',
  title: "The Collector's Shelves",
  blurb: 'Sixteen curiosities are tucked among hundreds of books above a cluttered writing desk.',
  collectionId: 'library',
  categories: ['Interiors', 'Cozy'],
  difficulty: 'Detailed',
  width: W,
  height: H,
  defs,
  items,
};
export default activity;
