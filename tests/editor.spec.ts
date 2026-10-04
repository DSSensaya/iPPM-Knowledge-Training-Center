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

test('editor has accessible responsive fields', async ({ page, editor: { base } }, testInfo) => {
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
  await page.screenshot({ path: testInfo.outputPath('editor.png') });
});

test('disabled editor actions retain neutral states during save and recover afterwards', async ({
  page,
  editor: { base },
}) => {
  await page.goto(base + '/#/redaktion');
  await page.getByRole('button', { name: 'Inhalt laden', exact: true }).click();
  const save = page.getByRole('button', { name: 'Änderungen speichern', exact: true });
  await page
    .getByRole('textbox', { name: 'Titel', exact: true })
    .fill('Titel im isolierten Zustandstest');
  let releaseSave!: () => void;
  const pending = new Promise<void>((resolve) => {
    releaseSave = resolve;
  });
  await page.route('**/__local-editor/files/**', async (route) => {
    if (route.request().method() === 'PUT') await pending;
    await route.continue();
  });
  try {
    await save.click();
    await expect(save).toBeDisabled();
    await expect(save).toHaveCSS('background-color', 'rgb(230, 230, 230)');
    await expect(save).toHaveCSS('color', 'rgb(118, 118, 118)');
    await expect(page.getByRole('textbox', { name: 'Titel', exact: true })).toBeDisabled();
  } finally {
    releaseSave();
  }
  await expect(
    page
      .getByRole('status')
      .filter({ hasText: 'Direkt in der kanonischen JSON-Datei gespeichert' }),
  ).toBeVisible();
  const title = page.getByRole('textbox', { name: 'Titel', exact: true });
  await expect(title).toBeEnabled();
  await expect(save).toBeDisabled();
  await title.fill('Weitere Änderung im isolierten Zustandstest');
  await expect(save).toBeEnabled();
});

async function openArticle(page: import('@playwright/test').Page, base: string) {
  await page.goto(base + '/#/redaktion');
  await page.getByLabel('Inhalt auswählen').selectOption('article~guide-project-objectives');
  await page.getByRole('button', { name: 'Inhalt laden', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Titel', exact: true })).toBeVisible();
}
async function openJson(page: import('@playwright/test').Page) {
  const details = page.locator('details').filter({ has: page.locator('#editor-json') });
  if (!((await details.getAttribute('open')) !== null)) await details.locator('summary').click();
  return page.getByLabel('Kanonischer JSON-Inhalt');
}

const malformedArticleCases: {
  name: string;
  value: (article: Record<string, unknown>) => unknown;
}[] = [
  { name: 'null article', value: () => null },
  { name: 'number article', value: () => 42 },
  { name: 'boolean article', value: () => true },
  { name: 'string article', value: () => 'Text' },
  { name: 'array article', value: () => [] },
  { name: 'object content instead of sections', value: (article) => ({ ...article, content: {} }) },
  { name: 'object roleIds instead of array', value: (article) => ({ ...article, roleIds: {} }) },
  {
    name: 'boolean systemIds instead of array',
    value: (article) => ({ ...article, systemIds: false }),
  },
  {
    name: 'object procedureIds instead of array',
    value: (article) => ({ ...article, procedureIds: {} }),
  },
  { name: 'null content section', value: (article) => ({ ...article, content: [null] }) },
  {
    name: 'object section steps instead of array',
    value: (article) => ({ ...article, content: [{ title: 'Test', body: 'Text', steps: {} }] }),
  },
  {
    name: 'object openPoints instead of array',
    value: (article) => ({ ...article, openPoints: {} }),
  },
  {
    name: 'number sourceRefs instead of array',
    value: (article) => ({ ...article, sourceRefs: 9 }),
  },
  { name: 'object title instead of text', value: (article) => ({ ...article, title: {} }) },
];

async function checkMalformedArticle(
  page: import('@playwright/test').Page,
  root: string,
  base: string,
  invalidValue: (article: Record<string, unknown>) => unknown,
) {
  const crashes: string[] = [];
  page.on('pageerror', (e) => crashes.push(e.message));
  await openArticle(page, base);
  const input = await openJson(page);
  const original = await input.inputValue(),
    article = JSON.parse(original);
  const path = join(root, 'src/content/articles/guide-project-objectives.json');
  const disk = await readFile(path, 'utf8');
  const raw = '  ' + JSON.stringify(invalidValue(article), null, 2) + '\n';
  await input.fill(raw);
  await expect(page.getByRole('alert').filter({ hasText: 'JSON-Entwurf prüfen' })).toBeVisible();
  await expect(input).toHaveValue(raw);
  await expect(page.getByRole('heading', { name: 'Artikel bearbeiten', exact: true })).toHaveCount(
    0,
  );
  await page.getByRole('button', { name: 'Änderungen speichern', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Änderungen speichern', exact: true }),
  ).toBeEnabled();
  await expect(input).toHaveValue(raw);
  expect(await readFile(path, 'utf8')).toBe(disk);
  await input.fill(original);
  await expect(page.getByRole('textbox', { name: 'Titel', exact: true })).toHaveValue(
    article.title,
  );
  expect(crashes).toEqual([]);
}

// Each invalid shape gets its own normal 30-second budget and isolated editor fixture.
test.describe('malformed article JSON', () => {
  for (const { name, value } of malformedArticleCases)
    test(`${name}: preserves raw draft, rejects save and recovers after correction`, async ({
      page,
      editor: { root, base },
    }) => {
      await checkMalformedArticle(page, root, base, value);
    });
});

test.describe('malformed collection JSON', () => {
  for (const [collection, field] of [
    ['procedures', 'actions'],
    ['roles', 'aliases'],
    ['processes', 'steps'],
  ] as const)
    for (const shape of ['root object', 'nested array as object'] as const)
      test(`${collection}: ${shape} retains raw draft without crashing`, async ({
        page,
        editor: { base },
      }) => {
        const crashes: string[] = [];
        page.on('pageerror', (e) => crashes.push(e.message));
        await page.goto(base + '/#/redaktion');
        await page.getByLabel('Inhalt auswählen').selectOption(collection);
        await page.getByRole('button', { name: 'Inhalt laden', exact: true }).click();
        const json = await openJson(page),
          valid = await json.inputValue();
        const malformed = JSON.parse(valid);
        malformed[0][field] = {};
        const raw = shape === 'root object' ? '{"wrong":true}' : JSON.stringify(malformed, null, 2);
        await json.fill(raw);
        await expect(page.getByRole('alert').filter({ hasText: 'Liste erwartet' })).toBeVisible();
        await expect(json).toHaveValue(raw);
        await json.fill(valid);
        await expect(json).toHaveValue(valid);
        await expect(
          page.getByRole('alert').filter({ hasText: 'JSON-Entwurf prüfen' }),
        ).toHaveCount(0);
        expect(crashes).toEqual([]);
      });
});

test('dirty draft protects main navigation, internal routes, object changes and reload actions', async ({
  page,
  editor: { base, root },
}) => {
  await page.goto(base + '/#/wissen');
  await expect(page.locator('main h1')).toHaveText('Wissen');
  await openArticle(page, base);
  const title = page.getByRole('textbox', { name: 'Titel', exact: true });
  await title.fill('Ungespeicherter Entwurf');
  const nav = page.getByRole('navigation', { name: 'Hauptnavigation' });
  if (!(await nav.isVisible())) await page.getByRole('button', { name: 'Menü öffnen' }).click();
  await nav.getByRole('link', { name: 'Wissen', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Ungespeicherter Entwurf' });
  await expect(dialog).toBeVisible();
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
      .violations,
  ).toEqual([]);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  ).toBeTruthy();
  await dialog.getByRole('button', { name: 'Navigation abbrechen' }).click();
  await expect(page).toHaveURL(/#\/redaktion$/);
  await expect(title).toHaveValue('Ungespeicherter Entwurf');
  await page.evaluate(() => {
    location.hash = '/redaktion/inventory';
  });
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(title).toHaveValue('Ungespeicherter Entwurf');
  await expect(page).toHaveURL(/#\/redaktion$/);
  await page.evaluate(() => history.back());
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Navigation abbrechen' }).click();
  await expect(page).toHaveURL(/#\/redaktion$/);
  await expect(title).toHaveValue('Ungespeicherter Entwurf');
  await page.evaluate(() => history.back());
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Navigation abbrechen' }).click();
  await expect(title).toHaveValue('Ungespeicherter Entwurf');
  await page.getByLabel('Inhalt auswählen').selectOption('roles');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Navigation abbrechen' }).click();
  await expect(page.getByLabel('Inhalt auswählen')).toHaveValue('article~guide-project-objectives');
  await expect(title).toHaveValue('Ungespeicherter Entwurf');
  await page.getByRole('button', { name: 'Inhalt laden', exact: true }).click();
  await dialog.getByRole('button', { name: 'Navigation abbrechen' }).click();
  await expect(title).toHaveValue('Ungespeicherter Entwurf');
  await page.evaluate(() => history.back());
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Navigation abbrechen' }).click();
  await expect(title).toHaveValue('Ungespeicherter Entwurf');
  await page.getByLabel('Inhalt auswählen').selectOption('roles');
  await dialog.getByRole('button', { name: 'Speichern und fortfahren' }).click();
  await expect(page.getByLabel('Inhalt auswählen')).toHaveValue('roles');
  expect(
    JSON.parse(
      await readFile(join(root, 'src/content/articles/guide-project-objectives.json'), 'utf8'),
    ).title,
  ).toBe('Ungespeicherter Entwurf');
  await page.getByLabel('Inhalt auswählen').selectOption('article~guide-project-objectives');
  await page.getByRole('button', { name: 'Inhalt laden', exact: true }).click();
  await title.fill('Bewusst verwerfen');
  await page.evaluate(() => {
    location.hash = '/wissen';
  });
  await dialog.getByRole('button', { name: 'Entwurf verwerfen' }).click();
  await expect(page).toHaveURL(/#\/wissen$/);
  expect(
    JSON.parse(
      await readFile(join(root, 'src/content/articles/guide-project-objectives.json'), 'utf8'),
    ).title,
  ).toBe('Ungespeicherter Entwurf');
});

test('reload and tab closing warn for dirty drafts and cancellation preserves them', async ({
  page,
  editor: { base },
}) => {
  await openArticle(page, base);
  const title = page.getByRole('textbox', { name: 'Titel', exact: true });
  await title.fill('Entwurf vor Reload');
  const reloadDialog = page.waitForEvent('dialog');
  await page.evaluate(() => {
    window.setTimeout(() => location.reload(), 0);
  });
  const warning = await reloadDialog;
  expect(warning.type()).toBe('beforeunload');
  await warning.dismiss();
  await expect(title).toHaveValue('Entwurf vor Reload');
  const closeDialog = page.waitForEvent('dialog');
  await page.close({ runBeforeUnload: true });
  const closeWarning = await closeDialog;
  expect(closeWarning.type()).toBe('beforeunload');
  await closeWarning.dismiss();
  expect(page.isClosed()).toBeFalsy();
  await expect(title).toHaveValue('Entwurf vor Reload');
  await page.getByRole('button', { name: 'Änderungen speichern', exact: true }).click();
  await expect(
    page
      .getByRole('status')
      .filter({ hasText: 'Direkt in der kanonischen JSON-Datei gespeichert' }),
  ).toBeVisible();
  const warnings: string[] = [];
  page.on('dialog', (d) => {
    warnings.push(d.type());
    void d.dismiss();
  });
  await page.reload();
  expect(warnings).toEqual([]);
});

test('failed save in navigation dialog retains dirty input and blocks leaving', async ({
  page,
  editor: { root, base },
}) => {
  await openArticle(page, base);
  await page.getByRole('textbox', { name: 'Titel', exact: true }).fill('Mein Konfliktentwurf');
  const path = join(root, 'src/content/articles/guide-project-objectives.json');
  const article = JSON.parse(await readFile(path, 'utf8'));
  article.summary = 'Anderer Dateistand';
  await writeFile(path, JSON.stringify(article, null, 2));
  await page.evaluate(() => {
    location.hash = '/wissen';
  });
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('button', { name: 'Speichern und fortfahren' }).click();
  await expect(dialog.getByRole('alert')).toContainText('seit dem Laden geändert');
  await expect(page).toHaveURL(/#\/redaktion$/);
  await dialog.getByRole('button', { name: 'Navigation abbrechen' }).click();
  await expect(page.getByRole('textbox', { name: 'Titel', exact: true })).toHaveValue(
    'Mein Konfliktentwurf',
  );
  const json = await openJson(page);
  await json.fill('{"content":{}}');
  await page.evaluate(() => {
    location.hash = '/wissen';
  });
  await dialog.getByRole('button', { name: 'Speichern und fortfahren' }).click();
  await expect(dialog.getByRole('alert')).toBeVisible();
  await dialog.getByRole('button', { name: 'Navigation abbrechen' }).click();
  await expect(json).toHaveValue('{"content":{}}');
});

test('task and procedure relationships render article and process step titles with working links', async ({
  page,
  editor: { root, base },
}) => {
  for (const [collection, id] of [
    ['tasks', 'fn-system-definition'],
    ['procedures', 'procedure-system-master-data'],
  ]) {
    const path = join(root, 'src/content/' + collection + '.json');
    const objects = JSON.parse(await readFile(path, 'utf8'));
    objects.find((o: { id: string }) => o.id === id).relationships = [
      { targetId: 'guide-project-objectives', relation: 'related' },
      { targetId: 'step-2-8', relation: 'related' },
      { targetId: 'fn-ils-definition', relation: 'related' },
    ];
    await writeFile(path, JSON.stringify(objects, null, 2));
  }
  const article = JSON.parse(
    await readFile(join(root, 'src/content/articles/guide-project-objectives.json'), 'utf8'),
  );
  for (const route of [
    '/aufgabe/fn-system-definition',
    '/bedienweg/procedure-system-master-data',
  ]) {
    await page.goto(base + '/#' + route);
    await page.reload();
    const relationships = page
      .locator('section')
      .filter({ has: page.getByRole('heading', { name: 'Zusammenhänge', exact: true }) })
      .last();
    const link = relationships.locator('a[href="#/artikel/guide-project-objectives"]');
    await expect(link).toHaveText(article.title);
    await expect(relationships.locator('a[href="#/schritt/step-2-8"]')).toContainText('2.8');
    await expect(relationships.locator('a[href="#/aufgabe/fn-ils-definition"]')).not.toHaveText('');
    await link.click();
    await expect(page.locator('main h1')).toHaveText(article.title);
  }
});
