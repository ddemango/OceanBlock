import { blob, circle, curve, ellipse, leaf, line, poly, rect } from '../../art/kit';
import type { PaintActivity } from '../types';
import { W, H, band, canvas, edged, flower, post, puff, soft, type Pt } from './props-paint';

const c = canvas();
const { R, D } = c;
const mirror = (pts: Pt[], axis: number): Pt[] => pts.map(([x, y]) => [axis * 2 - x, y]);

// ---------------------------------------------------------------- sky and hills
R('sky', rect(0, 0, W, H), 'sky');
R('cloud-1', puff(210, 130, 150, 46, 6, 0, true), 'cloud');
R('cloud-2', puff(610, 84, 96, 30, 5, 15, true), 'cloud');
R('cloud-3', puff(450, 250, 90, 26, 4, 30, true), 'cloud');
R('hill-far', edged([[0, 368], [200, 326], [420, 356], [650, 304], [860, 330], [1000, 318]]), 'farHill');
R('hill-mid', edged([[0, 424], [250, 398], [520, 424], [760, 388], [1000, 404]]), 'hill');

// ---------------------------------------------------------------- farmhouse on the hill
R('tree-1', puff(646, 366, 52, 52, 5, 0), 'grassDark');
R('tree-2', puff(934, 368, 48, 48, 5, 20), 'grassDark');
R('tree-3', puff(110, 392, 46, 38, 5, 8), 'grassDark');
R('house-chimney', rect(826, 262, 24, 50), 'woodDark');
R('house-side', rect(790, 338, 96, 68), 'shade');
R('house-roof', poly([[745, 286], [856, 290], [896, 342], [786, 340]]), 'red');
R('house-front', poly([[700, 406], [700, 332], [745, 288], [790, 332], [790, 406]]), 'cloud');
R('house-door', rect(732, 360, 28, 46), 'blue');
R('house-window', rect(822, 354, 34, 28), 'blue');
D(line([[839, 354], [839, 382]]) + line([[822, 368], [856, 368]]), '#fffdf6', 2);
D(line([[696, 336], [745, 288], [794, 336]]), '#b53a28', 5);

// ---------------------------------------------------------------- meadow and fence
R('meadow', edged([[0, 474], [300, 452], [600, 476], [1000, 454]]), 'meadow');
R('rail-top', rect(0, 486, W, 20), 'wood');
R('rail-low', rect(0, 532, W, 20), 'wood');
[40, 214, 388, 562, 736, 950].forEach((x, i) => R(`fence-post-${i + 1}`, post(x, 452, 30, 584), 'woodDark'));

// ---------------------------------------------------------------- the cow
R('cow-shadow', ellipse(600, 1010, 330, 26), 'grassDark');
R('cow-tail', band([[872, 586], [912, 630], [926, 730], [916, 812]], 18, 11), 'shade');
R('cow-tail-tuft', blob([[916, 800], [936, 830], [926, 874], [906, 886], [896, 846], [900, 814]]), 'black');
R('cow-leg-far-front', poly([[446, 800], [512, 800], [502, 978], [452, 978]]), 'shade');
R('cow-leg-far-back', poly([[700, 800], [772, 800], [762, 978], [712, 978]]), 'shade');
R('cow-hoof-far-front', rect(448, 974, 58, 30, 7), 'woodDark');
R('cow-hoof-far-back', rect(708, 974, 58, 30, 7), 'woodDark');
R('cow-udder', blob([[608, 846], [700, 846], [716, 890], [692, 928], [640, 930], [610, 900]]), 'pink');
R('cow-body', soft([[330, 560], [480, 530], [700, 534], [850, 558], [892, 650], [884, 760], [872, 870], [862, 990], [800, 990], [794, 890], [760, 852], [660, 866], [540, 872], [450, 862], [434, 900], [428, 990], [364, 990], [356, 880], [308, 800], [288, 680]]), 'cream');
R('cow-hoof-front', rect(360, 976, 72, 32, 8), 'woodDark');
R('cow-hoof-back', rect(796, 976, 70, 32, 8), 'woodDark');
R('cow-patch-back', blob([[536, 560], [690, 554], [764, 602], [742, 684], [650, 720], [568, 672], [518, 612]]), 'black');
R('cow-patch-rump', blob([[812, 604], [866, 646], [860, 744], [820, 784], [782, 722], [776, 652]]), 'black');
R('cow-patch-shoulder', blob([[408, 650], [456, 660], [474, 712], [442, 762], [394, 748], [378, 698]]), 'black');
R('cow-patch-belly', blob([[556, 782], [622, 772], [654, 812], [612, 846], [560, 832]]), 'black');

// collar and bell
R('collar', band([[196, 600], [226, 700], [290, 772], [354, 700], [384, 600]], 24, 24), 'red');
R('bell', poly([[266, 780], [314, 780], [324, 806], [338, 850], [242, 850], [256, 806]]), 'gold');
R('bell-clapper', circle(290, 872, 12), 'woodDark');
R('bell-rim', rect(234, 842, 112, 18, 9), 'wood');

// head
const earL: Pt[] = [[228, 520], [176, 484], [126, 490], [108, 524], [148, 554], [216, 554]];
const earInL: Pt[] = [[206, 526], [168, 504], [136, 512], [136, 530], [168, 542]];
R('cow-ear-left', blob(earL), 'black');
R('cow-ear-left-inner', blob(earInL), 'pink');
R('cow-ear-right', blob(mirror(earL, 290)), 'black');
R('cow-ear-right-inner', blob(mirror(earInL, 290)), 'pink');
R('cow-horn-left', band([[250, 496], [234, 462], [240, 434]], 22, 8), 'shade');
R('cow-horn-right', band([[330, 496], [346, 462], [340, 434]], 22, 8), 'shade');
R('cow-head', blob([[214, 500], [290, 476], [366, 500], [380, 570], [364, 640], [374, 690], [336, 730], [290, 738], [244, 730], [206, 690], [216, 640], [200, 570]]), 'cream');
R('cow-face-patch', blob([[302, 484], [360, 500], [376, 556], [352, 546], [326, 520], [302, 514]]), 'black');
R('cow-muzzle', ellipse(290, 688, 78, 52), 'pink');
R('cow-nostril-left', ellipse(262, 680, 13, 10, -15), 'pinkDark');
R('cow-nostril-right', ellipse(318, 680, 13, 10, 15), 'pinkDark');
R('cow-eye-left', circle(250, 584, 12), 'black');
R('cow-eye-right', circle(330, 584, 12), 'black');
D(circle(254, 580, 2) + circle(334, 580, 2), '#fffdf6', 3.4);
D(curve([[234, 566], [250, 558], [266, 566]]) + curve([[314, 566], [330, 558], [346, 566]]), '#33302f', 2.4);
D(curve([[264, 714], [290, 724], [316, 714]]), '#c0605e', 2.6);
D(curve([[640, 928], [640, 944]]) + curve([[672, 926], [674, 942]]), '#d98880', 4);

// ---------------------------------------------------------------- wildflowers in front
R('grass-front', edged([[0, 1088], [220, 1068], [480, 1094], [760, 1070], [1000, 1088]]), 'grassDark');
{
  const stems: Pt[][] = [[[92, 1020], [100, 1250]], [[208, 1128], [200, 1250]], [[60, 1176], [66, 1250]], [[470, 1136], [476, 1250]], [[640, 1084], [632, 1250]], [[820, 1174], [826, 1250]], [[906, 1052], [898, 1250]], [[564, 1190], [560, 1250]], [[956, 1184], [952, 1250]], [[334, 1050], [340, 1250]]];
  D(stems.map((s) => curve([s[0], [(s[0][0] + s[1][0]) / 2 + 8, (s[0][1] + s[1][1]) / 2], s[1]])).join(''), '#8fc468', 4);
  let blades = '';
  for (let x = 24; x < W; x += 58) blades += curve([[x, 1140], [x + 5, 1108], [x + 14, 1082]]);
  D(blades, '#6aa84f', 2.4, 0.9);
}
R('leaf-1', leaf(100, 1150, 84, 20, -28), 'meadow');
R('leaf-2', leaf(636, 1180, 84, 20, -150), 'meadow');
R('leaf-3', leaf(900, 1150, 80, 19, -35), 'meadow');
R('leaf-4', leaf(338, 1160, 76, 18, -148), 'meadow');
flower(c, 'poppy-1', 92, 1016, 36, 'red', 'black', 5, 0.82);
flower(c, 'poppy-2', 470, 1132, 34, 'red', 'black', 5, 0.82, -60);
flower(c, 'poppy-3', 906, 1048, 36, 'red', 'black', 5, 0.82, -75);
flower(c, 'daisy-1', 208, 1124, 38, 'cloud', 'gold', 9, 0.6);
flower(c, 'daisy-2', 640, 1080, 38, 'cloud', 'gold', 9, 0.6, -80);
flower(c, 'daisy-3', 820, 1170, 34, 'cloud', 'gold', 9, 0.6, -70);
flower(c, 'daisy-4', 334, 1046, 32, 'cloud', 'gold', 9, 0.6, -100);
flower(c, 'cornflower-1', 60, 1174, 30, 'blue', 'gold', 7, 0.5);
flower(c, 'cornflower-2', 564, 1188, 30, 'blue', 'gold', 7, 0.5, -70);
flower(c, 'cornflower-3', 956, 1182, 30, 'blue', 'gold', 7, 0.5, -80);

// a butterfly keeping her company
R('butterfly-wing-left', ellipse(108, 690, 22, 30, -28), 'gold');
R('butterfly-wing-right', ellipse(148, 690, 22, 30, 28), 'gold');
D(line([[128, 672], [128, 716]]) + curve([[128, 672], [120, 656], [112, 652]]) + curve([[128, 672], [136, 656], [144, 652]]), '#33302f', 3);

const activity: PaintActivity = {
  id: 'farm-paint-2', version: 1, mode: 'paint', title: 'Cow in the Meadow', blurb: 'A gentle black-and-white cow with a brass bell pauses among poppies and daisies, the farmhouse and rolling hills behind her.',
  collectionId: 'farm', categories: ["Countryside", "Animals"], difficulty: 'Relaxed',
  added: '2026-11-26',
  width: W, height: H,
  palette: [
    { id: 'sky', number: 1, name: 'Summer sky', hex: '#a6d3ee' },
    { id: 'cloud', number: 2, name: 'Cloud white', hex: '#fffdf6' },
    { id: 'farHill', number: 3, name: 'Far hills', hex: '#8fbca0' },
    { id: 'hill', number: 4, name: 'Sunny hill', hex: '#b4d57a' },
    { id: 'meadow', number: 5, name: 'Meadow green', hex: '#7fba5a' },
    { id: 'grassDark', number: 6, name: 'Deep grass', hex: '#4a8a3f' },
    { id: 'cream', number: 7, name: 'Cream', hex: '#f8eeda' },
    { id: 'shade', number: 8, name: 'Oat', hex: '#d8c6a6' },
    { id: 'black', number: 9, name: 'Soft black', hex: '#35312f' },
    { id: 'pink', number: 10, name: 'Rose pink', hex: '#f3aaa2' },
    { id: 'pinkDark', number: 11, name: 'Dusky rose', hex: '#c66f6c' },
    { id: 'red', number: 12, name: 'Poppy red', hex: '#d8452f' },
    { id: 'gold', number: 13, name: 'Brass gold', hex: '#f3b62f' },
    { id: 'blue', number: 14, name: 'Cornflower', hex: '#5d7fcb' },
    { id: 'wood', number: 15, name: 'Fence wood', hex: '#c0905a' },
    { id: 'woodDark', number: 16, name: 'Walnut', hex: '#7a5234' },
  ],
  regions: c.regions,
  detail: c.detail,
};
export default activity;
