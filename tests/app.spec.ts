import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('home, navigation and responsive layout are accessible and local', async ({
  page,
  baseURL,
}, testInfo) => {
  const errors: string[] = [],
    external: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== baseURL) external.push(request.url());
  });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Ihre nächsten iPPM-Aufgaben.' })).toBeVisible();
  await expect(page.locator('.prototype-label')).toHaveText('v0.8.0');
  await expect(page.getByRole('main')).toBeFocused();
  const routes = [
    '/',
    '/wissen',
    '/prozesse',
    '/mein-bereich',
    '/hilfe',
    '/artikel/guide-project-permissions',
    '/artikel/ippm-release-2-scope',
  ];
  for (const route of routes) {
    await page.goto(`/#${route}`);
    await expect(page.locator('h1')).toHaveCount(1);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBeTruthy();
    const accessibility = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(
      accessibility.violations,
      `${route}: ${JSON.stringify(accessibility.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })))}`,
    ).toEqual([]);
  }
  await page.goto('/');
  await page.screenshot({ path: `test-results/home-${testInfo.project.name}.png`, fullPage: true });
  if (testInfo.project.name === 'mobile') {
    await page.getByRole('button', { name: 'Menü öffnen' }).click();
    await page
      .getByRole('navigation', { name: 'Hauptnavigation' })
      .getByRole('link', { name: 'Prozesse', exact: true })
      .click();
    await expect(page.getByRole('heading', { name: 'Prozesse im Überblick' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Menü öffnen' })).toBeVisible();
  }
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});

test('search finds body text, filters combine, empty state recovers', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Was möchten Sie wissen?').fill('Start Date');
  await page.getByRole('button', { name: 'Suchen', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Projektstammdaten und Terminrahmen prüfen' }),
  ).toBeVisible();
  await expect(page.locator('.article-card').first()).toBeVisible();
  await page.getByLabel('Wissensbasis durchsuchen').fill('');
  await page.getByRole('button', { name: 'Suchen', exact: true }).click();
  await page.getByRole('combobox', { name: 'Thema', exact: true }).selectOption('Team & Zugriff');
  await page.getByRole('combobox', { name: 'Ihre Rolle', exact: true }).selectOption('pm');
  await page.getByRole('combobox', { name: 'Format', exact: true }).selectOption('FAQ');
  await expect(page.locator('.article-card')).toHaveCount(1);
  await expect(
    page.getByRole('heading', {
      name: 'Rollenliste, Build Team und Project Permissions unterscheiden',
    }),
  ).toBeVisible();
  await page.getByLabel('Wissensbasis durchsuchen').fill('xyzunauffindbar');
  await page.getByRole('button', { name: 'Suchen', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Keine passenden Beiträge gefunden' }),
  ).toBeVisible();
  await expect(page.getByRole('combobox', { name: 'Thema', exact: true })).toHaveValue(
    'Team & Zugriff',
  );
  await page.getByRole('link', { name: 'Alle Beiträge anzeigen' }).click();
  await expect(page.locator('.article-card')).toHaveCount(16);
});

test('a filter preserves a just-submitted search before hashchange renders', async ({ page }) => {
  await page.goto('/#/wissen?q=Start%20Date');
  await page.getByLabel('Wissensbasis durchsuchen').fill('');
  await page.evaluate(() => {
    document.querySelector<HTMLFormElement>('.search-form')!.requestSubmit();
    const selects = document.querySelectorAll<HTMLSelectElement>('.filters select');
    for (const [index, value] of ['Team & Zugriff', 'pm', 'FAQ'].entries()) {
      selects[index].value = value;
      selects[index].dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  await expect(page.locator('.article-card')).toHaveCount(1);
  await expect(
    page.getByRole('heading', {
      name: 'Rollenliste, Build Team und Project Permissions unterscheiden',
    }),
  ).toBeVisible();
  await expect(page.getByLabel('Wissensbasis durchsuchen')).toHaveValue('');
});

test('bookmarks persist and backup export/import validates data', async ({ page }) => {
  await page.goto('/#/artikel/guide-project-permissions');
  await page.getByRole('button', { name: 'Beitrag merken', exact: true }).click();
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Aus Merkliste entfernen', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  await page.goto('/#/mein-bereich');
  await expect(page.locator('.saved-section .article-card')).toHaveCount(1);
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Sicherung exportieren' }).click();
  const file = await download;
  expect(file.suggestedFilename()).toMatch(/ippm-lernbereich-.*\.json/);
  const stream = await file.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream!) chunks.push(Buffer.from(chunk));
  const backup = JSON.parse(Buffer.concat(chunks).toString());
  expect(backup.bookmarks).toContain('guide-project-permissions');
  await page.locator('input[type=file]').setInputFiles({
    name: 'invalid.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{"version":2}'),
  });
  await expect(page.getByText('Import fehlgeschlagen:', { exact: false })).toBeVisible();
  await page.locator('input[type=file]').setInputFiles({
    name: 'backup.json',
    mimeType: 'application/json',
    buffer: Buffer.from(
      JSON.stringify({
        version: 1,
        bookmarks: ['risiken', 'guide-deliverables-milestones', 'unknown'],
        read: ['risiken'],
        passed: [],
      }),
    ),
  });
  await expect(page.locator('.saved-section .article-card')).toHaveCount(2);
  await page.reload();
  await expect(page.locator('.saved-section .article-card')).toHaveCount(2);
  await page
    .getByRole('button', {
      name: 'Liefergegenstände in Liefer- und Zahlungsmeilensteine überführen: aus Merkliste entfernen',
    })
    .click();
  await expect(page.locator('.saved-section .article-card')).toHaveCount(1);
});

test('invalid routes and corrupted or unavailable storage fail gracefully', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('ippm-learning-v1', '{invalid'));
  await page.goto('/#/does-not-exist');
  await expect(page.getByRole('heading', { name: 'Diese Seite gibt es nicht' })).toBeVisible();
  await expect(page.getByRole('alert')).toContainText('nicht gelesen');
  await page.goto('/#/artikel/missing');
  await expect(page.getByRole('heading', { name: 'Beitrag nicht gefunden' })).toBeVisible();
  await page.goto('/#/artikel/guide-project-permissions');
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException('Quota exceeded', 'QuotaExceededError');
    };
  });
  await page.getByRole('button', { name: 'Beitrag merken', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Speicherung nicht möglich');
  await expect(
    page.getByRole('button', { name: 'Aus Merkliste entfernen', exact: true }),
  ).toBeVisible();
});

test('FAQ is keyboard operable and search can be submitted with Enter', async ({ page }) => {
  await page.goto('/#/hilfe');
  const first = page.locator('summary').first();
  await first.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('details').first()).toHaveAttribute('open', '');
  await page.keyboard.press('Enter');
  await expect(page.locator('details').first()).not.toHaveAttribute('open', '');
  await page.goto('/');
  await page.getByLabel('Was möchten Sie wissen?').fill('Zugriffsrechte');
  await page.getByLabel('Was möchten Sie wissen?').press('Enter');
  await expect(page.locator('.article-card').first()).toBeVisible();
});
