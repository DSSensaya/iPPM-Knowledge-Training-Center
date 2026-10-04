import { content } from '../content';
import type { ContentStore } from '../content/types';
import { getInventory, roleLabel } from './queries';
const normalize = (text: string) =>
  text
    .toLocaleLowerCase('de')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replaceAll('ß', 'ss');
function strings(value: unknown): string {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map(strings).join(' ');
  if (value && typeof value === 'object') return Object.values(value).map(strings).join(' ');
  return '';
}
/** One index derived from canonical objects, used for tasks, roles and knowledge. */
export function searchContent(
  query: string,
  filters: { roleId?: string; systemId?: string; kind?: string } = {},
  store: ContentStore = content,
) {
  const terms = normalize(query.trim()).split(/\s+/).filter(Boolean);
  return getInventory(store)
    .filter(
      (e) =>
        (!filters.kind || e.kind === filters.kind) &&
        (!filters.roleId || e.roleIds.includes(filters.roleId)) &&
        (!filters.systemId || e.systemIds.includes(filters.systemId)),
    )
    .map((entry) => {
      const article = store.articles.find((a) => a.id === entry.id);
      const procedure = store.procedures.find((p) => p.id === entry.id);
      const step = store.processes.flatMap((p) => p.steps).find((s) => s.id === entry.id);
      const task = store.tasks.find((t) => t.id === entry.id);
      const blocks = step?.trainingBlockIds ?? task?.trainingBlockIds ?? [];
      const context = blocks.flatMap((id) => {
        const b = store.trainingBlocks.find((b) => b.id === id)!;
        return [b.code, store.releases.find((r) => r.id === b.releaseId)!.code];
      });
      const full = normalize(
        strings([
          entry,
          article,
          procedure,
          task,
          context,
          entry.roleIds.map((id) => roleLabel(id, store)),
        ]),
      );
      const title = normalize(entry.title),
        summary = normalize(entry.summary);
      const score = terms.every((t) => full.includes(t))
        ? terms.reduce((n, t) => n + (title.includes(t) ? 4 : summary.includes(t) ? 2 : 1), 0)
        : -1;
      return { entry, score };
    })
    .filter((r) => r.score >= 0)
    .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title, 'de'))
    .map((r) => r.entry);
}
