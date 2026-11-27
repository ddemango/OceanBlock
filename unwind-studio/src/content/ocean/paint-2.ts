import { rect, ellipse, circle, poly, star, curve, line } from '../../art/kit';
import type { PaintActivity, PaletteColor } from '../types';
import { canvas, sample, below, cloud, puff, foamCap, dolphin, M, Q, type Pt } from './props-paint';

const W = 1000, H = 1250, HOR = 620;

const palette: PaletteColor[] = [
  { id: 'dusk', number: 1, name: 'Dusk violet', hex: '#6a629e' },
  { id: 'rose', number: 2, name: 'Rose sky', hex: '#e08a9c' },
  { id: 'orange', number: 3, name: 'Tangerine', hex: '#f6a868' },
  { id: 'gold', number: 4, name: 'Evening gold', hex: '#fbd58c' },
  { id: 'sun', number: 5, name: 'Low sun', hex: '#fff3c4' },
  { id: 'cloud', number: 6, name: 'Blush cloud', hex: '#f7c0b4' },
  { id: 'mauve', number: 7, name: 'Mauve', hex: '#a680ae' },
  { id: 'plum', number: 8, name: 'Island plum', hex: '#4d4070' },
  { id: 'peach', number: 9, name: 'Sunlit water', hex: '#f6c394' },
  { id: 'seaM', number: 10, name: 'Lagoon teal', hex: '#4fa3ae' },
  { id: 'seaD', number: 11, name: 'Evening sea', hex: '#2f7892' },
  { id: 'deep', number: 12, name: 'Deep water', hex: '#1f5475' },
  { id: 'foam', number: 13, name: 'Sea foam', hex: '#fdfaf0' },
  { id: 'dolphin', number: 14, name: 'Dolphin grey', hex: '#7396b4' },
  { id: 'dolphinD', number: 15, name: 'Slate fin', hex: '#48688c' },
  { id: 'belly', number: 16, name: 'Silver belly', hex: '#dfe8ec' },
  { id: 'hull', number: 17, name: 'Boat red', hex: '#c9543f' },
];

const { regions, detail, R, D } = canvas();

// ---------------------------------------------------------------- sunset sky
R('sky-dusk', rect(0, 0, W, HOR + 4), 'dusk');
R('sky-rose', below(sample([[0, 214], [250, 184], [520, 222], [760, 188], [1000, 208]]), HOR + 4), 'rose');
R('sky-orange', below(sample([[0, 372], [220, 396], [480, 362], [740, 394], [1000, 366]]), HOR + 4), 'orange');
R('sky-gold', below(sample([[0, 506], [260, 486], [520, 512], [780, 488], [1000, 504]]), HOR + 4), 'gold');
R('star-1', star(120, 70, 15, 6.5, 4, -90), 'sun');
R('star-2', star(560, 108, 13, 6, 4, -90), 'sun');
R('star-3', star(930, 60, 12, 5.5, 4, -90), 'sun');
R('sun', circle(380, HOR + 6, 118), 'sun');
function sunsetCloud(id: string, cx: number, base: number, w: number, h: number, k: number, ph: number) {
  R(id, cloud(cx, base, w, h, k, ph), 'cloud');
  R(`${id}-shade`, cloud(cx + w * 0.04, base, w * 0.84, h * 0.42, k, ph + 0.8), 'mauve');
}
sunsetCloud('cloud-1', 800, 150, 400, 62, 6, 0.4);
sunsetCloud('cloud-2', 170, 300, 300, 50, 5, 1.2);
sunsetCloud('cloud-3', 560, 268, 230, 40, 4, 0.2);
D(curve([[560, 566], [572, 556], [584, 566]]) + curve([[584, 566], [596, 556], [608, 566]]) + curve([[626, 540], [635, 532], [644, 540]]) + curve([[644, 540], [653, 532], [662, 540]]), '#6b4a66', 2.2);

// ---------------------------------------------------------------- islands and the sailboat
R('island-far', below(sample([[690, HOR], [770, 590], [850, 562], [930, 574], [1000, 556]]), HOR + 4), 'mauve');
R('island-near', below(sample([[850, HOR], [900, 598], [950, 584], [1000, 590]]), HOR + 4), 'plum');

// ---------------------------------------------------------------- the sea
R('sea-far', rect(0, HOR, W, H - HOR), 'seaM');
R('sea-mid', below(sample([[0, 716], [200, 706], [420, 722], [640, 708], [840, 720], [1000, 710]]), H), 'seaD');
R('sea-near', below(sample([[0, 930], [180, 912], [400, 936], [620, 916], [820, 934], [1000, 918]]), H), 'deep');
([[380, 644, 150, 11], [386, 672, 96, 10], [374, 700, 124, 10], [384, 750, 84, 11], [372, 800, 108, 12], [386, 860, 70, 12], [376, 962, 92, 13]] as number[][]).forEach(([x, y, rx, ry], i) => {
  R(`glint-${i + 1}`, ellipse(x, y, rx, ry), 'peach');
});
R('ripple-1', ellipse(880, 676, 70, 8), 'peach');
R('ripple-2', ellipse(610, 792, 60, 9), 'seaM');
R('ripple-3', ellipse(200, 1010, 84, 11), 'seaD');
R('ripple-4', ellipse(520, 1040, 64, 10), 'seaD');

// sailboat
R('boat-hull', poly([[726, 606], [822, 606], [806, 628], [740, 628]]), 'hull');
R('boat-mainsail', poly([[778, 600], [778, 506], [826, 600]]), 'foam');
R('boat-jib', poly([[770, 600], [770, 524], [730, 600]]), 'cloud');
D(line([[774, 498], [774, 606]]), '#4d4070', 2.4);

// ---------------------------------------------------------------- a third dolphin surfacing
R('surfacing-fin', M(744, 912) + Q(748, 872, 718, 850) + Q(786, 860, 802, 912) + 'Z', 'dolphinD');
R('surfacing-back', M(620, 972) + Q(760, 852, 900, 972) + Q(760, 990, 620, 972) + 'Z', 'dolphin');
R('surfacing-foam-left', puff(626, 974, 56, 20, 6, 0.4), 'foam');
R('surfacing-foam-right', puff(894, 974, 50, 18, 6, 1.4), 'foam');

// ---------------------------------------------------------------- the leaping pair
const colours = { body: 'dolphin', belly: 'belly', fin: 'dolphinD', eye: 'plum' };
R('splash-far', puff(662, 706, 74, 30, 8, 0.2), 'foam');
const smile2 = dolphin(R, 'dolphin-far', [[664, 640], [690, 400], [850, 330], [956, 500]], 40, colours);
R('splash-near', puff(104, 836, 104, 44, 9, 0.6), 'foam');
const smile1 = dolphin(R, 'dolphin-near', [[118, 700], [170, 330], [440, 240], [596, 486]], 62, colours);
D(smile1 + smile2, '#34506e', 2);
([[52, 742, 10], [176, 770, 9], [30, 668, 8], [204, 706, 8], [84, 792, 8.5], [716, 664, 8], [628, 650, 8.5], [748, 700, 7.5]] as number[][]).forEach(([x, y, r], i) => {
  R(`droplet-${i + 1}`, circle(x, y, r), 'foam');
});

// ---------------------------------------------------------------- foreground swells
const SWELL1 = sample([[0, 1110], [140, 1076], [300, 1092], [470, 1136], [640, 1108], [820, 1082], [1000, 1116]], 10);
const SWELL2 = sample([[0, 1202], [200, 1178], [420, 1206], [640, 1184], [840, 1204], [1000, 1180]], 10);
R('swell-1', below(SWELL1, H), 'seaD');
R('swell-1-foam-left', foamCap(SWELL1.slice(2, 30), 26, 12, 5, 0.3), 'foam');
R('swell-1-foam-right', foamCap(SWELL1.slice(38, 58), 22, 11, 4, 1), 'foam');
R('swell-2', below(SWELL2, H), 'seaM');
R('swell-2-foam', foamCap(SWELL2.slice(12, 40), 22, 10, 6, 0.8), 'foam');
D(curve([[60, 1150], [130, 1140], [200, 1150]]) + curve([[700, 1140], [770, 1130], [850, 1142]]) + curve([[40, 1232], [110, 1224], [180, 1232]]) + curve([[760, 1232], [840, 1224], [920, 1232]]), '#bfe0e0', 2.2, 0.8);

const activity: PaintActivity = {
  id: 'ocean-paint-2', version: 1, mode: 'paint', title: 'Dolphins at Play',
  blurb: 'Two dolphins leap from the evening sea in a shower of spray while a little sailboat drifts past the setting sun.',
  collectionId: 'ocean', categories: ["Ocean", "Animals"], difficulty: 'Relaxed',
  added: '2026-11-26',
  width: W, height: H, palette, regions, detail,
};
export default activity;
