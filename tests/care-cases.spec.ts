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
  expect(sub.revisions!.find((revision) => revision.number === 2)!.sources).toEqual(
    master.revisions![1].sources,
  );
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

test('N28 adoption keeps receipt, consent, confirmation and practical evidence separate', () => {
  const entry = careCases.find((item) => item.id === 'care-project-purpose-wbs-2026-09-28')!;
  expect(entry.origin).toBe('new-insight');
  expect(entry.recordedOn).toBe('2026-09-28');
  expect(entry.observation).toContain('Keine eigene Systembeobachtung');
  expect(entry.claims).toHaveLength(3);
  for (const claim of entry.claims) {
    expect(claim.text).toContain('Laut Auftraggebermeldung');
    expect(claim.confirmation).toBe('unconfirmed');
    expect(claim.confirmedOn).toBeNull();
    expect(claim.scope.release).toBeNull();
    expect(claim.scope.environment).toBeNull();
    expect(claim.unknowns.length).toBeGreaterThan(1);
    expect(claim.evidence.map((ref) => ref.sourceId)).toEqual(['N28', 'TTT', 'C23']);
  }
  expect(entry.practicalEvidence).toEqual([]);
  expect(entry.change.decision.status).toBe('accepted');
  expect(entry.change.decision.scope).toContain('Keine fachliche Bestätigung');
  expect(existsSync(entry.change.decision.record!.split('#')[0])).toBeTruthy();
  expect(entry.change.implementation!.articleRevisions).toEqual([
    { articleId: 'guide-subproject-definition', revision: 3 },
  ]);
  const source = sources.find((item) => item.id === 'N28')!;
  expect(source.status).toContain('Datum ist Eingang');
  expect(source.status).toContain('Freigabeunterlagen liegen nicht vor');

  const sub = articles.find((item) => item.id === 'guide-subproject-definition')!;
  expect(sub.status).toBe('source-draft');
  expect(sub.reviews).toEqual([]);
  expect(sub.revisions!.map((revision) => revision.number)).toEqual([1, 2, 3]);
  expect(sub.revisions![2].sources).toEqual([
    ...sub.revisions![1].sources,
    { sourceId: 'N28', sha256: source.sha256 },
  ]);
  expect(sub.revisions!.slice(0, 2).flatMap((r) => r.sources.map((s) => s.sourceId))).not.toContain(
    'N28',
  );
  for (const procedure of sub.knowledge!.procedures) {
    expect(procedure.evidence.some((ref) => ref.sourceId === 'N28')).toBe(
      ['procedure-system-scope', 'procedure-ils-scope'].includes(procedure.id),
    );
  }
  const candidates = entry.impacts.filter(
    (impact) => impact.relation === 'candidate' && impact.target.kind === 'article',
  );
  for (const candidate of candidates) {
    if (candidate.target.kind !== 'article') continue;
    const article = articles.find((item) => item.id === candidate.target.id)!;
    expect(article.revisions!.flatMap((r) => r.sources.map((s) => s.sourceId))).not.toContain(
      'N28',
    );
    expect(article.knowledge!.evidence.some((ref) => ref.sourceId === 'N28')).toBe(false);
  }
  const configuration = issues.find((item) => item.id === 'issue-definition-configuration')!;
  expect(configuration.status).toBe('VERIFIKATION ERFORDERLICH');
  for (const residual of [
    'EDC-Feld',
    'Bestandsprojekten',
    'Objectives-Zielklassen',
    'Initialstatus',
  ]) {
    expect(configuration.limitation).toContain(residual);
  }
  for (const number of ['2.9', '2.13']) {
    expect(sb1Coverage.find((item) => item.number === number)!.issueIds).toContain(
      configuration.id,
    );
  }
  const boundary = issues.find((item) => item.id === 'issue-phases-tailoring-boundary')!;
  expect(boundary.limitation).toContain('ProjectLink');
  expect(boundary.limitation).toContain('Hard Links nicht nutzen und nicht schulen');
});

test('both subproject scope variants show N28 as a report while residuals remain visible', async ({
  page,
}) => {
  await page.goto('/#/artikel/guide-subproject-definition');
  for (const variant of ['system', 'ils']) {
    const procedure = page.locator(`#procedure-${variant}-scope`);
    await expect(procedure).toContainText('Laut Auftraggebermeldung (Eingang 28.09.2026)');
    await expect(procedure).toContainText(
      'Prüfunterlagen, Release, Umgebung und genauer PDP-Umfang liegen nicht vor',
    );
    await expect(procedure).toContainText('N28 · Punkt 1 (gemeldete Entfernung und Prüfung)');
    await expect(procedure).toContainText('Scope');
    await expect(procedure).toContainText('Base Products');
    await expect(procedure).not.toContainText('ausstehende Konfigurationsänderung');
  }
  await expect(page.locator('#einschraenkungen')).toContainText('EDC-Feld');
  await expect(page.locator('#einschraenkungen')).toContainText('Belegabgleich offen');
  await expect(page.locator('.demo-note')).toContainText('Quellenbasierter Entwurf');
});
