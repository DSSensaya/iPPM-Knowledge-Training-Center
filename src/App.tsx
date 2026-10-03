import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  HelpCircle,
  ListTodo,
  Menu,
  Monitor,
  Network,
  UserRound,
  X,
} from 'lucide-react';
import { content } from './content';
import { loadProgress, mergeProgress, STORAGE_KEY } from './lib/storage';
import type { Progress } from './lib/storage';
import Tasks, { WorkPage, ProcedurePage } from './pages/Tasks';
import Roles from './pages/Roles';
import Releases, { TrainingBlockPage } from './pages/Releases';
import Editor from './editor/Editor';
import EditorialInventory from './editor/Inventory';
import { ArticlePage, Knowledge } from './pages/Knowledge';
import Processes from './pages/Processes';
import Personal from './pages/Personal';
import Help from './pages/Help';

const navigation = [
  { path: '/aufgaben', label: 'Aufgaben', icon: ListTodo },
  { path: '/prozesse', label: 'Prozesse', icon: Network },
  { path: '/rollen', label: 'Rollen', icon: UserRound },
  { path: '/wissen', label: 'Wissen', icon: BookOpen },
];

export default function App() {
  const [route, setRoute] = useState(window.location.hash.slice(1) || '/');
  const [initial] = useState(loadProgress);
  const [progress, setProgress] = useState(initial.progress);
  const [storageError, setStorageError] = useState(initial.error);
  const [notice, setNotice] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [, setContentVersion] = useState(0);
  const main = useRef<HTMLElement>(null);
  const previousPath = useRef(window.location.hash.slice(1).split('?')[0] || '/');
  const [path, search = ''] = route.split('?');
  const params = new URLSearchParams(search);
  const active =
    path === '/' || path.startsWith('/aufgabe') || path.startsWith('/schritt')
      ? '/aufgaben'
      : path.startsWith('/artikel') || path.startsWith('/thema') || path.startsWith('/bedienweg')
        ? '/wissen'
        : path.startsWith('/rollen')
          ? '/rollen'
          : path.startsWith('/prozesse')
            ? '/prozesse'
            : path;
  const current =
    navigation.find((n) => n.path === active)?.label ||
    (path === '/hilfe'
      ? 'Hilfe & FAQ'
      : path === '/mein-bereich'
        ? 'Mein Lernbereich'
        : path.startsWith('/releases') || path.startsWith('/schulungen')
          ? 'Releases & Schulungen'
          : 'Redaktion');
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
    if (previousPath.current !== path) main.current?.focus({ preventScroll: true });
    previousPath.current = path;
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
      },
      read
        ? 'Lesemarkierung entfernt.'
        : 'Als gelesen markiert. Ihr Lernfortschritt wurde aktualisiert.',
    );
  }
  function importProgress(data: Progress) {
    update(mergeProgress(progress, data), 'Sicherung importiert.');
  }

  let page;
  if (path === '/' || path === '/aufgaben') page = <Tasks />;
  else if (path.startsWith('/schritt/')) page = <WorkPage id={path.split('/')[2]} kind="step" />;
  else if (path.startsWith('/aufgabe/')) page = <WorkPage id={path.split('/')[2]} kind="task" />;
  else if (path.startsWith('/thema/')) page = <WorkPage id={path.split('/')[2]} kind="topic" />;
  else if (path.startsWith('/bedienweg/')) page = <ProcedurePage id={path.split('/')[2]} />;
  else if (path.startsWith('/rollen')) page = <Roles id={path.split('/')[2]} />;
  else if (path.startsWith('/releases')) page = <Releases id={path.split('/')[2]} />;
  else if (path.startsWith('/schulungen/')) page = <TrainingBlockPage id={path.split('/')[2]} />;
  else if (__LOCAL_EDITOR__ && path === '/redaktion')
    page = <Editor onSaved={() => setContentVersion((v) => v + 1)} />;
  else if (__LOCAL_EDITOR__ && path === '/redaktion/inventory') page = <EditorialInventory />;
  else if (path === '/wissen')
    page = <Knowledge params={params} progress={progress} toggleSave={toggleSave} />;
  else if (path.startsWith('/artikel/'))
    page = (
      <ArticlePage
        key={path}
        id={path.split('/')[2]}
        progress={progress}
        toggleSave={toggleSave}
        toggleRead={toggleRead}
      />
    );
  else if (path.startsWith('/prozesse')) page = <Processes id={path.split('/')[2]} />;
  else if (path === '/mein-bereich')
    page = <Personal progress={progress} toggleSave={toggleSave} importProgress={importProgress} />;
  else if (path === '/hilfe') page = <Help />;
  else
    page = (
      <div className="empty">
        <h1>Diese Seite gibt es nicht</h1>
        <p>Über die Übersicht finden Sie Wissen und Prozesse.</p>
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
              {href === '/mein-bereich' &&
                progress.bookmarks.some((id) => content.articles.some((a) => a.id === id)) && (
                  <span className="nav-count">
                    {
                      progress.bookmarks.filter((id) => content.articles.some((a) => a.id === id))
                        .length
                    }
                  </span>
                )}
            </a>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <a className="help-link" href="#/releases">
            Releases & Schulungen
          </a>
          <a className="help-link" href="#/mein-bereich">
            Mein Lernbereich
          </a>
          {__LOCAL_EDITOR__ && (
            <>
              <a className="help-link" href="#/redaktion">
                Inhalte pflegen
              </a>
              <a className="help-link" href="#/redaktion/inventory">
                Redaktion: Bestand
              </a>
            </>
          )}

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
            <span className="prototype-label">v0.8.0</span>
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
          <span>Geltungsbereich und offene Punkte vor Anwendung beachten</span>
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
