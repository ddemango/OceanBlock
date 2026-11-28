import { useState } from 'react';
import { getActivity, MODE_LABEL } from '../content/catalog';
import { exportPng } from '../lib/raster';
import { href, navigate } from '../router';
import { resetProgress, useApp, type GalleryEntry, type ProgressRecord } from '../store/app';
import { ActivityCard, ArtThumb, Confirm, Dialog, ModeBadge, toast } from '../ui/common';
import { Icon } from '../ui/Icon';
import { variantLabel } from './labels';

type Tab = 'progress' | 'completed' | 'favorites';

export function Gallery({ tab }: { tab?: string }) {
  const { progress, gallery, favorites, stats } = useApp((d) => d);
  const t: Tab = tab === 'completed' || tab === 'favorites' ? tab : 'progress';
  const [view, setView] = useState<GalleryEntry | null>(null);
  const [reset, setReset] = useState<ProgressRecord | null>(null);
  const active = Object.values(progress).filter((p) => !p.completed && getActivity(p.activityId)).sort((a, b) => b.updatedAt - a.updatedAt);
  const done = gallery.filter((g) => getActivity(g.activityId));
  const favs = favorites.map((f) => getActivity(f)).filter((a) => !!a);
  const counts = { progress: active.length, completed: done.length, favorites: favs.length };

  const save = async (g: GalleryEntry) => {
    const a = getActivity(g.activityId)!;
    try { const r = await exportPng(a, g.fills, a.title); toast(r === 'downloaded' ? 'Image saved to your downloads' : 'Image shared'); }
    catch { toast('The image could not be exported'); }
  };
  const replay = (g: GalleryEntry) => {
    const rec = progress[g.id];
    if (!rec || rec.completed) resetProgress(g.id); // nothing in progress to lose; the gallery entry is kept
    navigate({ name: 'play', id: g.activityId, variant: g.variant });
  };

  return (
    <div className="page">
      <header className="page-head"><h1>My Gallery</h1><p className="lede">Everything you have started, finished and loved, kept on this device.</p></header>

      <dl className="stats" data-testid="stats">
        <div><dt>Finished</dt><dd>{done.length}</dd></div>
        <div><dt>Pieces placed</dt><dd>{stats.pieces}</dd></div>
        <div><dt>Areas painted</dt><dd>{stats.regions}</dd></div>
        <div><dt>Objects found</dt><dd>{stats.objects}</dd></div>
        <div><dt>Days visited</dt><dd>{stats.days.length}</dd></div>
      </dl>

      <div className="tabs" role="tablist">
        {(['progress', 'completed', 'favorites'] as Tab[]).map((x) => (
          <a key={x} role="tab" aria-selected={t === x} className={t === x ? 'on' : ''} href={href({ name: 'gallery', tab: x })} onClick={(e) => { e.preventDefault(); navigate({ name: 'gallery', tab: x }, true); }} data-testid={`tab-${x}`}>
            {x === 'progress' ? 'In progress' : x === 'completed' ? 'Completed' : 'Favourites'} <span>{counts[x]}</span>
          </a>
        ))}
      </div>

      {t === 'progress' && (active.length ? (
        <div className="grid" data-testid="gallery-progress">
          {active.map((p) => {
            const a = getActivity(p.activityId)!;
            return (
              <div key={p.key} className="stack">
                <ActivityCard activity={a} progress={p} to={{ name: 'play', id: a.id, variant: p.variant }} note={variantLabel(a, p.variant)} />
                <button className="linkbtn" onClick={() => setReset(p)}><Icon name="trash" size={15} />Reset</button>
              </div>
            );
          })}
        </div>
      ) : <Empty icon="puzzle" text="Nothing in progress. Start something from Home or Explore and it will wait for you here." />)}

      {t === 'completed' && (done.length ? (
        <div className="grid" data-testid="gallery-completed">
          {done.map((g) => {
            const a = getActivity(g.activityId)!;
            return (
              <div key={g.id} className="card" data-mode={a.mode} data-entry={g.id}>
                <button className="card-art cardbtn" onClick={() => setView(g)} aria-label={`View ${a.title}`}><ArtThumb activity={a} fills={g.fills} stamp={g.completedAt} /></button>
                <div className="card-body">
                  <ModeBadge mode={a.mode} />
                  <h3>{a.title}</h3>
                  <p className="meta">{g.label} · {new Date(g.completedAt).toLocaleDateString()}{g.times > 1 ? ` · ×${g.times}` : ''}</p>
                  <div className="card-actions">
                    <button className="chip" onClick={() => save(g)}><Icon name="download" size={15} />Save</button>
                    <button className="chip" onClick={() => replay(g)}><Icon name="replay" size={15} />Replay</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : <Empty icon="gallery" text="Finished pieces appear here, ready to revisit, replay or save as an image." />)}

      {t === 'favorites' && (favs.length ? <div className="grid" data-testid="gallery-favorites">{favs.map((a) => <ActivityCard key={a!.id} activity={a!} />)}</div>
        : <Empty icon="heart" text="Tap the heart on any activity to keep it close." />)}

      {view && (() => {
        const a = getActivity(view.activityId)!;
        return (
          <Dialog title={a.title} onClose={() => setView(null)} wide actions={<>
            <button className="btn" onClick={() => replay(view)}><Icon name="replay" size={18} />Replay</button>
            <button className="btn btn-primary" onClick={() => save(view)}><Icon name="download" size={18} />Save image</button>
          </>}>
            <ArtThumb activity={a} fills={view.fills} stamp={view.completedAt} className="viewer" />
            <p className="meta">{MODE_LABEL[a.mode]} · {view.label} · completed {new Date(view.completedAt).toLocaleDateString()}</p>
          </Dialog>
        );
      })()}
      {reset && <Confirm title="Reset progress?" body={`This clears your progress on “${getActivity(reset.activityId)?.title}” (${variantLabel(getActivity(reset.activityId)!, reset.variant)}). Finished pieces stay in your gallery.`} confirm="Reset" danger
        onCancel={() => setReset(null)} onConfirm={() => { resetProgress(reset.key); setReset(null); }} />}
    </div>
  );
}

function Empty({ icon, text }: { icon: string; text: string }) {
  return <div className="empty"><Icon name={icon} size={28} /><p>{text}</p><a className="btn btn-primary" href={href({ name: 'explore' })}>Explore activities</a></div>;
}
