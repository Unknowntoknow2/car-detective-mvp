// env.d.ts
/// <reference types="vite/client" />

declare const __REQUIRE_AIN__: boolean;

interface ImportMetaEnv {
  readonly USE_AIN_VALUATION: string;
  readonly AIN_UPSTREAM_URL: string;
  readonly AIN_API_KEY: string;
  readonly DEBUG_HEADERS: string;
  readonly NODE_ENV: string;
  readonly PROD: boolean;
  readonly DEV: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}