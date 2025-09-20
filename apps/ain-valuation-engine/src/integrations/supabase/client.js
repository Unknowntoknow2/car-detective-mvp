import { createClient } from '@supabase/supabase-js';
function makeStub() {
    const op = async () => ({ data: null, error: new Error('Supabase disabled (missing env)') });
    // One table object reused and returned by eq/match/limit/order to allow chaining
    const table = {};
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
    const client = {
        from: (_) => table,
        functions: { invoke: async () => ({ data: null, error: new Error('Supabase function disabled (missing env)') }) },
        auth: { getSession: async () => ({ data: { session: null }, error: null }) }
    };
    return client;
}
const url = import.meta.env?.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const key = import.meta.env?.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = (!url || !key)
    ? (, makeStub())
    : createClient(url, key);
export default supabase;
