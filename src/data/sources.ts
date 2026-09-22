import type { EvidenceRef, SourceDocument } from './domain';

export const sources: SourceDocument[] = [
  {
    id: 'B',
    title: 'SB1-Handbuch',
    filename: 'sources/iPPM_HB_SB01-Projektdefinition und Phasen-Meilensteinplanung.docx',
    date: null,
    status: 'Aktueller vorgesehener Schulungsweg · Entwurf laut Auftrag',
    sha256: 'E4AED78DC586A4F60CC98B411F109D8E59295A78CE570BF23005C7247AFD7727',
  },
  {
    id: 'F',
    title: 'R1-Funktionsmatrix',
    filename: 'sources/iPPM_R1_Funktionsmatrix.xlsx',
    date: '2026-09-18',
    status: 'Quellenbewertung; TTT-Originalnachweise nicht separat geprüft',
    sha256: 'B68766FE1877A72A2E437F354ED7441C990C6D640E0A9185D77A22F04A35B0A4',
  },
  {
    id: 'K',
    title: 'Konfigurationshandbuch',
    filename: 'sources/ATLAS_iPPM_Zentrales_Konfigurationshandbuch.html',
    date: '2026-09-16',
    status: 'Konsolidierte Konfigurationsmomentaufnahme',
    sha256: '58B5383B70C9E565AD85058752819B16E7603A55DC98184A4F4A2036CC8D5688',
  },
  {
    id: 'S',
    title: 'Release-1-Scope',
    filename: 'sources/iPPM_Release1_Scope_Katalog_AI_READY.xlsx',
    date: null,
    status: 'Aktuelle Scope-Grundlage dieses Centers; kein Reifenachweis',
    sha256: 'E33A4CF88E48B201040BC93B82FFA5DCEEC0C9EEC5F0DFBF63665E8EEF908939',
  },
  {
    id: 'T',
    title: 'Schulungsmatrix SB1/SB2',
    filename: 'sources/iPPM_Schulungsblock1+2_Matrix.xlsx',
    date: null,
    status: 'Schulungszuordnung; abweichender Bedienweg gegenüber B erhalten',
    sha256: '1F6F3C23BDA042B67E9DB2BC88722EDBBA3C2591CA3F6AEA2A73FC9335C5A0DB',
  },
  {
    id: 'H',
    title: 'Ursprüngliche Gesamt-Releaseplanung',
    filename: 'sources/iPPM_Releaseplanung_V2.docx',
    date: null,
    status: 'Historischer strategischer Zielrahmen; keine aktuelle Freigabe',
    sha256: 'C64438D9F8AB772AFCF333D351887DE597144BF976B875AFF2DB56CB6846B18C',
  },
];

export const evidence = (
  sourceId: string,
  locator: string,
  sourceKey?: string,
  derivation: EvidenceRef['derivation'] = 'direct',
): EvidenceRef[] => [{ sourceId, locator, sourceKey, derivation }];
