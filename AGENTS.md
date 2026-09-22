# Projektregeln

- `DESIGN.md` ist die verbindliche Design-Spezifikation. Nur ihre Farben und Schrift-Fallbacks verwenden; keine Rundungen, Schatten, Verläufe oder dekorativen Trennlinien.
- Vollständig lokaler Betrieb: keine CDNs, Cloud-APIs, Telemetrie oder externen Fonts. Server standardmäßig nur an `127.0.0.1` binden.
- Deutsche, aufgabenorientierte Oberfläche; semantisches HTML, Tastaturbedienung, sichtbarer Fokus und responsive Darstellung erhalten.
- Fachliche Demonstrationsinhalte eindeutig kennzeichnen. Keine erfundenen internen Freigaben, Kontakte oder verbindlichen Unternehmensprozesse behaupten.
- Inhalte und stabile IDs in `src/data/` pflegen; Darstellung, Suche und versionierte lokale Persistenz getrennt halten. Bestehende IDs nicht ohne Migration ändern.
- Lernfortschritt und Merkliste enthalten keine vertraulichen Projektdaten. Speicherfehler sichtbar abfangen.
- Vor Übergabe `npm.cmd run build` und `npm.cmd test` ausführen. Neue fachliche Funktionen mit sinnvollen Ende-zu-Ende-Prüfungen absichern.
