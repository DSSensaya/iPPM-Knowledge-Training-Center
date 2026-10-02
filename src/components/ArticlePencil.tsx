import { useRef, useState } from 'react';
import { Pencil } from 'lucide-react';
import LocalArticleEditor from './LocalArticleEditor';
import type { LocalArticleEditorHandle, EditorPath } from './LocalArticleEditor';
import type { Article } from '../data/types';
declare const __LOCAL_EDITOR__: boolean;
export default function ArticlePencil({
  article,
  path,
  label,
}: {
  article: Article;
  path: EditorPath;
  label: string;
}) {
  const ref = useRef<LocalArticleEditorHandle>(null);
  const [ready, setReady] = useState(false);
  if (!__LOCAL_EDITOR__) return null;
  return (
    <>
      <LocalArticleEditor article={article} ref={ref} onReady={setReady} />
      <button
        type="button"
        className="icon-button inline-edit-button"
        aria-label={`${label} bearbeiten`}
        title={`${label} bearbeiten`}
        disabled={!ready}
        onClick={(event) => {
          const slot = event.currentTarget.nextElementSibling;
          if (slot instanceof HTMLElement) void ref.current?.edit(path, slot, label);
        }}
      >
        <Pencil size={14} aria-hidden="true" />
      </button>
      <div className="local-editor-slot" />
    </>
  );
}
