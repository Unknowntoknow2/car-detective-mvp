# AIN API Staging Validation Checklist

## Pre-flight Setup

### Environment Variables (Set in Lovable Project Settings)
```
USE_AIN_VALUATION=true
VITE_AIN_VALUATION_URL=https://api.ain.ai
VITE_AIN_API_KEY=<your-key>
VITE_AIN_TIMEOUT_MS=30000
VITE_FEATURE_AUDIT=1
```

### CORS Verification
- Confirm AIN API allowlist includes your staging origin
- Test preflight OPTIONS request manually if needed

## Smoke Tests (Manual Validation)

### 1. VIN Valuation Flow
- [ ] Navigate to main VIN input form
- [ ] Enter test VIN: `WBAFA5C58DD396767`
- [ ] Verify value ≥ $500 with confidence > 0
- [ ] Check console for `ain.ok` telemetry

### 2. Follow-up Submission  
- [ ] Complete initial valuation
- [ ] Submit follow-up form with corrections
- [ ] Verify re-valuation occurs without error
- [ ] UI stays consistent through updates

### 3. Correction Flow
- [ ] Access correction interface
- [ ] Modify vehicle details (mileage, condition)
- [ ] Verify valuation updates correctly
- [ ] Price range renders properly

### 4. Admin Test Component
- [ ] Navigate to test component (if accessible)
- [ ] Run valuation with test data
- [ ] Verify value and price range display
- [ ] Check raw JSON output matches expected shape

## Failure Drill Tests

### Invalid API Key Test
```bash
# Temporarily set invalid key in env
USE_AIN_VALUATION=true
VITE_AIN_API_KEY=invalid_key_test
```
- [ ] Run valuation flow
- [ ] Verify fallback to local engine
- [ ] Check console for `ain.err` with reason: 'network'

### Timeout Test  
```bash
# Set very short timeout
VITE_AIN_TIMEOUT_MS=100
```
- [ ] Run valuation (should timeout)
- [ ] Verify fallback triggered
- [ ] Check console for `ain.err` with reason: 'timeout'

### Server Error Simulation
- [ ] Monitor network tab for 5xx responses (if they occur)
- [ ] Verify graceful fallback behavior
- [ ] Check error logging and telemetry

## Metrics Monitoring

Monitor browser console for telemetry events:

### Success Metrics
- `ain.ok` - successful API calls with latency_ms
- `ain.latency.ms` - timing data (target p95 ≤ 1500ms)

### Error Metrics  
- `ain.err` - failed calls with reason and latency_ms
- `ain.fallback.used` - fallback usage (target ≤ 1%)

### Target SLAs
- API success rate ≥ 99%
- p95 latency ≤ 1500ms
- Fallback usage ≤ 1%

## CI Integration

Add to your CI pipeline:
```yaml
- name: Check import guard
  run: chmod +x scripts/check-import-guard.sh && ./scripts/check-import-guard.sh
```

## Go/No-Go Decision Matrix

### GO Criteria ✅
- [ ] All smoke tests pass
- [ ] Fallback scenarios work correctly  
- [ ] Metrics within SLA targets
- [ ] No console errors unrelated to test failures
- [ ] UI remains responsive during API calls

### NO-GO Criteria ❌
- [ ] Any smoke test fails
- [ ] Fallback doesn't trigger on failures
- [ ] p95 latency > 1500ms consistently
- [ ] Fallback rate > 5%
- [ ] UI breaks or becomes unresponsive

## Rollout Strategy

### Stage 1: Staging Validation (Current)
- Enable AIN for staging environment
- Run full test suite
- Monitor for 24h minimum

### Stage 2: Production Canary (Next)  
- Enable for 10% of production traffic
- Monitor metrics for 24h
- Compare against baseline

### Stage 3: Full Rollout
- If canary metrics are clean, enable for 100%
- Continue monitoring

### Rollback Plan
```bash
# Immediate rollback - no code changes needed
USE_AIN_VALUATION=false
```

## Success Definition

✅ **Ready for Production** when:
- All staging tests pass consistently
- Fallback rate < 1% over 24h period
- No user-facing issues reported
- Telemetry shows expected performance characteristics
- Single entry point architecture verified via CI guard