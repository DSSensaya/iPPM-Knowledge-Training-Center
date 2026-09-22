import { ArrowRight, Bookmark, Check, Clock3, Search } from 'lucide-react';
import { useState } from 'react';
import type { Article } from '../data/types';

const articleStatusLabels: Record<Article['status'], string> = {
  demo: 'Demonstrationsinhalt',
  'source-draft': 'Quellenbasierter Entwurf · Einschränkungen beachten',
  reviewed: 'Fachlich geprüfter Inhalt',
};

export function SearchForm({
  initial = '',
  large = false,
  params,
}: {
  initial?: string;
  large?: boolean;
  params?: URLSearchParams;
}) {
  const [value, setValue] = useState(initial);
  return (
    <form
      className={`search-form ${large ? 'search-large' : ''}`}
      onSubmit={(e) => {
        e.preventDefault();
        const next = new URLSearchParams(params);
        next.set('q', value.trim());
        window.location.hash = `/wissen?${next.toString()}`;
      }}
    >
      <label htmlFor={large ? 'home-search' : 'knowledge-search'}>
        {large ? 'Was möchten Sie wissen?' : 'Wissensbasis durchsuchen'}
      </label>
      <div className="search-input">
        <Search size={20} aria-hidden="true" />
        <input
          id={large ? 'home-search' : 'knowledge-search'}
          type="search"
          placeholder="Zum Beispiel: Statusbericht erstellen"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button className="button primary" type="submit">
          Suchen <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}

export function ArticleCard({
  article,
  saved,
  onSave,
}: {
  article: Article;
  saved: boolean;
  onSave: () => void;
}) {
  return (
    <article className="article-card">
      <div className="card-top">
        <span className="eyebrow">{article.topic}</span>
        <button
          className={`icon-button ${saved ? 'is-saved' : ''}`}
          aria-label={`${article.title}: ${saved ? 'aus Merkliste entfernen' : 'merken'}`}
          aria-pressed={saved}
          onClick={onSave}
        >
          <Bookmark size={19} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>
      <h3>
        <a href={`#/artikel/${article.id}`}>{article.title}</a>
      </h3>
      <p>{article.summary}</p>
      <p className="small muted">{articleStatusLabels[article.status]}</p>
      <div className="card-bottom">
        <span>{article.kind}</span>
        <span>
          <Clock3 size={14} aria-hidden="true" />
          {article.minutes} Min.
        </span>
        <a
          href={`#/artikel/${article.id}`}
          className="arrow-link"
          aria-label={`${article.title} öffnen`}
        >
          <ArrowRight size={20} />
        </a>
      </div>
    </article>
  );
}

export function ProgressBar({ value, label }: { value: number; label: string }) {
  return (
    <div className="progress-wrap">
      <div className="progress-label">
        <span>{label}</span>
        <strong>{Math.round(value)} %</strong>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-label={label}
        aria-valuenow={Math.round(value)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function PageTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="page-title">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}

export function Completion({ complete }: { complete: boolean }) {
  return (
    <span className={`completion ${complete ? 'done' : ''}`}>
      {complete ? (
        <>
          <Check size={16} aria-hidden="true" />
          Abgeschlossen
        </>
      ) : (
        'Noch offen'
      )}
    </span>
  );
}
