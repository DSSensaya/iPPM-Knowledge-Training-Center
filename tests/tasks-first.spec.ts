import { test, expect } from '@playwright/test';
import { controlArticles } from '../src/data/control-content';
import { definitionArticles } from '../src/data/definition-content';

const taskArticles = [
  ...controlArticles.map(({ id, title }) => ({ id, title })),
  ...definitionArticles.map(({ id, title }) => ({ id, title })),
  {
    id: 'guide-project-permissions',
    title: 'Zugriffsrechte festlegen und Owner wechseln',
  },
  {
    id: 'guide-deliverables-milestones',
    title: 'Liefergegenstände in Liefer- und Zahlungsmeilensteine überführen',
  },
] as const;

test('home shows source-backed tasks and no demo entry points', async ({ page }) => {
  await page.goto('/');
  const tasks = page.getByRole('region', { name: 'Mit einer Aufgabe beginnen' });
  await expect(tasks.locator('.article-card')).toHaveCount(12);
  await expect(tasks.locator('.article-card h3')).toHaveText(
    taskArticles.map((task) => task.title),
  );
  for (const { id, title } of taskArticles) {
    const card = tasks
      .locator('.article-card')
      .filter({ has: page.getByRole('heading', { name: title }) });
    await expect(card).toContainText('Quellenbasierter Entwurf');
    await expect(card.getByRole('link', { name: title, exact: true })).toHaveAttribute(
      'href',
      `#/artikel/${id}`,
    );
  }
  await expect(page.locator('.demo-learning')).toHaveCount(0);
  await expect(page.getByLabel('Was möchten Sie wissen?')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Wissen nachschlagen' })).toHaveAttribute(
    'href',
    '#/wissen',
  );
  await expect(page.getByRole('link', { name: 'Zusammenhänge verstehen' })).toHaveAttribute(
    'href',
    '#/prozesse',
  );
  for (const { id, title } of taskArticles) {
    await tasks.getByRole('link', { name: title, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/#/artikel/${id}$`));
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
    await page.goto('/');
  }
});

test('home quick searches find the matching real task articles', async ({ page }) => {
  for (const { query, id, title } of [
    { query: 'Zugriffsrechte', ...taskArticles[10] },
    { query: 'Owner-Wechsel', ...taskArticles[10] },
    { query: 'Liefergegenstände', ...taskArticles[11] },
    { query: 'Meilensteine', ...taskArticles[11] },
  ]) {
    await page.goto('/');
    const quickSearch = page.locator('.quick-search').getByRole('link', { name: query });
    await expect(quickSearch).toHaveAttribute('href', `#/wissen?q=${encodeURIComponent(query)}`);
    await quickSearch.click();
    await expect(page.getByLabel('Wissensbasis durchsuchen')).toHaveValue(query);
    const article = page
      .locator('.article-card')
      .filter({ has: page.getByRole('link', { name: title, exact: true }) });
    await expect(article).toBeVisible();
    await expect(article).toContainText('Quellenbasierter Entwurf');
    await expect(article.getByRole('link', { name: title, exact: true })).toHaveAttribute(
      'href',
      `#/artikel/${id}`,
    );
  }
});

test('knowledge list contains only source-backed articles, including legacy filter URLs', async ({
  page,
}) => {
  await page.goto('/#/wissen');
  const cards = page.locator('.article-card');
  await expect(cards).toHaveCount(16);
  await expect(cards.locator('p.small.muted')).toHaveText(
    Array(16).fill('Quellenbasierter Entwurf · Einschränkungen beachten'),
  );
  for (const { id } of taskArticles) {
    await expect(cards.locator(`h3 a[href="#/artikel/${id}"]`)).toBeVisible();
  }

  await page.goto('/#/wissen?stand=demo');
  await expect(cards).toHaveCount(16);
  await expect(page.getByRole('combobox', { name: 'Inhaltsstand' })).toHaveCount(0);
});

test('real articles expose the reading order and early keyboard jump targets', async ({ page }) => {
  for (const id of [
    'guide-project-permissions',
    'faq-role-vs-access',
    'guide-deliverables-milestones',
    'faq-milestone-dates',
  ]) {
    await page.goto(`/#/artikel/${id}`);
    await expect(page.locator('.demo-note')).toContainText('Quellenbasierter Entwurf');
    const sectionIds = await page
      .locator('.article-content > section[id]')
      .evaluateAll((nodes) => nodes.map((node) => node.id));
    expect(sectionIds.slice(0, 6)).toEqual(
      id === 'guide-project-permissions'
        ? ['procedure-owner-change']
        : [
            'kurzantwort',
            'voraussetzungen',
            'einschraenkungen',
            'bedienweg',
            'ergebnispruefung',
            'nachweise',
          ],
    );
    await expect(page.locator('#einschraenkungen .source-ref').first()).not.toBeEmpty();
    for (const preservedId of [
      'fachlicher-kontext',
      'nachweise',
      'trainerhinweise',
      'quellen',
      'abschnitt-0',
    ]) {
      await expect(page.locator(`#${preservedId}`)).toHaveCount(1);
    }
    const jumps = page.getByRole('navigation', { name: 'Direkt zu den Abschnitten' });
    if (id === 'guide-project-permissions') await jumps.locator('summary').click();
    await expect(jumps.getByRole('button')).toHaveCount(6);
    expect(
      await page.evaluate(() => {
        const nav = document.querySelector('.article-jumps')!;
        const answer = document.querySelector('#kurzantwort')!;
        return Boolean(nav.compareDocumentPosition(answer) & Node.DOCUMENT_POSITION_FOLLOWING);
      }),
    ).toBeTruthy();
    await jumps.getByRole('button', { name: 'Kritische Einschränkungen' }).focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#einschraenkungen')).toBeFocused();
    await expect(page.locator('#einschraenkungen')).toBeInViewport();
  }
  for (const { id } of taskArticles) {
    await page.goto(`/#/artikel/${id}`);
    if (['guide-status-orientation', 'guide-r1-reporting'].includes(id)) {
      await expect(page.locator('[id^="procedure-"]')).toHaveCount(0);
      await expect(page.locator('#bedienweg')).toContainText('kein ausführbarer Bedienweg');
      await expect(page.locator('#bedienweg a')).toHaveCount(0);
      continue;
    }
    await expect(page.locator('[id^="procedure-"]').first()).toBeVisible();
    await expect(page.locator('[id^="procedure-"] .source-ref').first()).not.toBeEmpty();
    await expect(page.locator('#ergebnispruefung')).toContainText('Prüffragen');
  }
  await page.goto('/#/artikel/faq-role-vs-access');
  await expect(page.locator('#bedienweg a')).toHaveAttribute(
    'href',
    '#/artikel/guide-project-permissions',
  );
  await page.goto('/#/artikel/faq-milestone-dates');
  await expect(page.locator('#bedienweg a')).toHaveAttribute(
    'href',
    '#/artikel/guide-deliverables-milestones',
  );
});

test('demo articles and paths stay permanently inaccessible', async ({ page }) => {
  await page.goto('/#/wissen');
  const demo = page.locator('.article-card').filter({
    has: page.getByRole('heading', { name: 'iPPM verstehen: vom Projekt zum Portfolio' }),
  });
  const real = page
    .locator('.article-card')
    .filter({ has: page.getByRole('heading', { name: taskArticles[0].title }) });
  await expect(demo).toHaveCount(0);
  await expect(real).toContainText('Quellenbasierter Entwurf');
  await page.goto('/#/artikel/ippm-verstehen');
  await expect(page.getByRole('heading', { name: 'Beitrag nicht gefunden' })).toBeVisible();
  await page.goto('/#/lernpfade');
  await expect(page.getByRole('heading', { name: 'Diese Seite gibt es nicht' })).toBeVisible();
  await page.goto('/#/lernpfade/einstieg');
  await expect(page.getByRole('heading', { name: 'Diese Seite gibt es nicht' })).toBeVisible();
  await page.goto('/#/prozesse');
  await expect(page.locator('.process-flow')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Anleitung öffnen' })).toHaveCount(0);
  await page.goto('/#/mein-bereich');
  await expect(page.getByRole('main')).not.toContainText('Demo-Lernpfade');
});
