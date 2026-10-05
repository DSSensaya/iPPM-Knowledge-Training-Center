# iPPM-Design: Projektentscheidungen

- **project: Releaseüberblick.** Drei ruhige, nach Kataloggruppen gegliederte
  Spalten zeigen Prozesse, Funktionen und Systembausteine. Unter 1100 px stehen
  sie untereinander. Release-Buttons verwenden die bestehenden Farb-/Fokustokens
  und einen 4-px-Radius als lokale Variantenentscheidung. Explizite Planungsbezüge
  erhalten eine gelbe linke Begrenzung und Textkennzeichnung; verbundener Kontext
  eine gestrichelte Begrenzung. Inhalte ohne Zuordnung verwenden Steel-Flächen
  und `--muted-soft` ohne Opazitätsabsenkung oder deaktivierte Links. Reihenfolge
  und Kartenmaße bleiben bei der Auswahl gleich. Technische Ebenen sind mit
  nativen Details-Elementen aufklappbar; fachliche Grenzen stehen früh sichtbar.
  Diese Notation ist keine Aussage über Produktivverfügbarkeit oder Freigaben.

`DESIGN.md` bleibt die unveränderte, vollständig übernommene Eingabefassung vom 04.10.2026. Die folgenden Ergänzungen sind **iPPM-Projektentscheidungen**, keine zusätzlichen TKMS-Vorgaben. Konkrete Figma-Geometrien wurden für diesen Auftrag nicht separat abgerufen.

- **project: Schriftbetrieb.** Keine Schriftdateien wurden geliefert. Die vorhandenen lokalen Familien `TKMS` / `TKMS Headline` mit `Arial, sans-serif` als lokalem Fallback bleiben erhalten. Arial ist kein verifizierter TKMS-Fallback. Regular 400 und Hervorhebung 700 sind bestehende Projektwerte.
- **project: Typografiezuordnung.** Seitentitel verwenden H1 (64/48 px, 100 % Zeilenhöhe, 1 % Laufweite). Semantische H2 verwenden für diese dichte Wissensoberfläche visuell H5 (32/20 px), H3 visuell H6 (20/18 px). Fließtext verwendet Copy Regular (18 px, 135 %); Bedienelemente 16 px, untergeordnete Metadaten 14/12 px. Die übrigen Überschriften behalten 1,2 Zeilenhöhe. Dies ändert keine HTML-Gliederung.
- **project: Responsive Komposition.** Die vorhandenen inhaltsbezogenen Schwellen 1100 und 800 px bleiben erhalten; 1440 und 360 px sind Prüfreferenzen, keine Breakpoints. Seitenränder betragen 80 px auf breiten Ansichten, 32 px im Zwischenbereich und 24 px mobil. Der bestehende Inhaltsdeckel von 1400 px, die 264-px-Sidebar und der 950/1000-px-Lesebereich bleiben erhalten. Karten/Filter verwenden eine 12/6-Spaltenbasis mit 24/16-px-Abständen; andere vorhandene Modulaufteilungen bleiben aufgabenbezogen.
- **project: Anwendungsstand.** Der Kopfbereich zeigt auf allen Seiten die Paketversion und den bei der Erstellung eingebetteten Zeitstempel als „Stand:“ mit Datum, Uhrzeit und MEZ/MESZ (`Europe/Berlin`). Er bleibt beim Neuladen gleich und wird bei jedem Build neu erzeugt; im Entwicklungsbetrieb bezeichnet er den Serverstart. Dies ist der technische Anwendungsstand, keine fachliche Inhaltsfreigabe. Die bestehenden 14-px-Metadaten stehen rechts in zwei Zeilen mit 4 px Abstand, mobil in einer eigenen Zeile links. Der mobile Kopfbereich und der Beginn der Navigation verwenden 128 px; Umbruch und 8 px Zeilenabstand erhalten die Sichtbarkeit auf schmalen Ansichten. Dies sind iPPM-Layoutentscheidungen, keine zusätzlichen TKMS-Vorgaben.
- **project: Logo.** Die dunkle Sidebar verwendet das originale Simple-on-dark-Asset mit proportionaler Breite des verfügbaren 216-px-Bereichs (mobil 272 px). Es erhält keine Effekte oder Beschneidung. Ein leerer Bild-Alternativtext verhindert eine doppelte Ansage neben dem benannten Startseitenlink. Die Full-Assets stehen bereit, ohne zusätzlichen Lockup. Größe/Abstand sind Layoutentscheidungen, keine behauptete Mindestgröße oder Schutzzone.
- **project: Komponenten.** Text- und Icon-Buttons verwenden Pill-Geometrie (CSS-Radius 999 px); Eingaben, Selects, Textareas und der vorhandene Editor-Dialog den kleinen 4-px-Radius. Inhaltsflächen bleiben rechteckig ohne zusätzliche Effekte. Es gibt keine globale Radius-, Schatten- oder Verlaufsregel. Bestehende Touch-Mindestmaße 44 px und Padding 12/16 px bleiben Projektwerte. Fokus verwendet 2-px-Blau mit 3 px Abstand, an Buttons 4 px; der belegte 5-px-Fokuslinienradius bleibt ohne eigene Fokusliniengeometrie ungenutzt.
- **project: Zustände.** Primary/Secondary-Default und Hover/Pressed folgen den belegten hellen/dunklen Farbwerten. Deaktivierte Bedienelemente verwenden ausdrücklich neutrale Flächen, Text und Begrenzungen (keine Opazitäts-Invertierung). Merkliste nutzt zusätzlich zum gedrückten Zustand eine neutrale aktive Fläche. Formular-Hover verstärkt die Begrenzung; geöffnete Accordion-Zusammenfassungen erhalten eine Unterstreichung. Focus bleibt unabhängig davon sichtbar. Die Sidebar ist eine explizite dunkle Oberfläche, der Reader eine helle; ein neuer Modusumschalter ist nicht vorgesehen.
- **project: Semantik und Bestand.** Vorhandene Fehler markieren weiterhin tatsächliche Speicher-/Validierungsfehler. Artikelstatus bleibt textuell; `approved` wird nicht als Unternehmensfreigabe oder allgemeiner Erfolgsstatus eingefärbt. Footer-Farben und bestehende funktionale Prozess-/Geltungsmarker bleiben erhalten. Bestehende Lucide-Symbole werden weiterverwendet, ohne sie als TKMS-geprüft zu bezeichnen.

Offen bleiben die in `DESIGN.md` genannten Figma-Detailwerte, Schriftdateien, vollständigen Komponentenabmessungen, Logo-Mindestgrößen/Schutzzonen und Dropdown-Schattenparameter. Es werden dafür keine Markenfreigaben behauptet.

- **project: Rollen.** Die Übersicht zeigt vier rechteckige Rollenkarten in zwei
  Spalten, unter 800 px in einer Spalte. Ganze Karten sind benannte Links und
  verwenden das bestehende Startseiten-Kartenmuster. Details tragen den
  kanonischen Rollennamen als H1 und Browsertitel. Rücklink und kompakte
  Rollenlinks mit `aria-current` machen die Navigation sichtbar. Prozessschritte
  und Wissen werden über die vorhandene Pill-Button-Geometrie umgeschaltet;
  Signal und `aria-pressed` kennzeichnen die Auswahl. Der URL-Parameter
  `bereich=wissen` erhält die Wissensansicht auch nach Reload. Native Details
  gliedern Schritte nach Prozess und Phase; die erste Phase ist zunächst offen.
  Listen verwenden 16 px Padding, neutrale Begrenzungen und blaue Fokuslinien.
  Mobile Rollenprofile verwenden 32 px für den langen H1-Rollennamen und 14 px
  mit 12/8 px Padding für die Inhaltsbuttons, um Wortumbrüche und zusätzliche
  Steuerungszeilen zu reduzieren. Titel-/Buttonabstände verwenden mobil 16/24 px;
  dies sind lokale Typografie- und Layoutzuordnungen.
  Rollentexte, Artikelstatus und Anzahlen kommen ausschließlich aus dem Bestand
  und den bestehenden Queries. Die Darstellung ergänzt keine Verantwortungen
  oder Aussage zur vollständigen Prozessabdeckung.

- **project: Aufgaben.** Die Übersicht zeigt Prozessschritte einmal in der
  kanonischen Prozess-/Phasenreihenfolge mit unveränderten Schrittnummern in
  einer eigenen Spalte. Native Details gliedern die Phasen; zunächst ist die
  erste Phase offen, bei Suche oder Rollenfilter alle Trefferphasen.
  Zugeordnete Fachaufgaben bilden keine zusätzliche Navigationsebene:
  Beschreibungen, Inhalte, offene Punkte, Quellen und Zusammenhänge stehen
  direkt in der Schrittdetailansicht. Identische Einträge erscheinen einmal;
  unterschiedliche Geltungsgrenzen und Quellenkontexte bleiben erhalten.
  Nur Aufgaben ohne Schrittzuordnung stehen im ergänzenden Bereich. Eine Suche
  findet auch die fachlichen Details, der Rollenfilter verwendet die
  Schrittverantwortung. Die Darstellung fasst keine kanonischen Fachobjekte zusammen.
  Listen und Phasenköpfe verwenden 16 px Padding, 12 px Abstand, rechteckige
  neutrale Begrenzungen und bestehende Farb-/Fokustokens. Die Nummernspalte
  verwendet 3,25 em, Links 16 px, Metadaten 14 px. Diese Maße und Gliederung
  sind lokale Projektentscheidungen. Die Suche filtert unmittelbar auf der Seite.

- **project: Inhaltsabgrenzung.** Artikelansichten zeigen fachliche Abschnitte
  vor den offenen Klärungen in neutral begrenzten Rechtecken mit 24 px Padding
  (mobil 16 px). Arbeitsdetailseiten priorisieren vorhandene Bedienwege mit
  Voraussetzungen, Rechten, Aktionen und Ergebnisprüfung auf der Steel-Fläche.
  Status und explizite Geltung stehen direkt über dem Bedienweg. Ergänzende
  Informationen stehen rechts in einer Steel-Spalte mit zunächst geschlossenen
  nativen Details für offene Punkte, Fachkontexte, Beiträge und Quellen.
  Ohne Bedienweg bleiben vorhandene Fachtexte und Materialhinweise im Hauptbereich.
  Das Raster verwendet 2:1 Spalten, mindestens 280 px für die Ergänzungen und
  32 px Abstand; unter 1100 px stehen die Bereiche untereinander. Die ergänzende
  Spalte verwendet 24 px Padding (mobil 16 px), 20-px-Überschriften und 16-px-Text.
  Mobile Arbeitsdetailtitel verwenden wie Rollenprofile 32 px bei 1,2 Zeilenhöhe;
  Rücklinks stehen mit 24 px Abstand nebeneinander bzw. umbrechend.
  Beitragsinhalte, Quellenkontexte und Übungen bleiben einzeln aufklappbar.
  Diese Geometrie und Gliederung sind iPPM-Projektentscheidungen; bestehende
  Farb-/Fokustokens bleiben erhalten. Es entstehen weder neue Freigabestufen
  noch zusätzliche fachliche Datenbestände.

- **project: Startseite.** Die Root-Route zeigt einen eigenständigen Einstieg mit
  der bestehenden gemeinsamen Suche. Aufgaben, Prozesse und Wissen stehen als
  drei gleichwertige rechteckige Linkkarten nebeneinander; Rollen, Releases &
  Schulungen und der Lernbereich folgen als kompakte Steel-Karten. Unter
  1100 px werden die Karten untereinander dargestellt. Suchfläche und Karten
  verwenden 24 px Padding (mobil 16 px), Bereiche 40 px Abstand. Bestehende
  Typografie, Farb- und Fokustokens sowie Lucide-Symbole bleiben maßgeblich.
  Signalflächen hinter den primären Bereichssymbolen kennzeichnen die Einstiege.
  Ganze Karten sind benannte Tastaturlinks mit blauem Fokus. Die Startseite
  ergänzt keine fachlichen Inhalte, Statuskennzahlen oder zweite Inhaltsquelle.

- **project: Prozessnotation.** Rollen bilden Spalten, Phasen horizontale Bereiche;
  kanonische Reihenfolge bestimmt ausschließlich die Platzierung innerhalb einer
  Phase/Rollenspalte. Gemeinsame und unbelegte Rollen erhalten neutrale Spalten.
  Nummer/Titel, Rollen und beschriftete Metadaten stehen in semantischen Karten.
  48-px-Spaltengassen und 64-px-Zeilenabstände schaffen Platz für orthogonale
  SVG-Linien. 1200 px Mindestbreite ermöglicht lesbare Spalten mit lokalem
  horizontalem Scrollen. Bei höchstens 700 px verfügbarer Containerbreite wird
  eine vertikale Kompaktansicht mit denselben Karten, Metadaten und aufklappbaren
  Textverbindungen angezeigt. Diese Maße/Notation sind iPPM-Entscheidungen.
  Steel-/Weiß-Oberflächen, Signal für den gewählten Ansichtsbutton und blaue
  Fokuslinien verwenden vorhandene Tokens. Offene Punkte werden ausdrücklich
  benannt; ihre Warnungsbegrenzung ist nur eine zusätzliche Kennzeichnung.
  Hover-/Fokusvorschauen zeigen höchstens 160 Zeichen der Beschreibung und einen
  Hinweis zur Detailansicht. Sie verwenden maximal 280 px Breite, 12 px Padding
  und 14 px Schrift bei 1,35 Zeilenhöhe. Eingang, Ergebnis und vollständige
  offene Punkte stehen in der Schrittdetailansicht. Die Mausvorschau folgt dem
  Zeiger mit 12 px Abstand bevorzugt rechts und oberhalb; am Bildschirmrand
  wechselt sie nach links bzw. bleibt innerhalb eines 8-px-Randes. Bei
  Tastaturfokus dient die obere Kartenkante als Anker. Ein Portal verhindert
  Abschneiden im horizontalen Scrollbereich. Die Vorschau bleibt selbst
  hoverbar; 150 ms Schließverzögerung überbrücken den Abstand zur Karte.
  Scrollen/Größenänderungen schließen die Mausvorschau und positionieren eine
  weiterhin fokussierte Vorschau neu. Escape schließt beide Varianten.
  Benachbarte Schritte werden
  über gegenüberliegende Seiten direkt verbunden; längere Verbindungen wählen
  kurze, kollisionsfreie orthogonale Wege durch die bestehenden Gassen.
