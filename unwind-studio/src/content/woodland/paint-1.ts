import { rect } from '../../art/kit';
import type { PaintActivity } from '../types';

// PLACEHOLDER — replaced by the real artwork.
const activity: PaintActivity = {
  id: 'woodland-paint-1', version: 1, mode: 'paint', title: 'Placeholder', blurb: 'Placeholder', collectionId: 'woodland',
  categories: [], difficulty: 'Relaxed', width: 1000, height: 1250,
  palette: [{ id: 'a', number: 1, name: 'Sky', hex: '#9db8c9' }, { id: 'b', number: 2, name: 'Clay', hex: '#c9795a' }],
  regions: [{ id: 'bg', d: rect(0, 0, 1000, 1250), color: 'a' }, { id: 'box', d: rect(300, 400, 300, 300), color: 'b' }],
};
export default activity;
