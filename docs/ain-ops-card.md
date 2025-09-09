# 📋 AIN Integration – Master Ops Card (One Page)

## Stage 1 – Env Setup

```env
USE_AIN_VALUATION=true
VITE_AIN_VALUATION_URL=https://api.ain.ai/v1
VITE_AIN_API_KEY=[prod-key]
VITE_AIN_TIMEOUT_MS=30000
VITE_FEATURE_AUDIT=1
```

✅ Flip flag enables AIN API  
✅ Audit telemetry active (`ain.ok`, `ain.err`, `ain.latency.ms`, `ain.fallback.used`)

---

## Stage 2 – Canary (10% Traffic, 24h)

**Smoke Test**

```bash
curl -X POST $VITE_AIN_VALUATION_URL/valuation \
  -H "Authorization: Bearer $VITE_AIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"vin":"WBAFA5C58DD396767","year":2020,"make":"Toyota","model":"Camry","mileage":50000,"condition":"good","zip":"90210"}'
```

**Checkpoint Script**

```bash
./canary-checkpoint.sh
# Outputs: OK, ERR, FB, P95, DECISION
```

**SLA Targets**

* ✅ ok\_rate ≥ 99%
* ✅ fb\_rate ≤ 1%
* ✅ p95 ≤ 1500ms

**Rollback**: `USE_AIN_VALUATION=false` (30s, no redeploy)

---

## Stage 3 – Full Rollout

* Preconditions: 24h canary all GO
* Switch to 100% traffic
* Monitor 48h with checkpoint script
* ✅ Success = stable SLA for 48h
* ❌ Failure = rollback flag

---

## Stage 4 – Legacy Off-Ramp

* Move `realValuationEngine` → `/legacy/`
* ESLint guard to block imports:

```json
"no-restricted-imports": ["error", {
  "paths": [{
    "name": "@/services/valuation/realValuationEngine",
    "message": "❌ Legacy engine is deprecated."
  }]
}]
```

* Remove legacy after 2 stable releases
* Keep rollback flag until removal complete

---

## ✅ Success Definition

* SLA: ok ≥ 99%, fb ≤ 1%, p95 ≤ 1500ms
* 48h stable full rollout
* Canary + rollout logs archived
* Legacy engine fully removed

---

⚡ **One page. Four stages. Zero surprises.**