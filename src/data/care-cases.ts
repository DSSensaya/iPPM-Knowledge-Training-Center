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
];
