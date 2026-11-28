import '@fontsource-variable/nunito';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { ACTIVITIES, COLLECTIONS } from './content/catalog';
import { initNative, isNative } from './lib/native';
import { getApp, initApp } from './store/app';
import './styles.css';

createRoot(document.getElementById('root')!).render(<App />);
void initApp();
void initNative();
// read-only handle used by the automated play-through (scripts/e2e.mjs)
(window as unknown as Record<string, unknown>).__unwind = { getApp };

if (import.meta.env.DEV) {
  // surface content problems early while authoring
  void import('./content/validate').then(({ validateCatalog }) => {
    const issues = validateCatalog(ACTIVITIES, COLLECTIONS);
    if (issues.length) console.warn('Content issues', issues);
  });
}

// the native app ships its files inside the bundle, so it needs no service worker
if (import.meta.env.PROD && !isNative && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => { navigator.serviceWorker.register('./sw.js').catch(() => { /* offline support is optional */ }); });
}
