import { ArrowRight, Bookmark, Search } from 'lucide-react';
import { useState } from 'react';
import type { Article } from '../content/types';
import { statusLabels } from '../lib/queries';
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
export function SearchForm({
  initial = '',
  large = false,
  params,
}: {
  initial?: string;
  large?: boolean;
  params?: URLSearchParams;
}) {
  const [value, setValue] = useState(initial),
    id = large ? 'task-search' : 'knowledge-search';
  return (
    <form
      className="search-form"
      onSubmit={(e) => {
        e.preventDefault();
        const next = new URLSearchParams(params);
        next.set('q', value.trim());
        window.location.hash = '/wissen?' + next;
      }}
    >
      <label htmlFor={id}>Wissen und Aufgaben durchsuchen</label>
      <div className="search-input">
        <Search size={20} aria-hidden="true" />
        <input
          id={id}
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Zum Beispiel: Owner wechseln"
        />
        <button className="button primary">
          Suchen
          <ArrowRight size={16} aria-hidden="true" />
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
        <span className="eyebrow">{article.topic ?? 'Wissen'}</span>
        <button
          className="icon-button"
          aria-label={`${article.title}: ${saved ? 'aus Merkliste entfernen' : 'merken'}`}
          aria-pressed={saved}
          onClick={onSave}
        >
          <Bookmark size={19} fill={saved ? 'currentColor' : 'none'} aria-hidden="true" />
        </button>
      </div>
      <h3>
        <a href={`#/artikel/${article.id}`}>{article.title}</a>
      </h3>
      <p>{article.summary}</p>
      <span className="status">{statusLabels[article.status]}</span>
    </article>
  );
}
