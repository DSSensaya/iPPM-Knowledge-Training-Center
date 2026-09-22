import { ArrowLeft, ArrowRight, Bookmark, Check, Clock3, RotateCcw } from 'lucide-react';
import { articles, roles, topics } from '../data/content';
import type { Role } from '../data/types';
import { searchArticles } from '../lib/search';
import type { Progress } from '../lib/storage';
import { ArticleCard, PageTitle, SearchForm } from '../components/ui';
import { roleLabel } from '../data/catalog';
import {
  KnowledgeEvidence,
  KnowledgeIssues,
  KnowledgeOverview,
  KnowledgeProcedures,
} from '../components/KnowledgeContext';

export function Knowledge({
  params,
  progress,
  toggleSave,
}: {
  params: URLSearchParams;
  progress: Progress;
  toggleSave: (id: string) => void;
}) {
  const query = params.get('q') || '';
  const topic = params.get('thema') || 'Alle Themen';
  const role = (params.get('rolle') || 'Alle Rollen') as Role;
  const kind = params.get('format') || 'Alle Formate';
  const results = searchArticles(query, topic, role, kind);
  function filter(key: string, value: string) {
    const next = new URLSearchParams(params);
    next.set(key, value);
    window.location.hash = `/wissen?${next.toString()}`;
  }
  return (
    <>
      <PageTitle
        eyebrow="Nachschlagen & anwenden"
        title="Wissensbasis"
        description="Die passende Antwort für Ihre nächste Aufgabe. Durchsuchen Sie Anleitungen, Grundlagen und Checklisten."
      />
      <SearchForm key={query} initial={query} params={params} />
      <div className="filters">
        <label>
          Thema
          <select value={topic} onChange={(e) => filter('thema', e.target.value)}>
            {['Alle Themen', ...topics].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label>
          Ihre Rolle
          <select value={role} onChange={(e) => filter('rolle', e.target.value)}>
            {roles.map((r) => (
              <option key={r} value={r}>
                {roleLabel(r)}
              </option>
            ))}
          </select>
        </label>
        <label>
          Format
          <select value={kind} onChange={(e) => filter('format', e.target.value)}>
            {['Alle Formate', 'Anleitung', 'Grundlagen', 'Checkliste', 'FAQ'].map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>
        </label>
        <a className="button secondary" href="#/wissen">
          <RotateCcw size={16} aria-hidden="true" />
          Zurücksetzen
        </a>
      </div>
      <div className="result-heading" role="status">
        <strong>
          {results.length} {results.length === 1 ? 'Beitrag' : 'Beiträge'}
          {query && ` für „${query}“`}
        </strong>
        <span>Demo-Inhalte und quellenbasierte Entwürfe · Deutsch</span>
      </div>
      {results.length ? (
        <div className="cards three">
          {results.map((a) => (
            <ArticleCard
              key={a.id}
              article={a}
              saved={progress.bookmarks.includes(a.id)}
              onSave={() => toggleSave(a.id)}
            />
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2>Keine passenden Beiträge gefunden</h2>
          <p>Versuchen Sie einen allgemeineren Suchbegriff oder entfernen Sie einzelne Filter.</p>
          <a className="button primary" href="#/wissen">
            Alle Beiträge anzeigen
            <ArrowRight size={16} />
          </a>
        </div>
      )}
    </>
  );
}

export function ArticlePage({
  id,
  pathId,
  progress,
  toggleSave,
  toggleRead,
}: {
  id: string;
  pathId: string | null;
  progress: Progress;
  toggleSave: (id: string) => void;
  toggleRead: (id: string) => void;
}) {
  const article = articles.find((a) => a.id === id);
  if (!article)
    return (
      <div className="empty">
        <h1>Beitrag nicht gefunden</h1>
        <p>Dieser Beitrag ist nicht verfügbar oder der Link ist unvollständig.</p>
        <a href="#/wissen" className="button primary">
          Wissensbasis öffnen
        </a>
      </div>
    );
  const saved = progress.bookmarks.includes(id),
    read = progress.read.includes(id);
  return (
    <>
      <a href={pathId ? `#/lernpfade/${pathId}` : '#/wissen'} className="back-link">
        <ArrowLeft size={16} />
        {pathId ? 'Zurück zum Lernpfad' : 'Zur Wissensbasis'}
      </a>
      <div className="article-layout">
        <article className="article-content">
          <span className="eyebrow">
            {article.topic} / {article.kind}
          </span>
          <h1>{article.title}</h1>
          <p className="article-lead">{article.summary}</p>
          <div className="article-meta">
            <span>
              <Clock3 size={16} />
              {article.minutes} Min. Lesezeit
            </span>
            <span>
              Stand: {new Date(`${article.updated}T12:00:00`).toLocaleDateString('de-DE')}
            </span>
          </div>
          <div className="demo-note">
            {article.status === 'demo'
              ? 'Demonstrationsinhalt · Fachlich nicht freigegeben'
              : article.status === 'source-draft'
                ? 'Quellenbasierter Entwurf · Fachlich nicht freigegeben'
                : 'Fachlich geprüfter Inhalt'}
          </div>
          {article.knowledge && (
            <>
              <KnowledgeOverview article={article} />
              <KnowledgeIssues article={article} />
            </>
          )}
          {article.sections.map((section, i) => (
            <section id={`abschnitt-${i}`} key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
              {section.steps && (
                <ol className="steps">
                  {section.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              )}
            </section>
          ))}
          {article.knowledge && (
            <>
              <KnowledgeProcedures article={article} />
              <KnowledgeEvidence article={article} />
            </>
          )}
          <div className="takeaway">
            <span className="eyebrow">Das nehmen Sie mit</span>
            <p>{article.takeaway}</p>
          </div>
          <div className="reading-actions">
            <button
              className={`button ${read ? 'secondary' : 'primary'}`}
              aria-pressed={read}
              onClick={() => toggleRead(id)}
            >
              <Check size={18} />
              {read ? 'Gelesen · Markierung entfernen' : 'Als gelesen markieren'}
            </button>
            {pathId && (
              <a className="text-link" href={`#/lernpfade/${pathId}`}>
                Im Lernpfad weiter
                <ArrowRight size={17} />
              </a>
            )}
          </div>
          <p className="small muted">
            {article.knowledge
              ? 'Diese Lesemarkierung ist kein Übungs- oder Schulungsnachweis und verändert die bestehenden Demo-Lernpfade nicht.'
              : 'Die Markierung wird lokal gespeichert und für passende Lernpfade übernommen.'}
          </p>
        </article>
        <aside className="article-aside">
          <button
            className="button secondary save-button"
            aria-pressed={saved}
            onClick={() => toggleSave(id)}
          >
            <Bookmark size={18} fill={saved ? 'currentColor' : 'none'} />
            {saved ? 'Aus Merkliste entfernen' : 'Beitrag merken'}
          </button>
          <div className="aside-block">
            <span className="eyebrow">In diesem Beitrag</span>
            <nav aria-label="Inhaltsverzeichnis">
              {article.knowledge &&
                [
                  ['fachlicher-kontext', 'Aufgabe und Geltungsbereich'],
                  ['einschraenkungen', 'Einschränkungen'],
                  ...article.knowledge.procedures.map((p) => [p.id, p.title]),
                  ['nachweise', 'Schulungsbezug und Bewertungen'],
                  ['trainerhinweise', 'Für Trainer'],
                  ['quellen', 'Quellen und Fundstellen'],
                ].map(([target, label]) => (
                  <button
                    key={target}
                    onClick={() => {
                      const section = document.getElementById(target);
                      section?.focus({ preventScroll: true });
                      section?.scrollIntoView({ block: 'start' });
                    }}
                  >
                    {label}
                  </button>
                ))}
              {article.sections.map((s, i) => (
                <button
                  key={s.title}
                  onClick={() =>
                    document
                      .getElementById(`abschnitt-${i}`)
                      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                >
                  {String(i + 1).padStart(2, '0')}
                  <span>{s.title}</span>
                </button>
              ))}
            </nav>
          </div>
          <div className="aside-block">
            <span className="eyebrow">Für wen?</span>
            <p>{article.roles.map(roleLabel).join(', ')}</p>
            <span className="eyebrow">Redaktion</span>
            <p>
              {article.status === 'demo'
                ? 'iPPM Demo-Redaktion'
                : article.status === 'source-draft'
                  ? 'Quellenbasierter Center-Entwurf'
                  : 'Fachlich geprüfter Center-Inhalt'}
              <br />
              <span className="muted">
                {article.status === 'demo'
                  ? 'Beispielwissen für dieses MVP'
                  : article.status === 'source-draft'
                    ? `Revision ${article.revisions.at(-1)?.number} · Prüfbeleg für eine fachliche Freigabe liegt nicht vor`
                    : `Revision ${article.revisions.at(-1)?.number} · Fachlicher Prüfbeleg: ${article.reviews.at(-1)?.record}`}
              </span>
            </p>
          </div>
          <div className="aside-block">
            <span className="eyebrow">Passend dazu</span>
            {article.related.map((relatedId) => {
              const related = articles.find((a) => a.id === relatedId)!;
              return (
                <a className="related-link" href={`#/artikel/${relatedId}`} key={relatedId}>
                  {related.title}
                  <ArrowRight size={16} />
                </a>
              );
            })}
          </div>
        </aside>
      </div>
    </>
  );
}
