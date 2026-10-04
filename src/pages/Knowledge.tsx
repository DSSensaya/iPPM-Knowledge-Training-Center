import { content } from '../content';
import {
  getArticle,
  getArticleContext,
  getArticleOpenPoints,
  getProcedure,
  roleLabel,
  statusLabels,
} from '../lib/queries';
import { searchContent } from '../lib/search';
import { ArticleCard, PageTitle, SearchForm } from '../components/ui';
import { OpenPoints, ProcedureView, Sections, Sources } from '../components/Content';
import type { Progress } from '../types/progress';
export function Knowledge({
  params,
  progress,
  toggleSave,
}: {
  params: URLSearchParams;
  progress: Progress;
  toggleSave: (id: string) => void;
}) {
  const q = params.get('q') ?? '',
    roleId =
      params.get('role') ??
      (params.get('rolle') === 'Alle Rollen' ? '' : params.get('rolle')) ??
      '',
    systemId = params.get('system') ?? '';
  const results = searchContent(q, { roleId, systemId });
  const topic = params.get('thema') ?? 'Alle Themen',
    kind = params.get('format') ?? 'Alle Formate';
  const articles = results.filter((e) => {
      const article = getArticle(e.id);
      return (
        e.kind === 'article' &&
        (topic === 'Alle Themen' || article?.topic === topic) &&
        (kind === 'Alle Formate' || article?.kind === kind)
      );
    }),
    others = q ? results.filter((e) => e.kind !== 'article') : [];
  function filter(key: string, value: string) {
    const next = new URLSearchParams(window.location.hash.split('?')[1] || '');
    if (key === 'role') next.delete('rolle');
    if (value) next.set(key, value);
    else next.delete(key);
    window.location.hash = '/wissen?' + next;
  }
  return (
    <>
      <PageTitle
        eyebrow="Wissen finden"
        title="Wissen"
        description="Anleitungen, Orientierung und Referenzen aus demselben fachlichen Bestand."
      />
      <SearchForm initial={q} params={params} />
      <div className="filters">
        <label>
          Rolle
          <select value={roleId} onChange={(e) => filter('role', e.target.value)}>
            <option value="">Alle Rollen</option>
            {content.roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          System
          <select value={systemId} onChange={(e) => filter('system', e.target.value)}>
            <option value="">Alle Systeme</option>
            {content.systems.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </label>
        {(params.has('thema') || params.has('format')) && (
          <>
            <label>
              Thema
              <select value={topic} onChange={(e) => filter('thema', e.target.value)}>
                {[
                  'Alle Themen',
                  ...new Set(content.articles.map((a) => a.topic).filter((t): t is string => !!t)),
                ].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
            <label>
              Format
              <select value={kind} onChange={(e) => filter('format', e.target.value)}>
                {[
                  'Alle Formate',
                  ...new Set(content.articles.map((a) => a.kind).filter((t): t is string => !!t)),
                ].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
            <a href="#/wissen" className="button secondary">
              Filter zurücksetzen
            </a>
          </>
        )}
      </div>
      <h2>{articles.length} Beiträge</h2>
      <div className="cards three">
        {articles.map((e) => {
          const a = getArticle(e.id)!;
          return (
            <ArticleCard
              key={a.id}
              article={a}
              saved={progress.bookmarks.includes(a.id)}
              onSave={() => toggleSave(a.id)}
            />
          );
        })}
      </div>
      {!articles.length && !others.length && (
        <p role="status">Keine passenden Inhalte. Versuchen Sie einen anderen Suchbegriff.</p>
      )}
      {others.length > 0 && (
        <section>
          <h2>Passende Aufgaben, Prozesse und Themen</h2>
          <ul className="result-list">
            {others.map((e) => (
              <li key={e.id}>
                <h3>
                  <a href={e.href}>{e.title}</a>
                </h3>
                <p>{e.summary}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
export function ArticlePage({
  id,
  progress,
  toggleSave,
  toggleRead,
}: {
  id: string;
  progress: Progress;
  toggleSave: (id: string) => void;
  toggleRead: (id: string) => void;
}) {
  const article = getArticle(id);
  if (!article)
    return (
      <>
        <h1>Beitrag nicht verfügbar</h1>
        <p>
          Dieser Link verweist auf einen archivierten oder unbekannten Beitrag. Ihre lokalen
          Markierungen bleiben erhalten.
        </p>
        <a className="button primary" href="#/wissen">
          Wissen öffnen
        </a>
      </>
    );
  const context = getArticleContext(id);
  return (
    <>
      <a className="text-link" href="#/wissen">
        ← Wissen
      </a>
      <PageTitle
        eyebrow={article.topic ?? 'Wissen'}
        title={article.title}
        description={article.summary}
      />
      <p className="status">{statusLabels[article.status]}</p>
      <p className="small muted">
        Nutzbarkeit gilt für den beschriebenen Umfang. Eine Center-Freigabe ist keine System- oder
        Unternehmensfreigabe.
      </p>
      <p>{article.roleIds.map((id) => roleLabel(id)).join(' · ')}</p>
      <div className="article-actions">
        <button
          className="button secondary"
          aria-pressed={progress.bookmarks.includes(id)}
          onClick={() => toggleSave(id)}
        >
          {progress.bookmarks.includes(id) ? 'Aus Merkliste entfernen' : 'Beitrag merken'}
        </button>
        <button
          className="button secondary"
          aria-pressed={progress.read.includes(id)}
          onClick={() => toggleRead(id)}
        >
          {progress.read.includes(id) ? 'Lesemarkierung entfernen' : 'Als gelesen markieren'}
        </button>
        {__LOCAL_EDITOR__ && (
          <a className="button secondary" href="#/redaktion">
            Inhalt bearbeiten
          </a>
        )}
      </div>
      <OpenPoints points={getArticleOpenPoints(article)} />
      <Sections sections={article.content} />
      {article.procedureIds?.map((pid) => (
        <ProcedureView key={pid} procedure={getProcedure(pid)!} />
      ))}
      {context.steps.length > 0 && (
        <section>
          <h2>Im Prozess</h2>
          <ul>
            {context.steps.map((s) => (
              <li key={s.id}>
                <a href={'#/schritt/' + s.id}>
                  {s.number} {s.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
      {context.blocks.length > 0 && (
        <details>
          <summary>Schulungsbezug</summary>
          <ul>
            {context.blocks.map((b) => (
              <li key={b.id}>
                <a href={'#/schulungen/' + b.id}>
                  {b.code}: {b.title}
                </a>
              </li>
            ))}
          </ul>
          <p>
            Die Blockzuordnung ist am Prozessschritt oder an einer eigenständigen Aufgabe gepflegt.
          </p>
        </details>
      )}
      <Sources refs={article.sourceRefs} note={article.sourceNote} />
      {article.relatedArticleIds?.length ? (
        <section>
          <h2>Weiterlesen</h2>
          <ul>
            {article.relatedArticleIds.map((aid) => (
              <li key={aid}>
                <a href={'#/artikel/' + aid}>{getArticle(aid)!.title}</a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}
