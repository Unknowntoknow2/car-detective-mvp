# 📝 24h Canary Observation Log Template

## Usage Instructions

1. At each checkpoint (T+6h, T+12h, T+18h, T+24h):
   - Run `./canary-checkpoint.sh`
   - Copy results into the table below
   - Fill in Notes column with observations

2. Final Decision (T+24h):
   - ✅ **GO** → Proceed to Stage 3 full rollout
   - ❌ **NO-GO** → Execute rollback (`USE_AIN_VALUATION=false`)

---

## Canary Observation Table

| Time  | OK Rate | FB Rate | P95 (ms) | Decision | Notes |
|-------|---------|---------|----------|----------|-------|
| T+6h  |         |         |          |          |       |
| T+12h |         |         |          |          |       |
| T+18h |         |         |          |          |       |
| T+24h |         |         |          |          |       |

---

## Notes Guidelines

For each checkpoint, record:
- **Error Distribution**: timeout vs network vs 5xx ratios
- **User Feedback**: support tickets or complaints (if any)
- **Performance Trends**: latency stability, spikes, or improvements
- **Anomalies**: any unusual patterns in telemetry
- **CORS/Auth**: any authentication or cross-origin issues

---

## SLA Targets (Reminder)

- ✅ **OK Rate**: ≥ 99%
- ✅ **Fallback Rate**: ≤ 1%
- ✅ **P95 Latency**: ≤ 1500ms

---

## Example Completed Log

| Time  | OK Rate | FB Rate | P95 (ms) | Decision | Notes             |
|-------|---------|---------|----------|----------|-------------------|
| T+6h  | 99.5%   | 0.8%    | 1280     | GO       | Clean, stable     |
| T+12h | 99.2%   | 1.0%    | 1340     | GO       | No complaints     |
| T+18h | 99.4%   | 0.9%    | 1295     | GO       | Peak traffic OK   |
| T+24h | 99.3%   | 0.7%    | 1310     | GO       | All green metrics |

---

## Archive Instructions

After completion:
1. Save this log as `canary-observation-log-YYYY-MM-DD.md`
2. Move to `docs/rollouts/ain/` directory
3. Reference in Stage 2→3 transition documentation