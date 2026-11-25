import { ACTIVITIES, activitiesOf, COLLECTIONS, getActivity, MODE_LABEL } from '../content/catalog';
import type { Mode } from '../content/types';
import { dailyPick, shuffledFor } from '../lib/daily';
import { href } from '../router';
import { localDate, useApp } from '../store/app';
import { ActivityCard, ArtThumb, MODE_ICON } from '../ui/common';
import { Icon } from '../ui/Icon';
import { variantLabel } from './labels';

const MODES: { mode: Mode; line: string }[] = [
  { mode: 'puzzle', line: 'Assemble a beautiful image, piece by piece.' },
  { mode: 'paint', line: 'Bring an illustration to life with colour.' },
  { mode: 'find', line: 'Discover objects tucked into a detailed scene.' },
];

export function Home() {
  const progress = useApp((d) => d.progress);
  const today = localDate();
  const hour = new Date().getHours();
  const greeting = hour < 5 ? 'A quiet moment' : hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
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
      <header className="hero">
        <p className="eyebrow">Unwind Studio</p>
        <h1>{greeting}.<br /><em>Find your moment.</em></h1>
        <p className="lede">Three calm ways to spend a little time with beautiful artwork. No timers, no pressure — everything saves as you go.</p>
      </header>

      <section aria-label="Activities" className="modes">
        {MODES.map(({ mode, line }) => {
          const pick = picks.find((p) => p.mode === mode)!;
          return (
            <a key={mode} className="modecard" data-mode={mode} href={href({ name: 'explore', mode })} data-testid={`mode-${mode}`}>
              <ArtThumb activity={pick} />
              <span className="modecard-body">
                <span className="modecard-ic"><Icon name={MODE_ICON[mode]} size={22} /></span>
                <strong>{MODE_LABEL[mode]}</strong>
                <span>{line}</span>
                <small>{activitiesOf(mode).length} to explore</small>
              </span>
            </a>
          );
        })}
      </section>

      {recent.length > 0 && (
        <section aria-labelledby="h-continue">
          <div className="sect-head"><h2 id="h-continue">Continue playing</h2><a href={href({ name: 'gallery', tab: 'progress' })}>See all</a></div>
          <div className="rail" data-testid="continue">
            {recent.map((p) => {
              const a = getActivity(p.activityId)!;
              return <ActivityCard key={p.key} activity={a} progress={p} to={{ name: 'play', id: a.id, variant: p.variant }} note={variantLabel(a, p.variant)} />;
            })}
          </div>
        </section>
      )}

      <section aria-labelledby="h-daily">
        <div className="sect-head"><h2 id="h-daily">Today’s picks</h2><span className="meta">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</span></div>
        <div className="rail" data-testid="daily">
          {picks.map((a) => <ActivityCard key={a.id} activity={a} note={`Today’s ${MODE_LABEL[a.mode].toLowerCase()} · ${a.difficulty}`} />)}
        </div>
      </section>

      <section aria-labelledby="h-featured">
        <div className="sect-head"><h2 id="h-featured">Featured collection</h2></div>
        <a className="feature" href={href({ name: 'collection', id: featured.id })}>
          <ArtThumb activity={cover} />
          <span className="feature-body">
            <small>{featured.theme} collection</small>
            <strong>{featured.title}</strong>
            <span>{featured.description}</span>
            <span className="feature-cta">Puzzle · Paint · Find <Icon name="next" size={16} /></span>
          </span>
        </a>
      </section>

      <section aria-labelledby="h-rec">
        <div className="sect-head"><h2 id="h-rec">Recommended for you</h2><a href={href({ name: 'explore' })}>Explore all</a></div>
        <div className="grid">{recommended.map((a) => <ActivityCard key={a.id} activity={a} />)}</div>
      </section>
    </div>
  );
}
