import { rect, ellipse, circle, poly, line, curve, blob, sh, stroke, place, rng, linearGradient, radialGradient, waveBand, type Xf } from '../../art/kit';
import type { Shape } from '../../art/types';
import type { FindActivity, FindItem } from '../types';
import {
  shadow, bubbles, rock, pebbles, branchCoral, brainCoral, fanCoral, tubeSponge, tableCoral, bubbleCoral, fingerCoral, anemone, kelp, seagrass,
  fish, school, turtle, seahorse, starfish, scallop, spiralShell, snailShell, pufferfish, jellyfish, crab, urchin, pearlClam, mantaRay, eel, type FishKind,
} from './props-find';

const ID = 'ocean-find-1';
const W = 1200, H = 1500;
const items: FindItem[] = [];
const scene = (...s: (Shape | Shape[])[]) => { items.push({ shapes: s.flat() }); };
const target = (id: string, name: string, shapes: Shape[]) => { items.push({ id, name, target: true, shapes }); };
const at = (shapes: Shape[], x: number, y: number, o: Xf = {}) => place(shapes, { x, y, ...o });
/** Flip a right-facing prop to face left. */
const L = (shapes: Shape[], x: number, y: number, rot = 0) => place(place(shapes, { sx: -1 }), { x, y, rot });

const defs =
  linearGradient(`${ID}-water`, [[0, '#9ee9e2'], [0.25, '#5cc6d6'], [0.65, '#3597c4'], [1, '#2a6fa6']]) +
  linearGradient(`${ID}-sand`, [[0, '#f6e7b8'], [1, '#e3c98e']]) +
  radialGradient(`${ID}-glow`, [[0, '#ffffff'], [1, '#9ee9e2']], 0.5, 0, 0.7);

// =====================================================================
// open water: surface light, rays, distant reef
// =====================================================================
scene(sh(rect(0, 0, W, H), `url(#${ID}-water)`));
scene(sh(ellipse(520, 0, 620, 170), `url(#${ID}-glow)`, { opacity: 0.24 }));
scene(
  sh(waveBand(0, W, 26, 9, 260, 0, 0.4), '#ffffff', { opacity: 0.22 }), sh(waveBand(0, W, 46, 7, 190, 0, 2), '#ffffff', { opacity: 0.14 }),
  stroke(curve([[0, 62], [150, 54], [300, 66], [450, 54], [600, 66], [750, 56], [900, 66], [1050, 56], [1200, 64]]), '#ffffff', 2.5, { opacity: 0.35 }),
);
{
  const rays: [number, number, number, number][] = [[120, 60, -60, 150], [330, 70, 200, 420], [520, 50, 480, 640], [700, 80, 760, 980], [900, 60, 1030, 1200], [1040, 50, 1250, 1400]];
  rays.forEach(([x, w, bx, bx2], i) => scene(sh(poly([[x, 0], [x + w, 0], [bx2, 1150], [bx, 1150]]), '#ffffff', { opacity: i % 2 ? 0.07 : 0.11 })));
}
// far reef silhouettes
scene(
  sh(blob([[-40, 1200], [-20, 760], [60, 640], [150, 700], [240, 620], [330, 760], [430, 800], [520, 900], [640, 880], [760, 800], [850, 660], [960, 600], [1060, 660], [1140, 560], [1240, 620], [1240, 1200]], 0.6), '#3e9cc0', { opacity: 0.55 }),
  sh(blob([[-40, 1200], [-20, 860], [90, 800], [200, 860], [330, 900], [470, 980], [640, 960], [800, 900], [900, 800], [1010, 760], [1120, 800], [1240, 740], [1240, 1200]], 0.6), '#3688b6', { opacity: 0.6 }),
);
{
  const far: Shape[] = [];
  for (const [x, h] of [[150, 190], [245, 150], [870, 170], [965, 210], [1150, 160]] as [number, number][]) far.push(...at(kelp(x, h, '#3f93b4', 30), x, 790));
  scene(far);
  scene(at(school(3, 16, 260, 90, 16, '#8fd6e6'), 300, 520, { rot: -8 }), L(school(4, 12, 220, 80, 14, '#8fd6e6'), 760, 470, 6), at(school(5, 10, 160, 60, 13, '#a9e2ea'), 1020, 420));
}
scene(at(bubbles(6, 9, 60, 420, 3, 8), 480, 560), at(bubbles(7, 8, 50, 380, 3, 7), 900, 500), at(bubbles(8, 7, 50, 300, 2.5, 6), 80, 560));

// --- swimmers in open water ---
target('manta', 'Manta ray', at(mantaRay(170, '#4f6f96'), 990, 180, { rot: 196, sy: 0.82 }));
scene(L(fish('slim', 62, '#f6d04a', '#f29a3a', '#3f6fc0'), 760, 150, -6), L(fish('slim', 54, '#f6d04a', '#f29a3a', '#3f6fc0'), 840, 205, -4), L(fish('slim', 48, '#f6d04a', '#f29a3a', '#3f6fc0'), 700, 220, -8));
target('jelly', 'Jellyfish', at(jellyfish(96, '#f4a3c4'), 160, 250, { rot: 8 }));
scene(at(jellyfish(44, '#c7b2f2'), 330, 140, { rot: -10 }), at(jellyfish(34, '#c7b2f2'), 560, 110, { rot: 6 }));
scene(at(school(11, 14, 240, 110, 26, '#f6a05a'), 420, 300, { rot: -6 }));
target('turtle', 'Sea turtle', at(turtle(250), 640, 430, { rot: -14 }));
scene(at(fish('round', 56, '#4a7fd6', '#f6d04a', '#2f4f9c'), 250, 470, { rot: 5 }), at(fish('round', 46, '#4a7fd6', '#f6d04a', '#2f4f9c'), 170, 520), at(fish('round', 40, '#4a7fd6', '#f6d04a', '#2f4f9c'), 310, 545, { rot: -6 }));
scene(L(fish('oval', 70, '#f2f2f2', '#2f3f5c', '#2f3f5c'), 1010, 400, 4), L(fish('oval', 58, '#f2f2f2', '#2f3f5c', '#2f3f5c'), 1100, 455, -4));
scene(L(school(12, 12, 200, 90, 22, '#e8607a'), 900, 560, 5));

// =====================================================================
// the reef: rocky outcrops crowded with coral
// =====================================================================
scene(at(rock(2, 380, 600, '#6f7fb0'), 80, 1240), at(rock(4, 330, 680, '#7a74ae'), 1130, 1240));
scene(at(fanCoral(11, 180, '#f0607e'), 70, 700), at(fanCoral(21, 210, '#c07fe0'), 1100, 610));
scene(at(kelp(51, 420, '#4fa86a', 50), 20, 1000), at(kelp(52, 470, '#3f9a70', 52), 1182, 900));
scene(at(rock(1, 560, 430, '#62759f'), 190, 1240), at(rock(3, 600, 520, '#5f78a4'), 1000, 1250));
scene(at(tubeSponge(12, 3, 150, '#f6a23d'), 215, 800), at(fingerCoral(14, 5, 120, '#b98ae0'), 110, 850), at(branchCoral(13, 150, '#ff9a80'), 345, 850));
scene(at(branchCoral(22, 180, '#ff8e6e'), 920, 760), at(tubeSponge(23, 4, 160, '#d27fdc'), 1120, 800));
scene(L(fish('tang', 64, '#8f6fd6', '#f6a03a', '#c9b6f2'), 470, 640, -5), L(fish('tang', 52, '#8f6fd6', '#f6a03a', '#c9b6f2'), 560, 700, 6));
target('puffer', 'Pufferfish', at(pufferfish(84), 400, 730, { rot: -4 }));
target('angel', 'Striped angelfish', L(fish('angel', 96, '#f6d86a', '#f29a3a', '#3f5fb0'), 830, 640, 4));
scene(at(tableCoral(16, 180, '#4fbcaa'), 95, 985), at(brainCoral(15, 150, '#ecc868'), 255, 965), at(bubbleCoral(17, 130, '#f285ac'), 385, 1010));
scene(at(tableCoral(24, 200, '#f4b44c'), 1010, 885), at(fingerCoral(26, 6, 130, '#f47f9e'), 1110, 965), at(brainCoral(25, 160, '#7fd4b4'), 860, 970));
target('seahorse', 'Seahorse', at(seahorse(96, '#f6c64a'), 1040, 770, { rot: 4 }));
scene(at(fish('parrot', 84, '#3fbfb0', '#f27fa8', '#f6d04a'), 620, 800, { rot: 4 }));
scene(L(fish('round', 44, '#f27a4a', '#fbf3df', '#b0402a'), 705, 900, -6), L(fish('round', 36, '#f27a4a', '#fbf3df', '#b0402a'), 760, 950, 4));
// central mound
scene(at(rock(5, 400, 250, '#6a80a8'), 620, 1245));
scene(sh(ellipse(600, 1085, 44, 26), '#22364f'), sh(ellipse(600, 1090, 34, 18), '#16263a'));
target('eel', 'Spotted eel', at(eel(150, '#9ab452'), 596, 1096));
scene(at(branchCoral(31, 120, '#f0708e'), 500, 1050), at(brainCoral(32, 120, '#f6a070'), 705, 1060), at(tubeSponge(33, 3, 100, '#f6d65e'), 770, 1120));
scene(at(anemone(18, 120, '#f8a85e', '#fff3c4'), 205, 1090), at(fanCoral(29, 140, '#f6a23a'), 862, 1090), at(bubbleCoral(27, 140, '#909ff2'), 960, 1065), at(anemone(28, 130, '#ec6492', '#ffe2f0'), 1118, 1095));
target('butterfly', 'Yellow butterflyfish', at(fish('butterfly', 78, '#f8d648', '#f6a030', '#ffffff'), 300, 1150, { rot: -5 }));
scene(at(branchCoral(19, 130, '#f8d85e'), 45, 1130), at(anemone(34, 100, '#92d46c', '#f8ffb4'), 470, 1140));
scene(at(fish('slim', 50, '#62c4e8', '#3f7fc0', '#f6d04a'), 880, 1150, { rot: -5 }), at(fish('slim', 42, '#62c4e8', '#3f7fc0', '#f6d04a'), 800, 1180, { rot: 4 }));
scene(L(fish('oval', 52, '#f285ac', '#b0407a', '#fbf3df'), 150, 1140, 4));

// =====================================================================
// the sandy floor
// =====================================================================
scene(sh(waveBand(0, W, 1196, 12, 420, H, 1.2), `url(#${ID}-sand)`));
scene(stroke(curve([[0, 1200], [150, 1188], [320, 1198], [520, 1206], [700, 1196], [900, 1186], [1060, 1196], [1200, 1204]]), '#fff6d8', 3, { opacity: 0.7 }));
{
  const g = rng(41);
  let rip = '', grains = '', lt = '';
  for (let i = 0; i < 34; i++) { const y = g.range(1230, 1490), x = g.range(-20, W - 60), l = g.range(50, 130); rip += curve([[x, y], [x + l * 0.5, y - 5], [x + l, y]]); }
  for (let i = 0; i < 170; i++) grains += circle(g.range(0, W), g.range(1215, H), g.range(0.9, 2));
  for (let i = 0; i < 90; i++) lt += circle(g.range(0, W), g.range(1215, H), g.range(0.9, 1.8));
  scene(stroke(rip, '#cfae72', 1.6, { opacity: 0.55 }), sh(grains, '#c9a468', { opacity: 0.6 }), sh(lt, '#fffbe6', { opacity: 0.8 }));
  // dappled light on the sand
  let dapple = '';
  for (let i = 0; i < 16; i++) { const x = g.range(40, W - 40), y = g.range(1240, 1480); dapple += ellipse(x, y, g.range(30, 70), g.range(6, 12), g.range(-8, 8)); }
  scene(sh(dapple, '#ffffff', { opacity: 0.16 }));
}
scene(at(pebbles(42, 16, 300, 60, ['#b9a58c', '#8f9bb0', '#d9c8a8'], 6), 200, 1470), at(pebbles(43, 14, 260, 50, ['#b9a58c', '#8f9bb0', '#e9d8b8'], 6), 820, 1260), at(pebbles(44, 12, 240, 50, ['#a8b4c4', '#d9c8a8'], 5), 1040, 1480));
// rocks and plants on the floor
scene(shadow(120, 1300, 120, 14, 0.18), at(rock(45, 210, 110, '#7f86a8'), 120, 1300), shadow(430, 1222, 80, 9, 0.16), at(rock(46, 140, 62, '#8a84a8'), 430, 1224));
scene(at(seagrass(47, 90, 120, '#5fb072', 10), 30, 1320), at(seagrass(48, 80, 100, '#4fa27c', 9), 1150, 1300), at(seagrass(49, 70, 80, '#6fba6a', 8), 760, 1240));
target('urchin', 'Sea urchin', at(urchin(1, 74, '#6f4fa6'), 130, 1232));
target('starfish', 'Orange starfish', [shadow(432, 1196, 34, 8, 0.2), ...at(starfish(78, '#f6883a', 12), 432, 1186)]);
scene(at(starfish(46, '#b06fd0', -20), 965, 1300), at(starfish(38, '#ef6f8f', 30), 90, 1420));
target('clam', 'Clam with a pearl', [shadow(300, 1378, 62, 9, 0.2), ...at(pearlClam(120, '#b6a4dc'), 300, 1380, { rot: -3 })]);
target('crab', 'Red crab', [shadow(860, 1352, 44, 7, 0.2), ...at(crab(96, '#dc5a42'), 860, 1330)]);
target('scallop', 'Pink scallop shell', [shadow(640, 1420, 30, 6, 0.2), ...at(scallop(60, '#f49ab4'), 640, 1400, { rot: 14 })]);
target('conch', 'Spiral shell', [shadow(1040, 1432, 40, 7, 0.2), ...at(spiralShell(84, '#eab07a'), 1036, 1414, { rot: -8 })]);
scene(at(scallop(34, '#f6e2b0'), 520, 1300, { rot: -30 }), at(scallop(30, '#c9d8ee'), 760, 1450, { rot: 40 }), at(snailShell(28, '#d9a66a'), 220, 1250, { rot: 20 }), at(snailShell(24, '#b98ac0'), 1130, 1370), at(scallop(28, '#f6c89a'), 430, 1470, { rot: 160 }));
scene(L(fish('slim', 44, '#f6b04a', '#c9703a', '#fbf3df'), 560, 1250, 3), at(school(50, 9, 150, 50, 16, '#7fd6c8'), 1060, 1240, { rot: -4 }));
// foreground corals framing the bottom corners
scene(at(tubeSponge(61, 3, 120, '#f48a6a'), 1150, 1505), at(branchCoral(62, 150, '#ef6f9a'), 950, 1520), at(fingerCoral(63, 5, 100, '#f6c84a'), 545, 1520), at(anemone(64, 110, '#a884e6', '#f2e2ff'), 30, 1500));
scene(at(bubbles(71, 10, 50, 520, 3, 9), 600, 1060), at(bubbles(72, 8, 40, 400, 3, 8), 1118, 1040), at(bubbles(73, 8, 40, 420, 3, 8), 205, 1030), at(bubbles(74, 6, 30, 260, 2.5, 6), 300, 1330));

const a: FindActivity = {
  id: 'ocean-find-1', version: 1, mode: 'find', title: 'Coral Reef', blurb: 'Drift over a sunlit reef where a turtle glides past and shy creatures hide among the corals.',
  collectionId: 'ocean', categories: ["Ocean", "Animals"], difficulty: 'Moderate',
  added: '2026-11-26',
  width: W, height: H, defs, items,
};
export default a;
