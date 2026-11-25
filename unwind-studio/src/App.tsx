import { Component, useEffect, useState, type ReactNode } from 'react';
import { getActivity } from './content/catalog';
import { FindPlayer } from './players/FindPlayer';
import { JigsawPlayer } from './players/JigsawPlayer';
import { PaintPlayer } from './players/PaintPlayer';
import { setNativeTheme } from './lib/native';
import { href, navigate, useRoute, type Route } from './router';
import { CreatePage } from './screens/Create';
import { ActivityPage, CollectionPage, NotFound } from './screens/Detail';
import { Explore } from './screens/Explore';
import { Gallery } from './screens/Gallery';
import { Home } from './screens/Home';
import { Settings } from './screens/Settings';
import { progressKey, resetProgress, setNotice, useApp } from './store/app';
import { Toasts } from './ui/common';
import { Icon } from './ui/Icon';

class Boundary extends Component<{ children: ReactNode; onBack(): void }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (!this.state.error) return this.props.children;
    const offline = typeof navigator !== 'undefined' && navigator.onLine === false;
    return (
      <div className="page"><div className="empty" role="alert">
        <Icon name="info" size={28} />
        <p>{offline ? 'This part of the app has not been downloaded yet. Connect once and it will be available offline afterwards.' : 'Something went wrong while opening this.'}</p>
        <div className="btnrow"><button className="btn" onClick={this.props.onBack}>Go back</button><button className="btn btn-primary" onClick={() => this.setState({ error: null })}>Try again</button></div>
      </div></div>
    );
  }
}

function Play({ id, variant }: { id: string; variant: string }) {
  const a = getActivity(id);
  const [run, setRun] = useState(0);
  if (!a) return <NotFound what="activity" />;
  const restart = () => { resetProgress(progressKey(id, variant)); setRun((r) => r + 1); };
  if (a.mode === 'puzzle') {
    const count = Number(variant);
    if (!a.pieceCounts.includes(count)) return <NotFound what="puzzle size" />;
    return <JigsawPlayer key={run} activity={a} count={count} onRestart={restart} />;
  }
  if (a.mode === 'paint') {
    if (variant !== 'pbn' && variant !== 'creative') return <NotFound what="activity" />;
    return <PaintPlayer key={run} activity={a} variant={variant} onRestart={restart} />;
  }
  return <FindPlayer key={run} activity={a} onRestart={restart} />;
}

const NAV: { route: Route; label: string; icon: string; match: string[] }[] = [
  { route: { name: 'home' }, label: 'Home', icon: 'home', match: ['home', 'create'] },
  { route: { name: 'explore' }, label: 'Explore', icon: 'explore', match: ['explore', 'collection', 'activity'] },
  { route: { name: 'gallery' }, label: 'My Gallery', icon: 'gallery', match: ['gallery'] },
  { route: { name: 'settings' }, label: 'Settings', icon: 'settings', match: ['settings'] },
];

export function App() {
  const ready = useApp((d) => d.ready);
  const prefs = useApp((d) => d.prefs);
  const notice = useApp((d) => d.notice);
  const route = useRoute();

  useEffect(() => {
    const root = document.documentElement;
    if (prefs.theme === 'system') delete root.dataset.theme; else root.dataset.theme = prefs.theme;
    if (prefs.motion === 'system') delete root.dataset.motion; else root.dataset.motion = prefs.motion;
    setNativeTheme(prefs.theme === 'dark' || (prefs.theme === 'system' && matchMedia('(prefers-color-scheme: dark)').matches));
  }, [prefs.theme, prefs.motion]);
  useEffect(() => { if (route.name !== 'play') window.scrollTo(0, 0); }, [route]);

  if (!ready) return <div className="splash"><div className="spinner" /><p>Unwind with Ma Dukes</p></div>;

  const banner = notice && <div className="notice" role="status"><span>{notice}</span><button className="iconbtn" onClick={() => setNotice(null)} aria-label="Dismiss"><Icon name="close" size={18} /></button></div>;

  if (route.name === 'play') {
    return <Boundary key={route.id + route.variant} onBack={() => navigate({ name: 'activity', id: route.id }, true)}>
      <Play id={route.id} variant={route.variant} />{banner}<Toasts />
    </Boundary>;
  }

  return (
    <div className="shell">
      <nav className="nav" aria-label="Main">
        <a className="brand" href={href({ name: 'home' })} aria-label="Unwind with Ma Dukes home"><span className="brand-mark" aria-hidden="true" /><span>Unwind<i>with Ma Dukes</i></span></a>
        {NAV.map((n) => (
          <a key={n.label} href={href(n.route)} className={n.match.includes(route.name) ? 'on' : ''} aria-current={n.match.includes(route.name) ? 'page' : undefined} data-testid={`nav-${n.route.name}`}>
            <Icon name={n.icon} /><span>{n.label}</span>
          </a>
        ))}
      </nav>
      <main className="main" id="main">
        {banner}
        <Boundary key={JSON.stringify(route)} onBack={() => navigate({ name: 'home' }, true)}>
          {route.name === 'home' && <Home />}
          {route.name === 'explore' && <Explore mode={route.mode} fav={route.fav} />}
          {route.name === 'gallery' && <Gallery tab={route.tab} />}
          {route.name === 'settings' && <Settings />}
          {route.name === 'create' && <CreatePage />}
          {route.name === 'collection' && <CollectionPage id={route.id} />}
          {route.name === 'activity' && <ActivityPage key={route.id} id={route.id} />}
        </Boundary>
      </main>
      <Toasts />
    </div>
  );
}
