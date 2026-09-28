# Pflegefall Start Date / EDC

Stand: 28.09.2026 · Nachträgliche Rekonstruktion bestehender Übernahme · Kein neuer Systemtest und keine Artikelfreigabe.

## Umsetzungsentscheidung

Der Auftraggeber hat am 28.09.2026 das vorgelegte Änderungsdossier mit „PLEASE IMPLEMENT THIS PLAN“ ausdrücklich zur Umsetzung beauftragt. Der Umfang lautet: zuerst vollständige Rückfallsicherung, anschließend ausschließlich Pflegefall und direkte Belegzuordnungen, keine Änderung fachlicher Aussagen. Diese aktuelle redaktionelle Entscheidung bestätigt weder neue Systemwirkungen noch die vollständigen Artikel. Eine damalige redaktionelle Genehmigung vom 23.09.2026 ist nicht separat belegt und wird nicht nachgetragen.

Die bereitgestellten Projektdaten sind laut ausdrücklicher Erklärung des Auftraggebers für die KI-Verarbeitung genehmigt. Diese Zulässigkeit ist kein offener Blocker dieses Auftrags.

## Verbindlicher Datensatz und Grenzen

Der strukturierte Datensatz `care-start-date-edc` liegt in [src/data/care-cases.ts](../src/data/care-cases.ts). Er ist das redaktionelle Register für diesen Fall, keine zweite Fassung der Artikel. Die Oberfläche verwendet weiterhin die bestehenden Artikel; eine Eingabemaske oder automatische Auswirkungsanalyse gehört nicht zu diesem Auftrag.

| Aussage                                        | Beleg und Bestätigungsstand                          | Redaktionelle Behandlung                                                            |
| ---------------------------------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Wechselseitige Start-Date-Synchronisation      | C23, Punkt 1; Auftraggeberbestätigung vom 23.09.2026 | Bestehende Aussage erhalten; direkten Beleg am Stammdaten-Bedienweg ergänzt.        |
| EDC als unabhängiger vertraglicher Starttermin | C23, Punkt 1; Auftraggeberbestätigung vom 23.09.2026 | Bestehende Aussage erhalten; zusammen mit der Synchronisation gezielt nachgewiesen. |
| Zusätzliches EDC-Feld auf Contract             | TTT-D-06 und C23, Punkt 1; Umsetzung unbestätigt     | Bestehenden offenen Konfigurationspunkt erhalten.                                   |

[TTT-D-06](../sources/TtT_Restpunkte_abgestimmt_2026-09-23.md#ttt-d-06--zeile-7) bleibt als historischer Prüfauftrag erhalten. [C23, Punkt 1](../sources/Klaerungen_2026-09-23.md) aktualisiert ausdrücklich nur die benannten Aussagen. Es gibt keine neue Beobachtung. Die Bestätigung ersetzt keinen praktischen Nachweis in der später verwendeten Zielumgebung.

Release und Umgebung der Bestätigung sind nicht vollständig bezeichnet. Ihre ausdrückliche Reichweite für die System-/ILS-Teilprojektvarianten sowie der Zielstand der zusätzlichen Feldbereitstellung bleiben offen. Vorhandene Verwendungen im Teilprojektbeitrag sind erfasst; daraus wird keine neue Variantenbestätigung abgeleitet.

## Nachvollziehbare Übernahme

- Ausgangspunkt: Commit `66a5c208e8c6afc641a374748dffb06262273231`; Projektstammdaten und Teilprojektdefinition jeweils Inhaltsrevision 2. Der Pflegefall hält zusätzlich den SHA-256 der tatsächlich vorgefundenen Definitionsdatei fest.
- [Projektstammdaten](../src/data/definition-content.ts): `procedure-project-master-data` erhält `C23 / Punkt 1 (nur Start Date / EDC)`. Artikel `guide-project-master-data` erhält Revision 3 vom 28.09.2026 als reine Belegergänzung. Frühere Revisionen und ihre Quellensnapshots bleiben unverändert; die neue Revision kopiert den festen Snapshot ihrer Vorgängerrevision.
- Zusammenfassungen, Handlungsanweisungen, Prüffragen, Übungen und Ergebnisse bleiben unverändert. Status bleibt `source-draft`, `reviews` bleibt leer.
- `guide-subproject-definition`, seine beiden Stammdaten-Bedienwege und die Schritte 2.1, 2.8 und 2.12 sind Verwendungen, keine automatisch zu ändernden Texte. Die SB1-Abdeckung wird weiterhin abgeleitet.
- `issue-f-r1-open-05` bleibt geschlossen; die Feldbereitstellung bleibt unter `issue-definition-configuration` offen. [Readiness](open-points-readiness.md) und historische Abschlussberichte bleiben unverändert.
- Übernahme-, Ziele- und Organisationsbeiträge sind wegen gemeinsamer Quellen beziehungsweise des breiten Konfigurations-Issues nur Prüftreffer. Es gibt keine pauschale Änderungswelle.

Die aktuelle Umsetzungsentscheidung steht getrennt von der historischen Übernahme, vom Bestätigungsstand jeder Aussage und von praktischen Nachweisen. Bei späteren neuen Erkenntnissen zunächst deren Ursprung und Beleg erfassen; eine akzeptierte Beobachtung darf den Bestätigungsstand nicht automatisch erhöhen. Vorschläge gegen ihre Ausgangsrevision prüfen und erst nach einer konkreten Entscheidung übernehmen. Das Register dokumentiert diese Schritte; es automatisiert sie nicht.

## Rückfallsicherung vor der Änderung

Die vollständige Sicherung liegt außerhalb des Workspaces:

`C:\Users\julie\Documents\iPPM-Backups\start-date-edc-20260928-203544`

- `workspace/`: vollständige Kopie einschließlich verstecktem `.git`, Quellen, `.git/local-backups`, Abhängigkeiten, Build, lokalen Zusatzablagen und unversionierten Dateien.
- `files.json`: relative Dateipfade, Größen und SHA-256-Prüfsummen für 7.715 Dateien (395.648.995 Byte). Quelle und Kopie wurden vor den Inhaltsänderungen verglichen.
- `manifest.json`: Zeitpunkt, ursprünglicher Pfad, HEAD, Branch, Git-Status und Wiederherstellungsprotokoll.
- `restore-check/`: isolierte Wiederherstellung; alle 7.715 Dateiprüfsummen sowie HEAD, Branch und Git-Status stimmen mit der Sicherung überein. Keine Anwendung gestartet, keine Abhängigkeiten installiert, keine Verknüpfung ausgeführt.
- `browser/chrome-127.0.0.1-4173.json`: exportierter v1-Lernstand des verfügbaren Chrome-Profils (eine Lesemarkierung, keine Merkliste oder Abschlüsse), mit eigenem Herkunfts-/Hashmanifest. Andere Profile und früher verwendete Adressen, insbesondere Port 5173, sind nicht nachgewiesen. Kein Import in den Benutzerbrowser durchgeführt.

### Wiederherstellen

1. Den Sicherungsordner erhalten und `workspace/` vollständig in einen **neuen, noch nicht existierenden Ordner** kopieren, einschließlich versteckter Dateien. Die aktuelle Arbeitskopie nicht überschreiben.
2. Jede wiederhergestellte Datei anhand ihres relativen Pfads gegen `files.json` auf SHA-256 und Vollständigkeit prüfen. HEAD, Branch und `git --no-optional-locks status --porcelain=v1 --untracked-files=all` mit `manifest.json` vergleichen. Interne Codex-Refs im weiterverwendeten Original können nach dem Sicherungszeitpunkt wechseln; maßgeblich ist der gesicherte Stand.
3. Anwendung erst bei einem später autorisierten Betriebstest starten. Vor Portnutzung prüfen, ob bereits eine Instanz läuft. Die vorhandenen Startskripte nicht automatisch ausführen; die Desktop-Verknüpfung verweist gegebenenfalls weiterhin auf den ursprünglichen Pfad.
4. Lernstand im gewünschten Browser-/Adresskontext unter „Mein Lernbereich“ importieren. Vorher dessen vorhandenen Stand exportieren: Der Import ergänzt Daten, er ersetzt sie nicht. Ein exakter Wiederherstellungsnachweis benötigt einen leeren, gesonderten Browserkontext.

Eine zweite Sicherung auf einem getrennten Datenträger ist noch nicht erstellt. Die zwei Ordnerkopien auf demselben Datenträger belegen Wiederherstellbarkeit von Dateien, schützen aber nicht vor dessen Ausfall. Bei späteren Browserexporten zusätzliche Herkunft und Prüfsumme dokumentieren.

## Abgrenzung und Prüfung

README und beide unversionierten Startskripte wurden unverändert mitgesichert. Sie gehören ebenso wie PR #4 nicht zur Pflegefalländerung. Der ursprüngliche Umsetzungsauftrag umfasste keine Branches, Commits oder Roadmap-Neuausrichtung. Der anschließende Konsolidierungsauftrag vom 28.09.2026 ergänzt einen eigenen lokalen Git-Stand und eine separat versionierte Roadmap-Aktualisierung; Merge, Push und Release-Tag bleiben ausgeschlossen.

Die Regressionen in [tests/care-cases.spec.ts](../tests/care-cases.spec.ts) prüfen Referenzen, feste Quellenbelege, getrennte Zustände, unveränderte Artikelgrenzen und den sichtbaren direkten Beleg am Bedienweg. Build und Tests sind technische Prüfungen des Centers, keine fachliche Freigabe oder praktische iPPM-Erprobung.

Prüfung am 28.09.2026: `npm.cmd run build` erfolgreich; `npm.cmd test` mit 94 bestandenen Prüfungen (Desktop und Mobilansicht). Der erste Teststart scheiterte sandboxbedingt mit `spawn EPERM`; der anschließende Lauf außerhalb der Sandbox bestand. Ein separater Vergleich mit der Rückfallsicherung bestätigt den unveränderten bisherigen Definitionsquelltext abzüglich der beiden ausdrücklich ergänzten Metadatenblöcke sowie identische Hashes für 18 unberührte Dateien einschließlich sämtlicher Originalquellen, README, Startskripte, Katalog, Abdeckung, Readiness und Roadmap.
