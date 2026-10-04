import { useEffect, useId, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import type { ContentStore, Process, ProcessStep } from '../content/types';
import { getOpenPoints, roleLabel } from '../lib/queries';
import { getProcessLayout } from '../lib/process-layout';
import { processHref, rememberProcessPosition, stepHref } from '../lib/process-navigation';

function StepCard({
  step,
  process,
  store,
  style,
  dismissed,
  showTooltip,
}: {
  step: ProcessStep;
  process: Process;
  store: ContentStore;
  style: CSSProperties;
  dismissed: boolean;
  showTooltip: () => void;
}) {
  const tooltipId = useId();
  const flows = process.flows?.filter((f) => f.from === step.id) ?? [];
  const issues = [
    ...new Set([
      ...getOpenPoints(step, store),
      ...store.tasks
        .filter((t) => step.taskIds?.includes(t.id))
        .flatMap((t) => getOpenPoints(t, store)),
    ]),
  ];
  const guides = step.materials.filter((m) => m.kind === 'guide').length;
  const orientations = step.materials.filter((m) => m.kind === 'orientation').length;
  const references = step.materials.filter((m) => m.kind === 'reference').length;
  return (
    <li style={style} className={`swimlane-item ${dismissed ? 'tooltip-dismissed' : ''}`}>
      <div className="process-card-info">
        <a
          className="process-card"
          id={`process-card-${step.id}`}
          data-step-id={step.id}
          href={stepHref(step.id, process.id, 'karte')}
          aria-describedby={tooltipId}
          onFocus={showTooltip}
          onMouseEnter={showTooltip}
          onClick={(e) => {
            if (e.button || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
            rememberProcessPosition(
              processHref(process.id, 'karte'),
              `process-card-${step.id}`,
              e.currentTarget.closest('.swimlane-scroll')?.scrollLeft,
            );
          }}
        >
          <span className="process-number">{step.number}</span>
          <strong>{step.title}</strong>
          <span className="process-role">
            {step.roleIds.map((id) => roleLabel(id, store)).join(' · ') || 'Keine Rolle belegt'}
          </span>
          <span className="process-badges">
            {guides > 0 && <span>Anleitungen: {guides}</span>}
            {orientations > 0 && <span>Orientierungen: {orientations}</span>}
            {references > 0 && <span>Referenzen: {references}</span>}
            {step.releaseIds?.map((id) => (
              <span key={id}>
                Release-Zuordnung: {store.releases.find((r) => r.id === id)?.code}
              </span>
            ))}
            {issues.length > 0 && (
              <span className="process-issues">Offene Punkte: {issues.length}</span>
            )}
          </span>
        </a>
        <div className="process-tooltip" id={tooltipId} role="tooltip">
          <p>{step.description || `${step.number} ${step.title}`}</p>
          {step.input && <p>Eingang: {step.input}</p>}
          {step.output && <p>Ergebnis: {step.output}</p>}
          {issues.length > 0 && <p>Offene Punkte: {issues.join(' · ')}</p>}
          <p>Schritt öffnen für Materialien, Geltung und Quellen.</p>
        </div>
      </div>
      {flows.length > 0 && (
        <details className="process-connections">
          <summary>Verbindungen: {flows.length}</summary>
          <ul>
            {flows.map((f, i) => {
              const target = process.steps.find((s) => s.id === f.to)!;
              return (
                <li key={i}>
                  Zu {target.number} {target.title}
                  {f.kind && ` (${f.kind})`}
                  {f.label && ` – ${f.label}`}
                  <small>
                    {f.sourceRefs?.join(' · ')} {f.sourceNote}
                  </small>
                </li>
              );
            })}
          </ul>
        </details>
      )}
    </li>
  );
}

export function ProcessSwimlane({ process, store }: { process: Process; store: ContentStore }) {
  const [tooltipsDismissed, setTooltipsDismissed] = useState(false);
  useEffect(() => {
    const dismiss = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setTooltipsDismissed(true);
    };
    document.addEventListener('keydown', dismiss);
    return () => document.removeEventListener('keydown', dismiss);
  }, []);
  const layout = getProcessLayout(process, store.roles);
  const board = useRef<HTMLDivElement>(null);
  const marker = useId().replace(/:/g, '');
  const [geometry, setGeometry] = useState<{
    width: number;
    height: number;
    paths: { d: string; from: string; to: string }[];
  }>({ width: 1, height: 1, paths: [] });
  useEffect(() => {
    const element = board.current;
    if (!element) return;
    let frame = 0;
    const measure = () => {
      const bounds = element.getBoundingClientRect();
      const cards = [...element.querySelectorAll<HTMLElement>('.swimlane-item')];
      const rects = new Map(
        cards.map((card) => {
          const rect = card.getBoundingClientRect();
          return [
            card.querySelector<HTMLElement>('[data-step-id]')!.dataset.stepId!,
            {
              left: rect.left - bounds.left,
              right: rect.right - bounds.left,
              top: rect.top - bounds.top,
              bottom: rect.bottom - bounds.top,
            },
          ];
        }),
      );
      const paths = (process.flows ?? []).flatMap((flow, i) => {
        const a = rects.get(flow.from),
          b = rects.get(flow.to);
        if (!a || !b) return [];
        const offset = 12 + (i % 6) * 4;
        const ax = a.right + offset,
          bx = b.right + offset;
        const ay = (a.top + a.bottom) / 2,
          by = (b.top + b.bottom) / 2;
        const rowBottom = Math.max(
          ...[...rects.values()].filter((r) => Math.abs(r.top - a.top) < 1).map((r) => r.bottom),
        );
        const corridor = rowBottom + 16 + (i % 4) * 8;
        const d =
          Math.abs(a.right - b.right) < 1
            ? `M ${a.right} ${ay} H ${ax} V ${by} H ${b.right}`
            : `M ${a.right} ${ay} H ${ax} V ${corridor} H ${bx} V ${by} H ${b.right}`;
        return [{ d, from: flow.from, to: flow.to }];
      });
      setGeometry({ width: element.offsetWidth, height: element.offsetHeight, paths });
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(element);
    element.querySelectorAll('.swimlane-item').forEach((card) => observer.observe(card));
    window.addEventListener('resize', schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', schedule);
    };
  }, [process]);
  return (
    <div className="process-swimlane">
      <p className="small">
        Von oben nach unten lesen. Spalten zeigen Rollenzuordnungen. Pfeile zeigen ausschließlich
        belegte Verbindungen, keine vollständige Ablauf- oder Entscheidungslogik. Mehrfachrollen
        werden gemeinsam dargestellt.
      </p>
      <p className="small">
        Badges zeigen vorhandene Metadaten. Ohne Badge ist keine Aussage über Verfügbarkeit oder
        Freigabe möglich. „Verbindungen“ bietet die Pfeilziele auch als Text.
      </p>
      <div
        className="swimlane-scroll"
        tabIndex={0}
        role="region"
        aria-label={`Prozesslandkarte ${process.title}`}
      >
        <div
          ref={board}
          className="swimlane-board"
          style={{ '--lane-count': layout.lanes.length } as CSSProperties}
        >
          <div className="swimlane-roles" role="group" aria-label="Rollenspalten">
            {layout.lanes.map((lane) => (
              <div key={lane.id}>{lane.label}</div>
            ))}
          </div>
          <svg
            className="swimlane-flows"
            width={geometry.width}
            height={geometry.height}
            viewBox={`0 0 ${geometry.width} ${geometry.height}`}
            aria-hidden="true"
            focusable="false"
          >
            <defs>
              <marker id={marker} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                <path d="M 0 0 L 8 4 L 0 8 Z" />
              </marker>
            </defs>
            {geometry.paths.map((p, i) => (
              <path
                key={i}
                data-from={p.from}
                data-to={p.to}
                d={p.d}
                markerEnd={`url(#${marker})`}
              />
            ))}
          </svg>
          {layout.phases.map((phase) => (
            <section className="swimlane-phase" key={phase} aria-label={phase}>
              <h3>{phase}</h3>
              <ol className="swimlane-grid">
                {layout.placements
                  .filter((p) => p.step.phase === phase)
                  .map((p) => (
                    <StepCard
                      key={p.step.id}
                      style={{ gridColumn: p.column, gridRow: p.row }}
                      step={p.step}
                      process={process}
                      store={store}
                      dismissed={tooltipsDismissed}
                      showTooltip={() => setTooltipsDismissed(false)}
                    />
                  ))}
              </ol>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
