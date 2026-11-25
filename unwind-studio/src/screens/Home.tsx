import { ACTIVITIES, activitiesOf, COLLECTIONS, getActivity, MODE_LABEL, ownCollections } from '../content/catalog';
import type { Mode } from '../content/types';
import { dailyPick, shuffledFor } from '../lib/daily';
import { href } from '../router';
import { localDate, useApp } from '../store/app';
import { ActivityCard, ArtThumb, ModeGlyph } from '../ui/common';
import { Icon } from '../ui/Icon';
import { variantLabel } from './labels';

const MODES: { mode: Mode; line: string }[] = [
  { mode: 'puzzle', line: 'Assemble a beautiful image, piece by piece.' },
  { mode: 'paint', line: 'Bring an illustration to life with colour.' },
  { mode: 'find', line: 'Discover objects tucked into a detailed scene.' },
];

export function Home() {
  const progress = useApp((d) => d.progress);
  useApp((d) => d.creations); // re-render when photos are added or removed
  const photos = ownCollections();
  const today = localDate();
  const hour = new Date().getHours();
  const greeting = hour < 5 ? 'A quiet moment' : hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const tod = hour < 5 || hour >= 21 ? 'night' : hour < 11 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
  const recent = Object.values(progress).filter((p) => !p.completed && getActivity(p.activityId)).sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 6);
  const picks = MODES.map((m) => dailyPick(ACTIVITIES, m.mode, today)!).filter(Boolean);
  const week = Math.floor(Date.now() / (7 * 86400000));
  const featured = COLLECTIONS[week % COLLECTIONS.length];
  const cover = getActivity(featured.coverActivityId)!;
  const touched = new Set(Object.values(progress).map((p) => p.activityId));
  const fresh = shuffledFor(ACTIVITIES.filter((a) => !touched.has(a.id)), today);
  const recommended = (fresh.length >= 3 ? fresh : shuffledFor(ACTIVITIES, today)).slice(0, 6);

  return (
    <div className="page">
      <header className="sky" data-time={tod}>
        <svg className="sky-hills" viewBox="0 0 400 260" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 196C60 160 110 168 160 186S270 214 320 180 380 166 400 172V260H0Z" fill="#fff" opacity={tod === 'night' ? 0.1 : 0.34} />
          <path d="M0 226C70 196 130 214 200 222S330 200 400 214V260H0Z" fill="#fff" opacity={tod === 'night' ? 0.14 : 0.5} />
        </svg>
        <svg className="sky-art" viewBox="0 0 400 260" preserveAspectRatio="xMaxYMin meet" aria-hidden="true">
          {tod === 'night' ? (
            <>
              {[[40, 40], [92, 86], [150, 30], [215, 70], [262, 26], [318, 112], [366, 44], [120, 132], [250, 130]].map(([x, y], i) => <circle key={i} className="star" cx={x} cy={y} r={i % 3 ? 1.6 : 2.4} fill="#fff" style={{ animationDelay: `${i * 0.4}s` }} />)}
              <g className="orb"><circle cx="322" cy="62" r="30" fill="#fdf3d2" /><circle cx="309" cy="54" r="30" fill="#2a2c5c" /></g>
            </>
          ) : (
            <>
              <g className="orb"><circle cx="312" cy={tod === 'afternoon' ? 62 : tod === 'morning' ? 96 : 118} r="62" fill="#fff" opacity="0.28" /><circle cx="312" cy={tod === 'afternoon' ? 62 : tod === 'morning' ? 96 : 118} r="38" fill={tod === 'evening' ? '#ffd9b8' : '#fff3c9'} /></g>
              <g className="cloud" fill="#fff" opacity="0.7"><ellipse cx="96" cy="54" rx="46" ry="13" /><ellipse cx="126" cy="44" rx="30" ry="14" /><ellipse cx="226" cy="98" rx="34" ry="9" /></g>
            </>
          )}
        </svg>
        <p className="hello">{greeting}</p>
        <h1>Find your moment</h1>
        <p className="sub">Take a breath, pick a picture, and go at your own pace. Everything saves as you go.</p>
      </header>

      <section aria-labelledby="h-modes">
        <div className="sect-head"><h2 id="h-modes">What would you like to do?</h2></div>
        <div className="modes">
          {MODES.map(({ mode, line }) => {
            const pick = picks.find((p) => p.mode === mode)!;
            return (
              <a key={mode} className="modecard" data-mode={mode} href={href({ name: 'explore', mode })} data-testid={`mode-${mode}`}>
                <ModeGlyph mode={mode} />
                <ArtThumb activity={pick} />
                <span className="modecard-body">
                  <strong>{MODE_LABEL[mode]}</strong>
                  <span>{line}</span>
                  <small>{activitiesOf(mode).length} to enjoy <Icon name="next" size={15} /></small>
                </span>
              </a>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="h-own">
        <div className="sect-head"><h2 id="h-own">Make your own</h2></div>
        <div className="rail" data-testid="own-photos">
          <a className="card makecard" href={href({ name: 'create' })} data-testid="make-own">
            <span className="makecard-art" aria-hidden="true"><Icon name="plus" size={34} /></span>
            <span className="card-body">
              <h3>Use your own photo</h3>
              <p className="meta">Turn a favourite picture into a jigsaw, a painting and a hidden-object scene.</p>
            </span>
          </a>
          {photos.map((c) => (
            <a key={c.id} className="card" href={href({ name: 'collection', id: c.id })} data-collection={c.id}>
              <div className="card-art"><ArtThumb activity={getActivity(c.coverActivityId)!} /></div>
              <div className="card-body"><h3>{c.title}</h3><p className="meta">Your photo · puzzle, paint and find</p></div>
            </a>
          ))}
        </div>
      </section>

      {recent.length > 0 && (
        <section aria-labelledby="h-continue">
          <div className="sect-head"><h2 id="h-continue">Pick up where you left off</h2><a href={href({ name: 'gallery', tab: 'progress' })}>See all</a></div>
          <div className="rail" data-testid="continue">
            {recent.map((p) => {
              const a = getActivity(p.activityId)!;
              return <ActivityCard key={p.key} activity={a} progress={p} to={{ name: 'play', id: a.id, variant: p.variant }} note={variantLabel(a, p.variant)} />;
            })}
          </div>
        </section>
      )}

      <section aria-labelledby="h-daily">
        <div className="sect-head"><h2 id="h-daily">Today’s picks</h2></div>
        <div className="rail" data-testid="daily">
          {picks.map((a) => <ActivityCard key={a.id} activity={a} note={`Today’s ${MODE_LABEL[a.mode].toLowerCase()} · ${a.difficulty}`} />)}
        </div>
      </section>

      <section aria-labelledby="h-featured">
        <div className="sect-head"><h2 id="h-featured">This week’s collection</h2></div>
        <a className="feature" href={href({ name: 'collection', id: featured.id })}>
          <ArtThumb activity={cover} />
          <span className="feature-body">
            <small>{featured.theme} collection</small>
            <strong>{featured.title}</strong>
            <span>{featured.description}</span>
            <span className="feature-cta">Open collection <Icon name="next" size={16} /></span>
          </span>
        </a>
      </section>

      <section aria-labelledby="h-rec">
        <div className="sect-head"><h2 id="h-rec">You might enjoy</h2><a href={href({ name: 'explore' })}>Explore all</a></div>
        <div className="grid">{recommended.map((a) => <ActivityCard key={a.id} activity={a} />)}</div>
      </section>
    </div>
  );
}
