import { test, expect } from '@playwright/test';
import { ArticleCard } from '../src/components/ui';
import { articles } from '../src/data/content';
import type { Article } from '../src/data/types';

test('article card labels demo, source draft and reviewed from explicit status', () => {
  const demo = articles.find((article) => article.status === 'demo')!;
  const draft = articles.find((article) => article.status === 'source-draft')!;
  if (draft.status !== 'source-draft') throw new Error('Quellenentwurf fehlt');

  // Only the status differs, so the reviewed case catches knowledge-based labeling.
  const reviewed: Article = { ...draft, status: 'reviewed' };
  const label = (article: Article) => {
    const card = ArticleCard({ article, saved: false, onSave: () => {} }) as unknown as {
      props: { children: { type: string; props: { className?: string; children?: string } }[] };
    };
    return card.props.children.find(
      (child) => child.type === 'p' && child.props.className === 'small muted',
    )?.props.children;
  };

  expect(label(demo)).toBe('Demonstrationsinhalt');
  expect(label(draft)).toBe('Quellenbasierter Entwurf · Einschränkungen beachten');
  expect(label(reviewed)).toBe('Fachlich geprüfter Inhalt');
});
