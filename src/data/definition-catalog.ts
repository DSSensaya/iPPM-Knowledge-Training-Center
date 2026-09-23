import type {
  Assessment,
  FunctionDefinition,
  Issue,
  ProcessStep,
  ScopeItem,
  TrainingAssignment,
} from './domain';
import { evidence as e } from './sources';

// Curated v0.6 additions. Matrix titles/numbers are preserved; orientation is not an execution claim.
export const definitionRows = [
  {
    number: '1.1',
    title: 'Projekt beantragen',
    row: 3,
    section: '3.1.1',
    role: 'pm',
    fn: 'fn-project-request',
    article: 'guide-project-handover',
    tool: 'TopDesk / Service UHD',
    scope: 'R1-02',
    output: 'Benötigte Antragsinformationen und ungeprüfter Antragsweg sind unterschieden.',
  },
  {
    number: '1.2',
    title: 'Projekt anlegen',
    row: 4,
    section: '3.1.2–3.1.4',
    role: 'pmo',
    fn: 'fn-project-provision',
    article: 'guide-project-handover',
    tool: 'PWA / Project Center / PMO Status',
    scope: 'R1-01',
    output:
      'Bereitstellungs- und Übernahmekriterien sind bekannt; kein ausführbarer PMO-Gesamtweg.',
  },
  {
    number: '2.1',
    title: 'Projektstammdaten anlegen',
    row: 5,
    section: '3.6.1',
    role: 'pm',
    fn: 'fn-project-master-data',
    article: 'guide-project-master-data',
    tool: 'PDP Overview',
    scope: 'R1-03',
    output: 'Stammdaten sind fachlich plausibel; Start Date, EDC und Planwirkung bleiben getrennt.',
  },
  {
    number: '2.3',
    title: 'Projektziele festlegen',
    row: 7,
    section: '3.6.4',
    role: 'pm',
    fn: 'fn-project-objectives',
    article: 'guide-project-objectives',
    tool: 'PDP Objectives',
    scope: 'R1-03',
    output: 'Überprüfbare Ziele, Assumptions und Constraints sind getrennt dokumentiert.',
  },
  {
    number: '2.4',
    title: 'Projektorganisation festlegen',
    row: 8,
    section: '3.6.5',
    role: 'pm',
    fn: 'fn-project-organization',
    article: 'guide-project-organization',
    tool: 'PDP Organisation',
    scope: 'R1-07',
    output:
      'Kernteam, Teilprojekte und Unteraufträge sind nachvollziehbar dokumentiert; Rechte separat prüfen.',
  },
  {
    number: '2.8',
    title: 'Stammdaten für System-TP anlegen',
    row: 12,
    section: '3.8.1',
    role: 'tm',
    fn: 'fn-system-definition',
    article: 'guide-subproject-definition',
    tool: 'PDP System Overview',
    scope: 'R1-03',
    output: 'System-Stammdaten sind mit dem Kundenprojekt vereinbar.',
  },
  {
    number: '2.9',
    title: 'Projektumfang für System-TP festlegen',
    row: 13,
    section: '3.8.2',
    role: 'tm',
    fn: 'fn-system-definition',
    article: 'guide-subproject-definition',
    tool: 'PDP System Scope',
    scope: 'R1-03',
    output: 'Systemumfang ist gegenüber Kundenprojekt und angrenzenden Teilprojekten abgegrenzt.',
  },
  {
    number: '2.10',
    title: 'Projektorganisation für System-TP festlegen',
    row: 14,
    section: '3.8.3',
    role: 'tm',
    fn: 'fn-system-definition',
    article: 'guide-subproject-definition',
    tool: 'PDP System Organ.',
    scope: 'R1-03',
    output: 'Mitarbeiter, Projektrolle und Prozessrolle des System-Teams sind dokumentiert.',
  },
  {
    number: '2.12',
    title: 'Stammdaten für ILS-TP anlegen',
    row: 16,
    section: '3.9.1',
    role: 'ilsm',
    fn: 'fn-ils-definition',
    article: 'guide-subproject-definition',
    tool: 'PDP ILS Overview',
    scope: 'R1-03',
    output: 'ILS-Stammdaten sind mit dem Kundenprojekt vereinbar.',
  },
  {
    number: '2.13',
    title: 'Projektumfang für ILS-TP festlegen',
    row: 17,
    section: '3.9.2',
    role: 'ilsm',
    fn: 'fn-ils-definition',
    article: 'guide-subproject-definition',
    tool: 'PDP ILS Scope',
    scope: 'R1-03',
    output:
      'ILS-Leistungen sind gegenüber Kundenprojekt, Systementwicklung und Unterauftragnehmern abgegrenzt.',
  },
  {
    number: '2.14',
    title: 'Projektorganisation für ILS-TP festlegen',
    row: 18,
    section: '3.9.3',
    role: 'ilsm',
    fn: 'fn-ils-definition',
    article: 'guide-subproject-definition',
    tool: 'PDP ILS Organisation',
    scope: 'R1-03',
    output: 'Mitarbeiter, Projektrolle und Prozessrolle des ILS-Teams sind dokumentiert.',
  },
] as const;

export const definitionScope: ScopeItem[] = [
  {
    id: 'R1-01',
    title: 'Projektanlage und -definition mit Enterprise Custom Fields und Lookup Tables',
    evidence: e('S', '02_SCOPE_ID_MASTER!A2:L2', 'R1-01'),
  },
  {
    id: 'R1-02',
    title: 'Formularbasierte Projektanfrage über Service UHD',
    evidence: e('S', '02_SCOPE_ID_MASTER!A3:L3', 'R1-02'),
  },
];
export const definitionSteps: ProcessStep[] = definitionRows.map((r) => ({
  id: `step-${r.number.replace('.', '-')}`,
  processId: 'projektabwicklung',
  number: r.number,
  title: r.title,
  phase: r.number.startsWith('1.') ? 'Initialisierung · Orientierung' : 'Definition',
  roleId: r.role,
  functionIds: [r.fn],
  input: r.number.startsWith('1.')
    ? 'Projektentscheidung, Grobstruktur und vorgesehene Verantwortliche liegen vor; aktuellen Antragsweg klären.'
    : 'Projekt ist bereitgestellt und übergeben; fachliche Angaben und wirksame Bearbeitungsrechte liegen vor.',
  output: r.output,
  evidence: [
    ...e('T', `Release1-Matrix!A${r.row}:Q${r.row}`, r.number),
    ...e('B', `§${r.section} ${r.title}`),
  ],
}));
export const definitionFunctions: FunctionDefinition[] = [
  ...new Set(definitionRows.map((r) => r.fn)),
].map((id) => {
  const rows = definitionRows.filter((r) => r.fn === id);
  const first = rows[0];
  const scopeRow =
    first.scope === 'R1-01' ? 2 : first.scope === 'R1-02' ? 3 : first.scope === 'R1-07' ? 8 : 4;
  return {
    id,
    title:
      rows.length > 1
        ? `${first.role === 'tm' ? 'System' : 'ILS'}-Teilprojekt definieren`
        : first.title,
    outcome: rows.map((r) => r.output).join(' '),
    aliases: rows.map((r) => r.tool),
    roleIds: [first.role],
    context: {
      projectTypes:
        first.role === 'tm'
          ? ['System Delivery']
          : first.role === 'ilsm'
            ? ['ILS Delivery']
            : [
                'Contract Execution',
                ...(first.role === 'pmo' ? ['System Delivery', 'ILS Delivery'] : []),
              ],
      levels:
        first.role === 'tm'
          ? ['L2', 'L3 als Segment unter System Delivery L2']
          : first.role === 'ilsm'
            ? ['L2']
            : ['L1', ...(first.role === 'pmo' ? ['L2', 'L3'] : [])],
      tools: rows.map((r) => r.tool),
      environment: null,
    },
    scopeLinks: [
      {
        scopeId: first.scope,
        coverage: 'partial',
        evidence: e('S', `02_SCOPE_ID_MASTER!A${scopeRow}:L${scopeRow}`, first.scope),
      },
    ],
    evidence: rows.flatMap((r) => e('B', `§${r.section} ${r.title}`)),
  };
});

const subject = (id: string) => ({ kind: 'function' as const, id });
export const definitionIssues: Issue[] = [
  {
    id: 'issue-project-request-scope',
    title: 'Beantragung: Schulungszuordnung widerspricht fehlendem Gesamtnachweis',
    status: 'Offener Quellenkonflikt',
    subjects: [subject('fn-project-request')],
    limitation:
      'T ordnet 1.1 SB1 zu und nennt „Freigabefähig mit Hinweis“. F (FS-02) sieht den Antrag nicht im aktuellen Schulungsumfang, den vollständigen Ticketweg als nicht nachgewiesen und fordert: noch nicht verbindlich dokumentieren. B §3.1.1 beschreibt TopDesk einschließlich automatischer Owner- und Ticketzuordnung. Diese Beschreibung ist kein technischer Nachweis. Hier nur Vorbereitung und Orientierung; Erstzugang, Formular und tatsächliche Zuordnungen vor Verwendung klären.',
    evidence: [
      ...e('T', 'Release1-Matrix!A3:Q3', '1.1'),
      ...e('F', 'R1 Funktionsmatrix!A6:J6', 'FS-02'),
      ...e('B', '§3.1.1 Projekt beantragen'),
    ],
  },
  {
    id: 'issue-project-provision-proof',
    title: 'Vollständiger PMO-Bereitstellungsdurchlauf fehlt',
    status: 'VERIFIKATION ERFORDERLICH',
    subjects: [subject('fn-project-provision')],
    limitation:
      'B beschreibt Anlage, Site-/Planinitialisierung und Übergabe, einschließlich automatischer Veröffentlichung beim Speichern. F bewertet FS-01 nur teilweise verifiziert; T nennt keinen vollständigen Teilnehmerdurchlauf. EPT, ID-Erzeugung, manuelle Project-ID – PMO-Referenz, Site-/Planvorlagen, Verknüpfungen, Publish und Check-in müssen zusammen geprüft werden. Keine ausführbare PMO-Anleitung und keine garantierte Automatik.',
    evidence: [
      ...e('B', '§3.1.2–3.1.4'),
      ...e('F', 'R1 Funktionsmatrix!A5:J5', 'FS-01'),
      ...e('T', 'PDP-Abdeckung!A4:H4; Offene Punkte!A9:F9'),
    ],
  },
  {
    id: 'issue-f-r1-open-05',
    title: 'Startdatum und EDC: Feldbedeutung und Übernahme offen',
    status: 'ENTSCHEIDUNG ERFORDERLICH',
    subjects: [
      'fn-project-provision',
      'fn-project-master-data',
      'fn-system-definition',
      'fn-ils-definition',
    ].map(subject),
    limitation:
      'B beschreibt Start Date als fachlich gültigen Projektbeginn und Finish Date als planbasiert; auf Contract nennt B vertragliche Termine. F lässt Feldbedeutung und Übernahmeregel zu Projektstart/EDC ausdrücklich offen. T verlangt die Abgrenzung und verbietet die Behauptung einer automatischen Planübernahme ohne Bestätigung. EDC daher weder mit Start Date gleichsetzen noch als bestätigten Auslöser einer Planverschiebung behandeln. Feldzuordnung, vorhandener Plan und tatsächliche Wirkung bleiben in der Zielumgebung zu prüfen.',
    evidence: [
      ...e('F', 'Klärungsbedarf!A9:D9', 'R1-OPEN-05'),
      ...e('T', 'Release1-Matrix!A5:Q5 und A9:Q9; Offene Punkte!A7:F7'),
      ...e('B', '§3.1.2; §3.6.1; §3.6.3; §3.8.1; §3.9.1'),
      ...e('K', 'PDP-Feldkatalog: Q4 Contract Execution, Z. 22–23 und 50–51'),
    ],
  },
  {
    id: 'issue-definition-roles',
    title: 'Rollenlisten und Organisationsbezeichnungen abgleichen',
    status: 'VERIFIKATION ERFORDERLICH',
    subjects: ['fn-project-organization', 'fn-system-definition', 'fn-ils-definition'].map(subject),
    limitation:
      'B nennt Subcontracts, T Subcontractors; die Bezeichnungen bleiben als Quellenvarianten sichtbar. People-Picker, finale System-/ILS-Rollen und zugehörige Prozessrollen müssen im Zielstand geprüft werden. Eine dokumentierte Rolle oder sichtbare PDP gewährt keine Rechte. Der bestehende Owner-/Permissions-Weg ist kein Nachweis der gesamten Rechte-Matrix.',
    evidence: [
      ...e('B', '§3.6.5 Tabelle 13; §3.8.3; §3.9.3'),
      ...e('T', 'Release1-Matrix!A8:Q8, A14:Q14 und A18:Q18; Offene Punkte!A8:F8'),
      ...e('F', 'Klärungsbedarf!A11:D11', 'R1-OPEN-07'),
    ],
  },
  {
    id: 'issue-definition-configuration',
    title: 'Feld- und Site-Konfiguration im Zielstand prüfen',
    status: 'VERIFIKATION ERFORDERLICH',
    subjects: definitionFunctions
      .filter((f) => f.id !== 'fn-project-request')
      .map((f) => subject(f.id)),
    limitation:
      'Konfigurationsmomentaufnahme und TTT-Angaben ersetzen keine Prüfung aktueller PDPs, Listen, regulärer Konten und Bearbeitungsrechte. F hält Feld-/Sichtkonfiguration (R1-OPEN-10) und die Reichweite der Site-Korrektur (R1-OPEN-02) offen. Bei Objectives sind verfügbare Zielklassen und der beschriebene Initialstatus „geplant“ zu prüfen; keine freie Lookup-Liste erfinden.',
    evidence: [
      ...e('F', 'Klärungsbedarf!A6:D6 und A14:D14', 'R1-OPEN-02 / R1-OPEN-10'),
      ...e('B', '§3.6.4 Tabelle 12'),
      ...e('K', 'Objectives und Organisationslisten: Felder der Objectives-Liste'),
    ],
  },
];
export const definitionAssessments: Assessment[] = definitionFunctions.flatMap((f) => {
  const request = f.id === 'fn-project-request';
  const row = request
    ? 6
    : f.id === 'fn-project-provision'
      ? 5
      : f.id === 'fn-project-organization'
        ? 12
        : 7;
  return [
    {
      id: `assessment-${f.id}-technical`,
      subject: subject(f.id),
      dimension: 'technical' as const,
      originalValue: request ? 'nicht nachgewiesen' : 'teilweise verifiziert',
      value: request ? ('unknown' as const) : ('partial' as const),
      scope: request
        ? 'Vollständiger Beantragungs-/Ticketweg; kein Durchlaufnachweis'
        : 'Begrenzte Funktionsmatrixbewertung; keine Prüfung dieses Center-Beitrags oder der Zielumgebung',
      environment: null,
      issueIds: definitionIssues
        .filter((i) => i.subjects.some((s) => s.id === f.id))
        .map((i) => i.id),
      evidence: e('F', `R1 Funktionsmatrix!A${row}:J${row}`),
    },
    {
      id: `assessment-${f.id}-description`,
      subject: subject(f.id),
      dimension: 'procedure-description' as const,
      originalValue: 'Handbuchentwurf',
      value: 'described-draft' as const,
      scope:
        'Bedienbeschreibung beziehungsweise Orientierung im Handbuch; keine technische Freigabe',
      environment: null,
      issueIds: [],
      evidence: f.evidence,
    },
  ];
});
export const definitionTraining: TrainingAssignment[] = [
  {
    id: 'training-request-f',
    subject: subject('fn-project-request'),
    blockId: 'sb1',
    included: false,
    statement:
      'F FS-02: nicht im aktuellen Schulungsumfang; die abweichende SB1-Zuordnung in T bleibt erhalten.',
    evidence: e('F', 'R1 Funktionsmatrix!A6:J6', 'FS-02'),
  },
];
