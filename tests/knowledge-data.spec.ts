import { test, expect } from '@playwright/test';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import { articles, learningPaths, processes, recommendedArticleIds } from '../src/data/content';
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
  knowledgeLinks,
  processViews,
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
    knowledgeLinks,
    processViews,
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
  for (const link of knowledgeLinks) {
    subject(link.from);
    subject(link.to);
    evidence(link.evidence);
  }
  for (const view of processViews) {
    has(articles, view.articleId);
    view.stepIds.forEach((id) => has(processSteps, id));
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
    a.knowledge.linkIds?.forEach((id) => has(knowledgeLinks, id));
    a.roles.forEach((id) => has(roleCatalog, id));
    for (const p of a.knowledge.procedures) {
      has(functions, p.functionId);
      if (p.relatedArticleId) has(articles, p.relatedArticleId);
      evidence(p.evidence);
      expect(p.actions.length).toBeGreaterThan(0);
    }
    evidence(articleEvidence(a));
  }
  learningPaths.forEach((p) => p.lessons.forEach((id) => has(articles, id)));
  processes.forEach((p) => p.phases.forEach((s) => has(articles, s.article)));
  recommendedArticleIds.forEach((id) => has(articles, id));
});

test('v0.5 source paths and recorded file hashes match the local originals', () => {
  for (const source of sources) {
    const path = resolve(process.cwd(), source.filename);
    expect(path.startsWith(`${resolve(process.cwd(), 'sources')}${sep}`)).toBeTruthy();
    expect(createHash('sha256').update(readFileSync(path)).digest('hex').toUpperCase()).toBe(
      source.sha256,
    );
  }
});

test('v0.5 content states, revisions and review evidence remain distinct', () => {
  expect(articles.filter((a) => a.status === 'demo')).toHaveLength(9);
  expect(articles.filter((a) => a.status === 'source-draft')).toHaveLength(16);
  for (const article of articles) {
    if (article.status === 'demo') {
      expect(article.knowledge).toBeUndefined();
      continue;
    }
    expect(article.revisions.map((r) => r.number)).toEqual(
      article.revisions.map((_, index) => index + 1),
    );
    const current = article.revisions.at(-1)!;
    expect(current.date).toBe(article.updated);
    expect(current.note.trim()).not.toBe('');
    expect(current.sources.map((s) => s.sourceId).sort()).toEqual(
      [...new Set(articleEvidence(article).map((ref) => ref.sourceId))].sort(),
    );
    for (const snapshot of current.sources) {
      const source = sources.find((s) => s.id === snapshot.sourceId)!;
      expect(snapshot.sha256).toBe(source.sha256);
    }
    for (const review of article.reviews) {
      expect(article.revisions.some((r) => r.number === review.revision)).toBeTruthy();
      for (const field of [
        review.date,
        review.reviewer,
        review.subject,
        review.environment,
        review.record,
      ])
        expect(field.trim()).not.toBe('');
    }
    expect(article.status === 'reviewed').toBe(
      article.reviews.some((review) => review.revision === current.number),
    );
  }
});

test('v0.5 real packages keep issue, evidence and dependency references in scope', () => {
  const deliveryDecision = issues.find((i) => i.id === 'issue-f-r1-open-08')!;
  expect(deliveryDecision.status).toBe('TECHNISCH NOCH OFFEN');
  expect(deliveryDecision.evidence).toContainEqual({
    sourceId: 'F',
    locator: 'Klärungsbedarf!A12:D12',
    sourceKey: 'R1-OPEN-08',
    derivation: 'direct',
  });
  for (const article of articles.filter((a) => a.status !== 'demo')) {
    const knowledge = article.knowledge!;
    const data = knowledgeFor(article);
    const functionIds = new Set(knowledge.functionIds);
    const issueIds = new Set(knowledge.issueIds);
    expect(data.issues.map((i) => i.id).sort()).toEqual(
      knowledge.issueIds
        .filter((id) => issues.find((i) => i.id === id)?.status !== 'GEKLÄRT')
        .sort(),
    );
    for (const issue of data.issues) {
      expect(
        issue.subjects.some((s) => s.kind === 'function' && functionIds.has(s.id)),
      ).toBeTruthy();
    }
    for (const assessment of data.assessments) {
      for (const id of assessment.issueIds) expect(issueIds.has(id)).toBeTruthy();
    }
    for (const link of data.links) {
      expect(functionIds.has(link.from.id)).toBeTruthy();
      expect(functionIds.has(link.to.id)).toBeTruthy();
    }
    expect(articleEvidence(article).length).toBeGreaterThan(0);
  }
});

test('v0.4 keeps delivery and payment variants, scope, training and technical evidence distinct', () => {
  const guide = articles.find((a) => a.id === 'guide-deliverables-milestones')!;
  const data = knowledgeFor(guide);
  expect(guide.knowledge?.stepIds).toEqual(['step-2-2', 'step-2-5', 'step-3-1', 'step-3-2']);
  expect(data.training.filter((t) => t.included).map((t) => t.subject.id)).toEqual(
    guide.knowledge?.stepIds,
  );
  expect(data.links.map((link) => link.id)).toEqual([
    'link-terms-payment',
    'link-deliverables-delivery',
    'link-contract-payment',
  ]);
  expect(data.links.find((link) => link.id === 'link-contract-payment')?.condition).toBe(
    'Zahlung wird durch eine Lieferung ausgelöst',
  );
  const payment = guide.knowledge!.procedures.find((p) => p.id === 'procedure-payment-milestones')!;
  expect(
    payment.actions.some((a) => a.text.includes('keine künstliche Vorgänger-Verknüpfung')),
  ).toBeTruthy();
  expect(
    payment.actions.some((a) => a.text.includes('Zahlungsfrist als Zeitabstand')),
  ).toBeTruthy();
  expect(
    data.assessments
      .filter((a) => a.dimension === 'technical')
      .every((a) => a.value === 'partial' && a.evidence[0].sourceId === 'F'),
  ).toBeTruthy();
  expect(
    data.assessments
      .filter((a) => a.dimension === 'procedure-description')
      .every((a) => a.value === 'described-draft' && a.evidence[0].sourceId === 'B'),
  ).toBeTruthy();
  expect(data.releases.filter((r) => r.basis === 'current-scope').map((r) => r.subject.id)).toEqual(
    ['R1-03', 'R1-08', 'R1-10'],
  );
  expect(data.issues.some((i) => i.id === 'issue-f-r1-open-08')).toBeTruthy();
  expect(learningPaths.flatMap((p) => p.lessons)).not.toContain(guide.id);
  expect(searchArticles('Ext.Pay').some((a) => a.id === guide.id)).toBeTruthy();
  expect(searchArticles('3.2', 'Alle Themen', 'pm').some((a) => a.id === guide.id)).toBeTruthy();
});

test('confirmed SB1 assignment supersedes the old training restriction while rights remain bounded', () => {
  const guide = articles.find((a) => a.id === 'guide-project-permissions')!;
  const data = knowledgeFor(guide);
  const build = data.training.filter((a) => a.subject.id === 'fn-build-team');
  expect(build.map((a) => [a.evidence[0].sourceId, a.included])).toEqual([
    ['T', true],
    ['B', true],
  ]);
  const owner = data.assessments.filter((a) => a.subject.id === 'fn-owner-change');
  expect(owner.find((a) => a.dimension === 'technical')?.evidence[0].sourceId).toBe('F');
  expect(owner.find((a) => a.dimension === 'procedure-description')?.value).toBe('described-draft');
  expect(data.issues.some((i) => i.id === 'issue-build-sync')).toBeTruthy();
  expect(guide.status).toBe('source-draft');
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
  for (const role of ['pm', 'tm', 'ilsm'] as const) {
    const matches = searchArticles('Zugriffsrechte', 'Alle Themen', role);
    expect(matches).toHaveLength(3);
    expect(matches.map((article) => article.id)).toEqual(
      expect.arrayContaining(['guide-project-permissions', 'faq-role-vs-access']),
    );
  }
  expect(
    searchArticles('', 'Alle Themen', 'Projektleitung').every((a) => !a.knowledge),
  ).toBeTruthy();
  expect(
    learningPaths
      .flatMap((p) => p.lessons)
      .some((id) => id.startsWith('guide-') || id.startsWith('faq-')),
  ).toBeFalsy();
});
