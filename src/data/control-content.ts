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
      'LCM-3 ist wegen Auditierung einmal pro Kalenderjahr erforderlich. Phasen und Reviews entsprechend einordnen; Tailoring nur nach separat vorgegebener fachlicher Entscheidung üben. Ein rollierender 12-Monats-Rhythmus ist nicht beschlossen.',
    gap: 'R1-OPEN-06 ist geklärt: LCM-3 einmal pro Kalenderjahr. Noch offen bleiben weitere LCM-Terminansätze einschließlich LCM5, der konkrete Ausgangsplan, Verknüpfungen und Verschiebewirkungen. ProjectLink-Übernahme und Restriktionen sind in Bearbeitung (TTT-D-38). Der funktionierende WWS-/WBS-Generator erledigt diese Restpunkte nicht. Hard Links nicht nutzen und nicht schulen.',
    evidence: [
      ...e('C23', 'Punkte 8–9 und 11'),
      ...e('TTT', 'Zeilen 27, 31–32, 39 und 47, A:G'),
      ...e('B', '§4.5.5 Projektphasen und LCM-Review-Termine planen'),
      ...e('T', 'Regeln & Entscheidungen!A7:D7'),
      ...e('F', 'R1 Funktionsmatrix!A21:J21', 'FS-16'),
      ...e('F', 'Klärungsbedarf!A10:D10', 'R1-OPEN-06'),
      ...e('K', 'Enterprise Custom Fields: Tailored; Lookup Table ATLAS Tailoring Status'),
    ],
    sections: [
      {
        title: 'Phasenplanung und bestätigte LCM-3-Regel',
        body: 'LCM-3 ist wegen Auditierung einmal pro Kalenderjahr erforderlich. Ein rollierender 12-Monats-Rhythmus, etwa ab Projektstart, wird nur als Verbesserung diskutiert und ist noch nicht beschlossen. B beschreibt Reviewtermine als Steuerung verknüpfter Phasen über Anfang und Stichtag. Weitere Reviewtypen, LCM5 und tatsächliche Verschiebewirkungen bleiben gesondert zu prüfen.',
      },
      {
        title: 'Tailoring ist keine Frequenzentscheidung',
        body: 'F FS-16 bewertet das Tailoring-Bedienprinzip als verifiziert. Die inzwischen bestätigte Kalenderjahrregel für LCM-3 darf damit nicht umgangen werden: LCM-3 nicht pauschal entfernen. Der folgende Teilweg setzt eine gesonderte fachliche Entscheidung voraus und bestimmt selbst keinen entfallenden Review.',
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
    gap: 'T nennt 4.9 freigabefähig und begrenzt SB1 auf Erfassung. F FS-25 bewertet den Gesamtweg als noch nicht verbindlich dokumentierbar und nicht schulungsfähig: Empfängerzugriff und Resolution-Historie bleiben technisch offen (R1-OPEN-09 / TTT-D-36/-37). Der vollständige PPR-Prozess ist laut TTT-D-35 ein zukünftiges prozessuales Thema eher nach R1B. Keine automatische Benachrichtigung, Empfängersichtbarkeit oder Anzeige in der Projektliste garantiert. T verweist auf §5.5.4, im vorliegenden B steht Eskalation unter §5.5.3.',
    evidence: [
      ...e('TTT', 'Zeilen 36–38, A:G', 'TTT-D-35/-36/-37'),
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
    orientation: false,
    answer:
      'PM und Projektkernteam ermitteln den Basisstatus; der PM pflegt die ihm zugänglichen Dimensionen mit Ampel, Trend, Kommentar und Recent Achievements auf PDP Status. PMO Status bleibt beim PMO. Der gespeicherte Stand ist mit Plan, Reviewstatus und Projektstatusübersicht abzugleichen.',
    gap: 'Nur der PM-Pflegeweg im R1-/SB1-Kontext ist beschrieben; PMO Status wird durch das PMO gepflegt. FIN-/SAP-Feldkorrektur ist bestätigt (TTT-D-39), ebenso die Projektstatusübersicht; das belegt keine Bearbeitungsrechte in der Zielumgebung. Bestands-Sites können abweichen, Änderungen werden nicht automatisch nachgezogen (TTT-D-40). Pflegezyklus und praktische Schulungserprobung bleiben offen (TTT-D-42). T verlangte vor Schulung die inzwischen bestätigte Feldkorrektur und verweist auf §5.5.3; im vorliegenden B steht Statuspflege unter §5.5.4. F bewertet den Gesamtstand weiter nur teilweise verifiziert.',
    evidence: [
      ...e('C23', 'Punkte 5 und 7'),
      ...e('TTT', 'Zeilen 40–43, A:G'),
      ...e('B', '§5.5.4 Projektstatus ermitteln'),
      ...e('T', 'Release1-Matrix!A52:Q52; PDP-Abdeckung!A17:H17; Offene Punkte!A4:F4 und A10:F10'),
      ...e('F', 'R1 Funktionsmatrix!A31:J31', 'FS-26'),
      ...e('F', 'Klärungsbedarf!A14:D15', 'R1-OPEN-10 / R1-OPEN-11'),
      ...e('K', 'PDP-Feldkatalog: Status, Recent Achievements; Q4 Contract Execution Z. 117'),
    ],
    sections: [
      {
        title: 'Dimensionen und Zuständigkeit',
        body: 'B §5.5.4 nennt Customer Satisfaction, Contract under control, Schedule, Performance, Cost under control, Financials, Resources, SAP PS Quality, PMO Status, Process Quality und Product Quality. PMO Status wird durch das PMO gepflegt; die PM-Anleitung umfasst diesen Eintrag nicht. C23 Punkt 5 bestätigt die Korrektur der FIN-/SAP-Zuordnung. Ein allgemeiner Pflegezyklus oder eine automatische Ampelberechnung sind damit nicht belegt.',
      },
    ],
    actions: [
      'Prüfen Sie den gepflegten Projektfortschritt im veröffentlichten Plan und den aktuellen Reviewstatus. Stimmen Sie die fachliche Einschätzung der betroffenen Statusdimensionen mit dem Projektkernteam ab.',
      'Öffnen Sie das Kundenprojekt in PWA und wechseln Sie zur PDP Status. Prüfen Sie, welche Dimensionen mit dem vorgesehenen PM-Konto tatsächlich bearbeitbar sind; PMO Status wird durch das PMO gepflegt.',
      'Wählen Sie für jede von Ihnen zu pflegende Dimension im Feld Status Red, Amber oder Green und im Feld Trend besser, gleich oder schlechter. Begründen Sie die Bewertung im zugehörigen Kommentar; Amber und Red sind laut B stets zu kommentieren.',
      'Halten Sie die seit dem letzten Bericht erreichten Fortschritte unter Recent Achievements fest. Speichern Sie die Projektdetailseite.',
      'Öffnen Sie den gespeicherten Stand erneut. Vergleichen Sie Status, Trend, Kommentare und Recent Achievements mit Ihrer Bewertung sowie mit Planfortschritt und Reviewstatus. Prüfen Sie die Darstellung in der bestätigten Projektstatusübersicht; bei Abweichungen insbesondere Rechte und Bestands-Site-Konfiguration gesondert klären.',
    ],
    checks: [
      'Lässt sich jede vom PM gepflegte Bewertung auf Fortschritt, Reviewstatus und die gemeinsame fachliche Einschätzung zurückführen?',
      'Sind Amber und Red kommentiert und sind Status, Trend sowie Recent Achievements nach dem Speichern wieder auffindbar?',
      'Stimmt die Projektstatusübersicht mit den gespeicherten Angaben überein, ohne PMO Status als PM-Eingabe zu behandeln?',
    ],
    exercise:
      'Didaktischer Vorschlag mit fiktiven Daten: Eine Genehmigung verzögert den Termin. Zuerst im Gespräch die betroffene Dimension, Ampel, Trend und Begründung aus vorbereitetem Plan- und Reviewstand ableiten. Nur in einem vorgeprüften Schulungsprojekt mit bestätigten PM-Rechten die eigene Bewertung auf PDP Status speichern und gegen die Projektstatusübersicht prüfen. PMO Status nicht ändern; eine Leseübung ist kein praktischer Systemnachweis.',
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
      'R1-Basisreporting über die funktionierende Projektstatusübersicht im Project Center vorbereiten. ML-Filter ist neben PSPV.org und WW umgesetzt. Angaben auf Projektplan, Status und Eskalationen zurückführen; Reporting-PDP und Power BI bleiben außerhalb dieses R1-Wegs.',
    gap: 'ML-Filter und Projektstatusübersicht mit erwarteten Projekten und Daten sind bestätigt. Keine offene Filterkorrektur mehr. Reporting-PDP/Power BI bleiben außerhalb des R1-Schulungsumfangs (R1B-FS-02 bis -04); eine universelle L1- oder Aktualisierungsregel wird daraus nicht abgeleitet. Pflegezyklus und vollständiger PPR-Prozess sind zukünftige prozessuale Themen nach R1B. Praktische Center-Erprobung bleibt offen.',
    evidence: [
      ...e('C23', 'Punkte 6–7'),
      ...e('TTT', 'Zeilen 41–43, A:G'),
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
        title: 'ML-Filter nutzen und Datenherkunft nachvollziehen',
        body: 'Nutzen Sie die Ansicht „Projektfortschritt- und -status“ im Project Center. Sie funktioniert mit den erwarteten Projekten und Daten korrekt. ML ist neben PSPV.org und WW als Filter umgesetzt. Passenden Filter auswählen und Fortschritt, Ampeln und Trends anhand von Projektplan und PDP Status nachvollziehen. Bei späteren Abweichungen Datenquelle und Aktualität prüfen; die alte Filterlücke ist geschlossen.',
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
      'Fiktiver Vergleich: Für zwei vorbereitete Kundenprojekte die passende Portfolioauswahl, darunter ML, nutzen und angezeigte Werte mit Plan und Status vergleichen. Die funktionierende Übersicht ist die Grundlage; Power BI ist nicht Teil der Übung.',
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
        r.number === '4.12'
          ? 'Aktualisiert 23.09.2026: FIN-/SAP-Felder korrigiert; Bestands-Sites und Pflegezyklus gesondert behandeln.'
          : r.number === '4.13'
            ? 'Aktualisiert 23.09.2026: ML-Filter neben PSPV.org und WW sowie erwartete Projekte und Daten der Statusübersicht bestätigt; keine Power-BI-Abnahme.'
            : r.number === '3.4'
              ? 'Nur FS-16: Tailoring-Bedienprinzip; keine Review-Frequenz, Center-Freigabe oder Zielumgebungsprüfung.'
              : 'Funktionsmatrixbewertung mit begrenztem Nachweis; keine Prüfung dieses Center-Beitrags oder der Zielumgebung.',
      environment: null,
      issueIds: [`issue-${r.id}-boundary`],
      evidence: [
        ...e('F', `R1 Funktionsmatrix!A${r.fRow}:J${r.fRow}`),
        ...r.evidence.filter((ref) => ['TTT', 'C23'].includes(ref.sourceId)),
      ],
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
          trigger:
            r.number === '4.12'
              ? 'Der aktuelle Projektstand soll als begründete Ampel- und Trendbewertung für das R1-Basisreporting festgehalten werden.'
              : r.answer,
          prerequisites: [
            ...(r.number === '4.12'
              ? [
                  'Der PM hat ein bereitgestelltes Contract-Execution-Kundenprojekt, einen veröffentlichten Plan mit gepflegtem Fortschritt und einen aktuellen Reviewstatus. Projektkernteam und fachliche Bewertungsgrundlagen stehen zur Abstimmung bereit.',
                  'Vor einer praktischen Übung PM-Bearbeitungsrechte, PDP Status und Bestands-Site-Konfiguration mit dem vorgesehenen Konto prüfen. Die kritischen Einschränkungen vor Ausführung lesen; nur fiktive Übungsdaten verwenden.',
                ]
              : [
                  'Nur in einer vorab geprüften Übungsumgebung mit fiktiven Daten arbeiten. Projekt, Bearbeitungsrechte, Felder und Client prüfen. Die kritischen Einschränkungen vor Ausführung lesen.',
                ]),
          ],
          actions: r.actions.map((text) => ({ text, tool: r.tool })),
          expectedResults: [
            r.number === '3.4'
              ? 'Der vorgegebene Meilenstein bleibt mit Begründung erhalten; Tailored und tatsächliche Inaktivität sind getrennt geprüft.'
              : r.number === '4.9'
                ? 'Der Entscheidungsbedarf ist mit Adressat, Termin und Konsequenzen erneut lesbar; Empfängerbearbeitung bleibt separat nachzuweisen.'
                : r.number === '4.12'
                  ? 'Die vom PM gepflegten Statusdimensionen, Trends, Kommentare und Recent Achievements sind nach dem Speichern erneut lesbar und fachlich mit Plan und Reviewstatus abgeglichen; PMO Status bleibt beim PMO.'
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
    takeaway:
      r.number === '4.12'
        ? 'Planfortschritt und Reviewstatus mit dem Projektkernteam abgleichen, dann die eigenen Statusdimensionen auf PDP Status bewerten, begründen, speichern und erneut prüfen. PMO Status pflegt das PMO. Bearbeitungsrechte und mögliche Abweichungen bei Bestands-Sites vor der Anwendung prüfen.'
        : r.answer,
    kind: r.orientation ? 'Grundlagen' : 'Anleitung',
    status: 'source-draft',
    topic: r.number.startsWith('3.') ? 'Projektplanung' : 'Status & Reporting',
    roles: ['pm'],
    minutes: r.number === '4.12' ? 8 : 6,
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

// Explicit source snapshot for the confirmed clarification revision of 23 September.
for (const article of controlArticles.filter((a) =>
  ['guide-external-milestones', 'guide-escalation-capture'].includes(a.id),
)) {
  if (article.status === 'demo') continue;
  article.updated = '2026-09-23';
  article.revisions.push({
    number: article.revisions.length + 1,
    date: '2026-09-23',
    note: 'Abgestimmte Restpunkte und ausdrückliche Klärungen eingearbeitet; ältere Quellen erhalten, verbleibende technische Grenzen getrennt.',
    sources: [
      { sha256: 'E4AED78DC586A4F60CC98B411F109D8E59295A78CE570BF23005C7247AFD7727', sourceId: 'B' },
      { sha256: 'B68766FE1877A72A2E437F354ED7441C990C6D640E0A9185D77A22F04A35B0A4', sourceId: 'F' },
      { sha256: 'E33A4CF88E48B201040BC93B82FFA5DCEEC0C9EEC5F0DFBF63665E8EEF908939', sourceId: 'S' },
      { sha256: '1F6F3C23BDA042B67E9DB2BC88722EDBBA3C2591CA3F6AEA2A73FC9335C5A0DB', sourceId: 'T' },
      {
        sha256: 'F20FC9AA5DCF380FA4E0CDB7F5D1E301DB8C89620AFA62B345107160FF2CBC36',
        sourceId: 'TTT',
      },
    ],
  });
}

// Explicit source snapshot for the confirmed clarification revision of 23 September.
for (const article of controlArticles.filter((a) =>
  ['guide-phases-tailoring', 'guide-status-orientation'].includes(a.id),
)) {
  if (article.status === 'demo') continue;
  article.updated = '2026-09-23';
  article.revisions.push({
    number: article.revisions.length + 1,
    date: '2026-09-23',
    note: 'Abgestimmte Restpunkte und ausdrückliche Klärungen eingearbeitet; ältere Quellen erhalten, verbleibende technische Grenzen getrennt.',
    sources: [
      { sha256: 'E4AED78DC586A4F60CC98B411F109D8E59295A78CE570BF23005C7247AFD7727', sourceId: 'B' },
      {
        sha256: 'B0A43BEBC4F414190DB98EB28576BC4B3DDBA888BCD31D19E1DECC478154751D',
        sourceId: 'C23',
      },
      { sha256: 'B68766FE1877A72A2E437F354ED7441C990C6D640E0A9185D77A22F04A35B0A4', sourceId: 'F' },
      { sha256: '0C3A2170420C73F1F76A723797AE0D59B6230F27E6B7382DD1616CE90D7B3AB2', sourceId: 'K' },
      { sha256: 'E33A4CF88E48B201040BC93B82FFA5DCEEC0C9EEC5F0DFBF63665E8EEF908939', sourceId: 'S' },
      { sha256: '1F6F3C23BDA042B67E9DB2BC88722EDBBA3C2591CA3F6AEA2A73FC9335C5A0DB', sourceId: 'T' },
      {
        sha256: 'F20FC9AA5DCF380FA4E0CDB7F5D1E301DB8C89620AFA62B345107160FF2CBC36',
        sourceId: 'TTT',
      },
    ],
  });
}

// Explicit source snapshot for the confirmed clarification revision of 23 September.
for (const article of controlArticles.filter((a) => ['guide-r1-reporting'].includes(a.id))) {
  if (article.status === 'demo') continue;
  article.updated = '2026-09-23';
  article.revisions.push({
    number: article.revisions.length + 1,
    date: '2026-09-23',
    note: 'Abgestimmte Restpunkte und ausdrückliche Klärungen eingearbeitet; ältere Quellen erhalten, verbleibende technische Grenzen getrennt.',
    sources: [
      { sha256: 'E4AED78DC586A4F60CC98B411F109D8E59295A78CE570BF23005C7247AFD7727', sourceId: 'B' },
      {
        sha256: 'B0A43BEBC4F414190DB98EB28576BC4B3DDBA888BCD31D19E1DECC478154751D',
        sourceId: 'C23',
      },
      { sha256: 'B68766FE1877A72A2E437F354ED7441C990C6D640E0A9185D77A22F04A35B0A4', sourceId: 'F' },
      { sha256: 'E33A4CF88E48B201040BC93B82FFA5DCEEC0C9EEC5F0DFBF63665E8EEF908939', sourceId: 'S' },
      { sha256: '1F6F3C23BDA042B67E9DB2BC88722EDBBA3C2591CA3F6AEA2A73FC9335C5A0DB', sourceId: 'T' },
      {
        sha256: 'F20FC9AA5DCF380FA4E0CDB7F5D1E301DB8C89620AFA62B345107160FF2CBC36',
        sourceId: 'TTT',
      },
    ],
  });
}

const statusArticle = controlArticles.find((article) => article.id === 'guide-status-orientation')!;
if (statusArticle.status !== 'demo') {
  statusArticle.updated = '2026-09-29';
  statusArticle.revisions.push({
    number: 3,
    date: '2026-09-29',
    note: 'B §5.5.4 als begrenzten PM-Pflegeweg im Center ergänzt; C23-Korrekturen und verbleibende Rechte-/Bestands-Site-Grenzen abgeglichen. Quellenentwurf ohne praktische Prüfung oder fachliche Freigabe.',
    sources: statusArticle.revisions.at(-1)!.sources.map((source) => ({ ...source })),
  });
}
