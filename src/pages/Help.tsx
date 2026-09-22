import { ArrowRight } from 'lucide-react';
import { faqs } from '../data/content';
import { PageTitle } from '../components/ui';
export default function Help() {
  return (
    <>
      <PageTitle
        eyebrow="Orientierung & Unterstützung"
        title="Wie können wir helfen?"
        description="Antworten zur Plattform und Hinweise für den nächsten Schritt, wenn Sie in iPPM nicht weiterkommen."
      />
      <div className="help-layout">
        <section>
          <h2>Häufige Fragen</h2>
          <div className="faq-list">
            {faqs.map((faq) => (
              <details key={faq.question}>
                <summary>
                  {faq.question}
                  <span aria-hidden="true">+</span>
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
        <aside className="help-aside">
          <span className="eyebrow">Gut vorbereitet</span>
          <h2>Ein Problem in iPPM?</h2>
          <p>
            Nutzen Sie Ihren etablierten internen Supportweg. Halten Sie diese Informationen bereit:
          </p>
          <ol className="steps">
            <li>Ihre Aufgabe und der betroffene Bereich</li>
            <li>Erwartetes und beobachtetes Verhalten</li>
            <li>Schritte, Zeitpunkt und Fehlermeldung</li>
          </ol>
          <p className="small muted">
            In dieser Demo ist kein Ticketsystem angebunden. Es werden keine Anfragen versendet.
          </p>
          <a className="text-link" href="#/wissen">
            Zuerst Wissen durchsuchen
            <ArrowRight size={16} />
          </a>
        </aside>
      </div>
    </>
  );
}
