import { content } from '../content';
import { resolveRelationshipTarget, type RelationshipContext } from '../content/relationships';
import type { Material, Procedure, Section, Open, Relationship } from '../content/types';
import { getOpenPoints, resolveMaterials, materialLabels, statusLabels } from '../lib/queries';
export function Sections({ sections }: { sections: Section[] }) {
  const render = (items: Section[]) =>
    items.map((s, i) => (
      <section className="content-section" key={i}>
        <h2>{s.title}</h2>
        {s.body && <p>{s.body}</p>}
        {s.steps?.length ? (
          <ol className="steps">
            {s.steps.map((text, j) => (
              <li key={j}>{text}</li>
            ))}
          </ol>
        ) : null}
      </section>
    ));
  const exercise = sections.filter((s) => s.purpose === 'exercise'),
    context = sections.filter((s) => s.purpose === 'context');
  return (
    <>
      {render(sections.filter((s) => !s.purpose))}
      {exercise.length > 0 && (
        <details>
          <summary>Optionales Übungsbeispiel</summary>
          {render(exercise)}
        </details>
      )}
      {context.length > 0 && (
        <details>
          <summary>Weitere Quellenkontexte</summary>
          {render(context)}
        </details>
      )}
    </>
  );
}
export function OpenPoints({ object, points }: { object?: Open; points?: string[] }) {
  const list = points ?? (object ? getOpenPoints(object) : []);
  return list.length ? (
    <section className="limitations">
      <h2>Geltungsbereich und offene Punkte</h2>
      <ul>
        {list.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
    </section>
  ) : null;
}
export function Materials({ materials, releaseId }: { materials: Material[]; releaseId?: string }) {
  const resolved = resolveMaterials(materials, releaseId);
  return (
    <section className="materials">
      <h2>Wissen zur Aufgabe</h2>
      {!resolved.length && (
        <p>
          Für diese Aufgabe ist noch kein Center-Material vorhanden. Die Prozessbeschreibung ersetzt
          keinen Bedienweg.
        </p>
      )}
      {resolved.map((m, i) => (
        <div className="material" key={i}>
          <h3>
            <a href={'#/artikel/' + m.article.id}>{m.article.title}</a>
          </h3>
          <p>
            {materialLabels[m.material.kind]} · {statusLabels[m.article.status]}
            {!m.releaseValid ? ' · Für dieses Release nicht gültig' : ''}
          </p>
          <p className="small muted">
            Geltung:{' '}
            {m.material.releaseIds
              .map((id) => content.releases.find((r) => r.id === id)!.title)
              .join('; ')}
          </p>
          <p>{m.article.summary}</p>
          {m.material.kind === 'guide' && m.releaseValid && m.procedures.length > 0 && (
            <ul>
              {m.procedures.map((p) => (
                <li key={p.id}>
                  <a href={'#/bedienweg/' + p.id}>{p.title}</a>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </section>
  );
}
export function ProcedureView({ procedure }: { procedure: Procedure }) {
  return (
    <section className="procedure" id={procedure.id}>
      <h2>{procedure.title}</h2>
      <p>{procedure.trigger}</p>
      <h3>Voraussetzungen</h3>
      <ul>
        {procedure.prerequisites.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>
      {procedure.requiredRights?.length ? (
        <>
          <h3>Benötigte Rechte</h3>
          <ul>
            {procedure.requiredRights.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </>
      ) : null}
      <h3>Bedienweg</h3>
      <ol className="steps">
        {procedure.actions.map((a, i) => (
          <li key={i}>
            <p>{a.text}</p>
            {a.tool && <p className="small muted">{a.tool}</p>}
            {a.toolSelection && (
              <p className="small muted">
                {a.toolSelection.relation === 'all' ? 'Gemeinsam' : 'Alternativen'}:{' '}
                {a.toolSelection.toolIds
                  .map(
                    (id) =>
                      [
                        ...content.systems,
                        ...content.systems.flatMap((s) => s.destinations ?? []),
                      ].find((s) => s.id === id)!.title,
                  )
                  .join('; ')}
              </p>
            )}
          </li>
        ))}
      </ol>
      <h3>Ergebnisse prüfen</h3>
      <ul>
        {procedure.expectedResults.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>
      {procedure.checkQuestions?.length ? (
        <>
          <h3>Prüffragen</h3>
          <ul>
            {procedure.checkQuestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </>
      ) : null}
      <p className="small muted">
        Beschriebene Ergebnisse sind mit Ihren Konten zu prüfen; ihre Beschreibung ist kein
        erfolgreicher Test.
      </p>
      <Relationships relationships={procedure.relationships} context="procedure" />
      {procedure.relatedArticleId && (
        <p>
          <a href={'#/artikel/' + procedure.relatedArticleId}>Ergänzenden Beitrag öffnen</a>
        </p>
      )}
      <OpenPoints object={procedure} />
    </section>
  );
}
export function Sources({ refs, note }: { refs?: string[]; note?: string }) {
  return refs?.length || note ? (
    <details className="source-notes">
      <summary>Quellenhinweise (optional)</summary>
      {note && <p>{note}</p>}
      <ul>
        {refs?.map((ref, i) => (
          <li key={i}>{ref}</li>
        ))}
      </ul>
      <p className="small muted">
        Fundstellen beziehen sich auf lokale Originaldateien. Eine Quellenreferenz ist keine
        technische Freigabe.
      </p>
    </details>
  ) : null;
}

export function Relationships({
  relationships,
  context,
}: {
  relationships?: Relationship[];
  context: RelationshipContext;
}) {
  if (!relationships?.length) return null;
  return (
    <section>
      <h2>Zusammenhänge</h2>
      <ul>
        {relationships.map((r, i) => {
          const target = resolveRelationshipTarget(r.targetId, context, content);
          return (
            <li key={i}>
              {r.condition && <strong>{r.condition}: </strong>}
              {r.note && <p>{r.note}</p>}
              {target ? (
                <a href={target.href}>{target.title}</a>
              ) : (
                <span>Beziehungsziel nicht verfügbar</span>
              )}
              {' · '}
              {r.relation === 'partial'
                ? 'Teilaspekt'
                : r.relation === 'prerequisite'
                  ? 'Voraussetzung'
                  : r.relation === 'whole'
                    ? 'Fachlicher Bezug'
                    : r.relation}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
