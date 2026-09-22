import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Clock3, GraduationCap, LockKeyhole } from 'lucide-react';
import { articles, learningPaths } from '../data/content';
import type { Progress } from '../lib/storage';
import { Completion, PageTitle, ProgressBar } from '../components/ui';

export function Learning({ progress }: { progress: Progress }) {
  return (
    <>
      <PageTitle
        eyebrow="Lernen mit Richtung"
        title="Ein klarer Weg zu mehr Sicherheit"
        description="Kompakte Lektionen, ein konkretes Lernziel und ein Wissenscheck. Lernen Sie in Ihrem eigenen Tempo."
      />
      <div className="learning-list">
        {learningPaths.map((path, i) => {
          const read = path.lessons.filter((id) => progress.read.includes(id)).length,
            passed = progress.passed.includes(path.id);
          return (
            <article className="path-card" key={path.id}>
              <div className="path-index">
                0{i + 1}
                <GraduationCap size={28} aria-hidden="true" />
              </div>
              <div>
                <div className="path-labels">
                  <span className="eyebrow">
                    {path.level} · {path.role}
                  </span>
                  <Completion complete={passed} />
                </div>
                <h2>
                  <a href={`#/lernpfade/${path.id}`}>{path.title}</a>
                </h2>
                <p>{path.summary}</p>
                <div className="feature-meta">
                  <Clock3 size={16} />
                  {path.lessons.reduce(
                    (sum, id) => sum + articles.find((a) => a.id === id)!.minutes,
                    0,
                  )}{' '}
                  Min. Lesezeit<span>·</span>3 Lektionen + Wissenscheck
                </div>
              </div>
              <div className="path-action">
                <ProgressBar
                  value={((read + Number(passed)) / 4) * 100}
                  label={`${read} von 3 Lektionen gelesen`}
                />
                <a className="button primary" href={`#/lernpfade/${path.id}`}>
                  {passed ? 'Lernpfad ansehen' : read ? 'Weiterlernen' : 'Lernpfad starten'}
                  <ArrowRight size={17} />
                </a>
              </div>
            </article>
          );
        })}
      </div>
      <div className="quiet-note">
        <strong>Ihr Fortschritt bleibt bei Ihnen.</strong>
        <p>
          Lesemarkierungen und bestandene Wissenschecks werden in diesem Browser gespeichert. Unter
          „Mein Lernbereich“ können Sie eine Sicherung exportieren.
        </p>
      </div>
    </>
  );
}

export function LearningDetail({
  id,
  progress,
  pass,
}: {
  id: string;
  progress: Progress;
  pass: (id: string) => void;
}) {
  const [answer, setAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const path = learningPaths.find((p) => p.id === id);
  if (!path)
    return (
      <div className="empty">
        <h1>Lernpfad nicht gefunden</h1>
        <a href="#/lernpfade">Alle Lernpfade öffnen</a>
      </div>
    );
  const count = path.lessons.filter((lesson) => progress.read.includes(lesson)).length;
  const unlocked = count === path.lessons.length;
  const passed = progress.passed.includes(id);
  return (
    <>
      <a className="back-link" href="#/lernpfade">
        <ArrowLeft size={16} />
        Alle Lernpfade
      </a>
      <PageTitle
        eyebrow={`${path.level} · ${path.role}`}
        title={path.title}
        description={path.summary}
      />
      <div className="learning-detail">
        <div>
          <h2>Ihr Weg durch den Lernpfad</h2>
          <ol className="lesson-list">
            {path.lessons.map((lessonId, i) => {
              const article = articles.find((a) => a.id === lessonId)!;
              const read = progress.read.includes(lessonId);
              return (
                <li key={lessonId}>
                  <span className={`lesson-number ${read ? 'completed' : ''}`}>
                    {read ? <Check size={20} aria-label="Gelesen" /> : `0${i + 1}`}
                  </span>
                  <div>
                    <span className="eyebrow">
                      {read ? 'Gelesen' : 'Lektion'} · {article.minutes} Min.
                    </span>
                    <h3>
                      <a href={`#/artikel/${lessonId}?pfad=${id}`}>{article.title}</a>
                    </h3>
                    <p>{article.summary}</p>
                  </div>
                  <a
                    className="icon-button"
                    href={`#/artikel/${lessonId}?pfad=${id}`}
                    aria-label={`Lektion ${i + 1} öffnen`}
                  >
                    <ArrowRight size={20} />
                  </a>
                </li>
              );
            })}
          </ol>
          <section className="quiz">
            <div className="section-title">
              <h2>Wissen kurz prüfen</h2>
              {passed && <Completion complete />}
            </div>
            {!unlocked ? (
              <div className="locked">
                <LockKeyhole size={22} />
                <p>
                  Markieren Sie zunächst alle drei Lektionen als gelesen. Danach können Sie den
                  Lernpfad mit dem Wissenscheck abschließen.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (answer === null) return;
                  const correct = answer === path.correct;
                  setFeedback(correct ? 'correct' : 'incorrect');
                  if (correct) pass(id);
                }}
              >
                <fieldset>
                  <legend>{path.question}</legend>
                  {path.answers.map((option, i) => (
                    <label className={`quiz-option ${answer === i ? 'selected' : ''}`} key={option}>
                      <input
                        type="radio"
                        name="quiz"
                        value={i}
                        checked={answer === i}
                        onChange={() => {
                          setAnswer(i);
                          setFeedback(null);
                        }}
                      />
                      <span className="radio-square" aria-hidden="true">
                        {answer === i && <Check size={16} />}
                      </span>
                      <span>{option}</span>
                    </label>
                  ))}
                </fieldset>
                <button className="button primary" type="submit" disabled={answer === null}>
                  Antwort prüfen
                  <ArrowRight size={16} />
                </button>
                {feedback && (
                  <div className={`quiz-feedback ${feedback}`} role="status">
                    <strong>
                      {feedback === 'correct'
                        ? 'Richtig. Lernpfad abgeschlossen!'
                        : 'Noch nicht ganz. Versuchen Sie es erneut.'}
                    </strong>
                    <p>
                      {feedback === 'correct'
                        ? path.explanation
                        : 'Denken Sie an das gemeinsame Ziel: nachvollziehbare Daten und abgestimmte Entscheidungen. Die Lektionen helfen bei der Einordnung.'}
                    </p>
                  </div>
                )}
              </form>
            )}
          </section>
        </div>
        <aside className="learning-summary">
          <span className="eyebrow">Ihr Lernfortschritt</span>
          <h2>{passed ? 'Ziel erreicht.' : 'Schritt für Schritt.'}</h2>
          <ProgressBar
            value={((count + Number(passed)) / 4) * 100}
            label={`${count} von 3 Lektionen gelesen`}
          />
          <p>
            {passed
              ? 'Sie haben den Wissenscheck erfolgreich bearbeitet. Die Inhalte bleiben zum Nachschlagen verfügbar.'
              : 'Drei Lektionen und ein bestandener Wissenscheck ergeben 100 %.'}
          </p>
          <span className="eyebrow">Ihr Lernziel</span>
          <p>{path.summary}</p>
          <a href="#/mein-bereich" className="text-link">
            Zum Lernbereich
            <ArrowRight size={16} />
          </a>
        </aside>
      </div>
    </>
  );
}
