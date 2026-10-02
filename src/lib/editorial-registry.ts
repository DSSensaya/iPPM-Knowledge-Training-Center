import saved from '../data/local-editorial.json' with { type: 'json' };
import { applyJournal, editableArticleId } from './editorial';
import type { EditorialJournal } from './editorial';
import type { Article } from '../data/types';

export interface RepositoryJournal {
  version: 2;
  journals: Record<string, EditorialJournal>;
}
export function migrateJournal(input: unknown): RepositoryJournal {
  const value = input as RepositoryJournal | EditorialJournal;
  if (value?.version === 1)
    return { version: 2, journals: { [editableArticleId]: input as EditorialJournal } };
  if (
    !value ||
    value.version !== 2 ||
    Object.keys(value).sort().join('|') !== 'journals|version' ||
    !value.journals ||
    Array.isArray(value.journals)
  )
    throw new Error('Ungültiges Repository-Journal.');
  return value;
}
const journal = migrateJournal(saved);
export const editorialObjects = new Map<
  string,
  { baseline: Article; article: Article; fields?: string[]; source: string }
>();
export function registerArticle(article: Article, source = 'src/data/content.ts'): Article {
  if (editorialObjects.has(article.id)) throw new Error(`Doppeltes Ursprungsobjekt: ${article.id}`);
  const baseline = structuredClone(article);
  const entry = journal.journals[article.id];
  const result = entry ? applyJournal(baseline, entry) : article;
  editorialObjects.set(article.id, { baseline, article: result, source });
  return result;
}

type Path = (string | number)[];
const setters = new Map<string, (article: Article) => void>();
const origins = new WeakMap<object, string>();
export function originOf(value: object) {
  return origins.get(value);
}
export function shareOrigin(target: object, source: object, id: string) {
  origins.set(target, id);
  for (const key of Object.keys(source))
    Object.defineProperty(target, key, {
      configurable: true,
      enumerable: true,
      get: () => (source as Record<string, unknown>)[key],
      set: (value) => {
        (source as Record<string, unknown>)[key] = value;
      },
    });
}

// Callers explicitly allow root fields. Nested IDs and relationships are never text fields.
export function registerObject<T extends object>(
  id: string,
  target: T,
  fields: string[],
  source: string,
): T {
  const paths: Path[] = [];
  const walk = (value: unknown, path: Path) => {
    if (typeof value === 'string') paths.push(path);
    else if (Array.isArray(value)) value.forEach((item, i) => walk(item, [...path, i]));
    else if (value && typeof value === 'object')
      Object.entries(value).forEach(([key, item]) => {
        if (!['id', 'procedureId', 'article', 'articleId', 'evidence', 'sourceId'].includes(key))
          walk(item, [...path, key]);
      });
  };
  fields.forEach((key) => walk((target as Record<string, unknown>)[key], [key]));
  if (!paths.length) return target;
  const get = (path: Path) =>
    path.reduce<unknown>((value, key) => (value as Record<string, unknown>)[key], target) as string;
  const extra = Object.fromEntries(paths.map((path) => [path.join(' / '), get(path)]));
  const baseline: Article = {
    id,
    title: id,
    summary: source,
    takeaway: id,
    extra,
    sections: [],
    topic: 'Grundlagen',
    roles: [],
    kind: 'Grundlagen',
    minutes: 0,
    updated: '2026-10-01',
    related: [],
    status: 'source-draft',
    knowledge: {
      functionIds: [],
      stepIds: [],
      issueIds: [],
      evidence: [],
      procedures: [],
      trainer: { objective: '', preparation: [], exercise: '', expectedResult: '', limitation: '' },
    },
    revisions: [{ number: 0, date: '2026-10-01', note: 'Ausgangsobjekt', sources: [] }],
    reviews: [],
  };
  const article = registerArticle(baseline, source);
  editorialObjects.get(id)!.fields = Object.keys(extra);
  const update = (value: Article) =>
    paths.forEach((path) => {
      const parent = path
        .slice(0, -1)
        .reduce<unknown>((item, key) => (item as Record<string, unknown>)[key], target) as Record<
        string,
        unknown
      >;
      parent[path.at(-1)!] = value.extra![path.join(' / ')];
    });
  update(article);
  setters.set(id, update);
  origins.set(target, id);
  return target;
}
export function validateRegistry() {
  for (const id of Object.keys(journal.journals)) {
    if (!editorialObjects.has(id)) throw new Error(`Journal für nicht zugelassenes Objekt: ${id}`);
  }
}
export function hydrateEditorialObjects(values: { id: string; article: Article }[]) {
  function copy(target: Record<string, unknown>, source: Record<string, unknown>) {
    for (const key of Object.keys(target)) if (!(key in source)) delete target[key];
    for (const [key, value] of Object.entries(source)) {
      if (value && typeof value === 'object' && target[key] && typeof target[key] === 'object')
        copy(target[key] as Record<string, unknown>, value as Record<string, unknown>);
      else target[key] = structuredClone(value);
    }
  }
  for (const { id, article } of values) {
    const entry = editorialObjects.get(id);
    if (!entry) throw new Error(`Unbekanntes Inhaltsobjekt: ${id}. Editor neu bauen.`);
    copy(
      entry.article as unknown as Record<string, unknown>,
      article as unknown as Record<string, unknown>,
    );
    setters.get(id)?.(article);
  }
}
