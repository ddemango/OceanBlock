import { useEffect, useRef, useState, type ReactNode } from 'react';
import { getCollection, MODE_LABEL } from '../content/catalog';
import type { Activity } from '../content/types';
import { thumbUrl } from '../lib/raster';
import { href, type Route } from '../router';
import { toggleFavorite, useApp, type ProgressRecord } from '../store/app';
import { Icon } from './Icon';

/** Large geometric mark for each activity, used as a graphic on colour fields. */
export function ModeGlyph({ mode }: { mode: Activity['mode'] }) {
  return (
    <svg className="glyph" viewBox="0 0 100 100" fill="currentColor" aria-hidden="true">
      {mode === 'puzzle' && <path d="M8 22h30c-3-4-4-7-4-10a12 12 0 0124 0c0 3-1 6-4 10h38v30c4-3 7-4 10-4a12 12 0 010 24c-3 0-6-1-10-4v24H8V62c4 3 7 4 10 4a12 12 0 000-24c-3 0-6 1-10 4z" />}
      {mode === 'paint' && <path d="M50 4c20 26 34 40 34 58a34 34 0 01-68 0C16 44 30 30 50 4z" />}
      {mode === 'find' && <path fillRule="evenodd" d="M42 6a36 36 0 0129 57l25 25-9 9-25-25A36 36 0 1142 6zm0 14a22 22 0 100 44 22 22 0 000-44z" />}
    </svg>
  );
}

export const MODE_ICON = { puzzle: 'puzzle', paint: 'paint', find: 'find' } as const;

/** Artwork thumbnail rendered from the real playable content. */
export function ArtThumb({ activity, fills, stamp, className = '' }: { activity: Activity; fills?: Record<string, string>; stamp?: string | number; className?: string }) {
  const [url, setUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let alive = true;
    setFailed(false);
    thumbUrl(activity, fills, String(stamp ?? '')).then((u) => alive && setUrl(u)).catch(() => alive && setFailed(true));
    return () => { alive = false; };
  }, [activity, stamp]); // eslint-disable-line react-hooks/exhaustive-deps
  if (failed) return <div className={`thumb thumb-failed ${className}`} role="img" aria-label="Artwork unavailable"><Icon name="gallery" /><span>Artwork unavailable</span></div>;
  return <div className={`thumb ${className}`}>{url ? <img src={url} alt="" draggable={false} /> : <div className="thumb-wait" />}</div>;
}

export function ModeBadge({ mode }: { mode: Activity['mode'] }) {
  return <span className="badge" data-mode={mode}><Icon name={MODE_ICON[mode]} size={14} />{MODE_LABEL[mode]}</span>;
}

export function ProgressBar({ value, label }: { value: number; label?: string }) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100);
  return <div className="bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label={label ?? 'Progress'}><i style={{ width: pct + '%' }} /></div>;
}

export function FavButton({ id, title }: { id: string; title: string }) {
  const fav = useApp((d) => d.favorites.includes(id));
  return (
    <button className={`fav ${fav ? 'on' : ''}`} aria-pressed={fav} aria-label={fav ? `Remove ${title} from favourites` : `Add ${title} to favourites`}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(id); }}>
      <Icon name="heart" filled={fav} size={20} />
    </button>
  );
}

/** Best progress record to show on a card: the most recent unfinished one, else the most recent. */
export function bestProgress(progress: Record<string, ProgressRecord>, activityId: string): ProgressRecord | undefined {
  const recs = Object.values(progress).filter((p) => p.activityId === activityId).sort((a, b) => b.updatedAt - a.updatedAt);
  return recs.find((r) => !r.completed && r.progress > 0) ?? recs.find((r) => r.completed) ?? undefined;
}

export function ActivityCard({ activity, to, progress, wide = false, note }: { activity: Activity; to?: Route; progress?: ProgressRecord; wide?: boolean; note?: string }) {
  const all = useApp((d) => d.progress);
  const rec = progress ?? bestProgress(all, activity.id);
  const col = getCollection(activity.collectionId);
  return (
    <a className={`card ${wide ? 'card-wide' : ''}`} data-mode={activity.mode} href={href(to ?? { name: 'activity', id: activity.id })} data-activity={activity.id}>
      <div className="card-art">
        <ArtThumb activity={activity} />
        <FavButton id={activity.id} title={activity.title} />
        {rec?.completed && <span className="done-chip"><Icon name="check" size={14} />Done</span>}
      </div>
      <div className="card-body">
        <ModeBadge mode={activity.mode} />
        <h3>{activity.title}</h3>
        <p className="meta">{note ?? `${activity.difficulty} · ${col?.title ?? ''}`}</p>
        {rec && !rec.completed && rec.progress > 0 && (
          <div className="card-progress"><ProgressBar value={rec.progress} label={`${activity.title} progress`} /><span>{Math.round(rec.progress * 100)}%</span></div>
        )}
      </div>
    </a>
  );
}

export function Dialog({ title, children, onClose, actions, wide = false }: { title: string; children: ReactNode; onClose(): void; actions?: ReactNode; wide?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); prev?.focus?.(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="scrim" onPointerDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={`dialog ${wide ? 'dialog-wide' : ''}`} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={ref}>
        <div className="dialog-head"><h2>{title}</h2><button className="iconbtn" onClick={onClose} aria-label="Close"><Icon name="close" /></button></div>
        <div className="dialog-body">{children}</div>
        {actions && <div className="dialog-actions">{actions}</div>}
      </div>
    </div>
  );
}

export function Confirm({ title, body, confirm, danger, onConfirm, onCancel }: { title: string; body: string; confirm: string; danger?: boolean; onConfirm(): void; onCancel(): void }) {
  return (
    <Dialog title={title} onClose={onCancel} actions={<>
      <button className="btn" onClick={onCancel}>Cancel</button>
      <button className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`} onClick={onConfirm} data-testid="confirm">{confirm}</button>
    </>}>
      <p>{body}</p>
    </Dialog>
  );
}

// ---- toasts ----
let pushToast: (msg: string) => void = () => {};
export const toast = (msg: string) => pushToast(msg);
export function Toasts() {
  const [items, setItems] = useState<{ id: number; msg: string }[]>([]);
  useEffect(() => {
    let n = 0;
    pushToast = (msg) => {
      const id = ++n;
      setItems((l) => [...l.slice(-2), { id, msg }]);
      setTimeout(() => setItems((l) => l.filter((t) => t.id !== id)), 3200);
    };
    return () => { pushToast = () => {}; };
  }, []);
  return <div className="toasts" role="status" aria-live="polite">{items.map((t) => <div key={t.id} className="toast">{t.msg}</div>)}</div>;
}
