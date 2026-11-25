// PLACEHOLDER: to be replaced with the finished artwork.
import { rect } from '../../art/kit';
import type { PaintActivity } from '../types';

const a: PaintActivity = {
  id: 'fairytale-paint-2', version: 1, mode: 'paint', title: 'Placeholder', blurb: 'Pumpkin Coach at Midnight',
  collectionId: 'fairytale', categories: ["Fairytale"], difficulty: 'Moderate',
  width: 1000, height: 1250,
  palette: [{ id: 'c1', number: 1, name: 'Cream', hex: '#f6e9cf' }],
  regions: [{ id: 'bg', d: rect(0, 0, 1000, 1250), color: 'c1' }],
};
export default a;
