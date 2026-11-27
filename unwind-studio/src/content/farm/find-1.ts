import { rect, ellipse, circle, line, curve, blob, waveBand, sh, stroke, place, rng, linearGradient, radialGradient } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { FindActivity, FindItem } from '../types';
import { cloud, grassTufts, tree, flyingGull, wateringCan, wheelbarrow, hayBale, basket, basketHandle, sunflower, butterfly, boots, potted, pumpkin, shadow } from '../seasons/props-find';
import { pile, cabbage } from '../kitchen/props-find';
import {
  F, bush, wildflowers, cropRows, railFence, picketFence, haystack, hayPile, strewnStraw, farmhouse, henHouse, barnFar, windPump, tractor, well, weathervane,
  chicken, chick, pig, sheep, cow, sleepyDog, duck, milkChurn, bucket, trough, strawHat, pitchfork, horseshoe, shirt, socks, sheet, dungarees,
} from './props-find';

const ID = 'farm-find-1';
const W = 1200, H = 1500;
const items: FindItem[] = [];
const scene = (...s: (Shape | Shape[])[]) => { items.push({ shapes: s.flat() }); };
const target = (id: string, name: string, shapes: Shape[]) => { items.push({ id, name, target: true, shapes }); };
const at = (s: Shape[], x: number, y: number, k = 1, rot = 0, flip = false) => place(s, { x, y, sx: flip ? -k : k, sy: k, rot });

const defs =
  linearGradient(`${ID}-sky`, [[0, '#9fb4d6'], [0.35, '#e9c3c0'], [0.7, '#fbd9a0'], [1, '#fff0c4']]) +
  radialGradient(`${ID}-sun`, [[0, '#fff6d0'], [0.35, '#ffe08a'], [1, '#ffe08a00']]) +
  linearGradient(`${ID}-yard`, [[0, '#a9c46c'], [0.5, '#93b25c'], [1, '#7da04e']]) +
  linearGradient(`${ID}-path`, [[0, '#ecd9a8'], [1, '#d9bd84']]);

// =====================================================================
// dawn sky
// =====================================================================
scene(sh(rect(0, 0, W, 600), `url(#${ID}-sky)`));
scene(sh(circle(700, 470, 330), `url(#${ID}-sun)`, { opacity: 0.9 }));
{
  let rays = '';
  for (let i = 0; i < 11; i++) { const a = ((200 + i * 14) * Math.PI) / 180; rays += `M700 470L${(700 + Math.cos(a - 0.035) * 620).toFixed(1)} ${(470 + Math.sin(a - 0.035) * 620).toFixed(1)}L${(700 + Math.cos(a + 0.035) * 620).toFixed(1)} ${(470 + Math.sin(a + 0.035) * 620).toFixed(1)}Z`; }
  scene(sh(rays, '#fff3c4', { opacity: 0.16 }));
}
scene(sh(circle(700, 470, 62), '#fff1b8'), sh(circle(700, 470, 50), '#ffe08a'));
scene(sh(cloud(200, 130, 1.3), '#f8d6cc'), sh(cloud(190, 140, 1.0), '#fdeee0'), sh(cloud(930, 190, 1.5), '#f6cfc0'), sh(cloud(950, 200, 1.1), '#fdebd8'));
scene(sh(cloud(560, 80, 0.8), '#e9cfd6'), sh(cloud(1100, 70, 0.7), '#e6d0dc'), sh(cloud(420, 250, 0.6), '#fde6c8'), sh(cloud(70, 300, 0.7), '#fbe0c0'));
scene([0, 1, 2, 3, 4].map((i) => place([flyingGull(9 + (i % 3) * 2, '#6a5a6a')], { x: 330 + i * 46 + (i % 2) * 20, y: 190 - i * 14 + (i % 2) * 30 })).flat().concat(place([flyingGull(12, '#6a5a6a')], { x: 860, y: 110 })));

// =====================================================================
// distant hills and fields
// =====================================================================
scene(sh(waveBand(0, W, 478, 16, 700, 620, 0.6), '#a9b6c4'), sh(waveBand(0, W, 500, 14, 520, 620, 2.2), '#9db39a'));
scene(sh(waveBand(0, W, 530, 12, 900, 640, 1.2), '#a8c078'));
// patchwork fields
scene(sh(blob([[500, 545], [640, 532], [760, 540], [760, 600], [500, 600]], 0.5), '#e6cf7a'), cropRows(500, 760, 538, 600, 700, 14, '#c9a84a', 1.4));
scene(sh(blob([[770, 540], [900, 528], [1010, 536], [1010, 600], [770, 600]], 0.5), '#8fb26a'), cropRows(770, 1010, 534, 600, 700, 12, '#6f964e', 1.4));
scene(sh(blob([[1020, 536], [1120, 524], [1200, 530], [1200, 600], [1020, 600]], 0.5), '#d9b860'), cropRows(1020, 1200, 530, 600, 700, 9, '#b8963e', 1.4));
scene(at(bush(3, 250, 26, ['#6f9a52', '#5f8a45', '#7fa35a']), 640, 540), at(bush(5, 180, 22, ['#6f9a52', '#5f8a45']), 1100, 530), at(bush(8, 120, 20, ['#5f8a45', '#7fa35a']), 890, 532));
scene(at(windPump(120), 1125, 548), at(barnFar(84), 960, 556));
scene(at(tree(11, 40, ['#5f8a45', '#7fa35a', '#8fb25c'], '#6b4a32'), 868, 558), at(tree(12, 34, ['#5f8a45', '#7fa35a'], '#6b4a32'), 1050, 552));
scene(at(haystack(34), 1150, 590), at(haystack(28), 1182, 596), at(tractor(62), 830, 598));
scene(at(sheep(30), 560, 584), at(sheep(26), 600, 592, 1, 0, true), at(sheep(24), 528, 594), at(cow(44), 1060, 600), at(cow(40, '#b98552', '#7a4a2a'), 1004, 606, 1, 0, true));

// =====================================================================
// farmyard ground
// =====================================================================
scene(sh(rect(0, 596, W, H - 596), `url(#${ID}-yard)`), sh(waveBand(0, W, 600, 5, 300, 640, 0.4), '#b4cc74'));
// winding dirt path and yard
scene(sh(blob([[430, 1510], [470, 1300], [420, 1150], [300, 1040], [180, 960], [150, 880], [330, 868], [470, 900], [620, 870], [800, 880], [1000, 868], [1130, 900], [1140, 960], [960, 1000], [780, 1040], [690, 1130], [700, 1300], [760, 1510]], 0.7), `url(#${ID}-path)`));
scene(sh(blob([[470, 1300], [440, 1170], [330, 1060], [210, 980], [300, 1010], [470, 1120], [520, 1290]], 0.8), '#f4e6bc', { opacity: 0.5 }));
{
  const g = rng(21);
  let st = '', st2 = '';
  for (let i = 0; i < 70; i++) { const x = g.range(180, 1100), y = g.range(880, 1480); const d = ellipse(x, y, g.range(3, 7), g.range(1.6, 3), g.range(-20, 20)); if (i % 2) st += d; else st2 += d; }
  scene(sh(st, '#c9a86a', { opacity: 0.55 }), sh(st2, '#f6ecd0', { opacity: 0.6 }));
}
scene(grassTufts(0, 610, W, 260, 60, 4, ['#7fa04e', '#9cba60', '#6b8f45'], 10));
scene(wildflowers(500, 620, 700, 60, 26, 9, ['#fbf6ec', '#f6d04a', '#e8607a'], 3.2));

// big tree behind the house and one at the right edge
scene(at(tree(31, 190, ['#4f7a3f', '#5f8a45', '#7fa35a', '#93b25c'], '#6b4a32'), 26, 800));
scene(at(tree(34, 150, ['#5f8a45', '#7fa35a', '#a9c46c'], '#6b4a32', { cols: ['#d8452f', '#e8862e'], count: 16, size: 6 }), 1168, 760));

// =====================================================================
// farmhouse (left)
// =====================================================================
scene(sh(ellipse(250, 852, 270, 16), '#3b2a1c', { opacity: 0.2 }));
scene(at(farmhouse(430), 250, 850));
target('weathervane', 'Weathervane', at(weathervane(96), 132, 466));
{
  // chimney smoke
  scene(stroke(curve([[372, 410], [362, 380], [384, 350], [370, 318], [392, 288]]), '#fbf3e6', 9, { opacity: 0.6 }), stroke(curve([[378, 400], [392, 366], [372, 338], [396, 300]]), '#fbf3e6', 5, { opacity: 0.45 }));
}
scene(at(boots(40, '#3f7f7a'), 150, 902), at(potted(34, '#c8693f', 'geranium', '#e8607a', 3), 100, 902), at(potted(30, '#c8693f', 'daisy', '#fbf6ec', 5), 404, 904));
target('dog', 'Sleepy dog', at(sleepyDog(136), 330, 936));

// front garden with a picket fence
scene(wildflowers(0, 950, 180, 34, 22, 14, ['#e8607a', '#f4a6b8', '#fbf6ec', '#b48ad6'], 5));
scene(at(sunflower(46, 120), 34, 990), at(sunflower(40, 96), 84, 992), at(sunflower(42, 134), 150, 990));
scene(at(picketFence(196, 62, 22), 0, 1000));
scene(grassTufts(0, 990, 220, 30, 12, 7, ['#6b8f45', '#7fa04e'], 12));

// =====================================================================
// fence with the rooster, in front of the sunrise
// =====================================================================
scene(at(railFence(330, 76, 82), 520, 702));
target('rooster', 'Rooster', at(chicken(104, '#b8562a', true), 688, 624));
scene(grassTufts(510, 692, 350, 16, 14, 17, ['#6b8f45', '#7fa04e'], 12));

// =====================================================================
// hen house (right)
// =====================================================================
scene(at(henHouse(220), 968, 858));
target('horseshoe', 'Horseshoe', at(horseshoe(30), 968, 724));
scene(strewnStraw(820, 860, 330, 70, 40, 5));
scene(at(chicken(64, '#fbf6ec'), 846, 892), at(chicken(60, '#c9783a'), 1100, 900, 1, 0, true), at(chicken(56, '#3b3430'), 1150, 872), at(chicken(52, '#d9b07a'), 884, 806, 1, -20));
scene(at(chicken(66, '#c9783a'), 760, 950), at(chick(22), 716, 958), at(chick(20), 688, 966), at(chick(21), 800, 968, 1, 0, true));
{
  // scattered grain
  const g = rng(8);
  let gr = '';
  for (let i = 0; i < 40; i++) gr += circle(g.range(700, 900), g.range(930, 990), 1.6);
  scene(sh(gr, '#e8c55e'));
}

// =====================================================================
// well (centre)
// =====================================================================
scene(at(well(240), 620, 1010));
scene(stroke(line([[606, 868], [606, 902]]), '#a88a52', 2.2), at(bucket(34, '#a8774a'), 606, 950));
scene(grassTufts(520, 1000, 210, 16, 10, 3, ['#6b8f45', '#7fa04e'], 13));

// milk churns waiting by the path
target('milk-churns', 'Milk churns', [...at(milkChurn(104), 452, 1128), ...at(milkChurn(88), 512, 1140), ...at(milkChurn(110), 398, 1150)]);

// =====================================================================
// washing line (right)
// =====================================================================
scene(sh(rect(722, 930, 12, 250, 3) + rect(1166, 920, 12, 250, 3), '#8a6238'), sh(rect(708, 936, 40, 8, 2) + rect(1152, 926, 40, 8, 2), '#a8774a'), shadow(730, 1180, 26, 5), shadow(1172, 1170, 26, 5));
scene(stroke(curve([[728, 940], [950, 968], [1172, 930]]), '#f3ead6', 2));
scene(at(sheet(96, 132, '#fbf6ec', '#6f8fd6'), 800, 952, 1, 3));
scene(at(shirt(84, '#d8452f', '#fbf6ec'), 902, 964, 1, 2));
target('socks', 'Red socks', at(socks(58, '#c8322a'), 984, 966));
scene(at(dungarees(60), 1056, 962, 1, -2));
scene(at(shirt(70, '#f6d98a'), 1126, 950, 1, -4));
scene(at(basket(74, 40, '#c99a5b'), 770, 1196), sh(blob([[740, 1158], [760, 1146], [790, 1150], [802, 1160]], 0.9), '#fbf6ec'), sh(blob([[752, 1158], [770, 1150], [786, 1158]], 0.9), '#f4a6b8'));

// =====================================================================
// left foreground: egg basket, veg patch, wheelbarrow, watering can
// =====================================================================
scene(hayBale(150, 74, 6).map((p) => place([p], { x: 44, y: 1216 })[0]));
target('eggs', 'Basket of eggs', [...at(basketHandle(84, 40), 126, 1142), ...at(pile(74, 10, ['egg', 'brownegg'], 4, 2), 126, 1108), ...at(basket(84, 40), 126, 1142)]);
scene(strewnStraw(20, 1210, 240, 30, 22, 12));
{
  // vegetable patch
  scene(sh(blob([[-10, 1290], [150, 1268], [330, 1280], [360, 1330], [330, 1372], [-10, 1380]], 0.6), '#8a6238'));
  let fur = '';
  for (let i = 0; i < 4; i++) fur += curve([[0, 1298 + i * 22], [170, 1284 + i * 22], [340, 1298 + i * 22]]);
  scene(stroke(fur, '#6f4a2c', 2, { opacity: 0.6 }));
  for (let i = 0; i < 6; i++) scene(at(cabbage(19, 20 + i), 34 + i * 56, 1302 + (i % 2) * 4));
  for (let i = 0; i < 5; i++) scene(at(cabbage(21, 40 + i), 60 + i * 58, 1346 - (i % 2) * 4));
}
target('wheelbarrow', 'Wheelbarrow', [...at(hayPile(120, 50, 3), 170, 1404), ...at(wheelbarrow(190, '#5c8a6a'), 176, 1486)]);
scene(at(pumpkin(60), 40, 1470), at(pumpkin(46, '#f0a03a'), 96, 1486));
target('watering-can', 'Watering can', at(wateringCan(96, '#5a86b8'), 372, 1470));
scene(grassTufts(250, 1380, 200, 110, 14, 23, ['#6b8f45', '#7fa04e', '#5f8a45'], 16));
scene(wildflowers(250, 1220, 180, 60, 14, 31, ['#fbf6ec', '#f6d04a', '#b48ad6'], 5));

// duck pond puddle on the path
scene(sh(ellipse(580, 1410, 96, 30), '#8fb8c8'), sh(ellipse(574, 1406, 80, 22), '#a8cede'), stroke(curve([[530, 1404], [560, 1398], [590, 1404]]) + curve([[570, 1418], [600, 1412], [630, 1418]]), '#eaf6fa', 1.6, { opacity: 0.8 }));
scene(at(duck(70), 566, 1404), at(duck(54), 640, 1436, 1, 0, true));
target('butterfly', 'Butterfly', at(butterfly(44, '#e8862e'), 560, 1236, 1, 18));
scene(wildflowers(500, 1250, 130, 40, 10, 44, ['#e8607a', '#fbf6ec', '#f6d04a'], 5));

// =====================================================================
// pig pen (right foreground)
// =====================================================================
scene(sh(blob([[720, 1262], [960, 1250], [1200, 1262], [1210, 1510], [700, 1510], [690, 1380]], 0.5), '#8a6644'));
scene(sh(blob([[760, 1330], [900, 1300], [1100, 1310], [1180, 1380], [1140, 1470], [900, 1490], [760, 1450]], 0.9), '#75553a'), sh(blob([[820, 1370], [960, 1340], [1080, 1372], [1040, 1440], [880, 1450]], 0.9), '#684a32', { opacity: 0.7 }));
scene(at(railFence(500, 84, 100), 704, 1272));
target('straw-hat', 'Straw hat', at(strawHat(74), 1004, 1190));
target('pitchfork', 'Pitchfork', at(pitchfork(210), 740, 1300, 1, -13));
scene(at(trough(140), 800, 1346));
target('pig', 'Mother pig', at(pig(200, F.pink, true), 930, 1436));
scene(at(pig(88), 1100, 1380, 1, 0, true), at(pig(80, '#f4bdb0'), 1130, 1470), at(pig(74, '#eaa69a'), 1010, 1492, 1, 0, true));
scene(strewnStraw(720, 1290, 460, 40, 26, 51));
{
  // side rails of the pen running towards us
  scene(stroke(line([[706, 1210], [690, 1340], [672, 1500]]) + line([[706, 1242], [692, 1372], [676, 1500]]), '#8f6238', 7), sh(rect(680, 1330, 16, 110, 3), '#a8774a'), sh(rect(680, 1326, 16, 6, 2), '#caa06c'));
}
scene(grassTufts(600, 1300, 90, 190, 12, 61, ['#6b8f45', '#7fa04e', '#5f8a45'], 16));
void line; void F;

const activity: FindActivity = {
  id: 'farm-find-1', version: 1, mode: 'find', title: 'Farmyard at Dawn', blurb: 'The rooster greets the sunrise while the dog dozes, the hens scratch and thirteen farmyard things wait to be found.',
  collectionId: 'farm', categories: ["Countryside", "Animals"], difficulty: 'Relaxed',
  added: '2026-11-26',
  width: W, height: H, defs, items,
};
export default activity;
