import EditorialObject from './EditorialObject';
import ArticlePencil from './ArticlePencil';
import { useState } from 'react';
import { inventory } from '../data/inventory';
import { visibleArticles } from '../data/content';
import { sources } from '../data/sources';
import { searchInventory } from '../lib/inventory-search';
import { functions, processCatalog } from '../data/catalog';
import { sb1Coverage } from '../data/sb1-coverage';

declare const __LOCAL_EDITOR__: boolean;
function InventoryOrigin({ id }: { id: string }) {
  if (!__LOCAL_EDITOR__) return null;
  const fn = functions.find((item) => item.id === id);
  const process = processCatalog.find((item) => item.id === id);
  const article = visibleArticles.find((item) =>
    item.knowledge?.procedures.some((p) => p.id === id),
  );
  return fn || process ? (
    <EditorialObject object={fn ?? process} label="Ursprungsobjekt" />
  ) : article ? (
    <ArticlePencil
      article={article}
      path={[
        'procedures',
        article.knowledge!.procedures.findIndex((item) => item.id === id),
        'trigger',
      ]}
      label="Bedienweg am Ursprungsbeitrag"
    />
  ) : null;
}

export function InventorySearchLink({ query }: { query: string }) {
  if (!query.trim()) return null;
  const count = searchInventory(query).length;
  return (
    <p>
      <a href={`#/prozesse?q=${encodeURIComponent(query)}`}>
        Prozesse und Use Cases: {count} Katalogtreffer für „{query}“ ansehen
      </a>
    </p>
  );
}

export default function Inventory() {
  const initial = new URLSearchParams(window.location.hash.split('?')[1] || '').get('q') || '';
  const [query, setQuery] = useState(initial);
  const [kind, setKind] = useState('Alle Einträge');
  const [state, setState] = useState('Alle Inhaltsstände');
  const results = searchInventory(query, kind, state);
  return (
    <section className="process-section inventory" aria-labelledby="inventory-heading">
      <h2 id="inventory-heading">Prozesse und Use Cases finden</h2>
      <p>
        Aufgabe oder ID suchen und vorhandene Arbeitswege öffnen. Nutzbar: zusammenhängender
        belegter Teilumfang. Teilweise belegt: Teilinhalt mit Lücken. Platzhalter: Orientierung ohne
        vollständigen Bediennachweis. Diese Inhaltsstände ersetzen keine Quellenbewertung oder
        fachliche Freigabe.
      </p>
      <details className="knowledge-details" open={initial ? true : undefined}>
        <summary>Katalog durchsuchen (Aufgabe oder ID)</summary>
        <div className="filters">
          <label>
            Aufgabe oder Katalog-ID
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} />
          </label>
          <label>
            Eintragsart
            <select value={kind} onChange={(e) => setKind(e.target.value)}>
              {['Alle Einträge', ...new Set(inventory.map((e) => e.kind))].map((k) => (
                <option key={k}>{k}</option>
              ))}
            </select>
          </label>
          <label>
            Inhaltsstand
            <select value={state} onChange={(e) => setState(e.target.value)}>
              {['Alle Inhaltsstände', 'Nutzbar', 'Teilweise belegt', 'Platzhalter'].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
        </div>
        <p role="status">{results.length} Katalogeinträge</p>
        {!results.length && <p>Kein passender Eintrag. Suchbegriff oder Filter ändern.</p>}
        <ul className="sb1-coverage-list">
          {results.map((entry) => (
            <li key={entry.id} data-inventory-id={entry.id}>
              <details
                key={`${entry.id}:${query}`}
                open={query === entry.id || entry.aliases.includes(query) ? true : undefined}
              >
                <summary>
                  <strong>
                    {entry.id} · {entry.title}
                  </strong>
                  <span>Inhaltsstand: {entry.state}</span>
                </summary>
                <div className="sb1-coverage-details">
                  <p>{entry.context}</p>
                  <p>{entry.note}</p>
                  <EditorialObject
                    object={
                      entry.kind === 'Prozessschritt'
                        ? (sb1Coverage.find((row) => row.number === entry.aliases[0]) ?? entry)
                        : entry
                    }
                    label="Kataloghinweis"
                  />
                  <InventoryOrigin id={entry.id} />
                  {entry.articleIds.length > 0 && (
                    <ul>
                      {entry.articleIds.map((id) => (
                        <li key={id}>
                          <a href={`#/artikel/${id}`}>
                            {visibleArticles.find((a) => a.id === id)!.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                  <details className="knowledge-details">
                    <summary>Quellen und Zuordnung</summary>
                    <p>
                      Eintragsart: {entry.kind}.{' '}
                      {entry.aliases.length > 0 &&
                        `Weitere Kennungen: ${entry.aliases.join(', ')}.`}
                    </p>
                    {entry.relatedIds.length > 0 && (
                      <p>
                        Beziehungen:{' '}
                        {entry.relatedIds.map((id) => (
                          <a
                            key={id}
                            className="inventory-relation"
                            href={`#/prozesse?q=${encodeURIComponent(id)}`}
                            onClick={() => setQuery(id)}
                          >
                            {id}
                          </a>
                        ))}
                      </p>
                    )}
                    {entry.evidence.map((ref, i) => (
                      <p className="small source-ref" key={i}>
                        {ref.sourceId} · {ref.locator} ·{' '}
                        {sources.find((s) => s.id === ref.sourceId)?.filename}
                        {ref.derivation === 'inferred' ? ' · redaktionell abgeleitet' : ''}
                      </p>
                    ))}
                  </details>
                </div>
              </details>
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}
