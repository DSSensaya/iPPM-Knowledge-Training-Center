import { registerObject, shareOrigin } from '../lib/editorial-registry';
import type { EvidenceRef } from './domain';
import { inventorySource } from './inventory-source';
import { visibleArticles } from './content';
import { functions, processCatalog, processSteps } from './catalog';
import { sb1Coverage } from './sb1-coverage';
import type { ContentReadiness } from './content-readiness';

export interface InventorySource {
  id: string;
  title: string;
  kind: string;
  aliases: string[];
  context: string;
  relatedIds: string[];
  evidence: EvidenceRef[];
}
export interface InventoryEntry extends InventorySource {
  state: ContentReadiness;
  note: string;
  articleIds: string[];
}

// Explicit editorial mapping, not inferred from shared scope membership.
const functionMaterials: Record<string, string[]> = {
  'FS-01': ['guide-project-handover', 'guide-project-master-data'],
  'FS-02': ['guide-project-handover'],
  'FS-03a': [
    'guide-project-master-data',
    'guide-deliverables-milestones',
    'guide-project-objectives',
    'guide-project-organization',
    'guide-subproject-definition',
  ],
  'FS-03b': ['guide-deliverables-milestones'],
  'FS-04': ['guide-r1-reporting'],
  'FS-05': ['guide-r1-reporting'],
  'FS-06': ['guide-project-permissions'],
  'FS-07': ['guide-project-organization'],
  'FS-08': ['guide-project-permissions'],
  'FS-09': ['guide-deliverables-milestones', 'guide-external-milestones', 'guide-phases-tailoring'],
  'FS-11': ['guide-deliverables-milestones', 'guide-phases-tailoring'],
  'FS-13': ['guide-project-handover', 'guide-phases-tailoring'],
  'FS-14': ['guide-project-handover'],
  'FS-16': ['guide-phases-tailoring'],
  'FS-18': ['guide-deliverables-milestones'],
  'FS-23': ['guide-project-handover'],
  'FS-24': ['faq-role-vs-access', 'guide-project-permissions'],
  'FS-25': ['guide-escalation-capture'],
  'FS-26': ['guide-status-orientation'],
  'FS-27': ['guide-save-publish-checkin'],
};
const usableSteps = new Set(['2.2', '2.3', '2.5', '2.6', '3.1', '3.2']);
const usableProcedures = new Set([
  'procedure-owner-change',
  'procedure-deliverables',
  'procedure-payment-terms',
  'procedure-delivery-milestones',
  'procedure-payment-milestones',
  'procedure-save-deliverables-list',
  'procedure-save-payment-terms-pdp',
  'procedure-save-project-plan',
  'procedure-save-owner-change',
  'procedure-project-objectives',
  'procedure-r1-reporting',
]);
const missingNote = (entry: InventorySource) => {
  if (entry.id === 'step-5-1' || entry.id === 'FS-28')
    return 'Projektabschluss ist genannt, aber noch zu spezifizieren. Ablauf, Ergebnisprüfung und Release-Zuordnung fehlen.';
  if (entry.id === 'FS-29')
    return 'Eine formale Freigabequelle für die Informationsverarbeitung fehlt. Eine Trainererklärung ersetzt sie nicht.';
  if (entry.id === 'R1-18' || entry.id === 'FS-19')
    return 'Die Generator-Korrektur ist durch C23 Punkt 9 bestätigt. Ein vollständiger Center-Bedienweg ist damit nicht belegt; die Meldung N28 ersetzt die fehlenden Unterlagen nicht.';
  if (entry.id.startsWith('R1B'))
    return 'Planungsorientierung ist vorhanden. Für diese konkrete R1B-Funktion fehlen im Center Bedienweg, Voraussetzungen und Ergebnisprüfung; R1-Wege werden nicht übertragen.';
  if (entry.kind === 'Prozessschritt')
    return 'Aufgabe und Rolle sind katalogisiert. Ein zusammenhängender Bedienweg mit Voraussetzungen und Ergebnisprüfung für diesen Schritt fehlt im Center. SB2-Zuordnung ist kein Nachweis der Schulungsreife.';
  return 'Der Katalog benennt den Umfang. Ein zusammenhängender Center-Bedienweg mit Voraussetzungen und Ergebnisprüfung für diesen Umfang fehlt.';
};

const sourceEntries: InventoryEntry[] = inventorySource.map((entry) => {
  const number = entry.aliases[0];
  const coverage =
    entry.kind === 'Prozessschritt' ? sb1Coverage.find((row) => row.number === number) : undefined;
  let articleIds = coverage?.realMaterials.map((m) => m.articleId) ?? [];
  if (entry.kind === 'Funktionsnachweis') articleIds = functionMaterials[entry.id] ?? [];
  if (entry.kind === 'Scope')
    articleIds = visibleArticles
      .filter((a) =>
        a.knowledge?.functionIds.some((id) =>
          functions
            .find((f) => f.id === id)
            ?.scopeLinks.some((s) => s.scopeId === entry.id && s.coverage !== 'prerequisite'),
        ),
      )
      .map((a) => a.id);
  const usable =
    entry.kind === 'Prozessschritt'
      ? usableSteps.has(number)
      : ['FS-08', 'FS-27'].includes(entry.id);
  const state: ContentReadiness = usable
    ? 'Nutzbar'
    : articleIds.length
      ? 'Teilweise belegt'
      : 'Platzhalter';
  const note = coverage
    ? `${coverage.treatedScope} Offene Grenze: ${coverage.gap}`
    : usable
      ? 'Zusammenhängender, begrenzter Arbeitsweg im verknüpften Beitrag. Dessen Voraussetzungen, Einschränkungen und R1-Geltungsbereich beachten.'
      : articleIds.length
        ? 'Die verknüpften Beiträge behandeln Teilaspekte. Sie decken den gesamten Katalogumfang nicht ab; die konkreten Lücken stehen im jeweiligen Beitrag.'
        : missingNote(entry);
  // R1B orientation is a related reading, never an operational material upgrade.
  if (entry.id.startsWith('R1B')) articleIds = ['ippm-release-2-scope'];
  return {
    ...entry,
    state,
    note,
    articleIds: [...new Set(articleIds)],
    relatedIds: [
      ...entry.relatedIds,
      ...(processSteps.find((s) => s.id === entry.id)?.functionIds ?? []),
    ],
  };
});

export const inventory: InventoryEntry[] = [
  ...sourceEntries,
  ...processCatalog.map((p) => ({
    ...p,
    kind: 'Prozess',
    aliases: [],
    context:
      'Projektabwicklung · fünf Phasen laut Prozessdiagramm; bestehender SB1-Ausschnitt bleibt erhalten.',
    relatedIds: sourceEntries.filter((e) => e.kind === 'Prozessschritt').map((e) => e.id),
    state: 'Teilweise belegt' as const,
    note: 'Einzelne Arbeitswege sind erschlossen. Der vollständige Prozess einschließlich SB2 und Abschluss ist nicht als Bedienweg belegt.',
    articleIds: [],
  })),
  ...functions.map((f) => ({
    id: f.id,
    title: f.title,
    kind: 'Arbeitsaufgabe',
    aliases: f.aliases,
    context: f.outcome,
    relatedIds: f.scopeLinks.map((s) => s.scopeId),
    evidence: f.evidence,
    state: 'Teilweise belegt' as const,
    note: 'Die Aufgabe ist in begrenzten Beiträgen behandelt. Vollständigkeit über alle Rollen und Projektkontexte ist nicht belegt.',
    articleIds: visibleArticles
      .filter((a) => a.knowledge?.functionIds.includes(f.id))
      .map((a) => a.id),
  })),
  ...visibleArticles.flatMap((a) =>
    (a.knowledge?.procedures ?? []).map((p) => ({
      id: p.id,
      title: p.title,
      kind: 'Bedienweg / Use Case',
      aliases: [],
      context: p.trigger,
      relatedIds: functions.some((f) => f.id === p.functionId) ? [p.functionId] : [],
      evidence: p.evidence,
      state: (usableProcedures.has(p.id) ? 'Nutzbar' : 'Teilweise belegt') as ContentReadiness,
      note: usableProcedures.has(p.id)
        ? 'Voraussetzungen, Handlungsschritte und Ergebnisprüfung im verknüpften Beitrag. Geltungsbereich und Einschränkungen vor der Anwendung beachten.'
        : 'Ein begrenzter Bedienentwurf ist vorhanden. Offene Voraussetzungen und Ergebnisgrenzen stehen im verknüpften Beitrag.',
      articleIds: [a.id],
    })),
  ),
];

const noteOrigins = new Map<string, { id: string; value: { note: string } }>();
inventory.forEach((item) => {
  const coverage =
    item.kind === 'Prozessschritt'
      ? sb1Coverage.find((row) => row.number === item.aliases[0])
      : undefined;
  if (coverage) {
    Object.defineProperty(item, 'note', {
      enumerable: true,
      get: () => `${coverage.treatedScope} Offene Grenze: ${coverage.gap}`,
    });
    return;
  }
  let origin = noteOrigins.get(item.note);
  if (!origin) {
    const id = `inventory-note:${item.id}`,
      value = { note: item.note };
    registerObject(id, value, ['note'], 'src/data/inventory.ts');
    origin = { id, value };
    noteOrigins.set(item.note, origin);
  }
  shareOrigin(item, origin.value, origin.id);
});

export function refreshInventory() {
  for (const entry of inventory) {
    const fn = functions.find((item) => item.id === entry.id);
    const process = processCatalog.find((item) => item.id === entry.id);
    const procedure = visibleArticles
      .flatMap((item) => item.knowledge?.procedures ?? [])
      .find((item) => item.id === entry.id);
    if (fn) {
      entry.title = fn.title;
      entry.context = fn.outcome;
      entry.aliases = fn.aliases;
    }
    if (process) entry.title = process.title;
    if (procedure) {
      entry.title = procedure.title;
      entry.context = procedure.trigger;
    }
  }
}
refreshInventory();
