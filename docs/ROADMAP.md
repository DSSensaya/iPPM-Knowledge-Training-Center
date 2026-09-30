# Produkt-Roadmap: lokale Wissensbasis bis iPPM Release 4b

Stand: 30.09.2026 · Center v0.8.0 lokal abgeschlossen · Aktuelle Produktstrategie

Diese Roadmap steuert Prioritäten und Umfang der Weiterentwicklung. Sie erteilt keine fachliche Freigabe für iPPM-Bedienwege und ersetzt keine Prüfung der Zielumgebung. Entwicklungsstufen werden nach den folgenden Ergebniskriterien abgeschlossen, nicht nach festen Terminen oder Beitragszahlen.

## Bestätigte Produktvision und aktuelle Priorität

Das Center wird als persönliche, vollständig lokal verfügbare iPPM-Wissensbasis kontinuierlich gepflegt und bis iPPM Release 4b begleitet. Eigene Erkenntnisse, Quellenänderungen und bestätigte Klärungen sollen nachvollziehbar aufgenommen, hinsichtlich ihrer Auswirkungen geprüft und nach einer konkreten Übernahmeentscheidung gezielt eingearbeitet werden. Aufgabenorientiertes Nachschlagen steht im Mittelpunkt; Schulungsunterlagen bleiben eine Nutzung der belegten Wissensbasis.

Center-Versionen v0.x/v1.0 bezeichnen den Entwicklungsstand der Anwendung. iPPM-Releases R1 bis R4b bezeichnen den fachlichen Begleithorizont. Das Ziel bis Release 4b ist keine Zusage vollständiger Inhalte, realisierter Systemfunktionen oder bestätigter Termine. Der vorhandene SB1-Bestand bildet den Ausgangspunkt; die nachfolgenden historischen Abschlüsse bleiben erhalten. Für die nächste Ausbaustufe hat die kontrollierte persönliche Pflege Vorrang vor dem bislang vorgesehenen breiten Trainingspilot.

**Erreichter Stand:** Der [Pflegefall Start Date / EDC](pflegefall-start-date-edc.md) verbindet Aussagen, feste Quellenbelege, betroffene stabile IDs, Ausgangsrevision, Übernahmeentscheidung und Umsetzung. Der Projektstammdatenartikel trägt Revision 3 als reine Belegergänzung. Das Register bleibt redaktionelle Datenhaltung unter `src/data/`; Oberfläche, Suche und v1-Persistenz verwenden weiterhin ihre bestehenden Modelle. Fachstatus und offene Reichweite bleiben erhalten.

**Pflegefortschritt 28.09.2026:** Der [Pflegefall Project Purpose / WBS](pflegefall-project-purpose-wbs.md) übernimmt N28 nach ausdrücklicher redaktioneller Entscheidung. Nur der Teilprojektartikel erhält Revision 3. Umsetzung, Regression und WBS-Freigabe bleiben gemeldet; referenzierte Nachweise, Release und Umgebung fehlen. Der 28.09. ist das Eingangsdatum, kein Systemprüf- oder Freigabedatum. Andere Konfigurationspunkte und WBS-Einschränkungen bleiben erhalten.

**Pflegepriorität nach dem Eingang vom 28.09.2026:** Die offenen Belege und die Reichweite des neuen Pflegefalls abgleichen; weitere tatsächliche Erkenntnisse mit demselben Ablauf bearbeiten. Ursprung, Beleg, Release-/Umgebungsbezug und offene Punkte erfassen; direkte Auswirkungen von bloßen Prüftreffern unterscheiden; Vorschlag gegen die aktuelle Inhaltsrevision prüfen; Entscheidung dokumentieren; ausschließlich betroffene Inhalte samt Revision und Regressionen übernehmen. Eine Beobachtung oder technische Prüfung erhöht keinen fachlichen Bestätigungsstatus. Abschlusskriterium ist ein vom Eingang bis zur Übernahme oder begründeten Zurückstellung nachvollziehbarer Fall mit erhaltener Historie und Rückfallmöglichkeit. Dafür jetzt keine neuen Fachinhalte oder generische Pflegeoberfläche ergänzen.

**Nächste Ausbaustufe nach v0.8.0, Planung vom 30.09.2026:** Wenige belegte Arbeitswege aus dem erschlossenen Bestand weiterentwickeln. Erster Durchstich ist der begrenzte Abgleich der R1-Projektstatusübersicht im bestehenden Reporting-Beitrag; Reviewstatus und System-/ILS-Definition sind vorbereitbar, der WBS-Gesamtweg bleibt blockiert. Pakete, Quellen, Ausschlüsse und Abschlusskriterien stehen in der [v0.9-Planung](v0.9-planung.md). Kontrollierte Pflege und die Prüfung des lokalen Betriebs bleiben verbindlich. Dieser Planungsstand setzt keine neuen Fachinhalte oder Funktionen um.

**Weiterer Horizont bis Release 4b:** Den gleichen Pflegeablauf bei belegtem Bedarf auf kommende iPPM-Stände anwenden. R1B/R2 orientieren sich an der vorhandenen Quelle R2P; spätere Stufen R3/R4a/R4b sind bisher nur historischer Planungsrahmen aus H und benötigen aktuelle Belege vor fachlicher Übernahme. Keine ungeprüfte Übertragung von Bedienwegen zwischen Releases. Umfang und Reihenfolge folgen persönlichem Nutzwert und belastbaren Quellen, nicht einer Vollimport- oder Vollständigkeitsquote.

## Konsolidierter Stand v0.7.1

**Persönliche Nutzung, 29.09.2026:** Auf ausdrücklichen Auftrag wurde der vorhandene Owner-Wechsel zu einem vollständig im Center lesbaren Paket konsolidiert: Quick Guide, Use Case, Schulungs-/Leseübung und Arbeitsplatz-Empfehlung. Bestehender Artikel und Prozedur behalten ihre IDs; kein neuer Fachbereich und keine fachliche Freigabe. Die [Übernahmeentscheidung](inhaltspaket-owner-wechsel.md) dokumentiert Quellen, Revision 4 und offene Reichweite. Die Priorität kontrollierter Pflege bleibt bestehen.

v0.7.1 übernimmt die bestätigten TtT-Klärungen vom 23.09.2026 und erhält stabile IDs, Quellenhistorie, Links und v1-Persistenz. Der konsolidierte Pflegefall ergänzt diesen Entwicklungsstand ohne Versionssprung. Der Pflegeablauf wurde mit N28 bis zur begrenzten redaktionellen Übernahme erprobt; Belegabgleich, fachliche Materialfreigabe und praktische Erprobung bleiben offen.

### Fachlicher Abgleich vom 23.09.2026

Die [bereinigten Open Points](open-points-readiness.md) sind für den aktuellen Restumfang maßgeblich. Die nachfolgenden technischen Abschlussabschnitte dokumentieren ihre damaligen Stände und werden durch diese ausdrücklichen Klärungen aktualisiert:

- Start Date auf Overview und Projektplan synchronisieren gegenseitig; EDC bleibt der unabhängige vertragliche Starttermin. Zusätzliche EDC-Feldbereitstellung separat offen.
- Führende Gesamtprojekt-Lieferliste im Contract Execution Project und Liefermeilensteinverknüpfung sind geklärt; große Listen bleiben ein Darstellungsrestpunkt.
- Build Team gehört zu SB1. FIN-/SAP-Felder, ML-Filter und Projektstatusübersicht sind bestätigt; diese früheren Blocker entfallen.
- LCM-3 ist auditbedingt einmal pro Kalenderjahr erforderlich. Rollierende zwölf Monate sind nur eine unbeschlossene Verbesserung. Weitere LCM-/ProjectLink-Terminwirkungen bleiben offen.
- WWS-/WBS-Generator funktioniert; daraus folgt keine Erweiterung des Center-Schulungsumfangs. Hard Links nicht schulen und nicht nutzen.
- Project Purpose aus Teilprojekt-PDPs entfernen: fachlich entschieden, technische Umsetzung noch offen. Rechte, Bestands-Sites, Performance, Eskalationshistorie/-zugriff und praktische Materialerprobung bleiben zu bearbeiten.

Fortschreibung zu Project Purpose: Die oben dokumentierte offene Umsetzung vom 23.09. wird durch die neue Auftraggebermeldung N28 ergänzt: Entfernung und Zielprüfung ohne Daten-/Formularbeeinträchtigung sind gemeldet, Belegabgleich und genaue Reichweite bleiben offen. Zu TTT-D-30/-31 sind Korrektur, Regression und vollständige WBS-Struktur mit Freigabe ebenfalls gemeldet, die Unterlagen liegen hier nicht vor. Die bereits erfolgte WBS-Klärung wird nicht erneut geschlossen.

Die genannten fachlichen Grenzen bleiben bestehen. Die aktuelle Priorität liegt auf kontrollierter Pflege; die Produktvision erweitert den Begleithorizont, ohne hier neue R1B-Inhalte oder eine Gesamtfreigabe zu erzeugen.

## Produktziel für v1.0

Das iPPM Knowledge & Training Center wird eine verlässliche, persönliche und vollständig lokal nutzbare Wissensbasis mit zunächst einem SB1-Kernumfang und passenden Schulungsmaterialien. Anwender finden zu ihrer Aufgabe und Rolle verständliche Anleitungen, Voraussetzungen, Ergebnisprüfungen und relevante Einschränkungen. Trainer können abgegrenzte Übungen anhand nachvollziehbarer Materialien vorbereiten und durchführen.

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

**Begrenzung (aktualisiert 23.09.2026):** Bestätigte Start-Date-Synchronisation von EDC abgrenzen; keine generelle Rechtefreigabe und kein ungetesteter PMO-Gesamtweg.

**Technischer Abschluss v0.6.0:** Fünf zusätzliche Quellenentwürfe zu Übernahme/Initialisierungsorientierung, Stammdaten, Zielen, Organisation und System-/ILS-Definition sind umgesetzt. Die SB1-Abdeckung umfasst 17 Schritte mit realem Teilmaterial, zwei mit Orientierung ohne Gesamtbedienweg und fünf mit Quellenhinweisen. Bestehende IDs, Links und v1-Persistenz bleiben erhalten. Der Ausbau erfolgte auf ausdrücklichen Auftrag trotz weiterhin offener praktischer v0.5-Übergangsbedingung. EDC-/Terminwirkung, finale Rollen-/Feldkonfiguration, vollständiger PMO-Durchlauf und Nutzer-/Trainerpilot bleiben offen; keine fachliche Freigabe. Einzelheiten stehen im [v0.6-Abschluss](v0.6-abschluss.md).

**Übergang zu v0.7:** Neue Aufgaben lassen sich überwiegend durch Daten und Inhalte ergänzen. Rollenunterschiede, Voraussetzungen und erwartete Ergebnisse sind geprüft; wiederkehrende Bedienwege werden konsistent wiederverwendet.

### v0.7 – SB1-Planung und Steuerung ergänzen

**Ziel und Nutzwert:** Von einer vollständiger gepflegten Projektdefinition zu nachvollziehbarer Planung, Statuspflege und Entscheidungsinformation gelangen.

**Umfang:** Weitere externe Meilensteine, Phasen und Tailoring ergänzen; anschließend Status, R1-Basisreporting und abgegrenzte Eskalation erschließen. Die Reihenfolge richtet sich nach Quellenlage und verfügbaren Systemnachweisen.

**Begrenzung (aktualisiert 23.09.2026):** LCM-3 einmal pro Kalenderjahr anwenden; weitere ungeklärte Review-Regeln nicht verbindlich machen. FIN-/SAP-Felder, ML-Filter und Statusübersicht sind bestätigt. R1-Basisreporting von Power BI trennen; Eskalationserfassung nicht als nachgewiesene vollständige Empfängerbearbeitung darstellen.

**Technischer Abschluss v0.7.0:** Die Schritte 3.3, 3.4, 4.9, 4.12 und 4.13 sind nach Abgleich der lokalen Originalquellen behandelt. Drei begrenzte Bedienentwürfe ergänzen externe Meilensteine, separat vorgegebenes Tailoring und Eskalationserfassung; Statuspflege und R1-Basisreporting erhalten Orientierung mit Prüfaufträgen. Die SB1-Abdeckung umfasst 20 Schritte mit realem Teilmaterial und vier mit Orientierung. LCM-Frequenz/Terminregeln, Empfängerbearbeitung, ungeprüfte Status-/Filterwirkungen und Reporting-PDP/Power BI sind ausdrücklich aus dem vorgesehenen Pilotumfang ausgeschlossen, nicht fachlich geklärt. IDs, Links und v1-Persistenz bleiben erhalten; Build und vollständige Tests bestehen. Fachliche Freigabe und praktische Nutzer-/Trainererprobung fehlen weiterhin. Kriterien, Belege und Umfangsgrenzen stehen im [v0.7-Abschluss](v0.7-abschluss.md).

**Übergang zu v0.9:** Jeder SB1-Schritt hat eine nachvollziehbare Behandlung: nutzbares Material, klarer Teilumfang oder begründete Lücke. Kritische Konflikte für den vorgesehenen Pilotumfang sind geklärt oder durch eine ausdrückliche Umfangsbegrenzung ausgeschlossen.

### v0.8 – Vorhandenen Bestand erschließen

**Gezielte Erweiterung vom 29.09.2026 auf ausdrücklichen Auftrag:** Die [lokale v0.8-Vorbereitung](v0.8-vorbereitung.md) erschließt sämtliche vorhandenen Prozessnummern, Scope-IDs und Funktionsnachweise sowie bestehende Prozeduren/Use Cases über die vorhandene Prozessansicht und Suche. Nutzbare Inhalte, belegte Teilinhalte und Platzhalter bleiben unterscheidbar; Quellen-, Revisions- und Freigabestatus ändern sich dadurch nicht.

**Abweichung und Begrenzung:** Diese zusätzliche Stufe erweitert die Orientierung über den bisherigen SB1-Ausschnitt hinaus. Die oben beschriebene Pflegepriorität, der begrenzte operative Schulungsumfang und die v0.9-/v1.0-Kriterien bleiben erhalten. Kein Handbuch-Vollimport, keine automatische Anlage einzelner Artikelseiten, kein Abdeckungsdashboard und keine Behauptung vollständiger Schulungsreife.

**Lokaler Abschluss v0.8.0 vom 30.09.2026:** Auf ausdrücklichen Abschlussauftrag ist der vorhandene Bestand vollständig hinsichtlich Auffindbarkeit und Kennzeichnung erschlossen. Die [Release-Notizen](v0.8-abschluss.md) dokumentieren Kandidat, Prüfstand und erhaltene Fremdänderungen. Fachliche Lücken und Freigabegrenzen bleiben bestehen; kein Tag und keine Veröffentlichung.

### v0.9 – Nutzbare Arbeitswege entwickeln, Pflege und lokalen Betrieb erproben

**Fortschreibung 30.09.2026 nach dem lokalen v0.8.0-Abschluss:** Die [v0.9-Planung](v0.9-planung.md) ergänzt den bisherigen Pflege-/Betriebszuschnitt um gezielte, quellenbasierte Inhaltsentwicklung. Hoher Anwendernutzen und Wiederverwendung haben Vorrang vor Beitragszahl oder Abdeckungsquote.

**Aktueller Umfang:** Zuerst den R1-Abgleich von Projektstatusübersicht und vorhandenen Quelldaten im bestehenden Reporting-Beitrag ausarbeiten. Reviewstatus als Eingangsdaten und gemeinsame System-/ILS-Definition begrenzt vorbereiten; fehlende praktische Nachweise, Termin- und Konfigurationsfragen offen halten. Einen WBS-Generatorweg erst nach Belegabgleich planen. Jede spätere Übernahme folgt dem vorhandenen Pflegeprozess mit konkreter Entscheidung und revisionierter Änderung.

**Aktuelle Abschlussgrenze:** Ein belegter erster Arbeitsweg, nachvollziehbare Pflege und protokollierter lokaler Betrieb bilden den Kern. Vorbereitete und blockierte Themen erhalten ausdrückliche Endstände. Aussagen praktischer Nutzbarkeit erfordern Nachweise für den vereinbarten PM-/TM-/ILSM-Umfang; ein technischer oder redaktioneller Abschluss allein erfüllt die nachfolgenden v1.0-Kriterien nicht. Keine pauschale Rollen-/Rechtefreigabe, keine neue Persistenz oder generische Pflegeoberfläche.

**Bisheriger Zuschnitt „Kontinuierliche Pflege und lokalen Betrieb erproben“ – Entscheidungshistorie:** Die folgenden Ziele und Betriebs-/Prüfaufträge bleiben erhalten; der Inhaltsumfang wird durch die vorstehende Planung präzisiert.

**Ziel und Nutzwert:** Zuerst den kontrollierten Pflegeablauf und die persönliche lokale Nutzung nachweisen. Anschließend können Anwender und Trainer den abgegrenzten Bestand zusammenhängend erproben; Inhalte sowie lokale Auslieferung müssen dauerhaft pflegbar bleiben.

**Umfang:** Den Pflegeablauf vom belegten Eingang über Auswirkungsprüfung und Entscheidung bis zur revisionierten Übernahme erproben. Lokalen Start, feste Adresse/Port, Aktualisierung, Rückkehr zur Vorversion und Sicherungsübernahme prüfen. Tatsächliche Pflegeverantwortung dokumentieren. Repräsentative PM-, TM-/ILSM- und Traineraufgaben anschließend im vorgesehenen Nutzungsumfang erproben; PMO-Anlage gesondert prüfen, falls enthalten. Fachliche Prüfung mit Inhaltsrevision, Datum, Gegenstand und Umgebung dokumentieren.

**Begrenzung:** Technischen Umfang auf Pflege und lokale Nutzbarkeit begrenzen; belegte Inhaltskorrekturen bleiben kontinuierlich möglich. Keine Erweiterung zum vollständigen R1-Produkt oder zu einem CMS.

**Übergang zu v1.0:** Ein weiterer realer Pflegefall ist vollständig nachvollziehbar bearbeitet; repräsentative Aufgaben werden erfolgreich bearbeitet, kritische Inhaltsfehler sind behoben und lokaler Betrieb sowie Rückfall funktionieren. Automatisierte Prüfungen bestehen; manuelle Tastatur-, Zoom-, Screenreader- und Druckprüfungen sind für den veröffentlichten Umfang durchgeführt. Notwendige Fortschrittsmigrationen sind getestet.

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

Die [Releaseplanung und vollständige Scope-Übernahme](ippm-release-2-scope.md) ergänzen den fachlichen Zielrahmen. Das unveränderte Original liegt unter `sources/iPPM_Releaseplanung_Release-2.docx`, die aktuelle Quelle trägt die ID `R2P`; `H` bleibt historisch. Die Übersicht ist im Center über die Suche „Release 2“ erreichbar. Sie ergänzt die fünfzehn SB1-Entwürfe um einen sechzehnten Quellenentwurf zur Release-Orientierung. R1B umfasst Power-BI-Reporting; R2 umfasst Kalkulation, Ressourcen-/Kostenplanung und SAP-Kopplung sowie die in der Quelle bezeichneten Backlog-Themen. Die aktuelle Pflegepriorität und der Begleithorizont bis Release 4b stehen oben; die Trainingsabdeckung bleibt unverändert. Umsetzung, Freigabe und Termine werden durch diese Planungsquelle nicht belegt.
