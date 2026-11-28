import { blob, circle, curve, ellipse, leaf, line, poly, rect, xf } from '../../art/kit';
import type { PaintActivity } from '../types';
import { W, H, band, barn, canvas, edged, flower, plume, post, puff, soft, type Pt } from './props-paint';

const c = canvas();
const { R, D } = c;

// ---------------------------------------------------------------- sunrise sky
R('sky', rect(0, 0, W, H), 'sky');
R('sky-peach', edged([[0, 318], [250, 308], [520, 320], [780, 306], [1000, 316]]), 'peach');
R('sun-halo', circle(760, 700, 240), 'glow');
R('sun', circle(760, 700, 152), 'gold');
R('cloud-1', puff(200, 120, 150, 46, 6, 0, true), 'cloud');
R('cloud-2', puff(840, 190, 120, 38, 5, 20, true), 'cloud');
R('cloud-3', puff(610, 90, 70, 24, 4, 10, true), 'cloud');
R('cloud-4', puff(900, 420, 84, 24, 4, 30, true), 'cloud');

// ---------------------------------------------------------------- hills, barn and fields
R('hill-far', edged([[0, 700], [180, 672], [420, 706], [640, 682], [860, 702], [1000, 676]]), 'hill');
R('tree-left', puff(46, 722, 40, 44, 5, 0), 'grassDark');
{
  const b = barn(78, 772, 0.95);
  R('barn-side', b.side, 'barnDark');
  R('barn-front', b.front, 'barn');
  R('barn-roof', b.roof, 'navy');
  R('barn-door', b.door, 'cloud');
  R('barn-loft', b.loft, 'cloud');
  D(b.doorCross, '#8c2b22', 2.4);
}
R('silo', rect(346, 668, 46, 104), 'cloud');
R('silo-dome', soft([[344, 670], [350, 646], [369, 636], [388, 646], [394, 670]]), 'navy');
R('tree-right', puff(446, 730, 44, 46, 5, 12), 'grassDark');
R('tree-far', puff(930, 706, 54, 40, 5, 6), 'grassDark');
R('field-light', edged([[0, 772], [300, 758], [620, 778], [1000, 762]]), 'field');
R('field-green', edged([[0, 852], [350, 836], [700, 854], [1000, 838]]), 'grass');
D(curve([[0, 800], [300, 786], [620, 806], [1000, 790]]) + curve([[0, 826], [320, 812], [660, 830], [1000, 814]]), '#a9b85c', 2, 0.8);

// ---------------------------------------------------------------- fence
R('rail-left-top', poly([[0, 908], [470, 892], [470, 934], [0, 952]]), 'wood');
R('rail-left-low', poly([[0, 1034], [470, 1020], [470, 1062], [0, 1078]]), 'wood');
R('rail-right-top', poly([[570, 892], [1000, 908], [1000, 952], [570, 934]]), 'wood');
R('rail-right-low', poly([[570, 1020], [1000, 1034], [1000, 1078], [570, 1062]]), 'wood');
R('post-left', post(74, 866, 52, 1250), 'russet');
R('post-right', post(926, 866, 52, 1250), 'russet');
R('post', rect(465, 806, 110, 444), 'russet');
R('post-shade', rect(543, 806, 32, 444), 'chestnut', [559, 1000]);
R('post-cap', rect(450, 792, 140, 32, 9), 'wood');
D(line([[490, 850], [490, 1010]]) + line([[516, 900], [516, 1090]]) + curve([[478, 1040], [486, 1070], [480, 1100]]), '#7c3d1f', 2, 0.6);
D(circle(74, 930, 3) + circle(74, 1056, 3) + circle(926, 930, 3) + circle(926, 1056, 3), '#5a3520', 2.4);
D(line([[30, 926], [440, 912]]) + line([[610, 912], [880, 922]]) + line([[120, 1050], [440, 1040]]) + line([[600, 1040], [960, 1052]]), '#8f6a42', 1.6, 0.7);

// ---------------------------------------------------------------- foreground meadow
R('grass-front', edged([[0, 1122], [250, 1100], [520, 1132], [800, 1104], [1000, 1122]]), 'grassDark');
{
  let blades = '';
  for (let x = 16; x < W; x += 52) blades += curve([[x, 1180], [x + 5, 1140], [x + 14, 1112]]);
  D(blades, '#6fae55', 2.4, 0.85);
}
flower(c, 'daisy-1', 150, 1168, 36, 'cloud', 'gold', 9, 0.62);
flower(c, 'daisy-2', 366, 1196, 30, 'cloud', 'gold', 9, 0.62, -70);
flower(c, 'daisy-3', 700, 1166, 36, 'cloud', 'gold', 9, 0.62, -80);
flower(c, 'daisy-4', 904, 1196, 30, 'cloud', 'gold', 9, 0.62);
flower(c, 'poppy-1', 256, 1140, 28, 'barn', 'navy', 5, 0.82);
flower(c, 'poppy-2', 806, 1134, 28, 'barn', 'navy', 5, 0.82, -60);
flower(c, 'poppy-3', 44, 1196, 26, 'barn', 'navy', 5, 0.82, -75);
flower(c, 'poppy-4', 630, 1212, 24, 'barn', 'navy', 5, 0.82, -100);

// ---------------------------------------------------------------- the rooster (drawn around his feet, facing right)
const T = { s: 1.1, x: 524, y: 796 };
const t = (d: string) => xf(d, T);
const B = (id: string, d: string, color: string) => R(`rooster-${id}`, t(d), color);
const rib = (pts: Pt[], color: string, w = 1.8) => D(t(curve(pts)), color, w, 0.75);

// tail: arching sickle feathers, back to front
const tail: [string, Pt[], number, string][] = [
  ['tail-1', [[-100, -240], [-140, -400], [-205, -505], [-285, -520], [-345, -470]], 46, 'teal'],
  ['tail-2', [[-110, -232], [-175, -385], [-255, -470], [-345, -450], [-395, -355]], 50, 'navy'],
  ['tail-3', [[-115, -225], [-195, -340], [-275, -400], [-350, -372], [-385, -275]], 50, 'teal'],
  ['tail-4', [[-120, -215], [-205, -300], [-285, -332], [-345, -292], [-362, -205]], 48, 'deepTeal'],
  ['tail-5', [[-120, -205], [-200, -252], [-270, -258], [-322, -214], [-332, -150]], 44, 'navy'],
];
for (const [id, pts, w, col] of tail) B(id, plume(pts, 26, w, 0.55), col);
for (const [, pts] of tail) rib(pts.slice(1), '#bfe6dc', 1.6);

B('body', blob([[62, -380], [138, -372], [150, -300], [174, -236], [162, -165], [106, -104], [0, -82], [-96, -104], [-156, -164], [-166, -240], [-100, -270], [-20, -286], [36, -326]]), 'russet');
B('saddle-1', plume([[-6, -290], [-84, -282], [-150, -246], [-186, -190]], 22, 38, 0.45), 'gold');
B('saddle-2', plume([[0, -280], [-76, -262], [-136, -220], [-166, -160]], 22, 38, 0.45), 'orange');
B('breast', blob([[146, -296], [176, -236], [164, -164], [106, -102], [30, -84], [58, -150], [92, -216], [112, -276]]), 'deepTeal');
B('thigh-back', blob([[-52, -120], [-10, -122], [-2, -92], [-18, -62], [-40, -64], [-56, -92]]), 'chestnut');
B('thigh-front', blob([[10, -122], [56, -118], [60, -90], [44, -60], [22, -62], [6, -92]]), 'chestnut');
B('wing', blob([[80, -262], [10, -282], [-72, -256], [-152, -190], [-86, -148], [0, -140], [62, -180]]), 'chestnut');
B('wing-covert', blob([[76, -262], [10, -280], [-68, -254], [-108, -222], [-36, -222], [36, -228]]), 'orange');
B('wing-feather-1', leaf(-2, -202, 146, 18, 172), 'teal');
B('wing-feather-2', leaf(2, -178, 132, 17, 176), 'navy');
B('wing-feather-3', leaf(6, -156, 106, 15, 180), 'teal');

// legs and feet
B('leg-back', band([[-30, -66], [-30, -8]], 14, 13), 'gold');
B('leg-front', band([[32, -64], [34, -8]], 14, 13), 'gold');
const foot = poly([[-36, -5], [-24, -14], [-10, -14], [26, -11], [29, -3], [6, -3], [22, 5], [15, 10], [-8, 2], [-30, 3]]);
B('foot-back', xf(foot, { x: -28 }), 'gold');
B('foot-front', xf(foot, { x: 36 }), 'gold');

// neck hackles, head and face
B('comb', blob([[64, -418], [56, -454], [78, -470], [90, -450], [100, -488], [122, -484], [126, -458], [144, -472], [158, -452], [148, -432], [150, -414], [108, -420]]), 'barn');
const hackle: [number, number, number, string][] = [[138, 168, 36, 'gold'], [64, 146, 34, 'gold'], [120, 188, 38, 'orange'], [82, 176, 38, 'orange'], [101, 194, 38, 'gold']];
hackle.forEach(([rot, len, wid, col], i) => B(`hackle-${i + 1}`, leaf(100, -394, len, wid, rot), col));
B('head', circle(105, -407, 46), 'orange');
B('wattle-back', blob([[110, -380], [130, -378], [134, -345], [121, -320], [107, -345]]), 'barnDark');
B('wattle', blob([[126, -386], [150, -382], [160, -345], [146, -310], [126, -338]]), 'barn');
B('beak', poly([[138, -426], [198, -402], [140, -384]]), 'gold');
B('face', ellipse(121, -403, 25, 23), 'barn');
B('eye', circle(124, -409, 8.5), 'navy');
D(t(circle(126.5, -411.5, 1.6)), '#fff6e6', 2.6);
D(t(line([[142, -404], [186, -402]])), '#a8641a', 1.6);

const activity: PaintActivity = {
  id: 'farm-paint-1', version: 1, mode: 'paint', title: 'The Proud Rooster', blurb: 'A handsome rooster greets the sunrise from his fence post, tail feathers gleaming, with the red barn and green fields waking behind him.',
  collectionId: 'farm', categories: ["Countryside", "Animals"], difficulty: 'Moderate',
  added: '2026-11-26',
  width: W, height: H,
  palette: [
    { id: 'sky', number: 1, name: 'Dawn blue', hex: '#a9c0e6' },
    { id: 'peach', number: 2, name: 'Peach sky', hex: '#f8c7a4' },
    { id: 'glow', number: 3, name: 'Morning glow', hex: '#fde6a4' },
    { id: 'gold', number: 4, name: 'Sunrise gold', hex: '#ffc23d' },
    { id: 'cloud', number: 5, name: 'Cream', hex: '#fff6e6' },
    { id: 'hill', number: 6, name: 'Far hills', hex: '#9cc07c' },
    { id: 'field', number: 7, name: 'Spring field', hex: '#cbd97c' },
    { id: 'grass', number: 8, name: 'Meadow green', hex: '#65a04f' },
    { id: 'grassDark', number: 9, name: 'Deep green', hex: '#3b7038' },
    { id: 'barn', number: 10, name: 'Barn red', hex: '#d2402e' },
    { id: 'barnDark', number: 11, name: 'Brick shadow', hex: '#8f2a22' },
    { id: 'orange', number: 12, name: 'Marigold', hex: '#ee8a2c' },
    { id: 'russet', number: 13, name: 'Russet', hex: '#b05a2b' },
    { id: 'chestnut', number: 14, name: 'Chestnut', hex: '#703721' },
    { id: 'teal', number: 15, name: 'Teal', hex: '#2f9489' },
    { id: 'deepTeal', number: 16, name: 'Deep teal', hex: '#1e5c63' },
    { id: 'navy', number: 17, name: 'Midnight blue', hex: '#2b3558' },
    { id: 'wood', number: 18, name: 'Fence wood', hex: '#c69a66' },
  ],
  regions: c.regions,
  detail: c.detail,
};
export default activity;
