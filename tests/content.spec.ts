import { visioPageXml } from './visio-source';
import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { loadModel } from './model';
import baseline from './fixtures/migration-baseline.json' with { type: 'json' };
import type { ContentStore, Article } from '../src/content/types';
let model: Awaited<ReturnType<typeof loadModel>>;
test.beforeAll(async () => {
  model = await loadModel();
});
const flatten = (v: unknown): string =>
  typeof v === 'string'
    ? v
    : Array.isArray(v)
      ? v.map(flatten).join('\n')
      : v && typeof v === 'object'
        ? Object.values(v).map(flatten).join('\n')
        : '';
test('canonical data validate, stable IDs and all 52 steps survive migration', () => {
  model.validateContent(model.content);
  expect(model.content.articles.map((a) => a.id).sort()).toEqual([...baseline.articleIds].sort());
  expect(
    model
      .getProcessSteps()
      .map((s) => s.id)
      .sort(),
  ).toEqual([...baseline.stepIds].sort());
  expect(model.content.procedures.map((p) => p.id).sort()).toEqual(
    [...baseline.procedureIds].sort(),
  );
  expect(model.getProcessSteps()).toHaveLength(52);
  for (const [id, title] of Object.entries(baseline.stepSourceTitles))
    expect(model.getStep(id)?.title).toBe(title);
  for (const before of baseline.stepSnapshots) {
    const after = model.getStep(before.id)!;
    for (const [key, value] of Object.entries(before))
      expect(after[key as keyof typeof after]).toEqual(value);
  }
});
test('all article and procedure factual texts are preserved, including trainer examples', () => {
  for (const [id, texts] of Object.entries(baseline.articleTexts)) {
    const a = model.getArticle(id)!;
    const actual = flatten([a, ...(a.procedureIds ?? []).map((pid) => model.getProcedure(pid))]);
    for (const text of texts) expect(actual, `${id}: ${text}`).toContain(text);
  }
  for (const p of baseline.procedureSnapshots) {
    const actual = model.getProcedure(p.id)!;
    for (const [key, value] of Object.entries(p))
      expect(actual[key as keyof typeof actual]).toEqual(value);
  }
});
test('all original source bytes remain unchanged', () => {
  for (const [file, hash] of Object.entries(baseline.sourceDigests))
    expect(createHash('sha256').update(readFileSync(file)).digest('hex')).toBe(hash);
  for (const source of model.content.sources) expect(() => readFileSync(source.path)).not.toThrow();
});
test('SB01 and SB02 use the same query and exactly the matrix memberships', () => {
  const first = model.getTrainingBlockCoverage('sb1'),
    second = model.getTrainingBlockCoverage('sb2');
  expect(first.rows.map((r) => r.entity.id).sort()).toEqual([...baseline.sb1StepIds].sort());
  expect(second.rows.map((r) => r.entity.id).sort()).toEqual([...baseline.sb2StepIds].sort());
  expect(first.summary.total).toBe(24);
  expect(second.summary.total).toBe(27);
  expect(model.getStep('step-5-1')!.trainingBlockIds).toEqual([]);
  expect(model.getStep('step-5-1')!.releaseIds).toEqual([]);
  expect(second.rows.every((r) => r.missingMaterial)).toBeTruthy();
  expect(() => model.getTrainingBlockCoverage('unknown')).toThrow();
});
test('guide, orientation and reference remain distinct and usable does not claim completeness', () => {
  const rows = model.getTrainingBlockCoverage('sb1').rows;
  const request = rows.find((r) => r.entity.id === 'step-1-1')!;
  expect(request.orientations).toHaveLength(1);
  expect(request.guides).toHaveLength(0);
  expect(request.hasProcedure).toBeFalsy();
  const owner = rows.find((r) => r.entity.id === 'step-2-6')!;
  expect(
    owner.guides.some((g) => g.procedures.some((p) => p.id === 'procedure-owner-change')),
  ).toBeTruthy();
  expect(owner.references.some((r) => r.article.id === 'faq-role-vs-access')).toBeTruthy();
  expect(owner.hasUsableGuide).toBeTruthy();
  expect(owner.openPoints.length).toBeGreaterThan(0);
  expect(model.getStep('step-2-8')!.materials[0].procedureIds).toEqual([
    'procedure-system-master-data',
  ]);
  expect(model.getStep('step-2-9')!.materials[0].procedureIds).toEqual(['procedure-system-scope']);
});
test('future releases and multiple training blocks need no new query or implicit material inheritance', () => {
  const data: ContentStore = structuredClone(model.content);
  data.releases.push({ id: 'release-3-fixture', code: 'R3', title: 'Testrelease' });
  data.trainingBlocks.push({
    id: 'r3-fixture',
    releaseId: 'release-3-fixture',
    code: 'SB01',
    title: 'Testblock',
  });
  const step = data.processes[0].steps.find((s) => s.id === 'step-2-6')!;
  step.releaseIds!.push('release-3-fixture');
  step.trainingBlockIds.push('r3-fixture');
  model.validateContent(data);
  let row = model.getTrainingBlockCoverage('r3-fixture', data).rows[0];
  expect(row.entity.id).toBe(step.id);
  expect(row.materials.length).toBeGreaterThan(0);
  expect(row.materials.every((m) => !m.releaseValid)).toBeTruthy();
  expect(row.missingMaterial).toBeTruthy();
  expect(row.hasUsableGuide).toBeFalsy();
  for (const code of ['R4a', 'R4b']) {
    data.releases.push({ id: code + '-fixture', code, title: 'Testrelease ' + code });
    data.trainingBlocks.push({
      id: code + '-block-fixture',
      releaseId: code + '-fixture',
      code: 'SB02',
      title: 'Testblock',
    });
    step.releaseIds!.push(code + '-fixture');
    step.trainingBlockIds.push(code + '-block-fixture');
    model.validateContent(data);
    expect(
      model.getTrainingBlockCoverage(code + '-block-fixture', data).rows[0].missingMaterial,
    ).toBeTruthy();
  }
  expect(model.getTrainingBlockCoverage('sb1', data).summary.total).toBe(24);
  expect(
    model.getArticleContext('guide-project-permissions', data).blocks.map((b) => b.id),
  ).not.toContain('r3-fixture');
  const art: Article = {
    id: 'future-fixture',
    title: 'Testinhalt',
    summary: 'Ein begrenzter Testinhalt',
    roleIds: ['pm'],
    systemIds: [],
    status: 'approved',
    content: [{ title: 'Bedienung', body: 'Test' }],
  };
  data.articles.push(art);
  step.materials.push({ articleId: art.id, kind: 'reference', releaseIds: ['release-3-fixture'] });
  model.validateContent(data);
  row = model.getTrainingBlockCoverage('r3-fixture', data).rows[0];
  expect(row.references).toHaveLength(1);
  expect(row.hasProcedure).toBeFalsy();
  expect(row.missingGuide).toBeTruthy();
  data.tasks.push({
    id: 'independent-fixture',
    title: 'Eigene Aufgabe',
    summary: 'Test',
    roleIds: ['pm'],
    systemIds: [],
    releaseIds: ['release-3-fixture'],
    trainingBlockIds: ['r3-fixture'],
    materials: [],
  });
  model.validateContent(data);
  expect(model.getTrainingBlockCoverage('r3-fixture', data).rows).toHaveLength(2);
});
test('validation rejects orphan IDs, duplicate IDs, invalid status and material mismatch', () => {
  for (const mutate of [
    (s: ContentStore) => s.articles[0].roleIds.push('missing'),
    (s: ContentStore) => s.processes[0].steps.push(structuredClone(s.processes[0].steps[0])),
    (s: ContentStore) => ((s.articles[0] as unknown as { status: string }).status = 'reviewed'),
    (s: ContentStore) => (s.trainingBlocks[0].releaseId = 'missing'),
    (s: ContentStore) =>
      (s.procedures[0].actions[0].toolSelection = { toolIds: ['missing'], relation: 'all' }),
    (s: ContentStore) =>
      (s.processes[0].steps[0].materials[0].procedureIds = ['procedure-owner-change']),
    (s: ContentStore) => (s.processes[0].steps[0].materials[0].releaseIds = ['R1B']),
    (s: ContentStore) => ((s.articles[0] as unknown as { knowledge: unknown }).knowledge = {}),
  ]) {
    const s = structuredClone(model.content);
    mutate(s);
    expect(() => model.validateContent(s)).toThrow();
  }
});
test('normal content requires no source, revision, assessment, trainer or release metadata', () => {
  const s = structuredClone(model.content);
  s.articles.push({
    id: 'simple-fixture',
    title: 'Einfache Hilfe',
    summary: 'Beitrag ohne Nachweisapparat',
    roleIds: [],
    systemIds: [],
    status: 'draft',
    content: [{ title: 'Wissen', body: 'Pragmatische Anleitung.' }],
  });
  expect(() => model.validateContent(s)).not.toThrow();
});
test('inventory and common search reflect canonical changes and preserve role/process context', () => {
  const s = structuredClone(model.content);
  s.processes[0].steps[0].title = 'Neuer eindeutiger Aufgabentext';
  expect(model.getInventory(s).find((e) => e.id === 'step-1-1')?.title).toBe(
    'Neuer eindeutiger Aufgabentext',
  );
  expect(model.searchContent('eindeutiger Aufgabentext', {}, s).map((e) => e.id)).toContain(
    'step-1-1',
  );
  expect(
    model.searchContent('Owner', {}, s).some((e) => e.id === 'procedure-owner-change'),
  ).toBeTruthy();
  expect(
    model
      .searchContent('Owner', { roleId: 'tm' }, s)
      .some((e) => e.id === 'procedure-owner-change'),
  ).toBeTruthy();
  expect(model.searchContent('SB02', {}, s).filter((e) => e.kind === 'step')).toHaveLength(27);
  expect(
    model.getRoleView('tm', s).steps.every((step) => step.roleIds.includes('tm')),
  ).toBeTruthy();
  expect(new Set(model.getInventory(s).map((e) => e.id)).size).toBe(model.getInventory(s).length);
});
test('important source boundaries and contradictions remain explicit', () => {
  const text = flatten(model.content);
  for (const phrase of [
    'EDC',
    'unabhängig',
    'PMO Status bleibt beim PMO',
    'Bestands-Sites',
    'keine umfassende Feldsynchronisierung',
    'Kalenderjahr',
    'Project Purpose',
    'WBS',
    'Hard Links nicht nutzen und nicht schulen',
  ])
    expect(text).toContain(phrase);
  expect(model.getStep('step-1-1')!.openPoints!.join(' ')).toContain('Quellenkonflikt');
  expect(model.getTask('fn-build-team')!.openPointIds).toContain('issue-build-sync');
  expect(model.content.articles.filter((a) => a.status === 'usable')).toHaveLength(5);
  expect(model.content.articles.filter((a) => a.status === 'approved')).toHaveLength(0);
});

test('linked task and scope readings derive from leading process materials without a second mapping', () => {
  const store = structuredClone(model.content);
  const task = store.tasks.find((t) => t.id === 'fn-project-objectives')!;
  expect(task.materials).toEqual([]);
  expect(
    model.getTaskMaterials(task, store).some((m) => m.articleId === 'guide-project-objectives'),
  ).toBeTruthy();
  const step = store.processes[0].steps.find((s) => s.id === 'step-2-3')!;
  step.materials = [];
  expect(model.getTaskMaterials(task, store)).toEqual([]);
  expect(model.getInventory(store).find((e) => e.id === task.id)?.articleIds).toEqual([]);
});

test('training ownership and prerequisite scope relationships never create duplicate coverage', () => {
  const store = structuredClone(model.content),
    task = store.tasks.find((t) => t.id === 'fn-project-objectives')!;
  task.trainingBlockIds = ['sb1'];
  expect(() => model.validateContent(store)).toThrow(/Prozessschritt/);
  task.trainingBlockIds = [];
  store.topics.push({
    id: 'scope-prerequisite-fixture',
    title: 'Testvoraussetzung',
    summary: 'Keine Inhaltsabdeckung',
  });
  task.relationships!.push({ targetId: 'scope-prerequisite-fixture', relation: 'prerequisite' });
  model.validateContent(store);
  expect(model.getTopicMaterials(store.topics.at(-1)!, store)).toEqual([]);
});

test('leading material relationships and distinct task facts match the baseline', () => {
  for (const [taskId, articleIds] of Object.entries(baseline.functionArticleIds)) {
    const task = model.getTask(taskId)!;
    expect([...new Set(model.getTaskMaterials(task).map((m) => m.articleId))].sort()).toEqual(
      [...articleIds].sort(),
    );
    for (const text of baseline.taskFactualTexts[taskId as keyof typeof baseline.taskFactualTexts])
      expect(flatten(task)).toContain(text);
  }
  for (const [number, ids] of Object.entries(baseline.stepMaterialArticleIds))
    expect(
      model
        .getProcessSteps()
        .find((s) => s.number === number)!
        .materials.map((m) => m.articleId),
    ).toEqual(ids);
  for (const [id, texts] of Object.entries(baseline.activeIssueTexts))
    for (const text of texts)
      expect(model.content.openPoints.find((p) => p.id === id)!.text).toContain(text);
});

test('broader reference titles and bounded article scope notes are retained', () => {
  for (const [id, title] of Object.entries(baseline.topicSourceTitles)) {
    const topic = model.content.topics.find((t) => t.id === id)!;
    expect([topic.title, ...(topic.aliases ?? [])]).toContain(title);
  }
  for (const [id, note] of Object.entries(baseline.articleScopeNotes))
    expect(model.getArticle(id)!.content.some((section) => section.body === note)).toBeTruthy();
});

test('material procedures must match the canonical task of the process step', () => {
  const store = structuredClone(model.content);
  const step = store.processes[0].steps.find((s) => s.id === 'step-2-8')!;
  expect(step.taskIds).toEqual(['fn-system-definition']);
  expect(() => model.validateContent(store)).not.toThrow();
  const material = step.materials[0];
  expect(model.getArticle(material.articleId)!.procedureIds).toContain('procedure-ils-master-data');
  material.procedureIds = ['procedure-ils-master-data'];
  expect(() => model.validateContent(store)).toThrow(/fachlichen Aufgabe/);
  material.procedureIds = ['procedure-system-master-data'];
  model.validateContent(store);
  // Explicit reuse: the same permissions task and procedure are linked to three distinct steps.
  for (const id of ['step-2-7', 'step-2-11', 'step-2-15']) {
    const shared = store.processes[0].steps.find((s) => s.id === id)!;
    expect(shared.taskIds).toContain('fn-project-permissions');
    expect(
      shared.materials.some((m) => m.procedureIds?.includes('procedure-permissions')),
    ).toBeTruthy();
  }
  const task = store.tasks.find((t) => t.id === 'fn-system-definition')!;
  task.materials = [{ ...material, procedureIds: ['procedure-ils-master-data'] }];
  expect(() => model.validateContent(store)).toThrow(/fachlichen Aufgabe/);
});

test('relationship resolver and validation share navigable target types and URLs', () => {
  const store = structuredClone(model.content);
  for (const context of ['task', 'topic', 'procedure'] as const) {
    for (const [id, kind, title, href] of [
      [
        'guide-project-objectives',
        'article',
        model.getArticle('guide-project-objectives')!.title,
        '#/artikel/guide-project-objectives',
      ],
      [
        'fn-system-definition',
        'task',
        model.getTask('fn-system-definition')!.title,
        '#/aufgabe/fn-system-definition',
      ],
      ['step-2-8', 'step', '2.8 ' + model.getStep('step-2-8')!.title, '#/schritt/step-2-8'],
      [
        'procedure-system-master-data',
        'procedure',
        model.getProcedure('procedure-system-master-data')!.title,
        '#/bedienweg/procedure-system-master-data',
      ],
      ['R1B-06', 'topic', store.topics.find((t) => t.id === 'R1B-06')!.title, '#/thema/R1B-06'],
    ])
      expect(model.resolveRelationshipTarget(id, context, store)).toEqual({ kind, title, href });
    expect(model.resolveRelationshipTarget('unknown', context, store)).toBeUndefined();
    expect(model.resolveRelationshipTarget('tm', context, store)).toBeUndefined();
  }
  for (const objects of [store.tasks, store.topics, store.procedures]) {
    const object = objects[0];
    const original = object.relationships;
    for (const targetId of ['guide-project-objectives', 'fn-system-definition', 'step-2-8']) {
      object.relationships = [{ targetId, relation: 'related' }];
      expect(() => model.validateContent(store)).not.toThrow();
    }
    object.relationships = [{ targetId: 'tm', relation: 'related' }];
    expect(() => model.validateContent(store)).toThrow(/Kontext nicht unterstützt/);
    object.relationships = [{ targetId: 'unknown', relation: 'related' }];
    expect(() => model.validateContent(store)).toThrow(/Beziehung ohne Ziel/);
    object.relationships = original;
  }
});

test('process flows reject unknown or cross-process endpoints, missing evidence and duplicates', () => {
  const store = structuredClone(model.content);
  const process = store.processes[0];
  expect(process.flows).toHaveLength(66);
  for (const mutate of [
    () => {
      process.flows![0].from = 'missing';
    },
    () => {
      process.flows![0].to = 'pm';
    },
    () => {
      process.flows![0].sourceRefs = [];
    },
    () => {
      process.flows!.push(structuredClone(process.flows![0]));
    },
    () => {
      (process.flows![0] as unknown as { x: number }).x = 5;
    },
  ]) {
    process.flows = structuredClone(model.content.processes[0].flows);
    mutate();
    expect(() => model.validateContent(store)).toThrow();
  }
  process.flows = structuredClone(model.content.processes[0].flows);
  const otherStep = structuredClone(process.steps[0]);
  otherStep.id = 'other-process-step';
  store.processes.push({
    id: 'other-process',
    title: 'Test',
    description: 'Test',
    steps: [otherStep],
  });
  process.flows![0].to = otherStep.id;
  expect(() => model.validateContent(store)).toThrow(/Flow-Endpunkt/);
  delete process.flows;
  expect(() => model.validateContent(store)).not.toThrow();
});

test('multiple roles stay together, empty roles stay unassigned and layout never invents flows', () => {
  const store = structuredClone(model.content);
  const p = store.processes[0];
  p.steps[0].roleIds = ['tm', 'pm'];
  delete p.flows;
  model.validateContent(store);
  const before = structuredClone(p);
  const layout = model.getProcessLayout(p, store.roles);
  expect(layout.placements).toHaveLength(p.steps.length);
  expect(new Set(layout.placements.map((p) => p.step.id)).size).toBe(p.steps.length);
  expect(layout.placements[0].laneId).toBe('__shared');
  expect(layout.placements[0].step.roleIds).toEqual(['tm', 'pm']);
  expect(layout.placements.find((p) => p.step.id === 'step-5-1')!.laneId).toBe('__unassigned');
  expect(p).toEqual(before);
  expect(model.getProcessLayout(p, store.roles)).toEqual(layout);
  p.steps[0].roleIds.reverse();
  expect(model.getProcessLayout(p, store.roles).placements[0].column).toBe(
    layout.placements[0].column,
  );
  expect(model.stepHref('step-2-6', p.id, 'karte')).toBe(
    '#/schritt/step-2-6?prozess=projektabwicklung&ansicht=karte',
  );
});

test('every flow matches an explicit original Visio connector and mapped source titles', () => {
  const xml = visioPageXml();
  const process = model.content.processes[0];
  const normalize = (s: string) => s.replace(/\s+/g, '').toLowerCase();
  const shapes = new Map<string, string>();
  for (const match of xml.matchAll(
    /<Shape\s(?=[^>]*Master='4')([^>]+)>[\s\S]*?<Text>([\s\S]*?)<\/Text>/g,
  )) {
    if (!/Master='4'/.test(match[1])) continue;
    const id = /ID='([^']+)'/.exec(match[1])![1];
    const title = match[2].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&');
    const step = process.steps.find((s) => normalize(s.title) === normalize(title));
    expect(step, `Shape ${id}: ${title}`).toBeTruthy();
    shapes.set(id, step!.id);
  }
  expect(shapes.size).toBe(52);
  const connectors = new Map<string, Record<string, string>>();
  for (const match of xml.matchAll(/<Connect\s([^>]+)\/>/g)) {
    const attrs = Object.fromEntries(
      [...match[1].matchAll(/(\w+)='([^']*)'/g)].map((m) => [m[1], m[2]]),
    );
    const connector = connectors.get(attrs.FromSheet) ?? {};
    connector[attrs.FromCell] = attrs.ToSheet;
    connectors.set(attrs.FromSheet, connector);
  }
  const mapped = [...connectors.entries()].filter(
    ([, c]) => shapes.has(c.BeginX) && shapes.has(c.EndX),
  );
  expect(mapped).toHaveLength(66);
  for (const [id, endpoints] of mapped) {
    const flow = process.flows!.find((f) =>
      f.sourceRefs?.some((ref) => ref.includes(`Verbinder ${id},`)),
    );
    expect(flow).toBeTruthy();
    expect(flow!.from).toBe(shapes.get(endpoints.BeginX));
    expect(flow!.to).toBe(shapes.get(endpoints.EndX));
  }
});
