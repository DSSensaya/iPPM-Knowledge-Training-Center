import { ArrowRight, BookOpen, GraduationCap, Network } from 'lucide-react';
import { articles, learningPaths, recommendedArticleIds, topics } from '../data/content';
import type { Progress } from '../lib/storage';
import { ArticleCard, ProgressBar, SearchForm } from '../components/ui';

export default function Home({
  progress,
  toggleSave,
}: {
  progress: Progress;
  toggleSave: (id: string) => void;
}) {
  const path = learningPaths.find((p) => !progress.passed.includes(p.id)) || learningPaths[0];
  const done = path.lessons.filter((id) => progress.read.includes(id)).length;
  const percent =
    ((done + (progress.passed.includes(path.id) ? 1 : 0)) / (path.lessons.length + 1)) * 100;
  return (
    <>
      <section className="home-intro">
        <div>
          <span className="eyebrow">Ihr Wissen. Ihr nächster Schritt.</span>
          <h1>
            iPPM verstehen.
            <br />
            Projekte weiterbringen.
          </h1>
          <p>
            Wissen, das im Arbeitsalltag hilft. Finden Sie Antworten,
            <br className="desktop-break" /> verstehen Sie Zusammenhänge und lernen Sie gezielt
            weiter.
          </p>
        </div>
        <div className="intro-note">
          <span className="eyebrow">Knowledge & Training Center</span>
          <p>
            Ein gemeinsamer Ort für
            <br />
            <strong>Projektwissen bei TKMS ATLAS.</strong>
          </p>
          <div className="intro-facts">
            <span>
              <strong>{articles.length.toString().padStart(2, '0')}</strong>Wissensbeiträge
            </span>
            <span>
              <strong>03</strong>Lernpfade
            </span>
          </div>
        </div>
      </section>
      <section className="search-zone" aria-label="Wissen finden">
        <SearchForm large />
        <div className="quick-search">
          <span>Häufig gesucht</span>
          {['Zugriffsrechte', 'Statusbericht', 'Ressourcen', 'Meilensteine'].map((q) => (
            <a key={q} href={`#/wissen?q=${encodeURIComponent(q)}`}>
              {q}
              <ArrowRight size={14} aria-hidden="true" />
            </a>
          ))}
        </div>
      </section>
      <section className="entry-grid" aria-label="Direkt einsteigen">
        <a href="#/wissen">
          <BookOpen size={23} aria-hidden="true" />
          <div>
            <h2>Wissen nachschlagen</h2>
            <p>Anleitungen und Antworten finden</p>
          </div>
          <ArrowRight size={20} aria-hidden="true" />
        </a>
        <a href="#/lernpfade">
          <GraduationCap size={25} aria-hidden="true" />
          <div>
            <h2>Schritt für Schritt lernen</h2>
            <p>Mit einem Lernpfad sicher starten</p>
          </div>
          <ArrowRight size={20} aria-hidden="true" />
        </a>
        <a href="#/prozesse">
          <Network size={23} aria-hidden="true" />
          <div>
            <h2>Zusammenhänge verstehen</h2>
            <p>Abläufe und Verantwortungen erkunden</p>
          </div>
          <ArrowRight size={20} aria-hidden="true" />
        </a>
      </section>
      <section className="home-lower">
        <div className="recommended">
          <div className="section-title">
            <div>
              <span className="eyebrow">Für Ihren Arbeitsalltag</span>
              <h2>Gut zu wissen</h2>
            </div>
            <a className="text-link" href="#/wissen">
              Alle Beiträge <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
          <div className="cards two">
            {recommendedArticleIds.map((id) => {
              const article = articles.find((a) => a.id === id)!;
              return (
                <ArticleCard
                  key={id}
                  article={article}
                  saved={progress.bookmarks.includes(id)}
                  onSave={() => toggleSave(id)}
                />
              );
            })}
          </div>
        </div>
        <aside className="learning-feature">
          <span className="eyebrow">
            {percent > 0 ? 'Ihr nächster Lernschritt' : 'Neu in iPPM?'}
          </span>
          <h2>{path.title}</h2>
          <p>{path.summary}</p>
          <div className="feature-meta">
            3 Lektionen <span>·</span>{' '}
            {path.lessons.reduce((sum, id) => sum + articles.find((a) => a.id === id)!.minutes, 0)}{' '}
            Min. <span>·</span> {path.level}
          </div>
          <ProgressBar value={percent} label={`${done} von 3 Lektionen gelesen`} />
          <a href={`#/lernpfade/${path.id}`} className="button dark-primary">
            {percent > 0 ? 'Weiterlernen' : 'Lernpfad starten'}
            <ArrowRight size={17} aria-hidden="true" />
          </a>
        </aside>
      </section>
      <section className="topic-section">
        <div className="section-title">
          <div>
            <span className="eyebrow">Orientierung im Themenfeld</span>
            <h2>Ihr Thema im Fokus</h2>
          </div>
        </div>
        <div className="topic-grid">
          {topics.map((topic, i) => (
            <a href={`#/wissen?thema=${encodeURIComponent(topic)}`} key={topic}>
              <span className="topic-number">0{i + 1}</span>
              <h3>{topic}</h3>
              <span>
                {articles.filter((a) => a.topic === topic).length}{' '}
                {articles.filter((a) => a.topic === topic).length === 1 ? 'Beitrag' : 'Beiträge'}{' '}
                <ArrowRight size={16} aria-hidden="true" />
              </span>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
