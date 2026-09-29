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

function CompleteTask({ procedure, primary = false }: { procedure: Procedure; primary?: boolean }) {
  return (
    <section id={procedure.id} tabIndex={-1} className="knowledge-procedure owner-task">
      <h2>{procedure.title}</h2>
      <p>
        <strong>Auslöser: </strong>
        {procedure.trigger}
      </p>
      {primary && <p className="owner-action-note">{ownerReading.beforeStart}</p>}
      <section id={primary ? 'voraussetzungen' : undefined} tabIndex={-1}>
        <h3>Voraussetzungen</h3>
        <ul>
          {procedure.prerequisites.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ul>
        {procedure.requiredRights && (
          <>
            <h3>Diese vier Leserechte zuerst sichern</h3>
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
        <Evidence refs={procedure.evidence} />
        {procedure.relatedArticleId && (
          <p className="small">
            Bei Bedarf:{' '}
            <a href={`#/artikel/${procedure.relatedArticleId}`}>
              Speichern, Veröffentlichen und Einchecken im passenden Kontext
            </a>
          </p>
        )}
      </section>
      <section id={primary ? 'ergebnispruefung' : undefined} tabIndex={-1}>
        <h3>Ergebnisprüfung</h3>
        <p>
          <strong>Erwartetes Ergebnis laut Entwurf</strong>
        </p>
        <ul>
          {procedure.expectedResults.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ul>
        <p>
          <strong>Prüffragen</strong>
        </p>
        <ul>
          {procedure.checkQuestions.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ul>
        <p className="small">
          Diese Ergebnisse sind zu prüfen; ihre Beschreibung ist kein erfolgreicher Test mit Ihren
          Konten.
        </p>
      </section>
    </section>
  );
}

export default function OwnerChangeArticle({ article }: { article: Article }) {
  const procedures = article.knowledge!.procedures;
  function section(index: number, disclosure?: string) {
    const content = article.sections[index];
    return (
      <section id={`abschnitt-${index}`} key={index} tabIndex={-1}>
        <h3>{content.title}</h3>
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
      <section id="kurzantwort" className="takeaway" tabIndex={-1}>
        <h2>Kurzantwort für PM</h2>
        <p>{article.takeaway}</p>
      </section>
      <CompleteTask
        procedure={procedures.find((p) => p.id === 'procedure-owner-change')!}
        primary
      />
      {section(5)}
      <CompleteTask procedure={procedures.find((p) => p.id === 'procedure-permissions')!} />
      {section(6)}
      {section(7)}
      <details className="knowledge-details">
        <summary>Kritische Einschränkungen im Detail</summary>
        <KnowledgeIssues article={article} />
      </details>
      <section id="owner-learning" className="owner-learning" tabIndex={-1}>
        <h2>Vertiefen und schulen</h2>
        <p>{ownerReading.learningIntro}</p>
        {section(1, 'Use Case lesen')}
        {section(2, 'Schulung vorbereiten')}
        {section(3, 'Leseübung öffnen')}
        {section(4, 'Musterantwort öffnen')}
        <KnowledgeTrainer article={article} />
      </section>
      {section(0)}
      <KnowledgeEvidence article={article} includeTrainer={false} />
    </>
  );
}
