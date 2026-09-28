# Pflegefall Project Purpose / WBS

Stand: 28.09.2026 · Redaktionell umgesetzt · Belegabgleich offen · Center v0.7.1.

## Redaktionelle Entscheidung

Der Auftraggeber hat das zuvor im Chat vorgelegte Änderungsdossier ausdrücklich zur Umsetzung freigegeben, mit folgenden Präzisierungen:

> Gemeldete Umsetzungen und Prüfungen bleiben ausdrücklich als solche gekennzeichnet, solange die referenzierten Nachweise nicht vorliegen.
>
> Der 28.09.2026 ist das Eingangsdatum, kein automatisch bestätigtes Durchführungs- oder Freigabedatum.
>
> Project Purpose wird gezielt aktualisiert. Alle anderen offenen Konfigurationspunkte und WBS-Einschränkungen bleiben erhalten.

Der aktuelle Auftrag umfasst Quelle N28, Register, direkte Fachtexte/Belege, Regressionen, Abschlussdokumentation und einen lokalen Commit ausschließlich dieser Änderungen. Keine automatische Änderung von Prüftreffern, keine neue Oberfläche, kein Merge, Push oder Release-Tag. PR #4, README und beide Startskripte bleiben unverändert. Diese Entscheidung ist redaktionell, keine fachliche Bestätigung der Meldungen und keine praktische Prüfung.

## Eingang und Nachweisstand

[N28](../sources/Erkenntnisse_ProjectPurpose_WBS_2026-09-28.md) sichert die drei Aussagen der Auftraggebermeldung. Der 28.09.2026 bezeichnet ihren Eingang; Durchführungs-, Prüf- und Freigabedaten sind unbekannt. Release/Build und Zielumgebung sind unbekannt. Es wurden keine eigenen iPPM-Beobachtungen oder Systemtests durchgeführt.

| Aussage | Historischer Bezug | Stand und offene Nachweise |
| --- | --- | --- |
| Entfernung von Project Purpose, Daten/Formulare unbeeinträchtigt | TTT-D-20, Zeile 21; C23 Punkt 4 bestätigte die Entscheidung, Umsetzung damals offen | Umsetzung und Zielprüfung gemeldet. PDP-/Teilprojekttypumfang einschließlich Bestandsprojekten und Prüfprotokoll mit Datum, Prüfer und Daten-/Formularvergleich fehlen. Keine Übertragung auf alle Projekttypen. |
| WBS-Fehler reproduziert, Korrektur dokumentiert, Regression erfolgreich | TTT-D-30, Zeile 31; C23 Punkt 9 behandelte den Fehler bereits als erledigt | Nachweise gemeldet. Fehler-/Ticketbezug zum EXU.SRR-Befund, Reproduktion, Korrekturversion und Regressionsergebnisse fehlen. Kein neuer aktiver Fehler und keine erneute Schließung. |
| Vollständige erzeugte WBS-Struktur mit dokumentierter Freigabe | TTT-D-31, Zeile 32; C23 Punkt 9 behandelte den Segmentfehler bereits als erledigt | Struktur und Freigabe gemeldet. Strukturartefakt, Sollvergleich einschließlich Segmentstruktur sowie Freigabedokument mit Gegenstand, Version, Datum und zuständiger Person fehlen. |

Das [Register](../src/data/care-cases.ts) hält `care-project-purpose-wbs-2026-09-28` als `new-insight`. Alle drei neuen Claims bleiben `unconfirmed`, `confirmedOn: null`, `practicalEvidence: []`. Dies präzisiert den ursprünglichen Dossiervorschlag, der `documented-confirmation` allein auf die Auftraggebermeldung beziehen wollte: Die vorhandenen Felder werden nicht mit einem bloßen Eingangsdatum als fachlichem Bestätigungsdatum belegt. Die redaktionelle Entscheidung steht separat auf `accepted`; die Umsetzung dokumentiert nur die Center-Änderung. Der fachliche Belegabgleich ist nicht abgeschlossen.

## Auswirkungen und übernommener Umfang

- `src/data/sources.ts`: neue Quelle N28 mit tatsächlichem SHA-256; frühere Quellen unverändert.
- `src/data/care-cases.ts`: drei Claims, feste Quellenbelege, Ausgangsrevisionen/Dateihashes, direkte Auswirkungen, Prüftreffer, historische Bezüge und getrennte Entscheidung/Umsetzung.
- `src/data/definition-content.ts`: ausschließlich Project-Purpose-Aktionen in `procedure-system-scope` und `procedure-ils-scope`, Erläuterung und direkte N28-Belege. `guide-subproject-definition` von Revision 2 auf 3; Revisionen 1/2 samt Snapshots unverändert, weiterhin `source-draft`, `reviews: []`. Fachinformationen zu Scope, Base Products, Lieferlisten und SSO erhalten.
- `src/data/definition-catalog.ts`: nur Project-Purpose-Anteil von `issue-definition-configuration` und dessen Beleg ergänzt. EDC, Bestands-Sites, Objectives und Initialstatus bleiben offen; keine neue generelle technische Bewertung.
- `docs/open-points-readiness.md` und `docs/ROADMAP.md`: datierte Fortschreibung mit Meldungscharakter; historische Klärungen vom 23.09. erhalten. WBS-Nachweise nur als gemeldet ergänzt.
- `tests/clarifications.spec.ts`, `tests/care-cases.spec.ts` und `tests/knowledge-data.spec.ts`: gezielte Status-, Quellen-, Revisions- und UI-Regressionen. Die frühere Teilprojektrevision 2 wird weiter als historische Revision geprüft. Direkte Artikelbelege müssen im aktuellen Revisionssnapshot stehen. Zusätzliche Belege gemeinsam verknüpfter Issues dürfen bei unveränderten Prüftreffer-Artikeln nur über einen angenommenen, umgesetzten Pflegefall mit passendem Issue, Claim und Quellenhash hinzukommen. So erzwingt der bestehende Laufzeit-Belegaggregator keine Änderung historischer Snapshots.

Direkte Schrittbezüge sind `step-2-9` und `step-2-13`; SB1-Abdeckung bleibt abgeleitet. `guide-save-publish-checkin`, `guide-phases-tailoring` und `issue-phases-tailoring-boundary` enthalten direkte WBS-Bezüge, deren Einschränkungen unverändert gelten. Es entsteht keine WBS-Anleitung oder neue Schulungsfreigabe.

Bloße Prüftreffer bleiben unverändert: Übernahme-, Stammdaten-, Ziele- und Organisationsartikel, weitere Teilprojekt-Bedienwege, Schritte 1.2/2.1/2.3/2.4/2.8/2.10/2.12/2.14 sowie WBS-Feldprüfungen der externen und Liefermeilensteine. Das gemeinsame Konfigurations-Issue wird dort weiter aus demselben Modell angezeigt; keine eigenständige Artikelrevision oder fachliche Aufwertung. Historische F-/K-Befunde (FS-17/19/20; P08/P09), Abschlussberichte und der frühere EDC-Pflegefall bleiben erhalten. ProjectLink, MagicDraw-Validierung, WBS-Typ-Mapping und Hard Links werden durch N28 nicht freigegeben.

## Baseline und Rückfall

Ausgangspunkt: `6388fc362781635a3df48eff47e16384740de3d0` auf `chore/start-date-edc-konsolidierung`. PR-#4-Basisbranch `fix/manual-review-without-demo` bleibt bei `66a5c208e8c6afc641a374748dffb06262273231`. Teilprojektartikel: Revision 2; Projektstammdaten: Revision 3. Die tatsächlichen Ausgangshashes der neun bestehenden Änderungsdateien stehen im Register.

Vor der Änderung wurden alle 78 versionierten Dateien sowie beide unversionierten Startskripte nach `C:\Users\julie\AppData\Local\Temp\ippm-n28-baseline-20b7d693523c4fc0afd5e875d2ae288e` kopiert. `manifest.json` enthält HEAD und SHA-256 aller 80 Dateien; jede Kopie wurde gegen das Original geprüft. Die Sicherung enthält den vorhandenen README-Arbeitsstand, aber weder `.git` noch Abhängigkeiten oder Browserdaten. Sie ist eine temporäre Dateisicherung; die umfassende frühere Sicherung bleibt im [EDC-Dossier](pflegefall-start-date-edc.md#rückfallsicherung-vor-der-änderung) beschrieben.

Rückfall: Den Baseline-Commit in eine getrennte Arbeitskopie übernehmen, bei Bedarf die gesicherten Arbeitsdateien anhand des Manifests ergänzen und Hashes vergleichen. Den aktuellen Workspace nicht pauschal zurücksetzen oder fremde Änderungen überschreiben. Nach dem Commit ist alternativ eine gezielte Gegenänderung ausschließlich dieses Pflegefalls möglich; neue Dateien und Artikelrevision dabei gemeinsam behandeln. Ein Rückfall wurde jetzt nicht ausgeführt. Lokaler Lernstand und Persistenz wurden nicht geändert.

## Technischer Abschluss

Prüfung am 28.09.2026: `npm.cmd run build` erfolgreich; `npm.cmd test` mit **98 bestandenen Prüfungen** in Desktop- und Mobilansicht. Der erste Testlauf zeigte die bisherige Gleichsetzung von aktuellen Issue-Belegen und Artikel-Snapshots sowie eine zu korrigierende Text-Erwartung; beide Regressionen sind im endgültigen Lauf behoben. Nach `spawn EPERM` beim Sandbox-Build liefen Build und Tests außerhalb der Sandbox. Formatprüfung aller geänderten TypeScript-Dateien und `git diff --check` ohne Befund.

Der SHA-256-Abgleich bestätigt 71 unveränderte Bestandsdateien, darunter README, beide Startskripte, sämtliche früheren Originalquellen, WBS-Artikel, Darstellung, Suche und Persistenz. Nur die neun im Register bezeichneten Bestandsdateien wurden verändert; neu sind N28 und dieses Dossier. Der lokale PR-#4-Basisbranch bleibt unverändert. Der Commit enthält ausschließlich diese elf Pflegefalldateien; die vorhandene README-Änderung und die unversionierten Startskripte bleiben außerhalb des Commits. Kein Merge, Push, Release-Tag oder Remote-Abgleich.

Die redaktionelle Umsetzung ist abgeschlossen. Automatisierte Center-Tests belegen keine praktische iPPM-Prüfung oder fachliche Freigabe. Nachweisunterlagen und genaue Gültigkeitsreichweite bleiben offen; der Fall ist fachlich nicht abgeschlossen.
