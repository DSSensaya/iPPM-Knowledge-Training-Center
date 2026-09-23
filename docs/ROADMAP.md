# Produkt-Roadmap bis v1.0

Stand: 23.09.2026 · v0.7.0 technisch abgeschlossen mit begrenztem Umfang; fachliche und praktische Erprobung offen · Aktuelle Produktstrategie

Diese Roadmap steuert Prioritäten und Umfang der Weiterentwicklung. Sie erteilt keine fachliche Freigabe für iPPM-Bedienwege und ersetzt keine Prüfung der Zielumgebung. Entwicklungsstufen werden nach den folgenden Ergebniskriterien abgeschlossen, nicht nach festen Terminen oder Beitragszahlen.

## Produktziel für v1.0

Das iPPM Knowledge & Training Center wird eine verlässliche, vollständig lokal nutzbare SB1-Arbeitshilfe mit passenden Schulungsmaterialien. Anwender finden zu ihrer Aufgabe und Rolle verständliche Anleitungen, Voraussetzungen, Ergebnisprüfungen und relevante Einschränkungen. Trainer können abgegrenzte Übungen anhand nachvollziehbarer Materialien vorbereiten und durchführen.

v1.0 bietet vollständige Orientierung über SB1 und belastbare Anleitungen für einen ausdrücklich definierten Kernumfang. Vollständige operative SB1-Schulungsfähigkeit darf erst beansprucht werden, wenn alle dafür erforderlichen Wege geprüft sind. Vollständige R1-/R1B-Abdeckung und ein Lernmanagementsystem gehören nicht zum Produktversprechen.

## Ausgangslage nach v0.4

- Zwei quellenbasierte Durchstiche: Team/Zugriff einschließlich Owner-Wechsel sowie Liefergegenstände und Liefer-/Zahlungsmeilensteine.
- Vier Quellenentwürfe neben neun Demo-Beiträgen; acht von 24 Schritten der Schulungsmatrix sind redaktionell angebunden. Das ist kein Nachweis entsprechender Schulungsreife.
- Drei bestehende Lernpfade sind weiterhin Demo-Pfade. Trainerhinweise sind vorhanden, eine praktische Schulungserprobung ist nicht nachgewiesen.
- Die lokale technische Basis, stabile IDs, getrennte Daten-/Suchlogik und sichtbare Speicherfehlerbehandlung tragen. Der nächste Engpass liegt in Nutzerführung, redaktioneller Pflege und fachlicher Validierung.

## Strategische Prinzipien

1. **Aufgaben und Ergebnisse priorisieren.** Inhalte entlang zusammenhängender Arbeitsaufgaben entwickeln; weder Dokumentkapitel noch eine feste Quote aus Anleitung und FAQ geben den Produktzuschnitt vor.
2. **Belege und Geltungsbereich erhalten.** Scope, technischer Nachweis, Bedienbeschreibung, Schulungszuordnung und redaktioneller Prüfstatus bleiben getrennt. Quellenkonflikte werden sichtbar begrenzt und nicht automatisch aufgelöst.
3. **Anwendung erleichtern.** Aufgabe, unmittelbare Antwort und entscheidende Einschränkungen stehen vor ausführlichen Nachweisen. Demo-Inhalte bleiben eindeutig unterscheidbar; reale Rollen und Aufgaben bestimmen den Einstieg.
4. **Einfach und lokal bleiben.** Die statische Architektur weiterverwenden. Modell und Infrastruktur nur erweitern, wenn ein konkreter Inhalt oder Arbeitsablauf dies erfordert.
5. **Pflege vor Inhaltsmenge absichern.** Quellenfassungen, Fundstellen, Inhaltsrevisionen und Prüfbelege nachvollziehbar halten. Änderungen müssen betroffene Inhalte und Einschränkungen auffindbar machen.
6. **Kontinuität sichern.** Bestehende IDs, Links und Sicherungen erhalten oder ausdrücklich migrieren. Lesen, Selbstkontrolle und praktische Übung unterscheiden; Demo-Abschlüsse erledigen keine neuen Fachmodule.
7. **Mit Anwendern und Trainern prüfen.** Automatisierte Tests sichern das Center ab; sie ersetzen weder fachliche Quellenprüfung noch praktische Tests im geeigneten iPPM-Kontext.

## Entwicklungsstufen

### v0.5 – Vorhandene SB1-Aufgaben zuverlässig finden, anwenden und üben

**Ziel und Nutzwert:** Die beiden vorhandenen Fachpakete werden im Alltag verständlich nutzbar und bilden eine erprobte Vorlage für weitere Inhalte. Nach zwei Durchstichen hat ihre Konsolidierung Vorrang vor einem dritten großen Fachbereich.

**Umfang:**

- Aufgabenorientierter Einstieg, verständliche Rollenführung und gesondert erreichbarer Demo-Bestand.
- Kürzere Wege zur Antwort beziehungsweise zum Bedienweg; frühe Sprungnavigation, sichtbare kritische Hinweise und nachgeordnete Quellen-/Trainerdetails.
- Kleine redaktionelle Absicherung: explizite Inhaltszustände, tatsächliche Quellenpfade, revisionsfeste Belege und konsistente Zuordnung relevanter Einschränkungen.
- Gemeinsame Querschnittsanleitung zu Speichern, Veröffentlichen und Einchecken mit Ergebnisprüfung.
- Ein erprobbares Trainerpaket zum Owner-Wechsel: fiktives Szenario, Vorbereitung, beteiligte Konten und erwartete Ergebnisse.
- Einfache Abdeckungsliste aller 24 SB1-Matrixschritte mit Material, Lücken und Konflikten. Zusätzliche Handbuchthemen wie Reviewstatus und Fortschritt gesondert zuordnen.

**Begrenzung:** Kein neuer großer Fachbereich, kein neues Lernsystem, kein Abdeckungsdashboard und keine pauschale Rechtefreigabe.

**Technischer Abschluss v0.5.0:** Die zwei Fachpakete, der kontextbezogene Speicher-/Veröffentlichungsartikel, das vorbereitbare Owner-Wechsel-Trainerpaket und die 24er-Abdeckung sind umgesetzt und automatisiert geprüft. Die praktische Nutzer-/Trainererprobung und Zielumgebungsprüfung sind nicht erfolgt; die entsprechende Übergangsbedingung zu v0.6 bleibt offen. Einzelheiten stehen im [v0.5-Abschluss](v0.5-abschluss.md).

**Übergang zu v0.6:** Anwender finden die beiden Aufgaben ohne zusätzliche Erklärung und verstehen ihre Grenzen. Ein Trainer kann die ausgewählte Übung vorbereiten; ein praktischer Durchlauf ist ausgewertet. Die Inhaltsvorlage funktioniert für beide Themen, Quellenänderungen bleiben beherrschbar, alte Links und Sicherungen funktionieren und Build/Tests bestehen. Ohne geeignete Schulungsumgebung bleibt die praktische Erprobung offen, auch wenn die Softwarefassung fertig ist.

### v0.6 – Projekt- und Teilprojektdefinition verbreitern

**Ziel und Nutzwert:** PM, TM und ILSM erhalten zusammenhängende Unterstützung für die Projektdefinition statt einzelner isolierter Antworten.

**Umfang:** Stammdaten mit Startdatum-/EDC-Abgrenzung, Ziele und Organisation ergänzen; Unterschiede der System- und ILS-Teilprojekte erklären. Orientierung zu Beantragung, Bereitstellung und Übernahme anbieten. Eine ausführbare PMO-Anleitung setzt einen vollständig geprüften Bereitstellungsdurchlauf voraus.

**Begrenzung:** Keine behauptete automatische Terminübernahme, keine generelle Rechtefreigabe und kein ungetesteter PMO-Gesamtweg.

**Technischer Abschluss v0.6.0:** Fünf zusätzliche Quellenentwürfe zu Übernahme/Initialisierungsorientierung, Stammdaten, Zielen, Organisation und System-/ILS-Definition sind umgesetzt. Die SB1-Abdeckung umfasst 17 Schritte mit realem Teilmaterial, zwei mit Orientierung ohne Gesamtbedienweg und fünf mit Quellenhinweisen. Bestehende IDs, Links und v1-Persistenz bleiben erhalten. Der Ausbau erfolgte auf ausdrücklichen Auftrag trotz weiterhin offener praktischer v0.5-Übergangsbedingung. EDC-/Terminwirkung, finale Rollen-/Feldkonfiguration, vollständiger PMO-Durchlauf und Nutzer-/Trainerpilot bleiben offen; keine fachliche Freigabe. Einzelheiten stehen im [v0.6-Abschluss](v0.6-abschluss.md).

**Übergang zu v0.7:** Neue Aufgaben lassen sich überwiegend durch Daten und Inhalte ergänzen. Rollenunterschiede, Voraussetzungen und erwartete Ergebnisse sind geprüft; wiederkehrende Bedienwege werden konsistent wiederverwendet.

### v0.7 – SB1-Planung und Steuerung ergänzen

**Ziel und Nutzwert:** Von einer vollständiger gepflegten Projektdefinition zu nachvollziehbarer Planung, Statuspflege und Entscheidungsinformation gelangen.

**Umfang:** Weitere externe Meilensteine, Phasen und Tailoring ergänzen; anschließend Status, R1-Basisreporting und abgegrenzte Eskalation erschließen. Die Reihenfolge richtet sich nach Quellenlage und verfügbaren Systemnachweisen.

**Begrenzung:** Ungeklärte LCM-/Review-Regeln nicht verbindlich machen. Statusfelder und Ansichtsfilter vor praktischer Nutzung prüfen. R1-Basisreporting von Power BI trennen; Eskalationserfassung nicht als nachgewiesene vollständige Empfängerbearbeitung darstellen.

**Technischer Abschluss v0.7.0:** Die Schritte 3.3, 3.4, 4.9, 4.12 und 4.13 sind nach Abgleich der lokalen Originalquellen behandelt. Drei begrenzte Bedienentwürfe ergänzen externe Meilensteine, separat vorgegebenes Tailoring und Eskalationserfassung; Statuspflege und R1-Basisreporting erhalten Orientierung mit Prüfaufträgen. Die SB1-Abdeckung umfasst 20 Schritte mit realem Teilmaterial und vier mit Orientierung. LCM-Frequenz/Terminregeln, Empfängerbearbeitung, ungeprüfte Status-/Filterwirkungen und Reporting-PDP/Power BI sind ausdrücklich aus dem vorgesehenen Pilotumfang ausgeschlossen, nicht fachlich geklärt. IDs, Links und v1-Persistenz bleiben erhalten; Build und vollständige Tests bestehen. Fachliche Freigabe und praktische Nutzer-/Trainererprobung fehlen weiterhin. Kriterien, Belege und Umfangsgrenzen stehen im [v0.7-Abschluss](v0.7-abschluss.md).

**Übergang zu v0.9:** Jeder SB1-Schritt hat eine nachvollziehbare Behandlung: nutzbares Material, klarer Teilumfang oder begründete Lücke. Kritische Konflikte für den vorgesehenen Pilotumfang sind geklärt oder durch eine ausdrückliche Umfangsbegrenzung ausgeschlossen.

### v0.9 – Zusammenhängenden Pilot und Betrieb erproben

**Ziel und Nutzwert:** Nachweisen, dass Anwender und Trainer das Center zusammenhängend nutzen können und dass Inhalte sowie lokale Auslieferung dauerhaft pflegbar sind.

**Umfang:** Repräsentative PM-, TM-/ILSM- und Traineraufgaben erproben; PMO-Anlage gesondert prüfen, falls enthalten. Fachliche Prüfung mit Inhaltsrevision, Datum, Gegenstand und Umgebung dokumentieren. Lokalen Start, feste Adresse/Port, Aktualisierung, Rückkehr zur Vorversion und Sicherungsübernahme erproben. Pflegezuständigkeiten tatsächlich benennen und einen einfachen Änderungsablauf festlegen.

**Begrenzung:** Funktionsumfang einfrieren; nur für Pilot und Veröffentlichung notwendige Korrekturen vornehmen. Keine Erweiterung zum vollständigen R1-Produkt.

**Übergang zu v1.0:** Repräsentative Aufgaben werden erfolgreich bearbeitet, kritische Inhaltsfehler sind behoben und Betrieb sowie Pflege funktionieren. Automatisierte Prüfungen bestehen; manuelle Tastatur-, Zoom-, Screenreader- und Druckprüfungen sind für den veröffentlichten Umfang durchgeführt. Notwendige Fortschrittsmigrationen sind getestet.

### v1.0 – Verlässlichen SB1-Kernumfang veröffentlichen

**Ziel und Nutzwert:** Eine im Alltag nutzbare und nachvollziehbar gepflegte Wissens- und Schulungshilfe mit klaren Grenzen bereitstellen.

**Veröffentlichungskriterien:** Produktumfang und offene Lücken sind eindeutig ausgewiesen. Fachliche Prüfbelege und reale Pflegezuständigkeiten liegen vor. Quellen- und Inhaltsstände sind nachvollziehbar; lokale Auslieferung, Aktualisierung und Sicherungen funktionieren. Demo-Inhalte sind eindeutig getrennt, und Lernanzeigen behaupten keine nicht erbrachten Übungs- oder Schulungsnachweise.

**Begrenzung und weiterer Ausbau:** Keine pauschale Vollständigkeits- oder Systemfreigabe. Weitere Themen erst nach belegtem Anwendernutzen, ausreichenden Fachnachweisen und gesicherter Pflegekapazität priorisieren.

## Entscheidung über breitere SB1-Integration

Die breite Integration beginnt nach v0.5, sobald eine gemeinsame Inhaltsvorlage für beide Durchstiche funktioniert, Quellenänderungen und Einschränkungen zuverlässig behandelt werden und ein kleiner Nutzungs-/Schulungspilot den Nutzen bestätigt. Weitere Durchstiche sind nur sinnvoll, wenn sie eine neue Modellierungsfrage prüfen. Vollständige Orientierung kann vor vollständiger ausführbarer Schulungsabdeckung entstehen; beides muss unterscheidbar bleiben.

## Bewusst zurückgestellte Themen

- Vollimport des Handbuchs, sämtlicher Konfigurationsfelder oder aller R1-/R1B-Positionen.
- KI-Chat, semantische Suche und automatische fachliche Konfliktauflösung.
- Backend, Konten, Mehrbenutzerbetrieb, CMS, generischer Wissensgraph und Workflow-Editor.
- Zertifikate, Teilnehmerverwaltung, Ranglisten und Trainerstatistiken.
- Interaktive Nachbildungen von Project Server, ProjectLink oder Berechtigungswirkungen.
- WBS-Generator, Roll-up/Roll-down, Power BI, SAP-, Ressourcen- und Portfoliofunktionen als nächste operative Schulungsschwerpunkte.
- Vollständige interaktive Prozessgrafik, bevor Aufgaben, Varianten und belegte Übergänge konsistent sind.

## Grundlagen

- [Inhalts- und Datenmodell v0.3](v0.3-inhalts-und-datenmodell.md)
- [Umsetzung und fachliche Grenzen v0.4](v0.4-umsetzung.md)
- [Technischer Abschluss und offene Prüfungen v0.5](v0.5-abschluss.md)
- [Projekt-/Teilprojektdefinition und offene Prüfungen v0.6](v0.6-abschluss.md)
- [SB1-Planung und Steuerung mit Pilotgrenzen v0.7](v0.7-abschluss.md)
- [Projektübersicht](../README.md), [Projektregeln](../AGENTS.md), [Design-Spezifikation](../DESIGN.md)
- Fachquellen unter `sources/`; Quellenbewertungen bleiben an die jeweilige Fassung und ihren Geltungsbereich gebunden.

## Aktuelle iPPM-Releaseplanung R1B / R2

Die [Releaseplanung und vollständige Scope-Übernahme](ippm-release-2-scope.md) ergänzen den fachlichen Zielrahmen. Das unveränderte Original liegt unter `sources/iPPM_Releaseplanung_Release-2.docx`, die aktuelle Quelle trägt die ID `R2P`; `H` bleibt historisch. Die Übersicht ist im Center über die Suche „Release 2“ erreichbar. Sie ergänzt die fünfzehn SB1-Entwürfe um einen sechzehnten Quellenentwurf zur Release-Orientierung. R1B umfasst Power-BI-Reporting; R2 umfasst Kalkulation, Ressourcen-/Kostenplanung und SAP-Kopplung sowie die in der Quelle bezeichneten Backlog-Themen. Dies ändert weder die SB1-Prioritäten bis v1.0 noch die Trainingsabdeckung. Umsetzung, Freigabe und Termine werden durch diese Planungsquelle nicht belegt.
