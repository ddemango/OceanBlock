import { useEffect, useRef, useState } from 'react';
import { ACTIVITIES } from '../content/catalog';
import type { Difficulty, FindActivity } from '../content/types';
import { buildCreation } from '../photo/creation';
import { objectPool } from '../photo/hide';
import { preparePhoto, readPhoto, titleFromName, type PickedPhoto } from '../photo/load';
import { goBack, navigate } from '../router';
import { addCreation, useApp } from '../store/app';
import { toast } from '../ui/common';
import { Icon } from '../ui/Icon';

const LEVELS: { id: Difficulty; label: string; hint: string }[] = [
  { id: 'Relaxed', label: 'Relaxed', hint: 'Bigger paint areas, 8 hidden objects' },
  { id: 'Moderate', label: 'Moderate', hint: 'A balanced mix, 12 hidden objects' },
  { id: 'Detailed', label: 'Detailed', hint: 'Fine detail, 16 small hidden objects' },
];

const nextFrame = () => new Promise<void>((r) => requestAnimationFrame(() => setTimeout(r, 30)));

export function CreatePage() {
  const storageOk = useApp((d) => d.storageOk);
  const [photo, setPhoto] = useState<PickedPhoto | null>(null);
  const [title, setTitle] = useState('');
  const [level, setLevel] = useState<Difficulty>('Moderate');
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => { if (photo) URL.revokeObjectURL(photo.url); }, [photo]);

  const pick = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    try {
      const p = await readPhoto(file);
      setPhoto(p);
      setTitle(titleFromName(p.name));
    } catch (e) { setError((e as Error).message); }
  };

  const create = async () => {
    if (!photo || busy) return;
    setError(null);
    try {
      setBusy('Getting your photo ready…');
      await nextFrame();
      const prepared = preparePhoto(photo.img, level);
      setBusy('Mixing the paint colours…');
      await nextFrame();
      const id = `photo-${Date.now().toString(36)}${Math.floor(Math.random() * 1296).toString(36)}`;
      const pool = objectPool(ACTIVITIES.filter((a): a is FindActivity => a.mode === 'find'));
      const c = buildCreation({ id, title: title.trim() || titleFromName(''), difficulty: level, image: prepared.image, aspect: prepared.aspect, grid: prepared.grid, pool });
      setBusy('Hiding little objects…');
      await nextFrame();
      await addCreation(c);
      toast('Your photo is ready to play');
      navigate({ name: 'collection', id: c.id }, true);
    } catch (e) {
      const quota = (e as Error).name === 'QuotaExceededError';
      setError(quota ? 'There is not enough space on this device to keep another photo. Deleting an older photo will make room.' : 'Something went wrong while preparing this photo. Please try another one.');
      setBusy(null);
    }
  };

  return (
    <div className="page create">
      <button className="linkbtn backlink" onClick={() => goBack({ name: 'home' })}><Icon name="back" size={18} />Back</button>
      <header className="create-head">
        <p className="eyebrow">Make your own</p>
        <h1>Play with your own photo</h1>
        <p className="lede">Pick a favourite picture: family, a pet, a garden, a trip. We’ll turn it into a jigsaw, a paint-by-number and a hidden-object scene.</p>
      </header>

      {!photo ? (
        <label
          className={`dropzone ${drag ? 'on' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); void pick(e.dataTransfer.files[0]); }}
        >
          <input ref={inputRef} type="file" accept="image/*" className="sr-only" data-testid="photo-input" onChange={(e) => { void pick(e.target.files?.[0]); e.target.value = ''; }} />
          <span className="dropzone-icon" aria-hidden="true"><Icon name="plus" size={30} /></span>
          <strong>Choose a photo</strong>
          <span>From your photo library or camera</span>
        </label>
      ) : (
        <div className="create-cols">
          <div className="create-preview">
            <img src={photo.url} alt="Your chosen photo" />
            <button className="btn" onClick={() => inputRef.current?.click()} disabled={!!busy}>Choose a different photo</button>
            <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={(e) => { void pick(e.target.files?.[0]); e.target.value = ''; }} />
          </div>
          <div className="create-form">
            <label className="field">
              <span>Name</span>
              <input type="text" value={title} maxLength={40} onChange={(e) => setTitle(e.target.value)} disabled={!!busy} data-testid="photo-title" />
            </label>
            <div className="options" role="radiogroup" aria-label="Level of detail">
              {LEVELS.map((l) => (
                <button key={l.id} role="radio" aria-checked={level === l.id} className={`option ${level === l.id ? 'on' : ''}`} onClick={() => setLevel(l.id)} disabled={!!busy} data-level={l.id}>
                  <strong>{l.label}</strong>
                  <small>{l.hint}</small>
                </button>
              ))}
            </div>
            <ul className="create-list">
              <li><Icon name="puzzle" size={18} />A jigsaw of 36 to 196 pieces</li>
              <li><Icon name="paint" size={18} />A paint-by-number in your photo’s own colours</li>
              <li><Icon name="find" size={18} />Little objects hidden in your photo to find</li>
            </ul>
            <button className="btn btn-primary btn-lg" onClick={create} disabled={!!busy} data-testid="create-photo">
              {busy ? <><span className="spinner spinner-sm" aria-hidden="true" />{busy}</> : 'Make my activities'}
            </button>
            <p className="note" aria-live="polite"><Icon name="info" size={16} />{storageOk ? 'Your photo stays on this device. It is never uploaded.' : 'Storage is unavailable, so this photo will be gone when you close the app.'}</p>
          </div>
        </div>
      )}
      {error && <p className="form-error" role="alert">{error}</p>}
    </div>
  );
}
