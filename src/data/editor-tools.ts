import type { ToolSelection } from './domain';

// Curated individual destinations for local editing. Aliases do not rewrite source content.
export const editorToolGroups = [
  {
    label: 'PDP',
    tools: [
      {
        id: 'tool-pdp-overview',
        label: 'PDP > Overview',
        aliases: ['PDP Overview', 'PWA / Project Center / PDP Overview'],
      },
      { id: 'tool-pdp-scope', label: 'PDP > Scope', aliases: ['PDP Scope', 'PWA / PDP Scope'] },
      {
        id: 'tool-pdp-deliverables',
        label: 'PDP > Scope > List of Deliverables',
        aliases: ['List of Deliverables', 'PDP Scope / List of Deliverables'],
      },
      {
        id: 'tool-pdp-contract',
        label: 'PDP > Contract',
        aliases: ['PDP Contract', 'PWA / PDP Contract'],
      },
      {
        id: 'tool-pdp-payment',
        label: 'PDP > Contract > Terms of Payment',
        aliases: ['PDP Contract / Terms of Payment'],
      },
      { id: 'tool-pdp-objectives', label: 'PDP > Objectives', aliases: ['PDP Objectives'] },
      {
        id: 'tool-pdp-objectives-list',
        label: 'PDP > Objectives > Objectives-Liste',
        aliases: ['PDP Objectives / Objectives-Liste', 'PDP > Objectives / Objectives-Liste'],
      },
      { id: 'tool-pdp-organisation', label: 'PDP > Organisation', aliases: ['PDP Organisation'] },
      {
        id: 'tool-pdp-subprojects',
        label: 'PDP > Organisation > Subprojects',
        aliases: ['Organisation / Subprojects', 'PDP Organisation / Subprojects'],
      },
      { id: 'tool-pdp-status', label: 'PDP > Status', aliases: ['PWA · PDP Status', 'PDP Status'] },
      { id: 'tool-pdp-escalations', label: 'PDP > Escalations', aliases: ['PDP Escalations'] },
      {
        id: 'tool-pdp-escalations-list',
        label: 'PDP > Escalations > Liste Escalations',
        aliases: [
          'PWA · PDP Escalations / Liste Escalations',
          'PDP > Escalations / Liste Escalations',
        ],
      },
      {
        id: 'tool-pdp-system-overview',
        label: 'PDP > System Overview',
        aliases: ['System Overview', 'PDP System Overview'],
      },
      { id: 'tool-pdp-system-scope', label: 'PDP > System Scope', aliases: ['PDP System Scope'] },
      {
        id: 'tool-pdp-system-organisation',
        label: 'PDP > System Organisation',
        aliases: ['PDP System Organ.', 'PDP System Organisation'],
      },
      {
        id: 'tool-pdp-ils-overview',
        label: 'PDP > ILS Overview',
        aliases: ['ILS Overview', 'PDP ILS Overview'],
      },
      { id: 'tool-pdp-ils-scope', label: 'PDP > ILS Scope', aliases: ['PDP ILS Scope'] },
      {
        id: 'tool-pdp-ils-organisation',
        label: 'PDP > ILS Organisation',
        aliases: ['PDP ILS Organisation'],
      },
    ],
  },
  {
    label: 'PWA',
    tools: [
      { id: 'tool-pwa', label: 'PWA', aliases: [] },
      { id: 'tool-project-center', label: 'PWA > Project Center', aliases: ['Project Center'] },
      {
        id: 'tool-project-permissions',
        label: 'PWA > Project Center > Project Permissions',
        aliases: ['Project Permissions', 'PWA / Project Center / Project Permissions'],
      },
      {
        id: 'tool-build-team',
        label: 'PWA > Project Center > Build Team',
        aliases: ['Build Team', 'Build a Team'],
      },
      {
        id: 'tool-pmo-status',
        label: 'PWA > Project Center > PMO Status',
        aliases: ['PWA / Project Center / PMO Status'],
      },
      {
        id: 'tool-project-programmes',
        label: 'PWA > Project Center > View: Programme und Projekte',
        aliases: ['PWA > Project Center > Programme und Projekte'],
      },
      {
        id: 'tool-project-subprojects',
        label: 'PWA > Project Center > View: Projekte und Teilprojekte',
        aliases: ['PWA > Project Center > Projekte und Teilprojekte'],
      },
      {
        id: 'tool-project-reporting',
        label: 'PWA > Project Center > View: Projektfortschritt- und -status',
        aliases: [
          'PWA / Project Center – Projektfortschritt- und -status',
          'PWA > Project Center > Projektfortschritt- und -status',
        ],
      },
      { id: 'tool-project-site', label: 'Project Site', aliases: [] },
    ],
  },
  {
    label: 'MS Project Client',
    tools: [
      { id: 'tool-project-client', label: 'MS Project Client', aliases: [] },
      {
        id: 'tool-client-view-10',
        label: 'MS Project Client > Ansicht 10 Phasen- und Meilensteinplan',
        aliases: [
          'Ansicht 10',
          'Ansicht 10 Phasen- und Meilensteinplan',
          'MS Project Client / Ansicht 10',
          'MS Project Client / Ansicht 10 Phasen- und Meilensteinplan',
          'MS Project Client · 10 Phasen- und Meilensteinplan',
        ],
      },
      {
        id: 'tool-client-view-11',
        label: 'MS Project Client > Ansicht 11 Review Status',
        aliases: ['Ansicht 11', 'Ansicht 11 Review Status'],
      },
      {
        id: 'tool-client-view-20',
        label: 'MS Project Client > Ansicht 20 Projektstrukturplan',
        aliases: ['Ansicht 20', 'Ansicht 20 Projektstrukturplan'],
      },
      {
        id: 'tool-client-view-30',
        label: 'MS Project Client > Ansicht 30 Ablauf- und Terminplan',
        aliases: ['Ansicht 30', 'Ansicht 30 Ablauf- und Terminplan'],
      },
      {
        id: 'tool-client-view-40',
        label: 'MS Project Client > Ansicht 40 Projektfortschritt',
        aliases: ['Ansicht 40', 'Ansicht 40 Projektfortschritt'],
      },
    ],
  },
  {
    label: 'Weitere Werkzeuge',
    tools: [
      {
        id: 'tool-topdesk',
        label: 'Self Service Portal',
        aliases: ['TopDesk', 'TopDesk (Service UHD)', 'TopDesk / Service UHD'],
      },
    ],
  },
];
// Reserve retired IDs. Their text values remain available only at the existing field.
export const retiredEditorTools = [
  {
    id: 'tool-client-published-plan',
    label: 'MS Project Client > veröffentlichter Projektplan',
    aliases: ['MS Project Client / veröffentlichter Projektplan'],
  },
];
export const editorTools = /* @__PURE__ */ editorToolGroups.flatMap((group) => group.tools);
export function editorToolFor(value: string) {
  return editorTools.find((tool) => tool.label === value || tool.aliases.includes(value));
}
export function toolSelectionText(selection: ToolSelection) {
  const names = selection.toolIds.map(
    (id) =>
      (editorTools.find((tool) => tool.id === id) ??
        retiredEditorTools.find((tool) => tool.id === id))!.label,
  );
  return `${selection.relation === 'all' ? 'Gemeinsam' : 'Alternativen'}: ${names.join('; ')}`;
}
