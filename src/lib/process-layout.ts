import type { Process, Role } from '../content/types';

type Rect = { left: number; right: number; top: number; bottom: number };
type Point = { x: number; y: number };

/** Prefer short, direct connections; use the existing gutters when cards block them. */
export function getProcessFlowPath(a: Rect, b: Rect, cards: Rect[], index: number) {
  const center = (r: Rect) => ({ x: (r.left + r.right) / 2, y: (r.top + r.bottom) / 2 });
  const ac = center(a),
    bc = center(b);
  const candidates: Point[][] = [];
  const add = (...points: Point[]) => {
    const distinct = points.filter(
      (p, i) => !i || p.x !== points[i - 1].x || p.y !== points[i - 1].y,
    );
    const route = distinct.filter((p, i) => {
      const prev = distinct[i - 1],
        next = distinct[i + 1];
      return (
        !prev ||
        !next ||
        !((p.x === prev.x && p.x === next.x) || (p.y === prev.y && p.y === next.y))
      );
    });
    const clear = route.slice(1).every((p, i) => {
      const prev = route[i];
      return cards.every((r) =>
        p.y === prev.y
          ? p.y <= r.top + 1 ||
            p.y >= r.bottom - 1 ||
            Math.max(p.x, prev.x) <= r.left + 1 ||
            Math.min(p.x, prev.x) >= r.right - 1
          : p.x <= r.left + 1 ||
            p.x >= r.right - 1 ||
            Math.max(p.y, prev.y) <= r.top + 1 ||
            Math.min(p.y, prev.y) >= r.bottom - 1,
      );
    });
    if (clear) candidates.push(route);
  };

  // Facing sides connect neighbouring lanes without a return loop.
  if (a.right <= b.left || b.right <= a.left) {
    const rightward = ac.x < bc.x;
    const start = { x: rightward ? a.right : a.left, y: ac.y };
    const end = { x: rightward ? b.left : b.right, y: bc.y };
    const x = (start.x + end.x) / 2;
    add(start, { x, y: start.y }, { x, y: end.y }, end);
    const top = Math.max(a.top, b.top),
      bottom = Math.min(a.bottom, b.bottom);
    if (top < bottom) {
      const y = (top + bottom) / 2;
      add({ x: start.x, y }, { x: end.x, y });
    }
  }
  // Consecutive steps in a lane connect straight down (or up for explicit returns).
  if (a.bottom <= b.top || b.bottom <= a.top) {
    const downward = ac.y < bc.y;
    const start = { x: ac.x, y: downward ? a.bottom : a.top };
    const end = { x: bc.x, y: downward ? b.top : b.bottom };
    const y = (start.y + end.y) / 2;
    add(start, { x: start.x, y }, { x: end.x, y }, end);
  }

  const offset = 16 + (index % 3) * 8;
  const rowBottom = Math.max(
    ...cards.filter((r) => Math.abs(r.top - a.top) < 1).map((r) => r.bottom),
  );
  const corridors = [rowBottom + offset, a.top - offset, b.top - offset];
  for (const sourceSide of ['right', 'left'] as const) {
    for (const targetSide of ['left', 'right'] as const) {
      const start = { x: a[sourceSide], y: ac.y };
      const end = { x: b[targetSide], y: bc.y };
      const ax = start.x + (sourceSide === 'right' ? offset : -offset);
      const bx = end.x + (targetSide === 'right' ? offset : -offset);
      if (ax < 0 || bx < 0) continue;
      if (Math.abs(a.left - b.left) < 1 && sourceSide === targetSide) {
        add(start, { x: ax, y: start.y }, { x: ax, y: end.y }, end);
      }
      for (const y of corridors) {
        add(start, { x: ax, y: start.y }, { x: ax, y }, { x: bx, y }, { x: bx, y: end.y }, end);
      }
    }
  }
  const cost = (route: Point[]) =>
    route
      .slice(1)
      .reduce((sum, p, i) => sum + Math.abs(p.x - route[i].x) + Math.abs(p.y - route[i].y), 0) +
    (route.length - 2) * 24;
  candidates.sort((first, second) => cost(first) - cost(second));
  const route = candidates[0];
  if (!route) return '';
  return route
    .map((p, i) => (!i ? `M ${p.x} ${p.y}` : p.y === route[i - 1].y ? `H ${p.x}` : `V ${p.y}`))
    .join(' ');
}

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
