import { test, expect } from '@playwright/test';

const taskArticles = [
  {
    id: 'guide-project-permissions',
    title: 'Zugriffsrechte festlegen und Owner wechseln',
  },
  {
    id: 'guide-deliverables-milestones',
    title: 'Liefergegenstände in Liefer- und Zahlungsmeilensteine überführen',
  },
] as const;

test('home puts both real tasks before general and demo entry points', async ({ page }) => {
  await page.goto('/');
  const tasks = page.getByRole('region', { name: 'Mit einer Aufgabe beginnen' });
  await expect(tasks.locator('.article-card')).toHaveCount(2);
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
  expect(
    await page.evaluate(() => {
      const tasks = document.querySelector('.home-tasks')!;
      const demo = document.querySelector('.demo-learning')!;
      return Boolean(tasks.compareDocumentPosition(demo) & Node.DOCUMENT_POSITION_FOLLOWING);
    }),
  ).toBeTruthy();
  await expect(page.getByLabel('Was möchten Sie wissen?')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Wissen nachschlagen' })).toHaveAttribute(
    'href',
    '#/wissen',
  );
  await expect(page.getByRole('link', { name: 'Demo-Lernpfade ansehen' })).toHaveAttribute(
    'href',
    '#/lernpfade',
  );
  for (const { id, title } of taskArticles) {
    await tasks.getByRole('link', { name: title, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/#/artikel/${id}$`));
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
    await page.goto('/');
  }
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
    expect(sectionIds.slice(0, 6)).toEqual([
      'kurzantwort',
      'voraussetzungen',
      'einschraenkungen',
      'bedienweg',
      'ergebnispruefung',
      'nachweise',
    ]);
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
    await expect(page.locator('[id^="procedure-"]').first()).toBeVisible();
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

test('demo articles and paths remain separate from real content and training claims', async ({
  page,
}) => {
  await page.goto('/#/wissen');
  const demo = page.locator('.article-card').filter({
    has: page.getByRole('heading', { name: 'iPPM verstehen: vom Projekt zum Portfolio' }),
  });
  const real = page
    .locator('.article-card')
    .filter({ has: page.getByRole('heading', { name: taskArticles[0].title }) });
  await expect(demo).toContainText('Demonstrationsinhalt');
  await expect(real).toContainText('Quellenbasierter Entwurf');
  await page.goto('/#/artikel/ippm-verstehen');
  await expect(page.locator('.demo-note')).toContainText('Demonstrationsinhalt');
  await page.goto('/#/lernpfade');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Beispielwissen Schritt für Schritt',
  );
  await expect(page.getByRole('main')).toContainText('kein Schulungsnachweis');
  await expect(page.locator('.path-card')).toHaveCount(3);
  await expect(page.locator('.path-card').first()).toContainText('Demo');
  await page.goto('/#/lernpfade/einstieg');
  await expect(page.locator('.demo-note')).toContainText(
    'kein fachlicher oder schulischer Nachweis',
  );
  await page.goto('/#/mein-bereich');
  await expect(page.getByRole('main')).toContainText('Demo-Lernpfade abgeschlossen');
});
