import type {
  Assessment,
  FunctionDefinition,
  Issue,
  KnowledgeLink,
  ProcessStep,
  ReleaseAssignment,
  RoleId,
  ScopeItem,
  TrainingAssignment,
} from './domain';
import { evidence as e } from './sources';
import {
  definitionScope,
  definitionFunctions,
  definitionSteps,
  definitionIssues,
  definitionAssessments,
  definitionTraining,
} from './definition-catalog';
import { definitionViews } from './definition-content';
import {
  controlScope,
  controlFunctions,
  controlSteps,
  controlIssues,
  controlAssessments,
  controlViews,
} from './control-content';

export const roleCatalog: {
  id: RoleId;
  label: string;
  aliases: string[];
  responsibility: string;
}[] = [
  {
    id: 'pm',
    label: 'Projektmanager (PM)',
    aliases: ['PM', 'Project Manager'],
    responsibility: 'Kundenprojekt; Übergabe der Teilprojekte',
  },
  {
    id: 'pmo',
    label: 'Project Management Office (PMO)',
    aliases: ['PMO', 'PMO Member'],
    responsibility: 'Projektumgebung bereitstellen und Struktur prüfen',
  },
  {
    id: 'tm',
    label: 'Technical Manager (TM)',
    aliases: ['TM', 'System-Teilprojektleitung'],
    responsibility: 'System-Teilprojekt',
  },
  {
    id: 'ilsm',
    label: 'ILS Manager (ILSM)',
    aliases: ['ILSM', 'ILS-Teilprojektleitung'],
    responsibility: 'ILS-Teilprojekt',
  },
];
export const roleLabel = (id: string) => roleCatalog.find((r) => r.id === id)?.label ?? id;

export const processCatalog = [
  {
    id: 'projektabwicklung',
    title: 'Projektabwicklung – Ausschnitte Definition und Planung',
    evidence: e('B', '§3.5 Fachlicher Soll-Ablauf; §3.6.6 / §3.6.7; §3.8.4 / §3.9.4'),
  },
];

export const releases = [{ id: 'release-1', title: 'Release 1' }];
export const stages = [
  { id: 'R1', releaseId: 'release-1' },
  { id: 'R1B', releaseId: 'release-1' },
];
export const scopeItems: ScopeItem[] = [
  ...controlScope,
  ...definitionScope,
  {
    id: 'R1-03',
    title: 'Projektinformationen, Scope und eingebettete Project-Site-Listen',
    evidence: e('S', '02_SCOPE_ID_MASTER!A4:L4', 'R1-03'),
  },
  {
    id: 'R1-06',
    title: 'Einzelberechtigungen (Project Permissions)',
    evidence: e('S', '02_SCOPE_ID_MASTER!A7:L7', 'R1-06'),
  },
  {
    id: 'R1-07',
    title: 'Projektkernteam mit Projekt- und Prozessrolle in PDP hinterlegt',
    evidence: e('S', '02_SCOPE_ID_MASTER!A8:L8', 'R1-07'),
  },
  {
    id: 'R1-23',
    title: 'Rollenprofile und Berechtigungskonzept',
    evidence: e('S', '02_SCOPE_ID_MASTER!A24:L24', 'R1-23'),
  },
  {
    id: 'R1-08',
    title: 'Liefer-, Zahlungs- und weitere Meilensteine sowie Reviews',
    evidence: e('S', '02_SCOPE_ID_MASTER!A9:L9', 'R1-08'),
  },
  {
    id: 'R1-10',
    title: 'Ansicht 10 Phasen- und Meilensteinplan im MS Project Client',
    evidence: e('S', '02_SCOPE_ID_MASTER!A11:L11', 'R1-10'),
  },
];
const context = {
  projectTypes: ['Contract Execution', 'System Delivery', 'ILS Delivery'],
  levels: ['L1', 'L2', 'L3 nur bei passendem System-Teilprojekt'],
  tools: ['PWA', 'Project Center', 'Project Permissions', 'Project Site'],
  environment: null,
};
export const functions: FunctionDefinition[] = [
  ...controlFunctions,
  ...definitionFunctions,
  {
    id: 'fn-deliverables',
    title: 'Liefergegenstände einzeln erfassen',
    outcome:
      'Der vereinbarte Projektumfang und die einzelnen Liefergegenstände sind für die Terminplanung nachvollziehbar.',
    aliases: ['List of Deliverables', 'PDP Scope', 'Liefergegenstand'],
    roleIds: ['pm'],
    context: {
      projectTypes: ['Contract Execution'],
      levels: ['L1'],
      tools: ['PWA', 'PDP Scope', 'List of Deliverables'],
      environment: null,
    },
    scopeLinks: [
      {
        scopeId: 'R1-03',
        coverage: 'partial',
        evidence: e('S', '02_SCOPE_ID_MASTER!A4:L4', 'R1-03'),
      },
    ],
    evidence: e('B', '§3.6.2 Projektumfang festlegen'),
  },
  {
    id: 'fn-delivery-milestones',
    title: 'Liefermeilensteine planen',
    outcome:
      'Für relevante Liefergegenstände sind Plantermin, Stichtag und Meilensteintyp nachvollziehbar gepflegt.',
    aliases: ['Liefermeilenstein', 'Ext.Del', 'Stichtag', 'Ansicht 10'],
    roleIds: ['pm'],
    context: {
      projectTypes: ['Contract Execution'],
      levels: ['L1'],
      tools: ['MS Project Client', 'Ansicht 10 Phasen- und Meilensteinplan'],
      environment: null,
    },
    scopeLinks: [
      {
        scopeId: 'R1-08',
        coverage: 'partial',
        evidence: e('F', 'R1 Funktionsmatrix!A14:J14', 'FS-09'),
      },
      {
        scopeId: 'R1-10',
        coverage: 'partial',
        evidence: e('F', 'R1 Funktionsmatrix!A16:J16', 'FS-11'),
      },
    ],
    evidence: e('B', '§4.5.2 Schritt-für-Schritt: Liefermeilensteine planen'),
  },
  {
    id: 'fn-payment-terms',
    title: 'Zahlungsbedingungen für die Planung erfassen',
    outcome: 'Zahlungsfristen und auslösende Bedingungen sind im Vertragskontext nachvollziehbar.',
    aliases: ['PDP Contract', 'Terms of Payment', 'Zahlungsfrist', 'Vertragsdaten'],
    roleIds: ['pm'],
    context: {
      projectTypes: ['Contract Execution'],
      levels: ['L1'],
      tools: ['PWA', 'PDP Contract'],
      environment: null,
    },
    scopeLinks: [
      {
        scopeId: 'R1-03',
        coverage: 'partial',
        evidence: e('S', '02_SCOPE_ID_MASTER!A4:L4', 'R1-03'),
      },
    ],
    evidence: e('B', '§3.6.3 Schritt-für-Schritt: Vertragsdaten einpflegen'),
  },
  {
    id: 'fn-payment-milestones',
    title: 'Zahlungsmeilensteine begründet planen',
    outcome:
      'Zahlungstermine sind mit Liefertermin und Zahlungsfrist oder mit einer begründeten direkten Terminierung hinterlegt.',
    aliases: ['Zahlungsmeilenstein', 'Ext.Pay', 'Terms of Payment', 'Ansicht 30'],
    roleIds: ['pm'],
    context: {
      projectTypes: ['Contract Execution'],
      levels: ['L1'],
      tools: ['PDP Contract', 'MS Project Client', 'Ansicht 10', 'Ansicht 30'],
      environment: null,
    },
    scopeLinks: [
      {
        scopeId: 'R1-08',
        coverage: 'partial',
        evidence: e('F', 'R1 Funktionsmatrix!A14:J14', 'FS-09'),
      },
    ],
    evidence: e(
      'B',
      '§3.6.3 Vertragsdaten einpflegen; §4.5.3 Schritt-für-Schritt: Zahlungsmeilensteine planen',
    ),
  },
  {
    id: 'fn-project-permissions',
    title: 'Zugriffsrechte gezielt vergeben',
    outcome: 'Stakeholder erhalten die für ihre Aufgabe erforderlichen Einzelrechte.',
    aliases: ['Project Permissions', 'Zugriffsrechte', 'Einzelberechtigungen'],
    roleIds: ['pm', 'tm', 'ilsm'],
    context,
    scopeLinks: [
      {
        scopeId: 'R1-06',
        coverage: 'whole',
        evidence: e('F', 'R1 Funktionsmatrix!A11:J11', 'FS-06'),
      },
      {
        scopeId: 'R1-23',
        coverage: 'partial',
        evidence: e('S', '02_SCOPE_ID_MASTER!A24:L24', 'R1-23', 'inferred'),
      },
    ],
    evidence: e('B', '§3.6.6 Zugriffsrechte festlegen; §3.8.4 / §3.9.4 Teilprojekt-Zugriff'),
  },
  {
    id: 'fn-owner-change',
    title: 'Owner wechseln und Eigenzugriff erhalten',
    outcome: 'TM oder ILSM übernimmt das Teilprojekt; der PM behält lesenden Zugriff.',
    aliases: ['Owner', 'Teilprojektleiter einsetzen', 'Owner-Wechsel'],
    roleIds: ['pm', 'tm', 'ilsm'],
    context: {
      ...context,
      projectTypes: ['System Delivery', 'ILS Delivery'],
      tools: [...context.tools, 'System Overview', 'ILS Overview', 'Organisation / Subprojects'],
    },
    scopeLinks: ['R1-06', 'R1-07', 'R1-23'].map((scopeId) => ({
      scopeId,
      coverage: 'partial',
      evidence: e('F', 'R1 Funktionsmatrix!A13:J13', 'FS-08'),
    })),
    evidence: e('B', '§3.6.7 Teilprojektleiter einsetzen'),
  },
  {
    id: 'fn-build-team',
    title: 'Operative Teammitglieder zuordnen',
    outcome:
      'Arbeitsressourcen werden dem Projektteam zugeordnet; effektive Zugriffe sind gesondert zu prüfen.',
    aliases: ['Build Team', 'Build a Team', 'Teamzuordnung'],
    roleIds: ['pm', 'tm', 'ilsm'],
    context: { ...context, tools: ['Build Team', 'PDP Organisation', 'Project Site'] },
    scopeLinks: [
      {
        scopeId: 'R1-23',
        coverage: 'partial',
        evidence: e('F', 'R1 Funktionsmatrix!A29:J29', 'FS-24', 'inferred'),
      },
    ],
    evidence: e('B', '§3.6.6 Zugriffsrechte festlegen; §3.8.4 / §3.9.4 Teilprojekt-Zugriff'),
  },
];
export const processSteps: ProcessStep[] = [
  ...controlSteps,
  ...definitionSteps,
  ...(
    [
      {
        number: '2.2',
        title: 'Projektumfang festlegen',
        phase: 'Definition',
        functionId: 'fn-deliverables',
        row: 6,
        section: '3.6.2',
        input:
          'PMO hat das Kundenprojekt bereitgestellt; Leistungsumfang und Liefergegenstände sind fachlich geklärt.',
        output: 'Scope und einzelne Liefergegenstände sind in der PDP Scope erfasst.',
      },
      {
        number: '2.5',
        title: 'Vertragsdaten einpflegen',
        phase: 'Definition',
        functionId: 'fn-payment-terms',
        row: 9,
        section: '3.6.3',
        input: 'Vereinbarte Zahlungsbedingungen und Vertragsangaben liegen vor.',
        output: 'Zahlungsbedingungen und Fristen sind in der PDP Contract nachvollziehbar.',
      },
      {
        number: '3.1',
        title: 'Liefermeilensteine planen',
        phase: 'Planung',
        functionId: 'fn-delivery-milestones',
        row: 20,
        section: '4.5.2',
        input:
          'Liefergegenstände sind in der List of Deliverables erfasst; Termine sind abgestimmt.',
        output: 'Liefermeilensteine sind zugeordnet, terminiert und klassifiziert.',
      },
      {
        number: '3.2',
        title: 'Zahlungsmeilensteine planen',
        phase: 'Planung',
        functionId: 'fn-payment-milestones',
        row: 21,
        section: '4.5.3',
        input:
          'Zahlungsbedingungen und Fristen liegen vor; begründende Liefermeilensteine sind geplant, soweit zutreffend.',
        output: 'Zahlungsmeilensteine sind verknüpft oder begründet direkt terminiert.',
      },
    ] as const
  ).map((s) => ({
    id: `step-${s.number.replace('.', '-')}`,
    processId: 'projektabwicklung',
    number: s.number,
    title: s.title,
    phase: s.phase,
    roleId: 'pm' as const,
    functionIds: [s.functionId],
    input: s.input,
    output: s.output,
    evidence: [
      ...e('T', `Release1-Matrix!A${s.row}:Q${s.row}`, s.number),
      ...e('B', `§${s.section} ${s.title}`),
    ],
  })),
  {
    id: 'step-2-6',
    processId: 'projektabwicklung',
    number: '2.6',
    title: 'Teilprojektleiter einsetzen',
    phase: 'Definition',
    roleId: 'pm',
    functionIds: ['fn-owner-change'],
    input: 'Teilprojekte sind vom PMO bereitgestellt; vorgesehene TM/ILSM stehen fest.',
    output: 'Owner ist übergeben; PM behält lesenden Zugriff; Subprojects ist gepflegt.',
    evidence: [
      ...e('T', 'Release1-Matrix!A10:Q10', '2.6'),
      ...e('B', '§3.6.7 Teilprojektleiter einsetzen'),
    ],
  },
  ...(
    [
      { number: '2.7', roleId: 'pm', title: 'Zugriffsrechte festlegen', row: 11, section: '3.6.6' },
      {
        number: '2.11',
        roleId: 'tm',
        title: 'Zugriffsrechte für System-TP festlegen',
        row: 15,
        section: '3.8.4',
      },
      {
        number: '2.15',
        roleId: 'ilsm',
        title: 'Zugriffsrechte für ILS-TP festlegen',
        row: 19,
        section: '3.9.4',
      },
    ] as const
  ).map((s) => ({
    id: `step-${s.number.replace('.', '-')}`,
    processId: 'projektabwicklung',
    number: s.number,
    title: s.title,
    phase: 'Definition',
    roleId: s.roleId,
    functionIds: ['fn-project-permissions', 'fn-build-team'],
    input:
      'Projekt ist bereitgestellt; verantwortliche Rolle hat Zugriff; betreffende Personen sind als PWA-User verfügbar.',
    output:
      'Teamzuordnung und Stakeholder-Rechte sind unterschieden; benötigte Zugriffe sind geprüft.',
    evidence: [
      ...e('T', `Release1-Matrix!A${s.row}:Q${s.row}`, s.number),
      ...e('B', `§${s.section} ${s.title}`),
    ],
  })),
];
export const processViews = [
  ...controlViews,
  ...definitionViews,
  {
    id: 'access',
    title: 'SB1: Team und Zugriff',
    description:
      'Quellenbasierter Entwurf · Ausschnitt aus der Phase Definition, keine vollständige oder lineare Prozessfolge. Owner-Übergabe und Zugriffsverwaltung gelten für unterschiedliche Projektkontexte.',
    stepIds: ['step-2-6', 'step-2-7', 'step-2-11', 'step-2-15'],
    articleId: 'guide-project-permissions',
  },
  {
    id: 'milestones',
    title: 'SB1: Liefergegenstände und Meilensteine',
    description:
      'Quellenbasierter Entwurf · Die Definition liefert Eingaben für die spätere Planung. Die Zusammenstellung zeigt fachliche Abhängigkeiten, keinen vollständigen linearen Prozess.',
    stepIds: ['step-2-2', 'step-2-5', 'step-3-1', 'step-3-2'],
    articleId: 'guide-deliverables-milestones',
  },
];
export const releaseAssignments: ReleaseAssignment[] = [
  ...scopeItems.map((s) => ({
    id: `release-${s.id}`,
    subject: { kind: 'scope' as const, id: s.id },
    stageId: 'R1',
    basis: 'current-scope' as const,
    aspect: s.title,
    evidence: s.evidence,
  })),
  {
    id: 'historic-team',
    subject: { kind: 'function', id: 'fn-build-team' },
    stageId: 'R1',
    basis: 'historical-plan',
    aspect:
      'Ursprünglich zusammen geplant: Build a Team und Rechte vergeben. Kein heutiger Reife- oder SB1-Nachweis.',
    evidence: e('H', 'Tabelle 1, Zeile R1, Spalte Scope: Projektteam besetzen'),
  },
];
export const trainingBlocks = [{ id: 'sb1', title: 'Schulungsblock 1' }];
export const trainingAssignments: TrainingAssignment[] = [
  ...definitionTraining,
  ...processSteps.map((s) => ({
    id: `training-${s.id}`,
    subject: { kind: 'step' as const, id: s.id },
    blockId: 'sb1',
    included: true,
    statement: `${s.number} gehört laut Schulungsmatrix zu SB1. Die Blockzuordnung bestätigt keine technische Reife.`,
    evidence: [s.evidence[0]],
  })),
  {
    id: 'training-build-old',
    subject: { kind: 'function', id: 'fn-build-team' },
    blockId: 'sb1',
    included: true,
    statement:
      'Bestätigt am 23.09.2026: Build Team wird in SB1 geschult. Die frühere Beschränkung auf Project Permissions ist überholt.',
    evidence: [
      ...e('T', 'Regeln & Entscheidungen!A6:D6'),
      ...e('TTT', 'Zeile 17, F:G', 'TTT-D-16'),
      ...e('C23', 'Punkt 3'),
    ],
  },
  {
    id: 'training-build-draft',
    subject: { kind: 'function', id: 'fn-build-team' },
    blockId: 'sb1',
    included: true,
    statement:
      'Aktueller Handbuchentwurf: Build Team für operative Teammitglieder; keine detaillierte Ressourcen- oder Kapazitätsplanung.',
    evidence: e('B', '§3.6.6 Zugriffsrechte festlegen; §3.8.4 / §3.9.4'),
  },
  {
    id: 'training-owner',
    subject: { kind: 'procedure', id: 'procedure-owner-change' },
    blockId: 'sb1',
    included: true,
    statement: 'Owner-Übergabe ist im aktuellen SB1-Handbuchentwurf konkret beschrieben.',
    evidence: e('B', '§3.6.7 Teilprojektleiter einsetzen'),
  },
];
export const issues: Issue[] = [
  ...controlIssues,
  ...definitionIssues,
  {
    id: 'issue-f-r1-open-07',
    title: 'Gesamte Rollen- und Rechtematrix bleibt offen',
    status: 'VERIFIKATION ERFORDERLICH',
    subjects: ['fn-project-permissions', 'fn-owner-change', 'fn-build-team'].map((id) => ({
      kind: 'function',
      id,
    })),
    limitation:
      'Der geübte Owner-/Permissions-Weg belegt keine vollständige Rechtefreigabe. Die Rollenliste kann manuell ergänzt werden; Build-Team-Rechtewirkung und RBS bleiben im vorgesehenen Kontext zu prüfen.',
    evidence: [
      ...e('F', 'Klärungsbedarf!A11:D11', 'R1-OPEN-07'),
      ...e('TTT', 'Zeilen 6, 14–17, A:G'),
    ],
  },
  {
    id: 'issue-build-sync',
    title: 'Build-Team-Synchronisation ist widersprüchlich beschrieben',
    status: 'Offener Quellenkonflikt',
    subjects: [{ kind: 'function', id: 'fn-build-team' }],
    limitation:
      'B behauptet aktivierte Synchronisation: PDP-Leserechte und Site-Lese-/Schreibrechte. K dokumentiert deaktiviertes „Sync User Permissions“. Ob dieselbe Option gemeint ist und welcher System-/Site-Stand gilt, ist ungeklärt. Automatische Rechtewirkung nicht als garantiertes Übungsergebnis behandeln.',
    evidence: [
      ...e('B', '§3.6.6 Zugriffsrechte festlegen; §3.8.4 / §3.9.4'),
      ...e('K', 'security – Berechtigungen und Rollen; Q3 06.1_Security_Model, Z. 7–10'),
      ...e('TTT', 'Zeile 16, A:G', 'TTT-D-15'),
    ],
  },
  {
    id: 'issue-f-r1-open-01',
    title: 'Konten und Erstzugang prüfen',
    status: 'OFFEN',
    subjects: [{ kind: 'function', id: 'fn-project-permissions' }],
    limitation:
      'Personenauswahl und Sichtbarkeit mit regulären Konten sind nicht ausreichend nachgewiesen. Vor einer Übung die vorgesehenen Konten prüfen.',
    evidence: [
      ...e('F', 'Klärungsbedarf!A5:D5', 'R1-OPEN-01'),
      ...e('TTT', 'Zeile 4, A:G', 'TTT-D-03'),
    ],
  },
  {
    id: 'issue-f-r1-open-02',
    title: 'Project-Site-Zugriff bei Bestandsprojekten prüfen',
    status: 'VERIFIKATION ERFORDERLICH',
    subjects: [
      { kind: 'function', id: 'fn-project-permissions' },
      { kind: 'function', id: 'fn-build-team' },
    ],
    limitation:
      'Eine bestätigte Template-Korrektur für neue Projekte ist kein Nachweis für Bestandsprojekte oder die Zielumgebung.',
    evidence: [
      ...e('F', 'Klärungsbedarf!A6:D6', 'R1-OPEN-02'),
      ...e('TTT', 'Zeilen 10–11 und 41, A:G'),
    ],
  },
  {
    id: 'issue-f-r1-open-12',
    title: 'Schulungsumgebung und Client-Voraussetzungen prüfen',
    status: 'VERIFIKATION ERFORDERLICH',
    subjects: functions.map((f) => ({ kind: 'function', id: f.id })),
    limitation:
      'Client-Anbindung ist behoben (TTT-D-01); dies ist keine Abnahme aller Schulungsvoraussetzungen. Lasttest und Speicher-/Antwortzeiten sind in Bearbeitung (TTT-D-02/-19); Übungskonten, Referenzplan und praktische Pilotierung bleiben vorzubereiten.',
    evidence: [
      ...e('F', 'Klärungsbedarf!A16:D16', 'R1-OPEN-12'),
      ...e('TTT', 'Zeilen 2–3, 20, 25 und 45, A:G'),
    ],
  },
  {
    id: 'issue-f-r1-open-08',
    title: 'Große Lieferlisten praktikabel darstellen',
    status: 'TECHNISCH NOCH OFFEN',
    subjects: ['fn-deliverables', 'fn-delivery-milestones'].map((id) => ({ kind: 'function', id })),
    limitation:
      'Führende Gesamtprojektliste im Contract Execution Project und spezifische Listen der Teilprojekte sind geklärt; die Liefermeilensteinverknüpfung ist umgesetzt (TTT-D-07/-08). Offen bleibt allein die praktikable Darstellung großer Lieferlisten. Keine darüber hinausgehende Synchronisierung aller Felder ableiten.',
    evidence: [
      ...e('C23', 'Punkt 2'),
      ...e('TTT', 'Zeilen 8–9, A:G', 'TTT-D-07/-08'),
      ...e('F', 'Klärungsbedarf!A12:D12', 'R1-OPEN-08'),
      ...e('F', 'R1 Funktionsmatrix!A7:J8 und A14:J14', 'FS-03a/FS-03b/FS-09'),
      ...e('T', 'Release1-Matrix!A6:Q6'),
      ...e(
        'B',
        '§3.6.2 Projektumfang festlegen; §4.5.2 Schritt-für-Schritt: Liefermeilensteine planen',
      ),
    ],
  },
  {
    id: 'issue-f-r1-open-06',
    title: 'LCM-3: einmal pro Kalenderjahr bestätigt',
    status: 'GEKLÄRT',
    subjects: [
      { kind: 'function', id: 'fn-phases-tailoring' },
      { kind: 'scope', id: 'R1-08' },
      { kind: 'scope', id: 'R1-10' },
    ],
    limitation:
      'LCM-3 ist wegen Auditierung erforderlich und einmal pro Kalenderjahr durchzuführen. R1-OPEN-06 ist damit geklärt. Ein rollierender 12-Monats-Rhythmus ist eine zukünftige Verbesserung ohne Beschluss; daraus keine aktuelle Terminregel ableiten.',
    evidence: [
      ...e('C23', 'Punkt 8'),
      ...e('TTT', 'Zeile 27, A:G', 'TTT-D-26'),
      ...e('T', 'Release1-Matrix!A23:Q23', '3.4'),
      ...e('F', 'Klärungsbedarf!A10:D10', 'R1-OPEN-06'),
      ...e('B', '§4.5.5 Projektphasen und LCM-Review-Termine planen'),
    ],
  },
  {
    id: 'issue-payment-terms-context',
    title: 'Vertragsdaten im vorgesehenen Kontext prüfen',
    status: 'FACHLICHER ABGLEICH ERFORDERLICH',
    subjects: [{ kind: 'function', id: 'fn-payment-terms' }],
    limitation:
      'Der Handbuchentwurf beschreibt die Eingabe der Zahlungsbedingungen. Die Schulungsmatrix verlangt eine klare Abgrenzung einzelner Termin- und Vertragsfelder; das Center überprüft weder Vertragsinhalte noch wirksame Eingaberechte.',
    evidence: [
      ...e('B', '§3.6.3 Schritt-für-Schritt: Vertragsdaten einpflegen'),
      ...e('T', 'Release1-Matrix!A9:Q9'),
    ],
  },
  {
    id: 'issue-milestone-client',
    title: 'Ausgangsplan und Client vor der Übung prüfen',
    status: 'VERIFIKATION ERFORDERLICH',
    subjects: ['fn-delivery-milestones', 'fn-payment-milestones'].map((id) => ({
      kind: 'function',
      id,
    })),
    limitation:
      'Ansicht und Planvorlage waren laut Funktionsmatrix nur teilweise verifiziert. Der aktuelle Schulungs- oder Produktivstand des Clients ist hier nicht nachgewiesen. Einen geeigneten Schulungsplan und die Berechtigungen vor der Übung prüfen.',
    evidence: [...e('F', 'R1 Funktionsmatrix!A14:J16', 'FS-09/FS-11'), ...e('C23', 'Punkt 2')],
  },
];
export const assessments: Assessment[] = [
  ...controlAssessments,
  ...definitionAssessments,
  {
    id: 'deliverables-technical',
    subject: { kind: 'function', id: 'fn-deliverables' },
    dimension: 'technical',
    originalValue: 'teilweise verifiziert',
    value: 'partial',
    scope:
      'Aktualisiert 23.09.2026: Führende Liste und Liefermeilensteinverknüpfung bestätigt; praktische Darstellung großer Lieferlisten bleibt offen.',
    environment: 'TTT-Kontext; Zielumgebung nicht angegeben',
    issueIds: ['issue-f-r1-open-08'],
    evidence: [
      ...e('F', 'R1 Funktionsmatrix!A7:J8', 'FS-03a/FS-03b'),
      ...e('C23', 'Punkt 2'),
      ...e('TTT', 'Zeilen 8–9, A:G'),
    ],
  },
  {
    id: 'milestones-technical',
    subject: { kind: 'function', id: 'fn-delivery-milestones' },
    dimension: 'technical',
    originalValue: 'teilweise verifiziert',
    value: 'partial',
    scope:
      'Liefergegenstandsbezug ist umgesetzt; Ausgangsplan und konkrete Schulungsübung bleiben separat zu prüfen.',
    environment: 'TTT-Kontext; Zielumgebung nicht angegeben',
    issueIds: ['issue-f-r1-open-08', 'issue-milestone-client'],
    evidence: [...e('F', 'R1 Funktionsmatrix!A14:J16', 'FS-09/FS-11'), ...e('C23', 'Punkt 2')],
  },
  {
    id: 'payment-terms-technical',
    subject: { kind: 'function', id: 'fn-payment-terms' },
    dimension: 'technical',
    originalValue: 'teilweise verifiziert',
    value: 'partial',
    scope:
      'PDP-Grundpflege im TTT-Kontext; konkrete Vertragsangaben und Feldabgrenzungen sind im Zielkontext zu prüfen.',
    environment: 'TTT-Kontext; Zielumgebung nicht angegeben',
    issueIds: ['issue-payment-terms-context'],
    evidence: e('F', 'R1 Funktionsmatrix!A7:J7', 'FS-03a'),
  },
  {
    id: 'payment-technical',
    subject: { kind: 'function', id: 'fn-payment-milestones' },
    dimension: 'technical',
    originalValue: 'teilweise verifiziert',
    value: 'partial',
    scope:
      'Meilensteinplanung im abgegrenzten TTT-Kontext; die beiden Zahlungsvarianten des Handbuchentwurfs sind kein separat protokollierter Systemtest.',
    environment: 'TTT-Kontext; Zielumgebung nicht angegeben',
    issueIds: ['issue-milestone-client'],
    evidence: e('F', 'R1 Funktionsmatrix!A14:J14', 'FS-09'),
  },
  ...(
    [
      'fn-deliverables',
      'fn-payment-terms',
      'fn-delivery-milestones',
      'fn-payment-milestones',
    ] as const
  ).map((id) => ({
    id: `${id}-description`,
    subject: { kind: 'function' as const, id },
    dimension: 'procedure-description' as const,
    originalValue: 'Im Handbuchentwurf konkret beschrieben',
    value: 'described-draft' as const,
    scope: 'Aktueller vorgesehener SB1-Bedienweg; kein zusätzlicher Ausführungsnachweis.',
    environment: null,
    issueIds: [],
    evidence: e(
      'B',
      id === 'fn-deliverables'
        ? '§3.6.2 Projektumfang festlegen'
        : id === 'fn-payment-terms'
          ? '§3.6.3 Vertragsdaten einpflegen'
          : id === 'fn-delivery-milestones'
            ? '§4.5.2 Schritt-für-Schritt: Liefermeilensteine planen'
            : '§4.5.3 Schritt-für-Schritt: Zahlungsmeilensteine planen',
    ),
  })),
  {
    id: 'permissions-technical',
    subject: { kind: 'function', id: 'fn-project-permissions' },
    dimension: 'technical',
    originalValue: 'teilweise verifiziert',
    value: 'partial',
    scope:
      'Einzelweg mit Project Permissions; Konten, Bestandsprojekte und Gesamtmatrix bleiben begrenzt.',
    environment: 'TTT-Kontext; genauer Systemstand nicht angegeben',
    issueIds: ['issue-f-r1-open-01', 'issue-f-r1-open-02', 'issue-f-r1-open-07'],
    evidence: e('F', 'R1 Funktionsmatrix!A11:J11', 'FS-06'),
  },
  {
    id: 'owner-technical',
    subject: { kind: 'function', id: 'fn-owner-change' },
    dimension: 'technical',
    originalValue: 'verifiziert',
    value: 'verified',
    scope:
      'Nur der geübte Ablauf: benötigten Eigenzugriff sichern, dann Owner wechseln. Keine formale Produktivabnahme und keine Freigabe der gesamten Rechte-Matrix.',
    environment: 'TTT-Kontext; genauer Systemstand nicht angegeben',
    issueIds: ['issue-f-r1-open-07', 'issue-f-r1-open-12'],
    evidence: e('F', 'R1 Funktionsmatrix!A13:J13', 'FS-08'),
  },
  ...(['fn-project-permissions', 'fn-owner-change'] as const).flatMap((id) => {
    const owner = id === 'fn-owner-change';
    return (
      [
        ['ttt', 'selbst geübt'],
        ['documentation', owner ? 'VERBINDLICH DOKUMENTIERBAR' : 'DOKUMENTIERBAR MIT HINWEIS'],
        ['training', owner ? 'grundsätzlich schulungsfähig' : 'schulungsfähig mit Einschränkung'],
      ] as const
    ).map(([dimension, originalValue]) => ({
      id: `${id}-${dimension}`,
      subject: { kind: 'function' as const, id },
      dimension,
      originalValue,
      value: 'qualified' as const,
      scope:
        'Quellenbewertung des abgegrenzten Wegs; keine Freigabe dieses Center-Entwurfs und kein Schulungsnachweis.',
      environment: null,
      issueIds: ['issue-f-r1-open-07'],
      evidence: e(
        'F',
        owner ? 'R1 Funktionsmatrix!A13:J13' : 'R1 Funktionsmatrix!A11:J11',
        owner ? 'FS-08' : 'FS-06',
      ),
    }));
  }),
  ...functions
    .filter((f) => ['fn-project-permissions', 'fn-owner-change', 'fn-build-team'].includes(f.id))
    .map((f) => ({
      id: `${f.id}-description`,
      subject: { kind: 'function' as const, id: f.id },
      dimension: 'procedure-description' as const,
      originalValue: 'Im Handbuchentwurf konkret beschrieben',
      value: 'described-draft' as const,
      scope:
        'Beschreibungsstand des aktuellen vorgesehenen SB1-Wegs; kein zusätzlicher Ausführungsnachweis.',
      environment: null,
      issueIds: f.id === 'fn-build-team' ? ['issue-build-sync'] : [],
      evidence: f.evidence,
    })),
];

export const assessmentLabels: Record<Assessment['dimension'], string> = {
  technical: 'Technischer Nachweis',
  ttt: 'TTT-Behandlung',
  documentation: 'Dokumentierbarkeit laut Quelle',
  training: 'Schulungseignung laut Quelle',
  'procedure-description': 'Beschreibungsstand',
};

export const knowledgeLinks: KnowledgeLink[] = [
  {
    id: 'link-terms-payment',
    from: { kind: 'function', id: 'fn-payment-terms' },
    to: { kind: 'function', id: 'fn-payment-milestones' },
    relation: 'feeds',
    statement:
      'Die in der PDP Contract dokumentierten Zahlungsbedingungen und Fristen liefern den fachlichen Eingang für Zahlungsmeilensteine.',
    evidence: e(
      'B',
      '§3.6.3 Schritt-für-Schritt: Vertragsdaten einpflegen; §4.5.3 Schritt-für-Schritt: Zahlungsmeilensteine planen',
    ),
  },
  {
    id: 'link-deliverables-delivery',
    from: { kind: 'function', id: 'fn-deliverables' },
    to: { kind: 'function', id: 'fn-delivery-milestones' },
    relation: 'feeds',
    statement:
      'Die führende Liste im Contract Execution Project und die spezifischen Teilprojektlisten liefern die Liefergegenstände. Die Verknüpfung zu Liefermeilensteinen über die Funktion Lieferung ist umgesetzt. Nach Änderungen Einträge und Termine fachlich abgleichen; keine umfassende Feldsynchronisierung ableiten.',
    evidence: e(
      'B',
      '§3.6.2 Projektumfang festlegen; §4.5.2 Schritt-für-Schritt: Liefermeilensteine planen',
    ),
  },
  {
    id: 'link-contract-payment',
    from: { kind: 'function', id: 'fn-payment-milestones' },
    to: { kind: 'function', id: 'fn-delivery-milestones' },
    relation: 'requires',
    condition: 'Zahlung wird durch eine Lieferung ausgelöst',
    statement:
      'Liefermeilenstein und Zahlungsfrist aus den Vertragsdaten müssen fachlich zusammenpassen. Ohne auslösende Lieferung ist eine begründete direkte Terminierung zulässig.',
    evidence: e(
      'B',
      '§3.6.3 Vertragsdaten einpflegen; §4.5.3 Schritt-für-Schritt: Zahlungsmeilensteine planen',
    ),
  },
];
