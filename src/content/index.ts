import type { ContentStore } from './types';
import { validateContent } from './validation';
import roles from './roles.json';
import systems from './systems.json';
import releases from './releases.json';
import trainingBlocks from './training-blocks.json';
import processes from './processes.json';
import tasks from './tasks.json';
import topics from './topics.json';
import sources from './sources.json';
import procedures from './procedures.json';
import openPoints from './open-points.json';
import help from './help.json';
const articleFiles = import.meta.glob('./articles/*.json', { eager: true, import: 'default' });
const initial: unknown = {
  roles,
  systems,
  releases,
  trainingBlocks,
  processes,
  tasks,
  topics,
  sources,
  procedures,
  openPoints,
  help,
  articles: Object.values(articleFiles),
};
validateContent(initial);
export const content: ContentStore = initial;

/** Explicit replacement after an editor load/save; queries always read this store. */
export function replaceContent(next: unknown) {
  validateContent(next);
  Object.assign(content, next);
}
