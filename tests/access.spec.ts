import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('access slice is discoverable, source-aware, keyboard accessible and local', async ({
  page,
}, testInfo) => {
  const errors: string[] = [],
    external: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('request', (r) => {
    if (!r.url().startsWith('http://127.0.0.1:4173')) external.push(r.url());
  });
  await page.goto('/');
  await page.getByRole('link', { name: 'Zugriffsrechte', exact: true }).click();
  await expect(page.locator('.article-card')).toHaveCount(2);
  for (const role of ['pm', 'tm', 'ilsm']) {
    await page.getByRole('combobox', { name: 'Ihre Rolle', exact: true }).selectOption(role);
    await expect(page.locator('.article-card')).toHaveCount(2);
  }
  await page.getByLabel('Wissensbasis durchsuchen').fill('2.11');
  await page.getByLabel('Wissensbasis durchsuchen').press('Enter');
  await page
    .getByRole('heading', { name: 'Zugriffsrechte festlegen und Owner wechseln', exact: true })
    .getByRole('link')
    .click();
  await expect(page.locator('.demo-note')).toContainText('Quellenbasierter Entwurf');
  await expect(
    page.getByRole('heading', {
      name: 'Build-Team-Synchronisation ist widersprüchlich beschrieben',
    }),
  ).toBeVisible();
  const procedure = page.locator('#procedure-owner-change');
  await expect(procedure).toContainText('vor dem Owner-Wechsel');
  await expect(procedure).toContainText('View the Project Site');
  await expect(procedure).toContainText('System Overview');
  await expect(procedure).toContainText('ILS Overview');
  await expect(procedure).toContainText('Check-in');
  const training = page
    .locator('summary')
    .filter({ hasText: 'SB1-Zuordnung und abweichende Schulungswege' });
  await training.focus();
  await page.keyboard.press('Enter');
  await expect(training.locator('..')).toContainText('vorerst nur Project Permissions');
  await expect(training.locator('..')).toContainText('Aktueller Handbuchentwurf: Build Team');
  await page.getByText('Technischer Nachweis, TTT und Beschreibungsstand', { exact: true }).click();
  await expect(page.locator('#nachweise')).toContainText('Keine formale Produktivabnahme');
  await expect(page.locator('#nachweise')).toContainText('FS-08');
  await page
    .getByText('Aktueller Scope und ursprüngliche Release-Zuordnung', { exact: true })
    .click();
  await expect(page.locator('#nachweise')).toContainText('Historischer Zielrahmen');
  await expect(page.locator('#nachweise')).toContainText('R1-23');
  await page.getByText('Lernziel, Voraussetzungen und Übungsvorschlag', { exact: true }).click();
  await expect(page.locator('#trainerhinweise')).toContainText('kein Schulungsnachweis');
  await page.locator('summary').filter({ hasText: 'B · SB1-Handbuch' }).click();
  await expect(page.locator('#quellen')).toContainText('30_Handbuch/');
  await expect(page.locator('#quellen')).toContainText('§3.6.7');
  for (const route of ['guide-project-permissions', 'faq-role-vs-access']) {
    if (route === 'faq-role-vs-access') await page.goto(`/#/artikel/${route}`);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBeTruthy();
    expect(
      (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
        .violations,
    ).toEqual([]);
  }
  await page.screenshot({
    path: `test-results/access-faq-${testInfo.project.name}.png`,
    fullPage: true,
  });
  await page.getByRole('link', { name: 'Prozessschritte und Zuständigkeiten ansehen' }).click();
  const slice = page.getByRole('region', { name: 'SB1: Team und Zugriff' });
  await expect(slice.getByRole('heading')).toHaveCount(5);
  await slice
    .getByRole('link', { name: 'Bedienweg, Quellen und Einschränkungen zu 2.6 öffnen' })
    .click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Zugriffsrechte festlegen und Owner wechseln',
  );
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});

test('v1 learning state survives new content, reload and export/import without awarding SB1 completion', async ({
  page,
}) => {
  const original = {
    version: 1,
    bookmarks: ['statusbericht'],
    read: ['ippm-verstehen', 'projekt-anlegen', 'arbeitspakete'],
    passed: ['einstieg'],
  };
  await page.goto('/');
  await page.evaluate(
    (state) => localStorage.setItem('ippm-learning-v1', JSON.stringify(state)),
    original,
  );
  await page.goto('/#/artikel/guide-project-permissions');
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Als gelesen markieren', exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Beitrag merken', exact: true }).click();
  await page.getByRole('button', { name: 'Als gelesen markieren', exact: true }).click();
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Aus Merkliste entfernen', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  await page.goto('/#/mein-bereich');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Sicherung exportieren' }).click();
  const stream = await (await downloadPromise).createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream!) chunks.push(Buffer.from(chunk));
  const buffer = Buffer.concat(chunks),
    backup = JSON.parse(buffer.toString());
  expect(backup).toEqual({
    ...original,
    bookmarks: ['statusbericht', 'guide-project-permissions'],
    read: [...original.read, 'guide-project-permissions'],
  });
  await page.evaluate(() => localStorage.removeItem('ippm-learning-v1'));
  await page.reload();
  await page
    .locator('input[type=file]')
    .setInputFiles({ name: 'v1.json', mimeType: 'application/json', buffer });
  await page.reload();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('ippm-learning-v1')!))).toEqual(
    backup,
  );
  await page.goto('/#/lernpfade/einstieg');
  await expect(page.getByRole('heading', { name: 'Ziel erreicht.' })).toBeVisible();
  await page.goto('/#/artikel/faq-role-vs-access');
  await expect(
    page.getByRole('button', { name: 'Als gelesen markieren', exact: true }),
  ).toBeVisible();
  // New content also uses the existing visible storage-error handling.
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException('Denied', 'SecurityError');
    };
  });
  await page.getByRole('button', { name: 'Beitrag merken', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Speicherung nicht möglich');
});
