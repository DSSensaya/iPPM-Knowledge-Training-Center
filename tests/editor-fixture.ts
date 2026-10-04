import { test as base } from '@playwright/test';
import { mkdtemp, cp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { startEditor } from '../scripts/editor-server';
export const test = base.extend<{ editor: { root: string; base: string; token: string } }>({
  editor: async ({}, use) => {
    const root = await mkdtemp(join(tmpdir(), 'ippm-editor-'));
    await cp('src/content', join(root, 'src/content'), { recursive: true });
    await cp('dist-editor', join(root, 'dist-editor'), { recursive: true });
    const server = await startEditor(root, 0),
      url = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
    try {
      const { token } = await (await fetch(url + '/__local-editor/session')).json();
      await use({ root, base: url, token });
    } finally {
      await new Promise<void>((done, reject) => server.close((e) => (e ? reject(e) : done())));
      await rm(root, { recursive: true, force: true });
    }
  },
});
