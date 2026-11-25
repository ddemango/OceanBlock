import '@fontsource-variable/fraunces';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { ACTIVITIES, COLLECTIONS } from './content/catalog';
import { getApp, initApp } from './store/app';
import './styles.css';

createRoot(document.getElementById('root')!).render(<App />);
void initApp();
// read-only handle used by the automated play-through (scripts/e2e.mjs)
(window as unknown as Record<string, unknown>).__unwind = { getApp };

if (import.meta.env.DEV) {
  // surface content problems early while authoring
  void import('./content/validate').then(({ validateCatalog }) => {
    const issues = validateCatalog(ACTIVITIES, COLLECTIONS);
    if (issues.length) console.warn('Content issues', issues);
  });
}

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => { navigator.serviceWorker.register('./sw.js').catch(() => { /* offline support is optional */ }); });
}
