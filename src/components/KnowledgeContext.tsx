import type { Article } from '../data/types';
import type { EvidenceRef } from '../data/domain';
import {
  assessmentLabels,
  functions,
  roleLabel,
  scopeItems,
  trainingBlocks,
} from '../data/catalog';
import { sources } from '../data/sources';
import { articleEvidence, knowledgeFor } from '../lib/knowledge';

function Evidence({ refs }: { refs: EvidenceRef[] }) {
  return (
    <p className="small source-ref">
      {refs
        .map(
          (r) =>
            `${r.sourceId} · ${r.locator}${r.sourceKey ? ` · ${r.sourceKey}` : ''}${r.derivation === 'inferred' ? ' (redaktionell abgeleitet)' : ''}`,
        )
        .join(' / ')}
    </p>
  );
}
export function KnowledgeOverview({ article }: { article: Article }) {
  const data = knowledgeFor(article);
  return (
    <section id="fachlicher-kontext" tabIndex={-1}>
      <h3>Aufgabe und Geltungsbereich</h3>
      <p>
        SB1-Bezug ·{' '}
        {article.status === 'reviewed' ? 'Fachlich geprüfter Inhalt' : 'Quellenbasierter Entwurf'} ·
        Keine Produktivfreigabe. Stand dieses Center-Beitrags: {article.updated}; Quellenstände
        siehe unten.
      </p>
      <ul>
        {data.functions.map((f) => (
          <li key={f.id}>
            <a href={`#/wissen?q=${encodeURIComponent(f.title)}`}>{f.title}</a>: {f.outcome}
            <span className="context-line">
              {f.context.projectTypes.join(', ')} · {f.context.tools.join(', ')}
            </span>
          </li>
        ))}
      </ul>
      <p>
        Prozessbezug:{' '}
        {data.steps.map((s) => `${s.number} ${s.title} (${roleLabel(s.roleId)})`).join('; ')}.
      </p>
      <a href="#/prozesse">Prozessschritte und Zuständigkeiten ansehen</a>
      <p>
        Aktueller Scope:{' '}
        {data.releases
          .filter((r) => r.basis === 'current-scope')
          .map(
            (r) =>
              `${r.subject.id} – ${scopeItems.find((s) => s.id === r.subject.id)?.title} (${r.stageId})`,
          )
          .join('; ')}
        . Die Zuordnung belegt Umfang, keine technische Reife. Teilbezüge sind bei den Funktionen
        ausgewiesen.
      </p>
      {data.links.length > 0 && (
        <>
          <h4>Fachliche Abhängigkeiten</h4>
          <ul>
            {data.links.map((link) => (
              <li key={link.id}>
                <strong>
                  {link.relation === 'feeds'
                    ? 'Liefert Eingangsdaten'
                    : 'Benötigt als Voraussetzung'}
                </strong>
                {link.condition && <span className="context-line">Wenn: {link.condition}</span>}
                <p>{link.statement}</p>
                <Evidence refs={link.evidence} />
              </li>
            ))}
          </ul>
        </>
      )}
      <p>
        Geprüfte Zielumgebung: nicht angegeben. Die technischen Bewertungen beziehen sich auf die
        jeweils begrenzten Quellenkontexte.
      </p>
    </section>
  );
}
export function KnowledgeIssues({ article }: { article: Article }) {
  return (
    <section id="einschraenkungen" className="knowledge-issues" tabIndex={-1}>
      <h2>Einschränkungen vor der Anwendung</h2>
      {knowledgeFor(article).issues.map((i) => (
        <div key={i.id}>
          <h3>{i.title}</h3>
          <p>
            <strong>{i.status}.</strong> {i.limitation}
          </p>
          <Evidence refs={i.evidence} />
        </div>
      ))}
    </section>
  );
}
function GuideReference({ guide }: { guide?: Article }) {
  return guide ? (
    <a href={`#/artikel/${guide.id}`}>{guide.title}</a>
  ) : (
    <span>Für diesen Beitrag liegt kein eigener Bedienweg vor.</span>
  );
}

export function KnowledgePrerequisites({ article, guide }: { article: Article; guide?: Article }) {
  const procedures = article.knowledge?.procedures ?? [];
  return (
    <section id="voraussetzungen" tabIndex={-1}>
      <h2>Voraussetzungen</h2>
      {procedures.length ? (
        procedures.map((procedure) => (
          <div key={procedure.id}>
            <h3>{procedure.title}</h3>
            <ul>
              {procedure.prerequisites.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {procedure.requiredRights && (
              <>
                <p>
                  <strong>Vor der Übergabe benötigte Leserechte</strong>
                </p>
                <ul>
                  {procedure.requiredRights.map((right) => (
                    <li key={right}>{right}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        ))
      ) : (
        <p>
          Die Voraussetzungen für die praktische Anwendung stehen in der zugehörigen Anleitung:{' '}
          <GuideReference guide={guide} />
        </p>
      )}
    </section>
  );
}

export function KnowledgeProcedures({ article, guide }: { article: Article; guide?: Article }) {
  const procedures = article.knowledge?.procedures ?? [];
  return (
    <>
      {procedures.length === 0 && (
        <p>
          Diese Antwort erläutert die Entscheidung. Der beschriebene Schritt-für-Schritt-Weg steht
          in der zugehörigen Anleitung: <GuideReference guide={guide} />
        </p>
      )}
      {procedures.map((p) => (
        <section key={p.id} id={p.id} tabIndex={-1} className="knowledge-procedure">
          <h3>{p.title}</h3>
          <p>
            <strong>Auslöser: </strong>
            {p.trigger}
          </p>
          <ol className="steps">
            {p.actions.map((a) => (
              <li key={a.text}>
                {a.text}
                <span className="context-line">{a.tool}</span>
              </li>
            ))}
          </ol>
          <Evidence refs={p.evidence} />
        </section>
      ))}
    </>
  );
}

export function KnowledgeResults({ article, guide }: { article: Article; guide?: Article }) {
  const procedures = article.knowledge?.procedures ?? [];
  return (
    <section id="ergebnispruefung" tabIndex={-1}>
      <h2>Ergebnisprüfung</h2>
      {procedures.length ? (
        <>
          {procedures.map((procedure) => (
            <div key={procedure.id}>
              <h3>{procedure.title}</h3>
              <p>
                <strong>Erwartetes Ergebnis laut Entwurf</strong>
              </p>
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
            </div>
          ))}
          <p className="small">
            Diese Ergebnisse sind zu prüfen; ihre Beschreibung ist kein erfolgreicher Test mit Ihren
            Konten.
          </p>
        </>
      ) : (
        <p>
          Die Ergebnisfragen zum beschriebenen Weg stehen in der zugehörigen Anleitung:{' '}
          <GuideReference guide={guide} />
        </p>
      )}
    </section>
  );
}
export function KnowledgeEvidence({ article }: { article: Article }) {
  const data = knowledgeFor(article);
  const refs = articleEvidence(article);
  const trainer = article.knowledge!.trainer;
  return (
    <>
      <section id="nachweise" tabIndex={-1}>
        <h2>Nachweise und Geltungsbereich</h2>
        <KnowledgeOverview article={article} />
        <h3>Schulungsbezug und Quellenbewertungen</h3>
        <p>
          Die Aussagen bleiben nach Quelle und Reichweite getrennt. Ein beschriebener oder geübter
          Einzelweg gibt diesen Center-Inhalt nicht fachlich frei.
        </p>
        <details className="knowledge-details">
          <summary>SB1-Zuordnung und abweichende Schulungswege</summary>
          <ul>
            {data.training.map((t) => (
              <li key={t.id}>
                <strong>
                  {trainingBlocks.find((b) => b.id === t.blockId)?.title}:{' '}
                  {t.included === null
                    ? 'Zuordnung unbekannt'
                    : t.included
                      ? 'enthalten laut Quelle'
                      : 'nicht enthalten laut Quelle'}
                </strong>
                <p>{t.statement}</p>
                <Evidence refs={t.evidence} />
              </li>
            ))}
          </ul>
        </details>
        <details className="knowledge-details">
          <summary>Technischer Nachweis, TTT und Beschreibungsstand</summary>
          <ul>
            {data.assessments.map((a) => (
              <li key={a.id}>
                <strong>
                  {functions.find((f) => f.id === a.subject.id)?.title} ·{' '}
                  {assessmentLabels[a.dimension]}: {a.originalValue}
                </strong>
                <p>{a.scope}</p>
                <p className="small">Kontext: {a.environment ?? 'Nicht angegeben'}</p>
                <Evidence refs={a.evidence} />
              </li>
            ))}
          </ul>
        </details>
        <details className="knowledge-details">
          <summary>Aktueller Scope und ursprüngliche Release-Zuordnung</summary>
          <ul>
            {data.releases.map((r) => (
              <li key={r.id}>
                <strong>
                  {r.basis === 'current-scope'
                    ? 'Aktueller Scope'
                    : r.basis === 'historical-plan'
                      ? 'Historischer Zielrahmen'
                      : 'Ausbauziel'}{' '}
                  · {r.stageId}
                </strong>
                <p>{r.aspect}</p>
                <Evidence refs={r.evidence} />
              </li>
            ))}
          </ul>
          <p>Historische Planung ersetzt weder aktuellen Scope noch Schulungsnachweis.</p>
        </details>
      </section>
      <section id="trainerhinweise" tabIndex={-1}>
        <h2>Für die Schulung vorbereiten</h2>
        <details className="knowledge-details">
          <summary>Lernziel, Voraussetzungen und Übungsvorschlag</summary>
          <p>
            <strong>Lernziel: </strong>
            {trainer.objective}
          </p>
          <ul>
            {trainer.preparation.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <p>{trainer.exercise}</p>
          <p>
            <strong>Erwartetes Übungsergebnis: </strong>
            {trainer.expectedResult}
          </p>
          <p>{trainer.limitation}</p>
        </details>
      </section>
      <section id="quellen" tabIndex={-1}>
        <h2>Quellen und Fundstellen</h2>
        <p>
          Die Fundstellen beziehen sich auf die lokal analysierten Dateien. Originaldateien werden
          hier nicht geladen; referenzierte TTT-Originale und Quick Guides sind nicht als verfügbare
          Downloads hinterlegt.
        </p>
        {sources
          .filter((s) => refs.some((r) => r.sourceId === s.id))
          .map((s) => (
            <details className="knowledge-details" key={s.id}>
              <summary>
                {s.id} · {s.title}
              </summary>
              <p className="source-ref">{s.filename}</p>
              <p>
                {s.status}. Dokumentstand: {s.date ?? 'nicht ausgewiesen'}.
              </p>
              <ul>
                {refs
                  .filter((r) => r.sourceId === s.id)
                  .map((r) => (
                    <li key={JSON.stringify(r)}>
                      {r.locator}
                      {r.sourceKey && ` · ${r.sourceKey}`}
                      {r.derivation === 'inferred' && ' · redaktionell abgeleitet'}
                    </li>
                  ))}
              </ul>
              <p className="small source-ref">SHA-256: {s.sha256}</p>
            </details>
          ))}
      </section>
    </>
  );
}
