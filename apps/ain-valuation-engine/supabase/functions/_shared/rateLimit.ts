import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export async function checkIpRateLimit(sbUrl: string, serviceKey: string, ip: string, limit=60) {
  const sb = createClient(sbUrl, serviceKey, { auth: { persistSession: false } });
  const bucket = new Date().toISOString().slice(0,16); // YYYY-MM-DDTHH:MM
  const key = `rl:vin-validate:${ip}:${bucket}`;
  const { data } = await sb.from("api_cache")
    .select("payload,fetched_at,ttl_seconds").eq("key", key).maybeSingle();

  let count = 0;
  if (data && data.payload?.count) count = Number(data.payload.count) || 0;
  count += 1;

  await sb.from("api_cache").upsert({
    key,
    payload: { count },
    fetched_at: new Date().toISOString(),
    ttl_seconds: 180, // 3 minutes window
    source: "rate-limit"
  });

  return { allowed: count <= limit, count, limit, key };
}
