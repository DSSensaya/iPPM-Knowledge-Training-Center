import { editorialLabel } from '../lib/editorial-labels';
import { hydrateEditorialObjects } from '../lib/editorial-registry';
import { refreshInventory } from '../data/inventory';
import { useEffect, useId, useImperativeHandle, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import type { Ref } from 'react';
import type { Article } from '../data/types';
import {
  textOf,
  textRows,
  validateNote,
  validateText,
  validateConfirmedBy,
} from '../lib/editorial';
import {
  editorToolFor,
  editorToolGroups,
  editorTools,
  retiredEditorTools,
  toolSelectionText,
} from '../data/editor-tools';
import type { ToolSelection } from '../data/domain';
import type { EditableText, EditorialChange, EditorPath } from '../lib/editorial';
export type { EditorPath } from '../lib/editorial';

declare const __LOCAL_EDITOR__: boolean;
export interface LocalArticleEditorHandle {
  edit: (path: EditorPath, slot: HTMLElement, label: string) => Promise<void>;
}
interface Snapshot {
  version: string;
  article: Article;
  changes: EditorialChange[];
}

export default function LocalArticleEditor({
  article,
  ref,
  onReady,
}: {
  article: Article;
  ref?: Ref<LocalArticleEditorHandle>;
  onReady?: (ready: boolean) => void;
}) {
  const prefix = useId();
  const [token, setToken] = useState('');
  const [focusTarget, setFocusTarget] = useState<{ path: EditorPath }>();
  const [target, setTarget] = useState<{ slot: HTMLElement; label: string }>();
  const [snapshot, setSnapshot] = useState<Snapshot>();
  const [draft, setDraft] = useState<EditableText>();
  const [note, setNote] = useState('');
  const [noteError, setNoteError] = useState('');
  const [confirmedBy, setConfirmedBy] = useState('');
  const [customTools, setCustomTools] = useState<string[]>([]);
  const [multipleTools, setMultipleTools] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState(false);
  const [saveMode, setSaveMode] = useState<'draft' | 'confirmed' | 'center-final'>('draft');
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [conflict, setConflict] = useState<Snapshot>();
  const [saved, setSaved] = useState(false);
  const enabled = __LOCAL_EDITOR__;
  const dirty =
    !!draft && !!snapshot && JSON.stringify(draft) !== JSON.stringify(textOf(snapshot.article));
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!preview || !dialog) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [preview]);
  useEffect(() => {
    if (!enabled) return;
    let active = true;
    fetch('/__local-editor/session')
      .then(async (response) => {
        if (!response.ok) throw new Error('Bearbeitungsserver nicht verfügbar.');
        const session = await response.json();
        if (active) setToken(session.token);
      })
      .catch(() => {
        if (active) setMessage('Bearbeitungsserver nicht verfügbar. Beitrag bleibt lesbar.');
      });
    return () => {
      active = false;
    };
  }, [enabled]);
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);
  useEffect(() => {
    onReady?.(enabled && !!token && !busy);
    return () => onReady?.(false);
  }, [enabled, token, busy, onReady]);
  useEffect(() => {
    if (!open || busy || !focusTarget) return;
    const targetField =
      focusTarget.path[0] === 'extra' && focusTarget.path[1] === ''
        ? target?.slot.querySelector('input, textarea, select')
        : document.getElementById(prefix + '-' + focusTarget.path.join('-'));
    const field =
      targetField instanceof HTMLFieldSetElement
        ? (targetField.querySelector('input:checked') ?? targetField.querySelector('input'))
        : targetField;
    if (
      !(
        field instanceof HTMLInputElement ||
        field instanceof HTMLTextAreaElement ||
        field instanceof HTMLSelectElement
      ) ||
      field.matches(':disabled')
    )
      return;
    field.focus({ preventScroll: true });
    field.scrollIntoView({ block: 'center' });
  }, [open, busy, focusTarget, prefix, target]);
  useImperativeHandle(ref, () => ({
    async edit(path, slot, label) {
      if (!enabled || !token || busy) return;
      if (open && !saved && target?.slot !== slot && (dirty || note.trim() || confirmedBy.trim())) {
        setMessage(
          'Bitte den aktuellen Bereich zuerst speichern oder den Entwurf ausdrücklich verwerfen.',
        );
        setFocusTarget((previous) => (previous ? { ...previous } : previous));
        return;
      }
      if ((!open || saved || target?.slot !== slot) && !(await load())) return;
      setTarget({ slot, label });
      setFocusTarget({ path });
    },
  }));
  if (!enabled) return null;
  async function read(): Promise<Snapshot> {
    const response = await fetch(`/__local-editor/articles/${article.id}`, {
      headers: { 'X-Local-Editor-Token': token },
      cache: 'no-store',
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  }
  async function load() {
    setBusy(true);
    setMessage('');
    try {
      const current = await read();
      setSnapshot(current);
      setDraft(textOf(current.article));
      setNote('');
      setNoteError('');
      setConfirmedBy('');
      setCustomTools([]);
      setMultipleTools([]);
      setConflict(undefined);
      setPreview(false);
      setSaved(false);
      setOpen(true);
      return true;
    } catch (error) {
      setMessage((error as Error).message);
      return false;
    } finally {
      setBusy(false);
    }
  }
  function change(path: EditorPath, value: string, selection?: ToolSelection) {
    setDraft((previous) => {
      const next = structuredClone(previous!);
      if (path[0] === 'extra') next.extra![path[1]] = value;
      else if (path[0] === 'sections') {
        const section = next.sections[path[1]];
        if (path[2] === 'steps') section.steps![path[3]] = value;
        else section[path[2]] = value;
      } else if (path[0] === 'procedures') {
        const p = next.procedures![path[1]];
        if (path[2] === 'title' || path[2] === 'trigger') p[path[2]] = value;
        else if (path[2] === 'actions') {
          const action = p.actions[path[3]];
          action[path[4]] = value;
          if (path[4] === 'tool') {
            if (selection) action.toolSelection = selection;
            else delete action.toolSelection;
          }
        } else p[path[2]]![path[3]!] = value;
      } else if (path[0] === 'limitations') next.limitations![path[1]] = value;
      else next[path[0]] = value;
      return next;
    });
    setPreview(false);
    setMessage('');
  }
  function showPreview() {
    try {
      validateText(draft, snapshot!.article, true);
      setNoteError('');
      setSaveMode('draft');
      setPreview(true);
      setMessage('');
    } catch (error) {
      setMessage((error as Error).message);
    }
  }
  async function save() {
    if (!preview || busy || saved || conflict) return;
    const centerFinal = saveMode === 'center-final';
    const confirm = saveMode !== 'draft';
    if (!centerFinal) {
      try {
        validateNote(note);
      } catch (error) {
        setNoteError((error as Error).message);
        document.getElementById(`${prefix}-note`)?.focus();
        return;
      }
    }
    if (confirm) {
      try {
        validateConfirmedBy(confirmedBy);
      } catch (error) {
        setMessage((error as Error).message);
        document.getElementById(`${prefix}-confirmed-by`)?.focus();
        return;
      }
    }
    setBusy(true);
    setMessage('');
    try {
      const response = await fetch(`/__local-editor/articles/${article.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Local-Editor-Token': token },
        body: JSON.stringify({
          version: snapshot!.version,
          after: draft,
          note: centerFinal ? '' : note,
          ...(confirm
            ? { confirmation: { confirmedBy, ...(centerFinal ? { kind: 'center-final' } : {}) } }
            : {}),
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        if (response.status === 409) setConflict(await read());
        throw new Error(result.error);
      }
      setSaved(true);
      const current = await read();
      setSnapshot(current);
      hydrateEditorialObjects([{ id: article.id, article: current.article }]);
      refreshInventory();
      setMessage(
        centerFinal
          ? `Revision ${result.revision} dauerhaft im Repository gespeichert. Geänderte Inhalte durch ${confirmedBy.trim()} für das Center final freigegeben.`
          : confirm
            ? `Revision ${result.revision} dauerhaft im Repository gespeichert. Geänderte Felder durch ${confirmedBy.trim()} als fachliche Erkenntnis bestätigt.`
            : `Revision ${result.revision} dauerhaft im Repository gespeichert. Keine fachliche Freigabe.`,
      );
      setPreview(false);
    } catch (error) {
      setPreview(false);
      setMessage((error as Error).message);
    } finally {
      setBusy(false);
    }
  }
  function field(label: string, path: EditorPath, value: string, limit: number, multiline = true) {
    const inputId = `${prefix}-${path.join('-')}`;
    const tool = path[0] === 'procedures' && path[2] === 'actions' && path[4] === 'tool';
    const original =
      path[0] === 'procedures' && path[2] === 'actions'
        ? snapshot!.article.knowledge!.procedures[path[1]].actions[path[3]].tool
        : value;
    const originalTool = tool ? editorToolFor(original) : undefined;
    const originalSelection =
      path[0] === 'procedures' && path[2] === 'actions'
        ? snapshot!.article.knowledge!.procedures[path[1]].actions[path[3]].toolSelection
        : undefined;
    const custom = customTools.includes(inputId);
    const action =
      path[0] === 'procedures' && path[2] === 'actions'
        ? draft!.procedures![path[1]].actions[path[3]]
        : undefined;
    const selection = action?.toolSelection;
    const multiple = tool && (multipleTools.includes(inputId) || !!selection);
    const selectedIds =
      selection?.toolIds ?? (editorToolFor(value) ? [editorToolFor(value)!.id] : []);
    const relation = selection?.relation ?? 'all';
    function selectTools(ids: string[], usage: ToolSelection['relation'] = relation) {
      const nextSelection: ToolSelection = { toolIds: ids, relation: usage };
      const nextText =
        ids.length > 1
          ? toolSelectionText(nextSelection)
          : (editorTools.find((item) => item.id === ids[0])?.label ?? '');
      change(
        path,
        ids.length === 1 && ids[0] === originalTool?.id ? original : nextText,
        ids.length > 1 ? nextSelection : undefined,
      );
    }
    function toolCheckbox(item: { id: string; label: string }) {
      return (
        <label className="local-editor-tool-option" key={item.id}>
          <input
            type="checkbox"
            value={item.id}
            checked={selectedIds.includes(item.id)}
            onChange={(event) => {
              setMultipleTools((current) =>
                current.includes(inputId) ? current : [...current, inputId],
              );
              selectTools(
                event.target.checked
                  ? [...selectedIds, item.id]
                  : selectedIds.filter((id) => id !== item.id),
              );
            }}
          />
          <span>{item.label}</span>
        </label>
      );
    }
    return (
      <div className="local-editor-field" key={label}>
        {!multiple && <label htmlFor={inputId}>{label}</label>}
        {tool ? (
          <>
            {multiple ? (
              <fieldset
                id={inputId}
                className="local-editor-tool-selection"
                disabled={busy || saved}
              >
                <legend>{label}</legend>
                <div className="local-editor-tool-options">
                  {selection?.toolIds.some((id) =>
                    retiredEditorTools.some((item) => item.id === id),
                  ) && (
                    <fieldset>
                      <legend>Bisherige Ziele</legend>
                      {retiredEditorTools
                        .filter((item) => selection.toolIds.includes(item.id))
                        .map(toolCheckbox)}
                    </fieldset>
                  )}
                  {editorToolGroups.map((group) => (
                    <fieldset key={group.label}>
                      <legend>{group.label}</legend>
                      {group.tools.map(toolCheckbox)}
                    </fieldset>
                  ))}
                </div>
              </fieldset>
            ) : (
              <select
                id={inputId}
                value={custom ? '__custom__' : (editorToolFor(value)?.id ?? '__existing__')}
                disabled={busy || saved}
                onChange={(event) => {
                  if (event.target.value === '__custom__')
                    setCustomTools((current) => [...current, inputId]);
                  else {
                    setCustomTools((current) => current.filter((id) => id !== inputId));
                    const selected = editorTools.find((item) => item.id === event.target.value);
                    const restore =
                      event.target.value === '__existing__' || selected?.id === originalTool?.id;
                    change(
                      path,
                      restore ? original : selected!.label,
                      restore ? originalSelection : undefined,
                    );
                  }
                }}
              >
                {!originalTool && (
                  <optgroup label="Bisherige Angabe">
                    <option value="__existing__">{original}</option>
                  </optgroup>
                )}
                {editorToolGroups.map((group) => (
                  <optgroup key={group.label} label={group.label}>
                    {group.tools.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
                <optgroup label="Eigene Angabe">
                  <option value="__custom__">Anderes Werkzeug / Ansicht …</option>
                </optgroup>
              </select>
            )}
            <button
              className={`button ${multiple ? 'secondary' : 'dark-primary'}`}
              disabled={busy || saved}
              onClick={() => {
                setCustomTools((current) => current.filter((id) => id !== inputId));
                if (multiple) {
                  setMultipleTools((current) => current.filter((id) => id !== inputId));
                  const ids = selectedIds.length ? selectedIds : (originalSelection?.toolIds ?? []);
                  if (ids.length) selectTools(ids.slice(0, 1));
                  else change(path, original);
                } else {
                  setMultipleTools((current) => [...current, inputId]);
                  setFocusTarget({ path });
                }
              }}
            >
              {multiple ? 'Zur Einzelauswahl wechseln' : 'Mehrere Werkzeuge auswählen'}
            </button>
            {multiple && (
              <>
                <p className="small">Ausgangsangabe: {original}</p>
                <p className="small">
                  Gewünschte Werkzeuge anhaken. Mit der Leertaste lassen sich Häkchen per Tastatur
                  setzen und entfernen. Eine Auswahl ersetzt die bisherige Werkzeugangabe.
                </p>
                <label htmlFor={`${inputId}-relation`}>{label}: Verwendung</label>
                <select
                  id={`${inputId}-relation`}
                  value={relation}
                  disabled={busy || saved || selectedIds.length < 2}
                  onChange={(event) =>
                    selectTools(selectedIds, event.target.value as ToolSelection['relation'])
                  }
                >
                  <option value="all">Gemeinsam verwenden</option>
                  <option value="alternative">Alternativ verwenden</option>
                </select>
              </>
            )}
            {custom && !multiple && (
              <>
                <label htmlFor={`${inputId}-custom`}>{label} (eigene Angabe)</label>
                <input
                  id={`${inputId}-custom`}
                  value={value}
                  maxLength={limit}
                  required
                  disabled={busy || saved}
                  onChange={(event) => change(path, event.target.value)}
                />
              </>
            )}
          </>
        ) : multiline ? (
          <textarea
            id={inputId}
            value={value}
            maxLength={limit}
            required
            disabled={busy || saved}
            onChange={(event) => change(path, event.target.value)}
            rows={4}
          />
        ) : (
          <input
            id={inputId}
            value={value}
            maxLength={limit}
            required
            disabled={busy || saved}
            onChange={(event) => change(path, event.target.value)}
          />
        )}
      </div>
    );
  }
  const selectedFields: {
    label: string;
    path: EditorPath;
    value: string;
    limit: number;
    multiline: boolean;
  }[] = [];
  const add = (label: string, path: EditorPath, value: string, limit = 12000, multiline = true) =>
    selectedFields.push({ label, path, value, limit, multiline });
  if (draft && focusTarget) {
    const path = focusTarget.path;
    if (path[0] === 'extra') {
      Object.entries(draft.extra ?? {})
        .filter(([label]) => path[1] === '' || label.split(' / ')[0] === path[1].split(' / ')[0])
        .forEach(([label, value]) => add(editorialLabel(label), ['extra', label], value));
    } else if (path[0] === 'sections') {
      const index = path[1],
        section = draft.sections[index];
      add(`Abschnitt ${index + 1}: Titel`, ['sections', index, 'title'], section.title, 200, false);
      add(`Abschnitt ${index + 1}: Text`, ['sections', index, 'body'], section.body);
      section.steps?.forEach((value, n) =>
        add(`Abschnitt ${index + 1}: Punkt ${n + 1}`, ['sections', index, 'steps', n], value, 4000),
      );
    } else if (path[0] === 'procedures') {
      const index = path[1],
        p = draft.procedures![index];
      if (path[2] === 'requiredRights') {
        p.requiredRights?.forEach((value, n) =>
          add(
            `Bedienweg ${index + 1}: Leserecht ${n + 1}`,
            ['procedures', index, 'requiredRights', n],
            value,
          ),
        );
      } else if (path[2] === 'prerequisites') {
        p.prerequisites.forEach((value, n) =>
          add(
            `${index ? `Bedienweg ${index + 1}: ` : ''}Voraussetzung ${n + 1}`,
            ['procedures', index, 'prerequisites', n],
            value,
          ),
        );
      } else if (path[2] === 'expectedResults' || path[2] === 'checkQuestions') {
        p.expectedResults.forEach((value, n) =>
          add(
            `${index ? `Bedienweg ${index + 1}: ` : ''}Erwartetes Ergebnis ${n + 1}`,
            ['procedures', index, 'expectedResults', n],
            value,
          ),
        );
        p.checkQuestions.forEach((value, n) =>
          add(
            `${index ? `Bedienweg ${index + 1}: ` : ''}Prüffrage ${n + 1}`,
            ['procedures', index, 'checkQuestions', n],
            value,
          ),
        );
      } else {
        add(`Bedienweg ${index + 1}: Titel`, ['procedures', index, 'title'], p.title, 200, false);
        add(`Bedienweg ${index + 1}: Auslöser`, ['procedures', index, 'trigger'], p.trigger, 4000);
        p.actions.forEach((a, n) => {
          add(
            `Bedienweg ${index + 1}: Schritt ${n + 1}`,
            ['procedures', index, 'actions', n, 'text'],
            a.text,
          );
          add(
            `Bedienweg ${index + 1}: Werkzeug ${n + 1}`,
            ['procedures', index, 'actions', n, 'tool'],
            a.tool,
            1000,
            false,
          );
        });
      }
    } else if (path[0] === 'limitations') {
      draft.limitations!.forEach((value, n) =>
        add(`Einschränkung ${n + 1}`, ['limitations', n], value),
      );
    } else {
      const name = { title: 'Titel', summary: 'Zusammenfassung', takeaway: 'Kurzantwort' }[path[0]];
      add(
        name,
        path,
        draft[path[0]],
        { title: 200, summary: 2000, takeaway: 4000 }[path[0]],
        path[0] !== 'title',
      );
    }
  }
  const oldRows = snapshot ? textRows(textOf(snapshot.article)) : [];
  const newRows = draft ? textRows(draft) : [];
  const noteField = (
    <div className="local-editor-field">
      <label htmlFor={`${prefix}-note`}>Änderungsgrund</label>
      <textarea
        id={`${prefix}-note`}
        value={note}
        maxLength={2000}
        required
        disabled={busy || saved}
        aria-invalid={!!noteError}
        aria-describedby={noteError ? `${prefix}-note-error` : undefined}
        rows={3}
        onChange={(event) => {
          setNote(event.target.value);
          setNoteError('');
        }}
      />
      {noteError && (
        <p id={`${prefix}-note-error`} role="alert">
          {noteError}
        </p>
      )}
    </div>
  );
  if (!open || !target) return message ? <p role="status">{message}</p> : null;
  return createPortal(
    <section className="local-editor" aria-label="Lokale Beitragsbearbeitung">
      <h2>{target.label} bearbeiten</h2>
      {open && draft && snapshot && (
        <>
          <p>Ausgangsrevision {snapshot.article.revisions!.at(-1)!.number}.</p>
          {selectedFields.map((item) =>
            field(item.label, item.path, item.value, item.limit, item.multiline),
          )}
          {!preview && noteField}
          {conflict && (
            <div className="local-editor-conflict" role="alert">
              <h2>Konkurrierende Änderung abgleichen</h2>
              <p>
                Ihr Entwurf bleibt in den Feldern erhalten. Der aktuelle Repository-Stand folgt
                unten. Zum Fortsetzen den aktuellen Stand übernehmen und gewünschte Änderungen
                erneut eintragen.
              </p>
              {textRows(textOf(conflict.article))
                .filter((row, index) => row.value !== oldRows[index].value)
                .map((row) => (
                  <div key={row.label}>
                    <strong>{row.label} – aktuell im Repository</strong>
                    <p>{row.value}</p>
                  </div>
                ))}
              <button
                className="button"
                disabled={busy}
                onClick={() => {
                  setSnapshot(conflict);
                  setDraft(textOf(conflict.article));
                  setConflict(undefined);
                  setPreview(false);
                  setMessage(
                    'Aktueller Repository-Stand übernommen. Gewünschte Änderungen erneut eintragen.',
                  );
                }}
              >
                Aktuellen Stand übernehmen und Entwurf verwerfen
              </button>
            </div>
          )}
          <div className="local-editor-actions">
            {message && !preview && <p role="status">{message}</p>}
            {!saved && (
              <>
                <button
                  className="button primary"
                  disabled={busy || !dirty || !!conflict}
                  onClick={showPreview}
                >
                  Änderung prüfen und speichern
                </button>
                <button
                  className="button local-editor-cancel"
                  disabled={busy}
                  onClick={() => {
                    setOpen(false);
                    setDraft(undefined);
                    setConflict(undefined);
                    setMessage('');
                  }}
                >
                  <X size={18} aria-hidden="true" />
                  Bearbeitung abbrechen und Entwurf verwerfen
                </button>
              </>
            )}
            {saved && (
              <button
                className="button primary"
                disabled={busy}
                onClick={() => window.location.reload()}
              >
                Gespeicherten Beitrag neu laden
              </button>
            )}
          </div>
          <dialog
            ref={dialogRef}
            className="local-editor-dialog"
            aria-labelledby={`${prefix}-save-title`}
            aria-describedby={`${prefix}-save-description`}
            onCancel={(event) => {
              if (busy) event.preventDefault();
            }}
            onClose={() => setPreview(false)}
            onKeyDown={(event) => {
              if (event.key !== 'Tab') return;
              const controls = Array.from(
                event.currentTarget.querySelectorAll<HTMLElement>(
                  'button:not(:disabled), input:not(:disabled), textarea:not(:disabled), summary',
                ),
              ).filter(
                (element) =>
                  element.offsetParent !== null &&
                  !(
                    element instanceof HTMLInputElement &&
                    element.type === 'radio' &&
                    !element.checked
                  ),
              );
              const first = controls[0],
                last = controls.at(-1);
              if (!first || !last) {
                event.preventDefault();
              } else if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
              } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
              }
            }}
          >
            {preview && (
              <>
                <h2 id={`${prefix}-save-title`}>Änderung prüfen und speichern</h2>
                <p id={`${prefix}-save-description`}>
                  Die Inhalte sind technisch geprüft, aber noch nicht gespeichert. Prüfen Sie den
                  Änderungsvergleich und wählen Sie die Speicherart.
                </p>
                {message && <p role="status">{message}</p>}
                {saveMode !== 'center-final' && noteField}
                <fieldset className="local-editor-save-options" disabled={busy}>
                  <legend>Speicherart</legend>
                  <label className="local-editor-save-option">
                    <input
                      type="radio"
                      name={`${prefix}-save-mode`}
                      value="draft"
                      checked={saveMode === 'draft'}
                      autoFocus
                      aria-describedby={`${prefix}-draft-description`}
                      onChange={() => {
                        setSaveMode('draft');
                        setMessage('');
                      }}
                    />
                    <strong>Ohne fachliche Bestätigung speichern</strong>
                  </label>
                  <p id={`${prefix}-draft-description`}>
                    Speichert die Änderung dauerhaft mit neuer Revision und Historie. Sie geben
                    damit keine persönliche fachliche Bestätigung ab.
                  </p>
                  <label className="local-editor-save-option">
                    <input
                      type="radio"
                      name={`${prefix}-save-mode`}
                      value="confirmed"
                      checked={saveMode === 'confirmed'}
                      aria-describedby={`${prefix}-confirmed-description`}
                      onChange={() => {
                        setSaveMode('confirmed');
                        setMessage('');
                      }}
                    />
                    <strong>Als fachliche Erkenntnis bestätigt speichern</strong>
                  </label>
                  <p id={`${prefix}-confirmed-description`}>
                    Speichert die Änderung und Ihre persönliche fachliche Bestätigung der geänderten
                    Felder mit Name, Datum und Revision. Kein eigener Pflegefall oder Belegabgleich
                    nötig. Bestehende Quellenprüfungen, Systemnachweise und offizielle Freigaben
                    bleiben davon unabhängig.
                  </p>
                  <label className="local-editor-save-option">
                    <input
                      type="radio"
                      name={`${prefix}-save-mode`}
                      value="center-final"
                      checked={saveMode === 'center-final'}
                      aria-describedby={`${prefix}-center-final-description`}
                      onChange={() => {
                        setSaveMode('center-final');
                        setNoteError('');
                        setMessage('');
                      }}
                    />
                    <strong>Für das Center final freigeben</strong>
                  </label>
                  <p id={`${prefix}-center-final-description`}>
                    Speichert und gibt die geänderten Inhalte endgültig für die Verwendung im Center
                    frei. Kein Änderungsgrund, Pflegefall, Belegabgleich oder weiterer
                    Freigabeschritt nötig. Name, Revision und freigegebene Felder bleiben in der
                    Historie erhalten.
                  </p>
                  {saveMode !== 'draft' && (
                    <div className="local-editor-field">
                      <label htmlFor={`${prefix}-confirmed-by`}>
                        {saveMode === 'center-final'
                          ? 'Freigegeben von (für das Center)'
                          : 'Bestätigt von (für fachliche Bestätigung)'}
                      </label>
                      <input
                        id={`${prefix}-confirmed-by`}
                        value={confirmedBy}
                        maxLength={200}
                        required
                        onChange={(event) => {
                          setConfirmedBy(event.target.value);
                          setMessage('');
                        }}
                      />
                    </div>
                  )}
                </fieldset>
                <section aria-label="Vorschau und Änderungsvergleich">
                  <h3>Änderungsvergleich</h3>
                  {newRows
                    .filter((row, index) => row.value !== oldRows[index].value)
                    .map((row) => {
                      const previous = oldRows.find((old) => old.label === row.label)!;
                      return (
                        <div className="local-editor-comparison" key={row.label}>
                          <h3>{row.label}</h3>
                          <div>
                            <strong>Bisher</strong>
                            <p>{previous.value}</p>
                          </div>
                          <div>
                            <strong>Entwurf</strong>
                            <p>{row.value}</p>
                          </div>
                        </div>
                      );
                    })}
                  <details>
                    <summary>Textvorschau · nicht freigegeben</summary>
                    {selectedFields.map((item) => (
                      <div key={item.label}>
                        <h3>{item.label}</h3>
                        <p>{item.value}</p>
                      </div>
                    ))}
                  </details>
                </section>
                <div className="local-editor-actions">
                  <button
                    className={`button ${saveMode !== 'draft' ? 'dark-primary' : 'primary'}`}
                    disabled={busy || !!conflict}
                    onClick={save}
                  >
                    {busy ? 'Wird gespeichert …' : 'Im Repository speichern'}
                  </button>
                  <button
                    className="button local-editor-cancel"
                    disabled={busy}
                    onClick={() => setPreview(false)}
                  >
                    <X size={18} aria-hidden="true" />
                    Zur Bearbeitung zurück
                  </button>
                </div>
              </>
            )}
          </dialog>
          {!!snapshot.changes.length && (
            <details>
              <summary>Lokale Änderungshistorie ({snapshot.changes.length})</summary>
              {snapshot.changes.map((entry) => (
                <section key={entry.revision}>
                  <h3>
                    Revision {entry.revision} · {entry.date}
                  </h3>
                  {entry.confirmation?.kind !== 'center-final' && <p>{entry.note}</p>}
                  {entry.confirmation && (
                    <p>
                      {entry.confirmation.kind === 'center-final'
                        ? 'Für das Center final freigegeben durch'
                        : 'Vom Nutzer fachlich bestätigt durch'}{' '}
                      {entry.confirmation.confirmedBy}: {entry.confirmation.fields.join(', ')}.
                    </p>
                  )}
                  {textRows(entry.after)
                    .filter(
                      (row) =>
                        row.value !==
                        textRows(entry.before).find((old) => old.label === row.label)?.value,
                    )
                    .map((row) => (
                      <div key={row.label}>
                        <strong>{row.label}</strong>
                        <p>
                          Bisher:{' '}
                          {textRows(entry.before).find((old) => old.label === row.label)?.value}
                        </p>
                        <p>Danach: {row.value}</p>
                      </div>
                    ))}
                </section>
              ))}
            </details>
          )}
        </>
      )}
    </section>,
    target.slot,
  );
}
