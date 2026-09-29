import { ArrowLeft, ArrowRight, Bookmark, Check, Clock3, RotateCcw } from 'lucide-react';
import { Fragment } from 'react';
import ContentReadiness from '../components/ContentReadiness';
import { InventorySearchLink } from '../components/Inventory';
import { roles, topics, visibleArticles } from '../data/content';
import type { Role } from '../data/types';
import { searchArticles } from '../lib/search';
import type { Progress } from '../lib/storage';
import { ArticleCard, PageTitle, SearchForm } from '../components/ui';
import { roleLabel } from '../data/catalog';
import OwnerChangeArticle, { ownerJumps } from '../components/OwnerChangeArticle';
import MilestonePlanningArticle, { milestoneJumps } from '../components/MilestonePlanningArticle';
import {
  KnowledgeEvidence,
  KnowledgeIssues,
  KnowledgePrerequisites,
  KnowledgeProcedures,
  KnowledgeResults,
} from '../components/KnowledgeContext';

const coreJumps = [
  ['kurzantwort', 'Kurzantwort'],
  ['voraussetzungen', 'Voraussetzungen'],
  ['einschraenkungen', 'Kritische Einschränkungen'],
  ['bedienweg', 'Bedienweg'],
  ['ergebnispruefung', 'Ergebnisprüfung'],
  ['nachweise', 'Nachweise'],
] as const;

const statusJumps = [
  ['kurzantwort', 'Kurzantwort'],
  ['voraussetzungen', 'Voraussetzungen'],
  ['bedienweg', 'Bedienweg'],
  ['ergebnispruefung', 'Ergebnisprüfung'],
  ['einschraenkungen', 'Kritische Einschränkungen'],
  ['nachweise', 'Nachweise'],
] as const;

const releaseJumps = [
  ['kurzantwort', 'Einordnung'],
  ['voraussetzungen', 'Geltungsbereich'],
  ['bedienweg', 'Geplanter Umfang'],
  ['ergebnispruefung', 'Offene Nachweise'],
  ['nachweise', 'Quellen und Planungsstand'],
] as const;

function ReleaseScopeArticle({ article }: { article: (typeof visibleArticles)[number] }) {
  return (
    <>
      <section id="kurzantwort" className="takeaway" tabIndex={-1}>
        <h2>Einordnung</h2>
        <p>{article.takeaway}</p>
      </section>
      <section id="voraussetzungen" tabIndex={-1}>
        <h2>Geltungsbereich</h2>
        <section id="abschnitt-0" tabIndex={-1}>
          <h3>{article.sections[0].title}</h3>
          <p>{article.sections[0].body}</p>
        </section>
      </section>
      <section id="bedienweg" tabIndex={-1}>
        <h2>Geplanter Umfang</h2>
        {article.sections.slice(1, -1).map((section, index) => (
          <section id={`abschnitt-${index + 1}`} key={section.title} tabIndex={-1}>
            <h3>{section.title}</h3>
            <p>{section.body}</p>
            {section.steps && (
              <ul>
                {section.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </section>
      <section id="ergebnispruefung" tabIndex={-1}>
        <h2>Offene Nachweise</h2>
        <section id={`abschnitt-${article.sections.length - 1}`} tabIndex={-1}>
          <h3>{article.sections.at(-1)!.title}</h3>
          <p>{article.sections.at(-1)!.body}</p>
        </section>
      </section>
      <KnowledgeEvidence article={article} />
    </>
  );
}

function jumpToSection(id: string) {
  const section = document.getElementById(id);
  // Preserve deep section jumps when supplemental reading is collapsed.
  for (let parent = section?.parentElement; parent; parent = parent.parentElement) {
    if (parent instanceof HTMLDetailsElement) parent.open = true;
  }
  const content = section?.querySelector<HTMLDetailsElement>(
    ':scope > details[data-section-content]',
  );
  if (content) content.open = true;
  section?.focus({ preventScroll: true });
  section?.scrollIntoView({ block: 'start' });
}

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
    // A preceding search/filter can update the hash before React receives hashchange.
    const next = new URLSearchParams(window.location.hash.split('?')[1] || '');
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
      <InventorySearchLink query={query} />
      <div className="filters">
        <label>
          Thema
          <select value={topic} onChange={(e) => filter('thema', e.target.value)}>
            {[
              'Alle Themen',
              ...topics.filter((t) => visibleArticles.some((a) => a.topic === t)),
            ].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label>
          Ihre Rolle
          <select value={role} onChange={(e) => filter('rolle', e.target.value)}>
            {roles
              .filter(
                (r) => r === 'Alle Rollen' || visibleArticles.some((a) => a.roles.includes(r)),
              )
              .map((r) => (
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
        <span>Quellenbasierte Entwürfe · Deutsch</span>
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
  progress,
  toggleSave,
  toggleRead,
}: {
  id: string;
  progress: Progress;
  toggleSave: (id: string) => void;
  toggleRead: (id: string) => void;
}) {
  const article = visibleArticles.find((a) => a.id === id);
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
  const ownerFirst = id === 'guide-project-permissions';
  const milestoneFirst = id === 'guide-deliverables-milestones';
  const statusPathFirst = id === 'guide-status-orientation';
  const releaseScope = id === 'ippm-release-2-scope';
  const readingFirst = ownerFirst || milestoneFirst;
  const articleJumps = ownerFirst ? ownerJumps : milestoneJumps;
  const AsideContainer = readingFirst ? 'details' : Fragment;
  const relatedGuide = visibleArticles.find(
    (candidate) =>
      article.related.includes(candidate.id) &&
      candidate.knowledge?.functionIds.some((functionId) =>
        article.knowledge?.functionIds.includes(functionId),
      ) &&
      candidate.kind === 'Anleitung' &&
      candidate.knowledge?.procedures.length,
  );
  return (
    <>
      <a href="#/wissen" className="back-link">
        <ArrowLeft size={16} />
        Zur Wissensbasis
      </a>
      <div
        className={`article-layout${readingFirst ? ' reading-first' : ''}${ownerFirst ? ' owner-first' : ''}${milestoneFirst ? ' milestone-first' : ''}`}
      >
        <article className="article-content">
          <span className="eyebrow">
            {article.topic} / {article.kind}
          </span>
          <h1>{article.title}</h1>
          <ContentReadiness article={article} />
          <p className="article-lead">
            {ownerFirst
              ? article.knowledge!.procedures.find((p) => p.id === 'procedure-owner-change')!
                  .trigger
              : article.summary}
          </p>
          {readingFirst ? (
            <p className="owner-validity">R1 / SB1 · begrenzter Quellenbezug</p>
          ) : (
            <div className="article-meta">
              <span>
                <Clock3 size={16} />
                {article.minutes} Min. Lesezeit
              </span>
              <span>
                Stand: {new Date(`${article.updated}T12:00:00`).toLocaleDateString('de-DE')}
              </span>
            </div>
          )}
          <div className="demo-note">
            {article.status === 'source-draft'
              ? 'Quellenbasierter Entwurf · Fachlich nicht freigegeben'
              : 'Fachlich geprüfter Inhalt'}
          </div>
          {article.knowledge ? (
            <>
              <nav className="article-jumps" aria-label="Direkt zu den Abschnitten">
                {!readingFirst && <strong>Direkt zu</strong>}
                <div>
                  {(readingFirst
                    ? articleJumps.slice(0, 1)
                    : releaseScope
                      ? releaseJumps
                      : statusPathFirst
                        ? statusJumps
                        : coreJumps
                  ).map(([target, label]) => (
                    <button key={target} type="button" onClick={() => jumpToSection(target)}>
                      {label}
                    </button>
                  ))}
                </div>
                {readingFirst && (
                  <details className="knowledge-details owner-more-jumps">
                    <summary>Weitere Abschnitte</summary>
                    <div>
                      {articleJumps.slice(1).map(([target, label]) => (
                        <button key={target} type="button" onClick={() => jumpToSection(target)}>
                          {label}
                        </button>
                      ))}
                    </div>
                  </details>
                )}
              </nav>
              {ownerFirst ? (
                <OwnerChangeArticle article={article} />
              ) : milestoneFirst ? (
                <MilestonePlanningArticle article={article} />
              ) : releaseScope ? (
                <ReleaseScopeArticle article={article} />
              ) : (
                <>
                  <section id="kurzantwort" className="takeaway" tabIndex={-1}>
                    <h2>Kurzantwort</h2>
                    <p>{article.takeaway}</p>
                  </section>
                  <KnowledgePrerequisites article={article} guide={relatedGuide} />
                  {!statusPathFirst && <KnowledgeIssues article={article} />}
                  <section id="bedienweg" tabIndex={-1}>
                    <h2>Bedienweg</h2>
                    <KnowledgeProcedures article={article} guide={relatedGuide} />
                    {article.sections.map((section, i) => (
                      <section id={`abschnitt-${i}`} key={section.title} tabIndex={-1}>
                        <h3>{section.title}</h3>
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
                  </section>
                  <KnowledgeResults article={article} guide={relatedGuide} />
                  {statusPathFirst && <KnowledgeIssues article={article} />}
                  <KnowledgeEvidence article={article} />
                </>
              )}
            </>
          ) : (
            <>
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
              <div className="takeaway">
                <span className="eyebrow">Das nehmen Sie mit</span>
                <p>{article.takeaway}</p>
              </div>
            </>
          )}
          <div className="reading-actions">
            <button
              className={`button ${read ? 'secondary' : 'primary'}`}
              aria-pressed={read}
              onClick={() => toggleRead(id)}
            >
              <Check size={18} />
              {read ? 'Gelesen · Markierung entfernen' : 'Als gelesen markieren'}
            </button>
          </div>
          <p className="small muted">
            Diese Lesemarkierung ist kein Übungs- oder Schulungsnachweis.
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
          <AsideContainer {...(readingFirst ? { className: 'knowledge-details owner-index' } : {})}>
            {readingFirst && (
              <>
                <summary>Inhalt und Artikelangaben</summary>
                <p>{article.summary}</p>
                <p className="small">
                  {article.minutes} Min. Lesezeit · Stand:{' '}
                  {new Date(`${article.updated}T12:00:00`).toLocaleDateString('de-DE')}
                </p>
              </>
            )}
            <div className="aside-block">
              <span className="eyebrow">In diesem Beitrag</span>
              <nav aria-label="Inhaltsverzeichnis">
                {article.knowledge &&
                  (readingFirst
                    ? [
                        ...articleJumps,
                        [
                          'voraussetzungen',
                          ownerFirst ? 'Voraussetzungen und vier Leserechte' : 'Voraussetzungen',
                        ],
                        ['bedienweg', ownerFirst ? 'Owner-Wechsel: Ablauf' : 'Ablauf'],
                        [
                          'ergebnispruefung',
                          ownerFirst ? 'Owner-Wechsel: Ergebnisprüfung' : 'Ergebnisprüfung',
                        ],
                        ...article.sections.map((section, i) => [`abschnitt-${i}`, section.title]),
                        ['trainerhinweise', 'Für Trainer'],
                        ['fachlicher-kontext', 'Aufgabe und Geltungsbereich'],
                        ['quellen', 'Quellen und Fundstellen'],
                      ].filter(([target], i, all) => all.findIndex(([id]) => id === target) === i)
                    : releaseScope
                      ? [
                          ...releaseJumps,
                          ...article.sections.map((section, i) => [
                            `abschnitt-${i}`,
                            section.title,
                          ]),
                          ['fachlicher-kontext', 'Aufgabe und Geltungsbereich'],
                          ['trainerhinweise', 'Für Trainer'],
                          ['quellen', 'Quellen und Fundstellen'],
                        ]
                      : statusPathFirst
                        ? [
                            ['kurzantwort', 'Kurzantwort'],
                            ['voraussetzungen', 'Voraussetzungen'],
                            ['bedienweg', 'Bedienweg'],
                            ...article.knowledge.procedures.map((p) => [p.id, p.title]),
                            ...article.sections.map((section, i) => [
                              `abschnitt-${i}`,
                              `${String(i + 1).padStart(2, '0')} ${section.title}`,
                            ]),
                            ['ergebnispruefung', 'Ergebnisprüfung'],
                            ['einschraenkungen', 'Kritische Einschränkungen'],
                            ['nachweise', 'Nachweise und Geltungsbereich'],
                            ['fachlicher-kontext', 'Aufgabe und Geltungsbereich'],
                            ['trainerhinweise', 'Für Trainer'],
                            ['quellen', 'Quellen und Fundstellen'],
                          ]
                        : [
                            ['kurzantwort', 'Kurzantwort'],
                            ['voraussetzungen', 'Voraussetzungen'],
                            ['einschraenkungen', 'Einschränkungen'],
                            ['bedienweg', 'Bedienweg'],
                            ...article.knowledge.procedures.map((p) => [p.id, p.title]),
                            ...article.sections.map((section, i) => [
                              `abschnitt-${i}`,
                              `${String(i + 1).padStart(2, '0')} ${section.title}`,
                            ]),
                            ['ergebnispruefung', 'Ergebnisprüfung'],
                            ['nachweise', 'Nachweise und Geltungsbereich'],
                            ['fachlicher-kontext', 'Aufgabe und Geltungsbereich'],
                            ['trainerhinweise', 'Für Trainer'],
                            ['quellen', 'Quellen und Fundstellen'],
                          ]
                  ).map(([target, label]) => (
                    <button key={target} onClick={() => jumpToSection(target)}>
                      {label}
                    </button>
                  ))}
                {!article.knowledge &&
                  article.sections.map((s, i) => (
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
                {article.status === 'source-draft'
                  ? 'Quellenbasierter Center-Entwurf'
                  : 'Fachlich geprüfter Center-Inhalt'}
                <br />
                <span className="muted">
                  {article.status === 'source-draft'
                    ? `Revision ${article.revisions.at(-1)?.number} · Prüfbeleg für eine fachliche Freigabe liegt nicht vor`
                    : `Revision ${article.revisions.at(-1)?.number} · Fachlicher Prüfbeleg: ${article.reviews.at(-1)?.record}`}
                </span>
              </p>
            </div>
            <div className="aside-block">
              <span className="eyebrow">Passend dazu</span>
              {article.related
                .filter((relatedId) => visibleArticles.some((a) => a.id === relatedId))
                .map((relatedId) => {
                  const related = visibleArticles.find((a) => a.id === relatedId)!;
                  return (
                    <a className="related-link" href={`#/artikel/${relatedId}`} key={relatedId}>
                      {related.title}
                      <ArrowRight size={16} />
                    </a>
                  );
                })}
            </div>
          </AsideContainer>
        </aside>
      </div>
    </>
  );
}
