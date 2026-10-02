# Lokale redaktionelle Bearbeitung

## Aktueller Betrieb ab 01.10.2026

Der ausdrückliche Erweiterungsauftrag hebt die frühere R1-Beschränkung auf. Die folgenden Angaben ersetzen die früheren Umfangs- und Betriebsgrenzen; die bisherigen Prüfprotokolle bleiben unten erhalten.

```powershell
npm.cmd run build:editor
npm.cmd run edit:built
```

Im Repository ausführen und `http://127.0.0.1:5174` öffnen. `EDITOR_PORT` kann einen anderen lokalen Port festlegen. Der gebaute Editor liegt in `dist-editor/`; der Server bindet fest an `127.0.0.1`. Er startet keinen Vite-Entwicklungsserver, keinen Watcher und kein HMR. Node.js, die installierten Projektabhängigkeiten und das lokale Repository werden weiterhin benötigt. Zum Laden der aktuellen TypeScript-Inhaltsdaten verwendet der Server den vorhandenen Vite-Buildcompiler im Speicher. Es werden keine externen Dienste aufgerufen. `npm.cmd run edit` bleibt als Entwicklungsstart verfügbar.

Der Editor lädt vor der Anzeige die aktuellen registrierten Objekte vom lokalen Server. Speichern und Neustarten benötigen keinen erneuten Editorbuild. Änderungen an Programmcode, Inhaltsschema oder neuen Objekt-IDs benötigen einen Neubau; ein unbekanntes Objekt wird sichtbar abgewiesen. Die normale Leseanwendung bleibt eigenständig: `npm.cmd run build`, danach `npm.cmd run preview`. Sie übernimmt den Repository-Stand beim Neubau und benötigt keine Editor-API.

### Inhaltsabdeckung und Ursprünge

| Inhalt                                                                                        | Redaktionelles Ursprungsobjekt / Speicherkennung                                                                                                     |
| --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Alle 16 sichtbaren Fachbeiträge einschließlich FAQs und Release-Sonderansicht                 | Bestehende Artikel-ID aus `src/data/*-content.ts`; Titel, Zusammenfassung, Kurzantwort, alle vorhandenen Abschnitte und Punkte                       |
| Keine, eine oder mehrere Prozeduren; Owner- und Meilenstein-Sonderansichten                   | Bestehende Prozeduren im Ursprungsartikel; Titel, Auslöser, Voraussetzungen, erforderliche Leserechte, Aktionen/Werkzeuge, Ergebnisse und Prüffragen |
| Anwendungseinschränkungen                                                                     | Feld des jeweiligen Artikels; Status-Hinweise wortgleich aus der Darstellung in die Daten verschoben                                                 |
| Trainerhinweise und Owner-Trainerpaket mit beiden Varianten                                   | `trainer:<Artikel-ID>` und `trainer-owner:<Prozedur-ID>`; gemeinsame Trainertexte von Anleitung und FAQ verwenden denselben Ursprung                 |
| Owner-Lesehinweise und längere redaktionelle Erläuterungen in Artikelkomponenten              | `owner-reading` und feste `note:*`-Kennungen in `editorial-notes.ts`; vorhandene gerenderte Texte wortgleich übernommen                              |
| Prozessansichten und -schritte                                                                | `processViews:*`, `processSteps:*`; aus Artikeln abgeleitete Prozessüberschriften/-beschreibungen bearbeiten direkt deren Artikel-ID                 |
| Arbeitsaufgaben, Rollenbezeichnungen, Scope-Bezeichnungen, Einschränkungen und Abhängigkeiten | `functions:*`, `roleCatalog:*`, `scopeItems:*`, `issues:*`, `knowledgeLinks:*` aus `catalog.ts`                                                      |
| Redaktionelle SB1-Abdeckung, zusätzliche Handbuchthemen, Inhaltseinordnung                    | `sb1Coverage:<Nummer>`, `sb1AdditionalHandbookTopics:*`, `readiness:<Artikel-ID>`                                                                    |
| Kataloghinweise und Hilfe-FAQ                                                                 | `inventory-note:*` und `help:*`; gemeinsame Kataloghinweise haben ein gemeinsames Ursprungsobjekt, Matrixhinweise verwenden direkt die SB1-Abdeckung |

Abgeleitete Katalogtitel und Bedienwegtexte bearbeiten das gemeinsame Funktions-, Prozess- oder Artikelobjekt. Quellengetreue Katalogauszüge (`inventory-source.ts`), Originaltitel/-nummern der Schulungsmatrix, Quellen/Fundstellen/Hashes, technische Bewertungen, Systemnachweise, Reviews, Pflegeentscheidungen sowie IDs und Beziehungen sind geschützt. Verborgene historische Demo-Beiträge und Demo-Lernpfade bleiben unverändert verborgen. Der Editor ergänzt keine fachlichen Aussagen, Quellen oder Nachweise und bietet keine Strukturänderung wie Hinzufügen/Löschen von Beiträgen, Schritten oder Varianten.

### Speicherweg

Alle Speicherarten nutzen dieselbe lokale API und ausschließlich `src/data/local-editorial.json`. Das Format `version: 2` enthält `journals`, nach registrierter Ursprungskennung getrennt. Beim ersten Speichern wird ein vorhandenes R1-Journal der Version 1 unverändert unter seiner Artikel-ID übernommen; bestehende Basis, Revisionen, Vorher-/Nachher-Texte, Freigaben und Historieneinträge bleiben erhalten. Nicht gespeicherte Objekte benötigen keinen Journaleintrag. Zusätzliche Textobjekte nutzen einen internen Adapter auf denselben validierten Revisionsmechanismus; seine Hilfsfelder sind nicht schreibbar.

Das serverseitige Register erlaubt konkrete Objekte und Feldpfade. Der Client kann weder Dateipfade noch neue Objekte, fremde Felder oder Freigabefelder vorgeben. Ein Repository-Fingerabdruck, exklusive Dateisperre, erneute Standprüfung und atomarer Dateiaustausch schützen jede Speicherung. Veraltete Stände und externe Basisänderungen werden sichtbar abgewiesen. Quellen und externe Systemnachweise werden nicht überschrieben. Wie zuvor erfordert eine widersprüchlich geänderte kanonische Basis eine bewusste Konsolidierung; automatische Konfliktauflösung und Archivierung sind nicht enthalten.

Stifte öffnen nur die jeweilige Feldgruppe. Checkbox-Werkzeugauswahl, Vorschau, Änderungsvergleich und die drei Speicherarten bleiben erhalten. **Für das Center final freigeben** verlangt nur den Namen und keinen Kommentar oder zusätzlichen fachlichen Freigabeschritt. Der Server ermittelt die geänderten Felder selbst. Spätere Änderungen entziehen die Freigabe ausschließlich diesen Feldern; unveränderte Freigaben und frühere Einträge bleiben erhalten.

**Korrektur vom 02.10.2026:** Bei zusätzlichen Inhaltsobjekten werden Änderungen anhand der ursprünglichen Feldpfade ermittelt. Interne Adapterfelder erscheinen nicht im Änderungsvergleich. Damit bleibt beispielsweise eine Titelfreigabe bei einer reinen Ergebnisänderung erhalten. Frühere Journale mit doppelten oder irrtümlich zusätzlich aufgezeichneten Hilfsfeldbezeichnungen bleiben unverändert lesbar; die wirksame Freigabe wird beim Laden ausschließlich aus den tatsächlich geänderten Textfeldern abgeleitet. Neue Speicherungen enthalten nur diesen korrigierten Feldumfang.

### Prüfungen

`npm.cmd run build`, `npm.cmd run build:editor` und `npm.cmd test` sind die Übergabeprüfungen. `tests/built-editor.spec.ts` prüft isolierte Repository-Kopien und gebaute Browserdateien: alle registrierten Textfelder, Typen, Schutzfelder, Migration einer bestehenden Historie, Konflikte, alle Artikelansichten, mehrere/fehlende Bedienwege, gemeinsame Ursprünge, aktuelle Repository-Texte ohne Editorneubau, Neustart und statischen Leseneubau. Die bisherigen Editorprüfungen sichern weiterhin Checkboxen, alle Speicherarten, Sperren, manipulierte Aufträge und Tastaturdialoge ab. Produktive Inhaltsdaten werden dabei nicht beschrieben.

### Abgeschlossene Übergabeprüfung am 01.10.2026

- `npm.cmd run build`: erfolgreich; eigenständige Leseanwendung gebaut.
- `npm.cmd run build:editor`: erfolgreich; Browseranwendung und lokaler Server gebaut.
- `npm.cmd test`: **182 Tests bestanden** auf Desktop und Mobilgröße (6,8 Minuten), einschließlich der Prüfungen des tatsächlich gestarteten gebauten Servers mit isolierten Repository-Kopien.
- Geprüft wurden insbesondere alle 16 sichtbaren Artikel und 188 registrierten Ursprungsobjekte, Schreibgrenzen, bestehende Journalhistorie, Konflikte, feldbezogene Freigaben, Tastaturbedienung, gemeinsame Inhalte, Neustart und Übernahme in einen Leseneubau.
- Das ursprüngliche `src/data/local-editorial.json` blieb bytegleich. Der abschließende Diff-Check war fehlerfrei. Beide Builds melden weiterhin den Hinweis auf ein JavaScript-Bündel über 500 kB.

### Reviewkorrektur und Prüfung am 02.10.2026

Die neuen Regressionstests reproduzierten zunächst die doppelte Titelzuordnung und den unbeabsichtigten Freigabeentzug. Nach der Korrektur bestehen sie mit unabhängig festgelegten Feldlisten, einschließlich Neustart, tatsächlicher Titeländerung und verlustfreiem Lesen früherer Journale. Beide Builds sind erfolgreich. Von 186 Prüfungen bestanden 185 im Gesamtlauf; der erste Navigationstest traf auf den versehentlich parallel laufenden Neubau und erhielt einen 404. Dieser Test bestand anschließend mit `npm.cmd test -- --last-failed` gegen den fertigen Build. Inhaltsjournal und Originalquellen wurden durch die Prüfungen nicht verändert.

## Historische Ausbau- und Prüfprotokolle

Stand: 01.10.2026. Eigenständiger Auftrag nach v0.8.0. Die bisherige Roadmap-Grenze gegen neue Pflegefunktionen ist für diesen Auftrag ausdrücklich aufgehoben. Paketversion und fachlicher Bestand bleiben erhalten. Auf ausdrücklichen Nutzerauftrag ist eine bewusste finale Freigabe geänderter Inhalte für das Center möglich.

## Bedienung

Im Repository `npm.cmd run edit` starten, dann `http://127.0.0.1:5174/#/artikel/guide-r1-reporting` öffnen. Den Stift beim gewünschten Inhalt wählen. Direkt darunter erscheint der Editor mit ausschließlich den Feldern dieses Bereichs und Fokus auf dem passenden Feld. Titel, Zusammenfassung, Kurzantwort, vorhandene Abschnittstitel/-texte/-punkte sowie Voraussetzungen, Bedienweg, Ergebnisprüfung und Einschränkungen lassen sich jeweils getrennt bearbeiten. **Änderung prüfen und speichern** wählen. Der Änderungsgrund kann davor im Editor oder anschließend im Dialog ausgefüllt werden. Ein leerer Änderungsgrund verhindert nicht das Öffnen; beim endgültigen Speichern mit einer der beiden bisherigen Speicherarten erscheint ein Fehler direkt am Pflichtfeld und setzt dort den Fokus. Nach erfolgreicher Eingabeprüfung öffnet sich ein Dialog mit Änderungsvergleich und aufklappbarer Textvorschau; bis dahin wird nichts gespeichert. Unter **Speicherart** eine der drei Optionen mit der jeweiligen Erklärung wählen: ohne fachliche Bestätigung, persönlich bestätigte Erkenntnis oder finale Center-Freigabe. Die beiden Freigabe-/Bestätigungsoptionen verlangen einen Namen. **Für das Center final freigeben** benötigt keinen Änderungsgrund; Details stehen unten. Erst **Im Repository speichern** schreibt die Änderung dauerhaft. **Zur Bearbeitung zurück** oder Escape schließt den Dialog und erhält den Entwurf; während der Speicherung ist das Schließen gesperrt. Die Aktionen stehen unter den Bereichsfeldern und bleiben bei langen Bereichen beim Scrollen sichtbar. Jede Speicherung betrifft ausschließlich den geöffneten Bereich. **Gespeicherten Beitrag neu laden** liest die dauerhaft gespeicherte Fassung. Die lokale Änderungshistorie zeigt Gründe und bisherige/neue Texte.

Speichern schreibt direkt in `src/data/local-editorial.json`. Kein Download, kein Import und keine Browser-Persistenz für Fachinhalte. Ein Neustart des Bearbeitungsservers liest dieselbe Datei. Für die normale Desktop-/Leseanwendung anschließend `npm.cmd run build` ausführen und die Leseansicht neu laden. Ihre bestehende Verknüpfung und `npm.cmd run preview` bleiben unverändert nutzbar. Der Bearbeitungsserver läuft nur solange der bewusst gestartete Prozess läuft; keine neue Desktop-Verknüpfung oder Hintergrundinstallation.

Bei einem Konflikt bleibt der Entwurf in den Feldern stehen. Der aktuelle Repository-Text wird gesondert angezeigt. Der Knopf **Aktuellen Stand übernehmen und Entwurf verwerfen** verwirft den Entwurf ausdrücklich; anschließend gewünschte Änderungen gegen den aktuellen Stand neu eintragen, vergleichen und speichern. Kein automatischer Merge. Ungespeicherte Entwürfe sind nur in dieser Bearbeitungsansicht verfügbar; vor Verlassen des Beitrags speichern oder bewusst abbrechen. Ein Neuladen/Schließen der Browserseite warnt bei Textänderungen.

Der frühere Hinweisblock mit Gesamtbearbeitungsknopf entfällt. Alle Stifte sind einheitlich 14 px groß, grau und ohne dauerhafte Hintergrundfläche. Die 44-px-Klickfläche und der sichtbare Tastaturfokus bleiben erhalten.

## Stifte direkt am Text

Ergänzung vom 01.10.2026: Im lokalen R1-Reporting-Beitrag führen Stifte an Titel, Zusammenfassung, Kurzantwort und den bearbeitbaren Bereichen zum Editor. Jeder vorhandene Beitragsabschnitt hat genau einen gemeinsamen Stift für Titel, Text und Punkte. Voraussetzungen, Bedienweg, Ergebnisprüfung und Einschränkungen haben jeweils einen Stift für ihre Feldgruppe. Ein Klick öffnet den bestehenden Bearbeitungsmodus, setzt den Fokus in das passende Eingabefeld und scrollt es in den sichtbaren Bereich. Die Schaltflächen haben eindeutige deutsche Beschriftungen und lassen sich mit Tab und Enter bedienen.

Ein weiterer Stift öffnet einen anderen Bereich nur, wenn der laufende Entwurf gespeichert oder ausdrücklich verworfen wurde. Ungespeicherte Textänderungen und ein bereits eingetragener Änderungsgrund blockieren den Wechsel mit einem sichtbaren Hinweis; sie werden weder verloren noch verborgen mitgespeichert. Nach Speichern oder bewusstem Abbrechen liest der nächste Stift den aktuellen Repository-Stand. Vorschau und Änderungsvergleich zeigen nur die geöffnete Feldgruppe. Validiertes Speichern, Revisionen und Konfliktbehandlung nutzen den bestehenden Speicherweg. Quellen, Beziehungen, Fachfreigaben und andere Beiträge bleiben geschützt. Im normalen Lesebetrieb erscheinen keine Stifte.

## Unterstützter Umfang und Modellentscheidung

**Finale Center-Freigabe, Auftrag vom 01.10.2026:** Nach **Änderung prüfen und speichern** im Dialog **Für das Center final freigeben** wählen, **Freigegeben von (für das Center)** ausfüllen und **Im Repository speichern** wählen. Dieser Weg verlangt keine Änderungsanmerkung, keinen Pflegefall, keinen Belegabgleich und keinen weiteren fachlichen Freigabeschritt. Die Freigabe gilt ausschließlich für die tatsächlich geänderten Felder, die der Änderungsvergleich zeigt. Die bisherigen Speicherarten bleiben verfügbar; dort ist der Änderungsgrund weiterhin erforderlich. Ein beim Wechsel zur finalen Freigabe bereits eingegebener Grund bleibt im Entwurf erhalten, wird für diesen Speicherweg jedoch nicht übernommen.

Die finale Center-Freigabe nutzt den bestehenden Journal-Speicherweg mit dem optionalen Kennzeichen `confirmation.kind: 'center-final'`. Die API erzeugt den festen Historieneintrag „Für das Center final freigegeben.“; dies ist ein Audit-Ereignis, keine erforderliche Nutzeranmerkung. Name, Datum, Revision und exakt geänderte Felder werden serverseitig validiert und in `Article.userConfirmations` abgeleitet. Die Leseansicht weist die betreffenden Felder als für das Center final freigegeben aus, ohne zusätzliche Freigabeanmerkung. Spätere Änderungen entziehen nur die aktuelle Freigabe der betroffenen Felder; unveränderte Freigaben und historische Einträge bleiben erhalten. Technische Eingabeprüfung, Schreibgrenzen und Konfliktschutz gelten unverändert. Dies ist die finale Freigabe zur Verwendung im Center; der gesonderte Quellenstand, vorhandene `ReviewEvidence` und Nachweise einer praktischen Systemerprobung werden nicht umgeschrieben. `source-draft` beschreibt weiter diesen Quellenstand, keine ausstehende Center-Freigabe der freigegebenen Felder.

Genau der vorhandene Fachbeitrag `guide-r1-reporting` ist zugelassen. Die Form behält Anzahl und Position vorhandener Abschnitte, Abschnittspunkte, Prozeduren und Listenfelder bei, damit IDs und Anker stabil bleiben. Für `procedure-r1-reporting` sind Titel, Auslöser, Voraussetzungen, vorhandene Schritte samt Werkzeug/Ansicht, erwartete Ergebnisse und Prüffragen bearbeitbar. Die bisherigen vier Einschränkungstexte sind unverändert aus der Darstellung nach `knowledge.applicationLimitations` in den Inhaltsdaten verschoben. Trainerpakete, Beziehungen, Quellenregister/-belege, bestehende externe fachliche Bestätigungen und andere Beiträge werden weiter über den vorhandenen redaktionellen Prozess gepflegt. Neue Abschnitte, Schritte oder Beiträge sind nicht Teil dieser Funktion.

Das Journalformat bleibt Version 1 und unterstützt frühere Einträge ohne Prozedur-/Einschränkungstexte. Diese Einträge bleiben unverändert; neue Speicheraufträge enthalten zusätzlich beide Feldgruppen. Frühere Ausgangsstände ohne das neu eingeführte Einschränkungsfeld werden ausschließlich für dessen wortgleiche Verschiebung weiterverwendet. Alle übrigen Basisänderungen werden weiterhin abgewiesen. Texte der Prozedur werden in das vorhandene Datenobjekt übernommen, ohne dessen ID, Quellenbelege, Funktionszuordnung oder Beziehungen zu ersetzen.

Das bestehende `Article`-/`ContentRevision`-/`ReviewEvidence`-Modell wird um abgegrenzte persönliche Nutzerbestätigungen und ausdrückliche Center-Freigaben ergänzt. Die kanonischen TypeScript-Daten erzeugen weiterhin den Ausgangsbeitrag; eine kleine versionierte Repository-Datei speichert dessen vollständigen Ausgangsstand und eine lückenlose Folge redaktioneller Textänderungen. Darstellung und Suche lesen die daraus abgeleiteten normalen Artikel. Die erste Speicherung legt den Ausgangsstand ab, jede weitere Speicherung erhält Vorher-/Nachher-Texte, Änderungsgrund, Datum in Europe/Berlin und nächste Revisionsnummer. Bestehende Revisionen und Quellen-Snapshots bleiben unverändert. Eine frühere fachliche Prüfung bleibt an ihre alte Revision gebunden, während die geänderte Fassung zwingend `source-draft` ist. Neue Reviews werden nicht erzeugt; Quellenbewertungen und Klärungen werden nicht umgedeutet. Rücknahme geschieht als neue redaktionelle Änderung, nicht durch Löschen der Historie.

Bei den beiden bisherigen Speicherarten dokumentiert der Pflichtgrund die Übernahmeentscheidung für die Änderung. Er verlangt keinen Pflegefall- oder Belegverweis. Auf ausdrücklichen Auftrag vom 01.10.2026 kann im Speicherdialog alternativ **Als fachliche Erkenntnis bestätigt speichern** gewählt werden. Dafür **Bestätigt von (für fachliche Bestätigung)** ausfüllen und **Im Repository speichern** wählen. Diese persönliche Nutzerbestätigung benötigt keinen eigenen Pflegefall und keinen Belegabgleich. Das Journal hält Name, Datum, Revision und die exakt geänderten Felder fest; die Leseansicht zeigt diese Bestätigung ausdrücklich als Nutzerbestätigung. Die vorausgewählte Option **Ohne fachliche Bestätigung speichern** erzeugt weiterhin ausschließlich einen Quellenentwurf.

Die Nutzerbestätigung wird getrennt von `ReviewEvidence` in optionalen `Article.userConfirmations` aus der Historie abgeleitet. Sie gibt weder den gesamten Beitrag noch andere Felder frei und behauptet keine externe Quellenprüfung oder praktische Systemerprobung. Eine spätere Änderung eines bestätigten Felds entfernt dessen aktuelle Bestätigung; der historische Journaleintrag bleibt erhalten. Unveränderte bestätigte Felder behalten ihre Zuordnung. `care-cases.ts`, Quellenbewertungen und bestehende Reviews werden nicht verändert oder erfunden.

Werkzeuge verwenden den expliziten Auswahlkatalog `src/data/editor-tools.ts` mit stabilen Kennungen, einheitlichen Bezeichnungen und bekannten Altbezeichnungen. Native Dropdown-Gruppen trennen PDP, PWA, MS Project Client und weitere Werkzeuge. Der allgemeine Katalog enthält ausschließlich einzelne Ziele und wird nicht automatisch aus Beitragstexten erweitert. Eine unbekannte oder kombinierte Bestandsangabe erscheint ausschließlich am betroffenen Feld unter **Bisherige Angabe** und lässt sich nach einer anderen Auswahl wiederherstellen. **Anderes Werkzeug / Ansicht …** öffnet ein zusätzliches Textfeld für eigene Einzelangaben. Gespeicherte Alttexte und historische Werte werden nicht automatisch migriert.

**Mehrere Werkzeuge auswählen** schaltet das jeweilige Feld auf eine nach Werkzeuggruppen gegliederte Checkbox-Liste um. Einträge per Klick anhaken oder mit Tab fokussieren und mit der Leertaste auswählen. Ausgewählte Zeilen sind gelb hervorgehoben; der Fokus ist sichtbar. **Gemeinsam verwenden** und **Alternativ verwenden** unterscheiden die Bedeutung der ausgewählten Ziele. Erst die konkrete Auswahl ersetzt die bisherige Angabe, das bloße Öffnen verändert sie nicht. Beim Wechsel zurück zur Einzelauswahl bleibt das erste ausgewählte Ziel erhalten. Bei leerer Auswahl wird die ursprüngliche Einzelangabe oder das erste Ziel der gespeicherten Mehrfachauswahl verwendet. Eigene Freitextangaben sind weiterhin als Einzelauswahl verfügbar.

Bei mindestens zwei Zielen speichert ein Schritt zusätzlich zum lesbaren `tool`-Text optional `toolSelection: { toolIds, relation }`, wobei `relation` entweder `all` oder `alternative` ist. Kennungen sind eindeutig und müssen aus dem Katalog stammen; neue oder geänderte Auswahlen erlauben nur aktive Ziele und einen genau dazu passenden Text. Der Text ist ein Bezeichnungsschnappschuss für Lesebetrieb, Suche und Historie. Historische Auswahlen bleiben bei späteren Katalogumbenennungen lesbar, zurückgezogene Kennungen bleiben reserviert. Unveränderte Auswahlen werden mitgeschrieben; Metadaten dürfen nicht bei gleichbleibendem Text stillschweigend entfernt werden. Vorschau, Revisionen, Konfliktprüfung und beide Speicherwege nutzen das bestehende Journal. Alte Journale ohne Mehrfachauswahl bleiben kompatibel; keine neue Abhängigkeit.

Bekannte Kurz- und Langbezeichnungen werden in der Auswahl zu einer einheitlichen Option zusammengeführt, beispielsweise **PDP > ILS Overview** und **MS Project Client > Ansicht 10 Phasen- und Meilensteinplan**. Overview, Objectives-Liste und Liste Escalations verwenden ebenfalls eindeutige Pfade. Elternseiten und Unterbereiche bleiben getrennte Ziele. Kombinationen mit mehreren Werkzeugen oder alternativen Ansichten werden nicht als allgemeine Optionen angeboten und nicht automatisch zerlegt. Öffnen oder Zurücksetzen einer Auswahl schreibt bestehende Texte nicht um; eine neu gewählte Option wird mit der vereinheitlichten Bezeichnung gespeichert. Quellen und frühere Revisionen behalten ihre ursprünglichen Bezeichnungen.

Der Katalog umfasst nach Anpassung auf Nutzerauftrag 34 Ziele. **PWA > Project Center > Build Team** steht neben Project Permissions. Die drei Project-Center-Ansichten heißen **View: Programme und Projekte**, **View: Projekte und Teilprojekte** und **View: Projektfortschritt- und -status**. Im MS Project Client sind die Ansichten 10, 11 Review Status, 20, 30 und 40 Projektfortschritt einzeln wählbar. Bestehende Kennungen und alte Bezeichnungen für Build Team und die Reportingansicht bleiben erhalten; Bestandswerte werden nicht automatisch umgeschrieben. **Self Service Portal** ersetzt TopDesk in der Auswahl bei gleicher Kennung; alte TopDesk-Bezeichnungen bleiben Aliase. **Veröffentlichter Projektplan** entfällt als allgemeines Werkzeugziel, da es einen Zustand beschreibt. Die frühere Kennung bleibt reserviert; gespeicherte Angaben erscheinen weiterhin ausschließlich am betroffenen Feld unter **Bisherige Angabe**.

## Lokaler Speicherweg und Grenzen

Ein Vite-Plugin stellt die lokale API ausschließlich beim bewusst gewählten `local-edit`-Start bereit. Die Oberfläche wird nur in diesem Entwicklungsmodus eingebunden. Produktionsbuild und gewöhnlicher Entwicklungs-/Vorschaubetrieb enthalten keine Bearbeitungs-API. Keine neue Laufzeitabhängigkeit, Datenbank, CMS, Anmeldung oder GitHub-Zugangsdaten; keine Commit-/Push-Funktion.

Zugelassen ist nur die feste Artikel-ID, ihre vorhandene Prozedur-ID und die feste JSON-Datei. Pfade können nicht vom Client vorgegeben werden. Schema und Feldlängen werden im Client und erneut im Server geprüft. Prozedur-IDs müssen exakt übereinstimmen; andere IDs, Beziehungen, Quellenbelege, Review-/Quellenstatus und Historie dürfen nicht über den Speicherauftrag verändert werden. Die API prüft Loopback, Host, Origin, Methode, JSON-Größe und ein zufälliges Sitzungstoken; ein Neustart macht frühere Token ungültig. Umgeleitete Datenverzeichnisse/-dateien werden abgewiesen. Der Bearbeitungsmodus muss an `127.0.0.1` gebunden bleiben. Er ist für ein vertrauenswürdiges lokales Repository und einen lokalen Benutzer vorgesehen, kein Mehrbenutzerdienst und keine Sandbox für fremden Quellcode.

Jeder Auftrag enthält einen SHA-256-Fingerabdruck aller Datendateien einschließlich des Journals. Eine exklusive Dateisperre verhindert parallele API-Speicherungen. Der Server prüft den Stand erneut vor der atomaren Ersetzung der JSON-Datei; der temporäre Inhalt wird vorher synchronisiert. Bei Validierungs-/Dateifehlern wird kein Erfolg gemeldet. Eine nach Prozessabsturz verbliebene `.lock`-Datei blockiert bewusst weitere Schreibzugriffe: erst prüfen, dass kein Speicherprozess läuft, und die Sperre gezielt entfernen. Keine automatische Entfernung möglicherweise aktiver Sperren. Beliebige externe Editoren verwenden diese Sperre nicht; eine Änderung unmittelbar zwischen letzter Fingerabdruckprüfung und Dateiersetzung kann mit Dateisystemmitteln nicht vollständig ausgeschlossen werden.

Ändert sich der kanonische Ausgangsbeitrag nach bereits gespeicherten lokalen Änderungen, wird die Historie nicht still auf eine neue Basis angewandt: Laden und Build weisen den Widerspruch ab. Der vorhandene statische Build bleibt unabhängig nutzbar. Eine bewusste redaktionelle Konsolidierung/Rebasierung des Journals ist dann erforderlich und im ersten Durchstich kein automatisierter Bedienweg. Die Historie wächst mit den gespeicherten Änderungen; Archivierung ist bewusst noch nicht umgesetzt.

## Prüfung

`tests/local-editor.spec.ts` verwendet isolierte Kopien unter `test-results/`; Testtexte werden nicht in den fachlichen Hauptbestand geschrieben. Geprüft werden vollständige Bedienung, Vorschau, Pflichtgrund, Repository-Speicherung, Laden, Serverneustart, statischer Neubau, normale Leseansicht ohne Editor, zwei konkurrierende Sitzungen, parallele Speicheraufträge, externe Datenänderungen, verbliebene Sperre, ungültige Felder/Objekte/Origins/Token/JSON/Größe, erhaltene IDs/Beziehungen/Revisionen/Quellen-Snapshots, historische Reviews und Ablehnung einer widersprüchlichen Basis. Desktop/Mobil prüfen zusätzlich Axe und horizontalen Überlauf. Der normale Build validiert die Historie vor der Erstellung der Leseanwendung.

Abschließender Prüfstand, 30.09.2026:

- Vollständiger TypeScript-/Vite-Build erfolgreich. Die bereits vorhandene Warnung zum Bundle über 500 kB bleibt bestehen (507,94 kB).
- Neue Editor-Testgruppe: 10/10 auf Desktop und Mobil erfolgreich.
- Vollständiges npm-Testkommando: 142/142 erfolgreich, 3,0 Minuten, ohne Wiederholungsversuche. Frischer Testserver auf Loopback-Port 4193, keine Wiederverwendung einer möglicherweise älteren Vorschau.
- Prettier-Prüfung aller betroffenen Code-/Daten-/Dokumentationsdateien sowie Git-Diff-Prüfung erfolgreich. Die Änderungen an vorhandenen Dateien sind auf diesen Auftrag begrenzt; der Arbeitsbaum war vor Beginn sauber.
- Im Produktionsbundle sind Bearbeitungs-Endpoint, Sitzungstoken-Header und Bearbeitungsknopf nicht enthalten. Tatsächlicher statischer Wiederaufbau und Lesen der gespeicherten Testfassung sind Teil des Browsernachweises.
- Die Tests deckten Feldbeschriftung und gegenseitige Störung des Vite-Caches auf; Beschriftungen sind nun ausdrücklich zugeordnet, Editor und Build-Validierung haben getrennte Caches. Der Host-Schutz wird mit einem echten HTTP-Header geprüft, da native fetch den Header ersetzte. Diese Ursachen wurden behoben; der abschließende Lauf prüft die korrigierte Implementierung.
- Testtexte, Testreviews und Testrevisionen verbleiben ausschließlich in isolierten Testkopien. Das Hauptjournal bleibt leer; die vorhandenen fachlichen Inhalte und die Anwendungsversion sind unverändert. Kein Commit, Push, Tag oder Publish.

Technische Prüfungen des Centers ersetzen keine fachliche Prüfung oder praktische iPPM-Erprobung.

## Prüfstand der Stift-Bedienung, 01.10.2026

- Build erfolgreich; die bestehende Bundlegrößenwarnung bleibt erhalten.
- 16/16 Editor-Prüfungen auf Desktop/Mobil erfolgreich, einschließlich jedes Feldziels, Tastaturfokus, erhaltenem Entwurf, erneutem Öffnen nach Abbruch, Axe und horizontalem Überlauf.
- Vollständiger abschließender Lauf: 148/148 Tests erfolgreich, ohne Wiederholungsversuche. Normaler Lesebetrieb enthält keine Stifte.
- Der anfängliche umfangreiche Mobil-Sammeltest überschritt sein Zeitlimit. Die Feldgruppen und der Entwurfserhalt sind jetzt getrennte Bedienfälle; kein Zeitlimit erhöht und keine Prüfung entfernt.
- Format-/Diff-Prüfung erfolgreich. Vorhandene lokale Arbeit und fachliche Daten erhalten. Kein Commit oder Push.

## Prüfstand der Bereichsbearbeitung, 01.10.2026

- Hinweisblock und Gesamtbearbeitungsknopf in der geschlossenen Ansicht entfernt; Öffnen ausschließlich über die Stifte. Jeder Beitragsabschnitt hat einen gemeinsamen Stift für Titel und Text.
- Voraussetzungen, vorhandene Bedienwegfelder, Ergebnisprüfung und Anwendungseinschränkungen nutzen den bestehenden validierten Journal-Speicherweg. Prozedur-ID, Quellenbelege, Beziehungen und frühere Reviews bleiben erhalten.
- Build und vollständiger abschließender Testlauf erfolgreich: 152/152 Prüfungen auf Desktop/Mobil, ohne Wiederholungsversuche. Der Lauf umfasst 20 Editorprüfungen, auch Speicherung der neuen Felder nach Neustart/Build, Konflikte bei Prozeduränderungen, illegale Prozedur-IDs/Felder und ältere Textjournale.
- Format-/Diff-Prüfung erfolgreich. Hauptjournal ohne Teständerungen; vorhandene lokale Arbeit erhalten. Kein Commit oder Push. Die bestehende Bundlegrößenwarnung bleibt erhalten.

## Prüfstand der Bearbeitung direkt am Bereich, 01.10.2026

- Der Editor wird direkt unter dem angeklickten Bereich eingebunden und zeigt ausschließlich dessen Felder. Die Aktionen stehen unter den Feldern samt Änderungsgrund und bleiben bei langen Bereichen beim Scrollen sichtbar. Vorschau und Textvergleich sind auf den aktiven Bereich begrenzt.
- Ungespeicherte Änderungen oder ein eingetragener Änderungsgrund blockieren einen Bereichswechsel bis zum Speichern oder ausdrücklichen Verwerfen. Jede neue Speicherung verändert nur die Felder des geöffneten Bereichs.
- Abschließender Build und 152/152 Tests erfolgreich, ohne Wiederholungsversuche. Die 20 Editorprüfungen decken direkte Platzierung, ausgeschlossene fremde Felder, sichtbare Speicheraktionen auf Desktop/Mobil, geschützten Entwurf, getrennte Bereichsrevisionen, Neustart/Build sowie unveränderten Konflikt- und Historiennachweis ab.
- Format-/Diff-Prüfung erfolgreich; keine Teständerungen im Hauptjournal und kein Commit oder Push.

## Prüfstand der Werkzeugauswahl und Nutzerbestätigung, 01.10.2026

- Werkzeug-Dropdown mit vorhandenen Werten und eigener Angabe geprüft. Das bestehende Werkzeug-Stringmodell bleibt erhalten.
- Ausdrückliche Nutzerbestätigung mit Pflichtname, exakt geänderten Feldern, unveränderten Quellen/Reviews und historischer Nachvollziehbarkeit geprüft. Spätere Änderungen entziehen die aktuelle Feldbestätigung; der historische Eintrag bleibt erhalten.
- Build und vollständiger Testlauf erfolgreich: 154/154 Prüfungen auf Desktop/Mobil, ohne Wiederholungsversuche. Die 22 Editorprüfungen umfassen beide Speicherwege, Neustart, statischen Build, Konflikte und abgewiesene manipulierte Bestätigungsdaten.
- Format-/Diff-Prüfung erfolgreich. Hauptjournal ohne Teständerungen; bestehende lokale Arbeit erhalten. Kein Commit oder Push. Die vorhandene Bundlegrößenwarnung bleibt bestehen.

## Prüfstand der vereinheitlichten Werkzeugnamen, 01.10.2026

- Bekannte Werkzeugaliase werden vor der Deduplizierung in einheitliche Auswahlbezeichnungen überführt. Quelltexte, gespeicherte Altwerte und historische Revisionen bleiben unverändert; neu gewählte Werkzeuge erhalten die einheitliche Bezeichnung.
- Build und abschließender vollständiger Lauf erfolgreich: 156/156 Tests auf Desktop/Mobil, ohne Wiederholungsversuche. Der neue Dropdown-Test prüft Dubletten, unveränderte Nachbarfelder sowie Speicherung und erneutes Laden der kanonischen Auswahl.
- Der neue Test wartet ausdrücklich auf das geladene Dropdown, bevor er dessen Optionen abfragt. Format-/Diff-Prüfung erfolgreich; keine Teständerungen im Hauptjournal und kein Commit oder Push.

## Prüfstand des gruppierten Werkzeugkatalogs, 01.10.2026

- Ein expliziter Katalog mit 31 einzelnen Zielen ersetzt die automatische Sammlung von Werkzeugtexten. Stabile Auswahlkennungen, eindeutige Altbezeichnungen und native Gruppen sind auf Desktop/Mobil geprüft. Bestehende Kombinationen und eigene Angaben bleiben am jeweiligen Feld auswählbar und gelangen nicht in andere Dropdowns.
- Öffnen und Zurücksetzen verändern keine Bestandstexte. Neu gewählte Ziele werden über den bestehenden validierten Journal-Speicherweg als einheitliche Bezeichnung gespeichert. Keine Modell-/Historienmigration und keine Mehrfachauswahl.
- Abschließender Build und vollständiger Lauf erfolgreich: 158/158 Tests ohne Wiederholungsversuche. Die 26 Editorprüfungen umfassen lokale Altwerte, unveränderte Nachbarfelder, Neustart/Build, Nutzerbestätigung, Konflikte und ältere Historien.
- Format-/Diff-Prüfung erfolgreich; keine Teständerungen im Hauptjournal, kein Commit oder Push. Die vorhandene Bundlegrößenwarnung bleibt erhalten.

## Prüfstand der Werkzeug-Mehrfachauswahl, 01.10.2026

- Native Mehrfachauswahl pro Werkzeugfeld mit ausdrücklich gemeinsamer oder alternativer Verwendung. Stabile Kennungen werden optional zusätzlich zum lesbaren Text gespeichert; Alttexte bleiben unverändert.
- Desktop-/Mobilprüfungen sichern Vorschau, Speicherung, erneutes Laden, Serverneustart, statischen Lesebuild, unveränderte Nachbarfelder, Rückkehr zur Einzelauswahl und leere Auswahl ab. Eine gespeicherte Auswahl bleibt beim Reduzieren oder Leeren im Mehrfachmodus, bis bewusst zurückgewechselt wird.
- API-Prüfungen weisen doppelte, unbekannte und zurückgezogene Kennungen, ungültige Strukturen/Verwendungen, widersprüchliche Texte, stillschweigende Metadatenentfernung und veraltete Schreibstände ab. Auch ein Strukturwechsel bei identischem Text erhält Revision und genaue Bestätigungsfelder.
- Der Neustart-Test trennt die alte Vite-Browsersitzung vor dem Serverstopp, damit automatisches Wiederverbinden nicht mit der Prüfung einer frischen Sitzung konkurriert.
- Build und abschließender vollständiger Testlauf erfolgreich: 162/162 Tests auf Desktop/Mobil. Format-/Diff-Prüfung erfolgreich; Hauptjournal ohne Teständerungen. Bearbeitungsserver auf `127.0.0.1:5174` aktualisiert. Keine neue Abhängigkeit, kein Commit oder Push; die vorhandene Bundlegrößenwarnung bleibt bestehen.

## Checkbox-Bedienung der Mehrfachauswahl, 01.10.2026

- Auf Nutzerwunsch ersetzt eine nach Werkzeuggruppen gegliederte Liste nativer Checkboxen die Mehrfachauswahlliste. Häkchen sind per Klick oder Leertaste bedienbar; ausgewählte Zeilen und Tastaturfokus sind sichtbar. Beim Öffnen wird eine vorhandene Auswahl fokussiert, sonst das erste Werkzeug.
- Speicherformat, IDs, gemeinsame/alternative Verwendung, historische Texte und Konfliktschutz bleiben erhalten. Die Tests prüfen Anhaken, Entfernen bis zur leeren Auswahl, Tastaturbedienung, erneutes Laden und die Rückkehr zur Einzelauswahl auf Desktop/Mobil; Zugänglichkeit und responsive Darstellung sind geprüft.
- Abschließender Build und vollständiger Testlauf erfolgreich: 162/162 Tests. Kein Commit oder Push, keine Teständerungen im Hauptjournal; vorhandene Bundlegrößenwarnung bleibt bestehen.

## Farbunterscheidung der Editoraktionen, 01.10.2026

- Vorschau: weiß mit funktionaler Kontur; reguläres Speichern: schwarz; ausdrückliche fachliche Bestätigung: gelb. Nach weiterer Bedienrückmeldung ist Abbrechen weiß mit schwarzer Schrift, dunkler Kontur und einem X-Symbol, damit es sich von deaktivierten Aktionen abhebt. Beschriftungen und Tastaturfokus ergänzen die Farbunterscheidung. Deaktivierte Aktionen bleiben grau; Speichern wird weiterhin erst nach geprüfter Vorschau verfügbar.
- Ausschließlich vorhandene Designfarben und flache Gestaltung. Textkontraste aktiver Varianten einschließlich Hover geprüft. Speicherverhalten und Bestätigungsumfang bleiben erhalten.
- Build und vollständiger Testlauf erfolgreich: 162/162 Tests auf Desktop/Mobil. Hauptjournal ohne Teständerungen; kein Commit oder Push.

## Konsolidierter Speicherdialog, 01.10.2026

- Ein gemeinsamer Button **Änderung prüfen und speichern** ersetzt die drei bisherigen Vorschau-/Speicheraktionen. Der native modale Dialog erklärt beide Speicherarten, zeigt den Änderungsvergleich und bietet eine aufklappbare Textvorschau. Die normale Speicherung ist vorausgewählt; nur die ausdrückliche persönliche Bestätigung verlangt einen Namen. Der abschließende Speicherauftrag nutzt die unveränderte lokale API.
- Escape und **Zur Bearbeitung zurück** erhalten den Entwurf. Der Fokus bleibt per Tab/Umschalt+Tab im Dialog und kehrt nach Schließen zum Öffnungsknopf zurück. Während eines Speicherauftrags sind erneutes Speichern und Schließen gesperrt. Konflikte führen zur bestehenden Abgleichansicht ohne stilles Überschreiben.
- Vollständiger Testlauf erfolgreich: 166/166 Prüfungen auf Desktop/Mobil, einschließlich Dialogbedienung, Pflichtangaben, Zugänglichkeit, Entwurfserhalt, beiden Speicherarten, konkurrierenden Änderungen, Neustart, statischem Neubau und unverändertem Lesebetrieb. Screenshots auf beiden Größen geprüft. Hauptjournal ohne Teständerungen; kein Commit oder Push.
- Abschließender TypeScript-/Vite-Build und Format-/Diff-Prüfung erfolgreich. Die bestehende Bundlegrößenwarnung bleibt erhalten (518,56 kB JavaScript).

## Sichtbare Pflichtangaben im Speicherdialog, 01.10.2026

- Ein leerer Änderungsgrund blockiert die Dialogöffnung nicht mehr. Das Feld ist während der Speicherentscheidung direkt im Dialog verfügbar. Erst der endgültige Speicherauftrag prüft den Grund; bei fehlender Angabe erscheinen Fehlermeldung, ungültiger Feldstatus und Tastaturfokus unmittelbar am Feld. Eingaben am Grund schließen den Dialog nicht.
- Hinweise außerhalb des Dialogs stehen bei den sichtbaren Bereichsaktionen statt weit oben im langen Editor. Der gemeldete Bedienweg-Entwurf wurde in der laufenden Browseransicht erhalten und die Dialogöffnung mit leerem Grund überprüft; kein fachlicher Inhalt wurde gespeichert.
- Build, Format-/Diff-Prüfung und vollständiger Testlauf erfolgreich: 168/168 Tests auf Desktop/Mobil. Der neue Regressionstest prüft den langen Bedienweg, fehlenden Grund, verhindertes Speichern und erhaltene Werkzeugauswahl. Beide Speicherarten, Konflikte, Neustart, statischer Neubau und normale Leseansicht bleiben abgesichert. Hauptjournal leer; kein Commit oder Push.

## Prüfstand der finalen Center-Freigabe, 01.10.2026

- Die dritte Speicheroption gibt ausschließlich die geänderten Inhalte final für das Center frei. Sie verlangt einen Namen, aber keine Änderungsanmerkung oder weitere fachliche Prüfstufe. Der Server leitet Freigabefelder und festen Historieneintrag ab; ältere persönliche Bestätigungen bleiben kompatibel.
- Desktop-/Mobilprüfungen sichern fehlenden Namen, unsichtbares Kommentarfeld, Zugänglichkeit, unveränderte Nachweise und Vorrevisionen, Freigabeanzeige nach Neustart und statischem Neubau, veraltete Schreibstände sowie manipulierte Freigabeart, Felder und Historiennotiz ab. Eine spätere Änderung entzieht nur die Freigabe des geänderten Felds und erhält andere Freigaben und die vollständige Historie.
- TypeScript-/Vite-Build und abschließender vollständiger Testlauf erfolgreich: 170/170 Tests, ohne Wiederholungsversuche (6,9 Minuten). Auch das Verschwinden der Namensfehlermeldung nach der Eingabe ist abgesichert. Format-/Diff-Prüfung erfolgreich; vorhandene Bundlegrößenwarnung bleibt bestehen (519,43 kB JavaScript).
- Bearbeitungsserver auf `127.0.0.1:5174` mit neuer API gestartet. Der vorhandene Bedienweg-Entwurf wurde bei der Browseraktualisierung vollständig erhalten und feldweise verglichen. Neue Speicheroption sichtbar; kein fachlicher Inhalt automatisch gespeichert. Hauptjournal leer, kein Commit oder Push.
