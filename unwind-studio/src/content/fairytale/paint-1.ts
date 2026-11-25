import { blob, circle, curve, line, rect, star } from '../../art/kit';
import type { PaintActivity } from '../types';
import { W, H, arch, band, burst, canvas, cone, cottage, crenWall, crescentMoon, drum, edged, lobed, pennant, type Pt } from './props-paint';

const { regions, detail, R, D } = canvas();
const INK = '#4a3f5c';

// ---------------------------------------------------------------- night sky
R('sky', rect(0, 0, W, H), 'nightDeep');
R('sky-low', edged([[0, 470], [250, 440], [500, 470], [750, 430], [1000, 460]], [[1000, 1250], [0, 1250]]), 'night');
R('moon', crescentMoon(112, 118, 50, 26), 'cream');
([[575, 300], [930, 52], [40, 300], [960, 560]] as Pt[]).forEach(([x, y], i) => R(`star-${i + 1}`, star(x, y, 15, 6, 4, -90), i % 2 ? 'gold' : 'cream'));
D(circle(470, 40, 1.5) + circle(640, 250, 1.5) + circle(30, 180, 1.5) + circle(980, 220, 1.5) + circle(160, 610, 1.5) + circle(850, 610, 1.5) + circle(380, 400, 1.5), '#fff6dc', 2, 0.8);

// ---------------------------------------------------------------- fireworks
burst(R, D, 'fw-big', 340, 200, 140, 8, 'pink', 'gold', 'cream', -90);
burst(R, D, 'fw-right', 760, 150, 110, 8, 'teal', 'violet', 'gold', -67);
burst(R, D, 'fw-low', 888, 360, 78, 8, 'gold', 'coral', 'pink', -90);
burst(R, D, 'fw-left', 120, 430, 72, 6, 'violet', 'teal', 'gold', -60);
// rising trails
D(curve([[60, 600], [80, 560], [112, 512]]) + curve([[960, 520], [930, 480], [904, 446]]), '#fbe3a6', 2, 0.55);

// ---------------------------------------------------------------- hills
R('far-hills', edged([[0, 660], [120, 610], [260, 640], [380, 600], [520, 630], [660, 590], [800, 630], [1000, 600]], [[1000, 900], [0, 900]]), 'dusk');
R('hill', edged([[0, 830], [140, 760], [260, 712], [400, 694], [600, 694], [740, 708], [870, 760], [1000, 812]], [[1000, 1250], [0, 1250]]), 'hillD');
R('meadow', edged([[0, 990], [200, 944], [420, 966], [640, 936], [860, 956], [1000, 936]], [[1000, 1250], [0, 1250]]), 'hillL');
R('rock', blob([[170, 726], [300, 700], [500, 696], [700, 700], [830, 726], [700, 746], [500, 752], [300, 746]], 1), 'stoneD');

// ---------------------------------------------------------------- the castle (back to front)
// rear tower behind the keep
{
  const cx = 628, w = 70, top = 360;
  R('rear-tower', drum(cx, w, top, 600, -0.5, 0.5, 8), 'stone');
  R('rear-tower-shade', drum(cx, w, top, 600, 0.2, 0.5, 8), 'stoneD');
  const c = cone(cx, w, top, 96, 10, 10);
  R('rear-tower-roof', c.roof, 'roof');
  R('rear-tower-roof-shade', c.shade, 'timber');
  R('rear-tower-window', arch(cx - 6, 404, 11, 432), 'gold');
  D(line([c.apex, [c.apex[0], c.apex[1] - 40]]), INK, 2.4, 0.9);
  R('rear-tower-flag', pennant(c.apex[0], c.apex[1] - 40, 56, 22, -1), 'violet');
}
// square keep with battlements
R('keep', crenWall(420, 580, 420, 640, 22, 7), 'stoneL');
R('keep-shade', rect(548, 420, 32, 220), 'stone');
R('keep-window-l', arch(462, 470, 15, 512), 'gold');
R('keep-window-r', arch(518, 470, 15, 512), 'gold');
D(circle(490, 556, 14) + line([[490, 542], [490, 570]]) + line([[476, 556], [504, 556]]) + line([[462, 455], [462, 512]]) + line([[518, 455], [518, 512]]), INK, 1.6, 0.8);
D(line([[490, 398], [490, 330]]), INK, 2.6, 0.9);
R('keep-banner', pennant(490, 330, 80, 30, -1), 'pink');
// little turret on the keep's left shoulder
{
  const cx = 384, w = 58, top = 470;
  R('turret', drum(cx, w, top, 600, -0.5, 0.5, 8), 'stone');
  R('turret-shade', drum(cx, w, top, 600, 0.18, 0.5, 8), 'stoneD');
  const c = cone(cx, w, top, 76, 9, 9);
  R('turret-roof', c.roof, 'roof');
  R('turret-roof-shade', c.shade, 'timber');
  R('turret-window', arch(cx - 4, 508, 9, 532), 'gold');
  D(line([c.apex, [c.apex[0], c.apex[1] - 34]]), INK, 2.2, 0.9);
  R('turret-flag', pennant(c.apex[0], c.apex[1] - 34, 46, 18, -1), 'gold');
}
// curtain wall and gatehouse
R('wall', crenWall(250, 750, 590, 712, 20, 19), 'stone');
R('gate-frame', arch(500, 664, 56, 712), 'stoneL');
R('gate', arch(500, 664, 42, 712), 'timber');
D(line([[486, 624], [486, 712]]) + line([[500, 622], [500, 712]]) + line([[514, 624], [514, 712]]) + line([[460, 660], [540, 660]]) + line([[458, 686], [542, 686]]), '#e7c67a', 1.8, 0.75);
for (const x of [300, 360, 420, 580, 640, 700]) D(line([[x, 652], [x, 680]]), INK, 3, 0.7);
// big drum towers at either end
for (const [id, cx, top, rh, flag, flip] of [['tower-l', 232, 500, 132, 'coral', -1], ['tower-r', 768, 516, 120, 'teal', -1]] as [string, number, number, number, string, number][]) {
  const w = 132;
  R(id, drum(cx, w, top, 716), 'stoneL');
  R(`${id}-shade`, drum(cx, w, top, 716, 0.2, 0.5), 'stone');
  R(`${id}-band`, drum(cx, w, top + 6, top + 22, -0.5, 0.5, 12), 'stoneD');
  const c = cone(cx, w, top, rh);
  R(`${id}-roof`, c.roof, 'roof');
  R(`${id}-roof-shade`, c.shade, 'timber');
  R(`${id}-window`, arch(cx - 10, top + 74, 16, top + 118), 'gold');
  D(arch(cx - 10, top + 158, 9, top + 182), INK, 1.6, 0.7);
  D(line([[cx - 10, top + 58], [cx - 10, top + 118]]) + line([[cx - 26, top + 92], [cx + 6, top + 92]]), INK, 1.6, 0.8);
  D(line([c.apex, [c.apex[0], c.apex[1] - 46]]), INK, 2.6, 0.9);
  R(`${id}-flag`, pennant(c.apex[0], c.apex[1] - 46, 66, 26, flip), flag);
}
// stonework hints
D(line([[270, 650], [292, 650]]) + line([[330, 690], [356, 690]]) + line([[610, 696], [640, 696]]) + line([[680, 648], [706, 648]]) + line([[440, 600], [466, 600]]) + line([[180, 620], [204, 620]]) + line([[256, 680], [280, 680]]) + line([[730, 640], [754, 640]]) + line([[800, 690], [826, 690]]), INK, 1.3, 0.45);

// ---------------------------------------------------------------- road down to the village
R('road', band([[500, 712], [536, 790], [492, 880], [528, 990], [496, 1110], [516, 1250]], 64, 140), 'cream');
D(curve([[520, 760], [540, 790], [510, 830]]) + curve([[500, 930], [530, 960], [520, 1000]]) + curve([[510, 1120], [490, 1160], [520, 1210]]), '#cdb98e', 1.4, 0.6);

// ---------------------------------------------------------------- village
const glow = 'gold';
cottage(R, D, 'house-1', 46, 1092, 150, 92, 72, { wall: 'cream', roof: 'roof', door: 'timber', glow });
cottage(R, D, 'house-2', 254, 1018, 118, 72, 58, { wall: 'stoneL', roof: 'timber', door: 'roof', glow }, true);
cottage(R, D, 'house-3', 636, 1014, 126, 80, 62, { wall: 'cream', roof: 'coral', door: 'timber', glow }, true);
cottage(R, D, 'house-4', 806, 1104, 160, 96, 74, { wall: 'stoneL', roof: 'roof', door: 'timber', glow });
cottage(R, D, 'house-5', 128, 1236, 166, 100, 78, { wall: 'cream', roof: 'coral', door: 'timber', glow }, true);
cottage(R, D, 'house-6', 690, 1240, 170, 102, 80, { wall: 'cream', roof: 'roof', door: 'timber', glow });
// trees between the houses
for (const [id, x, y, r] of [['tree-1', 400, 1080, 50], ['tree-3', 962, 1168, 42]] as [string, number, number, number][]) {
  R(`${id}-trunk`, rect(x - 7, y + r * 0.5, 14, r * 0.9, 4), 'timber');
  R(`${id}`, lobed(x, y, r * 0.86, r, 7, 0.12, 10), 'hillD');
}
// chimney smoke curls
D(curve([[160, 990], [150, 960], [168, 930], [156, 900]]) + curve([[900, 1000], [890, 970], [906, 940]]), '#c8c3d6', 2, 0.5);
// meadow tufts
for (const [x, y] of [[40, 1150], [330, 1120], [600, 1210], [612, 1060], [420, 1220], [320, 1236]] as Pt[]) D(line([[x, y], [x - 6, y - 16]]) + line([[x + 6, y], [x + 6, y - 20]]) + line([[x + 12, y], [x + 18, y - 14]]), '#2f4d48', 1.6, 0.7);

const activity: PaintActivity = {
  id: 'fairytale-paint-1', version: 1, mode: 'paint', title: 'Castle Fireworks',
  blurb: 'Fireworks bloom over a hilltop castle of round red-roofed towers, while the village below glows warm in the night.',
  collectionId: 'fairytale', categories: ["Fairytale"], difficulty: 'Detailed',
  width: W, height: H,
  palette: [
    { id: 'nightDeep', number: 1, name: 'Midnight', hex: '#1e2547' },
    { id: 'night', number: 2, name: 'Night blue', hex: '#33407a' },
    { id: 'dusk', number: 3, name: 'Distant hills', hex: '#5a5f9c' },
    { id: 'pink', number: 4, name: 'Rose spark', hex: '#ef8fb4' },
    { id: 'gold', number: 5, name: 'Golden glow', hex: '#f6cd5f' },
    { id: 'coral', number: 6, name: 'Ember', hex: '#ec7357' },
    { id: 'teal', number: 7, name: 'Sea spark', hex: '#62c7b9' },
    { id: 'violet', number: 8, name: 'Violet spark', hex: '#a68be0' },
    { id: 'stoneL', number: 9, name: 'Pale stone', hex: '#e4dccd' },
    { id: 'stone', number: 10, name: 'Castle stone', hex: '#b3a9b4' },
    { id: 'stoneD', number: 11, name: 'Stone shadow', hex: '#7d7390' },
    { id: 'roof', number: 12, name: 'Brick red', hex: '#b8443d' },
    { id: 'hillD', number: 13, name: 'Pine hill', hex: '#2f4d48' },
    { id: 'hillL', number: 14, name: 'Meadow', hex: '#4f7356' },
    { id: 'cream', number: 15, name: 'Moonlight cream', hex: '#f3e6c4' },
    { id: 'timber', number: 16, name: 'Timber', hex: '#6b4836' },
  ],
  regions,
  detail,
};
export default activity;
