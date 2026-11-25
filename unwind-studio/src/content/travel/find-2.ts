import { rect, sh } from '../../art/kit';
import type { FindActivity } from '../types';

// PLACEHOLDER — replaced by the real artwork.
const activity: FindActivity = {
  id: 'travel-find-2', version: 1, mode: 'find', title: 'Placeholder', blurb: 'Placeholder', collectionId: 'travel',
  categories: [], difficulty: 'Relaxed', width: 1200, height: 1500,
  items: [{ shapes: [sh(rect(0, 0, 1200, 1500), '#e8e0d0')] }, { id: 'box', name: 'Box', target: true, shapes: [sh(rect(300, 400, 80, 80), '#c9795a')] }],
};
export default activity;
