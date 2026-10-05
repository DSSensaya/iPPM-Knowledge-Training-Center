import { content } from '../content';
import { resolveRelationshipTarget } from '../content/relationships';
import type { ContentStore, Orientation } from '../content/types';
import { getOpenPoints } from './queries';

/** Editorial reuse only: never a process, release or training assignment. */
export function orientationContent(node: Orientation, store: ContentStore = content) {
  return node.content.map((section) => {
    if (!('referenceId' in section)) return { section };
    const article = store.articles.find((a) => a.id === section.referenceId);
    if (article) return { article, openPoints: getOpenPoints(article, store) };
    return { openPoint: store.openPoints.find((p) => p.id === section.referenceId)! };
  });
}
export function orientationSources(node: Orientation, store: ContentStore = content) {
  return node.sourceRefs?.map((ref) => {
    const match = /^([A-Z][A-Z0-9]*): (.*)$/s.exec(ref);
    const source = match && store.sources.find((s) => s.id === match[1]);
    return source
      ? `${source.title} · ${match![2]}${source.sourceNote ? ' · ' + source.sourceNote : ''}`
      : ref;
  });
}

export function orientationHref(id?: string, releaseId = '') {
  const params = new URLSearchParams();
  if (releaseId) params.set('release', releaseId);
  return '#/prozesse/releaseueberblick' + (id ? '/' + id : '') + (params.size ? '?' + params : '');
}

export function orientationTitle(node: Orientation, store: ContentStore = content) {
  if (!node.referenceId) return node.title!;
  return [...store.topics, ...store.releases, ...store.systems].find(
    (item) => item.id === node.referenceId,
  )!.title;
}

export function orientationSummary(node: Orientation, store: ContentStore = content) {
  if (!node.referenceId) return node.summary ?? '';
  return (
    store.topics.find((t) => t.id === node.referenceId)?.summary ??
    store.releases.find((r) => r.id === node.referenceId)?.description ??
    ''
  );
}

export function orientationTarget(id: string, releaseId = '', store: ContentStore = content) {
  const node = store.orientation.find((n) => n.id === id);
  if (node) return { title: orientationTitle(node, store), href: orientationHref(id, releaseId) };
  return resolveRelationshipTarget(id, 'topic', store);
}

export type OrientationState = 'all' | 'direct' | 'context' | 'unassigned';

/** One hop only. Hierarchy, journey order and release order never confer applicability. */
export function getOrientationStates(releaseId = '', store: ContentStore = content) {
  const direct = new Set(
    store.orientation.filter((n) => n.planningReleaseIds.includes(releaseId)).map((n) => n.id),
  );
  const context = new Set<string>();
  for (const node of store.orientation) {
    for (const link of node.links) {
      if (direct.has(node.id)) context.add(link.targetId);
      if (direct.has(link.targetId)) context.add(node.id);
    }
  }
  return new Map<string, OrientationState>(
    store.orientation.map((node) => [
      node.id,
      !releaseId
        ? 'all'
        : direct.has(node.id)
          ? 'direct'
          : context.has(node.id)
            ? 'context'
            : 'unassigned',
    ]),
  );
}

/** Reverse links are projections, never another maintained collection. */
export function getOrientationBacklinks(id: string, store: ContentStore = content) {
  return store.orientation.flatMap((node) =>
    node.links.filter((link) => link.targetId === id).map((link) => ({ node, ...link })),
  );
}
