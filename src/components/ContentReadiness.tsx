import EditorialObject from './EditorialObject';
import type { Article } from '../data/types';
import { readinessFor } from '../data/content-readiness';

export default function ContentReadiness({
  article,
  compact = false,
}: {
  article: Article;
  compact?: boolean;
}) {
  const readiness = readinessFor(article);
  return (
    <>
      {' '}
      <p className="small content-readiness">
        <strong>Inhaltsstand: {readiness.state}</strong>
        {!compact && (
          <>
            {' '}
            · {readiness.note} Redaktionelle Einordnung; keine fachliche Freigabe oder Bestätigung
            späterer Releases.
          </>
        )}
      </p>
      {!compact && <EditorialObject object={readiness} label="Inhaltseinordnung" />}
    </>
  );
}
