import { blob, circle, curve, ellipse, leaf, line, poly, rect, star, xf } from '../../art/kit';
import type { PaintActivity } from '../types';
import { W, H, arch, band, canvas, edged, lobed, pumpkin, sample, wheel, type Pt } from './props-paint';

const { regions, detail, R, D } = canvas();
const INK = '#3b2a48';

// ---------------------------------------------------------------- midnight sky and moon
R('sky', rect(0, 0, W, H), 'nightDeep');
R('sky-low', edged([[0, 430], [260, 400], [520, 440], [760, 410], [1000, 440]], [[1000, 1250], [0, 1250]]), 'night');
R('moon-halo', circle(196, 196, 128), 'night');
R('moon', circle(196, 196, 92), 'moon');
R('moon-sea-1', ellipse(160, 170, 26, 18, -20), 'stoneL');
R('moon-sea-2', ellipse(226, 236, 20, 14, 10), 'stoneL');
D(circle(236, 150, 8) + circle(150, 240, 6) + circle(190, 120, 5), '#d8cdb0', 1.6, 0.8);
([[440, 90], [610, 200], [520, 330], [960, 90], [60, 420], [380, 470]] as Pt[]).forEach(([x, y], i) => R(`star-${i + 1}`, star(x, y, i % 2 ? 13 : 17, 6, 4, -90), i % 3 ? 'moon' : 'gold'));
D(circle(330, 40, 1.5) + circle(680, 60, 1.5) + circle(560, 470, 1.5) + circle(40, 560, 1.5) + circle(900, 230, 1.5) + circle(480, 200, 1.5), '#fff6dc', 2, 0.8);

// ---------------------------------------------------------------- far hills and hedges
R('far-hills', edged([[0, 640], [180, 600], [400, 650], [620, 612], [1000, 650]], [[1000, 900], [0, 900]]), 'haze');
R('grass', edged([[0, 790], [300, 770], [600, 792], [1000, 772]], [[1000, 1250], [0, 1250]]), 'grass');
R('hedge-1', lobed(132, 792, 100, 44, 7, 0.14, 0), 'leaf');
R('hedge-2', lobed(620, 790, 100, 40, 7, 0.14, 20), 'leaf');

// ---------------------------------------------------------------- the clock tower
{
  const cx = 800;
  R('tower-body', rect(732, 470, 136, 380), 'stone');
  R('tower-body-shade', rect(834, 470, 34, 380), 'stoneD');
  R('tower-window-1', arch(780, 566, 17, 630), 'gold');
  R('tower-window-2', arch(780, 690, 17, 754), 'gold');
  D(line([[780, 549], [780, 630]]) + line([[780, 673], [780, 754]]), INK, 1.6, 0.8);
  R('tower-stage', rect(712, 296, 176, 176), 'stoneL');
  R('tower-stage-shade', rect(852, 296, 36, 176), 'stone');
  R('tower-ledge', rect(700, 462, 200, 22, 4), 'stoneD');
  R('tower-roof', poly([[696, 300], [cx, 118], [904, 300]]), 'copper');
  R('tower-roof-shade', poly([[cx, 118], [904, 300], [cx + 20, 300]]), 'grass');
  R('tower-cornice', rect(690, 290, 220, 20, 4), 'stoneD');
  R('tower-finial', circle(cx, 104, 12), 'gold');
  D(line([[cx, 92], [cx, 60]]), INK, 2.4, 0.9);
  R('clock-rim', circle(cx, 384, 70), 'gold');
  R('clock-face', circle(cx, 384, 56), 'moon');
  let ticks = '';
  for (let i = 0; i < 12; i++) {
    const a = (i * 30 * Math.PI) / 180, r0 = i % 3 ? 46 : 42;
    ticks += line([[cx + Math.sin(a) * r0, 384 - Math.cos(a) * r0], [cx + Math.sin(a) * 52, 384 - Math.cos(a) * 52]]);
  }
  D(ticks, INK, 2.4, 0.9);
  // both hands together at twelve
  R('clock-hands', poly([[cx - 9, 392], [cx - 4, 356], [cx, 336], [cx + 4, 356], [cx + 9, 392], [cx, 400]]), 'plum');
  D(circle(cx, 384, 3), '#f8f0d6', 2, 1);
}

// ---------------------------------------------------------------- moonlit road
const roadTop: Pt[] = [[0, 866], [300, 838], [700, 832], [1000, 846]];
const roadBot: Pt[] = [[1000, 968], [640, 994], [300, 1004], [0, 986]];
R('road', poly([...sample(roadTop, 8), ...sample(roadBot, 8)]), 'road');
D(curve([[40, 930], [140, 920], [220, 924]]) + curve([[700, 900], [800, 896], [880, 902]]) + curve([[330, 960], [420, 956], [480, 960]]), '#a8977c', 1.4, 0.6);

// ---------------------------------------------------------------- lamp post
R('lamp-halo', circle(110, 590, 62), 'haze');
R('lamp-post', rect(103, 640, 14, 320, 4), 'plum');
R('lamp-foot', rect(86, 940, 48, 26, 6), 'stoneD');
R('lamp-glass', poly([[80, 566], [140, 566], [130, 634], [90, 634]]), 'gold');
R('lamp-cap', poly([[72, 568], [110, 530], [148, 568]]), 'plum');
D(line([[110, 566], [110, 634]]), INK, 1.6, 0.7);

// ---------------------------------------------------------------- the pumpkin coach
const cx = 420, cy = 696, rx = 190, ry = 142;
R('coach-shadow', ellipse(420, 950, 250, 22), 'stone');
R('coach-bar', band([[200, 846], [420, 832], [640, 846]], 22, 22), 'gold');
R('coach', pumpkin(cx, cy, rx, ry), 'orangeD');
R('coach-lobe-l', ellipse(cx - rx * 0.5, cy + 6, rx * 0.4, ry * 0.86), 'orange');
R('coach-lobe-r', ellipse(cx + rx * 0.5, cy + 6, rx * 0.4, ry * 0.86), 'orange');
R('coach-lobe-c', ellipse(cx, cy + 2, rx * 0.5, ry * 0.95), 'apricot');
R('coach-glint', leaf(cx - rx * 0.68, cy - 60, 90, 16, 70), 'apricot');
R('coach-glint-r', leaf(cx + rx * 0.58, cy - 76, 60, 12, 80), 'apricot');
R('door-frame', ellipse(cx, cy - 4, 64, 82), 'gold');
R('door-window', ellipse(cx, cy - 4, 48, 66), 'moon');
R('curtain-l', poly([[cx - 46, cy - 26], [cx - 30, cy - 62], [cx - 14, cy - 64], [cx - 22, cy - 20], [cx - 36, cy + 18], [cx - 46, cy + 10]]), 'plum');
R('curtain-r', poly([[cx + 46, cy - 26], [cx + 30, cy - 62], [cx + 14, cy - 64], [cx + 22, cy - 20], [cx + 36, cy + 18], [cx + 46, cy + 10]]), 'plum');
D(line([[cx, cy - 70], [cx, cy + 62]]), INK, 1.6, 0.7);
// gilt scrolls over the pumpkin
D(curve([[cx - 64, cy + 80], [cx - 100, cy + 100], [cx - 130, cy + 80], [cx - 120, cy + 60], [cx - 104, cy + 70]]) +
  curve([[cx + 64, cy + 80], [cx + 100, cy + 100], [cx + 130, cy + 80], [cx + 120, cy + 60], [cx + 104, cy + 70]]) +
  curve([[cx - 40, cy - 104], [cx - 70, cy - 126], [cx - 96, cy - 112], [cx - 86, cy - 96]]) +
  curve([[cx + 40, cy - 104], [cx + 70, cy - 126], [cx + 96, cy - 112], [cx + 86, cy - 96]]), '#f3d27a', 3, 0.95);
// stem and leaf on top
R('stem', band([[cx - 4, cy - ry + 24], [cx + 6, cy - ry - 20], [cx + 30, cy - ry - 52]], 30, 16), 'leaf');
R('vine-leaf', leaf(cx - 6, cy - ry + 6, 110, 40, 200), 'grass');
D(curve([[cx + 30, cy - ry - 52], [cx + 56, cy - ry - 66], [cx + 70, cy - ry - 50], [cx + 56, cy - ry - 38], [cx + 46, cy - ry - 48]]) +
  curve([[cx - 20, cy - ry - 4], [cx - 30, cy - ry - 34], [cx - 12, cy - ry - 44], [cx - 6, cy - ry - 30]]), '#4f8a4a', 3, 0.95);
D(line([[cx - 14, cy - ry + 2], [cx - 96, cy - ry + 30]]), '#2f5a3e', 1.4, 0.7);
// coach lantern at the front
R('coach-lantern', poly([[214, 648], [242, 648], [236, 690], [220, 690]]), 'gold');
R('coach-lantern-cap', poly([[208, 650], [228, 628], [248, 650]]), 'plum');
D(line([[228, 690], [236, 716]]) + line([[242, 664], [262, 664]]), INK, 2.4, 0.85);
// wheels
wheel(R, 'wheel-front', 250, 884, 66, 6, 'gold', 'plum', 'orangeD', 15);
wheel(R, 'wheel-back', 596, 872, 80, 6, 'gold', 'plum', 'orangeD', 0);

// ---------------------------------------------------------------- palace steps and the glass slipper
const steps: [number, number, number, number][] = [
  // x-left, tread top, riser top, riser bottom
  [600, 1006, 1032, 1070],
  [540, 1070, 1098, 1144],
  [480, 1144, 1174, 1250],
];
steps.forEach(([x, t, r0, r1], i) => {
  R(`step-${i + 1}`, poly([[x + 24, t], [W, t], [W, r0], [x, r0]]), 'stoneL');
  R(`step-${i + 1}-riser`, rect(x, r0, W - x, r1 - r0), 'stone');
});
R('newel', rect(452, 1086, 46, 164, 4), 'stoneL');
R('newel-shade', rect(482, 1086, 16, 164), 'stone');
R('newel-cap', rect(440, 1070, 70, 22, 5), 'stoneD');
R('newel-ball', circle(475, 1046, 26), 'stone');

{
  const t = { s: 1.25, x: 760, y: 1092 } as const;
  const shoe = xf(blob([[-98, -6], [-84, -22], [-52, -34], [-14, -40], [12, -34], [40, -42], [70, -70], [80, -54], [78, -28], [66, -10], [30, -12], [-20, 0], [-70, 6]], 0.7), t);
  R('slipper', shoe, 'ice');
  R('slipper-heel', xf(poly([[52, -14], [76, -18], [72, 14], [60, 14]]), t), 'ice');
  R('slipper-inside', xf(ellipse(44, -46, 30, 9, -36), t), 'haze');
  R('slipper-shine', xf(leaf(-82, -12, 80, 12, -12), t), 'moon');
  R('slipper-bow', xf(ellipse(-40, -32, 14, 9, -10), t), 'gold');
  D(xf(curve([[-30, -24], [10, -22], [50, -26]]), t), '#e8f8fc', 2, 0.9);
}
// sparkles around the slipper
for (const [x, y, s] of [[640, 1010, 10], [900, 1000, 14], [700, 960, 8], [880, 1060, 8], [820, 950, 10]] as [number, number, number][])
  D(line([[x - s, y], [x + s, y]]) + line([[x, y - s], [x, y + s]]) + line([[x - s * 0.4, y - s * 0.4], [x + s * 0.4, y + s * 0.4]]) + line([[x - s * 0.4, y + s * 0.4], [x + s * 0.4, y - s * 0.4]]), '#fff6dc', 1.8, 0.9);
// grass tufts
for (const [x, y] of [[40, 1100], [180, 1060], [300, 1180], [140, 1220], [380, 1080], [960, 800]] as Pt[]) D(line([[x, y], [x - 6, y - 16]]) + line([[x + 6, y], [x + 6, y - 20]]) + line([[x + 12, y], [x + 18, y - 14]]), '#25463a', 1.6, 0.7);

const activity: PaintActivity = {
  id: 'fairytale-paint-2', version: 1, mode: 'paint', title: 'Pumpkin Coach at Midnight',
  blurb: 'As the clock tower strikes twelve, a gilded pumpkin coach waits on the moonlit road and a glass slipper sparkles on the palace steps.',
  added: '2026-11-25', collectionId: 'fairytale', categories: ["Fairytale"], difficulty: 'Moderate',
  width: W, height: H,
  palette: [
    { id: 'nightDeep', number: 1, name: 'Midnight', hex: '#1f2550' },
    { id: 'night', number: 2, name: 'Velvet blue', hex: '#344488' },
    { id: 'haze', number: 3, name: 'Moon haze', hex: '#7078b8' },
    { id: 'moon', number: 4, name: 'Moonlight', hex: '#f8f0d6' },
    { id: 'stoneL', number: 5, name: 'Pale stone', hex: '#d8d0c8' },
    { id: 'stone', number: 6, name: 'Tower stone', hex: '#9c94a8' },
    { id: 'stoneD', number: 7, name: 'Shadow stone', hex: '#6c6580' },
    { id: 'copper', number: 8, name: 'Copper green', hex: '#5aa192' },
    { id: 'apricot', number: 9, name: 'Apricot', hex: '#f8b065' },
    { id: 'orange', number: 10, name: 'Pumpkin', hex: '#ec8634' },
    { id: 'orangeD', number: 11, name: 'Pumpkin shadow', hex: '#b9561f' },
    { id: 'gold', number: 12, name: 'Gilt', hex: '#efc457' },
    { id: 'leaf', number: 13, name: 'Vine green', hex: '#5d9a52' },
    { id: 'grass', number: 14, name: 'Night grass', hex: '#335a4b' },
    { id: 'road', number: 15, name: 'Moonlit road', hex: '#c9b79a' },
    { id: 'ice', number: 16, name: 'Glass blue', hex: '#a8dcea' },
    { id: 'plum', number: 17, name: 'Deep plum', hex: '#4a3556' },
  ],
  regions,
  detail,
};
export default activity;
