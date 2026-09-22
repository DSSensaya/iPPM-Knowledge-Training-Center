import type { Article } from './types';
import type { KnowledgeContext } from './domain';
import { evidence as e } from './sources';

const knowledge: KnowledgeContext = {
  status: 'source-draft',
  revision: 1,
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
          text: 'Legen Sie in der List of Deliverables für jeden relevanten Liefergegenstand einen eigenen Eintrag mit eindeutiger Bezeichnung an. Pflegen Sie fachlichen Termin, vertragliche Relevanz und Freigabeinstanz nach den vorhandenen Angaben.',
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

export const milestoneArticles: Article[] = [
  {
    id: 'guide-deliverables-milestones',
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
        body: 'Der Handbuchentwurf verlangt einen nachvollziehbaren Abgleich zwischen Lieferliste und Liefermeilenstein. Die Quellen belegen keine automatische Synchronisierung. Prüfen Sie beide Einträge nach Änderungen einzeln.',
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
    related: ['faq-milestone-dates', 'guide-project-permissions'],
    knowledge,
  },
  {
    id: 'faq-milestone-dates',
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
        body: 'Eine automatische Synchronisierung ist anhand der untersuchten Quellen nicht belegt. Der Handbuchentwurf beschreibt einen fachlichen Abgleich. Die Funktionsmatrix lässt große Lieferlisten und Meilensteinzuordnung als Prüffrage offen.',
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
