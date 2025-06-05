import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    fs: { strict: false },
    hmr: { overlay: true },
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      input: './index.html',
    },
  },
  optimizeDeps: {
    exclude: ['@esbuild/linux-x64', '@rollup/rollup-linux-x64-gnu']
  }
});
