import type { EvidenceRef, SourceDocument } from './domain';

export const sources: SourceDocument[] = [
  {
    id: 'P',
    title: 'Prozessdiagramm Projektabwicklung',
    filename: 'sources/iPPM_Prozess-Projektabwicklung.vsdx',
    date: null,
    status: 'Prozessübersicht; keine Bedien- oder Releasefreigabe',
    sha256: '0CCFA54F50770F5553944CA9B6CAFB4BCBA6CB1352E57B80AD34F1785F6833E8',
  },
  {
    id: 'N28',
    title: 'Gemeldete Erkenntnisse zu Project Purpose und WBS',
    filename: 'sources/Erkenntnisse_ProjectPurpose_WBS_2026-09-28.md',
    date: '2026-09-28',
    status:
      'Auftraggebermeldung; Datum ist Eingang, kein Durchführungs- oder Freigabedatum. Referenzierte Prüf- und Freigabeunterlagen liegen nicht vor.',
    sha256: 'F6B881EEF80A4B3A04F32883DBF6B1A8CE86E4511A61D3810659C1BBD128B5F5',
  },
  {
    id: 'R2P',
    title: 'Aktuelle Releaseplanung R1B / Release 2',
    filename: 'sources/iPPM_Releaseplanung_Release-2.docx',
    date: null,
    status:
      'Aktuelle Planungsquelle laut Nutzer, übernommen am 23.09.2026; kein Umsetzungs- oder Freigabenachweis',
    sha256: 'E3007A6697FA12681D007F5636BB79CFC361D9CE447D423E1EDEDB2C0BB1FED8',
  },
  {
    id: 'TTT',
    title: 'Abgestimmte TtT-Restpunkte',
    filename: 'sources/TtT_Restpunkte_abgestimmt_2026-09-23.xlsx',
    date: '2026-09-23',
    status: 'Datierte Abstimmung; benannte ältere Aussagen aktualisiert, keine pauschale Abnahme',
    sha256: 'F20FC9AA5DCF380FA4E0CDB7F5D1E301DB8C89620AFA62B345107160FF2CBC36',
  },
  {
    id: 'C23',
    title: 'Bestätigte Klärungen 23.09.2026',
    filename: 'sources/Klaerungen_2026-09-23.md',
    date: '2026-09-23',
    status: 'Datierte Abstimmung; benannte ältere Aussagen aktualisiert, keine pauschale Abnahme',
    sha256: 'B0A43BEBC4F414190DB98EB28576BC4B3DDBA888BCD31D19E1DECC478154751D',
  },

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
    status:
      'Konsolidierte Konfigurationsmomentaufnahme; SHA-256 am 23.09.2026 gegen unveränderten Repository-Blob korrigiert',
    sha256: '0C3A2170420C73F1F76A723797AE0D59B6230F27E6B7382DD1616CE90D7B3AB2',
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
