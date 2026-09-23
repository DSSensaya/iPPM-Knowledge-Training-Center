# iPPM Knowledge & Training Center

Eine vollständig lokale Wissens- und Schulungsplattform für den iPPM-Arbeitsalltag bei TKMS ATLAS. Die erste Version führt von einer konkreten Frage zu einer verständlichen Anleitung und von einzelnen Beiträgen zu nachvollziehbaren Lernpfaden.

## Lokal starten

Voraussetzungen: Node.js ab 22.12 (entwickelt und geprüft mit Node.js 26) und npm. Unter Windows PowerShell `npm.cmd` verwenden, falls die Ausführungsrichtlinie `npm.ps1` sperrt.

```powershell
npm.cmd ci
npm.cmd run dev
```

Die Anwendung ist unter **http://127.0.0.1:5173** erreichbar. Ohne belegten Standardport öffnet Vite den nächsten freien Port und nennt ihn im Terminal.

Für den Produktionsstand:

```powershell
npm.cmd run build
npm.cmd run preview -- --port 4173
```

Anschließend **http://127.0.0.1:4173** öffnen. Die einmalige Installation benötigt Zugang zur npm-Registry. Der laufende Entwicklungs- oder Produktionsserver benötigt kein Internet. Alle Inhalte und Assets kommen aus dem Workspace. Der Server bindet nur an die lokale Loopback-Adresse. Der lokale Server muss laufen; das direkte Öffnen von `dist/index.html` als Datei ist nicht vorgesehen.

## Stand v0.7.0

- **Übersicht und Suche:** Projekt-/Teilprojektdefinition, Antrags-/Bereitstellungsorientierung, Team/Zugriff und Liefer-/Zahlungsmeilensteine stehen vor den Demo-Lernpfaden. Externe Meilensteine, vorgegebenes Tailoring, Eskalationserfassung und Orientierung zu Status/Reporting ergänzen die Aufgaben. Schnellsuche, Filter und direkte Artikel-Links bleiben nutzbar.
- **Wissensbasis:** Fünfzehn quellenbasierte Entwürfe und neun klar getrennte Demo-Beiträge. Reale Beiträge beginnen mit Kurzantwort, Voraussetzungen, kritischen Einschränkungen, Bedienweg, Ergebnisprüfung und Nachweisen; eine frühe Sprungnavigation führt zu diesen Abschnitten.
- **Querschnitt:** Speichern und Prüfen in Liste oder PDP, Speichern/Veröffentlichen/Einchecken im MS Project Client und Speichern/Einchecken beim Owner-Wechsel sind kontextbezogen beschrieben.
- **Trainerbereich:** Ein fiktives Owner-Wechsel-Szenario für TM und ILSM kann vorbereitet und je Konto ausgewertet werden. Es ist kein protokollierter praktischer Durchlauf.
- **Prozesse:** 20 Schritte mit realem Teilmaterial und vier Schritte mit gesonderter Orientierung ohne Gesamtbedienweg sind angebunden. Eine gesonderte Liste behandelt genau 24 SB1-Matrixschritte mit Quellen, Material, Lücken und Konflikten. Antrag, PMO-Anlage, Statuspflege und R1-Basisreporting bleiben ohne Gesamtbedienweg. LCM-Regeln, Empfängerbearbeitung sowie ungeprüfte Status-/Filterwirkungen sind ausgeschlossen.
- **Demo und Lernstand:** Drei Lernpfade und ihre Wissenschecks bleiben Demo. Bestehende IDs, Hash-Links und die lokale Speicherversion 1 bleiben erhalten; Merkliste und Lernstand können exportiert und validiert importiert werden.

Die fünfzehn Fachbeiträge sind **quellenbasierte Entwürfe**, keine fachlich freigegebenen Arbeitsanweisungen. Material, Lesemarkierungen und Demo-Abschlüsse belegen weder Schulung noch praktische Zielumgebungsprüfung. Der technische Abschluss und die offenen Prüfungen sind in [docs/v0.7-abschluss.md](docs/v0.7-abschluss.md) festgehalten.

## Produkt- und Architekturentscheidungen

**React + TypeScript + Vite**, mit lokal gebündelten Lucide-Icons. Kein Backend, keine Anmeldung, keine Cloud, keine Telemetrie und keine externen Schriften. Die statische Architektur hält das MVP einfach auslieferbar und ermöglicht später einen Austausch der Inhaltsquelle, ohne die Darstellung neu zu bauen. `package-lock.json` fixiert die installierten Abhängigkeiten; der npm-Cache liegt workspace-lokal.

Die Navigation verwendet stabile Hash-URLs. Beiträge und Lernpfade sind direkt verlinkbar; Browser-Zurück/Vorwärts funktionieren ohne spezielle Serverregeln. Suchbegriff und Filter sind Bestandteil der URL. Inhalte werden als Text durch React gerendert, nicht als ausführbares HTML.

```text
src/
  data/types.ts       Domänenmodell: Beitrag, Abschnitt, Rolle, Lernpfad, Prozess
  data/content.ts     Redaktionelle Demo-Inhalte mit stabilen IDs und Verweisen
  data/               Reale Fachbeiträge, Quellenregister und SB1-Abdeckung
  lib/search.ts       Normalisierung, kombinierte Filter und Relevanzsortierung
  lib/storage.ts      Versioniertes Speicherschema und Validierung
  components/ui.tsx   Gemeinsame Suche, Beitragskarten, Fortschrittsanzeige
  pages/              Fachliche Ansichten
  App.tsx             Navigation, Anwendungsrahmen und Fortschrittsaktionen
  tokens.css          Zentrale Farben und Schriften aus DESIGN.md
  styles.css          Komponenten, Layout, responsive Zustände und Druckansicht
tests/app.spec.ts     Ende-zu-Ende- und automatisierte Accessibility-Prüfungen
```

Neue Beiträge benötigen eine eindeutige ID, Thema, Rollen, Format, Lesezeit, Stand, Abschnitte, Kernaussage und gültige verwandte IDs. Lernpfade referenzieren Beiträge und enthalten einen Wissenscheck. Prozesse referenzieren ergänzende Anleitungen pro Phase. Diese Trennung erlaubt eine spätere redaktionelle Importstrecke oder lokale Datenbank.

Die additive fachliche Struktur liegt in `src/data/domain.ts`, die kuratierten Beziehungen in `catalog.ts`, das Quellenregister in `sources.ts`, die fünfzehn Entwürfe in `access-content.ts`, `milestone-content.ts`, `save-publish-content.ts`, `definition-content.ts` und `control-content.ts`; der neue Fachkatalog liegt in `definition-catalog.ts` sowie die Matrixabdeckung in `sb1-coverage.ts`. `src/lib/knowledge.ts` leitet Verweise und Suchtexte ab; `KnowledgeContext.tsx` ergänzt die bestehende Beitragsansicht. Quelldateien werden nicht ausgeführt oder als vermeintlich verfügbare Downloads angeboten.

**Persistenz:** `localStorage`, Schlüssel `ippm-learning-v1`, mit `{ version: 1, bookmarks: string[], read: string[], passed: string[] }`. Browser und Port bestimmen den Speicherbereich; Entwicklungsserver und Vorschau teilen deshalb nicht automatisch denselben Lernstand. Export/Import überträgt ihn. Beim Import werden unbekannte IDs verworfen, Duplikate zusammengeführt und Abschlüsse ohne vollständig gelesene Lektionen nicht übernommen. Beschädigter oder gesperrter Speicher führt zu einem sichtbaren Hinweis; die Anwendung bleibt bedienbar. Keine Synchronisierung zwischen Geräten oder gleichzeitig geöffneten Tabs. Gespeichert werden nur Inhalts-IDs, keine Projektdaten.

**Design:** `DESIGN.md` bleibt unverändert die verbindliche Grundlage. Scharfe Ecken, flache Flächen, klare Hierarchie, funktionale gelbe Linien und explizite Auswahlzustände. Arial wird als erlaubter lokaler Fallback verwendet, weil keine TKMS-Fontdateien vorliegen. Es wird kein offizielles Unternehmenslogo nachgezeichnet. TKMS ATLAS erscheint als reine Textangabe. Die sekundäre Textfarbe nutzt das freigegebene Neutral-70 für ausreichenden Kontrast auf grauen Flächen.

## Prüfen

```powershell
npm.cmd run build
npm.cmd test
```

Die Tests verwenden einen lokal installierten **Google Chrome** und starten die gebaute Anwendung auf Port 4173. Alternativ kann ein installiertes Microsoft Edge gewählt werden:

```powershell
$env:PLAYWRIGHT_CHANNEL = 'msedge'
npm.cmd test
```

Playwright prüft Desktop (1.440 × 1.100) und Mobilansicht (390 × 844): Suche und Filter, leere Ergebnisse, Merkliste über Neuladen, Sicherungsexport, gültigen/ungültigen Import, kompletten Lernpfad mit falscher und richtiger Antwort, Rücknahme von Lesemarkierungen, kaputten/gesperrten Speicher, unbekannte URLs, Tastaturbedienung und mobile Navigation. Auf acht zentralen Ansichten prüft axe automatisiert WCAG-A/AA-Regeln; zusätzlich werden horizontales Überlaufen, Laufzeitfehler und externe Netzwerkaufrufe kontrolliert. Das ersetzt keine vollständige manuelle Barrierefreiheitsprüfung. Screenshots entstehen in `test-results/`.

Die Prüfungen in `tests/` decken Referenzintegrität, Quellenbewertungen, alle Fachpakete einschließlich Projekt-/Teilprojektdefinition und begrenzter PMO-Orientierung, Kontextwege, Trainerpaket, 24er-Abdeckung, Accessibility und die unveränderte Übernahme bestehender v1-Lernstände ab.

## Sinnvolle nächste Ausbaustufe

Vor produktiver Nutzung: Inhalte mit Fachverantwortlichen validieren, echte Rollen und Prozessbegriffe übernehmen und einen redaktionellen Freigabeprozess festlegen. Erst bei Bedarf folgen eine lokale Inhaltsverwaltung, Mehrbenutzerbetrieb und Anbindung an freigegebene interne Systeme. Diese erste Version bietet bewusst keine vorgetäuschten Schnittstellen oder funktionslosen Download-/Supportaktionen.

## Aktuelle iPPM-Releaseplanung R1B / R2

Die [Releaseplanung und vollständige Scope-Übernahme](docs/ippm-release-2-scope.md) ergänzen den fachlichen Zielrahmen. Das unveränderte Original liegt unter `sources/iPPM_Releaseplanung_Release-2.docx`, die aktuelle Quelle trägt die ID `R2P`; `H` bleibt historisch. Die Übersicht ist im Center über die Suche „Release 2“ erreichbar. Sie ergänzt die fünfzehn SB1-Entwürfe um einen sechzehnten Quellenentwurf zur Release-Orientierung. R1B umfasst Power-BI-Reporting; R2 umfasst Kalkulation, Ressourcen-/Kostenplanung und SAP-Kopplung sowie die in der Quelle bezeichneten Backlog-Themen. Dies ändert weder die SB1-Prioritäten bis v1.0 noch die Trainingsabdeckung. Umsetzung, Freigabe und Termine werden durch diese Planungsquelle nicht belegt.
