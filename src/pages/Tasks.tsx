import { processHref } from '../lib/process-navigation';
import { ArrowRight } from 'lucide-react';
import { content } from '../content';
import {
  getProcessSteps,
  getStep,
  getTask,
  getProcedure,
  getWorkDetails,
  getArticleOpenPoints,
  resolveMaterials,
  roleLabel,
  statusLabels,
} from '../lib/queries';
import { searchContent } from '../lib/search';
import { PageTitle } from '../components/ui';
import {
  Materials,
  OpenPoints,
  ProcedureView,
  Sections,
  Sources,
  Relationships,
} from '../components/Content';
import { useState } from 'react';
import { getOrientationBacklinks, orientationHref, orientationTitle } from '../lib/orientation';
export default function Tasks() {
  const [q, setQ] = useState(''),
    [role, setRole] = useState('');
  const matches = new Set(
    searchContent(q)
      .filter((e) => e.kind === 'step' || e.kind === 'task')
      .map((e) => e.id),
  );
  const processes = content.processes.map((process) => ({
    ...process,
    steps: process.steps.filter(
      (step) =>
        (!role || step.roleIds.includes(role)) &&
        (matches.has(step.id) || step.taskIds?.some((id) => matches.has(id))),
    ),
  }));
  const assignedTaskIds = new Set(getProcessSteps().flatMap((step) => step.taskIds ?? []));
  const independentTasks = content.tasks.filter(
    (task) =>
      !assignedTaskIds.has(task.id) &&
      matches.has(task.id) &&
      (!role || task.roleIds.includes(role)),
  );
  const stepCount = processes.reduce((count, process) => count + process.steps.length, 0);
  const filtered = Boolean(q.trim() || role);
  return (
    <div className="tasks-page">
      <PageTitle
        eyebrow="Ihre Arbeit in iPPM"
        title="Aufgaben"
        description="Wählen Sie einen Schritt nach Prozessphase oder suchen Sie Ihre Aufgabe. Fachliche Details und vorhandene Bedienwege finden Sie direkt beim Schritt."
      />
      <form className="filters task-filters" role="search" onSubmit={(e) => e.preventDefault()}>
        <label>
          Aufgaben durchsuchen
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Zum Beispiel: Owner wechseln oder 2.10"
            aria-describedby="task-search-hint"
          />
        </label>
        <label>
          Verantwortliche Rolle
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">Alle Rollen</option>
            {content.roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </label>
      </form>
      <p id="task-search-hint" className="task-note">
        Die Suche berücksichtigt auch fachliche Details. Die Rolle filtert die Verantwortung am
        Prozessschritt.
      </p>
      <div className="task-results-summary">
        <p role="status">
          {stepCount} {stepCount === 1 ? 'Prozessschritt' : 'Prozessschritte'}
          {independentTasks.length > 0 &&
            ` · ${independentTasks.length} ${independentTasks.length === 1 ? 'ergänzende Aufgabe' : 'ergänzende Aufgaben'}`}
        </p>
        {filtered && (
          <button
            className="button secondary"
            onClick={() => {
              setQ('');
              setRole('');
            }}
          >
            Filter zurücksetzen
          </button>
        )}
      </div>
      {processes.map((process) => {
        if (!process.steps.length) return null;
        return (
          <section key={process.id} aria-labelledby={'task-process-' + process.id}>
            <h2 id={'task-process-' + process.id}>{process.title}</h2>
            <p className="task-note">
              Die Nummern entsprechen dem Prozess. Vorhandenes Material deckt einen Schritt nicht
              automatisch vollständig ab.
            </p>
            {[...new Set(process.steps.map((step) => step.phase))].map((phase, index) => {
              const steps = process.steps.filter((step) => step.phase === phase);
              return (
                <details
                  className="task-phase"
                  key={JSON.stringify([process.id, phase, q, role])}
                  open={filtered || index === 0}
                >
                  <summary>
                    {phase}
                    <span className="task-phase-count">
                      {steps.length} {steps.length === 1 ? 'Schritt' : 'Schritte'}
                    </span>
                  </summary>
                  <ul className="task-list">
                    {steps.map((step) => (
                      <li key={step.id}>
                        <a className="task-step-link" href={'#/schritt/' + step.id}>
                          <span className="task-number">{step.number}</span>
                          <span>
                            <strong>{step.title}</strong>
                            <span className="task-meta">
                              {step.roleIds.map((id) => roleLabel(id)).join(' · ') ||
                                'Keine Rolle belegt'}
                              {' · '}
                              {step.materials.length
                                ? 'Center-Material vorhanden'
                                : 'Noch kein Center-Material'}
                            </span>
                          </span>
                          <ArrowRight size={18} aria-hidden="true" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </details>
              );
            })}
          </section>
        );
      })}
      {independentTasks.length > 0 && (
        <section aria-labelledby="independent-tasks-title">
          <h2 id="independent-tasks-title">Ergänzende Aufgaben</h2>
          <p className="task-note">Diese Aufgaben sind keinem Prozessschritt zugeordnet.</p>
          <ul className="task-list">
            {independentTasks.map((task) => (
              <li key={task.id}>
                <a className="task-independent-link" href={'#/aufgabe/' + task.id}>
                  <span>
                    <strong>{task.title}</strong>
                    <span className="task-meta">{task.summary}</span>
                  </span>
                  <ArrowRight size={18} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
      {!stepCount && !independentTasks.length && (
        <p>Keine passende Aufgabe gefunden. Ändern Sie den Suchbegriff oder die Rolle.</p>
      )}
    </div>
  );
}
export function WorkPage({
  id,
  kind,
  params,
}: {
  id: string;
  kind: 'step' | 'task' | 'topic';
  params?: URLSearchParams;
}) {
  const entity =
    kind === 'step'
      ? getStep(id)
      : kind === 'task'
        ? getTask(id)
        : content.topics.find((t) => t.id === id);
  if (!entity)
    return (
      <>
        <h1>Aufgabe nicht gefunden</h1>
        <a href="#/aufgaben">Aufgaben öffnen</a>
      </>
    );
  const process =
    kind === 'step' ? content.processes.find((p) => p.steps.some((s) => s.id === id)) : undefined;
  const processView = params?.get('ansicht') === 'liste' ? 'liste' : 'karte';
  const details = getWorkDetails(entity);
  const guides = [
    ...new Map(
      resolveMaterials(details.materials)
        .filter((material) => material.material.kind === 'guide' && material.releaseValid)
        .flatMap((material) =>
          material.procedures.map(
            (procedure) => [procedure.id, { ...material, procedure }] as const,
          ),
        ),
    ).values(),
  ];
  const backlinks = getOrientationBacklinks(entity.id);
  return (
    <div className="work-page">
      <div className="work-navigation">
        {process ? (
          <a className="text-link" href={processHref(process.id, processView)}>
            ← Zurück zur {processView === 'liste' ? 'Prozessliste' : 'Prozesslandkarte'}
          </a>
        ) : null}
        <a className="text-link" href="#/aufgaben">
          ← Aufgaben
        </a>
      </div>
      <PageTitle
        eyebrow={kind === 'step' ? 'Prozessschritt' : 'Wissen zur Aufgabe'}
        title={('number' in entity ? entity.number + ' ' : '') + entity.title}
        description={'summary' in entity ? entity.summary : (entity.description ?? '')}
      />
      <div className="work-layout">
        <div className="work-main">
          {guides.length > 0 ? (
            <div className="materials">
              {guides.map(({ procedure, article, material }) => (
                <div key={procedure.id}>
                  <p className="small work-guide-status">
                    {statusLabels[article.status]} · Geltung:{' '}
                    {material.releaseIds
                      .map((releaseId) => content.releases.find((r) => r.id === releaseId)!.title)
                      .join('; ')}
                  </p>
                  <ProcedureView
                    procedure={procedure}
                    compact
                    outcome={'output' in entity && guides.length === 1 ? entity.output : undefined}
                  />
                </div>
              ))}
            </div>
          ) : (
            <>
              {'input' in entity && (
                <section>
                  <h2>Voraussetzungen</h2>
                  <p>{entity.input}</p>
                  <h2>Ergebnis</h2>
                  <p>{entity.output}</p>
                </section>
              )}
              <Sections sections={details.sections.filter((section) => !section.purpose)} />
              <Materials materials={details.materials} includeContent />
            </>
          )}
        </div>
        <aside className="work-aside" aria-label="Ergänzende Informationen">
          <h2>Ergänzende Informationen</h2>
          {details.openPoints.length > 0 && (
            <details className="work-open-points" key={entity.id + '-open-points'}>
              <summary>Offene Punkte ({details.openPoints.length})</summary>
              <OpenPoints points={details.openPoints} title="Offene Klärungen vor Anwendung" />
            </details>
          )}
          <details key={entity.id + '-context'}>
            <summary>Fachliche Hinweise und Kontext</summary>
            {'roleIds' in entity && (
              <p>
                Verantwortung:{' '}
                {entity.roleIds.map((id) => roleLabel(id)).join(' · ') || 'Nicht festgelegt'}
              </p>
            )}
            {guides.length > 0 && 'input' in entity && <p>Eingang: {entity.input}</p>}
            {guides.length > 1 && 'output' in entity && <p>Ergebnis: {entity.output}</p>}
            {details.summaries.map((summary) => (
              <p key={summary}>{summary}</p>
            ))}
            {guides.length > 0 && (
              <div className="work-details">
                <Sections sections={details.sections.filter((section) => !section.purpose)} />
              </div>
            )}
            <Sections sections={details.sections.filter((section) => section.purpose)} />
            {backlinks.length > 0 && (
              <section>
                <h2>Einordnung in der Landkarte</h2>
                <ul>
                  {backlinks.map(({ node, basis }, i) => (
                    <li key={i}>
                      <a href={orientationHref(node.id)}>{orientationTitle(node)}</a>
                      <p className="small muted">{basis}</p>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            <Relationships
              relationships={details.relationships}
              context={kind === 'topic' ? 'topic' : 'task'}
            />
          </details>
          {guides.length > 0 && (
            <details className="work-readings" key={entity.id + '-readings'}>
              <summary>Beiträge und weitere Informationen</summary>
              <Materials materials={details.materials} includeContent />
            </details>
          )}
          <Sources
            key={entity.id + '-sources'}
            refs={details.sourceRefs}
            note={details.sourceNote}
          />
        </aside>
      </div>
    </div>
  );
}
export function ProcedurePage({ id }: { id: string }) {
  const p = getProcedure(id);
  if (!p)
    return (
      <>
        <h1>Bedienweg nicht gefunden</h1>
        <a href="#/aufgaben">Aufgaben öffnen</a>
      </>
    );
  const a = content.articles.find((a) => a.procedureIds?.includes(id));
  return (
    <>
      <PageTitle eyebrow="Bedienweg" title={p.title} description={p.trigger} />
      {a && (
        <>
          <a className="text-link" href={'#/artikel/' + a.id}>
            Gesamten Beitrag und Geltungsbereich lesen
          </a>
          <OpenPoints points={getArticleOpenPoints(a)} title="Offene Klärungen vor Anwendung" />
        </>
      )}
      <ProcedureView procedure={p} />
      <Sources refs={p.sourceRefs} note={p.sourceNote} />
    </>
  );
}
export const allSteps = getProcessSteps;
