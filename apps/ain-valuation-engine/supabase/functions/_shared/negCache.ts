import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
type Entry = { errCode: string; message: string };

export async function getNeg(sbUrl: string, serviceKey: string, vin: string) {
  const key = `negvin:${vin}`;
  const sb = createClient(sbUrl, serviceKey, { auth: { persistSession: false } });
  const { data } = await sb.from("api_cache")
    .select("payload,fetched_at,ttl_seconds").eq("key", key).maybeSingle();
  if (!data) return null;
  const age = (Date.now() - new Date(data.fetched_at).getTime()) / 1000;
  if (age < (data.ttl_seconds ?? 2592000)) return data.payload as Entry;
  return null;
}

export async function setNeg(sbUrl: string, serviceKey: string, vin: string, entry: Entry, ttl=2592000) {
  const key = `negvin:${vin}`;
  const sb = createClient(sbUrl, serviceKey, { auth: { persistSession: false } });
  await sb.from("api_cache").upsert({
    key, payload: entry, fetched_at: new Date().toISOString(), ttl_seconds: ttl, source: "vin-validate"
  }).select().maybeSingle();
}
