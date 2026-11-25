// PLACEHOLDER: to be replaced with the finished artwork.
import { circle, rect, sh } from '../../art/kit';
import type { FindActivity } from '../types';

const a: FindActivity = {
  id: 'seasons-find-1', version: 1, mode: 'find', title: 'Placeholder', blurb: 'Spring Flower Market',
  collectionId: 'seasons', categories: ["Seasons"], difficulty: 'Moderate',
  season: { from: '03-01', to: '05-31', label: 'spring' },
  width: 1200, height: 1500,
  items: [{ shapes: [sh(rect(0, 0, 1200, 1500), '#f6e9cf')] }, { id: 'ball', name: 'Ball', target: true, shapes: [sh(circle(600, 750, 40), '#d6503a')] }],
};
export default a;
