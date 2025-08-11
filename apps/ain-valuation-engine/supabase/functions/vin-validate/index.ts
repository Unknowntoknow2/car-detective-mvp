import { getNeg, setNeg } from "../_shared/negCache.ts";
import { checkIpRateLimit } from "../_shared/rateLimit.ts";

const cors = {
  "Access-Control-Allow-Origin": Deno.env.get("FRONTEND_ORIGINS") ?? "*",
  "Access-Control-Allow-Headers": "authorization, x-request-id, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
};

const SB_URL = Deno.env.get("SUPABASE_URL") ?? `https://${Deno.env.get("PROJECT_REF")}.supabase.co`;
const SERVICE_KEY = Deno.env.get("SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const NEG_TTL = Number(Deno.env.get("NEG_VIN_TTL_SECONDS") ?? "2592000");
const RL_PER_MIN = Number(Deno.env.get("RATE_IP_PER_MIN") ?? "60");

function rid() { try { return crypto.randomUUID(); } catch { return String(Date.now()); } }
const VIN_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/;
const TRANSLIT: Record<string, number> = {A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,J:1,K:2,L:3,M:4,N:5,P:7,R:9,S:2,T:3,U:4,V:5,W:6,X:7,Y:8,Z:9,"0":0,"1":1,"2":2,"3":3,"4":4,"5":5,"6":6,"7":7,"8":8,"9":9};
const WEIGHTS = [8,7,6,5,4,3,2,10,0,9,8,7,6,5,4,3,2];
function computeCheckDigit(vin: string) {
  let sum = 0;
  for (let i=0;i<17;i++){ const v=TRANSLIT[vin[i]]; const w=WEIGHTS[i]; sum += (v??0)*w; }
  const r = sum % 11; return r===10 ? "X" : String(r);
}

serve(async (req: Request) => {
  const id = rid();
  if (req.method === "OPTIONS") return new Response(null, { headers: { ...cors } });

  const ip = (req.headers.get("x-forwarded-for") ?? req.headers.get("cf-connecting-ip") ?? "")
                .split(",")[0].trim() || "0.0.0.0";

  // rate limit first
  const rl = await checkIpRateLimit(SB_URL, SERVICE_KEY, ip, RL_PER_MIN);
  if (!rl.allowed) {
    return new Response(JSON.stringify({ ok:false, code:"429_RATE_LIMIT", message:"Too many requests", meta:{ requestId:id, retryAfterSec:60 }}), {
      status: 429, headers: { "Content-Type":"application/json", "X-Request-Id": id, ...cors }
    });
  }

  let vin: string | undefined;
  try {
    const body = await req.json().catch(() => ({}));
    vin = (body?.vin ?? "").toString();
  } catch {
    return new Response(JSON.stringify({ ok:false, code:"400_INVALID_VIN_FORMAT", message:"Invalid JSON body", meta:{ requestId:id }}), {
      status: 400, headers: { "Content-Type":"application/json", "X-Request-Id": id, ...cors }
    });
  }

  // normalize
  const normalized = (vin ?? "").trim().replace(/\s+/g,"").toUpperCase();

  // neg cache
  const neg = await getNeg(SB_URL, SERVICE_KEY, normalized);
  if (neg) {
    return new Response(JSON.stringify({ ok:false, code:neg.errCode, message:neg.message, meta:{ requestId:id, cacheHit:true }}), {
      status: neg.errCode === "422_CHECK_DIGIT_FAIL" ? 422 : 400,
      headers: { "Content-Type":"application/json", "X-Request-Id": id, ...cors }
    });
  }

  // format check
  if (!VIN_REGEX.test(normalized)) {
    const entry = { errCode:"400_INVALID_VIN_FORMAT", message:"VIN must be 17 chars A-HJ-NPR-Z0-9 (no I,O,Q)" };
    await setNeg(SB_URL, SERVICE_KEY, normalized, entry, NEG_TTL);
    return new Response(JSON.stringify({ ok:false, ...entry, meta:{ requestId:id, cacheHit:false }}), {
      status: 400, headers: { "Content-Type":"application/json", "X-Request-Id": id, ...cors }
    });
  }

  // check digit
  const expected = computeCheckDigit(normalized);
  const actual = normalized[8];
  if (expected !== actual) {
    const entry = { errCode:"422_CHECK_DIGIT_FAIL", message:`Check digit mismatch (expected ${expected}, got ${actual})` };
    await setNeg(SB_URL, SERVICE_KEY, normalized, entry, NEG_TTL);
    return new Response(JSON.stringify({ ok:false, ...entry, meta:{ requestId:id, cacheHit:false }}), {
      status: 422, headers: { "Content-Type":"application/json", "X-Request-Id": id, ...cors }
    });
  }

  // success
  return new Response(JSON.stringify({
    ok: true,
    vin: normalized,
    parts: { wmi: normalized.slice(0,3), vds: normalized.slice(3,9), vis: normalized.slice(9,17) },
    meta: { requestId: id }
  }), { status: 200, headers: { "Content-Type":"application/json", "X-Request-Id": id, ...cors }});
});
