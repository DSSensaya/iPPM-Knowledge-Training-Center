import type { Article, LearningPath, Process, Role, Topic } from './types';
import { accessArticles } from './access-content';
import { milestoneArticles } from './milestone-content';

export const roles: Role[] = [
  'Alle Rollen',
  'Projektleitung',
  'Projektteam',
  'Portfoliomanagement',
  'pm',
  'pmo',
  'tm',
  'ilsm',
];
export const topics: Topic[] = [
  'Grundlagen',
  'Projektplanung',
  'Status & Reporting',
  'Ressourcen',
  'Portfolio',
  'Team & Zugriff',
];
export const articles: Article[] = [
  ...accessArticles,
  ...milestoneArticles,
  {
    id: 'ippm-verstehen',
    status: 'demo',
    title: 'iPPM verstehen: vom Projekt zum Portfolio',
    summary:
      'Wie Projekte, Ressourcen und strategische Ziele zusammenhängen – und welchen Beitrag Ihre Rolle leistet.',
    topic: 'Grundlagen',
    roles: ['Projektleitung', 'Projektteam', 'Portfoliomanagement'],
    kind: 'Grundlagen',
    minutes: 5,
    updated: '2026-09-14',
    sections: [
      {
        title: 'Ein gemeinsames Bild statt einzelner Listen',
        body: 'Integriertes Projekt- und Projektportfoliomanagement verbindet die operative Projektarbeit mit der übergreifenden Steuerung. Die Projektplanung beschreibt das Vorhaben. Der Statusbericht macht Abweichungen sichtbar. Im Portfolio werden Vorhaben, Prioritäten und begrenzte Kapazitäten gemeinsam betrachtet.',
      },
      {
        title: 'Was Ihre Rolle beiträgt',
        body: 'Gute Entscheidungen beginnen mit nachvollziehbaren Angaben.',
        steps: [
          'Projektteam: Arbeitspakete, Restaufwände und Hindernisse aktuell halten.',
          'Projektleitung: Termine, Kosten, Risiken und Maßnahmen zu einem konsistenten Projektbild zusammenführen.',
          'Portfoliomanagement: Abhängigkeiten und Kapazitätskonflikte über mehrere Vorhaben hinweg bewerten.',
        ],
      },
      {
        title: 'Beispiel: ein gemeinsamer Prüfstand',
        body: 'Zwei fiktive Entwicklungsprojekte benötigen im Oktober denselben Prüfstand. Jedes Projekt ist einzeln plausibel geplant. Erst die gemeinsame Kapazitätssicht zeigt den Konflikt. Die Projektleitungen erarbeiten Alternativen; eine priorisierte Entscheidung wird im Portfolio dokumentiert.',
      },
    ],
    takeaway:
      'iPPM schafft eine gemeinsame Entscheidungsgrundlage. Verlässliche Projektdaten sind dafür wichtiger als eine möglichst große Datenmenge.',
    related: ['projekt-anlegen', 'portfolio-priorisieren'],
  },
  {
    id: 'projekt-anlegen',
    status: 'demo',
    title: 'Ein Projekt sauber aufsetzen',
    summary: 'Von Ziel und Verantwortlichkeiten bis zur ersten belastbaren Planungsbasis.',
    topic: 'Projektplanung',
    roles: ['Projektleitung'],
    kind: 'Anleitung',
    minutes: 8,
    updated: '2026-09-18',
    sections: [
      {
        title: 'Vor dem Start',
        body: 'Klären Sie Auftrag, Ziel und Abgrenzung des Vorhabens. Diese Anleitung beschreibt einen beispielhaften Arbeitsablauf, keine konkreten Masken oder Berechtigungen einer produktiven iPPM-Installation.',
      },
      {
        title: 'In fünf Schritten zur Planungsbasis',
        body: 'Nutzen Sie die folgenden Schritte als Gesprächsgrundlage für den Projektstart.',
        steps: [
          'Projekt benennen und ein messbares Ziel formulieren, zum Beispiel: „Prüfkonzept bis 30. November abgestimmt“.',
          'Projektleitung, Auftraggeber und beteiligte Bereiche benennen.',
          'Liefergegenstände und ausdrücklich ausgeschlossene Leistungen beschreiben.',
          'Arbeitspakete mit Verantwortlichen und Meilensteinen strukturieren.',
          'Aufwände, Kapazitäten und Annahmen abstimmen; den abgestimmten Planstand nachvollziehbar festhalten.',
        ],
      },
      {
        title: 'Woran Sie eine gute Ausgangsbasis erkennen',
        body: 'Jedes Arbeitspaket hat ein prüfbares Ergebnis und eine verantwortliche Person. Meilensteine benennen Ergebnisse statt Tätigkeiten. Offene Annahmen sind sichtbar, nicht stillschweigend als Zusage eingeplant.',
      },
    ],
    takeaway:
      'Eine gute Planung macht Ziel, Verantwortung und Annahmen explizit – bevor Termine als verbindlich betrachtet werden.',
    related: ['meilensteine', 'ressourcen-planen'],
  },
  {
    id: 'statusbericht',
    status: 'demo',
    title: 'Einen aussagekräftigen Statusbericht erstellen',
    summary:
      'Termine, Kosten und Risiken auf den Punkt bringen. Mit einem klaren Vorschlag für die nächste Entscheidung.',
    topic: 'Status & Reporting',
    roles: ['Projektleitung', 'Projektteam'],
    kind: 'Anleitung',
    minutes: 7,
    updated: '2026-09-20',
    sections: [
      {
        title: 'Zuerst den Berichtsstand festlegen',
        body: 'Ein Statusbericht ist eine Momentaufnahme zu einem klaren Stichtag. Verwenden Sie für Ist-Daten, Prognosen und Kommentare denselben Berichtsstand. Prüfen Sie, welche Angaben bereits aktualisiert wurden und wo Rückmeldungen fehlen.',
      },
      {
        title: 'Den Bericht schrittweise aufbauen',
        body: 'Beschreiben Sie Entwicklungen so, dass auch Personen außerhalb des Projektteams sie einordnen können.',
        steps: [
          'Stichtag und betrachteten Zeitraum angeben.',
          'Termin- und Kostenprognose mit dem abgestimmten Plan vergleichen.',
          'Die wichtigsten Abweichungen mit Ursache und Auswirkung erläutern.',
          'Je Abweichung eine Maßnahme, eine verantwortliche Person und einen Termin benennen.',
          'Erforderliche Entscheidungen konkret formulieren und den nächsten Prüfpunkt festlegen.',
        ],
      },
      {
        title: 'Beispiel für einen belastbaren Kommentar',
        body: '„Die Freigabe des Prüfkonzepts verschiebt sich voraussichtlich um fünf Arbeitstage, da zwei Eingangsdaten fehlen. Die Arbeitspaketleitung klärt diese bis 25. September. Entscheidung benötigt: Kann die nachfolgende Review-Runde auf 2. Oktober verlegt werden?“ Das ist hilfreicher als „Termin kritisch“.',
      },
      {
        title: 'Ampelfarben brauchen eine Begründung',
        body: 'Bewerten Sie den Status anhand abgestimmter Kriterien. Eine Farbe ersetzt weder die Prognose noch die Erläuterung. Die in dieser Demo verwendeten Beispiele definieren keine unternehmensweit verbindlichen Ampelschwellen.',
      },
    ],
    takeaway:
      'Ein guter Statusbericht verbindet Abweichung, Auswirkung, Maßnahme und Entscheidungsbedarf.',
    related: ['risiken', 'reporting-check'],
  },
  {
    id: 'meilensteine',
    status: 'demo',
    title: 'Meilensteine und Abhängigkeiten planen',
    summary: 'Prüfbare Ergebnisse definieren und Terminfolgen frühzeitig erkennen.',
    topic: 'Projektplanung',
    roles: ['Projektleitung', 'Projektteam'],
    kind: 'Anleitung',
    minutes: 6,
    updated: '2026-09-12',
    sections: [
      {
        title: 'Ergebnisse statt Aktivitäten',
        body: 'Ein Meilenstein beschreibt einen überprüfbaren Zustand, zum Beispiel „Prüfkonzept abgestimmt“. „Am Prüfkonzept arbeiten“ ist eine Tätigkeit und hat kein eindeutiges Abschlusskriterium.',
      },
      {
        title: 'Abhängigkeiten sichtbar machen',
        body: 'Ein realistischer Terminplan berücksichtigt Voraussetzungen und Übergaben.',
        steps: [
          'Für jeden Meilenstein Ergebnis und Abnahmekriterium beschreiben.',
          'Vorhergehende Arbeitspakete und externe Zuarbeiten zuordnen.',
          'Verantwortliche für Übergaben benennen.',
          'Bei Terminänderungen die nachfolgenden Meilensteine prüfen und betroffene Personen einbeziehen.',
        ],
      },
      {
        title: 'Plan und Prognose auseinanderhalten',
        body: 'Der abgestimmte Plan ist die Vergleichsbasis. Die Prognose beschreibt die aktuelle Erwartung. Ändern Sie die Vergleichsbasis nicht stillschweigend, um eine Abweichung verschwinden zu lassen. Änderungen brauchen einen nachvollziehbaren Anlass und die lokal vereinbarte Abstimmung.',
      },
    ],
    takeaway:
      'Ein Meilenstein ist dann nützlich, wenn alle Beteiligten eindeutig erkennen können, ob er erreicht ist.',
    related: ['projekt-anlegen', 'statusbericht'],
  },
  {
    id: 'ressourcen-planen',
    status: 'demo',
    title: 'Ressourcenbedarf realistisch abstimmen',
    summary:
      'Aufwand und verfügbare Kapazität unterscheiden, Engpässe erkennen und Alternativen vorbereiten.',
    topic: 'Ressourcen',
    roles: ['Projektleitung', 'Portfoliomanagement'],
    kind: 'Anleitung',
    minutes: 6,
    updated: '2026-09-16',
    sections: [
      {
        title: 'Bedarf ist noch keine Zusage',
        body: 'Der geschätzte Aufwand beschreibt die benötigte Arbeit. Die Kapazität beschreibt die verfügbare Leistung in einem Zeitraum. Eine Bedarfsmeldung reserviert noch keine Person. Stimmen Sie den Einsatz mit der zuständigen Ressourcenverantwortung ab.',
      },
      {
        title: 'Eine prüfbare Anfrage vorbereiten',
        body: 'Je genauer der Bedarf beschrieben ist, desto besser lassen sich Alternativen bewerten.',
        steps: [
          'Kompetenz und erwartetes Arbeitsergebnis benennen.',
          'Zeitraum und Aufwand angeben, zum Beispiel zehn Personentage innerhalb von vier Wochen.',
          'Bereits bekannte Abwesenheiten und parallele Aufgaben berücksichtigen.',
          'Bei Überlastung Verschiebung, Umfangsanpassung oder alternative Besetzung bewerten.',
          'Die vereinbarte Lösung und verbleibende Unsicherheit dokumentieren.',
        ],
      },
      {
        title: 'Beispiel: Kapazitätskonflikt',
        body: 'Eine Fachkraft hat im Beispiel acht verfügbare Personentage, zwei Projekte melden zusammen zwölf an. Vier Personentage bleiben ungedeckt. Eine Priorisierung oder Plananpassung ist nötig; die bloße Erfassung beider Bedarfe löst den Konflikt nicht.',
      },
    ],
    takeaway:
      'Planen Sie mit abgestimmter Verfügbarkeit und machen Sie ungedeckten Bedarf ausdrücklich sichtbar.',
    related: ['portfolio-priorisieren', 'meilensteine'],
  },
  {
    id: 'risiken',
    status: 'demo',
    title: 'Risiken bewerten und Maßnahmen ableiten',
    summary:
      'Unsicherheiten strukturiert beschreiben und aktiv steuern, bevor sie zu Problemen werden.',
    topic: 'Status & Reporting',
    roles: ['Projektleitung', 'Projektteam'],
    kind: 'Grundlagen',
    minutes: 5,
    updated: '2026-09-10',
    sections: [
      {
        title: 'Risiko oder eingetretenes Problem?',
        body: 'Ein Risiko ist ein unsicheres zukünftiges Ereignis. Ein bereits eingetretenes Ereignis ist ein Problem, das unmittelbar bearbeitet werden muss. Beides kann den Projektstatus beeinflussen, braucht aber eine unterschiedliche Beschreibung.',
      },
      {
        title: 'Vom Eintrag zur Steuerung',
        body: 'Eine Risikoliste allein reduziert noch kein Risiko.',
        steps: [
          'Ursache, mögliches Ereignis und Auswirkung getrennt beschreiben.',
          'Eintrittswahrscheinlichkeit und Auswirkung anhand vereinbarter Kriterien bewerten.',
          'Eine konkrete präventive Maßnahme und gegebenenfalls einen Notfallplan festlegen.',
          'Verantwortung und nächsten Überprüfungstermin dokumentieren.',
        ],
      },
      {
        title: 'Beispiel',
        body: '„Wenn die Prüfdaten nicht rechtzeitig vorliegen, kann die Review-Runde ausfallen und die Freigabe um eine Woche verzögert werden.“ Als Maßnahme wird ein früher Datencheck mit klarer Zuständigkeit vereinbart.',
      },
    ],
    takeaway:
      'Jedes wesentliche Risiko braucht eine verantwortliche Person und eine bewusste Entscheidung zum Umgang damit.',
    related: ['statusbericht', 'reporting-check'],
  },
  {
    id: 'portfolio-priorisieren',
    status: 'demo',
    title: 'Vorhaben im Portfolio priorisieren',
    summary: 'Strategischen Beitrag, Dringlichkeit und Kapazitätsbedarf gemeinsam betrachten.',
    topic: 'Portfolio',
    roles: ['Portfoliomanagement', 'Projektleitung'],
    kind: 'Grundlagen',
    minutes: 7,
    updated: '2026-09-15',
    sections: [
      {
        title: 'Vergleichbarkeit herstellen',
        body: 'Ein Portfolio bündelt Vorhaben für übergreifende Entscheidungen. Vergleichen Sie sie anhand gemeinsamer Kriterien und eines einheitlichen Datenstands. Eine hohe Einzelbewertung bedeutet noch nicht, dass alle Vorhaben gleichzeitig umsetzbar sind.',
      },
      {
        title: 'Eine Entscheidung vorbereiten',
        body: 'Die folgenden Kriterien sind Beispiele und keine offizielle Bewertungsmatrix.',
        steps: [
          'Strategischen Beitrag und erwarteten Nutzen erläutern.',
          'Verbindliche Termine und Folgen einer Verschiebung prüfen.',
          'Ressourcenbedarf, Risiken und Abhängigkeiten einbeziehen.',
          'Szenarien für Start, Verschiebung oder reduzierten Umfang vergleichen.',
          'Entscheidung, Begründung und Wiedervorlagetermin festhalten.',
        ],
      },
      {
        title: 'Priorität braucht eine Konsequenz',
        body: 'Wenn zwei Vorhaben dieselbe knappe Ressource benötigen, muss die Priorisierung in den Zeit- und Kapazitätsplänen sichtbar werden. Stimmen Sie die Auswirkungen mit den betroffenen Projektleitungen ab.',
      },
    ],
    takeaway:
      'Priorisierung ist eine Entscheidung über den Einsatz begrenzter Kapazitäten – nicht nur eine Rangliste.',
    related: ['ressourcen-planen', 'ippm-verstehen'],
  },
  {
    id: 'reporting-check',
    status: 'demo',
    title: 'Vor dem Reporting: der Qualitätscheck',
    summary: 'Sechs Prüfpunkte für einen konsistenten und entscheidungsfähigen Projektbericht.',
    topic: 'Status & Reporting',
    roles: ['Projektleitung'],
    kind: 'Checkliste',
    minutes: 3,
    updated: '2026-09-21',
    sections: [
      {
        title: 'Diese Punkte vor der Weitergabe prüfen',
        body: 'Gehen Sie die Liste mit den für Ihre Berichterstattung Verantwortlichen durch.',
        steps: [
          'Stichtag: Haben alle Daten denselben Bezugszeitpunkt?',
          'Vollständigkeit: Liegen die Rückmeldungen der relevanten Arbeitspakete vor?',
          'Plausibilität: Passen Fortschritt, Restaufwand und Terminprognose zusammen?',
          'Abweichungen: Sind Ursache und Auswirkung der wesentlichen Abweichungen erklärt?',
          'Maßnahmen: Sind Verantwortung und Termin eindeutig festgelegt?',
          'Entscheidungen: Ist klar, wer bis wann welche Entscheidung treffen soll?',
        ],
      },
      {
        title: 'Fehlende Daten transparent behandeln',
        body: 'Kennzeichnen Sie fehlende Rückmeldungen und erläutern Sie die Auswirkung auf die Aussagekraft. Ein offen ausgewiesener vorläufiger Stand ist hilfreicher als eine scheinbar präzise, unbelegte Aussage.',
      },
    ],
    takeaway:
      'Datenqualität bedeutet nicht nur Vollständigkeit, sondern auch Konsistenz und einen klaren Bezug zur Entscheidung.',
    related: ['statusbericht', 'risiken'],
  },
  {
    id: 'arbeitspakete',
    status: 'demo',
    title: 'Arbeitspakete verlässlich zurückmelden',
    summary:
      'Fortschritt, Restaufwand und Hindernisse so beschreiben, dass das Projektteam weiterplanen kann.',
    topic: 'Projektplanung',
    roles: ['Projektteam', 'Projektleitung'],
    kind: 'Anleitung',
    minutes: 4,
    updated: '2026-09-17',
    sections: [
      {
        title: 'Den Fortschritt am Ergebnis messen',
        body: 'Verstrichene Zeit ist kein sicherer Indikator für Fertigstellung. Beschreiben Sie, welche Ergebnisse vorliegen, welche Prüfungen noch fehlen und welcher Aufwand für den Abschluss voraussichtlich nötig ist.',
      },
      {
        title: 'Eine hilfreiche Rückmeldung',
        body: 'Nutzen Sie immer den vereinbarten Stichtag.',
        steps: [
          'Erreichte Teilergebnisse benennen.',
          'Verbleibende Arbeit und aktuellen Restaufwand schätzen.',
          'Voraussichtlichen Abschluss mit dem geplanten Termin vergleichen.',
          'Hindernisse und benötigte Unterstützung konkret angeben.',
        ],
      },
      {
        title: 'Beispiel',
        body: '„Drei von vier Prüffällen sind dokumentiert. Für den letzten Prüffall fehlen Eingangsdaten. Restaufwand: zwei Personentage nach Dateneingang. Unterstützung benötigt: Datenverantwortung bis Freitag klären.“',
      },
    ],
    takeaway:
      'Eine Rückmeldung ist dann wertvoll, wenn sie die nächste Planung und konkrete Unterstützung ermöglicht.',
    related: ['meilensteine', 'statusbericht'],
  },
];
export const recommendedArticleIds = [
  'guide-deliverables-milestones',
  'guide-project-permissions',
] as const;

export const learningPaths: LearningPath[] = [
  {
    id: 'einstieg',
    title: 'Sicher starten mit iPPM',
    summary:
      'Das Zusammenspiel verstehen, die eigene Rolle finden und erste Aufgaben sicher bearbeiten.',
    role: 'Alle Rollen',
    level: 'Einstieg',
    lessons: ['ippm-verstehen', 'projekt-anlegen', 'arbeitspakete'],
    question:
      'Zwei Projekte benötigen gleichzeitig dieselbe knappe Ressource. Was hilft am meisten?',
    answers: [
      'Beide Bedarfe unverändert als zugesagt einplanen.',
      'Den Konflikt gemeinsam bewerten und eine abgestimmte Priorisierung in die Pläne übernehmen.',
      'Den Bedarf erst im nächsten Statusbericht erwähnen.',
    ],
    correct: 1,
    explanation:
      'Die gemeinsame Sicht auf Bedarf und verfügbare Kapazität ermöglicht eine realistische Priorisierung. Diese muss anschließend in den Projektplänen umgesetzt werden.',
  },
  {
    id: 'reporting',
    title: 'Vom Projektstand zur Entscheidung',
    summary: 'Aussagekräftig berichten, Risiken einordnen und die Qualität Ihrer Berichte prüfen.',
    role: 'Projektleitung',
    level: 'Praxis',
    lessons: ['statusbericht', 'risiken', 'reporting-check'],
    question: 'Was gehört zu einer aussagekräftigen Abweichungsmeldung?',
    answers: [
      'Nur eine Ampelfarbe.',
      'Eine neue Planbasis, die die Abweichung entfernt.',
      'Ursache, Auswirkung, Maßnahme sowie Verantwortung und Termin.',
    ],
    correct: 2,
    explanation:
      'Eine belastbare Meldung macht den Handlungsbedarf nachvollziehbar. Eine Ampelfarbe allein liefert noch keine Entscheidungsgrundlage.',
  },
  {
    id: 'portfolio',
    title: 'Projekte im Zusammenhang steuern',
    summary: 'Abhängigkeiten erkennen und Kapazitäten auf die relevanten Vorhaben ausrichten.',
    role: 'Portfoliomanagement',
    level: 'Vertiefung',
    lessons: ['meilensteine', 'ressourcen-planen', 'portfolio-priorisieren'],
    question: 'Was unterscheidet eine Ressourcenanfrage von einer belastbaren Einsatzplanung?',
    answers: [
      'Die ausdrückliche Abstimmung mit der Ressourcenverantwortung und die Prüfung der Verfügbarkeit.',
      'Ein möglichst früher Eintrag ohne weitere Abstimmung.',
      'Eine hohe Prioritätsnummer.',
    ],
    correct: 0,
    explanation:
      'Ein erfasster Bedarf ist noch keine Zusage. Erst abgestimmte Verfügbarkeit macht den Einsatz realistisch planbar.',
  },
];

export const processes: Process[] = [
  {
    id: 'projektstart',
    title: 'Vom Auftrag zur Projektplanung',
    summary: 'Ein gemeinsames Verständnis schaffen, bevor die Umsetzung beginnt.',
    phases: [
      {
        title: 'Auftrag klären',
        role: 'Projektleitung',
        description: 'Ziel, Nutzen, Abgrenzung und Auftraggebende gemeinsam festhalten.',
        output: 'Abgestimmter Projektauftrag',
        article: 'projekt-anlegen',
      },
      {
        title: 'Arbeit strukturieren',
        role: 'Projektleitung & Projektteam',
        description:
          'Liefergegenstände in verantwortete Arbeitspakete und prüfbare Meilensteine übersetzen.',
        output: 'Struktur- und Terminplan',
        article: 'meilensteine',
      },
      {
        title: 'Kapazität abstimmen',
        role: 'Projektleitung & Ressourcenverantwortung',
        description: 'Bedarf und Verfügbarkeit abgleichen; Konflikte und Annahmen dokumentieren.',
        output: 'Abgestimmter Ressourceneinsatz',
        article: 'ressourcen-planen',
      },
      {
        title: 'Planungsbasis festhalten',
        role: 'Projektleitung',
        description:
          'Den abgestimmten Stand nach dem lokal geltenden Entscheidungsweg bestätigen lassen und dokumentieren.',
        output: 'Nachvollziehbare Planungsbasis',
        article: 'projekt-anlegen',
      },
    ],
  },
  {
    id: 'berichtszyklus',
    title: 'Vom Projektstatus zur Steuerung',
    summary: 'Aktuelle Daten in konkrete Maßnahmen und Entscheidungen übersetzen.',
    phases: [
      {
        title: 'Fortschritt melden',
        role: 'Projektteam',
        description:
          'Ergebnisse, Restaufwand und Hindernisse zum gemeinsamen Stichtag zurückmelden.',
        output: 'Aktuelle Arbeitspaketstände',
        article: 'arbeitspakete',
      },
      {
        title: 'Abweichungen bewerten',
        role: 'Projektleitung',
        description:
          'Prognose mit Plan vergleichen. Risiken, Auswirkungen und Maßnahmen einordnen.',
        output: 'Begründeter Projektstatus',
        article: 'statusbericht',
      },
      {
        title: 'Qualität prüfen',
        role: 'Projektleitung',
        description: 'Konsistenz, Vollständigkeit und konkrete Entscheidungsbedarfe prüfen.',
        output: 'Entscheidungsfähiger Bericht',
        article: 'reporting-check',
      },
      {
        title: 'Entscheiden & nachhalten',
        role: 'Projektleitung & Portfoliomanagement',
        description:
          'Maßnahmen und Prioritäten abstimmen, Verantwortungen festlegen und Wirkung im nächsten Zyklus prüfen.',
        output: 'Dokumentierte Entscheidungen',
        article: 'portfolio-priorisieren',
      },
    ],
  },
];

export const faqs = [
  {
    question: 'Sind die Inhalte offizielle TKMS-ATLAS-Vorgaben?',
    answer:
      'Nein. Die bestehenden Demo-Inhalte bleiben Beispiele. Die Beiträge zu Zugriff sowie Liefergegenständen und Meilensteinen sind quellenbasierte Entwürfe mit sichtbaren Nachweisen und Einschränkungen. Sie sind keine freigegebenen Arbeitsanweisungen; vor produktiver Verwendung ist eine fachliche Prüfung erforderlich.',
  },
  {
    question: 'Wie speichere ich meinen Lernfortschritt?',
    answer:
      'Öffnen Sie eine Lektion und wählen Sie am Ende „Als gelesen markieren“. Nach allen Lektionen schließen Sie den Lernpfad mit einem Wissenscheck ab. Fortschritt und Merkliste werden automatisch in diesem Browser gespeichert. Es gibt kein Benutzerkonto und keine Synchronisation.',
  },
  {
    question: 'Warum sehe ich ein Projekt oder eine Funktion in iPPM nicht?',
    answer:
      'Prüfen Sie zunächst, ob Sie im richtigen Arbeitskontext und mit der vorgesehenen Rolle arbeiten. Zugriffsrechte und verfügbare Funktionen hängen von der produktiven Konfiguration ab. Wenden Sie sich über Ihren etablierten internen Supportweg an die zuständige Ansprechperson. Dieses lokale Center verändert keine Berechtigungen.',
  },
  {
    question: 'Was gehört in eine hilfreiche Supportanfrage?',
    answer:
      'Beschreiben Sie die Aufgabe, die erwartete und die tatsächlich beobachtete Reaktion sowie die Schritte bis zum Problem. Ergänzen Sie Zeitpunkt und eine verständliche Fehlermeldung. Verwenden Sie ausschließlich freigegebene interne Supportkanäle und beachten Sie die geltenden Regeln für vertrauliche Daten.',
  },
  {
    question: 'Kann ich die Plattform ohne Internet verwenden?',
    answer:
      'Ja. Nach der einmaligen Installation der Entwicklungsabhängigkeiten benötigt die Anwendung nur den lokalen Server. Inhalte, Schriften und Programmdateien werden lokal ausgeliefert; es werden keine externen Dienste aufgerufen. Beim Löschen der Browserdaten gehen lokal gespeicherte Fortschritte und Merkeinträge verloren. Eine Sicherung können Sie unter „Mein Lernbereich“ exportieren.',
  },
];
