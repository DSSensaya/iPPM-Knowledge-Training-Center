# Entwicklungsabschluss Start Date / EDC

Stand: 28.09.2026 · Technisch konsolidiert · Center-Version weiterhin v0.7.1.

## Gesicherter Stand

Der Pflegefall ist im lokalen Commit `0811e69` auf `chore/start-date-edc-konsolidierung` abgeschlossen: Register, Änderungsdossier, direkte Belegzuordnung und Regressionen. Der Projektstammdatenartikel hat Revision 3; Fachtexte und Status `source-draft` bleiben erhalten. Praktische iPPM-Erprobung, genaue Release-/Umgebungsreichweite und zusätzliche EDC-Feldbereitstellung bleiben offen. Details und frühere Rückfallsicherung stehen im [Änderungsdossier](pflegefall-start-date-edc.md).

Die Architekturprüfung ergibt keinen Anpassungsbedarf: Das Register verwendet `EvidenceRef` und bestehende Quellen-/Ziel-IDs unter `src/data/`. Es dokumentiert redaktionelle Entscheidungen, ohne einen zweiten Artikelkatalog oder automatische Freigaben einzuführen. Die Belegergänzung folgt dem vorhandenen Verfahren für Inhaltsrevisionen und erhält ältere Quellensnapshots. Darstellung, Suchlogik, abgeleitete SB1-Abdeckung und versionierte lokale Persistenz bleiben getrennt und unverändert. Eine Migration ist nicht erforderlich.

## Git-Abgrenzung

Ausgangspunkt ist `66a5c208e8c6afc641a374748dffb06262273231` auf `fix/manual-review-without-demo` (bestehender PR-#4-Arbeitsstand). Der neue lokale Branch baut darauf auf; PR #4 bleibt damit eine Basisabhängigkeit. Sein Branchzeiger bleibt unverändert. Die Pflegefalländerung ist separat mit `git show 0811e69` prüfbar. Roadmap und dieser Abschluss werden in einem zweiten Dokumentationscommit gesichert.

Die bereits vorhandene README-Änderung sowie `scripts/open-center.ps1` und `scripts/install-shortcut.ps1` bleiben außerhalb beider Commits im Arbeitsverzeichnis erhalten. SHA-256 zum Abgleich vor und nach der Konsolidierung:

| Datei                          | SHA-256                                                            |
| ------------------------------ | ------------------------------------------------------------------ |
| `README.md`                    | `8E1B4DD756A143ACBCB130A51813D8F850D1BDAEBB4210B7A6A284365C60644D` |
| `scripts/open-center.ps1`      | `4739118B7E5241E25F534A9CE92ABF21C030A2D19DDEC1FA52983A5A5E21032B` |
| `scripts/install-shortcut.ps1` | `4BC32483F4329B4B7022B040744ED5DBD97BB23AB6F24DD898E047C4E4B3B528` |

Kein Merge, Push, Release-Tag oder Remote-Abgleich. Der Arbeitsbaum bleibt wegen der drei bewusst ausgenommenen Dateien unbereinigt.

## Prüfung und nächste Ausbaustufe

Erneute Prüfung für diese Konsolidierung: `npm.cmd run build` erfolgreich; `npm.cmd test` mit **94 bestandenen Prüfungen** in Desktop- und Mobilansicht. Der erste Teststart wurde mit `spawn EPERM` durch die Sandbox blockiert; der anschließende Lauf außerhalb der Sandbox bestand vollständig. `git diff --check` ohne Befund. Die Tests prüfen unter anderem Quellenhashes, Referenzen, Zustandsgrenzen und die sichtbare Belegzuordnung. Sie begründen keine fachliche Freigabe.

Die [Roadmap](ROADMAP.md) priorisiert die persönliche, lokal verfügbare Wissensbasis mit kontrollierter kontinuierlicher Pflege bis iPPM Release 4b. Nächster Schritt ist die Erprobung des dokumentierten Pflegeablaufs an einer tatsächlich neu vorliegenden Erkenntnis oder Quellenänderung: Eingang und Beleg, Auswirkungsprüfung, konkrete Entscheidung, revisionierte Übernahme oder begründete Zurückstellung sowie Rückfallmöglichkeit. Dieser Abschluss fügt keine neuen Fachinhalte hinzu.
