import { createServer as httpServer } from 'node:http';
import { readFile, realpath } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import type { ViteDevServer } from 'vite';
import { localEditorPlugin } from './local-editor-plugin';

export async function startEditor(root = process.cwd(), port = 5174) {
  const staticRoot = await realpath(resolve(root, 'dist-editor'));
  type Handler = (
    req: import('node:http').IncomingMessage,
    res: import('node:http').ServerResponse,
    next: () => void,
  ) => void;
  let handler: Handler;
  const server = httpServer((req, res) => {
    handler(req, res, () => {
      void serve();
    });
    async function serve() {
      try {
        const url = new URL(req.url ?? '/', 'http://127.0.0.1');
        const path = resolve(
          staticRoot,
          '.' + decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname),
        );
        // Only the built reader assets, never the bundled backend or repository sources.
        if (
          !path.startsWith(staticRoot + sep) ||
          !['.html', '.js', '.css', '.svg', '.png', '.ico', '.woff2'].includes(extname(path)) ||
          path.toLowerCase().endsWith('server.js')
        )
          throw new Error('Not found');
        const canonical = await realpath(path);
        if (!canonical.startsWith(staticRoot + sep)) throw new Error('Not found');
        const content = await readFile(canonical);
        res.setHeader(
          'Content-Type',
          (
            {
              '.html': 'text/html; charset=utf-8',
              '.js': 'text/javascript; charset=utf-8',
              '.css': 'text/css; charset=utf-8',
              '.svg': 'image/svg+xml',
            } as Record<string, string>
          )[extname(path)] ?? 'application/octet-stream',
        );
        res.setHeader('Cache-Control', 'no-store');
        res.end(req.method === 'HEAD' ? undefined : content);
      } catch {
        res.statusCode = 404;
        res.end('Nicht gefunden');
      }
    }
  });
  // Same direct JSON handler as development. No compiler, HMR or source serving runs.
  const runtime = {
    config: { server: { host: '127.0.0.1' } },
    httpServer: server,
    middlewares: {
      use(value: Handler) {
        handler = value;
      },
    },
  };
  const plugin = localEditorPlugin(root);
  const configure = plugin.configureServer as (server: ViteDevServer) => void;
  configure(runtime as unknown as ViteDevServer);
  await new Promise<void>((done, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', done);
  });
  return server;
}

if (process.argv[1]?.replaceAll('\\', '/').endsWith('/server.js')) {
  const server = await startEditor(process.cwd(), Number(process.env.EDITOR_PORT ?? 5174));
  const address = server.address() as { port: number };
  console.log(`Lokaler Editor: http://127.0.0.1:${address.port}`);
}
