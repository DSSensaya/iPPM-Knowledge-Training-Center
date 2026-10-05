import { readdir, readFile, realpath, lstat } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { validateContent } from '../src/content/validation';
import type { ContentStore } from '../src/content/types';

export const collectionFiles: Record<string, keyof ContentStore> = {
  orientation: 'orientation',
  roles: 'roles',
  systems: 'systems',
  releases: 'releases',
  'training-blocks': 'trainingBlocks',
  processes: 'processes',
  tasks: 'tasks',
  topics: 'topics',
  sources: 'sources',
  procedures: 'procedures',
  'open-points': 'openPoints',
  help: 'help',
};
export async function contentFiles(root: string) {
  const canonicalRoot = await realpath(root),
    dir = resolve(root, 'src/content');
  if (
    (await realpath(dir)) !== join(canonicalRoot, 'src/content') ||
    (await realpath(join(dir, 'articles'))) !== join(canonicalRoot, 'src/content/articles')
  )
    throw new Error('Umgeleitete Inhaltsverzeichnisse sind nicht zulässig.');
  const files = new Map<string, string>(
    Object.keys(collectionFiles).map((k) => [k, join(dir, k + '.json')]),
  );
  for (const name of (await readdir(join(dir, 'articles'))).sort()) {
    if (/\.json\.[a-f0-9]{16}\.tmp$/.test(name)) continue;
    if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]*\.json$/.test(name))
      throw new Error('Ungültige Artikeldatei.');
    files.set('article~' + name.replace(/\.json$/, ''), join(dir, 'articles', name));
  }
  for (const path of files.values())
    if ((await lstat(path)).isSymbolicLink() || (await realpath(path)) !== path)
      throw new Error('Umgeleitete Inhaltsdateien sind nicht zulässig.');
  return files;
}
export async function loadContent(root: string): Promise<ContentStore> {
  const files = await contentFiles(root),
    result: Record<string, unknown> = { articles: [] };
  for (const [key, path] of files) {
    const value: unknown = JSON.parse(await readFile(path, 'utf8'));
    if (key.startsWith('article~')) {
      if ((value as { id?: string })?.id !== key.substring(8))
        throw new Error('Artikel-ID muss dem Dateinamen entsprechen.');
      (result.articles as unknown[]).push(value);
    } else result[collectionFiles[key]] = value;
  }
  validateContent(result);
  return result;
}
