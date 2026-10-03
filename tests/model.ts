import { build } from 'vite';
import type * as Model from './fixtures/query-entry';
export async function loadModel(): Promise<typeof Model> {
  const result = await build({
    configFile: false,
    logLevel: 'silent',
    build: {
      ssr: 'tests/fixtures/query-entry.ts',
      write: false,
      minify: false,
      rollupOptions: { output: { inlineDynamicImports: true } },
    },
  });
  const output = Array.isArray(result) ? result[0] : result;
  if (!('output' in output) || output.output[0].type !== 'chunk')
    throw new Error('Query-Modell konnte nicht geladen werden.');
  return import(
    'data:text/javascript;base64,' + Buffer.from(output.output[0].code).toString('base64')
  );
}
