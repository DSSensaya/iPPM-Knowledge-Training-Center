// Quellengetreuer Katalogauszug vom 29.09.2026. Abgleich: docs/v0.8-vorbereitung.md.
import type { InventorySource } from './inventory';
export const inventorySource: InventorySource[] = [
  {
    id: 'step-1-1',
    title: 'Projekt beantragen',
    kind: 'Prozessschritt',
    aliases: ['1.1', 'QG-01-01'],
    context: 'Initialisierung · Project Manager · SB1 laut Schulungsmatrix',
    relatedIds: [],
    evidence: [
      {
        sourceId: 'T',
        locator: 'Release1-Matrix!A3:Q3',
        sourceKey: '1.1',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'step-1-2',
    title: 'Projekt anlegen',
    kind: 'Prozessschritt',
    aliases: ['1.2', 'QG-01-02'],
    context: 'Initialisierung · PMO · SB1 laut Schulungsmatrix',
    relatedIds: [],
    evidence: [
      {
        sourceId: 'T',
        locator: 'Release1-Matrix!A4:Q4',
        sourceKey: '1.2',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'step-2-1',
    title: 'Projektstammdaten anlegen',
    kind: 'Prozessschritt',
    aliases: ['2.1', 'QG-01-03'],
    context: 'Definition · Project Manager · SB1 laut Schulungsmatrix',
    relatedIds: [],
    evidence: [
      {
        sourceId: 'T',
        locator: 'Release1-Matrix!A5:Q5',
        sourceKey: '2.1',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'step-2-2',
    title: 'Projektumfang festlegen',
    kind: 'Prozessschritt',
    aliases: ['2.2', 'QG-01-03', 'QG-01-04'],
    context: 'Definition · Project Manager · SB1 laut Schulungsmatrix',
    relatedIds: [],
    evidence: [
      {
        sourceId: 'T',
        locator: 'Release1-Matrix!A6:Q6',
        sourceKey: '2.2',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'step-2-3',
    title: 'Projektziele festlegen',
    kind: 'Prozessschritt',
    aliases: ['2.3'],
    context: 'Definition · Project Manager · SB1 laut Schulungsmatrix',
    relatedIds: [],
    evidence: [
      {
        sourceId: 'T',
        locator: 'Release1-Matrix!A7:Q7',
        sourceKey: '2.3',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'step-2-4',
    title: 'Projektorganisation festlegen',
    kind: 'Prozessschritt',
    aliases: ['2.4', 'QG-01-07'],
    context: 'Definition · Project Manager · SB1 laut Schulungsmatrix',
    relatedIds: [],
    evidence: [
      {
        sourceId: 'T',
        locator: 'Release1-Matrix!A8:Q8',
        sourceKey: '2.4',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'step-2-5',
    title: 'Vertragsdaten einpflegen',
    kind: 'Prozessschritt',
    aliases: ['2.5', 'QG-01-03'],
    context: 'Definition · Project Manager · SB1 laut Schulungsmatrix',
    relatedIds: [],
    evidence: [
      {
        sourceId: 'T',
        locator: 'Release1-Matrix!A9:Q9',
        sourceKey: '2.5',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'step-2-6',
    title: 'Teilprojektleiter einsetzen',
    kind: 'Prozessschritt',
    aliases: ['2.6'],
    context: 'Definition · Project Manager · SB1 laut Schulungsmatrix',
    relatedIds: [],
    evidence: [
      {
        sourceId: 'T',
        locator: 'Release1-Matrix!A10:Q10',
        sourceKey: '2.6',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'step-2-7',
    title: 'Zugriffsrechte festlegen',
    kind: 'Prozessschritt',
    aliases: ['2.7', 'QG-01-08'],
    context: 'Definition · Project Manager · SB1 laut Schulungsmatrix',
    relatedIds: [],
    evidence: [
      {
        sourceId: 'T',
        locator: 'Release1-Matrix!A11:Q11',
        sourceKey: '2.7',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'step-2-8',
    title: 'Stammdaten für System-TP anlegen',
    kind: 'Prozessschritt',
    aliases: ['2.8'],
    context: 'Definition · Technical Manager · SB1 laut Schulungsmatrix',
    relatedIds: [],
    evidence: [
      {
        sourceId: 'T',
        locator: 'Release1-Matrix!A12:Q12',
        sourceKey: '2.8',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'step-2-9',
    title: 'Projektumfang für System-TP festlegen',
    kind: 'Prozessschritt',
    aliases: ['2.9'],
    context: 'Definition · Technical Manager · SB1 laut Schulungsmatrix',
    relatedIds: [],
    evidence: [
      {
        sourceId: 'T',
        locator: 'Release1-Matrix!A13:Q13',
        sourceKey: '2.9',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'step-2-10',
    title: 'Projektorganisation für System-TP festlegen',
    kind: 'Prozessschritt',
    aliases: ['2.10'],
    context: 'Definition · Technical Manager · SB1 laut Schulungsmatrix',
    relatedIds: [],
    evidence: [
      {
        sourceId: 'T',
        locator: 'Release1-Matrix!A14:Q14',
        sourceKey: '2.10',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'step-2-11',
    title: 'Zugriffsrechte für System-TP festlegen',
    kind: 'Prozessschritt',
    aliases: ['2.11'],
    context: 'Definition · Technical Manager · SB1 laut Schulungsmatrix',
    relatedIds: [],
    evidence: [
      {
        sourceId: 'T',
        locator: 'Release1-Matrix!A15:Q15',
        sourceKey: '2.11',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'step-2-12',
    title: 'Stammdaten für ILS-TP anlegen',
    kind: 'Prozessschritt',
    aliases: ['2.12'],
    context: 'Definition · ILS Manager · SB1 laut Schulungsmatrix',
    relatedIds: [],
    evidence: [
      {
        sourceId: 'T',
        locator: 'Release1-Matrix!A16:Q16',
        sourceKey: '2.12',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'step-2-13',
    title: 'Projektumfang für ILS-TP festlegen',
    kind: 'Prozessschritt',
    aliases: ['2.13'],
    context: 'Definition · ILS Manager · SB1 laut Schulungsmatrix',
    relatedIds: [],
    evidence: [
      {
        sourceId: 'T',
        locator: 'Release1-Matrix!A17:Q17',
        sourceKey: '2.13',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'step-2-14',
    title: 'Projektorganisation für ILS-TP festlegen',
    kind: 'Prozessschritt',
    aliases: ['2.14'],
    context: 'Definition · ILS Manager · SB1 laut Schulungsmatrix',
    relatedIds: [],
    evidence: [
      {
        sourceId: 'T',
        locator: 'Release1-Matrix!A18:Q18',
        sourceKey: '2.14',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'step-2-15',
    title: 'Zugriffsrechte für ILS-TP festlegen',
    kind: 'Prozessschritt',
    aliases: ['2.15'],
    context: 'Definition · ILS Manager · SB1 laut Schulungsmatrix',
    relatedIds: [],
    evidence: [
      {
        sourceId: 'T',
        locator: 'Release1-Matrix!A19:Q19',
        sourceKey: '2.15',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'step-3-1',
    title: 'Liefermeilensteine planen',
    kind: 'Prozessschritt',
    aliases: ['3.1', 'QG-02-04'],
    context: 'Planung · Project Manager · SB1 laut Schulungsmatrix',
    relatedIds: [],
    evidence: [
      {
        sourceId: 'T',
        locator: 'Release1-Matrix!A20:Q20',
        sourceKey: '3.1',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'step-3-2',
    title: 'Zahlungsmeilensteine planen',
    kind: 'Prozessschritt',
    aliases: ['3.2', 'QG-02-04'],
    context: 'Planung · Project Manager · SB1 laut Schulungsmatrix',
    relatedIds: [],
    evidence: [
      {
        sourceId: 'T',
        locator: 'Release1-Matrix!A21:Q21',
        sourceKey: '3.2',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'step-3-3',
    title: 'Weitere Projektmeilensteine planen',
    kind: 'Prozessschritt',
    aliases: ['3.3', 'QG-02-04'],
    context: 'Planung · Project Manager · SB1 laut Schulungsmatrix',
    relatedIds: [],
    evidence: [
      {
        sourceId: 'T',
        locator: 'Release1-Matrix!A22:Q22',
        sourceKey: '3.3',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'step-3-4',
    title: 'Projektphasen und LCM Review-Termine planen',
    kind: 'Prozessschritt',
    aliases: ['3.4', 'QG-02-05'],
    context: 'Planung · Project Manager · SB1 laut Schulungsmatrix',
    relatedIds: [],
    evidence: [
      {
        sourceId: 'T',
        locator: 'Release1-Matrix!A23:Q23',
        sourceKey: '3.4',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'step-3-5',
    title: 'PM-Arbeitspakete definieren',
    kind: 'Prozessschritt',
    aliases: ['3.5'],
    context: 'Planung · Project Manager · SB2 laut Schulungsmatrix',
    relatedIds: [],
    evidence: [
      {
        sourceId: 'T',
        locator: 'Release1-Matrix!A24:Q24',
        sourceKey: '3.5',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'step-3-6',
    title: 'Abläufe für PM-Teilaufgabe planen',
    kind: 'Prozessschritt',
    aliases: ['3.6'],
    context: 'Planung · Project Manager · SB2 laut Schulungsmatrix',
    relatedIds: [],
    evidence: [
      {
        sourceId: 'T',
        locator: 'Release1-Matrix!A25:Q25',
        sourceKey: '3.6',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'step-3-7',
    title: 'Termine für die PM-Teilaufgabe planen',
    kind: 'Prozessschritt',
    aliases: ['3.7'],
    context: 'Planung · Project Manager · SB2 laut Schulungsmatrix',
    relatedIds: [],
    evidence: [
      {
        sourceId: 'T',
        locator: 'Release1-Matrix!A26:Q26',
        sourceKey: '3.7',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'step-3-8',
    title: 'Teilprojektphasen und -meilensteine der TP übernehmen',
    kind: 'Prozessschritt',
    aliases: ['3.8'],
    context: 'Planung · Project Manager · SB2 laut Schulungsmatrix',
    relatedIds: [],
    evidence: [
      {
        sourceId: 'T',
        locator: 'Release1-Matrix!A27:Q27',
        sourceKey: '3.8',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'step-3-9',
    title: 'Teilprojekte gegen Zieltermine verlinken',
    kind: 'Prozessschritt',
    aliases: ['3.9'],
    context: 'Planung · Project Manager · SB2 laut Schulungsmatrix',
    relatedIds: [],
    evidence: [
      {
        sourceId: 'T',
        locator: 'Release1-Matrix!A28:Q28',
        sourceKey: '3.9',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'step-3-10',
    title: 'Zieltermine des Projekts für System-TP übernehmen',
    kind: 'Prozessschritt',
    aliases: ['3.10'],
    context: 'Planung · Technical Manager · SB2 laut Schulungsmatrix',
    relatedIds: [],
    evidence: [
      {
        sourceId: 'T',
        locator: 'Release1-Matrix!A29:Q29',
        sourceKey: '3.10',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'step-3-11',
    title: 'Teilprojektphasen und Techn. Review-Termine planen',
    kind: 'Prozessschritt',
    aliases: ['3.11'],
    context: 'Planung · Technical Manager · SB2 laut Schulungsmatrix',
    relatedIds: [],
    evidence: [
      {
        sourceId: 'T',
        locator: 'Release1-Matrix!A30:Q30',
        sourceKey: '3.11',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'step-3-12',
    title: 'Projektstrukturplan des System-TP anlegen',
    kind: 'Prozessschritt',
    aliases: ['3.12'],
    context: 'Planung · Technical Manager · SB2 laut Schulungsmatrix',
    relatedIds: [],
    evidence: [
      {
        sourceId: 'T',
        locator: 'Release1-Matrix!A31:Q31',
        sourceKey: '3.12',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'step-3-13',
    title: 'SE-Arbeitspakete definieren',
    kind: 'Prozessschritt',
    aliases: ['3.13'],
    context: 'Planung · Technical Manager · SB2 laut Schulungsmatrix',
    relatedIds: [],
    evidence: [
      {
        sourceId: 'T',
        locator: 'Release1-Matrix!A32:Q32',
        sourceKey: '3.13',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'step-3-14',
    title: 'Abläufe für System-TP planen',
    kind: 'Prozessschritt',
    aliases: ['3.14'],
    context: 'Planung · Technical Manager · SB2 laut Schulungsmatrix',
    relatedIds: [],
    evidence: [
      {
        sourceId: 'T',
        locator: 'Release1-Matrix!A33:Q33',
        sourceKey: '3.14',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'step-3-15',
    title: 'Termine für System-TP planen',
    kind: 'Prozessschritt',
    aliases: ['3.15'],
    context: 'Planung · Technical Manager · SB2 laut Schulungsmatrix',
    relatedIds: [],
    evidence: [
      {
        sourceId: 'T',
        locator: 'Release1-Matrix!A34:Q34',
        sourceKey: '3.15',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'step-3-16',
    title: 'Zieltermine des Projekts für ILS-TP übernehmen',
    kind: 'Prozessschritt',
    aliases: ['3.16'],
    context: 'Planung · ILS Manager · SB2 laut Schulungsmatrix',
    relatedIds: [],
    evidence: [
      {
        sourceId: 'T',
        locator: 'Release1-Matrix!A35:Q35',
        sourceKey: '3.16',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'step-3-17',
    title: 'Zuliefertermine System-TP für ILS-TP übernehmen',
    kind: 'Prozessschritt',
    aliases: ['3.17'],
    context: 'Planung · ILS Manager · SB2 laut Schulungsmatrix',
    relatedIds: [],
    evidence: [
      {
        sourceId: 'T',
        locator: 'Release1-Matrix!A36:Q36',
        sourceKey: '3.17',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'step-3-18',
    title: 'Teilprojektphasen und ILS Review-Termine planen',
    kind: 'Prozessschritt',
    aliases: ['3.18'],
    context: 'Planung · ILS Manager · SB2 laut Schulungsmatrix',
    relatedIds: [],
    evidence: [
      {
        sourceId: 'T',
        locator: 'Release1-Matrix!A37:Q37',
        sourceKey: '3.18',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'step-3-19',
    title: 'ILS-Arbeitspakete definieren',
    kind: 'Prozessschritt',
    aliases: ['3.19'],
    context: 'Planung · ILS Manager · SB2 laut Schulungsmatrix',
    relatedIds: [],
    evidence: [
      {
        sourceId: 'T',
        locator: 'Release1-Matrix!A38:Q38',
        sourceKey: '3.19',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'step-3-20',
    title: 'Abläufe für ILS-TP planen',
    kind: 'Prozessschritt',
    aliases: ['3.20'],
    context: 'Planung · ILS Manager · SB2 laut Schulungsmatrix',
    relatedIds: [],
    evidence: [
      {
        sourceId: 'T',
        locator: 'Release1-Matrix!A39:Q39',
        sourceKey: '3.20',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'step-3-21',
    title: 'Termine für ILS-TP planen',
    kind: 'Prozessschritt',
    aliases: ['3.21'],
    context: 'Planung · ILS Manager · SB2 laut Schulungsmatrix',
    relatedIds: [],
    evidence: [
      {
        sourceId: 'T',
        locator: 'Release1-Matrix!A40:Q40',
        sourceKey: '3.21',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'step-4-1',
    title: 'System-TP-Terminplangegen Zieltermine abgleichen',
    kind: 'Prozessschritt',
    aliases: ['4.1'],
    context: 'Steuerung · Technical Manager · SB2 laut Schulungsmatrix',
    relatedIds: [],
    evidence: [
      {
        sourceId: 'T',
        locator: 'Release1-Matrix!A41:Q41',
        sourceKey: '4.1',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'step-4-2',
    title: 'ILS-TP-Terminplan gegen Zieltermine abgleichen',
    kind: 'Prozessschritt',
    aliases: ['4.2'],
    context: 'Steuerung · ILS Manager · SB2 laut Schulungsmatrix',
    relatedIds: [],
    evidence: [
      {
        sourceId: 'T',
        locator: 'Release1-Matrix!A42:Q42',
        sourceKey: '4.2',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'step-4-3',
    title: 'Eskalation von System-TP an Projekt durchführen',
    kind: 'Prozessschritt',
    aliases: ['4.3'],
    context: 'Steuerung · Technical Manager · SB2 laut Schulungsmatrix',
    relatedIds: [],
    evidence: [
      {
        sourceId: 'T',
        locator: 'Release1-Matrix!A43:Q43',
        sourceKey: '4.3',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'step-4-4',
    title: 'Eskalation von ILS-TP an Projekt durchführen',
    kind: 'Prozessschritt',
    aliases: ['4.4'],
    context: 'Steuerung · ILS Manager · SB2 laut Schulungsmatrix',
    relatedIds: [],
    evidence: [
      {
        sourceId: 'T',
        locator: 'Release1-Matrix!A44:Q44',
        sourceKey: '4.4',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'step-4-5',
    title: 'Projektterminplan gegen Zieltermine abgleichen',
    kind: 'Prozessschritt',
    aliases: ['4.5'],
    context: 'Steuerung · Project Manager · SB2 laut Schulungsmatrix',
    relatedIds: [],
    evidence: [
      {
        sourceId: 'T',
        locator: 'Release1-Matrix!A45:Q45',
        sourceKey: '4.5',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'step-4-6',
    title: 'Projektstatus für System-TP ermitteln',
    kind: 'Prozessschritt',
    aliases: ['4.6'],
    context: 'Steuerung · Technical Manager · SB2 laut Schulungsmatrix',
    relatedIds: [],
    evidence: [
      {
        sourceId: 'T',
        locator: 'Release1-Matrix!A46:Q46',
        sourceKey: '4.6',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'step-4-7',
    title: 'Eskalation aus Teilprojekt bearbeiten',
    kind: 'Prozessschritt',
    aliases: ['4.7'],
    context: 'Steuerung · Project Manager · SB2 laut Schulungsmatrix',
    relatedIds: [],
    evidence: [
      {
        sourceId: 'T',
        locator: 'Release1-Matrix!A47:Q47',
        sourceKey: '4.7',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'step-4-8',
    title: 'Projektstatus für ILS-TP ermitteln',
    kind: 'Prozessschritt',
    aliases: ['4.8'],
    context: 'Steuerung · ILS Manager · SB2 laut Schulungsmatrix',
    relatedIds: [],
    evidence: [
      {
        sourceId: 'T',
        locator: 'Release1-Matrix!A48:Q48',
        sourceKey: '4.8',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'step-4-9',
    title: 'Eskalation an Multi-Projektmanagement durchführen',
    kind: 'Prozessschritt',
    aliases: ['4.9'],
    context: 'Steuerung · Project Manager · SB1 laut Schulungsmatrix',
    relatedIds: [],
    evidence: [
      {
        sourceId: 'T',
        locator: 'Release1-Matrix!A49:Q49',
        sourceKey: '4.9',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'step-4-10',
    title: 'Projektreporting für System-TP durchführen',
    kind: 'Prozessschritt',
    aliases: ['4.10'],
    context: 'Steuerung · Technical Manager · SB2 laut Schulungsmatrix',
    relatedIds: [],
    evidence: [
      {
        sourceId: 'T',
        locator: 'Release1-Matrix!A50:Q50',
        sourceKey: '4.10',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'step-4-11',
    title: 'Projektreporting für ILS-TP durchführen',
    kind: 'Prozessschritt',
    aliases: ['4.11'],
    context: 'Steuerung · ILS Manager · SB2 laut Schulungsmatrix',
    relatedIds: [],
    evidence: [
      {
        sourceId: 'T',
        locator: 'Release1-Matrix!A51:Q51',
        sourceKey: '4.11',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'step-4-12',
    title: 'Projektstatus ermitteln',
    kind: 'Prozessschritt',
    aliases: ['4.12'],
    context: 'Steuerung · Project Manager · SB1 laut Schulungsmatrix',
    relatedIds: [],
    evidence: [
      {
        sourceId: 'T',
        locator: 'Release1-Matrix!A52:Q52',
        sourceKey: '4.12',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'step-4-13',
    title: 'Projektreporting durchführen',
    kind: 'Prozessschritt',
    aliases: ['4.13'],
    context: 'Steuerung · Project Manager · SB1 laut Schulungsmatrix',
    relatedIds: [],
    evidence: [
      {
        sourceId: 'T',
        locator: 'Release1-Matrix!A53:Q53',
        sourceKey: '4.13',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'step-5-1',
    title: 'Projekt abschließen',
    kind: 'Prozessschritt',
    aliases: ['5.1'],
    context: 'Abschluss · Release-Zuordnung ungeklärt; keine offizielle R1-/R1B-Scope-ID.',
    relatedIds: ['FS-28'],
    evidence: [
      {
        sourceId: 'P',
        locator: 'Seite 1 · Phase 5: Abschluss · 5.1 Projekt abschließen',
        sourceKey: '5.1',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'R1-01',
    title: 'Enterprise Custom Fields und LookUp Tables',
    kind: 'Scope',
    aliases: [],
    context: 'R1 · Umfang laut Scope-Katalog; Umsetzung und Freigabe dadurch nicht belegt.',
    relatedIds: ['CAP-01'],
    evidence: [
      {
        sourceId: 'S',
        locator: '02_SCOPE_ID_MASTER!A2:L2',
        sourceKey: 'R1-01',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'R1-02',
    title: 'Service UHD - Projektanlage',
    kind: 'Scope',
    aliases: [],
    context: 'R1 · Umfang laut Scope-Katalog; Umsetzung und Freigabe dadurch nicht belegt.',
    relatedIds: ['CAP-01'],
    evidence: [
      {
        sourceId: 'S',
        locator: '02_SCOPE_ID_MASTER!A3:L3',
        sourceKey: 'R1-02',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'R1-03',
    title:
      'Project Detail Pages / Project Sites: Overview, Scope, Objectives, Organization sowie System-/ILS- Teilprojektinformationen',
    kind: 'Scope',
    aliases: [],
    context: 'R1 · Umfang laut Scope-Katalog; Umsetzung und Freigabe dadurch nicht belegt.',
    relatedIds: ['CAP-02'],
    evidence: [
      {
        sourceId: 'S',
        locator: '02_SCOPE_ID_MASTER!A4:L4',
        sourceKey: 'R1-03',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'R1-04',
    title: 'Project Center - Portfoliosichten (Programme und Projekte)',
    kind: 'Scope',
    aliases: [],
    context: 'R1 · Umfang laut Scope-Katalog; Umsetzung und Freigabe dadurch nicht belegt.',
    relatedIds: ['CAP-08'],
    evidence: [
      {
        sourceId: 'S',
        locator: '02_SCOPE_ID_MASTER!A5:L5',
        sourceKey: 'R1-04',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'R1-05',
    title: 'Project Center - Portfolios inkl. Statusicht (Projektfortschritt)',
    kind: 'Scope',
    aliases: [],
    context: 'R1 · Umfang laut Scope-Katalog; Umsetzung und Freigabe dadurch nicht belegt.',
    relatedIds: ['CAP-08'],
    evidence: [
      {
        sourceId: 'S',
        locator: '02_SCOPE_ID_MASTER!A6:L6',
        sourceKey: 'R1-05',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'R1-06',
    title: 'Einzelberechtigungen (Project Permissions)',
    kind: 'Scope',
    aliases: [],
    context: 'R1 · Umfang laut Scope-Katalog; Umsetzung und Freigabe dadurch nicht belegt.',
    relatedIds: ['CAP-03'],
    evidence: [
      {
        sourceId: 'S',
        locator: '02_SCOPE_ID_MASTER!A7:L7',
        sourceKey: 'R1-06',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'R1-07',
    title: 'Projektkernteam mit Projekt- und Prozessrolle in PDP hinterlegt',
    kind: 'Scope',
    aliases: [],
    context: 'R1 · Umfang laut Scope-Katalog; Umsetzung und Freigabe dadurch nicht belegt.',
    relatedIds: ['CAP-03'],
    evidence: [
      {
        sourceId: 'S',
        locator: '02_SCOPE_ID_MASTER!A8:L8',
        sourceKey: 'R1-07',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'R1-08',
    title:
      'Liefermeilensteine, Zahlungsmeilensteine sowie Externe Projektmeilensteine und LCM-Reviews planen im MS Project Client',
    kind: 'Scope',
    aliases: [],
    context: 'R1 · Umfang laut Scope-Katalog; Umsetzung und Freigabe dadurch nicht belegt.',
    relatedIds: ['CAP-04'],
    evidence: [
      {
        sourceId: 'S',
        locator: '02_SCOPE_ID_MASTER!A9:L9',
        sourceKey: 'R1-08',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'R1-09',
    title: 'Zeitachse auf PWA (Schedule) und MS Project Client',
    kind: 'Scope',
    aliases: [],
    context: 'R1 · Umfang laut Scope-Katalog; Umsetzung und Freigabe dadurch nicht belegt.',
    relatedIds: ['CAP-04'],
    evidence: [
      {
        sourceId: 'S',
        locator: '02_SCOPE_ID_MASTER!A10:L10',
        sourceKey: 'R1-09',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'R1-10',
    title: 'Ansicht 10 Phasen- und Meilensteinplan im MS Project Client',
    kind: 'Scope',
    aliases: [],
    context: 'R1 · Umfang laut Scope-Katalog; Umsetzung und Freigabe dadurch nicht belegt.',
    relatedIds: ['CAP-04'],
    evidence: [
      {
        sourceId: 'S',
        locator: '02_SCOPE_ID_MASTER!A11:L11',
        sourceKey: 'R1-10',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'R1-11',
    title: 'Ansicht 11 Review Status im MS Project Client',
    kind: 'Scope',
    aliases: [],
    context: 'R1 · Umfang laut Scope-Katalog; Umsetzung und Freigabe dadurch nicht belegt.',
    relatedIds: ['CAP-04'],
    evidence: [
      {
        sourceId: 'S',
        locator: '02_SCOPE_ID_MASTER!A12:L12',
        sourceKey: 'R1-11',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'R1-12',
    title:
      'Generischer Projektplan für Kundenprojekt, Generischer Projektplan für System-Teilprojekt, Generischer Projektplan für ILS-Teilprojekt',
    kind: 'Scope',
    aliases: [],
    context: 'R1 · Umfang laut Scope-Katalog; Umsetzung und Freigabe dadurch nicht belegt.',
    relatedIds: ['CAP-05'],
    evidence: [
      {
        sourceId: 'S',
        locator: '02_SCOPE_ID_MASTER!A13:L13',
        sourceKey: 'R1-12',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'R1-13',
    title:
      'Teilprojektstruktur als Level 2 Projekte bzw. bei Bedarf Level 3 Projekte als Segment-Teilprojekte unter dem System-Projekt',
    kind: 'Scope',
    aliases: [],
    context: 'R1 · Umfang laut Scope-Katalog; Umsetzung und Freigabe dadurch nicht belegt.',
    relatedIds: ['CAP-05'],
    evidence: [
      {
        sourceId: 'S',
        locator: '02_SCOPE_ID_MASTER!A14:L14',
        sourceKey: 'R1-13',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'R1-14',
    title: 'Ansicht 20 Projektstrukturplan (PSP)',
    kind: 'Scope',
    aliases: [],
    context: 'R1 · Umfang laut Scope-Katalog; Umsetzung und Freigabe dadurch nicht belegt.',
    relatedIds: ['CAP-05'],
    evidence: [
      {
        sourceId: 'S',
        locator: '02_SCOPE_ID_MASTER!A15:L15',
        sourceKey: 'R1-14',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'R1-15',
    title: 'Tailoring über Deaktivieren und dokumentieren',
    kind: 'Scope',
    aliases: [],
    context: 'R1 · Umfang laut Scope-Katalog; Umsetzung und Freigabe dadurch nicht belegt.',
    relatedIds: ['CAP-05'],
    evidence: [
      {
        sourceId: 'S',
        locator: '02_SCOPE_ID_MASTER!A16:L16',
        sourceKey: 'R1-15',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'R1-16',
    title: 'Multi Level Scheduling und Verknüpfung über TPG Project Link Roll Ups/Roll Downs',
    kind: 'Scope',
    aliases: [],
    context: 'R1 · Umfang laut Scope-Katalog; Umsetzung und Freigabe dadurch nicht belegt.',
    relatedIds: ['CAP-06'],
    evidence: [
      {
        sourceId: 'S',
        locator: '02_SCOPE_ID_MASTER!A17:L17',
        sourceKey: 'R1-16',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'R1-17',
    title: 'Ansicht 30 Ablauf- und Terminplan',
    kind: 'Scope',
    aliases: [],
    context: 'R1 · Umfang laut Scope-Katalog; Umsetzung und Freigabe dadurch nicht belegt.',
    relatedIds: ['CAP-06'],
    evidence: [
      {
        sourceId: 'S',
        locator: '02_SCOPE_ID_MASTER!A18:L18',
        sourceKey: 'R1-17',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'R1-18',
    title: 'WBS Generator',
    kind: 'Scope',
    aliases: [],
    context: 'R1 · Umfang laut Scope-Katalog; Umsetzung und Freigabe dadurch nicht belegt.',
    relatedIds: ['CAP-05'],
    evidence: [
      {
        sourceId: 'S',
        locator: '02_SCOPE_ID_MASTER!A19:L19',
        sourceKey: 'R1-18',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'R1-19',
    title:
      'Pop-Up Selection Window: Beim Öffnen des Zielprojekts (L0/L1/L2) kommt eine Meldung mit allen Terminänderungen, welche akzeptiert werden können.',
    kind: 'Scope',
    aliases: [],
    context: 'R1 · Umfang laut Scope-Katalog; Umsetzung und Freigabe dadurch nicht belegt.',
    relatedIds: ['CAP-06'],
    evidence: [
      {
        sourceId: 'S',
        locator: '02_SCOPE_ID_MASTER!A20:L20',
        sourceKey: 'R1-19',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'R1-20',
    title: 'Standard-Arbeitspaketbeschreibungen in generischen Projektplänen',
    kind: 'Scope',
    aliases: [],
    context: 'R1 · Umfang laut Scope-Katalog; Umsetzung und Freigabe dadurch nicht belegt.',
    relatedIds: ['CAP-05'],
    evidence: [
      {
        sourceId: 'S',
        locator: '02_SCOPE_ID_MASTER!A21:L21',
        sourceKey: 'R1-20',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'R1-21',
    title: 'Änderungen Leistungen und Termine in Project Plan',
    kind: 'Scope',
    aliases: [],
    context: 'R1 · Umfang laut Scope-Katalog; Umsetzung und Freigabe dadurch nicht belegt.',
    relatedIds: ['CAP-07'],
    evidence: [
      {
        sourceId: 'S',
        locator: '02_SCOPE_ID_MASTER!A22:L22',
        sourceKey: 'R1-21',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'R1-22',
    title: 'Enterprise Project Types für Contract Execution, System Delivery und ILS Delivery',
    kind: 'Scope',
    aliases: [],
    context: 'R1 · Umfang laut Scope-Katalog; Umsetzung und Freigabe dadurch nicht belegt.',
    relatedIds: ['CAP-01'],
    evidence: [
      {
        sourceId: 'S',
        locator: '02_SCOPE_ID_MASTER!A23:L23',
        sourceKey: 'R1-22',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'R1-23',
    title: 'Rollenprofile + Berechtigungskonzept',
    kind: 'Scope',
    aliases: [],
    context: 'R1 · Umfang laut Scope-Katalog; Umsetzung und Freigabe dadurch nicht belegt.',
    relatedIds: ['CAP-03'],
    evidence: [
      {
        sourceId: 'S',
        locator: '02_SCOPE_ID_MASTER!A24:L24',
        sourceKey: 'R1-23',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'R1-24',
    title: 'PDP Escalations',
    kind: 'Scope',
    aliases: [],
    context: 'R1 · Umfang laut Scope-Katalog; Umsetzung und Freigabe dadurch nicht belegt.',
    relatedIds: ['CAP-08'],
    evidence: [
      {
        sourceId: 'S',
        locator: '02_SCOPE_ID_MASTER!A25:L25',
        sourceKey: 'R1-24',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'R1-25',
    title: 'PDP Status',
    kind: 'Scope',
    aliases: [],
    context: 'R1 · Umfang laut Scope-Katalog; Umsetzung und Freigabe dadurch nicht belegt.',
    relatedIds: ['CAP-08'],
    evidence: [
      {
        sourceId: 'S',
        locator: '02_SCOPE_ID_MASTER!A26:L26',
        sourceKey: 'R1-25',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'R1B-01',
    title: 'Anbindung Extension Datenbank',
    kind: 'Scope',
    aliases: [],
    context: 'R1B · Umfang laut Scope-Katalog; Umsetzung und Freigabe dadurch nicht belegt.',
    relatedIds: ['CAP-08'],
    evidence: [
      {
        sourceId: 'S',
        locator: '02_SCOPE_ID_MASTER!A27:L27',
        sourceKey: 'R1B-01',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'R1B-02',
    title: 'Projekt Reporting PDP - Anbindung Power BI',
    kind: 'Scope',
    aliases: [],
    context: 'R1B · Umfang laut Scope-Katalog; Umsetzung und Freigabe dadurch nicht belegt.',
    relatedIds: ['CAP-08'],
    evidence: [
      {
        sourceId: 'S',
        locator: '02_SCOPE_ID_MASTER!A28:L28',
        sourceKey: 'R1B-02',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'R1B-03',
    title: 'Power BI - Project Reporting',
    kind: 'Scope',
    aliases: [],
    context: 'R1B · Umfang laut Scope-Katalog; Umsetzung und Freigabe dadurch nicht belegt.',
    relatedIds: ['CAP-08'],
    evidence: [
      {
        sourceId: 'S',
        locator: '02_SCOPE_ID_MASTER!A29:L29',
        sourceKey: 'R1B-03',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'R1B-04',
    title: 'Power BI - Project Portfolio Reporting',
    kind: 'Scope',
    aliases: [],
    context: 'R1B · Umfang laut Scope-Katalog; Umsetzung und Freigabe dadurch nicht belegt.',
    relatedIds: ['CAP-08'],
    evidence: [
      {
        sourceId: 'S',
        locator: '02_SCOPE_ID_MASTER!A30:L30',
        sourceKey: 'R1B-04',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'R1B-05',
    title: 'Zentrale Ablage für Projekte + Einheitliche Ablagestruktur über die Project Site',
    kind: 'Scope',
    aliases: [],
    context: 'R1B · Umfang laut Scope-Katalog; Umsetzung und Freigabe dadurch nicht belegt.',
    relatedIds: ['CAP-02'],
    evidence: [
      {
        sourceId: 'S',
        locator: '02_SCOPE_ID_MASTER!A31:L31',
        sourceKey: 'R1B-05',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'R1B-06',
    title: 'AddIn MTA',
    kind: 'Scope',
    aliases: [],
    context: 'R1B · Umfang laut Scope-Katalog; Umsetzung und Freigabe dadurch nicht belegt.',
    relatedIds: ['CAP-06'],
    evidence: [
      {
        sourceId: 'S',
        locator: '02_SCOPE_ID_MASTER!A32:L32',
        sourceKey: 'R1B-06',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'FS-01',
    title: 'ECF-/Lookup-gestützte Projektdefinition und Projektanlage',
    kind: 'Funktionsnachweis',
    aliases: [],
    context:
      'R1 · Quellenbewertung vom 18.09.2026; spätere Klärungen in verknüpften Beiträgen beachten.',
    relatedIds: ['R1-01'],
    evidence: [
      {
        sourceId: 'F',
        locator: 'R1 Funktionsmatrix!A5:J5',
        sourceKey: 'FS-01',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'FS-02',
    title: 'Formularbasierte Projektanfrage über Service UHD',
    kind: 'Funktionsnachweis',
    aliases: [],
    context:
      'R1 · Quellenbewertung vom 18.09.2026; spätere Klärungen in verknüpften Beiträgen beachten.',
    relatedIds: ['R1-02'],
    evidence: [
      {
        sourceId: 'F',
        locator: 'R1 Funktionsmatrix!A6:J6',
        sourceKey: 'FS-02',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'FS-03a',
    title: 'PDP-Grundpflege: Overview, Scope, Objectives, Contract und Organization',
    kind: 'Funktionsnachweis',
    aliases: [],
    context:
      'R1 · Quellenbewertung vom 18.09.2026; spätere Klärungen in verknüpften Beiträgen beachten.',
    relatedIds: ['R1-03'],
    evidence: [
      {
        sourceId: 'F',
        locator: 'R1 Funktionsmatrix!A7:J7',
        sourceKey: 'FS-03a',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'FS-03b',
    title: 'Project Site und eingebettete Listen',
    kind: 'Funktionsnachweis',
    aliases: [],
    context:
      'R1 · Quellenbewertung vom 18.09.2026; spätere Klärungen in verknüpften Beiträgen beachten.',
    relatedIds: ['R1-03'],
    evidence: [
      {
        sourceId: 'F',
        locator: 'R1 Funktionsmatrix!A8:J8',
        sourceKey: 'FS-03b',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'FS-04',
    title: 'Project Center – Portfolio-/Projektübersichten',
    kind: 'Funktionsnachweis',
    aliases: [],
    context:
      'R1 · Quellenbewertung vom 18.09.2026; spätere Klärungen in verknüpften Beiträgen beachten.',
    relatedIds: ['R1-04'],
    evidence: [
      {
        sourceId: 'F',
        locator: 'R1 Funktionsmatrix!A9:J9',
        sourceKey: 'FS-04',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'FS-05',
    title: 'Project Center – Statussicht/Projektfortschritt',
    kind: 'Funktionsnachweis',
    aliases: [],
    context:
      'R1 · Quellenbewertung vom 18.09.2026; spätere Klärungen in verknüpften Beiträgen beachten.',
    relatedIds: ['R1-05'],
    evidence: [
      {
        sourceId: 'F',
        locator: 'R1 Funktionsmatrix!A10:J10',
        sourceKey: 'FS-05',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'FS-06',
    title: 'Einzelberechtigungen über Project Permissions',
    kind: 'Funktionsnachweis',
    aliases: [],
    context:
      'R1 · Quellenbewertung vom 18.09.2026; spätere Klärungen in verknüpften Beiträgen beachten.',
    relatedIds: ['R1-06'],
    evidence: [
      {
        sourceId: 'F',
        locator: 'R1 Funktionsmatrix!A11:J11',
        sourceKey: 'FS-06',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'FS-07',
    title: 'Projektkernteam mit Projekt- und Prozessrollen in der PDP',
    kind: 'Funktionsnachweis',
    aliases: [],
    context:
      'R1 · Quellenbewertung vom 18.09.2026; spätere Klärungen in verknüpften Beiträgen beachten.',
    relatedIds: ['R1-07'],
    evidence: [
      {
        sourceId: 'F',
        locator: 'R1 Funktionsmatrix!A12:J12',
        sourceKey: 'FS-07',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'FS-08',
    title: 'Owner-Wechsel mit Erhalt benötigter Zugriffe',
    kind: 'Funktionsnachweis',
    aliases: [],
    context:
      'R1 · Quellenbewertung vom 18.09.2026; spätere Klärungen in verknüpften Beiträgen beachten.',
    relatedIds: ['R1-06', 'R1-07', 'R1-23'],
    evidence: [
      {
        sourceId: 'F',
        locator: 'R1 Funktionsmatrix!A13:J13',
        sourceKey: 'FS-08',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'FS-09',
    title: 'Liefer-, Zahlungs-, externe Meilensteine und LCM-/Technical-/ILS-Reviews',
    kind: 'Funktionsnachweis',
    aliases: [],
    context:
      'R1 · Quellenbewertung vom 18.09.2026; spätere Klärungen in verknüpften Beiträgen beachten.',
    relatedIds: ['R1-08'],
    evidence: [
      {
        sourceId: 'F',
        locator: 'R1 Funktionsmatrix!A14:J14',
        sourceKey: 'FS-09',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'FS-10',
    title: 'Zeitachse in PWA und MS Project Client',
    kind: 'Funktionsnachweis',
    aliases: [],
    context:
      'R1 · Quellenbewertung vom 18.09.2026; spätere Klärungen in verknüpften Beiträgen beachten.',
    relatedIds: ['R1-09'],
    evidence: [
      {
        sourceId: 'F',
        locator: 'R1 Funktionsmatrix!A15:J15',
        sourceKey: 'FS-10',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'FS-11',
    title: 'Ansicht 10 – Phasen- und Meilensteinplan',
    kind: 'Funktionsnachweis',
    aliases: [],
    context:
      'R1 · Quellenbewertung vom 18.09.2026; spätere Klärungen in verknüpften Beiträgen beachten.',
    relatedIds: ['R1-10'],
    evidence: [
      {
        sourceId: 'F',
        locator: 'R1 Funktionsmatrix!A16:J16',
        sourceKey: 'FS-11',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'FS-12',
    title: 'Ansicht 11 – Review Status',
    kind: 'Funktionsnachweis',
    aliases: [],
    context:
      'R1 · Quellenbewertung vom 18.09.2026; spätere Klärungen in verknüpften Beiträgen beachten.',
    relatedIds: ['R1-11'],
    evidence: [
      {
        sourceId: 'F',
        locator: 'R1 Funktionsmatrix!A17:J17',
        sourceKey: 'FS-12',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'FS-13',
    title: 'Generische Projektpläne für Kunden-, System- und ILS-Projekte',
    kind: 'Funktionsnachweis',
    aliases: [],
    context:
      'R1 · Quellenbewertung vom 18.09.2026; spätere Klärungen in verknüpften Beiträgen beachten.',
    relatedIds: ['R1-12'],
    evidence: [
      {
        sourceId: 'F',
        locator: 'R1 Funktionsmatrix!A18:J18',
        sourceKey: 'FS-13',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'FS-14',
    title: 'Projekt-/Teilprojektstruktur auf L1, L2 und optional L3',
    kind: 'Funktionsnachweis',
    aliases: [],
    context:
      'R1 · Quellenbewertung vom 18.09.2026; spätere Klärungen in verknüpften Beiträgen beachten.',
    relatedIds: ['R1-13'],
    evidence: [
      {
        sourceId: 'F',
        locator: 'R1 Funktionsmatrix!A19:J19',
        sourceKey: 'FS-14',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'FS-15',
    title: 'Ansicht 20 – Projektstrukturplan',
    kind: 'Funktionsnachweis',
    aliases: [],
    context:
      'R1 · Quellenbewertung vom 18.09.2026; spätere Klärungen in verknüpften Beiträgen beachten.',
    relatedIds: ['R1-14'],
    evidence: [
      {
        sourceId: 'F',
        locator: 'R1 Funktionsmatrix!A20:J20',
        sourceKey: 'FS-15',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'FS-16',
    title: 'Tailoring durch Begründen, Deaktivieren und Dokumentieren',
    kind: 'Funktionsnachweis',
    aliases: [],
    context:
      'R1 · Quellenbewertung vom 18.09.2026; spätere Klärungen in verknüpften Beiträgen beachten.',
    relatedIds: ['R1-15'],
    evidence: [
      {
        sourceId: 'F',
        locator: 'R1 Funktionsmatrix!A21:J21',
        sourceKey: 'FS-16',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'FS-17',
    title: 'Multi-Level-Scheduling mit ProjectLink: Roll-down, Roll-up und Soft Links',
    kind: 'Funktionsnachweis',
    aliases: [],
    context:
      'R1 · Quellenbewertung vom 18.09.2026; spätere Klärungen in verknüpften Beiträgen beachten.',
    relatedIds: ['R1-16'],
    evidence: [
      {
        sourceId: 'F',
        locator: 'R1 Funktionsmatrix!A22:J22',
        sourceKey: 'FS-17',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'FS-18',
    title: 'Ansicht 30 – Ablauf- und Terminplan',
    kind: 'Funktionsnachweis',
    aliases: [],
    context:
      'R1 · Quellenbewertung vom 18.09.2026; spätere Klärungen in verknüpften Beiträgen beachten.',
    relatedIds: ['R1-17'],
    evidence: [
      {
        sourceId: 'F',
        locator: 'R1 Funktionsmatrix!A23:J23',
        sourceKey: 'FS-18',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'FS-19',
    title: 'WBS-Generator aus SSO/SBS',
    kind: 'Funktionsnachweis',
    aliases: [],
    context:
      'R1 · Quellenbewertung vom 18.09.2026; spätere Klärungen in verknüpften Beiträgen beachten.',
    relatedIds: ['R1-18'],
    evidence: [
      {
        sourceId: 'F',
        locator: 'R1 Funktionsmatrix!A24:J24',
        sourceKey: 'FS-19',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'FS-20',
    title: 'Pop-up-Auswahl und Übernahme von Terminänderungen',
    kind: 'Funktionsnachweis',
    aliases: [],
    context:
      'R1 · Quellenbewertung vom 18.09.2026; spätere Klärungen in verknüpften Beiträgen beachten.',
    relatedIds: ['R1-19'],
    evidence: [
      {
        sourceId: 'F',
        locator: 'R1 Funktionsmatrix!A25:J25',
        sourceKey: 'FS-20',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'FS-21',
    title: 'Standard-Arbeitspaketbeschreibungen in generischen Plänen',
    kind: 'Funktionsnachweis',
    aliases: [],
    context:
      'R1 · Quellenbewertung vom 18.09.2026; spätere Klärungen in verknüpften Beiträgen beachten.',
    relatedIds: ['R1-20'],
    evidence: [
      {
        sourceId: 'F',
        locator: 'R1 Funktionsmatrix!A26:J26',
        sourceKey: 'FS-21',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'FS-22',
    title: 'Änderungsmanagement für Leistungen und Termine im Projektplan',
    kind: 'Funktionsnachweis',
    aliases: [],
    context:
      'R1 · Quellenbewertung vom 18.09.2026; spätere Klärungen in verknüpften Beiträgen beachten.',
    relatedIds: ['R1-21'],
    evidence: [
      {
        sourceId: 'F',
        locator: 'R1 Funktionsmatrix!A27:J27',
        sourceKey: 'FS-22',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'FS-23',
    title: 'EPTs und Basiskonfiguration für Contract Execution, System Delivery und ILS Delivery',
    kind: 'Funktionsnachweis',
    aliases: [],
    context:
      'R1 · Quellenbewertung vom 18.09.2026; spätere Klärungen in verknüpften Beiträgen beachten.',
    relatedIds: ['R1-22'],
    evidence: [
      {
        sourceId: 'F',
        locator: 'R1 Funktionsmatrix!A28:J28',
        sourceKey: 'FS-23',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'FS-24',
    title: 'Rollenprofile und Berechtigungskonzept',
    kind: 'Funktionsnachweis',
    aliases: [],
    context:
      'R1 · Quellenbewertung vom 18.09.2026; spätere Klärungen in verknüpften Beiträgen beachten.',
    relatedIds: ['R1-23'],
    evidence: [
      {
        sourceId: 'F',
        locator: 'R1 Funktionsmatrix!A29:J29',
        sourceKey: 'FS-24',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'FS-25',
    title: 'Eskalationen über PDP Escalations',
    kind: 'Funktionsnachweis',
    aliases: [],
    context:
      'R1 · Quellenbewertung vom 18.09.2026; spätere Klärungen in verknüpften Beiträgen beachten.',
    relatedIds: ['R1-24'],
    evidence: [
      {
        sourceId: 'F',
        locator: 'R1 Funktionsmatrix!A30:J30',
        sourceKey: 'FS-25',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'FS-26',
    title: 'Basis-Statusermittlung über PDP Status',
    kind: 'Funktionsnachweis',
    aliases: [],
    context:
      'R1 · Quellenbewertung vom 18.09.2026; spätere Klärungen in verknüpften Beiträgen beachten.',
    relatedIds: ['R1-25'],
    evidence: [
      {
        sourceId: 'F',
        locator: 'R1 Funktionsmatrix!A31:J31',
        sourceKey: 'FS-26',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'FS-27',
    title: 'Speichern, Einchecken und Publish als Übergang zwischen Bearbeitung und Austausch',
    kind: 'Funktionsnachweis',
    aliases: [],
    context:
      'R1 · Quellenbewertung vom 18.09.2026; spätere Klärungen in verknüpften Beiträgen beachten.',
    relatedIds: [],
    evidence: [
      {
        sourceId: 'F',
        locator: 'R1 Funktionsmatrix!A32:J32',
        sourceKey: 'FS-27',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'FS-28',
    title: 'Projektabschluss',
    kind: 'Funktionsnachweis',
    aliases: [],
    context:
      'später / ungeklärt · Quellenbewertung vom 18.09.2026; spätere Klärungen in verknüpften Beiträgen beachten.',
    relatedIds: [],
    evidence: [
      {
        sourceId: 'F',
        locator: 'R1 Funktionsmatrix!A33:J33',
        sourceKey: 'FS-28',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'FS-29',
    title: 'Einstufung und formale Freigabe der Informationsverarbeitung',
    kind: 'Funktionsnachweis',
    aliases: [],
    context:
      'später / ungeklärt · Quellenbewertung vom 18.09.2026; spätere Klärungen in verknüpften Beiträgen beachten.',
    relatedIds: [],
    evidence: [
      {
        sourceId: 'F',
        locator: 'R1 Funktionsmatrix!A34:J34',
        sourceKey: 'FS-29',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'R1B-FS-01',
    title: 'Anbindung der Extension-Datenbank',
    kind: 'Funktionsnachweis',
    aliases: [],
    context:
      'R1B · Quellenbewertung vom 18.09.2026; spätere Klärungen in verknüpften Beiträgen beachten.',
    relatedIds: ['R1B-01'],
    evidence: [
      {
        sourceId: 'F',
        locator: 'R1B Abgrenzung!A5:J5',
        sourceKey: 'R1B-FS-01',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'R1B-FS-02',
    title: 'Power-BI-Anbindung auf der Reporting-PDP',
    kind: 'Funktionsnachweis',
    aliases: [],
    context:
      'R1B · Quellenbewertung vom 18.09.2026; spätere Klärungen in verknüpften Beiträgen beachten.',
    relatedIds: ['R1B-02'],
    evidence: [
      {
        sourceId: 'F',
        locator: 'R1B Abgrenzung!A6:J6',
        sourceKey: 'R1B-FS-02',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'R1B-FS-03',
    title: 'Power BI – Project Reporting',
    kind: 'Funktionsnachweis',
    aliases: [],
    context:
      'R1B · Quellenbewertung vom 18.09.2026; spätere Klärungen in verknüpften Beiträgen beachten.',
    relatedIds: ['R1B-03'],
    evidence: [
      {
        sourceId: 'F',
        locator: 'R1B Abgrenzung!A7:J7',
        sourceKey: 'R1B-FS-03',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'R1B-FS-04',
    title: 'Power BI – Project Portfolio Reporting',
    kind: 'Funktionsnachweis',
    aliases: [],
    context:
      'R1B · Quellenbewertung vom 18.09.2026; spätere Klärungen in verknüpften Beiträgen beachten.',
    relatedIds: ['R1B-04'],
    evidence: [
      {
        sourceId: 'F',
        locator: 'R1B Abgrenzung!A8:J8',
        sourceKey: 'R1B-FS-04',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'R1B-FS-05',
    title: 'Zentrale, einheitlich strukturierte Projektdokumentation über Project Site',
    kind: 'Funktionsnachweis',
    aliases: [],
    context:
      'R1B · Quellenbewertung vom 18.09.2026; spätere Klärungen in verknüpften Beiträgen beachten.',
    relatedIds: ['R1B-05'],
    evidence: [
      {
        sourceId: 'F',
        locator: 'R1B Abgrenzung!A9:J9',
        sourceKey: 'R1B-FS-05',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'R1B-FS-06',
    title: 'Meilenstein-Trend-Analyse (MTA Add-in)',
    kind: 'Funktionsnachweis',
    aliases: [],
    context:
      'R1B · Quellenbewertung vom 18.09.2026; spätere Klärungen in verknüpften Beiträgen beachten.',
    relatedIds: ['R1B-06'],
    evidence: [
      {
        sourceId: 'F',
        locator: 'R1B Abgrenzung!A10:J10',
        sourceKey: 'R1B-FS-06',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'CAP-01',
    title: 'Projektbeantragung & -anlage',
    kind: 'Scope-Gruppe',
    aliases: [],
    context: 'Abgeleitete Gruppierung; keine zusätzliche offizielle Scope-ID.',
    relatedIds: ['R1-01', 'R1-02', 'R1-22'],
    evidence: [
      {
        sourceId: 'S',
        locator: '01_SCOPE_CAPABILITIES!A2:N2',
        sourceKey: 'CAP-01',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'CAP-02',
    title: 'Projektinformationen, Scope & Projektdokumentation',
    kind: 'Scope-Gruppe',
    aliases: [],
    context: 'Abgeleitete Gruppierung; keine zusätzliche offizielle Scope-ID.',
    relatedIds: ['R1-03', 'R1B-05'],
    evidence: [
      {
        sourceId: 'S',
        locator: '01_SCOPE_CAPABILITIES!A3:N3',
        sourceKey: 'CAP-02',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'CAP-03',
    title: 'Projektorganisation, Rollen & Berechtigungen',
    kind: 'Scope-Gruppe',
    aliases: [],
    context: 'Abgeleitete Gruppierung; keine zusätzliche offizielle Scope-ID.',
    relatedIds: ['R1-06', 'R1-07', 'R1-23'],
    evidence: [
      {
        sourceId: 'S',
        locator: '01_SCOPE_CAPABILITIES!A4:N4',
        sourceKey: 'CAP-03',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'CAP-04',
    title: 'Phasen-, Meilenstein- & Reviewplanung',
    kind: 'Scope-Gruppe',
    aliases: [],
    context: 'Abgeleitete Gruppierung; keine zusätzliche offizielle Scope-ID.',
    relatedIds: ['R1-08', 'R1-09', 'R1-10', 'R1-11'],
    evidence: [
      {
        sourceId: 'S',
        locator: '01_SCOPE_CAPABILITIES!A5:N5',
        sourceKey: 'CAP-04',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'CAP-05',
    title: 'Projektstruktur, Templates, Tailoring & Arbeitspakete',
    kind: 'Scope-Gruppe',
    aliases: [],
    context: 'Abgeleitete Gruppierung; keine zusätzliche offizielle Scope-ID.',
    relatedIds: ['R1-12', 'R1-13', 'R1-14', 'R1-15', 'R1-18', 'R1-20'],
    evidence: [
      {
        sourceId: 'S',
        locator: '01_SCOPE_CAPABILITIES!A6:N6',
        sourceKey: 'CAP-05',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'CAP-06',
    title: 'Multi-Level Scheduling, Terminplanung & MTA',
    kind: 'Scope-Gruppe',
    aliases: [],
    context: 'Abgeleitete Gruppierung; keine zusätzliche offizielle Scope-ID.',
    relatedIds: ['R1-16', 'R1-17', 'R1-19', 'R1B-06'],
    evidence: [
      {
        sourceId: 'S',
        locator: '01_SCOPE_CAPABILITIES!A7:N7',
        sourceKey: 'CAP-06',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'CAP-07',
    title: 'Änderungsmanagement für Leistungen & Termine',
    kind: 'Scope-Gruppe',
    aliases: [],
    context: 'Abgeleitete Gruppierung; keine zusätzliche offizielle Scope-ID.',
    relatedIds: ['R1-21'],
    evidence: [
      {
        sourceId: 'S',
        locator: '01_SCOPE_CAPABILITIES!A8:N8',
        sourceKey: 'CAP-07',
        derivation: 'direct',
      },
    ],
  },
  {
    id: 'CAP-08',
    title: 'Status, Reporting, Analytics & Eskalationsmanagement',
    kind: 'Scope-Gruppe',
    aliases: [],
    context: 'Abgeleitete Gruppierung; keine zusätzliche offizielle Scope-ID.',
    relatedIds: ['R1-04', 'R1-05', 'R1-24', 'R1-25', 'R1B-01', 'R1B-02', 'R1B-03', 'R1B-04'],
    evidence: [
      {
        sourceId: 'S',
        locator: '01_SCOPE_CAPABILITIES!A9:N9',
        sourceKey: 'CAP-08',
        derivation: 'direct',
      },
    ],
  },
];
