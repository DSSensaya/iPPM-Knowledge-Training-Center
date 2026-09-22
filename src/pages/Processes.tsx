import { ArrowRight } from 'lucide-react';
import { processes } from '../data/content';
import { PageTitle } from '../components/ui';
import { processSteps, processViews, roleLabel } from '../data/catalog';

export default function Processes() {
  return (
    <>
      <PageTitle
        eyebrow="Das Zusammenspiel verstehen"
        title="Prozesse im Überblick"
        description="Wer macht was – und welches Ergebnis wird weitergegeben? Zwei begrenzte SB1-Ausschnitte ergänzen die bisherigen Beispielabläufe."
      />
      {processViews.map((view) => (
        <section className="process-section" aria-label={view.title} key={view.id}>
          <h2>{view.title}</h2>
          <p>{view.description}</p>
          <ul className="knowledge-step-list">
            {view.stepIds.map((id) => {
              const s = processSteps.find((step) => step.id === id)!;
              return (
                <li key={s.id}>
                  <h3>
                    {s.number} {s.title}
                  </h3>
                  <p>
                    <strong>{roleLabel(s.roleId)}</strong>
                  </p>
                  <p>Voraussetzung: {s.input}</p>
                  <p>Erwartetes Ergebnis: {s.output}</p>
                  <a href={`#/artikel/${view.articleId}`}>
                    Bedienweg, Quellen und Einschränkungen zu {s.number} öffnen
                  </a>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
      <div className="demo-note">
        Beispielprozesse · Keine verbindliche Prozess- oder Freigabeordnung
      </div>
      {processes.map((process, index) => (
        <section className="process-section" key={process.id}>
          <div className="section-title">
            <div>
              <span className="eyebrow">Prozess 0{index + 1}</span>
              <h2>{process.title}</h2>
              <p className="muted">{process.summary}</p>
            </div>
          </div>
          <ol className="process-flow">
            {process.phases.map((phase, i) => (
              <li key={phase.title}>
                <div className="phase-heading">
                  <span className="eyebrow">Schritt 0{i + 1}</span>
                  <h3>{phase.title}</h3>
                </div>
                <p className="phase-role">{phase.role}</p>
                <p>{phase.description}</p>
                <div className="phase-output">
                  <span className="eyebrow">Ergebnis</span>
                  <strong>{phase.output}</strong>
                </div>
                <a className="text-link" href={`#/artikel/${phase.article}`}>
                  Anleitung öffnen
                  <ArrowRight size={16} />
                </a>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </>
  );
}
