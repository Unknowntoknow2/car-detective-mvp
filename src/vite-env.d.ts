/// <reference types="vite/client" />

// Fix for missing vite/client types
declare module 'vite/client' {
  interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string
    readonly VITE_SUPABASE_ANON_KEY: string
    readonly USE_AIN_VALUATION?: string
    readonly AIN_UPSTREAM_URL?: string
    readonly AIN_API_KEY?: string
    readonly NODE_ENV: string
    readonly PROD: boolean
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}

// Extend global ImportMeta
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly USE_AIN_VALUATION?: string
  readonly AIN_UPSTREAM_URL?: string
  readonly AIN_API_KEY?: string
  readonly NODE_ENV: string
  readonly PROD: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}