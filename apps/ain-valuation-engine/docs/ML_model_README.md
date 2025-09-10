
# ML Model README

This document describes the ML/LLM layer for the AIN Valuation Engine.

## Launch Checklist

- [ ] All tests in /tests_ml/ pass (feature contract, pipeline, inference, SHAP, LLM, drift, latency, golden set)
- [ ] Model is registered in MLflow and promoted to Production
- [ ] SHAP global plot and last drift report are available in S3
- [ ] Rollback plan tested: set MODEL_URI to previous version and reload
- [ ] SLAs: p95 latency < 200ms, golden set pass rate ≥ 90%, drift monitor green

## Rollback Plan

To revert to a previous model version, set the environment variable:

	MODEL_URI=.../previous_model_version

and reload the API service. All inference will use the previous model immediately.
