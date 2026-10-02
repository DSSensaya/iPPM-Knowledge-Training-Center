import { resolve } from 'node:path';
import { build } from 'vite';

// A fresh, self-contained data module avoids partially invalidated SSR graphs.
// The content-addressed import reuses identical snapshots, never a stale journal.
export async function loadEditorialModel(root: string) {
  const result = await build({
    root,
    configFile: false,
    logLevel: 'silent',
    build: {
      ssr: resolve(root, 'src/data/editorial-content.ts'),
      write: false,
      minify: false,
      rollupOptions: { output: { inlineDynamicImports: true } },
    },
  });
  if (Array.isArray(result) || !('output' in result))
    throw new Error('Inhaltsmodell konnte nicht geladen werden.');
  const output = result.output.find((item) => item.type === 'chunk');
  if (!output || output.type !== 'chunk') throw new Error('Inhaltsmodell fehlt.');
  return import('data:text/javascript;base64,' + Buffer.from(output.code).toString('base64'));
}
