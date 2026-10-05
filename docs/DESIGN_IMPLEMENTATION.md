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
- **project: Logo.** Die dunkle Sidebar verwendet das originale Simple-on-dark-Asset mit proportionaler Breite des verfügbaren 216-px-Bereichs (mobil 272 px). Es erhält keine Effekte oder Beschneidung. Ein leerer Bild-Alternativtext verhindert eine doppelte Ansage neben dem benannten Startseitenlink. Die Full-Assets stehen bereit, ohne zusätzlichen Lockup. Größe/Abstand sind Layoutentscheidungen, keine behauptete Mindestgröße oder Schutzzone.
- **project: Komponenten.** Text- und Icon-Buttons verwenden Pill-Geometrie (CSS-Radius 999 px); Eingaben, Selects, Textareas und der vorhandene Editor-Dialog den kleinen 4-px-Radius. Inhaltsflächen bleiben rechteckig ohne zusätzliche Effekte. Es gibt keine globale Radius-, Schatten- oder Verlaufsregel. Bestehende Touch-Mindestmaße 44 px und Padding 12/16 px bleiben Projektwerte. Fokus verwendet 2-px-Blau mit 3 px Abstand, an Buttons 4 px; der belegte 5-px-Fokuslinienradius bleibt ohne eigene Fokusliniengeometrie ungenutzt.
- **project: Zustände.** Primary/Secondary-Default und Hover/Pressed folgen den belegten hellen/dunklen Farbwerten. Deaktivierte Bedienelemente verwenden ausdrücklich neutrale Flächen, Text und Begrenzungen (keine Opazitäts-Invertierung). Merkliste nutzt zusätzlich zum gedrückten Zustand eine neutrale aktive Fläche. Formular-Hover verstärkt die Begrenzung; geöffnete Accordion-Zusammenfassungen erhalten eine Unterstreichung. Focus bleibt unabhängig davon sichtbar. Die Sidebar ist eine explizite dunkle Oberfläche, der Reader eine helle; ein neuer Modusumschalter ist nicht vorgesehen.
- **project: Semantik und Bestand.** Vorhandene Fehler markieren weiterhin tatsächliche Speicher-/Validierungsfehler. Artikelstatus bleibt textuell; `approved` wird nicht als Unternehmensfreigabe oder allgemeiner Erfolgsstatus eingefärbt. Footer-Farben und bestehende funktionale Prozess-/Geltungsmarker bleiben erhalten. Bestehende Lucide-Symbole werden weiterverwendet, ohne sie als TKMS-geprüft zu bezeichnen.

Offen bleiben die in `DESIGN.md` genannten Figma-Detailwerte, Schriftdateien, vollständigen Komponentenabmessungen, Logo-Mindestgrößen/Schutzzonen und Dropdown-Schattenparameter. Es werden dafür keine Markenfreigaben behauptet.

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
