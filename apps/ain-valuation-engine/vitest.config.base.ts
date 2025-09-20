import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./vitest.setup.ts"],
    include: [
      "tests/**/*.test.ts",
      "src/**/*.test.ts",
      "supabase/functions/**/*.test.ts"
    ],
    reporters: "default",
  },
  resolve: {
    alias: {
    },
  },
});
