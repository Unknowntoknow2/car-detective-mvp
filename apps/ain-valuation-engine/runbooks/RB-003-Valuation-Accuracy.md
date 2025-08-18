# Runbook RB-003: Valuation Accuracy Degradation

## Symptoms
- SLO dashboard: MAPE > 8% (market) or > 12% (fallback)
- User or partner reports of inaccurate valuations

## Immediate Actions
1. Review recent model/weights changes
2. Check for data drift or missing features
3. Validate input completeness and outlier filtering
4. Roll back to previous model/weights if needed

## Mitigation
- Retrain or recalibrate model if persistent
- Communicate to stakeholders
- Update documentation/tests
