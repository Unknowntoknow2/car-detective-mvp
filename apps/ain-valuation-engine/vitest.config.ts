import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  test: {
    globals: true,           // <-- make describe/it/expect available
    environment: 'node',     // or 'jsdom' if your tests need DOM
    setupFiles: ['tests/setup.ts'],
  },
  resolve: {
    alias: {
      openai: fileURLToPath(new URL('./tests/mocks/openai.ts', import.meta.url)),
    },
  },
});
