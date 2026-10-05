import { ArrowLeft, ArrowRight, BookOpen, Network } from 'lucide-react';
import { content } from '../content';
import { getRoleView, statusLabels } from '../lib/queries';
import { PageTitle } from '../components/ui';

export default function Roles({ id, params }: { id?: string; params: URLSearchParams }) {
  if (!id)
    return (
      <>
        <PageTitle
          eyebrow="Ihre Rolle verstehen"
          title="Rollen"
          description="Wählen Sie Ihre Rolle und finden Sie direkt die zugeordneten Prozessschritte und Beiträge."
        />
        <ul className="cards role-cards" aria-label="Rolle auswählen">
          {content.roles.map((role) => {
            const view = getRoleView(role.id);
            return (
              <li key={role.id}>
                <a
                  className="home-card role-card"
                  href={'#/rollen/' + role.id}
                  aria-labelledby={'role-' + role.id}
                >
                  <h2 id={'role-' + role.id}>{role.label}</h2>
                  <p>{role.responsibility}</p>
                  <span className="role-card-meta">
                    <span>
                      {view.steps.length}{' '}
                      {view.steps.length === 1 ? 'Prozessschritt' : 'Prozessschritte'}
                    </span>
                    <span>
                      {view.articles.length} {view.articles.length === 1 ? 'Beitrag' : 'Beiträge'}
                    </span>
                  </span>
                  <span className="home-card-action">
                    Rolle ansehen
                    <ArrowRight size={18} aria-hidden="true" />
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
        <p className="role-note">Eine Rolle allein verleiht keine technischen Zugriffsrechte.</p>
      </>
    );

  const view = getRoleView(id);
  const role = view.role;
  const showKnowledge = params.get('bereich') === 'wissen';
  if (!role)
    return (
      <>
        <PageTitle
          eyebrow="Rollen"
          title="Rolle nicht gefunden"
          description="Diese Rolle ist im Knowledge Center nicht vorhanden. Wählen Sie eine Rolle aus der Übersicht."
        />
        <a className="button secondary" href="#/rollen">
          <ArrowLeft size={16} aria-hidden="true" />
          Alle Rollen
        </a>
      </>
    );

  const selectContent = (knowledge: boolean) => {
    const next = new URLSearchParams(params);
    if (knowledge) next.set('bereich', 'wissen');
    else next.delete('bereich');
    window.location.hash = '/rollen/' + role.id + (next.size ? '?' + next : '');
  };

  return (
    <div className="role-detail">
      <div className="role-navigation">
        <a className="role-back" href="#/rollen">
          <ArrowLeft size={16} aria-hidden="true" />
          Alle Rollen
        </a>
        <nav className="role-switcher" aria-label="Rolle wechseln">
          {content.roles.map((r) => (
            <a
              key={r.id}
              href={'#/rollen/' + r.id}
              aria-label={r.label}
              aria-current={r.id === role.id ? 'page' : undefined}
            >
              {r.aliases?.[0] ?? r.label}
            </a>
          ))}
        </nav>
      </div>
      <PageTitle eyebrow="Rollenprofil" title={role.label} description={role.responsibility} />
      <p className="role-note">Eine Rolle allein verleiht keine technischen Zugriffsrechte.</p>
      <div className="role-content-switch" role="group" aria-label="Inhalte für Ihre Rolle">
        <button aria-pressed={!showKnowledge} onClick={() => selectContent(false)}>
          <Network size={18} aria-hidden="true" />
          Prozessschritte ({view.steps.length})
        </button>
        <button aria-pressed={showKnowledge} onClick={() => selectContent(true)}>
          <BookOpen size={18} aria-hidden="true" />
          Wissen ({view.articles.length})
        </button>
      </div>
      {showKnowledge ? (
        <section aria-labelledby="role-knowledge-title">
          <h2 id="role-knowledge-title">Wissen für Ihre Rolle</h2>
          <ul className="role-link-list">
            {view.articles.map((article) => (
              <li key={article.id}>
                <a href={'#/artikel/' + article.id}>
                  <span>
                    <strong>{article.title}</strong>
                    <span className="role-link-meta">{statusLabels[article.status]}</span>
                  </span>
                  <ArrowRight size={18} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
          {!view.articles.length && <p>Für diese Rolle sind noch keine Beiträge zugeordnet.</p>}
        </section>
      ) : (
        <section aria-labelledby="role-steps-title">
          <h2 id="role-steps-title">Prozessschritte in Ihrer Verantwortung</h2>
          <p className="role-section-intro">
            Wählen Sie einen Schritt nach Phase. Eine Zuordnung belegt keinen vollständigen
            Bedienweg.
          </p>
          {content.processes.map((process) => {
            const steps = view.steps.filter((s) => process.steps.some((p) => p.id === s.id));
            if (!steps.length) return null;
            return (
              <section className="role-process" key={process.id}>
                <h3>
                  <a href={'#/prozesse/' + process.id}>{process.title}</a>
                </h3>
                {[...new Set(steps.map((s) => s.phase))].map((phase, index) => {
                  const phaseSteps = steps.filter((s) => s.phase === phase);
                  return (
                    <details
                      className="role-phase"
                      key={role.id + '-' + process.id + '-' + phase}
                      open={index === 0}
                    >
                      <summary>
                        {phase}
                        <span className="role-phase-count">
                          {phaseSteps.length} {phaseSteps.length === 1 ? 'Schritt' : 'Schritte'}
                        </span>
                      </summary>
                      <ul className="role-link-list">
                        {phaseSteps.map((step) => (
                          <li key={step.id}>
                            <a href={'#/schritt/' + step.id}>
                              <span>
                                <span className="role-step-number">{step.number}</span>
                                {step.title}
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
          {!view.steps.length && <p>Für diese Rolle sind noch keine Prozessschritte zugeordnet.</p>}
        </section>
      )}
    </div>
  );
}
