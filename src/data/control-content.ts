import type { Article } from './types';
import type {
  Assessment,
  EvidenceRef,
  FunctionDefinition,
  Issue,
  ProcessStep,
  Procedure,
  ScopeItem,
} from './domain';
import { evidence as e, sources } from './sources';

interface ControlRow {
  number: string;
  row: number;
  title: string;
  id: string;
  tool: string;
  scope: string;
  scopeRow: number;
  section: string;
  fRow: number;
  orientation: boolean;
  answer: string;
  gap: string;
  evidence: EvidenceRef[];
  sections: Article['sections'];
  actions: string[];
  checks: string[];
  exercise: string;
}

export const controlRows: ControlRow[] = [
  {
    number: '3.3',
    row: 22,
    title: 'Weitere Projektmeilensteine planen',
    id: 'external-milestones',
    tool: 'MS Project Client · 10 Phasen- und Meilensteinplan',
    scope: 'R1-08',
    scopeRow: 9,
    section: '§4.5.4 Tabelle 18; §4.5.6',
    fRow: 14,
    orientation: false,
    answer:
      'Beistellungen und Genehmigungen als externe Meilensteine mit getrenntem Stichtag und Plantermin abbilden. Quellenbasierter Bedienentwurf für das Kundenprojekt.',
    gap: 'FS-09 und FS-11 sind nur teilweise verifiziert. Ausgangsplan, Client, verfügbare Ext-Subtypen und tatsächliche Terminrestriktionen vor Nutzung prüfen. Der Entwurfsvermerk „AUCH FAT“ liefert keine vollständige FAT-Regel.',
    evidence: [...e('B', '§4.5.4 Tabelle 18; §4.5.6'), ...e('F', 'R1 Funktionsmatrix!A14:J16')],
    sections: [
      {
        title: 'Externe Voraussetzungen abgrenzen',
        body: 'Beistellungen sind externe Planungsannahmen. Sie werden nicht als interne Arbeitspakete oder projektinterne Reviews erfasst. Ext.Exp und Ext.Pro sind Beispiele aus B, keine pauschale Typzuordnung für jede Beistellung. Verwenden Sie nur einen fachlich passenden, tatsächlich verfügbaren Subtyp.',
      },
    ],
    actions: [
      'Öffnen Sie den ausgecheckten Contract-Execution-Plan in Ansicht 10 Phasen- und Meilensteinplan. Kopieren Sie den passenden generischen Meilenstein an die fachlich richtige Stelle und benennen Sie das Ereignis eindeutig.',
      'Pflegen Sie den verbindlichen oder fachlich maßgeblichen Termin unter Stichtag und den geplanten Termin unter Anfang. Prüfen Sie die entstehende Einschränkung „Anfang nicht früher als“ gegen die beabsichtigte Planung; keine ungeprüfte Terminwirkung voraussetzen.',
      'Prüfen Sie WBS Level „Pr – Projekt“, WBS Type „Meilenstein“ und Milestone Type „Ext“ oder den passenden verfügbaren Ext-Subtyp. Prüfen Sie verbleibende generische Einträge auf Doppelzählung; der Entwurf erfordert keine Löschung.',
      'Speichern, veröffentlichen und einchecken gemäß der verlinkten Querschnittsanleitung. Öffnen Sie den veröffentlichten Stand erneut und vergleichen Sie Ereignis, Typ, Stichtag und Plantermin.',
    ],
    checks: [
      'Sind Beistellung beziehungsweise Genehmigung eindeutig als externe Ereignisse sichtbar?',
      'Sind Stichtag, Anfang, Restriktion und Strukturmerkmale fachlich plausibel und im erneut geöffneten Stand erhalten?',
    ],
    exercise:
      'Fiktiv: Eine beigestellte Prüfvorrichtung wird am 15.06.2027 benötigt, ihre Ankunft ist für 10.06.2027 geplant. Eine externe Genehmigung wird am 01.06.2027 benötigt und für 28.05.2027 erwartet. Zwei getrennte Meilensteine im vorbereiteten Übungsplan erfassen und Soll-/Plantermine vergleichen; keine echten Projektdaten verwenden.',
  },
  {
    number: '3.4',
    row: 23,
    title: 'Projektphasen und LCM Review-Termine planen',
    id: 'phases-tailoring',
    tool: 'MS Project Client · 10 Phasen- und Meilensteinplan / 20 Projektstrukturplan',
    scope: 'R1-15',
    scopeRow: 16,
    section: '§4.5.5 Projektphasen und LCM-Review-Termine planen',
    fRow: 21,
    orientation: false,
    answer:
      'Phasen und Reviews einordnen; nur das Tailoring-Bedienprinzip nach einer separat vorgegebenen fachlichen Entscheidung üben. Eine verbindliche LCM-Termin- oder Frequenzregel bleibt ausgeschlossen.',
    gap: 'Keine abschließend einheitliche Regel belegt: T fordert jährlich, F R1-OPEN-06 hält Frequenz und Ausgangslogik offen, B beschreibt >2-/ <1-Jahr-Varianten. B enthält zudem eine leere LCM5-Vorgabe und fragmentarische Terminansätze. Weder diese Ansätze noch automatische Phasenanpassungen sind hier freigegeben. Review-Terminierung bleibt außerhalb des Bedienentwurfs.',
    evidence: [
      ...e('B', '§4.5.5 Projektphasen und LCM-Review-Termine planen'),
      ...e('T', 'Regeln & Entscheidungen!A7:D7'),
      ...e('F', 'R1 Funktionsmatrix!A21:J21', 'FS-16'),
      ...e('F', 'Klärungsbedarf!A10:D10', 'R1-OPEN-06'),
      ...e('K', 'Enterprise Custom Fields: Tailored; Lookup Table ATLAS Tailoring Status'),
    ],
    sections: [
      {
        title: 'Phasenplanung: Orientierung und offene Regel',
        body: 'B beschreibt Reviewtermine als Steuerung der verknüpften Projektphasen, die Ansichten 10 und Zeitachse sowie die Felder Anfang und Stichtag. Für Reviews nennt B Pr.PM – Projektmanagement, Meilenstein und PM.LCM 2B beziehungsweise weitere Reviewtypen. Das ist eine Beschreibung des Entwurfs, kein geprüfter Automatismus. Vor einer Terminübung müssen Reviewregel, Ausgangsplan, Verknüpfungen und Verschiebewirkungen geklärt sein.',
      },
      {
        title: 'Tailoring ist keine Frequenzentscheidung',
        body: 'F FS-16 bewertet das Bedienprinzip als verifiziert, lässt die konkrete 3er-Review-Frequenz aber ausdrücklich offen. T nennt eine jährliche Grundregel; daraus wird hier keine verbindliche Entscheidung abgeleitet. Der folgende Teilweg setzt einen bereits fachlich bestimmten Übungsfall voraus und wählt selbst keinen Review zur Herausnahme aus.',
      },
    ],
    actions: [
      'Nur mit einer separat dokumentierten fachlichen Tailoring-Entscheidung und einem vorbereiteten Übungsplan fortfahren. Fehlt sie, beim Quellenvergleich bleiben und keinen Review deaktivieren. Liefer-/Zahlungsplanung und ausgecheckten Plan prüfen.',
      'Den vorgegebenen Review-Meilenstein in Ansicht 20 Projektstrukturplan identifizieren. Tailored auf „T“ setzen und die konkrete Begründung in Notizen dokumentieren. B nennt „-“ (not tailored) und „T“ (tailored), K bestätigt das Textfeld mit Lookup ATLAS Tailoring Status; Werte im Zielstand prüfen.',
      'Den betreffenden Meilenstein über „Vorgang deaktivieren“ deaktivieren; nicht löschen. Die Feldmarkierung allein ist kein Nachweis der Deaktivierung.',
      'Speichern, veröffentlichen und einchecken gemäß Querschnittsanleitung. Den erneut geöffneten Stand auf erhaltenen Meilenstein, Inaktivität, Tailored und Notizen prüfen; angrenzende Phasen und Termine auf unerwartete Änderungen kontrollieren.',
    ],
    checks: [
      'Ist die fachliche Entscheidung separat vorgegeben, ohne aus Jahresabständen abgeleitet zu werden?',
      'Bleibt der Meilenstein erhalten und ist er tatsächlich deaktiviert, mit Tailored = T und nachvollziehbaren Notizen?',
      'Sind unerwartete Phasen-/Terminänderungen dokumentiert und vor Weiterverwendung geklärt?',
    ],
    exercise:
      'Fiktiver, vorab fachlich zu bestimmender Übungsfall: Ein konkret benannter Review soll entfallen. Ohne solche Vorgabe nur B, T und F vergleichen. Mit Vorgabe den Teilweg im Übungsplan ausführen und erhaltenen Datensatz, Inaktivität und Begründung prüfen. Keine erfundene interne Freigabe annehmen.',
  },
  {
    number: '4.9',
    row: 49,
    title: 'Eskalation an Multi-Projektmanagement durchführen',
    id: 'escalation-capture',
    tool: 'PWA · PDP Escalations / Liste Escalations',
    scope: 'R1-24',
    scopeRow: 25,
    section: '§5.5.3 Eskalation an Multi-Projektmanagement durchführen',
    fRow: 30,
    orientation: false,
    answer:
      'Entscheidungsbedarf, Adressat und Termin erfassen. Dieser Quellenentwurf deckt nur die Anlage ab; Empfängerbearbeitung und Entscheidung sind nicht nachgewiesen.',
    gap: 'T nennt 4.9 freigabefähig und begrenzt SB1 auf Erfassung. F FS-25 bewertet den Gesamtweg als noch nicht verbindlich dokumentierbar und nicht schulungsfähig: Empfängerzugriff, Resolution-Historie und PPR fehlen (R1-OPEN-09). Keine automatische Benachrichtigung, Empfängersichtbarkeit oder Anzeige in der Projektliste garantiert. T verweist auf §5.5.4, im vorliegenden B steht Eskalation unter §5.5.3.',
    evidence: [
      ...e('B', '§5.5.3 Eskalation an Multi-Projektmanagement durchführen'),
      ...e('T', 'Release1-Matrix!A49:Q49; PDP-Abdeckung!A16:H16'),
      ...e('F', 'R1 Funktionsmatrix!A30:J30', 'FS-25'),
      ...e('F', 'Klärungsbedarf!A13:D13', 'R1-OPEN-09'),
    ],
    sections: [
      {
        title: 'Erfassung und Empfängerbearbeitung trennen',
        body: 'B beschreibt eine terminierte Entscheidungsanforderung, wenn die Mittel des Projekts nicht ausreichen. Eskalationen aus Teilprojekten gehen an den PM; als Entscheider nennt B den zuständigen Bereichsleiter. Konkrete Person und Kommunikationsweg müssen tatsächlich vereinbart sein. Assigned To ist kein Zugriffs- oder Zustellnachweis. Das Nachhalten bis zur Entscheidung ist eine fachliche Aufgabe; ein vollständiger Bearbeitungsweg wird hier nicht angeleitet.',
      },
    ],
    actions: [
      'Nach Prüfung der tatsächlichen Bearbeitungsrechte das Kundenprojekt in PWA öffnen, PDP Escalations wählen und einen neuen Eintrag in der Liste Escalations anlegen.',
      'Title als kurze Sachverhaltsbeschreibung und Owner als eskalierende Person erfassen. Assigned To mit dem tatsächlich zuständigen Entscheider und Due Date mit dem benötigten Entscheidungstermin belegen. Den in B beschriebenen Status „gemeldet“ nur verwenden, wenn im Zielstand verfügbar und fachlich passend.',
      'Impact on für die betroffene Zieldimension Leistung, Termine oder Kosten prüfen. Description mit Ursache, Auswirkung und benötigter Entscheidung füllen; Mitigation Plan mit der bevorzugten Option und Contingency Plan mit den Konsequenzen einer ausbleibenden oder verspäteten Entscheidung.',
      'Speichern und den Eintrag erneut öffnen. Angaben einschließlich Adressat und Termin vergleichen. Eine sichtbare Erfassung bestätigt weder Zugriff noch Bearbeitung durch den Empfänger.',
      'Den tatsächlich vereinbarten zusätzlichen Kommunikationsweg für die Information des Entscheiders verwenden. Für die Übung nur vorbereitete Testkonten verwenden. Empfängerzugriff und Projektlistenanzeige gesondert prüfen; bei fehlendem Nachweis bleibt die Übergabe offen.',
    ],
    checks: [
      'Ist klar, welche Entscheidung bis wann von wem benötigt wird und was ohne Entscheidung geschieht?',
      'Sind gespeicherter Eintrag und Adressierung erneut prüfbar, während Empfängerzugriff und Entscheidung als gesonderte Nachweise offen bleiben?',
    ],
    exercise:
      'Fiktiv: Eine externe Genehmigung verzögert sich. Bis 01.06.2027 wird eine Entscheidung zwischen Umplanung und Warten benötigt. Sachverhalt, bevorzugte Option und Konsequenzen in einem vorbereiteten Übungsprojekt erfassen. Den Empfänger nur als geprüftes Testkonto einsetzen; aus dem Eintrag keine erfolgte Entscheidung ableiten.',
  },
  {
    number: '4.12',
    row: 52,
    title: 'Projektstatus ermitteln',
    id: 'status-orientation',
    tool: 'PWA · PDP Status',
    scope: 'R1-25',
    scopeRow: 26,
    section: '§5.5.4 Projektstatus ermitteln',
    fRow: 31,
    orientation: true,
    answer:
      'Orientierung: PM und Projektkernteam begründen gemeinsam den Status aus Fortschritt, Reviewstatus und fachlicher Einschätzung. Die Status-PDP muss vor einer Eingabeübung technisch korrigiert und verifiziert werden.',
    gap: 'T verlangt vor Schulung die Korrektur/Verifikation der FIN-/SAP-Feldzuordnungen und der Statusdarstellung mit einem Schulungsprojekt. F FS-26 ist nur teilweise verifiziert; R1-OPEN-10/-11 lassen Konfiguration und Pflegezyklus offen. Kein ausführbarer Status-Pflegeweg, keine ungeprüfte Feldwirkung. T verweist auf §5.5.3, der aktuelle B-Abschnitt ist §5.5.4.',
    evidence: [
      ...e('B', '§5.5.4 Projektstatus ermitteln'),
      ...e('T', 'Release1-Matrix!A52:Q52; PDP-Abdeckung!A17:H17; Offene Punkte!A4:F4 und A10:F10'),
      ...e('F', 'R1 Funktionsmatrix!A31:J31', 'FS-26'),
      ...e('F', 'Klärungsbedarf!A14:D15', 'R1-OPEN-10 / R1-OPEN-11'),
      ...e('K', 'PDP-Feldkatalog: Status, Recent Achievements; Q4 Contract Execution Z. 117'),
    ],
    sections: [
      {
        title: 'Bewertung vorbereiten',
        body: 'Aktuellen Planfortschritt, Reviewstatus und fachliche Einschätzungen zusammentragen und mit dem Projektkernteam abgleichen. B nennt Red, Amber, Green sowie besser, gleich, schlechter als Status-/Trendwerte; Kommentare begründen die Bewertung, Recent Achievements beschreibt erreichte Fortschritte. Dies sind Quellenangaben und keine Bestätigung der aktuellen Feldkonfiguration oder automatischen Ampelberechnung.',
      },
      {
        title: 'Dimensionen und Zuständigkeit',
        body: 'B nennt Customer Satisfaction, Contract under control, Schedule, Performance, Cost under control, Financials, Resources, SAP PS Quality, PMO Status, Process Quality und Product Quality. PMO Status wird laut B durch das PMO gepflegt. Daraus folgt keine PM-Bearbeitungsberechtigung für alle elf Dimensionen. Die Zuordnung von Financials und SAP PS Quality ist ausdrücklich zu prüfen.',
      },
      {
        title: 'Nachweis vor Eingabeübung',
        body: 'In einem vorbereiteten Schulungsprojekt Feldname, zugrunde liegendes Feld, verfügbare Werte, wirksames Bearbeitungsrecht, gespeicherten Wert und Darstellung nach erneutem Öffnen beziehungsweise im Project Center abgleichen. FIN und SAP getrennt prüfen und Abweichungen dokumentieren. Ohne Korrektur- und Prüfnachweis bleibt es bei Orientierung. Pflegezyklus organisatorisch klären; keine verbindliche Frequenz erfinden.',
      },
    ],
    actions: [],
    checks: [
      'Lässt sich jede Bewertung auf aktuelle Ausgangsinformationen und eine Begründung zurückführen?',
      'Sind FIN-/SAP-Zuordnung, Rechte und Darstellung mit einem Schulungsprojekt nachgewiesen, bevor praktisch gepflegt wird?',
    ],
    exercise:
      'Fiktive Fallbesprechung ohne Systemeingabe: Eine Genehmigung verzögert den Termin, andere Zielgrößen bleiben unverändert. Betroffene Dimension und begründete Einschätzung diskutieren; fehlende Informationen festhalten. Anschließend einen Prüfauftrag für FIN-/SAP-Zuordnung formulieren, keinen erfolgreichen Systemtest behaupten.',
  },
  {
    number: '4.13',
    row: 53,
    title: 'Projektreporting durchführen',
    id: 'r1-reporting',
    tool: 'Project Center · Projektfortschritt- und -status / PDP Status / Escalations',
    scope: 'R1-05',
    scopeRow: 6,
    section: '§5.5.5 Projektreporting durchführen',
    fRow: 10,
    orientation: true,
    answer:
      'R1-Basisreporting anhand von Project Center, Status und Eskalationen vorbereiten und auf die Datenquellen zurückführen. Nur Orientierung und Prüfhilfe, solange Statusfelder und relevante Ansichtsfilter nicht nachgewiesen sind.',
    gap: 'B behauptet ausschließlich L1 in der Statussicht und verweist auf PDP Reporting. T fordert vor ML-Nutzung eine Filterprüfung und entfernt Reporting-PDP/Power BI aus dem R1-Weg. F FS-04/05 sind teilweise verifiziert; R1B-FS-02 bis -04 nicht nachgewiesen. Keine vollständige Portfolio-/L1-Filterwirkung, automatische Aktualisierung oder Power-BI-Nutzbarkeit behaupten. Pflegezyklus bleibt offen.',
    evidence: [
      ...e('B', '§5.5.5 Projektreporting durchführen'),
      ...e('T', 'Release1-Matrix!A53:Q53; PDP-Abdeckung!A18:H18; Offene Punkte!A5:F6 und A10:F10'),
      ...e('F', 'R1 Funktionsmatrix!A9:J10', 'FS-04 / FS-05'),
      ...e('F', 'R1B Abgrenzung!A6:J8', 'R1B-FS-02 bis R1B-FS-04'),
      ...e('S', '02_SCOPE_ID_MASTER!A28:L30', 'R1B-02 bis R1B-04'),
    ],
    sections: [
      {
        title: 'R1-Basisreporting vorbereiten',
        body: 'Voraussetzung sind ein veröffentlichter Projektplan und nachvollziehbare Fortschritts-, Review- und Statusangaben. Im R1-Teilumfang dienen Project Center sowie Status- und Eskalationsdaten als Grundlage. Fehlende oder veraltete Werte bleiben als Lücke sichtbar. Ein Bericht erzeugt keine fehlenden Ausgangsdaten und behebt keine Statusfeldfehler.',
      },
      {
        title: 'ML-Filter und Datenherkunft prüfen',
        body: 'Für eine spätere Nutzung der Ansicht „Projektfortschritt- und -status“ eine bekannte Projektliste mit Portfolio und Ebene bereithalten. Erwartete Projekte mit der tatsächlichen Anzeige und den eingestellten Filtern vergleichen, insbesondere ML. B beschreibt eine L1-Sicht; das Center bestätigt diese Filterwirkung nicht. Angezeigten Fortschritt, Ampeln und Trends einzeln gegen Projektplan und PDP Status prüfen. Abweichungen zuerst an der Quelle klären und den erneut angezeigten Stand prüfen.',
      },
      {
        title: 'Entscheidungsinformation abgrenzen',
        body: 'Offene Eskalationen mit benötigter Entscheidung und Termin benennen. Ein dokumentierter Eintrag ist keine bestätigte Empfängerbearbeitung. Adressaten und Pflegerhythmus tatsächlich abstimmen. Reporting-PDP und Power BI gehören gemäß S/F zu R1B und sind laut T für R1-Basisreporting nicht erforderlich; B wird an dieser Stelle nicht als ausführbarer Weg übernommen.',
      },
    ],
    actions: [],
    checks: [
      'Sind erwartete Projekte und tatsächliche Filterwirkung abgeglichen, einschließlich ML falls verwendet?',
      'Lassen sich Berichtswerte auf den veröffentlichten Plan und geprüfte Status-/Eskalationsdaten zurückführen?',
      'Bleiben Reporting-PDP, Power BI und unbelegte Empfängerbearbeitung außerhalb des R1-Pilotumfangs?',
    ],
    exercise:
      'Fiktive Prüfplanung: Für zwei bekannte Kundenprojekte mit unterschiedlichen Portfolios die erwartete Sichtliste und Datenquellen notieren. Fehlende Filter- oder Statusnachweise als Lücken kennzeichnen. Erst nach separater Verifikation in der Schulungsumgebung Werte vergleichen; keine aktuelle ML-Sicht oder Power-BI-Auswertung voraussetzen.',
  },
];

const fn = (r: ControlRow) => `fn-${r.id}`;
export const controlScope: ScopeItem[] = [
  ['R1-15', 'Tailoring über Deaktivieren und Dokumentieren', 16],
  ['R1-24', 'Eskalationen über PDP Escalations', 25],
  ['R1-25', 'Basisstatus über PDP Status', 26],
  ['R1-05', 'Project Center mit Statussicht', 6],
].map(([id, title, row]) => ({
  id: String(id),
  title: String(title),
  evidence: e('S', `02_SCOPE_ID_MASTER!A${row}:L${row}`, String(id)),
}));
export const controlFunctions: FunctionDefinition[] = controlRows.map((r) => ({
  id: fn(r),
  title: r.title,
  outcome: r.answer,
  aliases: [r.tool],
  roleIds: ['pm'],
  context: {
    projectTypes: ['Contract Execution'],
    levels: ['L1'],
    tools: [r.tool],
    environment: null,
  },
  scopeLinks: [
    {
      scopeId: r.scope,
      coverage: 'partial',
      evidence: e('S', `02_SCOPE_ID_MASTER!A${r.scopeRow}:L${r.scopeRow}`, r.scope),
    },
    ...(r.number === '3.4'
      ? [
          {
            scopeId: 'R1-08',
            coverage: 'partial' as const,
            evidence: e('S', '02_SCOPE_ID_MASTER!A9:L9', 'R1-08'),
          },
        ]
      : []),
  ],
  evidence: r.evidence,
}));
export const controlSteps: ProcessStep[] = controlRows.map((r) => ({
  id: `step-${r.number.replace('.', '-')}`,
  processId: 'projektabwicklung',
  number: r.number,
  title: r.title,
  phase: r.number.startsWith('3.') ? 'Planung' : 'Steuerung',
  roleId: 'pm',
  functionIds: [fn(r)],
  input:
    'Bereitgestelltes Kundenprojekt und fachliche Ausgangsinformationen; Zielumgebung und Rechte vor praktischer Verwendung prüfen.',
  output: r.answer,
  evidence: [...e('T', `Release1-Matrix!A${r.row}:Q${r.row}`, r.number), ...r.evidence],
}));
export const controlIssues: Issue[] = controlRows.map((r) => ({
  id: `issue-${r.id}-boundary`,
  title: `${r.number}: Geltungsbereich und offene Prüfung`,
  status: 'VERIFIKATION ERFORDERLICH',
  subjects: [{ kind: 'function', id: fn(r) }],
  limitation: r.gap,
  evidence: r.evidence,
}));
export const controlAssessments: Assessment[] = [
  ...controlRows.map(
    (r): Assessment => ({
      id: `assessment-${r.id}-technical`,
      subject: { kind: 'function', id: fn(r) },
      dimension: 'technical',
      originalValue: r.number === '3.4' ? 'verifiziert' : 'teilweise verifiziert',
      value: r.number === '3.4' ? 'verified' : 'partial',
      scope:
        r.number === '3.4'
          ? 'Nur FS-16: Tailoring-Bedienprinzip; keine Review-Frequenz, Center-Freigabe oder Zielumgebungsprüfung.'
          : 'Funktionsmatrixbewertung mit begrenztem Nachweis; keine Prüfung dieses Center-Beitrags oder der Zielumgebung.',
      environment: null,
      issueIds: [`issue-${r.id}-boundary`],
      evidence: e('F', `R1 Funktionsmatrix!A${r.fRow}:J${r.fRow}`),
    }),
  ),
  {
    id: 'assessment-escalation-documentation',
    subject: { kind: 'function', id: 'fn-escalation-capture' },
    dimension: 'documentation',
    originalValue: 'NOCH NICHT VERBINDLICH DOKUMENTIEREN',
    value: 'unknown',
    scope:
      'FS-25 Gesamtweg; dieser Center-Entwurf beschränkt sich auf Erfassung und ersetzt keine End-to-end-Freigabe.',
    environment: null,
    issueIds: ['issue-escalation-capture-boundary'],
    evidence: e('F', 'R1 Funktionsmatrix!A30:J30', 'FS-25'),
  },
  {
    id: 'assessment-escalation-training',
    subject: { kind: 'function', id: 'fn-escalation-capture' },
    dimension: 'training',
    originalValue: 'noch nicht schulungsfähig',
    value: 'unknown',
    scope:
      'FS-25 Gesamtweg einschließlich Empfängerbearbeitung; SB1-Zuordnung in T ist kein Schulungsnachweis.',
    environment: null,
    issueIds: ['issue-escalation-capture-boundary'],
    evidence: e('F', 'R1 Funktionsmatrix!A30:J30', 'FS-25'),
  },
];
export const controlArticles: Article[] = controlRows.map((r) => {
  const procedures: Procedure[] = r.orientation
    ? []
    : [
        {
          id: `procedure-${r.id}`,
          title: r.number === '3.4' ? 'Vorgegebenes Tailoring dokumentieren und prüfen' : r.title,
          functionId: fn(r),
          trigger: r.answer,
          prerequisites: [
            'Nur in einer vorab geprüften Übungsumgebung mit fiktiven Daten arbeiten. Projekt, Bearbeitungsrechte, Felder und Client prüfen. Die kritischen Einschränkungen vor Ausführung lesen.',
          ],
          actions: r.actions.map((text) => ({ text, tool: r.tool })),
          expectedResults: [
            r.number === '3.4'
              ? 'Der vorgegebene Meilenstein bleibt mit Begründung erhalten; Tailored und tatsächliche Inaktivität sind getrennt geprüft.'
              : r.number === '4.9'
                ? 'Der Entscheidungsbedarf ist mit Adressat, Termin und Konsequenzen erneut lesbar; Empfängerbearbeitung bleibt separat nachzuweisen.'
                : 'Die externen Ereignisse sind mit fachlich passenden Typen und getrennten Stichtagen und Planterminen erneut auffindbar.',
          ],
          checkQuestions: r.checks,
          evidence: e('B', r.section),
        },
      ];
  return {
    id: `guide-${r.id}`,
    title: r.title,
    summary: r.answer,
    takeaway: r.answer,
    kind: r.orientation ? 'Grundlagen' : 'Anleitung',
    status: 'source-draft',
    topic: r.number.startsWith('3.') ? 'Projektplanung' : 'Status & Reporting',
    roles: ['pm'],
    minutes: 6,
    updated: '2026-09-23',
    sections: [
      ...r.sections,
      ...(r.orientation
        ? [
            {
              title: 'Prüffragen zur Vorbereitung',
              body: 'Diese Prüfung strukturiert die Orientierung und ersetzt keinen Systemnachweis.',
              steps: r.checks,
            },
          ]
        : []),
    ],
    related: [
      'guide-save-publish-checkin',
      ...(r.number.startsWith('3.')
        ? ['guide-deliverables-milestones']
        : controlRows
            .filter((other) => other.number.startsWith('4.') && other.id !== r.id)
            .map((other) => `guide-${other.id}`)),
    ],
    reviews: [],
    revisions: [
      {
        number: 1,
        date: '2026-09-23',
        note: 'v0.7: Originalquellen abgeglichen; keine fachliche Freigabe oder praktische Erprobung.',
        sources: sources
          .filter((s) =>
            [
              'B',
              'T',
              'F',
              'S',
              ...(r.evidence.some((ref) => ref.sourceId === 'K') ? ['K'] : []),
            ].includes(s.id),
          )
          .map((s) => ({ sourceId: s.id, sha256: s.sha256 })),
      },
    ],
    knowledge: {
      functionIds: [fn(r)],
      stepIds: [`step-${r.number.replace('.', '-')}`],
      issueIds: [
        `issue-${r.id}-boundary`,
        'issue-f-r1-open-12',
        ...(r.number === '3.4' ? ['issue-f-r1-open-06'] : []),
      ],
      evidence: r.evidence,
      procedures,
      trainer: {
        objective: r.answer,
        preparation: [
          'Fiktive Daten, geeignete Konten und tatsächlichen Systemstand vorbereiten. Offene fachliche Entscheidungen nicht durch Übungsannahmen ersetzen.',
        ],
        exercise: r.exercise,
        expectedResult: r.checks.join(' '),
        limitation:
          'Quellenentwurf; keine fachliche Freigabe, praktische Erprobung oder Schulungsreife nachgewiesen.',
      },
    },
  };
});
export const controlViews = controlArticles.map((a) => ({
  id: a.id.replace('guide-', ''),
  title: `SB1: ${a.title}`,
  description: a.summary,
  stepIds: a.knowledge!.stepIds,
  articleId: a.id,
}));
