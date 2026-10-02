import { test, expect } from '@playwright/test';
import { request as httpRequest } from 'node:http';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, mkdtemp, cp, readFile, writeFile, appendFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { createServer, build, preview } from 'vite';
import type { ViteDevServer, PreviewServer } from 'vite';
import react from '@vitejs/plugin-react';
import { editorialValidationPlugin, localEditorPlugin } from '../scripts/local-editor-plugin';
import { migrateJournal } from '../src/lib/editorial-registry';
import { applyJournal, centerFinalNote, textOf, textRows } from '../src/lib/editorial';
import type { EditorialJournal } from '../src/lib/editorial';
import { baseArticles } from '../src/data/content';
import {
  editorToolFor,
  editorToolGroups,
  editorTools,
  toolSelectionText,
} from '../src/data/editor-tools';

const id = 'guide-r1-reporting';
const original = baseArticles.find((article) => article.id === id)!;
test.describe.configure({ mode: 'default' });
let root: string;
let server: ViteDevServer;
let staticServer: PreviewServer | undefined;
let url: string;
const empty: EditorialJournal = { version: 1, articleId: id, baseline: null, changes: [] };
async function start() {
  server = await createServer({
    root,
    configFile: false,
    plugins: [react(), localEditorPlugin(root)],
    cacheDir: join(root, 'node_modules/.vite-local-edit'),
    define: { __LOCAL_EDITOR__: 'true' },
    logLevel: 'silent',
    server: { host: '127.0.0.1', port: 0, hmr: false, watch: null },
  });
  await server.listen();
  const address = server.httpServer!.address() as { port: number };
  url = `http://127.0.0.1:${address.port}`;
}
async function reset() {
  await writeFile(join(root, 'src/data/local-editorial.json'), JSON.stringify(empty));
  await cp(resolve('src/data/control-content.ts'), join(root, 'src/data/control-content.ts'));
}
async function session() {
  const response = await fetch(`${url}/__local-editor/session`);
  expect(response.status).toBe(200);
  return (await response.json()).token as string;
}
async function load(token: string) {
  const response = await fetch(`${url}/__local-editor/articles/${id}`, {
    headers: { 'X-Local-Editor-Token': token },
  });
  expect(response.status, await response.clone().text()).toBe(200);
  return response.json();
}
async function put(token: string, body: unknown, path = id, extra: Record<string, string> = {}) {
  return fetch(`${url}/__local-editor/articles/${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Local-Editor-Token': token, ...extra },
    body: JSON.stringify(body),
  });
}

test.beforeAll(async ({}, info) => {
  await mkdir(resolve('test-results'), { recursive: true });
  root = await mkdtemp(resolve(`test-results/local-editor-${info.project.name}-`));
  await cp(resolve('src'), join(root, 'src'), { recursive: true });
  await cp(resolve('index.html'), join(root, 'index.html'));
  await cp(resolve('package.json'), join(root, 'package.json'));
  await start();
});
test.afterAll(async () => {
  await server?.close();
  if (staticServer)
    await new Promise<void>((resolve) => staticServer!.httpServer.close(() => resolve()));
});
test.beforeEach(reset);

for (const group of ['Artikeltexte', 'Abschnittstexte']) {
  test(`pencils target each adjacent field: ${group}`, async ({ page }) => {
    await page.goto(`${url}/#/artikel/${id}`);
    const allRows = textRows(textOf(original));
    await expect(page.locator('.local-editor')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Gesamten Beitrag bearbeiten' })).toHaveCount(0);
    await expect(page.locator('.inline-edit-target > .inline-edit-button')).toHaveCount(
      3 + original.sections.length + 4,
    );
    const rows = allRows.filter((row) =>
      group === 'Artikeltexte'
        ? ['Titel', 'Zusammenfassung', 'Kurzantwort'].includes(row.label)
        : /^Abschnitt \d+: Titel$/.test(row.label),
    );
    for (const row of rows) {
      const label = row.label.replace(': Titel', '');
      const pencil = page.getByRole('button', { name: `${label} bearbeiten`, exact: true });
      await expect(pencil.locator('..')).toContainText(row.value);
      if (row.label === 'Titel') {
        await expect(pencil).toBeEnabled();
        await pencil.focus();
        await page.keyboard.press('Enter');
      } else await pencil.click();
      const field = page.getByLabel(row.label, { exact: true });
      await expect(field).toBeFocused();
      await expect(field).toHaveValue(row.value);
      await expect(
        pencil.locator('..').locator('xpath=following-sibling::div[1]').locator('.local-editor'),
      ).toHaveCount(1);
      await expect(page.getByLabel('Voraussetzung 1', { exact: true })).toHaveCount(0);
      if (row.label !== 'Titel')
        await expect(page.getByLabel('Titel', { exact: true })).toHaveCount(0);
      if (row.label.startsWith('Abschnitt')) {
        const index = Number(row.label.match(/\d+/)![0]) - 1;
        await expect(page.locator(`#abschnitt-${index} .inline-edit-button`)).toHaveCount(1);
        await expect(field.locator('..').locator('..')).toContainText(
          `Abschnitt ${index + 1}: Text`,
        );
      }
    }
  });
}

test('procedure and limitation pencils open their corresponding editable groups', async ({
  page,
}) => {
  await page.goto(`${url}/#/artikel/${id}`);
  await expect(page.locator('.local-editor')).toHaveCount(0);
  for (const [section, label, fieldLabel, value] of [
    [
      'voraussetzungen',
      'Voraussetzungen',
      'Voraussetzung 1',
      original.knowledge!.procedures[0].prerequisites[0],
    ],
    ['bedienweg', 'Bedienweg', 'Bedienweg 1: Auslöser', original.knowledge!.procedures[0].trigger],
    [
      'ergebnispruefung',
      'Ergebnisprüfung',
      'Erwartetes Ergebnis 1',
      original.knowledge!.procedures[0].expectedResults[0],
    ],
    [
      'einschraenkungen',
      'Einschränkungen',
      'Einschränkung 1',
      original.knowledge!.applicationLimitations![0],
    ],
  ]) {
    await expect(page.locator(`#${section} > .inline-edit-target .inline-edit-button`)).toHaveCount(
      1,
    );
    await page.getByRole('button', { name: `${label} bearbeiten`, exact: true }).click();
    await expect(page.getByLabel(fieldLabel, { exact: true })).toBeFocused();
    await expect(page.getByLabel(fieldLabel, { exact: true })).toHaveValue(value);
    await expect(page.locator(`#${section} > .local-editor-slot .local-editor`)).toHaveCount(1);
    await expect(page.getByLabel('Titel', { exact: true })).toHaveCount(0);
    const saveButton = page.getByRole('button', {
      name: 'Änderung prüfen und speichern',
      exact: true,
    });
    await expect(saveButton).toBeInViewport();
    if (label !== 'Voraussetzungen')
      await expect(page.getByLabel('Voraussetzung 1', { exact: true })).toHaveCount(0);
    if (label !== 'Bedienweg')
      await expect(page.getByLabel('Bedienweg 1: Schritt 1', { exact: true })).toHaveCount(0);
    if (label === 'Bedienweg') {
      const tool = page.getByLabel('Bedienweg 1: Werkzeug 1', { exact: true });
      await expect(tool).toHaveValue(
        editorToolFor(original.knowledge!.procedures[0].actions[0].tool)!.id,
      );
      await expect(tool).toHaveJSProperty('tagName', 'SELECT');
      await tool.selectOption({ label: 'PWA' });
      await expect(tool).toHaveValue('tool-pwa');
      await tool.selectOption(editorToolFor(original.knowledge!.procedures[0].actions[0].tool)!.id);
    }
  }
  await page
    .getByRole('button', { name: 'Bearbeitung abbrechen und Entwurf verwerfen', exact: true })
    .click();
  await expect(page.locator('.local-editor')).toHaveCount(0);
});

test('tool dropdown merges aliases without rewriting untouched fields and saves canonical choices', async ({
  page,
}) => {
  await page.goto(`${url}/#/artikel/${id}`);
  await page.getByRole('button', { name: 'Bedienweg bearbeiten', exact: true }).click();
  const tool = page.getByLabel('Bedienweg 1: Werkzeug 1', { exact: true });
  await expect(tool).toBeVisible();
  expect(
    await tool
      .locator('optgroup')
      .evaluateAll((groups) => groups.map((group) => group.getAttribute('label'))),
  ).toEqual([...editorToolGroups.map((group) => group.label), 'Eigene Angabe']);
  expect(new Set(editorTools.map((item) => item.id)).size).toBe(editorTools.length);
  const aliases = editorTools.flatMap((item) => [item.label, ...item.aliases]);
  expect(new Set(aliases).size).toBe(aliases.length);
  expect(editorToolFor('PWA / Project Center / PDP Overview')?.label).toBe('PDP > Overview');
  expect(editorToolFor('PDP Objectives / Objectives-Liste')?.label).toBe(
    'PDP > Objectives > Objectives-Liste',
  );
  const names = await tool.locator('option').allTextContents();
  expect(names).toHaveLength(editorTools.length + 1);
  expect(new Set(names).size).toBe(names.length);
  expect(names.filter((name) => name === 'PDP > ILS Overview')).toHaveLength(1);
  expect(names).not.toContain('ILS Overview');
  expect(names).not.toContain('PDP ILS Overview');
  expect(
    names.filter((name) => name === 'MS Project Client > Ansicht 10 Phasen- und Meilensteinplan'),
  ).toHaveLength(1);
  expect(names).not.toContain('Ansicht 10');
  expect(names).not.toContain('Ansicht 10 Phasen- und Meilensteinplan');
  expect(names).not.toContain(
    'MS Project Client > Ansicht 10 Phasen- und Meilensteinplan / Ansicht 20 Projektstrukturplan',
  );
  expect(names).not.toContain('PDP > System Overview oder PDP > ILS Overview');
  expect(names).not.toContain('PWA / Project Center / Project Site / MS Project Client');
  expect(names).toContain('MS Project Client > Ansicht 20 Projektstrukturplan');
  expect(names).toContain('PDP > Objectives > Objectives-Liste');
  expect(names).toContain('PDP > Escalations > Liste Escalations');
  expect(names).toContain('PWA > Project Center');
  expect(names).toContain('Self Service Portal');
  expect(names).not.toContain('TopDesk (Service UHD)');
  expect(names).not.toContain('MS Project Client > veröffentlichter Projektplan');
  expect(editorToolFor('TopDesk / Service UHD')?.id).toBe('tool-topdesk');
  expect(editorToolFor('TopDesk (Service UHD)')?.label).toBe('Self Service Portal');
  expect(editorToolFor('MS Project Client > veröffentlichter Projektplan')).toBeUndefined();
  expect(names).not.toContain('Build Team');
  expect(editorToolFor('Build Team')?.id).toBe('tool-build-team');
  const pwaOptions = tool.locator('optgroup[label="PWA"] option');
  const viewLabels = [
    'PWA > Project Center > View: Programme und Projekte',
    'PWA > Project Center > View: Projekte und Teilprojekte',
    'PWA > Project Center > View: Projektfortschritt- und -status',
  ];
  expect((await pwaOptions.allTextContents()).filter((name) => name.includes('View: '))).toEqual(
    viewLabels,
  );
  expect(await pwaOptions.allTextContents()).toContain('PWA > Project Center > Build Team');
  expect(editorToolFor('PWA > Project Center > Projektfortschritt- und -status')?.id).toBe(
    'tool-project-reporting',
  );
  for (const label of [
    'PWA > Project Center > Build Team',
    ...viewLabels,
    'MS Project Client > Ansicht 11 Review Status',
    'MS Project Client > Ansicht 40 Projektfortschritt',
    'Self Service Portal',
  ]) {
    await tool.selectOption({ label });
    await expect(tool).toHaveValue(editorToolFor(label)!.id);
  }
  expect((await load(await session())).changes).toHaveLength(0);
  await tool.selectOption({ label: 'Self Service Portal' });
  await page
    .getByLabel('Änderungsgrund', { exact: true })
    .fill('Werkzeugbezeichnung vereinheitlichen.');
  await page.getByRole('button', { name: 'Änderung prüfen und speichern', exact: true }).click();
  await page.getByRole('button', { name: 'Im Repository speichern', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('dauerhaft im Repository gespeichert');
  const state = await load(await session());
  expect(state.article.knowledge.procedures[0].actions[0].tool).toBe('Self Service Portal');
  expect(state.article.knowledge.procedures[0].actions.slice(1)).toEqual(
    original.knowledge!.procedures[0].actions.slice(1),
  );
  await page.getByRole('button', { name: 'Gespeicherten Beitrag neu laden', exact: true }).click();
  await page.getByRole('button', { name: 'Bedienweg bearbeiten', exact: true }).click();
  await expect(tool).toHaveValue('tool-topdesk');
});

test('multiple tools persist with explicit usage through restart and a normal reader build', async ({
  page,
}) => {
  test.setTimeout(120000);
  await page.goto(`${url}/#/artikel/${id}`);
  await page.getByRole('button', { name: 'Bedienweg bearbeiten', exact: true }).click();
  const tool = page.getByLabel('Bedienweg 1: Werkzeug 1', { exact: true });
  const field = page
    .locator('.local-editor-field')
    .filter({ hasText: 'Bedienweg 1: Werkzeug 1' })
    .first();
  const choices = page.getByRole('group', { name: 'Bedienweg 1: Werkzeug 1', exact: true });
  const scope = choices.getByRole('checkbox', { name: 'PDP > Scope', exact: true });
  const status = choices.getByRole('checkbox', { name: 'PDP > Status', exact: true });
  await field.getByRole('button', { name: 'Mehrere Werkzeuge auswählen', exact: true }).click();
  await expect(choices.getByRole('checkbox')).toHaveCount(editorTools.length);
  await choices.getByRole('checkbox', { checked: true }).uncheck();
  await page.getByLabel('Änderungsgrund', { exact: true }).fill('Mehrere Werkzeugziele wählen.');
  await page.getByRole('button', { name: 'Änderung prüfen und speichern', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Werkzeug/Ansicht');
  expect((await load(await session())).changes).toHaveLength(0);
  const selection = {
    toolIds: ['tool-pdp-scope', 'tool-pdp-status'],
    relation: 'alternative' as const,
  };
  await scope.focus();
  await scope.press('Space');
  await expect(scope).toBeChecked();
  await status.check();
  const usage = page.getByLabel('Bedienweg 1: Werkzeug 1: Verwendung', { exact: true });
  await expect(usage).toHaveValue('all');
  await usage.selectOption('alternative');
  const selectedText = toolSelectionText(selection);
  await page.getByRole('button', { name: 'Änderung prüfen und speichern', exact: true }).click();
  await expect(page.locator('.local-editor-comparison')).toContainText(selectedText);
  await expect(page.locator('.local-editor-comparison')).toContainText(
    'Als Mehrfachauswahl gespeichert.',
  );
  expect((await new AxeBuilder({ page }).include('.local-editor').analyze()).violations).toEqual(
    [],
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.getByRole('button', { name: 'Im Repository speichern', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('dauerhaft im Repository gespeichert');
  const state = await load(await session());
  expect(state.article.knowledge.procedures[0].actions[0]).toEqual({
    ...original.knowledge!.procedures[0].actions[0],
    tool: selectedText,
    toolSelection: selection,
  });
  expect(state.article.knowledge.procedures[0].actions.slice(1)).toEqual(
    original.knowledge!.procedures[0].actions.slice(1),
  );
  expect(state.article.related).toEqual(original.related);
  expect(state.article.reviews).toEqual(original.reviews);
  expect(state.article.status).toBe('source-draft');
  // Disconnect Vite's restart polling before testing a fresh browser session.
  await page.goto('about:blank');
  await server.close();
  await start();
  expect(
    (await load(await session())).article.knowledge.procedures[0].actions[0].toolSelection,
  ).toEqual(selection);
  await page.goto(`${url}/#/artikel/${id}`);
  await page.getByRole('button', { name: 'Titel bearbeiten', exact: true }).click();
  await page.getByLabel('Titel', { exact: true }).fill('Mehrfachauswahl bleibt erhalten');
  await page.getByLabel('Änderungsgrund', { exact: true }).fill('Nur Titel ändern.');
  await page.getByRole('button', { name: 'Änderung prüfen und speichern', exact: true }).click();
  await page.getByRole('button', { name: 'Im Repository speichern', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('dauerhaft im Repository gespeichert');
  expect(
    (await load(await session())).article.knowledge.procedures[0].actions[0].toolSelection,
  ).toEqual(selection);
  await build({
    root,
    configFile: false,
    plugins: [react(), editorialValidationPlugin(root)],
    base: './',
    define: { __LOCAL_EDITOR__: 'false' },
    logLevel: 'silent',
  });
  const readerServer = await preview({
    root,
    configFile: false,
    logLevel: 'silent',
    preview: { host: '127.0.0.1', port: 0 },
  });
  try {
    const address = readerServer.httpServer.address() as { port: number };
    await page.goto(`http://127.0.0.1:${address.port}/#/artikel/${id}`);
    await expect(page.locator('#bedienweg')).toContainText(selectedText);
    await expect(page.locator('.inline-edit-button')).toHaveCount(0);
    await expect(page.locator('.local-editor')).toHaveCount(0);
  } finally {
    await new Promise<void>((done) => readerServer.httpServer.close(() => done()));
  }
  await page.goto(`${url}/#/artikel/${id}`);
  await page.getByRole('button', { name: 'Bedienweg bearbeiten', exact: true }).click();
  await expect(scope).toBeChecked();
  await expect(status).toBeChecked();
  await expect(choices.getByRole('checkbox', { checked: true })).toHaveCount(2);
  await expect(usage).toHaveValue('alternative');
  await status.uncheck();
  await expect(choices).toBeVisible();
  await scope.uncheck();
  await expect(choices).toBeVisible();
  await field.getByRole('button', { name: 'Zur Einzelauswahl wechseln', exact: true }).click();
  await expect(choices).toHaveCount(0);
  await expect(tool).toHaveValue('tool-pdp-scope');
  await page
    .getByLabel('Änderungsgrund', { exact: true })
    .fill('Bewusst auf ein Werkzeug reduzieren.');
  await page.getByRole('button', { name: 'Änderung prüfen und speichern', exact: true }).click();
  await page.getByRole('button', { name: 'Im Repository speichern', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('dauerhaft im Repository gespeichert');
  const reduced = await load(await session());
  expect(reduced.article.knowledge.procedures[0].actions[0].toolSelection).toBeUndefined();
  expect(reduced.article.knowledge.procedures[0].actions[0].tool).toBe('PDP > Scope');
  expect(reduced.changes[0].after.procedures[0].actions[0].toolSelection).toEqual(selection);
});

test('multiple tool validation rejects malformed selections, silent removal and stale writes', async () => {
  const token = await session();
  const state = await load(token);
  const selection = { toolIds: ['tool-pdp-scope', 'tool-pdp-status'], relation: 'all' as const };
  const after = textOf(state.article);
  Object.assign(after.procedures![0].actions[0], {
    tool: toolSelectionText(selection),
    toolSelection: selection,
  });
  const valid = { version: state.version, after, note: 'Strukturierte Werkzeugauswahl prüfen.' };
  for (const toolSelection of [
    null,
    {},
    { ...selection, relation: 'unknown' },
    { ...selection, toolIds: [] },
    { ...selection, toolIds: ['tool-pdp-scope'] },
    { ...selection, toolIds: ['tool-pdp-scope', 'tool-pdp-scope'] },
    { ...selection, toolIds: ['tool-pdp-scope', 'unknown'] },
    { ...selection, toolIds: ['tool-pdp-scope', 'tool-client-published-plan'] },
    { ...selection, extra: true },
  ]) {
    const invalid = structuredClone(after);
    Object.assign(invalid.procedures![0].actions[0], { toolSelection });
    expect((await put(token, { ...valid, after: invalid })).status).toBe(400);
  }
  const mismatch = structuredClone(after);
  mismatch.procedures![0].actions[0].tool = 'Falsche Werkzeugangabe';
  expect((await put(token, { ...valid, after: mismatch })).status).toBe(400);
  expect((await load(token)).changes).toHaveLength(0);
  expect((await put(token, valid)).status).toBe(200);
  const saved = await load(token);
  const stripped = textOf(saved.article);
  delete stripped.procedures![0].actions[0].toolSelection;
  expect((await put(token, { ...valid, version: saved.version, after: stripped })).status).toBe(
    400,
  );
  const stale = structuredClone(after);
  stale.procedures![0].actions[0].toolSelection!.relation = 'alternative';
  stale.procedures![0].actions[0].tool = toolSelectionText(
    stale.procedures![0].actions[0].toolSelection!,
  );
  expect((await put(token, { ...valid, after: stale })).status).toBe(409);
  expect((await load(token)).changes).toHaveLength(1);
  // Adding structure to identical text is still an audited field change.
  await reset();
  const raw = structuredClone(after);
  delete raw.procedures![0].actions[0].toolSelection;
  expect((await put(token, { ...valid, after: raw })).status).toBe(200);
  const rawState = await load(token);
  expect(
    (
      await put(token, {
        ...valid,
        version: rawState.version,
        confirmation: { confirmedBy: 'Testnutzer' },
      })
    ).status,
  ).toBe(200);
  const structured = await load(token);
  expect(structured.changes[1].confirmation.fields).toEqual(['Bedienweg 1: Werkzeug 1']);
  expect(structured.article.knowledge.procedures[0].actions[0].toolSelection).toEqual(selection);
});

test('existing combined and custom tool values stay local to their field and survive unrelated edits', async ({
  page,
}) => {
  const state = await load(await session());
  const after = textOf(state.article);
  const combined = 'MS Project Client > Ansicht 10 Phasen- und Meilensteinplan und PDP > Scope';
  after.procedures![0].actions[0].tool = combined;
  after.procedures![0].actions[1].tool = 'Eigene Bestandsansicht';
  after.procedures![0].actions[2].tool = 'MS Project Client > veröffentlichter Projektplan';
  expect(
    (
      await put(await session(), {
        version: state.version,
        after,
        note: 'Vorhandene Werkzeugangaben für Regression.',
      })
    ).status,
  ).toBe(200);
  await page.goto(`${url}/#/artikel/${id}`);
  await page.getByRole('button', { name: 'Bedienweg bearbeiten', exact: true }).click();
  const first = page.getByLabel('Bedienweg 1: Werkzeug 1', { exact: true });
  const second = page.getByLabel('Bedienweg 1: Werkzeug 2', { exact: true });
  const third = page.getByLabel('Bedienweg 1: Werkzeug 3', { exact: true });
  const fourth = page.getByLabel('Bedienweg 1: Werkzeug 4', { exact: true });
  await expect(first).toHaveValue('__existing__');
  await first
    .locator('..')
    .getByRole('button', { name: 'Mehrere Werkzeuge auswählen', exact: true })
    .click();
  const firstChoices = page.getByRole('group', { name: 'Bedienweg 1: Werkzeug 1', exact: true });
  await expect(firstChoices.getByRole('checkbox', { checked: true })).toHaveCount(0);
  await firstChoices
    .locator('..')
    .getByRole('button', { name: 'Zur Einzelauswahl wechseln', exact: true })
    .click();
  await expect(first).toHaveValue('__existing__');
  await expect(first.locator('optgroup[label="Bisherige Angabe"] option')).toHaveText(combined);
  await expect(second.locator('optgroup[label="Bisherige Angabe"] option')).toHaveText(
    'Eigene Bestandsansicht',
  );
  await expect(third.locator('optgroup[label="Bisherige Angabe"] option')).toHaveText(
    'MS Project Client > veröffentlichter Projektplan',
  );
  await expect(fourth.locator('optgroup[label="Bisherige Angabe"]')).toHaveCount(0);
  expect(await second.locator('option').allTextContents()).not.toContain(combined);
  expect(await first.locator('option').allTextContents()).not.toContain('Eigene Bestandsansicht');
  await first.selectOption({ label: 'PDP > Scope' });
  await first.selectOption('__existing__');
  await fourth.selectOption({ label: 'PDP > Overview' });
  await page.getByLabel('Änderungsgrund', { exact: true }).fill('Nur Werkzeug 4 bearbeiten.');
  await page.getByRole('button', { name: 'Änderung prüfen und speichern', exact: true }).click();
  const comparison = page.locator('.local-editor-comparison');
  await expect(comparison).toHaveCount(1);
  await expect(comparison).toContainText('Bedienweg 1: Werkzeug 4');
  await page.getByRole('button', { name: 'Im Repository speichern', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('dauerhaft im Repository gespeichert');
  const saved = await load(await session());
  expect(
    saved.article.knowledge.procedures[0].actions.map((action: { tool: string }) => action.tool),
  ).toEqual([
    combined,
    'Eigene Bestandsansicht',
    'MS Project Client > veröffentlichter Projektplan',
    'PDP > Overview',
    ...original.knowledge!.procedures[0].actions.slice(4).map((action) => action.tool),
  ]);
  expect(saved.changes[0].after.procedures[0].actions[0].tool).toBe(combined);
  await page.getByRole('button', { name: 'Gespeicherten Beitrag neu laden', exact: true }).click();
  await page.getByRole('button', { name: 'Bedienweg bearbeiten', exact: true }).click();
  await expect(first).toHaveValue('__existing__');
  await expect(first.locator('optgroup[label="Bisherige Angabe"] option')).toHaveText(combined);
});

test('switching areas protects an unsaved draft and stays accessible on both viewports', async ({
  page,
}) => {
  await page.goto(`${url}/#/artikel/${id}`);
  await page.getByRole('button', { name: 'Titel bearbeiten', exact: true }).click();
  await expect(page.getByLabel('Titel', { exact: true })).toBeFocused();
  await page.getByLabel('Titel', { exact: true }).fill('Entwurf bleibt beim Stiftwechsel erhalten');
  await page.getByLabel('Änderungsgrund').fill('Stiftwechsel im laufenden Entwurf.');
  await page.getByRole('button', { name: 'Abschnitt 2 bearbeiten', exact: true }).click();
  await expect(page.getByLabel('Abschnitt 2: Titel', { exact: true })).toHaveCount(0);
  await expect(page.getByRole('status')).toContainText('zuerst speichern');
  await expect(page.getByLabel('Titel', { exact: true })).toBeFocused();
  await expect(page.getByLabel('Titel', { exact: true })).toHaveValue(
    'Entwurf bleibt beim Stiftwechsel erhalten',
  );
  await expect(page.getByLabel('Änderungsgrund')).toHaveValue('Stiftwechsel im laufenden Entwurf.');
  expect((await new AxeBuilder({ page }).include('.article-content').analyze()).violations).toEqual(
    [],
  );
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
  ).toBeTruthy();
  await page
    .getByRole('button', { name: 'Bearbeitung abbrechen und Entwurf verwerfen', exact: true })
    .click();
  await page.getByRole('button', { name: 'Kurzantwort bearbeiten', exact: true }).click();
  await expect(page.getByLabel('Kurzantwort', { exact: true })).toBeFocused();
  await expect(page.getByLabel('Titel', { exact: true })).toHaveCount(0);
  await page
    .getByRole('button', { name: 'Bearbeitung abbrechen und Entwurf verwerfen', exact: true })
    .click();
  await page.evaluate(() => {
    window.location.hash = '/artikel/guide-project-master-data';
  });
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    baseArticles.find((article) => article.id === 'guide-project-master-data')!.title,
  );
  await expect(page.getByRole('button', { name: 'Titel bearbeiten', exact: true })).toBeEnabled();
});

test('save dialog consolidates actions, preserves drafts and supports keyboard navigation', async ({
  page,
}, info) => {
  await page.goto(`${url}/#/artikel/${id}`);
  await page.getByRole('button', { name: 'Titel bearbeiten', exact: true }).click();
  const launch = page.getByRole('button', { name: 'Änderung prüfen und speichern', exact: true });
  const dialog = page.getByRole('dialog', { name: 'Änderung prüfen und speichern', exact: true });
  const title = page.getByLabel('Titel', { exact: true });
  await expect(launch).toBeDisabled();
  await expect(
    page.getByRole('button', { name: 'Im Repository speichern', exact: true }),
  ).toHaveCount(0);
  await expect(page.getByLabel('Bestätigt von (für fachliche Bestätigung)')).toHaveCount(0);
  await title.fill('Dialogentwurf ohne Speicherung');
  await launch.click();
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Im Repository speichern', exact: true }).click();
  await expect(dialog.getByRole('alert')).toContainText('Änderungsgrund');
  await expect(dialog.getByLabel('Änderungsgrund', { exact: true })).toBeFocused();
  await expect(dialog.getByLabel('Änderungsgrund', { exact: true })).toHaveAttribute(
    'aria-invalid',
    'true',
  );
  expect((await load(await session())).changes).toHaveLength(0);
  await page
    .getByLabel('Änderungsgrund', { exact: true })
    .fill('Dialog und Entwurfserhalt prüfen.');
  await dialog.getByRole('button', { name: 'Zur Bearbeitung zurück', exact: true }).click();
  await launch.focus();
  await launch.press('Enter');
  await expect(dialog).toBeVisible();
  const regular = dialog.getByRole('radio', {
    name: 'Ohne fachliche Bestätigung speichern',
    exact: true,
  });
  const confirmed = dialog.getByRole('radio', {
    name: 'Als fachliche Erkenntnis bestätigt speichern',
    exact: true,
  });
  await expect(regular).toBeChecked();
  await expect(dialog.getByLabel('Änderungsgrund', { exact: true })).toBeFocused();
  await expect(dialog).toContainText('noch nicht gespeichert');
  await expect(dialog).toContainText('offizielle Freigaben bleiben davon unabhängig');
  await expect(dialog.locator('.local-editor-comparison')).toContainText(
    'Dialogentwurf ohne Speicherung',
  );
  await expect(
    dialog.getByRole('button', { name: 'Im Repository speichern', exact: true }),
  ).toBeInViewport();
  expect((await load(await session())).changes).toHaveLength(0);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  expect(await dialog.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
  await page.screenshot({ path: info.outputPath('save-dialog.png') });
  await regular.press('ArrowDown');
  await expect(confirmed).toBeChecked();
  await expect(page.getByLabel('Bestätigt von (für fachliche Bestätigung)')).toBeVisible();
  for (let n = 0; n < 8; n++) {
    await page.keyboard.press('Tab');
    expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(launch).toBeFocused();
  await expect(title).toHaveValue('Dialogentwurf ohne Speicherung');
  await expect(page.getByLabel('Änderungsgrund', { exact: true })).toHaveValue(
    'Dialog und Entwurfserhalt prüfen.',
  );
  await title.fill('Überarbeiteter Dialogentwurf');
  await launch.click();
  await expect(regular).toBeChecked();
  await expect(dialog.locator('.local-editor-comparison')).toContainText(
    'Überarbeiteter Dialogentwurf',
  );
  await dialog.getByRole('button', { name: 'Zur Bearbeitung zurück', exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await expect(title).toHaveValue('Überarbeiteter Dialogentwurf');
  expect((await load(await session())).changes).toHaveLength(0);
});

test('save dialog prevents duplicate writes and dismissal while saving', async ({ page }) => {
  await page.goto(`${url}/#/artikel/${id}`);
  await page.getByRole('button', { name: 'Titel bearbeiten', exact: true }).click();
  await page.getByLabel('Titel', { exact: true }).fill('Einmaliger Speichervorgang aus Dialog');
  await page
    .getByLabel('Änderungsgrund', { exact: true })
    .fill('Laufenden Speichervorgang schützen.');
  await page.getByRole('button', { name: 'Änderung prüfen und speichern', exact: true }).click();
  let release!: () => void;
  const paused = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route(`**/__local-editor/articles/${id}`, async (route) => {
    if (route.request().method() === 'PUT') await paused;
    await route.continue();
  });
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('button', { name: 'Im Repository speichern', exact: true }).click();
  try {
    await expect(
      dialog.getByRole('button', { name: 'Wird gespeichert …', exact: true }),
    ).toBeDisabled();
    await expect(
      dialog.getByRole('button', { name: 'Zur Bearbeitung zurück', exact: true }),
    ).toBeDisabled();
    await expect(
      dialog.getByRole('radio', {
        name: 'Als fachliche Erkenntnis bestätigt speichern',
        exact: true,
      }),
    ).toBeDisabled();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeVisible();
    expect((await load(await session())).changes).toHaveLength(0);
  } finally {
    release();
  }
  await expect(dialog).not.toBeVisible();
  await expect(page.getByRole('status')).toContainText('dauerhaft im Repository gespeichert');
  const state = await load(await session());
  expect(state.changes).toHaveLength(1);
  expect(state.changes[0].confirmation).toBeUndefined();
});

test('long procedure draft opens the dialog without a change reason and validates it at save time', async ({
  page,
}) => {
  await page.goto(`${url}/#/artikel/${id}`);
  await page.getByRole('button', { name: 'Bedienweg bearbeiten', exact: true }).click();
  const tool = page.getByLabel('Bedienweg 1: Werkzeug 2', { exact: true });
  await tool.selectOption('tool-project-subprojects');
  await page.getByRole('button', { name: 'Änderung prüfen und speichern', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  const reason = dialog.getByLabel('Änderungsgrund', { exact: true });
  await expect(reason).toHaveValue('');
  await expect(
    dialog.getByRole('button', { name: 'Im Repository speichern', exact: true }),
  ).toBeInViewport();
  await dialog.getByRole('button', { name: 'Im Repository speichern', exact: true }).click();
  await expect(reason).toBeFocused();
  await expect(dialog.getByRole('alert')).toBeInViewport();
  expect((await load(await session())).changes).toHaveLength(0);
  await reason.fill('Passende Ansicht für den zweiten Schritt wählen.');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('alert')).toHaveCount(0);
  await dialog.getByRole('button', { name: 'Zur Bearbeitung zurück', exact: true }).click();
  await expect(tool).toHaveValue('tool-project-subprojects');
  await expect(page.getByLabel('Änderungsgrund', { exact: true })).toHaveValue(
    'Passende Ansicht für den zweiten Schritt wählen.',
  );
  expect((await load(await session())).changes).toHaveLength(0);
});

test('direct article editing persists through server restart, static build and normal reader', async ({
  page,
}) => {
  test.setTimeout(120000);
  await page.goto(`${url}/#/artikel/${id}`);
  const replacements = {
    'Voraussetzung 1': 'Testvoraussetzung mit unveränderter Quellenhistorie.',
    'Bedienweg 1: Titel': 'Redaktioneller Testbedienweg',
    'Bedienweg 1: Auslöser': 'Testauslöser ohne fachliche Bestätigung.',
    'Bedienweg 1: Schritt 1': 'Testschritt für den dauerhaften Speicherweg.',
    'Bedienweg 1: Werkzeug 1': 'Testansicht',
    'Erwartetes Ergebnis 1': 'Testresultat als Entwurf.',
    'Prüffrage 1': 'Testfrage zum gespeicherten Stand?',
    'Einschränkung 1': 'Testeinschränkung bleibt nach Neustart erhalten.',
  };
  const edits = [
    { area: 'Titel', fields: { Titel: 'R1-Reporting – lokal geprüft' } },
    {
      area: 'Abschnitt 1',
      fields: { 'Abschnitt 1: Text': 'Dauerhafter redaktioneller Testtext mit ä, ö und ü.' },
    },
    { area: 'Voraussetzungen', fields: { 'Voraussetzung 1': replacements['Voraussetzung 1'] } },
    {
      area: 'Bedienweg',
      fields: Object.fromEntries(
        Object.entries(replacements).filter(([label]) => label.startsWith('Bedienweg')),
      ),
    },
    {
      area: 'Ergebnisprüfung',
      fields: {
        'Erwartetes Ergebnis 1': replacements['Erwartetes Ergebnis 1'],
        'Prüffrage 1': replacements['Prüffrage 1'],
      },
    },
    { area: 'Einschränkungen', fields: { 'Einschränkung 1': replacements['Einschränkung 1'] } },
  ];
  for (const [index, edit] of edits.entries()) {
    await page.getByRole('button', { name: `${edit.area} bearbeiten`, exact: true }).click();
    for (const [label, value] of Object.entries(edit.fields)) {
      if (label.includes(': Werkzeug ')) {
        await page.getByLabel(label, { exact: true }).selectOption('__custom__');
        await page.getByLabel(`${label} (eigene Angabe)`, { exact: true }).fill(value!);
      } else await page.getByLabel(label, { exact: true }).fill(value!);
    }
    if (!index) {
      await page
        .getByRole('button', { name: 'Änderung prüfen und speichern', exact: true })
        .click();
      await page.getByRole('button', { name: 'Im Repository speichern', exact: true }).click();
      await expect(page.getByRole('alert')).toContainText('Änderungsgrund');
      await page.getByRole('button', { name: 'Zur Bearbeitung zurück', exact: true }).click();
    }
    await page
      .getByLabel('Änderungsgrund')
      .fill('Technische Teständerung; keine fachliche Bestätigung.');
    await page.getByRole('button', { name: 'Änderung prüfen und speichern', exact: true }).click();
    const comparison = page.getByRole('region', { name: 'Vorschau und Änderungsvergleich' });
    for (const value of Object.values(edit.fields)) await expect(comparison).toContainText(value!);
    await page.getByRole('button', { name: 'Im Repository speichern', exact: true }).click();
    await expect(page.getByRole('status')).toContainText('dauerhaft im Repository gespeichert');
    const entries = migrateJournal(
      JSON.parse(await readFile(join(root, 'src/data/local-editorial.json'), 'utf8')),
    ).journals[id].changes as EditorialJournal['changes'];
    const changes = textRows(entries.at(-1)!.after).filter(
      (row, n) => row.value !== textRows(entries.at(-1)!.before)[n].value,
    );
    expect(changes.map((row) => row.label).sort()).toEqual(Object.keys(edit.fields).sort());
  }
  expect((await new AxeBuilder({ page }).include('.local-editor').analyze()).violations).toEqual(
    [],
  );
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
  ).toBeTruthy();
  const journal = migrateJournal(
    JSON.parse(await readFile(join(root, 'src/data/local-editorial.json'), 'utf8')),
  ).journals[id] as EditorialJournal;
  expect(journal.changes).toHaveLength(edits.length);
  expect(journal.baseline).toEqual(original);
  expect(journal.changes[0].before).toEqual(textOf(original));
  const current = await load(await session());
  expect(current.article.id).toBe(id);
  const expectedKnowledge = structuredClone(original.knowledge!);
  Object.assign(expectedKnowledge.procedures[0], {
    title: replacements['Bedienweg 1: Titel'],
    trigger: replacements['Bedienweg 1: Auslöser'],
  });
  expectedKnowledge.procedures[0].prerequisites[0] = replacements['Voraussetzung 1'];
  expectedKnowledge.procedures[0].actions[0] = {
    text: replacements['Bedienweg 1: Schritt 1'],
    tool: replacements['Bedienweg 1: Werkzeug 1'],
  };
  expectedKnowledge.procedures[0].expectedResults[0] = replacements['Erwartetes Ergebnis 1'];
  expectedKnowledge.procedures[0].checkQuestions[0] = replacements['Prüffrage 1'];
  expectedKnowledge.applicationLimitations![0] = replacements['Einschränkung 1'];
  expect(current.article.knowledge).toEqual(expectedKnowledge);
  expect(current.article.related).toEqual(original.related);
  expect(current.article.reviews).toEqual(original.reviews);
  expect(current.article.revisions.slice(0, -edits.length)).toEqual(original.revisions);
  expect(current.article.revisions.at(-1).sources).toEqual(original.revisions!.at(-1)!.sources);
  expect(current.article.status).toBe('source-draft');
  await page.getByRole('button', { name: 'Gespeicherten Beitrag neu laden', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('R1-Reporting – lokal geprüft');
  await page.getByRole('button', { name: 'Abschnitt 1 bearbeiten', exact: true }).click();
  await expect(page.getByLabel('Abschnitt 1: Text', { exact: true })).toHaveValue(
    'Dauerhafter redaktioneller Testtext mit ä, ö und ü.',
  );
  await page
    .getByRole('button', { name: 'Bearbeitung abbrechen und Entwurf verwerfen', exact: true })
    .click();
  const oldToken = await session();
  await server.close();
  await start();
  const expired = await put(oldToken, {});
  expect(expired.status).toBe(403);
  expect((await load(await session())).article.title).toBe('R1-Reporting – lokal geprüft');
  expect((await load(await session())).article.knowledge).toEqual(expectedKnowledge);
  await build({
    root,
    configFile: false,
    plugins: [react(), editorialValidationPlugin(root)],
    base: './',
    define: { __LOCAL_EDITOR__: 'false' },
    logLevel: 'silent',
  });
  staticServer = await preview({
    root,
    configFile: false,
    logLevel: 'silent',
    preview: { host: '127.0.0.1', port: 0 },
  });
  const address = staticServer.httpServer.address() as { port: number };
  const reader = `http://127.0.0.1:${address.port}`;
  await page.goto(`${reader}/#/artikel/${id}`);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('R1-Reporting – lokal geprüft');
  await expect(
    page.getByText('Dauerhafter redaktioneller Testtext', { exact: false }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Titel bearbeiten', exact: true })).toHaveCount(0);
  await expect(page.locator('.inline-edit-target')).toHaveCount(0);
  for (const [selector, value] of [
    ['#voraussetzungen', replacements['Voraussetzung 1']],
    ['#bedienweg', replacements['Bedienweg 1: Schritt 1']],
    ['#ergebnispruefung', replacements['Prüffrage 1']],
    ['#einschraenkungen', replacements['Einschränkung 1']],
  ])
    await expect(page.locator(selector)).toContainText(value);
  const response = await fetch(`${reader}/__local-editor/articles/${id}`, {
    method: 'PUT',
    body: '{}',
  });
  expect(response.status).toBe(404);
  await expect(
    page.locator('.demo-note').filter({ hasText: 'Fachlich nicht freigegeben' }),
  ).toBeVisible();
});

test('explicit user confirmation persists with field scope and is revoked by later edits', async ({
  page,
}) => {
  test.setTimeout(90000);
  await page.goto(`${url}/#/artikel/${id}`);
  await page.getByRole('button', { name: 'Abschnitt 1 bearbeiten', exact: true }).click();
  await page
    .getByLabel('Abschnitt 1: Text', { exact: true })
    .fill('Persönlich bestätigte Testkenntnis.');
  await page.getByLabel('Änderungsgrund', { exact: true }).fill('Eigene fachliche Erkenntnis.');
  await page.getByRole('button', { name: 'Änderung prüfen und speichern', exact: true }).click();
  await page
    .getByRole('radio', { name: 'Als fachliche Erkenntnis bestätigt speichern', exact: true })
    .check();
  const confirm = page.getByRole('button', {
    name: 'Im Repository speichern',
    exact: true,
  });
  await confirm.click();
  await expect(page.getByRole('status')).toContainText('Bestätigt von');
  await expect(page.getByLabel('Bestätigt von (für fachliche Bestätigung)')).toBeFocused();
  expect((await load(await session())).changes).toHaveLength(0);
  await page.getByLabel('Bestätigt von (für fachliche Bestätigung)').fill('Testnutzerin');
  await confirm.click();
  await expect(page.getByRole('status')).toContainText('als fachliche Erkenntnis bestätigt');
  let state = await load(await session());
  expect(state.changes[0].confirmation).toEqual({
    confirmedBy: 'Testnutzerin',
    fields: ['Abschnitt 1: Text'],
  });
  expect(state.article.userConfirmations).toEqual([
    {
      revision: original.revisions!.at(-1)!.number + 1,
      date: state.changes[0].date,
      confirmedBy: 'Testnutzerin',
      fields: ['Abschnitt 1: Text'],
    },
  ]);
  expect(state.article.reviews).toEqual(original.reviews);
  expect(state.article.status).toBe('source-draft');
  expect(state.article.knowledge).toEqual(original.knowledge);
  expect(state.article.revisions.at(-1).note).toContain('Vom Nutzer fachlich bestätigte Änderung');
  await page.getByRole('button', { name: 'Gespeicherten Beitrag neu laden', exact: true }).click();
  const evidence = page.locator('details[aria-label="Nutzerbestätigte Erkenntnisse"]');
  await evidence.locator('summary').click();
  await expect(evidence).toContainText('Testnutzerin: Abschnitt 1: Text');
  await expect(evidence).not.toContainText('Zusammenfassung');
  await server.close();
  await start();
  expect((await load(await session())).article.userConfirmations).toEqual(
    state.article.userConfirmations,
  );
  await build({
    root,
    configFile: false,
    plugins: [react(), editorialValidationPlugin(root)],
    base: './',
    define: { __LOCAL_EDITOR__: 'false' },
    logLevel: 'silent',
  });
  if (staticServer) await new Promise<void>((done) => staticServer!.httpServer.close(() => done()));
  staticServer = await preview({
    root,
    configFile: false,
    logLevel: 'silent',
    preview: { host: '127.0.0.1', port: 0 },
  });
  const address = staticServer.httpServer.address() as { port: number };
  await page.goto(`http://127.0.0.1:${address.port}/#/artikel/${id}`);
  await page.locator('details[aria-label="Nutzerbestätigte Erkenntnisse"] summary').click();
  await expect(page.locator('details[aria-label="Nutzerbestätigte Erkenntnisse"]')).toContainText(
    'Testnutzerin',
  );
  await expect(page.locator('.local-editor')).toHaveCount(0);
  const tampered = structuredClone({
    version: 1,
    articleId: id,
    baseline: original,
    changes: state.changes,
  });
  tampered.changes[0].confirmation.fields = ['Titel'];
  expect(() => applyJournal(original, tampered)).toThrow('geänderten Felder');
  state = await load(await session());
  const after = textOf(state.article);
  after.sections[0].body = 'Späterer unbestätigter Testtext';
  expect(
    (await put(await session(), { version: state.version, note: 'Spätere Textänderung', after }))
      .status,
  ).toBe(200);
  state = await load(await session());
  expect(state.article.userConfirmations).toEqual([]);
  expect(state.changes[0].confirmation.confirmedBy).toBe('Testnutzerin');
  expect(state.changes[1].confirmation).toBeUndefined();
});

test('final Center approval needs no comment and survives restart and reader build', async ({
  page,
}, info) => {
  await page.goto(`${url}/#/artikel/${id}`);
  await page.getByRole('button', { name: 'Abschnitt 1 bearbeiten', exact: true }).click();
  await page.getByLabel('Abschnitt 1: Titel', { exact: true }).fill('Freigegebener Testtitel');
  await page
    .getByLabel('Abschnitt 1: Text', { exact: true })
    .fill('Für das Center final freigegebener Testtext.');
  await page.getByRole('button', { name: 'Änderung prüfen und speichern', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Änderung prüfen und speichern' });
  await dialog.getByRole('radio', { name: 'Für das Center final freigeben', exact: true }).check();
  await expect(dialog.getByLabel('Änderungsgrund', { exact: true })).toHaveCount(0);
  const save = dialog.getByRole('button', { name: 'Im Repository speichern', exact: true });
  await save.click();
  await expect(dialog.getByRole('status')).toContainText('Bestätigt von');
  await expect(dialog.getByLabel('Freigegeben von (für das Center)')).toBeFocused();
  expect((await load(await session())).changes).toHaveLength(0);
  await dialog.getByLabel('Freigegeben von (für das Center)').fill('Testnutzerin');
  await expect(dialog.getByRole('status')).toHaveCount(0);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.screenshot({ path: info.outputPath('center-final-dialog.png') });
  const previous = await load(await session());
  await save.click();
  await expect(page.getByRole('status')).toContainText('für das Center final freigegeben');
  const state = await load(await session());
  expect(state.changes[0].note).toBe(centerFinalNote);
  expect(state.changes[0].confirmation).toEqual({
    kind: 'center-final',
    confirmedBy: 'Testnutzerin',
    fields: ['Abschnitt 1: Titel', 'Abschnitt 1: Text'],
  });
  expect(state.article.userConfirmations).toEqual([
    {
      ...state.changes[0].confirmation,
      revision: state.changes[0].revision,
      date: state.changes[0].date,
    },
  ]);
  expect(state.article.knowledge).toEqual(original.knowledge);
  expect(state.article.reviews).toEqual(original.reviews);
  expect(state.article.revisions.slice(0, -1)).toEqual(original.revisions);
  expect(state.article.revisions.at(-1).note).toContain(centerFinalNote);
  expect(state.article.status).toBe('source-draft');
  // Final approval obeys exactly the same version check as every other save.
  expect(
    (
      await put(await session(), {
        version: previous.version,
        note: '',
        after: { ...textOf(state.article), title: 'Konkurrierender Titel' },
        confirmation: { confirmedBy: 'Zweiter Nutzer', kind: 'center-final' },
      })
    ).status,
  ).toBe(409);
  expect((await load(await session())).changes).toHaveLength(1);
  await page.getByRole('button', { name: 'Gespeicherten Beitrag neu laden', exact: true }).click();
  const approvals = page.locator('details[aria-label="Nutzerbestätigte Erkenntnisse"]');
  await approvals.locator('summary').click();
  await expect(approvals).toContainText('Für das Center final freigegeben');
  await expect(approvals).toContainText('Testnutzerin: Abschnitt 1: Titel, Abschnitt 1: Text');
  await expect(approvals).not.toContainText('keine externe');
  await page.goto('about:blank');
  await server.close();
  await start();
  expect((await load(await session())).article.userConfirmations).toEqual(
    state.article.userConfirmations,
  );
  await build({
    root,
    configFile: false,
    plugins: [react(), editorialValidationPlugin(root)],
    base: './',
    define: { __LOCAL_EDITOR__: 'false' },
    logLevel: 'silent',
  });
  if (staticServer) await new Promise<void>((done) => staticServer!.httpServer.close(() => done()));
  staticServer = await preview({
    root,
    configFile: false,
    logLevel: 'silent',
    preview: { host: '127.0.0.1', port: 0 },
  });
  const address = staticServer.httpServer.address() as { port: number };
  await page.goto(`http://127.0.0.1:${address.port}/#/artikel/${id}`);
  await page.locator('details[aria-label="Nutzerbestätigte Erkenntnisse"] summary').click();
  await expect(page.locator('details[aria-label="Nutzerbestätigte Erkenntnisse"]')).toContainText(
    'Für das Center final freigegeben',
  );
  await expect(
    page.getByRole('heading', { name: 'Freigegebener Testtitel', exact: true }),
  ).toBeVisible();
  await expect(page.locator('.inline-edit-button, .local-editor')).toHaveCount(0);
  const journal = { version: 1, articleId: id, baseline: original, changes: state.changes };
  for (const confirmation of [
    { ...state.changes[0].confirmation, kind: 'reviewed' },
    { ...state.changes[0].confirmation, fields: ['Titel'] },
  ])
    expect(() =>
      applyJournal(original, { ...journal, changes: [{ ...state.changes[0], confirmation }] }),
    ).toThrow();
  expect(() =>
    applyJournal(original, {
      ...journal,
      changes: [{ ...state.changes[0], note: 'Fremde Anmerkung' }],
    }),
  ).toThrow('Historieneintrag');
  const after = textOf(state.article);
  after.sections[0].body = 'Spätere unbestätigte Änderung';
  expect(
    (await put(await session(), { version: state.version, note: 'Neue Fassung', after })).status,
  ).toBe(200);
  const later = await load(await session());
  expect(later.article.userConfirmations[0].fields).toEqual(['Abschnitt 1: Titel']);
  expect(later.article.userConfirmations[0].kind).toBe('center-final');
  expect(later.changes[0]).toEqual(state.changes[0]);
  expect(later.changes[1].confirmation).toBeUndefined();
});

test('concurrent edits remain visible and require explicit draft disposal', async ({
  page,
  context,
}) => {
  const second = await context.newPage();
  for (const target of [page, second]) {
    await target.goto(`${url}/#/artikel/${id}`);
    await target.getByRole('button', { name: 'Voraussetzungen bearbeiten', exact: true }).click();
  }
  await second
    .getByLabel('Voraussetzung 1', { exact: true })
    .fill('Konkurrierender Prozedurentwurf');
  await second.getByLabel('Änderungsgrund').fill('Zweite redaktionelle Sitzung.');
  await second.getByRole('button', { name: 'Änderung prüfen und speichern', exact: true }).click();
  await second
    .getByRole('radio', { name: 'Als fachliche Erkenntnis bestätigt speichern', exact: true })
    .check();
  await second.getByLabel('Bestätigt von (für fachliche Bestätigung)').fill('Zweiter Testnutzer');
  await page.getByLabel('Voraussetzung 1', { exact: true }).fill('Erste gespeicherte Prozedur');
  await page.getByLabel('Änderungsgrund').fill('Erste redaktionelle Sitzung.');
  await page.getByRole('button', { name: 'Änderung prüfen und speichern', exact: true }).click();
  await page.getByRole('button', { name: 'Im Repository speichern', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('dauerhaft');
  await second.getByRole('button', { name: 'Im Repository speichern', exact: true }).click();
  await expect(second.getByRole('status')).toContainText('Konflikt');
  await expect(second.getByLabel('Voraussetzung 1', { exact: true })).toHaveValue(
    'Konkurrierender Prozedurentwurf',
  );
  await expect(second.getByRole('alert')).toContainText('Erste gespeicherte Prozedur');
  await expect(
    second.getByRole('button', { name: 'Änderung prüfen und speichern', exact: true }),
  ).toBeDisabled();
  await second
    .getByRole('button', { name: 'Aktuellen Stand übernehmen und Entwurf verwerfen', exact: true })
    .click();
  await expect(second.getByLabel('Voraussetzung 1', { exact: true })).toHaveValue(
    'Erste gespeicherte Prozedur',
  );
  await second.getByLabel('Voraussetzung 1', { exact: true }).fill('Abgeglichene zweite Sitzung');
  await second.getByRole('button', { name: 'Änderung prüfen und speichern', exact: true }).click();
  await second.getByRole('button', { name: 'Im Repository speichern', exact: true }).click();
  await expect(second.getByRole('status')).toContainText('dauerhaft');
  const persisted = migrateJournal(
    JSON.parse(await readFile(join(root, 'src/data/local-editorial.json'), 'utf8')),
  ).journals[id];
  expect(persisted.changes).toHaveLength(2);
  expect(persisted.changes[1].before.procedures[0].prerequisites[0]).toBe(
    'Erste gespeicherte Prozedur',
  );
  expect(persisted.changes[1].after.title).toBe(original.title);
  expect(
    persisted.changes.every((entry: EditorialJournal['changes'][number]) => !entry.confirmation),
  ).toBeTruthy();
});
test('API rejects illegal objects, fields, origins, tokens and broken input without changing files', async () => {
  const token = await session();
  const state = await load(token);
  const valid = {
    version: state.version,
    note: 'Redaktionelle Teständerung.',
    after: { ...textOf(state.article), title: 'Teständerung' },
  };
  const before = await readFile(join(root, 'src/data/local-editorial.json'), 'utf8');
  expect((await put(token, valid, 'unknown-article')).status).toBe(404);
  expect((await put(token, valid, '../../package.json')).status).not.toBe(200);
  expect((await put('', valid)).status).toBe(403);
  expect((await put(token, valid, id, { Origin: 'https://example.com' })).status).toBe(403);
  // Native fetch replaces Host; use an actual HTTP request for the rebinding check.
  const hostStatus = await new Promise<number>((resolveStatus, reject) => {
    const request = httpRequest(
      url + '/__local-editor/articles/' + id,
      {
        method: 'PUT',
        headers: {
          Host: 'attacker.example',
          'Content-Type': 'application/json',
          'X-Local-Editor-Token': token,
        },
      },
      (response) => {
        response.resume();
        resolveStatus(response.statusCode!);
      },
    );
    request.on('error', reject);
    request.end(JSON.stringify(valid));
  });
  expect(hostStatus).toBe(403);
  expect((await put(token, { ...valid, path: 'package.json' })).status).toBe(400);
  expect(
    (
      await put(token, {
        ...valid,
        after: { ...valid.after, id: 'other', reviews: [{ revision: 4 }], status: 'reviewed' },
      })
    ).status,
  ).toBe(400);
  expect((await put(token, { ...valid, after: { ...valid.after, title: '' } })).status).toBe(400);
  expect((await put(token, { ...valid, after: { ...valid.after, sections: [] } })).status).toBe(
    400,
  );
  expect((await put(token, { ...valid, note: '' })).status).toBe(400);
  for (const confirmation of [
    null,
    {},
    { confirmedBy: '' },
    { confirmedBy: 'x'.repeat(201) },
    { confirmedBy: 'Testnutzer', fields: ['Titel'] },
    { confirmedBy: 'Testnutzer', status: 'reviewed' },
    { confirmedBy: 'Testnutzer', kind: 'reviewed' },
    { confirmedBy: 'Testnutzer', kind: null },
    { confirmedBy: '', kind: 'center-final' },
    { confirmedBy: 'Testnutzer', kind: 'center-final', fields: ['Titel'] },
  ])
    expect((await put(token, { ...valid, confirmation })).status).toBe(400);
  expect(
    (await put(token, { ...valid, note: '', confirmation: { confirmedBy: 'Testnutzer' } })).status,
  ).toBe(400);
  expect(
    (
      await put(token, {
        ...valid,
        confirmation: { confirmedBy: 'Testnutzer', kind: 'center-final' },
      })
    ).status,
  ).toBe(400);
  expect(
    (
      await put(token, {
        ...valid,
        after: textOf(state.article),
        confirmation: { confirmedBy: 'Testnutzer' },
      })
    ).status,
  ).toBe(400);
  const tampered = [
    { ...valid.after, procedures: [] },
    { ...valid.after, procedures: [{ ...valid.after.procedures![0], id: 'procedure-other' }] },
    { ...valid.after, procedures: [{ ...valid.after.procedures![0], evidence: [] }] },
    { ...valid.after, procedures: [{ ...valid.after.procedures![0], prerequisites: [] }] },
    { ...valid.after, procedures: [{ ...valid.after.procedures![0], actions: [] }] },
    {
      ...valid.after,
      procedures: [
        {
          ...valid.after.procedures![0],
          actions: valid.after.procedures![0].actions.map((a, i) => (i ? a : { ...a, tool: '' })),
        },
      ],
    },
    { ...valid.after, limitations: [] },
    { ...valid.after, limitations: [''] },
    { ...valid.after, limitations: undefined },
  ];
  for (const after of tampered) expect((await put(token, { ...valid, after })).status).toBe(400);
  expect((await put(token, { ...valid, note: 'x'.repeat(300000) })).status).toBe(413);
  const malformed = await fetch(url + '/__local-editor/articles/' + id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Local-Editor-Token': token },
    body: '{broken',
  });
  expect(malformed.status).toBe(400);
  expect((await put(token, { ...valid, after: textOf(state.article) })).status).toBe(400);
  const same = textOf(state.article);
  expect(
    (
      await put(token, {
        ...valid,
        after: {
          sections: same.sections,
          takeaway: same.takeaway,
          summary: same.summary,
          title: same.title,
        },
      })
    ).status,
  ).toBe(400);
  expect(await readFile(join(root, 'src/data/local-editorial.json'), 'utf8')).toBe(before);
});

test('simultaneous saves, external changes and a surviving lock prevent overwrites', async () => {
  const token = await session();
  let state = await load(token);
  const body = {
    version: state.version,
    note: 'Paralleltest.',
    after: { ...textOf(state.article), title: 'Parallel gespeichert' },
  };
  const results = await Promise.all([put(token, body), put(token, body)]);
  expect(results.map((response) => response.status).sort()).toEqual([200, 409]);
  state = await load(token);
  const externalBody = {
    ...body,
    version: state.version,
    after: { ...textOf(state.article), title: 'Nicht übernehmen' },
  };
  await appendFile(
    join(root, 'src/data/control-content.ts'),
    '\n// Externe gleichzeitige Datenpflege\n',
  );
  expect((await put(token, externalBody)).status).toBe(409);
  const before = await readFile(join(root, 'src/data/local-editorial.json'), 'utf8');
  await writeFile(
    join(root, 'src/data/local-editorial.json.lock'),
    'Sperre eines abgebrochenen Vorgangs',
  );
  expect((await put(token, { ...externalBody, version: (await load(token)).version })).status).toBe(
    409,
  );
  expect(await readFile(join(root, 'src/data/local-editorial.json'), 'utf8')).toBe(before);
  // Leave this isolated fixture intact for inspection. Subsequent tests do not write to its API.
});

test('earlier text-only history survives the extended editable scope', () => {
  const legacyBaseline = structuredClone(original);
  delete legacyBaseline.knowledge!.applicationLimitations;
  const { title, summary, takeaway, sections } = textOf(original);
  const before = { title, summary, takeaway, sections };
  const after = { ...before, title: 'Früherer gespeicherter Titel' };
  const journal: EditorialJournal = {
    version: 1,
    articleId: id,
    baseline: legacyBaseline,
    changes: [
      {
        revision: original.revisions!.at(-1)!.number + 1,
        date: '2026-09-30',
        note: 'Älterer Textdurchstich',
        before,
        after,
      },
    ],
  };
  const migrated = applyJournal(original, journal);
  expect(migrated.title).toBe(after.title);
  expect(migrated.knowledge).toEqual(original.knowledge);
  const next = textOf(migrated);
  next.procedures![0].prerequisites[0] = 'Neue redaktionelle Voraussetzung';
  const extended = {
    ...journal,
    changes: [
      ...journal.changes,
      {
        revision: migrated.revisions!.at(-1)!.number + 1,
        date: '2026-10-01',
        note: 'Erweiterte Textpflege',
        before: textOf(migrated),
        after: next,
      },
    ],
  };
  const result = applyJournal(original, extended);
  expect(result.knowledge!.procedures[0].prerequisites[0]).toBe('Neue redaktionelle Voraussetzung');
  expect(result.knowledge!.procedures[0].evidence).toEqual(
    original.knowledge!.procedures[0].evidence,
  );
  expect(result.revisions!.slice(0, -2)).toEqual(original.revisions);
  expect(result.reviews).toEqual(original.reviews);
  expect(journal.changes[0].after).toEqual(after);
  expect(() =>
    applyJournal(original, {
      ...journal,
      changes: [{ ...journal.changes[0], after: textOf(migrated) }],
    }),
  ).toThrow('lückenlos');
  const changedBaseline = structuredClone(original);
  changedBaseline.knowledge!.applicationLimitations![0] = 'Extern geänderte Einschränkung';
  expect(() => applyJournal(changedBaseline, extended)).toThrow('lückenlos');
});

test('reviews remain historical and a changed canonical baseline fails closed', async () => {
  const reviewed = {
    ...structuredClone(original),
    status: 'reviewed' as const,
    reviews: [
      {
        revision: original.revisions!.at(-1)!.number,
        date: '2026-09-30',
        reviewer: 'Testprüfer',
        subject: 'Testbeleg',
        environment: 'Testumgebung',
        record: 'test-only',
      },
    ],
  };
  const revision = original.revisions!.at(-1)!.number + 1;
  const journal: EditorialJournal = {
    version: 1,
    articleId: id,
    baseline: reviewed,
    changes: [
      {
        revision,
        date: '2026-09-30',
        note: 'Teständerung',
        before: textOf(reviewed),
        after: { ...textOf(reviewed), title: 'Geänderter Testbeitrag' },
      },
    ],
  };
  const result = applyJournal(reviewed, journal);
  expect(result.status).toBe('source-draft');
  expect(result.reviews).toEqual(reviewed.reviews);
  expect(result.reviews!.some((review) => review.revision === revision)).toBeFalsy();
  expect(() => applyJournal({ ...reviewed, title: 'Extern geändert' }, journal)).toThrow(
    'extern geändert',
  );
  expect(() =>
    applyJournal(reviewed, {
      ...journal,
      changes: [{ ...journal.changes[0], revision: revision + 1 }],
    }),
  ).toThrow('Revisionsnummer');
  expect(() =>
    applyJournal(reviewed, {
      ...journal,
      changes: [
        { ...journal.changes[0], before: { ...textOf(reviewed), title: 'Falscher Ausgangstext' } },
      ],
    }),
  ).toThrow('lückenlos');
  await writeFile(
    join(root, 'src/data/local-editorial.json'),
    JSON.stringify({
      ...journal,
      baseline: original,
      changes: [{ ...journal.changes[0], before: textOf(original) }],
    }),
  );
  await appendFile(
    join(root, 'src/data/control-content.ts'),
    '\nreportingArticle.title = "Extern geändert";\n',
  );
  const response = await fetch(`${url}/__local-editor/articles/${id}`, {
    headers: { 'X-Local-Editor-Token': await session() },
  });
  expect(response.status).toBe(400);
  expect(await response.text()).toContain('extern geändert');
  await expect(
    build({
      root,
      configFile: false,
      plugins: [react(), editorialValidationPlugin(root)],
      define: { __LOCAL_EDITOR__: 'false' },
      logLevel: 'silent',
    }),
  ).rejects.toThrow('extern geändert');
});
