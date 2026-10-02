import { createHash, randomBytes } from 'node:crypto';
import { readFile, readdir, lstat, realpath, open, rename, unlink } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { loadEditorialModel } from './editor-model';
import type { Plugin, ViteDevServer } from 'vite';
import {
  applyJournal,
  editableArticleId,
  textOf,
  validateNote,
  validateText,
  validateConfirmedBy,
  changedFields,
  centerFinalNote,
} from '../src/lib/editorial';
import type { EditorialJournal } from '../src/lib/editorial';
import type { Article } from '../src/data/types';
import { migrateJournal } from '../src/lib/editorial-registry';
import type { RepositoryJournal } from '../src/lib/editorial-registry';

const maxBody = 256 * 1024;

// Execute the canonical data model during builds, before shipping a static reader.
export function editorialValidationPlugin(root: string): Plugin {
  return {
    name: 'ippm-editorial-validation',
    apply: 'build',
    async buildStart() {
      await loadEditorialModel(root);
    },
  };
}

export function localEditorPlugin(root: string): Plugin {
  const token = randomBytes(32).toString('hex');
  const file = resolve(root, 'src/data/local-editorial.json');
  const lock = `${file}.lock`;
  let server: ViteDevServer;
  async function safePaths() {
    const canonicalRoot = await realpath(root);
    const data = resolve(root, 'src/data');
    if (
      (await realpath(data)) !== join(canonicalRoot, 'src', 'data') ||
      (await lstat(file)).isSymbolicLink() ||
      (await realpath(file)) !== join(canonicalRoot, 'src', 'data', 'local-editorial.json')
    )
      throw new Error(
        'Der feste Speicherpfad darf keine umgeleiteten Verzeichnisse oder Dateien enthalten.',
      );
  }
  async function fingerprint() {
    // Includes journal and every data/model dependency, not only the current text.
    const hash = createHash('sha256');
    async function visit(dir: string) {
      for (const name of (await readdir(dir)).sort()) {
        if (name.endsWith('.lock') || name.endsWith('.tmp')) continue;
        const path = join(dir, name);
        const stat = await lstat(path);
        if (stat.isDirectory()) await visit(path);
        else if (stat.isFile()) {
          hash.update(path);
          hash.update(await readFile(path));
        } else throw new Error('Umgeleitete Datenpfade werden nicht unterstützt.');
      }
    }
    await visit(resolve(root, 'src/data'));
    return hash.digest('hex');
  }
  async function snapshot(id?: string) {
    await safePaths();
    const version = await fingerprint();
    const data = await loadEditorialModel(root);
    const repository = migrateJournal(JSON.parse(await readFile(file, 'utf8')));
    const objects = data.editorialObjects as Map<
      string,
      { baseline: Article; article: Article; fields?: string[]; source: string }
    >;
    const object = objects.get(id ?? editableArticleId);
    if (!object)
      throw Object.assign(new Error('Dieses Objekt ist nicht zur Bearbeitung zugelassen.'), {
        status: 404,
      });
    const baseline = object.baseline;
    const journal = repository.journals[baseline.id] ?? {
      version: 1 as const,
      articleId: baseline.id,
      baseline: null,
      changes: [],
    };
    const article = applyJournal(baseline, journal);
    if (version !== (await fingerprint()))
      throw Object.assign(new Error('Repository während des Ladens geändert. Erneut laden.'), {
        status: 409,
      });
    return { version, baseline, journal, article, repository, objects, object };
  }
  return {
    name: 'ippm-local-editor',
    apply: 'serve',
    configureServer(instance) {
      server = instance;
      if (server.config.server.host !== '127.0.0.1')
        throw new Error('Bearbeitung ist ausschließlich an 127.0.0.1 zulässig.');
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/__local-editor')) {
          if (!['GET', 'HEAD'].includes(req.method ?? '')) {
            res.statusCode = 405;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(
              JSON.stringify({
                error: 'Schreibmethoden sind nur für den zugelassenen Beitrag erlaubt.',
              }),
            );
            return;
          }
          return next();
        }
        res.setHeader('Cache-Control', 'no-store');
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        const reply = (status: number, body: unknown) => {
          res.statusCode = status;
          res.end(JSON.stringify(body));
        };
        const address = server.httpServer?.address();
        const host = typeof address === 'object' && address ? `127.0.0.1:${address.port}` : '';
        const origin = req.headers.origin;
        if (
          req.socket.remoteAddress !== '127.0.0.1' ||
          req.headers.host !== host ||
          (origin && origin !== `http://${host}`) ||
          req.headers['sec-fetch-site'] === 'cross-site'
        )
          return reply(403, {
            error: 'Nur direkte Zugriffe aus dem lokalen Bearbeitungsbetrieb sind zulässig.',
          });
        if (req.url === '/__local-editor/session' && req.method === 'GET')
          return reply(200, { token, articleId: editableArticleId });
        const objectId = /^\/__local-editor\/articles\/([a-zA-Z0-9:._-]+)$/.exec(
          req.url ?? '',
        )?.[1];
        if (!objectId && req.url !== '/__local-editor/content')
          return reply(404, { error: 'Dieses Objekt ist nicht zur Bearbeitung zugelassen.' });
        if (req.headers['x-local-editor-token'] !== token)
          return reply(403, {
            error: 'Bearbeitungssitzung fehlt oder ist abgelaufen. Erneut laden.',
          });
        if (!['GET', 'PUT'].includes(req.method ?? ''))
          return reply(405, { error: 'Methode nicht zugelassen.' });
        let handle;
        let temporary: string | undefined;
        try {
          if (req.url === '/__local-editor/content') {
            if (req.method !== 'GET') return reply(405, { error: 'Methode nicht zugelassen.' });
            const state = await snapshot();
            return reply(
              200,
              [...state.objects].map(([id, object]) => ({
                id,
                article: object.article,
                source: object.source,
                fields: object.fields,
              })),
            );
          }
          if (req.method === 'GET') {
            const state = await snapshot(objectId);
            return reply(200, {
              version: state.version,
              article: state.article,
              changes: state.journal.changes,
            });
          }
          if (req.headers['content-type'] !== 'application/json')
            return reply(415, { error: 'JSON erforderlich.' });
          if (Number(req.headers['content-length']) > maxBody) {
            req.resume();
            return reply(413, { error: 'Änderung ist zu groß.' });
          }
          const chunks: Buffer[] = [];
          let size = 0;
          for await (const chunk of req) {
            size += Buffer.byteLength(chunk);
            if (size > maxBody) {
              reply(413, { error: 'Änderung ist zu groß.' });
              return;
            }
            chunks.push(Buffer.from(chunk));
          }
          let request;
          try {
            request = JSON.parse(Buffer.concat(chunks).toString('utf8'));
          } catch {
            return reply(400, { error: 'Ungültiges JSON.' });
          }
          if (
            !request ||
            typeof request !== 'object' ||
            !['after|note|version', 'after|confirmation|note|version'].includes(
              Object.keys(request).sort().join('|'),
            )
          )
            return reply(400, { error: 'Unzulässige Felder im Speicherauftrag.' });
          await safePaths();
          try {
            handle = await open(lock, 'wx');
          } catch (error) {
            if ((error as NodeJS.ErrnoException).code === 'EEXIST')
              return reply(409, {
                error:
                  'Ein anderer Speichervorgang oder eine verbliebene Sperre blockiert. Erneut laden; Sperre nach Absturz prüfen.',
              });
            throw error;
          }
          const state = await snapshot(objectId);
          if (request.version !== state.version)
            return reply(409, {
              error:
                'Konflikt: Der Repository-Stand wurde geändert. Ihr Entwurf bleibt erhalten. Aktuellen Stand neu laden und Änderungen abgleichen.',
            });
          validateText(request.after, state.article, true);
          if (state.object.fields) {
            const { extra: _before, ...before } = textOf(state.article);
            const { extra: _after, ...after } = textOf(request.after);
            if (JSON.stringify(before) !== JSON.stringify(after))
              throw new Error('Nur zugelassene Objektfelder dürfen geändert werden.');
          }
          if ('confirmation' in request) {
            if (
              !request.confirmation ||
              typeof request.confirmation !== 'object' ||
              Array.isArray(request.confirmation) ||
              !['confirmedBy', 'confirmedBy|kind'].includes(
                Object.keys(request.confirmation).sort().join('|'),
              ) ||
              ('kind' in request.confirmation && request.confirmation.kind !== 'center-final')
            )
              return reply(400, {
                error: 'Nur Name und vorgesehene Freigabeart sind zulässig.',
              });
            validateConfirmedBy(request.confirmation.confirmedBy);
          }
          const centerFinal = request.confirmation?.kind === 'center-final';
          // No user comment for a final Center approval; keep a server-defined audit event.
          if (centerFinal) {
            if (request.note !== '')
              return reply(400, {
                error: 'Center-Freigabe wird ohne Änderungsanmerkung gespeichert.',
              });
          } else validateNote(request.note);
          if (JSON.stringify(textOf(state.article)) === JSON.stringify(textOf(request.after)))
            return reply(400, { error: 'Keine Änderung vorhanden.' });
          const journal: EditorialJournal = {
            ...state.journal,
            baseline: state.journal.baseline ?? state.baseline,
            changes: [
              ...state.journal.changes,
              {
                revision: state.article.revisions!.at(-1)!.number + 1,
                date: new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Berlin' }),
                note: centerFinal ? centerFinalNote : request.note.trim(),
                before: textOf(state.article),
                after: textOf(request.after),
                ...('confirmation' in request
                  ? {
                      confirmation: {
                        confirmedBy: request.confirmation.confirmedBy.trim(),
                        fields: changedFields(textOf(state.article), textOf(request.after)),
                        ...(centerFinal ? { kind: 'center-final' as const } : {}),
                      },
                    }
                  : {}),
              },
            ],
          };
          applyJournal(state.baseline, journal);
          temporary = `${file}.${randomBytes(8).toString('hex')}.tmp`;
          const out = await open(temporary, 'wx');
          try {
            const repository: RepositoryJournal = {
              version: 2,
              journals: { ...state.repository.journals, [state.baseline.id]: journal },
            };
            await out.writeFile(JSON.stringify(repository, null, 2) + '\n', 'utf8');
            await out.sync();
          } finally {
            await out.close();
          }
          await safePaths();
          if (state.version !== (await fingerprint()))
            return reply(409, {
              error:
                'Konflikt: Repository während des Speicherns geändert. Es wurde nichts übernommen.',
            });
          await rename(temporary, file);
          temporary = undefined;
          return reply(200, { revision: journal.changes.at(-1)!.revision });
        } catch (error) {
          const status =
            (error as { status?: number }).status ??
            ((error as NodeJS.ErrnoException).code ? 500 : 400);
          return reply(status, {
            error:
              status === 500
                ? 'Repository konnte nicht gespeichert oder gelesen werden. Dateirechte und Pfad prüfen.'
                : (error as Error).message,
          });
        } finally {
          if (temporary) await unlink(temporary).catch(() => {});
          if (handle) {
            await handle.close();
            await unlink(lock).catch(() => {});
          }
        }
      });
    },
  };
}
