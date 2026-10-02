import { build } from 'vite';
await build({ mode: 'local-edit', build: { outDir: 'dist-editor' } });
await build({
  configFile: false,
  build: {
    ssr: 'scripts/editor-server.ts',
    outDir: 'dist-editor',
    emptyOutDir: false,
    rollupOptions: {
      external: ['vite'],
      output: { entryFileNames: 'server.js', inlineDynamicImports: true },
    },
  },
});
