import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { inventory } from '../src/data/inventory';
import { inventorySource } from '../src/data/inventory-source';
import { visibleArticles } from '../src/data/content';
import { functions, processCatalog, processSteps, scopeItems } from '../src/data/catalog';
import { contentReadiness } from '../src/data/content-readiness';
import { searchInventory } from '../src/lib/inventory-search';

test('catalog reconciles the complete source ID ranges and preserves existing IDs', () => {
  // Independent expected ranges from T rows 3–53, P phase 5, S rows 2–32 and F.
  const steps = [2, 15, 21, 13, 1].flatMap((count, phase) =>
    Array.from({ length: count }, (_, i) => `step-${phase + 1}-${i + 1}`),
  );
  const scope = [25, 6].flatMap((count, stage) =>
    Array.from(
      { length: count },
      (_, i) => `${stage ? 'R1B' : 'R1'}-${String(i + 1).padStart(2, '0')}`,
    ),
  );
  const fs = Array.from({ length: 29 }, (_, i) => `FS-${String(i + 1).padStart(2, '0')}`).flatMap(
    (id) => (id === 'FS-03' ? ['FS-03a', 'FS-03b'] : [id]),
  );
  const r1b = Array.from({ length: 6 }, (_, i) => `R1B-FS-${String(i + 1).padStart(2, '0')}`);
  const caps = Array.from({ length: 8 }, (_, i) => `CAP-${String(i + 1).padStart(2, '0')}`);
  expect(inventorySource.map((e) => e.id).sort()).toEqual(
    [...steps, ...scope, ...fs, ...r1b, ...caps].sort(),
  );
  expect(new Set(inventory.map((e) => e.id)).size).toBe(inventory.length);
  for (const item of [
    ...functions,
    ...processCatalog,
    ...processSteps,
    ...scopeItems,
    ...visibleArticles.flatMap((a) => a.knowledge?.procedures ?? []),
  ])
    expect(
      inventory.some((e) => e.id === item.id),
      item.id,
    ).toBeTruthy();
  for (const entry of inventory) {
    expect(
      searchInventory(entry.id).some((e) => e.id === entry.id),
      entry.id,
    ).toBeTruthy();
    for (const id of entry.relatedIds)
      expect(
        inventory.some((e) => e.id === id),
        `${entry.id} → ${id}`,
      ).toBeTruthy();
    for (const id of entry.articleIds)
      expect(
        visibleArticles.some((a) => a.id === id),
        `${entry.id} → ${id}`,
      ).toBeTruthy();
    expect(entry.evidence.length).toBeGreaterThan(0);
    expect(entry.note.length).toBeGreaterThan(20);
    if (entry.state === 'Nutzbar') expect(entry.articleIds.length).toBeGreaterThan(0);
  }
  expect(Object.keys(contentReadiness).sort()).toEqual(visibleArticles.map((a) => a.id).sort());
  expect(visibleArticles.every((a) => a.status === 'source-draft')).toBeTruthy();
});

test('missing evidence and source conflicts cannot inherit an operational status', () => {
  for (const id of ['step-5-1', 'step-3-12', 'FS-19', 'FS-29', 'R1B-01', 'R1B-FS-02'])
    expect(inventory.find((e) => e.id === id)?.state).toBe('Platzhalter');
  expect(inventory.find((e) => e.id === 'step-4-12')?.state).toBe('Teilweise belegt');
  expect(inventory.find((e) => e.id === 'step-2-6')?.state).toBe('Nutzbar');
  expect(inventory.find((e) => e.id === 'FS-19')?.note).toContain('bestätigt');
  expect(inventory.find((e) => e.id === 'FS-27')?.relatedIds).toEqual([]); // cross-cutting prerequisite, not whole scope coverage
  expect(searchInventory('QG-01-04').some((e) => e.id === 'step-2-2')).toBeTruthy();
});

test('all catalog entries are navigable and linked material exists', async ({ page }) => {
  await page.goto('/#/prozesse');
  await page.getByText('Katalog durchsuchen (Aufgabe oder ID)', { exact: true }).click();
  const entries = page.locator('[data-inventory-id]');
  await expect(entries.first().locator('summary > span').first()).toHaveCSS('transform', 'none');
  expect(
    await entries.evaluateAll((nodes) => nodes.map((n) => n.getAttribute('data-inventory-id'))),
  ).toEqual(inventory.map((e) => e.id));
  for (const id of [
    'step-2-6',
    'step-4-12',
    'step-5-1',
    'R1B-FS-02',
    'FS-19',
    'procedure-save-project-plan',
  ]) {
    await page.getByLabel('Aufgabe oder Katalog-ID').fill(id);
    const entry = page.locator(`[data-inventory-id="${id}"]`);
    await expect(entry.locator('details').first()).toHaveAttribute('open', '');
    await expect(entry).toContainText(`Inhaltsstand: ${inventory.find((e) => e.id === id)!.state}`);
  }
  await page.getByLabel('Aufgabe oder Katalog-ID').fill('step-5-1');
  await expect(
    page.getByText('Projektabschluss ist genannt, aber noch zu spezifizieren.', { exact: false }),
  ).toBeVisible();
  await page.getByRole('combobox', { name: 'Inhaltsstand', exact: true }).selectOption('Nutzbar');
  await expect(page.getByText('Kein passender Eintrag.', { exact: false })).toBeVisible();
});

test('search leads to placeholders and back to bounded material with keyboard and responsive layout', async ({
  page,
}, testInfo) => {
  await page.goto('/#/wissen?q=R1B-06');
  await page.getByRole('link', { name: /Prozesse und Use Cases:/ }).click();
  const entry = page.locator('[data-inventory-id="R1B-06"]');
  await expect(entry).toContainText('Platzhalter');
  await expect(entry.locator('summary > span').first()).toHaveCSS('transform', 'none');
  expect(
    (await page.getByLabel('Aufgabe oder Katalog-ID').boundingBox())!.height,
  ).toBeGreaterThanOrEqual(44);
  await expect(entry.getByText('Quellen und Zuordnung', { exact: true })).toBeVisible();
  const details = entry.getByText('Quellen und Zuordnung', { exact: true });
  await details.focus();
  await page.keyboard.press('Enter');
  await expect(entry.locator('.source-ref')).toBeVisible();
  await expect(details).toBeFocused();
  await expect(page.locator('body')).not.toHaveJSProperty('scrollWidth', 0);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  ).toBeTruthy();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.screenshot({ path: testInfo.outputPath('catalog.png'), fullPage: false });
  await page.goto('/#/prozesse?q=step-2-6');
  await page
    .locator('[data-inventory-id="step-2-6"]')
    .getByRole('link', { name: /Owner/ })
    .first()
    .click();
  await expect(page.locator('.content-readiness').first()).toContainText('Inhaltsstand: Nutzbar');
  await expect(
    page.getByText('Quellenbasierter Entwurf · Fachlich nicht freigegeben', { exact: true }),
  ).toBeVisible();
  await page.goto('/#/artikel/guide-status-orientation');
  const status = page.locator('.article-content > .content-readiness');
  await expect(status).toContainText('Pflegezyklus');
  expect(
    await status.evaluate(
      (el) =>
        !!(
          el.compareDocumentPosition(document.getElementById('procedure-status-orientation')!) &
          Node.DOCUMENT_POSITION_FOLLOWING
        ),
    ),
  ).toBeTruthy();
  await page.screenshot({ path: testInfo.outputPath('status.png'), fullPage: false });
});
