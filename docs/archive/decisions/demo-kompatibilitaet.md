# Dauerhafte Trennung von Fachinhalten und Demo-Bestand

Entscheidung vom 29.09.2026: Die in PR #4 eingeführte Ausblendung gilt dauerhaft, nicht nur während einer manuellen Prüfung. Sichtbar und nutzbar bleiben ausschließlich quellenbasierte iPPM-Beiträge; deren Entwurfsstatus und fachliche Einschränkungen bleiben bestehen.

Die neun alten Demo-Beiträge, drei Lernpfade und Beispielprozesse bleiben als nicht zugänglicher Kompatibilitätsbestand im Datenmodell. Eine Löschung bringt derzeit keinen fachlichen Nutzen, würde aber bestehende Referenzprüfungen und die Nachvollziehbarkeit alter IDs erschweren. `visibleArticles` ist die gemeinsame Grenze für Artikelseiten, Suche, Verweise, Merkliste und Zähler. Es gibt keinen Schalter zum Wiedereinblenden. Alte Demo-Artikel- und Lernpfadlinks führen zur bestehenden neutralen Nicht-gefunden-Seite; eine Umleitung auf fachlich andere Beiträge erfolgt nicht.

Der Speicherschlüssel `ippm-learning-v1` und das v1-Format bleiben unverändert. Import ergänzt die drei ID-Listen ohne Katalogfilter oder nachträgliche Prüfung früherer Lernabschlüsse. Auch unbekannte IDs und Abschlüsse mit unvollständigen Lesemarkierungen bleiben erhalten. Sie werden weder als aktuelle Inhalte noch als Schulungsnachweis angezeigt. Export enthält den vollständigen Bestand; Lesen und Abwählen echter Beiträge verändert keine archivierten Lernabschlüsse.

## Integration und Nachweise

- Ausgangspunkt `main`: `e900310`.
- PR #4: `66a5c20`, unmittelbar auf diesem Stand aufgebaut.
- Darauf aufbauend: `0811e69` (Start Date / EDC), `6388fc3` (Pflegestrategie bis R4b), `2449cd2` (N28 / Project Purpose / WBS).
- Integration mit Merge-Commits in dieser Abstammungsreihenfolge; keine Neuinterpretation der fachlichen Meldungen und keine Erhöhung des Freigabestatus.
- Regressionen prüfen sämtliche alten Demo-Artikel-/Lernpfadlinks sowie v1-Import, Bearbeitung, Neuladen, Export und erneuten Import einschließlich unbekannter IDs. Bestehende Prüfungen decken Suche, Prozesse, Navigation, Fachbeiträge und Speicherfehler ab.

Die ältere Formulierung „für die manuelle Prüfung“ im README beschreibt den Anlass von PR #4. Die hier dokumentierte dauerhafte Entscheidung ersetzt diese zeitliche Begrenzung.

## Isolierte technische Prüfung

Mit `CI=1` und `PLAYWRIGHT_PORT=4174` startet `npm.cmd test` einen eigenen lokalen Vorschauserver auf dem angegebenen Port. So wird keine bereits laufende Anwendung auf dem Standardport 4173 wiederverwendet oder beendet. Die Netzwerkprüfungen vergleichen den Ursprung aller Anfragen mit der tatsächlichen Testadresse. Ohne diese Umgebungsvariable bleibt Port 4173 der Standard; der Port der persönlichen Anwendung und ihres Browserspeichers wird nicht geändert.
