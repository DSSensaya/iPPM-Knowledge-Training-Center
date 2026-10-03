import { expect } from '@playwright/test';
import { test } from './editor-fixture';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import AxeBuilder from '@axe-core/playwright';
test('browser editor saves title, reloads canonical data and keeps conflicting inputs', async ({
  page,
  editor: { root, base },
}) => {
  await page.goto(base + '/#/redaktion');
  await expect(page.getByRole('heading', { name: 'Inhalte pflegen' })).toBeVisible();
  await page.getByLabel('Inhalt auswählen').selectOption('article~guide-project-objectives');
  await page.getByRole('button', { name: 'Inhalt laden', exact: true }).click();
  await page
    .getByRole('textbox', { name: 'Titel', exact: true })
    .fill('Ziele – bearbeiteter Beitrag');
  await page.getByRole('button', { name: 'Änderungen speichern' }).click();
  await expect(
    page
      .getByRole('status')
      .filter({ hasText: 'Direkt in der kanonischen JSON-Datei gespeichert' }),
  ).toBeVisible();
  await page.goto(base + '/#/artikel/guide-project-objectives');
  await page.reload();
  await expect(page.locator('main h1')).toHaveText('Ziele – bearbeiteter Beitrag');
  await page.goto(base + '/#/redaktion');
  await page.getByLabel('Inhalt auswählen').selectOption('article~guide-project-objectives');
  await page.getByRole('button', { name: 'Inhalt laden', exact: true }).click();
  await page
    .getByRole('textbox', { name: 'Titel', exact: true })
    .fill('Meine noch nicht gespeicherte Änderung');
  const path = join(root, 'src/content/articles/guide-project-objectives.json'),
    value = JSON.parse(await readFile(path, 'utf8'));
  value.summary = 'Externe Änderung';
  await writeFile(path, JSON.stringify(value, null, 2));
  await page.getByRole('button', { name: 'Änderungen speichern' }).click();
  await expect(page.getByRole('alert')).toContainText('seit dem Laden geändert');
  await expect(page.getByRole('textbox', { name: 'Titel', exact: true })).toHaveValue(
    'Meine noch nicht gespeicherte Änderung',
  );
  await page.getByRole('button', { name: 'Aktuellen Stand vergleichen' }).click();
  await expect(page.locator('.json-view')).toContainText('Externe Änderung');
  await expect(page.getByRole('textbox', { name: 'Titel', exact: true })).toHaveValue(
    'Meine noch nicht gespeicherte Änderung',
  );
});

test('editor has accessible responsive fields', async ({ page, editor: { base } }) => {
  await page.goto(base + '/#/redaktion');
  await page.getByRole('button', { name: 'Inhalt laden', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Titel', exact: true })).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
  ).toBeTruthy();
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
      .violations,
  ).toEqual([]);
});
