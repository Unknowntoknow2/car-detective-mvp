# 🚀 AIN Valuation API Rollout – Master Runbook

## Stage 1 — Env Setup

Set in **Lovable → Project Settings → Environment**:

```env
USE_AIN_VALUATION=true
VITE_AIN_VALUATION_URL=https://api.ain.ai/v1
VITE_AIN_API_KEY=<scoped key>
VITE_AIN_TIMEOUT_MS=30000
VITE_FEATURE_AUDIT=1
```

✅ Activates AIN API with timeout, telemetry, fallback.

---

## Stage 2 — Canary (10% traffic, 24h)

**Smoke Test**

```bash
curl -X POST https://api.ain.ai/v1/valuation \
  -H "Authorization: Bearer $VITE_AIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"vin":"WBAFA5C58DD396767","make":"Toyota","model":"Camry","year":2020,"mileage":50000,"condition":"good","zip":"90210"}'
```

**Monitor**

* Browser console: `ain.ok | ain.err | ain.latency.ms | ain.fallback.used`
* Logs: `tail -f logs | grep "ain\."`

**SLA Targets**

* ✅ ok\_rate ≥ 99%
* ✅ p95 latency ≤ 1500ms
* ✅ fb\_rate ≤ 1%

**Checkpoint Script**

```bash
./canary-checkpoint.sh
# Outputs OK, ERR, FB, p95, DECISION
```

**Observation Log**

| Time | OK Rate | FB Rate | P95 | Decision | Notes |
| ---- | ------- | ------- | --- | -------- | ----- |
| T+6h |         |         |     |          |       |
| T+12h|         |         |     |          |       |
| T+18h|         |         |     |          |       |
| T+24h|         |         |     |          |       |

**Rollback**
→ Flip `USE_AIN_VALUATION=false` (30s, no redeploy).

---

## Stage 3 — Full Rollout (100% traffic)

* Preconditions: 24h canary all GO
* Switch: all traffic through AIN
* Monitor first 48h with checkpoint script
* ✅ Success = 48h stable within SLA
* ❌ Failure = Flip rollback flag

---

## Stage 4 — Legacy Off-Ramp

**Phase 1 (Quarantine)**

* Move `realValuationEngine` → `/legacy/`
* Add ESLint guard:

```json
"no-restricted-imports": [
  "error",
  { "paths": [{
    "name": "@/services/valuation/realValuationEngine",
    "message": "❌ Legacy engine is deprecated."
  }]}
]
```

**Phase 2 (Removal)**

* After 2 stable releases, delete legacy engine
* Update docs: only `calculateUnifiedValuation` remains

**Rollback Insurance**

* Keep flag rollback until removal complete

---

## ✅ Success Definition

* SLA met: ok\_rate ≥ 99%, p95 ≤ 1500ms, fb\_rate ≤ 1%
* 48h stable production
* Canary + rollout logs archived
* Legacy engine removed after stability

---

**One runbook. Four stages. Full lifecycle. Zero surprises.**