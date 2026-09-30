# iPPM Knowledge & Training Center

Eine vollständig lokale Wissens- und Schulungsplattform für den iPPM-Arbeitsalltag bei TKMS ATLAS. Die erste Version führt von einer konkreten Frage zu einer verständlichen Anleitung und von einzelnen Beiträgen zu nachvollziehbaren Lernpfaden.

**Abstimmung 23.09.2026:** Aktuelle Klärungen und verbleibende technische, redaktionelle und spätere Punkte stehen in [Open Points und Trainingsreife](docs/open-points-readiness.md). Die datierte Excel-Quelle und die ergänzenden Bestätigungen aktualisieren die betreffenden älteren Aussagen; frühere Quellen bleiben erhalten.

## Lokal starten

### Ohne Terminal öffnen (Windows)

Die Desktop-Verknüpfung **iPPM Knowledge & Training Center** startet bei Bedarf die gebaute Anwendung im Hintergrund und öffnet `http://127.0.0.1:4173/` im Standardbrowser. Ein erneuter Klick öffnet die vorhandene Instanz. Der Server läuft bis zur Windows-Abmeldung; nach einer Anmeldung genügt wieder ein Klick auf die Verknüpfung. Internet wird für den Betrieb nicht benötigt.

Einmalig nach der Installation im Projektordner ausführen:

```powershell
npm.cmd ci
npm.cmd run build
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\install-shortcut.ps1 -WhatIf
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\install-shortcut.ps1
```

Die Zeile mit `-WhatIf` zeigt Ziel und Aufruf ohne Änderungen. Die Installation erstellt nur die Desktop-Verknüpfung, keinen Autostart und keine dauerhafte Änderung der PowerShell-Ausführungsrichtlinie. Eine abweichende Verknüpfung gleichen Namens wird nicht überschrieben. Zum Entfernen genügt das Löschen der Verknüpfung; der Server wird dadurch nicht beendet.

Nach Inhalts- oder Codeänderungen `npm.cmd run build` erneut ausführen und die Browserseite neu laden. Das Projektverzeichnis darf danach nicht verschoben werden; andernfalls die Verknüpfung erneut erstellen. Port 4173 bleibt fest, damit Merkliste und Lernstand im selben Browserspeicher bleiben. Wer bisher Port 5173 genutzt hat, kann Lernstand und Merkliste dort exportieren und unter 4173 importieren.

### Entwicklung und Vorschau

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

## Stand v0.8.0

v0.8.0 erschließt den vorhandenen Prozess- und Use-Case-Bestand vollständig hinsichtlich Auffindbarkeit und Kennzeichnung. Der lokale Abschluss baut auf `829b4d1` und der v0.7.1-Konsolidierung auf. Vollständige fachliche Schulungsreife oder Freigabe wird nicht behauptet; dokumentierte fachliche Lücken bleiben bestehen. Die weitere kontrollierte Pflege folgt der Roadmap. Umfang, Änderungstrennung und Prüfstand stehen in den [v0.8-Release-Notizen](docs/v0.8-abschluss.md).

Für die manuelle Prüfung zeigt die lokale Oberfläche ausschließlich quellenbasierte Beiträge. Die bisherigen Demo-Beiträge und Demo-Lernpfade bleiben mit ihren IDs und vorhandenen v1-Sicherungsdaten erhalten, erscheinen aber weder in Navigation, Suche, Prozessen noch Merkliste; alte Direktlinks öffnen keinen Demo-Inhalt.

- **Übersicht und Suche:** Projekt-/Teilprojektdefinition, Antrags-/Bereitstellungsorientierung, Team/Zugriff und Liefer-/Zahlungsmeilensteine stehen im Vordergrund. Externe Meilensteine, vorgegebenes Tailoring, Eskalationserfassung, PM-Statuspflege und der begrenzte Abgleich der R1-Projektstatusübersicht mit veröffentlichtem Plan und PDP Status ergänzen die Aufgaben. Schnellsuche, Filter und direkte Artikel-Links bleiben nutzbar.
- **Wissensbasis:** Fünfzehn quellenbasierte SB1-Entwürfe und ein Quellenentwurf zur R1B-/R2-Planung sind sichtbar. Die neun früheren Demo-Beiträge bleiben nur als Bestandsdaten erhalten. Fachbeiträge beginnen mit Kurzantwort, Voraussetzungen, kritischen Einschränkungen, Bedienweg, Ergebnisprüfung und Nachweisen; eine frühe Sprungnavigation führt zu diesen Abschnitten. Bei PM-Statuspflege und R1-Statusabgleich stehen Handlung und Ergebnisprüfung vor ausführlichen Quellen- und Einschränkungsbelegen.
- **Querschnitt:** Speichern und Prüfen in Liste oder PDP, Speichern/Veröffentlichen/Einchecken im MS Project Client und Speichern/Einchecken beim Owner-Wechsel sind kontextbezogen beschrieben.
- **Trainerbereich:** Ein fiktives Owner-Wechsel-Szenario für TM und ILSM kann vorbereitet und je Konto ausgewertet werden. Es ist kein protokollierter praktischer Durchlauf.
- **Prozesse:** Der Katalog erschließt alle 52 Prozessschritte sowie die vorhandenen Scope-, Funktions- und Use-Case-Kennungen. Die gesonderte SB1-Liste bleibt bei 24 Schritten: 22 mit realem Teilmaterial und zwei mit Orientierung ohne Gesamtbedienweg. Projektstatus enthält einen begrenzten PM-Pflegeweg; R1-Basisreporting enthält den Abgleichweg aus [Paket A](docs/pflegefall-r1-statusabgleich.md). Antrag und PMO-Anlage bleiben Orientierung. Praktische iPPM-Erprobung und fachliche Freigabe des Abgleichs fehlen weiterhin. LCM-3 gilt einmal pro Kalenderjahr; FIN-/SAP-Korrektur, ML-Filter und Statusübersicht sind bestätigt. Weitere LCM-Terminregeln und Empfängerbearbeitung bleiben begrenzt.
- **Demo und Lernstand:** Drei Lernpfade und ihre Wissenschecks bleiben Demo. Bestehende IDs, Hash-Links und die lokale Speicherversion 1 bleiben erhalten; Merkliste und Lernstand können exportiert und validiert importiert werden.

Die sechzehn Fachbeiträge sind **quellenbasierte Entwürfe**, keine fachlich freigegebenen Arbeitsanweisungen. Material, Lesemarkierungen und Demo-Abschlüsse belegen weder Schulung noch praktische Zielumgebungsprüfung. Der technische Abschluss und die offenen Prüfungen sind in [docs/v0.7-abschluss.md](docs/v0.7-abschluss.md) festgehalten.

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

Die additive fachliche Struktur liegt in `src/data/domain.ts`, die kuratierten Beziehungen in `catalog.ts`, das Quellenregister in `sources.ts`, die fünfzehn SB1-Entwürfe in `access-content.ts`, `milestone-content.ts`, `save-publish-content.ts`, `definition-content.ts` und `control-content.ts`; der neue Fachkatalog liegt in `definition-catalog.ts` sowie die Matrixabdeckung in `sb1-coverage.ts`. `release-content.ts` enthält die gesonderte R1B-/R2-Planungsorientierung. `src/lib/knowledge.ts` leitet Verweise und Suchtexte ab; `KnowledgeContext.tsx` ergänzt die bestehende Beitragsansicht. Quelldateien werden nicht ausgeführt oder als vermeintlich verfügbare Downloads angeboten.

**Persistenz:** `localStorage`, Schlüssel `ippm-learning-v1`, mit `{ version: 1, bookmarks: string[], read: string[], passed: string[] }`. Browser und Port bestimmen den Speicherbereich; Entwicklungsserver und Vorschau teilen deshalb nicht automatisch denselben Lernstand. Export/Import überträgt ihn. Beim Import werden unbekannte IDs verworfen, Duplikate zusammengeführt und Abschlüsse ohne vollständig gelesene Lektionen nicht übernommen. Beschädigter oder gesperrter Speicher führt zu einem sichtbaren Hinweis; die Anwendung bleibt bedienbar. Keine Synchronisierung zwischen Geräten oder gleichzeitig geöffneten Tabs. Gespeichert werden nur Inhalts-IDs, keine Projektdaten.

**Design:** `DESIGN.md` bleibt unverändert die verbindliche Grundlage. Scharfe Ecken, flache Flächen, klare Hierarchie, funktionale gelbe Linien und explizite Auswahlzustände. Arial wird als erlaubter lokaler Fallback verwendet, weil keine TKMS-Fontdateien vorliegen. Es wird kein offizielles Unternehmenslogo nachgezeichnet. TKMS ATLAS erscheint als reine Textangabe. Die sekundäre Textfarbe nutzt das freigegebene Neutral-70 für ausreichenden Kontrast auf grauen Flächen.

## Prüfen

Die [v0.8-Entscheidungsvorbereitung](docs/v0.8-vorbereitung.md) dokumentiert den durchsuchbaren Katalog aller 52 Prozessschritte, 31 Scope-IDs, 36 Funktionsnachweise und vorhandenen Arbeitsaufgaben/Use Cases. Beitragskarten und Artikel unterscheiden zusätzlich die redaktionellen Inhaltsstände „Nutzbar“, „Teilweise belegt“ und „Platzhalter“. Der [lokale Abschluss v0.8.0](docs/v0.8-abschluss.md) erhöht weder Quellenstatus noch fachliche Freigaben.

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
