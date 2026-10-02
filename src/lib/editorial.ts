import { editorialLabel } from './editorial-labels';
import type { Article, Section } from '../data/types';
import type { Procedure, ToolSelection } from '../data/domain';
import { editorTools, retiredEditorTools, toolSelectionText } from '../data/editor-tools';

export const editableArticleId = 'guide-r1-reporting';
export const centerFinalNote = 'Für das Center final freigegeben.';
export type ProcedureText = Pick<
  Procedure,
  | 'id'
  | 'title'
  | 'trigger'
  | 'prerequisites'
  | 'requiredRights'
  | 'actions'
  | 'expectedResults'
  | 'checkQuestions'
>;
export type EditableText = Pick<Article, 'title' | 'summary' | 'takeaway' | 'sections'> & {
  // Optional only for previously saved text-only history. New saves require both fields.
  procedures?: ProcedureText[];
  limitations?: string[];
  extra?: Record<string, string>;
};
export type EditorPath =
  | ['title' | 'summary' | 'takeaway']
  | ['sections', number, 'title' | 'body']
  | ['sections', number, 'steps', number]
  | ['procedures', number, 'title' | 'trigger']
  | [
      'procedures',
      number,
      'prerequisites' | 'requiredRights' | 'expectedResults' | 'checkQuestions',
      number,
    ]
  | ['procedures', number, 'actions', number, 'text' | 'tool']
  | ['limitations', number]
  | ['extra', string];
export interface EditorialChange {
  revision: number;
  date: string;
  note: string;
  before: EditableText;
  after: EditableText;
  confirmation?: { confirmedBy: string; fields: string[]; kind?: 'center-final' };
}
export interface EditorialJournal {
  version: 1;
  articleId: string;
  baseline: Article | null;
  changes: EditorialChange[];
}

export function textOf(article: EditableText): EditableText {
  const knowledge = 'knowledge' in article ? (article as Article).knowledge : undefined;
  const procedures = knowledge?.procedures ?? article.procedures;
  const limitations = knowledge?.applicationLimitations ?? article.limitations;
  return structuredClone({
    ...(article.extra ? { extra: structuredClone(article.extra) } : {}),
    title: article.title,
    summary: article.summary,
    takeaway: article.takeaway,
    sections: article.sections.map((section) => ({
      title: section.title,
      body: section.body,
      ...(section.steps ? { steps: [...section.steps] } : {}),
    })),
    ...(procedures
      ? {
          procedures: procedures.map((p) => ({
            id: p.id,
            title: p.title,
            trigger: p.trigger,
            prerequisites: p.prerequisites,
            ...(p.requiredRights ? { requiredRights: p.requiredRights } : {}),
            actions: p.actions,
            expectedResults: p.expectedResults,
            checkQuestions: p.checkQuestions,
          })),
          limitations: limitations ?? [],
        }
      : {}),
  });
}

function legacyText(value: EditableText): EditableText {
  const { title, summary, takeaway, sections } = textOf(value);
  return { title, summary, takeaway, sections };
}

function keys(
  value: unknown,
  expected: string[],
  label: string,
): asserts value is Record<string, unknown> {
  if (
    !value ||
    typeof value !== 'object' ||
    Array.isArray(value) ||
    Object.keys(value).sort().join('|') !== expected.sort().join('|')
  )
    throw new Error(`${label}: unzulässige Felder oder Struktur.`);
}

function text(value: unknown, limit: number, label: string): asserts value is string {
  if (
    typeof value !== 'string' ||
    !value.trim() ||
    value.length > limit ||
    /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(value)
  )
    throw new Error(`${label}: Text ist erforderlich (höchstens ${limit} Zeichen).`);
}

// Fixed shape protects section anchors, procedural relationships and all non-text fields.
export function validateText(
  value: unknown,
  baseline: EditableText,
  requireExtended = false,
): asserts value is EditableText {
  const extended =
    requireExtended || (!!value && typeof value === 'object' && 'procedures' in value);
  keys(
    value,
    [
      'title',
      'summary',
      'takeaway',
      'sections',
      ...(extended ? ['procedures', 'limitations'] : []),
      ...(value && typeof value === 'object' && 'extra' in value ? ['extra'] : []),
    ],
    'Beitrag',
  );
  if ('extra' in value) {
    if (!baseline.extra) throw new Error('Zusatzfelder sind für dieses Objekt nicht zugelassen.');
    keys(value.extra, Object.keys(baseline.extra ?? {}), 'Zusatzfelder');
    Object.entries(value.extra).forEach(([label, value]) => {
      if (value !== baseline.extra?.[label]) text(value, 12000, label);
    });
  } else if (requireExtended && baseline.extra) throw new Error('Zusatzfelder fehlen.');
  text(value.title, 200, 'Titel');
  text(value.summary, 2000, 'Zusammenfassung');
  text(value.takeaway, 4000, 'Kurzantwort');
  if (!Array.isArray(value.sections) || value.sections.length !== baseline.sections.length)
    throw new Error('Abschnitte dürfen nicht hinzugefügt oder entfernt werden.');
  value.sections.forEach((section: unknown, index: number) => {
    const original = baseline.sections[index];
    keys(
      section,
      original.steps ? ['title', 'body', 'steps'] : ['title', 'body'],
      `Abschnitt ${index + 1}`,
    );
    text(section.title, 200, 'Abschnittstitel');
    text(section.body, 12000, 'Abschnittstext');
    if (original.steps) {
      if (!Array.isArray(section.steps) || section.steps.length !== original.steps.length)
        throw new Error('Die Anzahl vorhandener Abschnittspunkte muss erhalten bleiben.');
      section.steps.forEach((step: unknown) => text(step, 4000, 'Abschnittspunkt'));
    }
  });
  if (extended) {
    const source = textOf(baseline);
    if (!Array.isArray(value.procedures) || value.procedures.length !== source.procedures?.length)
      throw new Error('Vorhandene Prozeduren müssen erhalten bleiben.');
    const list = (items: unknown, original: string[], label: string) => {
      if (!Array.isArray(items) || items.length !== original.length)
        throw new Error(
          `${label}: Anzahl und Reihenfolge der vorhandenen Felder bleiben erhalten.`,
        );
      items.forEach((item) => text(item, 12000, label));
    };
    value.procedures.forEach((p: unknown, index: number) => {
      const original = source.procedures![index];
      keys(
        p,
        [
          'id',
          'title',
          'trigger',
          'prerequisites',
          'actions',
          'expectedResults',
          'checkQuestions',
          ...(original.requiredRights ? ['requiredRights'] : []),
        ],
        'Prozedur',
      );
      if (p.id !== original.id)
        throw new Error('Prozedur-ID ist nicht zur Bearbeitung zugelassen.');
      text(p.title, 200, 'Bedienwegtitel');
      text(p.trigger, 4000, 'Auslöser');
      list(p.prerequisites, original.prerequisites, 'Voraussetzungen');
      if (original.requiredRights) list(p.requiredRights, original.requiredRights, 'Leserechte');
      list(p.expectedResults, original.expectedResults, 'Erwartetes Ergebnis');
      list(p.checkQuestions, original.checkQuestions, 'Prüffragen');
      if (!Array.isArray(p.actions) || p.actions.length !== original.actions.length)
        throw new Error('Anzahl der Bedienwegschritte muss erhalten bleiben.');
      p.actions.forEach((a: unknown, actionIndex: number) => {
        const selected = !!a && typeof a === 'object' && 'toolSelection' in a;
        keys(a, ['text', 'tool', ...(selected ? ['toolSelection'] : [])], 'Bedienwegschritt');
        text(a.text, 12000, 'Bedienwegschritt');
        text(a.tool, selected ? 4000 : 1000, 'Werkzeug/Ansicht');
        if (selected) {
          keys(a.toolSelection, ['toolIds', 'relation'], 'Werkzeugauswahl');
          const selection = a.toolSelection;
          const knownIds = [...editorTools, ...retiredEditorTools].map((tool) => tool.id);
          if (
            !['all', 'alternative'].includes(selection.relation as string) ||
            !Array.isArray(selection.toolIds) ||
            selection.toolIds.length < 2 ||
            selection.toolIds.length > knownIds.length ||
            new Set(selection.toolIds).size !== selection.toolIds.length ||
            selection.toolIds.some((id) => typeof id !== 'string' || !knownIds.includes(id))
          )
            throw new Error(
              'Werkzeugauswahl: mindestens zwei unterschiedliche bekannte Werkzeuge und eine gültige Verwendung erforderlich.',
            );
          const previous = original.actions[actionIndex];
          // Historical labels remain snapshots. Newly changed selections use current names.
          if (
            requireExtended &&
            (JSON.stringify(selection) !== JSON.stringify(previous.toolSelection) ||
              a.tool !== previous.tool)
          ) {
            if (
              selection.toolIds.some((id) => !editorTools.some((tool) => tool.id === id)) ||
              a.tool !== toolSelectionText(selection as unknown as ToolSelection)
            )
              throw new Error(
                'Werkzeugauswahl und angezeigter Text müssen übereinstimmen; nur aktive Ziele sind neu wählbar.',
              );
          }
        } else if (
          requireExtended &&
          original.actions[actionIndex].toolSelection &&
          a.tool === original.actions[actionIndex].tool
        ) {
          throw new Error(
            'Gespeicherte Mehrfachauswahl darf nicht stillschweigend entfernt werden.',
          );
        }
      });
    });
    list(value.limitations, source.limitations ?? [], 'Einschränkungen');
  }
}

export function validateNote(note: unknown): asserts note is string {
  text(note, 2000, 'Änderungsgrund');
}
export function validateConfirmedBy(value: unknown): asserts value is string {
  text(value, 200, 'Bestätigt von');
}
export function changedFields(before: EditableText, after: EditableText): string[] {
  // Adapter metadata is protected, not editorial text. Match its editable fields
  // by their original paths, never by translated labels such as "Titel".
  if (before.extra && after.extra)
    return Object.entries(after.extra)
      .filter(([path, value]) => value !== before.extra![path])
      .map(([path]) => editorialLabel(path));
  const previous = textRows(before);
  return textRows(after)
    .filter((row) => row.value !== previous.find((old) => old.label === row.label)?.value)
    .map((row) => row.label);
}

function matchesLegacyAdapterFields(before: EditableText, after: EditableText, fields: unknown) {
  if (!before.extra || !after.extra) return false;
  // Read old journals losslessly, including the duplicate/phantom helper labels
  // written before adapters were excluded. Actual approval scope is recomputed.
  const rows = (value: EditableText) => {
    const { extra: _extra, ...metadata } = value;
    return [...textRows(value), ...textRows(metadata)];
  };
  const previous = rows(before);
  const legacy = rows(after)
    .filter((row) => row.value !== previous.find((old) => old.label === row.label)?.value)
    .map((row) => row.label);
  return JSON.stringify(fields) === JSON.stringify(legacy);
}

export function applyJournal(baseline: Article, input: unknown): Article {
  keys(input, ['version', 'articleId', 'baseline', 'changes'], 'Änderungshistorie');
  if (
    input.version !== 1 ||
    input.articleId !== baseline.id ||
    baseline.status === 'demo' ||
    !Array.isArray(input.changes)
  )
    throw new Error('Unzulässiger Beitrag oder Format der Änderungshistorie.');
  if (!input.changes.length) {
    if (input.baseline !== null)
      throw new Error('Leere Historie muss ohne Ausgangsstand gespeichert sein.');
    return baseline;
  }
  // The only canonical addition is a verbatim relocation of the old UI limitations.
  // Preserve earlier journals whose baseline predates that data field.
  const comparableBaseline = structuredClone(baseline);
  const storedBaseline = input.baseline as Article | null;
  if (storedBaseline?.knowledge && !('applicationLimitations' in storedBaseline.knowledge))
    delete comparableBaseline.knowledge?.applicationLimitations;
  if (JSON.stringify(input.baseline) !== JSON.stringify(comparableBaseline))
    throw new Error(
      'Lokale Bearbeitung: Der Ausgangsbeitrag wurde extern geändert. Historie vor Weiterverwendung abgleichen.',
    );
  let article = structuredClone(baseline);
  for (const entry of input.changes) {
    const confirmed = !!entry && typeof entry === 'object' && 'confirmation' in entry;
    keys(
      entry,
      ['revision', 'date', 'note', 'before', 'after', ...(confirmed ? ['confirmation'] : [])],
      'Revision',
    );
    if (
      entry.revision !== article.revisions!.at(-1)!.number + 1 ||
      typeof entry.date !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(entry.date) ||
      !Number.isFinite(Date.parse(entry.date)) ||
      new Date(`${entry.date}T12:00:00Z`).toISOString().slice(0, 10) !== entry.date
    )
      throw new Error('Ungültige Revisionsnummer oder Datum.');
    validateNote(entry.note);
    validateText(entry.before, article);
    validateText(entry.after, article);
    if (
      'procedures' in entry.before !== 'procedures' in entry.after ||
      JSON.stringify(entry.before) !==
        JSON.stringify('procedures' in entry.before ? textOf(article) : legacyText(article)) ||
      JSON.stringify(textOf(entry.before)) === JSON.stringify(textOf(entry.after))
    )
      throw new Error(
        'Die Änderungshistorie ist nicht lückenlos oder enthält eine leere Änderung.',
      );
    const after = entry.after;
    const fields = changedFields(entry.before, after);
    let centerFinal = false;
    if (confirmed) {
      const hasKind =
        !!entry.confirmation &&
        typeof entry.confirmation === 'object' &&
        'kind' in entry.confirmation;
      keys(
        entry.confirmation,
        ['confirmedBy', 'fields', ...(hasKind ? ['kind'] : [])],
        'Nutzerbestätigung',
      );
      if (hasKind && entry.confirmation.kind !== 'center-final')
        throw new Error('Unzulässige Freigabeart.');
      centerFinal = entry.confirmation.kind === 'center-final';
      if (centerFinal && entry.note !== centerFinalNote)
        throw new Error('Center-Freigabe muss den vorgesehenen Historieneintrag verwenden.');
      validateConfirmedBy(entry.confirmation.confirmedBy);
      if (
        JSON.stringify(entry.confirmation.fields) !== JSON.stringify(fields) &&
        !matchesLegacyAdapterFields(entry.before, after, entry.confirmation.fields)
      )
        throw new Error('Nutzerbestätigung muss exakt die geänderten Felder betreffen.');
    }
    // A later edit revokes the current field confirmation, while its historical entry survives.
    const confirmations = (article.userConfirmations ?? [])
      .map((confirmation) => ({
        ...confirmation,
        fields: confirmation.fields.filter((field) => !fields.includes(field)),
      }))
      .filter((confirmation) => confirmation.fields.length);
    if (confirmed)
      confirmations.push({
        revision: entry.revision as number,
        date: entry.date,
        confirmedBy: (entry.confirmation as EditorialChange['confirmation'])!.confirmedBy,
        fields,
        ...(centerFinal ? { kind: 'center-final' as const } : {}),
      });
    article = {
      ...article,
      ...legacyText(after),
      ...(after.extra ? { extra: structuredClone(after.extra) } : {}),
      knowledge: {
        ...article.knowledge!,
        ...(after.procedures
          ? {
              procedures: article.knowledge!.procedures.map((p, i) => ({
                ...p,
                ...after.procedures![i],
              })),
              applicationLimitations: after.limitations,
            }
          : {}),
      },
      status: 'source-draft',
      updated: entry.date,
      revisions: [
        ...article.revisions!,
        {
          number: entry.revision as number,
          date: entry.date,
          note: centerFinal
            ? `${centerFinalNote} Freigegeben durch ${(entry.confirmation as EditorialChange['confirmation'])!.confirmedBy}. Gilt für: ${fields.join(', ')}.`
            : confirmed
              ? `Vom Nutzer fachlich bestätigte Änderung: ${entry.note} Bestätigt durch ${(entry.confirmation as EditorialChange['confirmation'])!.confirmedBy}. Gilt ausschließlich für: ${fields.join(', ')}. Keine externe Prüfung oder praktische Systembestätigung.`
              : `Lokale redaktionelle Änderung: ${entry.note} Keine fachliche Freigabe oder praktische Bestätigung.`,
          sources: structuredClone(article.revisions!.at(-1)!.sources),
        },
      ],
      reviews: structuredClone(article.reviews!),
      ...(confirmations.length || article.userConfirmations
        ? { userConfirmations: confirmations }
        : {}),
    };
  }
  return article;
}

export function textRows(value: EditableText): { label: string; value: string }[] {
  if (value.extra)
    return Object.entries(value.extra).map(([label, value]) => ({
      label: editorialLabel(label),
      value,
    }));
  return [
    { label: 'Titel', value: value.title },
    { label: 'Zusammenfassung', value: value.summary },
    { label: 'Kurzantwort', value: value.takeaway },
    ...value.sections.flatMap((section: Section, index: number) => [
      { label: `Abschnitt ${index + 1}: Titel`, value: section.title },
      { label: `Abschnitt ${index + 1}: Text`, value: section.body },
      ...(section.steps ?? []).map((step, stepIndex) => ({
        label: `Abschnitt ${index + 1}: Punkt ${stepIndex + 1}`,
        value: step,
      })),
    ]),
    ...(value.procedures ?? []).flatMap((p, i) => [
      { label: `Bedienweg ${i + 1}: Titel`, value: p.title },
      { label: `Bedienweg ${i + 1}: Auslöser`, value: p.trigger },
      ...(p.requiredRights ?? []).map((value, n) => ({
        label: `Bedienweg ${i + 1}: Leserecht ${n + 1}`,
        value,
      })),
      ...p.prerequisites.map((value, n) => ({
        label: `${i ? `Bedienweg ${i + 1}: ` : ''}Voraussetzung ${n + 1}`,
        value,
      })),
      ...p.actions.flatMap((a, n) => [
        { label: `Bedienweg ${i + 1}: Schritt ${n + 1}`, value: a.text },
        {
          label: `Bedienweg ${i + 1}: Werkzeug ${n + 1}`,
          value: a.tool + (a.toolSelection ? '\nAls Mehrfachauswahl gespeichert.' : ''),
        },
      ]),
      ...p.expectedResults.map((value, n) => ({
        label: `${i ? `Bedienweg ${i + 1}: ` : ''}Erwartetes Ergebnis ${n + 1}`,
        value,
      })),
      ...p.checkQuestions.map((value, n) => ({
        label: `${i ? `Bedienweg ${i + 1}: ` : ''}Prüffrage ${n + 1}`,
        value,
      })),
    ]),
    ...(value.limitations ?? []).map((value, n) => ({ label: `Einschränkung ${n + 1}`, value })),
  ];
}
