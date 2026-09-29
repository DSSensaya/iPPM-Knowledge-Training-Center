import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { controlArticles } from '../src/data/control-content';
import { learningPaths } from '../src/data/content';
import { sb1Coverage } from '../src/data/sb1-coverage';
import { knowledgeFor } from '../src/lib/knowledge';
import { searchArticles } from '../src/lib/search';

test('planning and control preserve evidence boundaries and demo separation', () => {
  expect(controlArticles).toHaveLength(5);
  expect(controlArticles.map((a) => a.knowledge!.procedures.length)).toEqual([1, 1, 1, 1, 0]);
  for (const a of controlArticles) {
    expect(a.status).toBe('source-draft');
    expect(a.reviews).toEqual([]);
    expect(learningPaths.flatMap((p) => p.lessons)).not.toContain(a.id);
    expect(knowledgeFor(a).issues.map((i) => i.id)).toContain('issue-f-r1-open-12');
  }
  const tailoring = controlArticles[1];
  expect(knowledgeFor(tailoring).issues.map((i) => i.id)).not.toContain('issue-f-r1-open-06');
  expect(knowledgeFor(tailoring).assessments.find((a) => a.value === 'verified')?.scope).toContain(
    'Nur FS-16',
  );
  expect(tailoring.knowledge!.procedures[0].actions[0].text).toContain(
    'keinen Review deaktivieren',
  );
  expect(tailoring.knowledge!.procedures[0].actions[2].text).toContain('nicht löschen');
  expect(knowledgeFor(controlArticles[2]).assessments).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        dimension: 'documentation',
        originalValue: 'NOCH NICHT VERBINDLICH DOKUMENTIEREN',
      }),
      expect.objectContaining({
        dimension: 'training',
        originalValue: 'noch nicht schulungsfähig',
      }),
    ]),
  );
  expect(sb1Coverage.find((r) => r.number === '4.12')?.gap).toContain('FIN-/SAP');
  const status = controlArticles.find((article) => article.id === 'guide-status-orientation')!;
  expect(status.status).toBe('source-draft');
  expect(status.revisions.map((revision) => revision.number)).toEqual([1, 2, 3]);
  expect(status.knowledge!.procedures[0].actions).toHaveLength(5);
  expect(status.knowledge!.procedures[0].actions[2].text).toContain('Amber und Red');
  expect(status.knowledge!.procedures[0].actions[1].text).toContain('PMO Status');
  expect(status.knowledge!.procedures[0].evidence).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ sourceId: 'B', locator: '§5.5.4 Projektstatus ermitteln' }),
    ]),
  );
  expect(sb1Coverage.find((r) => r.number === '4.13')?.gap).toContain(
    'ML-Filter und Projektstatusübersicht mit erwarteten Projekten und Daten sind bestätigt',
  );
  for (const [query, id] of [
    ['3.3', 'guide-external-milestones'],
    ['Tailoring', 'guide-phases-tailoring'],
    ['Assigned To', 'guide-escalation-capture'],
    ['FIN', 'guide-status-orientation'],
    ['ML-Filter', 'guide-r1-reporting'],
  ])
    expect(searchArticles(query, 'Alle Themen', 'pm').map((a) => a.id)).toContain(id);
});

test('all new tasks are reachable from coverage with visible limitations and accessible reading', async ({
  page,
  baseURL,
}, info) => {
  const errors: string[] = [],
    external: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== baseURL) external.push(request.url());
  });
  for (const [index, number] of ['3.3', '3.4', '4.9', '4.12', '4.13'].entries()) {
    const a = controlArticles[index];
    await page.goto('/#/prozesse');
    const entry = page.locator(`[data-matrix-number="${number}"]`);
    await entry.locator('summary').focus();
    await page.keyboard.press('Enter');
    await entry.getByRole('link', { name: a.title, exact: true }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(a.title);
    await expect(page.locator('#kurzantwort')).toContainText(a.takeaway);
    const jumps = page.getByRole('navigation', { name: 'Direkt zu den Abschnitten' });
    await jumps.getByRole('button', { name: 'Kritische Einschränkungen' }).focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#einschraenkungen')).toBeFocused();
    await expect(page.locator('#einschraenkungen')).toContainText('keine Abnahme');
    await expect(page.locator('[id^="procedure-"]')).toHaveCount(index < 4 ? 1 : 0);
    if (number === '3.4')
      await expect(page.locator('#einschraenkungen')).toContainText('R1-OPEN-06');
    if (number === '4.9')
      await expect(page.locator('#einschraenkungen')).toContainText('Empfängerzugriff');
    if (number === '4.12') {
      await expect(page.locator('#einschraenkungen')).toContainText('FIN-/SAP');
      await expect(page.locator('#einschraenkungen')).toContainText('Bestands-Sites');
      const path = page.locator('#procedure-status-orientation');
      await expect(path.locator('li')).toHaveCount(5);
      await expect(path).toContainText('Recent Achievements');
      await expect(path).toContainText('PMO Status wird durch das PMO gepflegt');
      await expect(page.locator('#ergebnispruefung')).toContainText('PMO Status bleibt beim PMO');
      await expect(page.locator('#quellen')).toContainText('R1 Funktionsmatrix');
      expect(
        await page.evaluate(() =>
          Boolean(
            document
              .getElementById('bedienweg')!
              .compareDocumentPosition(document.getElementById('einschraenkungen')!) &
            Node.DOCUMENT_POSITION_FOLLOWING,
          ),
        ),
      ).toBeTruthy();
      await page.screenshot({
        path: `test-results/status-${info.project.name}.png`,
        fullPage: true,
      });
    }
    if (number === '4.13')
      await expect(page.locator('#einschraenkungen')).toContainText('R1B-FS-02');
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    ).toBeTruthy();
    expect(
      (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
        .violations,
    ).toEqual([]);
  }
  await page.screenshot({ path: `test-results/control-${info.project.name}.png`, fullPage: true });
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});

test('new source reading preserves v1 backups and completed demo paths', async ({ page }) => {
  await page.goto('/');
  const oldPath = learningPaths[0];
  await page.evaluate(
    ({ id, lessons }) =>
      localStorage.setItem(
        'ippm-learning-v1',
        JSON.stringify({ version: 1, bookmarks: ['statusbericht'], read: lessons, passed: [id] }),
      ),
    { id: oldPath.id, lessons: oldPath.lessons },
  );
  await page.reload();
  await page.goto('/#/artikel/guide-external-milestones');
  await page.getByRole('button', { name: 'Beitrag merken', exact: true }).click();
  await page.getByRole('button', { name: 'Als gelesen markieren', exact: true }).click();
  await page.reload();
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('ippm-learning-v1')!));
  expect(saved).toEqual({
    version: 1,
    bookmarks: ['statusbericht', 'guide-external-milestones'],
    read: [...oldPath.lessons, 'guide-external-milestones'],
    passed: [oldPath.id],
  });
  await page.goto('/#/artikel/statusbericht');
  await expect(page.getByRole('heading', { name: 'Beitrag nicht gefunden' })).toBeVisible();
  await page.goto('/#/mein-bereich');
  await expect(page.locator('.saved-section .article-card')).toHaveCount(1);
  await expect(page.locator('.saved-section')).not.toContainText('Statusbericht');
});
