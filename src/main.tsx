import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';
import { replaceContent } from './content';
async function start() {
  if (__LOCAL_EDITOR__) {
    const sessionResponse = await fetch('/__local-editor/session');
    if (!sessionResponse.ok) throw new Error('Lokaler Bearbeitungsserver nicht verfügbar.');
    const session = await sessionResponse.json(),
      response = await fetch('/__local-editor/content', {
        headers: { 'X-Local-Editor-Token': session.token },
        cache: 'no-store',
      });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    replaceContent(data.content);
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
