
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
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: "::",
    port: 8080,
    open: true,
  },
  build: {
    rollupOptions: {
      // Force Vite to use the JavaScript version of Rollup
      external: [],
    },
  },
  optimizeDeps: {
    // Exclude native dependencies from optimization
    exclude: ['@rollup/rollup-linux-x64-gnu', '@rollup/rollup-darwin-x64', '@rollup/rollup-win32-x64-msvc'],
  },
  define: {
    // Prevent Rollup from trying to load native binaries
    'process.env.ROLLUP_NATIVE': 'false',
  },
}))
