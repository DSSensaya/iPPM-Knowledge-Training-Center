import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('SB1 delivery and payment path is searchable, source-aware and usable on desktop and mobile', async ({
  page,
}) => {
  const errors: string[] = [];
  const external: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('request', (request) => {
    if (!request.url().startsWith('http://127.0.0.1:4173')) external.push(request.url());
  });
  await page.goto('/');
  await expect(
    page.getByRole('link', {
      name: 'Liefergegenstände in Liefer- und Zahlungsmeilensteine überführen',
      exact: true,
    }),
  ).toBeVisible();
  await page.goto('/#/wissen');
  await page.getByLabel('Wissensbasis durchsuchen').fill('Ext.Pay');
  await page.getByLabel('Wissensbasis durchsuchen').press('Enter');
  await expect(
    page.getByRole('link', {
      name: 'Liefergegenstände in Liefer- und Zahlungsmeilensteine überführen',
      exact: true,
    }),
  ).toBeVisible();
  await page.getByRole('combobox', { name: 'Ihre Rolle', exact: true }).selectOption('pm');
  await page
    .getByRole('heading', {
      name: 'Liefergegenstände in Liefer- und Zahlungsmeilensteine überführen',
    })
    .getByRole('link')
    .click();
  await expect(page.locator('.demo-note')).toContainText('Quellenbasierter Entwurf');
  await expect(page.locator('#fachlicher-kontext')).toContainText('2.2 Projektumfang festlegen');
  await expect(page.locator('#fachlicher-kontext')).toContainText(
    '3.2 Zahlungsmeilensteine planen',
  );
  await expect(page.locator('#fachlicher-kontext')).toContainText(
    'Wenn: Zahlung wird durch eine Lieferung ausgelöst',
  );
  await expect(page.locator('#einschraenkungen')).toContainText(
    'Eine automatische Synchronisierung',
  );
  await expect(page.locator('#einschraenkungen')).toContainText(
    'Führende Quelle, Zuordnung und Pflegeverantwortung',
  );
  await expect(page.locator('#procedure-delivery-milestones')).toContainText('Ext.Del');
  await expect(page.locator('#procedure-delivery-milestones')).toContainText(
    'Anfang nicht früher als',
  );
  await expect(page.locator('#procedure-payment-milestones')).toContainText(
    'keine künstliche Vorgänger-Verknüpfung',
  );
  await expect(page.locator('#procedure-payment-milestones')).toContainText('Ext.Pay');
  await page.getByText('Technischer Nachweis, TTT und Beschreibungsstand', { exact: true }).click();
  await expect(page.locator('#nachweise')).toContainText('teilweise verifiziert');
  await expect(page.locator('#nachweise')).toContainText('Im Handbuchentwurf konkret beschrieben');
  await page.locator('summary').filter({ hasText: 'B · SB1-Handbuch' }).click();
  await expect(page.locator('#quellen')).toContainText('§4.5.3');
  await expect(page.locator('#quellen')).toContainText('SHA-256');
  await page.getByRole('button', { name: 'Beitrag merken', exact: true }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Aus Merkliste entfernen' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
  ).toBeTruthy();
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
      .violations,
  ).toEqual([]);
  await page.getByRole('link', { name: 'Prozessschritte und Zuständigkeiten ansehen' }).click();
  const slice = page.getByRole('region', { name: 'SB1: Liefergegenstände und Meilensteine' });
  await expect(slice.getByRole('heading')).toHaveCount(5);
  await slice
    .getByRole('link', { name: 'Bedienweg, Quellen und Einschränkungen zu 3.2 öffnen' })
    .click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Liefergegenstände in Liefer- und Zahlungsmeilensteine überführen',
  );
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});
