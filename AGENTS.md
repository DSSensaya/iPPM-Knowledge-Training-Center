# Projektregeln

- `docs/ROADMAP.md` ist die verbindliche aktuelle Produktstrategie für Prioritäten und Ausbau bis v1.0.
- `DESIGN.md` ist die verbindliche Design-Spezifikation. Nur ihre Farben und Schrift-Fallbacks verwenden; keine Rundungen, Schatten, Verläufe oder dekorativen Trennlinien.
- Vollständig lokaler Betrieb: keine CDNs, Cloud-APIs, Telemetrie oder externen Fonts. Server standardmäßig nur an `127.0.0.1` binden.
- Deutsche, aufgabenorientierte Oberfläche; semantisches HTML, Tastaturbedienung, sichtbarer Fokus und responsive Darstellung erhalten.
- Fachliche Demonstrationsinhalte eindeutig kennzeichnen. Keine erfundenen internen Freigaben, Kontakte oder verbindlichen Unternehmensprozesse behaupten.
- Inhalte und stabile IDs in `src/data/` pflegen; Darstellung, Suche und versionierte lokale Persistenz getrennt halten. Bestehende IDs nicht ohne Migration ändern.
- Lernfortschritt und Merkliste enthalten keine vertraulichen Projektdaten. Speicherfehler sichtbar abfangen.
- Vor Übergabe `npm.cmd run build` und `npm.cmd test` ausführen. Neue fachliche Funktionen mit sinnvollen Ende-zu-Ende-Prüfungen absichern.

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