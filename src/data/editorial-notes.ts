import { registerObject } from '../lib/editorial-registry';
// Verbatim rendered paragraphs relocated from the article components. IDs are permanent.
export const editorialNotes = [
  {
    id: 'knowledgecontext-0',
    text: 'Geprüfte Zielumgebung: nicht angegeben. Die technischen Bewertungen beziehen sich auf die jeweils begrenzten Quellenkontexte.',
  },
  {
    id: 'knowledgecontext-1',
    text: 'Vor praktischer Nutzung müssen die unten genannten fachlichen und technischen Voraussetzungen nachgewiesen sein. Dieser Beitrag bietet Orientierung.',
  },
  {
    id: 'knowledgecontext-2',
    text: 'Für diesen Schritt liegt hier kein ausführbarer Bedienweg vor. Die Orientierung und Prüffragen im fachlichen Kontext benennen die Vorbereitung und die offenen Nachweise.',
  },
  {
    id: 'knowledgecontext-3',
    text: 'Diese Ergebnisse sind zu prüfen; ihre Beschreibung ist kein erfolgreicher Test mit Ihren Konten.',
  },
  {
    id: 'knowledgecontext-4',
    text: 'Alle Projekt- und Kontobezeichnungen sind fiktiv. Prüfen Sie den tatsächlichen Ausgangszustand im geeigneten Schulungssystem. Einträge hier werden nicht gespeichert; ein praktischer Durchlauf ist nicht belegt.',
  },
  {
    id: 'knowledgecontext-5',
    text: 'Auch eine bestätigte Beobachtung erledigt keine offenen Issues. Build Team, effektive Rechte, Bestands-Sites und Schulungsumgebung bleiben gesondert zu prüfen.',
  },
  {
    id: 'knowledgecontext-6',
    text: 'Die Aussagen bleiben nach Quelle und Reichweite getrennt. Ein beschriebener oder geübter Einzelweg gibt diesen Center-Inhalt nicht fachlich frei.',
  },
  {
    id: 'knowledgecontext-7',
    text: 'Die Fundstellen beziehen sich auf die lokal analysierten Dateien. Originaldateien werden hier nicht geladen; referenzierte TTT-Originale und Quick Guides sind nicht als verfügbare Downloads hinterlegt.',
  },
  {
    id: 'ownerchangearticle-8',
    text: 'Diese Ergebnisse sind zu prüfen; ihre Beschreibung ist kein erfolgreicher Test mit Ihren Konten.',
  },
  {
    id: 'milestoneplanningarticle-9',
    text: 'Beschriebenes Ergebnis laut Entwurf; kein erfolgreicher Test mit Ihren Konten.',
  },
];
editorialNotes.forEach((item) =>
  registerObject('note:' + item.id, item, ['text'], 'src/data/editorial-notes.ts'),
);
