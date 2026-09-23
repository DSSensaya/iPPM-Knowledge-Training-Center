import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { articles } from '../src/data/content';
import { issues, processSteps, processViews } from '../src/data/catalog';
import { sb1AdditionalHandbookTopics, sb1Coverage } from '../src/data/sb1-coverage';
import { definitionRows } from '../src/data/definition-catalog';
import { controlRows } from '../src/data/control-content';
import { sources } from '../src/data/sources';

// Originaltitel und Zeilen aus Quelle T, Blatt Release1-Matrix, Spalten A/B/K.
const matrixRows = [
  ['1.1', 'Projekt beantragen', 3],
  ['1.2', 'Projekt anlegen', 4],
  ['2.1', 'Projektstammdaten anlegen', 5],
  ['2.2', 'Projektumfang festlegen', 6],
  ['2.3', 'Projektziele festlegen', 7],
  ['2.4', 'Projektorganisation festlegen', 8],
  ['2.5', 'Vertragsdaten einpflegen', 9],
  ['2.6', 'Teilprojektleiter einsetzen', 10],
  ['2.7', 'Zugriffsrechte festlegen', 11],
  ['2.8', 'Stammdaten für System-TP anlegen', 12],
  ['2.9', 'Projektumfang für System-TP festlegen', 13],
  ['2.10', 'Projektorganisation für System-TP festlegen', 14],
  ['2.11', 'Zugriffsrechte für System-TP festlegen', 15],
  ['2.12', 'Stammdaten für ILS-TP anlegen', 16],
  ['2.13', 'Projektumfang für ILS-TP festlegen', 17],
  ['2.14', 'Projektorganisation für ILS-TP festlegen', 18],
  ['2.15', 'Zugriffsrechte für ILS-TP festlegen', 19],
  ['3.1', 'Liefermeilensteine planen', 20],
  ['3.2', 'Zahlungsmeilensteine planen', 21],
  ['3.3', 'Weitere Projektmeilensteine planen', 22],
  ['3.4', 'Projektphasen und LCM Review-Termine planen', 23],
  ['4.9', 'Eskalation an Multi-Projektmanagement durchführen', 49],
  ['4.12', 'Projektstatus ermitteln', 52],
  ['4.13', 'Projektreporting durchführen', 53],
] as const;

const linkedSteps = new Map<string, string[]>([
  ...controlRows.map((row) => [row.number, [`guide-${row.id}`]] as [string, string[]]),
  ...definitionRows.map((row) => [row.number, [row.article]] as [string, string[]]),
  ['2.2', ['guide-deliverables-milestones', 'faq-milestone-dates', 'guide-save-publish-checkin']],
  ['2.5', ['guide-deliverables-milestones', 'faq-milestone-dates', 'guide-save-publish-checkin']],
  ['2.6', ['guide-project-permissions', 'faq-role-vs-access', 'guide-save-publish-checkin']],
  ['2.7', ['guide-project-permissions', 'faq-role-vs-access']],
  ['2.11', ['guide-project-permissions', 'faq-role-vs-access']],
  ['2.15', ['guide-project-permissions', 'faq-role-vs-access']],
  ['3.1', ['guide-deliverables-milestones', 'faq-milestone-dates', 'guide-save-publish-checkin']],
  ['3.2', ['guide-deliverables-milestones', 'faq-milestone-dates', 'guide-save-publish-checkin']],
]);

test('SB1 list preserves exactly 24 source T numbers, original titles and row locations', () => {
  expect(sb1Coverage).toHaveLength(24);
  expect(new Set(sb1Coverage.map((item) => item.number)).size).toBe(24);
  expect(
    sb1Coverage.map((item) => [item.number, item.originalTitle, item.matrixEvidence.locator]),
  ).toEqual(
    matrixRows.map(([number, title, row]) => [number, title, `Release1-Matrix!A${row}:Q${row}`]),
  );
  for (const item of sb1Coverage) {
    expect(item.matrixEvidence.sourceId).toBe('T');
    expect(item.matrixEvidence.sourceKey).toBe(item.number);
    expect(item.gap.trim()).not.toBe('');
    expect(item.treatedScope.trim()).not.toBe('');
  }
  expect(sb1AdditionalHandbookTopics.map((topic) => topic.title)).toEqual([
    'Reviewstatus pflegen',
    'Projektfortschritt pflegen',
  ]);
});

test('all 24 matrix steps have material with 20 partial procedures and four orientations', () => {
  const linked = sb1Coverage.filter((item) => item.realMaterials.length);
  const unlinked = sb1Coverage.filter((item) => !item.realMaterials.length);
  expect(linked.map((item) => item.number).sort()).toEqual([...linkedSteps.keys()].sort());
  expect(linked).toHaveLength(24);
  expect(unlinked).toHaveLength(0);
  expect(processSteps).toHaveLength(24);
  for (const item of linked) {
    expect(item.materialStatus).toBe(
      ['1.1', '1.2', '4.12', '4.13'].includes(item.number)
        ? 'Orientierung vorhanden · kein Gesamtbedienweg'
        : 'Reales Teilmaterial vorhanden',
    );
    expect(item.realMaterials).toEqual(
      linkedSteps.get(item.number)?.map((articleId) => ({
        articleId,
        processStepId: `step-${item.number.replace('.', '-')}`,
      })),
    );
  }
  for (const item of unlinked) {
    expect(item.materialStatus).toBe('Nur Quellenhinweis');
    expect(item.realMaterials).toEqual([]);
    expect(item.treatedScope).toMatch(/Kein real|Kein realer/);
  }
});

test('1.1 remains open while the dated LCM decision closes 3.4 frequency with earlier evidence preserved', () => {
  const request = sb1Coverage.find((item) => item.number === '1.1')!;
  expect(request.gap).toContain('Quellenkonflikt');
  expect(request.gap).toContain('T ordnet 1.1 SB1 zu');
  expect(request.gap).toContain('F (FS-02) sieht den Antrag nicht im aktuellen Schulungsumfang');
  expect(request.supplementaryEvidence).toContainEqual({
    sourceId: 'F',
    locator: 'R1 Funktionsmatrix!A6:J6',
    sourceKey: 'FS-02',
    derivation: 'direct',
  });

  const reviews = sb1Coverage.find((item) => item.number === '3.4')!;
  expect(reviews.gap).toContain('LCM-3 einmal pro Kalenderjahr');
  expect(reviews.gap).toContain('R1-OPEN-06');
  expect(reviews.issueIds).not.toContain('issue-f-r1-open-06');
  expect(issues.find((issue) => issue.id === 'issue-f-r1-open-06')?.status).toBe('GEKLÄRT');
  expect(reviews.supplementaryEvidence).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        sourceId: 'T',
        locator: 'Release1-Matrix!M23:Q23',
      }),
      expect.objectContaining({
        sourceId: 'F',
        locator: 'Klärungsbedarf!A10:D10',
        sourceKey: 'R1-OPEN-06',
      }),
      expect.objectContaining({
        sourceId: 'B',
        locator: '§4.5.5 Projektphasen und LCM-Review-Termine planen',
      }),
    ]),
  );
  expect(request.realMaterials.map((material) => material.articleId)).toEqual([
    'guide-project-handover',
  ]);
  expect(reviews.realMaterials).toEqual([
    { articleId: 'guide-phases-tailoring', processStepId: 'step-3-4' },
  ]);
});

test('all coverage references exist and no demo article is counted as real material', () => {
  const byId = <T extends { id: string }>(items: T[], id: string) =>
    items.find((item) => item.id === id);
  for (const item of sb1Coverage) {
    for (const material of item.realMaterials) {
      const article = byId(articles, material.articleId);
      const step = byId(processSteps, material.processStepId);
      expect(article, material.articleId).toBeDefined();
      expect(article?.status).not.toBe('demo');
      expect(article?.knowledge?.stepIds).toContain(step?.id);
      expect(step?.number).toBe(item.number);
      expect(step?.title).toBe(item.originalTitle);
      if (material.articleId === linkedSteps.get(item.number)?.[0])
        expect(
          processViews.some(
            (view) => view.articleId === article?.id && view.stepIds.includes(step!.id),
          ),
        ).toBeTruthy();
    }
    for (const id of item.issueIds) expect(byId(issues, id), id).toBeDefined();
    for (const ref of [item.matrixEvidence, ...item.supplementaryEvidence]) {
      expect(byId(sources, ref.sourceId), ref.sourceId).toBeDefined();
      expect(ref.locator.trim()).not.toBe('');
    }
    expect(item.supplementaryEvidence.length).toBeGreaterThan(0);
  }
  for (const topic of sb1AdditionalHandbookTopics) {
    for (const ref of topic.evidence) expect(byId(sources, ref.sourceId)).toBeDefined();
  }
});

test('SB1 list is keyboard readable and responsive while existing process views remain reachable', async ({
  page,
}) => {
  await page.goto('/#/prozesse');
  const coverage = page.getByRole('region', { name: 'SB1-Schulungsmatrix: 24 Schritte' });
  await expect(coverage.locator('[data-matrix-number]')).toHaveCount(24);
  await expect(page.getByRole('region', { name: 'SB1: Team und Zugriff' })).toBeVisible();
  await expect(
    page.getByRole('region', { name: 'SB1: Liefergegenstände und Meilensteine' }),
  ).toBeVisible();
  await expect(coverage).toContainText('weder geschult noch praktisch geprüft oder freigegeben');
  await expect(coverage).toContainText('20 Schritte mit realem Teilmaterial');
  await expect(coverage).toContainText('4 Schritte mit Orientierung ohne Gesamtbedienweg');
  await expect(
    page.getByRole('region', { name: 'SB1: Projektstatus ermitteln' }).getByRole('link'),
  ).toHaveText('Orientierung, Quellen und Einschränkungen zu 4.12 öffnen');
  const linked = coverage.locator('[data-matrix-number="2.6"]');
  const summary = linked.locator('summary');
  await summary.focus();
  await expect(summary).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(linked.locator('details')).toHaveAttribute('open', '');
  await expect(linked).toContainText('issue-f-r1-open-07');
  await expect(
    linked.getByRole('link', { name: 'Zugriffsrechte festlegen und Owner wechseln' }),
  ).toHaveAttribute('href', '#/artikel/guide-project-permissions');
  await expect(linked.getByRole('link')).toHaveCount(3);
  const missing = coverage.locator('[data-matrix-number="4.12"]');
  await missing.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(missing).toContainText('Orientierung vorhanden · kein Gesamtbedienweg');
  await expect(missing).toContainText('FIN-/SAP-Feldkorrektur ist erledigt');
  await expect(missing.getByRole('link')).toHaveCount(1);
  for (const [number, text] of [
    ['1.1', 'Quellenkonflikt'],
    ['3.4', 'LCM-3 einmal pro Kalenderjahr'],
  ]) {
    const item = coverage.locator(`[data-matrix-number="${number}"]`);
    await item.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(item).toContainText(text);
  }
  await expect(
    page.getByRole('region', { name: 'Weitere Handbuchthemen außerhalb der 24er-Zählung' }),
  ).toContainText('Reviewstatus pflegen');
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
  ).toBeTruthy();
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
      .violations,
  ).toEqual([]);
  await linked.getByRole('link', { name: 'Zugriffsrechte festlegen und Owner wechseln' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Zugriffsrechte festlegen und Owner wechseln',
  );
});
