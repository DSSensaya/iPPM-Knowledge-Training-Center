import { ArrowRight, BookOpen, Network } from 'lucide-react';
import { recommendedArticleIds, topics, visibleArticles } from '../data/content';
import type { Progress } from '../lib/storage';
import { ArticleCard, SearchForm } from '../components/ui';

export default function Home({
  progress,
  toggleSave,
}: {
  progress: Progress;
  toggleSave: (id: string) => void;
}) {
  return (
    <>
      <section className="home-intro">
        <div>
          <span className="eyebrow">Ihr Wissen. Ihr nächster Schritt.</span>
          <h1>
            Ihre nächsten
            <br />
            iPPM-Aufgaben.
          </h1>
          <p>
            Wählen Sie eine der vorhandenen SB1-Aufgaben oder suchen Sie nach einer konkreten
            Antwort. Die Fachbeiträge sind quellenbasierte Entwürfe.
          </p>
        </div>
        <div className="intro-note">
          <span className="eyebrow">Knowledge & Training Center</span>
          <p>
            Lokale Arbeitshilfe mit
            <br />
            <strong>klar gekennzeichneten Inhaltsständen.</strong>
          </p>
          <div className="intro-facts">
            <span>
              <strong>
                {visibleArticles
                  .filter((article) => article.status === 'source-draft')
                  .length.toString()
                  .padStart(2, '0')}
              </strong>
              Quellenentwürfe
            </span>
          </div>
        </div>
      </section>
      <section className="search-zone" aria-label="Wissen finden">
        <SearchForm large />
        <div className="quick-search">
          <span>Häufig gesucht</span>
          {[
            'Release 2',
            'Startdatum',
            'Projektziele',
            'System Overview',
            'Zugriffsrechte',
            'Owner-Wechsel',
            'Liefergegenstände',
            'Meilensteine',
          ].map((q) => (
            <a key={q} href={`#/wissen?q=${encodeURIComponent(q)}`}>
              {q}
              <ArrowRight size={14} aria-hidden="true" />
            </a>
          ))}
        </div>
      </section>
      <section className="home-tasks" aria-labelledby="home-tasks-title">
        <div className="section-title">
          <div>
            <span className="eyebrow">SB1 · Quellenbasierte Entwürfe</span>
            <h2 id="home-tasks-title">Mit einer Aufgabe beginnen</h2>
          </div>
          <a className="text-link" href="#/wissen">
            Alle Beiträge <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
        <div className="cards two">
          {recommendedArticleIds.map((id) => {
            const article = visibleArticles.find((candidate) => candidate.id === id)!;
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
        <a href="#/prozesse">
          <Network size={23} aria-hidden="true" />
          <div>
            <h2>Zusammenhänge verstehen</h2>
            <p>Abläufe und Verantwortungen erkunden</p>
          </div>
          <ArrowRight size={20} aria-hidden="true" />
        </a>
      </section>
      <section className="topic-section">
        <div className="section-title">
          <div>
            <span className="eyebrow">Orientierung im Themenfeld</span>
            <h2>Ihr Thema im Fokus</h2>
          </div>
        </div>
        <div className="topic-grid">
          {topics
            .filter((topic) => visibleArticles.some((a) => a.topic === topic))
            .map((topic, i) => (
              <a href={`#/wissen?thema=${encodeURIComponent(topic)}`} key={topic}>
                <span className="topic-number">0{i + 1}</span>
                <h3>{topic}</h3>
                <span>
                  {visibleArticles.filter((a) => a.topic === topic).length}{' '}
                  {visibleArticles.filter((a) => a.topic === topic).length === 1
                    ? 'Beitrag'
                    : 'Beiträge'}{' '}
                  <ArrowRight size={16} aria-hidden="true" />
                </span>
              </a>
            ))}
        </div>
      </section>
    </>
  );
}
