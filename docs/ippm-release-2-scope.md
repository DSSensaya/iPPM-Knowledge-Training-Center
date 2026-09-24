# iPPM-Releaseplanung: R1B und Release 2

Aktuelle Planungsquelle, vom Nutzer am 23.09.2026 bereitgestellt. Kein Dokumentdatum, Terminplan oder Umsetzungsnachweis angegeben. iPPM-Releases sind unabhängig von den Softwareversionen des Centers.

[Originaldokument](../sources/iPPM_Releaseplanung_Release-2.docx)

Die Quelle H (ursprüngliche Gesamt-Releaseplanung) bleibt historisch erhalten. Für den hier beschriebenen R1B-/R2-Scope gilt die neue Quelle R2P. Die SB1-Produktstrategie bleibt in [ROADMAP.md](ROADMAP.md) festgelegt.

## R1B

### Scope

- Projekt Reporting
- Voraussetzung: Anbindung Extension Datenbank und die Fähigkeit Power BI Reports zu verwenden, Datenmodelle, Historisierung (TPG)
- Projekt Reporting PDP - Anbindung Power BI
- PowerBI Embedded – projektspezifisch (TPG)
- Power BI - Project Reporting
- Power BI - Project Portfolio Reporting
- Power Bi - Commercial Reporting
- Power Bi - Projektrollen Liste
- Aufsatz aller Projekte mit den jeweiligen Projektinformationen in der PWA (PDP)

### Technisch

Keine Angaben in der Quelle.

### Organisatorisch

Keine Angaben in der Quelle.

### Ziel

- Allgemeine Statusberichte und Terminabweichungsanalysen (Variance Analysis) sind generierbar. PowerBi-Berichte sind erstellt. Standardberichte sind auf Nutzbarkeit geprüft.
- Basis zur Ablösung des bestehenden Project Reportingsystems ist geschaffen

### Mitgeltende Dokumente

Keine Angaben in der Quelle.

### Tool

- PWA Server
- Power BI

## R2

### Scope

- Projekt kalkulieren
- Ressourcenbedarfsplanung
- Mitarbeiterbedarfsplanung (generisch)
- Ressourcenbedarfsplanung Produktion
- Kostenplanung
- Personalkostenplanung
- Produktionskostenplanung
- Beschaffungskostenplanung
- Sachkostenplanung (e.g. Reisekosten)
- Finanzierungskostenplanung
- Risikokosten planen
- Erstellung Mengengerüst
- Weitere Fähigkeiten - Backlog
- Pflegehygiene – Quality/Health Checks implementieren
- Projektinformationen gepflegt
- Status, Eingecheckt
- Implementierung einer Vertragsreporting
- Projektdokumentation bereitstellen
- Zentrale Ablage für Projekte + Einheitliche Ablagestruktur
- Templates FuE/EDF
- Enterprise Project Types, Project Detail Pages, Project Sites, Project Plan Templates

### Technisch

- Projekt kalkulieren
- Aufbau Ressource Center
- Technische Schnittstelle Produktion
- Integration SAP – Sync. Arbeitsplätze
- Konfiguration PS Link
- Integration zwischen SAP AK und MSP über PS-Link
- Funktionsbaustein ZAKIPPM01
- SAP AK Angebot mit MSP-Projekt verlinkt und synchronisiert (Die Basis bietet die aktuell genutzte Excel Datei) – Job 1 - Synch Daten von MSP zu Angebot ins AK Modul
- Synchronisation der Vorgänge als neue Aufgaben-Positionen unterhalb bestehender Aufgaben nach zugehöriges SAP AK Angebot
- Planungsrelevante Informationen: Angebots-Nr. (AK), Angebotsposition, Aufgabe / Aufgaben-Nr., Beschreibung (Vorgang), Arbeitsplatz/Kostenstelle, Arbeit (h), Kosten, Kostenart, Variante, Risiko, Verlaufskurve, Start, Ende
- Informationen aus SAP AK in MSP zurückschreiben (Job 2 - Update Daten von AK Modul nach MSP)
- Planen von Kostenverläufen
- Aktualisierung von Mengengerüsten analog Versionierung in SAP AK
- Übertrag Plandaten Arbeitsaufwände und Kosten aus MSP in ein Angebot (SAP AK)

### Organisatorisch

- Projekt kalkulieren
- Definition Generische Ressourcen
- Definition AP – Produktion (Schnittstelle - Produktion)
- Building Block Liste

### Ziel

- Das übergeordnete Ziel des Releases ist erfolgreiche Umsetzung folgender Schwerpunkte:
- Integration von Angebotskalkulation durch eine durchgängige bidirektionale Systemkopplung zwischen SAP AK, MS Project
- Implementierung des PS-Link
- Der derzeitige Mengengerüstprozess ist abgelöst unter Berücksichtigung bestehende Excel- Datei und Import Datei (TXT)
- Schnittstelle zu SAP HR ist aufgesetzt. Ressourcen werden an MS Project Server übertragen
- Ressource Center ist vollständig aufgesetzt (generisch) + Verbindung zwischen Ressource und Kostenstelle (RBS)
- Stellt eine zentrale Ablage für Projektdokumentation mit einheitlicher Struktur bereit, inklusive Anbindung an bestehende SharePoint Sites.
- Basis für FuE/EDF- Projekte ist gemäß Scope Release 1 implementiert
- Qualitätssicherung mittels Health Checks

### Mitgeltende Dokumente

- TPGPSLink_Spezifikation_TKMS_Atlas_V2
- TXT- Import Datei_SAP AK
- Vorlage_SAP-R/3: AK-Excel-Tool
- Lösungsdesign

### Tool

- TPG PS Link
- SAP HR
- SAP AK
- PWA Server
- Desktop App
- Extension Datenbank
