import { content } from '../content';
import {
  getProcessSteps,
  getStep,
  getTask,
  getProcedure,
  getOpenPoints,
  getWorkMaterials,
  getArticleOpenPoints,
  roleLabel,
} from '../lib/queries';
import { searchContent } from '../lib/search';
import { PageTitle, SearchForm } from '../components/ui';
import {
  Materials,
  OpenPoints,
  ProcedureView,
  Sections,
  Sources,
  Relationships,
} from '../components/Content';
import { useState } from 'react';
export default function Tasks() {
  const [q, setQ] = useState(''),
    [role, setRole] = useState('');
  const results = searchContent(q, { roleId: role }).filter(
    (e) => e.kind === 'step' || e.kind === 'task',
  );
  return (
    <>
      <PageTitle
        eyebrow="Ihre Arbeit in iPPM"
        title="Aufgaben"
        description="Finden Sie Ihre Aufgabe und den passenden Bedienweg. Noch offene Schritte bleiben als Orientierung erkennbar."
      />
      <SearchForm large />
      <div className="filters">
        <label>
          Aufgaben filtern
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} />
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
      </div>
      <p>{results.length} Aufgaben und Prozessschritte</p>
      <ul className="result-list">
        {results.map((e) => (
          <li key={e.id}>
            <h2>
              <a href={e.href}>
                {e.kind === 'step' ? getStep(e.id)!.number + ' ' : ''}
                {e.title}
              </a>
            </h2>
            <p>{e.summary}</p>
            <p className="small muted">
              {e.roleIds.map((id) => roleLabel(id)).join(' · ')}
              {!e.articleIds.length ? ' · Noch kein Center-Material' : ''}
            </p>
          </li>
        ))}
      </ul>
      {!results.length && <p role="status">Keine passende Aufgabe gefunden.</p>}
    </>
  );
}
export function WorkPage({ id, kind }: { id: string; kind: 'step' | 'task' | 'topic' }) {
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
  const tasks =
    'taskIds' in entity ? content.tasks.filter((t) => entity.taskIds?.includes(t.id)) : [];
  return (
    <>
      <a className="text-link" href="#/aufgaben">
        ← Aufgaben
      </a>
      <PageTitle
        eyebrow={kind === 'step' ? 'Prozessschritt' : 'Wissen zur Aufgabe'}
        title={('number' in entity ? entity.number + ' ' : '') + entity.title}
        description={'summary' in entity ? entity.summary : (entity.description ?? '')}
      />
      {'roleIds' in entity && (
        <p>
          Verantwortung:{' '}
          {entity.roleIds.map((id) => roleLabel(id)).join(' · ') || 'Nicht festgelegt'}
        </p>
      )}
      {'input' in entity && (
        <section>
          <h2>Eingang</h2>
          <p>{entity.input}</p>
          <h2>Ergebnis</h2>
          <p>{entity.output}</p>
        </section>
      )}
      <OpenPoints
        points={[...new Set([...getOpenPoints(entity), ...tasks.flatMap((t) => getOpenPoints(t))])]}
      />
      <Materials materials={getWorkMaterials(entity)} />
      {'content' in entity && entity.content && <Sections sections={entity.content} />}
      <Sources refs={entity.sourceRefs} note={entity.sourceNote} />
      {tasks.length > 0 && (
        <section>
          <h2>Fachliche Aufgaben</h2>
          <ul>
            {tasks.map((t) => (
              <li key={t.id}>
                <a href={'#/aufgabe/' + t.id}>{t.title}</a>
              </li>
            ))}
          </ul>
        </section>
      )}
      {'relationships' in entity && (
        <Relationships
          relationships={entity.relationships}
          context={kind === 'topic' ? 'topic' : 'task'}
        />
      )}
    </>
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
          <OpenPoints points={getArticleOpenPoints(a)} />
        </>
      )}
      <ProcedureView procedure={p} />
      <Sources refs={p.sourceRefs} note={p.sourceNote} />
    </>
  );
}
export const allSteps = getProcessSteps;
