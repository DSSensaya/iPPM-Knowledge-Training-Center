import type {
  Assessment,
  FunctionDefinition,
  Issue,
  ProcessStep,
  ReleaseAssignment,
  RoleId,
  ScopeItem,
  TrainingAssignment,
} from './domain';
import { evidence as e } from './sources';

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
    title: 'Projektabwicklung – Ausschnitt Definition',
    evidence: e('B', '§3.5 Fachlicher Soll-Ablauf; §3.6.6 / §3.6.7; §3.8.4 / §3.9.4'),
  },
];

export const releases = [{ id: 'release-1', title: 'Release 1' }];
export const stages = [
  { id: 'R1', releaseId: 'release-1' },
  { id: 'R1B', releaseId: 'release-1' },
];
export const scopeItems: ScopeItem[] = [
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
];
const context = {
  projectTypes: ['Contract Execution', 'System Delivery', 'ILS Delivery'],
  levels: ['L1', 'L2', 'L3 nur bei passendem System-Teilprojekt'],
  tools: ['PWA', 'Project Center', 'Project Permissions', 'Project Site'],
  environment: null,
};
export const functions: FunctionDefinition[] = [
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
    included: false,
    statement:
      'Schulungsmatrix: vorerst nur Project Permissions; Build Team folgt später im Ressourcen-Kontext.',
    evidence: e('T', 'Regeln & Entscheidungen!A6:D6'),
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
  {
    id: 'issue-f-r1-open-07',
    title: 'Gesamte Rollen- und Rechtematrix bleibt offen',
    status: 'VERIFIKATION ERFORDERLICH',
    subjects: functions.map((f) => ({ kind: 'function', id: f.id })),
    limitation:
      'Der geübte Owner-/Permissions-Weg belegt keine vollständige Rechtefreigabe. Rollenlisten, Build Team und RBS müssen im vorgesehenen Kontext geprüft werden.',
    evidence: e('F', 'Klärungsbedarf!A11:D11', 'R1-OPEN-07'),
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
    ],
  },
  {
    id: 'issue-f-r1-open-01',
    title: 'Konten und Erstzugang prüfen',
    status: 'OFFEN',
    subjects: [{ kind: 'function', id: 'fn-project-permissions' }],
    limitation:
      'Personenauswahl und Sichtbarkeit mit regulären Konten sind nicht ausreichend nachgewiesen. Vor einer Übung die vorgesehenen Konten prüfen.',
    evidence: e('F', 'Klärungsbedarf!A5:D5', 'R1-OPEN-01'),
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
    evidence: e('F', 'Klärungsbedarf!A6:D6', 'R1-OPEN-02'),
  },
  {
    id: 'issue-f-r1-open-12',
    title: 'Schulungsumgebung und Client-Voraussetzungen prüfen',
    status: 'VERIFIKATION ERFORDERLICH',
    subjects: functions.map((f) => ({ kind: 'function', id: f.id })),
    limitation:
      'Erfolgreiche TTT-Schritte in Integration sind keine Abnahme der Produktiv- oder Schulungsumgebung. Der genaue geprüfte Systemstand ist hier nicht bekannt.',
    evidence: e('F', 'Klärungsbedarf!A16:D16', 'R1-OPEN-12'),
  },
];
export const assessments: Assessment[] = [
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
  ...functions.map((f) => ({
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
