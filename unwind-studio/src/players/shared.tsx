import { useEffect, useState, type ReactNode } from 'react';
import { ACTIVITIES, getCollection, MODE_LABEL } from '../content/catalog';
import type { Activity, Mode } from '../content/types';
import type { SavedView } from '../engine/view';
import { cue } from '../lib/feedback';
import { exportPng } from '../lib/raster';
import type { Stage } from '../lib/stage';
import { goBack, href, navigate } from '../router';
import { addGalleryEntry, bumpStats, flushSaves, getApp, markTutorialSeen, progressKey, putProgress, resetProgress, setNotice, setPrefs, useApp, type ProgressRecord } from '../store/app';
import { ArtThumb, Confirm, Dialog, MODE_ICON, ProgressBar, toast } from '../ui/common';
import { Icon } from '../ui/Icon';

// ---------- progress helpers ----------
export function loadSaved<S>(a: Activity, variant: string, valid: (s: unknown) => s is S): { state: S | null; rec: ProgressRecord | null } {
  const key = progressKey(a.id, variant);
  const rec = getApp().progress[key];
  if (!rec) return { state: null, rec: null };
  if (rec.contentVersion !== a.version || !valid(rec.state)) {
    resetProgress(key);
    setNotice(rec.contentVersion !== a.version
      ? `“${a.title}” has been updated since you last played, so it starts fresh.`
      : `Saved progress for “${a.title}” could not be read, so it starts fresh.`);
    return { state: null, rec: null };
  }
  return { state: JSON.parse(JSON.stringify(rec.state)) as S, rec };
}

export function persist(a: Activity, variant: string, state: unknown, progress: number, completed: boolean, view: SavedView | undefined, startedAt: number) {
  putProgress({
    key: progressKey(a.id, variant), activityId: a.id, mode: a.mode, variant, contentVersion: a.version,
    state: JSON.parse(JSON.stringify(state)), view, progress, completed, startedAt, updatedAt: Date.now(),
  });
}

export function recordCompletion(a: Activity, variant: string, label: string, fills?: Record<string, string>) {
  addGalleryEntry({ id: progressKey(a.id, variant), activityId: a.id, mode: a.mode, variant, label, completedAt: Date.now(), fills });
  bumpStats({ completed: 1 });
  cue('complete');
}

// ---------- shell ----------
function SaveStatus() {
  const status = useApp((d) => d.saveStatus);
  const ok = useApp((d) => d.storageOk);
  const text = !ok ? 'Not saving' : status === 'saving' ? 'Saving…' : status === 'error' ? 'Save failed' : 'Saved';
  return <span className={`savestate ${!ok || status === 'error' ? 'bad' : ''}`} data-testid="save-status" title={!ok ? 'Storage is unavailable in this session' : undefined}>{text}</span>;
}

export interface Tip { icon: string; title: string; text: string }

export function PlayerShell(props: {
  activity: Activity;
  subtitle: string;
  progress: number;
  progressLabel: string;
  tips: Tip[];
  onHint?(): void;
  hintLabel?: string;
  stage: Stage | null;
  tray?: ReactNode;
  children: ReactNode;
  overlay?: ReactNode;
  live?: string;
}) {
  const { activity: a } = props;
  const sound = useApp((d) => d.prefs.sound);
  const seen = useApp((d) => d.tutorials[a.mode]);
  const [help, setHelp] = useState(!seen);
  useEffect(() => () => { void flushSaves(); }, []);
  const closeHelp = () => { setHelp(false); markTutorialSeen(a.mode); };
  return (
    <div className="player" data-mode={a.mode}>
      <header className="pbar">
        <button className="iconbtn" onClick={() => goBack({ name: 'activity', id: a.id })} aria-label="Back"><Icon name="back" /></button>
        <div className="ptitle">
          <h1>{a.title}</h1>
          <p><span data-testid="progress-label">{props.progressLabel}</span> · <SaveStatus /></p>
        </div>
        <div className="pactions">
          {props.onHint && <button className="iconbtn" onClick={props.onHint} aria-label={props.hintLabel ?? 'Hint'} data-testid="hint"><Icon name="hint" /></button>}
          <button className="iconbtn" onClick={() => setPrefs({ sound: !sound })} aria-label={sound ? 'Turn sound off' : 'Turn sound on'} aria-pressed={sound}><Icon name={sound ? 'soundOn' : 'soundOff'} /></button>
          <button className="iconbtn" onClick={() => setHelp(true)} aria-label="How to play" data-testid="help"><Icon name="help" /></button>
        </div>
      </header>
      <ProgressBar value={props.progress} label={`${a.title} progress`} />
      <main className="pstage">
        {props.children}
        <div className="zoomctl" role="group" aria-label="View">
          <button className="iconbtn" onClick={() => props.stage?.zoomBy(1.5)} aria-label="Zoom in"><Icon name="plus" /></button>
          <button className="iconbtn" onClick={() => props.stage?.zoomBy(1 / 1.5)} aria-label="Zoom out"><Icon name="minus" /></button>
          <button className="iconbtn" onClick={() => props.stage?.reset()} aria-label="Reset view" data-testid="reset-view"><Icon name="fit" /></button>
        </div>
      </main>
      {props.tray}
      <div className="sr-only" role="status" aria-live="polite">{props.live}</div>
      {props.overlay}
      {help && (
        <Dialog title={`How to play ${MODE_LABEL[a.mode]}`} onClose={closeHelp} actions={<>
          {!seen && <button className="btn" onClick={closeHelp}>Skip</button>}
          <button className="btn btn-primary" onClick={closeHelp} data-testid="tutorial-ok">Got it</button>
        </>}>
          <ul className="tips">
            {props.tips.map((t) => <li key={t.title}><span className="tip-ic"><Icon name={t.icon} /></span><div><strong>{t.title}</strong><p>{t.text}</p></div></li>)}
          </ul>
        </Dialog>
      )}
    </div>
  );
}

// ---------- completion ----------
export function Completion({ activity: a, detail, fills, onClose, onReplay, closeLabel = 'Admire the artwork' }: {
  activity: Activity; detail: string; fills?: Record<string, string>; onClose(): void; onReplay(): void; closeLabel?: string;
}) {
  const col = getCollection(a.collectionId);
  const next = ACTIVITIES.find((x) => x.collectionId === a.collectionId && x.id !== a.id && !Object.values(getApp().progress).some((p) => p.activityId === x.id && p.completed))
    ?? ACTIVITIES.find((x) => x.collectionId === a.collectionId && x.id !== a.id);
  const [busy, setBusy] = useState(false);
  const save = async () => {
    setBusy(true);
    try { const r = await exportPng(a, fills, a.title); toast(r === 'downloaded' ? 'Image saved to your downloads' : 'Image shared'); }
    catch { toast('The image could not be exported'); }
    setBusy(false);
  };
  return (
    <div className="scrim scrim-soft" data-testid="completion">
      <div className="dialog done" role="dialog" aria-modal="true" aria-label="Activity complete" data-mode={a.mode}>
        <div className="petals" aria-hidden="true">{Array.from({ length: 14 }, (_, i) => <i key={i} style={{ ['--i' as string]: i }} />)}</div>
        <ArtThumb activity={a} fills={fills} stamp="done" className="done-art" />
        <p className="eyebrow"><Icon name="sparkle" size={16} /> Complete</p>
        <h2>{a.title}</h2>
        <p className="meta">{detail} · saved to My Gallery</p>
        <div className="done-actions">
          <button className="btn btn-primary" onClick={save} disabled={busy} data-testid="export"><Icon name="download" size={18} />{busy ? 'Preparing…' : 'Save image'}</button>
          <button className="btn" onClick={onClose} data-testid="completion-close">{closeLabel}</button>
          <button className="btn" onClick={onReplay} data-testid="replay"><Icon name="replay" size={18} />Play again</button>
        </div>
        {next && col && (
          <a className="nextup" href={href({ name: 'activity', id: next.id })} onClick={(e) => { e.preventDefault(); navigate({ name: 'activity', id: next.id }, true); }}>
            <ArtThumb activity={next} />
            <span><small>More from {col.title}</small><strong><Icon name={MODE_ICON[next.mode]} size={15} /> {next.title}</strong></span>
            <Icon name="next" />
          </a>
        )}
      </div>
    </div>
  );
}

/** Confirmation used before throwing away active progress. */
export function ReplayConfirm({ activity, onConfirm, onCancel }: { activity: Activity; onConfirm(): void; onCancel(): void }) {
  return <Confirm title="Start again?" body={`This clears your current progress on “${activity.title}”. Finished pieces stay in My Gallery.`} confirm="Start again" danger onConfirm={onConfirm} onCancel={onCancel} />;
}

export const TIPS: Record<Mode, Tip[]> = {
  puzzle: [
    { icon: 'puzzle', title: 'Drag pieces out of the tray', text: 'Swipe the tray sideways to browse. Drag a piece up onto the table to place it; drop it back on the tray to return it.' },
    { icon: 'check', title: 'Pieces click together', text: 'Matching neighbours join and move as one. A piece or group dropped in the right spot on the board locks in place.' },
    { icon: 'fit', title: 'Move around freely', text: 'Drag empty space to pan, pinch or scroll to zoom. The frame button resets the view.' },
    { icon: 'hint', title: 'Helpers when you want them', text: 'Show only edge pieces, turn on a faint guide, peek at the picture, or ask for a hint. Keyboard: Enter picks up a tray piece, arrows move it, Enter drops it.' },
  ],
  paint: [
    { icon: 'paint', title: 'Pick a colour, tap its numbers', text: 'Areas waiting for the chosen colour are marked with stripes. Tap one to fill it. The palette shows how many are left.' },
    { icon: 'fit', title: 'Zoom in for small areas', text: 'Pinch or scroll to zoom and drag to pan — moving the picture never paints. Numbers appear as areas get large enough to read.' },
    { icon: 'undo', title: 'Nothing is permanent', text: 'Undo and redo any fill. A hint takes you to an area that still needs colour.' },
    { icon: 'sparkle', title: 'Free colouring', text: 'Prefer your own palette? Open the same picture in Free colouring and choose any colours you like.' },
  ],
  find: [
    { icon: 'find', title: 'Find everything in the tray', text: 'Each object in the tray is somewhere in the scene, looking exactly like its picture. Tap it in the scene when you spot it.' },
    { icon: 'fit', title: 'Look closer', text: 'Pinch or scroll to zoom and drag to explore. There is no timer and no penalty for a wrong guess.' },
    { icon: 'hint', title: 'Stuck?', text: 'A hint circles the area of one object you have not found yet.' },
  ],
};
