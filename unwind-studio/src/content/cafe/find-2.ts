import { rect, ellipse, circle, poly, line, curve, blob, leaf, sh, stroke, place, shade, rng, linearGradient } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { FindActivity, FindItem } from '../types';
import { ol, shadow, mug, jar, plate, bowl, croissant, flowerVase, herbPot, tiles, fryingPan, utensil, kettle, bottle, pile, basket, teaTowel, cookPot } from '../kitchen/props-find';
import { bookStack, fern, leafy } from '../library/props';
import {
  K, woodFloor, frenchPress, pancakes, carafe, friedEgg, toast, pineapple, avocado, wateringCan, sunglasses, helmet, instantCamera, yarnBall, slippers, toaster, mokaPot,
  fridge, sofa, cushion, bicycle, recordPlayer, recordSleeve, cityView, artPrint, monstera, snakePlant, hangingPlant, cactus, floorLamp, wallShelf, paperback, tumbler, heart,
} from './props-find';

const ID = 'cafe-find-2';
const W = 1200, H = 1500;
const items: FindItem[] = [];
const scene = (...s: (Shape | Shape[])[]) => { items.push({ shapes: s.flat() }); };
const target = (id: string, name: string, shapes: Shape[]) => { items.push({ id, name, target: true, shapes }); };
const at = (s: Shape[], x: number, y: number, k = 1, rot = 0) => place(s, { x, y, s: k, rot });

const defs = linearGradient(`${ID}-sky`, [[0, '#8fc0e0'], [0.7, '#c4e0ee'], [1, '#eaf2ee']]);

// =====================================================================
// walls
// =====================================================================
scene(sh(rect(0, 0, W, 830), '#efe6d2'));
scene(sh(rect(560, 0, 640, 830), '#dfe6d8'));
{
  // soft vertical texture on the living wall
  let t = '';
  for (let x = 580; x < W; x += 40) t += rect(x, 0, 18, 830);
  scene(sh(t, '#ffffff', { opacity: 0.12 }));
}
scene(sh(rect(0, 0, W, 22), '#fbf6ec'), sh(rect(0, 22, W, 6), '#d9cfb8'));
scene(sh(rect(0, 800, W, 30), '#fbf6ec'), sh(rect(0, 800, W, 4), '#d9cfb8'));

// =====================================================================
// open kitchen (left)
// =====================================================================
scene(tiles(176, 300, 380, 222, 37, ['#f6f0e2', '#eef2ec', '#f3ede0'], '#d6ccb4', 5, '#7fb0b0'));
// upper cabinets
{
  scene(ol(rect(176, 80, 380, 210, 4), '#9cb4a0', 1.4, -0.3));
  for (let i = 0; i < 4; i++) scene(stroke(rect(186 + i * 92, 92, 82, 186, 3), '#7f9a84', 2), sh(rect(256 + i * 92, 240, 6, 24, 3), '#c9a24a'));
  scene(sh(rect(170, 70, 392, 14, 3), '#b4c8b4'), sh(rect(176, 290, 380, 8), '#000000', { opacity: 0.12 }));
}
// rail with pans and utensils
scene(sh(rect(200, 338, 200, 6, 3), K.chromeDk));
scene(at(fryingPan(30, '#3b3532'), 230, 344), at(utensil(110, 0, '#c98f55', '#c98f55'), 280, 344), at(utensil(116, 2, K.chrome), 312, 344), at(utensil(100, 3, K.chrome), 344, 344), at(utensil(104, 1, K.chrome), 374, 344));
scene(at(wallShelf(130), 416, 380));
scene(at(jar(26, 36, '#e0b04a', 1, K.chrome), 436, 380), at(jar(26, 40, '#8a5a3a', 1, K.chrome), 468, 380), at(herbPot(30, 4), 510, 380));
// counter
scene(sh(rect(170, 520, 392, 20, 2), '#e8e0cf'), sh(rect(170, 520, 392, 5, 2), '#ffffff', { opacity: 0.6 }));
{
  scene(sh(rect(176, 540, 380, 262), '#9cb4a0'));
  scene(stroke(rect(188, 556, 110, 232, 3) + rect(306, 556, 120, 100, 3) + rect(306, 664, 120, 124, 3) + rect(434, 556, 112, 232, 3), '#7f9a84', 2));
  scene(sh(rect(280, 660, 6, 30, 3) + rect(354, 600, 26, 6, 3) + rect(354, 720, 26, 6, 3) + rect(446, 660, 6, 30, 3), '#c9a24a'));
  scene(at(teaTowel(40, 70, '#fbf3df', K.red), 488, 572));
}
// stove burners on the right of the counter
scene(sh(rect(400, 514, 140, 8, 2), '#3b3532'));
// on the counter
target('toaster', 'Toaster', at(toaster(84, '#9cc4c0'), 236, 520));
scene(sh(ellipse(324, 518, 42, 6), '#a8743e'), ol(rect(290, 500, 70, 16, 4), '#c99868', 1, -0.3));
scene(at(utensil(80, 0, '#c98f55', '#c98f55'), 372, 446), ol(rect(360, 480, 30, 40, 6), '#f0e6d4', 1, -0.25));
target('moka-pot', 'Moka pot', at(mokaPot(70), 430, 514));
scene(at(kettle(64, '#d8452f'), 500, 514));
// fridge
scene(at(fridge(160, 640, '#eef2ee', 7), 12, 168));
scene(at(cactus(54, '#e8e0cf'), 50, 168), at(basket(70, 30, '#c99a5b'), 120, 140), at(pile(60, 10, ['apple', 'orange', 'greenapple'], 3, 1), 120, 140));
// hanging plant at the kitchen edge
scene(at(hangingPlant(120, 80, 9, '#f0e6d4'), 580, 28));

// =====================================================================
// big window onto the brick buildings
// =====================================================================
{
  const x0 = 620, y0 = 96, w = 320, h = 430;
  scene(sh(rect(x0, y0, w, h), `url(#${ID}-sky)`));
  scene(cityView(x0, y0 + 30, w, h - 30, 21, false, `url(#${ID}-sky)`));
  // water tower on the rooftop
  scene(sh(rect(x0 + 220, y0 + 30, 60, 56, 4), '#8a6a50'), sh(poly([[x0 + 214, y0 + 32], [x0 + 286, y0 + 32], [x0 + 250, y0 + 6]]), '#5a4434'), stroke(line([[x0 + 226, y0 + 86], [x0 + 222, y0 + 112]]) + line([[x0 + 274, y0 + 86], [x0 + 278, y0 + 112]]) + line([[x0 + 226, y0 + 96], [x0 + 274, y0 + 106]]), '#5a4434', 2.5));
  scene(sh(ellipse(x0 + 80, y0 + 40, 36, 10) + ellipse(x0 + 110, y0 + 34, 26, 9), '#ffffff', { opacity: 0.85 }));
  // frame
  scene(sh(rect(x0 - 16, y0 - 16, w + 32, 16) + rect(x0 - 16, y0, 16, h) + rect(x0 + w, y0, 16, h) + rect(x0 + w / 2 - 6, y0, 12, h) + rect(x0, y0 + h * 0.48, w, 12), '#fbf6ec'), stroke(rect(x0 - 16, y0 - 16, w + 32, h + 16), '#d9cfb8', 2));
  scene(sh(poly([[x0 + 30, y0], [x0 + 70, y0], [x0 + 20, y0 + h], [x0 - 20, y0 + h]]), '#ffffff', { opacity: 0.12 }));
  // sill
  scene(sh(rect(x0 - 30, y0 + h, w + 60, 18, 3), '#fbf6ec'), sh(rect(x0 - 30, y0 + h + 18, w + 60, 6), '#000000', { opacity: 0.1 }));
  scene(at(herbPot(40, 11, K.terracotta), x0 + 30, y0 + h), at(succ(), x0 + 90, y0 + h), at(herbPot(36, 13, '#3f7f7a'), x0 + 250, y0 + h), at(cactus(48, '#f0e6d4'), x0 + 300, y0 + h));
  scene(at(bookStack(0, 0, 54, 3, rng(4)).shapes, x0 + 170, y0 + h));
  // sheer curtains
  scene(sh(poly([[x0 - 50, y0 - 30], [x0 + 10, y0 - 30], [x0 - 4, y0 + h + 20], [x0 - 60, y0 + h + 20]]), '#fbf6ec', { opacity: 0.85 }), stroke(line([[x0 - 34, y0 - 26], [x0 - 44, y0 + h + 16]]) + line([[x0 - 14, y0 - 26], [x0 - 22, y0 + h + 16]]), '#d9cfb8', 2));
  scene(sh(poly([[x0 + w - 10, y0 - 30], [x0 + w + 50, y0 - 30], [x0 + w + 60, y0 + h + 20], [x0 + w + 4, y0 + h + 20]]), '#fbf6ec', { opacity: 0.85 }), stroke(line([[x0 + w + 14, y0 - 26], [x0 + w + 22, y0 + h + 16]]) + line([[x0 + w + 34, y0 - 26], [x0 + w + 44, y0 + h + 16]]), '#d9cfb8', 2));
  scene(sh(rect(x0 - 70, y0 - 36, w + 140, 8, 4), '#3b3532'), sh(circle(x0 - 70, y0 - 32, 7) + circle(x0 + w + 70, y0 - 32, 7), '#3b3532'));
}
function succ(): Shape[] { return at(leafy(rng(3), 50, 34, 26, '#d98a7a', 7), 0, 0); }

// =====================================================================
// right wall: art, the bike and the record corner
// =====================================================================
scene(at(artPrint(90, 120, 0, '#2b2622'), 1000, 60), at(artPrint(70, 90, 3, '#c9a46a', '#f3ead6'), 1110, 76));
// wall hooks and bike
scene(sh(rect(1000, 330, 10, 26, 3) + rect(1160, 330, 10, 26, 3), '#3b3532'));
scene(at(bicycle(42, K.teal), 1085, 420));
target('bike-helmet', 'Bike helmet', at(helmet(64, K.mustard), 1120, 400, 1, 12));
// credenza with the record player
{
  scene(ol(rect(970, 620, 222, 186, 6), '#b98552', 1.2, -0.35), stroke(rect(982, 640, 96, 150, 3) + rect(1088, 640, 94, 150, 3), '#8a5a34', 2), sh(rect(1066, 704, 6, 24, 3) + rect(1094, 704, 6, 24, 3), '#3b3532'));
  scene(sh(rect(982, 806, 10, 20) + rect(1170, 806, 10, 20), '#5a3a22'));
  target('record-player', 'Record player', at(recordPlayer(140, '#c98a5a'), 1050, 620));
  scene(at(snakePlant(100, 12, '#3b3532'), 1160, 620));
}
scene(at(recordSleeve(70, '#3f7f7a', '#f3d77a', 1), 940, 832, 1, -8), at(recordSleeve(70, '#fbf6ec', K.red, 2), 960, 834, 1, -4), at(recordSleeve(70, K.mustard, K.navy, 3), 982, 836));

// =====================================================================
// floor and living area
// =====================================================================
scene(woodFloor(830, H, W, ['#d4a878', '#c99c6a', '#ddb486', '#c29060'], 41));
scene(sh(rect(0, 830, W, 12), '#000000', { opacity: 0.12 }));
scene(sh(ellipse(780, 930, 360, 70), '#f0e2c8'), stroke(ellipse(780, 930, 330, 60), '#3f7f7a', 4), stroke(ellipse(780, 930, 300, 52), '#d98a7a', 2));
scene(at(floorLamp(360, '#f3e2b8', '#2b2622'), 590, 880));
scene(at(sofa(440, '#6f8fa6'), 790, 892));
scene(at(cushion(64, K.mustard, '#fbf6ec', 1, -10), 640, 780), at(cushion(60, '#fbf6ec', K.teal, 2, 4), 940, 782), at(cushion(56, K.rose, '#fbf6ec', 0, 12), 880, 790));
// knitted throw over the arm
scene(sh(poly([[994, 740], [1030, 740], [1034, 860], [1000, 864]]), '#e8b4a0'), stroke(line([[1000, 760], [1030, 760]]) + line([[1000, 790], [1032, 790]]) + line([[1001, 820], [1033, 820]]), '#fbf6ec', 3));
target('yarn', 'Ball of yarn', at(yarnBall(24, '#9a7ac4'), 700, 816));
// coffee table
scene(shadow(760, 980, 130, 10, 0.2), sh(rect(660, 940, 10, 40) + rect(850, 940, 10, 40), K.woodDk), ol(rect(640, 924, 240, 20, 6), '#3b3532', 1), sh(rect(640, 924, 240, 5, 3), '#5a5250'));
target('sunglasses', 'Sunglasses', at(sunglasses(60, '#2b2622', '#3a5a6a'), 700, 912, 1, -6));
scene(at(paperback(44, K.teal), 790, 914, 1, 6), at(mug(26, '#fbf6ec', K.mustard), 846, 924));
target('watering-can', 'Watering can', at(wateringCan(70, '#e0a83a'), 1140, 912));
scene(at(monstera(240, 5, '#f0e6d4', 0.4), 70, 960));
// crate of books and a floor cushion
{
  scene(ol(rect(110, 1020, 140, 90, 4), '#c99a5b', 1.2, -0.35), stroke(line([[110, 1050], [250, 1050]]) + line([[110, 1080], [250, 1080]]), '#a8743e', 2));
  scene(at(bookStack(0, 0, 60, 3, rng(17)).shapes, 150, 1020), at(leafy(rng(5), 60, 40, 30, '#3f7f7a', 7), 215, 1020));
  scene(ol(ellipse(600, 1012, 64, 20), '#d98a7a', 1, -0.3), ol(ellipse(600, 1000, 60, 18), '#e8a08a', 1, -0.3), stroke(ellipse(600, 1000, 36, 10), '#fbf6ec', 2));
}

// =====================================================================
// dining table with Sunday brunch (foreground)
// =====================================================================
// chairs on the far side
for (const x of [330, 870]) {
  scene(sh(rect(x - 70, 960, 12, 180) + rect(x + 58, 960, 12, 180), '#3b3532'), ol(rect(x - 74, 944, 148, 22, 6), '#3b3532', 1), sh(rect(x - 60, 990, 120, 10, 3) + rect(x - 60, 1030, 120, 10, 3), '#3b3532'));
}
{
  const back = 1120, front = 1250;
  scene(sh(rect(60, 1330, 1080, 170), '#c9d8c8'), stroke(line([[60, 1350], [1140, 1350]]) + line([[60, 1480], [1140, 1480]]), '#fbf6ec', 5), stroke(line([[60, 1362], [1140, 1362]]) + line([[60, 1468], [1140, 1468]]), '#7fb0b0', 2));
  {
    let d = '';
    for (let x = 100; x < 1120; x += 60) d += poly([[x, 1415], [x + 30, 1395], [x + 60, 1415], [x + 30, 1435]]);
    scene(stroke(d, '#e8b4a0', 2));
  }
  scene(sh(rect(110, 1270, 30, 230, 4) + rect(1060, 1270, 30, 230, 4), '#8a5a34'));
  target('slippers', 'Slippers', at(slippers(76, '#9cb4c8'), 620, 1420, 1, -12));
  scene(at(basket(120, 50, '#c99a5b'), 860, 1410), sh(rect(820, 1380, 80, 30, 6), '#e8b4a0'), sh(rect(840, 1370, 70, 20, 6), '#9cc4c0'));
  scene(at(fern(rng(9), 110, 70, 56, K.terracotta, 11), 310, 1490));
  scene(shadow(600, 1490, 480, 12, 0.18));
  const top = poly([[150, back], [1050, back], [1120, front], [80, front]]);
  let grain = '';
  const g = rng(3);
  for (let i = 0; i < 16; i++) { const t = g.range(0.03, 0.97); grain += curve([[150 + 900 * t, back + 4], [115 + 970 * t, (back + front) / 2], [80 + 1040 * t, front - 4]]); }
  scene(sh(top, '#d9b07a'), stroke(grain, '#b98552', 1, { opacity: 0.5 }), sh(rect(74, front, 1052, 28, 3), '#b98552'), sh(rect(74, front, 1052, 5, 2), '#e8c898'), sh(rect(74, front + 28, 1052, 6), '#000000', { opacity: 0.2 }));
  // linen runner
  scene(sh(poly([[160, 1160], [1040, 1160], [1060, 1210], [140, 1210]]), '#f6efe0'), stroke(line([[160, 1166], [1040, 1166]]) + line([[142, 1204], [1058, 1204]]), '#7fb0b0', 2));
  // back row
  scene(at(flowerVase(90, 5, '#f6efe0', ['#f29bb5', '#f3d77a', '#fbf6ec', '#9a7ac4']), 600, 1150));
  target('french-press', 'French press', at(frenchPress(100), 450, 1152));
  scene(at(carafe(96, '#f2a23a'), 740, 1152), at(tumbler(50, '#f2a23a'), 800, 1160), at(tumbler(50, '#f2a23a'), 380, 1160));
  target('pineapple', 'Pineapple', at(pineapple(130), 960, 1156));
  scene(at(pile(110, 14, ['apple', 'orange', 'greenapple', 'plum'], 7, 2), 220, 1150), at(bowl(124, 40, '#fbf6ec', K.teal), 220, 1172));
  // front row
  target('pancakes', 'Pancakes', at(pancakes(130, 4), 300, 1244));
  scene(ol(ellipse(540, 1226, 74, 16), '#fbf6ec', 1, -0.2), sh(ellipse(540, 1226, 56, 11), '#efe6d4'));
  scene(at(friedEgg(26), 516, 1222, 1), at(toast(46), 572, 1222));
  scene(sh(ellipse(740, 1230, 64, 14), '#a8743e'), sh(ellipse(740, 1226, 62, 12), '#d4a26c'));
  target('avocado', 'Avocado', at(avocado(56), 726, 1216, 1, -70));
  scene(at(croissant(40), 776, 1222));
  scene(at(basket(110, 34, '#c99a5b'), 930, 1206), at(croissant(44), 910, 1198), at(croissant(40), 952, 1200));
  scene(at(mug(36, K.red, '#fbf6ec'), 640, 1252), at(mug(36, '#fbf6ec', K.teal), 1060, 1248), at(mug(36, K.mustard, '#fbf6ec'), 150, 1248));
  scene(at(plate(22, '#fbf6ec', K.teal, 2), 420, 1236), at(plate(22, '#fbf6ec', K.rose, 0), 860, 1240));
  target('instant-camera', 'Instant camera', at(instantCamera(64, '#efe6d4', K.red), 1040, 1200, 1, 8));
  scene(stroke(curve([[440, 1040], [430, 1010], [444, 980]]) + curve([[460, 1040], [470, 1012], [456, 984]]), '#ffffff', 2.4, { opacity: 0.6 }));
}
void blob; void leaf; void ellipse; void circle; void line; void shade; void heart; void cookPot; void bottle; void K; void tumbler;

const activity: FindActivity = {
  id: ID, version: 1, mode: 'find', title: 'Sunday at the Apartment',
  blurb: 'A slow Sunday brunch in a sunny city flat, with an open kitchen, a bike on the wall and records waiting to be played.',
  collectionId: 'cafe', categories: ["Friends", "Cozy"], difficulty: 'Relaxed',
  width: W, height: H, defs, items,
};
export default activity;
