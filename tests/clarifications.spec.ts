import { test, expect } from '@playwright/test';
import { articles } from '../src/data/content';
import { issues, trainingAssignments } from '../src/data/catalog';
import { knowledgeFor } from '../src/lib/knowledge';
import { searchArticles } from '../src/lib/search';

test('dated decisions close only confirmed questions and preserve technical residuals', () => {
  const master = articles.find((a) => a.id === 'guide-project-master-data')!;
  expect(master.takeaway).toContain('wechselseitig synchronisiert');
  expect(master.takeaway).toContain('EDC ist unabhängig');
  expect(issues.find((i) => i.id === 'issue-f-r1-open-05')?.status).toBe('GEKLÄRT');
  expect(knowledgeFor(master).issues.map((i) => i.id)).not.toContain('issue-f-r1-open-05');
  expect(
    knowledgeFor(master).issues.find((i) => i.id === 'issue-definition-configuration')?.limitation,
  ).toContain('EDC-Feld');
  expect(issues.find((i) => i.id === 'issue-f-r1-open-06')?.status).toBe('GEKLÄRT');
  expect(issues.find((i) => i.id === 'issue-f-r1-open-08')?.title).toBe(
    'Große Lieferlisten praktikabel darstellen',
  );
  expect(issues.find((i) => i.id === 'issue-build-sync')?.status).not.toBe('GEKLÄRT');
  expect(
    trainingAssignments.filter((t) => t.subject.id === 'fn-build-team').every((t) => t.included),
  ).toBeTruthy();
  const sub = articles.find((a) => a.id === 'guide-subproject-definition')!;
  const actions = sub.knowledge!.procedures.flatMap((p) => p.actions.map((a) => a.text)).join(' ');
  expect(actions).not.toContain('dokumentieren Sie den Project Purpose');
  expect(actions).toContain('ausstehende Konfigurationsänderung');
  for (const query of ['Hard Links', 'Makros', 'Publish-Schnellzugriff']) {
    expect(searchArticles(query, 'Alle Themen', 'pm').map((a) => a.id)).toContain(
      'guide-save-publish-checkin',
    );
  }
});

test('current decisions are visible without reopening closed warnings', async ({ page }) => {
  await page.goto('/#/artikel/guide-project-master-data');
  await expect(page.locator('#kurzantwort')).toContainText('wechselseitig synchronisiert');
  await expect(page.locator('#einschraenkungen')).not.toContainText(
    'Feldbedeutung und Übernahme offen',
  );
  await page.goto('/#/artikel/guide-phases-tailoring');
  await expect(page.locator('#kurzantwort')).toContainText('einmal pro Kalenderjahr');
  await expect(page.locator('#kurzantwort')).toContainText(
    '12-Monats-Rhythmus ist nicht beschlossen',
  );
  await page.goto('/#/artikel/guide-r1-reporting');
  await expect(page.locator('#kurzantwort')).toContainText('PSPV.org und WW umgesetzt');
  await page.goto('/#/artikel/guide-save-publish-checkin');
  await expect(page.getByRole('heading', { name: 'Hard Links nicht nutzen' })).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Makro-Hinweis beim Client-Start' }),
  ).toBeVisible();
});
