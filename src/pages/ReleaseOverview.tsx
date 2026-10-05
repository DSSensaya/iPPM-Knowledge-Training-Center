import { content } from '../content';
import type { Orientation } from '../content/types';
import { PageTitle, SearchForm } from '../components/ui';
import { Sources, Sections, OpenPoints } from '../components/Content';
import { statusLabels } from '../lib/queries';
import {
  getOrientationBacklinks,
  getOrientationStates,
  orientationHref,
  orientationTarget,
  orientationTitle,
  orientationSummary,
  orientationContent,
  orientationSources,
  type OrientationState,
} from '../lib/orientation';

const stateLabels: Record<OrientationState, string> = {
  all: 'Planungsstand',
  direct: 'Expliziter Planungsbezug',
  context: 'Verbundener Kontext',
  unassigned: 'Kein Releasebezug hinterlegt',
};
const stateLabel = (node: Orientation, state: OrientationState) =>
  state === 'unassigned' && node.planningReleaseIds.length > 0
    ? 'Anderem Release zugeordnet'
    : stateLabels[state];
const columns = [
  {
    title: 'Prozesse',
    kinds: ['iPPM-Prozess'],
    description: 'Übergreifende Prozesse im iPPM-Zielbild',
  },
  { title: 'Funktionen', kinds: ['Funktion'], description: 'Wobei iPPM unterstützen soll' },
  {
    title: 'Systeme und Bausteine',
    kinds: ['Systembaustein', 'Externes System'],
    description: 'Bausteine und externe Systemgrenzen',
  },
];

export default function ReleaseOverview({ id, params }: { id?: string; params: URLSearchParams }) {
  const requested = params.get('release') ?? '';
  const release = content.releases.find((r) => r.id === requested);
  const releaseId = release?.id ?? '';
  const states = getOrientationStates(releaseId);
  const node = content.orientation.find((n) => n.id === id);
  const select = (next: string) => {
    window.location.hash = orientationHref(id, next === releaseId ? '' : next).slice(1);
  };
  const renderCard = (item: Orientation) => {
    const state = states.get(item.id)!;
    return (
      <li
        key={item.id}
        className={`orientation-card orientation-${state}`}
        data-orientation-id={item.id}
        data-state={state}
      >
        <a href={orientationHref(item.id, releaseId)}>{orientationTitle(item)}</a>
        <span className="orientation-state">{stateLabel(item, state)}</span>
        <span className="orientation-code">{item.sourceKey}</span>
      </li>
    );
  };
  const primaryIds = new Set(
    content.orientation
      .filter((n) => columns.some((c) => c.kinds.includes(n.kind)))
      .map((n) => n.id),
  );
  const otherKinds = [
    ...new Set(content.orientation.filter((n) => !primaryIds.has(n.id)).map((n) => n.kind)),
  ];
  const link = (targetId: string) => {
    const target = orientationTarget(targetId, releaseId);
    return target ? <a href={target.href}>{target.title}</a> : null;
  };
  const resolved = node ? orientationContent(node) : [];
  const sections = resolved.flatMap((item) => (item.section ? [item.section] : []));
  const historical = sections.filter((s) => s.purpose === 'context');
  const boundaries = sections.filter(
    (s) => s.purpose !== 'context' && /grenz|geltung|beleg|native bindung/i.test(s.title),
  );
  const details = sections.filter((s) => !boundaries.includes(s) && !historical.includes(s));
  const children = node ? content.orientation.filter((n) => n.parentId === node.id) : [];
  const incoming = node ? getOrientationBacklinks(node.id) : [];
  const related = node?.links ?? [];
  const centerLinks = related.filter((r) => !content.orientation.some((n) => n.id === r.targetId));
  const referenceHref = node?.referenceId
    ? content.releases.some((r) => r.id === node.referenceId)
      ? '#/releases/' + node.referenceId
      : content.topics.some((t) => t.id === node.referenceId)
        ? '#/thema/' + node.referenceId
        : '#/wissen?system=' + node.referenceId
    : undefined;
  return (
    <>
      <a className="text-link" href="#/prozesse">
        ← Zur Prozessübersicht
      </a>
      <PageTitle
        eyebrow="Zusammenhänge verstehen"
        title="Releases im Überblick"
        description="Die ganze Landkarte sehen. Ein Release auswählen und seinen geplanten Umfang erkunden."
      />
      <div className="orientation-release-picker" role="group" aria-label="Release hervorheben">
        <button aria-pressed={!releaseId} onClick={() => select('')}>
          Alles anzeigen
        </button>
        {content.releases.map((r) => (
          <button key={r.id} aria-pressed={releaseId === r.id} onClick={() => select(r.id)}>
            {r.code}
          </button>
        ))}
      </div>
      <p className="orientation-notice">
        Releaseplanung, keine Verfügbarkeits- oder Projektfreigabe. Frühere Releases sind nicht
        automatisch eingeschlossen.
      </p>
      {requested && !release && (
        <p role="alert">Unbekanntes Release. Die Gesamtübersicht wird angezeigt.</p>
      )}
      <p className="orientation-legend">
        <strong className="orientation-selection" role="status">
          {release ? `${release.code} ausgewählt.` : 'Gesamter Planungsstand.'}
        </strong>
        Hervorgehoben: explizit zugeordnet. Gestrichelt: verbundener Kontext. Grau: anderem Release
        zugeordnet oder kein Releasebezug hinterlegt – siehe Kartenbeschriftung. Beides belegt
        keinen Ausschluss aus dem ausgewählten Release. Alle Karten bleiben anklickbar.
      </p>
      <a className="text-link" href={'#/releases' + (release ? '/' + release.id : '')}>
        Releases und vorhandene Schulungen öffnen
      </a>
      {id ? (
        node ? (
          <article className="orientation-detail">
            <a className="text-link" href={orientationHref(undefined, releaseId)}>
              ← Zur Gesamtübersicht
            </a>
            <p className="eyebrow">
              {node.kind} · {node.sourceKey}
            </p>
            <h2>{orientationTitle(node)}</h2>
            <p>{orientationSummary(node)}</p>
            <p>
              <strong>{stateLabel(node, states.get(node.id)!)}</strong>
            </p>
            <p>
              Quellenstand: {node.sourceStatus}. Dieser Quellenstatus ist keine Center-Freigabe.
            </p>
            <p>
              Explizite Releaseplanung:{' '}
              {node.planningReleaseIds
                .map((rid) => content.releases.find((r) => r.id === rid)!.code)
                .join(', ') || 'Keine Zuordnung hinterlegt'}
            </p>
            {referenceHref && (
              <a className="button secondary" href={referenceHref}>
                Kanonischen Center-Inhalt öffnen
              </a>
            )}
            {resolved.map((item, i) =>
              item.article ? (
                <section key={i} className="orientation-current-content">
                  <h3>Aktuelle Center-Aussage</h3>
                  <a href={'#/artikel/' + item.article.id}>{item.article.title}</a>
                  <p>{item.article.summary}</p>
                  <p className="small">
                    {statusLabels[item.article.status]} · Artikelgeltung:{' '}
                    {item.article.releaseIds
                      ?.map((rid) => content.releases.find((r) => r.id === rid)!.code)
                      .join(', ') || 'Keine explizite Releasezuordnung'}
                    . Diese Inhaltsreferenz erweitert keine Releaseplanung.
                  </p>
                  <OpenPoints points={item.openPoints} />
                  <details>
                    <summary>Führende Erläuterung und ihre Grenzen lesen</summary>
                    <Sections
                      sections={item.article.content.filter((s) => s.purpose !== 'exercise')}
                    />
                  </details>
                </section>
              ) : item.openPoint ? (
                <OpenPoints key={i} points={[item.openPoint.text]} />
              ) : null,
            )}
            {boundaries.length > 0 && (
              <section className="limitations">
                <h3>Geltung und Grenzen</h3>
                {boundaries.map((s, i) => (
                  <div key={i}>
                    <h4>{s.title}</h4>
                    <p>{s.body}</p>
                  </div>
                ))}
              </section>
            )}
            {node.parentId && <p>Übergeordnet: {link(node.parentId)}</p>}
            {node.journeyIds && (
              <section>
                <h3>Orientierungsstationen</h3>
                <p>
                  Didaktische Reihenfolge, kein ausführbarer Workflow und kein Schulungsnachweis.
                </p>
                <ol>
                  {node.journeyIds.map((targetId) => (
                    <li key={targetId}>{link(targetId)}</li>
                  ))}
                </ol>
              </section>
            )}
            {centerLinks.length > 0 && (
              <section>
                <h3>Im Center weiterarbeiten</h3>
                <ul>
                  {centerLinks.map((r, i) => (
                    <li key={i}>
                      {link(r.targetId)}
                      <p className="small">
                        {r.label} · {r.basis}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {children.length > 0 && (
              <section>
                <h3>Enthaltene Elemente</h3>
                <ul className="orientation-items">{children.map(renderCard)}</ul>
              </section>
            )}
            {(related.length > 0 || incoming.length > 0) && (
              <details open>
                <summary>Verbindungen und ihre Bedeutung</summary>
                <p>
                  Unterstützung, Modellübergaben und Entwürfe sind keine belegten
                  Center-Prozessflüsse. Redaktionelle Einordnungen bleiben zu prüfen.
                </p>
                <ul>
                  {related
                    .filter((r) => !centerLinks.includes(r))
                    .map((r, i) => (
                      <li key={'out-' + i}>
                        {r.label}: {link(r.targetId)}
                        <p className="small muted">{r.basis}</p>
                      </li>
                    ))}
                  {incoming.map((r, i) => (
                    <li key={'in-' + i}>
                      {link(r.node.id)} → {r.label}
                      <p className="small muted">{r.basis}</p>
                    </li>
                  ))}
                </ul>
              </details>
            )}
            <details>
              <summary>Fachliche und technische Vertiefung</summary>
              {node.audienceRoleIds.length + (node.audienceNotes?.length ?? 0) > 0 && (
                <p>
                  Orientierungszielgruppen (keine Verantwortungszuweisung):{' '}
                  {[
                    ...node.audienceRoleIds.map(
                      (rid) => content.roles.find((r) => r.id === rid)!.label,
                    ),
                    ...(node.audienceNotes ?? []),
                  ].join(', ')}
                </p>
              )}
              {details.map((s, i) => (
                <section key={i}>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </section>
              ))}
            </details>
            {historical.length > 0 && (
              <details className="orientation-import-evidence">
                <summary>Historische Importbelege – keine aktuelle Pflegequelle</summary>
                <p>
                  Unveränderter Wortlaut des HTML-Imports. Abweichungen zur aktuellen Center-Aussage
                  bleiben als Quellenunterschied sichtbar; daraus folgt keine aktuelle Umsetzung
                  oder Freigabe.
                </p>
                {historical.map((s, i) => (
                  <section key={i}>
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                  </section>
                ))}
              </details>
            )}
            <Sources refs={orientationSources(node)} note={node.sourceNote} />
          </article>
        ) : (
          <section>
            <h2>Element nicht gefunden</h2>
            <a href={orientationHref(undefined, releaseId)}>Gesamtübersicht öffnen</a>
          </section>
        )
      ) : (
        <>
          <div className="orientation-columns">
            {columns.map((column) => {
              const nodes = content.orientation.filter((n) => column.kinds.includes(n.kind));
              const groups = [...new Set(nodes.map((n) => n.parentId))];
              return (
                <section
                  key={column.title}
                  aria-label={column.title}
                  className="orientation-column"
                >
                  <h2>
                    {column.title} <span className="orientation-count">{nodes.length}</span>
                  </h2>
                  <p className="small">{column.description}</p>
                  {groups.map((parentId) => (
                    <section key={parentId}>
                      <h3>
                        {parentId
                          ? orientationTitle(content.orientation.find((n) => n.id === parentId)!)
                          : 'Weitere Elemente'}
                      </h3>
                      <ul className="orientation-items">
                        {nodes.filter((n) => n.parentId === parentId).map(renderCard)}
                      </ul>
                    </section>
                  ))}
                </section>
              );
            })}
          </div>
          <section>
            <h2>Weitere Zusammenhänge</h2>
            <p>
              Unternehmensprozesse, Orientierungswege und technische Details bedarfsgerecht öffnen.
              Die Releaseauswahl entfernt keine Inhalte.
            </p>
            {otherKinds.map((kind) => (
              <details key={kind}>
                <summary>
                  {kind} ({content.orientation.filter((n) => n.kind === kind).length})
                </summary>
                <ul className="orientation-items">
                  {content.orientation.filter((n) => n.kind === kind).map(renderCard)}
                </ul>
              </details>
            ))}
          </section>
          <section>
            <h2>Im gesamten Center suchen</h2>
            <SearchForm />
          </section>
        </>
      )}
    </>
  );
}
