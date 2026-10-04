import { createHash, randomBytes } from 'node:crypto';
import { readFile, open, rename, unlink } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { Plugin, ViteDevServer } from 'vite';
import { collectionFiles, contentFiles, loadContent } from './content-model';
import { validateContent } from '../src/content/validation';

export function contentValidationPlugin(root: string): Plugin {
  return {
    name: 'ippm-content-validation',
    async buildStart() {
      await loadContent(root);
    },
  };
}
export function localEditorPlugin(root: string): Plugin {
  const token = randomBytes(32).toString('hex'),
    lock = resolve(root, 'src/content/.editor.lock');
  async function fingerprint() {
    const hash = createHash('sha256');
    for (const [key, path] of await contentFiles(root)) {
      hash.update(key);
      hash.update(await readFile(path));
    }
    return hash.digest('hex');
  }
  async function snapshot() {
    const version = await fingerprint(),
      content = await loadContent(root);
    if (version !== (await fingerprint()))
      throw Object.assign(new Error('Inhalte während des Ladens geändert. Erneut laden.'), {
        status: 409,
      });
    return { version, content };
  }
  return {
    name: 'ippm-local-editor',
    apply: 'serve',
    configureServer(server: ViteDevServer) {
      if (server.config.server.host !== '127.0.0.1')
        throw new Error('Bearbeitung ist ausschließlich an 127.0.0.1 zulässig.');
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/__local-editor')) {
          if (!['GET', 'HEAD'].includes(req.method ?? '')) {
            res.statusCode = 405;
            res.end('Methode nicht zulässig');
            return;
          }
          return next();
        }
        res.setHeader('Cache-Control', 'no-store');
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        const reply = (status: number, value: unknown) => {
          res.statusCode = status;
          res.end(JSON.stringify(value));
        };
        const addr = server.httpServer?.address(),
          host = typeof addr === 'object' && addr ? `127.0.0.1:${addr.port}` : '';
        if (
          req.socket.remoteAddress !== '127.0.0.1' ||
          req.headers.host !== host ||
          (req.headers.origin && req.headers.origin !== `http://${host}`) ||
          req.headers['sec-fetch-site'] === 'cross-site'
        )
          return reply(403, { error: 'Nur direkte lokale Zugriffe sind zulässig.' });
        if (req.url === '/__local-editor/session' && req.method === 'GET')
          return reply(200, { token });
        if (req.headers['x-local-editor-token'] !== token)
          return reply(403, { error: 'Lokale Bearbeitungssitzung fehlt. Erneut laden.' });
        if (!['GET', 'PUT'].includes(req.method ?? ''))
          return reply(405, { error: 'Methode nicht zugelassen.' });
        let handle: Awaited<ReturnType<typeof open>> | undefined, temporary: string | undefined;
        try {
          if (req.url === '/__local-editor/content' && req.method === 'GET')
            return reply(200, await snapshot());
          const key = /^\/__local-editor\/files\/([a-zA-Z0-9._~-]+)$/.exec(req.url ?? '')?.[1];
          const files = await contentFiles(root),
            file = key ? files.get(key) : undefined;
          if (!key || !file) return reply(404, { error: 'Kein zugelassener Inhaltspfad.' });
          if (req.method === 'GET') {
            const state = await snapshot();
            const value = key.startsWith('article~')
              ? state.content.articles.find((a) => a.id === key.substring(8))
              : state.content[collectionFiles[key]];
            return reply(200, { version: state.version, value });
          }
          if (!req.headers['content-type']?.startsWith('application/json'))
            return reply(415, { error: 'JSON erwartet.' });
          const chunks: Buffer[] = [];
          let size = 0;
          for await (const chunk of req) {
            size += chunk.length;
            if (size > 1024 * 1024)
              return reply(413, { error: 'Inhalt ist zu groß (maximal 1 MB).' });
            chunks.push(Buffer.from(chunk));
          }
          const body = JSON.parse(Buffer.concat(chunks).toString('utf8')) as {
            version: unknown;
            value: unknown;
          };
          if (typeof body.version !== 'string' || !body.version || body.value === undefined)
            return reply(400, { error: 'Version und Inhalt fehlen.' });
          try {
            handle = await open(lock, 'wx', 0o600);
          } catch (error) {
            if ((error as NodeJS.ErrnoException).code === 'EEXIST')
              return reply(409, { error: 'Eine Speicherung läuft bereits. Erneut laden.' });
            throw error;
          }
          const state = await snapshot();
          if (body.version !== state.version)
            return reply(409, {
              error:
                'Inhalte wurden seit dem Laden geändert. Ihre Eingaben bleiben erhalten. Aktuellen Stand laden und vergleichen.',
            });
          const candidate = structuredClone(state.content);
          if (key.startsWith('article~')) {
            const id = key.substring(8);
            if ((body.value as { id?: string })?.id !== id)
              return reply(400, { error: 'Die Artikel-ID darf nicht geändert werden.' });
            candidate.articles = candidate.articles.map((a) =>
              a.id === id ? (body.value as typeof a) : a,
            );
          } else Object.assign(candidate, { [collectionFiles[key]]: body.value });
          validateContent(candidate);
          // Existing IDs are protected; adding references requires editing the corresponding collections.
          const before = JSON.parse(await readFile(file, 'utf8'));
          if (Array.isArray(before) && Array.isArray(body.value) && key !== 'help') {
            const afterIds = new Set(body.value.map((v: { id: string }) => v.id));
            if (before.some((v: { id: string }) => !afterIds.has(v.id)))
              return reply(400, {
                error:
                  'Bestehende IDs dürfen im lokalen Editor nicht entfernt oder umbenannt werden.',
              });
          }
          if (key === 'systems') {
            const afterIds = new Set(
              candidate.systems.flatMap((s) => s.destinations?.map((d) => d.id) ?? []),
            );
            if (
              state.content.systems
                .flatMap((s) => s.destinations ?? [])
                .some((d) => !afterIds.has(d.id))
            )
              return reply(400, {
                error: 'Bestehende Bedienziel-IDs dürfen nicht entfernt werden.',
              });
          }
          if (key === 'processes') {
            const afterIds = new Set(candidate.processes.flatMap((p) => p.steps.map((s) => s.id)));
            if (state.content.processes.flatMap((p) => p.steps).some((s) => !afterIds.has(s.id)))
              return reply(400, {
                error: 'Bestehende ProcessStep-IDs dürfen nicht entfernt werden.',
              });
          }
          if (state.version !== (await fingerprint()))
            return reply(409, { error: 'Inhalte während der Prüfung geändert. Erneut laden.' });
          await contentFiles(root);
          temporary = file + '.' + randomBytes(8).toString('hex') + '.tmp';
          const output = await open(temporary, 'wx', 0o600);
          try {
            await output.writeFile(JSON.stringify(body.value, null, 2) + '\n');
            await output.sync();
          } finally {
            await output.close();
          }
          // Recheck optimistic version immediately before atomic replacement.
          if (state.version !== (await fingerprint()))
            return reply(409, { error: 'Inhalte vor dem Speichern geändert. Erneut laden.' });
          await contentFiles(root);
          await rename(temporary, file);
          temporary = undefined;
          // Directory fsync is supported on Unix; Windows still uses fsynced file + atomic rename.
          if (process.platform !== 'win32') {
            const dir = await open(resolve(file, '..'), 'r');
            try {
              await dir.sync();
            } finally {
              await dir.close();
            }
          }
          return reply(200, await snapshot());
        } catch (error) {
          return reply((error as { status?: number }).status ?? 400, {
            error: (error as Error).message,
          });
        } finally {
          if (temporary) await unlink(temporary).catch(() => {});
          if (handle) {
            await handle.close();
            await unlink(lock);
          }
        }
      });
    },
  };
}
