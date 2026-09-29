import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { articles } from '../src/data/content';
import { knowledgeFor } from '../src/lib/knowledge';

const guideId = 'guide-project-permissions';
const ownerProcedureId = 'procedure-owner-change';

test('PM reaches a complete owner guide before stakeholder, training and evidence details', async ({
  page,
}, testInfo) => {
  await page.goto(`/#/artikel/${guideId}`);
  const jumps = page.getByRole('navigation', { name: 'Direkt zu den Abschnitten' });
  const start = jumps.getByRole('button').first();
  await expect(start).toHaveText('Owner-Wechsel: Quick Guide');
  await expect(start).toBeInViewport();
  await start.focus();
  await page.keyboard.press('Enter');
  const quickGuide = page.locator(`#${ownerProcedureId}`);
  await expect(quickGuide).toBeFocused();
  await expect(quickGuide.getByRole('heading').first()).toBeInViewport();
  const guide = articles.find((article) => article.id === guideId)!;
  const procedure = guide.knowledge!.procedures.find((p) => p.id === ownerProcedureId)!;
  for (const text of [
    ...procedure.prerequisites,
    ...procedure.requiredRights!,
    ...procedure.actions.map((a) => a.text),
    ...procedure.expectedResults,
    ...procedure.checkQuestions,
  ]) {
    await expect(quickGuide).toContainText(text);
  }
  await expect(quickGuide.locator('ol.steps > li')).toHaveCount(4);
  await expect(quickGuide.locator('details, input, textarea, select')).toHaveCount(0);
  await expect(quickGuide).toContainText('Bestands-Sites sind nicht pauschal bestätigt');
  await expect(page.locator('.knowledge-procedure').first()).toHaveAttribute(
    'id',
    ownerProcedureId,
  );
  expect(
    await page.evaluate(() => {
      const end = document.querySelector('#ergebnispruefung')!;
      return ['procedure-permissions', 'owner-learning', 'nachweise'].every((id) =>
        Boolean(
          end.compareDocumentPosition(document.getElementById(id)!) &
          Node.DOCUMENT_POSITION_FOLLOWING,
        ),
      );
    }),
  ).toBe(true);
  await expect(page.locator('#owner-learning details[open]')).toHaveCount(0);
  await quickGuide.screenshot({ path: testInfo.outputPath('quick-guide.png') });
  await jumps.getByRole('button', { name: 'Kritische Einschränkungen', exact: true }).click();
  await expect(page.locator('#einschraenkungen')).toBeFocused();
  await expect(page.locator('#einschraenkungen h3')).toHaveCount(knowledgeFor(guide).issues.length);
  await expect(page.locator('#einschraenkungen h3').first()).toBeVisible();
  await jumps.getByRole('button', { name: 'Nachweise', exact: true }).click();
  await page.getByText('Technischer Nachweis, TTT und Beschreibungsstand', { exact: true }).click();
  const assessments = page
    .locator('#nachweise details')
    .filter({ hasText: 'Technischer Nachweis, TTT und Beschreibungsstand' });
  await expect(assessments.locator('li')).toHaveCount(knowledgeFor(guide).assessments.length);
  for (const item of await assessments.locator('li > strong').allTextContents()) {
    expect(item.trim()).toMatch(/^\S.+ · .+: \S/);
  }
  await expect(page.locator('#fachlicher-kontext')).toContainText('R1-23');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('owner package is searchable, readable and keyboard reachable with bounded evidence', async ({
  page,
}, testInfo) => {
  for (const query of ['Use Case Owner', 'Übung ohne System', 'Arbeitsplatz-Tipp']) {
    await page.goto('/#/wissen');
    await page.getByLabel('Wissensbasis durchsuchen').fill(query);
    await page.getByRole('button', { name: 'Suchen', exact: true }).click();
    const guide = page.locator('.article-card').filter({
      has: page.getByRole('link', {
        name: 'Zugriffsrechte festlegen und Owner wechseln',
        exact: true,
      }),
    });
    await expect(guide).toHaveCount(1);
    await guide
      .getByRole('link', {
        name: 'Zugriffsrechte festlegen und Owner wechseln',
        exact: true,
      })
      .click();
    await expect(page).toHaveURL(new RegExp(`${guideId}$`));
  }
  await expect(page.locator(`#${ownerProcedureId}`)).toContainText('Quick Guide');
  await expect(page.locator('.demo-note')).toHaveText(
    'Quellenbasierter Entwurf · Fachlich nicht freigegeben',
  );
  const toc = page.getByRole('navigation', { name: 'Inhaltsverzeichnis', exact: true });
  for (const [title, expected] of [
    ['Paket und Gültigkeit', 'R1B bis R4b sind nicht nachgewiesen'],
    ['Use Case:', 'B §3.6.7'],
    ['Schulung und Übung:', 'Didaktischer Vorschlag'],
    ['Übung ohne System:', 'kein nachgewiesener Systemzugriff'],
    ['Lernkontrolle:', 'ist das erwartete Ergebnis noch nicht bestätigt'],
    ['Arbeitsplatz-Tipp', 'Empfehlung für die persönliche Arbeitsweise'],
  ]) {
    await toc.getByRole('button', { name: new RegExp(title) }).focus();
    await page.keyboard.press('Enter');
    const section = page
      .locator('section')
      .filter({
        has: page.getByRole('heading', { level: 3, name: new RegExp(title) }),
      })
      .last();
    await expect(section).toBeFocused();
    await expect(section).toContainText(expected);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page
    .locator('section')
    .filter({
      has: page.getByRole('heading', { level: 3, name: /^Arbeitsplatz-Tipp:/ }),
    })
    .last()
    .screenshot({ path: testInfo.outputPath('owner-package.png') });
  await toc.getByRole('button', { name: 'Für Trainer', exact: true }).click();
  await page.locator('.owner-training summary').click();
  await expect(page.locator('.owner-training')).toContainText('fiktiv');
  await page.getByRole('button', { name: 'Beitrag merken', exact: true }).click();
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Aus Merkliste entfernen', exact: true }),
  ).toBeVisible();
  const source = page
    .locator('#quellen details')
    .filter({ has: page.locator('summary', { hasText: 'B · SB1-Handbuch' }) });
  await source.locator('summary').click();
  await expect(source).toContainText('§3.6.7');
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
      .violations,
  ).toEqual([]);
});

test('owner trainer package uses one existing procedure and keeps both fictional variants bounded', () => {
  const guide = articles.find((article) => article.id === guideId)!;
  const owner = guide.knowledge!.procedures.find((procedure) => procedure.id === ownerProcedureId)!;
  const plan = guide.knowledge!.trainer.ownerChange!;

  expect(guide.status).toBe('source-draft');
  expect(guide.reviews).toEqual([]);
  expect(guide.revisions.map((revision) => revision.number)).toEqual([1, 2, 3, 4, 5]);
  expect(plan.procedureId).toBe(owner.id);
  expect(
    guide.knowledge!.procedures.filter((procedure) => procedure.id === ownerProcedureId),
  ).toHaveLength(1);
  expect(owner.requiredRights).toEqual([
    'Open the project',
    'View the Project Summary in the Project Center',
    'View the Project Schedule Details',
    'View the Project Site',
  ]);
  expect(plan.customerProject).toContain('fiktiv');
  expect(plan.pmAccount).toBe(plan.currentOwner);
  expect(plan.variants.map((variant) => variant.id)).toEqual(['tm', 'ilsm']);
  expect(plan.variants.map((variant) => variant.targetAccount)).toEqual(['TM-Übung', 'ILSM-Übung']);
  for (const variant of plan.variants) {
    expect(variant.subproject).toContain('fiktiv');
    expect(variant.targetAccount).not.toBe(plan.pmAccount);
    expect(variant.plannedOwner).toBe(variant.targetAccount);
    expect(variant.plannedSubprojects).toBe(variant.targetAccount);
  }
  expect(plan.prechecks.join(' ')).toContain('Project Site');
  expect(plan.prechecks.join(' ')).toContain('Bearbeitungsrechte');
  expect(plan.prechecks.join(' ')).toContain('Zielkonto');
  expect(plan.prechecks.join(' ')).toContain('Rücksetzweg');
  expect(plan.resetCheck).toContain('nicht belegt');
  expect(plan.resetCheck).not.toMatch(/Reset-Funktion ist verfügbar/i);
  expect(knowledgeFor(guide).issues.map((issue) => issue.id)).toEqual(
    expect.arrayContaining([
      'issue-build-sync',
      'issue-f-r1-open-07',
      'issue-f-r1-open-02',
      'issue-f-r1-open-12',
    ]),
  );
  expect(
    articles.find((article) => article.id === 'faq-role-vs-access')?.knowledge?.trainer.ownerChange,
  ).toBeUndefined();
});

test('trainer can prepare rights and evaluate TM and ILSM separately without changing open issues', async ({
  page,
}) => {
  await page.goto(`/#/artikel/${guideId}`);
  const before = await page.evaluate(() => localStorage.getItem('ippm-learning-v1'));
  const trainer = page.locator('.owner-training');
  await trainer.locator('summary').click();
  await expect(trainer).toContainText('KP-Übung-01 (fiktiv)');
  await expect(trainer).toContainText('Owner aktuell → geplant');
  await expect(trainer).toContainText('Subprojects aktuell → geplant');
  await expect(trainer).toContainText('PM-Übung → TM-Übung');
  await expect(trainer).toContainText('SYS-Übung-01 (fiktiv)');
  await expect(trainer.getByRole('checkbox')).toHaveCount(8);
  await expect(trainer.getByRole('checkbox', { name: /Rücksetzweg/ })).toBeVisible();
  for (const right of [
    'Open the project',
    'View the Project Summary in the Project Center',
    'View the Project Schedule Details',
    'View the Project Site',
  ]) {
    await expect(trainer.getByRole('checkbox', { name: right, exact: true })).toBeVisible();
  }
  await expect(trainer).toContainText('Bearbeitungsrechte');
  await expect(trainer).toContainText('Projekt- und Site-Sichtbarkeit');
  await expect(trainer.locator('ol.steps')).toHaveCount(0);

  await trainer.getByRole('checkbox', { name: 'Open the project', exact: true }).check();
  await trainer.getByLabel('Ist-Beobachtung PM-Konto').fill('PM sieht Plan und Site.');
  await trainer.getByLabel('Bewertung PM-Konto').selectOption('bestätigt');
  await trainer.getByLabel('Ist-Beobachtung Zielkonto').fill('TM sieht die Project Site nicht.');
  await trainer.getByLabel('Bewertung Zielkonto').selectOption('nicht bestätigt');
  await trainer.getByLabel('Umgebung und Systemstand').fill('Schulungssystem, Stand ungeklärt');
  await trainer.getByLabel('Abweichung').fill('Site-Zugriff des TM fehlt.');
  await trainer.getByLabel('Betroffenes offenes Issue').selectOption('issue-f-r1-open-02');
  await expect(trainer.getByLabel('Bewertung PM-Konto')).toHaveValue('bestätigt');
  await expect(trainer.getByLabel('Bewertung Zielkonto')).toHaveValue('nicht bestätigt');
  await expect(trainer.getByLabel('Betroffenes offenes Issue')).toHaveValue('issue-f-r1-open-02');

  await trainer.getByLabel('Variante').selectOption('ilsm');
  await expect(trainer).toContainText('ILS-Übung-01 (fiktiv)');
  await expect(trainer).toContainText('PM-Übung → ILSM-Übung');
  await expect(trainer.getByLabel('Ist-Beobachtung PM-Konto')).toHaveValue('');
  await expect(trainer.getByLabel('Bewertung PM-Konto')).toHaveValue('');
  await expect(
    trainer.getByRole('checkbox', { name: 'Open the project', exact: true }),
  ).not.toBeChecked();
  await trainer.getByLabel('Bewertung PM-Konto').selectOption('nicht prüfbar');
  await trainer.getByLabel('Bewertung Zielkonto').selectOption('bestätigt');
  await expect(trainer.getByLabel('Bewertung PM-Konto')).toHaveValue('nicht prüfbar');
  await expect(trainer.getByLabel('Bewertung Zielkonto')).toHaveValue('bestätigt');
  await expect(trainer).toContainText(
    'Auch eine bestätigte Beobachtung erledigt keine offenen Issues',
  );
  for (const issueId of [
    'issue-build-sync',
    'issue-f-r1-open-07',
    'issue-f-r1-open-02',
    'issue-f-r1-open-12',
  ]) {
    await expect(trainer).toContainText(issueId);
  }
  await expect(trainer).toContainText(
    'Eine Reset-Funktion oder erfolgreiche Rücksetzung ist durch die Quellen nicht belegt',
  );
  await expect(trainer.getByRole('button', { name: /reset|rücksetzen/i })).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem('ippm-learning-v1'))).toBe(before);

  await trainer.getByRole('button', { name: 'Zur bestehenden Owner-Wechsel-Prozedur' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator(`#${ownerProcedureId}`)).toBeFocused();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
  ).toBeTruthy();
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
      .violations,
  ).toEqual([]);
});
