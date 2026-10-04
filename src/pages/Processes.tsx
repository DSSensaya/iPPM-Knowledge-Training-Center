import { content } from '../content';
import { PageTitle } from '../components/ui';
import { searchContent } from '../lib/search';
import { roleLabel } from '../lib/queries';
export default function Processes({ id, params }: { id?: string; params: URLSearchParams }) {
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
            {[...new Set(p.steps.map((s) => s.phase))].map((phase) => (
              <section className="phase" key={phase}>
                <h3>{phase}</h3>
                <ol className="result-list">
                  {p.steps
                    .filter((s) => s.phase === phase)
                    .map((s) => (
                      <li key={s.id}>
                        <a href={'#/schritt/' + s.id}>
                          <strong>
                            {s.number} {s.title}
                          </strong>
                        </a>
                        <p>
                          {s.roleIds.map((id) => roleLabel(id)).join(' · ') ||
                            'Verantwortung nicht festgelegt'}
                        </p>
                      </li>
                    ))}
                </ol>
              </section>
            ))}
          </section>
        ))}
    </>
  );
}
