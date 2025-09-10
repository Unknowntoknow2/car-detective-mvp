
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Single source of truth, no trailing slash
    },
  },
  server: {
    host: "::",
    port: 8080,
    open: true,
  },
  build: {
    rollupOptions: {
      external: [],
    },
  },
  optimizeDeps: {
    exclude: ['@rollup/rollup-linux-x64-gnu', '@rollup/rollup-darwin-x64', '@rollup/rollup-win32-x64-msvc'],
  },
  define: {
    'process.env.ROLLUP_NATIVE': 'false',
    '__REQUIRE_AIN__': mode === 'production',
  },
}))
