import { content } from '../content';
import { getTrainingBlockCoverage, materialLabels, statusLabels } from '../lib/queries';
import { Materials } from '../components/Content';
import { PageTitle } from '../components/ui';
import { orientationHref } from '../lib/orientation';
export default function Releases({ id }: { id?: string }) {
  return (
    <>
      <PageTitle
        eyebrow="Release und Schulung"
        title="Releases & Schulungen"
        description="Schulungsblöcke sind Zuordnungen zu Releases. Sie belegen weder Schulungsreife noch technische Freigabe."
      />
      <p>
        <a className="button secondary" href={orientationHref(undefined, id)}>
          Gesamte Landkarte mit Releasehervorhebung öffnen
        </a>
      </p>
      {content.releases
        .filter((r) => !id || r.id === id)
        .map((r) => (
          <section key={r.id}>
            <h2>{r.title}</h2>
            <p>{r.description}</p>
            <p>
              <a href={orientationHref(undefined, r.id)}>{r.code} in der Landkarte hervorheben</a>
            </p>
            <ul>
              {content.trainingBlocks
                .filter((b) => b.releaseId === r.id)
                .map((b) => (
                  <li key={b.id}>
                    <a href={'#/schulungen/' + b.id}>
                      {b.code}: {b.title}
                    </a>
                  </li>
                ))}
            </ul>
          </section>
        ))}
    </>
  );
}
export function TrainingBlockPage({ id }: { id: string }) {
  if (!content.trainingBlocks.some((b) => b.id === id))
    return (
      <>
        <h1>Schulungsblock nicht gefunden</h1>
        <a href="#/releases">Schulungen öffnen</a>
      </>
    );
  const coverage = getTrainingBlockCoverage(id);
  return (
    <>
      <PageTitle
        eyebrow={content.releases.find((r) => r.id === coverage.block.releaseId)!.title}
        title={coverage.block.code + ': ' + coverage.block.title}
        description="Vorhandene Aufgaben und Materialien. Ein nutzbarer Beitrag deckt den Prozessschritt nicht automatisch vollständig ab."
      />
      <p>{coverage.summary.total} zugeordnete Schritte / Aufgaben</p>
      {coverage.rows.map((row) => (
        <section className="training-row" key={row.entity.id}>
          <h2>
            <a href={('number' in row.entity ? '#/schritt/' : '#/aufgabe/') + row.entity.id}>
              {'number' in row.entity ? row.entity.number + ' ' : ''}
              {row.entity.title}
            </a>
          </h2>
          <Materials
            materials={row.materials.map((m) => m.material)}
            releaseId={coverage.block.releaseId}
          />
          {row.missingGuide && (
            <p className="small muted">Keine Anleitung für diesen Block vorhanden.</p>
          )}
        </section>
      ))}
      {__LOCAL_EDITOR__ && (
        <details>
          <summary>Redaktion: abgeleitete Coverage</summary>
          <p>
            {coverage.summary.withMaterial} mit Material · {coverage.summary.withProcedure} mit
            zugeordnetem Bedienweg · {coverage.summary.withUsableGuide} mit nutzbarem Bedienweg
          </p>
          <ul>
            {coverage.rows.map((row) => (
              <li key={row.entity.id}>
                {row.entity.title}:{' '}
                {row.materials
                  .map(
                    (m) =>
                      `${materialLabels[m.material.kind]} / ${statusLabels[m.article.status]} / ${m.releaseValid ? 'releasegültig' : 'nicht releasegültig'}`,
                  )
                  .join('; ')}
                {row.missingMaterial ? ' Kein Material' : ''}
                {row.openPoints.length > 0 ? ` · ${row.openPoints.length} offene Punkte` : ''}
              </li>
            ))}
          </ul>
        </details>
      )}
    </>
  );
}
