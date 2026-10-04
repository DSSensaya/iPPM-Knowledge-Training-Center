import { useEffect, useRef, useState } from 'react';
import { validateContent } from '../content/validation';
import type { Article } from '../content/types';
import { content, replaceContent } from '../content';
import { PageTitle } from '../components/ui';
const collections = [
  'processes',
  'tasks',
  'topics',
  'procedures',
  'roles',
  'systems',
  'releases',
  'training-blocks',
  'sources',
  'open-points',
  'help',
];
export default function Editor({
  onSaved,
  registerNavigationGuard,
}: {
  onSaved: () => void;
  registerNavigationGuard: (guard: (() => Promise<boolean>) | null) => void;
}) {
  const [key, setKey] = useState('article~' + content.articles[0].id),
    [value, setValue] = useState(''),
    [baseline, setBaseline] = useState(''),
    [version, setVersion] = useState(''),
    [token, setToken] = useState('');
  const [message, setMessage] = useState(''),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(false);
  const [current, setCurrent] = useState('');
  const [jsonOpen, setJsonOpen] = useState(false);
  const dirty = useRef(false),
    valueRef = useRef(value);
  dirty.current = value !== baseline;
  valueRef.current = value;
  const [leaving, setLeaving] = useState(false);
  const decision = useRef<((allow: boolean) => void) | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  function confirmLeaving(): Promise<boolean> {
    if (!dirty.current) return Promise.resolve(true);
    if (decision.current) return Promise.resolve(false);
    setLeaving(true);
    return new Promise((resolve) => {
      decision.current = resolve;
    });
  }
  function finishLeaving(allow: boolean) {
    if (allow) dirty.current = false;
    decision.current?.(allow);
    decision.current = null;
    setLeaving(false);
  }
  useEffect(() => {
    registerNavigationGuard(confirmLeaving);
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (!dirty.current) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', beforeUnload);
    return () => {
      registerNavigationGuard(null);
      window.removeEventListener('beforeunload', beforeUnload);
      decision.current?.(false);
    };
  }, [registerNavigationGuard]);
  useEffect(() => {
    if (leaving) dialog.current?.showModal();
  }, [leaving]);
  let validationError = '';
  let formArticle: Article | undefined;
  if (version) {
    try {
      const parsed: unknown = JSON.parse(value);
      const candidate = {
        ...content,
        [key.startsWith('article~')
          ? 'articles'
          : key.replace('training-blocks', 'trainingBlocks').replace('open-points', 'openPoints')]:
          key.startsWith('article~')
            ? content.articles.map((a) => (a.id === key.slice(8) ? parsed : a))
            : parsed,
      };
      validateContent(candidate);
    } catch (e) {
      validationError = (e as Error).message;
    }
    if (key.startsWith('article~')) formArticle = articleForForm(value);
  }

  const formAvailable = !!formArticle;
  useEffect(() => {
    if (version && (!key.startsWith('article~') || !formAvailable)) setJsonOpen(true);
  }, [version, key, formAvailable]);

  useEffect(() => {
    void fetch('/__local-editor/session')
      .then((r) => r.json())
      .then((s) => setToken(s.token))
      .catch(() => {
        setError(true);
        setMessage('Bearbeitungsserver nicht erreichbar.');
      });
  }, []);
  async function load(selected = key) {
    setBusy(true);
    setError(false);
    try {
      const r = await fetch('/__local-editor/files/' + selected, {
          headers: { 'X-Local-Editor-Token': token },
          cache: 'no-store',
        }),
        data = await r.json();
      if (!r.ok) throw new Error(data.error);
      const text = JSON.stringify(data.value, null, 2);
      setKey(selected);
      setValue(text);
      setBaseline(text);
      setVersion(data.version);
      setCurrent('');
      setJsonOpen(!selected.startsWith('article~'));
      setMessage('Kanonischen Inhalt geladen.');
    } catch (e) {
      setError(true);
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function compare() {
    setBusy(true);
    try {
      const r = await fetch('/__local-editor/files/' + key, {
          headers: { 'X-Local-Editor-Token': token },
          cache: 'no-store',
        }),
        data = await r.json();
      if (!r.ok) throw new Error(data.error);
      setCurrent(JSON.stringify(data.value, null, 2));
      setMessage('Aktueller Dateistand zum Vergleich geladen. Ihre Eingaben bleiben erhalten.');
      setError(false);
    } catch (e) {
      setError(true);
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function save() {
    setBusy(true);
    setError(false);
    try {
      const json: unknown = JSON.parse(value),
        r = await fetch('/__local-editor/files/' + key, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'X-Local-Editor-Token': token },
          body: JSON.stringify({ version, value: json }),
        }),
        data = await r.json();
      if (!r.ok) throw new Error(data.error);
      replaceContent(data.content);
      setVersion(data.version);
      setBaseline(value);
      setCurrent('');
      onSaved();
      setMessage('Direkt in der kanonischen JSON-Datei gespeichert.');
      dirty.current = valueRef.current !== value;
      return !dirty.current;
    } catch (e) {
      setError(true);
      setMessage((e as Error).message);
      return false;
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <PageTitle
        eyebrow="Lokale Redaktion"
        title="Inhalte pflegen"
        description="Artikel direkt bearbeiten. Für Beziehungen und Kataloge steht die JSON-Ansicht zur Verfügung. Git übernimmt die Versionshistorie."
      />
      <label htmlFor="editor-object">Inhalt auswählen</label>
      <select
        id="editor-object"
        value={key}
        disabled={busy || leaving}
        onChange={async (e) => {
          const selected = e.target.value;
          if (!(await confirmLeaving())) return;
          setKey(selected);
          setValue('');
          setBaseline('');
          setVersion('');
          setMessage('Bitte den gewählten Inhalt laden.');
        }}
      >
        <optgroup label="Artikel">
          {content.articles.map((a) => (
            <option key={a.id} value={'article~' + a.id}>
              {a.title}
            </option>
          ))}
        </optgroup>
        <optgroup label="Beziehungen und Kataloge">
          {collections.map((k) => (
            <option key={k} value={k}>
              {k}.json
            </option>
          ))}
        </optgroup>
      </select>
      <button
        className="button secondary"
        disabled={busy || !token}
        onClick={async () => {
          if (await confirmLeaving()) void load();
        }}
      >
        Inhalt laden
      </button>
      {version && (
        <>
          {validationError && (
            <p role="alert" className="error-message">
              JSON-Entwurf prüfen: {validationError}. Ihre Eingaben bleiben vollständig erhalten.
            </p>
          )}
          <fieldset disabled={busy} className="editor-form">
            {formArticle && <ArticleFields data={formArticle} onChange={setValue} />}
            <details open={jsonOpen} onToggle={(e) => setJsonOpen(e.currentTarget.open)}>
              <summary>JSON bearbeiten (vollständiger Inhalt)</summary>
              <label htmlFor="editor-json">Kanonischer JSON-Inhalt</label>
              <textarea
                id="editor-json"
                rows={24}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                spellCheck={false}
              />
            </details>
            <div className="editor-actions">
              <button
                className="button primary"
                disabled={busy || value === baseline}
                onClick={() => void save()}
              >
                Änderungen speichern
              </button>
              <button className="button secondary" disabled={busy} onClick={() => void compare()}>
                Aktuellen Stand vergleichen
              </button>
            </div>
          </fieldset>
        </>
      )}
      {leaving && (
        <dialog
          ref={dialog}
          className="editor-confirmation"
          aria-labelledby="unsaved-title"
          onCancel={(e) => {
            e.preventDefault();
            finishLeaving(false);
          }}
        >
          <h2 id="unsaved-title">Ungespeicherter Entwurf</h2>
          <p>Speichern Sie Ihre Änderungen oder verwerfen Sie den Entwurf ausdrücklich.</p>
          <div className="editor-actions">
            <button
              className="button primary"
              disabled={busy}
              onClick={async () => {
                if (await save()) finishLeaving(true);
              }}
            >
              Speichern und fortfahren
            </button>
            <button
              className="button secondary"
              disabled={busy}
              onClick={() => {
                setBaseline(value);
                finishLeaving(true);
              }}
            >
              Entwurf verwerfen
            </button>
            <button
              className="button secondary"
              disabled={busy}
              autoFocus
              onClick={() => finishLeaving(false)}
            >
              Navigation abbrechen
            </button>
          </div>
          {error && (
            <p role="alert" className="error-message">
              {message}
            </p>
          )}
        </dialog>
      )}
      {current && (
        <details open>
          <summary>Aktueller Dateistand (Ihre Eingaben stehen weiterhin oben)</summary>
          <pre className="json-view">{current}</pre>
          <button
            className="button secondary"
            disabled={busy}
            onClick={async () => {
              if (await confirmLeaving()) void load();
            }}
          >
            Aktuellen Stand übernehmen
          </button>
        </details>
      )}
      {message && (
        <p className={error ? 'error-message' : 'editor-message'} role={error ? 'alert' : 'status'}>
          {message}
        </p>
      )}
    </>
  );
}
/** Form rendering is allowed only for its actual input types, including optional lists. */
function articleForForm(value: string): Article | undefined {
  try {
    const data = JSON.parse(value);
    const object = (v: unknown): v is Record<string, unknown> =>
      !!v && typeof v === 'object' && !Array.isArray(v);
    const texts = (v: unknown) => Array.isArray(v) && v.every((x) => typeof x === 'string');
    if (
      !object(data) ||
      !['id', 'title', 'summary', 'status'].every((k) => typeof data[k] === 'string')
    )
      return;
    if (!texts(data.roleIds) || !texts(data.systemIds)) return;
    for (const key of [
      'openPoints',
      'openPointIds',
      'sourceRefs',
      'procedureIds',
      'relatedArticleIds',
      'releaseIds',
    ])
      if (data[key] !== undefined && !texts(data[key])) return;
    if (data.sourceNote !== undefined && typeof data.sourceNote !== 'string') return;
    if (
      !Array.isArray(data.content) ||
      !data.content.every(
        (s) =>
          object(s) &&
          typeof s.title === 'string' &&
          typeof s.body === 'string' &&
          (s.steps === undefined || texts(s.steps)),
      )
    )
      return;
    return data as unknown as Article;
  } catch {
    return;
  }
}
function ArticleFields({ data, onChange }: { data: Article; onChange: (value: string) => void }) {
  const update = (key: string, next: unknown) =>
    onChange(JSON.stringify({ ...data, [key]: next }, null, 2));
  return (
    <div className="editor-fields">
      <h2>Artikel bearbeiten</h2>
      {(['title', 'summary'] as const).map((k) => (
        <label key={k}>
          {k === 'title' ? 'Titel' : 'Kurzbeschreibung'}
          <textarea
            rows={k === 'title' ? 2 : 4}
            value={data[k]}
            onChange={(e) => update(k, e.target.value)}
          />
        </label>
      ))}
      <label>
        Status
        <select value={data.status} onChange={(e) => update('status', e.target.value)}>
          <option value="draft">Entwurf</option>
          <option value="usable">Nutzbar</option>
          <option value="approved">Im Knowledge Center freigegeben</option>
        </select>
      </label>
      <p>
        Nutzbar beschreibt den begrenzten Beitrag. Freigabe gilt ausschließlich für das Knowledge
        Center.
      </p>
      {(['roleIds', 'systemIds'] as const).map((k) => (
        <fieldset key={k}>
          <legend>{k === 'roleIds' ? 'Zielrollen' : 'Systeme'}</legend>
          {(k === 'roleIds' ? content.roles : content.systems).map((item) => (
            <label className="checkbox-label" key={item.id}>
              <input
                type="checkbox"
                checked={(data[k] ?? []).includes(item.id)}
                onChange={(e) =>
                  update(
                    k,
                    e.target.checked
                      ? [...(data[k] ?? []), item.id]
                      : (data[k] ?? []).filter((id) => id !== item.id),
                  )
                }
              />
              {'label' in item ? item.label : item.title}
            </label>
          ))}
        </fieldset>
      ))}
      {data.content.map((section, i) => (
        <fieldset key={i}>
          <legend>Abschnitt {i + 1}</legend>
          <label>
            Überschrift
            <input
              value={section.title}
              onChange={(e) =>
                update(
                  'content',
                  data.content.map((s, j) => (i === j ? { ...section, title: e.target.value } : s)),
                )
              }
            />
          </label>
          <label>
            Text
            <textarea
              rows={6}
              value={section.body}
              onChange={(e) =>
                update(
                  'content',
                  data.content.map((s, j) => (i === j ? { ...section, body: e.target.value } : s)),
                )
              }
            />
          </label>
          <label>
            Schritte (eine Zeile je Schritt)
            <textarea
              rows={4}
              value={section.steps?.join('\n') ?? ''}
              onChange={(e) =>
                update(
                  'content',
                  data.content.map((s, j) =>
                    i === j
                      ? { ...section, steps: e.target.value.split('\n').filter((x) => x.trim()) }
                      : s,
                  ),
                )
              }
            />
          </label>
          <button
            className="button secondary"
            onClick={() =>
              update(
                'content',
                data.content.filter((_, j) => j !== i),
              )
            }
          >
            Abschnitt entfernen
          </button>
        </fieldset>
      ))}
      <button
        className="button secondary"
        onClick={() => update('content', [...data.content, { title: 'Neuer Abschnitt', body: '' }])}
      >
        Abschnitt ergänzen
      </button>
      {(['openPoints', 'sourceRefs'] as const).map((k) => (
        <label key={k}>
          {k === 'openPoints'
            ? 'Offene Punkte (optional, eine Zeile je Punkt)'
            : 'Quellenhinweise (optional, eine Zeile je Hinweis)'}
          <textarea
            rows={4}
            value={(data[k] ?? []).join('\n')}
            onChange={(e) =>
              update(
                k,
                e.target.value.split('\n').filter((x) => x.trim()),
              )
            }
          />
        </label>
      ))}
      <label>
        Quellennotiz (optional)
        <textarea
          rows={2}
          value={data.sourceNote ?? ''}
          onChange={(e) => update('sourceNote', e.target.value || undefined)}
        />
      </label>
    </div>
  );
}
