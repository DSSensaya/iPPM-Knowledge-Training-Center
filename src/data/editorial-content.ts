// Complete server/build registry; importing it also applies the journal to reader data.
import './content';
import './catalog';
import './inventory';
import './content-readiness';
import './sb1-coverage';
import './editorial-notes';
import { editorialObjects, validateRegistry } from '../lib/editorial-registry';
validateRegistry();
export { editorialObjects };

import { visibleArticles } from './content';
import { processViews } from './catalog';
for (const view of processViews.filter((item) => !['access', 'milestones'].includes(item.id))) {
  const article = visibleArticles.find((item) => item.id === view.articleId)!;
  Object.defineProperty(view, 'title', { get: () => 'SB1: ' + article.title, enumerable: true });
  Object.defineProperty(view, 'description', { get: () => article.summary, enumerable: true });
}
