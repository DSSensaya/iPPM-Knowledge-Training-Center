import { test, expect } from '@playwright/test';
import { searchArticles } from '../src/lib/search';
import { knowledgeFor } from '../src/lib/knowledge';
import { releaseArticles } from '../src/data/release-content';
import { learningPaths } from '../src/data/content';
import { sb1Coverage } from '../src/data/sb1-coverage';

test('release planning is searchable without claiming operative training or availability', () => {
  const article = releaseArticles[0];
  for (const query of ['Release 2', 'SAP AK', 'PS-Link', 'R1B', 'Vertragsreporting']) {
    expect(searchArticles(query).map((a) => a.id)).toContain(article.id);
  }
  expect(article.status).toBe('source-draft');
  expect(knowledgeFor(article).assessments).toEqual([]);
  expect(knowledgeFor(article).training).toEqual([]);
  expect(knowledgeFor(article).steps).toEqual([]);
  expect(knowledgeFor(article).releases).toEqual([]);
  expect(learningPaths.flatMap((path) => path.lessons)).not.toContain(article.id);
  expect(sb1Coverage).toHaveLength(24);
  expect(JSON.stringify(sb1Coverage)).not.toContain(article.id);
});

test('release scope opens from home search on desktop and mobile', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Release 2', exact: true }).click();
  await page
    .getByRole('link', { name: 'iPPM Release 2: geplanten Scope einordnen', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { name: 'iPPM Release 2: geplanten Scope einordnen', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'R1B: Projekt- und Portfolio-Reporting', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'R2: Projekte kalkulieren', exact: true }),
  ).toBeVisible();
  await expect(page.locator('#fachlicher-kontext')).toContainText(
    'Planungsorientierung ohne SB1-Schulungszuordnung',
  );
  await expect(page.locator('#fachlicher-kontext')).not.toContainText('SB1-Bezug');
  await expect(page.locator('#kurzantwort')).toContainText(
    'keine technische Verfügbarkeit oder Schulungsreife',
  );
  await expect(page.locator('.demo-note')).toContainText('Fachlich nicht freigegeben');
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  ).toBeTruthy();
});
