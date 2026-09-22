import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('home, navigation and responsive layout are accessible and local', async ({
  page,
}, testInfo) => {
  const errors: string[] = [],
    external: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('request', (request) => {
    if (!request.url().startsWith('http://127.0.0.1:4173')) external.push(request.url());
  });
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'iPPM verstehen. Projekte weiterbringen.' }),
  ).toBeVisible();
  await expect(page.getByRole('main')).toBeFocused();
  const routes = [
    '/',
    '/wissen',
    '/prozesse',
    '/lernpfade',
    '/mein-bereich',
    '/hilfe',
    '/artikel/statusbericht',
    '/lernpfade/einstieg',
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
  await page.getByLabel('Was möchten Sie wissen?').fill('Prüfstand');
  await page.getByRole('button', { name: 'Suchen', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'iPPM verstehen: vom Projekt zum Portfolio' }),
  ).toBeVisible();
  await expect(page.locator('.article-card')).toHaveCount(1);
  await page.getByLabel('Wissensbasis durchsuchen').fill('');
  await page.getByRole('button', { name: 'Suchen', exact: true }).click();
  await page
    .getByRole('combobox', { name: 'Thema', exact: true })
    .selectOption('Status & Reporting');
  await page
    .getByRole('combobox', { name: 'Ihre Rolle', exact: true })
    .selectOption('Projektleitung');
  await page.getByRole('combobox', { name: 'Format', exact: true }).selectOption('Checkliste');
  await expect(page.locator('.article-card')).toHaveCount(1);
  await expect(
    page.getByRole('heading', { name: 'Vor dem Reporting: der Qualitätscheck' }),
  ).toBeVisible();
  await page.getByLabel('Wissensbasis durchsuchen').fill('xyzunauffindbar');
  await page.getByRole('button', { name: 'Suchen', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Keine passenden Beiträge gefunden' }),
  ).toBeVisible();
  await expect(page.getByRole('combobox', { name: 'Thema', exact: true })).toHaveValue(
    'Status & Reporting',
  );
  await page.getByRole('link', { name: 'Alle Beiträge anzeigen' }).click();
  await expect(page.locator('.article-card')).toHaveCount(13);
});

test('bookmarks persist and backup export/import validates data', async ({ page }) => {
  await page.goto('/#/artikel/statusbericht');
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
  expect(backup.bookmarks).toContain('statusbericht');
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
        bookmarks: ['risiken', 'unknown'],
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
      name: 'Risiken bewerten und Maßnahmen ableiten: aus Merkliste entfernen',
    })
    .click();
  await expect(page.locator('.saved-section .article-card')).toHaveCount(1);
});

test('learning path unlocks quiz, handles retry and persists completion', async ({ page }) => {
  await page.goto('/#/lernpfade/einstieg');
  await expect(
    page.getByText('Markieren Sie zunächst alle drei Lektionen', { exact: false }),
  ).toBeVisible();
  for (let i = 1; i <= 3; i++) {
    await page.getByRole('link', { name: `Lektion ${i} öffnen`, exact: true }).click();
    await page.getByRole('button', { name: 'Als gelesen markieren', exact: true }).click();
    await page.getByRole('link', { name: 'Im Lernpfad weiter' }).click();
  }
  await expect(page.getByRole('button', { name: 'Antwort prüfen' })).toBeDisabled();
  await page.getByRole('radio').nth(0).check();
  await page.getByRole('button', { name: 'Antwort prüfen' }).click();
  await expect(page.getByText('Noch nicht ganz. Versuchen Sie es erneut.')).toBeVisible();
  await page.getByRole('radio').nth(1).check();
  await page.getByRole('button', { name: 'Antwort prüfen' }).click();
  await expect(page.getByText('Richtig. Lernpfad abgeschlossen!')).toBeVisible();
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(audit.violations).toEqual([]);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Ziel erreicht.' })).toBeVisible();
  await page.getByRole('link', { name: 'Lektion 1 öffnen', exact: true }).click();
  await page.getByRole('button', { name: 'Gelesen · Markierung entfernen' }).click();
  await page.getByRole('link', { name: 'Im Lernpfad weiter' }).click();
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50');
});

test('invalid routes and corrupted or unavailable storage fail gracefully', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('ippm-learning-v1', '{invalid'));
  await page.goto('/#/does-not-exist');
  await expect(page.getByRole('heading', { name: 'Diese Seite gibt es nicht' })).toBeVisible();
  await expect(page.getByRole('alert')).toContainText('nicht gelesen');
  await page.goto('/#/artikel/missing');
  await expect(page.getByRole('heading', { name: 'Beitrag nicht gefunden' })).toBeVisible();
  await page.goto('/#/artikel/risiken');
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
  await page.getByLabel('Was möchten Sie wissen?').fill('Kapazität');
  await page.getByLabel('Was möchten Sie wissen?').press('Enter');
  await expect(page.locator('.article-card').first()).toBeVisible();
});
