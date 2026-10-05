import { content } from '../content';
import { orientationHref, orientationTitle } from './orientation';
import type {
  Article,
  ContentStore,
  Material,
  ProcessStep,
  Task,
  Open,
  Procedure,
  Topic,
  Section,
  Relationship,
} from '../content/types';

export const statusLabels = {
  draft: 'Entwurf',
  usable: 'Nutzbar',
  approved: 'Im Knowledge Center freigegeben',
};
export const materialLabels = {
  guide: 'Anleitung',
  orientation: 'Orientierung',
  reference: 'Ergänzende Referenz',
};
export const getProcessSteps = (store: ContentStore = content) =>
  store.processes.flatMap((p) => p.steps);
export const getArticle = (id: string, store: ContentStore = content) =>
  store.articles.find((a) => a.id === id);
export const getProcedure = (id: string, store: ContentStore = content) =>
  store.procedures.find((p) => p.id === id);
export const getStep = (id: string, store: ContentStore = content) =>
  getProcessSteps(store).find((s) => s.id === id);
export const getTask = (id: string, store: ContentStore = content) =>
  store.tasks.find((t) => t.id === id);
export const roleLabel = (id: string, store: ContentStore = content) =>
  store.roles.find((r) => r.id === id)?.label ?? id;
export function getOpenPoints(object: Open, store: ContentStore = content): string[] {
  return [
    ...new Set([
      ...(object.openPoints ?? []),
      ...(object.openPointIds ?? []).map((id) => store.openPoints.find((p) => p.id === id)!.text),
    ]),
  ];
}
/** Same reading can cover several steps; merge IDs without creating another maintained mapping. */
function mergeMaterials(materials: Material[]): Material[] {
  const merged = new Map<string, Material>();
  for (const m of materials) {
    const key = JSON.stringify([m.articleId, m.kind, [...m.releaseIds].sort()]);
    const existing = merged.get(key);
    if (existing)
      existing.procedureIds = [
        ...new Set([...(existing.procedureIds ?? []), ...(m.procedureIds ?? [])]),
      ];
    else merged.set(key, { ...m, procedureIds: [...(m.procedureIds ?? [])] });
  }
  return [...merged.values()];
}
export function getTaskMaterials(task: Task, store: ContentStore = content): Material[] {
  const related = getProcessSteps(store)
    .filter((s) => s.taskIds?.includes(task.id))
    .flatMap((s) => s.materials)
    .map((m) => {
      const procedureIds = (m.procedureIds ?? []).filter(
        (id) => getProcedure(id, store)?.taskId === task.id,
      );
      // The article can explain the broader task without containing its executable procedure.
      const kind = m.kind === 'guide' && !procedureIds.length ? ('reference' as const) : m.kind;
      return { ...m, kind, procedureIds: kind === 'guide' ? procedureIds : [] };
    });
  return mergeMaterials([...task.materials, ...related]);
}
export function getTopicMaterials(topic: Topic, store: ContentStore = content): Material[] {
  const related = store.tasks
    .filter((t) =>
      t.relationships?.some(
        (r) => r.targetId === topic.id && (r.relation === 'whole' || r.relation === 'partial'),
      ),
    )
    .flatMap((t) => getTaskMaterials(t, store))
    .map((m) => ({ ...m, kind: 'reference' as const, procedureIds: [] }));
  return mergeMaterials([...(topic.materials ?? []), ...related]);
}
export function getWorkMaterials(
  entity: ProcessStep | Task | Topic,
  store: ContentStore = content,
): Material[] {
  if (store.tasks.some((t) => t.id === entity.id)) return getTaskMaterials(entity as Task, store);
  if (store.topics.some((t) => t.id === entity.id))
    return getTopicMaterials(entity as Topic, store);
  return (entity as ProcessStep).materials;
}
/** Inline linked task details without importing procedures from other steps using the same task. */
export function getWorkDetails(entity: ProcessStep | Task | Topic, store: ContentStore = content) {
  const tasks =
    'taskIds' in entity ? store.tasks.filter((task) => entity.taskIds?.includes(task.id)) : [];
  const objects = [entity, ...tasks];
  const materials = mergeMaterials([
    ...getWorkMaterials(entity, store),
    ...tasks.flatMap((task) => task.materials),
  ]);
  const materialArticles = materials.map((material) => getArticle(material.articleId, store)!);
  const description = 'summary' in entity ? entity.summary : (entity.description ?? '');
  const sections = new Map<string, Section>();
  const relationships = new Map<string, Relationship>();
  for (const object of objects) {
    if ('content' in object)
      for (const section of object.content ?? []) {
        const key = JSON.stringify([
          section.title,
          section.body,
          section.steps ?? [],
          section.purpose,
        ]);
        sections.set(key, section);
      }
    if ('relationships' in object)
      for (const relationship of object.relationships ?? []) {
        const key = JSON.stringify([
          relationship.targetId,
          relationship.relation,
          relationship.note,
          relationship.condition,
        ]);
        relationships.set(key, relationship);
      }
  }
  return {
    summaries: [...new Set(tasks.map((task) => task.summary))].filter(
      (summary) => summary.trim() && !description.includes(summary),
    ),
    sections: [...sections.values()],
    openPoints: [
      ...new Set(
        [...objects, ...materialArticles].flatMap((object) => getOpenPoints(object, store)),
      ),
    ],
    sourceRefs: [
      ...new Set([...objects, ...materialArticles].flatMap((object) => object.sourceRefs ?? [])),
    ],
    sourceNote: [
      ...new Set(
        [...objects, ...materialArticles].flatMap((object) =>
          object.sourceNote ? [object.sourceNote] : [],
        ),
      ),
    ].join('\n\n'),
    relationships: [...relationships.values()],
    materials,
  };
}
export function getArticleContext(id: string, store: ContentStore = content) {
  const steps = getProcessSteps(store).filter((s) => s.materials.some((m) => m.articleId === id));
  const tasks = store.tasks.filter((t) =>
    getTaskMaterials(t, store).some((m) => m.articleId === id),
  );
  const blockIds = [
    ...new Set(
      [...steps, ...tasks].flatMap((s) =>
        s.trainingBlockIds.filter((blockId) => {
          const block = store.trainingBlocks.find((b) => b.id === blockId)!;
          return resolveMaterials(getWorkMaterials(s, store), block.releaseId, store).some(
            (m) => m.article.id === id && m.releaseValid,
          );
        }),
      ),
    ),
  ];
  return { steps, tasks, blocks: store.trainingBlocks.filter((b) => blockIds.includes(b.id)) };
}
export function getArticleOpenPoints(article: Article, store: ContentStore = content) {
  const { steps, tasks } = getArticleContext(article.id, store);
  return [
    ...new Set(
      [
        getOpenPoints(article, store),
        ...steps.map((s) => getOpenPoints(s, store)),
        ...tasks.map((t) => getOpenPoints(t, store)),
      ].flat(),
    ),
  ];
}
export interface ResolvedMaterial {
  material: Material;
  article: Article;
  procedures: Procedure[];
  releaseValid: boolean;
}
export function resolveMaterials(
  materials: Material[],
  releaseId?: string,
  store: ContentStore = content,
): ResolvedMaterial[] {
  return materials.map((material) => {
    const article = getArticle(material.articleId, store)!;
    const procedures = (material.procedureIds ?? []).map((id) => getProcedure(id, store)!);
    // Missing release applicability is unknown, not permission to transfer material.
    const releaseValid =
      releaseId === undefined ||
      (material.releaseIds.includes(releaseId) &&
        (article.releaseIds === undefined || article.releaseIds.includes(releaseId)) &&
        procedures.every((p) => p.releaseIds === undefined || p.releaseIds.includes(releaseId)));
    return { material, article, procedures, releaseValid };
  });
}
export function getTrainingBlockCoverage(blockId: string, store: ContentStore = content) {
  const block = store.trainingBlocks.find((b) => b.id === blockId);
  if (!block) throw new Error(`Unbekannter Schulungsblock: ${blockId}`);
  const entities: (ProcessStep | Task)[] = [...getProcessSteps(store), ...store.tasks].filter((e) =>
    e.trainingBlockIds.includes(blockId),
  );
  const rows = entities.map((entity) => {
    const materials = resolveMaterials(getWorkMaterials(entity, store), block.releaseId, store);
    const applicable = materials.filter((m) => m.releaseValid);
    const guides = applicable.filter((m) => m.material.kind === 'guide');
    const relatedTasks =
      'taskIds' in entity ? store.tasks.filter((t) => entity.taskIds?.includes(t.id)) : [];
    const openPoints = [
      ...new Set(
        [
          getOpenPoints(entity, store),
          ...relatedTasks.map((t) => getOpenPoints(t, store)),
          ...applicable.map((m) => getOpenPoints(m.article, store)),
          ...applicable.flatMap((m) => m.procedures.map((p) => getOpenPoints(p, store))),
        ].flat(),
      ),
    ];
    return {
      entity,
      materials,
      guides,
      orientations: applicable.filter((m) => m.material.kind === 'orientation'),
      references: applicable.filter((m) => m.material.kind === 'reference'),
      openPoints,
      missingMaterial: applicable.length === 0,
      missingGuide: guides.length === 0,
      hasProcedure: guides.some((m) => m.procedures.length > 0),
      hasUsableGuide: guides.some((m) => m.procedures.length > 0 && m.article.status !== 'draft'),
    };
  });
  return {
    block,
    rows,
    summary: {
      total: rows.length,
      withMaterial: rows.filter((r) => !r.missingMaterial).length,
      withGuide: rows.filter((r) => !r.missingGuide).length,
      withProcedure: rows.filter((r) => r.hasProcedure).length,
      withUsableGuide: rows.filter((r) => r.hasUsableGuide).length,
    },
  };
}
export interface InventoryEntry {
  id: string;
  title: string;
  kind:
    | 'orientation'
    | 'article'
    | 'step'
    | 'task'
    | 'topic'
    | 'procedure'
    | 'process'
    | 'role'
    | 'system'
    | 'release'
    | 'trainingBlock';
  summary: string;
  href: string;
  roleIds: string[];
  systemIds: string[];
  articleIds: string[];
  openPoints: string[];
  aliases: string[];
}
/** Projection only: no manually maintained titles, readiness or coverage rows. */
export function getInventory(store: ContentStore = content): InventoryEntry[] {
  const entry = (
    id: string,
    title: string,
    kind: InventoryEntry['kind'],
    summary: string,
    href: string,
    extra: Partial<InventoryEntry> = {},
  ): InventoryEntry => ({
    id,
    title,
    kind,
    summary,
    href,
    roleIds: [],
    systemIds: [],
    articleIds: [],
    openPoints: [],
    aliases: [],
    ...extra,
  });
  return [
    ...store.orientation
      .filter((n) => !n.referenceId)
      .map((n) =>
        entry(
          n.id,
          orientationTitle(n, store),
          'orientation',
          n.summary ?? '',
          orientationHref(n.id),
          { roleIds: n.audienceRoleIds, aliases: [n.sourceKey, n.kind] },
        ),
      ),
    ...store.articles.map((a) =>
      entry(a.id, a.title, 'article', a.summary, `#/artikel/${a.id}`, {
        roleIds: a.roleIds,
        systemIds: a.systemIds,
        articleIds: [a.id],
        openPoints: getOpenPoints(a, store),
        aliases: [a.topic ?? ''],
      }),
    ),
    ...store.processes.map((p) =>
      entry(p.id, p.title, 'process', p.description, `#/prozesse/${p.id}`),
    ),
    ...getProcessSteps(store).map((s) =>
      entry(
        s.id,
        s.title,
        'step',
        [s.number, s.phase, s.description, s.input, s.output].filter(Boolean).join(' · '),
        `#/schritt/${s.id}`,
        {
          roleIds: s.roleIds,
          systemIds: [
            ...new Set([
              ...s.systemIds,
              ...store.tasks.filter((t) => s.taskIds?.includes(t.id)).flatMap((t) => t.systemIds),
            ]),
          ],
          articleIds: s.materials.map((m) => m.articleId),
          openPoints: getOpenPoints(s, store),
          aliases: [s.number, ...(s.aliases ?? [])],
        },
      ),
    ),
    ...store.tasks.map((t) =>
      entry(t.id, t.title, 'task', t.summary, `#/aufgabe/${t.id}`, {
        roleIds: t.roleIds,
        systemIds: t.systemIds,
        articleIds: getTaskMaterials(t, store).map((m) => m.articleId),
        openPoints: getOpenPoints(t, store),
        aliases: t.aliases ?? [],
      }),
    ),
    ...store.topics.map((t) =>
      entry(t.id, t.title, 'topic', t.summary, `#/thema/${t.id}`, {
        articleIds: getTopicMaterials(t, store).map((m) => m.articleId),
        openPoints: getOpenPoints(t, store),
        aliases: t.aliases ?? [],
      }),
    ),
    ...store.procedures.map((p) =>
      entry(p.id, p.title, 'procedure', p.trigger, `#/bedienweg/${p.id}`, {
        articleIds: store.articles.filter((a) => a.procedureIds?.includes(p.id)).map((a) => a.id),
        roleIds: [
          ...new Set(
            store.articles.filter((a) => a.procedureIds?.includes(p.id)).flatMap((a) => a.roleIds),
          ),
        ],
        systemIds: [
          ...new Set(
            store.articles
              .filter((a) => a.procedureIds?.includes(p.id))
              .flatMap((a) => a.systemIds),
          ),
        ],
        openPoints: getOpenPoints(p, store),
      }),
    ),
    ...store.roles.map((r) =>
      entry(r.id, r.label, 'role', r.responsibility, `#/rollen/${r.id}`, {
        roleIds: [r.id],
        aliases: r.aliases ?? [],
      }),
    ),
    ...store.systems.map((s) =>
      entry(s.id, s.title, 'system', '', `#/wissen?system=${s.id}`, {
        systemIds: [s.id],
        aliases: s.aliases ?? [],
      }),
    ),
    ...store.releases.map((r) =>
      entry(r.id, r.title, 'release', r.description ?? '', `#/releases/${r.id}`, {
        aliases: [r.code],
      }),
    ),
    ...store.trainingBlocks.map((b) =>
      entry(
        b.id,
        b.title,
        'trainingBlock',
        store.releases.find((r) => r.id === b.releaseId)!.title,
        `#/schulungen/${b.id}`,
        { aliases: [b.code] },
      ),
    ),
  ];
}
export function getRoleView(roleId: string, store: ContentStore = content) {
  return {
    role: store.roles.find((r) => r.id === roleId),
    steps: getProcessSteps(store).filter((s) => s.roleIds.includes(roleId)),
    tasks: store.tasks.filter((t) => t.roleIds.includes(roleId)),
    articles: store.articles.filter((a) => a.roleIds.includes(roleId)),
  };
}
