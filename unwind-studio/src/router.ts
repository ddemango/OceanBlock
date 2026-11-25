import { useSyncExternalStore } from 'react';

export type Route =
  | { name: 'home' }
  | { name: 'explore'; mode?: string; fav?: boolean }
  | { name: 'gallery'; tab?: string }
  | { name: 'settings' }
  | { name: 'collection'; id: string }
  | { name: 'activity'; id: string }
  | { name: 'play'; id: string; variant: string };

export function parseRoute(hash: string): Route {
  const [path, query = ''] = hash.replace(/^#\/?/, '').split('?');
  const seg = path.split('/').filter(Boolean).map(decodeURIComponent);
  const q = new URLSearchParams(query);
  switch (seg[0]) {
    case 'explore': return { name: 'explore', mode: q.get('mode') ?? undefined, fav: q.get('fav') === '1' };
    case 'gallery': return { name: 'gallery', tab: q.get('tab') ?? undefined };
    case 'settings': return { name: 'settings' };
    case 'collection': return seg[1] ? { name: 'collection', id: seg[1] } : { name: 'explore' };
    case 'activity': return seg[1] ? { name: 'activity', id: seg[1] } : { name: 'explore' };
    case 'play': return seg[1] && seg[2] ? { name: 'play', id: seg[1], variant: seg[2] } : { name: 'home' };
    default: return { name: 'home' };
  }
}

export function href(r: Route): string {
  switch (r.name) {
    case 'home': return '#/';
    case 'explore': {
      const q = new URLSearchParams();
      if (r.mode) q.set('mode', r.mode);
      if (r.fav) q.set('fav', '1');
      const s = q.toString();
      return '#/explore' + (s ? '?' + s : '');
    }
    case 'gallery': return '#/gallery' + (r.tab ? '?tab=' + r.tab : '');
    case 'settings': return '#/settings';
    case 'collection': return '#/collection/' + encodeURIComponent(r.id);
    case 'activity': return '#/activity/' + encodeURIComponent(r.id);
    case 'play': return `#/play/${encodeURIComponent(r.id)}/${encodeURIComponent(r.variant)}`;
  }
}

let depth = 0;
export function navigate(r: Route, replace = false) {
  if (replace) location.replace(href(r));
  else { depth++; location.hash = href(r); }
}
/** Go back within the app, or to a fallback when the app was opened on this screen. */
export function goBack(fallback: Route) {
  if (depth > 0) { depth--; history.back(); } else navigate(fallback, true);
}

const subscribe = (l: () => void) => { window.addEventListener('hashchange', l); return () => window.removeEventListener('hashchange', l); };
// The snapshot must stay the same object until the hash really changes, or React
// re-renders forever. (A bare URL has an empty hash, which is how the iOS app opens.)
let cachedHash: string | null = null, cached: Route = { name: 'home' };
export function currentRoute(): Route {
  if (location.hash !== cachedHash) { cachedHash = location.hash; cached = parseRoute(location.hash); }
  return cached;
}
export function useRoute(): Route {
  return useSyncExternalStore(subscribe, currentRoute);
}
