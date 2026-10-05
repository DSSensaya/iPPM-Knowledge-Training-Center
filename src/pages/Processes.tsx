import { useEffect } from 'react';
import { ProcessSwimlane } from '../components/ProcessSwimlane';
import {
  processHref,
  stepHref,
  rememberProcessPosition,
  restoreProcessPosition,
} from '../lib/process-navigation';
import { content } from '../content';
import { PageTitle } from '../components/ui';
import { searchContent } from '../lib/search';
import { roleLabel } from '../lib/queries';
export default function Processes({ id, params }: { id?: string; params: URLSearchParams }) {
  const view = params.get('ansicht') === 'liste' ? 'liste' : 'karte';
  useEffect(() => {
    const frame = requestAnimationFrame(restoreProcessPosition);
    return () => cancelAnimationFrame(frame);
  }, [id, view]);
  const q = params.get('q') ?? '';
  const results = q ? searchContent(q) : [];
  const processes = id ? content.processes.filter((p) => p.id === id) : content.processes;
  return (
    <>
      <PageTitle
        eyebrow="Zusammenhänge verstehen"
        title="Prozesse"
        description="Der vollständige vorhandene Prozessbestand. Material zu einzelnen Schritten bedeutet keine vollständige Prozessabdeckung."
      />
      <p>
        <a className="button secondary" href="#/prozesse/releaseueberblick">
          Releaseüberblick: Funktionen, Prozesse und Systeme
        </a>
      </p>
      {q && (
        <section aria-label="Prozesssuche">
          <h2>Treffer für „{q}“</h2>
          <ul className="result-list">
            {results.map((r) => (
              <li key={r.id}>
                <a href={r.href}>{r.title}</a>
                <p>{r.summary}</p>
              </li>
            ))}
          </ul>
          {!results.length && <p role="status">Keine passenden Prozesse oder Aufgaben gefunden.</p>}
          <a href="#/prozesse">Alle Prozesse anzeigen</a>
        </section>
      )}
      {!processes.length && <p>Prozess nicht gefunden.</p>}
      {!q &&
        processes.map((p) => (
          <section key={p.id}>
            <h2>
              <a href={'#/prozesse/' + p.id}>{p.title}</a>
            </h2>
            <p>{p.description}</p>
            <div className="process-view-switch" role="group" aria-label={`Ansicht für ${p.title}`}>
              {['karte', 'liste'].map((mode) => (
                <button
                  key={mode}
                  aria-pressed={view === mode}
                  onClick={() => {
                    window.location.hash = processHref(p.id, mode).slice(1);
                  }}
                >
                  {mode === 'karte' ? 'Prozesslandkarte' : 'Liste'}
                </button>
              ))}
            </div>
            {view === 'karte' ? (
              <ProcessSwimlane process={p} store={content} />
            ) : (
              [...new Set(p.steps.map((s) => s.phase))].map((phase) => (
                <section className="phase" key={phase}>
                  <h3>{phase}</h3>
                  <ol className="result-list">
                    {p.steps
                      .filter((s) => s.phase === phase)
                      .map((s) => (
                        <li key={s.id}>
                          <a
                            id={`process-list-${s.id}`}
                            href={stepHref(s.id, p.id, 'liste')}
                            onClick={() =>
                              rememberProcessPosition(
                                processHref(p.id, 'liste'),
                                `process-list-${s.id}`,
                              )
                            }
                          >
                            <strong>
                              {s.number} {s.title}
                            </strong>
                          </a>
                          <p>
                            {s.roleIds.map((id) => roleLabel(id)).join(' · ') ||
                              'Keine Rolle belegt'}
                          </p>
                        </li>
                      ))}
                  </ol>
                </section>
              ))
            )}
          </section>
        ))}
    </>
  );
}
