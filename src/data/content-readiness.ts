import { registerObject } from '../lib/editorial-registry';
import type { Article } from './types';

// Editorial usability of this bounded content, independent of source/review status.
export type ContentReadiness = 'Nutzbar' | 'Teilweise belegt' | 'Platzhalter';
export const contentReadiness: Record<string, { state: ContentReadiness; note: string }> = {
  'guide-project-permissions': {
    state: 'Nutzbar',
    note: 'Zusammenhängender Owner-Wechsel mit Voraussetzungen und Ergebnisprüfung. Weitere Rechte- und Build-Team-Wirkungen bleiben begrenzt.',
  },
  'guide-deliverables-milestones': {
    state: 'Nutzbar',
    note: 'Arbeitsweg von Liefergegenständen und Zahlungsbedingungen zu Liefer- und Zahlungsmeilensteinen. Große Listen und die Zielumgebung bleiben zu prüfen.',
  },
  'faq-milestone-dates': {
    state: 'Nutzbar',
    note: 'Belegte Unterscheidung von Stichtag, Plantermin und Zahlungsfrist im beschriebenen R1-Kontext.',
  },
  'guide-save-publish-checkin': {
    state: 'Nutzbar',
    note: 'Getrennte Speicherwege für Liste, PDP, Projektplan und Owner-Wechsel mit Ergebnisprüfung. Keine formale Informationsfreigabe.',
  },
  'guide-project-objectives': {
    state: 'Nutzbar',
    note: 'Ziele, Annahmen und Randbedingungen sind mit Eingaben und Ergebnisprüfung zusammenhängend beschrieben.',
  },
  'ippm-release-2-scope': {
    state: 'Teilweise belegt',
    note: 'Planungsumfang ist belegt. Implementierung, Bedienwege, Termine und Freigaben der Zielreleases fehlen.',
  },
  'guide-external-milestones': {
    state: 'Teilweise belegt',
    note: 'Externe Meilensteine sind beschrieben. Der FAT-Vermerk und verfügbare Ext-Subtypen sind nicht abschließend geklärt.',
  },
  'guide-phases-tailoring': {
    state: 'Teilweise belegt',
    note: 'Begrenztes Tailoring ist beschrieben. Weitere Review-Terminwirkungen und der vollständige Planungsweg bleiben offen.',
  },
  'guide-escalation-capture': {
    state: 'Teilweise belegt',
    note: 'Erfassung und Adressierung sind beschrieben. Empfängerzugriff, Resolution-Historie und vollständige Bearbeitung sind offen.',
  },
  'guide-status-orientation': {
    state: 'Teilweise belegt',
    note: 'PM-Pflegeweg ist beschrieben. Pflegezyklus, Rechte und Bestands-Sites bleiben zu prüfen; PMO Status bleibt beim PMO.',
  },
  'guide-r1-reporting': {
    state: 'Teilweise belegt',
    note: 'Begrenzter Abgleich von Projektstatusübersicht, veröffentlichtem Plan und PDP Status mit Voraussetzungen und Ergebnisprüfung. Praktische Erprobung, Rechte-/Bestands-Site-Reichweite und fachliche Freigabe bleiben offen; kein vollständiger Berichtsweg.',
  },
  'faq-role-vs-access': {
    state: 'Teilweise belegt',
    note: 'Rolle, Teamzuordnung und Einzelzugriff sind abgegrenzt. Die vollständige Rechte- und Synchronisationswirkung bleibt offen.',
  },
  'guide-project-handover': {
    state: 'Teilweise belegt',
    note: 'Übernahmeprüfung ist beschrieben. Vollständiger Antrag und PMO-Bereitstellung sind nicht als Gesamtweg belegt.',
  },
  'guide-project-master-data': {
    state: 'Teilweise belegt',
    note: 'Stammdaten und Start Date / EDC sind abgegrenzt. Zusätzliche EDC-Feldbereitstellung und Zielkonfiguration bleiben offen.',
  },
  'guide-project-organization': {
    state: 'Teilweise belegt',
    note: 'Organisationseinträge sind beschrieben. Finale Rollenlisten und Berechtigungswirkung bleiben gesondert zu prüfen.',
  },
  'guide-subproject-definition': {
    state: 'Teilweise belegt',
    note: 'System- und ILS-Definition sind beschrieben. Belege und Reichweite der gemeldeten Project-Purpose-Entfernung bleiben offen.',
  },
};

export function readinessFor(article: Article) {
  return (
    contentReadiness[article.id] ?? {
      state: 'Platzhalter' as const,
      note: 'Kein redaktionell bewerteter Fachnachweis. Demonstrationsinhalt ist kein Bediennachweis.',
    }
  );
}

Object.entries(contentReadiness).forEach(([id, value]) =>
  registerObject(`readiness:${id}`, value, ['note'], 'src/data/content-readiness.ts'),
);
