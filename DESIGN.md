---
version: "2026-10-04"
name: "TKMS Corporate Design — iPPM implementation profile"
status: "working-reference"
scope: "digital interfaces for iPPM Knowledge & Training Center"
source_of_truth:
  verified_at: "2026-10-04"
  foundations: "https://www.figma.com/design/QvoaMhaiaLSdxFs3kBEKFG?node-id=321-2"
  components: "https://www.figma.com/design/57itDZCyeZS0j00XWd7wAJ?node-id=0-1"
  modules: "https://www.figma.com/design/si7aAjDqVuNmknYfkBJmM1?node-id=0-1"
  note: "This file is an implementation profile derived from the verified Figma copies. Figma remains authoritative for concrete component geometry, variants, assets and bindings."

branding:
  product: "iPPM"
  decision_level: "project"
  product_logo:
    rule: "Use the provided iPPM logo assets as the default application/product logo. They replace the TKMS wordmark in ordinary iPPM product UI."
    full:
      on-light: "public/brand/ippm/ippm-logo-full-on-light.png"
      on-dark: "public/brand/ippm/ippm-logo-full-on-dark.png"
    simple:
      on-light: "public/brand/ippm/ippm-logo-simple-on-light.png"
      on-dark: "public/brand/ippm/ippm-logo-simple-on-dark.png"
    default-variant: "simple"
    preserve:
      - "original proportions"
      - "transparent background"
      - "original artwork"
    forbid:
      - "retyping or rebuilding the logo"
      - "recoloring"
      - "distortion"
      - "drop shadow, glow, outline or gradient effects"
  tkms_logo:
    default-in-product-ui: false
    rule: "Do not use the TKMS wordmark as the standard iPPM application logo. Use it only where an explicit corporate, legal, template or sender context requires it."

evidence_levels:
  verified: "Directly checked in the Figma copies on 2026-10-04."
  derived: "Implementation guidance inferred from verified references; not an additional brand rule."
  project: "iPPM-specific decision; not claimed as a general TKMS rule."
  open: "Not verified. Do not invent a replacement value."

colors:
  primitives:
    tkms-black: "#1A1A1A"
    tkms-white: "#FFFFFF"
    signal-light: "#FDEE65"
    signal-dark: "#FFFA94"
    steel-90: "#303030"
    steel-85: "#3C3C3C"
    steel-80: "#484848"
    steel-70: "#5F5F5F"
    steel-60: "#767676"
    steel-50: "#949494"
    steel-40: "#A3A3A3"
    steel-30: "#C2C2C2"
    steel-20: "#D1D1D1"
    steel-10: "#E6E6E6"
    steel-5: "#F4F4F4"
    error-light: "#C42B2B"
    error-dark: "#FD8888"
    focus-light: "#3863E5"
    focus-dark: "#6289FD"
    info: "#3B6BFC"
    success-light: "#52843D"
    success-dark: "#759D64"
    warning-light: "#D87621"
    warning-dark: "#F9A800"

  semantic:
    light:
      background-base-0: "#FFFFFF"
      background-base-1: "#F4F4F4"
      background-hover: "#E6E6E6"
      background-active: "#D1D1D1"
      background-inverted: "#303030"
      background-signal: "#FDEE65"
      text-primary: "#1A1A1A"
      text-secondary: "#767676"
      text-inverted: "#FFFFFF"
      text-disabled: "#C2C2C2"
      text-on-signal: "#1A1A1A"
      icon-primary: "#1A1A1A"
      icon-secondary: "#767676"
      border-primary: "#1A1A1A"
      border-secondary: "#767676"
      focus: "#3863E5"
      logo: "#1A1A1A"
    light-soft:
      background-base-0: "#F4F4F4"
      background-base-1: "#FFFFFF"
      background-hover: "#E6E6E6"
      background-active: "#D1D1D1"
      background-inverted: "#3C3C3C"
      background-signal: "#FDEE65"
      text-primary: "#1A1A1A"
      text-secondary: "#5F5F5F"
      text-inverted: "#FFFFFF"
      text-disabled: "#C2C2C2"
      text-on-signal: "#1A1A1A"
      focus: "#3863E5"
      logo: "#1A1A1A"
    dark:
      background-base-0: "#303030"
      background-base-1: "#3C3C3C"
      background-hover: "#484848"
      background-active: "#484848"
      background-inverted: "#FFFFFF"
      background-signal: "#FFFA94"
      text-primary: "#FFFFFF"
      text-secondary: "#C2C2C2"
      text-inverted: "#1A1A1A"
      text-disabled: "#5F5F5F"
      text-on-signal: "#1A1A1A"
      icon-primary: "#FFFFFF"
      icon-secondary: "#C2C2C2"
      border-primary: "#FFFFFF"
      border-secondary: "#C2C2C2"
      focus: "#6289FD"
      logo: "#FFFFFF"
    dark-soft:
      background-base-0: "#3C3C3C"
      background-base-1: "#303030"
      background-hover: "#484848"
      background-active: "#5F5F5F"
      background-inverted: "#F4F4F4"
      background-signal: "#FFFA94"
      text-primary: "#FFFFFF"
      text-secondary: "#D1D1D1"
      text-inverted: "#1A1A1A"
      text-disabled: "#5F5F5F"
      text-on-signal: "#1A1A1A"
      focus: "#6289FD"
      logo: "#FFFFFF"

typography:
  family:
    headline: "TKMS Headline"
    copy: "TKMS"
    fallback: null
  size:
    tagline: {desktop: 18, mobile: 18}
    headline-h1-display: {desktop: 96, mobile: 44}
    headline-h1: {desktop: 64, mobile: 48}
    headline-h2: {desktop: 56, mobile: 32}
    headline-h3: {desktop: 48, mobile: 28}
    headline-h4: {desktop: 40, mobile: 24}
    headline-h5: {desktop: 32, mobile: 20}
    headline-h6: {desktop: 20, mobile: 18}
    copy-24: {desktop: 24, mobile: 22}
    copy-20: {desktop: 20, mobile: 20}
    copy-18: {desktop: 18, mobile: 18}
    copy-16: {desktop: 16, mobile: 16}
    copy-14: {desktop: 14, mobile: 14}
    keyfacts-headline-text: {desktop: 24, mobile: 24}
    keyfacts-headline-number: {desktop: 64, mobile: 64}
    navigation-level-1: {desktop: 24, mobile: 20}
    navigation-level-2: {desktop: 20, mobile: 16}
    navigation-level-3: {desktop: 16, mobile: 16}
    navigation-meta: {desktop: 16, mobile: 16}
    quote-large: {desktop: 80, mobile: 58}
    quote-regular: {desktop: 44, mobile: 32}
    quote-small: {desktop: 32, mobile: 28}
  verified-style-examples:
    headline-h1:
      size-desktop: "64px"
      line-height: "100%"
      letter-spacing: "1%"
    copy-regular:
      size-desktop: "18px"
      line-height: "135%"
      letter-spacing: "0%"

layout:
  desktop:
    columns: 12
    margin: "80px"
    gutter: "24px"
    verified-reference-width: "1440px"
  mobile:
    columns: 6
    margin: "24px"
    gutter: "16px"
    verified-reference-width: "360px"
  css-breakpoints: null
  tablet-layout: null
  global-max-width: null

spacing:
  scale: [4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96, 160]
  mobile-padding: 24
  headline-copy: 24

geometry:
  corner-radius-small: "4px"
  corner-radius-small-focusline: "5px"
  rule: "Do not apply one global radius to every component. Use the geometry of the referenced component."
  pills: "Buttons and tags may be pill-shaped where shown by the component reference."

components:
  primary-button:
    light:
      background-default: "#FDEE65"
      background-hover-pressed: "#303030"
      text-default: "#1A1A1A"
      text-hover: "#FFFFFF"
      focus: "#3863E5"
    dark:
      background-default: "#FFFA94"
      background-hover-pressed: "#FFFFFF"
      text-default: "#1A1A1A"
      text-hover: "#1A1A1A"
      focus: "#6289FD"
  secondary-button:
    light:
      border: "#767676"
      border-hover: "#303030"
      background-default: "#FFFFFF"
      background-hover: "#303030"
      text: "#1A1A1A"
      text-hover: "#FFFFFF"
    dark:
      border: "#A3A3A3"
      border-hover: "#FFFFFF"
      background-default: "#303030"
      background-hover: "#FFFFFF"
      text: "#FFFFFF"
      text-hover: "#1A1A1A"
  focus:
    rule: "Use the component's visible blue focus treatment. Do not replace it with a global yellow focus outline."
  shadow:
    rule: "Do not impose a global no-shadow rule. 'Dropdown Shadow – Lightmode' exists; exact parameters remain open."
  gradient:
    rule: "Do not impose a global no-gradient rule. Verified references include a dark hero gradient and a video gradient."
---

# TKMS Corporate Design — iPPM implementation profile

## 1. Purpose and precedence

This file is the compact implementation guide for the **iPPM Knowledge & Training Center**.

It is intentionally smaller than the full Figma review documentation, but it must stay aligned with the verified TKMS digital design references.

Use this precedence when implementing or reviewing UI:

1. **Concrete Figma component/module reference**
2. **Verified values in this `DESIGN.md`**
3. **Existing iPPM application pattern that does not contradict 1–2**
4. **Project-specific decision explicitly documented as such**
5. If none applies: **leave the point open; do not invent a “TKMS” rule**

A value marked `null`, `open`, or described as not verified is deliberately unspecified.

## 2. Source status

Verified on **04.10.2026**:

- Foundations (Kopie): logo, colors, typography, icons, grid, spacing and all 169 local variable definitions
- Components (Kopie): all 14 numbered component areas and the local 11-token collection
- Modules (Kopie): all 31 numbered module areas; selected notes/compositions and example pages

This is a **working implementation reference**, not a new independent brand approval.

Do not silently transfer rules from unrelated TKMS print material, old Figma originals, other design systems, or the previous repository `DESIGN.md` when they conflict with the verified sources.

## 3. Visual character

Use:

- the **iPPM product logo** as the standard visible product/application mark; choose the correct light/dark asset for the surface;
- strong typography and clear hierarchy;
- neutral white/Steel surfaces;
- signal yellow for deliberate actions and emphasis;
- precise rectangular content areas;
- component-specific geometry, including pill-shaped buttons/tags where the component specifies them;
- generous whitespace and deliberate responsive composition;
- existing TKMS icons/assets instead of arbitrary external icon families;
- technical/maritime imagery where it is relevant to the actual content.

Do not turn these characteristics into global restrictions that contradict a concrete component or module.

## 4. iPPM product logo

The **iPPM logo supplied with this project replaces the TKMS wordmark as the default logo of the iPPM Knowledge & Training Center**.

This is an **iPPM project decision**, not a claim that the TKMS corporate logo rules have changed.

### 4.1 Canonical assets

Use these repository paths:

| Purpose | Surface | Asset |
|---|---|---|
| Full logo with subtitle | light | `public/brand/ippm/ippm-logo-full-on-light.png` |
| Full logo with subtitle | dark | `public/brand/ippm/ippm-logo-full-on-dark.png` |
| Simple iPPM wordmark | light | `public/brand/ippm/ippm-logo-simple-on-light.png` |
| Simple iPPM wordmark | dark | `public/brand/ippm/ippm-logo-simple-on-dark.png` |

`on-light` means the artwork is dark and intended for a light surface.  
`on-dark` means the artwork is light and intended for a dark surface.

### 4.2 Variant selection

Use the **simple logo as the default application/header mark** because it remains legible at smaller UI sizes.

Use the **full logo** when the expanded product name is useful and sufficient space is available, for example on:

- landing/start pages;
- login or welcome contexts;
- About / product-information views;
- large hero or presentation-style product identification.

Do not show the full and simple variants next to each other in the same brand lockup.

### 4.3 Surface selection

- Light or Light soft background → use the corresponding `*-on-light.png` asset.
- Dark or Dark soft background → use the corresponding `*-on-dark.png` asset.
- On imagery, use a logo only when contrast remains clear; otherwise move it onto a suitable verified surface rather than adding an invented glow, outline or backing shape.

Do not recolor a light logo into a dark logo or vice versa in CSS/SVG filters. Select the correct supplied asset.

### 4.4 Integrity rules

Always:

- use the supplied artwork;
- preserve the original aspect ratio;
- preserve the transparent background;
- scale uniformly;
- keep the logo visually separated from adjacent navigation/content.

Never:

- rebuild `iPPM` as live text;
- change individual letter geometry;
- stretch, skew, rotate or crop the artwork;
- recolor it;
- add shadows, glows, borders, gradients or other decorative effects;
- place another product/corporate mark into the same lockup unless a specific approved layout requires it.

Exact minimum size and protection-zone values for the iPPM assets have **not** been provided. Do not invent them as TKMS rules. Choose a size that preserves legibility in the concrete layout and verify visually.

### 4.5 TKMS wordmark in iPPM

The TKMS wordmark is **not the default application/product logo** for this repository.

Use the TKMS logo only when a separate requirement explicitly calls for corporate identity, legal attribution, a corporate template, or a sender/owner context. In such cases it must remain distinct from the iPPM product logo; do not create a new combined lockup without an approved reference.

## 5. Color rules

### 5.1 Four Foundations modes

The supported Foundations modes are:

- `Light`
- `Light soft`
- `Dark`
- `Dark soft`

Do not generate Dark or Soft modes by automatic inversion or opacity tricks. Use the concrete semantic values.

### 5.2 Signal

Signal is:

- Light / Light soft: `#FDEE65`
- Dark / Dark soft: `#FFFA94`

Do **not** use `#FDEE66`.

Signal yellow is not a general body-text color. Text on a signal surface is `#1A1A1A`.

### 5.3 Focus

Focus is blue:

- Light / Light soft: `#3863E5`
- Dark / Dark soft: `#6289FD`

Do not introduce a generic signal-yellow keyboard focus rule.

### 5.4 Semantic status colors

Use status colors only for actual status semantics and pair them with text/icon/form so color is not the only carrier of meaning.

Relevant verified primitives include:

- error: `#C42B2B` light, `#FD8888` dark
- information/highlight: `#3B6BFC`, with text/focus variants in the Cold Blue family
- success: `#52843D` light, `#759D64` dark
- warning: `#D87621` light, `#F9A800` dark

## 6. Typography

Use the **TKMS** font family and the existing Figma text styles.

Verified family names include:

- Tagline
- Headline
- Intro
- Copy
- Keyfacts
- Navigation
- Numbers
- Quote

Do not invent numeric font weights, font-file paths, webfont configuration, or an approved fallback font. Those were not verified.

Important responsive values are defined in the YAML front matter.

Notable verified behavior:

- H1 Display: 96 desktop / 44 mobile
- H1: 64 desktop / 48 mobile
- H2: 56 desktop / 32 mobile
- Copy Regular: 18
- `copy/24`: 24 desktop / 22 mobile

Do not “normalize” these values because they look unusual.

Visual heading level and semantic HTML heading level may differ. Preserve a logical document outline.

## 7. Grid and spacing

Use the verified responsive grid:

| | Desktop | Mobile |
|---|---:|---:|
| Columns | 12 | 6 |
| Outer margin | 80 px | 24 px |
| Gutter | 24 px | 16 px |
| Verified reference | 1440 px | 360 px |

Do not restore the previous 4-column mobile grid, 48 px desktop margin, or 16 px mobile margin.

The verified spacing scale is:

`4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96, 160`

No fixed CSS breakpoint set, tablet rules, or global maximum content width were verified. Choose implementation breakpoints based on content and verify them visually rather than presenting them as TKMS source values.

## 8. Geometry

Do **not** use the former repository rule “all corners are 0 px”.

Verified spacing tokens include:

- `corner radius/small = 4px`
- `corner radius/small-focusline = 5px`

These are not universal radii.

Buttons and tags visibly use pill-shaped geometries in the component library. Other controls/content areas use their own geometry.

Rule: **copy geometry from the concrete component instead of applying a global shape rule.**

## 9. Component behavior

The verified component inventory contains:

1. Back to top
2. Button
3. Dropdowns
4. Images
5. Inputs
6. Links
7. Lists
8. Pagination
9. Selects
10. Slider controls
11. Tabs
12. Tags/Pills
13. Video
14. Headline + Copy

### Buttons

Primary button in Light / Light soft:

- default surface: signal `#FDEE65`
- default text: `#1A1A1A`
- hover/pressed surface: `#303030`
- hover text: `#FFFFFF`

Primary button in Dark / Dark soft:

- default surface: `#FFFA94`
- default text: `#1A1A1A`
- hover/pressed surface: `#FFFFFF`
- hover text: `#1A1A1A`

This replaces the old project rule that a light-mode primary button is black by default.

Use the concrete Regular/Small and Text/Text+icon/Icon variant shown in Figma. Do not invent fixed button heights or padding and call them TKMS values.

### Inputs / dropdowns / selects

Preserve the distinct states shown for each relevant component, such as:

- Default
- Hover
- Active/Open
- Focused
- Error
- Disabled
- Selected/Unselected
- Filled/Unfilled
- Indeterminate where explicitly shown

Do not collapse these into one generic state model.

### Tabs

Selected tabs use stronger underline/text emphasis. Focus remains a separate visible state.

### Tags/Pills

Selected, Unselected and Read only are separate variants. Interactive tags additionally show state variations including Hover, Focused, Disabled and Error.

Do not ban pills globally.

### Pagination

“Max. 6 lines” applies to **Line Pagination** for image/video. It is not a global limit for result pages or pagination items.

### Headline + Copy

The visible “100 characters max.” example applies to that specific copy area only. Do not turn it into a global text-length rule.

## 10. Modules and composition

The Modules copy contains 31 numbered module areas.

Open/review-marked areas on 04.10.2026:

- `Filter bar` — ❌
- `Job Search Results (Filter, List, pagination)` — ❌
- `Teaser: OU/TKMS` — ✅ with explicit `Review`

Treat these as design-specification status, not as application test results.

Verified/retained module-specific rules include:

- **Footer:** preserve its reference colors; do not freely recolor it into every mode.
- **Keyfacts:** three or four keyfacts; download box optional.
- **Image text:** side-by-side on desktop, vertical composition on mobile.
- **Quicklinks:** sticky; active area is always underlined.
- **Stage – Hero:** large image, white headline, dark gradient and thin yellow vertical line.
- **Multiteaser:** headline max. two lines, then ellipsis; image hover enlargement is documented.
- **Accordion:** Default, Hover, Focused, Disabled and Open states.
- **Timeline:** active year is visually enlarged and tied to its copy/image.

Use existing modules and preserve their hierarchy instead of rebuilding them from arbitrary cards.

## 11. Motion, shadows and gradients

Do not use the old blanket bans.

Verified references include:

- effect style `Dropdown Shadow – Lightmode` — exact shadow parameters remain open;
- Stage – Hero with a dark gradient;
- Video with `.gradient`;
- Multiteaser image hover example:
  - scale `1.1×`
  - `ease-out`
  - `150 ms`

The multiteaser values are a **component example**, not a global motion system.

If reduced motion is implemented, preserve functionality without requiring hover animation.

## 12. Images and icons

Use the existing TKMS icon vectors where available.

Do not claim a specific external icon library is TKMS-approved.

Verified image themes include:

- maritime products;
- ships and submarines;
- technical/manufacturing environments;
- employees in realistic work/protective environments.

For the iPPM Knowledge & Training Center, use imagery only when it supports the content. Do not add maritime motifs merely as decoration.

Respect responsive crop/focus. Exact universal aspect ratios and hero heights remain open.

## 13. Accessibility and interaction quality

Preserve visible focus treatment and test it against the actual background.

Use additional text/form/icon cues for state and validation; do not rely on color alone.

For interactive implementation:

- associate labels and errors programmatically with inputs;
- provide accessible names for icon controls and meaningful images;
- ensure Tabs, Dropdowns, Accordion and Forms are keyboard-operable;
- test narrow layouts, long content and text enlargement;
- validate contrast for the actual mode and state.

The Figma Accessibility reference shows 7:1, 4.5:1, 3:1 and 2.99:1 / Fail examples. This does not itself prove that an implemented application passes an accessibility standard.

## 14. iPPM project decisions

The following may be defined for this repository when needed, but they must be documented as **project-specific**, not as verified TKMS source rules:

- application breakpoints;
- max-width/container behavior between verified reference widths;
- fallback fonts;
- exact component heights or touch targets not present in the verified source;
- application-specific navigation information architecture;
- Knowledge Center-specific cards/status labels;
- process-diagram notation;
- chart conventions;
- documentation/presentation rules that are not part of the verified digital UI references.

When adding such a rule, prefix or annotate it as `project:` or explain it under this section.

## 15. Explicitly superseded rules from the previous repository file

Do **not** reintroduce the following as general TKMS rules:

- TKMS wordmark as the default iPPM application/product logo — use the supplied iPPM assets instead.
- `#FDEE66` as the signal color — use `#FDEE65` in light modes.
- 4-column mobile grid — verified value is 6.
- desktop page margin 48 px — verified value is 80 px.
- mobile page margin 16 px — verified value is 24 px.
- all corners `0px`.
- global prohibition of pills.
- global prohibition of shadows.
- global prohibition of gradients.
- light-mode primary button = black by default.
- signal-yellow focus outline.
- Arial as an approved fallback font.
- fixed button heights/paddings presented as verified TKMS values.
- generic “vertical yellow divider instead of horizontal separators” as a universal brand rule.

If one of these is deliberately wanted for iPPM, document it explicitly as an iPPM project decision and confirm that it does not conflict with the relevant Figma component/module.

## 16. Open items

Do not invent values for:

- iPPM logo minimum size/protection zone and any approved combined iPPM/TKMS lockup rules;
- exact font files, webfont paths, numeric weights and approved fallback;
- fixed CSS breakpoints and tablet variants;
- global max-width;
- complete component dimensions and touch areas;
- exact Dropdown Shadow parameters;
- exhaustive prototype interactions;
- global motion tokens;
- exact image export sizes and universal aspect ratios;
- meaning/binding of Width values `1.5`, `2.5`, `3`;
- complete alias graph between the separate Figma copies.

When implementation needs one of these, make a documented project decision or verify the concrete Figma binding first.

## 17. Review checklist

Before accepting a UI change:

- [ ] Concrete Figma component/module was preferred over generic assumptions.
- [ ] The iPPM logo is used as the standard product/application logo; the correct `on-light` / `on-dark` asset is selected.
- [ ] TKMS wordmark is not used as a substitute for the iPPM product logo unless an explicit corporate/legal/template context requires it.
- [ ] Signal uses `#FDEE65` in Light/Light soft and `#FFFA94` in Dark/Dark soft.
- [ ] Blue focus treatment is preserved.
- [ ] Responsive grid is based on 12/6 columns and 80/24 px outer margins.
- [ ] Typography uses the verified desktop/mobile values.
- [ ] No global 0-radius/pill/shadow/gradient rule was introduced.
- [ ] Button and control states match the relevant component.
- [ ] Dark/Soft modes use explicit values rather than automatic inversion.
- [ ] Accessibility states are not color-only.
- [ ] Unverified values are clearly marked as project decisions or remain open.
- [ ] Module-specific exceptions such as Footer, Quicklinks, Keyfacts and Hero are preserved where used.
