# Inhalte pragmatisch pflegen

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
