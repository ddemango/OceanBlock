import { rect, ellipse, circle, poly, line, curve, blob, leaf, sector, xf, stroke, rng } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { Pt } from '../../art/geometry';
import type { PaintActivity, PaintRegion, PaletteColor } from '../types';
import { n, limb, scallop } from './props-paint';

const W = 1000, H = 1250;

const palette: PaletteColor[] = [
  { id: 'sky', number: 1, name: 'Spring sky', hex: '#d3e7ee' },
  { id: 'cream', number: 2, name: 'Rice paper', hex: '#fbf2de' },
  { id: 'mountain', number: 3, name: 'Distant mountain', hex: '#a7afd0' },
  { id: 'hills', number: 4, name: 'Pine green', hex: '#4e7e60' },
  { id: 'grass', number: 5, name: 'Spring grass', hex: '#9cc276' },
  { id: 'vermilion', number: 6, name: 'Vermilion', hex: '#d34a3a' },
  { id: 'vermDark', number: 7, name: 'Lacquer shadow', hex: '#92302b' },
  { id: 'slate', number: 8, name: 'Roof slate', hex: '#3e4a5f' },
  { id: 'gold', number: 9, name: 'Temple gold', hex: '#e4b24a' },
  { id: 'wood', number: 10, name: 'Cherry bark', hex: '#6a4839' },
  { id: 'pale', number: 11, name: 'Blossom white', hex: '#fadbe3' },
  { id: 'pink', number: 12, name: 'Blossom pink', hex: '#f1a6bc' },
  { id: 'deep', number: 13, name: 'Deep blossom', hex: '#d8708f' },
  { id: 'water', number: 14, name: 'Pond water', hex: '#80bdc4' },
  { id: 'waterDeep', number: 15, name: 'Deep water', hex: '#4f8fa2' },
  { id: 'koi', number: 16, name: 'Koi orange', hex: '#f08b3b' },
  { id: 'stone', number: 17, name: 'Lantern stone', hex: '#bdb7ab' },
  { id: 'stoneDark', number: 18, name: 'Mossy stone', hex: '#878275' },
];

const regions: PaintRegion[] = [];
const R = (id: string, d: string, color: string) => { regions.push({ id, d, color }); };
const detail: Shape[] = [];

// ---------- sky, mountain, far bank ----------
R('sky', rect(0, 0, W, 640), 'sky');
R('sun', circle(590, 118, 58), 'cream');
R('mountain', curve([[0, 450], [120, 428], [240, 440], [360, 420], [460, 396], [560, 360], [640, 330], [720, 362], [820, 410], [920, 432], [W, 446]], 0.8) + `L${W} 640L0 640Z`, 'mountain');
R('mountain-snow', blob([[588, 350], [616, 336], [640, 330], [666, 338], [694, 352], [672, 360], [654, 352], [636, 366], [616, 354], [600, 364]], 0.6), 'cream');
R('hills', curve([[0, 560], [100, 540], [220, 556], [340, 536], [460, 552], [600, 530], [740, 548], [860, 532], [W, 548]], 0.8) + `L${W} 700L0 700Z`, 'hills');
R('far-bank', curve([[0, 620], [200, 606], [400, 615], [600, 604], [800, 614], [W, 606]], 0.8) + `L${W} 900L0 900Z`, 'grass');
R('bush-1', scallop(800, 604, 96, 46, 9), 'hills');
R('bush-2', scallop(912, 612, 76, 40, 8), 'hills');

// ---------- pagoda ----------
const cx = 430;
R('spire', rect(423, 150, 14, 130, 7), 'gold');
detail.push(stroke(line([[416, 188], [444, 188]]) + line([[416, 206], [444, 206]]) + line([[416, 224], [444, 224]]) + line([[416, 242], [444, 242]]), '#a07a2a', 2.5));
function tier(id: string, yb: number, wallW: number, wallH: number, S: number) {
  const yr = yb - 44;
  R(`${id}-wall`, rect(cx - wallW / 2, yb + 8, wallW, wallH), 'vermilion');
  R(`${id}-window`, rect(cx - wallW * 0.2, yb + 36, wallW * 0.4, Math.min(wallH - 44, 56), 4), 'slate');
  R(`${id}-eave`, poly([[cx - S + 26, yb + 6], [cx + S - 26, yb + 6], [cx + wallW / 2 + 8, yb + 26], [cx - wallW / 2 - 8, yb + 26]]), 'vermDark');
  R(`${id}-roof`, `M${n(cx - S)} ${n(yb - 10)}Q${n(cx - S + 34)} ${n(yb - 2)} ${n(cx - wallW * 0.42)} ${n(yr)}L${n(cx + wallW * 0.42)} ${n(yr)}Q${n(cx + S - 34)} ${n(yb - 2)} ${n(cx + S)} ${n(yb - 10)}L${n(cx + S - 20)} ${n(yb + 8)}Q${n(cx)} ${n(yb + 18)} ${n(cx - S + 20)} ${n(yb + 8)}Z`, 'slate');
  let t = '';
  for (let k = -3; k <= 3; k++) {
    const x0 = cx + k * wallW * 0.13, x1 = cx + k * (S - 30) / 3.2;
    t += line([[x0, yr + 4], [x1, yb + 4]]);
  }
  detail.push(stroke(t, '#5d6a80', 1.5));
}
tier('tier-3', 296, 96, 80, 104);
tier('tier-2', 384, 128, 86, 128);
tier('tier-1', 474, 170, 112, 156);
R('pagoda-base', rect(318, 584, 224, 30, 3), 'stone');
R('pagoda-steps', poly([[396, 612], [464, 612], [476, 640], [384, 640]]), 'stoneDark');
detail.push(stroke(line([[cx, 528], [cx, 584]]) + line([[cx - 70, 500], [cx - 70, 584]]) + line([[cx + 70, 500], [cx + 70, 584]]), '#92302b', 2));

// ---------- cherry tree on the far bank ----------
R('tree-trunk', limb([[190, 800], [178, 700], [196, 610], [170, 520]], 36, 20), 'wood');
R('tree-canopy', scallop(160, 372, 158, 126, 15), 'pink');
R('tree-branch-1', limb([[172, 528], [140, 440], [96, 360]], 18, 7), 'wood');
R('tree-branch-2', limb([[176, 520], [214, 440], [262, 370]], 16, 6), 'wood');
R('tree-light-1', scallop(110, 296, 62, 40, 8), 'pale');
R('tree-light-2', scallop(226, 300, 52, 34, 7), 'pale');
R('tree-light-3', scallop(50, 386, 44, 32, 7), 'pale');
R('tree-deep-1', scallop(196, 462, 88, 42, 9), 'deep');
R('tree-deep-2', scallop(58, 470, 58, 32, 7), 'deep');
R('tree-deep-3', scallop(278, 408, 40, 36, 7), 'deep');

// ---------- pond ----------
R('pond', rect(0, 880, W, H - 880), 'water');
R('pond-deep', curve([[0, 1176], [160, 1166], [330, 1180], [520, 1168], [700, 1182], [860, 1170], [W, 1178]], 0.8) + `L${W} ${H}L0 ${H}Z`, 'waterDeep');
const shore: [number, number, number][] = [[300, 882, 30], [420, 886, 24], [586, 880, 34], [716, 885, 26]];
shore.forEach(([x, y, r], i) => R(`shore-stone-${i + 1}`, ellipse(x, y, r, 11), i % 2 ? 'stoneDark' : 'stone'));

// the arched bridge
const deckY = (x: number) => 900 - 190 * Math.sin((Math.PI * (x - 40)) / 920);
const archY = (x: number) => 900 - 112 * Math.sin((Math.PI * (x - 160)) / 680);
const span = (a: number, b: number, f: (x: number) => number, dy = 0, step = 20): Pt[] => {
  const pts: Pt[] = [];
  const k = Math.ceil(Math.abs(b - a) / step);
  for (let i = 0; i <= k; i++) { const x = a + ((b - a) * i) / k; pts.push([x, f(x) + dy]); }
  return pts;
};
{
  const top = span(40, 960, (x) => 900 - (900 - deckY(x)) * -0.55, 0).map(([x, y]) => [x, y] as Pt);
  const wavy = top.reverse().map(([x, y], i) => [x, y + (i % 2 ? 5 : -3)] as Pt);
  const head: Pt[] = [[40, 900], [160, 900], ...span(160, 840, (x) => 900 + (900 - archY(x)) * 0.55), [840, 900]];
  R('bridge-reflection', poly(head).slice(0, -1) + curve(wavy, 0.9).replace(/^M/, 'L') + 'Z', 'vermDark');
}
// koi and lily pads
function koi(id: string, x: number, y: number, rot: number, body: string, patch: string) {
  const T = (d: string) => xf(d, { rot, x, y });
  R(`${id}-tail`, T(blob([[-44, 0], [-80, -24], [-70, 0], [-80, 24]], 0.6)), 'cream');
  R(`${id}-body`, T(blob([[56, 0], [46, -14], [20, -19], [-16, -15], [-42, -6], [-52, 0], [-42, 6], [-16, 15], [20, 19], [46, 14]], 1)), body);
  R(`${id}-patch`, T(blob([[32, -13], [10, -16], [-14, -10], [-4, 4], [22, 6]], 1)), patch);
  detail.push(stroke(T(leaf(8, -16, 26, 7, -150) + leaf(8, 16, 26, 7, 150)), '#c86a2a', 1.3));
  detail.push(stroke(T(circle(42, -6, 2.2) + circle(42, 6, 2.2)), '#3a3a3a', 1.6));
}
function pad(id: string, x: number, y: number, r: number, a: number) {
  R(id, xf(sector(0, 0, r, a + 18, a + 342), { sy: 0.42, x, y }), 'grass');
  detail.push(stroke(xf(line([[0, 0], [r * 0.8 * Math.cos(((a + 90) * Math.PI) / 180), r * 0.8 * Math.sin(((a + 90) * Math.PI) / 180)]]) + line([[0, 0], [r * 0.8 * Math.cos(((a + 220) * Math.PI) / 180), r * 0.8 * Math.sin(((a + 220) * Math.PI) / 180)]]), { sy: 0.42, x, y }), '#6f9a52', 1.4));
}
pad('lily-1', 430, 996, 60, 0);
pad('lily-2', 870, 1000, 58, 200);
pad('lily-3', 690, 1196, 70, 90);
pad('lily-4', 930, 1130, 46, 300);
koi('koi-1', 300, 1078, 18, 'koi', 'cream');
koi('koi-2', 560, 1140, -14, 'cream', 'koi');
koi('koi-3', 790, 1066, 196, 'koi', 'cream');
koi('koi-4', 420, 1214, 172, 'koi', 'cream');
R('lotus-petals', blob([[846, 990], [850, 964], [862, 976], [870, 950], [880, 976], [892, 964], [896, 990], [872, 998]], 0.5), 'deep');
R('lotus-heart', ellipse(871, 988, 12, 6), 'gold');

{
  const top = span(40, 960, deckY);
  const body: Pt[] = [...top, [840, 900], ...span(840, 160, archY).slice(1, -1), [160, 900]];
  R('bridge-body', poly(body), 'vermilion');
  const trim = [...span(52, 948, deckY, -1), ...span(948, 52, deckY, 15)];
  R('bridge-trim', poly(trim), 'gold');
  // rail with posts as one outline
  const posts = [70, 200, 330, 460, 540, 670, 800, 930];
  const rail: Pt[] = [];
  for (const [x, y] of span(62, 938, deckY, -64, 12)) rail.push([x, y]);
  const back: Pt[] = [];
  const pw = 14;
  const xsBottom = span(938, 62, deckY, -50, 12).filter(([x], i, all) => i === 0 || i === all.length - 1 || !posts.some((p) => Math.abs(x - p) <= pw / 2 + 1));
  for (let i = 0; i < xsBottom.length; i++) {
    const [x, y] = xsBottom[i];
    back.push([x, y]);
    const nx = xsBottom[i + 1]?.[0];
    for (const p of posts) {
      if (nx !== undefined && p + pw / 2 <= x && p + pw / 2 > nx) {
        back.push([p + pw / 2, deckY(p + pw / 2) - 50], [p + pw / 2, deckY(p + pw / 2) + 2], [p - pw / 2, deckY(p - pw / 2) + 2], [p - pw / 2, deckY(p - pw / 2) - 50]);
      }
    }
  }
  R('bridge-rail', poly([...rail, ...back]), 'vermilion');
  R('bridge-finial-l', blob([[54, deckY(62) - 64], [62, deckY(62) - 92], [70, deckY(62) - 104], [78, deckY(62) - 92], [86, deckY(62) - 64]], 0.8), 'gold');
  R('bridge-finial-r', blob([[914, deckY(938) - 64], [922, deckY(938) - 92], [930, deckY(938) - 104], [938, deckY(938) - 92], [946, deckY(938) - 64]], 0.8), 'gold');
  let planks = '';
  for (let x = 90; x < 920; x += 40) planks += line([[x, deckY(x) + 18], [x, deckY(x) + 34]]);
  detail.push(stroke(planks, '#92302b', 1.5));
}

// ---------- foreground bank and stone lantern ----------
R('near-bank', curve([[0, 1006], [80, 1026], [160, 1076], [230, 1156], [276, H]], 0.9) + `L0 ${H}Z`, 'hills');
R('iris-1', leaf(28, 1236, 190, 14, -78), 'grass');
R('iris-2', leaf(214, 1246, 150, 12, -104), 'grass');
R('lantern-base', rect(96, 1146, 68, 28, 3), 'stoneDark');
R('lantern-pillar', rect(116, 1062, 28, 86), 'stone');
R('lantern-platform', rect(94, 1042, 72, 22, 4), 'stoneDark');
R('lantern-box', rect(104, 990, 52, 54, 3), 'stone');
R('lantern-light', rect(118, 1002, 24, 30, 3), 'gold');
R('lantern-roof', 'M72 996Q98 992 112 960L148 960Q162 992 188 996L178 1006L82 1006Z', 'stoneDark');
R('lantern-top', circle(130, 946, 14), 'stone');

// ---------- overhanging branch with paper lanterns ----------
R('branch-main', limb([[976, 80], [900, 106], [780, 168], [640, 238]], 40, 9), 'wood');
R('branch-twig', limb([[880, 116], [830, 62], [764, 28]], 16, 6), 'wood');
R('bloom-r1', scallop(926, 92, 70, 48, 9), 'pink');
R('bloom-r2', scallop(828, 150, 70, 44, 9), 'pink');
R('bloom-r3', scallop(690, 232, 56, 36, 8), 'pink');
R('bloom-r4', scallop(784, 40, 58, 32, 8), 'pink');
R('bloom-r5', scallop(924, 64, 46, 30, 7), 'pale');
R('bloom-r6', scallop(800, 130, 40, 26, 7), 'pale');
R('bloom-r7', scallop(744, 26, 34, 20, 6), 'pale');
R('bloom-r8', scallop(956, 128, 40, 26, 7), 'deep');
R('bloom-r9', scallop(712, 254, 30, 20, 6), 'deep');
for (const [i, x, y] of [[1, 760, 300], [2, 900, 246]] as [number, number, number][]) {
  detail.push(stroke(line([[x, y - 120], [x, y - 44]]), '#3e4a5f', 1.6));
  R(`paper-lantern-${i}-top`, rect(x - 16, y - 46, 32, 12, 3), 'slate');
  R(`paper-lantern-${i}`, ellipse(x, y, 30, 38), 'vermilion');
  R(`paper-lantern-${i}-bottom`, rect(x - 16, y + 34, 32, 12, 3), 'slate');
  detail.push(stroke(curve([[x - 15, y - 33], [x - 22, y], [x - 15, y + 33]]) + curve([[x + 15, y - 33], [x + 22, y], [x + 15, y + 33]]) + line([[x, y - 37], [x, y + 37]]), '#92302b', 1.5));
  detail.push(stroke(line([[x - 6, y + 48], [x - 6, y + 70]]) + line([[x, y + 48], [x, y + 74]]) + line([[x + 6, y + 48], [x + 6, y + 70]]), '#e4b24a', 1.6));
}

// ---------- line work: ripples, petals, bark ----------
detail.push(stroke(curve([[40, 960], [80, 956], [120, 960]]) + curve([[600, 1020], [650, 1016], [700, 1020]]) + curve([[200, 1150], [250, 1146], [300, 1150]]) + curve([[820, 1240], [870, 1236], [920, 1240]]) + curve([[460, 1060], [500, 1056], [540, 1060]]), '#ffffff', 2, { opacity: 0.7 }));
{
  const r = rng(808);
  let d = '';
  for (let i = 0; i < 26; i++) {
    const x = r.range(30, 970), y = r.range(910, 1240);
    d += ellipse(x, y, 4, 2.4, r.range(0, 180));
  }
  detail.push(stroke(d, '#f1a6bc', 1.6));
  let s = '';
  for (let i = 0; i < 18; i++) {
    const x = r.range(20, 990), y = r.range(20, 520);
    s += ellipse(x, y, 3.5, 2, r.range(0, 180));
  }
  detail.push(stroke(s, '#f1a6bc', 1.4, { opacity: 0.8 }));
}
detail.push(stroke(curve([[184, 760], [178, 700], [190, 640]]) + curve([[960, 84], [900, 108], [860, 124]]), '#4a3127', 1.5));

const activity: PaintActivity = {
  id: 'travel-paint-2', version: 1, mode: 'paint', title: 'Temple in Blossom',
  blurb: 'A tiered temple glimpsed through cherry blossom, with a lacquered bridge arching over a pond of drifting koi.',
  collectionId: 'travel', categories: ['Travel', 'Architecture', 'Flowers'], difficulty: 'Moderate',
  width: W, height: H, palette, regions, detail,
};
export default activity;
