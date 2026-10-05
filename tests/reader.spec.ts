import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import baseline from './fixtures/migration-baseline.json' with { type: 'json' };
import { createHash } from 'node:crypto';
async function navigate(page: import('@playwright/test').Page, name: string) {
  const nav = page.getByRole('navigation', { name: 'Hauptnavigation' });
  if (!(await nav.isVisible())) await page.getByRole('button', { name: 'Menü öffnen' }).click();
  await nav.getByRole('link', { name, exact: true }).click();
}

test('release lens keeps all cards, supports keyboard and preserves release context in details', async ({
  page,
}, testInfo) => {
  await page.goto('/#/prozesse/releaseueberblick');
  const cards = page.locator('.orientation-columns .orientation-card');
  await expect(cards).toHaveCount(132);
  const ids = await cards.evaluateAll((els) =>
    els.map((e) => e.getAttribute('data-orientation-id')),
  );
  const geometry = () =>
    cards.evaluateAll((els) =>
      els.map((e) => {
        const r = e.getBoundingClientRect();
        const parent = e.closest('.orientation-columns')!.getBoundingClientRect();
        return [r.x - parent.x, r.y - parent.y, r.width, r.height];
      }),
    );
  const beforeGeometry = await geometry();
  await expect(page.locator('.orientation-columns [data-state="all"]')).toHaveCount(132);
  const r2 = page.getByRole('button', { name: 'R2', exact: true });
  await r2.focus();
  await page.keyboard.press('Enter');
  await expect(r2).toHaveAttribute('aria-pressed', 'true');
  await expect(page).toHaveURL(/release=R2/);
  await expect(page.locator('[data-orientation-id="lm-P.1.1"] .orientation-state')).toHaveText(
    'Anderem Release zugeordnet',
  );
  await expect(page.locator('.orientation-legend')).toContainText(
    'Beides belegt keinen Ausschluss aus dem ausgewählten Release',
  );
  await expect(page.locator('.orientation-notice')).toContainText(
    'keine Verfügbarkeits- oder Projektfreigabe',
  );
  expect(
    await cards.evaluateAll((els) => els.map((e) => e.getAttribute('data-orientation-id'))),
  ).toEqual(ids);
  expect(await geometry()).toEqual(beforeGeometry);
  await expect(page.locator('.orientation-columns [data-state="direct"]').first()).toBeVisible();
  await expect(
    page.locator('.orientation-columns [data-state="unassigned"]').first(),
  ).toBeVisible();
  await page.reload();
  await expect(r2).toHaveAttribute('aria-pressed', 'true');
  await page.screenshot({ path: testInfo.outputPath('release-overview.png') });
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  ).toBeTruthy();
  const axe = await new AxeBuilder({ page }).analyze();
  expect(axe.violations).toEqual([]);
  const muted = page.locator('.orientation-columns [data-state="unassigned"] a').first();
  await muted.click();
  await expect(page.locator('.orientation-detail')).toBeVisible();
  await expect(page).toHaveURL(/release=R2/);
  await page.getByRole('link', { name: '← Zur Gesamtübersicht', exact: true }).click();
  await expect(r2).toHaveAttribute('aria-pressed', 'true');
  await r2.click();
  await expect(page.getByRole('button', { name: 'Alles anzeigen', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.goto('/#/prozesse/releaseueberblick/lm-MAP?release=R2');
  await expect(page.locator('.orientation-detail')).toContainText('Kein Releasebezug hinterlegt');
  await expect(page.locator('.orientation-detail')).not.toContainText('Anderem Release zugeordnet');
  await page.goto('/#/prozesse/releaseueberblick/lm-P.1.1?release=R2');
  await expect(page.locator('.orientation-detail')).toContainText('Anderem Release zugeordnet');
  await expect(page.locator('.orientation-detail')).not.toContainText(
    'Kein Releasebezug hinterlegt',
  );
  await page.goto('/#/prozesse/releaseueberblick');
  await expect(page.locator('.orientation-columns [data-state="all"]')).toHaveCount(132);
});

test('orientation distinguishes current Center reuse from historical import evidence', async ({
  page,
}) => {
  await page.goto('/#/prozesse/releaseueberblick/lm-P.1.4?release=R2');
  const current = page.locator('.orientation-current-content');
  await expect(
    current.getByRole('link', { name: 'System- und ILS-Teilprojekte definieren' }),
  ).toHaveAttribute('href', '#/artikel/guide-subproject-definition');
  await expect(current).toContainText(
    'Prüfunterlagen, Release, Umgebung und genauer PDP-Umfang fehlen',
  );
  await expect(current).toContainText('Artikelgeltung: R1');
  await expect(current).toContainText('Diese Inhaltsreferenz erweitert keine Releaseplanung');
  const historical = page.locator('.orientation-import-evidence');
  await expect(historical).not.toHaveAttribute('open', '');
  await historical.locator('summary').click();
  await expect(historical).toContainText(
    'Project Purpose soll aus Teilprojekt-PDPs entfernt werden',
  );
  await expect(historical).toContainText('keine aktuelle Pflegequelle');
  await expect(historical).toContainText('Quellenunterschied');
  const sources = page.locator('.source-notes');
  await sources.locator('summary').click();
  await expect(sources).toContainText('SB1-Handbuch');
  await expect(sources).toContainText('Originalidentität und Originalinhalt nicht erneut geprüft');
  await expect(sources).not.toContainText('Fundstellen beziehen sich auf lokale Originaldateien');
  await expect(page.getByRole('button', { name: 'R2', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
});

test('orientation bridges to canonical work and the common search, with no invented availability', async ({
  page,
}) => {
  await page.goto('/#/releases/R2');
  await page.getByRole('link', { name: 'R2 in der Landkarte hervorheben' }).click();
  await expect(page.getByRole('button', { name: 'R2', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.goto('/#/prozesse/releaseueberblick/lm-P.1.1?release=release-1');
  await expect(page.locator('.orientation-detail')).toContainText(
    'Der vollständige Antrags- und PMO-Bereitstellungsweg ist nicht nachgewiesen',
  );
  await page.getByRole('link', { name: '1.2 Projekt anlegen', exact: true }).click();
  await expect(page.locator('main h1')).toContainText('Projekt anlegen');
  await expect(page.getByRole('heading', { name: 'Einordnung in der Landkarte' })).toBeVisible();
  await page
    .getByRole('link', { name: 'Projektumgebung vorbereiten und übernehmen', exact: true })
    .click();
  await expect(page.locator('main')).toContainText('Bereitgestellte Projektumgebung als PM prüfen');
  await page.goto('/#/wissen?q=Mengengerüst');
  await expect(page.locator('main a[href^="#/prozesse/releaseueberblick/"]').first()).toBeVisible();
  await page.goto('/#/prozesse/releaseueberblick?release=missing');
  await expect(page.getByRole('alert')).toContainText('Unbekanntes Release');
  await expect(page.getByRole('button', { name: 'Alles anzeigen', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
});

test('original transparent logo assets load and the sidebar uses the simple dark variant', async ({
  page,
  request,
}, testInfo) => {
  const hashes = {
    'full-on-dark': 'c0a6df593b13d1f6672626ab410ad405a65e31d4ec795b548266bf06debaf4ad',
    'full-on-light': '721258811f4c9d45ed34a0723d1fe429a25b40e01c76616019cfc7f4137332e9',
    'simple-on-dark': '3908b2f8e14172343a13d94765362e53133b934c203c30941c8939af3fa85922',
    'simple-on-light': '41cd2b4b8db372dd65721a689551e990db1eb97c991cc73933d0a2e2f20eb876',
  };
  for (const [variant, hash] of Object.entries(hashes)) {
    const response = await request.get(`/brand/ippm/ippm-logo-${variant}.png`);
    expect(response.ok()).toBeTruthy();
    expect(response.headers()['content-type']).toContain('image/png');
    expect(
      createHash('sha256')
        .update(await response.body())
        .digest('hex'),
    ).toBe(hash);
  }
  await page.goto('/');
  if (!(await page.locator('.sidebar').isVisible()))
    await page.getByRole('button', { name: 'Menü öffnen' }).click();
  const brand = page.getByRole('link', { name: 'iPPM Startseite', exact: true });
  await expect(brand).toHaveAttribute('href', '#/');
  const logo = brand.locator('img');
  await expect(logo).toHaveAttribute('src', /brand\/ippm\/ippm-logo-simple-on-dark\.png$/);
  await expect(logo).toHaveAttribute('alt', '');
  expect(
    await logo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth === 1224),
  ).toBeTruthy();
  await expect(brand).toContainText('Knowledge &');
  await expect(brand).toContainText('Training Center');
  await expect(page.locator('.brand-name, .brand-marker')).toHaveCount(0);
  await brand.focus();
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('navigation', { name: 'Hauptnavigation' }).getByRole('link').first(),
  ).toBeFocused();
  await expect(page.locator('.sidebar :focus')).toHaveCSS('outline-color', 'rgb(98, 137, 253)');
  await page.screenshot({ path: testInfo.outputPath('branding.png') });
  await brand.click();
  await expect(page.locator('main h1')).toHaveText('Aufgaben');
  if (testInfo.project.name === 'mobile') {
    await expect(page.locator('.sidebar')).toBeHidden();
    await expect(page.getByRole('button', { name: 'Menü öffnen' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  }
});

test('primary and secondary actions keep independent hover, pressed and blue keyboard focus states', async ({
  page,
}) => {
  await page.goto('/');
  const input = page.getByRole('searchbox', { name: 'Wissen und Aufgaben durchsuchen' });
  const primary = page.getByRole('button', { name: 'Suchen', exact: true });
  await expect(primary).toHaveCSS('background-color', 'rgb(253, 238, 101)');
  await expect(primary).toHaveCSS('color', 'rgb(26, 26, 26)');
  await expect(primary).toHaveCSS('border-radius', '999px');
  await input.focus();
  await page.keyboard.press('Tab');
  await expect(primary).toBeFocused();
  await expect(primary).toHaveCSS('outline-color', 'rgb(56, 99, 229)');
  await expect(primary).toHaveCSS('outline-style', 'solid');
  await primary.hover();
  await expect(primary).toHaveCSS('background-color', 'rgb(48, 48, 48)');
  await expect(primary).toHaveCSS('color', 'rgb(255, 255, 255)');
  await page.mouse.down();
  await expect(primary).toHaveCSS('background-color', 'rgb(48, 48, 48)');
  await page.mouse.move(0, 0);
  await page.mouse.up();
  await page.goto('/#/artikel/guide-project-objectives');
  const secondary = page.getByRole('button', { name: 'Beitrag merken', exact: true });
  await expect(secondary).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(secondary).toHaveCSS('border-color', 'rgb(118, 118, 118)');
  await secondary.focus();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');
  await expect(secondary).toHaveCSS('outline-color', 'rgb(56, 99, 229)');
  await secondary.hover();
  await expect(secondary).toHaveCSS('background-color', 'rgb(48, 48, 48)');
  await expect(secondary).toHaveCSS('color', 'rgb(255, 255, 255)');
});

test('360px reference and enlarged text preserve navigation and long content without overflow', async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 360, height: 800 });
  for (const route of ['/', '/#/wissen', '/#/artikel/guide-project-permissions', '/#/hilfe']) {
    await page.goto(route);
    await expect(page.locator('main h1')).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    ).toBeTruthy();
  }
  await page.screenshot({ path: testInfo.outputPath('mobile-long-content.png'), fullPage: true });
  await page.getByRole('button', { name: 'Menü öffnen' }).click();
  await expect(page.getByRole('button', { name: 'Menü schließen' })).toHaveAttribute(
    'aria-expanded',
    'true',
  );
  await page
    .getByRole('navigation', { name: 'Hauptnavigation' })
    .getByRole('link', { name: 'Wissen', exact: true })
    .click();
  await expect(page.locator('.sidebar')).toBeHidden();
  await page.addStyleTag({
    content:
      'body { font-size: 36px; } h1 { font-size: 96px; } h2 { font-size: 40px; } h3 { font-size: 36px; }',
  });
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  ).toBeTruthy();
});
test('four user entries expose tasks, processes, roles and knowledge', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Aufgaben', exact: true })).toBeVisible();
  await navigate(page, 'Prozesse');
  await expect(page.getByRole('heading', { name: 'Prozesse', exact: true })).toBeVisible();
  await expect(page.locator('main a[href^="#/schritt/"]')).toHaveCount(52);
  await navigate(page, 'Rollen');
  await expect(page.getByRole('heading', { name: 'Rollen', exact: true })).toBeVisible();
  await page
    .locator('main')
    .getByRole('link', { name: 'Technical Manager (TM)', exact: true })
    .click();
  await expect(page.locator('main a[href="#/schritt/step-3-12"]')).toBeVisible();
  await navigate(page, 'Wissen');
  await expect(page.locator('.article-card')).toHaveCount(16);
  await expect(page.getByRole('navigation', { includeHidden: true })).not.toContainText(
    /Inventory|Evidence|Assessments|CareCases|SHA-256/,
  );
});
test('common search finds procedures and articles with German spelling and role filters', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Wissen und Aufgaben durchsuchen' }).fill('Owner');
  await page.getByRole('button', { name: 'Suchen', exact: true }).click();
  await expect(page.locator('main a[href="#/bedienweg/procedure-owner-change"]')).toBeVisible();
  await expect(page.locator('.article-card').filter({ hasText: 'Owner' }).first()).toBeVisible();
  await page.getByRole('combobox', { name: 'Rolle', exact: true }).selectOption('tm');
  await expect(page.locator('.article-card')).not.toHaveCount(0);
  await page
    .getByRole('searchbox', { name: 'Wissen und Aufgaben durchsuchen' })
    .fill('nichtvorhandenerbegriff');
  await page.getByRole('button', { name: 'Suchen', exact: true }).click();
  await expect(
    page.getByRole('status').filter({ hasText: 'Keine passenden Inhalte' }),
  ).toBeVisible();
});
test('stable article, process step and procedure URLs remain accessible', async ({ page }) => {
  for (const id of baseline.articleIds) {
    await page.goto('/#/artikel/' + id);
    await expect(page.locator('main h1')).toBeVisible();
    await expect(page.locator('main')).not.toContainText('Beitrag nicht verfügbar');
  }
  await page.goto('/#/schritt/step-2-6');
  await expect(page.locator('main h1')).toContainText('Teilprojektleiter');
  await page.goto('/#/bedienweg/procedure-owner-change');
  await expect(page.locator('main')).toContainText('Sichern Sie sich vor dem Owner-Wechsel');
  await page.goto('/#/artikel/archived-demo');
  await expect(page.getByRole('heading', { name: 'Beitrag nicht verfügbar' })).toBeVisible();
});
test('R1 training blocks display generic SB01 and SB02, including absent material', async ({
  page,
}) => {
  await page.goto('/#/releases');
  await page.getByRole('link', { name: /SB01/ }).click();
  await expect(page.locator('.training-row')).toHaveCount(24);
  await page.goto('/#/schulungen/sb2');
  await expect(page.locator('.training-row')).toHaveCount(27);
  await expect(page.locator('main')).toContainText('noch kein Center-Material');
});
test('bookmarks and read state survive reload without dropping opaque v1 IDs', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() =>
    localStorage.setItem(
      'ippm-learning-v1',
      JSON.stringify({
        version: 1,
        bookmarks: ['retired-bookmark'],
        read: ['unknown-read'],
        passed: ['old-path'],
      }),
    ),
  );
  await page.goto('/#/artikel/guide-project-permissions');
  await page.reload();
  await page.getByRole('button', { name: 'Beitrag merken', exact: true }).click();
  await page.getByRole('button', { name: 'Als gelesen markieren', exact: true }).click();
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Aus Merkliste entfernen', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  const data = await page.evaluate(() => JSON.parse(localStorage.getItem('ippm-learning-v1')!));
  expect(data.bookmarks).toContain('retired-bookmark');
  expect(data.bookmarks).toContain('guide-project-permissions');
  expect(data.read).toContain('unknown-read');
  expect(data.passed).toEqual(['old-path']);
  await page.goto('/#/mein-bereich');
  await expect(page.locator('.article-card')).toHaveCount(1);
});
test('storage errors are visible and edits still work for the session', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new Error('Quota');
    };
  });
  await page.goto('/#/artikel/guide-project-objectives');
  await page.getByRole('button', { name: 'Beitrag merken', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Speicherung nicht möglich');
  await expect(page.getByRole('button', { name: 'Aus Merkliste entfernen' })).toBeVisible();
});
test('progress export/import preserves unknown values and merges known bookmarks', async ({
  page,
}) => {
  await page.goto('/#/mein-bereich');
  await page.getByLabel('Sicherungsdatei auswählen').setInputFiles({
    name: 'backup.json',
    mimeType: 'application/json',
    buffer: Buffer.from(
      JSON.stringify({
        version: 1,
        bookmarks: ['guide-project-objectives', 'opaque'],
        read: ['opaque-read'],
        passed: ['opaque-path'],
      }),
    ),
  });
  await expect(page.getByRole('status').filter({ hasText: 'Sicherung übernommen' })).toBeVisible();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Sicherung exportieren' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/ippm-lernbereich/);
  const state = await page.evaluate(() => JSON.parse(localStorage.getItem('ippm-learning-v1')!));
  expect(state.bookmarks).toContain('opaque');
  expect(state.read).toContain('opaque-read');
  expect(state.passed).toContain('opaque-path');
});
test('core boundaries remain visible before applying owner and reporting procedures', async ({
  page,
}) => {
  await page.goto('/#/artikel/guide-project-permissions');
  await expect(page.locator('main')).toContainText('Build Team');
  await expect(page.locator('.limitations')).toContainText('Rechte');
  await page.goto('/#/artikel/guide-r1-reporting');
  await expect(page.locator('.limitations')).toContainText('PMO Status bleibt beim PMO');
  await expect(page.locator('.limitations')).toContainText('Bestands-Sites');
  await page.goto('/#/artikel/guide-project-master-data');
  await expect(page.locator('main')).toContainText('EDC');
  await expect(page.locator('main')).toContainText('unabhängig');
});
for (const route of [
  '/',
  '/#/wissen',
  '/#/prozesse',
  '/#/rollen',
  '/#/artikel/guide-project-permissions',
  '/#/schulungen/sb2',
])
  test(`responsive and accessible: ${route}`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator('main h1')).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBeTruthy();
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(result.violations).toEqual([]);
  });
test('keyboard skip link moves focus into main', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Zum Inhalt springen' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
});

test('real legacy process searches and knowledge filters retain their meaning', async ({
  page,
}) => {
  await page.goto('/#/prozesse?q=R1B-06');
  await expect(page.getByRole('heading', { name: 'Treffer für „R1B-06“' })).toBeVisible();
  await page.locator('main a[href="#/thema/R1B-06"]').click();
  await expect(page.locator('main h1')).toHaveText('AddIn MTA');
  await page.goto('/#/wissen?rolle=tm');
  await expect(page.getByRole('combobox', { name: 'Rolle', exact: true })).toHaveValue('tm');
  const { loadModel } = await import('./model');
  const model = await loadModel();
  const expected = model.content.articles.filter((a) => a.roleIds.includes('tm'));
  await expect(page.locator('.article-card')).toHaveCount(expected.length);
  for (const a of expected)
    await expect(
      page.locator('.article-card').getByRole('link', { name: a.title, exact: true }),
    ).toBeVisible();
  await page.getByRole('combobox', { name: 'Rolle', exact: true }).selectOption('pm');
  await expect(page).toHaveURL(/role=pm/);
  expect(new URLSearchParams(new URL(page.url()).hash.split('?')[1]).has('rolle')).toBeFalsy();
  const article = model.content.articles.find((a) => a.topic && a.kind)!;
  await page.goto(
    '/#/wissen?thema=' +
      encodeURIComponent(article.topic!) +
      '&format=' +
      encodeURIComponent(article.kind!),
  );
  await expect(page.locator('.article-card')).toHaveCount(
    model.content.articles.filter((a) => a.topic === article.topic && a.kind === article.kind)
      .length,
  );
  await expect(page.getByRole('combobox', { name: 'Thema', exact: true })).toHaveValue(
    article.topic!,
  );
  await page.goto('/#/wissen?rolle=Alle%20Rollen&thema=Alle%20Themen&format=Alle%20Formate');
  await expect(page.locator('.article-card')).toHaveCount(16);
});

test('process map and list share all canonical steps, explicit metadata and stable routes', async ({
  page,
}, testInfo) => {
  await page.goto('/#/prozesse/projektabwicklung?ansicht=karte');
  const cards = page.locator('.process-card');
  await expect(cards).toHaveCount(52);
  const mapIds = await cards.evaluateAll((els) =>
    els.map((e) => e.getAttribute('data-step-id')).sort(),
  );
  expect(mapIds).toEqual([...baseline.stepIds].sort());
  const owner = page.locator('#process-card-step-2-6');
  await expect(owner).toContainText('Anleitungen:');
  await expect(owner).toContainText('Release-Zuordnung: R1');
  await expect(owner).toContainText('Offene Punkte:');
  const closure = page.locator('#process-card-step-5-1');
  await expect(closure).toContainText('Keine Rolle belegt');
  await expect(closure).not.toContainText(/Release-Zuordnung|freigegeben|nicht verfügbar/);
  for (const card of await cards.all()) {
    const href = await card.getAttribute('href');
    expect(href).toMatch(/^#\/schritt\/step-[\d-]+\?prozess=projektabwicklung&ansicht=karte$/);
  }
  await page.screenshot({ path: testInfo.outputPath('process-map.png') });
  await page.getByRole('button', { name: 'Liste', exact: true }).focus();
  await page.keyboard.press('Space');
  await expect(page.getByRole('button', { name: 'Liste', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(cards).toHaveCount(0);
  const links = page.locator('main a[href^="#/schritt/"]');
  expect(
    await links.evaluateAll((els) =>
      els.map((e) => e.getAttribute('href')!.split('?')[0].split('/').pop()).sort(),
    ),
  ).toEqual(mapIds);
  await page.reload();
  await expect(links).toHaveCount(52);
  await page.getByRole('button', { name: 'Prozesslandkarte', exact: true }).click();
  await expect(cards).toHaveCount(52);
  const axe = await new AxeBuilder({ page }).analyze();
  expect(axe.violations).toEqual([]);
});

test('keyboard tooltips, visible focus and both return paths restore the process view and scroll', async ({
  page,
}) => {
  await page.goto('/#/prozesse');
  const initial = page.locator('#process-card-step-1-1');
  await initial.hover();
  await expect(initial.locator('..').getByRole('tooltip')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(initial.locator('..').getByRole('tooltip')).toBeHidden();
  const card = page.locator('#process-card-step-3-7');
  await card.scrollIntoViewIfNeeded();
  await card.focus();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');
  await expect(card).toBeFocused();
  await expect(card).toHaveCSS('outline-color', 'rgb(56, 99, 229)');
  const tooltip = page.locator(
    '#' + (await card.getAttribute('aria-describedby'))!.replace(/:/g, '\\:'),
  );
  await expect(tooltip).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(tooltip).toBeHidden();
  const position = await page.evaluate(() => ({
    y: scrollY,
    x: document.querySelector('.swimlane-scroll')!.scrollLeft,
  }));
  await page.keyboard.press('Enter');
  await expect(page.locator('main h1')).toContainText('3.7');
  await expect(page).toHaveURL(/#\/schritt\/step-3-7/);
  await page.goBack();
  await expect(card).toBeFocused();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeCloseTo(position.y, 0);
  await expect
    .poll(() => page.locator('.swimlane-scroll').evaluate((e) => e.scrollLeft))
    .toBeCloseTo(position.x, 0);
  await page.keyboard.press('Enter');
  await page.getByRole('link', { name: '← Zurück zur Prozesslandkarte' }).click();
  await expect(card).toBeFocused();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeCloseTo(position.y, 0);
  await page.getByRole('button', { name: 'Liste', exact: true }).click();
  const listLink = page.locator('#process-list-step-3-7');
  await listLink.scrollIntoViewIfNeeded();
  await listLink.focus();
  const listY = await page.evaluate(() => scrollY);
  await page.keyboard.press('Enter');
  await page.getByRole('link', { name: '← Zurück zur Prozessliste' }).click();
  await expect(listLink).toBeFocused();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeCloseTo(listY, 0);
});

test('process edges stay orthogonal, avoid cards and remeasure after resize and expanded connections', async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto('/#/prozesse/projektabwicklung?ansicht=karte');
  const paths = page.locator('.swimlane-flows > path');
  await expect(paths).toHaveCount(66);
  const assertGeometry = async () => {
    const errors = await page.evaluate(() => {
      const board = document.querySelector('.swimlane-board')!.getBoundingClientRect();
      const cards = [...document.querySelectorAll<HTMLElement>('.swimlane-item')].map((el) => {
        const r = el.getBoundingClientRect();
        return {
          id: el.querySelector<HTMLElement>('[data-step-id]')!.dataset.stepId,
          left: r.left - board.left,
          right: r.right - board.left,
          top: r.top - board.top,
          bottom: r.bottom - board.top,
        };
      });
      const errors: string[] = [];
      for (const path of document.querySelectorAll<SVGPathElement>('.swimlane-flows > path')) {
        const d = path.getAttribute('d')!;
        const nums = d.match(/-?\d+(?:\.\d+)?/g)!.map(Number);
        const commands = d.match(/[MHV]/g)!;
        let x = nums[0],
          y = nums[1],
          cursor = 2;
        const source = cards.find((c) => c.id === path.dataset.from)!;
        const target = cards.find((c) => c.id === path.dataset.to)!;
        const onEdge = (r: typeof source, px: number, py: number) =>
          ((Math.abs(px - r.left) < 1 || Math.abs(px - r.right) < 1) &&
            py >= r.top &&
            py <= r.bottom) ||
          ((Math.abs(py - r.top) < 1 || Math.abs(py - r.bottom) < 1) &&
            px >= r.left &&
            px <= r.right);
        if (!onEdge(source, x, y)) errors.push('source');
        for (const command of commands.slice(1)) {
          const nx = command === 'H' ? nums[cursor++] : x;
          const ny = command === 'V' ? nums[cursor++] : y;
          for (const c of cards) {
            const crosses =
              command === 'H'
                ? y > c.top + 1 &&
                  y < c.bottom - 1 &&
                  Math.max(x, nx) > c.left + 1 &&
                  Math.min(x, nx) < c.right - 1
                : x > c.left + 1 &&
                  x < c.right - 1 &&
                  Math.max(y, ny) > c.top + 1 &&
                  Math.min(y, ny) < c.bottom - 1;
            if (crosses) errors.push(`${path.dataset.from} → ${path.dataset.to} crosses ${c.id}`);
          }
          x = nx;
          y = ny;
        }
        if (!onEdge(target, x, y)) errors.push('target');
      }
      return errors;
    });
    expect(errors).toEqual([]);
  };
  await assertGeometry();
  // Adjacent steps use facing edges, without detours around the row.
  expect(
    await page.locator('path[data-from="step-1-1"][data-to="step-1-2"]').getAttribute('d'),
  ).toMatch(/^M [\d.]+ [\d.]+ H [\d.]+$/);
  expect(
    await page.locator('path[data-from="step-2-1"][data-to="step-2-2"]').getAttribute('d'),
  ).toMatch(/^M [\d.]+ [\d.]+ V [\d.]+$/);
  const original = await paths.first().getAttribute('d');
  await page.setViewportSize({ width: 1800, height: 1100 });
  await expect.poll(() => paths.first().getAttribute('d')).not.toBe(original);
  await assertGeometry();
  const region = page.getByRole('region', { name: 'Prozesslandkarte Projektabwicklung' });
  await region.screenshot({ path: testInfo.outputPath('process-wide.png') });
  const summary = page
    .locator('.swimlane-item')
    .filter({ has: page.locator('#process-card-step-2-2') })
    .locator('summary');
  await summary.click();
  await expect(page.locator('.process-connections[open]')).toHaveCount(1);
  await expect.poll(() => paths.nth(0).getAttribute('d')).toBeTruthy();
  // ResizeObserver updates on content expansion as well as viewport changes.
  await expect
    .poll(async () => {
      try {
        await assertGeometry();
        return true;
      } catch {
        return false;
      }
    })
    .toBe(true);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.swimlane-flows')).toBeHidden();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  ).toBeTruthy();
  await expect(page.locator('.process-card')).toHaveCount(52);
  await expect(summary).toBeVisible();
  await expect(page.locator('.process-connections[open]')).toContainText(
    'Zu 2.7 Zugriffsrechte festlegen',
  );
  await page.setViewportSize({ width: 1440, height: 1100 });
  await expect(page.locator('.swimlane-flows')).toBeVisible();
  await expect
    .poll(async () => {
      try {
        await assertGeometry();
        return true;
      } catch {
        return false;
      }
    })
    .toBe(true);
});

test('hover tooltip remains reachable across the card edge with collapsed and expanded connections', async ({
  page,
}, testInfo) => {
  await page.goto('/#/prozesse/projektabwicklung?ansicht=karte');
  const card = page.locator('#process-card-step-2-2');
  const tooltip = card.locator('..').getByRole('tooltip');
  const summary = page.locator('.swimlane-item').filter({ has: card }).locator('summary');
  for (const expanded of [false, true]) {
    if (expanded) await summary.click();
    await card.scrollIntoViewIfNeeded();
    await card.hover();
    await expect(card).not.toBeFocused();
    await expect(tooltip).toBeVisible();
    const cardBounds = (await card.boundingBox())!;
    const tooltipBounds = (await tooltip.boundingBox())!;
    // The pointer must reach the tooltip without traversing an inactive summary/row gap.
    expect(Math.abs(tooltipBounds.y - cardBounds.y - cardBounds.height)).toBeLessThanOrEqual(1);
    await page.mouse.move(cardBounds.x + 20, cardBounds.y + cardBounds.height - 2);
    await page.mouse.move(tooltipBounds.x + 20, tooltipBounds.y + 20, { steps: 24 });
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText('Details im Schritt öffnen.');
    await expect(tooltip).not.toContainText(/Eingang:|Ergebnis:|Offene Punkte:/);
    expect(tooltipBounds.width).toBeLessThanOrEqual(280);
    expect(tooltipBounds.height).toBeLessThanOrEqual(180);
    await page.screenshot({
      path: testInfo.outputPath(`process-tooltip-${expanded ? 'expanded' : 'collapsed'}.png`),
    });
    await page.keyboard.press('Escape');
    await expect(tooltip).toBeHidden();
    await page.mouse.move(0, 0);
  }
  const longCard = page.locator('#process-card-step-1-1');
  await longCard.hover();
  const longTooltip = longCard.locator('..').getByRole('tooltip');
  await expect(longTooltip).toBeVisible();
  const preview = await longTooltip.locator('p').first().textContent();
  expect(preview!.length).toBeLessThanOrEqual(160);
  expect(preview).toMatch(/…$/);
  expect((await longTooltip.boundingBox())!.height).toBeLessThanOrEqual(180);
});
