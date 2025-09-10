import { createClient, type SupabaseClient } from '@supabase/supabase-js';

function makeStub(): SupabaseClient {
  const op = async () => ({ data: null, error: new Error('Supabase disabled (missing env)') });

  // One table object reused and returned by eq/match/limit/order to allow chaining
  const table: any = {};
  Object.assign(table, {
    select: op,
    insert: op,
    upsert: op,
    update: op,
    delete: op,
    eq: () => table,
    match: () => table,
    limit: () => table,
    order: () => table,
  });

  const client: any = {
    from: (_: string) => table,
    functions: { invoke: async () => ({ data: null, error: new Error('Supabase function disabled (missing env)') }) },
    auth: { getSession: async () => ({ data: { session: null }, error: null }) }
  };

  return client as unknown as SupabaseClient;
}

const url = (import.meta as any).env?.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const key = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase: SupabaseClient = (!url || !key)
  ? (console.warn('[supabase] Missing VITE_SUPABASE_URL/KEY — using browser stub.'), makeStub())
  : createClient(url, key);

export default supabase;
