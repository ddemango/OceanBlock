import { useEffect, useState } from 'react';
import { ACTIVITIES, MODE_LABEL } from '../content/catalog';
import type { Mode } from '../content/types';
import { hapticsSupported } from '../lib/feedback';
import { TIPS } from '../players/shared';
import { clearAllData, resetTutorials, savedDataSize, setPrefs, useApp, type Prefs } from '../store/app';
import { Confirm, Dialog, toast } from '../ui/common';
import { Icon } from '../ui/Icon';

function Segmented<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: [T, string][]; onChange(v: T): void }) {
  return (
    <div className="seg" role="radiogroup" aria-label={label}>
      {options.map(([v, text]) => <button key={v} role="radio" aria-checked={value === v} className={value === v ? 'on' : ''} onClick={() => onChange(v)}>{text}</button>)}
    </div>
  );
}

function Toggle({ label, hint, checked, onChange, disabled }: { label: string; hint?: string; checked: boolean; onChange(v: boolean): void; disabled?: boolean }) {
  return (
    <label className={`setrow ${disabled ? 'disabled' : ''}`}>
      <span><strong>{label}</strong>{hint && <small>{hint}</small>}</span>
      <input type="checkbox" role="switch" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
    </label>
  );
}

export function Settings() {
  const prefs = useApp((d) => d.prefs);
  const storageOk = useApp((d) => d.storageOk);
  const [tips, setTips] = useState<Mode | null>(null);
  const [confirm, setConfirm] = useState(false);
  const [offline, setOffline] = useState<'checking' | 'ready' | 'no'>('checking');
  useEffect(() => {
    if (!('serviceWorker' in navigator)) { setOffline('no'); return; }
    navigator.serviceWorker.getRegistration().then((r) => setOffline(r?.active ? 'ready' : 'no')).catch(() => setOffline('no'));
  }, []);
  const credits = ACTIVITIES.filter((a) => a.attribution);

  return (
    <div className="page page-narrow">
      <header className="page-head"><h1>Settings</h1></header>

      <section className="panel" aria-labelledby="s-look">
        <h2 id="s-look">Appearance</h2>
        <div className="setrow"><span><strong>Theme</strong><small>Artwork always keeps its original colours.</small></span>
          <Segmented<Prefs['theme']> label="Theme" value={prefs.theme} options={[['system', 'Auto'], ['light', 'Light'], ['dark', 'Dark']]} onChange={(theme) => setPrefs({ theme })} /></div>
        <div className="setrow"><span><strong>Motion</strong><small>Reduced motion removes animated transitions and celebrations.</small></span>
          <Segmented<Prefs['motion']> label="Motion" value={prefs.motion} options={[['system', 'Auto'], ['reduced', 'Reduced'], ['full', 'Full']]} onChange={(motion) => setPrefs({ motion })} /></div>
      </section>

      <section className="panel" aria-labelledby="s-feel">
        <h2 id="s-feel">Sound &amp; touch</h2>
        <Toggle label="Sound" hint="Soft clicks and chimes while you play." checked={prefs.sound} onChange={(sound) => setPrefs({ sound })} />
        <Toggle label="Haptics" hint={hapticsSupported() ? 'A light vibration when something clicks into place.' : 'Not supported on this device or browser.'} checked={prefs.haptics && hapticsSupported()} disabled={!hapticsSupported()} onChange={(haptics) => setPrefs({ haptics })} />
      </section>

      <section className="panel" aria-labelledby="s-help">
        <h2 id="s-help">How to play</h2>
        <div className="setrow"><span><strong>Tutorials</strong><small>Reopen the short guide for any activity.</small></span>
          <span className="btnrow">{(['puzzle', 'paint', 'find'] as Mode[]).map((m) => <button key={m} className="chip" onClick={() => setTips(m)}>{MODE_LABEL[m]}</button>)}</span></div>
        <div className="setrow"><span><strong>First-time tips</strong><small>Show the guide again the next time you open each activity.</small></span>
          <button className="btn" onClick={() => { resetTutorials(); toast('Tutorials will show again'); }}>Reset</button></div>
      </section>

      <section className="panel" aria-labelledby="s-data">
        <h2 id="s-data">Your data</h2>
        <div className="setrow"><span><strong>Saved on this device</strong><small>{storageOk ? `About ${Math.max(1, Math.round(savedDataSize() / 1024))} KB of progress, favourites and gallery entries. No account needed; nothing leaves your device.` : 'Storage is unavailable in this browser session, so progress cannot be kept.'}</small></span></div>
        <div className="setrow"><span><strong>Offline play</strong><small>{offline === 'ready' ? 'All bundled activities are stored and playable without a connection.' : offline === 'checking' ? 'Checking…' : 'Not stored for offline use yet. Open the installed or hosted app once while online to make everything available offline.'}</small></span>
          <span className={`pill ${offline === 'ready' ? 'ok' : ''}`} data-testid="offline-status">{offline === 'ready' ? 'Ready' : offline === 'checking' ? '…' : 'Online only'}</span></div>
        <div className="setrow"><span><strong>Clear everything</strong><small>Removes all progress, gallery entries, favourites and statistics.</small></span>
          <button className="btn btn-danger" onClick={() => setConfirm(true)}><Icon name="trash" size={18} />Clear data</button></div>
      </section>

      <section className="panel" aria-labelledby="s-credits">
        <h2 id="s-credits">Credits</h2>
        <p className="meta">All artwork in Unwind Studio is original vector illustration created for this app. Type is set in Nunito (SIL Open Font License 1.1).</p>
        {credits.map((a) => <p key={a.id} className="meta">{a.title}: {a.attribution!.author}, {a.attribution!.license}{a.attribution!.source ? ` — ${a.attribution!.source}` : ''}</p>)}
        <p className="meta">Unwind Studio {__APP_VERSION__}</p>
      </section>

      {tips && <Dialog title={`How to play ${MODE_LABEL[tips]}`} onClose={() => setTips(null)} actions={<button className="btn btn-primary" onClick={() => setTips(null)}>Got it</button>}>
        <ul className="tips">{TIPS[tips].map((t) => <li key={t.title}><span className="tip-ic"><Icon name={t.icon} /></span><div><strong>{t.title}</strong><p>{t.text}</p></div></li>)}</ul>
      </Dialog>}
      {confirm && <Confirm title="Clear all data?" body="This permanently removes your progress, completed gallery, favourites and statistics from this device. It cannot be undone." confirm="Clear everything" danger
        onCancel={() => setConfirm(false)} onConfirm={async () => { await clearAllData(); setConfirm(false); toast('All data cleared'); }} />}
    </div>
  );
}
