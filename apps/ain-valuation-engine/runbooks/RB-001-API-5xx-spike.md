# Runbook RB-001: Valuation API 5xx Spike

## Symptoms
- CloudWatch alarm: 5xx error rate > 1% for 5m
- PagerDuty/SNS alert
- Users report errors or degraded service

## Immediate Actions
1. Check API Gateway and Lambda logs for error patterns
2. Correlate with recent deploys, config/feature flag changes
3. Check dependency health (vPIC, market fetcher, DB)
4. If external API is down, ensure fallback logic is engaging
5. If PHOTO_AI/ML_REGRESSOR is enabled, consider disabling via feature flag
6. Roll back recent deploy if needed

## Mitigation
- Flip feature flags to disable non-critical features
- Communicate status to stakeholders
- Monitor for recovery

## Postmortem
- Root cause analysis
- Update tests/alerts if needed
