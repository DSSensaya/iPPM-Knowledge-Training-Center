import type { Article } from './types';
import { evidence, sources } from './sources';

export const releaseArticles: Article[] = [
  {
    id: 'ippm-release-2-scope',
    status: 'source-draft',
    title: 'iPPM Release 2: geplanten Scope einordnen',
    summary:
      'Aktuelle Planung: R2 umfasst Kalkulation, Ressourcen, Kosten und SAP-Kopplung. Power-BI-Reporting ist R1B zugeordnet.',
    topic: 'Grundlagen',
    roles: ['pm', 'pmo', 'tm', 'ilsm'],
    kind: 'Grundlagen',
    minutes: 6,
    updated: '2026-09-23',
    takeaway:
      'R1B plant Reporting; R2 plant Kalkulation und Ressourcen-/Kostenplanung mit SAP-Kopplung. Der Scope belegt keine technische Verfügbarkeit oder Schulungsreife.',
    related: [],
    sections: [
      {
        title: 'Planungsstand und Geltungsbereich',
        body: 'Grundlage ist die am 23.09.2026 bereitgestellte aktuelle Releaseplanung. Sie beschreibt geplante Fähigkeiten und Ziele, keine freigegebenen Bedienwege. Ein Dokumentdatum und verbindliche Umsetzungstermine sind nicht angegeben. Die iPPM-Releases R1B und R2 sind von den Softwareversionen des Knowledge & Training Centers zu unterscheiden. Der SB1-Kernumfang des Centers bleibt bestehen.',
      },
      {
        title: 'R1B: Projekt- und Portfolio-Reporting',
        body: 'Geplant sind allgemeine Statusberichte, Terminabweichungsanalysen (Variance Analysis), Power-BI-Berichte und die Prüfung der Nutzbarkeit von Standardberichten. Damit soll die Basis zur Ablösung des bestehenden Project Reportingsystems entstehen.',
        steps: [
          'Voraussetzungen: Anbindung der Extension-Datenbank, Nutzbarkeit von Power BI, Datenmodelle und Historisierung (TPG).',
          'Reporting-PDP mit Power-BI-Anbindung und projektspezifisches Power BI Embedded (TPG).',
          'Project Reporting, Project Portfolio Reporting, Commercial Reporting und Projektrollen-Liste.',
          'Aufsatz aller Projekte mit jeweiligen Projektinformationen in der PWA (PDP). Tools: PWA Server und Power BI.',
        ],
      },
      {
        title: 'R2: Projekte kalkulieren',
        body: 'Ressourcenbedarfsplanung und Erstellung des Mengengerüsts bilden die Grundlage für die geplante Projektkalkulation.',
        steps: [
          'Generische Mitarbeiterbedarfsplanung und Ressourcenbedarfsplanung für die Produktion.',
          'Personal-, Produktions-, Beschaffungs- und Sachkostenplanung, zum Beispiel Reisekosten.',
          'Finanzierungskosten und Risikokosten planen; Kostenverläufe abbilden.',
          'Mengengerüste erstellen und analog zur Versionierung in SAP AK aktualisieren.',
        ],
      },
      {
        title: 'R2: SAP AK und MS Project bidirektional koppeln',
        body: 'TPG PS-Link soll SAP AK und MS Project verbinden. Genannt sind der Funktionsbaustein ZAKIPPM01 sowie die Verknüpfung eines SAP-AK-Angebots mit einem MSP-Projekt. Die aktuell genutzte Excel-Datei bildet eine Grundlage.',
        steps: [
          'Job 1: Daten von MSP in ein Angebot des AK-Moduls synchronisieren. Vorgänge als neue Aufgaben-Positionen unterhalb bestehender Aufgaben des zugehörigen Angebots übertragen, einschließlich Arbeitsaufwänden und Kosten.',
          'Planungsinformationen: Angebots-Nr. (AK), Angebotsposition, Aufgabe/Aufgaben-Nr., Beschreibung (Vorgang), Arbeitsplatz/Kostenstelle, Arbeit (h), Kosten, Kostenart, Variante, Risiko, Verlaufskurve, Start und Ende.',
          'Job 2: Informationen aus SAP AK nach MSP zurückschreiben.',
          'Ziel: bestehenden Mengengerüstprozess unter Berücksichtigung der Excel-Datei und der TXT-Importdatei ablösen.',
        ],
      },
      {
        title: 'R2: Ressourcen und organisatorische Grundlagen',
        body: 'Geplant sind der vollständige generische Aufbau des Resource Centers, die Verbindung zwischen Ressource und Kostenstelle (RBS) und die SAP-HR-Schnittstelle zur Übertragung von Ressourcen an MS Project Server.',
        steps: [
          'Technische Produktionsschnittstelle: SAP-Arbeitsplätze synchronisieren und PS-Link konfigurieren.',
          'Organisatorisch: generische Ressourcen und AP – Produktion (Produktionsschnittstelle) definieren; Building-Block-Liste bereitstellen.',
          'Genannte Tools: TPG PS Link, SAP HR, SAP AK, PWA Server, Desktop App und Extension-Datenbank.',
        ],
      },
      {
        title: 'Weitere Fähigkeiten – Backlog innerhalb der R2-Planung',
        body: 'Die Quelle führt diese Punkte unter „Weitere Fähigkeiten – Backlog“. Ablage, FuE/EDF-Basis und Health Checks erscheinen zusätzlich in den Releasezielen. Daraus werden hier keine gesonderten Zusagen oder Prioritäten abgeleitet.',
        steps: [
          'Pflegehygiene durch Quality/Health Checks: gepflegte Projektinformationen, Status und Eincheckzustand.',
          'Vertragsreporting implementieren.',
          'Projektdokumentation zentral mit einheitlicher Ablagestruktur bereitstellen; bestehende SharePoint Sites anbinden.',
          'Templates für FuE/EDF: Enterprise Project Types, Project Detail Pages, Project Sites und Project Plan Templates. Ziel ist eine Basis gemäß Scope Release 1.',
        ],
      },
      {
        title: 'Mitgeltende Dokumente und nächste fachliche Klärung',
        body: 'Genannt sind TPGPSLink_Spezifikation_TKMS_Atlas_V2, TXT-Importdatei SAP AK, Vorlage SAP-R/3: AK-Excel-Tool und Lösungsdesign. Diese Dokumente wurden mit der Releaseplanung nicht bereitgestellt. Detailkonfiguration, Zuständigkeiten, Termine und Schulungszuordnung müssen anhand dieser Grundlagen geklärt werden; die Übersicht liefert keine Bedienanleitung.',
      },
    ],
    revisions: [
      {
        number: 1,
        date: '2026-09-23',
        note: 'Aktuelle R1B-/R2-Planung als Scope-Orientierung eingebunden.',
        sources: [{ sourceId: 'R2P', sha256: sources.find((s) => s.id === 'R2P')!.sha256 }],
      },
    ],
    reviews: [],
    knowledge: {
      functionIds: [],
      stepIds: [],
      issueIds: [],
      procedures: [],
      evidence: evidence(
        'R2P',
        'Tabelle 1: Zeilen R1B und R2; Spalten Scope, Technisch, Organisatorisch, Ziel, Mitgeltende Dokumente und Tool',
      ),
      trainer: {
        objective:
          'R1B-Reporting und R2-Kalkulation sowie Planung und Verfügbarkeit unterscheiden.',
        preparation: [
          'Aktuelle Releaseplanung lesen; mitgeltende Dokumente für eine spätere Schulung beschaffen.',
        ],
        exercise: 'Reporting, Kalkulation und Ressourcenplanung den geplanten Releases zuordnen.',
        expectedResult:
          'R1B und R2 werden korrekt abgegrenzt; aus der Planung wird keine Systemverfügbarkeit abgeleitet.',
        limitation: 'Scope-Orientierung ohne operative Übung, Schulungszuordnung oder Freigabe.',
      },
    },
  },
];
