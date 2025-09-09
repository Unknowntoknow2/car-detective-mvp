# 📝 24h Canary Observation Log - EXAMPLE

## Usage Instructions

This is a **sample filled log** showing what T+6h checkpoint data looks like.
Use this as a reference when filling out your actual `canary-observation-log.md`.

---

## Canary Observation Table (Sample Data)

| Time  | OK Rate | FB Rate | P95 (ms) | Decision | Notes |
|-------|---------|---------|----------|----------|-------|
| T+6h  | 99.5%   | 0.8%    | 1280     | GO       | Clean startup, no auth errors, 3 timeouts out of 385 calls |
| T+12h | 99.2%   | 1.2%    | 1340     | GO       | Stable performance, 1 user support ticket (unrelated) |
| T+18h | 99.4%   | 0.9%    | 1295     | GO       | Peak traffic handled well, p95 under target |
| T+24h | 99.3%   | 0.7%    | 1310     | **GO**   | Final decision: All SLAs met → Stage 3 Full Rollout |

---

## Sample Checkpoint Output

```bash
$ ./canary-checkpoint.sh
🕒 Canary Checkpoint: Mon Sep  9 18:00:01 UTC 2025
📊 Analyzing last 1000 log entries...
✅ OK: 980 | ❌ ERR: 5 | 🔄 FB: 15
📈 Rates: OK=99.5% FB=0.8% | P95=1280ms
🚦 DECISION: GO
```

---

## Sample Notes Examples

**T+6h Notes**: "Clean startup, no auth errors, 3 timeouts out of 385 calls"
- Error distribution: 3 timeouts, 2 network errors
- No CORS issues detected
- Browser console showing steady `ain.ok` events

**T+12h Notes**: "Stable performance, 1 user support ticket (unrelated)"
- Performance trend stable (p95 within 60ms of T+6h)
- Support ticket was about UI, not valuation accuracy
- Fallback rate slightly up but within tolerance

**T+24h Notes**: "Final decision: All SLAs met → Stage 3 Full Rollout"
- Consistent performance across entire 24h window
- No red-light incidents triggered
- Ready for 100% traffic rollout

---

## Decision Rationale

✅ **GO Criteria Met**:
- OK Rate: 99.3% (target: ≥99%) ✓
- FB Rate: 0.7% (target: ≤1%) ✓  
- P95 Latency: 1310ms (target: ≤1500ms) ✓
- No sustained outages or user complaints
- Stable trend across all checkpoints

**Result**: Proceed to Stage 3 Full Rollout