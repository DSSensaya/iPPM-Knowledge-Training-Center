import { expect } from '@playwright/test';
import { test } from './editor-fixture';
import { readFile, writeFile, cp, rm, symlink, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { request as httpRequest } from 'node:http';
const headers = (token: string) => ({
  'X-Local-Editor-Token': token,
  'Content-Type': 'application/json',
});
const file = '/__local-editor/files/article~guide-project-objectives';
test('direct canonical JSON saving is atomic, reloadable and has no journal', async ({
  editor: { root, base, token },
}) => {
  const response = await fetch(base + file, { headers: headers(token) }),
    state = await response.json();
  state.value.summary = 'Ein geänderter begrenzter Beitrag';
  const save = await fetch(base + file, {
    method: 'PUT',
    headers: headers(token),
    body: JSON.stringify(state),
  });
  expect(save.status).toBe(200);
  const actual = JSON.parse(
    await readFile(join(root, 'src/content/articles/guide-project-objectives.json'), 'utf8'),
  );
  expect(actual.summary).toBe(state.value.summary);
  expect(
    (
      await (await fetch(base + '/__local-editor/content', { headers: headers(token) })).json()
    ).content.articles.find((a: { id: string }) => a.id === actual.id).summary,
  ).toBe(actual.summary);
  expect(
    (await readdir(join(root, 'src/content'))).some(
      (n) => n.endsWith('.lock') || n.endsWith('.tmp') || n.includes('journal'),
    ),
  ).toBeFalsy();
});
test('stale and concurrent writes cannot overwrite a newer canonical change', async ({
  editor: { root, base, token },
}) => {
  const state = await (await fetch(base + file, { headers: headers(token) })).json();
  const altered = { ...state, value: { ...state.value, summary: 'Erste gültige Änderung' } };
  const responses = await Promise.all(
    [1, 2].map(() =>
      fetch(base + file, { method: 'PUT', headers: headers(token), body: JSON.stringify(altered) }),
    ),
  );
  expect(responses.map((r) => r.status).sort()).toEqual([200, 409]);
  const stale = await fetch(base + file, {
    method: 'PUT',
    headers: headers(token),
    body: JSON.stringify({ ...state, value: { ...state.value, summary: 'Veraltete Änderung' } }),
  });
  expect(stale.status).toBe(409);
  expect(
    JSON.parse(
      await readFile(join(root, 'src/content/articles/guide-project-objectives.json'), 'utf8'),
    ).summary,
  ).toBe('Erste gültige Änderung');
});
test('changes to other collections also cause a conflict', async ({
  editor: { root, base, token },
}) => {
  const state = await (await fetch(base + file, { headers: headers(token) })).json();
  const path = join(root, 'src/content/roles.json'),
    roles = JSON.parse(await readFile(path, 'utf8'));
  roles[0].responsibility += ' (Teständerung)';
  await writeFile(path, JSON.stringify(roles));
  expect(
    (
      await fetch(base + file, {
        method: 'PUT',
        headers: headers(token),
        body: JSON.stringify(state),
      })
    ).status,
  ).toBe(409);
});
test('invalid data and ID renaming leave original bytes unchanged', async ({
  editor: { root, base, token },
}) => {
  const state = await (await fetch(base + file, { headers: headers(token) })).json(),
    path = join(root, 'src/content/articles/guide-project-objectives.json'),
    original = await readFile(path, 'utf8');
  for (const value of [
    { ...state.value, roleIds: ['missing'] },
    { ...state.value, id: 'new-id' },
    { ...state.value, status: 'reviewed' },
    { ...state.value, knowledge: {} },
  ])
    expect(
      (
        await fetch(base + file, {
          method: 'PUT',
          headers: headers(token),
          body: JSON.stringify({ ...state, value }),
        })
      ).status,
    ).toBe(400);
  expect(await readFile(path, 'utf8')).toBe(original);
});
test('loopback origin, token, fixed paths, symlinks and body limits are enforced', async ({
  editor: { root, base, token },
}) => {
  expect((await fetch(base + file)).status).toBe(403);
  expect(
    (
      await fetch(base + file, {
        headers: { ...headers(token), Origin: 'https://foreign.example' },
      })
    ).status,
  ).toBe(403);
  const hostStatus = await new Promise<number>((resolve, reject) => {
    const req = httpRequest(
      base + file,
      { headers: { ...headers(token), Host: 'foreign.example' } },
      (res) => {
        res.resume();
        resolve(res.statusCode!);
      },
    );
    req.on('error', reject);
    req.end();
  });
  expect(hostStatus).toBe(403);
  expect(
    (await fetch(base + '/__local-editor/files/unknown', { headers: headers(token) })).status,
  ).toBe(404);
  expect(
    (
      await fetch(base + file, {
        method: 'PUT',
        headers: headers(token),
        body: 'x'.repeat(1024 * 1024 + 1),
      })
    ).status,
  ).toBe(413);
  const path = join(root, 'src/content/articles/guide-project-objectives.json'),
    copy = join(root, 'outside.json');
  await cp(path, copy);
  await rm(path);
  await symlink(copy, path);
  expect((await fetch(base + file, { headers: headers(token) })).status).toBe(400);
  expect((await fetch(base + '/server.js')).status).toBe(404);
  expect((await fetch(base + '/src/content/roles.json')).status).toBe(404);
});

test('built backend executable reads and saves current canonical JSON', async ({
  editor: { root },
}) => {
  const { spawn } = await import('node:child_process');
  const process = spawn(globalThis.process.execPath, [join(root, 'dist-editor/server.js')], {
    cwd: root,
    env: { ...globalThis.process.env, EDITOR_PORT: '0' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  try {
    const address = await new Promise<string>((done, reject) => {
      const timeout = setTimeout(() => reject(new Error('Gebauter Editor startet nicht')), 10000);
      process.stdout.on('data', (chunk) => {
        const match = /http:\/\/127\.0\.0\.1:\d+/.exec(chunk.toString());
        if (match) {
          clearTimeout(timeout);
          done(match[0]);
        }
      });
      process.once('error', (e) => {
        clearTimeout(timeout);
        reject(e);
      });
      process.once('exit', (code) => {
        clearTimeout(timeout);
        reject(new Error(`Editor exit ${code}`));
      });
    });
    const { token } = await (await fetch(address + '/__local-editor/session')).json();
    const state = await (await fetch(address + file, { headers: headers(token) })).json();
    state.value.summary = 'Über den gebauten Backend-Prozess gespeichert';
    expect(
      (
        await fetch(address + file, {
          method: 'PUT',
          headers: headers(token),
          body: JSON.stringify(state),
        })
      ).status,
    ).toBe(200);
    expect(
      JSON.parse(
        await readFile(join(root, 'src/content/articles/guide-project-objectives.json'), 'utf8'),
      ).summary,
    ).toBe(state.value.summary);
    expect((await fetch(address + '/server.js')).status).toBe(404);
  } finally {
    if (process.exitCode === null) {
      const exited = new Promise<void>((done) => process.once('exit', () => done()));
      process.kill();
      await exited;
    }
  }
});

test('Vite local-edit plugin uses the same direct validated writer', async ({
  editor: { root },
}) => {
  const { createServer } = await import('vite');
  const { localEditorPlugin } = await import('../scripts/local-editor-plugin');
  const vite = await createServer({
    configFile: false,
    root,
    server: { host: '127.0.0.1', port: 0, hmr: false },
    plugins: [localEditorPlugin(root)],
  });
  try {
    await vite.listen();
    const address = `http://127.0.0.1:${(vite.httpServer!.address() as { port: number }).port}`;
    const { token } = await (await fetch(address + '/__local-editor/session')).json();
    const state = await (await fetch(address + file, { headers: headers(token) })).json();
    state.value.summary = 'Über den Entwicklungseditor gespeichert';
    expect(
      (
        await fetch(address + file, {
          method: 'PUT',
          headers: headers(token),
          body: JSON.stringify(state),
        })
      ).status,
    ).toBe(200);
    expect(
      JSON.parse(
        await readFile(join(root, 'src/content/articles/guide-project-objectives.json'), 'utf8'),
      ).summary,
    ).toBe(state.value.summary);
  } finally {
    await vite.close();
  }
});
