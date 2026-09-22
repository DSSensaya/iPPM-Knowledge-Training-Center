import { useRef, useState } from 'react';
import { ArrowRight, Download, Upload } from 'lucide-react';
import { articles, learningPaths } from '../data/content';
import type { Progress } from '../lib/storage';
import { validateProgress } from '../lib/storage';
import { ArticleCard, PageTitle, ProgressBar } from '../components/ui';

export default function Personal({
  progress,
  toggleSave,
  importProgress,
}: {
  progress: Progress;
  toggleSave: (id: string) => void;
  importProgress: (data: Progress) => void;
}) {
  const [message, setMessage] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);
  const saved = articles.filter((a) => progress.bookmarks.includes(a.id));
  function exportData() {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(progress, null, 2)], { type: 'application/json' }),
    );
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `ippm-lernbereich-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage('Sicherung als JSON-Datei zum Download bereitgestellt.');
  }
  return (
    <>
      <PageTitle
        eyebrow="Persönlich. Lokal. In Ihrem Tempo."
        title="Mein Lernbereich"
        description="Gesammelte Beiträge und Fortschritt in Demo-Lernpfaden. Ohne Anmeldung, gespeichert in diesem Browser; kein Schulungsnachweis."
      />
      <div className="personal-stats">
        <div>
          <strong>
            {progress.read
              .filter((id) => articles.some((a) => a.id === id))
              .length.toString()
              .padStart(2, '0')}
          </strong>
          <span>Beiträge gelesen</span>
        </div>
        <div>
          <strong>
            {progress.passed
              .filter((id) => learningPaths.some((p) => p.id === id))
              .length.toString()
              .padStart(2, '0')}{' '}
            / 03
          </strong>
          <span>Demo-Lernpfade abgeschlossen</span>
        </div>
        <div>
          <strong>{saved.length.toString().padStart(2, '0')}</strong>
          <span>Beiträge gemerkt</span>
        </div>
      </div>
      <section>
        <div className="section-title">
          <h2>Meine Demo-Lernpfade</h2>
          <a href="#/lernpfade" className="text-link">
            Alle Demo-Lernpfade
            <ArrowRight size={16} />
          </a>
        </div>
        <div className="cards three">
          {learningPaths.map((path) => (
            <a className="personal-path" href={`#/lernpfade/${path.id}`} key={path.id}>
              <span className="eyebrow">Demo · {path.level}</span>
              <h3>{path.title}</h3>
              <ProgressBar
                value={
                  ((path.lessons.filter((id) => progress.read.includes(id)).length +
                    Number(progress.passed.includes(path.id))) /
                    4) *
                  100
                }
                label={progress.passed.includes(path.id) ? 'Abgeschlossen' : 'Ihr Fortschritt'}
              />
              <span className="text-link">
                Lernpfad öffnen
                <ArrowRight size={16} />
              </span>
            </a>
          ))}
        </div>
      </section>
      <section className="saved-section">
        <div className="section-title">
          <h2>Meine Merkliste</h2>
          <span className="muted">{saved.length} Beiträge</span>
        </div>
        {saved.length ? (
          <div className="cards three">
            {saved.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                saved
                onSave={() => toggleSave(article.id)}
              />
            ))}
          </div>
        ) : (
          <div className="empty">
            <h3>Platz für Ihr wichtigstes Wissen</h3>
            <p>Merken Sie Beiträge mit dem Lesezeichen. So finden Sie sie hier schnell wieder.</p>
            <a href="#/wissen" className="button primary">
              Wissen entdecken
              <ArrowRight size={16} />
            </a>
          </div>
        )}
      </section>
      <section className="backup">
        <div>
          <h2>Ihren Lernbereich sichern</h2>
          <p>
            Exportieren Sie Fortschritt und Merkliste, bevor Sie Browserdaten löschen oder den
            Browser wechseln. Ein Import ergänzt vorhandene Einträge.
          </p>
        </div>
        <div className="backup-actions">
          <button className="button secondary" onClick={exportData}>
            <Download size={17} />
            Sicherung exportieren
          </button>
          <button className="button secondary" onClick={() => fileInput.current?.click()}>
            <Upload size={17} />
            Sicherung importieren
          </button>
          <input
            className="sr-only"
            ref={fileInput}
            type="file"
            accept=".json,application/json"
            aria-label="Sicherungsdatei auswählen"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              try {
                if (file.size > 1_000_000) throw new Error('size');
                const data: unknown = JSON.parse(await file.text());
                if (!validateProgress(data)) throw new Error('format');
                importProgress(data);
                setMessage('Sicherung übernommen. Vorhandene Einträge wurden ergänzt.');
              } catch {
                setMessage(
                  'Import fehlgeschlagen: Bitte wählen Sie eine gültige iPPM-Sicherung (Version 1, maximal 1 MB).',
                );
              }
              e.target.value = '';
            }}
          />
        </div>
        {message && (
          <p role="status" className="backup-message">
            {message}
          </p>
        )}
      </section>
    </>
  );
}
