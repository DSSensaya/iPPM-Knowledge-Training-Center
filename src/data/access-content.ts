import type { Article } from './types';
import type { KnowledgeContext } from './domain';
import { evidence as e } from './sources';

const knowledge: KnowledgeContext = {
  status: 'source-draft',
  revision: 1,
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

export const accessArticles: Article[] = [
  {
    id: 'guide-project-permissions',
    title: 'Zugriffsrechte festlegen und Owner wechseln',
    summary:
      'Stakeholder gezielt berechtigen und ein Teilprojekt an TM oder ILSM übergeben, während der PM seinen lesenden Zugriff erhält.',
    topic: 'Team & Zugriff',
    roles: ['pm', 'tm', 'ilsm', 'pmo'],
    kind: 'Anleitung',
    minutes: 8,
    updated: '2026-09-22',
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
    related: ['faq-role-vs-access'],
    knowledge,
  },
  {
    id: 'faq-role-vs-access',
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
