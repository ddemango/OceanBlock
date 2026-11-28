import { blob, circle, curve, ellipse, leaf, line, poly, rect, xf } from '../../art/kit';
import type { PaintActivity } from '../types';
import { W, H, band, canvas, clampPath, edged, goblet, type Pt } from './props-paint';

const { regions, detail, R, D } = canvas();
const INK = '#2f2433';

// ---------------------------------------------------------------- the cave
R('rock', rect(0, 0, W, H), 'caveD');
R('chamber', clampPath(blob([
  [0, 1250], [0, 760], [40, 470], [70, 300], [110, 190],
  [170, 170], [200, 236], [236, 176], [330, 150], [390, 250], [430, 160], [520, 140], [570, 290], [620, 150],
  [720, 150], [770, 250], [810, 160], [880, 190], [930, 300], [960, 470], [1000, 760], [1000, 1250],
], 0.35)), 'cave');
R('lamp-light', circle(210, 470, 150), 'peach');
R('crystal-1', poly([[900, 650], [918, 560], [940, 650]]), 'crystal');
R('crystal-2', poly([[930, 660], [962, 590], [970, 668]]), 'crystal');
R('crystal-3', poly([[868, 664], [878, 610], [904, 660]]), 'crystal');
R('floor', edged([[0, 980], [200, 958], [500, 988], [800, 958], [1000, 984]], [[1000, 1250], [0, 1250]]), 'caveL');
R('stalagmite-l', blob([[20, 1000], [44, 870], [62, 800], [80, 870], [108, 1000]], 0.6), 'caveD');
R('stalagmite-r', blob([[930, 990], [950, 880], [966, 830], [980, 880], [998, 990]], 0.6), 'caveD');

// ---------------------------------------------------------------- the hoard
R('hoard', blob([[110, 1010], [180, 900], [300, 846], [450, 806], [600, 800], [760, 830], [880, 900], [940, 1010], [700, 1064], [500, 1072], [300, 1062]], 1), 'gold');
R('hoard-shade', blob([[124, 1010], [300, 1000], [500, 1012], [700, 1000], [926, 1010], [700, 1056], [500, 1064], [300, 1054]], 1), 'goldD');
const heapCoins: [number, number, string][] = [[176, 950, 'goldD'], [260, 990, 'goldD'], [640, 1032, 'gold'], [524, 918, 'goldD'], [420, 1034, 'gold']];
heapCoins.forEach(([x, y, c], i) => R(`heap-coin-${i + 1}`, ellipse(x, y, 26, 11, (i % 3) * 8 - 8), c));
R('goblet-1', goblet(452, 966, 92, 56), 'goldD');
R('goblet-1-gem', circle(452, 900, 9), 'ruby');
R('gem-1', poly([[662, 906], [682, 892], [702, 906], [682, 926]]), 'ruby');
R('gem-3', poly([[700, 1040], [720, 1026], [740, 1040], [720, 1058]]), 'ruby');
R('gem-2', poly([[226, 1018], [244, 1004], [262, 1018], [244, 1036]]), 'crystal');

// ---------------------------------------------------------------- the sleeping dragon
// tail curling round the front of the hoard
R('tail', band([[760, 812], [850, 868], [840, 948], [720, 990], [610, 990]], 62, 30), 'green');
R('tail-spike-1', poly([[836, 852], [878, 838], [866, 882]]), 'greenD');
R('tail-spike-2', poly([[872, 920], [906, 930], [878, 954]]), 'greenD');
R('tail-tip', poly([[620, 974], [582, 950], [536, 990], [582, 1030], [620, 1008]]), 'greenD');
// body
R('body', blob([[330, 830], [340, 730], [400, 650], [500, 606], [630, 604], [740, 648], [796, 730], [784, 812], [700, 856], [560, 866], [420, 858]], 1), 'green');
R('haunch', ellipse(700, 790, 76, 56, -20), 'greenD');
R('belly', band([[370, 836], [520, 858], [660, 848], [740, 820]], 40, 26), 'belly');
R('back-spine-1', poly([[742, 640], [786, 624], [772, 670]]), 'greenD');
R('back-spine-2', poly([[780, 688], [826, 688], [796, 728]]), 'greenD');
R('neck-spine-1', poly([[392, 650], [384, 606], [430, 628]]), 'greenD');
R('neck-spine-2', poly([[352, 700], [326, 664], [374, 670]]), 'greenD');
// folded wing
R('wing', blob([[460, 650], [520, 566], [610, 512], [700, 524], [748, 590], [720, 640], [650, 664], [560, 672]], 0.9), 'wing');
R('wing-arm', band([[478, 640], [536, 572], [614, 528], [690, 534]], 16, 10), 'greenD');
D(curve([[560, 560], [580, 610], [570, 668]]) + curve([[620, 522], [650, 590], [640, 664]]) + curve([[690, 526], [720, 590], [712, 640]]), '#b9655a', 2, 0.8);
// head resting on its paws
R('head', blob([[160, 850], [176, 816], [220, 800], [262, 778], [314, 766], [364, 780], [396, 814], [390, 852], [354, 880], [290, 890], [226, 884], [180, 874]], 1), 'green');
R('jaw', blob([[178, 870], [250, 878], [330, 874], [380, 858], [346, 892], [280, 902], [214, 896]], 1), 'belly');
R('cheek', circle(320, 846, 16), 'wing');
R('horn-back', poly([[296, 772], [300, 714], [320, 700], [326, 770]]), 'belly');
R('horn-front', poly([[332, 778], [360, 716], [384, 702], [366, 786]]), 'belly');
R('ear', leaf(372, 800, 74, 34, -24), 'wing');
R('paw-l', ellipse(236, 912, 46, 24), 'green');
R('paw-r', ellipse(336, 914, 44, 23), 'green');
D(curve([[270, 822], [290, 834], [312, 822]]) + line([[278, 830], [272, 840]]) + line([[292, 835], [292, 846]]) + line([[306, 830], [312, 840]]), INK, 2.4, 0.9);
D(circle(190, 832, 3) + curve([[178, 860], [210, 868], [240, 862]]), INK, 2, 0.8);
D(line([[206, 930], [204, 938]]) + line([[226, 934], [226, 942]]) + line([[246, 934], [248, 942]]) + line([[312, 934], [310, 942]]) + line([[332, 936], [332, 944]]) + line([[352, 934], [354, 942]]), '#f6e6b8', 3, 0.95);
D(curve([[440, 846], [436, 862]]) + curve([[500, 852], [498, 870]]) + curve([[560, 856], [560, 872]]) + curve([[620, 852], [622, 868]]) + curve([[680, 840], [684, 856]]), '#c9b07a', 1.6, 0.8);
// zzz
const z = (x: number, y: number, s: number) => line([[x, y], [x + s, y], [x, y + s], [x + s, y + s]]);
D(z(222, 720, 22) + z(178, 652, 30) + z(118, 568, 38), '#f6e6b8', 3, 0.9);

// ---------------------------------------------------------------- lantern hanging from the roof
D(line([[210, 230], [210, 394]]), '#2a2030', 3, 0.9);
D(circle(210, 384, 9), '#2a2030', 2.4, 0.9);
R('lantern-cap', poly([[164, 418], [210, 390], [256, 418]]), 'wood');
R('lantern-glass', poly([[176, 418], [244, 418], [234, 512], [186, 512]]), 'glow');
R('lantern-flame', blob([[210, 436], [226, 472], [210, 494], [194, 472]], 1), 'gold');
R('lantern-base', rect(176, 510, 68, 20, 4), 'wood');
D(line([[192, 418], [196, 512]]) + line([[228, 418], [224, 512]]), '#5a3b26', 2, 0.8);

// ---------------------------------------------------------------- treasure on the floor
R('chest', rect(780, 1040, 150, 82, 6), 'wood');
R('chest-lid', blob([[780, 1044], [790, 1000], [855, 984], [920, 1000], [930, 1044]], 0.7), 'ruby');
R('chest-strap-l', rect(806, 1040, 18, 82), 'gold');
R('chest-strap-r', rect(886, 1040, 18, 82), 'gold');
R('chest-lock', rect(842, 1030, 26, 30, 5), 'goldD');
R('goblet-2', goblet(110, 1150, 84, 52), 'gold');
R('goblet-2-gem', circle(110, 1090, 8), 'ruby');
const floorCoins: Pt[] = [[260, 1120], [350, 1160], [470, 1110], [560, 1180], [680, 1124], [220, 1200], [420, 1214], [760, 1180], [880, 1170], [620, 1230]];
floorCoins.forEach(([x, y], i) => R(`coin-${i + 1}`, ellipse(x, y, 28, 12, (i % 4) * 6 - 9), 'gold'));
D(xf(curve([[-12, 0], [0, -3], [12, 0]]), { x: 260, y: 1118 }) + xf(curve([[-12, 0], [0, -3], [12, 0]]), { x: 560, y: 1178 }) + xf(curve([[-12, 0], [0, -3], [12, 0]]), { x: 880, y: 1168 }), '#a8721f', 1.6, 0.8);
// cave texture
D(curve([[80, 620], [96, 660], [90, 700]]) + curve([[880, 360], [900, 400], [896, 440]]) + curve([[640, 320], [660, 340], [690, 344]]) + curve([[440, 380], [470, 396], [500, 394]]) + curve([[120, 1040], [200, 1046], [280, 1040]]), '#7a6478', 1.6, 0.7);

const activity: PaintActivity = {
  id: 'fairytale-paint-3', version: 1, mode: 'paint', title: 'The Sleeping Dragon',
  blurb: 'A friendly green dragon snoozes curled on a heap of gold coins and goblets, lit by a lantern glowing in the cave.',
  added: '2026-11-25', collectionId: 'fairytale', categories: ["Fairytale"], difficulty: 'Relaxed',
  width: W, height: H,
  palette: [
    { id: 'caveD', number: 1, name: 'Cave shadow', hex: '#3a2d40' },
    { id: 'cave', number: 2, name: 'Cave rock', hex: '#5e4a60' },
    { id: 'caveL', number: 3, name: 'Lit rock', hex: '#937b8c' },
    { id: 'peach', number: 4, name: 'Lantern light', hex: '#e9a877' },
    { id: 'glow', number: 5, name: 'Warm glass', hex: '#fbe7a6' },
    { id: 'gold', number: 6, name: 'Gold', hex: '#efbb45' },
    { id: 'goldD', number: 7, name: 'Old gold', hex: '#c48a2c' },
    { id: 'green', number: 8, name: 'Dragon green', hex: '#74b281' },
    { id: 'greenD', number: 9, name: 'Deep scale', hex: '#3f7a62' },
    { id: 'belly', number: 10, name: 'Belly cream', hex: '#f6e6b8' },
    { id: 'wing', number: 11, name: 'Wing coral', hex: '#e4917f' },
    { id: 'ruby', number: 12, name: 'Ruby', hex: '#c4434e' },
    { id: 'wood', number: 13, name: 'Old oak', hex: '#7a5136' },
    { id: 'crystal', number: 14, name: 'Cave crystal', hex: '#8fcac6' },
  ],
  regions,
  detail,
};
export default activity;
