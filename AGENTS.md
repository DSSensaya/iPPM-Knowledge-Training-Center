# Projektregeln

- `docs/ROADMAP.md` ist die verbindliche aktuelle Produktstrategie für Prioritäten und Ausbau bis v1.0.
- `DESIGN.md` ist die verbindliche Implementierungsreferenz für das Design. Ihre belegten Farben, Typografie, Oberflächen und komponentenspezifischen Geometrien verwenden; blaue Fokuszustände und passende originale iPPM-Logoassets erhalten. Nicht belegte Werte ausdrücklich als iPPM-Projektentscheidungen dokumentieren (aktuelle Umsetzung: `docs/DESIGN_IMPLEMENTATION.md`). Keine pauschalen Verbote für Rundungen, Pills, Schatten oder Verläufe aus der alten Fassung übernehmen.
- Vollständig lokaler Betrieb: keine CDNs, Cloud-APIs, Telemetrie oder externen Fonts. Server standardmäßig nur an `127.0.0.1` binden.
- Deutsche, aufgabenorientierte Oberfläche; semantisches HTML, Tastaturbedienung, sichtbarer Fokus und responsive Darstellung erhalten.
- Fachliche Demonstrationsinhalte eindeutig kennzeichnen. Keine erfundenen internen Freigaben, Kontakte oder verbindlichen Unternehmensprozesse behaupten.
- Kanonische Inhalte und stabile IDs als JSON in `src/content/` pflegen; Darstellung, Suche und versionierte lokale Persistenz getrennt halten. Bestehende IDs nicht ohne Migration ändern.
- Lernfortschritt und Merkliste enthalten keine vertraulichen Projektdaten. Speicherfehler sichtbar abfangen.
- Vor Übergabe `npm run verify` (unter Windows `npm.cmd run verify`) ausführen. Neue fachliche Funktionen mit sinnvollen Ende-zu-Ende-Prüfungen absichern.

## Code-Review-Richtlinien

- Priorisiere funktionale Fehler, Regressionen, Datenintegrität, Sicherheitsrisiken und klare fachliche Widersprüche vor Stilfragen.
- Prüfe Änderungen gegen `AGENTS.md`, `DESIGN.md`, `docs/ROADMAP.md` sowie bestehende Daten-, ID- und Persistenzkonventionen.
- Fachliche Inhalte mit Augenmaß bewerten: kleinere Unschärfen, vereinfachte Formulierungen oder noch nicht vollständig geklärte Details nicht automatisch als Finding behandeln.
- Nur fachliche Punkte beanstanden, wenn ein nachvollziehbarer Widerspruch, eine irreführende Aussage oder ein relevantes Risiko für Nutzer entsteht. Fehlende Sicherheit eher als Hinweis kennzeichnen.
- Findings müssen konkret sein: betroffene Stelle, Auswirkung und sinnvolle Korrekturrichtung nennen.
- Keine Findings für reine Geschmacks-, Formatierungs- oder persönliche Stilfragen erzeugen.
- Prüfe, ob relevante Änderungen ausreichend getestet sind und bestehende Funktionen nicht unbeabsichtigt beeinträchtigen.
- Im Review keinen Code ändern, committen oder mergen, sofern dies nicht ausdrücklich beauftragt wurde.
- Wenn keine relevanten Probleme bestehen, dies klar feststellen und keine künstlichen Findings erzeugen.

## Content-first Architektur

- `docs/ARCHITECTURE.md` beschreibt den aktuellen Datenfluss; `docs/CONTENT_GUIDE.md` die Inhaltspflege. `docs/archive/` ist historische Dokumentation ohne normative Runtime-Wirkung.
- Es gibt einen vollständigen ProcessStep-Bestand in `src/content/processes.json`. Coverage, Inventory, Suche und Schulungsbezüge entstehen aus generischen Queries. Keine parallelen Coverage-, Readiness-, Assignment- oder Assessment-Datenbestände anlegen.
- Artikelstatus: `draft`, `usable`, `approved`. Nutzbarkeit ist keine vollständige Prozessabdeckung; `approved` gilt ausschließlich für das Knowledge Center.
- Originalquellen erhalten. Quellenwidersprüche und fachlich notwendige Grenzen sichtbar lassen. Keine Releasegültigkeit aus TrainingBlock-Zuordnungen ableiten.
- Bedienwege nur einmal in `procedures.json` pflegen; Verbindungen über stabile IDs. Normale Beiträge benötigen keine Quellen-, Review- oder Historienobjekte.
