import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';
import './data/editorial-content';
import { hydrateEditorialObjects } from './lib/editorial-registry';
import { refreshInventory } from './data/inventory';
declare const __LOCAL_EDITOR__: boolean;

async function start() {
  if (__LOCAL_EDITOR__) {
    const sessionResponse = await fetch('/__local-editor/session');
    if (!sessionResponse.ok) throw new Error('Lokaler Bearbeitungsserver ist nicht verfügbar.');
    const session = await sessionResponse.json();
    const response = await fetch('/__local-editor/content', {
      headers: { 'X-Local-Editor-Token': session.token },
      cache: 'no-store',
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    hydrateEditorialObjects(data);
    refreshInventory();
  }
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
void start().catch((error) => {
  const root = document.getElementById('root')!;
  root.setAttribute('role', 'alert');
  root.textContent = 'Inhalte konnten nicht geladen werden: ' + error.message;
});
