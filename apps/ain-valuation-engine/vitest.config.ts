import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./test/setup.ts'],
    restoreMocks: true,
    mockReset: true,
    clearMocks: true,
    timeout: 15_000,
    exclude: ['supabase/functions/**/__tests__/**'],
  },
})
