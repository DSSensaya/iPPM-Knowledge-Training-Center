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
      {
        number: 2,
        date: '2026-09-23',
        note: 'Lieferliste und PDP Contract als Alternativen getrennt und kontextbezogene Prozedurverweise ergänzt; fachliche Prüfung bleibt offen.',
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
      'Nur der jeweils bearbeitete Kontext zählt: Lieferliste oder PDP Contract, Projektplan im MS Project Client oder Owner-Wechsel – mit Prüffragen statt behaupteter Systemabnahme.',
    topic: 'Projektplanung',
    roles: ['pm', 'tm', 'ilsm'],
    kind: 'Anleitung',
    minutes: 5,
    updated: '2026-09-23',
    sections: [
      {
        title: 'Publish-Schnellzugriff am Schulungsanfang',
        body: 'Richten Sie die Publish-Funktion zu Beginn gemeinsam mit jedem Teilnehmer im Schnellzugriff des MS Project Clients ein. Nutzen Sie sie zum Veröffentlichen des gespeicherten Plans und prüfen Sie danach den veröffentlichten Stand. TTT-D-27 ist erledigt; dies ersetzt Speichern und Einchecken nicht.',
      },
      {
        title: 'Makro-Hinweis beim Client-Start',
        body: 'Beim Start des MS Project Clients müssen die bereitgestellten Makros derzeit aktiviert werden (TTT-D-22). Dies zu Beginn der Schulung ansprechen. Endanwender beschaffen keine eigenen Makros und verändern nicht eigenständig globale Client-Vorgaben. Bei fehlender Bereitstellung oder blockierter Aktivierung Unterstützung einholen.',
      },
      {
        title: 'Hard Links nicht nutzen',
        body: 'Hard Links werden nicht geschult und sollen nicht genutzt werden (TTT-D-46). Der funktionierende WWS-/WBS-Generator ist keine Freigabe dieser Planungsvariante. Automatische Vorgangsverknüpfungen und ProjectLink-Übernahmeregeln bleiben gesonderte technische Restpunkte.',
      },
    ],
    takeaway:
      'Lieferliste oder PDP Contract: jeweils nur den bearbeiteten Kontext speichern und fachlich prüfen. MS Project Client: geprüften Plan speichern, veröffentlichen, einchecken und veröffentlichten Stand prüfen. Owner-Wechsel: zuerst PM-Leserechte sichern, dann Änderung speichern und einchecken; anschließend Owner und Zugriff prüfen.',
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
        ...e('TTT', 'Abgestimmte Restpunkte vom 23.09.2026'),
        ...e('C23', 'Bestätigte Klärungen vom 23.09.2026'),
        ...e('B', '§3.6.2 Projektumfang festlegen; §3.6.3 Vertragsdaten einpflegen'),
        ...e('B', '§4.5.6 Speichern, veröffentlichen und einchecken'),
        ...owner.evidence,
      ],
      procedures: [
        {
          id: 'procedure-save-deliverables-list',
          title: 'Lieferliste speichern und prüfen',
          functionId: 'fn-deliverables',
          relatedArticleId: 'guide-deliverables-milestones',
          trigger: 'Liefergegenstände in der List of Deliverables wurden bearbeitet.',
          prerequisites: [
            'Die fachlich abgestimmten Liefergegenstände und die nötigen Bearbeitungsrechte liegen vor.',
          ],
          actions: [deliverables.actions[2]],
          expectedResults: [
            'Die gespeicherten Listeneinträge sollen mit den fachlich abgestimmten Liefergegenständen übereinstimmen.',
          ],
          checkQuestions: [
            ...deliverables.checkQuestions,
            'Sind die gespeicherten Liefergegenstände in der Liste wieder auffindbar?',
          ],
          evidence: deliverables.evidence,
        },
        {
          id: 'procedure-save-payment-terms-pdp',
          title: 'Zahlungsbedingungen auf PDP Contract speichern und prüfen',
          functionId: 'fn-payment-terms',
          relatedArticleId: 'guide-deliverables-milestones',
          trigger: 'Zahlungsbedingungen auf der PDP Contract wurden bearbeitet.',
          prerequisites: [
            'Die fachlich abgestimmten Vertragsangaben und die nötigen Bearbeitungsrechte liegen vor.',
          ],
          actions: [paymentTerms.actions[2]],
          expectedResults: [
            'Die gespeicherten Zahlungsbedingungen sollen mit der fachlich abgestimmten Vertragslage übereinstimmen.',
          ],
          checkQuestions: [
            ...paymentTerms.checkQuestions,
            'Sind die gespeicherten Zahlungsbedingungen auf der PDP Contract wieder auffindbar?',
          ],
          evidence: paymentTerms.evidence,
        },
        {
          id: 'procedure-save-project-plan',
          title: 'MS Project Client: geprüften Plan veröffentlichen und einchecken',
          functionId: 'fn-payment-milestones',
          relatedArticleId: 'guide-deliverables-milestones',
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
          relatedArticleId: 'guide-project-permissions',
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
          'Die alternativen Listen- und PDP-Wege, den Projektplan und den Owner-Wechsel nach Kontext unterscheiden.',
        preparation: [
          'Nur einen vorher geprüften Schulungskontext und fiktive Projektdaten verwenden.',
          'Wirksame Rechte, Client-Stand und veröffentlichten Planstand vor einer praktischen Übung gesondert prüfen.',
        ],
        exercise:
          'Redaktioneller Gesprächsvorschlag: Für die bearbeitete Lieferliste oder PDP Contract, den Projektplan und den Owner-Wechsel jeweils die passenden Prüffragen auswählen. Ein praktischer Durchlauf ist nicht dokumentiert.',
        expectedResult:
          'Die alternativen Kontextwege und ihre offenen Prüfungen werden getrennt erläutert.',
        limitation: 'Quellenbasierter Entwurf ohne fachliche Freigabe oder durchgeführte Schulung.',
      },
    },
  },
];

// Explicit source snapshot for the confirmed clarification revision of 23 September.
for (const article of savePublishArticles.filter((a) =>
  ['guide-save-publish-checkin'].includes(a.id),
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
