import { afterEach, describe, expect, it, vi } from 'vitest';
import { currentRoute, href, parseRoute } from '../src/router';

describe('router', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('returns the same route object until the hash changes, including an empty hash', () => {
    const loc = { hash: '' };
    vi.stubGlobal('location', loc);
    const a = currentRoute();
    expect(a).toEqual({ name: 'home' });
    expect(currentRoute()).toBe(a); // a new object here makes React loop forever
    loc.hash = '#/explore?mode=paint';
    const b = currentRoute();
    expect(b).toEqual({ name: 'explore', mode: 'paint', fav: false, fresh: false });
    expect(currentRoute()).toBe(b);
  });

  it('round-trips routes through href', () => {
    for (const r of [{ name: 'home' }, { name: 'settings' }, { name: 'activity', id: 'coastal-paint' }, { name: 'play', id: 'garden-puzzle', variant: '64' }] as const) {
      expect(parseRoute(href(r))).toEqual(r);
    }
  });
});
