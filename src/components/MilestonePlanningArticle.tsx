import type { Article } from '../data/types';
import type { Procedure } from '../data/domain';
import { Evidence, KnowledgeEvidence, KnowledgeIssues, KnowledgeTrainer } from './KnowledgeContext';

export const milestoneJumps = [
  ['procedure-deliverables', 'Liefergegenstände erfassen'],
  ['procedure-payment-terms', 'Zahlungsbedingungen erfassen'],
  ['procedure-delivery-milestones', 'Liefermeilensteine planen'],
  ['procedure-payment-milestones', 'Zahlungsmeilensteine planen'],
  ['einschraenkungen', 'Kritische Einschränkungen'],
  ['nachweise', 'Nachweise'],
] as const;

function Task({ procedure, first }: { procedure: Procedure; first: boolean }) {
  return (
    <section id={procedure.id} tabIndex={-1} className="knowledge-procedure milestone-task">
      <h2>{procedure.title}</h2>
      <p>
        <strong>Auslöser: </strong>
        {procedure.trigger}
      </p>
      <section id={first ? 'voraussetzungen' : undefined} tabIndex={first ? -1 : undefined}>
        <h3>Voraussetzungen</h3>
        <ul>
          {procedure.prerequisites.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
      <section id={first ? 'bedienweg' : undefined} tabIndex={first ? -1 : undefined}>
        <h3>Ablauf</h3>
        <ol className="steps">
          {procedure.actions.map((action) => (
            <li key={action.text}>
              {action.text}
              <span className="context-line">{action.tool}</span>
            </li>
          ))}
        </ol>
      </section>
      <section id={first ? 'ergebnispruefung' : undefined} tabIndex={first ? -1 : undefined}>
        <h3>Ergebnis prüfen</h3>
        <ul>
          {procedure.expectedResults.map((result) => (
            <li key={result}>{result}</li>
          ))}
        </ul>
        <p>
          <strong>Prüffragen</strong>
        </p>
        <ul>
          {procedure.checkQuestions.map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ul>
        <p className="small">
          Beschriebenes Ergebnis laut Entwurf; kein erfolgreicher Test mit Ihren Konten.
        </p>
      </section>
      <details className="knowledge-details">
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
  );
}

export default function MilestonePlanningArticle({ article }: { article: Article }) {
  const procedures = article.knowledge!.procedures;
  return (
    <>
      {procedures.map((procedure, index) => (
        <Task key={procedure.id} procedure={procedure} first={index === 0} />
      ))}
      <details className="knowledge-details milestone-supplement">
        <summary>Kritische Einschränkungen im Detail</summary>
        <KnowledgeIssues article={article} />
      </details>
      <details className="knowledge-details milestone-supplement">
        <summary>Fachliche Erläuterungen</summary>
        {article.sections.map((section, index) => (
          <section id={`abschnitt-${index}`} key={section.title} tabIndex={-1}>
            <h3>{section.title}</h3>
            <p>{section.body}</p>
          </section>
        ))}
      </details>
      <details className="knowledge-details milestone-supplement">
        <summary>Für die Schulung vorbereiten</summary>
        <KnowledgeTrainer article={article} />
      </details>
      <details className="knowledge-details milestone-supplement">
        <summary>Nachweise und Quellen</summary>
        <section id="kurzantwort" tabIndex={-1}>
          <h2>Kurzantwort</h2>
          <p>{article.takeaway}</p>
        </section>
        <KnowledgeEvidence article={article} includeTrainer={false} />
      </details>
    </>
  );
}
