import { useRef, useState } from 'react';
import { Pencil } from 'lucide-react';
import LocalArticleEditor from './LocalArticleEditor';
import type { LocalArticleEditorHandle } from './LocalArticleEditor';
import { editorialObjects, originOf } from '../lib/editorial-registry';
import { editorialLabel } from '../lib/editorial-labels';

declare const __LOCAL_EDITOR__: boolean;
export default function EditorialObject({
  object,
  id,
  field,
  label = 'Inhalt',
}: {
  object?: object;
  id?: string;
  field?: string;
  label?: string;
}) {
  const ref = useRef<LocalArticleEditorHandle>(null);
  const [ready, setReady] = useState(false);
  const key = id ?? (object && originOf(object));
  const entry = key && editorialObjects.get(key);
  if (!entry) return null;
  const fields = field ? [field] : [''];
  const confirmations =
    entry.article.status === 'demo' ? [] : (entry.article.userConfirmations ?? []);
  const approvals = confirmations.length ? (
    <details className="knowledge-details">
      <summary>Bestätigungen und Center-Freigaben</summary>
      {confirmations.map((value) => (
        <p key={value.revision}>
          {value.kind === 'center-final'
            ? 'Für das Center final freigegeben'
            : 'Vom Nutzer fachlich bestätigt'}{' '}
          · {value.confirmedBy} · Revision {value.revision} · {value.date}:{' '}
          {value.fields.join(', ')}
        </p>
      ))}
    </details>
  ) : null;
  if (!__LOCAL_EDITOR__) return approvals;
  return (
    <>
      {approvals}
      <LocalArticleEditor ref={ref} article={entry.article} onReady={setReady} />
      {fields.map((group) => (
        <div key={group} className="editorial-object-area">
          <button
            type="button"
            className="icon-button inline-edit-button"
            aria-label={`${label}${group ? ': ' + editorialLabel(group) : ''} bearbeiten`}
            title={`${label}${group ? ': ' + editorialLabel(group) : ''} bearbeiten`}
            disabled={!ready}
            onClick={(event) => {
              const slot = event.currentTarget.nextElementSibling;
              const path = group
                ? entry.fields!.find((value) => value.split(' / ')[0] === group)!
                : '';
              if (slot instanceof HTMLElement)
                void ref.current?.edit(
                  ['extra', path],
                  slot,
                  `${label}${group ? ': ' + editorialLabel(group) : ''}`,
                );
            }}
          >
            <Pencil size={14} aria-hidden="true" />
          </button>
          <div className="local-editor-slot" />
        </div>
      ))}
    </>
  );
}
