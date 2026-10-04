import type { ContentStore } from './types';
import { resolveRelationshipTarget } from './relationships';

/** Fail closed for malformed JSON, unknown fields and orphan references. Also used by the editor. */
export function validateContent(value: unknown): asserts value is ContentStore {
  const fail = (path: string, message: string): never => {
    throw new Error(`${path}: ${message}`);
  };
  const object = (v: unknown, path: string, keys: string[]) => {
    if (!v || typeof v !== 'object' || Array.isArray(v)) fail(path, 'Objekt erwartet');
    const o = v as Record<string, unknown>;
    for (const key of Object.keys(o))
      if (!keys.includes(key)) fail(path, `Unbekanntes Feld ${key}`);
    return o;
  };
  const str = (v: unknown, path: string, empty = false): string => {
    if (typeof v !== 'string' || (!empty && !v.trim()) || v.length > 50000)
      fail(path, 'Gültiger Text erwartet');
    return v as string;
  };
  const arr = (v: unknown, path: string): unknown[] => {
    if (!Array.isArray(v) || v.length > 10000) fail(path, 'Liste erwartet');
    return v as unknown[];
  };
  const texts = (v: unknown, path: string) => {
    const values = arr(v, path).map((x, i) => str(x, `${path}[${i}]`));
    if (new Set(values).size !== values.length) fail(path, 'Doppelte Einträge');
    return values;
  };
  const names = [
    'articles',
    'processes',
    'tasks',
    'topics',
    'roles',
    'systems',
    'releases',
    'trainingBlocks',
    'procedures',
    'sources',
    'openPoints',
    'help',
  ];
  const store = object(value, 'content', names);
  const groups = Object.fromEntries(names.map((name) => [name, arr(store[name], name)]));
  const allIds = new Set<string>();
  const ids = new Map<string, Set<string>>();
  const identify = (name: string, values: unknown[]) => {
    const set = new Set<string>();
    for (const v of values) {
      const id = str((v as Record<string, unknown>)?.id, name + '.id');
      if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(id) || id.length > 120)
        fail(name, `Ungültige ID ${id}`);
      if (allIds.has(id)) fail(name, `Doppelte ID ${id}`);
      set.add(id);
      allIds.add(id);
    }
    ids.set(name, set);
  };
  for (const name of names.filter((n) => n !== 'help')) identify(name, groups[name]);
  identify(
    'destinations',
    groups.systems.flatMap((s) =>
      arr((s as Record<string, unknown>)?.destinations ?? [], 'system.destinations'),
    ),
  );
  identify(
    'steps',
    groups.processes.flatMap((p) => arr((p as Record<string, unknown>)?.steps, 'process.steps')),
  );
  const reference = (id: unknown, group: string, path: string) => {
    if (!ids.get(group)?.has(str(id, path)))
      fail(path, `Ungültige Referenz ${String(id)} (${group})`);
  };
  const references = (v: unknown, group: string, path: string) =>
    texts(v, path).forEach((id) => reference(id, group, path));
  const optional = (
    o: Record<string, unknown>,
    key: string,
    fn: (v: unknown, path: string) => unknown,
    path: string,
  ) => {
    if (o[key] !== undefined) fn(o[key], `${path}.${key}`);
  };
  const sourcedKeys = ['sourceRefs', 'sourceNote', 'openPoints', 'openPointIds'];
  const sourced = (o: Record<string, unknown>, path: string) => {
    optional(o, 'sourceNote', str, path);
    optional(o, 'sourceRefs', texts, path);
    optional(o, 'openPoints', texts, path);
    optional(o, 'openPointIds', (v, p) => references(v, 'openPoints', p), path);
    // Free-form references are allowed. Registry-style references must point to a local source.
    for (const s of (o.sourceRefs ?? []) as string[]) {
      const prefix = /^([A-Z][A-Z0-9]*): /.exec(s)?.[1];
      if (prefix && !ids.get('sources')?.has(prefix)) fail(path, `Unbekannte Quelle ${prefix}`);
    }
  };
  const sections = (v: unknown, path: string) =>
    arr(v, path).forEach((x, i) => {
      const p = `${path}[${i}]`,
        o = object(x, p, ['title', 'body', 'steps', 'purpose']);
      if (o.purpose !== undefined && !['exercise', 'context'].includes(str(o.purpose, p)))
        fail(p, 'Ungültiger Abschnittszweck');
      str(o.title, p + '.title');
      str(o.body, p + '.body', true);
      optional(o, 'steps', texts, p);
      if (!(o.body as string).trim() && !(o.steps as string[] | undefined)?.length)
        fail(p, 'Inhalt fehlt');
    });
  const relationships = (v: unknown, path: string) =>
    arr(v, path).forEach((x, i) => {
      const p = `${path}[${i}]`,
        o = object(x, p, ['targetId', 'relation', 'note', 'condition']);
      if (!allIds.has(str(o.targetId, p))) fail(p, 'Beziehung ohne Ziel');
      if (
        !['whole', 'partial', 'prerequisite', 'related', 'feeds', 'requires'].includes(
          str(o.relation, p),
        )
      )
        fail(p, 'Ungültige Beziehung');
      optional(o, 'note', str, p);
      optional(o, 'condition', str, p);
    });
  const material = (v: unknown, path: string) =>
    arr(v, path).forEach((x, i) => {
      const p = `${path}[${i}]`,
        o = object(x, p, ['articleId', 'kind', 'releaseIds', 'procedureIds']);
      reference(o.articleId, 'articles', p);
      if (!['guide', 'orientation', 'reference'].includes(str(o.kind, p)))
        fail(p, 'Ungültige Materialart');
      references(o.releaseIds, 'releases', p);
      if (!(o.releaseIds as string[]).length) fail(p, 'Materialgültigkeit fehlt');
      optional(o, 'procedureIds', (v, p) => references(v, 'procedures', p), p);
      if (o.kind !== 'guide' && (o.procedureIds as unknown[] | undefined)?.length)
        fail(p, 'Nur guide darf ausführbare Bedienwege zuordnen');
      const article = groups.articles.find(
        (a) => (a as Record<string, unknown>).id === o.articleId,
      ) as Record<string, unknown>;
      for (const id of (o.procedureIds ?? []) as string[])
        if (!(article.procedureIds as string[] | undefined)?.includes(id))
          fail(p, 'Bedienweg gehört nicht zum Artikel');
      for (const release of o.releaseIds as string[]) {
        if (article.releaseIds && !(article.releaseIds as string[]).includes(release))
          fail(p, 'Material außerhalb der Artikelgültigkeit');
        for (const id of (o.procedureIds ?? []) as string[]) {
          const procedure = groups.procedures.find(
            (a) => (a as Record<string, unknown>).id === id,
          ) as Record<string, unknown>;
          if (procedure.releaseIds && !(procedure.releaseIds as string[]).includes(release))
            fail(p, 'Bedienweg außerhalb seiner Releasegültigkeit');
        }
      }
    });
  const workKeys = [
    'id',
    'title',
    'roleIds',
    'systemIds',
    'releaseIds',
    'trainingBlockIds',
    'materials',
    ...sourcedKeys,
  ];
  const work = (o: Record<string, unknown>, p: string) => {
    str(o.title, p + '.title');
    references(o.roleIds, 'roles', p);
    references(o.systemIds, 'systems', p);
    references(o.trainingBlockIds, 'trainingBlocks', p);
    optional(o, 'releaseIds', (v, p) => references(v, 'releases', p), p);
    material(o.materials, p + '.materials');
    sourced(o, p);
    optional(o, 'aliases', texts, p);
    optional(o, 'relationships', relationships, p);
    optional(o, 'content', sections, p);
    for (const id of o.trainingBlockIds as string[]) {
      const block = groups.trainingBlocks.find(
        (x) => (x as Record<string, unknown>).id === id,
      ) as Record<string, unknown>;
      if (!(o.releaseIds as string[] | undefined)?.includes(block.releaseId as string))
        fail(p, 'Schulungsblock außerhalb der Schritt-/Task-Releasezuordnung');
    }
  };
  for (const name of names)
    for (const [i, x] of groups[name].entries()) {
      const p = `${name}[${i}]`;
      if (name === 'articles') {
        const o = object(x, p, [
          'id',
          'title',
          'summary',
          'roleIds',
          'systemIds',
          'status',
          'content',
          'releaseIds',
          'relatedArticleIds',
          'procedureIds',
          'topic',
          'kind',
          ...sourcedKeys,
        ]);
        for (const key of ['title', 'summary']) str(o[key], p + '.' + key);
        references(o.roleIds, 'roles', p);
        references(o.systemIds, 'systems', p);
        if (!['draft', 'usable', 'approved'].includes(str(o.status, p)))
          fail(p, 'Ungültiger Artikelstatus');
        sections(o.content, p + '.content');
        if (!(o.content as unknown[]).length) fail(p, 'Artikelinhalt fehlt');
        sourced(o, p);
        optional(o, 'releaseIds', (v, p) => references(v, 'releases', p), p);
        optional(o, 'relatedArticleIds', (v, p) => references(v, 'articles', p), p);
        optional(o, 'procedureIds', (v, p) => references(v, 'procedures', p), p);
        optional(o, 'topic', str, p);
        optional(o, 'kind', str, p);
      } else if (name === 'processes') {
        const o = object(x, p, [
          'id',
          'title',
          'description',
          'steps',
          'flows',
          'sourceRefs',
          'sourceNote',
        ]);
        str(o.title, p);
        str(o.description, p);
        sourced(o, p);
        const numbers = new Set<string>();
        for (const [j, s] of arr(o.steps, p).entries()) {
          const q = `${p}.steps[${j}]`,
            so = object(s, q, [
              ...workKeys,
              'number',
              'phase',
              'description',
              'input',
              'output',
              'taskIds',
              'aliases',
            ]);
          work(so, q);
          const number = str(so.number, q);
          if (numbers.has(number)) fail(q, 'Doppelte Schrittnummer');
          numbers.add(number);
          str(so.phase, q);
          for (const key of ['description', 'input', 'output']) optional(so, key, str, q);
          optional(so, 'taskIds', (v, p) => references(v, 'tasks', p), q);
        }
        const stepIds = new Set((o.steps as { id: string }[]).map((s) => s.id));
        const flowKeys = new Set<string>();
        optional(
          o,
          'flows',
          (v, path) =>
            arr(v, path).forEach((x, i) => {
              const q = `${path}[${i}]`;
              const flow = object(x, q, [
                'from',
                'to',
                'kind',
                'label',
                'sourceRefs',
                'sourceNote',
              ]);
              for (const endpoint of ['from', 'to']) {
                if (!stepIds.has(str(flow[endpoint], `${q}.${endpoint}`)))
                  fail(q, 'Unbekannter Flow-Endpunkt im Prozess');
              }
              optional(flow, 'kind', str, q);
              optional(flow, 'label', str, q);
              sourced(flow, q);
              if (!(flow.sourceRefs as string[] | undefined)?.length && !flow.sourceNote)
                fail(q, 'Flow ohne Quellenbeleg');
              const key = JSON.stringify([flow.from, flow.to, flow.kind, flow.label]);
              if (flowKeys.has(key)) fail(q, 'Doppelte Flow-Beziehung');
              flowKeys.add(key);
            }),
          p,
        );
      } else if (name === 'tasks') {
        const o = object(x, p, [...workKeys, 'summary', 'aliases', 'content', 'relationships']);
        work(o, p);
        str(o.summary, p);
        if (
          (o.trainingBlockIds as string[]).length &&
          groups.processes.some((process) =>
            (process as { steps: { taskIds?: string[] }[] }).steps.some((step) =>
              step.taskIds?.includes(o.id as string),
            ),
          )
        )
          fail(p, 'Schulungszuordnung am verknüpften Prozessschritt pflegen');
      } else if (name === 'topics') {
        const o = object(x, p, [
          'id',
          'title',
          'summary',
          'aliases',
          'content',
          'materials',
          'relationships',
          ...sourcedKeys,
        ]);
        str(o.title, p);
        str(o.summary, p);
        sourced(o, p);
        optional(o, 'aliases', texts, p);
        optional(o, 'content', sections, p);
        optional(o, 'materials', material, p);
        optional(o, 'relationships', relationships, p);
      } else if (name === 'procedures') {
        const o = object(x, p, [
          'id',
          'title',
          'trigger',
          'taskId',
          'relatedArticleId',
          'releaseIds',
          'prerequisites',
          'requiredRights',
          'actions',
          'expectedResults',
          'checkQuestions',
          'relationships',
          ...sourcedKeys,
        ]);
        str(o.title, p);
        str(o.trigger, p);
        texts(o.prerequisites, p);
        texts(o.expectedResults, p);
        optional(o, 'requiredRights', texts, p);
        optional(o, 'checkQuestions', texts, p);
        sourced(o, p);
        optional(o, 'taskId', (v, p) => reference(v, 'tasks', p), p);
        optional(o, 'relatedArticleId', (v, p) => reference(v, 'articles', p), p);
        optional(o, 'releaseIds', (v, p) => references(v, 'releases', p), p);
        optional(o, 'relationships', relationships, p);
        if (!arr(o.actions, p).length) fail(p, 'Bedienweg ohne Schritte');
        for (const [j, a] of arr(o.actions, p).entries()) {
          const q = `${p}.actions[${j}]`,
            ao = object(a, q, ['text', 'tool', 'toolSelection']);
          str(ao.text, q);
          optional(ao, 'tool', str, q);
          if (ao.toolSelection) {
            const t = object(ao.toolSelection, q, ['toolIds', 'relation']);
            texts(t.toolIds, q).forEach((id) => {
              if (!ids.get('systems')?.has(id) && !ids.get('destinations')?.has(id))
                fail(q, 'Ungültiges Bedienziel');
            });
            if (!(t.toolIds as string[]).length) fail(q, 'Leere Systemauswahl');
            if (!['all', 'alternative'].includes(str(t.relation, q)))
              fail(q, 'Ungültige Systemauswahl');
          }
        }
      } else if (name === 'roles') {
        const o = object(x, p, ['id', 'label', 'aliases', 'responsibility']);
        str(o.label, p);
        str(o.responsibility, p);
        optional(o, 'aliases', texts, p);
      } else if (name === 'systems') {
        const o = object(x, p, ['id', 'title', 'aliases', 'destinations']);
        str(o.title, p);
        optional(o, 'aliases', texts, p);
        if (o.destinations !== undefined)
          for (const d of arr(o.destinations, p)) {
            const target = object(d, p, ['id', 'title', 'aliases']);
            str(target.title, p);
            optional(target, 'aliases', texts, p);
          }
      } else if (name === 'releases' || name === 'trainingBlocks') {
        const o = object(x, p, [
          'id',
          'title',
          'code',
          ...(name === 'releases' ? ['description'] : ['releaseId']),
        ]);
        str(o.title, p);
        str(o.code, p);
        if (name === 'trainingBlocks') reference(o.releaseId, 'releases', p);
        else optional(o, 'description', str, p);
      } else if (name === 'sources') {
        const o = object(x, p, ['id', 'title', 'path', 'date']);
        str(o.title, p);
        const path = str(o.path, p);
        if (!path.startsWith('sources/') || path.includes('..') || path.includes('\\'))
          fail(p, 'Ungültiger Quellpfad');
        optional(o, 'date', str, p);
      } else if (name === 'openPoints') {
        const o = object(x, p, ['id', 'text', 'sourceRefs', 'sourceNote']);
        str(o.text, p);
        sourced(o, p);
      } else if (name === 'help') {
        const o = object(x, p, ['question', 'answer']);
        str(o.question, p);
        str(o.answer, p);
      }
    }
  // Resolve only after structural validation, so malformed drafts never reach typed selectors.
  const canonical = value as ContentStore;
  for (const [context, objects] of [
    ['task', canonical.tasks],
    ['topic', canonical.topics],
    ['procedure', canonical.procedures],
  ] as const)
    for (const object of objects)
      for (const relationship of object.relationships ?? [])
        if (!resolveRelationshipTarget(relationship.targetId, context, canonical))
          fail(object.id + '.relationships', 'Beziehungsziel in diesem Kontext nicht unterstützt');

  for (const owner of [...canonical.tasks, ...canonical.processes.flatMap((p) => p.steps)])
    for (const material of owner.materials)
      for (const id of material.procedureIds ?? []) {
        const procedure = canonical.procedures.find((p) => p.id === id)!;
        const taskIds = 'number' in owner ? (owner.taskIds ?? []) : [owner.id];
        if (procedure.taskId && !taskIds.includes(procedure.taskId))
          fail(
            owner.id + '.materials',
            'Bedienweg passt nicht zur zugeordneten fachlichen Aufgabe',
          );
      }
}
