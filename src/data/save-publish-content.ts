import type { Article } from './types';
import { accessArticles } from './access-content';
import { milestoneArticles } from './milestone-content';
import { evidence as e } from './sources';

const accessGuide = accessArticles.find((article) => article.id === 'guide-project-permissions')!;
const milestoneGuide = milestoneArticles.find(
  (article) => article.id === 'guide-deliverables-milestones',
)!;
const owner = accessGuide.knowledge!.procedures.find((p) => p.id === 'procedure-owner-change')!;
const deliverables = milestoneGuide.knowledge!.procedures.find(
  (p) => p.id === 'procedure-deliverables',
)!;
const paymentTerms = milestoneGuide.knowledge!.procedures.find(
  (p) => p.id === 'procedure-payment-terms',
)!;
const paymentMilestones = milestoneGuide.knowledge!.procedures.find(
  (p) => p.id === 'procedure-payment-milestones',
)!;

export const savePublishArticles: Article[] = [
  {
    id: 'guide-save-publish-checkin',
    status: 'source-draft',
    revisions: [
      {
        number: 1,
        date: '2026-09-23',
        note: 'Querschnitt der belegten Speicher- und Übergabeschritte aus den beiden bestehenden Fachpaketen; keine Zielumgebungsprüfung.',
        sources: [
          {
            sourceId: 'B',
            sha256: 'E4AED78DC586A4F60CC98B411F109D8E59295A78CE570BF23005C7247AFD7727',
          },
          {
            sourceId: 'F',
            sha256: 'B68766FE1877A72A2E437F354ED7441C990C6D640E0A9185D77A22F04A35B0A4',
          },
          {
            sourceId: 'S',
            sha256: 'E33A4CF88E48B201040BC93B82FFA5DCEEC0C9EEC5F0DFBF63665E8EEF908939',
          },
          {
            sourceId: 'T',
            sha256: '1F6F3C23BDA042B67E9DB2BC88722EDBBA3C2591CA3F6AEA2A73FC9335C5A0DB',
          },
        ],
      },
    ],
    reviews: [],
    title: 'Speichern, Veröffentlichen und Einchecken im passenden Kontext',
    summary:
      'Drei unterschiedliche Abschlusswege für Liste/PDP, Projektplan im MS Project Client und Owner-Wechsel – mit Prüffragen statt behaupteter Systemabnahme.',
    topic: 'Projektplanung',
    roles: ['pm', 'tm', 'ilsm'],
    kind: 'Anleitung',
    minutes: 5,
    updated: '2026-09-23',
    sections: [],
    takeaway:
      'Liste/PDP: speichern und fachlich prüfen. MS Project Client: geprüften Plan speichern, veröffentlichen, einchecken und veröffentlichten Stand prüfen. Owner-Wechsel: zuerst PM-Leserechte sichern, dann Änderung speichern und einchecken; anschließend Owner und Zugriff prüfen. Diese Schritte gelten jeweils nur in ihrem Kontext.',
    related: ['guide-project-permissions', 'guide-deliverables-milestones'],
    knowledge: {
      functionIds: [
        'fn-deliverables',
        'fn-payment-terms',
        'fn-delivery-milestones',
        'fn-payment-milestones',
        'fn-project-permissions',
        'fn-owner-change',
      ],
      stepIds: ['step-2-2', 'step-2-5', 'step-3-1', 'step-3-2', 'step-2-6'],
      issueIds: [
        'issue-f-r1-open-08',
        'issue-payment-terms-context',
        'issue-milestone-client',
        'issue-f-r1-open-01',
        'issue-f-r1-open-02',
        'issue-f-r1-open-07',
        'issue-f-r1-open-12',
      ],
      evidence: [
        ...e('B', '§3.6.2 Projektumfang festlegen; §3.6.3 Vertragsdaten einpflegen'),
        ...e('B', '§4.5.6 Speichern, veröffentlichen und einchecken'),
        ...owner.evidence,
      ],
      procedures: [
        {
          id: 'procedure-save-list-pdp',
          title: 'Liste/PDP: speichern und fachlich abgleichen',
          functionId: 'fn-deliverables',
          trigger:
            'Liefergegenstände in der Liste oder Zahlungsbedingungen auf der PDP wurden bearbeitet.',
          prerequisites: [
            'Die fachlich abgestimmten Liefer- oder Vertragsangaben und die nötigen Bearbeitungsrechte liegen vor.',
          ],
          actions: [deliverables.actions[2], paymentTerms.actions[2]],
          expectedResults: [
            'Die gespeicherten Angaben sollen mit Lieferliste beziehungsweise Vertragslage fachlich übereinstimmen.',
          ],
          checkQuestions: [
            ...deliverables.checkQuestions,
            ...paymentTerms.checkQuestions,
            'Sind die gespeicherten Angaben im jeweiligen Listen- oder PDP-Kontext wieder auffindbar?',
          ],
          evidence: [...deliverables.evidence, ...paymentTerms.evidence],
        },
        {
          id: 'procedure-save-project-plan',
          title: 'MS Project Client: geprüften Plan veröffentlichen und einchecken',
          functionId: 'fn-payment-milestones',
          trigger: 'Der bearbeitete Projektplan soll als geprüfter Planstand weitergegeben werden.',
          prerequisites: [
            'Der Projektplan ist im MS Project Client zur Bearbeitung ausgecheckt; Termine und fachliche Zuordnung wurden geprüft.',
          ],
          actions: [
            {
              text: 'Speichern Sie den geprüften Projektplan, veröffentlichen Sie ihn und checken Sie ihn anschließend ein.',
              tool: 'MS Project Client',
            },
            {
              text: 'Prüfen Sie den veröffentlichten Stand gegen die fachlich geprüften Planangaben.',
              tool: 'MS Project Client / veröffentlichter Projektplan',
            },
          ],
          expectedResults: [
            'Der geprüfte Planstand soll veröffentlicht und eingecheckt sowie im veröffentlichten Stand nachvollziehbar sein.',
          ],
          checkQuestions: [
            ...paymentMilestones.checkQuestions.slice(-1),
            'Entspricht der veröffentlichte Stand den geprüften Planangaben?',
          ],
          evidence: e('B', '§4.5.6 Speichern, veröffentlichen und einchecken'),
        },
        {
          id: 'procedure-save-owner-change',
          title: 'Owner-Wechsel: PM-Leserechte sichern, speichern und einchecken',
          functionId: 'fn-owner-change',
          trigger: owner.trigger,
          prerequisites: owner.prerequisites,
          requiredRights: owner.requiredRights,
          actions: owner.actions.slice(0, 3),
          expectedResults: [
            'Nach der Übergabe sollen der neue Owner, der lesende PM-Zugriff und die Zuordnung unter Subprojects übereinstimmen.',
          ],
          checkQuestions: owner.checkQuestions,
          evidence: owner.evidence,
        },
      ],
      trainer: {
        objective:
          'Die drei belegten Abschlusswege anhand ihres Projekt- und Werkzeugkontexts unterscheiden.',
        preparation: [
          'Nur einen vorher geprüften Schulungskontext und fiktive Projektdaten verwenden.',
          'Wirksame Rechte, Client-Stand und veröffentlichten Planstand vor einer praktischen Übung gesondert prüfen.',
        ],
        exercise:
          'Redaktioneller Gesprächsvorschlag: Für Liste/PDP, Projektplan und Owner-Wechsel jeweils die passenden Prüffragen auswählen. Ein praktischer Durchlauf ist nicht dokumentiert.',
        expectedResult:
          'Die drei Kontextwege und ihre offenen Prüfungen werden getrennt erläutert.',
        limitation: 'Quellenbasierter Entwurf ohne fachliche Freigabe oder durchgeführte Schulung.',
      },
    },
  },
];
