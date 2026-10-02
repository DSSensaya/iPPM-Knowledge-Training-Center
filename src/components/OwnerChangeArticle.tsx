import EditorialNote from './EditorialNote';
import EditorialObject from './EditorialObject';
import type { EditContent } from './KnowledgeContext';
import type { Article } from '../data/types';
import type { Procedure } from '../data/domain';
import { ownerReading } from '../data/access-content';
import { Evidence, KnowledgeEvidence, KnowledgeIssues, KnowledgeTrainer } from './KnowledgeContext';

// Reading order only: all procedures and supplemental sections retain their original IDs/data.
export const ownerJumps = [
  ['procedure-owner-change', 'Owner-Wechsel: Quick Guide'],
  ['procedure-permissions', 'Stakeholder berechtigen'],
  ['owner-learning', 'Use Case und Schulung'],
  ['abschnitt-5', 'Arbeitsplatz-Tipp'],
  ['einschraenkungen', 'Kritische Einschränkungen'],
  ['nachweise', 'Nachweise'],
] as const;

function CompleteTask({
  procedure,
  primary = false,
  index,
  edit,
}: {
  procedure: Procedure;
  primary?: boolean;
  index: number;
  edit: EditContent;
}) {
  return (
    <section id={procedure.id} tabIndex={-1} className="knowledge-procedure owner-task">
      {edit(<h2>{procedure.title}</h2>, procedure.title + ' – Bedienweg', [
        'procedures',
        index,
        'trigger',
      ])}
      {!primary && (
        <p>
          <strong>Auslöser: </strong>
          {procedure.trigger}
        </p>
      )}
      {primary && (
        <>
          <p className="owner-action-note">{ownerReading.beforeStart}</p>
          <EditorialObject object={ownerReading} field="beforeStart" label="Vor dem Start" />
        </>
      )}
      <section id={primary ? 'voraussetzungen' : undefined} tabIndex={-1}>
        {edit(<h3>Voraussetzungen</h3>, procedure.title + ' – Voraussetzungen', [
          'procedures',
          index,
          'prerequisites',
          0,
        ])}
        <ul>
          {procedure.prerequisites.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ul>
        {procedure.requiredRights && (
          <>
            {edit(<h3>Diese vier Leserechte zuerst sichern</h3>, 'Leserechte', [
              'procedures',
              index,
              'requiredRights',
              0,
            ])}
            <ul>
              {procedure.requiredRights.map((text) => (
                <li key={text}>{text}</li>
              ))}
            </ul>
          </>
        )}
      </section>
      <section id={primary ? 'bedienweg' : undefined} tabIndex={-1}>
        <h3>Ablauf</h3>
        <ol className="steps">
          {procedure.actions.map((action) => (
            <li key={action.text}>
              {action.text}
              <span className="context-line">{action.tool}</span>
            </li>
          ))}
        </ol>
        <details className="knowledge-details owner-procedure-evidence">
          <summary>Beleg und ergänzende Anleitung</summary>
          <Evidence refs={procedure.evidence} />
          {procedure.relatedArticleId && (
            <p className="small">
              Bei Bedarf:{' '}
              <a href={`#/artikel/${procedure.relatedArticleId}`}>
                Speichern, Veröffentlichen und Einchecken im passenden Kontext
              </a>
            </p>
          )}
        </details>
      </section>
      <section id={primary ? 'ergebnispruefung' : undefined} tabIndex={-1}>
        {edit(<h3>Ergebnisprüfung</h3>, procedure.title + ' – Ergebnisprüfung', [
          'procedures',
          index,
          'expectedResults',
          0,
        ])}
        <p>
          <strong>Erwartetes Ergebnis laut Entwurf</strong>
        </p>
        <ul>
          {procedure.expectedResults.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ul>
        <details className="knowledge-details">
          <summary>Prüffragen im Detail</summary>
          <ul>
            {procedure.checkQuestions.map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ul>
        </details>
        <EditorialNote id="ownerchangearticle-8" className="small" />
      </section>
    </section>
  );
}

export default function OwnerChangeArticle({
  article,
  edit,
}: {
  article: Article;
  edit: EditContent;
}) {
  const procedures = article.knowledge!.procedures;
  function section(index: number, disclosure?: string) {
    const content = article.sections[index];
    return (
      <section id={`abschnitt-${index}`} key={index} tabIndex={-1}>
        {edit(<h3>{content.title}</h3>, 'Abschnitt ' + (index + 1), ['sections', index, 'title'])}
        {disclosure ? (
          <details className="knowledge-details" data-section-content>
            <summary>{disclosure}</summary>
            <p>{content.body}</p>
          </details>
        ) : (
          <p>{content.body}</p>
        )}
      </section>
    );
  }
  return (
    <>
      <CompleteTask
        procedure={procedures.find((p) => p.id === 'procedure-owner-change')!}
        primary
        index={procedures.findIndex((p) => p.id === 'procedure-owner-change')}
        edit={edit}
      />
      <details className="knowledge-details owner-supplement">
        <summary>Stakeholder berechtigen</summary>
        <CompleteTask
          procedure={procedures.find((p) => p.id === 'procedure-permissions')!}
          index={procedures.findIndex((p) => p.id === 'procedure-permissions')}
          edit={edit}
        />
        {section(6)}
        {section(7)}
      </details>
      <details className="knowledge-details">
        <summary>Kritische Einschränkungen im Detail</summary>
        <KnowledgeIssues article={article} />
      </details>
      <details className="knowledge-details owner-supplement">
        <summary>Use Case und Schulung</summary>
        <section id="owner-learning" className="owner-learning" tabIndex={-1}>
          <h2>Vertiefen und schulen</h2>
          <p>{ownerReading.learningIntro}</p>
          <EditorialObject object={ownerReading} field="learningIntro" label="Lesehinweis" />
          {section(1, 'Use Case lesen')}
          {section(2, 'Schulung vorbereiten')}
          {section(3, 'Leseübung öffnen')}
          {section(4, 'Musterantwort öffnen')}
          <KnowledgeTrainer article={article} />
        </section>
      </details>
      <details className="knowledge-details owner-supplement">
        <summary>Arbeitsplatz-Tipp für Dokumentation und Schulung</summary>
        {section(5)}
      </details>
      <details className="knowledge-details owner-supplement">
        <summary>Nachweise und Quellen</summary>
        <section id="kurzantwort" tabIndex={-1}>
          <h2>Kurzantwort für PM</h2>
          {edit(<p>{article.takeaway}</p>, 'Kurzantwort', ['takeaway'])}
        </section>
        {section(0)}
        <KnowledgeEvidence article={article} includeTrainer={false} />
      </details>
    </>
  );
}
