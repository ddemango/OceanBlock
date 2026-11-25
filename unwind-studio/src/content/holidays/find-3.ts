import { rect, ellipse, circle, poly, line, curve, blob, leaf, star, sh, stroke, place, shade, rng, linearGradient } from '../../art/kit';
import type { Pt } from '../../art/geometry';
import type { Shape } from '../../art/types';
import type { FindActivity, FindItem } from '../types';
import {
  M, L, Q, ol, shadow, H, planks, wallpaper, plate, gingerbread, bauble, candyCane, present, stocking, trainEngine, trainCar, cocoaMug, teddy, snowGlobe, rockingHorse,
  toySoldier, starTopper, mitten, jingleBell, holly, sled, pinecone, snowmanOrnament, curledCat, wreath, garland, fairyLights, pillarCandle, plaidThrow, framedPicture,
} from './props-find';

const ID = 'holidays-find-3';
const W = 1200, HT = 1500;
const items: FindItem[] = [];
const scene = (...s: (Shape | Shape[])[]) => { items.push({ shapes: s.flat() }); };
const target = (id: string, name: string, shapes: Shape[]) => { items.push({ id, name, target: true, shapes }); };

const defs =
  linearGradient(`${ID}-sky`, [[0, '#b8cfe0'], [0.6, '#dce8f0'], [1, '#f2f4f6']]) +
  linearGradient(`${ID}-fire`, [[0, '#2a1a14'], [0.6, '#5a2a14'], [1, '#a8481c']]);

const BAUBLES = ['#c8352e', H.gold, '#3f6ab0', '#d8d8e8', '#b83a6a', '#e8742c'];
const LIGHTS = ['#ffe07a', '#f6a83a', '#ff8a8a', '#a8e0ff', '#b8f0a0'];

// =====================================================================
// walls, floor and rug
// =====================================================================
scene(wallpaper(0, 20, W, 880, 60, '#557560', '#7d9c82', '#d8b85a', 13));
scene(ol(rect(0, 0, W, 24), '#efe4cc', 1, -0.2), sh(rect(0, 24, W, 6), '#2a3a2e', { opacity: 0.25 }));
scene(planks(0, 900, W, 600, 16, '#a86e3e', 17), ol(rect(0, 884, W, 22, 1), '#efe4cc', 1, -0.2), sh(rect(0, 906, W, 8), '#3b2a1c', { opacity: 0.25 }));
// big round braided rug
{
  const cx = 620, cy = 1210;
  const rings: [number, string][] = [[420, '#8e2a26'], [380, '#c8a050'], [340, '#a8342e'], [290, '#2f5a46'], [240, '#c8352e'], [180, '#e8c878'], [120, '#a8342e'], [60, '#2f5a46']];
  for (const [r, c] of rings) scene(sh(ellipse(cx, cy, r, r * 0.3), c));
  let br = '';
  for (const [r] of rings) br += ellipse(cx, cy, r - 6, (r - 6) * 0.3);
  scene(stroke(br, '#3b2a1c', 1.4, { opacity: 0.25 }));
}

// =====================================================================
// snowy window (left)
// =====================================================================
{
  const x0 = 70, y0 = 150, w = 300, h = 420;
  scene(sh(rect(x0, y0, w, h), `url(#${ID}-sky)`));
  scene(sh(blob([[x0, y0 + 300], [x0 + 120, y0 + 270], [x0 + 230, y0 + 290], [x0 + w, y0 + 260], [x0 + w, y0 + h], [x0, y0 + h]], 0.6), '#e8eef4'), sh(blob([[x0, y0 + 350], [x0 + 160, y0 + 330], [x0 + w, y0 + 352], [x0 + w, y0 + h], [x0, y0 + h]], 0.6), '#ffffff'));
  const pines: [number, number, number][] = [[x0 + 40, y0 + 300, 120], [x0 + 110, y0 + 290, 90], [x0 + 230, y0 + 286, 140], [x0 + 280, y0 + 300, 80], [x0 + 170, y0 + 320, 70]];
  for (const [x, y, s] of pines) {
    let t = '', snow = '';
    for (let i = 0; i < 3; i++) { const ty = y - s + i * s * 0.28, hw = s * (0.18 + i * 0.1); t += poly([[x, ty], [x + hw, ty + s * 0.38], [x - hw, ty + s * 0.38]]); snow += M(x - hw * 0.8, ty + s * 0.36) + Q(x, ty + s * 0.26, x + hw * 0.8, ty + s * 0.36) + L(x + hw * 0.5, ty + s * 0.3) + L(x - hw * 0.5, ty + s * 0.3) + 'Z'; }
    scene(sh(rect(x - 4, y - 8, 8, 14), '#6e4a2a'), sh(t, '#3a6a52'), sh(snow, '#ffffff', { opacity: 0.9 }));
  }
  // little cottage in the distance
  scene(sh(rect(x0 + 150, y0 + 240, 50, 36), '#c8352e'), sh(poly([[x0 + 142, y0 + 242], [x0 + 175, y0 + 214], [x0 + 208, y0 + 242]]), '#ffffff'), sh(rect(x0 + 160, y0 + 252, 10, 10) + rect(x0 + 182, y0 + 252, 10, 10), '#ffd25a'), sh(rect(x0 + 186, y0 + 214, 8, 16), '#6e4a2a'));
  const g = rng(71);
  for (let i = 0; i < 40; i++) scene(sh(circle(x0 + g.range(4, w - 4), y0 + g.range(4, h - 10), g.range(1.6, 3.4)), '#ffffff', { opacity: 0.9 }));
  scene(stroke(rect(x0, y0, w, h) + line([[x0 + w / 2, y0], [x0 + w / 2, y0 + h]]) + line([[x0, y0 + h / 3], [x0 + w, y0 + h / 3]]) + line([[x0, y0 + (2 * h) / 3], [x0 + w, y0 + (2 * h) / 3]]), '#fbf6ee', 9));
  // snow drifted into the corners of the panes
  scene(sh(M(x0 + 4, y0 + h / 3 - 4) + Q(x0 + 30, y0 + h / 3 - 18, x0 + 60, y0 + h / 3 - 4) + 'Z' + M(x0 + w / 2 + 4, y0 + h - 4) + Q(x0 + w / 2 + 50, y0 + h - 20, x0 + w - 4, y0 + h - 4) + 'Z', '#ffffff'));
  scene(ol(rect(x0 - 20, y0 + h, w + 40, 18, 2), '#efe4cc', 1, -0.2), sh(rect(x0 - 14, y0 + h + 18, w + 28, 8), '#c9b894'));
  // curtains
  const drape = (x: number, dir: number): Shape[] => {
    const d = M(x, 120) + L(x + dir * 80, 120) + Q(x + dir * 50, 340, x + dir * 90, 600) + Q(x + dir * 110, 640, x + dir * 80, 660) + L(x, 660) + 'Z';
    return [ol(d, '#a8342e', 1.2, -0.25), stroke(curve([[x + dir * 24, 126], [x + dir * 20, 380], [x + dir * 26, 656]]) + curve([[x + dir * 52, 126], [x + dir * 44, 380], [x + dir * 56, 656]]), '#7e2420', 2), ol(rect(x + (dir > 0 ? 30 : -66), 400, 36, 14, 6), H.gold, 1, -0.3)];
  };
  scene(drape(x0 - 8, -1), drape(x0 + w + 8, 1), sh(rect(20, 112, 400, 8, 3), '#6e4a2a'), sh(circle(20, 116, 9) + circle(420, 116, 9), H.gold));
  scene(garland(24, 118, 416, 118, 20, 31));
  // on the sill: poinsettia and a lantern candle
  scene(ol(M(126, y0 + h) + L(166, y0 + h) + L(172, y0 + h - 36) + L(120, y0 + h - 36) + 'Z', H.gold, 1, -0.3));
  {
    let p1 = '', p2 = '';
    for (let i = 0; i < 9; i++) { const d = leaf(146, y0 + h - 56, 34, 11, i * 40 + 10); if (i % 2) p1 += d; else p2 += d; }
    scene(sh(leaf(146, y0 + h - 44, 40, 12, 200) + leaf(146, y0 + h - 44, 40, 12, -20), '#2f6a3a'), sh(p1, '#c8202e'), sh(p2, '#e0303e'), sh(circle(146, y0 + h - 56, 6), '#f6d860'));
  }
  scene(place(pillarCandle(22, 44, '#f2e6cc'), { x: 300, y: y0 + h }), place(pillarCandle(16, 30, '#e8d0b0'), { x: 330, y: y0 + h }));
}
// framed picture over the window side
scene(place(framedPicture(120, 92, H.gold, 4, '#dce8f0', ['#ffffff', '#e8eef4']), { x: 466, y: 180 }));

// =====================================================================
// fireplace and mantel (centre)
// =====================================================================
{
  // brick surround
  scene(sh(rect(440, 580, 400, 320), '#a8543e'));
  let br = '', lt = '';
  const g = rng(5);
  for (let r = 0, y = 580; y < 900; y += 22, r++) for (let x = 440 + (r % 2 ? -22 : 0); x < 840; x += 44) { const d = rect(Math.max(440, x) + 2, y + 2, Math.min(44, 840 - Math.max(440, x)) - 4, 18, 2); if (g.next() < 0.4) lt += d; else br += d; }
  scene(sh(br, '#b8644a'), sh(lt, '#c8765a'));
  // firebox and fire
  const box = M(530, 900) + L(530, 740) + Q(530, 690, 640, 690) + Q(750, 690, 750, 740) + L(750, 900) + 'Z';
  scene(ol(xf2(box, 1.08, 640, 900), '#6e3a2a', 1), sh(box, `url(#${ID}-fire)`));
  scene(sh(ellipse(640, 860, 110, 50), '#ff9a3a', { opacity: 0.35 }), sh(ellipse(640, 870, 70, 30), '#ffd25a', { opacity: 0.35 }));
  scene(ol(rect(570, 858, 140, 22, 10), '#6e4a2a', 1), ol(rect(586, 842, 110, 20, 10), '#8a5a34', 1), sh(ellipse(708, 869, 7, 10) + ellipse(694, 852, 6, 9), '#d9b07a'));
  scene(sh(M(590, 850) + Q(570, 790, 610, 740) + Q(612, 780, 630, 790) + Q(626, 730, 656, 700) + Q(660, 760, 680, 770) + Q(690, 740, 700, 730) + Q(720, 800, 690, 850) + 'Z', '#f08a2a'), sh(M(610, 850) + Q(600, 810, 626, 780) + Q(632, 806, 644, 806) + Q(646, 770, 660, 750) + Q(676, 800, 670, 850) + 'Z', '#f6c83a'), sh(M(630, 850) + Q(626, 826, 644, 810) + Q(656, 830, 652, 850) + 'Z', '#fff1b0'));
  // fire screen
  let mesh = '';
  for (let x = 560; x <= 720; x += 10) mesh += line([[x, 800], [x, 900]]);
  scene(stroke(mesh, '#2a2420', 1, { opacity: 0.35 }), stroke(M(550, 900) + L(550, 806) + Q(640, 784, 730, 806) + L(730, 900), '#2a2420', 3));
  // hearth and mantel shelf
  scene(ol(rect(410, 900, 460, 34, 2), '#8a8078', 1, -0.3), sh(rect(410, 900, 460, 6), '#a8a098'));
  scene(ol(rect(420, 566, 440, 18), '#efe4cc', 1, -0.25), ol(rect(406, 548, 468, 22, 3), '#f6eedc', 1, -0.25), sh(rect(420, 584, 440, 8), '#3b2a1c', { opacity: 0.25 }));
  scene(ol(rect(430, 592, 20, 308) + rect(830, 592, 20, 308), '#efe4cc', 1, -0.25));
}
function xf2(d: string, s: number, ox: number, oy: number): string { return place([sh(d, '#000')], { s, ox, oy })[0].d; }
// wreath above the mantel
scene(place(wreath(74, 41), { x: 640, y: 390 }));
// on the mantel
scene(place(pillarCandle(24, 70, '#f2e6cc'), { x: 444, y: 548 }), place(pillarCandle(20, 48, '#e8d0b0'), { x: 474, y: 548 }), place(pillarCandle(24, 64, '#f2e6cc'), { x: 846, y: 548 }));
scene(ol(M(600, 548) + L(680, 548) + L(676, 480) + Q(640, 440, 604, 480) + 'Z', '#6e4a2a', 1, -0.3), ol(circle(640, 494, 26), '#fbf6ee', 1, -0.25), stroke(line([[640, 494], [640, 476]]) + line([[640, 494], [654, 500]]), '#2a2420', 2));
target('snow-globe', 'Snow globe', place(snowGlobe(84), { x: 536, y: 548 }));
target('toy-soldier', 'Toy soldier', place(toySoldier(104), { x: 760, y: 548 }));
scene(place(present(40, 30, '#3f6ab0', H.gold, 3), { x: 712, y: 548 }));
scene(garland(404, 560, 876, 560, 26, 61));
scene(fairyLights(404, 560, 876, 560, 26, 14, LIGHTS, 4));
target('holly', 'Holly sprig', place(holly(54, 20), { x: 586, y: 588 }));
// stockings
scene(place(stocking(124, '#c8352e', '#fbf6ee', 1), { x: 486, y: 578 }), place(stocking(118, '#2f6a4a', '#fbf6ee', 2), { x: 580, y: 584 }), place(stocking(124, '#3f6ab0', '#fbf6ee', 3), { x: 700, y: 580 }), place(stocking(116, '#c8352e', '#f6d860', 0), { x: 806, y: 584 }));
target('jingle-bell', 'Jingle bell', place(jingleBell(36), { x: 792, y: 618 }));
// sleeping kitten on a hearth rug
scene(sh(ellipse(640, 990, 140, 32), '#efe4cc'), stroke(ellipse(640, 990, 126, 26), '#c8352e', 3));
target('kitten', 'Sleeping kitten', place(curledCat(110, '#e8a05a'), { x: 650, y: 1004 }));

// =====================================================================
// the Christmas tree (right)
// =====================================================================
const TX = 1010, TTOP = 170, TBOT = 940, THW = 200;
const tierPts: Pt[][] = [];
{
  scene(ol(rect(TX - 18, 900, 36, 60), '#6e4a2a', 1));
  const tiers = 5;
  for (let i = 0; i < tiers; i++) {
    const t0 = TTOP + (i * (TBOT - TTOP)) / (tiers + 0.6), t1 = TTOP + ((i + 1.6) * (TBOT - TTOP)) / (tiers + 0.6);
    const hw = THW * ((i + 1.6) / (tiers + 0.6));
    let d = M(TX, t0) + L(TX + hw, t1);
    const n = 5 + i;
    for (let k = 0; k < n; k++) { const xa = TX + hw - (2 * hw * k) / n, xb = TX + hw - (2 * hw * (k + 1)) / n; d += Q((xa + xb) / 2, t1 + 18, xb, t1); }
    d += 'Z';
    scene(sh(d, i % 2 ? '#2f6a3a' : '#357a42', { stroke: '#1f4a2a', strokeWidth: 1.2 }), sh(M(TX, t0) + L(TX + hw, t1) + L(TX + hw * 0.4, t1) + 'Z', '#1f4a2a', { opacity: 0.3 }));
    const g = rng(100 + i);
    let nd = '';
    for (let k = 0; k < 16; k++) { const y = g.range(t0 + 30, t1 - 6), half = hw * ((y - t0) / (t1 - t0)), x = TX + g.range(-half, half) * 0.9; nd += line([[x, y], [x - 6, y + 10]]) + line([[x, y], [x + 6, y + 10]]); }
    scene(stroke(nd, '#5a9a5a', 1.2, { opacity: 0.6 }));
    tierPts.push([[t0, hw], [t1, hw]] as Pt[]);
  }
}
// tinsel and lights spiralling around the tree
{
  const widthAt = (y: number) => THW * ((y - TTOP) / (TBOT - TTOP)) * 0.92;
  for (let i = 0; i < 5; i++) {
    const y0 = 260 + i * 140, y1 = y0 + 90;
    scene(stroke(curve([[TX - widthAt(y0), y0], [TX, y0 + 70], [TX + widthAt(y1), y1]]), '#e8c860', 3, { opacity: 0.85 }));
    scene(fairyLights(TX - widthAt(y0 + 40), y0 + 40, TX + widthAt(y1 + 40), y1 + 40, 40, 6 + i * 2, LIGHTS, 4.5, '#1f4a2a'));
  }
  // baubles
  const g = rng(7);
  const spots: [number, number, number][] = [];
  for (let i = 0; i < 34; i++) {
    const y = g.range(300, 900), half = widthAt(y) * 0.86, x = TX + g.range(-half, half);
    if ((Math.abs(x - 930) < 34 && Math.abs(y - 630) < 50) || (Math.abs(x - 1080) < 30 && Math.abs(y - 470) < 40) || (Math.abs(x - 965) < 30 && Math.abs(y - 790) < 40)) continue;
    if (spots.some(([a, b]) => Math.hypot(a - x, b - y) < 34)) continue;
    spots.push([x, y, 0]);
    scene(stroke(line([[x, y - 8], [x, y]]), '#c9a24a', 1), place(bauble(g.range(9, 14), g.pick(BAUBLES), g.int(0, 3)), { x, y }));
  }
  // little wooden stars and bows
  for (const [x, y] of [[990, 350], [1060, 600], [900, 760], [1110, 840], [1030, 720]] as Pt[]) scene(ol(star(x, y, 12, 5), '#c98f55', 1, -0.3));
  for (const [x, y] of [[1040, 420], [940, 540], [1110, 700]] as Pt[]) scene(ol(M(x, y) + Q(x - 16, y - 12, x - 14, y + 6) + 'Z' + M(x, y) + Q(x + 16, y - 12, x + 14, y + 6) + 'Z', '#c8352e', 1, -0.3), sh(circle(x, y, 3.5), '#a8242a'));
}
target('candy-cane', 'Candy cane', place(candyCane(64), { x: 918, y: 666, rot: 8 }));
target('snowman-ornament', 'Snowman ornament', place(snowmanOrnament(50), { x: 1080, y: 440 }));
target('pinecone', 'Pinecone', place(pinecone(44), { x: 965, y: 768 }));
target('star-topper', 'Gold star', place(starTopper(38), { x: TX, y: 152 }));
// tree skirt and presents
scene(sh(ellipse(TX, 960, 230, 34), '#a8342e'), sh(ellipse(TX, 960, 200, 26), '#fbf6ee', { opacity: 0.25 }), stroke(ellipse(TX, 960, 222, 30), '#fbf6ee', 4));
scene(place(present(110, 90, '#c8352e', H.gold, 1), { x: 880, y: 990 }), place(present(90, 120, '#2f6a4a', '#c8352e', 2), { x: 990, y: 990 }), place(present(120, 70, H.gold, '#3f6ab0', 3), { x: 1110, y: 980 }));
scene(place(present(80, 60, '#3f6ab0', '#fbf6ee', 0), { x: 820, y: 1050 }), place(present(70, 50, '#b83a6a', H.gold, 1), { x: 940, y: 1060 }), place(present(100, 80, '#e8e0cc', '#c8352e', 3), { x: 1060, y: 1074 }));
target('teddy', 'Teddy bear', place(teddy(124, '#b8844a', '#3f6ab0'), { x: 1150, y: 1120 }));

// =====================================================================
// toy train on the rug
// =====================================================================
{
  const cx = 600, cy = 1220, rx = 300, ry = 86;
  let ties = '';
  for (let i = 0; i < 48; i++) { const a = (i / 48) * Math.PI * 2; ties += line([[cx + Math.cos(a) * (rx - 14), cy + Math.sin(a) * (ry - 8)], [cx + Math.cos(a) * (rx + 14), cy + Math.sin(a) * (ry + 8)]]); }
  scene(stroke(ties, '#6e4a2a', 5), stroke(ellipse(cx, cy, rx - 8, ry - 5) + ellipse(cx, cy, rx + 8, ry + 5), '#9aa2a8', 2.4));
}
scene(place(trainCar(80, '#3f6ab0', '#c98f55'), { x: 820, y: 1166 }), place(trainCar(80, '#2f6a4a', '#e8e0cc'), { x: 720, y: 1146 }));
target('rocking-horse', 'Rocking horse', place(rockingHorse(110), { x: 600, y: 1210 }));
scene(place(trainCar(90, H.gold, '#c8352e'), { x: 800, y: 1294 }), place(trainCar(90, '#2f6a4a', '#8a5a34'), { x: 690, y: 1306 }));
target('toy-train', 'Toy train engine', place(trainEngine(120, '#c8352e'), { x: 568, y: 1308 }));

// =====================================================================
// armchair, side table, cocoa and cookies (left foreground)
// =====================================================================
{
  scene(shadow(170, 1400, 200, 24, 0.25));
  scene(ol(blob([[20, 1150], [30, 1000], [120, 960], [250, 980], [300, 1060], [300, 1160]], 0.8), '#7a2a2e', 1.4, -0.3));
  scene(stroke(curve([[90, 990], [100, 1080], [96, 1150]]) + curve([[170, 980], [172, 1080], [170, 1150]]) + curve([[240, 1000], [240, 1080], [236, 1150]]), '#5a1e22', 3));
  scene(ol(rect(0, 1150, 330, 130, 20), '#8a3236', 1.4, -0.3), ol(rect(30, 1130, 270, 50, 18), '#9a3a3e', 1.2, -0.3));
  scene(ol(rect(-20, 1100, 70, 230, 26), '#8a3236', 1.4, -0.3), ol(rect(270, 1100, 70, 230, 26), '#8a3236', 1.4, -0.3), sh(rect(280, 1104, 50, 14, 7) + rect(-10, 1104, 50, 14, 7), '#a8464a'));
  scene(sh(rect(10, 1280, 20, 40) + rect(300, 1280, 20, 40), '#4a2a1a'));
  scene(place(plaidThrow(140, 150, '#2f5a46', '#c8352e'), { x: 120, y: 1000 }));
  scene(ol(rect(130, 1060, 110, 80, 26), '#efe4cc', 1, -0.2), sh(star(185, 1100, 20, 8), '#c8352e'));
}
target('mitten', 'Red mitten', place(mitten(60, '#c8352e'), { x: 300, y: 1080, rot: -24 }));
{
  scene(shadow(340, 1470, 90, 12, 0.25), sh(rect(306, 1290, 14, 180) + rect(360, 1290, 14, 180), '#5a3a22'), sh(rect(300, 1400, 80, 10), '#5a3a22'), ol(ellipse(340, 1290, 96, 22), '#7a4a2a', 1, -0.3), sh(ellipse(340, 1286, 90, 18), '#8a5a34'));
  scene(sh(ellipse(340, 1290, 70, 16), '#fbf6ee', { opacity: 0.8 }), stroke(ellipse(340, 1290, 64, 13), '#c8352e', 1.2));
}
target('cocoa', 'Mug of cocoa', place(cocoaMug(70, '#2f6a4a'), { x: 290, y: 1294 }));
scene(place(plate(36, '#fbf6ea', '#c8352e', 0), { x: 384, y: 1282 }).map((p) => ({ ...p, d: place([p], { sy: 0.45, oy: 1282 })[0].d })));
scene(sh(ellipse(370, 1276, 14, 5) + ellipse(398, 1282, 14, 5), '#d9a860'), sh(ellipse(370, 1274, 12, 4) + ellipse(398, 1280, 12, 4), '#e8c080'));
target('gingerbread', 'Gingerbread man', place(gingerbread(46), { x: 388, y: 1264, rot: 10 }));

// =====================================================================
// foreground: wrapping paper, ribbon, open box, more presents and the sled
// =====================================================================
target('sled', 'Wooden sled', place(sled(200), { x: 420, y: 1012, rot: -4 }));
{
  // open box with tissue
  scene(ol(poly([[620, 1420], [800, 1420], [790, 1500], [630, 1500]]), '#c8352e', 1.2, -0.3), ol(poly([[600, 1420], [620, 1380], [800, 1380], [820, 1420]]), '#a8242a', 1, -0.3));
  scene(sh(blob([[630, 1400], [660, 1350], [700, 1370], [740, 1340], [780, 1376], [796, 1404]], 0.8), '#fbf6ee'), sh(blob([[650, 1404], [690, 1372], [730, 1384], [770, 1366], [786, 1406]], 0.8), '#f0e4f0'));
  // crumpled paper and loose ribbon
  scene(ol(blob([[500, 1440], [530, 1410], [570, 1420], [580, 1460], [540, 1480], [506, 1470]], 0.8), H.gold, 1, -0.3), stroke(curve([[512, 1450], [540, 1430], [566, 1450]]) + curve([[520, 1466], [546, 1452], [570, 1466]]), '#c8902a', 1.4));
  scene(ol(blob([[860, 1460], [890, 1420], [940, 1430], [960, 1470], [920, 1496], [870, 1490]], 0.8), '#3f6ab0', 1, -0.3), sh(star(910, 1456, 8, 3) + star(880, 1474, 6, 2.5) + star(936, 1440, 6, 2.5), '#fbf6ee'));
  scene(stroke(curve([[460, 1380], [520, 1350], [580, 1384], [640, 1360], [700, 1384]]), '#c8352e', 4), stroke(curve([[820, 1400], [880, 1370], [940, 1404], [1000, 1380]]), H.gold, 4));
  scene(place(present(130, 110, '#2f6a4a', H.gold, 3), { x: 1110, y: 1440 }), place(present(90, 70, '#c8352e', '#fbf6ee', 2), { x: 1000, y: 1480 }), place(present(70, 54, H.gold, '#c8352e', 1), { x: 1170, y: 1310 }));
  // slippers
  scene(ol(ellipse(80, 1450, 46, 18, -8), '#c8352e', 1), sh(ellipse(96, 1446, 24, 10, -8), '#fbf6ee'), ol(ellipse(140, 1470, 46, 18, 6), '#c8352e', 1), sh(ellipse(156, 1468, 24, 10, 6), '#fbf6ee'));
}
void ellipse; void rect;

const activity: FindActivity = {
  id: ID, version: 1, mode: 'find', title: 'Christmas Morning',
  blurb: 'Stockings are full, the fire is crackling and sixteen little treasures are tucked around the tree and the hearth.',
  collectionId: 'holidays', categories: ["Holidays"], difficulty: 'Detailed',
  season: { from: '12-01', to: '12-31', label: 'Christmas' },
  width: W, height: HT, defs, items,
};
export default activity;
