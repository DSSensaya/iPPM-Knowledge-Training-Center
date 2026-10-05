# iPPM Knowledge & Training Center

Lokale Wissens- und Arbeitshilfe für iPPM-Anwender: Aufgaben finden, Prozesse verstehen, Rollen einordnen und Wissen durchsuchen. Ohne Cloud, Anmeldung, Telemetrie oder externe Schriften.

## Starten

Node.js ab 22 und npm installieren, dann im Repository:

```sh
npm ci
npm run dev
```

Die ausgegebene Adresse an `127.0.0.1` öffnen. Für einen gebauten Reader:

```sh
npm run build
npm run preview -- --port 4173 --strictPort
```

Windows: bei gesperrten PowerShell-Skripten `npm.cmd` verwenden. `scripts/open-center.ps1` startet den gebauten Reader auf dem bisherigen Port 4173; `scripts/install-shortcut.ps1` richtet die optionale lokale Verknüpfung ein.

## Inhalte pflegen

JSON in `src/content/` ist der kanonische Bestand. Ein normaler Beitrag benötigt nur ID, Titel, Zusammenfassung, Rollen, Systeme, Status und Inhaltsabschnitte. Quellen und offene Punkte sind optional.

```sh
npm run edit
```

Im lokalen Editor **Inhalte pflegen** öffnen. Artikelfelder bearbeiten oder Beziehungen in der JSON-Ansicht pflegen. Änderungen werden nach Validierung und Konfliktprüfung direkt atomar in den kanonischen Dateien gespeichert. Es werden keine Commits erzeugt.

Für einen Editor ohne Vite-Entwicklungsserver:

```sh
npm run build:editor
npm run edit:built
```

Der Editor läuft ausschließlich an `127.0.0.1:5174` und benötigt das Repository mit seinen Inhaltsdateien. Der statische Reader übernimmt Änderungen nach einem neuen Build. Neue Artikel können als JSON-Dateien hinzugefügt werden; der nächste Build beziehungsweise Editor-Neustart findet sie automatisch.

## Prüfen

```sh
npm run verify
npm run typecheck:tools
```

Playwright verwendet einen lokal installierten Chrome oder unter Linux `/usr/bin/chromium`. Alternativ `PLAYWRIGHT_EXECUTABLE_PATH` setzen. Die Tests prüfen Integrität, Migration, fachliche Grenzen, Suche, Navigation, Persistenz, Editor, Accessibility und Desktop-/Mobilansichten. Editor-Schreibtests verwenden ausschließlich isolierte temporäre Repository-Kopien.

## Orientierung

Unter **Prozesse → Releaseüberblick** bleiben Funktionen, Katalogprozesse und
Systembausteine sichtbar. Ein Klick auf R1 bis R4b hebt explizite Planungsbezüge
hervor; fehlende Bezüge werden grau dargestellt. Das ist kein Verfügbarkeits-
oder Freigabenachweis. Details und gemeinsame Suche führen zu den kanonischen
Center-Inhalten. Die importierte HTML wird nicht als zweite Anwendung betrieben.

- [Architektur](docs/ARCHITECTURE.md): Datenmodell, Verantwortlichkeiten und Datenfluss.
- [Inhaltspflege](docs/CONTENT_GUIDE.md): pragmatische Beispiele und Pflegewege.
- [Aktuelle Prioritäten](docs/ROADMAP.md).
- [Historische Unterlagen](docs/archive/README.md): Release-, Pflege- und Entscheidungsdokumentation.

`usable` beschreibt einen begrenzten Beitrag. `approved` bedeutet ausschließlich Freigabe im Knowledge Center; keine System- oder Unternehmensfreigabe. Schulungszuordnung und vorhandenes Material belegen keine vollständige Prozessabdeckung.

Merkliste und Lesemarkierungen bleiben unter `ippm-learning-v1` im Browser. Unbekannte oder archivierte IDs bleiben als opaque Werte für Sicherungen erhalten. Ein Import ergänzt vorhandene Werte. Eine Lesemarkierung ist kein Schulungsnachweis.
