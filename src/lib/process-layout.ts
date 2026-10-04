import type { Process, Role } from '../content/types';

/** Presentation only: canonical order defines placement, never a flow relationship. */
export function getProcessLayout(process: Process, roles: Role[]) {
  const used = new Set(process.steps.flatMap((s) => s.roleIds));
  const lanes = roles.filter((r) => used.has(r.id)).map((r) => ({ id: r.id, label: r.label }));
  if (process.steps.some((s) => s.roleIds.length > 1))
    lanes.push({ id: '__shared', label: 'Gemeinsam zugeordnet' });
  if (process.steps.some((s) => !s.roleIds.length))
    lanes.push({ id: '__unassigned', label: 'Ohne Rollenzuordnung' });
  const phases = [...new Set(process.steps.map((s) => s.phase))];
  const counters = new Map<string, number>();
  const placements = process.steps.map((step) => {
    const laneId = step.roleIds.length > 1 ? '__shared' : (step.roleIds[0] ?? '__unassigned');
    const key = JSON.stringify([step.phase, laneId]);
    const row = (counters.get(key) ?? 0) + 1;
    counters.set(key, row);
    return { step, laneId, column: lanes.findIndex((l) => l.id === laneId) + 1, row };
  });
  return { lanes, phases, placements };
}
