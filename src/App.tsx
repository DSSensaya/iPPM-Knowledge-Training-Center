import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  Menu,
  Monitor,
  Network,
  UserRound,
  X,
} from 'lucide-react';
import { articles, learningPaths } from './data/content';
import { emptyProgress, loadProgress, STORAGE_KEY } from './lib/storage';
import type { Progress } from './lib/storage';
import Home from './pages/Home';
import { ArticlePage, Knowledge } from './pages/Knowledge';
import { Learning, LearningDetail } from './pages/Learning';
import Processes from './pages/Processes';
import Personal from './pages/Personal';
import Help from './pages/Help';

const navigation = [
  { path: '/', label: 'Übersicht', icon: LayoutDashboard },
  { path: '/wissen', label: 'Wissensbasis', icon: BookOpen },
  { path: '/lernpfade', label: 'Lernpfade', icon: GraduationCap },
  { path: '/prozesse', label: 'Prozesse', icon: Network },
  { path: '/mein-bereich', label: 'Mein Lernbereich', icon: UserRound },
];

export default function App() {
  const [route, setRoute] = useState(window.location.hash.slice(1) || '/');
  const [initial] = useState(loadProgress);
  const [progress, setProgress] = useState(initial.progress);
  const [storageError, setStorageError] = useState(initial.error);
  const [notice, setNotice] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const main = useRef<HTMLElement>(null);
  const [path, search = ''] = route.split('?');
  const params = new URLSearchParams(search);
  const active = path.startsWith('/artikel')
    ? '/wissen'
    : path.startsWith('/lernpfade')
      ? '/lernpfade'
      : path;
  const current =
    navigation.find((n) => n.path === active)?.label ||
    (path === '/hilfe' ? 'Hilfe & FAQ' : 'Seite');
  useEffect(() => {
    const changed = () => {
      setRoute(window.location.hash.slice(1) || '/');
      setMenuOpen(false);
    };
    window.addEventListener('hashchange', changed);
    return () => window.removeEventListener('hashchange', changed);
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
    main.current?.focus({ preventScroll: true });
    document.title = `${current} · iPPM Knowledge & Training Center`;
  }, [path, current]);
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(''), 3500);
    return () => window.clearTimeout(timer);
  }, [notice]);
  function update(next: Progress, message: string) {
    setProgress(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setStorageError('');
    } catch {
      setStorageError(
        'Speicherung nicht möglich. Ihre Änderungen bleiben nur in dieser Sitzung erhalten. Exportieren Sie eine Sicherung unter „Mein Lernbereich“.',
      );
    }
    setNotice(message);
  }
  function toggleSave(id: string) {
    const saved = progress.bookmarks.includes(id);
    update(
      {
        ...progress,
        bookmarks: saved ? progress.bookmarks.filter((x) => x !== id) : [...progress.bookmarks, id],
      },
      saved ? 'Beitrag aus der Merkliste entfernt.' : 'Beitrag zur Merkliste hinzugefügt.',
    );
  }
  function toggleRead(id: string) {
    const read = progress.read.includes(id);
    update(
      {
        ...progress,
        read: read ? progress.read.filter((x) => x !== id) : [...progress.read, id],
        passed: read
          ? progress.passed.filter(
              (pathId) => !learningPaths.find((p) => p.id === pathId)?.lessons.includes(id),
            )
          : progress.passed,
      },
      read
        ? 'Lesemarkierung entfernt. Betroffene Lernpfade sind wieder offen.'
        : 'Als gelesen markiert. Ihr Lernfortschritt wurde aktualisiert.',
    );
  }
  function importProgress(data: Progress) {
    const read = [...new Set([...progress.read, ...data.read])].filter((id) =>
      articles.some((a) => a.id === id),
    );
    update(
      {
        ...emptyProgress,
        read,
        bookmarks: [...new Set([...progress.bookmarks, ...data.bookmarks])].filter((id) =>
          articles.some((a) => a.id === id),
        ),
        passed: [...new Set([...progress.passed, ...data.passed])].filter((id) =>
          learningPaths.some(
            (p) => p.id === id && p.lessons.every((lesson) => read.includes(lesson)),
          ),
        ),
      },
      'Sicherung importiert.',
    );
  }
  let page;
  if (path === '/') page = <Home progress={progress} toggleSave={toggleSave} />;
  else if (path === '/wissen')
    page = <Knowledge params={params} progress={progress} toggleSave={toggleSave} />;
  else if (path.startsWith('/artikel/'))
    page = (
      <ArticlePage
        key={path}
        id={path.split('/')[2]}
        pathId={params.get('pfad')}
        progress={progress}
        toggleSave={toggleSave}
        toggleRead={toggleRead}
      />
    );
  else if (path === '/lernpfade') page = <Learning progress={progress} />;
  else if (path.startsWith('/lernpfade/'))
    page = (
      <LearningDetail
        key={path}
        id={path.split('/')[2]}
        progress={progress}
        pass={(id) =>
          update(
            { ...progress, passed: [...new Set([...progress.passed, id])] },
            'Lernpfad erfolgreich abgeschlossen.',
          )
        }
      />
    );
  else if (path === '/prozesse') page = <Processes />;
  else if (path === '/mein-bereich')
    page = <Personal progress={progress} toggleSave={toggleSave} importProgress={importProgress} />;
  else if (path === '/hilfe') page = <Help />;
  else
    page = (
      <div className="empty">
        <h1>Diese Seite gibt es nicht</h1>
        <p>Über die Übersicht finden Sie Wissen, Lernpfade und Prozesse.</p>
        <a className="button primary" href="#/">
          Zur Übersicht
          <ArrowRight size={16} />
        </a>
      </div>
    );
  return (
    <>
      <a
        className="skip-link"
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          main.current?.focus();
        }}
      >
        Zum Inhalt springen
      </a>
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <a href="#/" className="brand" aria-label="iPPM Startseite">
          <span className="brand-name">
            iPPM
            <span className="brand-marker" />
          </span>
          <span>
            Knowledge &<br />
            Training Center
          </span>
        </a>
        <div className="sidebar-label eyebrow">Arbeitsbereich</div>
        <nav aria-label="Hauptnavigation">
          {navigation.map(({ path: href, label, icon: Icon }) => (
            <a
              href={`#${href}`}
              key={href}
              className={active === href ? 'active' : ''}
              aria-current={active === href ? 'page' : undefined}
            >
              <Icon size={20} aria-hidden="true" />
              <span>{label}</span>
              {href === '/mein-bereich' && progress.bookmarks.length > 0 && (
                <span className="nav-count">{progress.bookmarks.length}</span>
              )}
            </a>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-guide">
            <span className="eyebrow">Wissen wird Können.</span>
            <p>
              Ein guter nächster Schritt
              <br />
              beginnt mit einer Antwort.
            </p>
            <a href="#/lernpfade">
              Lernen starten
              <ArrowRight size={16} />
            </a>
          </div>
          <a
            className={`help-link ${path === '/hilfe' ? 'active' : ''}`}
            href="#/hilfe"
            aria-current={path === '/hilfe' ? 'page' : undefined}
          >
            <HelpCircle size={20} />
            Hilfe & FAQ
          </a>
          <div className="organization">
            TKMS ATLAS
            <span>
              Integriertes Projekt- &<br />
              Projektportfoliomanagement
            </span>
          </div>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <button
            className="icon-button mobile-menu"
            aria-label={menuOpen ? 'Menü schließen' : 'Menü öffnen'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
          <div className="breadcrumb">
            <span>Knowledge Center</span>
            <ChevronRight size={14} aria-hidden="true" />
            <strong>{current}</strong>
          </div>
          <div className="local-status">
            <Monitor size={16} aria-hidden="true" />
            <span>Lokal verfügbar</span>
            <span className="prototype-label">v0.4</span>
          </div>
        </header>
        <main id="main" ref={main} tabIndex={-1}>
          {storageError && (
            <div className="storage-error" role="alert">
              {storageError}
            </div>
          )}
          {page}
        </main>
        <footer>
          <span>iPPM Knowledge & Training Center</span>
          <span>Demo-Inhalte und Quellenentwürfe · Keine freigegebenen Arbeitsanweisungen</span>
          <a href="#/hilfe">
            Über diese Plattform
            <ArrowRight size={14} />
          </a>
        </footer>
      </div>
      <div className={`toast ${notice ? 'visible' : ''}`} role="status" aria-live="polite">
        {notice}
      </div>
    </>
  );
}
