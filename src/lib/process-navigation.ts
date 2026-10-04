// Ephemeral presentation state. No process content or learning data are copied.
const positions = new Map<string, { x: number; y: number; focusId: string; mapX: number }>();
export function processHref(processId: string, view: string) {
  return `#/prozesse/${processId}?ansicht=${view === 'liste' ? 'liste' : 'karte'}`;
}
export function rememberProcessPosition(href: string, focusId: string, mapX = 0) {
  const position = { x: window.scrollX, y: window.scrollY, focusId, mapX };
  positions.set(href, position);
  positions.set(window.location.hash, position);
}
export function restoreProcessPosition() {
  const position = positions.get(window.location.hash);
  if (!position) return;
  document.getElementById(position.focusId)?.focus({ preventScroll: true });
  const map = document.querySelector('.swimlane-scroll');
  if (map) map.scrollLeft = position.mapX;
  window.scrollTo(position.x, position.y);
}
export function stepHref(stepId: string, processId: string, view: string) {
  const params = new URLSearchParams({ prozess: processId, ansicht: view });
  return `#/schritt/${stepId}?${params}`;
}
