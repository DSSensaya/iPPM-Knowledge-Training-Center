# Inhalte pragmatisch pflegen

## Releaseorientierung pflegen

`orientation.json` enthält die neuen Orientierungsinformationen. Nach dem
einmaligen Import ausschließlich diese kanonische Collection im JSON-Editor
pflegen; Änderungen an der HTML werden nicht automatisch übernommen.

- `id` ist stabil; `sourceKey` erhält den eindeutigen Import-Schlüssel. Die
  nicht eindeutige HTML-Eigenschaft `id` ist keine Importidentität. Neue IDs
  verwenden den Namespace `lm-`; Sonderzeichen des Quellschlüssels wurden als
  `_hex_` codiert, beispielsweise `S:1.1` → `lm-S_3a_1.1`.
- Vorhandene Themen, Releases und Systeme über `referenceId` referenzieren.
  Titel/Zusammenfassung dann ausschließlich am bestehenden Fachobjekt pflegen.
- Innerhalb von `content` ersetzt `{ "referenceId": "guide-project-master-data" }`
  eine wiederholte operative Aussage. Artikel werden mit ihrer aktuellen Erläuterung,
  Artikelgeltung und ihren offenen Punkten gelesen; alternativ kann die Referenz
  direkt auf einen bestehenden offenen Punkt zeigen. Keine Titel-/Textkopie am Bezug.
  Diese redaktionellen Inhaltsreferenzen sind keine Prozess- oder Releasezuordnung.
- `purpose: "context"` kennzeichnet in der Orientierung einen historischen
  Importbeleg. Dessen Wortlaut nicht fortschreiben; aktuelle Aussagen im führenden
  Center-Objekt pflegen. Die unveränderte HTML und Regressionstests sichern den Beleg.
- Neue, eigenständige Fachtexte sollen einmal am Orientierungsobjekt liegen. `sourceStatus` bewahrt den
  Quellenstand und ist kein Artikelstatus. `planningReleaseIds` sind explizite
  Planungsangaben; kein automatisches „ab Release“, keine Produktivfreigabe.
- `audienceRoleIds` bezeichnet Orientierungszielgruppen, niemals RASCI oder
  Schrittverantwortung. Noch nicht im Center katalogisierte Zielgruppen bleiben
  als `audienceNotes` erhalten, ohne erfundene Verantwortungsbeschreibungen.
- Hierarchie nur als `parentId`, Orientierungsfolge nur als `journeyIds` pflegen.
  Weitere Beziehungen einmal unter `links` mit Ziel, Bedeutung und Herkunft
  pflegen; Rückverweise werden berechnet. Redaktionelle ATLAS-Einordnungen bleiben
  ausdrücklich zu prüfen. Ein Modellübergang ist kein belegter Prozessfluss.
- Fehlendes Material und Verknüpfungen aus dem Bestand ermitteln, keine zweite
  Coverage-/Readiness-Liste anlegen. Vorhandene Bedienwege nicht in Orientierungen
  kopieren. Quellenhinweise auf mögliche Center-Zuordnungen werden erst nach
  Prüfung in strukturierte Verbindungen überführt.

### Importprovenienz vom 04.10.2026

Grundlage: `iPPM-Landkarte-TKMS-ATLAS-2.html`, gzip/Base64-Element `lm-payload`,
SHA-256 `0fbf5ac522bc531f850d72c769ecc62f5aff6e594490a1689b5b3f1369d84cfb`.
973 Elemente, 2.860 Kanten und 14 Wege wurden gelesen. 972 Hierarchiekanten,
62 redundante Wegkanten und 377 Releasekanten wurden durch Elternreferenzen,
Weglisten und explizite Releaseattribute ersetzt. Die übrigen 1.449 Modellbeziehungen
bleiben mit ihren ursprünglichen Bedeutungen erhalten; zwei geprüfte Center-Bezüge
für PBS `P.1.1` ergänzen sie. Zahlen in diesem Absatz dokumentieren nur den Import,
nicht einen zusätzlich zu pflegenden Runtime-Bestand.

31 Scope-Knoten verwenden die bestehenden Themen-IDs. R1 verweist auf `release-1`,
R1B bleibt `R1B`; weitere Releases wurden als Planung ergänzt. Referenzierte
Scope-Texte werden aus dem Center gelesen, der HTML-Quellstand bleibt im Original.
Die Feldlisten an Vertragsentwürfen werden über ihre untergeordneten Feldobjekte
erschlossen; die 118 ausdrücklich benannten Pflichtangaben unter den 120 Feldern
wurden an den Feldern bewahrt.
Reine Releasecode-Wiederholungen werden durch `planningReleaseIds` ersetzt.
Qualifizierte Aussagen wie „ursprünglich“, „Backlog“ oder „ausdrücklich zu
bestätigen“ bleiben als früh sichtbare Geltungsgrenzen der Releaseplanung erhalten.
Eigenständige Modelltexte und Geltungsgrenzen bleiben erhalten. Wiederholte operative
Aussagen wurden gezielt durch aktuelle Inhaltsreferenzen ersetzt (siehe unten).
Der Import bestätigt nicht
deren fachliche Richtigkeit oder aktuelle Freigabe. Insbesondere ATLAS-Berichte
und Architekturoriginale wurden nicht nachbeschafft oder unabhängig geprüft.

### Bereinigte Pflegehoheit und verbleibende Grenzen

21 Inhaltsreferenzen an zwölf Orientierungsobjekten ersetzen die wiederholten aktuellen
Aussagen zu Start Date/EDC, Project Purpose und den betroffenen offenen Punkten sowie
Lieferlisten, Rechte und Speicherwegen in den Leitplanken. Führend bleiben die
bestehenden Center-Artikel und `open-points.json`. Feldnamen, Systemzusammenhänge,
modellierte Verbindungen und die 35 PBS-Rollenabschnitte bleiben eigenständig.
Rollen im PBS sind weder Orientierungszielgruppen noch Schrittverantwortungen.

34 historische Abschnitte bleiben wortgleich mit dem Payload, insbesondere abweichende
Project-Purpose-Aussagen, Release-Quellenauszüge und der datierte Quellen-/Schrittanhang
in `P.8.4`. Sie erscheinen ausdrücklich als Importbelege, nicht als aktueller Stand.
Der Unterschied zwischen „Entfernung vorgesehen“ im PBS und gemeldeter Entfernung
im Center bleibt nachvollziehbar. Die tatsächliche Umsetzung und Reichweite werden
dadurch nicht bestätigt; die aktuellen offenen Punkte werden referenziert.

Dokumenttitel und gemeinsame Metadaten liegen in `sources.json`; Seitenstellen,
Fundstellen und Importgrenzen stehen in `sourceRefs`/`sourceNote` am Bezug.
Elf lokale Originale stimmen mit den SHA-256-Werten der `modelSourceRefs` überein.
Die Importkennung O hat denselben Hash wie H und verwendet deshalb H; die Herkunft O
bleibt am Bezug benannt. 34 PBS-Quellenabschnitte verwenden diese nachgewiesenen IDs.
Das ist ein Identitätsabgleich, keine erneute fachliche Prüfung der Originalinhalte.

Die 13 nur im HTML beschriebenen Dokumentidentitäten bleiben im Quellenkatalog
gesondert als `LM…` erfasst, ohne behaupteten lokalen Dateipfad. Ihre `sourceNote`
kennzeichnet Herkunft und fehlende Originalprüfung. Insbesondere fehlt für
`PLAN-V2`/`PLAN-R2` der Nachweis, dass sie tatsächlich H/R2P entsprechen; ein gleicher
Dateititel reicht nicht. Ebenso wird PBS nicht mit der abweichend benannten PBSREF
gleichgesetzt. Normale Artikel erhalten keine zusätzlichen Pflichtnachweise.

Der direkte Payload-Abgleich in `tests/content.spec.ts` bilanziert alle 2.860 Kanten:
1.449 unveränderte Links sowie 972 Eltern-, 62 Weg- und 377 Releasebezüge in den
jeweiligen kanonischen Feldern; keine fachlich zusammengeführten oder ersatzlos
ausgeschlossenen Kanten. Die 169 redaktionellen Einordnungen bleiben fachlich offen.
Der Importtest benötigt die unveränderte Originaldatei unter
`<Repository>/iPPM-Landkarte-TKMS-ATLAS-2.html` (neben `package.json`), mit dem oben
genannten SHA-256. Sie wird nicht kopiert, öffentlich eingebunden oder beim Build
gelesen und ist gezielt in `.gitignore` ausgenommen. Ein frischer Checkout benötigt
diesen lokal bereitzustellenden Importbeleg für `verify`; ein fehlender Beleg wird
nicht stillschweigend übersprungen. Der Test vergleicht unveränderte Struktur und
historische Wortlaute getrennt von den bewusst bereinigten aktuellen Referenzen.

## Ein einfacher Artikel

Eine Datei `src/content/articles/meine-aufgabe.json` genügt:

```json
{
  "id": "meine-aufgabe",
  "title": "Eine vorhandene Aufgabe nachvollziehen",
  "summary": "Kurze Beschreibung des konkreten Nutzens.",
  "roleIds": ["pm"],
  "systemIds": ["pwa"],
  "status": "draft",
  "content": [
    {
      "title": "Bedienung",
      "body": "Hier den fachlich belegten Arbeitsweg beschreiben."
    }
  ]
}
```

ID und Dateiname müssen übereinstimmen. Die Datei wird automatisch gefunden; es ist kein manueller Article-Import nötig. Keine Revision, Evidence, CareCase, Assessment, Source-Snapshot, ReleaseAssignment oder TrainingAssignment ist erforderlich. Ein Inhalt darf ohne Quellenangabe existieren.

Optional ergänzen:

```json
{
  "openPoints": ["Wirksame Rechte im konkreten Zielstand prüfen."],
  "sourceRefs": ["SB1-Handbuch §3.6.7", "TtT-Klärung 23.09.2026"],
  "sourceNote": "Basis: Handbuch und abgestimmte Klärungen",
  "relatedArticleIds": ["guide-project-permissions"]
}
```

Das zweite Beispiel zeigt optionale Zusatzfelder, keinen vollständigen Artikel. Rollen und Systeme über vorhandene IDs aus den zentralen JSON-Katalogen auswählen. `Alle Rollen` ist ein UI-Filter; keine zusätzliche fachliche Rolle anlegen. Artikelrollen bezeichnen Zielgruppen, Schrittrollen die Verantwortung, beide verwenden denselben Katalog.

Im Editor **Inhalte pflegen**, Beitrag auswählen und **Inhalt laden** verwenden. Titel, Zusammenfassung, Status, Rollen, Systeme und Abschnitte direkt bearbeiten. Abschnitte lassen sich hinzufügen und entfernen. Optionale Punkte/Quellen werden zeilenweise erfasst. Für Beziehungen und andere JSON-Kataloge steht die vollständige JSON-Ansicht bereit. Neue Artikeldateien werden zunächst im Repository angelegt; nach Editor-Neustart erscheinen sie in der Auswahl.

## Status bewusst setzen

| Wert       | Bedeutung                                                                   |
| ---------- | --------------------------------------------------------------------------- |
| `draft`    | Beitrag ist ein Entwurf; beschriebene Grenzen und offene Punkte beachten    |
| `usable`   | Der begrenzte beschriebene Arbeitsweg ist für den angegebenen Zweck nutzbar |
| `approved` | Beitrag ist für das Knowledge Center freigegeben                            |

Keiner dieser Werte behauptet vollständige Prozessabdeckung, erfolgreiche Systemtests oder Unternehmensfreigabe. Pflichtprüfungen und Grenzen müssen vor Anwendung sichtbar bleiben. `approved` nur aufgrund einer tatsächlich vorliegenden Center-Freigabe verwenden. Bei wesentlichen fachlichen Änderungen Status bewusst erneut prüfen.

## Bedienwege nur einmal schreiben

Konkrete Bedienwege gehören nach `procedures.json`. Ein Artikel referenziert sie über `procedureIds`. Andere Materialien verwenden dieselbe stabile Procedure-ID. Niemals Aktionen über Arraypositionen, `slice()` oder `actions[n]` wiederverwenden.

Wenn ein Bedienweg eine `taskId` hat, muss diese bei einer Schritt-Materialzuordnung in dessen `taskIds` enthalten sein; bei einem Task-Material muss sie zur Task-ID passen. Gemeinsam verwendete Bedienwege werden explizit über dieselbe fachliche Aufgabe an den passenden Schritten verbunden. Die Zugehörigkeit zum selben Artikel allein reicht nicht.

Ein Bedienweg umfasst ID, Titel, Auslöser, Voraussetzungen, Handlungsschritte und erwartete Ergebnisse. Rechte, Prüffragen, Geltung, Quellen und Beziehungen sind optional. `relationships.targetId` kann auf Artikel, Aufgaben, Prozessschritte, Wissensthemen oder Bedienwege zeigen. Rollen, Systeme, Quellen und andere Katalogobjekte sind keine Ziele dieser fachlichen Beziehungen. Tool-Texte können frei verständlich geschrieben werden; falls eine strukturierte Werkzeugauswahl nützt, verweist `toolSelection.toolIds` auf `systems.json`. `all` und `alternative` dürfen nicht verwechselt werden.

Übungsbeispiele sind optionale normale Inhaltsabschnitte mit `purpose: "exercise"`; es gibt kein verpflichtendes Trainer-Datenmodell. Zusätzlicher Quellenkontext kann als `purpose: "context"` gekennzeichnet werden. Kritische Grenzen gehören weiter in den früh sichtbaren Geltungsbereich, nicht nur in eingeklappte Details.

## Prozess und Schulung verbinden

Prozessschritte werden ausschließlich im vorhandenen Prozess in `processes.json` gepflegt. Stabile IDs, Nummern, fachliche Unterschiede und Quellenkonflikte erhalten. Neue Prozessschritte nur mit fachlicher Grundlage ergänzen.

```json
{
  "trainingBlockIds": ["sb1"],
  "releaseIds": ["release-1"],
  "materials": [
    {
      "articleId": "guide-project-permissions",
      "kind": "guide",
      "releaseIds": ["release-1"],
      "procedureIds": ["procedure-owner-change"]
    }
  ]
}
```

Dies sind Zusatzfelder eines passenden Prozessschritts, keine allgemeine Behauptung, dass der Owner-Weg jede Zugriffsaufgabe abdeckt. Bei Orientierung `kind: "orientation"`, bei ergänzender Referenz `kind: "reference"` verwenden und keine ausführbaren Procedures zuweisen. Ein Schritt kann mehrere Blöcke haben. Artikel schreiben die Blockzuordnung nicht erneut.

Für einen künftigen Block zunächst das fachlich belegte Release in `releases.json`, den Block mit eindeutiger ID und `releaseId` in `training-blocks.json` und danach die Schritt-/Task-Zuordnung ergänzen. Anzeigecode und interne ID unterscheiden: SB01 darf in unterschiedlichen Releases angezeigt werden, die IDs müssen eindeutig sein. Es sind keine neuen Coverage-Dateien notwendig.

Materialgültigkeit wird explizit angegeben. R1-Material nicht aufgrund einer neuen Schulungszuordnung für R3/R4 freigeben. Bei Überarbeitung Artikel-/Procedure-Geltung und konkrete Materialverbindung gemeinsam fachlich prüfen. Coverage und Inventory aktualisieren sich aus diesen Daten.

## Grenzen und Quellen

Einfache offene Punkte direkt am passenden Objekt pflegen. Tatsächlich gemeinsam geltende Fragen einmal in `open-points.json` halten und mit `openPointIds` referenzieren. Historische, erledigte Unsicherheiten gehören bei Bedarf in die Entscheidungsdokumentation, nicht automatisch in die Runtime.

Quellenwidersprüche benennen und Fundstellen erhalten; keine fachliche Entscheidung aus technischen Gründen treffen. Originaldateien in `sources/` erhalten. Bestehende kurze IDs wie `B: §3.6.7` können weiter genutzt werden. Ein technischer Hash ist keine Autorenpflicht.

## Sicher speichern und prüfen

Der lokale Editor prüft den gesamten Bestand. Ein fehlerhafter Status, ungültige Beziehung oder ein fremder Bedienweg wird nicht gespeichert. Bestehende IDs können im Editor nicht umbenannt oder gelöscht werden. Inhalte und Beziehungen lassen sich ändern, neue Katalogobjekte ergänzen.

Bei strukturell falschem JSON bleibt der rohe Entwurf vollständig erhalten. Das Artikelformular erscheint nur für passende Feldtypen und wird nach Korrektur wieder verfügbar. Validierungsfehler sind direkt sichtbar; ungültige Eingaben werden nicht gespeichert.

Bei Navigation, Objektwechsel und erneutem Laden eines ungespeicherten Entwurfs **Speichern und fortfahren**, **Entwurf verwerfen** oder **Navigation abbrechen** wählen. Fehlgeschlagene Speicherung hält den Entwurf und die aktuelle Ansicht fest. Reload und Schließen lösen die Browserwarnung aus, soweit der Browser dies erlaubt; deren Wortlaut und Optionen bestimmt der Browser.

Bei einem Konflikt die Eingaben sichern, **Aktuellen Stand vergleichen** nutzen, die Unterschiede prüfen und anschließend den neuen Stand laden und die fachlich gewünschte Änderung darin übernehmen. Ein alter Stand wird nicht still überschrieben. Nach einem abgebrochenen Serverprozess kann eine `.editor.lock` zurückbleiben: erst sicherstellen, dass kein Editor mehr schreibt, dann diese technische Sperre entfernen und neu laden.

```sh
npm run verify
npm run typecheck:tools
```

Nach erfolgreicher Prüfung Änderungen mit dem üblichen Git-Workflow versionieren. Der Editor committet nicht automatisch. Der gebaute Reader benötigt einen neuen Build, um geänderte Repository-Inhalte auszuliefern.

## Belegte Prozessverbindungen

`Process.flows` ist optional und liegt ausschließlich am kanonischen Prozess in
`processes.json`. Eine Beziehung enthält `from` und `to` als Schritt-IDs desselben
Prozesses, optional `kind` und `label` sowie einen konkreten Quellenbeleg in
`sourceRefs` oder `sourceNote`. Unbekannte Endpunkte, identische Duplikate und
Beziehungen ohne Quellenbeleg werden abgewiesen. Fehlende `flows` bedeuten keine
belegte Verbindung; Nummern und Arraypositionen erzeugen niemals Pfeile.

Schrittrollen sind die vorhandenen Verantwortungszuordnungen. Bei mehreren
`roleIds` führt die Karte den Schritt einmal in „Gemeinsam zugeordnet“ und nennt
alle Rollen; sie bestimmt keine führende Rolle. Leere Rollen bleiben ohne
Rollenzuordnung. Die Karte verändert keine fachlichen Rollen oder Metadaten.

Die Platzierung berechnet `src/lib/process-layout.ts` getrennt aus Rollen,
Phasen und kanonischer Darstellungsreihenfolge. Es gibt keine Layoutfelder im
Fachbestand und keinen zweiten Schrittbestand. Fachliche Reihenfolge wird nur
durch belegte Flow-Beziehungen ausgedrückt. Quellenprüfung und offene Fragen zu
Projektabwicklung stehen in `docs/PROCESS_SWIMLANE.md`.
