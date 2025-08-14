const { pathsToModuleNameMapper } = require("ts-jest");
let tsconfig = {};
try { tsconfig = require("./tsconfig.json"); } catch {}
module.exports = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  transform: { "^.+\\.[tj]sx?$": [ "ts-jest", { useESM: true, tsconfig, diagnostics: { warnOnly: false }, isolatedModules: true } ] },
  moduleNameMapper: tsconfig.compilerOptions?.paths
    ? pathsToModuleNameMapper(tsconfig.compilerOptions.paths, { prefix: "<rootDir>/" })
    : { "^@/(.*)$": "<rootDir>/src/$1" },
  testMatch: [ "<rootDir>/src/**/*.test.[tj]s?(x)", "<rootDir>/apps/**/*.test.[tj]s?(x)", "<rootDir>/frontend/**/*.test.[tj]s?(x)" ],
  testPathIgnorePatterns: [ "<rootDir>/supabase/functions/", "<rootDir>/python/", "<rootDir>/val_engine/", "<rootDir>/venv/", "<rootDir>/node_modules/", "<rootDir>/dist/", "<rootDir>/coverage/" ],
  collectCoverage: true,
  coverageDirectory: "coverage/js",
  coverageReporters: ["text", "lcov", "html"],
  coveragePathIgnorePatterns: ["/node_modules/", "/tests/", "/dist/", "/supabase/functions/"],
  coverageThreshold: { global: { branches: 70, functions: 70, lines: 70, statements: 70 } },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "mjs", "cjs", "json", "node"],
};
