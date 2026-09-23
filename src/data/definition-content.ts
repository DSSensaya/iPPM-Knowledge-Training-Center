import type { Article, ContentRevision } from './types';
import type { Procedure } from './domain';
import { definitionRows, definitionIssues } from './definition-catalog';
import { evidence as e } from './sources';

const revision: ContentRevision = {
  number: 1,
  date: '2026-09-23',
  note: 'v0.6: Quellenabgleich für Projekt- und Teilprojektdefinition; keine fachliche Freigabe oder Zielumgebungsprüfung.',
  sources: [
    { sourceId: 'B', sha256: 'E4AED78DC586A4F60CC98B411F109D8E59295A78CE570BF23005C7247AFD7727' },
    { sourceId: 'F', sha256: 'B68766FE1877A72A2E437F354ED7441C990C6D640E0A9185D77A22F04A35B0A4' },
    { sourceId: 'S', sha256: 'E33A4CF88E48B201040BC93B82FFA5DCEEC0C9EEC5F0DFBF63665E8EEF908939' },
    { sourceId: 'T', sha256: '1F6F3C23BDA042B67E9DB2BC88722EDBBA3C2591CA3F6AEA2A73FC9335C5A0DB' },
    { sourceId: 'K', sha256: '58B5383B70C9E565AD85058752819B16E7603A55DC98184A4F4A2036CC8D5688' },
  ],
};
const prerequisite =
  'Das betreffende Projekt ist durch das PMO bereitgestellt und übergeben. Fachliche Ausgangsangaben liegen vor; tatsächlicher Zugriff und Bearbeitungsrechte sind mit dem vorgesehenen Konto geprüft. Eine sichtbare PDP genügt nicht.';
const procedure = (
  id: string,
  title: string,
  fn: string,
  tool: string,
  actions: string[],
  checks: string[],
  locator: string,
): Procedure => ({
  id,
  title,
  functionId: fn,
  trigger: 'Die fachliche Definition soll ergänzt oder geprüft werden.',
  prerequisites: [prerequisite],
  actions: actions.map((text) => ({ text, tool })),
  expectedResults: [checks[0]],
  checkQuestions: checks,
  evidence: e('B', locator),
});

const master = procedure(
  'procedure-project-master-data',
  'Kundenprojekt auf Overview vervollständigen',
  'fn-project-master-data',
  'PWA / Project Center / PDP Overview',
  [
    'Öffnen Sie das Kundenprojekt im Project Center und rufen Sie Overview auf. Prüfen Sie Contract Execution / L1 und den bereitgestellten Kontext; melden Sie strukturelle Abweichungen dem PMO.',
    'Prüfen Sie Project-Name und Owner; ergänzen Sie eine präzise Short Description. Ändern Sie den Owner nur im abgestimmten Übergabeprozess.',
    'Pflegen Sie Security Classification und ISMS Classification nach der höchsten Einstufung der verarbeiteten Informationen. Pflegen Sie Project Credits (TKMS) anhand des vorgesehenen Project Categorization Template. B beschreibt Category (TKMS) als daraus abgeleitet; kontrollieren Sie die Anzeige im Zielstand.',
    'Prüfen Sie Portfolio und Program. Laut B stammen sie aus PMO-Feldern und sind nicht direkt editierbar. Melden Sie Abweichungen dem PMO. Pflegen Sie Customer Country und Contractor, soweit fachlich erforderlich.',
    'Ergänzen Sie vorhandene Contract-ID (CLM), Offer-No. (SAP AK), SAP-ID (SAP PS), additional References und General Remarks. Project ID ist ein Strukturmerkmal; nicht fachlich umbenennen.',
    'Prüfen Sie Project Phase und das verpflichtende Start Date gegen den fachlich gültigen Projektbeginn. B beschreibt bei Neuanlage zunächst das Tagesdatum; prüfen und korrigieren Sie den Beginn nach Bereitstellung bei Bedarf. Prüfen Sie Finish Date gegen den Projektplan. EDC, Vertragsbeginn und Projektstart nicht gleichsetzen; keine automatische Verschiebung eines vorhandenen Plans voraussetzen.',
  ],
  [
    'Sind Kurzbeschreibung, Klassifikation, Referenzen und fachlicher Beginn vollständig und plausibel?',
    'Stimmen PMO-Strukturfelder mit dem Antrag überein?',
    'Wurde der vorhandene Plan getrennt geprüft, statt eine Terminübernahme zu unterstellen?',
  ],
  '§3.6.1 Tabelle 10; §3.1.2',
);

const objectives = procedure(
  'procedure-project-objectives',
  'Ziele, Annahmen und Randbedingungen erfassen',
  'fn-project-objectives',
  'PDP Objectives / Objectives-Liste',
  [
    'Stimmen Sie Ziele mit Projektsponsor und Projektkernteam ab; öffnen Sie Objectives im Kundenprojekt.',
    'Legen Sie je fachlich eigenständigem Ziel einen eigenen Listeneintrag an: Kurzbezeichnung und Projektziel als überprüfbaren Sollzustand, zugehörigen Stakeholder und eine tatsächlich verfügbare Zielklasse aus dem Lookup. Der Portfolio-Owner kann laut B als Sponsor geführt werden.',
    'Prüfen Sie nach dem Anlegen den in B beschriebenen Initialstatus „geplant“. Spätere Änderungen richten sich nach dem tatsächlichen Zielstatus. Ein abweichender Initialstatus ist ein Prüfpunkt, kein Anlass, eine Systemwirkung zu behaupten.',
    'Erfassen Sie unter Assumptions noch zu bestätigende Planungsannahmen und unter Constraints feststehende Einschränkungen. Führen Sie beides getrennt von Zielen.',
    'Speichern Sie die Eingaben. Öffnen Sie die bearbeiteten Angaben erneut und vergleichen Sie Ziele, Annahmen und Randbedingungen mit Scope, Liefergegenständen und Phasen-/Meilensteinplanung.',
  ],
  [
    'Ist jedes Ziel ein überprüfbarer Sollzustand mit Stakeholder und vorgegebener Zielklasse?',
    'Sind Annahmen und verbindliche Randbedingungen getrennt erfasst?',
    'Sind die gespeicherten Einträge wieder auffindbar und fachlich konsistent?',
  ],
  '§3.6.4 Tabelle 12',
);

const organization = procedure(
  'procedure-project-organization',
  'Kernteam, Teilprojekte und Unteraufträge dokumentieren',
  'fn-project-organization',
  'PDP Organisation',
  [
    'Öffnen Sie Organisation im Kundenprojekt. Prüfen Sie die verfügbaren Listen und die Personenauswahl mit dem vorgesehenen Konto.',
    'Pflegen Sie im Project Core Team je Mitarbeiter die Projektrolle und die zugehörige Prozessrolle. Verwenden Sie die tatsächlich verfügbaren Rollenwerte.',
    'Pflegen Sie unter Subprojects Name, Scope und Teilprojektleiter. Vergleichen Sie die Einträge mit der bereitgestellten Struktur und dem abgestimmten Owner. Die Liste ersetzt weder die PMO-Anlage noch einen Owner-Wechsel.',
    'Dokumentieren Sie Unteraufträge mit Name des Unterauftragnehmers (UAN), Scope, POC und Order Value. B nennt die Liste Subcontracts; T nennt Subcontractors. Prüfen Sie die tatsächliche Bezeichnung und Zuordnung in der Zielumgebung.',
    'Speichern Sie die Angaben und prüfen Sie die gespeicherten Einträge auf Vollständigkeit und Aktualität. Prüfen Sie wirksame Rechte gesondert anhand des bestehenden Zugriffsartikels.',
  ],
  [
    'Sind Kernteam, Teilprojekte und Unteraufträge vollständig und aktuell dokumentiert?',
    'Stimmen Teilprojektleiter, Owner-Übergabe und Subprojects fachlich überein?',
    'Sind dokumentierte Rollen und tatsächlich benötigte Rechte getrennt geprüft?',
  ],
  '§3.6.5 Tabelle 13; §3.6.7',
);

const takeover = procedure(
  'procedure-project-takeover',
  'Bereitgestellte Projektumgebung als PM prüfen',
  'fn-project-provision',
  'PWA / Project Center / Project Site / MS Project Client',
  [
    'Öffnen Sie nach bestätigter Bereitstellung PWA und das Project Center. Wählen Sie eine verfügbare Rollenansicht, etwa Projekte und Teilprojekte, und öffnen Sie das bereitgestellte Projekt.',
    'Prüfen Sie anhand der PDPs die Projektart. Öffnen Sie die Project Site und kontrollieren Sie die Erreichbarkeit mit Ihrem regulären Konto.',
    'Öffnen Sie den Projektplan im MS Project Client zunächst ohne Inhalte zu verändern. Prüfen Sie Projektname, Project ID, Owner, Main Project, Projektphase und Projektlevel auf Plausibilität gegenüber der beantragten Struktur.',
    'Melden Sie Abweichungen dem PMO, bevor Sie die fachliche Definition beginnen. Teilprojektübergaben an TM oder ILSM folgen dem gesonderten Owner-Weg mit vorher gesichertem PM-Lesezugriff.',
  ],
  [
    'Sind Projekt, Project Site und initialer Projektplan erreichbar und der beantragten Struktur zugeordnet?',
    'Passen EPT, Owner, Main Project und Ebene zur vorgesehenen Aufgabe?',
    'Sind Abweichungen vor der fachlichen Pflege geklärt?',
  ],
  '§3.1.4 Projektumgebung übernehmen; §3.6.7',
);
takeover.prerequisites = [
  'Das PMO hat die Bereitstellung bestätigt. Ein reguläres PM-Konto und der passende MS Project Client sind verfügbar; Antragsdaten stehen zum Vergleich bereit.',
];
takeover.trigger = 'Das PMO hat eine Projektumgebung zur Übernahme gemeldet.';

const subprojectProcedures: Procedure[] = (['tm', 'ilsm'] as const).flatMap((role) => {
  const system = role === 'tm';
  const variant = system ? 'System' : 'ILS';
  const key = system ? 'system' : 'ils';
  const fn = `fn-${key}-definition`;
  const section = system ? '3.8' : '3.9';
  const overview = procedure(
    `procedure-${key}-master-data`,
    `${variant}-Stammdaten pflegen`,
    fn,
    `PDP ${variant} Overview`,
    [
      `Öffnen Sie als ${system ? 'TM' : 'ILSM'} das übergebene ${variant}-Teilprojekt im Project Center und ${variant} Overview. Prüfen Sie Owner, Project ID, Portfolio, Main Project und gültiges Start Date. ${system ? 'System Delivery gilt für L2; Segment-Teilprojekte L3 liegen unter System Delivery L2.' : 'ILS Delivery ist für das ILS-Teilprojekt auf L2 vorgesehen.'} Strukturabweichungen an das PMO geben.`,
      'Pflegen Sie Short Description und Security Classification sowie ISMS Classification nach der höchsten Einstufung der im Teilprojekt verarbeiteten Informationen.',
      'Passen Sie Start Date bei fachlichem Bedarf an. B beschreibt Finish Date als aus dem Projektplan ermittelt. Prüfen Sie Anzeige und vorhandenen Plan getrennt; weder EDC-Gleichsetzung noch automatische Planverschiebung ableiten.',
      'Ergänzen Sie vorhandene SAP-ID (SAP PS), sinnvolle additional References und General Remarks zum Teilprojekt.',
    ],
    [
      `Sind ${variant}-Kurzbeschreibung, Klassifikation und Start Date mit dem Kundenprojekt vereinbar?`,
      'Sind Struktur und Referenzen plausibel und Terminwirkungen gesondert geprüft?',
    ],
    `§${section}.1; §3.7`,
  );
  const scope = procedure(
    `procedure-${key}-scope`,
    `${variant}-Leistungsumfang abgrenzen`,
    fn,
    `PDP ${variant} Scope`,
    [
      `Öffnen Sie ${variant} Scope und dokumentieren Sie den Project Purpose.`,
      `Beschreiben Sie Scope und sinnvolle Ausschlüsse unter not in scope. ${system ? 'Grenzen Sie die Systemleistung gegenüber Kundenprojekt und angrenzenden Teilprojekten ab; stimmen Sie Schnittstellen ab.' : 'Ordnen Sie ILS-Leistungen eindeutig zu und grenzen Sie sie gegenüber Kundenprojekt, Systementwicklung und gegebenenfalls Unterauftragnehmern ab.'}`,
      'Referenzieren Sie Base Products. Stimmen Sie die fachlichen Merkmale (Characteristics) gemäß der Einordnung in B §3.7 mit dem Kundenprojekt ab; die konkrete Feldverfügbarkeit ist im Zielstand zu prüfen.',
    ],
    [
      `Ist der ${variant}-Umfang eindeutig abgegrenzt und sind Basisprodukte sowie Schnittstellen nachvollziehbar?`,
      'Sind Doppelzuordnungen und ungedeckte Leistungen im Vergleich zum Kundenprojekt geklärt?',
    ],
    `§${section}.2; §3.7`,
  );
  const org = procedure(
    `procedure-${key}-organization`,
    `${variant}-Team dokumentieren`,
    fn,
    `PDP ${variant} ${system ? 'Organ.' : 'Organisation'}`,
    [
      `Öffnen Sie ${system ? 'System Organ.' : 'ILS Organisation'} und prüfen Sie die verfügbaren Rollen und die Personenauswahl.`,
      'Dokumentieren Sie je Projektrolle den Mitarbeiter, die Projektrolle und die entsprechende Prozessrolle als Referenz. Verwenden Sie nur im geprüften Zielstand verfügbare Rollen.',
      'Vergleichen Sie die fachliche Organisation mit dem Kundenprojekt. Prüfen Sie Teamzuordnung und wirksame Rechte gesondert über die bestehende Anleitung zu Zugriff und Owner-Wechsel.',
    ],
    [
      `Ist für jede ${variant}-Projektrolle ein Mitarbeiter mit zugehöriger Prozessrolle dokumentiert?`,
      'Sind Rechte unabhängig von der Rollenliste geprüft?',
    ],
    `§${section}.3`,
  );
  return [overview, scope, org];
});

type Draft = Pick<
  Article,
  'id' | 'title' | 'summary' | 'roles' | 'kind' | 'minutes' | 'sections' | 'takeaway' | 'related'
> & {
  procedures: Procedure[];
  exercise: string;
  expected: string;
};
const drafts: Draft[] = [
  {
    id: 'guide-project-handover',
    title: 'Projektumgebung vorbereiten und übernehmen',
    kind: 'Grundlagen',
    roles: ['pm', 'pmo'],
    minutes: 7,
    summary:
      'Orientierung für Antrag und PMO-Bereitstellung sowie eine abgegrenzte Übernahmeprüfung für den PM. Kein nachgewiesener Gesamtweg von TopDesk bis Projektanlage.',
    takeaway:
      'Bereiten Sie Projektentscheidung, Grobstruktur und Verantwortliche vor. Lassen Sie den aktuellen Antragsweg klären und prüfen Sie nach bestätigter Bereitstellung Projekt, Site und Plan. Die SB1-Zuordnung des Antrags in T widerspricht der Schulungsbewertung in F; ein vollständiger PMO-Durchlauf fehlt.',
    sections: [
      {
        title: 'Antrag vorbereiten – Orientierung, kein freigegebener Ticketweg',
        body: 'B §3.1.1 nennt den designierten PM als Antragsteller und TopDesk / Service UHD als Kanal. Vorzubereiten sind Projektentscheidung, eindeutiger Projektname, PM, Grobstruktur, Teilprojekttyp und -name, vorgesehene TM/ILSM sowie initiale ISMS-/VS-Einstufung. B beschreibt maximal 40 Zeichen ohne Sonderzeichen für Namen und bis zu fünf direkt beantragbare Teilprojekte; für mehr Teilprojekte nennt B manuelle Abstimmung mit dem PMO. Diese Formulargrenzen und der tatsächliche Erstzugang müssen bestätigt werden. Automatische Owner-, Ticket- oder E-Mail-Wirkungen werden hier nicht zugesichert.',
      },
      {
        title: 'Was das PMO bereitstellen soll',
        body: 'Nach B gehören zur Umgebung die passenden EPTs, Owner und Strukturzuordnungen, Project Sites, initiale Planvorlagen und bei Multiprojektstruktur die Planverknüpfungen. Contract Execution: Kundenprojekt L1; System Delivery: System L2 oder Segment L3 unter System L2; ILS Delivery: ILS L2. PMO-Steuerungsfelder wie Portfolio, Program, Main Project, Main Subproject und Project Phase sind vor der Übergabe abzugleichen. ID-Erzeugung, manuelle Referenz Project-ID – PMO sowie Speichern, Veröffentlichung und Einchecken müssen im vollständigen Durchlauf geprüft werden. Hieraus folgt keine Anleitung zur operativen Anlage.',
      },
      {
        title: 'Von der Übernahme zur Definition',
        body: 'Der PM vervollständigt Overview, Scope, Contract, Objectives und Organisation. Für Liefergegenstände und Zahlungsbedingungen stehen bestehende Anleitungen bereit. Vor Übergabe eines Teilprojekts sichert der PM seinen Lesezugriff und setzt anschließend TM oder ILSM als Owner ein; danach beginnt die jeweilige Teilprojektdefinition. Reihenfolge und Prüfungen sind fachliche Übergänge, keine behauptete automatische Systemverkettung.',
      },
    ],
    procedures: [takeover],
    related: [
      'guide-project-master-data',
      'guide-project-objectives',
      'guide-project-organization',
      'guide-project-permissions',
      'guide-subproject-definition',
      'guide-deliverables-milestones',
    ],
    exercise:
      'Fiktives Leseszenario: Ein Kundenprojekt mit einem System- und einem ILS-Teilprojekt wird angekündigt. Ordnen Sie EPT, Ebene und Verantwortung zu und formulieren Sie die Übernahmeprüfungen. Keinen Antrag absenden und keine PMO-Anlage simulieren.',
    expected:
      'Contract Execution / L1 / PM, System Delivery / L2 / TM und ILS Delivery / L2 / ILSM sind unterschieden. Erreichbarkeit und Struktur werden geprüft; ein Ticket- oder Bereitstellungserfolg wird nicht behauptet.',
  },
  {
    id: 'guide-project-master-data',
    title: 'Projektstammdaten und Terminrahmen prüfen',
    kind: 'Anleitung',
    roles: ['pm'],
    minutes: 6,
    summary:
      'Overview vervollständigen, PMO-Strukturfelder abgleichen und Projektbeginn, Vertragskontext und ungeklärte EDC-Zuordnung auseinanderhalten.',
    takeaway:
      'Pflegen Sie fachliche Stammdaten auf Overview und melden Sie Strukturabweichungen dem PMO. Start Date beschreibt laut B den fachlichen Projektbeginn; die genaue EDC-Feldbedeutung und Übernahmeregel bleiben laut F offen. Eine Änderung ist kein Nachweis einer automatischen Terminübernahme in einen vorhandenen Plan.',
    sections: [
      {
        title: 'Start Date, Vertragstermine und EDC getrennt prüfen',
        body: 'Overview führt Start Date und Finish Date. B beschreibt den Projektbeginn als Pflichtangabe und Finish Date als planbasiert. Contract nennt vertragliche Start- und Endtermine; K weist ebenfalls Start Date und Finish Date auf beiden PDPs aus, ohne dadurch eine EDC-Zuordnung oder Synchronisationsregel nachzuweisen. T fordert ausdrücklich die didaktische Abgrenzung, F R1-OPEN-05 lässt Feldbedeutung und Übernahme offen. Halten Sie deshalb fest, welcher fachliche Termin gemeint ist und in welchem Feld und Plan er geprüft wurde. Eine verbindliche EDC-Definition oder Gleichsetzung lässt sich aus diesen Quellen nicht ableiten.',
      },
      {
        title: 'Gespeicherten Stand kontrollieren',
        body: 'B §3.6.1 enthält keine vollständige Speicher-/Publish-/Check-in-Sequenz für Overview. Redaktionelle Ergebnisprüfung: Vor einer Übung den tatsächlichen PDP-Speicherweg klären und die Angaben nach dem Speichern erneut öffnen. Übertragen Sie den Client-Weg aus der Querschnittsanleitung nicht pauschal auf Overview. Der Planstand ist ein eigener Prüfgegenstand.',
      },
    ],
    procedures: [master],
    related: [
      'guide-project-handover',
      'guide-project-objectives',
      'guide-project-organization',
      'guide-deliverables-milestones',
      'guide-subproject-definition',
      'guide-save-publish-checkin',
    ],
    exercise:
      'Fiktives Prüfszenario: Der fachliche Projektbeginn lautet 01.10.2026, Overview zeigt ein anderes Datum und der vorhandene Plan beginnt später. Benennen Sie die drei Prüfgegenstände, ohne den Plan automatisch zu verschieben oder EDC gleichzusetzen.',
    expected:
      'Fachlicher Beginn, PDP-Anzeige und vorhandener Plan werden getrennt verglichen. EDC-Zuordnung und technische Übernahme bleiben Prüfaufträge.',
  },
  {
    id: 'guide-project-objectives',
    title: 'Projektziele von Annahmen und Randbedingungen trennen',
    kind: 'Anleitung',
    roles: ['pm'],
    minutes: 5,
    summary:
      'Überprüfbare Ziele mit Stakeholder und Zielklasse in Objectives dokumentieren; Assumptions und Constraints getrennt führen.',
    takeaway:
      'Ein Ziel beschreibt einen überprüfbaren Sollzustand. Eine Annahme ist noch zu bestätigen; eine Randbedingung steht fest und begrenzt den Spielraum. Erfassen Sie diese Aussagen getrennt, speichern Sie sie und prüfen Sie die Konsistenz mit Scope und Planung.',
    sections: [
      {
        title: 'Kurze Eingabeübung mit fiktiven Aussagen',
        body: 'Nur Übung, kein internes Projektziel: „Der vereinbarte Prüfbericht ist bis 30.11.2026 vollständig abgenommen“ ist ein Ziel. „Die Testumgebung steht ab 01.11.2026 bereit“ ist eine Annahme, solange unbestätigt. „Tests dürfen ausschließlich in der freigegebenen Testumgebung stattfinden“ ist in diesem fiktiven Szenario eine feste Randbedingung. Eine Tätigkeit wie „Bericht schreiben“ allein beschreibt noch keinen überprüfbaren Sollzustand.',
      },
    ],
    procedures: [objectives],
    related: [
      'guide-project-master-data',
      'guide-project-organization',
      'guide-deliverables-milestones',
      'guide-save-publish-checkin',
    ],
    exercise:
      'In einer vorab geprüften Schulungsumgebung die drei ausdrücklich fiktiven Aussagen aus dem Beitrag als Ziel, Assumption und Constraint erfassen. Einen verfügbaren Übungs-Stakeholder und eine tatsächlich vorhandene Zielklasse wählen; keine Produktivdaten verwenden. Speichern, erneut öffnen und die Zuordnung erklären.',
    expected:
      'Genau ein Ziel mit Sollzustand, Stakeholder, Lookup-Zielklasse und geprüftem Initialstatus; Annahme und feste Randbedingung sind getrennt gespeichert und wieder auffindbar.',
  },
  {
    id: 'guide-project-organization',
    title: 'Projektorganisation nachvollziehbar dokumentieren',
    kind: 'Anleitung',
    roles: ['pm'],
    minutes: 5,
    summary:
      'Project Core Team, Subprojects und Unteraufträge pflegen; dokumentierte Verantwortung von Owner, Teamzuordnung und Rechten unterscheiden.',
    takeaway:
      'Organisation dokumentiert Verantwortung. Pflegen Sie Mitarbeiter, Projekt- und Prozessrollen, Teilprojektbezug und Unteraufträge; prüfen Sie Rechte unabhängig davon. B nennt Subcontracts, T Subcontractors: Die tatsächliche Liste und finale Rollenwerte müssen im Zielstand bestätigt werden.',
    sections: [
      {
        title: 'Organisation, Übergabe und Zugriff verbinden',
        body: 'Ein Eintrag unter Subprojects legt kein Teilprojekt an. Ein Teilprojektleiter in der Liste ersetzt keinen Owner-Wechsel. Eine dokumentierte Kernteamrolle ersetzt weder Teamzuordnung noch Project Permissions. Für diese Aufgaben bleiben die vorhandene Zugriffsanleitung und der abgegrenzte Owner-Wechsel maßgeblich; deren offene Synchronisations- und Rechtefragen gelten weiter.',
      },
    ],
    procedures: [organization],
    related: [
      'guide-project-permissions',
      'faq-role-vs-access',
      'guide-subproject-definition',
      'guide-project-objectives',
      'guide-save-publish-checkin',
    ],
    exercise:
      'Fiktiver Redaktionsvorschlag: Für ein Übungsprojekt eine Kernteamrolle, ein bereits bereitgestelltes System-Teilprojekt und einen fiktiven Unterauftrag abbilden. Nur bestätigte Übungskonten und verfügbare Rollen verwenden; anschließend Subprojects mit der separat geprüften Owner-Zuordnung vergleichen.',
    expected:
      'Mitarbeiter/Projektrolle/Prozessrolle, Name/Scope/Teilprojektleiter und UAN/Scope/POC/Order Value sind nachvollziehbar. Kein Listeneintrag wird als Rechtevergabe oder Projektanlage gewertet.',
  },
  {
    id: 'guide-subproject-definition',
    title: 'System- und ILS-Teilprojekte definieren',
    kind: 'Anleitung',
    roles: ['tm', 'ilsm', 'pm'],
    minutes: 9,
    summary:
      'Nach der Owner-Übergabe Stammdaten, Leistungsumfang und Organisation im richtigen Teilprojektkontext pflegen und mit dem Kundenprojekt abgleichen.',
    takeaway:
      'TM arbeitet in System Overview, System Scope und System Organ.; ILSM in ILS Overview, ILS Scope und ILS Organisation. System Delivery umfasst L2 und gegebenenfalls Segment L3 unter System L2; ILS Delivery gilt für L2. Beide Varianten benötigen eine geprüfte Übergabe und eine klare Leistungsabgrenzung.',
    sections: [
      {
        title: 'Gemeinsamer Ablauf, unterschiedliche Verantwortung',
        body: 'Wählen Sie ausschließlich den passenden Variantenweg. TM grenzt Systemleistungen und Schnittstellen zu angrenzenden Teilprojekten ab. ILSM ordnet ILS-Leistungen gegenüber Kundenprojekt, Systementwicklung und gegebenenfalls Unterauftragnehmern zu. Die allgemeine Einordnung in B §3.7 nennt Characteristics und Base Product(s); die konkreten Scope-Schritte §3.8.2/§3.9.2 nennen Project Purpose, Scope, not in scope und Base Products. Daraus wird hier kein zusätzlicher unbelegter Characteristics-Bedienweg erzeugt.',
      },
      {
        title: 'Speichern und Ergebnis prüfen',
        body: 'Die Detailabschnitte B §3.8.1–3.8.3 und §3.9.1–3.9.3 beschreiben keine vollständige gemeinsame Speicher-/Publish-/Check-in-Sequenz. Redaktionelle Ergebnisprüfung: Kontrollieren Sie die Persistenz im tatsächlich bearbeiteten PDP-/Listenkontext durch erneutes Öffnen. Nutzen Sie die Querschnittsanleitung zur Unterscheidung der Speicherwege; übertragen Sie den MS-Project-Client-Weg nicht pauschal auf PDPs. Die konkreten Bedienelemente und erforderlichen Abschlussaktionen sind vor einer praktischen Übung im Zielstand zu prüfen.',
      },
      {
        title: 'Handbuchverweise und Rechte bleiben begrenzt',
        body: 'Die Einleitung B §3.9 verweist auf §3.5.6 und §3.8.4, während der eigene ILS-Zugriffsabschnitt §3.9.4 lautet. Diese redaktionelle Unstimmigkeit wird nicht als anderer ILS-Bedienweg interpretiert. Die bestehende Zugriffsanleitung stellt die Aussagen zu Build Team, Project Permissions und Synchronisation mit ihren Konflikten dar.',
      },
    ],
    procedures: subprojectProcedures,
    related: [
      'guide-project-handover',
      'guide-project-master-data',
      'guide-project-organization',
      'guide-project-permissions',
      'guide-deliverables-milestones',
      'guide-save-publish-checkin',
    ],
    exercise:
      'Fiktives Vergleichsszenario: Ein System-Teilprojekt verantwortet ein Testsystem; ein ILS-Teilprojekt verantwortet die zugehörige Wartungsunterlage. In getrennten, vorab geprüften Übungsprojekten Beschreibung, Scope/Ausschlüsse/Basisprodukt und eine Teamrolle erfassen. Gegenseitige Schnittstelle und Zugehörigkeit zum Kundenprojekt prüfen.',
    expected:
      'Zwei getrennte Leistungskontexte ohne Doppelzuordnung; die richtigen PDPs und Rollen sind gewählt. Erneutes Öffnen bestätigt die gespeicherten Angaben. Weder automatische Terminübernahme noch Rechtevergabe wird aus Organisationspflege abgeleitet.',
  },
];

export const definitionArticles: Article[] = drafts.map(
  ({ procedures, exercise, expected, ...draft }) => {
    const rows = definitionRows.filter((r) => r.article === draft.id);
    const functionIds = [...new Set(rows.map((r) => r.fn))];
    return {
      ...draft,
      status: 'source-draft',
      topic: 'Projektplanung',
      updated: '2026-09-23',
      revisions: [revision],
      reviews: [],
      knowledge: {
        functionIds,
        stepIds: rows.map((r) => `step-${r.number.replace('.', '-')}`),
        issueIds: [
          ...definitionIssues
            .filter((i) =>
              i.subjects.some((s) => functionIds.includes(s.id as (typeof functionIds)[number])),
            )
            .map((i) => i.id),
          'issue-f-r1-open-12',
        ],
        evidence: rows.flatMap((r) => e('B', `§${r.section} ${r.title}`)),
        procedures,
        trainer: {
          objective: draft.takeaway,
          preparation: [
            'Ausschließlich fiktive Daten und vorab geprüfte Übungskonten verwenden. Dieser Vorschlag ist kein durchgeführter Schulungsnachweis.',
            'EPT, PDPs, Listen, Lookup-Werte, Bearbeitungsrechte und Speicher-/Abschlussweg in der konkreten Schulungsumgebung vorab prüfen. Abweichungen samt Quellen- und Inhaltsrevision protokollieren.',
          ],
          exercise,
          expectedResult: expected,
          limitation:
            'Quellenbasierter Übungsvorschlag. Fachliche Freigabe, Nutzer-/Trainererprobung und Zielumgebungsnachweis fehlen.',
        },
      },
    };
  },
);

export const definitionViews = definitionArticles.map((a) => ({
  id: a.id.replace('guide-', ''),
  title: `SB1: ${a.title}`,
  description: a.summary,
  stepIds: a.knowledge!.stepIds,
  articleId: a.id,
}));
