import { circle, curve, ellipse, line, poly, rect, star } from '../../art/kit';
import type { PaintActivity } from '../types';
import { W, H, band, canvas, crescent, edged, fir, puff, sample, soft } from './props-paint';

const c = canvas();
const { R, D } = c;

// ---------------------------------------------------------------- dusk sky
R('sky-top', rect(0, 0, W, H), 'dusk');
R('sky-lilac', edged([[0, 250], [250, 232], [520, 262], [780, 236], [1000, 256]], [[1000, 1250], [0, 1250]]), 'lilac');
R('sky-rose', edged([[0, 404], [260, 390], [540, 414], [800, 392], [1000, 408]], [[1000, 1250], [0, 1250]]), 'rose');
R('sky-glow', edged([[0, 528], [300, 518], [600, 534], [1000, 520]], [[1000, 1250], [0, 1250]]), 'peach');
R('moon', circle(806, 140, 48), 'peach');
const stars: [number, number, number][] = [[96, 96, 20], [520, 150, 22], [730, 320, 15], [450, 330, 14]];
stars.forEach(([x, y, r], i) => R(`star-${i + 1}`, star(x, y, r, r * 0.42, 4, 0), 'snow'));

// ---------------------------------------------------------------- far snowy hill
R('hill-far', edged([[0, 660], [180, 626], [420, 650], [640, 612], [840, 640], [1000, 618]], [[1000, 1250], [0, 1250]]), 'snowShade');

// ---------------------------------------------------------------- fir trees
function tree(id: string, cx: number, baseY: number, h: number, w: number, col: string, tiers = 3, ledges = true) {
  for (const [s, d, role] of fir(cx, baseY, h, w, tiers, ledges)) R(`${id}-${s}`, d, role === 'tier' ? col : role === 'snow' ? 'snow' : 'bark');
}
tree('fir-mid', 800, 720, 380, 250, 'spruce');
tree('fir-right', 935, 770, 520, 300, 'spruce', 4);
tree('fir-left', 34, 760, 450, 260, 'pine', 3);

// ---------------------------------------------------------------- cottage
R('chimney', rect(300, 404, 42, 70), 'brick');
R('chimney-snow', puff(321, 404, 30, 12, 4, 10), 'snow');
R('smoke-1', puff(334, 350, 30, 22, 6, 0), 'snowShade');
R('smoke-2', puff(362, 298, 24, 18, 6, 15), 'snowShade');
R('cottage-wall', rect(100, 520, 280, 230), 'brick');
R('roof-fascia', poly([[76, 532], [404, 532], [392, 552], [88, 552]]), 'coal');
R('roof', puff(240, 486, 182, 62, 7, 0, true), 'snow');
R('window-frame', rect(136, 586, 116, 96, 6), 'coal');
R('window-pane-1', rect(146, 596, 44, 34, 3), 'lamp');
R('window-pane-2', rect(198, 596, 44, 34, 3), 'lamp');
R('window-pane-3', rect(146, 638, 44, 34, 3), 'lamp');
R('window-pane-4', rect(198, 638, 44, 34, 3), 'lamp');
R('window-sill', puff(194, 690, 70, 10, 5, 0), 'snow');
R('door', rect(284, 590, 66, 160, 30), 'berry');
R('door-wreath', circle(317, 640, 16), 'pine');

// ---------------------------------------------------------------- near snow, path and window glow
R('ground', edged([[0, 742], [200, 760], [420, 736], [640, 758], [860, 732], [1000, 748]], [[1000, 1250], [0, 1250]]), 'pinkSnow');
R('drift-right', soft([[720, 930], [800, 884], [900, 868], [1000, 880], [1000, 950], [880, 948]]), 'snow');
R('path', poly([...sample([[300, 748], [272, 830], [196, 940], [100, 1080], [10, 1250]], 8), ...sample([[336, 748], [328, 840], [290, 950], [262, 1080], [290, 1250]], 8).reverse()]), 'snowShade');

// ---------------------------------------------------------------- snowman
R('snowman-shadow', ellipse(590, 1150, 250, 40), 'snowShade');
R('snowman-base', ellipse(560, 1010, 180, 160), 'snow');
R('snowman-base-shade', crescent(560, 1010, 180, 160, -30, 100, 0.2), 'snowShade');
R('arm-left', band([[446, 776], [420, 730], [404, 676], [398, 612]], 16, 9), 'bark');
R('arm-left-twig', band([[408, 690], [380, 664], [366, 628]], 13, 9), 'bark');
R('arm-right', band([[680, 780], [740, 738], [800, 700], [850, 640]], 16, 9), 'bark');
R('arm-right-twig', band([[790, 708], [830, 700], [872, 704]], 10, 7), 'bark');
// a little robin perched on the right arm
R('robin-tail', poly([[828, 668], [862, 650], [866, 664]]), 'bark');
R('robin-body', ellipse(806, 664, 30, 22, -10), 'bark');
R('robin-breast', ellipse(790, 672, 17, 15, -10), 'carrot');
R('robin-head', circle(782, 640, 15), 'bark');
R('snowman-middle', ellipse(560, 800, 132, 122), 'snow');
R('snowman-middle-shade', crescent(560, 800, 132, 122, -20, 100, 0.2), 'snowShade');
R('button-1', circle(556, 762, 12), 'coal');
R('button-2', circle(560, 818, 12), 'coal');
R('button-3', circle(566, 874, 12), 'coal');
R('snowman-head', ellipse(560, 616, 92, 86), 'snow');
R('snowman-head-shade', crescent(560, 616, 92, 86, -20, 100, 0.2), 'snowShade');
R('cheek-left', circle(510, 640, 13), 'rose');
R('cheek-right', circle(612, 640, 13), 'rose');
R('eye-left', circle(528, 590, 10), 'coal');
R('eye-right', circle(594, 590, 10), 'coal');
R('nose', poly([[556, 606], [650, 630], [556, 634]]), 'carrot');

// scarf: hanging tail first, then the wrap over it
R('scarf-tail', band([[620, 706], [640, 770], [648, 830], [640, 880]], 54, 46), 'scarf');
R('scarf-tail-stripe-1', poly([[616, 776], [668, 772], [671, 798], [618, 802]]), 'scarfDark');
R('scarf-tail-stripe-2', poly([[618, 830], [671, 826], [670, 852], [617, 856]]), 'scarfDark');
R('scarf-wrap', band([[456, 676], [510, 702], [560, 708], [612, 702], [664, 676]], 46, 46), 'scarf');
R('scarf-wrap-stripe', band([[516, 704], [532, 706]], 20, 46), 'scarfDark');

// top hat
R('hat-crown', poly([[488, 404], [632, 396], [626, 538], [494, 542]]), 'coal');
R('hat-band', poly([[492, 498], [628, 492], [627, 524], [493, 528]]), 'scarf');
R('hat-brim', ellipse(560, 540, 112, 20, -2), 'coal');
R('hat-holly-1', ellipse(598, 506, 18, 9, -30), 'pine');
R('hat-holly-2', ellipse(626, 504, 18, 9, 30), 'pine');
R('hat-berry', circle(612, 514, 9), 'berry');

// ---------------------------------------------------------------- foreground drift
R('drift-front', edged([[0, 1166], [180, 1140], [420, 1190], [700, 1160], [1000, 1186]], [[1000, 1250], [0, 1250]]), 'snow');

// ---------------------------------------------------------------- line work
D(curve([[520, 662], [540, 672], [560, 676], [580, 672], [600, 662]]), '#33313f', 3);
D(line([[620, 892], [616, 910]]) + line([[634, 892], [634, 912]]) + line([[648, 890], [652, 910]]), '#b23a3e', 3);
D(line([[580, 618], [596, 620]]) + line([[600, 626], [616, 628]]), '#c7652a', 1.6);
D(circle(338, 668, 4), '#f7c95a', 3);
D(poly([[768, 638], [756, 642], [768, 645]]) + circle(778, 636, 1.5), '#33313f', 2);
D(line([[800, 684], [798, 696]]) + line([[812, 684], [812, 696]]), '#33313f', 1.6);
D(line([[194, 596], [194, 672]]) + line([[146, 634], [242, 634]]), '#33313f', 1);
D(circle(524, 586, 2) + circle(590, 586, 2), '#ffffff', 2.4);
D(curve([[640, 770], [700, 760], [760, 774]]) + curve([[740, 820], [820, 806], [900, 820]]), '#aab6d6', 1.4, 0.6);

const activity: PaintActivity = {
  id: 'seasons-paint-1', version: 1, mode: 'paint', title: 'Snowman at Dusk',
  blurb: 'A cheerful snowman in a red scarf and top hat waves from a snowy yard as the sky turns blue and pink behind the firs and a lamplit cottage.',
  added: '2026-11-25', collectionId: 'seasons', categories: ["Seasons"], difficulty: 'Relaxed',
  season: { from: '12-01', to: '02-28', label: 'winter' },
  width: W, height: H,
  palette: [
    { id: 'dusk', number: 1, name: 'Evening blue', hex: '#5c6aa6' },
    { id: 'lilac', number: 2, name: 'Lilac', hex: '#9d93c8' },
    { id: 'rose', number: 3, name: 'Dusk rose', hex: '#eeaab7' },
    { id: 'peach', number: 4, name: 'Last light', hex: '#fde0c2' },
    { id: 'snow', number: 5, name: 'Fresh snow', hex: '#f8f9fd' },
    { id: 'snowShade', number: 6, name: 'Snow shadow', hex: '#c6d0ea' },
    { id: 'pinkSnow', number: 7, name: 'Rosy snow', hex: '#f4e4ec' },
    { id: 'pine', number: 8, name: 'Pine', hex: '#4f8a78' },
    { id: 'spruce', number: 9, name: 'Spruce', hex: '#2e5b58' },
    { id: 'bark', number: 10, name: 'Twig brown', hex: '#7a5038' },
    { id: 'brick', number: 11, name: 'Cottage brick', hex: '#b56c50' },
    { id: 'coal', number: 12, name: 'Coal', hex: '#34323f' },
    { id: 'lamp', number: 13, name: 'Lamplight', hex: '#f7c95a' },
    { id: 'berry', number: 14, name: 'Holly berry', hex: '#8e2b3b' },
    { id: 'scarf', number: 15, name: 'Scarf red', hex: '#d6474a' },
    { id: 'scarfDark', number: 16, name: 'Cranberry', hex: '#9a2f40' },
    { id: 'carrot', number: 17, name: 'Carrot', hex: '#f08a3a' },
  ],
  regions: c.regions,
  detail: c.detail,
};
export default activity;
