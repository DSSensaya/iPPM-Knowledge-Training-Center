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
  await page.getByText('Fachliche Hinweise und Kontext', { exact: true }).click();
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
  await expect(page.locator('main h1')).toHaveText('Ihr Einstieg in iPPM');
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
test('home offers keyboard-accessible entries and navigation back to the overview', async ({
  page,
}, testInfo) => {
  await page.goto('/');
  await expect(page.locator('main h1')).toHaveText('Ihr Einstieg in iPPM');
  await expect(page).toHaveTitle('Startseite · iPPM Knowledge & Training Center');
  await expect(
    page.getByRole('searchbox', { name: 'Wissen und Aufgaben durchsuchen' }),
  ).toBeVisible();
  await expect(page.getByRole('searchbox', { name: 'Aufgaben filtern' })).toHaveCount(0);
  const nav = page.getByRole('navigation', { name: 'Hauptnavigation', includeHidden: true });
  await expect(nav.locator('[aria-current="page"]')).toHaveCount(1);
  await expect(
    nav.getByRole('link', { name: 'Startseite', exact: true, includeHidden: true }),
  ).toHaveAttribute('aria-current', 'page');
  await page.screenshot({ path: testInfo.outputPath('home.png'), fullPage: true });

  for (const [path, title] of [
    ['/aufgaben', 'Aufgaben'],
    ['/prozesse', 'Prozesse'],
    ['/wissen', 'Wissen'],
    ['/rollen', 'Rollen'],
    ['/releases', 'Releases & Schulungen'],
    ['/mein-bereich', 'Mein Lernbereich'],
    ['/hilfe', 'Wie können wir helfen?'],
  ]) {
    const entry = page.locator(`main a[href="#${path}"]`);
    await expect(entry).toHaveCount(1);
    await entry.focus();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Shift+Tab');
    await expect(entry).toBeFocused();
    await expect(entry).toHaveCSS('outline-color', 'rgb(56, 99, 229)');
    await page.keyboard.press('Enter');
    await expect(page.locator('main h1')).toHaveText(title);
    await expect(page.locator('main')).toBeFocused();
    await navigate(page, 'Startseite');
    await expect(page).toHaveURL(/#\/$/);
    await expect(page.locator('main h1')).toHaveText('Ihr Einstieg in iPPM');
    await expect(nav.locator('[aria-current="page"]')).toHaveCount(1);
  }
  await page.reload();
  await expect(page.locator('main h1')).toHaveText('Ihr Einstieg in iPPM');
});

test('four user entries expose tasks, processes, roles and knowledge', async ({ page }) => {
  await page.goto('/#/aufgaben');
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
  await page.locator('.role-phase summary').filter({ hasText: 'Planung' }).click();
  await expect(page.locator('main a[href="#/schritt/step-3-12"]')).toBeVisible();
  await navigate(page, 'Wissen');
  await expect(page.locator('.article-card')).toHaveCount(16);
  await expect(page.getByRole('navigation', { includeHidden: true })).not.toContainText(
    /Inventory|Evidence|Assessments|CareCases|SHA-256/,
  );
});
test('tasks group every step once with canonical numbers and keep supplementary work separate', async ({
  page,
}, testInfo) => {
  const { loadModel } = await import('./model');
  const model = await loadModel();
  const steps = model.getProcessSteps();
  await page.goto('/#/aufgaben');
  await expect(page.getByRole('searchbox')).toHaveCount(1);
  await expect(page.getByRole('status')).toHaveText('52 Prozessschritte · 2 ergänzende Aufgaben');
  await expect(page.locator('.task-phase[open]')).toHaveCount(1);
  const links = page.locator('.task-step-link');
  expect(await links.evaluateAll((items) => items.map((a) => a.getAttribute('href')))).toEqual(
    steps.map((step) => '#/schritt/' + step.id),
  );
  expect(await links.locator('.task-number').allTextContents()).toEqual(
    steps.map((step) => step.number),
  );
  await expect(page.locator('.task-independent-link')).toHaveCount(2);
  await expect(page.locator('.task-phase a[href^="#/aufgabe/"]')).toHaveCount(0);
  await expect(page.locator('.task-phase details')).toHaveCount(0);
  await expect(page.locator('.task-independent-link .task-number')).toHaveCount(0);
  await expect(page.locator('.task-independent-link')).toContainText([
    'Reviewstatus pflegen',
    'Projektfortschritt pflegen',
  ]);
  await page.screenshot({ path: testInfo.outputPath('tasks-overview.png'), fullPage: true });

  for (const phase of await page.locator('.task-phase').all()) {
    if ((await phase.getAttribute('open')) === null) {
      await phase.locator(':scope > summary').focus();
      await page.keyboard.press('Enter');
    }
    for (const link of await phase.locator('.task-step-link').all())
      await expect(link).toBeVisible();
  }
  const owner = page.locator('.task-step-link[href="#/schritt/step-2-6"]');
  await owner.focus();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');
  await expect(owner).toBeFocused();
  await expect(owner).toHaveCSS('outline-color', 'rgb(56, 99, 229)');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#\/schritt\/step-2-6$/);
  await expect(page.locator('main h1')).toHaveText('2.6 Teilprojektleiter einsetzen');
  await expect(page.getByRole('heading', { name: 'Fachliche Aufgaben' })).toHaveCount(0);
  await expect(page.locator('main')).toContainText(
    'TM oder ILSM übernimmt das Teilprojekt; der PM behält lesenden Zugriff.',
  );
  await page.getByText('Fachliche Hinweise und Kontext', { exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Geltungsbereich', exact: true })).toBeVisible();
  await page.getByText('Beiträge und weitere Informationen', { exact: true }).click();
  await expect(page.locator('main a[href="#/bedienweg/procedure-owner-change"]')).toBeVisible();
  await page.locator('.work-aside').getByText('Weitere Quellenkontexte', { exact: true }).click();
  await expect(page.locator('main')).toContainText(
    'Nur der geübte Ablauf: benötigten Eigenzugriff sichern, dann Owner wechseln.',
  );
  await page.locator('.source-notes summary').click();
  for (const ref of model.getTask('fn-owner-change')!.sourceRefs ?? [])
    await expect(page.locator('.source-notes')).toContainText(ref);
  await expect(page.locator('main a[href="#/thema/R1-23"]')).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('task-step-details.png'), fullPage: true });
  const axe = await new AxeBuilder({ page }).analyze();
  expect(axe.violations).toEqual([]);
});

test('same-named task details appear inline and shared tasks keep each step procedure separate', async ({
  page,
}) => {
  await page.goto('/#/schritt/step-3-3');
  await expect(page.locator('main h1')).toHaveText('3.3 Weitere Projektmeilensteine planen');
  await expect(page.locator('main a[href="#/aufgabe/fn-external-milestones"]')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Fachliche Aufgaben' })).toHaveCount(0);
  await expect(
    page
      .locator('.page-title')
      .getByText(
        'Beistellungen und Genehmigungen als externe Meilensteine mit getrenntem Stichtag und Plantermin abbilden. Quellenbasierter Bedienentwurf für das Kundenprojekt.',
        { exact: true },
      ),
  ).toHaveCount(1);
  await expect(page.getByRole('heading', { name: 'Fachliche Hinweise', exact: true })).toHaveCount(
    0,
  );
  await page.getByText('Fachliche Hinweise und Kontext', { exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Geltungsbereich', exact: true })).toBeVisible();
  await expect(page.locator('main a[href="#/thema/R1-08"]')).toBeVisible();

  await page.goto('/#/schritt/step-2-8');
  await page.getByText('Beiträge und weitere Informationen', { exact: true }).click();
  await expect(page.locator('main a[href^="#/bedienweg/"]')).toHaveCount(1);
  await expect(
    page.locator('main a[href="#/bedienweg/procedure-system-master-data"]'),
  ).toBeVisible();
  await expect(page.locator('.materials .procedure')).toHaveCount(1);
  await expect(page.locator('.materials .procedure')).toHaveAttribute(
    'id',
    'procedure-system-master-data',
  );
  await expect(page.locator('#procedure-ils-master-data')).toHaveCount(0);
  await expect(page.locator('#procedure-system-scope')).toHaveCount(0);
  await expect(page.locator('main')).toContainText(
    'System-Stammdaten sind mit dem Kundenprojekt vereinbar. Systemumfang ist gegenüber Kundenprojekt und angrenzenden Teilprojekten abgegrenzt.',
  );
  await page.goto('/#/schritt/step-2-11');
  await expect(page.locator('.materials .procedure')).toHaveCount(1);
  await expect(page.locator('.materials .procedure')).toHaveAttribute(
    'id',
    'procedure-permissions',
  );
  await expect(page.locator('#procedure-owner-change')).toHaveCount(0);
  await expect(page.locator('main')).toContainText(
    'Stakeholder erhalten die für ihre Aufgabe erforderlichen Einzelrechte.',
  );
  await expect(page.locator('main')).toContainText(
    'Arbeitsressourcen werden dem Projektteam zugeordnet; effektive Zugriffe sind gesondert zu prüfen.',
  );
  await page.getByText('Fachliche Hinweise und Kontext', { exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Quellenbezug R1', exact: true })).toBeVisible();
  await page.getByText('Beiträge und weitere Informationen', { exact: true }).click();
  await expect(
    page.locator('.materials a[href="#/artikel/guide-save-publish-checkin"]'),
  ).toBeVisible();
  await expect(page.locator('.limitations')).toContainText('Build');
  await page.goto('/#/aufgabe/fn-owner-change');
  await expect(page.locator('main h1')).toHaveText('Owner wechseln und Eigenzugriff erhalten');
  await page.getByText('Beiträge und weitere Informationen', { exact: true }).click();
  await expect(page.locator('main a[href="#/bedienweg/procedure-owner-change"]')).toBeVisible();
  await expect(page.locator('#procedure-owner-change .steps li').first()).toBeVisible();
});

test('master data prioritizes the procedure and keeps supplementary information collapsed', async ({
  page,
}, testInfo) => {
  if (testInfo.project.name === 'mobile') await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/#/aufgaben');
  await page.locator('.task-phase').filter({ hasText: 'Definition' }).locator('summary').click();
  await page.getByRole('link', { name: '2.1 Projektstammdaten anlegen' }).click();
  await expect(page.locator('.work-page > .page-title > p')).toHaveText(
    'Erfassen und prüfen Sie die Stammdaten Ihres Kundenprojekts auf der Seite Overview: Kurzbeschreibung, Klassifikationen, Referenzen und Projektbeginn.',
  );
  const primary = page.locator('.work-main');
  const supplementary = page.getByRole('complementary', { name: 'Ergänzende Informationen' });
  await expect(
    primary.getByRole('heading', { name: 'Voraussetzungen', exact: true }),
  ).toBeVisible();
  await expect(primary.getByRole('heading', { name: 'Bedienweg', exact: true })).toBeVisible();
  await expect(primary.getByRole('heading', { name: 'Ergebnis', exact: true })).toBeVisible();
  await expect(primary).toContainText('Entwurf · Geltung: Release 1');
  await expect(primary).toContainText('Contract Execution / L1');
  await expect(primary).not.toContainText('Project Purpose');
  await expect(primary).not.toContainText('Bestätigter Stand:');
  await expect(primary).not.toContainText('N28');
  await expect(supplementary.locator(':scope > details[open]')).toHaveCount(0);
  const contextToggle = supplementary.getByText('Fachliche Hinweise und Kontext', { exact: true });
  const questionsToggle = supplementary.locator('.work-open-points > summary');
  await expect(questionsToggle).toHaveText('Offene Punkte (8)');
  await expect(
    page.getByRole('heading', { name: 'Gemeldete Änderung: Project Purpose' }),
  ).toBeHidden();
  await expect(page.locator('.limitations')).toBeHidden();
  const primaryBox = (await primary.boundingBox())!;
  const supplementaryBox = (await supplementary.boundingBox())!;
  if (testInfo.project.name === 'desktop') {
    expect(supplementaryBox.x).toBeGreaterThanOrEqual(primaryBox.x + primaryBox.width);
    expect(supplementaryBox.y).toBe(primaryBox.y);
  } else {
    expect(supplementaryBox.y).toBeGreaterThanOrEqual(primaryBox.y + primaryBox.height);
  }
  await page.screenshot({ path: testInfo.outputPath('master-data-step.png'), fullPage: true });
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await contextToggle.focus();
  await page.keyboard.press('Enter');
  const scope = page.locator('.work-details .content-section').filter({
    has: page.getByRole('heading', { name: 'Geltungsbereich', exact: true }),
  });
  const confirmed = page.locator('.work-details .content-section').filter({
    has: page.getByRole('heading', { name: 'Bestätigter Stand: Start Date und EDC' }),
  });
  const reported = page.locator('.work-details .content-section').filter({
    has: page.getByRole('heading', { name: 'Gemeldete Änderung: Project Purpose' }),
  });
  await expect(scope).toContainText('Contract Execution; L1; PDP Overview');
  await expect(scope).toContainText('quellenbasierter Entwurf');
  await expect(confirmed).toContainText('23.09.2026');
  await expect(confirmed).toContainText('Diese Kopplungsfrage ist geklärt');
  await expect(confirmed).not.toContainText('FIN-/SAP');
  await expect(reported).toContainText('28.09.2026');
  await expect(reported).toContainText('Prüfunterlagen liegen hier nicht vor');
  await expect(reported).toBeVisible();
  await questionsToggle.focus();
  await expect(questionsToggle).toHaveCSS('outline-color', 'rgb(56, 99, 229)');
  await page.keyboard.press('Enter');
  const questions = page.locator('.limitations');
  await expect(questions).toBeVisible();
  await expect(questions.getByRole('heading')).toHaveText('Offene Klärungen vor Anwendung');
  for (const subject of [
    'Speichern auf Overview:',
    'Bestandsprojekte:',
    'Freigabe und Erprobung:',
    'Start Date:',
    'EDC als vertraglicher Starttermin:',
    'Zusätzliches EDC-Feld auf Contract',
    'Project Purpose (N28 / TTT-D-20):',
    'Schulungsumgebung und Client-Voraussetzungen prüfen:',
  ])
    await expect(questions.locator('li').filter({ hasText: subject })).toHaveCount(1);
  await expect(questions).not.toContainText('FIN-/SAP-Felder sind bereits korrigiert');
  await expect(questions).not.toContainText('Objectives-Zielklassen');
  await expect(scope).toBeVisible();
  await expect(confirmed).toBeVisible();
  const sourceContext = page
    .locator('.work-aside')
    .getByText('Weitere Quellenkontexte', { exact: true });
  await expect(sourceContext.locator('..')).not.toHaveAttribute('open');
  await sourceContext.focus();
  await page.keyboard.press('Enter');
  await expect(
    page.getByRole('heading', { name: 'Begrenzter Quellenstand: technical' }),
  ).toBeVisible();
  await page.keyboard.press('Enter');
  const { loadModel } = await import('./model');
  const model = await loadModel();
  const procedure = model.getProcedure('procedure-project-master-data')!;
  const inlineProcedure = page.locator('.materials #procedure-project-master-data');
  await expect(inlineProcedure).toBeVisible();
  await expect(
    inlineProcedure.getByText('PWA / Project Center / PDP Overview', { exact: true }),
  ).toHaveCount(1);
  await expect(page.locator('.materials .procedure')).toHaveCount(1);
  await expect(
    inlineProcedure.getByRole('heading', { name: 'Voraussetzungen', exact: true }),
  ).toBeVisible();
  await expect(
    inlineProcedure.getByRole('heading', { name: 'Bedienweg', exact: true }),
  ).toBeVisible();
  await expect(
    inlineProcedure.getByRole('heading', { name: 'Ergebnis', exact: true }),
  ).toBeVisible();
  expect(await inlineProcedure.locator('.steps li > p:first-child').allTextContents()).toEqual(
    procedure.actions.map((action) => action.text),
  );
  for (const expected of [
    ...procedure.prerequisites,
    ...procedure.expectedResults,
    ...procedure.checkQuestions!,
  ])
    await expect(inlineProcedure).toContainText(expected);
  expect(
    await inlineProcedure.locator(':scope > ul').last().locator('li').allTextContents(),
  ).toEqual([...new Set([...procedure.expectedResults, ...procedure.checkQuestions!])]);
  await supplementary.getByText('Beiträge und weitere Informationen', { exact: true }).click();
  const mirroredArticle = page.locator('.material-content');
  await expect(mirroredArticle).not.toHaveAttribute('open');
  await mirroredArticle.locator(':scope > summary').focus();
  await page.keyboard.press('Enter');
  await expect(
    mirroredArticle.getByRole('heading', { name: 'Ergebnisprüfung nach dem Speichern' }),
  ).toBeVisible();
  await expect(page).toHaveURL(/#\/schritt\/step-2-1$/);
  await page.keyboard.press('Enter');
  await expect(mirroredArticle).not.toHaveAttribute('open');
  await contextToggle.click();
  await questionsToggle.click();
  await expect(questions).toBeHidden();
  await expect(
    inlineProcedure.getByRole('heading', { name: 'Bedienweg', exact: true }),
  ).toBeVisible();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  ).toBeTruthy();

  await page.locator('.materials a[href="#/artikel/guide-project-master-data"]').click();
  await expect(page.locator('main .status')).toHaveText('Entwurf');
  await expect(
    page.getByRole('heading', { name: 'Geltungsbereich dieses Beitrags' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Bestätigter Stand: Start Date und EDC' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Gemeldete Änderung: Project Purpose' }),
  ).toBeVisible();
  await expect(
    page.locator('.limitations li').filter({ hasText: 'Zusätzliches EDC-Feld auf Contract' }),
  ).toHaveCount(1);
  await expect(page.locator('.limitations')).toContainText('Speichern auf Overview:');
  await expect(page.locator('.limitations')).not.toContainText('Objectives-Zielklassen');
  expect(
    await page
      .locator('.limitations')
      .evaluate((element) =>
        Boolean(
          element.compareDocumentPosition(document.querySelector('.procedure')!) &
          Node.DOCUMENT_POSITION_FOLLOWING,
        ),
      ),
  ).toBeTruthy();
  await expect(
    page.getByText('Optionales Übungsbeispiel', { exact: true }).locator('..'),
  ).not.toHaveAttribute('open');
  await page.screenshot({ path: testInfo.outputPath('master-data-article.png'), fullPage: true });
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  ).toBeTruthy();
});

test('task search finds linked work across role contexts and resets empty results', async ({
  page,
}, testInfo) => {
  await page.goto('/#/aufgaben');
  const search = page.getByRole('searchbox', { name: 'Aufgaben durchsuchen' });
  await search.fill('Operative Teammitglieder zuordnen');
  await expect(page).toHaveURL(/#\/aufgaben$/);
  const links = page.locator('.task-step-link');
  expect(await links.evaluateAll((items) => items.map((a) => a.getAttribute('href')))).toEqual([
    '#/schritt/step-2-7',
    '#/schritt/step-2-11',
    '#/schritt/step-2-15',
  ]);
  for (const link of await links.all()) await expect(link).toBeVisible();
  await page.getByRole('combobox', { name: 'Verantwortliche Rolle' }).selectOption('tm');
  await expect(links).toHaveCount(1);
  await expect(links).toHaveAttribute('href', '#/schritt/step-2-11');
  await expect(page.getByRole('status')).toHaveText('1 Prozessschritt');
  await page.screenshot({ path: testInfo.outputPath('tasks-filtered.png'), fullPage: true });
  await search.fill('KeinTreffer12345');
  await expect(links).toHaveCount(0);
  await expect(page.locator('main')).toContainText('Keine passende Aufgabe gefunden.');
  await page.getByRole('button', { name: 'Filter zurücksetzen' }).click();
  await expect(search).toHaveValue('');
  await expect(page.getByRole('combobox', { name: 'Verantwortliche Rolle' })).toHaveValue('');
  await expect(links).toHaveCount(52);
  await expect(page.locator('.task-independent-link')).toHaveCount(2);
  await search.fill('2.10');
  await expect(page.locator('a[href="#/schritt/step-2-10"]')).toBeVisible();
  await page.getByRole('button', { name: 'Filter zurücksetzen' }).click();
  await search.fill('Reviewstatus pflegen');
  await expect(
    page.locator('a.task-independent-link[href="#/aufgabe/task-review-status"]'),
  ).toBeVisible();
});

test('task overview and expanded results remain accessible at 360px and with enlarged text', async ({
  page,
}) => {
  await page.goto('/#/aufgaben');
  const axe = await new AxeBuilder({ page }).analyze();
  expect(axe.violations).toEqual([]);
  await page.setViewportSize({ width: 360, height: 800 });
  await page.getByRole('combobox', { name: 'Verantwortliche Rolle' }).selectOption('pm');
  await page.addStyleTag({
    content:
      '.tasks-page { font-size: 36px; } .task-step-link, .task-independent-link { font-size: 32px; } .task-meta { font-size: 28px; }',
  });
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  ).toBeTruthy();
  const secondAxe = await new AxeBuilder({ page }).analyze();
  expect(secondAxe.violations).toEqual([]);
});

test('role overview stays compact and opens a distinct profile with keyboard navigation', async ({
  page,
}, testInfo) => {
  await page.goto('/#/rollen');
  const cards = page.locator('.role-card');
  await expect(cards).toHaveCount(4);
  await expect(page.locator('main a[href^="#/schritt/"]')).toHaveCount(0);
  await expect(page.locator('main a[href^="#/artikel/"]')).toHaveCount(0);
  await expect(cards.first()).toBeInViewport();
  if (testInfo.project.name === 'desktop') await expect(cards.last()).toBeInViewport();
  await page.screenshot({ path: testInfo.outputPath('roles-overview.png'), fullPage: true });

  const pm = page.getByRole('link', { name: 'Projektmanager (PM)', exact: true });
  await pm.focus();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');
  await expect(pm).toBeFocused();
  await expect(pm).toHaveCSS('outline-color', 'rgb(56, 99, 229)');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#\/rollen\/pm$/);
  await expect(page.locator('main h1')).toHaveText('Projektmanager (PM)');
  await expect(page.locator('main')).toBeFocused();
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await expect(page).toHaveTitle('Projektmanager (PM) · iPPM Knowledge & Training Center');
  await expect(
    page.getByRole('navigation', { name: 'Rolle wechseln' }).locator('[aria-current="page"]'),
  ).toHaveAccessibleName('Projektmanager (PM)');
  if (testInfo.project.name === 'mobile') {
    for (const width of [360, 390]) {
      await page.setViewportSize({ width, height: 844 });
      const buttons = page.locator('.role-content-switch button');
      const stepsBounds = (await buttons.nth(0).boundingBox())!;
      const knowledgeBounds = (await buttons.nth(1).boundingBox())!;
      expect(Math.abs(stepsBounds.y - knowledgeBounds.y)).toBeLessThan(1);
    }
  }
  await page.screenshot({ path: testInfo.outputPath('role-pm.png'), fullPage: true });

  await page
    .getByRole('navigation', { name: 'Rolle wechseln' })
    .getByRole('link', { name: 'Project Management Office (PMO)', exact: true })
    .click();
  await expect(page.locator('main h1')).toHaveText('Project Management Office (PMO)');
  await page.goBack();
  await expect(page.locator('main h1')).toHaveText('Projektmanager (PM)');
  await page.getByRole('link', { name: 'Alle Rollen', exact: true }).click();
  await expect(page.locator('main h1')).toHaveText('Rollen');
  await expect(cards).toHaveCount(4);
});

test('role content retains every canonical assignment and the selected knowledge view', async ({
  page,
}) => {
  const { loadModel } = await import('./model');
  const model = await loadModel();
  for (const role of model.content.roles) {
    const view = model.getRoleView(role.id);
    await page.goto('/#/rollen/' + role.id);
    await expect(page.locator('main h1')).toHaveText(role.label);
    const stepLinks = page.locator('main a[href^="#/schritt/"]');
    expect(
      await stepLinks.evaluateAll((links) => links.map((a) => a.getAttribute('href')).sort()),
    ).toEqual(view.steps.map((s) => '#/schritt/' + s.id).sort());
    await expect(page.locator('.role-phase[open]')).toHaveCount(1);
    for (const phase of await page.locator('.role-phase').all()) {
      const summary = phase.locator('summary');
      if ((await phase.getAttribute('open')) === null) {
        await summary.focus();
        await page.keyboard.press('Enter');
      }
      for (const link of await phase.getByRole('link').all()) await expect(link).toBeVisible();
    }

    const knowledge = page.getByRole('button', { name: `Wissen (${view.articles.length})` });
    await knowledge.focus();
    await page.keyboard.press('Space');
    await expect(knowledge).toHaveAttribute('aria-pressed', 'true');
    await expect(page).toHaveURL(/bereich=wissen/);
    const articles = page.locator('main a[href^="#/artikel/"]');
    expect(
      await articles.evaluateAll((links) => links.map((a) => a.getAttribute('href')).sort()),
    ).toEqual(view.articles.map((a) => '#/artikel/' + a.id).sort());
    for (const article of view.articles)
      await expect(page.locator(`main a[href="#/artikel/${article.id}"]`)).toContainText(
        model.statusLabels[article.status],
      );
    await expect(stepLinks).toHaveCount(0);
    await page.reload();
    await expect(knowledge).toHaveAttribute('aria-pressed', 'true');
    await expect(articles).toHaveCount(view.articles.length);
    await page.getByRole('button', { name: `Prozessschritte (${view.steps.length})` }).click();
    await expect(page).not.toHaveURL(/bereich=/);
    await expect(stepLinks).toHaveCount(view.steps.length);
  }
});

test('unknown role offers a clear return to the role overview', async ({ page }) => {
  await page.goto('/#/rollen/unbekannt');
  await expect(page.locator('main h1')).toHaveText('Rolle nicht gefunden');
  await page.getByRole('link', { name: 'Alle Rollen', exact: true }).click();
  await expect(page.locator('.role-card')).toHaveCount(4);
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
  '/#/aufgaben',
  '/#/wissen',
  '/#/prozesse',
  '/#/rollen',
  '/#/rollen/pm',
  '/#/rollen/pmo',
  '/#/rollen/tm',
  '/#/rollen/ilsm',
  '/#/rollen/pm?bereich=wissen',
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
  const initialTooltip = page.locator(`[id="${await initial.getAttribute('aria-describedby')}"]`);
  await initial.hover();
  await expect(initialTooltip).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(initialTooltip).toBeHidden();
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

test('hover tooltip follows the pointer, stays reachable and leaves connections uncovered', async ({
  page,
}, testInfo) => {
  await page.goto('/#/prozesse/projektabwicklung?ansicht=karte');
  const card = page.locator('#process-card-step-2-2');
  const tooltip = page.locator(`[id="${await card.getAttribute('aria-describedby')}"]`);
  const summary = page.locator('.swimlane-item').filter({ has: card }).locator('summary');
  for (const expanded of [false, true]) {
    if (expanded) await summary.click();
    await card.scrollIntoViewIfNeeded();
    const cardBounds = (await card.boundingBox())!;
    await card.hover({ position: { x: 20, y: cardBounds.height / 2 } });
    await expect(card).not.toBeFocused();
    await expect(tooltip).toBeVisible();
    const initialBounds = (await tooltip.boundingBox())!;
    await page.mouse.move(cardBounds.x + 40, cardBounds.y + cardBounds.height / 2 + 20);
    const movedBounds = (await tooltip.boundingBox())!;
    // Mouse coordinates are rounded to CSS pixels by the browser.
    expect(Math.abs(movedBounds.y - initialBounds.y - 20)).toBeLessThanOrEqual(1);
    expect(Math.abs(movedBounds.x - initialBounds.x - 20)).toBeLessThanOrEqual(1);
    await page.mouse.move(cardBounds.x + 20, cardBounds.y + cardBounds.height - 2);
    const tooltipBounds = (await tooltip.boundingBox())!;
    const summaryBounds = (await summary.boundingBox())!;
    expect(tooltipBounds.y + tooltipBounds.height).toBeLessThan(summaryBounds.y);
    const viewport = page.viewportSize()!;
    expect(tooltipBounds.x).toBeGreaterThanOrEqual(0);
    expect(tooltipBounds.y).toBeGreaterThanOrEqual(0);
    expect(tooltipBounds.x + tooltipBounds.width).toBeLessThanOrEqual(viewport.width);
    expect(tooltipBounds.y + tooltipBounds.height).toBeLessThanOrEqual(viewport.height);
    // The preview can still be hovered across the gap without disappearing.
    await page.mouse.move(tooltipBounds.x + 20, tooltipBounds.y + tooltipBounds.height - 4, {
      steps: 4,
    });
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
    await summary.hover();
    await expect(tooltip).toBeHidden();
    await page.mouse.move(0, 0);
  }
  const longCard = page.locator('#process-card-step-1-1');
  await longCard.hover();
  const longTooltip = page.locator(`[id="${await longCard.getAttribute('aria-describedby')}"]`);
  await expect(longTooltip).toBeVisible();
  const preview = await longTooltip.locator('p').first().textContent();
  expect(preview!.length).toBeLessThanOrEqual(160);
  expect(preview).toMatch(/…$/);
  expect((await longTooltip.boundingBox())!.height).toBeLessThanOrEqual(180);
  const bounds = (await longCard.boundingBox())!;
  await longCard.hover({ position: { x: bounds.width - 2, y: 2 } });
  const edgeBounds = (await longTooltip.boundingBox())!;
  expect(edgeBounds.x).toBeGreaterThanOrEqual(0);
  expect(edgeBounds.y).toBeGreaterThanOrEqual(0);
  expect(edgeBounds.x + edgeBounds.width).toBeLessThanOrEqual(page.viewportSize()!.width);
  expect(edgeBounds.y + edgeBounds.height).toBeLessThanOrEqual(page.viewportSize()!.height);
});
