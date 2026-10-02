import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { cp, mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { build, preview } from 'vite';
import react from '@vitejs/plugin-react';
import { spawn } from 'node:child_process';
import type { ChildProcess } from 'node:child_process';
import { textOf, applyJournal, changedFields, centerFinalNote } from '../src/lib/editorial';
import { migrateJournal } from '../src/lib/editorial-registry';
import { editorialObjects } from '../src/data/editorial-content';

let root: string, url: string, server: ChildProcess;
let token: string;
const empty = { version: 1, articleId: 'guide-r1-reporting', baseline: null, changes: [] };
test.describe.configure({ mode: 'default' });
async function start() {
  server = spawn(process.execPath, [join(root, 'dist-editor/server.js')], {
    cwd: root,
    env: { ...process.env, EDITOR_PORT: '0' },
    windowsHide: true,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  url = await new Promise<string>((done, reject) => {
    let output = '';
    server.stdout!.on('data', (value) => {
      output += value;
      const match = /http:\/\/127\.0\.0\.1:\d+/.exec(output);
      if (match) done(match[0]);
    });
    server.stderr!.on('data', (value) => {
      output += value;
    });
    server.once('error', reject);
    server.once('exit', (code) => reject(new Error(`Editor beendet (${code}): ${output}`)));
  });
  token = (await (await fetch(url + '/__local-editor/session')).json()).token;
}
async function stop() {
  if (server && server.exitCode === null)
    await new Promise<void>((done) => {
      server.once('exit', () => done());
      server.kill();
    });
}
async function get(id: string) {
  const response = await fetch(`${url}/__local-editor/articles/${id}`, {
    headers: { 'X-Local-Editor-Token': token },
  });
  expect(response.status).toBe(200);
  return response.json();
}
async function put(id: string, value: unknown) {
  return fetch(`${url}/__local-editor/articles/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Local-Editor-Token': token },
    body: JSON.stringify(value),
  });
}
test.beforeAll(async ({}, info) => {
  await mkdir(resolve('test-results'), { recursive: true });
  root = await mkdtemp(resolve(`test-results/built-editor-${info.project.name}-`));
  for (const path of ['src', 'dist-editor'])
    await cp(resolve(path), join(root, path), { recursive: true });
  for (const path of ['index.html', 'package.json']) await cp(resolve(path), join(root, path));
  await start();
});
test.beforeEach(async () => {
  await writeFile(join(root, 'src/data/local-editorial.json'), JSON.stringify(empty));
});
test.afterAll(async () => {
  await stop();
});

test('catalog title approval survives outcome-only edits and is revoked only by a title edit', async () => {
  const id = 'functions:fn-external-milestones';
  let state = await get(id);
  let after = textOf(state.article);
  after.extra!.title += ' Freigegeben';
  expect(changedFields(textOf(state.article), after)).toEqual(['Titel']);
  expect(
    (
      await put(id, {
        version: state.version,
        after,
        note: '',
        confirmation: { confirmedBy: 'Testperson', kind: 'center-final' },
      })
    ).status,
  ).toBe(200);
  state = await get(id);
  const approval = state.article.userConfirmations;
  expect(approval).toEqual([expect.objectContaining({ fields: ['Titel'] })]);
  after = textOf(state.article);
  after.extra!.outcome += ' Geändert';
  expect(changedFields(textOf(state.article), after)).toEqual(['Ergebnis']);
  expect((await put(id, { version: state.version, after, note: 'Nur Ergebnis' })).status).toBe(200);
  await stop();
  await start();
  state = await get(id);
  expect(state.article.userConfirmations).toEqual(approval);
  after = textOf(state.article);
  after.extra!.title += ' Später';
  expect((await put(id, { version: state.version, after, note: 'Jetzt Titel' })).status).toBe(200);
  expect((await get(id)).article.userConfirmations).toEqual([]);
});

test('historical catalog confirmations replay without changing journal entries or revoking untouched titles', () => {
  const id = 'functions:fn-external-milestones';
  const baseline = editorialObjects.get(id)!.baseline;
  const before = textOf(baseline),
    after = structuredClone(before);
  after.extra!.title += ' Freigegeben';
  const next = structuredClone(after);
  next.extra!.outcome += ' Geändert';
  const journal = {
    version: 1,
    articleId: id,
    baseline,
    changes: [
      {
        revision: 1,
        date: '2026-10-02',
        note: centerFinalNote,
        before,
        after,
        confirmation: {
          confirmedBy: 'Testperson',
          kind: 'center-final',
          fields: ['Titel', 'Titel'],
        },
      },
      { revision: 2, date: '2026-10-02', note: 'Nur Ergebnis', before: after, after: next },
    ],
  };
  const original = structuredClone(journal);
  const result = applyJournal(baseline, journal);
  expect(result.userConfirmations).toEqual([
    {
      revision: 1,
      date: '2026-10-02',
      confirmedBy: 'Testperson',
      kind: 'center-final',
      fields: ['Titel'],
    },
  ]);
  expect(journal).toEqual(original);
  // Old outcome approvals also included a phantom title. Do not grant that scope.
  const confirmedOutcome = structuredClone(journal);
  confirmedOutcome.changes[1].note = centerFinalNote;
  confirmedOutcome.changes[1].confirmation = {
    confirmedBy: 'Andere Testperson',
    kind: 'center-final',
    fields: ['Ergebnis', 'Titel'],
  };
  expect(applyJournal(baseline, confirmedOutcome).userConfirmations).toEqual([
    ...result.userConfirmations!,
    {
      revision: 2,
      date: '2026-10-02',
      confirmedBy: 'Andere Testperson',
      kind: 'center-final',
      fields: ['Ergebnis'],
    },
  ]);
});

test('every registered object and article field round-trips with protected structure and precise approvals', async () => {
  // Exhaustive in-memory replay uses the same server-side validator, no repository writes.
  for (const [id, object] of editorialObjects) {
    const baseline = object.baseline;
    const after = textOf(baseline);
    if (object.fields)
      Object.keys(after.extra!).forEach((key) => {
        after.extra![key] += ' Test';
      });
    else {
      after.title += ' Test';
      after.summary += ' Test';
      after.takeaway += ' Test';
      after.sections.forEach((section) => {
        section.title += ' Test';
        section.body += ' Test';
        section.steps = section.steps?.map((value) => value + ' Test');
        if (!section.steps) delete section.steps;
      });
      after.limitations = after.limitations?.map((value) => value + ' Test');
      after.procedures?.forEach((p) => {
        p.title += ' Test';
        p.trigger += ' Test';
        p.prerequisites = p.prerequisites.map((value) => value + ' Test');
        p.expectedResults = p.expectedResults.map((value) => value + ' Test');
        p.checkQuestions = p.checkQuestions.map((value) => value + ' Test');
        if (p.requiredRights) p.requiredRights = p.requiredRights.map((value) => value + ' Test');
        p.actions.forEach((action) => {
          action.text += ' Test';
          if (!action.toolSelection) action.tool += ' Test';
        });
      });
    }
    const before = textOf(baseline);
    const entry = {
      revision: baseline.revisions!.at(-1)!.number + 1,
      date: '2026-10-01',
      note: centerFinalNote,
      before,
      after,
      confirmation: {
        confirmedBy: 'Testperson',
        kind: 'center-final',
        fields: changedFields(before, after),
      },
    };
    const result = applyJournal(baseline, {
      version: 1,
      articleId: id,
      baseline,
      changes: [entry],
    });
    expect(textOf(result)).toEqual(after);
    expect(result.knowledge!.evidence).toEqual(baseline.knowledge!.evidence);
    expect(result.reviews).toEqual(baseline.reviews);
    expect(result.related).toEqual(baseline.related);
    const next = structuredClone(after);
    if (next.extra) next.extra[Object.keys(next.extra)[0]] += ' Später';
    else next.summary += ' Später';
    const changed = changedFields(after, next);
    const later = applyJournal(baseline, {
      version: 1,
      articleId: id,
      baseline,
      changes: [
        entry,
        {
          revision: entry.revision + 1,
          date: entry.date,
          note: 'Folgeänderung',
          before: after,
          after: next,
        },
      ],
    });
    if (later.status !== 'demo')
      expect(later.userConfirmations?.flatMap((value) => value.fields) ?? []).toEqual(
        entry.confirmation.fields.filter((field) => !changed.includes(field)),
      );
  }
});

test('built editor saves every content type, migrates history and rejects writes outside its registry', async () => {
  test.setTimeout(180_000);
  const legacyBaseline = editorialObjects.get(empty.articleId)!.baseline;
  const before = textOf(legacyBaseline),
    after = { ...before, title: before.title + ' Althistorie' };
  const legacy = {
    ...empty,
    baseline: legacyBaseline,
    changes: [
      {
        revision: legacyBaseline.revisions!.at(-1)!.number + 1,
        date: '2026-10-01',
        note: 'Bestehende Althistorie',
        before,
        after,
      },
    ],
  };
  await writeFile(join(root, 'src/data/local-editorial.json'), JSON.stringify(legacy));
  const representatives = new Map<string, string>();
  for (const [id] of editorialObjects)
    representatives.set(
      id.includes(':')
        ? id.split(':')[0]
        : id.startsWith('guide-') || id.startsWith('faq-') || id === 'ippm-release-2-scope'
          ? 'article'
          : id,
      id,
    );
  representatives.set('multiple-procedures', 'guide-deliverables-milestones');
  representatives.set('no-procedure', 'ippm-release-2-scope');
  for (const id of representatives.values()) {
    const state = await get(id),
      after = textOf(state.article);
    if (after.extra) after.extra[Object.keys(after.extra)[0]] += ' Gebauter Test';
    else after.summary += ' Gebauter Test';
    const saved = await put(id, {
      version: state.version,
      after,
      note: '',
      confirmation: { confirmedBy: 'Testperson', kind: 'center-final' },
    });
    expect(await saved.text()).toContain('revision');
    expect(saved.status).toBe(200);
    expect(textOf((await get(id)).article)).toEqual(after);
    expect((await put(id, { version: state.version, after, note: 'Veraltet' })).status).toBe(409);
  }
  const file = JSON.parse(await readFile(join(root, 'src/data/local-editorial.json'), 'utf8'));
  expect(file.version).toBe(2);
  expect(file.journals['guide-r1-reporting']).toEqual(legacy);
  const id = 'guide-deliverables-milestones',
    state = await get(id);
  const invalid = textOf(state.article);
  invalid.procedures![0].id = 'foreign-id';
  expect((await put(id, { version: state.version, after: invalid, note: 'Ungültig' })).status).toBe(
    400,
  );
  expect(
    (await put('sources:TTT', { version: state.version, after: {}, note: 'Ungültig' })).status,
  ).toBe(404);
  const generic = representatives.get('issues')!,
    genericState = await get(generic),
    bad = textOf(genericState.article);
  bad.extra!['evidence / sourceId'] = 'Manipulation';
  expect(
    (await put(generic, { version: genericState.version, after: bad, note: 'Ungültig' })).status,
  ).toBe(400);
});

test('special layouts, multiple procedures, trainer fields and keyboard save dialog work in built assets', async ({
  page,
}, info) => {
  await page.goto(url + '/#/artikel/guide-deliverables-milestones');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  const pencil = page.locator('#procedure-payment-milestones > .inline-edit-target button');
  await pencil.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByLabel('Bedienweg 4: Auslöser', { exact: true })).toBeFocused();
  await page
    .getByLabel('Bedienweg 4: Auslöser', { exact: true })
    .fill('Isolierter Auslöser für den vierten Bedienweg.');
  await expect(page.getByLabel('Bedienweg 1: Titel', { exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Änderung prüfen und speichern', exact: true }).click();
  await page.getByRole('radio', { name: 'Für das Center final freigeben', exact: true }).check();
  await expect(page.getByLabel('Änderungsgrund')).toHaveCount(0);
  await page.getByLabel('Freigegeben von (für das Center)').fill('Testperson');
  expect(
    (await new AxeBuilder({ page }).include('.local-editor-dialog').analyze()).violations,
  ).toEqual([]);
  await page.screenshot({ path: info.outputPath('built-dialog.png'), fullPage: false });
  await page.getByRole('button', { name: 'Im Repository speichern', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('dauerhaft');
  await page.reload();
  await expect(page.locator('#procedure-payment-milestones')).toContainText('Isolierter Auslöser');
  await page.goto(url + '/#/artikel/guide-project-permissions');
  await page
    .locator('summary')
    .filter({ hasText: /^Use Case und Schulung$/ })
    .click();
  const trainer = page.getByRole('button', {
    name: 'Trainerhinweise bearbeiten',
    exact: true,
  });
  await trainer.click();
  await expect(page.getByLabel('Lernziel', { exact: true })).toBeFocused();
  await expect(page.getByLabel('Bedienweg 1: Titel', { exact: true })).toHaveCount(0);
  await page.getByLabel('Lernziel', { exact: true }).fill('Gemeinsames isoliertes Trainerziel.');
  await page.getByRole('button', { name: 'Änderung prüfen und speichern', exact: true }).click();
  await page.getByLabel('Änderungsgrund').fill('Test');
  await page.getByRole('button', { name: 'Im Repository speichern', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('dauerhaft');
  await page.goto(url + '/#/artikel/faq-role-vs-access');
  await expect(page.locator('#trainerhinweise')).toContainText(
    'Gemeinsames isoliertes Trainerziel.',
  );
  await page.getByRole('button', { name: 'Abschnitt 1 bearbeiten', exact: true }).click();
  await page
    .getByLabel('Abschnitt 1: Titel', { exact: true })
    .fill('Gespeicherter Abschnittstitel');
  await page.getByLabel('Änderungsgrund').fill('Stabile Bereichsidentität');
  await page.getByRole('button', { name: 'Änderung prüfen und speichern', exact: true }).click();
  await page.getByRole('button', { name: 'Im Repository speichern', exact: true }).click();
  await expect(
    page
      .locator('#abschnitt-0 .local-editor')
      .getByRole('button', { name: 'Gespeicherten Beitrag neu laden', exact: true }),
  ).toBeEnabled();
  await expect(page.locator('#abschnitt-0 h3').first()).toHaveText('Gespeicherter Abschnittstitel');
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  ).toBeTruthy();
});

test('built editor restarts with current repository data and a fresh reader build preserves changes', async ({
  page,
}) => {
  test.setTimeout(90_000);
  const id = 'ippm-release-2-scope',
    state = await get(id),
    after = textOf(state.article);
  after.title = 'Persistenter isolierter Release-Test';
  expect((await put(id, { version: state.version, after, note: 'Neustart-Test' })).status).toBe(
    200,
  );
  const history = migrateJournal(
    JSON.parse(await readFile(join(root, 'src/data/local-editorial.json'), 'utf8')),
  );
  const previousToken = token;
  await stop();
  await start();
  expect(
    (
      await fetch(`${url}/__local-editor/articles/${id}`, {
        headers: { 'X-Local-Editor-Token': previousToken },
      })
    ).status,
  ).toBe(403);
  for (const path of ['/server.js', '/Server.js', '/src/data/content.ts', '/@vite/client'])
    expect((await fetch(url + path)).status).toBe(404);
  await page.goto(url + '/#/artikel/' + id);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(after.title);
  expect(
    migrateJournal(JSON.parse(await readFile(join(root, 'src/data/local-editorial.json'), 'utf8'))),
  ).toEqual(history);
  await build({
    root,
    configFile: false,
    plugins: [react()],
    define: { __LOCAL_EDITOR__: 'false' },
    logLevel: 'silent',
  });
  const reader = await preview({
    root,
    configFile: false,
    preview: { host: '127.0.0.1', port: 0 },
  });
  try {
    const readerUrl = `http://127.0.0.1:${(reader.httpServer.address() as { port: number }).port}`;
    await page.goto(readerUrl + '/#/artikel/' + id);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(after.title);
    await expect(page.locator('.inline-edit-button')).toHaveCount(0);
  } finally {
    await new Promise<void>((done) => reader.httpServer.close(() => done()));
  }
});

test('all visible article layouts expose their own fields and optional procedures safely', async ({
  page,
}) => {
  test.setTimeout(120_000);
  for (const [id, object] of editorialObjects) {
    if (object.fields) continue;
    await page.goto(url + '/#/artikel/' + id);
    const pencil = page.getByRole('button', { name: 'Titel bearbeiten', exact: true });
    await pencil.click();
    await expect(page.getByLabel('Titel', { exact: true })).toHaveValue(object.baseline.title);
    await expect(page.getByLabel('Zusammenfassung', { exact: true })).toHaveCount(0);
    await page
      .getByRole('button', { name: 'Bearbeitung abbrechen und Entwurf verwerfen', exact: true })
      .click();
    if (!object.baseline.knowledge!.procedures.length)
      await expect(
        page.getByRole('button', { name: 'Bedienweg bearbeiten', exact: true }),
      ).toHaveCount(0);
    const sections = object.baseline.sections;
    if (sections.length) {
      // Supplemental sections can intentionally start collapsed.
      await page.locator('details').evaluateAll((elements) =>
        elements.forEach((element) => {
          element.open = true;
        }),
      );
      await page
        .getByRole('button', { name: `Abschnitt ${sections.length} bearbeiten`, exact: true })
        .click();
      await expect(
        page.getByLabel(`Abschnitt ${sections.length}: Text`, { exact: true }),
      ).toHaveValue(sections.at(-1)!.body);
    }
  }
});

test('process projection edits its article origin and source text changes load without rebuilding assets', async ({
  page,
}) => {
  await page.goto(url + '/#/prozesse');
  const region = page.getByRole('region', {
    name: 'SB1: ' + editorialObjects.get('guide-status-orientation')!.baseline.title,
    exact: true,
  });
  // The title comes from the article, so the editor must not create a second process copy.
  await region
    .getByRole('button', { name: 'Prozesstitel am Ursprungsbeitrag bearbeiten', exact: true })
    .click();
  await page.getByLabel('Titel', { exact: true }).fill('Gemeinsamer Prozesstitel im Test');
  await page.getByRole('button', { name: 'Änderung prüfen und speichern', exact: true }).click();
  await page.getByLabel('Änderungsgrund').fill('Projektionsprüfung');
  await page.getByRole('button', { name: 'Im Repository speichern', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: 'dauerhaft' })).toBeVisible();
  await page.goto(url + '/#/artikel/guide-status-orientation');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Gemeinsamer Prozesstitel im Test',
  );
  const source = join(root, 'src/data/content.ts'),
    original = await readFile(source, 'utf8');
  try {
    await writeFile(
      source,
      original.replace(
        'Wie speichere ich Lesemarkierungen und Merkliste?',
        'Geänderte Hilfe aus aktueller Repository-Datei?',
      ),
    );
    await page.goto(url + '/#/hilfe');
    await page.reload();
    await expect(
      page
        .locator('summary')
        .filter({ hasText: 'Geänderte Hilfe aus aktueller Repository-Datei?' }),
    ).toBeVisible();
  } finally {
    await writeFile(source, original);
  }
});
