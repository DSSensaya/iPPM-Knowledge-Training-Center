import { visibleArticles } from '../data/content';
import { PageTitle } from '../components/ui';
import { issues, processSteps, processViews, roleLabel } from '../data/catalog';
import { sb1AdditionalHandbookTopics, sb1Coverage } from '../data/sb1-coverage';
import { sources } from '../data/sources';

const sourceLabel = (id: string) => sources.find((source) => source.id === id)?.title ?? id;

export default function Processes() {
  return (
    <>
      <PageTitle
        eyebrow="Das Zusammenspiel verstehen"
        title="Prozesse im Überblick"
        description="Wer macht was – und welches Ergebnis wird weitergegeben? SB1 mit abgegrenzten Bedienentwürfen und Orientierung; offene Fachregeln und Systemnachweise bleiben sichtbar."
      />
      {processViews.map((view) => (
        <section className="process-section" aria-label={view.title} key={view.id}>
          <h2>{view.title}</h2>
          <p>{view.description}</p>
          <ul className="knowledge-step-list">
            {view.stepIds.map((id) => {
              const s = processSteps.find((step) => step.id === id)!;
              return (
                <li key={s.id}>
                  <h3>
                    {s.number} {s.title}
                  </h3>
                  <p>
                    <strong>{roleLabel(s.roleId)}</strong>
                  </p>
                  <p>Voraussetzung: {s.input}</p>
                  <p>Erwartetes Ergebnis: {s.output}</p>
                  <a href={`#/artikel/${view.articleId}`}>
                    {sb1Coverage
                      .find((item) => item.number === s.number)
                      ?.materialStatus.startsWith('Orientierung')
                      ? 'Orientierung'
                      : 'Bedienweg'}
                    , Quellen und Einschränkungen zu {s.number} öffnen
                  </a>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
      <section className="process-section" aria-labelledby="sb1-coverage-heading">
        <h2 id="sb1-coverage-heading">SB1-Schulungsmatrix: 24 Schritte</h2>
        <p>
          Die Liste zeigt den Stand der Center-Materialien je Matrixschritt. „Material vorhanden“
          bedeutet weder geschult noch praktisch geprüft oder freigegeben. Quellenhinweise und
          offene Punkte ersetzen keinen Bedienweg.
        </p>
        <p>
          {
            sb1Coverage.filter((item) => item.materialStatus === 'Reales Teilmaterial vorhanden')
              .length
          }{' '}
          Schritte mit realem Teilmaterial,{' '}
          {sb1Coverage.filter((item) => item.materialStatus.startsWith('Orientierung')).length}{' '}
          Schritte mit Orientierung ohne Gesamtbedienweg,{' '}
          {sb1Coverage.filter((item) => item.materialStatus === 'Nur Quellenhinweis').length}{' '}
          Schritte nur mit Quellenhinweisen. Alle Materialien bleiben Quellenentwürfe.
        </p>
        <ol className="sb1-coverage-list">
          {sb1Coverage.map((item) => (
            <li key={item.number} data-matrix-number={item.number}>
              <details>
                <summary>
                  <strong>
                    {item.number} {item.originalTitle}
                  </strong>
                  <span>{item.materialStatus}</span>
                </summary>
                <div className="sb1-coverage-details">
                  <p>
                    <strong>Fundstelle in T:</strong> {sourceLabel(item.matrixEvidence.sourceId)} ·{' '}
                    {item.matrixEvidence.locator}
                  </p>
                  <div>
                    <strong>Vorhandene reale Materialien:</strong>{' '}
                    {item.realMaterials.length ? (
                      <ul className="sb1-material-list">
                        {item.realMaterials.map((material) => (
                          <li key={material.articleId}>
                            <a href={`#/artikel/${material.articleId}`}>
                              {
                                visibleArticles.find((article) => article.id === material.articleId)
                                  ?.title
                              }
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      'Keine realen Center-Materialien angebunden.'
                    )}
                  </div>
                  <p>
                    <strong>Behandelter Teilumfang:</strong> {item.treatedScope}
                  </p>
                  <p>
                    <strong>Konkrete Lücke:</strong> {item.gap}
                  </p>
                  <p>
                    <strong>Relevante Issues:</strong>{' '}
                    {item.issueIds.length
                      ? item.issueIds
                          .map((id) => {
                            const issue = issues.find((candidate) => candidate.id === id);
                            return `${issue?.title ?? id} (${id})`;
                          })
                          .join('; ')
                      : 'Kein eigenes Issue im Center zugeordnet; die Lücke bleibt offen.'}
                  </p>
                  <p>
                    <strong>Ergänzende Belege:</strong>{' '}
                    {item.supplementaryEvidence
                      .map((ref) => `${sourceLabel(ref.sourceId)} · ${ref.locator}`)
                      .join('; ')}
                  </p>
                </div>
              </details>
            </li>
          ))}
        </ol>
      </section>
      <section className="process-section" aria-labelledby="sb1-additional-heading">
        <h2 id="sb1-additional-heading">Weitere Handbuchthemen außerhalb der 24er-Zählung</h2>
        <ul className="sb1-additional-topics">
          {sb1AdditionalHandbookTopics.map((topic) => (
            <li key={topic.title}>
              <strong>{topic.title}</strong> · {topic.note}{' '}
              <span>
                Beleg:{' '}
                {topic.evidence
                  .map((ref) => `${sourceLabel(ref.sourceId)} · ${ref.locator}`)
                  .join('; ')}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
