# Runbook RB-002: Valuation Fallback Triggered

## Symptoms
- High rate of fallback valuations (method = 'fallback')
- SLO dashboard: % fallback > normal baseline
- User reports of less precise valuations

## Immediate Actions
1. Check recent comp data ingestion and freshness
2. Validate market fetcher and S3 data pipeline health
3. Review fallback logic and thresholds
4. Communicate to support if user impact is high

## Mitigation
- Adjust fallback radius/config if needed
- Trigger manual comp data refresh if pipeline lagging
- Document incident and monitor
