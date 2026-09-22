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

## Das MVP mit v0.3-Durchstich

- **Übersicht:** prominent platzierte Suche, direkte Aufgabeneinstiege, empfohlene Beiträge und der nächste offene Lernpfad.
- **Wissensbasis:** neun bestehende Demo-Beiträge und zwei quellenbasierte Entwürfe zu Zugriffsrechten und Owner-Wechsel, Volltextsuche einschließlich Funktions-, Rollen- und Schrittbezügen sowie kombinierbare Themen-, Rollen- und Formatfilter. Titel werden in der Suche höher gewichtet; Umlaute sind tolerant suchbar.
- **Beitragsansicht:** Inhaltsverzeichnis, Schritte, Kernaussage, verwandte Inhalte, Lesemarkierung und Lesezeichen.
- **Lernpfade:** drei Pfade mit jeweils drei Lektionen und einem Wissenscheck. Gelesene Beiträge werden pfadübergreifend berücksichtigt. Ein Pfad ist erst nach allen Lektionen und richtiger Antwort abgeschlossen. Falsche Antworten lassen sich wiederholen. Das Entfernen einer Lesemarkierung öffnet betroffene abgeschlossene Pfade wieder.
- **Prozesse:** zwei beispielhafte Abläufe mit Zuständigkeiten, Ergebnissen und verlinkten Anleitungen.
- **Mein Lernbereich:** Merkliste, Fortschritt sowie JSON-Export und validierter, ergänzender Import.
- **Hilfe:** bedienbare FAQ und Hinweise zur Vorbereitung einer internen Supportanfrage.

Die bisherigen fachlichen Inhalte bleiben **Demonstrationsinhalte**. Die neue Anleitung und FAQ sind **quellenbasierte Entwürfe**, keine offiziell freigegebenen Arbeitsanweisungen. Ein Wissenscheck ist eine Selbstkontrolle und kein Schulungsnachweis oder Zertifikat.

Der begrenzte v0.3-Durchstich nach `docs/v0.3-inhalts-und-datenmodell.md` verbindet PM, PMO, TM und ILSM, die Scope-Positionen R1-06/07/23 und die Schritte 2.6/2.7/2.11/2.15. Er unterscheidet Rollenliste, Build Team und Project Permissions. Die Owner-Übergabe enthält Voraussetzungen, die vier vorher zu sichernden Rechte, Bedienweg und Ergebnisprüfung. Quellenfundstellen, technische Nachweise, Schulungszuordnung und historische Release-Aussagen bleiben getrennt; der abweichende frühere Schulungsweg und der offene Synchronisationskonflikt bleiben sichtbar. Trainer erhalten einen Übungsvorschlag mit Voraussetzungen. SB1 wird dadurch kein neuer abgeschlossener Lernpfad. Demo-IDs, Navigation, Lernpfade und Speicherversion 1 bleiben erhalten.

## Produkt- und Architekturentscheidungen

**React + TypeScript + Vite**, mit lokal gebündelten Lucide-Icons. Kein Backend, keine Anmeldung, keine Cloud, keine Telemetrie und keine externen Schriften. Die statische Architektur hält das MVP einfach auslieferbar und ermöglicht später einen Austausch der Inhaltsquelle, ohne die Darstellung neu zu bauen. `package-lock.json` fixiert die installierten Abhängigkeiten; der npm-Cache liegt workspace-lokal.

Die Navigation verwendet stabile Hash-URLs. Beiträge und Lernpfade sind direkt verlinkbar; Browser-Zurück/Vorwärts funktionieren ohne spezielle Serverregeln. Suchbegriff und Filter sind Bestandteil der URL. Inhalte werden als Text durch React gerendert, nicht als ausführbares HTML.

```text
src/
  data/types.ts       Domänenmodell: Beitrag, Abschnitt, Rolle, Lernpfad, Prozess
  data/content.ts     Redaktionelle Demo-Inhalte mit stabilen IDs und Verweisen
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

Die additive fachliche Struktur liegt in `src/data/domain.ts`, die kuratierten Beziehungen in `catalog.ts`, das Quellenregister in `sources.ts` und die beiden Entwürfe in `access-content.ts`. `src/lib/knowledge.ts` leitet Verweise und Suchtexte ab; `KnowledgeContext.tsx` ergänzt die bestehende Beitragsansicht. Quelldateien werden nicht ausgeführt oder als vermeintlich verfügbare Downloads angeboten.

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

Die v0.3-Prüfungen in `tests/knowledge-data.spec.ts` und `tests/access.spec.ts` ergänzen Referenzintegrität, getrennte Quellenbewertungen, den gesamten Zugriffs-Durchstich, Accessibility und die unveränderte Übernahme bestehender v1-Lernstände. Insgesamt laufen 24 Tests auf Desktop und Mobilansicht.

## Sinnvolle nächste Ausbaustufe

Vor produktiver Nutzung: Inhalte mit Fachverantwortlichen validieren, echte Rollen und Prozessbegriffe übernehmen und einen redaktionellen Freigabeprozess festlegen. Erst bei Bedarf folgen eine lokale Inhaltsverwaltung, Mehrbenutzerbetrieb und Anbindung an freigegebene interne Systeme. Diese erste Version bietet bewusst keine vorgetäuschten Schnittstellen oder funktionslosen Download-/Supportaktionen.
