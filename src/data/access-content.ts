import type { Article, ContentRevision } from './types';
import type { KnowledgeContext, OwnerChangeTrainerPackage } from './domain';
import { evidence as e } from './sources';

const knowledge: KnowledgeContext = {
  functionIds: ['fn-project-permissions', 'fn-owner-change', 'fn-build-team'],
  stepIds: ['step-2-6', 'step-2-7', 'step-2-11', 'step-2-15'],
  issueIds: [
    'issue-build-sync',
    'issue-f-r1-open-07',
    'issue-f-r1-open-01',
    'issue-f-r1-open-02',
    'issue-f-r1-open-12',
  ],
  evidence: [
    ...e(
      'B',
      '§1.4 Berechtigungen; §3.6.5–3.6.7 Organisation, Zugriffsrechte und Teilprojektleiter',
    ),
    ...e('B', '§3.8.4 / §3.9.4 Zugriffsrechte für System-/ILS-Teilprojekte'),
  ],
  procedures: [
    {
      id: 'procedure-permissions',
      title: 'Stakeholder gezielt berechtigen',
      functionId: 'fn-project-permissions',
      trigger:
        'Eine Person benötigt Zugriff, soll aber nicht als operative Arbeitsressource ins Team aufgenommen werden.',
      prerequisites: [
        'Das betreffende Projekt ist bereitgestellt; Sie verfügen über die erforderlichen Rechte zur Rechteverwaltung.',
        'Die Person ist als User in der PWA verfügbar.',
        'Zweck und benötigter Zugriff sind geklärt: PM für das Kundenprojekt, TM für das System-Teilprojekt, ILSM für das ILS-Teilprojekt.',
      ],
      actions: [
        {
          text: 'Öffnen Sie im betreffenden Projekt Project Permissions und wählen Sie die Person aus.',
          tool: 'PWA / Project Center / Project Permissions',
        },
        {
          text: 'Wählen Sie nur die benötigten Rechte: Open the project, Edit and save the project, Publish the project, View the Project Summary in the Project Center, View the Project Schedule Details oder View the Project Site. Die Liste ist keine Empfehlung, alle Rechte zu vergeben.',
          tool: 'Project Permissions',
        },
        {
          text: 'Prüfen Sie die Rechtekombination aus Sicht der betroffenen Person. Dokumentieren Sie fachlich relevante Rollen- oder Zugriffsentscheidungen in der Projektorganisation.',
          tool: 'Project Center, Project Site und PDP Organisation',
        },
      ],
      expectedResults: [
        'Zusätzliche Stakeholder besitzen nur die für ihren Zweck ausgewählten Rechte.',
      ],
      checkQuestions: [
        'Kann die betreffende Person die benötigten Inhalte öffnen, ohne unnötige Bearbeitungs- oder Veröffentlichungsrechte zu erhalten?',
      ],
      evidence: e('B', '§3.6.6 Zugriffsrechte festlegen, Tabelle 14; §3.8.4 / §3.9.4'),
    },
    {
      id: 'procedure-owner-change',
      title: 'Owner wechseln und lesenden Eigenzugriff sichern',
      functionId: 'fn-owner-change',
      relatedArticleId: 'guide-save-publish-checkin',
      trigger:
        'Ein vom PMO bereitgestelltes System- oder ILS-Teilprojekt wird an den vorgesehenen Teilprojektleiter übergeben.',
      prerequisites: [
        'Der PM kann das Teilprojekt öffnen und verfügt über die erforderlichen Rechte für Selbstberechtigung und Owner-Änderung.',
        'Das Teilprojekt ist vom PMO angelegt und bereitgestellt; der vorgesehene TM bzw. ILSM ist als User verfügbar.',
        'Verwenden Sie für eine Übung ausschließlich einen vorher geprüften Schulungskontext. Konten und Site-Zugriff sind nicht pauschal nachgewiesen.',
      ],
      requiredRights: [
        'Open the project',
        'View the Project Summary in the Project Center',
        'View the Project Schedule Details',
        'View the Project Site',
      ],
      actions: [
        {
          text: 'Öffnen Sie als PM das Teilprojekt. Sichern Sie sich vor dem Owner-Wechsel über Project Permissions die vier oben genannten Rechte.',
          tool: 'PWA / Project Center / Project Permissions',
        },
        {
          text: 'System-Teilprojekt: Öffnen Sie System Overview und tragen Sie den vorgesehenen Technical Manager im Feld Owner ein. ILS-Teilprojekt: Verwenden Sie ILS Overview und den vorgesehenen ILS Manager.',
          tool: 'PDP System Overview oder ILS Overview',
        },
        {
          text: 'Speichern Sie die Änderung und schließen Sie die Bearbeitung mit Check-in ab. Wiederholen Sie den abgegrenzten Weg bei weiteren zu übergebenden Teilprojekten.',
          tool: 'PWA',
        },
        {
          text: 'Informieren Sie die eingesetzten Teilprojektleiter über die Übergabe. Dokumentieren Sie die Zuordnung zusätzlich unter Subprojects auf der PDP Organisation.',
          tool: 'PDP Organisation / Subprojects',
        },
      ],
      expectedResults: [
        'TM bzw. ILSM ist Owner und kann das eigene Teilprojekt öffnen.',
        'Der PM behält lesenden Zugriff auf das Teilprojekt und die vorgesehenen Inhalte.',
        'Owner und Teilprojektleiter-Zuordnung unter Subprojects stimmen überein.',
      ],
      checkQuestions: [
        'Sind die vier Rechte vor der Übergabe gesichert?',
        'Können der neue Owner und der PM anschließend mit ihren jeweiligen Konten die vorgesehenen Inhalte öffnen?',
        'Stimmt die Zuordnung im Owner-Feld mit Subprojects überein?',
      ],
      evidence: e('B', '§3.6.7 Teilprojektleiter einsetzen'),
    },
  ],
  trainer: {
    objective:
      'Fachliche Rolle, Teamzuordnung und Einzelrechte unterscheiden; einen Owner-Wechsel mit erhaltenem PM-Lesezugriff nachvollziehen.',
    preparation: [
      'Bereitgestelltes System- oder ILS-Schulungsprojekt, PM-Konto und Ziel-Owner-Konto prüfen.',
      'Vor der Übung die wirksamen Konten-/Site-Rechte und den Systemstand prüfen; B und T beschreiben unterschiedliche Build-Team-Schulungswege.',
      'Keine produktiven oder vertraulichen Projektdaten im Center erfassen.',
    ],
    exercise:
      'Vorgeschlagene Übung: Den Ablauf „Owner wechseln“ im geprüften Schulungskontext durchführen. Anschließend PM-Zugriff und Zugriff des neuen Owners getrennt prüfen und die Zuordnung mit Subprojects vergleichen.',
    expectedResult:
      'Die Rollenübergabe und die vorgesehenen Lesezugriffe sind mit den betroffenen Konten nachvollzogen. Build-Team-Synchronisation wird damit nicht mitgeprüft oder freigegeben.',
    limitation:
      'Redaktioneller Übungsvorschlag, kein bereits durchgeführter Unterricht und kein Schulungsnachweis. SB1 ist hier ein fachlicher Bezug; die Demo-Lernpfade bleiben unverändert.',
  },
};

const ownerChangeTrainer: OwnerChangeTrainerPackage = {
  procedureId: 'procedure-owner-change',
  customerProject: 'KP-Übung-01 (fiktiv)',
  pmAccount: 'PM-Übung',
  currentOwner: 'PM-Übung',
  currentSubprojects: 'PM-Übung',
  variants: [
    {
      id: 'tm',
      label: 'System-Teilprojekt an TM',
      subproject: 'SYS-Übung-01 (fiktiv)',
      targetAccount: 'TM-Übung',
      plannedOwner: 'TM-Übung',
      plannedSubprojects: 'TM-Übung',
    },
    {
      id: 'ilsm',
      label: 'ILS-Teilprojekt an ILSM',
      subproject: 'ILS-Übung-01 (fiktiv)',
      targetAccount: 'ILSM-Übung',
      plannedOwner: 'ILSM-Übung',
      plannedSubprojects: 'ILSM-Übung',
    },
  ],
  prechecks: [
    'Mit dem PM-Konto die Sichtbarkeit von Kundenprojekt, Teilprojekt, PDP und Project Site im vorgesehenen Schulungssystem prüfen.',
    'Mit dem PM-Konto die erforderlichen Bearbeitungsrechte für Project Permissions, Owner-Änderung, Speichern und Check-in prüfen.',
    'Das getrennte Zielkonto als User prüfen und seine Projekt- und Site-Sichtbarkeit vor der Übergabe festhalten, ohne Zugriff vorauszusetzen.',
    'Vor der Übung den zulässigen Rücksetzweg für Owner, Subprojects und PM-Rechte klären; keine Reset-Funktion voraussetzen.',
  ],
  pmExpected:
    'Der PM kann das Teilprojekt, die Projektübersicht, den Plan und die Project Site mit den vorgesehenen Leserechten öffnen.',
  targetExpected:
    'Das Zielkonto ist Owner, kann das eigene Teilprojekt und die vorgesehene Project Site öffnen; die Zuordnung unter Subprojects stimmt überein.',
  resetCheck:
    'Vor der Übung den zulässigen Rücksetzweg für Owner, Subprojects und PM-Rechte im Schulungssystem klären und vorbereiten. Eine Reset-Funktion oder erfolgreiche Rücksetzung ist durch die Quellen nicht belegt.',
};

const revision = (note: string): ContentRevision[] => [
  {
    number: 1,
    date: '2026-09-22',
    note,
    sources: [
      { sourceId: 'B', sha256: 'E4AED78DC586A4F60CC98B411F109D8E59295A78CE570BF23005C7247AFD7727' },
      { sourceId: 'F', sha256: 'B68766FE1877A72A2E437F354ED7441C990C6D640E0A9185D77A22F04A35B0A4' },
      { sourceId: 'K', sha256: '58B5383B70C9E565AD85058752819B16E7603A55DC98184A4F4A2036CC8D5688' },
      { sourceId: 'S', sha256: 'E33A4CF88E48B201040BC93B82FFA5DCEEC0C9EEC5F0DFBF63665E8EEF908939' },
      { sourceId: 'T', sha256: '1F6F3C23BDA042B67E9DB2BC88722EDBBA3C2591CA3F6AEA2A73FC9335C5A0DB' },
      { sourceId: 'H', sha256: 'C64438D9F8AB772AFCF333D351887DE597144BF976B875AFF2DB56CB6846B18C' },
    ],
  },
];

export const accessArticles: Article[] = [
  {
    id: 'guide-project-permissions',
    status: 'source-draft',
    revisions: [
      ...revision(
        'Bestandsfassung des quellenbasierten Zugriffs- und Owner-Wechsel-Entwurfs erfasst.',
      ),
      {
        number: 2,
        date: '2026-09-23',
        note: 'Fiktives Trainerpaket für Vorbereitung und Soll-/Ist-Beobachtung des Owner-Wechsels ergänzt; kein praktischer Durchlauf belegt.',
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
            sourceId: 'K',
            sha256: '58B5383B70C9E565AD85058752819B16E7603A55DC98184A4F4A2036CC8D5688',
          },
          {
            sourceId: 'S',
            sha256: 'E33A4CF88E48B201040BC93B82FFA5DCEEC0C9EEC5F0DFBF63665E8EEF908939',
          },
          {
            sourceId: 'T',
            sha256: '1F6F3C23BDA042B67E9DB2BC88722EDBBA3C2591CA3F6AEA2A73FC9335C5A0DB',
          },
          {
            sourceId: 'H',
            sha256: 'C64438D9F8AB772AFCF333D351887DE597144BF976B875AFF2DB56CB6846B18C',
          },
        ],
      },
    ],
    reviews: [],
    title: 'Zugriffsrechte festlegen und Owner wechseln',
    summary:
      'Stakeholder gezielt berechtigen und ein Teilprojekt an TM oder ILSM übergeben, während der PM seinen lesenden Zugriff erhält.',
    topic: 'Team & Zugriff',
    roles: ['pm', 'tm', 'ilsm', 'pmo'],
    kind: 'Anleitung',
    minutes: 8,
    updated: '2026-09-23',
    sections: [
      {
        title: 'Den passenden Zugriffsweg wählen',
        body: 'Die Rollenliste auf der PDP Organisation dokumentiert fachliche Verantwortung. Der aktuelle SB1-Handbuchentwurf beschreibt Build Team für operative Teammitglieder und Project Permissions für zusätzliche Stakeholder. Die ältere Schulungsmatrix beschränkt den Weg auf Project Permissions. Beide Aussagen bleiben unten sichtbar.',
      },
      {
        title: 'Build Team: beschriebener Weg mit offenem Nachweis',
        body: 'Laut Handbuch werden operative Personen über Build Team als Arbeitsressourcen zugeordnet und zusätzlich mit ihrer fachlichen Rolle in der Organisation geführt. Das ist keine detaillierte Kapazitäts- oder Arbeitspaketplanung. Der Entwurf behauptet automatische PDP-Leserechte und Site-Lese-/Schreibrechte; diese Wirkung ist wegen der abweichenden Konfigurationsquelle nicht als garantiert anzunehmen. Prüfen Sie die tatsächlichen Zugriffe vor einer Übung.',
      },
    ],
    takeaway:
      'Eigenzugriff zuerst sichern, dann Owner übergeben. Ein beschriebener oder begrenzt verifizierter Weg ist keine Freigabe der gesamten Rechte-Matrix.',
    related: ['faq-role-vs-access', 'guide-save-publish-checkin'],
    knowledge: { ...knowledge, trainer: { ...knowledge.trainer, ownerChange: ownerChangeTrainer } },
  },
  {
    id: 'faq-role-vs-access',
    status: 'source-draft',
    revisions: revision(
      'Bestandsfassung der quellenbasierten FAQ zu Rollen, Team und Rechten erfasst.',
    ),
    reviews: [],
    title: 'Rollenliste, Build Team und Project Permissions unterscheiden',
    summary:
      'Warum eine eingetragene Projektrolle noch keinen Zugriff beweist und welcher Zugriffsweg im SB1-Entwurf für wen vorgesehen ist.',
    topic: 'Team & Zugriff',
    roles: ['pm', 'tm', 'ilsm', 'pmo'],
    kind: 'FAQ',
    minutes: 4,
    updated: '2026-09-22',
    sections: [
      {
        title: 'Reicht mein Eintrag in der Projektorganisation?',
        body: 'Nein. Die PDP Organisation bzw. System Organ. oder ILS Organisation dokumentiert Mitarbeiter, Projektrolle und Prozessrolle. Die tatsächlich wirksamen Zugriffe müssen gesondert eingerichtet und geprüft werden. Der grundsätzliche iPPM-Zugang setzt laut Handbuch die passende Gruppen-/User-Zuordnung voraus.',
      },
      {
        title: 'Wann ist Build Team vorgesehen?',
        body: 'Der aktuelle Handbuchentwurf sieht Build Team für Personen vor, die operativ im Projekt oder Teilprojekt arbeiten. Diese Teamzuordnung ist von Vorgangszuweisungen und Kapazitätsplanung zu unterscheiden. Die Schulungsmatrix beschreibt dagegen einen früheren SB1-Weg ohne Build Team. Der Entwurf ist keine Bestätigung der automatischen Rechte-Synchronisation.',
      },
      {
        title: 'Wann verwende ich Project Permissions?',
        body: 'Für zusätzliche Stakeholder, die nicht als Arbeitsressourcen ins Team aufgenommen werden sollen, beschreibt der Entwurf gezielte Einzelrechte. Vor einem Owner-Wechsel sichert der PM darüber auch seinen benötigten Lesezugriff. Nicht jeder Stakeholder benötigt Bearbeitungs- oder Publish-Rechte.',
      },
      {
        title: 'Was ändert sich zwischen PM, TM und ILSM?',
        body: 'Der PM verantwortet das Kundenprojekt, der TM das System-Teilprojekt und der ILSM das ILS-Teilprojekt. Der Entwurf beschreibt gleiche grundlegende Rechteprofile, aber unterschiedliche Verantwortungsbereiche. Daraus folgt keine Garantie effektiver Rechte jedes Kontos. Das PMO stellt die Projektumgebung bereit.',
      },
      {
        title: 'Ist der Owner-Wechsel damit vollständig freigegeben?',
        body: 'Nein. Die Funktionsmatrix bewertet den konkret geübten Weg „Eigenzugriff sichern, dann Owner wechseln“ als verifiziert. Die vollständige Rechtematrix, reguläre Konten, Bestands-Sites und Zielumgebung bleiben gesonderte Prüfpunkte. Ein erfolgreich gelesener Beitrag ändert keinen dieser Nachweise.',
      },
    ],
    takeaway:
      'Rollenverantwortung, Teamzugehörigkeit und wirksame Rechte sind drei getrennte Fragen.',
    related: ['guide-project-permissions'],
    knowledge: { ...knowledge, procedures: [] },
  },
];
