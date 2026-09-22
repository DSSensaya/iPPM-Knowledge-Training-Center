import { test, expect } from '@playwright/test';
import { articles, learningPaths, processes } from '../src/data/content';
import {
  functions,
  processSteps,
  processCatalog,
  scopeItems,
  releases,
  stages,
  roleCatalog,
  assessments,
  issues,
  releaseAssignments,
  trainingAssignments,
  trainingBlocks,
} from '../src/data/catalog';
import { sources } from '../src/data/sources';
import { articleEvidence, forSubjects, knowledgeFor } from '../src/lib/knowledge';
import { searchArticles } from '../src/lib/search';
import type { Assessment, EvidenceRef, ReleaseAssignment, SubjectRef } from '../src/data/domain';

test('curated knowledge has unique IDs and complete source and relationship references', () => {
  const unique = (items: { id: string }[]) =>
    expect(new Set(items.map((i) => i.id)).size).toBe(items.length);
  const has = (items: { id: string }[], id: string) =>
    expect(
      items.some((i) => i.id === id),
      `Missing ${id}`,
    ).toBeTruthy();
  const procedures = articles.flatMap((a) => a.knowledge?.procedures ?? []);
  const records = {
    function: functions,
    step: processSteps,
    scope: scopeItems,
    procedure: procedures,
  };
  const subject = (s: SubjectRef) => has(records[s.kind], s.id);
  const evidence = (refs: EvidenceRef[]) => {
    expect(refs.length).toBeGreaterThan(0);
    for (const r of refs) {
      has(sources, r.sourceId);
      expect(r.locator.trim()).not.toBe('');
    }
  };
  for (const items of [
    articles,
    learningPaths,
    processes,
    functions,
    processSteps,
    processCatalog,
    scopeItems,
    releases,
    stages,
    roleCatalog,
    assessments,
    issues,
    releaseAssignments,
    trainingAssignments,
    trainingBlocks,
    sources,
    procedures,
  ])
    unique(items);
  for (const s of sources) expect(s.sha256).toMatch(/^[A-F0-9]{64}$/);
  for (const s of scopeItems) evidence(s.evidence);
  for (const f of functions) {
    evidence(f.evidence);
    f.roleIds.forEach((id) => has(roleCatalog, id));
    f.scopeLinks.forEach((s) => {
      has(scopeItems, s.scopeId);
      evidence(s.evidence);
    });
  }
  for (const s of processSteps) {
    has(processCatalog, s.processId);
    has(roleCatalog, s.roleId);
    s.functionIds.forEach((id) => has(functions, id));
    evidence(s.evidence);
  }
  for (const s of stages) has(releases, s.releaseId);
  for (const a of assessments) {
    subject(a.subject);
    evidence(a.evidence);
    a.issueIds.forEach((id) => has(issues, id));
  }
  for (const i of issues) {
    i.subjects.forEach(subject);
    evidence(i.evidence);
  }
  for (const r of releaseAssignments) {
    subject(r.subject);
    has(stages, r.stageId);
    evidence(r.evidence);
  }
  for (const t of trainingAssignments) {
    subject(t.subject);
    has(trainingBlocks, t.blockId);
    evidence(t.evidence);
  }
  for (const a of articles) {
    a.related.forEach((id) => has(articles, id));
    if (!a.knowledge) continue;
    a.knowledge.functionIds.forEach((id) => has(functions, id));
    a.knowledge.stepIds.forEach((id) => has(processSteps, id));
    a.knowledge.issueIds.forEach((id) => has(issues, id));
    a.roles.forEach((id) => has(roleCatalog, id));
    for (const p of a.knowledge.procedures) {
      has(functions, p.functionId);
      evidence(p.evidence);
      expect(p.actions.length).toBeGreaterThan(0);
    }
    evidence(articleEvidence(a));
  }
  learningPaths.forEach((p) => p.lessons.forEach((id) => has(articles, id)));
  processes.forEach((p) => p.phases.forEach((s) => has(articles, s.article)));
});

test('new evidence preserves conflicting training statements and bounded technical evidence', () => {
  const guide = articles.find((a) => a.id === 'guide-project-permissions')!;
  const data = knowledgeFor(guide);
  const build = data.training.filter((a) => a.subject.id === 'fn-build-team');
  expect(build.map((a) => [a.evidence[0].sourceId, a.included])).toEqual([
    ['T', false],
    ['B', true],
  ]);
  const owner = data.assessments.filter((a) => a.subject.id === 'fn-owner-change');
  expect(owner.find((a) => a.dimension === 'technical')?.evidence[0].sourceId).toBe('F');
  expect(owner.find((a) => a.dimension === 'procedure-description')?.value).toBe('described-draft');
  expect(data.issues.some((i) => i.id === 'issue-build-sync')).toBeTruthy();
  expect(guide.knowledge!.status).toBe('source-draft');
  const procedure = guide.knowledge!.procedures.find((p) => p.id === 'procedure-owner-change')!;
  expect(procedure.requiredRights).toEqual([
    'Open the project',
    'View the Project Summary in the Project Center',
    'View the Project Schedule Details',
    'View the Project Site',
  ]);
  expect(procedure.actions[0].text).toContain('vor dem Owner-Wechsel');
  expect(data.releases.filter((r) => r.basis === 'current-scope').map((r) => r.subject.id)).toEqual(
    ['R1-06', 'R1-07', 'R1-23'],
  );
  expect(data.releases.find((r) => r.id === 'historic-team')?.basis).toBe('historical-plan');
});

test('source selection keeps disagreements, unknown values and distinct assessment scopes', () => {
  // Regression fixtures from proposal: no unrelated functions are added to the live catalog.
  const rows: Assessment[] = [
    {
      id: 'request-f',
      subject: { kind: 'function', id: 'request' },
      dimension: 'training',
      originalValue: 'nicht im aktuellen Schulungsumfang',
      value: 'unknown',
      scope: 'vollständiger Beantragungsweg',
      environment: null,
      issueIds: [],
      evidence: [{ sourceId: 'F', locator: 'R1 Funktionsmatrix!A6:J6', derivation: 'direct' }],
    },
    {
      id: 'request-t',
      subject: { kind: 'function', id: 'request' },
      dimension: 'training',
      originalValue: 'Freigabefähig mit Hinweis',
      value: 'qualified',
      scope: 'SB1',
      environment: null,
      issueIds: [],
      evidence: [{ sourceId: 'T', locator: 'Release1-Matrix!A3:Q3', derivation: 'direct' }],
    },
    {
      id: 'escalation-t',
      subject: { kind: 'function', id: 'escalation' },
      dimension: 'training',
      originalValue: 'Freigabefähig',
      value: 'qualified',
      scope: 'Erfassung ohne Empfängerbearbeitung',
      environment: null,
      issueIds: [],
      evidence: [{ sourceId: 'T', locator: 'PDP-Abdeckung!A16:H16', derivation: 'direct' }],
    },
    {
      id: 'escalation-f',
      subject: { kind: 'function', id: 'escalation' },
      dimension: 'training',
      originalValue: 'noch nicht schulungsfähig',
      value: 'partial',
      scope: 'vollständiger Empfängerweg',
      environment: null,
      issueIds: [],
      evidence: [{ sourceId: 'F', locator: 'R1 Funktionsmatrix!A30:J30', derivation: 'direct' }],
    },
  ];
  const before = structuredClone(rows);
  expect(forSubjects(rows, [{ kind: 'function', id: 'request' }])).toEqual(rows.slice(0, 2));
  expect(forSubjects(rows, [{ kind: 'function', id: 'escalation' }]).map((a) => a.scope)).toEqual([
    'Erfassung ohne Empfängerbearbeitung',
    'vollständiger Empfängerweg',
  ]);
  expect(rows).toEqual(before);
  expect(rows[0].environment).toBeNull();
  // Exact subject joins cannot infer a Power BI dependency from a shared CAP-08 grouping.
  const scope = [
    { subject: { kind: 'scope' as const, id: 'R1-25' }, tool: 'PDP Status', group: 'CAP-08' },
    { subject: { kind: 'scope' as const, id: 'R1B-02' }, tool: 'Power BI', group: 'CAP-08' },
  ];
  expect(forSubjects(scope, [{ kind: 'scope', id: 'R1-25' }]).map((r) => r.tool)).toEqual([
    'PDP Status',
  ]);
  // Historical infrastructure targets cannot overwrite the current detailed scope.
  const reporting: ReleaseAssignment[] = [
    {
      id: 'current-powerbi',
      subject: { kind: 'function', id: 'powerbi' },
      stageId: 'R1B',
      basis: 'current-scope',
      aspect: 'Power-BI-Berichte',
      evidence: [{ sourceId: 'S', locator: '02_SCOPE_ID_MASTER!A29:L29', derivation: 'direct' }],
    },
    {
      id: 'historic-powerbi',
      subject: { kind: 'function', id: 'powerbi' },
      stageId: 'R1',
      basis: 'historical-plan',
      aspect: 'Infrastruktur und Nutzungsmöglichkeit',
      evidence: [{ sourceId: 'H', locator: 'Release-Tabelle, Zeile 2', derivation: 'direct' }],
    },
  ];
  const selected = forSubjects(reporting, [{ kind: 'function', id: 'powerbi' }]);
  expect(selected).toHaveLength(2);
  expect(selected.filter((r) => r.basis === 'current-scope').map((r) => r.stageId)).toEqual([
    'R1B',
  ]);
  expect(selected.filter((r) => r.basis === 'historical-plan').map((r) => r.stageId)).toEqual([
    'R1',
  ]);
});

test('search aliases and legacy filters remain independent of release or learning completion', () => {
  for (const query of ['Project Permissions', '2.11', 'TM', 'R1-06', 'System Overview']) {
    expect(searchArticles(query).some((a) => a.id === 'guide-project-permissions')).toBeTruthy();
  }
  for (const role of ['pm', 'tm', 'ilsm'] as const)
    expect(searchArticles('Zugriffsrechte', 'Alle Themen', role)).toHaveLength(2);
  expect(
    searchArticles('', 'Alle Themen', 'Projektleitung').every((a) => !a.knowledge),
  ).toBeTruthy();
  expect(
    learningPaths
      .flatMap((p) => p.lessons)
      .some((id) => id.startsWith('guide-') || id.startsWith('faq-')),
  ).toBeFalsy();
});
