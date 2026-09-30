import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { articles, learningPaths } from '../src/data/content';
import { definitionArticles } from '../src/data/definition-content';
import { sb1Coverage } from '../src/data/sb1-coverage';
import { knowledgeFor } from '../src/lib/knowledge';
import { searchArticles } from '../src/lib/search';

test('v0.6 adds nine definition steps and two orientation steps without claiming PMO execution', () => {
  expect(definitionArticles).toHaveLength(5);
  expect(definitionArticles.flatMap((a) => a.knowledge!.stepIds)).toEqual([
    'step-1-1',
    'step-1-2',
    'step-2-1',
    'step-2-3',
    'step-2-4',
    'step-2-8',
    'step-2-9',
    'step-2-10',
    'step-2-12',
    'step-2-13',
    'step-2-14',
  ]);
  expect(
    sb1Coverage.filter((item) => item.materialStatus === 'Reales Teilmaterial vorhanden'),
  ).toHaveLength(22);
  expect(sb1Coverage.filter((item) => item.materialStatus.startsWith('Orientierung'))).toHaveLength(
    2,
  );
  expect(
    sb1Coverage.filter((item) => !item.realMaterials.length).map((item) => item.number),
  ).toEqual([]);
  const orientation = definitionArticles.find((a) => a.id === 'guide-project-handover')!;
  expect(orientation.knowledge!.procedures.map((p) => p.id)).toEqual([
    'procedure-project-takeover',
  ]);
  expect(orientation.takeaway).toContain('vollständiger PMO-Durchlauf fehlt');
  const data = knowledgeFor(orientation);
  expect(data.training.filter((t) => t.subject.id === 'step-1-1').map((t) => t.included)).toEqual([
    true,
  ]);
  expect(
    data.training.filter((t) => t.subject.id === 'fn-project-request').map((t) => t.included),
  ).toEqual([false]);
  expect(
    data.assessments.find(
      (a) => a.subject.id === 'fn-project-request' && a.dimension === 'technical',
    )?.value,
  ).toBe('unknown');
  for (const article of definitionArticles) {
    expect(article.status).toBe('source-draft');
    expect(article.reviews).toEqual([]);
    expect(learningPaths.flatMap((path) => path.lessons)).not.toContain(article.id);
    expect(knowledgeFor(article).assessments.some((a) => a.value === 'verified')).toBeFalsy();
  }
});

test('role-specific searches find the relevant definition and preserve field and rights limitations', () => {
  for (const [query, role, id] of [
    ['EDC', 'pm', 'guide-project-master-data'],
    ['2.3', 'pm', 'guide-project-objectives'],
    ['Subcontractors', 'pm', 'guide-project-organization'],
    ['System Overview', 'tm', 'guide-subproject-definition'],
    ['ILS Scope', 'ilsm', 'guide-subproject-definition'],
    ['R1-01', 'pmo', 'guide-project-handover'],
  ] as const)
    expect(searchArticles(query, 'Alle Themen', role).map((a) => a.id)).toContain(id);
  const sub = definitionArticles.find((a) => a.id === 'guide-subproject-definition')!;
  expect(sub.knowledge!.procedures).toHaveLength(6);
  expect(sub.knowledge!.procedures.map((p) => p.actions[0].tool)).toEqual([
    'PDP System Overview',
    'PDP System Scope',
    'PDP System Organ.',
    'PDP ILS Overview',
    'PDP ILS Scope',
    'PDP ILS Organisation',
  ]);
  expect(knowledgeFor(sub).issues.map((i) => i.id)).toEqual(
    expect.arrayContaining([
      'issue-definition-configuration',
      'issue-definition-roles',
      'issue-f-r1-open-12',
    ]),
  );
});

test('definition tasks are reachable, keyboard navigable, accessible and local on both viewports', async ({
  page,
  baseURL,
}, testInfo) => {
  const errors: string[] = [],
    external: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== baseURL) external.push(request.url());
  });
  for (const article of definitionArticles) {
    await page.goto('/');
    await page
      .getByRole('region', { name: 'Mit einer Aufgabe beginnen' })
      .getByRole('link', { name: article.title, exact: true })
      .click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(article.title);
    const jumps = page.getByRole('navigation', { name: 'Direkt zu den Abschnitten' });
    await jumps.getByRole('button', { name: 'Kritische Einschränkungen' }).focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#einschraenkungen')).toBeFocused();
    await expect(page.locator('#einschraenkungen')).toContainText('keine Abnahme');
    await expect(page.locator('#ergebnispruefung')).toContainText('Prüffragen');
    await expect(page.locator('#trainerhinweise')).toContainText('fiktiv', { ignoreCase: true });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    ).toBeTruthy();
    expect(
      (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
        .violations,
    ).toEqual([]);
  }
  await page
    .getByRole('navigation', { name: 'Inhaltsverzeichnis' })
    .getByRole('button', { name: 'ILS-Leistungsumfang abgrenzen', exact: true })
    .click();
  await expect(page.locator('#procedure-ils-scope')).toBeFocused();
  await expect(page.locator('#procedure-ils-scope')).toContainText('Systementwicklung');
  await page.screenshot({
    path: `test-results/definition-${testInfo.project.name}.png`,
    fullPage: true,
  });
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});

test('SB1 orientation stays distinct and definition reading preserves an old completed demo path', async ({
  page,
}) => {
  await page.goto('/');
  const oldPath = learningPaths[0];
  await page.evaluate(
    ({ lessons, id }) =>
      localStorage.setItem(
        'ippm-learning-v1',
        JSON.stringify({ version: 1, bookmarks: ['statusbericht'], read: lessons, passed: [id] }),
      ),
    { lessons: oldPath.lessons, id: oldPath.id },
  );
  await page.reload();
  await page.goto('/#/prozesse');
  const entry = page.locator('[data-matrix-number="1.2"]');
  await expect(entry.locator('summary')).toContainText(
    'Orientierung vorhanden · kein Gesamtbedienweg',
  );
  await entry.locator('summary').click();
  await entry.getByRole('link').click();
  await expect(page.locator('#kurzantwort')).toContainText('vollständiger PMO-Durchlauf fehlt');
  await expect(page.locator('[id^="procedure-"]')).toHaveCount(1);
  await page.goto('/#/artikel/guide-project-objectives');
  await page.getByRole('button', { name: 'Beitrag merken', exact: true }).click();
  await page.getByRole('button', { name: 'Als gelesen markieren', exact: true }).click();
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Gelesen · Markierung entfernen', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('ippm-learning-v1')!));
  expect(saved.version).toBe(1);
  expect(saved.bookmarks).toEqual(['statusbericht', 'guide-project-objectives']);
  expect(saved.passed).toEqual([oldPath.id]);
  expect(saved.read).toEqual([...oldPath.lessons, 'guide-project-objectives']);
  expect(saved.read).not.toContain('guide-subproject-definition');
  expect(articles.find((a) => a.id === 'statusbericht')?.status).toBe('demo');
});
