// Usage: npm run art:validate [-- <collectionId>]
import { ACTIVITIES, COLLECTIONS } from '../src/content/catalog';
import { validateActivity, validateCatalog } from '../src/content/validate';

const only = process.argv[2];
const acts = only ? ACTIVITIES.filter((a) => a.collectionId === only) : ACTIVITIES;
const issues = only ? acts.flatMap(validateActivity) : validateCatalog(ACTIVITIES, COLLECTIONS);
for (const a of acts) {
  if (a.mode === 'puzzle') console.log(`${a.id}: "${a.title}" ${a.art.width}x${a.art.height}, ${a.art.shapes.length} shapes`);
  if (a.mode === 'paint') console.log(`${a.id}: "${a.title}" ${a.regions.length} regions, ${a.palette.length} colours`);
  if (a.mode === 'find') console.log(`${a.id}: "${a.title}" ${a.items.filter((i) => i.target).length} targets, ${a.items.reduce((n, i) => n + i.shapes.length, 0)} shapes`);
}
for (const i of issues) console.log(`${i.level.toUpperCase().padEnd(5)} ${i.where}: ${i.msg}`);
const errors = issues.filter((i) => i.level === 'error').length;
console.log(errors ? `\n${errors} error(s)` : '\nNo errors');
process.exit(errors ? 1 : 0);
