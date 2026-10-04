import type { ContentStore } from './types';

export type RelationshipContext = 'task' | 'topic' | 'procedure';
export type RelationshipTargetKind = 'article' | 'task' | 'step' | 'topic' | 'procedure';

/** Only navigable fachliche targets are meaningful in these relationship contexts. */
export function resolveRelationshipTarget(
  targetId: string,
  context: RelationshipContext,
  store: ContentStore,
): { kind: RelationshipTargetKind; title: string; href: string } | undefined {
  if (!['task', 'topic', 'procedure'].includes(context)) return undefined;
  const targets = [
    { kind: 'article', values: store.articles, path: 'artikel' },
    { kind: 'task', values: store.tasks, path: 'aufgabe' },
    { kind: 'step', values: store.processes.flatMap((p) => p.steps), path: 'schritt' },
    { kind: 'topic', values: store.topics, path: 'thema' },
    { kind: 'procedure', values: store.procedures, path: 'bedienweg' },
  ] as const;
  for (const { kind, values, path } of targets) {
    const target = values.find((v) => v.id === targetId);
    if (target)
      return {
        kind,
        title: ('number' in target ? target.number + ' ' : '') + target.title,
        href: `#/${path}/${target.id}`,
      };
  }
}
