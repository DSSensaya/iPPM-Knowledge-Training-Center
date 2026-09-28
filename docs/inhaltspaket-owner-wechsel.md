# Owner-Wechsel als persönliches Inhaltspaket

Stand: 29.09.2026 · source-draft · Artikelrevision 4 · Ziel: R1 / SB1

## Entscheidung und Nutzen

Der Auftrag vom 29.09.2026 erlaubt ausdrücklich ein zusammenhängendes Inhaltspaket. Dafür wird der ausreichend belegte Bestand zum Owner-Wechsel konsolidiert. Er benötigt keine neuen Bedienwege, Artikeltypen oder Persistenzmodelle. Die Aufgabe ist von der Übergabesituation bis zur Ergebniskontrolle beschrieben und auch ohne Schulungssystem als Leseübung nutzbar.

Ausgangsstand: `858ab7a`, Artikel `guide-project-permissions` Revision 3. Übernommen werden Use Case, didaktische Hinweise mit Lernkontrolle, sichtbare Release-Grenzen und eine ausdrücklich unverbindliche Arbeitsplatz-Empfehlung. Die einzige bestehende Prozedur `procedure-owner-change` ist der Quick Guide. Das vorhandene Trainerpaket mit den fiktiven TM-/ILSM-Varianten bleibt erhalten; kein zweiter Ablauf wird angelegt. `faq-role-vs-access` bleibt auf Revision 2; die Speicher-/Check-in-Anleitung bleibt verknüpft. Keine IDs werden geändert.

## Gelesene Belege und ihre Reichweite

| Quelle                                 | Fundstelle und Verwendung                                                                                                                              | Grenze                                                                                                                     |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| B · SB1-Handbuch                       | §3.6.7 „Teilprojektleiter einsetzen“: Bereitstellung, PM-Eigenrechte, System-/ILS-Variante, Speichern, Check-in, Information, Subprojects und Ergebnis | Handbuchentwurf; Dokumentdatum und genaue Release-Version unbekannt; keine Freigabe dieser Zusammenfassung                 |
| F · R1-Funktionsmatrix, 18.09.2026     | R1 Funktionsmatrix!A13:J13, FS-08: begrenzt geübter Owner-Weg; A11:J11, FS-06: Grenzen von Project Permissions                                         | R1-Zuordnung und Quellenbewertung; genauer Systemstand und TTT-Originalnachweise fehlen; keine vollständige Rechtefreigabe |
| C23 · Bestätigte Klärungen, 23.09.2026 | Punkt 10: erst Eigen-/Lesezugriff sichern, dann Owner wechseln; Punkt 3: Build Team in SB1, Rechtewirkung separat offen                                | Datierte Bestätigung nur der benannten Aussagen; keine pauschale Abnahme                                                   |
| TTT · Restpunkte, 23.09.2026           | Vorhandene Markdown-Transkription, TTT-D-17 / Zeile 18, zum Reihenfolgeabgleich                                                                        | Originalstatus „Erledigt“ wird nicht auf andere Rechtefragen übertragen                                                    |

Die Originaldateien bleiben unverändert. Revision 4 führt die vorhandenen SHA-256-Quellenschnappschüsse fort; sie ersetzt keine historischen Revisionen. Die weiterhin verknüpften Scope-, Konfigurations- und Schulungsbelege behalten ihren begrenzten Kontext. Es werden keine neuen Aussagen aus ihnen abgeleitet.

## Im Center prüfen

- Einstieg über die vorhandene Startseitenaufgabe oder Suche nach „Owner-Wechsel“, „Use Case Owner“, „Übung ohne System“ bzw. „Arbeitsplatz-Tipp“.
- Im bestehenden Artikel: Quick Guide, Use Case, Gültigkeit, Schulungsplanung, Leseübung, Musterantwort und Empfehlung lesen; Trainerpaket für TM und ILSM öffnen.
- PM-Eigenzugriff, Zielkonto und Subprojects getrennt beurteilen; Lesen verändert keinen fachlichen Nachweis und keinen Übungsstatus.
- Desktop und Mobil: Suche, Abschnittsnavigation per Tastatur, Quellen, Lesbarkeit ohne horizontalen Überlauf und bestehende Merkliste prüfen.

## Offene fachliche Grenzen

Der konkret geübte Weg ist für den begrenzten R1-/TTT-Kontext bewertet. Die genaue Zielumgebung, vollständige Rechte-Matrix, reguläre Konten, Bestands-Sites, Rücksetzung und praktische Materialerprobung bleiben offen. Für fehlenden Zugriff wird kein Reparaturweg erfunden. Eine Übertragung auf R1B bis R4b oder eine fachliche Freigabe des Pakets ist nicht belegt. Fiktive Übungsdaten und didaktische Empfehlungen sind sichtbar getrennt von den quellenbasierten Systemhandlungen.

## Technische Prüfung am 29.09.2026

`npm.cmd run build` und der Gesamtlauf `npm.cmd test` bestehen (106 Prüfungen auf Desktop und Mobil). Der zusätzliche Pakettest prüft Suchzugänge, Tastaturfokus der Abschnitte, sichtbare Gültigkeitsgrenzen, Trainerpaket, Quellen und Merkliste; die abschließenden Desktop-/Mobil-Aufnahmen wurden visuell auf Lesbarkeit geprüft. Die automatisierte Accessibility-Prüfung meldet keine Verstöße in ihrem geprüften Umfang. Ein im Ausgangsbestand beobachteter Fehler bei unmittelbar aufeinanderfolgender Suche und Filterwahl wurde separat mit Regressionstest korrigiert. Diese Prüfungen betreffen das Center und sind keine praktische iPPM-Erprobung oder fachliche Freigabe.
