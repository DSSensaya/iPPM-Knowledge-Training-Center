import { test, expect } from '@playwright/test';
import { articles, learningPaths } from '../src/data/content';

test('all retired article and learning URLs remain inaccessible', async ({ page }) => {
  for (const article of articles.filter((entry) => entry.status === 'demo')) {
    await page.goto(`/#/artikel/${article.id}?stand=demo`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Beitrag nicht gefunden');
    await expect(page.getByRole('button', { name: 'Beitrag merken' })).toHaveCount(0);
  }
  for (const path of learningPaths) {
    await page.goto(`/#/lernpfade/${path.id}`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Diese Seite gibt es nicht');
  }
});

test('v1 round trip preserves hidden, unknown and incomplete legacy progress', async ({ page }) => {
  const original = {
    version: 1,
    bookmarks: ['statusbericht', 'older-article'],
    read: ['ippm-verstehen', 'older-article'],
    passed: ['einstieg', 'older-path'],
  };
  await page.goto('/');
  await page.evaluate(
    (data) => localStorage.setItem('ippm-learning-v1', JSON.stringify(data)),
    original,
  );
  await page.goto('/#/mein-bereich');
  await page.reload();
  await expect(page.locator('.personal-stats strong')).toHaveText(['00', '00']);
  await expect(page.locator('.nav-count')).toHaveCount(0);
  const incoming = {
    version: 1,
    bookmarks: ['risiken', 'future-article', 'guide-project-permissions'],
    read: ['future-article'],
    passed: ['reporting', 'future-path'],
  };
  await page.locator('input[type=file]').setInputFiles({
    name: 'legacy.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(incoming)),
  });
  await expect(page.locator('.saved-section .article-card')).toHaveCount(1);
  await expect(page.locator('.personal-stats strong')).toHaveText(['00', '01']);
  await page.goto('/#/artikel/guide-project-permissions');
  await page.getByRole('button', { name: 'Als gelesen markieren', exact: true }).click();
  await page.getByRole('button', { name: 'Gelesen · Markierung entfernen', exact: true }).click();
  await page.reload();
  await page.goto('/#/mein-bereich');
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Sicherung exportieren' }).click();
  const download = await pending;
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream!) chunks.push(Buffer.from(chunk));
  const exported = JSON.parse(Buffer.concat(chunks).toString());
  expect(exported).toEqual({
    version: 1,
    bookmarks: [...original.bookmarks, ...incoming.bookmarks],
    read: [...original.read, ...incoming.read],
    passed: [...original.passed, ...incoming.passed],
  });
  await page.evaluate(() => localStorage.removeItem('ippm-learning-v1'));
  await page.reload();
  await page.locator('input[type=file]').setInputFiles({
    name: 'round-trip.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(exported)),
  });
  await expect(page.locator('.saved-section .article-card')).toHaveCount(1);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('ippm-learning-v1')!))).toEqual(
    exported,
  );
});
