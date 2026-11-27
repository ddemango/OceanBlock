import { rect, ellipse, circle, poly, line, curve, blob, leaf, sh, stroke, place, shade, rng, linearGradient, radialGradient, waveBand, type Xf } from '../../art/kit';
import type { Pt } from '../../art/geometry';
import type { Shape } from '../../art/types';
import type { FindActivity, FindItem } from '../types';
import {
  M, L, Q, ol, hl, shadow, bubbles, rock, pebbles, branchCoral, brainCoral, fanCoral, tubeSponge, bubbleCoral, anemone, kelp, seagrass, taper,
  fish, school, turtle, jellyfish, starfish, scallop, snailShell, crab, octopus,
  coins, chest, anchor, barrel, shipWheel, lantern, bottle, crown, key, bell, cannon, spyglass, compass, goblet, necklace, mapScroll, boot, porthole, crate, amphora, chain,
} from './props-find';

const ID = 'ocean-find-2';
const W = 1200, H = 1500;
const items: FindItem[] = [];
const scene = (...s: (Shape | Shape[])[]) => { items.push({ shapes: s.flat() }); };
const target = (id: string, name: string, shapes: Shape[]) => { items.push({ id, name, target: true, shapes }); };
const at = (shapes: Shape[], x: number, y: number, o: Xf = {}) => place(shapes, { x, y, ...o });
const flip = (shapes: Shape[], x: number, y: number, rot = 0) => place(place(shapes, { sx: -1 }), { x, y, rot });

// The wreck is drawn in its own coordinates (deck at y = -146, bow to the left)
// and then tilted so the bow settles into the sand.
const SX = 620, SY = 1040, SR = -5;
const S = (...s: (Shape | Shape[])[]) => place(s.flat(), { x: SX, y: SY, rot: SR });
const WOOD = '#8f5d3d', WOOD_LT = '#b07a4e', WOOD_DK = '#5e3b28', CLOTH = '#ece2c4';

const defs =
  linearGradient(`${ID}-water`, [[0, '#7fd6d0'], [0.3, '#3fa3b4'], [0.7, '#256f92'], [1, '#1d5078']]) +
  linearGradient(`${ID}-sand`, [[0, '#e6dba8'], [1, '#bfae7c']]) +
  linearGradient(`${ID}-hull`, [[0, '#9a6642'], [0.55, '#85553a'], [1, '#5f4334']]) +
  radialGradient(`${ID}-glow`, [[0, '#ffffff'], [1, '#7fd6d0']], 0.5, 0, 0.7);

// =====================================================================
// deep water, light and the distant seabed
// =====================================================================
scene(sh(rect(0, 0, W, H), `url(#${ID}-water)`));
scene(sh(ellipse(640, 0, 640, 200), `url(#${ID}-glow)`, { opacity: 0.24 }));
scene(sh(waveBand(0, W, 24, 8, 240, 0, 1), '#ffffff', { opacity: 0.2 }), stroke(curve([[0, 50], [200, 42], [400, 54], [600, 42], [800, 54], [1000, 44], [1200, 52]]), '#ffffff', 2.4, { opacity: 0.3 }));
{
  const rays: [number, number, number, number][] = [[180, 70, -40, 160], [400, 60, 300, 520], [600, 90, 600, 860], [820, 60, 900, 1100], [1000, 70, 1180, 1380]];
  rays.forEach(([x, w, bx, bx2], i) => scene(sh(poly([[x, 0], [x + w, 0], [bx2, 1200], [bx, 1200]]), '#ffffff', { opacity: i % 2 ? 0.06 : 0.1 })));
}
// distant rock spires and an arch
scene(
  sh(blob([[-40, 1200], [-30, 520], [30, 400], [90, 470], [120, 620], [190, 700], [230, 900], [300, 1200]], 0.6), '#2f86a0', { opacity: 0.55 }),
  sh(blob([[880, 1200], [930, 820], [990, 620], [1040, 480], [1110, 380], [1180, 440], [1240, 400], [1240, 1200]], 0.6), '#2f86a0', { opacity: 0.55 }),
  sh(blob([[330, 1200], [380, 960], [470, 900], [560, 940], [640, 900], [760, 960], [860, 1200]], 0.6), '#2b7c98', { opacity: 0.5 }),
);
{
  const far: Shape[] = [];
  for (const [x, h, y] of [[60, 300, 620], [150, 240, 760], [1010, 260, 640], [1150, 300, 480], [420, 180, 930], [760, 200, 950]] as [number, number, number][]) far.push(...at(kelp(x, h, '#2f8ba0', 32), x, y));
  scene(far);
}
scene(at(school(3, 18, 300, 100, 16, '#8fdcd6'), 300, 200, { rot: -6 }), flip(school(4, 14, 240, 90, 14, '#8fdcd6'), 930, 300, 5), at(school(5, 10, 160, 60, 12, '#a6e6dc'), 620, 110));
scene(at(turtle(84, '#5f8f7a', '#7fb89a'), 200, 330, { rot: -20 }), at(jellyfish(40, '#c9b6f4'), 1080, 150, { rot: 8 }), at(jellyfish(30, '#f4b6d6'), 1010, 230, { rot: -6 }));
scene(at(bubbles(6, 9, 60, 460, 3, 8), 540, 400), at(bubbles(7, 8, 50, 380, 3, 7), 860, 620), at(bubbles(8, 7, 40, 300, 2.5, 6), 110, 700));
// seabed behind the wreck
scene(sh(waveBand(0, W, 1050, 16, 520, H, 0.6), '#2f7f8f'), sh(waveBand(0, W, 1080, 12, 380, H, 2.4), '#3f8c92'));
// kelp forest framing the wreck
scene(at(kelp(11, 760, '#3f9a6a', 56), 40, 1150), at(kelp(12, 640, '#4fa872', 50), 120, 1160), at(kelp(13, 820, '#3a9272', 58), 1160, 1150), at(kelp(14, 600, '#56ac6a', 50), 1090, 1150));

// =====================================================================
// the wreck: masts, sail and rigging
// =====================================================================
// far-side rail and mizzen mast
{
  let posts = '';
  for (let x = -350; x <= 230; x += 29) posts += line([[x + 8, -150], [x + 8, -176]]);
  scene(S(stroke(posts + line([[-350, -178], [240, -178]]), WOOD_DK, 4)));
}
scene(S(
  ol(poly([[332, -236], [350, -236], [347, -500], [337, -500]]), WOOD, 1.4, -0.4), sh(poly([[344, -236], [350, -236], [347, -500], [344, -500]]), '#000000', { opacity: 0.15 }),
  ol(poly([[262, -420], [262, -430], [424, -446], [424, -436]]), WOOD_LT, 1.2, -0.45), ol(taper([[270, -420], [342, -410], [416, -430]], 16, 14, 5), CLOTH, 1.2, -0.3),
  stroke(line([[300, -424], [300, -408]]) + line([[342, -420], [342, -402]]) + line([[386, -428], [386, -412]]), '#8a6a4a', 2.2),
  ol(poly([[346, -498], [410, -486], [392, -476], [414, -462], [346, -468]]), '#d85a48', 1, -0.3), sh(poly([[346, -488], [396, -480], [392, -476], [346, -480]]), CLOTH),
  sh(circle(342, -503, 5), '#d9b24c'),
));
// main mast, crow's nest, yard and tattered sail
{
  const sail = M(-176, -404) + L(132, -448) + L(126, -300) + L(98, -250) + L(84, -288) + L(52, -232) + L(30, -276) + L(-6, -226) + L(-30, -262) + L(-70, -218) + L(-96, -258) + L(-128, -230) + L(-150, -280) + 'Z';
  scene(S(
    ol(sail, CLOTH, 1.6, -0.3), sh(poly([[-176, -404], [-120, -412], [-104, -250], [-128, -230], [-150, -280]]) + poly([[20, -432], [80, -440], [70, -262], [52, -232], [30, -276]]), '#d9cba6'),
    sh(ellipse(-56, -330, 17, 24, 12) + ellipse(96, -370, 11, 16, -8) + ellipse(-136, -356, 8, 12), '#2d7f9c'), stroke(ellipse(-56, -330, 17, 24, 12) + ellipse(96, -370, 11, 16, -8) + ellipse(-136, -356, 8, 12), '#b9a882', 1.6),
    ol(rect(-20, -390, 34, 30, 2), '#c9b68c', 1), stroke(line([[-16, -386], [10, -364]]) + line([[10, -386], [-16, -364]]) + curve([[-170, -398], [-20, -396], [128, -440]]), '#a8946a', 1.3),
  ));
  scene(S(
    ol(poly([[-22, -146], [2, -146], [-22, -596], [-30, -584], [-34, -604], [-40, -590], [-42, -600]]), WOOD, 1.6, -0.4), sh(poly([[-6, -146], [2, -146], [-22, -596], [-26, -590]]), '#000000', { opacity: 0.16 }),
    stroke(line([[-17, -200], [-21, -280]]) + line([[-22, -320], [-27, -420]]) + line([[-14, -250], [-16, -300]]), WOOD_DK, 1.2, { opacity: 0.6 }),
    sh(rect(-24, -214, 26, 7) + rect(-30, -384, 24, 7), '#56636f'),
    ol(poly([[-190, -396], [-190, -408], [150, -456], [150, -444]]), WOOD_LT, 1.4, -0.45),
    stroke(line([[-150, -402], [-150, -386]]) + line([[-80, -412], [-80, -396]]) + line([[60, -432], [60, -416]]) + line([[120, -440], [120, -424]]), '#8a6a4a', 2.4),
  ));
  // crow's nest
  let slats = '';
  for (let x = -62; x <= 2; x += 9) slats += line([[x, -520], [x + (x + 30) * 0.12, -488]]);
  scene(S(ol(poly([[-68, -522], [8, -522], [0, -486], [-58, -486]]), WOOD_LT, 1.4, -0.45), stroke(slats, WOOD_DK, 1.2), ol(rect(-72, -528, 84, 8, 3), WOOD, 1.2, -0.4), ol(rect(-62, -488, 66, 6, 2), WOOD, 1.2, -0.4)));
  // rigging and ratlines
  let rat = '';
  for (let i = 1; i < 9; i++) { const t = i / 9; rat += line([[-34 - 96 * t, -500 + 324 * t], [-26 - 36 * t, -500 + 324 * t]]); }
  scene(S(stroke(
    line([[-34, -500], [-130, -176]]) + line([[-26, -500], [-62, -176]]) + rat + curve([[-30, -580], [-220, -420], [-452, -176]]) + curve([[-26, -580], [110, -400], [236, -176]]) + curve([[340, -496], [180, -480], [-24, -560]]) + line([[150, -446], [150, -416]]),
    '#d9c79a', 1.5, { opacity: 0.85 },
  )));
}
// foremast stump and bowsprit
scene(S(
  ol(poly([[-284, -146], [-258, -146], [-262, -300], [-268, -286], [-274, -306], [-280, -290]]), WOOD, 1.5, -0.4), sh(poly([[-266, -146], [-258, -146], [-262, -296], [-266, -290]]), '#000000', { opacity: 0.16 }),
  sh(rect(-286, -206, 30, 7), '#56636f'), ol(poly([[-430, -168], [-436, -182], [-600, -262], [-598, -254]]), WOOD_LT, 1.3, -0.45),
  stroke(curve([[-590, -256], [-520, -196], [-462, -176]]) + curve([[-560, -244], [-500, -200], [-452, -182]]), '#d9c79a', 1.4, { opacity: 0.8 }),
));
scene(flip(school(21, 12, 200, 90, 20, '#f6c85a'), 800, 560, 6), at(school(22, 10, 170, 80, 18, '#f28a7a'), 330, 640, { rot: -8 }));

// =====================================================================
// the wreck: hull
// =====================================================================
const hull = M(-380, -146) + L(-470, -178) + Q(-430, 20, -270, 92) + L(300, 104) + Q(410, 96, 436, -30) + L(446, -236) + L(250, -236) + L(250, -146) + 'Z';
const plank = (f: number): Pt[] => [[-458 + f * 105, -168 + f * 232], [-200, -146 + f * 240], [100, -146 + f * 248], [330, -146 + f * 244], [436 + f * 2, -150 + f * 200]];
{
  let seams = '', butts = '', lt = '', dk = '';
  const g = rng(31);
  for (let k = 1; k < 9; k++) {
    seams += curve(plank(k / 9));
    for (let i = 0; i < 5; i++) { const x = g.range(-360, 400), y0 = -146 + (k / 9) * 244, y1 = -146 + ((k + 1) / 9) * 244; butts += line([[x, y0 + 2], [x, Math.min(y1, 96) - 2]]); }
  }
  for (let i = 0; i < 9; i++) {
    const k = g.int(0, 6), x = g.range(-330, 330), w = g.range(60, 130), y0 = -146 + (k / 9) * 244 + 3, hgt = 21;
    if (i % 2) lt += rect(x, y0, w, hgt, 2); else dk += rect(x, y0, w, hgt, 2);
  }
  scene(S(sh(hull, `url(#${ID}-hull)`, { stroke: WOOD_DK, strokeWidth: 2.5 })));
  scene(S(sh(lt, '#b98458', { opacity: 0.35 }), sh(dk, '#4a2f22', { opacity: 0.3 }), stroke(seams, WOOD_DK, 1.5, { opacity: 0.75 }), stroke(butts, WOOD_DK, 1.2, { opacity: 0.6 })));
  // wale, painted stripe and trim
  scene(S(
    stroke(curve(plank(0.115)), WOOD_LT, 10), stroke(curve(plank(0.085)), '#d9b24c', 2), stroke(curve(plank(0.145)), '#5e3b28', 1.4),
    sh(rect(250, -240, 198, 10, 3), '#c9a24a'), sh(rect(246, -152, 202, 9, 3), WOOD_LT), stroke(line([[-382, -148], [250, -148]]), WOOD_LT, 7),
    ol(poly([[-470, -178], [-452, -176], [-420, -40], [-440, -50]]), WOOD_LT, 1.2, -0.45),
  ));
  // stern cabin windows glowing warmly
  let win = '', mull = '';
  for (const x of [286, 338, 390]) { win += M(x - 15, -172) + L(x - 15, -206) + Q(x, -226, x + 15, -206) + L(x + 15, -172) + 'Z'; mull += line([[x, -220], [x, -172]]) + line([[x - 15, -196], [x + 15, -196]]); }
  scene(S(sh(win, '#ffe9a0', { stroke: '#c9a24a', strokeWidth: 3 }), stroke(mull, '#c9a24a', 2), sh(rect(270, -170, 138, 6, 2), '#c9a24a')));
  // algae and barnacles
  let algae = '', barn = '';
  for (let i = 0; i < 14; i++) { const x = g.range(-380, 420), y = g.range(10, 90); algae += ellipse(x, y, g.range(16, 40), g.range(5, 10), g.range(-10, 10)); }
  for (let i = 0; i < 50; i++) barn += circle(g.range(-400, 430), g.range(-120, 90), g.range(1.4, 3));
  scene(S(sh(algae, '#4f9a72', { opacity: 0.55 }), sh(barn, '#e6dcc4', { opacity: 0.8 })));
}
// the broken hole in the bow, with ribs showing inside
{
  const hole = poly([[-352, -30], [-330, -52], [-312, -38], [-290, -58], [-262, -44], [-240, -56], [-224, -20], [-236, 8], [-222, 30], [-250, 40], [-270, 30], [-300, 44], [-330, 34], [-344, 10], [-336, -8]]);
  scene(S(sh(hole, '#17303f', { stroke: '#4a2f22', strokeWidth: 3 }), stroke(curve([[-322, -40], [-314, 0], [-320, 36]]) + curve([[-276, -50], [-268, -6], [-274, 32]]) + curve([[-238, -40], [-232, -4], [-240, 30]]), '#6f4a34', 6)));
  scene(S(place(fish('round', 36, '#f6c85a', '#f29a3a', '#c9703a'), { x: -318, y: -12, rot: 8 })));
}
target('goblet', 'Golden goblet', S(place(goblet(50), { x: -276, y: 30, rot: -10 })));
scene(S(
  ol(poly([[-352, -30], [-366, -46], [-340, -40]]) + poly([[-224, -20], [-206, -30], [-218, -4]]) + poly([[-300, 44], [-292, 62], [-284, 38]]), WOOD_LT, 1, -0.45),
));
// portholes, with fish darting in and out
{
  const ports: [number, number][] = [[-130, -52], [10, -50], [150, -50], [290, -52]];
  const swimmers: (Shape[] | null)[] = [
    place(fish('oval', 54, '#f2f2f2', '#3f8fc0', '#3f8fc0'), { x: 16, y: 2 }), null,
    place(place(fish('round', 46, '#f28a7a', '#f6d86a', '#c9503a'), { sx: -1 }), { x: -14, y: -2 }), place(fish('slim', 50, '#8fe0c0', '#3fa890', '#f6d86a'), { x: 14, y: 0, rot: -8 }),
  ];
  ports.forEach(([x, y], i) => {
    const p = porthole(27);
    scene(S(place([p[0], ...(swimmers[i] ?? []), ...p.slice(1)], { x, y })));
  });
}
// near rail with a gap where it has broken away
{
  let posts = '';
  for (let x = -366; x <= 236; x += 29) if (x < -210 || x > -110) posts += line([[x, -148], [x, -178]]);
  scene(S(
    stroke(posts, WOOD, 6), stroke(line([[-372, -180], [-218, -180]]) + line([[-102, -180], [246, -180]]) + line([[-102, -180], [-124, -160]]), WOOD_LT, 6.5),
    stroke(line([[-372, -182], [-218, -182]]) + line([[-102, -182], [246, -182]]), '#d9b08a', 1.4, { opacity: 0.7 }),
  ));
  let qp = '';
  for (let x = 262; x <= 440; x += 30) qp += line([[x, -240], [x, -268]]);
  scene(S(stroke(qp, WOOD, 6), stroke(line([[254, -270], [446, -270]]), WOOD_LT, 6.5)));
}
// things growing on the wreck
scene(S(
  place(anemone(41, 60, '#f08a9a', '#ffe6ea'), { x: -60, y: -182 }), place(tubeSponge(42, 3, 56, '#f6b04a'), { x: 418, y: -272 }), place(brainCoral(43, 60, '#8fd4b4'), { x: 212, y: -150 }),
  place(seagrass(44, 40, 50, '#56ac6a', 6), { x: -330, y: -180 }), place(seagrass(45, 36, 44, '#4fa27c', 6), { x: 90, y: -182 }),
));
{
  let weed = '';
  for (const [x, l] of [[-300, 46], [-240, 60], [-20, 40], [60, 64], [200, 50], [330, 44], [400, 58]] as [number, number][]) weed += taper([[x, -142], [x + 6, -142 + l * 0.5], [x - 4, -142 + l]], 7, 2, 4) + taper([[x + 10, -142], [x + 6, -142 + l * 0.4], [x + 14, -142 + l * 0.7]], 6, 2, 4);
  scene(S(sh(weed, '#4f9a72', { opacity: 0.85 })));
}

// --- treasures on deck ---
target('wheel', "Ship's wheel", S(sh(poly([[292, -240], [308, -240], [304, -300], [296, -300]]), WOOD_DK), ...place(shipWheel(104), { x: 300, y: -312, rot: 10 })));
target('bell', 'Brass bell', S(
  stroke(line([[122, -150], [122, -236]]) + line([[178, -150], [178, -236]]), WOOD, 6), stroke(line([[116, -236], [184, -236]]), WOOD_LT, 7),
  ...place(bell(52), { x: 150, y: -206 }),
));
target('cannon', 'Cannon', S(place(cannon(150), { x: 20, y: -150 })));
target('lantern', 'Lantern', S(place(lantern(70), { x: 150, y: -382, rot: 4 })));
target('octopus', 'Octopus', S(place(octopus(150, '#e0709a'), { x: -196, y: -214, rot: 3 })));
scene(flip(fish('tang', 60, '#5f8fe0', '#f6d04a', '#bcd4f6'), 520, 760, -4), flip(fish('tang', 48, '#5f8fe0', '#f6d04a', '#bcd4f6'), 600, 800, 5), at(fish('parrot', 76, '#f28aa8', '#6fd0c0', '#f6d86a'), 930, 880, { rot: -6 }));

// =====================================================================
// the sandy seabed and scattered treasure
// =====================================================================
scene(sh(waveBand(0, W, 1118, 14, 460, H, 0.4), `url(#${ID}-sand)`));
scene(
  sh(blob([[620, 1140], [760, 1104], [900, 1094], [1040, 1100], [1130, 1130], [1000, 1150], [760, 1150]], 0.8), '#e6dba8'),
  stroke(curve([[0, 1124], [160, 1112], [330, 1124], [520, 1130], [700, 1112], [900, 1096], [1060, 1104], [1200, 1124]]), '#f6efca', 3, { opacity: 0.7 }),
);
{
  const g = rng(51);
  let rip = '', grains = '', lt = '', dapple = '';
  for (let i = 0; i < 40; i++) { const y = g.range(1160, 1490), x = g.range(-20, W - 60), l = g.range(50, 130); rip += curve([[x, y], [x + l * 0.5, y - 5], [x + l, y]]); }
  for (let i = 0; i < 190; i++) grains += circle(g.range(0, W), g.range(1140, H), g.range(0.9, 2));
  for (let i = 0; i < 90; i++) lt += circle(g.range(0, W), g.range(1140, H), g.range(0.9, 1.8));
  for (let i = 0; i < 16; i++) dapple += ellipse(g.range(40, W - 40), g.range(1170, 1480), g.range(30, 70), g.range(6, 12), g.range(-8, 8));
  scene(stroke(rip, '#a8966a', 1.6, { opacity: 0.5 }), sh(grains, '#9c8a5e', { opacity: 0.55 }), sh(lt, '#fbf6dc', { opacity: 0.75 }), sh(dapple, '#ffffff', { opacity: 0.14 }));
}
scene(at(pebbles(52, 16, 320, 60, ['#8f9aa8', '#b9a98c', '#6f8090'], 6), 700, 1480), at(pebbles(53, 12, 240, 50, ['#8f9aa8', '#c9b99c'], 6), 170, 1330), at(pebbles(54, 12, 220, 40, ['#7f8c9a', '#c9b99c'], 5), 1040, 1190));
// anchor and chain
scene(chain([[176, 1066], [200, 1010], [215, 960], [212, 930]], 13));
target('anchor', 'Anchor', [shadow(118, 1262, 90, 10, 0.2), ...at(anchor(220), 124, 1160, { rot: -16 })]);
scene(at(rock(55, 130, 60, '#6f8494'), 262, 1178), at(seagrass(56, 70, 90, '#56ac6a', 9), 36, 1210), at(anemone(57, 80, '#b88ae6', '#f0e2ff'), 268, 1128));
// cargo spilled to starboard
scene(
  ol(poly([[684, 1196], [690, 1182], [960, 1150], [962, 1162]]), WOOD_LT, 1.3, -0.45), stroke(line([[740, 1176], [744, 1192]]) + line([[880, 1160], [884, 1174]]), '#d9c79a', 4),
  shadow(906, 1238, 66, 9, 0.2), at(crate(92, '#a67844'), 900, 1236, { rot: -7 }),
);
scene(shadow(1020, 1262, 60, 9, 0.2), at(barrel(120, '#96603a'), 1016, 1262), shadow(1120, 1300, 70, 9, 0.2), at(barrel(104, '#a56c40'), 1066, 1300, { rot: 82 }), at(amphora(96, '#c97f52'), 730, 1296, { rot: 74 }), at(amphora(84, '#b86a44'), 1158, 1228, { rot: -6 }));
target('crown', 'Gold crown', at(crown(62), 1016, 1146, { rot: -5 }));
target('map', 'Treasure map', [shadow(618, 1286, 50, 6, 0.16), ...at(mapScroll(104), 612, 1262, { rot: -9 })]);
scene(at(coins(61, 9, 150, 30), 560, 1340), at(coins(62, 7, 110, 26), 300, 1350), at(coins(63, 6, 90, 24), 470, 1404));
target('chest', 'Treasure chest', [shadow(430, 1336, 104, 11, 0.22), ...at(chest(176), 430, 1332)]);
target('boot', 'Old boot', [shadow(180, 1292, 48, 7, 0.2), ...at(boot(88), 172, 1288, { rot: -6 })]);
target('key', 'Golden key', [shadow(226, 1448, 36, 5, 0.18), ...at(key(70), 222, 1438, { rot: 22 })]);
target('spyglass', 'Spyglass', [shadow(566, 1470, 50, 6, 0.18), ...at(spyglass(100), 560, 1456, { rot: 14 })]);
target('compass', 'Compass', [shadow(716, 1420, 30, 5, 0.18), ...at(compass(56), 712, 1396, { rot: -12 })]);
target('bottle', 'Message in a bottle', [shadow(878, 1410, 54, 7, 0.18), ...at(bottle(108), 872, 1392, { rot: -14 })]);
target('necklace', 'Pearl necklace', at(necklace(78), 1064, 1420, { rot: 8 }));
scene(at(starfish(44, '#f6883a', 20), 780, 1220), at(starfish(38, '#e86a8a', -15), 96, 1430), at(scallop(32, '#f6e2b0'), 340, 1466, { rot: 30 }), at(scallop(28, '#f4a6b8'), 960, 1352, { rot: -20 }), at(snailShell(26, '#c9a67a'), 640, 1366), at(crab(54, '#e0734f'), 1130, 1392));
scene(at(fish('slim', 46, '#f6d04a', '#f29a3a', '#3f6fc0'), 300, 1230, { rot: -4 }), flip(fish('oval', 48, '#8fe0c0', '#3f8f9a', '#fbf3df'), 820, 1320, 4), at(school(64, 8, 130, 40, 15, '#f6b0c0'), 960, 1470));
// foreground corals and weed in the corners
scene(at(rock(71, 200, 90, '#5f7488'), 40, 1512), at(branchCoral(72, 130, '#f47f8e'), 60, 1440), at(fanCoral(73, 120, '#f6a84a'), 1170, 1500), at(bubbleCoral(74, 100, '#8fa2f0'), 1120, 1512), at(seagrass(75, 80, 90, '#4fa27c', 9), 400, 1512), at(tubeSponge(76, 3, 80, '#f6c85a'), 830, 1518));
scene(at(bubbles(81, 9, 50, 440, 3, 9), 424, 1150), at(bubbles(82, 8, 40, 380, 3, 8), 1030, 1090), at(bubbles(83, 7, 40, 320, 2.5, 7), 250, 1080), at(bubbles(84, 6, 30, 260, 2.5, 6), 700, 1250));

const a: FindActivity = {
  id: 'ocean-find-2', version: 1, mode: 'find', title: 'The Sunken Shipwreck', blurb: 'An old galleon rests on the seabed, its lost treasure watched over by a cheerful octopus.',
  collectionId: 'ocean', categories: ["Ocean", "Animals"], difficulty: 'Detailed',
  added: '2026-11-26',
  width: W, height: H, defs, items,
};
export default a;
