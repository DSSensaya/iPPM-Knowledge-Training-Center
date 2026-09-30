import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { articles, visibleArticles } from '../src/data/content';
import { functions } from '../src/data/catalog';
import { careCases } from '../src/data/care-cases';
import { inventory } from '../src/data/inventory';
import { sb1Coverage } from '../src/data/sb1-coverage';
import { searchArticles } from '../src/lib/search';
import { knowledgeFor } from '../src/lib/knowledge';

test('bounded reporting reuses source inputs without inheriting approval or whole scope', () => {
  const article = visibleArticles.find((a) => a.id === 'guide-r1-reporting')!;
  expect(article.status).toBe('source-draft');
  expect(article.reviews).toEqual([]);
  expect(article.revisions.map((r) => r.number)).toEqual([1, 2, 3]);
  expect(article.revisions[2].sources).toEqual(article.revisions[1].sources);
  expect(article.knowledge!.procedures).toHaveLength(1);
  const procedure = article.knowledge!.procedures[0];
  expect(procedure.id).toBe('procedure-r1-reporting');
  expect(procedure.prerequisites.join(' ')).toContain(
    'fehlende Eingangsdaten nicht im Reporting erzeugen',
  );
  expect(procedure.actions.at(-1)!.text).toContain('endet der Weg mit einem offenen Prüfpunkt');
  expect(procedure.actions.map((a) => a.text).join(' ')).toContain('keine Statuswerte ändern');
  expect(procedure.evidence).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ sourceId: 'B', derivation: 'direct' }),
      expect.objectContaining({ sourceId: 'B', derivation: 'inferred' }),
      expect.objectContaining({ sourceId: 'C23' }),
      expect.objectContaining({ sourceId: 'T' }),
    ]),
  );
  expect(knowledgeFor(article).links.map((link) => [link.from.id, link.to.id])).toEqual([
    ['procedure-status-orientation', 'procedure-r1-reporting'],
    ['procedure-r1-reporting', 'procedure-save-project-plan'],
  ]);
  expect(functions.find((f) => f.id === 'fn-r1-reporting')!.scopeLinks).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ scopeId: 'R1-04', coverage: 'partial' }),
      expect.objectContaining({ scopeId: 'R1-05', coverage: 'partial' }),
    ]),
  );
  for (const id of ['step-4-13', 'FS-04', 'FS-05', 'R1-04', 'R1-05']) {
    const entry = inventory.find((e) => e.id === id)!;
    expect(entry.state).toBe('Teilweise belegt');
    expect(entry.articleIds).toContain(article.id);
  }
  expect(inventory.find((e) => e.id === procedure.id)?.state).toBe('Nutzbar');
  expect(sb1Coverage.find((row) => row.number === '4.13')?.materialStatus).toBe(
    'Reales Teilmaterial vorhanden',
  );
  expect(knowledgeFor(article).issues.map((i) => i.id)).not.toContain('issue-f-r1-open-10');
  for (const [id, revision] of [
    ['guide-status-orientation', 3],
    ['guide-save-publish-checkin', 3],
  ] as const)
    expect(articles.find((a) => a.id === id)?.revisions.at(-1)?.number).toBe(revision);
  const care = careCases.find((c) => c.id === 'care-r1-statusabgleich-2026-09-30')!;
  expect(care.practicalEvidence).toEqual([]);
  expect(care.change.decision.status).toBe('accepted');
  expect(care.change.implementation?.articleRevisions).toEqual([
    { articleId: article.id, revision: 3 },
  ]);
  for (const query of ['4.13', 'ML-Filter', 'veröffentlichter Plan', 'PDP Status'])
    expect(searchArticles(query, 'Alle Themen', 'pm').map((a) => a.id)).toContain(article.id);
});

test('catalog routes converge on the bounded comparison and retain status and client references', async ({
  page,
}) => {
  for (const id of ['step-4-13', 'FS-05', 'R1-05', 'R1-04', 'procedure-r1-reporting']) {
    await page.goto('/#/prozesse');
    await page.getByText('Katalog durchsuchen (Aufgabe oder ID)', { exact: true }).click();
    await page.getByLabel('Aufgabe oder Katalog-ID').fill(id);
    const entry = page.locator(`[data-inventory-id="${id}"]`);
    await entry.getByRole('link', { name: 'Projektreporting durchführen', exact: true }).click();
    await expect(page).toHaveURL(/#\/artikel\/guide-r1-reporting$/);
    await expect(page.locator('#procedure-r1-reporting')).toContainText('veröffentlichten Plan');
  }
  await page.getByRole('link', { name: 'Projektstatus ermitteln', exact: true }).click();
  await expect(page.locator('#procedure-status-orientation')).toContainText('PMO Status');
  await page.goBack();
  await page
    .getByRole('link', {
      name: 'Speichern, Veröffentlichen und Einchecken im passenden Kontext',
      exact: true,
    })
    .click();
  await expect(page.locator('#procedure-save-project-plan')).toContainText('veröffentlichen');
});

test('reporting puts comparison before source detail and distinguishes missing evidence', async ({
  page,
  baseURL,
}, info) => {
  const errors: string[] = [],
    external: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== baseURL) external.push(request.url());
  });
  await page.goto('/#/artikel/guide-r1-reporting');
  const sections = await page
    .locator('.article-content > section[id]')
    .evaluateAll((nodes) => nodes.map((n) => n.id));
  expect(sections.slice(0, 6)).toEqual([
    'kurzantwort',
    'voraussetzungen',
    'bedienweg',
    'ergebnispruefung',
    'einschraenkungen',
    'nachweise',
  ]);
  await expect(page.locator('#voraussetzungen')).toContainText('keine Rechtezusage');
  await expect(page.locator('#procedure-r1-reporting')).toContainText(
    'Ein unveröffentlichter Arbeitsstand ist kein geeigneter Nachweis',
  );
  await expect(page.locator('#procedure-r1-reporting')).toContainText(
    'das Ergebnis bis zur Klärung nicht als bestätigte Berichtsgrundlage verwenden',
  );
  await expect(page.locator('#bedienweg')).toContainText(
    'Eine wiederholte Anzeige allein bestätigt weder Aktualität',
  );
  await expect(page.locator('#ergebnispruefung')).toContainText(
    'keine Berichtsverteilung bestätigt',
  );
  await expect(page.locator('.demo-note')).toContainText('Fachlich nicht freigegeben');
  await expect(page.locator('#einschraenkungen .source-ref')).toHaveCount(0);
  const details = page.locator('#nachweise details').filter({
    has: page.locator('summary', { hasText: 'Begründung der Einschränkungen und Fundstellen' }),
  });
  await expect(details).not.toHaveAttribute('open', '');
  await details.locator('summary').click();
  await expect(details).toContainText('Keine offene Filterkorrektur mehr');
  await expect(details).toContainText('R1B-FS-02');
  await details.locator('summary').click();
  const jumps = page.getByRole('navigation', { name: 'Direkt zu den Abschnitten' });
  for (const [name, id] of [
    ['Voraussetzungen', 'voraussetzungen'],
    ['Bedienweg', 'bedienweg'],
    ['Ergebnisprüfung', 'ergebnispruefung'],
    ['Nachweise', 'nachweise'],
  ]) {
    await jumps.getByRole('button', { name, exact: true }).focus();
    await page.keyboard.press('Enter');
    await expect(page.locator(`#${id}`)).toBeFocused();
  }
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  ).toBeTruthy();
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
      .violations,
  ).toEqual([]);
  await page.screenshot({
    path: `test-results/reporting-${info.project.name}.png`,
    fullPage: true,
  });
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});

test('existing reporting bookmarks and v1 progress survive the new procedure', async ({ page }) => {
  await page.goto('/');
  const old = {
    version: 1,
    bookmarks: ['guide-r1-reporting', 'statusbericht'],
    read: ['guide-status-orientation'],
    passed: ['einstieg'],
  };
  await page.evaluate(
    (value) => localStorage.setItem('ippm-learning-v1', JSON.stringify(value)),
    old,
  );
  await page.reload();
  await page.goto('/#/artikel/guide-r1-reporting');
  await expect(
    page.getByRole('button', { name: 'Aus Merkliste entfernen', exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Als gelesen markieren', exact: true }).click();
  await page.reload();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('ippm-learning-v1')!))).toEqual({
    ...old,
    read: [...old.read, 'guide-r1-reporting'],
  });
  await expect(page.locator('#procedure-r1-reporting')).toBeVisible();
});
