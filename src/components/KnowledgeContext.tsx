import { useState } from 'react';
import type { Article } from '../data/types';
import type { EvidenceRef, OwnerChangeTrainerPackage } from '../data/domain';
import {
  assessmentLabels,
  functions,
  roleLabel,
  scopeItems,
  trainingBlocks,
} from '../data/catalog';
import { sources } from '../data/sources';
import { visibleArticles } from '../data/content';
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
        {data.steps.length > 0 ? 'SB1-Bezug' : 'Planungsorientierung ohne SB1-Schulungszuordnung'} ·{' '}
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
        {data.steps.length > 0
          ? data.steps.map((s) => `${s.number} ${s.title} (${roleLabel(s.roleId)})`).join('; ')
          : 'Keine Zuordnung zu operativen Schulungsschritten'}
        .
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
          .join('; ') || 'Planungsumfang laut unten genannter Quelle; keine operative Freigabe'}
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
      ) : guide ? (
        <p>
          Die Voraussetzungen für die praktische Anwendung stehen in der zugehörigen Anleitung:{' '}
          <GuideReference guide={guide} />
        </p>
      ) : (
        <p>
          Vor praktischer Nutzung müssen die unten genannten fachlichen und technischen
          Voraussetzungen nachgewiesen sein. Dieser Beitrag bietet Orientierung.
        </p>
      )}
    </section>
  );
}

export function KnowledgeProcedures({ article, guide }: { article: Article; guide?: Article }) {
  const procedures = article.knowledge?.procedures ?? [];
  return (
    <>
      {procedures.length === 0 &&
        (guide ? (
          <p>
            Diese Antwort erläutert die Entscheidung. Der beschriebene Schritt-für-Schritt-Weg steht
            in der zugehörigen Anleitung: <GuideReference guide={guide} />
          </p>
        ) : (
          <p>
            Für diesen Schritt liegt hier kein ausführbarer Bedienweg vor. Die Orientierung und
            Prüffragen im fachlichen Kontext benennen die Vorbereitung und die offenen Nachweise.
          </p>
        ))}
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
          {visibleArticles.some((candidate) => candidate.id === p.relatedArticleId) && (
            <p className="small">
              Zum passenden Beitrag:{' '}
              <a href={`#/artikel/${p.relatedArticleId}`}>
                {visibleArticles.find((candidate) => candidate.id === p.relatedArticleId)?.title}
              </a>
            </p>
          )}
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
      ) : guide ? (
        <p>
          Die Ergebnisfragen zum beschriebenen Weg stehen in der zugehörigen Anleitung:{' '}
          <GuideReference guide={guide} />
        </p>
      ) : (
        <p>
          {article.knowledge?.trainer.expectedResult} Die Prüffragen dienen der Vorbereitung; ihre
          Beantwortung ist kein praktischer Systemnachweis.
        </p>
      )}
    </section>
  );
}

function OwnerChangeTrainer({
  article,
  plan,
}: {
  article: Article;
  plan: OwnerChangeTrainerPackage;
}) {
  const [variantId, setVariantId] = useState<'tm' | 'ilsm'>(plan.variants[0].id);
  const variant = plan.variants.find((item) => item.id === variantId) ?? plan.variants[0];
  const procedure = article.knowledge?.procedures.find((item) => item.id === plan.procedureId);
  const openIssues = knowledgeFor(article).issues;
  const jumpToProcedure = () => {
    const target = document.getElementById(plan.procedureId);
    target?.focus({ preventScroll: true });
    target?.scrollIntoView({ block: 'start' });
  };
  return (
    <details className="knowledge-details owner-training">
      <summary>Trainerpaket Owner-Wechsel · fiktives Szenario</summary>
      <p>
        Alle Projekt- und Kontobezeichnungen sind fiktiv. Prüfen Sie den tatsächlichen
        Ausgangszustand im geeigneten Schulungssystem. Einträge hier werden nicht gespeichert; ein
        praktischer Durchlauf ist nicht belegt.
      </p>
      <label htmlFor="owner-training-variant">Variante</label>
      <select
        id="owner-training-variant"
        value={variantId}
        onChange={(event) => setVariantId(event.target.value as 'tm' | 'ilsm')}
      >
        {plan.variants.map((item) => (
          <option key={item.id} value={item.id}>
            {item.label}
          </option>
        ))}
      </select>
      <p className="small">Beim Variantenwechsel werden die Eingaben dieser Ansicht geleert.</p>
      <div key={variant.id}>
        <h3>Ausgangszustand und Ziel</h3>
        <dl>
          <dt>Kundenprojekt</dt>
          <dd>{plan.customerProject}</dd>
          <dt>Teilprojekt</dt>
          <dd>{variant.subproject}</dd>
          <dt>PM-Konto</dt>
          <dd>{plan.pmAccount}</dd>
          <dt>Getrenntes Zielkonto</dt>
          <dd>{variant.targetAccount}</dd>
          <dt>Owner aktuell → geplant</dt>
          <dd>
            {plan.currentOwner} → {variant.plannedOwner}
          </dd>
          <dt>Subprojects aktuell → geplant</dt>
          <dd>
            {plan.currentSubprojects} → {variant.plannedSubprojects}
          </dd>
        </dl>
        <fieldset>
          <legend>Vorprüfung vor dem Owner-Wechsel</legend>
          <p>Vier PM-Leserechte aus der bestehenden Prozedur mit dem PM-Konto prüfen:</p>
          {procedure?.requiredRights?.map((right) => (
            <label className="owner-training-check" key={right}>
              <input type="checkbox" />
              {right}
            </label>
          ))}
          {plan.prechecks.map((check) => (
            <label className="owner-training-check" key={check}>
              <input type="checkbox" />
              {check}
            </label>
          ))}
        </fieldset>
        <button type="button" className="button secondary" onClick={jumpToProcedure}>
          Zur bestehenden Owner-Wechsel-Prozedur
        </button>
        <fieldset>
          <legend>Soll-/Ist-Beobachtung je Konto</legend>
          <h4>{plan.pmAccount}</h4>
          <p>
            <strong>Soll: </strong>
            {plan.pmExpected}
          </p>
          <label htmlFor="owner-training-pm-actual">Ist-Beobachtung PM-Konto</label>
          <textarea id="owner-training-pm-actual" rows={3} />
          <label htmlFor="owner-training-pm-status">Bewertung PM-Konto</label>
          <select id="owner-training-pm-status" defaultValue="">
            <option value="">Noch nicht bewertet</option>
            <option value="bestätigt">bestätigt</option>
            <option value="nicht bestätigt">nicht bestätigt</option>
            <option value="nicht prüfbar">nicht prüfbar</option>
          </select>
          <h4>{variant.targetAccount}</h4>
          <p>
            <strong>Soll: </strong>
            {plan.targetExpected}
          </p>
          <label htmlFor="owner-training-target-actual">Ist-Beobachtung Zielkonto</label>
          <textarea id="owner-training-target-actual" rows={3} />
          <label htmlFor="owner-training-target-status">Bewertung Zielkonto</label>
          <select id="owner-training-target-status" defaultValue="">
            <option value="">Noch nicht bewertet</option>
            <option value="bestätigt">bestätigt</option>
            <option value="nicht bestätigt">nicht bestätigt</option>
            <option value="nicht prüfbar">nicht prüfbar</option>
          </select>
        </fieldset>
        <label htmlFor="owner-training-environment">Umgebung und Systemstand</label>
        <input id="owner-training-environment" type="text" />
        <label htmlFor="owner-training-deviation">Abweichung</label>
        <textarea id="owner-training-deviation" rows={3} />
        <label htmlFor="owner-training-issue">Betroffenes offenes Issue</label>
        <select id="owner-training-issue" defaultValue="">
          <option value="">Noch nicht zugeordnet</option>
          {openIssues.map((issue) => (
            <option key={issue.id} value={issue.id}>
              {issue.id} · {issue.title}
            </option>
          ))}
        </select>
      </div>
      <p>
        Auch eine bestätigte Beobachtung erledigt keine offenen Issues. Build Team, effektive
        Rechte, Bestands-Sites und Schulungsumgebung bleiben gesondert zu prüfen.
      </p>
      <ul>
        {openIssues.map((issue) => (
          <li key={issue.id}>
            {issue.id} · {issue.title} · {issue.status}
          </li>
        ))}
      </ul>
      <p>
        <strong>Rücksetzung vorbereiten: </strong>
        {plan.resetCheck}
      </p>
    </details>
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
          <summary>
            {data.training.length > 0
              ? 'SB1-Zuordnung und abweichende Schulungswege'
              : 'Keine operative Schulungszuordnung'}
          </summary>
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
        {trainer.ownerChange && <OwnerChangeTrainer article={article} plan={trainer.ownerChange} />}
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
