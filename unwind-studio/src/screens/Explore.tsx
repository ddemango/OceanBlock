import { useEffect, useState } from 'react';
import { ACTIVITIES, CATEGORIES, COLLECTIONS, getActivity, MODE_LABEL } from '../content/catalog';
import type { Difficulty, Mode } from '../content/types';
import { isNew } from '../lib/season';
import { href, navigate } from '../router';
import { useApp } from '../store/app';
import { ActivityCard, ArtThumb } from '../ui/common';
import { Icon } from '../ui/Icon';

const DIFFS: Difficulty[] = ['Relaxed', 'Moderate', 'Detailed'];

const PAGE = 24;

export function Explore({ mode, fav, fresh }: { mode?: string; fav?: boolean; fresh?: boolean }) {
  const favorites = useApp((d) => d.favorites);
  const [q, setQ] = useState('');
  const [diff, setDiff] = useState<Difficulty | null>(null);
  const [cat, setCat] = useState<string | null>(null);
  const [more, setMore] = useState(false);
  const [shown, setShown] = useState(PAGE);
  const m = (['puzzle', 'paint', 'find'] as Mode[]).find((x) => x === mode);
  const needle = q.trim().toLowerCase();
  const list = ACTIVITIES.filter((a) =>
    (!m || a.mode === m) && (!fav || favorites.includes(a.id)) && (!fresh || isNew(a)) && (!diff || a.difficulty === diff) && (!cat || a.categories.includes(cat)) &&
    (!needle || [a.title, a.blurb, MODE_LABEL[a.mode], a.difficulty, ...a.categories, COLLECTIONS.find((c) => c.id === a.collectionId)?.title ?? ''].join(' ').toLowerCase().includes(needle)));
  useEffect(() => setShown(PAGE), [m, fav, fresh, diff, cat, needle]);
  const plain = !needle && !diff && !cat && !m && !fav && !fresh;
  const setMode = (v?: Mode) => navigate({ name: 'explore', mode: v, fav, fresh }, true);
  const clear = () => { setQ(''); setDiff(null); setCat(null); navigate({ name: 'explore' }, true); };

  return (
    <div className="page">
      <header className="page-head"><h1>Explore</h1><p className="lede">Tap any picture to see it up close and start.</p></header>

      <label className="search">
        <Icon name="search" size={20} />
        <input type="search" placeholder="Search titles, themes, collections" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search activities" />
      </label>

      <div className="filters" role="group" aria-label="Activity type">
        <button className={`chip ${!m ? 'on' : ''}`} aria-pressed={!m} onClick={() => setMode()}>All</button>
        {(['puzzle', 'paint', 'find'] as Mode[]).map((x) => <button key={x} data-mode={x} className={`chip chip-mode ${m === x ? 'on' : ''}`} aria-pressed={m === x} onClick={() => setMode(x)}>{MODE_LABEL[x]}</button>)}
        <button className={`chip ${fav ? 'on' : ''}`} aria-pressed={!!fav} onClick={() => navigate({ name: 'explore', mode: m, fav: !fav, fresh }, true)} data-testid="filter-fav"><Icon name="heart" size={15} filled={!!fav} />Favourites</button>
        <button className={`chip ${fresh ? 'on' : ''}`} aria-pressed={!!fresh} onClick={() => navigate({ name: 'explore', mode: m, fav, fresh: !fresh }, true)} data-testid="filter-new"><Icon name="sparkle" size={15} />New</button>
      </div>
      {!(more || diff || cat) && <button className="linkbtn morefilters" onClick={() => setMore(true)} data-testid="more-filters"><Icon name="search" size={16} />More ways to filter: difficulty and themes</button>}
      {(more || diff || cat) && <div className="filters" role="group" aria-label="Difficulty">
        {DIFFS.map((d) => <button key={d} className={`chip chip-quiet ${diff === d ? 'on' : ''}`} aria-pressed={diff === d} onClick={() => setDiff(diff === d ? null : d)}>{d}</button>)}
        <span className="filters-sep" />
        {CATEGORIES.map((c) => <button key={c} className={`chip chip-quiet ${cat === c ? 'on' : ''}`} aria-pressed={cat === c} onClick={() => setCat(cat === c ? null : c)}>{c}</button>)}
      </div>}

      {plain && (
      <section aria-labelledby="h-cols">
        <div className="sect-head"><h2 id="h-cols">Collections</h2></div>
        <div className="rail cols-rail" data-testid="explore-collections">
          {COLLECTIONS.map((c) => (
            <a key={c.id} className="card" href={href({ name: 'collection', id: c.id })}>
              <div className="card-art"><ArtThumb activity={getActivity(c.coverActivityId)!} /></div>
              <div className="card-body"><h3>{c.title}</h3><p className="meta">{c.theme} · {c.activityIds.length} activities</p></div>
            </a>
          ))}
        </div>
      </section>
      )}

      <section aria-labelledby="h-results">
        <div className="sect-head"><h2 id="h-results">{list.length} {list.length === 1 ? 'activity' : 'activities'}</h2>{!plain && <button className="linkbtn" onClick={clear}>Clear filters</button>}</div>
        {list.length ? <>
          <div className="grid" data-testid="results">{list.slice(0, shown).map((a) => <ActivityCard key={a.id} activity={a} />)}</div>
          {list.length > shown && <button className="btn btn-lg showmore" onClick={() => setShown(shown + PAGE)} data-testid="show-more">Show more ({list.length - shown} more)</button>}
        </>
          : <div className="empty"><Icon name="search" size={28} /><p>{fav && !favorites.length ? 'You have no favourites yet. Tap the heart on any activity to keep it here.' : 'Nothing matches those filters.'}</p><button className="btn" onClick={clear}>Show everything</button></div>}
      </section>

    </div>
  );
}
