import { test, expect } from '@playwright/test';
import { articles, learningPaths } from '../src/data/content';
import { knowledgeFor } from '../src/lib/knowledge';

const articleId = 'guide-save-publish-checkin';
const articleTitle = 'Speichern, Veröffentlichen und Einchecken im passenden Kontext';
const guideIds = ['guide-project-permissions', 'guide-deliverables-milestones'];

test('crosscut article keeps list and PDP alternatives distinct and preserves demo paths', () => {
  const article = articles.find((item) => item.id === articleId)!;
  expect(article.status).toBe('source-draft');
  expect(article.reviews).toEqual([]);
  expect(article.related).toEqual(guideIds);
  for (const id of guideIds) {
    expect(articles.find((item) => item.id === id)?.related).toContain(articleId);
  }

  const [list, pdp, project, owner] = article.knowledge!.procedures;
  expect(article.knowledge!.procedures.map((p) => p.id)).toEqual([
    'procedure-save-deliverables-list',
    'procedure-save-payment-terms-pdp',
    'procedure-save-project-plan',
    'procedure-save-owner-change',
  ]);
  const deliveryGuide = articles.find((item) => item.id === guideIds[1])!;
  const accessGuide = articles.find((item) => item.id === guideIds[0])!;
  const deliveryProcedures = deliveryGuide.knowledge!.procedures;
  const sourceOwner = accessGuide.knowledge!.procedures.find(
    (p) => p.id === 'procedure-owner-change',
  )!;
  expect(list.functionId).toBe('fn-deliverables');
  expect(pdp.functionId).toBe('fn-payment-terms');
  expect(list.actions).toEqual([
    deliveryProcedures.find((p) => p.id === 'procedure-deliverables')!.actions[2],
  ]);
  expect(pdp.actions).toEqual([
    deliveryProcedures.find((p) => p.id === 'procedure-payment-terms')!.actions[2],
  ]);
  expect(list.trigger).toContain('List of Deliverables');
  expect(pdp.trigger).toContain('PDP Contract');
  for (const procedure of [list, pdp]) {
    expect(procedure.actions.map((action) => action.text).join(' ')).not.toMatch(
      /veröffentlichen|publish|check-in|einchecken/i,
    );
  }
  expect(project.actions.map((action) => action.text).join(' ')).toMatch(
    /speichern.*veröffentlichen.*checken.*ein.*veröffentlichten Stand/i,
  );
  expect(owner.requiredRights).toEqual(sourceOwner.requiredRights);
  expect(owner.actions).toEqual(sourceOwner.actions.slice(0, 3));
  expect(owner.checkQuestions).toEqual(sourceOwner.checkQuestions);
  expect(owner.actions.map((action) => action.text).join(' ')).toMatch(
    /vor dem Owner-Wechsel.*Speichern.*Check-in/i,
  );
  expect(owner.actions.map((action) => action.text).join(' ')).not.toMatch(
    /veröffentlichen|publish/i,
  );
  expect([list, pdp, project].map((p) => p.relatedArticleId)).toEqual([
    guideIds[1],
    guideIds[1],
    guideIds[1],
  ]);
  expect(owner.relatedArticleId).toBe(guideIds[0]);
  expect(sourceOwner.relatedArticleId).toBe(articleId);
  expect(
    deliveryProcedures.find((p) => p.id === 'procedure-payment-milestones')?.relatedArticleId,
  ).toBe(articleId);
  for (const procedure of [list, pdp, project, owner]) {
    expect(procedure.checkQuestions.length).toBeGreaterThan(0);
    expect(procedure.checkQuestions.every((question) => question.endsWith('?'))).toBeTruthy();
    expect(procedure.evidence.length).toBeGreaterThan(0);
  }

  const issues = knowledgeFor(article).issues;
  expect(issues.map((issue) => issue.id).sort()).toEqual([...article.knowledge!.issueIds].sort());
  expect(issues.map((issue) => issue.id)).toEqual(
    expect.arrayContaining(['issue-milestone-client', 'issue-f-r1-open-07', 'issue-f-r1-open-12']),
  );
  expect(article.knowledge!.evidence.some((ref) => ref.sourceId === 'B')).toBeTruthy();
  expect(learningPaths.map((path) => path.id)).toEqual(['einstieg', 'reporting', 'portfolio']);
  for (const path of learningPaths) {
    expect(path.lessons).not.toContain(articleId);
    expect(
      path.lessons.every((id) => articles.find((item) => item.id === id)?.status === 'demo'),
    ).toBeTruthy();
  }
});

test('crosscut article is searchable and linked from both real guides', async ({ page }) => {
  await page.goto('/#/wissen?q=Speichern%20Veröffentlichen%20Einchecken');
  const card = page.locator('.article-card').filter({
    has: page.getByRole('link', { name: articleTitle, exact: true }),
  });
  await expect(card).toBeVisible();
  await expect(card).toContainText('Quellenbasierter Entwurf');
  await expect(card.getByRole('link', { name: articleTitle, exact: true })).toHaveAttribute(
    'href',
    `#/artikel/${articleId}`,
  );

  for (const { id, procedureId } of [
    { id: guideIds[0], procedureId: 'procedure-owner-change' },
    { id: guideIds[1], procedureId: 'procedure-payment-milestones' },
  ]) {
    await page.goto(`/#/artikel/${id}`);
    if (id === 'guide-project-permissions') {
      await page.getByText('Inhalt und Artikelangaben', { exact: true }).click();
      await page.getByText('Beleg und ergänzende Anleitung', { exact: true }).first().click();
    } else {
      await page.getByText('Inhalt und Artikelangaben', { exact: true }).click();
      await page.locator(`#${procedureId}`).getByText('Beleg und ergänzende Anleitung').click();
    }
    const related = page.locator('.article-aside').getByRole('link', { name: articleTitle });
    await expect(related).toHaveAttribute('href', `#/artikel/${articleId}`);
    const contextual = page.locator(`#${procedureId}`).getByRole('link', { name: articleTitle });
    await expect(contextual).toHaveAttribute('href', `#/artikel/${articleId}`);
    await contextual.click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(articleTitle);
    await expect(page.locator(`.article-aside a[href="#/artikel/${id}"]`)).toBeVisible();
  }

  await page.goto(`/#/artikel/${articleId}`);
  for (const { procedureId, id } of [
    { procedureId: 'procedure-save-deliverables-list', id: guideIds[1] },
    { procedureId: 'procedure-save-payment-terms-pdp', id: guideIds[1] },
    { procedureId: 'procedure-save-project-plan', id: guideIds[1] },
    { procedureId: 'procedure-save-owner-change', id: guideIds[0] },
  ]) {
    await expect(page.locator(`#${procedureId} a[href="#/artikel/${id}"]`)).toBeVisible();
  }
});

test('crosscut article shows distinct actions, questions, open issues and source references', async ({
  page,
}) => {
  await page.goto(`/#/artikel/${articleId}`);
  await expect(page.locator('.demo-note')).toContainText('Quellenbasierter Entwurf');

  const list = page.locator('#procedure-save-deliverables-list');
  await expect(list).toContainText('Speichern Sie die Liste');
  await expect(list).not.toContainText('Speichern Sie die Eingaben');
  await expect(list).not.toContainText(/veröffentlichen|publish|check-in|einchecken/i);

  const pdp = page.locator('#procedure-save-payment-terms-pdp');
  await expect(pdp).toContainText('Speichern Sie die Eingaben');
  await expect(pdp).not.toContainText('Speichern Sie die Liste');
  await expect(pdp).not.toContainText(/veröffentlichen|publish|check-in|einchecken/i);

  const project = page.locator('#procedure-save-project-plan');
  await expect(project.locator('ol.steps')).toContainText(
    /speichern.*veröffentlichen.*checken.*ein/i,
  );
  await expect(project).toContainText('veröffentlichten Stand');

  const owner = page.locator('#procedure-save-owner-change');
  await expect(owner).toContainText('vor dem Owner-Wechsel');
  await expect(owner).toContainText('Check-in');
  await expect(owner).not.toContainText(/veröffentlichen|publish/i);

  await expect(page.locator('#ergebnispruefung')).toContainText('Prüffragen');
  await expect(page.locator('#ergebnispruefung')).toContainText(
    'Entspricht der veröffentlichte Stand den geprüften Planangaben?',
  );
  await expect(page.locator('#einschraenkungen')).toContainText(
    'Schulungsumgebung und Client-Voraussetzungen prüfen',
  );
  await expect(page.locator('#einschraenkungen')).toContainText('VERIFIKATION ERFORDERLICH');
  await expect(page.locator('#einschraenkungen .source-ref').first()).not.toBeEmpty();
  await expect(page.locator('#quellen')).toContainText('SB1-Handbuch');
  await expect(page.locator('#quellen')).toContainText('R1-Funktionsmatrix');
  const sectionIds = await page
    .locator('.article-content > section[id]')
    .evaluateAll((nodes) => nodes.map((node) => node.id));
  expect(sectionIds.slice(0, 6)).toEqual([
    'kurzantwort',
    'voraussetzungen',
    'einschraenkungen',
    'bedienweg',
    'ergebnispruefung',
    'nachweise',
  ]);
});

test('reading the new article leaves existing demo learning state intact', async ({ page }) => {
  const original = {
    version: 1,
    bookmarks: [],
    read: ['ippm-verstehen', 'projekt-anlegen', 'arbeitspakete'],
    passed: ['einstieg'],
  };
  await page.goto('/');
  await page.evaluate(
    (state) => localStorage.setItem('ippm-learning-v1', JSON.stringify(state)),
    original,
  );
  await page.goto(`/#/artikel/${articleId}`);
  await page.reload();
  await page.getByRole('button', { name: 'Als gelesen markieren', exact: true }).click();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('ippm-learning-v1')!))).toEqual({
    ...original,
    read: [...original.read, articleId],
  });
  await page.goto('/#/lernpfade/einstieg');
  await expect(page.getByRole('heading', { name: 'Diese Seite gibt es nicht' })).toBeVisible();
});
