import { useState } from 'react';
import { activitiesInCollection, getActivity, getCollection, MODE_LABEL } from '../content/catalog';
import type { Activity } from '../content/types';
import { gridFor } from '../engine/jigsaw/grid';
import { targetsOf } from '../engine/find/state';
import { goBack, href, navigate } from '../router';
import { deleteCreation, progressKey, resetProgress, useApp } from '../store/app';
import { ActivityCard, ArtThumb, Confirm, FavButton, ModeBadge, ProgressBar } from '../ui/common';
import { Icon } from '../ui/Icon';
import { defaultVariants, variantHint, variantLabel } from './labels';

export function NotFound({ what = 'page' }: { what?: string }) {
  return <div className="page"><div className="empty"><Icon name="info" size={28} /><p>That {what} could not be found.</p><a className="btn btn-primary" href={href({ name: 'home' })}>Back to Home</a></div></div>;
}

export function CollectionPage({ id }: { id: string }) {
  const c = getCollection(id);
  const progress = useApp((d) => d.progress);
  useApp((d) => d.creations);
  const [confirmDelete, setConfirmDelete] = useState(false);
  if (!c) return <NotFound what="collection" />;
  const acts = c.activityIds.map((x) => getActivity(x)!).filter(Boolean);
  const done = acts.filter((a) => Object.values(progress).some((p) => p.activityId === a.id && p.completed)).length;
  return (
    <div className="page">
      <button className="linkbtn backlink" onClick={() => goBack({ name: 'explore' })}><Icon name="back" size={18} />Back</button>
      <header className="colhero">
        <ArtThumb activity={getActivity(c.coverActivityId)!} />
        <div><p className="eyebrow">{c.own ? 'Your photo' : `${c.theme} collection`}</p><h1>{c.title}</h1><p className="lede">{c.description}</p>
          <p className="meta">{done} of {acts.length} completed</p><ProgressBar value={done / acts.length} label="Collection progress" />
          {c.own && <button className="btn btn-quiet-danger" onClick={() => setConfirmDelete(true)} data-testid="delete-photo"><Icon name="trash" size={18} />Delete this photo</button>}</div>
      </header>
      <div className="grid grid-3">{acts.map((a) => <ActivityCard key={a.id} activity={a} />)}</div>
      {confirmDelete && <Confirm title="Delete this photo?" body={`This removes “${c.title}” and its jigsaw, painting and hidden-object scene from this device, along with any progress and finished pieces. It cannot be undone.`} confirm="Delete" danger
        onCancel={() => setConfirmDelete(false)} onConfirm={() => { deleteCreation(c.id); setConfirmDelete(false); navigate({ name: 'home' }, true); }} />}
    </div>
  );
}

export function ActivityPage({ id }: { id: string }) {
  const a = getActivity(id);
  const progress = useApp((d) => d.progress);
  const variants = a ? defaultVariants(a) : [];
  const recent = a ? Object.values(progress).filter((p) => p.activityId === a.id && variants.includes(p.variant)).sort((x, y) => Number(x.completed) - Number(y.completed) || y.updatedAt - x.updatedAt)[0] : undefined;
  const [variant, setVariant] = useState(recent?.variant ?? variants[0]);
  const [confirm, setConfirm] = useState(false);
  if (!a) return <NotFound what="activity" />;
  const col = getCollection(a.collectionId);
  const rec = progress[progressKey(a.id, variant)];
  const inProgress = rec && !rec.completed && rec.progress > 0;
  const play = () => navigate({ name: 'play', id: a.id, variant });
  const grid = a.mode === 'puzzle' ? gridFor(Number(variant), a.art.width / a.art.height) : null;
  const others = activitiesInCollection(a.collectionId).filter((x) => x.id !== a.id);

  return (
    <div className="page detail" data-mode={a.mode}>
      <button className="linkbtn backlink" onClick={() => goBack({ name: 'explore' })}><Icon name="back" size={18} />Back</button>
      <div className="detail-cols">
        <div className="detail-art">
          <ArtThumb activity={a} />
          {grid && <div className="gridlines" aria-hidden="true" style={{ backgroundSize: `${100 / grid.cols}% ${100 / grid.rows}%` }} />}
          <FavButton id={a.id} title={a.title} />
        </div>
        <div className="detail-info">
          <ModeBadge mode={a.mode} />
          <h1>{a.title}</h1>
          <p className="lede">{a.blurb}</p>
          <p className="meta">{a.difficulty}{col && <> · <a href={href({ name: 'collection', id: col.id })}>{col.title}</a></>} · {a.categories.join(', ')}</p>

          {a.mode === 'puzzle' && <p className="note"><Icon name="info" size={16} />The whole picture is used, uncropped. The grid shows how it will be cut.</p>}
          {a.mode === 'find' && <p className="note"><Icon name="info" size={16} />{targetsOf(a).length} objects are hidden in this scene.</p>}

          {variants.length > 1 && (
            <div className="options" role="radiogroup" aria-label={a.mode === 'puzzle' ? 'Number of pieces' : 'How to paint'}>
              {variants.map((v) => {
                const r = progress[progressKey(a.id, v)];
                return (
                  <button key={v} role="radio" aria-checked={variant === v} className={`option ${variant === v ? 'on' : ''}`} onClick={() => setVariant(v)} data-variant={v}>
                    <strong>{variantLabel(a, v)}</strong>
                    <small>{variantHint(a, v)}</small>
                    {r?.completed ? <em><Icon name="check" size={13} />Completed</em> : r && r.progress > 0 ? <em>{Math.round(r.progress * 100)}% done</em> : null}
                  </button>
                );
              })}
            </div>
          )}

          {inProgress && <div className="card-progress"><ProgressBar value={rec.progress} /><span>{Math.round(rec.progress * 100)}%</span></div>}
          <div className="cta">
            <button className="btn btn-primary btn-lg" onClick={play} data-testid="start">
              {rec?.completed ? 'View finished piece' : inProgress ? 'Keep going' : `Start ${MODE_LABEL[a.mode].toLowerCase()}`}
            </button>
            {rec && (rec.completed || inProgress) && <button className="btn" onClick={() => (rec.completed ? (resetProgress(rec.key), play()) : setConfirm(true))} data-testid="restart"><Icon name="replay" size={18} />Start again</button>}
          </div>
        </div>
      </div>

      {others.length > 0 && col && (
        <section aria-labelledby="h-more">
          <div className="sect-head"><h2 id="h-more">More from {col.title}</h2></div>
          <div className="grid grid-3">{others.map((x: Activity) => <ActivityCard key={x.id} activity={x} />)}</div>
        </section>
      )}
      {confirm && rec && <Confirm title="Start again?" body={`This clears your current progress on “${a.title}” (${variantLabel(a, variant)}). Finished pieces stay in My Gallery.`} confirm="Start again" danger
        onCancel={() => setConfirm(false)} onConfirm={() => { resetProgress(rec.key); setConfirm(false); play(); }} />}
    </div>
  );
}
