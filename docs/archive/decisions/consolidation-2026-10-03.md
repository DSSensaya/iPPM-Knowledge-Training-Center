# Konsolidierung vom 03.10.2026

Ausgangscommit: `72abafd4e3599ba6db2621d0b3ad4d8f32cc80ae`. Umsetzung auf `consolidate/content-first`. Dieser Bericht dokumentiert die einmalige Migration; aktuelle Architektur und Pflegeanweisung stehen außerhalb des Archivs.

## Übernommener Bestand

- 52 stabile ProcessStep-IDs in einem Prozessbestand: 24 SB01, 27 SB02, zusätzlicher Abschluss ohne erfundene Zuordnung.
- 16 sichtbare Fachartikel und 25 stabile Procedure-IDs. 560 ursprüngliche Artikel-/Übungs-/Bedientextstellen werden gegen die eingefrorene Ausgangsfixture geprüft.
- Vier gemeinsame Role-IDs; fünf zentrale Systeme mit bisherigen Bedienzielen/Tool-IDs.
- 19 vorhandene Arbeitsaufgaben und zwei zusätzliche Handbuchthemen ohne Matrixnummer. Materialien verknüpfter Aufgaben werden aus den führenden Prozessbeziehungen abgeleitet; nur ein zusätzlicher, fachlich anderer Lesebezug bleibt direkt an einer Task.
- 67 unterscheidbare Scope-/Funktionsreferenzen als generische Wissensthemen, einschließlich ursprünglicher Bezeichnungen als Titel oder Alias. Teilumfang und Voraussetzung werden nicht als Identität interpretiert.
- Tatsächliche aktuelle Fragen aus Issues und CareCases als einfache lokale oder gemeinsam verwendete offene Punkte. Generische Inventory-Standardtexte werden aus dem aktuellen Bestand dargestellt und nicht erneut als manuelle Daten gepflegt.
- Alle zwölf Originalquellen unverändert. Alle 19 bisherigen Markdown-Dokumente bytegleich archiviert, einschließlich der früheren Roadmap.

Die fünf begrenzt nutzbaren Beiträge sind `usable`, elf bleiben `draft`; kein Beitrag wurde als `approved` erfunden. Frühere Readiness-Begründungen sind normale Geltungsbereichsabschnitte im jeweiligen Artikel. Quellenkonflikte zu Antrag/Schulung und Build-Team-Rechten bleiben offen; Start Date/EDC, Lieferlisten/Meilensteine, LCM-3, WBS/Project Purpose und der begrenzte Reportingweg behalten ihre fachlichen Grenzen.

## Migration der bisherigen Runtime-Dateien

| Bisher | Neuer Ort / Verantwortung |
| --- | --- |
| `src/data/domain.ts`, `types.ts` | `src/content/types.ts`, `validation.ts` |
| `content.ts`, sämtliche `*-content.ts` | 16 Artikel-JSON-Dateien und zentrale `procedures.json`; optionale Übungen als normale Abschnitte |
| `catalog.ts`, `definition-catalog.ts` | Rollen, Prozesse, Tasks, Releases/TrainingBlocks und generische Referenzthemen |
| `inventory-source.ts` | Vollständige 52 Schritte, unterscheidbare Referenzthemen; CAP-Gruppierungen archiviert |
| `inventory.ts` | `getInventory()`; keine manuelle Projection oder Statusliste |
| `sb1-coverage.ts` | Materialbeziehungen am Fachobjekt und `getTrainingBlockCoverage(blockId)` |
| `content-readiness.ts` | Ein Artikelstatus und normaler Geltungsbereichstext; separates Modell entfernt |
| `care-cases.ts` | `docs/archive/decisions/care-cases.json`; aktuelle Fragen übernommen |
| `sources.ts` | Leichter optionaler JSON-Katalog; technische Hashes nur in der Migrationsprüfung |
| `editor-tools.ts` | Zentrale Systeme mit untergeordneten Bedienzielen |
| `editorial-content.ts`, `local-editorial.json` | Entfernt; effektiver Bestand vor Migration gesichert, aktuelles Journal war leer |
| `editorial-notes.ts` | Fachlich passende Grenzen im Inhalt; historische Hinweise archiviert |
| `lib/knowledge.ts`, `inventory-search.ts` | Gemeinsame Queries und Suche |
| `lib/editorial*.ts` | Entfernt; keine Registry, künstlichen Artikel, Spiegelungen oder Replay-Logik |
| `components/KnowledgeContext`, `ContentReadiness`, `Inventory`, `Editorial*`, `ArticlePencil`, `LocalArticleEditor` | Gemeinsame Inhaltsbausteine und direkter Editor in `src/editor/` |
| Spezialisierte Owner-/Milestone-Komponenten | Generischer Renderer mit stabilen Procedure-Referenzen |
| `pages/Home`, `Learning` | Aufgaben als Startseite; versteckte Demo-/Lernruntime entfernt |
| `scripts/editor-model.ts` | Direkter validierter JSON-Loader; keine SSR-Modellausführung pro Speicherung |
| 19 bisherige Testsuites | Vier Verhalten-/Integritätssuites mit isolierten Editor-Fixtures |

Die neun Demoartikel, drei alten Lernpfade und zwei Demo-Prozesse sind aus der Runtime entfernt. Lokaler Speicher `ippm-learning-v1`, unbekannte IDs und historische `passed`-Werte bleiben erhalten. Der Editor speichert direkt JSON, ohne automatische Git-Commits.

## Verifikation

`npm run verify` prüft Reader-Build, Editor-Build, TypeScript für Skripte/Tests und die vollständige Playwright-Suite. 55 Prüfungen decken Datenintegrität/Migration, generische R3/R4a/R4b-Testblöcke, fehlende automatische Release-Vererbung, Materialarten, Suche/Rollen/Prozesse, stabile Links, Browserpersistenz, Editor-Konflikte/Sicherheit, Entwicklungs- und gebauten Backendbetrieb sowie Desktop-/Mobil-Accessibility ab. `npm run format:check` und `git diff --check` ergänzen die Übergabeprüfung.

Die Anwendungslogik umfasst 20 TypeScript-/TSX-Dateien mit 2.764 Zeilen statt 45 Dateien mit 13.292 Zeilen. Vier Testsuites ersetzen 19. Die 27 kanonischen JSON-Dateien enthalten fachliche Daten; die höhere Inhaltsdateizahl durch einen Artikel je Datei ist keine zusätzliche Wahrheits- oder Ableitungsschicht. `DESIGN.md` bleibt unverändert.

## Verbleibende Grenzen

- Fachlich offene Quellenwidersprüche und Reichweiten bleiben absichtlich offen. Die Konsolidierung ist keine technische oder Unternehmensfreigabe.
- SB02 hat 27 zugeordnete Schritte, derzeit ohne konkrete Center-Materialien. Weitere Inhalte benötigen fachliche Grundlagen.
- Neue Artikel sind einfache JSON-Dateien; der lokale Formular-Editor bearbeitet vorhandene Inhalte. Ein eigener Anlege-Dialog ist optional.
- Windows-Start-/Shortcut-Skripte wurden beibehalten; native Windows-Ausführung wurde in der Linux-Umgebung nicht geprüft.
- Vite meldet weiterhin eine Chunkgrößenwarnung über 500 kB für den vollständigen lokalen Inhalt. Beide Builds sind erfolgreich; Code-Splitting kann bei gemessenem Bedarf folgen.
- Ein abgestürzter Schreibprozess kann eine technische `.editor.lock` hinterlassen. Sie darf erst nach Prüfung, dass kein Editor schreibt, entfernt werden.

Kein Merge, Release, Tag oder Push ist Teil dieser Umsetzung.
