import { useEffect, useState } from 'react';
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
export default function Editor({ onSaved }: { onSaved: () => void }) {
  const [key, setKey] = useState('article~' + content.articles[0].id),
    [value, setValue] = useState(''),
    [baseline, setBaseline] = useState(''),
    [version, setVersion] = useState(''),
    [token, setToken] = useState('');
  const [message, setMessage] = useState(''),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(false);
  const [current, setCurrent] = useState('');
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
    } catch (e) {
      setError(true);
      setMessage((e as Error).message);
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
        onChange={(e) => {
          if (value !== baseline && !window.confirm('Ungespeicherte Eingaben verwerfen?')) return;
          setKey(e.target.value);
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
        onClick={() => {
          if (
            value !== baseline &&
            !window.confirm('Ungespeicherte Eingaben verwerfen und neu laden?')
          )
            return;
          void load();
        }}
      >
        Inhalt laden
      </button>
      {version && (
        <>
          <ArticleFields value={value} onChange={setValue} />
          <details open={!key.startsWith('article~')}>
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
        </>
      )}
      {current && (
        <details open>
          <summary>Aktueller Dateistand (Ihre Eingaben stehen weiterhin oben)</summary>
          <pre className="json-view">{current}</pre>
          <button
            className="button secondary"
            onClick={() => {
              if (window.confirm('Eigene Eingaben verwerfen und aktuellen Stand übernehmen?'))
                void load();
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
function ArticleFields({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  let data: Record<string, unknown>;
  try {
    data = JSON.parse(value);
  } catch {
    return <p>JSON korrigieren, um die Artikelfelder zu nutzen.</p>;
  }
  if (!data || Array.isArray(data) || !('status' in data)) return null;
  const update = (key: string, next: unknown) =>
    onChange(JSON.stringify({ ...data, [key]: next }, null, 2));
  return (
    <div className="editor-fields">
      <h2>Artikel bearbeiten</h2>
      {['title', 'summary'].map((k) => (
        <label key={k}>
          {k === 'title' ? 'Titel' : 'Kurzbeschreibung'}
          <textarea
            rows={k === 'title' ? 2 : 4}
            value={String(data[k] ?? '')}
            onChange={(e) => update(k, e.target.value)}
          />
        </label>
      ))}
      <label>
        Status
        <select value={String(data.status)} onChange={(e) => update('status', e.target.value)}>
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
                checked={((data[k] as string[]) ?? []).includes(item.id)}
                onChange={(e) =>
                  update(
                    k,
                    e.target.checked
                      ? [...((data[k] as string[]) ?? []), item.id]
                      : ((data[k] as string[]) ?? []).filter((id) => id !== item.id),
                  )
                }
              />
              {'label' in item ? item.label : item.title}
            </label>
          ))}
        </fieldset>
      ))}
      {((data.content as { title: string; body: string; steps?: string[] }[]) ?? []).map(
        (section, i) => (
          <fieldset key={i}>
            <legend>Abschnitt {i + 1}</legend>
            <label>
              Überschrift
              <input
                value={section.title}
                onChange={(e) =>
                  update(
                    'content',
                    (data.content as unknown[]).map((s, j) =>
                      i === j ? { ...section, title: e.target.value } : s,
                    ),
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
                    (data.content as unknown[]).map((s, j) =>
                      i === j ? { ...section, body: e.target.value } : s,
                    ),
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
                    (data.content as unknown[]).map((s, j) =>
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
                  (data.content as unknown[]).filter((_, j) => j !== i),
                )
              }
            >
              Abschnitt entfernen
            </button>
          </fieldset>
        ),
      )}
      <button
        className="button secondary"
        onClick={() =>
          update('content', [
            ...(data.content as unknown[]),
            { title: 'Neuer Abschnitt', body: '' },
          ])
        }
      >
        Abschnitt ergänzen
      </button>
      {['openPoints', 'sourceRefs'].map((k) => (
        <label key={k}>
          {k === 'openPoints'
            ? 'Offene Punkte (optional, eine Zeile je Punkt)'
            : 'Quellenhinweise (optional, eine Zeile je Hinweis)'}
          <textarea
            rows={4}
            value={((data[k] as string[]) ?? []).join('\n')}
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
          value={String(data.sourceNote ?? '')}
          onChange={(e) => update('sourceNote', e.target.value || undefined)}
        />
      </label>
    </div>
  );
}
