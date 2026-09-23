import type { EvidenceRef } from './domain';
import { evidence } from './sources';

export type Sb1MaterialStatus =
  | 'Reales Teilmaterial vorhanden'
  | 'Nur Quellenhinweis'
  | 'Kein Center-Material';

export interface Sb1CoverageItem {
  number: string;
  originalTitle: string;
  matrixEvidence: EvidenceRef;
  realMaterials: { articleId: string; processStepId: string }[];
  treatedScope: string;
  materialStatus: Sb1MaterialStatus;
  gap: string;
  issueIds: string[];
  supplementaryEvidence: EvidenceRef[];
}

const matrixEvidence = (row: number, number: string) =>
  evidence('T', `Release1-Matrix!A${row}:Q${row}`, number)[0];
const matrixNotes = (row: number) => evidence('T', `Release1-Matrix!M${row}:Q${row}`);

const linked = (
  number: string,
  originalTitle: string,
  row: number,
  articleId: string,
  supportingArticleIds: string[],
  treatedScope: string,
  gap: string,
  issueIds: string[],
  handbookLocator: string,
): Sb1CoverageItem => ({
  number,
  originalTitle,
  matrixEvidence: matrixEvidence(row, number),
  realMaterials: [articleId, ...supportingArticleIds].map((id) => ({
    articleId: id,
    processStepId: `step-${number.replace('.', '-')}`,
  })),
  treatedScope,
  materialStatus: 'Reales Teilmaterial vorhanden',
  gap,
  issueIds,
  supplementaryEvidence: [...evidence('B', handbookLocator), ...matrixNotes(row)],
});

const unlinked = (
  number: string,
  originalTitle: string,
  row: number,
  treatedScope: string,
  gap: string,
  issueIds: string[] = [],
  otherEvidence: EvidenceRef[] = [],
): Sb1CoverageItem => ({
  number,
  originalTitle,
  matrixEvidence: matrixEvidence(row, number),
  realMaterials: [],
  treatedScope,
  materialStatus: 'Nur Quellenhinweis',
  gap,
  issueIds,
  supplementaryEvidence: [...matrixNotes(row), ...otherEvidence],
});

// Nur in Quelle T mit SB1 = Ja markierte Visio-Schritte. Handbuchthemen ohne
// Matrixnummer stehen gesondert unten; TTT- und Readiness-Spalten sind keine
// Center-Schulungs-, Praxis- oder Freigabenachweise.
export const sb1Coverage: Sb1CoverageItem[] = [
  unlinked(
    '1.1',
    'Projekt beantragen',
    3,
    'Kein realer Center-Bedienweg; T nennt Antragsformular und Handbuchbezug.',
    'Quellenkonflikt: T ordnet 1.1 SB1 zu und bewertet den Weg mit Hinweis als freigabefähig. F (FS-02) sieht den Antrag nicht im aktuellen Schulungsumfang, den vollständigen Beantragungs-/Ticketweg als nicht nachgewiesen und fordert, ihn noch nicht verbindlich zu dokumentieren. Antragsweg und Erstzugang müssen geklärt werden.',
    ['issue-f-r1-open-01'],
    evidence('F', 'R1 Funktionsmatrix!A6:J6', 'FS-02'),
  ),
  unlinked(
    '1.2',
    'Projekt anlegen',
    4,
    'Kein realer Center-Bedienweg für die PMO-Bereitstellung.',
    'Ein vollständiger PMO-Durchlauf von Anlage bis bereitgestelltem Projekt fehlt; T nennt begrenzte TTT-Praxis.',
    [],
    evidence('T', 'PDP-Abdeckung!A4:H4', '1.2'),
  ),
  unlinked(
    '2.1',
    'Projektstammdaten anlegen',
    5,
    'Kein realer Center-Teilumfang zur PDP Overview.',
    'Startdatum und EDC müssen abgegrenzt werden; eine automatische Planübernahme ist nicht belegt.',
  ),
  linked(
    '2.2',
    'Projektumfang festlegen',
    6,
    'guide-deliverables-milestones',
    ['faq-milestone-dates', 'guide-save-publish-checkin'],
    'PDP Scope und einzelne Einträge in der List of Deliverables als Grundlage der Lieferplanung.',
    'Führende Quelle, Zuordnung und große Lieferlisten sind offen; keine automatische Plansynchronisierung belegt.',
    ['issue-f-r1-open-08', 'issue-f-r1-open-12'],
    '§3.6.2 Projektumfang festlegen',
  ),
  unlinked(
    '2.3',
    'Projektziele festlegen',
    7,
    'Kein realer Center-Teilumfang zu PDP Objectives und Objectives-Liste.',
    'Eine konkrete Eingabeübung und Ergebnisprüfung für Ziele, Annahmen und Randbedingungen fehlen.',
  ),
  unlinked(
    '2.4',
    'Projektorganisation festlegen',
    8,
    'Kein real angebundener Center-Schritt für Kernteam, Subprojects und Subcontractors; der Zugriffsartikel streift nur die Abgrenzung von Rolle und Recht.',
    'Rollenliste, People-Picker und wirksame Rechte im finalen Systemstand prüfen; Organisationspflege ist noch nicht angeleitet.',
    ['issue-f-r1-open-07'],
    evidence('T', 'PDP-Abdeckung!A9:H9', '2.4'),
  ),
  linked(
    '2.5',
    'Vertragsdaten einpflegen',
    9,
    'guide-deliverables-milestones',
    ['faq-milestone-dates', 'guide-save-publish-checkin'],
    'Zahlungsbedingungen und Fristen in PDP Contract als Eingang für Zahlungsmeilensteine.',
    'Vertragsfelder, EDC-Abgrenzung und fachlich wirksame Eingaberechte im Zielkontext prüfen.',
    ['issue-payment-terms-context', 'issue-f-r1-open-12'],
    '§3.6.3 Vertragsdaten einpflegen',
  ),
  linked(
    '2.6',
    'Teilprojektleiter einsetzen',
    10,
    'guide-project-permissions',
    ['faq-role-vs-access', 'guide-save-publish-checkin'],
    'Owner-Wechsel für System- oder ILS-Teilprojekt mit vorher gesichertem PM-Lesezugriff und Subprojects-Abgleich.',
    'Effektive Rechte, Konten, Bestands-Sites und Schulungsumgebung bleiben offen; der Trainerentwurf ist kein praktischer Nachweis.',
    ['issue-f-r1-open-07', 'issue-f-r1-open-01', 'issue-f-r1-open-02', 'issue-f-r1-open-12'],
    '§3.6.7 Teilprojektleiter einsetzen',
  ),
  linked(
    '2.7',
    'Zugriffsrechte festlegen',
    11,
    'guide-project-permissions',
    ['faq-role-vs-access'],
    'Project Permissions für zusätzliche Stakeholder; Build Team wird als abweichender Handbuchweg kenntlich gemacht.',
    'T beschränkt SB1 auf Project Permissions, B beschreibt zusätzlich Build Team; Synchronisierung und effektive Rechte sind ungeklärt.',
    [
      'issue-build-sync',
      'issue-f-r1-open-07',
      'issue-f-r1-open-01',
      'issue-f-r1-open-02',
      'issue-f-r1-open-12',
    ],
    '§3.6.6 Zugriffsrechte festlegen',
  ),
  unlinked(
    '2.8',
    'Stammdaten für System-TP anlegen',
    12,
    'Kein realer Center-Teilumfang für System Overview; die Owner-Anleitung nutzt die Ansicht nur für die Übergabe.',
    'Stammdatenpflege des System-Teilprojekts samt Ergebnisprüfung fehlt.',
    [],
    evidence('T', 'PDP-Abdeckung!A10:H10', '2.8'),
  ),
  unlinked(
    '2.9',
    'Projektumfang für System-TP festlegen',
    13,
    'Kein realer Center-Teilumfang für System Scope.',
    'Fachliche Scope-Eingabe und Ergebnisprüfung für das System-Teilprojekt fehlen.',
    [],
    evidence('T', 'PDP-Abdeckung!A11:H11', '2.9'),
  ),
  unlinked(
    '2.10',
    'Projektorganisation für System-TP festlegen',
    14,
    'Kein realer Center-Teilumfang für System Organ.',
    'Finale Rollenliste und wirksame Rechte prüfen; die Organisationspflege ist nicht angeleitet.',
    ['issue-f-r1-open-07'],
    evidence('T', 'PDP-Abdeckung!A12:H12', '2.10'),
  ),
  linked(
    '2.11',
    'Zugriffsrechte für System-TP festlegen',
    15,
    'guide-project-permissions',
    ['faq-role-vs-access'],
    'Project Permissions im System-Teilprojekt; Abgrenzung zur operativen Teamzuordnung.',
    'T verneint eine Build-Team-Pflicht für SB1, B beschreibt sie; effektive Rechte und Site-Zugriff prüfen.',
    ['issue-build-sync', 'issue-f-r1-open-07', 'issue-f-r1-open-02', 'issue-f-r1-open-12'],
    '§3.8.4 Zugriffsrechte für System-TP festlegen',
  ),
  unlinked(
    '2.12',
    'Stammdaten für ILS-TP anlegen',
    16,
    'Kein realer Center-Teilumfang für ILS Overview; die Owner-Anleitung nutzt die Ansicht nur für die Übergabe.',
    'Stammdatenpflege des ILS-Teilprojekts samt Ergebnisprüfung fehlt.',
    [],
    evidence('T', 'PDP-Abdeckung!A13:H13', '2.12'),
  ),
  unlinked(
    '2.13',
    'Projektumfang für ILS-TP festlegen',
    17,
    'Kein realer Center-Teilumfang für ILS Scope.',
    'Fachliche Scope-Eingabe und Ergebnisprüfung für das ILS-Teilprojekt fehlen.',
    [],
    evidence('T', 'PDP-Abdeckung!A14:H14', '2.13'),
  ),
  unlinked(
    '2.14',
    'Projektorganisation für ILS-TP festlegen',
    18,
    'Kein realer Center-Teilumfang für ILS Organisation.',
    'Finale Rollenliste und wirksame Rechte prüfen; die Organisationspflege ist nicht angeleitet.',
    ['issue-f-r1-open-07'],
    evidence('T', 'PDP-Abdeckung!A15:H15', '2.14'),
  ),
  linked(
    '2.15',
    'Zugriffsrechte für ILS-TP festlegen',
    19,
    'guide-project-permissions',
    ['faq-role-vs-access'],
    'Project Permissions im ILS-Teilprojekt; Abgrenzung zur operativen Teamzuordnung.',
    'T verneint eine Build-Team-Pflicht für SB1, B beschreibt sie; effektive Rechte und Site-Zugriff prüfen.',
    ['issue-build-sync', 'issue-f-r1-open-07', 'issue-f-r1-open-02', 'issue-f-r1-open-12'],
    '§3.9.4 Zugriffsrechte für ILS-TP festlegen',
  ),
  linked(
    '3.1',
    'Liefermeilensteine planen',
    20,
    'guide-deliverables-milestones',
    ['faq-milestone-dates', 'guide-save-publish-checkin'],
    'Liefergegenstand, Ext.Del, Stichtag und Plantermin im MS Project Client abgleichen.',
    'Zuordnung zur Lieferliste, Ausgangsplan und Client-Stand bleiben zu prüfen.',
    ['issue-f-r1-open-08', 'issue-milestone-client', 'issue-f-r1-open-12'],
    '§4.5.2 Liefermeilensteine planen',
  ),
  linked(
    '3.2',
    'Zahlungsmeilensteine planen',
    21,
    'guide-deliverables-milestones',
    ['faq-milestone-dates', 'guide-save-publish-checkin'],
    'Ext.Pay mit lieferungsabhängiger Frist oder begründeter direkter Terminierung.',
    'Beide Varianten, Vertragsbezug und veröffentlichter Planstand sind im Zielsystem nicht separat belegt.',
    ['issue-payment-terms-context', 'issue-milestone-client', 'issue-f-r1-open-12'],
    '§4.5.3 Zahlungsmeilensteine planen',
  ),
  unlinked(
    '3.3',
    'Weitere Projektmeilensteine planen',
    22,
    'Kein realer Center-Teilumfang für weitere Meilensteintypen.',
    'Beispiele für Beistellungen und Genehmigungen sowie passende Ergebnisprüfungen fehlen.',
  ),
  unlinked(
    '3.4',
    'Projektphasen und LCM Review-Termine planen',
    23,
    'Kein realer Center-Teilumfang für Phasen und LCM Reviews.',
    'Keine abschließend einheitliche Regel belegt: T fordert eine jährliche Grundregel, F lässt die konkrete 3er-Review-Frequenz unter R1-OPEN-06 offen, und der Handbuchentwurf (§4.5.5) beschreibt Varianten für Abstände über zwei beziehungsweise unter einem Jahr. Fachregel, Planungsweg und Terminprüfung bleiben offen.',
    ['issue-f-r1-open-06'],
    [
      ...evidence('F', 'R1 Funktionsmatrix!A14:J14', 'FS-09'),
      ...evidence('F', 'Klärungsbedarf!A10:D10', 'R1-OPEN-06'),
      ...evidence('B', '§4.5.5 Projektphasen und LCM-Review-Termine planen'),
    ],
  ),
  unlinked(
    '4.9',
    'Eskalation an Multi-Projektmanagement durchführen',
    49,
    'Kein realer Center-Bedienweg; T nennt Erfassung in PDP Escalations.',
    'Erfassung und Adressierung abgrenzen; Empfängerbearbeitung ist laut T nicht Teil dieses SB1-Wegs und F bewertet den weiteren Workflow abweichend.',
    [],
    [
      ...evidence('T', 'PDP-Abdeckung!A16:H16', '4.9'),
      ...evidence('F', 'R1 Funktionsmatrix!A30:J30'),
    ],
  ),
  unlinked(
    '4.12',
    'Projektstatus ermitteln',
    52,
    'Kein realer Center-Bedienweg für PDP Status; T nennt Ampeln, Trends und Kommentare.',
    'Technische Feldkorrektur und Verifikation mit einem Schulungsprojekt stehen vor Nutzung aus.',
    [],
    evidence('T', 'PDP-Abdeckung!A17:H17', '4.12'),
  ),
  unlinked(
    '4.13',
    'Projektreporting durchführen',
    53,
    'Kein realer Center-Bedienweg; T beschreibt Basisreporting über Project Center, Status und Escalations.',
    'ML-Filter der Project-Center-Sicht prüfen; Power BI wurde in T nur als zukünftiger Umfang besprochen.',
    [],
    evidence('T', 'PDP-Abdeckung!A18:H18', '4.13'),
  ),
];

export const sb1AdditionalHandbookTopics = [
  {
    title: 'Reviewstatus pflegen',
    note: 'Handbuchthema ohne eigene Nummer unter den 24 SB1-Matrixschritten; im Center noch kein realer Bedienweg.',
    evidence: evidence('B', '§5.5.1 Reviewstatus pflegen'),
  },
  {
    title: 'Projektfortschritt pflegen',
    note: 'Handbuchthema ohne eigene Nummer unter den 24 SB1-Matrixschritten; nicht mit dem Demo-Lernfortschritt gleichsetzen.',
    evidence: evidence('B', '§5.5.2 Projektfortschritt pflegen'),
  },
];
