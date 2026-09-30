import type { EvidenceRef } from './domain';
import { evidence } from './sources';

// Editorial records, not a second article catalog or a source of automatic approvals.
export interface CareCase {
  id: string;
  title: string;
  recordedOn: string;
  origin: 'reconstruction' | 'new-insight';
  observation: string | null;
  historicalQuestion: {
    text: string;
    evidence: EvidenceRef[];
    resolution: string;
  };
  claims: {
    id: string;
    text: string;
    confirmation: 'documented-confirmation' | 'implementation-unconfirmed' | 'unconfirmed';
    confirmedOn: string | null;
    evidence: EvidenceRef[];
    scope: { documented: string; release: string | null; environment: string | null };
    unknowns: string[];
  }[];
  impacts: {
    target:
      | { kind: 'article' | 'procedure' | 'issue' | 'step'; id: string }
      | { kind: 'document'; path: string; locator: string };
    relation: 'direct' | 'candidate' | 'historical';
    claimIds: string[];
    note: string;
  }[];
  sourceSnapshots: { sourceId: string; sha256: string }[];
  historicalAdoption: {
    articleRevisions: { articleId: string; revision: number }[];
    decisionEvidence: string | null;
    note: string;
  };
  change: {
    baseline: {
      commit: string;
      files: { path: string; sha256: string }[];
      articleRevisions: { articleId: string; revision: number }[];
    };
    proposal: string[];
    rationale: string;
    decision: {
      status: 'pending' | 'accepted' | 'rejected';
      date: string | null;
      record: string | null;
      scope: string;
    };
    implementation: {
      date: string;
      articleRevisions: { articleId: string; revision: number }[];
    } | null;
  };
  practicalEvidence: EvidenceRef[];
}

const clarification = evidence('C23', 'Punkt 1', 'TTT-D-06');
const originalQuestion = evidence('TTT', 'Zeile 7, A:G', 'TTT-D-06');
const sync = 'start-date-sync';
const edc = 'edc-contract-start';
const field = 'edc-field-provision';

export const careCases: CareCase[] = [
  {
    id: 'care-r1-statusabgleich-2026-09-30',
    title: 'Paket A: R1-Projektstatusübersicht mit Quelldaten abgleichen',
    recordedOn: '2026-09-30',
    origin: 'new-insight',
    observation:
      'Konkreter redaktioneller Umsetzungsauftrag zu Paket A. Keine neue Systembeobachtung; vorhandene Originalquellen und Arbeitsstand abgeglichen.',
    historicalQuestion: {
      text: '4.13 hatte Orientierung, aber keine Prozedur zum Vergleich von Projektübersicht und vorhandenen Eingangsdaten.',
      evidence: [
        {
          sourceId: 'B',
          locator: '§5.5.4-5.5.5',
          derivation: 'direct',
        },
        {
          sourceId: 'C23',
          locator: 'Punkte 5-7',
          derivation: 'direct',
        },
        {
          sourceId: 'T',
          locator: 'Release1-Matrix!A53:Q53',
          derivation: 'direct',
        },
        {
          sourceId: 'S',
          locator: '02_SCOPE_ID_MASTER!A5:L6',
          derivation: 'direct',
        },
        {
          sourceId: 'F',
          locator: 'R1 Funktionsmatrix!A9:J10',
          derivation: 'direct',
        },
        {
          sourceId: 'TTT',
          locator: 'Zeilen 40-43, A:G',
          derivation: 'direct',
        },
      ],
      resolution:
        'Begrenzten Abgleich im bestehenden Reporting-Beitrag ergänzen; bestätigte Korrekturen geschlossen und praktische Nachweise offen halten.',
    },
    claims: [
      {
        id: 'bounded-r1-comparison',
        text: 'B beschreibt den Vergleich mit gepflegten Plan- und Statusdaten; T ordnet die R1-Ansicht zu. Der begrenzte Center-Abgleich ist daraus redaktionell abgeleitet, keine fachliche Freigabe.',
        confirmation: 'unconfirmed',
        confirmedOn: null,
        evidence: [
          {
            sourceId: 'B',
            locator: '§5.5.4-5.5.5',
            derivation: 'direct',
          },
          {
            sourceId: 'C23',
            locator: 'Punkte 5-7',
            derivation: 'direct',
          },
          {
            sourceId: 'T',
            locator: 'Release1-Matrix!A53:Q53',
            derivation: 'direct',
          },
          {
            sourceId: 'S',
            locator: '02_SCOPE_ID_MASTER!A5:L6',
            derivation: 'direct',
          },
          {
            sourceId: 'F',
            locator: 'R1 Funktionsmatrix!A9:J10',
            derivation: 'direct',
          },
          {
            sourceId: 'TTT',
            locator: 'Zeilen 40-43, A:G',
            derivation: 'direct',
          },
        ],
        scope: {
          documented:
            'PM-Kundenprojekt: Project Center, veröffentlichter Plan und gespeicherter PDP Status; R1-04 nur Teilreferenz.',
          release: 'R1 / SB1 – begrenzter Quellenentwurf',
          environment: null,
        },
        unknowns: [
          'Praktischer Durchlauf mit Konto, Projekt, Release/Build und Umgebung.',
          'Fachliche Freigabe der Beitragsrevision 3; Rechte- und Bestands-Site-Reichweite.',
        ],
      },
    ],
    impacts: [
      {
        target: {
          kind: 'document',
          path: 'README.md',
          locator: 'Funktionen: Übersicht und Prozesse',
        },
        relation: 'direct',
        claimIds: ['bounded-r1-comparison'],
        note: 'Aktuelle Funktionsbeschreibung und SB1-Zählung nach tatsächlichem Teilumfang fortschreiben.',
      },
      {
        target: {
          kind: 'article',
          id: 'guide-r1-reporting',
        },
        relation: 'direct',
        claimIds: ['bounded-r1-comparison'],
        note: 'Revision 2 → 3; source-draft und leere Reviews erhalten.',
      },
      {
        target: {
          kind: 'procedure',
          id: 'procedure-r1-reporting',
        },
        relation: 'direct',
        claimIds: ['bounded-r1-comparison'],
        note: 'Ein begrenzter Abgleich; Voraussetzungen, Handlung und Ergebnisprüfung.',
      },
      {
        target: {
          kind: 'step',
          id: 'step-4-13',
        },
        relation: 'direct',
        claimIds: ['bounded-r1-comparison'],
        note: 'Reales Teilmaterial statt bloßer Orientierung; Umfang bleibt begrenzt.',
      },
      {
        target: {
          kind: 'issue',
          id: 'issue-r1-reporting-boundary',
        },
        relation: 'direct',
        claimIds: ['bounded-r1-comparison'],
        note: 'Aktuelle Endpunkt- und Nachweisgrenzen, ohne neue Filterlücke.',
      },
      {
        target: {
          kind: 'article',
          id: 'guide-status-orientation',
        },
        relation: 'candidate',
        claimIds: ['bounded-r1-comparison'],
        note: 'Vorhandene Prozedur wiederverwenden; keine Inhalts- oder Revisionsänderung.',
      },
      {
        target: {
          kind: 'article',
          id: 'guide-save-publish-checkin',
        },
        relation: 'candidate',
        claimIds: ['bounded-r1-comparison'],
        note: 'Vorhandenen Client-Abschluss als Voraussetzung verknüpfen; Revision unverändert.',
      },
      {
        target: {
          kind: 'document',
          path: 'docs/v0.9-planung.md',
          locator: 'Paket A',
        },
        relation: 'direct',
        claimIds: ['bounded-r1-comparison'],
        note: 'Tatsächlichen redaktionellen Fortschritt und offene Nachweise ausweisen; Historie erhalten.',
      },
      {
        target: {
          kind: 'document',
          path: 'docs/ROADMAP.md',
          locator: 'Paket A',
        },
        relation: 'direct',
        claimIds: ['bounded-r1-comparison'],
        note: 'Tatsächlichen redaktionellen Fortschritt und offene Nachweise ausweisen; Historie erhalten.',
      },
      {
        target: {
          kind: 'document',
          path: 'docs/pflegefall-r1-statusabgleich.md',
          locator: 'Paket A',
        },
        relation: 'direct',
        claimIds: ['bounded-r1-comparison'],
        note: 'Tatsächlichen redaktionellen Fortschritt und offene Nachweise ausweisen; Historie erhalten.',
      },
    ],
    sourceSnapshots: [
      {
        sourceId: 'B',
        sha256: 'E4AED78DC586A4F60CC98B411F109D8E59295A78CE570BF23005C7247AFD7727',
      },
      {
        sourceId: 'C23',
        sha256: 'B0A43BEBC4F414190DB98EB28576BC4B3DDBA888BCD31D19E1DECC478154751D',
      },
      {
        sourceId: 'T',
        sha256: '1F6F3C23BDA042B67E9DB2BC88722EDBBA3C2591CA3F6AEA2A73FC9335C5A0DB',
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
        sourceId: 'TTT',
        sha256: 'F20FC9AA5DCF380FA4E0CDB7F5D1E301DB8C89620AFA62B345107160FF2CBC36',
      },
    ],
    historicalAdoption: {
      articleRevisions: [
        {
          articleId: 'guide-r1-reporting',
          revision: 2,
        },
      ],
      decisionEvidence: null,
      note: 'Vorhandene Revision 2 dokumentiert den Ausgangsstand; keine nachträgliche Freigabe.',
    },
    change: {
      baseline: {
        commit: '8268d3939494580ca238cee891ce1b867adcf1ef',
        files: [
          {
            path: 'README.md',
            sha256: '1434BEE5C916D380C0500536EC9117D52F358DC9C3FC672F22B300965887BB58',
          },
          {
            path: 'src/data/control-content.ts',
            sha256: '7E8044917D2E08F73B3BAC645BD6C5F8DD1633282FFE7C1A7F9504904041BC63',
          },
          {
            path: 'src/data/content-readiness.ts',
            sha256: '5C7FFDF8C72027C54BD57E8107B4BA7EE85DEBC70F40CC34A71E78FEBE4AE5DE',
          },
          {
            path: 'src/data/inventory.ts',
            sha256: 'A4A7AE30618E8BC3F86E011526DF4B655DCC65D7AA1D6867F5484EA95EE9E570',
          },
          {
            path: 'src/data/catalog.ts',
            sha256: 'B70C93110F3FA2A9F119CADDCE26811341FF1239BF27B958B69CE28C3EF556AF',
          },
          {
            path: 'src/data/care-cases.ts',
            sha256: 'FC786E22E6B3D3A795418C216F041B69EB0DB4D5FCB78A222E93F257B95334B9',
          },
          {
            path: 'src/pages/Knowledge.tsx',
            sha256: 'B9E112EB894EA746AD4437A870A87F25445CD49C21B189A6100B953D356D0039',
          },
          {
            path: 'docs/v0.9-planung.md',
            sha256: '51CA9989007ECBA964EE6A2F781E29CA70E23CDAC3A7BDE932D55376F9AAA5D6',
          },
          {
            path: 'docs/ROADMAP.md',
            sha256: '4EFE1A40063CB90AE7F4C2B206EA1E844B2054CDFDD3C0739EE40913384680AD',
          },
          {
            path: 'tests/control.spec.ts',
            sha256: '0CA7B56DF2D8264D02CFD3DF7665F4961F3DFA54C7569AF159278B4BCF0662E4',
          },
          {
            path: 'tests/sb1-coverage.spec.ts',
            sha256: '0C4F5B3DE4AA29918A353A9926FE9BCCE714D869901EBDD5F814785453FC55F3',
          },
        ],
        articleRevisions: [
          {
            articleId: 'guide-r1-reporting',
            revision: 2,
          },
          {
            articleId: 'guide-status-orientation',
            revision: 3,
          },
          {
            articleId: 'guide-save-publish-checkin',
            revision: 3,
          },
        ],
      },
      proposal: [
        'Genau eine Abgleichprozedur in guide-r1-reporting ergänzen, ohne Eingabepflege oder Berichtsverteilung anzuleiten.',
        'Handlung und Ergebnisprüfung vor ausführliche Quelleninformationen stellen; R1-04 nur als belegten Teilbezug ergänzen.',
      ],
      rationale:
        'Bestehender Beitrag, Prozedur- und Beziehungsmodell genügen. Der Anwender kann Datenherkunft und offene Abweichungen erkennen, ohne Statusautomatik oder Rechtezusage.',
      decision: {
        status: 'accepted',
        date: '2026-09-30',
        record: 'docs/pflegefall-r1-statusabgleich.md#redaktionelle-entscheidung',
        scope:
          'Expliziter Umsetzungsauftrag Paket A einschließlich lokalem Commit; redaktionelle Übernahme innerhalb der Quellenreichweite. Keine fachliche Freigabe oder praktische iPPM-Bestätigung.',
      },
      implementation: {
        date: '2026-09-30',
        articleRevisions: [
          {
            articleId: 'guide-r1-reporting',
            revision: 3,
          },
        ],
      },
    },
    practicalEvidence: [],
  },
  {
    id: 'care-start-date-edc',
    title: 'Start Date / EDC: bestehende Übernahme nachvollziehen',
    recordedOn: '2026-09-28',
    origin: 'reconstruction',
    observation: null,
    historicalQuestion: {
      text: 'TTT-D-06 führte Feldbedeutung und Übernahmeregel als Prüfauftrag (ToDo).',
      evidence: originalQuestion,
      resolution:
        'C23 Punkt 1 klärt Synchronisation und EDC-Bedeutung ausdrücklich. Die zusätzliche Feldbereitstellung bleibt unbestätigt; die Originalquelle bleibt unverändert.',
    },
    claims: [
      {
        id: sync,
        text: 'Start Date auf PDP Overview und Projektplan sind synchronisiert und wirken gegenseitig aufeinander.',
        confirmation: 'documented-confirmation',
        confirmedOn: '2026-09-23',
        evidence: clarification,
        scope: {
          documented: 'PDP Overview und Projektplan laut C23 Punkt 1.',
          release: null,
          environment: null,
        },
        unknowns: [
          'Exakte Release-/Umgebungsreichweite und ausdrückliche Abdeckung der System-/ILS-Teilprojektvarianten.',
        ],
      },
      {
        id: edc,
        text: 'EDC ist unabhängig davon und nur der vertragliche Starttermin.',
        confirmation: 'documented-confirmation',
        confirmedOn: '2026-09-23',
        evidence: clarification,
        scope: { documented: 'EDC-Abgrenzung laut C23 Punkt 1.', release: null, environment: null },
        unknowns: [
          'Exakte Release-/Umgebungsreichweite; keine vollständige Rollen- oder Projekttypmatrix belegt.',
        ],
      },
      {
        id: field,
        text: 'Der Auftrag für ein zusätzliches EDC-Feld auf Contract ist noch nicht als umgesetzt bestätigt.',
        confirmation: 'implementation-unconfirmed',
        confirmedOn: null,
        evidence: [...originalQuestion, ...clarification],
        scope: {
          documented: 'Zusätzliches EDC-Feld auf PDP Contract.',
          release: null,
          environment: null,
        },
        unknowns: ['Bereitstellung und tatsächlicher Zielstand des zusätzlichen Felds.'],
      },
    ],
    impacts: [
      {
        target: { kind: 'article', id: 'guide-project-master-data' },
        relation: 'direct',
        claimIds: [sync, edc, field],
        note: 'Zusammenfassung, Kernaussage, Erläuterung, Übung und erwartetes Ergebnis; Fachtexte unverändert.',
      },
      {
        target: { kind: 'procedure', id: 'procedure-project-master-data' },
        relation: 'direct',
        claimIds: [sync, edc],
        note: 'Start-Date-Aktion und Prüffrage; C23 Punkt 1 direkt ergänzen. Keine Bestätigung der übrigen Bedienungsschritte.',
      },
      {
        target: { kind: 'article', id: 'guide-subproject-definition' },
        relation: 'direct',
        claimIds: [sync, edc],
        note: 'Vorhandene Verwendung dokumentiert, keine neue Bestätigung für Teilprojektvarianten.',
      },
      ...['system', 'ils'].map((variant) => ({
        target: { kind: 'procedure' as const, id: `procedure-${variant}-master-data` },
        relation: 'direct' as const,
        claimIds: [sync, edc],
        note: 'Vorhandene Aussage; ausdrückliche Reichweite für diese Variante bleibt offen. Bedienweg unverändert.',
      })),
      {
        target: { kind: 'issue', id: 'issue-f-r1-open-05' },
        relation: 'direct',
        claimIds: [sync, edc],
        note: 'Im bestätigten Umfang geschlossen lassen.',
      },
      {
        target: { kind: 'issue', id: 'issue-definition-configuration' },
        relation: 'direct',
        claimIds: [field],
        note: 'Bestehenden offenen Restpunkt erhalten; kein neues Sammel-Issue.',
      },
      ...['step-2-1', 'step-2-8', 'step-2-12'].map((id) => ({
        target: { kind: 'step' as const, id },
        relation: 'direct' as const,
        claimIds: [sync, edc],
        note: 'SB1-Abdeckung wird aus Definitionszeilen und offenen Issues abgeleitet; keine separate Textpflege.',
      })),
      ...['guide-project-handover', 'guide-project-objectives', 'guide-project-organization'].map(
        (id) => ({
          target: { kind: 'article' as const, id },
          relation: 'candidate' as const,
          claimIds: [field],
          note: 'Gemeinsame Quellen und breit zugeordnetes Konfigurations-Issue; kein nachgewiesenes fachliches Änderungsziel.',
        }),
      ),
      {
        target: {
          kind: 'document',
          path: 'docs/open-points-readiness.md',
          locator: 'Start Date / EDC; PDP-Felder',
        },
        relation: 'direct',
        claimIds: [sync, edc, field],
        note: 'Aktuelle Trennung korrekt, Fachtext unverändert.',
      },
      {
        target: {
          kind: 'document',
          path: 'docs/v0.6-abschluss.md',
          locator: 'Stammdaten / EDC; R1-OPEN-05',
        },
        relation: 'historical',
        claimIds: [sync, edc],
        note: 'Älteren offenen Stand als Historie erhalten; C23 aktualisiert die benannten Aussagen.',
      },
    ],
    sourceSnapshots: [
      {
        sourceId: 'C23',
        sha256: 'B0A43BEBC4F414190DB98EB28576BC4B3DDBA888BCD31D19E1DECC478154751D',
      },
      {
        sourceId: 'TTT',
        sha256: 'F20FC9AA5DCF380FA4E0CDB7F5D1E301DB8C89620AFA62B345107160FF2CBC36',
      },
    ],
    historicalAdoption: {
      articleRevisions: [
        { articleId: 'guide-project-master-data', revision: 2 },
        { articleId: 'guide-subproject-definition', revision: 2 },
      ],
      decisionEvidence: null,
      note: 'Bestehende redaktionelle Übernahme rekonstruiert. Kein separater damaliger Genehmigungsbeleg erfasst; keine rückdatierte Genehmigung.',
    },
    change: {
      baseline: {
        commit: '66a5c208e8c6afc641a374748dffb06262273231',
        files: [
          {
            path: 'src/data/definition-content.ts',
            sha256: '52A9046EDBE7725318338D74FA8E45559C4763CC39FC1F0C5AB71E8A8139CF1F',
          },
        ],
        articleRevisions: [
          { articleId: 'guide-project-master-data', revision: 2 },
          { articleId: 'guide-subproject-definition', revision: 2 },
        ],
      },
      proposal: [
        'Bestehende Aussagen, Quellen, Verwendungen und offene Reichweite in diesem Pflegefall verbinden.',
        'C23 Punkt 1 direkt am Stammdaten-Bedienweg nachweisen und die reine Belegergänzung als neue Beitragsrevision dokumentieren.',
      ],
      rationale:
        'Bestätigte Einzelaussagen, redaktionelle Übernahme und fehlende praktische Prüfung getrennt nachvollziehbar machen.',
      decision: {
        status: 'accepted',
        date: '2026-09-28',
        record: 'docs/pflegefall-start-date-edc.md#umsetzungsentscheidung',
        scope:
          'Expliziter Umsetzungsauftrag für das Änderungsdossier. Nur Register und Belegzuordnung; keine fachliche Neubestätigung oder Artikelfreigabe.',
      },
      implementation: {
        date: '2026-09-28',
        articleRevisions: [{ articleId: 'guide-project-master-data', revision: 3 }],
      },
    },
    practicalEvidence: [],
  },
  {
    id: 'care-project-purpose-wbs-2026-09-28',
    title: 'Project Purpose und WBS: gemeldete Umsetzung und Nachweise',
    recordedOn: '2026-09-28',
    origin: 'new-insight',
    observation:
      'Mitteilung des Auftraggebers, eingegangen am 28.09.2026 (N28 Punkte 1–3). Keine eigene Systembeobachtung; referenzierte Prüf- und Freigabeunterlagen liegen nicht vor. Eingang ist kein Durchführungs- oder Freigabedatum.',
    historicalQuestion: {
      text: 'TTT-D-20 fordert Feldentfernung und Zielprüfung; TTT-D-30/-31 fordern Fehlerkorrektur und vollständige WBS-Struktur.',
      evidence: [
        {
          sourceId: 'TTT',
          locator: 'Zeilen 21, 31 und 32, A:G',
          sourceKey: 'TTT-D-20/-30/-31',
          derivation: 'direct',
        },
        {
          sourceId: 'C23',
          locator: 'Punkte 4 und 9',
          derivation: 'direct',
        },
      ],
      resolution:
        'C23 Punkt 4 bestätigte nur die Entfernungsentscheidung; Punkt 9 behandelte die beiden WBS-Fehler bereits als erledigt. N28 meldet Umsetzung und ergänzende Nachweise. Keine erneute WBS-Schließung, kein neuer aktiver Fehler, keine pauschale Freigabe.',
    },
    claims: [
      {
        id: 'project-purpose-removal',
        text: 'Laut Auftraggebermeldung ist Project Purpose aus allen betroffenen Teilprojekt-PDPs entfernt; die Prüfung ergab laut Meldung keine Beeinträchtigung bestehender Daten oder Formulare.',
        confirmation: 'unconfirmed',
        confirmedOn: null,
        evidence: [
          {
            sourceId: 'N28',
            locator: 'Punkt 1',
            sourceKey: 'TTT-D-20',
            derivation: 'direct',
          },
          {
            sourceId: 'TTT',
            locator: 'Zeile 21, A:G',
            sourceKey: 'TTT-D-20',
            derivation: 'direct',
          },
          {
            sourceId: 'C23',
            locator: 'Punkt 4',
            sourceKey: 'TTT-D-20',
            derivation: 'direct',
          },
        ],
        scope: {
          documented:
            'Alle betroffenen Teilprojekt-PDPs laut Meldung; konkrete Varianten und Bestandsprojekte nicht bezeichnet.',
          release: null,
          environment: null,
        },
        unknowns: [
          'Release/Build und Zielumgebung unbekannt; Durchführung und Freigabe nicht datiert.',
          'Vollständiger PDP-/Teilprojekttypumfang einschließlich Bestandsprojekten.',
          'Prüfprotokoll mit Daten-/Formularvergleich, Datum und Prüfer.',
        ],
      },
      {
        id: 'wbs-correction-regression',
        text: 'Laut Auftraggebermeldung liegen ein reproduzierbarer WBS-Fehlerfall, eine dokumentierte Korrektur und ein erfolgreicher Regressionstest vor.',
        confirmation: 'unconfirmed',
        confirmedOn: null,
        evidence: [
          {
            sourceId: 'N28',
            locator: 'Punkt 2',
            sourceKey: 'TTT-D-30',
            derivation: 'direct',
          },
          {
            sourceId: 'TTT',
            locator: 'Zeile 31, A:G',
            sourceKey: 'TTT-D-30',
            derivation: 'direct',
          },
          {
            sourceId: 'C23',
            locator: 'Punkt 9',
            sourceKey: 'TTT-D-30',
            derivation: 'direct',
          },
        ],
        scope: {
          documented:
            'WBS-Generator laut Meldung; Zuordnung zum früheren EXU.SRR-Befund noch nachzuweisen.',
          release: null,
          environment: null,
        },
        unknowns: [
          'Release/Build und Zielumgebung unbekannt; Durchführung und Freigabe nicht datiert.',
          'Fehler-/Ticketbezug, Reproduktionsschritte und Zuordnung zum EXU.SRR-Befund.',
          'Korrekturversion und Regressionstestprotokoll mit Umfang, Ergebnissen, Datum und Prüfer.',
        ],
      },
      {
        id: 'wbs-complete-structure',
        text: 'Laut Auftraggebermeldung ist die vollständige erzeugte WBS-Struktur mit dokumentierter Freigabe nachgewiesen.',
        confirmation: 'unconfirmed',
        confirmedOn: null,
        evidence: [
          {
            sourceId: 'N28',
            locator: 'Punkt 3',
            sourceKey: 'TTT-D-31',
            derivation: 'direct',
          },
          {
            sourceId: 'TTT',
            locator: 'Zeile 32, A:G',
            sourceKey: 'TTT-D-31',
            derivation: 'direct',
          },
          {
            sourceId: 'C23',
            locator: 'Punkt 9',
            sourceKey: 'TTT-D-31',
            derivation: 'direct',
          },
        ],
        scope: {
          documented:
            'Erzeugte WBS-Struktur laut Meldung; genauer Struktur- und Freigabeumfang unbekannt.',
          release: null,
          environment: null,
        },
        unknowns: [
          'Release/Build und Zielumgebung unbekannt; Durchführung und Freigabe nicht datiert.',
          'Strukturartefakt und Sollvergleich einschließlich Segmentstruktur.',
          'Freigabedokument mit Gegenstand, Version, Datum und zuständiger freigebender Person.',
        ],
      },
    ],
    impacts: [
      {
        target: {
          kind: 'article',
          id: 'guide-subproject-definition',
        },
        relation: 'direct',
        claimIds: ['project-purpose-removal'],
        note: 'Scope-Aktionen und Erläuterung gezielt aktualisiert; Revision 2 → 3, weiterhin source-draft.',
      },
      {
        target: {
          kind: 'procedure',
          id: 'procedure-system-scope',
        },
        relation: 'direct',
        claimIds: ['project-purpose-removal'],
        note: 'N28 Punkt 1 direkt zugeordnet; Meldung und fehlende Nachweise ausdrücklich begrenzt.',
      },
      {
        target: {
          kind: 'procedure',
          id: 'procedure-ils-scope',
        },
        relation: 'direct',
        claimIds: ['project-purpose-removal'],
        note: 'N28 Punkt 1 direkt zugeordnet; Meldung und fehlende Nachweise ausdrücklich begrenzt.',
      },
      {
        target: {
          kind: 'step',
          id: 'step-2-9',
        },
        relation: 'direct',
        claimIds: ['project-purpose-removal'],
        note: 'Abdeckung bleibt abgeleitet; keine eigenständige Statusaufwertung.',
      },
      {
        target: {
          kind: 'step',
          id: 'step-2-13',
        },
        relation: 'direct',
        claimIds: ['project-purpose-removal'],
        note: 'Abdeckung bleibt abgeleitet; keine eigenständige Statusaufwertung.',
      },
      {
        target: {
          kind: 'issue',
          id: 'issue-definition-configuration',
        },
        relation: 'direct',
        claimIds: ['project-purpose-removal'],
        note: 'Nur Project-Purpose-Anteil aktualisiert; EDC und alle anderen Konfigurationsrestpunkte bleiben offen.',
      },
      {
        target: {
          kind: 'article',
          id: 'guide-save-publish-checkin',
        },
        relation: 'direct',
        claimIds: ['wbs-correction-regression', 'wbs-complete-structure'],
        note: 'Direkter WBS-Bezug geprüft; bestehende Einschränkungen unverändert, keine neue Revision.',
      },
      {
        target: {
          kind: 'article',
          id: 'guide-phases-tailoring',
        },
        relation: 'direct',
        claimIds: ['wbs-correction-regression', 'wbs-complete-structure'],
        note: 'Direkter WBS-Bezug geprüft; bestehende Einschränkungen unverändert, keine neue Revision.',
      },
      {
        target: {
          kind: 'issue',
          id: 'issue-phases-tailoring-boundary',
        },
        relation: 'direct',
        claimIds: ['wbs-correction-regression', 'wbs-complete-structure'],
        note: 'LCM-/ProjectLink-Grenzen und Hard-Link-Ausschluss bleiben unverändert.',
      },
      {
        target: {
          kind: 'article',
          id: 'guide-project-handover',
        },
        relation: 'candidate',
        claimIds: ['project-purpose-removal'],
        note: 'Gemeinsames Konfigurations-Issue; kein automatischer Eingriff in Artikeltexte oder Revisionen.',
      },
      {
        target: {
          kind: 'article',
          id: 'guide-project-master-data',
        },
        relation: 'candidate',
        claimIds: ['project-purpose-removal'],
        note: 'Gemeinsames Konfigurations-Issue; kein automatischer Eingriff in Artikeltexte oder Revisionen.',
      },
      {
        target: {
          kind: 'article',
          id: 'guide-project-objectives',
        },
        relation: 'candidate',
        claimIds: ['project-purpose-removal'],
        note: 'Gemeinsames Konfigurations-Issue; kein automatischer Eingriff in Artikeltexte oder Revisionen.',
      },
      {
        target: {
          kind: 'article',
          id: 'guide-project-organization',
        },
        relation: 'candidate',
        claimIds: ['project-purpose-removal'],
        note: 'Gemeinsames Konfigurations-Issue; kein automatischer Eingriff in Artikeltexte oder Revisionen.',
      },
      {
        target: {
          kind: 'procedure',
          id: 'procedure-system-master-data',
        },
        relation: 'candidate',
        claimIds: ['project-purpose-removal'],
        note: 'Andere Teilprojekt-Bedienwege unverändert.',
      },
      {
        target: {
          kind: 'procedure',
          id: 'procedure-system-organization',
        },
        relation: 'candidate',
        claimIds: ['project-purpose-removal'],
        note: 'Andere Teilprojekt-Bedienwege unverändert.',
      },
      {
        target: {
          kind: 'procedure',
          id: 'procedure-ils-master-data',
        },
        relation: 'candidate',
        claimIds: ['project-purpose-removal'],
        note: 'Andere Teilprojekt-Bedienwege unverändert.',
      },
      {
        target: {
          kind: 'procedure',
          id: 'procedure-ils-organization',
        },
        relation: 'candidate',
        claimIds: ['project-purpose-removal'],
        note: 'Andere Teilprojekt-Bedienwege unverändert.',
      },
      {
        target: {
          kind: 'step',
          id: 'step-1-2',
        },
        relation: 'candidate',
        claimIds: ['project-purpose-removal'],
        note: 'Breite Issue-Zuordnung; keine automatische Änderung von Schritten oder Schulungsreife.',
      },
      {
        target: {
          kind: 'step',
          id: 'step-2-1',
        },
        relation: 'candidate',
        claimIds: ['project-purpose-removal'],
        note: 'Breite Issue-Zuordnung; keine automatische Änderung von Schritten oder Schulungsreife.',
      },
      {
        target: {
          kind: 'step',
          id: 'step-2-3',
        },
        relation: 'candidate',
        claimIds: ['project-purpose-removal'],
        note: 'Breite Issue-Zuordnung; keine automatische Änderung von Schritten oder Schulungsreife.',
      },
      {
        target: {
          kind: 'step',
          id: 'step-2-4',
        },
        relation: 'candidate',
        claimIds: ['project-purpose-removal'],
        note: 'Breite Issue-Zuordnung; keine automatische Änderung von Schritten oder Schulungsreife.',
      },
      {
        target: {
          kind: 'step',
          id: 'step-2-8',
        },
        relation: 'candidate',
        claimIds: ['project-purpose-removal'],
        note: 'Breite Issue-Zuordnung; keine automatische Änderung von Schritten oder Schulungsreife.',
      },
      {
        target: {
          kind: 'step',
          id: 'step-2-10',
        },
        relation: 'candidate',
        claimIds: ['project-purpose-removal'],
        note: 'Breite Issue-Zuordnung; keine automatische Änderung von Schritten oder Schulungsreife.',
      },
      {
        target: {
          kind: 'step',
          id: 'step-2-12',
        },
        relation: 'candidate',
        claimIds: ['project-purpose-removal'],
        note: 'Breite Issue-Zuordnung; keine automatische Änderung von Schritten oder Schulungsreife.',
      },
      {
        target: {
          kind: 'step',
          id: 'step-2-14',
        },
        relation: 'candidate',
        claimIds: ['project-purpose-removal'],
        note: 'Breite Issue-Zuordnung; keine automatische Änderung von Schritten oder Schulungsreife.',
      },
      {
        target: {
          kind: 'article',
          id: 'guide-external-milestones',
        },
        relation: 'candidate',
        claimIds: ['wbs-correction-regression', 'wbs-complete-structure'],
        note: 'WBS-Feldprüfungen sind keine Generatorfreigabe; unverändert.',
      },
      {
        target: {
          kind: 'article',
          id: 'guide-deliverables-milestones',
        },
        relation: 'candidate',
        claimIds: ['wbs-correction-regression', 'wbs-complete-structure'],
        note: 'WBS-Feldprüfungen sind keine Generatorfreigabe; unverändert.',
      },
      {
        target: {
          kind: 'document',
          path: 'docs/open-points-readiness.md',
          locator: 'Fortschreibung 28.09.2026; PDP-Felder; WWS-/WBS-Generator',
        },
        relation: 'direct',
        claimIds: [
          'project-purpose-removal',
          'wbs-correction-regression',
          'wbs-complete-structure',
        ],
        note: 'Gemeldeten Nachweisstand und offene Belege ergänzen; historische Klärung erhalten.',
      },
      {
        target: {
          kind: 'document',
          path: 'docs/ROADMAP.md',
          locator: 'Pflegefall Project Purpose / WBS; fachlicher Abgleich 23.09.2026',
        },
        relation: 'direct',
        claimIds: [
          'project-purpose-removal',
          'wbs-correction-regression',
          'wbs-complete-structure',
        ],
        note: 'Redaktionellen Fortschritt dokumentieren; kein erweiterter Schulungsumfang oder fachlicher Abschluss.',
      },
      {
        target: {
          kind: 'document',
          path: 'docs/v0.3-inhalts-und-datenmodell.md',
          locator: 'ProjectLink und WBS; F FS-17/19/20; K P08/P09',
        },
        relation: 'historical',
        claimIds: ['wbs-correction-regression', 'wbs-complete-structure'],
        note: 'Historische Quellenkonflikte erhalten; N28 löst keine weiteren technischen Restpunkte.',
      },
      {
        target: {
          kind: 'document',
          path: 'docs/v0.6-abschluss.md',
          locator: 'Projekt- und Teilprojektdefinition',
        },
        relation: 'historical',
        claimIds: ['project-purpose-removal'],
        note: 'Historischen Abschluss unverändert erhalten.',
      },
      {
        target: {
          kind: 'document',
          path: 'docs/pflegefall-start-date-edc.md',
          locator: 'Nachvollziehbare Übernahme',
        },
        relation: 'historical',
        claimIds: ['project-purpose-removal'],
        note: 'Früheren Pflegefall mit damaliger Teilprojektrevision 2 erhalten.',
      },
    ],
    sourceSnapshots: [
      {
        sourceId: 'N28',
        sha256: 'F6B881EEF80A4B3A04F32883DBF6B1A8CE86E4511A61D3810659C1BBD128B5F5',
      },
      {
        sourceId: 'C23',
        sha256: 'B0A43BEBC4F414190DB98EB28576BC4B3DDBA888BCD31D19E1DECC478154751D',
      },
      {
        sourceId: 'TTT',
        sha256: 'F20FC9AA5DCF380FA4E0CDB7F5D1E301DB8C89620AFA62B345107160FF2CBC36',
      },
    ],
    historicalAdoption: {
      articleRevisions: [
        {
          articleId: 'guide-subproject-definition',
          revision: 2,
        },
      ],
      decisionEvidence: null,
      note: 'Ausgangsrevision enthält C23; kein separater damaliger Genehmigungsbeleg. Keine rückdatierte Genehmigung und keine frühere Übernahme von N28.',
    },
    change: {
      baseline: {
        commit: '6388fc362781635a3df48eff47e16384740de3d0',
        files: [
          {
            path: 'src/data/definition-content.ts',
            sha256: '5C2378C244E4FD726B36A376ECA2E661C2E50EF4F66EC08B69BA007FF26E7E4F',
          },
          {
            path: 'src/data/definition-catalog.ts',
            sha256: '992B1BC0D54013660E16F7844B5CB60DCE3D589762BE6DF36EB99AE6D0FB0694',
          },
          {
            path: 'src/data/care-cases.ts',
            sha256: '80AE79F00CA6E6766C7B1866836E124B3F6C319E3A5EBF674ECB93EF4C275206',
          },
          {
            path: 'src/data/sources.ts',
            sha256: '46DE82C7851C683BF1E1A515E58376C3AE1E159F8F7F051E5FB95C1DE9C9815F',
          },
          {
            path: 'docs/ROADMAP.md',
            sha256: 'F6400E73878B68F55D117E128854349C265F5F8FE08EDB4A8532058BB7E0AA6A',
          },
          {
            path: 'docs/open-points-readiness.md',
            sha256: '900EB86355D493BBC2532C3475BAED82368107F8FE260C8D467FF10BC807D261',
          },
          {
            path: 'tests/care-cases.spec.ts',
            sha256: '65DD9148923F5B70A6A3B85E46110521E371A940F2D33CD371A6883045657C61',
          },
          {
            path: 'tests/clarifications.spec.ts',
            sha256: '7734FD804FE6F6904AAFF8EAE42F60F309805593ED0E6C0EB9700178A61F4A26',
          },
          {
            path: 'tests/knowledge-data.spec.ts',
            sha256: 'C55C1690B742CF71850481192D074B95688AD6805F93824DA2B19AA2B9A37A67',
          },
        ],
        articleRevisions: [
          {
            articleId: 'guide-subproject-definition',
            revision: 2,
          },
          {
            articleId: 'guide-project-master-data',
            revision: 3,
          },
        ],
      },
      proposal: [
        'N28 als zugeschriebene Meldung aufnehmen; drei Claims und ihre offenen Nachweise getrennt erfassen.',
        'Nur Project-Purpose-Texte, unmittelbare Belege, Readiness und Pflegefortschritt aktualisieren; historische Revisionen erhalten.',
        'Regressionen gegen Statusaufwertung, unbeabsichtigte Änderungen und Verlust offener Restpunkte ergänzen.',
      ],
      rationale:
        'Beobachtung, redaktionelle Entscheidung, fachliche Bestätigung und praktische Prüfung getrennt halten.',
      decision: {
        status: 'accepted',
        date: '2026-09-28',
        record: 'docs/pflegefall-project-purpose-wbs.md#redaktionelle-entscheidung',
        scope:
          'Auftraggeber gibt das Dossier mit Präzisierungen zur redaktionellen Umsetzung frei: gemeldete Umsetzung/Prüfung kennzeichnen, 28.09. nur als Eingang behandeln, ausschließlich Project Purpose gezielt ändern; andere Konfigurationspunkte und WBS-Einschränkungen erhalten. Keine fachliche Bestätigung oder praktische Prüfung.',
      },
      implementation: {
        date: '2026-09-28',
        articleRevisions: [
          {
            articleId: 'guide-subproject-definition',
            revision: 3,
          },
        ],
      },
    },
    practicalEvidence: [],
  },
];
