import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import baseline from './fixtures/migration-baseline.json' with { type: 'json' };
async function navigate(page: import('@playwright/test').Page, name: string) {
  const nav = page.getByRole('navigation', { name: 'Hauptnavigation' });
  if (!(await nav.isVisible())) await page.getByRole('button', { name: 'Menü öffnen' }).click();
  await nav.getByRole('link', { name, exact: true }).click();
}
test('four user entries expose tasks, processes, roles and knowledge', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Aufgaben', exact: true })).toBeVisible();
  await navigate(page, 'Prozesse');
  await expect(page.getByRole('heading', { name: 'Prozesse', exact: true })).toBeVisible();
  await expect(page.locator('main a[href^="#/schritt/"]')).toHaveCount(52);
  await navigate(page, 'Rollen');
  await expect(page.getByRole('heading', { name: 'Rollen', exact: true })).toBeVisible();
  await page
    .locator('main')
    .getByRole('link', { name: 'Technical Manager (TM)', exact: true })
    .click();
  await expect(page.locator('main a[href="#/schritt/step-3-12"]')).toBeVisible();
  await navigate(page, 'Wissen');
  await expect(page.locator('.article-card')).toHaveCount(16);
  await expect(page.getByRole('navigation', { includeHidden: true })).not.toContainText(
    /Inventory|Evidence|Assessments|CareCases|SHA-256/,
  );
});
test('common search finds procedures and articles with German spelling and role filters', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Wissen und Aufgaben durchsuchen' }).fill('Owner');
  await page.getByRole('button', { name: 'Suchen', exact: true }).click();
  await expect(page.locator('main a[href="#/bedienweg/procedure-owner-change"]')).toBeVisible();
  await expect(page.locator('.article-card').filter({ hasText: 'Owner' }).first()).toBeVisible();
  await page.getByRole('combobox', { name: 'Rolle', exact: true }).selectOption('tm');
  await expect(page.locator('.article-card')).not.toHaveCount(0);
  await page
    .getByRole('searchbox', { name: 'Wissen und Aufgaben durchsuchen' })
    .fill('nichtvorhandenerbegriff');
  await page.getByRole('button', { name: 'Suchen', exact: true }).click();
  await expect(
    page.getByRole('status').filter({ hasText: 'Keine passenden Inhalte' }),
  ).toBeVisible();
});
test('stable article, process step and procedure URLs remain accessible', async ({ page }) => {
  for (const id of baseline.articleIds) {
    await page.goto('/#/artikel/' + id);
    await expect(page.locator('main h1')).toBeVisible();
    await expect(page.locator('main')).not.toContainText('Beitrag nicht verfügbar');
  }
  await page.goto('/#/schritt/step-2-6');
  await expect(page.locator('main h1')).toContainText('Teilprojektleiter');
  await page.goto('/#/bedienweg/procedure-owner-change');
  await expect(page.locator('main')).toContainText('Sichern Sie sich vor dem Owner-Wechsel');
  await page.goto('/#/artikel/archived-demo');
  await expect(page.getByRole('heading', { name: 'Beitrag nicht verfügbar' })).toBeVisible();
});
test('R1 training blocks display generic SB01 and SB02, including absent material', async ({
  page,
}) => {
  await page.goto('/#/releases');
  await page.getByRole('link', { name: /SB01/ }).click();
  await expect(page.locator('.training-row')).toHaveCount(24);
  await page.goto('/#/schulungen/sb2');
  await expect(page.locator('.training-row')).toHaveCount(27);
  await expect(page.locator('main')).toContainText('noch kein Center-Material');
});
test('bookmarks and read state survive reload without dropping opaque v1 IDs', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() =>
    localStorage.setItem(
      'ippm-learning-v1',
      JSON.stringify({
        version: 1,
        bookmarks: ['retired-bookmark'],
        read: ['unknown-read'],
        passed: ['old-path'],
      }),
    ),
  );
  await page.goto('/#/artikel/guide-project-permissions');
  await page.reload();
  await page.getByRole('button', { name: 'Beitrag merken', exact: true }).click();
  await page.getByRole('button', { name: 'Als gelesen markieren', exact: true }).click();
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Aus Merkliste entfernen', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  const data = await page.evaluate(() => JSON.parse(localStorage.getItem('ippm-learning-v1')!));
  expect(data.bookmarks).toContain('retired-bookmark');
  expect(data.bookmarks).toContain('guide-project-permissions');
  expect(data.read).toContain('unknown-read');
  expect(data.passed).toEqual(['old-path']);
  await page.goto('/#/mein-bereich');
  await expect(page.locator('.article-card')).toHaveCount(1);
});
test('storage errors are visible and edits still work for the session', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new Error('Quota');
    };
  });
  await page.goto('/#/artikel/guide-project-objectives');
  await page.getByRole('button', { name: 'Beitrag merken', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Speicherung nicht möglich');
  await expect(page.getByRole('button', { name: 'Aus Merkliste entfernen' })).toBeVisible();
});
test('progress export/import preserves unknown values and merges known bookmarks', async ({
  page,
}) => {
  await page.goto('/#/mein-bereich');
  await page.getByLabel('Sicherungsdatei auswählen').setInputFiles({
    name: 'backup.json',
    mimeType: 'application/json',
    buffer: Buffer.from(
      JSON.stringify({
        version: 1,
        bookmarks: ['guide-project-objectives', 'opaque'],
        read: ['opaque-read'],
        passed: ['opaque-path'],
      }),
    ),
  });
  await expect(page.getByRole('status').filter({ hasText: 'Sicherung übernommen' })).toBeVisible();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Sicherung exportieren' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/ippm-lernbereich/);
  const state = await page.evaluate(() => JSON.parse(localStorage.getItem('ippm-learning-v1')!));
  expect(state.bookmarks).toContain('opaque');
  expect(state.read).toContain('opaque-read');
  expect(state.passed).toContain('opaque-path');
});
test('core boundaries remain visible before applying owner and reporting procedures', async ({
  page,
}) => {
  await page.goto('/#/artikel/guide-project-permissions');
  await expect(page.locator('main')).toContainText('Build Team');
  await expect(page.locator('.limitations')).toContainText('Rechte');
  await page.goto('/#/artikel/guide-r1-reporting');
  await expect(page.locator('.limitations')).toContainText('PMO Status bleibt beim PMO');
  await expect(page.locator('.limitations')).toContainText('Bestands-Sites');
  await page.goto('/#/artikel/guide-project-master-data');
  await expect(page.locator('main')).toContainText('EDC');
  await expect(page.locator('main')).toContainText('unabhängig');
});
for (const route of [
  '/',
  '/#/wissen',
  '/#/prozesse',
  '/#/rollen',
  '/#/artikel/guide-project-permissions',
  '/#/schulungen/sb2',
])
  test(`responsive and accessible: ${route}`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator('main h1')).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBeTruthy();
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(result.violations).toEqual([]);
  });
test('keyboard skip link moves focus into main', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Zum Inhalt springen' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
});

test('real legacy process searches and knowledge filters retain their meaning', async ({
  page,
}) => {
  await page.goto('/#/prozesse?q=R1B-06');
  await expect(page.getByRole('heading', { name: 'Treffer für „R1B-06“' })).toBeVisible();
  await page.locator('main a[href="#/thema/R1B-06"]').click();
  await expect(page.locator('main h1')).toHaveText('AddIn MTA');
  await page.goto('/#/wissen?rolle=tm');
  await expect(page.getByRole('combobox', { name: 'Rolle', exact: true })).toHaveValue('tm');
  const { loadModel } = await import('./model');
  const model = await loadModel();
  const expected = model.content.articles.filter((a) => a.roleIds.includes('tm'));
  await expect(page.locator('.article-card')).toHaveCount(expected.length);
  for (const a of expected)
    await expect(
      page.locator('.article-card').getByRole('link', { name: a.title, exact: true }),
    ).toBeVisible();
  await page.getByRole('combobox', { name: 'Rolle', exact: true }).selectOption('pm');
  await expect(page).toHaveURL(/role=pm/);
  expect(new URLSearchParams(new URL(page.url()).hash.split('?')[1]).has('rolle')).toBeFalsy();
  const article = model.content.articles.find((a) => a.topic && a.kind)!;
  await page.goto(
    '/#/wissen?thema=' +
      encodeURIComponent(article.topic!) +
      '&format=' +
      encodeURIComponent(article.kind!),
  );
  await expect(page.locator('.article-card')).toHaveCount(
    model.content.articles.filter((a) => a.topic === article.topic && a.kind === article.kind)
      .length,
  );
  await expect(page.getByRole('combobox', { name: 'Thema', exact: true })).toHaveValue(
    article.topic!,
  );
  await page.goto('/#/wissen?rolle=Alle%20Rollen&thema=Alle%20Themen&format=Alle%20Formate');
  await expect(page.locator('.article-card')).toHaveCount(16);
});
