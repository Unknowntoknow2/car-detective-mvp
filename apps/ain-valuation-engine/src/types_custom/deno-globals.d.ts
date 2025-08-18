// Global type declarations for the workspace

// Deno remote module declarations
declare module "https://deno.land/std@*/http/server.ts" {
  export function serve(
    handler: (request: Request, connInfo?: any) => Response | Promise<Response>,
    options?: any
  ): void;
}

declare module "https://esm.sh/@supabase/supabase-js@*" {
  export interface SupabaseClient {
    from(table: string): any;
    auth: any;
    storage: any;
  }

  export function createClient(url: string, key: string): SupabaseClient;
}

// Additional Deno modules
declare module "https://deno.land/x/*" {
  const content: any;
  export default content;
}

declare module "https://esm.sh/*" {
  const content: any;
  export default content;
}

// Extend global namespace for Deno
declare global {
  namespace Deno {
    export const env: {
      get(key: string): string | undefined;
      set(key: string, value: string): void;
      has(key: string): boolean;
      delete(key: string): boolean;
      toObject(): Record<string, string>;
    };
  }

  const serve: (
    handler: (request: Request, connInfo?: any) => Response | Promise<Response>,
    options?: any
  ) => void;
}

export {};
