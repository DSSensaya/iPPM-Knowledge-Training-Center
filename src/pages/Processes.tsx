import { content } from '../content';
import { PageTitle } from '../components/ui';
import { roleLabel } from '../lib/queries';
export default function Processes({ id }: { id?: string }) {
  const processes = id ? content.processes.filter((p) => p.id === id) : content.processes;
  return (
    <>
      <PageTitle
        eyebrow="Zusammenhänge verstehen"
        title="Prozesse"
        description="Der vollständige vorhandene Prozessbestand. Material zu einzelnen Schritten bedeutet keine vollständige Prozessabdeckung."
      />
      {!processes.length && <p>Prozess nicht gefunden.</p>}
      {processes.map((p) => (
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
