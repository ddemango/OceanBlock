import { useState } from 'react';
import { ACTIVITIES, CATEGORIES, COLLECTIONS, getActivity, MODE_LABEL } from '../content/catalog';
import type { Difficulty, Mode } from '../content/types';
import { href, navigate } from '../router';
import { useApp } from '../store/app';
import { ActivityCard, ArtThumb } from '../ui/common';
import { Icon } from '../ui/Icon';

const DIFFS: Difficulty[] = ['Relaxed', 'Moderate', 'Detailed'];

export function Explore({ mode, fav }: { mode?: string; fav?: boolean }) {
  const favorites = useApp((d) => d.favorites);
  const [q, setQ] = useState('');
  const [diff, setDiff] = useState<Difficulty | null>(null);
  const [cat, setCat] = useState<string | null>(null);
  const m = (['puzzle', 'paint', 'find'] as Mode[]).find((x) => x === mode);
  const needle = q.trim().toLowerCase();
  const list = ACTIVITIES.filter((a) =>
    (!m || a.mode === m) && (!fav || favorites.includes(a.id)) && (!diff || a.difficulty === diff) && (!cat || a.categories.includes(cat)) &&
    (!needle || [a.title, a.blurb, MODE_LABEL[a.mode], a.difficulty, ...a.categories, COLLECTIONS.find((c) => c.id === a.collectionId)?.title ?? ''].join(' ').toLowerCase().includes(needle)));
  const setMode = (v?: Mode) => navigate({ name: 'explore', mode: v, fav }, true);
  const clear = () => { setQ(''); setDiff(null); setCat(null); navigate({ name: 'explore' }, true); };

  return (
    <div className="page">
      <header className="page-head"><h1>Explore</h1><p className="lede">Every picture can be enjoyed three ways. Browse by activity, mood or collection.</p></header>

      <label className="search">
        <Icon name="search" size={20} />
        <input type="search" placeholder="Search titles, themes, collections" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search activities" />
      </label>

      <div className="filters" role="group" aria-label="Activity type">
        <button className={`chip ${!m ? 'on' : ''}`} aria-pressed={!m} onClick={() => setMode()}>All</button>
        {(['puzzle', 'paint', 'find'] as Mode[]).map((x) => <button key={x} data-mode={x} className={`chip chip-mode ${m === x ? 'on' : ''}`} aria-pressed={m === x} onClick={() => setMode(x)}>{MODE_LABEL[x]}</button>)}
        <button className={`chip ${fav ? 'on' : ''}`} aria-pressed={!!fav} onClick={() => navigate({ name: 'explore', mode: m, fav: !fav }, true)} data-testid="filter-fav"><Icon name="heart" size={15} filled={!!fav} />Favourites</button>
      </div>
      <div className="filters" role="group" aria-label="Difficulty">
        {DIFFS.map((d) => <button key={d} className={`chip chip-quiet ${diff === d ? 'on' : ''}`} aria-pressed={diff === d} onClick={() => setDiff(diff === d ? null : d)}>{d}</button>)}
        <span className="filters-sep" />
        {CATEGORIES.map((c) => <button key={c} className={`chip chip-quiet ${cat === c ? 'on' : ''}`} aria-pressed={cat === c} onClick={() => setCat(cat === c ? null : c)}>{c}</button>)}
      </div>

      <section aria-labelledby="h-results">
        <div className="sect-head"><h2 id="h-results">{list.length} {list.length === 1 ? 'activity' : 'activities'}</h2>{(needle || diff || cat || m || fav) && <button className="linkbtn" onClick={clear}>Clear filters</button>}</div>
        {list.length ? <div className="grid" data-testid="results">{list.map((a) => <ActivityCard key={a.id} activity={a} />)}</div>
          : <div className="empty"><Icon name="search" size={28} /><p>{fav && !favorites.length ? 'You have no favourites yet. Tap the heart on any activity to keep it here.' : 'Nothing matches those filters.'}</p><button className="btn" onClick={clear}>Show everything</button></div>}
      </section>

      <section aria-labelledby="h-cols">
        <div className="sect-head"><h2 id="h-cols">Collections</h2></div>
        <div className="cols">
          {COLLECTIONS.map((c) => (
            <a key={c.id} className="feature feature-small" href={href({ name: 'collection', id: c.id })}>
              <ArtThumb activity={getActivity(c.coverActivityId)!} />
              <span className="feature-body"><small>{c.theme}</small><strong>{c.title}</strong><span>{c.description}</span></span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
