import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { contentValidationPlugin, localEditorPlugin } from './scripts/local-editor-plugin';
import packageInfo from './package.json';

export default defineConfig(({ command, mode }) => {
  const editing = mode === 'local-edit';
  return {
    plugins: [
      react(),
      contentValidationPlugin(process.cwd()),
      ...(editing && command === 'serve' ? [localEditorPlugin(process.cwd())] : []),
    ],
    base: './',
    cacheDir: editing ? 'node_modules/.vite-local-edit' : undefined,
    define: {
      __LOCAL_EDITOR__: JSON.stringify(editing),
      __APP_VERSION__: JSON.stringify(packageInfo.version),
      __APP_BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },
    server: editing ? { host: '127.0.0.1', port: 5174, strictPort: true, hmr: false } : undefined,
  };
});
