import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test, expect } from '@playwright/test';
import { careCases } from '../src/data/care-cases';
import { articles } from '../src/data/content';
import { issues, processSteps } from '../src/data/catalog';
import { sources } from '../src/data/sources';
import { sb1Coverage } from '../src/data/sb1-coverage';

test('care records resolve existing targets and immutable source evidence', () => {
  expect(new Set(careCases.map((entry) => entry.id)).size).toBe(careCases.length);
  for (const entry of careCases) {
    const claimIds = entry.claims.map((claim) => claim.id);
    expect(new Set(claimIds).size).toBe(claimIds.length);
    for (const snapshot of entry.sourceSnapshots) {
      const source = sources.find((candidate) => candidate.id === snapshot.sourceId)!;
      expect(source).toBeDefined();
      expect(snapshot.sha256).toMatch(/^[A-F0-9]{64}$/);
      expect(
        createHash('sha256').update(readFileSync(source.filename)).digest('hex').toUpperCase(),
      ).toBe(snapshot.sha256);
    }
    for (const ref of [
      ...entry.historicalQuestion.evidence,
      ...entry.claims.flatMap((claim) => claim.evidence),
    ]) {
      expect(
        entry.sourceSnapshots.some((snapshot) => snapshot.sourceId === ref.sourceId),
      ).toBeTruthy();
      expect(ref.locator.trim()).not.toBe('');
    }
    for (const impact of entry.impacts) {
      impact.claimIds.forEach((id) => expect(claimIds).toContain(id));
      const target = impact.target;
      if (target.kind === 'document') expect(existsSync(resolve(target.path))).toBeTruthy();
      else if (target.kind === 'article')
        expect(articles.some((article) => article.id === target.id)).toBeTruthy();
      else if (target.kind === 'procedure')
        expect(
          articles.some((article) =>
            article.knowledge?.procedures.some((procedure) => procedure.id === target.id),
          ),
        ).toBeTruthy();
      else if (target.kind === 'issue')
        expect(issues.some((issue) => issue.id === target.id)).toBeTruthy();
      else expect(processSteps.some((step) => step.id === target.id)).toBeTruthy();
    }
    for (const recorded of [
      ...entry.historicalAdoption.articleRevisions,
      ...entry.change.baseline.articleRevisions,
      ...(entry.change.implementation?.articleRevisions ?? []),
    ]) {
      expect(
        articles
          .find((article) => article.id === recorded.articleId)
          ?.revisions?.some((revision) => revision.number === recorded.revision),
      ).toBeTruthy();
    }
  }
});

test('EDC reconstruction separates current consent, historical adoption and confirmation', () => {
  const entry = careCases.find((candidate) => candidate.id === 'care-start-date-edc')!;
  expect(entry.origin).toBe('reconstruction');
  expect(entry.observation).toBeNull();
  expect(entry.claims.map((claim) => claim.confirmation)).toEqual([
    'documented-confirmation',
    'documented-confirmation',
    'implementation-unconfirmed',
  ]);
  expect(entry.claims[2].confirmedOn).toBeNull();
  for (const claim of entry.claims) {
    expect(claim.scope.release).toBeNull();
    expect(claim.scope.environment).toBeNull();
    expect(claim.unknowns.length).toBeGreaterThan(0);
  }
  expect(entry.historicalAdoption.decisionEvidence).toBeNull();
  expect(entry.practicalEvidence).toEqual([]);
  expect(entry.change.decision.status).toBe('accepted');
  expect(entry.change.decision.date).toBe('2026-09-28');
  expect(existsSync(entry.change.decision.record!.split('#')[0])).toBeTruthy();
  expect(
    entry.impacts
      .filter((impact) => impact.relation === 'candidate')
      .map((impact) => impact.target),
  ).toEqual([
    { kind: 'article', id: 'guide-project-handover' },
    { kind: 'article', id: 'guide-project-objectives' },
    { kind: 'article', id: 'guide-project-organization' },
  ]);
  const master = articles.find((article) => article.id === 'guide-project-master-data')!;
  const sub = articles.find((article) => article.id === 'guide-subproject-definition')!;
  for (const article of [master, sub]) {
    expect(article.status).toBe('source-draft');
    expect(article.reviews).toEqual([]);
  }
  expect(master.revisions!.map((revision) => revision.number)).toEqual([1, 2, 3]);
  expect(master.revisions![2].sources).toEqual(master.revisions![1].sources);
  expect(sub.revisions!.at(-1)!.number).toBe(2);
  expect(issues.find((issue) => issue.id === 'issue-f-r1-open-05')!.status).toBe('GEKLÄRT');
  for (const number of ['2.1', '2.8', '2.12']) {
    const coverage = sb1Coverage.find((item) => item.number === number)!;
    expect(coverage.issueIds).not.toContain('issue-f-r1-open-05');
    expect(coverage.issueIds).toContain('issue-definition-configuration');
  }
});

test('direct Start Date evidence is readable without claiming a procedure approval', async ({
  page,
}) => {
  await page.goto('/#/artikel/guide-project-master-data');
  const procedure = page.locator('#procedure-project-master-data');
  await expect(procedure).toContainText('C23 · Punkt 1 (nur Start Date / EDC)');
  await expect(procedure).toContainText('EDC ist unabhängig');
  await expect(page.locator('#einschraenkungen')).toContainText('EDC-Feld');
  await expect(page.locator('.demo-note')).toContainText('Quellenbasierter Entwurf');
});
