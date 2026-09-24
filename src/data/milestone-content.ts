import type { Article, ContentRevision } from './types';
import type { KnowledgeContext } from './domain';
import { evidence as e } from './sources';

const knowledge: KnowledgeContext = {
  functionIds: [
    'fn-deliverables',
    'fn-payment-terms',
    'fn-delivery-milestones',
    'fn-payment-milestones',
  ],
  stepIds: ['step-2-2', 'step-2-5', 'step-3-1', 'step-3-2'],
  issueIds: [
    'issue-f-r1-open-08',
    'issue-payment-terms-context',
    'issue-milestone-client',
    'issue-f-r1-open-12',
  ],
  linkIds: ['link-deliverables-delivery', 'link-terms-payment', 'link-contract-payment'],
  evidence: [
    ...e('TTT', 'Abgestimmte Restpunkte vom 23.09.2026'),
    ...e('C23', 'Bestätigte Klärungen vom 23.09.2026'),
    ...e(
      'B',
      '§3.6.2 Projektumfang festlegen; §3.6.3 Vertragsdaten einpflegen; §4.4 Fachlicher Soll-Ablauf; §4.5.2/4.5.3 Meilensteine planen',
    ),
    ...e('T', 'Release1-Matrix!A6:Q6 und A20:Q21'),
  ],
  procedures: [
    {
      id: 'procedure-deliverables',
      title: 'Liefergegenstände als Planungsgrundlage erfassen',
      functionId: 'fn-deliverables',
      trigger: 'Der PM definiert den Umfang eines vom PMO bereitgestellten Kundenprojekts.',
      prerequisites: [
        'Kundenprojekt vom Typ Contract Execution ist bereitgestellt; der PM kann die PDP Scope und die Liste öffnen.',
        'Leistungsumfang, Ausschlüsse und relevante Liefergegenstände sind mit dem Projektkernteam fachlich geklärt.',
      ],
      actions: [
        {
          text: 'Beschreiben Sie auf der PDP Scope den enthaltenen und ausdrücklich ausgeschlossenen Umfang sowie die vorgesehenen Merkmale und Basisprodukte.',
          tool: 'PWA / PDP Scope',
        },
        {
          text: 'Nutzen Sie für das Gesamtprojekt die führende List of Deliverables im Contract Execution Project; Teilprojekte pflegen ihre spezifischen Liefergegenstände. Legen Sie für jeden relevanten Liefergegenstand einen eigenen Eintrag mit eindeutiger Bezeichnung an. Pflegen Sie fachlichen Termin, vertragliche Relevanz und Freigabeinstanz nach den vorhandenen Angaben.',
          tool: 'PDP Scope / List of Deliverables',
        },
        {
          text: 'Speichern Sie die Liste, prüfen Sie die Initialbelegung „geplant“ und stimmen Sie die Einträge mit dem Projektkernteam ab.',
          tool: 'List of Deliverables',
        },
      ],
      expectedResults: [
        'Der Projektumfang ist nachvollziehbar beschrieben; die relevanten Liefergegenstände liegen einzeln als Eingang für die Meilensteinplanung vor.',
      ],
      checkQuestions: [
        'Ist für jeden geplanten Liefermeilenstein ein fachlich passender Listeneintrag auffindbar?',
      ],
      evidence: e('B', '§3.6.2 Schritt-für-Schritt: Projektumfang festlegen, Tabelle 11'),
    },
    {
      id: 'procedure-payment-terms',
      title: 'Zahlungsbedingungen als Planungsgrundlage erfassen',
      functionId: 'fn-payment-terms',
      trigger:
        'Die Vertragsangaben für das Kundenprojekt werden vor der Zahlungsmeilensteinplanung gepflegt.',
      prerequisites: [
        'Vertragliche Zahlungsbedingungen und die zugehörigen Auslöser liegen fachlich geklärt vor.',
        'Der PM kann die PDP Contract im bereitgestellten Kundenprojekt bearbeiten.',
      ],
      actions: [
        {
          text: 'Öffnen Sie die PDP Contract und prüfen Sie den Vertragskontext auf Übereinstimmung mit den vorhandenen Unterlagen.',
          tool: 'PWA / PDP Contract',
        },
        {
          text: 'Pflegen Sie Terms of Payment so, dass auslösende Lieferung und vereinbarte Zahlungsfrist als Zeitabstand nachvollziehbar sind; halten Sie Zahlungen ohne Lieferauslöser fachlich getrennt fest.',
          tool: 'PDP Contract / Terms of Payment',
        },
        {
          text: 'Speichern Sie die Eingaben und gleichen Sie die Angaben vor der Planung mit der fachlich abgestimmten Vertragslage ab.',
          tool: 'PDP Contract',
        },
      ],
      expectedResults: [
        'Die Zahlungsbedingungen liefern eine prüfbare Grundlage für die Terminierung der Zahlungsmeilensteine.',
      ],
      checkQuestions: [
        'Sind Auslöser und Frist eines vereinbarten Zahlungszeitpunkts nachvollziehbar?',
      ],
      evidence: e('B', '§3.6.3 Schritt-für-Schritt: Vertragsdaten einpflegen'),
    },
    {
      id: 'procedure-delivery-milestones',
      title: 'Liefermeilensteine mit Stichtag und Plantermin planen',
      functionId: 'fn-delivery-milestones',
      trigger: 'Die bestätigten Liefergegenstände sollen im Kundenprojektplan terminiert werden.',
      prerequisites: [
        'Die List of Deliverables und die fachlich maßgeblichen Liefertermine liegen vor.',
        'Der PM kann den Projektplan im MS Project Client bearbeiten; der Plan ist ausgecheckt und Ansicht 10 ist aktiv.',
      ],
      actions: [
        {
          text: 'Erzeugen Sie für jeden relevanten Liefergegenstand einen Liefermeilenstein aus dem vorgesehenen generischen Template-Meilenstein und benennen Sie ihn eindeutig.',
          tool: 'MS Project Client / Ansicht 10 Phasen- und Meilensteinplan',
        },
        {
          text: 'Pflegen Sie den vertraglichen Zieltermin im Feld Stichtag und anschließend den aktuellen Plantermin im Feld Anfang. Prüfen Sie die dabei entstehende Einschränkung „Anfang nicht früher als“.',
          tool: 'MS Project Client / Ansicht 10',
        },
        {
          text: 'Prüfen Sie WBS Level „Pr – Projekt“, WBS Type „Meilenstein“, Milestone Type „Ext.Del“ und den fachlichen Bezug zum Eintrag in der List of Deliverables.',
          tool: 'MS Project Client / Ansicht 10 und PDP Scope',
        },
      ],
      expectedResults: [
        'Jeder relevante Liefergegenstand hat einen zuordenbaren Liefermeilenstein mit Stichtag, Plantermin und passender Klassifikation.',
      ],
      checkQuestions: [
        'Sind Stichtag und Anfang fachlich unterschieden und die Termine mit der Liste abgeglichen?',
      ],
      evidence: e(
        'B',
        '§4.4 Fachlicher Soll-Ablauf; §4.5.1 Projektplan öffnen und auschecken; §4.5.2 Schritt-für-Schritt: Liefermeilensteine planen, Tabelle 16',
      ),
    },
    {
      id: 'procedure-payment-milestones',
      title: 'Zahlungsmeilensteine mit oder ohne Lieferbezug planen',
      functionId: 'fn-payment-milestones',
      relatedArticleId: 'guide-save-publish-checkin',
      trigger:
        'Vertragliche Zahlungsbedingungen sollen als Zahlungstermine im Projektplan sichtbar werden.',
      prerequisites: [
        'Zahlungsbedingungen und Fristen sind in der PDP Contract nachvollziehbar erfasst.',
        'Soweit eine Lieferung die Zahlung auslöst, ist der zugehörige Liefermeilenstein geplant.',
        'Der Projektplan ist zur Bearbeitung ausgecheckt; Ansicht 10 ist aktiv.',
      ],
      actions: [
        {
          text: 'Erzeugen und benennen Sie einen Zahlungsmeilenstein aus dem vorgesehenen Template. Prüfen Sie WBS Level „Pr – Projekt“, WBS Type „Meilenstein“ und Milestone Type „Ext.Pay“.',
          tool: 'MS Project Client / Ansicht 10',
        },
        {
          text: 'Wenn eine Lieferung die Zahlung auslöst: Verknüpfen Sie den Zahlungsmeilenstein mit dem begründenden Liefermeilenstein als Vorgänger, tragen Sie die vereinbarte Zahlungsfrist als Zeitabstand ein und prüfen Sie den resultierenden Anfang-Termin. Für die Verknüpfung kann Ansicht 30 genutzt werden; wechseln Sie danach zurück zu Ansicht 10.',
          tool: 'MS Project Client / Ansicht 30 Ablauf- und Terminplan; Ansicht 10',
        },
        {
          text: 'Wenn keine Lieferung die Zahlung auslöst: Erzeugen Sie keine künstliche Vorgänger-Verknüpfung. Setzen Sie den Plantermin direkt im Feld Anfang und halten Sie die fachliche Begründung nachvollziehbar.',
          tool: 'MS Project Client / Ansicht 10',
        },
        {
          text: 'Übernehmen Sie Anfang nur dann in Stichtag, wenn dieser Termin den vertraglich verbindlichen Zahlungszeitpunkt korrekt abbildet. Speichern, veröffentlichen und checken Sie den geprüften Plan ein.',
          tool: 'MS Project Client',
        },
      ],
      expectedResults: [
        'Für jeden Zahlungsmeilenstein ist erkennbar, ob Liefertermin und Zahlungsfrist oder eine begründete direkte Terminierung zugrunde liegen. Der Plan ist veröffentlicht und eingecheckt.',
      ],
      checkQuestions: [
        'Stimmt der Zahlungszeitpunkt mit den Terms of Payment überein?',
        'Ist eine Vorgänger-Verknüpfung nur bei auslösender Lieferung gesetzt?',
        'Wurde nach der letzten Änderung veröffentlicht und eingecheckt?',
      ],
      evidence: e(
        'B',
        '§3.6.3 Vertragsdaten einpflegen; §4.5.3 Schritt-für-Schritt: Zahlungsmeilensteine planen, Tabelle 18; §4.5.6 Speichern, veröffentlichen und einchecken',
      ),
    },
  ],
  trainer: {
    objective:
      'Lieferliste, Liefermeilenstein und zwei Zahlungsvarianten fachlich aufeinander beziehen; Stichtag und Plantermin unterscheiden.',
    preparation: [
      'Ein freigegebenes Schulungsszenario mit fiktivem Liefergegenstand, vereinbarter Zahlungsfrist und einem separat begründeten Zahlungstermin bereitstellen.',
      'Projektplan, Client-Ansichten, Kontorechte und Veröffentlichung im konkreten Schulungssystem vorher prüfen.',
      'Keine vertraulichen Vertrags- oder Projektdaten im Center erfassen.',
    ],
    exercise:
      'Redaktioneller Übungsvorschlag: Einen Liefergegenstand mit Liefermeilenstein abgleichen, danach je einen lieferungsabhängigen und einen direkt terminierten Zahlungsmeilenstein erläutern und im geprüften Schulungskontext anlegen.',
    expectedResult:
      'Die beiden Zahlungslogiken, Termine und Klassifikationen sind im Schulungsplan nachvollziehbar; die veröffentlichte Fassung wird mit dem Listeneintrag verglichen.',
    limitation:
      'Quellenbasierter Übungsvorschlag ohne durchgeführte Schulung oder fachliche Freigabe. Lesemarkierungen zählen nicht als Übungsnachweis.',
  },
};

const revision = (note: string): ContentRevision[] => [
  {
    number: 1,
    date: '2026-09-22',
    note,
    sources: [
      { sourceId: 'B', sha256: 'E4AED78DC586A4F60CC98B411F109D8E59295A78CE570BF23005C7247AFD7727' },
      { sourceId: 'F', sha256: 'B68766FE1877A72A2E437F354ED7441C990C6D640E0A9185D77A22F04A35B0A4' },
      { sourceId: 'S', sha256: 'E33A4CF88E48B201040BC93B82FFA5DCEEC0C9EEC5F0DFBF63665E8EEF908939' },
      { sourceId: 'T', sha256: '1F6F3C23BDA042B67E9DB2BC88722EDBBA3C2591CA3F6AEA2A73FC9335C5A0DB' },
    ],
  },
];

export const milestoneArticles: Article[] = [
  {
    id: 'guide-deliverables-milestones',
    status: 'source-draft',
    revisions: revision(
      'Bestandsfassung des quellenbasierten Liefer- und Zahlungsmeilenstein-Entwurfs erfasst.',
    ),
    reviews: [],
    title: 'Liefergegenstände in Liefer- und Zahlungsmeilensteine überführen',
    summary:
      'Vom Eintrag in der List of Deliverables über Ext.Del bis zum begründeten Ext.Pay: der beschriebene SB1-Weg mit offenen Prüfpunkten.',
    topic: 'Projektplanung',
    roles: ['pm'],
    kind: 'Anleitung',
    minutes: 10,
    updated: '2026-09-22',
    sections: [
      {
        title: 'Fachliche Grundlage und technische Wirkung trennen',
        body: 'Die führende Liefergegenstandsliste des Gesamtprojekts liegt im Contract Execution Project; Teilprojekte pflegen ihre spezifischen Liefergegenstände. Die Verknüpfung mit Liefermeilensteinen ist über die Funktion Lieferung umgesetzt. Einträge und Termine nach Änderungen fachlich abgleichen; keine weitergehende automatische Feldsynchronisierung voraussetzen.',
      },
      {
        title: 'Zahlungsbedingung entscheidet über die Variante',
        body: 'Die PDP Contract liefert die Zahlungsfrist. Wenn eine Lieferung die Zahlung auslöst, wird der Zahlungsmeilenstein mit dem Liefermeilenstein verknüpft. Ohne auslösende Lieferung wird ein Zahlungstermin begründet direkt geplant; eine künstliche Verknüpfung wäre irreführend.',
      },
      {
        title: 'Planstand erst nach Veröffentlichung weitergeben',
        body: 'Der beschriebene Weg unterscheidet Speichern, Veröffentlichen und Einchecken. Ein gespeicherter Plan allein ist laut Handbuchentwurf noch keine belastbare Übergabe der Planungsziele. Prüfen Sie den veröffentlichten Stand im konkreten Schulungssystem.',
      },
    ],
    takeaway:
      'Lieferliste und Plan aktiv abgleichen; Stichtag und Anfang getrennt prüfen; Zahlungsmeilensteine nur bei auslösender Lieferung verknüpfen.',
    related: ['faq-milestone-dates', 'guide-project-permissions', 'guide-save-publish-checkin'],
    knowledge,
  },
  {
    id: 'faq-milestone-dates',
    status: 'source-draft',
    revisions: revision(
      'Bestandsfassung der quellenbasierten FAQ zu Termin- und Zahlungslogik erfasst.',
    ),
    reviews: [],
    title: 'Stichtag, Anfang und Zahlungsfrist unterscheiden',
    summary:
      'Kurze Antworten zur Terminlogik und zu den zwei Zahlungsvarianten des SB1-Handbuchentwurfs.',
    topic: 'Projektplanung',
    roles: ['pm'],
    kind: 'FAQ',
    minutes: 4,
    updated: '2026-09-22',
    sections: [
      {
        title: 'Was bedeutet Stichtag?',
        body: 'Im Handbuchentwurf hält Stichtag den vertraglich vereinbarten oder aktuell verhandelten Zieltermin fest. Anfang ist der aktuelle Plantermin. Beim Setzen von Anfang entsteht die Einschränkung „Anfang nicht früher als“, die fachlich geprüft werden muss.',
      },
      {
        title: 'Wann braucht ein Zahlungsmeilenstein einen Vorgänger?',
        body: 'Wenn die Zahlung durch eine Lieferung ausgelöst wird, ist der passende Liefermeilenstein Vorgänger; die Zahlungsfrist wird als Zeitabstand gepflegt. Fehlt dieser Lieferbezug fachlich, ist direkte Terminierung ohne künstliche Vorgänger-Verknüpfung vorgesehen.',
      },
      {
        title: 'Wird die Lieferliste automatisch mit dem Projektplan abgeglichen?',
        body: 'Die Verknüpfung der SharePoint-Liste mit der Funktion Lieferung und damit zu Liefermeilensteinen ist umgesetzt. Führend für das Gesamtprojekt ist die Liste im Contract Execution Project. Das bestätigt keine automatische Synchronisierung aller Listen- und Planfelder. Die praktische Darstellung großer Listen bleibt offen.',
      },
      {
        title: 'Gilt der beschriebene Weg als getestet?',
        body: 'Die Funktionsmatrix bewertet die Meilensteinplanung als teilweise verifiziert und mit Hinweis schulungsfähig. Der aktuelle Handbuchentwurf ergänzt eine konkrete Beschreibung, liefert aber keinen neuen protokollierten Test der beiden Zahlungsvarianten im Zielsystem.',
      },
    ],
    takeaway: 'Vertragsziel, aktueller Plan und Zahlungsfrist beantworten verschiedene Fragen.',
    related: ['guide-deliverables-milestones'],
    knowledge: { ...knowledge, procedures: [] },
  },
];

// Explicit source snapshot for the confirmed clarification revision of 23 September.
for (const article of milestoneArticles.filter((a) =>
  ['guide-deliverables-milestones', 'faq-milestone-dates'].includes(a.id),
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
      { sha256: 'E33A4CF88E48B201040BC93B82FFA5DCEEC0C9EEC5F0DFBF63665E8EEF908939', sourceId: 'S' },
      { sha256: '1F6F3C23BDA042B67E9DB2BC88722EDBBA3C2591CA3F6AEA2A73FC9335C5A0DB', sourceId: 'T' },
      {
        sha256: 'F20FC9AA5DCF380FA4E0CDB7F5D1E301DB8C89620AFA62B345107160FF2CBC36',
        sourceId: 'TTT',
      },
    ],
  });
}
