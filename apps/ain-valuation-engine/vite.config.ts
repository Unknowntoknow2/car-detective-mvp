import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Clean, single "resolve" block. Add '@' root alias too.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/workspaces/ain-valuation-engine/src',
      '@services': '/workspaces/ain-valuation-engine/src/services',
      '@backend': '/workspaces/ain-valuation-engine/src/ain-backend',
    },
  },
  optimizeDeps: {
    // Force a single entry to avoid scanning other index.html files in the repo
    entries: ['index.html'],
  },
});
