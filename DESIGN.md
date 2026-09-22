---
version: alpha
name: TKMS Corporate Design
summary: Machine-readable design tokens and generation guardrails for TKMS digital interfaces, dashboards, technical documentation, and presentation-derived visual artefacts.
colors:
  primary: "#1A1A1A"
  secondary: "#303030"
  tertiary: "#FDEE66"
  surface: "#FFFFFF"
  surface-base-1: "#F4F4F4"
  surface-hover: "#E6E6E6"
  surface-active: "#D1D1D1"
  surface-inverted: "#303030"
  on-surface: "#1A1A1A"
  on-surface-secondary: "#767676"
  on-surface-inverted: "#FFFFFF"
  steel-medium: "#949494"
  steel-light: "#C2C2C2"
  neutral-85: "#3C3C3C"
  neutral-80: "#484848"
  neutral-70: "#5F5F5F"
  neutral-60: "#767676"
  neutral-40: "#A3A3A3"
  neutral-20: "#D1D1D1"
  neutral-10: "#E6E6E6"
  neutral-5: "#F4F4F4"
  signal-dark: "#FFFA94"
  signal: "#FDEE66"
  error: "#C42B2B"
  error-on-dark: "#FD8888"
  info: "#3B6BFC"
  info-on-dark: "#6289FD"
  success: "#52843D"
  success-on-dark: "#759D64"
  warning: "#F9A800"
typography:
  headline-display:
    fontFamily: "TKMS Headline, Arial, sans-serif"
    fontSize: 48px
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: 0em
  headline-lg:
    fontFamily: "TKMS Headline, Arial, sans-serif"
    fontSize: 32px
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: 0em
  headline-md:
    fontFamily: "TKMS Headline, Arial, sans-serif"
    fontSize: 24px
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: 0em
  headline-sm:
    fontFamily: "TKMS Headline, Arial, sans-serif"
    fontSize: 20px
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: 0em
  body-lg:
    fontFamily: "TKMS, Arial, sans-serif"
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0em
  body-md:
    fontFamily: "TKMS, Arial, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0em
  body-sm:
    fontFamily: "TKMS, Arial, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: 0em
  label-lg:
    fontFamily: "TKMS, Arial, sans-serif"
    fontSize: 16px
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: 0em
  label-md:
    fontFamily: "TKMS, Arial, sans-serif"
    fontSize: 14px
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: 0em
  label-sm:
    fontFamily: "TKMS, Arial, sans-serif"
    fontSize: 12px
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: 0.04em
rounded:
  none: 0px
spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  xxxl: 64px
  page-desktop: 48px
  page-mobile: 16px
  grid-columns-desktop: 12
  grid-columns-mobile: 4
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-surface-inverted}"
    typography: "{typography.label-md}"
    rounded: "{rounded.none}"
    padding: 16px
    height: 40px
  button-primary-hover:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-surface-inverted}"
    typography: "{typography.label-md}"
    rounded: "{rounded.none}"
    padding: 16px
    height: 40px
  button-primary-dark:
    backgroundColor: "{colors.signal-dark}"
    textColor: "{colors.primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.none}"
    padding: 16px
    height: 40px
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.none}"
    padding: 16px
    height: 40px
  card-default:
    backgroundColor: "{colors.surface-base-1}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: 24px
  card-dark:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-surface-inverted}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: 24px
  input-default:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: 12px
    height: 44px
  table-header:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-surface-inverted}"
    typography: "{typography.label-md}"
    rounded: "{rounded.none}"
    padding: 12px
  callout-takeaway:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: 16px
  status-error:
    backgroundColor: "{colors.error}"
    textColor: "{colors.on-surface-inverted}"
    typography: "{typography.label-md}"
    rounded: "{rounded.none}"
    padding: 12px
  status-info:
    backgroundColor: "{colors.info}"
    textColor: "{colors.on-surface-inverted}"
    typography: "{typography.label-md}"
    rounded: "{rounded.none}"
    padding: 12px
  status-success:
    backgroundColor: "{colors.success}"
    textColor: "{colors.on-surface-inverted}"
    typography: "{typography.label-md}"
    rounded: "{rounded.none}"
    padding: 12px
  status-warning:
    backgroundColor: "{colors.warning}"
    textColor: "{colors.primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.none}"
    padding: 12px
---

# TKMS Corporate Design System

## Overview

Create a precise, confident, technically competent, and calm interface for TKMS digital products, technical documentation, dashboards, process visualisations, and presentation-derived artefacts.

The visual language is industrial minimalism with Swiss-design discipline: strict geometric alignment, high information clarity, generous whitespace, limited colours, and no ornamental design. Every visual element must serve a functional purpose: hierarchy, navigation, interaction, grouping, status, or data interpretation.

Default to light mode. Use dark mode intentionally for immersive system views, technical dashboards, hero areas, or contexts where it creates a clear hierarchy—not as a decorative alternative.

The functional line is a defining TKMS structural element. When separation is necessary, use vertical signal-yellow lines rather than horizontal separators.

## Colors

The normative color values are in the YAML front matter. Do not introduce colours outside this palette.

- **Primary / TKMS Black** (`#1A1A1A`): Core text, primary light-mode actions, and high-contrast data values. Never substitute pure black (`#000000`).
- **Secondary / TKMS Steel Dark** (`#303030`): Dark surfaces, inverted containers, table headers, and secondary dark actions.
- **Signal** (`#FDEE66`): Deliberate emphasis, structural dividers, benchmarks, selected focal points, and take-away callouts. Never use it as routine text highlighting.
- **Signal Dark** (`#FFFA94`): Signal background for dark mode and high-contrast dark surfaces.
- **Neutral surfaces** (`#F4F4F4`, `#E6E6E6`, `#D1D1D1`): Quiet grouping and interaction-state layers in light mode.
- **Status colours**: Error `#C42B2B`, information `#3B6BFC`, success `#52843D`, and warning `#F9A800`. Use only to encode an explicit semantic status.

Use status labels, icons, values, or text in addition to status colour. Colour by itself must never carry essential meaning.

### Light and dark surfaces

| Purpose | Light mode | Dark mode |
|---|---|---|
| Base surface | White | TKMS Steel Dark |
| Raised/grouped surface | TKMS Black 5% | TKMS Black 85% |
| Hover state | TKMS Black 10% | TKMS Black 80% |
| Active/selected surface | TKMS Black 20% | TKMS Black 70% |
| Primary text | TKMS Black | White |
| Secondary text | TKMS Black 60% | TKMS Steel Light |
| Signal surface | TKMS Signal | TKMS Signal Dark |

## Typography

Use **TKMS Headline** for all display titles and headings. Use **TKMS** for body copy, controls, labels, forms, tables, metadata, and numerical data. If TKMS fonts are unavailable in a prototype, use the front-matter Arial fallback only; never replace them with decorative, rounded, or novelty fonts.

Use the typography tokens in the YAML front matter. Maintain a clear hierarchy:

- Display and page headings use TKMS Headline, regular weight.
- Content headings use TKMS Headline or TKMS bold when compact and data-dense.
- Default readable body text uses TKMS 16 px regular.
- Use 14 px for compact UI and 12 px only for subordinate metadata or exceptional dense tables.
- Highlight key decisions, terms, or figures with bold weight—never by setting normal text in signal yellow.
- Use sentence case for UI text. Use all caps only for compact labels, classifications, or template-defined areas.
- Write action titles that state the main conclusion or user task. In presentation contexts, do not end action titles with a period.

For static presentation-style lists, use the diamond bullet `◆`. In interactive products, prioritise semantic HTML lists and accessible interaction patterns; only render a diamond marker when it does not reduce usability.

## Layout

Use grid-based, left-aligned layouts with a deliberate visual reading order. Start with the primary task, decision, or insight; position supporting details second.

- Desktop: 12-column grid with a maximum content width appropriate to the application; use 48 px page padding as the starting point.
- Mobile: 4-column grid; use 16 px page padding as the starting point.
- Use the defined 4/8-based spacing scale. Increase space before introducing a border, divider, or coloured surface.
- Prefer broad, quiet base surfaces and contained content zones. Do not make every piece of content a floating card.
- Use vertical signal-yellow dividers only for meaningful column, phase, or system-boundary separation.
- Keep normal paragraphs, tables, forms, and data left aligned. Align numerical columns consistently to the right or decimal point.
- Design responsive behaviour intentionally. Preserve content hierarchy and readable typography instead of shrinking desktop layouts until they become dense.

For PowerPoint and slide-like artefacts, align text and graphic elements with the top-left edge of the headline. Action titles may occupy a maximum of two lines; use the same maximum for an optional subline.

## Elevation & Depth

TKMS is a flat design system. Establish hierarchy through scale, position, whitespace, tonal surface layers, typography, and functional borders—not through visual effects.

- Use no drop shadows, inner shadows, glows, glossy surfaces, transparent overlays, gradients, bevels, or 3D effects.
- Use `surface-base-1` for grouped content on light pages and `neutral-85` for grouped content on dark pages.
- Use a 1 px border only when it communicates an editable boundary, an interactive state, a selected item, a required grouping, or data structure.
- Avoid decorative outlines around cards, diagrams, illustrations, and images.

## Shapes

The TKMS shape language is sharp, rectangular, and technically precise.

- The only permitted corner token is `rounded.none: 0px`.
- All containers, cards, buttons, fields, dialogs, chips, callouts, and process nodes have sharp 90-degree corners.
- Do not use pills, rounded rectangles, circles as controls, soft containers, hexagons, speech bubbles, or organic decorative forms.
- A circle may appear only when its analytical meaning is clear, such as a circular progress visualization. It must remain flat and functional.

## Components

Use component tokens from the YAML front matter rather than creating arbitrary variations. All components have square corners and no shadow.

### Buttons

- Use one clear primary action per page, panel, or decision area.
- In light mode, primary buttons use TKMS Black with white text.
- In dark mode, primary buttons use TKMS Signal Dark with TKMS Black text.
- Primary button hover uses TKMS Steel Dark in light mode.
- Secondary actions use a flat neutral surface with purposeful, high-contrast text; a thin functional border is permitted where necessary.
- Use clear verb-first labels such as “Projektstatus öffnen”, “Freigabe prüfen”, or “Daten exportieren”.
- Buttons must provide visible keyboard focus using a high-contrast signal-yellow outline.

### Forms and controls

- Inputs are rectangular with visible labels. Do not use placeholder text as the only label.
- Use a 1 px functional border in the relevant foreground colour; use a 2 px signal-yellow outline for keyboard focus.
- Provide explicit error text adjacent to the affected control. Do not communicate an error only through a red border.
- Aim for a minimum target area of 44 × 44 px for touch controls.
- Selection, hover, focus, disabled, loading, and error states must be visibly distinct.

### Cards and panels

- Use cards only to group separate tasks, data sets, decisions, or functional modules.
- Use tonal contrast and spacing for grouping. Do not add shadows.
- Do not frame every card with a border. Use a border only when its function is clear.
- Use a vertical signal-yellow divider to structure deliberate comparisons or parallel workstreams.

### Navigation

- Keep navigation concise, text-led, and easy to scan.
- Make the selected state explicit with a signal-yellow vertical marker, a signal surface, or a clearly contrasting tonal state; do not rely on a slight colour change alone.
- Do not use icon-only primary navigation unless icons have accessible names and are already well understood by the intended users.

### Tables

- Table headers use flat TKMS Steel Dark with white text.
- Data rows are flat, clean, and left aligned. Never use alternating banded rows.
- Use thin functional rules, whitespace, and alignment to support scanning.
- Preserve readable type and hierarchy on narrow screens; reflow or transform complex tables rather than shrinking important information.

### Status and alerts

- Use Error, Information, Success, and Warning only for their literal semantic state.
- Pair status colour with an unambiguous label such as “Critical”, “Attention”, “Information”, or “Complete”.
- Use status colour as a purposeful marker, edge, or compact status field. Avoid decorative full-width colour blocks.

### Charts and KPI views

- Use flat two-dimensional charts only. Never use 3D charts, perspective, gradients, gloss, or ornamental texture.
- Use TKMS neutral colours for baseline series. Use signal yellow for one strategic target, benchmark, selection, or key deviation.
- Use status colours only when series or data points represent actual status semantics.
- Prefer direct labels over legends when space permits.
- Emphasize important KPIs with large TKMS bold values in TKMS Black or Steel Dark. State unit, period, baseline, and direction clearly.

### Process flows

- Build flows exclusively left-to-right or top-to-bottom.
- Use sharp rectangular nodes and right-angle routing.
- Use solid 1.5 pt signal-yellow connectors. A diamond end marker is permitted when it clearly conveys an endpoint, decision, or milestone.
- Separate phases and system boundaries with vertical signal-yellow lines.
- When an end state must be visually distinguished, render the final output node with a solid signal-yellow fill and TKMS Black text.

### Imagery and iconography

- Prefer authentic technical, industrial, engineering, manufacturing, software, data, or operational imagery.
- Images should be high contrast, precisely composed, and illuminated with cold white daylight where that suits the subject.
- Leave intentional quiet space for overlaid content when an image functions as a hero or contextual surface.
- Do not place semi-transparent shapes or decorative overlays on imagery.
- Icons must be flat, geometric, and 2D. Use only icons that clarify an action, status, category, or data point.
- Do not use emojis as interface icons.

### Presentation-specific elements

- Use official TKMS slide layouts where available; apply Reset after assigning a layout.
- Action title: TKMS Headline, 20 pt, regular, maximum two lines.
- Subline: TKMS Headline, 18 pt, regular, maximum two lines.
- Body text: 16 pt by default; normally no smaller than 12 pt for figures or tables.
- Content headings: TKMS bold, 16 pt, left aligned.
- Take-away box: use only where a single strategic conclusion requires emphasis; place it bottom left above the source area, filled with TKMS Signal and TKMS Black text.
- Sources, legends, and footnotes belong in the master-defined bottom-left zone below the take-away space.
- Footer format: `Date — Presentation title — Name`; apply through the master/header-footer process.
- ISMS and VS classification treatment is mandatory when required by content and template. Use Efficient Elements where available.

## Do's and Don'ts

### Do

- Do use approved logo assets without alteration, distortion, recolouring, crop, shadow, or effect.
- Do choose the black or steel-dark logo on light surfaces and the white logo on dark surfaces.
- Do use TKMS Black `#1A1A1A` instead of pure black.
- Do make the primary task, insight, or decision visually dominant.
- Do use whitespace, tonal layers, typography, and grid alignment to create hierarchy.
- Do use Signal Yellow sparingly and deliberately for focal emphasis, a structural line, a selected item, a key benchmark, or a take-away.
- Do meet WCAG AA contrast requirements for normal text and essential controls.
- Do make keyboard focus, interaction state, status, and validation feedback explicit.
- Do use sharp rectangles, flat surfaces, and exact alignment.
- Do apply German notation in German UI: `1.000 Mio €`, `70,1 %`, `09. November 2025`, `(FTE)`, and `AS-IS/TO-BE`.
- Do apply American English notation in English UI: `€1,000m`, `70.1%`, `Nov 09, 2025`, `(FTE)`, and `Input/Output`.

### Don't

- Don't use pure black `#000000`.
- Don't use rounded corners, pills, shadows, gradients, transparency overlays, bevels, glossy surfaces, hexagons, or 3D effects.
- Don't use decorative borders, decorative icons, arbitrary standard colours, or non-approved colour fills.
- Don't use horizontal separator lines between content sections. Use whitespace, tonal grouping, or a vertical signal-yellow divider.
- Don't use signal yellow as normal text highlighting.
- Don't rely on colour alone to communicate status, priority, validation, or selection.
- Don't use alternating table row fills.
- Don't add visual elements that cannot be linked to content, navigation, interaction, grouping, or data meaning.
- Don't use maritime motifs such as ships, submarines, anchors, waves, or shipyards in generic industrial, IT, process, dashboard, or documentation assets unless the user explicitly requests a maritime subject.

## Quality Check

Before generating or delivering a screen, diagram, prototype, slide, or component, verify the following:

- [ ] Only approved front-matter colour tokens are used.
- [ ] No pure black, rounded corners, shadows, gradients, transparent overlays, 3D effects, hexagons, or decorative outlines are present.
- [ ] Typography follows the TKMS Headline/TKMS hierarchy with readable sizes.
- [ ] The layout is grid-based, left aligned, spacious, and responsive.
- [ ] Signal Yellow is limited to a specific functional emphasis or structural use.
- [ ] All interactive controls provide clear labels and visible focus states.
- [ ] Status has a text, icon, or pattern cue in addition to colour.
- [ ] Text and component foreground/background combinations meet WCAG AA contrast.
- [ ] Tables use flat Steel Dark headers, white header text, and no banded rows.
- [ ] Charts remain flat, 2D, semantically coloured, and legible.
- [ ] Presentation artefacts contain necessary classification, footer, source, and take-away treatments.
